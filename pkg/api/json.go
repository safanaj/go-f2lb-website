package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/f2lb_members"
)

type member struct {
	DiscordId                string   `json:"discord_id"`
	Ticker                   string   `json:"ticker"`
	StakeKey                 string   `json:"stake_key"`
	StakeAddr                string   `json:"stake_addr"`
	StakeKeys                []string `json:"stake_keys"`
	StakeAddrs               []string `json:"stake_addrs"`
	AdaDeclared              uint32   `json:"ada_declared"`
	AdaDelegated             uint32   `json:"ada_delegated"`
	EpochGranted             uint32   `json:"epoch_granted"`
	PoolIdHex                string   `json:"pool_id_hex"`
	PoolIdBech32             string   `json:"pool_id_bech32"`
	DelegatedPool            string   `json:"delegated_pool"`
	StartingEpoch            uint32   `json:"starting_epoch"`
	StartingTime             string   `json:"starting_time"`
	MainQCurrPos             uint32   `json:"main_q_curr_pos"`
	EpochGrantedOnAddonQueue uint32   `json:"epoch_granted_on_addon_q"`
	ActiveStake              uint32   `json:"active_stake"`
	LiveStake                uint32   `json:"live_stake"`
	LiveDelegators           uint32   `json:"live_delegators"`
}

func newMemeberFromStakePool(sp f2lb_members.StakePool) member {
	return member{
		DiscordId:                sp.DiscordName(),
		Ticker:                   sp.Ticker(),
		StakeKey:                 sp.MainStakeKey(),
		StakeAddr:                sp.MainStakeAddress(),
		StakeKeys:                sp.StakeKeys(),
		StakeAddrs:               sp.StakeAddrs(),
		AdaDeclared:              uint32(sp.AdaDeclared()),
		AdaDelegated:             uint32(sp.AdaDelegated()),
		EpochGranted:             uint32(sp.EpochGranted()),
		PoolIdHex:                sp.PoolIdHex(),
		PoolIdBech32:             sp.PoolIdBech32(),
		DelegatedPool:            sp.DelegatedPool(),
		StartingEpoch:            uint32(sp.StartingEpochOnMainQueue()),
		StartingTime:             sp.StartingTimeOnMainQueue().Format(time.RFC850),
		MainQCurrPos:             uint32(sp.MainQueueCurrentPosision()),
		EpochGrantedOnAddonQueue: uint32(sp.EpochGrantedOnAddonQueue()),
		ActiveStake:              sp.ActiveStake(),
		LiveStake:                sp.LiveStake(),
		LiveDelegators:           sp.LiveDelegators(),
	}
}

func RegisterApiV0(rg *gin.RouterGroup, ctrl f2lb_gsheet.Controller) {
	rg.GET("/main-queue.json", func(c *gin.Context) {
		sps := ctrl.GetStakePoolSet()
		queue := ctrl.GetMainQueue()
		members := []member{}
		for _, t := range queue.GetOrdered() {
			if sp := sps.Get(t); sp != nil {
				members = append(members, newMemeberFromStakePool(sp))
			}
		}
		c.IndentedJSON(http.StatusOK, members)
	})

	rg.GET("/addon-queue.json", func(c *gin.Context) {
		sps := ctrl.GetStakePoolSet()
		queue := ctrl.GetAddonQueue()
		members := []member{}
		for _, t := range queue.GetOrdered() {
			if sp := sps.Get(t); sp != nil {
				members = append(members, newMemeberFromStakePool(sp))
			}
		}
		c.IndentedJSON(http.StatusOK, members)
	})
}
