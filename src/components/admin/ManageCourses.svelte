<script>

  import CourseList from '../course/CourseList.svelte';
  import ManageCourse from './ManageCourse.svelte';

  export let session = {};
  let course = null;

  const selectCourse = (e) => {
    course = e.detail;
  };

</script>

{#if (!course)}
  <CourseList {session} handleSelection={false} on:selectCourse={selectCourse}/>
{:else}
  <ManageCourse {session} {course} on:back={() => course = null}/>
{/if}
