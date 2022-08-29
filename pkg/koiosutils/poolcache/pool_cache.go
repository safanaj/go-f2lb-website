package poolcache

import (
	"context"
	"fmt"
	"sync"
	"sync/atomic"
	"time"
	"unsafe"

	// koios "github.com/cardano-community/koios-go-client"
	ku "github.com/safanaj/go-f2lb/pkg/koiosutils"
	"github.com/safanaj/go-f2lb/pkg/logging"
	"github.com/safanaj/go-f2lb/pkg/utils"
)

const (
	DefaultRefreshIntervalSeconds = time.Duration(10 * time.Minute)
	poolIdPrefix                  = "pool1"
)

type (
	PoolCache interface {
		Add(string)
		AddMany([]string)
		Del(string)
		DelMany([]string)
		Get(string) (PoolInfo, bool)
		Len() uint32
		Pending() uint32
		Ready() bool
		WaitReady(time.Duration) bool
		IsRunning() bool
		Start()
		Stop()
		WithOptions(
			kc *ku.KoiosClient,
			workers uint32,
			cacheSyncers uint32,
			refreshInterval time.Duration,
			workersInterval time.Duration,
			poolInfosToGet uint32,
		) (PoolCache, error)
	}

	PoolInfo interface {
		Ticker() string
		IdBech32() string
		IdHex() string
	}
)

type poolInfo struct {
	ticker string
	bech32 string
	hex    string
}

func (pi *poolInfo) Ticker() string   { return pi.ticker }
func (pi *poolInfo) IdBech32() string { return pi.bech32 }
func (pi *poolInfo) IdHex() string    { return pi.hex }

type poolCache struct {
	logging.Logger

	refreshInterval    time.Duration
	refresherTick      *time.Ticker
	refresherFinished  chan any
	refresherCtxCancel func()

	addeditems uint32
	nitems     uint32
	cache      *sync.Map
	// keys are bech32 ids
	cache2 *sync.Map

	kc *ku.KoiosClient

	running bool

	cacheSyncers  uint32
	cacheSyncerWg sync.WaitGroup
	infoCh        chan any

	workers   uint32
	workersWg sync.WaitGroup
	workersCh chan any

	workersCtxCancel func()
	workersInterval  time.Duration
	poolInfosToGet   uint32

	readyWaiterCh chan any
}

var _ PoolCache = (*poolCache)(nil)

func (pc *poolCache) cacheSyncer() {
	maybeNotifyWaiter := func(pc *poolCache) {
		chp := unsafe.Pointer(&pc.readyWaiterCh)
		ch := *((*chan any)(atomic.LoadPointer(&chp)))
		if ch != nil {
			select {
			case <-ch:
			default:
				if pc.Ready() {
					close(ch)
				}
			}
		}
	}

	defer pc.cacheSyncerWg.Done()
	for ai := range pc.infoCh {
		pc.V(3).Info("cache syncer", "got", ai)
		switch v := ai.(type) {
		case string:
			// delete from cache
			if old, ok := pc.cache.LoadAndDelete(v); ok {
				atomic.AddUint32(&pc.nitems, ^uint32(0))
				pc.V(2).Info("cache syncer deleted", "item", v, "now len", pc.Len())
				pc.cache2.Delete(old.(*poolInfo).bech32)
			}
			maybeNotifyWaiter(pc)
		case *poolInfo:
			// add to cache
			if _, loaded := pc.cache.LoadOrStore(v.ticker, v); loaded {
				pc.cache.Store(v.ticker, v)
				pc.cache2.Store(v.bech32, v)
			} else {
				atomic.AddUint32(&pc.nitems, uint32(1))
				pc.cache2.Store(v.bech32, v)
				pc.V(2).Info("cache syncer added", "item", v.ticker, "now len", pc.Len())
			}
			maybeNotifyWaiter(pc)
		}
	}
}

