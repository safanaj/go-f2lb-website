package v2

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"maps"
	reflect "reflect"
	"slices"
	"strconv"
	"strings"
	sync "sync"
	"time"

	"golang.org/x/crypto/blake2b"
	durationpb "google.golang.org/protobuf/types/known/durationpb"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
	wrapperspb "google.golang.org/protobuf/types/known/wrapperspb"

	"github.com/hako/durafmt"

	koios "github.com/cardano-community/koios-go-client/v4"

	"github.com/safanaj/cardano-go"
	"github.com/safanaj/cardano-go/bech32/prefixes"
	"github.com/safanaj/cardano-go/cose"
	"github.com/safanaj/cardano-go/crypto"

	"github.com/safanaj/go-f2lb/pkg/ccli"
	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/f2lb_members"
	"github.com/safanaj/go-f2lb/pkg/libsodium"
	"github.com/safanaj/go-f2lb/pkg/logging"
	"github.com/safanaj/go-f2lb/pkg/txbuilder"
	"github.com/safanaj/go-f2lb/pkg/utils"
	"github.com/safanaj/go-f2lb/pkg/webserver"

	connect "connectrpc.com/connect"
)

type ControlServiceRefresher interface {
	SetRefresherChannel(chan string)
	GetRefresherChannel() chan string
	StartRefresher(context.Context)
}

type streamMap struct {
	*sync.Map
	mu sync.RWMutex
}

func (m *streamMap) loadStreams_nolock(key string) ([]*connect.ServerStream[ControlMsg], bool) {
	v, ok := m.Load(key)
	if v == nil {
		return nil, false
	}
	return v.([]*connect.ServerStream[ControlMsg]), ok
}
func (m *streamMap) getStreams_nolock(key string) []*connect.ServerStream[ControlMsg] {
	v, _ := m.loadStreams_nolock(key)
	return v
}

func (m *streamMap) LoadStreams(key string) ([]*connect.ServerStream[ControlMsg], bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.loadStreams_nolock(key)
}

func (m *streamMap) GetStreams(key string) []*connect.ServerStream[ControlMsg] {
	v, _ := m.LoadStreams(key)
	return v
}

func (m *streamMap) AddStream(key string, value *connect.ServerStream[ControlMsg]) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.Store(key, append(m.getStreams_nolock(key), value))
}

func (m *streamMap) DeleteStream(key string, value *connect.ServerStream[ControlMsg]) {
	m.mu.Lock()
	defer m.mu.Unlock()
	found := false
	remaining := slices.Collect(func(yield func(*connect.ServerStream[ControlMsg]) bool) {
		for _, s := range m.getStreams_nolock(key) {
			if s == value {
				found = true
				continue
			}
			if !yield(s) {
				return
			}
		}
	})
	if !found {
		return
	}
	if len(remaining) == 0 {
		m.Delete(key)
		return
	}
	m.Store(key, remaining)
}

type controlServiceServer struct {
	UnimplementedControlMsgServiceHandler

	webCtx    context.Context
	ctrl      f2lb_gsheet.Controller
	refreshCh chan string

	uuid2stream *streamMap
	// uuid2stream map[string]*connect.ServerStream[ControlMsg]
	// uuid2verifiedAuthn map[string]bool

	adminPools map[string]any

	payer *txbuilder.Payer

	sm webserver.SessionManager
}

var (
	_ ControlMsgServiceHandler = &controlServiceServer{}
	_ ControlServiceRefresher  = &controlServiceServer{}
)

func NewControlServiceHandler(
	webCtx context.Context,
	c f2lb_gsheet.Controller, adminPools []string,
	payer *txbuilder.Payer, sm webserver.SessionManager,
) ControlMsgServiceHandler {
	return &controlServiceServer{
		webCtx: webCtx,
		ctrl:   c,
		adminPools: maps.Collect(func(yield func(string, any) bool) {
			for _, p := range adminPools {
				if !yield(strings.TrimSpace(p), struct{}{}) {
					return
				}
			}
		}),
		payer: payer,
		sm:    sm,
	}
}

func (c *controlServiceServer) SetRefresherChannel(ch chan string) {
	c.refreshCh = ch
}

func (c *controlServiceServer) GetRefresherChannel() chan string {
	return c.refreshCh
}

func (c *controlServiceServer) Refresh(ctx context.Context, unused *connect.Request[emptypb.Empty]) (*connect.Response[emptypb.Empty], error) {
	c.sm.UpdateExpirationByContext(ctx)
	c.ctrl.Refresh()
	if c.payer != nil {
		c.payer.Refresh()
	}
	return connect.NewResponse(&emptypb.Empty{}), nil
}

