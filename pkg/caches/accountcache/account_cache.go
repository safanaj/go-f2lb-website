package accountcache

import (
	"bytes"
	"context"
	"encoding"
	"encoding/gob"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sync"
	"sync/atomic"
	"time"
	"unsafe"

	// koios "github.com/cardano-community/koios-go-client/v2"
	bfu "github.com/safanaj/go-f2lb/pkg/caches/blockfrostutils"
	ku "github.com/safanaj/go-f2lb/pkg/caches/koiosutils"

	// "github.com/safanaj/go-f2lb/pkg/ccli"
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
		AddedItems() uint32
		Ready() bool
		WaitReady(time.Duration) bool
		IsRunning() bool
		RefreshMember(string) error
		Refresh()
		Start()
		Stop()
		WithOptions(
			kc *ku.KoiosClient,
			bfc *bfu.BlockFrostClient,
			workers uint32,
			cacheSyncers uint32,
			refreshInterval time.Duration,
			workersInterval time.Duration,
			accountInfosToGet uint32,
		) (AccountCache, error)
	}

	AccountInfo interface {
		StakeAddress() string
		DelegatedPool() string
		AdaAmount() uint64
		Status() string
	}
)

type accountInfo struct {
	stakeAddress          string
	delegatedPoolIdBech32 string
	adaAmount             uint64
	status                string
	// deprecated on koios v2
	//lastDelegationTime    time.Time
	storeDone chan struct{}
}

var (
	_ encoding.BinaryMarshaler   = (*accountInfo)(nil)
	_ encoding.BinaryUnmarshaler = (*accountInfo)(nil)
)

func (ai *accountInfo) StakeAddress() string  { return ai.stakeAddress }
func (ai *accountInfo) DelegatedPool() string { return ai.delegatedPoolIdBech32 }
func (ai *accountInfo) AdaAmount() uint64     { return ai.adaAmount }
func (ai *accountInfo) Status() string        { return ai.status }

// deprecated on koios v2
// func (ai *accountInfo) LastDelegationTime() time.Time { return ai.lastDelegationTime }

func (ai *accountInfo) MarshalBinary() (data []byte, err error) {
	var buf bytes.Buffer
	fmt.Fprintln(&buf, ai.stakeAddress, ai.delegatedPoolIdBech32, ai.adaAmount)
	return buf.Bytes(), nil
}

func (ai *accountInfo) UnmarshalBinary(data []byte) error {
	buf := bytes.NewBuffer(data)
	_, err := fmt.Fscanln(buf, &ai.stakeAddress, &ai.delegatedPoolIdBech32, &ai.adaAmount)
	return err
}

type accountCache struct {
	logging.Logger

	refreshInterval    time.Duration
	refresherTick      *time.Ticker
	refresherFinished  chan any
	refresherCtxCancel func()

	addeditems uint32
	nitems     uint32
	cache      *sync.Map

	cachesStoreDir string

	kc  *ku.KoiosClient
	bfc *bfu.BlockFrostClient

	running bool

	cacheSyncers  uint32
	cacheSyncerWg sync.WaitGroup
	infoCh        chan any

	workers   uint32
	workersWg sync.WaitGroup
	workersCh chan any

	workersInterval   time.Duration
	accountInfosToGet uint32

	// timeTxGetterCtxCancel func()
	// // timeTxGetterFinished  chan any
	// timeTxGetterInterval time.Duration
	// timeTxGetterCh       chan txItem
	// timeTxGetters        uint32
	// timeTxGetterWg       sync.WaitGroup
	// timeTxsToGet         uint32

	readyWaiterCh chan any
}

var (
	_ AccountCache   = (*accountCache)(nil)
	_ gob.GobEncoder = (*accountCache)(nil)
	_ gob.GobDecoder = (*accountCache)(nil)
)

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
			storeDone := v.storeDone
			v.storeDone = nil
			// add to cache
			if _, loaded := ac.cache.LoadOrStore(v.stakeAddress, v); loaded {
				ac.cache.Store(v.stakeAddress, v)
			} else {
				atomic.AddUint32(&ac.nitems, uint32(1))
				ac.V(2).Info("cache syncer added", "item", v.stakeAddress, "now len", ac.Len())
			}
			if storeDone != nil {
				select {
				case <-storeDone:
				default:
					close(storeDone)
				}
			}
			maybeNotifyWaiter(ac)
		}
	}
}

