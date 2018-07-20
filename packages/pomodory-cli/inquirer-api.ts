import * as inquirer from "inquirer";

import { Session, Pomodoro } from "pomodory-core";

export enum Action {
  NextSession = "Launch next session",
  StartPomodoro = "Start Pomodoro",
  TakeABreak = "Take a break",
  Stop = "Nothing, let's stop this",
}

export interface IPromptToUser {
  close: () => void;
}

export default function createInquirerApi(pomodoro: Pomodoro) {
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
          Action.Stop,
          new inquirer.Separator(),
          Action.StartPomodoro,
          Action.TakeABreak,
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

  return { askQuestion, onAnswer };
}

function logForSession(session: Session): void {
  session === Session.Work
    ? console.log("🐠  Here we go. Just keep working, just keep working…")
    : console.log("🍹  Sure, let's take a breath!");
}
