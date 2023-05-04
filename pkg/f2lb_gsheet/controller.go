package f2lb_gsheet

import (
	"context"
	"fmt"
	"runtime"
	"strconv"
	"sync"
	"sync/atomic"
	"time"

	"google.golang.org/api/sheets/v4"

	koios "github.com/cardano-community/koios-go-client/v3"
	"github.com/safanaj/go-f2lb/pkg/caches/accountcache"
	"github.com/safanaj/go-f2lb/pkg/caches/blockfrostutils"
	"github.com/safanaj/go-f2lb/pkg/caches/koiosutils"
	"github.com/safanaj/go-f2lb/pkg/caches/poolcache"
	"github.com/safanaj/go-f2lb/pkg/f2lb_members"
	"github.com/safanaj/go-f2lb/pkg/logging"
	"github.com/safanaj/go-f2lb/pkg/utils"
)

type ValueRange = sheets.ValueRange

var (
	defaultRefreshInterval = time.Duration(1 * time.Hour)
	IsRunningErr           = fmt.Errorf("Controller is running")

	poolsHintsPath = ""

	cachesStoreDirPath = ""
	// account cache flags
	acWorkers           = 10
	acCacheSyncers      = 5
	acAccountInfosToGet = 50
	acRefreshInterval   = time.Duration(30 * time.Minute)
	acWorkersInterval   = time.Duration(1 * time.Minute)

	// pool cache flags
	pcWorkers         = 10
	pcCacheSyncers    = 5
	pcPoolInfosToGet  = 50
	pcRefreshInterval = time.Duration(30 * time.Minute)
	pcWorkersInterval = time.Duration(1 * time.Minute)

	// koios tip refresh interal
	koiosTipRefreshInterval = time.Duration(3 * time.Minute)
)

type Controller interface {
	Refresh() error

	GetF2LB() *F2LB

	GetMainQueue() *MainQueue
	GetMainQueueRecords() []*MainQueueRec
	GetMainQueueServed() *MainQueueRec

	GetAddonQueue() *AddonQueue
	GetAddonQueueRecords() []*AddonQueueRec
	GetAddonQueueServed() *AddonQueueRec

	GetSupporters() *Supporters
	GetSupportersRecords() []*Supporter

	GetDelegationCycle() *DelegationCycle

	SetRefresherChannel(chan<- string) error
	SetRefresherInterval(time.Duration) error
	GetLastRefreshTime() time.Time
	IsRunning() bool
	Start() error
	Stop() error

	GetStakePoolSet() f2lb_members.StakePoolSet
	GetAccountCache() accountcache.AccountCache
	GetPoolCache() poolcache.PoolCache

	GetKoiosClient() *koiosutils.KoiosClient

	GetTopOfQueues(int, int) (int, int, error)
	GetValuesInBatch() ([]*ValueRange, error)

	GetKoiosTipBlockHeight() int
}

type controller struct {
	logging.Logger

	ctx       context.Context
	f2lb      *F2LB
	kc        *koiosutils.KoiosClient
	ctxCancel context.CancelFunc

	accountCache accountcache.AccountCache
	poolCache    poolcache.PoolCache

	stakePoolSet f2lb_members.StakePoolSet

	mainQueue  *MainQueue
	addonQueue *AddonQueue
	supporters *Supporters
	delegCycle *DelegationCycle

	refreshInterval time.Duration
	tick            *time.Ticker
	refresherCh     chan<- string
	mu              sync.RWMutex
	isRefreshing    bool
	lastRefreshTime time.Time

	koiosTipBlockHeightCached int
}

var _ Controller = &controller{}

