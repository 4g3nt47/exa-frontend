<script>

  // Our header component.

  import {createEventDispatcher} from 'svelte';
  const dispatch = createEventDispatcher();

  export let session = {};

  // Creates the `switchPage` event handled by the parent when a user clicks on a nav link
  const switchPage = (newPage) => {
    if (newPage != session.page) // Switch page only if we aren't clicking on the current page's link
      dispatch("switchPage", newPage);
  };
</script>

<header class="flex justify-between py-5 px-5 mb-10 bg-gray-800 text-white">
  <div class="flex">    
    <img src='/favicon.ico' class="h-10" alt="">
    <h3 class="self-center text-4xl text-gray-300">Exa</h3>
  </div>
  <nav class="self-center">
    {#each session.pages as p}
      <a class={"text-lg mx-2 " + (session.page === p ? "text-green-400" : "hover:text-green-400 duration-300")} href="/" on:click|preventDefault={() => switchPage(p)}>{p}</a>
    {/each}
  </nav>
</header>