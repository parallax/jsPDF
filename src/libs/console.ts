import { globalObject } from "./globalObject.js";

function consoleLog(...args: any[]): void {
  if (globalObject.console && typeof globalObject.console.log === "function") {
    globalObject.console.log.apply(globalObject.console, args);
  }
}

function consoleWarn(...args: any[]): void {
  if (globalObject.console) {
    if (typeof globalObject.console.warn === "function") {
      globalObject.console.warn.apply(globalObject.console, args);
    } else {
      consoleLog.call(null, ...args);
    }
  }
}

function consoleError(...args: any[]): void {
  if (globalObject.console) {
    if (typeof globalObject.console.error === "function") {
      globalObject.console.error.apply(globalObject.console, args);
    } else {
      consoleLog(...args);
    }
  }
}

export const console = {
  log: consoleLog,
  warn: consoleWarn,
  error: consoleError
};
