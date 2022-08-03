<script>
  // This component is represents a single course item listed in the home page.

  import {createEventDispatcher} from 'svelte';
  const dispatch = createEventDispatcher()

  export let session = {};
  export let course = {};

</script>

<div class="flex items-center gap-2 bg-gray-300 p-2 rounded-lg shadow-md shadow-gray-600 cursor-pointer opacity-90 hover:opacity-100 duration-200" on:click={() => dispatch('click', course)}>
  <img class="w-2/5 h-32 rounded-md" src={`${session.api}/${course.avatar}`} alt={course.name}>
  <div class="w-full">
    <table class="w-full">
      <tr>
        <td>{course.name}</td>
      </tr>
      <tr>
        <td>{course.title}</td>
      </tr>
      <tr>
        <td>{new Date(course.creationDate).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td><span class="font-bold">{course.questions}</span> questions in <span class="font-bold">{((course.questions * course.duration) / 60000).toFixed(2)}</span> minutes</td>
      </tr>
    </table>
  </div>
</div>

<style>
  table tr:nth-child(even){
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    background-color: #e7e7e7;
  }
</style>