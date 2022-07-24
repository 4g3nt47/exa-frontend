<script>
  
  import {createEventDispatcher} from 'svelte';
  import FormSuccess from './FormSuccess.svelte';
  import FormError from './FormError.svelte';

  export let session = {};
  let success = "";
  let error = "";
  const dispatch = createEventDispatcher();
  let fields = {username: "", password: ""};

  session.loggedIn = false;

  const login = async () => {
    
    success = "";
    error = "";
    const btn = document.getElementById("login");
    btn.disabled = true;
    btn.value = "Login in...";
    try{
      const rsp = await fetch(`${session.api}/user/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
      });
      const data = await rsp.json();
      if (rsp.status !== 200)
        throw new Error(data.error);
      session.loggedIn = true;
      session.username = fields.username;
      success = "Authentication successful!"
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
  <FormSuccess {success}/>
  <FormError {error}/>
</form>