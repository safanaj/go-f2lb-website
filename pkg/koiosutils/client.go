package koiosutils

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	koios "github.com/cardano-community/koios-go-client"
)

type KoiosClient struct {
	ctx context.Context
	k   *koios.Client
}

func New(ctx context.Context) *KoiosClient {
	k, _ := koios.New()
	return &KoiosClient{ctx: ctx, k: k}
}

func (kc *KoiosClient) GetKoiosClient() *koios.Client { return kc.k }
func (kc *KoiosClient) GetContext() context.Context   { return kc.ctx }

// utility function to know if continue pagination or not
// simply check if the "end of content range" is matching the PageSize
func IsResponseComplete(res koios.Response) bool {
	fields := strings.FieldsFunc(res.ContentRange, func(r rune) bool { return r == '-' || r == '/' })
	if len(fields) != 3 {
		return false
	}
	if endSide_, err := strconv.ParseUint(fields[1], 10, 16); err == nil {
		return (uint16(endSide_) % uint16(koios.PageSize)) < uint16(koios.PageSize-1)
	}
	return false
}

// it takes a list of Ticker (as strings) and returns a map with Tickers as keys and PoolId as values
// in case the input is zero-length it returns all the registered pool ids with a ticker
//
// returns: result map, an error, the number of missing / not found pools
func (kc *KoiosClient) GetTickerToPoolIdMapFor(tickers ...string) (map[string]string, error, map[string]any) {
	var err error
	getAll := len(tickers) == 0
	r := make(map[string]string)
	// missing / not yet found tickers
	m := make(map[string]any)
	for _, t := range tickers {
		m[t] = struct{}{}
	}

	page := uint(1)
	for {
		opts := kc.k.NewRequestOptions()
		opts.Page(page)
		page = page + 1
		pools, err := kc.k.GetPoolList(kc.ctx, opts)
		if err != nil || len(pools.Data) == 0 {
			break
		}

		for _, p := range pools.Data {
			if p.PoolID == "" || p.Ticker == nil || (p.Ticker != nil && *p.Ticker == "") {
				continue
			}

			if getAll {
				r[*p.Ticker] = string(p.PoolID)
			} else if _, ok := m[*p.Ticker]; ok {
				r[*p.Ticker] = string(p.PoolID)
				delete(m, *p.Ticker)
				if len(m) == 0 {
					break
				}
			}
		}
		// check if we are done
		if (!getAll && len(m) == 0) || IsResponseComplete(pools.Response) {
			break
		}
	}
	return r, err, m
}

type PoolInfo struct {
	Bech32         string
	Ticker         string
	ActiveStake    uint32
	LiveStake      uint32
	LiveDelegators uint32
}

func (kc *KoiosClient) GetPoolsInfos(bech32PoolIds ...string) (map[string]*PoolInfo, error) {
	if len(bech32PoolIds) == 0 {
		return nil, nil
	}
	var err error
	res := make(map[string]*PoolInfo)
	pids := make([]koios.PoolID, 0, len(bech32PoolIds))
	for _, pid := range bech32PoolIds {
		pids = append(pids, koios.PoolID(pid))
	}

	page := uint(1)
	opts_ := kc.k.NewRequestOptions()

	opts_.QuerySet("select", "pool_id_bech32,meta_json,active_stake,live_stake,live_delegators")

	for {
		opts, _ := opts_.Clone()
		opts.Page(page)
		page = page + 1
		pools, err := kc.k.GetPoolInfos(kc.ctx, pids, opts)
		if err != nil || len(pools.Data) == 0 {
			break
		}

		for _, p := range pools.Data {
			if p.ID == "" || p.MetaJSON.Ticker == nil || (p.MetaJSON.Ticker != nil && *p.MetaJSON.Ticker == "") {
				continue
			}
			pi := &PoolInfo{
				Bech32:         string(p.ID),
				Ticker:         *p.MetaJSON.Ticker,
				ActiveStake:    uint32(p.ActiveStake.Shift(-6).IntPart()),
				LiveStake:      uint32(p.LiveStake.Shift(-6).IntPart()),
				LiveDelegators: uint32(p.LiveDelegators),
			}

			res[string(p.ID)] = pi
		}

		if IsResponseComplete(pools.Response) {
			break
		}
	}
	return res, err
}

