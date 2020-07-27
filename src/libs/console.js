import { globalObject } from "./globalObject.js";

function consoleLog() {
  if (globalObject.console && typeof globalObject.console.log === "function") {
    globalObject.console.log.apply(globalObject.console, arguments);
  }
}

function consoleWarn(str) {
  if (globalObject.console) {
    if (typeof globalObject.console.warn === "function") {
      globalObject.console.warn.apply(globalObject.console, arguments);
    } else {
      consoleLog.call(null, arguments);
    }
  }
}

function consoleError(str) {
  if (globalObject.console) {
    if (typeof globalObject.console.error === "function") {
      globalObject.console.error.apply(globalObject.console, arguments);
    } else {
      consoleLog(str);
    }
  }
}
export var console = {
  log: consoleLog,
  warn: consoleWarn,
  error: consoleError
};
