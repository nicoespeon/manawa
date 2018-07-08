import chalk from "chalk";

import { IInteractWithUser } from "../domain/pomodoro";

export default createConsoleUser;

function createConsoleUser(onInterrupt: Function): IInteractWithUser {
  return {
    notify() {
      console.log(chalk.yellow("Session is almost over!"));
    },

    interrupt() {
      console.log(chalk.red("STOP! Session is now over!"));
      onInterrupt();
    },
  };
}
