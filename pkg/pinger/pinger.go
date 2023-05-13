package pinger

import (
	"context"
	"fmt"
	"math"
	"net"
	"sync"
	"time"

	ouroboros "github.com/blinklabs-io/gouroboros"
	"github.com/blinklabs-io/gouroboros/protocol/keepalive"

	ku "github.com/safanaj/go-f2lb/pkg/caches/koiosutils"
	"github.com/safanaj/go-f2lb/pkg/f2lb_members"
	"github.com/safanaj/go-f2lb/pkg/logging"
	"github.com/safanaj/go-f2lb/pkg/utils"
)

type (
	pinger struct {
		logging.Logger

		ctx               context.Context
		ctxDone           context.CancelFunc
		ctrl              MiniController
		pings             int
		pingInterval      time.Duration
		responseThreshold time.Duration
		checkInterval     time.Duration
		connectTimeout    time.Duration
		keepaliveTimeout  time.Duration
		checkAlsoTip      bool

		results map[string]PoolStats
		ch      chan any

		loopCh     chan struct{}
		checkersWg sync.WaitGroup
		checkers   int
		checkersCh chan string
	}

	poolResult struct {
		name   string
		result *poolStats
	}

	checkResult struct {
		n string
		r RelayStat
	}

	getPoolStatsReq struct {
		ticker string
		ch     chan PoolStats
	}

	checkPoolReq struct {
		id string
		ch chan PoolStats
	}
)

var (
	_ Pinger = &pinger{}
)

func NewPinger(logger logging.Logger) Pinger {
	return New(logger, pingerPingsCount, pingerPingInterval, pingerResponseThreshold,
		pingerCheckInterval, pingerCheckers, pingerConnectTimeout, pingerKeepAliveTimeout,
		pingerCheckAlsoTip)
}

func New(
	logger logging.Logger,
	pings int,
	pingInterval time.Duration,
	responseThreshold time.Duration,
	checkInterval time.Duration,
	checkers int,
	connectTimeout time.Duration,
	keepaliveTimeout time.Duration,
	checkAlsoTip bool,
) Pinger {
	return &pinger{
		Logger: logger, pings: pings, pingInterval: pingInterval,
		responseThreshold: responseThreshold,
		checkInterval:     checkInterval, checkers: checkers,
		connectTimeout: connectTimeout, keepaliveTimeout: keepaliveTimeout,
		checkAlsoTip: checkAlsoTip,
		results:      make(map[string]PoolStats),
	}
}

func (p *pinger) SetController(ctrl MiniController) {
	p.ctrl = ctrl
	if ctrl.GetPinger() != p {
		ctrl.SetPinger(p)
	}
}

func (p *pinger) IsRunning() bool {
	return p.ch != nil
}

func (p *pinger) Stop() {
	p.ctxDone()
	p.checkersWg.Wait()
	close(p.checkersCh)
	<-p.loopCh
	close(p.ch)
	p.ch = nil
	p.V(2).Info("Pinger stopped")
}

func (p *pinger) Start(pctx context.Context) error {
	if p.IsRunning() {
		return PingerAlreadyStartedError
	}
	if p.ctrl == nil {
		return PingerIsMissingControllerError
	}
	p.ctx, p.ctxDone = context.WithCancel(pctx)
	p.ch = make(chan any)            //, 50)
	p.checkersCh = make(chan string) //, 50)
	p.checkersWg.Add(p.checkers)
	for i := 0; i < int(p.checkers); i++ {
		go func() {
			defer p.checkersWg.Done()
			ch := p.ch
			for {
				select {
				case <-p.ctx.Done():
					return
				case pid, ok := <-p.checkersCh:
					if !ok {
						return
					}
					ch <- p.checkPool(pid)
				}
			}
		}()
	}
	p.loopCh = make(chan struct{})
	go p.loop()

	// start the first check on startup, delay it to try to get some sp from the set
	// for _, sp := range p.ctrl.GetStakePoolSet().StakePools() {
	// 	p.checkersCh <- sp.PoolIdBech32()
	// }
	return nil
}

func (p *pinger) GetPoolStats(sp f2lb_members.StakePool) PoolStats {
	if !p.IsRunning() {
		return &poolStats{errs: []error{fmt.Errorf("Pinger is not running")}}
	}
	ch := make(chan PoolStats)
	p.ch <- getPoolStatsReq{
		ticker: sp.Ticker(),
		ch:     ch,
	}
	ps := <-ch
	close(ch)
	return ps
}

func (p *pinger) CheckPool(sp f2lb_members.StakePool) PoolStats {
	if !p.IsRunning() {
		return &poolStats{errs: []error{fmt.Errorf("Pinger is not running")}}
	}
	ch := make(chan PoolStats)
	p.ch <- checkPoolReq{
		id: sp.PoolIdBech32(),
		ch: ch,
	}
	ps := <-ch
	close(ch)
	return ps
}

func (p *pinger) DumpResults() any {
	if p == nil {
		return nil
	}
	return p.results
}

