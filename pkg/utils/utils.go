package utils

import (
	"bytes"
	"context"
	"crypto/ed25519"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"golang.org/x/crypto/blake2b"
	"gopkg.in/yaml.v3"

	"github.com/fxamacker/cbor/v2"

	"github.com/safanaj/cardano-go"
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
}

func StakeAddressToStakeKeyHashOrDie(val string) string {
	kh, err := StakeAddressToStakeKeyHash(val)
	CheckErr(err)
	return kh
}

var (
	cborEnc, _ = cbor.CanonicalEncOptions().EncMode()
	cborDec, _ = cbor.DecOptions{MapKeyByteString: cbor.MapKeyByteStringAllowed}.DecMode()
)

func GetBytesFromCBORHex(cborHex string) ([]byte, error) {
	cborData, err := hex.DecodeString(cborHex)
	if err != nil {
		return nil, err
	}
	var data []byte
	if err := cborDec.NewDecoder(bytes.NewReader(cborData)).Decode(&data); err != nil {
		return nil, err
	}
	return data, nil
}

func GetCBORHexFromBytes(data []byte) (string, error) {
	var cborData bytes.Buffer
	if err := cborEnc.NewEncoder(&cborData).Encode(data); err != nil {
		return "", err
	}
	return hex.EncodeToString(cborData.Bytes()), nil
}

type VRFKeyFromJSON struct {
	Type       string `json:"type"`
	Descrition string `json:"description"`
	CBORHex    string `json:"cborHex"`
}

func GetVRFSigningKeyAsEdDSAPrivateKeyFromJSONFile(fn string) (ed25519.PrivateKey, error) {
	f, err := os.Open(fn)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	var vrfKey VRFKeyFromJSON
	if err := json.NewDecoder(f).Decode(&vrfKey); err != nil {
		return nil, err
	}
	kType := "VrfSigningKey_PraosVRF"
	if vrfKey.Type != kType {
		return nil, fmt.Errorf("invalid key expected type %s bytes got %s",
			kType, vrfKey.Type)
	}

	data, err := GetBytesFromCBORHex(vrfKey.CBORHex)
	if err != nil {
		return nil, err
	}
	if len(data) != ed25519.PrivateKeySize {
		return nil, fmt.Errorf("invalid key expected %d bytes got %d",
			ed25519.PrivateKeySize, len(data))
	}
	return ed25519.PrivateKey(data), nil
}

func GetVRFVerificationKeyAsEdDSAPrivateKeyFromJSONFile(fn string) (ed25519.PublicKey, error) {
	f, err := os.Open(fn)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	var vrfKey VRFKeyFromJSON
	if err := json.NewDecoder(f).Decode(&vrfKey); err != nil {
		return nil, err
	}
	kType := "VrfVerificationKey_PraosVRF"
	if vrfKey.Type != kType {
		return nil, fmt.Errorf("invalid key expected type %s bytes got %s",
			kType, vrfKey.Type)
	}
	data, err := GetBytesFromCBORHex(vrfKey.CBORHex)
	if err != nil {
		return nil, err
	}
	if len(data) != ed25519.PublicKeySize {
		return nil, fmt.Errorf("invalid key expected %d bytes got %d",
			ed25519.PublicKeySize, len(data))
	}
	return ed25519.PublicKey(data), nil
}

func GetPublicKeyHash(vkey ed25519.PublicKey) string {
	hash := blake2b.Sum256(vkey)
	return hex.EncodeToString(hash[:])
}

func GetPublicKey224Hash(vkey ed25519.PublicKey) (string, error) {
	digest, err := blake2b.New(224/8, vkey)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(digest.Sum(nil)), nil
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
