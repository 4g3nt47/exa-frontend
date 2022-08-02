<script>
  // Reusable component for displaying 'success' messages.
  import {slide} from 'svelte/transition';
  export let success = ""; // The success message
</script>

{#if (success)}
  <div transition:slide|local={{duration: 300}} class="bg-green-500 mt-5 py-1 pl-2 bg-opacity-20 text-black border-l-4 border-green-800">
    {success}
  </div>
{/if}