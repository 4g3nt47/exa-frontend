/**
 * A simple module for creating timer countdowns.
 */

let timer = null;
let onUpdate, onFinish;
let delay, target, strOutput;

// Initializes the countdown, and returns the callback function used to start the countdown.
export const initCountdown = (config) => {

  onUpdate = config.onUpdate;
  onFinish = config.onFinish;
  delay = config.delay || 1000;
  target = config.target || 0;
  strOutput = config.strOutput || false;
  return startCountdown;
};

// Starts the countdown.
const startCountdown = (config) => {
  timer = setInterval(update, delay);
};

// Called after every 'delay' millis have elapsed.
// Gives user a callback using onUpdate() if there is more time left, else calls onFinish().
const update = () => {

  let diff = target - Date.now();
  if (diff <= 0){
    abortCountdown();
    return onFinish();
  }
  let fmt;
  if (diff > 0)
    fmt = parseInt(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0') + ":" + parseInt((diff / (1000 * 60 * 60)) % 60).toString().padStart(2, '0') + ":" + parseInt((diff / (1000 * 60)) % 60).toString().padStart(2, '0') + ":" + parseInt((diff / 1000) % 60).toString().padStart(2, '0');
  onUpdate(strOutput ? fmt : diff);
};

// For aborting the countdown.
// Used internally when the target time is reached, or externally when countdown is no longer needed.
export const abortCountdown = () => {
  
  if (timer){
    clearInterval(timer);
    timer = null;
  }
};
