<script>
  export let wallet = {}
  export let text = 'Connect'
  export let id = 'cardano-connect-button'
</script>

<button id={id} class="button" on:click>
  {#if Object.keys(wallet).length > 0}
    <span class="icon is-small"><img alt={wallet.name} src={wallet.icon} /></span>
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
