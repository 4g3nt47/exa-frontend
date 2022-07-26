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
<div class="w-2/3 mx-auto p-5">
  {#if (profile == null && error.length === 0)}
    <Loader>Loading profile...</Loader>
  {:else if (profile !== null)}
    <div class="info-card mx-auto flex rounded-2xl p-5 shadow-lg shadow-gray-600">
      <img class="profile-avatar border-gray-700" src={session.api + "/" +  profile.avatar} alt="My avatar">
      <div class="text-left ml-2 w-full">
        <table>
          <tr>
            <th>Name:</th>
            <td>{profile.name}</td>
          </tr>
          <tr>
            <th>Gender:</th>
            <td>{profile.gender}</td>
          </tr>
          <tr>
            <th>Joined on:</th>
            <td>{new Date(profile.creationDate).toLocaleString()}</td>
          </tr>
          <tr>
            <th>Courses taken:</th>
            <td>{profile.results.length}</td>
          </tr>

        </table>
      </div>
    </div>
  {/if}
  <ErrorMsg {error}/>
</div>

<style>

  .info-card{
    width: 75%;
  }

  table{
    width: 100%;
  }

  table th{
    text-align: right;
    padding-right: 10px;
    width: 150px;
  }

  .profile-avatar{
    width: 110px;
    height: 110px;
    border-radius: 50%;
    border: 2px solid;
  }
</style>
