<script>
 import { tick, getContext } from 'svelte';
 import { page } from '$app/state';
 import f2lbLogo from '$lib/assets/f2lb_small.png';
 import { toast } from 'bulma-toast'
 import { Buffer } from 'buffer';
 import FaMoon from 'svelte-icons/fa/FaMoon.svelte'
 import FaSun from 'svelte-icons/fa/FaSun.svelte'
 import FaAngry from 'svelte-icons/fa/FaAngry.svelte'
 import FaSignature from 'svelte-icons/fa/FaSignature.svelte'
 import FaUserCheck from 'svelte-icons/fa/FaUserCheck.svelte'
 import CardanoConnect from '$lib/cardano/CardanoConnect.svelte';
 import { createClient } from "@connectrpc/connect";
 import { createConnectTransport } from "@connectrpc/connect-web";
 import { ControlMsgService } from "$lib/api/v2/control_pb.js";
 import { Wallet } from '@cardano-foundation/cardano-connect-with-wallet-core';
 import {
   themeData, connectedWallet,
   mainQueueMembersSet, addonQueueMembersSet
 } from '$lib/state.svelte'

 const tEncoder = new TextEncoder()
 
 const ctrlCli = createClient(ControlMsgService, createConnectTransport({baseUrl: page.url.origin}));

 let themeName = $derived(themeData.current)
 const switchTheme = () => {
   let available = themeData.available
   let nextTidx = (available.indexOf(themeName) + 1) % available.length
   themeData.current = available[nextTidx]
 }

 let isAdmin = $derived(connectedWallet.user?.isAdmin === true)
 let isVerified = $derived(connectedWallet.user?.isVerified === true)
 let isMemberSPO = $derived(connectedWallet.user?.member !== undefined && connectedWallet.stakeAddr === connectedWallet.user?.member?.stakeAddr)
 const refreshUser = () => {
   if (connectedWallet.stakeAddr !== "") {
     ctrlCli.auth({stakeAddress: connectedWallet.stakeAddr})
	    .then(user => { connectedWallet.user = user }).then(tick)
   }
 }

 const doRefresh = () => {
   ctrlCli.refresh()
 }

 const doRefreshMember = () => {
   if (connectedWallet.stakeAddr) {
     ctrlCli.refreshMember({stakeAddress: connectedWallet.stakeAddr})
	    .then(res => {
	      if (res.memberOrEmpty.case == 'member') {
		let member = res.memberOrEmpty.value
		let foundInMQ = false
		let foundInAQ = false
		for(const m of mainQueueMembersSet.values()) {
		  if (m.ticker == member.ticker) {
		    foundInMQ = true
		    Object.assign(m, member)
		    break
		  }
		}
		for(const m of addonQueueMembersSet.values()) {
		  if (m.ticker == member.ticker) {
		    foundInAQ = true
		    Object.assign(m, member)
		    break
		  }
		}

		if (foundInAQ || foundInMQ) {
		  toast({
		    message: `pool ${member.ticker} refreshed`,
		    position: "top-center",
		    duration: 5000,
		    dismissible: true,
		    type: 'is-success',
		  })
		}
	      } else {
		console.log("refresh member: stake address not found")
		toast({
		  message: "Unexpected Error: member not found",
		  position: "top-center",
		  duration: 5000,
		  dismissible: true,
		  type: 'is-danger',
		})
	      }     
	    }).then(tick)
   }
 }
 
 const doRefreshAllMembers = () => {
   ctrlCli.refreshAllMembers().then(tick)
 }

 const doCheckPool = () => {
   let poolId = ((connectedWallet.user||{}).member||{}).poolIdBech32
   if (poolId !== undefined && poolId !== "") {
     ctrlCli.checkPool({idOrTicker: poolId})
	    .then(r => {
	      console.log("PoolStats", r)
	      toast({
		message: `pool ${connectedWallet.user.member.ticker} checked`,
		position: "top-center",
		duration: 5000,
		dismissible: true,
		type: 'is-success',
	      })
	    })
	    .then(tick)
	    .catch(err => toast({
	      message: err.toString(),
	      position: "top-center",
	      duration: 5000,
	      dismissible: true,
	      type: 'is-danger',
	    }))
   }
 }

 const doCheckAllPools = () => {
   ctrlCli.checkAllPools().then(toast({
     message: `All pools checked`,
     position: "top-center",
     duration: 5000,
     dismissible: true,
     type: 'is-success',
   })).then(tick).catch(err => toast({
     message: err.toString(),
     position: "top-center",
     duration: 5000,
     dismissible: true,
     type: 'is-danger',
   }))
 }

 const doLogout = () => {
  ctrlCli.logout().then(refreshUser).then(tick)
  connectedWallet.user = undefined
 }

 const doAuthnSign = () => {
   let api = connectedWallet.api
   return window.cookieStore.get("ruuid").then(c => c.value).catch(() => "").then(sid => {
     if (sid === "") {
       sid = connectedWallet.stakeAddr
     }     
     return api.signData(connectedWallet.stakeAddr, tEncoder.encode(sid).toHex()).then(sig => {
       return ctrlCli.authn({
 	 signature: sig.signature,
 	 key: sig.key,
 	 stakeAddress: connectedWallet.stakeAddr
       })
     })
   }).then(refreshUser).then(tick).catch(console.log)
 }

 let user = $derived(connectedWallet.user)
