<svelte:head>
<title>Main Queue</title>
</svelte:head>

<script>
  import { mainQueueMembers, epochData } from '$lib/stores'
  import Member from '$lib/Member.svelte'
  import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'

  $: mainServed = $mainQueueMembers[0];
  $: epochProgress = Object.keys($epochData).length > 0 ? ($epochData.slot * 100 / 432000).toFixed(2) : 0;

</script>


<section>
  <article>
    <h2>Main Queue <a class="is-hidden-desktop" href="/"><span class="icon is-small has-text-dark"><FaArrowLeft /></span></a></h2>
    <div class="box box-out">
      {#each $mainQueueMembers as m}
        <Member member={m} epochProgress={epochProgress} mainServed={mainServed} />
      {/each}
    </div>
  </article>
</section>
