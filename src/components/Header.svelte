<script>

  import {createEventDispatcher} from 'svelte';
  import Logo from '../assets/logo.png';
  const dispatch = createEventDispatcher();

  export let session = {};

  const switchPage = (newPage) => {
    if (newPage != session.page){
      dispatch("switchPage", newPage);
    }
  };

</script>

<header class="flex justify-between py-5 px-5 mb-10 bg-gray-800 text-white">
  <div class="flex">    
    <img src={Logo} class="h-10" alt="">
    <h3 class="self-center text-4xl text-gray-300">Exa</h3>
  </div>
  <nav class="self-center">
    {#each session.pages as p}
      {#if (!(session.loggedIn && p === "Login"))}
        <a href="#" on:click={() => switchPage(p)}>{p}</a>
      {/if}
    {/each}
  </nav>
</header>