<script>

  /**
   * @file Displays event logs.
   * @author Umar Abdul (https://github.com/4g3nt47)
   * Props:
   *        session - The session object.
   */

  import {onMount} from 'svelte';
  import Loader from '../Loader.svelte';
  import ErrorMsg from '../ErrorMsg.svelte';

  export let session = {};
  let error = "";
  let logs = null;

  /**
   * Load event logs when the component is mounted.
   */
  onMount(async () => {
    
    try{
      const res = await fetch(`${session.api}/logs/200`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.status !== 200)
        throw new Error(data.error);
      logs = data;
    }catch(err){
      error = err.message;
      logs = [];
    }
  });

</script>

<h3>Event Logs</h3>
<div class="w-full mt-5 pb-5 px-20">
  {#if (logs === null)}
    <Loader>Loading event logs...</Loader>
  {:else}
    {#if (logs.length === 0)}
      <ErrorMsg error="No event logs available at the moment!"/>
    {:else}
      <div class="w-full bg-gray-300 p-3 shadow-md shadow-gray-600">        
        {#each logs as log}
          {#if (log.logType === 0)}
            <!-- Status log -->
            <div class="font-mono bg-green-500 mt-2 py-1 pl-2 bg-opacity-20 text-black border-l-4 border-green-800">
              {new Date(log.date).toLocaleString()}: {log.message}
            </div>
          {:else if (log.logType === 1)}
            <!-- Warning log -->
            <div class="font-mono bg-yellow-500 mt-2 py-1 pl-2 bg-opacity-20 text-black border-l-4 border-yellow-800">
              {new Date(log.date).toLocaleString()}: {log.message}
            </div>
          {:else}
            <!-- Error log -->
            <div class="font-mono bg-red-500 mt-2 py-1 pl-2 bg-opacity-20 text-black border-l-4 border-red-800">
              {new Date(log.date).toLocaleString()}: {log.message}            
            </div>
          {/if}
        {/each}
      </div>
    {/if}
    <ErrorMsg {error}/>
  {/if}
</div>
