<script>
  export let data = {};
  $: progress = (data.slot * 100 / 432000).toFixed(2)
</script>

<div class="has-text-centered">
  <p>
    {#if !data.cache_ready }
      <span class="loader is-pulled-left"></span>
    {/if}
    epoch {data.epoch} ( {data.slot} / 432000 ) {progress} %
  </p>
  <!-- <progress class="progress is-link" value={progress} max="100"> epoch {data.epoch} ( {data.slot} / 432000) </progress> -->
</div>