func (c *poolCache) poolListOrPoolInfosGetter(end context.Context) {
	d := time.Duration(c.workersInterval)
	t := time.NewTimer(d)

	defer c.workersWg.Done()

	go func() {
		round := 0
		ntickers := 0
		tickers := make(map[string]any)
		npools := 0
		poolids := make(map[string]any)

		getAndReset := func(f func() error, resetTarget *map[string]any) {
			err := f()
			if err != nil {
				c.Error(err, "poolCache.getAndReset")
			}
			// reset everything
			round = 0
			if resetTarget == &poolids {
				npools = 0
				poolids = make(map[string]any)
			}
			if resetTarget == &tickers {
				ntickers = 0
				tickers = make(map[string]any)
			}
		}

		getAndResetTickers := func() {
			getAndReset(func() error {
				tickers_l := []string{}
				for t, _ := range tickers {
					tickers_l = append(tickers_l, t)
				}
				if len(tickers_l) == 0 {
					return nil
				}
				t2p, err, _ := c.kc.GetTickerToPoolIdMapFor(tickers_l...)
				if err != nil {
					return err
				}
				if len(t2p) < len(tickers) {
					// we have stopped some accounts from that cacheing path, so remove them from the added count
					// to allow the cache to be ready
					atomic.AddUint32(&c.addeditems, ^uint32(len(tickers)-len(t2p)-1))
				}
				c.V(3).Info("Processing t2p", "len", len(t2p), "tickers len", len(tickers), "added", c.addeditems)
				for t, p := range t2p {
					c.V(4).Info("Forwarding poolInfo", "ticker", t, "bech32", p, "hex", utils.Bech32ToHexOrDie(p))
					c.infoCh <- &poolInfo{
						ticker: t,
						bech32: p,
						hex:    utils.Bech32ToHexOrDie(p),
					}
				}
				return nil
			}, &tickers)
		}

		// getAndResetPoolInfos := func() {
		// 	getAndReset(func() error {
		// 		// do a GetPoolInfos ....
		// 		for _, v := range poolids {
		// 			c.infoCh <- v
		// 		}
		// 		return nil
		// 	}, &poolids)
		// }

		for {
			select {
			case <-end.Done():
				return
			case <-t.C:
				// collect strings
				if (round > 0 && (len(tickers) == ntickers || len(poolids) == npools)) ||
					(len(poolids) > int(c.poolInfosToGet) || len(tickers) > int(c.poolInfosToGet)) {
					if len(tickers) == ntickers || len(tickers) > int(c.poolInfosToGet) {
						getAndResetTickers()
					}
					// if len(poolids) == npools || len(poolids) > int(c.poolInfosToGet) {
					// 	getAndResetPoolInfos()
					// }

				} else {
					if round == 0 && (len(tickers) == ntickers || len(poolids) == npools) {
						round++
					}
					npools = len(poolids)
					ntickers = len(tickers)
				}

				t.Reset(d)
			case xI, more := <-c.workersCh:
				if !more {
					return
				}
				// in this channel we can recieve a TICKER (string) or a poolInfo{}
				// in case of string we need just to list pools in an optimized way to get the Ids of them,
				// in case of poolInfo we should populate it with additional info other the just the ids

				switch v := xI.(type) {
				case string:
					tickers[v] = struct{}{}
					if len(tickers) > int(c.poolInfosToGet) {
						getAndResetTickers()
					}
					// case *poolInfo:
					// 	poolids[v.bech32] = v
					// 	if len(poolids) > int(c.poolInfosToGet) {
					// 		getAndResetPoolInfos()
					// 	}
				}
			}
		}
	}()
}

func (pc *poolCache) addMany(saddrs []string) {
	if !pc.running {
		return
	}
	isEmpty := pc.Len() == 0
	for _, saddr := range saddrs {
		if !isEmpty {
			if _, ok := pc.cache.Load(saddr); !ok {
				atomic.AddUint32(&pc.addeditems, uint32(1))
			}
		}
		pc.workersCh <- saddr
	}
	if isEmpty {
		atomic.AddUint32(&pc.addeditems, uint32(len(saddrs)))
	}
}

func (pc *poolCache) Add(saddr string) {
	pc.addMany([]string{saddr})
}

func (pc *poolCache) AddMany(saddrs []string) {
	pc.addMany(saddrs)
}

func (pc *poolCache) delMany(saddrs []string) {
	if !pc.running {
		return
	}
	for _, saddr := range saddrs {
		if _, ok := pc.cache.Load(saddr); !ok {
			atomic.AddUint32(&pc.addeditems, ^uint32(0))
		}
		pc.infoCh <- saddr
	}
}

func (pc *poolCache) Del(saddr string) {
	pc.delMany([]string{saddr})
}

func (pc *poolCache) DelMany(saddrs []string) {
	pc.delMany(saddrs)
}

func (pc *poolCache) Get(tickerOrbech32 string) (PoolInfo, bool) {
	if len(tickerOrbech32) > len(poolIdPrefix) && tickerOrbech32[:len(poolIdPrefix)] == poolIdPrefix {
		pi, ok := pc.cache2.Load(tickerOrbech32)
		if !ok {
			return (*poolInfo)(nil), false
		}
		return pi.(*poolInfo), true
	}
	pi, ok := pc.cache.Load(tickerOrbech32)
	if !ok {
		return (*poolInfo)(nil), false
	}
	return pi.(*poolInfo), true
}

