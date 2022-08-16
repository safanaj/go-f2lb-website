<script>
  import "../app.scss";

  import { tick } from 'svelte';
  import EpochBar from "$lib/EpochBar.svelte";
  import Header from "$lib/header/Header.svelte";
  import { page } from '$app/stores';
  import { serviceClients, epochData, mainQueueMembers, addonQueueMembers, supportersList } from '$lib/stores'
  import { doCallInPromise } from '$lib/utils'
  import {ControlMsg} from '$lib/pb/control_pb'


  // // add all fontawesome icons
  // import { library, dom } from '@fortawesome/fontawesome-svg-core';
  // import { fas } from '@fortawesome/free-solid-svg-icons';
  // // import { far } from '@fortawesome/free-regular-svg-icons';
  // // import { fab } from '@fortawesome/free-brands-svg-icons';
  // library.add(fas);
  // dom.watch();


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
