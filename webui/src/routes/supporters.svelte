<svelte:head>
<title>F2LB Supporters</title>
</svelte:head>

<script>
  import { page } from '$app/stores';
  import { supportersList, serviceClients } from '$lib/stores'
  import Supporter from '$lib/Supporter.svelte'
  // import { doCallInPromise } from '$lib/utils'

  if ($supportersList.length == 0) {
      // doCallInPromise($serviceClients, 'Supporter', 'list', supportersList, 'supportersList')
  }
</script>


<section>
  <article>
    <h2>F2LB Supporters</h2>
    <div class="box">
      {#each $supportersList as s}
        <Supporter supporter={s} />
      {/each}
    </div>
  </article>
</section>
