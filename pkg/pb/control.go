package pb

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	// "github.com/safanaj/cardano-go"

	emptypb "google.golang.org/protobuf/types/known/emptypb"

	"github.com/hako/durafmt"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/txbuilder"
	"github.com/safanaj/go-f2lb/pkg/utils"
	"github.com/safanaj/go-f2lb/pkg/webserver"
)

type ControlServiceRefresher interface {
	SetRefresherChannel(chan string)
	GetRefresherChannel() chan string
	StartRefresher(context.Context)
}

type controlServiceServer struct {
	UnimplementedControlMsgServiceServer

	ctrl        f2lb_gsheet.Controller
	refreshCh   chan string
	uuid2stream map[string]ControlMsgService_ControlServer

	adminPools map[string]any

	payer *txbuilder.Payer
}

var _ ControlMsgServiceServer = &controlServiceServer{}
var _ ControlServiceRefresher = &controlServiceServer{}

func NewControlServiceServer(c f2lb_gsheet.Controller, adminPools []string, payer *txbuilder.Payer) ControlMsgServiceServer {
	cs := &controlServiceServer{ctrl: c, adminPools: make(map[string]any), payer: payer}
	for _, p := range adminPools {
		cs.adminPools[strings.TrimSpace(p)] = struct{}{}
	}
	return cs
}

func (c *controlServiceServer) SetRefresherChannel(ch chan string) {
	c.refreshCh = ch
}
func (c *controlServiceServer) GetRefresherChannel() chan string {
	return c.refreshCh
}

func (c *controlServiceServer) Refresh(ctx context.Context, unused *emptypb.Empty) (*emptypb.Empty, error) {
	c.ctrl.Refresh()
	if c.payer != nil {
		c.payer.Refresh()
	}
	return unused, nil
}

func (s *controlServiceServer) StartRefresher(ctx context.Context) {
	s.uuid2stream = make(map[string]ControlMsgService_ControlServer)
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
				} else if stream, ok := s.uuid2stream[ruuid]; ok {
					if err := s.sendControlMsg(stream, time.Now(), ControlMsg_NONE); err != nil {
						delete(s.uuid2stream, ruuid)
					}
				} else {
					fmt.Printf("Wrong uuid: %s\n", ruuid)
				}
			}
		}
	}()
}

func (s *controlServiceServer) sendControlMsg(stream ControlMsgService_ControlServer, t time.Time, cmsgType ControlMsg_Type) error {
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

	cmsg := &ControlMsg{
		Date:  t.Format(time.RFC850),
		Epoch: fmt.Sprintf("%d", utils.TimeToEpoch(t)),
		Slot:  fmt.Sprintf("%d", utils.TimeToSlot(t)),
		Type:  cmsgType,
		Data:  string(dataBytes),
	}
	return stream.Send(cmsg)
}

func (s *controlServiceServer) sendControlMsgToAll(t time.Time, cmsgType ControlMsg_Type) {
	toDel := []string{}
	for ruuid, stream := range s.uuid2stream {
		if err := s.sendControlMsg(stream, t, cmsgType); err != nil {
			toDel = append(toDel, ruuid)
		}
	}
	for _, x := range toDel {
		delete(s.uuid2stream, x)
	}
}

func (s *controlServiceServer) Control(stream ControlMsgService_ControlServer) error {
	s.sendControlMsg(stream, time.Now(), ControlMsg_REFRESH)
	ruuid, isOk := stream.Context().Value(webserver.IdCtxKey).(string)
	if isOk {
		s.uuid2stream[ruuid] = stream
	} else {
		fmt.Printf("Not UUID in stream Context: %v\n", stream.Context().Value(webserver.IdCtxKey))
	}

	select {
	case <-stream.Context().Done():
		return nil
	}
}

func (s *controlServiceServer) Auth(ctx context.Context, saddr *StakeAddr) (*User, error) {
	saddr_ := saddr.GetStakeAddress()
	if saddr_ == "" {
		return nil, fmt.Errorf("Bad Request: Empty stake address")
	}

	if sp := s.ctrl.GetStakePoolSet().Get(saddr_); sp != nil && sp.Ticker() != "" {
		// check admin permission
		_, isAdmin := s.adminPools[sp.Ticker()]
		// found just return this
		return &User{
			Type:          User_SPO,
			StakeKey:      sp.StakeKeys()[0],
			StakeAddress:  sp.MainStakeAddress(),
			Member:        newMemeberFromStakePool(sp),
			IsAdmin:       isAdmin,
			DelegatedPool: sp.DelegatedPool(),
		}, nil
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
		return &User{
			Type:          User_SUPPORTER,
			StakeKey:      supporter.StakeKeys[0],
			StakeAddress:  supporter.StakeAddrs[0],
			Supporter:     &Supporter{DiscordId: supporter.DiscordName},
			DelegatedPool: delegPool,
		}, nil
	}
	return &User{
		Type:          User_VISITOR,
		StakeAddress:  saddr_,
		DelegatedPool: delegPool,
	}, nil
}

func (s *controlServiceServer) BuildDelegationTx(ctx context.Context, deleg *Delegation) (*PartiallySignedTx, error) {
	if s.payer == nil {
		return nil, fmt.Errorf("Payer not available")
	}

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
		return &PartiallySignedTx{
			CborHex: txHex,
		}, nil
	}
}

func (s *controlServiceServer) CanceledTx(ctx context.Context, txid *TxId) (*emptypb.Empty, error) {
	if s.payer == nil {
		return nil, fmt.Errorf("Payer not available")
	}
	s.payer.CanceledTx(txid.GetHash())
	return &emptypb.Empty{}, nil
}

func (s *controlServiceServer) SubmittedTx(ctx context.Context, txid *TxId) (*emptypb.Empty, error) {
	if s.payer == nil {
		return nil, fmt.Errorf("Payer not available")
	}
	s.payer.SubmittedTx(txid.GetHash())
	return &emptypb.Empty{}, nil
}
