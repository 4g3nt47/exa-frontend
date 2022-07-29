<script>
  
  import {onMount, createEventDispatcher} from 'svelte';
  import SuccessMsg from './SuccessMsg.svelte';
  import ErrorMsg from './ErrorMsg.svelte';
  import Button from './Button.svelte';

  const dispatch = createEventDispatcher();
  export let session = {};
  let success = "";
  let error = "";
  let fields = {username: "", password: ""};
  let submitBtn;

  const login = async () => {
    
    success = "";
    error = "";
    submitBtn.disabled = true;
    submitBtn.innerText = "Login in...";
    try{
      const rsp = await fetch(`${session.api}/user/login`, {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
      });
      const data = await rsp.json();
      if (rsp.status !== 200)
        throw new Error(data.error);
      session = {...session, loggedIn: true, ...data};
      dispatch('updateSession', session);
      success = "Authentication successful!";
      setTimeout(() => dispatch('switchPage', 'Home'), 1000);
    }catch(err){
      error = err.message;
    }finally{
      submitBtn.disabled = false;
      submitBtn.innerText = "Login";
    }
  };

  onMount(() => {
    document.getElementById('username').focus();
  });
  
</script>

<h3>Login</h3>
<form class="login-form" on:submit|preventDefault={login}>
  <label for="username">Username:</label>
  <input type="text" id="username" placeholder="Username..." bind:value={fields.username} required>
  <label for="password">Password:</label>
  <input type="password" id="password" placeholder="Password..." bind:value={fields.password} required>
  <div class="mt-5">
    <Button bind:btn={submitBtn} btnType="submit">Login</Button>
  </div>
  <SuccessMsg {success}/>
  <ErrorMsg {error}/>    
</form>