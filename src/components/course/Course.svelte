<script>

  // This component displays course data when clicked, and handles the test.
  
  import {scale, fade, slide} from 'svelte/transition';
  import {createEventDispatcher} from 'svelte';
  import Button from '../Button.svelte';

  export let session = {};
  export let course = {};

  const dispatch = createEventDispatcher();
  let started = false;
  let password = "";
  let startBtn, backBtn;

  const back = () => {
    dispatch("back");
  };

  const startTest = () => {
    started = true;
  };


</script>

<div class="mx-40">
  {#if (!started)}
    <div class="mx-56 rounded-lg shadow-lg shadow-gray-600 pb-3">
      <img class="w-full h-56 rounded-t-lg" src={`${session.api}/${course.avatar}`} alt="">
      <table class="w-full my-2">
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
          <th>Time allowed:</th>
          <td>{(course.questions * course.duration) / 60000} minutes</td>
        </tr>
      </table>
      {#if (course.password)}
        <div class="w-1/2 mx-auto text-right">
          <input class="block w-full my-1 mb-3 leading-7 border-2 border-black rounded-md px-1" type="password" placeholder="Password..." bind:value={password}>
        </div>
      {/if}
      <div class="flex gap-2 mx-16">
        <Button type="secondary" bind:btn={backBtn} on:click={back}>Back</Button>
        <Button type="primary" bind:btn={startBtn} on:click={startTest}>Start</Button>
      </div>
    </div>
  {/if}
</div>

<style>
  th{
    width: 35%;
    text-align: right;
  }
  td{
    padding-left: 10px;
  }
</style>