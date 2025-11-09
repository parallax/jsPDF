export const globalObject: any = (function(): any {
  return typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : typeof self !== "undefined"
    ? self
    : this;
})();
