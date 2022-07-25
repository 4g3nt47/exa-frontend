<script>

  import {createEventDispatcher} from 'svelte';
  import SuccessMsg from './SuccessMsg.svelte';
  import ErrorMsg from './ErrorMsg.svelte';

  export let session = {};
  const dispatch = createEventDispatcher();
  let success = ""
  let error = "";

  const fields = {
    username: "",
    password: "",
    confPassword: ""
  };

  const register = async () => {

    success = "";
    error = "";
    if (fields.password !== fields.confPassword){
      error = "Passwords need to match!";
      return;
    }
    if (fields.password.length < 8){
      error = "Password too weak!";
      return;
    }
    const btn = document.getElementById('submit');
    btn.value = "Creating account...";
    btn.disabled = true;
    try{
      const rsp = await fetch(`${session.api}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: fields.username,
          password: fields.password
        })
      });
      const data = await rsp.json();
      if (rsp.status !== 200)
        throw new Error(data.error);
      document.getElementById("register").reset();
      success = data.success;
      setTimeout(() => dispatch('switchPage', 'Login'), 1000);
    }catch(err){
      error = err.message;
    }finally{
      btn.disabled = false;
      btn.value = "Register";
    }
  };
  
</script>

<h3>Register</h3>
<form id="register" on:submit|preventDefault={register}>
  <label for="username">Username:</label>
  <input type="text" id="username" placeholder="Username..." bind:value={fields.username} required>
  <label for="password">Password:</label>
  <input type="password" id="password" placeholder="Password..." bind:value={fields.password} required>
  <label for="conf-password">Confirm password:</label>
  <input type="password" id="conf-password" placeholder="Confirm password..." bind:value={fields.confPassword} required>
  <input type="submit" id="submit" value="Register">
  <SuccessMsg {success}/>
  <ErrorMsg {error}/>
</form>