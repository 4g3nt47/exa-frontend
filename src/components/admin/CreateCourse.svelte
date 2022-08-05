<script>

  // This component handles interactive course creation. For admins only.

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
  let questionIndex = 0;

  // Reset success and error messages
  const clearMessages = () => {
    success = "";
    error = "";
  };

  // Returns a question template
  const createQuestion = () => {
    return {
      question: "",
      options: ["", "", "", ""],
      answer: 0,
    };
  };

  // For binding our form
  let fields = {
    name: "",
    title: "",
    releaseDate: "",
    password: "",
    questionsCount: 3,
    duration: 30,
    passingScore: 50,
    newQuestion: createQuestion(),
    questions: []
  };

  // Caches the course data, and update the main session. Saves us from data loss on page reload.
  const updateCache = () => {
    session.cache.createCourseFields = fields;
    session.cache.createCourseFields.stage = stage;
    dispatch('updateSession', session);
  };

  // Return to main admin menu.
  const abort = () => {
    session.cache.createCourseFields = undefined;
    dispatch('abort');
  };

  // Goes back to previous form. Aborts course creation if on the first form (after confirmation)
  const gotoPrevious = () => {

    clearMessages();
    if (stage === 1){
      if (confirm("Discard the current course data?"))
        abort();
    }else{
      stage--;
      updateCache();
    }
  }
  
  // Go to the next form. Submit new course data if we are on the final form already.
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
    if (stage === 3){ // Create the course
      createCourse();
    }else{
      stage++;
      if (stage === 3)
        setTimeout(() => document.getElementById('question').focus(), 500);
    }
    updateCache();
  }

  // Queue a question, and create a new one.
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
    if (questionIndex < fields.questions.length){ // Changing an existing question?
      fields.questions[questionIndex] = question;
      questionIndex++;
      fields.newQuestion = fields.questions[questionIndex];
      if (!fields.newQuestion)
        fields.newQuestion = createQuestion();
    }else{    
      fields.questions.push(fields.newQuestion);
      questionIndex++;
      fields.newQuestion = createQuestion();
    }
    updateCache();
    document.getElementById('question').focus();
  };

  // Handle keyup event on final option of a question to make adding questions easier.
  const finalOptionKeyup = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13)
      addQuestion();
  };

  // Jump to a question at the given index.
  const gotoQuestion = (index) => {
    questionIndex = index;
    if (questionIndex >= fields.questions.length)
      fields.newQuestion = createQuestion();
    else
      fields.newQuestion = fields.questions[questionIndex];
  };

  // Makes the course creation request.
  const createCourse = async () => {
    
    clearMessages();
    try{
      // Do some client-side validation
      if (!fields.name)
        throw new Error("Course name not defined!");
      if (!fields.title)
        throw new Error("Course title not defined!");
      if (!fields.releaseDate)
        throw new Error("Release date is not defined!");
      if (fields.questions.length < 5 || fields.questionsCount > fields.questions.length)
        throw new Error("Not enough questions!");
      if (fields.questionsCount < 1)
        throw new Error("Questions count per test too small!");
      if (!fields.passingScore)
        throw new Error("Passing score not defined!");
      if (!fields.duration)
        throw new Error("Seconds per question not defined!");
      if (!avatar)
        throw new Error("Course avatar is required, please go back and choose one.");      
    }catch(err){
      // Report error and halt.
      error = err.message;
      return;
    }
    // Disable the create button
    nextBtn.innerText = "Creating...";
    nextBtn.disabled = true;
    prevBtn.disabled = true;
    try{
      // Build the request.
      const formData = new FormData();
      formData.append("releaseDate", new Date(fields.releaseDate).getTime());
      formData.append("duration", fields.duration * 1000);
      for (let name in fields){
        if (!formData.has(name)){
          if (name === 'questions')
            formData.append(name, JSON.stringify(fields[name]));
          else
            formData.append(name, fields[name]);
        }
      }
      formData.append('file', avatar);
      // Send it!
      const rsp = await fetch(`${session.api}/course/create`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await rsp.json();
      if (rsp.status !== 200) // We messed up :(
        throw new Error(data.error);
      // All is well!
      success = data.success;
      setTimeout(abort, 3000); // Go back to main after a brief delay
    }catch(err){
      error = err.message; // Tells us what we did wrong
    }finally{
      // Restore the button
      nextBtn.disabled = false;
      prevBtn.disabled = false;
      nextBtn.innerText = "Next";
    }
  };

  // Start by restoring course cache if available
  if (session.cache.createCourseFields){
    // Restore form data and stage. Course avatar will have to be re-selected since we can't
    // really cache a file selection.
    fields = session.cache.createCourseFields;
    stage = session.cache.createCourseFields.stage;
  }else{
    // No cache, create one.
    updateCache();
  }

  // Start/resume question creations.
  gotoQuestion(fields.questions.length);

</script>

<h3>New Course</h3>
<div class={stage !== 3 ? `w-1/2 mx-auto p-5 bg-gray-300 shadow-md shadow-gray-600` : 'w-3/4 flex gap-5 mx-auto items-start'}>
  {#if (stage === 3)}
    <div class="w-1/3 grid grid-cols-5 gap-2 bg-gray-300 shadow-md shadow-gray-600 p-2">
      <h4 class="col-span-5 text-2xl text-center pb-5">Questions</h4>
      {#each fields.questions as question, index}
        <div  on:click={() => gotoQuestion(index)} class={`text-center text-xl p-1 cursor-pointer bg-gray-400 rounded-md hover:bg-blue-600 transition-colors duration-100 ${questionIndex === index ? 'bg-blue-600' : (question.answer !== -1 && questionIndex !== index ? 'bg-green-600' : '')}`}>
          {index + 1}
        </div>
      {/each}
    </div>
  {/if}
  <form in:fade={{duration: 300}} class={stage === 3 ? 'w-full p-5 bg-gray-300 shadow-md shadow-gray-600' : ''}>
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
        <input type="number" id="questions-count" name="questions-count" bind:value={fields.questionsCount}>
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
        <label for="question">Question ({questionIndex + 1}):</label>
        <textarea class="leading-5 p-2" name="question" id="question" rows="4" spellcheck="false" placeholder="Question..." bind:value={fields.newQuestion.question} required></textarea>
        <label for="options">Options:</label>
        <div id="options">        
          <input type="text" spellcheck="false" placeholder="Option 1..." bind:value={fields.newQuestion.options[0]} required>
          <input type="text" spellcheck="false" placeholder="Option 2..." bind:value={fields.newQuestion.options[1]} required>
          <input type="text" spellcheck="false" placeholder="Option 3..." bind:value={fields.newQuestion.options[2]} required>
          <input type="text" spellcheck="false" placeholder="Option 4..." bind:value={fields.newQuestion.options[3]} on:keyup={finalOptionKeyup} required>
        </div>
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
    {/if}
    <SuccessMsg {success}/>
    <ErrorMsg {error}/>
    <div class="border-t border-black mt-5"></div>
    <div class="flex gap-2 mx-10 mt-5">
      <Button type="secondary" on:click={gotoPrevious} bind:btn={prevBtn}>Previous</Button>
      <Button on:click={gotoNext} bind:btn={nextBtn}>Next</Button>
    </div>
  </form>
</div>