func (c *accountCache) GobEncode() ([]byte, error) {
	if c.running {
		return nil, fmt.Errorf("Impossible GOB encode a running account cache")
	}
	if c.cache == nil {
		return nil, fmt.Errorf("Impossible GOB encode an uninitialized account cache")
	}
	var buf bytes.Buffer
	var err error
	c.cache.Range(func(k, v any) bool {
		if dat, e := v.(encoding.BinaryMarshaler).MarshalBinary(); e != nil {
			err = e
			return false
		} else {
			if _, e := buf.Write(dat); e != nil {
				err = e
				return false
			}
			return true
		}
	})
	return buf.Bytes(), err
}

func (c *accountCache) GobDecode(dat []byte) error {
	if c.running {
		return fmt.Errorf("Impossible GOB decode a running account cache")
	}
	if c.cache == nil {
		return fmt.Errorf("Impossible GOB decode an uninitialized account cache")
	}
	buf := bytes.NewBuffer(dat)
	nitems := 0
	defer func() {
		atomic.StoreUint32(&c.addeditems, uint32(nitems))
		atomic.StoreUint32(&c.nitems, uint32(nitems))
	}()
	for {
		if elt, err := buf.ReadBytes(byte('\n')); err == nil || err == io.EOF {
			ai := &accountInfo{}
			if err := ai.UnmarshalBinary(elt); err != nil {
				return err
			}
			c.cache.Store(ai.stakeAddress, ai)
			nitems++
			if err == io.EOF {
				return err
			}
		} else {
			return err
		}
	}
}

func (c *accountCache) accountsInfosGetter(end context.Context) {
	d := time.Duration(c.workersInterval)
	t := time.NewTimer(d)

	defer c.workersWg.Done()

	go func() {
		round := 1
		naddrs := 0
		infos := make(map[string]any)

		getAndReset := func(f func() error) {
			err := f()
			if err != nil {
				c.Error(err, "accountCache.getAndReset")
			}
			// reset everything
			round = 0
			naddrs = 0
			infos = make(map[string]any)
		}

		// TODO: manage from koios missing accounts
		getAndResetAccountsInfos := func() {
			getAndReset(func() error {
				saddrs_l := []string{}
				for sa := range infos {
					saddrs_l = append(saddrs_l, sa)
				}
				if len(saddrs_l) == 0 {
					return nil
				}
				c.V(3).Info("GetStakeAddressesInfos: Processing stake addresses", "len", len(saddrs_l))
				sa2ai, err := c.kc.GetStakeAddressesInfos(saddrs_l...)
				if err != nil {
					return err
				}
				c.V(3).Info("GetStakeAddressesInfos: Got sa2ai", "len", len(sa2ai), "saddrs len", len(saddrs_l))
				for _, ai := range sa2ai {
					c.V(4).Info("GetStakeAddressesInfos (sa2ai): Forwarding accountInfo",
						"stakeAddress", ai.Bech32, "delegated pool", ai.DelegatedPool, "amount", ai.TotalAda, "status", ai.Status)
					aInfo := &accountInfo{
						stakeAddress:          ai.Bech32,
						delegatedPoolIdBech32: ai.DelegatedPool,
						adaAmount:             uint64(ai.TotalAda),
						status:                ai.Status,
					}
					c.infoCh <- aInfo
				}
				return nil
			})
		}

		for {
			select {
			case <-end.Done():
				return
			case <-t.C:
				// collect strings
				if round > 0 && (len(infos) == naddrs || len(infos) > int(c.accountInfosToGet)) {
					getAndResetAccountsInfos()
				} else {
					if round == 0 && len(infos) == naddrs {
						round++
					}
					naddrs = len(infos)
				}

				t.Reset(d)
			case xI, more := <-c.workersCh:
				if !more {
					return
				}
				c.V(4).Info("worker", "got", xI)
				switch v := xI.(type) {
				case string:
					infos[v] = struct{}{}
					if len(infos) > int(c.accountInfosToGet) {
						getAndResetAccountsInfos()
					}
				}
			}
		}
	}()
}

