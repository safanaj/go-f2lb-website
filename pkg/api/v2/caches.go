package v2

import (
	context "context"
	"encoding/json"
	"fmt"
	"maps"
	"slices"

	connect "connectrpc.com/connect"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
	structpb "google.golang.org/protobuf/types/known/structpb"
	timestamppb "google.golang.org/protobuf/types/known/timestamppb"
	wrapperspb "google.golang.org/protobuf/types/known/wrapperspb"

	"github.com/safanaj/go-f2lb/pkg/caches/accountcache"
	"github.com/safanaj/go-f2lb/pkg/caches/koiosutils"
	"github.com/safanaj/go-f2lb/pkg/caches/poolcache"
	"github.com/safanaj/go-f2lb/pkg/webserver"
)

func checkForVerifiedUser(ctx context.Context, sm webserver.SessionManager) error {
	ruuid, isOk := ctx.Value(webserver.IdCtxKey).(string)
	if !isOk {
		return fmt.Errorf("anonymous user is not allowed to use koios service")
	}
	sd, ok := sm.Get(ruuid)
	if !ok {
		return fmt.Errorf("unknown user is not allowed to use koios service")
	}
	if sd.VerifiedAccount == "" {
		return fmt.Errorf("unverified user is not allowed to use koios service")
	}
	return nil
}

type koiosServiceHandler struct {
	UnimplementedKoiosHandler

	kc *koiosutils.KoiosClient
	sm webserver.SessionManager
}

func NewKoiosService(kc *koiosutils.KoiosClient, sm webserver.SessionManager) KoiosHandler {
	return &koiosServiceHandler{kc: kc, sm: sm}
}

func (h *koiosServiceHandler) checkForVerifiedUser(ctx context.Context) error {
	return checkForVerifiedUser(ctx, h.sm)
}

func (h *koiosServiceHandler) GetTip(ctx context.Context, _ *connect.Request[emptypb.Empty]) (*connect.Response[structpb.Struct], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	epoch, block, slot, err := h.kc.GetTip()
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	res, err := structpb.NewStruct(map[string]any{
		"epoch": epoch,
		"block": block,
		"slot":  slot,
	})
	return connect.NewResponse(res), err
}

func (h *koiosServiceHandler) GetPoolsInfos(ctx context.Context, req *connect.Request[structpb.ListValue]) (*connect.Response[structpb.Struct], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	poolids := slices.Collect(func(yield func(string) bool) {
		for _, v := range req.Msg.Values {
			if v.GetStringValue() != "" {
				if !yield(v.GetStringValue()) {
					return
				}
			}
		}
	})

	infos, err := h.kc.GetPoolsInfos(poolids...)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	res, err := structpb.NewStruct(maps.Collect(func(yield func(k string, v any) bool) {
		for k, v := range infos {
			b, _ := json.Marshal(v)
			a := map[string]any{}
			json.Unmarshal(b, &a)
			if !yield(k, a) {
				return
			}
		}
	}))
	return connect.NewResponse(res), err
}

func (h *koiosServiceHandler) GetStakeAddressesInfos(ctx context.Context, req *connect.Request[structpb.ListValue]) (*connect.Response[structpb.Struct], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	saddrs := slices.Collect(func(yield func(string) bool) {
		for _, v := range req.Msg.Values {
			if v.GetStringValue() != "" {
				if !yield(v.GetStringValue()) {
					return
				}
			}
		}
	})
	infos, err := h.kc.GetStakeAddressesInfos(saddrs...)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	res, err := structpb.NewStruct(maps.Collect(func(yield func(k string, v any) bool) {
		for k, v := range infos {
			b, _ := json.Marshal(v)
			a := map[string]any{}
			json.Unmarshal(b, &a)
			if !yield(k, a) {
				return
			}
		}
	}))
	return connect.NewResponse(res), err
}

func (h *koiosServiceHandler) GetLastDelegationTx(ctx context.Context, req *connect.Request[wrapperspb.StringValue]) (*connect.Response[wrapperspb.StringValue], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	txHash, err := h.kc.GetLastDelegationTx(req.Msg.Value)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&wrapperspb.StringValue{Value: txHash.String()}), nil
}

func (h *koiosServiceHandler) GetLastDelegationTime(ctx context.Context, req *connect.Request[wrapperspb.StringValue]) (*connect.Response[timestamppb.Timestamp], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	at, err := h.kc.GetLastDelegationTime(req.Msg.Value)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(timestamppb.New(at)), nil
}

