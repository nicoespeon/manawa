export default createPomodoro;

export interface IDoCountdown<CountdownId> {
  start: (countdownInMin: number, callback: Function) => CountdownId;
  cancel: (countdownId: CountdownId) => void;
}

export interface IInteractWithUser {
  notify: () => void;
  interrupt: () => void;
}

export enum Session {
  Work = "work",
  ShortPause = "short-pause",
  LongPause = "long-pause",
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
  let nextSession = Session.Work;

  function launchWorkSession(): Session {
    this.stopSession();
    nextSession = Session.Pause;

    interruptId = timer.start(WORK_SESSION_IN_MIN, user.interrupt);
    notifyId = timer.start(
      WORK_SESSION_IN_MIN - NOTIFICATION_TIME_IN_MIN,
      user.notify
    );

    return Session.Work;
  }

  function launchPauseSession(): Session {
    this.stopSession();
    nextSession = Session.Work;

    nbOfPauseSession++;
    const isLongPause = nbOfPauseSession % 3 === 0;
    const pause = isLongPause ? Session.LongPause : Session.ShortPause;
    const pause_in_min = isLongPause
      ? LONG_PAUSE_SESSION_IN_MIN
      : SHORT_PAUSE_SESSION_IN_MIN;

    interruptId = timer.start(pause_in_min, user.interrupt);
    notifyId = timer.start(
      pause_in_min - NOTIFICATION_TIME_IN_MIN,
      user.notify
    );

    return pause;
  }

  function launchNextSession(): Session {
    return nextSession === Session.Work
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