func (ac *accountCache) RefreshMember(saddr string) error {
	ac.V(3).Info("GetStakeAddressesInfos: Processing stake addresses", "saddr", saddr)
	sa2ai, err := ac.kc.GetStakeAddressesInfos(saddr)
	if err != nil {
		return err
	}
	ac.V(3).Info("GetStakeAddressesInfos: Got sa2ai", "len", len(sa2ai), "saddr", saddr)
	if len(sa2ai) == 0 {
		return fmt.Errorf("RefreshMember: member %q not found", saddr)
	}
	for _, ai := range sa2ai {
		ac.V(4).Info("GetStakeAddressesInfos (sa2ai): Forwarding accountInfo",
			"stakeAddress", ai.Bech32, "delegated pool", ai.DelegatedPool, "amount", ai.TotalAda, "status", ai.Status)
		aInfo := &accountInfo{
			stakeAddress:          ai.Bech32,
			delegatedPoolIdBech32: ai.DelegatedPool,
			adaAmount:             uint64(ai.TotalAda),
			status:                ai.Status,
			storeDone:             make(chan struct{}),
		}
		ac.infoCh <- aInfo
		<-aInfo.storeDone
	}
	return nil
}

// deprecated on koios v2
// func (ac *accountCache) lastDelegOrAccountInfoGetter(end context.Context) {
// 	defer ac.workersWg.Done()
// 	for item := range ac.workersCh {
// 		// fmt.Printf("worker got: %v\n", item)
// 		ac.V(4).Info("worker", "got", item)
// 		switch v := item.(type) {
// 		case string:
// 			tx, err := ac.kc.GetLastDelegationTx(v)
// 			if err != nil {
// 				ac.Error(err, "workers.GetLastDelegationTx()", "item", v)
// 				// we have stopped some accounts from that cacheing path, so remove them from the added count
// 				// to allow the cache to be ready
// 				// atomic.AddUint32(&ac.addeditems, ^uint32(0))
// 				ac.V(3).Info("sending to workersCh", "saddr", v, "t", time.Time{})
// 				go func() {
// 					ac.workersCh <- txTime{saddr: v, t: time.Time{}}
// 					ac.V(3).Info("sent to workersCh", "saddr", v, "t", time.Time{})
// 				}()
// 				// return
// 			} else {
// 				ac.timeTxGetterCh <- txItem{v, tx}
// 			}
// 		case txTime:
// 			delegatedPool, totalAda, err := ac.kc.GetStakeAddressInfo(v.saddr)
// 			if err != nil {
// 				ac.Error(err, "workers.GetStakeAddressInfo() - koios", "stake address", v.saddr)
// 				// we have stopped some accounts from that cacheing path, so remove them from the added count
// 				// to allow the cache to be ready
// 				// atomic.AddUint32(&ac.addeditems, ^uint32(0))
// 				delegatedPool, totalAda, err = ac.bfc.GetStakeAddressInfo(v.saddr)
// 				if err != nil {
// 					ac.Error(err, "workers.GetStakeAddressInfo() - blockfrost", "stake address", v.saddr)

// 					cctx, _ := context.WithTimeout(end, 10*time.Second)
// 					delegatedPool, err = ccli.GetDelegatedPoolForStakeAddress(cctx, v.saddr)
// 					if err != nil {
// 						ac.Error(err, "workers.GetDelegatedPoolForStakeAddress() - using ccli", "stake address", v.saddr)
// 						atomic.AddUint32(&ac.addeditems, ^uint32(0))
// 						continue
// 					}
// 				}
// 			}
// 			ac.infoCh <- &accountInfo{
// 				stakeAddress:          v.saddr,
// 				delegatedPoolIdBech32: delegatedPool,
// 				adaAmount:             uint64(totalAda),
// 				lastDelegationTime:    v.t,
// 			}
// 		}
// 	}
// }

// deprecated on koios v2
// func (ac *accountCache) txsTimesGetter(end context.Context) {
// 	d := time.Duration(ac.timeTxGetterInterval)
// 	t := time.NewTimer(d)

// 	// defer close(ac.timeTxGetterFinished)
// 	defer ac.timeTxGetterWg.Done()
// 	go func() {

// 		round := 0
// 		ntxs := 0
// 		txs := make(map[koios.TxHash]any)
// 		tx2saddr := make(map[koios.TxHash]string)
// 		saddr2time := make(map[string]time.Time)

// 		getAndReset := func(f func() error) {
// 			err := f()
// 			if err != nil {
// 				ac.Error(err, "accountCache.getAndReset")
// 			}
// 			// reset everything
// 			round = 0
// 			ntxs = 0
// 			txs = make(map[koios.TxHash]any)
// 			tx2saddr = make(map[koios.TxHash]string)
// 			saddr2time = make(map[string]time.Time)
// 		}

