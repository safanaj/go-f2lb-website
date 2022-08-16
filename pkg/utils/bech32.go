package utils

import (
	"encoding/hex"
	"github.com/btcsuite/btcutil/bech32"
)

func HexToBech32(hrp, hexa string) (string, error) {
	var (
		err       error
		dat, conv []byte
		encoded   string
	)

	dat, err = hex.DecodeString(hexa)
	if err != nil {
		goto reterr
	}
	conv, err = bech32.ConvertBits(dat, 8, 5, true)
	if err != nil {
		goto reterr
	}
	encoded, err = bech32.Encode(hrp, conv)
	if err != nil {
		goto reterr
	}
	return encoded, nil
reterr:
	return "", err
}

func HexToBech32OrDie(hrp, hexa string) string {
	encoded, err := HexToBech32(hrp, hexa)
	CheckErr(err)
	return encoded
}

func Bech32ToHex(be32 string) (string, error) {
	var (
		err           error
		decoded, conv []byte
	)
	_, decoded, err = bech32.Decode(be32)
	if err != nil {
		goto reterr
	}
	conv, err = bech32.ConvertBits(decoded, 5, 8, false)
	if err != nil {
		goto reterr
	}
	return hex.EncodeToString(conv), nil
reterr:
	return "", err
}

func Bech32ToHexOrDie(be32 string) string {
	hexa, err := Bech32ToHex(be32)
	CheckErr(err)
	return hexa
}
