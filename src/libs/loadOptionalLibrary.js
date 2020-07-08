/* eslint-disable no-unreachable */
import { globalObject } from "./globalObject.js";

export function loadOptionalLibrary(name) {
  if (globalObject[name]) {
    return Promise.resolve(globalObject[name]);
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
