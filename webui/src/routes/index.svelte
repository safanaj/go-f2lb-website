<svelte:head>
<title>Welcome</title>
</svelte:head>

<script>
  import { page } from '$app/stores';
  import { mainQueueMembers, addonQueueMembers, serviceClients, epochData} from '$lib/stores'
  import Member from '$lib/Member.svelte'
  // import { doCallInPromise } from '$lib/utils'
  import FaArrowRight from 'svelte-icons/fa/FaArrowRight.svelte'

  $: mainServed = $mainQueueMembers[0];
  $: epochProgress = Object.keys($epochData).length > 0 ? ($epochData.slot * 100 / 432000).toFixed(2) : 0;

  // if ($mainQueueMembers.length == 0) {
  //     // doCallInPromise($serviceClients, 'MainQueue', 'listQueue', mainQueueMembers, 'membersList')
  // }

  // if ($addonQueueMembers.length == 0) {
  //     // doCallInPromise($serviceClients, 'AddonQueue', 'listQueue', addonQueueMembers, 'membersList')
  //}
</script>

<section class="section">
  <div class="columns m-0 has-text-centered">
    <div class="column">
      <h1>Welcome to F2LB (unofficial) Website</h1>
      <p>Visit <a href="https://www.f2lb.org/">F2LB</a> to read the documentation</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="columns m-0 has-text-centered">
    <div class="column is-half">
      <p>Main Queue <a class="is-hidden-desktop" href="/main-queue"><span class="icon is-small has-text-dark"><FaArrowRight /></span></a></p>
      <div class="box">
        {#each $mainQueueMembers as m}
          <Member member={m} shortinfo epochProgress={epochProgress} mainServed={mainServed}/>
        {/each}
      </div>
    </div>
    <div class="column is-half">
      <p>Addon Queue <a class="is-hidden-desktop" href="/addon-queue"><span class="icon is-small has-text-dark"><FaArrowRight /></span></a></p>
      <div class="box">
        {#each $addonQueueMembers as m}
          <Member member={m} shortinfo />
        {/each}
      </div>
    </div>
  </div>
</section>
