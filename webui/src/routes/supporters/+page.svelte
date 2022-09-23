<svelte:head>
<title>F2LB Supporters</title>
</svelte:head>

<script>
  import { page } from '$app/stores';
  import { supportersList, serviceClients } from '$lib/stores'
  import Supporter from '$lib/Supporter.svelte'
  import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'
</script>

<section class="section has-text-centered">
  <h1 class="title">F2LB Supporters <a class="is-hidden-desktop" href="/"><span class="icon is-small has-text-dark"><FaArrowLeft /></span></a></h1>
</section>

<section>
  <article>
    <div class="box box-out">
      {#each $supportersList as s}
        <Supporter supporter={s} />
      {/each}
    </div>
  </article>
</section>
