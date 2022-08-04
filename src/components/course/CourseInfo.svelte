<script>
  
  // This component is used to display course info, including image.

  export let session = {};
  export let course = {};

</script>

<div class="w-full flex gap-2">
  <img class="h-28 w-2/5 rounded-md" src={`${session.api}/${course.avatar}`} alt="">
  <div class="w-full">
     <table class="w-full">
      <tr>
        <td>{course.name}</td>
      </tr>
      <tr>
        <td>{course.title}</td>
      </tr>
      <tr>
        <td>{new Date(course.creationDate).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td><span class="font-bold">{course.questions}</span> questions in <span class="font-bold">{((course.questions * course.duration) / 60000).toFixed(2)}</span> minutes</td>
      </tr>
    </table>
  </div>
</div>

<style>
  table tr:nth-child(even){
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    background-color: #e7e7e7;
  }
</style>
