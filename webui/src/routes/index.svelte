<script context="module">
  import {
      useCardanoSerializationLib,
      getDelegationSignedTx
  } from '$lib/cardano/csl.js'

  let cardano = window.cardano;
  let wasm = {}
  let wasm2 = {}

  useCardanoSerializationLib().then(x => { wasm = {...x} })

</script>

<svelte:head>
<title>Welcome</title>
</svelte:head>

<script>
  import {User} from '$lib/pb/control_pb';
  import {
      mainQueueMembers, addonQueueMembers, serviceClients,
      epochData, cardanoWallet, activePool, topPool
  } from '$lib/stores'
  import Member from '$lib/Member.svelte'
  // import { doCallInPromise } from '$lib/utils'
  import FaArrowRight from 'svelte-icons/fa/FaArrowRight.svelte'

  $: mainServed = $mainQueueMembers[0];
  $: epochProgress = Object.keys($epochData).length > 0 ? ($epochData.slot * 100 / 432000).toFixed(2) : 0;
  $: user = $cardanoWallet.user
  $: wrongPool = (user||{}).delegatedpool != (mainServed||{}).ticker && (user||{}).delegatedpool != (mainServed||{}).poolidbech32
  $: topTicker = ($topPool || {}).ticker || ''

  const isWrongPool = user => user !== undefined && (user.delegatedpool != mainServed.ticker && user.delegatedpool != mainServed.poolidbech32)

  const doDelegation = () => {
      let {api, wasm, address} = $cardanoWallet
      getDelegationSignedTx(api, wasm, address, mainServed.poolidbech32)
          .then(api.submitTx)
          .then(console.log)
          .catch(console.log)
  }

</script>

<section class="section">
  <div class="columns m-0 has-text-centered">
    <div class="column">
      <h1 class="block">Welcome to F2LB (unofficial) Website</h1>
      <p class="block">Visit <a href="https://www.f2lb.org/">F2LB</a> to read about the project and the community</p>
      <!-- <p class="block">Visit also <a href="https://f2lb.info/">F2LB.info</a></p> -->
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
      {#key $cardanoWallet.stakeKey}
        {#if wrongPool}
          <button class="button" on:click={doDelegation}>Delegate to the SPO on top of the queue, currently {mainServed.ticker}</button>
        {/if}
      {/key}

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
        {#each $mainQueueMembers as m, idx}
          <Member member={m} shortinfo {epochProgress} {mainServed} toBoxLinkPrefix="/main-queue"
                  isFirst={idx == 0} {topTicker}  />
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
