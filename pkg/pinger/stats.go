package pinger

import (
	"encoding/json"
	"fmt"
	"time"
)

type (
	RelayStatus       int
	RelayInSyncStatus int
)

const (
	RelayDown RelayStatus = iota
	RelaySlow
	RelayUp
)

func (x RelayStatus) String() string {
	switch x {
	case RelayUp:
		return "up and responsive"
	case RelaySlow:
		return "up but slow"
	case RelayDown:
		return "down"
	}
	return "down"
}

const (
	InSyncUnknown RelayInSyncStatus = iota
	InSyncYes
	InSyncNo
)

func (x RelayInSyncStatus) String() string {
	switch x {
	case InSyncUnknown:
		return "unknown"
	case InSyncNo:
		return "no"
	case InSyncYes:
		return "yes"
	}
	return "unknown"
}

type (
	RelayStats []RelayStat
	RelayStat  struct {
		ResponseTime time.Duration
		Status       RelayStatus
		Tip          int
		InSync       RelayInSyncStatus
		Error        error
	}

	poolStats struct {
		errs  []error
		stats map[string]RelayStats
	}
)

var (
	_ PoolStats = &poolStats{}
)

func (rs RelayStats) last() RelayStat { return rs[len(rs)-1] }
func (rs RelayStats) lastOrEmpty() RelayStat {
	if len(rs) > 0 {
		return rs[len(rs)-1]
	} else {
		return RelayStat{}
	}
}
func (rs RelayStats) first() RelayStat { return rs[0] }
func (rs RelayStats) empty() bool      { return len(rs) == 0 }

func (rs RelayStats) ResponseTime() time.Duration { return rs.lastOrEmpty().ResponseTime }
func (rs RelayStats) Status() RelayStatus         { return rs.lastOrEmpty().Status }
func (rs RelayStats) Tip() int                    { return rs.lastOrEmpty().Tip }
func (rs RelayStats) InSync() RelayInSyncStatus   { return rs.lastOrEmpty().InSync }
func (rs RelayStats) Error() error                { return rs.lastOrEmpty().Error }

func (rs RelayStats) MarshalJSON() ([]byte, error) {
	if rs.empty() {
		return json.Marshal(map[string]string{"error": "no relay"})
	}
	if rs.last().Error != nil {
		return json.Marshal(struct {
			Error string `json:"error"`
		}{Error: rs.last().Error.Error()})
	}
	return json.Marshal(struct {
		ResponseTime    time.Duration `json:"response_time_ns"`
		Status          string        `json:"status"`
		UpAndResponsive bool          `json:"up_and_responsive"`
		InSync          string        `json:"in_sync"`
	}{
		ResponseTime:    rs.last().ResponseTime,
		Status:          rs.last().Status.String(),
		UpAndResponsive: rs.last().Status == RelayUp,
		InSync:          rs.last().InSync.String(),
	})

}

func (ps *poolStats) RelayStats() map[string]RelayStats {
	if ps == nil {
		return nil
	}
	return ps.stats
}

func (ps *poolStats) Errors() []error {
	if ps == nil {
		return nil
	}
	return ps.errs
}

func (ps *poolStats) HasErrors() bool {
	if ps == nil {
		return true
	}
	return len(ps.errs) != 0
}

func (ps *poolStats) UpAndResponsive() bool {
	if ps == nil {
		return false
	}
	noRelay := true
	upAndResponsive := true
	for _, rs := range ps.RelayStats() {
		if !rs.empty() {
			noRelay = false
			upAndResponsive = upAndResponsive && rs.last().Status == RelayUp
		}
	}
	if noRelay {
		return false
	}
	return upAndResponsive
}

func (ps *poolStats) InSync() RelayInSyncStatus {
	inSync := InSyncUnknown
	if ps == nil {
		return inSync
	}
	for _, rs := range ps.RelayStats() {
		if !rs.empty() {
			if rs.last().InSync == InSyncYes {
				inSync = InSyncYes
				break
			}
			if rs.last().InSync == InSyncNo {
				inSync = InSyncNo
			}
		}
	}
	return inSync
}

func (ps *poolStats) MarshalJSON() ([]byte, error) {
	if ps.HasErrors() {
		errs := ps.Errors()
		if errs == nil {
			errs = []error{fmt.Errorf("empty stats")}
		}
		errors := []string{}
		for _, e := range errs {
			errors = append(errors, e.Error())
		}
		return json.Marshal(struct {
			Errors []string `json:"errors"`
		}{Errors: errors})
	}
	return json.Marshal(struct {
		Stats           map[string]RelayStats `json:"relays_stats"`
		UpAndResponsive bool                  `json:"up_and_responsive"`
		InSync          string                `json:"in_sync"`
	}{
		Stats:           ps.RelayStats(),
		UpAndResponsive: ps.UpAndResponsive(),
		InSync:          ps.InSync().String(),
	})
}
