import createPomodoro, {
  IInteractWithUser,
  IDoCountdown,
  Session,
} from "./pomodoro";

let mockedTimer: IDoCountdown<string>;
let mockedUser: IInteractWithUser;
let pomodoro;

beforeEach(() => {
  mockedTimer = {
    start: jest.fn((_countdown, cb) => cb()),
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

    expect(mockedTimer.start).toBeCalledWith(25, expect.any(Function));
    expect(mockedUser.interrupt).toBeCalledWith(Session.Work);
  });

  it("should notify user after 24'", () => {
    pomodoro.launchWorkSession();

    expect(mockedTimer.start).toBeCalledWith(24, expect.any(Function));
    expect(mockedUser.notify).toBeCalledWith(Session.Work);
  });

  it("should stop current session", () => {
    spyOn(pomodoro, "stopSession");

    pomodoro.launchWorkSession();

    expect(pomodoro.stopSession).toBeCalled();
  });

  it("should return the Work session type", () => {
    const session = pomodoro.launchWorkSession();

    expect(session).toBe(Session.Work);
  });
});

describe("launch pause session", () => {
  function shouldHaveShortPauseSessionAfter(nbOfPastPauses: number) {
    describe(`after ${nbOfPastPauses} previous pause(s)`, () => {
      let returnedSession: Session;

      beforeEach(() => {
        for (let i = 0; i < nbOfPastPauses; i++) {
          pomodoro.launchPauseSession();
        }

        returnedSession = pomodoro.launchPauseSession();
      });

      it("should interrupt user after 5'", () => {
        expect(mockedTimer.start).toBeCalledWith(5, expect.any(Function));
        expect(mockedUser.interrupt).toBeCalledWith(Session.ShortPause);
      });

      it("should notify user after 4'", () => {
        expect(mockedTimer.start).toBeCalledWith(4, expect.any(Function));
        expect(mockedUser.notify).toBeCalledWith(Session.ShortPause);
      });

      it("should return the ShortPause session type", () => {
        expect(returnedSession).toBe(Session.ShortPause);
      });
    });
  }

  function shouldHaveLongPauseSessionAfter(nbOfPastPauses: number) {
    describe(`after ${nbOfPastPauses} previous pause(s)`, () => {
      let returnedSession: Session;

      beforeEach(() => {
        for (let i = 0; i < nbOfPastPauses; i++) {
          pomodoro.launchPauseSession();
        }

        returnedSession = pomodoro.launchPauseSession();
      });

      it("should interrupt user after 15'", () => {
        expect(mockedTimer.start).toBeCalledWith(15, expect.any(Function));
        expect(mockedUser.interrupt).toBeCalledWith(Session.LongPause);
      });

      it("should notify user after 14'", () => {
        expect(mockedTimer.start).toBeCalledWith(14, expect.any(Function));
        expect(mockedUser.notify).toBeCalledWith(Session.LongPause);
      });

      it("should return the LongPause session type", () => {
        expect(returnedSession).toBe(Session.LongPause);
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

describe("launch next session", () => {
  beforeEach(() => {
    spyOn(pomodoro, "launchWorkSession").and.callThrough();
    spyOn(pomodoro, "launchPauseSession").and.callThrough();
  });

  it("should launch work session first", () => {
    pomodoro.launchNextSession();

    expect(pomodoro.launchWorkSession).toHaveBeenCalledTimes(1);
    expect(pomodoro.launchPauseSession).toHaveBeenCalledTimes(0);
  });

  it("should launch pause session the second time", () => {
    pomodoro.launchNextSession();
    pomodoro.launchNextSession();

    expect(pomodoro.launchWorkSession).toHaveBeenCalledTimes(1);
    expect(pomodoro.launchPauseSession).toHaveBeenCalledTimes(1);
  });

  it("should launch work session again the third time", () => {
    pomodoro.launchNextSession();
    pomodoro.launchNextSession();
    pomodoro.launchNextSession();

    expect(pomodoro.launchWorkSession).toHaveBeenCalledTimes(2);
    expect(pomodoro.launchPauseSession).toHaveBeenCalledTimes(1);
  });

  it("should launch work session after a pause session", () => {
    pomodoro.launchPauseSession();
    pomodoro.launchNextSession();

    expect(pomodoro.launchWorkSession).toHaveBeenCalledTimes(1);
    expect(pomodoro.launchPauseSession).toHaveBeenCalledTimes(1);
  });

  it("should return the session type (Work)", () => {
    const session = pomodoro.launchNextSession();

    expect(session).toBe(Session.Work);
  });

  it("should return the session type (Pause)", () => {
    pomodoro.launchWorkSession();
    const session = pomodoro.launchNextSession();

    expect(session).toBe(Session.ShortPause);
  });
});
