package pb

import (
	"context"
	"fmt"

	emptypb "google.golang.org/protobuf/types/known/emptypb"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
)

type mainQueueServiceServer struct {
	UnimplementedMainQueueServiceServer
	queue *f2lb_gsheet.MainQueue
}

func NewMainQueueServiceServer(q *f2lb_gsheet.MainQueue) MainQueueServiceServer {
	return &mainQueueServiceServer{queue: q}
}

func newMemeberFromMainQueueRec(r *f2lb_gsheet.MainQueueRec) *Member {
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

func (a *mainQueueServiceServer) Records(ctx context.Context, _ *emptypb.Empty) (*Members, error) {
	members := []*Member{}
	for _, r := range a.queue.GetRecords() {
		members = append(members, newMemeberFromMainQueueRec(r))
	}
	return &Members{Members: members}, nil
}

func (a *mainQueueServiceServer) ListQueue(ctx context.Context, _ *emptypb.Empty) (*Members, error) {
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
		return nil, fmt.Errorf("No served found in main queue.")
	}

	for _, r := range append(records[servedIdx:], records[:servedIdx]...) {
		members = append(members, newMemeberFromMainQueueRec(r))
	}
	return &Members{Members: members}, nil

}

func (a *mainQueueServiceServer) Served(ctx context.Context, _ *emptypb.Empty) (*Member, error) {
	served := a.queue.GetServed()
	if served == nil {
		return nil, fmt.Errorf("No served found in main queue.")
	}
	return newMemeberFromMainQueueRec(served), nil
}