func (h *koiosServiceHandler) GetTxsMetadata(ctx context.Context, req *connect.Request[structpb.ListValue]) (*connect.Response[structpb.Struct], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	txs := slices.Collect(func(yield func(string) bool) {
		for _, v := range req.Msg.Values {
			if v.GetStringValue() != "" {
				if !yield(v.GetStringValue()) {
					return
				}
			}
		}
	})
	mds, err := h.kc.GetTxsMetadata(txs)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	res, err := structpb.NewStruct(maps.Collect(func(yield func(k string, v any) bool) {
		for k, v := range mds {
			if !yield(k, v) {
				return
			}
		}
	}))
	return connect.NewResponse(res), err
}

type accountCacheServiceHandler struct {
	UnimplementedAccountCacheHandler

	ac accountcache.AccountCache
	sm webserver.SessionManager
}

func NewAccountCacheService(ac accountcache.AccountCache, sm webserver.SessionManager) AccountCacheHandler {
	return &accountCacheServiceHandler{ac: ac, sm: sm}
}

func (h *accountCacheServiceHandler) checkForVerifiedUser(ctx context.Context) error {
	return checkForVerifiedUser(ctx, h.sm)
}

func (h *accountCacheServiceHandler) Add(ctx context.Context, req *connect.Request[wrapperspb.StringValue]) (*connect.Response[emptypb.Empty], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}

	h.ac.Add(req.Msg.Value)
	return connect.NewResponse(&emptypb.Empty{}), nil
}

func (h *accountCacheServiceHandler) AddMany(ctx context.Context, req *connect.Request[structpb.ListValue]) (*connect.Response[emptypb.Empty], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	saddrs := slices.Collect(func(yield func(string) bool) {
		for _, v := range req.Msg.Values {
			if v.GetStringValue() != "" {
				if !yield(v.GetStringValue()) {
					return
				}
			}
		}
	})
	h.ac.AddMany(saddrs)
	return connect.NewResponse(&emptypb.Empty{}), nil
}

func (h *accountCacheServiceHandler) Del(ctx context.Context, req *connect.Request[wrapperspb.StringValue]) (*connect.Response[emptypb.Empty], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	h.ac.Del(req.Msg.Value)
	return connect.NewResponse(&emptypb.Empty{}), nil
}

func (h *accountCacheServiceHandler) DelMany(ctx context.Context, req *connect.Request[structpb.ListValue]) (*connect.Response[emptypb.Empty], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	saddrs := slices.Collect(func(yield func(string) bool) {
		for _, v := range req.Msg.Values {
			if v.GetStringValue() != "" {
				if !yield(v.GetStringValue()) {
					return
				}
			}
		}
	})
	h.ac.DelMany(saddrs)
	return connect.NewResponse(&emptypb.Empty{}), nil
}

func (h *accountCacheServiceHandler) Get(ctx context.Context, req *connect.Request[wrapperspb.StringValue]) (*connect.Response[structpb.Struct], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	info, ok := h.ac.Get(req.Msg.Value)
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}
	res, err := structpb.NewStruct(map[string]any{
		"StakeAddress":  info.StakeAddress(),
		"DelegatedPool": info.DelegatedPool(),
		"AdaAmount":     info.AdaAmount(),
		"Status":        info.Status(),
	})

	return connect.NewResponse(res), err
}

// func (h *accountCacheServiceHandler) GetAll(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[structpb.ListValue], error) {
// 	if err := h.checkForVerifiedUser(ctx); err != nil {
// 		return nil, connect.NewError(connect.CodePermissionDenied, err)
// 	}
// }

func (h *accountCacheServiceHandler) Len(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[wrapperspb.UInt32Value], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	return connect.NewResponse(&wrapperspb.UInt32Value{Value: h.ac.Len()}), nil
}

func (h *accountCacheServiceHandler) Pending(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[wrapperspb.UInt32Value], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	return connect.NewResponse(&wrapperspb.UInt32Value{Value: h.ac.Pending()}), nil
}

func (h *accountCacheServiceHandler) AddedItems(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[wrapperspb.UInt32Value], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	return connect.NewResponse(&wrapperspb.UInt32Value{Value: h.ac.AddedItems()}), nil
}

func (h *accountCacheServiceHandler) ResetCounts(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[emptypb.Empty], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	h.ac.ResetCounts()
	return connect.NewResponse(req.Msg), nil
}

func (h *accountCacheServiceHandler) Ready(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[wrapperspb.BoolValue], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	return connect.NewResponse(&wrapperspb.BoolValue{Value: h.ac.Ready()}), nil
}

func (h *accountCacheServiceHandler) RefreshMember(ctx context.Context, req *connect.Request[wrapperspb.StringValue]) (*connect.Response[emptypb.Empty], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	h.ac.RefreshMember(req.Msg.Value)
	return connect.NewResponse(&emptypb.Empty{}), nil
}

type poolCacheServiceHandler struct {
	UnimplementedPoolCacheHandler

	pc poolcache.PoolCache
	sm webserver.SessionManager
}

func NewPoolCacheService(pc poolcache.PoolCache, sm webserver.SessionManager) PoolCacheHandler {
	return &poolCacheServiceHandler{pc: pc, sm: sm}
}

