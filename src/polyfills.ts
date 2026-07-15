import "core-js/es/promise";
import "core-js/es/array/map";
import "core-js/es/array/is-array";
import "core-js/es/array/reduce";
import "core-js/es/array/for-each";
import "core-js/es/array/find";
import "core-js/es/object/create";
import "core-js/es/object/keys";
import "core-js/es/object/values";
import "core-js/es/object/assign";
import "core-js/es/string/trim";
import "core-js/es/string/trim-left";
import "core-js/es/string/trim-right";
import "core-js/es/number/is-integer";
import "core-js/es/typed-array/uint8-array";
import "core-js/es/typed-array/reduce";

import "./libs/Blob";

import { globalObject as global } from "./libs/globalObject.js";

var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

if (typeof global.btoa === "undefined") {
  global.btoa = function(data) {
    //  discuss at: http://phpjs.org/functions/base64_encode/
    // original by: Tyler Akins (http://rumkin.com)
    // improved by: Bayron Guevara
    // improved by: Thunder.m
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Rafal Kukawski (http://kukawski.pl)
    // bugfixed by: Pellentesque Malesuada
    //   example 1: base64_encode('Kevin van Zonneveld');
    //   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='

    var o1,
      o2,
      o3,
      h1,
      h2,
      h3,
      h4,
      bits,
      i = 0,
      ac = 0,
      enc = "",
      tmp_arr = [];

    if (!data) {
      return data;
    }

    do {
      // pack three octets into four hexets
      o1 = data.charCodeAt(i++);
      o2 = data.charCodeAt(i++);
      o3 = data.charCodeAt(i++);

      bits = (o1 << 16) | (o2 << 8) | o3;

      h1 = (bits >> 18) & 0x3f;
      h2 = (bits >> 12) & 0x3f;
      h3 = (bits >> 6) & 0x3f;
      h4 = bits & 0x3f;

      // use hexets to index into b64, and append result to encoded string
      tmp_arr[ac++] =
        b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join("");

    var r = data.length % 3;

    return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
  };
}

if (typeof global.atob === "undefined") {
  global.atob = function(data) {
    //  discuss at: http://phpjs.org/functions/base64_decode/
    // original by: Tyler Akins (http://rumkin.com)
    // improved by: Thunder.m
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Aman Gupta
    //    input by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Onno Marsman
    // bugfixed by: Pellentesque Malesuada
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
    //   returns 1: 'Kevin van Zonneveld'

    var o1,
      o2,
      o3,
      h1,
      h2,
      h3,
      h4,
      bits,
      i = 0,
      ac = 0,
      dec = "",
      tmp_arr = [];

    if (!data) {
      return data;
    }

    data += "";

    do {
      // unpack four hexets into three octets using index points in b64
      h1 = b64.indexOf(data.charAt(i++));
      h2 = b64.indexOf(data.charAt(i++));
      h3 = b64.indexOf(data.charAt(i++));
      h4 = b64.indexOf(data.charAt(i++));

      bits = (h1 << 18) | (h2 << 12) | (h3 << 6) | h4;

      o1 = (bits >> 16) & 0xff;
      o2 = (bits >> 8) & 0xff;
      o3 = bits & 0xff;

      if (h3 == 64) {
        tmp_arr[ac++] = String.fromCharCode(o1);
      } else if (h4 == 64) {
        tmp_arr[ac++] = String.fromCharCode(o1, o2);
      } else {
        tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
      }
    } while (i < data.length);

    dec = tmp_arr.join("");

    return dec;
  };
}