func NewController(ctx context.Context, logger logging.Logger) Controller {
	cctx, cctxCancel := context.WithCancel(ctx)
	kc := koiosutils.New(cctx)
	bfc := blockfrostutils.New(cctx)
	ac := accountcache.New(kc, bfc, uint32(acWorkers), uint32(acCacheSyncers),
		acRefreshInterval, acWorkersInterval, uint32(acAccountInfosToGet),
		logger.WithName("accountcache"), cachesStoreDirPath)
	pc := poolcache.New(kc, uint32(pcWorkers), uint32(pcCacheSyncers),
		pcRefreshInterval, pcWorkersInterval, uint32(pcPoolInfosToGet),
		logger.WithName("poolcache"), cachesStoreDirPath)
	return &controller{
		Logger:          logger,
		ctx:             ctx,
		f2lb:            NewF2LB(cctx),
		refreshInterval: defaultRefreshInterval,
		kc:              kc,
		ctxCancel:       cctxCancel,
		accountCache:    ac,
		poolCache:       pc,
		stakePoolSet:    f2lb_members.NewSet(ac, pc),
		mainQueue:       &MainQueue{},
		addonQueue:      &AddonQueue{},
		supporters:      &Supporters{},
		delegCycle:      &DelegationCycle{},
	}
}

type valueRangeIdx int64

const (
	mainQueueVRI valueRangeIdx = iota
	addonQueueVRI
	supportersVRI
	delegCycleVRI

	valueRangeIdxMax
)

func (c *controller) SetRefresherChannel(ch chan<- string) error {
	if c.IsRunning() {
		return IsRunningErr
	}
	c.refresherCh = ch
	return nil
}

func (c *controller) SetRefresherInterval(d time.Duration) error {
	if c.IsRunning() {
		return IsRunningErr
	}
	c.refreshInterval = d
	return nil
}

func (c *controller) GetValuesInBatch() ([]*ValueRange, error) {
	return c.getValuesInBatch()
}
func (c *controller) getValuesInBatch() ([]*ValueRange, error) {
	ranges := make([]string, valueRangeIdxMax)
	ranges[mainQueueVRI] = c.mainQueue.GetRange()
	ranges[addonQueueVRI] = c.addonQueue.GetRange()
	ranges[supportersVRI] = c.supporters.GetRange()
	ranges[delegCycleVRI] = c.delegCycle.GetRange()

	res, err := c.f2lb.Spreadsheets.Values.BatchGet(
		f2lbSpreadSheetID).MajorDimension("ROWS").Ranges(
		ranges...).Do()

	if err != nil {
		return nil, err
	}
	return res.ValueRanges, nil
}

func (c *controller) GetTopOfQueues(mainQueueValuesN, addonQueueValuesN int) (int, int, error) {
	return c.getTopOfQueues(mainQueueValuesN, addonQueueValuesN)
}
func (c *controller) getTopOfQueues(mainQueueValuesN, addonQueueValuesN int) (int, int, error) {
	ranges := make([]string, 2)
	ranges[mainQueueVRI] = c.mainQueue.GetRange()
	ranges[addonQueueVRI] = c.addonQueue.GetRange()
	// the trick here is change the ranges to get only the minumum number of columns for a number of rows that surely include the top of the queue
	runesMQ := []rune(ranges[mainQueueVRI])
	runesAQ := []rune(ranges[addonQueueVRI])
	ranges[mainQueueVRI] = string(append(runesMQ[:len(runesMQ)-1], []rune(fmt.Sprintf("G%d", mainQueueValuesN+10))...))
	ranges[addonQueueVRI] = string(append(runesAQ[:len(runesAQ)-1], []rune(fmt.Sprintf("B%d", addonQueueValuesN+10))...))

	res, err := c.f2lb.Spreadsheets.Get(f2lbSpreadSheetID).Ranges(ranges...).IncludeGridData(true).Do()
	if err != nil {
		return -1, -1, err
	}

	idxs := []int{-1, -1}
	for sheetIdx, sheet := range res.Sheets {
		for i, rowData := range sheet.Data[0].RowData {
			if len(rowData.Values) == 0 {
				continue
			}
			if sheetIdx == int(mainQueueVRI) {
				if rowData.Values[0].EffectiveFormat.BackgroundColorStyle.ThemeColor == "" && rowData.Values[6].FormattedValue == "" {
					continue
				}
			} else {
				if rowData.Values[0].EffectiveFormat.BackgroundColorStyle.ThemeColor == "" && rowData.Values[1].FormattedValue == "" {
					continue
				}
			}
			idxs[sheetIdx] = i
			break
		}
	}
	return idxs[0], idxs[1], err
}

