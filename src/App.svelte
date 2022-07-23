<script>
  // Our imports.
  import {scale, slide, fade} from 'svelte/transition';
  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';
  import Login from './components/Login.svelte';
  
  const createSession = () => {
    return {
      api: "http://localhost:3000",
      username: "",
      loggedIn: false,
      admin: false,
      page: "Login",
      pages: ["Home", "Login", "Register", "About"]
    };
  }

  let session = createSession();
  
  const switchPage = (e) => {
    
    session.page = e.detail;
    session.pages = ["Home", "Login", "Register", "About"];
    if (session.page === "Logout" || session.page === "Login")
      session = createSession();
    if (session.loggedIn === true){
      session.pages[1] = "Profile";
      session.pages[2] = "Logout";
    }
  };

</script>

<main class="main-page mx-auto">
  <Header {session} on:switchPage={switchPage}/>
  <div class="main-content px-5">
    
    {#if (session.page === "Home")}
      <div in:fade={{duration: 200}}>        
        <h3>Homepage</h3>
        <p>Logged in: {session.loggedIn}</p>
      </div>
    {:else if (session.page === "Login" || session.page === "Logout")}
      <div in:fade={{duration: 200}}>
        <Login {session} on:switchPage={switchPage}/>
      </div>
    {:else}
      <div>
        <h3>Invalid page: {session.page}</h3>
      </div>
    {/if}
  </div>
  <Footer />
</main>