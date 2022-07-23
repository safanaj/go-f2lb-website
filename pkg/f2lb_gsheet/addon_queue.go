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
const addonQueueSheet = "AddonQ"

// the first 2 rows are headers
const addonQueueRange = "A2:N"

type AddonQueueRec struct {
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
	addonQCurrPos         string // G
	addonQStatus          string // H
	missedEpochs          string // J
	addedToGoogleGroup    string // K
	poolId                string // L
	discordID             string // M
	initialAdaDeclaration string // N
}

func (r *AddonQueueRec) MarshalJSON() ([]byte, error) {
	return json.Marshal(*r)
}

func (r *AddonQueueRec) MarshalYAML() (any, error) {
	return *r, nil
}

type AddonQueue struct {
	mu      sync.RWMutex
	records []*AddonQueueRec
	served  *AddonQueueRec

	cacheByTicker    sync.Map
	cacheByStakeAddr sync.Map
	cacheByStakeKey  sync.Map

	// epoch when served was computed
	refreshedInEpoch utils.Epoch
	refreshTime      time.Time
}

func (aq *AddonQueue) toMarshalable() any {
	return struct {
		Records []*AddonQueueRec `json:"records"`
		Served  *AddonQueueRec   `json:"served"`
	}{aq.GetRecords(), aq.GetServed()}
}

func (aq *AddonQueue) MarshalJSON() ([]byte, error) {
	return json.Marshal(aq.toMarshalable())
}

func (aq *AddonQueue) MarshalYAML() (any, error) {
	return aq.toMarshalable(), nil
}

func NewAddonQueue(f2lb *F2LB) (*AddonQueue, error) {
	aq := &AddonQueue{}
	err := aq.Refresh(f2lb)
	var cwarn *CacheWarn
	if err != nil && !errors.As(err, &cwarn) {
		return nil, err
	}
	return aq, err
}

func NewAddonQueueOrDie(f2lb *F2LB) *AddonQueue {
	aq, err := NewAddonQueue(f2lb)
	if aq == nil {
		utils.CheckErr(err)
	}
	return aq
}

