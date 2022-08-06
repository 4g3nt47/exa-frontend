<script>

  /**
   * @file The header. Handles page navigations. 
   * @author Umar Abdul (https://github.com/4g3nt47)
   * Props:
   *        session - The session object.
   * Emits:
   *        switchPage - For switching main page. New page accessible through e.detail
   */

  import {createEventDispatcher} from 'svelte';
  const dispatch = createEventDispatcher();

  export let session = {};

  /**
   * Creates the `switchPage` event.
   * @param {string} newPage - The new page name. 
   */
  const switchPage = (newPage) => {
    if (newPage != session.page) // Switch page only if we aren't clicking on the current page's link
      dispatch("switchPage", newPage);
  };

</script>

<header class="flex justify-between py-5 px-5 mb-10 bg-gray-800 text-white">
  <!-- Logo -->
  <div class="flex">    
    <img src='/favicon.ico' class="h-10" alt="">
    <h3 class="self-center text-4xl text-gray-300">Exa</h3>
  </div>
  <!-- Nav links -->
  <nav class="self-center">
    {#each session.pages as p}
      <a class={"text-lg mx-2 " + (session.page === p ? "text-green-400" : "hover:text-green-400 duration-300")} href="/" on:click|preventDefault={() => switchPage(p)}>{p}</a>
    {/each}
  </nav>
</header>
