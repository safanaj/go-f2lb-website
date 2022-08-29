<script>
  import "../app.scss";

  import { tick } from 'svelte';
  import EpochBar from "$lib/EpochBar.svelte";
  import UserBox from "$lib/UserBox.svelte";
  import Header from "$lib/header/Header.svelte";
  import { page } from '$app/stores';
  import { serviceClients, epochData, mainQueueMembers, addonQueueMembers, supportersList, cardanoWallet } from '$lib/stores';
  import { doCallInPromise } from '$lib/utils';
  import { User, ControlMsg } from '$lib/pb/control_pb';

  $: mainServed = $mainQueueMembers[0];
  $: user = $cardanoWallet.user

  if ($serviceClients.Control === null) {
      serviceClients.getControlServiceClient($page.url.origin)
  }
  if ($serviceClients.Supporter === null) {
      serviceClients.getSupporterServiceClient($page.url.origin)
  }
  if ($serviceClients.MainQueue === null) {
      serviceClients.getMainQueueServiceClient($page.url.origin)
  }
  if ($serviceClients.AddonQueue === null) {
      serviceClients.getAddonQueueServiceClient($page.url.origin)
  }

  // setup control handler via websocket
  $serviceClients.ControlHandler.on('data', cmsg => {
      let obj = cmsg.toObject()
      let dat = JSON.parse(obj.data)
      epochData.set({
          date: obj.date,
          epoch: obj.epoch,
          slot: obj.slot,
          cache_ready: dat.cache_ready,
          last_refresh_time: dat.last_refresh_time,
          notes: dat.notes
      })
      if (obj.type == ControlMsg.Type.REFRESH) {
          Promise.all([
              doCallInPromise($serviceClients, 'MainQueue', 'listQueue', mainQueueMembers, 'membersList'),
              doCallInPromise($serviceClients, 'AddonQueue', 'listQueue', addonQueueMembers, 'membersList'),
              doCallInPromise($serviceClients, 'Supporter', 'list', supportersList, 'supportersList'),
          ]).then(tick)
      }
  })
</script>

<div class="epoch-bar">
{#if $page.url.pathname != "/about"}
<EpochBar data={$epochData} />
{/if}
</div>

<Header />

<main>

  {#if $page.url.pathname !== '/' && $page.url.pathname !== '/about'}
    <UserBox user={$cardanoWallet.user} />
  {/if}

<section class="section">
  <div class="columns m-0 has-text-centered">
    <div class="column">
      <h1>Welcome to F2LB (unofficial) Website</h1>
      <p>Visit <a href="https://www.f2lb.org/">F2LB</a> to read about the project and the community</p>
      <p>Visit also <a href="https://f2lb.info/">F2LB.info</a></p>
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

  <slot />
</main>

<footer>
  <p>
    visit <a href="https://www.f2lb.org/">F2LB</a> to learn about First 2 Lifetime
    Block community
  </p>
  <span class="is-pulled-left">version: {__APP_VERSION__}</span>
</footer>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }

  .epoch-bar {
      min-height: 24px;
      max-height: 24px;
  }

</style>
