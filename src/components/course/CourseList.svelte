<script>

  /**
   * @file Displays a list of available courses.
   * @author Umar Abdul (https://github.com/4g3nt47)
   * Props:
   *   session         - The session object.
   *   handleSelection - Dictates whether this component should display the course clicked by
   *                     user using the 'Course' component. If false, 'selectCourse' event is emitted
   *                     with the selected course as detail.
   * Emits:
   *   selectCourse - When a course is selected.
   */

  import {onMount, createEventDispatcher} from 'svelte';
  import {scale, slide, fade} from 'svelte/transition';
  import Loader from '../Loader.svelte';
  import ErrorMsg from '../ErrorMsg.svelte';
  import CourseItem from './CourseItem.svelte';
  import Course from './Course.svelte';

  const dispatch = createEventDispatcher();
  export let session = {};
  export let handleSelection = true;
  let courses = null; // Loaded courses will be stored here
  let selectedCourse = null; // Course selected by the user
  let error = "";

  /**
   * Loads available courses on mount.
   */
  onMount(async () => {

    // Load courses
    error = "";
    try{
      const rsp = await fetch(`${session.api}/course`, {
        credentials: 'include'
      });
      const data = await rsp.json();
      if (rsp.status !== 200)
        throw new Error(data.error);
      courses = data;
    }catch(err){
      error = err.message;
    }
  });

  /**
   * Handles course selection. Emits 'selectCourse'
   * @param {object} e - The event object.
   */
  const select = (e) => {
    if (handleSelection)
      selectedCourse = e.detail;
    else
      dispatch('selectCourse', e.detail);
  };

</script>

{#if (selectedCourse === null)}
  <h3>Courses</h3>
  <div class="w-full mt-5 py-10 px-20">
    {#if (courses === null && error.length === 0)}
      <Loader>Loading courses...</Loader>
    {:else}
      {#if ((!courses) || courses.length === 0)}
        <ErrorMsg error="No course available at the moment!"/>
      {:else}
        <div class="courses">
          {#each courses as course}
            <CourseItem {session} {course} on:click={select}/>
          {/each}
        </div>
      {/if}
    {/if}
    <ErrorMsg {error}/>
  </div>
{:else}
  <Course {session} course={selectedCourse} on:back={() => selectedCourse = null}/>
{/if}

<style>
  .courses{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1.5em;
  }
</style>