func (c *controller) getTopOfDelegCycle(delegCycleValuesN int) (int, error) {
	ranges := make([]string, 1)
	runesDC := []rune(c.delegCycle.GetRange())
	ranges[0] = string(append(runesDC[:len(runesDC)-1], []rune(fmt.Sprintf("A%d", delegCycleValuesN+10))...))
	res, err := c.f2lb.Spreadsheets.Get(f2lbSpreadSheetID).Ranges(ranges...).IncludeGridData(true).Do()
	if err != nil {
		return -1, err
	}
	idx := -1
	for _, sheet := range res.Sheets {
		for i, rowData := range sheet.Data[0].RowData {
			if len(rowData.Values) == 0 {
				continue
			}
			if rowData.Values[0].EffectiveFormat.BackgroundColorStyle.ThemeColor == "" {
				continue
			}
			idx = i
			break
		}
	}
	return idx, err
}

func (c *controller) getTopOfDelegCycleFromValues(vr *ValueRange) (int, error) {
	if vr == nil || len(vr.Values) < 2 {
		return -1, fmt.Errorf("getTopOfDelegCycleFromValues invalid ValueRange")
	}
	currentEpochAsUint64 := uint64(utils.CurrentEpoch())
	for idx, v := range vr.Values {
		eVal, err := strconv.ParseUint(v[0].(string), 10, 32)
		if err != nil || eVal < currentEpochAsUint64 {
			continue
		}
		if eVal > currentEpochAsUint64 {
			return -1, fmt.Errorf("getTopOfDelegCycleFromValues unable to find current epoch")
		}

		// we should assert it
		if eVal == currentEpochAsUint64 {
			return idx, nil
		}
	}
	return -1, fmt.Errorf("getTopOfDelegCycleFromValues invalid ValueRange or unable to find current epoch")
}

func getOnlyTickers(rows [][]any) []string {
	tickers := []string{}
	for _, v := range rows {
		tickers = append(tickers, v[2].(string))
	}
	return tickers
}

