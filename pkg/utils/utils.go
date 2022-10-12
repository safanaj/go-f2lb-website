package utils

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"time"

	"gopkg.in/yaml.v3"

	"github.com/fivebinaries/go-cardano-serialization/address"
	"github.com/fivebinaries/go-cardano-serialization/network"
)

func CheckErr(e error) {
	if e != nil {
		fmt.Printf("Error: %v\n", e)
		panic(e)
	}
}

func IsContextDone(ctx context.Context) bool {
	select {
	case <-ctx.Done():
		return true
	default:
		return false
	}
}

func UniquifyStrings(a []string) (u_a []string) {
	a_m := make(map[string]any)
	for _, s := range a {
		if _, ok := a_m[s]; !ok {
			a_m[s] = struct{}{}
			u_a = append(u_a, s)
		}
	}
	return u_a
}

func ToIndentedJSONOrDie(a any) string {
	jsonDat, err := json.MarshalIndent(a, "", "  ")
	CheckErr(err)
	return string(jsonDat)
}

func ToYAMLOrDie(a any) string {
	yamlDat, err := yaml.Marshal(a)
	CheckErr(err)
	return string(yamlDat)
}

func StakeKeyHashToStakeAddress(val string) (string, error) {
	keyHashBytes := make([]byte, hex.DecodedLen(len(val)))
	if _, err := hex.Decode(keyHashBytes, []byte(val)); err != nil {
		return "", err
	}
	return address.NewRewardAddress(network.MainNet(), address.NewKeyStakeCredential(keyHashBytes)).String(), nil
}
func StakeKeyHashToStakeAddressOrDie(val string) string {
	addr, err := StakeKeyHashToStakeAddress(val)
	CheckErr(err)
	return addr
}

func StakeAddressToStakeKeyHash(val string) (string, error) {
	addr, err := address.NewAddress(val)
	if err != nil {
		return "", nil
	}
	switch a := addr.(type) {
	case *address.BaseAddress:
		return hex.EncodeToString(addr.(*address.BaseAddress).Stake.Payload), nil
	case *address.RewardAddress:
		return hex.EncodeToString(addr.(*address.RewardAddress).Stake.Payload), nil
	default:
		return "", fmt.Errorf("Unsupported addess type: %T", a)
	}
	return "", fmt.Errorf("Ops! Unsupported addess type: %T", addr)
}
func StakeAddressToStakeKeyHashOrDie(val string) string {
	kh, err := StakeAddressToStakeKeyHash(val)
	CheckErr(err)
	return kh
}

type Epoch uint64
type Slot uint64

// from shelley-genesis.json
// "epochLength": 432000, // slots per epoch, so (3600 * 24 * 5) seconds per epoch, same as 5 days per epoch
// "slotLength": 1, // one second per slot
// "systemStart": "2017-09-23T21:44:51Z", // is in time.RFC3339 format
// systemStart corresponds to the unix epoch 1506203091
const systemStartUnixEpoch = 1506203091

func TimeToEpoch(t time.Time) Epoch {
	secondsSinceSystemStart := t.Unix() - systemStartUnixEpoch
	return Epoch(secondsSinceSystemStart / 432000)
}
func TimeToSlot(t time.Time) Slot {
	secondsSinceSystemStart := t.Unix() - systemStartUnixEpoch
	return Slot(secondsSinceSystemStart % 432000)
}
func CurrentEpoch() Epoch              { return TimeToEpoch(time.Now()) }
func EpochStartTime(e Epoch) time.Time { return time.Unix(systemStartUnixEpoch+(int64(e)*432000), 0) }
func EpochEndTime(e Epoch) time.Time {
	return time.Unix(systemStartUnixEpoch+((int64(e)+1)*432000)-1, 0)
}
