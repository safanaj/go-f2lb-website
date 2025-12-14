package libsodium

//go:generate go run ./build_libsodium_helper.go _c_libsodium_built

/*
#cgo CFLAGS: -Wall
#cgo LDFLAGS: -l:libsodium.a
#include <sodium/core.h>
#include <sodium/crypto_vrf.h>
#include <sodium/crypto_vrf_ietfdraft03.h>
#include <sodium.h>
#include <string.h>
#include <stdio.h>
#include <stddef.h>
*/
import "C"

import (
	"fmt"
	"sync"

	_ "github.com/otiai10/copy"
)

var (
	sodium_init_rc   int
	sodium_init_once sync.Once
)

func Initialize_libsodium() int {
	sodium_init_once.Do(func() {
		sodium_init_rc = int(C.sodium_init())
	})
	return sodium_init_rc
}

func CryptoVrfProve(sk, seed []byte) ([]byte, error) {
	if len(sk) != int(C.int(C.crypto_vrf_secretkeybytes())) {
		return nil, fmt.Errorf("Invalid vrf private key")
	}
	if len(seed) != int(C.int(C.crypto_vrf_seedbytes())) {
		return nil, fmt.Errorf("Invalid data to sign/prove")
	}

	proof := make([]byte, C.int(C.crypto_vrf_ietfdraft03_proofbytes()))
	rc := C.int(C.crypto_vrf_prove((*C.uchar)(&proof[0]), (*C.uchar)(&sk[0]), (*C.uchar)(&seed[0]), C.ulonglong(len(seed))))
	if rc != 0 {
		return nil, fmt.Errorf("Failed crypto_vrf_proof_to_hash. return code: %d", rc)
	}
	return proof, nil
}

func CryptoVrfVerify(pk, proof, seed []byte) ([]byte, error) {
	if C.int(len(pk)) != C.int(C.crypto_vrf_publickeybytes()) {
		return nil, fmt.Errorf("Invalid vrf public key")
	}
	if C.int(len(seed)) != C.int(C.crypto_vrf_seedbytes()) {
		return nil, fmt.Errorf("Invalid data to sign/prove")
	}
	if C.int(len(proof)) != C.int(C.crypto_vrf_ietfdraft03_proofbytes()) {
		return nil, fmt.Errorf("Invalid proof")
	}

	out := make([]byte, C.int(C.crypto_vrf_outputbytes()))
	rc := C.int(C.crypto_vrf_verify((*C.uchar)(&out[0]), (*C.uchar)(&pk[0]), (*C.uchar)(&proof[0]), (*C.uchar)(&seed[0]), C.ulonglong(len(seed))))
	if rc != 0 {
		return nil, fmt.Errorf("Failed crypto_vrf_verify. return code: %d", rc)
	}
	return out, nil
}
