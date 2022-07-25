<script>
  export let success = "";
</script>

{#if (success.length > 0)}
  <div class="bg-green-500 mt-5 py-1 pl-2 bg-opacity-20 text-black border-l-4 border-green-800">
    {success}
  </div>
{/if}