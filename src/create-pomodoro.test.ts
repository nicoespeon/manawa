import createPomodoro, {
  IInteractWithUser,
  IDoCountdown,
  IManagePomodoro,
} from "./create-pomodoro";

let mockedTimer: IDoCountdown;
let mockedUser: IInteractWithUser;
let pomodoro: IManagePomodoro;

beforeEach(() => {
  mockedTimer = {
    start: jest.fn(),
    cancel: jest.fn(),
  };
  mockedUser = {
    notify: jest.fn(),
    interrupt: jest.fn(),
  };
  pomodoro = createPomodoro(mockedTimer, mockedUser);
});

describe("launch work session", () => {
  it("should interrupt user after 25' of work session", () => {
    pomodoro.launchWorkSession();

    expect(mockedTimer.start).toBeCalledWith(25, mockedUser.interrupt);
  });

  it("should notify user after 24' of work session", () => {
    pomodoro.launchWorkSession();

    expect(mockedTimer.start).toBeCalledWith(24, mockedUser.notify);
  });
});

describe("launch pause session", () => {
  describe("first pause session", () => {
    it("should interrupt user after 5' of pause session", () => {
      pomodoro.launchPauseSession();

      expect(mockedTimer.start).toBeCalledWith(5, mockedUser.interrupt);
    });

    it("should notify user after 4' of pause session", () => {
      pomodoro.launchPauseSession();

      expect(mockedTimer.start).toBeCalledWith(4, mockedUser.notify);
    });
  });

  describe("third pause session", () => {
    it("should interrupt user after 15' of pause session", () => {
      pomodoro.launchPauseSession();
      pomodoro.launchPauseSession();
      pomodoro.launchPauseSession();

      expect(mockedTimer.start).toBeCalledWith(15, mockedUser.interrupt);
    });

    it("should notify user after 14' of pause session", () => {
      pomodoro.launchPauseSession();
      pomodoro.launchPauseSession();
      pomodoro.launchPauseSession();

      expect(mockedTimer.start).toBeCalledWith(14, mockedUser.notify);
    });
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

      pomodoro.launchWorkSession();
      pomodoro.stopSession();

      expect(mockedTimer.cancel).toBeCalledWith(interruptId);
    });

    it("should cancel notifying user", () => {
      const notifyId = "notify-user";
      mockedTimer.start = jest
        .fn()
        .mockReturnValueOnce("")
        .mockReturnValueOnce(notifyId)
        .mockReturnValue("");

      pomodoro.launchWorkSession();
      pomodoro.stopSession();

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

      pomodoro.launchPauseSession();
      pomodoro.stopSession();

      expect(mockedTimer.cancel).toBeCalledWith(interruptId);
    });

    it("should cancel notifying user", () => {
      const notifyId = "notify-user";
      mockedTimer.start = jest
        .fn()
        .mockReturnValueOnce("")
        .mockReturnValueOnce(notifyId)
        .mockReturnValue("");

      pomodoro.launchPauseSession();
      pomodoro.stopSession();

      expect(mockedTimer.cancel).toBeCalledWith(notifyId);
    });
  });
});
