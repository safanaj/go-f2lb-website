package koiosutils

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	koios "github.com/cardano-community/koios-go-client/v2"
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
		opts.SetCurrentPage(page)
		page = page + 1
		pools, err := kc.k.GetPools(kc.ctx, opts)
		if err != nil || len(pools.Data) == 0 {
			break
		}

		for _, p := range pools.Data {
			if p.PoolID == "" || p.Ticker == "" {
				continue
			}

			if getAll {
				r[p.Ticker] = string(p.PoolID)
			} else if _, ok := m[p.Ticker]; ok {
				r[p.Ticker] = string(p.PoolID)
				delete(m, p.Ticker)
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
		opts := opts_.Clone()
		opts.SetCurrentPage(page)
		page = page + 1
		pools, err := kc.k.GetPoolInfos(kc.ctx, pids, opts)
		if err != nil || len(pools.Data) == 0 {
			break
		}

		for _, p := range pools.Data {
			if p.PoolID == "" || p.MetaJSON.Ticker == nil || (p.MetaJSON.Ticker != nil && *p.MetaJSON.Ticker == "") {
				continue
			}
			pi := &PoolInfo{
				Bech32:         string(p.PoolID),
				Ticker:         *p.MetaJSON.Ticker,
				ActiveStake:    uint32(p.ActiveStake.Shift(-6).IntPart()),
				LiveStake:      uint32(p.LiveStake.Shift(-6).IntPart()),
				LiveDelegators: uint32(p.LiveDelegators),
			}

			res[pi.Bech32] = pi
		}

		if IsResponseComplete(pools.Response) {
			break
		}
	}
	return res, err
}

type AccountInfo struct {
	Bech32        string
	DelegatedPool string
	Status        string
	TotalAda      uint32
}

func (kc *KoiosClient) GetStakeAddressesInfos(stakeAddrs ...string) (map[string]*AccountInfo, error) {
	if len(stakeAddrs) == 0 {
		return nil, nil
	}
	var err error
	res := make(map[string]*AccountInfo)
	saddrs := make([]koios.Address, 0, len(stakeAddrs))

	for _, saddr := range stakeAddrs {
		saddrs = append(saddrs, koios.Address(saddr))
	}

	page := uint(1)
	opts_ := kc.k.NewRequestOptions()

	opts_.QuerySet("select", "delegated_pool,total_balance,status,stake_address")

	for {
		opts := opts_.Clone()
		opts.SetCurrentPage(page)
		page = page + 1
		infos, err := kc.k.GetAccountsInfo(kc.ctx, saddrs, opts)
		if err != nil || len(infos.Data) == 0 {
			break
		}

		for _, i := range infos.Data {
			if string(i.StakeAddress) == "" {
				continue
			}
			dp := ""
			if i.DelegatedPool != nil && string(*i.DelegatedPool) != "" {
				dp = string(*i.DelegatedPool)
			}
			ai := &AccountInfo{
				Bech32:        string(i.StakeAddress),
				DelegatedPool: dp,
				Status:        i.Status,
				TotalAda:      uint32(i.TotalBalance.Shift(-6).IntPart()),
			}

			res[ai.Bech32] = ai
		}

		if IsResponseComplete(infos.Response) {
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
		if info.Data.DelegatedPool != nil && *info.Data.DelegatedPool != "" {
			delegatedPool = string(*info.Data.DelegatedPool)
		}
		totalAda = uint32(info.Data.TotalBalance.Shift(-6).IntPart())
	}
	return
}

func (kc *KoiosClient) GetLastDelegationTx(stakeAddr string) (koios.TxHash, error) {
	var lastDelegTx koios.TxHash
	page := uint(1)
	for {
		opts := kc.k.NewRequestOptions()
		opts.SetCurrentPage(page)
		page++
		res, err := kc.k.GetAccountUpdates(kc.ctx, koios.Address(stakeAddr), nil, opts)
		if err != nil {
			return koios.TxHash(""), err
		}
		if len(res.Data.Updates) == 0 {
			break
		}
		for i := len(res.Data.Updates) - 1; i > 0; i-- {
			if res.Data.Updates[i].ActionType != "delegation" {
				continue
			}
			lastDelegTx = res.Data.Updates[i].TxHash
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
		opts := opts_.Clone()
		opts.SetCurrentPage(page)
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
		opts.SetCurrentPage(page)
		page++
		res, err := kc.k.GetAccountUpdates(kc.ctx, koios.Address(stakeAddr), nil, opts)
		if err != nil {
			return time.Time{}, err
		}
		if len(res.Data.Updates) == 0 {
			break
		}
		for i := len(res.Data.Updates) - 1; i > 0; i-- {
			if res.Data.Updates[i].ActionType != "delegation" {
				continue
			}
			lastDelegTx = res.Data.Updates[i].TxHash
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
		return res.Data.TxInfo.TxTimestamp.Time, nil
	}
	return time.Time{}, fmt.Errorf("LastDelegationTxNotFound")
}

func (kc *KoiosClient) GetTxsMetadata(txs []string) (map[string]string, error) {
	if len(txs) == 0 {
		return nil, nil
	}
	var err error
	res := make(map[string]string)
	txhs := make([]koios.TxHash, 0, len(txs))

	for _, txh := range txs {
		txhs = append(txhs, koios.TxHash(txh))
	}

	page := uint(1)
	opts_ := kc.k.NewRequestOptions()

	// opts_.QuerySet("select", "")

	for {
		opts := opts_.Clone()
		opts.SetCurrentPage(page)
		page = page + 1
		mds, err := kc.k.GetTxsMetadata(kc.ctx, txhs, opts)
		if err != nil || len(mds.Data) == 0 {
			break
		}

		for _, i := range mds.Data {
			if string(i.TxHash) == "" {
				continue
			}

			msg := ""
			metadata := map[string][]string{}
			if raw, ok := i.Metadata["674"]; ok {
				json.Unmarshal(raw, &metadata)
				if s, ok := metadata["msg"]; ok && len(s) == 1 {
					msg = s[0]
				}
			}
			res[string(i.TxHash)] = msg
		}

		if IsResponseComplete(mds.Response) {
			break
		}
	}
	return res, err
}
