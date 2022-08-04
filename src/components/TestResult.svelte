<script>

  // A component for displaying a test result. Used in user profile.

  import {onMount} from 'svelte';
  import {Chart, registerables} from 'chart.js';

  export let result = {};
  export let hideCourseInfo = false; // Used to hide some info about the course.

  onMount(() => {

    // Setup Chart.js and create a little pie chart for questions passed and failed.
    Chart.register(...registerables);
    new Chart(result.courseID, {
      type: 'pie',
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      },
      data: {
        labels: ['Correct', 'Wrong'],
        datasets: [
          {
            label: 'Correct Answers',
            data: [result.passedQuestions, result.failedQuestions],
            backgroundColor: ['hsl(120, 50%, 60%)', 'hsl(0, 70%, 60%)'],
            borderColor: ['black', 'black'],
            borderWidth: [1, 1]
          }
        ]
      }
    });
  });

</script>

<div class="w-full flex items-center py-2">
  <div class="w-36">
    <canvas id={result.courseID} style="max-height: 100px; max-width: 100px;">
    </canvas>    
  </div>
  <div class="w-full">
    <table>
      {#if (!hideCourseInfo)}
        <tr>
          <th>Name:</th>
          <td>{result.courseName}</td>
        </tr>
        <tr>
          <th>Title:</th>
          <td>{result.courseTitle}</td>
        </tr>
      {/if}
      <tr>
        <th>Date:</th>
        <td>{new Date(result.date).toLocaleString()}</td>
      </tr>
      <tr>
        <th>Score:</th>
        <td>{result.score.toFixed(2)}% ({result.passed === true ? 'Pass' : 'Fail'})</td>
      </tr>
      <tr>
        <th>Duration:</th>
        <td>{(result.duration / 60000).toFixed(2)} minutes</td>
      </tr>
    </table>
  </div>
</div>

<style>
  table{
    width: 100%;
  }

  table th{
    text-align: left;
    padding-right: 10px;
    width: 120px;
  }

  table tr:nth-child(even){
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    background-color: #e7e7e7;
  }</style>