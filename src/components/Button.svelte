<script>
  // Reusable button components.
  export let type = "primary";    // Button type (primary/secondary/danger).
  export let btn = null;          // Used by parent components to access the button element. 
  export let btnType = "button";  // Value `type` attribute of the button
</script>

{#if (type === "primary")}
  <button class="w-full py-1 bg-gray-900 border-2 border-gray-900 bg-opacity-75 hover:bg-opacity-90 duration-200 text-white text-lg rounded-md" type={btnType} bind:this={btn} on:click>
    <slot></slot>
  </button>
{:else if (type === "secondary")}
  <button class="w-full py-1 bg-green-900 border-2 border-green-900 bg-opacity-75 hover:bg-opacity-90 duration-200 text-white text-lg rounded-md" type={btnType} bind:this={btn} on:click>
    <slot></slot>
  </button>
{:else if (type === "danger")}
  <button class="w-full py-1 bg-red-900 border-2 border-red-900 bg-opacity-80 hover:bg-opacity-90 duration-200 text-white text-lg rounded-md" type={btnType} bind:this={btn} on:click>
    <slot></slot>
  </button>
{/if}
