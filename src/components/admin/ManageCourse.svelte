<script>
  
  // This component is used for managing an individual course by an admin.

  import {onMount, createEventDispatcher} from 'svelte';
  import Loader from '../Loader.svelte';
  import Button from '../Button.svelte';

  export let session = {};
  export let course = {};
  const dispatch = createEventDispatcher();
  let result = null;

</script>

<h3>{course.name}</h3>
<div class="w-3/5 mx-auto bg-gray-300 shadow-md shadow-gray-600 p-5">
  <div class="flex gap-2">
    <img class="h-44 w-2/5 rounded-md" src={`${session.api}/${course.avatar}`} alt="">
    <div>
      <p>hello</p>
    </div>
  </div>
</div>
