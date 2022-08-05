<script>
  
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

  const clearMessages = () => {
    success = "";
    error = "";
  };

  const usernameKeyup = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13)
      findUser();
  };

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

  onMount(() => {
    document.getElementById("username").focus();
  });

</script>

<h3>Users</h3>
<div class="w-2/3 bg-gray-300 mx-auto shadow-md shadow-gray-600 p-5">
  <div class="w-2/3 mx-auto flex gap-2 mb-5">
    <input class="block w-2/3 border-2 pl-1 border-black rounded-md" type="text" id="username" bind:value={username} placeholder="Username..." autocomplete="off" on:keyup={usernameKeyup}>
    <div class="w-1/3">
      <Button bind:btn={findBtn} on:click={findUser}>Find</Button>
    </div>
  </div>
  {#if (profile)}
    <div transition:slide|local={{duration: 200}}>
      <UserInfo {session} {profile}/>
      {#if (profile.results.length > 0)}
        <h5 class="text-center my-10 text-xl">Results</h5>
        {#each profile.results as result}
          <div class="w-full border-t border-dashed border-t-black">
            <TestResult {result}/>
          </div>
        {/each}
      {/if}
      <div class="w-full grid grid-cols-2 gap-2 mt-5">
        <Button>{profile.admin === true ? 'Revoke Admin' : 'Grant Admin'}</Button>
        <Button>Lock Account</Button>
        <Button type="danger">Wipe Results</Button>
        <Button type="danger">Delete Account</Button>
      </div>
    </div>
  {/if}
  <div>
    <SuccessMsg {success}/>
    <ErrorMsg {error}/>
  </div>
</div>