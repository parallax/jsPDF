export var globalObject = (function() {
  return "undefined" !== typeof window
    ? window
    : "undefined" !== typeof global
    ? global
    : "undefined" !== typeof self
    ? self
    : this;
})();
