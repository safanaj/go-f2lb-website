package f2lb_gsheet

import (
	"encoding/json"
	"fmt"
	"regexp"
	"sync"

	"github.com/safanaj/go-f2lb/pkg/utils"
)

// google spreadsheet ranges
const supportersSheet = "F2LB-Supporters"

// the first row is the header
const supportersRange = "A2:D"

type Supporter struct {
	DiscordName string `json:"discord_name" yaml:"discord_name"`         // A
	Ticker      string `json:"ticker,omitempty" yaml:"ticker,omitempty"` // A
	// computed column C
	StakeKeys  []string `json:"stake_keys" yaml:"stake_keys"`
	StakeAddrs []string `json:"stake_addresses" yaml:"stake_addresses"`

	discordID string // D
}

func (s *Supporter) MarshalJSON() ([]byte, error) { return json.Marshal(*s) }
func (s *Supporter) MarshalYAML() (any, error)    { return *s, nil }

type Supporters struct {
	mu      sync.RWMutex
	records []*Supporter
}

func NewSupporters(f2lb *F2LB) (*Supporters, error) {
	s := &Supporters{}
	err := s.Refresh(f2lb, nil)
	if err != nil {
		return nil, err
	}
	return s, nil
}

func NewSupportersOrDie(f2lb *F2LB) *Supporters {
	s, err := NewSupporters(f2lb)
	utils.CheckErr(err)
	return s
}

func (s *Supporters) toMarshalable() any {
	return struct {
		Records []*Supporter `json:"records" yaml:"records"`
	}{s.GetRecords()}
}
func (s *Supporters) MarshalJSON() ([]byte, error) { return json.Marshal(s.toMarshalable()) }
func (s *Supporters) MarshalYAML() (any, error)    { return s.toMarshalable(), nil }

func (m *Supporters) GetRange() string {
	return fmt.Sprintf("%s!%s", supportersSheet, supportersRange)
}

func (m *Supporters) Refresh(f2lb *F2LB, vr *ValueRange) error {
	if vr == nil {
		res, err := f2lb.Spreadsheets.Values.BatchGet(
			f2lbSpreadSheetID).MajorDimension("ROWS").Ranges(
			m.GetRange()).Do()
		if err != nil {
			return err
		}
		vr = res.ValueRanges[0]
	}
	records := make([]*Supporter, 0, len(vr.Values))
	for _, v := range vr.Values {
		sRec := &Supporter{
			DiscordName: v[0].(string),
			Ticker:      v[1].(string),
		}
		if len(v) > 3 {
			sRec.discordID = v[3].(string)
		}

		if sRec.Ticker == "-" {
			sRec.Ticker = ""
		}

		for _, val := range regexp.MustCompile("[[:space:]]").Split(v[2].(string), -1) {
			if val == "" {
				continue
			}
			if val[:5] == "stake" {
				sRec.StakeAddrs = append(sRec.StakeAddrs, val)
				sRec.StakeKeys = append(sRec.StakeKeys, utils.StakeAddressToStakeKeyHashOrDie(val))
			} else {
				sRec.StakeKeys = append(sRec.StakeKeys, val)
				sRec.StakeAddrs = append(sRec.StakeAddrs, utils.StakeKeyHashToStakeAddressOrDie(val))
			}
		}
		records = append(records, sRec)
	}

	m.mu.Lock()
	defer m.mu.Unlock()
	m.records = records
	return nil
}

func (s *Supporters) GetRecords() []*Supporter {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// return mq.records

	// records := make([]*MainQueueRec, 0, len(mq.records))
	// for _, rec := range mq.records {
	// 	records = append(records, rec)
	// }

	records := make([]*Supporter, len(s.records))
	copy(records, s.records)

	return records
}
