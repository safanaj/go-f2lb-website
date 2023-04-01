package poolcache

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

	// koios "github.com/cardano-community/koios-go-client"
	ku "github.com/safanaj/go-f2lb/pkg/caches/koiosutils"
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
		AddedItems() uint32
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

		IsTickerMissingFromKoiosPoolList(string) bool
		FillMissingPoolInfos(map[string]string)
		GetMissingPoolInfos() []string
	}

	PoolInfo interface {
		Ticker() string
		IdBech32() string
		IdHex() string
		VrfKeyHash() string
		ActiveStake() uint32
		LiveStake() uint32
		LiveDelegators() uint32
		BlockHeight() uint32
		SetBlockHeight(uint32)
	}
)

type poolInfo struct {
	ticker         string
	bech32         string
	hex            string
	activeStake    uint32
	liveStake      uint32
	liveDelegators uint32
	// vrfKeyHash     [32]byte
	vrfKeyHash  string
	blockHeight uint32
}

var (
	_ encoding.BinaryMarshaler   = (*poolInfo)(nil)
	_ encoding.BinaryUnmarshaler = (*poolInfo)(nil)
)

func (pi *poolInfo) Ticker() string          { return pi.ticker }
func (pi *poolInfo) IdBech32() string        { return pi.bech32 }
func (pi *poolInfo) IdHex() string           { return pi.hex }
func (pi *poolInfo) VrfKeyHash() string      { return pi.vrfKeyHash }
func (pi *poolInfo) ActiveStake() uint32     { return pi.activeStake }
func (pi *poolInfo) LiveStake() uint32       { return pi.liveStake }
func (pi *poolInfo) LiveDelegators() uint32  { return pi.liveDelegators }
func (pi *poolInfo) BlockHeight() uint32     { return pi.blockHeight }
func (pi *poolInfo) SetBlockHeight(h uint32) { pi.blockHeight = h }

func (pi *poolInfo) MarshalBinary() (data []byte, err error) {
	var buf bytes.Buffer
	_, err = fmt.Fprintln(&buf, pi.ticker, pi.bech32, pi.hex, pi.activeStake, pi.liveStake, pi.liveDelegators, pi.vrfKeyHash)
	return buf.Bytes(), err
}

func (pi *poolInfo) UnmarshalBinary(data []byte) error {
	buf := bytes.NewBuffer(data)
	_, err := fmt.Fscanln(buf, &pi.ticker, &pi.bech32, &pi.hex, &pi.activeStake, &pi.liveStake, &pi.liveDelegators, &pi.vrfKeyHash)
	return err
}

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

	cachesStoreDir string

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

	missingFinished        chan any
	missingCtxCancel       func()
	missingCh              chan any
	missingMu              sync.RWMutex
	missingTickersFromList map[string]any
}

var (
	_ PoolCache      = (*poolCache)(nil)
	_ gob.GobEncoder = (*poolCache)(nil)
	_ gob.GobDecoder = (*poolCache)(nil)
)

