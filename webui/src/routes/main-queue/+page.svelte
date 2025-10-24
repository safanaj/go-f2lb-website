<svelte:head>
  <title>Main Queue</title>
</svelte:head>

<script>
 import { page } from '$app/state'
 import { mainQueueMembersSet, epochDataInfo, memberInfo } from '$lib/state.svelte'
 import Member from '$lib/Member.svelte'
 import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'
 import { createClient } from "@connectrpc/connect";
 import { createConnectTransport } from "@connectrpc/connect-web";
 import { MainQueueService } from "$lib/api/v2/main_queue_pb.js";

 const mqCli = createClient(MainQueueService, createConnectTransport({baseUrl: page.url.origin}));
 const epochData = $derived(epochDataInfo.data)

 let mainServed = $derived(mainQueueMembersSet.values().next().value);
 let epochProgress = $derived(
   Object.keys(epochData).length > 0 ? (epochData.slot * 100 / 432000).toFixed(2) : 0);
 let topTicker = $derived(memberInfo.top?.ticker || 'Unknown')

 if (mainQueueMembersSet.size == 0) {
   mqCli.listQueue().then(queue => {
     for (const m of queue.members) { mainQueueMembersSet.add(m) }
   })
 }

 // window.MainQueue = mainQueueMembersSet
</script>

<section class="section has-text-centered">
  <h1 class="title">Main Queue <a class="is-hidden-desktop" href="/"><span class="icon is-small has-text-dark"><FaArrowLeft /></span></a></h1>
</section>


<section>
  <article>
    <div class="box box-out">
      {#each mainQueueMembersSet as m, idx}
        <Member member={m} {epochProgress} {mainServed} isFirst={idx == 0} {topTicker}
                koiosTip={epochData.koios_tip_block_height} />
      {/each}
    </div>
  </article>
</section>