func (aq *AddonQueue) Refresh(f2lb *F2LB) error {
	res, err := f2lb.Spreadsheets.Values.BatchGet(f2lbSpreadSheetID).MajorDimension("ROWS").Ranges(
		fmt.Sprintf("%s!%s", addonQueueSheet, addonQueueRange)).Do()
	if err != nil {
		return err
	}
	records := make([]*AddonQueueRec, 0, len(res.ValueRanges[0].Values))
	for _, v := range res.ValueRanges[0].Values {
		qppVal, _ := strconv.ParseUint(v[1].(string), 10, 16)
		adVal, _ := strconv.ParseUint(v[3].(string), 10, 16)
		egVal, _ := strconv.ParseUint(v[4].(string), 10, 16)

		aqRec := &AddonQueueRec{
			DiscordName: v[0].(string),  // A
			QPP:         uint16(qppVal), // B
			Ticker:      v[2].(string),  // C
			AD:          uint16(adVal),  // D
			EG:          uint16(egVal),  // E
		}
		if len(v) > 5 {
			aqRec.delegStatus = v[5].(string) // F
		}
		if len(v) > 6 {
			aqRec.addonQCurrPos = v[6].(string) // G
		}
		if len(v) > 7 {
			aqRec.addonQStatus = v[7].(string) // H
		}
		if len(v) > 9 {
			aqRec.missedEpochs = v[9].(string) // J
		}
		if len(v) > 10 {
			aqRec.addedToGoogleGroup = v[10].(string) // K
		}
		if len(v) > 11 {
			aqRec.poolId = v[11].(string) // L
		}
		if len(v) > 12 {
			aqRec.discordID = v[12].(string) // M
		}
		if len(v) > 13 {
			aqRec.initialAdaDeclaration = v[13].(string) // N
		}

		// compute for column I
		for _, val := range regexp.MustCompile("[[:space:]]").Split(v[8].(string), -1) {
			if val == "" {
				continue
			}
			if val[:5] == "stake" {
				aqRec.StakeAddrs = append(aqRec.StakeAddrs, val)
				aqRec.StakeKeys = append(aqRec.StakeKeys, utils.StakeAddressToStakeKeyHashOrDie(val))
			} else {
				aqRec.StakeKeys = append(aqRec.StakeKeys, val)
				aqRec.StakeAddrs = append(aqRec.StakeAddrs, utils.StakeKeyHashToStakeAddressOrDie(val))
			}
		}

		records = append(records, aqRec)
	}

	// determine served pool on top, at position 1 in the queue
	onTopIdx := -1
	timeToCheckForServed := utils.CurrentEpoch() > aq.refreshedInEpoch
	if timeToCheckForServed {
		resSheets, err := f2lb.Spreadsheets.Get(f2lbSpreadSheetID).Ranges(
			fmt.Sprintf("%s!A2:A%d", addonQueueSheet, len(records)+1)).IncludeGridData(true).Do()
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
	aq.mu.Lock()
	defer aq.mu.Unlock()
	aq.records = records

	if onTopIdx >= 0 {
		aq.served = records[onTopIdx]
		aq.refreshedInEpoch = utils.CurrentEpoch()
	}

	warn := &CacheWarn{}
	for _, rec := range records {
		actual, loaded := aq.cacheByTicker.LoadOrStore(rec.Ticker, rec)
		if loaded && actual != rec {
			warn.warnings = append(warn.warnings,
				fmt.Sprintf("Ticker %s in cache is not record: %v but %v, overwrite", rec.Ticker, rec, actual))
			aq.cacheByTicker.Store(rec.Ticker, rec)
		}

		for _, skey := range rec.StakeKeys {
			actual, loaded := aq.cacheByStakeKey.LoadOrStore(skey, rec)
			if loaded && actual != rec {
				warn.warnings = append(warn.warnings,
					fmt.Sprintf("Stake key %s in cache is not record: %v but %v, overwrite", skey, rec, actual))
				aq.cacheByStakeKey.Store(skey, rec)
			}

		}
		for _, saddr := range rec.StakeAddrs {
			actual, loaded := aq.cacheByStakeAddr.LoadOrStore(saddr, rec)
			if loaded && actual != rec {
				warn.warnings = append(warn.warnings,
					fmt.Sprintf("Stake address %s in cache is not record: %v but %v, overwrite", saddr, rec, actual))
				aq.cacheByStakeAddr.Store(saddr, rec)
			}
		}
	}
	aq.refreshTime = time.Now()
	if len(warn.warnings) > 0 {
		return warn
	}
	return nil
}

func (aq *AddonQueue) GetRecords() []*AddonQueueRec {
	aq.mu.RLock()
	defer aq.mu.RUnlock()

	// return aq.records

	// records := make([]*AddonQueueRec, 0, len(aq.records))
	// for _, rec := range aq.records {
	// 	records = append(records, rec)
	// }

	records := make([]*AddonQueueRec, len(aq.records))
	copy(records, aq.records)

	return records
}

func (aq *AddonQueue) GetServed() *AddonQueueRec {
	aq.mu.RLock()
	defer aq.mu.RUnlock()
	return aq.served
}

func (aq *AddonQueue) getBy(key string, cache sync.Map) *AddonQueueRec {
	val, ok := cache.Load(key)
	if ok {
		return val.(*AddonQueueRec)
	}
	return nil
}

func (aq *AddonQueue) GetByTicker(ticker string) *AddonQueueRec {
	return aq.getBy(ticker, aq.cacheByTicker)
}
func (aq *AddonQueue) GetByStakeKey(stakeKey string) *AddonQueueRec {
	return aq.getBy(stakeKey, aq.cacheByStakeKey)
}
func (aq *AddonQueue) GetByStakeAddr(stakeAddr string) *AddonQueueRec {
	return aq.getBy(stakeAddr, aq.cacheByStakeAddr)
}

func (aq *AddonQueue) GetRefreshedInEpoch() utils.Epoch {
	aq.mu.RLock()
	defer aq.mu.RUnlock()
	return aq.refreshedInEpoch
}

func (aq *AddonQueue) GetRefreshTime() time.Time {
	aq.mu.RLock()
	defer aq.mu.RUnlock()
	return aq.refreshTime
}
