class BackgroundTimerService {
  constructor(callback = null, delay = null) {
    this.callback = callback;
    this.delay = delay;
  }

  setCallback(callback) {
    this.callback = callback;
  }
  setDelay(delay) {
    this.delay = delay;
  }

  cleanTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  starTimer() {
    if (this.callback && this.delay) {
      if (this.timerId) {
        return;
      }
      let DELAY_TIME_SECONDE = 1;
      var timestamp = new Date();
      this.endTime = timestamp.setSeconds(
        timestamp.getSeconds() + this.delay + DELAY_TIME_SECONDE,
      );

      this.timerId = setInterval(() => {
        //Timeout Handle
        if (this.endTime <= new Date()) {
          this.cleanTimer();
          this.callback();
        }
      }, 1000);
    } else {
      console.log(
        'BackgroundTimerService -> starTimer -> [Error] -> empty data',
      );
    }
  }
}

export default BackgroundTimerService;