</script>

<header>
    <div class="corner-logo">
        <a href={page.url.pathname === "/" ? "https://www.f2lb.org/" : "/"}>
            <img src={f2lbLogo} alt="F2LB" />
        </a>
    </div>
    <div class="corner"><!-- maybe a short breadcrumb --></div>

    <nav class="is-hidden-touch head-nav">
      <svg viewBox="0 0 2 3" aria-hidden="true">
        <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
      </svg>
      <ul>
        <li class:active={page.url.pathname === '/'}><a href="/">Welcome</a></li>
        <li class:active={page.url.pathname === '/about'}><a href="/about">About</a></li>
        <li class:active={page.url.pathname === '/main-queue'}>
	  <a href="/main-queue">Main Queue</a>
	</li>
        <li class:active={page.url.pathname === '/addon-queue'}>
	  <a href="/addon-queue">Addon Queue</a>
	</li>
        <!--
        <li class:active={page.url.pathname === '/members'}><a href="/members">Members</a></li>
        <li class:active={page.url.pathname === '/rules'}><a href="/rules">Rules</a></li>
        -->
        <li class:active={page.url.pathname === '/supporters'}><a href="/supporters">Supporters</a></li>

        {#key connectedWallet.user}
          <li>
            {#if isAdmin}
              <button class="button" onclick={doRefresh}>Refresh</button>
            {/if}
          </li>
          <li>
            {#if isVerified}
              {#if isMemberSPO || isAdmin}
		<div class="dropdown is-hoverable">
                  <div class="dropdown-trigger">
                    <span class="icon is-medium mt-2 mr-1 ml-1" aria-haspopup="true" aria-controls="dropdown-user-check">
                      <FaUserCheck />
                    </span>
                  </div>
                  <div class="dropdown-menu" id="dropdown-user-check" role="menu">
                    <div class="dropdown-content">
                      {#if isMemberSPO}
			<a href="#" class="dropdown-item" onclick={doRefreshMember}>
                          Refresh Member
			</a>
			<a href="#" class="dropdown-item" onclick={doCheckPool}>
                          Check Pool {connectedWallet.user.member.ticker}
			</a>
                      {/if}
                      {#if isAdmin}
			<a href="#" class="dropdown-item" onclick={doRefreshAllMembers}>
                          Refresh All Members
			</a>
			<a href="#" class="dropdown-item" onclick={doCheckAllPools}>
                          Check All Pools
			</a>
                      {/if}
                      <hr />
                      <a href="#" class="dropdown-item" onclick={doLogout}>
			Logout
                      </a>
                    </div>
                  </div>
		</div>
              {:else}
		<span class="icon is-medium mt-2 mr-1 ml-1"><FaUserCheck /></span>
              {/if}
            {:else if user !== undefined}
              <button class="button" onclick={doAuthnSign}>
		<span class="icon is-is-small"><FaSignature /></span>
	      </button>
            {/if}
          </li>
        {/key}

        <li>
	  <CardanoConnect doAuthentication={true}
			  on:CardanoConnectWalletError={evt => console.log(evt.detail)} />
	</li>
      </ul>
      <svg viewBox="0 0 2 3" aria-hidden="true">
        <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
      </svg>
    </nav>

    <div class="theme-switcher has-text-centered">
      <span class="icon is-small" role="button" onclick={switchTheme}>
        {#if themeName === "system"}<FaSun />
	{:else if themeName === "light"}<FaMoon />
        {:else if themeName === "dark"}<FaAngry />
        {/if}
      </span>
    </div>

</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
    }

    .corner {
        width: 3em;
        height: 3em;
    }

    .corner-logo {
        width: 15%;
        height: 25%;
        position: absolute;
    }

    .theme-switcher {
        width: 6%;
        height: 25%;
        position: absolute;
        right: 0px;
        margin-top: 4%;
    }

    .corner-logo a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .corner-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    nav {
        display: flex;
        justify-content: center;
        /* --background: rgba(255, 255, 255, .7); */
    }

    svg {
        width: 2em;
        height: 3em;
        display: block;
    }

    path {
        fill: var(--background);
    }

    ul {
        position: relative;
        padding: 0;
        margin: 0;
        height: 3em;
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
        background: var(--background);
        background-size: contain;
    }

    li {
        position: relative;
        height: 100%;
    }

    li.active::before {
        --size: 6px;
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: calc(50% - var(--size));
        border: var(--size) solid transparent;
        border-top: var(--size) solid var(--accent-color);
    }

    nav a {
        display: flex;
        height: 100%;
        align-items: center;
        padding: 0 1em;
        color: var(--heading-color);
        font-weight: 700;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-decoration: none;
        transition: color 0.2s linear;
    }

    nav div.dropdown-content a {
        text-transform: none;
    }


    a:hover {
        color: var(--accent-color);
    }

    .button {
        margin-top: 4px;
    }
</style>