func (pc *poolCache) cacheSyncer() {
	maybeNotifyWaiter := func(pc *poolCache) {
		chp := unsafe.Pointer(&pc.readyWaiterCh)
		ch := *((*chan any)(atomic.LoadPointer(&chp)))
		if ch != nil {
			select {
			case <-ch:
			default:
				if pc.Ready() {
					select {
					case <-ch:
					default:
						close(ch)
					}
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
				pc.V(2).Info("cache syncer deleted", "item", v, "now len", pc.Len(),
					"addeditems", pc.addeditems, "nitems", pc.nitems)
				pc.cache2.Delete(old.(*poolInfo).bech32)
			}
			maybeNotifyWaiter(pc)
		case *poolInfo:
			// add to cache
			if old, loaded := pc.cache.LoadOrStore(v.ticker, v); loaded {
				// check for overridable fields, better an old value than a zero value
				if v.activeStake == 0 {
					v.activeStake = old.(*poolInfo).activeStake
				}
				if v.liveStake == 0 {
					v.liveStake = old.(*poolInfo).liveStake
				}
				if v.liveDelegators == 0 {
					v.liveDelegators = old.(*poolInfo).liveDelegators
				}
				if v.vrfKeyHash == "" {
					// copy(v.vrfKeyHash[:], old.(*poolInfo).vrfKeyHash[:])
					v.vrfKeyHash = old.(*poolInfo).vrfKeyHash
				}
				pc.cache.Store(v.ticker, v)
				pc.cache2.Store(v.bech32, v)
			} else {
				atomic.AddUint32(&pc.nitems, uint32(1))
				pc.cache2.Store(v.bech32, v)
				pc.V(2).Info("cache syncer added", "item", v.ticker, "now len", pc.Len(),
					"addeditems", pc.addeditems, "nitems", pc.nitems)
			}
			maybeNotifyWaiter(pc)
		}
	}
}

func (c *poolCache) GobEncode() ([]byte, error) {
	if c.running {
		return nil, fmt.Errorf("Impossible GOB encode a running pool cache")
	}
	if c.cache == nil {
		return nil, fmt.Errorf("Impossible GOB encode an uninitialized pool cache")
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

func (c *poolCache) GobDecode(dat []byte) error {
	if c.running {
		return fmt.Errorf("Impossible GOB decode a running pool cache")
	}
	if c.cache == nil {
		return fmt.Errorf("Impossible GOB decode an uninitialized pool cache")
	}
	buf := bytes.NewBuffer(dat)
	nitems := 0
	defer func() {
		atomic.StoreUint32(&c.addeditems, uint32(nitems))
		atomic.StoreUint32(&c.nitems, uint32(nitems))
	}()
	for {
		if elt, err := buf.ReadBytes(byte('\n')); err == nil || err == io.EOF {
			pi := &poolInfo{}
			if err := pi.UnmarshalBinary(elt); err != nil {
				return err
			}
			c.cache.Store(pi.ticker, pi)
			nitems++
			if pi.bech32 != "" {
				c.cache2.Store(pi.bech32, pi)
			}
			if err == io.EOF {
				return err
			}
		} else {
			return err
		}
	}
}

func (c *poolCache) poolListOrPoolInfosGetter(end context.Context) {
	d := time.Duration(c.workersInterval)
	t := time.NewTimer(d)

	defer c.workersWg.Done()

	go func() {
		round := 1
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
				for t := range tickers {
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
					for t := range tickers {
						if _, ok := t2p[t]; !ok {
							c.missingCh <- t
						}
					}
				}
				for t, p := range t2p {
					c.V(4).Info("GetTickerToPoolIdMapFor: Forwarding poolInfo", "ticker", t, "bech32", p, "hex", utils.Bech32ToHexOrDie(p))
					pi := &poolInfo{
						ticker: t,
						bech32: p,
						hex:    utils.Bech32ToHexOrDie(p),
					}
					c.infoCh <- pi
					c.workersCh <- pi
				}
				return nil
			}, &tickers)
		}

		getAndResetPoolInfos := func() {
			getAndReset(func() error {
				pids_l := []string{}
				t2p := make(map[string]string)
				for pid, pi := range poolids {
					pids_l = append(pids_l, pid)
					t2p[pi.(*poolInfo).ticker] = pid
				}
				if len(pids_l) == 0 {
					return nil
				}
				// do a GetPoolInfos ....
				c.V(3).Info("GetPoolsInfos: Processing t2p", "len", len(t2p), "poolids len", len(pids_l))
				p2i, err := c.kc.GetPoolsInfos(pids_l...)
				if err != nil {
					return err
				}
				c.V(3).Info("GetPoolsInfos: Got p2i", "len", len(p2i), "poolids len", len(pids_l))
				for p, i := range p2i {
					c.V(4).Info("GetPoolsInfos (p2i): Forwarding poolInfo", "ticker", i.Ticker, "bech32", p, "hex", utils.Bech32ToHexOrDie(p))
					pi := &poolInfo{
						ticker:         i.Ticker,
						bech32:         p,
						hex:            utils.Bech32ToHexOrDie(p),
						activeStake:    i.ActiveStake,
						liveStake:      i.LiveStake,
						liveDelegators: i.LiveDelegators,
						vrfKeyHash:     i.VrfKeyHash,
					}
					// copy(pi.vrfKeyHash[:], []byte(i.VrfKeyHash))
					c.infoCh <- pi
					c.missingCh <- string(append([]rune{'-'}, []rune(i.Ticker)...))
					delete(t2p, i.Ticker)
				}
				if len(t2p) > 0 {
					for t, p := range t2p {
						c.V(4).Info("GetPoolsInfos (t2p): Forwarding poolInfo", "ticker", t, "bech32", p, "hex", utils.Bech32ToHexOrDie(p))
						c.infoCh <- &poolInfo{
							ticker: t,
							bech32: p,
							hex:    utils.Bech32ToHexOrDie(p),
						}
						c.missingCh <- string(append([]rune{'-'}, []rune(t)...))
					}
				}
				return nil
			}, &poolids)
		}

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
					if len(poolids) == npools || len(poolids) > int(c.poolInfosToGet) {
						getAndResetPoolInfos()
					}

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
				case *poolInfo:
					poolids[v.bech32] = v
					if len(poolids) > int(c.poolInfosToGet) {
						getAndResetPoolInfos()
					}
				}
			}
		}
	}()
}

