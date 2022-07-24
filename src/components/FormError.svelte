<script>
  export let error = "";
</script>

{#if (error.length > 0)}
  <div class="bg-red-500 mt-5 py-1 pl-2 bg-opacity-20 text-black border-l-4 border-red-800">
    {error}
  </div>
{/if}