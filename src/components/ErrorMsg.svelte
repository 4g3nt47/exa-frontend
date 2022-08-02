<script>
  //  Reusable component for displaying error messages.
  import {slide} from 'svelte/transition';
  export let error = ""; // The error to display.
</script>

{#if (error)}
  <div transition:slide|local={{duration: 300}} class="bg-red-500 mt-5 py-1 pl-2 bg-opacity-20 text-black border-l-4 border-red-800">
    {error}
  </div>
{/if}