package pb

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	emptypb "google.golang.org/protobuf/types/known/emptypb"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/utils"
	"github.com/safanaj/go-f2lb/pkg/webserver"
)

type ControlServiceRefresher interface {
	SetRefresherChannel(chan string)
	GetRefresherChannel() chan string
	StartRefresher(context.Context)
}

type controlServiceServer struct {
	UnimplementedControlMsgServiceServer

	ctrl        f2lb_gsheet.Controller
	refreshCh   chan string
	uuid2stream map[string]ControlMsgService_ControlServer
}

var _ ControlMsgServiceServer = &controlServiceServer{}
var _ ControlServiceRefresher = &controlServiceServer{}

func NewControlServiceServer(c f2lb_gsheet.Controller) ControlMsgServiceServer {
	return &controlServiceServer{ctrl: c}
}

func (c *controlServiceServer) SetRefresherChannel(ch chan string) {
	c.refreshCh = ch
}
func (c *controlServiceServer) GetRefresherChannel() chan string {
	return c.refreshCh
}

func (c *controlServiceServer) Refresh(ctx context.Context, unused *emptypb.Empty) (*emptypb.Empty, error) {
	c.ctrl.Refresh()
	return unused, nil
}

func (s *controlServiceServer) StartRefresher(ctx context.Context) {
	s.uuid2stream = make(map[string]ControlMsgService_ControlServer)
	ticker := time.NewTicker(120 * time.Second)

	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			case t := <-ticker.C:
				s.sendControlMsgToAll(t, ControlMsg_NONE)
			case ruuid := <-s.refreshCh:
				if ruuid == "ALL" {
					s.sendControlMsgToAll(time.Now(), ControlMsg_REFRESH)
				} else if stream, ok := s.uuid2stream[ruuid]; ok {
					if err := s.sendControlMsg(stream, time.Now(), ControlMsg_NONE); err != nil {
						delete(s.uuid2stream, ruuid)
					}
				} else {
					fmt.Printf("Wrong uuid: %s\n", ruuid)
				}
			}
		}
	}()
}

func (s *controlServiceServer) sendControlMsg(stream ControlMsgService_ControlServer, t time.Time, cmsgType ControlMsg_Type) error {
	dataBytes, _ := json.Marshal(map[string]any{
		"cache_ready": s.ctrl.GetAccountCache().Ready() && s.ctrl.GetPoolCache().Ready(),
		"notes":       map[string]string{},
	})

	cmsg := &ControlMsg{
		Date:  t.Format(time.RFC850),
		Epoch: fmt.Sprintf("%d", utils.TimeToEpoch(t)),
		Slot:  fmt.Sprintf("%d", utils.TimeToSlot(t)),
		Type:  cmsgType,
		Data:  string(dataBytes),
	}
	return stream.Send(cmsg)
}

func (s *controlServiceServer) sendControlMsgToAll(t time.Time, cmsgType ControlMsg_Type) {
	toDel := []string{}
	for ruuid, stream := range s.uuid2stream {
		if err := s.sendControlMsg(stream, t, cmsgType); err != nil {
			toDel = append(toDel, ruuid)
		}
	}
	for _, x := range toDel {
		delete(s.uuid2stream, x)
	}
}

func (s *controlServiceServer) Control(stream ControlMsgService_ControlServer) error {
	s.sendControlMsg(stream, time.Now(), ControlMsg_REFRESH)
	ruuid, isOk := stream.Context().Value(webserver.IdCtxKey).(string)
	if isOk {
		s.uuid2stream[ruuid] = stream
	} else {
		fmt.Printf("Not UUID in stream Context: %v\n", stream.Context().Value(webserver.IdCtxKey))
	}

	select {
	case <-stream.Context().Done():
		return nil
	}
	return nil
}
