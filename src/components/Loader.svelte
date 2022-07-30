<!-- 
  A simple loading animation for pages that take time to load.
-->

<div class="w-full p-1">
  <div class="loader-box mx-auto">
    <div class="loader-item"></div>
  </div>
  <p class="text-center mt-5"><slot></slot></p>
</div>

<style>
  .loader-box{
    width: 70px;
    height: 70px;
    border: 2px solid hsl(240, 50%, 20%);
    border-radius: 5px;
  }

  .loader-item{
    height: 50%;
    width: 50%;
    animation: loader 1.5s infinite;
    background-color: hsl(240, 50%, 20%);
    border-radius: 2px;
  }

  @keyframes loader {
    25%{
      transform: translateY(100%);
      background-color: hsl(120, 50%, 20%);
    }

    50%{
      transform: translateY(100%) translateX(100%);
      background-color: hsl(240, 50%, 20%);
    }

    75%{
      transform: translateX(100%);
      background-color: hsl(120, 50%, 20%);
    }
  }
</style>