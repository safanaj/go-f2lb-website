package v2

import (
	"context"
	"slices"

	connect "connectrpc.com/connect"
	emptypb "google.golang.org/protobuf/types/known/emptypb"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/f2lb_members"
)

type mainQueueServiceServer struct {
	UnimplementedMainQueueServiceHandler
	queue *f2lb_gsheet.MainQueue
	sps   f2lb_members.StakePoolSet
}

func NewMainQueueServiceServer(q *f2lb_gsheet.MainQueue, sps f2lb_members.StakePoolSet) MainQueueServiceHandler {
	return &mainQueueServiceServer{queue: q, sps: sps}
}

func (a *mainQueueServiceServer) Records(ctx context.Context, _ *connect.Request[emptypb.Empty]) (*connect.Response[Members], error) {
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

func (a *mainQueueServiceServer) ListQueue(ctx context.Context, _ *connect.Request[emptypb.Empty]) (*connect.Response[Members], error) {
	var err error

	members := slices.Collect(func(yield func(*Member) bool) {
		for _, t := range a.queue.GetOrdered() {
			if sp := a.sps.Get(t); sp != nil {
				if !yield(newMemeberFromStakePool(sp)) {
					err = ErrOutOfMemoryWTF
					return
				}
			}
		}
	})

	return connect.NewResponse(&Members{
		Members: members,
	}), err
}

func (a *mainQueueServiceServer) Served(ctx context.Context, req *connect.Request[emptypb.Empty]) (*connect.Response[Member], error) {
	for _, t := range a.queue.GetOrdered() {
		if sp := a.sps.Get(t); sp != nil {
			return connect.NewResponse(newMemeberFromStakePool(sp)), nil
		}
		break
	}

	return connect.NewResponse(&Member{}), nil
}
