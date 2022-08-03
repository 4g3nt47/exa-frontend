<script>

  // This component handles a course test started by a user.

  import {onMount, onDestroy, createEventDispatcher} from 'svelte';
  import {fade} from 'svelte/transition';
  import Button from '../Button.svelte';
  import SuccessMsg from '../SuccessMsg.svelte';
  import ErrorMsg from '../ErrorMsg.svelte';
  import Countdown from '../../lib/countdown.js';

  export let session = {};
  export let courseInfo = {};
  export let course = {};

  const dispatch = createEventDispatcher();
  let success = "", error = "";
  let question = null; // Stores current question.
  let questionIndex = 0; // Holds index of the current question.
  let nextBtn, backBtn;
  let timeLeft = ""; // Course duration countdown
  let freezeNavs = false; // For temporarily disabling navigation during test.
  let submitting = false; // To prevent duplicate final submissions that may arise in few cases.
  let countdown = null;
  const optionLabels = ['A.', 'B.', 'C.', 'D.'];

  // Clear success and error message
  const clearMessages = () => {
    success = "";
    error = "";
  };

  // Jump to a question at the given index.
  const goto = (index) => {

    if (freezeNavs)
      return;
    clearMessages();
    questionIndex = index;
    question = course.questions[index];
  };

  // Jump to the next question.
  const gotoNext = () => {

    if (freezeNavs)
      return;
    clearMessages();
    if (questionIndex === (course.questions.length - 1)){ // Submit test?
      if (confirm("Are you sure you want to submit? This can not be undone!"))
        finishTest();
      return;
    }
    goto(questionIndex + 1);
  };

  // Jump to the previous question.
  const gotoPrev = () => {

    if (freezeNavs)
      return;
    clearMessages();
    if (questionIndex !== 0)
      goto(questionIndex - 1);
  };

  // Set/update the answer for a question.
  const setAnswer = async (index) => {
    
    if (freezeNavs || submitting)
      return;
    clearMessages();
    try{
      question.answer = index;
      const res = await fetch(`${session.api}/course/answer`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseID: courseInfo.id,
          data: [
            {
              id: question.id,
              answer: index
            }
          ]
        })
      });
      const data = await res.json();
      if (res.status !== 200)
        throw new Error(data.error);
    }catch(err){
      error = err.message;
      console.log(err);
    }
  };

  // Ends the test and re-submit all answers.
  const finishTest = async () => {
    
    if (submitting)
      return;
    submitting = true;
    // Clear error and free navigation
    clearMessages();
    countdown.stop();
    freezeNavs = true;
    nextBtn.innerText = "Submitting..."
    try{
      // Send all results.
      let allQuestions = [];
      for (let question of course.questions){
        allQuestions.push({
          id: question.id,
          answer: question.answer
        });
      }
      const res = await fetch(`${session.api}/course/answer`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseID: courseInfo.id,
          finished: true,
          data: allQuestions
        })
      });
      const data = await res.json();
      if (res.status !== 200)
        throw new Error(data.error);
      nextBtn.innerText = "Submit";
      success = "Answers submitted successfully!";
      setTimeout(() => {
        dispatch("finish");
      }, 2000);
    }catch(err){
      error = err.message;
      console.log(err);
    }
  };

  onMount(() => {
    // Start the countdown.
    countdown = new Countdown({
      onUpdate: (time) => {
        timeLeft = time;
      },
      onFinish: () => {
        finishTest();
      },
      target: course.finishTime,
      strOutput: true
    });
    countdown.start();
  });

  // Cleanup
  onDestroy(() => {
    countdown.stop();
  });

  goto(0); // Start from the beginning.

</script>

<!-- The questions nav menu -->
<h3>{courseInfo.name}</h3>
<h5 class="text-xl text-center -mt-5 mb-10">{courseInfo.title}</h5>
<div class="flex space-x-10 mx-10 items-start">
  <!-- Questions nav menu -->
  <div class="w-1/4 grid grid-cols-5 gap-2 bg-gray-300 shadow-md shadow-gray-600 p-2">
    <h4 class="col-span-5 text-2xl text-center pb-5">Questions</h4>
    <p class="col-span-5 font-bold text-center font-mono">{timeLeft}</p>
    {#each course.questions as question, index}
      <div id={question.id} on:click={() => goto(index)} class={`text-center text-xl p-1 cursor-pointer bg-gray-400 rounded-md hover:bg-blue-600 transition-colors duration-100 ${questionIndex === index ? 'bg-blue-600' : (question.answer !== -1 && questionIndex !== index ? 'bg-green-600' : '')}`}>
        {index + 1}
      </div>
    {/each}
  </div>
  <!-- Question div -->
  <div class="w-3/5 p-5 bg-gray-300 shadow-md shadow-gray-600">
    <!-- The question itself -->
    <pre class="text-xl whitespace-pre-wrap break-words">{question.question}</pre>
    <!-- The options -->
    <div class="mt-5 w-full">
      {#each question.options as option, index}
        <div class={`cursor-pointer border border-l-4 border-green-800 mt-2 p-1 pl-2 text-xl transition-colors duration-100 bg-opacity-40 hover:bg-green-600 hover:bg-opacity-40 ${index === question.answer ? 'bg-green-600 bg-opacity-60' : ''}`} on:click={() => setAnswer(index)}>
          <pre class="whitespace-pre-line break-words">{optionLabels[index] + " " + option}</pre>
        </div>
      {/each}
    </div>
    <!-- Some nav buttons -->
    <div class="w-1/2 mx-auto mt-5 flex gap-2">
      <Button bind:btn={backBtn} type="secondary" on:click={gotoPrev}>Back</Button>
      <Button bind:btn={nextBtn} on:click={gotoNext}>{questionIndex === (course.questions.length - 1)? 'Submit' : 'Next'}</Button>
    </div>
    <!-- Our error messages -->
    <SuccessMsg {success}/>
    <ErrorMsg {error}/>
  </div>
</div>  
