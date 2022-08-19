package accountcache

import (
	"context"
	"fmt"
	"sync"
	"sync/atomic"
	"time"
	"unsafe"

	koios "github.com/cardano-community/koios-go-client"
	ku "github.com/safanaj/go-f2lb/pkg/koiosutils"
	"github.com/safanaj/go-f2lb/pkg/logging"
)

const (
	DefaultTimeTxGetterIntervalSeconds = time.Duration(5 * time.Second)
	DefaultRefreshIntervalSeconds      = time.Duration(10 * time.Minute)
)

type (
	AccountCache interface {
		Add(string)
		AddMany([]string)
		Del(string)
		DelMany([]string)
		Get(string) (AccountInfo, bool)
		Len() uint32
		Pending() uint32
		Ready() bool
		WaitReady(time.Duration) bool
		IsRunning() bool
		Refresh()
		Start()
		Stop()
		WithOptions(
			kc *ku.KoiosClient,
			workers uint32,
			cacheSyncers uint32,
			timeTxGetters uint32,
			refreshInterval time.Duration,
			timeTxGetterInterval time.Duration,
			timeTxsToGet uint32,
		) (AccountCache, error)
	}

	AccountInfo interface {
		StakeAddress() string
		DelegatedPool() string
		AdaAmount() uint64
		LastDelegationTime() time.Time
	}

	txItem struct {
		saddr string
		tx    koios.TxHash
	}

	txTime struct {
		saddr string
		t     time.Time
	}
)

type accountInfo struct {
	stakeAddress          string
	delegatedPoolIdBech32 string
	adaAmount             uint64
	lastDelegationTime    time.Time
}

func (ai *accountInfo) StakeAddress() string          { return ai.stakeAddress }
func (ai *accountInfo) DelegatedPool() string         { return ai.delegatedPoolIdBech32 }
func (ai *accountInfo) AdaAmount() uint64             { return ai.adaAmount }
func (ai *accountInfo) LastDelegationTime() time.Time { return ai.lastDelegationTime }

type accountCache struct {
	logging.Logger

	refreshInterval    time.Duration
	refresherTick      *time.Ticker
	refresherFinished  chan any
	refresherCtxCancel func()

	addeditems uint32
	nitems     uint32
	cache      *sync.Map

	kc *ku.KoiosClient

	running bool

	cacheSyncers  uint32
	cacheSyncerWg sync.WaitGroup
	infoCh        chan any

	workers   uint32
	workersWg sync.WaitGroup
	workersCh chan any

	timeTxGetterCtxCancel func()
	// timeTxGetterFinished  chan any
	timeTxGetterInterval time.Duration
	timeTxGetterCh       chan txItem
	timeTxGetters        uint32
	timeTxGetterWg       sync.WaitGroup
	timeTxsToGet         uint32

	readyWaiterCh chan any
}

var _ AccountCache = (*accountCache)(nil)

func (ac *accountCache) cacheSyncer() {
	maybeNotifyWaiter := func(ac *accountCache) {
		chp := unsafe.Pointer(&ac.readyWaiterCh)
		ch := *((*chan any)(atomic.LoadPointer(&chp)))
		if ch != nil {
			select {
			case <-ch:
			default:
				if ac.Ready() {
					close(ch)
				}
			}
		}
	}

	defer ac.cacheSyncerWg.Done()
	for ai := range ac.infoCh {
		ac.V(3).Info("cache syncer", "got", ai)
		switch v := ai.(type) {
		case string:
			// delete from cache
			if _, ok := ac.cache.LoadAndDelete(v); ok {
				atomic.AddUint32(&ac.nitems, ^uint32(0))
				ac.V(2).Info("cache syncer deleted", "item", v, "now len", ac.Len())
			}
			maybeNotifyWaiter(ac)
		case *accountInfo:
			// add to cache
			if _, loaded := ac.cache.LoadOrStore(v.stakeAddress, v); loaded {
				ac.cache.Store(v.stakeAddress, v)
			} else {
				atomic.AddUint32(&ac.nitems, uint32(1))
				ac.V(2).Info("cache syncer added", "item", v.stakeAddress, "now len", ac.Len())
			}
			maybeNotifyWaiter(ac)
		}
	}
}

