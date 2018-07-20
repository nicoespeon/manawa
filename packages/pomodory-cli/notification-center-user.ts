import * as notifier from "node-notifier";
import { IInteractWithUser, Session } from "pomodory-core";

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
    notify(session) {
      const message =
        session === Session.Work
          ? "Work session is almost over. Commit your work now."
          : "Pause is almost over, quit distractions now.";

      notifier.notify({
        title: title,
        message: message,
        sound: false,
      });
    },

    interrupt(session: Session) {
      const prompt = onInterrupt();

      const message =
        session === Session.Work
          ? "STOP! Stop working now, take a break!"
          : "Pause is over, let's go back to work!";

      const nextActionMessage =
        session === Session.Work ? "Take a break" : "Back to work";

      notifier.notify(
        {
          title: title,
          message: message,
          sound: true,
          actions: nextActionMessage,
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
