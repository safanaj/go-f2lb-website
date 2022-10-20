package utils

import (
	"encoding/hex"
	"github.com/echovl/cardano-go/bech32"
)

func HexToBech32(hrp, hexa string) (string, error) {
	var (
		err error
		dat []byte
	)
	dat, err = hex.DecodeString(hexa)
	if err != nil {
		return "", err
	}
	return bech32.EncodeFromBase256(hrp, dat)
}

func HexToBech32OrDie(hrp, hexa string) string {
	encoded, err := HexToBech32(hrp, hexa)
	CheckErr(err)
	return encoded
}

func Bech32ToHex(be32 string) (string, error) {
	var (
		err     error
		decoded []byte
	)
	_, decoded, err = bech32.DecodeToBase256(be32)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(decoded), nil
}

func Bech32ToHexOrDie(be32 string) string {
	hexa, err := Bech32ToHex(be32)
	CheckErr(err)
	return hexa
}
