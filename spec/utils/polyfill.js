
(function (global) {
	global.isNode = false;

	//global.console = undefined;
	global.btoa = undefined;
	global.atob = undefined;
	Array.prototype.map = undefined;
	Array.prototype.reduce = undefined;
	Array.isArray = undefined;
	Array.prototype.forEach = undefined;
	Array.find = undefined;
	Object.keys = undefined;
	Object.assign = undefined;
	Object.create = undefined;
	String.prototype.trim = undefined;
	String.prototype.trimLeft = undefined;
	String.prototype.trimRight = undefined;
	Number.isInteger = undefined;

}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || Function('return typeof this === "object" && this.content')() || Function('return this')()));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window
