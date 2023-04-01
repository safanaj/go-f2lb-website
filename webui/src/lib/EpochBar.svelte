<script>
  export let data = {};
  $: progress = (data.slot * 100 / 432000).toFixed(2)

  // const setProgressBar = (node) => {
  //     console.log("Node pre", node)
  //     if (progress.toString() !== 'NaN') {
  //         node.value = parseInt(progress)
  //     }
  //     console.log("Node post", node)
  //     return {
  //         destroy: () => {}
  //     }
  // }

</script>

<div class="has-text-centered">
  <p>
    {#if !data.cache_ready }
      <span class="is-pulled-left is-hidden-touch">Koios caches are refreshing</span>
      <span class="loader is-inline-block is-pulled-left ml-1"></span>
    {:else}
      <span class="is-pulled-left is-hidden-touch">Koios caches are ready</span>
    {/if}
    <span class="is-inline-block">
      epoch {data.epoch} ( {data.slot} / 432000 ) {progress} % ( ~ {data.epoch_remaining_duration} ) [ tip: {data.koios_tip_block_height} ]
    </span>

    {#if data.last_refresh_time }
    <span class="is-inline-block is-pulled-right">gsheet synced at: {data.last_refresh_time}</span>
    {/if}

  </p>
  <!-- <progress use:setProgressBar class="progress is-link is-inline-block" value="0" max="100"></progress> -->
</div>
