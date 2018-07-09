import * as inquirer from "inquirer";

// Instantiate "I need to go out" adapters
import createDebugTimer from "./infra/debug-node-timer";
import createNotificationCenterUser from "./infra/notification-center-user";

const debugSystemTimer = createDebugTimer();
const notificationCenterUser = createNotificationCenterUser(askQuestion, () => {
  const session = pomodoro.launchNextSession();
  logForSession(session);
});

// Instantiate the hexagon
import createPomodoro, { Sessions } from "./domain/pomodoro";

const pomodoro = createPomodoro(debugSystemTimer, notificationCenterUser);

// Instantiate "I need to enter" adapters
enum Actions {
  NextSession = "Launch next session",
  StartPomodoro = "Start Pomodoro",
  TakeABreak = "Take a break",
  Stop = "Nothing, let's stop this",
}

let hasAskedQuestion = false;
function askQuestion() {
  const message = hasAskedQuestion
    ? "Great! What do you want to do next?"
    : "Hello! What would you like to do now?";
  hasAskedQuestion = true;

  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: message,
        choices: [
          Actions.NextSession,
          Actions.StartPomodoro,
          Actions.TakeABreak,
          Actions.Stop,
        ],
      },
    ])
    .then(({ action }) => {
      let session: Sessions;

      switch (action) {
        case Actions.NextSession:
          session = pomodoro.launchNextSession();
          break;

        case Actions.StartPomodoro:
          session = pomodoro.launchWorkSession();
          break;

        case Actions.TakeABreak:
          session = pomodoro.launchPauseSession();
          break;

        case Actions.Stop:
          console.log("🐬  It was a pleasure. See you!");
          break;
      }

      if (session) logForSession(session);
    })
    .catch(() => {
      console.log("🎣  Something bad happen. Exiting…");
      process.exit(1);
    });
}

function logForSession(session: Sessions): void {
  session === Sessions.Work
    ? console.log("🐠  Here we go. Just keep working, just keep working…")
    : console.log("🍹  Sure, let's take a breath!");
}

askQuestion();
