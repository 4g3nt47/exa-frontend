<script>

  /**
   * @file Displays user profile.
   * @author Umar Abdul (https://github.com/4g3nt47)
   * Props:
   *        session - The session object.
   */

  import {onMount} from 'svelte';
  import Loader from './Loader.svelte';
  import SuccessMsg from './SuccessMsg.svelte';
  import ErrorMsg from './ErrorMsg.svelte';
  import UserInfo from './UserInfo.svelte';
  import TestResult from './TestResult.svelte';

  export let session = {};
  let profile = null; // Loaded profile data will be stored here
  let error = "";

  /**
   * Load user data when component is mounted.
   */
  onMount(async () => {

    try{
      const rsp = await fetch(`${session.api}/user/profile`, {
        credentials: 'include'
      });
      const data = await rsp.json();
      if (rsp.status !== 200) // Oooops!
        throw new Error(data.error);
      profile = data;
    }catch(err){
      error = err.message;
    }
  });

</script>

<h3>Profile</h3>
<div class="w-3/4 mx-auto p-5">
  {#if (profile == null && error.length === 0)}
    <Loader>Loading profile...</Loader>
  {:else if (profile !== null)}
    <div class="w-4/5 mx-auto bg-gray-300 rounded-lg p-3 shadow-md shadow-gray-600">
      <UserInfo {session} {profile}/>
      {#if (profile.results.length > 0)}
        <h5 class="text-center my-10 text-xl">Results</h5>
        {#each profile.results as result}
          <div class="w-full border-t border-dashed border-t-black">
            <TestResult {result}/>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
  <ErrorMsg {error}/>
</div>
