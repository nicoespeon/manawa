import React from "react";
import createPomodoro, { Pomodoro } from "manawa-core";

interface State {
  isRunningSession: boolean;
  remainingTime: number;
}

export default class Timer extends React.Component<{}, State> {
  interval: NodeJS.Timer = null;
  pomodoro: Pomodoro;

  constructor(props) {
    super(props);

    this.state = {
      isRunningSession: false,
      remainingTime: 0,
    };

    this.pomodoro = createPomodoro(
      {
        start: (countdownInMin, callback) => {
          this.setState({ isRunningSession: true });
          return setTimeout(callback, minToMs(countdownInMin));
        },
        cancel: (countdownId) => {
          this.resetState();
          clearTimeout(countdownId);
        },
      },
      {
        notify: () => console.log("TODO: notify"),
        interrupt: () => {
          this.resetState();
          console.log("TODO: interrupt");
        },
      }
    );
  }

  resetState() {
    this.setState({ isRunningSession: false, remainingTime: 0 });
    clearInterval(this.interval);
  }

  launchNextSession() {
    // TODO: return session time in min
    const session = this.pomodoro.launchNextSession();
    const duration = { work: 25, "long-pause": 15, "short-pause": 5 }[session];
    this.setState({ remainingTime: duration });
    this.interval = setInterval(() => {
      this.setState({ remainingTime: this.state.remainingTime - 1 });
    }, 1000);
  }

  render() {
    const view = this.state.isRunningSession ? (
      <React.Fragment>
        <p>Remaining time: {this.state.remainingTime}</p>
        <button onClick={() => this.pomodoro.stopSession()}>
          Stop current session
        </button>
      </React.Fragment>
    ) : (
      <button onClick={() => this.launchNextSession()}>
        Start next session
      </button>
    );

    return view;
  }
}

function minToMs(min) {
  return min * 60 * 1000;
}
