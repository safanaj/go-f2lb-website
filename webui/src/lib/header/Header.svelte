<script>
  import { tick } from 'svelte';
  import { page } from '$app/stores';
  import f2lbLogo from '$lib/assets/f2lb_small.png';
  import {Empty} from "google-protobuf/google/protobuf/empty_pb";
  import {StakeAddr} from '$lib/pb/control_pb.js'
  import { serviceClients, cardanoWallet, theme } from '$lib/stores'
  import CardanoConnect from '$lib/cardano/CardanoConnect.svelte';
  import FaMoon from 'svelte-icons/fa/FaMoon.svelte'
  import FaSun from 'svelte-icons/fa/FaSun.svelte'
  import FaAngry from 'svelte-icons/fa/FaAngry.svelte'

  const isAdmin = () => {
      let t = (($cardanoWallet.user||{}).member||{}).ticker
      return ['BRNS', 'STPZ1'].indexOf(t) > -1
  }

  const doRefresh = () => {
      return new Promise((resolve, reject) => {
          $serviceClients.Control.refresh(new Empty(), (err, res) => { if (err) { reject(err) } else { resolve(res) } })
      }).then(tick)
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
          {:else}
          <button class="button" disabled>Refresh</button>
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

    a:hover {
        color: var(--accent-color);
    }

    .button {
        margin-top: 4px;
    }
</style>
