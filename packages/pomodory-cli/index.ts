import * as program from "commander";
import createPomodoro from "pomodory-core";

import createDebugTimer from "./debug-node-timer";
import createTimer from "./node-timer";
import createNotificationCenterUser from "./notification-center-user";
import createInquirerApi, { IPromptToUser, Action } from "./inquirer-api";

program
  .option("-d, --debug", "Debug mode (use fake timer)")
  .parse(process.argv);

// Instantiate "I need to go out" adapters
const notificationCenterUser = createNotificationCenterUser<IPromptToUser>(
  () => inquirerApi.askQuestion(),
  (prompt) => {
    // FIXME: causes MaxListenersExceededWarning after some time.
    prompt.close();
    console.log(`\nLaunch next session from notification.`);
    inquirerApi.onAnswer({ action: Action.NextSession });
  }
);

// Instantiate the hexagon
const pomodoro = program.debug
  ? createPomodoro(createDebugTimer(), notificationCenterUser)
  : createPomodoro(createTimer(), notificationCenterUser);

// Instantiate "I need to enter" adapters

const inquirerApi = createInquirerApi(pomodoro);
inquirerApi.askQuestion();
