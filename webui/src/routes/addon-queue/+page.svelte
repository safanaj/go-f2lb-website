<svelte:head>
  <title>Addon Queue</title>
</svelte:head>

<script>
 import { page } from '$app/state'
 import { addonQueueMembersSet, epochDataInfo } from '$lib/state.svelte'
 import Member from '$lib/Member.svelte'
 import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'
 import { createClient } from "@connectrpc/connect";
 import { createConnectTransport } from "@connectrpc/connect-web";
 import { AddonQueueService } from "$lib/api/v2/addon_queue_pb.js";

 const aqCli = createClient(AddonQueueService, createConnectTransport({baseUrl: page.url.origin}));
 const epochData = $derived(epochDataInfo.data)

 if (addonQueueMembersSet.size == 0) {
   aqCli.listQueue().then(queue => {
     for (const m of queue.members) { addonQueueMembersSet.add(m) }
   })
 }
 // 
 //  window.AddonQueue = addonQueueMembersSet
</script>

<section class="section has-text-centered">
  <h1 class="title">Addon Queue <a class="is-hidden-desktop" href="/">
      <span class="icon is-small has-text-dark">
        <FaArrowLeft />
      </span>
    </a>
  </h1>
</section>

<section>
  <article>
    <div class="box box-out">
      {#each addonQueueMembersSet as m}
        <Member member={m} addonqueue koiosTip={epochData.koios_tip_block_height} />
      {/each}
    </div>
  </article>
</section>
