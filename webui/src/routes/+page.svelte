<script module>
  import * as wasm from '@dcspark/cardano-multiplatform-lib-browser'
</script>

<svelte:head>
  <title>Welcome to F2LB Queue Manager</title>
</svelte:head>

<script>
 import {
   mainQueueMembersSet, addonQueueMembersSet,
   memberInfo, epochDataInfo, connectedWallet
 } from '$lib/state.svelte'
 import Member from '$lib/Member.svelte'
 import TxSubmitConfirmation from '$lib/cardano/TxSubmitConfirmation.svelte'
 import {User_Type} from '$lib/api/v2/control_pb';
 import FaArrowRight from 'svelte-icons/fa/FaArrowRight.svelte'
 import { getContext, onMount } from 'svelte';
 import { toast } from 'bulma-toast'
 import {
   getDelegationSignedTx, getSignedTx,
   assembleWitnessSet, asHexAndFree, getUtxoHint
 } from '$lib/cardano/cml'

 let epochData = $derived(epochDataInfo.data)
 let mainServed = $derived(memberInfo.top || mainQueueMembersSet.values().next().value);
 let epochProgress = $derived(Object.keys(epochData).length > 0 ? (epochData.slot * 100 / 432000).toFixed(2) : 0);
 let user = $derived(connectedWallet.user)
 let topTicker = $derived(memberInfo.top?.ticker || 'Unknown')
 let activePool = $derived(memberInfo.active)
 let hasPayer = $derived(epochDataInfo.data.notes?.payer_available === 'true')
 let addonTopMember = $derived(addonQueueMembersSet.values().next().value)
 let wrongPool = $derived((user||{}).delegatedPool != (mainServed||{}).ticker &&
			  (user||{}).delegatedPool != (mainServed||{}).poolIdBech32)

 const pageLoaderObj = getContext('pageLoader')

 const toastMsg = (msg, opts) => {
   let dopts = {
     message: msg,
     position: "top-center",
     duration: 5000,
     dismissible: true,
     type: 'is-success',
   }
   toast({...dopts, ...(opts ?? {})})
 }
 const toastErr = (err, opts) => {
   toastMsg(err.toString(), {type: 'is-danger'})
 }
 
 const doDelegation = () => {
   console.log("doDelegation")
   pageLoaderObj.el.classList.toggle('is-active')
   getDelegationSignedTx(connectedWallet.api, wasm, connectedWallet.address,
			 mainServed.poolIdBech32, console)
          .then(connectedWallet.api.submitTx)
          .then(console.log)
          .then(() => pageLoaderObj.el.classList.toggle('is-active'))
          .then(() => toastMsg('Tx submitted'))
          .catch(err => {
            pageLoaderObj.el.classList.toggle('is-active');
            toastErr(err)
            console.log(err);
          })
 };

 let signedTxCborHex = $state(null);
 let avoidSubmitConfirmation = $state(false);
 let useHintToKeepTxTrack = $state(false);

 const getTxIdAndPayerVKey = (tx) => {
   const tx_ = wasm.Transaction.from_cbor_hex(tx.cborHex)
   const txHash = wasm.hash_transaction(tx_.body()).to_hex()
   const payer_vkey_hex = asHexAndFree(tx_.witness_set().vkeys().get(0))
   tx_.free()
   
   const txId = {hash: txHash}
     return {txId, payer_vkey_hex}
 }
 
 const getSignedTxWithWitnessSet = (tx_hex, payer_vkey_hex, delegator_vkey_hex, tracker_vkey_hex) => {
   if (tracker_vkey_hex === "") {
     const witset = assembleWitnessSet(wasm, payer_vkey_hex, delegator_vkey_hex)
     try {
       return getSignedTx(wasm, tx_hex, witset)
     } catch (err) {
       pageLoaderObj.el.classList.toggle('is-active')
       toastErr(err)
     }     
   } else {
     const witset = assembleWitnessSet(wasm, payer_vkey_hex, delegator_vkey_hex, tracker_vkey_hex)
     try {
       return getSignedTx(wasm, tx_hex, witset)
     } catch(err) {
       pageLoaderObj.el.classList.toggle('is-active')
       toastErr(err)
     }
   }
 }

 const doOfferedDelegation = async () => {
   console.log("doDelegation")
   if (connectedWallet.stakeAddr === "" || mainServed.poolIdBech32 === "") {
     pageLoaderObj.el.classList.toggle('is-active')
     console.log("Error delegation data incomplete", connectedWallet, mainServed)
     toastErr(new Error("delegation data incomplete"))
     return
   }

   const api = connectedWallet.api
   let deleg = {
     stakeAddress: connectedWallet.stakeAddr,
     poolId: mainServed.poolIdBech32
   };

   if (useHintToKeepTxTrack) {
     const hint = await getUtxoHint(api, wasm, false)
     if (hint !== "") {
       deleg.utxoIdHint = hint
     }
   }

   let tx;
   try {
     tx = await ctrlCli.buildDelegationTx(deleg)
   } catch (err) {
     console.log(err)
     pageLoaderObj.el.classList.toggle('is-active')
     toastErr(err)
   }
   if (!tx) return

   const {txId, payer_vkey_hex} = getTxIdAndPayerVKey(tx)
   let witset
   try {
     if (connectedWallet.name === 'eternl') {
       witset = await api.signTx(tx.cborhex, true)
     } else {
       witset = await api.signTx(tx.cborhex)
     }
   } catch (e) {
     console.log("Error or cancelled", e)
     ctrlCli.canceledTx(txId)
     pageLoaderObj.el.classList.toggle('is-active')
     toastErr(e)
     return
   }

   let tracker_vkey_hex = ""
   const tws = wasm.TransactionWitnessSet.from_cbor_hex(witset)
   const delegator_vkey_hex = asHexAndFree(tws.vkeys().get(0))
   if (useHintToKeepTxTrack && tws.vkeys().len() === 2) {
     tracker_vkey_hex = asHexAndFree(tws.vkeys().get(1))
   }
   tws.free()

   let signedTx = getSignedTxWithWitnessSet(
     tx.cborHex, payer_vkey_hex, delegator_vkey_hex, tracker_vkey_hex)
   if (!signedTx) return;
   if (avoidSubmitConfirmation) {
     try {
       let txid = await api.submitTx(signedTx)
       console.log("Tx submitted", txId, txid)
       ctrlCli.submittedTx(txId)
     } catch (e) {
       console.log("Tx submit err", e)
       toastErr(e)
       ctrlCli.canceledTx(txId)
     }
   } else {
     // going to open the TX submit confirmation modal just setting the watched variable
     signedTxCborHex = signedTx
   }
   pageLoaderObj.el.classList.toggle('is-active')
 };


 const doTxSubmitConfirmed = async () => {
   const signedTx = signedTxCborHex;
   signedTxCborHex = null
   const api = connectedWallet.api
   const res = getTxIdAndPayerVKey({cborhex: signedTx})
   try {
     let txid = await api.submitTx(signedTx)
     console.log("Tx submitted", txId, txid)
     ctrCli.submittedTx(res.txId)
   } catch (e) {
     console.log("Tx submit err", e)
     ctrCli.canceledTx(res.txId)
   }
 }

 const doTxSubmitDiscarded = () => {
   const signedTx = signedTxCborHex;
   signedTxCborHex = null
   const res = getTxIdAndPayerVKey({cborHex: signedTx})
   console.log("Tx submit discarded", res.txId)
   ctrlCli.canceledTx(res.txId)
 }

 
