import { Buffer } from 'buffer';
import init from '@dcspark/cardano-multiplatform-lib-browser/cardano_multiplatform_lib_bg.wasm?init';

// @dcspark/cardano-multiplatform-lib-browser @ 3.1.2

export const useCardanoMultiPlatformLib = async () => {
  const wasm = await init({
    "./cardano_multiplatform_lib_bg.js": {
      // __wbindgen and __wbg function
      __wbindgen_object_drop_ref,
      __wbindgen_string_new,
      __wbindgen_string_get,
      __wbindgen_json_parse,
      __wbg_crypto_8fd02d72c4ba6c5c,
      __wbindgen_is_object,
      __wbg_process_bd02d71a65cf734c,
      __wbg_versions_1d70d407cb23129d,
      __wbg_node_0091cdf1ffa73e4d,
      __wbindgen_is_string,
      __wbg_require_b06abd91965488c8,
      __wbg_msCrypto_7e1e6014bddd75de,
      __wbg_getRandomValues_f308e7233e5601b7,
      __wbg_randomFillSync_f20541303a990429,
      __wbindgen_is_function,
      __wbg_newnoargs_971e9a5abe185139,
      __wbg_call_33d7bcddbbfa394a,
      __wbg_self_fd00a1ef86d1b2ed,
      __wbg_window_6f6e346d8bbd61d7,
      __wbg_globalThis_3348936ac49df00a,
      __wbg_global_67175caf56f55ca9,
      __wbindgen_is_undefined,
      __wbg_call_65af9f665ab6ade5,
      __wbg_buffer_34f5ec9f8a838ba0,
      __wbg_new_cda198d9dbc6d7ea,
      __wbg_set_1a930cfcda1a8067,
      __wbg_length_51f19f73d6d9eff3,
      __wbg_newwithlength_66e5530e7079ea1b,
      __wbg_subarray_270ff8dd5582c1ac,
      __wbindgen_object_clone_ref,
      __wbindgen_debug_string,
      __wbindgen_throw,
      __wbindgen_memory,

      // functions
      encode_json_str_to_plutus_datum,
      decode_plutus_datum_to_json_str,
      encode_json_str_to_native_script,
      make_daedalus_bootstrap_witness,
      make_icarus_bootstrap_witness,
      encode_arbitrary_bytes_as_metadatum,
      decode_arbitrary_bytes_from_metadatum,
      encode_json_str_to_metadatum,
      decode_metadatum_to_json_str,
      compatible_min_ada_required,
      min_ada_required,
      encrypt_with_password,
      decrypt_with_password,
      min_script_fee,
      min_no_script_fee,
      min_fee,
      hash_auxiliary_data,
      hash_transaction,
      hash_plutus_data,
      hash_script_data,
      calc_script_data_hash,
      get_implicit_input,
      get_deposit,
      make_vkey_witness,
    }
  }).then(wasmInstance => wasmInstance.exports)

  // prelude utilities
  const heap = new Array(32).fill(undefined);

  heap.push(undefined, null, true, false);

  function getObject(idx) { return heap[idx]; }

  let heap_next = heap.length;

  function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
  }

  function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
  }

  const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

  let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

  cachedTextDecoder.decode();

  let cachedUint8Memory0 = new Uint8Array();

  function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
      cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
  }

  function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
  }

  function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
  }

  let WASM_VECTOR_LEN = 0;

  const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

  let cachedTextEncoder = new lTextEncoder('utf-8');

  const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
                      ? function (arg, view) {
                        return cachedTextEncoder.encodeInto(arg, view);
                      }
                      : function (arg, view) {
                        const buf = cachedTextEncoder.encode(arg);
                        view.set(buf);
                        return {
                          read: arg.length,
                          written: buf.length
                        };
                      });

  function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
      const buf = cachedTextEncoder.encode(arg);
      const ptr = malloc(buf.length);
      getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
      WASM_VECTOR_LEN = buf.length;
      return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
      const code = arg.charCodeAt(offset);
      if (code > 0x7F) break;
      mem[ptr + offset] = code;
    }

    if (offset !== len) {
      if (offset !== 0) {
        arg = arg.slice(offset);
      }
      ptr = realloc(ptr, len, len = offset + arg.length * 3);
      const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
      const ret = encodeString(arg, view);

      offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
  }

  function isLikeNone(x) {
    return x === undefined || x === null;
  }

  let cachedInt32Memory0 = new Int32Array();

  function getInt32Memory0() {
    if (cachedInt32Memory0.byteLength === 0) {
      cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
  }

  function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
      return  `${val}`;
    }
    if (type == 'string') {
      return `"${val}"`;
    }
    if (type == 'symbol') {
      const description = val.description;
      if (description == null) {
        return 'Symbol';
      } else {
        return `Symbol(${description})`;
      }
    }
    if (type == 'function') {
      const name = val.name;
      if (typeof name == 'string' && name.length > 0) {
        return `Function(${name})`;
      } else {
        return 'Function';
      }
    }
    // objects
    if (Array.isArray(val)) {
      const length = val.length;
      let debug = '[';
      if (length > 0) {
        debug += debugString(val[0]);
      }
      for(let i = 1; i < length; i++) {
        debug += ', ' + debugString(val[i]);
      }
      debug += ']';
      return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
      className = builtInMatches[1];
    } else {
      // Failed to match the standard '[object ClassName]'
      return toString.call(val);
    }
    if (className == 'Object') {
      // we're a user defined class or Object
      // JSON.stringify avoids problems with cycles, and is generally much
      // easier than looping through ownProperties of `val`.
      try {
        return 'Object(' + JSON.stringify(val) + ')';
      } catch (_) {
        return 'Object';
      }
    }
    // errors
    if (val instanceof Error) {
      return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
  }

  function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
  }

  function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
  }

  function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
      throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
  }

  let cachedUint32Memory0 = new Uint32Array();

  function getUint32Memory0() {
    if (cachedUint32Memory0.byteLength === 0) {
      cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
  }

  function getArrayU32FromWasm0(ptr, len) {
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
  }

  function handleError(f, args) {
    try {
      return f.apply(this, args);
    } catch (e) {
      wasm.__wbindgen_exn_store(addHeapObject(e));
    }
  }

  // wbindgen functions
  function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
  };

  function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
  };

  function __wbindgen_string_get(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };

  function __wbindgen_json_parse(arg0, arg1) {
    const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  };

  function __wbg_crypto_8fd02d72c4ba6c5c(arg0) {
    const ret = getObject(arg0).crypto;
    return addHeapObject(ret);
  };

  function __wbindgen_is_object(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
  };

  function __wbg_process_bd02d71a65cf734c(arg0) {
    const ret = getObject(arg0).process;
    return addHeapObject(ret);
  };

  function __wbg_versions_1d70d407cb23129d(arg0) {
    const ret = getObject(arg0).versions;
    return addHeapObject(ret);
  };

  function __wbg_node_0091cdf1ffa73e4d(arg0) {
    const ret = getObject(arg0).node;
    return addHeapObject(ret);
  };

  function __wbindgen_is_string(arg0) {
    const ret = typeof(getObject(arg0)) === 'string';
    return ret;
  };

  function __wbg_require_b06abd91965488c8() { return handleError(function () {
    const ret = module.require;
    return addHeapObject(ret);
  }, arguments) };

  function __wbg_msCrypto_7e1e6014bddd75de(arg0) {
    const ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
  };

  function __wbg_getRandomValues_f308e7233e5601b7() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
  }, arguments) };

  function __wbg_randomFillSync_f20541303a990429() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
  }, arguments) };

  function __wbindgen_is_function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
  };

  function __wbg_newnoargs_971e9a5abe185139(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  };

  function __wbg_call_33d7bcddbbfa394a() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
  }, arguments) };

  function __wbg_self_fd00a1ef86d1b2ed() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
  }, arguments) };

  function __wbg_window_6f6e346d8bbd61d7() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
  }, arguments) };

  function __wbg_globalThis_3348936ac49df00a() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
  }, arguments) };

  function __wbg_global_67175caf56f55ca9() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
  }, arguments) };

  function __wbindgen_is_undefined(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
  };

  function __wbg_call_65af9f665ab6ade5() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
  }, arguments) };

  function __wbg_buffer_34f5ec9f8a838ba0(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
  };

  function __wbg_new_cda198d9dbc6d7ea(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
  };

  function __wbg_set_1a930cfcda1a8067(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
  };

  function __wbg_length_51f19f73d6d9eff3(arg0) {
    const ret = getObject(arg0).length;
    return ret;
  };

  function __wbg_newwithlength_66e5530e7079ea1b(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
  };

  function __wbg_subarray_270ff8dd5582c1ac(arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
  };

  function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
  };

  function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };

  function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };

  function __wbindgen_memory() {
    const ret = wasm.memory;
    return addHeapObject(ret);
  };

  // functions
  /**
   * @param {string} json
   * @param {number} schema
   * @returns {PlutusData}
   */
  function encode_json_str_to_plutus_datum(json, schema) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.encode_json_str_to_plutus_datum(retptr, ptr0, len0, schema);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PlutusData.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
   * @param {PlutusData} datum
   * @param {number} schema
   * @returns {string}
   */
  function decode_plutus_datum_to_json_str(datum, schema) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(datum, PlutusData);
      wasm.decode_plutus_datum_to_json_str(retptr, datum.ptr, schema);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0; len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }

  /**
   * Receives a script JSON string
   * and returns a NativeScript.
   * Cardano Wallet and Node styles are supported.
   *
   * * wallet: https://github.com/input-output-hk/cardano-wallet/blob/master/specifications/api/swagger.yaml
   * * node: https://github.com/input-output-hk/cardano-node/blob/master/doc/reference/simple-scripts.md
   *
   * self_xpub is expected to be a Bip32PublicKey as hex-encoded bytes
   * @param {string} json
   * @param {string} self_xpub
   * @param {number} schema
   * @returns {NativeScript}
   */
  function encode_json_str_to_native_script(json, self_xpub, schema) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(self_xpub, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      wasm.encode_json_str_to_native_script(retptr, ptr0, len0, ptr1, len1, schema);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return NativeScript.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
   * @param {TransactionHash} tx_body_hash
   * @param {ByronAddress} addr
   * @param {LegacyDaedalusPrivateKey} key
   * @returns {BootstrapWitness}
   */
  function make_daedalus_bootstrap_witness(tx_body_hash, addr, key) {
    _assertClass(tx_body_hash, TransactionHash);
    _assertClass(addr, ByronAddress);
    _assertClass(key, LegacyDaedalusPrivateKey);
    const ret = wasm.make_daedalus_bootstrap_witness(tx_body_hash.ptr, addr.ptr, key.ptr);
    return BootstrapWitness.__wrap(ret);
  }

  /**
   * @param {TransactionHash} tx_body_hash
   * @param {ByronAddress} addr
   * @param {Bip32PrivateKey} key
   * @returns {BootstrapWitness}
   */
  function make_icarus_bootstrap_witness(tx_body_hash, addr, key) {
    _assertClass(tx_body_hash, TransactionHash);
    _assertClass(addr, ByronAddress);
    _assertClass(key, Bip32PrivateKey);
    const ret = wasm.make_icarus_bootstrap_witness(tx_body_hash.ptr, addr.ptr, key.ptr);
    return BootstrapWitness.__wrap(ret);
  }

  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionMetadatum}
   */
  function encode_arbitrary_bytes_as_metadatum(bytes) {
    const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.encode_arbitrary_bytes_as_metadatum(ptr0, len0);
    return TransactionMetadatum.__wrap(ret);
  }

  /**
   * @param {TransactionMetadatum} metadata
   * @returns {Uint8Array}
   */
  function decode_arbitrary_bytes_from_metadatum(metadata) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(metadata, TransactionMetadatum);
      wasm.decode_arbitrary_bytes_from_metadatum(retptr, metadata.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      if (r3) {
        throw takeObject(r2);
      }
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
   * @param {string} json
   * @param {number} schema
   * @returns {TransactionMetadatum}
   */
  function encode_json_str_to_metadatum(json, schema) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.encode_json_str_to_metadatum(retptr, ptr0, len0, schema);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionMetadatum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
   * @param {TransactionMetadatum} metadatum
   * @param {number} schema
   * @returns {string}
   */
  function decode_metadatum_to_json_str(metadatum, schema) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(metadatum, TransactionMetadatum);
      wasm.decode_metadatum_to_json_str(retptr, metadatum.ptr, schema);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0; len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }

  /**
   * Provide backwards compatibility to Alonzo by taking the max min value of both er
   * @param {TransactionOutput} output
   * @param {BigNum} coins_per_utxo_byte
   * @param {BigNum} coins_per_utxo_word
   * @returns {BigNum}
   */
  function compatible_min_ada_required(output, coins_per_utxo_byte, coins_per_utxo_word) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(output, TransactionOutput);
      _assertClass(coins_per_utxo_byte, BigNum);
      _assertClass(coins_per_utxo_word, BigNum);
      wasm.compatible_min_ada_required(retptr, output.ptr, coins_per_utxo_byte.ptr, coins_per_utxo_word.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
   * @param {TransactionOutput} output
   * @param {BigNum} coins_per_utxo_byte
   * @returns {BigNum}
   */
  function min_ada_required(output, coins_per_utxo_byte) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(output, TransactionOutput);
      _assertClass(coins_per_utxo_byte, BigNum);
      wasm.min_ada_required(retptr, output.ptr, coins_per_utxo_byte.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
   * @param {string} password
   * @param {string} salt
   * @param {string} nonce
   * @param {string} data
   * @returns {string}
   */
  function encrypt_with_password(password, salt, nonce, data) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(salt, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      const ptr2 = passStringToWasm0(nonce, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len2 = WASM_VECTOR_LEN;
      const ptr3 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len3 = WASM_VECTOR_LEN;
      wasm.encrypt_with_password(retptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr4 = r0;
      var len4 = r1;
      if (r3) {
        ptr4 = 0; len4 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr4, len4);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr4, len4);
    }
  }

  /**
   * @param {string} password
   * @param {string} data
   * @returns {string}
   */
  function decrypt_with_password(password, data) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      wasm.decrypt_with_password(retptr, ptr0, len0, ptr1, len1);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr2 = r0;
      var len2 = r1;
      if (r3) {
        ptr2 = 0; len2 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr2, len2);
    }
  }

  /**
   * @param {Transaction} tx
   * @param {ExUnitPrices} ex_unit_prices
   * @returns {BigNum}
   */
  function min_script_fee(tx, ex_unit_prices) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(tx, Transaction);
      _assertClass(ex_unit_prices, ExUnitPrices);
      wasm.min_script_fee(retptr, tx.ptr, ex_unit_prices.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
   * @param {Transaction} tx
   * @param {LinearFee} linear_fee
   * @returns {BigNum}
   */
  function min_no_script_fee(tx, linear_fee) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(tx, Transaction);
      _assertClass(linear_fee, LinearFee);
      wasm.min_no_script_fee(retptr, tx.ptr, linear_fee.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
   * @param {Transaction} tx
   * @param {LinearFee} linear_fee
   * @param {ExUnitPrices} ex_unit_prices
   * @returns {BigNum}
   */
  function min_fee(tx, linear_fee, ex_unit_prices) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(tx, Transaction);
      _assertClass(linear_fee, LinearFee);
      _assertClass(ex_unit_prices, ExUnitPrices);
      wasm.min_fee(retptr, tx.ptr, linear_fee.ptr, ex_unit_prices.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
   * @param {AuxiliaryData} auxiliary_data
   * @returns {AuxiliaryDataHash}
   */
  function hash_auxiliary_data(auxiliary_data) {
    _assertClass(auxiliary_data, AuxiliaryData);
    const ret = wasm.hash_auxiliary_data(auxiliary_data.ptr);
    return AuxiliaryDataHash.__wrap(ret);
  }

  /**
   * @param {TransactionBody} tx_body
   * @returns {TransactionHash}
   */
  function hash_transaction(tx_body) {
    _assertClass(tx_body, TransactionBody);
    const ret = wasm.hash_transaction(tx_body.ptr);
    return TransactionHash.__wrap(ret);
  }

  /**
   * @param {PlutusData} plutus_data
   * @returns {DataHash}
   */
  function hash_plutus_data(plutus_data) {
    _assertClass(plutus_data, PlutusData);
    const ret = wasm.hash_plutus_data(plutus_data.ptr);
    return DataHash.__wrap(ret);
  }

  /**
   * @param {Redeemers} redeemers
   * @param {Costmdls} cost_models
   * @param {PlutusList | undefined} datums
   * @returns {ScriptDataHash}
   */
  function hash_script_data(redeemers, cost_models, datums) {
    _assertClass(redeemers, Redeemers);
    _assertClass(cost_models, Costmdls);
    let ptr0 = 0;
    if (!isLikeNone(datums)) {
      _assertClass(datums, PlutusList);
      ptr0 = datums.ptr;
      datums.ptr = 0;
    }
    const ret = wasm.hash_script_data(redeemers.ptr, cost_models.ptr, ptr0);
    return ScriptDataHash.__wrap(ret);
  }

  /**
   * @param {Redeemers} redeemers
   * @param {PlutusList} datums
   * @param {Costmdls} cost_models
   * @param {Languages} used_langs
   * @returns {ScriptDataHash | undefined}
   */
  function calc_script_data_hash(redeemers, datums, cost_models, used_langs) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(redeemers, Redeemers);
      _assertClass(datums, PlutusList);
      _assertClass(cost_models, Costmdls);
      _assertClass(used_langs, Languages);
      wasm.calc_script_data_hash(retptr, redeemers.ptr, datums.ptr, cost_models.ptr, used_langs.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return r0 === 0 ? undefined : ScriptDataHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
   * @param {TransactionBody} txbody
   * @param {BigNum} pool_deposit
   * @param {BigNum} key_deposit
   * @returns {Value}
   */
  function get_implicit_input(txbody, pool_deposit, key_deposit) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(txbody, TransactionBody);
      _assertClass(pool_deposit, BigNum);
      _assertClass(key_deposit, BigNum);
      wasm.get_implicit_input(retptr, txbody.ptr, pool_deposit.ptr, key_deposit.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Value.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
   * @param {TransactionBody} txbody
   * @param {BigNum} pool_deposit
   * @param {BigNum} key_deposit
   * @returns {BigNum}
   */
  function get_deposit(txbody, pool_deposit, key_deposit) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(txbody, TransactionBody);
      _assertClass(pool_deposit, BigNum);
      _assertClass(key_deposit, BigNum);
      wasm.get_deposit(retptr, txbody.ptr, pool_deposit.ptr, key_deposit.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }

  /**
   * @param {TransactionHash} tx_body_hash
   * @param {PrivateKey} sk
   * @returns {Vkeywitness}
   */
  function make_vkey_witness(tx_body_hash, sk) {
    _assertClass(tx_body_hash, TransactionHash);
    _assertClass(sk, PrivateKey);
    const ret = wasm.make_vkey_witness(tx_body_hash.ptr, sk.ptr);
    return Vkeywitness.__wrap(ret);
  }

  // constants / enums
  /**
   */
  const DatumKind = Object.freeze({ Hash:0,"0":"Hash",Inline:1,"1":"Inline", });
  /**
   */
  const CertificateKind = Object.freeze({ StakeRegistration:0,"0":"StakeRegistration",StakeDeregistration:1,"1":"StakeDeregistration",StakeDelegation:2,"2":"StakeDelegation",PoolRegistration:3,"3":"PoolRegistration",PoolRetirement:4,"4":"PoolRetirement",GenesisKeyDelegation:5,"5":"GenesisKeyDelegation",MoveInstantaneousRewardsCert:6,"6":"MoveInstantaneousRewardsCert", });
  /**
   */
  const MIRPot = Object.freeze({ Reserves:0,"0":"Reserves",Treasury:1,"1":"Treasury", });
  /**
   */
  const MIRKind = Object.freeze({ ToOtherPot:0,"0":"ToOtherPot",ToStakeCredentials:1,"1":"ToStakeCredentials", });
  /**
   */
  const RelayKind = Object.freeze({ SingleHostAddr:0,"0":"SingleHostAddr",SingleHostName:1,"1":"SingleHostName",MultiHostName:2,"2":"MultiHostName", });
  /**
   */
  const NativeScriptKind = Object.freeze({ ScriptPubkey:0,"0":"ScriptPubkey",ScriptAll:1,"1":"ScriptAll",ScriptAny:2,"2":"ScriptAny",ScriptNOfK:3,"3":"ScriptNOfK",TimelockStart:4,"4":"TimelockStart",TimelockExpiry:5,"5":"TimelockExpiry", });
  /**
   */
  const NetworkIdKind = Object.freeze({ Testnet:0,"0":"Testnet",Mainnet:1,"1":"Mainnet", });
  /**
   */
  const LanguageKind = Object.freeze({ PlutusV1:0,"0":"PlutusV1",PlutusV2:1,"1":"PlutusV2", });
  /**
   */
  const PlutusDataKind = Object.freeze({ ConstrPlutusData:0,"0":"ConstrPlutusData",Map:1,"1":"Map",List:2,"2":"List",Integer:3,"3":"Integer",Bytes:4,"4":"Bytes", });
  /**
   */
  const RedeemerTagKind = Object.freeze({ Spend:0,"0":"Spend",Mint:1,"1":"Mint",Cert:2,"2":"Cert",Reward:3,"3":"Reward", });
  /**
   */
  const ScriptKind = Object.freeze({ NativeScript:0,"0":"NativeScript",PlutusScriptV1:1,"1":"PlutusScriptV1",PlutusScriptV2:2,"2":"PlutusScriptV2", });
  /**
   * JSON <-> PlutusData conversion schemas.
   * Follows ScriptDataJsonSchema in cardano-cli defined at:
   * https://github.com/input-output-hk/cardano-node/blob/master/cardano-api/src/Cardano/Api/ScriptData.hs#L254
   *
   * All methods here have the following restrictions due to limitations on dependencies:
   * * JSON numbers above u64::MAX (positive) or below i64::MIN (negative) will throw errors
   * * Hex strings for bytes don't accept odd-length (half-byte) strings.
   *      cardano-cli seems to support these however but it seems to be different than just 0-padding
   *      on either side when tested so proceed with caution
   */
  const PlutusDatumSchema = Object.freeze({
    /**
     * ScriptDataJsonNoSchema in cardano-node.
     *
     * This is the format used by --script-data-value in cardano-cli
     * This tries to accept most JSON but does not support the full spectrum of Plutus datums.
     * From JSON:
     * * null/true/false/floats NOT supported
     * * strings starting with 0x are treated as hex bytes. All other strings are encoded as their utf8 bytes.
     * To JSON:
     * * ConstrPlutusData not supported in ANY FORM (neither keys nor values)
     * * Lists not supported in keys
     * * Maps not supported in keys
     */
    BasicConversions:0,"0":"BasicConversions",
    /**
     * ScriptDataJsonDetailedSchema in cardano-node.
     *
     * This is the format used by --script-data-file in cardano-cli
     * This covers almost all (only minor exceptions) Plutus datums, but the JSON must conform to a strict schema.
     * The schema specifies that ALL keys and ALL values must be contained in a JSON map with 2 cases:
     * 1. For ConstrPlutusData there must be two fields "constructor" contianing a number and "fields" containing its fields
     *    e.g. { "constructor": 2, "fields": [{"int": 2}, {"list": [{"bytes": "CAFEF00D"}]}]}
     * 2. For all other cases there must be only one field named "int", "bytes", "list" or "map"
     *    Integer's value is a JSON number e.g. {"int": 100}
     *    Bytes' value is a hex string representing the bytes WITHOUT any prefix e.g. {"bytes": "CAFEF00D"}
     *    Lists' value is a JSON list of its elements encoded via the same schema e.g. {"list": [{"bytes": "CAFEF00D"}]}
     *    Maps' value is a JSON list of objects, one for each key-value pair in the map, with keys "k" and "v"
     *          respectively with their values being the plutus datum encoded via this same schema
     *          e.g. {"map": [
     *              {"k": {"int": 2}, "v": {"int": 5}},
     *              {"k": {"map": [{"k": {"list": [{"int": 1}]}, "v": {"bytes": "FF03"}}]}, "v": {"list": []}}
     *          ]}
     * From JSON:
     * * null/true/false/floats NOT supported
     * * the JSON must conform to a very specific schema
     * To JSON:
     * * all Plutus datums should be fully supported outside of the integer range limitations outlined above.
     */
    DetailedSchema:1,"1":"DetailedSchema", });
  /**
   * Used to choose the schema for a script JSON string
   */
  const ScriptSchema = Object.freeze({ Wallet:0,"0":"Wallet",Node:1,"1":"Node", });
  /**
   */
  const TransactionMetadatumKind = Object.freeze({ MetadataMap:0,"0":"MetadataMap",MetadataList:1,"1":"MetadataList",Int:2,"2":"Int",Bytes:3,"3":"Bytes",Text:4,"4":"Text", });
  /**
   */
  const MetadataJsonSchema = Object.freeze({ NoConversions:0,"0":"NoConversions",BasicConversions:1,"1":"BasicConversions",DetailedSchema:2,"2":"DetailedSchema", });
  /**
   */
  const StakeDistributionKind = Object.freeze({ BootstrapEraDistr:0,"0":"BootstrapEraDistr",SingleKeyDistr:1,"1":"SingleKeyDistr", });
  /**
   */
  const AddrtypeKind = Object.freeze({ ATPubKey:0,"0":"ATPubKey",ATScript:1,"1":"ATScript",ATRedeem:2,"2":"ATRedeem", });
  /**
   */
  const SpendingDataKind = Object.freeze({ SpendingDataPubKeyASD:0,"0":"SpendingDataPubKeyASD",SpendingDataScriptASD:1,"1":"SpendingDataScriptASD",SpendingDataRedeemASD:2,"2":"SpendingDataRedeemASD", });
  /**
   */
  const StakeCredKind = Object.freeze({ Key:0,"0":"Key",Script:1,"1":"Script", });
  /**
   * Careful: this enum doesn't include the network ID part of the header
   * ex: base address isn't 0b0000_0000 but instead 0b0000
   * Use `header_matches_kind` if you don't want to implement the bitwise operators yourself
   */
  const AddressHeaderKind = Object.freeze({ BasePaymentKeyStakeKey:0,"0":"BasePaymentKeyStakeKey",BasePaymentScriptStakeKey:1,"1":"BasePaymentScriptStakeKey",BasePaymentKeyStakeScript:2,"2":"BasePaymentKeyStakeScript",BasePaymentScriptStakeScript:3,"3":"BasePaymentScriptStakeScript",PointerKey:4,"4":"PointerKey",PointerScript:5,"5":"PointerScript",EnterpriseKey:6,"6":"EnterpriseKey",EnterpriseScript:7,"7":"EnterpriseScript",Byron:8,"8":"Byron",RewardKey:14,"14":"RewardKey",RewardScript:15,"15":"RewardScript", });
  /**
   */
  const CoinSelectionStrategyCIP2 = Object.freeze({
    /**
     * Performs CIP2's Largest First ada-only selection. Will error if outputs contain non-ADA assets.
     */
    LargestFirst:0,"0":"LargestFirst",
    /**
     * Performs CIP2's Random Improve ada-only selection. Will error if outputs contain non-ADA assets.
     */
    RandomImprove:1,"1":"RandomImprove",
    /**
     * Same as LargestFirst, but before adding ADA, will insert by largest-first for each asset type.
     */
    LargestFirstMultiAsset:2,"2":"LargestFirstMultiAsset",
    /**
     * Same as RandomImprove, but before adding ADA, will insert by random-improve for each asset type.
     */
    RandomImproveMultiAsset:3,"3":"RandomImproveMultiAsset", });
  /**
   */
  const ChangeSelectionAlgo = Object.freeze({ Default:0,"0":"Default", });
  /**
   * Each new language uses a different namespace for hashing its script
   * This is because you could have a language where the same bytes have different semantics
   * So this avoids scripts in different languages mapping to the same hash
   * Note that the enum value here is different than the enum value for deciding the cost model of a script
   * https://github.com/input-output-hk/cardano-ledger/blob/9c3b4737b13b30f71529e76c5330f403165e28a6/eras/alonzo/impl/src/Cardano/Ledger/Alonzo.hs#L127
   */
  const ScriptHashNamespace = Object.freeze({ NativeScript:0,"0":"NativeScript",PlutusV1:1,"1":"PlutusV1",PlutusV2:2,"2":"PlutusV2", });

  // classes
  /**
   */
  class AddrAttributes {

    static __wrap(ptr) {
      const obj = Object.create(AddrAttributes.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_addrattributes_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.addrattributes_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {AddrAttributes}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.addrattributes_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AddrAttributes.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.addrattributes_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.addrattributes_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {AddrAttributes}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.addrattributes_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AddrAttributes.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {StakeDistribution} stake_distribution
     */
    set_stake_distribution(stake_distribution) {
      _assertClass(stake_distribution, StakeDistribution);
      wasm.addrattributes_set_stake_distribution(this.ptr, stake_distribution.ptr);
    }
    /**
     * @returns {StakeDistribution | undefined}
     */
    stake_distribution() {
      const ret = wasm.addrattributes_stake_distribution(this.ptr);
      return ret === 0 ? undefined : StakeDistribution.__wrap(ret);
    }
    /**
     * @param {HDAddressPayload} derivation_path
     */
    set_derivation_path(derivation_path) {
      _assertClass(derivation_path, HDAddressPayload);
      var ptr0 = derivation_path.ptr;
      derivation_path.ptr = 0;
      wasm.addrattributes_set_derivation_path(this.ptr, ptr0);
    }
    /**
     * @returns {HDAddressPayload | undefined}
     */
    derivation_path() {
      const ret = wasm.addrattributes_derivation_path(this.ptr);
      return ret === 0 ? undefined : HDAddressPayload.__wrap(ret);
    }
    /**
     * @param {ProtocolMagic} protocol_magic
     */
    set_protocol_magic(protocol_magic) {
      _assertClass(protocol_magic, ProtocolMagic);
      var ptr0 = protocol_magic.ptr;
      protocol_magic.ptr = 0;
      wasm.addrattributes_set_protocol_magic(this.ptr, ptr0);
    }
    /**
     * @returns {ProtocolMagic | undefined}
     */
    protocol_magic() {
      const ret = wasm.addrattributes_protocol_magic(this.ptr);
      return ret === 0 ? undefined : ProtocolMagic.__wrap(ret);
    }
    /**
     * @returns {AddrAttributes}
     */
    static new() {
      const ret = wasm.addrattributes_new();
      return AddrAttributes.__wrap(ret);
    }
    /**
     * @param {HDAddressPayload | undefined} hdap
     * @param {ProtocolMagic | undefined} protocol_magic
     * @returns {AddrAttributes}
     */
    static new_bootstrap_era(hdap, protocol_magic) {
      let ptr0 = 0;
      if (!isLikeNone(hdap)) {
        _assertClass(hdap, HDAddressPayload);
        ptr0 = hdap.ptr;
        hdap.ptr = 0;
      }
      let ptr1 = 0;
      if (!isLikeNone(protocol_magic)) {
        _assertClass(protocol_magic, ProtocolMagic);
        ptr1 = protocol_magic.ptr;
        protocol_magic.ptr = 0;
      }
      const ret = wasm.addrattributes_new_bootstrap_era(ptr0, ptr1);
      return AddrAttributes.__wrap(ret);
    }
    /**
     * @param {Bip32PublicKey} pubk
     * @param {HDAddressPayload | undefined} hdap
     * @param {ProtocolMagic} protocol_magic
     * @returns {AddrAttributes}
     */
    static new_single_key(pubk, hdap, protocol_magic) {
      _assertClass(pubk, Bip32PublicKey);
      let ptr0 = 0;
      if (!isLikeNone(hdap)) {
        _assertClass(hdap, HDAddressPayload);
        ptr0 = hdap.ptr;
        hdap.ptr = 0;
      }
      _assertClass(protocol_magic, ProtocolMagic);
      var ptr1 = protocol_magic.ptr;
      protocol_magic.ptr = 0;
      const ret = wasm.addrattributes_new_single_key(pubk.ptr, ptr0, ptr1);
      return AddrAttributes.__wrap(ret);
    }
  }
  /**
   */
  class Address {

    static __wrap(ptr) {
      const obj = Object.create(Address.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_address_free(ptr);
    }
    /**
     * @param {Uint8Array} data
     * @returns {Address}
     */
    static from_bytes(data) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.address_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Address.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.address_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.address_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Address}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.address_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Address.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * header has 4 bits addr type discrim then 4 bits network discrim.
     * Copied from shelley.cddl:
     *
     * base address
     * bits 7-6: 00
     * bit 5: stake cred is keyhash/scripthash
     * bit 4: payment cred is keyhash/scripthash
     * bits 3-0: network id
     *
     * pointer address
     * bits 7-5: 010
     * bit 4: payment cred is keyhash/scripthash
     * bits 3-0: network id
     *
     * enterprise address
     * bits 7-5: 010
     * bit 4: payment cred is keyhash/scripthash
     * bits 3-0: network id
     *
     * reward addresses:
     * bits 7-5: 111
     * bit 4: credential is keyhash/scripthash
     * bits 3-0: network id
     *
     * byron addresses:
     * bits 7-4: 1000
     * bits 3-0: unrelated data (recall: no network ID in Byron addresses)
     * @returns {number}
     */
    header() {
      const ret = wasm.address_header(this.ptr);
      return ret;
    }
    /**
     * @param {number} header
     * @param {number} kind
     * @returns {boolean}
     */
    static header_matches_kind(header, kind) {
      const ret = wasm.address_header_matches_kind(header, kind);
      return ret !== 0;
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.address_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string | undefined} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = isLikeNone(prefix) ? 0 : passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.address_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {Address}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.address_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Address.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     *
     *     * Note: bech32-encoded Byron addresses will also pass validation here
     *
     * @param {string} bech_str
     * @returns {boolean}
     */
    static is_valid_bech32(bech_str) {
      const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.address_is_valid_bech32(ptr0, len0);
      return ret !== 0;
    }
    /**
     * @param {string} base58
     * @returns {boolean}
     */
    static is_valid_byron(base58) {
      const ptr0 = passStringToWasm0(base58, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.address_is_valid_byron(ptr0, len0);
      return ret !== 0;
    }
    /**
     * @param {string} bech_str
     * @returns {boolean}
     */
    static is_valid(bech_str) {
      const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.address_is_valid(ptr0, len0);
      return ret !== 0;
    }
    /**
     * @returns {number}
     */
    network_id() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.address_network_id(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return r0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {ByronAddress | undefined}
     */
    as_byron() {
      const ret = wasm.address_as_byron(this.ptr);
      return ret === 0 ? undefined : ByronAddress.__wrap(ret);
    }
    /**
     * @returns {RewardAddress | undefined}
     */
    as_reward() {
      const ret = wasm.address_as_reward(this.ptr);
      return ret === 0 ? undefined : RewardAddress.__wrap(ret);
    }
    /**
     * @returns {PointerAddress | undefined}
     */
    as_pointer() {
      const ret = wasm.address_as_pointer(this.ptr);
      return ret === 0 ? undefined : PointerAddress.__wrap(ret);
    }
    /**
     * @returns {EnterpriseAddress | undefined}
     */
    as_enterprise() {
      const ret = wasm.address_as_enterprise(this.ptr);
      return ret === 0 ? undefined : EnterpriseAddress.__wrap(ret);
    }
    /**
     * @returns {BaseAddress | undefined}
     */
    as_base() {
      const ret = wasm.address_as_base(this.ptr);
      return ret === 0 ? undefined : BaseAddress.__wrap(ret);
    }
    /**
     * Note: by convention, the key inside reward addresses are considered payment credentials
     * @returns {StakeCredential | undefined}
     */
    payment_cred() {
      const ret = wasm.address_payment_cred(this.ptr);
      return ret === 0 ? undefined : StakeCredential.__wrap(ret);
    }
    /**
     * Note: by convention, the key inside reward addresses are NOT considered staking credentials
     * Note: None is returned pointer addresses as the chain history is required to resolve its associated cred
     * @returns {StakeCredential | undefined}
     */
    staking_cred() {
      const ret = wasm.address_staking_cred(this.ptr);
      return ret === 0 ? undefined : StakeCredential.__wrap(ret);
    }
  }
  /**
   */
  class AddressContent {

    static __wrap(ptr) {
      const obj = Object.create(AddressContent.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_addresscontent_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.addresscontent_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {AddressContent}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.addresscontent_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AddressContent.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.addresscontent_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.addresscontent_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {AddressContent}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.addresscontent_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AddressContent.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {AddressId}
     */
    address_id() {
      const ret = wasm.addresscontent_address_id(this.ptr);
      return AddressId.__wrap(ret);
    }
    /**
     * @returns {AddrAttributes}
     */
    addr_attr() {
      const ret = wasm.addresscontent_addr_attr(this.ptr);
      return AddrAttributes.__wrap(ret);
    }
    /**
     * @returns {ByronAddrType}
     */
    addr_type() {
      const ret = wasm.addresscontent_addr_type(this.ptr);
      return ByronAddrType.__wrap(ret);
    }
    /**
     * @param {AddressId} address_id
     * @param {AddrAttributes} addr_attr
     * @param {ByronAddrType} addr_type
     * @returns {AddressContent}
     */
    static new(address_id, addr_attr, addr_type) {
      _assertClass(address_id, AddressId);
      _assertClass(addr_attr, AddrAttributes);
      _assertClass(addr_type, ByronAddrType);
      const ret = wasm.addresscontent_new(address_id.ptr, addr_attr.ptr, addr_type.ptr);
      return AddressContent.__wrap(ret);
    }
    /**
     * @param {ByronAddrType} addr_type
     * @param {SpendingData} spending_data
     * @param {AddrAttributes} attributes
     * @returns {AddressContent}
     */
    static hash_and_create(addr_type, spending_data, attributes) {
      _assertClass(addr_type, ByronAddrType);
      _assertClass(spending_data, SpendingData);
      _assertClass(attributes, AddrAttributes);
      const ret = wasm.addresscontent_hash_and_create(addr_type.ptr, spending_data.ptr, attributes.ptr);
      return AddressContent.__wrap(ret);
    }
    /**
     * @param {PublicKey} pubkey
     * @param {ProtocolMagic | undefined} protocol_magic
     * @returns {AddressContent}
     */
    static new_redeem(pubkey, protocol_magic) {
      _assertClass(pubkey, PublicKey);
      let ptr0 = 0;
      if (!isLikeNone(protocol_magic)) {
        _assertClass(protocol_magic, ProtocolMagic);
        ptr0 = protocol_magic.ptr;
        protocol_magic.ptr = 0;
      }
      const ret = wasm.addresscontent_new_redeem(pubkey.ptr, ptr0);
      return AddressContent.__wrap(ret);
    }
    /**
     * @param {Bip32PublicKey} xpub
     * @param {ProtocolMagic | undefined} protocol_magic
     * @returns {AddressContent}
     */
    static new_simple(xpub, protocol_magic) {
      _assertClass(xpub, Bip32PublicKey);
      let ptr0 = 0;
      if (!isLikeNone(protocol_magic)) {
        _assertClass(protocol_magic, ProtocolMagic);
        ptr0 = protocol_magic.ptr;
        protocol_magic.ptr = 0;
      }
      const ret = wasm.addresscontent_new_simple(xpub.ptr, ptr0);
      return AddressContent.__wrap(ret);
    }
    /**
     * @returns {ByronAddress}
     */
    to_address() {
      const ret = wasm.addresscontent_to_address(this.ptr);
      return ByronAddress.__wrap(ret);
    }
    /**
     * returns the byron protocol magic embedded in the address, or mainnet id if none is present
     * note: for bech32 addresses, you need to use network_id instead
     * @returns {number}
     */
    byron_protocol_magic() {
      const ret = wasm.addresscontent_byron_protocol_magic(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    network_id() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.addresscontent_network_id(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return r0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Bip32PublicKey} key
     * @param {number} protocol_magic
     * @returns {AddressContent}
     */
    static icarus_from_key(key, protocol_magic) {
      _assertClass(key, Bip32PublicKey);
      const ret = wasm.addresscontent_icarus_from_key(key.ptr, protocol_magic);
      return AddressContent.__wrap(ret);
    }
    /**
     * Check if the Addr can be reconstructed with a specific xpub
     * @param {Bip32PublicKey} xpub
     * @returns {boolean}
     */
    identical_with_pubkey(xpub) {
      _assertClass(xpub, Bip32PublicKey);
      const ret = wasm.addresscontent_identical_with_pubkey(this.ptr, xpub.ptr);
      return ret !== 0;
    }
  }
  /**
   */
  class AddressId {

    static __wrap(ptr) {
      const obj = Object.create(AddressId.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_addressid_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {AddressId}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.addressid_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AddressId.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.addressid_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.addressid_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {AddressId}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.addressid_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AddressId.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.addressid_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {AddressId}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.addressid_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AddressId.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {ByronAddrType} addr_type
     * @param {SpendingData} spending_data
     * @param {AddrAttributes} attrs
     * @returns {AddressId}
     */
    static new(addr_type, spending_data, attrs) {
      _assertClass(addr_type, ByronAddrType);
      _assertClass(spending_data, SpendingData);
      _assertClass(attrs, AddrAttributes);
      const ret = wasm.addressid_new(addr_type.ptr, spending_data.ptr, attrs.ptr);
      return AddressId.__wrap(ret);
    }
  }
  /**
   */
  class AssetName {

    static __wrap(ptr) {
      const obj = Object.create(AssetName.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_assetname_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.assetname_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {AssetName}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.assetname_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AssetName.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.assetname_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.assetname_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {AssetName}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.assetname_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AssetName.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} name
     * @returns {AssetName}
     */
    static new(name) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(name, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.assetname_new(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AssetName.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    name() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.assetname_name(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class AssetNames {

    static __wrap(ptr) {
      const obj = Object.create(AssetNames.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_assetnames_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.assetnames_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {AssetNames}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.assetnames_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AssetNames.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.assetnames_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.assetnames_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {AssetNames}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.assetnames_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AssetNames.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {AssetNames}
     */
    static new() {
      const ret = wasm.assetnames_new();
      return AssetNames.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.assetnames_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {AssetName}
     */
    get(index) {
      const ret = wasm.assetnames_get(this.ptr, index);
      return AssetName.__wrap(ret);
    }
    /**
     * @param {AssetName} elem
     */
    add(elem) {
      _assertClass(elem, AssetName);
      wasm.assetnames_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class Assets {

    static __wrap(ptr) {
      const obj = Object.create(Assets.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_assets_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.assets_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Assets}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.assets_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Assets.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.assets_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.assets_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Assets}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.assets_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Assets.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Assets}
     */
    static new() {
      const ret = wasm.assets_new();
      return Assets.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.assets_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {AssetName} key
     * @param {BigNum} value
     * @returns {BigNum | undefined}
     */
    insert(key, value) {
      _assertClass(key, AssetName);
      _assertClass(value, BigNum);
      const ret = wasm.assets_insert(this.ptr, key.ptr, value.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @param {AssetName} key
     * @returns {BigNum | undefined}
     */
    get(key) {
      _assertClass(key, AssetName);
      const ret = wasm.assets_get(this.ptr, key.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @returns {AssetNames}
     */
    keys() {
      const ret = wasm.assets_keys(this.ptr);
      return AssetNames.__wrap(ret);
    }
  }
  /**
   */
  class AuxiliaryData {

    static __wrap(ptr) {
      const obj = Object.create(AuxiliaryData.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_auxiliarydata_free(ptr);
    }
    /**
     * Add a single metadatum using TransactionMetadatum object under `key` TranscactionMetadatumLabel
     * @param {BigNum} key
     * @param {TransactionMetadatum} value
     */
    add_metadatum(key, value) {
      _assertClass(key, BigNum);
      _assertClass(value, TransactionMetadatum);
      wasm.auxiliarydata_add_metadatum(this.ptr, key.ptr, value.ptr);
    }
    /**
     * Add a single JSON metadatum using a MetadataJsonSchema object and MetadataJsonScehma object.
     * @param {BigNum} key
     * @param {string} val
     * @param {number} schema
     */
    add_json_metadatum_with_schema(key, val, schema) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(key, BigNum);
        const ptr0 = passStringToWasm0(val, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.auxiliarydata_add_json_metadatum_with_schema(retptr, this.ptr, key.ptr, ptr0, len0, schema);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
          throw takeObject(r0);
        }
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {AuxiliaryData} other
     */
    add(other) {
      _assertClass(other, AuxiliaryData);
      wasm.auxiliarydata_add(this.ptr, other.ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.auxiliarydata_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {AuxiliaryData}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.auxiliarydata_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AuxiliaryData.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.auxiliarydata_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.auxiliarydata_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {AuxiliaryData}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.auxiliarydata_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AuxiliaryData.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {AuxiliaryData}
     */
    static new() {
      const ret = wasm.auxiliarydata_new();
      return AuxiliaryData.__wrap(ret);
    }
    /**
     * @returns {GeneralTransactionMetadata | undefined}
     */
    metadata() {
      const ret = wasm.auxiliarydata_metadata(this.ptr);
      return ret === 0 ? undefined : GeneralTransactionMetadata.__wrap(ret);
    }
    /**
     * @param {GeneralTransactionMetadata} metadata
     */
    set_metadata(metadata) {
      _assertClass(metadata, GeneralTransactionMetadata);
      wasm.auxiliarydata_set_metadata(this.ptr, metadata.ptr);
    }
    /**
     * @returns {NativeScripts | undefined}
     */
    native_scripts() {
      const ret = wasm.auxiliarydata_native_scripts(this.ptr);
      return ret === 0 ? undefined : NativeScripts.__wrap(ret);
    }
    /**
     * @param {NativeScripts} native_scripts
     */
    set_native_scripts(native_scripts) {
      _assertClass(native_scripts, NativeScripts);
      wasm.auxiliarydata_set_native_scripts(this.ptr, native_scripts.ptr);
    }
    /**
     * @returns {PlutusV1Scripts | undefined}
     */
    plutus_v1_scripts() {
      const ret = wasm.auxiliarydata_plutus_v1_scripts(this.ptr);
      return ret === 0 ? undefined : PlutusV1Scripts.__wrap(ret);
    }
    /**
     * @param {PlutusV1Scripts} plutus_v1_scripts
     */
    set_plutus_v1_scripts(plutus_v1_scripts) {
      _assertClass(plutus_v1_scripts, PlutusV1Scripts);
      wasm.auxiliarydata_set_plutus_v1_scripts(this.ptr, plutus_v1_scripts.ptr);
    }
    /**
     * @returns {PlutusV2Scripts | undefined}
     */
    plutus_v2_scripts() {
      const ret = wasm.auxiliarydata_plutus_v2_scripts(this.ptr);
      return ret === 0 ? undefined : PlutusV2Scripts.__wrap(ret);
    }
    /**
     * @param {PlutusV2Scripts} plutus_v2_scripts
     */
    set_plutus_v2_scripts(plutus_v2_scripts) {
      _assertClass(plutus_v2_scripts, PlutusV2Scripts);
      wasm.auxiliarydata_set_plutus_v2_scripts(this.ptr, plutus_v2_scripts.ptr);
    }
  }
  /**
   */
  class AuxiliaryDataHash {

    static __wrap(ptr) {
      const obj = Object.create(AuxiliaryDataHash.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_auxiliarydatahash_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {AuxiliaryDataHash}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.auxiliarydatahash_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AuxiliaryDataHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.auxiliarydatahash_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.auxiliarydatahash_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {AuxiliaryDataHash}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.auxiliarydatahash_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AuxiliaryDataHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.auxiliarydatahash_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {AuxiliaryDataHash}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.auxiliarydatahash_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AuxiliaryDataHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class AuxiliaryDataSet {

    static __wrap(ptr) {
      const obj = Object.create(AuxiliaryDataSet.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_auxiliarydataset_free(ptr);
    }
    /**
     * @returns {AuxiliaryDataSet}
     */
    static new() {
      const ret = wasm.auxiliarydataset_new();
      return AuxiliaryDataSet.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.auxiliarydataset_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {BigNum} tx_index
     * @param {AuxiliaryData} data
     * @returns {AuxiliaryData | undefined}
     */
    insert(tx_index, data) {
      _assertClass(tx_index, BigNum);
      _assertClass(data, AuxiliaryData);
      const ret = wasm.auxiliarydataset_insert(this.ptr, tx_index.ptr, data.ptr);
      return ret === 0 ? undefined : AuxiliaryData.__wrap(ret);
    }
    /**
     * @param {BigNum} tx_index
     * @returns {AuxiliaryData | undefined}
     */
    get(tx_index) {
      _assertClass(tx_index, BigNum);
      const ret = wasm.auxiliarydataset_get(this.ptr, tx_index.ptr);
      return ret === 0 ? undefined : AuxiliaryData.__wrap(ret);
    }
    /**
     * @returns {TransactionIndexes}
     */
    indices() {
      const ret = wasm.auxiliarydataset_indices(this.ptr);
      return TransactionIndexes.__wrap(ret);
    }
  }
  /**
   */
  class BaseAddress {

    static __wrap(ptr) {
      const obj = Object.create(BaseAddress.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_baseaddress_free(ptr);
    }
    /**
     * @param {number} network
     * @param {StakeCredential} payment
     * @param {StakeCredential} stake
     * @returns {BaseAddress}
     */
    static new(network, payment, stake) {
      _assertClass(payment, StakeCredential);
      _assertClass(stake, StakeCredential);
      const ret = wasm.baseaddress_new(network, payment.ptr, stake.ptr);
      return BaseAddress.__wrap(ret);
    }
    /**
     * @returns {StakeCredential}
     */
    payment_cred() {
      const ret = wasm.baseaddress_payment_cred(this.ptr);
      return StakeCredential.__wrap(ret);
    }
    /**
     * @returns {StakeCredential}
     */
    stake_cred() {
      const ret = wasm.baseaddress_stake_cred(this.ptr);
      return StakeCredential.__wrap(ret);
    }
    /**
     * @returns {Address}
     */
    to_address() {
      const ret = wasm.baseaddress_to_address(this.ptr);
      return Address.__wrap(ret);
    }
    /**
     * @param {Address} addr
     * @returns {BaseAddress | undefined}
     */
    static from_address(addr) {
      _assertClass(addr, Address);
      const ret = wasm.baseaddress_from_address(addr.ptr);
      return ret === 0 ? undefined : BaseAddress.__wrap(ret);
    }
  }
  /**
   */
  class BigInt {

    static __wrap(ptr) {
      const obj = Object.create(BigInt.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_bigint_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bigint_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {BigInt}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.bigint_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BigInt.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {BigNum | undefined}
     */
    as_u64() {
      const ret = wasm.bigint_as_u64(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @returns {Int | undefined}
     */
    as_int() {
      const ret = wasm.bigint_as_int(this.ptr);
      return ret === 0 ? undefined : Int.__wrap(ret);
    }
    /**
     * @param {string} string
     * @returns {BigInt}
     */
    static from_str(string) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.bigint_from_str(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BigInt.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_str() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bigint_to_str(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
  }
  /**
   */
  class BigNum {

    static __wrap(ptr) {
      const obj = Object.create(BigNum.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_bignum_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bignum_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {BigNum}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.bignum_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BigNum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} string
     * @returns {BigNum}
     */
    static from_str(string) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.bignum_from_str(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BigNum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_str() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bignum_to_str(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @returns {BigNum}
     */
    static zero() {
      const ret = wasm.bignum_zero();
      return BigNum.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    is_zero() {
      const ret = wasm.bignum_is_zero(this.ptr);
      return ret !== 0;
    }
    /**
     * @param {BigNum} other
     * @returns {BigNum}
     */
    checked_mul(other) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(other, BigNum);
        wasm.bignum_checked_mul(retptr, this.ptr, other.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BigNum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {BigNum} other
     * @returns {BigNum}
     */
    checked_add(other) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(other, BigNum);
        wasm.bignum_checked_add(retptr, this.ptr, other.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BigNum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {BigNum} other
     * @returns {BigNum}
     */
    checked_sub(other) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(other, BigNum);
        wasm.bignum_checked_sub(retptr, this.ptr, other.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BigNum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * returns 0 if it would otherwise underflow
     * @param {BigNum} other
     * @returns {BigNum}
     */
    clamped_sub(other) {
      _assertClass(other, BigNum);
      const ret = wasm.bignum_clamped_sub(this.ptr, other.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @param {BigNum} other
     * @returns {BigNum}
     */
    checked_div(other) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(other, BigNum);
        wasm.bignum_checked_div(retptr, this.ptr, other.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BigNum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {BigNum} other
     * @returns {BigNum}
     */
    checked_div_ceil(other) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(other, BigNum);
        wasm.bignum_checked_div_ceil(retptr, this.ptr, other.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BigNum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {BigNum} rhs_value
     * @returns {number}
     */
    compare(rhs_value) {
      _assertClass(rhs_value, BigNum);
      const ret = wasm.bignum_compare(this.ptr, rhs_value.ptr);
      return ret;
    }
  }
  /**
   */
  class Bip32PrivateKey {

    static __wrap(ptr) {
      const obj = Object.create(Bip32PrivateKey.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_bip32privatekey_free(ptr);
    }
    /**
     * derive this private key with the given index.
     *
     * # Security considerations
     *
     * * hard derivation index cannot be soft derived with the public key
     *
     * # Hard derivation vs Soft derivation
     *
     * If you pass an index below 0x80000000 then it is a soft derivation.
     * The advantage of soft derivation is that it is possible to derive the
     * public key too. I.e. derivation the private key with a soft derivation
     * index and then retrieving the associated public key is equivalent to
     * deriving the public key associated to the parent private key.
     *
     * Hard derivation index does not allow public key derivation.
     *
     * This is why deriving the private key should not fail while deriving
     * the public key may fail (if the derivation index is invalid).
     * @param {number} index
     * @returns {Bip32PrivateKey}
     */
    derive(index) {
      const ret = wasm.bip32privatekey_derive(this.ptr, index);
      return Bip32PrivateKey.__wrap(ret);
    }
    /**
     * 128-byte xprv a key format in Cardano that some software still uses or requires
     * the traditional 96-byte xprv is simply encoded as
     * prv | chaincode
     * however, because some software may not know how to compute a public key from a private key,
     * the 128-byte inlines the public key in the following format
     * prv | pub | chaincode
     * so be careful if you see the term "xprv" as it could refer to either one
     * our library does not require the pub (instead we compute the pub key when needed)
     * @param {Uint8Array} bytes
     * @returns {Bip32PrivateKey}
     */
    static from_128_xprv(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.bip32privatekey_from_128_xprv(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Bip32PrivateKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * see from_128_xprv
     * @returns {Uint8Array}
     */
    to_128_xprv() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bip32privatekey_to_128_xprv(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Bip32PrivateKey}
     */
    static generate_ed25519_bip32() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bip32privatekey_generate_ed25519_bip32(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Bip32PrivateKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {PrivateKey}
     */
    to_raw_key() {
      const ret = wasm.bip32privatekey_to_raw_key(this.ptr);
      return PrivateKey.__wrap(ret);
    }
    /**
     * @returns {Bip32PublicKey}
     */
    to_public() {
      const ret = wasm.bip32privatekey_to_public(this.ptr);
      return Bip32PublicKey.__wrap(ret);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Bip32PrivateKey}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.bip32privatekey_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Bip32PrivateKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    as_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bip32privatekey_as_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} bech32_str
     * @returns {Bip32PrivateKey}
     */
    static from_bech32(bech32_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech32_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.bip32privatekey_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Bip32PrivateKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_bech32() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bip32privatekey_to_bech32(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {Uint8Array} entropy
     * @param {Uint8Array} password
     * @returns {Bip32PrivateKey}
     */
    static from_bip39_entropy(entropy, password) {
      const ptr0 = passArray8ToWasm0(entropy, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(password, wasm.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      const ret = wasm.bip32privatekey_from_bip39_entropy(ptr0, len0, ptr1, len1);
      return Bip32PrivateKey.__wrap(ret);
    }
    /**
     * @returns {Uint8Array}
     */
    chaincode() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bip32privatekey_chaincode(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class Bip32PublicKey {

    static __wrap(ptr) {
      const obj = Object.create(Bip32PublicKey.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_bip32publickey_free(ptr);
    }
    /**
     * derive this public key with the given index.
     *
     * # Errors
     *
     * If the index is not a soft derivation index (< 0x80000000) then
     * calling this method will fail.
     *
     * # Security considerations
     *
     * * hard derivation index cannot be soft derived with the public key
     *
     * # Hard derivation vs Soft derivation
     *
     * If you pass an index below 0x80000000 then it is a soft derivation.
     * The advantage of soft derivation is that it is possible to derive the
     * public key too. I.e. derivation the private key with a soft derivation
     * index and then retrieving the associated public key is equivalent to
     * deriving the public key associated to the parent private key.
     *
     * Hard derivation index does not allow public key derivation.
     *
     * This is why deriving the private key should not fail while deriving
     * the public key may fail (if the derivation index is invalid).
     * @param {number} index
     * @returns {Bip32PublicKey}
     */
    derive(index) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bip32publickey_derive(retptr, this.ptr, index);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Bip32PublicKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {PublicKey}
     */
    to_raw_key() {
      const ret = wasm.bip32publickey_to_raw_key(this.ptr);
      return PublicKey.__wrap(ret);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Bip32PublicKey}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.bip32publickey_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Bip32PublicKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    as_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bip32publickey_as_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} bech32_str
     * @returns {Bip32PublicKey}
     */
    static from_bech32(bech32_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech32_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.bip32publickey_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Bip32PublicKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_bech32() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bip32publickey_to_bech32(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    chaincode() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bip32publickey_chaincode(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class Block {

    static __wrap(ptr) {
      const obj = Object.create(Block.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_block_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.block_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Block}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.block_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Block.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.block_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.block_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Block}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.block_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Block.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Header}
     */
    header() {
      const ret = wasm.block_header(this.ptr);
      return Header.__wrap(ret);
    }
    /**
     * @returns {TransactionBodies}
     */
    transaction_bodies() {
      const ret = wasm.block_transaction_bodies(this.ptr);
      return TransactionBodies.__wrap(ret);
    }
    /**
     * @returns {TransactionWitnessSets}
     */
    transaction_witness_sets() {
      const ret = wasm.block_transaction_witness_sets(this.ptr);
      return TransactionWitnessSets.__wrap(ret);
    }
    /**
     * @returns {AuxiliaryDataSet}
     */
    auxiliary_data_set() {
      const ret = wasm.block_auxiliary_data_set(this.ptr);
      return AuxiliaryDataSet.__wrap(ret);
    }
    /**
     * @returns {TransactionIndexes}
     */
    invalid_transactions() {
      const ret = wasm.block_invalid_transactions(this.ptr);
      return TransactionIndexes.__wrap(ret);
    }
    /**
     * @param {Header} header
     * @param {TransactionBodies} transaction_bodies
     * @param {TransactionWitnessSets} transaction_witness_sets
     * @param {AuxiliaryDataSet} auxiliary_data_set
     * @param {TransactionIndexes} invalid_transactions
     * @returns {Block}
     */
    static new(header, transaction_bodies, transaction_witness_sets, auxiliary_data_set, invalid_transactions) {
      _assertClass(header, Header);
      _assertClass(transaction_bodies, TransactionBodies);
      _assertClass(transaction_witness_sets, TransactionWitnessSets);
      _assertClass(auxiliary_data_set, AuxiliaryDataSet);
      _assertClass(invalid_transactions, TransactionIndexes);
      const ret = wasm.block_new(header.ptr, transaction_bodies.ptr, transaction_witness_sets.ptr, auxiliary_data_set.ptr, invalid_transactions.ptr);
      return Block.__wrap(ret);
    }
  }
  /**
   */
  class BlockBodyHash {

    static __wrap(ptr) {
      const obj = Object.create(BlockBodyHash.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_blockbodyhash_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {BlockBodyHash}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.blockbodyhash_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BlockBodyHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.blockbodyhash_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.blockbodyhash_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {BlockBodyHash}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.blockbodyhash_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BlockBodyHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.blockbodyhash_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {BlockBodyHash}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.blockbodyhash_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BlockBodyHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class BlockHeaderHash {

    static __wrap(ptr) {
      const obj = Object.create(BlockHeaderHash.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_blockheaderhash_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {BlockHeaderHash}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.blockheaderhash_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BlockHeaderHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.blockheaderhash_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.blockheaderhash_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {BlockHeaderHash}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.blockheaderhash_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BlockHeaderHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.blockheaderhash_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {BlockHeaderHash}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.blockheaderhash_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BlockHeaderHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class BootstrapEraDistr {

    static __wrap(ptr) {
      const obj = Object.create(BootstrapEraDistr.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_bootstraperadistr_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bootstraperadistr_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {BootstrapEraDistr}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.bootstraperadistr_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BootstrapEraDistr.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bootstraperadistr_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bootstraperadistr_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {BootstrapEraDistr}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.bootstraperadistr_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BootstrapEraDistr.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {BootstrapEraDistr}
     */
    static new() {
      const ret = wasm.bootstraperadistr_new();
      return BootstrapEraDistr.__wrap(ret);
    }
  }
  /**
   */
  class BootstrapWitness {

    static __wrap(ptr) {
      const obj = Object.create(BootstrapWitness.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_bootstrapwitness_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bootstrapwitness_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {BootstrapWitness}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.bootstrapwitness_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BootstrapWitness.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bootstrapwitness_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bootstrapwitness_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {BootstrapWitness}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.bootstrapwitness_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BootstrapWitness.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Vkey}
     */
    vkey() {
      const ret = wasm.bootstrapwitness_vkey(this.ptr);
      return Vkey.__wrap(ret);
    }
    /**
     * @returns {Ed25519Signature}
     */
    signature() {
      const ret = wasm.bootstrapwitness_signature(this.ptr);
      return Ed25519Signature.__wrap(ret);
    }
    /**
     * @returns {Uint8Array}
     */
    chain_code() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bootstrapwitness_chain_code(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {AddrAttributes}
     */
    attributes() {
      const ret = wasm.bootstrapwitness_attributes(this.ptr);
      return AddrAttributes.__wrap(ret);
    }
    /**
     * @param {Vkey} vkey
     * @param {Ed25519Signature} signature
     * @param {Uint8Array} chain_code
     * @param {AddrAttributes} attributes
     * @returns {BootstrapWitness}
     */
    static new(vkey, signature, chain_code, attributes) {
      _assertClass(vkey, Vkey);
      _assertClass(signature, Ed25519Signature);
      const ptr0 = passArray8ToWasm0(chain_code, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      _assertClass(attributes, AddrAttributes);
      const ret = wasm.bootstrapwitness_new(vkey.ptr, signature.ptr, ptr0, len0, attributes.ptr);
      return BootstrapWitness.__wrap(ret);
    }
    /**
     * @returns {Bip32PublicKey}
     */
    to_public_key() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bootstrapwitness_to_public_key(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Bip32PublicKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {AddressContent}
     */
    to_address() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bootstrapwitness_to_address(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return AddressContent.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class BootstrapWitnesses {

    static __wrap(ptr) {
      const obj = Object.create(BootstrapWitnesses.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_bootstrapwitnesses_free(ptr);
    }
    /**
     * @returns {BootstrapWitnesses}
     */
    static new() {
      const ret = wasm.bootstrapwitnesses_new();
      return BootstrapWitnesses.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.bootstrapwitnesses_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {BootstrapWitness}
     */
    get(index) {
      const ret = wasm.bootstrapwitnesses_get(this.ptr, index);
      return BootstrapWitness.__wrap(ret);
    }
    /**
     * @param {BootstrapWitness} elem
     */
    add(elem) {
      _assertClass(elem, BootstrapWitness);
      wasm.bootstrapwitnesses_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class ByronAddrType {

    static __wrap(ptr) {
      const obj = Object.create(ByronAddrType.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_byronaddrtype_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.byronaddrtype_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ByronAddrType}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.byronaddrtype_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ByronAddrType.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.byronaddrtype_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.byronaddrtype_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ByronAddrType}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.byronaddrtype_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ByronAddrType.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {ByronAddrType}
     */
    static new_ATPubKey() {
      const ret = wasm.byronaddrtype_new_ATPubKey();
      return ByronAddrType.__wrap(ret);
    }
    /**
     * @returns {ByronAddrType}
     */
    static new_ATScript() {
      const ret = wasm.byronaddrtype_new_ATScript();
      return ByronAddrType.__wrap(ret);
    }
    /**
     * @returns {ByronAddrType}
     */
    static new_ATRedeem() {
      const ret = wasm.byronaddrtype_new_ATRedeem();
      return ByronAddrType.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.byronaddrtype_kind(this.ptr);
      return ret >>> 0;
    }
  }
  /**
   */
  class ByronAddress {

    static __wrap(ptr) {
      const obj = Object.create(ByronAddress.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_byronaddress_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.byronaddress_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ByronAddress}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.byronaddress_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ByronAddress.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.byronaddress_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.byronaddress_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ByronAddress}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.byronaddress_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ByronAddress.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    addr() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.byronaddress_addr(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Crc32}
     */
    crc32() {
      const ret = wasm.byronaddress_crc32(this.ptr);
      return Crc32.__wrap(ret);
    }
    /**
     * @param {Uint8Array} addr
     * @returns {ByronAddress}
     */
    static checksum_from_bytes(addr) {
      const ptr0 = passArray8ToWasm0(addr, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.byronaddress_checksum_from_bytes(ptr0, len0);
      return ByronAddress.__wrap(ret);
    }
    /**
     * @param {Uint8Array} addr
     * @param {Crc32} crc32
     * @returns {ByronAddress}
     */
    static new(addr, crc32) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(addr, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(crc32, Crc32);
        wasm.byronaddress_new(retptr, ptr0, len0, crc32.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ByronAddress.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_base58() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.byronaddress_to_base58(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} s
     * @returns {ByronAddress}
     */
    static from_base58(s) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.byronaddress_from_base58(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ByronAddress.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {AddressContent}
     */
    address_content() {
      const ret = wasm.byronaddress_address_content(this.ptr);
      return AddressContent.__wrap(ret);
    }
    /**
     * @param {string} s
     * @returns {boolean}
     */
    static is_valid(s) {
      const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.byronaddress_is_valid(ptr0, len0);
      return ret !== 0;
    }
    /**
     * @returns {Address}
     */
    to_address() {
      const ret = wasm.byronaddress_to_address(this.ptr);
      return Address.__wrap(ret);
    }
    /**
     * @param {Address} addr
     * @returns {ByronAddress | undefined}
     */
    static from_address(addr) {
      _assertClass(addr, Address);
      const ret = wasm.byronaddress_from_address(addr.ptr);
      return ret === 0 ? undefined : ByronAddress.__wrap(ret);
    }
  }
  /**
   */
  class ByronScript {

    static __wrap(ptr) {
      const obj = Object.create(ByronScript.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_byronscript_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.byronscript_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ByronScript}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.byronscript_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ByronScript.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class ByronTxout {

    static __wrap(ptr) {
      const obj = Object.create(ByronTxout.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_byrontxout_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.byrontxout_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ByronTxout}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.byrontxout_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ByronTxout.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.byrontxout_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.byrontxout_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ByronTxout}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.byrontxout_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ByronTxout.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {ByronAddress}
     */
    address() {
      const ret = wasm.byrontxout_address(this.ptr);
      return ByronAddress.__wrap(ret);
    }
    /**
     * @returns {BigNum}
     */
    amount() {
      const ret = wasm.byrontxout_amount(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @param {ByronAddress} address
     * @param {BigNum} amount
     * @returns {ByronTxout}
     */
    static new(address, amount) {
      _assertClass(address, ByronAddress);
      _assertClass(amount, BigNum);
      const ret = wasm.byrontxout_new(address.ptr, amount.ptr);
      return ByronTxout.__wrap(ret);
    }
  }
  /**
   */
  class Certificate {

    static __wrap(ptr) {
      const obj = Object.create(Certificate.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_certificate_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.certificate_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Certificate}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.certificate_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Certificate.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.certificate_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.certificate_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Certificate}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.certificate_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Certificate.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {StakeRegistration} stake_registration
     * @returns {Certificate}
     */
    static new_stake_registration(stake_registration) {
      _assertClass(stake_registration, StakeRegistration);
      const ret = wasm.certificate_new_stake_registration(stake_registration.ptr);
      return Certificate.__wrap(ret);
    }
    /**
     * @param {StakeDeregistration} stake_deregistration
     * @returns {Certificate}
     */
    static new_stake_deregistration(stake_deregistration) {
      _assertClass(stake_deregistration, StakeDeregistration);
      const ret = wasm.certificate_new_stake_deregistration(stake_deregistration.ptr);
      return Certificate.__wrap(ret);
    }
    /**
     * @param {StakeDelegation} stake_delegation
     * @returns {Certificate}
     */
    static new_stake_delegation(stake_delegation) {
      _assertClass(stake_delegation, StakeDelegation);
      const ret = wasm.certificate_new_stake_delegation(stake_delegation.ptr);
      return Certificate.__wrap(ret);
    }
    /**
     * @param {PoolRegistration} pool_registration
     * @returns {Certificate}
     */
    static new_pool_registration(pool_registration) {
      _assertClass(pool_registration, PoolRegistration);
      const ret = wasm.certificate_new_pool_registration(pool_registration.ptr);
      return Certificate.__wrap(ret);
    }
    /**
     * @param {PoolRetirement} pool_retirement
     * @returns {Certificate}
     */
    static new_pool_retirement(pool_retirement) {
      _assertClass(pool_retirement, PoolRetirement);
      const ret = wasm.certificate_new_pool_retirement(pool_retirement.ptr);
      return Certificate.__wrap(ret);
    }
    /**
     * @param {GenesisKeyDelegation} genesis_key_delegation
     * @returns {Certificate}
     */
    static new_genesis_key_delegation(genesis_key_delegation) {
      _assertClass(genesis_key_delegation, GenesisKeyDelegation);
      const ret = wasm.certificate_new_genesis_key_delegation(genesis_key_delegation.ptr);
      return Certificate.__wrap(ret);
    }
    /**
     * @param {MoveInstantaneousRewardsCert} move_instantaneous_rewards_cert
     * @returns {Certificate}
     */
    static new_move_instantaneous_rewards_cert(move_instantaneous_rewards_cert) {
      _assertClass(move_instantaneous_rewards_cert, MoveInstantaneousRewardsCert);
      const ret = wasm.certificate_new_move_instantaneous_rewards_cert(move_instantaneous_rewards_cert.ptr);
      return Certificate.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.certificate_kind(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {StakeRegistration | undefined}
     */
    as_stake_registration() {
      const ret = wasm.certificate_as_stake_registration(this.ptr);
      return ret === 0 ? undefined : StakeRegistration.__wrap(ret);
    }
    /**
     * @returns {StakeDeregistration | undefined}
     */
    as_stake_deregistration() {
      const ret = wasm.certificate_as_stake_deregistration(this.ptr);
      return ret === 0 ? undefined : StakeDeregistration.__wrap(ret);
    }
    /**
     * @returns {StakeDelegation | undefined}
     */
    as_stake_delegation() {
      const ret = wasm.certificate_as_stake_delegation(this.ptr);
      return ret === 0 ? undefined : StakeDelegation.__wrap(ret);
    }
    /**
     * @returns {PoolRegistration | undefined}
     */
    as_pool_registration() {
      const ret = wasm.certificate_as_pool_registration(this.ptr);
      return ret === 0 ? undefined : PoolRegistration.__wrap(ret);
    }
    /**
     * @returns {PoolRetirement | undefined}
     */
    as_pool_retirement() {
      const ret = wasm.certificate_as_pool_retirement(this.ptr);
      return ret === 0 ? undefined : PoolRetirement.__wrap(ret);
    }
    /**
     * @returns {GenesisKeyDelegation | undefined}
     */
    as_genesis_key_delegation() {
      const ret = wasm.certificate_as_genesis_key_delegation(this.ptr);
      return ret === 0 ? undefined : GenesisKeyDelegation.__wrap(ret);
    }
    /**
     * @returns {MoveInstantaneousRewardsCert | undefined}
     */
    as_move_instantaneous_rewards_cert() {
      const ret = wasm.certificate_as_move_instantaneous_rewards_cert(this.ptr);
      return ret === 0 ? undefined : MoveInstantaneousRewardsCert.__wrap(ret);
    }
  }
  /**
   */
  class CertificateBuilderResult {

    static __wrap(ptr) {
      const obj = Object.create(CertificateBuilderResult.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_certificatebuilderresult_free(ptr);
    }
  }
  /**
   */
  class Certificates {

    static __wrap(ptr) {
      const obj = Object.create(Certificates.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_certificates_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.certificates_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Certificates}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.certificates_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Certificates.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.certificates_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.certificates_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Certificates}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.certificates_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Certificates.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Certificates}
     */
    static new() {
      const ret = wasm.certificates_new();
      return Certificates.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.certificates_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {Certificate}
     */
    get(index) {
      const ret = wasm.certificates_get(this.ptr, index);
      return Certificate.__wrap(ret);
    }
    /**
     * @param {Certificate} elem
     */
    add(elem) {
      _assertClass(elem, Certificate);
      wasm.certificates_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class ConstrPlutusData {

    static __wrap(ptr) {
      const obj = Object.create(ConstrPlutusData.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_constrplutusdata_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.constrplutusdata_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ConstrPlutusData}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.constrplutusdata_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ConstrPlutusData.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {BigNum}
     */
    alternative() {
      const ret = wasm.constrplutusdata_alternative(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @returns {PlutusList}
     */
    data() {
      const ret = wasm.constrplutusdata_data(this.ptr);
      return PlutusList.__wrap(ret);
    }
    /**
     * @param {BigNum} alternative
     * @param {PlutusList} data
     * @returns {ConstrPlutusData}
     */
    static new(alternative, data) {
      _assertClass(alternative, BigNum);
      _assertClass(data, PlutusList);
      const ret = wasm.constrplutusdata_new(alternative.ptr, data.ptr);
      return ConstrPlutusData.__wrap(ret);
    }
  }
  /**
   */
  class CostModel {

    static __wrap(ptr) {
      const obj = Object.create(CostModel.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_costmodel_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.costmodel_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {CostModel}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.costmodel_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return CostModel.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.costmodel_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.costmodel_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {CostModel}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.costmodel_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return CostModel.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Language} language
     * @returns {CostModel}
     */
    static empty_model(language) {
      _assertClass(language, Language);
      const ret = wasm.costmodel_empty_model(language.ptr);
      return CostModel.__wrap(ret);
    }
    /**
     * @param {number} operation
     * @param {Int} cost
     * @returns {Int}
     */
    set(operation, cost) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(cost, Int);
        wasm.costmodel_set(retptr, this.ptr, operation, cost.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Int.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {number} operation
     * @returns {Int}
     */
    get(operation) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.costmodel_get(retptr, this.ptr, operation);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Int.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Language}
     */
    language() {
      const ret = wasm.costmodel_language(this.ptr);
      return Language.__wrap(ret);
    }
  }
  /**
   */
  class Costmdls {

    static __wrap(ptr) {
      const obj = Object.create(Costmdls.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_costmdls_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.costmdls_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Costmdls}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.costmdls_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Costmdls.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.costmdls_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.costmdls_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Costmdls}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.costmdls_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Costmdls.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Costmdls}
     */
    static new() {
      const ret = wasm.costmdls_new();
      return Costmdls.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.costmdls_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {CostModel} value
     * @returns {CostModel | undefined}
     */
    insert(value) {
      _assertClass(value, CostModel);
      const ret = wasm.costmdls_insert(this.ptr, value.ptr);
      return ret === 0 ? undefined : CostModel.__wrap(ret);
    }
    /**
     * @param {Language} key
     * @returns {CostModel | undefined}
     */
    get(key) {
      _assertClass(key, Language);
      const ret = wasm.costmdls_get(this.ptr, key.ptr);
      return ret === 0 ? undefined : CostModel.__wrap(ret);
    }
    /**
     * @returns {Languages}
     */
    keys() {
      const ret = wasm.costmdls_keys(this.ptr);
      return Languages.__wrap(ret);
    }
  }
  /**
   * structure to compute the CRC32 of chunks of bytes.
   *
   * This structure allows implements the `Write` trait making it easier
   * to compute the crc32 of a stream.
   */
  class Crc32 {

    static __wrap(ptr) {
      const obj = Object.create(Crc32.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_crc32_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.crc32_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Crc32}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.crc32_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Crc32.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.crc32_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.crc32_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Crc32}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.crc32_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Crc32.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {number} val
     * @returns {Crc32}
     */
    static from_val(val) {
      const ret = wasm.crc32_from_val(val);
      return Crc32.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    val() {
      const ret = wasm.crc32_val(this.ptr);
      return ret >>> 0;
    }
  }
  /**
   */
  class DNSRecordAorAAAA {

    static __wrap(ptr) {
      const obj = Object.create(DNSRecordAorAAAA.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_dnsrecordaoraaaa_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.dnsrecordaoraaaa_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {DNSRecordAorAAAA}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.dnsrecordaoraaaa_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return DNSRecordAorAAAA.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} dns_name
     * @returns {DNSRecordAorAAAA}
     */
    static new(dns_name) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(dns_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.dnsrecordaoraaaa_new(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return DNSRecordAorAAAA.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    record() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.dnsrecordaoraaaa_record(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
  }
  /**
   */
  class DNSRecordSRV {

    static __wrap(ptr) {
      const obj = Object.create(DNSRecordSRV.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_dnsrecordsrv_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.dnsrecordsrv_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {DNSRecordSRV}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.dnsrecordsrv_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return DNSRecordSRV.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} dns_name
     * @returns {DNSRecordSRV}
     */
    static new(dns_name) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(dns_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.dnsrecordsrv_new(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return DNSRecordSRV.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    record() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.dnsrecordsrv_record(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
  }
  /**
   */
  class DataHash {

    static __wrap(ptr) {
      const obj = Object.create(DataHash.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_datahash_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {DataHash}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.datahash_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return DataHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.datahash_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.datahash_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {DataHash}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.datahash_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return DataHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.datahash_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {DataHash}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.datahash_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return DataHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class Datum {

    static __wrap(ptr) {
      const obj = Object.create(Datum.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_datum_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.datum_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Datum}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.datum_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Datum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.datum_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.datum_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Datum}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.datum_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Datum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {DataHash} data_hash
     * @returns {Datum}
     */
    static new_data_hash(data_hash) {
      _assertClass(data_hash, DataHash);
      const ret = wasm.datum_new_data_hash(data_hash.ptr);
      return Datum.__wrap(ret);
    }
    /**
     * @param {PlutusData} data
     * @returns {Datum}
     */
    static new_data(data) {
      _assertClass(data, PlutusData);
      const ret = wasm.datum_new_data(data.ptr);
      return Datum.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.datum_kind(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {DataHash | undefined}
     */
    as_data_hash() {
      const ret = wasm.datum_as_data_hash(this.ptr);
      return ret === 0 ? undefined : DataHash.__wrap(ret);
    }
    /**
     * @returns {PlutusData | undefined}
     */
    as_inline_data() {
      const ret = wasm.datum_as_inline_data(this.ptr);
      return ret === 0 ? undefined : PlutusData.__wrap(ret);
    }
  }
  /**
   */
  class Ed25519KeyHash {

    static __wrap(ptr) {
      const obj = Object.create(Ed25519KeyHash.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_ed25519keyhash_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Ed25519KeyHash}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ed25519keyhash_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ed25519KeyHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ed25519keyhash_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ed25519keyhash_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {Ed25519KeyHash}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ed25519keyhash_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ed25519KeyHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ed25519keyhash_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {Ed25519KeyHash}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ed25519keyhash_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ed25519KeyHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class Ed25519KeyHashes {

    static __wrap(ptr) {
      const obj = Object.create(Ed25519KeyHashes.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_ed25519keyhashes_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ed25519keyhashes_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Ed25519KeyHashes}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ed25519keyhashes_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ed25519KeyHashes.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ed25519keyhashes_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ed25519keyhashes_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Ed25519KeyHashes}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ed25519keyhashes_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ed25519KeyHashes.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Ed25519KeyHashes}
     */
    static new() {
      const ret = wasm.ed25519keyhashes_new();
      return Ed25519KeyHashes.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.ed25519keyhashes_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {Ed25519KeyHash}
     */
    get(index) {
      const ret = wasm.ed25519keyhashes_get(this.ptr, index);
      return Ed25519KeyHash.__wrap(ret);
    }
    /**
     * @param {Ed25519KeyHash} elem
     */
    add(elem) {
      _assertClass(elem, Ed25519KeyHash);
      wasm.ed25519keyhashes_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class Ed25519Signature {

    static __wrap(ptr) {
      const obj = Object.create(Ed25519Signature.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_ed25519signature_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ed25519signature_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_bech32() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ed25519signature_to_bech32(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ed25519signature_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} bech32_str
     * @returns {Ed25519Signature}
     */
    static from_bech32(bech32_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech32_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ed25519signature_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ed25519Signature.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} input
     * @returns {Ed25519Signature}
     */
    static from_hex(input) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ed25519signature_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ed25519Signature.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Ed25519Signature}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ed25519signature_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ed25519Signature.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class EnterpriseAddress {

    static __wrap(ptr) {
      const obj = Object.create(EnterpriseAddress.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_enterpriseaddress_free(ptr);
    }
    /**
     * @param {number} network
     * @param {StakeCredential} payment
     * @returns {EnterpriseAddress}
     */
    static new(network, payment) {
      _assertClass(payment, StakeCredential);
      const ret = wasm.enterpriseaddress_new(network, payment.ptr);
      return EnterpriseAddress.__wrap(ret);
    }
    /**
     * @returns {StakeCredential}
     */
    payment_cred() {
      const ret = wasm.enterpriseaddress_payment_cred(this.ptr);
      return StakeCredential.__wrap(ret);
    }
    /**
     * @returns {Address}
     */
    to_address() {
      const ret = wasm.enterpriseaddress_to_address(this.ptr);
      return Address.__wrap(ret);
    }
    /**
     * @param {Address} addr
     * @returns {EnterpriseAddress | undefined}
     */
    static from_address(addr) {
      _assertClass(addr, Address);
      const ret = wasm.enterpriseaddress_from_address(addr.ptr);
      return ret === 0 ? undefined : EnterpriseAddress.__wrap(ret);
    }
  }
  /**
   */
  class ExUnitPrices {

    static __wrap(ptr) {
      const obj = Object.create(ExUnitPrices.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_exunitprices_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.exunitprices_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ExUnitPrices}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.exunitprices_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ExUnitPrices.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.exunitprices_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.exunitprices_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ExUnitPrices}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.exunitprices_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ExUnitPrices.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {UnitInterval}
     */
    mem_price() {
      const ret = wasm.exunitprices_mem_price(this.ptr);
      return UnitInterval.__wrap(ret);
    }
    /**
     * @returns {UnitInterval}
     */
    step_price() {
      const ret = wasm.exunitprices_step_price(this.ptr);
      return UnitInterval.__wrap(ret);
    }
    /**
     * @param {UnitInterval} mem_price
     * @param {UnitInterval} step_price
     * @returns {ExUnitPrices}
     */
    static new(mem_price, step_price) {
      _assertClass(mem_price, UnitInterval);
      _assertClass(step_price, UnitInterval);
      const ret = wasm.exunitprices_new(mem_price.ptr, step_price.ptr);
      return ExUnitPrices.__wrap(ret);
    }
  }
  /**
   */
  class ExUnits {

    static __wrap(ptr) {
      const obj = Object.create(ExUnits.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_exunits_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.exunits_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ExUnits}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.exunits_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ExUnits.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.exunits_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.exunits_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ExUnits}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.exunits_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ExUnits.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {BigNum}
     */
    mem() {
      const ret = wasm.exunits_mem(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @returns {BigNum}
     */
    steps() {
      const ret = wasm.exunits_steps(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @param {BigNum} mem
     * @param {BigNum} steps
     * @returns {ExUnits}
     */
    static new(mem, steps) {
      _assertClass(mem, BigNum);
      _assertClass(steps, BigNum);
      const ret = wasm.exunits_new(mem.ptr, steps.ptr);
      return ExUnits.__wrap(ret);
    }
    /**
     * @param {ExUnits} other
     * @returns {ExUnits}
     */
    checked_add(other) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(other, ExUnits);
        wasm.exunits_checked_add(retptr, this.ptr, other.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ExUnits.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * used to create a dummy ExUnits that takes up the maximum size possible in cbor to provide an upper bound on tx size
     * @returns {ExUnits}
     */
    static dummy() {
      const ret = wasm.exunits_dummy();
      return ExUnits.__wrap(ret);
    }
  }
  /**
   */
  class GeneralTransactionMetadata {

    static __wrap(ptr) {
      const obj = Object.create(GeneralTransactionMetadata.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_generaltransactionmetadata_free(ptr);
    }
    /**
     * @param {GeneralTransactionMetadata} other
     */
    add(other) {
      _assertClass(other, GeneralTransactionMetadata);
      wasm.generaltransactionmetadata_add(this.ptr, other.ptr);
    }
    /**
     * Add a single JSON metadatum using a MetadataJsonSchema object and MetadataJsonScehma object.
     * @param {BigNum} key
     * @param {string} val
     * @param {number} schema
     */
    add_json_metadatum_with_schema(key, val, schema) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(key, BigNum);
        const ptr0 = passStringToWasm0(val, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.generaltransactionmetadata_add_json_metadatum_with_schema(retptr, this.ptr, key.ptr, ptr0, len0, schema);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
          throw takeObject(r0);
        }
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generaltransactionmetadata_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {GeneralTransactionMetadata}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.generaltransactionmetadata_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return GeneralTransactionMetadata.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generaltransactionmetadata_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generaltransactionmetadata_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {GeneralTransactionMetadata}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.generaltransactionmetadata_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return GeneralTransactionMetadata.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {GeneralTransactionMetadata}
     */
    static new() {
      const ret = wasm.generaltransactionmetadata_new();
      return GeneralTransactionMetadata.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.generaltransactionmetadata_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {BigNum} key
     * @param {TransactionMetadatum} value
     * @returns {TransactionMetadatum | undefined}
     */
    insert(key, value) {
      _assertClass(key, BigNum);
      _assertClass(value, TransactionMetadatum);
      const ret = wasm.generaltransactionmetadata_insert(this.ptr, key.ptr, value.ptr);
      return ret === 0 ? undefined : TransactionMetadatum.__wrap(ret);
    }
    /**
     * @param {BigNum} key
     * @returns {TransactionMetadatum | undefined}
     */
    get(key) {
      _assertClass(key, BigNum);
      const ret = wasm.generaltransactionmetadata_get(this.ptr, key.ptr);
      return ret === 0 ? undefined : TransactionMetadatum.__wrap(ret);
    }
    /**
     * @returns {TransactionMetadatumLabels}
     */
    keys() {
      const ret = wasm.generaltransactionmetadata_keys(this.ptr);
      return TransactionMetadatumLabels.__wrap(ret);
    }
  }
  /**
   */
  class GenesisDelegateHash {

    static __wrap(ptr) {
      const obj = Object.create(GenesisDelegateHash.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_genesisdelegatehash_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {GenesisDelegateHash}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.genesisdelegatehash_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return GenesisDelegateHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.genesisdelegatehash_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.genesisdelegatehash_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {GenesisDelegateHash}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.genesisdelegatehash_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return GenesisDelegateHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.genesisdelegatehash_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {GenesisDelegateHash}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.genesisdelegatehash_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return GenesisDelegateHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class GenesisHash {

    static __wrap(ptr) {
      const obj = Object.create(GenesisHash.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_genesishash_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {GenesisHash}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.genesishash_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return GenesisHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.genesishash_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.genesishash_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {GenesisHash}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.genesishash_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return GenesisHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.genesishash_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {GenesisHash}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.genesishash_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return GenesisHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class GenesisHashes {

    static __wrap(ptr) {
      const obj = Object.create(GenesisHashes.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_genesishashes_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.genesishashes_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {GenesisHashes}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.genesishashes_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return GenesisHashes.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.genesishashes_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.genesishashes_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {GenesisHashes}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.genesishashes_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return GenesisHashes.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {GenesisHashes}
     */
    static new() {
      const ret = wasm.genesishashes_new();
      return GenesisHashes.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.genesishashes_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {GenesisHash}
     */
    get(index) {
      const ret = wasm.genesishashes_get(this.ptr, index);
      return GenesisHash.__wrap(ret);
    }
    /**
     * @param {GenesisHash} elem
     */
    add(elem) {
      _assertClass(elem, GenesisHash);
      wasm.genesishashes_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class GenesisKeyDelegation {

    static __wrap(ptr) {
      const obj = Object.create(GenesisKeyDelegation.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_genesiskeydelegation_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.genesiskeydelegation_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {GenesisKeyDelegation}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.genesiskeydelegation_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return GenesisKeyDelegation.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.genesiskeydelegation_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.genesiskeydelegation_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {GenesisKeyDelegation}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.genesiskeydelegation_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return GenesisKeyDelegation.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {GenesisHash}
     */
    genesishash() {
      const ret = wasm.genesiskeydelegation_genesishash(this.ptr);
      return GenesisHash.__wrap(ret);
    }
    /**
     * @returns {GenesisDelegateHash}
     */
    genesis_delegate_hash() {
      const ret = wasm.genesiskeydelegation_genesis_delegate_hash(this.ptr);
      return GenesisDelegateHash.__wrap(ret);
    }
    /**
     * @returns {VRFKeyHash}
     */
    vrf_keyhash() {
      const ret = wasm.genesiskeydelegation_vrf_keyhash(this.ptr);
      return VRFKeyHash.__wrap(ret);
    }
    /**
     * @param {GenesisHash} genesishash
     * @param {GenesisDelegateHash} genesis_delegate_hash
     * @param {VRFKeyHash} vrf_keyhash
     * @returns {GenesisKeyDelegation}
     */
    static new(genesishash, genesis_delegate_hash, vrf_keyhash) {
      _assertClass(genesishash, GenesisHash);
      _assertClass(genesis_delegate_hash, GenesisDelegateHash);
      _assertClass(vrf_keyhash, VRFKeyHash);
      const ret = wasm.genesiskeydelegation_new(genesishash.ptr, genesis_delegate_hash.ptr, vrf_keyhash.ptr);
      return GenesisKeyDelegation.__wrap(ret);
    }
  }
  /**
   */
  class HDAddressPayload {

    static __wrap(ptr) {
      const obj = Object.create(HDAddressPayload.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_hdaddresspayload_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.hdaddresspayload_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {HDAddressPayload}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.hdaddresspayload_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return HDAddressPayload.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class Header {

    static __wrap(ptr) {
      const obj = Object.create(Header.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_header_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.header_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Header}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.header_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Header.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.header_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.header_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Header}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.header_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Header.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {HeaderBody}
     */
    header_body() {
      const ret = wasm.header_header_body(this.ptr);
      return HeaderBody.__wrap(ret);
    }
    /**
     * @returns {KESSignature}
     */
    body_signature() {
      const ret = wasm.header_body_signature(this.ptr);
      return KESSignature.__wrap(ret);
    }
    /**
     * @param {HeaderBody} header_body
     * @param {KESSignature} body_signature
     * @returns {Header}
     */
    static new(header_body, body_signature) {
      _assertClass(header_body, HeaderBody);
      _assertClass(body_signature, KESSignature);
      const ret = wasm.header_new(header_body.ptr, body_signature.ptr);
      return Header.__wrap(ret);
    }
  }
  /**
   */
  class HeaderBody {

    static __wrap(ptr) {
      const obj = Object.create(HeaderBody.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_headerbody_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.headerbody_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {HeaderBody}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.headerbody_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return HeaderBody.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.headerbody_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.headerbody_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {HeaderBody}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.headerbody_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return HeaderBody.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {number}
     */
    block_number() {
      const ret = wasm.headerbody_block_number(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {BigNum}
     */
    slot() {
      const ret = wasm.headerbody_slot(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @returns {BlockHeaderHash | undefined}
     */
    prev_hash() {
      const ret = wasm.headerbody_prev_hash(this.ptr);
      return ret === 0 ? undefined : BlockHeaderHash.__wrap(ret);
    }
    /**
     * @returns {Vkey}
     */
    issuer_vkey() {
      const ret = wasm.headerbody_issuer_vkey(this.ptr);
      return Vkey.__wrap(ret);
    }
    /**
     * @returns {VRFVKey}
     */
    vrf_vkey() {
      const ret = wasm.headerbody_vrf_vkey(this.ptr);
      return VRFVKey.__wrap(ret);
    }
    /**
     *
     *     * Present in all Vasil blocks, but not prior ones
     *
     * @returns {VRFCert | undefined}
     */
    vrf_result() {
      const ret = wasm.headerbody_vrf_result(this.ptr);
      return ret === 0 ? undefined : VRFCert.__wrap(ret);
    }
    /**
     *
     *     * Present in all pre-Vasil blocks, but not later ones
     *
     * @returns {VRFCert | undefined}
     */
    leader_vrf() {
      const ret = wasm.headerbody_leader_vrf(this.ptr);
      return ret === 0 ? undefined : VRFCert.__wrap(ret);
    }
    /**
     *
     *     * Present in all pre-Vasil blocks, but not later ones
     *
     * @returns {VRFCert | undefined}
     */
    nonce_vrf() {
      const ret = wasm.headerbody_nonce_vrf(this.ptr);
      return ret === 0 ? undefined : VRFCert.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    block_body_size() {
      const ret = wasm.headerbody_block_body_size(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {BlockBodyHash}
     */
    block_body_hash() {
      const ret = wasm.headerbody_block_body_hash(this.ptr);
      return BlockBodyHash.__wrap(ret);
    }
    /**
     * @returns {OperationalCert}
     */
    operational_cert() {
      const ret = wasm.headerbody_operational_cert(this.ptr);
      return OperationalCert.__wrap(ret);
    }
    /**
     * @returns {ProtocolVersion}
     */
    protocol_version() {
      const ret = wasm.headerbody_protocol_version(this.ptr);
      return ProtocolVersion.__wrap(ret);
    }
    /**
     * Creates a new Vasil-era HeaderBody
     * @param {number} block_number
     * @param {BigNum} slot
     * @param {BlockHeaderHash | undefined} prev_hash
     * @param {Vkey} issuer_vkey
     * @param {VRFVKey} vrf_vkey
     * @param {VRFCert} vrf_result
     * @param {number} block_body_size
     * @param {BlockBodyHash} block_body_hash
     * @param {OperationalCert} operational_cert
     * @param {ProtocolVersion} protocol_version
     * @returns {HeaderBody}
     */
    static new(block_number, slot, prev_hash, issuer_vkey, vrf_vkey, vrf_result, block_body_size, block_body_hash, operational_cert, protocol_version) {
      _assertClass(slot, BigNum);
      let ptr0 = 0;
      if (!isLikeNone(prev_hash)) {
        _assertClass(prev_hash, BlockHeaderHash);
        ptr0 = prev_hash.ptr;
        prev_hash.ptr = 0;
      }
      _assertClass(issuer_vkey, Vkey);
      _assertClass(vrf_vkey, VRFVKey);
      _assertClass(vrf_result, VRFCert);
      _assertClass(block_body_hash, BlockBodyHash);
      _assertClass(operational_cert, OperationalCert);
      _assertClass(protocol_version, ProtocolVersion);
      const ret = wasm.headerbody_new(block_number, slot.ptr, ptr0, issuer_vkey.ptr, vrf_vkey.ptr, vrf_result.ptr, block_body_size, block_body_hash.ptr, operational_cert.ptr, protocol_version.ptr);
      return HeaderBody.__wrap(ret);
    }
  }
  /**
   */
  class InputBuilderResult {

    static __wrap(ptr) {
      const obj = Object.create(InputBuilderResult.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_inputbuilderresult_free(ptr);
    }
  }
  /**
   */
  class Int {

    static __wrap(ptr) {
      const obj = Object.create(Int.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_int_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.int_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Int}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.int_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Int.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {BigNum} x
     * @returns {Int}
     */
    static new(x) {
      _assertClass(x, BigNum);
      const ret = wasm.int_new(x.ptr);
      return Int.__wrap(ret);
    }
    /**
     * @param {BigNum} x
     * @returns {Int}
     */
    static new_negative(x) {
      _assertClass(x, BigNum);
      const ret = wasm.int_new_negative(x.ptr);
      return Int.__wrap(ret);
    }
    /**
     * @param {number} x
     * @returns {Int}
     */
    static new_i32(x) {
      const ret = wasm.int_new_i32(x);
      return Int.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    is_positive() {
      const ret = wasm.int_is_positive(this.ptr);
      return ret !== 0;
    }
    /**
     * BigNum can only contain unsigned u64 values
     *
     * This function will return the BigNum representation
     * only in case the underlying i128 value is positive.
     *
     * Otherwise nothing will be returned (undefined).
     * @returns {BigNum | undefined}
     */
    as_positive() {
      const ret = wasm.int_as_positive(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * BigNum can only contain unsigned u64 values
     *
     * This function will return the *absolute* BigNum representation
     * only in case the underlying i128 value is negative.
     *
     * Otherwise nothing will be returned (undefined).
     * @returns {BigNum | undefined}
     */
    as_negative() {
      const ret = wasm.int_as_negative(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * !!! DEPRECATED !!!
     * Returns an i32 value in case the underlying original i128 value is within the limits.
     * Otherwise will just return an empty value (undefined).
     * @returns {number | undefined}
     */
    as_i32() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.int_as_i32(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return r0 === 0 ? undefined : r1;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * Returns the underlying value converted to i32 if possible (within limits)
     * Otherwise will just return an empty value (undefined).
     * @returns {number | undefined}
     */
    as_i32_or_nothing() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.int_as_i32_or_nothing(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return r0 === 0 ? undefined : r1;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * Returns the underlying value converted to i32 if possible (within limits)
     * JsError in case of out of boundary overflow
     * @returns {number}
     */
    as_i32_or_fail() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.int_as_i32_or_fail(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return r0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * Returns string representation of the underlying i128 value directly.
     * Might contain the minus sign (-) in case of negative value.
     * @returns {string}
     */
    to_str() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.int_to_str(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} string
     * @returns {Int}
     */
    static from_str(string) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.int_from_str(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Int.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class Ipv4 {

    static __wrap(ptr) {
      const obj = Object.create(Ipv4.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_ipv4_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ipv4_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Ipv4}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ipv4_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ipv4.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ipv4_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ipv4_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Ipv4}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ipv4_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ipv4.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} data
     * @returns {Ipv4}
     */
    static new(data) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ipv4_new(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ipv4.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    ip() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ipv4_ip(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class Ipv6 {

    static __wrap(ptr) {
      const obj = Object.create(Ipv6.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_ipv6_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ipv6_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Ipv6}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ipv6_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ipv6.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ipv6_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ipv6_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Ipv6}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ipv6_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ipv6.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} data
     * @returns {Ipv6}
     */
    static new(data) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ipv6_new(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Ipv6.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    ip() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.ipv6_ip(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class KESSignature {

    static __wrap(ptr) {
      const obj = Object.create(KESSignature.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_kessignature_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.kessignature_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {KESSignature}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.kessignature_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return KESSignature.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class KESVKey {

    static __wrap(ptr) {
      const obj = Object.create(KESVKey.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_kesvkey_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {KESVKey}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.kesvkey_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return KESVKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.kesvkey_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.kesvkey_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {KESVKey}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.kesvkey_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return KESVKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.kesvkey_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {KESVKey}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.kesvkey_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return KESVKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class Language {

    static __wrap(ptr) {
      const obj = Object.create(Language.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_language_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.language_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Language}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.language_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Language.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Language}
     */
    static new_plutus_v1() {
      const ret = wasm.language_new_plutus_v1();
      return Language.__wrap(ret);
    }
    /**
     * @returns {Language}
     */
    static new_plutus_v2() {
      const ret = wasm.language_new_plutus_v2();
      return Language.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.language_kind(this.ptr);
      return ret >>> 0;
    }
  }
  /**
   */
  class Languages {

    static __wrap(ptr) {
      const obj = Object.create(Languages.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_languages_free(ptr);
    }
    /**
     * @returns {Languages}
     */
    static new() {
      const ret = wasm.languages_new();
      return Languages.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.languages_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {Language}
     */
    get(index) {
      const ret = wasm.languages_get(this.ptr, index);
      return Language.__wrap(ret);
    }
    /**
     * @param {Language} elem
     */
    add(elem) {
      _assertClass(elem, Language);
      var ptr0 = elem.ptr;
      elem.ptr = 0;
      wasm.languages_add(this.ptr, ptr0);
    }
  }
  /**
   */
  class LegacyDaedalusPrivateKey {

    static __wrap(ptr) {
      const obj = Object.create(LegacyDaedalusPrivateKey.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_legacydaedalusprivatekey_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {LegacyDaedalusPrivateKey}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.legacydaedalusprivatekey_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return LegacyDaedalusPrivateKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    as_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.legacydaedalusprivatekey_as_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    chaincode() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.legacydaedalusprivatekey_chaincode(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   * Careful: although the linear fee is the same for Byron & Shelley
   * The value of the parameters and how fees are computed is not the same
   */
  class LinearFee {

    static __wrap(ptr) {
      const obj = Object.create(LinearFee.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_linearfee_free(ptr);
    }
    /**
     * @returns {BigNum}
     */
    constant() {
      const ret = wasm.linearfee_constant(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @returns {BigNum}
     */
    coefficient() {
      const ret = wasm.linearfee_coefficient(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @param {BigNum} coefficient
     * @param {BigNum} constant
     * @returns {LinearFee}
     */
    static new(coefficient, constant) {
      _assertClass(coefficient, BigNum);
      _assertClass(constant, BigNum);
      const ret = wasm.linearfee_new(coefficient.ptr, constant.ptr);
      return LinearFee.__wrap(ret);
    }
  }
  /**
   */
  class MIRToStakeCredentials {

    static __wrap(ptr) {
      const obj = Object.create(MIRToStakeCredentials.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_mirtostakecredentials_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.mirtostakecredentials_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {MIRToStakeCredentials}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.mirtostakecredentials_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MIRToStakeCredentials.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.mirtostakecredentials_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.mirtostakecredentials_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {MIRToStakeCredentials}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.mirtostakecredentials_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MIRToStakeCredentials.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {MIRToStakeCredentials}
     */
    static new() {
      const ret = wasm.mirtostakecredentials_new();
      return MIRToStakeCredentials.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.mirtostakecredentials_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {StakeCredential} cred
     * @param {Int} delta
     * @returns {Int | undefined}
     */
    insert(cred, delta) {
      _assertClass(cred, StakeCredential);
      _assertClass(delta, Int);
      const ret = wasm.mirtostakecredentials_insert(this.ptr, cred.ptr, delta.ptr);
      return ret === 0 ? undefined : Int.__wrap(ret);
    }
    /**
     * @param {StakeCredential} cred
     * @returns {Int | undefined}
     */
    get(cred) {
      _assertClass(cred, StakeCredential);
      const ret = wasm.mirtostakecredentials_get(this.ptr, cred.ptr);
      return ret === 0 ? undefined : Int.__wrap(ret);
    }
    /**
     * @returns {StakeCredentials}
     */
    keys() {
      const ret = wasm.mirtostakecredentials_keys(this.ptr);
      return StakeCredentials.__wrap(ret);
    }
  }
  /**
   */
  class MetadataList {

    static __wrap(ptr) {
      const obj = Object.create(MetadataList.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_metadatalist_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.metadatalist_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {MetadataList}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.metadatalist_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MetadataList.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {MetadataList}
     */
    static new() {
      const ret = wasm.metadatalist_new();
      return MetadataList.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.metadatalist_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {TransactionMetadatum}
     */
    get(index) {
      const ret = wasm.metadatalist_get(this.ptr, index);
      return TransactionMetadatum.__wrap(ret);
    }
    /**
     * @param {TransactionMetadatum} elem
     */
    add(elem) {
      _assertClass(elem, TransactionMetadatum);
      wasm.metadatalist_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class MetadataMap {

    static __wrap(ptr) {
      const obj = Object.create(MetadataMap.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_metadatamap_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.metadatamap_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {MetadataMap}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.metadatamap_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MetadataMap.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {MetadataMap}
     */
    static new() {
      const ret = wasm.metadatamap_new();
      return MetadataMap.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.metadatamap_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {TransactionMetadatum} key
     * @param {TransactionMetadatum} value
     * @returns {TransactionMetadatum | undefined}
     */
    insert(key, value) {
      _assertClass(key, TransactionMetadatum);
      _assertClass(value, TransactionMetadatum);
      const ret = wasm.metadatamap_insert(this.ptr, key.ptr, value.ptr);
      return ret === 0 ? undefined : TransactionMetadatum.__wrap(ret);
    }
    /**
     * @param {string} key
     * @param {TransactionMetadatum} value
     * @returns {TransactionMetadatum | undefined}
     */
    insert_str(key, value) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(value, TransactionMetadatum);
        wasm.metadatamap_insert_str(retptr, this.ptr, ptr0, len0, value.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return r0 === 0 ? undefined : TransactionMetadatum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {number} key
     * @param {TransactionMetadatum} value
     * @returns {TransactionMetadatum | undefined}
     */
    insert_i32(key, value) {
      _assertClass(value, TransactionMetadatum);
      const ret = wasm.metadatamap_insert_i32(this.ptr, key, value.ptr);
      return ret === 0 ? undefined : TransactionMetadatum.__wrap(ret);
    }
    /**
     * @param {TransactionMetadatum} key
     * @returns {TransactionMetadatum}
     */
    get(key) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(key, TransactionMetadatum);
        wasm.metadatamap_get(retptr, this.ptr, key.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionMetadatum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} key
     * @returns {TransactionMetadatum}
     */
    get_str(key) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.metadatamap_get_str(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionMetadatum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {number} key
     * @returns {TransactionMetadatum}
     */
    get_i32(key) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.metadatamap_get_i32(retptr, this.ptr, key);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionMetadatum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {TransactionMetadatum} key
     * @returns {boolean}
     */
    has(key) {
      _assertClass(key, TransactionMetadatum);
      const ret = wasm.metadatamap_has(this.ptr, key.ptr);
      return ret !== 0;
    }
    /**
     * @returns {MetadataList}
     */
    keys() {
      const ret = wasm.metadatamap_keys(this.ptr);
      return MetadataList.__wrap(ret);
    }
  }
  /**
   */
  class Mint {

    static __wrap(ptr) {
      const obj = Object.create(Mint.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_mint_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.mint_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Mint}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.mint_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Mint.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.mint_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.mint_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Mint}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.mint_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Mint.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Mint}
     */
    static new() {
      const ret = wasm.mint_new();
      return Mint.__wrap(ret);
    }
    /**
     * @param {ScriptHash} key
     * @param {MintAssets} value
     * @returns {Mint}
     */
    static new_from_entry(key, value) {
      _assertClass(key, ScriptHash);
      _assertClass(value, MintAssets);
      const ret = wasm.mint_new_from_entry(key.ptr, value.ptr);
      return Mint.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.mint_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {ScriptHash} key
     * @param {MintAssets} value
     * @returns {MintAssets | undefined}
     */
    insert(key, value) {
      _assertClass(key, ScriptHash);
      _assertClass(value, MintAssets);
      const ret = wasm.mint_insert(this.ptr, key.ptr, value.ptr);
      return ret === 0 ? undefined : MintAssets.__wrap(ret);
    }
    /**
     * @param {ScriptHash} key
     * @returns {MintAssets | undefined}
     */
    get(key) {
      _assertClass(key, ScriptHash);
      const ret = wasm.mint_get(this.ptr, key.ptr);
      return ret === 0 ? undefined : MintAssets.__wrap(ret);
    }
    /**
     * @returns {ScriptHashes}
     */
    keys() {
      const ret = wasm.mint_keys(this.ptr);
      return ScriptHashes.__wrap(ret);
    }
    /**
     * Returns the multiasset where only positive (minting) entries are present
     * @returns {MultiAsset}
     */
    as_positive_multiasset() {
      const ret = wasm.mint_as_positive_multiasset(this.ptr);
      return MultiAsset.__wrap(ret);
    }
    /**
     * Returns the multiasset where only negative (burning) entries are present
     * @returns {MultiAsset}
     */
    as_negative_multiasset() {
      const ret = wasm.mint_as_negative_multiasset(this.ptr);
      return MultiAsset.__wrap(ret);
    }
  }
  /**
   */
  class MintAssets {

    static __wrap(ptr) {
      const obj = Object.create(MintAssets.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_mintassets_free(ptr);
    }
    /**
     * @returns {MintAssets}
     */
    static new() {
      const ret = wasm.mintassets_new();
      return MintAssets.__wrap(ret);
    }
    /**
     * @param {AssetName} key
     * @param {Int} value
     * @returns {MintAssets}
     */
    static new_from_entry(key, value) {
      _assertClass(key, AssetName);
      _assertClass(value, Int);
      var ptr0 = value.ptr;
      value.ptr = 0;
      const ret = wasm.mintassets_new_from_entry(key.ptr, ptr0);
      return MintAssets.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.mintassets_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {AssetName} key
     * @param {Int} value
     * @returns {Int | undefined}
     */
    insert(key, value) {
      _assertClass(key, AssetName);
      _assertClass(value, Int);
      var ptr0 = value.ptr;
      value.ptr = 0;
      const ret = wasm.mintassets_insert(this.ptr, key.ptr, ptr0);
      return ret === 0 ? undefined : Int.__wrap(ret);
    }
    /**
     * @param {AssetName} key
     * @returns {Int | undefined}
     */
    get(key) {
      _assertClass(key, AssetName);
      const ret = wasm.mintassets_get(this.ptr, key.ptr);
      return ret === 0 ? undefined : Int.__wrap(ret);
    }
    /**
     * @returns {AssetNames}
     */
    keys() {
      const ret = wasm.mintassets_keys(this.ptr);
      return AssetNames.__wrap(ret);
    }
  }
  /**
   */
  class MintBuilderResult {

    static __wrap(ptr) {
      const obj = Object.create(MintBuilderResult.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_mintbuilderresult_free(ptr);
    }
  }
  /**
   */
  class MoveInstantaneousReward {

    static __wrap(ptr) {
      const obj = Object.create(MoveInstantaneousReward.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_moveinstantaneousreward_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.moveinstantaneousreward_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {MoveInstantaneousReward}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.moveinstantaneousreward_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MoveInstantaneousReward.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.moveinstantaneousreward_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.moveinstantaneousreward_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {MoveInstantaneousReward}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.moveinstantaneousreward_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MoveInstantaneousReward.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {number} pot
     * @param {BigNum} amount
     * @returns {MoveInstantaneousReward}
     */
    static new_to_other_pot(pot, amount) {
      _assertClass(amount, BigNum);
      const ret = wasm.moveinstantaneousreward_new_to_other_pot(pot, amount.ptr);
      return MoveInstantaneousReward.__wrap(ret);
    }
    /**
     * @param {number} pot
     * @param {MIRToStakeCredentials} amounts
     * @returns {MoveInstantaneousReward}
     */
    static new_to_stake_creds(pot, amounts) {
      _assertClass(amounts, MIRToStakeCredentials);
      const ret = wasm.moveinstantaneousreward_new_to_stake_creds(pot, amounts.ptr);
      return MoveInstantaneousReward.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    pot() {
      const ret = wasm.moveinstantaneousreward_pot(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.moveinstantaneousreward_kind(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {BigNum | undefined}
     */
    as_to_other_pot() {
      const ret = wasm.moveinstantaneousreward_as_to_other_pot(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @returns {MIRToStakeCredentials | undefined}
     */
    as_to_stake_creds() {
      const ret = wasm.moveinstantaneousreward_as_to_stake_creds(this.ptr);
      return ret === 0 ? undefined : MIRToStakeCredentials.__wrap(ret);
    }
  }
  /**
   */
  class MoveInstantaneousRewardsCert {

    static __wrap(ptr) {
      const obj = Object.create(MoveInstantaneousRewardsCert.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_moveinstantaneousrewardscert_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.moveinstantaneousrewardscert_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {MoveInstantaneousRewardsCert}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.moveinstantaneousrewardscert_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MoveInstantaneousRewardsCert.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.moveinstantaneousrewardscert_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.moveinstantaneousrewardscert_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {MoveInstantaneousRewardsCert}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.moveinstantaneousrewardscert_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MoveInstantaneousRewardsCert.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {MoveInstantaneousReward}
     */
    move_instantaneous_reward() {
      const ret = wasm.moveinstantaneousrewardscert_move_instantaneous_reward(this.ptr);
      return MoveInstantaneousReward.__wrap(ret);
    }
    /**
     * @param {MoveInstantaneousReward} move_instantaneous_reward
     * @returns {MoveInstantaneousRewardsCert}
     */
    static new(move_instantaneous_reward) {
      _assertClass(move_instantaneous_reward, MoveInstantaneousReward);
      const ret = wasm.moveinstantaneousrewardscert_new(move_instantaneous_reward.ptr);
      return MoveInstantaneousRewardsCert.__wrap(ret);
    }
  }
  /**
   */
  class MultiAsset {

    static __wrap(ptr) {
      const obj = Object.create(MultiAsset.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_multiasset_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.multiasset_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {MultiAsset}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.multiasset_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MultiAsset.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.multiasset_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.multiasset_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {MultiAsset}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.multiasset_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MultiAsset.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {MultiAsset}
     */
    static new() {
      const ret = wasm.multiasset_new();
      return MultiAsset.__wrap(ret);
    }
    /**
     * the number of unique policy IDs in the multiasset
     * @returns {number}
     */
    len() {
      const ret = wasm.multiasset_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * set (and replace if it exists) all assets with policy {policy_id} to a copy of {assets}
     * @param {ScriptHash} policy_id
     * @param {Assets} assets
     * @returns {Assets | undefined}
     */
    insert(policy_id, assets) {
      _assertClass(policy_id, ScriptHash);
      _assertClass(assets, Assets);
      const ret = wasm.multiasset_insert(this.ptr, policy_id.ptr, assets.ptr);
      return ret === 0 ? undefined : Assets.__wrap(ret);
    }
    /**
     * all assets under {policy_id}, if any exist, or else None (undefined in JS)
     * @param {ScriptHash} policy_id
     * @returns {Assets | undefined}
     */
    get(policy_id) {
      _assertClass(policy_id, ScriptHash);
      const ret = wasm.multiasset_get(this.ptr, policy_id.ptr);
      return ret === 0 ? undefined : Assets.__wrap(ret);
    }
    /**
     * sets the asset {asset_name} to {value} under policy {policy_id}
     * returns the previous amount if it was set, or else None (undefined in JS)
     * @param {ScriptHash} policy_id
     * @param {AssetName} asset_name
     * @param {BigNum} value
     * @returns {BigNum | undefined}
     */
    set_asset(policy_id, asset_name, value) {
      _assertClass(policy_id, ScriptHash);
      _assertClass(asset_name, AssetName);
      _assertClass(value, BigNum);
      const ret = wasm.multiasset_set_asset(this.ptr, policy_id.ptr, asset_name.ptr, value.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * returns the amount of asset {asset_name} under policy {policy_id}
     * If such an asset does not exist, 0 is returned.
     * @param {ScriptHash} policy_id
     * @param {AssetName} asset_name
     * @returns {BigNum}
     */
    get_asset(policy_id, asset_name) {
      _assertClass(policy_id, ScriptHash);
      _assertClass(asset_name, AssetName);
      const ret = wasm.multiasset_get_asset(this.ptr, policy_id.ptr, asset_name.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * returns all policy IDs used by assets in this multiasset
     * @returns {ScriptHashes}
     */
    keys() {
      const ret = wasm.multiasset_keys(this.ptr);
      return ScriptHashes.__wrap(ret);
    }
    /**
     * removes an asset from the list if the result is 0 or less
     * does not modify this object, instead the result is returned
     * @param {MultiAsset} rhs_ma
     * @returns {MultiAsset}
     */
    sub(rhs_ma) {
      _assertClass(rhs_ma, MultiAsset);
      const ret = wasm.multiasset_sub(this.ptr, rhs_ma.ptr);
      return MultiAsset.__wrap(ret);
    }
  }
  /**
   */
  class MultiHostName {

    static __wrap(ptr) {
      const obj = Object.create(MultiHostName.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_multihostname_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.multihostname_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {MultiHostName}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.multihostname_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MultiHostName.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.multihostname_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.multihostname_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {MultiHostName}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.multihostname_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MultiHostName.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {DNSRecordSRV}
     */
    dns_name() {
      const ret = wasm.multihostname_dns_name(this.ptr);
      return DNSRecordSRV.__wrap(ret);
    }
    /**
     * @param {DNSRecordSRV} dns_name
     * @returns {MultiHostName}
     */
    static new(dns_name) {
      _assertClass(dns_name, DNSRecordSRV);
      const ret = wasm.multihostname_new(dns_name.ptr);
      return MultiHostName.__wrap(ret);
    }
  }
  /**
   */
  class NativeScript {

    static __wrap(ptr) {
      const obj = Object.create(NativeScript.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_nativescript_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.nativescript_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {NativeScript}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.nativescript_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return NativeScript.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.nativescript_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.nativescript_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {NativeScript}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.nativescript_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return NativeScript.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {ScriptHash}
     */
    hash() {
      const ret = wasm.nativescript_hash(this.ptr);
      return ScriptHash.__wrap(ret);
    }
    /**
     * @param {ScriptPubkey} script_pubkey
     * @returns {NativeScript}
     */
    static new_script_pubkey(script_pubkey) {
      _assertClass(script_pubkey, ScriptPubkey);
      const ret = wasm.nativescript_new_script_pubkey(script_pubkey.ptr);
      return NativeScript.__wrap(ret);
    }
    /**
     * @param {ScriptAll} script_all
     * @returns {NativeScript}
     */
    static new_script_all(script_all) {
      _assertClass(script_all, ScriptAll);
      const ret = wasm.nativescript_new_script_all(script_all.ptr);
      return NativeScript.__wrap(ret);
    }
    /**
     * @param {ScriptAny} script_any
     * @returns {NativeScript}
     */
    static new_script_any(script_any) {
      _assertClass(script_any, ScriptAny);
      const ret = wasm.nativescript_new_script_any(script_any.ptr);
      return NativeScript.__wrap(ret);
    }
    /**
     * @param {ScriptNOfK} script_n_of_k
     * @returns {NativeScript}
     */
    static new_script_n_of_k(script_n_of_k) {
      _assertClass(script_n_of_k, ScriptNOfK);
      const ret = wasm.nativescript_new_script_n_of_k(script_n_of_k.ptr);
      return NativeScript.__wrap(ret);
    }
    /**
     * @param {TimelockStart} timelock_start
     * @returns {NativeScript}
     */
    static new_timelock_start(timelock_start) {
      _assertClass(timelock_start, TimelockStart);
      const ret = wasm.nativescript_new_timelock_start(timelock_start.ptr);
      return NativeScript.__wrap(ret);
    }
    /**
     * @param {TimelockExpiry} timelock_expiry
     * @returns {NativeScript}
     */
    static new_timelock_expiry(timelock_expiry) {
      _assertClass(timelock_expiry, TimelockExpiry);
      const ret = wasm.nativescript_new_timelock_expiry(timelock_expiry.ptr);
      return NativeScript.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.nativescript_kind(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {ScriptPubkey | undefined}
     */
    as_script_pubkey() {
      const ret = wasm.nativescript_as_script_pubkey(this.ptr);
      return ret === 0 ? undefined : ScriptPubkey.__wrap(ret);
    }
    /**
     * @returns {ScriptAll | undefined}
     */
    as_script_all() {
      const ret = wasm.nativescript_as_script_all(this.ptr);
      return ret === 0 ? undefined : ScriptAll.__wrap(ret);
    }
    /**
     * @returns {ScriptAny | undefined}
     */
    as_script_any() {
      const ret = wasm.nativescript_as_script_any(this.ptr);
      return ret === 0 ? undefined : ScriptAny.__wrap(ret);
    }
    /**
     * @returns {ScriptNOfK | undefined}
     */
    as_script_n_of_k() {
      const ret = wasm.nativescript_as_script_n_of_k(this.ptr);
      return ret === 0 ? undefined : ScriptNOfK.__wrap(ret);
    }
    /**
     * @returns {TimelockStart | undefined}
     */
    as_timelock_start() {
      const ret = wasm.nativescript_as_timelock_start(this.ptr);
      return ret === 0 ? undefined : TimelockStart.__wrap(ret);
    }
    /**
     * @returns {TimelockExpiry | undefined}
     */
    as_timelock_expiry() {
      const ret = wasm.nativescript_as_timelock_expiry(this.ptr);
      return ret === 0 ? undefined : TimelockExpiry.__wrap(ret);
    }
    /**
     * Returns an array of unique Ed25519KeyHashes
     * contained within this script recursively on any depth level.
     * The order of the keys in the result is not determined in any way.
     * @returns {Ed25519KeyHashes}
     */
    get_required_signers() {
      const ret = wasm.nativescript_get_required_signers(this.ptr);
      return Ed25519KeyHashes.__wrap(ret);
    }
  }
  /**
   */
  class NativeScriptWitnessInfo {

    static __wrap(ptr) {
      const obj = Object.create(NativeScriptWitnessInfo.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_nativescriptwitnessinfo_free(ptr);
    }
    /**
     * Unsure which keys will sign, but you know the exact number to save on tx fee
     * @param {number} num
     * @returns {NativeScriptWitnessInfo}
     */
    static num_signatures(num) {
      const ret = wasm.nativescriptwitnessinfo_num_signatures(num);
      return NativeScriptWitnessInfo.__wrap(ret);
    }
    /**
     * This native script will be witnessed by exactly these keys
     * @param {Ed25519KeyHashes} vkeys
     * @returns {NativeScriptWitnessInfo}
     */
    static vkeys(vkeys) {
      _assertClass(vkeys, Ed25519KeyHashes);
      const ret = wasm.nativescriptwitnessinfo_vkeys(vkeys.ptr);
      return NativeScriptWitnessInfo.__wrap(ret);
    }
    /**
     * You don't know how many keys will sign, so the maximum possible case will be assumed
     * @returns {NativeScriptWitnessInfo}
     */
    static assume_signature_count() {
      const ret = wasm.nativescriptwitnessinfo_assume_signature_count();
      return NativeScriptWitnessInfo.__wrap(ret);
    }
  }
  /**
   */
  class NativeScripts {

    static __wrap(ptr) {
      const obj = Object.create(NativeScripts.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_nativescripts_free(ptr);
    }
    /**
     * @returns {NativeScripts}
     */
    static new() {
      const ret = wasm.nativescripts_new();
      return NativeScripts.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.nativescripts_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {NativeScript}
     */
    get(index) {
      const ret = wasm.nativescripts_get(this.ptr, index);
      return NativeScript.__wrap(ret);
    }
    /**
     * @param {NativeScript} elem
     */
    add(elem) {
      _assertClass(elem, NativeScript);
      wasm.nativescripts_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class NetworkId {

    static __wrap(ptr) {
      const obj = Object.create(NetworkId.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_networkid_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.networkid_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {NetworkId}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.networkid_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return NetworkId.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.networkid_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.networkid_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {NetworkId}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.networkid_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return NetworkId.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {NetworkId}
     */
    static testnet() {
      const ret = wasm.networkid_testnet();
      return NetworkId.__wrap(ret);
    }
    /**
     * @returns {NetworkId}
     */
    static mainnet() {
      const ret = wasm.networkid_mainnet();
      return NetworkId.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.networkid_kind(this.ptr);
      return ret >>> 0;
    }
  }
  /**
   */
  class NetworkInfo {

    static __wrap(ptr) {
      const obj = Object.create(NetworkInfo.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_networkinfo_free(ptr);
    }
    /**
     * @param {number} network_id
     * @param {number} protocol_magic
     * @returns {NetworkInfo}
     */
    static new(network_id, protocol_magic) {
      const ret = wasm.networkinfo_new(network_id, protocol_magic);
      return NetworkInfo.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    network_id() {
      const ret = wasm.networkinfo_network_id(this.ptr);
      return ret;
    }
    /**
     * @returns {number}
     */
    protocol_magic() {
      const ret = wasm.networkinfo_protocol_magic(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {NetworkInfo}
     */
    static testnet() {
      const ret = wasm.networkinfo_testnet();
      return NetworkInfo.__wrap(ret);
    }
    /**
     * @returns {NetworkInfo}
     */
    static mainnet() {
      const ret = wasm.networkinfo_mainnet();
      return NetworkInfo.__wrap(ret);
    }
  }
  /**
   */
  class Nonce {

    static __wrap(ptr) {
      const obj = Object.create(Nonce.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_nonce_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.nonce_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Nonce}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.nonce_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Nonce.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Nonce}
     */
    static new_identity() {
      const ret = wasm.nonce_new_identity();
      return Nonce.__wrap(ret);
    }
    /**
     * @param {Uint8Array} hash
     * @returns {Nonce}
     */
    static new_from_hash(hash) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(hash, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.nonce_new_from_hash(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Nonce.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array | undefined}
     */
    get_hash() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.nonce_get_hash(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        let v0;
        if (r0 !== 0) {
          v0 = getArrayU8FromWasm0(r0, r1).slice();
          wasm.__wbindgen_free(r0, r1 * 1);
        }
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class OperationalCert {

    static __wrap(ptr) {
      const obj = Object.create(OperationalCert.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_operationalcert_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.operationalcert_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {OperationalCert}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.operationalcert_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return OperationalCert.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.operationalcert_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.operationalcert_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {OperationalCert}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.operationalcert_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return OperationalCert.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {KESVKey}
     */
    hot_vkey() {
      const ret = wasm.operationalcert_hot_vkey(this.ptr);
      return KESVKey.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    sequence_number() {
      const ret = wasm.operationalcert_sequence_number(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    kes_period() {
      const ret = wasm.operationalcert_kes_period(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {Ed25519Signature}
     */
    sigma() {
      const ret = wasm.operationalcert_sigma(this.ptr);
      return Ed25519Signature.__wrap(ret);
    }
    /**
     * @param {KESVKey} hot_vkey
     * @param {number} sequence_number
     * @param {number} kes_period
     * @param {Ed25519Signature} sigma
     * @returns {OperationalCert}
     */
    static new(hot_vkey, sequence_number, kes_period, sigma) {
      _assertClass(hot_vkey, KESVKey);
      _assertClass(sigma, Ed25519Signature);
      const ret = wasm.operationalcert_new(hot_vkey.ptr, sequence_number, kes_period, sigma.ptr);
      return OperationalCert.__wrap(ret);
    }
  }
  /**
   * A partial Plutus witness
   * It contains all the information needed to witness the Plutus script execution
   * except for the redeemer tag and index
   * Note: no datum is attached because only input script types have datums
   */
  class PartialPlutusWitness {

    static __wrap(ptr) {
      const obj = Object.create(PartialPlutusWitness.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_partialplutuswitness_free(ptr);
    }
    /**
     * @param {PlutusScriptWitness} script
     * @param {PlutusData} data
     * @returns {PartialPlutusWitness}
     */
    static new(script, data) {
      _assertClass(script, PlutusScriptWitness);
      _assertClass(data, PlutusData);
      const ret = wasm.partialplutuswitness_new(script.ptr, data.ptr);
      return PartialPlutusWitness.__wrap(ret);
    }
    /**
     * @returns {PlutusScriptWitness}
     */
    script() {
      const ret = wasm.partialplutuswitness_script(this.ptr);
      return PlutusScriptWitness.__wrap(ret);
    }
    /**
     * @returns {PlutusData}
     */
    data() {
      const ret = wasm.partialplutuswitness_data(this.ptr);
      return PlutusData.__wrap(ret);
    }
  }
  /**
   */
  class PlutusData {

    static __wrap(ptr) {
      const obj = Object.create(PlutusData.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_plutusdata_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusdata_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PlutusData}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.plutusdata_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PlutusData.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {ConstrPlutusData} constr_plutus_data
     * @returns {PlutusData}
     */
    static new_constr_plutus_data(constr_plutus_data) {
      _assertClass(constr_plutus_data, ConstrPlutusData);
      const ret = wasm.plutusdata_new_constr_plutus_data(constr_plutus_data.ptr);
      return PlutusData.__wrap(ret);
    }
    /**
     * @param {PlutusMap} map
     * @returns {PlutusData}
     */
    static new_map(map) {
      _assertClass(map, PlutusMap);
      const ret = wasm.plutusdata_new_map(map.ptr);
      return PlutusData.__wrap(ret);
    }
    /**
     * @param {PlutusList} list
     * @returns {PlutusData}
     */
    static new_list(list) {
      _assertClass(list, PlutusList);
      const ret = wasm.plutusdata_new_list(list.ptr);
      return PlutusData.__wrap(ret);
    }
    /**
     * @param {BigInt} integer
     * @returns {PlutusData}
     */
    static new_integer(integer) {
      _assertClass(integer, BigInt);
      const ret = wasm.plutusdata_new_integer(integer.ptr);
      return PlutusData.__wrap(ret);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PlutusData}
     */
    static new_bytes(bytes) {
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.plutusdata_new_bytes(ptr0, len0);
      return PlutusData.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.plutusdata_kind(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {ConstrPlutusData | undefined}
     */
    as_constr_plutus_data() {
      const ret = wasm.plutusdata_as_constr_plutus_data(this.ptr);
      return ret === 0 ? undefined : ConstrPlutusData.__wrap(ret);
    }
    /**
     * @returns {PlutusMap | undefined}
     */
    as_map() {
      const ret = wasm.plutusdata_as_map(this.ptr);
      return ret === 0 ? undefined : PlutusMap.__wrap(ret);
    }
    /**
     * @returns {PlutusList | undefined}
     */
    as_list() {
      const ret = wasm.plutusdata_as_list(this.ptr);
      return ret === 0 ? undefined : PlutusList.__wrap(ret);
    }
    /**
     * @returns {BigInt | undefined}
     */
    as_integer() {
      const ret = wasm.plutusdata_as_integer(this.ptr);
      return ret === 0 ? undefined : BigInt.__wrap(ret);
    }
    /**
     * @returns {Uint8Array | undefined}
     */
    as_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusdata_as_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        let v0;
        if (r0 !== 0) {
          v0 = getArrayU8FromWasm0(r0, r1).slice();
          wasm.__wbindgen_free(r0, r1 * 1);
        }
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class PlutusList {

    static __wrap(ptr) {
      const obj = Object.create(PlutusList.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_plutuslist_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutuslist_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PlutusList}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.plutuslist_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PlutusList.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {PlutusList}
     */
    static new() {
      const ret = wasm.plutuslist_new();
      return PlutusList.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.plutuslist_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {PlutusData}
     */
    get(index) {
      const ret = wasm.plutuslist_get(this.ptr, index);
      return PlutusData.__wrap(ret);
    }
    /**
     * @param {PlutusData} elem
     */
    add(elem) {
      _assertClass(elem, PlutusData);
      wasm.plutuslist_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class PlutusMap {

    static __wrap(ptr) {
      const obj = Object.create(PlutusMap.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_plutusmap_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusmap_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PlutusMap}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.plutusmap_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PlutusMap.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {PlutusMap}
     */
    static new() {
      const ret = wasm.plutusmap_new();
      return PlutusMap.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.plutusmap_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {PlutusData} key
     * @param {PlutusData} value
     * @returns {PlutusData | undefined}
     */
    insert(key, value) {
      _assertClass(key, PlutusData);
      _assertClass(value, PlutusData);
      const ret = wasm.plutusmap_insert(this.ptr, key.ptr, value.ptr);
      return ret === 0 ? undefined : PlutusData.__wrap(ret);
    }
    /**
     * @param {PlutusData} key
     * @returns {PlutusData | undefined}
     */
    get(key) {
      _assertClass(key, PlutusData);
      const ret = wasm.plutusmap_get(this.ptr, key.ptr);
      return ret === 0 ? undefined : PlutusData.__wrap(ret);
    }
    /**
     * @returns {PlutusList}
     */
    keys() {
      const ret = wasm.plutusmap_keys(this.ptr);
      return PlutusList.__wrap(ret);
    }
  }
  /**
   */
  class PlutusScript {

    static __wrap(ptr) {
      const obj = Object.create(PlutusScript.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_plutusscript_free(ptr);
    }
    /**
     * @param {PlutusV1Script} script
     * @returns {PlutusScript}
     */
    static from_v1(script) {
      _assertClass(script, PlutusV1Script);
      const ret = wasm.plutusscript_from_v1(script.ptr);
      return PlutusScript.__wrap(ret);
    }
    /**
     * @param {PlutusV2Script} script
     * @returns {PlutusScript}
     */
    static from_v2(script) {
      _assertClass(script, PlutusV2Script);
      const ret = wasm.plutusscript_from_v2(script.ptr);
      return PlutusScript.__wrap(ret);
    }
    /**
     * @returns {ScriptHash}
     */
    hash() {
      const ret = wasm.plutusscript_hash(this.ptr);
      return ScriptHash.__wrap(ret);
    }
  }
  /**
   */
  class PlutusScriptWitness {

    static __wrap(ptr) {
      const obj = Object.create(PlutusScriptWitness.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_plutusscriptwitness_free(ptr);
    }
    /**
     * @param {PlutusScript} script
     * @returns {PlutusScriptWitness}
     */
    static from_script(script) {
      _assertClass(script, PlutusScript);
      var ptr0 = script.ptr;
      script.ptr = 0;
      const ret = wasm.plutusscriptwitness_from_script(ptr0);
      return PlutusScriptWitness.__wrap(ret);
    }
    /**
     * @param {ScriptHash} hash
     * @returns {PlutusScriptWitness}
     */
    static from_ref(hash) {
      _assertClass(hash, ScriptHash);
      var ptr0 = hash.ptr;
      hash.ptr = 0;
      const ret = wasm.plutusscriptwitness_from_ref(ptr0);
      return PlutusScriptWitness.__wrap(ret);
    }
    /**
     * @returns {PlutusScript | undefined}
     */
    script() {
      const ret = wasm.plutusscriptwitness_script(this.ptr);
      return ret === 0 ? undefined : PlutusScript.__wrap(ret);
    }
    /**
     * @returns {ScriptHash}
     */
    hash() {
      const ret = wasm.plutusscriptwitness_hash(this.ptr);
      return ScriptHash.__wrap(ret);
    }
  }
  /**
   */
  class PlutusV1Script {

    static __wrap(ptr) {
      const obj = Object.create(PlutusV1Script.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_plutusv1script_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv1script_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PlutusV1Script}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.plutusv1script_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PlutusV1Script.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv1script_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv1script_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {PlutusV1Script}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.plutusv1script_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PlutusV1Script.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {ScriptHash}
     */
    hash() {
      const ret = wasm.plutusv1script_hash(this.ptr);
      return ScriptHash.__wrap(ret);
    }
    /**
     *
     *     * Creates a new Plutus script from the RAW bytes of the compiled script.
     *     * This does NOT include any CBOR encoding around these bytes (e.g. from "cborBytes" in cardano-cli)
     *     * If you creating this from those you should use PlutusV1Script::from_bytes() instead.
     *
     * @param {Uint8Array} bytes
     * @returns {PlutusV1Script}
     */
    static new(bytes) {
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.plutusv1script_new(ptr0, len0);
      return PlutusV1Script.__wrap(ret);
    }
    /**
     *
     *     * The raw bytes of this compiled Plutus script.
     *     * If you need "cborBytes" for cardano-cli use PlutusV1Script::to_bytes() instead.
     *
     * @returns {Uint8Array}
     */
    bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv1script_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class PlutusV1Scripts {

    static __wrap(ptr) {
      const obj = Object.create(PlutusV1Scripts.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_plutusv1scripts_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv1scripts_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PlutusV1Scripts}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.plutusv1scripts_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PlutusV1Scripts.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv1scripts_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv1scripts_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {PlutusV1Scripts}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.plutusv1scripts_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PlutusV1Scripts.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {PlutusV1Scripts}
     */
    static new() {
      const ret = wasm.plutusv1scripts_new();
      return PlutusV1Scripts.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.plutusv1scripts_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {PlutusV1Script}
     */
    get(index) {
      const ret = wasm.plutusv1scripts_get(this.ptr, index);
      return PlutusV1Script.__wrap(ret);
    }
    /**
     * @param {PlutusV1Script} elem
     */
    add(elem) {
      _assertClass(elem, PlutusV1Script);
      wasm.plutusv1scripts_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class PlutusV2Script {

    static __wrap(ptr) {
      const obj = Object.create(PlutusV2Script.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_plutusv2script_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv2script_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PlutusV2Script}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.plutusv2script_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PlutusV2Script.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv2script_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv2script_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {PlutusV2Script}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.plutusv2script_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PlutusV2Script.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {ScriptHash}
     */
    hash() {
      const ret = wasm.plutusv2script_hash(this.ptr);
      return ScriptHash.__wrap(ret);
    }
    /**
     *
     *     * Creates a new Plutus script from the RAW bytes of the compiled script.
     *     * This does NOT include any CBOR encoding around these bytes (e.g. from "cborBytes" in cardano-cli)
     *     * If you creating this from those you should use PlutusV2Script::from_bytes() instead.
     *
     * @param {Uint8Array} bytes
     * @returns {PlutusV2Script}
     */
    static new(bytes) {
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.plutusv2script_new(ptr0, len0);
      return PlutusV2Script.__wrap(ret);
    }
    /**
     *
     *     * The raw bytes of this compiled Plutus script.
     *     * If you need "cborBytes" for cardano-cli use PlutusV2Script::to_bytes() instead.
     *
     * @returns {Uint8Array}
     */
    bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv2script_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class PlutusV2Scripts {

    static __wrap(ptr) {
      const obj = Object.create(PlutusV2Scripts.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_plutusv2scripts_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv2scripts_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PlutusV2Scripts}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.plutusv2scripts_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PlutusV2Scripts.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv2scripts_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.plutusv2scripts_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {PlutusV2Scripts}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.plutusv2scripts_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PlutusV2Scripts.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {PlutusV2Scripts}
     */
    static new() {
      const ret = wasm.plutusv2scripts_new();
      return PlutusV2Scripts.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.plutusv2scripts_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {PlutusV2Script}
     */
    get(index) {
      const ret = wasm.plutusv2scripts_get(this.ptr, index);
      return PlutusV2Script.__wrap(ret);
    }
    /**
     * @param {PlutusV2Script} elem
     */
    add(elem) {
      _assertClass(elem, PlutusV2Script);
      wasm.plutusv2scripts_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class Pointer {

    static __wrap(ptr) {
      const obj = Object.create(Pointer.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_pointer_free(ptr);
    }
    /**
     * @param {BigNum} slot
     * @param {BigNum} tx_index
     * @param {BigNum} cert_index
     * @returns {Pointer}
     */
    static new(slot, tx_index, cert_index) {
      _assertClass(slot, BigNum);
      _assertClass(tx_index, BigNum);
      _assertClass(cert_index, BigNum);
      const ret = wasm.pointer_new(slot.ptr, tx_index.ptr, cert_index.ptr);
      return Pointer.__wrap(ret);
    }
    /**
     * This will be truncated if above u64::MAX
     * @returns {BigNum}
     */
    slot() {
      const ret = wasm.pointer_slot(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * This will be truncated if above u64::MAX
     * @returns {BigNum}
     */
    tx_index() {
      const ret = wasm.pointer_tx_index(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * This will be truncated if above u64::MAX
     * @returns {BigNum}
     */
    cert_index() {
      const ret = wasm.pointer_cert_index(this.ptr);
      return BigNum.__wrap(ret);
    }
  }
  /**
   */
  class PointerAddress {

    static __wrap(ptr) {
      const obj = Object.create(PointerAddress.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_pointeraddress_free(ptr);
    }
    /**
     * @param {number} network
     * @param {StakeCredential} payment
     * @param {Pointer} stake
     * @returns {PointerAddress}
     */
    static new(network, payment, stake) {
      _assertClass(payment, StakeCredential);
      _assertClass(stake, Pointer);
      const ret = wasm.pointeraddress_new(network, payment.ptr, stake.ptr);
      return PointerAddress.__wrap(ret);
    }
    /**
     * @returns {StakeCredential}
     */
    payment_cred() {
      const ret = wasm.pointeraddress_payment_cred(this.ptr);
      return StakeCredential.__wrap(ret);
    }
    /**
     * @returns {Pointer}
     */
    stake_pointer() {
      const ret = wasm.pointeraddress_stake_pointer(this.ptr);
      return Pointer.__wrap(ret);
    }
    /**
     * @returns {Address}
     */
    to_address() {
      const ret = wasm.pointeraddress_to_address(this.ptr);
      return Address.__wrap(ret);
    }
    /**
     * @param {Address} addr
     * @returns {PointerAddress | undefined}
     */
    static from_address(addr) {
      _assertClass(addr, Address);
      const ret = wasm.pointeraddress_from_address(addr.ptr);
      return ret === 0 ? undefined : PointerAddress.__wrap(ret);
    }
  }
  /**
   */
  class PoolMetadata {

    static __wrap(ptr) {
      const obj = Object.create(PoolMetadata.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_poolmetadata_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolmetadata_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PoolMetadata}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.poolmetadata_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PoolMetadata.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolmetadata_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolmetadata_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {PoolMetadata}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.poolmetadata_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PoolMetadata.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {URL}
     */
    url() {
      const ret = wasm.poolmetadata_url(this.ptr);
      return URL.__wrap(ret);
    }
    /**
     * @returns {PoolMetadataHash}
     */
    pool_metadata_hash() {
      const ret = wasm.poolmetadata_pool_metadata_hash(this.ptr);
      return PoolMetadataHash.__wrap(ret);
    }
    /**
     * @param {URL} url
     * @param {PoolMetadataHash} pool_metadata_hash
     * @returns {PoolMetadata}
     */
    static new(url, pool_metadata_hash) {
      _assertClass(url, URL);
      _assertClass(pool_metadata_hash, PoolMetadataHash);
      const ret = wasm.poolmetadata_new(url.ptr, pool_metadata_hash.ptr);
      return PoolMetadata.__wrap(ret);
    }
  }
  /**
   */
  class PoolMetadataHash {

    static __wrap(ptr) {
      const obj = Object.create(PoolMetadataHash.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_poolmetadatahash_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PoolMetadataHash}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.poolmetadatahash_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PoolMetadataHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolmetadatahash_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.poolmetadatahash_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {PoolMetadataHash}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.poolmetadatahash_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PoolMetadataHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolmetadatahash_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {PoolMetadataHash}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.poolmetadatahash_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PoolMetadataHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class PoolParams {

    static __wrap(ptr) {
      const obj = Object.create(PoolParams.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_poolparams_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolparams_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PoolParams}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.poolparams_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PoolParams.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolparams_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolparams_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {PoolParams}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.poolparams_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PoolParams.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Ed25519KeyHash}
     */
    operator() {
      const ret = wasm.poolparams_operator(this.ptr);
      return Ed25519KeyHash.__wrap(ret);
    }
    /**
     * @returns {VRFKeyHash}
     */
    vrf_keyhash() {
      const ret = wasm.poolparams_vrf_keyhash(this.ptr);
      return VRFKeyHash.__wrap(ret);
    }
    /**
     * @returns {BigNum}
     */
    pledge() {
      const ret = wasm.poolparams_pledge(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @returns {BigNum}
     */
    cost() {
      const ret = wasm.poolparams_cost(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @returns {UnitInterval}
     */
    margin() {
      const ret = wasm.poolparams_margin(this.ptr);
      return UnitInterval.__wrap(ret);
    }
    /**
     * @returns {RewardAddress}
     */
    reward_account() {
      const ret = wasm.poolparams_reward_account(this.ptr);
      return RewardAddress.__wrap(ret);
    }
    /**
     * @returns {Ed25519KeyHashes}
     */
    pool_owners() {
      const ret = wasm.poolparams_pool_owners(this.ptr);
      return Ed25519KeyHashes.__wrap(ret);
    }
    /**
     * @returns {Relays}
     */
    relays() {
      const ret = wasm.poolparams_relays(this.ptr);
      return Relays.__wrap(ret);
    }
    /**
     * @returns {PoolMetadata | undefined}
     */
    pool_metadata() {
      const ret = wasm.poolparams_pool_metadata(this.ptr);
      return ret === 0 ? undefined : PoolMetadata.__wrap(ret);
    }
    /**
     * @param {Ed25519KeyHash} operator
     * @param {VRFKeyHash} vrf_keyhash
     * @param {BigNum} pledge
     * @param {BigNum} cost
     * @param {UnitInterval} margin
     * @param {RewardAddress} reward_account
     * @param {Ed25519KeyHashes} pool_owners
     * @param {Relays} relays
     * @param {PoolMetadata | undefined} pool_metadata
     * @returns {PoolParams}
     */
    static new(operator, vrf_keyhash, pledge, cost, margin, reward_account, pool_owners, relays, pool_metadata) {
      _assertClass(operator, Ed25519KeyHash);
      _assertClass(vrf_keyhash, VRFKeyHash);
      _assertClass(pledge, BigNum);
      _assertClass(cost, BigNum);
      _assertClass(margin, UnitInterval);
      _assertClass(reward_account, RewardAddress);
      _assertClass(pool_owners, Ed25519KeyHashes);
      _assertClass(relays, Relays);
      let ptr0 = 0;
      if (!isLikeNone(pool_metadata)) {
        _assertClass(pool_metadata, PoolMetadata);
        ptr0 = pool_metadata.ptr;
        pool_metadata.ptr = 0;
      }
      const ret = wasm.poolparams_new(operator.ptr, vrf_keyhash.ptr, pledge.ptr, cost.ptr, margin.ptr, reward_account.ptr, pool_owners.ptr, relays.ptr, ptr0);
      return PoolParams.__wrap(ret);
    }
  }
  /**
   */
  class PoolRegistration {

    static __wrap(ptr) {
      const obj = Object.create(PoolRegistration.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_poolregistration_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolregistration_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PoolRegistration}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.poolregistration_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PoolRegistration.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolregistration_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolregistration_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {PoolRegistration}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.poolregistration_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PoolRegistration.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {PoolParams}
     */
    pool_params() {
      const ret = wasm.poolregistration_pool_params(this.ptr);
      return PoolParams.__wrap(ret);
    }
    /**
     * @param {PoolParams} pool_params
     * @returns {PoolRegistration}
     */
    static new(pool_params) {
      _assertClass(pool_params, PoolParams);
      const ret = wasm.poolregistration_new(pool_params.ptr);
      return PoolRegistration.__wrap(ret);
    }
  }
  /**
   */
  class PoolRetirement {

    static __wrap(ptr) {
      const obj = Object.create(PoolRetirement.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_poolretirement_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolretirement_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PoolRetirement}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.poolretirement_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PoolRetirement.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolretirement_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.poolretirement_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {PoolRetirement}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.poolretirement_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PoolRetirement.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Ed25519KeyHash}
     */
    pool_keyhash() {
      const ret = wasm.poolretirement_pool_keyhash(this.ptr);
      return Ed25519KeyHash.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    epoch() {
      const ret = wasm.poolretirement_epoch(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {Ed25519KeyHash} pool_keyhash
     * @param {number} epoch
     * @returns {PoolRetirement}
     */
    static new(pool_keyhash, epoch) {
      _assertClass(pool_keyhash, Ed25519KeyHash);
      const ret = wasm.poolretirement_new(pool_keyhash.ptr, epoch);
      return PoolRetirement.__wrap(ret);
    }
  }
  /**
   */
  class PrivateKey {

    static __wrap(ptr) {
      const obj = Object.create(PrivateKey.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_privatekey_free(ptr);
    }
    /**
     * @returns {PublicKey}
     */
    to_public() {
      const ret = wasm.privatekey_to_public(this.ptr);
      return PublicKey.__wrap(ret);
    }
    /**
     * @returns {PrivateKey}
     */
    static generate_ed25519() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.privatekey_generate_ed25519(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PrivateKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {PrivateKey}
     */
    static generate_ed25519extended() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.privatekey_generate_ed25519extended(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PrivateKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * Get private key from its bech32 representation
     * ```javascript
     * PrivateKey.from_bech32(&#39;ed25519_sk1ahfetf02qwwg4dkq7mgp4a25lx5vh9920cr5wnxmpzz9906qvm8qwvlts0&#39;);
     * ```
     * For an extended 25519 key
     * ```javascript
     * PrivateKey.from_bech32(&#39;ed25519e_sk1gqwl4szuwwh6d0yk3nsqcc6xxc3fpvjlevgwvt60df59v8zd8f8prazt8ln3lmz096ux3xvhhvm3ca9wj2yctdh3pnw0szrma07rt5gl748fp&#39;);
     * ```
     * @param {string} bech32_str
     * @returns {PrivateKey}
     */
    static from_bech32(bech32_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech32_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.privatekey_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PrivateKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_bech32() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.privatekey_to_bech32(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    as_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.privatekey_as_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PrivateKey}
     */
    static from_extended_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.privatekey_from_extended_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PrivateKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PrivateKey}
     */
    static from_normal_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.privatekey_from_normal_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PrivateKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} message
     * @returns {Ed25519Signature}
     */
    sign(message) {
      const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.privatekey_sign(this.ptr, ptr0, len0);
      return Ed25519Signature.__wrap(ret);
    }
  }
  /**
   */
  class ProposedProtocolParameterUpdates {

    static __wrap(ptr) {
      const obj = Object.create(ProposedProtocolParameterUpdates.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_proposedprotocolparameterupdates_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.proposedprotocolparameterupdates_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ProposedProtocolParameterUpdates}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.proposedprotocolparameterupdates_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ProposedProtocolParameterUpdates.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.proposedprotocolparameterupdates_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.proposedprotocolparameterupdates_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ProposedProtocolParameterUpdates}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.proposedprotocolparameterupdates_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ProposedProtocolParameterUpdates.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {ProposedProtocolParameterUpdates}
     */
    static new() {
      const ret = wasm.proposedprotocolparameterupdates_new();
      return ProposedProtocolParameterUpdates.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.proposedprotocolparameterupdates_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {GenesisHash} key
     * @param {ProtocolParamUpdate} value
     * @returns {ProtocolParamUpdate | undefined}
     */
    insert(key, value) {
      _assertClass(key, GenesisHash);
      _assertClass(value, ProtocolParamUpdate);
      const ret = wasm.proposedprotocolparameterupdates_insert(this.ptr, key.ptr, value.ptr);
      return ret === 0 ? undefined : ProtocolParamUpdate.__wrap(ret);
    }
    /**
     * @param {GenesisHash} key
     * @returns {ProtocolParamUpdate | undefined}
     */
    get(key) {
      _assertClass(key, GenesisHash);
      const ret = wasm.proposedprotocolparameterupdates_get(this.ptr, key.ptr);
      return ret === 0 ? undefined : ProtocolParamUpdate.__wrap(ret);
    }
    /**
     * @returns {GenesisHashes}
     */
    keys() {
      const ret = wasm.proposedprotocolparameterupdates_keys(this.ptr);
      return GenesisHashes.__wrap(ret);
    }
  }
  /**
   */
  class ProtocolMagic {

    static __wrap(ptr) {
      const obj = Object.create(ProtocolMagic.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_protocolmagic_free(ptr);
    }
    /**
     * @param {number} val
     * @returns {ProtocolMagic}
     */
    static new(val) {
      const ret = wasm.protocolmagic_new(val);
      return ProtocolMagic.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    value() {
      const ret = wasm.protocolmagic_value(this.ptr);
      return ret >>> 0;
    }
  }
  /**
   */
  class ProtocolParamUpdate {

    static __wrap(ptr) {
      const obj = Object.create(ProtocolParamUpdate.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_protocolparamupdate_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolparamupdate_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ProtocolParamUpdate}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.protocolparamupdate_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ProtocolParamUpdate.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolparamupdate_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolparamupdate_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ProtocolParamUpdate}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.protocolparamupdate_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ProtocolParamUpdate.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {BigNum} minfee_a
     */
    set_minfee_a(minfee_a) {
      _assertClass(minfee_a, BigNum);
      wasm.protocolparamupdate_set_minfee_a(this.ptr, minfee_a.ptr);
    }
    /**
     * @returns {BigNum | undefined}
     */
    minfee_a() {
      const ret = wasm.protocolparamupdate_minfee_a(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @param {BigNum} minfee_b
     */
    set_minfee_b(minfee_b) {
      _assertClass(minfee_b, BigNum);
      wasm.protocolparamupdate_set_minfee_b(this.ptr, minfee_b.ptr);
    }
    /**
     * @returns {BigNum | undefined}
     */
    minfee_b() {
      const ret = wasm.protocolparamupdate_minfee_b(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @param {number} max_block_body_size
     */
    set_max_block_body_size(max_block_body_size) {
      wasm.protocolparamupdate_set_max_block_body_size(this.ptr, max_block_body_size);
    }
    /**
     * @returns {number | undefined}
     */
    max_block_body_size() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolparamupdate_max_block_body_size(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return r0 === 0 ? undefined : r1 >>> 0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {number} max_tx_size
     */
    set_max_tx_size(max_tx_size) {
      wasm.protocolparamupdate_set_max_tx_size(this.ptr, max_tx_size);
    }
    /**
     * @returns {number | undefined}
     */
    max_tx_size() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolparamupdate_max_tx_size(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return r0 === 0 ? undefined : r1 >>> 0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {number} max_block_header_size
     */
    set_max_block_header_size(max_block_header_size) {
      wasm.protocolparamupdate_set_max_block_header_size(this.ptr, max_block_header_size);
    }
    /**
     * @returns {number | undefined}
     */
    max_block_header_size() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolparamupdate_max_block_header_size(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return r0 === 0 ? undefined : r1 >>> 0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {BigNum} key_deposit
     */
    set_key_deposit(key_deposit) {
      _assertClass(key_deposit, BigNum);
      wasm.protocolparamupdate_set_key_deposit(this.ptr, key_deposit.ptr);
    }
    /**
     * @returns {BigNum | undefined}
     */
    key_deposit() {
      const ret = wasm.protocolparamupdate_key_deposit(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @param {BigNum} pool_deposit
     */
    set_pool_deposit(pool_deposit) {
      _assertClass(pool_deposit, BigNum);
      wasm.protocolparamupdate_set_pool_deposit(this.ptr, pool_deposit.ptr);
    }
    /**
     * @returns {BigNum | undefined}
     */
    pool_deposit() {
      const ret = wasm.protocolparamupdate_pool_deposit(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @param {number} max_epoch
     */
    set_max_epoch(max_epoch) {
      wasm.protocolparamupdate_set_max_epoch(this.ptr, max_epoch);
    }
    /**
     * @returns {number | undefined}
     */
    max_epoch() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolparamupdate_max_epoch(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return r0 === 0 ? undefined : r1 >>> 0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {number} n_opt
     */
    set_n_opt(n_opt) {
      wasm.protocolparamupdate_set_n_opt(this.ptr, n_opt);
    }
    /**
     * @returns {number | undefined}
     */
    n_opt() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolparamupdate_n_opt(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return r0 === 0 ? undefined : r1 >>> 0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {UnitInterval} pool_pledge_influence
     */
    set_pool_pledge_influence(pool_pledge_influence) {
      _assertClass(pool_pledge_influence, UnitInterval);
      wasm.protocolparamupdate_set_pool_pledge_influence(this.ptr, pool_pledge_influence.ptr);
    }
    /**
     * @returns {UnitInterval | undefined}
     */
    pool_pledge_influence() {
      const ret = wasm.protocolparamupdate_pool_pledge_influence(this.ptr);
      return ret === 0 ? undefined : UnitInterval.__wrap(ret);
    }
    /**
     * @param {UnitInterval} expansion_rate
     */
    set_expansion_rate(expansion_rate) {
      _assertClass(expansion_rate, UnitInterval);
      wasm.protocolparamupdate_set_expansion_rate(this.ptr, expansion_rate.ptr);
    }
    /**
     * @returns {UnitInterval | undefined}
     */
    expansion_rate() {
      const ret = wasm.protocolparamupdate_expansion_rate(this.ptr);
      return ret === 0 ? undefined : UnitInterval.__wrap(ret);
    }
    /**
     * @param {UnitInterval} treasury_growth_rate
     */
    set_treasury_growth_rate(treasury_growth_rate) {
      _assertClass(treasury_growth_rate, UnitInterval);
      wasm.protocolparamupdate_set_treasury_growth_rate(this.ptr, treasury_growth_rate.ptr);
    }
    /**
     * @returns {UnitInterval | undefined}
     */
    treasury_growth_rate() {
      const ret = wasm.protocolparamupdate_treasury_growth_rate(this.ptr);
      return ret === 0 ? undefined : UnitInterval.__wrap(ret);
    }
    /**
     * This parameter is only used in the Alonzo era. Do not set it for other eras.
     * @param {UnitInterval} d
     */
    set_d(d) {
      _assertClass(d, UnitInterval);
      wasm.protocolparamupdate_set_d(this.ptr, d.ptr);
    }
    /**
     * This parameter is only used in the Alonzo era. Do not set it for other eras.
     * @returns {UnitInterval | undefined}
     */
    d() {
      const ret = wasm.protocolparamupdate_d(this.ptr);
      return ret === 0 ? undefined : UnitInterval.__wrap(ret);
    }
    /**
     * This parameter is only used in the Alonzo era. Do not set it for other eras.
     * @param {Nonce} extra_entropy
     */
    set_extra_entropy(extra_entropy) {
      _assertClass(extra_entropy, Nonce);
      wasm.protocolparamupdate_set_extra_entropy(this.ptr, extra_entropy.ptr);
    }
    /**
     * This parameter is only used in the Alonzo era. Do not set it for other eras.
     * @returns {Nonce | undefined}
     */
    extra_entropy() {
      const ret = wasm.protocolparamupdate_extra_entropy(this.ptr);
      return ret === 0 ? undefined : Nonce.__wrap(ret);
    }
    /**
     * @param {ProtocolVersion} protocol_version
     */
    set_protocol_version(protocol_version) {
      _assertClass(protocol_version, ProtocolVersion);
      wasm.protocolparamupdate_set_protocol_version(this.ptr, protocol_version.ptr);
    }
    /**
     * @returns {ProtocolVersion | undefined}
     */
    protocol_version() {
      const ret = wasm.protocolparamupdate_protocol_version(this.ptr);
      return ret === 0 ? undefined : ProtocolVersion.__wrap(ret);
    }
    /**
     * @param {BigNum} min_pool_cost
     */
    set_min_pool_cost(min_pool_cost) {
      _assertClass(min_pool_cost, BigNum);
      wasm.protocolparamupdate_set_min_pool_cost(this.ptr, min_pool_cost.ptr);
    }
    /**
     * @returns {BigNum | undefined}
     */
    min_pool_cost() {
      const ret = wasm.protocolparamupdate_min_pool_cost(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @param {BigNum} ada_per_utxo_byte
     */
    set_ada_per_utxo_byte(ada_per_utxo_byte) {
      _assertClass(ada_per_utxo_byte, BigNum);
      wasm.protocolparamupdate_set_ada_per_utxo_byte(this.ptr, ada_per_utxo_byte.ptr);
    }
    /**
     * @returns {BigNum | undefined}
     */
    ada_per_utxo_byte() {
      const ret = wasm.protocolparamupdate_ada_per_utxo_byte(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @param {Costmdls} cost_models
     */
    set_cost_models(cost_models) {
      _assertClass(cost_models, Costmdls);
      wasm.protocolparamupdate_set_cost_models(this.ptr, cost_models.ptr);
    }
    /**
     * @returns {Costmdls | undefined}
     */
    cost_models() {
      const ret = wasm.protocolparamupdate_cost_models(this.ptr);
      return ret === 0 ? undefined : Costmdls.__wrap(ret);
    }
    /**
     * @param {ExUnitPrices} execution_costs
     */
    set_execution_costs(execution_costs) {
      _assertClass(execution_costs, ExUnitPrices);
      wasm.protocolparamupdate_set_execution_costs(this.ptr, execution_costs.ptr);
    }
    /**
     * @returns {ExUnitPrices | undefined}
     */
    execution_costs() {
      const ret = wasm.protocolparamupdate_execution_costs(this.ptr);
      return ret === 0 ? undefined : ExUnitPrices.__wrap(ret);
    }
    /**
     * @param {ExUnits} max_tx_ex_units
     */
    set_max_tx_ex_units(max_tx_ex_units) {
      _assertClass(max_tx_ex_units, ExUnits);
      wasm.protocolparamupdate_set_max_tx_ex_units(this.ptr, max_tx_ex_units.ptr);
    }
    /**
     * @returns {ExUnits | undefined}
     */
    max_tx_ex_units() {
      const ret = wasm.protocolparamupdate_max_tx_ex_units(this.ptr);
      return ret === 0 ? undefined : ExUnits.__wrap(ret);
    }
    /**
     * @param {ExUnits} max_block_ex_units
     */
    set_max_block_ex_units(max_block_ex_units) {
      _assertClass(max_block_ex_units, ExUnits);
      wasm.protocolparamupdate_set_max_block_ex_units(this.ptr, max_block_ex_units.ptr);
    }
    /**
     * @returns {ExUnits | undefined}
     */
    max_block_ex_units() {
      const ret = wasm.protocolparamupdate_max_block_ex_units(this.ptr);
      return ret === 0 ? undefined : ExUnits.__wrap(ret);
    }
    /**
     * @param {number} max_value_size
     */
    set_max_value_size(max_value_size) {
      wasm.protocolparamupdate_set_max_value_size(this.ptr, max_value_size);
    }
    /**
     * @returns {number | undefined}
     */
    max_value_size() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolparamupdate_max_value_size(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return r0 === 0 ? undefined : r1 >>> 0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {number} collateral_percentage
     */
    set_collateral_percentage(collateral_percentage) {
      wasm.protocolparamupdate_set_collateral_percentage(this.ptr, collateral_percentage);
    }
    /**
     * @returns {number | undefined}
     */
    collateral_percentage() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolparamupdate_collateral_percentage(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return r0 === 0 ? undefined : r1 >>> 0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {number} max_collateral_inputs
     */
    set_max_collateral_inputs(max_collateral_inputs) {
      wasm.protocolparamupdate_set_max_collateral_inputs(this.ptr, max_collateral_inputs);
    }
    /**
     * @returns {number | undefined}
     */
    max_collateral_inputs() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolparamupdate_max_collateral_inputs(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return r0 === 0 ? undefined : r1 >>> 0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {ProtocolParamUpdate}
     */
    static new() {
      const ret = wasm.protocolparamupdate_new();
      return ProtocolParamUpdate.__wrap(ret);
    }
  }
  /**
   */
  class ProtocolVersion {

    static __wrap(ptr) {
      const obj = Object.create(ProtocolVersion.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_protocolversion_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolversion_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ProtocolVersion}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.protocolversion_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ProtocolVersion.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolversion_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.protocolversion_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ProtocolVersion}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.protocolversion_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ProtocolVersion.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {number}
     */
    major() {
      const ret = wasm.protocolversion_major(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    minor() {
      const ret = wasm.protocolversion_minor(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} major
     * @param {number} minor
     * @returns {ProtocolVersion}
     */
    static new(major, minor) {
      const ret = wasm.protocolversion_new(major, minor);
      return ProtocolVersion.__wrap(ret);
    }
  }
  /**
   * ED25519 key used as public key
   */
  class PublicKey {

    static __wrap(ptr) {
      const obj = Object.create(PublicKey.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_publickey_free(ptr);
    }
    /**
     * Get public key from its bech32 representation
     * Example:
     * ```javascript
     * const pkey = PublicKey.from_bech32(&#39;ed25519_pk1dgaagyh470y66p899txcl3r0jaeaxu6yd7z2dxyk55qcycdml8gszkxze2&#39;);
     * ```
     * @param {string} bech32_str
     * @returns {PublicKey}
     */
    static from_bech32(bech32_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech32_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.publickey_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PublicKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_bech32() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.publickey_to_bech32(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    as_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.publickey_as_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {PublicKey}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.publickey_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return PublicKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} data
     * @param {Ed25519Signature} signature
     * @returns {boolean}
     */
    verify(data, signature) {
      const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      _assertClass(signature, Ed25519Signature);
      const ret = wasm.publickey_verify(this.ptr, ptr0, len0, signature.ptr);
      return ret !== 0;
    }
    /**
     * @returns {Ed25519KeyHash}
     */
    hash() {
      const ret = wasm.publickey_hash(this.ptr);
      return Ed25519KeyHash.__wrap(ret);
    }
  }
  /**
   */
  class PublicKeys {

    static __wrap(ptr) {
      const obj = Object.create(PublicKeys.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_publickeys_free(ptr);
    }
    /**
     */
    constructor() {
      const ret = wasm.publickeys_new();
      return PublicKeys.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    size() {
      const ret = wasm.publickeys_size(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {PublicKey}
     */
    get(index) {
      const ret = wasm.publickeys_get(this.ptr, index);
      return PublicKey.__wrap(ret);
    }
    /**
     * @param {PublicKey} key
     */
    add(key) {
      _assertClass(key, PublicKey);
      wasm.publickeys_add(this.ptr, key.ptr);
    }
  }
  /**
   */
  class Redeemer {

    static __wrap(ptr) {
      const obj = Object.create(Redeemer.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_redeemer_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.redeemer_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Redeemer}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.redeemer_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Redeemer.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {RedeemerTag}
     */
    tag() {
      const ret = wasm.redeemer_tag(this.ptr);
      return RedeemerTag.__wrap(ret);
    }
    /**
     * @returns {BigNum}
     */
    index() {
      const ret = wasm.redeemer_index(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @returns {PlutusData}
     */
    data() {
      const ret = wasm.redeemer_data(this.ptr);
      return PlutusData.__wrap(ret);
    }
    /**
     * @returns {ExUnits}
     */
    ex_units() {
      const ret = wasm.redeemer_ex_units(this.ptr);
      return ExUnits.__wrap(ret);
    }
    /**
     * @param {RedeemerTag} tag
     * @param {BigNum} index
     * @param {PlutusData} data
     * @param {ExUnits} ex_units
     * @returns {Redeemer}
     */
    static new(tag, index, data, ex_units) {
      _assertClass(tag, RedeemerTag);
      _assertClass(index, BigNum);
      _assertClass(data, PlutusData);
      _assertClass(ex_units, ExUnits);
      const ret = wasm.redeemer_new(tag.ptr, index.ptr, data.ptr, ex_units.ptr);
      return Redeemer.__wrap(ret);
    }
  }
  /**
   */
  class RedeemerTag {

    static __wrap(ptr) {
      const obj = Object.create(RedeemerTag.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_redeemertag_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.redeemertag_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {RedeemerTag}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.redeemertag_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return RedeemerTag.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {RedeemerTag}
     */
    static new_spend() {
      const ret = wasm.redeemertag_new_spend();
      return RedeemerTag.__wrap(ret);
    }
    /**
     * @returns {RedeemerTag}
     */
    static new_mint() {
      const ret = wasm.redeemertag_new_mint();
      return RedeemerTag.__wrap(ret);
    }
    /**
     * @returns {RedeemerTag}
     */
    static new_cert() {
      const ret = wasm.redeemertag_new_cert();
      return RedeemerTag.__wrap(ret);
    }
    /**
     * @returns {RedeemerTag}
     */
    static new_reward() {
      const ret = wasm.redeemertag_new_reward();
      return RedeemerTag.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.redeemertag_kind(this.ptr);
      return ret >>> 0;
    }
  }
  /**
   */
  class RedeemerWitnessKey {

    static __wrap(ptr) {
      const obj = Object.create(RedeemerWitnessKey.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_redeemerwitnesskey_free(ptr);
    }
    /**
     * @returns {RedeemerTag}
     */
    tag() {
      const ret = wasm.redeemerwitnesskey_tag(this.ptr);
      return RedeemerTag.__wrap(ret);
    }
    /**
     * @returns {BigNum}
     */
    index() {
      const ret = wasm.redeemerwitnesskey_index(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @param {RedeemerTag} tag
     * @param {BigNum} index
     * @returns {RedeemerWitnessKey}
     */
    static new(tag, index) {
      _assertClass(tag, RedeemerTag);
      _assertClass(index, BigNum);
      const ret = wasm.redeemerwitnesskey_new(tag.ptr, index.ptr);
      return RedeemerWitnessKey.__wrap(ret);
    }
  }
  /**
   */
  class Redeemers {

    static __wrap(ptr) {
      const obj = Object.create(Redeemers.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_redeemers_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.redeemers_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Redeemers}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.redeemers_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Redeemers.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Redeemers}
     */
    static new() {
      const ret = wasm.redeemers_new();
      return Redeemers.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.redeemers_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {Redeemer}
     */
    get(index) {
      const ret = wasm.redeemers_get(this.ptr, index);
      return Redeemer.__wrap(ret);
    }
    /**
     * @param {Redeemer} elem
     */
    add(elem) {
      _assertClass(elem, Redeemer);
      wasm.redeemers_add(this.ptr, elem.ptr);
    }
    /**
     * @returns {ExUnits}
     */
    get_total_ex_units() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.redeemers_get_total_ex_units(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ExUnits.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class Relay {

    static __wrap(ptr) {
      const obj = Object.create(Relay.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_relay_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.relay_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Relay}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.relay_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Relay.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.relay_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.relay_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Relay}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.relay_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Relay.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {SingleHostAddr} single_host_addr
     * @returns {Relay}
     */
    static new_single_host_addr(single_host_addr) {
      _assertClass(single_host_addr, SingleHostAddr);
      const ret = wasm.relay_new_single_host_addr(single_host_addr.ptr);
      return Relay.__wrap(ret);
    }
    /**
     * @param {SingleHostName} single_host_name
     * @returns {Relay}
     */
    static new_single_host_name(single_host_name) {
      _assertClass(single_host_name, SingleHostName);
      const ret = wasm.relay_new_single_host_name(single_host_name.ptr);
      return Relay.__wrap(ret);
    }
    /**
     * @param {MultiHostName} multi_host_name
     * @returns {Relay}
     */
    static new_multi_host_name(multi_host_name) {
      _assertClass(multi_host_name, MultiHostName);
      const ret = wasm.relay_new_multi_host_name(multi_host_name.ptr);
      return Relay.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.relay_kind(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {SingleHostAddr | undefined}
     */
    as_single_host_addr() {
      const ret = wasm.relay_as_single_host_addr(this.ptr);
      return ret === 0 ? undefined : SingleHostAddr.__wrap(ret);
    }
    /**
     * @returns {SingleHostName | undefined}
     */
    as_single_host_name() {
      const ret = wasm.relay_as_single_host_name(this.ptr);
      return ret === 0 ? undefined : SingleHostName.__wrap(ret);
    }
    /**
     * @returns {MultiHostName | undefined}
     */
    as_multi_host_name() {
      const ret = wasm.relay_as_multi_host_name(this.ptr);
      return ret === 0 ? undefined : MultiHostName.__wrap(ret);
    }
  }
  /**
   */
  class Relays {

    static __wrap(ptr) {
      const obj = Object.create(Relays.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_relays_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.relays_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Relays}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.relays_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Relays.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.relays_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.relays_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Relays}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.relays_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Relays.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Relays}
     */
    static new() {
      const ret = wasm.relays_new();
      return Relays.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.relays_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {Relay}
     */
    get(index) {
      const ret = wasm.relays_get(this.ptr, index);
      return Relay.__wrap(ret);
    }
    /**
     * @param {Relay} elem
     */
    add(elem) {
      _assertClass(elem, Relay);
      wasm.relays_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class RequiredWitnessSet {

    static __wrap(ptr) {
      const obj = Object.create(RequiredWitnessSet.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_requiredwitnessset_free(ptr);
    }
    /**
     * @param {Vkeywitness} vkey
     */
    add_vkey(vkey) {
      _assertClass(vkey, Vkeywitness);
      wasm.requiredwitnessset_add_vkey(this.ptr, vkey.ptr);
    }
    /**
     * @param {Vkey} vkey
     */
    add_vkey_key(vkey) {
      _assertClass(vkey, Vkey);
      wasm.requiredwitnessset_add_vkey_key(this.ptr, vkey.ptr);
    }
    /**
     * @param {Ed25519KeyHash} hash
     */
    add_vkey_key_hash(hash) {
      _assertClass(hash, Ed25519KeyHash);
      wasm.requiredwitnessset_add_vkey_key_hash(this.ptr, hash.ptr);
    }
    /**
     * @param {ByronAddress} address
     */
    add_bootstrap(address) {
      _assertClass(address, ByronAddress);
      wasm.requiredwitnessset_add_bootstrap(this.ptr, address.ptr);
    }
    /**
     * @param {ScriptHash} script_hash
     */
    add_script_ref(script_hash) {
      _assertClass(script_hash, ScriptHash);
      wasm.requiredwitnessset_add_script_ref(this.ptr, script_hash.ptr);
    }
    /**
     * @param {NativeScript} native_script
     */
    add_native_script(native_script) {
      _assertClass(native_script, NativeScript);
      wasm.requiredwitnessset_add_native_script(this.ptr, native_script.ptr);
    }
    /**
     * @param {ScriptHash} script_hash
     */
    add_script_hash(script_hash) {
      _assertClass(script_hash, ScriptHash);
      wasm.requiredwitnessset_add_script_hash(this.ptr, script_hash.ptr);
    }
    /**
     * @param {PlutusScript} plutus_v1_script
     */
    add_plutus_script(plutus_v1_script) {
      _assertClass(plutus_v1_script, PlutusScript);
      wasm.requiredwitnessset_add_plutus_script(this.ptr, plutus_v1_script.ptr);
    }
    /**
     * @param {PlutusData} plutus_datum
     */
    add_plutus_datum(plutus_datum) {
      _assertClass(plutus_datum, PlutusData);
      wasm.requiredwitnessset_add_plutus_datum(this.ptr, plutus_datum.ptr);
    }
    /**
     * @param {DataHash} plutus_datum
     */
    add_plutus_datum_hash(plutus_datum) {
      _assertClass(plutus_datum, DataHash);
      wasm.requiredwitnessset_add_plutus_datum_hash(this.ptr, plutus_datum.ptr);
    }
    /**
     * @param {Redeemer} redeemer
     */
    add_redeemer(redeemer) {
      _assertClass(redeemer, Redeemer);
      wasm.requiredwitnessset_add_redeemer(this.ptr, redeemer.ptr);
    }
    /**
     * @param {RedeemerWitnessKey} redeemer
     */
    add_redeemer_tag(redeemer) {
      _assertClass(redeemer, RedeemerWitnessKey);
      wasm.requiredwitnessset_add_redeemer_tag(this.ptr, redeemer.ptr);
    }
    /**
     * @param {RequiredWitnessSet} requirements
     */
    add_all(requirements) {
      _assertClass(requirements, RequiredWitnessSet);
      wasm.requiredwitnessset_add_all(this.ptr, requirements.ptr);
    }
    /**
     * @returns {RequiredWitnessSet}
     */
    static new() {
      const ret = wasm.requiredwitnessset_new();
      return RequiredWitnessSet.__wrap(ret);
    }
  }
  /**
   */
  class RewardAddress {

    static __wrap(ptr) {
      const obj = Object.create(RewardAddress.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_rewardaddress_free(ptr);
    }
    /**
     * @param {number} network
     * @param {StakeCredential} payment
     * @returns {RewardAddress}
     */
    static new(network, payment) {
      _assertClass(payment, StakeCredential);
      const ret = wasm.rewardaddress_new(network, payment.ptr);
      return RewardAddress.__wrap(ret);
    }
    /**
     * @returns {StakeCredential}
     */
    payment_cred() {
      const ret = wasm.rewardaddress_payment_cred(this.ptr);
      return StakeCredential.__wrap(ret);
    }
    /**
     * @returns {Address}
     */
    to_address() {
      const ret = wasm.rewardaddress_to_address(this.ptr);
      return Address.__wrap(ret);
    }
    /**
     * @param {Address} addr
     * @returns {RewardAddress | undefined}
     */
    static from_address(addr) {
      _assertClass(addr, Address);
      const ret = wasm.rewardaddress_from_address(addr.ptr);
      return ret === 0 ? undefined : RewardAddress.__wrap(ret);
    }
  }
  /**
   */
  class RewardAddresses {

    static __wrap(ptr) {
      const obj = Object.create(RewardAddresses.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_rewardaddresses_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.rewardaddresses_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {RewardAddresses}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.rewardaddresses_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return RewardAddresses.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.rewardaddresses_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.rewardaddresses_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {RewardAddresses}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.rewardaddresses_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return RewardAddresses.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {RewardAddresses}
     */
    static new() {
      const ret = wasm.rewardaddresses_new();
      return RewardAddresses.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.rewardaddresses_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {RewardAddress}
     */
    get(index) {
      const ret = wasm.rewardaddresses_get(this.ptr, index);
      return RewardAddress.__wrap(ret);
    }
    /**
     * @param {RewardAddress} elem
     */
    add(elem) {
      _assertClass(elem, RewardAddress);
      wasm.rewardaddresses_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class Script {

    static __wrap(ptr) {
      const obj = Object.create(Script.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_script_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.script_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Script}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.script_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Script.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.script_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.script_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Script}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.script_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Script.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {NativeScript} native_script
     * @returns {Script}
     */
    static new_native(native_script) {
      _assertClass(native_script, NativeScript);
      const ret = wasm.script_new_native(native_script.ptr);
      return Script.__wrap(ret);
    }
    /**
     * @param {PlutusV1Script} plutus_script
     * @returns {Script}
     */
    static new_plutus_v1(plutus_script) {
      _assertClass(plutus_script, PlutusV1Script);
      const ret = wasm.script_new_plutus_v1(plutus_script.ptr);
      return Script.__wrap(ret);
    }
    /**
     * @param {PlutusV2Script} plutus_script
     * @returns {Script}
     */
    static new_plutus_v2(plutus_script) {
      _assertClass(plutus_script, PlutusV2Script);
      const ret = wasm.script_new_plutus_v2(plutus_script.ptr);
      return Script.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.script_kind(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {NativeScript | undefined}
     */
    as_native() {
      const ret = wasm.script_as_native(this.ptr);
      return ret === 0 ? undefined : NativeScript.__wrap(ret);
    }
    /**
     * @returns {PlutusV1Script | undefined}
     */
    as_plutus_v1() {
      const ret = wasm.script_as_plutus_v1(this.ptr);
      return ret === 0 ? undefined : PlutusV1Script.__wrap(ret);
    }
    /**
     * @returns {PlutusV2Script | undefined}
     */
    as_plutus_v2() {
      const ret = wasm.script_as_plutus_v2(this.ptr);
      return ret === 0 ? undefined : PlutusV2Script.__wrap(ret);
    }
    /**
     * @returns {ScriptHash}
     */
    hash() {
      const ret = wasm.script_hash(this.ptr);
      return ScriptHash.__wrap(ret);
    }
  }
  /**
   */
  class ScriptAll {

    static __wrap(ptr) {
      const obj = Object.create(ScriptAll.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_scriptall_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptall_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ScriptAll}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptall_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptAll.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptall_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptall_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ScriptAll}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptall_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptAll.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {NativeScripts}
     */
    native_scripts() {
      const ret = wasm.scriptall_native_scripts(this.ptr);
      return NativeScripts.__wrap(ret);
    }
    /**
     * @param {NativeScripts} native_scripts
     * @returns {ScriptAll}
     */
    static new(native_scripts) {
      _assertClass(native_scripts, NativeScripts);
      const ret = wasm.scriptall_new(native_scripts.ptr);
      return ScriptAll.__wrap(ret);
    }
  }
  /**
   */
  class ScriptAny {

    static __wrap(ptr) {
      const obj = Object.create(ScriptAny.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_scriptany_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptany_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ScriptAny}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptany_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptAny.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptany_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptany_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ScriptAny}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptany_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptAny.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {NativeScripts}
     */
    native_scripts() {
      const ret = wasm.scriptany_native_scripts(this.ptr);
      return NativeScripts.__wrap(ret);
    }
    /**
     * @param {NativeScripts} native_scripts
     * @returns {ScriptAny}
     */
    static new(native_scripts) {
      _assertClass(native_scripts, NativeScripts);
      const ret = wasm.scriptany_new(native_scripts.ptr);
      return ScriptAny.__wrap(ret);
    }
  }
  /**
   */
  class ScriptDataHash {

    static __wrap(ptr) {
      const obj = Object.create(ScriptDataHash.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_scriptdatahash_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ScriptDataHash}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptdatahash_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptDataHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptdatahash_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptdatahash_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {ScriptDataHash}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptdatahash_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptDataHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptdatahash_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {ScriptDataHash}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptdatahash_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptDataHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class ScriptHash {

    static __wrap(ptr) {
      const obj = Object.create(ScriptHash.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_scripthash_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ScriptHash}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scripthash_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scripthash_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scripthash_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {ScriptHash}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scripthash_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scripthash_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {ScriptHash}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scripthash_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class ScriptHashes {

    static __wrap(ptr) {
      const obj = Object.create(ScriptHashes.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_scripthashes_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scripthashes_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ScriptHashes}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scripthashes_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptHashes.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scripthashes_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scripthashes_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ScriptHashes}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scripthashes_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptHashes.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {ScriptHashes}
     */
    static new() {
      const ret = wasm.scripthashes_new();
      return ScriptHashes.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.scripthashes_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {ScriptHash}
     */
    get(index) {
      const ret = wasm.scripthashes_get(this.ptr, index);
      return ScriptHash.__wrap(ret);
    }
    /**
     * @param {ScriptHash} elem
     */
    add(elem) {
      _assertClass(elem, ScriptHash);
      wasm.scripthashes_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class ScriptNOfK {

    static __wrap(ptr) {
      const obj = Object.create(ScriptNOfK.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_scriptnofk_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptnofk_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ScriptNOfK}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptnofk_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptNOfK.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptnofk_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptnofk_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ScriptNOfK}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptnofk_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptNOfK.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {number}
     */
    n() {
      const ret = wasm.scriptnofk_n(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {NativeScripts}
     */
    native_scripts() {
      const ret = wasm.scriptnofk_native_scripts(this.ptr);
      return NativeScripts.__wrap(ret);
    }
    /**
     * @param {number} n
     * @param {NativeScripts} native_scripts
     * @returns {ScriptNOfK}
     */
    static new(n, native_scripts) {
      _assertClass(native_scripts, NativeScripts);
      const ret = wasm.scriptnofk_new(n, native_scripts.ptr);
      return ScriptNOfK.__wrap(ret);
    }
  }
  /**
   */
  class ScriptPubkey {

    static __wrap(ptr) {
      const obj = Object.create(ScriptPubkey.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_scriptpubkey_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptpubkey_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ScriptPubkey}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptpubkey_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptPubkey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptpubkey_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptpubkey_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ScriptPubkey}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptpubkey_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptPubkey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Ed25519KeyHash}
     */
    addr_keyhash() {
      const ret = wasm.scriptpubkey_addr_keyhash(this.ptr);
      return Ed25519KeyHash.__wrap(ret);
    }
    /**
     * @param {Ed25519KeyHash} addr_keyhash
     * @returns {ScriptPubkey}
     */
    static new(addr_keyhash) {
      _assertClass(addr_keyhash, Ed25519KeyHash);
      const ret = wasm.scriptpubkey_new(addr_keyhash.ptr);
      return ScriptPubkey.__wrap(ret);
    }
  }
  /**
   */
  class ScriptRef {

    static __wrap(ptr) {
      const obj = Object.create(ScriptRef.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_scriptref_free(ptr);
    }
    /**
     * @param {Script} script
     * @returns {ScriptRef}
     */
    static new(script) {
      _assertClass(script, Script);
      const ret = wasm.scriptref_new(script.ptr);
      return ScriptRef.__wrap(ret);
    }
    /**
     * @returns {Script}
     */
    script() {
      const ret = wasm.scriptref_script(this.ptr);
      return Script.__wrap(ret);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptref_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {ScriptRef}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptref_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptRef.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptref_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.scriptref_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {ScriptRef}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scriptref_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return ScriptRef.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class SignedTxBuilder {

    static __wrap(ptr) {
      const obj = Object.create(SignedTxBuilder.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_signedtxbuilder_free(ptr);
    }
    /**
     * @param {TransactionBody} body
     * @param {TransactionWitnessSetBuilder} witness_set
     * @param {boolean} is_valid
     * @param {AuxiliaryData} auxiliary_data
     * @returns {SignedTxBuilder}
     */
    static new_with_data(body, witness_set, is_valid, auxiliary_data) {
      _assertClass(body, TransactionBody);
      _assertClass(witness_set, TransactionWitnessSetBuilder);
      _assertClass(auxiliary_data, AuxiliaryData);
      const ret = wasm.signedtxbuilder_new_with_data(body.ptr, witness_set.ptr, is_valid, auxiliary_data.ptr);
      return SignedTxBuilder.__wrap(ret);
    }
    /**
     * @param {TransactionBody} body
     * @param {TransactionWitnessSetBuilder} witness_set
     * @param {boolean} is_valid
     * @returns {SignedTxBuilder}
     */
    static new_without_data(body, witness_set, is_valid) {
      _assertClass(body, TransactionBody);
      _assertClass(witness_set, TransactionWitnessSetBuilder);
      const ret = wasm.signedtxbuilder_new_without_data(body.ptr, witness_set.ptr, is_valid);
      return SignedTxBuilder.__wrap(ret);
    }
    /**
     * @returns {Transaction}
     */
    build_checked() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.signedtxbuilder_build_checked(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Transaction.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Transaction}
     */
    build_unchecked() {
      const ret = wasm.signedtxbuilder_build_unchecked(this.ptr);
      return Transaction.__wrap(ret);
    }
    /**
     * @param {Vkeywitness} vkey
     */
    add_vkey(vkey) {
      _assertClass(vkey, Vkeywitness);
      wasm.signedtxbuilder_add_vkey(this.ptr, vkey.ptr);
    }
    /**
     * @param {BootstrapWitness} bootstrap
     */
    add_bootstrap(bootstrap) {
      _assertClass(bootstrap, BootstrapWitness);
      wasm.signedtxbuilder_add_bootstrap(this.ptr, bootstrap.ptr);
    }
    /**
     * @returns {TransactionBody}
     */
    body() {
      const ret = wasm.signedtxbuilder_body(this.ptr);
      return TransactionBody.__wrap(ret);
    }
    /**
     * @returns {TransactionWitnessSetBuilder}
     */
    witness_set() {
      const ret = wasm.signedtxbuilder_witness_set(this.ptr);
      return TransactionWitnessSetBuilder.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    is_valid() {
      const ret = wasm.signedtxbuilder_is_valid(this.ptr);
      return ret !== 0;
    }
    /**
     * @returns {AuxiliaryData | undefined}
     */
    auxiliary_data() {
      const ret = wasm.signedtxbuilder_auxiliary_data(this.ptr);
      return ret === 0 ? undefined : AuxiliaryData.__wrap(ret);
    }
  }
  /**
   */
  class SingleCertificateBuilder {

    static __wrap(ptr) {
      const obj = Object.create(SingleCertificateBuilder.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_singlecertificatebuilder_free(ptr);
    }
    /**
     * @param {Certificate} cert
     * @returns {SingleCertificateBuilder}
     */
    static new(cert) {
      _assertClass(cert, Certificate);
      const ret = wasm.singlecertificatebuilder_new(cert.ptr);
      return SingleCertificateBuilder.__wrap(ret);
    }
    /**
     * note: particularly useful for StakeRegistration which doesn't require witnessing
     * @returns {CertificateBuilderResult}
     */
    skip_witness() {
      const ret = wasm.singlecertificatebuilder_skip_witness(this.ptr);
      return CertificateBuilderResult.__wrap(ret);
    }
    /**
     * @returns {CertificateBuilderResult}
     */
    payment_key() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.singlecertificatebuilder_payment_key(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return CertificateBuilderResult.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * Signer keys don't have to be set. You can leave it empty and then add the required witnesses later
     * @param {NativeScript} native_script
     * @param {NativeScriptWitnessInfo} witness_info
     * @returns {CertificateBuilderResult}
     */
    native_script(native_script, witness_info) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(native_script, NativeScript);
        _assertClass(witness_info, NativeScriptWitnessInfo);
        wasm.singlecertificatebuilder_native_script(retptr, this.ptr, native_script.ptr, witness_info.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return CertificateBuilderResult.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {PartialPlutusWitness} partial_witness
     * @param {Ed25519KeyHashes} required_signers
     * @returns {CertificateBuilderResult}
     */
    plutus_script(partial_witness, required_signers) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(partial_witness, PartialPlutusWitness);
        _assertClass(required_signers, Ed25519KeyHashes);
        wasm.singlecertificatebuilder_plutus_script(retptr, this.ptr, partial_witness.ptr, required_signers.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return CertificateBuilderResult.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class SingleHostAddr {

    static __wrap(ptr) {
      const obj = Object.create(SingleHostAddr.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_singlehostaddr_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.singlehostaddr_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {SingleHostAddr}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.singlehostaddr_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SingleHostAddr.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.singlehostaddr_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.singlehostaddr_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {SingleHostAddr}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.singlehostaddr_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SingleHostAddr.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {number | undefined}
     */
    port() {
      const ret = wasm.singlehostaddr_port(this.ptr);
      return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @returns {Ipv4 | undefined}
     */
    ipv4() {
      const ret = wasm.singlehostaddr_ipv4(this.ptr);
      return ret === 0 ? undefined : Ipv4.__wrap(ret);
    }
    /**
     * @returns {Ipv6 | undefined}
     */
    ipv6() {
      const ret = wasm.singlehostaddr_ipv6(this.ptr);
      return ret === 0 ? undefined : Ipv6.__wrap(ret);
    }
    /**
     * @param {number | undefined} port
     * @param {Ipv4 | undefined} ipv4
     * @param {Ipv6 | undefined} ipv6
     * @returns {SingleHostAddr}
     */
    static new(port, ipv4, ipv6) {
      let ptr0 = 0;
      if (!isLikeNone(ipv4)) {
        _assertClass(ipv4, Ipv4);
        ptr0 = ipv4.ptr;
        ipv4.ptr = 0;
      }
      let ptr1 = 0;
      if (!isLikeNone(ipv6)) {
        _assertClass(ipv6, Ipv6);
        ptr1 = ipv6.ptr;
        ipv6.ptr = 0;
      }
      const ret = wasm.singlehostaddr_new(isLikeNone(port) ? 0xFFFFFF : port, ptr0, ptr1);
      return SingleHostAddr.__wrap(ret);
    }
  }
  /**
   */
  class SingleHostName {

    static __wrap(ptr) {
      const obj = Object.create(SingleHostName.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_singlehostname_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.singlehostname_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {SingleHostName}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.singlehostname_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SingleHostName.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.singlehostname_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.singlehostname_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {SingleHostName}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.singlehostname_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SingleHostName.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {number | undefined}
     */
    port() {
      const ret = wasm.singlehostname_port(this.ptr);
      return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * @returns {DNSRecordAorAAAA}
     */
    dns_name() {
      const ret = wasm.singlehostname_dns_name(this.ptr);
      return DNSRecordAorAAAA.__wrap(ret);
    }
    /**
     * @param {number | undefined} port
     * @param {DNSRecordAorAAAA} dns_name
     * @returns {SingleHostName}
     */
    static new(port, dns_name) {
      _assertClass(dns_name, DNSRecordAorAAAA);
      const ret = wasm.singlehostname_new(isLikeNone(port) ? 0xFFFFFF : port, dns_name.ptr);
      return SingleHostName.__wrap(ret);
    }
  }
  /**
   */
  class SingleInputBuilder {

    static __wrap(ptr) {
      const obj = Object.create(SingleInputBuilder.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_singleinputbuilder_free(ptr);
    }
    /**
     * @param {TransactionInput} input
     * @param {TransactionOutput} utxo_info
     * @returns {SingleInputBuilder}
     */
    static new(input, utxo_info) {
      _assertClass(input, TransactionInput);
      _assertClass(utxo_info, TransactionOutput);
      const ret = wasm.singleinputbuilder_new(input.ptr, utxo_info.ptr);
      return SingleInputBuilder.__wrap(ret);
    }
    /**
     * @returns {InputBuilderResult}
     */
    payment_key() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.singleinputbuilder_payment_key(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return InputBuilderResult.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {NativeScript} native_script
     * @param {NativeScriptWitnessInfo} witness_info
     * @returns {InputBuilderResult}
     */
    native_script(native_script, witness_info) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(native_script, NativeScript);
        _assertClass(witness_info, NativeScriptWitnessInfo);
        wasm.singleinputbuilder_native_script(retptr, this.ptr, native_script.ptr, witness_info.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return InputBuilderResult.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {PartialPlutusWitness} partial_witness
     * @param {Ed25519KeyHashes} required_signers
     * @param {PlutusData} datum
     * @returns {InputBuilderResult}
     */
    plutus_script(partial_witness, required_signers, datum) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(partial_witness, PartialPlutusWitness);
        _assertClass(required_signers, Ed25519KeyHashes);
        _assertClass(datum, PlutusData);
        wasm.singleinputbuilder_plutus_script(retptr, this.ptr, partial_witness.ptr, required_signers.ptr, datum.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return InputBuilderResult.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class SingleKeyDistr {

    static __wrap(ptr) {
      const obj = Object.create(SingleKeyDistr.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_singlekeydistr_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.singlekeydistr_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {SingleKeyDistr}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.singlekeydistr_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SingleKeyDistr.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.singlekeydistr_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.singlekeydistr_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {SingleKeyDistr}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.singlekeydistr_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SingleKeyDistr.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {StakeholderId}
     */
    stakeholder_id() {
      const ret = wasm.singlekeydistr_stakeholder_id(this.ptr);
      return StakeholderId.__wrap(ret);
    }
    /**
     * @param {StakeholderId} stakeholder_id
     * @returns {SingleKeyDistr}
     */
    static new(stakeholder_id) {
      _assertClass(stakeholder_id, StakeholderId);
      const ret = wasm.singlekeydistr_new(stakeholder_id.ptr);
      return SingleKeyDistr.__wrap(ret);
    }
  }
  /**
   */
  class SingleMintBuilder {

    static __wrap(ptr) {
      const obj = Object.create(SingleMintBuilder.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_singlemintbuilder_free(ptr);
    }
    /**
     * @param {MintAssets} assets
     * @returns {SingleMintBuilder}
     */
    static new(assets) {
      _assertClass(assets, MintAssets);
      const ret = wasm.singlemintbuilder_new(assets.ptr);
      return SingleMintBuilder.__wrap(ret);
    }
    /**
     * @param {NativeScript} native_script
     * @param {NativeScriptWitnessInfo} witness_info
     * @returns {MintBuilderResult}
     */
    native_script(native_script, witness_info) {
      _assertClass(native_script, NativeScript);
      _assertClass(witness_info, NativeScriptWitnessInfo);
      const ret = wasm.singlemintbuilder_native_script(this.ptr, native_script.ptr, witness_info.ptr);
      return MintBuilderResult.__wrap(ret);
    }
    /**
     * @param {PartialPlutusWitness} partial_witness
     * @param {Ed25519KeyHashes} required_signers
     * @returns {MintBuilderResult}
     */
    plutus_script(partial_witness, required_signers) {
      _assertClass(partial_witness, PartialPlutusWitness);
      _assertClass(required_signers, Ed25519KeyHashes);
      const ret = wasm.singlemintbuilder_plutus_script(this.ptr, partial_witness.ptr, required_signers.ptr);
      return MintBuilderResult.__wrap(ret);
    }
  }
  /**
   */
  class SingleOutputBuilderResult {

    static __wrap(ptr) {
      const obj = Object.create(SingleOutputBuilderResult.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_singleoutputbuilderresult_free(ptr);
    }
    /**
     * @param {TransactionOutput} output
     * @returns {SingleOutputBuilderResult}
     */
    static new(output) {
      _assertClass(output, TransactionOutput);
      const ret = wasm.singleoutputbuilderresult_new(output.ptr);
      return SingleOutputBuilderResult.__wrap(ret);
    }
    /**
     * @param {PlutusData} datum
     */
    set_communication_datum(datum) {
      _assertClass(datum, PlutusData);
      wasm.singleoutputbuilderresult_set_communication_datum(this.ptr, datum.ptr);
    }
    /**
     * @returns {TransactionOutput}
     */
    output() {
      const ret = wasm.singleoutputbuilderresult_output(this.ptr);
      return TransactionOutput.__wrap(ret);
    }
    /**
     * @returns {PlutusData | undefined}
     */
    communication_datum() {
      const ret = wasm.singleoutputbuilderresult_communication_datum(this.ptr);
      return ret === 0 ? undefined : PlutusData.__wrap(ret);
    }
  }
  /**
   */
  class SingleWithdrawalBuilder {

    static __wrap(ptr) {
      const obj = Object.create(SingleWithdrawalBuilder.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_singlewithdrawalbuilder_free(ptr);
    }
    /**
     * @param {RewardAddress} address
     * @param {BigNum} amount
     * @returns {SingleWithdrawalBuilder}
     */
    static new(address, amount) {
      _assertClass(address, RewardAddress);
      _assertClass(amount, BigNum);
      const ret = wasm.singlewithdrawalbuilder_new(address.ptr, amount.ptr);
      return SingleWithdrawalBuilder.__wrap(ret);
    }
    /**
     * @returns {WithdrawalBuilderResult}
     */
    payment_key() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.singlewithdrawalbuilder_payment_key(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return WithdrawalBuilderResult.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {NativeScript} native_script
     * @param {NativeScriptWitnessInfo} witness_info
     * @returns {WithdrawalBuilderResult}
     */
    native_script(native_script, witness_info) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(native_script, NativeScript);
        _assertClass(witness_info, NativeScriptWitnessInfo);
        wasm.singlewithdrawalbuilder_native_script(retptr, this.ptr, native_script.ptr, witness_info.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return WithdrawalBuilderResult.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {PartialPlutusWitness} partial_witness
     * @param {Ed25519KeyHashes} required_signers
     * @returns {WithdrawalBuilderResult}
     */
    plutus_script(partial_witness, required_signers) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(partial_witness, PartialPlutusWitness);
        _assertClass(required_signers, Ed25519KeyHashes);
        wasm.singlewithdrawalbuilder_plutus_script(retptr, this.ptr, partial_witness.ptr, required_signers.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return WithdrawalBuilderResult.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class SpendingData {

    static __wrap(ptr) {
      const obj = Object.create(SpendingData.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_spendingdata_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.spendingdata_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {SpendingData}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.spendingdata_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SpendingData.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.spendingdata_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.spendingdata_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {SpendingData}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.spendingdata_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SpendingData.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Bip32PublicKey} public_ed25519_bip32
     * @returns {SpendingData}
     */
    static new_spending_data_pub_key(public_ed25519_bip32) {
      _assertClass(public_ed25519_bip32, Bip32PublicKey);
      const ret = wasm.spendingdata_new_spending_data_pub_key(public_ed25519_bip32.ptr);
      return SpendingData.__wrap(ret);
    }
    /**
     * @param {ByronScript} script
     * @returns {SpendingData}
     */
    static new_spending_data_script(script) {
      _assertClass(script, ByronScript);
      const ret = wasm.spendingdata_new_spending_data_script(script.ptr);
      return SpendingData.__wrap(ret);
    }
    /**
     * @param {PublicKey} public_ed25519
     * @returns {SpendingData}
     */
    static new_spending_data_redeem(public_ed25519) {
      _assertClass(public_ed25519, PublicKey);
      const ret = wasm.spendingdata_new_spending_data_redeem(public_ed25519.ptr);
      return SpendingData.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.spendingdata_kind(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {SpendingDataPubKeyASD | undefined}
     */
    as_spending_data_pub_key() {
      const ret = wasm.spendingdata_as_spending_data_pub_key(this.ptr);
      return ret === 0 ? undefined : SpendingDataPubKeyASD.__wrap(ret);
    }
    /**
     * @returns {SpendingDataScriptASD | undefined}
     */
    as_spending_data_script() {
      const ret = wasm.spendingdata_as_spending_data_script(this.ptr);
      return ret === 0 ? undefined : SpendingDataScriptASD.__wrap(ret);
    }
    /**
     * @returns {SpendingDataRedeemASD | undefined}
     */
    as_spending_data_redeem() {
      const ret = wasm.spendingdata_as_spending_data_redeem(this.ptr);
      return ret === 0 ? undefined : SpendingDataRedeemASD.__wrap(ret);
    }
  }
  /**
   */
  class SpendingDataPubKeyASD {

    static __wrap(ptr) {
      const obj = Object.create(SpendingDataPubKeyASD.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_spendingdatapubkeyasd_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.spendingdatapubkeyasd_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {SpendingDataPubKeyASD}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.spendingdatapubkeyasd_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SpendingDataPubKeyASD.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.spendingdatapubkeyasd_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.spendingdatapubkeyasd_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {SpendingDataPubKeyASD}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.spendingdatapubkeyasd_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SpendingDataPubKeyASD.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Bip32PublicKey}
     */
    public_ed25519_bip32() {
      const ret = wasm.spendingdatapubkeyasd_public_ed25519_bip32(this.ptr);
      return Bip32PublicKey.__wrap(ret);
    }
    /**
     * @param {Bip32PublicKey} public_ed25519_bip32
     * @returns {SpendingDataPubKeyASD}
     */
    static new(public_ed25519_bip32) {
      _assertClass(public_ed25519_bip32, Bip32PublicKey);
      const ret = wasm.spendingdatapubkeyasd_new(public_ed25519_bip32.ptr);
      return SpendingDataPubKeyASD.__wrap(ret);
    }
  }
  /**
   */
  class SpendingDataRedeemASD {

    static __wrap(ptr) {
      const obj = Object.create(SpendingDataRedeemASD.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_spendingdataredeemasd_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.spendingdataredeemasd_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {SpendingDataRedeemASD}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.spendingdataredeemasd_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SpendingDataRedeemASD.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.spendingdataredeemasd_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.spendingdataredeemasd_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {SpendingDataRedeemASD}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.spendingdataredeemasd_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SpendingDataRedeemASD.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {PublicKey}
     */
    public_ed25519() {
      const ret = wasm.spendingdataredeemasd_public_ed25519(this.ptr);
      return PublicKey.__wrap(ret);
    }
    /**
     * @param {PublicKey} public_ed25519
     * @returns {SpendingDataRedeemASD}
     */
    static new(public_ed25519) {
      _assertClass(public_ed25519, PublicKey);
      const ret = wasm.spendingdataredeemasd_new(public_ed25519.ptr);
      return SpendingDataRedeemASD.__wrap(ret);
    }
  }
  /**
   */
  class SpendingDataScriptASD {

    static __wrap(ptr) {
      const obj = Object.create(SpendingDataScriptASD.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_spendingdatascriptasd_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.spendingdatascriptasd_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {SpendingDataScriptASD}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.spendingdatascriptasd_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SpendingDataScriptASD.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.spendingdatascriptasd_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.spendingdatascriptasd_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {SpendingDataScriptASD}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.spendingdatascriptasd_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SpendingDataScriptASD.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {ByronScript}
     */
    script() {
      const ret = wasm.spendingdatascriptasd_script(this.ptr);
      return ByronScript.__wrap(ret);
    }
    /**
     * @param {ByronScript} script
     * @returns {SpendingDataScriptASD}
     */
    static new(script) {
      _assertClass(script, ByronScript);
      const ret = wasm.spendingdatascriptasd_new(script.ptr);
      return SpendingDataScriptASD.__wrap(ret);
    }
  }
  /**
   */
  class StakeCredential {

    static __wrap(ptr) {
      const obj = Object.create(StakeCredential.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_stakecredential_free(ptr);
    }
    /**
     * @param {Ed25519KeyHash} hash
     * @returns {StakeCredential}
     */
    static from_keyhash(hash) {
      _assertClass(hash, Ed25519KeyHash);
      const ret = wasm.stakecredential_from_keyhash(hash.ptr);
      return StakeCredential.__wrap(ret);
    }
    /**
     * @param {ScriptHash} hash
     * @returns {StakeCredential}
     */
    static from_scripthash(hash) {
      _assertClass(hash, ScriptHash);
      const ret = wasm.stakecredential_from_scripthash(hash.ptr);
      return StakeCredential.__wrap(ret);
    }
    /**
     * @returns {Ed25519KeyHash | undefined}
     */
    to_keyhash() {
      const ret = wasm.stakecredential_to_keyhash(this.ptr);
      return ret === 0 ? undefined : Ed25519KeyHash.__wrap(ret);
    }
    /**
     * @returns {ScriptHash | undefined}
     */
    to_scripthash() {
      const ret = wasm.stakecredential_to_scripthash(this.ptr);
      return ret === 0 ? undefined : ScriptHash.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.stakecredential_kind(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakecredential_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {StakeCredential}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakecredential_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeCredential.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakecredential_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakecredential_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {StakeCredential}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakecredential_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeCredential.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class StakeCredentials {

    static __wrap(ptr) {
      const obj = Object.create(StakeCredentials.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_stakecredentials_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakecredentials_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {StakeCredentials}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakecredentials_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeCredentials.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakecredentials_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakecredentials_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {StakeCredentials}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakecredentials_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeCredentials.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {StakeCredentials}
     */
    static new() {
      const ret = wasm.stakecredentials_new();
      return StakeCredentials.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.stakecredentials_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {StakeCredential}
     */
    get(index) {
      const ret = wasm.stakecredentials_get(this.ptr, index);
      return StakeCredential.__wrap(ret);
    }
    /**
     * @param {StakeCredential} elem
     */
    add(elem) {
      _assertClass(elem, StakeCredential);
      wasm.stakecredentials_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class StakeDelegation {

    static __wrap(ptr) {
      const obj = Object.create(StakeDelegation.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_stakedelegation_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakedelegation_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {StakeDelegation}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakedelegation_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeDelegation.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakedelegation_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakedelegation_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {StakeDelegation}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakedelegation_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeDelegation.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {StakeCredential}
     */
    stake_credential() {
      const ret = wasm.stakedelegation_stake_credential(this.ptr);
      return StakeCredential.__wrap(ret);
    }
    /**
     * @returns {Ed25519KeyHash}
     */
    pool_keyhash() {
      const ret = wasm.stakedelegation_pool_keyhash(this.ptr);
      return Ed25519KeyHash.__wrap(ret);
    }
    /**
     * @param {StakeCredential} stake_credential
     * @param {Ed25519KeyHash} pool_keyhash
     * @returns {StakeDelegation}
     */
    static new(stake_credential, pool_keyhash) {
      _assertClass(stake_credential, StakeCredential);
      _assertClass(pool_keyhash, Ed25519KeyHash);
      const ret = wasm.stakedelegation_new(stake_credential.ptr, pool_keyhash.ptr);
      return StakeDelegation.__wrap(ret);
    }
  }
  /**
   */
  class StakeDeregistration {

    static __wrap(ptr) {
      const obj = Object.create(StakeDeregistration.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_stakederegistration_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakederegistration_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {StakeDeregistration}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakederegistration_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeDeregistration.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakederegistration_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakederegistration_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {StakeDeregistration}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakederegistration_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeDeregistration.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {StakeCredential}
     */
    stake_credential() {
      const ret = wasm.stakederegistration_stake_credential(this.ptr);
      return StakeCredential.__wrap(ret);
    }
    /**
     * @param {StakeCredential} stake_credential
     * @returns {StakeDeregistration}
     */
    static new(stake_credential) {
      _assertClass(stake_credential, StakeCredential);
      const ret = wasm.stakederegistration_new(stake_credential.ptr);
      return StakeDeregistration.__wrap(ret);
    }
  }
  /**
   */
  class StakeDistribution {

    static __wrap(ptr) {
      const obj = Object.create(StakeDistribution.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_stakedistribution_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakedistribution_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {StakeDistribution}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakedistribution_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeDistribution.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakedistribution_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakedistribution_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {StakeDistribution}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakedistribution_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeDistribution.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {StakeDistribution}
     */
    static new_bootstrap_era_distr() {
      const ret = wasm.stakedistribution_new_bootstrap_era_distr();
      return StakeDistribution.__wrap(ret);
    }
    /**
     * @param {StakeholderId} stakeholder_id
     * @returns {StakeDistribution}
     */
    static new_single_key_distr(stakeholder_id) {
      _assertClass(stakeholder_id, StakeholderId);
      const ret = wasm.stakedistribution_new_single_key_distr(stakeholder_id.ptr);
      return StakeDistribution.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.stakedistribution_kind(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {BootstrapEraDistr | undefined}
     */
    as_bootstrap_era_distr() {
      const ret = wasm.stakedistribution_as_bootstrap_era_distr(this.ptr);
      return ret === 0 ? undefined : BootstrapEraDistr.__wrap(ret);
    }
    /**
     * @returns {SingleKeyDistr | undefined}
     */
    as_single_key_distr() {
      const ret = wasm.stakedistribution_as_single_key_distr(this.ptr);
      return ret === 0 ? undefined : SingleKeyDistr.__wrap(ret);
    }
    /**
     * @param {Bip32PublicKey} pubk
     * @returns {StakeDistribution}
     */
    static new_single_key(pubk) {
      _assertClass(pubk, Bip32PublicKey);
      const ret = wasm.stakedistribution_new_single_key(pubk.ptr);
      return StakeDistribution.__wrap(ret);
    }
  }
  /**
   */
  class StakeRegistration {

    static __wrap(ptr) {
      const obj = Object.create(StakeRegistration.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_stakeregistration_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakeregistration_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {StakeRegistration}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakeregistration_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeRegistration.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakeregistration_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakeregistration_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {StakeRegistration}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakeregistration_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeRegistration.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {StakeCredential}
     */
    stake_credential() {
      const ret = wasm.stakeregistration_stake_credential(this.ptr);
      return StakeCredential.__wrap(ret);
    }
    /**
     * @param {StakeCredential} stake_credential
     * @returns {StakeRegistration}
     */
    static new(stake_credential) {
      _assertClass(stake_credential, StakeCredential);
      const ret = wasm.stakeregistration_new(stake_credential.ptr);
      return StakeRegistration.__wrap(ret);
    }
  }
  /**
   */
  class StakeholderId {

    static __wrap(ptr) {
      const obj = Object.create(StakeholderId.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_stakeholderid_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {StakeholderId}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakeholderid_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeholderId.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakeholderid_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakeholderid_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {StakeholderId}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakeholderid_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeholderId.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.stakeholderid_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {StakeholderId}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stakeholderid_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return StakeholderId.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Bip32PublicKey} pubk
     * @returns {StakeholderId}
     */
    static new(pubk) {
      _assertClass(pubk, Bip32PublicKey);
      const ret = wasm.stakeholderid_new(pubk.ptr);
      return StakeholderId.__wrap(ret);
    }
  }
  /**
   */
  class Strings {

    static __wrap(ptr) {
      const obj = Object.create(Strings.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_strings_free(ptr);
    }
    /**
     * @returns {Strings}
     */
    static new() {
      const ret = wasm.strings_new();
      return Strings.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.strings_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {string}
     */
    get(index) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.strings_get(retptr, this.ptr, index);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} elem
     */
    add(elem) {
      const ptr0 = passStringToWasm0(elem, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.strings_add(this.ptr, ptr0, len0);
    }
  }
  /**
   */
  class TimelockExpiry {

    static __wrap(ptr) {
      const obj = Object.create(TimelockExpiry.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_timelockexpiry_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.timelockexpiry_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TimelockExpiry}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.timelockexpiry_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TimelockExpiry.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.timelockexpiry_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.timelockexpiry_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {TimelockExpiry}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.timelockexpiry_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TimelockExpiry.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {BigNum}
     */
    slot() {
      const ret = wasm.timelockexpiry_slot(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @param {BigNum} slot
     * @returns {TimelockExpiry}
     */
    static new(slot) {
      _assertClass(slot, BigNum);
      const ret = wasm.timelockexpiry_new(slot.ptr);
      return TimelockExpiry.__wrap(ret);
    }
  }
  /**
   */
  class TimelockStart {

    static __wrap(ptr) {
      const obj = Object.create(TimelockStart.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_timelockstart_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.timelockstart_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TimelockStart}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.timelockstart_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TimelockStart.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.timelockstart_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.timelockstart_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {TimelockStart}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.timelockstart_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TimelockStart.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {BigNum}
     */
    slot() {
      const ret = wasm.timelockstart_slot(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @param {BigNum} slot
     * @returns {TimelockStart}
     */
    static new(slot) {
      _assertClass(slot, BigNum);
      const ret = wasm.timelockstart_new(slot.ptr);
      return TimelockStart.__wrap(ret);
    }
  }
  /**
   */
  class Transaction {

    static __wrap(ptr) {
      const obj = Object.create(Transaction.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transaction_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transaction_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Transaction}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transaction_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Transaction.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transaction_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transaction_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Transaction}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transaction_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Transaction.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {TransactionBody}
     */
    body() {
      const ret = wasm.transaction_body(this.ptr);
      return TransactionBody.__wrap(ret);
    }
    /**
     * @returns {TransactionWitnessSet}
     */
    witness_set() {
      const ret = wasm.transaction_witness_set(this.ptr);
      return TransactionWitnessSet.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    is_valid() {
      const ret = wasm.transaction_is_valid(this.ptr);
      return ret !== 0;
    }
    /**
     * @returns {AuxiliaryData | undefined}
     */
    auxiliary_data() {
      const ret = wasm.transaction_auxiliary_data(this.ptr);
      return ret === 0 ? undefined : AuxiliaryData.__wrap(ret);
    }
    /**
     * @param {boolean} valid
     */
    set_is_valid(valid) {
      wasm.transaction_set_is_valid(this.ptr, valid);
    }
    /**
     * @param {TransactionBody} body
     * @param {TransactionWitnessSet} witness_set
     * @param {AuxiliaryData | undefined} auxiliary_data
     * @returns {Transaction}
     */
    static new(body, witness_set, auxiliary_data) {
      _assertClass(body, TransactionBody);
      _assertClass(witness_set, TransactionWitnessSet);
      let ptr0 = 0;
      if (!isLikeNone(auxiliary_data)) {
        _assertClass(auxiliary_data, AuxiliaryData);
        ptr0 = auxiliary_data.ptr;
        auxiliary_data.ptr = 0;
      }
      const ret = wasm.transaction_new(body.ptr, witness_set.ptr, ptr0);
      return Transaction.__wrap(ret);
    }
  }
  /**
   */
  class TransactionBodies {

    static __wrap(ptr) {
      const obj = Object.create(TransactionBodies.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionbodies_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbodies_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionBodies}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionbodies_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionBodies.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbodies_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbodies_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {TransactionBodies}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionbodies_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionBodies.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {TransactionBodies}
     */
    static new() {
      const ret = wasm.transactionbodies_new();
      return TransactionBodies.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.transactionbodies_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {TransactionBody}
     */
    get(index) {
      const ret = wasm.transactionbodies_get(this.ptr, index);
      return TransactionBody.__wrap(ret);
    }
    /**
     * @param {TransactionBody} elem
     */
    add(elem) {
      _assertClass(elem, TransactionBody);
      wasm.transactionbodies_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class TransactionBody {

    static __wrap(ptr) {
      const obj = Object.create(TransactionBody.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionbody_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbody_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionBody}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionbody_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionBody.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbody_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbody_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {TransactionBody}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionbody_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionBody.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {TransactionInputs}
     */
    inputs() {
      const ret = wasm.transactionbody_inputs(this.ptr);
      return TransactionInputs.__wrap(ret);
    }
    /**
     * @returns {TransactionOutputs}
     */
    outputs() {
      const ret = wasm.transactionbody_outputs(this.ptr);
      return TransactionOutputs.__wrap(ret);
    }
    /**
     * @returns {BigNum}
     */
    fee() {
      const ret = wasm.transactionbody_fee(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @returns {BigNum | undefined}
     */
    ttl() {
      const ret = wasm.transactionbody_ttl(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @param {Certificates} certs
     */
    set_certs(certs) {
      _assertClass(certs, Certificates);
      wasm.transactionbody_set_certs(this.ptr, certs.ptr);
    }
    /**
     * @returns {Certificates | undefined}
     */
    certs() {
      const ret = wasm.transactionbody_certs(this.ptr);
      return ret === 0 ? undefined : Certificates.__wrap(ret);
    }
    /**
     * @param {Withdrawals} withdrawals
     */
    set_withdrawals(withdrawals) {
      _assertClass(withdrawals, Withdrawals);
      wasm.transactionbody_set_withdrawals(this.ptr, withdrawals.ptr);
    }
    /**
     * @returns {Withdrawals | undefined}
     */
    withdrawals() {
      const ret = wasm.transactionbody_withdrawals(this.ptr);
      return ret === 0 ? undefined : Withdrawals.__wrap(ret);
    }
    /**
     * @param {Update} update
     */
    set_update(update) {
      _assertClass(update, Update);
      wasm.transactionbody_set_update(this.ptr, update.ptr);
    }
    /**
     * @returns {Update | undefined}
     */
    update() {
      const ret = wasm.transactionbody_update(this.ptr);
      return ret === 0 ? undefined : Update.__wrap(ret);
    }
    /**
     * @param {AuxiliaryDataHash} auxiliary_data_hash
     */
    set_auxiliary_data_hash(auxiliary_data_hash) {
      _assertClass(auxiliary_data_hash, AuxiliaryDataHash);
      wasm.transactionbody_set_auxiliary_data_hash(this.ptr, auxiliary_data_hash.ptr);
    }
    /**
     * @returns {AuxiliaryDataHash | undefined}
     */
    auxiliary_data_hash() {
      const ret = wasm.transactionbody_auxiliary_data_hash(this.ptr);
      return ret === 0 ? undefined : AuxiliaryDataHash.__wrap(ret);
    }
    /**
     * @param {BigNum} validity_start_interval
     */
    set_validity_start_interval(validity_start_interval) {
      _assertClass(validity_start_interval, BigNum);
      wasm.transactionbody_set_validity_start_interval(this.ptr, validity_start_interval.ptr);
    }
    /**
     * @returns {BigNum | undefined}
     */
    validity_start_interval() {
      const ret = wasm.transactionbody_validity_start_interval(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @param {Mint} mint
     */
    set_mint(mint) {
      _assertClass(mint, Mint);
      wasm.transactionbody_set_mint(this.ptr, mint.ptr);
    }
    /**
     * @returns {Mint | undefined}
     */
    mint() {
      const ret = wasm.transactionbody_mint(this.ptr);
      return ret === 0 ? undefined : Mint.__wrap(ret);
    }
    /**
     * This function returns the mint value of the transaction
     * Use `.mint()` instead.
     * @returns {Mint | undefined}
     */
    multiassets() {
      const ret = wasm.transactionbody_multiassets(this.ptr);
      return ret === 0 ? undefined : Mint.__wrap(ret);
    }
    /**
     * @param {ScriptDataHash} script_data_hash
     */
    set_script_data_hash(script_data_hash) {
      _assertClass(script_data_hash, ScriptDataHash);
      wasm.transactionbody_set_script_data_hash(this.ptr, script_data_hash.ptr);
    }
    /**
     * @returns {ScriptDataHash | undefined}
     */
    script_data_hash() {
      const ret = wasm.transactionbody_script_data_hash(this.ptr);
      return ret === 0 ? undefined : ScriptDataHash.__wrap(ret);
    }
    /**
     * @param {TransactionInputs} collateral
     */
    set_collateral(collateral) {
      _assertClass(collateral, TransactionInputs);
      wasm.transactionbody_set_collateral(this.ptr, collateral.ptr);
    }
    /**
     * @returns {TransactionInputs | undefined}
     */
    collateral() {
      const ret = wasm.transactionbody_collateral(this.ptr);
      return ret === 0 ? undefined : TransactionInputs.__wrap(ret);
    }
    /**
     * @param {Ed25519KeyHashes} required_signers
     */
    set_required_signers(required_signers) {
      _assertClass(required_signers, Ed25519KeyHashes);
      wasm.transactionbody_set_required_signers(this.ptr, required_signers.ptr);
    }
    /**
     * @returns {Ed25519KeyHashes | undefined}
     */
    required_signers() {
      const ret = wasm.transactionbody_required_signers(this.ptr);
      return ret === 0 ? undefined : Ed25519KeyHashes.__wrap(ret);
    }
    /**
     * @param {NetworkId} network_id
     */
    set_network_id(network_id) {
      _assertClass(network_id, NetworkId);
      wasm.transactionbody_set_network_id(this.ptr, network_id.ptr);
    }
    /**
     * @returns {NetworkId | undefined}
     */
    network_id() {
      const ret = wasm.transactionbody_network_id(this.ptr);
      return ret === 0 ? undefined : NetworkId.__wrap(ret);
    }
    /**
     * @param {TransactionOutput} collateral_return
     */
    set_collateral_return(collateral_return) {
      _assertClass(collateral_return, TransactionOutput);
      wasm.transactionbody_set_collateral_return(this.ptr, collateral_return.ptr);
    }
    /**
     * @returns {TransactionOutput | undefined}
     */
    collateral_return() {
      const ret = wasm.transactionbody_collateral_return(this.ptr);
      return ret === 0 ? undefined : TransactionOutput.__wrap(ret);
    }
    /**
     * @param {BigNum} total_collateral
     */
    set_total_collateral(total_collateral) {
      _assertClass(total_collateral, BigNum);
      wasm.transactionbody_set_total_collateral(this.ptr, total_collateral.ptr);
    }
    /**
     * @returns {BigNum | undefined}
     */
    total_collateral() {
      const ret = wasm.transactionbody_total_collateral(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @param {TransactionInputs} reference_inputs
     */
    set_reference_inputs(reference_inputs) {
      _assertClass(reference_inputs, TransactionInputs);
      wasm.transactionbody_set_reference_inputs(this.ptr, reference_inputs.ptr);
    }
    /**
     * @returns {TransactionInputs | undefined}
     */
    reference_inputs() {
      const ret = wasm.transactionbody_reference_inputs(this.ptr);
      return ret === 0 ? undefined : TransactionInputs.__wrap(ret);
    }
    /**
     * @param {TransactionInputs} inputs
     * @param {TransactionOutputs} outputs
     * @param {BigNum} fee
     * @param {BigNum | undefined} ttl
     * @returns {TransactionBody}
     */
    static new(inputs, outputs, fee, ttl) {
      _assertClass(inputs, TransactionInputs);
      _assertClass(outputs, TransactionOutputs);
      _assertClass(fee, BigNum);
      let ptr0 = 0;
      if (!isLikeNone(ttl)) {
        _assertClass(ttl, BigNum);
        ptr0 = ttl.ptr;
        ttl.ptr = 0;
      }
      const ret = wasm.transactionbody_new(inputs.ptr, outputs.ptr, fee.ptr, ptr0);
      return TransactionBody.__wrap(ret);
    }
  }
  /**
   */
  class TransactionBuilder {

    static __wrap(ptr) {
      const obj = Object.create(TransactionBuilder.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionbuilder_free(ptr);
    }
    /**
     * This automatically selects and adds inputs from {inputs} consisting of just enough to cover
     * the outputs that have already been added.
     * This should be called after adding all certs/outputs/etc and will be an error otherwise.
     * Uses CIP2: https://github.com/cardano-foundation/CIPs/blob/master/CIP-0002/CIP-0002.md
     * Adding a change output must be called after via TransactionBuilder::add_change_if_needed()
     * This function, diverging from CIP2, takes into account fees and will attempt to add additional
     * inputs to cover the minimum fees. This does not, however, set the txbuilder's fee.
     * @param {number} strategy
     */
    select_utxos(strategy) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbuilder_select_utxos(retptr, this.ptr, strategy);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
          throw takeObject(r0);
        }
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {InputBuilderResult} result
     */
    add_input(result) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(result, InputBuilderResult);
        wasm.transactionbuilder_add_input(retptr, this.ptr, result.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
          throw takeObject(r0);
        }
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {InputBuilderResult} result
     */
    add_utxo(result) {
      _assertClass(result, InputBuilderResult);
      wasm.transactionbuilder_add_utxo(this.ptr, result.ptr);
    }
    /**
     * calculates how much the fee would increase if you added a given output
     * @param {InputBuilderResult} result
     * @returns {BigNum}
     */
    fee_for_input(result) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(result, InputBuilderResult);
        wasm.transactionbuilder_fee_for_input(retptr, this.ptr, result.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BigNum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {TransactionUnspentOutput} utxo
     */
    add_reference_input(utxo) {
      _assertClass(utxo, TransactionUnspentOutput);
      wasm.transactionbuilder_add_reference_input(this.ptr, utxo.ptr);
    }
    /**
     * Add explicit output via a TransactionOutput object
     * @param {SingleOutputBuilderResult} builder_result
     */
    add_output(builder_result) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(builder_result, SingleOutputBuilderResult);
        wasm.transactionbuilder_add_output(retptr, this.ptr, builder_result.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
          throw takeObject(r0);
        }
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * calculates how much the fee would increase if you added a given output
     * @param {SingleOutputBuilderResult} builder
     * @returns {BigNum}
     */
    fee_for_output(builder) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(builder, SingleOutputBuilderResult);
        wasm.transactionbuilder_fee_for_output(retptr, this.ptr, builder.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BigNum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {BigNum} fee
     */
    set_fee(fee) {
      _assertClass(fee, BigNum);
      wasm.transactionbuilder_set_fee(this.ptr, fee.ptr);
    }
    /**
     * @param {BigNum} ttl
     */
    set_ttl(ttl) {
      _assertClass(ttl, BigNum);
      wasm.transactionbuilder_set_ttl(this.ptr, ttl.ptr);
    }
    /**
     * @param {BigNum} validity_start_interval
     */
    set_validity_start_interval(validity_start_interval) {
      _assertClass(validity_start_interval, BigNum);
      wasm.transactionbuilder_set_validity_start_interval(this.ptr, validity_start_interval.ptr);
    }
    /**
     * @returns {Certificates | undefined}
     */
    get_certs() {
      const ret = wasm.transactionbuilder_get_certs(this.ptr);
      return ret === 0 ? undefined : Certificates.__wrap(ret);
    }
    /**
     * @param {CertificateBuilderResult} result
     */
    add_cert(result) {
      _assertClass(result, CertificateBuilderResult);
      wasm.transactionbuilder_add_cert(this.ptr, result.ptr);
    }
    /**
     * @returns {Withdrawals | undefined}
     */
    get_withdrawals() {
      const ret = wasm.transactionbuilder_get_withdrawals(this.ptr);
      return ret === 0 ? undefined : Withdrawals.__wrap(ret);
    }
    /**
     * @param {WithdrawalBuilderResult} result
     */
    add_withdrawal(result) {
      _assertClass(result, WithdrawalBuilderResult);
      wasm.transactionbuilder_add_withdrawal(this.ptr, result.ptr);
    }
    /**
     * @returns {AuxiliaryData | undefined}
     */
    get_auxiliary_data() {
      const ret = wasm.transactionbuilder_get_auxiliary_data(this.ptr);
      return ret === 0 ? undefined : AuxiliaryData.__wrap(ret);
    }
    /**
     * @param {AuxiliaryData} new_aux_data
     */
    set_auxiliary_data(new_aux_data) {
      _assertClass(new_aux_data, AuxiliaryData);
      wasm.transactionbuilder_set_auxiliary_data(this.ptr, new_aux_data.ptr);
    }
    /**
     * @param {AuxiliaryData} new_aux_data
     */
    add_auxiliary_data(new_aux_data) {
      _assertClass(new_aux_data, AuxiliaryData);
      wasm.transactionbuilder_add_auxiliary_data(this.ptr, new_aux_data.ptr);
    }
    /**
     * @param {MintBuilderResult} result
     */
    add_mint(result) {
      _assertClass(result, MintBuilderResult);
      wasm.transactionbuilder_add_mint(this.ptr, result.ptr);
    }
    /**
     * Returns a copy of the current mint state in the builder
     * @returns {Mint | undefined}
     */
    get_mint() {
      const ret = wasm.transactionbuilder_get_mint(this.ptr);
      return ret === 0 ? undefined : Mint.__wrap(ret);
    }
    /**
     * @param {TransactionBuilderConfig} cfg
     * @returns {TransactionBuilder}
     */
    static new(cfg) {
      _assertClass(cfg, TransactionBuilderConfig);
      const ret = wasm.transactionbuilder_new(cfg.ptr);
      return TransactionBuilder.__wrap(ret);
    }
    /**
     * @param {InputBuilderResult} result
     */
    add_collateral(result) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(result, InputBuilderResult);
        wasm.transactionbuilder_add_collateral(retptr, this.ptr, result.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
          throw takeObject(r0);
        }
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {TransactionInputs | undefined}
     */
    collateral() {
      const ret = wasm.transactionbuilder_collateral(this.ptr);
      return ret === 0 ? undefined : TransactionInputs.__wrap(ret);
    }
    /**
     * @param {Ed25519KeyHash} hash
     */
    add_required_signer(hash) {
      _assertClass(hash, Ed25519KeyHash);
      wasm.transactionbuilder_add_required_signer(this.ptr, hash.ptr);
    }
    /**
     * @returns {Ed25519KeyHashes | undefined}
     */
    required_signers() {
      const ret = wasm.transactionbuilder_required_signers(this.ptr);
      return ret === 0 ? undefined : Ed25519KeyHashes.__wrap(ret);
    }
    /**
     * @param {NetworkId} network_id
     */
    set_network_id(network_id) {
      _assertClass(network_id, NetworkId);
      var ptr0 = network_id.ptr;
      network_id.ptr = 0;
      wasm.transactionbuilder_set_network_id(this.ptr, ptr0);
    }
    /**
     * @returns {NetworkId | undefined}
     */
    network_id() {
      const ret = wasm.transactionbuilder_network_id(this.ptr);
      return ret === 0 ? undefined : NetworkId.__wrap(ret);
    }
    /**
     * does not include refunds or withdrawals
     * @returns {Value}
     */
    get_explicit_input() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbuilder_get_explicit_input(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Value.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * withdrawals and refunds
     * @returns {Value}
     */
    get_implicit_input() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbuilder_get_implicit_input(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Value.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * Return explicit input plus implicit input plus mint
     * @returns {Value}
     */
    get_total_input() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbuilder_get_total_input(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Value.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * Return explicit output plus implicit output plus burn (does not consider fee directly)
     * @returns {Value}
     */
    get_total_output() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbuilder_get_total_output(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Value.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * does not include fee
     * @returns {Value}
     */
    get_explicit_output() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbuilder_get_explicit_output(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Value.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {BigNum}
     */
    get_deposit() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbuilder_get_deposit(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BigNum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {BigNum | undefined}
     */
    get_fee_if_set() {
      const ret = wasm.transactionbuilder_get_fee_if_set(this.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @param {TransactionOutput} output
     */
    set_collateral_return(output) {
      _assertClass(output, TransactionOutput);
      wasm.transactionbuilder_set_collateral_return(this.ptr, output.ptr);
    }
    /**
     * @returns {number}
     */
    full_size() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbuilder_full_size(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return r0 >>> 0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint32Array}
     */
    output_sizes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbuilder_output_sizes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU32FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * Builds the transaction and moves to the next step redeemer units can be added and a draft tx can
     * be evaluated
     * NOTE: is_valid set to true
     * @param {number} algo
     * @param {Address} change_address
     * @returns {TxRedeemerBuilder}
     */
    build_for_evaluation(algo, change_address) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(change_address, Address);
        wasm.transactionbuilder_build_for_evaluation(retptr, this.ptr, algo, change_address.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TxRedeemerBuilder.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * Builds the transaction and moves to the next step where any real witness can be added
     * NOTE: is_valid set to true
     * @param {number} algo
     * @param {Address} change_address
     * @returns {SignedTxBuilder}
     */
    build(algo, change_address) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(change_address, Address);
        wasm.transactionbuilder_build(retptr, this.ptr, algo, change_address.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SignedTxBuilder.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * used to override the exunit values initially provided when adding inputs
     * @param {RedeemerWitnessKey} redeemer
     * @param {ExUnits} ex_units
     */
    set_exunits(redeemer, ex_units) {
      _assertClass(redeemer, RedeemerWitnessKey);
      _assertClass(ex_units, ExUnits);
      wasm.transactionbuilder_set_exunits(this.ptr, redeemer.ptr, ex_units.ptr);
    }
    /**
     * warning: sum of all parts of a transaction must equal 0. You cannot just set the fee to the min value and forget about it
     * warning: min_fee may be slightly larger than the actual minimum fee (ex: a few lovelaces)
     * this is done to simplify the library code, but can be fixed later
     * @param {boolean} script_calulation
     * @returns {BigNum}
     */
    min_fee(script_calulation) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbuilder_min_fee(retptr, this.ptr, script_calulation);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return BigNum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class TransactionBuilderConfig {

    static __wrap(ptr) {
      const obj = Object.create(TransactionBuilderConfig.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionbuilderconfig_free(ptr);
    }
  }
  /**
   */
  class TransactionBuilderConfigBuilder {

    static __wrap(ptr) {
      const obj = Object.create(TransactionBuilderConfigBuilder.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionbuilderconfigbuilder_free(ptr);
    }
    /**
     * @returns {TransactionBuilderConfigBuilder}
     */
    static new() {
      const ret = wasm.transactionbuilderconfigbuilder_new();
      return TransactionBuilderConfigBuilder.__wrap(ret);
    }
    /**
     * @param {LinearFee} fee_algo
     * @returns {TransactionBuilderConfigBuilder}
     */
    fee_algo(fee_algo) {
      _assertClass(fee_algo, LinearFee);
      const ret = wasm.transactionbuilderconfigbuilder_fee_algo(this.ptr, fee_algo.ptr);
      return TransactionBuilderConfigBuilder.__wrap(ret);
    }
    /**
     * @param {BigNum} coins_per_utxo_byte
     * @returns {TransactionBuilderConfigBuilder}
     */
    coins_per_utxo_byte(coins_per_utxo_byte) {
      _assertClass(coins_per_utxo_byte, BigNum);
      const ret = wasm.transactionbuilderconfigbuilder_coins_per_utxo_byte(this.ptr, coins_per_utxo_byte.ptr);
      return TransactionBuilderConfigBuilder.__wrap(ret);
    }
    /**
     * TODO: remove once Babbage is on mainnet
     * @param {BigNum} coins_per_utxo_word
     * @returns {TransactionBuilderConfigBuilder}
     */
    coins_per_utxo_word(coins_per_utxo_word) {
      _assertClass(coins_per_utxo_word, BigNum);
      const ret = wasm.transactionbuilderconfigbuilder_coins_per_utxo_word(this.ptr, coins_per_utxo_word.ptr);
      return TransactionBuilderConfigBuilder.__wrap(ret);
    }
    /**
     * @param {BigNum} pool_deposit
     * @returns {TransactionBuilderConfigBuilder}
     */
    pool_deposit(pool_deposit) {
      _assertClass(pool_deposit, BigNum);
      const ret = wasm.transactionbuilderconfigbuilder_pool_deposit(this.ptr, pool_deposit.ptr);
      return TransactionBuilderConfigBuilder.__wrap(ret);
    }
    /**
     * @param {BigNum} key_deposit
     * @returns {TransactionBuilderConfigBuilder}
     */
    key_deposit(key_deposit) {
      _assertClass(key_deposit, BigNum);
      const ret = wasm.transactionbuilderconfigbuilder_key_deposit(this.ptr, key_deposit.ptr);
      return TransactionBuilderConfigBuilder.__wrap(ret);
    }
    /**
     * @param {number} max_value_size
     * @returns {TransactionBuilderConfigBuilder}
     */
    max_value_size(max_value_size) {
      const ret = wasm.transactionbuilderconfigbuilder_max_value_size(this.ptr, max_value_size);
      return TransactionBuilderConfigBuilder.__wrap(ret);
    }
    /**
     * @param {number} max_tx_size
     * @returns {TransactionBuilderConfigBuilder}
     */
    max_tx_size(max_tx_size) {
      const ret = wasm.transactionbuilderconfigbuilder_max_tx_size(this.ptr, max_tx_size);
      return TransactionBuilderConfigBuilder.__wrap(ret);
    }
    /**
     * @param {boolean} prefer_pure_change
     * @returns {TransactionBuilderConfigBuilder}
     */
    prefer_pure_change(prefer_pure_change) {
      const ret = wasm.transactionbuilderconfigbuilder_prefer_pure_change(this.ptr, prefer_pure_change);
      return TransactionBuilderConfigBuilder.__wrap(ret);
    }
    /**
     * @param {ExUnitPrices} ex_unit_prices
     * @returns {TransactionBuilderConfigBuilder}
     */
    ex_unit_prices(ex_unit_prices) {
      _assertClass(ex_unit_prices, ExUnitPrices);
      const ret = wasm.transactionbuilderconfigbuilder_ex_unit_prices(this.ptr, ex_unit_prices.ptr);
      return TransactionBuilderConfigBuilder.__wrap(ret);
    }
    /**
     * @param {Costmdls} costmdls
     * @returns {TransactionBuilderConfigBuilder}
     */
    costmdls(costmdls) {
      _assertClass(costmdls, Costmdls);
      const ret = wasm.transactionbuilderconfigbuilder_costmdls(this.ptr, costmdls.ptr);
      return TransactionBuilderConfigBuilder.__wrap(ret);
    }
    /**
     * @param {number} collateral_percentage
     * @returns {TransactionBuilderConfigBuilder}
     */
    collateral_percentage(collateral_percentage) {
      const ret = wasm.transactionbuilderconfigbuilder_collateral_percentage(this.ptr, collateral_percentage);
      return TransactionBuilderConfigBuilder.__wrap(ret);
    }
    /**
     * @param {number} max_collateral_inputs
     * @returns {TransactionBuilderConfigBuilder}
     */
    max_collateral_inputs(max_collateral_inputs) {
      const ret = wasm.transactionbuilderconfigbuilder_max_collateral_inputs(this.ptr, max_collateral_inputs);
      return TransactionBuilderConfigBuilder.__wrap(ret);
    }
    /**
     * @returns {TransactionBuilderConfig}
     */
    build() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionbuilderconfigbuilder_build(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionBuilderConfig.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class TransactionHash {

    static __wrap(ptr) {
      const obj = Object.create(TransactionHash.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionhash_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionHash}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionhash_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionhash_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionhash_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {TransactionHash}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionhash_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionhash_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {TransactionHash}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionhash_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class TransactionIndexes {

    static __wrap(ptr) {
      const obj = Object.create(TransactionIndexes.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionindexes_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionindexes_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionIndexes}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionindexes_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionIndexes.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {TransactionIndexes}
     */
    static new() {
      const ret = wasm.transactionindexes_new();
      return TransactionIndexes.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.transactionindexes_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {BigNum}
     */
    get(index) {
      const ret = wasm.transactionindexes_get(this.ptr, index);
      return BigNum.__wrap(ret);
    }
    /**
     * @param {BigNum} elem
     */
    add(elem) {
      _assertClass(elem, BigNum);
      wasm.transactionindexes_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class TransactionInput {

    static __wrap(ptr) {
      const obj = Object.create(TransactionInput.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactioninput_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactioninput_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionInput}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactioninput_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionInput.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactioninput_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactioninput_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {TransactionInput}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactioninput_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionInput.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {TransactionHash}
     */
    transaction_id() {
      const ret = wasm.transactioninput_transaction_id(this.ptr);
      return TransactionHash.__wrap(ret);
    }
    /**
     * @returns {BigNum}
     */
    index() {
      const ret = wasm.transactioninput_index(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @param {TransactionHash} transaction_id
     * @param {BigNum} index
     * @returns {TransactionInput}
     */
    static new(transaction_id, index) {
      _assertClass(transaction_id, TransactionHash);
      _assertClass(index, BigNum);
      const ret = wasm.transactioninput_new(transaction_id.ptr, index.ptr);
      return TransactionInput.__wrap(ret);
    }
  }
  /**
   */
  class TransactionInputs {

    static __wrap(ptr) {
      const obj = Object.create(TransactionInputs.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactioninputs_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactioninputs_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionInputs}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactioninputs_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionInputs.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactioninputs_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactioninputs_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {TransactionInputs}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactioninputs_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionInputs.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {TransactionInputs}
     */
    static new() {
      const ret = wasm.transactioninputs_new();
      return TransactionInputs.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.transactioninputs_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {TransactionInput}
     */
    get(index) {
      const ret = wasm.transactioninputs_get(this.ptr, index);
      return TransactionInput.__wrap(ret);
    }
    /**
     * @param {TransactionInput} elem
     */
    add(elem) {
      _assertClass(elem, TransactionInput);
      wasm.transactioninputs_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class TransactionMetadatum {

    static __wrap(ptr) {
      const obj = Object.create(TransactionMetadatum.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionmetadatum_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionmetadatum_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionMetadatum}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionmetadatum_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionMetadatum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {MetadataMap} map
     * @returns {TransactionMetadatum}
     */
    static new_map(map) {
      _assertClass(map, MetadataMap);
      const ret = wasm.transactionmetadatum_new_map(map.ptr);
      return TransactionMetadatum.__wrap(ret);
    }
    /**
     * @param {MetadataList} list
     * @returns {TransactionMetadatum}
     */
    static new_list(list) {
      _assertClass(list, MetadataList);
      const ret = wasm.transactionmetadatum_new_list(list.ptr);
      return TransactionMetadatum.__wrap(ret);
    }
    /**
     * @param {Int} int
     * @returns {TransactionMetadatum}
     */
    static new_int(int) {
      _assertClass(int, Int);
      const ret = wasm.transactionmetadatum_new_int(int.ptr);
      return TransactionMetadatum.__wrap(ret);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionMetadatum}
     */
    static new_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionmetadatum_new_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionMetadatum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} text
     * @returns {TransactionMetadatum}
     */
    static new_text(text) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionmetadatum_new_text(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionMetadatum.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {number}
     */
    kind() {
      const ret = wasm.transactionmetadatum_kind(this.ptr);
      return ret >>> 0;
    }
    /**
     * @returns {MetadataMap}
     */
    as_map() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionmetadatum_as_map(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MetadataMap.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {MetadataList}
     */
    as_list() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionmetadatum_as_list(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return MetadataList.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Int}
     */
    as_int() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionmetadatum_as_int(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Int.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    as_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionmetadatum_as_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        if (r3) {
          throw takeObject(r2);
        }
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    as_text() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionmetadatum_as_text(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
  }
  /**
   */
  class TransactionMetadatumLabels {

    static __wrap(ptr) {
      const obj = Object.create(TransactionMetadatumLabels.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionmetadatumlabels_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionmetadatumlabels_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionMetadatumLabels}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionmetadatumlabels_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionMetadatumLabels.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {TransactionMetadatumLabels}
     */
    static new() {
      const ret = wasm.transactionmetadatumlabels_new();
      return TransactionMetadatumLabels.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.transactionmetadatumlabels_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {BigNum}
     */
    get(index) {
      const ret = wasm.transactionmetadatumlabels_get(this.ptr, index);
      return BigNum.__wrap(ret);
    }
    /**
     * @param {BigNum} elem
     */
    add(elem) {
      _assertClass(elem, BigNum);
      wasm.transactionmetadatumlabels_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class TransactionOutput {

    static __wrap(ptr) {
      const obj = Object.create(TransactionOutput.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionoutput_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionoutput_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionOutput}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionoutput_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionOutput.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionoutput_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionoutput_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {TransactionOutput}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionoutput_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionOutput.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Address}
     */
    address() {
      const ret = wasm.transactionoutput_address(this.ptr);
      return Address.__wrap(ret);
    }
    /**
     * @returns {Value}
     */
    amount() {
      const ret = wasm.transactionoutput_amount(this.ptr);
      return Value.__wrap(ret);
    }
    /**
     * @returns {Datum | undefined}
     */
    datum() {
      const ret = wasm.transactionoutput_datum(this.ptr);
      return ret === 0 ? undefined : Datum.__wrap(ret);
    }
    /**
     * @param {Datum} data
     */
    set_datum(data) {
      _assertClass(data, Datum);
      wasm.transactionoutput_set_datum(this.ptr, data.ptr);
    }
    /**
     * @returns {ScriptRef | undefined}
     */
    script_ref() {
      const ret = wasm.transactionoutput_script_ref(this.ptr);
      return ret === 0 ? undefined : ScriptRef.__wrap(ret);
    }
    /**
     * @param {ScriptRef} script_ref
     */
    set_script_ref(script_ref) {
      _assertClass(script_ref, ScriptRef);
      wasm.transactionoutput_set_script_ref(this.ptr, script_ref.ptr);
    }
    /**
     * @param {Address} address
     * @param {Value} amount
     * @returns {TransactionOutput}
     */
    static new(address, amount) {
      _assertClass(address, Address);
      _assertClass(amount, Value);
      const ret = wasm.transactionoutput_new(address.ptr, amount.ptr);
      return TransactionOutput.__wrap(ret);
    }
  }
  /**
   */
  class TransactionOutputAmountBuilder {

    static __wrap(ptr) {
      const obj = Object.create(TransactionOutputAmountBuilder.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionoutputamountbuilder_free(ptr);
    }
    /**
     * @param {Value} amount
     * @returns {TransactionOutputAmountBuilder}
     */
    with_value(amount) {
      _assertClass(amount, Value);
      const ret = wasm.transactionoutputamountbuilder_with_value(this.ptr, amount.ptr);
      return TransactionOutputAmountBuilder.__wrap(ret);
    }
    /**
     * @param {BigNum} coin
     * @returns {TransactionOutputAmountBuilder}
     */
    with_coin(coin) {
      _assertClass(coin, BigNum);
      const ret = wasm.transactionoutputamountbuilder_with_coin(this.ptr, coin.ptr);
      return TransactionOutputAmountBuilder.__wrap(ret);
    }
    /**
     * @param {BigNum} coin
     * @param {MultiAsset} multiasset
     * @returns {TransactionOutputAmountBuilder}
     */
    with_coin_and_asset(coin, multiasset) {
      _assertClass(coin, BigNum);
      _assertClass(multiasset, MultiAsset);
      const ret = wasm.transactionoutputamountbuilder_with_coin_and_asset(this.ptr, coin.ptr, multiasset.ptr);
      return TransactionOutputAmountBuilder.__wrap(ret);
    }
    /**
     * @param {MultiAsset} multiasset
     * @param {BigNum} coins_per_utxo_byte
     * @param {BigNum | undefined} coins_per_utxo_word
     * @returns {TransactionOutputAmountBuilder}
     */
    with_asset_and_min_required_coin(multiasset, coins_per_utxo_byte, coins_per_utxo_word) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(multiasset, MultiAsset);
        _assertClass(coins_per_utxo_byte, BigNum);
        let ptr0 = 0;
        if (!isLikeNone(coins_per_utxo_word)) {
          _assertClass(coins_per_utxo_word, BigNum);
          ptr0 = coins_per_utxo_word.ptr;
          coins_per_utxo_word.ptr = 0;
        }
        wasm.transactionoutputamountbuilder_with_asset_and_min_required_coin(retptr, this.ptr, multiasset.ptr, coins_per_utxo_byte.ptr, ptr0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionOutputAmountBuilder.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {SingleOutputBuilderResult}
     */
    build() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionoutputamountbuilder_build(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return SingleOutputBuilderResult.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   * We introduce a builder-pattern format for creating transaction outputs
   * This is because:
   * 1. Some fields (i.e. data hash) are optional, and we can't easily expose Option<> in WASM
   * 2. Some fields like amounts have many ways it could be set (some depending on other field values being known)
   * 3. Easier to adapt as the output format gets more complicated in future Cardano releases
   */
  class TransactionOutputBuilder {

    static __wrap(ptr) {
      const obj = Object.create(TransactionOutputBuilder.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionoutputbuilder_free(ptr);
    }
    /**
     * @returns {TransactionOutputBuilder}
     */
    static new() {
      const ret = wasm.transactionoutputbuilder_new();
      return TransactionOutputBuilder.__wrap(ret);
    }
    /**
     * @param {Address} address
     * @returns {TransactionOutputBuilder}
     */
    with_address(address) {
      _assertClass(address, Address);
      const ret = wasm.transactionoutputbuilder_with_address(this.ptr, address.ptr);
      return TransactionOutputBuilder.__wrap(ret);
    }
    /**
     * A communication datum is one where the data hash is used in the tx output
     * Yet the full datum is included in the witness of the same transaction
     * @param {PlutusData} datum
     * @returns {TransactionOutputBuilder}
     */
    with_communication_data(datum) {
      _assertClass(datum, PlutusData);
      const ret = wasm.transactionoutputbuilder_with_communication_data(this.ptr, datum.ptr);
      return TransactionOutputBuilder.__wrap(ret);
    }
    /**
     * @param {Datum} datum
     * @returns {TransactionOutputBuilder}
     */
    with_data(datum) {
      _assertClass(datum, Datum);
      const ret = wasm.transactionoutputbuilder_with_data(this.ptr, datum.ptr);
      return TransactionOutputBuilder.__wrap(ret);
    }
    /**
     * @param {ScriptRef} script_ref
     * @returns {TransactionOutputBuilder}
     */
    with_reference_script(script_ref) {
      _assertClass(script_ref, ScriptRef);
      const ret = wasm.transactionoutputbuilder_with_reference_script(this.ptr, script_ref.ptr);
      return TransactionOutputBuilder.__wrap(ret);
    }
    /**
     * @returns {TransactionOutputAmountBuilder}
     */
    next() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionoutputbuilder_next(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionOutputAmountBuilder.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class TransactionOutputs {

    static __wrap(ptr) {
      const obj = Object.create(TransactionOutputs.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionoutputs_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionoutputs_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionOutputs}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionoutputs_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionOutputs.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionoutputs_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionoutputs_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {TransactionOutputs}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionoutputs_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionOutputs.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {TransactionOutputs}
     */
    static new() {
      const ret = wasm.transactionoutputs_new();
      return TransactionOutputs.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.transactionoutputs_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {TransactionOutput}
     */
    get(index) {
      const ret = wasm.transactionoutputs_get(this.ptr, index);
      return TransactionOutput.__wrap(ret);
    }
    /**
     * @param {TransactionOutput} elem
     */
    add(elem) {
      _assertClass(elem, TransactionOutput);
      wasm.transactionoutputs_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class TransactionUnspentOutput {

    static __wrap(ptr) {
      const obj = Object.create(TransactionUnspentOutput.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionunspentoutput_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionunspentoutput_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionUnspentOutput}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionunspentoutput_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionUnspentOutput.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {TransactionInput} input
     * @param {TransactionOutput} output
     * @returns {TransactionUnspentOutput}
     */
    static new(input, output) {
      _assertClass(input, TransactionInput);
      _assertClass(output, TransactionOutput);
      const ret = wasm.transactionunspentoutput_new(input.ptr, output.ptr);
      return TransactionUnspentOutput.__wrap(ret);
    }
    /**
     * @returns {TransactionInput}
     */
    input() {
      const ret = wasm.transactionunspentoutput_input(this.ptr);
      return TransactionInput.__wrap(ret);
    }
    /**
     * @returns {TransactionOutput}
     */
    output() {
      const ret = wasm.transactionunspentoutput_output(this.ptr);
      return TransactionOutput.__wrap(ret);
    }
  }
  /**
   */
  class TransactionUnspentOutputs {

    static __wrap(ptr) {
      const obj = Object.create(TransactionUnspentOutputs.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionunspentoutputs_free(ptr);
    }
    /**
     * @returns {TransactionUnspentOutputs}
     */
    static new() {
      const ret = wasm.transactionunspentoutputs_new();
      return TransactionUnspentOutputs.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    is_empty() {
      const ret = wasm.transactionunspentoutputs_is_empty(this.ptr);
      return ret !== 0;
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.transactionunspentoutputs_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {TransactionUnspentOutput}
     */
    get(index) {
      const ret = wasm.transactionunspentoutputs_get(this.ptr, index);
      return TransactionUnspentOutput.__wrap(ret);
    }
    /**
     * @param {TransactionUnspentOutput} elem
     */
    add(elem) {
      _assertClass(elem, TransactionUnspentOutput);
      wasm.transactionunspentoutputs_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class TransactionWitnessSet {

    static __wrap(ptr) {
      const obj = Object.create(TransactionWitnessSet.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionwitnessset_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionwitnessset_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionWitnessSet}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionwitnessset_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionWitnessSet.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionwitnessset_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionwitnessset_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {TransactionWitnessSet}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionwitnessset_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionWitnessSet.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Vkeywitnesses} vkeys
     */
    set_vkeys(vkeys) {
      _assertClass(vkeys, Vkeywitnesses);
      wasm.transactionwitnessset_set_vkeys(this.ptr, vkeys.ptr);
    }
    /**
     * @returns {Vkeywitnesses | undefined}
     */
    vkeys() {
      const ret = wasm.transactionwitnessset_vkeys(this.ptr);
      return ret === 0 ? undefined : Vkeywitnesses.__wrap(ret);
    }
    /**
     * @param {NativeScripts} native_scripts
     */
    set_native_scripts(native_scripts) {
      _assertClass(native_scripts, NativeScripts);
      wasm.transactionwitnessset_set_native_scripts(this.ptr, native_scripts.ptr);
    }
    /**
     * @returns {NativeScripts | undefined}
     */
    native_scripts() {
      const ret = wasm.transactionwitnessset_native_scripts(this.ptr);
      return ret === 0 ? undefined : NativeScripts.__wrap(ret);
    }
    /**
     * @param {BootstrapWitnesses} bootstraps
     */
    set_bootstraps(bootstraps) {
      _assertClass(bootstraps, BootstrapWitnesses);
      wasm.transactionwitnessset_set_bootstraps(this.ptr, bootstraps.ptr);
    }
    /**
     * @returns {BootstrapWitnesses | undefined}
     */
    bootstraps() {
      const ret = wasm.transactionwitnessset_bootstraps(this.ptr);
      return ret === 0 ? undefined : BootstrapWitnesses.__wrap(ret);
    }
    /**
     * @param {PlutusV1Scripts} plutus_v1_scripts
     */
    set_plutus_v1_scripts(plutus_v1_scripts) {
      _assertClass(plutus_v1_scripts, PlutusV1Scripts);
      wasm.transactionwitnessset_set_plutus_v1_scripts(this.ptr, plutus_v1_scripts.ptr);
    }
    /**
     * @returns {PlutusV1Scripts | undefined}
     */
    plutus_v1_scripts() {
      const ret = wasm.transactionwitnessset_plutus_v1_scripts(this.ptr);
      return ret === 0 ? undefined : PlutusV1Scripts.__wrap(ret);
    }
    /**
     * @param {PlutusList} plutus_data
     */
    set_plutus_data(plutus_data) {
      _assertClass(plutus_data, PlutusList);
      wasm.transactionwitnessset_set_plutus_data(this.ptr, plutus_data.ptr);
    }
    /**
     * @returns {PlutusList | undefined}
     */
    plutus_data() {
      const ret = wasm.transactionwitnessset_plutus_data(this.ptr);
      return ret === 0 ? undefined : PlutusList.__wrap(ret);
    }
    /**
     * @param {Redeemers} redeemers
     */
    set_redeemers(redeemers) {
      _assertClass(redeemers, Redeemers);
      wasm.transactionwitnessset_set_redeemers(this.ptr, redeemers.ptr);
    }
    /**
     * @returns {Redeemers | undefined}
     */
    redeemers() {
      const ret = wasm.transactionwitnessset_redeemers(this.ptr);
      return ret === 0 ? undefined : Redeemers.__wrap(ret);
    }
    /**
     * @param {PlutusV2Scripts} plutus_v2_scripts
     */
    set_plutus_v2_scripts(plutus_v2_scripts) {
      _assertClass(plutus_v2_scripts, PlutusV2Scripts);
      wasm.transactionwitnessset_set_plutus_v2_scripts(this.ptr, plutus_v2_scripts.ptr);
    }
    /**
     * @returns {PlutusV2Scripts | undefined}
     */
    plutus_v2_scripts() {
      const ret = wasm.transactionwitnessset_plutus_v2_scripts(this.ptr);
      return ret === 0 ? undefined : PlutusV2Scripts.__wrap(ret);
    }
    /**
     * @returns {TransactionWitnessSet}
     */
    static new() {
      const ret = wasm.transactionwitnessset_new();
      return TransactionWitnessSet.__wrap(ret);
    }
  }
  /**
   * Builder de-duplicates witnesses as they are added
   */
  class TransactionWitnessSetBuilder {

    static __wrap(ptr) {
      const obj = Object.create(TransactionWitnessSetBuilder.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionwitnesssetbuilder_free(ptr);
    }
    /**
     * @returns {Vkeys}
     */
    get_vkeys() {
      const ret = wasm.transactionwitnesssetbuilder_get_vkeys(this.ptr);
      return Vkeys.__wrap(ret);
    }
    /**
     * @param {Vkeywitness} vkey
     */
    add_vkey(vkey) {
      _assertClass(vkey, Vkeywitness);
      wasm.transactionwitnesssetbuilder_add_vkey(this.ptr, vkey.ptr);
    }
    /**
     * @param {BootstrapWitness} bootstrap
     */
    add_bootstrap(bootstrap) {
      _assertClass(bootstrap, BootstrapWitness);
      wasm.transactionwitnesssetbuilder_add_bootstrap(this.ptr, bootstrap.ptr);
    }
    /**
     * @returns {Vkeys}
     */
    get_bootstraps() {
      const ret = wasm.transactionwitnesssetbuilder_get_bootstraps(this.ptr);
      return Vkeys.__wrap(ret);
    }
    /**
     * @param {Script} script
     */
    add_script(script) {
      _assertClass(script, Script);
      wasm.transactionwitnesssetbuilder_add_script(this.ptr, script.ptr);
    }
    /**
     * @param {NativeScript} native_script
     */
    add_native_script(native_script) {
      _assertClass(native_script, NativeScript);
      wasm.transactionwitnesssetbuilder_add_native_script(this.ptr, native_script.ptr);
    }
    /**
     * @returns {NativeScripts}
     */
    get_native_script() {
      const ret = wasm.transactionwitnesssetbuilder_get_native_script(this.ptr);
      return NativeScripts.__wrap(ret);
    }
    /**
     * @param {PlutusV1Script} plutus_v1_script
     */
    add_plutus_v1_script(plutus_v1_script) {
      _assertClass(plutus_v1_script, PlutusV1Script);
      wasm.transactionwitnesssetbuilder_add_plutus_v1_script(this.ptr, plutus_v1_script.ptr);
    }
    /**
     * @returns {PlutusV1Scripts}
     */
    get_plutus_v1_script() {
      const ret = wasm.transactionwitnesssetbuilder_get_plutus_v1_script(this.ptr);
      return PlutusV1Scripts.__wrap(ret);
    }
    /**
     * @param {PlutusV2Script} plutus_v2_script
     */
    add_plutus_v2_script(plutus_v2_script) {
      _assertClass(plutus_v2_script, PlutusV2Script);
      wasm.transactionwitnesssetbuilder_add_plutus_v2_script(this.ptr, plutus_v2_script.ptr);
    }
    /**
     * @returns {PlutusV2Scripts}
     */
    get_plutus_v2_script() {
      const ret = wasm.transactionwitnesssetbuilder_get_plutus_v2_script(this.ptr);
      return PlutusV2Scripts.__wrap(ret);
    }
    /**
     * @param {PlutusData} plutus_datum
     */
    add_plutus_datum(plutus_datum) {
      _assertClass(plutus_datum, PlutusData);
      wasm.transactionwitnesssetbuilder_add_plutus_datum(this.ptr, plutus_datum.ptr);
    }
    /**
     * @returns {PlutusList}
     */
    get_plutus_datum() {
      const ret = wasm.transactionwitnesssetbuilder_get_plutus_datum(this.ptr);
      return PlutusList.__wrap(ret);
    }
    /**
     * @param {Redeemer} redeemer
     */
    add_redeemer(redeemer) {
      _assertClass(redeemer, Redeemer);
      wasm.transactionwitnesssetbuilder_add_redeemer(this.ptr, redeemer.ptr);
    }
    /**
     * @param {Redeemers} redeemers
     */
    add_redeemers(redeemers) {
      _assertClass(redeemers, Redeemers);
      wasm.transactionwitnesssetbuilder_add_redeemers(this.ptr, redeemers.ptr);
    }
    /**
     * @returns {Redeemers}
     */
    get_redeemer() {
      const ret = wasm.transactionwitnesssetbuilder_get_redeemer(this.ptr);
      return Redeemers.__wrap(ret);
    }
    /**
     * @param {RequiredWitnessSet} required_wits
     */
    add_required_wits(required_wits) {
      _assertClass(required_wits, RequiredWitnessSet);
      wasm.transactionwitnesssetbuilder_add_required_wits(this.ptr, required_wits.ptr);
    }
    /**
     * @returns {TransactionWitnessSetBuilder}
     */
    static new() {
      const ret = wasm.transactionwitnesssetbuilder_new();
      return TransactionWitnessSetBuilder.__wrap(ret);
    }
    /**
     * @param {TransactionWitnessSet} wit_set
     */
    add_existing(wit_set) {
      _assertClass(wit_set, TransactionWitnessSet);
      wasm.transactionwitnesssetbuilder_add_existing(this.ptr, wit_set.ptr);
    }
    /**
     * @returns {TransactionWitnessSet}
     */
    build() {
      const ret = wasm.transactionwitnesssetbuilder_build(this.ptr);
      return TransactionWitnessSet.__wrap(ret);
    }
    /**
     * @returns {RequiredWitnessSet}
     */
    remaining_wits() {
      const ret = wasm.transactionwitnesssetbuilder_remaining_wits(this.ptr);
      return RequiredWitnessSet.__wrap(ret);
    }
    /**
     * @returns {TransactionWitnessSet}
     */
    try_build() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionwitnesssetbuilder_try_build(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionWitnessSet.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class TransactionWitnessSets {

    static __wrap(ptr) {
      const obj = Object.create(TransactionWitnessSets.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_transactionwitnesssets_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionwitnesssets_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {TransactionWitnessSets}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionwitnesssets_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionWitnessSets.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionwitnesssets_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transactionwitnesssets_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {TransactionWitnessSets}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.transactionwitnesssets_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return TransactionWitnessSets.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {TransactionWitnessSets}
     */
    static new() {
      const ret = wasm.transactionwitnesssets_new();
      return TransactionWitnessSets.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.transactionwitnesssets_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {TransactionWitnessSet}
     */
    get(index) {
      const ret = wasm.transactionwitnesssets_get(this.ptr, index);
      return TransactionWitnessSet.__wrap(ret);
    }
    /**
     * @param {TransactionWitnessSet} elem
     */
    add(elem) {
      _assertClass(elem, TransactionWitnessSet);
      wasm.transactionwitnesssets_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class TxRedeemerBuilder {

    static __wrap(ptr) {
      const obj = Object.create(TxRedeemerBuilder.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_txredeemerbuilder_free(ptr);
    }
    /**
     * Builds the transaction and moves to the next step where any real witness can be added
     * NOTE: is_valid set to true
     * Will NOT require you to have set required signers & witnesses
     * @returns {Redeemers}
     */
    build() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.txredeemerbuilder_build(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Redeemers.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * used to override the exunit values initially provided when adding inputs
     * @param {RedeemerWitnessKey} redeemer
     * @param {ExUnits} ex_units
     */
    set_exunits(redeemer, ex_units) {
      _assertClass(redeemer, RedeemerWitnessKey);
      _assertClass(ex_units, ExUnits);
      wasm.txredeemerbuilder_set_exunits(this.ptr, redeemer.ptr, ex_units.ptr);
    }
    /**
     * Transaction body with a dummy values for redeemers & script_data_hash
     * Used for calculating exunits or required signers
     * @returns {TransactionBody}
     */
    draft_body() {
      const ret = wasm.txredeemerbuilder_draft_body(this.ptr);
      return TransactionBody.__wrap(ret);
    }
    /**
     * @returns {AuxiliaryData | undefined}
     */
    auxiliary_data() {
      const ret = wasm.txredeemerbuilder_auxiliary_data(this.ptr);
      return ret === 0 ? undefined : AuxiliaryData.__wrap(ret);
    }
    /**
     * Transaction body with a dummy values for redeemers & script_data_hash and padded with dummy witnesses
     * Used for calculating exunits
     * note: is_valid set to true
     * @returns {Transaction}
     */
    draft_tx() {
      const ret = wasm.txredeemerbuilder_draft_tx(this.ptr);
      return Transaction.__wrap(ret);
    }
  }
  /**
   */
  class URL {

    static __wrap(ptr) {
      const obj = Object.create(URL.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_url_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.url_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {URL}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.url_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return URL.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} url
     * @returns {URL}
     */
    static new(url) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.url_new(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return URL.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    url() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.url_url(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
  }
  /**
   */
  class UnitInterval {

    static __wrap(ptr) {
      const obj = Object.create(UnitInterval.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_unitinterval_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.unitinterval_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {UnitInterval}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.unitinterval_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return UnitInterval.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.unitinterval_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.unitinterval_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {UnitInterval}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.unitinterval_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return UnitInterval.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {BigNum}
     */
    numerator() {
      const ret = wasm.unitinterval_numerator(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @returns {BigNum}
     */
    denominator() {
      const ret = wasm.unitinterval_denominator(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @param {BigNum} numerator
     * @param {BigNum} denominator
     * @returns {UnitInterval}
     */
    static new(numerator, denominator) {
      _assertClass(numerator, BigNum);
      _assertClass(denominator, BigNum);
      const ret = wasm.unitinterval_new(numerator.ptr, denominator.ptr);
      return UnitInterval.__wrap(ret);
    }
  }
  /**
   * Redeemer without the tag of index
   * This allows builder code to return partial redeemers
   * and then later have them placed in the right context
   */
  class UntaggedRedeemer {

    static __wrap(ptr) {
      const obj = Object.create(UntaggedRedeemer.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_untaggedredeemer_free(ptr);
    }
    /**
     * @returns {PlutusData}
     */
    datum() {
      const ret = wasm.untaggedredeemer_datum(this.ptr);
      return PlutusData.__wrap(ret);
    }
    /**
     * @returns {ExUnits}
     */
    ex_units() {
      const ret = wasm.untaggedredeemer_ex_units(this.ptr);
      return ExUnits.__wrap(ret);
    }
    /**
     * @param {PlutusData} data
     * @param {ExUnits} ex_units
     * @returns {UntaggedRedeemer}
     */
    static new(data, ex_units) {
      _assertClass(data, PlutusData);
      _assertClass(ex_units, ExUnits);
      const ret = wasm.untaggedredeemer_new(data.ptr, ex_units.ptr);
      return UntaggedRedeemer.__wrap(ret);
    }
  }
  /**
   */
  class Update {

    static __wrap(ptr) {
      const obj = Object.create(Update.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_update_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.update_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Update}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.update_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Update.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.update_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.update_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Update}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.update_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Update.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {ProposedProtocolParameterUpdates}
     */
    proposed_protocol_parameter_updates() {
      const ret = wasm.update_proposed_protocol_parameter_updates(this.ptr);
      return ProposedProtocolParameterUpdates.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    epoch() {
      const ret = wasm.update_epoch(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {ProposedProtocolParameterUpdates} proposed_protocol_parameter_updates
     * @param {number} epoch
     * @returns {Update}
     */
    static new(proposed_protocol_parameter_updates, epoch) {
      _assertClass(proposed_protocol_parameter_updates, ProposedProtocolParameterUpdates);
      const ret = wasm.update_new(proposed_protocol_parameter_updates.ptr, epoch);
      return Update.__wrap(ret);
    }
  }
  /**
   */
  class VRFCert {

    static __wrap(ptr) {
      const obj = Object.create(VRFCert.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_vrfcert_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vrfcert_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {VRFCert}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.vrfcert_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return VRFCert.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vrfcert_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vrfcert_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {VRFCert}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.vrfcert_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return VRFCert.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    output() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vrfcert_output(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    proof() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vrfcert_proof(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} output
     * @param {Uint8Array} proof
     * @returns {VRFCert}
     */
    static new(output, proof) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(output, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(proof, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.vrfcert_new(retptr, ptr0, len0, ptr1, len1);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return VRFCert.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class VRFKeyHash {

    static __wrap(ptr) {
      const obj = Object.create(VRFKeyHash.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_vrfkeyhash_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {VRFKeyHash}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.vrfkeyhash_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return VRFKeyHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vrfkeyhash_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.vrfkeyhash_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {VRFKeyHash}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.vrfkeyhash_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return VRFKeyHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vrfkeyhash_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {VRFKeyHash}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.vrfkeyhash_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return VRFKeyHash.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class VRFVKey {

    static __wrap(ptr) {
      const obj = Object.create(VRFVKey.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_vrfvkey_free(ptr);
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {VRFVKey}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.vrfvkey_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return VRFVKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vrfvkey_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} prefix
     * @returns {string}
     */
    to_bech32(prefix) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(prefix, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.vrfvkey_to_bech32(retptr, this.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
          ptr1 = 0; len1 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr1, len1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr1, len1);
      }
    }
    /**
     * @param {string} bech_str
     * @returns {VRFVKey}
     */
    static from_bech32(bech_str) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(bech_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.vrfvkey_from_bech32(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return VRFVKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_hex() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vrfvkey_to_hex(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(r0, r1);
      }
    }
    /**
     * @param {string} hex
     * @returns {VRFVKey}
     */
    static from_hex(hex) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.vrfvkey_from_hex(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return VRFVKey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
  }
  /**
   */
  class Value {

    static __wrap(ptr) {
      const obj = Object.create(Value.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_value_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.value_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Value}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.value_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Value.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.value_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.value_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Value}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.value_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Value.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {BigNum} coin
     * @returns {Value}
     */
    static new(coin) {
      _assertClass(coin, BigNum);
      const ret = wasm.value_new(coin.ptr);
      return Value.__wrap(ret);
    }
    /**
     * @param {MultiAsset} multiasset
     * @returns {Value}
     */
    static new_from_assets(multiasset) {
      _assertClass(multiasset, MultiAsset);
      const ret = wasm.value_new_from_assets(multiasset.ptr);
      return Value.__wrap(ret);
    }
    /**
     * @returns {Value}
     */
    static zero() {
      const ret = wasm.value_zero();
      return Value.__wrap(ret);
    }
    /**
     * @returns {boolean}
     */
    is_zero() {
      const ret = wasm.value_is_zero(this.ptr);
      return ret !== 0;
    }
    /**
     * @returns {BigNum}
     */
    coin() {
      const ret = wasm.value_coin(this.ptr);
      return BigNum.__wrap(ret);
    }
    /**
     * @param {BigNum} coin
     */
    set_coin(coin) {
      _assertClass(coin, BigNum);
      wasm.value_set_coin(this.ptr, coin.ptr);
    }
    /**
     * @returns {MultiAsset | undefined}
     */
    multiasset() {
      const ret = wasm.value_multiasset(this.ptr);
      return ret === 0 ? undefined : MultiAsset.__wrap(ret);
    }
    /**
     * @param {MultiAsset} multiasset
     */
    set_multiasset(multiasset) {
      _assertClass(multiasset, MultiAsset);
      wasm.value_set_multiasset(this.ptr, multiasset.ptr);
    }
    /**
     * @param {Value} rhs
     * @returns {Value}
     */
    checked_add(rhs) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(rhs, Value);
        wasm.value_checked_add(retptr, this.ptr, rhs.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Value.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Value} rhs_value
     * @returns {Value}
     */
    checked_sub(rhs_value) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(rhs_value, Value);
        wasm.value_checked_sub(retptr, this.ptr, rhs_value.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Value.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Value} rhs_value
     * @returns {Value}
     */
    clamped_sub(rhs_value) {
      _assertClass(rhs_value, Value);
      const ret = wasm.value_clamped_sub(this.ptr, rhs_value.ptr);
      return Value.__wrap(ret);
    }
    /**
     * note: values are only partially comparable
     * @param {Value} rhs_value
     * @returns {number | undefined}
     */
    compare(rhs_value) {
      _assertClass(rhs_value, Value);
      const ret = wasm.value_compare(this.ptr, rhs_value.ptr);
      return ret === 0xFFFFFF ? undefined : ret;
    }
  }
  /**
   */
  class Vkey {

    static __wrap(ptr) {
      const obj = Object.create(Vkey.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_vkey_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vkey_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Vkey}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.vkey_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Vkey.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {PublicKey} pk
     * @returns {Vkey}
     */
    static new(pk) {
      _assertClass(pk, PublicKey);
      const ret = wasm.vkey_new(pk.ptr);
      return Vkey.__wrap(ret);
    }
    /**
     * @returns {PublicKey}
     */
    public_key() {
      const ret = wasm.vkey_public_key(this.ptr);
      return PublicKey.__wrap(ret);
    }
  }
  /**
   */
  class Vkeys {

    static __wrap(ptr) {
      const obj = Object.create(Vkeys.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_vkeys_free(ptr);
    }
    /**
     * @returns {Vkeys}
     */
    static new() {
      const ret = wasm.vkeys_new();
      return Vkeys.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.vkeys_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {Vkey}
     */
    get(index) {
      const ret = wasm.vkeys_get(this.ptr, index);
      return Vkey.__wrap(ret);
    }
    /**
     * @param {Vkey} elem
     */
    add(elem) {
      _assertClass(elem, Vkey);
      wasm.vkeys_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class Vkeywitness {

    static __wrap(ptr) {
      const obj = Object.create(Vkeywitness.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_vkeywitness_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vkeywitness_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Vkeywitness}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.vkeywitness_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Vkeywitness.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vkeywitness_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vkeywitness_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Vkeywitness}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.vkeywitness_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Vkeywitness.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Vkey} vkey
     * @param {Ed25519Signature} signature
     * @returns {Vkeywitness}
     */
    static new(vkey, signature) {
      _assertClass(vkey, Vkey);
      _assertClass(signature, Ed25519Signature);
      const ret = wasm.vkeywitness_new(vkey.ptr, signature.ptr);
      return Vkeywitness.__wrap(ret);
    }
    /**
     * @returns {Vkey}
     */
    vkey() {
      const ret = wasm.vkeywitness_vkey(this.ptr);
      return Vkey.__wrap(ret);
    }
    /**
     * @returns {Ed25519Signature}
     */
    signature() {
      const ret = wasm.vkeywitness_signature(this.ptr);
      return Ed25519Signature.__wrap(ret);
    }
  }
  /**
   */
  class Vkeywitnesses {

    static __wrap(ptr) {
      const obj = Object.create(Vkeywitnesses.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_vkeywitnesses_free(ptr);
    }
    /**
     * @returns {Vkeywitnesses}
     */
    static new() {
      const ret = wasm.vkeywitnesses_new();
      return Vkeywitnesses.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.vkeywitnesses_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {number} index
     * @returns {Vkeywitness}
     */
    get(index) {
      const ret = wasm.vkeywitnesses_get(this.ptr, index);
      return Vkeywitness.__wrap(ret);
    }
    /**
     * @param {Vkeywitness} elem
     */
    add(elem) {
      _assertClass(elem, Vkeywitness);
      wasm.vkeywitnesses_add(this.ptr, elem.ptr);
    }
  }
  /**
   */
  class WithdrawalBuilderResult {

    static __wrap(ptr) {
      const obj = Object.create(WithdrawalBuilderResult.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_withdrawalbuilderresult_free(ptr);
    }
  }
  /**
   */
  class Withdrawals {

    static __wrap(ptr) {
      const obj = Object.create(Withdrawals.prototype);
      obj.ptr = ptr;

      return obj;
    }

    __destroy_into_raw() {
      const ptr = this.ptr;
      this.ptr = 0;

      return ptr;
    }

    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_withdrawals_free(ptr);
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.withdrawals_to_bytes(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Withdrawals}
     */
    static from_bytes(bytes) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.withdrawals_from_bytes(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Withdrawals.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {string}
     */
    to_json() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.withdrawals_to_json(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        var ptr0 = r0;
        var len0 = r1;
        if (r3) {
          ptr0 = 0; len0 = 0;
          throw takeObject(r2);
        }
        return getStringFromWasm0(ptr0, len0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(ptr0, len0);
      }
    }
    /**
     * @returns {any}
     */
    to_js_value() {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.withdrawals_to_js_value(retptr, this.ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return takeObject(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @param {string} json
     * @returns {Withdrawals}
     */
    static from_json(json) {
      try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.withdrawals_from_json(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
          throw takeObject(r1);
        }
        return Withdrawals.__wrap(r0);
      } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
      }
    }
    /**
     * @returns {Withdrawals}
     */
    static new() {
      const ret = wasm.withdrawals_new();
      return Withdrawals.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    len() {
      const ret = wasm.withdrawals_len(this.ptr);
      return ret >>> 0;
    }
    /**
     * @param {RewardAddress} key
     * @param {BigNum} value
     * @returns {BigNum | undefined}
     */
    insert(key, value) {
      _assertClass(key, RewardAddress);
      _assertClass(value, BigNum);
      const ret = wasm.withdrawals_insert(this.ptr, key.ptr, value.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @param {RewardAddress} key
     * @returns {BigNum | undefined}
     */
    get(key) {
      _assertClass(key, RewardAddress);
      const ret = wasm.withdrawals_get(this.ptr, key.ptr);
      return ret === 0 ? undefined : BigNum.__wrap(ret);
    }
    /**
     * @returns {RewardAddresses}
     */
    keys() {
      const ret = wasm.withdrawals_keys(this.ptr);
      return RewardAddresses.__wrap(ret);
    }
  }


  return {
    internal: wasm,

    // functions
    hash_transaction,

    // constants / enums / type kinds

    DatumKind,
    CertificateKind,
    MIRPot,
    MIRKind,
    RelayKind,
    NativeScriptKind,
    NetworkIdKind,
    LanguageKind,
    PlutusDataKind,
    RedeemerTagKind,
    ScriptKind,
    PlutusDatumSchema,
    ScriptSchema,
    TransactionMetadatumKind,
    MetadataJsonSchema,
    StakeDistributionKind,
    AddrtypeKind,
    SpendingDataKind,
    StakeCredKind,
    AddressHeaderKind,
    CoinSelectionStrategyCIP2,
    ChangeSelectionAlgo,
    ScriptHashNamespace,

    // classes

    AddrAttributes,
    Address,
    AddressContent,
    AddressId,
    AssetName,
    AssetNames,
    Assets,
    AuxiliaryData,
    AuxiliaryDataHash,
    AuxiliaryDataSet,
    BaseAddress,
    BigInt,
    BigNum,
    Bip32PrivateKey,
    Bip32PublicKey,
    Block,
    BlockBodyHash,
    BlockHeaderHash,
    BootstrapEraDistr,
    BootstrapWitness,
    BootstrapWitnesses,
    ByronAddrType,
    ByronAddress,
    ByronScript,
    ByronTxout,
    Certificate,
    CertificateBuilderResult,
    Certificates,
    ConstrPlutusData,
    CostModel,
    Costmdls,
    Crc32,
    DNSRecordAorAAAA,
    DNSRecordSRV,
    DataHash,
    Datum,
    Ed25519KeyHash,
    Ed25519KeyHashes,
    Ed25519Signature,
    EnterpriseAddress,
    ExUnitPrices,
    ExUnits,
    GeneralTransactionMetadata,
    GenesisDelegateHash,
    GenesisHash,
    GenesisHashes,
    GenesisKeyDelegation,
    HDAddressPayload,
    Header,
    HeaderBody,
    InputBuilderResult,
    Int,
    Ipv4,
    Ipv6,
    KESSignature,
    KESVKey,
    Language,
    Languages,
    LegacyDaedalusPrivateKey,
    LinearFee,
    MIRToStakeCredentials,
    MetadataList,
    MetadataMap,
    Mint,
    MintAssets,
    MintBuilderResult,
    MoveInstantaneousReward,
    MoveInstantaneousRewardsCert,
    MultiAsset,
    MultiHostName,
    NativeScript,
    NativeScriptWitnessInfo,
    NativeScripts,
    NetworkId,
    NetworkInfo,
    Nonce,
    OperationalCert,
    PartialPlutusWitness,
    PlutusData,
    PlutusList,
    PlutusMap,
    PlutusScript,
    PlutusScriptWitness,
    PlutusV1Script,
    PlutusV1Scripts,
    PlutusV2Script,
    PlutusV2Scripts,
    Pointer,
    PointerAddress,
    PoolMetadata,
    PoolMetadataHash,
    PoolParams,
    PoolRegistration,
    PoolRetirement,
    PrivateKey,
    ProposedProtocolParameterUpdates,
    ProtocolMagic,
    ProtocolParamUpdate,
    ProtocolVersion,
    PublicKey,
    PublicKeys,
    Redeemer,
    RedeemerTag,
    RedeemerWitnessKey,
    Redeemers,
    Relay,
    Relays,
    RequiredWitnessSet,
    RewardAddress,
    RewardAddresses,
    Script,
    ScriptAll,
    ScriptAny,
    ScriptDataHash,
    ScriptHash,
    ScriptHashes,
    ScriptNOfK,
    ScriptPubkey,
    ScriptRef,
    SignedTxBuilder,
    SingleCertificateBuilder,
    SingleHostAddr,
    SingleHostName,
    SingleInputBuilder,
    SingleKeyDistr,
    SingleMintBuilder,
    SingleOutputBuilderResult,
    SingleWithdrawalBuilder,
    SpendingData,
    SpendingDataPubKeyASD,
    SpendingDataRedeemASD,
    SpendingDataScriptASD,
    StakeCredential,
    StakeCredentials,
    StakeDelegation,
    StakeDeregistration,
    StakeDistribution,
    StakeRegistration,
    StakeholderId,
    Strings,
    TimelockExpiry,
    TimelockStart,
    Transaction,
    TransactionBodies,
    TransactionBody,
    TransactionBuilder,
    TransactionBuilderConfig,
    TransactionBuilderConfigBuilder,
    TransactionHash,
    TransactionIndexes,
    TransactionInput,
    TransactionInputs,
    TransactionMetadatum,
    TransactionMetadatumLabels,
    TransactionOutput,
    TransactionOutputAmountBuilder,
    TransactionOutputBuilder,
    TransactionOutputs,
    TransactionUnspentOutput,
    TransactionUnspentOutputs,
    TransactionWitnessSet,
    TransactionWitnessSetBuilder,
    TransactionWitnessSets,
    TxRedeemerBuilder,
    URL,
    UnitInterval,
    UntaggedRedeemer,
    Update,
    VRFCert,
    VRFKeyHash,
    VRFVKey,
    Value,
    Vkey,
    Vkeys,
    Vkeywitness,
    Vkeywitnesses,
    WithdrawalBuilderResult,
    Withdrawals,

    Buffer,
  }
}

// other utils
export const getBaseAddress = async (wasm, api) => {
  return await api.getUsedAddresses().then((addresses) => {
    return wasm.BaseAddress.from_address(
      wasm.Address.from_bytes(
        Buffer.from(addresses[0], 'hex')
      )
    )
  })
}
export const getAddr = (bAddr) => { return bAddr.to_address().to_bech32(); }
export const getStakeKey = (bAddr) => { return Buffer.from(bAddr.stake_cred().to_keyhash().to_bytes().buffer).toString("hex") }
export const getStakeAddr = (wasm, bAddr) => {
  let reward_addr_bytes = new Uint8Array(29)
  // TODO: should consider network id
  reward_addr_bytes.set([0xe1], 0)
  reward_addr_bytes.set(bAddr.stake_cred().to_bytes().slice(4, 32), 1)

  return wasm.RewardAddress.from_address(wasm.Address.from_bytes(reward_addr_bytes)).to_address().to_bech32()
}

// delegation
const getStakeDelegationCertificate = (wasm, addr_bech32, pool_bech32) => {
  const stakeCred = wasm.BaseAddress.from_address(
    wasm.Address.from_bech32(addr_bech32)).stake_cred()
  const poolKeyHash = wasm.Ed25519KeyHash.from_bech32(pool_bech32)
  const stakeDelegation = wasm.StakeDelegation.new(stakeCred, poolKeyHash)
  const certificate = wasm.Certificate.new_stake_delegation(stakeDelegation)
  stakeCred.free()
  poolKeyHash.free()
  stakeDelegation.free()
  return certificate
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

  const ex_unit_prices = wasm.ExUnitPrices.new(
    wasm.UnitInterval.new(wasm.BigNum.from_str('577'), wasm.BigNum.from_str('10000')),
    wasm.UnitInterval.new(wasm.BigNum.zero('721'), wasm.BigNum.from_str('10000000')))
  const txBuilderCfgBuilder =
    wasm.TransactionBuilderConfigBuilder.new()
        .fee_algo(wasm.LinearFee.new(
          wasm.BigNum.from_str('44'),
          wasm.BigNum.from_str('155381')
        ))
        .pool_deposit(wasm.BigNum.from_str('500000000'))
        .key_deposit(wasm.BigNum.from_str('2000000'))
        .max_value_size(5000)
        .max_tx_size(16384)
        .coins_per_utxo_byte(wasm.BigNum.from_str('4310'))
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
  const utxos = wasm.TransactionUnspentOutputs.new()
  await api.getUtxos().then(
    _utxos => _utxos.map(
      _utxo => {
        let utxo = wasm.TransactionUnspentOutput.from_bytes(
          Buffer.from(_utxo, "hex"))
        utxos.add(utxo)
        utxo.free()
      }))
  return utxos
}

const getOneUtxo = async (api, wasm, allowMultiAsset) => {
  let found = null
  const utxos = await getUtxos(api, wasm)
  for (let i = 0; i < utxos.len(); i++) {
    const utxo = utxos.get(i)
    if (allowMultiAsset) {
      found = utxo
      break
    }
    const o = utxo.output()
    const ov = o.to_js_value()
    o.free()
    if ((ov.amount||{}).multiasset) {
      utxo.free()
      continue
    }
    found = utxo
    break
  }
  utxos.free()
  return found
}

const getChangeAddr = async (api, wasm) => {
  return wasm.Address.from_bytes(Buffer.from(await api.getChangeAddress(), 'hex'))
}

const getUtxosAndChangeAddr = async (api, wasm) => {
  return await Promise.all([
    getUtxos(api, wasm),
    getChangeAddr(api, wasm)
  ]).then(r => { return {utxos: r[0], changeAddr: r[1]}})
}

function asHexAndFree(obj) {
  try {
    return Buffer.from(obj.to_bytes().buffer).toString('hex')
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
  const tws = wasm.TransactionWitnessSet.from_bytes(Buffer.from(witset_, 'hex'))
  const _tx = wasm.Transaction.from_bytes(Buffer.from(tx_, 'hex'))
  const txBody = _tx.body()
  const auxData = _tx.auxiliary_data()
  _tx.free()
  const _signedTx = wasm.Transaction.new(txBody, tws, auxData)
  if (auxData !== undefined) {
    //auxData.free() // don't free this, it is already a nulled ptr
    auxData.free()
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
  const tws = wasm.TransactionWitnessSet.from_bytes(Buffer.from(witset_, 'hex'))
  const twsb = wasm.TransactionWitnessSetBuilder.new()
  twsb.add_existing(tws)
  tws.free()
  const tx = wasm.Transaction.from_bytes(Buffer.from(tx_, 'hex'))
  const stb = wasm.SignedTxBuilder.new_with_data(tx.body(), twsb, true, tx.auxiliary_data())
  tx.free()
  twsb.free()
  signedTx = stb.build()
  stb.free()
  return asHexAndFree(signedTx)
}

export const assembleWitnessSet = (wasm, ...witset_vkey_hexes) => {
  const twsb = wasm.TransactionWitnessSetBuilder.new()
  for (let vkey_hex of witset_vkey_hexes) {
    const vkey = wasm.Vkeywitness.from_bytes(Buffer.from(vkey_hex, 'hex'))
    twsb.add(vkey)
    vkey.free()
  }
  witset = twsb.build()
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