func (c *controller) Refresh() error {
	var wg sync.WaitGroup

	startRefreshAt := time.Now()
	c.V(2).Info("Starting controller refresh", "at", startRefreshAt.Format(time.RFC850))
	c.mu.RLock()
	if c.isRefreshing {
		c.mu.RUnlock()
		c.V(2).Info("Controller is already refreshing, done", "at", startRefreshAt.Format(time.RFC850))
		return nil
	}
	c.mu.RUnlock()
	// start refreshing
	c.mu.Lock()
	defer func() {
		c.isRefreshing = false
		c.lastRefreshTime = time.Now().UTC()
		c.mu.Unlock()
		c.V(2).Info("Controller refresh done", "in", time.Since(startRefreshAt).String())
	}()
	c.isRefreshing = true

	res, err := c.getValuesInBatch()
	if err != nil {
		return err
	}

	// for MainQueue and AddonQueue sheets get the top of the queues,
	// basically the first row with a specific format/color
	// with that indexes we can pass the correct subset of values to the Queues objects
	mainQueueTopIdx, addonQueueTopIdx, err := c.getTopOfQueues(
		len(res[mainQueueVRI].Values),
		len(res[addonQueueVRI].Values))
	if err != nil {
		return err
	}

	oldTickersValues := res[mainQueueVRI].Values[:mainQueueTopIdx]
	res[mainQueueVRI].Values = res[mainQueueVRI].Values[mainQueueTopIdx:]
	res[addonQueueVRI].Values = res[addonQueueVRI].Values[addonQueueTopIdx:]

	if idx, err := c.getTopOfDelegCycleFromValues(res[delegCycleVRI]); err == nil {
		res[delegCycleVRI].Values = res[delegCycleVRI].Values[idx:]
	} else if idx, err := c.getTopOfDelegCycle(len(res[delegCycleVRI].Values)); err == nil {
		res[delegCycleVRI].Values = res[delegCycleVRI].Values[idx:]
	} else {
		return err
	}

	c.V(2).Info("Controller refresh got data from spreadsheet", "in", time.Since(startRefreshAt).String())

	// put old members in the cache, parse them as old main Queue
	var oldMainQueue *MainQueue
	{
		oldMainQueue = &MainQueue{}
		if err := oldMainQueue.Refresh(c.f2lb, &ValueRange{Values: oldTickersValues}); err != nil {
			c.Error(err, "oldMainQueue.Refresh failed")
		}
	}

	hintsMapping := getHintsMapping(poolsHintsPath)

	var koiosErr error
	wg.Add(4)
	// wg.Add(1)
	go func() {
		// doing this in the main goroutine we can check the delegCycle topTicker diring the mainQueue parsing,
		// this would be just to ensure the website is really updated also if the spreadsheet is not (gsheet not updated mean the green row)
		defer wg.Done()
		c.delegCycle.Refresh(res[delegCycleVRI])
		c.V(2).Info("Controller refresh filled delegation cycle", "in", time.Since(startRefreshAt).String())
	}()

	// wg.Add(1)
	go func() {
		defer wg.Done()
		if err := c.mainQueue.Refresh(c.f2lb, res[mainQueueVRI]); err != nil {
			c.Error(err, "mainQueue.Refresh failed")
		}

		var (
			saddrs         []string
			toAddPoolCache []any
		)

		saddrs_m := make(map[string]any)
		tickers_m := make(map[string]any)
		tickers_with_pid_m := make(map[string]any)

		for _, r := range append(c.mainQueue.GetRecords(), oldMainQueue.GetRecords()...) {
			// should we add all the addresses?
			saddrs_m[r.StakeAddrs[0]] = struct{}{}

			// c.V(2).Info("check for hints mapping", "ticker", r.Ticker)
			if r.PoolIdBech32 == "" {
				if pid, ok := hintsMapping[r.Ticker]; ok {
					// c.V(2).Info("hints mapping", "ticker", r.Ticker, "pool", pid)
					if pid == "retired" {
						delete(saddrs_m, r.StakeAddrs[0])
						// c.accountCache.Del(r.StakeAddrs[0])
						delete(tickers_m, r.Ticker)
						// c.poolCache.Del(r.Ticker)
						continue
					}
					// try to use hints mapping here as early speculation
					r.PoolIdBech32 = pid
					if hex, err := utils.Bech32ToHex(r.PoolIdBech32); err == nil {
						r.PoolIdHex = hex
					}
				}
			}

			saddrs = append(saddrs, r.StakeAddrs[0])

			if r.PoolIdBech32 == "" {
				tickers_m[r.Ticker] = struct{}{}
			} else {
				if _, ok := tickers_with_pid_m[r.Ticker]; !ok {
					toAddPoolCache = append(toAddPoolCache, &poolcache.MinimalPoolInfo{Bech32: r.PoolIdBech32, Ticker: r.Ticker})
					tickers_with_pid_m[r.Ticker] = struct{}{}
				}
			}
		}

		for t := range tickers_m {
			if _, ok := tickers_with_pid_m[t]; !ok {
				toAddPoolCache = append(toAddPoolCache, t)
			}
		}

		saddrs = utils.UniquifyStrings(saddrs)
		c.V(2).Info("Controller refresh adding to cache", "stake addresses",
			len(saddrs), "in", time.Since(startRefreshAt).String())

		c.V(2).Info("Controller refresh adding to cache", "tickers",
			len(toAddPoolCache), "in", time.Since(startRefreshAt).String())

		c.accountCache.AddMany(saddrs)
		c.poolCache.AddMany(toAddPoolCache)

		// the below waits are spending minutes on startup, to speedup the start up we can not wait for it
		// and just notifiy the client via websocket to refresh the state on its side
		go func() {
			c.accountCache.WaitReady(time.Duration(60 * time.Minute))
			c.poolCache.WaitReady(time.Duration(60 * time.Minute))

			c.V(2).Info("Controller refresh caches are ready ?",
				"account", c.accountCache.Ready(), "pool", c.poolCache.Ready(), "in", time.Since(startRefreshAt).String())
			{
				c.V(2).Info("Controller refresh got pools info data from koios", "in", time.Since(startRefreshAt).String())
				for _, r := range c.mainQueue.GetRecords() {

					if pi, ok := c.poolCache.Get(r.Ticker); ok {
						delete(tickers_m, r.Ticker)
						r.PoolIdBech32 = pi.IdBech32()
						r.PoolIdHex = pi.IdHex()
					}

					if actual, loaded := c.mainQueue.cacheByPoolIdBech32.LoadOrStore(r.PoolIdBech32, r); loaded && actual != r {
						c.mainQueue.cacheByPoolIdBech32.Store(r.PoolIdBech32, r)
					}
					if actual, loaded := c.mainQueue.cacheByPoolIdHex.LoadOrStore(r.PoolIdHex, r); loaded && actual != r {
						c.mainQueue.cacheByPoolIdHex.Store(r.PoolIdHex, r)
					}

					if ai, ok := c.accountCache.Get(r.StakeAddrs[0]); ok {
						delete(saddrs_m, r.StakeAddrs[0])
						r.AdaDelegated = uint16(ai.AdaAmount())
						if poolInQueue := c.mainQueue.GetByPoolId(ai.DelegatedPool()); poolInQueue != nil {
							r.DelegatedPool = poolInQueue.Ticker
						} else {
							r.DelegatedPool = ai.DelegatedPool()
						}
					}
				}

				if len(tickers_m) > 0 && !c.poolCache.Ready() {
					tickers := []string{}
					for k := range tickers_m {
						tickers = append(tickers, k)
					}
					c.V(2).Info("Controller refresh poolCache, starting the hammer",
						"ready", c.poolCache.Ready(),
						"in", time.Since(startRefreshAt).String())
					// this will handle panics
					go c.getPoolInfos(tickers)
				}

				if len(saddrs_m) > 0 && !c.accountCache.Ready() {
					saddrs := []string{}
					for k := range saddrs_m {
						saddrs = append(saddrs, k)
					}
					c.V(2).Info("Controller refresh accountCache, starting the hammer",
						"ready", c.accountCache.Ready(),
						"in", time.Since(startRefreshAt).String())
					// this will handle panics
					go c.getAccountInfos(saddrs)
				}
			}

			// send a message to the clients via websocket just to refetch the state that is not updated with details
			if c.refresherCh != nil {
				c.V(2).Info("Controller sending refresh message to all the clients via websocket", "in", time.Since(startRefreshAt).String())
				c.refresherCh <- "ALL"
			}

		}()

		c.V(2).Info("Controller refresh filled main Queue\n", "in", time.Since(startRefreshAt).String())
	}()

	// wg.Add(1)
	go func() {
		defer wg.Done()
		if err := c.addonQueue.Refresh(c.f2lb, res[addonQueueVRI]); err != nil {
			c.Error(err, "addonQueue.Refresh failed")
		}
		c.V(2).Info("Controller refresh filled addon Queue", "in", time.Since(startRefreshAt).String())
	}()

	// wg.Add(1)
	go func() {
		defer wg.Done()
		if err := c.supporters.Refresh(c.f2lb, res[supportersVRI]); err != nil {
			c.Error(err, "supporters.Refresh failed")
		}
		c.V(2).Info("Controller refresh filled supporters", "in", time.Since(startRefreshAt).String())
	}()

	wg.Wait()
	if koiosErr != nil {
		return koiosErr
	}

	{
		c.V(3).Info("Preparing stake pool set")
		start := uint16(c.delegCycle.epoch)
		missingFromKoios := make(map[string]string)
		for i, r := range c.mainQueue.GetRecords() {
			vals := f2lb_members.FromMainQueueValues{
				Ticker:                   r.Ticker,
				DiscordName:              r.DiscordName,
				AD:                       r.AD,
				EG:                       r.EG,
				MainQCurrPos:             r.mainQCurrPos,
				StakeKeys:                r.StakeKeys,
				StakeAddrs:               r.StakeAddrs,
				QPP:                      r.QPP,
				DelegStatus:              r.delegStatus,
				AddonQStatus:             r.addonQStatus,
				MissedEpochs:             r.missedEpochs,
				AddedToGoogleGroup:       r.addedToGoogleGroup,
				DiscordID:                r.discordID,
				InitialAdaDeclaration:    r.initialAdaDeclaration,
				StartingEpochOnMainQueue: start,
			}

			c.stakePoolSet.SetWithValuesFromMainQueue(vals)

			if i == 0 {
				start += uint16(c.delegCycle.topRemainingEpochs)
			} else {
				start += r.EG
			}

			if c.poolCache.IsTickerMissingFromKoiosPoolList(r.Ticker) {
				if r.PoolIdBech32 != "" {
					missingFromKoios[r.PoolIdBech32] = r.Ticker
				} else if pid, ok := hintsMapping[r.Ticker]; ok {
					c.V(2).Info("Missing from koios with hint", "ticker", r.Ticker, "pool", pid)
					if pid != "retired" {
						missingFromKoios[pid] = r.Ticker
					}
				}
			}
		}

		if len(missingFromKoios) > 0 {
			c.V(5).Info("Missing from koios", "len", len(missingFromKoios))
			c.poolCache.FillMissingPoolInfos(missingFromKoios)
			c.V(5).Info("Missing from koios filled", "map", missingFromKoios)
		}

		// check if something in AddonQ is missing from MainQ and add it to the StakePoolSet
		aqStart := uint16(c.delegCycle.epoch)
		for i, r := range c.addonQueue.GetRecords() {
			if len(r.StakeAddrs) == 0 {
				continue
			}
			sp := c.stakePoolSet.Get(r.Ticker)
			if sp == nil {
				// this is missing from mainQ, lets add it
				vals := f2lb_members.FromMainQueueValues{
					Ticker:                    r.Ticker,
					DiscordName:               r.DiscordName,
					AD:                        r.AD,
					EGAQ:                      r.EG,
					StakeKeys:                 r.StakeKeys,
					StakeAddrs:                r.StakeAddrs,
					StartingEpochOnAddonQueue: aqStart, // this have to be fixed from the deleg cycle sheets
				}
				c.stakePoolSet.SetWithValuesFromMainQueue(vals)
				c.V(5).Info("Added missing from MainQ SP", "vals", vals, "rec", r)
				// lets add also the stake addrs to the cache, should we add all the addresses?
				c.accountCache.Add(r.StakeAddrs[0])
				c.poolCache.AddMany([]any{&poolcache.MinimalPoolInfo{Ticker: r.Ticker, Bech32: r.PoolIdBech32}})
			} else {
				// this is in mainQ, lets update EG from addonQ
				sp.SetEpochGrantedOnAddonQueue(r.EG)
				sp.SetStartingEpochOnAddonQueue(aqStart)
			}
			if i == 0 {
				aqStart += uint16(c.delegCycle.aqTopRemainingEpochs)
			} else {
				aqStart += r.EG
			}
		}

		// add active ticker
		{
			sp := c.stakePoolSet.Get(c.delegCycle.activeTicker)
			if sp == nil {
				// this is missing from mainQ, lets add it
				vals := f2lb_members.FromMainQueueValues{
					Ticker: c.delegCycle.activeTicker,
				}
				c.stakePoolSet.SetWithValuesFromMainQueue(vals)
				c.poolCache.Add(c.delegCycle.activeTicker)
			}
		}

		c.V(2).Info("Controller refresh stake pool set filled", "in", time.Since(startRefreshAt).String())
	}

	if c.refresherCh != nil {
		c.refresherCh <- "ALL"
	}
	c.V(2).Info("Controller caches are ready?",
		"account", c.accountCache.Ready(),
		"pool", c.poolCache.Ready(),
		"in", time.Since(startRefreshAt).String())
	return nil
}

