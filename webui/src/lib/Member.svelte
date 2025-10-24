<script>
 import {goto} from '$app/navigation'
 import FaInfoCircle from 'svelte-icons/fa/FaInfoCircle.svelte'
 import FaWarning from 'svelte-icons/fa/FaExclamationTriangle.svelte'
 import FaBan from 'svelte-icons/fa/FaBan.svelte'
 import FaCopy from 'svelte-icons/fa/FaCopy.svelte'
 import FaExternalLinkSquareAlt from 'svelte-icons/fa/FaExternalLinkSquareAlt.svelte'
 import FaRegCheckCircle from 'svelte-icons/fa/FaRegCheckCircle.svelte'
 import FaRegTimesCircle from 'svelte-icons/fa/FaRegTimesCircle.svelte'
 import { toast } from 'bulma-toast'

 import poolpmLogo from '$lib/assets/pool.pm.ico';
 import pooltoolioLogo from '$lib/assets/pooltool_io_logo_blue.svg';
 import rawcardanoappLogo from '$lib/assets/rawcardano_app_logo.png';

 export const isFirst = false;
 /**
  * @typedef {Object} Props
  * @property {any} member
  * @property {any} shortinfo
  * @property {any} addonqueue
  * @property {string} [toBoxLinkPrefix]
  * @property {string} [idBoxHashPrefix]
  * @property {number} [epochProgress]
  * @property {any} [mainServed]
  * @property {number} [koiosTip]
  * @property {string} [topTicker]
  */

 /** @type {Props} */
 let {
   member,
   shortinfo,
   addonqueue,
   toBoxLinkPrefix = '',
   idBoxHashPrefix = '',
   epochProgress = 0,
   mainServed = {},
   koiosTip = 0,
   topTicker = '',
   addonTopMember = {}
 } = $props();
 let boxId = idBoxHashPrefix === '' ? member.ticker : `${idBoxHashPrefix}-${member.ticker}`

 let hasMainServed = $derived(Object.keys(mainServed).length > 0)
 let wrongPool = $derived(hasMainServed &&
			  (member.delegatedPool != mainServed.ticker &&
			   member.delegatedPool != mainServed.poolIdBech32) &&
			  (addonTopMember?.ticker !== member.ticker &&
			   (member.ticker != member.delegatedPool &&
			    member.poolIdBech32 !== member.delegatedPool)))

 let warningActive = $derived(epochProgress > 30 && epochProgress <= 90 && wrongPool)
 let dangerActive = $derived(epochProgress > 90 && wrongPool)

 let wantTipCheck = $derived(koiosTip > 0 && member.blockHeight > 0)
 let tipCheckPassed = $derived(member.blockHeight >= (koiosTip - 10))
 let isTouchScreen = $derived(window.screen.availWidth < 1024)

 const toastMsgCopied = opts => {
   let copts = {
     message: "Copied",
     type: "is-link",
     position: "top-center",
   }
   toast({...copts, ...opts})
 }

 const findParentElt = (tgt, eltName) => {
   while (tgt.localName != eltName) {
     tgt = tgt.parentElement
   }
   return tgt
 }

 const copyPoolIdToClipboard = (evt) => {
   let tgt = findParentElt(evt.target, "p")
   if (tgt.classList.contains("hex")) {
     navigator.clipboard.writeText(member.poolIdHex);
   } else if (tgt.classList.contains("bech32")) {
     navigator.clipboard.writeText(member.poolIdBech32);
   }
   toastMsgCopied({appendTo: tgt})
 }

 const copyAccountToClipboard = (evt) => {
   let tgt = findParentElt(evt.target, "p")
   if (tgt.classList.contains("hex")) {
     navigator.clipboard.writeText(member.stakeKey);
   } else if (tgt.classList.contains("bech32")) {
     navigator.clipboard.writeText(member.stakeAddr);
   }
   toastMsgCopied({appendTo: tgt})
 }

 const openPoolPm = () => {
   window.open(`https://pool.pm/search/${member.delegatedPool}`)
 }

 const goToBox = () => {
   if (toBoxLinkPrefix !== '') {
     goto(`${toBoxLinkPrefix}#${member.ticker}`)
   }
 }

</script>


