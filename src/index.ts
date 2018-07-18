import createDebugTimer from "./infra/debug-node-timer";
import createTimer from "./infra/node-timer";
import createNotificationCenterUser from "./infra/notification-center-user";
import createInquirerApi, { IPromptToUser, Action } from "./infra/inquirer-api";

import createPomodoro from "./domain/pomodoro";

// Instantiate "I need to go out" adapters
const debugSystemTimer = createDebugTimer();
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
const pomodoro = createPomodoro(debugSystemTimer, notificationCenterUser);

// Instantiate "I need to enter" adapters

const inquirerApi = createInquirerApi(pomodoro);
inquirerApi.askQuestion();
