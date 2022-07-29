<script>

  import {createEventDispatcher} from 'svelte';
  import {scale, fade, slide} from 'svelte/transition';
  import Button from '../Button.svelte';
  import SuccessMsg from '../SuccessMsg.svelte';
  import ErrorMsg from '../ErrorMsg.svelte';
  
  export let session = {};
  const dispatch = createEventDispatcher();
  let success = "";
  let error = "";
  let stage = 1;
  let nextBtn, prevBtn;
  let avatar = null;

  const clearMessages = () => {
    success = "";
    error = "";
  };

  const createQuestion = () => {
    return {
      question: "",
      options: ["", "", "", ""],
      answer: 0,
    };
  };

  let fields = {
    name: "",
    title: "",
    releaseDate: "",
    password: "",
    questionsPerTest: 0,
    duration: 1.5,
    passingScore: 50,
    newQuestion: createQuestion(),
    questions: []
  };

  const updateCache = () => {
    session.cache.createCourseFields = fields;
    session.cache.createCourseFields.stage = stage;
    dispatch('updateSession', session);
  };

  const gotoPrevious = () => {

    clearMessages();
    if (stage === 1){
      if (confirm("Discard the current course data?")){
        session.cache.createCourseFields = undefined;
        return dispatch('abort');
      }
    }else{
      stage--;
    }
    updateCache();
  }

  const gotoNext = () => {

    clearMessages();
    if (stage === 1){
      // Obtain the selected file. This needs to be done as we can't cache selected file in local storage.
      avatar = document.getElementById('avatar').files[0];
      if (!avatar){
        error = "Please select an avatar for the course!";
        return;
      }
    }
    if (stage >= 3){ // Create the course
      createCourse().then(() => {
        success = "Course created successfully!";
        session.cache.createCourseFields = undefined; // Take out the cache!
        setTimeout(() => dispatch('abort'), 2000);
      }).catch(err => {
        error = err.message;
      });
    }else{
      stage++;
    }
    updateCache();
  }

  const addQuestion = () => {
    
    clearMessages();
    let question = fields.newQuestion;
    if (!question.question){
      error = "Question not defined!";
      return false;
    }
    if (!question.options.every((val) => val.length !== 0)){
      error = "Options not defined!";
      return false;
    }
    fields.questions.push(fields.newQuestion);
    fields.newQuestion = createQuestion();
    updateCache();
  };

  const createCourse = async () => {
    
    if (!avatar)
      throw new Error("Course avatar is required, please go back and choose one.");
    if (fields.questions.length < 10 || fields.questionsPerTest > fields.questions.length)
      throw new Error("Not enough questions!");
    nextBtn.innerText = "Creating...";
    nextBtn.disabled = true;
  };

  if (session.cache.createCourseFields){ // Cached course creation data available?
    fields = session.cache.createCourseFields;
    stage = session.cache.createCourseFields.stage;
  }else{
    updateCache();
  }

</script>

<h3>New Course</h3>
<div class="w-1/2 mx-auto p-5 border-black rounded-2xl shadow-lg shadow-gray-600">
  <form in:fade={{duration: 300}} class="new-course-form">
    {#if (stage === 1)}
      <div in:fade={{duration: 200}}>
        <h4 class="text-center text-2xl mb-5 italic">Course Info</h4>
        <label for="name">Course Name:</label>
        <input type="text" id="name" name="name" placeholder="Course name..." bind:value={fields.name} required>
        <label for="title">Course Title:</label>
        <input type="text" id="title" name="title" placeholder="Course title..." bind:value={fields.title} required>
        <label for="avatar">Course Avatar:</label>
        <input class="w-full my-2" type="file" id="avatar" required>
        <label for="release-date">Release Date:</label>
        <input type="datetime-local" id="release-date" name="release-date" bind:value={fields.releaseDate} required>
        <label for="password">Password (optional):</label>
        <input type="password" id="password" name="password" placeholder="Course password..." bind:value={fields.password}>
      </div>
    {:else if (stage === 2)}
      <div in:fade={{duration: 200}}>
        <h4 class="text-center text-2xl mb-5 italic">Test Info</h4>
        <label for="questions-count">Questions Per Test:</label>
        <input type="number" id="questions-count" name="questions-count" bind:value={fields.questionsPerTest}>
        <label for="duration">Seconds per question:</label>
        <input type="number" id="duration" name="duration" bind:value={fields.duration}>
        <label for="passing-score">Passing score:</label>
        <div class="flex ml-10 gap-5 my-2">
          <span>{fields.passingScore}%</span>
          <input class="w-full" type="range" min="30" max="100" bind:value={fields.passingScore}>
        </div>
      </div>
    {:else if (stage === 3)}
      <div in:fade={{duration: 200}}>
        <h4 class="text-center text-2xl mb-5 italic">Test Questions</h4>
        <label for="question">Question ({fields.questions.length + 1}):</label>
        <textarea class="leading-5 p-2" name="question" id="question" rows="4" placeholder="Question..." bind:value={fields.newQuestion.question} required></textarea>
        <label>Options:</label>
        <input type="text" placeholder="Option 1..." bind:value={fields.newQuestion.options[0]} required>
        <input type="text" placeholder="Option 2..." bind:value={fields.newQuestion.options[1]} required>
        <input type="text" placeholder="Option 3..." bind:value={fields.newQuestion.options[2]} required>
        <input type="text" placeholder="Option 4..." bind:value={fields.newQuestion.options[3]} required>
        <label for="answer">Correct Answer:</label>
        <div id="answer" class="w-full space-x-2 text-center mt-2">
          <input type="radio" id="answer-0" name="answer" on:click={() => fields.newQuestion.answer = 0} checked><label for="answer-0">Option A</label>
          <input type="radio" id="answer-1" name="answer" on:click={() => fields.newQuestion.answer = 1}><label for="answer-1">Option B</label>
          <input type="radio" id="answer-2" name="answer" on:click={() => fields.newQuestion.answer = 2}><label for="answer-2">Option C</label>
          <input type="radio" id="answer-3" name="answer" on:click={() => fields.newQuestion.answer = 3}><label for="answer-3">Option D</label>
        </div>
        <div class="w-1/3 mt-5 mx-auto">
          <Button type="secondary" on:click={addQuestion}>Add Question</Button>
        </div>
      </div>
    {:else}
      <p>You are in stage {stage}</p>
    {/if}
    <SuccessMsg {success}/>
    <ErrorMsg {error}/>
    <div class="border-t border-black mt-5"></div>
    <div class="flex gap-2 mx-10 mt-5">
      <Button type="secondary" on:click={gotoPrevious} bind:btn={prevBtn}>{stage === 1 ? 'Abort' : 'Previous'}</Button>
      <Button on:click={gotoNext} bind:btn={nextBtn}>{stage === 3 ? 'Create Course' : 'Next'}</Button>
    </div>
  </form>
</div>