func (pc *poolCache) Len() uint32     { return pc.nitems }
func (pc *poolCache) Pending() uint32 { return pc.addeditems - pc.nitems }
func (pc *poolCache) IsRunning() bool { return pc.running }
func (pc *poolCache) Ready() bool {
	pc.V(5).Info("PoolCache.Status",
		"ready", pc.nitems == pc.addeditems, "nitems", pc.nitems, "addeditems", pc.addeditems, "pending", pc.Pending())
	return pc.nitems == pc.addeditems
}
func (pc *poolCache) WaitReady(d time.Duration) bool {
	if !pc.running {
		return false
	}
	if pc.Ready() {
		return true
	}

	pc.readyWaiterCh = make(chan any)
	select {
	case <-pc.readyWaiterCh:
	case <-time.After(d):
		chp := unsafe.Pointer(&pc.readyWaiterCh)
		ch := *((*chan any)(atomic.SwapPointer(&chp, nil)))
		close(ch)
	}
	return pc.Ready()
}

func (pc *poolCache) Refresh() {
	if !pc.running {
		return
	}
	pc.cache.Range(func(k, _ any) bool {
		pc.workersCh <- k
		return true
	})

}

func (pc *poolCache) Start() {
	if pc.running {
		return
	}
	pc.refresherFinished = make(chan any)
	pc.infoCh = make(chan any)

	pc.cacheSyncerWg.Add(int(pc.cacheSyncers))
	for i := 0; i < int(pc.cacheSyncers); i++ {
		go pc.cacheSyncer()
	}

	ctx, ctxCancel := context.WithCancel(pc.kc.GetContext())
	pc.workersCtxCancel = ctxCancel
	pc.workersCh = make(chan any)
	pc.workersWg.Add(int(pc.workers))
	for i := 0; i < int(pc.workers); i++ {
		go pc.poolListOrPoolInfosGetter(ctx)
	}

	pc.running = true

	ctx, ctxCancel = context.WithCancel(pc.kc.GetContext())
	pc.refresherCtxCancel = ctxCancel
	pc.refresherTick = time.NewTicker(pc.refreshInterval)
	go func(end context.Context) {
		defer close(pc.refresherFinished)
		for {
			pc.V(3).Info("Refresh PoolCache", "is ready", pc.Ready())
			select {
			case <-end.Done():
				return
			case <-pc.refresherTick.C:
				pc.Refresh()
			}

		}
	}(ctx)
}

func (pc *poolCache) Stop() {
	if !pc.running {
		return
	}

	pc.running = false

	pc.V(2).Info("Stopping PoolCache")

	pc.refresherTick.Stop()
	pc.refresherCtxCancel()
	<-pc.refresherFinished
	pc.V(2).Info("PoolCache refresher stopped")

	pc.workersCtxCancel()
	pc.workersWg.Wait()
	close(pc.workersCh)
	pc.V(2).Info("PoolCache workers stopped")

	close(pc.infoCh)
	pc.cacheSyncerWg.Wait()
	pc.V(2).Info("PoolCache cache syncer stopped")
	pc.V(2).Info("PoolCache stopped")
}

func (pc *poolCache) WithOptions(
	kc *ku.KoiosClient,
	workers uint32,
	cacheSyncers uint32,
	refreshInterval time.Duration,
	workersInterval time.Duration,
	poolInfosToGet uint32,
) (PoolCache, error) {
	if pc.running {
		return nil, fmt.Errorf("PoolCache is running")
	}
	newPoolCache := &poolCache{
		kc:              kc,
		workers:         workers,
		cacheSyncers:    cacheSyncers,
		workersInterval: workersInterval,
		poolInfosToGet:  poolInfosToGet,
		refreshInterval: refreshInterval,
	}
	if pc.cache == nil {
		newPoolCache.cache = new(sync.Map)
	} else {
		newPoolCache.cache = pc.cache
	}

	if pc.cache2 == nil {
		newPoolCache.cache2 = new(sync.Map)
	} else {
		newPoolCache.cache2 = pc.cache2
	}
	newPoolCache.Logger = pc.Logger
	return newPoolCache, nil
}

func New(
	kc *ku.KoiosClient,
	workers uint32,
	cacheSyncers uint32,
	refreshInterval time.Duration,
	workersInterval time.Duration,
	poolInfosToGet uint32,
	logger logging.Logger,
) PoolCache {
	pc, _ := (&poolCache{Logger: logger}).WithOptions(kc, workers, cacheSyncers, refreshInterval, workersInterval, poolInfosToGet)
	return pc
}