func (s *controlServiceServer) RefreshMember(ctx context.Context, req *connect.Request[StakeAddr]) (*connect.Response[MemberOrEmpty], error) {
	member := req.Msg
	s.sm.UpdateExpirationByContext(ctx)
	if sp := s.ctrl.GetStakePoolSet().Get(member.GetStakeAddress()); sp != nil {
		s.ctrl.GetAccountCache().Add(sp.MainStakeAddress())
		s.ctrl.GetPoolCache().Add(sp.PoolIdBech32())

		if err := s.ctrl.GetAccountCache().RefreshMember(sp.MainStakeAddress()); err != nil {
			return nil, err
		}
		sp = s.ctrl.GetStakePoolSet().Get(member.GetStakeAddress())
		return connect.NewResponse(&MemberOrEmpty{MemberOrEmpty: &MemberOrEmpty_Member{Member: newMemeberFromStakePool(sp)}}), nil
	}
	return connect.NewResponse(&MemberOrEmpty{MemberOrEmpty: &MemberOrEmpty_Empty{}}), nil
}

func (s *controlServiceServer) RefreshAllMembers(ctx context.Context, unused *connect.Request[emptypb.Empty]) (*connect.Response[emptypb.Empty], error) {
	s.sm.UpdateExpirationByContext(ctx)
	for _, sp := range s.ctrl.GetStakePoolSet().StakePools() {
		go func(saddr, poolid string) {
			s.ctrl.GetAccountCache().Add(saddr)
			s.ctrl.GetPoolCache().Add(poolid)
		}(sp.MainStakeAddress(), sp.PoolIdBech32())
	}
	return connect.NewResponse(&emptypb.Empty{}), nil
}

func (s *controlServiceServer) StartRefresher(ctx context.Context) {
	s.uuid2stream = &streamMap{Map: new(sync.Map)}
	ticker := time.NewTicker(120 * time.Second)

	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			case t := <-ticker.C:
				s.sendControlMsgToAll(t, ControlMsg_NONE)
			case ruuid, ok := <-s.refreshCh:
				if !ok {
					return
				}
				if ruuid == "ALL" {
					s.sendControlMsgToAll(time.Now(), ControlMsg_REFRESH)
				} else if streams, ok := s.uuid2stream.LoadStreams(ruuid); ok {
					for _, stream := range streams {
						if err := s.sendControlMsg(stream, time.Now(), ControlMsg_NONE, nil); err != nil {
							s.uuid2stream.DeleteStream(ruuid, stream)
						}
					}
				} else {
					fmt.Printf("Wrong ruuid: %s\n", ruuid)
				}
			}
		}
	}()
}

func (s *controlServiceServer) getDataBytesForControlMsg(t time.Time) []byte {
	tips := map[string]uint32{}
	for _, sp := range s.ctrl.GetStakePoolSet().StakePools() {
		if sp.BlockHeight() == 0 {
			continue
		}
		tips[sp.Ticker()] = sp.BlockHeight()
	}

	dataBytes, _ := json.Marshal(map[string]any{
		"cache_ready":              s.ctrl.GetAccountCache().Ready() && s.ctrl.GetPoolCache().Ready(),
		"last_refresh_time":        s.ctrl.GetLastRefreshTime().Format(time.RFC850),
		"epoch_remaining_duration": durafmt.Parse(time.Duration(utils.EpochLength-utils.TimeToSlot(t)) * time.Second).String(),
		"koios_tip_block_height":   s.ctrl.GetKoiosTipBlockHeight(),
		"notes": map[string]string{
			"poolcache_pending":    fmt.Sprintf("%d", s.ctrl.GetPoolCache().Pending()),
			"poolcache_len":        fmt.Sprintf("%d", s.ctrl.GetPoolCache().Len()),
			"poolcache_added":      fmt.Sprintf("%d", s.ctrl.GetPoolCache().AddedItems()),
			"accountcache_pending": fmt.Sprintf("%d", s.ctrl.GetAccountCache().Pending()),
			"accountcache_len":     fmt.Sprintf("%d", s.ctrl.GetAccountCache().Len()),
			"accountcache_added":   fmt.Sprintf("%d", s.ctrl.GetAccountCache().AddedItems()),
			"missing_pools":        strings.Join(s.ctrl.GetPoolCache().GetMissingPoolInfos(), ", "),
			"payer_available":      fmt.Sprintf("%t", s.payer != nil),
		},
		"tips": tips,
	})
	return dataBytes
}

func (s *controlServiceServer) sendControlMsg(stream *connect.ServerStream[ControlMsg], t time.Time, cmsgType ControlMsg_Type, data []byte) error {
	if data == nil {
		data = s.getDataBytesForControlMsg(t)
	}

	cmsg := &ControlMsg{
		Date:  t.Format(time.RFC850),
		Epoch: fmt.Sprintf("%d", utils.TimeToEpoch(t)),
		Slot:  fmt.Sprintf("%d", utils.TimeToSlot(t)),
		Type:  cmsgType,
		Data:  string(data),
	}
	logging.GetLogger().V(5).Info("Sending Control Msg", "stream", stream, "msg", cmsg)
	return stream.Send(cmsg)
}

