<script>
  import {onMount} from 'svelte';
  import SuccessMsg from './SuccessMsg.svelte';
  import ErrorMsg from './ErrorMsg.svelte';

  export let session = {};
  let profile = null;
  let error = "";

  onMount(async () => {
    
    try{
      const rsp = await fetch(`${session.api}/user/profile`, {
        credentials: 'include'
      });
      const data = await rsp.json();
      if (rsp.status !== 200)
        throw new Error(data.error);
      profile = data;
    }catch(err){
      error = err.message;
    }
  });

</script>

<h3>Profile</h3>
<div class="w-1/2 mx-auto border-2 border-black rounded-2xl p-5">
  {#if (profile == null && error.length === 0)}
    <p>Loading data, please wait...</p>
  {:else if (profile !== null)}
    <p>Username: {profile.username}</p>
  {/if}
  <ErrorMsg {error}/>
</div>
