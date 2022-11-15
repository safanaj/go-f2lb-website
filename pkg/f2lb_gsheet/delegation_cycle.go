package f2lb_gsheet

import (
	"fmt"
	"strconv"

	"github.com/safanaj/go-f2lb/pkg/logging"
)

// google spreadsheet ranges
const delegationCycleSheet = "Delegation Cycle"

// the first row is the header
const delegationCycleRange = "A2:O"

type DelegationCycle struct {
	epoch              uint32
	topTicker          string
	topRemainingEpochs uint32
	activeTicker       string

	aqTopTicker          string
	aqTopRemainingEpochs uint32
}

func (m *DelegationCycle) GetRange() string {
	return fmt.Sprintf("%s!%s", delegationCycleSheet, delegationCycleRange)
}

func (m *DelegationCycle) GetActiveTicker() string { return m.activeTicker }
func (m *DelegationCycle) GetTopTicker() string    { return m.topTicker }

func (m *DelegationCycle) Refresh(vr *ValueRange) {
	if vr == nil || len(vr.Values) < 2 {
		return
	}
	log := logging.GetLogger()
	first := vr.Values[0]
	epochVal, _ := strconv.ParseUint(first[0].(string), 10, 32)
	m.epoch = uint32(epochVal)
	m.topTicker = first[4].(string)
	m.activeTicker = first[6].(string)
	remaining := uint32(1)
	for _, v := range vr.Values[1:] {
		if m.topTicker != v[4].(string) {
			log.V(3).Info("DelegationCycle.Refresh", "top ticker", m.topTicker, "remaining", remaining, "found", v[4].(string))
			break
		}
		remaining++
	}
	m.topRemainingEpochs = remaining

	if len(first) > 14 {
		// process column O for the addon queue topTicker and remaining epochs
		m.aqTopTicker = first[14].(string)
		remaining := uint32(1)
		for _, v := range vr.Values[1:] {
			if m.aqTopTicker != v[14].(string) {
				log.V(3).Info("DelegationCycle.Refresh", "AQ top ticker", m.aqTopTicker, "AQ remaining", remaining, "AQ found", v[14].(string))
				break
			}
			remaining++
		}
		m.aqTopRemainingEpochs = remaining
	}

	return
}