func (s *controlServiceServer) sendControlMsgToAll(t time.Time, cmsgType ControlMsg_Type) {
	type tuple struct {
		string
		*connect.ServerStream[ControlMsg]
	}
	toDel := []tuple{}
	dataBytes := s.getDataBytesForControlMsg(t)

	defer func() {
		if x := recover(); x != nil {
			logging.GetLogger().Error(fmt.Errorf("run time panic: %v", x), "sendControlMsgToAll crashed")
			s.uuid2stream.mu.RUnlock()
		}
	}()

	s.uuid2stream.mu.RLock()
	s.uuid2stream.Range(func(k, v any) bool {
		streams, ok := v.([]*connect.ServerStream[ControlMsg])
		if !ok {
			return true
		}
		for _, stream := range streams {
			// TODO: manage panic with recover
			if err := s.sendControlMsg(stream, t, cmsgType, dataBytes); err != nil {
				toDel = append(toDel, tuple{k.(string), stream})
			}
		}
		return true
	})
	s.uuid2stream.mu.RUnlock()

	for _, t := range toDel {
		s.uuid2stream.DeleteStream(t.string, t.ServerStream)
	}
}

func (s *controlServiceServer) Control(ctx context.Context, _ *connect.Request[emptypb.Empty], stream *connect.ServerStream[ControlMsg]) error {
	s.sendControlMsg(stream, time.Now(), ControlMsg_REFRESH, nil)
	ruuid, isOk := ctx.Value(webserver.IdCtxKey).(string)
	if isOk {
		s.uuid2stream.AddStream(ruuid, stream)
	} else {
		fmt.Printf("Not UUID in stream Context: %v\n", ctx.Value(webserver.IdCtxKey))
	}

	select {
	case <-ctx.Done():
		logging.GetLogger().V(2).Info("Control exiting", "ruuid", ruuid)
		s.uuid2stream.DeleteStream(ruuid, stream)
		return nil
	case <-s.webCtx.Done():
		logging.GetLogger().V(2).Info("Web server exiting", "ruuid", ruuid)
		s.uuid2stream.DeleteStream(ruuid, stream)
		return nil
	}
}

func (s *controlServiceServer) Auth(ctx context.Context, req *connect.Request[StakeAddr]) (*connect.Response[User], error) {
	saddr := req.Msg
	saddr_ := saddr.GetStakeAddress()

	logging.GetLogger().Info("Auth", "saddr", saddr, "req", req)

	if saddr_ == "" {
		return nil, fmt.Errorf("Bad Request: Empty stake address")
	}

	user := &User{}
	ruuid, isOk := ctx.Value(webserver.IdCtxKey).(string)
	if isOk {
		s.sm.UpdateExpiration(ruuid)
		s.sm.UpdateConnectedWallet(ruuid, saddr_)
		sd, ok := s.sm.Get(ruuid)
		// fmt.Printf("Auth: sd: %+v - ok: %t\n", sd, ok)
		if ok {
			user.IsVerified = sd.VerifiedAccount != ""
		}
	}

	if sp := s.ctrl.GetStakePoolSet().Get(saddr_); sp != nil && sp.Ticker() != "" {
		// check admin permission
		_, isAdmin := s.adminPools[sp.Ticker()]

		// found just return this
		user.Type = User_SPO
		user.StakeKey = sp.StakeKeys()[0]
		user.StakeAddress = sp.MainStakeAddress()
		s.sm.UpdateMemberAccount(ruuid, user.StakeAddress)
		user.Member = newMemeberFromStakePool(sp)
		user.IsAdmin = isAdmin
		user.DelegatedPool = sp.DelegatedPool()
		logging.GetLogger().Info("Auth returning", "user", user)
		return connect.NewResponse(user), nil
	}

	delegPool, _, _ := s.ctrl.GetKoiosClient().GetStakeAddressInfo(saddr_)

	supporter := (*f2lb_gsheet.Supporter)(nil)
	for _, r := range s.ctrl.GetSupportersRecords() {
		for _, sa := range r.StakeAddrs {
			if sa == saddr_ {
				supporter = r
				break
			}
		}
		if supporter != nil {
			break
		}
	}
	if supporter != nil {
		// found just return this
		user.Type = User_SUPPORTER
		user.StakeKey = supporter.StakeKeys[0]
		user.StakeAddress = supporter.StakeAddrs[0]
		user.Supporter = &Supporter{DiscordId: supporter.DiscordName}
		user.DelegatedPool = delegPool
		logging.GetLogger().Info("Auth returning", "user", user)
		return connect.NewResponse(user), nil
	}

	user.Type = User_VISITOR
	user.StakeAddress = saddr_
	user.DelegatedPool = delegPool
	logging.GetLogger().Info("Auth returning", "user", user)
	return connect.NewResponse(user), nil
}

