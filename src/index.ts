export interface IDoCountdown {
  start: (countdownInMin: number, callback: Function) => void;
}

export interface IInteractWithUser {
  notify: () => void;
  interrupt: () => void;
}
export type INotifyUser = () => void;
export type IInterruptUser = () => void;

const WORK_SESSION_IN_MIN = 25;
const NOTIFICATION_TIME_IN_MIN = 1;

export function launchWorkSession(
  timer: IDoCountdown,
  user: IInteractWithUser
): void {
  timer.start(WORK_SESSION_IN_MIN, user.interrupt);
  timer.start(WORK_SESSION_IN_MIN - NOTIFICATION_TIME_IN_MIN, user.notify);
}