func (c *controller) GetF2LB() *F2LB { return c.f2lb }

func (c *controller) GetMainQueue() *MainQueue             { return c.mainQueue }
func (c *controller) GetMainQueueRecords() []*MainQueueRec { return c.mainQueue.GetRecords() }
func (c *controller) GetMainQueueServed() *MainQueueRec    { return c.mainQueue.GetServed() }

func (c *controller) GetAddonQueue() *AddonQueue             { return c.addonQueue }
func (c *controller) GetAddonQueueRecords() []*AddonQueueRec { return c.addonQueue.GetRecords() }
func (c *controller) GetAddonQueueServed() *AddonQueueRec    { return c.addonQueue.GetServed() }

func (c *controller) GetSupporters() *Supporters         { return c.supporters }
func (c *controller) GetSupportersRecords() []*Supporter { return c.supporters.GetRecords() }

func (c *controller) GetDelegationCycle() *DelegationCycle { return c.delegCycle }

func (c *controller) GetStakePoolSet() f2lb_members.StakePoolSet { return c.stakePoolSet }
func (c *controller) GetAccountCache() accountcache.AccountCache { return c.accountCache }
func (c *controller) GetPoolCache() poolcache.PoolCache          { return c.poolCache }

func (c *controller) GetKoiosClient() *koiosutils.KoiosClient { return c.kc }

