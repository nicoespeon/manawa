import launchWorkSession, { IInteractWithUser } from "./index";

let startTimer;
let mockedUser: IInteractWithUser;

beforeEach(() => {
  startTimer = jest.fn();
  mockedUser = {
    notify: jest.fn(),
    interrupt: jest.fn(),
  };
});

it("should interrupt user after 25' of work session", () => {
  launchWorkSession(startTimer, mockedUser);

  expect(startTimer).toBeCalledWith(25, mockedUser.interrupt);
});

it("should notify user after 24' of work session", () => {
  launchWorkSession(startTimer, mockedUser);

  expect(startTimer).toBeCalledWith(24, mockedUser.notify);
});
