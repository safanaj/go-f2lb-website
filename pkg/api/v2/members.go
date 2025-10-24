package v2

import (
	"context"
	"slices"
	"time"

	connect "connectrpc.com/connect"
	emptypb "google.golang.org/protobuf/types/known/emptypb"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/f2lb_members"
)

func newMemeberFromStakePool(sp f2lb_members.StakePool) *Member {
	return &Member{
		DiscordId:                 sp.DiscordName(),
		Ticker:                    sp.Ticker(),
		StakeKey:                  sp.MainStakeKey(),
		StakeAddr:                 sp.MainStakeAddress(),
		AdaDeclared:               uint32(sp.AdaDeclared()),
		AdaDelegated:              uint32(sp.AdaDelegated()),
		EpochGranted:              uint32(sp.EpochGranted()),
		PoolIdHex:                 sp.PoolIdHex(),
		PoolIdBech32:              sp.PoolIdBech32(),
		PoolVrfVKeyHash:           sp.PoolVrfKeyHash(),
		DelegatedPool:             sp.DelegatedPool(),
		StartingEpoch:             uint32(sp.StartingEpochOnMainQueue()),
		StartingTime:              sp.StartingTimeOnMainQueue().Format(time.RFC850),
		MainQCurrPos:              uint32(sp.MainQueueCurrentPosision()),
		EpochGrantedOnAddonQueue:  uint32(sp.EpochGrantedOnAddonQueue()),
		StartingEpochOnAddonQueue: uint32(sp.StartingEpochOnAddonQueue()),
		StartingTimeOnAddonQueue:  sp.StartingTimeOnAddonQueue().Format(time.RFC850),
		ActiveStake:               sp.ActiveStake(),
		LiveStake:                 sp.LiveStake(),
		LiveDelegators:            sp.LiveDelegators(),
		BlockHeight:               sp.BlockHeight(),
	}
}

type memberServiceServer struct {
	UnimplementedMemberServiceHandler
	delegCycle *f2lb_gsheet.DelegationCycle
	sps        f2lb_members.StakePoolSet
}

func NewMemberServiceServer(d *f2lb_gsheet.DelegationCycle, sps f2lb_members.StakePoolSet) MemberServiceHandler {
	return &memberServiceServer{delegCycle: d, sps: sps}
}

func (a *memberServiceServer) Active(context.Context, *connect.Request[emptypb.Empty]) (*connect.Response[Member], error) {
	if sp := a.sps.Get(a.delegCycle.GetActiveTicker()); sp != nil {
		return connect.NewResponse(newMemeberFromStakePool(sp)), nil
	}
	return connect.NewResponse(&Member{}), nil
}

func (a *memberServiceServer) Top(context.Context, *connect.Request[emptypb.Empty]) (*connect.Response[Member], error) {
	if sp := a.sps.Get(a.delegCycle.GetTopTicker()); sp != nil {
		return connect.NewResponse(newMemeberFromStakePool(sp)), nil
	}
	return connect.NewResponse(&Member{}), nil
}

func (a *memberServiceServer) List(context.Context, *connect.Request[emptypb.Empty]) (*connect.Response[Members], error) {
	var err error
	return connect.NewResponse(&Members{
		Members: slices.Collect(func(yield func(*Member) bool) {
			for _, sp := range a.sps.StakePools() {
				if !yield(newMemeberFromStakePool(sp)) {
					err = ErrOutOfMemoryWTF
					return
				}
			}
		}),
	}), err
}