func (ac *accountCache) lastDelegOrAccountInfoGetter() {
	defer ac.workersWg.Done()
	for item := range ac.workersCh {
		// fmt.Printf("worker got: %v\n", item)
		ac.V(4).Info("worker", "got", item)
		switch v := item.(type) {
		case string:
			tx, err := ac.kc.GetLastDelegationTx(v)
			if err != nil {
				ac.Error(err, "workers.GetLastDelegationTx()", "item", v)
				// we have stopped some accounts from that cacheing path, so remove them from the added count
				// to allow the cache to be ready
				atomic.AddUint32(&ac.addeditems, ^uint32(0))
				// return
			}
			ac.timeTxGetterCh <- txItem{v, tx}
		case txTime:
			delegatedPool, totalAda, err := ac.kc.GetStakeAddressInfo(v.saddr)
			if err != nil {
				ac.Error(err, "workers.GetStakeAddressInfo()", "stake address", v.saddr)
				// we have stopped some accounts from that cacheing path, so remove them from the added count
				// to allow the cache to be ready
				atomic.AddUint32(&ac.addeditems, ^uint32(0))
				// return
			}
			ac.infoCh <- &accountInfo{
				stakeAddress:          v.saddr,
				delegatedPoolIdBech32: delegatedPool,
				adaAmount:             uint64(totalAda),
				lastDelegationTime:    v.t,
			}
		}
	}
}

func (ac *accountCache) txsTimesGetter(end context.Context) {
	d := time.Duration(ac.timeTxGetterInterval)
	t := time.NewTimer(d)

	// defer close(ac.timeTxGetterFinished)
	defer ac.timeTxGetterWg.Done()
	go func() {

		round := 0
		ntxs := 0
		txs := make(map[koios.TxHash]any)
		tx2saddr := make(map[koios.TxHash]string)
		saddr2time := make(map[string]time.Time)

		getAndReset := func() {
			txs_ := make([]koios.TxHash, 0, len(txs))
			for k, _ := range txs {
				txs_ = append(txs_, k)
			}
			tx2time, err := ac.kc.GetTxsTimes(txs_)
			if err == nil {
				ac.V(3).Info("accountCache.txsTimesGetter: GetTxsTimes(txs)", "got len", len(tx2time), "ntxs", ntxs)
				if len(saddr2time) < ntxs {
					// we have stopped some accounts from that cacheing path, so remove them from the added count
					// to allow the cache to be ready
					atomic.AddUint32(&ac.addeditems, ^uint32(ntxs-len(saddr2time)-1))
				}

				for tx, t := range tx2time {
					if saddr, ok := tx2saddr[tx]; ok {
						saddr2time[saddr] = t
					}
				}
				// fmt.Printf("accountCache.txsTimesGetter: flow %d accounts\n", len(saddr2time))
				ac.V(3).Info("accountCache.txsTimesGetter", "flow len", len(saddr2time))
				for saddr, t := range saddr2time {
					ac.workersCh <- txTime{saddr, t}
				}
			} else {
				ac.Error(err, "accountCache.txsTimesGetter: GetTxsTimes(txs)")
			}
			// reset everything
			round = 0
			ntxs = 0
			txs = make(map[koios.TxHash]any)
			tx2saddr = make(map[koios.TxHash]string)
			saddr2time = make(map[string]time.Time)
		}

		for {
			select {
			case <-end.Done():
				return
			case <-t.C:
				// fmt.Printf("accountCache.txsTimesGetter: timer fired: len(txs)=%d - ready to go: %t - %t %t %t %t - cache is ready: %t - to flow %d\n",
				// 	len(txs), (round > 0 && len(txs) == ntxs) || len(txs) > 10,
				// 	len(txs) == ntxs, ntxs > 0, round > 0, len(txs) > 10,
				// 	ac.Ready(), len(saddr2time))
				if (round > 0 && len(txs) == ntxs) || len(txs) > int(ac.timeTxsToGet) {
					getAndReset()
				} else {
					if round == 0 && len(txs) == ntxs && ntxs > 0 {
						round++
					}
					ntxs = len(txs)
				}
				t.Reset(d)

			case txi, stillOpen := <-ac.timeTxGetterCh:
				// fmt.Printf("timeGetter got: %v - %t -- len(txs)=%d - ntxs=%d\n", txi, stillOpen, len(txs), ntxs)
				if stillOpen {
					// txs = append(txs, txi.tx)
					txs[txi.tx] = struct{}{}
					tx2saddr[txi.tx] = txi.saddr
					saddr2time[txi.saddr] = time.Time{}
				} else {
					return
				}
				if len(txs) > int(ac.timeTxsToGet) {
					getAndReset()
				}
			}
		}
	}()
}

