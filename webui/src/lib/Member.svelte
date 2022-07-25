<script>
  export let member;
  export let shortinfo;
</script>

<div class="box">
  <p>Ticker: {member.ticker}</p>
  <p>Ada delegated: {member.adadelegated}</p>
  <p>Epoch granted: {member.epochgranted}</p>
  <p>DiscordName: {member.discordid}</p>
  {#if !shortinfo}
  <p>Pool Id: {member.poolid}</p>
  <p>Stake key hash: {member.stakekey}</p>
  <p>Stake address: {member.stakeaddr}</p>
  <p>QPP: {member.mainqcurrpos}</p>
  {/if}
</div>
