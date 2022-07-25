<script>
  import "../app.scss";
  import Header from "$lib/header/Header.svelte";
  import { page } from '$app/stores';
  import { serviceClients } from '$lib/stores'

  if ($serviceClients.Supporter === null) {
      serviceClients.getSupporterServiceClient($page.url.origin)
  }
  if ($serviceClients.MainQueue === null) {
      serviceClients.getMainQueueServiceClient($page.url.origin)
  }
  if ($serviceClients.AddonQueue === null) {
      serviceClients.getAddonQueueServiceClient($page.url.origin)
  }
</script>

<Header />

<main>
  <slot />
</main>

<footer>
  <p>
    visit <a href="https://www.f2lb.org/">F2LB</a> to learn about First 2 Lifetime
    Block community
  </p>
</footer>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }
</style>
