<svelte:head>
<title>Welcome</title>
</svelte:head>

<script>
  import { page } from '$app/stores';
  import { mainQueueMembers, addonQueueMembers, serviceClients} from '$lib/stores'
  import {Empty} from "google-protobuf/google/protobuf/empty_pb";
  import Member from '$lib/Member.svelte'

  if ($mainQueueMembers.length == 0) {
      new Promise((resolve, reject) => {
          $serviceClients.MainQueue.listQueue(new Empty(), (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(r => mainQueueMembers.set(r.toObject().membersList))
  }

  if ($addonQueueMembers.length == 0) {
      new Promise((resolve, reject) => {
          $serviceClients.AddonQueue.listQueue(new Empty(), (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(r => addonQueueMembers.set(r.toObject().membersList))
  }
</script>

<section>
  <div class="columns m-0 has-text-centered">
  <div class="column">
  <h1>Welcome to F2LB (unofficial) Website</h1>
  <p>Visit <a href="https://www.f2lb.org/">F2LB</a> to read the documentation</p>
  </div>
  </div>
</section>

<section>
<article>
  <div class="columns m-0 has-text-centered">
    <div class="column is-half">
      <div class="box">
        {#each $mainQueueMembers as m}
          <Member member={m} shortinfo />
        {/each}
      </div>
    </div>
    <div class="column is-half">
      <div class="box">
        {#each $addonQueueMembers as m}
          <Member member={m} shortinfo />
        {/each}
      </div>
    </div>
  </div>
</article>
</section>
