export default launchWorkSession;

export type IStartTimer = (countdownInMin: number, callback: Function) => void;

export interface IInteractWithUser {
  notify: () => void;
  interrupt: () => void;
}
export type INotifyUser = () => void;
export type IInterruptUser = () => void;

const WORK_SESSION_IN_MIN = 25;
const NOTIFICATION_TIME_IN_MIN = 1;

function launchWorkSession(
  startTimer: IStartTimer,
  user: IInteractWithUser
): void {
  startTimer(WORK_SESSION_IN_MIN, user.interrupt);
  startTimer(WORK_SESSION_IN_MIN - NOTIFICATION_TIME_IN_MIN, user.notify);
}
