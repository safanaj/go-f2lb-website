package v1

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

func (a *addonQueueServiceServer) Records(ctx context.Context, _ *emptypb.Empty) (*Members, error) {
	members := []*Member{}
	for _, sp := range a.sps.StakePools() {
		members = append(members, newMemeberFromStakePool(sp))
	}
	return &Members{Members: members}, nil
}

func (a *addonQueueServiceServer) ListQueue(ctx context.Context, _ *emptypb.Empty) (*Members, error) {
	members := []*Member{}
	for _, t := range a.queue.GetOrdered() {
		if sp := a.sps.Get(t); sp != nil {
			members = append(members, newMemeberFromStakePool(sp))
		}
	}
	return &Members{Members: members}, nil

}

func (a *addonQueueServiceServer) Served(ctx context.Context, e *emptypb.Empty) (*Member, error) {
	members, err := a.ListQueue(ctx, e)
	return members.GetMembers()[0], err
}
