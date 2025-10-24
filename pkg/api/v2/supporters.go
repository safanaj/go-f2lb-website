package v2

import (
	"context"
	"slices"

	"connectrpc.com/connect"
	emptypb "google.golang.org/protobuf/types/known/emptypb"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
)

type supporterServiceServer struct {
	UnimplementedSupporterServiceHandler
	supporters *f2lb_gsheet.Supporters
}

func NewSupporterServiceServer(s *f2lb_gsheet.Supporters) SupporterServiceHandler {
	return &supporterServiceServer{supporters: s}
}

func newSupporterFromSupporter(r *f2lb_gsheet.Supporter) *Supporter {
	return &Supporter{
		DiscordId: r.DiscordName,
	}
}

func (a *supporterServiceServer) List(ctx context.Context, _ *connect.Request[emptypb.Empty]) (*connect.Response[Supporters], error) {
	var err error
	return connect.NewResponse(&Supporters{
		Supporters: slices.Collect(func(yield func(*Supporter) bool) {
			for _, r := range a.supporters.GetRecords() {
				if !yield(newSupporterFromSupporter(r)) {
					err = ErrOutOfMemoryWTF
					return
				}
			}
		}),
	}), err
}