func (p *pinger) loop() {
	tick := time.NewTicker(p.checkInterval)
	ch := p.ch
	for {
		select {
		case <-p.ctx.Done():
			tick.Stop()
			close(p.loopCh)
			return
		case <-tick.C:
			p.V(3).Info("current pool stats", "len", len(p.results))
			go func() {
				var li int
				for i, sp := range p.ctrl.GetStakePoolSet().StakePools() {
					p.checkersCh <- sp.PoolIdBech32()
					li = i
				}
				p.V(4).Info("submitted ping checks", "pools", li)
			}()

		case msg, ok := <-ch:
			if !ok {
				tick.Stop()
				return
			}

			switch v := msg.(type) {
			case string:
				p.V(3).Info("gonna check", "pool", v)
				// is a pool Id to check
				// go func(pid string) { ch <- p.checkPool(pid) }(v)
				p.checkersCh <- v

			case poolResult:
				if v.name == "" {
					break
				}
				old, ok := p.results[v.name]
				if !ok || v.result.errs != nil {
					p.results[v.name] = v.result
					break
				}
				ps := &poolStats{stats: make(map[string]RelayStats)}
				orstats := old.RelayStats()
				for t, rs := range v.result.stats {
					ps.stats[t] = RelayStats{}
					if ors, ok := orstats[t]; ok {
						if !ors.empty() {
							ps.stats[t] = append(ps.stats[t], ors.last())
						}
					}
					ps.stats[t] = append(ps.stats[t], rs.first())
				}
				p.results[v.name] = ps

			case getPoolStatsReq:
				ps, ok := p.results[v.ticker]
				if !ok {
					v.ch <- &poolStats{errs: []error{fmt.Errorf("Unknown pool %s", v.ticker)}}
					break
				}
				v.ch <- ps

			case checkPoolReq:
				go func(pid string, rch chan PoolStats) {
					pr := p.checkPool(pid)
					p.ch <- pr
					rch <- pr.result
				}(v.id, v.ch)
			}
		}
	}
}

// func (p *pinger) Tip(target string, count int, interval time.Duration) (int, bool) {
// 	return 0, false
// }

func (p *pinger) CheckTarget(target string) RelayStat {
	return p.checkTarget(target)
}

func (p *pinger) Check(relay ku.Relay) (map[string]RelayStat, []error) {
	targets, err := p.Discover(relay)
	if len(targets) == 0 && err != nil {
		return nil, []error{err}
	}

	wg := sync.WaitGroup{}
	errors := []error{}
	results := make(map[string]RelayStat)
	resCh := make(chan checkResult)
	collectorDoneCh := make(chan struct{})
	go func() {
		for res := range resCh {
			results[res.n] = res.r
			if res.r.Error != nil {
				errors = append(errors, res.r.Error)
			}
		}
		close(collectorDoneCh)
	}()

	for _, t := range utils.UniquifyStrings(targets) {
		wg.Add(1)
		go func(tgt string) {
			defer wg.Done()
			resCh <- checkResult{n: tgt, r: p.checkTarget(tgt)}
		}(t)
	}
	wg.Wait()
	close(resCh)
	<-collectorDoneCh

	return results, nil
}

func (p *pinger) Discover(relay ku.Relay) ([]string, error) {
	return getTargetsFromRelay(p.ctx, relay)
}

func (p *pinger) DiscoverPoolRelays(pool_ string) ([]string, []error) {
	pool, ok := p.ctrl.GetPoolCache().Get(pool_)
	if !ok {
		return nil, []error{fmt.Errorf("Missing from cache")}
	}
	relays := pool.Relays()
	if len(relays) == 0 {
		return nil, []error{fmt.Errorf("No cached relays")}
	}
	errs := []error{}
	targets := []string{}
	for _, relay := range relays {
		tgts, err := getTargetsFromRelay(p.ctx, relay)
		if err != nil {
			errs = append(errs, err)
			if len(tgts) == 0 {
				continue
			}
		}
		targets = append(targets, tgts...)
	}
	targets = utils.UniquifyStrings(targets)
	return targets, errs
}

const maxDuration = time.Duration(1<<63 - 1)

type pingResponse struct {
	t time.Time
	e error
}

type pingResult struct {
	d time.Duration
	e error
}

type pingStats struct {
	count             uint16
	minT, maxT, meanT time.Duration
	results           []pingResult
	errors            []error
}

