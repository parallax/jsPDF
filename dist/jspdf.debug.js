(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.jsPDF = {})));
}(this, (function (exports) { 'use strict';

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

      var dummy = function () {};

      var properties = ["memory"];
      var methods = ("assert,clear,count,debug,dir,dirxml,error,exception,group," + "groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd," + "show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn").split(",");

      while (prop = properties.pop()) if (!con[prop]) con[prop] = {};

      while (method = methods.pop()) if (!con[method]) con[method] = dummy;
    }

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    if (typeof global.btoa === "undefined") {
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
          bits = o1 << 16 | o2 << 8 | o3;
          h1 = bits >> 18 & 0x3f;
          h2 = bits >> 12 & 0x3f;
          h3 = bits >> 6 & 0x3f;
          h4 = bits & 0x3f; // use hexets to index into b64, and append result to encoded string

          tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);

        enc = tmp_arr.join("");
        var r = data.length % 3;
        return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
      };
    }

    if (typeof global.atob === "undefined") {
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

        dec = tmp_arr.join("");
        return dec;
      };
    }

    if (!Array.prototype.map) {
      Array.prototype.map = function (fun
      /*, thisArg */
      ) {
        if (this === void 0 || this === null || typeof fun !== "function") throw new TypeError();
        var t = Object(this),
            len = t.length >>> 0,
            res = new Array(len);
        var thisArg = arguments.length > 1 ? arguments[1] : void 0;

        for (var i = 0; i < len; i++) {
          // NOTE: Absolute correctness would demand Object.defineProperty
          //       be used.  But this method is fairly new, and failure is
          //       possible only if Object.prototype or Array.prototype
          //       has a property |i| (very unlikely), so use a less-correct
          //       but more portable alternative.
          if (i in t) res[i] = fun.call(thisArg, t[i], i, t);
        }

        return res;
      };
    }

    if (!Array.isArray) {
      Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === "[object Array]";
      };
    }

    if (!Array.prototype.forEach) {
      Array.prototype.forEach = function (fun, thisArg) {

        if (this === void 0 || this === null || typeof fun !== "function") throw new TypeError();
        var t = Object(this),
            len = t.length >>> 0;

        for (var i = 0; i < len; i++) {
          if (i in t) fun.call(thisArg, t[i], i, t);
        }
      };
    }

    if (!Object.keys) {
      Object.keys = function () {

        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !{
          toString: null
        }.propertyIsEnumerable("toString"),
            dontEnums = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
            dontEnumsLength = dontEnums.length;
        return function (obj) {
          if (typeof obj !== "object" && (typeof obj !== "function" || obj === null)) {
            throw new TypeError();
          }

          var result = [],
              prop,
              i;

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
      }();
    }

    if (typeof Object.assign != "function") {
      Object.assign = function (target) {

        if (target == null) {
          throw new TypeError("Cannot convert undefined or null to object");
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
        return this.replace(/^\s+|\s+$/g, "");
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
  })(typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || Function('return typeof this === "object" && this.content')() || Function("return this")()); // `self` is undefined in Firefox for Android content script context
  // while `this` is nsIContentFrameMessageManager
  // with an attribute `content` that corresponds to the window

  (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define(factory) : factory();
  })(window, function () {
    /**
     * @this {Promise}
     */

    function finallyConstructor(callback) {
      var constructor = this.constructor;
      return this.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          return constructor.reject(reason);
        });
      });
    } // Store setTimeout reference so promise-polyfill will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())


    var setTimeoutFunc = setTimeout;

    function noop() {} // Polyfill for Function.prototype.bind


    function bind(fn, thisArg) {
      return function () {
        fn.apply(thisArg, arguments);
      };
    }
    /**
     * @constructor
     * @param {Function} fn
     */


    function Promise(fn) {
      if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function') throw new TypeError('not a function');
      /** @type {!number} */

      this._state = 0;
      /** @type {!boolean} */

      this._handled = false;
      /** @type {Promise|undefined} */

      this._value = undefined;
      /** @type {!Array<!Function>} */

      this._deferreds = [];
      doResolve(fn, this);
    }

    function handle(self, deferred) {
      while (self._state === 3) {
        self = self._value;
      }

      if (self._state === 0) {
        self._deferreds.push(deferred);

        return;
      }

      self._handled = true;

      Promise._immediateFn(function () {
        var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;

        if (cb === null) {
          (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
          return;
        }

        var ret;

        try {
          ret = cb(self._value);
        } catch (e) {
          reject(deferred.promise, e);
          return;
        }

        resolve(deferred.promise, ret);
      });
    }

    function resolve(self, newValue) {
      try {
        // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');

        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
          var then = newValue.then;

          if (newValue instanceof Promise) {
            self._state = 3;
            self._value = newValue;
            finale(self);
            return;
          } else if (typeof then === 'function') {
            doResolve(bind(then, newValue), self);
            return;
          }
        }

        self._state = 1;
        self._value = newValue;
        finale(self);
      } catch (e) {
        reject(self, e);
      }
    }

    function reject(self, newValue) {
      self._state = 2;
      self._value = newValue;
      finale(self);
    }

    function finale(self) {
      if (self._state === 2 && self._deferreds.length === 0) {
        Promise._immediateFn(function () {
          if (!self._handled) {
            Promise._unhandledRejectionFn(self._value);
          }
        });
      }

      for (var i = 0, len = self._deferreds.length; i < len; i++) {
        handle(self, self._deferreds[i]);
      }

      self._deferreds = null;
    }
    /**
     * @constructor
     */


    function Handler(onFulfilled, onRejected, promise) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.promise = promise;
    }
    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */


    function doResolve(fn, self) {
      var done = false;

      try {
        fn(function (value) {
          if (done) return;
          done = true;
          resolve(self, value);
        }, function (reason) {
          if (done) return;
          done = true;
          reject(self, reason);
        });
      } catch (ex) {
        if (done) return;
        done = true;
        reject(self, ex);
      }
    }

    Promise.prototype['catch'] = function (onRejected) {
      return this.then(null, onRejected);
    };

    Promise.prototype.then = function (onFulfilled, onRejected) {
      // @ts-ignore
      var prom = new this.constructor(noop);
      handle(this, new Handler(onFulfilled, onRejected, prom));
      return prom;
    };

    Promise.prototype['finally'] = finallyConstructor;

    Promise.all = function (arr) {
      return new Promise(function (resolve, reject) {
        if (!arr || typeof arr.length === 'undefined') throw new TypeError('Promise.all accepts an array');
        var args = Array.prototype.slice.call(arr);
        if (args.length === 0) return resolve([]);
        var remaining = args.length;

        function res(i, val) {
          try {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
              var then = val.then;

              if (typeof then === 'function') {
                then.call(val, function (val) {
                  res(i, val);
                }, reject);
                return;
              }
            }

            args[i] = val;

            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }

        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };

    Promise.resolve = function (value) {
      if (value && typeof value === 'object' && value.constructor === Promise) {
        return value;
      }

      return new Promise(function (resolve) {
        resolve(value);
      });
    };

    Promise.reject = function (value) {
      return new Promise(function (resolve, reject) {
        reject(value);
      });
    };

    Promise.race = function (values) {
      return new Promise(function (resolve, reject) {
        for (var i = 0, len = values.length; i < len; i++) {
          values[i].then(resolve, reject);
        }
      });
    }; // Use polyfill for setImmediate for performance gains


    Promise._immediateFn = typeof setImmediate === 'function' && function (fn) {
      setImmediate(fn);
    } || function (fn) {
      setTimeoutFunc(fn, 0);
    };

    Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
      if (typeof console !== 'undefined' && console) {
        console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
      }
    };
    /** @suppress {undefinedVars} */


    var globalNS = function () {
      // the only reliable means to get the global object is
      // `Function('return this')()`
      // However, this causes CSP violations in Chrome apps.
      if (typeof self !== 'undefined') {
        return self;
      }

      if (typeof window !== 'undefined') {
        return window;
      }

      if (typeof global !== 'undefined') {
        return global;
      }

      throw new Error('unable to locate global object');
    }();

    if (!('Promise' in globalNS)) {
      globalNS['Promise'] = Promise;
    } else if (!globalNS.Promise.prototype['finally']) {
      globalNS.Promise.prototype['finally'] = finallyConstructor;
    }
  });

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /** @license
   * jsPDF - PDF Document creation from JavaScript
   * Version 2.0.0 Built on 2019-01-22T15:32:38.220Z
   *                           CommitID 0110a2202b
   *
   * Copyright (c) 2015-2018 yWorks GmbH, http://www.yworks.com
   *               2015-2018 Lukas Holländer <lukas.hollaender@yworks.com>, https://github.com/HackbrettXXX
   *               2010-2016 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
   *               2010 Aaron Spike, https://github.com/acspike
   *               2012 Willow Systems Corporation, willow-systems.com
   *               2012 Pablo Hess, https://github.com/pablohess
   *               2012 Florian Jenett, https://github.com/fjenett
   *               2013 Warren Weckesser, https://github.com/warrenweckesser
   *               2013 Youssef Beddad, https://github.com/lifof
   *               2013 Lee Driscoll, https://github.com/lsdriscoll
   *               2013 Stefan Slonevskiy, https://github.com/stefslon
   *               2013 Jeremy Morel, https://github.com/jmorel
   *               2013 Christoph Hartmann, https://github.com/chris-rock
   *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
   *               2014 James Makes, https://github.com/dollaruw
   *               2014 Diego Casorran, https://github.com/diegocr
   *               2014 Steven Spungin, https://github.com/Flamenco
   *               2014 Kenneth Glassey, https://github.com/Gavvers
   *
   * Licensed under the MIT License
   *
   * Contributor(s):
   *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
   *    kim3er, mfo, alnorth, Flamenco
   */

  /**
   * Creates new jsPDF document object instance.
   * @name jsPDF
   * @class
   * @param orientation {string/Object} Orientation of the first page. Possible values are "portrait" or "landscape" (or shortcuts "p" (Default), "l") <br />
   * Can also be an options object.
   * @param unit {string}  Measurement unit to be used when coordinates are specified.<br />
   * Possible values are "pt" (points), "mm" (Default), "cm", "in" or "px".
   * @param format {string/Array} The format of the first page. Can be <ul><li>a0 - a10</li><li>b0 - b10</li><li>c0 - c10</li><li>c0 - c10</li><li>dl</li><li>letter</li><li>government-letter</li><li>legal</li><li>junior-legal</li><li>ledger</li><li>tabloid</li><li>credit-card</li></ul><br />
   * Default is "a4". If you want to use your own format just pass instead of one of the above predefined formats the size as an number-array , e.g. [595.28, 841.89]
   * @returns {jsPDF} jsPDF-instance
   * @description
   * If the first parameter (orientation) is an object, it will be interpreted as an object of named parameters
   * ```
   * {
   *  orientation: 'p',
   *  unit: 'mm',
   *  format: 'a4',
   *  hotfixes: [] // an array of hotfix strings to enable
   * }
   * ```
   */
  var jsPDF = function (global) {

    var pdfVersion = "1.3",
        pageFormats = {
      // Size in pt of various paper formats
      a0: [2383.94, 3370.39],
      a1: [1683.78, 2383.94],
      a2: [1190.55, 1683.78],
      a3: [841.89, 1190.55],
      a4: [595.28, 841.89],
      a5: [419.53, 595.28],
      a6: [297.64, 419.53],
      a7: [209.76, 297.64],
      a8: [147.4, 209.76],
      a9: [104.88, 147.4],
      a10: [73.7, 104.88],
      b0: [2834.65, 4008.19],
      b1: [2004.09, 2834.65],
      b2: [1417.32, 2004.09],
      b3: [1000.63, 1417.32],
      b4: [708.66, 1000.63],
      b5: [498.9, 708.66],
      b6: [354.33, 498.9],
      b7: [249.45, 354.33],
      b8: [175.75, 249.45],
      b9: [124.72, 175.75],
      b10: [87.87, 124.72],
      c0: [2599.37, 3676.54],
      c1: [1836.85, 2599.37],
      c2: [1298.27, 1836.85],
      c3: [918.43, 1298.27],
      c4: [649.13, 918.43],
      c5: [459.21, 649.13],
      c6: [323.15, 459.21],
      c7: [229.61, 323.15],
      c8: [161.57, 229.61],
      c9: [113.39, 161.57],
      c10: [79.37, 113.39],
      dl: [311.81, 623.62],
      letter: [612, 792],
      "government-letter": [576, 756],
      legal: [612, 1008],
      "junior-legal": [576, 360],
      ledger: [1224, 792],
      tabloid: [792, 1224],
      "credit-card": [153, 243]
    };
    /**
     * jsPDF's Internal PubSub Implementation.
     * Backward compatible rewritten on 2014 by
     * Diego Casorran, https://github.com/diegocr
     *
     * @class
     * @name PubSub
     * @ignore
     */

    function PubSub(context) {
      var topics = {};

      this.subscribe = function (topic, callback, once) {
        if (typeof callback !== "function") {
          return false;
        }

        if (!topics.hasOwnProperty(topic)) {
          topics[topic] = {};
        }

        var id = Math.random().toString(35);
        topics[topic][id] = [callback, !!once];
        return id;
      };

      this.unsubscribe = function (token) {
        for (var topic in topics) {
          if (topics[topic][token]) {
            delete topics[topic][token];
            return true;
          }
        }

        return false;
      };

      this.publish = function (topic) {
        if (topics.hasOwnProperty(topic)) {
          var args = Array.prototype.slice.call(arguments, 1),
              idr = [];

          for (var id in topics[topic]) {
            var sub = topics[topic][id];

            try {
              sub[0].apply(context, args);
            } catch (ex) {
              if (global.console) {
                console.error("jsPDF PubSub Error", ex.message, ex);
              }
            }

            if (sub[1]) idr.push(id);
          }

          if (idr.length) idr.forEach(this.unsubscribe);
        }
      };
    }
    /**
     * @constructor
     * @private
     */


    function jsPDF(orientation, unit, format, compressPdf) {
      var options = {};

      if (_typeof(orientation) === "object") {
        options = orientation;
        orientation = options.orientation;
        unit = options.unit || unit;
        format = options.format || format;
        compressPdf = options.compress || options.compressPdf || compressPdf;
      } // Default options


      unit = unit || "mm";
      format = format || "a4";
      orientation = ("" + (orientation || "P")).toLowerCase();

      var format_as_string = ("" + format).toLowerCase(),
          compress = !!compressPdf && typeof Uint8Array === "function",
          textColor = options.textColor || "0 g",
          drawColor = options.drawColor || "0 G",
          activeFontSize = options.fontSize || 16,
          activeCharSpace = options.charSpace || 0,
          R2L = options.R2L || false,
          lineHeightProportion = options.lineHeight || 1.15,
          lineWidth = options.lineWidth || 0.200025,
          // 2mm
      fileId = "00000000000000000000000000000000",
          objectNumber = 2,
          // 'n' Current object number
      outToPages = !1,
          // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
      offsets = [],
          // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
      fonts = {},
          // collection of font objects, where key is fontKey - a dynamically created label for a given font.
      fontmap = {},
          // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
      activeFontKey,
          // will be string representing the KEY of the font as combination of fontName + fontStyle
      fontStateStack = [],
          //
      patterns = {},
          // collection of pattern objects
      patternMap = {},
          // see fonts
      gStates = {},
          // collection of graphic state objects
      gStatesMap = {},
          // see fonts
      activeGState = null,
          k,
          // Scale factor
      tmp,
          page = 0,
          currentPage,
          pages = [],
          pagesContext = [],
          // same index as pages and pagedim
      pagedim = [],
          content = [],
          additionalObjects = [],
          lineCapID = 0,
          lineJoinID = 0,
          content_length = 0,
          renderTargets = {},
          renderTargetMap = {},
          renderTargetStack = [],
          pageX,
          pageY,
          pageMatrix,
          // only used for FormObjects
      pageWidth,
          pageHeight,
          pageMode,
          zoomMode,
          layoutMode,
          creationDate,
          documentProperties = {
        title: "",
        subject: "",
        author: "",
        keywords: "",
        creator: ""
      },
          API = {},
          ApiMode = {
        COMPAT: "compat",
        ADVANCED: "advanced"
      },
          apiMode = ApiMode.COMPAT,
          events = new PubSub(API),
          hotfixes = options.hotfixes || [],
          /////////////////////
      // Private functions
      /////////////////////
      generateColorString = function generateColorString(options) {
        var color;
        var ch1 = options.ch1;
        var ch2 = options.ch2;
        var ch3 = options.ch3;
        var ch4 = options.ch4;
        var precision = options.precision;
        var letterArray = options.pdfColorType === "draw" ? ["G", "RG", "K"] : ["g", "rg", "k"];

        if (typeof ch1 === "string" && ch1.charAt(0) !== "#") {
          var rgbColor = new RGBColor(ch1);

          if (rgbColor.ok) {
            ch1 = rgbColor.toHex();
          }
        } //convert short rgb to long form


        if (typeof ch1 === "string" && /^#[0-9A-Fa-f]{3}$/.test(ch1)) {
          ch1 = "#" + ch1[1] + ch1[1] + ch1[2] + ch1[2] + ch1[3] + ch1[3];
        }

        if (typeof ch1 === "string" && /^#[0-9A-Fa-f]{6}$/.test(ch1)) {
          var hex = parseInt(ch1.substr(1), 16);
          ch1 = hex >> 16 & 255;
          ch2 = hex >> 8 & 255;
          ch3 = hex & 255;
        }

        if (typeof ch2 === "undefined" || typeof ch4 === "undefined" && ch1 === ch2 && ch2 === ch3) {
          // Gray color space.
          if (typeof ch1 === "string") {
            color = ch1 + " " + letterArray[0];
          } else {
            switch (options.precision) {
              case 2:
                color = f2(ch1 / 255) + " " + letterArray[0];
                break;

              case 3:
              default:
                color = f3(ch1 / 255) + " " + letterArray[0];
            }
          }
        } else if (typeof ch4 === "undefined" || _typeof(ch4) === "object") {
          // assume RGB
          if (typeof ch1 === "string") {
            color = [ch1, ch2, ch3, letterArray[1]].join(" ");
          } else {
            switch (options.precision) {
              case 2:
                color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), letterArray[1]].join(" ");
                break;

              default:
              case 3:
                color = [f3(ch1 / 255), f3(ch2 / 255), f3(ch3 / 255), letterArray[1]].join(" ");
            }
          } // assume RGBA


          if (ch4 && ch4.a === 0) {
            //TODO Implement transparency.
            //WORKAROUND use white for now
            color = ["255", "255", "255", letterArray[1]].join(" ");
          }
        } else {
          // assume CMYK
          if (typeof ch1 === "string") {
            color = [ch1, ch2, ch3, ch4, letterArray[2]].join(" ");
          } else {
            switch (options.precision) {
              case 2:
                color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), letterArray[2]].join(" ");
                break;

              case 3:
              default:
                color = [f3(ch1), f3(ch2), f3(ch3), f3(ch4), letterArray[2]].join(" ");
            }
          }
        }

        return color;
      },
          convertDateToPDFDate = function convertDateToPDFDate(parmDate) {
        var padd2 = function padd2(number) {
          return ("0" + parseInt(number)).slice(-2);
        };

        var result = "";
        var tzoffset = parmDate.getTimezoneOffset(),
            tzsign = tzoffset < 0 ? "+" : "-",
            tzhour = Math.floor(Math.abs(tzoffset / 60)),
            tzmin = Math.abs(tzoffset % 60),
            timeZoneString = [tzsign, padd2(tzhour), "'", padd2(tzmin), "'"].join("");
        result = ["D:", parmDate.getFullYear(), padd2(parmDate.getMonth() + 1), padd2(parmDate.getDate()), padd2(parmDate.getHours()), padd2(parmDate.getMinutes()), padd2(parmDate.getSeconds()), timeZoneString].join("");
        return result;
      },
          convertPDFDateToDate = function convertPDFDateToDate(parmPDFDate) {
        var year = parseInt(parmPDFDate.substr(2, 4), 10);
        var month = parseInt(parmPDFDate.substr(6, 2), 10) - 1;
        var date = parseInt(parmPDFDate.substr(8, 2), 10);
        var hour = parseInt(parmPDFDate.substr(10, 2), 10);
        var minutes = parseInt(parmPDFDate.substr(12, 2), 10);
        var seconds = parseInt(parmPDFDate.substr(14, 2), 10);
        var timeZoneHour = parseInt(parmPDFDate.substr(16, 2), 10);
        var timeZoneMinutes = parseInt(parmPDFDate.substr(20, 2), 10);
        var resultingDate = new Date(year, month, date, hour, minutes, seconds, 0);
        return resultingDate;
      },
          setCreationDate = function setCreationDate(date) {
        var tmpCreationDateString;
        var regexPDFCreationDate = /^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|\-0[0-9]|\-1[0-1])\'(0[0-9]|[1-5][0-9])\'?$/;

        if (_typeof(date) === undefined) {
          date = new Date();
        }

        if (_typeof(date) === "object" && Object.prototype.toString.call(date) === "[object Date]") {
          tmpCreationDateString = convertDateToPDFDate(date);
        } else if (regexPDFCreationDate.test(date)) {
          tmpCreationDateString = date;
        } else {
          tmpCreationDateString = convertDateToPDFDate(new Date());
        }

        creationDate = tmpCreationDateString;
        return creationDate;
      },
          getCreationDate = function getCreationDate(type) {
        var result = creationDate;

        if (type === "jsDate") {
          result = convertPDFDateToDate(creationDate);
        }

        return result;
      },
          setFileId = function setFileId(value) {
        value = value || "12345678901234567890123456789012".split("").map(function () {
          return "ABCDEF0123456789".charAt(Math.floor(Math.random() * 16));
        }).join("");
        fileId = value;
        return fileId;
      },
          getFileId = function getFileId() {
        return fileId;
      },
          f2 = function f2(number) {
        return number.toFixed(2); // Ie, %.2f
      },
          f3 = function f3(number) {
        return number.toFixed(3); // Ie, %.3f
      },
          // high precision float
      hpf = function hpf(number) {
        return number.toFixed(16).replace(/0+$/, "");
      },
          scaleByK = function scaleByK(coordinate) {
        if (apiMode === ApiMode.COMPAT) {
          return coordinate * k;
        } else if (apiMode === ApiMode.ADVANCED) {
          return coordinate;
        }
      },
          transformY = function transformY(y) {
        if (apiMode === ApiMode.COMPAT) {
          return pageHeight - y;
        } else if (apiMode === ApiMode.ADVANCED) {
          return y;
        }
      },
          transformScaleY = function transformScaleY(y) {
        return scaleByK(transformY(y));
      },
          padd2Hex = function padd2Hex(hexString) {
        var s = "00" + hexString;
        return s.substr(s.length - 2);
      },
          advancedApiModeTrap = function advancedApiModeTrap(methodName) {
        if (apiMode !== ApiMode.ADVANCED) {
          throw new Error(methodName + " is only available in 'advanced' API mode. " + "You need to call advancedAPI() first.");
        }
      },
          out = function out(string) {
        string = typeof string === "string" ? string : string.toString();

        if (outToPages) {
          /* set by beginPage */
          pages[currentPage].push(string);
        } else {
          // +1 for '\n' that will be used to join 'content'
          content_length += string.length + 1;
          content.push(string);
        }
      },
          newObject = function newObject() {
        // Begin a new object
        objectNumber++;
        offsets[objectNumber] = content_length;
        out(objectNumber + " 0 obj");
        return objectNumber;
      },
          // Does not output the object until after the pages have been output.
      // Returns an object containing the objectId and content.
      // All pages have been added so the object ID can be estimated to start right after.
      // This does not modify the current objectNumber;  It must be updated after the newObjects are output.
      newAdditionalObject = function newAdditionalObject() {
        var objId = pages.length * 2 + 1;
        objId += additionalObjects.length;
        var obj = {
          objId: objId,
          content: ""
        };
        additionalObjects.push(obj);
        return obj;
      },
          // Does not output the object.  The caller must call newObjectDeferredBegin(oid) before outputing any data
      newObjectDeferred = function newObjectDeferred() {
        objectNumber++;

        offsets[objectNumber] = function () {
          return content_length;
        };

        return objectNumber;
      },
          newObjectDeferredBegin = function newObjectDeferredBegin(oid) {
        offsets[oid] = content_length;
      },
          putStream = function putStream(str) {
        out("stream");
        out(str);
        out("endstream");
      },
          appendBuffer = function appendBuffer(buffer1, buffer2) {
        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp;
      },
          putPages = function putPages() {
        var n,
            p,
            arr,
            i,
            deflater,
            adler32,
            adler32cs,
            wPt,
            hPt,
            pageObjectNumbers = [];
        adler32cs = global.adler32cs || jsPDF.API.adler32cs;

        if (compress && typeof adler32cs === "undefined") {
          compress = false;
        } // outToPages = false as set in endDocument(). out() writes to content.


        for (n = 1; n <= page; n++) {
          pageObjectNumbers.push(newObject());
          wPt = (pageWidth = pagedim[n].width) * k;
          hPt = (pageHeight = pagedim[n].height) * k;
          out("<</Type /Page");
          out("/Parent 1 0 R");
          out("/Resources 2 0 R");
          out("/MediaBox [0 0 " + hpf(wPt) + " " + hpf(hPt) + "]"); // Added for annotation plugin

          events.publish("putPage", {
            pageNumber: n,
            page: pages[n]
          });
          out("/Contents " + (objectNumber + 1) + " 0 R");
          out(">>");
          out("endobj"); // Page content

          p = pages[n].join("\n");

          if (apiMode === ApiMode.ADVANCED) {
            // if the user forgot to switch back to COMPAT mode, we must balance the graphics stack again
            p += "\nQ";
          }

          newObject();

          if (compress) {
            arr = [];
            i = p.length;

            while (i--) {
              arr[i] = p.charCodeAt(i);
            }

            adler32 = adler32cs.from(p);
            deflater = new Deflater(6);
            p = deflater.append(new Uint8Array(arr));
            p = appendBuffer(p, deflater.flush());
            arr = new Uint8Array(p.byteLength + 6);
            arr.set(new Uint8Array([120, 156]));
            arr.set(p, 2);
            arr.set(new Uint8Array([adler32 & 0xff, adler32 >> 8 & 0xff, adler32 >> 16 & 0xff, adler32 >> 24 & 0xff]), p.byteLength + 2);
            var strings = [],
                chunkSize = 0xffff; // There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want

            for (var j = 0; j * chunkSize < arr.length; j++) {
              strings.push(String.fromCharCode.apply(null, arr.subarray(j * chunkSize, (j + 1) * chunkSize)));
            }

            p = strings.join('');
            out("<</Length " + p.length + " /Filter [/FlateDecode]>>");
          } else {
            out("<</Length " + p.length + ">>");
          }

          putStream(p);
          out("endobj");
        }

        offsets[1] = content_length;
        out("1 0 obj");
        out("<</Type /Pages");
        var kids = "/Kids [";

        for (i = 0; i < page; i++) {
          kids += pageObjectNumbers[i] + " 0 R ";
        }

        out(kids + "]");
        out("/Count " + page);
        out(">>");
        out("endobj");
        events.publish("postPutPages");
      },
          putFont = function putFont(font) {
        events.publish("putFont", {
          font: font,
          out: out,
          newObject: newObject,
          putStream: putStream
        });

        if (font.isAlreadyPutted !== true) {
          font.objectNumber = newObject();
          out("<<");
          out("/Type /Font");
          out("/BaseFont /" + font.postScriptName);
          out("/Subtype /Type1");

          if (typeof font.encoding === "string") {
            out("/Encoding /" + font.encoding);
          }

          out("/FirstChar 32");
          out("/LastChar 255");
          out(">>");
          out("endobj");
        }
      },
          putFonts = function putFonts() {
        for (var fontKey in fonts) {
          if (fonts.hasOwnProperty(fontKey)) {
            putFont(fonts[fontKey]);
          }
        }
      },
          putXObject = function putXObject(xObject) {
        xObject.objectNumber = newObject();
        out("<<");
        out("/Type /XObject");
        out("/Subtype /Form");
        out("/BBox [" + [hpf(xObject.x), hpf(xObject.y), hpf(xObject.x + xObject.width), hpf(xObject.y + xObject.height)].join(" ") + "]");
        out("/Matrix [" + xObject.matrix.toString() + "]"); // TODO: /Resources

        var p = xObject.pages[1].join("\n");
        out("/Length " + p.length);
        out(">>");
        putStream(p);
        out("endobj");
      },
          putXObjects = function putXObjects() {
        for (var xObjectKey in renderTargets) {
          if (renderTargets.hasOwnProperty(xObjectKey)) {
            putXObject(renderTargets[xObjectKey]);
          }
        }
      },
          interpolateAndEncodeRGBStream = function interpolateAndEncodeRGBStream(colors, numberSamples) {
        var tValues = [];
        var t;
        var dT = 1.0 / (numberSamples - 1);

        for (t = 0.0; t < 1.0; t += dT) {
          tValues.push(t);
        }

        tValues.push(1.0); // add first and last control point if not present

        if (colors[0].offset != 0.0) {
          var c0 = {
            offset: 0.0,
            color: colors[0].color
          };
          colors.unshift(c0);
        }

        if (colors[colors.length - 1].offset != 1.0) {
          var c1 = {
            offset: 1.0,
            color: colors[colors.length - 1].color
          };
          colors.push(c1);
        }

        var out = "";
        var index = 0;

        for (var i = 0; i < tValues.length; i++) {
          t = tValues[i];

          while (t > colors[index + 1].offset) {
            index++;
          }

          var a = colors[index].offset;
          var b = colors[index + 1].offset;
          var d = (t - a) / (b - a);
          var aColor = colors[index].color;
          var bColor = colors[index + 1].color;
          out += padd2Hex(Math.round((1 - d) * aColor[0] + d * bColor[0]).toString(16)) + padd2Hex(Math.round((1 - d) * aColor[1] + d * bColor[1]).toString(16)) + padd2Hex(Math.round((1 - d) * aColor[2] + d * bColor[2]).toString(16));
        }

        return out.trim();
      },
          putShadingPattern = function putShadingPattern(pattern, numberSamples) {
        /*
        Axial patterns shade between the two points specified in coords, radial patterns between the inner
        and outer circle.
         The user can specify an array (colors) that maps t-Values in [0, 1] to RGB colors. These are now
        interpolated to equidistant samples and written to pdf as a sample (type 0) function.
        */
        // The number of color samples that should be used to describe the shading.
        // The higher, the more accurate the gradient will be.
        numberSamples || (numberSamples = 21);
        var funcObjectNumber = newObject();
        var stream = interpolateAndEncodeRGBStream(pattern.colors, numberSamples);
        out("<< /FunctionType 0");
        out("/Domain [0.0 1.0]");
        out("/Size [" + numberSamples + "]");
        out("/BitsPerSample 8");
        out("/Range [0.0 1.0 0.0 1.0 0.0 1.0]");
        out("/Decode [0.0 1.0 0.0 1.0 0.0 1.0]");
        out("/Length " + stream.length); // The stream is Hex encoded

        out("/Filter /ASCIIHexDecode");
        out(">>");
        putStream(stream);
        out("endobj");
        pattern.objectNumber = newObject();
        out("<< /ShadingType " + pattern.type);
        out("/ColorSpace /DeviceRGB");
        var coords = "/Coords [" + hpf(parseFloat(pattern.coords[0])) + " " + // x1
        hpf(parseFloat(pattern.coords[1])) + " "; // y1

        if (pattern.type === 2) {
          // axial
          coords += hpf(parseFloat(pattern.coords[2])) + " " + // x2
          hpf(parseFloat(pattern.coords[3])); // y2
        } else {
          // radial
          coords += hpf(parseFloat(pattern.coords[2])) + " " + // r1
          hpf(parseFloat(pattern.coords[3])) + " " + // x2
          hpf(parseFloat(pattern.coords[4])) + " " + // y2
          hpf(parseFloat(pattern.coords[5])); // r2
        }

        coords += "]";
        out(coords);

        if (pattern.matrix) {
          out("/Matrix [" + pattern.matrix.toString() + "]");
        }

        out("/Function " + funcObjectNumber + " 0 R");
        out("/Extend [true true]");
        out(">>");
        out("endobj");
      },
          putTilingPattern = function putTilingPattern(pattern) {
        var resourcesObjectNumber = newObject();
        out("<<");
        putResourceDictionary();
        out(">>");
        out("endobj");
        pattern.objectNumber = newObject();
        out("<< /Type /Pattern");
        out("/PatternType 1"); // tiling pattern

        out("/PaintType 1"); // colored tiling pattern

        out("/TilingType 1"); // constant spacing

        out("/BBox [" + pattern.boundingBox.map(hpf).join(" ") + "]");
        out("/XStep " + hpf(pattern.xStep));
        out("/YStep " + hpf(pattern.yStep));
        out("/Length " + pattern.stream.length);
        out("/Resources " + resourcesObjectNumber + " 0 R"); // TODO: resources

        pattern.matrix && out("/Matrix [" + pattern.matrix.toString() + "]");
        out(">>");
        putStream(pattern.stream);
        out("endobj");
      },
          putPatterns = function putPatterns() {
        var patternKey;

        for (patternKey in patterns) {
          if (patterns.hasOwnProperty(patternKey)) {
            if (patterns[patternKey] instanceof API.ShadingPattern) {
              putShadingPattern(patterns[patternKey]);
            } else if (patterns[patternKey] instanceof API.TilingPattern) {
              putTilingPattern(patterns[patternKey]);
            }
          }
        }
      },
          putGState = function putGState(gState) {
        gState.objectNumber = newObject();
        out("<<");

        for (var p in gState) {
          switch (p) {
            case "opacity":
              out("/ca " + f2(gState[p]));
              break;

            case "stroke-opacity":
              out("/CA " + f2(gState[p]));
              break;
          }
        }

        out(">>");
        out("endobj");
      },
          putGStates = function putGStates() {
        var gStateKey;

        for (gStateKey in gStates) {
          if (gStates.hasOwnProperty(gStateKey)) {
            putGState(gStates[gStateKey]);
          }
        }
      },
          putXobjectDict = function putXobjectDict() {
        for (var xObjectKey in renderTargets) {
          if (renderTargets.hasOwnProperty(xObjectKey) && renderTargets[xObjectKey].objectNumber >= 0) {
            out("/" + xObjectKey + " " + renderTargets[xObjectKey].objectNumber + " 0 R");
          }
        }

        events.publish("putXobjectDict");
      },
          putShadingPatternDict = function putShadingPatternDict() {
        for (var patternKey in patterns) {
          if (patterns.hasOwnProperty(patternKey) && patterns[patternKey] instanceof API.ShadingPattern && patterns[patternKey].objectNumber >= 0) {
            out("/" + patternKey + " " + patterns[patternKey].objectNumber + " 0 R");
          }
        }

        events.publish("putShadingPatternDict");
      },
          putTilingPatternDict = function putTilingPatternDict() {
        for (var patternKey in patterns) {
          if (patterns.hasOwnProperty(patternKey) && patterns[patternKey] instanceof API.TilingPattern && patterns[patternKey].objectNumber >= 0) {
            out("/" + patternKey + " " + patterns[patternKey].objectNumber + " 0 R");
          }
        }

        events.publish("putTilingPatternDict");
      },
          putGStatesDict = function putGStatesDict() {
        var gStateKey;

        for (gStateKey in gStates) {
          if (gStates.hasOwnProperty(gStateKey) && gStates[gStateKey].objectNumber >= 0) {
            out("/" + gStateKey + " " + gStates[gStateKey].objectNumber + " 0 R");
          }
        }

        events.publish("putGStateDict");
      },
          putResourceDictionary = function putResourceDictionary() {
        out("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]");
        out("/Font <<"); // Do this for each font, the '1' bit is the index of the font

        for (var fontKey in fonts) {
          if (fonts.hasOwnProperty(fontKey)) {
            out("/" + fontKey + " " + fonts[fontKey].objectNumber + " 0 R");
          }
        }

        out(">>");
        out("/Shading <<");
        putShadingPatternDict();
        out(">>");
        out("/Pattern <<");
        putTilingPatternDict();
        out(">>");
        out("/ExtGState <<");
        putGStatesDict();
        out(">>");
        out("/XObject <<");
        putXobjectDict();
        out(">>");
      },
          putResources = function putResources() {
        putFonts();
        putGStates();
        putXObjects();
        putPatterns();
        events.publish("putResources"); // Resource dictionary

        offsets[2] = content_length;
        out("2 0 obj");
        out("<<");
        putResourceDictionary();
        out(">>");
        out("endobj");
        events.publish("postPutResources");
      },
          putAdditionalObjects = function putAdditionalObjects() {
        events.publish("putAdditionalObjects");

        for (var i = 0; i < additionalObjects.length; i++) {
          var obj = additionalObjects[i];
          offsets[obj.objId] = content_length;
          out(obj.objId + " 0 obj");
          out(obj.content);
          out("endobj");
        }

        objectNumber += additionalObjects.length;
        events.publish("postPutAdditionalObjects");
      },
          addToFontDictionary = function addToFontDictionary(fontKey, fontName, fontStyle) {
        // this is mapping structure for quick font key lookup.
        // returns the KEY of the font (ex: "F1") for a given
        // pair of font name and type (ex: "Arial". "Italic")
        if (!fontmap.hasOwnProperty(fontName)) {
          fontmap[fontName] = {};
        }

        fontmap[fontName][fontStyle] = fontKey;
      },
          addFont = function addFont(postScriptName, fontName, fontStyle, encoding, isStandardFont) {
        isStandardFont = isStandardFont || false;
        var fontKey = "F" + (Object.keys(fonts).length + 1).toString(10),
            // This is FontObject
        font = {
          id: fontKey,
          postScriptName: postScriptName,
          fontName: fontName,
          fontStyle: fontStyle,
          encoding: encoding,
          isStandardFont: isStandardFont,
          metadata: {}
        };
        var instance = this;
        events.publish("addFont", {
          font: font,
          instance: instance
        });

        if (fontKey !== undefined) {
          fonts[fontKey] = font;
          addToFontDictionary(fontKey, fontName, fontStyle);
        }

        return fontKey;
      },
          addFonts = function addFonts() {
        var HELVETICA = "helvetica",
            TIMES = "times",
            COURIER = "courier",
            NORMAL = "normal",
            BOLD = "bold",
            ITALIC = "italic",
            BOLD_ITALIC = "bolditalic",
            ZAPF = "zapfdingbats",
            SYMBOL = "symbol",
            standardFonts = [["Helvetica", HELVETICA, NORMAL, "WinAnsiEncoding"], ["Helvetica-Bold", HELVETICA, BOLD, "WinAnsiEncoding"], ["Helvetica-Oblique", HELVETICA, ITALIC, "WinAnsiEncoding"], ["Helvetica-BoldOblique", HELVETICA, BOLD_ITALIC, "WinAnsiEncoding"], ["Courier", COURIER, NORMAL, "WinAnsiEncoding"], ["Courier-Bold", COURIER, BOLD, "WinAnsiEncoding"], ["Courier-Oblique", COURIER, ITALIC, "WinAnsiEncoding"], ["Courier-BoldOblique", COURIER, BOLD_ITALIC, "WinAnsiEncoding"], ["Times-Roman", TIMES, NORMAL, "WinAnsiEncoding"], ["Times-Bold", TIMES, BOLD, "WinAnsiEncoding"], ["Times-Italic", TIMES, ITALIC, "WinAnsiEncoding"], ["Times-BoldItalic", TIMES, BOLD_ITALIC, "WinAnsiEncoding"], ["ZapfDingbats", ZAPF, NORMAL, null], ["Symbol", SYMBOL, NORMAL, null]];

        for (var i = 0, l = standardFonts.length; i < l; i++) {
          var fontKey = addFont(standardFonts[i][0], standardFonts[i][1], standardFonts[i][2], standardFonts[i][3], true); // adding aliases for standard fonts, this time matching the capitalization

          var parts = standardFonts[i][0].split("-");
          addToFontDictionary(fontKey, parts[0], parts[1] || "");
        }

        events.publish("addFonts", {
          fonts: fonts,
          dictionary: fontmap
        });
      },
          matrixMult = function matrixMult(m1, m2) {
        return new Matrix(m1.a * m2.a + m1.b * m2.c, m1.a * m2.b + m1.b * m2.d, m1.c * m2.a + m1.d * m2.c, m1.c * m2.b + m1.d * m2.d, m1.e * m2.a + m1.f * m2.c + m2.e, m1.e * m2.b + m1.f * m2.d + m2.f);
      },
          Matrix = function Matrix(a, b, c, d, e, f) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
      };

      Matrix.prototype = {
        toString: function toString() {
          return [hpf(this.a), hpf(this.b), hpf(this.c), hpf(this.d), hpf(this.e), hpf(this.f)].join(" ");
        },
        inversed: function inversed() {
          var a = this.a,
              b = this.b,
              c = this.c,
              d = this.d,
              e = this.e,
              f = this.f;
          var quot = 1 / (a * d - b * c);
          var aInv = d * quot;
          var bInv = -b * quot;
          var cInv = -c * quot;
          var dInv = a * quot;
          var eInv = -aInv * e - cInv * f;
          var fInv = -bInv * e - dInv * f;
          return new Matrix(aInv, bInv, cInv, dInv, eInv, fInv);
        }
      };

      var unitMatrix = new Matrix(1, 0, 0, 1, 0, 0),
          // Used (1) to save the current stream state to the XObjects stack and (2) to save completed form
      // objects in the xObjects map.
      RenderTarget = function RenderTarget() {
        this.page = page;
        this.currentPage = currentPage;
        this.pages = pages.slice(0);
        this.pagedim = pagedim.slice(0);
        this.pagesContext = pagesContext.slice(0);
        this.x = pageX;
        this.y = pageY;
        this.matrix = pageMatrix;
        this.width = pageWidth;
        this.height = pageHeight;
        this.id = ""; // set by endFormObject()

        this.objectNumber = -1; // will be set by putXObject()
      };

      RenderTarget.prototype = {
        restore: function restore() {
          page = this.page;
          currentPage = this.currentPage;
          pagesContext = this.pagesContext;
          pagedim = this.pagedim;
          pages = this.pages;
          pageX = this.x;
          pageY = this.y;
          pageMatrix = this.matrix;
          pageWidth = this.width;
          pageHeight = this.height;
        }
      };

      var beginNewRenderTarget = function beginNewRenderTarget(x, y, width, height, matrix) {
        // save current state
        renderTargetStack.push(new RenderTarget()); // clear pages

        page = currentPage = 0;
        pages = [];
        pageX = x;
        pageY = y;
        pageMatrix = matrix;
        beginPage(width, height);
      },
          endFormObject = function endFormObject(key) {
        // only add it if it is not already present (the keys provided by the user must be unique!)
        if (renderTargetMap[key]) return; // save the created xObject

        var newXObject = new RenderTarget();
        var xObjectId = "Xo" + (Object.keys(renderTargets).length + 1).toString(10);
        newXObject.id = xObjectId;
        renderTargetMap[key] = xObjectId;
        renderTargets[xObjectId] = newXObject;
        events.publish("addFormObject", newXObject); // restore state from stack

        renderTargetStack.pop().restore();
      },

      /**
       * Adds a new pattern for later use.
       * @param {String} key The key by it can be referenced later. The keys must be unique!
       * @param {API.Pattern} pattern The pattern
       */
      addPattern = function addPattern(key, pattern) {
        // only add it if it is not already present (the keys provided by the user must be unique!)
        if (patternMap[key]) return;
        var prefix = pattern instanceof API.ShadingPattern ? "Sh" : "P";
        var patternKey = prefix + (Object.keys(patterns).length + 1).toString(10);
        pattern.id = patternKey;
        patternMap[key] = patternKey;
        patterns[patternKey] = pattern;
        events.publish("addPattern", pattern);
      },

      /**
       * Adds a new Graphics State. Duplicates are automatically eliminated.
       * @param {String} key Might also be null, if no later reference to this gState is needed
       * @param {Object} gState The gState object
       */
      addGState = function addGState(key, gState) {
        // only add it if it is not already present (the keys provided by the user must be unique!)
        if (key && gStatesMap[key]) return;
        var duplicate = false;

        for (var s in gStates) {
          if (gStates.hasOwnProperty(s)) {
            if (gStates[s].equals(gState)) {
              duplicate = true;
              break;
            }
          }
        }

        if (duplicate) {
          gState = gStates[s];
        } else {
          var gStateKey = "GS" + (Object.keys(gStates).length + 1).toString(10);
          gStates[gStateKey] = gState;
          gState.id = gStateKey;
        } // several user keys may point to the same GState object


        key && (gStatesMap[key] = gState.id);
        events.publish("addGState", gState);
        return gState;
      },
          SAFE = function __safeCall(fn) {
        fn.foo = function __safeCallWrapper() {
          try {
            return fn.apply(this, arguments);
          } catch (e) {
            var stack = e.stack || "";
            if (~stack.indexOf(" at ")) stack = stack.split(" at ")[1];
            var m = "Error in function " + stack.split("\n")[0].split("<")[0] + ": " + e.message;

            if (global.console) {
              global.console.error(m, e);
              if (global.alert) alert(m);
            } else {
              throw new Error(m);
            }
          }
        };

        fn.foo.bar = fn;
        return fn.foo;
      },
          to8bitStream = function to8bitStream(text, flags) {
        /**
         * PDF 1.3 spec:
         * "For text strings encoded in Unicode, the first two bytes must be 254 followed by
         * 255, representing the Unicode byte order marker, U+FEFF. (This sequence conflicts
         * with the PDFDocEncoding character sequence thorn ydieresis, which is unlikely
         * to be a meaningful beginning of a word or phrase.) The remainder of the
         * string consists of Unicode character codes, according to the UTF-16 encoding
         * specified in the Unicode standard, version 2.0. Commonly used Unicode values
         * are represented as 2 bytes per character, with the high-order byte appearing first
         * in the string."
         *
         * In other words, if there are chars in a string with char code above 255, we
         * recode the string to UCS2 BE - string doubles in length and BOM is prepended.
         *
         * HOWEVER!
         * Actual *content* (body) text (as opposed to strings used in document properties etc)
         * does NOT expect BOM. There, it is treated as a literal GID (Glyph ID)
         *
         * Because of Adobe's focus on "you subset your fonts!" you are not supposed to have
         * a font that maps directly Unicode (UCS2 / UTF16BE) code to font GID, but you could
         * fudge it with "Identity-H" encoding and custom CIDtoGID map that mimics Unicode
         * code page. There, however, all characters in the stream are treated as GIDs,
         * including BOM, which is the reason we need to skip BOM in content text (i.e. that
         * that is tied to a font).
         *
         * To signal this "special" PDFEscape / to8bitStream handling mode,
         * API.text() function sets (unless you overwrite it with manual values
         * given to API.text(.., flags) )
         * flags.autoencode = true
         * flags.noBOM = true
         *
         * ===================================================================================
         * `flags` properties relied upon:
         *   .sourceEncoding = string with encoding label.
         *                     "Unicode" by default. = encoding of the incoming text.
         *                     pass some non-existing encoding name
         *                     (ex: 'Do not touch my strings! I know what I am doing.')
         *                     to make encoding code skip the encoding step.
         *   .outputEncoding = Either valid PDF encoding name
         *                     (must be supported by jsPDF font metrics, otherwise no encoding)
         *                     or a JS object, where key = sourceCharCode, value = outputCharCode
         *                     missing keys will be treated as: sourceCharCode === outputCharCode
         *   .noBOM
         *       See comment higher above for explanation for why this is important
         *   .autoencode
         *       See comment higher above for explanation for why this is important
         */
        var i, l, sourceEncoding, encodingBlock, outputEncoding, newtext, isUnicode, ch, bch;
        flags = flags || {};
        sourceEncoding = flags.sourceEncoding || "Unicode";
        outputEncoding = flags.outputEncoding; // This 'encoding' section relies on font metrics format
        // attached to font objects by, among others,
        // "Willow Systems' standard_font_metrics plugin"
        // see jspdf.plugin.standard_font_metrics.js for format
        // of the font.metadata.encoding Object.
        // It should be something like
        //   .encoding = {'codePages':['WinANSI....'], 'WinANSI...':{code:code, ...}}
        //   .widths = {0:width, code:width, ..., 'fof':divisor}
        //   .kerning = {code:{previous_char_code:shift, ..., 'fof':-divisor},...}

        if ((flags.autoencode || outputEncoding) && fonts[activeFontKey].metadata && fonts[activeFontKey].metadata[sourceEncoding] && fonts[activeFontKey].metadata[sourceEncoding].encoding) {
          encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding; // each font has default encoding. Some have it clearly defined.

          if (!outputEncoding && fonts[activeFontKey].encoding) {
            outputEncoding = fonts[activeFontKey].encoding;
          } // Hmmm, the above did not work? Let's try again, in different place.


          if (!outputEncoding && encodingBlock.codePages) {
            outputEncoding = encodingBlock.codePages[0]; // let's say, first one is the default
          }

          if (typeof outputEncoding === "string") {
            outputEncoding = encodingBlock[outputEncoding];
          } // we want output encoding to be a JS Object, where
          // key = sourceEncoding's character code and
          // value = outputEncoding's character code.


          if (outputEncoding) {
            isUnicode = false;
            newtext = [];

            for (i = 0, l = text.length; i < l; i++) {
              ch = outputEncoding[text.charCodeAt(i)];

              if (ch) {
                newtext.push(String.fromCharCode(ch));
              } else {
                newtext.push(text[i]);
              } // since we are looping over chars anyway, might as well
              // check for residual unicodeness


              if (newtext[i].charCodeAt(0) >> 8) {
                /* more than 255 */
                isUnicode = true;
              }
            }

            text = newtext.join("");
          }
        }

        i = text.length; // isUnicode may be set to false above. Hence the triple-equal to undefined

        while (isUnicode === undefined && i !== 0) {
          if (text.charCodeAt(i - 1) >> 8) {
            /* more than 255 */
            isUnicode = true;
          }

          i--;
        }

        if (!isUnicode) {
          return text;
        }

        newtext = flags.noBOM ? [] : [254, 255];

        for (i = 0, l = text.length; i < l; i++) {
          ch = text.charCodeAt(i);
          bch = ch >> 8; // divide by 256

          if (bch >> 8) {
            /* something left after dividing by 256 second time */
            throw new Error("Character at position " + i + " of string '" + text + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
          }

          newtext.push(bch);
          newtext.push(ch - (bch << 8));
        }

        return String.fromCharCode.apply(undefined, newtext);
      },
          pdfEscape = function pdfEscape(text, flags) {
        /**
         * Replace '/', '(', and ')' with pdf-safe versions
         *
         * Doing to8bitStream does NOT make this PDF display unicode text. For that
         * we also need to reference a unicode font and embed it - royal pain in the rear.
         *
         * There is still a benefit to to8bitStream - PDF simply cannot handle 16bit chars,
         * which JavaScript Strings are happy to provide. So, while we still cannot display
         * 2-byte characters property, at least CONDITIONALLY converting (entire string containing)
         * 16bit chars to (USC-2-BE) 2-bytes per char + BOM streams we ensure that entire PDF
         * is still parseable.
         * This will allow immediate support for unicode in document properties strings.
         */
        return to8bitStream(text, flags).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
      },
          putInfo = function putInfo() {
        out("/Producer (jsPDF " + jsPDF.version + ")");

        for (var key in documentProperties) {
          if (documentProperties.hasOwnProperty(key) && documentProperties[key]) {
            out("/" + key.substr(0, 1).toUpperCase() + key.substr(1) + " (" + pdfEscape(documentProperties[key]) + ")");
          }
        }

        out("/CreationDate (" + creationDate + ")");
      },
          putCatalog = function putCatalog() {
        out("/Type /Catalog");
        out("/Pages 1 0 R"); // PDF13ref Section 7.2.1

        if (!zoomMode) zoomMode = "fullwidth";

        switch (zoomMode) {
          case "fullwidth":
            out("/OpenAction [3 0 R /FitH null]");
            break;

          case "fullheight":
            out("/OpenAction [3 0 R /FitV null]");
            break;

          case "fullpage":
            out("/OpenAction [3 0 R /Fit]");
            break;

          case "original":
            out("/OpenAction [3 0 R /XYZ null null 1]");
            break;

          default:
            var pcn = "" + zoomMode;
            if (pcn.substr(pcn.length - 1) === "%") zoomMode = parseInt(zoomMode) / 100;

            if (typeof zoomMode === "number") {
              out("/OpenAction [3 0 R /XYZ null null " + f2(zoomMode) + "]");
            }

        }

        if (!layoutMode) layoutMode = "continuous";

        switch (layoutMode) {
          case "continuous":
            out("/PageLayout /OneColumn");
            break;

          case "single":
            out("/PageLayout /SinglePage");
            break;

          case "two":
          case "twoleft":
            out("/PageLayout /TwoColumnLeft");
            break;

          case "tworight":
            out("/PageLayout /TwoColumnRight");
            break;
        }

        if (pageMode) {
          /**
           * A name object specifying how the document should be displayed when opened:
           * UseNone      : Neither document outline nor thumbnail images visible -- DEFAULT
           * UseOutlines  : Document outline visible
           * UseThumbs    : Thumbnail images visible
           * FullScreen   : Full-screen mode, with no menu bar, window controls, or any other window visible
           */
          out("/PageMode /" + pageMode);
        }

        events.publish("putCatalog");
      },
          putTrailer = function putTrailer() {
        out("/Size " + (objectNumber + 1));
        out("/Root " + objectNumber + " 0 R");
        out("/Info " + (objectNumber - 1) + " 0 R");
        out("/ID [ <" + fileId + "> <" + fileId + "> ]");
      },
          beginPage = function beginPage(width, height) {
        outToPages = true;
        pages[++page] = [];
        pagedim[page] = {
          width: Number(width) || pageWidth,
          height: Number(height) || pageHeight
        };
        pagesContext[page] = {};

        _setPage(page);
      },
          _addPage = function _addPage(width, height) {
        // Dimensions are stored as user units and converted to points on output
        var orientation = typeof height === "string" && height.toLowerCase();

        if (typeof width === "string") {
          var format = width.toLowerCase();

          if (pageFormats.hasOwnProperty(format)) {
            width = pageFormats[format][0] / k;
            height = pageFormats[format][1] / k;
          }
        }

        if (Array.isArray(width)) {
          height = width[1];
          width = width[0];
        }

        if (orientation) {
          switch (orientation.substr(0, 1)) {
            case "l":
              if (height > width) orientation = "s";
              break;

            case "p":
              if (width > height) orientation = "s";
              break;
          }

          if (orientation === "s") {
            tmp = width;
            width = height;
            height = tmp;
          }
        }

        beginPage(width, height); // Set line width

        out(hpf(lineWidth * k) + " w"); // Set draw color

        out(drawColor); // resurrecting non-default line caps, joins

        if (lineCapID !== 0) {
          out(lineCapID + " J");
        }

        if (lineJoinID !== 0) {
          out(lineJoinID + " j");
        }

        events.publish("addPage", {
          pageNumber: page
        });
      },
          _deletePage = function _deletePage(n) {
        if (n > 0 && n <= page) {
          pages.splice(n, 1);
          pagedim.splice(n, 1);
          page--;

          if (currentPage > page) {
            currentPage = page;
          }

          this.setPage(currentPage);
        }
      },
          _setPage = function _setPage(n) {
        if (n > 0 && n <= page) {
          currentPage = n;
          pageWidth = pagedim[n].width;
          pageHeight = pagedim[n].height;
        }
      },

      /**
       * Returns a document-specific font key - a label assigned to a
       * font name + font type combination at the time the font was added
       * to the font inventory.
       *
       * Font key is used as label for the desired font for a block of text
       * to be added to the PDF document stream.
       * @private
       * @function
       * @param {String} fontName can be undefined on "falthy" to indicate "use current"
       * @param {String} fontStyle can be undefined on "falthy" to indicate "use current"
       * @returns {String} Font key.
       */
      _getFont = function getFont(fontName, fontStyle, options) {
        var key = undefined,
            fontNameLowerCase;
        options = options || {};
        fontName = fontName !== undefined ? fontName : fonts[activeFontKey].fontName;
        fontStyle = fontStyle !== undefined ? fontStyle : fonts[activeFontKey].fontStyle;
        fontNameLowerCase = fontName.toLowerCase();

        if (fontmap[fontNameLowerCase] !== undefined && fontmap[fontNameLowerCase][fontStyle] !== undefined) {
          key = fontmap[fontNameLowerCase][fontStyle];
        } else if (fontmap[fontName] !== undefined && fontmap[fontName][fontStyle] !== undefined) {
          key = fontmap[fontName][fontStyle];
        } else {
          if (options.disableWarning === false) {
            console.warn("Unable to look up font label for font '" + fontName + "', '" + fontStyle + "'. Refer to getFontList() for available fonts.");
          }
        }

        if (!key && !options.noFallback) {
          key = fontmap["times"][fontStyle];

          if (key == null) {
            key = fontmap["times"]["normal"];
          }
        }

        return key;
      },
          buildDocument = function buildDocument() {
        outToPages = false; // switches out() to content

        objectNumber = 2;
        content_length = 0;
        content = [];
        offsets = [];
        additionalObjects = []; // Added for AcroForm

        events.publish("buildDocument"); // putHeader()

        out("%PDF-" + pdfVersion);
        out("%\xBA\xDF\xAC\xE0");
        putPages(); // Must happen after putPages
        // Modifies current object Id

        putAdditionalObjects();
        putResources(); // Info

        newObject();
        out("<<");
        putInfo();
        out(">>");
        out("endobj"); // Catalog

        newObject();
        out("<<");
        putCatalog();
        out(">>");
        out("endobj"); // Cross-ref

        var o = content_length,
            i,
            p = "0000000000";
        out("xref");
        out("0 " + (objectNumber + 1));
        out(p + " 65535 f ");

        for (i = 1; i <= objectNumber; i++) {
          var offset = offsets[i];

          if (typeof offset === "function") {
            out((p + offsets[i]()).slice(-10) + " 00000 n ");
          } else {
            out((p + offsets[i]).slice(-10) + " 00000 n ");
          }
        } // Trailer


        out("trailer");
        out("<<");
        putTrailer();
        out(">>");
        out("startxref");
        out("" + o);
        out("%%EOF");
        outToPages = true;
        return content.join("\n");
      },
          getStyle = function getStyle(style) {
        // see path-painting operators in PDF spec
        // The default in MrRio's implementation is "S" (stroke), whereas the default in the yWorks implementation
        // was "n" (none). Although this has nothing to do with transforms, we should use the API switch here.
        var op = apiMode === ApiMode.COMPAT ? "S" : "n";

        if (style === "D") {
          op = "S"; // stroke
        } else if (style === "F") {
          op = "f"; // fill
        } else if (style === "FD" || style === "DF") {
          op = "B"; // both
        } else if (style === "f" || style === "f*" || style === "B" || style === "B*") {
          /*
           Allow direct use of these PDF path-painting operators:
           - f    fill using nonzero winding number rule
           - f*    fill using even-odd rule
           - B    fill then stroke with fill using non-zero winding number rule
           - B*    fill then stroke with fill using even-odd rule
           */
          op = style;
        }

        return op;
      },
          // puts the style for the previously drawn path. If a patternKey is provided, the pattern is used to fill
      // the path. Use patternMatrix to transform the pattern to rhe right location.
      putStyle = function putStyle(style, patternKey, patternData) {
        if (style === null || apiMode === ApiMode.ADVANCED && style === undefined) {
          return;
        }

        style = getStyle(style); // stroking / filling / both the path

        if (!patternKey) {
          out(style);
          return;
        }

        if (!patternData) {
          patternData = {
            matrix: unitMatrix
          };
        }

        if (patternData instanceof Matrix) {
          patternData = {
            matrix: patternData
          };
        }

        patternData.key = patternKey;
        patternData || (patternData = unitMatrix);
        fillWithPattern(patternData, style);
      },
          fillWithPattern = function fillWithPattern(patternData, style) {
        var patternId = patternMap[patternData.key];
        var pattern = patterns[patternId];

        if (pattern instanceof API.ShadingPattern) {
          out("q");
          out(clipRuleFromStyle(style));

          if (pattern.gState) {
            API.setGState(pattern.gState);
          }

          out(patternData.matrix.toString() + " cm");
          out("/" + patternId + " sh");
          out("Q");
        } else if (pattern instanceof API.TilingPattern) {
          // pdf draws patterns starting at the bottom left corner and they are not affected by the global transformation,
          // so we must flip them
          var matrix = new Matrix(1, 0, 0, -1, 0, pageHeight);

          if (patternData.matrix) {
            matrix = matrixMult(patternData.matrix || unitMatrix, matrix); // we cannot apply a matrix to the pattern on use so we must abuse the pattern matrix and create new instances
            // for each use

            patternId = pattern.createClone(patternData.key, patternData.boundingBox, patternData.xStep, patternData.yStep, matrix).id;
          }

          out("q");
          out("/Pattern cs");
          out("/" + patternId + " scn");

          if (pattern.gState) {
            API.setGState(pattern.gState);
          }

          out(style);
          out("Q");
        }
      },
          clipRuleFromStyle = function clipRuleFromStyle(style) {
        switch (style) {
          case "f":
          case "F":
            return "W n";

          case "f*":
            return "W* n";

          case "B":
            return "W S";

          case "B*":
            return "W* S";
          // these two are for compatibility reasons (in the past, calling any primitive method with a shading pattern
          // and "n"/"S" as style would still fill/fill and stroke the path)

          case "S":
            return "W S";

          case "n":
            return "W n";
        }
      },
          getArrayBuffer = function getArrayBuffer() {
        var data = buildDocument(),
            len = data.length,
            ab = new ArrayBuffer(len),
            u8 = new Uint8Array(ab);

        while (len--) {
          u8[len] = data.charCodeAt(len);
        }

        return ab;
      },
          getBlob = function getBlob() {
        return new Blob([getArrayBuffer()], {
          type: "application/pdf"
        });
      },
          _output = SAFE(function (type, options) {
        if (typeof options === "string") {
          options = {
            filename: options
          };
        } else {
          options = options || {};
          options.filename = options.filename || "generated.pdf";
        }

        var datauri = ("" + type).substr(0, 6) === "dataur" ? "data:application/pdf;filename=" + options.filename + ";base64," + btoa(buildDocument()) : 0;

        switch (type) {
          case undefined:
            return buildDocument();

          case "save":
            if ((typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) === "object" && navigator.getUserMedia) {
              if (global.URL === undefined || global.URL.createObjectURL === undefined) {
                return API.output("dataurlnewwindow");
              }
            }

            saveAs(getBlob(), options.filename);

            if (typeof saveAs.unload === "function") {
              if (global.setTimeout) {
                setTimeout(saveAs.unload, 911);
              }
            }

            break;

          case "arraybuffer":
            return getArrayBuffer();

          case "blob":
            return getBlob();

          case "bloburi":
          case "bloburl":
            // User is responsible of calling revokeObjectURL
            return global.URL && global.URL.createObjectURL(getBlob()) || void 0;

          case "datauristring":
          case "dataurlstring":
            return datauri;

          case "dataurlnewwindow":
            var htmlForNewWindow = "<html>" + "<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style>" + "<body>" + '<iframe src="' + this.output("datauristring") + '"></iframe>' + "</body></html>";
            var nW = global.open();

            if (nW !== null) {
              nW.document.write(htmlForNewWindow);
            }

            if (nW || typeof safari === "undefined") return nW;

          /* pass through */

          case "datauri":
          case "dataurl":
            return global.document.location.href = datauri;

          default:
            throw new Error('Output type "' + type + '" is not supported.');
        } // @TODO: Add different output options

      }),

      /**
       * Used to see if a supplied hotfix was requested when the pdf instance was created.
       * @param {string} hotfixName - The name of the hotfix to check.
       * @returns {boolean}
       */
      hasHotfix = function hasHotfix(hotfixName) {
        return Array.isArray(hotfixes) === true && hotfixes.indexOf(hotfixName) > -1;
      };

      switch (unit) {
        case "pt":
          k = 1;
          break;

        case "mm":
          k = 72 / 25.4000508;
          break;

        case "cm":
          k = 72 / 2.54000508;
          break;

        case "in":
          k = 72;
          break;

        case "px":
          if (hasHotfix("px_scaling") == true) {
            k = 72 / 96;
          } else {
            k = 96 / 72;
          }

          break;

        case "pc":
          k = 12;
          break;

        case "em":
          k = 12;
          break;

        case "ex":
          k = 6;
          break;

        default:
          throw "Invalid unit: " + unit;
      }

      setCreationDate();
      setFileId(); //---------------------------------------
      // Public API

      /**
       * Object exposing internal API to plugins
       * @public
       * @ignore
       */

      API.internal = {
        pdfEscape: pdfEscape,
        getStyle: getStyle,

        /**
         * Returns {FontObject} describing a particular font.
         * @public
         * @function
         * @param {String} fontName (Optional) Font's family name
         * @param {String} fontStyle (Optional) Font's style variation name (Example:"Italic")
         * @returns {FontObject}
         */
        getFont: function getFont() {
          return fonts[_getFont.apply(API, arguments)];
        },
        getFontSize: function getFontSize() {
          return activeFontSize;
        },
        getCharSpace: function getCharSpace() {
          return activeCharSpace;
        },
        getTextColor: function getTextColor() {
          var colorEncoded = textColor.split(" ");

          if (colorEncoded.length === 2 && colorEncoded[1] === "g") {
            // convert grayscale value to rgb so that it can be converted to hex for consistency
            var floatVal = parseFloat(colorEncoded[0]);
            colorEncoded = [floatVal, floatVal, floatVal, "r"];
          }

          var colorAsHex = "#";

          for (var i = 0; i < 3; i++) {
            colorAsHex += ("0" + Math.floor(parseFloat(colorEncoded[i]) * 255).toString(16)).slice(-2);
          }

          return colorAsHex;
        },
        getLineHeight: function getLineHeight() {
          return activeFontSize * lineHeightProportion;
        },
        write: function write(string1
        /*, string2, string3, etc */
        ) {
          out(arguments.length === 1 ? string1 : Array.prototype.join.call(arguments, " "));
        },
        getCoordinateString: function getCoordinateString(value) {
          return hpf(scaleByK(value));
        },
        getVerticalCoordinateString: function getVerticalCoordinateString(value) {
          return hpf(transformScaleY(value));
        },
        collections: {},
        newObject: newObject,
        newAdditionalObject: newAdditionalObject,
        newObjectDeferred: newObjectDeferred,
        newObjectDeferredBegin: newObjectDeferredBegin,
        putStream: putStream,
        events: events,
        // ratio that you use in multiplication of a given "size" number to arrive to 'point'
        // units of measurement.
        // scaleFactor is set at initialization of the document and calculated against the stated
        // default measurement units for the document.
        // If default is "mm", k is the number that will turn number in 'mm' into 'points' number.
        // through multiplication.
        scaleFactor: k,
        pageSize: {
          getWidth: function getWidth() {
            return pageWidth;
          },
          getHeight: function getHeight() {
            return pageHeight;
          }
        },
        output: function output(type, options) {
          return _output(type, options);
        },
        getNumberOfPages: function getNumberOfPages() {
          return pages.length - 1;
        },
        pages: pages,
        out: out,
        f2: f2,
        getPageInfo: function getPageInfo(pageNumberOneBased) {
          var objId = (pageNumberOneBased - 1) * 2 + 3;
          return {
            objId: objId,
            pageNumber: pageNumberOneBased,
            pageContext: pagesContext[pageNumberOneBased]
          };
        },
        getCurrentPageInfo: function getCurrentPageInfo() {
          var objId = (currentPage - 1) * 2 + 3;
          return {
            objId: objId,
            pageNumber: currentPage,
            pageContext: pagesContext[currentPage]
          };
        },
        getPDFVersion: function getPDFVersion() {
          return pdfVersion;
        },
        hasHotfix: hasHotfix //Expose the hasHotfix check so plugins can also check them.

      };

      function advancedAPI() {
        // prepend global change of basis matrix
        // (Now, instead of converting every coordinate to the pdf coordinate system, we apply a matrix
        // that does this job for us (however, texts, images and similar objects must be drawn bottom up))
        this.saveGraphicsState();
        out(new Matrix(k, 0, 0, -k, 0, pageHeight * k).toString() + " cm");
        this.setFontSize(this.getFontSize() / k);
        apiMode = ApiMode.ADVANCED;
      }

      function compatAPI() {
        this.restoreGraphicsState();
        apiMode = ApiMode.COMPAT;
      }
      /**
       * @callback ApiSwitchBody
       * @param {jsPDF} pdf
       */

      /**
       * For compatibility reasons jsPDF offers two API modes which differ in the way they convert between the the usual
       * screen coordinates and the PDF coordinate system.
       *   - "compat": Offers full compatibility across all plugins but does not allow arbitrary transforms
       *   - "advanced": Allows arbitrary transforms and more advanced features like pattern fills. Some plugins might
       *     not support this mode, though.
       * Initial mode is "compat".
       *
       * You can either provide a callback to the body argument, which means that jsPDF will automatically switch back to
       * the original API mode afterwards; or you can omit the callback and switch back manually using {@link compatAPI}.
       *
       * Note, that the calls to {@link saveGraphicsState} and {@link restoreGraphicsState} need to be balanced within the
       * callback or between calls of this method and its counterpart {@link compatAPI}. Calls to {@link beginFormObject}
       * or {@link beginTilingPattern} need to be closed by their counterparts before switching back to "compat" API mode.
       *
       * @param {ApiSwitchBody=} body When provided, this callback will be called after the API mode has been switched.
       * The API mode will be switched back automatically afterwards.
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name advancedAPI
       */


      API.advancedAPI = function (body) {
        var doSwitch = apiMode === ApiMode.COMPAT;

        if (doSwitch) {
          advancedAPI.call(this);
        }

        if (typeof body !== "function") {
          return this;
        }

        body(this);

        if (doSwitch) {
          compatAPI.call(this);
        }

        return this;
      };
      /**
       * Switches to "compat" API mode. See {@link advancedAPI} for more details.
       *
       * @param {ApiSwitchBody=} body When provided, this callback will be called after the API mode has been switched.
       * The API mode will be switched back automatically afterwards.
       * @return {jsPDF}
       * @methodOf jsPDF#
       * @name compatApi
       */


      API.compatAPI = function (body) {
        var doSwitch = apiMode === ApiMode.ADVANCED;

        if (doSwitch) {
          compatAPI.call(this);
        }

        if (typeof body !== "function") {
          return this;
        }

        body(this);

        if (doSwitch) {
          advancedAPI.call(this);
        }

        return this;
      };
      /**
       * @return {boolean} True iff the current API mode is "advanced". See {@link advancedAPI}.
       * @methodOf jsPDF#
       * @name isAdvancedAPI
       */


      API.isAdvancedAPI = function () {
        return apiMode === ApiMode.ADVANCED;
      };
      /**
       * Inserts a debug comment into the pdf.
       * @param {String} text
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name comment
       */


      API.comment = function (text) {
        out("#" + text);
        return this;
      };
      /**
       * An object representing a pdf graphics state.
       * @param parameters A parameter object that contains all properties this graphics state wants to set.
       * Supported are: opacity, stroke-opacity
       * @constructor
       */


      API.GState = function (parameters) {
        var supported = "opacity,stroke-opacity".split(",");

        for (var p in parameters) {
          if (parameters.hasOwnProperty(p) && supported.indexOf(p) >= 0) {
            this[p] = parameters[p];
          }
        }

        this.id = ""; // set by addGState()

        this.objectNumber = -1; // will be set by putGState()
      };

      API.GState.prototype.equals = function equals(other) {
        var ignore = "id,objectNumber,equals";
        if (!other || _typeof(other) !== _typeof(this)) return false;
        var count = 0;

        for (var p in this) {
          if (ignore.indexOf(p) >= 0) continue;
          if (this.hasOwnProperty(p) && !other.hasOwnProperty(p)) return false;
          if (this[p] !== other[p]) return false;
          count++;
        }

        for (var p in other) {
          if (other.hasOwnProperty(p) && ignore.indexOf(p) < 0) count--;
        }

        return count === 0;
      };
      /**
       * Adds a new {@link GState} for later use. See {@link setGState}.
       * @param {String} key
       * @param {GState} gState
       * @function
       * @instance
       * @returns {jsPDF}
       *
       * @methodOf jsPDF#
       * @name addPage
       */


      API.addGState = function (key, gState) {
        addGState(key, gState);
        return this;
      };
      /**
       * Adds (and transfers the focus to) new page to the PDF document.
       * @param {String/Array} format The format of the new page. Can be <ul><li>a0 - a10</li><li>b0 - b10</li><li>c0 - c10</li><li>c0 - c10</li><li>dl</li><li>letter</li><li>government-letter</li><li>legal</li><li>junior-legal</li><li>ledger</li><li>tabloid</li><li>credit-card</li></ul><br />
       * Default is "a4". If you want to use your own format just pass instead of one of the above predefined formats the size as an number-array , e.g. [595.28, 841.89]
       * @param {string} orientation Orientation of the new page. Possible values are "portrait" or "landscape" (or shortcuts "p" (Default), "l")
       * @function
       * @instance
       * @returns {jsPDF}
       *
       * @memberOf jsPDF
       * @name addPage
       */


      API.addPage = function (format, orientation) {
        _addPage.apply(this, arguments);

        return this;
      };
      /**
       * Adds (and transfers the focus to) new page to the PDF document.
       * @function
       * @instance
       * @returns {jsPDF}
       *
       * @memberOf jsPDF
       * @name setPage
       * @param {number} page Switch the active page to the page number specified
       * @example
       * doc = jsPDF()
       * doc.addPage()
       * doc.addPage()
       * doc.text('I am on page 3', 10, 10)
       * doc.setPage(1)
       * doc.text('I am on page 1', 10, 10)
       */


      API.setPage = function (page) {
        _setPage.apply(this, arguments);

        return this;
      };
      /**
       * @name insertPage
       * @memberOf jsPDF
       *
       * @function
       * @instance
       * @param {Object} beforePage
       * @returns {jsPDF}
       */


      API.insertPage = function (beforePage) {
        this.addPage();
        this.movePage(currentPage, beforePage);
        return this;
      };
      /**
       * @name movePage
       * @memberOf jsPDF
       * @function
       * @instance
       * @param {Object} targetPage
       * @param {Object} beforePage
       * @returns {jsPDF}
       */


      API.movePage = function (targetPage, beforePage) {
        var tmpPagesContext, tmpPagedim, tmpPages, i;

        if (targetPage > beforePage) {
          tmpPages = pages[targetPage];
          tmpPagedim = pagedim[targetPage];
          tmpPagesContext = pagesContext[targetPage];

          for (i = targetPage; i > beforePage; i--) {
            pages[i] = pages[i - 1];
            pagedim[i] = pagedim[i - 1];
            pagesContext[i] = pagesContext[i - 1];
          }

          pages[beforePage] = tmpPages;
          pagedim[beforePage] = tmpPagedim;
          pagesContext[beforePage] = tmpPagesContext;
          this.setPage(beforePage);
        } else if (targetPage < beforePage) {
          tmpPages = pages[targetPage];
          tmpPagedim = pagedim[targetPage];
          tmpPagesContext = pagesContext[targetPage];

          for (i = targetPage; i < beforePage; i++) {
            pages[i] = pages[i + 1];
            pagedim[i] = pagedim[i + 1];
            pagesContext[i] = pagesContext[i + 1];
          }

          pages[beforePage] = tmpPages;
          pagedim[beforePage] = tmpPagedim;
          pagesContext[beforePage] = tmpPagesContext;
          this.setPage(beforePage);
        }

        return this;
      };
      /**
       * @name deletePage
       * @memberOf jsPDF
       * @function
       * @instance
       * @returns {jsPDF}
       */


      API.deletePage = function () {
        _deletePage.apply(this, arguments);

        return this;
      };
      /**
       * @name setCreationDate
       * @memberOf jsPDF
       * @function
       * @instance
       * @param {Object} date
       * @returns {jsPDF}
       */


      API.setCreationDate = function (date) {
        setCreationDate(date);
        return this;
      };
      /**
       * @name getCreationDate
       * @memberOf jsPDF
       * @function
       * @instance
       * @param {Object} type
       * @returns {Object}
       */


      API.getCreationDate = function (type) {
        return getCreationDate(type);
      };
      /**
       * @name setFileId
       * @memberOf jsPDF
       * @function
       * @instance
       * @param {string} value GUID
       * @returns {jsPDF}
       */


      API.setFileId = function (value) {
        setFileId(value);
        return this;
      };
      /**
       * @name getFileId
       * @memberOf jsPDF
       * @function
       * @instance
       *
       * @returns {string} GUID
       */


      API.getFileId = function () {
        return getFileId();
      };
      /**
       * Set the display mode options of the page like zoom and layout.
       *
       * @param {integer|String} zoom   You can pass an integer or percentage as
       * a string. 2 will scale the document up 2x, '200%' will scale up by the
       * same amount. You can also set it to 'fullwidth', 'fullheight',
       * 'fullpage', or 'original'.
       *
       * Only certain PDF readers support this, such as Adobe Acrobat
       *
       * @param {string} layout Layout mode can be: 'continuous' - this is the
       * default continuous scroll. 'single' - the single page mode only shows one
       * page at a time. 'twoleft' - two column left mode, first page starts on
       * the left, and 'tworight' - pages are laid out in two columns, with the
       * first page on the right. This would be used for books.
       * @param {string} pmode 'UseOutlines' - it shows the
       * outline of the document on the left. 'UseThumbs' - shows thumbnails along
       * the left. 'FullScreen' - prompts the user to enter fullscreen mode.
       *
       * @returns {jsPDF}
       * @function
       * @instance
       * @name setDisplayMode
       * @methodOf jsPDF#
       */


      API.setDisplayMode = function (zoom, layout, pmode) {
        zoomMode = zoom;
        layoutMode = layout;
        pageMode = pmode;
        var validPageModes = [undefined, null, "UseNone", "UseOutlines", "UseThumbs", "FullScreen"];

        if (validPageModes.indexOf(pmode) == -1) {
          throw new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "' + pmode + '" is not recognized.');
        }

        return this;
      };
      /**
       * Saves the current graphics state ("pushes it on the stack"). It can be restored by {@link restoreGraphicsState}
       * later. Here, the general pdf graphics state is meant, also including the current transformation matrix,
       * fill and stroke colors etc.
       * @function
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name saveGraphicsState
       */


      API.saveGraphicsState = function () {
        out("q"); // as we cannot set font key and size independently we must keep track of both

        fontStateStack.push({
          key: activeFontKey,
          size: activeFontSize,
          color: textColor
        });
        return this;
      };
      /**
       * Restores a previously saved graphics state saved by {@link saveGraphicsState} ("pops the stack").
       * @function
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name restoreGraphicsState
       */


      API.restoreGraphicsState = function () {
        out("Q"); // restore previous font state

        var fontState = fontStateStack.pop();
        activeFontKey = fontState.key;
        activeFontSize = fontState.size;
        textColor = fontState.color;
        activeGState = null;
        return this;
      };
      /**
       * Appends this matrix to the left of all previously applied matrices.
       *
       * Only available in "advanced" API mode.
       *
       * @param {Matrix} matrix
       * @function
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setCurrentTransformationMatrix
       */


      API.setCurrentTransformationMatrix = function (matrix) {
        advancedApiModeTrap("setCurrentTransformationMatrix()");
        out(matrix.toString() + " cm");
        return this;
      };
      /**
       * Starts a new pdf form object, which means that all conseequent draw calls target a new independent object
       * until {@link endFormObject} is called. The created object can be referenced and drawn later using
       * {@link doFormObject}. Nested form objects are possible.
       * x, y, width, height set the bounding box that is used to clip the content.
       *
       * Only available in "advanced" API mode.
       *
       * @param {number} x
       * @param {number} y
       * @param {number} width
       * @param {number} height
       * @param {Matrix} matrix The matrix that will be applied to convert the form objects coordinate system to
       * the parent's.
       * @function
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name beginFormObject
       */


      API.beginFormObject = function (x, y, width, height, matrix) {
        advancedApiModeTrap("beginFormObject()"); // The user can set the output target to a new form object. Nested form objects are possible.
        // Currently, they use the resource dictionary of the surrounding stream. This should be changed, as
        // the PDF-Spec states:
        // "In PDF 1.2 and later versions, form XObjects may be independent of the content streams in which
        // they appear, and this is strongly recommended although not requiredIn PDF 1.2 and later versions,
        // form XObjects may be independent of the content streams in which they appear, and this is strongly
        // recommended although not required"

        beginNewRenderTarget(x, y, width, height, matrix);
        return this;
      };
      /**
       * Completes and saves the form object. Only available in "advanced" API mode.
       * @param {String} key The key by which this form object can be referenced.
       * @function
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name endFormObject
       */


      API.endFormObject = function (key) {
        advancedApiModeTrap("endFormObject()");
        endFormObject(key);
        return this;
      };
      /**
       * Draws the specified form object by referencing to the respective pdf XObject created with
       * {@link API.beginFormObject} and {@link endFormObject}.
       * The location is determined by matrix.
       *
       * Only available in "advanced" API mode.
       *
       * @param {String} key The key to the form object.
       * @param {Matrix} matrix The matrix applied before drawing the form object.
       * @function
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name doFormObject
       */


      API.doFormObject = function (key, matrix) {
        advancedApiModeTrap("doFormObject()");
        var xObject = renderTargets[renderTargetMap[key]];
        out("q");
        out(matrix.toString() + " cm");
        out("/" + xObject.id + " Do");
        out("Q");
        return this;
      };
      /**
       * Returns the form object specified by key.
       * @param key {String}
       * @returns {{x: number, y: number, width: number, height: number, matrix: Matrix}}
       * @function
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name getFormObject
       */


      API.getFormObject = function (key) {
        var xObject = renderTargets[renderTargetMap[key]];
        return {
          x: xObject.x,
          y: xObject.y,
          width: xObject.width,
          height: xObject.height,
          matrix: xObject.matrix
        };
      };
      /**
       * A matrix object for 2D homogenous transformations:
       * | a b 0 |
       * | c d 0 |
       * | e f 1 |
       * pdf multiplies matrices righthand: v' = v x m1 x m2 x ...
       * @param {number} a
       * @param {number} b
       * @param {number} c
       * @param {number} d
       * @param {number} e
       * @param {number} f
       * @constructor
       */


      API.Matrix = Matrix;
      /**
       * Multiplies two matrices. (see {@link Matrix})
       * @param {Matrix} m1
       * @param {Matrix} m2
       * @methodOf jsPDF#
       * @name matrixMult
       */

      API.matrixMult = matrixMult;
      /**
       * The unit matrix (equivalent to new Matrix(1, 0, 0, 1, 0, 0)).
       * @type {Matrix}
       * @fieldOf jsPDF#
       * @name unitMatrix
       */

      API.unitMatrix = unitMatrix;

      var Pattern = function Pattern(gState, matrix) {
        this.gState = gState;
        this.matrix = matrix;
        this.id = ""; // set by addPattern()

        this.objectNumber = -1; // will be set by putPattern()
      };
      /**
       * A pattern describing a shading pattern.
       *
       * Only available in "advanced" API mode.
       *
       * @param {String} type One of "axial" or "radial"
       * @param {Array<Number>} coords Either [x1, y1, x2, y2] for "axial" type describing the two interpolation points
       * or [x1, y1, r, x2, y2, r2] for "radial" describing inner and the outer circle.
       * @param {Array<Object>} colors An array of objects with the fields "offset" and "color". "offset" describes
       * the offset in parameter space [0, 1]. "color" is an array of length 3 describing RGB values in [0, 255].
       * @param {GState=} gState An additional graphics state that gets applied to the pattern (optional).
       * @param {Matrix=} matrix A matrix that describes the transformation between the pattern coordinate system
       * and the use coordinate system (optional).
       * @constructor
       * @extends API.Pattern
       */


      API.ShadingPattern = function (type, coords, colors, gState, matrix) {
        advancedApiModeTrap("ShadingPattern"); // see putPattern() for information how they are realized

        this.type = type === "axial" ? 2 : 3;
        this.coords = coords;
        this.colors = colors;
        Pattern.call(this, gState, matrix);
      };
      /**
       * A PDF Tiling pattern.
       *
       * Only available in "advanced" API mode.
       *
       * @param {Array.<Number>} boundingBox The bounding box at which one pattern cell gets clipped.
       * @param {Number} xStep Horizontal spacing between pattern cells.
       * @param {Number} yStep Vertical spacing between pattern cells.
       * @param {API.GState=} gState An additional graphics state that gets applied to the pattern (optional).
       * @param {Matrix=} matrix A matrix that describes the transformation between the pattern coordinate system
       * and the use coordinate system (optional).
       * @constructor
       * @extends API.Pattern
       */


      API.TilingPattern = function (boundingBox, xStep, yStep, gState, matrix) {
        advancedApiModeTrap("TilingPattern");
        this.boundingBox = boundingBox;
        this.xStep = xStep;
        this.yStep = yStep;
        this.stream = ""; // set by endTilingPattern();

        this.cloneIndex = 0;
        Pattern.call(this, gState, matrix);
      };

      API.TilingPattern.prototype = {
        createClone: function createClone(patternKey, boundingBox, xStep, yStep, matrix) {
          var clone = new API.TilingPattern(boundingBox || this.boundingBox, xStep || this.xStep, yStep || this.yStep, this.gState, matrix || this.matrix);
          clone.stream = this.stream;
          var key = patternKey + "$$" + this.cloneIndex++ + "$$";
          addPattern(key, clone);
          return clone;
        }
      };
      /**
       * Adds a new {@link API.ShadingPattern} for later use. Only available in "advanced" API mode.
       * @param {String} key
       * @param {Pattern} pattern
       * @function
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name addPattern
       */

      API.addShadingPattern = function (key, pattern) {
        advancedApiModeTrap("addShadingPattern()");
        addPattern(key, pattern);
        return this;
      };
      /**
       * Begins a new tiling pattern. All subsequent render calls are drawn to this pattern until {@link API.endTilingPattern}
       * gets called. Only available in "advanced" API mode.
       * @param {API.Pattern} pattern
       * @methodOf jsPDF#
       * @name beginTilingPattern
       */


      API.beginTilingPattern = function (pattern) {
        advancedApiModeTrap("beginTilingPattern()");
        beginNewRenderTarget(pattern.boundingBox[0], pattern.boundingBox[1], pattern.boundingBox[2] - pattern.boundingBox[0], pattern.boundingBox[3] - pattern.boundingBox[1], pattern.matrix);
      };
      /**
       * Ends a tiling pattern and sets the render target to the one active before {@link API.beginTilingPattern} has been called.
       *
       * Only available in "advanced" API mode.
       *
       * @param {string} key A unique key that is used to reference this pattern at later use.
       * @param {API.Pattern} pattern The pattern to end.
       * @methodOf jsPDF#
       * @name endTilingPattern
       */


      API.endTilingPattern = function (key, pattern) {
        advancedApiModeTrap("endTilingPattern()"); // retrieve the stream

        pattern.stream = pages[currentPage].join("\n");
        addPattern(key, pattern);
        events.publish("endTilingPattern", pattern); // restore state from stack

        renderTargetStack.pop().restore();
      };
      /**
       * Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
       *
       * @function
       * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down
       * per font, spacing settings declared before this call.
       * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
       * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
       * @param {Object} options Collection of settings signalling how the text must be encoded. Defaults are sane. If you
       * think you want to pass some flags, you likely can read the source.
       * @param {number|Matrix} transform If transform is a number the text will be rotated by this value around the
       * anchor set by x and y.
       *
       * If it is a Matrix, this matrix gets directly applied to the text, which allows shearing
       * effects etc.; the x and y offsets are then applied AFTER the coordinate system has been established by this
       * matrix. This means passing a rotation matrix that is equivalent to some rotation angle will in general yield a
       * DIFFERENT result. A matrix is only allowed in "advanced" API mode.
       *
       * @param align {string}
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name text
       */


      API.text = function (text, x, y, options, transform) {
        /**
         * Inserts something like this into PDF
         *   BT
         *    /F1 16 Tf  % Font name + size
         *    16 TL % How many units down for next line in multiline text
         *    0 g % color
         *    28.35 813.54 Td % position
         *    (line one) Tj
         *    T* (line two) Tj
         *    T* (line three) Tj
         *   ET
         */
        if (transform !== undefined && transform instanceof Matrix) {
          advancedApiModeTrap("The transform parameter of text() with a Matrix value");
        }

        var xtra = "";
        var isHex = false;
        var lineHeight = lineHeightProportion;
        var scope = this;

        function ESC(s) {
          s = s.split("\t").join(Array(options.TabLen || 9).join(" "));
          return pdfEscape(s, flags);
        }

        function transformTextToSpecialArray(text) {
          //we don't want to destroy original text array, so cloning it
          var sa = text.concat();
          var da = [];
          var len = sa.length;
          var curDa; //we do array.join('text that must not be PDFescaped")
          //thus, pdfEscape each component separately

          while (len--) {
            curDa = sa.shift();

            if (typeof curDa === "string") {
              da.push(curDa);
            } else {
              if (Object.prototype.toString.call(text) === "[object Array]" && curDa.length === 1) {
                da.push(curDa[0]);
              } else {
                da.push([curDa[0], curDa[1], curDa[2]]);
              }
            }
          }

          return da;
        }

        function processTextByFunction(text, processingFunction) {
          var result;

          if (typeof text === "string") {
            result = processingFunction(text)[0];
          } else if (Object.prototype.toString.call(text) === "[object Array]") {
            //we don't want to destroy original text array, so cloning it
            var sa = text.concat();
            var da = [];
            var len = sa.length;
            var curDa;
            var tmpResult; //we do array.join('text that must not be PDFescaped")
            //thus, pdfEscape each component separately

            while (len--) {
              curDa = sa.shift();

              if (typeof curDa === "string") {
                da.push(processingFunction(curDa)[0]);
              } else if (Object.prototype.toString.call(curDa) === "[object Array]" && curDa[0] === "string") {
                tmpResult = processingFunction(curDa[0], curDa[1], curDa[2]);
                da.push([tmpResult[0], tmpResult[1], tmpResult[2]]);
              }
            }

            result = da;
          }

          return result;
        } //backwardsCompatibility


        var tmp; // Pre-August-2012 the order of arguments was function(x, y, text, flags)
        // in effort to make all calls have similar signature like
        //   function(data, coordinates... , miscellaneous)
        // this method had its args flipped.
        // code below allows backward compatibility with old arg order.

        if (typeof text === "number") {
          tmp = y;
          y = x;
          x = text;
          text = tmp;
        }

        var flags = arguments[3];
        var angle = arguments[4];
        var align = arguments[5];

        if (_typeof(flags) !== "object" || flags === null) {
          if (typeof angle === "string") {
            align = angle;
            angle = null;
          }

          if (typeof flags === "string") {
            align = flags;
            flags = null;
          }

          if (typeof flags === "number") {
            angle = flags;
            flags = null;
          }

          options = {
            flags: flags,
            angle: angle,
            align: align
          };
        } //Check if text is of type String


        var textIsOfTypeString = false;
        var tmpTextIsOfTypeString = true;

        if (typeof text === "string") {
          textIsOfTypeString = true;
        } else if (Object.prototype.toString.call(text) === "[object Array]") {
          //we don't want to destroy original text array, so cloning it
          var sa = text.concat();
          var da = [];
          var len = sa.length;
          var curDa; //we do array.join('text that must not be PDFescaped")
          //thus, pdfEscape each component separately

          while (len--) {
            curDa = sa.shift();

            if (typeof curDa !== "string" || Object.prototype.toString.call(curDa) === "[object Array]" && typeof curDa[0] !== "string") {
              tmpTextIsOfTypeString = false;
            }
          }

          textIsOfTypeString = tmpTextIsOfTypeString;
        }

        if (textIsOfTypeString === false) {
          throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
        } //Escaping


        var activeFontEncoding = fonts[activeFontKey].encoding;

        if (activeFontEncoding === "WinAnsiEncoding" || activeFontEncoding === "StandardEncoding") {
          text = processTextByFunction(text, function (text, posX, posY) {
            return [ESC(text), posX, posY];
          });
        } //If there are any newlines in text, we assume
        //the user wanted to print multiple lines, so break the
        //text up into an array. If the text is already an array,
        //we assume the user knows what they are doing.
        //Convert text into an array anyway to simplify
        //later code.


        if (typeof text === "string") {
          if (text.match(/[\r?\n]/)) {
            text = text.split(/\r\n|\r|\n/g);
          } else {
            text = [text];
          }
        } //multiline


        var maxWidth = options.maxWidth || 0;

        if (maxWidth > 0) {
          if (typeof text === "string") {
            text = scope.splitTextToSize(text, maxWidth);
          } else if (Object.prototype.toString.call(text) === "[object Array]") {
            text = scope.splitTextToSize(text.join(" "), maxWidth);
          }
        } //creating Payload-Object to make text byRef


        var payload = {
          text: text,
          x: x,
          y: y,
          options: options,
          mutex: {
            pdfEscape: pdfEscape,
            activeFontKey: activeFontKey,
            fonts: fonts,
            activeFontSize: activeFontSize
          }
        };
        events.publish("preProcessText", payload);
        text = payload.text;
        options = payload.options; //angle

        var angle = options.angle;
        var transformationMatrix = null;

        if (angle && typeof angle === "number") {
          angle *= Math.PI / 180;

          if (apiMode === ApiMode.ADVANCED) {
            angle = -angle;
          }

          var c = Math.cos(angle),
              s = Math.sin(angle);
          transformationMatrix = new Matrix(c, s, -s, c, 0, 0);
        } else if (angle && angle instanceof Matrix) {
          transformationMatrix = angle;
        } //charSpace


        var charSpace = options.charSpace;

        if (charSpace !== undefined) {
          xtra += charSpace + " Tc\n";
        } //lang


        var lang = options.lang;
        var tmpRenderingMode = -1;
        var parmRenderingMode = options.renderingMode || options.stroke;
        var pageContext = scope.internal.getCurrentPageInfo().pageContext;

        switch (parmRenderingMode) {
          case 0:
          case false:
          case "fill":
            tmpRenderingMode = 0;
            break;

          case 1:
          case true:
          case "stroke":
            tmpRenderingMode = 1;
            break;

          case 2:
          case "fillThenStroke":
            tmpRenderingMode = 2;
            break;

          case 3:
          case "invisible":
            tmpRenderingMode = 3;
            break;

          case 4:
          case "fillAndAddForClipping":
            tmpRenderingMode = 4;
            break;

          case 5:
          case "strokeAndAddPathForClipping":
            tmpRenderingMode = 5;
            break;

          case 6:
          case "fillThenStrokeAndAddToPathForClipping":
            tmpRenderingMode = 6;
            break;

          case 7:
          case "addToPathForClipping":
            tmpRenderingMode = 7;
            break;
        }

        var usedRenderingMode = pageContext.usedRenderingMode || -1; //if the coder wrote it explicitly to use a specific
        //renderingMode, then use it

        if (tmpRenderingMode !== -1) {
          xtra += tmpRenderingMode + " Tr\n"; //otherwise check if we used the rendering Mode already
          //if so then set the rendering Mode...
        } else if (usedRenderingMode !== -1) {
          xtra += "0 Tr\n";
        }

        if (tmpRenderingMode !== -1) {
          pageContext.usedRenderingMode = tmpRenderingMode;
        } //align


        var align = options.align || "left";
        var leading = activeFontSize * lineHeight;
        var pageWidth = scope.internal.pageSize.getWidth();
        var k = scope.internal.scaleFactor;
        var activeFont = fonts[activeFontKey];
        var charSpace = options.charSpace || activeCharSpace;
        var maxWidth = options.maxWidth || 0;
        var lineWidths;
        var flags = {};
        var wordSpacingPerLine = [];

        if (Object.prototype.toString.call(text) === "[object Array]") {
          var da = transformTextToSpecialArray(text);
          var newY;
          var maxLineLength;
          var lineWidths;

          if (align !== "left") {
            lineWidths = da.map(function (v) {
              return scope.getStringUnitWidth(v, {
                font: activeFont,
                charSpace: charSpace,
                fontSize: activeFontSize
              }) * activeFontSize / k;
            });
          }

          var maxLineLength = Math.max.apply(Math, lineWidths); //The first line uses the "main" Td setting,
          //and the subsequent lines are offset by the
          //previous line's x coordinate.

          var prevWidth = 0;
          var delta;
          var newX;
          var xOffset = 0;

          if (align === "right") {
            xOffset = -lineWidths[0];
            text = [];

            for (var i = 0, len = da.length; i < len; i++) {
              delta = maxLineLength - lineWidths[i];

              if (i === 0) {
                newX = 0;
                newY = 0;
              } else {
                newX = prevWidth - lineWidths[i];
                newY = leading;
              }

              text.push([da[i], newX, newY]);
              prevWidth = lineWidths[i];
            }
          } else if (align === "center") {
            xOffset = -lineWidths[0] / 2;
            text = [];

            for (var i = 0, len = da.length; i < len; i++) {
              delta = (maxLineLength - lineWidths[i]) / 2;

              if (i === 0) {
                newX = 0;
                newY = 0;
              } else {
                newX = (prevWidth - lineWidths[i]) / 2;
                newY = leading;
              }

              text.push([da[i], newX, newY]);
              prevWidth = lineWidths[i];
            }
          } else if (align === "left") {
            text = [];

            for (var i = 0, len = da.length; i < len; i++) {
              text.push(da[i]);
            }
          } else if (align === "justify") {
            text = [];
            var maxWidth = maxWidth !== 0 ? maxWidth : pageWidth;

            for (var i = 0, len = da.length; i < len; i++) {
              newX = 0;
              newY = i === 0 ? 0 : leading;

              if (i < len - 1) {
                wordSpacingPerLine.push((maxWidth - lineWidths[i]) / (da[i].split(" ").length - 1));
              }

              text.push([da[i], newX, newY]);
            }
          } else {
            throw new Error('Unrecognized alignment option, use "left", "center", "right" or "justify".');
          }
        } //R2L


        var doReversing = typeof options.R2L === "boolean" ? options.R2L : R2L;

        if (doReversing === true) {
          text = processTextByFunction(text, function (text, posX, posY) {
            return [text.split("").reverse().join(""), posX, posY];
          });
        } //creating Payload-Object to make text byRef


        var payload = {
          text: text,
          x: x,
          y: y,
          options: options,
          mutex: {
            pdfEscape: pdfEscape,
            activeFontKey: activeFontKey,
            fonts: fonts,
            activeFontSize: activeFontSize
          }
        };
        events.publish("postProcessText", payload);
        text = payload.text;
        isHex = payload.mutex.isHex;
        var da = transformTextToSpecialArray(text);
        text = [];
        var variant = 0;
        var len = da.length;
        var posX;
        var posY;
        var content;
        var wordSpacing = "";

        for (var i = 0; i < len; i++) {
          wordSpacing = "";

          if (Object.prototype.toString.call(da[i]) !== "[object Array]") {
            content = (isHex ? "<" : "(") + da[i] + (isHex ? ">" : ")");
            variant = 0;
          } else if (Object.prototype.toString.call(da[i]) === "[object Array]") {
            posX = da[i][1] * k; // x offset must always be scaled!
            // y offset/leading must NOT be scaled by k as it is dependent of the font size, which is always given
            // in plain pt

            posY = -da[i][2];
            content = (isHex ? "<" : "(") + da[i][0] + (isHex ? ">" : ")");
            variant = 1;
          }

          if (wordSpacingPerLine !== undefined && wordSpacingPerLine[i] !== undefined) {
            wordSpacing = wordSpacingPerLine[i] + " Tw\n";
          }

          if (variant === 1 && i > 0) {
            text.push(wordSpacing + hpf(posX) + " " + hpf(posY) + " " + " Td\n" + content);
          } else {
            text.push(wordSpacing + content);
          }
        }

        if (variant === 0) {
          text = text.join(" Tj\nT* ");
        } else {
          text = text.join(" Tj\n");
        }

        if (apiMode === ApiMode.ADVANCED && transformationMatrix === null) {
          transformationMatrix = unitMatrix;
        }

        if (transformationMatrix !== null) {
          // It is kind of more intuitive to apply a plain rotation around the text anchor set by x and y
          // but when the user supplies an arbitrary transformation matrix, the x and y offsets should be applied
          // in the coordinate system established by this matrix
          if (typeof angle === "number") {
            transformationMatrix = matrixMult(transformationMatrix, new Matrix(1, 0, 0, 1, scaleByK(x), transformScaleY(y)));
          } else {
            transformationMatrix = matrixMult(new Matrix(1, 0, 0, 1, scaleByK(x), transformScaleY(y)), transformationMatrix);
          }

          transformationMatrix = matrixMult( // xOffset must always be scaled!
          new Matrix(1, 0, 0, 1, xOffset * k, 0), transformationMatrix);

          if (apiMode === ApiMode.ADVANCED) {
            transformationMatrix = matrixMult(new Matrix(1, 0, 0, -1, 0, 0), transformationMatrix);
          }

          text = transformationMatrix.toString() + " Tm\n" + text;
        } else {
          text = hpf(scaleByK(x + xOffset)) + " " + hpf(transformScaleY(y)) + " " + " Td\n" + text;
        }

        text += " Tj\n";
        var result = "BT\n/" + activeFontKey + " " + activeFontSize + " Tf\n" + // font face, style, size
        (activeFontSize * lineHeight).toFixed(2) + " TL\n" + // line spacing
        textColor + "\n";
        result += xtra;
        result += text;
        result += "ET";
        out(result);
        return scope;
      };
      /**
       * Letter spacing method to print text with gaps
       *
       * @function
       * @instance
       * @param {String|Array} text String to be added to the page.
       * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
       * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
       * @param {number} spacing Spacing (in units declared at inception)
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name lstext
       * @deprecated We'll be removing this function. It doesn't take character width into account.
       */


      API.lstext = function (text, x, y, spacing) {
        console.warn("jsPDF.lstext is deprecated");

        for (var i = 0, len = text.length; i < len; i++, x += spacing) {
          this.text(text[i], x, y);
        }

        return this;
      };
      /**
       * Draws a line from (x1, y1) to (x2, y2). No extra call to {@link API.stroke} is needed.
       * @param {number} x1
       * @param {number} y1
       * @param {number} x2
       * @param {number} y2
       * @return {jsPDF}
       * @methodOf jsPDF#
       * @name line
       */


      API.line = function (x1, y1, x2, y2) {
        if (apiMode === ApiMode.COMPAT) {
          return this.lines([[x2 - x1, y2 - y1]], x1, y1, [1, 1], "D");
        } else {
          return this.lines([[x2 - x1, y2 - y1]], x1, y1, [1, 1]).stroke();
        }
      };
      /**
       * Begin a new subpath by moving the current point to coordinates (x, y). The PDF "m" operator.
       * @param {number} x
       * @param {number} y
       * @methodOf jsPDF#
       * @name moveTo
       */


      API.moveTo = function (x, y) {
        out(hpf(scaleByK(x)) + " " + hpf(transformScaleY(y)) + " m");
      };
      /**
       * Append a straight line segment from the current point to the point (x, y). The PDF "l" operator.
       * @param {number} x
       * @param {number} y
       * @methodOf jsPDF#
       * @name lineTo
       */


      API.lineTo = function (x, y) {
        out(hpf(scaleByK(x)) + " " + hpf(transformScaleY(y)) + " l");
      };
      /**
       * Append a cubic Bézier curve to the current path. The curve shall extend from the current point to the point
       * (x3, y3), using (x1, y1) and (x2, y2) as Bézier control points. The new current point shall be (x3, x3).
       * @param {number} x1
       * @param {number} y1
       * @param {number} x2
       * @param {number} y2
       * @param {number} x3
       * @param {number} y3
       * @methodOf jsPDF#
       * @name curveTo
       */


      API.curveTo = function (x1, y1, x2, y2, x3, y3) {
        out([hpf(scaleByK(x1)), hpf(transformScaleY(y1)), hpf(scaleByK(x2)), hpf(transformScaleY(y2)), hpf(scaleByK(x3)), hpf(transformScaleY(y3)), "c"].join(" "));
      }; // PDF supports these path painting and clip path operators:
      //
      // S - stroke
      // s - close/stroke
      // f (F) - fill non-zero
      // f* - fill evenodd
      // B - fill stroke nonzero
      // B* - fill stroke evenodd
      // b - close fill stroke nonzero
      // b* - close fill stroke evenodd
      // n - nothing (consume path)
      // W - clip nonzero
      // W* - clip evenodd
      //
      // In order to keep the API small, we omit the close-and-fill/stroke operators and provide a separate close()
      // method.

      /**
       * Close the current path. The PDF "h" operator.
       * @return jsPDF
       * @methodOf jsPDF#
       * @name close
       */


      API.close = function () {
        out("h");
        return this;
      };
      /**
       * Stroke the path. The PDF "S" operator.
       * @return jsPDF
       * @methodOf jsPDF#
       * @name stroke
       */


      API.stroke = function () {
        out("S");
        return this;
      };
      /**
       * @typedef {Object} PatternData
       * @property {string} key The key of the pattern
       * @property {Matrix} matrix The matrix that gets applied to the pattern right before drawing.
       * @property {number[]|undefined} boundingBox Only relevant for tiling patterns. The bounding box at which one
       * pattern cell gets clipped
       * @property {number|undefined} xStep Only relevant for tiling patterns. Horizontal spacing between pattern cells
       * @property {number|undefined} yStep Only relevant for tiling patterns. Vertical spacing between pattern cells
       */

      /**
       * Fill the current path using the nonzero winding number rule. If a pattern is provided, the path will be filled
       * with this pattern, otherwise with the current fill color. Equivalent to the PDF "f" operator.
       * @param {PatternData=} pattern If provided the path will be filled with this pattern
       * @return jsPDF
       * @methodOf jsPDF#
       * @name fill
       */


      API.fill = function (pattern) {
        fillWithOptionalPattern("f", pattern);
        return this;
      };
      /**
       * Fill the current path using the even-odd rule. The PDF f* operator.
       * @see API.fill
       * @param {PatternData=} pattern Optional pattern
       * @return jsPDF
       * @methodOf jsPDF#
       * @name fillEvenOdd
       */


      API.fillEvenOdd = function (pattern) {
        fillWithOptionalPattern("f*", pattern);
        return this;
      };
      /**
       * Fill using the nonzero winding number rule and then stroke the current Path. The PDF "B" operator.
       * @see API.fill
       * @param {PatternData=} pattern Optional pattern
       * @return jsPDF
       * @methodOf jsPDF#
       * @name fillStroke
       */


      API.fillStroke = function (pattern) {
        fillWithOptionalPattern("B", pattern);
        return this;
      };
      /**
       * Fill using the even-odd rule and then stroke the current Path. The PDF "B" operator.
       * @see API.fill
       * @param {PatternData=} pattern Optional pattern
       * @return jsPDF
       * @methodOf jsPDF#
       * @name fillStrokeEvenOdd
       */


      API.fillStrokeEvenOdd = function (pattern) {
        fillWithOptionalPattern("B*", pattern);
        return this;
      };

      function fillWithOptionalPattern(style, pattern) {
        if (_typeof(pattern) === "object") {
          fillWithPattern(pattern, style);
        } else {
          out(style);
        }
      }
      /**
       * Modify the current clip path by intersecting it with the current path using the nonzero winding number rule. Note
       * that this will NOT consume the current path. In order to only use this path for clipping call
       * {@link API.discardPath} afterwards.
       *
       * When in "compat" API mode this method has a historical bug and will always stroke the path as well, use
       * {@link API.clip_fixed} instead.
       * @return jsPDF
       * @methodOf jsPDF#
       * @name clip
       */


      API.clip = function () {
        if (apiMode === ApiMode.COMPAT) {
          // By patrick-roberts, github.com/MrRio/jsPDF/issues/328
          // Call .clip() after calling .rect() with a style argument of null
          out("W"); // clip

          out("S"); // stroke path; necessary for clip to work
        } else {
          out("W");
        }

        return this;
      };
      /**
       * Modify the current clip path by intersecting it with the current path using the even-odd rule. Note
       * that this will NOT consume the current path. In order to only use this path for clipping call
       * {@link API.discardPath} afterwards.
       *
       * @return jsPDF
       * @methodOf jsPDF#
       * @name clipEvenOdd
       */


      API.clipEvenOdd = function () {
        out("W*");
        return this;
      };
      /**
       * Consumes the current path without any effect. Mainly used in combination with {@link clip} or
       * {@link clipEvenOdd}. The PDF "n" operator.
       * @return {jsPDF}
       * @methodOf jsPDF#
       * @name discardPath
       */


      API.discardPath = function () {
        out("n");
        return this;
      };
      /**
       * This fixes the previous function clip(). Perhaps the 'stroke path' hack was due to the missing 'n' instruction?
       * We introduce the fixed version so as to not break API.
       * @param fillRule
       * @deprecated Don't use this method when in "advanced" API mode.
       * @methodOf jsPDF#
       * @name clip_fixed
       */


      API.clip_fixed = function (fillRule) {
        // Call .clip() after calling drawing ops with a style argument of null
        // W is the PDF clipping op
        if ("evenodd" === fillRule) {
          out("W*");
        } else {
          out("W");
        } // End the path object without filling or stroking it.
        // This operator is a path-painting no-op, used primarily for the side effect of changing the current clipping path
        // (see Section 4.4.3, “Clipping Path Operators”)


        out("n");
      };
      /**
       * @typedef {Object} PatternData
       * {Matrix|undefined} matrix
       * {Number|undefined} xStep
       * {Number|undefined} yStep
       * {Array.<Number>|undefined} boundingBox
       */

      /**
       * Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
       * All data points in `lines` are relative to last line origin.
       * `x`, `y` become x1,y1 for first line / curve in the set.
       * For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
       * For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.
       *
       * @example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, 10) // line, line, bezier curve, line
       * @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
       * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
       * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
       * @param {Number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.
       * @param {String=} style A string specifying the painting style or null. Valid styles include:
       * 'S' [default] - stroke,
       * 'F' - fill,
       * and 'DF' (or 'FD') -  fill then stroke.
       * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
       * method calls. The last drawing method call used to define the shape should not have a null style argument.
       *
       * In "advanced" API mode this parameter is deprecated.
       * @param {Boolean=} closed If true, the path is closed with a straight line from the end of the last curve to the starting point.
       * @param {String=} patternKey The pattern key for the pattern that should be used to fill the path. Deprecated!
       * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
       * will modify the pattern on use. Deprecated!
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name lines
       */


      API.lines = function (lines, x, y, scale, style, closed, patternKey, patternData) {
        var scalex, scaley, i, l, leg, x2, y2, x3, y3, x4, y4; // Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
        // in effort to make all calls have similar signature like
        //   function(content, coordinateX, coordinateY , miscellaneous)
        // this method had its args flipped.
        // code below allows backward compatibility with old arg order.

        if (typeof lines === "number") {
          var tmp = y;
          y = x;
          x = lines;
          lines = tmp;
        }

        scale = scale || [1, 1]; // starting point

        this.moveTo(x, y);
        scalex = scale[0];
        scaley = scale[1];
        l = lines.length; //, x2, y2 // bezier only. In page default measurement "units", *after* scaling
        //, x3, y3 // bezier only. In page default measurement "units", *after* scaling
        // ending point for all, lines and bezier. . In page default measurement "units", *after* scaling

        x4 = x; // last / ending point = starting point for first item.

        y4 = y; // last / ending point = starting point for first item.

        for (i = 0; i < l; i++) {
          leg = lines[i];

          if (leg.length === 2) {
            // simple line
            x4 = leg[0] * scalex + x4; // here last x4 was prior ending point

            y4 = leg[1] * scaley + y4; // here last y4 was prior ending point

            this.lineTo(x4, y4);
          } else {
            // bezier curve
            x2 = leg[0] * scalex + x4; // here last x4 is prior ending point

            y2 = leg[1] * scaley + y4; // here last y4 is prior ending point

            x3 = leg[2] * scalex + x4; // here last x4 is prior ending point

            y3 = leg[3] * scaley + y4; // here last y4 is prior ending point

            x4 = leg[4] * scalex + x4; // here last x4 was prior ending point

            y4 = leg[5] * scaley + y4; // here last y4 was prior ending point

            this.curveTo(x2, y2, x3, y3, x4, y4);
          }
        }

        if (closed) {
          this.close();
        }

        putStyle(style, patternKey, patternData);
        return this;
      };
      /**
       * Similar to {@link API.lines} but all coordinates are interpreted as absolute coordinates instead of relative.
       * @param {Array<Object>} lines An array of {op: operator, c: coordinates} object, where op is one of "m" (move to), "l" (line to)
       * "c" (cubic bezier curve) and "h" (close (sub)path)). c is an array of coordinates. "m" and "l" expect two, "c"
       * six and "h" an empty array (or undefined).
       * @param {String=} style  The style. Deprecated!
       * @param {String=} patternKey The pattern key for the pattern that should be used to fill the path. Deprecated!
       * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
       * will modify the pattern on use. Deprecated!
       * @function
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name path
       */


      API.path = function (lines, style, patternKey, patternData) {
        for (var i = 0; i < lines.length; i++) {
          var leg = lines[i];
          var coords = leg.c;

          switch (leg.op) {
            case "m":
              this.moveTo(coords[0], coords[1]);
              break;

            case "l":
              this.lineTo(coords[0], coords[1]);
              break;

            case "c":
              this.curveTo.apply(this, coords);
              break;

            case "h":
              this.close();
              break;
          }
        }

        putStyle(style, patternKey, patternData);
        return this;
      };
      /**
       * Adds a rectangle to PDF
       *
       * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
       * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
       * @param {Number} w Width (in units declared at inception of PDF document)
       * @param {Number} h Height (in units declared at inception of PDF document)
       * @param {String=} style A string specifying the painting style or null. Valid styles include:
       * 'S' [default] - stroke,
       * 'F' - fill,
       * and 'DF' (or 'FD') -  fill then stroke.
       * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
       * method calls. The last drawing method call used to define the shape should not have a null style argument.
       *
       * In "advanced" API mode this parameter is deprecated.
       * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
       * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
       * will modify the pattern on use. Deprecated!
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name rect
       */


      API.rect = function (x, y, w, h, style, patternKey, patternData) {
        if (apiMode === ApiMode.COMPAT) {
          h = -h;
        }

        out([hpf(scaleByK(x)), hpf(transformScaleY(y)), hpf(scaleByK(w)), hpf(scaleByK(h)), "re"].join(" "));
        putStyle(style, patternKey, patternData);
        return this;
      };
      /**
       * Adds a triangle to PDF
       *
       * @param {Number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page
       * @param {Number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page
       * @param {Number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page
       * @param {Number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page
       * @param {Number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page
       * @param {Number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page
       * @param {String=} style A string specifying the painting style or null. Valid styles include:
       * 'S' [default] - stroke,
       * 'F' - fill,
       * and 'DF' (or 'FD') -  fill then stroke.
       * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
       * method calls. The last drawing method call used to define the shape should not have a null style argument.
       *
       * In "advanced" API mode this parameter is deprecated.
       * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
       * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
       * will modify the pattern on use. Deprecated!
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name triangle
       */


      API.triangle = function (x1, y1, x2, y2, x3, y3, style, patternKey, patternData) {
        this.lines([[x2 - x1, y2 - y1], // vector to point 2
        [x3 - x2, y3 - y2], // vector to point 3
        [x1 - x3, y1 - y3] // closing vector back to point 1
        ], x1, y1, // start of path
        [1, 1], style, true, patternKey, patternData);
        return this;
      };
      /**
       * Adds a rectangle with rounded corners to PDF
       *
       * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
       * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
       * @param {Number} w Width (in units declared at inception of PDF document)
       * @param {Number} h Height (in units declared at inception of PDF document)
       * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
       * @param {Number} ry Radius along y axis (in units declared at inception of PDF document)
       * @param {String=} style A string specifying the painting style or null. Valid styles include:
       * 'S' [default] - stroke,
       * 'F' - fill,
       * and 'DF' (or 'FD') -  fill then stroke.
       * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
       * method calls. The last drawing method call used to define the shape should not have a null style argument.
       *
       * In "advanced" API mode this parameter is deprecated.
       * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
       * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
       * will modify the pattern on use. Deprecated!
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name roundedRect
       */


      API.roundedRect = function (x, y, w, h, rx, ry, style, patternKey, patternData) {
        var MyArc = 4 / 3 * (Math.SQRT2 - 1);
        rx = Math.min(rx, w * 0.5);
        ry = Math.min(ry, h * 0.5);
        this.lines([[w - 2 * rx, 0], [rx * MyArc, 0, rx, ry - ry * MyArc, rx, ry], [0, h - 2 * ry], [0, ry * MyArc, -(rx * MyArc), ry, -rx, ry], [-w + 2 * rx, 0], [-(rx * MyArc), 0, -rx, -(ry * MyArc), -rx, -ry], [0, -h + 2 * ry], [0, -(ry * MyArc), rx * MyArc, -ry, rx, -ry]], x + rx, y, // start of path
        [1, 1], style, true, patternKey, patternData);
        return this;
      };
      /**
       * Adds an ellipse to PDF
       *
       * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
       * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
       * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
       * @param {Number} ry Radius along y axis (in units declared at inception of PDF document)
       * @param {String=} style A string specifying the painting style or null. Valid styles include:
       * 'S' [default] - stroke,
       * 'F' - fill,
       * and 'DF' (or 'FD') -  fill then stroke.
       * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
       * method calls. The last drawing method call used to define the shape should not have a null style argument.
       *
       * In "advanced" API mode this parameter is deprecated.
       * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
       * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
       * will modify the pattern on use. Deprecated!
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name ellipse
       */


      API.ellipse = function (x, y, rx, ry, style, patternKey, patternData) {
        var lx = 4 / 3 * (Math.SQRT2 - 1) * rx,
            ly = 4 / 3 * (Math.SQRT2 - 1) * ry;
        this.moveTo(x + rx, y);
        this.curveTo(x + rx, y - ly, x + lx, y - ry, x, y - ry);
        this.curveTo(x - lx, y - ry, x - rx, y - ly, x - rx, y);
        this.curveTo(x - rx, y + ly, x - lx, y + ry, x, y + ry);
        this.curveTo(x + lx, y + ry, x + rx, y + ly, x + rx, y);
        putStyle(style, patternKey, patternData);
        return this;
      };
      /**
       * Adds an circle to PDF
       *
       * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
       * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
       * @param {Number} r Radius (in units declared at inception of PDF document)
       * @param {String=} style A string specifying the painting style or null. Valid styles include:
       * 'S' [default] - stroke,
       * 'F' - fill,
       * and 'DF' (or 'FD') -  fill then stroke.
       * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
       * method calls. The last drawing method call used to define the shape should not have a null style argument.
       *
       * In "advanced" API mode this parameter is deprecated.
       * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
       * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
       * will modify the pattern on use. Deprecated!
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name circle
       */


      API.circle = function (x, y, r, style, patternKey, patternData) {
        return this.ellipse(x, y, r, r, style, patternKey, patternData);
      };
      /**
       * Adds a properties to the PDF document
       *
       * @param {Object} properties A property_name-to-property_value object structure.
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setProperties
       */


      API.setProperties = function (properties) {
        // copying only those properties we can render.
        for (var property in documentProperties) {
          if (documentProperties.hasOwnProperty(property) && properties[property]) {
            documentProperties[property] = properties[property];
          }
        }

        return this;
      };
      /**
       * Sets font size for upcoming text elements.
       *
       * @param {number} size Font size in points.
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setFontSize
       */


      API.setFontSize = function (size) {
        // convert font size into current unit system
        if (apiMode === ApiMode.ADVANCED) {
          activeFontSize = size / k;
        } else {
          activeFontSize = size;
        }

        out("/" + activeFontKey + " " + activeFontSize + " Tf");
        return this;
      };
      /**
       * @return {number}
       * @methodOf jsPDF#
       * @name getFontSize
       */


      API.getFontSize = function () {
        if (apiMode === ApiMode.COMPAT) {
          return activeFontSize;
        } else {
          return activeFontSize * k;
        }
      };
      /**
       * Sets text font face, variant for upcoming text elements.
       * See output of jsPDF.getFontList() for possible font names, styles.
       *
       * @param {string} fontName Font name or family. Example: "times"
       * @param {string} fontStyle Font style or variant. Example: "italic"
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setFont
       */


      API.setFont = function (fontName, fontStyle) {
        activeFontKey = _getFont(fontName, fontStyle); // if font is not found, the above line blows up and we never go further

        out("/" + activeFontKey + " " + activeFontSize + " Tf");
        return this;
      };
      /**
       * Switches font style or variant for upcoming text elements,
       * while keeping the font face or family same.
       * See output of jsPDF.getFontList() for possible font names, styles.
       *
       * @param {string} style Font style or variant. Example: "italic"
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setFontStyle
       */


      API.setFontStyle = API.setFontType = function (style) {
        activeFontKey = _getFont(undefined, style); // if font is not found, the above line blows up and we never go further

        out("/" + activeFontKey + " " + activeFontSize + " Tf");
        return this;
      };
      /**
       * Returns an object - a tree of fontName to fontStyle relationships available to
       * active PDF document.
       *
       * @public
       * @function
       * @instance
       * @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
       * @methodOf jsPDF#
       * @name getFontList
       */


      API.getFontList = function () {
        // TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
        var list = {},
            fontName,
            fontStyle,
            tmp;

        for (fontName in fontmap) {
          if (fontmap.hasOwnProperty(fontName)) {
            list[fontName] = tmp = [];

            for (fontStyle in fontmap[fontName]) {
              if (fontmap[fontName].hasOwnProperty(fontStyle)) {
                tmp.push(fontStyle);
              }
            }
          }
        }

        return list;
      };
      /**
       * Add a custom font to the current instance.
       *
       * @param {String} postScriptName name of the Font.  Example: "Menlo-Regular"
       * @param {String} fontName of font-family from @font-face definition.  Example: "Menlo Regular"
       * @param {String} fontStyle style.  Example: "normal"
       * @function
       * @instance
       * @methodOf jsPDF
       * @name addFont
       */


      API.addFont = function (postScriptName, fontName, fontStyle, encoding) {
        encoding = encoding || "Identity-H";
        addFont.call(this, postScriptName, fontName, fontStyle, encoding);
      };
      /**
       * Sets line width for upcoming lines.
       *
       * @param {number} width Line width (in units declared at inception of PDF document)
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setLineWidth
       */


      API.setLineWidth = function (width) {
        out(scaleByK(width).toFixed(2) + " w");
        return this;
      };
      /**
       * Sets the stroke color for upcoming elements.
       *
       * Depending on the number of arguments given, Gray, RGB, or CMYK
       * color space is implied.
       *
       * When only ch1 is given, "Gray" color space is implied and it
       * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
       * if values are communicated as String types, or in range from 0 (black)
       * to 255 (white) if communicated as Number type.
       * The RGB-like 0-255 range is provided for backward compatibility.
       *
       * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
       * value must be in the range from 0.00 (minimum intensity) to to 1.00
       * (max intensity) if values are communicated as String types, or
       * from 0 (min intensity) to to 255 (max intensity) if values are communicated
       * as Number types.
       * The RGB-like 0-255 range is provided for backward compatibility.
       *
       * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
       * value must be a in the range from 0.00 (0% concentration) to to
       * 1.00 (100% concentration)
       *
       * Because JavaScript treats fixed point numbers badly (rounds to
       * floating point nearest to binary representation) it is highly advised to
       * communicate the fractional numbers as String types, not JavaScript Number type.
       *
       * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'
       * @param {Number|String} ch2 Color channel value
       * @param {Number|String} ch3 Color channel value
       * @param {Number|String} ch4 Color channel value
       *
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setDrawColor
       */


      API.setDrawColor = function (ch1, ch2, ch3, ch4) {
        var options = {
          ch1: ch1,
          ch2: ch2,
          ch3: ch3,
          ch4: ch4,
          pdfColorType: "draw",
          precision: 2
        };
        out(generateColorString(options));
        return this;
      };
      /**
       * Sets the fill color for upcoming elements.
       *
       * Depending on the number of arguments given, Gray, RGB, or CMYK
       * color space is implied.
       *
       * When only ch1 is given, "Gray" color space is implied and it
       * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
       * if values are communicated as String types, or in range from 0 (black)
       * to 255 (white) if communicated as Number type.
       * The RGB-like 0-255 range is provided for backward compatibility.
       *
       * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
       * value must be in the range from 0.00 (minimum intensity) to to 1.00
       * (max intensity) if values are communicated as String types, or
       * from 0 (min intensity) to to 255 (max intensity) if values are communicated
       * as Number types.
       * The RGB-like 0-255 range is provided for backward compatibility.
       *
       * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
       * value must be a in the range from 0.00 (0% concentration) to to
       * 1.00 (100% concentration)
       *
       * Because JavaScript treats fixed point numbers badly (rounds to
       * floating point nearest to binary representation) it is highly advised to
       * communicate the fractional numbers as String types, not JavaScript Number type.
       *
       * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'
       * @param {Number|String} ch2 Color channel value
       * @param {Number|String} ch3 Color channel value
       * @param {Number|String} ch4 Color channel value
       *
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setFillColor
       */


      API.setFillColor = function (ch1, ch2, ch3, ch4) {
        var options = {
          ch1: ch1,
          ch2: ch2,
          ch3: ch3,
          ch4: ch4,
          pdfColorType: "fill",
          precision: 2
        };
        out(generateColorString(options));
        return this;
      };
      /**
       * Sets the text color for upcoming elements.
       *
       * Depending on the number of arguments given, Gray, RGB, or CMYK
       * color space is implied.
       *
       * When only ch1 is given, "Gray" color space is implied and it
       * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
       * if values are communicated as String types, or in range from 0 (black)
       * to 255 (white) if communicated as Number type.
       * The RGB-like 0-255 range is provided for backward compatibility.
       *
       * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
       * value must be in the range from 0.00 (minimum intensity) to to 1.00
       * (max intensity) if values are communicated as String types, or
       * from 0 (min intensity) to to 255 (max intensity) if values are communicated
       * as Number types.
       * The RGB-like 0-255 range is provided for backward compatibility.
       *
       * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
       * value must be a in the range from 0.00 (0% concentration) to to
       * 1.00 (100% concentration)
       *
       * Because JavaScript treats fixed point numbers badly (rounds to
       * floating point nearest to binary representation) it is highly advised to
       * communicate the fractional numbers as String types, not JavaScript Number type.
       *
       * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'
       * @param {Number|String} ch2 Color channel value
       * @param {Number|String} ch3 Color channel value
       * @param {Number|String} ch4 Color channel value
       *
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setTextColor
       */


      API.setTextColor = function (ch1, ch2, ch3, ch4) {
        var options = {
          ch1: ch1,
          ch2: ch2,
          ch3: ch3,
          ch4: ch4,
          pdfColorType: "text",
          precision: 3
        };
        textColor = generateColorString(options);
        return this;
      };
      /**
       * Initializes the default character set that the user wants to be global..
       *
       * @param {number} charSpace
       * @function
       * @instance
       * @returns {jsPDF} jsPDF-instance
       * @methodOf jsPDF
       * @name setCharSpace
       */


      API.setCharSpace = function (charSpace) {
        if (apiMode === ApiMode.COMPAT) {
          activeCharSpace = charSpace;
        } else if (apiMode === ApiMode.ADVANCED) {
          activeCharSpace = charSpace / k;
        }

        return this;
      };
      /**
       * Initializes the default character set that the user wants to be global..
       *
       * @param {boolean} boolean
       * @function
       * @instance
       * @returns {jsPDF} jsPDF-instance
       * @methodOf jsPDF
       * @name setR2L
       */


      API.setR2L = function (boolean) {
        R2L = boolean;
        return this;
      };
      /**
       * Sets a either previously added {@link GState} (via {@link addGState}) or a new {@link GState}.
       * @param {String|GState} gState If type is string, a previously added GState is used, if type is GState
       * it will be added before use.
       * @function
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setGState
       */


      API.setGState = function (gState) {
        if (typeof gState === "string") {
          gState = gStates[gStatesMap[gState]];
        } else {
          gState = addGState(null, gState);
        }

        if (!gState.equals(activeGState)) {
          out("/" + gState.id + " gs");
          activeGState = gState;
        }
      };
      /**
       * Is an Object providing a mapping from human-readable to
       * integer flag values designating the varieties of line cap
       * and join styles.
       *
       * @fieldOf jsPDF#
       * @name CapJoinStyles
       */


      API.CapJoinStyles = {
        0: 0,
        butt: 0,
        but: 0,
        miter: 0,
        1: 1,
        round: 1,
        rounded: 1,
        circle: 1,
        2: 2,
        projecting: 2,
        project: 2,
        square: 2,
        bevel: 2
      };
      /**
       * Sets the line cap styles
       * See {jsPDF.CapJoinStyles} for variants
       *
       * @param {String|Number} style A string or number identifying the type of line cap
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setLineCap
       */

      API.setLineCap = function (style) {
        var id = this.CapJoinStyles[style];

        if (id === undefined) {
          throw new Error("Line cap style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
        }

        lineCapID = id;
        out(id + " J");
        return this;
      };
      /**
       * Sets the line join styles
       * See {jsPDF.CapJoinStyles} for variants
       *
       * @param {String|Number} style A string or number identifying the type of line join
       * @function
       * @instance
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setLineJoin
       */


      API.setLineJoin = function (style) {
        var id = this.CapJoinStyles[style];

        if (id === undefined) {
          throw new Error("Line join style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
        }

        lineJoinID = id;
        out(id + " j");
        return this;
      };
      /**
       * Sets the miter limit.
       * @param {number} miterLimit
       * @function
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setMiterLimit
       */


      API.setLineMiterLimit = function (miterLimit) {
        out(hpf(miterLimit) + " M");
        return this;
      };
      /**
       * Sets the line dash pattern.
       * @param {Array<number>} array An array containing 0-2 numbers. The first number sets the length of the
       * dashes, the second number the length of the gaps. If the second number is missing, the gaps are considered
       * to be as long as the dashes. An empty array means solid, unbroken lines.
       * @param phase The phase lines start with.
       * @function
       * @returns {jsPDF}
       * @methodOf jsPDF#
       * @name setLineDashPattern
       */


      API.setLineDashPattern = function (array, phase) {
        out(["[" + (array[0] !== undefined ? array[0] : ""), (array[1] !== undefined ? array[1] : "") + "]", phase, "d"].join(" "));
        return this;
      };
      /**
       * Generates the PDF document.
       *
       * If `type` argument is undefined, output is raw body of resulting PDF returned as a string.
       *
       * @param {string} type A string identifying one of the possible output types.
       * @param {Object} options An object providing some additional signalling to PDF generator.
       *
       * @function
       * @instance
       * @returns {jsPDF}
       * @memberOf jsPDF
       * @name output
       */


      API.output = _output;
      /**
       * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf')
       *
       * @memberOf jsPDF
       * @name save
       * @function
       * @instance
       * @param  {string} filename The filename including extension.
       * @returns {jsPDF} jsPDF-instance
       */

      API.save = function (filename) {
        API.output("save", filename);
      }; // applying plugins (more methods) ON TOP of built-in API.
      // this is intentional as we allow plugins to override
      // built-ins


      for (var plugin in jsPDF.API) {
        if (jsPDF.API.hasOwnProperty(plugin)) {
          if (plugin === "events" && jsPDF.API.events.length) {
            (function (events, newEvents) {
              // jsPDF.API.events is a JS Array of Arrays
              // where each Array is a pair of event name, handler
              // Events were added by plugins to the jsPDF instantiator.
              // These are always added to the new instance and some ran
              // during instantiation.
              var eventname, handler_and_args, i;

              for (i = newEvents.length - 1; i !== -1; i--) {
                // subscribe takes 3 args: 'topic', function, runonce_flag
                // if undefined, runonce is false.
                // users can attach callback directly,
                // or they can attach an array with [callback, runonce_flag]
                // that's what the "apply" magic is for below.
                eventname = newEvents[i][0];
                handler_and_args = newEvents[i][1];
                events.subscribe.apply(events, [eventname].concat(typeof handler_and_args === "function" ? [handler_and_args] : handler_and_args));
              }
            })(events, jsPDF.API.events);
          } else {
            API[plugin] = jsPDF.API[plugin];
          }
        }
      } //////////////////////////////////////////////////////
      // continuing initialization of jsPDF Document object
      //////////////////////////////////////////////////////
      // Add the first page automatically


      addFonts();
      activeFontKey = "F1";

      _addPage(format, orientation);

      events.publish("initialized");
      return API;
    }
    /**
     * jsPDF.API is a STATIC property of jsPDF class.
     * jsPDF.API is an object you can add methods and properties to.
     * The methods / properties you add will show up in new jsPDF objects.
     *
     * One property is prepopulated. It is the 'events' Object. Plugin authors can add topics,
     * callbacks to this object. These will be reassigned to all new instances of jsPDF.
     *
     * @static
     * @public
     * @memberOf jsPDF
     * @name API
     *
     * @example
     * jsPDF.API.mymethod = function(){
     *   // 'this' will be ref to internal API object. see jsPDF source
     *   // , so you can refer to built-in methods like so:
     *   //     this.line(....)
     *   //     this.text(....)
     * }
     * var pdfdoc = new jsPDF()
     * pdfdoc.mymethod() // <- !!!!!!
     */


    jsPDF.API = {
      events: []
    };
    /**
     * The version of jsPDF
     * @name version
     * @type {string}
     * @memberOf jsPDF
     */

    jsPDF.version = "0.0.0";

    if (typeof define === "function" && define.amd) {
      define(function () {
        return jsPDF;
      });
    } else if (typeof module !== "undefined" && module.exports) {
      module.exports = jsPDF;
      module.exports.jsPDF = jsPDF;
    } else {
      global.jsPDF = jsPDF;
    }

    return jsPDF;
  }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || Function('return typeof this === "object" && this.content')() || Function("return this")()); // `self` is undefined in Firefox for Android content script context
  // while `this` is nsIContentFrameMessageManager
  // with an attribute `content` that corresponds to the window

  /**
   * @license
   * Copyright (c) 2016 Alexander Weidt,
   * https://github.com/BiggA94
   *
   * Licensed under the MIT License. http://opensource.org/licenses/mit-license
   */

  /**
   * jsPDF AcroForm Plugin
   *
   * @name AcroForm
   * @module
   */
  (function (jsPDFAPI, globalObj) {

    var scope;
    var pageHeight;
    var scaleFactor = 1;

    var inherit = function inherit(child, parent) {

      child.prototype = Object.create(parent.prototype);
      child.prototype.constructor = child;
    };

    var scale = function scale(x) {
      return x * (scaleFactor / 1); // 1 = (96 / 72)
    };

    var createFormXObject = function createFormXObject(formObject) {
      var xobj = new AcroFormXObject();
      var height = AcroFormAppearance.internal.getHeight(formObject) || 0;
      var width = AcroFormAppearance.internal.getWidth(formObject) || 0;
      xobj.BBox = [0, 0, width.toFixed(2), height.toFixed(2)];
      return xobj;
    };

    var setBitPosition = function setBitPosition(variable, position, value) {
      variable = variable || 0;
      value = value || 1;
      var bitMask = 1;
      bitMask = bitMask << position - 1;

      if (value == 1) {
        // Set the Bit to 1
        var variable = variable | bitMask;
      } else {
        // Set the Bit to 0
        var variable = variable & ~bitMask;
      }

      return variable;
    };
    /**
     * Calculating the Ff entry:
     *
     * The Ff entry contains flags, that have to be set bitwise In the Following
     * the number in the Comment is the BitPosition
     */


    var calculateFlagsOnOptions = function calculateFlagsOnOptions(flags, opts, PDFVersion) {
      var PDFVersion = PDFVersion || 1.3;
      var flags = flags || 0; // 1, readOnly

      if (opts.readOnly == true) {
        flags = setBitPosition(flags, 1);
      } // 2, required


      if (opts.required == true) {
        flags = setBitPosition(flags, 2);
      } // 4, noExport


      if (opts.noExport == true) {
        flags = setBitPosition(flags, 3);
      } // 13, multiline


      if (opts.multiline == true) {
        flags = setBitPosition(flags, 13);
      } // 14, Password


      if (opts.password) {
        flags = setBitPosition(flags, 14);
      } // 15, NoToggleToOff (Radio buttons only


      if (opts.noToggleToOff) {
        flags = setBitPosition(flags, 15);
      } // 16, Radio


      if (opts.radio) {
        flags = setBitPosition(flags, 16);
      } // 17, Pushbutton


      if (opts.pushbutton) {
        flags = setBitPosition(flags, 17);
      } // 18, Combo (If not set, the choiceField is a listBox!!)


      if (opts.combo) {
        flags = setBitPosition(flags, 18);
      } // 19, Edit


      if (opts.edit) {
        flags = setBitPosition(flags, 19);
      } // 20, Sort


      if (opts.sort) {
        flags = setBitPosition(flags, 20);
      } // 21, FileSelect, PDF 1.4...


      if (opts.fileSelect && PDFVersion >= 1.4) {
        flags = setBitPosition(flags, 21);
      } // 22, MultiSelect (PDF 1.4)


      if (opts.multiSelect && PDFVersion >= 1.4) {
        flags = setBitPosition(flags, 22);
      } // 23, DoNotSpellCheck (PDF 1.4)


      if (opts.doNotSpellCheck && PDFVersion >= 1.4) {
        flags = setBitPosition(flags, 23);
      } // 24, DoNotScroll (PDF 1.4)


      if (opts.doNotScroll == true && PDFVersion >= 1.4) {
        flags = setBitPosition(flags, 24);
      } // 25, RichText (PDF 1.4)


      if (opts.richText && PDFVersion >= 1.4) {
        flags = setBitPosition(flags, 25);
      }

      return flags;
    };

    var calculateCoordinates = function calculateCoordinates(args) {
      var x = args[0];
      var y = args[1];
      var w = args[2];
      var h = args[3];
      var coordinates = {};

      if (Array.isArray(x)) {
        x[0] = scale(x[0]);
        x[1] = scale(x[1]);
        x[2] = scale(x[2]);
        x[3] = scale(x[3]);
      } else {
        x = scale(x);
        y = scale(y);
        w = scale(w);
        h = scale(h);
      }

      coordinates.lowerLeft_X = x || 0;
      coordinates.lowerLeft_Y = scale(pageHeight) - y - h || 0;
      coordinates.upperRight_X = x + w || 0;
      coordinates.upperRight_Y = scale(pageHeight) - y || 0;
      return [coordinates.lowerLeft_X.toFixed(2), coordinates.lowerLeft_Y.toFixed(2), coordinates.upperRight_X.toFixed(2), coordinates.upperRight_Y.toFixed(2)];
    };

    var calculateAppearanceStream = function calculateAppearanceStream(formObject) {
      if (formObject.appearanceStreamContent) {
        // If appearanceStream is already set, use it
        return formObject.appearanceStreamContent;
      }

      if (!formObject.V && !formObject.DV) {
        return;
      } // else calculate it


      var stream = [];
      var text = formObject.V || formObject.DV;
      var calcRes = calculateX(formObject, text);
      stream.push("/Tx BMC");
      stream.push("q");
      stream.push("/F1 " + calcRes.fontSize.toFixed(2) + " Tf");
      stream.push("1 0 0 1 0 0 Tm"); // Text Matrix

      stream.push("BT"); // Begin Text

      stream.push(calcRes.text);
      stream.push("ET"); // End Text

      stream.push("Q");
      stream.push("EMC");
      var appearanceStreamContent = new createFormXObject(formObject);
      appearanceStreamContent.stream = stream.join("\n");
      return appearanceStreamContent;
    };

    var calculateX = function calculateX(formObject, text, font, maxFontSize) {
      var maxFontSize = maxFontSize || 12;
      var font = font || "helvetica";
      var returnValue = {
        text: "",
        fontSize: ""
      }; // Remove Brackets

      text = text.substr(0, 1) == "(" ? text.substr(1) : text;
      text = text.substr(text.length - 1) == ")" ? text.substr(0, text.length - 1) : text; // split into array of words

      var textSplit = text.split(" ");
      var fontSize = maxFontSize; // The Starting fontSize (The Maximum)

      var lineSpacing = 2;
      var borderPadding = 2;
      var height = AcroFormAppearance.internal.getHeight(formObject) || 0;
      height = height < 0 ? -height : height;
      var width = AcroFormAppearance.internal.getWidth(formObject) || 0;
      width = width < 0 ? -width : width;

      var isSmallerThanWidth = function isSmallerThanWidth(i, lastLine, fontSize) {
        if (i + 1 < textSplit.length) {
          var tmp = lastLine + " " + textSplit[i + 1];
          var TextWidth = calculateFontSpace(tmp, fontSize + "px", font).width;
          var FieldWidth = width - 2 * borderPadding;
          return TextWidth <= FieldWidth;
        } else {
          return false;
        }
      };

      fontSize++;

      FontSize: while (true) {
        var text = "";
        fontSize--;
        var textHeight = calculateFontSpace("3", fontSize + "px", font).height;
        var startY = formObject.multiline ? height - fontSize : (height - textHeight) / 2;
        startY += lineSpacing;
        var startX = -borderPadding;
        var lastY = startY;
        var firstWordInLine = 0,
            lastWordInLine = 0;
        var lastLength = 0;

        if (fontSize <= 0) {
          // In case, the Text doesn't fit at all
          fontSize = 12;
          text = "(...) Tj\n";
          text += "% Width of Text: " + calculateFontSpace(text, "1px").width + ", FieldWidth:" + width + "\n";
          break;
        }

        lastLength = calculateFontSpace(textSplit[0] + " ", fontSize + "px", font).width;
        var lastLine = "";
        var lineCount = 0;

        Line: for (var i in textSplit) {
          if (textSplit.hasOwnProperty(i)) {
            lastLine += textSplit[i] + " "; // Remove last blank

            lastLine = lastLine.substr(lastLine.length - 1) == " " ? lastLine.substr(0, lastLine.length - 1) : lastLine;
            var key = parseInt(i);
            lastLength = calculateFontSpace(lastLine + " ", fontSize + "px", font).width;
            var nextLineIsSmaller = isSmallerThanWidth(key, lastLine, fontSize);
            var isLastWord = i >= textSplit.length - 1;

            if (nextLineIsSmaller && !isLastWord) {
              lastLine += " ";
              continue; // Line
            } else if (!nextLineIsSmaller && !isLastWord) {
              if (!formObject.multiline) {
                continue FontSize;
              } else {
                if ((textHeight + lineSpacing) * (lineCount + 2) + lineSpacing > height) {
                  // If the Text is higher than the
                  // FieldObject
                  continue FontSize;
                }

                lastWordInLine = key; // go on
              }
            } else if (isLastWord) {
              lastWordInLine = key;
            } else {
              if (formObject.multiline && (textHeight + lineSpacing) * (lineCount + 2) + lineSpacing > height) {
                // If the Text is higher than the FieldObject
                continue FontSize;
              }
            }

            var line = "";

            for (var x = firstWordInLine; x <= lastWordInLine; x++) {
              line += textSplit[x] + " ";
            } // Remove last blank


            line = line.substr(line.length - 1) == " " ? line.substr(0, line.length - 1) : line; // lastLength -= blankSpace.width;

            lastLength = calculateFontSpace(line, fontSize + "px", font).width; // Calculate startX

            switch (formObject.Q) {
              case 2:
                // Right justified
                startX = width - lastLength - borderPadding;
                break;

              case 1:
                // Q = 1 := Text-Alignment: Center
                startX = (width - lastLength) / 2;
                break;

              case 0:
              default:
                startX = borderPadding;
                break;
            }

            text += startX.toFixed(2) + " " + lastY.toFixed(2) + " Td\n";
            text += "(" + line + ") Tj\n"; // reset X in PDF

            text += -startX.toFixed(2) + " 0 Td\n"; // After a Line, adjust y position

            lastY = -(fontSize + lineSpacing);

            lastLength = 0;
            firstWordInLine = lastWordInLine + 1;
            lineCount++;
            lastLine = "";
            continue Line;
          }
        }

        break;
      }

      returnValue.text = text;
      returnValue.fontSize = fontSize;
      return returnValue;
    };
    /**
     * Small workaround for calculating the TextMetric approximately.
     *
     * @param text
     * @param fontsize
     * @returns {TextMetrics} (Has Height and Width)
     */


    var calculateFontSpace = function calculateFontSpace(text, fontSize, fontType) {
      fontType = fontType || "helvetica";
      var font = scope.internal.getFont(fontType);
      var width = scope.getStringUnitWidth(text, {
        font: font,
        fontSize: parseFloat(fontSize),
        charSpace: 0
      }) * parseFloat(fontSize);
      var height = scope.getStringUnitWidth("3", {
        font: font,
        fontSize: parseFloat(fontSize),
        charSpace: 0
      }) * parseFloat(fontSize) * 1.5;
      var result = {
        height: height,
        width: width
      };
      return result;
    };

    var acroformPluginTemplate = {
      fields: [],
      xForms: [],

      /**
       * acroFormDictionaryRoot contains information about the AcroForm
       * Dictionary 0: The Event-Token, the AcroFormDictionaryCallback has
       * 1: The Object ID of the Root
       */
      acroFormDictionaryRoot: null,

      /**
       * After the PDF gets evaluated, the reference to the root has to be
       * reset, this indicates, whether the root has already been printed
       * out
       */
      printedOut: false,
      internal: null,
      isInitialized: false
    };

    var annotReferenceCallback = function annotReferenceCallback() {
      var fields = scope.internal.acroformPlugin.acroFormDictionaryRoot.Fields;

      for (var i in fields) {
        if (fields.hasOwnProperty(i)) {
          var formObject = fields[i]; // add Annot Reference!

          if (formObject.hasAnnotation) {
            // If theres an Annotation Widget in the Form Object, put the
            // Reference in the /Annot array
            createAnnotationReference.call(scope, formObject);
          }
        }
      }
    };

    var putForm = function putForm(formObject) {
      if (scope.internal.acroformPlugin.printedOut) {
        scope.internal.acroformPlugin.printedOut = false;
        scope.internal.acroformPlugin.acroFormDictionaryRoot = null;
      }

      if (!scope.internal.acroformPlugin.acroFormDictionaryRoot) {
        initializeAcroForm.call(scope);
      }

      scope.internal.acroformPlugin.acroFormDictionaryRoot.Fields.push(formObject);
    };
    /**
     * Create the Reference to the widgetAnnotation, so that it gets referenced
     * in the Annot[] int the+ (Requires the Annotation Plugin)
     */


    var createAnnotationReference = function createAnnotationReference(object) {
      var options = {
        type: "reference",
        object: object
      };
      scope.annotationPlugin.annotations[scope.internal.getPageInfo(object.page).pageNumber].push(options);
    }; // Callbacks


    var putCatalogCallback = function putCatalogCallback() {
      // Put reference to AcroForm to DocumentCatalog
      if (typeof scope.internal.acroformPlugin.acroFormDictionaryRoot != "undefined") {
        // for safety, shouldn't normally be the case
        scope.internal.write("/AcroForm " + scope.internal.acroformPlugin.acroFormDictionaryRoot.objId + " " + 0 + " R");
      } else {
        console.log("Root missing...");
      }
    };
    /**
     * Adds /Acroform X 0 R to Document Catalog, and creates the AcroForm
     * Dictionary
     */


    var AcroFormDictionaryCallback = function AcroFormDictionaryCallback() {
      // Remove event
      scope.internal.events.unsubscribe(scope.internal.acroformPlugin.acroFormDictionaryRoot._eventID);
      delete scope.internal.acroformPlugin.acroFormDictionaryRoot._eventID;
      scope.internal.acroformPlugin.printedOut = true;
    };
    /**
     * Creates the single Fields and writes them into the Document
     *
     * If fieldArray is set, use the fields that are inside it instead of the
     * fields from the AcroRoot (for the FormXObjects...)
     */


    var createFieldCallback = function createFieldCallback(fieldArray) {
      var standardFields = !fieldArray;

      if (!fieldArray) {
        // in case there is no fieldArray specified, we want to print out
        // the Fields of the AcroForm
        // Print out Root
        scope.internal.newObjectDeferredBegin(scope.internal.acroformPlugin.acroFormDictionaryRoot.objId);
        scope.internal.out(scope.internal.acroformPlugin.acroFormDictionaryRoot.getString());
      }

      var fieldArray = fieldArray || scope.internal.acroformPlugin.acroFormDictionaryRoot.Kids;

      for (var i in fieldArray) {
        if (fieldArray.hasOwnProperty(i)) {
          var form = fieldArray[i];
          var oldRect = form.Rect;

          if (form.Rect) {
            form.Rect = calculateCoordinates.call(this, form.Rect);
          } // Start Writing the Object


          scope.internal.newObjectDeferredBegin(form.objId);
          var content = form.objId + " 0 obj\n<<\n";

          if (_typeof(form) === "object" && typeof form.getContent === "function") {
            content += form.getContent();
          }

          form.Rect = oldRect;

          if (form.hasAppearanceStream && !form.appearanceStreamContent) {
            // Calculate Appearance
            var appearance = calculateAppearanceStream.call(this, form);
            content += "/AP << /N " + appearance + " >>\n";
            scope.internal.acroformPlugin.xForms.push(appearance);
          } // Assume AppearanceStreamContent is a Array with N,R,D (at least
          // one of them!)


          if (form.appearanceStreamContent) {
            content += "/AP << "; // Iterate over N,R and D

            for (var k in form.appearanceStreamContent) {
              if (form.appearanceStreamContent.hasOwnProperty(k)) {
                var value = form.appearanceStreamContent[k];
                content += "/" + k + " ";
                content += "<< ";

                if (Object.keys(value).length >= 1 || Array.isArray(value)) {
                  // appearanceStream is an Array or Object!
                  for (var i in value) {
                    if (value.hasOwnProperty(i)) {
                      var obj = value[i];

                      if (typeof obj === "function") {
                        // if Function is referenced, call it in order
                        // to get the FormXObject
                        obj = obj.call(this, form);
                      }

                      content += "/" + i + " " + obj + " "; // In case the XForm is already used, e.g. OffState
                      // of CheckBoxes, don't add it

                      if (!(scope.internal.acroformPlugin.xForms.indexOf(obj) >= 0)) scope.internal.acroformPlugin.xForms.push(obj);
                    }
                  }
                } else {
                  var obj = value;

                  if (typeof obj === "function") {
                    // if Function is referenced, call it in order to
                    // get the FormXObject
                    obj = obj.call(this, form);
                  }

                  content += "/" + i + " " + obj + " \n";
                  if (!(scope.internal.acroformPlugin.xForms.indexOf(obj) >= 0)) scope.internal.acroformPlugin.xForms.push(obj);
                }

                content += " >>\n";
              }
            } // appearance stream is a normal Object..


            content += ">>\n";
          }

          content += ">>\nendobj\n";
          scope.internal.out(content);
        }
      }

      if (standardFields) {
        createXFormObjectCallback.call(this, scope.internal.acroformPlugin.xForms);
      }
    };

    var createXFormObjectCallback = function createXFormObjectCallback(fieldArray) {
      for (var i in fieldArray) {
        if (fieldArray.hasOwnProperty(i)) {
          var key = i;
          var form = fieldArray[i]; // Start Writing the Object

          scope.internal.newObjectDeferredBegin(form && form.objId);
          var content = "";

          if (_typeof(form) === "object" && typeof form.getString === "function") {
            content = form.getString();
          }

          scope.internal.out(content);
          delete fieldArray[key];
        }
      }
    };

    var initializeAcroForm = function initializeAcroForm() {
      if (this.internal !== undefined && (this.internal.acroformPlugin === undefined || this.internal.acroformPlugin.isInitialized === false)) {
        scope = this;
        AcroFormField.FieldNum = 0;
        this.internal.acroformPlugin = JSON.parse(JSON.stringify(acroformPluginTemplate));

        if (this.internal.acroformPlugin.acroFormDictionaryRoot) {
          // return;
          throw new Error("Exception while creating AcroformDictionary");
        }

        scaleFactor = scope.internal.scaleFactor;
        pageHeight = scope.internal.pageSize.getHeight(); // The Object Number of the AcroForm Dictionary

        scope.internal.acroformPlugin.acroFormDictionaryRoot = new AcroFormDictionary(); // add Callback for creating the AcroForm Dictionary

        scope.internal.acroformPlugin.acroFormDictionaryRoot._eventID = scope.internal.events.subscribe("postPutResources", AcroFormDictionaryCallback);
        scope.internal.events.subscribe("buildDocument", annotReferenceCallback); // buildDocument
        // Register event, that is triggered when the DocumentCatalog is
        // written, in order to add /AcroForm

        scope.internal.events.subscribe("putCatalog", putCatalogCallback); // Register event, that creates all Fields

        scope.internal.events.subscribe("postPutPages", createFieldCallback);
        scope.internal.acroformPlugin.isInitialized = true;
      }
    };

    var arrayToPdfArray = function arrayToPdfArray(array) {
      if (Array.isArray(array)) {
        var content = " [";

        for (var i in array) {
          if (array.hasOwnProperty(i)) {
            var element = array[i].toString();
            content += element;
            content += i < array.length - 1 ? " " : "";
          }
        }

        content += "]";
        return content;
      }
    };

    var toPdfString = function toPdfString(string) {
      string = string || ""; // put Bracket at the Beginning of the String

      if (string.indexOf("(") !== 0) {
        string = "(" + string;
      }

      if (string.substring(string.length - 1) != ")") {
        string += ")";
      }

      return string;
    }; // ##########################
    // Classes
    // ##########################


    var AcroFormPDFObject = function AcroFormPDFObject() {
      // The Object ID in the PDF Object Model
      // todo
      var _objId;

      Object.defineProperty(this, "objId", {
        get: function get() {
          if (!_objId) {
            _objId = scope.internal.newObjectDeferred();
          }

          if (!_objId) {
            console.log("Couldn't create Object ID");
          }

          return _objId;
        },
        configurable: false
      });
    };

    AcroFormPDFObject.prototype.toString = function () {
      return this.objId + " 0 R";
    };

    AcroFormPDFObject.prototype.getString = function () {
      var res = this.objId + " 0 obj\n<<";
      var content = this.getContent();
      res += content + ">>\n";

      if (this.stream) {
        res += "stream\n";
        res += this.stream;
        res += "\nendstream\n";
      }

      res += "endobj\n";
      return res;
    };

    AcroFormPDFObject.prototype.getContent = function () {
      /**
       * Prints out all enumerable Variables from the Object
       *
       * @param fieldObject
       * @returns {string}
       */
      var createContentFromFieldObject = function createContentFromFieldObject(fieldObject) {
        var content = "";
        var keys = Object.keys(fieldObject).filter(function (key) {
          return key != "content" && key != "appearanceStreamContent" && key.substring(0, 1) != "_";
        });

        for (var i in keys) {
          if (keys.hasOwnProperty(i)) {
            var key = keys[i];
            var value = fieldObject[key];
            /*
            * if (key == 'Rect' && value) { value =
            * AcroForm.internal.calculateCoordinates.call(jsPDF.API.acroformPlugin.internal,
            * value); }
            */

            if (value) {
              if (Array.isArray(value)) {
                content += "/" + key + " " + arrayToPdfArray(value) + "\n";
              } else if (value instanceof AcroFormPDFObject) {
                // In case it is a reference to another PDFObject,
                // take the referennce number
                content += "/" + key + " " + value.objId + " 0 R" + "\n";
              } else {
                content += "/" + key + " " + value + "\n";
              }
            }
          }
        }

        return content;
      };

      var object = "";
      object += createContentFromFieldObject(this);
      return object;
    };

    var AcroFormXObject = function AcroFormXObject() {
      AcroFormPDFObject.call(this);
      this.Type = "/XObject";
      this.Subtype = "/Form";
      this.FormType = 1;
      this.BBox;
      this.Matrix;
      this.Resources = "2 0 R";
      this.PieceInfo;

      var _stream;

      Object.defineProperty(this, "Length", {
        enumerable: true,
        get: function get() {
          return _stream !== undefined ? _stream.length : 0;
        }
      });
      Object.defineProperty(this, "stream", {
        enumerable: false,
        set: function set(val) {
          _stream = val.trim();
        },
        get: function get() {
          if (_stream) {
            return _stream;
          } else {
            return null;
          }
        }
      });
    };

    inherit(AcroFormXObject, AcroFormPDFObject); // ##### The Objects, the User can Create:

    var AcroFormDictionary = function AcroFormDictionary() {
      AcroFormPDFObject.call(this);
      var _Kids = [];
      Object.defineProperty(this, "Kids", {
        enumerable: false,
        configurable: true,
        get: function get() {
          if (_Kids.length > 0) {
            return _Kids;
          } else {
            return;
          }
        }
      });
      Object.defineProperty(this, "Fields", {
        enumerable: true,
        configurable: true,
        get: function get() {
          return _Kids;
        }
      }); // Default Appearance

      this.DA;
    };

    inherit(AcroFormDictionary, AcroFormPDFObject); // The Field Object contains the Variables, that every Field needs
    // Rectangle for Appearance: lower_left_X, lower_left_Y, width, height

    var AcroFormField = function AcroFormField() {

      AcroFormPDFObject.call(this);
      var _Rect = null;
      Object.defineProperty(this, "Rect", {
        enumerable: true,
        configurable: false,
        get: function get() {
          if (!_Rect) {
            return;
          }

          var tmp = _Rect; // var calculatedRes =
          // AcroForm.internal.calculateCoordinates(_Rect); // do
          // later!

          return tmp;
        },
        set: function set(val) {
          _Rect = val;
        }
      });
      var _FT = "";
      Object.defineProperty(this, "FT", {
        enumerable: true,
        set: function set(val) {
          _FT = val;
        },
        get: function get() {
          return _FT;
        }
      });
      var _F = 4;
      Object.defineProperty(this, "F", {
        enumerable: true,
        set: function set(val) {
          _F = val;
        },
        get: function get() {
          return _F;
        }
      });
      /**
       * The Partial name of the Field Object. It has to be unique.
       */

      var _T = null;
      Object.defineProperty(this, "T", {
        enumerable: true,
        configurable: false,
        set: function set(val) {
          _T = val;
        },
        get: function get() {
          if (!_T || _T.length < 1) {
            if (this instanceof AcroFormChildClass) {
              // In case of a Child from a Radio´Group, you don't
              // need a FieldName!!!
              return;
            }

            return "(FieldObject" + AcroFormField.FieldNum++ + ")";
          }

          if (_T.substring(0, 1) == "(" && _T.substring(_T.length - 1)) {
            return _T;
          }

          return "(" + _T + ")";
        }
      });
      var _DA = null; // Defines the default appearance (Needed for variable Text)

      Object.defineProperty(this, "DA", {
        enumerable: true,
        get: function get() {
          if (!_DA) {
            return;
          }

          return "(" + _DA + ")";
        },
        set: function set(val) {
          _DA = val;
        }
      });
      var _DV = null; // Defines the default value

      Object.defineProperty(this, "DV", {
        enumerable: true,
        configurable: true,
        get: function get() {
          if (!_DV) {
            return;
          }

          return _DV;
        },
        set: function set(val) {
          _DV = val;
        }
      });
      var _V = null; // Defines the default value

      Object.defineProperty(this, "V", {
        enumerable: true,
        configurable: true,
        get: function get() {
          if (!_V) {
            return;
          }

          return _V;
        },
        set: function set(val) {
          _V = val;
        }
      }); // this.Type = "/Annot";
      // this.Subtype = "/Widget";

      Object.defineProperty(this, "Type", {
        enumerable: true,
        get: function get() {
          return this.hasAnnotation ? "/Annot" : null;
        }
      });
      Object.defineProperty(this, "Subtype", {
        enumerable: true,
        get: function get() {
          return this.hasAnnotation ? "/Widget" : null;
        }
      });
      /**
       *
       * @type {Array}
       */

      this.BG;
      Object.defineProperty(this, "hasAnnotation", {
        enumerable: false,
        get: function get() {
          if (this.Rect || this.BC || this.BG) {
            return true;
          }

          return false;
        }
      });
      Object.defineProperty(this, "hasAppearanceStream", {
        enumerable: false,
        configurable: true,
        writable: true
      });
      Object.defineProperty(this, "page", {
        enumerable: false,
        configurable: true,
        writable: true
      });
    };

    inherit(AcroFormField, AcroFormPDFObject);

    var AcroFormChoiceField = function AcroFormChoiceField() {
      AcroFormField.call(this); // Field Type = Choice Field

      this.FT = "/Ch"; // options

      this.Opt = [];
      this.V = "()"; // Top Index

      this.TI = 0;
      /**
       * Defines, whether the
       *
       * @type {boolean}
       */

      var _combo = false;
      Object.defineProperty(this, "combo", {
        enumerable: false,
        get: function get() {
          return _combo;
        },
        set: function set(val) {
          _combo = val;
        }
      });
      /**
       * Defines, whether the Choice Field is an Edit Field. An Edit Field
       * is automatically an Combo Field.
       */

      Object.defineProperty(this, "edit", {
        enumerable: true,
        set: function set(val) {
          if (val == true) {
            this._edit = true; // ComboBox has to be true

            this.combo = true;
          } else {
            this._edit = false;
          }
        },
        get: function get() {
          if (!this._edit) {
            return false;
          }

          return this._edit;
        },
        configurable: false
      });
      this.hasAppearanceStream = true;
    };

    inherit(AcroFormChoiceField, AcroFormField);

    var AcroFormListBox = function AcroFormListBox() {
      AcroFormChoiceField.call(this);
      this.combo = false;
    };

    inherit(AcroFormListBox, AcroFormChoiceField);

    var AcroFormComboBox = function AcroFormComboBox() {
      AcroFormListBox.call(this);
      this.combo = true;
    };

    inherit(AcroFormComboBox, AcroFormListBox);

    var AcroFormEditBox = function AcroFormEditBox() {
      AcroFormComboBox.call(this);
      this.edit = true;
    };

    inherit(AcroFormEditBox, AcroFormComboBox);

    var AcroFormButton = function AcroFormButton() {
      AcroFormField.call(this);
      this.FT = "/Btn"; // this.hasAnnotation = true;
    };

    inherit(AcroFormButton, AcroFormField);

    var AcroFormPushButton = function AcroFormPushButton() {
      AcroFormButton.call(this);
      var _pushbutton = true;
      Object.defineProperty(this, "pushbutton", {
        enumerable: false,
        get: function get() {
          return _pushbutton;
        },
        set: function set(val) {
          _pushbutton = val;
        }
      });
    };

    inherit(AcroFormPushButton, AcroFormButton);

    var AcroFormRadioButton = function AcroFormRadioButton() {
      AcroFormButton.call(this);
      var _radio = true;
      Object.defineProperty(this, "radio", {
        enumerable: false,
        get: function get() {
          return _radio;
        },
        set: function set(val) {
          _radio = val;
        }
      });
      var _Kids = [];
      Object.defineProperty(this, "Kids", {
        enumerable: true,
        get: function get() {
          if (_Kids.length > 0) {
            return _Kids;
          }
        }
      });
      Object.defineProperty(this, "__Kids", {
        get: function get() {
          return _Kids;
        }
      });

      var _noToggleToOff;

      Object.defineProperty(this, "noToggleToOff", {
        enumerable: false,
        get: function get() {
          return _noToggleToOff;
        },
        set: function set(val) {
          _noToggleToOff = val;
        }
      }); // this.hasAnnotation = false;
    };

    inherit(AcroFormRadioButton, AcroFormButton);
    /*
      * The Child classs of a RadioButton (the radioGroup) -> The single
      * Buttons
      */

    var AcroFormChildClass = function AcroFormChildClass(parent, name) {
      AcroFormField.call(this);
      this.Parent = parent; // todo: set AppearanceType as variable that can be set from the
      // outside...

      this._AppearanceType = AcroFormAppearance.RadioButton.Circle; // The Default appearanceType is the Circle

      this.appearanceStreamContent = this._AppearanceType.createAppearanceStream(name); // Set Print in the Annot Flag

      this.F = setBitPosition(this.F, 3, 1); // Set AppearanceCharacteristicsDictionary with default appearance
      // if field is not interacting with user

      this.MK = this._AppearanceType.createMK(); // (8) -> Cross, (1)->  Circle, ()-> nothing
      // Default Appearance is Off

      this.AS = "/Off"; // + name;

      this._Name = name;
    };

    inherit(AcroFormChildClass, AcroFormField);

    AcroFormRadioButton.prototype.setAppearance = function (appearance) {
      if (!("createAppearanceStream" in appearance && "createMK" in appearance)) {
        console.log("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");
        return;
      }

      for (var i in this.__Kids) {
        if (this.__Kids.hasOwnProperty(i)) {
          var child = this.__Kids[i];
          child.appearanceStreamContent = appearance.createAppearanceStream(child._Name);
          child.MK = appearance.createMK();
        }
      }
    };

    AcroFormRadioButton.prototype.createOption = function (name) {
      var parent = this;
      var kidCount = this.__Kids.length; // Create new Child for RadioGroup

      var child = new AcroFormChildClass(parent, name); // Add to Parent

      this.__Kids.push(child);

      jsPDFAPI.addField(child);
      return child;
    };
    /**
     * @name AcroFormCheckBox
     *
     * @memberOf AcroForm
     * @function
     */


    var AcroFormCheckBox = function AcroFormCheckBox() {
      AcroFormButton.call(this);
      this.appearanceStreamContent = AcroFormAppearance.CheckBox.createAppearanceStream();
      this.MK = AcroFormAppearance.CheckBox.createMK();
      this.AS = "/On";
      this.V = "/On";
    };

    inherit(AcroFormCheckBox, AcroFormButton);

    var AcroFormTextField = function AcroFormTextField() {
      AcroFormField.call(this);
      this.DA = AcroFormAppearance.createDefaultAppearanceStream();
      this.F = 4;

      var _V;

      Object.defineProperty(this, "V", {
        get: function get() {
          if (_V) {
            return toPdfString(_V);
          } else {
            return _V;
          }
        },
        enumerable: true,
        set: function set(val) {
          _V = val;
        }
      });

      var _DV;

      Object.defineProperty(this, "DV", {
        get: function get() {
          if (_DV) {
            return toPdfString(_DV);
          } else {
            return _DV;
          }
        },
        enumerable: true,
        set: function set(val) {
          _DV = val;
        }
      });
      var _multiline = false;
      Object.defineProperty(this, "multiline", {
        enumerable: false,
        get: function get() {
          return _multiline;
        },
        set: function set(val) {
          _multiline = val;
        }
      });
      /**
       * For PDF 1.4
       *
       * @type {boolean}
       */

      var _fileSelect = false;
      Object.defineProperty(this, "fileSelect", {
        enumerable: false,
        get: function get() {
          return _fileSelect;
        },
        set: function set(val) {
          _fileSelect = val;
        }
      });
      /**
       * For PDF 1.4
       *
       * @type {boolean}
       */

      var _doNotSpellCheck = false;
      Object.defineProperty(this, "doNotSpellCheck", {
        enumerable: false,
        get: function get() {
          return _doNotSpellCheck;
        },
        set: function set(val) {
          _doNotSpellCheck = val;
        }
      });
      /**
       * For PDF 1.4
       *
       * @type {boolean}
       */

      var _doNotScroll = false;
      Object.defineProperty(this, "doNotScroll", {
        enumerable: false,
        get: function get() {
          return _doNotScroll;
        },
        set: function set(val) {
          _doNotScroll = val;
        }
      });
      var _MaxLen = false;
      Object.defineProperty(this, "MaxLen", {
        enumerable: true,
        get: function get() {
          return _MaxLen;
        },
        set: function set(val) {
          _MaxLen = val;
        }
      });
      Object.defineProperty(this, "hasAppearanceStream", {
        enumerable: false,
        get: function get() {
          return this.V || this.DV;
        }
      });
    };

    inherit(AcroFormTextField, AcroFormField);

    var AcroFormPasswordField = function AcroFormPasswordField() {
      AcroFormTextField.call(this);
      var _password = true;
      Object.defineProperty(this, "password", {
        enumerable: false,
        get: function get() {
          return _password;
        },
        set: function set(val) {
          _password = val;
        }
      });
    };

    inherit(AcroFormPasswordField, AcroFormTextField); // Contains Methods for creating standard appearances

    var AcroFormAppearance = {
      CheckBox: {
        createAppearanceStream: function createAppearanceStream() {
          var appearance = {
            N: {
              On: AcroFormAppearance.CheckBox.YesNormal
            },
            D: {
              On: AcroFormAppearance.CheckBox.YesPushDown,
              Off: AcroFormAppearance.CheckBox.OffPushDown
            }
          };
          return appearance;
        },

        /**
         * If any other icons are needed, the number between the
         * brackets can be changed
         *
         * @returns {string}
         */
        createMK: function createMK() {
          return "<< /CA (3)>>";
        },

        /**
         * Returns the standard On Appearance for a CheckBox
         *
         * @returns {AcroFormXObject}
         */
        YesPushDown: function YesPushDown(formObject) {
          var xobj = createFormXObject(formObject);
          var stream = [];
          var zapfDingbatsId = scope.internal.getFont("zapfdingbats", "normal").id;
          formObject.Q = 1; // set text-alignment as centered

          var calcRes = calculateX(formObject, "3", "ZapfDingbats", 50);
          stream.push("0.749023 g");
          stream.push("0 0 " + AcroFormAppearance.internal.getWidth(formObject).toFixed(2) + " " + AcroFormAppearance.internal.getHeight(formObject).toFixed(2) + " re");
          stream.push("f");
          stream.push("BMC");
          stream.push("q");
          stream.push("0 0 1 rg");
          stream.push("/" + zapfDingbatsId + " " + calcRes.fontSize.toFixed(2) + " Tf 0 g");
          stream.push("BT");
          stream.push(calcRes.text);
          stream.push("ET");
          stream.push("Q");
          stream.push("EMC");
          xobj.stream = stream.join("\n");
          return xobj;
        },
        YesNormal: function YesNormal(formObject) {
          var xobj = createFormXObject(formObject);
          var zapfDingbatsId = scope.internal.getFont("zapfdingbats", "normal").id;
          var stream = [];
          formObject.Q = 1; // set text-alignment as centered

          var height = AcroFormAppearance.internal.getHeight(formObject);
          var width = AcroFormAppearance.internal.getWidth(formObject);
          var calcRes = calculateX(formObject, "3", "ZapfDingbats", height * 0.9);
          stream.push("1 g");
          stream.push("0 0 " + width.toFixed(2) + " " + height.toFixed(2) + " re");
          stream.push("f");
          stream.push("q");
          stream.push("0 0 1 rg");
          stream.push("0 0 " + (width - 1).toFixed(2) + " " + (height - 1).toFixed(2) + " re");
          stream.push("W");
          stream.push("n");
          stream.push("0 g");
          stream.push("BT");
          stream.push("/" + zapfDingbatsId + " " + calcRes.fontSize.toFixed(2) + " Tf 0 g");
          stream.push(calcRes.text);
          stream.push("ET");
          stream.push("Q");
          xobj.stream = stream.join("\n");
          return xobj;
        },

        /**
         * Returns the standard Off Appearance for a CheckBox
         *
         * @returns {AcroFormXObject}
         */
        OffPushDown: function OffPushDown(formObject) {
          var xobj = createFormXObject(formObject);
          var stream = [];
          stream.push("0.749023 g");
          stream.push("0 0 " + AcroFormAppearance.internal.getWidth(formObject).toFixed(2) + " " + AcroFormAppearance.internal.getHeight(formObject).toFixed(2) + " re");
          stream.push("f");
          xobj.stream = stream.join("\n");
          return xobj;
        }
      },
      RadioButton: {
        Circle: {
          createAppearanceStream: function createAppearanceStream(name) {
            var appearanceStreamContent = {
              D: {
                Off: AcroFormAppearance.RadioButton.Circle.OffPushDown
              },
              N: {}
            };
            appearanceStreamContent.N[name] = AcroFormAppearance.RadioButton.Circle.YesNormal;
            appearanceStreamContent.D[name] = AcroFormAppearance.RadioButton.Circle.YesPushDown;
            return appearanceStreamContent;
          },
          createMK: function createMK() {
            return "<< /CA (l)>>";
          },
          YesNormal: function YesNormal(formObject) {
            var xobj = createFormXObject(formObject);
            var stream = []; // Make the Radius of the Circle relative to min(height,
            // width) of formObject

            var DotRadius = AcroFormAppearance.internal.getWidth(formObject) <= AcroFormAppearance.internal.getHeight(formObject) ? AcroFormAppearance.internal.getWidth(formObject) / 4 : AcroFormAppearance.internal.getHeight(formObject) / 4; // The Borderpadding...

            DotRadius *= 0.9;
            var c = AcroFormAppearance.internal.Bezier_C;
            /*
              * The Following is a Circle created with Bezier-Curves.
              */

            stream.push("q");
            stream.push("1 0 0 1 " + AcroFormAppearance.internal.getWidth(formObject) / 2 + " " + AcroFormAppearance.internal.getHeight(formObject) / 2 + " cm");
            stream.push(DotRadius + " 0 m");
            stream.push(DotRadius + " " + DotRadius * c + " " + DotRadius * c + " " + DotRadius + " 0 " + DotRadius + " c");
            stream.push("-" + DotRadius * c + " " + DotRadius + " -" + DotRadius + " " + DotRadius * c + " -" + DotRadius + " 0 c");
            stream.push("-" + DotRadius + " -" + DotRadius * c + " -" + DotRadius * c + " -" + DotRadius + " 0 -" + DotRadius + " c");
            stream.push(DotRadius * c + " -" + DotRadius + " " + DotRadius + " -" + DotRadius * c + " " + DotRadius + " 0 c");
            stream.push("f");
            stream.push("Q");
            xobj.stream = stream.join("\n");
            return xobj;
          },
          YesPushDown: function YesPushDown(formObject) {
            var xobj = createFormXObject(formObject);
            var stream = [];
            var DotRadius = AcroFormAppearance.internal.getWidth(formObject) <= AcroFormAppearance.internal.getHeight(formObject) ? AcroFormAppearance.internal.getWidth(formObject) / 4 : AcroFormAppearance.internal.getHeight(formObject) / 4; // The Borderpadding...

            DotRadius *= 0.9; // Save results for later use; no need to waste
            // processor ticks on doing math

            var k = DotRadius * 2; // var c = AcroFormAppearance.internal.Bezier_C;

            var kc = k * AcroFormAppearance.internal.Bezier_C;
            var dc = DotRadius * AcroFormAppearance.internal.Bezier_C;
            stream.push("0.749023 g");
            stream.push("q");
            stream.push("1 0 0 1 " + (AcroFormAppearance.internal.getWidth(formObject) / 2).toFixed(2) + " " + (AcroFormAppearance.internal.getHeight(formObject) / 2).toFixed(2) + " cm");
            stream.push(k + " 0 m");
            stream.push(k + " " + kc + " " + kc + " " + k + " 0 " + k + " c");
            stream.push("-" + kc + " " + k + " -" + k + " " + kc + " -" + k + " 0 c");
            stream.push("-" + k + " -" + kc + " -" + kc + " -" + k + " 0 -" + k + " c");
            stream.push(kc + " -" + k + " " + k + " -" + kc + " " + k + " 0 c");
            stream.push("f");
            stream.push("Q");
            stream.push("0 g");
            stream.push("q");
            stream.push("1 0 0 1 " + (AcroFormAppearance.internal.getWidth(formObject) / 2).toFixed(2) + " " + (AcroFormAppearance.internal.getHeight(formObject) / 2).toFixed(2) + " cm");
            stream.push(DotRadius + " 0 m");
            stream.push("" + DotRadius + " " + dc + " " + dc + " " + DotRadius + " 0 " + DotRadius + " c");
            stream.push("-" + dc + " " + DotRadius + " -" + DotRadius + " " + dc + " -" + DotRadius + " 0 c");
            stream.push("-" + DotRadius + " -" + dc + " -" + dc + " -" + DotRadius + " 0 -" + DotRadius + " c");
            stream.push(dc + " -" + DotRadius + " " + DotRadius + " -" + dc + " " + DotRadius + " 0 c");
            stream.push("f");
            stream.push("Q");
            xobj.stream = stream.join("\n");
            return xobj;
          },
          OffPushDown: function OffPushDown(formObject) {
            var xobj = createFormXObject(formObject);
            var stream = [];
            var DotRadius = AcroFormAppearance.internal.getWidth(formObject) <= AcroFormAppearance.internal.getHeight(formObject) ? AcroFormAppearance.internal.getWidth(formObject) / 4 : AcroFormAppearance.internal.getHeight(formObject) / 4; // The Borderpadding...

            DotRadius *= 0.9; // Save results for later use; no need to waste
            // processor ticks on doing math

            var k = DotRadius * 2; // var c = AcroFormAppearance.internal.Bezier_C;

            var kc = k * AcroFormAppearance.internal.Bezier_C;
            stream.push("0.749023 g");
            stream.push("q");
            stream.push("1 0 0 1 " + (AcroFormAppearance.internal.getWidth(formObject) / 2).toFixed(2) + " " + (AcroFormAppearance.internal.getHeight(formObject) / 2).toFixed(2) + " cm");
            stream.push(k + " 0 m");
            stream.push(k + " " + kc + " " + kc + " " + k + " 0 " + k + " c");
            stream.push("-" + kc + " " + k + " -" + k + " " + kc + " -" + k + " 0 c");
            stream.push("-" + k + " -" + kc + " -" + kc + " -" + k + " 0 -" + k + " c");
            stream.push(kc + " -" + k + " " + k + " -" + kc + " " + k + " 0 c");
            stream.push("f");
            stream.push("Q");
            xobj.stream = stream.join("\n");
            return xobj;
          }
        },
        Cross: {
          /**
           * Creates the Actual AppearanceDictionary-References
           *
           * @param {string} name
           * @returns {Object}
           * @ignore
           */
          createAppearanceStream: function createAppearanceStream(name) {
            var appearanceStreamContent = {
              D: {
                Off: AcroFormAppearance.RadioButton.Cross.OffPushDown
              },
              N: {}
            };
            appearanceStreamContent.N[name] = AcroFormAppearance.RadioButton.Cross.YesNormal;
            appearanceStreamContent.D[name] = AcroFormAppearance.RadioButton.Cross.YesPushDown;
            return appearanceStreamContent;
          },
          createMK: function createMK() {
            return "<< /CA (8)>>";
          },
          YesNormal: function YesNormal(formObject) {
            var xobj = createFormXObject(formObject);
            var stream = [];
            var cross = AcroFormAppearance.internal.calculateCross(formObject);
            stream.push("q");
            stream.push("1 1 " + (AcroFormAppearance.internal.getWidth(formObject) - 2).toFixed(2) + " " + (AcroFormAppearance.internal.getHeight(formObject) - 2).toFixed(2) + " re");
            stream.push("W");
            stream.push("n");
            stream.push(cross.x1.x.toFixed(2) + " " + cross.x1.y.toFixed(2) + " m");
            stream.push(cross.x2.x.toFixed(2) + " " + cross.x2.y.toFixed(2) + " l");
            stream.push(cross.x4.x.toFixed(2) + " " + cross.x4.y.toFixed(2) + " m");
            stream.push(cross.x3.x.toFixed(2) + " " + cross.x3.y.toFixed(2) + " l");
            stream.push("s");
            stream.push("Q");
            xobj.stream = stream.join("\n");
            return xobj;
          },
          YesPushDown: function YesPushDown(formObject) {
            var xobj = createFormXObject(formObject);
            var cross = AcroFormAppearance.internal.calculateCross(formObject);
            var stream = [];
            stream.push("0.749023 g");
            stream.push("0 0 " + AcroFormAppearance.internal.getWidth(formObject).toFixed(2) + " " + AcroFormAppearance.internal.getHeight(formObject).toFixed(2) + " re");
            stream.push("f");
            stream.push("q");
            stream.push("1 1 " + (AcroFormAppearance.internal.getWidth(formObject) - 2).toFixed(2) + " " + (AcroFormAppearance.internal.getHeight(formObject) - 2).toFixed(2) + " re");
            stream.push("W");
            stream.push("n");
            stream.push(cross.x1.x.toFixed(2) + " " + cross.x1.y.toFixed(2) + " m");
            stream.push(cross.x2.x.toFixed(2) + " " + cross.x2.y.toFixed(2) + " l");
            stream.push(cross.x4.x.toFixed(2) + " " + cross.x4.y.toFixed(2) + " m");
            stream.push(cross.x3.x.toFixed(2) + " " + cross.x3.y.toFixed(2) + " l");
            stream.push("s");
            stream.push("Q");
            xobj.stream = stream.join("\n");
            return xobj;
          },
          OffPushDown: function OffPushDown(formObject) {
            var xobj = createFormXObject(formObject);
            var stream = [];
            stream.push("0.749023 g");
            stream.push("0 0 " + AcroFormAppearance.internal.getWidth(formObject).toFixed(2) + " " + AcroFormAppearance.internal.getHeight(formObject).toFixed(2) + " re");
            stream.push("f");
            xobj.stream = stream.join("\n");
            return xobj;
          }
        }
      },

      /**
       * Returns the standard Appearance
       *
       * @returns {AcroFormXObject}
       */
      createDefaultAppearanceStream: function createDefaultAppearanceStream(formObject) {
        // Set Helvetica to Standard Font (size: auto)
        // Color: Black
        return "/F1 0 Tf 0 g";
      }
    };
    AcroFormAppearance.internal = {
      Bezier_C: 0.551915024494,
      calculateCross: function calculateCross(formObject) {
        var min = function min(x, y) {
          return x > y ? y : x;
        };

        var width = AcroFormAppearance.internal.getWidth(formObject);
        var height = AcroFormAppearance.internal.getHeight(formObject);
        var a = min(width, height);

        var cross = {
          x1: {
            // upperLeft
            x: (width - a) / 2,
            y: (height - a) / 2 + a // height - borderPadding

          },
          x2: {
            // lowerRight
            x: (width - a) / 2 + a,
            y: (height - a) / 2 // borderPadding

          },
          x3: {
            // lowerLeft
            x: (width - a) / 2,
            y: (height - a) / 2 // borderPadding

          },
          x4: {
            // upperRight
            x: (width - a) / 2 + a,
            y: (height - a) / 2 + a // height - borderPadding

          }
        };
        return cross;
      }
    };

    AcroFormAppearance.internal.getWidth = function (formObject) {
      var result = 0;

      if (_typeof(formObject) === "object") {
        result = scale(formObject.Rect[2]); // (formObject.Rect[2] -
        // formObject.Rect[0]) || 0;
      }

      return result;
    };

    AcroFormAppearance.internal.getHeight = function (formObject) {
      var result = 0;

      if (_typeof(formObject) === "object") {
        result = scale(formObject.Rect[3]); // (formObject.Rect[1] -
        // formObject.Rect[3]) || 0;
      }

      return result;
    }; // Public:

    /**
     * Add an AcroForm-Field to the {jsPDF}-instance
     *
     * @memberOf AcroForm
     * @name addField
     * @param {Object} fieldObject
     * @returns {jsPDF}
     */


    jsPDFAPI.addField = function (fieldObject) {
      initializeAcroForm.call(this); // var opt = parseOptions(fieldObject);

      if (fieldObject instanceof AcroFormTextField) {
        this.addTextField.call(this, fieldObject);
      } else if (fieldObject instanceof AcroFormChoiceField) {
        this.addChoiceField.call(this, fieldObject);
      } else if (fieldObject instanceof AcroFormButton) {
        this.addButton.call(this, fieldObject);
      } else if (fieldObject instanceof AcroFormChildClass) {
        putForm.call(this, fieldObject);
      } else if (fieldObject) {
        // try to put..
        putForm.call(this, fieldObject);
      }

      fieldObject.page = scope.internal.getCurrentPageInfo().pageNumber;
      return this;
    };
    /**
     * @name addButton
     * @param {AcroFormButton}
     * @memberOf AcroForm
     */


    jsPDFAPI.addButton = function (opts) {
      initializeAcroForm.call(this);
      var options = opts || new AcroFormField();
      options.FT = "/Btn";
      options.Ff = calculateFlagsOnOptions(options.Ff, opts, scope.internal.getPDFVersion());
      putForm.call(this, options);
    };

    jsPDFAPI.addTextField = function (opts) {
      initializeAcroForm.call(this);
      var options = opts || new AcroFormField();
      options.FT = "/Tx";
      options.Ff = calculateFlagsOnOptions(options.Ff, opts, scope.internal.getPDFVersion()); // Add field

      putForm.call(this, options);
    };

    jsPDFAPI.addChoiceField = function (opts) {
      initializeAcroForm.call(this);
      var options = opts || new AcroFormField();
      options.FT = "/Ch";
      options.Ff = calculateFlagsOnOptions(options.Ff, opts, scope.internal.getPDFVersion()); // options.hasAnnotation = true;
      // Add field

      putForm.call(this, options);
    };

    if (_typeof(globalObj) == "object") {
      globalObj["ChoiceField"] = AcroFormChoiceField;
      globalObj["ListBox"] = AcroFormListBox;
      globalObj["ComboBox"] = AcroFormComboBox;
      globalObj["EditBox"] = AcroFormEditBox;
      globalObj["Button"] = AcroFormButton;
      globalObj["PushButton"] = AcroFormPushButton;
      globalObj["RadioButton"] = AcroFormRadioButton;
      globalObj["CheckBox"] = AcroFormCheckBox;
      globalObj["TextField"] = AcroFormTextField;
      globalObj["PasswordField"] = AcroFormPasswordField; // backwardsCompatibility

      globalObj["AcroForm"] = {
        Appearance: AcroFormAppearance
      };
    }

    jsPDFAPI.AcroFormChoiceField = AcroFormChoiceField;
    jsPDFAPI.AcroFormListBox = AcroFormListBox;
    jsPDFAPI.AcroFormComboBox = AcroFormComboBox;
    jsPDFAPI.AcroFormEditBox = AcroFormEditBox;
    jsPDFAPI.AcroFormButton = AcroFormButton;
    jsPDFAPI.AcroFormPushButton = AcroFormPushButton;
    jsPDFAPI.AcroFormRadioButton = AcroFormRadioButton;
    jsPDFAPI.AcroFormCheckBox = AcroFormCheckBox;
    jsPDFAPI.AcroFormTextField = AcroFormTextField;
    jsPDFAPI.AcroFormPasswordField = AcroFormPasswordField;
    jsPDFAPI.AcroFormAppearance = AcroFormAppearance;
    jsPDFAPI.AcroForm = {
      ChoiceField: AcroFormChoiceField,
      ListBox: AcroFormListBox,
      ComboBox: AcroFormComboBox,
      EditBox: AcroFormEditBox,
      Button: AcroFormButton,
      PushButton: AcroFormPushButton,
      RadioButton: AcroFormRadioButton,
      CheckBox: AcroFormCheckBox,
      TextField: AcroFormTextField,
      PasswordField: AcroFormPasswordField,
      Appearance: AcroFormAppearance
    };
  })(jsPDF.API, typeof window !== "undefined" && window || typeof global !== "undefined" && global);

  /** @license
   * jsPDF addImage plugin
   * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
   *               2013 Chris Dowling, https://github.com/gingerchris
   *               2013 Trinh Ho, https://github.com/ineedfat
   *               2013 Edwin Alejandro Perez, https://github.com/eaparango
   *               2013 Norah Smith, https://github.com/burnburnrocket
   *               2014 Diego Casorran, https://github.com/diegocr
   *               2014 James Robb, https://github.com/jamesbrobb
   *
   * 
   */

  /**
   * @name addImage
   * @module
   */
  (function (jsPDFAPI) {

    var namespace = "addImage_";
    var imageFileTypeHeaders = {
      PNG: [[0x89, 0x50, 0x4e, 0x47]],
      TIFF: [[0x4d, 0x4d, 0x00, 0x2a], //Motorola
      [0x49, 0x49, 0x2a, 0x00] //Intel
      ],
      JPEG: [[0xff, 0xd8, 0xff, 0xe0, undefined, undefined, 0x4a, 0x46, 0x49, 0x46, 0x00], //JFIF
      [0xff, 0xd8, 0xff, 0xe1, undefined, undefined, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00] //Exif
      ],
      JPEG2000: [[0x00, 0x00, 0x00, 0x0c, 0x6a, 0x50, 0x20, 0x20]],
      GIF87a: [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61]],
      GIF89a: [[0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
      BMP: [[0x42, 0x4d], //BM - Windows 3.1x, 95, NT, ... etc.
      [0x42, 0x41], //BA - OS/2 struct bitmap array
      [0x43, 0x49], //CI - OS/2 struct color icon
      [0x43, 0x50], //CP - OS/2 const color pointer
      [0x49, 0x43], //IC - OS/2 struct icon
      [0x50, 0x54] //PT - OS/2 pointer
      ]
    };
    /**
     * Recognize filetype of Image by magic-bytes
     *
     * https://en.wikipedia.org/wiki/List_of_file_signatures
     *
     * @name getImageFileTypeByImageData
     * @public
     * @function
     * @param {string|arraybuffer} imageData imageData as base64 encoded DataUrl or arraybuffer
     * @param {string} format format of file if filetype-recognition fails, e.g. 'JPEG'
     *
     * @returns {string} filetype of Image
     */

    jsPDFAPI.getImageFileTypeByImageData = function (imageData, fallbackFormat) {
      fallbackFormat = fallbackFormat || "UNKNOWN";
      var i;
      var j;
      var result = "UNKNOWN";
      var headerSchemata;
      var compareResult;
      var fileType;

      if (jsPDFAPI.isArrayBufferView(imageData)) {
        imageData = jsPDFAPI.arrayBufferToBinaryString(imageData);
      }

      for (fileType in imageFileTypeHeaders) {
        headerSchemata = imageFileTypeHeaders[fileType];

        for (i = 0; i < headerSchemata.length; i += 1) {
          compareResult = true;

          for (j = 0; j < headerSchemata[i].length; j += 1) {
            if (headerSchemata[i][j] === undefined) {
              continue;
            }

            if (headerSchemata[i][j] !== imageData.charCodeAt(j)) {
              compareResult = false;
              break;
            }
          }

          if (compareResult === true) {
            result = fileType;
            break;
          }
        }
      }

      if (result === "UNKNOWN" && fallbackFormat !== "UNKNOWN") {
        console.warn('FileType of Image not recognized. Processing image as "' + fallbackFormat + '".');
        result = fallbackFormat;
      }

      return result;
    }; // Image functionality ported from pdf.js


    var putImage = function putImage(img) {
      var objectNumber = this.internal.newObject(),
          out = this.internal.write,
          putStream = this.internal.putStream;
      img["n"] = objectNumber;
      out("<</Type /XObject");
      out("/Subtype /Image");
      out("/Width " + img["w"]);
      out("/Height " + img["h"]);

      if (img["cs"] === this.color_spaces.INDEXED) {
        out("/ColorSpace [/Indexed /DeviceRGB " + ( // if an indexed png defines more than one colour with transparency, we've created a smask
        img["pal"].length / 3 - 1) + " " + ("smask" in img ? objectNumber + 2 : objectNumber + 1) + " 0 R]");
      } else {
        out("/ColorSpace /" + img["cs"]);

        if (img["cs"] === this.color_spaces.DEVICE_CMYK) {
          out("/Decode [1 0 1 0 1 0 1 0]");
        }
      }

      out("/BitsPerComponent " + img["bpc"]);

      if ("f" in img) {
        out("/Filter /" + img["f"]);
      }

      if ("dp" in img) {
        out("/DecodeParms <<" + img["dp"] + ">>");
      }

      if ("trns" in img && img["trns"].constructor == Array) {
        var trns = "",
            i = 0,
            len = img["trns"].length;

        for (; i < len; i++) {
          trns += img["trns"][i] + " " + img["trns"][i] + " ";
        }

        out("/Mask [" + trns + "]");
      }

      if ("smask" in img) {
        out("/SMask " + (objectNumber + 1) + " 0 R");
      }

      out("/Length " + img["data"].length + ">>");
      putStream(img["data"]);
      out("endobj"); // Soft mask

      if ("smask" in img) {
        var dp = "/Predictor " + img["p"] + " /Colors 1 /BitsPerComponent " + img["bpc"] + " /Columns " + img["w"];
        var smask = {
          w: img["w"],
          h: img["h"],
          cs: "DeviceGray",
          bpc: img["bpc"],
          dp: dp,
          data: img["smask"]
        };
        if ("f" in img) smask.f = img["f"];
        putImage.call(this, smask);
      } //Palette


      if (img["cs"] === this.color_spaces.INDEXED) {
        this.internal.newObject(); //out('<< /Filter / ' + img['f'] +' /Length ' + img['pal'].length + '>>');
        //putStream(zlib.compress(img['pal']));

        out("<< /Length " + img["pal"].length + ">>");
        putStream(this.arrayBufferToBinaryString(new Uint8Array(img["pal"])));
        out("endobj");
      }
    },
        putResourcesCallback = function putResourcesCallback() {
      var images = this.internal.collections[namespace + "images"];

      for (var i in images) {
        putImage.call(this, images[i]);
      }
    },
        putXObjectsDictCallback = function putXObjectsDictCallback() {
      var images = this.internal.collections[namespace + "images"],
          out = this.internal.write,
          image;

      for (var i in images) {
        image = images[i];
        out("/I" + image["i"], image["n"], "0", "R");
      }
    },
        checkCompressValue = function checkCompressValue(value) {
      if (value && typeof value === "string") value = value.toUpperCase();
      return value in jsPDFAPI.image_compression ? value : jsPDFAPI.image_compression.NONE;
    },
        getImages = function getImages() {
      var images = this.internal.collections[namespace + "images"]; //first run, so initialise stuff

      if (!images) {
        this.internal.collections[namespace + "images"] = images = {};
        this.internal.events.subscribe("putResources", putResourcesCallback);
        this.internal.events.subscribe("putXobjectDict", putXObjectsDictCallback);
      }

      return images;
    },
        getImageIndex = function getImageIndex(images) {
      var imageIndex = 0;

      if (images) {
        // this is NOT the first time this method is ran on this instance of jsPDF object.
        imageIndex = Object.keys ? Object.keys(images).length : function (o) {
          var i = 0;

          for (var e in o) {
            if (o.hasOwnProperty(e)) {
              i++;
            }
          }

          return i;
        }(images);
      }

      return imageIndex;
    },
        notDefined = function notDefined(value) {
      return typeof value === "undefined" || value === null || value.length === 0;
    },
        generateAliasFromData = function generateAliasFromData(data) {
      return typeof data === "string" && jsPDFAPI.sHashCode(data);
    },
        isImageTypeSupported = function isImageTypeSupported(type) {
      return typeof jsPDFAPI["process" + type.toUpperCase()] === "function";
    },
        isDOMElement = function isDOMElement(object) {
      return _typeof(object) === "object" && object.nodeType === 1;
    },
        createDataURIFromElement = function createDataURIFromElement(element, format) {
      //if element is an image which uses data url definition, just return the dataurl
      if (element.nodeName === "IMG" && element.hasAttribute("src")) {
        var src = "" + element.getAttribute("src");
        if (src.indexOf("data:image/") === 0) return unescape(src); // only if the user doesn't care about a format

        if (!format && /\.png(?:[?#].*)?$/i.test(src)) format = "png";
      }

      if (element.nodeName === "CANVAS") {
        var canvas = element;
      } else {
        var canvas = document.createElement("canvas");
        canvas.width = element.clientWidth || element.width;
        canvas.height = element.clientHeight || element.height;
        var ctx = canvas.getContext("2d");

        if (!ctx) {
          throw "addImage requires canvas to be supported by browser.";
        }

        ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
      }

      return canvas.toDataURL(("" + format).toLowerCase() == "png" ? "image/png" : "image/jpeg");
    },
        checkImagesForAlias = function checkImagesForAlias(alias, images) {
      var cached_info;

      if (images) {
        for (var e in images) {
          if (alias === images[e].alias) {
            cached_info = images[e];
            break;
          }
        }
      }

      return cached_info;
    },
        determineWidthAndHeight = function determineWidthAndHeight(w, h, info) {
      if (!w && !h) {
        w = -96;
        h = -96;
      }

      if (w < 0) {
        w = -1 * info["w"] * 72 / w / this.internal.scaleFactor;
      }

      if (h < 0) {
        h = -1 * info["h"] * 72 / h / this.internal.scaleFactor;
      }

      if (w === 0) {
        w = h * info["w"] / info["h"];
      }

      if (h === 0) {
        h = w * info["h"] / info["w"];
      }

      return [w, h];
    },
        writeImageToPDF = function writeImageToPDF(x, y, w, h, info, index, images, rotation) {
      var dims = determineWidthAndHeight.call(this, w, h, info),
          coord = this.internal.getCoordinateString,
          vcoord = this.internal.getVerticalCoordinateString;
      w = dims[0];
      h = dims[1];
      images[index] = info;

      if (rotation) {
        rotation *= Math.PI / 180;
        var c = Math.cos(rotation);
        var s = Math.sin(rotation); //like in pdf Reference do it 4 digits instead of 2

        var f4 = function f4(number) {
          return number.toFixed(4);
        };

        var rotationTransformationMatrix = [f4(c), f4(s), f4(s * -1), f4(c), 0, 0, "cm"];
      }

      this.internal.write("q"); //Save graphics state

      if (rotation) {
        this.internal.write([1, "0", "0", 1, coord(x), vcoord(y + h), "cm"].join(" ")); //Translate

        this.internal.write(rotationTransformationMatrix.join(" ")); //Rotate

        this.internal.write([coord(w), "0", "0", coord(h), "0", "0", "cm"].join(" ")); //Scale
      } else {
        this.internal.write([coord(w), "0", "0", coord(h), coord(x), vcoord(y + h), "cm"].join(" ")); //Translate and Scale
      }

      if (this.isAdvancedAPI()) {
        // draw image bottom up when in "advanced" API mode
        this.internal.write([1, 0, 0, -1, 0, 0, "cm"].join(" "));
      }

      this.internal.write("/I" + info["i"] + " Do"); //Paint Image

      this.internal.write("Q"); //Restore graphics state
    };
    /**
     * COLOR SPACES
     */


    jsPDFAPI.color_spaces = {
      DEVICE_RGB: "DeviceRGB",
      DEVICE_GRAY: "DeviceGray",
      DEVICE_CMYK: "DeviceCMYK",
      CAL_GREY: "CalGray",
      CAL_RGB: "CalRGB",
      LAB: "Lab",
      ICC_BASED: "ICCBased",
      INDEXED: "Indexed",
      PATTERN: "Pattern",
      SEPARATION: "Separation",
      DEVICE_N: "DeviceN"
    };
    /**
     * DECODE METHODS
     */

    jsPDFAPI.decode = {
      DCT_DECODE: "DCTDecode",
      FLATE_DECODE: "FlateDecode",
      LZW_DECODE: "LZWDecode",
      JPX_DECODE: "JPXDecode",
      JBIG2_DECODE: "JBIG2Decode",
      ASCII85_DECODE: "ASCII85Decode",
      ASCII_HEX_DECODE: "ASCIIHexDecode",
      RUN_LENGTH_DECODE: "RunLengthDecode",
      CCITT_FAX_DECODE: "CCITTFaxDecode"
    };
    /**
     * IMAGE COMPRESSION TYPES
     */

    jsPDFAPI.image_compression = {
      NONE: "NONE",
      FAST: "FAST",
      MEDIUM: "MEDIUM",
      SLOW: "SLOW"
    };
    /**
     * @name sHashCode
     * @function
     * @param {string} str
     * @returns {string}
     */

    jsPDFAPI.sHashCode = function (str) {
      str = str || "";
      return Array.prototype.reduce && str.split("").reduce(function (a, b) {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
    };
    /**
     * @name isString
     * @function
     * @param {any} object
     * @returns {boolean}
     */


    jsPDFAPI.isString = function (object) {
      return typeof object === "string";
    };
    /**
     * Validates if given String is a valid Base64-String
     *
     * @name validateStringAsBase64
     * @public
     * @function
     * @param {String} possible Base64-String
     *
     * @returns {boolean}
     */


    jsPDFAPI.validateStringAsBase64 = function (possibleBase64String) {
      possibleBase64String = possibleBase64String || "";
      var result = true;

      if (possibleBase64String.length % 4 !== 0) {
        result = false;
      }

      if (/[A-Za-z0-9\/]+/.test(possibleBase64String.substr(0, possibleBase64String.length - 2)) === false) {
        result = false;
      }

      if (/[A-Za-z0-9\/][A-Za-z0-9+\/]|[A-Za-z0-9+\/]=|==/.test(possibleBase64String.substr(-2)) === false) {
        result = false;
      }

      return result;
    };
    /**
     * Strips out and returns info from a valid base64 data URI
     *
     * @name extractInfoFromBase64DataURI
     * @function
     * @param {string} dataUrl a valid data URI of format 'data:[<MIME-type>][;base64],<data>'
     * @returns {Array}an Array containing the following
     * [0] the complete data URI
     * [1] <MIME-type>
     * [2] format - the second part of the mime-type i.e 'png' in 'image/png'
     * [4] <data>
     */


    jsPDFAPI.extractInfoFromBase64DataURI = function (dataURI) {
      return /^data:([\w]+?\/([\w]+?));\S*;*base64,(.+)$/g.exec(dataURI);
    };
    /**
     * Check to see if ArrayBuffer is supported
     *
     * @name supportsArrayBuffer
     * @function
     * @returns {boolean}
     */


    jsPDFAPI.supportsArrayBuffer = function () {
      return typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
    };
    /**
     * Tests supplied object to determine if ArrayBuffer
     *
     * @name isArrayBuffer
     * @function
     * @param {Object} object an Object
     *
     * @returns {boolean}
     */


    jsPDFAPI.isArrayBuffer = function (object) {
      if (!this.supportsArrayBuffer()) return false;
      return object instanceof ArrayBuffer;
    };
    /**
     * Tests supplied object to determine if it implements the ArrayBufferView (TypedArray) interface
     *
     * @name isArrayBufferView
     * @function
     * @param {Object} object an Object
     * @returns {boolean}
     */


    jsPDFAPI.isArrayBufferView = function (object) {
      if (!this.supportsArrayBuffer()) return false;
      if (typeof Uint32Array === "undefined") return false;
      return object instanceof Int8Array || object instanceof Uint8Array || typeof Uint8ClampedArray !== "undefined" && object instanceof Uint8ClampedArray || object instanceof Int16Array || object instanceof Uint16Array || object instanceof Int32Array || object instanceof Uint32Array || object instanceof Float32Array || object instanceof Float64Array;
    };
    /**
     * Convert the Buffer to a Binary String
     *
     * @name binaryStringToUint8Array
     * @public
     * @function
     * @param {ArrayBuffer} BinaryString with ImageData
     *
     * @returns {Uint8Array}
     */


    jsPDFAPI.binaryStringToUint8Array = function (binary_string) {
      /*
      * not sure how efficient this will be will bigger files. Is there a native method?
      */
      var len = binary_string.length;
      var bytes = new Uint8Array(len);

      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }

      return bytes;
    };
    /**
     * Convert the Buffer to a Binary String
     *
     * @name arrayBufferToBinaryString
     * @public
     * @function
     * @param {ArrayBuffer} ArrayBuffer with ImageData
     *
     * @returns {String}
     */


    jsPDFAPI.arrayBufferToBinaryString = function (buffer) {
      if (typeof atob === "function") {
        return atob(this.arrayBufferToBase64(buffer));
      }

      if (typeof TextDecoder === "function") {
        var decoder = new TextDecoder("ascii"); // test if the encoding is supported

        if (decoder.encoding === "ascii") {
          return decoder.decode(buffer);
        }
      } //Fallback-solution


      var data = this.isArrayBuffer(buffer) ? buffer : new Uint8Array(buffer);
      var chunkSizeForSlice = 0x5000;
      var binary_string = "";
      var slicesCount = Math.ceil(data.byteLength / chunkSizeForSlice);

      for (var i = 0; i < slicesCount; i++) {
        binary_string += String.fromCharCode.apply(null, data.slice(i * chunkSizeForSlice, i * chunkSizeForSlice + chunkSizeForSlice));
      }

      return binary_string;
    };
    /**
     * Converts an ArrayBuffer directly to base64
     *
     * Taken from  http://jsperf.com/encoding-xhr-image-data/31
     *
     * Need to test if this is a better solution for larger files
     *
     * @name arrayBufferToBase64
     * @param {arraybuffer} arrayBuffer
     * @public
     * @function
     *
     * @returns {string}
     */


    jsPDFAPI.arrayBufferToBase64 = function (arrayBuffer) {
      var base64 = "";
      var encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var bytes = new Uint8Array(arrayBuffer);
      var byteLength = bytes.byteLength;
      var byteRemainder = byteLength % 3;
      var mainLength = byteLength - byteRemainder;
      var a, b, c, d;
      var chunk; // Main loop deals with bytes in chunks of 3

      for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2]; // Use bitmasks to extract 6-bit segments from the triplet

        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18

        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12

        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6

        d = chunk & 63; // 63       = 2^6 - 1
        // Convert the raw binary segments to the appropriate ASCII encoding

        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
      } // Deal with the remaining bytes and padding


      if (byteRemainder == 1) {
        chunk = bytes[mainLength];
        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
        // Set the 4 least significant bits to zero

        b = (chunk & 3) << 4; // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + "==";
      } else if (byteRemainder == 2) {
        chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];
        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10

        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
        // Set the 2 least significant bits to zero

        c = (chunk & 15) << 2; // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + "=";
      }

      return base64;
    };
    /**
     *
     * @name createImageInfo
     * @param {Object} data
     * @param {number} wd width
     * @param {number} ht height
     * @param {Object} cs colorSpace
     * @param {number} bpc bits per channel
     * @param {any} f
     * @param {number} imageIndex
     * @param {string} alias
     * @param {any} dp
     * @param {any} trns
     * @param {any} pal
     * @param {any} smask
     * @param {any} p
     * @public
     * @function
     *
     * @returns {Object}
     */


    jsPDFAPI.createImageInfo = function (data, wd, ht, cs, bpc, f, imageIndex, alias, dp, trns, pal, smask, p) {
      var info = {
        alias: alias,
        w: wd,
        h: ht,
        cs: cs,
        bpc: bpc,
        i: imageIndex,
        data: data // n: objectNumber will be added by putImage code

      };
      if (f) info.f = f;
      if (dp) info.dp = dp;
      if (trns) info.trns = trns;
      if (pal) info.pal = pal;
      if (smask) info.smask = smask;
      if (p) info.p = p; // predictor parameter for PNG compression

      return info;
    };
    /**
     * Adds an Image to the PDF.
     *
     * @name addImage
     * @public
     * @function
     * @param {string/Image-Element/Canvas-Element/Uint8Array} imageData imageData as base64 encoded DataUrl or Image-HTMLElement or Canvas-HTMLElement
     * @param {string} format format of file if filetype-recognition fails, e.g. 'JPEG'
     * @param {number} x x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {number} width width of the image (in units declared at inception of PDF document)
     * @param {number} height height of the Image (in units declared at inception of PDF document)
     * @param {string} alias alias of the image (if used multiple times)
     * @param {string} compression compression of the generated JPEG, can have the values 'NONE', 'FAST', 'MEDIUM' and 'SLOW'
     * @param {number} rotation rotation of the image in degrees (0-359)
     *
     * @returns jsPDF
     */


    jsPDFAPI.addImage = function (imageData, format, x, y, w, h, alias, compression, rotation) {

      var tmpImageData = "";

      if (typeof format !== "string") {
        var tmp = h;
        h = w;
        w = y;
        y = x;
        x = format;
        format = tmp;
      }

      if (_typeof(imageData) === "object" && !isDOMElement(imageData) && "imageData" in imageData) {
        var options = imageData;
        imageData = options.imageData;
        format = options.format || format;
        x = options.x || x || 0;
        y = options.y || y || 0;
        w = options.w || w;
        h = options.h || h;
        alias = options.alias || alias;
        compression = options.compression || compression;
        rotation = options.rotation || options.angle || rotation;
      }

      if (typeof imageData === "string") {
        imageData = unescape(imageData);
      }

      if (isNaN(x) || isNaN(y)) {
        console.error("jsPDF.addImage: Invalid coordinates", arguments);
        throw new Error("Invalid coordinates passed to jsPDF.addImage");
      }

      var images = getImages.call(this),
          info;

      if (!(info = checkImagesForAlias(imageData, images))) {
        var dataAsBinaryString;
        if (isDOMElement(imageData)) imageData = createDataURIFromElement(imageData, format);
        if (notDefined(alias)) alias = generateAliasFromData(imageData);

        if (!(info = checkImagesForAlias(alias, images))) {
          if (this.isString(imageData)) {
            tmpImageData = this.convertStringToImageData(imageData);

            if (tmpImageData !== "") {
              imageData = tmpImageData;
            } else {
              tmpImageData = this.loadImageFile(imageData);

              if (tmpImageData !== undefined) {
                imageData = tmpImageData;
              }
            }
          }

          format = this.getImageFileTypeByImageData(imageData, format);
          if (!isImageTypeSupported(format)) throw new Error("addImage does not support files of type '" + format + "', please ensure that a plugin for '" + format + "' support is added.");
          /**
           * need to test if it's more efficient to convert all binary strings
           * to TypedArray - or should we just leave and process as string?
           */

          if (this.supportsArrayBuffer()) {
            // no need to convert if imageData is already uint8array
            if (!(imageData instanceof Uint8Array)) {
              dataAsBinaryString = imageData;
              imageData = this.binaryStringToUint8Array(imageData);
            }
          }

          info = this["process" + format.toUpperCase()](imageData, getImageIndex(images), alias, checkCompressValue(compression), dataAsBinaryString);
          if (!info) throw new Error("An unkwown error occurred whilst processing the image");
        }
      }

      writeImageToPDF.call(this, x, y, w, h, info, info.i, images, rotation);
      return this;
    };
    /**
     * @name convertStringToImageData
     * @function
     * @param {string} stringData
     * @returns {string} binary data
     */


    jsPDFAPI.convertStringToImageData = function (stringData) {
      var base64Info;
      var imageData = "";

      if (this.isString(stringData)) {
        var base64Info = this.extractInfoFromBase64DataURI(stringData);

        if (base64Info !== null) {
          if (jsPDFAPI.validateStringAsBase64(base64Info[3])) {
            imageData = atob(base64Info[3]); //convert to binary string
          }
        } else if (jsPDFAPI.validateStringAsBase64(stringData)) {
          imageData = atob(stringData);
        }
      }

      return imageData;
    };
    /**
     * JPEG SUPPORT
     **/
    //takes a string imgData containing the raw bytes of
    //a jpeg image and returns [width, height]
    //Algorithm from: http://www.64lines.com/jpeg-width-height


    var getJpegSize = function getJpegSize(imgData) {

      var width, height, numcomponents; // Verify we have a valid jpeg header 0xff,0xd8,0xff,0xe0,?,?,'J','F','I','F',0x00

      if (!imgData.charCodeAt(0) === 0xff || !imgData.charCodeAt(1) === 0xd8 || !imgData.charCodeAt(2) === 0xff || !imgData.charCodeAt(3) === 0xe0 || !imgData.charCodeAt(6) === "J".charCodeAt(0) || !imgData.charCodeAt(7) === "F".charCodeAt(0) || !imgData.charCodeAt(8) === "I".charCodeAt(0) || !imgData.charCodeAt(9) === "F".charCodeAt(0) || !imgData.charCodeAt(10) === 0x00) {
        throw new Error("getJpegSize requires a binary string jpeg file");
      }

      var blockLength = imgData.charCodeAt(4) * 256 + imgData.charCodeAt(5);
      var i = 4,
          len = imgData.length;

      while (i < len) {
        i += blockLength;

        if (imgData.charCodeAt(i) !== 0xff) {
          throw new Error("getJpegSize could not find the size of the image");
        }

        if (imgData.charCodeAt(i + 1) === 0xc0 || //(SOF) Huffman  - Baseline DCT
        imgData.charCodeAt(i + 1) === 0xc1 || //(SOF) Huffman  - Extended sequential DCT
        imgData.charCodeAt(i + 1) === 0xc2 || // Progressive DCT (SOF2)
        imgData.charCodeAt(i + 1) === 0xc3 || // Spatial (sequential) lossless (SOF3)
        imgData.charCodeAt(i + 1) === 0xc4 || // Differential sequential DCT (SOF5)
        imgData.charCodeAt(i + 1) === 0xc5 || // Differential progressive DCT (SOF6)
        imgData.charCodeAt(i + 1) === 0xc6 || // Differential spatial (SOF7)
        imgData.charCodeAt(i + 1) === 0xc7) {
          height = imgData.charCodeAt(i + 5) * 256 + imgData.charCodeAt(i + 6);
          width = imgData.charCodeAt(i + 7) * 256 + imgData.charCodeAt(i + 8);
          numcomponents = imgData.charCodeAt(i + 9);
          return [width, height, numcomponents];
        } else {
          i += 2;
          blockLength = imgData.charCodeAt(i) * 256 + imgData.charCodeAt(i + 1);
        }
      }
    },
        getJpegSizeFromBytes = function getJpegSizeFromBytes(data) {
      var hdr = data[0] << 8 | data[1];
      if (hdr !== 0xffd8) throw new Error("Supplied data is not a JPEG");
      var len = data.length,
          block = (data[4] << 8) + data[5],
          pos = 4,
          bytes,
          width,
          height,
          numcomponents;

      while (pos < len) {
        pos += block;
        bytes = readBytes(data, pos);
        block = (bytes[2] << 8) + bytes[3];

        if ((bytes[1] === 0xc0 || bytes[1] === 0xc2) && bytes[0] === 0xff && block > 7) {
          bytes = readBytes(data, pos + 5);
          width = (bytes[2] << 8) + bytes[3];
          height = (bytes[0] << 8) + bytes[1];
          numcomponents = bytes[4];
          return {
            width: width,
            height: height,
            numcomponents: numcomponents
          };
        }

        pos += 2;
      }

      throw new Error("getJpegSizeFromBytes could not find the size of the image");
    },
        readBytes = function readBytes(data, offset) {
      return data.subarray(offset, offset + 5);
    };
    /**
     * @ignore
     */


    jsPDFAPI.processJPEG = function (data, index, alias, compression, dataAsBinaryString, colorSpace) {

      var filter = this.decode.DCT_DECODE,
          bpc = 8,
          dims;

      if (!this.isString(data) && !this.isArrayBuffer(data) && !this.isArrayBufferView(data)) {
        return null;
      }

      if (this.isString(data)) {
        dims = getJpegSize(data);
      }

      if (this.isArrayBuffer(data)) {
        data = new Uint8Array(data);
      }

      if (this.isArrayBufferView(data)) {
        dims = getJpegSizeFromBytes(data); // if we already have a stored binary string rep use that

        data = dataAsBinaryString || this.arrayBufferToBinaryString(data);
      }

      if (colorSpace === undefined) {
        switch (dims.numcomponents) {
          case 1:
            colorSpace = this.color_spaces.DEVICE_GRAY;
            break;

          case 4:
            colorSpace = this.color_spaces.DEVICE_CMYK;
            break;

          default:
          case 3:
            colorSpace = this.color_spaces.DEVICE_RGB;
            break;
        }
      }

      return this.createImageInfo(data, dims.width, dims.height, colorSpace, bpc, filter, index, alias);
    };
    /**
     * @ignore
     */


    jsPDFAPI.processJPG = function ()
    /*data, index, alias, compression, dataAsBinaryString*/
    {
      return this.processJPEG.apply(this, arguments);
    };
    /**
     * @name loadImageFile
     * @function
     * @param {string} path
     * @param {boolean} sync
     * @param {function} callback
     */


    jsPDFAPI.loadImageFile = function (path, sync, callback) {
      sync = sync || true;

      callback = callback || function () {};

      var isNode = Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";

      var xhrMethod = function xhrMethod(url, sync, callback) {
        var req = new XMLHttpRequest();
        var byteArray = [];
        var i = 0;

        var sanitizeUnicode = function sanitizeUnicode(data) {
          var dataLength = data.length;
          var StringFromCharCode = String.fromCharCode; //Transform Unicode to ASCII

          for (i = 0; i < dataLength; i += 1) {
            byteArray.push(StringFromCharCode(data.charCodeAt(i) & 0xff));
          }

          return byteArray.join("");
        };

        req.open("GET", url, !sync); // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]

        req.overrideMimeType("text/plain; charset=x-user-defined");

        if (sync === false) {
          req.onload = function () {
            return sanitizeUnicode(this.responseText);
          };
        }

        req.send(null);

        if (req.status !== 200) {
          console.warn('Unable to load file "' + url + '"');
          return;
        }

        if (sync) {
          return sanitizeUnicode(req.responseText);
        }
      }; //we have a browser and probably no CORS-Problem


      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== undefined && (typeof location === "undefined" ? "undefined" : _typeof(location)) === "object" && location.protocol.substr(0, 4) === "http") {
        return xhrMethod(path, sync, callback);
      }
    };
    /**
     * @name getImageProperties
     * @function
     * @param {Object} imageData
     * @returns {Object}
     */


    jsPDFAPI.getImageProperties = function (imageData) {
      var info;
      var tmpImageData = "";
      var format;

      if (isDOMElement(imageData)) {
        imageData = createDataURIFromElement(imageData);
      }

      if (this.isString(imageData)) {
        tmpImageData = this.convertStringToImageData(imageData);

        if (tmpImageData !== "") {
          imageData = tmpImageData;
        } else {
          tmpImageData = this.loadImageFile(imageData);

          if (tmpImageData !== undefined) {
            imageData = tmpImageData;
          }
        }
      }

      format = this.getImageFileTypeByImageData(imageData);
      if (!isImageTypeSupported(format)) throw new Error("addImage does not support files of type '" + format + "', please ensure that a plugin for '" + format + "' support is added.");
      /**
       * need to test if it's more efficient to convert all binary strings
       * to TypedArray - or should we just leave and process as string?
       */

      if (this.supportsArrayBuffer()) {
        // no need to convert if imageData is already uint8array
        if (!(imageData instanceof Uint8Array)) {
          imageData = this.binaryStringToUint8Array(imageData);
        }
      }

      info = this["process" + format.toUpperCase()](imageData);

      if (!info) {
        throw new Error("An unkwown error occurred whilst processing the image");
      }

      return {
        fileType: format,
        width: info.w,
        height: info.h,
        colorSpace: info.cs,
        compressionMode: info.f,
        bitsPerComponent: info.bpc
      };
    };
  })(jsPDF.API);

  /**
   * @license
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * jsPDF Annotations PlugIn
   *
   * There are many types of annotations in a PDF document. Annotations are placed
   * on a page at a particular location. They are not 'attached' to an object.
   * <br />
   * This plugin current supports <br />
   * <li> Goto Page (set pageNumber and top in options)
   * <li> Goto Name (set name and top in options)
   * <li> Goto URL (set url in options)
   * <p>
   * 	The destination magnification factor can also be specified when goto is a page number or a named destination. (see documentation below)
   *  (set magFactor in options).  XYZ is the default.
   * </p>
   * <p>
   *  Links, Text, Popup, and FreeText are supported.
   * </p>
   * <p>
   * Options In PDF spec Not Implemented Yet
   * <li> link border
   * <li> named target
   * <li> page coordinates
   * <li> destination page scaling and layout
   * <li> actions other than URL and GotoPage
   * <li> background / hover actions
   * </p>
   * @name annotations
   * @module
   */

  /*
      Destination Magnification Factors
      See PDF 1.3 Page 386 for meanings and options

      [supported]
  	XYZ (options; left top zoom)
  	Fit (no options)
  	FitH (options: top)
  	FitV (options: left)

  	[not supported]
  	FitR
  	FitB
  	FitBH
  	FitBV
   */
  (function (jsPDFAPI) {

    var annotationPlugin = {
      /**
       * An array of arrays, indexed by <em>pageNumber</em>.
       */
      annotations: [],
      f2: function f2(number) {
        return number.toFixed(2);
      },
      notEmpty: function notEmpty(obj) {
        if (typeof obj != "undefined") {
          if (obj != "") {
            return true;
          }
        }
      }
    };
    jsPDF.API.annotationPlugin = annotationPlugin;
    jsPDF.API.events.push(["addPage", function (info) {
      this.annotationPlugin.annotations[info.pageNumber] = [];
    }]);
    jsPDFAPI.events.push(["putPage", function (info) {
      //TODO store annotations in pageContext so reorder/remove will not affect them.
      var pageAnnos = this.annotationPlugin.annotations[info.pageNumber];
      var found = false;

      for (var a = 0; a < pageAnnos.length && !found; a++) {
        var anno = pageAnnos[a];

        switch (anno.type) {
          case "link":
            if (annotationPlugin.notEmpty(anno.options.url) || annotationPlugin.notEmpty(anno.options.pageNumber)) {
              found = true;
              break;
            }

          case "reference":
          case "text":
          case "freetext":
            found = true;
            break;
        }
      }

      if (found == false) {
        return;
      }

      this.internal.write("/Annots [");
      var f2 = this.annotationPlugin.f2;
      var k = this.internal.scaleFactor;
      var pageHeight = this.internal.pageSize.getHeight();
      var pageInfo = this.internal.getPageInfo(info.pageNumber);

      for (var a = 0; a < pageAnnos.length; a++) {
        var anno = pageAnnos[a];

        switch (anno.type) {
          case "reference":
            // References to Widget Anotations (for AcroForm Fields)
            this.internal.write(" " + anno.object.objId + " 0 R ");
            break;

          case "text":
            // Create a an object for both the text and the popup
            var objText = this.internal.newAdditionalObject();
            var objPopup = this.internal.newAdditionalObject();
            var title = anno.title || "Note";
            var rect = "/Rect [" + f2(anno.bounds.x * k) + " " + f2(pageHeight - (anno.bounds.y + anno.bounds.h) * k) + " " + f2((anno.bounds.x + anno.bounds.w) * k) + " " + f2((pageHeight - anno.bounds.y) * k) + "] ";
            line = "<</Type /Annot /Subtype /" + "Text" + " " + rect + "/Contents (" + anno.contents + ")";
            line += " /Popup " + objPopup.objId + " 0 R";
            line += " /P " + pageInfo.objId + " 0 R";
            line += " /T (" + title + ") >>";
            objText.content = line;
            var parent = objText.objId + " 0 R";
            var popoff = 30;
            var rect = "/Rect [" + f2((anno.bounds.x + popoff) * k) + " " + f2(pageHeight - (anno.bounds.y + anno.bounds.h) * k) + " " + f2((anno.bounds.x + anno.bounds.w + popoff) * k) + " " + f2((pageHeight - anno.bounds.y) * k) + "] "; //var rect2 = "/Rect [" + f2(anno.bounds.x * k) + " " + f2((pageHeight - anno.bounds.y) * k) + " " + f2(anno.bounds.x + anno.bounds.w * k) + " " + f2(pageHeight - (anno.bounds.y + anno.bounds.h) * k) + "] ";

            line = "<</Type /Annot /Subtype /" + "Popup" + " " + rect + " /Parent " + parent;

            if (anno.open) {
              line += " /Open true";
            }

            line += " >>";
            objPopup.content = line;
            this.internal.write(objText.objId, "0 R", objPopup.objId, "0 R");
            break;

          case "freetext":
            var rect = "/Rect [" + f2(anno.bounds.x * k) + " " + f2((pageHeight - anno.bounds.y) * k) + " " + f2(anno.bounds.x + anno.bounds.w * k) + " " + f2(pageHeight - (anno.bounds.y + anno.bounds.h) * k) + "] ";
            var color = anno.color || "#000000";
            line = "<</Type /Annot /Subtype /" + "FreeText" + " " + rect + "/Contents (" + anno.contents + ")";
            line += " /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#" + color + ")";
            line += " /Border [0 0 0]";
            line += " >>";
            this.internal.write(line);
            break;

          case "link":
            if (anno.options.name) {
              var loc = this.annotations._nameMap[anno.options.name];
              anno.options.pageNumber = loc.page;
              anno.options.top = loc.y;
            } else {
              if (!anno.options.top) {
                anno.options.top = 0;
              }
            }

            var rect = "/Rect [" + f2(anno.x * k) + " " + f2((pageHeight - anno.y) * k) + " " + f2((anno.x + anno.w) * k) + " " + f2((pageHeight - (anno.y + anno.h)) * k) + "] ";
            var line = "";

            if (anno.options.url) {
              line = "<</Type /Annot /Subtype /Link " + rect + "/Border [0 0 0] /A <</S /URI /URI (" + anno.options.url + ") >>";
            } else if (anno.options.pageNumber) {
              // first page is 0
              var info = this.internal.getPageInfo(anno.options.pageNumber);
              line = "<</Type /Annot /Subtype /Link " + rect + "/Border [0 0 0] /Dest [" + info.objId + " 0 R";
              anno.options.magFactor = anno.options.magFactor || "XYZ";

              switch (anno.options.magFactor) {
                case "Fit":
                  line += " /Fit]";
                  break;

                case "FitH":
                  //anno.options.top = anno.options.top || f2(pageHeight * k);
                  line += " /FitH " + anno.options.top + "]";
                  break;

                case "FitV":
                  anno.options.left = anno.options.left || 0;
                  line += " /FitV " + anno.options.left + "]";
                  break;

                case "XYZ":
                default:
                  var top = f2((pageHeight - anno.options.top) * k); // || f2(pageHeight * k);

                  anno.options.left = anno.options.left || 0; // 0 or null zoom will not change zoom factor

                  if (typeof anno.options.zoom === "undefined") {
                    anno.options.zoom = 0;
                  }

                  line += " /XYZ " + anno.options.left + " " + top + " " + anno.options.zoom + "]";
                  break;
              }
            }

            if (line != "") {
              line += " >>";
              this.internal.write(line);
            }

            break;
        }
      }

      this.internal.write("]");
    }]);
    /**
     * @name createAnnotation
     * @function
     * @param {Object} options
     */

    jsPDFAPI.createAnnotation = function (options) {
      switch (options.type) {
        case "link":
          this.link(options.bounds.x, options.bounds.y, options.bounds.w, options.bounds.h, options);
          break;

        case "text":
        case "freetext":
          this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push(options);
          break;
      }
    };
    /**
     * Create a link
     *
     * valid options
     * <li> pageNumber or url [required]
     * <p>If pageNumber is specified, top and zoom may also be specified</p>
     * @name link
     * @function
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {Object} options
     */


    jsPDFAPI.link = function (x, y, w, h, options) {

      this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push({
        x: x,
        y: y,
        w: w,
        h: h,
        options: options,
        type: "link"
      });
    };
    /**
     * Currently only supports single line text.
     * Returns the width of the text/link
     *
     * @name textWithLink
     * @function
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {Object} options
     * @returns {number} width the width of the text/link
     */


    jsPDFAPI.textWithLink = function (text, x, y, options) {

      var width = this.getTextWidth(text);
      var height = this.internal.getLineHeight() / this.internal.scaleFactor;
      this.text(text, x, y); //TODO We really need the text baseline height to do this correctly.
      // Or ability to draw text on top, bottom, center, or baseline.

      y += height * 0.2;
      this.link(x, y - height, width, height, options);
      return width;
    }; //TODO move into external library

    /**
     * @name getTextWidth
     * @function
     * @param {string} text
     * @returns {number} txtWidth
     */


    jsPDFAPI.getTextWidth = function (text) {

      var fontSize = this.internal.getFontSize();
      var txtWidth = this.getStringUnitWidth(text) * fontSize / this.internal.scaleFactor;
      return txtWidth;
    }; //TODO move into external library

    /**
     * @name getLineHeight
     * @function
     * @returns {number} lineHeight
     */


    jsPDFAPI.getLineHeight = function () {
      return this.internal.getLineHeight();
    };

    return this;
  })(jsPDF.API);

  /**
   * @license
   * Copyright (c) 2017 Aras Abbasi
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * jsPDF arabic parser PlugIn
   *
   * @name arabic
   * @module
   */
  (function (jsPDFAPI) {

    var arLangCodes = {
      ar: "Arabic (Standard)",
      "ar-DZ": "Arabic (Algeria)",
      "ar-BH": "Arabic (Bahrain)",
      "ar-EG": "Arabic (Egypt)",
      "ar-IQ": "Arabic (Iraq)",
      "ar-JO": "Arabic (Jordan)",
      "ar-KW": "Arabic (Kuwait)",
      "ar-LB": "Arabic (Lebanon)",
      "ar-LY": "Arabic (Libya)",
      "ar-MA": "Arabic (Morocco)",
      "ar-OM": "Arabic (Oman)",
      "ar-QA": "Arabic (Qatar)",
      "ar-SA": "Arabic (Saudi Arabia)",
      "ar-SY": "Arabic (Syria)",
      "ar-TN": "Arabic (Tunisia)",
      "ar-AE": "Arabic (U.A.E.)",
      "ar-YE": "Arabic (Yemen)",
      fa: "Persian",
      "fa-IR": "Persian/Iran",
      ur: "Urdu"
    };
    var arLangCodesKeys = Object.keys(arLangCodes);
    /**
     * Arabic shape substitutions: char code => (isolated, final, initial, medial).
     */

    var arabicSubst = {
      1569: [65152],
      1570: [65153, 65154, 65153, 65154],
      1571: [65155, 65156, 65155, 65156],
      1572: [65157, 65158],
      1573: [65159, 65160, 65159, 65160],
      1574: [65161, 65162, 65163, 65164],
      1575: [65165, 65166, 65165, 65166],
      1576: [65167, 65168, 65169, 65170],
      1577: [65171, 65172],
      1578: [65173, 65174, 65175, 65176],
      1579: [65177, 65178, 65179, 65180],
      1580: [65181, 65182, 65183, 65184],
      1581: [65185, 65186, 65187, 65188],
      1582: [65189, 65190, 65191, 65192],
      1583: [65193, 65194, 65193],
      1584: [65195, 65196, 65195],
      1585: [65197, 65198, 65197],
      1586: [65199, 65200, 65199],
      1587: [65201, 65202, 65203, 65204],
      1588: [65205, 65206, 65207, 65208],
      1589: [65209, 65210, 65211, 65212],
      1590: [65213, 65214, 65215, 65216],
      1591: [65217, 65218, 65219, 65220],
      1592: [65221, 65222, 65223, 65224],
      1593: [65225, 65226, 65227, 65228],
      1594: [65229, 65230, 65231, 65232],
      1601: [65233, 65234, 65235, 65236],
      1602: [65237, 65238, 65239, 65240],
      1603: [65241, 65242, 65243, 65244],
      1604: [65245, 65246, 65247, 65248],
      1605: [65249, 65250, 65251, 65252],
      1606: [65253, 65254, 65255, 65256],
      1607: [65257, 65258, 65259, 65260],
      1608: [65261, 65262, 65261],
      1609: [65263, 65264, 64488, 64489],
      1610: [65265, 65266, 65267, 65268],
      1649: [64336, 64337],
      1655: [64477],
      1657: [64358, 64359, 64360, 64361],
      1658: [64350, 64351, 64352, 64353],
      1659: [64338, 64339, 64340, 64341],
      1662: [64342, 64343, 64344, 64345],
      1663: [64354, 64355, 64356, 64357],
      1664: [64346, 64347, 64348, 64349],
      1667: [64374, 64375, 64376, 64377],
      1668: [64370, 64371, 64372, 64373],
      1670: [64378, 64379, 64380, 64381],
      1671: [64382, 64383, 64384, 64385],
      1672: [64392, 64393],
      1676: [64388, 64389],
      1677: [64386, 64387],
      1678: [64390, 64391],
      1681: [64396, 64397],
      1688: [64394, 64395, 64394],
      1700: [64362, 64363, 64364, 64365],
      1702: [64366, 64367, 64368, 64369],
      1705: [64398, 64399, 64400, 64401],
      1709: [64467, 64468, 64469, 64470],
      1711: [64402, 64403, 64404, 64405],
      1713: [64410, 64411, 64412, 64413],
      1715: [64406, 64407, 64408, 64409],
      1722: [64414, 64415],
      1723: [64416, 64417, 64418, 64419],
      1726: [64426, 64427, 64428, 64429],
      1728: [64420, 64421],
      1729: [64422, 64423, 64424, 64425],
      1733: [64480, 64481],
      1734: [64473, 64474],
      1735: [64471, 64472],
      1736: [64475, 64476],
      1737: [64482, 64483],
      1739: [64478, 64479],
      1740: [64508, 64509, 64510, 64511],
      1744: [64484, 64485, 64486, 64487],
      1746: [64430, 64431],
      1747: [64432, 64433]
    };
    var arabiclaasubst = {
      1570: [65269, 65270, 65269, 65270],
      1571: [65271, 65272, 65271, 65272],
      1573: [65273, 65274, 65273, 65274],
      1575: [65275, 65276, 65275, 65276]
    };
    var arabicorigsubst = {
      1570: [65153, 65154, 65153, 65154],
      1571: [65155, 65156, 65155, 65156],
      1573: [65159, 65160, 65159, 65160],
      1575: [65165, 65166, 65165, 65166]
    };
    var arabic_diacritics = {
      1612: 64606,
      // Shadda + Dammatan
      1613: 64607,
      // Shadda + Kasratan
      1614: 64608,
      // Shadda + Fatha
      1615: 64609,
      // Shadda + Damma
      1616: 64610 // Shadda + Kasra

    };
    var alfletter = [1570, 1571, 1573, 1575];
    var endedletter = [1569, 1570, 1571, 1572, 1573, 1575, 1577, 1583, 1584, 1585, 1586, 1608, 1688];
    var isolatedForm = 0;
    var finalForm = 1;
    var initialForm = 2;
    var medialForm = 3; //private

    function isArabicLetter(letter) {
      return letter !== undefined && arabicSubst[letter.charCodeAt(0)] !== undefined;
    }

    function isArabicEndLetter(letter) {
      return letter !== undefined && endedletter.indexOf(letter.charCodeAt(0)) >= 0;
    }

    function isArabicAlfLetter(letter) {
      return letter !== undefined && alfletter.indexOf(letter.charCodeAt(0)) >= 0;
    }

    function arabicLetterHasFinalForm(letter) {
      return isArabicLetter(letter) && arabicSubst[letter.charCodeAt(0)].length >= 2;
    }

    function arabicLetterHasMedialForm(letter) {
      return isArabicLetter(letter) && arabicSubst[letter.charCodeAt(0)].length == 4;
    }

    function isArabicDiacritic(letter) {
      return letter !== undefined && arabic_diacritics[letter.charCodeAt(0)] !== undefined;
    }

    function getCorrectForm(currentChar, beforeChar, nextChar, arabicSubstition) {

      if (!isArabicLetter(currentChar)) {
        return -1;
      }

      arabicSubstition = arabicSubstition || {};
      arabicSubst = Object.assign(arabicSubst, arabicSubstition);

      if (!arabicLetterHasFinalForm(currentChar) || !isArabicLetter(beforeChar) && !isArabicLetter(nextChar) || !isArabicLetter(nextChar) && isArabicEndLetter(beforeChar) || isArabicEndLetter(currentChar) && !isArabicLetter(beforeChar) || isArabicEndLetter(currentChar) && isArabicAlfLetter(beforeChar) || isArabicEndLetter(currentChar) && isArabicEndLetter(beforeChar)) {
        arabicSubst = Object.assign(arabicSubst, arabicorigsubst);
        return isolatedForm;
      }

      if (arabicLetterHasMedialForm(currentChar) && isArabicLetter(beforeChar) && !isArabicEndLetter(beforeChar) && isArabicLetter(nextChar) && arabicLetterHasFinalForm(nextChar)) {
        arabicSubst = Object.assign(arabicSubst, arabicorigsubst);
        return medialForm;
      }

      if (isArabicEndLetter(currentChar) || !isArabicLetter(nextChar)) {
        arabicSubst = Object.assign(arabicSubst, arabicorigsubst);
        return finalForm;
      }

      arabicSubst = Object.assign(arabicSubst, arabicorigsubst);
      return initialForm;
    }

    var commonSubstition = function commonSubstition(character) {
      var replacementTable = {
        "(": ")",
        ")": "("
      };
      return replacementTable[character] || character;
    };
    /**
     * @name processArabic
     * @function
     * @param {string} text
     * @param {boolean} reverse
     * @returns {string}
     */


    var processArabic = jsPDFAPI.processArabic = function (text, reverse) {
      text = text || "";
      reverse = reverse || false;
      var result = "";
      var i = 0;
      var position = 0;
      var currentLetter = "";
      var prevLetter = "";
      var nextLetter = "";
      var resultingLetter;
      var localPrevLetter;
      var localCurrentLetter;
      var localNextLetter;

      for (i = 0; i < text.length; i += 1) {
        currentLetter = text[i];
        prevLetter = text[i - 1];
        nextLetter = text[i + 1];

        if (!isArabicLetter(currentLetter)) {
          result += reverse ? commonSubstition(currentLetter) : currentLetter;
        } else {
          if (prevLetter !== undefined && prevLetter.charCodeAt(0) === 1604 && isArabicAlfLetter(currentLetter)) {
            localPrevLetter = text[i - 2];
            localCurrentLetter = currentLetter;
            localNextLetter = text[i + 1];
            position = getCorrectForm(localCurrentLetter, localPrevLetter, localNextLetter, arabiclaasubst);
            resultingLetter = String.fromCharCode(arabiclaasubst[currentLetter.charCodeAt(0)][position]);
            result = result.substr(0, result.length - 1) + resultingLetter;
          } else if (prevLetter !== undefined && prevLetter.charCodeAt(0) === 1617 && isArabicDiacritic(currentLetter)) {
            localPrevLetter = text[i - 2];
            localCurrentLetter = currentLetter;
            localNextLetter = text[i + 1];
            position = getCorrectForm(localCurrentLetter, localPrevLetter, localNextLetter, arabicorigsubst);
            resultingLetter = String.fromCharCode(arabic_diacritics[currentLetter.charCodeAt(0)][position]);
            result = result.substr(0, result.length - 1) + resultingLetter;
          } else {
            position = getCorrectForm(currentLetter, prevLetter, nextLetter, arabicorigsubst);
            result += String.fromCharCode(arabicSubst[currentLetter.charCodeAt(0)][position]);
          }
        }
      }

      return reverse ? result.split("").reverse().join("") : result;
    };

    var arabicParserFunction = function arabicParserFunction(args) {
      var text = args.text;
      var x = args.x;
      var y = args.y;
      var options = args.options || {};
      var mutex = args.mutex || {};
      var lang = options.lang;
      var tmpText = [];

      if (arLangCodesKeys.indexOf(lang) >= 0) {
        if (Object.prototype.toString.call(text) === "[object Array]") {
          var i = 0;
          tmpText = [];

          for (i = 0; i < text.length; i += 1) {
            if (Object.prototype.toString.call(text[i]) === "[object Array]") {
              tmpText.push([processArabic(text[i][0], true), text[i][1], text[i][2]]);
            } else {
              tmpText.push([processArabic(text[i], true)]);
            }
          }

          args.text = tmpText;
        } else {
          args.text = processArabic(text, true);
        } //force charSpace if not given.


        if (options.charSpace === undefined) {
          args.options.charSpace = 0;
        } //if R2L is true, set it false.


        if (options.R2L === true) {
          args.options.R2L = false;
        }
      }
    };

    jsPDFAPI.events.push(["preProcessText", arabicParserFunction]);
  })(jsPDF.API);

  /** @license
   * jsPDF Autoprint Plugin
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * @name autoprint
   * @module
   */
  (function (jsPDFAPI) {
    /**
     * Makes the PDF automatically print. This works in Chrome, Firefox, Acrobat
     * Reader.
     *
     * @name autoPrint
     * @function
     * @param {Object} options (optional) Set the attribute variant to 'non-conform' (default) or 'javascript' to activate different methods of automatic printing when opening in a PDF-viewer .
     * @returns {jsPDF}
     * @example
     * var doc = new jsPDF();
     * doc.text(10, 10, 'This is a test');
     * doc.autoPrint({variant: 'non-conform'});
     * doc.save('autoprint.pdf');
     */

    jsPDFAPI.autoPrint = function (options) {

      var refAutoPrintTag;
      options = options || {};
      options.variant = options.variant || "non-conform";

      switch (options.variant) {
        case "javascript":
          //https://github.com/Rob--W/pdf.js/commit/c676ecb5a0f54677b9f3340c3ef2cf42225453bb
          this.addJS("print({});");
          break;

        case "non-conform":
        default:
          this.internal.events.subscribe("postPutResources", function () {
            refAutoPrintTag = this.internal.newObject();
            this.internal.out("<<");
            this.internal.out("/S /Named");
            this.internal.out("/Type /Action");
            this.internal.out("/N /Print");
            this.internal.out(">>");
            this.internal.out("endobj");
          });
          this.internal.events.subscribe("putCatalog", function () {
            this.internal.out("/OpenAction " + refAutoPrintTag + " 0 R");
          });
          break;
      }

      return this;
    };
  })(jsPDF.API);

  /**
   * @license
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * jsPDF Canvas PlugIn
   * This plugin mimics the HTML5 Canvas
   *
   * The goal is to provide a way for current canvas users to print directly to a PDF.
   * @name canvas
   * @module
   */
  (function (jsPDFAPI) {

    jsPDFAPI.events.push(["initialized", function () {
      this.canvas.pdf = this;
    }]);
    /**
     * @name canvas
     * @static
     * @type {Object}
     */

    jsPDFAPI.canvas = {
      /**
       * @name getContext
       * @function
       * @param {string} the context type
       */
      getContext: function getContext(name) {
        this.pdf.context2d._canvas = this;
        return this.pdf.context2d;
      },
      childNodes: [],
      style: {},
      autoContext2dResizeX: true,
      autoContext2dResizeY: true
    };
    /**
     * Width of the canvas
     *
     * @name width
     * @property {number} width
     */

    Object.defineProperty(jsPDFAPI.canvas, "width", {
      get: function get() {
        return this._width;
      },
      set: function set(value) {
        this._width = value;

        if (this.autoContext2dResizeX) {
          this.getContext("2d").pageWrapX = value + 1;
        }
      }
    });
    /**
     * Height of the canvas
     *
     * @name height
     * @property {number} height
     */

    Object.defineProperty(jsPDFAPI.canvas, "height", {
      get: function get() {
        return this._height;
      },
      set: function set(value) {
        this._height = value;

        if (this.autoContext2dResizeY) {
          this.getContext("2d").pageWrapY = value + 1;
        }
      }
    });
    return this;
  })(jsPDF.API);

  /**
   * @license
   * ====================================================================
   * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
   *               2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
   *               2013 Lee Driscoll, https://github.com/lsdriscoll
   *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
   *               2014 James Hall, james@parall.ax
   *               2014 Diego Casorran, https://github.com/diegocr
   *
   * 
   * ====================================================================
   */

  /**
   * @name cell
   * @module
   */
  (function (jsPDFAPI) {
    /*jslint browser:true */

    /*global document: false, jsPDF */

    var padding = 3,
        margin = 13,
        headerFunction,
        lastCellPos = {
      x: undefined,
      y: undefined,
      w: undefined,
      h: undefined,
      ln: undefined
    },
        pages = 1,
        setLastCellPosition = function setLastCellPosition(x, y, w, h, ln) {
      lastCellPos = {
        x: x,
        y: y,
        w: w,
        h: h,
        ln: ln
      };
    },
        getLastCellPosition = function getLastCellPosition() {
      return lastCellPos;
    },
        NO_MARGINS = {
      left: 0,
      top: 0,
      bottom: 0
    };
    /**
     * @name setHeaderFunction
     * @function
     * @param {function} func
     */


    jsPDFAPI.setHeaderFunction = function (func) {
      headerFunction = func;
    };
    /**
     * @name getTextDimensions
     * @function
     * @param {string} txt
     * @returns {Object} dimensions
     */


    jsPDFAPI.getTextDimensions = function (text, options) {
      var fontSize = this.table_font_size || this.internal.getFontSize();
      var fontStyle = this.internal.getFont().fontStyle;
      options = options || {};
      var scaleFactor = options.scaleFactor || this.internal.scaleFactor;
      var width = 0;
      var amountOfLines = 0;
      var height = 0;
      var tempWidth = 0;

      if (typeof text === "string") {
        width = this.getStringUnitWidth(text) * fontSize;

        if (width !== 0) {
          amountOfLines = 1;
        }
      } else if (Object.prototype.toString.call(text) === "[object Array]") {
        for (var i = 0; i < text.length; i++) {
          tempWidth = this.getStringUnitWidth(text[i]) * fontSize;

          if (width < tempWidth) {
            width = tempWidth;
          }
        }

        if (width !== 0) {
          amountOfLines = text.length;
        }
      } else {
        console.error("getTextDimensions expects text-parameter to be of type String or an Array of Strings.");
      }

      width = width / scaleFactor;
      height = amountOfLines * fontSize * 1.15 / scaleFactor;
      return {
        w: width,
        h: height
      };
    };
    /**
     * @name cellAddPage
     * @function
     */


    jsPDFAPI.cellAddPage = function () {
      var margins = this.margins || NO_MARGINS;
      this.addPage();
      setLastCellPosition(margins.left, margins.top, undefined, undefined); //setLastCellPosition(undefined, undefined, undefined, undefined, undefined);

      pages += 1;
    };
    /**
     * @name cellInitialize
     * @function
     */


    jsPDFAPI.cellInitialize = function () {
      lastCellPos = {
        x: undefined,
        y: undefined,
        w: undefined,
        h: undefined,
        ln: undefined
      };
      pages = 1;
    };
    /**
     * @name cell
     * @function
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {string} txt
     * @param {number} ln lineNumber
     * @param {string} align
     * @return {jsPDF} jsPDF-instance
     */


    jsPDFAPI.cell = function (x, y, w, h, txt, ln, align) {
      var curCell = getLastCellPosition();
      var pgAdded = false; // If this is not the first cell, we must change its position

      if (curCell.ln !== undefined) {
        if (curCell.ln === ln) {
          //Same line
          x = curCell.x + curCell.w;
          y = curCell.y;
        } else {
          //New line
          var margins = this.margins || NO_MARGINS;

          if (curCell.y + curCell.h + h + margin >= this.internal.pageSize.getHeight() - margins.bottom) {
            this.cellAddPage();
            pgAdded = true;

            if (this.printHeaders && this.tableHeaderRow) {
              this.printHeaderRow(ln, true);
            }
          } //We ignore the passed y: the lines may have different heights


          y = getLastCellPosition().y + getLastCellPosition().h;
          if (pgAdded) y = margin + 10;
        }
      }

      if (txt[0] !== undefined) {
        if (this.printingHeaderRow) {
          this.rect(x, y, w, h, "FD");
        } else {
          this.rect(x, y, w, h);
        }

        if (align === "right") {
          if (!(txt instanceof Array)) {
            txt = [txt];
          }

          for (var i = 0; i < txt.length; i++) {
            var currentLine = txt[i];
            var textSize = this.getStringUnitWidth(currentLine) * this.internal.getFontSize();
            this.text(currentLine, x + w - textSize - padding, y + this.internal.getLineHeight() * (i + 1));
          }
        } else {
          this.text(txt, x + padding, y + this.internal.getLineHeight());
        }
      }

      setLastCellPosition(x, y, w, h, ln);
      return this;
    };
    /**
     * Return the maximum value from an array
     *
     * @name arrayMax
     * @function
     * @param {Array} array
     * @param comparisonFn
     * @returns {number}
     */


    jsPDFAPI.arrayMax = function (array, comparisonFn) {
      var max = array[0],
          i,
          ln,
          item;

      for (i = 0, ln = array.length; i < ln; i += 1) {
        item = array[i];

        if (comparisonFn) {
          if (comparisonFn(max, item) === -1) {
            max = item;
          }
        } else {
          if (item > max) {
            max = item;
          }
        }
      }

      return max;
    };
    /**
       * Create a table from a set of data.
       * @name table
       * @function
       * @param {Integer} [x] : left-position for top-left corner of table
       * @param {Integer} [y] top-position for top-left corner of table
       * @param {Object[]} [data] As array of objects containing key-value pairs corresponding to a row of data.
       * @param {String[]} [headers] Omit or null to auto-generate headers at a performance cost
         * @param {Object} [config.printHeaders] True to print column headers at the top of every page
       * @param {Object} [config.autoSize] True to dynamically set the column widths to match the widest cell value
       * @param {Object} [config.margins] margin values for left, top, bottom, and width
       * @param {Object} [config.fontSize] Integer fontSize to use (optional)
       * @returns {jsPDF} jsPDF-instance
       */


    jsPDFAPI.table = function (x, y, data, headers, config) {
      if (!data) {
        throw "No data for PDF table";
      }

      var headerNames = [],
          headerPrompts = [],
          header,
          i,
          ln,
          cln,
          columnMatrix = {},
          columnWidths = {},
          columnData,
          column,
          columnMinWidths = [],
          j,
          tableHeaderConfigs = [],
          model,
          jln,
          func,
          //set up defaults. If a value is provided in config, defaults will be overwritten:
      autoSize = false,
          printHeaders = true,
          fontSize = 12,
          margins = NO_MARGINS;
      margins.width = this.internal.pageSize.getWidth();

      if (config) {
        //override config defaults if the user has specified non-default behavior:
        if (config.autoSize === true) {
          autoSize = true;
        }

        if (config.printHeaders === false) {
          printHeaders = false;
        }

        if (config.fontSize) {
          fontSize = config.fontSize;
        }

        if (config.css && typeof config.css["font-size"] !== "undefined") {
          fontSize = config.css["font-size"] * 16;
        }

        if (config.margins) {
          margins = config.margins;
        }
      }
      /**
       * @property {Number} lnMod
       * Keep track of the current line number modifier used when creating cells
       */


      this.lnMod = 0;
      lastCellPos = {
        x: undefined,
        y: undefined,
        w: undefined,
        h: undefined,
        ln: undefined
      }, pages = 1;
      this.printHeaders = printHeaders;
      this.margins = margins;
      this.setFontSize(fontSize);
      this.table_font_size = fontSize; // Set header values

      if (headers === undefined || headers === null) {
        // No headers defined so we derive from data
        headerNames = Object.keys(data[0]);
      } else if (headers[0] && typeof headers[0] !== "string") {
        var px2pt = 0.264583 * 72 / 25.4; // Split header configs into names and prompts

        for (i = 0, ln = headers.length; i < ln; i += 1) {
          header = headers[i];
          headerNames.push(header.name);
          headerPrompts.push(header.prompt);
          columnWidths[header.name] = header.width * px2pt;
        }
      } else {
        headerNames = headers;
      }

      if (autoSize) {
        // Create a matrix of columns e.g., {column_title: [row1_Record, row2_Record]}
        func = function func(rec) {
          return rec[header];
        };

        for (i = 0, ln = headerNames.length; i < ln; i += 1) {
          header = headerNames[i];
          columnMatrix[header] = data.map(func); // get header width

          columnMinWidths.push(this.getTextDimensions(headerPrompts[i] || header, {
            scaleFactor: 1
          }).w);
          column = columnMatrix[header]; // get cell widths

          for (j = 0, cln = column.length; j < cln; j += 1) {
            columnData = column[j];
            columnMinWidths.push(this.getTextDimensions(columnData, {
              scaleFactor: 1
            }).w);
          } // get final column width


          columnWidths[header] = jsPDFAPI.arrayMax(columnMinWidths); //have to reset

          columnMinWidths = [];
        }
      } // -- Construct the table


      if (printHeaders) {
        var lineHeight = this.calculateLineHeight(headerNames, columnWidths, headerPrompts.length ? headerPrompts : headerNames); // Construct the header row

        for (i = 0, ln = headerNames.length; i < ln; i += 1) {
          header = headerNames[i];
          tableHeaderConfigs.push([x, y, columnWidths[header], lineHeight, String(headerPrompts.length ? headerPrompts[i] : header)]);
        } // Store the table header config


        this.setTableHeaderRow(tableHeaderConfigs); // Print the header for the start of the table

        this.printHeaderRow(1, false);
      } // Construct the data rows


      for (i = 0, ln = data.length; i < ln; i += 1) {
        var lineHeight;
        model = data[i];
        lineHeight = this.calculateLineHeight(headerNames, columnWidths, model);

        for (j = 0, jln = headerNames.length; j < jln; j += 1) {
          header = headerNames[j];
          this.cell(x, y, columnWidths[header], lineHeight, model[header], i + 2, header.align);
        }
      }

      this.lastCellPos = lastCellPos;
      this.table_x = x;
      this.table_y = y;
      return this;
    };
    /**
     * Calculate the height for containing the highest column
     *
     * @name calculateLineHeight
     * @function
     * @param {String[]} headerNames is the header, used as keys to the data
     * @param {Integer[]} columnWidths is size of each column
     * @param {Object[]} model is the line of data we want to calculate the height of
     * @returns {number} lineHeight
     */


    jsPDFAPI.calculateLineHeight = function (headerNames, columnWidths, model) {
      var header,
          lineHeight = 0;

      for (var j = 0; j < headerNames.length; j++) {
        header = headerNames[j];
        model[header] = this.splitTextToSize(String(model[header]), columnWidths[header] - padding);
        var h = this.internal.getLineHeight() * model[header].length + padding;
        if (h > lineHeight) lineHeight = h;
      }

      return lineHeight;
    };
    /**
     * Store the config for outputting a table header
     *
     * @name setTableHeaderRow
     * @function
     * @param {Object[]} config
     * An array of cell configs that would define a header row: Each config matches the config used by jsPDFAPI.cell
     * except the ln parameter is excluded
     */


    jsPDFAPI.setTableHeaderRow = function (config) {
      this.tableHeaderRow = config;
    };
    /**
     * Output the store header row
     *
     * @name printHeaderRow
     * @function
     * @param {number} lineNumber The line number to output the header at
     * @param {boolean} new_page
     */


    jsPDFAPI.printHeaderRow = function (lineNumber, new_page) {
      if (!this.tableHeaderRow) {
        throw "Property tableHeaderRow does not exist.";
      }

      var tableHeaderCell, tmpArray, i, ln;
      this.printingHeaderRow = true;

      if (headerFunction !== undefined) {
        var position = headerFunction(this, pages);
        setLastCellPosition(position[0], position[1], position[2], position[3], -1);
      }

      this.setFontStyle("bold");
      var tempHeaderConf = [];

      for (i = 0, ln = this.tableHeaderRow.length; i < ln; i += 1) {
        this.setFillColor(200, 200, 200);
        tableHeaderCell = this.tableHeaderRow[i];

        if (new_page) {
          this.margins.top = margin;
          tableHeaderCell[1] = this.margins && this.margins.top || 0;
          tempHeaderConf.push(tableHeaderCell);
        }

        tmpArray = [].concat(tableHeaderCell);
        this.cell.apply(this, tmpArray.concat(lineNumber));
      }

      if (tempHeaderConf.length > 0) {
        this.setTableHeaderRow(tempHeaderConf);
      }

      this.setFontStyle("normal");
      this.printingHeaderRow = false;
    };
  })(jsPDF.API);

  /**
   * jsPDF Context2D PlugIn Copyright (c) 2014 Steven Spungin (TwelveTone LLC) steven@twelvetone.tv
   *
   * Licensed under the MIT License. http://opensource.org/licenses/mit-license
   */

  /**
   * TODO implement stroke opacity (refactor from fill() method )
   * TODO transform angle and radii parameters
   */

  /**
   * This plugin mimics the HTML5 Canvas's context2d.
   *
   * The goal is to provide a way for current canvas implementations to print directly to a PDF.
   *
   * @name context2d
   * @module
   */
  (function (jsPDFAPI, globalObj) {

    jsPDFAPI.events.push(["initialized", function () {
      this.context2d.pdf = this;
      this.context2d.internal.pdf = this;
      this.context2d.ctx = new context();
      this.context2d.ctxStack = [];
      this.context2d.path = [];
    }]);
    jsPDFAPI.context2d = {
      /**
       * @name pageWrapXEnabled
       * @type {boolean}
       * @default false
       */
      pageWrapXEnabled: false,

      /**
       * @name pageWrapYEnabled
       * @type {boolean}
       * @default false
       */
      pageWrapYEnabled: false,

      /**
       * @name pageWrapX
       * @type {number}
       * @default 9999999
       */
      pageWrapX: 9999999,

      /**
       * @name pageWrapY
       * @type {number}
       * @default 9999999
       */
      pageWrapY: 9999999,

      /**
       * @name ctx
       * @type {Object}
       */
      ctx: new context(),

      /**
       * @name f2
       * @type {function}
       * @ignore
       */
      f2: function f2(number) {
        return number.toFixed(2);
      },

      /**
       * Fills the current drawing (path)
       *
       * @name fill
       * @function
       * @description The fill() method fills the current drawing (path). The default color is black.
       */
      fill: function fill() {
        //evenodd or nonzero (default)
        var rule = "fill";

        this._drawPaths(rule, false);
      },

      /**
       * Actually draws the path you have defined
       *
       * @name stroke
       * @function
       * @description The stroke() method actually draws the path you have defined with all those moveTo() and lineTo() methods. The default color is black.
       */
      stroke: function stroke() {
        var rule = "stroke";

        this._drawPaths(rule, false);
      },

      /**
       * Begins a path, or resets the current
       *
       * @name beginPath
       * @function
       * @description The beginPath() method begins a path, or resets the current path.
       */
      beginPath: function beginPath() {
        this._resetPath();

        this._beginPath();
      },

      /**
       * Moves the path to the specified point in the canvas, without creating a line
       *
       * @name moveTo
       * @function
       * @param x {Number} The x-coordinate of where to move the path to
       * @param y {Number} The y-coordinate of where to move the path to
       */
      moveTo: function moveTo(x, y) {
        x = this._wrapX(x);
        y = this._wrapY(y);

        var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);

        x = xpt[0];
        y = xpt[1];
        var obj = {
          type: "mt",
          x: x,
          y: y
        };
        this.path.push(obj);
      },

      /**
       * Creates a path from the current point back to the starting point
       *
       * @name closePath
       * @function
       * @description The closePath() method creates a path from the current point back to the starting point.
       */
      closePath: function closePath() {
        this._closePath();

        var obj = {
          type: "close"
        };
        this.path.push(obj);
      },

      /**
       * Adds a new point and creates a line to that point from the last specified point in the canvas
       *
       * @name lineTo
       * @function
       * @param x The x-coordinate of where to create the line to
       * @param y	The y-coordinate of where to create the line to
       * @description The lineTo() method adds a new point and creates a line TO that point FROM the last specified point in the canvas (this method does not draw the line).
       */
      lineTo: function lineTo(x, y) {
        x = this._wrapX(x);
        y = this._wrapY(y);

        var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);

        x = xpt[0];
        y = xpt[1];
        var obj = {
          type: "lt",
          x: x,
          y: y
        };
        this.path.push(obj);
      },

      /**
       * Clips a region of any shape and size from the original canvas
       *
       * @name clip
       * @function
       * @description The clip() method clips a region of any shape and size from the original canvas.
       */
      clip: function clip() {
        this._drawPaths(null, true);
      },

      /**
       * Creates a cubic Bézier curve
       *
       * @name quadraticCurveTo
       * @function
       * @param cpx {Number} The x-coordinate of the Bézier control point
       * @param cpy {Number} The y-coordinate of the Bézier control point
       * @param x {Number} The x-coordinate of the ending point
       * @param y {Number} The y-coordinate of the ending point
       * @description The quadraticCurveTo() method adds a point to the current path by using the specified control points that represent a quadratic Bézier curve.<br /><br /> A quadratic Bézier curve requires two points. The first point is a control point that is used in the quadratic Bézier calculation and the second point is the ending point for the curve. The starting point for the curve is the last point in the current path. If a path does not exist, use the beginPath() and moveTo() methods to define a starting point.
       */
      quadraticCurveTo: function quadraticCurveTo(cpx, cpy, x, y) {
        var x1 = this._wrapX(cpx);

        var y1 = this._wrapY(cpy);

        x = this._wrapX(x);
        y = this._wrapY(y);
        var xpt;
        xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
        x = xpt[0];
        y = xpt[1];
        xpt = this._matrix_map_point(this.ctx._transform, [x1, y1]);
        x1 = xpt[0];
        y1 = xpt[1];
        var obj = {
          type: "qct",
          x1: x1,
          y1: y1,
          x: x,
          y: y
        };
        this.path.push(obj);
      },

      /**
       * Creates a cubic Bézier curve
       *
       * @name bezierCurveTo
       * @function
       * @param cp1x {Number} The x-coordinate of the first Bézier control point
       * @param cp1y {Number} The y-coordinate of the first Bézier control point
       * @param cp2x {Number} The x-coordinate of the second Bézier control point
       * @param cp2y {Number} The y-coordinate of the second Bézier control point
       * @param x {Number} The x-coordinate of the ending point
       * @param y {Number} The y-coordinate of the ending point
       * @description The bezierCurveTo() method adds a point to the current path by using the specified control points that represent a cubic Bézier curve. <br /><br />A cubic bezier curve requires three points. The first two points are control points that are used in the cubic Bézier calculation and the last point is the ending point for the curve.  The starting point for the curve is the last point in the current path. If a path does not exist, use the beginPath() and moveTo() methods to define a starting point.
       */
      bezierCurveTo: function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
        var x1 = this._wrapX(cp1x);

        var y1 = this._wrapY(cp1y);

        var x2 = this._wrapX(cp2x);

        var y2 = this._wrapY(cp2y);

        x = this._wrapX(x);
        y = this._wrapY(y);
        var xpt;
        xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
        x = xpt[0];
        y = xpt[1];
        xpt = this._matrix_map_point(this.ctx._transform, [x1, y1]);
        x1 = xpt[0];
        y1 = xpt[1];
        xpt = this._matrix_map_point(this.ctx._transform, [x2, y2]);
        x2 = xpt[0];
        y2 = xpt[1];
        var obj = {
          type: "bct",
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          x: x,
          y: y
        };
        this.path.push(obj);
      },

      /**
       * Creates an arc/curve (used to create circles, or parts of circles)
       *
       * @name arc
       * @function
       * @param x {Number} The x-coordinate of the center of the circle
       * @param y {Number} The y-coordinate of the center of the circle
       * @param radius {Number} The radius of the circle
       * @param startAngle {Number} The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
       * @param endAngle {Number} The ending angle, in radians
       * @param counterclockwise {Boolean} Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
       * @description The arc() method creates an arc/curve (used to create circles, or parts of circles).
       */
      arc: function arc(x, y, radius, startAngle, endAngle, counterclockwise) {
        x = this._wrapX(x);
        y = this._wrapY(y);
        counterclockwise = counterclockwise || false;

        if (!this._matrix_is_identity(this.ctx._transform)) {
          var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);

          x = xpt[0];
          y = xpt[1];

          var x_radPt0 = this._matrix_map_point(this.ctx._transform, [0, 0]);

          var x_radPt = this._matrix_map_point(this.ctx._transform, [0, radius]);

          radius = Math.sqrt(Math.pow(x_radPt[0] - x_radPt0[0], 2) + Math.pow(x_radPt[1] - x_radPt0[1], 2));
        }

        var obj = {
          type: "arc",
          x: x,
          y: y,
          radius: radius,
          startAngle: startAngle,
          endAngle: endAngle,
          counterclockwise: counterclockwise
        };
        this.path.push(obj);
      },

      /**
       * Creates an arc/curve between two tangents
       *
       * @name arcTo
       * @function
       * @param x1 {Number} The x-coordinate of the first tangent
       * @param y1 {Number} The y-coordinate of the first tangent
       * @param x2 {Number} The x-coordinate of the second tangent
       * @param y2 {Number} The y-coordinate of the second tangent
       * @param radius The radius of the
       * @description The arcTo() method creates an arc/curve between two tangents on the canvas.
       */
      arcTo: function arcTo(x1, y1, x2, y2, radius) {//TODO needs to be implemented
      },
      //Rectangles

      /**
       * Creates a rectangle
       *
       * @name rect
       * @function
       * @param x {Number} The x-coordinate of the upper-left corner of the rectangle
       * @param y {Number} The y-coordinate of the upper-left corner of the rectangle
       * @param w {Number} The width of the rectangle, in pixels
       * @param h {Number} The height of the rectangle, in pixels
       * @description The rect() method creates a rectangle.
       */
      rect: function rect(x, y, w, h) {
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x, y);
      },

      /**
       * Draws a "filled" rectangle
       *
       * @name fillRect
       * @function
       * @param x {Number} The x-coordinate of the upper-left corner of the rectangle
       * @param y {Number} The y-coordinate of the upper-left corner of the rectangle
       * @param w {Number} The width of the rectangle, in pixels
       * @param h {Number} The height of the rectangle, in pixels
       * @description The fillRect() method draws a "filled" rectangle. The default color of the fill is black.
       */
      fillRect: function fillRect(x, y, w, h) {
        if (this._isFillTransparent()) {
          return;
        }

        x = this._wrapX(x);
        y = this._wrapY(y);

        var xpt1 = this._matrix_map_point(this.ctx._transform, [x, y]);

        var xpt2 = this._matrix_map_point(this.ctx._transform, [x + w, y]);

        var xpt3 = this._matrix_map_point(this.ctx._transform, [x + w, y + h]);

        var xpt4 = this._matrix_map_point(this.ctx._transform, [x, y + h]);

        this.pdf.internal.out("q");
        this.pdf.setLineCap("butt");
        this.pdf.setLineJoin("miter");
        var lines = [];
        lines.push([xpt2[0] - xpt1[0], xpt2[1] - xpt1[1]]);
        lines.push([xpt3[0] - xpt2[0], xpt3[1] - xpt2[1]]);
        lines.push([xpt4[0] - xpt3[0], xpt4[1] - xpt3[1]]);
        lines.push([xpt1[0] - xpt4[0], xpt1[1] - xpt4[1]]);
        lines.push([xpt2[0] - xpt1[0], xpt2[1] - xpt1[1]]);
        lines.push([xpt1[0] - xpt2[0], xpt1[1] - xpt2[1]]);
        this.pdf.lines(lines, xpt1[0], xpt1[1], null, "F");
        this.pdf.internal.out("Q");
      },

      /**
       * 	Draws a rectangle (no fill)
       *
       * @name strokeRect
       * @function
       * @param x {Number} The x-coordinate of the upper-left corner of the rectangle
       * @param y {Number} The y-coordinate of the upper-left corner of the rectangle
       * @param w {Number} The width of the rectangle, in pixels
       * @param h {Number} The height of the rectangle, in pixels
       * @description The strokeRect() method draws a rectangle (no fill). The default color of the stroke is black.
       */
      strokeRect: function strokeRect(x, y, w, h) {
        if (this._isStrokeTransparent()) {
          return;
        }

        x = this._wrapX(x);
        y = this._wrapY(y);

        var xpt1 = this._matrix_map_point(this.ctx._transform, [x, y]);

        var xpt2 = this._matrix_map_point(this.ctx._transform, [x + w, y]);

        var xpt3 = this._matrix_map_point(this.ctx._transform, [x + w, y + h]);

        var xpt4 = this._matrix_map_point(this.ctx._transform, [x, y + h]);

        var lines = [];
        lines.push([xpt2[0] - xpt1[0], xpt2[1] - xpt1[1]]);
        lines.push([xpt3[0] - xpt2[0], xpt3[1] - xpt2[1]]);
        lines.push([xpt4[0] - xpt3[0], xpt4[1] - xpt3[1]]);
        lines.push([xpt1[0] - xpt4[0], xpt1[1] - xpt4[1]]);
        lines.push([xpt2[0] - xpt1[0], xpt2[1] - xpt1[1]]);
        lines.push([xpt1[0] - xpt2[0], xpt1[1] - xpt2[1]]);
        this.pdf.lines(lines, xpt1[0], xpt1[1], null, "S");
      },

      /**
       * Clears the specified pixels within a given rectangle
       *
       * @name clearRect
       * @function
       * @param x {Number} The x-coordinate of the upper-left corner of the rectangle
       * @param y {Number} The y-coordinate of the upper-left corner of the rectangle
       * @param w {Number} The width of the rectangle to clear, in pixels
       * @param h {Number} The height of the rectangle to clear, in pixels
       * @description We cannot clear PDF commands that were already written to PDF, so we use white instead. <br />
       * As a special case, read a special flag (ignoreClearRect) and do nothing if it is set.
       * This results in all calls to clearRect() to do nothing, and keep the canvas transparent.
       * This flag is stored in the save/restore context and is managed the same way as other drawing states.
       *
       */
      clearRect: function clearRect(x, y, w, h) {
        if (this.ctx.ignoreClearRect) {
          return;
        }

        this.save();

        this._setFillStyle("#ffffff");

        this.fillRect(x, y, w, h);
        this.restore();
      },
      //Other

      /**
       * Saves the state of the current context
       *
       * @name save
       * @function
       */
      save: function save() {
        this.pdf.internal.out("q");
        this.ctx._fontSize = this.pdf.internal.getFontSize();
        var ctx = new context();
        ctx.copy(this.ctx);
        this.ctxStack.push(this.ctx);
        this.ctx = ctx;
      },

      /**
       * Returns previously saved path state and attributes
       *
       * @name restore
       * @function
       */
      restore: function restore() {
        this.pdf.internal.out("Q");

        if (this.ctxStack.length !== 0) {
          this.ctx = this.ctxStack.pop();

          this._setFillStyle(this.ctx.fillStyle);

          this._setStrokeStyle(this.ctx.strokeStyle);

          this._setFont(this.ctx.font);

          this.pdf.setFontSize(this.ctx._fontSize);

          this._setLineCap(this.ctx.lineCap);

          this._setLineWidth(this.ctx.lineWidth);

          this._setLineJoin(this.ctx.lineJoin);
        }
      },
      // some stubs

      /**
       * @name createEvent
       * @function
       */
      createEvent: function createEvent() {
        console.log("createEvent not implemented (yet)");
      },

      /**
       * @name toDataURL
       * @function
       */
      toDataURL: function toDataURL() {
        console.log("toDataUrl not implemented (yet)");
      },
      //helper functions
      _beginPath: function _beginPath() {
        this.path.push({
          type: "begin"
        });
      },
      _closePath: function _closePath() {
        var pathBegin = {
          x: 0,
          y: 0
        };
        var i = 0;
        var len = this.path.length;

        for (i = this.path.length - 1; i !== -1; i--) {
          if (this.path[i].type === "begin") {
            if (_typeof(this.path[i + 1]) === "object" && typeof this.path[i + 1].x === "number") {
              pathBegin = {
                x: this.path[i + 1].x,
                y: this.path[i + 1].y
              };
              var obj = {
                type: "lt",
                x: pathBegin.x,
                y: pathBegin.y
              };
              this.path.push(obj);
              break;
            }
          }
        } //TODO Repeat second move to get lineJoins correct, maybe only when lineJoin active in _drawPaths


        if (_typeof(this.path[i + 2]) === "object" && typeof this.path[i + 2].x === "number") {
          this.path.push(JSON.parse(JSON.stringify(this.path[i + 2])));
        }
      },
      _resetPath: function _resetPath() {
        this.path = [];
      },

      /**
       * Get the decimal values of r, g, b and a
       *
       * @name _getRGBA
       * @function
       * @private
       * @ignore
       */
      _getRGBA: function _getRGBA(style) {
        var r, g, b, a;

        if (style.isCanvasGradient === true) {
          style = style.getColor();
        }

        var rgbColor = new RGBColor(style);

        if (!style) {
          return {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
            style: style
          };
        }

        if (this.internal.rxTransparent.test(style)) {
          r = 0;
          g = 0;
          b = 0;
          a = 0;
        } else {
          var m = this.internal.rxRgb.exec(style);

          if (m != null) {
            r = parseInt(m[1]);
            g = parseInt(m[2]);
            b = parseInt(m[3]);
            a = 1;
          } else {
            m = this.internal.rxRgba.exec(style);

            if (m != null) {
              r = parseInt(m[1]);
              g = parseInt(m[2]);
              b = parseInt(m[3]);
              a = parseFloat(m[4]);
            } else {
              a = 1;

              if (style.charAt(0) != "#") {
                if (rgbColor.ok) {
                  style = rgbColor.toHex();
                } else {
                  style = "#000000";
                }
              }

              if (style.length === 4) {
                r = style.substring(1, 2);
                r += r;
                g = style.substring(2, 3);
                g += g;
                b = style.substring(3, 4);
                b += b;
              } else {
                r = style.substring(1, 3);
                g = style.substring(3, 5);
                b = style.substring(5, 7);
              }

              r = parseInt(r, 16);
              g = parseInt(g, 16);
              b = parseInt(b, 16);
            }
          }
        }

        return {
          r: r,
          g: g,
          b: b,
          a: a,
          style: style
        };
      },

      /**
       * @name _isFilllTransparent
       * @function
       * @private
       * @ignore
       * @returns {Boolean}
       */
      _isFillTransparent: function _isFillTransparent() {
        return this.ctx._isFillTransparent || this.globalAlpha == 0;
      },

      /**
       * @name _isStrokeTransparent
       * @function
       * @private
       * @ignore
       * @returns {Boolean}
       */
      _isStrokeTransparent: function _isStrokeTransparent() {
        return this.ctx._isStrokeTransparent || this.globalAlpha == 0;
      },

      /**
       * Sets the color, gradient, or pattern used to fill the drawing
       *
       * @name _setFillStyle
       * @function
       * @private
       * @ignore
       */
      _setFillStyle: function _setFillStyle(style) {
        var rgba;
        rgba = this._getRGBA(style);
        this.ctx.fillStyle = style;
        this.ctx._isFillTransparent = rgba.a === 0;
        this.ctx._fillOpacity = rgba.a;
        this.pdf.setFillColor(rgba.r, rgba.g, rgba.b, {
          a: rgba.a
        });
        this.pdf.setTextColor(rgba.r, rgba.g, rgba.b, {
          a: rgba.a
        });
      },

      /**
       * Sets the color, gradient, or pattern used for strokes
       *
       * @name _setStrokeStyle
       * @function
       * @private
       * @ignore
       */
      _setStrokeStyle: function _setStrokeStyle(style) {
        var rgba = this._getRGBA(style);

        this.ctx.strokeStyle = rgba.style;
        this.ctx._isStrokeTransparent = rgba.a === 0;
        this.ctx._strokeOpacity = rgba.a; //TODO jsPDF to handle rgba

        if (rgba.a === 0) {
          this.pdf.setDrawColor(255, 255, 255);
        } else if (rgba.a === 1) {
          this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
        } else {
          //this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b, {a: rgba.a});
          this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
        }
      },

      /**
       * Sets font properties for text content
       *
       * @name _setFont
       * @function
       * @param {String} The font property uses the same syntax as the CSS font property.
       * @private
       * @ignore
       */
      _setFont: function _setFont(font) {
        this.ctx.font = font;
        var rx, m; //source: https://stackoverflow.com/a/10136041

        rx = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\"\'\sa-z]+?)\s*$/i;
        m = rx.exec(font);

        if (m != null) {
          var fontStyle = m[1];
          var fontVariant = m[2];
          var fontWeight = m[3];
          var fontSize = m[4];
          var fontSizeUnit = m[5];
          var fontFamily = m[6];
        } else {
          return;
        }

        if ("px" === fontSizeUnit) {
          fontSize = Math.floor(parseFloat(fontSize)); // fontSize = fontSize * 1.25;
        } else if ("em" === fontSizeUnit) {
          fontSize = Math.floor(parseFloat(fontSize) * this.pdf.getFontSize());
        } else {
          fontSize = Math.floor(parseFloat(fontSize));
        }

        this.pdf.setFontSize(fontSize);
        var style = "";

        if (fontWeight === "bold" || parseInt(fontWeight, 10) >= 700 || fontStyle === "bold") {
          style = "bold";
        }

        if (fontStyle === "italic") {
          style += "italic";
        }

        if (style.length === 0) {
          style = "normal";
        }

        var jsPdfFontName = "";
        var parts = fontFamily.toLowerCase().replace(/"|'/g, "").split(/\s*,\s*/);
        var fallbackFonts = {
          arial: "Helvetica",
          verdana: "Helvetica",
          helvetica: "Helvetica",
          "sans-serif": "Helvetica",
          fixed: "Courier",
          monospace: "Courier",
          terminal: "Courier",
          courier: "Courier",
          times: "Times",
          cursive: "Times",
          fantasy: "Times",
          serif: "Times"
        };

        for (var i = 0; i < parts.length; i++) {
          if (this.pdf.internal.getFont(parts[i], style, {
            noFallback: true,
            disableWarning: true
          }) !== undefined) {
            jsPdfFontName = parts[i];
            break;
          } else if (style === "bolditalic" && this.pdf.internal.getFont(parts[i], "bold", {
            noFallback: true,
            disableWarning: true
          }) !== undefined) {
            jsPdfFontName = parts[i];
            style = "bold";
          } else if (this.pdf.internal.getFont(parts[i], "normal", {
            noFallback: true,
            disableWarning: true
          }) !== undefined) {
            jsPdfFontName = parts[i];
            style = "normal";
            break;
          }
        }

        if (jsPdfFontName === "") {
          for (var i = 0; i < parts.length; i++) {
            if (fallbackFonts[parts[i]]) {
              jsPdfFontName = fallbackFonts[parts[i]];
              break;
            }
          }
        }

        jsPdfFontName = jsPdfFontName === "" ? "Times" : jsPdfFontName;
        this.pdf.setFont(jsPdfFontName, style);
      },

      /**
       * @name _setTextBaseline
       * @function
       * @private
       * @ignore
       */
      _setTextBaseline: function _setTextBaseline(baseline) {
        this.ctx.textBaseline = baseline;
      },

      /**
       * @name _getTextBaseline
       * @function
       * @private
       * @ignore
       * @returns {Number}
       */
      _getTextBaseline: function _getTextBaseline() {
        return this.ctx.textBaseline;
      },

      /**
       * @name _setTextAlign
       * @function
       * @private
       * @ignore
       */
      _setTextAlign: function _setTextAlign(canvasAlign) {
        switch (canvasAlign) {
          case "right":
          case "end":
            this.ctx.textAlign = "right";
            break;

          case "center":
            this.ctx.textAlign = "center";
            break;

          case "left":
          case "start":
          default:
            this.ctx.textAlign = "left";
            break;
        }
      },

      /**
       * @name _getTextAlign
       * @function
       * @private
       * @ignore
       * @returns {String}
       */
      _getTextAlign: function _getTextAlign() {
        return this.ctx.textAlign;
      },

      /**
       * Draws "filled" text on the canvas
       *
       * @name fillText
       * @function
       * @param text {String} Specifies the text that will be written on the canvas
       * @param x {Number} The x coordinate where to start painting the text (relative to the canvas)
       * @param y {Number} The y coordinate where to start painting the text (relative to the canvas)
       * @param maxWidth {Number} Optional. The maximum allowed width of the text, in pixels
       * @description The fillText() method draws filled text on the canvas. The default color of the text is black.
       */
      fillText: function fillText(text, x, y, maxWidth) {
        if (this._isFillTransparent()) {
          return;
        }

        x = this._wrapX(x);
        y = this._wrapY(y);

        var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);

        x = xpt[0];
        y = xpt[1];

        var rads = this._matrix_rotation(this.ctx._transform);

        var degs = rads * 57.2958; // We only use X axis as scale hint

        var scale = 1;

        try {
          scale = this._matrix_decompose(this._getTransform()).scale[0];
        } catch (e) {
          console.warn(e);
        } // In some cases the transform was very small (5.715760606202283e-17).  Most likely a canvg rounding error.


        if (scale < 0.01) {
          this.pdf.text(text, x, this._getBaseline(y), {
            angle: degs,
            align: this.textAlign
          });
        } else {
          var oldSize = this.pdf.internal.getFontSize();
          this.pdf.setFontSize(oldSize * scale);
          this.pdf.text(text, x, this._getBaseline(y), {
            angle: degs,
            align: this.textAlign
          });
          this.pdf.setFontSize(oldSize);
        }
      },

      /**
       * Draws text on the canvas (no fill)
       *
       * @name strokeText
       * @function
       * @param text {String} Specifies the text that will be written on the canvas
       * @param x {Number} The x coordinate where to start painting the text (relative to the canvas)
       * @param y {Number} The y coordinate where to start painting the text (relative to the canvas)
       * @param maxWidth {Number} Optional. The maximum allowed width of the text, in pixels
       * @description The strokeText() method draws text (with no fill) on the canvas. The default color of the text is black.
       */
      strokeText: function strokeText(text, x, y, maxWidth) {
        if (this._isStrokeTransparent()) {
          return;
        }

        x = this._wrapX(x);
        y = this._wrapY(y);

        var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);

        x = xpt[0];
        y = xpt[1];

        var rads = this._matrix_rotation(this.ctx._transform);

        var degs = rads * 57.2958;
        var scale = 1; // We only use the X axis as scale hint

        try {
          scale = this._matrix_decompose(this._getTransform()).scale[0];
        } catch (e) {
          console.warn(e);
        }

        if (scale < 0.01) {
          this.pdf.text(text, x, this._getBaseline(y), {
            angle: degs,
            align: this.textAlign,
            renderingMode: "stroke"
          });
        } else {
          var oldSize = this.pdf.internal.getFontSize();
          this.pdf.setFontSize(oldSize * scale);
          this.pdf.text(text, x, this._getBaseline(y), {
            angle: degs,
            align: this.textAlign,
            renderingMode: "stroke"
          });
          this.pdf.setFontSize(oldSize);
        }
      },

      /**
       * Returns an object that contains the width of the specified text
       *
       * @name measureText
       * @function
       * @param text {String} The text to be measured
       * @description The measureText() method returns an object that contains the width of the specified text, in pixels.
       * @returns {Number}
       */
      measureText: function measureText(text) {
        var pdf = this.pdf;
        return {
          getWidth: function getWidth() {
            var fontSize = pdf.internal.getFontSize();
            var txtWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor; // Convert points to pixels
            //TODO Use scaleFactor?

            txtWidth *= 1.3333;
            return txtWidth;
          },

          get width() {
            return this.getWidth(text);
          }

        };
      },
      //Line Styles

      /**
       *
       * @name _setLineWidth
       * @function
       * @private
       * @ignore
       */
      _setLineWidth: function _setLineWidth(width) {
        this.ctx.lineWidth = width;
        this.pdf.setLineWidth(width);
      },

      /**
       * @name _setLineCap
       * @function
       * @private
       * @ignore
       */
      _setLineCap: function _setLineCap(style) {
        this.ctx.lineCap = style;
        this.pdf.setLineCap(style);
      },

      /**
       *
       * @name _setLineJoin
       * @function
       * @private
       * @ignore
       */
      _setLineJoin: function _setLineJoin(style) {
        this.ctx.lineJoin = style;
        this.pdf.setLineJoin(style);
      },

      /**
       *
       * @name _getLineJoin
       * @function
       * @private
       * @ignore
       */
      _getLineJoin: function _getLineJoin() {
        return this.ctx.lineJoin;
      },

      /**
       *
       * @name _wrapX
       * @function
       * @private
       * @ignore
       */
      _wrapX: function _wrapX(x) {
        if (this.pageWrapXEnabled) {
          return x % this.pageWrapX;
        } else {
          return x;
        }
      },

      /**
       * @name _wrapY
       * @function
       * @private
       * @ignore
       */
      _wrapY: function _wrapY(y) {
        if (this.pageWrapYEnabled) {
          this._gotoPage(this._page(y));

          return (y - this.lastBreak) % this.pageWrapY;
        } else {
          return y;
        }
      },
      //Transformations

      /**
       * Scales the current drawing bigger or smaller
       *
       * @name scale
       * @function
       * @param scalewidth {Number} Scales the width of the current drawing (1=100%, 0.5=50%, 2=200%, etc.)
       * @param scaleheight {Number} Scales the height of the current drawing (1=100%, 0.5=50%, 2=200%, etc.)
       * @description The scale() method scales the current drawing, bigger or smaller.
       */
      scale: function scale(scalewidth, scaleheight) {
        var matrix = [scalewidth, 0.0, 0.0, scaleheight, 0.0, 0.0];
        this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
      },

      /**
       * Rotates the current drawing
       *
       * @name rotate
       * @function
       * @param angle {Number} The rotation angle, in radians.
       * @description To calculate from degrees to radians: degrees*Math.PI/180. <br />
       * Example: to rotate 5 degrees, specify the following: 5*Math.PI/180
       */
      rotate: function rotate(angle) {
        var matrix = [Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0.0, 0.0];
        this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
      },

      /**
       * Remaps the (0,0) position on the canvas
       *
       * @name translate
       * @function
       * @param x {Number} The value to add to horizontal (x) coordinates
       * @param y {Number} The value to add to vertical (y) coordinates
       * @description The translate() method remaps the (0,0) position on the canvas.
       */
      translate: function translate(x, y) {
        var matrix = [1.0, 0.0, 0.0, 1.0, x, y];
        this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
      },

      /**
       * Replaces the current transformation matrix for the drawing
       *
       * @name transform
       * @function
       * @param a {Number} Horizontal scaling
       * @param b {Number} Horizontal skewing
       * @param c {Number} Vertical skewing
       * @param d {Number} Vertical scaling
       * @param e {Number} Horizontal moving
       * @param f {Number} Vertical moving
       * @description Each object on the canvas has a current transformation matrix.<br /><br />The transform() method replaces the current transformation matrix. It multiplies the current transformation matrix with the matrix described by:<br /><br /><br /><br />a	c	e<br /><br />b	d	f<br /><br />0	0	1<br /><br />In other words, the transform() method lets you scale, rotate, move, and skew the current context.
       */
      transform: function transform(a, b, c, d, e, f) {
        this.ctx._transform = this._matrix_multiply(this.ctx._transform, [a, b, c, d, e, f]);
      },

      /**
       * Resets the current transform to the identity matrix. Then runs transform()
       *
       * @name setTransform
       * @function
       * @param a {Number} Horizontal scaling
       * @param b {Number} Horizontal skewing
       * @param c {Number} Vertical skewing
       * @param d {Number} Vertical scaling
       * @param e {Number} Horizontal moving
       * @param f {Number} Vertical moving
       * @description Each object on the canvas has a current transformation matrix. <br /><br />The setTransform() method resets the current transform to the identity matrix, and then runs transform() with the same arguments.<br /><br />In other words, the setTransform() method lets you scale, rotate, move, and skew the current context.
       */
      setTransform: function setTransform(a, b, c, d, e, f) {
        this.ctx._transform = [a, b, c, d, e, f];
      },

      /**
       * @name _getTransform
       * @function
       * @private
       * @ignore
       */
      _getTransform: function _getTransform() {
        return this.ctx._transform;
      },
      lastBreak: 0,
      // Y Position of page breaks.
      pageBreaks: [],

      /**
       * Should only be used if pageWrapYEnabled is true
       *
       * @name _page
       * @function
       * @private
       * @ignore
       * @returns One-based Page Number
       */
      _page: function _page(y) {
        if (this.pageWrapYEnabled) {
          this.lastBreak = 0;
          var manualBreaks = 0;
          var autoBreaks = 0;

          for (var i = 0; i < this.pageBreaks.length; i++) {
            if (y >= this.pageBreaks[i]) {
              manualBreaks++;

              if (this.lastBreak === 0) {
                autoBreaks++;
              }

              var spaceBetweenLastBreak = this.pageBreaks[i] - this.lastBreak;
              this.lastBreak = this.pageBreaks[i];
              var pagesSinceLastBreak = Math.floor(spaceBetweenLastBreak / this.pageWrapY);
              autoBreaks += pagesSinceLastBreak;
            }
          }

          if (this.lastBreak === 0) {
            var pagesSinceLastBreak = Math.floor(y / this.pageWrapY) + 1;
            autoBreaks += pagesSinceLastBreak;
          }

          return autoBreaks + manualBreaks;
        } else {
          return this.pdf.internal.getCurrentPageInfo().pageNumber;
        }
      },
      _gotoPage: function _gotoPage(pageOneBased) {// This is a stub to be overriden if needed
      },

      /**
       * Draws an image, canvas, or video onto the canvas
       *
       * @function
       * @param img {} Specifies the image, canvas, or video element to use
       * @param sx {Number} Optional. The x coordinate where to start clipping
       * @param sy {Number} Optional. The y coordinate where to start clipping
       * @param swidth {Number} Optional. The width of the clipped image
       * @param sheight {Number} Optional. The height of the clipped image
       * @param x {Number} The x coordinate where to place the image on the canvas
       * @param y {Number} The y coordinate where to place the image on the canvas
       * @param width {Number} Optional. The width of the image to use (stretch or reduce the image)
       * @param height {Number} Optional. The height of the image to use (stretch or reduce the image)
       *
       */
      drawImage: function drawImage(img, x, y, w, h, x2, y2, w2, h2) {
        if (x2 !== undefined) {
          x = x2;
          y = y2;
          w = w2;
          h = h2;
        }

        x = this._wrapX(x);
        y = this._wrapY(y);

        var xRect = this._matrix_map_rect(this.ctx._transform, {
          x: x,
          y: y,
          w: w,
          h: h
        });

        var xRect2 = this._matrix_map_rect(this.ctx._transform, {
          x: x2,
          y: y2,
          w: w2,
          h: h2
        }); // TODO implement source clipping and image scaling


        var format;
        var rx = /data:image\/(\w+).*/i;
        var m = rx.exec(img);

        if (m != null) {
          format = m[1];
        } else {
          // format = "jpeg";
          format = "png";
        }

        this.pdf.addImage(img, format, xRect.x, xRect.y, xRect.w, xRect.h);
      },

      /**
       * Multiply the first matrix by the second
       *
       * @name matrix_multiply
       * @function
       * @param m1
       * @param m2
       * @returns {Array}
       * @private
       * @ignore
       */
      _matrix_multiply: function _matrix_multiply(m2, m1) {
        var sx = m1[0];
        var shy = m1[1];
        var shx = m1[2];
        var sy = m1[3];
        var tx = m1[4];
        var ty = m1[5];
        var t0 = sx * m2[0] + shy * m2[2];
        var t2 = shx * m2[0] + sy * m2[2];
        var t4 = tx * m2[0] + ty * m2[2] + m2[4];
        shy = sx * m2[1] + shy * m2[3];
        sy = shx * m2[1] + sy * m2[3];
        ty = tx * m2[1] + ty * m2[3] + m2[5];
        sx = t0;
        shx = t2;
        tx = t4;
        return [sx, shy, shx, sy, tx, ty];
      },

      /**
       * @name _matrix_rotation
       * @function
       * @private
       * @ignore
       */
      _matrix_rotation: function _matrix_rotation(m) {
        return Math.atan2(m[2], m[0]);
      },

      /**
       * @name _matrix_decompose
       * @function
       * @private
       * @ignore
       */
      _matrix_decompose: function _matrix_decompose(matrix) {
        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];
        var scaleX = Math.sqrt(a * a + b * b);
        a /= scaleX;
        b /= scaleX;
        var shear = a * c + b * d;
        c -= a * shear;
        d -= b * shear;
        var scaleY = Math.sqrt(c * c + d * d);
        c /= scaleY;
        d /= scaleY;
        shear /= scaleY;

        if (a * d < b * c) {
          a = -a;
          b = -b;
          shear = -shear;
          scaleX = -scaleX;
        }

        return {
          scale: [scaleX, 0, 0, scaleY, 0, 0],
          translate: [1, 0, 0, 1, matrix[4], matrix[5]],
          rotate: [a, b, -b, a, 0, 0],
          skew: [1, 0, shear, 1, 0, 0]
        };
      },

      /**
       * @name _matrix_map_point
       * @function
       * @private
       * @ignore
       */
      _matrix_map_point: function _matrix_map_point(m1, pt) {
        var sx = m1[0];
        var shy = m1[1];
        var shx = m1[2];
        var sy = m1[3];
        var tx = m1[4];
        var ty = m1[5];
        var px = pt[0];
        var py = pt[1];
        var x = px * sx + py * shx + tx;
        var y = px * shy + py * sy + ty;
        return [x, y];
      },

      /**
       * @name _matrix_map_point_obj
       * @function
       * @private
       * @ignore
       */
      _matrix_map_point_obj: function _matrix_map_point_obj(m1, pt) {
        var xpt = this._matrix_map_point(m1, [pt.x, pt.y]);

        return {
          x: xpt[0],
          y: xpt[1]
        };
      },

      /**
       * @name _matrix_map_rect
       * @function
       * @private
       * @ignore
       */
      _matrix_map_rect: function _matrix_map_rect(m1, rect) {
        var p1 = this._matrix_map_point(m1, [rect.x, rect.y]);

        var p2 = this._matrix_map_point(m1, [rect.x + rect.w, rect.y + rect.h]);

        return {
          x: p1[0],
          y: p1[1],
          w: p2[0] - p1[0],
          h: p2[1] - p1[1]
        };
      },

      /**
       * @name _matrix_is_identity
       * @function
       * @private
       * @ignore
       */
      _matrix_is_identity: function _matrix_is_identity(m1) {
        if (m1[0] != 1) {
          return false;
        }

        if (m1[1] != 0) {
          return false;
        }

        if (m1[2] != 0) {
          return false;
        }

        if (m1[3] != 1) {
          return false;
        }

        if (m1[4] != 0) {
          return false;
        }

        if (m1[5] != 0) {
          return false;
        }

        return true;
      },

      /**
       * Processes the paths
       *
       * @function
       * @param rule {String}
       * @param isClip {Boolean}
       * @private
       * @ignore
       */
      _drawPaths: function _drawPaths(rule, isClip) {
        var isStroke = rule === "stroke";
        var isFill = !isStroke;

        if (isStroke && !isClip && this._isStrokeTransparent()) {
          return;
        }

        if (isFill && !isClip && this._isFillTransparent()) {
          return;
        }

        var v2Support = typeof this.pdf.internal.newObject2 === "function";
        var lines;

        if (globalObj.outIntercept) {
          lines = globalObj.outIntercept.type === "group" ? globalObj.outIntercept.stream : globalObj.outIntercept;
        } else {
          lines = this.internal.getCurrentPage();
        }

        var moves = [];
        var outInterceptOld = globalObj.outIntercept;
        /*
          if (v2Support) {
            // Blend and Mask
            switch (this.ctx.globalCompositeOperation) {
              case 'normal':
              case 'source-over':
                break;
                case 'destination-in':
              case 'destination-out':
                //TODO this need to be added to the current group or page
                // define a mask stream
                var obj = this.pdf.internal.newStreamObject(); // define a mask state
                  var obj2 = this.pdf.internal.newObject2();
                obj2.push('<</Type /ExtGState');
                obj2.push('/SMask <</S /Alpha /G ' + obj.objId + ' 0 R>>'); // /S /Luminosity will need to define color space
                  obj2.push('>>'); // add mask to page resources
                  var gsName = 'MASK' + obj2.objId;
                this.pdf.internal.addGraphicsState(gsName, obj2.objId);
                var instruction = '/' + gsName + ' gs'; // add mask to page, group, or stream
                  lines.splice(0, 0, 'q');
                lines.splice(1, 0, instruction);
                lines.push('Q');
                globalObj.outIntercept = obj;
                break;
                default:
                var dictionaryEntry = '/' + this.pdf.internal.blendModeMap[this.ctx.globalCompositeOperation.toUpperCase()];
                  if (dictionaryEntry) {
                  this.pdf.internal.out(dictionaryEntry + ' gs');
                }
                  break;
            }
          }
        */

        var alpha = this.ctx.globalAlpha;

        if (this.ctx._fillOpacity < 1) {
          // TODO combine this with global opacity
          alpha = this.ctx._fillOpacity;
        } //TODO check for an opacity graphics state that was already created
        //TODO do not set opacity if current value is already active

        /*
          if (v2Support) {
            var objOpac = this.pdf.internal.newObject2();
            objOpac.push('<</Type /ExtGState'); //objOpac.push(this.ctx.globalAlpha + " CA"); // Stroke
            //objOpac.push(this.ctx.globalAlpha + " ca"); // Not Stroke
              objOpac.push('/CA ' + alpha); // Stroke
              objOpac.push('/ca ' + alpha); // Not Stroke
              objOpac.push('>>');
            var gsName = 'GS_O_' + objOpac.objId;
            this.pdf.internal.addGraphicsState(gsName, objOpac.objId);
            this.pdf.internal.out('/' + gsName + ' gs');
          }
        */


        var xPath = this.path;

        for (var i = 0; i < xPath.length; i++) {
          var pt = xPath[i];

          switch (pt.type) {
            case "begin":
              moves.push({
                begin: true
              });
              break;

            case "close":
              moves.push({
                close: true
              });
              break;

            case "mt":
              moves.push({
                start: pt,
                deltas: [],
                abs: []
              });
              break;

            case "lt":
              var delta = [pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
              var iii = moves.length;

              if (iii > 0) {
                for (iii; iii > 0; iii--) {
                  if (moves[iii - 1].close !== true && moves[iii - 1].begin !== true) {
                    moves[iii - 1].deltas.push(delta);
                    moves[iii - 1].abs.push(pt);
                    break;
                  }
                }
              }

              break;

            case "bct":
              var delta = [pt.x1 - xPath[i - 1].x, pt.y1 - xPath[i - 1].y, pt.x2 - xPath[i - 1].x, pt.y2 - xPath[i - 1].y, pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
              moves[moves.length - 1].deltas.push(delta);
              break;

            case "qct":
              // convert to bezier
              var x1 = xPath[i - 1].x + 2.0 / 3.0 * (pt.x1 - xPath[i - 1].x);
              var y1 = xPath[i - 1].y + 2.0 / 3.0 * (pt.y1 - xPath[i - 1].y);
              var x2 = pt.x + 2.0 / 3.0 * (pt.x1 - pt.x);
              var y2 = pt.y + 2.0 / 3.0 * (pt.y1 - pt.y);
              var x3 = pt.x;
              var y3 = pt.y;
              var delta = [x1 - xPath[i - 1].x, y1 - xPath[i - 1].y, x2 - xPath[i - 1].x, y2 - xPath[i - 1].y, x3 - xPath[i - 1].x, y3 - xPath[i - 1].y];
              moves[moves.length - 1].deltas.push(delta);
              break;

            case "arc":
              moves.push({
                deltas: [],
                abs: []
              });
              moves[moves.length - 1].arc = true;

              if (Array.isArray(moves[moves.length - 1].abs)) {
                moves[moves.length - 1].abs.push(pt);
              }

              break;
          }
        }

        var style;

        if (!isClip) {
          if (isStroke) {
            style = "S";
          } else {
            style = "f";
          }
        } else {
          style = null;
        }

        for (var i = 0; i < moves.length; i++) {
          if (moves[i].begin) ;

          if (moves[i].arc) {
            if (moves[i].start) {
              this.internal.move2(this, moves[i].start.x, moves[i].start.y);
            }

            var arcs = moves[i].abs;

            for (var ii = 0; ii < arcs.length; ii++) {
              var arc = arcs[ii]; //TODO lines deltas were getting in here

              if (typeof arc.startAngle !== "undefined") {
                var start = arc.startAngle * 360 / (2 * Math.PI);
                var end = arc.endAngle * 360 / (2 * Math.PI);
                var x = arc.x;
                var y = arc.y;
                this.internal.arc2(this, x, y, arc.radius, start, end, arc.counterclockwise, style, isClip);
              } else {
                this.internal.line2(c2d, arc.x, arc.y);
              }
            }
          }

          if (!moves[i].arc) {
            if (moves[i].close !== true && moves[i].begin !== true) {
              var x = moves[i].start.x;
              var y = moves[i].start.y;
              this.pdf.lines(moves[i].deltas, x, y, null, null);
            }
          }

          if (moves[i].close) ;
        }

        if (style) {
          this.pdf.internal.out(style);
        }

        if (isClip) {
          this.pdf.clip();
        }

        globalObj.outIntercept = outInterceptOld; // if (this.ctx._clip_path.length > 0) {
        //     lines.push('Q');
        // }
      },

      /*
          _pushMask: function () {
              var v2Support = typeof this.pdf.internal.newObject2 === 'function';
                if (!v2Support) {
                  console.log('jsPDF v2 not enabled')
                  return;
              }
                // define a mask stream
              var obj = this.pdf.internal.newStreamObject();
                // define a mask state
              var obj2 = this.pdf.internal.newObject2();
              obj2.push('<</Type /ExtGState');
              obj2.push('/SMask <</S /Alpha /G ' + obj.objId + ' 0 R>>'); // /S /Luminosity will need to define color space
              obj2.push('>>');
                // add mask to page resources
              var gsName = 'MASK' + obj2.objId;
              this.pdf.internal.addGraphicsState(gsName, obj2.objId);
                var instruction = '/' + gsName + ' gs';
              this.pdf.internal.out(instruction);
          },
      */
      _getBaseline: function _getBaseline(y) {
        var height = parseInt(this.pdf.internal.getFontSize() / this.pdf.internal.scaleFactor); // TODO Get descent from font descriptor

        var descent = height * 0.25;

        switch (this.ctx.textBaseline) {
          case "bottom":
            return y - descent;

          case "top":
            return y + height;

          case "hanging":
            return y + height - descent;

          case "middle":
            return y + height / 2 - descent;

          case "ideographic":
            // TODO not implemented
            return y;

          case "alphabetic":
          default:
            return y;
        }
      },
      createLinearGradient: function createLinearGradient() {
        var canvasGradient = function canvasGradient() {};

        canvasGradient.colorStops = [];

        canvasGradient.addColorStop = function (offset, color) {
          this.colorStops.push([offset, color]);
        };

        canvasGradient.getColor = function () {
          if (this.colorStops.length === 0) {
            return "#000000";
          }

          return this.colorStops[0][1];
        };

        canvasGradient.isCanvasGradient = true;
        return canvasGradient;
      },
      createPattern: function createPattern() {
        return this.createLinearGradient();
      },
      createRadialGradient: function createRadialGradient() {
        return this.createLinearGradient();
      }
    };
    var c2d = jsPDFAPI.context2d;
    /**
     * Sets or returns the color, gradient, or pattern used to fill the drawing
     *
     * @name fillStyle
     * @default #000000
     * @property {(color|gradient|pattern)} value The color of the drawing. Default value is #000000<br />
     * A gradient object (linear or radial) used to fill the drawing (not supported by context2d)<br />
     * A pattern object to use to fill the drawing (not supported by context2d)
     */

    Object.defineProperty(c2d, "fillStyle", {
      set: function set(value) {
        this._setFillStyle(value);
      },
      get: function get() {
        return this.ctx.fillStyle;
      }
    });
    /**
     * Sets or returns the color, gradient, or pattern used for strokes
     *
     * @name strokeStyle
     * @default #000000
     * @property {color} color A CSS color value that indicates the stroke color of the drawing. Default value is #000000 (not supported by context2d)
     * @property {gradient} gradient A gradient object (linear or radial) used to create a gradient stroke (not supported by context2d)
     * @property {pattern} pattern A pattern object used to create a pattern stroke (not supported by context2d)
     */

    Object.defineProperty(c2d, "strokeStyle", {
      set: function set(value) {
        this._setStrokeStyle(value);
      },
      get: function get() {
        return this.ctx.strokeStyle;
      }
    }); //Line Styles

    /**
     * Sets or returns the style of the end caps for a line
     *
     * @name lineCap
     * @default butt
     * @property {(butt|round|square)} lineCap butt A flat edge is added to each end of the line <br/>
     * round A rounded end cap is added to each end of the line<br/>
     * square A square end cap is added to each end of the line<br/>
     */

    Object.defineProperty(c2d, "lineCap", {
      set: function set(val) {
        this._setLineCap(val);
      },
      get: function get() {
        return this.ctx.lineCap;
      }
    });
    /**
     * Sets or returns the current line width
     *
     * @name lineWidth
     * @default 1
     * @property {number} lineWidth The current line width, in pixels
     */

    Object.defineProperty(c2d, "lineWidth", {
      set: function set(value) {
        this._setLineWidth(value);
      },
      get: function get() {
        return this.ctx.lineWidth;
      }
    });
    /**
     * Sets or returns the type of corner created, when two lines meet
     */

    Object.defineProperty(c2d, "lineJoin", {
      set: function set(val) {
        this._setLineJoin(val);
      },
      get: function get() {
        return this.ctx.lineJoin;
      }
    });
    /**
     * Sets or returns the maximum miter length
     */

    Object.defineProperty(c2d, "miterLimit", {
      set: function set(val) {
        this.ctx.miterLimit = val;
      },
      get: function get() {
        return this.ctx.miterLimit;
      }
    });
    Object.defineProperty(c2d, "textBaseline", {
      set: function set(value) {
        this._setTextBaseline(value);
      },
      get: function get() {
        return this._getTextBaseline();
      }
    });
    Object.defineProperty(c2d, "textAlign", {
      set: function set(value) {
        this._setTextAlign(value);
      },
      get: function get() {
        return this._getTextAlign();
      }
    });
    Object.defineProperty(c2d, "font", {
      set: function set(value) {
        this._setFont(value);
      },
      get: function get() {
        return this.ctx.font;
      }
    });
    Object.defineProperty(c2d, "globalCompositeOperation", {
      set: function set(value) {
        this.ctx.globalCompositeOperation = value;
      },
      get: function get() {
        return this.ctx.globalCompositeOperation;
      }
    });
    Object.defineProperty(c2d, "globalAlpha", {
      set: function set(value) {
        this.ctx.globalAlpha = value;
      },
      get: function get() {
        return this.ctx.globalAlpha;
      }
    });
    Object.defineProperty(c2d, "canvas", {
      get: function get() {
        return {
          parentNode: false,
          style: false
        };
      }
    }); // Not HTML API

    Object.defineProperty(c2d, "ignoreClearRect", {
      set: function set(value) {
        this.ctx.ignoreClearRect = value;
      },
      get: function get() {
        return this.ctx.ignoreClearRect;
      }
    }); // End Not HTML API

    c2d.internal = {};
    c2d.internal.rxRgb = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
    c2d.internal.rxRgba = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/;
    c2d.internal.rxTransparent = /transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/; // http://hansmuller-flex.blogspot.com/2011/10/more-about-approximating-circular-arcs.html

    c2d.internal.arc = function (c2d, xc, yc, r, a1, a2, counterclockwise, style) {
      var k = this.pdf.internal.scaleFactor;
      var pageHeight = this.pdf.internal.pageSize.getHeight();
      var f2 = this.pdf.internal.f2;
      var a1r = a1 * (Math.PI / 180);
      var a2r = a2 * (Math.PI / 180);
      var curves = this.createArc(r, a1r, a2r, counterclockwise);

      for (var i = 0; i < curves.length; i++) {
        var curve = curves[i];

        if (i === 0) {
          this.pdf.internal.out([f2((curve.x1 + xc) * k), f2((pageHeight - (curve.y1 + yc)) * k), "m", f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), "c"].join(" "));
        } else {
          this.pdf.internal.out([f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), "c"].join(" "));
        } //c2d._lastPoint = {x: curve.x1 + xc, y: curve.y1 + yc};


        c2d._lastPoint = {
          x: xc,
          y: yc
        }; // f2((curve.x1 + xc) * k), f2((pageHeight - (curve.y1 + yc)) * k), 'm', f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'
      }

      if (style !== null) {
        this.pdf.internal.out(this.pdf.internal.getStyle(style));
      }
    };
    /**
     *
     * @param x Edge point X
     * @param y Edge point Y
     * @param r Radius
     * @param a1 start angle
     * @param a2 end angle
     * @param counterclockwise
     * @param style
     * @param isClip
     */


    c2d.internal.arc2 = function (c2d, x, y, r, a1, a2, counterclockwise, style, isClip) {
      // we need to convert from cartesian to polar here methinks.
      var centerX = x; // + r;

      var centerY = y;

      if (!isClip) {
        this.arc(c2d, centerX, centerY, r, a1, a2, counterclockwise, style);
      } else {
        this.arc(c2d, centerX, centerY, r, a1, a2, counterclockwise, null);
        this.pdf.clip();
      }
    };

    c2d.internal.move2 = function (c2d, x, y) {
      var k = this.pdf.internal.scaleFactor;
      var pageHeight = this.pdf.internal.pageSize.getHeight();
      var f2 = this.pdf.internal.f2;
      this.pdf.internal.out([f2(x * k), f2((pageHeight - y) * k), "m"].join(" "));
      c2d._lastPoint = {
        x: x,
        y: y
      };
    };

    c2d.internal.line2 = function (c2d, dx, dy) {
      var k = this.pdf.internal.scaleFactor;
      var pageHeight = this.pdf.internal.pageSize.getHeight();
      var f2 = this.pdf.internal.f2; //var pt = {x: c2d._lastPoint.x + dx, y: c2d._lastPoint.y + dy};

      var pt = {
        x: dx,
        y: dy
      };
      this.pdf.internal.out([f2(pt.x * k), f2((pageHeight - pt.y) * k), "l"].join(" ")); //this.pdf.internal.out('f');

      c2d._lastPoint = pt;
    };
    /**
     * Return a array of objects that represent bezier curves which approximate the circular arc centered at the origin, from startAngle to endAngle (radians) with the specified radius.
     *
     * Each bezier curve is an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
     */


    c2d.internal.createArc = function (radius, startAngle, endAngle, anticlockwise) {
      var EPSILON = 0.00001; // Roughly 1/1000th of a degree, see below
      // normalize startAngle, endAngle to [-2PI, 2PI]

      var twoPI = Math.PI * 2;
      var startAngleN = startAngle;

      if (startAngleN < twoPI || startAngleN > twoPI) {
        startAngleN = startAngleN % twoPI;
      }

      var endAngleN = endAngle;

      if (endAngleN < twoPI || endAngleN > twoPI) {
        endAngleN = endAngleN % twoPI;
      } // Compute the sequence of arc curves, up to PI/2 at a time.
      // Total arc angle is less than 2PI.


      var curves = [];
      var piOverTwo = Math.PI / 2.0; //var sgn = (startAngle < endAngle) ? +1 : -1; // clockwise or counterclockwise

      var sgn = anticlockwise ? -1 : +1;
      var a1 = startAngle;

      for (var totalAngle = Math.min(twoPI, Math.abs(endAngleN - startAngleN)); totalAngle > EPSILON;) {
        var a2 = a1 + sgn * Math.min(totalAngle, piOverTwo);
        curves.push(this.createSmallArc(radius, a1, a2));
        totalAngle -= Math.abs(a2 - a1);
        a1 = a2;
      }

      return curves;
    };

    c2d.internal.getCurrentPage = function () {
      return this.pdf.internal.pages[this.pdf.internal.getCurrentPageInfo().pageNumber];
    };
    /**
     * Cubic bezier approximation of a circular arc centered at the origin, from (radians) a1 to a2, where a2-a1 < pi/2. The arc's radius is r.
     *
     * Returns an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
     *
     * This algorithm is based on the approach described in: A. Riškus, "Approximation of a Cubic Bezier Curve by Circular Arcs and Vice Versa," Information Technology and Control, 35(4), 2006 pp. 371-378.
     */


    c2d.internal.createSmallArc = function (r, a1, a2) {
      // Compute all four points for an arc that subtends the same total angle
      // but is centered on the X-axis
      var a = (a2 - a1) / 2.0;
      var x4 = r * Math.cos(a);
      var y4 = r * Math.sin(a);
      var x1 = x4;
      var y1 = -y4;
      var q1 = x1 * x1 + y1 * y1;
      var q2 = q1 + x1 * x4 + y1 * y4;
      var k2 = 4 / 3 * (Math.sqrt(2 * q1 * q2) - q2) / (x1 * y4 - y1 * x4);
      var x2 = x1 - k2 * y1;
      var y2 = y1 + k2 * x1;
      var x3 = x2;
      var y3 = -y2; // Find the arc points' actual locations by computing x1,y1 and x4,y4
      // and rotating the control points by a + a1

      var ar = a + a1;
      var cos_ar = Math.cos(ar);
      var sin_ar = Math.sin(ar);
      return {
        x1: r * Math.cos(a1),
        y1: r * Math.sin(a1),
        x2: x2 * cos_ar - y2 * sin_ar,
        y2: x2 * sin_ar + y2 * cos_ar,
        x3: x3 * cos_ar - y3 * sin_ar,
        y3: x3 * sin_ar + y3 * cos_ar,
        x4: r * Math.cos(a2),
        y4: r * Math.sin(a2)
      };
    };
    /**
     *
     * @function
     * @constructor
     */


    function context() {
      this._isStrokeTransparent = false;
      this._strokeOpacity = 1;
      this.strokeStyle = "#000000";
      this.fillStyle = "#000000";
      this._isFillTransparent = false;
      this._fillOpacity = 1;
      this.font = "12pt times";
      this.textBaseline = "alphabetic"; // top,bottom,middle,ideographic,alphabetic,hanging

      this.textAlign = "left";
      this.lineWidth = 1;
      this.lineJoin = "miter"; // round, bevel, miter

      this.lineCap = "butt"; // butt, round, square

      this._transform = [1, 0, 0, 1, 0, 0]; // sx, shy, shx, sy, tx, ty

      this.globalCompositeOperation = "normal";
      this.globalAlpha = 1.0;
      this._clip_path = [];
      this.currentPoint = {
        x: 0,
        y: 0
      }; // TODO miter limit //default 10
      // Not HTML API

      this.ignoreClearRect = false;

      this.copy = function (ctx) {
        this._isStrokeTransparent = ctx._isStrokeTransparent;
        this._strokeOpacity = ctx._strokeOpacity;
        this.strokeStyle = ctx.strokeStyle;
        this._isFillTransparent = ctx._isFillTransparent;
        this._fillOpacity = ctx._fillOpacity;
        this.fillStyle = ctx.fillStyle;
        this.font = ctx.font;
        this.lineWidth = ctx.lineWidth;
        this.lineJoin = ctx.lineJoin;
        this.lineCap = ctx.lineCap;
        this.textBaseline = ctx.textBaseline;
        this.textAlign = ctx.textAlign;
        this._fontSize = ctx._fontSize;
        this._transform = ctx._transform.slice(0);
        this.globalCompositeOperation = ctx.globalCompositeOperation;
        this.globalAlpha = ctx.globalAlpha;
        this._clip_path = ctx._clip_path.slice(0); //TODO deep copy?

        this.currentPoint = ctx.currentPoint; // Not HTML API

        this.ignoreClearRect = ctx.ignoreClearRect;
      };
    }

    return this;
  })(jsPDF.API, typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || Function('return typeof this === "object" && this.content')() || Function("return this")());

  /**
   * Copyright (c) 2018 Erik Koopmans
   * Released under the MIT License.
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * jsPDF html PlugIn
   *
   * @name html
   * @module
   */
  (function (jsPDFAPI, global) {
    /**
     * Determine the type of a variable/object.
     *
     * @private
     * @ignore
     */

    var objType = function objType(obj) {
      var type = _typeof(obj);

      if (type === "undefined") return "undefined";else if (type === "string" || obj instanceof String) return "string";else if (type === "number" || obj instanceof Number) return "number";else if (type === "function" || obj instanceof Function) return "function";else if (!!obj && obj.constructor === Array) return "array";else if (obj && obj.nodeType === 1) return "element";else if (type === "object") return "object";else return "unknown";
    };
    /**
     * Create an HTML element with optional className, innerHTML, and style.
     *
     * @private
     * @ignore
     */


    var createElement = function createElement(tagName, opt) {
      var el = document.createElement(tagName);
      if (opt.className) el.className = opt.className;

      if (opt.innerHTML) {
        el.innerHTML = opt.innerHTML;
        var scripts = el.getElementsByTagName("script");

        for (var i = scripts.length; i-- > 0; null) {
          scripts[i].parentNode.removeChild(scripts[i]);
        }
      }

      for (var key in opt.style) {
        el.style[key] = opt.style[key];
      }

      return el;
    };
    /**
     * Deep-clone a node and preserve contents/properties.
     *
     * @private
     * @ignore
     */


    var cloneNode = function cloneNode(node, javascriptEnabled) {
      // Recursively clone the node.
      var clone = node.nodeType === 3 ? document.createTextNode(node.nodeValue) : node.cloneNode(false);

      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (javascriptEnabled === true || child.nodeType !== 1 || child.nodeName !== "SCRIPT") {
          clone.appendChild(cloneNode(child, javascriptEnabled));
        }
      }

      if (node.nodeType === 1) {
        // Preserve contents/properties of special nodes.
        if (node.nodeName === "CANVAS") {
          clone.width = node.width;
          clone.height = node.height;
          clone.getContext("2d").drawImage(node, 0, 0);
        } else if (node.nodeName === "TEXTAREA" || node.nodeName === "SELECT") {
          clone.value = node.value;
        } // Preserve the node's scroll position when it loads.


        clone.addEventListener("load", function () {
          clone.scrollTop = node.scrollTop;
          clone.scrollLeft = node.scrollLeft;
        }, true);
      } // Return the cloned node.


      return clone;
    };
    /* ----- CONSTRUCTOR ----- */


    var Worker = function Worker(opt) {
      // Create the root parent for the proto chain, and the starting Worker.
      var root = Object.assign(Worker.convert(Promise.resolve()), JSON.parse(JSON.stringify(Worker.template)));
      var self = Worker.convert(Promise.resolve(), root); // Set progress, optional settings, and return.

      self = self.setProgress(1, Worker, 1, [Worker]);
      self = self.set(opt);
      return self;
    }; // Boilerplate for subclassing Promise.


    Worker.prototype = Object.create(Promise.prototype);
    Worker.prototype.constructor = Worker; // Converts/casts promises into Workers.

    Worker.convert = function convert(promise, inherit) {
      // Uses prototypal inheritance to receive changes made to ancestors' properties.
      promise.__proto__ = inherit || Worker.prototype;
      return promise;
    };

    Worker.template = {
      prop: {
        src: null,
        container: null,
        overlay: null,
        canvas: null,
        img: null,
        pdf: null,
        pageSize: null,
        callback: function callback() {}
      },
      progress: {
        val: 0,
        state: null,
        n: 0,
        stack: []
      },
      opt: {
        filename: "file.pdf",
        margin: [0, 0, 0, 0],
        enableLinks: true,
        html2canvas: {},
        jsPDF: {}
      }
    };
    /* ----- FROM / TO ----- */

    Worker.prototype.from = function from(src, type) {
      function getType(src) {
        switch (objType(src)) {
          case "string":
            return "string";

          case "element":
            return src.nodeName.toLowerCase === "canvas" ? "canvas" : "element";

          default:
            return "unknown";
        }
      }

      return this.then(function from_main() {
        type = type || getType(src);

        switch (type) {
          case "string":
            return this.set({
              src: createElement("div", {
                innerHTML: src
              })
            });

          case "element":
            return this.set({
              src: src
            });

          case "canvas":
            return this.set({
              canvas: src
            });

          case "img":
            return this.set({
              img: src
            });

          default:
            return this.error("Unknown source type.");
        }
      });
    };

    Worker.prototype.to = function to(target) {
      // Route the 'to' request to the appropriate method.
      switch (target) {
        case "container":
          return this.toContainer();

        case "canvas":
          return this.toCanvas();

        case "img":
          return this.toImg();

        case "pdf":
          return this.toPdf();

        default:
          return this.error("Invalid target.");
      }
    };

    Worker.prototype.toContainer = function toContainer() {
      // Set up function prerequisites.
      var prereqs = [function checkSrc() {
        return this.prop.src || this.error("Cannot duplicate - no source HTML.");
      }, function checkPageSize() {
        return this.prop.pageSize || this.setPageSize();
      }];
      return this.thenList(prereqs).then(function toContainer_main() {
        // Define the CSS styles for the container and its overlay parent.
        var overlayCSS = {
          position: "fixed",
          overflow: "hidden",
          zIndex: 1000,
          left: "-100000px",
          right: 0,
          bottom: 0,
          top: 0
        };
        var containerCSS = {
          position: "relative",
          display: "inline-block",
          width: Math.max(this.prop.src.clientWidth, this.prop.src.scrollWidth, this.prop.src.offsetWidth) + "px",
          left: 0,
          right: 0,
          top: 0,
          margin: "auto",
          backgroundColor: "white"
        }; // Set the overlay to hidden (could be changed in the future to provide a print preview).

        var source = cloneNode(this.prop.src, this.opt.html2canvas.javascriptEnabled);

        if (source.tagName === "BODY") {
          containerCSS.height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) + "px";
        }

        this.prop.overlay = createElement("div", {
          className: "html2pdf__overlay",
          style: overlayCSS
        });
        this.prop.container = createElement("div", {
          className: "html2pdf__container",
          style: containerCSS
        });
        this.prop.container.appendChild(source);
        this.prop.container.firstChild.appendChild(createElement("div", {
          style: {
            clear: "both",
            border: "0 none transparent",
            margin: 0,
            padding: 0,
            height: 0
          }
        }));
        this.prop.container.style.float = "none";
        this.prop.overlay.appendChild(this.prop.container);
        document.body.appendChild(this.prop.overlay);
        this.prop.container.firstChild.style.position = "relative";
        this.prop.container.height = Math.max(this.prop.container.firstChild.clientHeight, this.prop.container.firstChild.scrollHeight, this.prop.container.firstChild.offsetHeight) + "px";
      });
    };

    Worker.prototype.toCanvas = function toCanvas() {
      // Set up function prerequisites.
      var prereqs = [function checkContainer() {
        return document.body.contains(this.prop.container) || this.toContainer();
      }]; // Fulfill prereqs then create the canvas.

      return this.thenList(prereqs).then(function toCanvas_main() {
        // Handle old-fashioned 'onrendered' argument.
        var options = Object.assign({}, this.opt.html2canvas);
        delete options.onrendered;

        if (!this.isHtml2CanvasLoaded()) {
          return;
        }

        return html2canvas(this.prop.container, options);
      }).then(function toCanvas_post(canvas) {
        // Handle old-fashioned 'onrendered' argument.
        var onRendered = this.opt.html2canvas.onrendered || function () {};

        onRendered(canvas);
        this.prop.canvas = canvas;
        document.body.removeChild(this.prop.overlay);
      });
    };

    Worker.prototype.toContext2d = function toContext2d() {
      // Set up function prerequisites.
      var prereqs = [function checkContainer() {
        return document.body.contains(this.prop.container) || this.toContainer();
      }]; // Fulfill prereqs then create the canvas.

      return this.thenList(prereqs).then(function toContext2d_main() {
        // Handle old-fashioned 'onrendered' argument.
        var pdf = this.opt.jsPDF;
        var options = Object.assign({
          async: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          imageTimeout: 15000,
          logging: true,
          proxy: null,
          removeContainer: true,
          foreignObjectRendering: false,
          useCORS: false
        }, this.opt.html2canvas);
        delete options.onrendered;
        options.windowHeight = options.windowHeight || 0;
        options.windowHeight = options.windowHeight == 0 ? Math.max(this.prop.container.clientHeight, this.prop.container.scrollHeight, this.prop.container.offsetHeight) : options.windowHeight;

        if (!this.isHtml2CanvasLoaded()) {
          return;
        }

        return html2canvas(this.prop.container, options);
      }).then(function toContext2d_post(canvas) {
        // Handle old-fashioned 'onrendered' argument.
        var onRendered = this.opt.html2canvas.onrendered || function () {};

        onRendered(canvas);
        this.prop.canvas = canvas;
        document.body.removeChild(this.prop.overlay);
      });
    };

    Worker.prototype.toImg = function toImg() {
      // Set up function prerequisites.
      var prereqs = [function checkCanvas() {
        return this.prop.canvas || this.toCanvas();
      }]; // Fulfill prereqs then create the image.

      return this.thenList(prereqs).then(function toImg_main() {
        var imgData = this.prop.canvas.toDataURL("image/" + this.opt.image.type, this.opt.image.quality);
        this.prop.img = document.createElement("img");
        this.prop.img.src = imgData;
      });
    };

    Worker.prototype.toPdf = function toPdf() {
      // Set up function prerequisites.
      var prereqs = [function checkContext2d() {
        return this.toContext2d();
      } //function checkCanvas() { return this.prop.canvas || this.toCanvas(); }
      ]; // Fulfill prereqs then create the image.

      return this.thenList(prereqs).then(function toPdf_main() {
        // Create local copies of frequently used properties.
        this.prop.pdf = this.prop.pdf || this.opt.jsPDF;
      });
    };
    /* ----- OUTPUT / SAVE ----- */


    Worker.prototype.output = function output(type, options, src) {
      // Redirect requests to the correct function (outputPdf / outputImg).
      src = src || "pdf";

      if (src.toLowerCase() === "img" || src.toLowerCase() === "image") {
        return this.outputImg(type, options);
      } else {
        return this.outputPdf(type, options);
      }
    };

    Worker.prototype.outputPdf = function outputPdf(type, options) {
      // Set up function prerequisites.
      var prereqs = [function checkPdf() {
        return this.prop.pdf || this.toPdf();
      }]; // Fulfill prereqs then perform the appropriate output.

      return this.thenList(prereqs).then(function outputPdf_main() {
        /* Currently implemented output types:
        *    https://rawgit.com/MrRio/jsPDF/master/docs/jspdf.js.html#line992
        *  save(options), arraybuffer, blob, bloburi/bloburl,
        *  datauristring/dataurlstring, dataurlnewwindow, datauri/dataurl
        */
        return this.prop.pdf.output(type, options);
      });
    };

    Worker.prototype.outputImg = function outputImg(type, options) {
      // Set up function prerequisites.
      var prereqs = [function checkImg() {
        return this.prop.img || this.toImg();
      }]; // Fulfill prereqs then perform the appropriate output.

      return this.thenList(prereqs).then(function outputImg_main() {
        switch (type) {
          case undefined:
          case "img":
            return this.prop.img;

          case "datauristring":
          case "dataurlstring":
            return this.prop.img.src;

          case "datauri":
          case "dataurl":
            return document.location.href = this.prop.img.src;

          default:
            throw 'Image output type "' + type + '" is not supported.';
        }
      });
    };

    Worker.prototype.isHtml2CanvasLoaded = function () {
      var result = typeof global.html2canvas !== "undefined";

      if (!result) {
        console.error("html2canvas not loaded.");
      }

      return result;
    };

    Worker.prototype.save = function save(filename) {
      // Set up function prerequisites.
      var prereqs = [function checkPdf() {
        return this.prop.pdf || this.toPdf();
      }];

      if (!this.isHtml2CanvasLoaded()) {
        return;
      } // Fulfill prereqs, update the filename (if provided), and save the PDF.


      return this.thenList(prereqs).set(filename ? {
        filename: filename
      } : null).then(function save_main() {
        this.prop.pdf.save(this.opt.filename);
      });
    };

    Worker.prototype.doCallback = function doCallback(filename) {
      // Set up function prerequisites.
      var prereqs = [function checkPdf() {
        return this.prop.pdf || this.toPdf();
      }];

      if (!this.isHtml2CanvasLoaded()) {
        return;
      } // Fulfill prereqs, update the filename (if provided), and save the PDF.


      return this.thenList(prereqs).then(function doCallback_main() {
        this.prop.callback(this.prop.pdf);
      });
    };
    /* ----- SET / GET ----- */


    Worker.prototype.set = function set(opt) {
      // TODO: Implement ordered pairs?
      // Silently ignore invalid or empty input.
      if (objType(opt) !== "object") {
        return this;
      } // Build an array of setter functions to queue.


      var fns = Object.keys(opt || {}).map(function (key) {
        if (key in Worker.template.prop) {
          // Set pre-defined properties.
          return function set_prop() {
            this.prop[key] = opt[key];
          };
        } else {
          switch (key) {
            case "margin":
              return this.setMargin.bind(this, opt.margin);

            case "jsPDF":
              return function set_jsPDF() {
                this.opt.jsPDF = opt.jsPDF;
                return this.setPageSize();
              };

            case "pageSize":
              return this.setPageSize.bind(this, opt.pageSize);

            default:
              // Set any other properties in opt.
              return function set_opt() {
                this.opt[key] = opt[key];
              };
          }
        }
      }, this); // Set properties within the promise chain.

      return this.then(function set_main() {
        return this.thenList(fns);
      });
    };

    Worker.prototype.get = function get(key, cbk) {
      return this.then(function get_main() {
        // Fetch the requested property, either as a predefined prop or in opt.
        var val = key in Worker.template.prop ? this.prop[key] : this.opt[key];
        return cbk ? cbk(val) : val;
      });
    };

    Worker.prototype.setMargin = function setMargin(margin) {
      return this.then(function setMargin_main() {
        // Parse the margin property.
        switch (objType(margin)) {
          case "number":
            margin = [margin, margin, margin, margin];

          case "array":
            if (margin.length === 2) {
              margin = [margin[0], margin[1], margin[0], margin[1]];
            }

            if (margin.length === 4) {
              break;
            }

          default:
            return this.error("Invalid margin array.");
        } // Set the margin property, then update pageSize.


        this.opt.margin = margin;
      }).then(this.setPageSize);
    };

    Worker.prototype.setPageSize = function setPageSize(pageSize) {
      function toPx(val, k) {
        return Math.floor(val * k / 72 * 96);
      }

      return this.then(function setPageSize_main() {
        // Retrieve page-size based on jsPDF settings, if not explicitly provided.
        pageSize = pageSize || jsPDF.getPageSize(this.opt.jsPDF); // Add 'inner' field if not present.

        if (!pageSize.hasOwnProperty("inner")) {
          pageSize.inner = {
            width: pageSize.width - this.opt.margin[1] - this.opt.margin[3],
            height: pageSize.height - this.opt.margin[0] - this.opt.margin[2]
          };
          pageSize.inner.px = {
            width: toPx(pageSize.inner.width, pageSize.k),
            height: toPx(pageSize.inner.height, pageSize.k)
          };
          pageSize.inner.ratio = pageSize.inner.height / pageSize.inner.width;
        } // Attach pageSize to this.


        this.prop.pageSize = pageSize;
      });
    };

    Worker.prototype.setProgress = function setProgress(val, state, n, stack) {
      // Immediately update all progress values.
      if (val != null) this.progress.val = val;
      if (state != null) this.progress.state = state;
      if (n != null) this.progress.n = n;
      if (stack != null) this.progress.stack = stack;
      this.progress.ratio = this.progress.val / this.progress.state; // Return this for command chaining.

      return this;
    };

    Worker.prototype.updateProgress = function updateProgress(val, state, n, stack) {
      // Immediately update all progress values, using setProgress.
      return this.setProgress(val ? this.progress.val + val : null, state ? state : null, n ? this.progress.n + n : null, stack ? this.progress.stack.concat(stack) : null);
    };
    /* ----- PROMISE MAPPING ----- */


    Worker.prototype.then = function then(onFulfilled, onRejected) {
      // Wrap `this` for encapsulation.
      var self = this;
      return this.thenCore(onFulfilled, onRejected, function then_main(onFulfilled, onRejected) {
        // Update progress while queuing, calling, and resolving `then`.
        self.updateProgress(null, null, 1, [onFulfilled]);
        return Promise.prototype.then.call(this, function then_pre(val) {
          self.updateProgress(null, onFulfilled);
          return val;
        }).then(onFulfilled, onRejected).then(function then_post(val) {
          self.updateProgress(1);
          return val;
        });
      });
    };

    Worker.prototype.thenCore = function thenCore(onFulfilled, onRejected, thenBase) {
      // Handle optional thenBase parameter.
      thenBase = thenBase || Promise.prototype.then; // Wrap `this` for encapsulation and bind it to the promise handlers.

      var self = this;

      if (onFulfilled) {
        onFulfilled = onFulfilled.bind(self);
      }

      if (onRejected) {
        onRejected = onRejected.bind(self);
      } // Cast self into a Promise to avoid polyfills recursively defining `then`.


      var isNative = Promise.toString().indexOf("[native code]") !== -1 && Promise.name === "Promise";
      var selfPromise = isNative ? self : Worker.convert(Object.assign({}, self), Promise.prototype); // Return the promise, after casting it into a Worker and preserving props.

      var returnVal = thenBase.call(selfPromise, onFulfilled, onRejected);
      return Worker.convert(returnVal, self.__proto__);
    };

    Worker.prototype.thenExternal = function thenExternal(onFulfilled, onRejected) {
      // Call `then` and return a standard promise (exits the Worker chain).
      return Promise.prototype.then.call(this, onFulfilled, onRejected);
    };

    Worker.prototype.thenList = function thenList(fns) {
      // Queue a series of promise 'factories' into the promise chain.
      var self = this;
      fns.forEach(function thenList_forEach(fn) {
        self = self.thenCore(fn);
      });
      return self;
    };

    Worker.prototype["catch"] = function (onRejected) {
      // Bind `this` to the promise handler, call `catch`, and return a Worker.
      if (onRejected) {
        onRejected = onRejected.bind(this);
      }

      var returnVal = Promise.prototype["catch"].call(this, onRejected);
      return Worker.convert(returnVal, this);
    };

    Worker.prototype.catchExternal = function catchExternal(onRejected) {
      // Call `catch` and return a standard promise (exits the Worker chain).
      return Promise.prototype["catch"].call(this, onRejected);
    };

    Worker.prototype.error = function error(msg) {
      // Throw the error in the Promise chain.
      return this.then(function error_main() {
        throw new Error(msg);
      });
    };
    /* ----- ALIASES ----- */


    Worker.prototype.using = Worker.prototype.set;
    Worker.prototype.saveAs = Worker.prototype.save;
    Worker.prototype.export = Worker.prototype.output;
    Worker.prototype.run = Worker.prototype.then; // Get dimensions of a PDF page, as determined by jsPDF.

    jsPDF.getPageSize = function (orientation, unit, format) {
      // Decode options object
      if (_typeof(orientation) === "object") {
        var options = orientation;
        orientation = options.orientation;
        unit = options.unit || unit;
        format = options.format || format;
      } // Default options


      unit = unit || "mm";
      format = format || "a4";
      orientation = ("" + (orientation || "P")).toLowerCase();
      var format_as_string = ("" + format).toLowerCase(); // Size in pt of various paper formats

      var pageFormats = {
        a0: [2383.94, 3370.39],
        a1: [1683.78, 2383.94],
        a2: [1190.55, 1683.78],
        a3: [841.89, 1190.55],
        a4: [595.28, 841.89],
        a5: [419.53, 595.28],
        a6: [297.64, 419.53],
        a7: [209.76, 297.64],
        a8: [147.4, 209.76],
        a9: [104.88, 147.4],
        a10: [73.7, 104.88],
        b0: [2834.65, 4008.19],
        b1: [2004.09, 2834.65],
        b2: [1417.32, 2004.09],
        b3: [1000.63, 1417.32],
        b4: [708.66, 1000.63],
        b5: [498.9, 708.66],
        b6: [354.33, 498.9],
        b7: [249.45, 354.33],
        b8: [175.75, 249.45],
        b9: [124.72, 175.75],
        b10: [87.87, 124.72],
        c0: [2599.37, 3676.54],
        c1: [1836.85, 2599.37],
        c2: [1298.27, 1836.85],
        c3: [918.43, 1298.27],
        c4: [649.13, 918.43],
        c5: [459.21, 649.13],
        c6: [323.15, 459.21],
        c7: [229.61, 323.15],
        c8: [161.57, 229.61],
        c9: [113.39, 161.57],
        c10: [79.37, 113.39],
        dl: [311.81, 623.62],
        letter: [612, 792],
        "government-letter": [576, 756],
        legal: [612, 1008],
        "junior-legal": [576, 360],
        ledger: [1224, 792],
        tabloid: [792, 1224],
        "credit-card": [153, 243]
      }; // Unit conversion

      switch (unit) {
        case "pt":
          var k = 1;
          break;

        case "mm":
          var k = 72 / 25.4;
          break;

        case "cm":
          var k = 72 / 2.54;
          break;

        case "in":
          var k = 72;
          break;

        case "px":
          var k = 72 / 96;
          break;

        case "pc":
          var k = 12;
          break;

        case "em":
          var k = 12;
          break;

        case "ex":
          var k = 6;
          break;

        default:
          throw "Invalid unit: " + unit;
      } // Dimensions are stored as user units and converted to points on output


      if (pageFormats.hasOwnProperty(format_as_string)) {
        var pageHeight = pageFormats[format_as_string][1] / k;
        var pageWidth = pageFormats[format_as_string][0] / k;
      } else {
        try {
          var pageHeight = format[1];
          var pageWidth = format[0];
        } catch (err) {
          throw new Error("Invalid format: " + format);
        }
      } // Handle page orientation


      if (orientation === "p" || orientation === "portrait") {
        orientation = "p";

        if (pageWidth > pageHeight) {
          var tmp = pageWidth;
          pageWidth = pageHeight;
          pageHeight = tmp;
        }
      } else if (orientation === "l" || orientation === "landscape") {
        orientation = "l";

        if (pageHeight > pageWidth) {
          var tmp = pageWidth;
          pageWidth = pageHeight;
          pageHeight = tmp;
        }
      } else {
        throw "Invalid orientation: " + orientation;
      } // Return information (k is the unit conversion ratio from pts)


      var info = {
        width: pageWidth,
        height: pageHeight,
        unit: unit,
        k: k
      };
      return info;
    };
    /**
     * Generate a PDF from an HTML element or string using.
     *
     * @name html
     * @function
     * @param {Element|string} source The source element or HTML string.
     * @param {Object=} options An object of optional settings.
     * @description The Plugin needs html2canvas from niklasvh
     */


    jsPDFAPI.html = function (src, options) {

      options = options || {};

      options.callback = options.callback || function () {};

      options.html2canvas = options.html2canvas || {};
      options.html2canvas.canvas = options.html2canvas.canvas || this.canvas;
      options.jsPDF = options.jsPDF || this; // Create a new worker with the given options.

      var pdf = options.jsPDF;
      pdf.annotations = {
        _nameMap: [],
        createAnnotation: function createAnnotation(href, bounds) {
          var x = pdf.context2d._wrapX(bounds.left);

          var y = pdf.context2d._wrapY(bounds.top);

          var page = pdf.context2d._page(bounds.top);

          var options;
          var index = href.indexOf("#");

          if (index >= 0) {
            options = {
              name: href.substring(index + 1)
            };
          } else {
            options = {
              url: href
            };
          }

          pdf.link(x, y, bounds.right - bounds.left, bounds.bottom - bounds.top, options);
        },
        setName: function setName(name, bounds) {
          var x = pdf.context2d._wrapX(bounds.left);

          var y = pdf.context2d._wrapY(bounds.top);

          var page = pdf.context2d._page(bounds.top);

          this._nameMap[name] = {
            page: page,
            x: x,
            y: y
          };
        }
      };

      pdf.context2d._pageBreakAt = function (y) {
        this.pageBreaks.push(y);
      };

      pdf.context2d._gotoPage = function (pageOneBased) {
        while (pdf.internal.getNumberOfPages() < pageOneBased) {
          pdf.addPage();
        }

        pdf.setPage(pageOneBased);
      };

      pdf.context2d.pageWrapYEnabled = true;
      pdf.context2d.pageWrapY = pdf.internal.pageSize.getHeight() / pdf.internal.scaleFactor + 1;
      pdf.canvas.autoContext2dResizeY = false;
      var worker = new Worker(options);

      if (!options.worker) {
        // If worker is not set to true, perform the traditional 'simple' operation.
        return worker.from(src).doCallback();
      } else {
        // Otherwise, return the worker for new Promise-based operation.
        return worker;
      }

      return this;
    };
  })(jsPDF.API, typeof window !== "undefined" && window || typeof global !== "undefined" && global);

  /**
   * @license
   * ====================================================================
   * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
   *
   * 
   * ====================================================================
   */

  /*global jsPDF */

  /**
   * jsPDF JavaScript plugin
   *
   * @name javascript
   * @module
   */
  (function (jsPDFAPI) {

    var jsNamesObj, jsJsObj, text;
    /**
     * @name addJS
     * @function
     * @param {string} javascript The javascript to be embedded into the PDF-file.
     * @returns {jsPDF}
     */

    jsPDFAPI.addJS = function (javascript) {
      text = javascript;
      this.internal.events.subscribe("postPutResources", function (javascript) {
        jsNamesObj = this.internal.newObject();
        this.internal.out("<<");
        this.internal.out("/Names [(EmbeddedJS) " + (jsNamesObj + 1) + " 0 R]");
        this.internal.out(">>");
        this.internal.out("endobj");
        jsJsObj = this.internal.newObject();
        this.internal.out("<<");
        this.internal.out("/S /JavaScript");
        this.internal.out("/JS (" + text + ")");
        this.internal.out(">>");
        this.internal.out("endobj");
      });
      this.internal.events.subscribe("putCatalog", function () {
        if (jsNamesObj !== undefined && jsJsObj !== undefined) {
          this.internal.out("/Names <</JavaScript " + jsNamesObj + " 0 R>>");
        }
      });
      return this;
    };
  })(jsPDF.API);

  /**
   * @license
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * jsPDF Outline PlugIn
   *
   * Generates a PDF Outline
   * @name outline
   * @module
   */
  (function (jsPDFAPI) {

    jsPDFAPI.events.push(["postPutResources", function () {
      var pdf = this;
      var rx = /^(\d+) 0 obj$/; // Write action goto objects for each page
      // this.outline.destsGoto = [];
      // for (var i = 0; i < totalPages; i++) {
      // var id = pdf.internal.newObject();
      // this.outline.destsGoto.push(id);
      // pdf.internal.write("<</D[" + (i * 2 + 3) + " 0 R /XYZ null
      // null null]/S/GoTo>> endobj");
      // }
      //
      // for (var i = 0; i < dests.length; i++) {
      // pdf.internal.write("(page_" + (i + 1) + ")" + dests[i] + " 0
      // R");
      // }
      //

      if (this.outline.root.children.length > 0) {
        var lines = pdf.outline.render().split(/\r\n/);

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          var m = rx.exec(line);

          if (m != null) {
            var oid = m[1];
            pdf.internal.newObjectDeferredBegin(oid);
          }

          pdf.internal.write(line);
        }
      } // This code will write named destination for each page reference
      // (page_1, etc)


      if (this.outline.createNamedDestinations) {
        var totalPages = this.internal.pages.length; // WARNING: this assumes jsPDF starts on page 3 and pageIDs
        // follow 5, 7, 9, etc
        // Write destination objects for each page

        var dests = [];

        for (var i = 0; i < totalPages; i++) {
          var id = pdf.internal.newObject();
          dests.push(id);
          var info = pdf.internal.getPageInfo(i + 1);
          pdf.internal.write("<< /D[" + info.objId + " 0 R /XYZ null null null]>> endobj");
        } // assign a name for each destination


        var names2Oid = pdf.internal.newObject();
        pdf.internal.write("<< /Names [ ");

        for (var i = 0; i < dests.length; i++) {
          pdf.internal.write("(page_" + (i + 1) + ")" + dests[i] + " 0 R");
        }

        pdf.internal.write(" ] >>", "endobj"); // var kids = pdf.internal.newObject();
        // pdf.internal.write('<< /Kids [ ' + names2Oid + ' 0 R');
        // pdf.internal.write(' ] >>', 'endobj');

        var namesOid = pdf.internal.newObject();
        pdf.internal.write("<< /Dests " + names2Oid + " 0 R");
        pdf.internal.write(">>", "endobj");
      }
    }]);
    jsPDFAPI.events.push(["putCatalog", function () {
      var pdf = this;

      if (pdf.outline.root.children.length > 0) {
        pdf.internal.write("/Outlines", this.outline.makeRef(this.outline.root));

        if (this.outline.createNamedDestinations) {
          pdf.internal.write("/Names " + namesOid + " 0 R");
        } // Open with Bookmarks showing
        // pdf.internal.write("/PageMode /UseOutlines");

      }
    }]);
    jsPDFAPI.events.push(["initialized", function () {
      var pdf = this;
      pdf.outline = {
        createNamedDestinations: false,
        root: {
          children: []
        }
      };
      /**
       * Options: pageNumber
       */

      pdf.outline.add = function (parent, title, options) {
        var item = {
          title: title,
          options: options,
          children: []
        };

        if (parent == null) {
          parent = this.root;
        }

        parent.children.push(item);
        return item;
      };

      pdf.outline.render = function () {
        this.ctx = {};
        this.ctx.val = "";
        this.ctx.pdf = pdf;
        this.genIds_r(this.root);
        this.renderRoot(this.root);
        this.renderItems(this.root);
        return this.ctx.val;
      };

      pdf.outline.genIds_r = function (node) {
        node.id = pdf.internal.newObjectDeferred();

        for (var i = 0; i < node.children.length; i++) {
          this.genIds_r(node.children[i]);
        }
      };

      pdf.outline.renderRoot = function (node) {
        this.objStart(node);
        this.line("/Type /Outlines");

        if (node.children.length > 0) {
          this.line("/First " + this.makeRef(node.children[0]));
          this.line("/Last " + this.makeRef(node.children[node.children.length - 1]));
        }

        this.line("/Count " + this.count_r({
          count: 0
        }, node));
        this.objEnd();
      };

      pdf.outline.renderItems = function (node) {
        for (var i = 0; i < node.children.length; i++) {
          var item = node.children[i];
          this.objStart(item);
          this.line("/Title " + this.makeString(item.title));
          this.line("/Parent " + this.makeRef(node));

          if (i > 0) {
            this.line("/Prev " + this.makeRef(node.children[i - 1]));
          }

          if (i < node.children.length - 1) {
            this.line("/Next " + this.makeRef(node.children[i + 1]));
          }

          if (item.children.length > 0) {
            this.line("/First " + this.makeRef(item.children[0]));
            this.line("/Last " + this.makeRef(item.children[item.children.length - 1]));
          }

          var count = this.count = this.count_r({
            count: 0
          }, item);

          if (count > 0) {
            this.line("/Count " + count);
          }

          if (item.options) {
            if (item.options.pageNumber) {
              // Explicit Destination
              //WARNING this assumes page ids are 3,5,7, etc.
              var info = pdf.internal.getPageInfo(item.options.pageNumber);
              this.line("/Dest " + "[" + info.objId + " 0 R /XYZ 0 " + this.ctx.pdf.internal.pageSize.getHeight() * this.ctx.pdf.internal.scaleFactor + " 0]"); // this line does not work on all clients (pageNumber instead of page ref)
              //this.line('/Dest ' + '[' + (item.options.pageNumber - 1) + ' /XYZ 0 ' + this.ctx.pdf.internal.pageSize.getHeight() + ' 0]');
              // Named Destination
              // this.line('/Dest (page_' + (item.options.pageNumber) + ')');
              // Action Destination
              // var id = pdf.internal.newObject();
              // pdf.internal.write('<</D[' + (item.options.pageNumber - 1) + ' /XYZ null null null]/S/GoTo>> endobj');
              // this.line('/A ' + id + ' 0 R' );
            }
          }

          this.objEnd();
        }

        for (var i = 0; i < node.children.length; i++) {
          var item = node.children[i];
          this.renderItems(item);
        }
      };

      pdf.outline.line = function (text) {
        this.ctx.val += text + "\r\n";
      };

      pdf.outline.makeRef = function (node) {
        return node.id + " 0 R";
      };

      pdf.outline.makeString = function (val) {
        return "(" + pdf.internal.pdfEscape(val) + ")";
      };

      pdf.outline.objStart = function (node) {
        this.ctx.val += "\r\n" + node.id + " 0 obj" + "\r\n<<\r\n";
      };

      pdf.outline.objEnd = function (node) {
        this.ctx.val += ">> \r\n" + "endobj" + "\r\n";
      };

      pdf.outline.count_r = function (ctx, node) {
        for (var i = 0; i < node.children.length; i++) {
          ctx.count++;
          this.count_r(ctx, node.children[i]);
        }

        return ctx.count;
      };
    }]);
    return this;
  })(jsPDF.API);

  /**
   * @license
   *
   * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
   *
   * 
   * ====================================================================
   */

  /**
   * jsPDF PNG PlugIn
   * @name png_support
   * @module
   */
  (function (jsPDFAPI) {
    /*
    * @see http://www.w3.org/TR/PNG-Chunks.html
    *
    Color    Allowed      Interpretation
    Type     Bit Depths
    	   0       1,2,4,8,16  Each pixel is a grayscale sample.
    	   2       8,16        Each pixel is an R,G,B triple.
    	   3       1,2,4,8     Each pixel is a palette index;
                          a PLTE chunk must appear.
    	   4       8,16        Each pixel is a grayscale sample,
                          followed by an alpha sample.
    	   6       8,16        Each pixel is an R,G,B triple,
                          followed by an alpha sample.
    */

    /*
    * PNG filter method types
    *
    * @see http://www.w3.org/TR/PNG-Filters.html
    * @see http://www.libpng.org/pub/png/book/chapter09.html
    *
    * This is what the value 'Predictor' in decode params relates to
    *
    * 15 is "optimal prediction", which means the prediction algorithm can change from line to line.
    * In that case, you actually have to read the first byte off each line for the prediction algorthim (which should be 0-4, corresponding to PDF 10-14) and select the appropriate unprediction algorithm based on that byte.
    *
      0       None
      1       Sub
      2       Up
      3       Average
      4       Paeth
    */

    var doesNotHavePngJS = function doesNotHavePngJS() {
      return typeof PNG !== "function" || typeof FlateStream !== "function";
    },
        canCompress = function canCompress(value) {
      return value !== jsPDFAPI.image_compression.NONE && hasCompressionJS();
    },
        hasCompressionJS = function hasCompressionJS() {
      var inst = typeof Deflater === "function";
      if (!inst) throw new Error("requires deflate.js for compression");
      return inst;
    },
        compressBytes = function compressBytes(bytes, lineLength, colorsPerPixel, compression) {
      var level = 5,
          filter_method = filterUp;

      switch (compression) {
        case jsPDFAPI.image_compression.FAST:
          level = 3;
          filter_method = filterSub;
          break;

        case jsPDFAPI.image_compression.MEDIUM:
          level = 6;
          filter_method = filterAverage;
          break;

        case jsPDFAPI.image_compression.SLOW:
          level = 9;
          filter_method = filterPaeth; //uses to sum to choose best filter for each line

          break;
      }

      bytes = applyPngFilterMethod(bytes, lineLength, colorsPerPixel, filter_method);
      var header = new Uint8Array(createZlibHeader(level));
      var checksum = adler32(bytes);
      var deflate = new Deflater(level);
      var a = deflate.append(bytes);
      var cBytes = deflate.flush();
      var len = header.length + a.length + cBytes.length;
      var cmpd = new Uint8Array(len + 4);
      cmpd.set(header);
      cmpd.set(a, header.length);
      cmpd.set(cBytes, header.length + a.length);
      cmpd[len++] = checksum >>> 24 & 0xff;
      cmpd[len++] = checksum >>> 16 & 0xff;
      cmpd[len++] = checksum >>> 8 & 0xff;
      cmpd[len++] = checksum & 0xff;
      return jsPDFAPI.arrayBufferToBinaryString(cmpd);
    },
        createZlibHeader = function createZlibHeader(bytes, level) {
      /*
      * @see http://www.ietf.org/rfc/rfc1950.txt for zlib header
      */
      var cm = 8;
      var cinfo = Math.LOG2E * Math.log(0x8000) - 8;
      var cmf = cinfo << 4 | cm;
      var hdr = cmf << 8;
      var flevel = Math.min(3, (level - 1 & 0xff) >> 1);
      hdr |= flevel << 6;
      hdr |= 0; //FDICT

      hdr += 31 - hdr % 31;
      return [cmf, hdr & 0xff & 0xff];
    },
        adler32 = function adler32(array, param) {
      var adler = 1;
      var s1 = adler & 0xffff,
          s2 = adler >>> 16 & 0xffff;
      var len = array.length;
      var tlen;
      var i = 0;

      while (len > 0) {
        tlen = len > param ? param : len;
        len -= tlen;

        do {
          s1 += array[i++];
          s2 += s1;
        } while (--tlen);

        s1 %= 65521;
        s2 %= 65521;
      }

      return (s2 << 16 | s1) >>> 0;
    },
        applyPngFilterMethod = function applyPngFilterMethod(bytes, lineLength, colorsPerPixel, filter_method) {
      var lines = bytes.length / lineLength,
          result = new Uint8Array(bytes.length + lines),
          filter_methods = getFilterMethods(),
          i = 0,
          line,
          prevLine,
          offset;

      for (; i < lines; i++) {
        offset = i * lineLength;
        line = bytes.subarray(offset, offset + lineLength);

        if (filter_method) {
          result.set(filter_method(line, colorsPerPixel, prevLine), offset + i);
        } else {
          var j = 0,
              len = filter_methods.length,
              results = [];

          for (; j < len; j++) {
            results[j] = filter_methods[j](line, colorsPerPixel, prevLine);
          }

          var ind = getIndexOfSmallestSum(results.concat());
          result.set(results[ind], offset + i);
        }

        prevLine = line;
      }

      return result;
    },
        filterNone = function filterNone(line, colorsPerPixel, prevLine) {
      /*var result = new Uint8Array(line.length + 1);
      result[0] = 0;
      result.set(line, 1);*/
      var result = Array.apply([], line);
      result.unshift(0);
      return result;
    },
        filterSub = function filterSub(line, colorsPerPixel, prevLine) {
      var result = [],
          i = 0,
          len = line.length,
          left;
      result[0] = 1;

      for (; i < len; i++) {
        left = line[i - colorsPerPixel] || 0;
        result[i + 1] = line[i] - left + 0x0100 & 0xff;
      }

      return result;
    },
        filterUp = function filterUp(line, colorsPerPixel, prevLine) {
      var result = [],
          i = 0,
          len = line.length,
          up;
      result[0] = 2;

      for (; i < len; i++) {
        up = prevLine && prevLine[i] || 0;
        result[i + 1] = line[i] - up + 0x0100 & 0xff;
      }

      return result;
    },
        filterAverage = function filterAverage(line, colorsPerPixel, prevLine) {
      var result = [],
          i = 0,
          len = line.length,
          left,
          up;
      result[0] = 3;

      for (; i < len; i++) {
        left = line[i - colorsPerPixel] || 0;
        up = prevLine && prevLine[i] || 0;
        result[i + 1] = line[i] + 0x0100 - (left + up >>> 1) & 0xff;
      }

      return result;
    },
        filterPaeth = function filterPaeth(line, colorsPerPixel, prevLine) {
      var result = [],
          i = 0,
          len = line.length,
          left,
          up,
          upLeft,
          paeth;
      result[0] = 4;

      for (; i < len; i++) {
        left = line[i - colorsPerPixel] || 0;
        up = prevLine && prevLine[i] || 0;
        upLeft = prevLine && prevLine[i - colorsPerPixel] || 0;
        paeth = paethPredictor(left, up, upLeft);
        result[i + 1] = line[i] - paeth + 0x0100 & 0xff;
      }

      return result;
    },
        paethPredictor = function paethPredictor(left, up, upLeft) {
      var p = left + up - upLeft,
          pLeft = Math.abs(p - left),
          pUp = Math.abs(p - up),
          pUpLeft = Math.abs(p - upLeft);
      return pLeft <= pUp && pLeft <= pUpLeft ? left : pUp <= pUpLeft ? up : upLeft;
    },
        getFilterMethods = function getFilterMethods() {
      return [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
    },
        getIndexOfSmallestSum = function getIndexOfSmallestSum(arrays) {
      var i = 0,
          len = arrays.length,
          sum,
          min,
          ind;

      while (i < len) {
        sum = absSum(arrays[i].slice(1));

        if (sum < min || !min) {
          min = sum;
          ind = i;
        }

        i++;
      }

      return ind;
    },
        absSum = function absSum(array) {
      var i = 0,
          len = array.length,
          sum = 0;

      while (i < len) {
        sum += Math.abs(array[i++]);
      }

      return sum;
    },
        getPredictorFromCompression = function getPredictorFromCompression(compression) {
      var predictor;

      switch (compression) {
        case jsPDFAPI.image_compression.FAST:
          predictor = 11;
          break;

        case jsPDFAPI.image_compression.MEDIUM:
          predictor = 13;
          break;

        case jsPDFAPI.image_compression.SLOW:
          predictor = 14;
          break;

        default:
          predictor = 12;
          break;
      }

      return predictor;
    };
    /**
     *
     * @name processPNG
     * @function
     * @ignore
     */


    jsPDFAPI.processPNG = function (imageData, imageIndex, alias, compression, dataAsBinaryString) {

      var colorSpace = this.color_spaces.DEVICE_RGB,
          decode = this.decode.FLATE_DECODE,
          bpc = 8,
          img,
          dp,
          trns,
          colors,
          pal,
          smask;
      /*	if(this.isString(imageData)) {
      }*/

      if (this.isArrayBuffer(imageData)) imageData = new Uint8Array(imageData);

      if (this.isArrayBufferView(imageData)) {
        if (doesNotHavePngJS()) throw new Error("PNG support requires png.js and zlib.js");
        img = new PNG(imageData);
        imageData = img.imgData;
        bpc = img.bits;
        colorSpace = img.colorSpace;
        colors = img.colors; //logImg(img);

        /*
        * colorType 6 - Each pixel is an R,G,B triple, followed by an alpha sample.
        *
        * colorType 4 - Each pixel is a grayscale sample, followed by an alpha sample.
        *
        * Extract alpha to create two separate images, using the alpha as a sMask
        */

        if ([4, 6].indexOf(img.colorType) !== -1) {
          /*
          * processes 8 bit RGBA and grayscale + alpha images
          */
          if (img.bits === 8) {
            var pixels = img.pixelBitlength == 32 ? new Uint32Array(img.decodePixels().buffer) : img.pixelBitlength == 16 ? new Uint16Array(img.decodePixels().buffer) : new Uint8Array(img.decodePixels().buffer),
                len = pixels.length,
                imgData = new Uint8Array(len * img.colors),
                alphaData = new Uint8Array(len),
                pDiff = img.pixelBitlength - img.bits,
                i = 0,
                n = 0,
                pixel,
                pbl;

            for (; i < len; i++) {
              pixel = pixels[i];
              pbl = 0;

              while (pbl < pDiff) {
                imgData[n++] = pixel >>> pbl & 0xff;
                pbl = pbl + img.bits;
              }

              alphaData[i] = pixel >>> pbl & 0xff;
            }
          }
          /*
          * processes 16 bit RGBA and grayscale + alpha images
          */


          if (img.bits === 16) {
            var pixels = new Uint32Array(img.decodePixels().buffer),
                len = pixels.length,
                imgData = new Uint8Array(len * (32 / img.pixelBitlength) * img.colors),
                alphaData = new Uint8Array(len * (32 / img.pixelBitlength)),
                hasColors = img.colors > 1,
                i = 0,
                n = 0,
                a = 0,
                pixel;

            while (i < len) {
              pixel = pixels[i++];
              imgData[n++] = pixel >>> 0 & 0xff;

              if (hasColors) {
                imgData[n++] = pixel >>> 16 & 0xff;
                pixel = pixels[i++];
                imgData[n++] = pixel >>> 0 & 0xff;
              }

              alphaData[a++] = pixel >>> 16 & 0xff;
            }

            bpc = 8;
          }

          if (canCompress(compression)) {
            imageData = compressBytes(imgData, img.width * img.colors, img.colors, compression);
            smask = compressBytes(alphaData, img.width, 1, compression);
          } else {
            imageData = imgData;
            smask = alphaData;
            decode = null;
          }
        }
        /*
        * Indexed png. Each pixel is a palette index.
        */


        if (img.colorType === 3) {
          colorSpace = this.color_spaces.INDEXED;
          pal = img.palette;

          if (img.transparency.indexed) {
            var trans = img.transparency.indexed;
            var total = 0,
                i = 0,
                len = trans.length;

            for (; i < len; ++i) {
              total += trans[i];
            }

            total = total / 255;
            /*
            * a single color is specified as 100% transparent (0),
            * so we set trns to use a /Mask with that index
            */

            if (total === len - 1 && trans.indexOf(0) !== -1) {
              trns = [trans.indexOf(0)];
              /*
              * there's more than one colour within the palette that specifies
              * a transparency value less than 255, so we unroll the pixels to create an image sMask
              */
            } else if (total !== len) {
              var pixels = img.decodePixels(),
                  alphaData = new Uint8Array(pixels.length),
                  i = 0,
                  len = pixels.length;

              for (; i < len; i++) {
                alphaData[i] = trans[pixels[i]];
              }

              smask = compressBytes(alphaData, img.width, 1);
            }
          }
        }

        var predictor = getPredictorFromCompression(compression);
        if (decode === this.decode.FLATE_DECODE) dp = "/Predictor " + predictor + " /Colors " + colors + " /BitsPerComponent " + bpc + " /Columns " + img.width; //remove 'Predictor' as it applies to the type of png filter applied to its IDAT - we only apply with compression
        else dp = "/Colors " + colors + " /BitsPerComponent " + bpc + " /Columns " + img.width;
        if (this.isArrayBuffer(imageData) || this.isArrayBufferView(imageData)) imageData = this.arrayBufferToBinaryString(imageData);
        if (smask && this.isArrayBuffer(smask) || this.isArrayBufferView(smask)) smask = this.arrayBufferToBinaryString(smask);
        return this.createImageInfo(imageData, img.width, img.height, colorSpace, bpc, decode, imageIndex, alias, dp, trns, pal, smask, predictor);
      }

      throw new Error("Unsupported PNG image data, try using JPEG instead.");
    };
  })(jsPDF.API);

  /**
   * @license
   * Copyright (c) 2017 Aras Abbasi
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * jsPDF gif Support PlugIn
   *
   * @name gif_support
   * @module
   */
  (function (jsPDFAPI) {

    jsPDFAPI.processGIF89A = function (imageData, imageIndex, alias, compression, dataAsBinaryString) {
      var reader = new GifReader(imageData);
      var width = reader.width,
          height = reader.height;
      var qu = 100;
      var pixels = [];
      reader.decodeAndBlitFrameRGBA(0, pixels);
      var rawImageData = {
        data: pixels,
        width: width,
        height: height
      };
      var encoder = new JPEGEncoder(qu);
      var data = encoder.encode(rawImageData, qu);
      return jsPDFAPI.processJPEG.call(this, data, imageIndex, alias, compression);
    };

    jsPDFAPI.processGIF87A = jsPDFAPI.processGIF89A;
  })(jsPDF.API);

  /**
   * Copyright (c) 2018 Aras Abbasi
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * jsPDF bmp Support PlugIn
   * @name bmp_support
   * @module
   */
  (function (jsPDFAPI) {

    jsPDFAPI.processBMP = function (imageData, imageIndex, alias, compression, dataAsBinaryString) {
      var reader = new BmpDecoder(imageData, false);
      var width = reader.width,
          height = reader.height;
      var qu = 100;
      var pixels = reader.getData();
      var rawImageData = {
        data: pixels,
        width: width,
        height: height
      };
      var encoder = new JPEGEncoder(qu);
      var data = encoder.encode(rawImageData, qu);
      return jsPDFAPI.processJPEG.call(this, data, imageIndex, alias, compression);
    };
  })(jsPDF.API);

  /**
   * @license
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * jsPDF setLanguage Plugin
   *
   * @name setLanguage
   * @module
   */
  (function (jsPDFAPI) {
    /**
     * Add Language Tag to the generated PDF
     *
     * @name setLanguage
     * @function
     * @param {string} langCode The Language code as ISO-639-1 (e.g. 'en') or as country language code (e.g. 'en-GB').
     * @returns {jsPDF}
     * @example
     * var doc = new jsPDF()
     * doc.text(10, 10, 'This is a test')
     * doc.setLanguage("en-US")
     * doc.save('english.pdf')
     */

    jsPDFAPI.setLanguage = function (langCode) {

      var langCodes = {
        af: "Afrikaans",
        sq: "Albanian",
        ar: "Arabic (Standard)",
        "ar-DZ": "Arabic (Algeria)",
        "ar-BH": "Arabic (Bahrain)",
        "ar-EG": "Arabic (Egypt)",
        "ar-IQ": "Arabic (Iraq)",
        "ar-JO": "Arabic (Jordan)",
        "ar-KW": "Arabic (Kuwait)",
        "ar-LB": "Arabic (Lebanon)",
        "ar-LY": "Arabic (Libya)",
        "ar-MA": "Arabic (Morocco)",
        "ar-OM": "Arabic (Oman)",
        "ar-QA": "Arabic (Qatar)",
        "ar-SA": "Arabic (Saudi Arabia)",
        "ar-SY": "Arabic (Syria)",
        "ar-TN": "Arabic (Tunisia)",
        "ar-AE": "Arabic (U.A.E.)",
        "ar-YE": "Arabic (Yemen)",
        an: "Aragonese",
        hy: "Armenian",
        as: "Assamese",
        ast: "Asturian",
        az: "Azerbaijani",
        eu: "Basque",
        be: "Belarusian",
        bn: "Bengali",
        bs: "Bosnian",
        br: "Breton",
        bg: "Bulgarian",
        my: "Burmese",
        ca: "Catalan",
        ch: "Chamorro",
        ce: "Chechen",
        zh: "Chinese",
        "zh-HK": "Chinese (Hong Kong)",
        "zh-CN": "Chinese (PRC)",
        "zh-SG": "Chinese (Singapore)",
        "zh-TW": "Chinese (Taiwan)",
        cv: "Chuvash",
        co: "Corsican",
        cr: "Cree",
        hr: "Croatian",
        cs: "Czech",
        da: "Danish",
        nl: "Dutch (Standard)",
        "nl-BE": "Dutch (Belgian)",
        en: "English",
        "en-AU": "English (Australia)",
        "en-BZ": "English (Belize)",
        "en-CA": "English (Canada)",
        "en-IE": "English (Ireland)",
        "en-JM": "English (Jamaica)",
        "en-NZ": "English (New Zealand)",
        "en-PH": "English (Philippines)",
        "en-ZA": "English (South Africa)",
        "en-TT": "English (Trinidad & Tobago)",
        "en-GB": "English (United Kingdom)",
        "en-US": "English (United States)",
        "en-ZW": "English (Zimbabwe)",
        eo: "Esperanto",
        et: "Estonian",
        fo: "Faeroese",
        fj: "Fijian",
        fi: "Finnish",
        fr: "French (Standard)",
        "fr-BE": "French (Belgium)",
        "fr-CA": "French (Canada)",
        "fr-FR": "French (France)",
        "fr-LU": "French (Luxembourg)",
        "fr-MC": "French (Monaco)",
        "fr-CH": "French (Switzerland)",
        fy: "Frisian",
        fur: "Friulian",
        gd: "Gaelic (Scots)",
        "gd-IE": "Gaelic (Irish)",
        gl: "Galacian",
        ka: "Georgian",
        de: "German (Standard)",
        "de-AT": "German (Austria)",
        "de-DE": "German (Germany)",
        "de-LI": "German (Liechtenstein)",
        "de-LU": "German (Luxembourg)",
        "de-CH": "German (Switzerland)",
        el: "Greek",
        gu: "Gujurati",
        ht: "Haitian",
        he: "Hebrew",
        hi: "Hindi",
        hu: "Hungarian",
        is: "Icelandic",
        id: "Indonesian",
        iu: "Inuktitut",
        ga: "Irish",
        it: "Italian (Standard)",
        "it-CH": "Italian (Switzerland)",
        ja: "Japanese",
        kn: "Kannada",
        ks: "Kashmiri",
        kk: "Kazakh",
        km: "Khmer",
        ky: "Kirghiz",
        tlh: "Klingon",
        ko: "Korean",
        "ko-KP": "Korean (North Korea)",
        "ko-KR": "Korean (South Korea)",
        la: "Latin",
        lv: "Latvian",
        lt: "Lithuanian",
        lb: "Luxembourgish",
        mk: "FYRO Macedonian",
        ms: "Malay",
        ml: "Malayalam",
        mt: "Maltese",
        mi: "Maori",
        mr: "Marathi",
        mo: "Moldavian",
        nv: "Navajo",
        ng: "Ndonga",
        ne: "Nepali",
        no: "Norwegian",
        nb: "Norwegian (Bokmal)",
        nn: "Norwegian (Nynorsk)",
        oc: "Occitan",
        or: "Oriya",
        om: "Oromo",
        fa: "Persian",
        "fa-IR": "Persian/Iran",
        pl: "Polish",
        pt: "Portuguese",
        "pt-BR": "Portuguese (Brazil)",
        pa: "Punjabi",
        "pa-IN": "Punjabi (India)",
        "pa-PK": "Punjabi (Pakistan)",
        qu: "Quechua",
        rm: "Rhaeto-Romanic",
        ro: "Romanian",
        "ro-MO": "Romanian (Moldavia)",
        ru: "Russian",
        "ru-MO": "Russian (Moldavia)",
        sz: "Sami (Lappish)",
        sg: "Sango",
        sa: "Sanskrit",
        sc: "Sardinian",
        sd: "Sindhi",
        si: "Singhalese",
        sr: "Serbian",
        sk: "Slovak",
        sl: "Slovenian",
        so: "Somani",
        sb: "Sorbian",
        es: "Spanish",
        "es-AR": "Spanish (Argentina)",
        "es-BO": "Spanish (Bolivia)",
        "es-CL": "Spanish (Chile)",
        "es-CO": "Spanish (Colombia)",
        "es-CR": "Spanish (Costa Rica)",
        "es-DO": "Spanish (Dominican Republic)",
        "es-EC": "Spanish (Ecuador)",
        "es-SV": "Spanish (El Salvador)",
        "es-GT": "Spanish (Guatemala)",
        "es-HN": "Spanish (Honduras)",
        "es-MX": "Spanish (Mexico)",
        "es-NI": "Spanish (Nicaragua)",
        "es-PA": "Spanish (Panama)",
        "es-PY": "Spanish (Paraguay)",
        "es-PE": "Spanish (Peru)",
        "es-PR": "Spanish (Puerto Rico)",
        "es-ES": "Spanish (Spain)",
        "es-UY": "Spanish (Uruguay)",
        "es-VE": "Spanish (Venezuela)",
        sx: "Sutu",
        sw: "Swahili",
        sv: "Swedish",
        "sv-FI": "Swedish (Finland)",
        "sv-SV": "Swedish (Sweden)",
        ta: "Tamil",
        tt: "Tatar",
        te: "Teluga",
        th: "Thai",
        tig: "Tigre",
        ts: "Tsonga",
        tn: "Tswana",
        tr: "Turkish",
        tk: "Turkmen",
        uk: "Ukrainian",
        hsb: "Upper Sorbian",
        ur: "Urdu",
        ve: "Venda",
        vi: "Vietnamese",
        vo: "Volapuk",
        wa: "Walloon",
        cy: "Welsh",
        xh: "Xhosa",
        ji: "Yiddish",
        zu: "Zulu"
      };

      if (this.internal.languageSettings === undefined) {
        this.internal.languageSettings = {};
        this.internal.languageSettings.isSubscribed = false;
      }

      if (langCodes[langCode] !== undefined) {
        this.internal.languageSettings.languageCode = langCode;

        if (this.internal.languageSettings.isSubscribed === false) {
          this.internal.events.subscribe("putCatalog", function () {
            this.internal.write("/Lang (" + this.internal.languageSettings.languageCode + ")");
          });
          this.internal.languageSettings.isSubscribed = true;
        }
      }

      return this;
    };
  })(jsPDF.API);

  /** @license
   * MIT license.
   * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
   *               2014 Diego Casorran, https://github.com/diegocr
   *
   * 
   * ====================================================================
   */

  /**
   * jsPDF split_text_to_size plugin
   *
   * @name split_text_to_size
   * @module
   */
  (function (API) {
    /**
     * Returns an array of length matching length of the 'word' string, with each
     * cell occupied by the width of the char in that position.
     *
     * @name getCharWidthsArray
     * @function
     * @param {string} text
     * @param {Object} options
     * @returns {Array}
     */

    var getCharWidthsArray = API.getCharWidthsArray = function (text, options) {
      options = options || {};
      var activeFont = options.font || this.internal.getFont();
      var fontSize = options.fontSize || this.internal.getFontSize();
      var charSpace = options.charSpace || this.internal.getCharSpace();
      var widths = options.widths ? options.widths : activeFont.metadata.Unicode.widths;
      var widthsFractionOf = widths.fof ? widths.fof : 1;
      var kerning = options.kerning ? options.kerning : activeFont.metadata.Unicode.kerning;
      var kerningFractionOf = kerning.fof ? kerning.fof : 1;
      var i;
      var l;
      var char_code;
      var prior_char_code = 0; //for kerning

      var default_char_width = widths[0] || widthsFractionOf;
      var output = [];

      for (i = 0, l = text.length; i < l; i++) {
        char_code = text.charCodeAt(i);

        if (typeof activeFont.metadata.widthOfString === "function") {
          output.push((activeFont.metadata.widthOfGlyph(activeFont.metadata.characterToGlyph(char_code)) + charSpace * (1000 / fontSize) || 0) / 1000);
        } else {
          output.push((widths[char_code] || default_char_width) / widthsFractionOf + (kerning[char_code] && kerning[char_code][prior_char_code] || 0) / kerningFractionOf);
        }

        prior_char_code = char_code;
      }

      return output;
    };
    /**
     * Calculate the sum of a number-array
     *
     * @name getArraySum
     * @public
     * @function
     * @param {Array} array Array of numbers
     * @returns {number}
     */


    var getArraySum = API.getArraySum = function (array) {
      var i = array.length,
          output = 0;

      while (i) {
        i--;
        output += array[i];
      }

      return output;
    };
    /**
     * Returns a widths of string in a given font, if the font size is set as 1 point.
     *
     * In other words, this is "proportional" value. For 1 unit of font size, the length
     * of the string will be that much.
     *
     * Multiply by font size to get actual width in *points*
     * Then divide by 72 to get inches or divide by (72/25.6) to get 'mm' etc.
     *
     * @name getStringUnitWidth
     * @public
     * @function
     * @param {string} text
     * @param {string} options
     * @returns {number} result
     */


    var getStringUnitWidth = API.getStringUnitWidth = function (text, options) {
      options = options || {};
      var fontSize = options.fontSize || this.internal.getFontSize();
      var font = options.font || this.internal.getFont();
      var charSpace = options.charSpace || this.internal.getCharSpace();
      var result = 0;

      if (typeof font.metadata.widthOfString === "function") {
        result = font.metadata.widthOfString(text, fontSize, charSpace) / fontSize;
      } else {
        result = getArraySum(getCharWidthsArray.apply(this, arguments));
      }

      return result;
    };
    /**
    returns array of lines
    */


    var splitLongWord = function splitLongWord(word, widths_array, firstLineMaxLen, maxLen) {
      var answer = []; // 1st, chop off the piece that can fit on the hanging line.

      var i = 0,
          l = word.length,
          workingLen = 0;

      while (i !== l && workingLen + widths_array[i] < firstLineMaxLen) {
        workingLen += widths_array[i];
        i++;
      } // this is first line.


      answer.push(word.slice(0, i)); // 2nd. Split the rest into maxLen pieces.

      var startOfLine = i;
      workingLen = 0;

      while (i !== l) {
        if (workingLen + widths_array[i] > maxLen) {
          answer.push(word.slice(startOfLine, i));
          workingLen = 0;
          startOfLine = i;
        }

        workingLen += widths_array[i];
        i++;
      }

      if (startOfLine !== i) {
        answer.push(word.slice(startOfLine, i));
      }

      return answer;
    }; // Note, all sizing inputs for this function must be in "font measurement units"
    // By default, for PDF, it's "point".


    var splitParagraphIntoLines = function splitParagraphIntoLines(text, maxlen, options) {
      // at this time works only on Western scripts, ones with space char
      // separating the words. Feel free to expand.
      if (!options) {
        options = {};
      }

      var line = [],
          lines = [line],
          line_length = options.textIndent || 0,
          separator_length = 0,
          current_word_length = 0,
          word,
          widths_array,
          words = text.split(" "),
          spaceCharWidth = getCharWidthsArray.apply(this, [" ", options])[0],
          i,
          l,
          tmp,
          lineIndent;

      if (options.lineIndent === -1) {
        lineIndent = words[0].length + 2;
      } else {
        lineIndent = options.lineIndent || 0;
      }

      if (lineIndent) {
        var pad = Array(lineIndent).join(" "),
            wrds = [];
        words.map(function (wrd) {
          wrd = wrd.split(/\s*\n/);

          if (wrd.length > 1) {
            wrds = wrds.concat(wrd.map(function (wrd, idx) {
              return (idx && wrd.length ? "\n" : "") + wrd;
            }));
          } else {
            wrds.push(wrd[0]);
          }
        });
        words = wrds;
        lineIndent = getStringUnitWidth.apply(this, [pad, options]);
      }

      for (i = 0, l = words.length; i < l; i++) {
        var force = 0;
        word = words[i];

        if (lineIndent && word[0] == "\n") {
          word = word.substr(1);
          force = 1;
        }

        widths_array = getCharWidthsArray.apply(this, [word, options]);
        current_word_length = getArraySum(widths_array);

        if (line_length + separator_length + current_word_length > maxlen || force) {
          if (current_word_length > maxlen) {
            // this happens when you have space-less long URLs for example.
            // we just chop these to size. We do NOT insert hiphens
            tmp = splitLongWord.apply(this, [word, widths_array, maxlen - (line_length + separator_length), maxlen]); // first line we add to existing line object

            line.push(tmp.shift()); // it's ok to have extra space indicator there
            // last line we make into new line object

            line = [tmp.pop()]; // lines in the middle we apped to lines object as whole lines

            while (tmp.length) {
              lines.push([tmp.shift()]); // single fragment occupies whole line
            }

            current_word_length = getArraySum(widths_array.slice(word.length - (line[0] ? line[0].length : 0)));
          } else {
            // just put it on a new line
            line = [word];
          } // now we attach new line to lines


          lines.push(line);
          line_length = current_word_length + lineIndent;
          separator_length = spaceCharWidth;
        } else {
          line.push(word);
          line_length += separator_length + current_word_length;
          separator_length = spaceCharWidth;
        }
      }

      if (lineIndent) {
        var postProcess = function postProcess(ln, idx) {
          return (idx ? pad : "") + ln.join(" ");
        };
      } else {
        var postProcess = function postProcess(ln) {
          return ln.join(" ");
        };
      }

      return lines.map(postProcess);
    };
    /**
     * Splits a given string into an array of strings. Uses 'size' value
     * (in measurement units declared as default for the jsPDF instance)
     * and the font's "widths" and "Kerning" tables, where available, to
     * determine display length of a given string for a given font.
     *
     * We use character's 100% of unit size (height) as width when Width
     * table or other default width is not available.
     *
     * @name splitTextToSize
     * @public
     * @function
     * @param {string} text Unencoded, regular JavaScript (Unicode, UTF-16 / UCS-2) string.
     * @param {number} size Nominal number, measured in units default to this instance of jsPDF.
     * @param {Object} options Optional flags needed for chopper to do the right thing.
     * @returns {Array} array Array with strings chopped to size.
     */


    API.splitTextToSize = function (text, maxlen, options) {

      options = options || {};

      var fsize = options.fontSize || this.internal.getFontSize(),
          newOptions = function (options) {
        var widths = {
          0: 1
        },
            kerning = {};

        if (!options.widths || !options.kerning) {
          var f = this.internal.getFont(options.fontName, options.fontStyle),
              encoding = "Unicode"; // NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE
          // Actual JavaScript-native String's 16bit char codes used.
          // no multi-byte logic here

          if (f.metadata[encoding]) {
            return {
              widths: f.metadata[encoding].widths || widths,
              kerning: f.metadata[encoding].kerning || kerning
            };
          } else {
            return {
              font: f.metadata,
              fontSize: this.internal.getFontSize(),
              charSpace: this.internal.getCharSpace()
            };
          }
        } else {
          return {
            widths: options.widths,
            kerning: options.kerning
          };
        } // then use default values


        return {
          widths: widths,
          kerning: kerning
        };
      }.call(this, options); // first we split on end-of-line chars


      var paragraphs;

      if (Array.isArray(text)) {
        paragraphs = text;
      } else {
        paragraphs = text.split(/\r?\n/);
      } // now we convert size (max length of line) into "font size units"
      // at present time, the "font size unit" is always 'point'
      // 'proportional' means, "in proportion to font size"


      var fontUnit_maxLen = 1.0 * this.internal.scaleFactor * maxlen / fsize; // at this time, fsize is always in "points" regardless of the default measurement unit of the doc.
      // this may change in the future?
      // until then, proportional_maxlen is likely to be in 'points'
      // If first line is to be indented (shorter or longer) than maxLen
      // we indicate that by using CSS-style "text-indent" option.
      // here it's in font units too (which is likely 'points')
      // it can be negative (which makes the first line longer than maxLen)

      newOptions.textIndent = options.textIndent ? options.textIndent * 1.0 * this.internal.scaleFactor / fsize : 0;
      newOptions.lineIndent = options.lineIndent;
      var i,
          l,
          output = [];

      for (i = 0, l = paragraphs.length; i < l; i++) {
        output = output.concat(splitParagraphIntoLines.apply(this, [paragraphs[i], fontUnit_maxLen, newOptions]));
      }

      return output;
    };
  })(jsPDF.API);

  /** @license
   jsPDF standard_fonts_metrics plugin
   * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
   * MIT license.
   * 
   * ====================================================================
   */

  /**
   * This file adds the standard font metrics to jsPDF.
   *
   * Font metrics data is reprocessed derivative of contents of
   * "Font Metrics for PDF Core 14 Fonts" package, which exhibits the following copyright and license:
   *
   * Copyright (c) 1989, 1990, 1991, 1992, 1993, 1997 Adobe Systems Incorporated. All Rights Reserved.
   *
   * This file and the 14 PostScript(R) AFM files it accompanies may be used,
   * copied, and distributed for any purpose and without charge, with or without
   * modification, provided that all copyright notices are retained; that the AFM
   * files are not distributed without this file; that all modifications to this
   * file or any of the AFM files are prominently noted in the modified file(s);
   * and that this paragraph is not modified. Adobe Systems has no responsibility
   * or obligation to support the use of the AFM files.
   *
   * @name standard_fonts_metrics
   * @module
   */
  (function (API) {
    /*
    # reference (Python) versions of 'compress' and 'uncompress'
    # only 'uncompress' function is featured lower as JavaScript
    # if you want to unit test "roundtrip", just transcribe the reference
    # 'compress' function from Python into JavaScript
    def compress(data):
    	keys =   '0123456789abcdef'
    values = 'klmnopqrstuvwxyz'
    mapping = dict(zip(keys, values))
    vals = []
    for key in data.keys():
    value = data[key]
    try:
    	keystring = hex(key)[2:]
    	keystring = keystring[:-1] + mapping[keystring[-1:]]
    except:
    	keystring = key.join(["'","'"])
    	#print('Keystring is %s' % keystring)
    		try:
    	if value < 0:
    		valuestring = hex(value)[3:]
    		numberprefix = '-'
    	else:
    		valuestring = hex(value)[2:]
    		numberprefix = ''
    	valuestring = numberprefix + valuestring[:-1] + mapping[valuestring[-1:]]
    except:
    	if type(value) == dict:
    		valuestring = compress(value)
    	else:
    		raise Exception("Don't know what to do with value type %s" % type(value))
    		vals.append(keystring+valuestring)
    
    return '{' + ''.join(vals) + '}'
    def uncompress(data):
    	decoded = '0123456789abcdef'
    encoded = 'klmnopqrstuvwxyz'
    mapping = dict(zip(encoded, decoded))
    	sign = +1
    stringmode = False
    stringparts = []
    	output = {}
    	activeobject = output
    parentchain = []
    	keyparts = ''
    valueparts = ''
    	key = None
    	ending = set(encoded)
    	i = 1
    l = len(data) - 1 # stripping starting, ending {}
    while i != l: # stripping {}
    # -, {, }, ' are special.
    		ch = data[i]
    i += 1
    		if ch == "'":
    	if stringmode:
    		# end of string mode
    		stringmode = False
    		key = ''.join(stringparts)
    	else:
    		# start of string mode
    		stringmode = True
    		stringparts = []
    elif stringmode == True:
    	#print("Adding %s to stringpart" % ch)
    	stringparts.append(ch)
    		elif ch == '{':
    	# start of object
    	parentchain.append( [activeobject, key] )
    	activeobject = {}
    	key = None
    	#DEBUG = True
    elif ch == '}':
    	# end of object
    	parent, key = parentchain.pop()
    	parent[key] = activeobject
    	key = None
    	activeobject = parent
    	#DEBUG = False
    		elif ch == '-':
    	sign = -1
    else:
    	# must be number
    	if key == None:
    		#debug("In Key. It is '%s', ch is '%s'" % (keyparts, ch))
    		if ch in ending:
    			#debug("End of key")
    			keyparts += mapping[ch]
    			key = int(keyparts, 16) * sign
    			sign = +1
    			keyparts = ''
    		else:
    			keyparts += ch
    	else:
    		#debug("In value. It is '%s', ch is '%s'" % (valueparts, ch))
    		if ch in ending:
    			#debug("End of value")
    			valueparts += mapping[ch]
    			activeobject[key] = int(valueparts, 16) * sign
    			sign = +1
    			key = None
    			valueparts = ''
    		else:
    			valueparts += ch
    			#debug(activeobject)
    	return output
    */

    /**
    Uncompresses data compressed into custom, base16-like format. 
    @public
    @function
    @param
    @returns {Type}
    */

    var uncompress = function uncompress(data) {
      var decoded = "0123456789abcdef",
          encoded = "klmnopqrstuvwxyz",
          mapping = {};

      for (var i = 0; i < encoded.length; i++) {
        mapping[encoded[i]] = decoded[i];
      }

      var undef,
          output = {},
          sign = 1,
          stringparts,
          // undef. will be [] in string mode
      activeobject = output,
          parentchain = [],
          parent_key_pair,
          keyparts = "",
          valueparts = "",
          key,
          // undef. will be Truthy when Key is resolved.
      datalen = data.length - 1,
          // stripping ending }
      ch;
      i = 1; // stripping starting {

      while (i != datalen) {
        // - { } ' are special.
        ch = data[i];
        i += 1;

        if (ch == "'") {
          if (stringparts) {
            // end of string mode
            key = stringparts.join("");
            stringparts = undef;
          } else {
            // start of string mode
            stringparts = [];
          }
        } else if (stringparts) {
          stringparts.push(ch);
        } else if (ch == "{") {
          // start of object
          parentchain.push([activeobject, key]);
          activeobject = {};
          key = undef;
        } else if (ch == "}") {
          // end of object
          parent_key_pair = parentchain.pop();
          parent_key_pair[0][parent_key_pair[1]] = activeobject;
          key = undef;
          activeobject = parent_key_pair[0];
        } else if (ch == "-") {
          sign = -1;
        } else {
          // must be number
          if (key === undef) {
            if (mapping.hasOwnProperty(ch)) {
              keyparts += mapping[ch];
              key = parseInt(keyparts, 16) * sign;
              sign = +1;
              keyparts = "";
            } else {
              keyparts += ch;
            }
          } else {
            if (mapping.hasOwnProperty(ch)) {
              valueparts += mapping[ch];
              activeobject[key] = parseInt(valueparts, 16) * sign;
              sign = +1;
              key = undef;
              valueparts = "";
            } else {
              valueparts += ch;
            }
          }
        }
      } // end while


      return output;
    }; // encoding = 'Unicode'
    // NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE. NO clever BOM behavior
    // Actual 16bit char codes used.
    // no multi-byte logic here
    // Unicode characters to WinAnsiEncoding:
    // {402: 131, 8211: 150, 8212: 151, 8216: 145, 8217: 146, 8218: 130, 8220: 147, 8221: 148, 8222: 132, 8224: 134, 8225: 135, 8226: 149, 8230: 133, 8364: 128, 8240:137, 8249: 139, 8250: 155, 710: 136, 8482: 153, 338: 140, 339: 156, 732: 152, 352: 138, 353: 154, 376: 159, 381: 142, 382: 158}
    // as you can see, all Unicode chars are outside of 0-255 range. No char code conflicts.
    // this means that you can give Win cp1252 encoded strings to jsPDF for rendering directly
    // as well as give strings with some (supported by these fonts) Unicode characters and
    // these will be mapped to win cp1252
    // for example, you can send char code (cp1252) 0x80 or (unicode) 0x20AC, getting "Euro" glyph displayed in both cases.


    var encodingBlock = {
      codePages: ["WinAnsiEncoding"],
      WinAnsiEncoding: uncompress("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")
    },
        encodings = {
      Unicode: {
        Courier: encodingBlock,
        "Courier-Bold": encodingBlock,
        "Courier-BoldOblique": encodingBlock,
        "Courier-Oblique": encodingBlock,
        Helvetica: encodingBlock,
        "Helvetica-Bold": encodingBlock,
        "Helvetica-BoldOblique": encodingBlock,
        "Helvetica-Oblique": encodingBlock,
        "Times-Roman": encodingBlock,
        "Times-Bold": encodingBlock,
        "Times-BoldItalic": encodingBlock,
        "Times-Italic": encodingBlock //	, 'Symbol'
        //	, 'ZapfDingbats'

      }
    },
        fontMetrics = {
      Unicode: {
        // all sizing numbers are n/fontMetricsFractionOf = one font size unit
        // this means that if fontMetricsFractionOf = 1000, and letter A's width is 476, it's
        // width is 476/1000 or 47.6% of its height (regardless of font size)
        // At this time this value applies to "widths" and "kerning" numbers.
        // char code 0 represents "default" (average) width - use it for chars missing in this table.
        // key 'fof' represents the "fontMetricsFractionOf" value
        "Courier-Oblique": uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
        "Times-BoldItalic": uncompress("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"),
        "Helvetica-Bold": uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),
        Courier: uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
        "Courier-BoldOblique": uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
        "Times-Bold": uncompress("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}"),
        Symbol: uncompress("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}"),
        Helvetica: uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"),
        "Helvetica-BoldOblique": uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),
        ZapfDingbats: uncompress("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}"),
        "Courier-Bold": uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
        "Times-Italic": uncompress("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"),
        "Times-Roman": uncompress("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"),
        "Helvetica-Oblique": uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")
      }
    };
    /*
    This event handler is fired when a new jsPDF object is initialized
    This event handler appends metrics data to standard fonts within
    that jsPDF instance. The metrics are mapped over Unicode character
    codes, NOT CIDs or other codes matching the StandardEncoding table of the
    standard PDF fonts.
    Future:
    Also included is the encoding maping table, converting Unicode (UCS-2, UTF-16)
    char codes to StandardEncoding character codes. The encoding table is to be used
    somewhere around "pdfEscape" call.
    */

    API.events.push(["addFont", function (data) {
      var font = data.font;
      var metrics,
          unicode_section,
          encoding = "Unicode",
          encodingBlock;
      metrics = fontMetrics[encoding][font.postScriptName];

      if (metrics) {
        if (font.metadata[encoding]) {
          unicode_section = font.metadata[encoding];
        } else {
          unicode_section = font.metadata[encoding] = {};
        }

        unicode_section.widths = metrics.widths;
        unicode_section.kerning = metrics.kerning;
      }

      encodingBlock = encodings[encoding][font.postScriptName];

      if (encodingBlock) {
        if (font.metadata[encoding]) {
          unicode_section = font.metadata[encoding];
        } else {
          unicode_section = font.metadata[encoding] = {};
        }

        unicode_section.encoding = encodingBlock;

        if (encodingBlock.codePages && encodingBlock.codePages.length) {
          font.encoding = encodingBlock.codePages[0];
        }
      }
    }]); // end of adding event handler
  })(jsPDF.API);

  /**
   * @license
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * @name ttfsupport
   * @module
   */
  (function (jsPDF, global) {

    jsPDF.API.events.push(["addFont", function (data) {
      var font = data.font;
      var instance = data.instance;

      if (typeof instance !== "undefined" && instance.existsFileInVFS(font.postScriptName)) {
        var file = instance.getFileFromVFS(font.postScriptName);

        if (typeof file !== "string") {
          throw new Error("Font is not stored as string-data in vFS, import fonts or remove declaration doc.addFont('" + font.postScriptName + "').");
        }

        font.metadata = jsPDF.API.TTFFont.open(font.postScriptName, font.fontName, file, font.encoding);
        font.metadata.Unicode = font.metadata.Unicode || {
          encoding: {},
          kerning: {},
          widths: []
        };
        font.metadata.glyIdsUsed = [0];
      } else if (font.isStandardFont === false) {
        throw new Error("Font does not exist in vFS, import fonts or remove declaration doc.addFont('" + font.postScriptName + "').");
      }
    }]); // end of adding event handler
  })(jsPDF, typeof self !== "undefined" && self || typeof global !== "undefined" && global || typeof window !== "undefined" && window || Function("return this")());

  /** @license
   * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
   *
   * 
   * ====================================================================
   */

  /**
   * jsPDF SVG plugin
   *
   * @name svg
   * @module
   */
  (function (jsPDFAPI) {
    /**
     * Parses SVG XML and converts only some of the SVG elements into
     * PDF elements.
     *
     * Supports:
     * paths
     *
     * @name addSvg
     * @public
     * @function
     * @param {string} SVG-Data as Text
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {number} width of SVG (in units declared at inception of PDF document)
     * @param {number} height of SVG (in units declared at inception of PDF document)
     * @returns {Object} jsPDF-instance
     */

    jsPDFAPI.addSvg = function (svgtext, x, y, w, h) {
      // 'this' is _jsPDF object returned when jsPDF is inited (new jsPDF())
      var undef;

      if (x === undef || y === undef) {
        throw new Error("addSVG needs values for 'x' and 'y'");
      }

      function InjectCSS(cssbody, document) {
        var styletag = document.createElement("style");
        styletag.type = "text/css";

        if (styletag.styleSheet) {
          // ie
          styletag.styleSheet.cssText = cssbody;
        } else {
          // others
          styletag.appendChild(document.createTextNode(cssbody));
        }

        document.getElementsByTagName("head")[0].appendChild(styletag);
      }

      function createWorkerNode(document) {
        var frameID = "childframe",
            // Date.now().toString() + '_' + (Math.random() * 100).toString()
        frame = document.createElement("iframe");
        InjectCSS(".jsPDF_sillysvg_iframe {display:none;position:absolute;}", document);
        frame.name = frameID;
        frame.setAttribute("width", 0);
        frame.setAttribute("height", 0);
        frame.setAttribute("frameborder", "0");
        frame.setAttribute("scrolling", "no");
        frame.setAttribute("seamless", "seamless");
        frame.setAttribute("class", "jsPDF_sillysvg_iframe");
        document.body.appendChild(frame);
        return frame;
      }

      function attachSVGToWorkerNode(svgtext, frame) {
        var framedoc = (frame.contentWindow || frame.contentDocument).document;
        framedoc.write(svgtext);
        framedoc.close();
        return framedoc.getElementsByTagName("svg")[0];
      }

      function convertPathToPDFLinesArgs(path) {
        // - starting coordinate pair
        // - array of arrays of vector shifts (2-len for line, 6 len for bezier)
        // - scale array [horizontal, vertical] ratios
        // - style (stroke, fill, both)

        var x = parseFloat(path[1]),
            y = parseFloat(path[2]),
            vectors = [],
            position = 3,
            len = path.length;

        while (position < len) {
          if (path[position] === "c") {
            vectors.push([parseFloat(path[position + 1]), parseFloat(path[position + 2]), parseFloat(path[position + 3]), parseFloat(path[position + 4]), parseFloat(path[position + 5]), parseFloat(path[position + 6])]);
            position += 7;
          } else if (path[position] === "l") {
            vectors.push([parseFloat(path[position + 1]), parseFloat(path[position + 2])]);
            position += 3;
          } else {
            position += 1;
          }
        }

        return [x, y, vectors];
      }

      var workernode = createWorkerNode(document),
          svgnode = attachSVGToWorkerNode(svgtext, workernode),
          scale = [1, 1],
          svgw = parseFloat(svgnode.getAttribute("width")),
          svgh = parseFloat(svgnode.getAttribute("height"));

      if (svgw && svgh) {
        // setting both w and h makes image stretch to size.
        // this may distort the image, but fits your demanded size
        if (w && h) {
          scale = [w / svgw, h / svgh];
        } // if only one is set, that value is set as max and SVG
        // is scaled proportionately.
        else if (w) {
            scale = [w / svgw, w / svgw];
          } else if (h) {
            scale = [h / svgh, h / svgh];
          }
      }

      var i,
          l,
          tmp,
          linesargs,
          items = svgnode.childNodes;

      for (i = 0, l = items.length; i < l; i++) {
        tmp = items[i];

        if (tmp.tagName && tmp.tagName.toUpperCase() === "PATH") {
          linesargs = convertPathToPDFLinesArgs(tmp.getAttribute("d").split(" ")); // path start x coordinate

          linesargs[0] = linesargs[0] * scale[0] + x; // where x is upper left X of image
          // path start y coordinate

          linesargs[1] = linesargs[1] * scale[1] + y; // where y is upper left Y of image
          // the rest of lines are vectors. these will adjust with scale value auto.

          this.lines.call(this, linesargs[2], // lines
          linesargs[0], // starting x
          linesargs[1], // starting y
          scale);
        }
      } // clean up
      // workernode.parentNode.removeChild(workernode)


      return this;
    }; //fallback


    jsPDFAPI.addSVG = jsPDFAPI.addSvg;
    /**
     * Parses SVG XML and saves it as image into the PDF.
     *
     * Depends on canvas-element and canvg
     *
     * @name addSvgAsImage
     * @public
     * @function
     * @param {string} SVG-Data as Text
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {number} width of SVG-Image (in units declared at inception of PDF document)
     * @param {number} height of SVG-Image (in units declared at inception of PDF document)
     * @param {string} alias of SVG-Image (if used multiple times)
     * @param {string} compression of the generated JPEG, can have the values 'NONE', 'FAST', 'MEDIUM' and 'SLOW'
     * @param {number} rotation of the image in degrees (0-359)
     *
     * @returns jsPDF jsPDF-instance
     */

    jsPDFAPI.addSvgAsImage = function (svg, x, y, w, h, alias, compression, rotation) {
      if (isNaN(x) || isNaN(y)) {
        console.error("jsPDF.addSvgAsImage: Invalid coordinates", arguments);
        throw new Error("Invalid coordinates passed to jsPDF.addSvgAsImage");
      }

      if (isNaN(w) || isNaN(h)) {
        console.error("jsPDF.addSvgAsImage: Invalid measurements", arguments);
        throw new Error("Invalid measurements (width and/or height) passed to jsPDF.addSvgAsImage");
      }

      var canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff"; /// set white fill style

      ctx.fillRect(0, 0, canvas.width, canvas.height); //load a svg snippet in the canvas with id = 'drawingArea'

      canvg(canvas, svg, {
        ignoreMouse: true,
        ignoreAnimation: true,
        ignoreDimensions: true,
        ignoreClear: true
      });
      this.addImage(canvas.toDataURL("image/jpeg", 1.0), x, y, w, h, compression, rotation);
      return this;
    };
  })(jsPDF.API);

  /**
   * @license
   * ====================================================================
   * Copyright (c) 2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
   *
   * 
   * ====================================================================
   */

  /**
   * jsPDF total_pages plugin
   * @name total_pages
   * @module
   */
  (function (jsPDFAPI) {
    /**
     * @name putTotalPages
     * @function
     * @param {string} pageExpression Regular Expression
     * @returns {jsPDF} jsPDF-instance
     */

    jsPDFAPI.putTotalPages = function (pageExpression) {

      var replaceExpression = new RegExp(pageExpression, "g");

      for (var n = 1; n <= this.internal.getNumberOfPages(); n++) {
        for (var i = 0; i < this.internal.pages[n].length; i++) {
          this.internal.pages[n][i] = this.internal.pages[n][i].replace(replaceExpression, this.internal.getNumberOfPages());
        }
      }

      return this;
    };
  })(jsPDF.API);

  /**
   * jsPDF viewerPreferences Plugin
   * @author Aras Abbasi (github.com/arasabbasi)
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * Adds the ability to set ViewerPreferences and by thus
   * controlling the way the document is to be presented on the
   * screen or in print.
   * @name viewerpreferences
   * @module
   */
  (function (jsPDFAPI) {
    /**
     * Set the ViewerPreferences of the generated PDF
     *
     * @name viewerPreferences
     * @function
     * @public
     * @param {Object} options Array with the ViewerPreferences<br />
     * Example: doc.viewerPreferences({"FitWindow":true});<br />
     * <br />
     * You can set following preferences:<br />
     * <br/>
     * <b>HideToolbar</b> <i>(boolean)</i><br />
     * Default value: false<br />
     * <br />
     * <b>HideMenubar</b> <i>(boolean)</i><br />
     * Default value: false.<br />
     * <br />
     * <b>HideWindowUI</b> <i>(boolean)</i><br />
     * Default value: false.<br />
     * <br />
     * <b>FitWindow</b> <i>(boolean)</i><br />
     * Default value: false.<br />
     * <br />
     * <b>CenterWindow</b> <i>(boolean)</i><br />
     * Default value: false<br />
     * <br />
     * <b>DisplayDocTitle</b> <i>(boolean)</i><br />
     * Default value: false.<br />
     * <br />
     * <b>NonFullScreenPageMode</b> <i>(string)</i><br />
     * Possible values: UseNone, UseOutlines, UseThumbs, UseOC<br />
     * Default value: UseNone<br/>
     * <br />
     * <b>Direction</b> <i>(string)</i><br />
     * Possible values: L2R, R2L<br />
     * Default value: L2R.<br />
     * <br />
     * <b>ViewArea</b> <i>(string)</i><br />
     * Possible values: MediaBox, CropBox, TrimBox, BleedBox, ArtBox<br />
     * Default value: CropBox.<br />
     * <br />
     * <b>ViewClip</b> <i>(string)</i><br />
     * Possible values: MediaBox, CropBox, TrimBox, BleedBox, ArtBox<br />
     * Default value: CropBox<br />
     * <br />
     * <b>PrintArea</b> <i>(string)</i><br />
     * Possible values: MediaBox, CropBox, TrimBox, BleedBox, ArtBox<br />
     * Default value: CropBox<br />
     * <br />
     * <b>PrintClip</b> <i>(string)</i><br />
     * Possible values: MediaBox, CropBox, TrimBox, BleedBox, ArtBox<br />
     * Default value: CropBox.<br />
     * <br />
     * <b>PrintScaling</b> <i>(string)</i><br />
     * Possible values: AppDefault, None<br />
     * Default value: AppDefault.<br />
     * <br />
     * <b>Duplex</b> <i>(string)</i><br />
     * Possible values: Simplex, DuplexFlipLongEdge, DuplexFlipShortEdge
     * Default value: none<br />
     * <br />
     * <b>PickTrayByPDFSize</b> <i>(boolean)</i><br />
     * Default value: false<br />
     * <br />
     * <b>PrintPageRange</b> <i>(Array)</i><br />
     * Example: [[1,5], [7,9]]<br />
     * Default value: as defined by PDF viewer application<br />
     * <br />
     * <b>NumCopies</b> <i>(Number)</i><br />
     * Possible values: 1, 2, 3, 4, 5<br />
     * Default value: 1<br />
     * <br />
     * For more information see the PDF Reference, sixth edition on Page 577
     * @param {boolean} doReset True to reset the settings
     * @function
     * @returns jsPDF jsPDF-instance
     * @example
     * var doc = new jsPDF()
     * doc.text('This is a test', 10, 10)
     * doc.viewerPreferences({'FitWindow': true}, true)
     * doc.save("viewerPreferences.pdf")
     *
     * // Example printing 10 copies, using cropbox, and hiding UI.
     * doc.viewerPreferences({
     *   'HideWindowUI': true,
     *   'PrintArea': 'CropBox',
     *   'NumCopies': 10
     * })
     */

    jsPDFAPI.viewerPreferences = function (options, doReset) {
      options = options || {};
      doReset = doReset || false;
      var configuration;
      var configurationTemplate = {
        HideToolbar: {
          defaultValue: false,
          value: false,
          type: "boolean",
          explicitSet: false,
          valueSet: [true, false],
          pdfVersion: 1.3
        },
        HideMenubar: {
          defaultValue: false,
          value: false,
          type: "boolean",
          explicitSet: false,
          valueSet: [true, false],
          pdfVersion: 1.3
        },
        HideWindowUI: {
          defaultValue: false,
          value: false,
          type: "boolean",
          explicitSet: false,
          valueSet: [true, false],
          pdfVersion: 1.3
        },
        FitWindow: {
          defaultValue: false,
          value: false,
          type: "boolean",
          explicitSet: false,
          valueSet: [true, false],
          pdfVersion: 1.3
        },
        CenterWindow: {
          defaultValue: false,
          value: false,
          type: "boolean",
          explicitSet: false,
          valueSet: [true, false],
          pdfVersion: 1.3
        },
        DisplayDocTitle: {
          defaultValue: false,
          value: false,
          type: "boolean",
          explicitSet: false,
          valueSet: [true, false],
          pdfVersion: 1.4
        },
        NonFullScreenPageMode: {
          defaultValue: "UseNone",
          value: "UseNone",
          type: "name",
          explicitSet: false,
          valueSet: ["UseNone", "UseOutlines", "UseThumbs", "UseOC"],
          pdfVersion: 1.3
        },
        Direction: {
          defaultValue: "L2R",
          value: "L2R",
          type: "name",
          explicitSet: false,
          valueSet: ["L2R", "R2L"],
          pdfVersion: 1.3
        },
        ViewArea: {
          defaultValue: "CropBox",
          value: "CropBox",
          type: "name",
          explicitSet: false,
          valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"],
          pdfVersion: 1.4
        },
        ViewClip: {
          defaultValue: "CropBox",
          value: "CropBox",
          type: "name",
          explicitSet: false,
          valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"],
          pdfVersion: 1.4
        },
        PrintArea: {
          defaultValue: "CropBox",
          value: "CropBox",
          type: "name",
          explicitSet: false,
          valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"],
          pdfVersion: 1.4
        },
        PrintClip: {
          defaultValue: "CropBox",
          value: "CropBox",
          type: "name",
          explicitSet: false,
          valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"],
          pdfVersion: 1.4
        },
        PrintScaling: {
          defaultValue: "AppDefault",
          value: "AppDefault",
          type: "name",
          explicitSet: false,
          valueSet: ["AppDefault", "None"],
          pdfVersion: 1.6
        },
        Duplex: {
          defaultValue: "",
          value: "none",
          type: "name",
          explicitSet: false,
          valueSet: ["Simplex", "DuplexFlipShortEdge", "DuplexFlipLongEdge", "none"],
          pdfVersion: 1.7
        },
        PickTrayByPDFSize: {
          defaultValue: false,
          value: false,
          type: "boolean",
          explicitSet: false,
          valueSet: [true, false],
          pdfVersion: 1.7
        },
        PrintPageRange: {
          defaultValue: "",
          value: "",
          type: "array",
          explicitSet: false,
          valueSet: null,
          pdfVersion: 1.7
        },
        NumCopies: {
          defaultValue: 1,
          value: 1,
          type: "integer",
          explicitSet: false,
          valueSet: null,
          pdfVersion: 1.7
        }
      };
      var configurationKeys = Object.keys(configurationTemplate);
      var rangeArray = [];
      var i = 0;
      var j = 0;
      var k = 0;
      var isValid = true;
      var method;
      var value;

      function arrayContainsElement(array, element) {
        var iterator;
        var result = false;

        for (iterator = 0; iterator < array.length; iterator += 1) {
          if (array[iterator] === element) {
            result = true;
          }
        }

        return result;
      }

      if (this.internal.viewerpreferences === undefined) {
        this.internal.viewerpreferences = {};
        this.internal.viewerpreferences.configuration = JSON.parse(JSON.stringify(configurationTemplate));
        this.internal.viewerpreferences.isSubscribed = false;
      }

      configuration = this.internal.viewerpreferences.configuration;

      if (options === "reset" || doReset === true) {
        var len = configurationKeys.length;

        for (k = 0; k < len; k += 1) {
          configuration[configurationKeys[k]].value = configuration[configurationKeys[k]].defaultValue;
          configuration[configurationKeys[k]].explicitSet = false;
        }
      }

      if (_typeof(options) === "object") {
        for (method in options) {
          value = options[method];

          if (arrayContainsElement(configurationKeys, method) && value !== undefined) {
            if (configuration[method].type === "boolean" && typeof value === "boolean") {
              configuration[method].value = value;
            } else if (configuration[method].type === "name" && arrayContainsElement(configuration[method].valueSet, value)) {
              configuration[method].value = value;
            } else if (configuration[method].type === "integer" && Number.isInteger(value)) {
              configuration[method].value = value;
            } else if (configuration[method].type === "array") {
              for (i = 0; i < value.length; i += 1) {
                isValid = true;

                if (value[i].length === 1 && typeof value[i][0] === "number") {
                  rangeArray.push(String(value[i]));
                } else if (value[i].length > 1) {
                  for (j = 0; j < value[i].length; j += 1) {
                    if (typeof value[i][j] !== "number") {
                      isValid = false;
                    }
                  }

                  if (isValid === true) {
                    rangeArray.push(String(value[i].join("-")));
                  }
                }
              }

              configuration[method].value = String(rangeArray);
            } else {
              configuration[method].value = configuration[method].defaultValue;
            }

            configuration[method].explicitSet = true;
          }
        }
      }

      if (this.internal.viewerpreferences.isSubscribed === false) {
        this.internal.events.subscribe("putCatalog", function () {
          var pdfDict = [];
          var vPref;

          for (vPref in configuration) {
            if (configuration[vPref].explicitSet === true) {
              if (configuration[vPref].type === "name") {
                pdfDict.push("/" + vPref + " /" + configuration[vPref].value);
              } else {
                pdfDict.push("/" + vPref + " " + configuration[vPref].value);
              }
            }
          }

          if (pdfDict.length !== 0) {
            this.internal.write("/ViewerPreferences\n<<\n" + pdfDict.join("\n") + "\n>>");
          }
        });
        this.internal.viewerpreferences.isSubscribed = true;
      }

      this.internal.viewerpreferences.configuration = configuration;
      return this;
    };
  })(jsPDF.API);

  /** ====================================================================
   * jsPDF XMP metadata plugin
   * Copyright (c) 2016 Jussi Utunen, u-jussi@suomi24.fi
   *
   * 
   * ====================================================================
   */

  /*global jsPDF */

  /**
   * @name xmp_metadata
   * @module
   */
  (function (jsPDFAPI) {

    var xmpmetadata = "";
    var xmpnamespaceuri = "";
    var metadata_object_number = "";
    /**
     * Adds XMP formatted metadata to PDF
     *
     * @name addMetadata
     * @function
     * @param {String} metadata The actual metadata to be added. The metadata shall be stored as XMP simple value. Note that if the metadata string contains XML markup characters "<", ">" or "&", those characters should be written using XML entities.
     * @param {String} namespaceuri Sets the namespace URI for the metadata. Last character should be slash or hash.
     * @returns {jsPDF} jsPDF-instance
     */

    jsPDFAPI.addMetadata = function (metadata, namespaceuri) {
      xmpnamespaceuri = namespaceuri || "http://jspdf.default.namespaceuri/"; //The namespace URI for an XMP name shall not be empty

      xmpmetadata = metadata;
      this.internal.events.subscribe("postPutResources", function () {
        if (!xmpmetadata) {
          metadata_object_number = "";
        } else {
          var xmpmeta_beginning = '<x:xmpmeta xmlns:x="adobe:ns:meta/">';
          var rdf_beginning = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:jspdf="' + xmpnamespaceuri + '"><jspdf:metadata>';
          var rdf_ending = "</jspdf:metadata></rdf:Description></rdf:RDF>";
          var xmpmeta_ending = "</x:xmpmeta>";
          var utf8_xmpmeta_beginning = unescape(encodeURIComponent(xmpmeta_beginning));
          var utf8_rdf_beginning = unescape(encodeURIComponent(rdf_beginning));
          var utf8_metadata = unescape(encodeURIComponent(xmpmetadata));
          var utf8_rdf_ending = unescape(encodeURIComponent(rdf_ending));
          var utf8_xmpmeta_ending = unescape(encodeURIComponent(xmpmeta_ending));
          var total_len = utf8_rdf_beginning.length + utf8_metadata.length + utf8_rdf_ending.length + utf8_xmpmeta_beginning.length + utf8_xmpmeta_ending.length;
          metadata_object_number = this.internal.newObject();
          this.internal.write("<< /Type /Metadata /Subtype /XML /Length " + total_len + " >>");
          this.internal.write("stream");
          this.internal.write(utf8_xmpmeta_beginning + utf8_rdf_beginning + utf8_metadata + utf8_rdf_ending + utf8_xmpmeta_ending);
          this.internal.write("endstream");
          this.internal.write("endobj");
        }
      });
      this.internal.events.subscribe("putCatalog", function () {
        if (metadata_object_number) {
          this.internal.write("/Metadata " + metadata_object_number + " 0 R");
        }
      });
      return this;
    };
  })(jsPDF.API);

  /**
   * @name utf8
   * @module
   */
  (function (jsPDF, global) {

    var jsPDFAPI = jsPDF.API;
    /**************************************************/

    /* function : toHex                               */

    /* comment : Replace str with a hex string.       */

    /**************************************************/

    function toHex(str) {
      var hex = "";

      for (var i = 0; i < str.length; i++) {
        hex += "" + str.charCodeAt(i).toString(16);
      }

      return hex;
    }
    /***************************************************************************************************/

    /* function : pdfEscape16                                                                          */

    /* comment : The character id of a 2-byte string is converted to a hexadecimal number by obtaining */

    /*   the corresponding glyph id and width, and then adding padding to the string.                  */

    /***************************************************************************************************/


    var pdfEscape16 = jsPDFAPI.pdfEscape16 = function (text, font) {
      var widths = font.metadata.Unicode.widths;
      var padz = ["", "0", "00", "000", "0000"];
      var ar = [""];

      for (var i = 0, l = text.length, t; i < l; ++i) {
        t = font.metadata.characterToGlyph(text.charCodeAt(i));
        font.metadata.glyIdsUsed.push(t);
        font.metadata.toUnicode[t] = text.charCodeAt(i);

        if (widths.indexOf(t) == -1) {
          widths.push(t);
          widths.push([parseInt(font.metadata.widthOfGlyph(t), 10)]);
        }

        if (t == "0") {
          //Spaces are not allowed in cmap.
          return ar.join("");
        } else {
          t = t.toString(16);
          ar.push(padz[4 - t.length], t);
        }
      }

      return ar.join("");
    };

    var toUnicodeCmap = function toUnicodeCmap(map) {
      var code, codes, range, unicode, unicodeMap, _i, _len;

      unicodeMap = "/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000><ffff>\nendcodespacerange";
      codes = Object.keys(map).sort(function (a, b) {
        return a - b;
      });
      range = [];

      for (_i = 0, _len = codes.length; _i < _len; _i++) {
        code = codes[_i];

        if (range.length >= 100) {
          unicodeMap += "\n" + range.length + " beginbfchar\n" + range.join("\n") + "\nendbfchar";
          range = [];
        }

        unicode = ("0000" + map[code].toString(16)).slice(-4);
        code = ("0000" + (+code).toString(16)).slice(-4);
        range.push("<" + code + "><" + unicode + ">");
      }

      if (range.length) {
        unicodeMap += "\n" + range.length + " beginbfchar\n" + range.join("\n") + "\nendbfchar\n";
      }

      unicodeMap += "endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend";
      return unicodeMap;
    };

    var identityHFunction = function identityHFunction(font, out, newObject, putStream) {
      if (font.metadata instanceof jsPDF.API.TTFFont && font.encoding === "Identity-H") {
        //Tag with Identity-H
        var widths = font.metadata.Unicode.widths;
        var data = font.metadata.subset.encode(font.metadata.glyIdsUsed, 1);
        var pdfOutput = data;
        var pdfOutput2 = "";

        for (var i = 0; i < pdfOutput.length; i++) {
          pdfOutput2 += String.fromCharCode(pdfOutput[i]);
        }

        var fontTable = newObject();
        out("<<");
        out("/Length " + pdfOutput2.length);
        out("/Length1 " + pdfOutput2.length);
        out(">>");
        putStream(pdfOutput2);
        out("endobj");
        var cmap = newObject();
        var cmapData = toUnicodeCmap(font.metadata.toUnicode);
        out("<<");
        out("/Length " + cmapData.length);
        out("/Length1 " + cmapData.length);
        out(">>");
        putStream(cmapData);
        out("endobj");
        var fontDescriptor = newObject();
        out("<<");
        out("/Type /FontDescriptor");
        out("/FontName /" + font.fontName);
        out("/FontFile2 " + fontTable + " 0 R");
        out("/FontBBox " + jsPDF.API.PDFObject.convert(font.metadata.bbox));
        out("/Flags " + font.metadata.flags);
        out("/StemV " + font.metadata.stemV);
        out("/ItalicAngle " + font.metadata.italicAngle);
        out("/Ascent " + font.metadata.ascender);
        out("/Descent " + font.metadata.decender);
        out("/CapHeight " + font.metadata.capHeight);
        out(">>");
        out("endobj");
        var DescendantFont = newObject();
        out("<<");
        out("/Type /Font");
        out("/BaseFont /" + font.fontName);
        out("/FontDescriptor " + fontDescriptor + " 0 R");
        out("/W " + jsPDF.API.PDFObject.convert(widths));
        out("/CIDToGIDMap /Identity");
        out("/DW 1000");
        out("/Subtype /CIDFontType2");
        out("/CIDSystemInfo");
        out("<<");
        out("/Supplement 0");
        out("/Registry (Adobe)");
        out("/Ordering (" + font.encoding + ")");
        out(">>");
        out(">>");
        out("endobj");
        font.objectNumber = newObject();
        out("<<");
        out("/Type /Font");
        out("/Subtype /Type0");
        out("/ToUnicode " + cmap + " 0 R");
        out("/BaseFont /" + font.fontName);
        out("/Encoding /" + font.encoding);
        out("/DescendantFonts [" + DescendantFont + " 0 R]");
        out(">>");
        out("endobj");
        font.isAlreadyPutted = true;
      }
    };

    jsPDFAPI.events.push(["putFont", function (args) {
      identityHFunction(args.font, args.out, args.newObject, args.putStream);
    }]);

    var winAnsiEncodingFunction = function winAnsiEncodingFunction(font, out, newObject, putStream) {
      if (font.metadata instanceof jsPDF.API.TTFFont && font.encoding === "WinAnsiEncoding") {
        //Tag with WinAnsi encoding
        var widths = font.metadata.Unicode.widths;
        var data = font.metadata.rawData;
        var pdfOutput = data;
        var pdfOutput2 = "";

        for (var i = 0; i < pdfOutput.length; i++) {
          pdfOutput2 += String.fromCharCode(pdfOutput[i]);
        }

        var fontTable = newObject();
        putStream({
          data: pdfOutput2,
          addLength1: true
        });
        out("endobj");
        var cmap = newObject();
        var cmapData = toUnicodeCmap(font.metadata.toUnicode);
        putStream({
          data: cmapData,
          addLength1: true
        });
        out("endobj");
        var fontDescriptor = newObject();
        out("<<");
        out("/Descent " + font.metadata.decender);
        out("/CapHeight " + font.metadata.capHeight);
        out("/StemV " + font.metadata.stemV);
        out("/Type /FontDescriptor");
        out("/FontFile2 " + fontTable + " 0 R");
        out("/Flags 96");
        out("/FontBBox " + jsPDF.API.PDFObject.convert(font.metadata.bbox));
        out("/FontName /" + font.fontName);
        out("/ItalicAngle " + font.metadata.italicAngle);
        out("/Ascent " + font.metadata.ascender);
        out(">>");
        out("endobj");
        font.objectNumber = newObject();

        for (var i = 0; i < font.metadata.hmtx.widths.length; i++) {
          font.metadata.hmtx.widths[i] = parseInt(font.metadata.hmtx.widths[i] * (1000 / font.metadata.head.unitsPerEm)); //Change the width of Em units to Point units.
        }

        out("<</Subtype/TrueType/Type/Font/ToUnicode " + cmap + " 0 R/BaseFont/" + font.fontName + "/FontDescriptor " + fontDescriptor + " 0 R" + "/Encoding/" + font.encoding + " /FirstChar 29 /LastChar 255 /Widths " + jsPDF.API.PDFObject.convert(font.metadata.hmtx.widths) + ">>");
        out("endobj");
        font.isAlreadyPutted = true;
      }
    };

    jsPDFAPI.events.push(["putFont", function (args) {
      winAnsiEncodingFunction(args.font, args.out, args.newObject, args.putStream);
    }]);

    var utf8TextFunction = function utf8TextFunction(args) {
      var text = args.text || "";
      var x = args.x;
      var y = args.y;
      var options = args.options || {};
      var mutex = args.mutex || {};
      var pdfEscape = mutex.pdfEscape;
      var activeFontKey = mutex.activeFontKey;
      var fonts = mutex.fonts;
      var key,
          fontSize = mutex.activeFontSize;
      var str = "",
          s = 0,
          cmapConfirm;
      var strText = "";
      var key = activeFontKey;
      var encoding = fonts[key].encoding;

      if (fonts[key].encoding !== "Identity-H") {
        return {
          text: text,
          x: x,
          y: y,
          options: options,
          mutex: mutex
        };
      }
      strText = text;
      key = activeFontKey;

      if (Object.prototype.toString.call(text) === "[object Array]") {
        strText = text[0];
      }

      for (s = 0; s < strText.length; s += 1) {
        if (fonts[key].metadata.hasOwnProperty("cmap")) {
          cmapConfirm = fonts[key].metadata.cmap.unicode.codeMap[strText[s].charCodeAt(0)];
          /*
               if (Object.prototype.toString.call(text) === '[object Array]') {
                  var i = 0;
                 // for (i = 0; i < text.length; i += 1) {
                      if (Object.prototype.toString.call(text[s]) === '[object Array]') {
                          cmapConfirm = fonts[key].metadata.cmap.unicode.codeMap[strText[s][0].charCodeAt(0)]; //Make sure the cmap has the corresponding glyph id
                      } else {
                          
                      }
                  //}
                  
              } else {
                  cmapConfirm = fonts[key].metadata.cmap.unicode.codeMap[strText[s].charCodeAt(0)]; //Make sure the cmap has the corresponding glyph id
              }*/
        }

        if (!cmapConfirm) {
          if (strText[s].charCodeAt(0) < 256 && fonts[key].metadata.hasOwnProperty("Unicode")) {
            str += strText[s];
          } else {
            str += "";
          }
        } else {
          str += strText[s];
        }
      }

      var result = "";

      if (parseInt(key.slice(1)) < 14 || encoding === "WinAnsiEncoding") {
        //For the default 13 font
        result = toHex(pdfEscape(str, key));
      } else if (encoding === "Identity-H") {
        result = pdfEscape16(str, fonts[key]);
      }

      mutex.isHex = true;
      return {
        text: result,
        x: x,
        y: y,
        options: options,
        mutex: mutex
      };
    };

    var utf8EscapeFunction = function utf8EscapeFunction(parms) {
      var text = parms.text || "",
          x = parms.x,
          y = parms.y,
          options = parms.options,
          mutex = parms.mutex;
      var lang = options.lang;
      var tmpText = [];
      var args = {
        text: text,
        x: x,
        y: y,
        options: options,
        mutex: mutex
      };

      if (Object.prototype.toString.call(text) === "[object Array]") {
        var i = 0;

        for (i = 0; i < text.length; i += 1) {
          if (Object.prototype.toString.call(text[i]) === "[object Array]") {
            if (text[i].length === 3) {
              tmpText.push([utf8TextFunction(Object.assign({}, args, {
                text: text[i][0]
              })).text, text[i][1], text[i][2]]);
            } else {
              tmpText.push(utf8TextFunction(Object.assign({}, args, {
                text: text[i]
              })).text);
            }
          } else {
            tmpText.push(utf8TextFunction(Object.assign({}, args, {
              text: text[i]
            })).text);
          }
        }

        parms.text = tmpText;
      } else {
        parms.text = utf8TextFunction(Object.assign({}, args, {
          text: text
        })).text;
      }
    };

    jsPDFAPI.events.push(["postProcessText", utf8EscapeFunction]);
  })(jsPDF, typeof self !== "undefined" && self || typeof global !== "undefined" && global || typeof window !== "undefined" && window || Function("return this")());

  /**
   * jsPDF virtual FileSystem functionality
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * Use the vFS to handle files
   *
   * @name vFS
   * @module
   */
  (function (jsPDFAPI) {

    var vFS = {};
    /**
     * Check if the file exists in the vFS
     *
     * @name existsFileInVFS
     * @function
     * @param {string} Possible filename in the vFS.
     * @returns {boolean}
     * @example
     * doc.existsFileInVFS("someFile.txt");
     */

    jsPDFAPI.existsFileInVFS = function (filename) {
      return vFS.hasOwnProperty(filename);
    };
    /**
     * Add a file to the vFS
     *
     * @name addFileToVFS
     * @function
     * @param {string} filename The name of the file which should be added.
     * @param {string} filecontent The content of the file.
     * @returns {jsPDF}
     * @example
     * doc.addFileToVFS("someFile.txt", "BADFACE1");
     */


    jsPDFAPI.addFileToVFS = function (filename, filecontent) {
      vFS[filename] = filecontent;
      return this;
    };
    /**
     * Get the file from the vFS
     *
     * @name getFileFromVFS
     * @function
     * @returns {string} The name of the file which gets requested.
     * @example
     * doc.getFileFromVFS("someFile.txt");
     */


    jsPDFAPI.getFileFromVFS = function (filename) {
      if (vFS.hasOwnProperty(filename)) {
        return vFS[filename];
      }

      return null;
    };
  })(jsPDF.API);

  /* Blob.js
   * A Blob implementation.
   * 2014-07-24
   *
   * By Eli Grey, http://eligrey.com
   * By Devin Samarin, https://github.com/dsamarin
   * License: X11/MIT
   *   See https://github.com/eligrey/Blob.js/blob/master/LICENSE.md
   */

  /*global self, unescape */

  /*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
    plusplus: true */

  /*! @source http://purl.eligrey.com/github/Blob.js/blob/master/Blob.js */
  (function (view) {

    view.URL = view.URL || view.webkitURL;

    if (view.Blob && view.URL) {
      try {
        new Blob();
        return;
      } catch (e) {}
    } // Internally we use a BlobBuilder implementation to base Blob off of
    // in order to support older browsers that only have BlobBuilder


    var BlobBuilder = view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder || function (view) {
      var get_class = function (object) {
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
      },
          FakeBlobBuilder = function BlobBuilder() {
        this.data = [];
      },
          FakeBlob = function Blob(data, type, encoding) {
        this.data = data;
        this.size = data.length;
        this.type = type;
        this.encoding = encoding;
      },
          FBB_proto = FakeBlobBuilder.prototype,
          FB_proto = FakeBlob.prototype,
          FileReaderSync = view.FileReaderSync,
          FileException = function (type) {
        this.code = this[this.name = type];
      },
          file_ex_codes = ("NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR " + "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR").split(" "),
          file_ex_code = file_ex_codes.length,
          real_URL = view.URL || view.webkitURL || view,
          real_create_object_URL = real_URL.createObjectURL,
          real_revoke_object_URL = real_URL.revokeObjectURL,
          URL = real_URL,
          btoa = view.btoa,
          atob = view.atob,
          ArrayBuffer = view.ArrayBuffer,
          Uint8Array = view.Uint8Array,
          origin = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;

      FakeBlob.fake = FB_proto.fake = true;

      while (file_ex_code--) {
        FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
      } // Polyfill URL


      if (!real_URL.createObjectURL) {
        URL = view.URL = function (uri) {
          var uri_info = document.createElementNS("http://www.w3.org/1999/xhtml", "a"),
              uri_origin;
          uri_info.href = uri;

          if (!("origin" in uri_info)) {
            if (uri_info.protocol.toLowerCase() === "data:") {
              uri_info.origin = null;
            } else {
              uri_origin = uri.match(origin);
              uri_info.origin = uri_origin && uri_origin[1];
            }
          }

          return uri_info;
        };
      }

      URL.createObjectURL = function (blob) {
        var type = blob.type,
            data_URI_header;

        if (type === null) {
          type = "application/octet-stream";
        }

        if (blob instanceof FakeBlob) {
          data_URI_header = "data:" + type;

          if (blob.encoding === "base64") {
            return data_URI_header + ";base64," + blob.data;
          } else if (blob.encoding === "URI") {
            return data_URI_header + "," + decodeURIComponent(blob.data);
          }

          if (btoa) {
            return data_URI_header + ";base64," + btoa(blob.data);
          } else {
            return data_URI_header + "," + encodeURIComponent(blob.data);
          }
        } else if (real_create_object_URL) {
          return real_create_object_URL.call(real_URL, blob);
        }
      };

      URL.revokeObjectURL = function (object_URL) {
        if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
          real_revoke_object_URL.call(real_URL, object_URL);
        }
      };

      FBB_proto.append = function (data
      /*, endings*/
      ) {
        var bb = this.data; // decode data to a binary string

        if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
          var str = "",
              buf = new Uint8Array(data),
              i = 0,
              buf_len = buf.length;

          for (; i < buf_len; i++) {
            str += String.fromCharCode(buf[i]);
          }

          bb.push(str);
        } else if (get_class(data) === "Blob" || get_class(data) === "File") {
          if (FileReaderSync) {
            var fr = new FileReaderSync();
            bb.push(fr.readAsBinaryString(data));
          } else {
            // async FileReader won't work as BlobBuilder is sync
            throw new FileException("NOT_READABLE_ERR");
          }
        } else if (data instanceof FakeBlob) {
          if (data.encoding === "base64" && atob) {
            bb.push(atob(data.data));
          } else if (data.encoding === "URI") {
            bb.push(decodeURIComponent(data.data));
          } else if (data.encoding === "raw") {
            bb.push(data.data);
          }
        } else {
          if (typeof data !== "string") {
            data += ""; // convert unsupported types to strings
          } // decode UTF-16 to binary string


          bb.push(unescape(encodeURIComponent(data)));
        }
      };

      FBB_proto.getBlob = function (type) {
        if (!arguments.length) {
          type = null;
        }

        return new FakeBlob(this.data.join(""), type, "raw");
      };

      FBB_proto.toString = function () {
        return "[object BlobBuilder]";
      };

      FB_proto.slice = function (start, end, type) {
        var args = arguments.length;

        if (args < 3) {
          type = null;
        }

        return new FakeBlob(this.data.slice(start, args > 1 ? end : this.data.length), type, this.encoding);
      };

      FB_proto.toString = function () {
        return "[object Blob]";
      };

      FB_proto.close = function () {
        this.size = 0;
        delete this.data;
      };

      return FakeBlobBuilder;
    }(view);

    view.Blob = function (blobParts, options) {
      var type = options ? options.type || "" : "";
      var builder = new BlobBuilder();

      if (blobParts) {
        for (var i = 0, len = blobParts.length; i < len; i++) {
          if (Uint8Array && blobParts[i] instanceof Uint8Array) {
            builder.append(blobParts[i].buffer);
          } else {
            builder.append(blobParts[i]);
          }
        }
      }

      var blob = builder.getBlob(type);

      if (!blob.slice && blob.webkitSlice) {
        blob.slice = blob.webkitSlice;
      }

      return blob;
    };

    var getPrototypeOf = Object.getPrototypeOf || function (object) {
      return object.__proto__;
    };

    view.Blob.prototype = getPrototypeOf(new view.Blob());
  })(typeof self !== "undefined" && self || typeof window !== "undefined" && window || window.content || window);

  /* FileSaver.js
   * A saveAs() FileSaver implementation.
   * 1.3.2
   * 2016-06-16 18:25:19
   *
   * By Eli Grey, http://eligrey.com
   * License: MIT
   *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
   */

  /*global self */

  /*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

  /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
  var saveAs = saveAs || function (view) {

    if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
      return;
    }

    var doc = view.document // only get URL when necessary in case Blob.js hasn't overridden it yet
    ,
        get_URL = function () {
      return view.URL || view.webkitURL || view;
    },
        save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
        can_use_save_link = "download" in save_link,
        click = function (node) {
      var event = new MouseEvent("click");
      node.dispatchEvent(event);
    },
        is_safari = /constructor/i.test(view.HTMLElement) || view.safari,
        is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent),
        throw_outside = function (ex) {
      (view.setImmediate || view.setTimeout)(function () {
        throw ex;
      }, 0);
    },
        force_saveable_type = "application/octet-stream" // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
    ,
        arbitrary_revoke_timeout = 1000 * 40 // in ms
    ,
        revoke = function (file) {
      var revoker = function () {
        if (typeof file === "string") {
          // file is an object URL
          get_URL().revokeObjectURL(file);
        } else {
          // file is a File
          file.remove();
        }
      };

      setTimeout(revoker, arbitrary_revoke_timeout);
    },
        dispatch = function (filesaver, event_types, event) {
      event_types = [].concat(event_types);
      var i = event_types.length;

      while (i--) {
        var listener = filesaver["on" + event_types[i]];

        if (typeof listener === "function") {
          try {
            listener.call(filesaver, event || filesaver);
          } catch (ex) {
            throw_outside(ex);
          }
        }
      }
    },
        auto_bom = function (blob) {
      // prepend BOM for UTF-8 XML and text/* types (including HTML)
      // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
      if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
        return new Blob([String.fromCharCode(0xFEFF), blob], {
          type: blob.type
        });
      }

      return blob;
    },
        FileSaver = function (blob, name, no_auto_bom) {
      if (!no_auto_bom) {
        blob = auto_bom(blob);
      } // First try a.download, then web filesystem, then object URLs


      var filesaver = this,
          type = blob.type,
          force = type === force_saveable_type,
          object_url,
          dispatch_all = function () {
        dispatch(filesaver, "writestart progress write writeend".split(" "));
      } // on any filesys errors revert to saving with object URLs
      ,
          fs_error = function () {
        if ((is_chrome_ios || force && is_safari) && view.FileReader) {
          // Safari doesn't allow downloading of blob urls
          var reader = new FileReader();

          reader.onloadend = function () {
            var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
            var popup = view.open(url, '_blank');
            if (!popup) view.location.href = url;
            url = undefined; // release reference before dispatching

            filesaver.readyState = filesaver.DONE;
            dispatch_all();
          };

          reader.readAsDataURL(blob);
          filesaver.readyState = filesaver.INIT;
          return;
        } // don't create more object URLs than needed


        if (!object_url) {
          object_url = get_URL().createObjectURL(blob);
        }

        if (force) {
          view.location.href = object_url;
        } else {
          var opened = view.open(object_url, "_blank");

          if (!opened) {
            // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
            view.location.href = object_url;
          }
        }

        filesaver.readyState = filesaver.DONE;
        dispatch_all();
        revoke(object_url);
      };

      filesaver.readyState = filesaver.INIT;

      if (can_use_save_link) {
        object_url = get_URL().createObjectURL(blob);
        setTimeout(function () {
          save_link.href = object_url;
          save_link.download = name;
          click(save_link);
          dispatch_all();
          revoke(object_url);
          filesaver.readyState = filesaver.DONE;
        });
        return;
      }

      fs_error();
    },
        FS_proto = FileSaver.prototype,
        saveAs = function (blob, name, no_auto_bom) {
      return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
    }; // IE 10+ (native saveAs)


    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
      return function (blob, name, no_auto_bom) {
        name = name || blob.name || "download";

        if (!no_auto_bom) {
          blob = auto_bom(blob);
        }

        return navigator.msSaveOrOpenBlob(blob, name);
      };
    }

    FS_proto.abort = function () {};

    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;
    FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null;
    return saveAs;
  }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || window.content); // `self` is undefined in Firefox for Android content script context
  // while `this` is nsIContentFrameMessageManager
  // with an attribute `content` that corresponds to the window


  if (typeof module !== "undefined" && module.exports) {
    module.exports.saveAs = saveAs;
  } else if (typeof define !== "undefined" && define !== null && define.amd !== null) {
    define("FileSaver.js", function () {
      return saveAs;
    });
  }

  // (c) Dean McNamee <dean@gmail.com>, 2013.
  //
  // https://github.com/deanm/omggif
  //
  // 
  //
  // omggif is a JavaScript implementation of a GIF 89a encoder and decoder,
  // including animation and compression.  It does not rely on any specific
  // underlying system, so should run in the browser, Node, or Plask.
  function GifWriter(buf, width, height, gopts) {
    var p = 0;
    var gopts = gopts === undefined ? {} : gopts;
    var loop_count = gopts.loop === undefined ? null : gopts.loop;
    var global_palette = gopts.palette === undefined ? null : gopts.palette;
    if (width <= 0 || height <= 0 || width > 65535 || height > 65535) throw "Width/Height invalid.";

    function check_palette_and_num_colors(palette) {
      var num_colors = palette.length;
      if (num_colors < 2 || num_colors > 256 || num_colors & num_colors - 1) throw "Invalid code/color length, must be power of 2 and 2 .. 256.";
      return num_colors;
    } // - Header.


    buf[p++] = 0x47;
    buf[p++] = 0x49;
    buf[p++] = 0x46; // GIF

    buf[p++] = 0x38;
    buf[p++] = 0x39;
    buf[p++] = 0x61; // 89a
    // Handling of Global Color Table (palette) and background index.

    var gp_num_colors_pow2 = 0;
    var background = 0;

    if (global_palette !== null) {
      var gp_num_colors = check_palette_and_num_colors(global_palette);

      while (gp_num_colors >>= 1) ++gp_num_colors_pow2;

      gp_num_colors = 1 << gp_num_colors_pow2;
      --gp_num_colors_pow2;

      if (gopts.background !== undefined) {
        background = gopts.background;
        if (background >= gp_num_colors) throw "Background index out of range."; // The GIF spec states that a background index of 0 should be ignored, so
        // this is probably a mistake and you really want to set it to another
        // slot in the palette.  But actually in the end most browsers, etc end
        // up ignoring this almost completely (including for dispose background).

        if (background === 0) throw "Background index explicitly passed as 0.";
      }
    } // - Logical Screen Descriptor.
    // NOTE(deanm): w/h apparently ignored by implementations, but set anyway.


    buf[p++] = width & 0xff;
    buf[p++] = width >> 8 & 0xff;
    buf[p++] = height & 0xff;
    buf[p++] = height >> 8 & 0xff; // NOTE: Indicates 0-bpp original color resolution (unused?).

    buf[p++] = (global_palette !== null ? 0x80 : 0) | // Global Color Table Flag.
    gp_num_colors_pow2; // NOTE: No sort flag (unused?).

    buf[p++] = background; // Background Color Index.

    buf[p++] = 0; // Pixel aspect ratio (unused?).
    // - Global Color Table

    if (global_palette !== null) {
      for (var i = 0, il = global_palette.length; i < il; ++i) {
        var rgb = global_palette[i];
        buf[p++] = rgb >> 16 & 0xff;
        buf[p++] = rgb >> 8 & 0xff;
        buf[p++] = rgb & 0xff;
      }
    }

    if (loop_count !== null) {
      // Netscape block for looping.
      if (loop_count < 0 || loop_count > 65535) throw "Loop count invalid."; // Extension code, label, and length.

      buf[p++] = 0x21;
      buf[p++] = 0xff;
      buf[p++] = 0x0b; // NETSCAPE2.0

      buf[p++] = 0x4e;
      buf[p++] = 0x45;
      buf[p++] = 0x54;
      buf[p++] = 0x53;
      buf[p++] = 0x43;
      buf[p++] = 0x41;
      buf[p++] = 0x50;
      buf[p++] = 0x45;
      buf[p++] = 0x32;
      buf[p++] = 0x2e;
      buf[p++] = 0x30; // Sub-block

      buf[p++] = 0x03;
      buf[p++] = 0x01;
      buf[p++] = loop_count & 0xff;
      buf[p++] = loop_count >> 8 & 0xff;
      buf[p++] = 0x00; // Terminator.
    }

    var ended = false;

    this.addFrame = function (x, y, w, h, indexed_pixels, opts) {
      if (ended === true) {
        --p;
        ended = false;
      } // Un-end.


      opts = opts === undefined ? {} : opts; // TODO(deanm): Bounds check x, y.  Do they need to be within the virtual
      // canvas width/height, I imagine?

      if (x < 0 || y < 0 || x > 65535 || y > 65535) throw "x/y invalid.";
      if (w <= 0 || h <= 0 || w > 65535 || h > 65535) throw "Width/Height invalid.";
      if (indexed_pixels.length < w * h) throw "Not enough pixels for the frame size.";
      var using_local_palette = true;
      var palette = opts.palette;

      if (palette === undefined || palette === null) {
        using_local_palette = false;
        palette = global_palette;
      }

      if (palette === undefined || palette === null) throw "Must supply either a local or global palette.";
      var num_colors = check_palette_and_num_colors(palette); // Compute the min_code_size (power of 2), destroying num_colors.

      var min_code_size = 0;

      while (num_colors >>= 1) ++min_code_size;

      num_colors = 1 << min_code_size; // Now we can easily get it back.

      var delay = opts.delay === undefined ? 0 : opts.delay; // From the spec:
      //     0 -   No disposal specified. The decoder is
      //           not required to take any action.
      //     1 -   Do not dispose. The graphic is to be left
      //           in place.
      //     2 -   Restore to background color. The area used by the
      //           graphic must be restored to the background color.
      //     3 -   Restore to previous. The decoder is required to
      //           restore the area overwritten by the graphic with
      //           what was there prior to rendering the graphic.
      //  4-7 -    To be defined.
      // NOTE(deanm): Dispose background doesn't really work, apparently most
      // browsers ignore the background palette index and clear to transparency.

      var disposal = opts.disposal === undefined ? 0 : opts.disposal;
      if (disposal < 0 || disposal > 3) // 4-7 is reserved.
        throw "Disposal out of range.";
      var use_transparency = false;
      var transparent_index = 0;

      if (opts.transparent !== undefined && opts.transparent !== null) {
        use_transparency = true;
        transparent_index = opts.transparent;
        if (transparent_index < 0 || transparent_index >= num_colors) throw "Transparent color index.";
      }

      if (disposal !== 0 || use_transparency || delay !== 0) {
        // - Graphics Control Extension
        buf[p++] = 0x21;
        buf[p++] = 0xf9; // Extension / Label.

        buf[p++] = 4; // Byte size.

        buf[p++] = disposal << 2 | (use_transparency === true ? 1 : 0);
        buf[p++] = delay & 0xff;
        buf[p++] = delay >> 8 & 0xff;
        buf[p++] = transparent_index; // Transparent color index.

        buf[p++] = 0; // Block Terminator.
      } // - Image Descriptor


      buf[p++] = 0x2c; // Image Seperator.

      buf[p++] = x & 0xff;
      buf[p++] = x >> 8 & 0xff; // Left.

      buf[p++] = y & 0xff;
      buf[p++] = y >> 8 & 0xff; // Top.

      buf[p++] = w & 0xff;
      buf[p++] = w >> 8 & 0xff;
      buf[p++] = h & 0xff;
      buf[p++] = h >> 8 & 0xff; // NOTE: No sort flag (unused?).
      // TODO(deanm): Support interlace.

      buf[p++] = using_local_palette === true ? 0x80 | min_code_size - 1 : 0; // - Local Color Table

      if (using_local_palette === true) {
        for (var i = 0, il = palette.length; i < il; ++i) {
          var rgb = palette[i];
          buf[p++] = rgb >> 16 & 0xff;
          buf[p++] = rgb >> 8 & 0xff;
          buf[p++] = rgb & 0xff;
        }
      }

      p = GifWriterOutputLZWCodeStream(buf, p, min_code_size < 2 ? 2 : min_code_size, indexed_pixels);
    };

    this.end = function () {
      if (ended === false) {
        buf[p++] = 0x3b; // Trailer.

        ended = true;
      }

      return p;
    };
  } // Main compression routine, palette indexes -> LZW code stream.
  // |index_stream| must have at least one entry.


  function GifWriterOutputLZWCodeStream(buf, p, min_code_size, index_stream) {
    buf[p++] = min_code_size;
    var cur_subblock = p++; // Pointing at the length field.

    var clear_code = 1 << min_code_size;
    var code_mask = clear_code - 1;
    var eoi_code = clear_code + 1;
    var next_code = eoi_code + 1;
    var cur_code_size = min_code_size + 1; // Number of bits per code.

    var cur_shift = 0; // We have at most 12-bit codes, so we should have to hold a max of 19
    // bits here (and then we would write out).

    var cur = 0;

    function emit_bytes_to_buffer(bit_block_size) {
      while (cur_shift >= bit_block_size) {
        buf[p++] = cur & 0xff;
        cur >>= 8;
        cur_shift -= 8;

        if (p === cur_subblock + 256) {
          // Finished a subblock.
          buf[cur_subblock] = 255;
          cur_subblock = p++;
        }
      }
    }

    function emit_code(c) {
      cur |= c << cur_shift;
      cur_shift += cur_code_size;
      emit_bytes_to_buffer(8);
    } // I am not an expert on the topic, and I don't want to write a thesis.
    // However, it is good to outline here the basic algorithm and the few data
    // structures and optimizations here that make this implementation fast.
    // The basic idea behind LZW is to build a table of previously seen runs
    // addressed by a short id (herein called output code).  All data is
    // referenced by a code, which represents one or more values from the
    // original input stream.  All input bytes can be referenced as the same
    // value as an output code.  So if you didn't want any compression, you
    // could more or less just output the original bytes as codes (there are
    // some details to this, but it is the idea).  In order to achieve
    // compression, values greater then the input range (codes can be up to
    // 12-bit while input only 8-bit) represent a sequence of previously seen
    // inputs.  The decompressor is able to build the same mapping while
    // decoding, so there is always a shared common knowledge between the
    // encoding and decoder, which is also important for "timing" aspects like
    // how to handle variable bit width code encoding.
    //
    // One obvious but very important consequence of the table system is there
    // is always a unique id (at most 12-bits) to map the runs.  'A' might be
    // 4, then 'AA' might be 10, 'AAA' 11, 'AAAA' 12, etc.  This relationship
    // can be used for an effecient lookup strategy for the code mapping.  We
    // need to know if a run has been seen before, and be able to map that run
    // to the output code.  Since we start with known unique ids (input bytes),
    // and then from those build more unique ids (table entries), we can
    // continue this chain (almost like a linked list) to always have small
    // integer values that represent the current byte chains in the encoder.
    // This means instead of tracking the input bytes (AAAABCD) to know our
    // current state, we can track the table entry for AAAABC (it is guaranteed
    // to exist by the nature of the algorithm) and the next character D.
    // Therefor the tuple of (table_entry, byte) is guaranteed to also be
    // unique.  This allows us to create a simple lookup key for mapping input
    // sequences to codes (table indices) without having to store or search
    // any of the code sequences.  So if 'AAAA' has a table entry of 12, the
    // tuple of ('AAAA', K) for any input byte K will be unique, and can be our
    // key.  This leads to a integer value at most 20-bits, which can always
    // fit in an SMI value and be used as a fast sparse array / object key.
    // Output code for the current contents of the index buffer.


    var ib_code = index_stream[0] & code_mask; // Load first input index.

    var code_table = {}; // Key'd on our 20-bit "tuple".

    emit_code(clear_code); // Spec says first code should be a clear code.
    // First index already loaded, process the rest of the stream.

    for (var i = 1, il = index_stream.length; i < il; ++i) {
      var k = index_stream[i] & code_mask;
      var cur_key = ib_code << 8 | k; // (prev, k) unique tuple.

      var cur_code = code_table[cur_key]; // buffer + k.
      // Check if we have to create a new code table entry.

      if (cur_code === undefined) {
        // We don't have buffer + k.
        // Emit index buffer (without k).
        // This is an inline version of emit_code, because this is the core
        // writing routine of the compressor (and V8 cannot inline emit_code
        // because it is a closure here in a different context).  Additionally
        // we can call emit_byte_to_buffer less often, because we can have
        // 30-bits (from our 31-bit signed SMI), and we know our codes will only
        // be 12-bits, so can safely have 18-bits there without overflow.
        // emit_code(ib_code);
        cur |= ib_code << cur_shift;
        cur_shift += cur_code_size;

        while (cur_shift >= 8) {
          buf[p++] = cur & 0xff;
          cur >>= 8;
          cur_shift -= 8;

          if (p === cur_subblock + 256) {
            // Finished a subblock.
            buf[cur_subblock] = 255;
            cur_subblock = p++;
          }
        }

        if (next_code === 4096) {
          // Table full, need a clear.
          emit_code(clear_code);
          next_code = eoi_code + 1;
          cur_code_size = min_code_size + 1;
          code_table = {};
        } else {
          // Table not full, insert a new entry.
          // Increase our variable bit code sizes if necessary.  This is a bit
          // tricky as it is based on "timing" between the encoding and
          // decoder.  From the encoders perspective this should happen after
          // we've already emitted the index buffer and are about to create the
          // first table entry that would overflow our current code bit size.
          if (next_code >= 1 << cur_code_size) ++cur_code_size;
          code_table[cur_key] = next_code++; // Insert into code table.
        }

        ib_code = k; // Index buffer to single input k.
      } else {
        ib_code = cur_code; // Index buffer to sequence in code table.
      }
    }

    emit_code(ib_code); // There will still be something in the index buffer.

    emit_code(eoi_code); // End Of Information.
    // Flush / finalize the sub-blocks stream to the buffer.

    emit_bytes_to_buffer(1); // Finish the sub-blocks, writing out any unfinished lengths and
    // terminating with a sub-block of length 0.  If we have already started
    // but not yet used a sub-block it can just become the terminator.

    if (cur_subblock + 1 === p) {
      // Started but unused.
      buf[cur_subblock] = 0;
    } else {
      // Started and used, write length and additional terminator block.
      buf[cur_subblock] = p - cur_subblock - 1;
      buf[p++] = 0;
    }

    return p;
  }

  function GifReader(buf) {
    var p = 0; // - Header (GIF87a or GIF89a).

    if (buf[p++] !== 0x47 || buf[p++] !== 0x49 || buf[p++] !== 0x46 || buf[p++] !== 0x38 || (buf[p++] + 1 & 0xfd) !== 0x38 || buf[p++] !== 0x61) {
      throw "Invalid GIF 87a/89a header.";
    } // - Logical Screen Descriptor.


    var width = buf[p++] | buf[p++] << 8;
    var height = buf[p++] | buf[p++] << 8;
    var pf0 = buf[p++]; // <Packed Fields>.

    var global_palette_flag = pf0 >> 7;
    var num_global_colors_pow2 = pf0 & 0x7;
    var num_global_colors = 1 << num_global_colors_pow2 + 1;
    var background = buf[p++];
    buf[p++]; // Pixel aspect ratio (unused?).

    var global_palette_offset = null;

    if (global_palette_flag) {
      global_palette_offset = p;
      p += num_global_colors * 3; // Seek past palette.
    }

    var no_eof = true;
    var frames = [];
    var delay = 0;
    var transparent_index = null;
    var disposal = 0; // 0 - No disposal specified.

    var loop_count = null;
    this.width = width;
    this.height = height;

    while (no_eof && p < buf.length) {
      switch (buf[p++]) {
        case 0x21:
          // Graphics Control Extension Block
          switch (buf[p++]) {
            case 0xff:
              // Application specific block
              // Try if it's a Netscape block (with animation loop counter).
              if (buf[p] !== 0x0b || // 21 FF already read, check block size.
              // NETSCAPE2.0
              buf[p + 1] == 0x4e && buf[p + 2] == 0x45 && buf[p + 3] == 0x54 && buf[p + 4] == 0x53 && buf[p + 5] == 0x43 && buf[p + 6] == 0x41 && buf[p + 7] == 0x50 && buf[p + 8] == 0x45 && buf[p + 9] == 0x32 && buf[p + 10] == 0x2e && buf[p + 11] == 0x30 && // Sub-block
              buf[p + 12] == 0x03 && buf[p + 13] == 0x01 && buf[p + 16] == 0) {
                p += 14;
                loop_count = buf[p++] | buf[p++] << 8;
                p++; // Skip terminator.
              } else {
                // We don't know what it is, just try to get past it.
                p += 12;

                while (true) {
                  // Seek through subblocks.
                  var block_size = buf[p++];
                  if (block_size === 0) break;
                  p += block_size;
                }
              }

              break;

            case 0xf9:
              // Graphics Control Extension
              if (buf[p++] !== 0x4 || buf[p + 4] !== 0) throw "Invalid graphics extension block.";
              var pf1 = buf[p++];
              delay = buf[p++] | buf[p++] << 8;
              transparent_index = buf[p++];
              if ((pf1 & 1) === 0) transparent_index = null;
              disposal = pf1 >> 2 & 0x7;
              p++; // Skip terminator.

              break;

            case 0xfe:
              // Comment Extension.
              while (true) {
                // Seek through subblocks.
                var block_size = buf[p++];
                if (block_size === 0) break; // console.log(buf.slice(p, p+block_size).toString('ascii'));

                p += block_size;
              }

              break;

            default:
              throw "Unknown graphic control label: 0x" + buf[p - 1].toString(16);
          }

          break;

        case 0x2c:
          // Image Descriptor.
          var x = buf[p++] | buf[p++] << 8;
          var y = buf[p++] | buf[p++] << 8;
          var w = buf[p++] | buf[p++] << 8;
          var h = buf[p++] | buf[p++] << 8;
          var pf2 = buf[p++];
          var local_palette_flag = pf2 >> 7;
          var interlace_flag = pf2 >> 6 & 1;
          var num_local_colors_pow2 = pf2 & 0x7;
          var num_local_colors = 1 << num_local_colors_pow2 + 1;
          var palette_offset = global_palette_offset;
          var has_local_palette = false;

          if (local_palette_flag) {
            var has_local_palette = true;
            palette_offset = p; // Override with local palette.

            p += num_local_colors * 3; // Seek past palette.
          }

          var data_offset = p;
          p++; // codesize

          while (true) {
            var block_size = buf[p++];
            if (block_size === 0) break;
            p += block_size;
          }

          frames.push({
            x: x,
            y: y,
            width: w,
            height: h,
            has_local_palette: has_local_palette,
            palette_offset: palette_offset,
            data_offset: data_offset,
            data_length: p - data_offset,
            transparent_index: transparent_index,
            interlaced: !!interlace_flag,
            delay: delay,
            disposal: disposal
          });
          break;

        case 0x3b:
          // Trailer Marker (end of file).
          no_eof = false;
          break;

        default:
          throw "Unknown gif block: 0x" + buf[p - 1].toString(16);
          break;
      }
    }

    this.numFrames = function () {
      return frames.length;
    };

    this.loopCount = function () {
      return loop_count;
    };

    this.frameInfo = function (frame_num) {
      if (frame_num < 0 || frame_num >= frames.length) throw "Frame index out of range.";
      return frames[frame_num];
    };

    this.decodeAndBlitFrameBGRA = function (frame_num, pixels) {
      var frame = this.frameInfo(frame_num);
      var num_pixels = frame.width * frame.height;
      var index_stream = new Uint8Array(num_pixels); // At most 8-bit indices.

      GifReaderLZWOutputIndexStream(buf, frame.data_offset, index_stream, num_pixels);
      var palette_offset = frame.palette_offset; // NOTE(deanm): It seems to be much faster to compare index to 256 than
      // to === null.  Not sure why, but CompareStub_EQ_STRICT shows up high in
      // the profile, not sure if it's related to using a Uint8Array.

      var trans = frame.transparent_index;
      if (trans === null) trans = 256; // We are possibly just blitting to a portion of the entire frame.
      // That is a subrect within the framerect, so the additional pixels
      // must be skipped over after we finished a scanline.

      var framewidth = frame.width;
      var framestride = width - framewidth;
      var xleft = framewidth; // Number of subrect pixels left in scanline.
      // Output indicies of the top left and bottom right corners of the subrect.

      var opbeg = (frame.y * width + frame.x) * 4;
      var opend = ((frame.y + frame.height) * width + frame.x) * 4;
      var op = opbeg;
      var scanstride = framestride * 4; // Use scanstride to skip past the rows when interlacing.  This is skipping
      // 7 rows for the first two passes, then 3 then 1.

      if (frame.interlaced === true) {
        scanstride += (framewidth + framestride) * 4 * 7; // Pass 1.
      }

      var interlaceskip = 8; // Tracking the row interval in the current pass.

      for (var i = 0, il = index_stream.length; i < il; ++i) {
        var index = index_stream[i];

        if (xleft === 0) {
          // Beginning of new scan line
          op += scanstride;
          xleft = framewidth;

          if (op >= opend) {
            // Catch the wrap to switch passes when interlacing.
            scanstride = framestride + (framewidth + framestride) * 4 * (interlaceskip - 1); // interlaceskip / 2 * 4 is interlaceskip << 1.

            op = opbeg + (framewidth + framestride) * (interlaceskip << 1);
            interlaceskip >>= 1;
          }
        }

        if (index === trans) {
          op += 4;
        } else {
          var r = buf[palette_offset + index * 3];
          var g = buf[palette_offset + index * 3 + 1];
          var b = buf[palette_offset + index * 3 + 2];
          pixels[op++] = b;
          pixels[op++] = g;
          pixels[op++] = r;
          pixels[op++] = 255;
        }

        --xleft;
      }
    }; // I will go to copy and paste hell one day...


    this.decodeAndBlitFrameRGBA = function (frame_num, pixels) {
      var frame = this.frameInfo(frame_num);
      var num_pixels = frame.width * frame.height;
      var index_stream = new Uint8Array(num_pixels); // At most 8-bit indices.

      GifReaderLZWOutputIndexStream(buf, frame.data_offset, index_stream, num_pixels);
      var palette_offset = frame.palette_offset; // NOTE(deanm): It seems to be much faster to compare index to 256 than
      // to === null.  Not sure why, but CompareStub_EQ_STRICT shows up high in
      // the profile, not sure if it's related to using a Uint8Array.

      var trans = frame.transparent_index;
      if (trans === null) trans = 256; // We are possibly just blitting to a portion of the entire frame.
      // That is a subrect within the framerect, so the additional pixels
      // must be skipped over after we finished a scanline.

      var framewidth = frame.width;
      var framestride = width - framewidth;
      var xleft = framewidth; // Number of subrect pixels left in scanline.
      // Output indicies of the top left and bottom right corners of the subrect.

      var opbeg = (frame.y * width + frame.x) * 4;
      var opend = ((frame.y + frame.height) * width + frame.x) * 4;
      var op = opbeg;
      var scanstride = framestride * 4; // Use scanstride to skip past the rows when interlacing.  This is skipping
      // 7 rows for the first two passes, then 3 then 1.

      if (frame.interlaced === true) {
        scanstride += (framewidth + framestride) * 4 * 7; // Pass 1.
      }

      var interlaceskip = 8; // Tracking the row interval in the current pass.

      for (var i = 0, il = index_stream.length; i < il; ++i) {
        var index = index_stream[i];

        if (xleft === 0) {
          // Beginning of new scan line
          op += scanstride;
          xleft = framewidth;

          if (op >= opend) {
            // Catch the wrap to switch passes when interlacing.
            scanstride = framestride + (framewidth + framestride) * 4 * (interlaceskip - 1); // interlaceskip / 2 * 4 is interlaceskip << 1.

            op = opbeg + (framewidth + framestride) * (interlaceskip << 1);
            interlaceskip >>= 1;
          }
        }

        if (index === trans) {
          op += 4;
        } else {
          var r = buf[palette_offset + index * 3];
          var g = buf[palette_offset + index * 3 + 1];
          var b = buf[palette_offset + index * 3 + 2];
          pixels[op++] = r;
          pixels[op++] = g;
          pixels[op++] = b;
          pixels[op++] = 255;
        }

        --xleft;
      }
    };
  }

  function GifReaderLZWOutputIndexStream(code_stream, p, output, output_length) {
    var min_code_size = code_stream[p++];
    var clear_code = 1 << min_code_size;
    var eoi_code = clear_code + 1;
    var next_code = eoi_code + 1;
    var cur_code_size = min_code_size + 1; // Number of bits per code.
    // NOTE: This shares the same name as the encoder, but has a different
    // meaning here.  Here this masks each code coming from the code stream.

    var code_mask = (1 << cur_code_size) - 1;
    var cur_shift = 0;
    var cur = 0;
    var op = 0; // Output pointer.

    var subblock_size = code_stream[p++]; // TODO(deanm): Would using a TypedArray be any faster?  At least it would
    // solve the fast mode / backing store uncertainty.
    // var code_table = Array(4096);

    var code_table = new Int32Array(4096); // Can be signed, we only use 20 bits.

    var prev_code = null; // Track code-1.

    while (true) {
      // Read up to two bytes, making sure we always 12-bits for max sized code.
      while (cur_shift < 16) {
        if (subblock_size === 0) break; // No more data to be read.

        cur |= code_stream[p++] << cur_shift;
        cur_shift += 8;

        if (subblock_size === 1) {
          // Never let it get to 0 to hold logic above.
          subblock_size = code_stream[p++]; // Next subblock.
        } else {
          --subblock_size;
        }
      } // TODO(deanm): We should never really get here, we should have received
      // and EOI.


      if (cur_shift < cur_code_size) break;
      var code = cur & code_mask;
      cur >>= cur_code_size;
      cur_shift -= cur_code_size; // TODO(deanm): Maybe should check that the first code was a clear code,
      // at least this is what you're supposed to do.  But actually our encoder
      // now doesn't emit a clear code first anyway.

      if (code === clear_code) {
        // We don't actually have to clear the table.  This could be a good idea
        // for greater error checking, but we don't really do any anyway.  We
        // will just track it with next_code and overwrite old entries.
        next_code = eoi_code + 1;
        cur_code_size = min_code_size + 1;
        code_mask = (1 << cur_code_size) - 1; // Don't update prev_code ?

        prev_code = null;
        continue;
      } else if (code === eoi_code) {
        break;
      } // We have a similar situation as the decoder, where we want to store
      // variable length entries (code table entries), but we want to do in a
      // faster manner than an array of arrays.  The code below stores sort of a
      // linked list within the code table, and then "chases" through it to
      // construct the dictionary entries.  When a new entry is created, just the
      // last byte is stored, and the rest (prefix) of the entry is only
      // referenced by its table entry.  Then the code chases through the
      // prefixes until it reaches a single byte code.  We have to chase twice,
      // first to compute the length, and then to actually copy the data to the
      // output (backwards, since we know the length).  The alternative would be
      // storing something in an intermediate stack, but that doesn't make any
      // more sense.  I implemented an approach where it also stored the length
      // in the code table, although it's a bit tricky because you run out of
      // bits (12 + 12 + 8), but I didn't measure much improvements (the table
      // entries are generally not the long).  Even when I created benchmarks for
      // very long table entries the complexity did not seem worth it.
      // The code table stores the prefix entry in 12 bits and then the suffix
      // byte in 8 bits, so each entry is 20 bits.


      var chase_code = code < next_code ? code : prev_code; // Chase what we will output, either {CODE} or {CODE-1}.

      var chase_length = 0;
      var chase = chase_code;

      while (chase > clear_code) {
        chase = code_table[chase] >> 8;
        ++chase_length;
      }

      var k = chase;
      var op_end = op + chase_length + (chase_code !== code ? 1 : 0);

      if (op_end > output_length) {
        console.log("Warning, gif stream longer than expected.");
        return;
      } // Already have the first byte from the chase, might as well write it fast.


      output[op++] = k;
      op += chase_length;
      var b = op; // Track pointer, writing backwards.

      if (chase_code !== code) // The case of emitting {CODE-1} + k.
        output[op++] = k;
      chase = chase_code;

      while (chase_length--) {
        chase = code_table[chase];
        output[--b] = chase & 0xff; // Write backwards.

        chase >>= 8; // Pull down to the prefix code.
      }

      if (prev_code !== null && next_code < 4096) {
        code_table[next_code++] = prev_code << 8 | k; // TODO(deanm): Figure out this clearing vs code growth logic better.  I
        // have an feeling that it should just happen somewhere else, for now it
        // is awkward between when we grow past the max and then hit a clear code.
        // For now just check if we hit the max 12-bits (then a clear code should
        // follow, also of course encoded in 12-bits).

        if (next_code >= code_mask + 1 && cur_code_size < 12) {
          ++cur_code_size;
          code_mask = code_mask << 1 | 1;
        }
      }

      prev_code = code;
    }

    if (op !== output_length) {
      console.log("Warning, gif stream shorter than expected.");
    }

    return output;
  }

  try {
    
    
  } catch (e) {} // CommonJS.

  /*
   * Copyright (c) 2012 chick307 <chick307@gmail.com>
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
  (function (jsPDF, callback) {
    jsPDF.API.adler32cs = callback();
  })(jsPDF, function () {
    var _hasArrayBuffer = typeof ArrayBuffer === "function" && typeof Uint8Array === "function";

    var _Buffer = null,
        _isBuffer = function () {
      if (!_hasArrayBuffer) return function _isBuffer() {
        return false;
      };

      return function _isBuffer(value) {
        return value instanceof ArrayBuffer || _Buffer !== null && value instanceof _Buffer;
      };
    }();

    var _utf8ToBinary = function () {
      if (_Buffer !== null) {
        return function _utf8ToBinary(utf8String) {
          return new _Buffer(utf8String, "utf8").toString("binary");
        };
      } else {
        return function _utf8ToBinary(utf8String) {
          return unescape(encodeURIComponent(utf8String));
        };
      }
    }();

    var MOD = 65521;

    var _update = function _update(checksum, binaryString) {
      var a = checksum & 0xffff,
          b = checksum >>> 16;

      for (var i = 0, length = binaryString.length; i < length; i++) {
        a = (a + (binaryString.charCodeAt(i) & 0xff)) % MOD;
        b = (b + a) % MOD;
      }

      return (b << 16 | a) >>> 0;
    };

    var _updateUint8Array = function _updateUint8Array(checksum, uint8Array) {
      var a = checksum & 0xffff,
          b = checksum >>> 16;

      for (var i = 0, length = uint8Array.length; i < length; i++) {
        a = (a + uint8Array[i]) % MOD;
        b = (b + a) % MOD;
      }

      return (b << 16 | a) >>> 0;
    };

    var exports = {};

    var Adler32 = exports.Adler32 = function () {
      var ctor = function Adler32(checksum) {
        if (!(this instanceof ctor)) {
          throw new TypeError("Constructor cannot called be as a function.");
        }

        if (!isFinite(checksum = checksum == null ? 1 : +checksum)) {
          throw new Error("First arguments needs to be a finite number.");
        }

        this.checksum = checksum >>> 0;
      };

      var proto = ctor.prototype = {};
      proto.constructor = ctor;

      ctor.from = function (from) {
        from.prototype = proto;
        return from;
      }(function from(binaryString) {
        if (!(this instanceof ctor)) {
          throw new TypeError("Constructor cannot called be as a function.");
        }

        if (binaryString == null) throw new Error("First argument needs to be a string.");
        this.checksum = _update(1, binaryString.toString());
      });

      ctor.fromUtf8 = function (fromUtf8) {
        fromUtf8.prototype = proto;
        return fromUtf8;
      }(function fromUtf8(utf8String) {
        if (!(this instanceof ctor)) {
          throw new TypeError("Constructor cannot called be as a function.");
        }

        if (utf8String == null) throw new Error("First argument needs to be a string.");

        var binaryString = _utf8ToBinary(utf8String.toString());

        this.checksum = _update(1, binaryString);
      });

      if (_hasArrayBuffer) {
        ctor.fromBuffer = function (fromBuffer) {
          fromBuffer.prototype = proto;
          return fromBuffer;
        }(function fromBuffer(buffer) {
          if (!(this instanceof ctor)) {
            throw new TypeError("Constructor cannot called be as a function.");
          }

          if (!_isBuffer(buffer)) throw new Error("First argument needs to be ArrayBuffer.");
          var array = new Uint8Array(buffer);
          return this.checksum = _updateUint8Array(1, array);
        });
      }

      proto.update = function update(binaryString) {
        if (binaryString == null) throw new Error("First argument needs to be a string.");
        binaryString = binaryString.toString();
        return this.checksum = _update(this.checksum, binaryString);
      };

      proto.updateUtf8 = function updateUtf8(utf8String) {
        if (utf8String == null) throw new Error("First argument needs to be a string.");

        var binaryString = _utf8ToBinary(utf8String.toString());

        return this.checksum = _update(this.checksum, binaryString);
      };

      if (_hasArrayBuffer) {
        proto.updateBuffer = function updateBuffer(buffer) {
          if (!_isBuffer(buffer)) throw new Error("First argument needs to be ArrayBuffer.");
          var array = new Uint8Array(buffer);
          return this.checksum = _updateUint8Array(this.checksum, array);
        };
      }

      proto.clone = function clone() {
        return new Adler32(this.checksum);
      };

      return ctor;
    }();

    exports.from = function from(binaryString) {
      if (binaryString == null) throw new Error("First argument needs to be a string.");
      return _update(1, binaryString.toString());
    };

    exports.fromUtf8 = function fromUtf8(utf8String) {
      if (utf8String == null) throw new Error("First argument needs to be a string.");

      var binaryString = _utf8ToBinary(utf8String.toString());

      return _update(1, binaryString);
    };

    if (_hasArrayBuffer) {
      exports.fromBuffer = function fromBuffer(buffer) {
        if (!_isBuffer(buffer)) throw new Error("First argument need to be ArrayBuffer.");
        var array = new Uint8Array(buffer);
        return _updateUint8Array(1, array);
      };
    }

    return exports;
  });

  /*
    Copyright (c) 2008, Adobe Systems Incorporated
    All rights reserved.

    Redistribution and use in source and binary forms, with or without 
    modification, are permitted provided that the following conditions are
    met:

    * Redistributions of source code must retain the above copyright notice, 
      this list of conditions and the following disclaimer.
    
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the 
      documentation and/or other materials provided with the distribution.
    
    * Neither the name of Adobe Systems Incorporated nor the names of its 
      contributors may be used to endorse or promote products derived from 
      this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
    IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
    THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR 
    CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
    EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
    LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
    NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */

  /**
   * @author shaozilee
   *
   * Bmp format decoder,support 1bit 4bit 8bit 24bit bmp
   *
   */

  /*
   Copyright (c) 2013 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */

  /*
   * This program is based on JZlib 1.0.2 ymnk, JCraft,Inc.
   * JZlib is based on zlib-1.1.3, so all credit should go authors
   * Jean-loup Gailly(jloup@gzip.org) and Mark Adler(madler@alumni.caltech.edu)
   * and contributors of zlib.
   */
  (function (global) {

    var MAX_BITS = 15;
    var D_CODES = 30;
    var BL_CODES = 19;
    var LENGTH_CODES = 29;
    var LITERALS = 256;
    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    var HEAP_SIZE = 2 * L_CODES + 1;
    var END_BLOCK = 256; // Bit length codes must not exceed MAX_BL_BITS bits

    var MAX_BL_BITS = 7; // repeat previous bit length 3-6 times (2 bits of repeat count)

    var REP_3_6 = 16; // repeat a zero length 3-10 times (3 bits of repeat count)

    var REPZ_3_10 = 17; // repeat a zero length 11-138 times (7 bits of repeat count)

    var REPZ_11_138 = 18; // The lengths of the bit length codes are sent in order of decreasing
    // probability, to avoid transmitting the lengths for unused bit
    // length codes.

    var Buf_size = 8 * 2; // JZlib version : "1.0.2"

    var Z_DEFAULT_COMPRESSION = -1; // compression strategy

    var Z_FILTERED = 1;
    var Z_HUFFMAN_ONLY = 2;
    var Z_DEFAULT_STRATEGY = 0;
    var Z_NO_FLUSH = 0;
    var Z_PARTIAL_FLUSH = 1;
    var Z_FULL_FLUSH = 3;
    var Z_FINISH = 4;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_NEED_DICT = 2;
    var Z_STREAM_ERROR = -2;
    var Z_DATA_ERROR = -3;
    var Z_BUF_ERROR = -5; // Tree
    // see definition of array dist_code below

    var _dist_code = [0, 1, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 16, 17, 18, 18, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29];

    function Tree() {
      var that = this; // dyn_tree; // the dynamic tree
      // max_code; // largest code with non zero frequency
      // stat_desc; // the corresponding static tree
      // Compute the optimal bit lengths for a tree and update the total bit
      // length
      // for the current block.
      // IN assertion: the fields freq and dad are set, heap[heap_max] and
      // above are the tree nodes sorted by increasing frequency.
      // OUT assertions: the field len is set to the optimal bit length, the
      // array bl_count contains the frequencies for each bit length.
      // The length opt_len is updated; static_len is also updated if stree is
      // not null.

      function gen_bitlen(s) {
        var tree = that.dyn_tree;
        var stree = that.stat_desc.static_tree;
        var extra = that.stat_desc.extra_bits;
        var base = that.stat_desc.extra_base;
        var max_length = that.stat_desc.max_length;
        var h; // heap index

        var n, m; // iterate over the tree elements

        var bits; // bit length

        var xbits; // extra bits

        var f; // frequency

        var overflow = 0; // number of elements with bit length too large

        for (bits = 0; bits <= MAX_BITS; bits++) s.bl_count[bits] = 0; // In a first pass, compute the optimal bit lengths (which may
        // overflow in the case of the bit length tree).


        tree[s.heap[s.heap_max] * 2 + 1] = 0; // root of the heap

        for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
          n = s.heap[h];
          bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;

          if (bits > max_length) {
            bits = max_length;
            overflow++;
          }

          tree[n * 2 + 1] = bits; // We overwrite tree[n*2+1] which is no longer needed

          if (n > that.max_code) continue; // not a leaf node

          s.bl_count[bits]++;
          xbits = 0;
          if (n >= base) xbits = extra[n - base];
          f = tree[n * 2];
          s.opt_len += f * (bits + xbits);
          if (stree) s.static_len += f * (stree[n * 2 + 1] + xbits);
        }

        if (overflow === 0) return; // This happens for example on obj2 and pic of the Calgary corpus
        // Find the first bit length which could increase:

        do {
          bits = max_length - 1;

          while (s.bl_count[bits] === 0) bits--;

          s.bl_count[bits]--; // move one leaf down the tree

          s.bl_count[bits + 1] += 2; // move one overflow item as its brother

          s.bl_count[max_length]--; // The brother of the overflow item also moves one step up,
          // but this does not affect bl_count[max_length]

          overflow -= 2;
        } while (overflow > 0);

        for (bits = max_length; bits !== 0; bits--) {
          n = s.bl_count[bits];

          while (n !== 0) {
            m = s.heap[--h];
            if (m > that.max_code) continue;

            if (tree[m * 2 + 1] != bits) {
              s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
              tree[m * 2 + 1] = bits;
            }

            n--;
          }
        }
      } // Reverse the first len bits of a code, using straightforward code (a
      // faster
      // method would use a table)
      // IN assertion: 1 <= len <= 15


      function bi_reverse(code, // the value to invert
      len // its bit length
      ) {
        var res = 0;

        do {
          res |= code & 1;
          code >>>= 1;
          res <<= 1;
        } while (--len > 0);

        return res >>> 1;
      } // Generate the codes for a given tree and bit counts (which need not be
      // optimal).
      // IN assertion: the array bl_count contains the bit length statistics for
      // the given tree and the field len is set for all tree elements.
      // OUT assertion: the field code is set for all tree elements of non
      // zero code length.


      function gen_codes(tree, // the tree to decorate
      max_code, // largest code with non zero frequency
      bl_count // number of codes at each bit length
      ) {
        var next_code = []; // next code value for each
        // bit length

        var code = 0; // running code value

        var bits; // bit index

        var n; // code index

        var len; // The distribution counts are first used to generate the code values
        // without bit reversal.

        for (bits = 1; bits <= MAX_BITS; bits++) {
          next_code[bits] = code = code + bl_count[bits - 1] << 1;
        } // Check that the bit counts in bl_count are consistent. The last code
        // must be all ones.
        // Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
        // "inconsistent bit counts");
        // Tracev((stderr,"\ngen_codes: max_code %d ", max_code));


        for (n = 0; n <= max_code; n++) {
          len = tree[n * 2 + 1];
          if (len === 0) continue; // Now reverse the bits

          tree[n * 2] = bi_reverse(next_code[len]++, len);
        }
      } // Construct one Huffman tree and assigns the code bit strings and lengths.
      // Update the total bit length for the current block.
      // IN assertion: the field freq is set for all tree elements.
      // OUT assertions: the fields len and code are set to the optimal bit length
      // and corresponding code. The length opt_len is updated; static_len is
      // also updated if stree is not null. The field max_code is set.


      that.build_tree = function (s) {
        var tree = that.dyn_tree;
        var stree = that.stat_desc.static_tree;
        var elems = that.stat_desc.elems;
        var n, m; // iterate over heap elements

        var max_code = -1; // largest code with non zero frequency

        var node; // new node being created
        // Construct the initial heap, with least frequent element in
        // heap[1]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
        // heap[0] is not used.

        s.heap_len = 0;
        s.heap_max = HEAP_SIZE;

        for (n = 0; n < elems; n++) {
          if (tree[n * 2] !== 0) {
            s.heap[++s.heap_len] = max_code = n;
            s.depth[n] = 0;
          } else {
            tree[n * 2 + 1] = 0;
          }
        } // The pkzip format requires that at least one distance code exists,
        // and that at least one bit should be sent even if there is only one
        // possible code. So to avoid special checks later on we force at least
        // two codes of non zero frequency.


        while (s.heap_len < 2) {
          node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
          tree[node * 2] = 1;
          s.depth[node] = 0;
          s.opt_len--;
          if (stree) s.static_len -= stree[node * 2 + 1]; // node is 0 or 1 so it does not have extra bits
        }

        that.max_code = max_code; // The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
        // establish sub-heaps of increasing lengths:

        for (n = Math.floor(s.heap_len / 2); n >= 1; n--) s.pqdownheap(tree, n); // Construct the Huffman tree by repeatedly combining the least two
        // frequent nodes.


        node = elems; // next internal node of the tree

        do {
          // n = node of least frequency
          n = s.heap[1];
          s.heap[1] = s.heap[s.heap_len--];
          s.pqdownheap(tree, 1);
          m = s.heap[1]; // m = node of next least frequency

          s.heap[--s.heap_max] = n; // keep the nodes sorted by frequency

          s.heap[--s.heap_max] = m; // Create a new node father of n and m

          tree[node * 2] = tree[n * 2] + tree[m * 2];
          s.depth[node] = Math.max(s.depth[n], s.depth[m]) + 1;
          tree[n * 2 + 1] = tree[m * 2 + 1] = node; // and insert the new node in the heap

          s.heap[1] = node++;
          s.pqdownheap(tree, 1);
        } while (s.heap_len >= 2);

        s.heap[--s.heap_max] = s.heap[1]; // At this point, the fields freq and dad are set. We can now
        // generate the bit lengths.

        gen_bitlen(s); // The field len is now set, we can generate the bit codes

        gen_codes(tree, that.max_code, s.bl_count);
      };
    }

    Tree._length_code = [0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28];
    Tree.base_length = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0];
    Tree.base_dist = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384, 24576]; // Mapping from a distance to a distance code. dist is the distance - 1 and
    // must not have side effects. _dist_code[256] and _dist_code[257] are never
    // used.

    Tree.d_code = function (dist) {
      return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
    }; // extra bits for each length code


    Tree.extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]; // extra bits for each distance code

    Tree.extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]; // extra bits for each bit length code

    Tree.extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
    Tree.bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]; // StaticTree

    function StaticTree(static_tree, extra_bits, extra_base, elems, max_length) {
      var that = this;
      that.static_tree = static_tree;
      that.extra_bits = extra_bits;
      that.extra_base = extra_base;
      that.elems = elems;
      that.max_length = max_length;
    }

    StaticTree.static_ltree = [12, 8, 140, 8, 76, 8, 204, 8, 44, 8, 172, 8, 108, 8, 236, 8, 28, 8, 156, 8, 92, 8, 220, 8, 60, 8, 188, 8, 124, 8, 252, 8, 2, 8, 130, 8, 66, 8, 194, 8, 34, 8, 162, 8, 98, 8, 226, 8, 18, 8, 146, 8, 82, 8, 210, 8, 50, 8, 178, 8, 114, 8, 242, 8, 10, 8, 138, 8, 74, 8, 202, 8, 42, 8, 170, 8, 106, 8, 234, 8, 26, 8, 154, 8, 90, 8, 218, 8, 58, 8, 186, 8, 122, 8, 250, 8, 6, 8, 134, 8, 70, 8, 198, 8, 38, 8, 166, 8, 102, 8, 230, 8, 22, 8, 150, 8, 86, 8, 214, 8, 54, 8, 182, 8, 118, 8, 246, 8, 14, 8, 142, 8, 78, 8, 206, 8, 46, 8, 174, 8, 110, 8, 238, 8, 30, 8, 158, 8, 94, 8, 222, 8, 62, 8, 190, 8, 126, 8, 254, 8, 1, 8, 129, 8, 65, 8, 193, 8, 33, 8, 161, 8, 97, 8, 225, 8, 17, 8, 145, 8, 81, 8, 209, 8, 49, 8, 177, 8, 113, 8, 241, 8, 9, 8, 137, 8, 73, 8, 201, 8, 41, 8, 169, 8, 105, 8, 233, 8, 25, 8, 153, 8, 89, 8, 217, 8, 57, 8, 185, 8, 121, 8, 249, 8, 5, 8, 133, 8, 69, 8, 197, 8, 37, 8, 165, 8, 101, 8, 229, 8, 21, 8, 149, 8, 85, 8, 213, 8, 53, 8, 181, 8, 117, 8, 245, 8, 13, 8, 141, 8, 77, 8, 205, 8, 45, 8, 173, 8, 109, 8, 237, 8, 29, 8, 157, 8, 93, 8, 221, 8, 61, 8, 189, 8, 125, 8, 253, 8, 19, 9, 275, 9, 147, 9, 403, 9, 83, 9, 339, 9, 211, 9, 467, 9, 51, 9, 307, 9, 179, 9, 435, 9, 115, 9, 371, 9, 243, 9, 499, 9, 11, 9, 267, 9, 139, 9, 395, 9, 75, 9, 331, 9, 203, 9, 459, 9, 43, 9, 299, 9, 171, 9, 427, 9, 107, 9, 363, 9, 235, 9, 491, 9, 27, 9, 283, 9, 155, 9, 411, 9, 91, 9, 347, 9, 219, 9, 475, 9, 59, 9, 315, 9, 187, 9, 443, 9, 123, 9, 379, 9, 251, 9, 507, 9, 7, 9, 263, 9, 135, 9, 391, 9, 71, 9, 327, 9, 199, 9, 455, 9, 39, 9, 295, 9, 167, 9, 423, 9, 103, 9, 359, 9, 231, 9, 487, 9, 23, 9, 279, 9, 151, 9, 407, 9, 87, 9, 343, 9, 215, 9, 471, 9, 55, 9, 311, 9, 183, 9, 439, 9, 119, 9, 375, 9, 247, 9, 503, 9, 15, 9, 271, 9, 143, 9, 399, 9, 79, 9, 335, 9, 207, 9, 463, 9, 47, 9, 303, 9, 175, 9, 431, 9, 111, 9, 367, 9, 239, 9, 495, 9, 31, 9, 287, 9, 159, 9, 415, 9, 95, 9, 351, 9, 223, 9, 479, 9, 63, 9, 319, 9, 191, 9, 447, 9, 127, 9, 383, 9, 255, 9, 511, 9, 0, 7, 64, 7, 32, 7, 96, 7, 16, 7, 80, 7, 48, 7, 112, 7, 8, 7, 72, 7, 40, 7, 104, 7, 24, 7, 88, 7, 56, 7, 120, 7, 4, 7, 68, 7, 36, 7, 100, 7, 20, 7, 84, 7, 52, 7, 116, 7, 3, 8, 131, 8, 67, 8, 195, 8, 35, 8, 163, 8, 99, 8, 227, 8];
    StaticTree.static_dtree = [0, 5, 16, 5, 8, 5, 24, 5, 4, 5, 20, 5, 12, 5, 28, 5, 2, 5, 18, 5, 10, 5, 26, 5, 6, 5, 22, 5, 14, 5, 30, 5, 1, 5, 17, 5, 9, 5, 25, 5, 5, 5, 21, 5, 13, 5, 29, 5, 3, 5, 19, 5, 11, 5, 27, 5, 7, 5, 23, 5];
    StaticTree.static_l_desc = new StaticTree(StaticTree.static_ltree, Tree.extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
    StaticTree.static_d_desc = new StaticTree(StaticTree.static_dtree, Tree.extra_dbits, 0, D_CODES, MAX_BITS);
    StaticTree.static_bl_desc = new StaticTree(null, Tree.extra_blbits, 0, BL_CODES, MAX_BL_BITS); // Deflate

    var MAX_MEM_LEVEL = 9;
    var DEF_MEM_LEVEL = 8;

    function Config(good_length, max_lazy, nice_length, max_chain, func) {
      var that = this;
      that.good_length = good_length;
      that.max_lazy = max_lazy;
      that.nice_length = nice_length;
      that.max_chain = max_chain;
      that.func = func;
    }

    var STORED = 0;
    var FAST = 1;
    var SLOW = 2;
    var config_table = [new Config(0, 0, 0, 0, STORED), new Config(4, 4, 8, 4, FAST), new Config(4, 5, 16, 8, FAST), new Config(4, 6, 32, 32, FAST), new Config(4, 4, 16, 16, SLOW), new Config(8, 16, 32, 32, SLOW), new Config(8, 16, 128, 128, SLOW), new Config(8, 32, 128, 256, SLOW), new Config(32, 128, 258, 1024, SLOW), new Config(32, 258, 258, 4096, SLOW)];
    var z_errmsg = ["need dictionary", // Z_NEED_DICT
    // 2
    "stream end", // Z_STREAM_END 1
    "", // Z_OK 0
    "", // Z_ERRNO (-1)
    "stream error", // Z_STREAM_ERROR (-2)
    "data error", // Z_DATA_ERROR (-3)
    "", // Z_MEM_ERROR (-4)
    "buffer error", // Z_BUF_ERROR (-5)
    "", // Z_VERSION_ERROR (-6)
    ""]; // block not completed, need more input or more output

    var NeedMore = 0; // block flush performed

    var BlockDone = 1; // finish started, need only more output at next deflate

    var FinishStarted = 2; // finish done, accept no more input or output

    var FinishDone = 3; // preset dictionary flag in zlib header

    var PRESET_DICT = 0x20;
    var INIT_STATE = 42;
    var BUSY_STATE = 113;
    var FINISH_STATE = 666; // The deflate compression method

    var Z_DEFLATED = 8;
    var STORED_BLOCK = 0;
    var STATIC_TREES = 1;
    var DYN_TREES = 2;
    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;

    function smaller(tree, n, m, depth) {
      var tn2 = tree[n * 2];
      var tm2 = tree[m * 2];
      return tn2 < tm2 || tn2 == tm2 && depth[n] <= depth[m];
    }

    function Deflate() {
      var that = this;
      var strm; // pointer back to this zlib stream

      var status; // as the name implies
      // pending_buf; // output still pending

      var pending_buf_size; // size of pending_buf

      var last_flush; // value of flush param for previous deflate call

      var w_size; // LZ77 window size (32K by default)

      var w_bits; // log2(w_size) (8..16)

      var w_mask; // w_size - 1

      var window; // Sliding window. Input bytes are read into the second half of the window,
      // and move to the first half later to keep a dictionary of at least wSize
      // bytes. With this organization, matches are limited to a distance of
      // wSize-MAX_MATCH bytes, but this ensures that IO is always
      // performed with a length multiple of the block size. Also, it limits
      // the window size to 64K, which is quite useful on MSDOS.
      // To do: use the user input buffer as sliding window.

      var window_size; // Actual size of window: 2*wSize, except when the user input buffer
      // is directly used as sliding window.

      var prev; // Link to older string with same hash index. To limit the size of this
      // array to 64K, this link is maintained only for the last 32K strings.
      // An index in this array is thus a window index modulo 32K.

      var head; // Heads of the hash chains or NIL.

      var ins_h; // hash index of string to be inserted

      var hash_size; // number of elements in hash table

      var hash_bits; // log2(hash_size)

      var hash_mask; // hash_size-1
      // Number of bits by which ins_h must be shifted at each input
      // step. It must be such that after MIN_MATCH steps, the oldest
      // byte no longer takes part in the hash key, that is:
      // hash_shift * MIN_MATCH >= hash_bits

      var hash_shift; // Window position at the beginning of the current output block. Gets
      // negative when the window is moved backwards.

      var block_start;
      var match_length; // length of best match

      var prev_match; // previous match

      var match_available; // set if previous match exists

      var strstart; // start of string to insert

      var match_start; // start of matching string

      var lookahead; // number of valid bytes ahead in window
      // Length of the best match at previous step. Matches not greater than this
      // are discarded. This is used in the lazy match evaluation.

      var prev_length; // To speed up deflation, hash chains are never searched beyond this
      // length. A higher limit improves compression ratio but degrades the speed.

      var max_chain_length; // Attempt to find a better match only when the current match is strictly
      // smaller than this value. This mechanism is used only for compression
      // levels >= 4.

      var max_lazy_match; // Insert new strings in the hash table only if the match length is not
      // greater than this length. This saves time but degrades compression.
      // max_insert_length is used only for compression levels <= 3.

      var level; // compression level (1..9)

      var strategy; // favor or force Huffman coding
      // Use a faster search when the previous match is longer than this

      var good_match; // Stop searching when current match exceeds this

      var nice_match;
      var dyn_ltree; // literal and length tree

      var dyn_dtree; // distance tree

      var bl_tree; // Huffman tree for bit lengths

      var l_desc = new Tree(); // desc for literal tree

      var d_desc = new Tree(); // desc for distance tree

      var bl_desc = new Tree(); // desc for bit length tree
      // that.heap_len; // number of elements in the heap
      // that.heap_max; // element of largest frequency
      // The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
      // The same heap array is used to build all trees.
      // Depth of each subtree used as tie breaker for trees of equal frequency

      that.depth = [];
      var l_buf; // index for literals or lengths */
      // Size of match buffer for literals/lengths. There are 4 reasons for
      // limiting lit_bufsize to 64K:
      // - frequencies can be kept in 16 bit counters
      // - if compression is not successful for the first block, all input
      // data is still in the window so we can still emit a stored block even
      // when input comes from standard input. (This can also be done for
      // all blocks if lit_bufsize is not greater than 32K.)
      // - if compression is not successful for a file smaller than 64K, we can
      // even emit a stored file instead of a stored block (saving 5 bytes).
      // This is applicable only for zip (not gzip or zlib).
      // - creating new Huffman trees less frequently may not provide fast
      // adaptation to changes in the input data statistics. (Take for
      // example a binary file with poorly compressible code followed by
      // a highly compressible string table.) Smaller buffer sizes give
      // fast adaptation but have of course the overhead of transmitting
      // trees more frequently.
      // - I can't count above 4

      var lit_bufsize;
      var last_lit; // running index in l_buf
      // Buffer for distances. To simplify the code, d_buf and l_buf have
      // the same number of elements. To use different lengths, an extra flag
      // array would be necessary.

      var d_buf; // index of pendig_buf
      // that.opt_len; // bit length of current block with optimal trees
      // that.static_len; // bit length of current block with static trees

      var matches; // number of string matches in current block

      var last_eob_len; // bit length of EOB code for last block
      // Output buffer. bits are inserted starting at the bottom (least
      // significant bits).

      var bi_buf; // Number of valid bits in bi_buf. All bits above the last valid bit
      // are always zero.

      var bi_valid; // number of codes at each bit length for an optimal tree

      that.bl_count = []; // heap used to build the Huffman trees

      that.heap = [];
      dyn_ltree = [];
      dyn_dtree = [];
      bl_tree = [];

      function lm_init() {
        var i;
        window_size = 2 * w_size;
        head[hash_size - 1] = 0;

        for (i = 0; i < hash_size - 1; i++) {
          head[i] = 0;
        } // Set the default configuration parameters:


        max_lazy_match = config_table[level].max_lazy;
        good_match = config_table[level].good_length;
        nice_match = config_table[level].nice_length;
        max_chain_length = config_table[level].max_chain;
        strstart = 0;
        block_start = 0;
        lookahead = 0;
        match_length = prev_length = MIN_MATCH - 1;
        match_available = 0;
        ins_h = 0;
      }

      function init_block() {
        var i; // Initialize the trees.

        for (i = 0; i < L_CODES; i++) dyn_ltree[i * 2] = 0;

        for (i = 0; i < D_CODES; i++) dyn_dtree[i * 2] = 0;

        for (i = 0; i < BL_CODES; i++) bl_tree[i * 2] = 0;

        dyn_ltree[END_BLOCK * 2] = 1;
        that.opt_len = that.static_len = 0;
        last_lit = matches = 0;
      } // Initialize the tree data structures for a new zlib stream.


      function tr_init() {
        l_desc.dyn_tree = dyn_ltree;
        l_desc.stat_desc = StaticTree.static_l_desc;
        d_desc.dyn_tree = dyn_dtree;
        d_desc.stat_desc = StaticTree.static_d_desc;
        bl_desc.dyn_tree = bl_tree;
        bl_desc.stat_desc = StaticTree.static_bl_desc;
        bi_buf = 0;
        bi_valid = 0;
        last_eob_len = 8; // enough lookahead for inflate
        // Initialize the first block of the first file:

        init_block();
      } // Restore the heap property by moving down the tree starting at node k,
      // exchanging a node with the smallest of its two sons if necessary,
      // stopping
      // when the heap property is re-established (each father smaller than its
      // two sons).


      that.pqdownheap = function (tree, // the tree to restore
      k // node to move down
      ) {
        var heap = that.heap;
        var v = heap[k];
        var j = k << 1; // left son of k

        while (j <= that.heap_len) {
          // Set j to the smallest of the two sons:
          if (j < that.heap_len && smaller(tree, heap[j + 1], heap[j], that.depth)) {
            j++;
          } // Exit if v is smaller than both sons


          if (smaller(tree, v, heap[j], that.depth)) break; // Exchange v with the smallest son

          heap[k] = heap[j];
          k = j; // And continue down the tree, setting j to the left son of k

          j <<= 1;
        }

        heap[k] = v;
      }; // Scan a literal or distance tree to determine the frequencies of the codes
      // in the bit length tree.


      function scan_tree(tree, // the tree to be scanned
      max_code // and its largest code of non zero frequency
      ) {
        var n; // iterates over all tree elements

        var prevlen = -1; // last emitted length

        var curlen; // length of current code

        var nextlen = tree[0 * 2 + 1]; // length of next code

        var count = 0; // repeat count of the current code

        var max_count = 7; // max repeat count

        var min_count = 4; // min repeat count

        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        }

        tree[(max_code + 1) * 2 + 1] = 0xffff; // guard

        for (n = 0; n <= max_code; n++) {
          curlen = nextlen;
          nextlen = tree[(n + 1) * 2 + 1];

          if (++count < max_count && curlen == nextlen) {
            continue;
          } else if (count < min_count) {
            bl_tree[curlen * 2] += count;
          } else if (curlen !== 0) {
            if (curlen != prevlen) bl_tree[curlen * 2]++;
            bl_tree[REP_3_6 * 2]++;
          } else if (count <= 10) {
            bl_tree[REPZ_3_10 * 2]++;
          } else {
            bl_tree[REPZ_11_138 * 2]++;
          }

          count = 0;
          prevlen = curlen;

          if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
          } else if (curlen == nextlen) {
            max_count = 6;
            min_count = 3;
          } else {
            max_count = 7;
            min_count = 4;
          }
        }
      } // Construct the Huffman tree for the bit lengths and return the index in
      // bl_order of the last bit length code to send.


      function build_bl_tree() {
        var max_blindex; // index of last bit length code of non zero freq
        // Determine the bit length frequencies for literal and distance trees

        scan_tree(dyn_ltree, l_desc.max_code);
        scan_tree(dyn_dtree, d_desc.max_code); // Build the bit length tree:

        bl_desc.build_tree(that); // opt_len now includes the length of the tree representations, except
        // the lengths of the bit lengths codes and the 5+5+4 bits for the
        // counts.
        // Determine the number of bit length codes to send. The pkzip format
        // requires that at least 4 bit length codes be sent. (appnote.txt says
        // 3 but the actual value used is 4.)

        for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
          if (bl_tree[Tree.bl_order[max_blindex] * 2 + 1] !== 0) break;
        } // Update opt_len to include the bit length tree and counts


        that.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
        return max_blindex;
      } // Output a byte on the stream.
      // IN assertion: there is enough room in pending_buf.


      function put_byte(p) {
        that.pending_buf[that.pending++] = p;
      }

      function put_short(w) {
        put_byte(w & 0xff);
        put_byte(w >>> 8 & 0xff);
      }

      function putShortMSB(b) {
        put_byte(b >> 8 & 0xff);
        put_byte(b & 0xff & 0xff);
      }

      function send_bits(value, length) {
        var val,
            len = length;

        if (bi_valid > Buf_size - len) {
          val = value; // bi_buf |= (val << bi_valid);

          bi_buf |= val << bi_valid & 0xffff;
          put_short(bi_buf);
          bi_buf = val >>> Buf_size - bi_valid;
          bi_valid += len - Buf_size;
        } else {
          // bi_buf |= (value) << bi_valid;
          bi_buf |= value << bi_valid & 0xffff;
          bi_valid += len;
        }
      }

      function send_code(c, tree) {
        var c2 = c * 2;
        send_bits(tree[c2] & 0xffff, tree[c2 + 1] & 0xffff);
      } // Send a literal or distance tree in compressed form, using the codes in
      // bl_tree.


      function send_tree(tree, // the tree to be sent
      max_code // and its largest code of non zero frequency
      ) {
        var n; // iterates over all tree elements

        var prevlen = -1; // last emitted length

        var curlen; // length of current code

        var nextlen = tree[0 * 2 + 1]; // length of next code

        var count = 0; // repeat count of the current code

        var max_count = 7; // max repeat count

        var min_count = 4; // min repeat count

        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        }

        for (n = 0; n <= max_code; n++) {
          curlen = nextlen;
          nextlen = tree[(n + 1) * 2 + 1];

          if (++count < max_count && curlen == nextlen) {
            continue;
          } else if (count < min_count) {
            do {
              send_code(curlen, bl_tree);
            } while (--count !== 0);
          } else if (curlen !== 0) {
            if (curlen != prevlen) {
              send_code(curlen, bl_tree);
              count--;
            }

            send_code(REP_3_6, bl_tree);
            send_bits(count - 3, 2);
          } else if (count <= 10) {
            send_code(REPZ_3_10, bl_tree);
            send_bits(count - 3, 3);
          } else {
            send_code(REPZ_11_138, bl_tree);
            send_bits(count - 11, 7);
          }

          count = 0;
          prevlen = curlen;

          if (nextlen === 0) {
            max_count = 138;
            min_count = 3;
          } else if (curlen == nextlen) {
            max_count = 6;
            min_count = 3;
          } else {
            max_count = 7;
            min_count = 4;
          }
        }
      } // Send the header for a block using dynamic Huffman trees: the counts, the
      // lengths of the bit length codes, the literal tree and the distance tree.
      // IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.


      function send_all_trees(lcodes, dcodes, blcodes) {
        var rank; // index in bl_order

        send_bits(lcodes - 257, 5); // not +255 as stated in appnote.txt

        send_bits(dcodes - 1, 5);
        send_bits(blcodes - 4, 4); // not -3 as stated in appnote.txt

        for (rank = 0; rank < blcodes; rank++) {
          send_bits(bl_tree[Tree.bl_order[rank] * 2 + 1], 3);
        }

        send_tree(dyn_ltree, lcodes - 1); // literal tree

        send_tree(dyn_dtree, dcodes - 1); // distance tree
      } // Flush the bit buffer, keeping at most 7 bits in it.


      function bi_flush() {
        if (bi_valid == 16) {
          put_short(bi_buf);
          bi_buf = 0;
          bi_valid = 0;
        } else if (bi_valid >= 8) {
          put_byte(bi_buf & 0xff);
          bi_buf >>>= 8;
          bi_valid -= 8;
        }
      } // Send one empty static block to give enough lookahead for inflate.
      // This takes 10 bits, of which 7 may remain in the bit buffer.
      // The current inflate code requires 9 bits of lookahead. If the
      // last two codes for the previous block (real code plus EOB) were coded
      // on 5 bits or less, inflate may have only 5+3 bits of lookahead to decode
      // the last real code. In this case we send two empty static blocks instead
      // of one. (There are no problems if the previous block is stored or fixed.)
      // To simplify the code, we assume the worst case of last real code encoded
      // on one bit only.


      function _tr_align() {
        send_bits(STATIC_TREES << 1, 3);
        send_code(END_BLOCK, StaticTree.static_ltree);
        bi_flush(); // Of the 10 bits for the empty block, we have already sent
        // (10 - bi_valid) bits. The lookahead for the last real code (before
        // the EOB of the previous block) was thus at least one plus the length
        // of the EOB plus what we have just sent of the empty static block.

        if (1 + last_eob_len + 10 - bi_valid < 9) {
          send_bits(STATIC_TREES << 1, 3);
          send_code(END_BLOCK, StaticTree.static_ltree);
          bi_flush();
        }

        last_eob_len = 7;
      } // Save the match info and tally the frequency counts. Return true if
      // the current block must be flushed.


      function _tr_tally(dist, // distance of matched string
      lc // match length-MIN_MATCH or unmatched char (if dist==0)
      ) {
        var out_length, in_length, dcode;
        that.pending_buf[d_buf + last_lit * 2] = dist >>> 8 & 0xff;
        that.pending_buf[d_buf + last_lit * 2 + 1] = dist & 0xff;
        that.pending_buf[l_buf + last_lit] = lc & 0xff;
        last_lit++;

        if (dist === 0) {
          // lc is the unmatched char
          dyn_ltree[lc * 2]++;
        } else {
          matches++; // Here, lc is the match length - MIN_MATCH

          dist--; // dist = match distance - 1

          dyn_ltree[(Tree._length_code[lc] + LITERALS + 1) * 2]++;
          dyn_dtree[Tree.d_code(dist) * 2]++;
        }

        if ((last_lit & 0x1fff) === 0 && level > 2) {
          // Compute an upper bound for the compressed length
          out_length = last_lit * 8;
          in_length = strstart - block_start;

          for (dcode = 0; dcode < D_CODES; dcode++) {
            out_length += dyn_dtree[dcode * 2] * (5 + Tree.extra_dbits[dcode]);
          }

          out_length >>>= 3;
          if (matches < Math.floor(last_lit / 2) && out_length < Math.floor(in_length / 2)) return true;
        }

        return last_lit == lit_bufsize - 1; // We avoid equality with lit_bufsize because of wraparound at 64K
        // on 16 bit machines and because stored blocks are restricted to
        // 64K-1 bytes.
      } // Send the block data compressed using the given Huffman trees


      function compress_block(ltree, dtree) {
        var dist; // distance of matched string

        var lc; // match length or unmatched char (if dist === 0)

        var lx = 0; // running index in l_buf

        var code; // the code to send

        var extra; // number of extra bits to send

        if (last_lit !== 0) {
          do {
            dist = that.pending_buf[d_buf + lx * 2] << 8 & 0xff00 | that.pending_buf[d_buf + lx * 2 + 1] & 0xff;
            lc = that.pending_buf[l_buf + lx] & 0xff;
            lx++;

            if (dist === 0) {
              send_code(lc, ltree); // send a literal byte
            } else {
              // Here, lc is the match length - MIN_MATCH
              code = Tree._length_code[lc];
              send_code(code + LITERALS + 1, ltree); // send the length
              // code

              extra = Tree.extra_lbits[code];

              if (extra !== 0) {
                lc -= Tree.base_length[code];
                send_bits(lc, extra); // send the extra length bits
              }

              dist--; // dist is now the match distance - 1

              code = Tree.d_code(dist);
              send_code(code, dtree); // send the distance code

              extra = Tree.extra_dbits[code];

              if (extra !== 0) {
                dist -= Tree.base_dist[code];
                send_bits(dist, extra); // send the extra distance bits
              }
            } // literal or match pair ?
            // Check that the overlay between pending_buf and d_buf+l_buf is
            // ok:

          } while (lx < last_lit);
        }

        send_code(END_BLOCK, ltree);
        last_eob_len = ltree[END_BLOCK * 2 + 1];
      } // Flush the bit buffer and align the output on a byte boundary


      function bi_windup() {
        if (bi_valid > 8) {
          put_short(bi_buf);
        } else if (bi_valid > 0) {
          put_byte(bi_buf & 0xff);
        }

        bi_buf = 0;
        bi_valid = 0;
      } // Copy a stored block, storing first the length and its
      // one's complement if requested.


      function copy_block(buf, // the input data
      len, // its length
      header // true if block header must be written
      ) {
        bi_windup(); // align on byte boundary

        last_eob_len = 8; // enough lookahead for inflate

        if (header) {
          put_short(len);
          put_short(~len);
        }

        that.pending_buf.set(window.subarray(buf, buf + len), that.pending);
        that.pending += len;
      } // Send a stored block


      function _tr_stored_block(buf, // input block
      stored_len, // length of input block
      eof // true if this is the last block for a file
      ) {
        send_bits((STORED_BLOCK << 1) + (eof ? 1 : 0), 3); // send block type

        copy_block(buf, stored_len, true); // with header
      } // Determine the best encoding for the current block: dynamic trees, static
      // trees or store, and output the encoded block to the zip file.


      function _tr_flush_block(buf, // input block, or NULL if too old
      stored_len, // length of input block
      eof // true if this is the last block for a file
      ) {
        var opt_lenb, static_lenb; // opt_len and static_len in bytes

        var max_blindex = 0; // index of last bit length code of non zero freq
        // Build the Huffman trees unless a stored block is forced

        if (level > 0) {
          // Construct the literal and distance trees
          l_desc.build_tree(that);
          d_desc.build_tree(that); // At this point, opt_len and static_len are the total bit lengths
          // of
          // the compressed block data, excluding the tree representations.
          // Build the bit length tree for the above two trees, and get the
          // index
          // in bl_order of the last bit length code to send.

          max_blindex = build_bl_tree(); // Determine the best encoding. Compute first the block length in
          // bytes

          opt_lenb = that.opt_len + 3 + 7 >>> 3;
          static_lenb = that.static_len + 3 + 7 >>> 3;
          if (static_lenb <= opt_lenb) opt_lenb = static_lenb;
        } else {
          opt_lenb = static_lenb = stored_len + 5; // force a stored block
        }

        if (stored_len + 4 <= opt_lenb && buf != -1) {
          // 4: two words for the lengths
          // The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
          // Otherwise we can't have processed more than WSIZE input bytes
          // since
          // the last block flush, because compression would have been
          // successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
          // transform a block into a stored block.
          _tr_stored_block(buf, stored_len, eof);
        } else if (static_lenb == opt_lenb) {
          send_bits((STATIC_TREES << 1) + (eof ? 1 : 0), 3);
          compress_block(StaticTree.static_ltree, StaticTree.static_dtree);
        } else {
          send_bits((DYN_TREES << 1) + (eof ? 1 : 0), 3);
          send_all_trees(l_desc.max_code + 1, d_desc.max_code + 1, max_blindex + 1);
          compress_block(dyn_ltree, dyn_dtree);
        } // The above check is made mod 2^32, for files larger than 512 MB
        // and uLong implemented on 32 bits.


        init_block();

        if (eof) {
          bi_windup();
        }
      }

      function flush_block_only(eof) {
        _tr_flush_block(block_start >= 0 ? block_start : -1, strstart - block_start, eof);

        block_start = strstart;
        strm.flush_pending();
      } // Fill the window when the lookahead becomes insufficient.
      // Updates strstart and lookahead.
      //
      // IN assertion: lookahead < MIN_LOOKAHEAD
      // OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
      // At least one byte has been read, or avail_in === 0; reads are
      // performed for at least two bytes (required for the zip translate_eol
      // option -- not supported here).


      function fill_window() {
        var n, m;
        var p;
        var more; // Amount of free space at the end of the window.

        do {
          more = window_size - lookahead - strstart; // Deal with !@#$% 64K limit:

          if (more === 0 && strstart === 0 && lookahead === 0) {
            more = w_size;
          } else if (more == -1) {
            // Very unlikely, but possible on 16 bit machine if strstart ==
            // 0
            // and lookahead == 1 (input done one byte at time)
            more--; // If the window is almost full and there is insufficient
            // lookahead,
            // move the upper half to the lower one to make room in the
            // upper half.
          } else if (strstart >= w_size + w_size - MIN_LOOKAHEAD) {
            window.set(window.subarray(w_size, w_size + w_size), 0);
            match_start -= w_size;
            strstart -= w_size; // we now have strstart >= MAX_DIST

            block_start -= w_size; // Slide the hash table (could be avoided with 32 bit values
            // at the expense of memory usage). We slide even when level ==
            // 0
            // to keep the hash table consistent if we switch back to level
            // > 0
            // later. (Using level 0 permanently is not an optimal usage of
            // zlib, so we don't care about this pathological case.)

            n = hash_size;
            p = n;

            do {
              m = head[--p] & 0xffff;
              head[p] = m >= w_size ? m - w_size : 0;
            } while (--n !== 0);

            n = w_size;
            p = n;

            do {
              m = prev[--p] & 0xffff;
              prev[p] = m >= w_size ? m - w_size : 0; // If n is not on any hash chain, prev[n] is garbage but
              // its value will never be used.
            } while (--n !== 0);

            more += w_size;
          }

          if (strm.avail_in === 0) return; // If there was no sliding:
          // strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
          // more == window_size - lookahead - strstart
          // => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
          // => more >= window_size - 2*WSIZE + 2
          // In the BIG_MEM or MMAP case (not yet supported),
          // window_size == input_size + MIN_LOOKAHEAD &&
          // strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
          // Otherwise, window_size == 2*WSIZE so more >= 2.
          // If there was sliding, more >= WSIZE. So in all cases, more >= 2.

          n = strm.read_buf(window, strstart + lookahead, more);
          lookahead += n; // Initialize the hash value now that we have some input:

          if (lookahead >= MIN_MATCH) {
            ins_h = window[strstart] & 0xff;
            ins_h = (ins_h << hash_shift ^ window[strstart + 1] & 0xff) & hash_mask;
          } // If the whole input has less than MIN_MATCH bytes, ins_h is
          // garbage,
          // but this is not important since only literal bytes will be
          // emitted.

        } while (lookahead < MIN_LOOKAHEAD && strm.avail_in !== 0);
      } // Copy without compression as much as possible from the input stream,
      // return
      // the current block state.
      // This function does not insert new strings in the dictionary since
      // uncompressible data is probably not useful. This function is used
      // only for the level=0 compression option.
      // NOTE: this function should be optimized to avoid extra copying from
      // window to pending_buf.


      function deflate_stored(flush) {
        // Stored blocks are limited to 0xffff bytes, pending_buf is limited
        // to pending_buf_size, and each stored block has a 5 byte header:
        var max_block_size = 0xffff;
        var max_start;

        if (max_block_size > pending_buf_size - 5) {
          max_block_size = pending_buf_size - 5;
        } // Copy as much as possible from input to output:


        while (true) {
          // Fill the window as much as possible:
          if (lookahead <= 1) {
            fill_window();
            if (lookahead === 0 && flush == Z_NO_FLUSH) return NeedMore;
            if (lookahead === 0) break; // flush the current block
          }

          strstart += lookahead;
          lookahead = 0; // Emit a stored block if pending_buf will be full:

          max_start = block_start + max_block_size;

          if (strstart === 0 || strstart >= max_start) {
            // strstart === 0 is possible when wraparound on 16-bit machine
            lookahead = strstart - max_start;
            strstart = max_start;
            flush_block_only(false);
            if (strm.avail_out === 0) return NeedMore;
          } // Flush if we may have to slide, otherwise block_start may become
          // negative and the data will be gone:


          if (strstart - block_start >= w_size - MIN_LOOKAHEAD) {
            flush_block_only(false);
            if (strm.avail_out === 0) return NeedMore;
          }
        }

        flush_block_only(flush == Z_FINISH);
        if (strm.avail_out === 0) return flush == Z_FINISH ? FinishStarted : NeedMore;
        return flush == Z_FINISH ? FinishDone : BlockDone;
      }

      function longest_match(cur_match) {
        var chain_length = max_chain_length; // max hash chain length

        var scan = strstart; // current string

        var match; // matched string

        var len; // length of current match

        var best_len = prev_length; // best match length so far

        var limit = strstart > w_size - MIN_LOOKAHEAD ? strstart - (w_size - MIN_LOOKAHEAD) : 0;
        var _nice_match = nice_match; // Stop when cur_match becomes <= limit. To simplify the code,
        // we prevent matches with the string of window index 0.

        var wmask = w_mask;
        var strend = strstart + MAX_MATCH;
        var scan_end1 = window[scan + best_len - 1];
        var scan_end = window[scan + best_len]; // The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of
        // 16.
        // It is easy to get rid of this optimization if necessary.
        // Do not waste too much time if we already have a good match:

        if (prev_length >= good_match) {
          chain_length >>= 2;
        } // Do not look for matches beyond the end of the input. This is
        // necessary
        // to make deflate deterministic.


        if (_nice_match > lookahead) _nice_match = lookahead;

        do {
          match = cur_match; // Skip to next match if the match length cannot increase
          // or if the match length is less than 2:

          if (window[match + best_len] != scan_end || window[match + best_len - 1] != scan_end1 || window[match] != window[scan] || window[++match] != window[scan + 1]) continue; // The check at best_len-1 can be removed because it will be made
          // again later. (This heuristic is not always a win.)
          // It is not necessary to compare scan[2] and match[2] since they
          // are always equal when the other bytes match, given that
          // the hash keys are equal and that HASH_BITS >= 8.

          scan += 2;
          match++; // We check for insufficient lookahead only every 8th comparison;
          // the 256th check will be made at strstart+258.

          do {} while (window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && scan < strend);

          len = MAX_MATCH - (strend - scan);
          scan = strend - MAX_MATCH;

          if (len > best_len) {
            match_start = cur_match;
            best_len = len;
            if (len >= _nice_match) break;
            scan_end1 = window[scan + best_len - 1];
            scan_end = window[scan + best_len];
          }
        } while ((cur_match = prev[cur_match & wmask] & 0xffff) > limit && --chain_length !== 0);

        if (best_len <= lookahead) return best_len;
        return lookahead;
      } // Compress as much as possible from the input stream, return the current
      // block state.
      // This function does not perform lazy evaluation of matches and inserts
      // new strings in the dictionary only for unmatched strings or for short
      // matches. It is used only for the fast compression options.


      function deflate_fast(flush) {
        // short hash_head = 0; // head of the hash chain
        var hash_head = 0; // head of the hash chain

        var bflush; // set if current block must be flushed

        while (true) {
          // Make sure that we always have enough lookahead, except
          // at the end of the input file. We need MAX_MATCH bytes
          // for the next match, plus MIN_MATCH bytes to insert the
          // string following the next match.
          if (lookahead < MIN_LOOKAHEAD) {
            fill_window();

            if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
              return NeedMore;
            }

            if (lookahead === 0) break; // flush the current block
          } // Insert the string window[strstart .. strstart+2] in the
          // dictionary, and set hash_head to the head of the hash chain:


          if (lookahead >= MIN_MATCH) {
            ins_h = (ins_h << hash_shift ^ window[strstart + (MIN_MATCH - 1)] & 0xff) & hash_mask; // prev[strstart&w_mask]=hash_head=head[ins_h];

            hash_head = head[ins_h] & 0xffff;
            prev[strstart & w_mask] = head[ins_h];
            head[ins_h] = strstart;
          } // Find the longest match, discarding those <= prev_length.
          // At this point we have always match_length < MIN_MATCH


          if (hash_head !== 0 && (strstart - hash_head & 0xffff) <= w_size - MIN_LOOKAHEAD) {
            // To simplify the code, we prevent matches with the string
            // of window index 0 (in particular we have to avoid a match
            // of the string with itself at the start of the input file).
            if (strategy != Z_HUFFMAN_ONLY) {
              match_length = longest_match(hash_head);
            } // longest_match() sets match_start

          }

          if (match_length >= MIN_MATCH) {
            // check_match(strstart, match_start, match_length);
            bflush = _tr_tally(strstart - match_start, match_length - MIN_MATCH);
            lookahead -= match_length; // Insert new strings in the hash table only if the match length
            // is not too large. This saves time but degrades compression.

            if (match_length <= max_lazy_match && lookahead >= MIN_MATCH) {
              match_length--; // string at strstart already in hash table

              do {
                strstart++;
                ins_h = (ins_h << hash_shift ^ window[strstart + (MIN_MATCH - 1)] & 0xff) & hash_mask; // prev[strstart&w_mask]=hash_head=head[ins_h];

                hash_head = head[ins_h] & 0xffff;
                prev[strstart & w_mask] = head[ins_h];
                head[ins_h] = strstart; // strstart never exceeds WSIZE-MAX_MATCH, so there are
                // always MIN_MATCH bytes ahead.
              } while (--match_length !== 0);

              strstart++;
            } else {
              strstart += match_length;
              match_length = 0;
              ins_h = window[strstart] & 0xff;
              ins_h = (ins_h << hash_shift ^ window[strstart + 1] & 0xff) & hash_mask; // If lookahead < MIN_MATCH, ins_h is garbage, but it does
              // not
              // matter since it will be recomputed at next deflate call.
            }
          } else {
            // No match, output a literal byte
            bflush = _tr_tally(0, window[strstart] & 0xff);
            lookahead--;
            strstart++;
          }

          if (bflush) {
            flush_block_only(false);
            if (strm.avail_out === 0) return NeedMore;
          }
        }

        flush_block_only(flush == Z_FINISH);

        if (strm.avail_out === 0) {
          if (flush == Z_FINISH) return FinishStarted;else return NeedMore;
        }

        return flush == Z_FINISH ? FinishDone : BlockDone;
      } // Same as above, but achieves better compression. We use a lazy
      // evaluation for matches: a match is finally adopted only if there is
      // no better match at the next window position.


      function deflate_slow(flush) {
        // short hash_head = 0; // head of hash chain
        var hash_head = 0; // head of hash chain

        var bflush; // set if current block must be flushed

        var max_insert; // Process the input block.

        while (true) {
          // Make sure that we always have enough lookahead, except
          // at the end of the input file. We need MAX_MATCH bytes
          // for the next match, plus MIN_MATCH bytes to insert the
          // string following the next match.
          if (lookahead < MIN_LOOKAHEAD) {
            fill_window();

            if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
              return NeedMore;
            }

            if (lookahead === 0) break; // flush the current block
          } // Insert the string window[strstart .. strstart+2] in the
          // dictionary, and set hash_head to the head of the hash chain:


          if (lookahead >= MIN_MATCH) {
            ins_h = (ins_h << hash_shift ^ window[strstart + (MIN_MATCH - 1)] & 0xff) & hash_mask; // prev[strstart&w_mask]=hash_head=head[ins_h];

            hash_head = head[ins_h] & 0xffff;
            prev[strstart & w_mask] = head[ins_h];
            head[ins_h] = strstart;
          } // Find the longest match, discarding those <= prev_length.


          prev_length = match_length;
          prev_match = match_start;
          match_length = MIN_MATCH - 1;

          if (hash_head !== 0 && prev_length < max_lazy_match && (strstart - hash_head & 0xffff) <= w_size - MIN_LOOKAHEAD) {
            // To simplify the code, we prevent matches with the string
            // of window index 0 (in particular we have to avoid a match
            // of the string with itself at the start of the input file).
            if (strategy != Z_HUFFMAN_ONLY) {
              match_length = longest_match(hash_head);
            } // longest_match() sets match_start


            if (match_length <= 5 && (strategy == Z_FILTERED || match_length == MIN_MATCH && strstart - match_start > 4096)) {
              // If prev_match is also MIN_MATCH, match_start is garbage
              // but we will ignore the current match anyway.
              match_length = MIN_MATCH - 1;
            }
          } // If there was a match at the previous step and the current
          // match is not better, output the previous match:


          if (prev_length >= MIN_MATCH && match_length <= prev_length) {
            max_insert = strstart + lookahead - MIN_MATCH; // Do not insert strings in hash table beyond this.
            // check_match(strstart-1, prev_match, prev_length);

            bflush = _tr_tally(strstart - 1 - prev_match, prev_length - MIN_MATCH); // Insert in hash table all strings up to the end of the match.
            // strstart-1 and strstart are already inserted. If there is not
            // enough lookahead, the last two strings are not inserted in
            // the hash table.

            lookahead -= prev_length - 1;
            prev_length -= 2;

            do {
              if (++strstart <= max_insert) {
                ins_h = (ins_h << hash_shift ^ window[strstart + (MIN_MATCH - 1)] & 0xff) & hash_mask; // prev[strstart&w_mask]=hash_head=head[ins_h];

                hash_head = head[ins_h] & 0xffff;
                prev[strstart & w_mask] = head[ins_h];
                head[ins_h] = strstart;
              }
            } while (--prev_length !== 0);

            match_available = 0;
            match_length = MIN_MATCH - 1;
            strstart++;

            if (bflush) {
              flush_block_only(false);
              if (strm.avail_out === 0) return NeedMore;
            }
          } else if (match_available !== 0) {
            // If there was no match at the previous position, output a
            // single literal. If there was a match but the current match
            // is longer, truncate the previous match to a single literal.
            bflush = _tr_tally(0, window[strstart - 1] & 0xff);

            if (bflush) {
              flush_block_only(false);
            }

            strstart++;
            lookahead--;
            if (strm.avail_out === 0) return NeedMore;
          } else {
            // There is no previous match to compare with, wait for
            // the next step to decide.
            match_available = 1;
            strstart++;
            lookahead--;
          }
        }

        if (match_available !== 0) {
          bflush = _tr_tally(0, window[strstart - 1] & 0xff);
          match_available = 0;
        }

        flush_block_only(flush == Z_FINISH);

        if (strm.avail_out === 0) {
          if (flush == Z_FINISH) return FinishStarted;else return NeedMore;
        }

        return flush == Z_FINISH ? FinishDone : BlockDone;
      }

      function deflateReset(strm) {
        strm.total_in = strm.total_out = 0;
        strm.msg = null; //

        that.pending = 0;
        that.pending_out = 0;
        status = BUSY_STATE;
        last_flush = Z_NO_FLUSH;
        tr_init();
        lm_init();
        return Z_OK;
      }

      that.deflateInit = function (strm, _level, bits, _method, memLevel, _strategy) {
        if (!_method) _method = Z_DEFLATED;
        if (!memLevel) memLevel = DEF_MEM_LEVEL;
        if (!_strategy) _strategy = Z_DEFAULT_STRATEGY; // byte[] my_version=ZLIB_VERSION;
        //
        // if (!version || version[0] != my_version[0]
        // || stream_size != sizeof(z_stream)) {
        // return Z_VERSION_ERROR;
        // }

        strm.msg = null;
        if (_level == Z_DEFAULT_COMPRESSION) _level = 6;

        if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || _method != Z_DEFLATED || bits < 9 || bits > 15 || _level < 0 || _level > 9 || _strategy < 0 || _strategy > Z_HUFFMAN_ONLY) {
          return Z_STREAM_ERROR;
        }

        strm.dstate = that;
        w_bits = bits;
        w_size = 1 << w_bits;
        w_mask = w_size - 1;
        hash_bits = memLevel + 7;
        hash_size = 1 << hash_bits;
        hash_mask = hash_size - 1;
        hash_shift = Math.floor((hash_bits + MIN_MATCH - 1) / MIN_MATCH);
        window = new Uint8Array(w_size * 2);
        prev = [];
        head = [];
        lit_bufsize = 1 << memLevel + 6; // 16K elements by default
        // We overlay pending_buf and d_buf+l_buf. This works since the average
        // output size for (length,distance) codes is <= 24 bits.

        that.pending_buf = new Uint8Array(lit_bufsize * 4);
        pending_buf_size = lit_bufsize * 4;
        d_buf = Math.floor(lit_bufsize / 2);
        l_buf = (1 + 2) * lit_bufsize;
        level = _level;
        strategy = _strategy;
        return deflateReset(strm);
      };

      that.deflateEnd = function () {
        if (status != INIT_STATE && status != BUSY_STATE && status != FINISH_STATE) {
          return Z_STREAM_ERROR;
        } // Deallocate in reverse order of allocations:


        that.pending_buf = null;
        head = null;
        prev = null;
        window = null; // free

        that.dstate = null;
        return status == BUSY_STATE ? Z_DATA_ERROR : Z_OK;
      };

      that.deflateParams = function (strm, _level, _strategy) {
        var err = Z_OK;

        if (_level == Z_DEFAULT_COMPRESSION) {
          _level = 6;
        }

        if (_level < 0 || _level > 9 || _strategy < 0 || _strategy > Z_HUFFMAN_ONLY) {
          return Z_STREAM_ERROR;
        }

        if (config_table[level].func != config_table[_level].func && strm.total_in !== 0) {
          // Flush the last buffer:
          err = strm.deflate(Z_PARTIAL_FLUSH);
        }

        if (level != _level) {
          level = _level;
          max_lazy_match = config_table[level].max_lazy;
          good_match = config_table[level].good_length;
          nice_match = config_table[level].nice_length;
          max_chain_length = config_table[level].max_chain;
        }

        strategy = _strategy;
        return err;
      };

      that.deflateSetDictionary = function (strm, dictionary, dictLength) {
        var length = dictLength;
        var n,
            index = 0;
        if (!dictionary || status != INIT_STATE) return Z_STREAM_ERROR;
        if (length < MIN_MATCH) return Z_OK;

        if (length > w_size - MIN_LOOKAHEAD) {
          length = w_size - MIN_LOOKAHEAD;
          index = dictLength - length; // use the tail of the dictionary
        }

        window.set(dictionary.subarray(index, index + length), 0);
        strstart = length;
        block_start = length; // Insert all strings in the hash table (except for the last two bytes).
        // s->lookahead stays null, so s->ins_h will be recomputed at the next
        // call of fill_window.

        ins_h = window[0] & 0xff;
        ins_h = (ins_h << hash_shift ^ window[1] & 0xff) & hash_mask;

        for (n = 0; n <= length - MIN_MATCH; n++) {
          ins_h = (ins_h << hash_shift ^ window[n + (MIN_MATCH - 1)] & 0xff) & hash_mask;
          prev[n & w_mask] = head[ins_h];
          head[ins_h] = n;
        }

        return Z_OK;
      };

      that.deflate = function (_strm, flush) {
        var i, header, level_flags, old_flush, bstate;

        if (flush > Z_FINISH || flush < 0) {
          return Z_STREAM_ERROR;
        }

        if (!_strm.next_out || !_strm.next_in && _strm.avail_in !== 0 || status == FINISH_STATE && flush != Z_FINISH) {
          _strm.msg = z_errmsg[Z_NEED_DICT - Z_STREAM_ERROR];
          return Z_STREAM_ERROR;
        }

        if (_strm.avail_out === 0) {
          _strm.msg = z_errmsg[Z_NEED_DICT - Z_BUF_ERROR];
          return Z_BUF_ERROR;
        }

        strm = _strm; // just in case

        old_flush = last_flush;
        last_flush = flush; // Write the zlib header

        if (status == INIT_STATE) {
          header = Z_DEFLATED + (w_bits - 8 << 4) << 8;
          level_flags = (level - 1 & 0xff) >> 1;
          if (level_flags > 3) level_flags = 3;
          header |= level_flags << 6;
          if (strstart !== 0) header |= PRESET_DICT;
          header += 31 - header % 31;
          status = BUSY_STATE;
          putShortMSB(header);
        } // Flush as much pending output as possible


        if (that.pending !== 0) {
          strm.flush_pending();

          if (strm.avail_out === 0) {
            // console.log(" avail_out==0");
            // Since avail_out is 0, deflate will be called again with
            // more output space, but possibly with both pending and
            // avail_in equal to zero. There won't be anything to do,
            // but this is not an error situation so make sure we
            // return OK instead of BUF_ERROR at next call of deflate:
            last_flush = -1;
            return Z_OK;
          } // Make sure there is something to do and avoid duplicate
          // consecutive
          // flushes. For repeated and useless calls with Z_FINISH, we keep
          // returning Z_STREAM_END instead of Z_BUFF_ERROR.

        } else if (strm.avail_in === 0 && flush <= old_flush && flush != Z_FINISH) {
          strm.msg = z_errmsg[Z_NEED_DICT - Z_BUF_ERROR];
          return Z_BUF_ERROR;
        } // User must not provide more input after the first FINISH:


        if (status == FINISH_STATE && strm.avail_in !== 0) {
          _strm.msg = z_errmsg[Z_NEED_DICT - Z_BUF_ERROR];
          return Z_BUF_ERROR;
        } // Start a new block or continue the current one.


        if (strm.avail_in !== 0 || lookahead !== 0 || flush != Z_NO_FLUSH && status != FINISH_STATE) {
          bstate = -1;

          switch (config_table[level].func) {
            case STORED:
              bstate = deflate_stored(flush);
              break;

            case FAST:
              bstate = deflate_fast(flush);
              break;

            case SLOW:
              bstate = deflate_slow(flush);
              break;

            default:
          }

          if (bstate == FinishStarted || bstate == FinishDone) {
            status = FINISH_STATE;
          }

          if (bstate == NeedMore || bstate == FinishStarted) {
            if (strm.avail_out === 0) {
              last_flush = -1; // avoid BUF_ERROR next call, see above
            }

            return Z_OK; // If flush != Z_NO_FLUSH && avail_out === 0, the next call
            // of deflate should use the same flush parameter to make sure
            // that the flush is complete. So we don't have to output an
            // empty block here, this will be done at next call. This also
            // ensures that for a very small output buffer, we emit at most
            // one empty block.
          }

          if (bstate == BlockDone) {
            if (flush == Z_PARTIAL_FLUSH) {
              _tr_align();
            } else {
              // FULL_FLUSH or SYNC_FLUSH
              _tr_stored_block(0, 0, false); // For a full flush, this empty block will be recognized
              // as a special marker by inflate_sync().


              if (flush == Z_FULL_FLUSH) {
                // state.head[s.hash_size-1]=0;
                for (i = 0; i < hash_size
                /*-1*/
                ; i++) // forget history
                head[i] = 0;
              }
            }

            strm.flush_pending();

            if (strm.avail_out === 0) {
              last_flush = -1; // avoid BUF_ERROR at next call, see above

              return Z_OK;
            }
          }
        }

        if (flush != Z_FINISH) return Z_OK;
        return Z_STREAM_END;
      };
    } // ZStream


    function ZStream() {
      var that = this;
      that.next_in_index = 0;
      that.next_out_index = 0; // that.next_in; // next input byte

      that.avail_in = 0; // number of bytes available at next_in

      that.total_in = 0; // total nb of input bytes read so far
      // that.next_out; // next output byte should be put there

      that.avail_out = 0; // remaining free space at next_out

      that.total_out = 0; // total nb of bytes output so far
      // that.msg;
      // that.dstate;
    }

    ZStream.prototype = {
      deflateInit: function (level, bits) {
        var that = this;
        that.dstate = new Deflate();
        if (!bits) bits = MAX_BITS;
        return that.dstate.deflateInit(that, level, bits);
      },
      deflate: function (flush) {
        var that = this;

        if (!that.dstate) {
          return Z_STREAM_ERROR;
        }

        return that.dstate.deflate(that, flush);
      },
      deflateEnd: function () {
        var that = this;
        if (!that.dstate) return Z_STREAM_ERROR;
        var ret = that.dstate.deflateEnd();
        that.dstate = null;
        return ret;
      },
      deflateParams: function (level, strategy) {
        var that = this;
        if (!that.dstate) return Z_STREAM_ERROR;
        return that.dstate.deflateParams(that, level, strategy);
      },
      deflateSetDictionary: function (dictionary, dictLength) {
        var that = this;
        if (!that.dstate) return Z_STREAM_ERROR;
        return that.dstate.deflateSetDictionary(that, dictionary, dictLength);
      },
      // Read a new buffer from the current input stream, update the
      // total number of bytes read. All deflate() input goes through
      // this function so some applications may wish to modify it to avoid
      // allocating a large strm->next_in buffer and copying from it.
      // (See also flush_pending()).
      read_buf: function (buf, start, size) {
        var that = this;
        var len = that.avail_in;
        if (len > size) len = size;
        if (len === 0) return 0;
        that.avail_in -= len;
        buf.set(that.next_in.subarray(that.next_in_index, that.next_in_index + len), start);
        that.next_in_index += len;
        that.total_in += len;
        return len;
      },
      // Flush as much pending output as possible. All deflate() output goes
      // through this function so some applications may wish to modify it
      // to avoid allocating a large strm->next_out buffer and copying into it.
      // (See also read_buf()).
      flush_pending: function () {
        var that = this;
        var len = that.dstate.pending;
        if (len > that.avail_out) len = that.avail_out;
        if (len === 0) return; // if (that.dstate.pending_buf.length <= that.dstate.pending_out || that.next_out.length <= that.next_out_index
        // || that.dstate.pending_buf.length < (that.dstate.pending_out + len) || that.next_out.length < (that.next_out_index +
        // len)) {
        // console.log(that.dstate.pending_buf.length + ", " + that.dstate.pending_out + ", " + that.next_out.length + ", " +
        // that.next_out_index + ", " + len);
        // console.log("avail_out=" + that.avail_out);
        // }

        that.next_out.set(that.dstate.pending_buf.subarray(that.dstate.pending_out, that.dstate.pending_out + len), that.next_out_index);
        that.next_out_index += len;
        that.dstate.pending_out += len;
        that.total_out += len;
        that.avail_out -= len;
        that.dstate.pending -= len;

        if (that.dstate.pending === 0) {
          that.dstate.pending_out = 0;
        }
      }
    }; // Deflater

    function Deflater(options) {
      var that = this;
      var z = new ZStream();
      var bufsize = 512;
      var flush = Z_NO_FLUSH;
      var buf = new Uint8Array(bufsize);
      var level = options ? options.level : Z_DEFAULT_COMPRESSION;
      if (typeof level == "undefined") level = Z_DEFAULT_COMPRESSION;
      z.deflateInit(level);
      z.next_out = buf;

      that.append = function (data, onprogress) {
        var err,
            buffers = [],
            lastIndex = 0,
            bufferIndex = 0,
            bufferSize = 0,
            array;
        if (!data.length) return;
        z.next_in_index = 0;
        z.next_in = data;
        z.avail_in = data.length;

        do {
          z.next_out_index = 0;
          z.avail_out = bufsize;
          err = z.deflate(flush);
          if (err != Z_OK) throw new Error("deflating: " + z.msg);
          if (z.next_out_index) if (z.next_out_index == bufsize) buffers.push(new Uint8Array(buf));else buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
          bufferSize += z.next_out_index;

          if (onprogress && z.next_in_index > 0 && z.next_in_index != lastIndex) {
            onprogress(z.next_in_index);
            lastIndex = z.next_in_index;
          }
        } while (z.avail_in > 0 || z.avail_out === 0);

        array = new Uint8Array(bufferSize);
        buffers.forEach(function (chunk) {
          array.set(chunk, bufferIndex);
          bufferIndex += chunk.length;
        });
        return array;
      };

      that.flush = function () {
        var err,
            buffers = [],
            bufferIndex = 0,
            bufferSize = 0,
            array;

        do {
          z.next_out_index = 0;
          z.avail_out = bufsize;
          err = z.deflate(Z_FINISH);
          if (err != Z_STREAM_END && err != Z_OK) throw new Error("deflating: " + z.msg);
          if (bufsize - z.avail_out > 0) buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
          bufferSize += z.next_out_index;
        } while (z.avail_in > 0 || z.avail_out === 0);

        z.deflateEnd();
        array = new Uint8Array(bufferSize);
        buffers.forEach(function (chunk) {
          array.set(chunk, bufferIndex);
          bufferIndex += chunk.length;
        });
        return array;
      };
    } // 'zip' may not be defined in z-worker and some tests


    var env = global.zip || global;
    env.Deflater = env._jzlib_Deflater = Deflater;
  })(typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || Function('return typeof this === "object" && this.content')() || Function("return this")()); // `self` is undefined in Firefox for Android content script context
  // while `this` is nsIContentFrameMessageManager
  // with an attribute `content` that corresponds to the window

  /**
   * A class to parse color values
   * @author Stoyan Stefanov <sstoo@gmail.com>
   * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
   * @license Use it if you like it
   */
  (function (global) {

    function RGBColor(color_string) {
      this.ok = false; // strip any leading #

      if (color_string.charAt(0) == "#") {
        // remove # if any
        color_string = color_string.substr(1, 6);
      }

      color_string = color_string.replace(/ /g, "");
      color_string = color_string.toLowerCase();
      var channels; // before getting into regexps, try simple matches
      // and overwrite the input

      var simple_colors = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "00ffff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000000",
        blanchedalmond: "ffebcd",
        blue: "0000ff",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "00ffff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dodgerblue: "1e90ff",
        feldspar: "d19275",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "ff00ff",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgrey: "d3d3d3",
        lightgreen: "90ee90",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslateblue: "8470ff",
        lightslategray: "778899",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "00ff00",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "ff00ff",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370d8",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "d87093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        red: "ff0000",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        violetred: "d02090",
        wheat: "f5deb3",
        white: "ffffff",
        whitesmoke: "f5f5f5",
        yellow: "ffff00",
        yellowgreen: "9acd32"
      };

      for (var key in simple_colors) {
        if (color_string == key) {
          color_string = simple_colors[key];
        }
      } // emd of simple type-in colors
      // array of color definition objects


      var color_defs = [{
        re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
        example: ["rgb(123, 234, 45)", "rgb(255,234,245)"],
        process: function (bits) {
          return [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3])];
        }
      }, {
        re: /^(\w{2})(\w{2})(\w{2})$/,
        example: ["#00ff00", "336699"],
        process: function (bits) {
          return [parseInt(bits[1], 16), parseInt(bits[2], 16), parseInt(bits[3], 16)];
        }
      }, {
        re: /^(\w{1})(\w{1})(\w{1})$/,
        example: ["#fb0", "f0f"],
        process: function (bits) {
          return [parseInt(bits[1] + bits[1], 16), parseInt(bits[2] + bits[2], 16), parseInt(bits[3] + bits[3], 16)];
        }
      }]; // search through the definitions to find a match

      for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);

        if (bits) {
          channels = processor(bits);
          this.r = channels[0];
          this.g = channels[1];
          this.b = channels[2];
          this.ok = true;
        }
      } // validate/cleanup values


      this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r;
      this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g;
      this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b; // some getters

      this.toRGB = function () {
        return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
      };

      this.toHex = function () {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) r = "0" + r;
        if (g.length == 1) g = "0" + g;
        if (b.length == 1) b = "0" + b;
        return "#" + r + g + b;
      }; // help


      this.getHelpXML = function () {
        var examples = new Array(); // add regexps

        for (var i = 0; i < color_defs.length; i++) {
          var example = color_defs[i].example;

          for (var j = 0; j < example.length; j++) {
            examples[examples.length] = example[j];
          }
        } // add type-in colors


        for (var sc in simple_colors) {
          examples[examples.length] = sc;
        }

        var xml = document.createElement("ul");
        xml.setAttribute("id", "rgbcolor-examples");

        for (var i = 0; i < examples.length; i++) {
          try {
            var list_item = document.createElement("li");
            var list_color = new RGBColor(examples[i]);
            var example_div = document.createElement("div");
            example_div.style.cssText = "margin: 3px; " + "border: 1px solid black; " + "background:" + list_color.toHex() + "; " + "color:" + list_color.toHex();
            example_div.appendChild(document.createTextNode("test"));
            var list_item_value = document.createTextNode(" " + examples[i] + " -> " + list_color.toRGB() + " -> " + list_color.toHex());
            list_item.appendChild(example_div);
            list_item.appendChild(list_item_value);
            xml.appendChild(list_item);
          } catch (e) {}
        }

        return xml;
      };
    }

    global.RGBColor = RGBColor;
  })(typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || Function('return typeof this === "object" && this.content')() || Function("return this")()); // `self` is undefined in Firefox for Android content script context
  // while `this` is nsIContentFrameMessageManager
  // with an attribute `content` that corresponds to the window

  /************************************************
   * Title : custom font                          *
   * Start Data : 2017. 01. 22.                   *
   * Comment : TEXT API                           *
   ************************************************/

  /******************************
   * jsPDF extension API Design *
   * ****************************/
  (function (jsPDF) {

    var PLUS = "+".charCodeAt(0);
    var SLASH = "/".charCodeAt(0);
    var NUMBER = "0".charCodeAt(0);
    var LOWER = "a".charCodeAt(0);
    var UPPER = "A".charCodeAt(0);
    var PLUS_URL_SAFE = "-".charCodeAt(0);
    var SLASH_URL_SAFE = "_".charCodeAt(0);
    /*****************************************************************/

    /* function : b64ToByteArray                                     */

    /* comment : Base64 encoded TTF file contents (b64) are decoded  */

    /*     by Byte array and stored.                                 */

    /*****************************************************************/

    var b64ToByteArray = function (b64) {
      var i, j, l, tmp, placeHolders, arr;

      if (b64.length % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      } // the number of equal signs (place holders)
      // if there are two placeholders, than the two characters before it
      // represent one byte
      // if there is only one, then the three characters before it represent 2 bytes
      // this is just a cheap hack to not do indexOf twice


      var len = b64.length;
      placeHolders = "=" === b64.charAt(len - 2) ? 2 : "=" === b64.charAt(len - 1) ? 1 : 0; // base64 is 4/3 + up to two characters of the original data

      arr = new Uint8Array(b64.length * 3 / 4 - placeHolders); // if there are placeholders, only get up to the last complete 4 chars

      l = placeHolders > 0 ? b64.length - 4 : b64.length;
      var L = 0;

      function push(v) {
        arr[L++] = v;
      }

      for (i = 0, j = 0; i < l; i += 4, j += 3) {
        tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
        push((tmp & 0xff0000) >> 16);
        push((tmp & 0xff00) >> 8);
        push(tmp & 0xff);
      }

      if (placeHolders === 2) {
        tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
        push(tmp & 0xff);
      } else if (placeHolders === 1) {
        tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
        push(tmp >> 8 & 0xff);
        push(tmp & 0xff);
      }

      return arr;
    };
    /***************************************************************/

    /* function : decode                                           */

    /* comment : Change the base64 encoded font's content to match */

    /*   the base64 index value.                                   */

    /***************************************************************/


    var decode = function (elt) {
      var code = elt.charCodeAt(0);
      if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'

      if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'

      if (code < NUMBER) return -1; //no match

      if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
      if (code < UPPER + 26) return code - UPPER;
      if (code < LOWER + 26) return code - LOWER + 26;
    };

    jsPDF.API.TTFFont = function () {
      /************************************************************************/

      /* function : open                                                       */

      /* comment : Decode the encoded ttf content and create a TTFFont object. */

      /************************************************************************/
      TTFFont.open = function (filename, name, vfs, encoding) {
        var contents;

        if (typeof vfs !== "string") {
          throw new Error("Invalid argument supplied in TTFFont.open");
        }

        contents = b64ToByteArray(vfs);
        return new TTFFont(contents, name, encoding);
      };
      /***************************************************************/

      /* function : TTFFont gernerator                               */

      /* comment : Decode TTF contents are parsed, Data,             */

      /* Subset object is created, and registerTTF function is called.*/

      /***************************************************************/


      function TTFFont(rawData, name, encoding) {
        var data;

        this.rawData = rawData;
        data = this.contents = new Data(rawData);
        this.contents.pos = 4;

        if (data.readString(4) === "ttcf") {
          if (!name) {
            throw new Error("Must specify a font name for TTC files.");
          }
          throw new Error("Font " + name + " not found in TTC file.");
        } else {
          data.pos = 0;
          this.parse();
          this.subset = new Subset(this);
          this.registerTTF();
        }
      }
      /********************************************************/

      /* function : parse                                     */

      /* comment : TTF Parses the file contents by each table.*/

      /********************************************************/


      TTFFont.prototype.parse = function () {
        this.directory = new Directory(this.contents);
        this.head = new HeadTable(this);
        this.name = new NameTable(this);
        this.cmap = new CmapTable(this);
        this.toUnicode = new Map();
        this.hhea = new HheaTable(this);
        this.maxp = new MaxpTable(this);
        this.hmtx = new HmtxTable(this);
        this.post = new PostTable(this);
        this.os2 = new OS2Table(this);
        this.loca = new LocaTable(this);
        this.glyf = new GlyfTable(this);
        this.ascender = this.os2.exists && this.os2.ascender || this.hhea.ascender;
        this.decender = this.os2.exists && this.os2.decender || this.hhea.decender;
        this.lineGap = this.os2.exists && this.os2.lineGap || this.hhea.lineGap;
        return this.bbox = [this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax];
      };
      /***************************************************************/

      /* function : registerTTF                                      */

      /* comment : Get the value to assign pdf font descriptors.     */

      /***************************************************************/


      TTFFont.prototype.registerTTF = function () {
        var e, hi, low, raw, _ref;

        this.scaleFactor = 1000.0 / this.head.unitsPerEm;

        this.bbox = function () {
          var _i, _len, _ref, _results;

          _ref = this.bbox;
          _results = [];

          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            e = _ref[_i];

            _results.push(Math.round(e * this.scaleFactor));
          }

          return _results;
        }.call(this);

        this.stemV = 0;

        if (this.post.exists) {
          raw = this.post.italic_angle;
          hi = raw >> 16;
          low = raw & 0xff;

          if (hi & 0x8000 !== 0) {
            hi = -((hi ^ 0xffff) + 1);
          }

          this.italicAngle = +("" + hi + "." + low);
        } else {
          this.italicAngle = 0;
        }

        this.ascender = Math.round(this.ascender * this.scaleFactor);
        this.decender = Math.round(this.decender * this.scaleFactor);
        this.lineGap = Math.round(this.lineGap * this.scaleFactor);
        this.capHeight = this.os2.exists && this.os2.capHeight || this.ascender;
        this.xHeight = this.os2.exists && this.os2.xHeight || 0;
        this.familyClass = (this.os2.exists && this.os2.familyClass || 0) >> 8;
        this.isSerif = (_ref = this.familyClass) === 1 || _ref === 2 || _ref === 3 || _ref === 4 || _ref === 5 || _ref === 7;
        this.isScript = this.familyClass === 10;
        this.flags = 0;

        if (this.post.isFixedPitch) {
          this.flags |= 1 << 0;
        }

        if (this.isSerif) {
          this.flags |= 1 << 1;
        }

        if (this.isScript) {
          this.flags |= 1 << 3;
        }

        if (this.italicAngle !== 0) {
          this.flags |= 1 << 6;
        }

        this.flags |= 1 << 5;

        if (!this.cmap.unicode) {
          throw new Error("No unicode cmap for font");
        }
      };

      TTFFont.prototype.characterToGlyph = function (character) {
        var _ref;

        return ((_ref = this.cmap.unicode) != null ? _ref.codeMap[character] : void 0) || 0;
      };

      TTFFont.prototype.widthOfGlyph = function (glyph) {
        var scale;
        scale = 1000.0 / this.head.unitsPerEm;
        return this.hmtx.forGlyph(glyph).advance * scale;
      };

      TTFFont.prototype.widthOfString = function (string, size, charSpace) {
        var charCode, i, scale, width, _i, _ref, charSpace;

        string = "" + string;
        width = 0;

        for (i = _i = 0, _ref = string.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          charCode = string.charCodeAt(i);
          width += this.widthOfGlyph(this.characterToGlyph(charCode)) + charSpace * (1000 / size) || 0;
        }

        scale = size / 1000;
        return width * scale;
      };

      TTFFont.prototype.lineHeight = function (size, includeGap) {
        var gap;

        if (includeGap == null) {
          includeGap = false;
        }

        gap = includeGap ? this.lineGap : 0;
        return (this.ascender + gap - this.decender) / 1000 * size;
      };

      return TTFFont;
    }();
    /************************************************************************************************/

    /* function : Data                                                                              */

    /* comment : The ttf data decoded and stored in an array is read and written to the Data object.*/

    /************************************************************************************************/


    var Data = function () {
      function Data(data) {
        this.data = data != null ? data : [];
        this.pos = 0;
        this.length = this.data.length;
      }

      Data.prototype.readByte = function () {
        return this.data[this.pos++];
      };

      Data.prototype.writeByte = function (byte) {
        return this.data[this.pos++] = byte;
      };

      Data.prototype.readUInt32 = function () {
        var b1, b2, b3, b4;
        b1 = this.readByte() * 0x1000000;
        b2 = this.readByte() << 16;
        b3 = this.readByte() << 8;
        b4 = this.readByte();
        return b1 + b2 + b3 + b4;
      };

      Data.prototype.writeUInt32 = function (val) {
        this.writeByte(val >>> 24 & 0xff);
        this.writeByte(val >> 16 & 0xff);
        this.writeByte(val >> 8 & 0xff);
        return this.writeByte(val & 0xff);
      };

      Data.prototype.readInt32 = function () {
        var int;
        int = this.readUInt32();

        if (int >= 0x80000000) {
          return int - 0x100000000;
        } else {
          return int;
        }
      };

      Data.prototype.writeInt32 = function (val) {
        if (val < 0) {
          val += 0x100000000;
        }

        return this.writeUInt32(val);
      };

      Data.prototype.readUInt16 = function () {
        var b1, b2;
        b1 = this.readByte() << 8;
        b2 = this.readByte();
        return b1 | b2;
      };

      Data.prototype.writeUInt16 = function (val) {
        this.writeByte(val >> 8 & 0xff);
        return this.writeByte(val & 0xff);
      };

      Data.prototype.readInt16 = function () {
        var int;
        int = this.readUInt16();

        if (int >= 0x8000) {
          return int - 0x10000;
        } else {
          return int;
        }
      };

      Data.prototype.writeInt16 = function (val) {
        if (val < 0) {
          val += 0x10000;
        }

        return this.writeUInt16(val);
      };

      Data.prototype.readString = function (length) {
        var i, ret, _i;

        ret = [];

        for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
          ret[i] = String.fromCharCode(this.readByte());
        }

        return ret.join("");
      };

      Data.prototype.writeString = function (val) {
        var i, _i, _ref, _results;

        _results = [];

        for (i = _i = 0, _ref = val.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(this.writeByte(val.charCodeAt(i)));
        }

        return _results;
      };
      /*Data.prototype.stringAt = function (pos, length) {
              this.pos = pos;
              return this.readString(length);
          };*/


      Data.prototype.readShort = function () {
        return this.readInt16();
      };

      Data.prototype.writeShort = function (val) {
        return this.writeInt16(val);
      };

      Data.prototype.readLongLong = function () {
        var b1, b2, b3, b4, b5, b6, b7, b8;
        b1 = this.readByte();
        b2 = this.readByte();
        b3 = this.readByte();
        b4 = this.readByte();
        b5 = this.readByte();
        b6 = this.readByte();
        b7 = this.readByte();
        b8 = this.readByte();

        if (b1 & 0x80) {
          return ((b1 ^ 0xff) * 0x100000000000000 + (b2 ^ 0xff) * 0x1000000000000 + (b3 ^ 0xff) * 0x10000000000 + (b4 ^ 0xff) * 0x100000000 + (b5 ^ 0xff) * 0x1000000 + (b6 ^ 0xff) * 0x10000 + (b7 ^ 0xff) * 0x100 + (b8 ^ 0xff) + 1) * -1;
        }

        return b1 * 0x100000000000000 + b2 * 0x1000000000000 + b3 * 0x10000000000 + b4 * 0x100000000 + b5 * 0x1000000 + b6 * 0x10000 + b7 * 0x100 + b8;
      };

      Data.prototype.writeLongLong = function (val) {
        var high, low;
        high = Math.floor(val / 0x100000000);
        low = val & 0xffffffff;
        this.writeByte(high >> 24 & 0xff);
        this.writeByte(high >> 16 & 0xff);
        this.writeByte(high >> 8 & 0xff);
        this.writeByte(high & 0xff);
        this.writeByte(low >> 24 & 0xff);
        this.writeByte(low >> 16 & 0xff);
        this.writeByte(low >> 8 & 0xff);
        return this.writeByte(low & 0xff);
      };

      Data.prototype.readInt = function () {
        return this.readInt32();
      };

      Data.prototype.writeInt = function (val) {
        return this.writeInt32(val);
      };
      /*Data.prototype.slice = function (start, end) {
              return this.data.slice(start, end);
          };*/


      Data.prototype.read = function (bytes) {
        var buf, i, _i;

        buf = [];

        for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
          buf.push(this.readByte());
        }

        return buf;
      };

      Data.prototype.write = function (bytes) {
        var byte, _i, _len, _results;

        _results = [];

        for (_i = 0, _len = bytes.length; _i < _len; _i++) {
          byte = bytes[_i];

          _results.push(this.writeByte(byte));
        }

        return _results;
      };

      return Data;
    }();

    var Directory = function () {
      var checksum;
      /*****************************************************************************************************/

      /* function : Directory generator                                                                    */

      /* comment : Initialize the offset, tag, length, and checksum for each table for the font to be used.*/

      /*****************************************************************************************************/

      function Directory(data) {
        var entry, i, _i, _ref;

        this.scalarType = data.readInt();
        this.tableCount = data.readShort();
        this.searchRange = data.readShort();
        this.entrySelector = data.readShort();
        this.rangeShift = data.readShort();
        this.tables = {};

        for (i = _i = 0, _ref = this.tableCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          entry = {
            tag: data.readString(4),
            checksum: data.readInt(),
            offset: data.readInt(),
            length: data.readInt()
          };
          this.tables[entry.tag] = entry;
        }
      }
      /********************************************************************************************************/

      /* function : encode                                                                                    */

      /* comment : It encodes and stores the font table object and information used for the directory object. */

      /********************************************************************************************************/


      Directory.prototype.encode = function (tables) {
        var adjustment, directory, directoryLength, entrySelector, headOffset, log2, offset, rangeShift, searchRange, sum, table, tableCount, tableData, tag;
        tableCount = Object.keys(tables).length;
        log2 = Math.log(2);
        searchRange = Math.floor(Math.log(tableCount) / log2) * 16;
        entrySelector = Math.floor(searchRange / log2);
        rangeShift = tableCount * 16 - searchRange;
        directory = new Data();
        directory.writeInt(this.scalarType);
        directory.writeShort(tableCount);
        directory.writeShort(searchRange);
        directory.writeShort(entrySelector);
        directory.writeShort(rangeShift);
        directoryLength = tableCount * 16;
        offset = directory.pos + directoryLength;
        headOffset = null;
        tableData = [];

        for (tag in tables) {
          table = tables[tag];
          directory.writeString(tag);
          directory.writeInt(checksum(table));
          directory.writeInt(offset);
          directory.writeInt(table.length);
          tableData = tableData.concat(table);

          if (tag === "head") {
            headOffset = offset;
          }

          offset += table.length;

          while (offset % 4) {
            tableData.push(0);
            offset++;
          }
        }

        directory.write(tableData);
        sum = checksum(directory.data);
        adjustment = 0xb1b0afba - sum;
        directory.pos = headOffset + 8;
        directory.writeUInt32(adjustment);
        return directory.data;
      };
      /***************************************************************/

      /* function : checksum                                         */

      /* comment : Duplicate the table for the tag.                  */

      /***************************************************************/


      checksum = function (data) {
        var i, sum, tmp, _i, _ref;

        data = __slice.call(data);

        while (data.length % 4) {
          data.push(0);
        }

        tmp = new Data(data);
        sum = 0;

        for (i = _i = 0, _ref = data.length; _i < _ref; i = _i += 4) {
          sum += tmp.readUInt32();
        }

        return sum & 0xffffffff;
      };

      return Directory;
    }();

    var Table,
        __hasProp = {}.hasOwnProperty,
        __extends = function (child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }

      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };
    /***************************************************************/

    /* function : Table                                            */

    /* comment : Save info for each table, and parse the table.    */

    /***************************************************************/


    Table = function () {
      function Table(file) {
        var info;
        this.file = file;
        info = this.file.directory.tables[this.tag];
        this.exists = !!info;

        if (info) {
          this.offset = info.offset, this.length = info.length;
          this.parse(this.file.contents);
        }
      }

      Table.prototype.parse = function () {};

      Table.prototype.encode = function () {};

      Table.prototype.raw = function () {
        if (!this.exists) {
          return null;
        }

        this.file.contents.pos = this.offset;
        return this.file.contents.read(this.length);
      };

      return Table;
    }();

    var HeadTable = function (_super) {
      __extends(HeadTable, _super);

      function HeadTable() {
        return HeadTable.__super__.constructor.apply(this, arguments);
      }

      HeadTable.prototype.tag = "head";

      HeadTable.prototype.parse = function (data) {
        data.pos = this.offset;
        this.version = data.readInt();
        this.revision = data.readInt();
        this.checkSumAdjustment = data.readInt();
        this.magicNumber = data.readInt();
        this.flags = data.readShort();
        this.unitsPerEm = data.readShort();
        this.created = data.readLongLong();
        this.modified = data.readLongLong();
        this.xMin = data.readShort();
        this.yMin = data.readShort();
        this.xMax = data.readShort();
        this.yMax = data.readShort();
        this.macStyle = data.readShort();
        this.lowestRecPPEM = data.readShort();
        this.fontDirectionHint = data.readShort();
        this.indexToLocFormat = data.readShort();
        return this.glyphDataFormat = data.readShort();
      };

      HeadTable.prototype.encode = function (indexToLocFormat) {
        var table;
        table = new Data();
        table.writeInt(this.version);
        table.writeInt(this.revision);
        table.writeInt(this.checkSumAdjustment);
        table.writeInt(this.magicNumber);
        table.writeShort(this.flags);
        table.writeShort(this.unitsPerEm);
        table.writeLongLong(this.created);
        table.writeLongLong(this.modified);
        table.writeShort(this.xMin);
        table.writeShort(this.yMin);
        table.writeShort(this.xMax);
        table.writeShort(this.yMax);
        table.writeShort(this.macStyle);
        table.writeShort(this.lowestRecPPEM);
        table.writeShort(this.fontDirectionHint);
        table.writeShort(indexToLocFormat);
        table.writeShort(this.glyphDataFormat);
        return table.data;
      };

      return HeadTable;
    }(Table);
    /************************************************************************************/

    /* function : CmapEntry                                                             */

    /* comment : Cmap Initializes and encodes object information (required by pdf spec).*/

    /************************************************************************************/


    var CmapEntry = function () {
      function CmapEntry(data, offset) {
        var code, count, endCode, glyphId, glyphIds, i, idDelta, idRangeOffset, index, saveOffset, segCount, segCountX2, start, startCode, tail, _i, _j, _k, _len;

        this.platformID = data.readUInt16();
        this.encodingID = data.readShort();
        this.offset = offset + data.readInt();
        saveOffset = data.pos;
        data.pos = this.offset;
        this.format = data.readUInt16();
        this.length = data.readUInt16();
        this.language = data.readUInt16();
        this.isUnicode = this.platformID === 3 && this.encodingID === 1 && this.format === 4 || this.platformID === 0 && this.format === 4;
        this.codeMap = {};

        switch (this.format) {
          case 0:
            for (i = _i = 0; _i < 256; i = ++_i) {
              this.codeMap[i] = data.readByte();
            }

            break;

          case 4:
            segCountX2 = data.readUInt16();
            segCount = segCountX2 / 2;
            data.pos += 6;

            endCode = function () {
              var _j, _results;

              _results = [];

              for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                _results.push(data.readUInt16());
              }

              return _results;
            }();

            data.pos += 2;

            startCode = function () {
              var _j, _results;

              _results = [];

              for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                _results.push(data.readUInt16());
              }

              return _results;
            }();

            idDelta = function () {
              var _j, _results;

              _results = [];

              for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                _results.push(data.readUInt16());
              }

              return _results;
            }();

            idRangeOffset = function () {
              var _j, _results;

              _results = [];

              for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                _results.push(data.readUInt16());
              }

              return _results;
            }();

            count = (this.length - data.pos + this.offset) / 2;

            glyphIds = function () {
              var _j, _results;

              _results = [];

              for (i = _j = 0; 0 <= count ? _j < count : _j > count; i = 0 <= count ? ++_j : --_j) {
                _results.push(data.readUInt16());
              }

              return _results;
            }();

            for (i = _j = 0, _len = endCode.length; _j < _len; i = ++_j) {
              tail = endCode[i];
              start = startCode[i];

              for (code = _k = start; start <= tail ? _k <= tail : _k >= tail; code = start <= tail ? ++_k : --_k) {
                if (idRangeOffset[i] === 0) {
                  glyphId = code + idDelta[i];
                } else {
                  index = idRangeOffset[i] / 2 + (code - start) - (segCount - i);
                  glyphId = glyphIds[index] || 0;

                  if (glyphId !== 0) {
                    glyphId += idDelta[i];
                  }
                }

                this.codeMap[code] = glyphId & 0xffff;
              }
            }

        }

        data.pos = saveOffset;
      }

      CmapEntry.encode = function (charmap, encoding) {
        var charMap, code, codeMap, codes, delta, deltas, diff, endCode, endCodes, entrySelector, glyphIDs, i, id, indexes, last, map, nextID, offset, old, rangeOffsets, rangeShift, result, searchRange, segCount, segCountX2, startCode, startCodes, startGlyph, subtable, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _name, _o, _p, _q;

        subtable = new Data();
        codes = Object.keys(charmap).sort(function (a, b) {
          return a - b;
        });

        switch (encoding) {
          case "macroman":
            id = 0;

            indexes = function () {
              var _i, _results;

              _results = [];

              for (i = _i = 0; _i < 256; i = ++_i) {
                _results.push(0);
              }

              return _results;
            }();

            map = {
              0: 0
            };
            codeMap = {};

            for (_i = 0, _len = codes.length; _i < _len; _i++) {
              code = codes[_i];

              if (map[_name = charmap[code]] == null) {
                map[_name] = ++id;
              }

              codeMap[code] = {
                old: charmap[code],
                new: map[charmap[code]]
              };
              indexes[code] = map[charmap[code]];
            }

            subtable.writeUInt16(1);
            subtable.writeUInt16(0);
            subtable.writeUInt32(12);
            subtable.writeUInt16(0);
            subtable.writeUInt16(262);
            subtable.writeUInt16(0);
            subtable.write(indexes);
            return result = {
              charMap: codeMap,
              subtable: subtable.data,
              maxGlyphID: id + 1
            };

          case "unicode":
            startCodes = [];
            endCodes = [];
            nextID = 0;
            map = {};
            charMap = {};
            last = diff = null;

            for (_j = 0, _len1 = codes.length; _j < _len1; _j++) {
              code = codes[_j];
              old = charmap[code];

              if (map[old] == null) {
                map[old] = ++nextID;
              }

              charMap[code] = {
                old: old,
                new: map[old]
              };
              delta = map[old] - code;

              if (last == null || delta !== diff) {
                if (last) {
                  endCodes.push(last);
                }

                startCodes.push(code);
                diff = delta;
              }

              last = code;
            }

            if (last) {
              endCodes.push(last);
            }

            endCodes.push(0xffff);
            startCodes.push(0xffff);
            segCount = startCodes.length;
            segCountX2 = segCount * 2;
            searchRange = 2 * Math.pow(Math.log(segCount) / Math.LN2, 2);
            entrySelector = Math.log(searchRange / 2) / Math.LN2;
            rangeShift = 2 * segCount - searchRange;
            deltas = [];
            rangeOffsets = [];
            glyphIDs = [];

            for (i = _k = 0, _len2 = startCodes.length; _k < _len2; i = ++_k) {
              startCode = startCodes[i];
              endCode = endCodes[i];

              if (startCode === 0xffff) {
                deltas.push(0);
                rangeOffsets.push(0);
                break;
              }

              startGlyph = charMap[startCode]["new"];

              if (startCode - startGlyph >= 0x8000) {
                deltas.push(0);
                rangeOffsets.push(2 * (glyphIDs.length + segCount - i));

                for (code = _l = startCode; startCode <= endCode ? _l <= endCode : _l >= endCode; code = startCode <= endCode ? ++_l : --_l) {
                  glyphIDs.push(charMap[code]["new"]);
                }
              } else {
                deltas.push(startGlyph - startCode);
                rangeOffsets.push(0);
              }
            }

            subtable.writeUInt16(3);
            subtable.writeUInt16(1);
            subtable.writeUInt32(12);
            subtable.writeUInt16(4);
            subtable.writeUInt16(16 + segCount * 8 + glyphIDs.length * 2);
            subtable.writeUInt16(0);
            subtable.writeUInt16(segCountX2);
            subtable.writeUInt16(searchRange);
            subtable.writeUInt16(entrySelector);
            subtable.writeUInt16(rangeShift);

            for (_m = 0, _len3 = endCodes.length; _m < _len3; _m++) {
              code = endCodes[_m];
              subtable.writeUInt16(code);
            }

            subtable.writeUInt16(0);

            for (_n = 0, _len4 = startCodes.length; _n < _len4; _n++) {
              code = startCodes[_n];
              subtable.writeUInt16(code);
            }

            for (_o = 0, _len5 = deltas.length; _o < _len5; _o++) {
              delta = deltas[_o];
              subtable.writeUInt16(delta);
            }

            for (_p = 0, _len6 = rangeOffsets.length; _p < _len6; _p++) {
              offset = rangeOffsets[_p];
              subtable.writeUInt16(offset);
            }

            for (_q = 0, _len7 = glyphIDs.length; _q < _len7; _q++) {
              id = glyphIDs[_q];
              subtable.writeUInt16(id);
            }

            return result = {
              charMap: charMap,
              subtable: subtable.data,
              maxGlyphID: nextID + 1
            };
        }
      };

      return CmapEntry;
    }();

    var CmapTable = function (_super) {
      __extends(CmapTable, _super);

      function CmapTable() {
        return CmapTable.__super__.constructor.apply(this, arguments);
      }

      CmapTable.prototype.tag = "cmap";

      CmapTable.prototype.parse = function (data) {
        var entry, i, tableCount, _i;

        data.pos = this.offset;
        this.version = data.readUInt16();
        tableCount = data.readUInt16();
        this.tables = [];
        this.unicode = null;

        for (i = _i = 0; 0 <= tableCount ? _i < tableCount : _i > tableCount; i = 0 <= tableCount ? ++_i : --_i) {
          entry = new CmapEntry(data, this.offset);
          this.tables.push(entry);

          if (entry.isUnicode) {
            if (this.unicode == null) {
              this.unicode = entry;
            }
          }
        }

        return true;
      };
      /*************************************************************************/

      /* function : encode                                                     */

      /* comment : Encode the cmap table corresponding to the input character. */

      /*************************************************************************/


      CmapTable.encode = function (charmap, encoding) {
        var result, table;

        if (encoding == null) {
          encoding = "macroman";
        }

        result = CmapEntry.encode(charmap, encoding);
        table = new Data();
        table.writeUInt16(0);
        table.writeUInt16(1);
        result.table = table.data.concat(result.subtable);
        return result;
      };

      return CmapTable;
    }(Table);

    var HheaTable = function (_super) {
      __extends(HheaTable, _super);

      function HheaTable() {
        return HheaTable.__super__.constructor.apply(this, arguments);
      }

      HheaTable.prototype.tag = "hhea";

      HheaTable.prototype.parse = function (data) {
        data.pos = this.offset;
        this.version = data.readInt();
        this.ascender = data.readShort();
        this.decender = data.readShort();
        this.lineGap = data.readShort();
        this.advanceWidthMax = data.readShort();
        this.minLeftSideBearing = data.readShort();
        this.minRightSideBearing = data.readShort();
        this.xMaxExtent = data.readShort();
        this.caretSlopeRise = data.readShort();
        this.caretSlopeRun = data.readShort();
        this.caretOffset = data.readShort();
        data.pos += 4 * 2;
        this.metricDataFormat = data.readShort();
        return this.numberOfMetrics = data.readUInt16();
      };
      /*HheaTable.prototype.encode = function (ids) {
              var i, table, _i, _ref;
              table = new Data;
              table.writeInt(this.version);
              table.writeShort(this.ascender);
              table.writeShort(this.decender);
              table.writeShort(this.lineGap);
              table.writeShort(this.advanceWidthMax);
              table.writeShort(this.minLeftSideBearing);
              table.writeShort(this.minRightSideBearing);
              table.writeShort(this.xMaxExtent);
              table.writeShort(this.caretSlopeRise);
              table.writeShort(this.caretSlopeRun);
              table.writeShort(this.caretOffset);
              for (i = _i = 0, _ref = 4 * 2; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                  table.writeByte(0);
              }
              table.writeShort(this.metricDataFormat);
              table.writeUInt16(ids.length);
              return table.data;
          };*/


      return HheaTable;
    }(Table);

    var OS2Table = function (_super) {
      __extends(OS2Table, _super);

      function OS2Table() {
        return OS2Table.__super__.constructor.apply(this, arguments);
      }

      OS2Table.prototype.tag = "OS/2";

      OS2Table.prototype.parse = function (data) {
        var i;
        data.pos = this.offset;
        this.version = data.readUInt16();
        this.averageCharWidth = data.readShort();
        this.weightClass = data.readUInt16();
        this.widthClass = data.readUInt16();
        this.type = data.readShort();
        this.ySubscriptXSize = data.readShort();
        this.ySubscriptYSize = data.readShort();
        this.ySubscriptXOffset = data.readShort();
        this.ySubscriptYOffset = data.readShort();
        this.ySuperscriptXSize = data.readShort();
        this.ySuperscriptYSize = data.readShort();
        this.ySuperscriptXOffset = data.readShort();
        this.ySuperscriptYOffset = data.readShort();
        this.yStrikeoutSize = data.readShort();
        this.yStrikeoutPosition = data.readShort();
        this.familyClass = data.readShort();

        this.panose = function () {
          var _i, _results;

          _results = [];

          for (i = _i = 0; _i < 10; i = ++_i) {
            _results.push(data.readByte());
          }

          return _results;
        }();

        this.charRange = function () {
          var _i, _results;

          _results = [];

          for (i = _i = 0; _i < 4; i = ++_i) {
            _results.push(data.readInt());
          }

          return _results;
        }();

        this.vendorID = data.readString(4);
        this.selection = data.readShort();
        this.firstCharIndex = data.readShort();
        this.lastCharIndex = data.readShort();

        if (this.version > 0) {
          this.ascent = data.readShort();
          this.descent = data.readShort();
          this.lineGap = data.readShort();
          this.winAscent = data.readShort();
          this.winDescent = data.readShort();

          this.codePageRange = function () {
            var _i, _results;

            _results = [];

            for (i = _i = 0; _i < 2; i = ++_i) {
              _results.push(data.readInt());
            }

            return _results;
          }();

          if (this.version > 1) {
            this.xHeight = data.readShort();
            this.capHeight = data.readShort();
            this.defaultChar = data.readShort();
            this.breakChar = data.readShort();
            return this.maxContext = data.readShort();
          }
        }
      };
      /*OS2Table.prototype.encode = function () {
              return this.raw();
          };*/


      return OS2Table;
    }(Table);

    var PostTable = function (_super) {

      __extends(PostTable, _super);

      function PostTable() {
        return PostTable.__super__.constructor.apply(this, arguments);
      }

      PostTable.prototype.tag = "post";

      PostTable.prototype.parse = function (data) {
        var i, length, numberOfGlyphs, _i, _results;

        data.pos = this.offset;
        this.format = data.readInt();
        this.italicAngle = data.readInt();
        this.underlinePosition = data.readShort();
        this.underlineThickness = data.readShort();
        this.isFixedPitch = data.readInt();
        this.minMemType42 = data.readInt();
        this.maxMemType42 = data.readInt();
        this.minMemType1 = data.readInt();
        this.maxMemType1 = data.readInt();

        switch (this.format) {
          case 0x00010000:
            break;

          case 0x00020000:
            numberOfGlyphs = data.readUInt16();
            this.glyphNameIndex = [];

            for (i = _i = 0; 0 <= numberOfGlyphs ? _i < numberOfGlyphs : _i > numberOfGlyphs; i = 0 <= numberOfGlyphs ? ++_i : --_i) {
              this.glyphNameIndex.push(data.readUInt16());
            }

            this.names = [];
            _results = [];

            while (data.pos < this.offset + this.length) {
              length = data.readByte();

              _results.push(this.names.push(data.readString(length)));
            }

            return _results;
            break;

          case 0x00025000:
            numberOfGlyphs = data.readUInt16();
            return this.offsets = data.read(numberOfGlyphs);

          case 0x00030000:
            break;

          case 0x00040000:
            return this.map = function () {
              var _j, _ref, _results1;

              _results1 = [];

              for (i = _j = 0, _ref = this.file.maxp.numGlyphs; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
                _results1.push(data.readUInt32());
              }

              return _results1;
            }.call(this);
        }
      };
      return PostTable;
    }(Table);
    /*********************************************************************************************************/

    /* function : NameEntry                                                                                  */

    /* comment : Store copyright information, platformID, encodingID, and languageID in the NameEntry object.*/

    /*********************************************************************************************************/


    var NameEntry = function () {
      function NameEntry(raw, entry) {
        this.raw = raw;
        this.length = raw.length;
        this.platformID = entry.platformID;
        this.encodingID = entry.encodingID;
        this.languageID = entry.languageID;
      }

      return NameEntry;
    }();

    var NameTable = function (_super) {

      __extends(NameTable, _super);

      function NameTable() {
        return NameTable.__super__.constructor.apply(this, arguments);
      }

      NameTable.prototype.tag = "name";

      NameTable.prototype.parse = function (data) {
        var count, entries, entry, format, i, name, stringOffset, strings, text, _i, _j, _len, _name;

        data.pos = this.offset;
        format = data.readShort();
        count = data.readShort();
        stringOffset = data.readShort();
        entries = [];

        for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
          entries.push({
            platformID: data.readShort(),
            encodingID: data.readShort(),
            languageID: data.readShort(),
            nameID: data.readShort(),
            length: data.readShort(),
            offset: this.offset + stringOffset + data.readShort()
          });
        }

        strings = {};

        for (i = _j = 0, _len = entries.length; _j < _len; i = ++_j) {
          entry = entries[i];
          data.pos = entry.offset;
          text = data.readString(entry.length);
          name = new NameEntry(text, entry);

          if (strings[_name = entry.nameID] == null) {
            strings[_name] = [];
          }

          strings[entry.nameID].push(name);
        }

        this.strings = strings;
        this.copyright = strings[0];
        this.fontFamily = strings[1];
        this.fontSubfamily = strings[2];
        this.uniqueSubfamily = strings[3];
        this.fontName = strings[4];
        this.version = strings[5];

        try {
          this.postscriptName = strings[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
        } catch (e) {
          this.postscriptName = strings[4][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
        }

        this.trademark = strings[7];
        this.manufacturer = strings[8];
        this.designer = strings[9];
        this.description = strings[10];
        this.vendorUrl = strings[11];
        this.designerUrl = strings[12];
        this.license = strings[13];
        this.licenseUrl = strings[14];
        this.preferredFamily = strings[15];
        this.preferredSubfamily = strings[17];
        this.compatibleFull = strings[18];
        return this.sampleText = strings[19];
      };
      /*NameTable.prototype.encode = function () {
              var id, list, nameID, nameTable, postscriptName, strCount, strTable, string, strings, table, val, _i, _len, _ref;
              strings = {};
              _ref = this.strings;
              for (id in _ref) {
                  val = _ref[id];
                  strings[id] = val;
              }
              postscriptName = new NameEntry("" + subsetTag + "+" + this.postscriptName, {
                  platformID: 1
                  , encodingID: 0
                  , languageID: 0
              });
              strings[6] = [postscriptName];
              subsetTag = successorOf(subsetTag);
              strCount = 0;
              for (id in strings) {
                  list = strings[id];
                  if (list != null) {
                      strCount += list.length;
                  }
              }
              table = new Data;
              strTable = new Data;
              table.writeShort(0);
              table.writeShort(strCount);
              table.writeShort(6 + 12 * strCount);
              for (nameID in strings) {
                  list = strings[nameID];
                  if (list != null) {
                      for (_i = 0, _len = list.length; _i < _len; _i++) {
                          string = list[_i];
                          table.writeShort(string.platformID);
                          table.writeShort(string.encodingID);
                          table.writeShort(string.languageID);
                          table.writeShort(nameID);
                          table.writeShort(string.length);
                          table.writeShort(strTable.pos);
                          strTable.writeString(string.raw);
                      }
                  }
              }
              return nameTable = {
                  postscriptName: postscriptName.raw
                  , table: table.data.concat(strTable.data)
              };
          };*/

      return NameTable;
    }(Table);

    var MaxpTable = function (_super) {
      __extends(MaxpTable, _super);

      function MaxpTable() {
        return MaxpTable.__super__.constructor.apply(this, arguments);
      }

      MaxpTable.prototype.tag = "maxp";

      MaxpTable.prototype.parse = function (data) {
        data.pos = this.offset;
        this.version = data.readInt();
        this.numGlyphs = data.readUInt16();
        this.maxPoints = data.readUInt16();
        this.maxContours = data.readUInt16();
        this.maxCompositePoints = data.readUInt16();
        this.maxComponentContours = data.readUInt16();
        this.maxZones = data.readUInt16();
        this.maxTwilightPoints = data.readUInt16();
        this.maxStorage = data.readUInt16();
        this.maxFunctionDefs = data.readUInt16();
        this.maxInstructionDefs = data.readUInt16();
        this.maxStackElements = data.readUInt16();
        this.maxSizeOfInstructions = data.readUInt16();
        this.maxComponentElements = data.readUInt16();
        return this.maxComponentDepth = data.readUInt16();
      };
      /*MaxpTable.prototype.encode = function (ids) {
              var table;
              table = new Data;
              table.writeInt(this.version);
              table.writeUInt16(ids.length);
              table.writeUInt16(this.maxPoints);
              table.writeUInt16(this.maxContours);
              table.writeUInt16(this.maxCompositePoints);
              table.writeUInt16(this.maxComponentContours);
              table.writeUInt16(this.maxZones);
              table.writeUInt16(this.maxTwilightPoints);
              table.writeUInt16(this.maxStorage);
              table.writeUInt16(this.maxFunctionDefs);
              table.writeUInt16(this.maxInstructionDefs);
              table.writeUInt16(this.maxStackElements);
              table.writeUInt16(this.maxSizeOfInstructions);
              table.writeUInt16(this.maxComponentElements);
              table.writeUInt16(this.maxComponentDepth);
              return table.data;
          };*/


      return MaxpTable;
    }(Table);

    var HmtxTable = function (_super) {
      __extends(HmtxTable, _super);

      function HmtxTable() {
        return HmtxTable.__super__.constructor.apply(this, arguments);
      }

      HmtxTable.prototype.tag = "hmtx";

      HmtxTable.prototype.parse = function (data) {
        var i, last, lsbCount, m, _i, _j, _ref, _results;

        data.pos = this.offset;
        this.metrics = [];

        for (i = _i = 0, _ref = this.file.hhea.numberOfMetrics; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.metrics.push({
            advance: data.readUInt16(),
            lsb: data.readInt16()
          });
        }

        lsbCount = this.file.maxp.numGlyphs - this.file.hhea.numberOfMetrics;

        this.leftSideBearings = function () {
          var _j, _results;

          _results = [];

          for (i = _j = 0; 0 <= lsbCount ? _j < lsbCount : _j > lsbCount; i = 0 <= lsbCount ? ++_j : --_j) {
            _results.push(data.readInt16());
          }

          return _results;
        }();

        this.widths = function () {
          var _j, _len, _ref1, _results;

          _ref1 = this.metrics;
          _results = [];

          for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
            m = _ref1[_j];

            _results.push(m.advance);
          }

          return _results;
        }.call(this);

        last = this.widths[this.widths.length - 1];
        _results = [];

        for (i = _j = 0; 0 <= lsbCount ? _j < lsbCount : _j > lsbCount; i = 0 <= lsbCount ? ++_j : --_j) {
          _results.push(this.widths.push(last));
        }

        return _results;
      };
      /***************************************************************/

      /* function : forGlyph                                         */

      /* comment : Returns the advance width and lsb for this glyph. */

      /***************************************************************/


      HmtxTable.prototype.forGlyph = function (id) {
        var metrics;

        if (id in this.metrics) {
          return this.metrics[id];
        }

        return metrics = {
          advance: this.metrics[this.metrics.length - 1].advance,
          lsb: this.leftSideBearings[id - this.metrics.length]
        };
      };
      /*HmtxTable.prototype.encode = function (mapping) {
              var id, metric, table, _i, _len;
              table = new Data;
              for (_i = 0, _len = mapping.length; _i < _len; _i++) {
                  id = mapping[_i];
                  metric = this.forGlyph(id);
                  table.writeUInt16(metric.advance);
                  table.writeUInt16(metric.lsb);
              }
              return table.data;
          };*/


      return HmtxTable;
    }(Table);

    var __slice = [].slice;

    var GlyfTable = function (_super) {
      __extends(GlyfTable, _super);

      function GlyfTable() {
        return GlyfTable.__super__.constructor.apply(this, arguments);
      }

      GlyfTable.prototype.tag = "glyf";

      GlyfTable.prototype.parse = function (data) {
        return this.cache = {};
      };

      GlyfTable.prototype.glyphFor = function (id) {
        id = id;
        var data, index, length, loca, numberOfContours, raw, xMax, xMin, yMax, yMin;

        if (id in this.cache) {
          return this.cache[id];
        }

        loca = this.file.loca;
        data = this.file.contents;
        index = loca.indexOf(id);
        length = loca.lengthOf(id);

        if (length === 0) {
          return this.cache[id] = null;
        }

        data.pos = this.offset + index;
        raw = new Data(data.read(length));
        numberOfContours = raw.readShort();
        xMin = raw.readShort();
        yMin = raw.readShort();
        xMax = raw.readShort();
        yMax = raw.readShort();

        if (numberOfContours === -1) {
          this.cache[id] = new CompoundGlyph(raw, xMin, yMin, xMax, yMax);
        } else {
          this.cache[id] = new SimpleGlyph(raw, numberOfContours, xMin, yMin, xMax, yMax);
        }

        return this.cache[id];
      };

      GlyfTable.prototype.encode = function (glyphs, mapping, old2new) {
        var glyph, id, offsets, table, _i, _len;

        table = [];
        offsets = [];

        for (_i = 0, _len = mapping.length; _i < _len; _i++) {
          id = mapping[_i];
          glyph = glyphs[id];
          offsets.push(table.length);

          if (glyph) {
            table = table.concat(glyph.encode(old2new));
          }
        }

        offsets.push(table.length);
        return {
          table: table,
          offsets: offsets
        };
      };

      return GlyfTable;
    }(Table);

    var SimpleGlyph = function () {
      /**************************************************************************/

      /* function : SimpleGlyph                                                 */

      /* comment : Stores raw, xMin, yMin, xMax, and yMax values for this glyph.*/

      /**************************************************************************/
      function SimpleGlyph(raw, numberOfContours, xMin, yMin, xMax, yMax) {
        this.raw = raw;
        this.numberOfContours = numberOfContours;
        this.xMin = xMin;
        this.yMin = yMin;
        this.xMax = xMax;
        this.yMax = yMax;
        this.compound = false;
      }

      SimpleGlyph.prototype.encode = function () {
        return this.raw.data;
      };

      return SimpleGlyph;
    }();

    var CompoundGlyph = function () {
      var ARG_1_AND_2_ARE_WORDS, MORE_COMPONENTS, WE_HAVE_AN_X_AND_Y_SCALE, WE_HAVE_A_SCALE, WE_HAVE_A_TWO_BY_TWO;
      ARG_1_AND_2_ARE_WORDS = 0x0001;
      WE_HAVE_A_SCALE = 0x0008;
      MORE_COMPONENTS = 0x0020;
      WE_HAVE_AN_X_AND_Y_SCALE = 0x0040;
      WE_HAVE_A_TWO_BY_TWO = 0x0080;
      /********************************************************************************************************************/

      /* function : CompoundGlypg generator                                                                               */

      /* comment : It stores raw, xMin, yMin, xMax, yMax, glyph id, and glyph offset for the corresponding compound glyph.*/

      /********************************************************************************************************************/

      function CompoundGlyph(raw, xMin, yMin, xMax, yMax) {
        var data, flags;
        this.raw = raw;
        this.xMin = xMin;
        this.yMin = yMin;
        this.xMax = xMax;
        this.yMax = yMax;
        this.compound = true;
        this.glyphIDs = [];
        this.glyphOffsets = [];
        data = this.raw;

        while (true) {
          flags = data.readShort();
          this.glyphOffsets.push(data.pos);
          this.glyphIDs.push(data.readShort());

          if (!(flags & MORE_COMPONENTS)) {
            break;
          }

          if (flags & ARG_1_AND_2_ARE_WORDS) {
            data.pos += 4;
          } else {
            data.pos += 2;
          }

          if (flags & WE_HAVE_A_TWO_BY_TWO) {
            data.pos += 8;
          } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
            data.pos += 4;
          } else if (flags & WE_HAVE_A_SCALE) {
            data.pos += 2;
          }
        }
      }
      /****************************************************************************************************************/

      /* function : CompoundGlypg encode                                                                              */

      /* comment : After creating a table for the characters you typed, you call directory.encode to encode the table.*/

      /****************************************************************************************************************/


      CompoundGlyph.prototype.encode = function (mapping) {
        var i, id, result, _i, _len, _ref;

        result = new Data(__slice.call(this.raw.data));
        _ref = this.glyphIDs;

        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          id = _ref[i];
          result.pos = this.glyphOffsets[i];
        }

        return result.data;
      };

      return CompoundGlyph;
    }();

    var LocaTable = function (_super) {
      __extends(LocaTable, _super);

      function LocaTable() {
        return LocaTable.__super__.constructor.apply(this, arguments);
      }

      LocaTable.prototype.tag = "loca";

      LocaTable.prototype.parse = function (data) {
        var format, i;
        data.pos = this.offset;
        format = this.file.head.indexToLocFormat;

        if (format === 0) {
          return this.offsets = function () {
            var _i, _ref, _results;

            _results = [];

            for (i = _i = 0, _ref = this.length; _i < _ref; i = _i += 2) {
              _results.push(data.readUInt16() * 2);
            }

            return _results;
          }.call(this);
        } else {
          return this.offsets = function () {
            var _i, _ref, _results;

            _results = [];

            for (i = _i = 0, _ref = this.length; _i < _ref; i = _i += 4) {
              _results.push(data.readUInt32());
            }

            return _results;
          }.call(this);
        }
      };

      LocaTable.prototype.indexOf = function (id) {
        return this.offsets[id];
      };

      LocaTable.prototype.lengthOf = function (id) {
        return this.offsets[id + 1] - this.offsets[id];
      };

      LocaTable.prototype.encode = function (offsets, activeGlyphs) {
        var LocaTable = new Uint32Array(this.offsets.length);
        var glyfPtr = 0;
        var listGlyf = 0;

        for (var k = 0; k < LocaTable.length; ++k) {
          LocaTable[k] = glyfPtr;

          if (listGlyf < activeGlyphs.length && activeGlyphs[listGlyf] == k) {
            ++listGlyf;
            LocaTable[k] = glyfPtr;
            var start = this.offsets[k];
            var len = this.offsets[k + 1] - start;

            if (len > 0) {
              glyfPtr += len;
            }
          }
        }

        var newLocaTable = new Array(LocaTable.length * 4);

        for (var j = 0; j < LocaTable.length; ++j) {
          newLocaTable[4 * j + 3] = LocaTable[j] & 0x000000ff;
          newLocaTable[4 * j + 2] = (LocaTable[j] & 0x0000ff00) >> 8;
          newLocaTable[4 * j + 1] = (LocaTable[j] & 0x00ff0000) >> 16;
          newLocaTable[4 * j] = (LocaTable[j] & 0xff000000) >> 24;
        }

        return newLocaTable;
      };

      return LocaTable;
    }(Table);
    /************************************************************************************/

    /* function : invert                                                                */

    /* comment : Change the object's (key: value) to create an object with (value: key).*/

    /************************************************************************************/


    var invert = function (object) {
      var key, ret, val;
      ret = {};

      for (key in object) {
        val = object[key];
        ret[val] = key;
      }

      return ret;
    };
    /*var successorOf = function (input) {
          var added, alphabet, carry, i, index, isUpperCase, last, length, next, result;
          alphabet = 'abcdefghijklmnopqrstuvwxyz';
          length = alphabet.length;
          result = input;
          i = input.length;
          while (i >= 0) {
              last = input.charAt(--i);
              if (isNaN(last)) {
                  index = alphabet.indexOf(last.toLowerCase());
                  if (index === -1) {
                      next = last;
                      carry = true;
                  }
                  else {
                      next = alphabet.charAt((index + 1) % length);
                      isUpperCase = last === last.toUpperCase();
                      if (isUpperCase) {
                          next = next.toUpperCase();
                      }
                      carry = index + 1 >= length;
                      if (carry && i === 0) {
                          added = isUpperCase ? 'A' : 'a';
                          result = added + next + result.slice(1);
                          break;
                      }
                  }
              }
              else {
                  next = +last + 1;
                  carry = next > 9;
                  if (carry) {
                      next = 0;
                  }
                  if (carry && i === 0) {
                      result = '1' + next + result.slice(1);
                      break;
                  }
              }
              result = result.slice(0, i) + next + result.slice(i + 1);
              if (!carry) {
                  break;
              }
          }
          return result;
      };*/


    var Subset = function () {
      function Subset(font) {
        this.font = font;
        this.subset = {};
        this.unicodes = {};
        this.next = 33;
      }
      /*Subset.prototype.use = function (character) {
              var i, _i, _ref;
              if (typeof character === 'string') {
                  for (i = _i = 0, _ref = character.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                      this.use(character.charCodeAt(i));
                  }
                  return;
              }
              if (!this.unicodes[character]) {
                  this.subset[this.next] = character;
                  return this.unicodes[character] = this.next++;
              }
          };*/

      /*Subset.prototype.encodeText = function (text) {
              var char, i, string, _i, _ref;
              string = '';
              for (i = _i = 0, _ref = text.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                  char = this.unicodes[text.charCodeAt(i)];
                  string += String.fromCharCode(char);
              }
              return string;
          };*/

      /***************************************************************/

      /* function : generateCmap                                     */

      /* comment : Returns the unicode cmap for this font.         */

      /***************************************************************/


      Subset.prototype.generateCmap = function () {
        var mapping, roman, unicode, unicodeCmap, _ref;

        unicodeCmap = this.font.cmap.tables[0].codeMap;
        mapping = {};
        _ref = this.subset;

        for (roman in _ref) {
          unicode = _ref[roman];
          mapping[roman] = unicodeCmap[unicode];
        }

        return mapping;
      };
      /*Subset.prototype.glyphIDs = function () {
              var ret, roman, unicode, unicodeCmap, val, _ref;
              unicodeCmap = this.font.cmap.tables[0].codeMap;
              ret = [0];
              _ref = this.subset;
              for (roman in _ref) {
                  unicode = _ref[roman];
                  val = unicodeCmap[unicode];
                  if ((val != null) && __indexOf.call(ret, val) < 0) {
                      ret.push(val);
                  }
              }
              return ret.sort();
          };*/

      /******************************************************************/

      /* function : glyphsFor                                           */

      /* comment : Returns simple glyph objects for the input character.*/

      /******************************************************************/


      Subset.prototype.glyphsFor = function (glyphIDs) {
        var additionalIDs, glyph, glyphs, id, _i, _len, _ref;

        glyphs = {};

        for (_i = 0, _len = glyphIDs.length; _i < _len; _i++) {
          id = glyphIDs[_i];
          glyphs[id] = this.font.glyf.glyphFor(id);
        }

        additionalIDs = [];

        for (id in glyphs) {
          glyph = glyphs[id];

          if (glyph != null ? glyph.compound : void 0) {
            additionalIDs.push.apply(additionalIDs, glyph.glyphIDs);
          }
        }

        if (additionalIDs.length > 0) {
          _ref = this.glyphsFor(additionalIDs);

          for (id in _ref) {
            glyph = _ref[id];
            glyphs[id] = glyph;
          }
        }

        return glyphs;
      };
      /***************************************************************/

      /* function : encode                                           */

      /* comment : Encode various tables for the characters you use. */

      /***************************************************************/


      Subset.prototype.encode = function (glyID, indexToLocFormat) {
        var cmap, code, glyf, glyphs, id, ids, loca, new2old, newIDs, nextGlyphID, old2new, oldID, oldIDs, tables, _ref;

        cmap = CmapTable.encode(this.generateCmap(), "unicode");
        glyphs = this.glyphsFor(glyID);
        old2new = {
          0: 0
        };
        _ref = cmap.charMap;

        for (code in _ref) {
          ids = _ref[code];
          old2new[ids.old] = ids["new"];
        }

        nextGlyphID = cmap.maxGlyphID;

        for (oldID in glyphs) {
          if (!(oldID in old2new)) {
            old2new[oldID] = nextGlyphID++;
          }
        }

        new2old = invert(old2new);
        newIDs = Object.keys(new2old).sort(function (a, b) {
          return a - b;
        });

        oldIDs = function () {
          var _i, _len, _results;

          _results = [];

          for (_i = 0, _len = newIDs.length; _i < _len; _i++) {
            id = newIDs[_i];

            _results.push(new2old[id]);
          }

          return _results;
        }();

        glyf = this.font.glyf.encode(glyphs, oldIDs, old2new);
        loca = this.font.loca.encode(glyf.offsets, oldIDs);
        tables = {
          cmap: this.font.cmap.raw(),
          glyf: glyf.table,
          loca: loca,
          hmtx: this.font.hmtx.raw(),
          hhea: this.font.hhea.raw(),
          maxp: this.font.maxp.raw(),
          post: this.font.post.raw(),
          name: this.font.name.raw(),
          head: this.font.head.encode(indexToLocFormat)
        };

        if (this.font.os2.exists) {
          tables["OS/2"] = this.font.os2.raw();
        }

        return this.font.directory.encode(tables);
      };

      return Subset;
    }();

    jsPDF.API.PDFObject = function () {
      var pad;

      function PDFObject() {}

      pad = function (str, length) {
        return (Array(length + 1).join("0") + str).slice(-length);
      };
      /*****************************************************************************/

      /* function : convert                                                        */

      /* comment :Converts pdf tag's / FontBBox and array values in / W to strings */

      /*****************************************************************************/


      PDFObject.convert = function (object) {
        var e, items, key, out, val;

        if (Array.isArray(object)) {
          items = function () {
            var _i, _len, _results;

            _results = [];

            for (_i = 0, _len = object.length; _i < _len; _i++) {
              e = object[_i];

              _results.push(PDFObject.convert(e));
            }

            return _results;
          }().join(" ");

          return "[" + items + "]";
        } else if (typeof object === "string") {
          return "/" + object;
        } else if (object != null ? object.isString : void 0) {
          return "(" + object + ")";
        } else if (object instanceof Date) {
          return "(D:" + pad(object.getUTCFullYear(), 4) + pad(object.getUTCMonth(), 2) + pad(object.getUTCDate(), 2) + pad(object.getUTCHours(), 2) + pad(object.getUTCMinutes(), 2) + pad(object.getUTCSeconds(), 2) + "Z)";
        } else if ({}.toString.call(object) === "[object Object]") {
          out = ["<<"];

          for (key in object) {
            val = object[key];
            out.push("/" + key + " " + PDFObject.convert(val));
          }

          out.push(">>");
          return out.join("\n");
        } else {
          return "" + object;
        }
      };

      return PDFObject;
    }();
  })(jsPDF);

  // Generated by CoffeeScript 1.4.0

  /*
  # PNG.js
  # Copyright (c) 2011 Devon Govett
  # MIT LICENSE
  # 
  # 
  */
  (function (global) {
    var PNG;

    PNG = function () {
      var APNG_BLEND_OP_SOURCE, APNG_DISPOSE_OP_BACKGROUND, APNG_DISPOSE_OP_PREVIOUS, makeImage, scratchCanvas, scratchCtx;

      PNG.load = function (url, canvas, callback) {
        var xhr;

        if (typeof canvas === "function") {
          callback = canvas;
        }

        xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";

        xhr.onload = function () {
          var data, png;
          data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
          png = new PNG(data);

          if (typeof (canvas != null ? canvas.getContext : void 0) === "function") {
            png.render(canvas);
          }

          return typeof callback === "function" ? callback(png) : void 0;
        };

        return xhr.send(null);
      };
      APNG_DISPOSE_OP_BACKGROUND = 1;
      APNG_DISPOSE_OP_PREVIOUS = 2;
      APNG_BLEND_OP_SOURCE = 0;

      function PNG(data) {
        var chunkSize, colors, palLen, delayDen, delayNum, frame, i, index, key, section, palShort, text, _i, _j, _ref;

        this.data = data;
        this.pos = 8;
        this.palette = [];
        this.imgData = [];
        this.transparency = {};
        this.animation = null;
        this.text = {};
        frame = null;

        while (true) {
          chunkSize = this.readUInt32();

          section = function () {
            var _i, _results;

            _results = [];

            for (i = _i = 0; _i < 4; i = ++_i) {
              _results.push(String.fromCharCode(this.data[this.pos++]));
            }

            return _results;
          }.call(this).join("");

          switch (section) {
            case "IHDR":
              this.width = this.readUInt32();
              this.height = this.readUInt32();
              this.bits = this.data[this.pos++];
              this.colorType = this.data[this.pos++];
              this.compressionMethod = this.data[this.pos++];
              this.filterMethod = this.data[this.pos++];
              this.interlaceMethod = this.data[this.pos++];
              break;

            case "acTL":
              this.animation = {
                numFrames: this.readUInt32(),
                numPlays: this.readUInt32() || Infinity,
                frames: []
              };
              break;

            case "PLTE":
              this.palette = this.read(chunkSize);
              break;

            case "fcTL":
              if (frame) {
                this.animation.frames.push(frame);
              }

              this.pos += 4;
              frame = {
                width: this.readUInt32(),
                height: this.readUInt32(),
                xOffset: this.readUInt32(),
                yOffset: this.readUInt32()
              };
              delayNum = this.readUInt16();
              delayDen = this.readUInt16() || 100;
              frame.delay = 1000 * delayNum / delayDen;
              frame.disposeOp = this.data[this.pos++];
              frame.blendOp = this.data[this.pos++];
              frame.data = [];
              break;

            case "IDAT":
            case "fdAT":
              if (section === "fdAT") {
                this.pos += 4;
                chunkSize -= 4;
              }

              data = (frame != null ? frame.data : void 0) || this.imgData;

              for (i = _i = 0; 0 <= chunkSize ? _i < chunkSize : _i > chunkSize; i = 0 <= chunkSize ? ++_i : --_i) {
                data.push(this.data[this.pos++]);
              }

              break;

            case "tRNS":
              this.transparency = {};

              switch (this.colorType) {
                case 3:
                  palLen = this.palette.length / 3;
                  this.transparency.indexed = this.read(chunkSize);
                  if (this.transparency.indexed.length > palLen) throw new Error("More transparent colors than palette size");
                  /*
                   * According to the PNG spec trns should be increased to the same size as palette if shorter
                   */
                  //palShort = 255 - this.transparency.indexed.length;

                  palShort = palLen - this.transparency.indexed.length;

                  if (palShort > 0) {
                    for (i = _j = 0; 0 <= palShort ? _j < palShort : _j > palShort; i = 0 <= palShort ? ++_j : --_j) {
                      this.transparency.indexed.push(255);
                    }
                  }

                  break;

                case 0:
                  this.transparency.grayscale = this.read(chunkSize)[0];
                  break;

                case 2:
                  this.transparency.rgb = this.read(chunkSize);
              }

              break;

            case "tEXt":
              text = this.read(chunkSize);
              index = text.indexOf(0);
              key = String.fromCharCode.apply(String, text.slice(0, index));
              this.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
              break;

            case "IEND":
              if (frame) {
                this.animation.frames.push(frame);
              }

              this.colors = function () {
                switch (this.colorType) {
                  case 0:
                  case 3:
                  case 4:
                    return 1;

                  case 2:
                  case 6:
                    return 3;
                }
              }.call(this);

              this.hasAlphaChannel = (_ref = this.colorType) === 4 || _ref === 6;
              colors = this.colors + (this.hasAlphaChannel ? 1 : 0);
              this.pixelBitlength = this.bits * colors;

              this.colorSpace = function () {
                switch (this.colors) {
                  case 1:
                    return "DeviceGray";

                  case 3:
                    return "DeviceRGB";
                }
              }.call(this);

              this.imgData = new Uint8Array(this.imgData);
              return;

            default:
              this.pos += chunkSize;
          }

          this.pos += 4;

          if (this.pos > this.data.length) {
            throw new Error("Incomplete or corrupt PNG file");
          }
        }

        return;
      }

      PNG.prototype.read = function (bytes) {
        var i, _i, _results;

        _results = [];

        for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
          _results.push(this.data[this.pos++]);
        }

        return _results;
      };

      PNG.prototype.readUInt32 = function () {
        var b1, b2, b3, b4;
        b1 = this.data[this.pos++] << 24;
        b2 = this.data[this.pos++] << 16;
        b3 = this.data[this.pos++] << 8;
        b4 = this.data[this.pos++];
        return b1 | b2 | b3 | b4;
      };

      PNG.prototype.readUInt16 = function () {
        var b1, b2;
        b1 = this.data[this.pos++] << 8;
        b2 = this.data[this.pos++];
        return b1 | b2;
      };

      PNG.prototype.decodePixels = function (data) {
        var pixelBytes = this.pixelBitlength / 8;
        var fullPixels = new Uint8Array(this.width * this.height * pixelBytes);
        var pos = 0;

        var _this = this;

        if (data == null) {
          data = this.imgData;
        }

        if (data.length === 0) {
          return new Uint8Array(0);
        }

        data = new FlateStream(data);
        data = data.getBytes();

        function pass(x0, y0, dx, dy) {
          var abyte, c, col, i, left, length, p, pa, paeth, pb, pc, pixels, row, scanlineLength, upper, upperLeft, _i, _j, _k, _l, _m;

          var w = Math.ceil((_this.width - x0) / dx),
              h = Math.ceil((_this.height - y0) / dy);
          var isFull = _this.width == w && _this.height == h;
          scanlineLength = pixelBytes * w;
          pixels = isFull ? fullPixels : new Uint8Array(scanlineLength * h);
          length = data.length;
          row = 0;
          c = 0;

          while (row < h && pos < length) {
            switch (data[pos++]) {
              case 0:
                for (i = _i = 0; _i < scanlineLength; i = _i += 1) {
                  pixels[c++] = data[pos++];
                }

                break;

              case 1:
                for (i = _j = 0; _j < scanlineLength; i = _j += 1) {
                  abyte = data[pos++];
                  left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                  pixels[c++] = (abyte + left) % 256;
                }

                break;

              case 2:
                for (i = _k = 0; _k < scanlineLength; i = _k += 1) {
                  abyte = data[pos++];
                  col = (i - i % pixelBytes) / pixelBytes;
                  upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + i % pixelBytes];
                  pixels[c++] = (upper + abyte) % 256;
                }

                break;

              case 3:
                for (i = _l = 0; _l < scanlineLength; i = _l += 1) {
                  abyte = data[pos++];
                  col = (i - i % pixelBytes) / pixelBytes;
                  left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                  upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + i % pixelBytes];
                  pixels[c++] = (abyte + Math.floor((left + upper) / 2)) % 256;
                }

                break;

              case 4:
                for (i = _m = 0; _m < scanlineLength; i = _m += 1) {
                  abyte = data[pos++];
                  col = (i - i % pixelBytes) / pixelBytes;
                  left = i < pixelBytes ? 0 : pixels[c - pixelBytes];

                  if (row === 0) {
                    upper = upperLeft = 0;
                  } else {
                    upper = pixels[(row - 1) * scanlineLength + col * pixelBytes + i % pixelBytes];
                    upperLeft = col && pixels[(row - 1) * scanlineLength + (col - 1) * pixelBytes + i % pixelBytes];
                  }

                  p = left + upper - upperLeft;
                  pa = Math.abs(p - left);
                  pb = Math.abs(p - upper);
                  pc = Math.abs(p - upperLeft);

                  if (pa <= pb && pa <= pc) {
                    paeth = left;
                  } else if (pb <= pc) {
                    paeth = upper;
                  } else {
                    paeth = upperLeft;
                  }

                  pixels[c++] = (abyte + paeth) % 256;
                }

                break;

              default:
                throw new Error("Invalid filter algorithm: " + data[pos - 1]);
            }

            if (!isFull) {
              var fullPos = ((y0 + row * dy) * _this.width + x0) * pixelBytes;
              var partPos = row * scanlineLength;

              for (i = 0; i < w; i += 1) {
                for (var j = 0; j < pixelBytes; j += 1) fullPixels[fullPos++] = pixels[partPos++];

                fullPos += (dx - 1) * pixelBytes;
              }
            }

            row++;
          }
        }

        if (_this.interlaceMethod == 1) {
          /*
              1 6 4 6 2 6 4 6
              7 7 7 7 7 7 7 7
              5 6 5 6 5 6 5 6
              7 7 7 7 7 7 7 7
              3 6 4 6 3 6 4 6
              7 7 7 7 7 7 7 7
              5 6 5 6 5 6 5 6
              7 7 7 7 7 7 7 7
            */
          pass(0, 0, 8, 8); // 1

          /* NOTE these seem to follow the pattern:
             * pass(x, 0, 2*x, 2*x);
             * pass(0, x,   x, 2*x);
             * with x being 4, 2, 1.
             */

          pass(4, 0, 8, 8); // 2

          pass(0, 4, 4, 8); // 3

          pass(2, 0, 4, 4); // 4

          pass(0, 2, 2, 4); // 5

          pass(1, 0, 2, 2); // 6

          pass(0, 1, 1, 2); // 7
        } else {
          pass(0, 0, 1, 1);
        }

        return fullPixels;
      };

      PNG.prototype.decodePalette = function () {
        var c, i, length, palette, pos, ret, transparency, _i, _ref, _ref1;

        palette = this.palette;
        transparency = this.transparency.indexed || [];
        ret = new Uint8Array((transparency.length || 0) + palette.length);
        pos = 0;
        length = palette.length;
        c = 0;

        for (i = _i = 0, _ref = palette.length; _i < _ref; i = _i += 3) {
          ret[pos++] = palette[i];
          ret[pos++] = palette[i + 1];
          ret[pos++] = palette[i + 2];
          ret[pos++] = (_ref1 = transparency[c++]) != null ? _ref1 : 255;
        }

        return ret;
      };

      PNG.prototype.copyToImageData = function (imageData, pixels) {
        var alpha, colors, data, i, input, j, k, length, palette, v, _ref;

        colors = this.colors;
        palette = null;
        alpha = this.hasAlphaChannel;

        if (this.palette.length) {
          palette = (_ref = this._decodedPalette) != null ? _ref : this._decodedPalette = this.decodePalette();
          colors = 4;
          alpha = true;
        }

        data = imageData.data || imageData;
        length = data.length;
        input = palette || pixels;
        i = j = 0;

        if (colors === 1) {
          while (i < length) {
            k = palette ? pixels[i / 4] * 4 : j;
            v = input[k++];
            data[i++] = v;
            data[i++] = v;
            data[i++] = v;
            data[i++] = alpha ? input[k++] : 255;
            j = k;
          }
        } else {
          while (i < length) {
            k = palette ? pixels[i / 4] * 4 : j;
            data[i++] = input[k++];
            data[i++] = input[k++];
            data[i++] = input[k++];
            data[i++] = alpha ? input[k++] : 255;
            j = k;
          }
        }
      };

      PNG.prototype.decode = function () {
        var ret;
        ret = new Uint8Array(this.width * this.height * 4);
        this.copyToImageData(ret, this.decodePixels());
        return ret;
      };

      try {
        scratchCanvas = global.document.createElement("canvas");
        scratchCtx = scratchCanvas.getContext("2d");
      } catch (e) {
        return -1;
      }

      makeImage = function (imageData) {
        var img;
        scratchCtx.width = imageData.width;
        scratchCtx.height = imageData.height;
        scratchCtx.clearRect(0, 0, imageData.width, imageData.height);
        scratchCtx.putImageData(imageData, 0, 0);
        img = new Image();
        img.src = scratchCanvas.toDataURL();
        return img;
      };

      PNG.prototype.decodeFrames = function (ctx) {
        var frame, i, imageData, pixels, _i, _len, _ref, _results;

        if (!this.animation) {
          return;
        }

        _ref = this.animation.frames;
        _results = [];

        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          frame = _ref[i];
          imageData = ctx.createImageData(frame.width, frame.height);
          pixels = this.decodePixels(new Uint8Array(frame.data));
          this.copyToImageData(imageData, pixels);
          frame.imageData = imageData;

          _results.push(frame.image = makeImage(imageData));
        }

        return _results;
      };

      PNG.prototype.renderFrame = function (ctx, number) {
        var frame, frames, prev;
        frames = this.animation.frames;
        frame = frames[number];
        prev = frames[number - 1];

        if (number === 0) {
          ctx.clearRect(0, 0, this.width, this.height);
        }

        if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_BACKGROUND) {
          ctx.clearRect(prev.xOffset, prev.yOffset, prev.width, prev.height);
        } else if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_PREVIOUS) {
          ctx.putImageData(prev.imageData, prev.xOffset, prev.yOffset);
        }

        if (frame.blendOp === APNG_BLEND_OP_SOURCE) {
          ctx.clearRect(frame.xOffset, frame.yOffset, frame.width, frame.height);
        }

        return ctx.drawImage(frame.image, frame.xOffset, frame.yOffset);
      };

      PNG.prototype.animate = function (ctx) {
        var doFrame,
            frameNumber,
            frames,
            numFrames,
            numPlays,
            _ref,
            _this = this;

        frameNumber = 0;
        _ref = this.animation, numFrames = _ref.numFrames, frames = _ref.frames, numPlays = _ref.numPlays;
        return (doFrame = function () {
          var f, frame;
          f = frameNumber++ % numFrames;
          frame = frames[f];

          _this.renderFrame(ctx, f);

          if (numFrames > 1 && frameNumber / numFrames < numPlays) {
            return _this.animation._timeout = setTimeout(doFrame, frame.delay);
          }
        })();
      };

      PNG.prototype.stopAnimation = function () {
        var _ref;

        return clearTimeout((_ref = this.animation) != null ? _ref._timeout : void 0);
      };

      PNG.prototype.render = function (canvas) {
        var ctx, data;

        if (canvas._png) {
          canvas._png.stopAnimation();
        }

        canvas._png = this;
        canvas.width = this.width;
        canvas.height = this.height;
        ctx = canvas.getContext("2d");

        if (this.animation) {
          this.decodeFrames(ctx);
          return this.animate(ctx);
        } else {
          data = ctx.createImageData(this.width, this.height);
          this.copyToImageData(data, this.decodePixels());
          return ctx.putImageData(data, 0, 0);
        }
      };

      return PNG;
    }();

    global.PNG = PNG;
  })(typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || Function('return typeof this === "object" && this.content')() || Function("return this")()); // `self` is undefined in Firefox for Android content script context
  // while `this` is nsIContentFrameMessageManager
  // with an attribute `content` that corresponds to the window

  /*
   * Extracted from pdf.js
   * https://github.com/andreasgal/pdf.js
   *
   * Copyright (c) 2011 Mozilla Foundation
   *
   * Contributors: Andreas Gal <gal@mozilla.com>
   *               Chris G Jones <cjones@mozilla.com>
   *               Shaon Barman <shaon.barman@gmail.com>
   *               Vivien Nicolas <21@vingtetun.org>
   *               Justin D'Arcangelo <justindarc@gmail.com>
   *               Yury Delendik
   *
   * 
   */
  var DecodeStream = function () {
    function constructor() {
      this.pos = 0;
      this.bufferLength = 0;
      this.eof = false;
      this.buffer = null;
    }

    constructor.prototype = {
      ensureBuffer: function decodestream_ensureBuffer(requested) {
        var buffer = this.buffer;
        var current = buffer ? buffer.byteLength : 0;
        if (requested < current) return buffer;
        var size = 512;

        while (size < requested) size <<= 1;

        var buffer2 = new Uint8Array(size);

        for (var i = 0; i < current; ++i) buffer2[i] = buffer[i];

        return this.buffer = buffer2;
      },
      getByte: function decodestream_getByte() {
        var pos = this.pos;

        while (this.bufferLength <= pos) {
          if (this.eof) return null;
          this.readBlock();
        }

        return this.buffer[this.pos++];
      },
      getBytes: function decodestream_getBytes(length) {
        var pos = this.pos;

        if (length) {
          this.ensureBuffer(pos + length);
          var end = pos + length;

          while (!this.eof && this.bufferLength < end) this.readBlock();

          var bufEnd = this.bufferLength;
          if (end > bufEnd) end = bufEnd;
        } else {
          while (!this.eof) this.readBlock();

          var end = this.bufferLength;
        }

        this.pos = end;
        return this.buffer.subarray(pos, end);
      },
      lookChar: function decodestream_lookChar() {
        var pos = this.pos;

        while (this.bufferLength <= pos) {
          if (this.eof) return null;
          this.readBlock();
        }

        return String.fromCharCode(this.buffer[this.pos]);
      },
      getChar: function decodestream_getChar() {
        var pos = this.pos;

        while (this.bufferLength <= pos) {
          if (this.eof) return null;
          this.readBlock();
        }

        return String.fromCharCode(this.buffer[this.pos++]);
      },
      makeSubStream: function decodestream_makeSubstream(start, length, dict) {
        var end = start + length;

        while (this.bufferLength <= end && !this.eof) this.readBlock();

        return new Stream(this.buffer, start, length, dict);
      },
      skip: function decodestream_skip(n) {
        if (!n) n = 1;
        this.pos += n;
      },
      reset: function decodestream_reset() {
        this.pos = 0;
      }
    };
    return constructor;
  }();

  var FlateStream = function () {
    if (typeof Uint32Array === "undefined") {
      return undefined;
    }

    var codeLenCodeMap = new Uint32Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    var lengthDecode = new Uint32Array([0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a, 0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f, 0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073, 0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102]);
    var distDecode = new Uint32Array([0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d, 0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1, 0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01, 0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001]);
    var fixedLitCodeTab = [new Uint32Array([0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0, 0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0, 0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0, 0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0, 0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8, 0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8, 0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8, 0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8, 0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4, 0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4, 0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4, 0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4, 0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc, 0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec, 0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc, 0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc, 0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2, 0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2, 0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2, 0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2, 0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca, 0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea, 0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da, 0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa, 0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6, 0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6, 0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6, 0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6, 0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce, 0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee, 0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de, 0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe, 0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1, 0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1, 0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1, 0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1, 0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9, 0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9, 0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9, 0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9, 0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5, 0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5, 0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5, 0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5, 0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd, 0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed, 0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd, 0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd, 0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3, 0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3, 0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3, 0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3, 0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb, 0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb, 0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db, 0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb, 0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7, 0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7, 0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7, 0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7, 0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf, 0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef, 0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df, 0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff]), 9];
    var fixedDistCodeTab = [new Uint32Array([0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c, 0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000, 0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d, 0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000]), 5];

    function error(e) {
      throw new Error(e);
    }

    function constructor(bytes) {
      //var bytes = stream.getBytes();
      var bytesPos = 0;
      var cmf = bytes[bytesPos++];
      var flg = bytes[bytesPos++];
      if (cmf == -1 || flg == -1) error("Invalid header in flate stream");
      if ((cmf & 0x0f) != 0x08) error("Unknown compression method in flate stream");
      if (((cmf << 8) + flg) % 31 != 0) error("Bad FCHECK in flate stream");
      if (flg & 0x20) error("FDICT bit set in flate stream");
      this.bytes = bytes;
      this.bytesPos = bytesPos;
      this.codeSize = 0;
      this.codeBuf = 0;
      DecodeStream.call(this);
    }

    constructor.prototype = Object.create(DecodeStream.prototype);

    constructor.prototype.getBits = function (bits) {
      var codeSize = this.codeSize;
      var codeBuf = this.codeBuf;
      var bytes = this.bytes;
      var bytesPos = this.bytesPos;
      var b;

      while (codeSize < bits) {
        if (typeof (b = bytes[bytesPos++]) == "undefined") error("Bad encoding in flate stream");
        codeBuf |= b << codeSize;
        codeSize += 8;
      }

      b = codeBuf & (1 << bits) - 1;
      this.codeBuf = codeBuf >> bits;
      this.codeSize = codeSize -= bits;
      this.bytesPos = bytesPos;
      return b;
    };

    constructor.prototype.getCode = function (table) {
      var codes = table[0];
      var maxLen = table[1];
      var codeSize = this.codeSize;
      var codeBuf = this.codeBuf;
      var bytes = this.bytes;
      var bytesPos = this.bytesPos;

      while (codeSize < maxLen) {
        var b;
        if (typeof (b = bytes[bytesPos++]) == "undefined") error("Bad encoding in flate stream");
        codeBuf |= b << codeSize;
        codeSize += 8;
      }

      var code = codes[codeBuf & (1 << maxLen) - 1];
      var codeLen = code >> 16;
      var codeVal = code & 0xffff;
      if (codeSize == 0 || codeSize < codeLen || codeLen == 0) error("Bad encoding in flate stream");
      this.codeBuf = codeBuf >> codeLen;
      this.codeSize = codeSize - codeLen;
      this.bytesPos = bytesPos;
      return codeVal;
    };

    constructor.prototype.generateHuffmanTable = function (lengths) {
      var n = lengths.length; // find max code length

      var maxLen = 0;

      for (var i = 0; i < n; ++i) {
        if (lengths[i] > maxLen) maxLen = lengths[i];
      } // build the table


      var size = 1 << maxLen;
      var codes = new Uint32Array(size);

      for (var len = 1, code = 0, skip = 2; len <= maxLen; ++len, code <<= 1, skip <<= 1) {
        for (var val = 0; val < n; ++val) {
          if (lengths[val] == len) {
            // bit-reverse the code
            var code2 = 0;
            var t = code;

            for (var i = 0; i < len; ++i) {
              code2 = code2 << 1 | t & 1;
              t >>= 1;
            } // fill the table entries


            for (var i = code2; i < size; i += skip) codes[i] = len << 16 | val;

            ++code;
          }
        }
      }

      return [codes, maxLen];
    };

    constructor.prototype.readBlock = function () {
      function repeat(stream, array, len, offset, what) {
        var repeat = stream.getBits(len) + offset;

        while (repeat-- > 0) array[i++] = what;
      } // read block header


      var hdr = this.getBits(3);
      if (hdr & 1) this.eof = true;
      hdr >>= 1;

      if (hdr == 0) {
        // uncompressed block
        var bytes = this.bytes;
        var bytesPos = this.bytesPos;
        var b;
        if (typeof (b = bytes[bytesPos++]) == "undefined") error("Bad block header in flate stream");
        var blockLen = b;
        if (typeof (b = bytes[bytesPos++]) == "undefined") error("Bad block header in flate stream");
        blockLen |= b << 8;
        if (typeof (b = bytes[bytesPos++]) == "undefined") error("Bad block header in flate stream");
        var check = b;
        if (typeof (b = bytes[bytesPos++]) == "undefined") error("Bad block header in flate stream");
        check |= b << 8;
        if (check != (~blockLen & 0xffff)) error("Bad uncompressed block length in flate stream");
        this.codeBuf = 0;
        this.codeSize = 0;
        var bufferLength = this.bufferLength;
        var buffer = this.ensureBuffer(bufferLength + blockLen);
        var end = bufferLength + blockLen;
        this.bufferLength = end;

        for (var n = bufferLength; n < end; ++n) {
          if (typeof (b = bytes[bytesPos++]) == "undefined") {
            this.eof = true;
            break;
          }

          buffer[n] = b;
        }

        this.bytesPos = bytesPos;
        return;
      }

      var litCodeTable;
      var distCodeTable;

      if (hdr == 1) {
        // compressed block, fixed codes
        litCodeTable = fixedLitCodeTab;
        distCodeTable = fixedDistCodeTab;
      } else if (hdr == 2) {
        // compressed block, dynamic codes
        var numLitCodes = this.getBits(5) + 257;
        var numDistCodes = this.getBits(5) + 1;
        var numCodeLenCodes = this.getBits(4) + 4; // build the code lengths code table

        var codeLenCodeLengths = Array(codeLenCodeMap.length);
        var i = 0;

        while (i < numCodeLenCodes) codeLenCodeLengths[codeLenCodeMap[i++]] = this.getBits(3);

        var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths); // build the literal and distance code tables

        var len = 0;
        var i = 0;
        var codes = numLitCodes + numDistCodes;
        var codeLengths = new Array(codes);

        while (i < codes) {
          var code = this.getCode(codeLenCodeTab);

          if (code == 16) {
            repeat(this, codeLengths, 2, 3, len);
          } else if (code == 17) {
            repeat(this, codeLengths, 3, 3, len = 0);
          } else if (code == 18) {
            repeat(this, codeLengths, 7, 11, len = 0);
          } else {
            codeLengths[i++] = len = code;
          }
        }

        litCodeTable = this.generateHuffmanTable(codeLengths.slice(0, numLitCodes));
        distCodeTable = this.generateHuffmanTable(codeLengths.slice(numLitCodes, codes));
      } else {
        error("Unknown block type in flate stream");
      }

      var buffer = this.buffer;
      var limit = buffer ? buffer.length : 0;
      var pos = this.bufferLength;

      while (true) {
        var code1 = this.getCode(litCodeTable);

        if (code1 < 256) {
          if (pos + 1 >= limit) {
            buffer = this.ensureBuffer(pos + 1);
            limit = buffer.length;
          }

          buffer[pos++] = code1;
          continue;
        }

        if (code1 == 256) {
          this.bufferLength = pos;
          return;
        }

        code1 -= 257;
        code1 = lengthDecode[code1];
        var code2 = code1 >> 16;
        if (code2 > 0) code2 = this.getBits(code2);
        var len = (code1 & 0xffff) + code2;
        code1 = this.getCode(distCodeTable);
        code1 = distDecode[code1];
        code2 = code1 >> 16;
        if (code2 > 0) code2 = this.getBits(code2);
        var dist = (code1 & 0xffff) + code2;

        if (pos + len >= limit) {
          buffer = this.ensureBuffer(pos + len);
          limit = buffer.length;
        }

        for (var k = 0; k < len; ++k, ++pos) buffer[pos] = buffer[pos - dist];
      }
    };

    return constructor;
  }();

  exports.default = jsPDF;
  var _default2 = exports.default;
  function rewire($stub) {
    exports.default = $stub;
  }
  function restore() {
    exports.default = _default2;
  }

  exports.rewire = rewire;
  exports.restore = restore;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
