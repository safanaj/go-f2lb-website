package api

import (
	// "encoding/hex"
	// "encoding/json"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"reflect"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/blake2b"

	// "golang.org/x/crypto/blake2b"

	// "github.com/safanaj/cardano-go"
	// "github.com/safanaj/cardano-go/crypto"
	"github.com/safanaj/cardano-go/bech32/prefixes"
	"github.com/safanaj/cardano-go/cose"

	"github.com/safanaj/cardano-go"
	"github.com/safanaj/cardano-go/crypto"

	// "github.com/safanaj/cardano-go/libsodium"
	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/libsodium"
)

type sigType string

const (
	plainSigType        sigType = ""
	minimalSigType      sigType = "minimal"
	minimalCip22SigType sigType = "minimal-cip22" // to support cncli
	cip8SigType         sigType = "cip8"
	cip22SigType        sigType = "cip22" // to support cncli
	cip30SigType        sigType = "cip30"
)

type tipPayload struct {
	Type      sigType        `json:"type"`
	Pool      string         `json:"pool"`
	Signature string         `json:"signature"`
	PublicKey string         `json:"publicKey"`
	Data      map[string]any `json:"data"`
}

func getReportTipHandler(ctrl f2lb_gsheet.Controller) func(*gin.Context) {
	return func(c *gin.Context) {
		var (
			useSodium       bool
			vKey            []byte
			tip             uint32
			blockNoAsString string
		)

		payload := tipPayload{
			Data: make(map[string]any),
		}

		// check/validate payload

		if c.BindJSON(&payload) != nil {
			c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
			return
		}
		if payload.Signature == "" {
			c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "empty signature"})
			return
		}
		if payload.PublicKey == "" {
			c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "empty publicKey"})
			return
		}
		if payload.Pool == "" {
			c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "empty pool identifier"})
			return
		}

		pool, ok := ctrl.GetPoolCache().Get(payload.Pool)
		if !ok {
			c.IndentedJSON(http.StatusNotFound, map[string]string{"error": "unknown pool"})
			return
		}

		if _, ok := payload.Data["blockNo"]; !ok {
			c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "missing blockNo"})
			return
		}

		switch payload.Type {
		case minimalSigType, minimalCip22SigType, cip30SigType:
			// this is ok
		case plainSigType, cip22SigType:
			// we need also slotNo and blockHash
			if _, ok := payload.Data["slotNo"]; !ok {
				c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "missing slotNo"})
				return
			}
			if _, ok := payload.Data["blockHash"]; !ok {
				c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "missing blockHash"})
				return
			}
		case cip8SigType:
			c.IndentedJSON(http.StatusNotImplemented, map[string]string{"sorry": fmt.Sprintf("we don't support yet %s signature", payload.Type)})
			return
		default:
			c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "unknown signature type"})
			return
		}

		sigBytes, err := hex.DecodeString(payload.Signature)
		if err != nil {
			c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "invalid signature: " + err.Error()})
			return
		}

		// compute the posted tip value
		switch v := payload.Data["blockNo"].(type) {
		case string:
			if strings.Contains(v, ".") {
				c.IndentedJSON(http.StatusBadRequest, map[string]string{
					"error": "blockNo is not a 32bit unsigned integer: cannot contains dot (.)",
				})
				return
			}
			blockNoAsString = v
		case float64:
			fs := fmt.Sprintf("%.0f", v)
			if fi, err := strconv.ParseFloat(fs, 64); err != nil || fi != v {
				errMsg := "blockNo is not a 32bit unsigned integer: "
				if err != nil {
					errMsg = errMsg + err.Error()
				} else {
					errMsg = errMsg + fmt.Sprintf("%v", v)
				}
				c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": errMsg})
				return
			}
			blockNoAsString = fs
		default:
			c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "blockNo is not a 32bit unsigned integer"})
			return
		}

		if n, err := strconv.ParseUint(blockNoAsString, 10, 32); err != nil {
			c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "blockNo is not a 32bit unsigned integer: " + err.Error()})
			return
		} else {
			tip = uint32(n)
		}

		// check for valid public key
		invalidPubKeyErr := map[string]string{"error": "invalid public key"}
		if strings.HasPrefix(payload.PublicKey, "5820") && len(payload.PublicKey) == 68 {
			// we assume that the public key is a CBORHex of 32 bytes,
			// and assume that in this case it is the VRF public key
			useSodium = true
			vrfVKeyData, err := cardano.GetBytesFromCBORHex(payload.PublicKey)
			if err != nil || len(vrfVKeyData) != 32 {
				c.IndentedJSON(http.StatusBadRequest, invalidPubKeyErr)
				return
			}
			vKey = vrfVKeyData
		} else if strings.HasPrefix(payload.PublicKey, "5840") && len(payload.PublicKey) == 132 {
			// assume this is a stake extended public key as cbor hex of 64 bytes,
			// this would contains the chain code but we are ignoring it
			data, err := cardano.GetBytesFromCBORHex(payload.PublicKey)
			if err != nil || len(data) != 64 {
				c.IndentedJSON(http.StatusBadRequest, invalidPubKeyErr)
				return
			}
			vKey = crypto.XPubKey(data).PubKey()[:]
		} else if strings.HasPrefix(payload.PublicKey, "a42006215820") &&
			strings.HasSuffix(payload.PublicKey, "01010327") &&
			payload.Type == cip30SigType {
			key, err := cose.NewCOSEKeyFromCBORHex(payload.PublicKey)
			if err != nil {
				c.IndentedJSON(http.StatusBadRequest, invalidPubKeyErr)
				return
			}
			vKey = key.Key.Bytes()
		} else if strings.HasPrefix(payload.PublicKey, prefixes.StakePublicKey) {
			// public key has stake_vk prefix
			pubKey, err := crypto.NewPubKey(payload.PublicKey)
			if err != nil {
				c.IndentedJSON(http.StatusBadRequest, invalidPubKeyErr)
				return
			}
			vKey = pubKey[:]
		} else if strings.HasPrefix(payload.PublicKey, prefixes.StakeExtendedPublicKey) {
			// public key has stake_xvk prefix
			xpubKey, err := crypto.NewXPubKey(payload.PublicKey)
			if err != nil {
				c.IndentedJSON(http.StatusBadRequest, invalidPubKeyErr)
				return
			}
			vKey = xpubKey.PubKey()[:]
		} else {
			// last attempt is that it is hex-encoded
			data, err := hex.DecodeString(payload.PublicKey)
			if err != nil {
				c.IndentedJSON(http.StatusBadRequest, invalidPubKeyErr)
				return
			}
			if len(data) == 32 {
				vKey = data
			} else if len(data) == 64 {
				vKey = crypto.XPubKey(data).PubKey()[:]
			} else {
				c.IndentedJSON(http.StatusBadRequest, invalidPubKeyErr)
				return
			}
		}

		// we have the posted tip value, the expected signed data and the public key
		// just verify the authorization and signature authenticity
		if useSodium {
			var seed string
			// verify identity authoriation
			hash := blake2b.Sum256(vKey)
			vkh := hex.EncodeToString(hash[:])
			if vkh != pool.VrfKeyHash() {
				c.IndentedJSON(http.StatusUnauthorized, map[string]string{"error": "provided public key is not matching pool VRF key hash",
					"details": fmt.Sprintf("%s != %s (pool vrf key hash from koios)", vkh, pool.VrfKeyHash())})
				return
			}

			seedData, err := json.Marshal(payload.Data)
			if err != nil {
				c.IndentedJSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
				return
			}
			seed = hex.EncodeToString([]byte(seedData))
			if payload.Type == cip22SigType {
				// cip-0022 prefixed as cncli does, always assume nonce was the empty string
				prefixHex := hex.EncodeToString([]byte("cip-0022"))
				seed = prefixHex + seed
			} else if payload.Type == minimalSigType {
				// the signed data is just the block number as string
				seed = hex.EncodeToString([]byte(blockNoAsString))
			} else if payload.Type == minimalCip22SigType {
				// the signed data is just the block number as string
				// with cip-0022 prefixed as cncli does, always assume nonce was the empty string
				prefixHex := hex.EncodeToString([]byte("cip-0022"))
				seed = prefixHex + hex.EncodeToString([]byte(blockNoAsString))
			}

			libsodium.Initialize_libsodium()
			seedData, err = hex.DecodeString(seed)
			if err != nil {
				c.IndentedJSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
				return
			}

			dataHashBytes := blake2b.Sum256(seedData)
			_, err = libsodium.CryptoVrfVerify(vKey, sigBytes, dataHashBytes[:])
			if err != nil {
				c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "invalid signture, verifiction failed: " + err.Error(),
					"details data": string(seedData)})
				return
			}
		} else {
			pubKey := crypto.PubKey(vKey)
			vkh, err := pubKey.Hash()
			if err != nil {
				c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "invalid pub key, failed to compute hash: " + err.Error()})
				return
			}
			vkhHex := hex.EncodeToString(vkh)
			// we need this to verify stake key hash
			sp := ctrl.GetStakePoolSet().Get(pool.Ticker())
			if sp.MainStakeKey() != vkhHex {
				c.IndentedJSON(http.StatusUnauthorized, map[string]string{"error": "provided public key is not matching member stake key",
					"details": fmt.Sprintf("%s != %s (stake key hash)", vkhHex, sp.MainStakeKey())})
				return
			}
			data, err := json.Marshal(payload.Data)
			if err != nil {
				c.IndentedJSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
				return
			}

			if payload.Type == minimalSigType {
				data = []byte(blockNoAsString)
			}

			if payload.Type == cip30SigType {
				msgToVerify, err := cose.NewCOSESign1MessageFromCBORHex(payload.Signature)
				if err != nil {
					c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "invalid COSE Sign1Message signature: " + err.Error()})
					return
				}

				key, err := cose.NewCOSEKeyFromBytes(vKey)
				if err != nil {
					c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "invalid pub key, failed to build COSE Key: " + err.Error()})
					return
				}

				verifier, err := cose.NewVerifierFromCOSEKey(key)
				if err != nil {
					c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "invalid pub key, failed to build Verifier from COSE Key: " + err.Error()})
					return
				}

				if string(data) != string(msgToVerify.Payload) {
					// just in this case we need to unmarshal the message payload
					// and deeply check agains the data in the posted payload
					mData := map[string]any{}
					if err := json.Unmarshal(msgToVerify.Payload, &mData); err != nil {
						c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "invalid payload in message to verify: " + err.Error()})
						return
					}
					if !reflect.DeepEqual(payload.Data, mData) {
						c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "payload in message to verify is different from the posted one: " + err.Error()})
						return
					}
				}

				if err := msgToVerify.Verify(nil, verifier); err != nil {
					c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "invalid signture, verifiction failed",
						"details data": string(data)})
					return
				}
			} else {
				if !pubKey.Verify(data, sigBytes) {
					c.IndentedJSON(http.StatusBadRequest, map[string]string{"error": "invalid signture, verifiction failed",
						"details data": string(data)})
					return
				}
			}
		}

		// here everything is verified, we trust the data so update the cache
		pool.SetBlockHeight(tip)
		c.Status(http.StatusOK)
	}
}
