<script>

  // Profile component for logged in users.

  import {onMount} from 'svelte';
  import Loader from './Loader.svelte';
  import SuccessMsg from './SuccessMsg.svelte';
  import ErrorMsg from './ErrorMsg.svelte';
  import TestResult from './TestResult.svelte';

  export let session = {};
  let profile = null; // Loaded profile data will be stored here
  let error = "";

  // Load user data when component is mounted. Till then a load animation is displayed.
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
    <div class="info-card mx-auto bg-gray-300 rounded-lg p-3 shadow-md shadow-gray-600">
      <div class="flex items-center">
        <img class="profile-avatar border-gray-700" src={session.api + "/" +  profile.avatar} alt="My avatar">
        <div class="ml-2 w-full">
          <table>
            <tr>
              <th>Username:</th>
              <td>{profile.username}</td>
            </tr>
            <tr>
              <th>Name:</th>
              <td>{profile.name}</td>
            </tr>
            <tr>
              <th>Joined On:</th>
              <td>{new Date(profile.creationDate).toLocaleString()}</td>
            </tr>
            <tr>
              <th>Active Tests:</th>
              <td>{profile.activeTests}</td>
            </tr>
            <tr>
              <th>Tests Taken:</th>
              <td>{profile.testsTaken}</td>
            </tr>
            <tr>
              <th>Tests Passed:</th>
              <td>
                {profile.testsPassed} ({(profile.testsTaken === 0 ? 0 : (profile.testsPassed / profile.testsTaken) * 100).toFixed(2)}% success rate)
              </td>
            </tr>
          </table>
        </div>        
      </div>
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

<style>

  .info-card{
    width: 85%;
  }

  table{
    width: 100%;
  }

  table th{
    text-align: left;
    padding-right: 10px;
    width: 150px;
  }

  table tr:nth-child(even){
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    background-color: #e7e7e7;
  }

  .profile-avatar{
    width: 150px;
    height: 150px;
    border-radius: 10px;
    border: 2px solid;
  }
</style>
