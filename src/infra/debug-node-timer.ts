import * as uuid from "uuid/v4";
import chalk from "chalk";

import { IDoCountdown } from "../domain/pomodoro";

export default createDebugTimer;

interface DebugTimer {
  id: string;
  ref: NodeJS.Timer;
}

function log(s: string): void {
  console.log(chalk.grey(`[Debug] ${s}`));
}

function createDebugTimer(): IDoCountdown<DebugTimer> {
  return {
    start(duration, action) {
      const id = uuid();
      const ref = global.setTimeout(() => action(), duration * 1000);
      log(`Starting a ${duration}s timer with id ${id}`);

      return { id, ref };
    },

    cancel(timer) {
      if (!timer) {
        log("Nothing to cancel, ignoring.");
        return;
      }

      log(`Cancelling timer with id ${timer.id}`);
      global.clearTimeout(timer.ref);
    },
  };
}
