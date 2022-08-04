<script>
  // This component is represents a single course item listed in the home page.

  import {createEventDispatcher} from 'svelte';
  import CourseInfo from './CourseInfo.svelte';

  const dispatch = createEventDispatcher()
  export let session = {};
  export let course = {};

</script>

<div class="flex items-center gap-2 bg-gray-300 p-2 rounded-lg shadow-md shadow-gray-600 cursor-pointer opacity-90 hover:opacity-100 duration-200" on:click={() => dispatch('click', course)}>
  <CourseInfo {session} {course}/>
</div>

<style>
  table tr:nth-child(even){
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    background-color: #e7e7e7;
  }
</style>