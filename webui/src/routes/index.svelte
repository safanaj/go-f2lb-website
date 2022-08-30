<svelte:head>
<title>Welcome</title>
</svelte:head>

<script>
  import {User} from '$lib/pb/control_pb';
  import { mainQueueMembers, addonQueueMembers, serviceClients, epochData, cardanoWallet} from '$lib/stores'
  import Member from '$lib/Member.svelte'
  // import { doCallInPromise } from '$lib/utils'
  import FaArrowRight from 'svelte-icons/fa/FaArrowRight.svelte'

  $: mainServed = $mainQueueMembers[0];
  $: epochProgress = Object.keys($epochData).length > 0 ? ($epochData.slot * 100 / 432000).toFixed(2) : 0;
  $: user = $cardanoWallet.user

</script>

<section class="section">
  <div class="columns m-0 has-text-centered">
    <div class="column is-half">
      <p>Main Queue <a class="is-hidden-desktop" href="/main-queue"><span class="icon is-small has-text-dark"><FaArrowRight /></span></a></p>
      <div class="box box-out">
        {#each $mainQueueMembers as m}
          <Member member={m} shortinfo epochProgress={epochProgress} mainServed={mainServed}/>
        {/each}
      </div>
    </div>
    <div class="column is-half">
      <p>Addon Queue <a class="is-hidden-desktop" href="/addon-queue"><span class="icon is-small has-text-dark"><FaArrowRight /></span></a></p>
      <div class="box box-out">
        {#each $addonQueueMembers as m}
          <Member member={m} shortinfo addonqueue />
        {/each}
      </div>
    </div>
  </div>
</section>
