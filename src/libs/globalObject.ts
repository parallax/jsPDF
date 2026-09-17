declare const global: any;

export var globalObject = (function(this: any) {
  return "undefined" !== typeof window
    ? window
    : "undefined" !== typeof global
    ? global
    : "undefined" !== typeof self
    ? self
    : this;
})();