func (s *controlServiceServer) BuildDelegationTx(ctx context.Context, req *connect.Request[Delegation]) (*connect.Response[PartiallySignedTx], error) {
	s.sm.UpdateExpirationByContext(ctx)
	if s.payer == nil {
		return nil, fmt.Errorf("Payer not available")
	}
	deleg := req.Msg
	s.payer.Info("Control.BuildDelegationTx", "deleg", deleg)
	memberTicker := ""
	if sp := s.ctrl.GetStakePoolSet().Get(deleg.GetStakeAddress()); sp != nil && sp.Ticker() != "" {
		memberTicker = sp.Ticker()
	}
	if txHex := s.payer.BuildDelegationTx(
		deleg.GetStakeAddress(), deleg.GetPoolId(),
		memberTicker, deleg.GetUtxoIdHint(),
	); txHex == "" {
		return nil, fmt.Errorf("Unable to build TX")
	} else {
		return connect.NewResponse(&PartiallySignedTx{
			CborHex: txHex,
		}), nil
	}
}

func (s *controlServiceServer) CanceledTx(ctx context.Context, req *connect.Request[TxId]) (*connect.Response[emptypb.Empty], error) {
	s.sm.UpdateExpirationByContext(ctx)
	if s.payer == nil {
		return nil, fmt.Errorf("Payer not available")
	}
	txid := req.Msg
	s.payer.CanceledTx(txid.GetHash())
	return connect.NewResponse(&emptypb.Empty{}), nil
}

func (s *controlServiceServer) SubmittedTx(ctx context.Context, req *connect.Request[TxId]) (*connect.Response[emptypb.Empty], error) {
	s.sm.UpdateExpirationByContext(ctx)
	if s.payer == nil {
		return nil, fmt.Errorf("Payer not available")
	}
	txid := req.Msg
	s.payer.SubmittedTx(txid.GetHash())
	return connect.NewResponse(&emptypb.Empty{}), nil
}

func (s *controlServiceServer) Authn(ctx context.Context, req *connect.Request[AuthnSignature]) (*connect.Response[wrapperspb.BoolValue], error) {
	ruuid, isOk := ctx.Value(webserver.IdCtxKey).(string)
	if !isOk {
		return connect.NewResponse(wrapperspb.Bool(false)), nil
	}

	asig := req.Msg
	msgToVerify, err := cose.NewCOSESign1MessageFromCBORHex(asig.GetSignature())
	if err != nil {
		return connect.NewResponse(wrapperspb.Bool(false)), fmt.Errorf("error parsing cose sign1 message: %v", err)
	}

	key, err := cose.NewCOSEKeyFromCBORHex(asig.GetKey())
	if err != nil {
		return connect.NewResponse(wrapperspb.Bool(false)), fmt.Errorf("error parsing cose key: %v", err)
	}

	verifier, err := cose.NewVerifierFromCOSEKey(key)
	if err != nil {
		return connect.NewResponse(wrapperspb.Bool(false)), fmt.Errorf("error creating verifier: %v", err)
	}

	pkh, err := crypto.PubKey(key.Key.Bytes()).Hash()
	if err != nil {
		return connect.NewResponse(wrapperspb.Bool(false)), fmt.Errorf("error checking public key: %v", err)
	}

	sc, err := cardano.NewKeyCredentialFromHash(pkh)
	if err != nil {
		return connect.NewResponse(wrapperspb.Bool(false)), fmt.Errorf("error checking public key hash for stake credential: %v", err)
	}
	stakeAddr, err := cardano.NewStakeAddress(cardano.Mainnet, sc)
	if err != nil {
		return connect.NewResponse(wrapperspb.Bool(false)), fmt.Errorf("error checking stake address: %v", err)
	}
	if stakeAddr.Bech32() != asig.GetStakeAddress() {
		err := fmt.Errorf("computed stake address: %s differ from passed one: %s",
			stakeAddr.Bech32(), asig.GetStakeAddress())
		return connect.NewResponse(wrapperspb.Bool(false)), err
	}

	switch string(msgToVerify.Payload) {
	case ruuid, stakeAddr.Bech32():
	default:
		err := fmt.Errorf("unexpected signed payload: it is not ruuid: %q neither stake address %q",
			ruuid, stakeAddr.Bech32())
		return connect.NewResponse(wrapperspb.Bool(false)), err
	}

	if err := msgToVerify.Verify(nil, verifier); err != nil {
		return connect.NewResponse(wrapperspb.Bool(false)), err
	}
	s.sm.UpdateExpiration(ruuid)
	s.sm.UpdateVerifiedAccount(ruuid, stakeAddr.Bech32())

	s.refreshCh <- ruuid
	return connect.NewResponse(wrapperspb.Bool(true)), nil
}

func (s *controlServiceServer) Logout(ctx context.Context, _ *connect.Request[emptypb.Empty]) (*connect.Response[emptypb.Empty], error) {
	s.sm.DeleteByContext(ctx)
	return connect.NewResponse(&emptypb.Empty{}), nil
}