func (c *controller) GetLastRefreshTime() time.Time { return c.lastRefreshTime }

func (c *controller) GetKoiosTipBlockHeight() int { return c.koiosTipBlockHeightCached }

func (c *controller) IsRunning() bool { return c.tick != nil }
func (c *controller) Start() error {
	c.tick = time.NewTicker(c.refreshInterval)
	c.accountCache.Start()
	c.poolCache.Start()
	if err := c.Refresh(); err != nil {
		return err
	}
	go func() {
		for {
			select {
			case <-c.tick.C:
				// this is a kind of hard refresh
				c.mainQueue.ResetCaches()
				c.addonQueue.ResetCaches()
				if err := c.Refresh(); err != nil {
					c.Error(err, "Controller Refresh failed")
				}
			}
		}
	}()

	// run a koios tip cacher, TODO: make a better/cleaner context cancel instead of ugly chaining
	cctx, cctxCancel := context.WithCancel(c.ctx)
	octxCancel := c.ctxCancel
	c.ctxCancel = func() { cctxCancel(); octxCancel() }
	go func() {
		if _, block, _, err := c.kc.GetTip(); err == nil {
			c.koiosTipBlockHeightCached = block
		}
		t := time.NewTicker(koiosTipRefreshInterval)
		for {
			select {
			case <-cctx.Done():
				return
			case <-t.C:
				if _, block, _, err := c.kc.GetTip(); err == nil {
					c.koiosTipBlockHeightCached = block
				}
			}
		}
	}()

	return nil
}

