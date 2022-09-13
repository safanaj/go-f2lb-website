package pb

import (
	"context"
	"time"

	emptypb "google.golang.org/protobuf/types/known/emptypb"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/f2lb_members"
)

func newMemeberFromStakePool(sp f2lb_members.StakePool) *Member {
	return &Member{
		DiscordId:                sp.DiscordName(),
		Ticker:                   sp.Ticker(),
		StakeKey:                 sp.MainStakeKey(),
		StakeAddr:                sp.MainStakeAddress(),
		AdaDeclared:              uint32(sp.AdaDeclared()),
		AdaDelegated:             uint32(sp.AdaDelegated()),
		EpochGranted:             uint32(sp.EpochGranted()),
		PoolIdHex:                sp.PoolIdHex(),
		PoolIdBech32:             sp.PoolIdBech32(),
		DelegatedPool:            sp.DelegatedPool(),
		StartingEpoch:            uint32(sp.StartingEpochOnMainQueue()),
		StartingTime:             sp.StartingTimeOnMainQueue().Format(time.RFC850),
		MainQCurrPos:             uint32(sp.MainQueueCurrentPosision()),
		EpochGrantedOnAddonQueue: uint32(sp.EpochGrantedOnAddonQueue()),
		ActiveStake:              sp.ActiveStake(),
		LiveStake:                sp.LiveStake(),
		LiveDelegators:           sp.LiveDelegators(),
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

func (a *memberServiceServer) List(context.Context, *emptypb.Empty) (*Members, error) {
	members := []*Member{}
	for _, sp := range a.sps.StakePools() {
		members = append(members, newMemeberFromStakePool(sp))
	}
	return &Members{Members: members}, nil
}
