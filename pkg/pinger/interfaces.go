package pinger

import (
	"context"
	"encoding/json"

	"github.com/safanaj/go-f2lb/pkg/caches/poolcache"
	"github.com/safanaj/go-f2lb/pkg/f2lb_members"
)

type (
	MiniController interface {
		GetKoiosTipSlot() int
		GetPoolCache() poolcache.PoolCache
		GetStakePoolSet() f2lb_members.StakePoolSet

		SetPinger(Pinger)
		GetPinger() Pinger
	}

	PoolStats interface {
		json.Marshaler
		RelayStats() map[string]RelayStats
		HasErrors() bool
		Errors() []error
		UpAndResponsive() bool
		InSync() RelayInSyncStatus
	}

	Pinger interface {
		Start(context.Context) error
		Stop()
		IsRunning() bool
		GetPoolStats(f2lb_members.StakePool) PoolStats
		CheckPool(f2lb_members.StakePool) PoolStats

		SetController(MiniController)

		DumpResults() any
	}
)
