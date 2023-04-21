package f2lb_gsheet

import (
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/safanaj/go-f2lb/pkg/utils"
)

// google spreadsheet ranges
const mainQueueSheet = "MainQueue"

// the first 2 rows are headers
const mainQueueRange = "A3:O"

type MainQueueRec struct {
	// columns
	DiscordName  string `json:"discord_name" yaml:"discord_name"`    // A
	QPP          uint16 `json:"qpp" yaml:"qpp"`                      // B
	Ticker       string `json:"ticker" yaml:"ticker"`                // C
	AD           uint16 `json:"ada_declared" yaml:"ada_declared"`    // D
	AdaDelegated uint16 `json:"ada_delegated" yaml:"ada_delegated"`  // D
	EG           uint16 `json:"epoch_granted" yaaml:"epoch_granted"` // E
	// computed column I
	StakeKeys     []string `json:"stake_keys" yaml:"stake_keys"`
	StakeAddrs    []string `json:"stake_addresses" yaml:"stake_addresses"`
	DelegatedPool string   `json:"delegated_pool" yaml:"delegated_pool"`

	// StartingEpoch uint16    `json:"starting_epoch" yaml:"starting_epoch"`
	// StartingTime  time.Time `json:"starting_time" yaml:"starting_time"`

	// other columns
	delegStatus           string // F
	mainQCurrPos          uint16 // G
	addonQStatus          string // H
	missedEpochs          string // J
	addedToGoogleGroup    string // K
	PoolIdHex             string // L
	PoolIdBech32          string
	discordID             string // M
	initialAdaDeclaration string // N

	// computed/discovered last delegation tx time
	// lastDelegationTxTime time.Time
	stakeAddressStatus string
}

func (r *MainQueueRec) MarshalJSON() ([]byte, error) {
	return json.Marshal(*r)
}

func (r *MainQueueRec) MarshalYAML() (any, error) {
	return *r, nil
}

type MainQueue struct {
	mu      sync.RWMutex
	ordered []string

	// to be deprecated
	records             []*MainQueueRec
	served              *MainQueueRec
	totalAdaInQueue     uint64
	cacheByTicker       sync.Map
	cacheByStakeAddr    sync.Map
	cacheByStakeKey     sync.Map
	cacheByPoolIdBech32 sync.Map
	cacheByPoolIdHex    sync.Map

	// epoch when served was computed
	refreshedInEpoch utils.Epoch
	refreshTime      time.Time
}

func (mq *MainQueue) toMarshalable() any {
	return struct {
		Records         []*MainQueueRec `json:"records"`
		Served          *MainQueueRec   `json:"served"`
		TotalAdaInQueue uint64          `json:"total_ada"`
	}{mq.GetRecords(), mq.GetServed(), mq.GetTotalAda()}
}

func (mq *MainQueue) MarshalJSON() ([]byte, error) {
	return json.Marshal(mq.toMarshalable())
}

func (mq *MainQueue) MarshalYAML() (any, error) {
	return mq.toMarshalable(), nil
}

func NewMainQueue(f2lb *F2LB) (*MainQueue, error) {
	mq := &MainQueue{}
	err := mq.Refresh(f2lb, nil)
	var cwarn *CacheWarn
	if err != nil && !errors.As(err, &cwarn) {
		return nil, err
	}
	return mq, err
}

func NewMainQueueOrDie(f2lb *F2LB) *MainQueue {
	mq, err := NewMainQueue(f2lb)
	if mq == nil {
		utils.CheckErr(err)
	}
	return mq
}

func (mq *MainQueue) GetRange() string {
	return fmt.Sprintf("%s!%s", mainQueueSheet, mainQueueRange)
}

