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
  it("should interrupt user after 25'", () => {
    pomodoro.launchWorkSession();

    expect(mockedTimer.start).toBeCalledWith(25, mockedUser.interrupt);
  });

  it("should notify user after 24'", () => {
    pomodoro.launchWorkSession();

    expect(mockedTimer.start).toBeCalledWith(24, mockedUser.notify);
  });

  it("should stop current session", () => {
    spyOn(pomodoro, "stopSession");

    pomodoro.launchWorkSession();

    expect(pomodoro.stopSession).toBeCalled();
  });
});

describe("launch pause session", () => {
  function shouldHaveShortPauseSessionAfter(nbOfPastPauses: number) {
    describe(`after ${nbOfPastPauses} previous pause(s)`, () => {
      beforeEach(() => {
        for (let i = 0; i < nbOfPastPauses; i++) {
          pomodoro.launchPauseSession();
        }

        pomodoro.launchPauseSession();
      });

      it("should interrupt user after 5'", () => {
        expect(mockedTimer.start).toBeCalledWith(5, mockedUser.interrupt);
      });

      it("should notify user after 4'", () => {
        expect(mockedTimer.start).toBeCalledWith(4, mockedUser.notify);
      });
    });
  }

  function shouldHaveLongPauseSessionAfter(nbOfPastPauses: number) {
    describe(`after ${nbOfPastPauses} previous pause(s)`, () => {
      beforeEach(() => {
        for (let i = 0; i < nbOfPastPauses; i++) {
          pomodoro.launchPauseSession();
        }

        pomodoro.launchPauseSession();
      });

      it("should interrupt user after 15'", () => {
        expect(mockedTimer.start).toBeCalledWith(15, mockedUser.interrupt);
      });

      it("should notify user after 14'", () => {
        expect(mockedTimer.start).toBeCalledWith(14, mockedUser.notify);
      });
    });
  }

  shouldHaveShortPauseSessionAfter(0);
  shouldHaveShortPauseSessionAfter(1);
  shouldHaveLongPauseSessionAfter(2);

  shouldHaveShortPauseSessionAfter(3);
  shouldHaveShortPauseSessionAfter(4);
  shouldHaveLongPauseSessionAfter(5);

  it("should stop current session", () => {
    spyOn(pomodoro, "stopSession");

    pomodoro.launchPauseSession();

    expect(pomodoro.stopSession).toBeCalled();
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
