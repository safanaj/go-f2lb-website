package libsodium

//go:generate go run ./build_libsodium_helper.go _c_libsodium_built

import (
	lsodium "github.com/safanaj/cardano-go/libsodium"
)

var (
	Initialize_libsodium = lsodium.Initialize_libsodium
	CryptoVrfVerify      = lsodium.CryptoVrfVerify
)
