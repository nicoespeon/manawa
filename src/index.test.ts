import { launchWorkSession, IInteractWithUser, IDoCountdown } from "./index";

let mockedTimer: IDoCountdown;
let mockedUser: IInteractWithUser;

beforeEach(() => {
  mockedTimer = {
    start: jest.fn(),
  };
  mockedUser = {
    notify: jest.fn(),
    interrupt: jest.fn(),
  };
});

describe("launch work session", () => {
  it("should interrupt user after 25' of work session", () => {
    launchWorkSession(mockedTimer, mockedUser);

    expect(mockedTimer.start).toBeCalledWith(25, mockedUser.interrupt);
  });

  it("should notify user after 24' of work session", () => {
    launchWorkSession(mockedTimer, mockedUser);

    expect(mockedTimer.start).toBeCalledWith(24, mockedUser.notify);
  });
});