func (mq *MainQueue) Refresh(f2lb *F2LB, vr *ValueRange) error {
	var totalAdaInQueue uint64
	var mqRec *MainQueueRec
	if vr == nil {
		res, err := f2lb.Spreadsheets.Values.BatchGet(
			f2lbSpreadSheetID).MajorDimension("ROWS").Ranges(
			mq.GetRange()).Do()
		if err != nil {
			return err
		}
		vr = res.ValueRanges[0]
	}

	orderedTickers := make([]string, 0, len(vr.Values))
	records := make([]*MainQueueRec, 0, len(vr.Values))

	for _, v := range vr.Values {
		qppVal, _ := strconv.ParseUint(v[1].(string), 10, 16)
		adVal, _ := strconv.ParseUint(v[3].(string), 10, 16)
		egVal, _ := strconv.ParseUint(v[4].(string), 10, 16)
		currPosVal, _ := strconv.ParseUint(v[6].(string), 10, 16)

		ticker := v[2].(string) // D
		orderedTickers = append(orderedTickers, ticker)
		mqRec = (*MainQueueRec)(nil)
		if mqRecI, ok := mq.cacheByTicker.Load(ticker); ok {
			if mqRec_, ok := mqRecI.(*MainQueueRec); ok {
				mqRec = mqRec_
			}
		}
		if mqRec == nil {
			mqRec = &MainQueueRec{
				DiscordName:           v[0].(string),      // A
				QPP:                   uint16(qppVal),     // B
				Ticker:                ticker,             // C
				AD:                    uint16(adVal),      // D
				EG:                    uint16(egVal),      // E
				delegStatus:           v[5].(string),      // F
				mainQCurrPos:          uint16(currPosVal), // G
				addonQStatus:          v[7].(string),      // H
				missedEpochs:          v[9].(string),      // J
				addedToGoogleGroup:    v[10].(string),     // K
				PoolIdHex:             v[11].(string),     // L
				discordID:             v[12].(string),     // M
				initialAdaDeclaration: v[13].(string),     // N
			}

		}

		if strings.HasPrefix(mqRec.PoolIdHex, "pool") {
			mqRec.PoolIdBech32 = mqRec.PoolIdHex
			mqRec.PoolIdHex = ""
			if hex, err := utils.Bech32ToHex(mqRec.PoolIdBech32); err == nil {
				mqRec.PoolIdHex = hex
			}
		} else {
			if bech32, err := utils.HexToBech32("pool", mqRec.PoolIdHex); err == nil {
				mqRec.PoolIdBech32 = bech32
			}
		}

		// compute for column I
		for _, val := range regexp.MustCompile("[[:space:]]").Split(v[8].(string), -1) {
			if val == "" || len(val) < 6 {
				continue
			}
			if val[:5] == "stake" {
				kh, err := utils.StakeAddressToStakeKeyHash(val)
				if err != nil {
					fmt.Println(fmt.Errorf("MainQueue parsing: Invalid bech32 stake address for ticker: %s", ticker))
					continue
				}
				mqRec.StakeAddrs = append(mqRec.StakeAddrs, val)
				mqRec.StakeKeys = append(mqRec.StakeKeys, kh)
			} else {
				addr, err := utils.StakeKeyHashToStakeAddress(val)
				if err != nil {
					fmt.Println(fmt.Errorf("MainQueue parsing: Invalid hex stake address for ticker: %s", ticker))
					continue
				}
				mqRec.StakeKeys = append(mqRec.StakeKeys, val)
				mqRec.StakeAddrs = append(mqRec.StakeAddrs, addr)
			}
		}

		totalAdaInQueue = totalAdaInQueue + adVal
		records = append(records, mqRec)

	}

	// now lock and prepare caches
	mq.mu.Lock()
	defer mq.mu.Unlock()
	mq.ordered = orderedTickers

	// below code to be deprecated
	mq.records = records
	mq.served = records[0]
	mq.refreshedInEpoch = utils.CurrentEpoch()
	mq.totalAdaInQueue = totalAdaInQueue

	warn := &CacheWarn{}
	for _, rec := range records {
		actual, loaded := mq.cacheByTicker.LoadOrStore(rec.Ticker, rec)
		if loaded && actual != rec {
			warn.warnings = append(warn.warnings,
				fmt.Sprintf("Ticker %s in cache is not record: %v but %v, overwrite", rec.Ticker, rec, actual))
			ractual := actual.(*MainQueueRec)
			if rec.AdaDelegated == 0 && ractual.AdaDelegated != 0 {
				rec.AdaDelegated = ractual.AdaDelegated
			}
			if rec.DelegatedPool == "" && ractual.DelegatedPool != "" {
				rec.AdaDelegated = ractual.AdaDelegated
			}
			if rec.stakeAddressStatus == "" && ractual.stakeAddressStatus != "" {
				rec.stakeAddressStatus = ractual.stakeAddressStatus
			}
			mq.cacheByTicker.Store(rec.Ticker, rec)
		}

		for _, skey := range rec.StakeKeys {
			actual, loaded := mq.cacheByStakeKey.LoadOrStore(skey, rec)
			if loaded && actual != rec {
				warn.warnings = append(warn.warnings,
					fmt.Sprintf("Stake key %s in cache is not record: %v but %v, overwrite", skey, rec, actual))
				mq.cacheByStakeKey.Store(skey, rec)
			}

		}
		for _, saddr := range rec.StakeAddrs {
			actual, loaded := mq.cacheByStakeAddr.LoadOrStore(saddr, rec)
			if loaded && actual != rec {
				warn.warnings = append(warn.warnings,
					fmt.Sprintf("Stake address %s in cache is not record: %v but %v, overwrite", saddr, rec, actual))
				mq.cacheByStakeAddr.Store(saddr, rec)
			}
		}
	}
	mq.refreshTime = time.Now()
	if len(warn.warnings) > 0 {
		return warn
	}
	return nil
}

