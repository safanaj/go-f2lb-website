<svelte:head>
<title>Main Queue</title>
</svelte:head>

<script>
  import { mainQueueMembers, epochData, topPool } from '$lib/stores'
  import Member from '$lib/Member.svelte'
  import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'

  $: mainServed = $mainQueueMembers[0];
  $: epochProgress = Object.keys($epochData).length > 0 ? ($epochData.slot * 100 / 432000).toFixed(2) : 0;
  $: topTicker = ($topPool || {}).ticker || ''

</script>

<section class="section has-text-centered">
  <h1 class="title">Main Queue <a class="is-hidden-desktop" href="/"><span class="icon is-small has-text-dark"><FaArrowLeft /></span></a></h1>
</section>


<section>
  <article>
    <div class="box box-out">
      {#each $mainQueueMembers as m, idx}
        <Member member={m} {epochProgress} {mainServed} isFirst={idx == 0} {topTicker}
                koiosTip={$epochData.koios_tip_block_height} />
      {/each}
    </div>
  </article>
</section>
