<script>
  
  // This component is used for managing an individual course by an admin.

  import {createEventDispatcher} from 'svelte';
  import CourseInfo from '../course/CourseInfo.svelte';
  import TestResult from '../TestResult.svelte';
  import Loader from '../Loader.svelte';
  import Button from '../Button.svelte';
  import SuccessMsg from '../SuccessMsg.svelte';
  import ErrorMsg from '../ErrorMsg.svelte';

  export let session = {};
  export let course = {};
  const dispatch = createEventDispatcher();
  let success = "", error = "";
  let resultCheckMode = false;
  let exportResultsBtn, exportQuestionsBtn;
  let checkResultBtn = null, username = "";
  let courseResult = null;

  const clearMessages = () => {
    success = "";
    error = "";
  };

  const checkResult = async () => {

    courseResult = null;
    clearMessages();
    if (!username){
      document.getElementById('username').focus();
      return;
    }
    checkResultBtn.innerText = "Checking...";
    checkResultBtn.disabled = true;
    try{
      // Load the profile of the user
      const res = await fetch(`${session.api}/user/profile/${username}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.status !== 200)
        throw new Error(data.error);
      // Lookup the result of the current course.
      for (let result of data.results){
        if (course.id === result.courseID){ // Found!
          courseResult = result;
          break;
        }
      }
      if (courseResult === null)
        error = "Result not found for the given user!";
    }catch(err){
      error = err.message;
    }finally{
      checkResultBtn.disabled = false;
      checkResultBtn.innerText = 'Check Result';
    }
  };

</script>

<h3>{course.name}</h3>
<div class="w-3/5 mx-auto bg-gray-300 shadow-md rounded-md shadow-gray-600 p-3">
  <CourseInfo {session} {course}/>
  <div class="w-full border-t border-black mt-5 pt-5">
    {#if (resultCheckMode)}
      <div>
        <SuccessMsg {success}/>
        <ErrorMsg {error}/>
        {#if (courseResult)}
          <TestResult result={courseResult} hideCourseInfo={true}/>
        {/if}
        <div class="flex gap-2 w-2/3 mx-auto mt-5">
          <input class="block w-2/3 border-2 pl-1 border-black rounded-md" id="username" type="text" placeholder="Username..." bind:value={username}>
          <div class="w-1/3">
            <Button bind:btn={checkResultBtn} on:click={checkResult}>Check Result</Button>
          </div>
        </div>
        <div class="w-1/2 mx-auto mt-5">
          <Button on:click={() => {resultCheckMode = false; clearMessages();}}>Back</Button>
        </div>
      </div>
    {:else}
      <div class="pb-5">
        <SuccessMsg {success}/>
        <ErrorMsg {error}/>        
      </div>
      <div class="w-1/2 mx-auto flex flex-col space-y-2">
        <Button on:click={() => resultCheckMode = true}>Check Results</Button>
        <Button>Export Results</Button>
        <Button>Export Questions</Button>
        <Button type="danger">Delete Results</Button>
        <Button type="danger">Delete Course</Button>
      </div>
    {/if}    
  </div>
</div>
