/**
 * JavaScript Polyfill functions for jsPDF
 * Collected from public resources by
 * https://github.com/diegocr
 */

(function (global) {

  if (typeof global.console !== "object") {
    // Console-polyfill. MIT license.
    // https://github.com/paulmillr/console-polyfill
    // Make it safe to do console.log() always.
    global.console = {};

    var con = global.console;
    var prop, method;
    var dummy = function () { };
    var properties = ['memory'];
    var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
      'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
      'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
    // eslint-disable-next-line no-cond-assign
    while (prop = properties.pop()) if (!con[prop]) con[prop] = {};
    // eslint-disable-next-line no-cond-assign
    while (method = methods.pop()) if (!con[method]) con[method] = dummy;
  }

  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  if (typeof global.btoa === 'undefined') {
    global.btoa = function (data) {
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

      var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = '', tmp_arr = [];

      if (!data) {
        return data;
      }

      do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
      } while (i < data.length);

      enc = tmp_arr.join('');

      var r = data.length % 3;

      return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    };
  }

  if (typeof global.atob === 'undefined') {
    global.atob = function (data) {
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

      var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = '', tmp_arr = [];

      if (!data) {
        return data;
      }

      data += '';

      do { // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) {
          tmp_arr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
          tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
          tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
      } while (i < data.length);

      dec = tmp_arr.join('');

      return dec;
    };
  }

  if (!Array.prototype.map) {
    Array.prototype.map = function (fun /*, thisArg */) {
      if (this === void 0 || this === null || typeof fun !== "function")
        throw new TypeError();

      var t = Object(this), len = t.length >>> 0, res = new Array(len);
      var thisArg = arguments.length > 1 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++) {
        // NOTE: Absolute correctness would demand Object.defineProperty
        //       be used.  But this method is fairly new, and failure is
        //       possible only if Object.prototype or Array.prototype
        //       has a property |i| (very unlikely), so use a less-correct
        //       but more portable alternative.
        if (i in t)
          res[i] = fun.call(thisArg, t[i], i, t);
      }

      return res;
    };
  }


  if (!Array.isArray) {
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }

  // Production steps of ECMA-262, Edition 5, 15.4.4.21
  // Reference: http://es5.github.io/#x15.4.4.21
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  if (!Array.prototype.reduce) {
    Object.defineProperty(Array.prototype, 'reduce', {
      value: function (callback /*, initialValue*/) {
        if (this === null) {
          throw new TypeError('Array.prototype.reduce ' +
            'called on null or undefined');
        }
        if (typeof callback !== 'function') {
          throw new TypeError(callback +
            ' is not a function');
        }

        // 1. Let O be ? ToObject(this value).
        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // Steps 3, 4, 5, 6, 7      
        var k = 0;
        var value;

        if (arguments.length >= 2) {
          value = arguments[1];
        } else {
          while (k < len && !(k in o)) {
            k++;
          }

          // 3. If len is 0 and initialValue is not present,
          //    throw a TypeError exception.
          if (k >= len) {
            throw new TypeError('Reduce of empty array ' +
              'with no initial value');
          }
          value = o[k++];
        }

        // 8. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kPresent be ? HasProperty(O, Pk).
          // c. If kPresent is true, then
          //    i.  Let kValue be ? Get(O, Pk).
          //    ii. Let accumulator be ? Call(
          //          callbackfn, undefined,
          //          « accumulator, kValue, k, O »).
          if (k in o) {
            value = callback(value, o[k], k, o);
          }

          // d. Increase k by 1.      
          k++;
        }

        // 9. Return accumulator.
        return value;
      }
    });
  }

  if (!Uint8Array.prototype.reduce) {
    Object.defineProperty(Uint8Array.prototype, 'reduce', {
      value: function (callback /*, initialValue*/) {
        if (this === null) {
          throw new TypeError('Array.prototype.reduce ' +
            'called on null or undefined');
        }
        if (typeof callback !== 'function') {
          throw new TypeError(callback +
            ' is not a function');
        }

        // 1. Let O be ? ToObject(this value).
        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // Steps 3, 4, 5, 6, 7      
        var k = 0;
        var value;

        if (arguments.length >= 2) {
          value = arguments[1];
        } else {
          while (k < len && !(k in o)) {
            k++;
          }

          // 3. If len is 0 and initialValue is not present,
          //    throw a TypeError exception.
          if (k >= len) {
            throw new TypeError('Reduce of empty array ' +
              'with no initial value');
          }
          value = o[k++];
        }

        // 8. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kPresent be ? HasProperty(O, Pk).
          // c. If kPresent is true, then
          //    i.  Let kValue be ? Get(O, Pk).
          //    ii. Let accumulator be ? Call(
          //          callbackfn, undefined,
          //          « accumulator, kValue, k, O »).
          if (k in o) {
            value = callback(value, o[k], k, o);
          }

          // d. Increase k by 1.      
          k++;
        }

        // 9. Return accumulator.
        return value;
      }
    });
  }

  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fun, thisArg) {
      "use strict";

      if (this === void 0 || this === null || typeof fun !== "function")
        throw new TypeError();

      var t = Object(this), len = t.length >>> 0;
      for (var i = 0; i < len; i++) {
        if (i in t)
          fun.call(thisArg, t[i], i, t);
      }
    };
  }
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function (predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return kValue.
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
          }
          // e. Increase k by 1.
          k++;
        }

        // 7. Return undefined.
        return undefined;
      },
      configurable: true,
      writable: true
    });
  }

  if (typeof Object.create != 'function') {
    Object.create = (function(undefined) {
      var Temp = function() {};
      return function (prototype, propertiesObject) {
        if(prototype !== Object(prototype) && prototype !== null) {
          throw TypeError('Argument must be an object, or null');
        }
        Temp.prototype = prototype || {};
        if (propertiesObject !== undefined) {
          Object.defineProperties(Temp.prototype, propertiesObject);
        } 
        var result = new Temp(); 
        Temp.prototype = null;
        // to imitate the case of Object.create(null)
        if(prototype === null) {
           result.__proto__ = null;
        } 
        return result;
      };
    })();
  }
  
  if (!Object.keys) {
    Object.keys = (function () {
      'use strict';

      var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty',
          'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
        dontEnumsLength = dontEnums.length;

      return function (obj) {
        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
          throw new TypeError();
        }
        var result = [], prop, i;

        for (prop in obj) {
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }

        if (hasDontEnumBug) {
          for (i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
          }
        }
        return result;
      };
    }());
  }

  if (!Object.values) {
    Object.values = function (obj) {
      var vals = [];
        for (var key in obj) {
          if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
            vals.push(obj[key]);
          }
        }
        return vals;
    };
  }

  if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
      'use strict';
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      target = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source != null) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
  }

  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }
  if (!String.prototype.trimLeft) {
    String.prototype.trimLeft = function () {
      return this.replace(/^\s+/g, "");
    };
  }
  if (!String.prototype.trimRight) {
    String.prototype.trimRight = function () {
      return this.replace(/\s+$/g, "");
    };
  }

  Number.isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' &&
      isFinite(value) &&
      Math.floor(value) === value;
  };

}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || Function('return typeof this === "object" && this.content')() || Function('return this')()));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window
