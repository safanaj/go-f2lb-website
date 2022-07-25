<svelte:head>
<title>Addon Queue</title>
</svelte:head>

<script>
  import { addonQueueMembers, serviceClients } from '$lib/stores'
  import Member from '$lib/Member.svelte'

  if ($addonQueueMembers.length == 0) {
      new Promise((resolve, reject) => {
          $serviceClients.AddonQueue.listQueue(new Empty(), (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(r => addonQueueMembers.set(r.toObject().membersList))
  }
</script>


<section>
  <article>
    <h2>Addon Queue</h2>
    <div class="box">
      {#each $addonQueueMembers as m}
        <Member member={m} />
      {/each}
    </div>
  </article>
</section>
