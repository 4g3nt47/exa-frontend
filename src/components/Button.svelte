<script>
  export let type = "primary";
</script>

{#if (type === "primary")}
  <button class="w-full py-1 bg-gray-900 border-2 border-gray-900 bg-opacity-75 hover:bg-opacity-90 duration-200 text-white text-lg rounded-md" type="button" on:click>
    <slot></slot>
  </button>
{:else if (type === "secondary")}
  <button class="w-full py-1 bg-green-900 border-2 border-green-900 bg-opacity-75 hover:bg-opacity-90 duration-200 text-white text-lg rounded-md" type="button" on:click>
    <slot></slot>
  </button>
{:else if (type === "danger")}
  <button class="w-full py-1 bg-red-900 border-2 border-red-900 bg-opacity-80 hover:bg-opacity-90 duration-200 text-white text-lg rounded-md" type="button" on:click>
    <slot></slot>
  </button>
{/if}
