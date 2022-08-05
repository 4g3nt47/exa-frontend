<script>

  // The admin panel component.

  import {createEventDispatcher} from 'svelte';
  import Button from '../Button.svelte';
  import CreateCourse from './CreateCourse.svelte';
  import ManageCourses from './ManageCourses.svelte';
  import ManageUsers from './ManageUsers.svelte';
  
  export let session = {};
  const dispatch = createEventDispatcher();

  let page = "main"; // Tracks navigation within the admin panel
  if (session.subPage)
    page = session.subPage;

  // Used for local navigation
  const switchPage = (newPage) => {
    page = newPage;
    session.subPage = page;
    dispatch('updateSession', session);
  };
</script>

{#if (page === 'main')}
  <h3>Admin Panel</h3>
  <div class="admin-panel w-3/4 p-2 mt-5 mx-auto">
    <div class="admin-menu-card create-menu text-white" on:click={() => switchPage('newCourse')}>
      Create Course
    </div>
    <div class="admin-menu-card result-menu text-white" on:click={() => switchPage('manageCourse')}>
      Manage Courses
    </div>
    <div class="admin-menu-card import-menu text-white" on:click={() => switchPage('manageUsers')}>
      Manage Users
    </div>
    <div class="admin-menu-card event-menu text-white" on:click={() => switchPage('eventLogs')}>
      Event Logs
    </div>
  </div>
{:else if (page === 'newCourse')}
  <CreateCourse {session} on:updateSession on:abort={() => switchPage('main')}/>
{:else if (page === 'manageCourse')}
  <ManageCourses {session}/>
{:else if (page === 'manageUsers')}
  <ManageUsers {session}/>
{:else if (page === 'eventLogs')}
  <h3>Event Logs</h3>
{/if}
{#if (page !== 'main')}
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

  .import-menu{
    background: url('/img/import-course.jpeg');
    background-size: 100% 100%;
  }

  .result-menu{
    background: url('/img/export-result.jpeg');
    background-size: 100% 100%;
  }

  .event-menu{
    background: url('/img/event-logs.jpeg');
    background-size: 100% 100%;
  }
</style>