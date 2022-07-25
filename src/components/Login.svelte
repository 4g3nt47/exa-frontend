<script>
  
  import {createEventDispatcher} from 'svelte';
  import SuccessMsg from './SuccessMsg.svelte';
  import ErrorMsg from './ErrorMsg.svelte';

  export let session = {};
  let success = "";
  let error = "";
  const dispatch = createEventDispatcher();
  let fields = {username: "", password: ""};

  const login = async () => {
    
    success = "";
    error = "";
    const btn = document.getElementById("login");
    btn.disabled = true;
    btn.value = "Login in...";
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
      btn.disabled = false;
      btn.value = "Login";
    }
  };
</script>

<h3>Login</h3>
<form on:submit|preventDefault={login}>
  <label for="username">Username:</label>
  <input type="text" id="username" placeholder="Username..." bind:value={fields.username} required>
  <label for="password">Password:</label>
  <input type="password" id="password" placeholder="Password..." bind:value={fields.password} required>
  <input type="submit" id="login" value="Login">
  <SuccessMsg {success}/>
  <ErrorMsg {error}/>
</form>