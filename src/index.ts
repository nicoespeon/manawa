import * as inquirer from "inquirer";

// Instantiate "I need to go out" adapters
import createDebugTimer from "./infra/debug-node-timer";
import createNotificationCenterUser from "./infra/notification-center-user";

const debugSystemTimer = createDebugTimer();
const notificationCenterUser = createNotificationCenterUser<IPromptToUser>(
  askQuestion,
  (prompt) => {
    // FIXME: causes MaxListenersExceededWarning after some time.
    prompt.close();
    console.log(`\nLaunch next session from notification.`);
    onAnswer({ action: Action.NextSession });
  }
);

// Instantiate the hexagon
import createPomodoro, { Session } from "./domain/pomodoro";

const pomodoro = createPomodoro(debugSystemTimer, notificationCenterUser);

// Instantiate "I need to enter" adapters
enum Action {
  NextSession = "Launch next session",
  StartPomodoro = "Start Pomodoro",
  TakeABreak = "Take a break",
  Stop = "Nothing, let's stop this",
}

interface IPromptToUser {
  close: () => void;
}

let hasAskedQuestion = false;
function askQuestion(): IPromptToUser {
  const message = hasAskedQuestion
    ? "Great! What do you want to do next?"
    : "Hello! What would you like to do now?";
  hasAskedQuestion = true;

  const prompt = inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: message,
      choices: [
        Action.NextSession,
        Action.StartPomodoro,
        Action.TakeABreak,
        Action.Stop,
      ],
    },
  ]);

  prompt.then(onAnswer).catch(() => {
    console.log("🎣  Something bad happen. Exiting…");
    process.exit(1);
  });

  return prompt.ui;
}

function onAnswer({ action }) {
  let session: Session;

  switch (action) {
    case Action.NextSession:
      session = pomodoro.launchNextSession();
      break;

    case Action.StartPomodoro:
      session = pomodoro.launchWorkSession();
      break;

    case Action.TakeABreak:
      session = pomodoro.launchPauseSession();
      break;

    case Action.Stop:
      console.log("🐬  It was a pleasure. See you!");
      // After some sessions, prompt doesn't exit itself.
      // Until a proper fix, ensure we exit the program here.
      process.exit();
      break;
  }

  if (session) logForSession(session);
}

function logForSession(session: Session): void {
  session === Session.Work
    ? console.log("🐠  Here we go. Just keep working, just keep working…")
    : console.log("🍹  Sure, let's take a breath!");
}

askQuestion();