// 		getAndResetTxsTimes := func() {
// 			getAndReset(func() error {
// 				txs_ := make([]koios.TxHash, 0, len(txs))
// 				for k, _ := range txs {
// 					txs_ = append(txs_, k)
// 				}
// 				if len(txs_) == 0 {
// 					return nil
// 				}
// 				tx2time, err := ac.kc.GetTxsTimes(txs_)
// 				if err == nil {
// 					ac.V(3).Info("accountCache.txsTimesGetter: GetTxsTimes(txs)", "got len", len(tx2time), "ntxs", ntxs)
// 					if len(saddr2time) < ntxs {
// 						// we have stopped some accounts from that cacheing path, so remove them from the added count
// 						// to allow the cache to be ready
// 						atomic.AddUint32(&ac.addeditems, ^uint32(ntxs-len(saddr2time)-1))
// 					}

// 					for tx, t := range tx2time {
// 						if saddr, ok := tx2saddr[tx]; ok {
// 							saddr2time[saddr] = t
// 						}
// 					}
// 					// fmt.Printf("accountCache.txsTimesGetter: flow %d accounts\n", len(saddr2time))
// 					ac.V(3).Info("accountCache.txsTimesGetter", "flow len", len(saddr2time))
// 					for saddr, t := range saddr2time {
// 						ac.workersCh <- txTime{saddr, t}
// 					}
// 				} else {
// 					ac.Error(err, "accountCache.txsTimesGetter: GetTxsTimes(txs)")
// 					return err
// 				}
// 				return nil
// 			})
// 		}

// 		for {
// 			select {
// 			case <-end.Done():
// 				return
// 			case <-t.C:
// 				if (round > 0 && len(txs) == ntxs) || len(txs) > int(ac.timeTxsToGet) {
// 					getAndResetTxsTimes()
// 				} else {
// 					if round == 0 && len(txs) == ntxs && ntxs > 0 {
// 						round++
// 					}
// 					ntxs = len(txs)
// 				}
// 				t.Reset(d)

// 			case txi, stillOpen := <-ac.timeTxGetterCh:
// 				if stillOpen {
// 					txs[txi.tx] = struct{}{}
// 					tx2saddr[txi.tx] = txi.saddr
// 					saddr2time[txi.saddr] = time.Time{}
// 				} else {
// 					return
// 				}
// 				if len(txs) > int(ac.timeTxsToGet) {
// 					getAndResetTxsTimes()
// 				}
// 			}
// 		}
// 	}()
// }

