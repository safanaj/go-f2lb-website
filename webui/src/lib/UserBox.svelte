<script>
  import {User} from '$lib/pb/control_pb';

  export let user;
</script>

{#if user !== undefined}
<div class="user box is-hidden-mobile">
{#if user.type === User.Type.VISITOR}
  <p>Hello <span class="text truncate">{user.stakeaddress}</span> !</p>
  <p>Thanks to visit this site, and if you did not do yet, please join our community.</p>
  <p>If you want to contribute to ensure Cardano decentralization, consider to be a sponsor of F2LB Community.</p>
  <p>If you are a small and single pool operator, join us ...</p>
{:else if user.type === User.Type.SUPPORTER}
  <p>Hello <span class="text truncate">{user.supporter.discordid}</span> !</p>
  <p>Thanks to support our community.</p>
{:else if user.type === User.Type.SPO}
  <p>Hello <span class="text truncate">{user.member.ticker}</span> !</p>
  <p>Thanks to visit this site, your status is as explained below ...</p>
{/if}
</div>
{/if}

<style>

  .text {
	  display: block;
  }

  .truncate {
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
  }

  .user {
    position: fixed;
    width: 25%;
    height: auto;
    min-height: 75%;
    margin-left: 60%;
  }

</style>
