<script>
  
  /**
   * @file The course management UI.
   * @author Umar Abdul (https://github.com/4g3nt47)
   * Props:
   *        session - The session object.
   *        course - The course being managed.
   * Emits:
   *        back - For going back to courses menu after the course was deleted.
   */

  import {createEventDispatcher} from 'svelte';
  import {slide, scale, fade} from 'svelte/transition';
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
  let exportResultsBtn, exportQuestionsBtn, deleteResultsBtn, deleteCourseBtn;
  let username = "", checkResultBtn;
  let courseResult = null;

  /**
   * Clear the status messages.
   */
  const clearMessages = () => {
    success = "";
    error = "";
  };

  /**
   * Handles keyup events on the username input field for result checking.
   * @param {object} e - The event object.
   */
  const usernameEntered = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13)
      checkResult();
  };

  /**
   * Fetch and display results of a user for the current course.
   */
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

  /**
   * Exports course results.
   */
  const exportResults = async () => {
    
    clearMessages();
    exportResultsBtn.innerText = "Exporting...";
    exportResultsBtn.disabled = true;
    try{
      const res = await fetch(`${session.api}/course/${course.id}/export/results`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.status !== 200)
        throw new Error(data.error);
      success = data.success;
      window.open(`${session.api}/${data.location}`);
    }catch(err){
      error = err.message;
    }finally{
      exportResultsBtn.disabled = false;
      exportResultsBtn.innerText = "Export Results";
    }
  };

  /**
   * Exports course questions.
   */
  const exportQuestions = async () => {

    clearMessages();
    exportQuestionsBtn.innerText = "Exporting...";
    exportQuestionsBtn.disabled = true;
    try{
      const res = await fetch(`${session.api}/course/${course.id}/export/questions`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.status !== 200)
        throw new Error(data.error);
      success = data.success;
      window.open(`${session.api}/${data.location}`)
    }catch(err){
      error = err.message;
    }finally{
      exportQuestionsBtn.disabled = false;
      exportQuestionsBtn.innerText = "Export Questions";
    }
  };

  /**
   * Deletes the test results of a user.
   */
  const deleteResults = async () => {

    clearMessages();
    if (confirm(`Delete all results for '${course.name}'?`)){
      deleteResultsBtn.innerText = "Deleting results...";
      deleteResultsBtn.disabled = true;
      try{
        const res = await fetch(`${session.api}/course/${course.id}/results`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const data = await res.json();
        if (res.status !== 200)
          throw new Error(data.error);
        success = data.success;
      }catch(err){
        error = err.message;
      }finally{
        deleteResultsBtn.disabled = false;
        deleteResultsBtn.innerText = "Delete Results";
      }
    }
  };

  /**
   * Delete the current course.
   */
  const deleteCourse = async () => {

    clearMessages();
    if (confirm(`Delete '${course.name}'?`)){
      deleteCourseBtn.innerText = "Deleting course...";
      deleteCourseBtn.disabled = true;
      try{
        const res = await fetch(`${session.api}/course/${course.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const data = await res.json();
        if (res.status !== 200)
          throw new Error(data.error);
        success = data.success;
        setTimeout(() => dispatch('back'), 1000);
      }catch(err){
        error = err.message;
      }finally{
        deleteCourseBtn.innerText = "Delete Course";
      }
    }
  };

</script>

<h3>{course.name}</h3>
<div class="w-3/5 mx-auto bg-gray-300 shadow-md rounded-md shadow-gray-600 p-4">
  <CourseInfo {session} {course}/>
  <div class="w-full border-t border-black mt-5 pt-5">
    {#if (resultCheckMode)}
      <!-- Results checking UI -->
      <div in:scale={{duration: 200}}>
        <SuccessMsg {success}/>
        <ErrorMsg {error}/>
        {#if (courseResult)}
          <div transition:slide={{duration: 200}}>
            <TestResult result={courseResult} hideCourseInfo={true}/>
          </div>
        {/if}
        <div class="flex gap-2 w-2/3 mx-auto mt-5">
          <input class="block w-2/3 border-2 pl-1 border-black rounded-md" id="username" type="text" placeholder="Username..." bind:value={username} on:keyup={usernameEntered} autocomplete="off">
          <div class="w-1/3">
            <Button bind:btn={checkResultBtn} on:click={checkResult}>Check Result</Button>
          </div>
        </div>
        <div class="w-1/2 mx-auto mt-5">
          <Button on:click={() => {resultCheckMode = false; courseResult = null; clearMessages();}}>Back</Button>
        </div>
      </div>
    {:else}
      <div class="pb-5">
        <SuccessMsg {success}/>
        <ErrorMsg {error}/>        
      </div>
      <div class="w-1/2 mx-auto flex flex-col space-y-2">
        <!-- The action buttons -->
        <Button on:click={() => {resultCheckMode = true; username = ""; clearMessages();}}>Check Results</Button>
        <Button bind:btn={exportResultsBtn} on:click={exportResults}>Export Results</Button>
        <Button bind:btn={exportQuestionsBtn} on:click={exportQuestions}>Export Questions</Button>
        <Button type="danger" bind:btn={deleteResultsBtn} on:click={deleteResults}>Delete Results</Button>
        <Button type="danger" bind:btn={deleteCourseBtn} on:click={deleteCourse}>Delete Course</Button>
      </div>
    {/if}    
  </div>
</div>