func (mq *MainQueue) GetOrdered() []string {
	mq.mu.RLock()
	defer mq.mu.RUnlock()
	tickers := make([]string, len(mq.ordered))
	copy(tickers, mq.ordered)

	return tickers
}

// below code to be deprecated
func (mq *MainQueue) GetRecords() []*MainQueueRec {
	mq.mu.RLock()
	defer mq.mu.RUnlock()

	records := make([]*MainQueueRec, len(mq.records))
	copy(records, mq.records)

	return records
}

func (mq *MainQueue) GetServed() *MainQueueRec {
	mq.mu.RLock()
	defer mq.mu.RUnlock()
	return mq.served
}

func (mq *MainQueue) GetTotalAda() uint64 {
	mq.mu.RLock()
	defer mq.mu.RUnlock()
	return mq.totalAdaInQueue
}

func (mq *MainQueue) ResetCaches() {
	mq.cacheByTicker = sync.Map{}
	mq.cacheByStakeAddr = sync.Map{}
	mq.cacheByStakeKey = sync.Map{}
	mq.cacheByPoolIdBech32 = sync.Map{}
	mq.cacheByPoolIdHex = sync.Map{}
}

func (mq *MainQueue) getBy(key string, cache sync.Map) *MainQueueRec {
	val, ok := cache.Load(key)
	if ok {
		return val.(*MainQueueRec)
	}
	return nil
}

func (mq *MainQueue) GetByTicker(ticker string) *MainQueueRec {
	return mq.getBy(ticker, mq.cacheByTicker)
}
func (mq *MainQueue) GetByStakeKey(stakeKey string) *MainQueueRec {
	return mq.getBy(stakeKey, mq.cacheByStakeKey)
}
func (mq *MainQueue) GetByStakeAddr(stakeAddr string) *MainQueueRec {
	return mq.getBy(stakeAddr, mq.cacheByStakeAddr)
}
func (mq *MainQueue) GetByPoolId(poolId string) *MainQueueRec {
	if strings.HasPrefix(poolId, "pool") {
		return mq.getBy(poolId, mq.cacheByPoolIdBech32)
	}
	return mq.getBy(poolId, mq.cacheByPoolIdHex)
}

func (mq *MainQueue) GetRefreshedInEpoch() utils.Epoch {
	mq.mu.RLock()
	defer mq.mu.RUnlock()
	return mq.refreshedInEpoch
}

func (mq *MainQueue) GetRefreshTime() time.Time {
	mq.mu.RLock()
	defer mq.mu.RUnlock()
	return mq.refreshTime
}
