import * as inquirer from "inquirer";

// Instantiate "I need to go out" adapters
import createDebugTimer from "./infra/debug-node-timer";
import createConsoleUser from "./infra/console-user";

const debugSystemTimer = createDebugTimer();
const consoleUser = createConsoleUser(askQuestion);

// Instantiate the hexagon
import createPomodoro from "./domain/pomodoro";

const pomodoro = createPomodoro(debugSystemTimer, consoleUser);

// Instantiate "I need to enter" adapters
enum Actions {
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
        choices: [Actions.StartPomodoro, Actions.TakeABreak, Actions.Stop],
      },
    ])
    .then(({ action }) => {
      switch (action) {
        case Actions.StartPomodoro:
          console.log("🐠  Here we go. Just keep working, just keep working…");
          pomodoro.launchWorkSession();
          break;

        case Actions.TakeABreak:
          console.log("🍹  Sure, let's take a breath!");
          pomodoro.launchPauseSession();
          break;

        case Actions.Stop:
          console.log("🐬  It was a pleasure. See you!");
          break;
      }
    });
}

askQuestion();
