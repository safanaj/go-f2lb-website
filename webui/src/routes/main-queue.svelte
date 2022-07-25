<svelte:head>
<title>Main Queue</title>
</svelte:head>

<script>
  import { mainQueueMembers, serviceClients } from '$lib/stores'
  import Member from '$lib/Member.svelte'

  if ($mainQueueMembers.length == 0) {
      new Promise((resolve, reject) => {
          $serviceClients.MainQueue.listQueue(new Empty(), (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(r => mainQueueMembers.set(r.toObject().membersList))
  }
</script>


<section>
  <article>
    <h2>Main Queue</h2>
    <div class="box">
      {#each $mainQueueMembers as m}
        <Member member={m} />
      {/each}
    </div>
  </article>
</section>
