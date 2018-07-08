export default createPomodoro;

export type CountdownId = string;

export interface IDoCountdown {
  start: (countdownInMin: number, callback: Function) => CountdownId;
  cancel: (countdownId: CountdownId) => void;
}

export interface IInteractWithUser {
  notify: () => void;
  interrupt: () => void;
}

export interface IManagePomodoro {
  launchWorkSession: () => void;
  launchPauseSession: () => void;
  stopSession: () => void;
}

const WORK_SESSION_IN_MIN = 25;
const PAUSE_SESSION_IN_MIN = 5;
const NOTIFICATION_TIME_IN_MIN = 1;

function createPomodoro(
  timer: IDoCountdown,
  user: IInteractWithUser
): IManagePomodoro {
  let interruptId: CountdownId;
  let notifyId: CountdownId;

  function launchWorkSession(): void {
    interruptId = timer.start(WORK_SESSION_IN_MIN, user.interrupt);
    notifyId = timer.start(
      WORK_SESSION_IN_MIN - NOTIFICATION_TIME_IN_MIN,
      user.notify
    );
  }

  function launchPauseSession(): void {
    interruptId = timer.start(PAUSE_SESSION_IN_MIN, user.interrupt);
    notifyId = timer.start(
      PAUSE_SESSION_IN_MIN - NOTIFICATION_TIME_IN_MIN,
      user.notify
    );
  }

  function stopSession(): void {
    timer.cancel(interruptId);
    timer.cancel(notifyId);
  }

  return {
    launchWorkSession,
    launchPauseSession,
    stopSession,
  };
}