func (pc *poolCache) manageMissingTickers(end context.Context) {
	defer close(pc.missingFinished)
	for {
		select {
		case <-end.Done():
			return
		case vI, stillOpen := <-pc.missingCh:
			if !stillOpen {
				return
			}
			switch v := vI.(type) {
			case string:
				if len(v) == 0 {
					continue
				}
				if []rune(v)[0] == '-' {
					pc.missingMu.Lock()
					pc.V(5).Info("MissingTickers: deleting", "ticker", v, "len", len(pc.missingTickersFromList))
					if _, ok := pc.missingTickersFromList[string([]rune(v)[1:])]; ok {
						delete(pc.missingTickersFromList, string([]rune(v)[1:]))
						atomic.AddUint32(&pc.addeditems, uint32(1))
						pc.V(4).Info("MissingTickers: increased addeditems for missing one",
							"ticker", string([]rune(v)[1:]),
							"addeditems", pc.addeditems, "nitems", pc.nitems)
						pc.V(5).Info("MissingTickers: deleted", "len", len(pc.missingTickersFromList))
					}
					pc.missingMu.Unlock()
				} else {
					pc.missingMu.Lock()
					pc.V(5).Info("MissingTickers: adding", "ticker", v, "len", len(pc.missingTickersFromList))
					if _, ok := pc.missingTickersFromList[v]; !ok {
						pc.missingTickersFromList[v] = struct{}{}
						atomic.AddUint32(&pc.addeditems, ^uint32(0))
						pc.V(4).Info("MissingTickers: decreased addeditems for missing one",
							"ticker", v, "addeditems", pc.addeditems, "nitems", pc.nitems)
						pc.V(5).Info("MissingTickers: added", "ticker", v, "len", len(pc.missingTickersFromList))
					}
					pc.missingMu.Unlock()
				}
			}
		}
	}
}

func (pc *poolCache) GetMissingPoolInfos() []string {
	missing := []string{}
	pc.missingMu.RLock()
	defer pc.missingMu.RUnlock()
	for t, _ := range pc.missingTickersFromList {
		missing = append(missing, t)
	}
	return missing
}

