package utils

import (
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
		fmt.Printf("Error: %v", e)
		panic(e)
	}
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

func StakeKeyHashToStakeAddressOrDie(val string) string {
	keyHashBytes := make([]byte, hex.DecodedLen(len(val)))
	_, err := hex.Decode(keyHashBytes, []byte(val))
	CheckErr(err)
	return address.NewRewardAddress(network.MainNet(), address.NewKeyStakeCredential(keyHashBytes)).String()
}

func StakeAddressToStakeKeyHashOrDie(val string) string {
	addr, err := address.NewAddress(val)
	CheckErr(err)
	switch a := addr.(type) {
	case *address.BaseAddress:
		return hex.EncodeToString(addr.(*address.BaseAddress).Stake.Payload)
	case *address.RewardAddress:
		return hex.EncodeToString(addr.(*address.RewardAddress).Stake.Payload)
	default:
		CheckErr(fmt.Errorf("Unsupported addess type: %T", a))
	}
	return ""
}

type Epoch uint64

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
func CurrentEpoch() Epoch { return TimeToEpoch(time.Now()) }
