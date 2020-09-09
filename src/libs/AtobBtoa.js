import { globalObject } from "./globalObject.js";

var atob, btoa;

(function() {
  // @if MODULE_FORMAT!='cjs'
  atob = globalObject.atob.bind(globalObject);
  btoa = globalObject.btoa.bind(globalObject);
  return;
  // @endif

  // @if MODULE_FORMAT='cjs'
  atob = require("atob");
  btoa = require("btoa");
  // @endif
})();

export { atob, btoa };
