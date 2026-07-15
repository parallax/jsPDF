import { globalObject } from "./globalObject.js";

function consoleLog(...args: unknown[]): void {
  if (globalObject.console && typeof globalObject.console.log === "function") {
    globalObject.console.log.apply(globalObject.console, args);
  }
}

function consoleWarn(...args: unknown[]): void {
  if (globalObject.console) {
    if (typeof globalObject.console.warn === "function") {
      globalObject.console.warn.apply(globalObject.console, args);
    } else {
      // Note: forwards the whole argument list as a single array argument,
      // preserved from the original implementation (which passed the
      // `arguments` object).
      consoleLog.call(null, args);
    }
  }
}

function consoleError(...args: unknown[]): void {
  if (globalObject.console) {
    if (typeof globalObject.console.error === "function") {
      globalObject.console.error.apply(globalObject.console, args);
    } else {
      consoleLog(args[0]);
    }
  }
}
export var console = {
  log: consoleLog,
  warn: consoleWarn,
  error: consoleError
};
