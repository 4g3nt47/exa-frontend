<script>
  
  import {createEventDispatcher} from 'svelte';
  const dispatch = createEventDispatcher();

  export let session = {};
  let fields = {username: "", password: ""};
  export let error = "";

  session.loggedIn = false;

  const login = async () => {
    
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
      dispatch('switchPage', 'Home');
    }catch(err){
      error = err.message;
    }finally{
      btn.disabled = false;
      btn.value = "Login";
    }
  };
</script>

<h3>Login</h3>
<form on:submit|preventDefault={login} class="login-form w-1/3 rounded-md border-2 border-black shadow-lg shadow-gray-600 p-5 mx-auto">
  <label for="username">Username:</label>
  <input type="text" id="username" placeholder="Username..." bind:value={fields.username} required>
  <label for="password">Password:</label>
  <input type="password" id="password" placeholder="Password..." bind:value={fields.password} required>
  <input type="submit" id="login" value="Login">
  {#if (error.length > 0)}
    <div class="bg-red-500 mt-5 py-1 pl-2 bg-opacity-20 text-black border-l-4 border-red-800">{error}</div>
  {/if}
</form>