func (kc *KoiosClient) GetStakeAddressInfo(stakeAddr string) (delegatedPool string, totalAda uint32, err error) {
	var info *koios.AccountInfoResponse
	opts := kc.k.NewRequestOptions()
	opts.QuerySet("select", "delegated_pool,total_balance")
	info, err = kc.k.GetAccountInfo(kc.ctx, koios.Address(stakeAddr), opts)
	if err == nil {
		delegatedPool = string(info.Data.DelegatedPool)
		totalAda = uint32(info.Data.TotalBalance.Shift(-6).IntPart())
	}
	return
}

func (kc *KoiosClient) GetLastDelegationTx(stakeAddr string) (koios.TxHash, error) {
	var lastDelegTx koios.TxHash
	page := uint(1)
	for {
		opts := kc.k.NewRequestOptions()
		opts.Page(page)
		page++
		res, err := kc.k.GetAccountUpdates(kc.ctx, koios.StakeAddress(stakeAddr), opts)
		if err != nil {
			return koios.TxHash(""), err
		}
		if len(res.Data) == 0 {
			break
		}
		for i := len(res.Data) - 1; i > 0; i-- {
			if res.Data[i].ActionType != "delegation" {
				continue
			}
			lastDelegTx = res.Data[i].TxHash
			break
		}
		if IsResponseComplete(res.Response) {
			break
		}
	}
	return lastDelegTx, nil
}

func (kc *KoiosClient) GetTxsTimes(txs []koios.TxHash) (map[koios.TxHash]time.Time, error) {
	page := uint(1)
	opts_ := kc.k.NewRequestOptions()
	opts_.QuerySet("select", "tx_hash,tx_timestamp")
	ret := make(map[koios.TxHash]time.Time)
	for {
		opts, _ := opts_.Clone()
		opts.Page(page)
		page++
		res, err := kc.k.GetTxsInfo(kc.ctx, txs, opts)
		if err != nil || len(res.Data) == 0 {
			return ret, err
		}
		for _, ti := range res.Data {
			// if t, err := time.Parse(time.RFC3339, ti.TxTimestamp+"Z"); err == nil {
			// 	ret[ti.TxHash] = t
			// ret[ti.TxHash] = time.Unix(ti.TxTimestamp, 0)
			ret[ti.TxHash] = ti.TxTimestamp.Time
			// } else {
			// 	return ret, err
			// }
		}
		if IsResponseComplete(res.Response) {
			break
		}
	}
	return ret, nil
}

func (kc *KoiosClient) GetLastDelegationTime(stakeAddr string) (time.Time, error) {
	var lastDelegTx koios.TxHash
	page := uint(1)
	for {
		opts := kc.k.NewRequestOptions()
		opts.Page(page)
		page++
		res, err := kc.k.GetAccountUpdates(kc.ctx, koios.StakeAddress(stakeAddr), opts)
		if err != nil {
			return time.Time{}, err
		}
		if len(res.Data) == 0 {
			break
		}
		for i := len(res.Data) - 1; i > 0; i-- {
			if res.Data[i].ActionType != "delegation" {
				continue
			}
			lastDelegTx = res.Data[i].TxHash
			break
		}
		if IsResponseComplete(res.Response) {
			break
		}
	}

	if lastDelegTx != koios.TxHash("") {
		opts := kc.k.NewRequestOptions()
		opts.QuerySet("select", "tx_timestamp")
		res, err := kc.k.GetTxInfo(kc.ctx, koios.TxHash(lastDelegTx), opts)
		if err != nil {
			return time.Time{}, err
		}
		// return time.Parse(time.RFC3339, res.Data.TxTimestamp+"Z")
		// return time.Unix(res.Data.TxTimestamp, 0), nil
		return res.Data.TxTimestamp.Time, nil
	}
	return time.Time{}, fmt.Errorf("LastDelegationTxNotFound")
}
