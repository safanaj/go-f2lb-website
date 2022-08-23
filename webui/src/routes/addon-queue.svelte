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


<section>
  <article>
    <h2>Addon Queue <a class="is-hidden-desktop" href="/">
        <span class="icon is-small has-text-dark">
          <FaArrowLeft />
        </span>
      </a>
    </h2>
    <div class="box box-out">
      {#each $addonQueueMembers as m}
        <Member member={m} />
      {/each}
    </div>
  </article>
</section>
