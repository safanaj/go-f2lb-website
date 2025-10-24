package v1

import (
	"context"
	"time"

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
	UnimplementedMemberServiceServer
	delegCycle *f2lb_gsheet.DelegationCycle
	sps        f2lb_members.StakePoolSet
}

func NewMemberServiceServer(d *f2lb_gsheet.DelegationCycle, sps f2lb_members.StakePoolSet) MemberServiceServer {
	return &memberServiceServer{delegCycle: d, sps: sps}
}

func (a *memberServiceServer) Active(context.Context, *emptypb.Empty) (*Member, error) {
	if sp := a.sps.Get(a.delegCycle.GetActiveTicker()); sp != nil {
		return newMemeberFromStakePool(sp), nil
	}
	return &Member{}, nil
}

func (a *memberServiceServer) Top(context.Context, *emptypb.Empty) (*Member, error) {
	if sp := a.sps.Get(a.delegCycle.GetTopTicker()); sp != nil {
		return newMemeberFromStakePool(sp), nil
	}
	return &Member{}, nil
}

func (a *memberServiceServer) List(context.Context, *emptypb.Empty) (*Members, error) {
	members := []*Member{}
	for _, sp := range a.sps.StakePools() {
		members = append(members, newMemeberFromStakePool(sp))
	}
	return &Members{Members: members}, nil
}
