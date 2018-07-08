import {
  launchWorkSession,
  launchPauseSession,
  stopSession,
  IInteractWithUser,
  IDoCountdown,
} from "./index";

let mockedTimer: IDoCountdown;
let mockedUser: IInteractWithUser;

beforeEach(() => {
  mockedTimer = {
    start: jest.fn(),
    cancel: jest.fn(),
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

describe("launch pause session", () => {
  it("should interrupt user after 5' of pause session", () => {
    launchPauseSession(mockedTimer, mockedUser);

    expect(mockedTimer.start).toBeCalledWith(5, mockedUser.interrupt);
  });

  it("should notify user after 4' of pause session", () => {
    launchPauseSession(mockedTimer, mockedUser);

    expect(mockedTimer.start).toBeCalledWith(4, mockedUser.notify);
  });
});

describe("stop session", () => {
  describe("work session", () => {
    it("should cancel interrupting user", () => {
      const interruptId = "interrupt-user";
      mockedTimer.start = jest
        .fn()
        .mockReturnValueOnce(interruptId)
        .mockReturnValue("");

      launchWorkSession(mockedTimer, mockedUser);
      stopSession(mockedTimer);

      expect(mockedTimer.cancel).toBeCalledWith(interruptId);
    });

    it("should cancel notifying user", () => {
      const notifyId = "notify-user";
      mockedTimer.start = jest
        .fn()
        .mockReturnValueOnce("")
        .mockReturnValueOnce(notifyId)
        .mockReturnValue("");

      launchWorkSession(mockedTimer, mockedUser);
      stopSession(mockedTimer);

      expect(mockedTimer.cancel).toBeCalledWith(notifyId);
    });
  });

  describe("pause session", () => {
    it("should cancel interrupting user", () => {
      const interruptId = "interrupt-user";
      mockedTimer.start = jest
        .fn()
        .mockReturnValueOnce(interruptId)
        .mockReturnValue("");

      launchPauseSession(mockedTimer, mockedUser);
      stopSession(mockedTimer);

      expect(mockedTimer.cancel).toBeCalledWith(interruptId);
    });

    it("should cancel notifying user", () => {
      const notifyId = "notify-user";
      mockedTimer.start = jest
        .fn()
        .mockReturnValueOnce("")
        .mockReturnValueOnce(notifyId)
        .mockReturnValue("");

      launchPauseSession(mockedTimer, mockedUser);
      stopSession(mockedTimer);

      expect(mockedTimer.cancel).toBeCalledWith(notifyId);
    });
  });
});
