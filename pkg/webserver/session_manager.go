package webserver

import (
	"context"
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	fp "path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
)

const (
	sessionExpiresIn           = 1 * time.Hour
	sessionsFolderLeafPathName = "sessions"
)

type (
	SessionManager interface {
		Start(context.Context)
		Session() (string, SessionData)
		Delete(string)
		DeleteByContext(context.Context)
		Get(string) (SessionData, bool)
		GetByContext(context.Context) (SessionData, bool)
		UpdateExpiration(string)
		UpdateExpirationByContext(context.Context)
		UpdateMemberAccount(string, string)
		UpdateVerifiedAccount(string, string)
		UpdateConnectedWallet(string, string)
		Done() <-chan struct{}
	}
	SessionData struct {
		Expires         time.Time
		MemberAccount   string
		VerifiedAccount string
		ConnectedWallet string
	}
	sessionManager struct {
		lock     sync.RWMutex
		sessions map[string]*SessionData
		// ch       chan any
		path string
		done chan struct{}
	}
)

var (
	_ SessionManager = &sessionManager{}
)

func NewSessionManager(ppath string) SessionManager {
	return &sessionManager{
		sessions: make(map[string]*SessionData),
		path:     trySetupSessionsFolder(ppath),
		done:     make(chan struct{}),
	}
}

func trySetupSessionsFolder(ppath string) string {
	fi, err := os.Stat(ppath)
	if err != nil {
		return ""
	}
	if !fi.IsDir() {
		return ""
	}
	path := fp.Join(ppath, sessionsFolderLeafPathName)
	if os.MkdirAll(path, 0o700) != nil {
		return ""
	}
	return path
}

func (s *sessionManager) dumpSessions() {
	if s.path == "" {
		return
	}
	s.lock.RLock()
	defer s.lock.RUnlock()
	now := time.Now()
	for sid, sd := range s.sessions {
		fn := fp.Join(s.path, fmt.Sprintf("%s.json", sid))
		data, err := json.Marshal(sd)
		_, err = os.Stat(fn)
		if now.After(sd.Expires) && err == nil {
			os.Remove(fn)
			continue
		}
		f, err := os.OpenFile(fn, os.O_CREATE|os.O_WRONLY, 0o600)
		if err != nil {
			continue
		}
		f.Write(data)
		f.Close()
	}
}

func (s *sessionManager) loadSessions() {
	if s.path == "" {
		return
	}
	s.lock.Lock()
	defer s.lock.Unlock()
	fp.Walk(s.path, func(path string, info fs.FileInfo, err error) error {
		if info.IsDir() {
			return fp.SkipDir
		}
		if !strings.HasSuffix(info.Name(), ".json") {
			return nil
		}
		parts := strings.Split(info.Name(), ".")
		data, err := os.ReadFile(info.Name())
		if err != nil {
			return nil
		}
		sd := SessionData{}
		if json.Unmarshal(data, &sd) != nil {
			return nil
		}
		s.sessions[parts[0]] = &sd
		s.dumpSessions()
		return nil
	})
}

func (s *sessionManager) Done() <-chan struct{} { return s.done }
func (s *sessionManager) Start(rtx context.Context) {
	s.loadSessions()
	go func() {
		tick := time.NewTicker(30 * time.Minute)
		defer tick.Stop()
		for {
			select {
			case <-rtx.Done():
				s.dumpSessions()
				s.lock.Lock()
				defer s.lock.Unlock()
				s.sessions = make(map[string]*SessionData)
				close(s.done)
				return

			case <-tick.C:
				expired := []string{}
				now := time.Now().Add(2 * time.Minute)
				s.lock.RLock()
				for sid, sd := range s.sessions {
					if now.After(sd.Expires) {
						expired = append(expired, sid)
					}
				}
				s.lock.RUnlock()
				if len(expired) > 0 {
					s.lock.Lock()
					for _, sid := range expired {
						delete(s.sessions, sid)
					}
					s.lock.Unlock()
				}
			}
		}
	}()
}

func (s *sessionManager) Session() (string, SessionData) {
	s.lock.Lock()
	defer s.lock.Unlock()
	sid := fmt.Sprintf("%s", uuid.New())
	sd := &SessionData{Expires: time.Now().Add(sessionExpiresIn)}
	s.sessions[sid] = sd
	return sid, *sd
}

func (s *sessionManager) Delete(id string) {
	s.lock.Lock()
	defer s.lock.Unlock()
	delete(s.sessions, id)
}

func (s *sessionManager) DeleteByContext(ctx context.Context) {
	id, isOk := ctx.Value(IdCtxKey).(string)
	if !isOk {
		return
	}
	s.Delete(id)
}

func (s *sessionManager) Get(id string) (SessionData, bool) {
	s.lock.RLock()
	defer s.lock.RUnlock()
	sd, ok := s.sessions[id]
	if !ok {
		sd = &SessionData{}
	}
	return *sd, ok
}

func (s *sessionManager) GetByContext(ctx context.Context) (SessionData, bool) {
	id, isOk := ctx.Value(IdCtxKey).(string)
	if !isOk {
		return SessionData{}, false
	}
	return s.Get(id)
}

func (s *sessionManager) UpdateExpirationByContext(ctx context.Context) {
	id, isOk := ctx.Value(IdCtxKey).(string)
	if !isOk {
		return
	}
	s.UpdateExpiration(id)
}

func (s *sessionManager) UpdateExpiration(id string) {
	at := time.Now().Add(sessionExpiresIn)
	s.lock.Lock()
	defer s.lock.Unlock()
	sd, ok := s.sessions[id]
	if !ok {
		return
	}
	sd.Expires = at
}

func (s *sessionManager) UpdateMemberAccount(id, account string) {
	s.lock.Lock()
	defer s.lock.Unlock()
	sd, ok := s.sessions[id]
	if !ok {
		return
	}
	sd.MemberAccount = account
}

func (s *sessionManager) UpdateVerifiedAccount(id, account string) {
	s.lock.Lock()
	defer s.lock.Unlock()
	sd, ok := s.sessions[id]
	if !ok {
		return
	}
	sd.VerifiedAccount = account
}

func (s *sessionManager) UpdateConnectedWallet(id, wallet string) {
	s.lock.Lock()
	defer s.lock.Unlock()
	sd, ok := s.sessions[id]
	if !ok {
		return
	}
	sd.ConnectedWallet = wallet
}
