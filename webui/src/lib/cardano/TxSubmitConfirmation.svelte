<script context="module">
  // import {
  //     useCardanoSerializationLib,
  // } from '$lib/cardano/csl.js'
  import {
      useCardanoMultiPlatformLib,
  } from '$lib/cardano/cml.js'
  import { Buffer } from 'buffer';

  let wasm = {}

  // useCardanoSerializationLib().then(x => { wasm = {...x} })
  useCardanoMultiPlatformLib().then(x => { wasm = {...x} })

</script>

<script>
  import { onMount, createEventDispatcher } from 'svelte'

  export let txCborHex;

  let wModalEl;
  let txJson;

  const dispatch = createEventDispatcher();
  const EVENT = {
      confirm: 'TxSubmitConfirmed',
      discard: 'TxSubmitDiscarded'
  }

  const openModal = () => wModalEl.classList.add("is-active")
  const closeModal = () => wModalEl.classList.remove("is-active")

  const discard = () => { closeModal(); dispatch(EVENT.discard); }
  const confirm = () => { closeModal(); dispatch(EVENT.confirm); }

  onMount(() => {
      if (txCborHex !== undefined && txCborHex !== null) {
          const tx_ = wasm.Transaction.from_bytes(Buffer.from(txCborHex, 'hex'))
          txJson = JSON.stringify(tx_.to_js_value(), null, 2)
          tx_.free()
          openModal()
      } else {
          closeModal()
      }
  })
</script>

<div class="modal" bind:this={wModalEl}>
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Signed delegation transaction to submit</p>
      <button class="delete" on:click={discard}></button>
    </header>
    <section class="modal-card-body">
      <pre>{txJson}</pre>
      <hr />
      <pre>{txCborHex}</pre>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-danger" on:click={discard}>Discard</button>
      <button class="button is-primary" on:click={confirm}>Confirm</button>
    </footer>
  </div>
</div>

<style>
  .modal-card {
      width: 960px;
  }
</style>