func (s *controlServiceServer) CheckAllPools(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[emptypb.Empty], error) {
	unused := connect.NewResponse(req.Msg)
	sd, ok := s.sm.GetByContext(ctx)
	if !ok {
		return unused, fmt.Errorf("No session")
	}
	s.sm.UpdateExpirationByContext(ctx)
	if sd.VerifiedAccount == "" {
		return unused, fmt.Errorf("Not verified")
	}

	if sp := s.ctrl.GetStakePoolSet().Get(sd.VerifiedAccount); sp != nil && sp.Ticker() != "" {
		if _, isAdmin := s.adminPools[sp.Ticker()]; !isAdmin {
			return unused, fmt.Errorf("Not an admin, not allowed")
		}
	} else {
		return unused, fmt.Errorf("Not a member, not allowed")
	}

	p := s.ctrl.GetPinger()
	wg := &sync.WaitGroup{}
	for _, sp := range s.ctrl.GetStakePoolSet().StakePools() {
		wg.Add(1)
		go func(sp f2lb_members.StakePool) {
			defer wg.Done()
			p.CheckPool(sp)
		}(sp)
	}
	wg.Wait()

	return unused, nil
}

func (s *controlServiceServer) GetPoolStats(ctx context.Context, req *connect.Request[PoolTicker]) (*connect.Response[PoolStats], error) {
	pt := req.Msg
	s.sm.UpdateExpirationByContext(ctx)
	sp := s.ctrl.GetStakePoolSet().Get(pt.GetTicker())
	if sp == nil {
		return nil, fmt.Errorf("Unknown pool")
	}
	ps := s.ctrl.GetPinger().GetPoolStats(sp)
	poolStats := &PoolStats{
		HasErrors: ps.HasErrors(),
		Up:        ps.UpAndResponsive(),
		InSync:    ps.InSync().String(),
	}

	for _, e := range ps.Errors() {
		poolStats.Errors = append(poolStats.Errors, e.Error())
	}

	for tgt, stats := range ps.RelayStats() {
		rs := &RelayStats{
			Target:       tgt,
			ResponseTime: durationpb.New(stats.ResponseTime()),
			Status:       stats.Status().String(),
			Tip:          uint32(stats.Tip()),
			InSync:       stats.InSync().String(),
		}
		if stats.Error() != nil {
			rs.Error = stats.Error().Error()
		}
		poolStats.Relays = append(poolStats.Relays, rs)
	}

	return connect.NewResponse(poolStats), nil
}

func (s *controlServiceServer) CheckPool(ctx context.Context, req *connect.Request[PoolBech32IdOrHexIdOrTicker]) (*connect.Response[PoolStats], error) {
	pid := req.Msg
	sd, ok := s.sm.GetByContext(ctx)
	if !ok {
		return nil, fmt.Errorf("No session")
	}
	s.sm.UpdateExpirationByContext(ctx)
	if sd.VerifiedAccount == "" {
		return nil, fmt.Errorf("Not verified")
	}
	if sd.MemberAccount == "" {
		return nil, fmt.Errorf("Not connected")
	}
	if pid.GetIdOrTicker() == "" {
		return nil, fmt.Errorf("Invalid Pool Id")
	}

	sp := s.ctrl.GetStakePoolSet().Get(sd.MemberAccount)
	if sp == nil {
		return nil, fmt.Errorf("Unknown member")
	}
	isMatching := false
	pidOrTicker := pid.GetIdOrTicker()
	if pidOrTicker[:5] == "pool" {
		// bech32
		isMatching = sp.PoolIdBech32() != pidOrTicker
	} else if len(pidOrTicker) > 6 {
		// hex
		isMatching = sp.PoolIdHex() != pidOrTicker
	} else {
		// ticker
		isMatching = sp.Ticker() != pidOrTicker
	}

	if !isMatching {
		return nil, fmt.Errorf("Not the member owner of the pool, not allowed")
	}

	ps := s.ctrl.GetPinger().CheckPool(sp)

	poolStats := &PoolStats{
		HasErrors: ps.HasErrors(),
		Up:        ps.UpAndResponsive(),
		InSync:    ps.InSync().String(),
	}

	for _, e := range ps.Errors() {
		poolStats.Errors = append(poolStats.Errors, e.Error())
	}

	for tgt, stats := range ps.RelayStats() {
		rs := &RelayStats{
			Target:       tgt,
			ResponseTime: durationpb.New(stats.ResponseTime()),
			Status:       stats.Status().String(),
			Tip:          uint32(stats.Tip()),
			InSync:       stats.InSync().String(),
		}
		if stats.Error() != nil {
			rs.Error = stats.Error().Error()
		}
		poolStats.Relays = append(poolStats.Relays, rs)
	}

	return connect.NewResponse(poolStats), nil
}

