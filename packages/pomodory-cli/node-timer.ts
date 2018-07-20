import { IDoCountdown } from "pomodory-core";

export default createTimer;

function createTimer(): IDoCountdown<NodeJS.Timer> {
  return {
    start(duration_in_min, action) {
      const duration_in_ms = duration_in_min * 60 * 1000;
      return global.setTimeout(() => action(), duration_in_ms);
    },

    cancel(timer) {
      if (!timer) return;
      global.clearTimeout(timer);
    },
  };
}
