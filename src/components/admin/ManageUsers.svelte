<script>
  
  /**
   * @file The users management UI.
   * @author Umar Abdul (https://github.com/4g3nt47)
   * Props:
   *        session - The session object.
   */

  import {onMount} from 'svelte';
  import {slide} from 'svelte/transition';
  import Button from '../Button.svelte';
  import SuccessMsg from '../SuccessMsg.svelte';
  import ErrorMsg from '../ErrorMsg.svelte';
  import UserInfo from '../UserInfo.svelte';
  import TestResult from '../TestResult.svelte';

  export let session = {};
  let success = "", error = "";
  let username = "", findBtn;
  let profile = null;
  let toggleAdminBtn, wipeResultsBtn, deleteAccountBtn;

  /**
   * Clear status messages.
   */
  const clearMessages = () => {
    success = "";
    error = "";
  };

  /**
   * Handle keyup events on the username field.
   * @param {object} e - The event object.
   */
  const usernameKeyup = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13)
      findUser();
  };

  /**
   * Handles user lookup.
   */
  const findUser = async () => {
    
    if (!(username))
      return;
    clearMessages();
    findBtn.innerText = "Finding...";
    findBtn.disabled = true;
    try{
      const res = await fetch(`${session.api}/user/profile/${username}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.status !== 200)
        throw new Error(data.error);
      profile = data;
    }catch(err){
      profile = null;
      error = err.message;
    }finally{
      findBtn.disabled = false;
      findBtn.innerText = "Find";
    }
  };

  /**
   * Grants or revoke admin privs of a user.
   */
  const toggleAdmin = async () => {

    clearMessages();
    toggleAdminBtn.innerText = (profile.admin ? 'Revoking...' : 'Granting...');
    toggleAdminBtn.disabled = true;
    try{
      const res = await fetch(`${session.api}/user/admin/${(profile.admin ? 'revoke' : 'grant')}/${profile.username}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.status !== 200)
        throw new Error(data.error);
      profile.admin = (!profile.admin);
    }catch(err){
      error = err.message;
    }finally{
      toggleAdminBtn.disabled = false;
      toggleAdminBtn.innerText = (profile.admin ? 'Revoke Admin' : 'Grant Admin');
    }
  };

  /**
   * Wipe the results of a user.
   */
  const wipeResults = async () => {

    if (!confirm(`Delete all results for '${profile.username}'?`))
      return;
    clearMessages();
    wipeResultsBtn.innerText = "Wiping...";
    wipeResultsBtn.disabled = true;
    try{
      const res = await fetch(`${session.api}/user/results/${profile.username}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.status !== 200)
        throw new Error(data.error);
      profile.results = [];
    }catch(err){
      error = err.message;
    }finally{
      wipeResultsBtn.disabled = false;
      wipeResultsBtn.innerText = "Wipe Results";
    }
  };

  /**
   * Delete the account of a user.
   */
  const deleteAccount = async () => {

    if (!confirm(`Delete account for '${profile.username}'?`))
      return;
    clearMessages();
    deleteAccountBtn.innerText = "Deleting...";
    deleteAccountBtn.disabled = true;
    try{
      const res = await fetch(`${session.api}/user/${profile.username}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.status !== 200)
        throw new Error(data.error);
      success = "Account deleted!";
      profile = null;
      username = "";
    }catch(err){
      error = err.message;
    }finally{
      deleteAccountBtn.disabled = false;
      deleteAccountBtn.innerText = "Delete Account";
    }
  };

  /**
   * Focus on username input field on load.
   */
  onMount(() => {
    document.getElementById("username").focus();
  });

</script>

<h3>Users</h3>
<div class="w-2/3 bg-gray-300 mx-auto shadow-md shadow-gray-600 p-5">
  <!-- User lookup section -->
  <div class="w-2/3 mx-auto flex gap-2 mb-5">
    <input class="block w-2/3 border-2 pl-1 border-black rounded-md" type="text" id="username" bind:value={username} placeholder="Username..." autocomplete="off" on:keyup={usernameKeyup}>
    <div class="w-1/3">
      <Button bind:btn={findBtn} on:click={findUser}>Find</Button>
    </div>
  </div>
  {#if (profile)}
    <div transition:slide|local={{duration: 200}}>
      <!-- Display user info -->
      <UserInfo {session} {profile}/>
      {#if (profile.results.length > 0)}
        <h5 class="text-center my-10 text-xl">Results</h5>
        {#each profile.results as result}
          <div class="w-full border-t border-dashed border-t-black">
            <TestResult {result}/>
          </div>
        {/each}
      {/if}
      <!-- Action buttons -->
      <div class="w-full flex gap-2 mt-5">
        <Button bind:btn={toggleAdminBtn} on:click={toggleAdmin}>{profile.admin === true ? 'Revoke Admin' : 'Grant Admin'}</Button>
        <Button bind:btn={wipeResultsBtn} on:click={wipeResults} type="danger">Wipe Results</Button>
        <Button bind:btn={deleteAccountBtn} on:click={deleteAccount} type="danger">Delete Account</Button>
      </div>
    </div>
  {/if}
  <!-- Status messages -->
  <div>
    <SuccessMsg {success}/>
    <ErrorMsg {error}/>
  </div>
</div>
