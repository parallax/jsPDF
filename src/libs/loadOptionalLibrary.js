/* eslint-disable no-unreachable */
import { globalObject } from "./globalObject.js";

export function loadOptionalLibrary(name, globalName) {
  globalName = globalName || name;
  if (globalObject[globalName]) {
    return Promise.resolve(globalObject[globalName]);
  }
  // @if MODULE_FORMAT='cjs'
  return new Promise(function(resolve, reject) {
    try {
      resolve(require(name));
    } catch (e) {
      reject(e);
    }
  });
  // @endif

  // @if MODULE_FORMAT='es'
  return import(name);
  // @endif

  // @if MODULE_FORMAT='umd'
  if (typeof exports === "object" && typeof module !== "undefined") {
    return new Promise(function(resolve, reject) {
      try {
        resolve(require(name));
      } catch (e) {
        reject(e);
      }
    });
  }
  if (typeof define === "function" && define.amd) {
    return new Promise(function(resolve, reject) {
      try {
        require([name], resolve);
      } catch (e) {
        reject(e);
      }
    });
  }
  return Promise.reject(new Error("Could not load " + name));
  // @endif
}
