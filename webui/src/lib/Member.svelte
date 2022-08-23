<script>
  import FaInfoCircle from 'svelte-icons/fa/FaInfoCircle.svelte'
  import FaWarning from 'svelte-icons/fa/FaExclamationTriangle.svelte'
  import FaBan from 'svelte-icons/fa/FaBan.svelte'
  import FaCopy from 'svelte-icons/fa/FaCopy.svelte'
  import { toast } from 'bulma-toast'
  export let member;
  export let shortinfo;
  export let epochProgress = 0;
  export let mainServed = {};

  $: wrongPool = Object.keys(mainServed).length > 0 && (member.delegatedpool != mainServed.ticker &&
                                                        member.delegatedpool != mainServed.poolidbech32)

  $: hasMainServed = Object.keys(mainServed).length > 0
  $: warningActive = epochProgress > 30 && epochProgress <= 90 && wrongPool
  $: dangerActive = epochProgress > 90 && wrongPool

  const findParentElt = (tgt, eltName) => {
      while (tgt.localName != eltName) {
          tgt = tgt.parentElement
      }
      return tgt
  }

  // const iconClick = (evt) => {
  //     let tgt = findParentElt(evt.target, "span")
  //     tgt.classList.toggle("has-tooltip-active")
  // }

  const copyPoolIdToClipboard = (evt) => {
      let tgt = findParentElt(evt.target, "p")
      if (tgt.classList.contains("hex")) {
          navigator.clipboard.writeText(member.poolidhex);
      } else if (tgt.classList.contains("bech32")) {
          navigator.clipboard.writeText(member.poolidbech32);
      }
      toast({
          message: "Copied",
          type: "is-link",
          position: "top-center",
          appendTo: tgt
      })
  }

  const copyAccountToClipboard = (evt) => {
      let tgt = findParentElt(evt.target, "p")
      if (tgt.classList.contains("hex")) {
          navigator.clipboard.writeText(member.stakekey);
      } else if (tgt.classList.contains("bech32")) {
          navigator.clipboard.writeText(member.stakeaddr);
      }
      toast({
          message: "Copied",
          type: "is-link",
          position: "top-center",
          appendTo: tgt
      })
  }

</script>


<div class="box box-in">
  <p>Ticker: {member.ticker}
    {#if hasMainServed }
    <span class="icon is-small has-tooltip-arrow has-tooltipl-multiline"
          data-tooltip={`
          bech32: ${member.poolidbech32}
          hex: ${member.poolidhex}
          on top at: (epoch ${member.startingepoch}) ${member.startingtime}
          `}
          >
      <FaInfoCircle />
    </span>
    {/if}
    {#if warningActive }
      <span class="icon is-small has-text-warning has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
        <FaWarning />
      </span>
    {/if}
    {#if dangerActive }
      <span class="icon is-small has-text-danger has-tooltip-arrow" data-tooltip="Delegated to wrong pool">
        <FaBan />
      </span>
    {/if}
  </p>

  <p>Ada delegated: {member.adadelegated}</p>
  <p>Ada declared: {member.adadeclared}</p>
  <p>Epoch granted: {member.epochgranted}</p>
  <p><span class="text truncate">Delegated Pool: {member.delegatedpool}</span></p>
  <p><span class="text truncate">DiscordName: {member.discordid}</span></p>
  {#if !shortinfo}
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
  <p>current position: {member.mainqcurrpos}</p>
  <p>on top at epoch: {member.startingepoch}</p>
  <p>on top at time: {member.startingtime}</p>
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