func (c *controller) Stop() error {
	c.V(2).Info("Stopping controller")
	c.tick.Stop()
	c.tick = nil
	c.accountCache.Stop()
	c.poolCache.Stop()
	c.ctxCancel()
	c.V(2).Info("Controller stopped")
	return nil
}

func (c *controller) IsReady() bool {
	return c.accountCache.Ready() && c.poolCache.Ready()
}

// To be deprecated

func (c *controller) getPoolInfos(tickers []string) {
	if utils.IsContextDone(c.ctx) {
		return
	}

	defer func() {
		if r := recover(); r != nil {
			c.Error(r.(error), "getPoolInfos recovered")
		}
	}()

	startPoolInfoAt := time.Now()

	t2p, err, _ := c.kc.GetTickerToPoolIdMapFor(tickers...)
	if err != nil {
		c.Error(err, "Controller.getPoolInfos", "n tickers", len(tickers))
		return
	}
	for _, t := range tickers {
		r := c.mainQueue.GetByTicker(t)
		if pBech32, ok := t2p[r.Ticker]; ok {
			if pBech32 != r.PoolIdBech32 && pBech32 != "" {
				r.PoolIdBech32 = pBech32
				r.PoolIdHex = utils.Bech32ToHexOrDie(pBech32)
			}
		} else {
			if r.PoolIdHex != "" {
				r.PoolIdBech32 = utils.HexToBech32OrDie("pool", r.PoolIdHex)
			} else if r.PoolIdBech32 != "" && pBech32 != "" {
				r.PoolIdHex = utils.Bech32ToHexOrDie(pBech32)
			}
		}
	}
	if c.refresherCh != nil {
		c.refresherCh <- "ALL"
	}
	c.V(2).Info("Controller got pool infos", "in", time.Since(startPoolInfoAt).String())
}

