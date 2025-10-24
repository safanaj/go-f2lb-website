package v2

import (
	"context"
	"errors"
	"slices"

	connect "connectrpc.com/connect"
	emptypb "google.golang.org/protobuf/types/known/emptypb"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/f2lb_members"
)

var ErrOutOfMemoryWTF = errors.New("Out of Memeory ???")

type addonQueueServiceServer struct {
	UnimplementedAddonQueueServiceHandler
	queue *f2lb_gsheet.AddonQueue
	sps   f2lb_members.StakePoolSet
}

func NewAddonQueueServiceServer(q *f2lb_gsheet.AddonQueue, sps f2lb_members.StakePoolSet) AddonQueueServiceHandler {
	return &addonQueueServiceServer{queue: q, sps: sps}
}

func (a *addonQueueServiceServer) Records(ctx context.Context, _ *connect.Request[emptypb.Empty]) (*connect.Response[Members], error) {
	var err error
	return connect.NewResponse(&Members{Members: slices.Collect(func(yield func(*Member) bool) {
		for _, sp := range a.sps.StakePools() {
			if !yield(newMemeberFromStakePool(sp)) {
				err = ErrOutOfMemoryWTF
				return
			}
		}
	})}), err
}

func (a *addonQueueServiceServer) ListQueue(ctx context.Context, _ *connect.Request[emptypb.Empty]) (*connect.Response[Members], error) {
	var err error
	return connect.NewResponse(&Members{Members: slices.Collect(func(yield func(*Member) bool) {
		for _, t := range a.queue.GetOrdered() {
			if sp := a.sps.Get(t); sp != nil {
				if !yield(newMemeberFromStakePool(sp)) {
					err = ErrOutOfMemoryWTF
					return
				}
			}
		}
	})}), err
}

func (a *addonQueueServiceServer) Served(ctx context.Context, e *connect.Request[emptypb.Empty]) (*connect.Response[Member], error) {
	members, err := a.ListQueue(ctx, e)
	return connect.NewResponse(members.Msg.GetMembers()[0]), err
}
