<script module>
 import { connectedWallet } from '$lib/state.svelte';
 import * as wasm from '@dcspark/cardano-multiplatform-lib-browser'

 let cardano = window.cardano;
 let maybeStoredConnectedWalletName = null
 if ((window||{}).localStorage !== undefined) {
   maybeStoredConnectedWalletName = window.localStorage.connectedWalletName || ''
   connectedWallet.name = maybeStoredConnectedWalletName
 } 

 Wallet.addEventListener('enabled', bool => console.log(`Wallet event enabled ${bool}`))
 Wallet.addEventListener('connecting', bool => console.log(`Wallet event isConnecting ${bool}`))
 Wallet.addEventListener('enabledWallet', name => {
   connectedWallet.name = name || '';
   console.log(`Wallet event enabledwallet ${name}`)
 })
 Wallet.addEventListener('stakeAddress', saddr => {
   connectedWallet.stakeAddr = saddr || '';
   if (connectedWallet.stakeAddr !== '') {
     let ra = wasm.Address.from_bech32(saddr)
     connectedWallet.stakeKey = ra.to_hex().slice(2)
     ra.free()
   } else {
     connectedWallet.stakeKey = ''
   }
   console.log(`Wallet event stakeAddress ${saddr} and key: ${connectedWallet.stakeKey}`)
 })
 Wallet.addEventListener('usedAddresses', uaddrs => {
   connectedWallet.usedAddresses = uaddrs 
   connectedWallet.address = connectedWallet.usedAddresses.values().next().value
   console.log(`Wallet event usedAddresses:`, uaddrs)
 })
 Wallet.addEventListener('unusedAddresses', unuaddrs => {
   connectedWallet.unusedAddresses = unuaddrs
   if (connectedWallet.address === undefined) {
     connectedWallet.address = connectedWallet.unusedAddresses.values().next().value
   }
   console.log(`Wallet event unusedAddresses:`, unuaddrs)
 })
 Wallet.addEventListener('lastConnectedWallet', name => {
   console.log(`Wallet event lastConnectedWallet ${name}`)
 })
 Wallet.addEventListener('meerkatAddress', maddr => {
   console.log(`Wallet event stakeAddress ${maddr}`)
 })
 Wallet.addEventListener('installedWalletExtensions', exts => {
   console.log(`Wallet event installedWalletExtensions:`, exts)
 })

 Wallet.startInjectWalletListener()

 console.log("CardanoConnect.svelte module done", maybeStoredConnectedWalletName, connectedWallet)
</script>