func (h *poolCacheServiceHandler) checkForVerifiedUser(ctx context.Context) error {
	return checkForVerifiedUser(ctx, h.sm)
}

func (h *poolCacheServiceHandler) Add(ctx context.Context, req *connect.Request[wrapperspb.StringValue]) (*connect.Response[emptypb.Empty], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	h.pc.Add(req.Msg.Value)
	return connect.NewResponse(&emptypb.Empty{}), nil
}

func (h *poolCacheServiceHandler) AddMany(ctx context.Context, req *connect.Request[structpb.ListValue]) (*connect.Response[emptypb.Empty], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	poolids := slices.Collect(func(yield func(any) bool) {
		for _, v := range req.Msg.Values {
			if v.GetStringValue() != "" {
				if !yield(v.GetStringValue()) {
					return
				}
			}
		}
	})
	h.pc.AddMany(poolids)
	return connect.NewResponse(&emptypb.Empty{}), nil
}

func (h *poolCacheServiceHandler) Del(ctx context.Context, req *connect.Request[wrapperspb.StringValue]) (*connect.Response[emptypb.Empty], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	h.pc.Del(req.Msg.Value)
	return connect.NewResponse(&emptypb.Empty{}), nil
}

func (h *poolCacheServiceHandler) DelMany(ctx context.Context, req *connect.Request[structpb.ListValue]) (*connect.Response[emptypb.Empty], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	poolids := slices.Collect(func(yield func(string) bool) {
		for _, v := range req.Msg.Values {
			if v.GetStringValue() != "" {
				if !yield(v.GetStringValue()) {
					return
				}
			}
		}
	})
	h.pc.DelMany(poolids)
	return connect.NewResponse(&emptypb.Empty{}), nil
}

func (h *poolCacheServiceHandler) Get(ctx context.Context, req *connect.Request[wrapperspb.StringValue]) (*connect.Response[structpb.Struct], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	info, ok := h.pc.Get(req.Msg.Value)
	if !ok {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}
	res, err := structpb.NewStruct(map[string]any{
		"Ticker":         info.Ticker(),
		"IdBech32":       info.IdBech32(),
		"IdHex":          info.IdHex(),
		"VrfKeyHash":     info.VrfKeyHash(),
		"ActiveStake":    info.ActiveStake(),
		"LiveStake":      info.LiveStake(),
		"LiveDelegators": info.LiveDelegators(),
		"BlockHeight":    info.BlockHeight(),
		"IsRetired":      info.IsRetired(),
		"Margin":         info.Margin(),
	})
	return connect.NewResponse(res), err

}

// func (h *poolCacheServiceHandler) GetAll(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[structpb.ListValue], error) {
// 	if err := h.checkForVerifiedUser(ctx); err != nil {
// 		return nil, connect.NewError(connect.CodePermissionDenied, err)
// 	}
// }

func (h *poolCacheServiceHandler) Len(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[wrapperspb.UInt32Value], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	return connect.NewResponse(&wrapperspb.UInt32Value{Value: h.pc.Len()}), nil
}

func (h *poolCacheServiceHandler) Pending(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[wrapperspb.UInt32Value], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	return connect.NewResponse(&wrapperspb.UInt32Value{Value: h.pc.Pending()}), nil
}

func (h *poolCacheServiceHandler) AddedItems(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[wrapperspb.UInt32Value], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	return connect.NewResponse(&wrapperspb.UInt32Value{Value: h.pc.AddedItems()}), nil
}

func (h *poolCacheServiceHandler) ResetCounts(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[emptypb.Empty], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	h.pc.ResetCounts()
	return connect.NewResponse(req.Msg), nil
}

func (h *poolCacheServiceHandler) Ready(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[wrapperspb.BoolValue], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	return connect.NewResponse(&wrapperspb.BoolValue{Value: h.pc.Ready()}), nil
}

func (h *poolCacheServiceHandler) IsTickerMissingFromKoiosPoolList(ctx context.Context, req *connect.Request[wrapperspb.StringValue]) (*connect.Response[wrapperspb.BoolValue], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	return connect.NewResponse(&wrapperspb.BoolValue{Value: h.pc.IsTickerMissingFromKoiosPoolList(req.Msg.Value)}), nil
}

func (h *poolCacheServiceHandler) GetMissingPoolInfos(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[structpb.ListValue], error) {
	if err := h.checkForVerifiedUser(ctx); err != nil {
		return nil, connect.NewError(connect.CodePermissionDenied, err)
	}
	res, err := structpb.NewList(slices.Collect(func(yield func(any) bool) {
		for _, s := range h.pc.GetMissingPoolInfos() {
			if !yield(s) {
				return
			}
		}
	}))
	return connect.NewResponse(res), err
}