func (ac *accountCache) addMany(saddrs []string) {
	if !ac.running {
		return
	}
	isEmpty := ac.Len() == 0
	for _, saddr := range saddrs {
		if !isEmpty {
			if _, ok := ac.cache.Load(saddr); !ok {
				atomic.AddUint32(&ac.addeditems, uint32(1))
			}
		}
		ac.workersCh <- saddr
	}
	if isEmpty {
		atomic.AddUint32(&ac.addeditems, uint32(len(saddrs)))
	}
}

func (ac *accountCache) Add(saddr string) {
	ac.addMany([]string{saddr})
}

func (ac *accountCache) AddMany(saddrs []string) {
	ac.addMany(saddrs)
}

func (ac *accountCache) delMany(saddrs []string) {
	if !ac.running {
		return
	}
	for _, saddr := range saddrs {
		if _, ok := ac.cache.Load(saddr); !ok {
			atomic.AddUint32(&ac.addeditems, ^uint32(0))
		}
		ac.infoCh <- saddr
	}
}

func (ac *accountCache) Del(saddr string) {
	ac.delMany([]string{saddr})
}

func (ac *accountCache) DelMany(saddrs []string) {
	ac.delMany(saddrs)
}

func (ac *accountCache) Get(saddr string) (AccountInfo, bool) {
	ai, ok := ac.cache.Load(saddr)
	if !ok {
		return (*accountInfo)(nil), false
	}
	return ai.(*accountInfo), true
}

func (ac *accountCache) Len() uint32     { return ac.nitems }
func (ac *accountCache) Pending() uint32 { return ac.addeditems - ac.nitems }
func (ac *accountCache) IsRunning() bool { return ac.running }
func (ac *accountCache) Ready() bool {
	// fmt.Printf("AccountCache is ready ? %d == %d => %t\n",
	// 	ac.nitems, ac.addeditems, ac.nitems == ac.addeditems)
	return ac.nitems == ac.addeditems
}
func (ac *accountCache) WaitReady(d time.Duration) bool {
	if !ac.running {
		return false
	}
	if ac.Ready() {
		return true
	}

	ac.readyWaiterCh = make(chan any)
	select {
	case <-ac.readyWaiterCh:
	case <-time.After(d):
		chp := unsafe.Pointer(&ac.readyWaiterCh)
		ch := *((*chan any)(atomic.SwapPointer(&chp, nil)))
		close(ch)
	}
	return ac.Ready()
}

func (ac *accountCache) Refresh() {
	if !ac.running {
		return
	}
	ac.cache.Range(func(k, _ any) bool {
		ac.workersCh <- k
		return true
	})
}

