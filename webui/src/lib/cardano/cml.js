export const getBaseAddress = async (wasm, api) => {
  return await api.getUsedAddresses().then((addresses) => {
    return wasm.BaseAddress.from_address(wasm.Address.from_hex(addresses[0], 'hex'))
  })
}
export const getAddr = (bAddr) => { return bAddr.to_address().to_bech32(); }
export const getStakeKey = (bAddr) => { return bAddr.stake().as_pub_key().to_hex() }
export const getStakeAddr = (wasm, bAddr) => {
  return wasm.RewardAddress.from_address(
    wasm.Address.from_raw_bytes(
      [0xe1, ...bAddr.stake().to_cbor_bytes().slice(4, 32)]
  )).to_address().to_bech32()
}

// delegation
const getStakeDelegationCertificate = (wasm, addr_bech32, pool_bech32) => {
  return wasm.Certificate.new_stake_delegation(
    wasm.Address.from_bech32(addr_bech32).staking_cred(),
    wasm.Ed25519KeyHash.from_bech32(pool_bech32))
}

const getTxBuilder = (wasm) => {
  // $ date ; cardano-cli query protocol-parameters --mainnet \
  //          | jq '{txFeeFixed, txFeePerByte, stakePoolDeposit, stakeAddressDeposit, maxValueSize, maxTxSize, utxoCostPerWord, utxoCostPerByte}'
  // Wed Sep 14 22:27:13 CEST 2022
  // {
  //   "txFeeFixed": 155381,
  //   "txFeePerByte": 44,
  //   "stakePoolDeposit": 500000000,
  //   "stakeAddressDeposit": 2000000,
  //   "maxValueSize": 5000,
  //   "maxTxSize": 16384,
  //   "utxoCostPerWord": 34482
  // }

  // $ date ; cardano-cli query protocol-parameters --mainnet \
  //   | jq '{txFeeFixed, txFeePerByte, stakePoolDeposit, stakeAddressDeposit, maxValueSize, maxTxSize, \
  //          utxoCostPerWord, utxoCostPerByte, executionUnitPrices, collateralPercentage}'
  // lun 24 apr 2023, 21:19:33, CEST
  // {
  //   "txFeeFixed": 155381,
  //   "txFeePerByte": 44,
  //   "stakePoolDeposit": 500000000,
  //   "stakeAddressDeposit": 2000000,
  //   "maxValueSize": 5000,
  //   "maxTxSize": 16384,
  //   "utxoCostPerWord": null,
  //   "utxoCostPerByte": 4310,
  //   "executionUnitPrices": {
  //     "priceMemory": 0.0577,
  //     "priceSteps": 7.21e-05
  //   },
  //   "collateralPercentage": 150
  //   "maxCollateralInputs": 3
  // }
  
  // date ; cardano-cli query protocol-parameters --mainnet | jq '{txFeeFixed, txFeePerByte, stakePoolDeposit, stakeAddressDeposit, maxValueSize, maxTxSize, utxoCostPerWord, utxoCostPerByte, executionUnitPrices, collateralPercentage, minFeeRefScriptCostPerByte}'
  // Thu Oct 16 08:09:28 AM CEST 2025
  //{
  //  "txFeeFixed": 155381,
  //  "txFeePerByte": 44,
  //  "stakePoolDeposit": 500000000,
  //  "stakeAddressDeposit": 2000000,
  //  "maxValueSize": 5000,
  //  "maxTxSize": 16384,
  //  "utxoCostPerByte": 4310,
  //  "executionUnitPrices": {
  //    "priceMemory": 0.0577,
  //    "priceSteps": 0.0000721
  //  },
  //  "collateralPercentage": 150,
  //  "minFeeRefScriptCostPerByte": 15
  //}
  
  const ex_unit_prices = wasm.ExUnitPrices.new(
    wasm.Rational.new(BigInt('577'), BigInt('10000')),
    wasm.Rational.new(BigInt('721'), BigInt('10000000')))
  const txBuilderCfgBuilder =
    wasm.TransactionBuilderConfigBuilder.new()
	.fee_algo(wasm.LinearFee.new(BigInt('44'), BigInt('155381'), BigInt('15')))
	.pool_deposit(BigInt('500000000'))
	.key_deposit(BigInt('2000000'))
	.max_value_size(5000)
	.max_tx_size(16384)
	.coins_per_utxo_byte(BigInt('4310'))
	.ex_unit_prices(ex_unit_prices)
	.collateral_percentage(150)
	.max_collateral_inputs(3)
	.prefer_pure_change(true);
  const txBuilderCfg = txBuilderCfgBuilder.build();
  txBuilderCfgBuilder.free()
  const txBuilder = wasm.TransactionBuilder.new(txBuilderCfg);
  txBuilderCfg.free()
  return txBuilder
}

const getCerts = (wasm, addr_bech32, pool_bech32) => {
  const cert = getStakeDelegationCertificate(wasm, addr_bech32, pool_bech32)
  const scb = wasm.SingleCertificateBuilder.new(cert)
  cert.free()
  const cbr = scb.payment_key()
  scb.free()
  return cbr
}

const getUtxos = async (api, wasm) => {
  return await api.getUtxos().then(
    _utxos => _utxos.map(wasm.TransactionUnspentOutput.from_cbor_hex)
  )
}
const _freeWasmUtxos = utxos => utxos.filter(utxo => utxo.__wbg_ptr != 0).forEach(utxo => utxo.free())

