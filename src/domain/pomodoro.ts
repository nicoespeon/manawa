export default createPomodoro;

export interface IDoCountdown<CountdownId> {
  start: (countdownInMin: number, callback: Function) => CountdownId;
  cancel: (countdownId: CountdownId) => void;
}

export interface IInteractWithUser {
  notify: () => void;
  interrupt: () => void;
}

enum Sessions {
  Work,
  Pause,
}

const WORK_SESSION_IN_MIN = 25;
const SHORT_PAUSE_SESSION_IN_MIN = 5;
const LONG_PAUSE_SESSION_IN_MIN = 15;
const NOTIFICATION_TIME_IN_MIN = 1;

function createPomodoro<CountdownId>(
  timer: IDoCountdown<CountdownId>,
  user: IInteractWithUser
) {
  let interruptId: CountdownId;
  let notifyId: CountdownId;
  let nbOfPauseSession = 0;
  let nextSession = Sessions.Work;

  function launchWorkSession(): void {
    this.stopSession();
    nextSession = Sessions.Pause;

    interruptId = timer.start(WORK_SESSION_IN_MIN, user.interrupt);
    notifyId = timer.start(
      WORK_SESSION_IN_MIN - NOTIFICATION_TIME_IN_MIN,
      user.notify
    );
  }

  function launchPauseSession(): void {
    this.stopSession();
    nextSession = Sessions.Work;

    nbOfPauseSession++;
    const pause_in_min =
      nbOfPauseSession % 3 === 0
        ? LONG_PAUSE_SESSION_IN_MIN
        : SHORT_PAUSE_SESSION_IN_MIN;

    interruptId = timer.start(pause_in_min, user.interrupt);
    notifyId = timer.start(
      pause_in_min - NOTIFICATION_TIME_IN_MIN,
      user.notify
    );
  }

  function launchNextSession(): void {
    nextSession === Sessions.Work
      ? this.launchWorkSession()
      : this.launchPauseSession();
  }

  function stopSession(): void {
    timer.cancel(interruptId);
    timer.cancel(notifyId);
  }

  return {
    launchWorkSession,
    launchPauseSession,
    launchNextSession,
    stopSession,
  };
}