func (ac *accountCache) Start() {
	if ac.running {
		return
	}
	ac.refresherFinished = make(chan any)
	// ac.timeTxGetterFinished = make(chan any)
	ac.workersCh = make(chan any)
	ac.timeTxGetterCh = make(chan txItem)
	ac.infoCh = make(chan any)

	ac.cacheSyncerWg.Add(int(ac.cacheSyncers))
	for i := 0; i < int(ac.cacheSyncers); i++ {
		go ac.cacheSyncer()
	}

	ctx, ctxCancel := context.WithCancel(ac.kc.GetContext())
	ac.timeTxGetterCtxCancel = ctxCancel
	ac.timeTxGetterWg.Add(int(ac.timeTxGetters))
	for i := 0; i < int(ac.timeTxGetters); i++ {
		go ac.txsTimesGetter(ctx)
	}

	ac.workersWg.Add(int(ac.workers))
	for i := 0; i < int(ac.workers); i++ {
		go ac.lastDelegOrAccountInfoGetter()
	}

	ac.running = true

	ctx, ctxCancel = context.WithCancel(ac.kc.GetContext())
	ac.refresherCtxCancel = ctxCancel
	ac.refresherTick = time.NewTicker(ac.refreshInterval)
	go func(end context.Context) {
		defer close(ac.refresherFinished)
		for {
			ac.V(3).Info("Refresh AccountCache", "is ready", ac.Ready())
			select {
			case <-end.Done():
				return
			case <-ac.refresherTick.C:
				ac.Refresh()
			}

		}
	}(ctx)
}

func (ac *accountCache) Stop() {
	if !ac.running {
		return
	}

	ac.running = false
	ac.V(2).Info("Stopping AccountCache")
	ac.timeTxGetterCtxCancel()
	ac.timeTxGetterWg.Wait()
	// <-ac.timeTxGetterFinished

	ac.V(2).Info("AccountCache timeTxGetter stopped")
	ac.refresherTick.Stop()
	ac.refresherCtxCancel()
	<-ac.refresherFinished
	ac.V(2).Info("AccountCache refresher stopped")

	close(ac.workersCh)
	ac.workersWg.Wait()
	ac.V(2).Info("AccountCache workers stopped")

	close(ac.timeTxGetterCh)
	ac.V(2).Info("AccountCache closed timeTxGetter channel")

	close(ac.infoCh)
	ac.V(2).Info("AccountCache closed cacheSyncer channel")
	ac.cacheSyncerWg.Wait()
	ac.V(2).Info("AccountCache cacheSyncer stopped")
	ac.V(2).Info("AccountCache stopped")
}

func (ac *accountCache) WithOptions(
	kc *ku.KoiosClient,
	workers uint32,
	cacheSyncers uint32,
	timeTxGetters uint32,
	refreshInterval time.Duration,
	timeTxGetterInterval time.Duration,
	timeTxsToGet uint32,
) (AccountCache, error) {
	if ac.running {
		return nil, fmt.Errorf("AccountCache is running")
	}
	newAccountCache := &accountCache{
		kc:                   kc,
		workers:              workers,
		cacheSyncers:         cacheSyncers,
		timeTxGetters:        timeTxGetters,
		timeTxGetterInterval: timeTxGetterInterval,
		timeTxsToGet:         timeTxsToGet,
		refreshInterval:      refreshInterval,
	}
	if ac.cache == nil {
		newAccountCache.cache = new(sync.Map)
	} else {
		newAccountCache.cache = ac.cache
	}
	newAccountCache.Logger = ac.Logger
	return newAccountCache, nil
}

func New(
	kc *ku.KoiosClient,
	workers uint32,
	cacheSyncers uint32,
	timeTxGetters uint32,
	refreshInterval time.Duration,
	timeTxGetterInterval time.Duration,
	timeTxsToGet uint32,
	logger logging.Logger,
) AccountCache {
	ac, _ := (&accountCache{Logger: logger}).WithOptions(
		kc, workers, cacheSyncers, timeTxGetters, refreshInterval, timeTxGetterInterval, timeTxsToGet)
	return ac
}
