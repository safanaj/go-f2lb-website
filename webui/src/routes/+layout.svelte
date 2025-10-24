<script module>
 // @ts-nocheck
 //
 import { themeData } from '$lib/state.svelte';

 const availableThemes = new Set([...themeData.available])
 const initializeTheme = () => {
   if (availableThemes.has(themeData.current)) {
     window.localStorage.theme = themeData.current
     if (themeData.current == availableThemes.values().next().value) {
       document.documentElement.removeAttribute('data-theme')
     } else {
       document.documentElement.setAttribute('data-theme', themeData.current)
     }
   }
 }

 if ((window||{}).localStorage !== undefined) {
   let maybeStoredTheme = window.localStorage.theme
   if (!availableThemes.has(maybeStoredTheme)) {
     maybeStoredTheme = availableThemes.values().next().value
   }
   themeData.current = maybeStoredTheme
 }

</script>

<script>
 import '../app.scss';
 // import favicon from '$lib/assets/favicon.svg';
 import { onMount, tick, setContext } from 'svelte';
 import EpochBar from "$lib/EpochBar.svelte";
 import Header from "$lib/Header.svelte";
 import { page } from '$app/state';
 import { goto } from '$app/navigation';

 import { createClient } from "@connectrpc/connect";
 import { createConnectTransport } from "@connectrpc/connect-web";
 import { ControlMsgService, ControlMsg_Type, User_Type } from "$lib/api/v2/control_pb.js";
 import { AddonQueueService } from "$lib/api/v2/addon_queue_pb.js";
 import { MainQueueService } from "$lib/api/v2/main_queue_pb.js";
 import { MemberService } from "$lib/api/v2/members_pb.js";
 import { SupporterService } from "$lib/api/v2/supporters_pb.js";

 import {
   mainQueueMembersSet, addonQueueMembersSet, supportersSet,
   memberInfo, epochDataInfo
 } from '$lib/state.svelte'

 // react on themeData.current changes
 $effect(initializeTheme)

 let { children } = $props();

 let pageLoaderEl;
 const pageLoaderObj = {};
 setContext('pageLoader', pageLoaderObj)

 const mqCli = createClient(MainQueueService, createConnectTransport({baseUrl: page.url.origin}));
 const aqCli = createClient(AddonQueueService, createConnectTransport({baseUrl: page.url.origin}));
 const suppCli = createClient(SupporterService, createConnectTransport({baseUrl: page.url.origin}));
 const memberCli = createClient(MemberService, createConnectTransport({baseUrl: page.url.origin}));
 const ctrlCli = createClient(ControlMsgService, createConnectTransport({baseUrl: page.url.origin}));

 const handleControlMsgReceived = async (isRefresh, tips) => {
   if (isRefresh) {
     await Promise.allSettled([
       mqCli.listQueue(),
       aqCli.listQueue(),
       suppCli.list(),
       memberCli.active(),
       memberCli.top(),
     ]).then(([mqRes, aqRes, suppRes, active, top]) => {
       if (mqRes.status == 'fulfilled') {
         mainQueueMembersSet.clear()
         for(const m of mqRes.value.members) { mainQueueMembersSet.add(m) }
       }

       if (aqRes.status == 'fulfilled') {
         addonQueueMembersSet.clear()
         for(const m of aqRes.value.members) { addonQueueMembersSet.add(m) }
       }

       if (suppRes.status == 'fulfilled') {
         supportersSet.clear()
         for(const s of suppRes.value.supporters) { supportersSet.add(s) }
       }

       if (active.status == 'fulfilled') {
         memberInfo.active = active.value
       }
       if (top.status == 'fulfilled') {
         memberInfo.top = top.value
       }
     })
   }
   let resetMainQueue = false
   let resetAddonQueue = false
   mainQueueMembersSet.forEach(m => {
     if (tips[m.ticker] !== undefined) {
       resetMainQueue = true
       m.blockHeight = tips[m.ticker]
     }
   })
   addonQueueMembersSet.forEach(m => {
     if (tips[m.ticker] !== undefined) {
       resetAddonQueue = true
       m.blockHeight = tips[m.ticker]
     }
   })
 }

 (async () => {
   for await (const cmsg of ctrlCli.control({})) {
     let dat = JSON.parse(cmsg.data)
     epochDataInfo.data = {...dat, ...{epoch: cmsg.epoch, slot: cmsg.slot, date: cmsg.date}}
       // console.log(`ControlMsg received, notes and tip: `, dat,
       //             {...dat.notes, koios_tip: dat.koios_tip_block_height})
       // 
       await handleControlMsgReceived(cmsg.type == ControlMsg_Type.REFRESH, dat.tips)
     // console.log(`ControlMsg received and handled: slot ${epochDataInfo.data.slot}: top: ${memberInfo.top.ticker} top delegated to: ${memberInfo.top.delegatedPool}`, memberInfo)
   }
 })();
 onMount(() => {
   console.log("+layout.svelte onMount")
   let initialHash = ((window||{}).location||{}).hash || ''
   if (initialHash !== '') {
     waitFor(() => mainQueueMembersSet.length > 0, 2)
       .then(() => goto(initialHash))
   }
   pageLoaderObj.el = pageLoaderEl
 })

</script>

<svelte:head>
  <link rel="icon" type="image/png" href="/favicon.png" />
</svelte:head>

<div class="pageloader" bind:this={pageLoaderEl}><span class="title">Loading</span></div>
<div class="epoch-bar">
  {#if page.url.pathname != "/about"}
    <EpochBar />
  {/if}
</div>

<Header />

<main>

  <!-- {#if page.url.pathname !== '/' && page.url.pathname !== '/about'} -->
  <!--   <UserBox user={$cardanoWallet.user} /> -->
  <!-- {/if} -->

{@render children?.()}

</main>

<footer>
  <p>
    visit <a href="https://www.f2lb.org/">F2LB</a> to learn about First 2 Lifetime
    Block community
  </p>
  <span class="is-pulled-right"><a href="https://github.com/safanaj/go-f2lb-website.git">source code</a></span>
  <!-- svelte-ignore missing_declaration -->
  <span class="is-pulled-left">version: {__APP_VERSION__}</span>
  <p><a href="/swagger/index.html">swagger for v1</a></p>
  <p><a href="/openapi/rapidoc">rapidoc for v2</a> or <a href="/openapi/explorer">explorer for v2</a></p>
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