func (s *controlServiceServer) WhoAmI(ctx context.Context, _ *connect.Request[emptypb.Empty]) (*connect.Response[User], error) {
	user := &User{}
	ruuid, isOk := ctx.Value(webserver.IdCtxKey).(string)
	if isOk {
		s.sm.UpdateExpiration(ruuid)
		sd, ok := s.sm.Get(ruuid)
		if ok {
			user.IsVerified = sd.VerifiedAccount != ""
			if sd.MemberAccount == "" {
				return connect.NewResponse(user), nil
			}
			if sp := s.ctrl.GetStakePoolSet().Get(sd.MemberAccount); sp != nil && sp.Ticker() != "" {
				// check admin permission
				_, isAdmin := s.adminPools[sp.Ticker()]
				user.Type = User_SPO
				user.StakeKey = sp.StakeKeys()[0]
				user.StakeAddress = sp.MainStakeAddress()
				user.Member = newMemeberFromStakePool(sp)
				user.IsAdmin = isAdmin
				user.DelegatedPool = sp.DelegatedPool()
			}
		}
	}
	return connect.NewResponse(user), nil
}

func getNonce(ctx context.Context, kc *koios.Client, delta int) (string, error) {
	epoch := koios.EpochNo(int(utils.CurrentEpoch()) - 1)
	opts := kc.NewRequestOptions()
	opts.QuerySet("select", "nonce")
	r, err := kc.GetEpochParams(ctx, epoch, opts)
	if err != nil {
		return "", fmt.Errorf("Error getting info from koios: %w\n", err)
	}
	return r.Data[0].Nonce, nil
}

func (s *controlServiceServer) NoncePrev(ctx context.Context, _ *connect.Request[emptypb.Empty]) (*connect.Response[wrapperspb.StringValue], error) {
	nonce, err := getNonce(ctx, s.ctrl.GetKoiosClient().GetKoiosClient(), -1)
	if err != nil {
		return nil, err
	}
	return connect.NewResponse(wrapperspb.String(nonce)), nil
}

func (s *controlServiceServer) NonceCurrent(ctx context.Context, _ *connect.Request[emptypb.Empty]) (*connect.Response[wrapperspb.StringValue], error) {
	nonce, err := getNonce(ctx, s.ctrl.GetKoiosClient().GetKoiosClient(), 0)
	if err != nil {
		return nil, err
	}
	return connect.NewResponse(wrapperspb.String(nonce)), nil
}

const slotInEpochForNextNonce = 302400

func (s *controlServiceServer) NonceNext(ctx context.Context, _ *connect.Request[emptypb.Empty]) (*connect.Response[wrapperspb.StringValue], error) {
	curSlotInEpoch := int(utils.CurrentSlotInEpoch())
	if curSlotInEpoch < slotInEpochForNextNonce {
		return nil, fmt.Errorf("New epoch nonce not yet computable, will be available in %v",
			time.Duration(time.Second*time.Duration(slotInEpochForNextNonce-curSlotInEpoch)))
	}
	out, err := ccli.DoCommand(ctx, "query protocol-state --mainnet")
	if err != nil {
		return nil, fmt.Errorf("Error getting info from cardano-node: %w", err)
	}
	res := map[string]any{}
	err = json.Unmarshal([]byte(out), &res)
	if err != nil {
		return nil, fmt.Errorf("Error decoding info from cardano-node: %w", err)
	}
	cn := res["candidateNonce"].(map[string]any)["contents"].(string)
	lebn := res["lastEpochBlockNonce"].(map[string]any)["contents"].(string)
	eta0_, err := hex.DecodeString(cn + lebn)
	if err != nil {
		return nil, fmt.Errorf("Error decoding info from cardano-node: %w", err)
	}
	hash, err := blake2b.New(32, nil)
	if err != nil {
		return nil, fmt.Errorf("Error computing next nonce: %w", err)
	}
	_, err = hash.Write(eta0_)
	if err != nil {
		return nil, fmt.Errorf("Error computing next nonce: %w", err)
	}
	return connect.NewResponse(wrapperspb.String(hex.EncodeToString(hash.Sum(nil)))), nil
}

type sigType string

const (
	plainSigType        sigType = ""
	minimalSigType      sigType = "minimal"
	minimalCip22SigType sigType = "minimal-cip22" // to support cncli
	cip8SigType         sigType = "cip8"
	cip22SigType        sigType = "cip22" // to support cncli
	cip30SigType        sigType = "cip30"
)

type tipPayload struct {
	Type      sigType        `json:"type"`
	Pool      string         `json:"pool"`
	Signature string         `json:"signature"`
	PublicKey string         `json:"publicKey"`
	Data      map[string]any `json:"data"`
}

