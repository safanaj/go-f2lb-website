<script module>
 let cardano = window.cardano;
</script>
<script>
 import { createBubbler } from 'svelte/legacy';

 const bubble = createBubbler();
 /**
  * @typedef {Object} Props
  * @property {any} [wallet]
  * @property {string} [text]
  * @property {string} [id]
  */

 /** @type {Props} */
 let { wallet = {}, text = 'Connect', id = 'cardano-connect-button' } = $props();
</script>

<button id={id} class="button" onclick={bubble('click')}>
  {#if wallet.address !== undefined }
    <span class="icon is-small"><img alt={wallet.name} src={cardano[wallet.name].icon} /></span>
    <span>{wallet.address.slice(0, 10) + "..."}</span>
  {:else}
  {text}
  {/if}
</button>

<style>
  .button {
      margin-top: 4px;
  }
</style>
