<script>
  import {onMount} from 'svelte';
  import Loader from './Loader.svelte';
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
<div class="w-1/2 mx-auto p-5">
  {#if (profile == null && error.length === 0)}
    <Loader>Loading profile...</Loader>
  {:else if (profile !== null)}
    <p>Username: {profile.username}</p>
    <p>Member since: {new Date(profile.creationDate).toLocaleString()}</p>
    <p>Courses taken: {profile.results.length}</p>
  {/if}
  <ErrorMsg {error}/>
</div>
