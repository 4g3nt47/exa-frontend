<script>

  /**
   * @file Lists available courses for administrative management.
   * @author Umar Abdul (https://github.com/4g3nt47)
   * Props:
   *        session - The session object.
   */

  import CourseList from '../course/CourseList.svelte';
  import ManageCourse from './ManageCourse.svelte';

  export let session = {};
  let course = null;

  /**
   * Handles course selection event generated by the CourseList component.
   * @param {object} e - The event object.
   */
  const selectCourse = (e) => {
    course = e.detail;
  };

</script>

{#if (!course)}
  <CourseList {session} handleSelection={false} on:selectCourse={selectCourse}/>
{:else}
  <ManageCourse {session} {course} on:back={() => course = null}/>
{/if}