func (c *controller) getAccountInfos(saddrs []string) {
	var stakeAddressInfoWaitGroup sync.WaitGroup
	var stakeAddressInfoRunning uint32
	var koiosErrors []error

	if utils.IsContextDone(c.ctx) {
		return
	}

	defer func() {
		if r := recover(); r != nil {
			c.Error(r.(error), "getAccountInfos recovered")
		}
	}()

	startAccountInfoAt := time.Now()

	saddr2time := make(map[string]time.Time)
	{
		saddr2tx := make(map[string]koios.TxHash)
		tx2saddr := make(map[koios.TxHash]string)
		txs := []koios.TxHash{}
		type txItem struct {
			saddr string
			tx    koios.TxHash
		}
		txsCh := make(chan txItem)
		go func() {
			for txI := range txsCh {
				txs = append(txs, txI.tx)
				saddr2tx[txI.saddr] = txI.tx
				tx2saddr[txI.tx] = txI.saddr
			}
		}()

		for _, saddr := range saddrs {
			r := c.mainQueue.GetByStakeAddr(saddr)
			if r == nil {
				continue
			}
			if atomic.LoadUint32(&stakeAddressInfoRunning) > uint32(runtime.NumCPU()*30) {
				stakeAddressInfoWaitGroup.Wait()
			}
			stakeAddressInfoWaitGroup.Add(1)
			atomic.AddUint32(&stakeAddressInfoRunning, uint32(1))
			go func(r *MainQueueRec) {
				defer stakeAddressInfoWaitGroup.Done()
				tx, err := c.kc.GetLastDelegationTx(r.StakeAddrs[0])
				if err != nil {
					return
				}
				txsCh <- txItem{r.StakeAddrs[0], tx}
			}(r)
		}
		stakeAddressInfoWaitGroup.Wait()
		close(txsCh)

		tx2time, err := c.kc.GetTxsTimes(txs)
		if err == nil {
			for tx, t := range tx2time {
				if saddr, ok := tx2saddr[tx]; ok {
					saddr2time[saddr] = t
				}
			}
		}
	}

	stakeAddressInfoRunning = 0

	for _, saddr := range saddrs {
		r := c.mainQueue.GetByStakeAddr(saddr)
		if r == nil {
			continue
		}
		if atomic.LoadUint32(&stakeAddressInfoRunning) > uint32(runtime.NumCPU()*10) {
			stakeAddressInfoWaitGroup.Wait()
		}
		stakeAddressInfoWaitGroup.Add(1)
		atomic.AddUint32(&stakeAddressInfoRunning, uint32(1))
		go func(r *MainQueueRec) {
			defer stakeAddressInfoWaitGroup.Done()
			// if (r.lastDelegationTxTime == time.Time{}) {
			// 	if ldt, ok := saddr2time[r.StakeAddrs[0]]; ok {
			// 		r.lastDelegationTxTime = ldt
			// 	} else {
			// 		r.lastDelegationTxTime, _ = c.kc.GetLastDelegationTime(r.StakeAddrs[0])
			// 	}
			// }
			// if (r.lastDelegationTxTime != time.Time{}) && startAccountInfoAt.After(r.lastDelegationTxTime) &&
			// 	(r.DelegatedPool != "") {
			// 	return
			// }
			delegatedPool, totalAda, err := c.kc.GetStakeAddressInfo(r.StakeAddrs[0])
			if err != nil {
				koiosErrors = append(koiosErrors, err)
			} else {
				r.AdaDelegated = uint16(totalAda)
				if poolInQueue := c.mainQueue.GetByPoolId(delegatedPool); poolInQueue != nil {
					r.DelegatedPool = poolInQueue.Ticker
				} else {
					r.DelegatedPool = delegatedPool
				}
			}
			atomic.AddUint32(&stakeAddressInfoRunning, ^uint32(0))
		}(r)
	}
	stakeAddressInfoWaitGroup.Wait()
	if len(koiosErrors) > 0 {
		for _, e := range koiosErrors {
			c.Error(e, "getting account info koios")
		}
	}
	if c.refresherCh != nil {
		c.refresherCh <- "ALL"
	}
	c.V(2).Info("Controller got account infos", "in", time.Since(startAccountInfoAt).String())
}
