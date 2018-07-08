export default launchWorkSession;

export type IStartTimer = (countdownInMin: number) => void;

const WORK_SESSION_IN_MIN = 25;

function launchWorkSession(startTimer: IStartTimer): void {
  startTimer(WORK_SESSION_IN_MIN);
}