<script>
 import { page } from '$app/state';
 import { onMount, getContext } from 'svelte'
 import CardanoConnectButton from '$lib/cardano/CardanoConnectButton.svelte';
 import { createClient } from "@connectrpc/connect";
 import { createConnectTransport } from "@connectrpc/connect-web";
 import { ControlMsgService } from "$lib/api/v2/control_pb.js";
 import { Wallet } from '@cardano-foundation/cardano-connect-with-wallet-core';
 import { waitFor } from '$lib/utils';

 const onAccountChange = dat => console.log('onAccountChange', dat)
 const maybeRegisterOnAccountChange = async (api, w) => {
   if (typeof api.onAccountChange === 'function') {
     api.onAccountChange(onAccountChange)
     console.log("onAccountChange", api, w)
   } else if (typeof (api.experimental||{}).on === 'function') {
     api.experimental.on('accountChange', onAccountChange)
     console.log("onAccountChange (api.experimental)", api, w)
   } else {
     // no-op
     (() => {})()
   }
 }

 Wallet.addEventListener('connected', async bool => {
   if (bool) {
     await maybeRegisterOnAccountChange(cardano[connectedWallet.name], connectedWallet)
     await connectedWallet.setApiFromWallet(Wallet)
   }
 })

 /**
  * @typedef {Object} Props
  * @property {string} [text]
  * @property {boolean} [doAuthentication]
  */

 /** @type {Props} */
 let { text = "Connect", doAuthentication = false } = $props();

 let wModalEl = $state();
 let loadingEl = $state();
 const pageLoaderObj = getContext('pageLoader')
 const ctrlCli = createClient(ControlMsgService, createConnectTransport({baseUrl: page.url.origin}));

 const openLoader = () => {
   if (pageLoaderObj !== undefined && pageLoaderObj.el !== undefined) {
     pageLoaderObj.el.classList.add("is-active");
   }
 }
 const closeLoader = () => {
   if (pageLoaderObj !== undefined && pageLoaderObj.el !== undefined) {
     pageLoaderObj.el.classList.remove("is-active");
   }
 }
 const openModal = () => wModalEl.classList.add("is-active")
 const closeModal = () => wModalEl.classList.remove("is-active")

 const walletDisconnect = () => {   
   if (Wallet.isConnected.value) {
     Wallet.disconnect()
   }
   connectedWallet.reset()
 }

 const walletDisconnectAndCloseModal = () => {
   closeModal()
   openLoader()
   walletDisconnect()
   closeLoader()
 }

 const walletConnect = (name) => {
   Wallet.connectToWallet(name)
 }

 const walletConnectAndCloseModal = (name) => {
   closeModal()
   openLoader()
   walletConnect(name)
   closeLoader()
 }

 const doAuth = async (dat) => {
   console.log("CardanoConnect doAuth()", dat)
   let user = await ctrlCli.auth({stakeAddress: dat.stakeAddr})
   return {...dat, user}
 }

 if (doAuthentication) {
   $effect(async () => {
     console.log(`running effect handled due to doAuthentication (${doAuthentication})`)
     console.log(`running effect address (${connectedWallet.stakeAddr})`)
     $inspect(connectedWallet).with(console.log)
     console.log(`running effect address (${connectedWallet.stakeAddr})`, connectedWallet.stakeAddr, connectedWallet)
     console.log(`running effect address (${connectedWallet.stakeAddr})`, connectedWallet.stakeAddr, connectedWallet)
     if (connectedWallet.stakeAddr !== null && connectedWallet.stakeAddr !== undefined && connectedWallet.stakeAddr !== "") {
       await doAuth({stakeAddr: connectedWallet.stakeAddr}).then(res => {
	 console.log("doAuth response: ", res)
	 connectedWallet.user = res.user
       }).catch(err => console.log(err))
     }
   })
   // Wallet.addEventListener('stakeAddress', saddr => {
   //   if (saddr !== "") {
   //     await doAuth({stakeAddress: saddr})
   //   }
   // })
 }


 onMount(() => {
   // console.log('CardanoConnect.svelte onMount',
   // 	       maybeStoredConnectedWalletName,
   // 	       Wallet.getInstalledWalletExtensions())
   if (maybeStoredConnectedWalletName !== null &&
       Wallet.getInstalledWalletExtensions().indexOf(maybeStoredConnectedWalletName) > -1) {
     // console.log('CardanoConnect.svelte onMount waiting and connecting wallet')
     waitFor(() => connectedWallet.name != '', 1)
	    .then(async () => { await Wallet.connectToWallet(connectedWallet.name) })
   }
   // console.log('CardanoConnect.svelte onMount done')
 })
 
 const WALLETS_ID = 'cardano-connect-wallets';
 const BUTTON_ID = 'cardano-connect-button';
 const LOADING_ID = 'cardano-connect-loading';
 
 const loadingGif = 'data:image/gif;base64,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';
</script>

{#key connectedWallet.address}
<CardanoConnectButton id={BUTTON_ID} wallet={connectedWallet} text={text} on:click={openModal} />
{/key}

<div class="modal" id={WALLETS_ID} bind:this={wModalEl}>
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Select Wallet to connect</p>
      <button class="delete" onclick={closeModal}></button>
    </header>
    <section class="modal-card-body">
      {#each Wallet.getInstalledWalletExtensions() as wid}
	{#if (cardano||{}).hasOwnProperty(wid)}
	  <li class="is-clickable" id={wid} onclick={() => walletConnectAndCloseModal(wid)}>
	    <span class="icon is-small"><img alt={cardano[wid].name} src={cardano[wid].icon} /></span>
	    <span>{cardano[wid].name}<span>
	  </li>
	{/if}
      {/each}
    </section>
    <footer class="modal-card-foot">
      <button class="button is-danger" onclick={walletDisconnectAndCloseModal}>Disconnect</button>
    </footer>
  </div>
</div>

<div id={LOADING_ID} class="is-hidden cardano-wallet-loading" bind:this={loadingEl}>
  <img alt="loading ..." src={loadingGif} class="loadingImage" />
</div>

<style>
 div.cardano-wallet-loading {
   background-color: transparent;
   position: fixed;
   width: 80%;
   padding: 250px 0px 50px 500px;
   z-index: 9999;
 }

 .loadingImage {
   display: block;
   width: 64px;
   height: 64px;
   background-color: transparent;
 }

 li.disabled {
   background-color: #ccc;
 }

</style>
