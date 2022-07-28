<script>
  import {slide} from 'svelte/transition';
  export let success = "";
</script>

{#if (success)}
  <div in:slide={{duration: 300}} class="bg-green-500 mt-5 py-1 pl-2 bg-opacity-20 text-black border-l-4 border-green-800">
    {success}
  </div>
{/if}