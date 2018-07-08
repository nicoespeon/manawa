export type CountdownId = string;

export interface IDoCountdown {
  start: (countdownInMin: number, callback: Function) => CountdownId;
  cancel: (countdownId: CountdownId) => void;
}

export interface IInteractWithUser {
  notify: () => void;
  interrupt: () => void;
}
export type INotifyUser = () => void;
export type IInterruptUser = () => void;

const WORK_SESSION_IN_MIN = 25;
const PAUSE_SESSION_IN_MIN = 5;
const NOTIFICATION_TIME_IN_MIN = 1;

let interruptId: CountdownId;
let notifyId: CountdownId;

export function launchWorkSession(
  timer: IDoCountdown,
  user: IInteractWithUser
): void {
  interruptId = timer.start(WORK_SESSION_IN_MIN, user.interrupt);
  notifyId = timer.start(
    WORK_SESSION_IN_MIN - NOTIFICATION_TIME_IN_MIN,
    user.notify
  );
}

export function launchPauseSession(
  timer: IDoCountdown,
  user: IInteractWithUser
): void {
  timer.start(PAUSE_SESSION_IN_MIN, user.interrupt);
  timer.start(PAUSE_SESSION_IN_MIN - NOTIFICATION_TIME_IN_MIN, user.notify);
}

export function stopWorkSession(timer: IDoCountdown): void {
  timer.cancel(interruptId);
  timer.cancel(notifyId);
}
