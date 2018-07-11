import * as notifier from "node-notifier";

import { IInteractWithUser } from "../domain/pomodoro";

export default createNotificationCenterUser;

enum NotifierResponse {
  Activate = "activate",
}

function createNotificationCenterUser<Prompt>(
  onInterrupt: () => Prompt,
  onLaunchNextSession: (prompt: Prompt) => void
): IInteractWithUser {
  const title = "🐠  Pomodory";

  return {
    notify() {
      notifier.notify({
        title: title,
        message: "Session is almost over.",
        sound: false,
      });
    },

    interrupt() {
      const prompt = onInterrupt();

      notifier.notify(
        {
          title: title,
          message: "STOP! Session is now over!",
          sound: true,
          actions: "Launch next session",
        },
        (_error, response: NotifierResponse) => {
          if (response === NotifierResponse.Activate) {
            onLaunchNextSession(prompt);
          }
        }
      );
    },
  };
}
