package pb

import (
	"context"
	"time"

	emptypb "google.golang.org/protobuf/types/known/emptypb"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/f2lb_members"
)

type mainQueueServiceServer struct {
	UnimplementedMainQueueServiceServer
	queue *f2lb_gsheet.MainQueue
	sps   f2lb_members.StakePoolSet
}

func NewMainQueueServiceServer(q *f2lb_gsheet.MainQueue, sps f2lb_members.StakePoolSet) MainQueueServiceServer {
	return &mainQueueServiceServer{queue: q, sps: sps}
}

// func NewMainQueueServiceServer(q *f2lb_gsheet.MainQueue) MainQueueServiceServer {
// 	return &mainQueueServiceServer{queue: q}
// }

// func newMemeberFromMainQueueRec(r *f2lb_gsheet.MainQueueRec) *Member {
// 	return &Member{
// 		DiscordId:     r.DiscordName,
// 		Ticker:        r.Ticker,
// 		StakeKey:      r.StakeKeys[0],
// 		StakeAddr:     r.StakeAddrs[0],
// 		AdaDeclared:   uint32(r.AD),
// 		AdaDelegated:  uint32(r.AdaDelegated),
// 		EpochGranted:  uint32(r.EG),
// 		PoolIdHex:     r.PoolIdHex,
// 		PoolIdBech32:  r.PoolIdBech32,
// 		DelegatedPool: r.DelegatedPool,
// 		StartingEpoch: uint32(r.StartingEpoch),
// 		StartingTime:  r.StartingTime.Format(time.RFC850),
// 		MainQCurrPos:  fmt.Sprintf("%d", r.QPP),
// 	}
// }

func newMemeberFromStakePool(sp f2lb_members.StakePool) *Member {
	return &Member{
		DiscordId:     sp.DiscordName(),
		Ticker:        sp.Ticker(),
		StakeKey:      sp.StakeKeys()[0],
		StakeAddr:     sp.MainStakeAddress(),
		AdaDeclared:   uint32(sp.AdaDeclared()),
		AdaDelegated:  uint32(sp.AdaDelegated()),
		EpochGranted:  uint32(sp.EpochGranted()),
		PoolIdHex:     sp.PoolIdHex(),
		PoolIdBech32:  sp.PoolIdBech32(),
		DelegatedPool: sp.DelegatedPool(),
		StartingEpoch: uint32(sp.StartingEpochOnMainQueue()),
		StartingTime:  sp.StartingTimeOnMainQueue().Format(time.RFC850),
		MainQCurrPos:  uint32(sp.MainQueueCurrentPosision()),
	}
}

func (a *mainQueueServiceServer) Records(ctx context.Context, _ *emptypb.Empty) (*Members, error) {
	members := []*Member{}
	for _, sp := range a.sps.StakePools() {
		members = append(members, newMemeberFromStakePool(sp))
	}
	return &Members{Members: members}, nil
}

func (a *mainQueueServiceServer) ListQueue(ctx context.Context, _ *emptypb.Empty) (*Members, error) {
	members := []*Member{}
	for _, t := range a.queue.GetOrdered() {
		if sp := a.sps.Get(t); sp != nil {
			members = append(members, newMemeberFromStakePool(sp))
		}
	}
	return &Members{Members: members}, nil
}

func (a *mainQueueServiceServer) Served(ctx context.Context, e *emptypb.Empty) (*Member, error) {
	members, err := a.ListQueue(ctx, e)
	return members.GetMembers()[0], err
}
