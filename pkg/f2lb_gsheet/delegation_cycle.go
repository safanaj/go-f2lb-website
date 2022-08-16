package f2lb_gsheet

import (
	"fmt"
	"strconv"
)

// google spreadsheet ranges
const delegationCycleSheet = "Delegation Cycle"

// the first row is the header
const delegationCycleRange = "A2:E"

type DelegationCycle struct {
	epoch              uint32
	topTicker          string
	topRemainingEpochs uint32
}

func (m *DelegationCycle) GetRange() string {
	return fmt.Sprintf("%s!%s", delegationCycleSheet, delegationCycleRange)
}

func (m *DelegationCycle) Refresh(vr *ValueRange) {
	if vr == nil || len(vr.Values) < 2 {
		return
	}
	first := vr.Values[0]
	epochVal, _ := strconv.ParseUint(first[0].(string), 10, 32)
	m.epoch = uint32(epochVal)
	m.topTicker = first[4].(string)
	remaining := uint32(0)
	for _, v := range vr.Values[1:] {
		if m.topTicker != v[4].(string) {
			fmt.Printf("DelegationCycle.Refresh: top ticker: %s - remaining: %d - found: %v - f t: %s\n", m.topTicker, remaining, v, v[4].(string))
			break
		}
		remaining++
	}
	m.topRemainingEpochs = remaining
	return
}
