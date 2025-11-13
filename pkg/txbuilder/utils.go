package txbuilder

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"

	"filippo.io/age"
	"filippo.io/age/armor"

	"github.com/safanaj/cardano-go"

	"github.com/safanaj/go-f2lb/pkg/ccli"
)

var (
	ErrSecretsFilePathIsDir         = errors.New("Secrets file path is directory")
	ErrSecretsFilePathIsNotReadable = errors.New("Secrets file path is not readable")
	ErrSecretsFileWrongContent      = errors.New("Secrets file content is invalid")
	ErrCalledTwice                  = errors.New("PGP prompt function called twice")
	ErrNonSymmetric                 = errors.New("Age non symmetric encryption")
	ErrEmptyPassphrase              = errors.New("Age empty passphrase")
)

type protocolParameters struct {
	MinFeeA          cardano.Coin `json:"txFeePerByte"`
	MinFeeB          cardano.Coin `json:"txFeeFixed"`
	CoinsPerUTXOWord cardano.Coin `json:"utxoCostPerWord"`
}

func getProtocolParameters(ctx context.Context) (*cardano.ProtocolParams, error) {
	out, err := ccli.DoCommand(ctx, "query protocol-parameters --mainnet")
	if err != nil {
		return nil, err
	}
	pp := &protocolParameters{}
	if err := json.Unmarshal([]byte(out), pp); err != nil {
		return nil, err
	}
	return &cardano.ProtocolParams{
		MinFeeA:          pp.MinFeeA,
		MinFeeB:          pp.MinFeeB,
		CoinsPerUTXOWord: pp.CoinsPerUTXOWord,
	}, nil
}

func getUTxOs(ctx context.Context, addr cardano.Address) ([]*cardano.UTxO, error) {
	out, err := ccli.DoCommand(ctx, fmt.Sprintf("query utxo --mainnet --address %s", addr.String()))
	if err != nil {
		return nil, err
	}

	lines := strings.Split(string(out), "\n")
	if len(lines) < 3 {
		return nil, nil
	}

	utxos := []*cardano.UTxO{}
	for _, line := range lines[2 : len(lines)-1] {
		amount := cardano.NewValue(0)
		args := strings.Fields(line)
		if len(args) < 4 {
			return utxos, fmt.Errorf("malformed cli response")
		}
		txHash, err := cardano.NewHash32(args[0])
		if err != nil {
			return utxos, err
		}
		index, err := strconv.Atoi(args[1])
		if err != nil {
			return utxos, err
		}
		lovelace, err := strconv.Atoi(args[2])
		if err != nil {
			return utxos, err
		}
		amount.Coin = cardano.Coin(lovelace)

		assets := strings.Split(line, "+")
		for _, asset := range assets[1 : len(assets)-1] {
			args := strings.Fields(asset)
			quantity := args[0]
			unit := strings.ReplaceAll(args[1], ".", "")
			unitBytes, err := hex.DecodeString(unit)
			if err != nil {
				return utxos, err
			}
			policyID := cardano.NewPolicyIDFromHash(unitBytes[:28])
			assetName := string(unitBytes[28:])
			assetValue, err := strconv.ParseUint(quantity, 10, 64)
			if err != nil {
				return utxos, err
			}
			currentAssets := amount.MultiAsset.Get(policyID)
			if currentAssets != nil {
				currentAssets.Set(
					cardano.NewAssetName(assetName),
					cardano.BigNum(assetValue),
				)
			} else {
				amount.MultiAsset.Set(
					policyID,
					cardano.NewAssets().
						Set(
							cardano.NewAssetName(string(assetName)),
							cardano.BigNum(assetValue),
						),
				)
			}
		}

		utxos = append(utxos, &cardano.UTxO{
			Spender: addr,
			TxHash:  txHash,
			Index:   uint64(index),
			Amount:  amount,
		})
	}
	return utxos, nil
}

func loadSecrets() (map[string]string, error) {
	if passphrase == "" {
		return nil, ErrEmptyPassphrase
	}

	secFile, err := os.Open(secretsFilePath)
	if err != nil {
		return nil, err
	}

	identity, err := age.NewScryptIdentity(passphrase)
	if err != nil {
		return nil, err
	}

	reader, err := age.Decrypt(armor.NewReader(secFile), identity)
	if err != nil {
		return nil, err
	}

	msgBytes, err := io.ReadAll(reader)
	if err != nil {
		return nil, err
	}

	secFile.Close()

	var secData map[string]string
	if err := json.Unmarshal(msgBytes, &secData); err != nil {
		return nil, err
	}

	if _, ok := secData["addr_xsk"]; !ok {
		return nil, ErrSecretsFileWrongContent
	}

	if _, ok := secData["stake_vkh"]; !ok {
		return nil, ErrSecretsFileWrongContent
	}

	return secData, nil
}

func utxoToJsonEncodable(u cardano.UTxO) map[string]any {
	return map[string]any{
		"utxo":     fmt.Sprintf("%s#%d", u.TxHash.String(), u.Index),
		"address":  u.Spender.String(),
		"amount":   u.Amount,
		"tx_hash":  u.TxHash.String(),
		"tx_index": u.Index,
	}
}

func utxosToJsonEncodable(utxos []cardano.UTxO) []map[string]any {
	res := make([]map[string]any, 0, len(utxos))
	for _, u := range utxos {
		res = append(res, utxoToJsonEncodable(u))
	}
	return res
}

func (d DumpPayerData) MarshalJSON() ([]byte, error) {
	type D struct {
		Metadata2Utxo map[string][]map[string]any `json:"metadata2utxo"`
		Utxos         []map[string]any            `json:"utxos"`
		Processing    []map[string]any            `json:"processing"`
		Pending       map[string][]map[string]any `json:"pending"`
	}
	d_ := D{
		Metadata2Utxo: make(map[string][]map[string]any),
		Pending:       make(map[string][]map[string]any),
	}
	for k, v := range d.Metadata2Utxo {
		d_.Metadata2Utxo[k] = utxosToJsonEncodable(v)
	}
	for k, v := range d.Pending {
		d_.Pending[k] = utxosToJsonEncodable(v)
	}
	d_.Utxos = utxosToJsonEncodable(d.Utxos)
	d_.Processing = utxosToJsonEncodable(d.Processing)
	return json.Marshal(d_)
}
