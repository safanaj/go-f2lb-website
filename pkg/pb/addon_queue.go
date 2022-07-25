package pb

import (
	"context"
	"fmt"

	emptypb "google.golang.org/protobuf/types/known/emptypb"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
)

type addonQueueServiceServer struct {
	UnimplementedAddonQueueServiceServer
	queue *f2lb_gsheet.AddonQueue
}

func NewAddonQueueServiceServer(q *f2lb_gsheet.AddonQueue) AddonQueueServiceServer {
	return &addonQueueServiceServer{queue: q}
}

func newMemeberFromAddonQueueRec(r *f2lb_gsheet.AddonQueueRec) *Member {
	return &Member{
		DiscordId:    r.DiscordName,
		Ticker:       r.Ticker,
		StakeKey:     r.StakeKeys[0],
		StakeAddr:    r.StakeAddrs[0],
		AdaDelegated: uint32(r.AD),
		EpochGranted: uint32(r.EG),
		PoolId:       r.PoolId,
		MainQCurrPos: fmt.Sprintf("%d", r.QPP),
	}
}

func (a *addonQueueServiceServer) Records(ctx context.Context, _ *emptypb.Empty) (*Members, error) {
	members := []*Member{}
	for _, r := range a.queue.GetRecords() {
		members = append(members, newMemeberFromAddonQueueRec(r))
	}
	return &Members{Members: members}, nil
}

func (a *addonQueueServiceServer) ListQueue(ctx context.Context, _ *emptypb.Empty) (*Members, error) {
	members := []*Member{}
	records := a.queue.GetRecords()
	served := a.queue.GetServed()
	servedIdx := -1
	for i, r := range records {
		if r == served {
			servedIdx = i
			break
		}
	}
	if servedIdx == -1 {
		return nil, fmt.Errorf("No served found in addon queue.")
	}

	// for _, r := range append(records[servedIdx:], records[:servedIdx]...) {
	for _, r := range records[servedIdx:] {
		members = append(members, newMemeberFromAddonQueueRec(r))
	}
	return &Members{Members: members}, nil

}

func (a *addonQueueServiceServer) Served(ctx context.Context, _ *emptypb.Empty) (*Member, error) {
	served := a.queue.GetServed()
	if served == nil {
		return nil, fmt.Errorf("No served found in addon queue.")
	}
	return newMemeberFromAddonQueueRec(served), nil
}