func (p *pinger) checkTarget(target string) RelayStat {
	p.V(4).Info("checkTarget", "target", target)
	defer p.V(4).Info("checkTarget done", "target", target)
	var exitForError error
	cookie := uint16(0)
	waitResponse := make(chan pingResponse)
	stats := pingStats{count: uint16(p.pings)}
	// ctx, ctxDone := context.WithTimeout(p.ctx, time.Minute)
	// defer ctxDone()

	conn, err := (&net.Dialer{Timeout: time.Second}).DialContext(p.ctx, "tcp", target)
	if err != nil {
		return RelayStat{Error: err}
	}

	p.V(5).Info("checkTarget", "target", target, "conn", conn)

	o, err := ouroboros.New(
		ouroboros.WithConnection(conn),
		ouroboros.WithNetwork(ouroboros.NetworkByName("mainnet")),
		ouroboros.WithNodeToNode(true),
		ouroboros.WithKeepAlive(true),
		ouroboros.WithKeepAliveConfig(
			keepalive.NewConfig(
				keepalive.WithTimeout(time.Second),
				keepalive.WithPeriod(maxDuration),
				keepalive.WithKeepAliveResponseFunc(func(c uint16) error {
					if c != cookie {
						err := fmt.Errorf("KeepAliveFunc got wrong cookie: %d expected %d", c, cookie)
						waitResponse <- pingResponse{t: time.Now(), e: err}
						return err
					}
					waitResponse <- pingResponse{t: time.Now(), e: nil}
					p.V(5).Info("checkTarget", "target", target, "cookie", cookie, "got c", c)
					return nil
				}),
			)),
	)

	if err != nil {
		return RelayStat{Error: err}
	}

	// o.KeepAlive().Client.Start()
	if p.checkAlsoTip {
		o.ChainSync().Client.Start()
	}
	p.V(5).Info("checkTarget", "target", target, "conn", conn, "o", o)

	go func(errCh chan error) {
		err, ok := <-errCh
		if !ok {
			return
		}
		p.Error(err, "Ouroborus error")
		exitForError = err
	}(o.ErrorChan())

	for {
		s := time.Now()
		o.KeepAlive().Client.SendMessage(keepalive.NewMsgKeepAlive(cookie))
		r := <-waitResponse
		res := pingResult{d: r.t.Sub(s), e: nil}
		p.V(5).Info("checkTarget", "target", target, "got resp in", res.d, "got resp err", res.e)
		stats.results = append(stats.results, res)
		if r.e != nil {
			stats.errors = append(stats.errors, r.e)
		}
		cookie += 1
		if cookie >= uint16(p.pings) || exitForError != nil {
			p.V(5).Info("checkTarget", "target", target, "cookie", cookie, "pings", p.pings)
			break
		}
		time.Sleep(p.pingInterval)
	}
	close(waitResponse)

	if exitForError != nil {
		return RelayStat{Error: exitForError}
	}

	p.V(5).Info("checkTarget", "target", target, "msg", "gonna sum-up stats")
	sumT := time.Duration(0)
	counting := len(stats.results) - len(stats.errors)
	for i, r := range stats.results {
		sumT += r.d
		if i == 0 {
			stats.minT = r.d
		}
		stats.maxT = time.Duration(int64(math.Max(float64(r.d), float64(stats.maxT))))
	}
	if counting > 0 {
		stats.meanT = sumT / time.Duration(counting)
	}

	st := RelayDown
	if stats.meanT > time.Duration(0) {
		if stats.meanT < p.responseThreshold {
			st = RelayUp
		} else {
			st = RelaySlow
		}
	}

	rs := RelayStat{Status: st}
	p.V(5).Info("checkTarget", "target", target, "msg", "after pings", "stats", rs, "alsoTip", p.checkAlsoTip)

	if p.checkAlsoTip {
		tip, err := o.ChainSync().Client.GetCurrentTip()
		if err != nil {
			o.Close()
			rs.Error = err
			return rs
		}
		rs.Tip = int(tip.Point.Slot)
		if rs.Tip >= p.ctrl.GetKoiosTipSlot() {
			rs.InSync = InSyncYes
		} else {
			rs.InSync = InSyncNo
		}
		rs.Error = o.Close()
		p.V(5).Info("checkTarget", "target", target, "msg", "after tip", "stats", rs)
	}

	p.V(5).Info("checkTarget", "target", target, "msg", "closing")
	rs.Error = o.Close()
	p.V(5).Info("checkTarget", "target", target, "msg", "closed")
	return rs
}

func (p *pinger) checkPool(pid string) poolResult {
	p.V(4).Info("checkPool", "pool_id", pid)
	defer p.V(4).Info("checkPool done", "pool_id", pid)
	ps := &poolStats{}
	targets, errs := p.DiscoverPoolRelays(pid)
	if len(errs) > 0 {
		ps.errs = append(ps.errs, errs...)
	}

	pool, ok := p.ctrl.GetPoolCache().Get(pid)

	if len(targets) == 0 {
		if !ok {
			return poolResult{result: ps}
		} else {
			return poolResult{name: pool.Ticker(), result: ps}
		}
	}

	wg := sync.WaitGroup{}
	resCh := make(chan checkResult)
	collectorDoneCh := make(chan struct{})
	go func() {
		for res := range resCh {
			if ps.stats == nil {
				ps.stats = make(map[string]RelayStats)
			}
			ps.stats[res.n] = RelayStats{res.r}
		}
		close(collectorDoneCh)
	}()

	wg.Add(len(targets))
	for _, t := range targets {
		go func(tgt string) {
			defer wg.Done()
			resCh <- checkResult{n: tgt, r: p.checkTarget(tgt)}
		}(t)
	}

	wg.Wait()
	close(resCh)
	<-collectorDoneCh

	return poolResult{name: pool.Ticker(), result: ps}
}
