/**
 * A simple module for creating timer countdowns.
 */

class Countdown{

  // Initializes the countdown

  constructor(config){

    this.timer = null;
    this.onUpdate = config.onUpdate;
    this.onFinish = config.onFinish;
    this.delay = config.delay || 1000;
    this.target = config.target || 0;
    this.strOutput = config.strOutput || false;
  }

  // Start the countdown
  start(){

    if (this.timer === null)
      this.timer = setInterval(this.update.bind(this), this.delay);
  }

  // Update the countdown.
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

  // Stop the countdown
  stop(){

    if (this.timer){
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export default Countdown;
