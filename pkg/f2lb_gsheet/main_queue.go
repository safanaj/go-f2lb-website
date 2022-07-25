package f2lb_gsheet

import (
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"sync"
	"time"

	"github.com/safanaj/go-f2lb/pkg/utils"
)

// google spreadsheet ranges
const mainQueueSheet = "MainQueue"

// the first 2 rows are headers
const mainQueueRange = "A3:N"

type MainQueueRec struct {
	// columns
	DiscordName string `json:"discord_name" yaml:"discord_name"`    // A
	QPP         uint16 `json:"qpp" yaml:"qpp"`                      // B
	Ticker      string `json:"ticker" yaml:"ticker"`                // C
	AD          uint16 `json:"ada_delegated" yaml:"ada_delegated"`  // D
	EG          uint16 `json:"epoch_granted" yaaml:"epoch_granted"` // E
	// computed column I
	StakeKeys  []string `json:"stake_keys" yaml:"stake_keys"`
	StakeAddrs []string `json:"stake_addresses" yaml:"stake_addresses"`

	// other columns
	delegStatus           string // F
	mainQCurrPos          string // G
	addonQStatus          string // H
	missedEpochs          string // J
	addedToGoogleGroup    string // K
	PoolId                string // L
	discordID             string // M
	initialAdaDeclaration string // N
}

func (r *MainQueueRec) MarshalJSON() ([]byte, error) {
	return json.Marshal(*r)
}

func (r *MainQueueRec) MarshalYAML() (any, error) {
	return *r, nil
}

type MainQueue struct {
	mu               sync.RWMutex
	records          []*MainQueueRec
	served           *MainQueueRec
	totalAdaInQueue  uint64
	cacheByTicker    sync.Map
	cacheByStakeAddr sync.Map
	cacheByStakeKey  sync.Map

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
	err := mq.Refresh(f2lb)
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

func (mq *MainQueue) Refresh(f2lb *F2LB) error {
	res, err := f2lb.Spreadsheets.Values.BatchGet(f2lbSpreadSheetID).MajorDimension("ROWS").Ranges(
		fmt.Sprintf("%s!%s", mainQueueSheet, mainQueueRange)).Do()
	if err != nil {
		return err
	}
	var totalAdaInQueue uint64
	records := make([]*MainQueueRec, 0, len(res.ValueRanges[0].Values))
	for _, v := range res.ValueRanges[0].Values {
		qppVal, _ := strconv.ParseUint(v[1].(string), 10, 16)
		adVal, _ := strconv.ParseUint(v[3].(string), 10, 16)
		egVal, _ := strconv.ParseUint(v[4].(string), 10, 16)

		mqRec := &MainQueueRec{
			DiscordName:           v[0].(string),  // A
			QPP:                   uint16(qppVal), // B
			Ticker:                v[2].(string),  // C
			AD:                    uint16(adVal),  // D
			EG:                    uint16(egVal),  // E
			delegStatus:           v[5].(string),  // F
			mainQCurrPos:          v[6].(string),  // G
			addonQStatus:          v[7].(string),  // H
			missedEpochs:          v[9].(string),  // J
			addedToGoogleGroup:    v[10].(string), // K
			PoolId:                v[11].(string), // L
			discordID:             v[12].(string), // M
			initialAdaDeclaration: v[13].(string), // N
		}

		// compute for column I
		for _, val := range regexp.MustCompile("[[:space:]]").Split(v[8].(string), -1) {
			if val == "" {
				continue
			}
			if val[:5] == "stake" {
				mqRec.StakeAddrs = append(mqRec.StakeAddrs, val)
				mqRec.StakeKeys = append(mqRec.StakeKeys, utils.StakeAddressToStakeKeyHashOrDie(val))
			} else {
				mqRec.StakeKeys = append(mqRec.StakeKeys, val)
				mqRec.StakeAddrs = append(mqRec.StakeAddrs, utils.StakeKeyHashToStakeAddressOrDie(val))
			}
		}

		totalAdaInQueue = totalAdaInQueue + adVal

		records = append(records, mqRec)
	}

	// determine served pool on top, at position 1 in the queue
	onTopIdx := -1
	timeToCheckForServed := utils.CurrentEpoch() > mq.refreshedInEpoch
	if timeToCheckForServed {
		resSheets, err := f2lb.Spreadsheets.Get(f2lbSpreadSheetID).Ranges(
			fmt.Sprintf("%s!A3:A%d", mainQueueSheet, len(records)+2)).IncludeGridData(true).Do()
		utils.CheckErr(err)
		for i, rowData := range resSheets.Sheets[0].Data[0].RowData {
			if len(rowData.Values) == 0 {
				continue
			}
			if rowData.Values[0].EffectiveFormat.BackgroundColorStyle.ThemeColor == "" {
				continue
			}
			onTopIdx = i
			break
		}
	}

	// now lock and prepare caches
	mq.mu.Lock()
	defer mq.mu.Unlock()
	mq.records = records
	if onTopIdx >= 0 {
		mq.served = records[onTopIdx]
		mq.refreshedInEpoch = utils.CurrentEpoch()
	}
	mq.totalAdaInQueue = totalAdaInQueue

	warn := &CacheWarn{}
	for _, rec := range records {
		actual, loaded := mq.cacheByTicker.LoadOrStore(rec.Ticker, rec)
		if loaded && actual != rec {
			warn.warnings = append(warn.warnings,
				fmt.Sprintf("Ticker %s in cache is not record: %v but %v, overwrite", rec.Ticker, rec, actual))
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

func (mq *MainQueue) GetRecords() []*MainQueueRec {
	mq.mu.RLock()
	defer mq.mu.RUnlock()

	// return mq.records

	// records := make([]*MainQueueRec, 0, len(mq.records))
	// for _, rec := range mq.records {
	// 	records = append(records, rec)
	// }

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
