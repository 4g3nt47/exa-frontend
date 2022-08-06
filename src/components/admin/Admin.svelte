<script>

  /**
   * @file The admin panel component.
   * @author Umar Abdul (https://github.com/4g3nt47)
   * Props:
   *        session - The session object.
   * Emits:
   *        updateSession - For updating session data.
   */

  import {createEventDispatcher} from 'svelte';
  import Button from '../Button.svelte';
  import CreateCourse from './CreateCourse.svelte';
  import ManageCourses from './ManageCourses.svelte';
  import ManageUsers from './ManageUsers.svelte';
  import EventLogs from './EventLogs.svelte';
  
  export let session = {};
  const dispatch = createEventDispatcher();

  let page = "main"; // Tracks navigation within the admin panel
  if (session.subPage)
    page = session.subPage;

  /**
   * Handles local navigation.
   * @param {string} newPage - The new page to go to.
   */
  const switchPage = (newPage) => {
    page = newPage;
    session.subPage = page;
    dispatch('updateSession', session);
  };

</script>

{#if (page === 'main')}
  <!-- The admin panel main menu -->
  <h3>Admin Panel</h3>
  <div class="admin-panel w-3/4 p-2 mt-5 mx-auto">
    <div class="admin-menu-card create-menu text-white" on:click={() => switchPage('newCourse')}>
      Create Course
    </div>
    <div class="admin-menu-card courses-menu text-white" on:click={() => switchPage('manageCourse')}>
      Manage Courses
    </div>
    <div class="admin-menu-card users-menu text-white" on:click={() => switchPage('manageUsers')}>
      Manage Users
    </div>
    <div class="admin-menu-card event-menu text-white" on:click={() => switchPage('eventLogs')}>
      Event Logs
    </div>
  </div>
<!-- Sub pages. -->
{:else if (page === 'newCourse')}
  <CreateCourse {session} on:updateSession on:abort={() => switchPage('main')}/>
{:else if (page === 'manageCourse')}
  <ManageCourses {session}/>
{:else if (page === 'manageUsers')}
  <ManageUsers {session}/>
{:else if (page === 'eventLogs')}
  <EventLogs {session}/>
{/if}
{#if (page !== 'main')}
  <!-- Back button -->
  <div class="w-full mt-10 border-t border-t-black">
    <div class="w-1/4 mx-auto mt-3">
      <Button type="secondary" on:click={() => switchPage('main')}>Back</Button>
    </div>
  </div>
{/if}

<style>
  .admin-panel{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2em;
  }

  .create-menu{
    background: url('/img/create-course.jpeg');
    background-size: 100% 100%;
  }

  .courses-menu{
    background: url('/img/manage-course.jpeg');
    background-size: 100% 100%;
  }

  .users-menu{
    background: url('/img/users-menu.jpeg');
    background-size: 100% 100%;
  }

  .event-menu{
    background: url('/img/event-logs.jpeg');
    background-size: 100% 100%;
  }
</style>