func (s *controlServiceServer) ReportTip(ctx context.Context, req *connect.Request[TipPayload]) (*connect.Response[emptypb.Empty], error) {
	var (
		useSodium       bool
		vKey            []byte
		tip             uint32
		blockNoAsString string
	)
	tp := req.Msg
	payload := tipPayload{
		Type:      sigType(tp.GetType()),
		Pool:      tp.GetPool(),
		Signature: tp.GetSignature(),
		PublicKey: tp.GetPublicKey(),
		Data:      tp.GetData().AsMap(),
	}

	if payload.Signature == "" {
		return nil, fmt.Errorf("empty signature")
	}
	if payload.PublicKey == "" {
		return nil, fmt.Errorf("empty publicKey")
	}
	if payload.Pool == "" {
		return nil, fmt.Errorf("empty pool identifier")
	}

	pool, ok := s.ctrl.GetPoolCache().Get(payload.Pool)
	if !ok {
		return nil, fmt.Errorf("unknown pool")
	}

	if _, ok := payload.Data["blockNo"]; !ok {
		return nil, fmt.Errorf("missing blockNo")
	}

	switch payload.Type {
	case minimalSigType, minimalCip22SigType, cip30SigType:
		// this is ok
	case plainSigType, cip22SigType:
		// we need also slotNo and blockHash
		if _, ok := payload.Data["slotNo"]; !ok {
			return nil, fmt.Errorf("missing slotNo")
		}
		if _, ok := payload.Data["blockHash"]; !ok {
			return nil, fmt.Errorf("missing blockHash")
		}
	case cip8SigType:
		return nil, fmt.Errorf("we don't support yet %s signature", payload.Type)
	default:
		return nil, fmt.Errorf("unknown signature type")
	}

	sigBytes, err := hex.DecodeString(payload.Signature)
	if err != nil {
		return nil, fmt.Errorf("invalid signature: " + err.Error())
	}

	// compute the posted tip value
	switch v := payload.Data["blockNo"].(type) {
	case string:
		if strings.Contains(v, ".") {
			return nil, fmt.Errorf("blockNo is not a 32bit unsigned integer: cannot contains dot (.)")
		}
		blockNoAsString = v
	case float64:
		fs := fmt.Sprintf("%.0f", v)
		if fi, err := strconv.ParseFloat(fs, 64); err != nil || fi != v {
			errMsg := "blockNo is not a 32bit unsigned integer: "
			if err != nil {
				errMsg = errMsg + err.Error()
			} else {
				errMsg = errMsg + fmt.Sprintf("%v", v)
			}
			return nil, fmt.Errorf(errMsg)
		}
		blockNoAsString = fs
	default:
		return nil, fmt.Errorf("blockNo is not a 32bit unsigned integer")
	}

	if n, err := strconv.ParseUint(blockNoAsString, 10, 32); err != nil {
		return nil, fmt.Errorf("blockNo is not a 32bit unsigned integer: " + err.Error())
	} else {
		tip = uint32(n)
	}

	// check for valid public key
	invalidPubKeyErr := map[string]string{"error": "invalid public key"}
	if strings.HasPrefix(payload.PublicKey, "5820") && len(payload.PublicKey) == 68 {
		// we assume that the public key is a CBORHex of 32 bytes,
		// and assume that in this case it is the VRF public key
		useSodium = true
		vrfVKeyData, err := cardano.GetBytesFromCBORHex(payload.PublicKey)
		if err != nil || len(vrfVKeyData) != 32 {
			return nil, fmt.Errorf(invalidPubKeyErr["error"])
		}
		vKey = vrfVKeyData
	} else if strings.HasPrefix(payload.PublicKey, "5840") && len(payload.PublicKey) == 132 {
		// assume this is a stake extended public key as cbor hex of 64 bytes,
		// this would contains the chain code but we are ignoring it
		data, err := cardano.GetBytesFromCBORHex(payload.PublicKey)
		if err != nil || len(data) != 64 {
			return nil, fmt.Errorf(invalidPubKeyErr["error"])
		}
		vKey = crypto.XPubKey(data).PubKey()[:]
	} else if strings.HasPrefix(payload.PublicKey, "a42006215820") &&
		strings.HasSuffix(payload.PublicKey, "01010327") &&
		payload.Type == cip30SigType {
		key, err := cose.NewCOSEKeyFromCBORHex(payload.PublicKey)
		if err != nil {
			return nil, fmt.Errorf(invalidPubKeyErr["error"])
		}
		vKey = key.Key.Bytes()
	} else if strings.HasPrefix(payload.PublicKey, prefixes.StakePublicKey) {
		// public key has stake_vk prefix
		pubKey, err := crypto.NewPubKey(payload.PublicKey)
		if err != nil {
			return nil, fmt.Errorf(invalidPubKeyErr["error"])
		}
		vKey = pubKey[:]
	} else if strings.HasPrefix(payload.PublicKey, prefixes.StakeExtendedPublicKey) {
		// public key has stake_xvk prefix
		xpubKey, err := crypto.NewXPubKey(payload.PublicKey)
		if err != nil {
			return nil, fmt.Errorf(invalidPubKeyErr["error"])
		}
		vKey = xpubKey.PubKey()[:]
	} else {
		// last attempt is that it is hex-encoded
		data, err := hex.DecodeString(payload.PublicKey)
		if err != nil {
			return nil, fmt.Errorf(invalidPubKeyErr["error"])
		}
		if len(data) == 32 {
			vKey = data
		} else if len(data) == 64 {
			vKey = crypto.XPubKey(data).PubKey()[:]
		} else {
			return nil, fmt.Errorf(invalidPubKeyErr["error"])
		}
	}

	// we have the posted tip value, the expected signed data and the public key
	// just verify the authorization and signature authenticity
	if useSodium {
		var seed string
		// verify identity authoriation
		hash := blake2b.Sum256(vKey)
		vkh := hex.EncodeToString(hash[:])
		if vkh != pool.VrfKeyHash() {
			return nil, fmt.Errorf("provided public key is not matching pool VRF key hash, details: " +
				fmt.Sprintf("%s != %s (pool vrf key hash from koios)", vkh, pool.VrfKeyHash()))
		}

		seedData, err := json.Marshal(payload.Data)
		if err != nil {
			return nil, err
		}
		seed = hex.EncodeToString([]byte(seedData))
		if payload.Type == cip22SigType {
			// cip-0022 prefixed as cncli does, always assume nonce was the empty string
			prefixHex := hex.EncodeToString([]byte("cip-0022"))
			seed = prefixHex + seed
		} else if payload.Type == minimalSigType {
			// the signed data is just the block number as string
			seed = hex.EncodeToString([]byte(blockNoAsString))
		} else if payload.Type == minimalCip22SigType {
			// the signed data is just the block number as string
			// with cip-0022 prefixed as cncli does, always assume nonce was the empty string
			prefixHex := hex.EncodeToString([]byte("cip-0022"))
			seed = prefixHex + hex.EncodeToString([]byte(blockNoAsString))
		}

		libsodium.Initialize_libsodium()
		seedData, err = hex.DecodeString(seed)
		if err != nil {
			return nil, err
		}

		dataHashBytes := blake2b.Sum256(seedData)
		_, err = libsodium.CryptoVrfVerify(vKey, sigBytes, dataHashBytes[:])
		if err != nil {
			return nil, fmt.Errorf("invalid signture, verifiction failed: " + err.Error() + ", details data: " + string(seedData))
		}
	} else {
		pubKey := crypto.PubKey(vKey)
		vkh, err := pubKey.Hash()
		if err != nil {
			return nil, fmt.Errorf("invalid pub key, failed to compute hash: " + err.Error())
		}
		vkhHex := hex.EncodeToString(vkh)
		// we need this to verify stake key hash
		sp := s.ctrl.GetStakePoolSet().Get(pool.Ticker())
		if sp.MainStakeKey() != vkhHex {
			return nil, fmt.Errorf("provided public key is not matching member stake key, details: " +
				fmt.Sprintf("%s != %s (stake key hash)", vkhHex, sp.MainStakeKey()))
		}
		data, err := json.Marshal(payload.Data)
		if err != nil {
			return nil, err
		}

		if payload.Type == minimalSigType {
			data = []byte(blockNoAsString)
		}

		if payload.Type == cip30SigType {
			msgToVerify, err := cose.NewCOSESign1MessageFromCBORHex(payload.Signature)
			if err != nil {
				return nil, fmt.Errorf("invalid COSE Sign1Message signature: " + err.Error())
			}

			key, err := cose.NewCOSEKeyFromBytes(vKey)
			if err != nil {
				return nil, fmt.Errorf("invalid pub key, failed to build COSE Key: " + err.Error())
			}

			verifier, err := cose.NewVerifierFromCOSEKey(key)
			if err != nil {
				return nil, fmt.Errorf("invalid pub key, failed to build Verifier from COSE Key: " + err.Error())
			}

			if string(data) != string(msgToVerify.Payload) {
				// just in this case we need to unmarshal the message payload
				// and deeply check agains the data in the posted payload
				mData := map[string]any{}
				if err := json.Unmarshal(msgToVerify.Payload, &mData); err != nil {
					return nil, fmt.Errorf("invalid payload in message to verify: " + err.Error())
				}
				if !reflect.DeepEqual(payload.Data, mData) {
					return nil, fmt.Errorf("payload in message to verify is different from the posted one: " + err.Error())
				}
			}

			if err := msgToVerify.Verify(nil, verifier); err != nil {
				return nil, fmt.Errorf("invalid signture, verifiction failed, detils data: %s", string(data))
			}
		} else {
			if !pubKey.Verify(data, sigBytes) {
				return nil, fmt.Errorf("invalid signture, verifiction failed, detils data: %s", string(data))
			}
		}
	}

	// here everything is verified, we trust the data so update the cache
	pool.SetBlockHeight(tip)
	return connect.NewResponse(&emptypb.Empty{}), nil
}
