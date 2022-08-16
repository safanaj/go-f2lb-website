package pb

import (
	"context"

	emptypb "google.golang.org/protobuf/types/known/emptypb"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/f2lb_members"
)

type addonQueueServiceServer struct {
	UnimplementedAddonQueueServiceServer
	queue *f2lb_gsheet.AddonQueue
	sps   f2lb_members.StakePoolSet
}

func NewAddonQueueServiceServer(q *f2lb_gsheet.AddonQueue, sps f2lb_members.StakePoolSet) AddonQueueServiceServer {
	return &addonQueueServiceServer{queue: q, sps: sps}
}

// func NewAddonQueueServiceServer(q *f2lb_gsheet.AddonQueue) AddonQueueServiceServer {
// 	return &addonQueueServiceServer{queue: q}
// }

// func newMemeberFromAddonQueueRec(r *f2lb_gsheet.AddonQueueRec) *Member {
// 	return &Member{
// 		DiscordId:    r.DiscordName,
// 		Ticker:       r.Ticker,
// 		StakeKey:     r.StakeKeys[0],
// 		StakeAddr:    r.StakeAddrs[0],
// 		AdaDeclared:  uint32(r.AD),
// 		AdaDelegated: uint32(r.AdaDelegated),
// 		EpochGranted: uint32(r.EG),
// 		PoolIdHex:    r.PoolIdHex,
// 		PoolIdBech32: r.PoolIdBech32,
// 		MainQCurrPos: fmt.Sprintf("%d", r.QPP),
// 	}
// }

func (a *addonQueueServiceServer) Records(ctx context.Context, _ *emptypb.Empty) (*Members, error) {
	members := []*Member{}
	// for _, r := range a.queue.GetRecords() {
	// 	members = append(members, newMemeberFromAddonQueueRec(r))
	// }
	for _, sp := range a.sps.StakePools() {
		members = append(members, newMemeberFromStakePool(sp))
	}
	return &Members{Members: members}, nil
}

func (a *addonQueueServiceServer) ListQueue(ctx context.Context, _ *emptypb.Empty) (*Members, error) {
	members := []*Member{}
	// records := a.queue.GetRecords()
	// served := a.queue.GetServed()
	// servedIdx := -1
	// for i, r := range records {
	// 	if r == served {
	// 		servedIdx = i
	// 		break
	// 	}
	// }
	// if servedIdx == -1 {
	// 	return nil, fmt.Errorf("No served found in addon queue.")
	// }

	// // for _, r := range append(records[servedIdx:], records[:servedIdx]...) {
	// for _, r := range records[servedIdx:] {
	// 	members = append(members, newMemeberFromAddonQueueRec(r))
	// }
	for _, t := range a.queue.GetOrdered() {
		sp := a.sps.Get(t)
		members = append(members, newMemeberFromStakePool(sp))
	}
	return &Members{Members: members}, nil

}

func (a *addonQueueServiceServer) Served(ctx context.Context, e *emptypb.Empty) (*Member, error) {
	// served := a.queue.GetServed()
	// if served == nil {
	// 	return nil, fmt.Errorf("No served found in addon queue.")
	// }
	// return newMemeberFromAddonQueueRec(served), nil
	members, err := a.ListQueue(ctx, e)
	return members.GetMembers()[0], err
}
