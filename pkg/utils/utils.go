package utils

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"time"

	"gopkg.in/yaml.v3"

	"github.com/echovl/cardano-go"
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
	addr, err := cardano.NewStakeAddress(cardano.Mainnet, cardano.StakeCredential{Type: cardano.KeyCredential, KeyHash: keyHashBytes})
	if err != nil {
		return "", err
	}
	return addr.String(), nil
}
func StakeKeyHashToStakeAddressOrDie(val string) string {
	addr, err := StakeKeyHashToStakeAddress(val)
	CheckErr(err)
	return addr
}

func StakeAddressToStakeKeyHash(val string) (string, error) {
	addr, err := cardano.NewAddress(val)
	if err != nil {
		return "", nil
	}
	switch addr.Type {
	case cardano.Base, cardano.Stake:
		return hex.EncodeToString(addr.Stake.Hash()), nil
	default:
		return "", fmt.Errorf("Unsupported addess type: %v", addr.Type)
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
const (
	systemStartUnixEpoch = 1506203091

	FirstShelleySlot  = 5788800
	FirstShelleyEpoch = 211
	EpochLength       = 432000
)

func TimeToEpoch(t time.Time) Epoch {
	secondsSinceSystemStart := t.Unix() - systemStartUnixEpoch
	return Epoch(secondsSinceSystemStart / EpochLength)
}
func TimeToSlot(t time.Time) Slot {
	secondsSinceSystemStart := t.Unix() - systemStartUnixEpoch
	return Slot(secondsSinceSystemStart % EpochLength)
}
func TimeToAbsSlot(t time.Time) Slot {
	secondsSinceSystemStart := t.Unix() - systemStartUnixEpoch
	return Slot(secondsSinceSystemStart)
}

func CurrentEpoch() Epoch      { return TimeToEpoch(time.Now()) }
func CurrentSlotInEpoch() Slot { return TimeToSlot(time.Now()) }
func EpochStartTime(e Epoch) time.Time {
	return time.Unix(systemStartUnixEpoch+(int64(e)*EpochLength), 0)
}
func EpochEndTime(e Epoch) time.Time {
	return time.Unix(systemStartUnixEpoch+((int64(e)+1)*EpochLength)-1, 0)
}

func GetFirstSlotOfEpochSinceShelley(e Epoch) Slot {
	if int(e) < FirstShelleyEpoch {
		return Slot(0)
	}
	return Slot(FirstShelleySlot + ((int(e) - FirstShelleyEpoch) * EpochLength))
}
