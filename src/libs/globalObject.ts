declare const global: typeof globalThis;

/**
 * The runtime global object. The intersection with a string-indexed record
 * reflects reality: plugins and polyfills read and install members that the
 * standard `globalThis` type does not declare.
 */
export var globalObject = (function(this: unknown) {
  return ("undefined" !== typeof window
    ? window
    : "undefined" !== typeof global
    ? global
    : "undefined" !== typeof self
    ? self
    : this) as typeof globalThis & Record<string, unknown>;
})();
