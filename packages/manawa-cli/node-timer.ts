import { IDoCountdown } from "manawa-core";

export default createTimer;

function createTimer(): IDoCountdown<NodeJS.Timer> {
  return {
    start(durationInMin, action) {
      const durationInMs = durationInMin * 60 * 1000;
      return global.setTimeout(() => action(), durationInMs);
    },

    cancel(timer) {
      if (!timer) return;
      global.clearTimeout(timer);
    },
  };
}
