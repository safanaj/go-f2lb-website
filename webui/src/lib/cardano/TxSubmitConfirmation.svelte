<script module>
 import * as wasm from '@dcspark/cardano-multiplatform-lib-browser'
</script>

<script>
  import { onMount, createEventDispatcher } from 'svelte'

  let { onDiscard, onConfirm, txCborHex } = $props();

  let wModalEl = $state();
  let txJson = $state();

  const openModal = () => wModalEl.classList.add("is-active")
  const closeModal = () => wModalEl.classList.remove("is-active")

  const discard = () => { closeModal(); onDiscard(); }
  const confirm = () => { closeModal(); onConfirm(); }

  onMount(() => {
    if (txCborHex !== undefined && txCborHex !== null) {
      const tx_ = wasm.Transaction.from_cbor_hex(txCborHex)
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
      <button class="delete" onclick={discard}></button>
    </header>
    <section class="modal-card-body">
      <pre>{txJson}</pre>
      <hr />
      <pre>{txCborHex}</pre>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-danger" onclick={discard}>Discard</button>
      <button class="button is-primary" onclick={confirm}>Confirm</button>
    </footer>
  </div>
</div>

<style>
  .modal-card {
      width: 960px;
  }
</style>