func (pc *poolCache) FillMissingPoolInfos(p2t map[string]string) {
	if !pc.running {
		return
	}
	isEmpty := pc.Len() == 0
	for p, t := range p2t {
		if !isEmpty {
			if _, ok := pc.cache.Load(t); !ok {
				atomic.AddUint32(&pc.addeditems, uint32(1))
				pc.V(4).Info("FillMissingPoolInfos: increased addeditems for missing one",
					"increased by", 1, "ticker", t, "addeditems", pc.addeditems, "nitems", pc.nitems)
			}
		}
		pc.workersCh <- &poolInfo{ticker: t, bech32: p}
	}
	if isEmpty {
		atomic.AddUint32(&pc.addeditems, uint32(len(p2t)))
		pc.V(4).Info("FillMissingPoolInfos: increased addeditems", "increased by", len(p2t))
	}
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

func (pc *poolCache) IsTickerMissingFromKoiosPoolList(t string) bool {
	pc.missingMu.RLock()
	defer pc.missingMu.RUnlock()
	_, ok := pc.missingTickersFromList[t]
	return !ok
}

func (pc *poolCache) Len() uint32 { return pc.nitems }
func (pc *poolCache) Pending() uint32 {
	if pc.addeditems >= pc.nitems {
		return pc.addeditems - pc.nitems
	} else {
		return uint32(len(pc.missingTickersFromList))
	}
}
func (pc *poolCache) AddedItems() uint32 { return pc.addeditems }
func (pc *poolCache) IsRunning() bool    { return pc.running }
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
	pc.cache.Range(func(_, v any) bool {
		pc.workersCh <- v.(*poolInfo)
		return true
	})
}

func (c *poolCache) maybeLoadFromDisk() {
	if c.running || c.cache == nil || c.cachesStoreDir == "" {
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

	fn := filepath.Join(c.cachesStoreDir, "poolcache.gob")
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

func (c *poolCache) maybeStoreToDisk() {
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
				c.Error(err, "creating dir failed")
				return
			}
		} else {
			c.Error(err, "getting dir stat")
			return
		}
	} else {
		if !(fi.Mode().IsDir() && ((fi.Mode().Perm() & 0700) == 0700)) {
			c.Error(err, "is not a dir or bad perm")
			return
		}
	}

	fn := filepath.Join(c.cachesStoreDir, "poolcache.gob")
	if f, err := os.OpenFile(fn, os.O_WRONLY|os.O_CREATE, 0600); err != nil {
		c.Error(err, "opening/creating file failed")
		return
	} else {
		if err := gob.NewEncoder(f).Encode(c); err != nil {
			c.Error(err, "Gob encode failed")
		}
		f.Close()
	}
	return
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

	pc.missingFinished = make(chan any)
	ctx, ctxCancel = context.WithCancel(pc.kc.GetContext())
	pc.missingCtxCancel = ctxCancel
	pc.missingCh = make(chan any)
	go pc.manageMissingTickers(ctx)

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

	pc.missingCtxCancel()
	<-pc.missingFinished
	pc.V(2).Info("PoolCache missing manager stopped")

	close(pc.infoCh)
	pc.cacheSyncerWg.Wait()
	pc.V(2).Info("PoolCache cache syncer stopped")
	pc.V(2).Info("PoolCache stopped")

	pc.maybeStoreToDisk()
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

	if pc.missingTickersFromList == nil {
		newPoolCache.missingTickersFromList = make(map[string]any)
	} else {
		newPoolCache.missingTickersFromList = pc.missingTickersFromList
	}

	newPoolCache.Logger = pc.Logger
	newPoolCache.cachesStoreDir = pc.cachesStoreDir
	newPoolCache.maybeLoadFromDisk()
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
	cachesStoreDir string,
) PoolCache {
	pc, _ := (&poolCache{Logger: logger, cachesStoreDir: cachesStoreDir}).WithOptions(
		kc, workers, cacheSyncers, refreshInterval, workersInterval, poolInfosToGet)
	return pc
}
