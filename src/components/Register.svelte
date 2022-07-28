<script>

  import {onMount, createEventDispatcher} from 'svelte';
  import SuccessMsg from './SuccessMsg.svelte';
  import ErrorMsg from './ErrorMsg.svelte';

  export let session = {};
  const dispatch = createEventDispatcher();
  let success = ""
  let error = "";

  const fields = {
    username: "",
    password: "",
    confPassword: "",
    name: "",
    gender: "male"
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
      const formData = new FormData();
      for (let param in fields)
        formData.append(param, fields[param]);
      formData.append("file", document.getElementById("file").files[0]);
      const rsp = await fetch(`${session.api}/user/register`, {
        method: "POST",
        header: [["Content-Type", "multipart/form-data"]],
        body: formData
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

  onMount(() => {
    document.getElementById('username').focus();
  });
  
</script>

<h3>Register</h3>
<form id="register" class="signup-form" on:submit|preventDefault={register}>
  <label for="username">Username:</label>
  <input type="text" id="username" placeholder="Username..." bind:value={fields.username} required>
  <label for="password">Password:</label>
  <input type="password" id="password" placeholder="Password..." bind:value={fields.password} required>
  <label for="conf-password">Confirm password:</label>
  <input type="password" id="conf-password" placeholder="Confirm password..." bind:value={fields.confPassword} required>
  <label for="name">Full Name:</label>
  <input type="text" id="name" placeholder="Your full name..." bind:value={fields.name} required>
  <label for="gender">Gender:</label>
  <div id="gender" class="w-full pl-10 mb-2 space-x-1">
    <input type="radio" id="male" name="gender" value="Male" on:click={() => fields.gender = "male"} checked><label for="male">Male</label>
    <input type="radio" id="female" name="gender" value="Female" on:click={() => fields.gender = "female"}><label for="female">Female</label>
  </div>
  <label for="file">Profile picture:</label>
  <input class="mt-2 w-full" type="file" name="file" id="file" required>
  <input type="submit" id="submit" value="Register">
  <SuccessMsg {success}/>
  <ErrorMsg {error}/>
</form>