<!-- <div class={!isFirst && topTicker !== 'Unknown' && topTicker == member.ticker ? "box box-in real-top": "box box-in"} id={boxId}> -->
<div class={topTicker !== 'Unknown' && topTicker == member.ticker ? "box box-in real-top": "box box-in"} id={boxId}>
  {#if shortinfo}
    <p class="has-text-centered">
      <span class="is-pulled-left">
        <span class="is-size-4">
          {#if toBoxLinkPrefix !== ''}
            <!-- svelte-ignore a11y_interactive_supports_focus, a11y_click_events_have_key_events -->
            <span class="is-clickable" role="button" onclick={goToBox}>{member.ticker}</span>
          {:else}
            {member.ticker}
          {/if}
        </span>
        {#if hasMainServed || addonqueue}
          <span class="icon is-small has-tooltip-arrow has-tooltipl-multiline"
                data-tooltip={`
			     bech32: ${member.poolIdBech32}
			     hex: ${member.poolIdHex}
			     on top at: (epoch ${addonqueue ? member.startingEpochOnAddonQueue : member.startingEpoch}) ${addonqueue ? member.startingTimeOnAddonQueue : member.startingTime}
			     `}
          >
            <FaInfoCircle />
          </span>
        {/if}

        {#if wantTipCheck}
          <span class={`icon is-small has-tooltip-arrow has-tooltipl-multiline has-text-${tipCheckPassed ? "success" : "danger"}`}
                data-tooltip={`
			     reported block height: ${member.blockHeight}
			     block height from koios: ${koiosTip}
			     `}>
            {#if tipCheckPassed}
              <FaRegCheckCircle />
            {:else}
              <FaRegTimesCircle />
            {/if}
          </span>
        {/if}

        {#if warningActive}
          <span class="icon is-small has-text-warning has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
            <FaWarning />
          </span>
        {:else if dangerActive}
          <span class="icon is-small has-text-danger has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
            <FaBan />
          </span>
        {/if}

      </span>

      <span class="level-right level-item is-size-6">
        <span class="is-size-7 is-hidden-touch mr-1">delegates</span><span>{member.adaDelegated} ADA</span>
      </span>

      <span class="is-size-7 is-pulled-right">
        <span class="level-item">
          AD: {member.adaDeclared}
        </span>
        <span class="level-item">
          {#if !addonqueue}
            EG: {member.epochGranted}
          {:else}
            EG: {member.epochGrantedOnAddonQueue}
          {/if}
        </span>
      </span>
    </p>

    <p class="mt-3 is-size-6 has-text-left text truncate">
      {#if member.delegatedPool.startsWith('pool1')}
        <span>to pool:</span>
        <!-- svelte-ignore a11y_interactive_supports_focus, a11y_click_events_have_key_events -->
        <span class="is-clickable" role="button" onclick={openPoolPm}>
          <span class="icon is-small"><FaExternalLinkSquareAlt /></span>
          {member.delegatedPool}
        </span>

      {:else}
        <span>to pool: {member.delegatedPool}</span>
      {/if}
    </p>

    <p class="is-size-7">
      <span class="text truncate">DiscordName: {member.discordId}</span>
    </p>


  {:else}


    <p>Ticker: {member.ticker}

      <span class={isTouchScreen ? "is-pulled-right" : ""}>

	<span class="icon is-small has-tooltip-arrow has-tooltipl-multiline"
              data-tooltip={`
			   bech32: ${member.poolIdBech32}
			   hex: ${member.poolIdHex}
			   on top at: (epoch ${addonqueue ? member.startingEpochOnAddonQueue : member.startingEpoch}) ${addonqueue ? member.startingTimeOnAddonQueue : member.startingTime}
			   `}
        >
          <FaInfoCircle />
	</span>

	{#if wantTipCheck}
          <span class={`icon is-small has-tooltip-arrow has-tooltipl-multiline has-text-${tipCheckPassed ? "success" : "danger"}`}
		data-tooltip={`
			     reported block height: ${member.blockHeight}
			     block height from koios: ${koiosTip}
			     `}>
            {#if tipCheckPassed}
              <FaRegCheckCircle />
            {:else}
              <FaRegTimesCircle />
            {/if}
          </span>
	{/if}

	<!-- additional icons useful anchors/shortcuts-->
        <span class="icon is-small">
          <a href={"https://pool.pm/" + member.poolIdHex} target="_blank">
            <img src={poolpmLogo} alt="pool.pm" />
          </a>
        </span>
        <span class="icon is-small">
          <a href={"https://pooltool.io/pool/" + member.poolIdHex + "/epochs"} target="_blank">
            <img src={pooltoolioLogo} alt="pooltool.io" />
          </a>
        </span>
        <span class="icon is-small">
          <a href={"https://rawcardano.app/?pool=" + member.poolIdBech32} target="_blank">
            <img src={rawcardanoappLogo} alt="rawcardano.app" />
          </a>
        </span>

      </span>

    </p>

    <p>Ada delegated: {member.adaDelegated}</p>
    <p>Ada declared: {member.adaDeclared}</p>
    {#if !addonqueue}
      <p>Epoch granted: {member.epochGranted}</p>
    {:else}
      <p>Epoch granted: {member.epochGrantedOnAddonQueue}</p>
    {/if}
    {#if member.delegatedPool.startsWith('pool1')}
      <p>
	<span class="text truncate">
          <span>Delegated Pool:</span>
          {#if warningActive}
            <span class="icon is-small has-text-warning has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
              <FaWarning />
            </span>
          {:else if dangerActive}
            <span class="icon is-small has-text-danger has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
              <FaBan />
            </span>
          {/if}
          <!-- svelte-ignore a11y_interactive_supports_focus, a11y_click_events_have_key_events -->
          <span class="is-clickable" role="button" onclick={openPoolPm}>
            <span class="icon is-small"><FaExternalLinkSquareAlt /></span>
            <span>
              {member.delegatedPool}
            </span>
	  </span>
	</span>
      </p>
    {:else}
      <p>
	<span class="text truncate">
          <span>Delegated Pool:</span>
          {#if warningActive}
            <span class="icon is-small has-text-warning has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
              <FaWarning />
            </span>
          {:else if dangerActive}
            <span class="icon is-small has-text-danger has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
              <FaBan />
            </span>
          {/if}
          <span>{member.delegatedPool}</span>
	</span>
      </p>
    {/if}
    <p><span class="text truncate">DiscordName: {member.discordId}</span></p>
    <p class="hex">
      <!-- svelte-ignore a11y_interactive_supports_focus, a11y_click_events_have_key_events -->
      <span class="text truncate is-clickable" role="button" onclick={copyPoolIdToClipboard}>
	Pool Id (hex): <span class="icon is-small"><FaCopy /></span> {member.poolIdHex}
      </span>
    </p>
    <p class="bech32">
      <!-- svelte-ignore a11y_interactive_supports_focus, a11y_click_events_have_key_events -->
      <span class="text truncate is-clickable" role="button" onclick={copyPoolIdToClipboard}>
	Pool Id (bech32): <span class="icon is-small"><FaCopy /></span> {member.poolIdBech32}
      </span>
    </p>
    <p><span class="text truncate">Pool VRF VKey Hash (hex): {member.poolVrfVKeyHash}</span></p>
    {#if !addonqueue}
      <p>current position: {member.mainQCurrPos}</p>
    {/if}
    <p>on top at epoch: {addonqueue ? member.startingEpochOnAddonQueue : member.startingEpoch}</p>
    <p>on top at time: {addonqueue ? member.startingTimeOnAddonQueue : member.startingTime}</p>
    <p class="hex">
      <!-- svelte-ignore a11y_interactive_supports_focus, a11y_click_events_have_key_events -->
      <span class="text truncate is-clickable" role="button" onclick={copyAccountToClipboard}>
	Stake key hash: <span class="icon is-small"><FaCopy /></span> {member.stakeKey}
      </span>
    </p>
    <p class="bech32">
      <!-- svelte-ignore a11y_interactive_supports_focus, a11y_click_events_have_key_events -->
      <span class="text truncate is-clickable" role="button" onclick={copyAccountToClipboard}>
	Stake address: <span class="icon is-small"><FaCopy /></span> {member.stakeAddr}
      </span>
    </p>
    <p>active stake: {member.activeStake}</p>
    <p>live stake: {member.liveStake}</p>
    <p>live delegators: {member.liveDelegators}</p>
    {#if member.blockHeight != 0}
      <p>block height: {member.blockHeight}</p>
    {/if}

  {/if}

</div>

<style>
 .text {
   display: block;
 }

 .truncate {
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
 }

</style>
