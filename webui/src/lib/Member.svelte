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

  import { serviceClients } from '$lib/stores'

  export let member;
  export let shortinfo;
  export let addonqueue;
  export let toBoxLinkPrefix = '';
  export let idBoxHashPrefix = '';
  export let epochProgress = 0;
  export let mainServed = {};
  export let koiosTip = 0;
  export const isFirst = false;
  export let topTicker = '';
  let boxId = idBoxHashPrefix === '' ? member.ticker : `${idBoxHashPrefix}-${member.ticker}`

  $: hasMainServed = Object.keys(mainServed).length > 0
  $: wrongPool = hasMainServed && (member.delegatedpool != mainServed.ticker &&
                                   member.delegatedpool != mainServed.poolidbech32)

  $: warningActive = epochProgress > 30 && epochProgress <= 90 && wrongPool
  $: dangerActive = epochProgress > 90 && wrongPool

  $: wantTipCheck = koiosTip > 0 && member.blockheight > 0
  $: tipCheckPassed = member.blockheight >= (koiosTip - 10)
  $: isTouchScreen = window.screen.availWidth < 1024

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
          navigator.clipboard.writeText(member.poolidhex);
      } else if (tgt.classList.contains("bech32")) {
          navigator.clipboard.writeText(member.poolidbech32);
      }
      toastMsgCopied({appendTo: tgt})
  }

  const copyAccountToClipboard = (evt) => {
      let tgt = findParentElt(evt.target, "p")
      if (tgt.classList.contains("hex")) {
          navigator.clipboard.writeText(member.stakekey);
      } else if (tgt.classList.contains("bech32")) {
          navigator.clipboard.writeText(member.stakeaddr);
      }
      toastMsgCopied({appendTo: tgt})
  }

  const openPoolPm = () => {
      window.open(`https://pool.pm/search/${member.delegatedpool}`)
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
            <span class="is-clickable" on:click={goToBox}>{member.ticker}</span>
          {:else}
            {member.ticker}
          {/if}
        </span>
        {#if hasMainServed || addonqueue}
          <span class="icon is-small has-tooltip-arrow has-tooltipl-multiline"
                data-tooltip={`
bech32: ${member.poolidbech32}
hex: ${member.poolidhex}
on top at: (epoch ${addonqueue ? member.startingepochonaddonqueue : member.startingepoch}) ${addonqueue ? member.startingtimeonaddonqueue : member.startingtime}
                `}
                >
            <FaInfoCircle />
          </span>
        {/if}

        {#if wantTipCheck}
          <span class={`icon is-small has-tooltip-arrow has-tooltipl-multiline has-text-${tipCheckPassed ? "success" : "danger"}`}
                data-tooltip={`
reported block height: ${member.blockheight}
block height from koios: ${koiosTip}
                `}>
            {#if tipCheckPassed}
              <FaRegCheckCircle />
            {:else}
              <FaRegTimesCircle />
            {/if}
          </span>
        {/if}

        {#if warningActive }
          <span class="icon is-small has-text-warning has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
            <FaWarning />
          </span>
        {:else if dangerActive }
          <span class="icon is-small has-text-danger has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
            <FaBan />
          </span>
        {/if}

      </span>

      <span class="level-right level-item is-size-6">
        <span class="is-size-7 is-hidden-touch mr-1">delegates</span><span>{member.adadelegated} ADA</span>
      </span>

      <span class="is-size-7 is-pulled-right">
        <span class="level-item">
          AD: {member.adadeclared}
        </span>
        <span class="level-item">
          {#if !addonqueue}
            EG: {member.epochgranted}
          {:else}
            EG: {member.epochgrantedonaddonqueue}
          {/if}
        </span>
      </span>
    </p>

    <p class="mt-3 is-size-6 has-text-left text truncate">
      {#if member.delegatedpool.startsWith('pool1')}
        <span>to pool:</span>

        <span class="is-clickable" on:click={openPoolPm}>
          <span class="icon is-small"><FaExternalLinkSquareAlt /></span>
          {member.delegatedpool}
        </span>

      {:else}
        <span>to pool: {member.delegatedpool}</span>
      {/if}
    </p>

    <p class="is-size-7">
      <span class="text truncate">DiscordName: {member.discordid}</span>
    </p>


  {:else}


  <p>Ticker: {member.ticker}

    <span class={isTouchScreen ? "is-pulled-right" : ""}>

      <span class="icon is-small has-tooltip-arrow has-tooltipl-multiline"
            data-tooltip={`
            bech32: ${member.poolidbech32}
            hex: ${member.poolidhex}
            on top at: (epoch ${addonqueue ? member.startingepochonaddonqueue : member.startingepoch}) ${addonqueue ? member.startingtimeonaddonqueue : member.startingtime}
            `}
            >
        <FaInfoCircle />
      </span>

      {#if wantTipCheck}
        <span class={`icon is-small has-tooltip-arrow has-tooltipl-multiline has-text-${tipCheckPassed ? "success" : "danger"}`}
              data-tooltip={`
              reported block height: ${member.blockheight}
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
          <a href={"https://pool.pm/" + member.poolidhex} target="_blank">
            <img src={poolpmLogo} alt="pool.pm" />
          </a>
        </span>
        <span class="icon is-small">
          <a href={"https://pooltool.io/pool/" + member.poolidhex + "/epochs"} target="_blank">
            <img src={pooltoolioLogo} alt="pooltool.io" />
          </a>
        </span>
        <span class="icon is-small">
          <a href={"https://rawcardano.app/?pool=" + member.poolidbech32} target="_blank">
            <img src={rawcardanoappLogo} alt="rawcardano.app" />
          </a>
        </span>

    </span>

  </p>

  <p>Ada delegated: {member.adadelegated}</p>
  <p>Ada declared: {member.adadeclared}</p>
  {#if !addonqueue}
    <p>Epoch granted: {member.epochgranted}</p>
  {:else}
    <p>Epoch granted: {member.epochgrantedonaddonqueue}</p>
  {/if}
  {#if member.delegatedpool.startsWith('pool1')}
    <p>
      <span class="text truncate">
        <span>Delegated Pool:</span>
        {#if warningActive }
          <span class="icon is-small has-text-warning has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
            <FaWarning />
          </span>
        {:else if dangerActive }
          <span class="icon is-small has-text-danger has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
            <FaBan />
          </span>
        {/if}
        <span class="is-clickable" on:click={openPoolPm}>
          <span class="icon is-small"><FaExternalLinkSquareAlt /></span>
          <span>
            {member.delegatedpool}
          </span>
      </span>
    </p>
  {:else}
    <p>
      <span class="text truncate">
        <span>Delegated Pool:</span>
        {#if warningActive }
          <span class="icon is-small has-text-warning has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
            <FaWarning />
          </span>
        {:else if dangerActive }
          <span class="icon is-small has-text-danger has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
            <FaBan />
          </span>
        {/if}
        <span>{member.delegatedpool}</span>
      </span>
    </p>
  {/if}
  <p><span class="text truncate">DiscordName: {member.discordid}</span></p>
  <p class="hex">
    <span class="text truncate is-clickable" on:click={copyPoolIdToClipboard}>
      Pool Id (hex): <span class="icon is-small"><FaCopy /></span> {member.poolidhex}
    </span>
  </p>
  <p class="bech32">
    <span class="text truncate is-clickable" on:click={copyPoolIdToClipboard}>
      Pool Id (bech32): <span class="icon is-small"><FaCopy /></span> {member.poolidbech32}
    </span>
  </p>
  <p><span class="text truncate">Pool VRF VKey Hash (hex): {member.poolvrfvkeyhash}</span></p>
  {#if !addonqueue}
  <p>current position: {member.mainqcurrpos}</p>
  {/if}
  <p>on top at epoch: {addonqueue ? member.startingepochonaddonqueue : member.startingepoch}</p>
  <p>on top at time: {addonqueue ? member.startingtimeonaddonqueue : member.startingtime}</p>
  <p class="hex">
    <span class="text truncate is-clickable" on:click={copyAccountToClipboard}>
      Stake key hash: <span class="icon is-small"><FaCopy /></span> {member.stakekey}
    </span>
  </p>
  <p class="bech32">
    <span class="text truncate is-clickable" on:click={copyAccountToClipboard}>
      Stake address: <span class="icon is-small"><FaCopy /></span> {member.stakeaddr}
    </span>
  </p>
  <p>active stake: {member.activestake}</p>
  <p>live stake: {member.livestake}</p>
  <p>live delegators: {member.livedelegators}</p>
  {#if member.blockheight != 0 }
    <p>block height: {member.blockheight}</p>
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
