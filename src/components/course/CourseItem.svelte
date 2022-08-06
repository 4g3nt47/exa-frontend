<script>
  
  /**
   * @file A clickable course item display.
   * @author Umar Abdul (https://github.com/4g3nt47)
   * Props:
   *        session - The session object.
   *        course - The course to display.
   * Emits:
   *        click - When a course is selected. Selected course accessible as e.detail
   */

  import {createEventDispatcher} from 'svelte';
  import CourseInfo from './CourseInfo.svelte';

  const dispatch = createEventDispatcher()
  export let session = {};
  export let course = {};

</script>

<div class="flex items-center gap-2 bg-gray-300 p-2 rounded-lg shadow-md shadow-gray-600 cursor-pointer opacity-90 hover:opacity-100 duration-200" on:click={() => dispatch('click', course)}>
  <CourseInfo {session} {course}/>
</div>
