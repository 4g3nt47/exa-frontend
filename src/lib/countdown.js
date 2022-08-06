/**
 * A module for creating timed countdowns.
 * @module Countdown
 * @author Umar Abdul (https://github.com/4g3nt47)
 */

class Countdown{

  /**
   * Initializes the countdown.
   * @param {object} config - The countdown config.
   */
  constructor(config){

    this.timer = null;
    this.onUpdate = config.onUpdate; // Called for every countdown update.
    this.onFinish = config.onFinish; // Called when countdown ran out.
    this.delay = config.delay || 1000; // The delay in milliseconds.
    this.target = config.target || 0; // The target time.
    this.strOutput = config.strOutput || false; // Generates a string formatted output if true (days:hrs:mins:secs)
  }

  /**
   * Start the countdown.
   */
  start(){

    if (this.timer === null)
      this.timer = setInterval(this.update.bind(this), this.delay);
  }

  /**
   * Update the countdown. For internal user.
   */
  update(){

    let diff = this.target - Date.now();
    if (diff <= 0){
      this.stop();
      return this.onFinish();
    }
    let fmt = "00:00:00:00";
    if (diff > 0)
      fmt = parseInt(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0') + ":" + parseInt((diff / (1000 * 60 * 60)) % 60).toString().padStart(2, '0') + ":" + parseInt((diff / (1000 * 60)) % 60).toString().padStart(2, '0') + ":" + parseInt((diff / 1000) % 60).toString().padStart(2, '0');
    this.onUpdate(this.strOutput ? fmt : diff);
  }

  /**
   * Stop the countdown.
   */
  stop(){

    if (this.timer){
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export default Countdown;
