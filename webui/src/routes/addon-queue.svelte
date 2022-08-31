<svelte:head>
<title>Addon Queue</title>
</svelte:head>

<script>
  import { addonQueueMembers } from '$lib/stores'
  import Member from '$lib/Member.svelte'
  // import { doCallInPromise } from '$lib/utils'
  import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'

  // if ($addonQueueMembers.length == 0) {
  //     // doCallInPromise($serviceClients, 'AddonQueue', 'listQueue', addonQueueMembers, 'membersList')
  // }
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
      {#each $addonQueueMembers as m}
        <Member member={m} addonqueue />
      {/each}
    </div>
  </article>
</section>
