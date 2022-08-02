<script>
  // This component is represents a single course item listed in the home page.

  import {createEventDispatcher} from 'svelte';
  const dispatch = createEventDispatcher()

  export let session = {};
  export let course = {};

</script>

<div class="flex gap-2 bg-gray-200 p-2 rounded-lg shadow-md shadow-gray-600 cursor-pointer opacity-90 hover:opacity-100 duration-200" on:click={() => dispatch('click', course)}>
  <img class="w-2/5 h-32 rounded-lg" src={`${session.api}/${course.avatar}`} alt={course.name}>
  <div>
    <p class="font-bold">{course.name}</p>
    <p>{course.title}</p>
    <p>{new Date(course.creationDate).toLocaleDateString()}</p>
    <p><span class="font-bold">{course.questions}</span> questions in <span class="font-bold">{(course.questions * course.duration) / 60000}</span> minutes</p>
  </div>
</div>