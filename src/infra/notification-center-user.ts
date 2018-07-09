import * as notifier from "node-notifier";

import { IInteractWithUser } from "../domain/pomodoro";

export default createNotificationCenterUser;

enum NotifierResponses {
  Activate = "activate",
}

function createNotificationCenterUser(
  onInterrupt: Function,
  onLaunchNextSession: Function
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
      notifier.notify(
        {
          title: title,
          message: "STOP! Session is now over!",
          sound: true,
          actions: "Launch next session",
        },
        (_error, response: NotifierResponses) => {
          if (response === NotifierResponses.Activate) {
            onLaunchNextSession();
          }
        }
      );

      onInterrupt();
    },
  };
}
