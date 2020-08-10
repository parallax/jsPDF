import { globalObject } from "./globalObject.js";

var atob, btoa;

(function() {
  // @if MODULE_FORMAT!='cjs'
  atob = globalObject.atob;
  btoa = globalObject.btoa;
  return;
  // @endif

  // @if MODULE_FORMAT='cjs'
  atob = require("atob");
  btoa = require("btoa");
  // @endif
})();

export { atob, btoa };