</script>

{#key signedTxCborHex}
  <TxSubmitConfirmation
    onConfirm={doTxSubmitConfirmed}
    onDiscard={doTxSubmitDiscarded}
    txCborHex={signedTxCborHex} />
{/key}

<section class="section">
  <div class="columns m-0 has-text-centered">
    <div class="column">
      <h1 class="block">Welcome to F2LB (unofficial) Website</h1>
      <p class="block">Visit <a href="https://www.f2lb.org/">F2LB</a> to read about the project and the community</p>
      <!-- <p class="block">Visit also <a href="https://f2lb.info/">F2LB.info</a></p> -->

      {#if (memberInfo.active||{activeStake: 0}).activeStake > 0}
        <div class="box themed">
          The F2LB community stake was delegated to the pool {activePool.ticker} that
          now has {activePool.activeStake.toLocaleString("en-US")} ADA of active stake.<br />
          Now we are delegating to {memberInfo.top.ticker}
        </div>
      {/if}

      {#if connectedWallet.user !== undefined}
        <br />
        <div class="box box-out box-user">
          {#if connectedWallet.user.type === User_Type.VISITOR}
            <p>Hello <span class="text truncate">{user.stakeaddress}</span> !</p>
            <p>Thanks to visit this website, and if you did not do yet, please join our community.</p>
            <p>If you want to contribute to ensure Cardano decentralization, consider to be a sponsor of F2LB Community.</p>
            <p>If you are a small and single pool operator, join us ...</p>
          {:else if connectedWallet.user.type === User_Type.SUPPORTER}
            <p>Hello <span class="text truncate">{user.supporter.discordid}</span> !</p>
            <p>Thanks for supporting our community.</p>
          {:else if connectedWallet.user.type === User_Type.SPO}
            <p>Hello <span class="text truncate">{user.member.ticker}</span> !</p>
            <p>Thanks to visit this website, your status is explained below ...</p>
          {/if}
          {#key connectedWallet.stakeKey}
            {#if wrongPool}
              <div class="block mt-3">
                <button class="button" onclick={doDelegation}>Delegate to the SPO on top of the queue, currently {mainServed.ticker}</button>
                {#if hasPayer}
                  <div class="divider">OR</div>
                  <div class="field is-grouped is-justify-content-center">
                    <p class="control">
                      <button class="button" onclick={doOfferedDelegation}>Delegation fee kindly offered</button>
                    </p>
                    <p class="control">
                      <input bind:checked={avoidSubmitConfirmation}
                             id="switchTxSubmitConfirm" type="checkbox" class="switch is-rounded">
                      <label for="switchTxSubmitConfirm">Avoid tx submit confirmation</label>
                    </p>
                  </div>
                  <p class="control">
                    <input bind:checked={useHintToKeepTxTrack}
                           id="useHintToKeepTxTrack" type="checkbox" class="switch is-rounded">
                    <label for="useHintToKeepTxTrack">Keep track of TX on delegator wallet</label>
                  </p>
                {/if}
              </div>
            {/if}
          {/key}

        </div> <!-- box-user end -->
      {/if}
    </div>
  </div>
</section>

<section class="section">
  <div class="columns m-0 has-text-centered">
    <div class="column is-half">
      <p>Main Queue <a class="is-hidden-desktop" href="/main-queue">
        <span class="icon is-small has-text-dark"><FaArrowRight /></span></a>
      </p>
      <div class="box box-out">
        {#each mainQueueMembersSet as m, idx}
          <Member member={m} shortinfo {epochProgress} {mainServed} toBoxLinkPrefix="/main-queue"
                  isFirst={idx == 0} {addonTopMember} {topTicker}
		  koiosTip={epochData.koios_tip_block_height} />
        {/each}
      </div>
    </div>
    <div class="column is-half">
      <p>Addon Queue <a class="is-hidden-desktop" href="/addon-queue">
        <span class="icon is-small has-text-dark"><FaArrowRight /></span></a>
      </p>
      <div class="box box-out">
        {#each addonQueueMembersSet as m}
          <Member member={m} shortinfo addonqueue {epochProgress}
                  toBoxLinkPrefix="/addon-queue" idBoxHashPrefix="aq"
                  koiosTip={epochData.koios_tip_block_height} />
        {/each}
      </div>
    </div>
  </div>
</section>
