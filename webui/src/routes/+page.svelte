<script context="module">
  import {
      useCardanoMultiPlatformLib,
      getDelegationSignedTx,
      getSignedTx,
      assembleWitnessSet,
      getUtxoHint,
      asHexAndFree,
  } from '$lib/cardano/cml.js'

  import { Buffer } from 'buffer';
  let wasm = {}

  useCardanoMultiPlatformLib().then(x => { wasm = {...x} ; window.cml = wasm; })

  window.Buffer = Buffer
</script>

<svelte:head>
<title>Welcome to F2LB Queue Manager</title>
</svelte:head>

<script>
  import {User, Delegation, TxId} from '$lib/pb/control_pb';
  import {
      mainQueueMembers, addonQueueMembers, serviceClients,
      epochData, cardanoWallet, activePool, topPool
  } from '$lib/stores'
  import Member from '$lib/Member.svelte'
  import TxSubmitConfirmation from '$lib/cardano/TxSubmitConfirmation.svelte'
  import FaArrowRight from 'svelte-icons/fa/FaArrowRight.svelte'
  import { getContext } from 'svelte';
  import { toast } from 'bulma-toast'

  $: mainServed = $topPool || $mainQueueMembers[0];
  $: epochProgress = Object.keys($epochData).length > 0 ? ($epochData.slot * 100 / 432000).toFixed(2) : 0;
  $: user = $cardanoWallet.user
  $: wrongPool = (user||{}).delegatedpool != (mainServed||{}).ticker && (user||{}).delegatedpool != (mainServed||{}).poolidbech32
  $: topTicker = ($topPool || {}).ticker || 'Unknown'
  $: hasPayer = ($epochData.notes||{}).payer_available === 'true'

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
      let {api, wasm, address} = $cardanoWallet
      pageLoaderObj.el.classList.toggle('is-active')
      getDelegationSignedTx(api, wasm, address, mainServed.poolidbech32, console)
          .then(api.submitTx)
          .then(console.log)
          .then(() => pageLoaderObj.el.classList.toggle('is-active'))
          .then(() => toastMsg('Tx submitted'))
          .catch(err => {
              pageLoaderObj.el.classList.toggle('is-active');
              toastErr(err)
              console.log(err);
          })
  }


  let signedTxCborHex = null;
  let avoidSubmitConfirmation = false;
  let useHintToKeepTxTrack = false;

  const getTxIdAndPayerVKey = (tx) => {
      const tx_ = wasm.Transaction.from_bytes(Buffer.from(tx.cborhex, 'hex'))
      // console.log("Got TX_:", tx_.to_json())
      // console.log("Got TX cborhex:", tx.cborhex)
      const txHash = wasm.hash_transaction(tx_.body()).to_hex()
      const payer_vkey_hex = asHexAndFree(tx_.witness_set().vkeys().get(0))
      tx_.free()

      const txId = new TxId()
      txId.setHash(txHash)

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
      let {api, wasm} = $cardanoWallet
      pageLoaderObj.el.classList.toggle('is-active')
      if ($cardanoWallet.stakeAddr === "" || $topPool.poolidbech32 === "") {
          pageLoaderObj.el.classList.toggle('is-active')
          console.log("Error delegation data incomplete", $cardanoWallet, $topPool)
          toastErr(new Error("delegation data incomplete"))
          return
      }
      let deleg = new Delegation()
      deleg.setStakeaddress($cardanoWallet.stakeAddr)
      deleg.setPoolid($topPool.poolidbech32)

      if (useHintToKeepTxTrack) {
          const hint = await getUtxoHint(api, wasm, false)
          if (hint !== "") {
              deleg.setUtxoidhint(hint)
          }
      }

      let tx = await new Promise((resolve, reject) => {
          $serviceClients.Control.buildDelegationTx(deleg, (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(tx => tx.toObject()).catch(err => {
          console.log(err)
          pageLoaderObj.el.classList.toggle('is-active')
          toastErr(err)
      })
      if (!tx) return

      const {txId, payer_vkey_hex} = getTxIdAndPayerVKey(tx)
      let witset
      try {
          if ($cardanoWallet.name === 'eternl') {
              witset = await api.signTx(tx.cborhex, true)
          } else {
              witset = await api.signTx(tx.cborhex)
          }
      } catch (e) {
          console.log("Error or cancelled", e)
          $serviceClients.Control.canceledTx(txId)
          pageLoaderObj.el.classList.toggle('is-active')
          toastErr(e)
          return
      }

      let tracker_vkey_hex = ""
      const tws = wasm.TransactionWitnessSet.from_bytes(Buffer.from(witset, 'hex'))
      const delegator_vkey_hex = asHexAndFree(tws.vkeys().get(0))
      if (useHintToKeepTxTrack && tws.vkeys().len() === 2) {
          tracker_vkey_hex = asHexAndFree(tws.vkeys().get(1))
      }
      tws.free()

      let signedTx = getSignedTxWithWitnessSet(tx.cborhex, payer_vkey_hex, delegator_vkey_hex, tracker_vkey_hex)
      if (!signedTx) return;
      if (avoidSubmitConfirmation) {
          try {
              let txid = await api.submitTx(signedTx)
              console.log("Tx submitted", txId.toObject(), txid)
              $serviceClients.Control.submittedTx(txId)
          } catch (e) {
              console.log("Tx submit err", e)
              toastErr(e)
              $serviceClients.Control.canceledTx(txId)
          }
      } else {
          // going to open the TX submit confirmation modal just setting the watched variable
          signedTxCborHex = signedTx
      }
      pageLoaderObj.el.classList.toggle('is-active')
  }

  const doTxSubmitConfirmed = async () => {
      const signedTx = signedTxCborHex;
      signedTxCborHex = null
      const api = $cardanoWallet.api
      const res = getTxIdAndPayerVKey({cborhex: signedTx})
      try {
          let txid = await api.submitTx(signedTx)
          console.log("Tx submitted", res.txId.toObject(), txid)
          $serviceClients.Control.submittedTx(res.txId)
      } catch (e) {
          console.log("Tx submit err", e)
          $serviceClients.Control.canceledTx(res.txId)
      }
  }

  const doTxSubmitDiscarded = () => {
      const signedTx = signedTxCborHex;
      signedTxCborHex = null
      const res = getTxIdAndPayerVKey({cborhex: signedTx})
      console.log("Tx submit discarded", res.txId)
      $serviceClients.Control.canceledTx(res.txId)
  }

</script>

{#key signedTxCborHex}
<TxSubmitConfirmation on:TxSubmitConfirmed={doTxSubmitConfirmed} on:TxSubmitDiscarded={doTxSubmitDiscarded} txCborHex={signedTxCborHex} />
{/key}

<section class="section">
  <div class="columns m-0 has-text-centered">
    <div class="column">
      <h1 class="block">Welcome to F2LB (unofficial) Website</h1>
      <p class="block">Visit <a href="https://www.f2lb.org/">F2LB</a> to read about the project and the community</p>
      <!-- <p class="block">Visit also <a href="https://f2lb.info/">F2LB.info</a></p> -->
      {#if $activePool !== null && ($activePool||{activestake: 0}).activestake > 0}
        <div class="box themed">
        The F2LB community stake was delegated to the pool {$activePool.ticker} that
        now has {$activePool.activestake.toLocaleString("en-US")} ADA of active stake.<br />
        Now we are delegating to {topTicker}
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
              <div class="block mt-3">
                <button class="button" on:click={doDelegation}>Delegate to the SPO on top of the queue, currently {mainServed.ticker}</button>
                {#if hasPayer}
                  <div class="divider">OR</div>
                  <div class="field is-grouped is-justify-content-center">
                    <p class="control">
                      <button class="button" on:click={doOfferedDelegation}>Delegation fee kindly offered</button>
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
      <p>Main Queue <a class="is-hidden-desktop" href="/main-queue"><span class="icon is-small has-text-dark"><FaArrowRight /></span></a></p>
      <div class="box box-out">
        {#each $mainQueueMembers as m, idx}
          <Member member={m} shortinfo {epochProgress} {mainServed} toBoxLinkPrefix="/main-queue"
                  isFirst={idx == 0} {topTicker} koiosTip={$epochData.koios_tip_block_height} />
        {/each}
      </div>
    </div>
    <div class="column is-half">
      <p>Addon Queue <a class="is-hidden-desktop" href="/addon-queue"><span class="icon is-small has-text-dark"><FaArrowRight /></span></a></p>
      <div class="box box-out">
        {#each $addonQueueMembers as m}
          <Member member={m} shortinfo addonqueue {epochProgress} toBoxLinkPrefix="/addon-queue" idBoxHashPrefix="aq"
                  koiosTip={$epochData.koios_tip_block_height} />
        {/each}
      </div>
    </div>
  </div>
</section>
