package v0

import (
	"encoding/csv"
	"fmt"
	"reflect"
	"strings"
	"time"

	"github.com/safanaj/go-f2lb/pkg/f2lb_members"
)

type member struct {
	DiscordId                 string   `json:"discord_id"`
	Ticker                    string   `json:"ticker"`
	StakeKey                  string   `json:"stake_key"`
	StakeAddr                 string   `json:"stake_addr"`
	StakeKeys                 []string `json:"stake_keys"`
	StakeAddrs                []string `json:"stake_addrs"`
	AdaDeclared               uint32   `json:"ada_declared"`
	AdaDelegated              uint32   `json:"ada_delegated"`
	EpochGranted              uint32   `json:"epoch_granted"`
	PoolIdHex                 string   `json:"pool_id_hex"`
	PoolIdBech32              string   `json:"pool_id_bech32"`
	DelegatedPool             string   `json:"delegated_pool"`
	StartingEpoch             uint32   `json:"starting_epoch"`
	StartingTime              string   `json:"starting_time"`
	MainQCurrPos              uint32   `json:"main_q_curr_pos"`
	EpochGrantedOnAddonQueue  uint32   `json:"epoch_granted_on_addon_q"`
	StartingEpochOnAddonQueue uint32   `json:"starting_epoch_on_addon_q"`
	StartingTimeOnAddonQueue  string   `json:"starting_time_on_addon_q"`
	ActiveStake               uint32   `json:"active_stake"`
	LiveStake                 uint32   `json:"live_stake"`
	LiveDelegators            uint32   `json:"live_delegators"`
}

func newMemeberFromStakePool(sp f2lb_members.StakePool) member {
	return member{
		DiscordId:                 sp.DiscordName(),
		Ticker:                    sp.Ticker(),
		StakeKey:                  sp.MainStakeKey(),
		StakeAddr:                 sp.MainStakeAddress(),
		StakeKeys:                 sp.StakeKeys(),
		StakeAddrs:                sp.StakeAddrs(),
		AdaDeclared:               uint32(sp.AdaDeclared()),
		AdaDelegated:              uint32(sp.AdaDelegated()),
		EpochGranted:              uint32(sp.EpochGranted()),
		PoolIdHex:                 sp.PoolIdHex(),
		PoolIdBech32:              sp.PoolIdBech32(),
		DelegatedPool:             sp.DelegatedPool(),
		StartingEpoch:             uint32(sp.StartingEpochOnMainQueue()),
		StartingTime:              sp.StartingTimeOnMainQueue().Format(time.RFC850),
		MainQCurrPos:              uint32(sp.MainQueueCurrentPosision()),
		EpochGrantedOnAddonQueue:  uint32(sp.EpochGrantedOnAddonQueue()),
		StartingEpochOnAddonQueue: uint32(sp.StartingEpochOnAddonQueue()),
		StartingTimeOnAddonQueue:  sp.StartingTimeOnAddonQueue().Format(time.RFC850),
		ActiveStake:               sp.ActiveStake(),
		LiveStake:                 sp.LiveStake(),
		LiveDelegators:            sp.LiveDelegators(),
	}
}

func getMemberByTickersForApi(sps f2lb_members.StakePoolSet, tickers []string) (members []member) {
	for _, t := range tickers {
		if sp := sps.Get(t); sp != nil {
			members = append(members, newMemeberFromStakePool(sp))
		}
	}
	return members
}

func getMembersAsCSVRecordsForApi(members []member) (string, error) {
	sb := strings.Builder{}
	w := csv.NewWriter(&sb)
	typ := reflect.TypeOf(member{})
	fieldNum := typ.NumField()
	hl := []string{}
	for i := 0; i < fieldNum; i++ {
		f := typ.Field(i)
		hl = append(hl, f.Tag.Get("json"))
	}
	m2r := func(m member) []string {
		r := []string{m.DiscordId, m.Ticker, m.StakeKey, m.StakeAddr}
		r = append(r, strings.Join(m.StakeKeys, "\n"))
		r = append(r, strings.Join(m.StakeAddrs, "\n"))
		r = append(r, fmt.Sprintf("%d", m.AdaDeclared))
		r = append(r, fmt.Sprintf("%d", m.AdaDelegated))
		r = append(r, fmt.Sprintf("%d", m.EpochGranted))
		r = append(r, m.PoolIdHex)
		r = append(r, m.PoolIdBech32)
		r = append(r, m.DelegatedPool)
		r = append(r, fmt.Sprintf("%d", m.StartingEpoch))
		r = append(r, m.StartingTime)
		r = append(r, fmt.Sprintf("%d", m.MainQCurrPos))
		r = append(r, fmt.Sprintf("%d", m.EpochGrantedOnAddonQueue))
		r = append(r, fmt.Sprintf("%d", m.StartingEpochOnAddonQueue))
		r = append(r, m.StartingTimeOnAddonQueue)
		r = append(r, fmt.Sprintf("%d", m.ActiveStake))
		r = append(r, fmt.Sprintf("%d", m.LiveStake))
		r = append(r, fmt.Sprintf("%d", m.LiveDelegators))
		return r
	}

	w.Write(hl)
	for _, m := range members {
		if err := w.Write(m2r(m)); err != nil {
			return "", err
		}
	}
	w.Flush()
	if err := w.Error(); err != nil {
		return "", err
	}
	return sb.String(), nil
}
