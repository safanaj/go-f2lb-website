<script>
  import { tick } from 'svelte';
  import { page } from '$app/stores';
  import f2lbLogo from '$lib/assets/f2lb_small.png';
  import {Empty} from "google-protobuf/google/protobuf/empty_pb";
  import { toast } from 'bulma-toast'
  import { Buffer } from 'buffer';

  import {AuthnSignature,StakeAddr,PoolBech32Id} from '$lib/pb/control_pb.js'
  import { serviceClients, cardanoWallet, theme } from '$lib/stores'
  import CardanoConnect from '$lib/cardano/CardanoConnect.svelte';

  // import FaMoon from 'svelte-icons/fa/FaMoon.svelte'
  import FaSun from 'svelte-icons/fa/FaSun.svelte'
  import FaAngry from 'svelte-icons/fa/FaAngry.svelte'
  import FaSignature from 'svelte-icons/fa/FaSignature.svelte'
  import FaUserCheck from 'svelte-icons/fa/FaUserCheck.svelte'
  const isAdmin = () => {
      return ($cardanoWallet.user||{}).isadmin
  }
  const isVerified = () => {
      return ($cardanoWallet.user||{}).isverified
  }

  const isMemberSPO = () => {
      return ($cardanoWallet.user||{}).member !== undefined && $cardanoWallet.stakeAddr === (($cardanoWallet.user||{}).member||{}).stakeaddr
  }

  const refreshUser = () => {
      let sa = new StakeAddr()
      sa.setStakeaddress($cardanoWallet.stakeAddr)
      new Promise((resolve, reject) => {
          $serviceClients.Control.auth(sa, (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(u => u.toObject()).then(user => cardanoWallet.set({...$cardanoWallet, user}))
  }

  const doRefresh = () => {
      return new Promise((resolve, reject) => {
          $serviceClients.Control.refresh(new Empty(), (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(tick)
  }

  const doRefreshMember = () => {
      return new Promise((resolve, reject) => {
          let sa = new StakeAddr()
          sa.setStakeaddress($cardanoWallet.stakeAddr)
          $serviceClients.Control.refreshMember(sa, (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(tick)
  }

  const doRefreshAllMembers = () => {
      return new Promise((resolve, reject) => {
          $serviceClients.Control.refreshAllMembers(new Empty(), (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(tick)
  }

  const doCheckPool = () => {
      return new Promise((resolve, reject) => {
          let pool = new PoolBech32Id()
          pool.setId($cardanoWallet.user.member.poolidbech32)
          $serviceClients.Control.checkPool(pool, (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(r => {
          console.log("PoolStats", r.toObject())
          toast({
              message: `pool ${$cardanoWallet.user.member.ticker} checked`,
              position: "top-center",
              duration: 5000,
              dismissible: true,
              type: 'is-success',
          })
      }).then(tick).catch(err => toast({
          message: err.toString(),
          position: "top-center",
          duration: 5000,
          dismissible: true,
          type: 'is-danger',
      }))
  }

  const doCheckAllPools = () => {
      return new Promise((resolve, reject) => {
          $serviceClients.Control.checkAllPools(new Empty(), (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(toast({
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
      return new Promise((resolve, reject) => {
          $serviceClients.Control.logout(new Empty(), (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(refreshUser).then(tick)
  }

  let authnVerified = isVerified()
  const doAuthnSign = () => {
      return new Promise((resolve, reject) => {
          $cardanoWallet.api.signData($cardanoWallet.stakeAddr, Buffer.from($cardanoWallet.stakeAddr).toString('hex'))
              .then(sig => {
                  let asig = new AuthnSignature()
                  asig.setSignature(sig.signature)
                  asig.setKey(sig.key)
                  asig.setStakeaddress($cardanoWallet.stakeAddr)
                  $serviceClients.Control.authn(asig, (err, res) => { if (err) { reject(err) } else { resolve(res) } })
              })
      }).then(refreshUser).then(tick).catch(console.log)
  }

  const switchTheme = () => {
      // const themes = 'sld';
      const themes = 'sl';
      let nextTidx = (themes.indexOf($theme) + 1) % themes.length
      theme.set(themes[nextTidx])
      if ($theme !== 's') {
          document.documentElement.classList.remove('theme-s')
      } else {
          document.documentElement.classList.add('theme-s')
      }
  }

</script>

<header>
    <div class="corner-logo">
        <a href={$page.url.pathname === "/" ? "https://www.f2lb.org/" : "/"}>
            <img src={f2lbLogo} alt="F2LB" />
        </a>
    </div>
    <div class="corner"><!-- maybe a short breadcrumb --></div>

    <nav class="is-hidden-touch">
      <svg viewBox="0 0 2 3" aria-hidden="true">
        <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
      </svg>
      <ul>
        <li class:active={$page.url.pathname === '/'}><a href="/">Welcome</a></li>
        <li class:active={$page.url.pathname === '/about'}><a href="/about">About</a></li>
        <li class:active={$page.url.pathname === '/main-queue'}><a href="/main-queue">Main Queue</a></li>
        <li class:active={$page.url.pathname === '/addon-queue'}><a href="/addon-queue">Addon Queue</a></li>
        <!--
            <li class:active={$page.url.pathname === '/members'}><a href="/members">Members</a></li>
        <li class:active={$page.url.pathname === '/rules'}><a href="/rules">Rules</a></li>
        -->
        <li class:active={$page.url.pathname === '/supporters'}><a href="/supporters">Supporters</a></li>
        {#key $cardanoWallet.user}
        <li>
          {#if isAdmin()}
            <button class="button" on:click={doRefresh}>Refresh</button>
          {/if}
        </li>
        <li>
          {#if isVerified()}
            <!-- {#if isMemberSPO() || isAdmin()} -->
              <div class="dropdown is-hoverable">
                <div class="dropdown-trigger">
                  <span class="icon is-medium mt-2 mr-1 ml-1" aria-haspopup="true" aria-controls="dropdown-user-check">
                    <FaUserCheck />
                  </span>
                </div>
                <div class="dropdown-menu" id="dropdown-user-check" role="menu">
                  <div class="dropdown-content">
                    {#if isMemberSPO()}
                      <a href="#" class="dropdown-item" on:click={doRefreshMember}>
                        Refresh Member
                      </a>
                      <a href="#" class="dropdown-item" on:click={doCheckPool}>
                        Check Pool {$cardanoWallet.user.member.ticker}
                      </a>
                    {/if}
                    {#if isAdmin()}
                      <a href="#" class="dropdown-item" on:click={doRefreshAllMembers}>
                        Refresh All Members
                      </a>
                      <a href="#" class="dropdown-item" on:click={doCheckAllPools}>
                        Check All Pools
                      </a>
                    {/if}
                    <hr />
                    <a href="#" class="dropdown-item" on:click={doLogout}>
                      Logout
                    </a>
                  </div>
                </div>
              </div>
            <!-- {:else} -->
            <!--   <span class="icon is-medium mt-2 mr-1 ml-1"><FaUserCheck /></span> -->
            <!-- {/if} -->
          {:else if $cardanoWallet.user !== undefined}
            <button class="button" on:click={doAuthnSign}><FaSignature /></button>
          {/if}
        </li>
        {/key}
        <li><CardanoConnect doAuthentication={true}
              on:CardanoConnectWalletError={evt => console.log(evt.detail)}
              /></li>
      </ul>
      <svg viewBox="0 0 2 3" aria-hidden="true">
        <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
      </svg>
    </nav>

    <div class="theme-switcher has-text-centered">
        <span class="icon is-small" on:click={switchTheme}>
          {#if $theme === "s"}
            <FaSun />
          {:else if $theme === "l"}
            <!-- <FaMoon /> -->
            <FaAngry />
          {:else if $theme === "d"}
            <FaAngry />
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
