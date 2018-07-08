import launchWorkSession from "./index";

it("should start a timer of 25'", () => {
  const startTimer = jest.fn();

  launchWorkSession(startTimer);

  expect(startTimer).toBeCalledWith(25);
});
