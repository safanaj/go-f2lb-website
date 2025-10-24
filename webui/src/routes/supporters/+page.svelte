<svelte:head>
  <title>F2LB Supporters</title>
</svelte:head>

<script>
 import { page } from '$app/state'
 import { supportersSet } from '$lib/state.svelte'
 import Supporter from '$lib/Supporter.svelte'
 import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'
 import { createClient } from "@connectrpc/connect";
 import { createConnectTransport } from "@connectrpc/connect-web";
 import { SupporterService } from "$lib/api/v2/supporters_pb.js";

 const supCli = createClient(SupporterService, createConnectTransport({baseUrl: page.url.origin}));

 if (supportersSet.size == 0) {
   supCli.list().then(list => {
     for (const m of list.supporters) { supportersSet.add(m) }
   })
 }

</script>

<section class="section has-text-centered">
  <h1 class="title">F2LB Supporters <a class="is-hidden-desktop" href="/"><span class="icon is-small has-text-dark"><FaArrowLeft /></span></a></h1>
</section>

<section>
  <article>
    <div class="box box-out">
      {#each supportersSet as s}
        <Supporter supporter={s} />
      {/each}
    </div>
  </article>
</section>
