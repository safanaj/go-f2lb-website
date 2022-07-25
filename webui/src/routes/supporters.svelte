<svelte:head>
<title>F2LB Supporters</title>
</svelte:head>

<script>
  import { page } from '$app/stores';
  import { supportersList, serviceClients } from '$lib/stores'
  import {Empty} from "google-protobuf/google/protobuf/empty_pb";
  import Supporter from '$lib/Supporter.svelte'

  if ($supportersList.length == 0) {
      new Promise((resolve, reject) => {
          $serviceClients.Supporter.list(new Empty(), (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(r => supportersList.set(r.toObject().supportersList))
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
