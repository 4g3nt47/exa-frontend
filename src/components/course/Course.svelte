<script>

  /**
   * @file The course display component used when starting a test
   * @author Umar Abdul (https://github.com/4g3nt47)
   * Props:
   *        session - The session object.
   *        course - The target course.
   * Emits:
   *        back - For going back to the main menu.
   */
  
  import {onMount, onDestroy, createEventDispatcher} from 'svelte';
  import Button from '../Button.svelte';
  import SuccessMsg from '../SuccessMsg.svelte';
  import ErrorMsg from '../ErrorMsg.svelte';
  import CourseTest from './CourseTest.svelte';
  import Countdown from '../../lib/countdown.js';

  export let session = {};
  export let course = {};
  let success = "", error = "";

  const dispatch = createEventDispatcher();
  let startedCourseData = null;
  let password = "";
  let startBtn, backBtn;
  let completed = false, released = false;
  let releaseTime = "", countdown = null;

  /**
   * Clear status messages.
   */
  const clearMessages = () => {
    success = "";
    error = "";
  };

  /**
   * Go back to home page.
   */
  const back = () => {
    dispatch("back");
  };

  /**
   * Starts the course test.
   */
  const startTest = async () => {

    clearMessages();
    // Change button text and disable it.
    startBtn.innerText = (course.activeTest ? "Resuming..." : "Starting...");
    startBtn.disabled = true;
    try{
      // Start the test.
      const res = await fetch(`${session.api}/course/start`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: course.id,
          password
        })
      });
      const data = await res.json();
      if (res.status !== 200)
        throw new Error(data.error);
      startedCourseData = data;
    }catch(err){
      error = err.message;
    }finally{
      // Cleanup
      startBtn.disabled = false;
      startBtn.innerText = "Start";
    }
  };

  /**
   * Handles the 'finish' event emitted by the CourseTest component when user finishes the test.
   */
  const testFinished = () => {

    completed = true;
    course.activeTest = false;
    startedCourseData = null;
    success = "Congratulations! Your result should be in your profile.";
  };

  /**
   * Setup the component.
   */
  onMount(() => {
    // Init our course release countdown if needed.
    if (Date.now() < course.releaseDate){ // Course not yet released.
      startBtn.disabled = true;
      countdown = new Countdown({
        onUpdate: (timeLeft) => {
          releaseTime = timeLeft;
        },
        onFinish: () => {
          released = true;
          startBtn.disabled = false;
        },
        target: course.releaseDate,
        strOutput: true
      });
      countdown.start();
    }else{
      released = true;
    }
  });

  // Cleanup
  onDestroy(() => {
    if (countdown)
      countdown.stop(); // Stop course release countdown.
  });

</script>

{#if (!startedCourseData)}
  <div class="mx-40">
    <div class="bg-gray-300 mx-56 rounded-lg shadow-lg shadow-gray-600 pb-5">
      <img class="w-full h-56 rounded-t-lg" src={`${session.api}/${course.avatar}`} alt="">
      <table class="w-full my-2 border-t-2 border-black">
        <tr>
          <th>Name:</th>
          <td>{course.name}</td>
        </tr>
        <tr>
          <th>Title:</th>
          <td>{course.title}</td>
        </tr>
        <tr>
          <th>Date created:</th>
          <td>{new Date(course.creationDate).toLocaleDateString()}</td>
        </tr>
        <tr>
          <th>Questions:</th>
          <td>{course.questions}</td>
        </tr>
        <tr>
          <th>Passing score:</th>
          <td>{course.passingScore}%</td>
        </tr>
        <tr>
          <th>Time allowed:</th>
          <td>{((course.questions * course.duration) / 60000).toFixed(2)} minutes</td>
        </tr>
        {#if (!released)}
          <tr>
            <th>Time to release:</th>
            <td>{releaseTime}</td>
          </tr>
        {/if}
      </table>
      {#if (course.password && course.activeTest !== true)}
        <div class="w-1/2 mx-auto text-right my-2">
          <input class="block w-full my-1 mb-3 leading-7 border-2 border-black rounded-md px-1" type="password" placeholder="Password..." bind:value={password}>
        </div>
      {/if}
      <div class="mx-5 mb-2">
        <SuccessMsg {success}/>
        <ErrorMsg {error}/>
      </div>
      <div class="flex gap-2 mx-16">
        <Button type="secondary" bind:btn={backBtn} on:click={back}>Back</Button>
        {#if (!completed)}
          <Button type="primary" bind:btn={startBtn} on:click={startTest}>{(course.activeTest ? 'Resume' : 'Start')}</Button>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <CourseTest {session} courseInfo={course} course={startedCourseData} on:finish={testFinished}/>
{/if}

<style>

  tr{
    border-bottom: 2px solid black;
  }
  
  th{
    width: 35%;
    text-align: left;
    padding-left: 10px;
  }
</style>