func (ac *accountCache) addMany(saddrs []string) {
	if !ac.running {
		return
	}
	// isEmpty := ac.Len() == 0
	for _, saddr := range saddrs {
		// if !isEmpty {
		if _, ok := ac.cache.Load(saddr); !ok {
			atomic.AddUint32(&ac.addeditems, uint32(1))
		}
		// }
		ac.workersCh <- saddr
	}
	// if isEmpty {
	// 	atomic.AddUint32(&ac.addeditems, uint32(len(saddrs)))
	// }
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

func (ac *accountCache) Len() uint32        { return ac.nitems }
func (ac *accountCache) Pending() uint32    { return ac.addeditems - ac.nitems }
func (ac *accountCache) AddedItems() uint32 { return ac.addeditems }
func (ac *accountCache) IsRunning() bool    { return ac.running }
func (ac *accountCache) Ready() bool {
	ac.V(5).Info("AccountCache.Status",
		"ready", ac.nitems == ac.addeditems, "nitems", ac.nitems, "addeditems", ac.addeditems, "pending", ac.Pending())
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

func (c *accountCache) maybeLoadFromDisk() {
	if c.running || c.cache == nil || c.cachesStoreDir == "" {
		return
	}
	fi, err := os.Stat(c.cachesStoreDir)
	if err != nil {
		return
		if os.IsNotExist(err) {
			if err := os.MkdirAll(c.cachesStoreDir, 0700); err != nil {
				return
			}
		} else {
			return
		}
	} else {
		if !(fi.Mode().IsDir() && ((fi.Mode().Perm() & 0700) == 0700)) {
			return
		}
	}

	fn := filepath.Join(c.cachesStoreDir, "accountcache.gob")
	fi, err = os.Stat(fn)
	if err != nil {
		c.Error(err, "file stat failed")
		return
	}
	if !(fi.Mode().IsRegular() && ((fi.Mode().Perm() & 0600) == 0600)) {
		return
	}

	if f, err := os.OpenFile(fn, os.O_RDONLY, 0400); err != nil {
		c.Error(err, "OpenFile failed")
		return
	} else {
		if err := gob.NewDecoder(f).Decode(c); err != nil && err != io.EOF {
			c.Error(err, "Gob decode failed")
		}
		f.Close()
	}
	c.V(2).Info("maybeLoadFromDisk", "addeditems", c.addeditems, "nitems", c.nitems)
	return
}

func (c *accountCache) maybeStoreToDisk() {
	if c.running || c.cache == nil || c.cachesStoreDir == "" {
		return
	}
	if c.Len() == 0 {
		return
	}

	fi, err := os.Stat(c.cachesStoreDir)
	if err != nil {
		if os.IsNotExist(err) {
			if err := os.MkdirAll(c.cachesStoreDir, 0700); err != nil {
				return
			}
		} else {
			return
		}
	} else {
		if !(fi.Mode().IsDir() && ((fi.Mode().Perm() & 0700) == 0700)) {
			return
		}
	}

	fn := filepath.Join(c.cachesStoreDir, "accountcache.gob")
	if f, err := os.OpenFile(fn, os.O_WRONLY|os.O_CREATE, 0600); err != nil {
		return
	} else {
		if err := gob.NewEncoder(f).Encode(c); err != nil {
			c.Error(err, "Gob encode failed")
		}
		f.Close()
	}
	return
}

func (ac *accountCache) Start() {
	if ac.running {
		return
	}
	ac.refresherFinished = make(chan any)
	ac.workersCh = make(chan any)
	ac.infoCh = make(chan any)

	ac.cacheSyncerWg.Add(int(ac.cacheSyncers))
	for i := 0; i < int(ac.cacheSyncers); i++ {
		go ac.cacheSyncer()
	}

	ctx, ctxCancel := context.WithCancel(ac.kc.GetContext())

	ac.workersWg.Add(int(ac.workers))
	for i := 0; i < int(ac.workers); i++ {
		go ac.accountsInfosGetter(ctx)
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

	ac.V(2).Info("AccountCache timeTxGetter stopped")
	ac.refresherTick.Stop()
	ac.refresherCtxCancel()
	<-ac.refresherFinished
	ac.V(2).Info("AccountCache refresher stopped")

	close(ac.workersCh)
	ac.workersWg.Wait()
	ac.V(2).Info("AccountCache workers stopped")

	close(ac.infoCh)
	ac.V(2).Info("AccountCache closed cacheSyncer channel")
	ac.cacheSyncerWg.Wait()
	ac.V(2).Info("AccountCache cacheSyncer stopped")
	ac.V(2).Info("AccountCache stopped")

	ac.maybeStoreToDisk()
}

func (ac *accountCache) WithOptions(
	kc *ku.KoiosClient,
	bfc *bfu.BlockFrostClient,
	workers uint32,
	cacheSyncers uint32,
	refreshInterval time.Duration,
	workersInterval time.Duration,
	accountInfosToGet uint32,
) (AccountCache, error) {
	if ac.running {
		return nil, fmt.Errorf("AccountCache is running")
	}
	newAccountCache := &accountCache{
		kc:                kc,
		bfc:               bfc,
		workers:           workers,
		cacheSyncers:      cacheSyncers,
		refreshInterval:   refreshInterval,
		workersInterval:   workersInterval,
		accountInfosToGet: accountInfosToGet,
	}
	if ac.cache == nil {
		newAccountCache.cache = new(sync.Map)
	} else {
		newAccountCache.cache = ac.cache
	}
	newAccountCache.Logger = ac.Logger
	newAccountCache.cachesStoreDir = ac.cachesStoreDir
	newAccountCache.maybeLoadFromDisk()
	return newAccountCache, nil
}

func New(
	kc *ku.KoiosClient,
	bfc *bfu.BlockFrostClient,
	workers uint32,
	cacheSyncers uint32,
	refreshInterval time.Duration,
	workersInterval time.Duration,
	accountInfosToGet uint32,
	logger logging.Logger,
	cachesStoreDir string,
) AccountCache {
	ac, _ := (&accountCache{Logger: logger, cachesStoreDir: cachesStoreDir}).WithOptions(
		kc, bfc, workers, cacheSyncers, refreshInterval, workersInterval, accountInfosToGet)
	return ac
}
