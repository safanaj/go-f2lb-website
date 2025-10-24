package v1

import (
	"context"

	emptypb "google.golang.org/protobuf/types/known/emptypb"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
)

type supporterServiceServer struct {
	UnimplementedSupporterServiceServer
	supporters *f2lb_gsheet.Supporters
}

func NewSupporterServiceServer(s *f2lb_gsheet.Supporters) SupporterServiceServer {
	return &supporterServiceServer{supporters: s}
}

func newSupporterFromSupporter(r *f2lb_gsheet.Supporter) *Supporter {
	return &Supporter{
		DiscordId: r.DiscordName,
	}
}

func (a *supporterServiceServer) List(ctx context.Context, _ *emptypb.Empty) (*Supporters, error) {
	supporters := []*Supporter{}
	for _, r := range a.supporters.GetRecords() {
		supporters = append(supporters, newSupporterFromSupporter(r))
	}
	return &Supporters{Supporters: supporters}, nil
}