const getOneUtxo = async (api, wasm, allowMultiAsset) => {
  let found = null
  const utxos = await getUtxos(api, wasm)
  for (const utxo of utxos) {
    if (allowMultiAsset) {
      found = wasm.TransactionUnspentOutput.__wrap(utxo.__destroy_into_raw())
      break
    }
    const ov = utxo.to_js_value()
    if ((ov.amount||{}).multiasset) {
      continue
    }
    found = wasm.TransactionUnspentOutput.__wrap(utxo.__destroy_into_raw())
    break
  }
  _freeWasmUtxos(utxos)
  return found
}

  const getChangeAddr = async (api, wasm) => {
  return wasm.Address.from_hex(await api.getChangeAddress())
}

const getUtxosAndChangeAddr = async (api, wasm) => {
  return await Promise.all([
    getUtxos(api, wasm),
    getChangeAddr(api, wasm)
  ]).then(r => { return {utxos: r[0], changeAddr: r[1]}})
}

export const asHexAndFree = (obj) => {
  try {
    return obj.to_cbor_hex()
  } finally {
    obj.free()
  }
}

const getDelegationTx = async (api, wasm, addr_bech32, pool_bech32, console) => {
  const certs = getCerts(wasm, addr_bech32, pool_bech32)
  const {utxos, changeAddr} = await getUtxosAndChangeAddr(api, wasm)
  const txBuilder = getTxBuilder(wasm)
  txBuilder.add_cert(certs)
  certs.free()

  for (let i = 0; i < utxos.len(); i++) {
    const utxo = utxos.get(i)
    const sib = wasm.SingleInputBuilder.new(utxo.input(), utxo.output())
    const ibr = sib.payment_key()
    utxo.free()
    sib.free()
    txBuilder.add_utxo(ibr)
    ibr.free()
  }
  utxos.free()

  txBuilder.select_utxos(wasm.CoinSelectionStrategyCIP2.RandomImprove)
  const stb = txBuilder.build(wasm.ChangeSelectionAlgo.Default, changeAddr)
  txBuilder.free()
  changeAddr.free()
  const _tx = stb.build_unchecked()
  stb.free()
  return asHexAndFree(_tx)
}

export const getSignedTx = (wasm, tx_, witset_) => {
  // TODO: check witness set vkeys against tx body
  const tws = wasm.TransactionWitnessSet.from_cbor_hex(witset_)
  const _tx = wasm.Transaction.from_cbor_hex(tx_)
  const txBody = _tx.body()
  const auxData = _tx.auxiliary_data()
  _tx.free()
  const _signedTx = wasm.Transaction.new(txBody, tws, auxData)
  if (auxData !== undefined) {
    //auxData.free() // don't free this, it is already a nulled ptr
  }
  txBody.free()
  tws.free()
  return asHexAndFree(_signedTx)
}

export const getDelegationSignedTx = async (api, wasm, addr_bech32, pool_bech32, console) => {
  const tx_ = await getDelegationTx(api, wasm, addr_bech32, pool_bech32, console)
  const witset_ = await api.signTx(tx_)
  if (witset_ === undefined) {
    throw new Error("ooops !!! This should not happen in getDelegationSignedTx")
  }
  const tws = wasm.TransactionWitnessSet.from_cbor_hex(witset_)
  const twsb = wasm.TransactionWitnessSetBuilder.new()
  twsb.add_existing(tws)
  tws.free()
  const tx = wasm.Transaction.from_cbor_hex(tx_)
  //const stb = wasm.SignedTxBuilder.new_with_data(tx.body(), twsb, true, tx.auxiliary_data())
  console.log("in getDelegationSignedTx aux data: ", tx.auxiliary_data())
  console.log("in getDelegationSignedTx aux data ptr: ", (tx.auxiliary_data()||{}).ptr)
  let stb;
  if (tx.auxiliary_data() !== undefined && tx.auxiliary_data().ptr !== null) {
    stb = wasm.SignedTxBuilder.new_with_data(tx.body(), twsb, true, tx.auxiliary_data())
  } else {
    stb = wasm.SignedTxBuilder.new_without_data(tx.body(), twsb, true)
  }
  tx.free()
  twsb.free()
  const signedTx = stb.build_checked()
  stb.free()
  return asHexAndFree(signedTx)
}

export const assembleWitnessSet = (wasm, ...witset_vkey_hexes) => {
  const twsb = wasm.TransactionWitnessSetBuilder.new()
  for (let vkey_hex of witset_vkey_hexes) {
    const vkey = wasm.Vkeywitness.from_cbor_hex(vkey_hex)
    twsb.add_vkey(vkey)
    vkey.free()
  }
  const witset = twsb.build()
  twsb.free()
  return asHexAndFree(witset)
}

export const getUtxoHint = async (api, wasm, allowMultiAsset) => {
  const hint = await getOneUtxo(api, wasm, allowMultiAsset)
  if (hint !== null) {
    const i = hint.input()
    const o = hint.output()
    hint.free()
    const iv = i.to_js_value()
    i.free()
    const ov = o.to_js_value()
    o.free()
    return `${iv.transaction_id}#${iv.index}|${ov.address}:${ov.amount.coin}`
  }
  return ""
}
