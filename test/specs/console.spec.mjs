import { console } from "../../src/libs/console.js";
import { globalObject } from "../../src/libs/globalObject.js";

describe("Lib: console", () => {
  it("exports log, warn and error functions", () => {
    expect(typeof console.log).toBe("function");
    expect(typeof console.warn).toBe("function");
    expect(typeof console.error).toBe("function");
  });

  it("is a wrapper, not the global console", () => {
    expect(console).not.toBe(globalObject.console);
  });

  describe("log", () => {
    it("forwards all arguments to the global console.log", () => {
      var spy = spyOn(globalObject.console, "log");

      console.log("message", 1, { a: 2 });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("message", 1, { a: 2 });
    });

    it("forwards a call without arguments", () => {
      var spy = spyOn(globalObject.console, "log");

      console.log();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith();
    });
  });

  describe("warn", () => {
    it("forwards all arguments to the global console.warn", () => {
      var spy = spyOn(globalObject.console, "warn");

      console.warn("careful", "now");

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("careful", "now");
    });

    it("does not call console.log when console.warn exists", () => {
      spyOn(globalObject.console, "warn");
      var logSpy = spyOn(globalObject.console, "log");

      console.warn("careful");

      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe("error", () => {
    it("forwards all arguments to the global console.error", () => {
      var spy = spyOn(globalObject.console, "error");

      console.error("boom", 42);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("boom", 42);
    });

    it("does not call console.log when console.error exists", () => {
      spyOn(globalObject.console, "error");
      var logSpy = spyOn(globalObject.console, "log");

      console.error("boom");

      expect(logSpy).not.toHaveBeenCalled();
    });
  });
});
