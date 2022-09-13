<svelte:head>
<title>Welcome</title>
</svelte:head>

<script>
  import {User} from '$lib/pb/control_pb';
  import { mainQueueMembers, addonQueueMembers, serviceClients, epochData, cardanoWallet, activePool} from '$lib/stores'
  import Member from '$lib/Member.svelte'
  // import { doCallInPromise } from '$lib/utils'
  import FaArrowRight from 'svelte-icons/fa/FaArrowRight.svelte'

  $: mainServed = $mainQueueMembers[0];
  $: epochProgress = Object.keys($epochData).length > 0 ? ($epochData.slot * 100 / 432000).toFixed(2) : 0;
  $: user = $cardanoWallet.user

</script>

<section class="section">
  <div class="columns m-0 has-text-centered">
    <div class="column">
      <h1 class="block">Welcome to F2LB (unofficial) Website</h1>
      <p class="block">Visit <a href="https://www.f2lb.org/">F2LB</a> to read about the project and the community</p>
      <p class="block">Visit also <a href="https://f2lb.info/">F2LB.info</a></p>
      {#if $activePool !== null && ($activePool||{activestake: 0}).activestake > 0}
      <div class="box themed">
        The F2LB community stake was delegated to the pool {$activePool.ticker} that now has {$activePool.activestake} ADA of active stake,
        now we are delegating to {mainServed.ticker}
      </div>
      {/if}
      {#if user !== undefined}
      <br />
      <div class="box box-out box-user">
      {#if user.type === User.Type.VISITOR}
        <p>Hello <span class="text truncate">{user.stakeaddress}</span> !</p>
        <p>Thanks to visit this website, and if you did not do yet, please join our community.</p>
        <p>If you want to contribute to ensure Cardano decentralization, consider to be a sponsor of F2LB Community.</p>
        <p>If you are a small and single pool operator, join us ...</p>
      {:else if user.type === User.Type.SUPPORTER}
        <p>Hello <span class="text truncate">{user.supporter.discordid}</span> !</p>
        <p>Thanks for supporting our community.</p>
      {:else if user.type === User.Type.SPO}
        <p>Hello <span class="text truncate">{user.member.ticker}</span> !</p>
        <p>Thanks to visit this website, your status is explained below ...</p>
      {/if}
      <button class="button" disabled>Delegate to the SPO on top of the queue, currently {mainServed.ticker}</button>
      </div>
      {/if}
    </div>
  </div>
</section>

<section class="section">
  <div class="columns m-0 has-text-centered">
    <div class="column is-half">
      <p>Main Queue <a class="is-hidden-desktop" href="/main-queue"><span class="icon is-small has-text-dark"><FaArrowRight /></span></a></p>
      <div class="box box-out">
        {#each $mainQueueMembers as m}
          <Member member={m} shortinfo epochProgress={epochProgress} mainServed={mainServed} toBoxLinkPrefix="/main-queue" />
        {/each}
      </div>
    </div>
    <div class="column is-half">
      <p>Addon Queue <a class="is-hidden-desktop" href="/addon-queue"><span class="icon is-small has-text-dark"><FaArrowRight /></span></a></p>
      <div class="box box-out">
        {#each $addonQueueMembers as m}
          <Member member={m} shortinfo addonqueue toBoxLinkPrefix="/addon-queue" idBoxHashPrefix="aq" />
        {/each}
      </div>
    </div>
  </div>
</section>
