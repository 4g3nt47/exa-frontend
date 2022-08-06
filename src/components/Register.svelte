<script>

  /**
   * @file Handles user registration.
   * @author Umar Abdul (https://github.com/4g3nt47)
   * Props:
   *        session - The session object.
   * Emits:
   *        switchPage - For switching pages after successful registration.
   */

  import {onMount, createEventDispatcher} from 'svelte';
  import SuccessMsg from './SuccessMsg.svelte';
  import ErrorMsg from './ErrorMsg.svelte';
  import Button from './Button.svelte';

  export let session = {};
  const dispatch = createEventDispatcher();
  let success = ""
  let error = "";
  let submitBtn;

  // Will be hooked to the registration form.
  const fields = {
    username: "",
    password: "",
    confPassword: "",
    name: ""
  };

  /**
   * Perform the registration.
   */
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
    submitBtn.innerText = "Creating account...";
    submitBtn.disabled = true;
    try{
      const formData = new FormData(); // Need this due to file upload.
      for (let param in fields)
        formData.append(param, fields[param]);
      formData.append("file", document.getElementById("file").files[0]);
      // Make the request
      const rsp = await fetch(`${session.api}/user/register`, {
        method: "POST",
        body: formData
      });
      const data = await rsp.json();
      if (rsp.status !== 200) // Something went wrong...
        throw new Error(data.error);
      // We are good :)
      document.getElementById("register").reset();
      success = data.success;
      setTimeout(() => dispatch('switchPage', 'Login'), 1000);
    }catch(err){
      error = err.message; // Display the error
    }finally{
      // Restore our button
      submitBtn.disabled = false;
      submitBtn.innerText = "Register";
    }
  };

  /**
   * Focus on username field
   */
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
  <label for="file">Profile picture:</label>
  <input class="mt-2 w-full" type="file" name="file" id="file" required>
  <div class="mt-5">
    <Button bind:btn={submitBtn} btnType="submit">Register</Button>
  </div>
  <SuccessMsg {success}/>
  <ErrorMsg {error}/>
</form>