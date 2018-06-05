(function (global) {

delete global.console;
delete global.btoa;
delete global.atob;
delete Array.prototype.map
delete Array.isArray;
delete Array.prototype.forEach;
delete Object.keys;
delete Object.assign;
delete String.prototype.trim;
delete String.prototype.trimLeft;
delete String.prototype.trimRight;

}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global ||  Function('return typeof this === "object" && this.content')() || Function('return this')()));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window
