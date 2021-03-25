/** @license
 *
 * jsPDF - PDF Document creation from JavaScript
 * Version 2.3.1 Built on 2021-03-08T15:44:11.674Z
 *                      CommitID 00000000
 *
 * Copyright (c) 2010-2020 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
 *               2015-2020 yWorks GmbH, http://www.yworks.com
 *               2015-2020 Lukas Holländer <lukas.hollaender@yworks.com>, https://github.com/HackbrettXXX
 *               2016-2018 Aras Abbasi <aras.abbasi@gmail.com>
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
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Contributor(s):
 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
 *    kim3er, mfo, alnorth, Flamenco
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fflate = require('fflate');

var globalObject = (function() {
  return "undefined" !== typeof window
    ? window
    : "undefined" !== typeof global
    ? global
    : "undefined" !== typeof self
    ? self
    : this;
})();

/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * {@link   http://www.phpied.com/rgb-color-parser-in-javascript/}
 * @license Use it if you like it
 */

function RGBColor(color_string) {
  color_string = color_string || "";
  this.ok = false;

  // strip any leading #
  if (color_string.charAt(0) == "#") {
    // remove # if any
    color_string = color_string.substr(1, 6);
  }

  color_string = color_string.replace(/ /g, "");
  color_string = color_string.toLowerCase();

  var channels;

  // before getting into regexps, try simple matches
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
  color_string = simple_colors[color_string] || color_string;

  // array of color definition objects
  var color_defs = [
    {
      re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
      example: ["rgb(123, 234, 45)", "rgb(255,234,245)"],
      process: function(bits) {
        return [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3])];
      }
    },
    {
      re: /^(\w{2})(\w{2})(\w{2})$/,
      example: ["#00ff00", "336699"],
      process: function(bits) {
        return [
          parseInt(bits[1], 16),
          parseInt(bits[2], 16),
          parseInt(bits[3], 16)
        ];
      }
    },
    {
      re: /^(\w{1})(\w{1})(\w{1})$/,
      example: ["#fb0", "f0f"],
      process: function(bits) {
        return [
          parseInt(bits[1] + bits[1], 16),
          parseInt(bits[2] + bits[2], 16),
          parseInt(bits[3] + bits[3], 16)
        ];
      }
    }
  ];

  // search through the definitions to find a match
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
  }

  // validate/cleanup values
  this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r;
  this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g;
  this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b;

  // some getters
  this.toRGB = function() {
    return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
  };
  this.toHex = function() {
    var r = this.r.toString(16);
    var g = this.g.toString(16);
    var b = this.b.toString(16);
    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;
    return "#" + r + g + b;
  };
}

var atob, btoa;

(function() {

  atob = require("atob");
  btoa = require("btoa");
})();

function consoleLog() {
  if (globalObject.console && typeof globalObject.console.log === "function") {
    globalObject.console.log.apply(globalObject.console, arguments);
  }
}

function consoleWarn(str) {
  if (globalObject.console) {
    if (typeof globalObject.console.warn === "function") {
      globalObject.console.warn.apply(globalObject.console, arguments);
    } else {
      consoleLog.call(null, arguments);
    }
  }
}

function consoleError(str) {
  if (globalObject.console) {
    if (typeof globalObject.console.error === "function") {
      globalObject.console.error.apply(globalObject.console, arguments);
    } else {
      consoleLog(str);
    }
  }
}
var console = {
  log: consoleLog,
  warn: consoleWarn,
  error: consoleError
};

/**
 * @license
 * Joseph Myers does not specify a particular license for his work.
 *
 * Author: Joseph Myers
 * Accessed from: http://www.myersdaily.org/joseph/javascript/md5.js
 *
 * Modified by: Owen Leong
 */

function md5cycle(x, k) {
  var a = x[0],
    b = x[1],
    c = x[2],
    d = x[3];

  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);

  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);

  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);

  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);

  x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);
}

function cmn(q, a, b, x, s, t) {
  a = add32(add32(a, q), add32(x, t));
  return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
  return cmn((b & c) | (~b & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
  return cmn((b & d) | (c & ~d), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | ~d), a, b, x, s, t);
}

function md51(s) {
  // txt = '';
  var n = s.length,
    state = [1732584193, -271733879, -1732584194, 271733878],
    i;
  for (i = 64; i <= s.length; i += 64) {
    md5cycle(state, md5blk(s.substring(i - 64, i)));
  }
  s = s.substring(i - 64);
  var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 0; i < s.length; i++)
    tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
  tail[i >> 2] |= 0x80 << (i % 4 << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  return state;
}

/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */
function md5blk(s) {
  /* I figured global was faster.   */
  var md5blks = [],
    i; /* Andy King said do it this way. */
  for (i = 0; i < 64; i += 4) {
    md5blks[i >> 2] =
      s.charCodeAt(i) +
      (s.charCodeAt(i + 1) << 8) +
      (s.charCodeAt(i + 2) << 16) +
      (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}

var hex_chr = "0123456789abcdef".split("");

function rhex(n) {
  var s = "",
    j = 0;
  for (; j < 4; j++)
    s += hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f];
  return s;
}

function hex(x) {
  for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]);
  return x.join("");
}

// Converts a 4-byte number to byte string
function singleToByteString(n) {
  return String.fromCharCode(
    (n & 0xff) >> 0,
    (n & 0xff00) >> 8,
    (n & 0xff0000) >> 16,
    (n & 0xff000000) >> 24
  );
}

// Converts an array of numbers to a byte string
function toByteString(x) {
  return x.map(singleToByteString).join("");
}

// Returns the MD5 hash as a byte string
function md5Bin(s) {
  return toByteString(md51(s));
}

// Returns MD5 hash as a hex string
function md5(s) {
  return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
  return (a + b) & 0xffffffff;
}

if (md5("hello") != "5d41402abc4b2a76b9719d911017c592") {
  function add32(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff),
      msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
}

/**
 * @license
 * FPDF is released under a permissive license: there is no usage restriction.
 * You may embed it freely in your application (commercial or not), with or
 * without modifications.
 *
 * Reference: http://www.fpdf.org/en/script/script37.php
 */

function repeat(str, num) {
  return new Array(num + 1).join(str);
}

/**
 * Converts a byte string to a hex string
 *
 * @name rc4
 * @function
 * @param {string} key Byte string of encryption key
 * @param {string} data Byte string of data to be encrypted
 * @returns {string} Encrypted string
 */
function rc4(key, data) {
  var lastKey, lastState;
  if (key !== lastKey) {
    var k = repeat(key, ((256 / key.length) >> 0) + 1);
    var state = [];
    for (var i = 0; i < 256; i++) {
      state[i] = i;
    }
    var j = 0;
    for (var i = 0; i < 256; i++) {
      var t = state[i];
      j = (j + t + k.charCodeAt(i)) % 256;
      state[i] = state[j];
      state[j] = t;
    }
    lastKey = key;
    lastState = state;
  } else {
    state = lastState;
  }
  var length = data.length;
  var a = 0;
  var b = 0;
  var out = "";
  for (var i = 0; i < length; i++) {
    a = (a + 1) % 256;
    t = state[a];
    b = (b + t) % 256;
    state[a] = state[b];
    state[b] = t;
    k = state[(state[a] + state[b]) % 256];
    out += String.fromCharCode(data.charCodeAt(i) ^ k);
  }
  return out;
}

/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 * Author: Owen Leong (@owenl131)
 * Date: 15 Oct 2020
 * References:
 * https://www.cs.cmu.edu/~dst/Adobe/Gallery/anon21jul01-pdf-encryption.txt
 * https://github.com/foliojs/pdfkit/blob/master/lib/security.js
 * http://www.fpdf.org/en/script/script37.php
 */

var permissionOptions = {
  print: 4,
  modify: 8,
  copy: 16,
  "annot-forms": 32
};

/**
 * Initializes encryption settings
 *
 * @name constructor
 * @function
 * @param {Array} permissions Permissions allowed for user, "print", "modify", "copy" and "annot-forms".
 * @param {String} userPassword Permissions apply to this user. Leaving this empty means the document
 *                              is not password protected but viewer has the above permissions.
 * @param {String} ownerPassword Owner has full functionalities to the file.
 * @param {String} fileId As hex string, should be same as the file ID in the trailer.
 * @example
 * var security = new PDFSecurity(["print"])
 */
function PDFSecurity(permissions, userPassword, ownerPassword, fileId) {
  this.v = 1; // algorithm 1, future work can add in more recent encryption schemes
  this.r = 2; // revision 2

  // set flags for what functionalities the user can access
  let protection = 192;
  permissions.forEach(function(perm) {
    if (typeof permissionOptions.perm !== "undefined") {
      throw new Error("Invalid permission: " + perm);
    }
    protection += permissionOptions[perm];
  });

  // padding is used to pad the passwords to 32 bytes, also is hashed and stored in the final PDF
  this.padding =
    "\x28\xBF\x4E\x5E\x4E\x75\x8A\x41\x64\x00\x4E\x56\xFF\xFA\x01\x08" +
    "\x2E\x2E\x00\xB6\xD0\x68\x3E\x80\x2F\x0C\xA9\xFE\x64\x53\x69\x7A";
  let paddedUserPassword = (userPassword + this.padding).substr(0, 32);
  let paddedOwnerPassword = (ownerPassword + this.padding).substr(0, 32);

  this.O = this.processOwnerPassword(paddedUserPassword, paddedOwnerPassword);
  this.P = -((protection ^ 255) + 1);
  this.encryptionKey = md5Bin(
    paddedUserPassword +
      this.O +
      this.lsbFirstWord(this.P) +
      this.hexToBytes(fileId)
  ).substr(0, 5);
  this.U = rc4(this.encryptionKey, this.padding);
}

/**
 * Breaks down a 4-byte number into its individual bytes, with the least significant bit first
 *
 * @name lsbFirstWord
 * @function
 * @param {number} data 32-bit number
 * @returns {Array}
 */
PDFSecurity.prototype.lsbFirstWord = function(data) {
  return String.fromCharCode(
    (data >> 0) & 0xff,
    (data >> 8) & 0xff,
    (data >> 16) & 0xff,
    (data >> 24) & 0xff
  );
};

/**
 * Converts a byte string to a hex string
 *
 * @name toHexString
 * @function
 * @param {String} byteString Byte string
 * @returns {String}
 */
PDFSecurity.prototype.toHexString = function(byteString) {
  return byteString
    .split("")
    .map(function(byte) {
      return ("0" + (byte.charCodeAt(0) & 0xff).toString(16)).slice(-2);
    })
    .join("");
};

/**
 * Converts a hex string to a byte string
 *
 * @name hexToBytes
 * @function
 * @param {String} hex Hex string
 * @returns {String}
 */
PDFSecurity.prototype.hexToBytes = function(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(String.fromCharCode(parseInt(hex.substr(c, 2), 16)));
  return bytes.join("");
};

/**
 * Computes the 'O' field in the encryption dictionary
 *
 * @name processOwnerPassword
 * @function
 * @param {String} paddedUserPassword Byte string of padded user password
 * @param {String} paddedOwnerPassword Byte string of padded owner password
 * @returns {String}
 */
PDFSecurity.prototype.processOwnerPassword = function(
  paddedUserPassword,
  paddedOwnerPassword
) {
  let key = md5Bin(paddedOwnerPassword).substr(0, 5);
  return rc4(key, paddedUserPassword);
};

/**
 * Returns an encryptor function which can take in a byte string and returns the encrypted version
 *
 * @name encryptor
 * @function
 * @param {number} objectId
 * @param {number} generation Not sure what this is for, you can set it to 0
 * @returns {Function}
 * @example
 * out("stream");
 * encryptor = security.encryptor(object.id, 0);
 * out(encryptor(data));
 * out("endstream");
 */
PDFSecurity.prototype.encryptor = function(objectId, generation) {
  let key = md5Bin(
    this.encryptionKey +
      String.fromCharCode(
        objectId & 0xff,
        (objectId >> 8) & 0xff,
        (objectId >> 16) & 0xff,
        generation & 0xff,
        (generation >> 8) & 0xff
      )
  ).substr(0, 10);
  return function(data) {
    return rc4(key, data);
  };
};

/* eslint-disable no-console */

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
  if (typeof context !== "object") {
    throw new Error(
      "Invalid Context passed to initialize PubSub (jsPDF-module)"
    );
  }
  var topics = {};

  this.subscribe = function(topic, callback, once) {
    once = once || false;
    if (
      typeof topic !== "string" ||
      typeof callback !== "function" ||
      typeof once !== "boolean"
    ) {
      throw new Error(
        "Invalid arguments passed to PubSub.subscribe (jsPDF-module)"
      );
    }

    if (!topics.hasOwnProperty(topic)) {
      topics[topic] = {};
    }

    var token = Math.random().toString(35);
    topics[topic][token] = [callback, !!once];

    return token;
  };

  this.unsubscribe = function(token) {
    for (var topic in topics) {
      if (topics[topic][token]) {
        delete topics[topic][token];
        if (Object.keys(topics[topic]).length === 0) {
          delete topics[topic];
        }
        return true;
      }
    }
    return false;
  };

  this.publish = function(topic) {
    if (topics.hasOwnProperty(topic)) {
      var args = Array.prototype.slice.call(arguments, 1),
        tokens = [];

      for (var token in topics[topic]) {
        var sub = topics[topic][token];
        try {
          sub[0].apply(context, args);
        } catch (ex) {
          if (globalObject.console) {
            console.error("jsPDF PubSub Error", ex.message, ex);
          }
        }
        if (sub[1]) tokens.push(token);
      }
      if (tokens.length) tokens.forEach(this.unsubscribe);
    }
  };

  this.getTopics = function() {
    return topics;
  };
}

function GState(parameters) {
  if (!(this instanceof GState)) {
    return new GState(parameters);
  }

  /**
   * @name GState#opacity
   * @type {any}
   */
  /**
   * @name GState#stroke-opacity
   * @type {any}
   */
  var supported = "opacity,stroke-opacity".split(",");
  for (var p in parameters) {
    if (parameters.hasOwnProperty(p) && supported.indexOf(p) >= 0) {
      this[p] = parameters[p];
    }
  }
  /**
   * @name GState#id
   * @type {string}
   */
  this.id = ""; // set by addGState()
  /**
   * @name GState#objectNumber
   * @type {number}
   */
  this.objectNumber = -1; // will be set by putGState()
}

GState.prototype.equals = function equals(other) {
  var ignore = "id,objectNumber,equals";
  var p;
  if (!other || typeof other !== typeof this) return false;
  var count = 0;
  for (p in this) {
    if (ignore.indexOf(p) >= 0) continue;
    if (this.hasOwnProperty(p) && !other.hasOwnProperty(p)) return false;
    if (this[p] !== other[p]) return false;
    count++;
  }
  for (p in other) {
    if (other.hasOwnProperty(p) && ignore.indexOf(p) < 0) count--;
  }
  return count === 0;
};

function Pattern(gState, matrix) {
  this.gState = gState;
  this.matrix = matrix;

  this.id = ""; // set by addPattern()
  this.objectNumber = -1; // will be set by putPattern()
}

function ShadingPattern(type, coords, colors, gState, matrix) {
  if (!(this instanceof ShadingPattern)) {
    return new ShadingPattern(type, coords, colors, gState, matrix);
  }

  // see putPattern() for information how they are realized
  this.type = type === "axial" ? 2 : 3;
  this.coords = coords;
  this.colors = colors;

  Pattern.call(this, gState, matrix);
}

function TilingPattern(boundingBox, xStep, yStep, gState, matrix) {
  if (!(this instanceof TilingPattern)) {
    return new TilingPattern(boundingBox, xStep, yStep, gState, matrix);
  }

  this.boundingBox = boundingBox;
  this.xStep = xStep;
  this.yStep = yStep;

  this.stream = ""; // set by endTilingPattern();

  this.cloneIndex = 0;

  Pattern.call(this, gState, matrix);
}

/**
 * Creates new jsPDF document object instance.
 * @name jsPDF
 * @class
 * @param {Object} [options] - Collection of settings initializing the jsPDF-instance
 * @param {string} [options.orientation=portrait] - Orientation of the first page. Possible values are "portrait" or "landscape" (or shortcuts "p" or "l").<br />
 * @param {string} [options.unit=mm] Measurement unit (base unit) to be used when coordinates are specified.<br />
 * Possible values are "pt" (points), "mm", "cm", "m", "in" or "px". Note that in order to get the correct scaling for "px"
 * units, you need to enable the hotfix "px_scaling" by setting options.hotfixes = ["px_scaling"].
 * @param {string/Array} [options.format=a4] The format of the first page. Can be:<ul><li>a0 - a10</li><li>b0 - b10</li><li>c0 - c10</li><li>dl</li><li>letter</li><li>government-letter</li><li>legal</li><li>junior-legal</li><li>ledger</li><li>tabloid</li><li>credit-card</li></ul><br />
 * Default is "a4". If you want to use your own format just pass instead of one of the above predefined formats the size as an number-array, e.g. [595.28, 841.89]
 * @param {boolean} [options.putOnlyUsedFonts=false] Only put fonts into the PDF, which were used.
 * @param {boolean} [options.compress=false] Compress the generated PDF.
 * @param {number} [options.precision=16] Precision of the element-positions.
 * @param {number} [options.userUnit=1.0] Not to be confused with the base unit. Please inform yourself before you use it.
 * @param {string[]} [options.hotfixes] An array of strings to enable hotfixes such as correct pixel scaling.
 * @param {Object} [options.encryption]
 * @param {string} [options.encryption.userPassword] Password for the user bound by the given permissions list.
 * @param {string} [options.encryption.ownerPassword] Both userPassword and ownerPassword should be set for proper authentication.
 * @param {string[]} [options.encryption.userPermissions] Array of permissions "print", "modify", "copy", "annot-forms", accessible by the user.
 * @param {number|"smart"} [options.floatPrecision=16]
 * @returns {jsPDF} jsPDF-instance
 * @description
 * ```
 * {
 *  orientation: 'p',
 *  unit: 'mm',
 *  format: 'a4',
 *  putOnlyUsedFonts:true,
 *  floatPrecision: 16 // or "smart", default is 16
 * }
 * ```
 *
 * @constructor
 */
function jsPDF(options) {
  var orientation = typeof arguments[0] === "string" ? arguments[0] : "p";
  var unit = arguments[1];
  var format = arguments[2];
  var compressPdf = arguments[3];
  var filters = [];
  var userUnit = 1.0;
  var precision;
  var floatPrecision = 16;
  var defaultPathOperation = "S";
  var encryptionOptions = null;

  options = options || {};

  if (typeof options === "object") {
    orientation = options.orientation;
    unit = options.unit || unit;
    format = options.format || format;
    compressPdf = options.compress || options.compressPdf || compressPdf;
    encryptionOptions = options.encryption || null;
    if (encryptionOptions !== null) {
      encryptionOptions.userPassword = encryptionOptions.userPassword || "";
      encryptionOptions.ownerPassword = encryptionOptions.ownerPassword || "";
      encryptionOptions.userPermissions =
        encryptionOptions.userPermissions || [];
    }
    userUnit =
      typeof options.userUnit === "number" ? Math.abs(options.userUnit) : 1.0;
    if (typeof options.precision !== "undefined") {
      precision = options.precision;
    }
    if (typeof options.floatPrecision !== "undefined") {
      floatPrecision = options.floatPrecision;
    }
    defaultPathOperation = options.defaultPathOperation || "S";
  }

  filters =
    options.filters || (compressPdf === true ? ["FlateEncode"] : filters);

  unit = unit || "mm";
  orientation = ("" + (orientation || "P")).toLowerCase();
  var putOnlyUsedFonts = options.putOnlyUsedFonts || false;
  var usedFonts = {};

  var API = {
    internal: {},
    __private__: {}
  };

  API.__private__.PubSub = PubSub;

  var pdfVersion = "1.3";
  var getPdfVersion = (API.__private__.getPdfVersion = function() {
    return pdfVersion;
  });

  API.__private__.setPdfVersion = function(value) {
    pdfVersion = value;
  };

  // Size in pt of various paper formats
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
  };

  API.__private__.getPageFormats = function() {
    return pageFormats;
  };

  var getPageFormat = (API.__private__.getPageFormat = function(value) {
    return pageFormats[value];
  });

  format = format || "a4";

  var ApiMode = {
    COMPAT: "compat",
    ADVANCED: "advanced"
  };
  var apiMode = ApiMode.COMPAT;

  function advancedAPI() {
    // prepend global change of basis matrix
    // (Now, instead of converting every coordinate to the pdf coordinate system, we apply a matrix
    // that does this job for us (however, texts, images and similar objects must be drawn bottom up))
    this.saveGraphicsState();
    out(
      new Matrix(
        scaleFactor,
        0,
        0,
        -scaleFactor,
        0,
        getPageHeight() * scaleFactor
      ).toString() + " cm"
    );
    this.setFontSize(this.getFontSize() / scaleFactor);

    // The default in MrRio's implementation is "S" (stroke), whereas the default in the yWorks implementation
    // was "n" (none). Although this has nothing to do with transforms, we should use the API switch here.
    defaultPathOperation = "n";

    apiMode = ApiMode.ADVANCED;
  }

  function compatAPI() {
    this.restoreGraphicsState();
    defaultPathOperation = "S";
    apiMode = ApiMode.COMPAT;
  }

  /**
   * @function combineFontStyleAndFontWeight
   * @param {string} fontStyle Fontstyle or variant. Example: "italic".
   * @param {number | string} fontWeight Weight of the Font. Example: "normal" | 400
   * @returns {string}
   * @private
   */
  var combineFontStyleAndFontWeight = function(fontStyle, fontWeight) {
    if (
      (fontStyle == "bold" && fontWeight == "normal") ||
      (fontStyle == "bold" && fontWeight == 400) ||
      (fontStyle == "normal" && fontWeight == "italic") ||
      (fontStyle == "bold" && fontWeight == "italic")
    ) {
      throw new Error("Invalid Combination of fontweight and fontstyle");
    }
    if (fontWeight && fontStyle !== fontWeight) {
      //if fontstyle is normal and fontweight is normal too no need to append the font-weight
      fontStyle =
        fontWeight == 400
          ? fontStyle == "italic"
            ? "italic"
            : "normal"
          : fontWeight == 700 && fontStyle !== "italic"
          ? "bold"
          : fontStyle + "" + fontWeight;
    }
    return fontStyle;
  };

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
   * @memberof jsPDF#
   * @name advancedAPI
   */
  API.advancedAPI = function(body) {
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
   * @memberof jsPDF#
   * @name compatApi
   */
  API.compatAPI = function(body) {
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
   * @memberof jsPDF#
   * @name isAdvancedAPI
   */
  API.isAdvancedAPI = function() {
    return apiMode === ApiMode.ADVANCED;
  };

  var advancedApiModeTrap = function(methodName) {
    if (apiMode !== ApiMode.ADVANCED) {
      throw new Error(
        methodName +
          " is only available in 'advanced' API mode. " +
          "You need to call advancedAPI() first."
      );
    }
  };

  var roundToPrecision = (API.roundToPrecision = API.__private__.roundToPrecision = function(
    number,
    parmPrecision
  ) {
    var tmpPrecision = precision || parmPrecision;
    if (isNaN(number) || isNaN(tmpPrecision)) {
      throw new Error("Invalid argument passed to jsPDF.roundToPrecision");
    }
    return number.toFixed(tmpPrecision).replace(/0+$/, "");
  });

  // high precision float
  var hpf;
  if (typeof floatPrecision === "number") {
    hpf = API.hpf = API.__private__.hpf = function(number) {
      if (isNaN(number)) {
        throw new Error("Invalid argument passed to jsPDF.hpf");
      }
      return roundToPrecision(number, floatPrecision);
    };
  } else if (floatPrecision === "smart") {
    hpf = API.hpf = API.__private__.hpf = function(number) {
      if (isNaN(number)) {
        throw new Error("Invalid argument passed to jsPDF.hpf");
      }
      if (number > -1 && number < 1) {
        return roundToPrecision(number, 16);
      } else {
        return roundToPrecision(number, 5);
      }
    };
  } else {
    hpf = API.hpf = API.__private__.hpf = function(number) {
      if (isNaN(number)) {
        throw new Error("Invalid argument passed to jsPDF.hpf");
      }
      return roundToPrecision(number, 16);
    };
  }
  var f2 = (API.f2 = API.__private__.f2 = function(number) {
    if (isNaN(number)) {
      throw new Error("Invalid argument passed to jsPDF.f2");
    }
    return roundToPrecision(number, 2);
  });

  var f3 = (API.__private__.f3 = function(number) {
    if (isNaN(number)) {
      throw new Error("Invalid argument passed to jsPDF.f3");
    }
    return roundToPrecision(number, 3);
  });

  var scale = (API.scale = API.__private__.scale = function(number) {
    if (isNaN(number)) {
      throw new Error("Invalid argument passed to jsPDF.scale");
    }
    if (apiMode === ApiMode.COMPAT) {
      return number * scaleFactor;
    } else if (apiMode === ApiMode.ADVANCED) {
      return number;
    }
  });

  var transformY = function(y) {
    if (apiMode === ApiMode.COMPAT) {
      return getPageHeight() - y;
    } else if (apiMode === ApiMode.ADVANCED) {
      return y;
    }
  };

  var transformScaleY = function(y) {
    return scale(transformY(y));
  };

  /**
   * @name setPrecision
   * @memberof jsPDF#
   * @function
   * @instance
   * @param {string} precision
   * @returns {jsPDF}
   */
  API.__private__.setPrecision = API.setPrecision = function(value) {
    if (typeof parseInt(value, 10) === "number") {
      precision = parseInt(value, 10);
    }
  };

  var fileId = "00000000000000000000000000000000";

  var getFileId = (API.__private__.getFileId = function() {
    return fileId;
  });

  var setFileId = (API.__private__.setFileId = function(value) {
    if (typeof value !== "undefined" && /^[a-fA-F0-9]{32}$/.test(value)) {
      fileId = value.toUpperCase();
    } else {
      fileId = fileId
        .split("")
        .map(function() {
          return "ABCDEF0123456789".charAt(Math.floor(Math.random() * 16));
        })
        .join("");
    }

    if (encryptionOptions !== null) {
      encryption = new PDFSecurity(
        encryptionOptions.userPermissions,
        encryptionOptions.userPassword,
        encryptionOptions.ownerPassword,
        fileId
      );
    }
    return fileId;
  });

  /**
   * @name setFileId
   * @memberof jsPDF#
   * @function
   * @instance
   * @param {string} value GUID.
   * @returns {jsPDF}
   */
  API.setFileId = function(value) {
    setFileId(value);
    return this;
  };

  /**
   * @name getFileId
   * @memberof jsPDF#
   * @function
   * @instance
   *
   * @returns {string} GUID.
   */
  API.getFileId = function() {
    return getFileId();
  };

  var creationDate;

  var convertDateToPDFDate = (API.__private__.convertDateToPDFDate = function(
    parmDate
  ) {
    var result = "";
    var tzoffset = parmDate.getTimezoneOffset(),
      tzsign = tzoffset < 0 ? "+" : "-",
      tzhour = Math.floor(Math.abs(tzoffset / 60)),
      tzmin = Math.abs(tzoffset % 60),
      timeZoneString = [tzsign, padd2(tzhour), "'", padd2(tzmin), "'"].join("");

    result = [
      "D:",
      parmDate.getFullYear(),
      padd2(parmDate.getMonth() + 1),
      padd2(parmDate.getDate()),
      padd2(parmDate.getHours()),
      padd2(parmDate.getMinutes()),
      padd2(parmDate.getSeconds()),
      timeZoneString
    ].join("");
    return result;
  });

  var convertPDFDateToDate = (API.__private__.convertPDFDateToDate = function(
    parmPDFDate
  ) {
    var year = parseInt(parmPDFDate.substr(2, 4), 10);
    var month = parseInt(parmPDFDate.substr(6, 2), 10) - 1;
    var date = parseInt(parmPDFDate.substr(8, 2), 10);
    var hour = parseInt(parmPDFDate.substr(10, 2), 10);
    var minutes = parseInt(parmPDFDate.substr(12, 2), 10);
    var seconds = parseInt(parmPDFDate.substr(14, 2), 10);
    // var timeZoneHour = parseInt(parmPDFDate.substr(16, 2), 10);
    // var timeZoneMinutes = parseInt(parmPDFDate.substr(20, 2), 10);

    var resultingDate = new Date(year, month, date, hour, minutes, seconds, 0);
    return resultingDate;
  });

  var setCreationDate = (API.__private__.setCreationDate = function(date) {
    var tmpCreationDateString;
    var regexPDFCreationDate = /^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|-0[0-9]|-1[0-1])'(0[0-9]|[1-5][0-9])'?$/;
    if (typeof date === "undefined") {
      date = new Date();
    }

    if (date instanceof Date) {
      tmpCreationDateString = convertDateToPDFDate(date);
    } else if (regexPDFCreationDate.test(date)) {
      tmpCreationDateString = date;
    } else {
      throw new Error("Invalid argument passed to jsPDF.setCreationDate");
    }
    creationDate = tmpCreationDateString;
    return creationDate;
  });

  var getCreationDate = (API.__private__.getCreationDate = function(type) {
    var result = creationDate;
    if (type === "jsDate") {
      result = convertPDFDateToDate(creationDate);
    }
    return result;
  });

  /**
   * @name setCreationDate
   * @memberof jsPDF#
   * @function
   * @instance
   * @param {Object} date
   * @returns {jsPDF}
   */
  API.setCreationDate = function(date) {
    setCreationDate(date);
    return this;
  };

  /**
   * @name getCreationDate
   * @memberof jsPDF#
   * @function
   * @instance
   * @param {Object} type
   * @returns {Object}
   */
  API.getCreationDate = function(type) {
    return getCreationDate(type);
  };

  var padd2 = (API.__private__.padd2 = function(number) {
    return ("0" + parseInt(number)).slice(-2);
  });

  var padd2Hex = (API.__private__.padd2Hex = function(hexString) {
    hexString = hexString.toString();
    return ("00" + hexString).substr(hexString.length);
  });

  var objectNumber = 0; // 'n' Current object number
  var offsets = []; // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
  var content = [];
  var contentLength = 0;
  var additionalObjects = [];

  var pages = [];
  var currentPage;
  var hasCustomDestination = false;
  var outputDestination = content;

  var resetDocument = function() {
    //reset fields relevant for objectNumber generation and xref.
    objectNumber = 0;
    contentLength = 0;
    content = [];
    offsets = [];
    additionalObjects = [];

    rootDictionaryObjId = newObjectDeferred();
    resourceDictionaryObjId = newObjectDeferred();
  };

  API.__private__.setCustomOutputDestination = function(destination) {
    hasCustomDestination = true;
    outputDestination = destination;
  };
  var setOutputDestination = function(destination) {
    if (!hasCustomDestination) {
      outputDestination = destination;
    }
  };

  API.__private__.resetCustomOutputDestination = function() {
    hasCustomDestination = false;
    outputDestination = content;
  };

  var out = (API.__private__.out = function(string) {
    string = string.toString();
    contentLength += string.length + 1;
    outputDestination.push(string);

    return outputDestination;
  });

  var write = (API.__private__.write = function(value) {
    return out(
      arguments.length === 1
        ? value.toString()
        : Array.prototype.join.call(arguments, " ")
    );
  });

  var getArrayBuffer = (API.__private__.getArrayBuffer = function(data) {
    var len = data.length,
      ab = new ArrayBuffer(len),
      u8 = new Uint8Array(ab);

    while (len--) u8[len] = data.charCodeAt(len);
    return ab;
  });

  var standardFonts = [
    ["Helvetica", "helvetica", "normal", "WinAnsiEncoding"],
    ["Helvetica-Bold", "helvetica", "bold", "WinAnsiEncoding"],
    ["Helvetica-Oblique", "helvetica", "italic", "WinAnsiEncoding"],
    ["Helvetica-BoldOblique", "helvetica", "bolditalic", "WinAnsiEncoding"],
    ["Courier", "courier", "normal", "WinAnsiEncoding"],
    ["Courier-Bold", "courier", "bold", "WinAnsiEncoding"],
    ["Courier-Oblique", "courier", "italic", "WinAnsiEncoding"],
    ["Courier-BoldOblique", "courier", "bolditalic", "WinAnsiEncoding"],
    ["Times-Roman", "times", "normal", "WinAnsiEncoding"],
    ["Times-Bold", "times", "bold", "WinAnsiEncoding"],
    ["Times-Italic", "times", "italic", "WinAnsiEncoding"],
    ["Times-BoldItalic", "times", "bolditalic", "WinAnsiEncoding"],
    ["ZapfDingbats", "zapfdingbats", "normal", null],
    ["Symbol", "symbol", "normal", null]
  ];

  API.__private__.getStandardFonts = function() {
    return standardFonts;
  };

  var activeFontSize = options.fontSize || 16;

  /**
   * Sets font size for upcoming text elements.
   *
   * @param {number} size Font size in points.
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setFontSize
   */
  API.__private__.setFontSize = API.setFontSize = function(size) {
    if (apiMode === ApiMode.ADVANCED) {
      activeFontSize = size / scaleFactor;
    } else {
      activeFontSize = size;
    }
    return this;
  };

  /**
   * Gets the fontsize for upcoming text elements.
   *
   * @function
   * @instance
   * @returns {number}
   * @memberof jsPDF#
   * @name getFontSize
   */
  var getFontSize = (API.__private__.getFontSize = API.getFontSize = function() {
    if (apiMode === ApiMode.COMPAT) {
      return activeFontSize;
    } else {
      return activeFontSize * scaleFactor;
    }
  });

  var R2L = options.R2L || false;

  /**
   * Set value of R2L functionality.
   *
   * @param {boolean} value
   * @function
   * @instance
   * @returns {jsPDF} jsPDF-instance
   * @memberof jsPDF#
   * @name setR2L
   */
  API.__private__.setR2L = API.setR2L = function(value) {
    R2L = value;
    return this;
  };

  /**
   * Get value of R2L functionality.
   *
   * @function
   * @instance
   * @returns {boolean} jsPDF-instance
   * @memberof jsPDF#
   * @name getR2L
   */
  API.__private__.getR2L = API.getR2L = function() {
    return R2L;
  };

  var zoomMode; // default: 1;

  var setZoomMode = (API.__private__.setZoomMode = function(zoom) {
    var validZoomModes = [
      undefined,
      null,
      "fullwidth",
      "fullheight",
      "fullpage",
      "original"
    ];

    if (/^\d*\.?\d*%$/.test(zoom)) {
      zoomMode = zoom;
    } else if (!isNaN(zoom)) {
      zoomMode = parseInt(zoom, 10);
    } else if (validZoomModes.indexOf(zoom) !== -1) {
      zoomMode = zoom;
    } else {
      throw new Error(
        'zoom must be Integer (e.g. 2), a percentage Value (e.g. 300%) or fullwidth, fullheight, fullpage, original. "' +
          zoom +
          '" is not recognized.'
      );
    }
  });

  API.__private__.getZoomMode = function() {
    return zoomMode;
  };

  var pageMode; // default: 'UseOutlines';
  var setPageMode = (API.__private__.setPageMode = function(pmode) {
    var validPageModes = [
      undefined,
      null,
      "UseNone",
      "UseOutlines",
      "UseThumbs",
      "FullScreen"
    ];

    if (validPageModes.indexOf(pmode) == -1) {
      throw new Error(
        'Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "' +
          pmode +
          '" is not recognized.'
      );
    }
    pageMode = pmode;
  });

  API.__private__.getPageMode = function() {
    return pageMode;
  };

  var layoutMode; // default: 'continuous';
  var setLayoutMode = (API.__private__.setLayoutMode = function(layout) {
    var validLayoutModes = [
      undefined,
      null,
      "continuous",
      "single",
      "twoleft",
      "tworight",
      "two"
    ];

    if (validLayoutModes.indexOf(layout) == -1) {
      throw new Error(
        'Layout mode must be one of continuous, single, twoleft, tworight. "' +
          layout +
          '" is not recognized.'
      );
    }
    layoutMode = layout;
  });

  API.__private__.getLayoutMode = function() {
    return layoutMode;
  };

  /**
   * Set the display mode options of the page like zoom and layout.
   *
   * @name setDisplayMode
   * @memberof jsPDF#
   * @function
   * @instance
   * @param {integer|String} zoom   You can pass an integer or percentage as
   * a string. 2 will scale the document up 2x, '200%' will scale up by the
   * same amount. You can also set it to 'fullwidth', 'fullheight',
   * 'fullpage', or 'original'.
   *
   * Only certain PDF readers support this, such as Adobe Acrobat.
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
   */
  API.__private__.setDisplayMode = API.setDisplayMode = function(
    zoom,
    layout,
    pmode
  ) {
    setZoomMode(zoom);
    setLayoutMode(layout);
    setPageMode(pmode);
    return this;
  };

  var documentProperties = {
    title: "",
    subject: "",
    author: "",
    keywords: "",
    creator: ""
  };

  API.__private__.getDocumentProperty = function(key) {
    if (Object.keys(documentProperties).indexOf(key) === -1) {
      throw new Error("Invalid argument passed to jsPDF.getDocumentProperty");
    }
    return documentProperties[key];
  };

  API.__private__.getDocumentProperties = function() {
    return documentProperties;
  };

  /**
   * Adds a properties to the PDF document.
   *
   * @param {Object} A property_name-to-property_value object structure.
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setDocumentProperties
   */
  API.__private__.setDocumentProperties = API.setProperties = API.setDocumentProperties = function(
    properties
  ) {
    // copying only those properties we can render.
    for (var property in documentProperties) {
      if (documentProperties.hasOwnProperty(property) && properties[property]) {
        documentProperties[property] = properties[property];
      }
    }
    return this;
  };

  API.__private__.setDocumentProperty = function(key, value) {
    if (Object.keys(documentProperties).indexOf(key) === -1) {
      throw new Error("Invalid arguments passed to jsPDF.setDocumentProperty");
    }
    return (documentProperties[key] = value);
  };

  var fonts = {}; // collection of font objects, where key is fontKey - a dynamically created label for a given font.
  var fontmap = {}; // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
  var activeFontKey; // will be string representing the KEY of the font as combination of fontName + fontStyle
  var fontStateStack = []; //
  var patterns = {}; // collection of pattern objects
  var patternMap = {}; // see fonts
  var gStates = {}; // collection of graphic state objects
  var gStatesMap = {}; // see fonts
  var activeGState = null;
  var scaleFactor; // Scale factor
  var page = 0;
  var pagesContext = [];
  var events = new PubSub(API);
  var hotfixes = options.hotfixes || [];

  var renderTargets = {};
  var renderTargetMap = {};
  var renderTargetStack = [];
  var pageX;
  var pageY;
  var pageMatrix; // only used for FormObjects

  /**
   * A matrix object for 2D homogenous transformations: <br>
   * | a b 0 | <br>
   * | c d 0 | <br>
   * | e f 1 | <br>
   * pdf multiplies matrices righthand: v' = v x m1 x m2 x ...
   *
   * @class
   * @name Matrix
   * @param {number} sx
   * @param {number} shy
   * @param {number} shx
   * @param {number} sy
   * @param {number} tx
   * @param {number} ty
   * @constructor
   */
  var Matrix = function(sx, shy, shx, sy, tx, ty) {
    if (!(this instanceof Matrix)) {
      return new Matrix(sx, shy, shx, sy, tx, ty);
    }

    if (isNaN(sx)) sx = 1;
    if (isNaN(shy)) shy = 0;
    if (isNaN(shx)) shx = 0;
    if (isNaN(sy)) sy = 1;
    if (isNaN(tx)) tx = 0;
    if (isNaN(ty)) ty = 0;

    this._matrix = [sx, shy, shx, sy, tx, ty];
  };

  /**
   * @name sx
   * @memberof Matrix#
   */
  Object.defineProperty(Matrix.prototype, "sx", {
    get: function() {
      return this._matrix[0];
    },
    set: function(value) {
      this._matrix[0] = value;
    }
  });

  /**
   * @name shy
   * @memberof Matrix#
   */
  Object.defineProperty(Matrix.prototype, "shy", {
    get: function() {
      return this._matrix[1];
    },
    set: function(value) {
      this._matrix[1] = value;
    }
  });

  /**
   * @name shx
   * @memberof Matrix#
   */
  Object.defineProperty(Matrix.prototype, "shx", {
    get: function() {
      return this._matrix[2];
    },
    set: function(value) {
      this._matrix[2] = value;
    }
  });

  /**
   * @name sy
   * @memberof Matrix#
   */
  Object.defineProperty(Matrix.prototype, "sy", {
    get: function() {
      return this._matrix[3];
    },
    set: function(value) {
      this._matrix[3] = value;
    }
  });

  /**
   * @name tx
   * @memberof Matrix#
   */
  Object.defineProperty(Matrix.prototype, "tx", {
    get: function() {
      return this._matrix[4];
    },
    set: function(value) {
      this._matrix[4] = value;
    }
  });

  /**
   * @name ty
   * @memberof Matrix#
   */
  Object.defineProperty(Matrix.prototype, "ty", {
    get: function() {
      return this._matrix[5];
    },
    set: function(value) {
      this._matrix[5] = value;
    }
  });

  Object.defineProperty(Matrix.prototype, "a", {
    get: function() {
      return this._matrix[0];
    },
    set: function(value) {
      this._matrix[0] = value;
    }
  });

  Object.defineProperty(Matrix.prototype, "b", {
    get: function() {
      return this._matrix[1];
    },
    set: function(value) {
      this._matrix[1] = value;
    }
  });

  Object.defineProperty(Matrix.prototype, "c", {
    get: function() {
      return this._matrix[2];
    },
    set: function(value) {
      this._matrix[2] = value;
    }
  });

  Object.defineProperty(Matrix.prototype, "d", {
    get: function() {
      return this._matrix[3];
    },
    set: function(value) {
      this._matrix[3] = value;
    }
  });

  Object.defineProperty(Matrix.prototype, "e", {
    get: function() {
      return this._matrix[4];
    },
    set: function(value) {
      this._matrix[4] = value;
    }
  });

  Object.defineProperty(Matrix.prototype, "f", {
    get: function() {
      return this._matrix[5];
    },
    set: function(value) {
      this._matrix[5] = value;
    }
  });

  /**
   * @name rotation
   * @memberof Matrix#
   */
  Object.defineProperty(Matrix.prototype, "rotation", {
    get: function() {
      return Math.atan2(this.shx, this.sx);
    }
  });

  /**
   * @name scaleX
   * @memberof Matrix#
   */
  Object.defineProperty(Matrix.prototype, "scaleX", {
    get: function() {
      return this.decompose().scale.sx;
    }
  });

  /**
   * @name scaleY
   * @memberof Matrix#
   */
  Object.defineProperty(Matrix.prototype, "scaleY", {
    get: function() {
      return this.decompose().scale.sy;
    }
  });

  /**
   * @name isIdentity
   * @memberof Matrix#
   */
  Object.defineProperty(Matrix.prototype, "isIdentity", {
    get: function() {
      if (this.sx !== 1) {
        return false;
      }
      if (this.shy !== 0) {
        return false;
      }
      if (this.shx !== 0) {
        return false;
      }
      if (this.sy !== 1) {
        return false;
      }
      if (this.tx !== 0) {
        return false;
      }
      if (this.ty !== 0) {
        return false;
      }
      return true;
    }
  });

  /**
   * Join the Matrix Values to a String
   *
   * @function join
   * @param {string} separator Specifies a string to separate each pair of adjacent elements of the array. The separator is converted to a string if necessary. If omitted, the array elements are separated with a comma (","). If separator is an empty string, all elements are joined without any characters in between them.
   * @returns {string} A string with all array elements joined.
   * @memberof Matrix#
   */
  Matrix.prototype.join = function(separator) {
    return [this.sx, this.shy, this.shx, this.sy, this.tx, this.ty]
      .map(hpf)
      .join(separator);
  };

  /**
   * Multiply the matrix with given Matrix
   *
   * @function multiply
   * @param matrix
   * @returns {Matrix}
   * @memberof Matrix#
   */
  Matrix.prototype.multiply = function(matrix) {
    var sx = matrix.sx * this.sx + matrix.shy * this.shx;
    var shy = matrix.sx * this.shy + matrix.shy * this.sy;
    var shx = matrix.shx * this.sx + matrix.sy * this.shx;
    var sy = matrix.shx * this.shy + matrix.sy * this.sy;
    var tx = matrix.tx * this.sx + matrix.ty * this.shx + this.tx;
    var ty = matrix.tx * this.shy + matrix.ty * this.sy + this.ty;

    return new Matrix(sx, shy, shx, sy, tx, ty);
  };

  /**
   * @function decompose
   * @memberof Matrix#
   */
  Matrix.prototype.decompose = function() {
    var a = this.sx;
    var b = this.shy;
    var c = this.shx;
    var d = this.sy;
    var e = this.tx;
    var f = this.ty;

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
      scale: new Matrix(scaleX, 0, 0, scaleY, 0, 0),
      translate: new Matrix(1, 0, 0, 1, e, f),
      rotate: new Matrix(a, b, -b, a, 0, 0),
      skew: new Matrix(1, 0, shear, 1, 0, 0)
    };
  };

  /**
   * @function toString
   * @memberof Matrix#
   */
  Matrix.prototype.toString = function(parmPrecision) {
    return this.join(" ");
  };

  /**
   * @function inversed
   * @memberof Matrix#
   */
  Matrix.prototype.inversed = function() {
    var a = this.sx,
      b = this.shy,
      c = this.shx,
      d = this.sy,
      e = this.tx,
      f = this.ty;

    var quot = 1 / (a * d - b * c);

    var aInv = d * quot;
    var bInv = -b * quot;
    var cInv = -c * quot;
    var dInv = a * quot;
    var eInv = -aInv * e - cInv * f;
    var fInv = -bInv * e - dInv * f;

    return new Matrix(aInv, bInv, cInv, dInv, eInv, fInv);
  };

  /**
   * @function applyToPoint
   * @memberof Matrix#
   */
  Matrix.prototype.applyToPoint = function(pt) {
    var x = pt.x * this.sx + pt.y * this.shx + this.tx;
    var y = pt.x * this.shy + pt.y * this.sy + this.ty;
    return new Point(x, y);
  };

  /**
   * @function applyToRectangle
   * @memberof Matrix#
   */
  Matrix.prototype.applyToRectangle = function(rect) {
    var pt1 = this.applyToPoint(rect);
    var pt2 = this.applyToPoint(new Point(rect.x + rect.w, rect.y + rect.h));
    return new Rectangle(pt1.x, pt1.y, pt2.x - pt1.x, pt2.y - pt1.y);
  };

  /**
   * Clone the Matrix
   *
   * @function clone
   * @memberof Matrix#
   * @name clone
   * @instance
   */
  Matrix.prototype.clone = function() {
    var sx = this.sx;
    var shy = this.shy;
    var shx = this.shx;
    var sy = this.sy;
    var tx = this.tx;
    var ty = this.ty;

    return new Matrix(sx, shy, shx, sy, tx, ty);
  };

  API.Matrix = Matrix;

  /**
   * Multiplies two matrices. (see {@link Matrix})
   * @param {Matrix} m1
   * @param {Matrix} m2
   * @memberof jsPDF#
   * @name matrixMult
   */
  var matrixMult = (API.matrixMult = function(m1, m2) {
    return m2.multiply(m1);
  });

  /**
   * The identity matrix (equivalent to new Matrix(1, 0, 0, 1, 0, 0)).
   * @type {Matrix}
   * @memberof! jsPDF#
   * @name identityMatrix
   */
  var identityMatrix = new Matrix(1, 0, 0, 1, 0, 0);
  API.unitMatrix = API.identityMatrix = identityMatrix;

  /**
   * Adds a new pattern for later use.
   * @param {String} key The key by it can be referenced later. The keys must be unique!
   * @param {API.Pattern} pattern The pattern
   */
  var addPattern = function(key, pattern) {
    // only add it if it is not already present (the keys provided by the user must be unique!)
    if (patternMap[key]) return;

    var prefix = pattern instanceof ShadingPattern ? "Sh" : "P";
    var patternKey = prefix + (Object.keys(patterns).length + 1).toString(10);
    pattern.id = patternKey;

    patternMap[key] = patternKey;
    patterns[patternKey] = pattern;

    events.publish("addPattern", pattern);
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
  API.ShadingPattern = ShadingPattern;

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
  API.TilingPattern = TilingPattern;

  /**
   * Adds a new {@link API.ShadingPattern} for later use. Only available in "advanced" API mode.
   * @param {String} key
   * @param {Pattern} pattern
   * @function
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name addPattern
   */
  API.addShadingPattern = function(key, pattern) {
    advancedApiModeTrap("addShadingPattern()");

    addPattern(key, pattern);
    return this;
  };

  /**
   * Begins a new tiling pattern. All subsequent render calls are drawn to this pattern until {@link API.endTilingPattern}
   * gets called. Only available in "advanced" API mode.
   * @param {API.Pattern} pattern
   * @memberof jsPDF#
   * @name beginTilingPattern
   */
  API.beginTilingPattern = function(pattern) {
    advancedApiModeTrap("beginTilingPattern()");

    beginNewRenderTarget(
      pattern.boundingBox[0],
      pattern.boundingBox[1],
      pattern.boundingBox[2] - pattern.boundingBox[0],
      pattern.boundingBox[3] - pattern.boundingBox[1],
      pattern.matrix
    );
  };

  /**
   * Ends a tiling pattern and sets the render target to the one active before {@link API.beginTilingPattern} has been called.
   *
   * Only available in "advanced" API mode.
   *
   * @param {string} key A unique key that is used to reference this pattern at later use.
   * @param {API.Pattern} pattern The pattern to end.
   * @memberof jsPDF#
   * @name endTilingPattern
   */
  API.endTilingPattern = function(key, pattern) {
    advancedApiModeTrap("endTilingPattern()");

    // retrieve the stream
    pattern.stream = pages[currentPage].join("\n");

    addPattern(key, pattern);

    events.publish("endTilingPattern", pattern);

    // restore state from stack
    renderTargetStack.pop().restore();
  };

  var newObject = (API.__private__.newObject = function() {
    var oid = newObjectDeferred();
    newObjectDeferredBegin(oid, true);
    return oid;
  });

  // Does not output the object.  The caller must call newObjectDeferredBegin(oid) before outputing any data
  var newObjectDeferred = (API.__private__.newObjectDeferred = function() {
    objectNumber++;
    offsets[objectNumber] = function() {
      return contentLength;
    };
    return objectNumber;
  });

  var newObjectDeferredBegin = function(oid, doOutput) {
    doOutput = typeof doOutput === "boolean" ? doOutput : false;
    offsets[oid] = contentLength;
    if (doOutput) {
      out(oid + " 0 obj");
    }
    return oid;
  };
  // Does not output the object until after the pages have been output.
  // Returns an object containing the objectId and content.
  // All pages have been added so the object ID can be estimated to start right after.
  // This does not modify the current objectNumber;  It must be updated after the newObjects are output.
  var newAdditionalObject = (API.__private__.newAdditionalObject = function() {
    var objId = newObjectDeferred();
    var obj = {
      objId: objId,
      content: ""
    };
    additionalObjects.push(obj);
    return obj;
  });

  var rootDictionaryObjId = newObjectDeferred();
  var resourceDictionaryObjId = newObjectDeferred();

  /////////////////////
  // Private functions
  /////////////////////

  var decodeColorString = (API.__private__.decodeColorString = function(color) {
    var colorEncoded = color.split(" ");
    if (
      colorEncoded.length === 2 &&
      (colorEncoded[1] === "g" || colorEncoded[1] === "G")
    ) {
      // convert grayscale value to rgb so that it can be converted to hex for consistency
      var floatVal = parseFloat(colorEncoded[0]);
      colorEncoded = [floatVal, floatVal, floatVal, "r"];
    } else if (
      colorEncoded.length === 5 &&
      (colorEncoded[4] === "k" || colorEncoded[4] === "K")
    ) {
      // convert CMYK values to rbg so that it can be converted to hex for consistency
      var red = (1.0 - colorEncoded[0]) * (1.0 - colorEncoded[3]);
      var green = (1.0 - colorEncoded[1]) * (1.0 - colorEncoded[3]);
      var blue = (1.0 - colorEncoded[2]) * (1.0 - colorEncoded[3]);

      colorEncoded = [red, green, blue, "r"];
    }
    var colorAsRGB = "#";
    for (var i = 0; i < 3; i++) {
      colorAsRGB += (
        "0" + Math.floor(parseFloat(colorEncoded[i]) * 255).toString(16)
      ).slice(-2);
    }
    return colorAsRGB;
  });

  var encodeColorString = (API.__private__.encodeColorString = function(
    options
  ) {
    var color;

    if (typeof options === "string") {
      options = {
        ch1: options
      };
    }
    var ch1 = options.ch1;
    var ch2 = options.ch2;
    var ch3 = options.ch3;
    var ch4 = options.ch4;
    var letterArray =
      options.pdfColorType === "draw" ? ["G", "RG", "K"] : ["g", "rg", "k"];

    if (typeof ch1 === "string" && ch1.charAt(0) !== "#") {
      var rgbColor = new RGBColor(ch1);
      if (rgbColor.ok) {
        ch1 = rgbColor.toHex();
      } else if (!/^\d*\.?\d*$/.test(ch1)) {
        throw new Error(
          'Invalid color "' + ch1 + '" passed to jsPDF.encodeColorString.'
        );
      }
    }
    //convert short rgb to long form
    if (typeof ch1 === "string" && /^#[0-9A-Fa-f]{3}$/.test(ch1)) {
      ch1 = "#" + ch1[1] + ch1[1] + ch1[2] + ch1[2] + ch1[3] + ch1[3];
    }

    if (typeof ch1 === "string" && /^#[0-9A-Fa-f]{6}$/.test(ch1)) {
      var hex = parseInt(ch1.substr(1), 16);
      ch1 = (hex >> 16) & 255;
      ch2 = (hex >> 8) & 255;
      ch3 = hex & 255;
    }

    if (
      typeof ch2 === "undefined" ||
      (typeof ch4 === "undefined" && ch1 === ch2 && ch2 === ch3)
    ) {
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
    } else if (typeof ch4 === "undefined" || typeof ch4 === "object") {
      // assume RGBA
      if (ch4 && !isNaN(ch4.a)) {
        //TODO Implement transparency.
        //WORKAROUND use white for now, if transparent, otherwise handle as rgb
        if (ch4.a === 0) {
          color = ["1.", "1.", "1.", letterArray[1]].join(" ");
          return color;
        }
      }
      // assume RGB
      if (typeof ch1 === "string") {
        color = [ch1, ch2, ch3, letterArray[1]].join(" ");
      } else {
        switch (options.precision) {
          case 2:
            color = [
              f2(ch1 / 255),
              f2(ch2 / 255),
              f2(ch3 / 255),
              letterArray[1]
            ].join(" ");
            break;
          default:
          case 3:
            color = [
              f3(ch1 / 255),
              f3(ch2 / 255),
              f3(ch3 / 255),
              letterArray[1]
            ].join(" ");
        }
      }
    } else {
      // assume CMYK
      if (typeof ch1 === "string") {
        color = [ch1, ch2, ch3, ch4, letterArray[2]].join(" ");
      } else {
        switch (options.precision) {
          case 2:
            color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), letterArray[2]].join(
              " "
            );
            break;
          case 3:
          default:
            color = [f3(ch1), f3(ch2), f3(ch3), f3(ch4), letterArray[2]].join(
              " "
            );
        }
      }
    }
    return color;
  });

  var getFilters = (API.__private__.getFilters = function() {
    return filters;
  });

  var putStream = (API.__private__.putStream = function(options) {
    options = options || {};
    var data = options.data || "";
    var filters = options.filters || getFilters();
    var alreadyAppliedFilters = options.alreadyAppliedFilters || [];
    var addLength1 = options.addLength1 || false;
    var valueOfLength1 = data.length;
    var objectId = options.objectId;
    var encryptor = function(data) {
      return data;
    };
    if (encryptionOptions !== null && typeof objectId == "undefined") {
      throw new Error(
        "ObjectId must be passed to putStream for file encryption"
      );
    }
    if (encryptionOptions !== null) {
      encryptor = encryption.encryptor(objectId, 0);
    }

    var processedData = {};
    if (filters === true) {
      filters = ["FlateEncode"];
    }
    var keyValues = options.additionalKeyValues || [];
    if (typeof jsPDF.API.processDataByFilters !== "undefined") {
      processedData = jsPDF.API.processDataByFilters(data, filters);
    } else {
      processedData = { data: data, reverseChain: [] };
    }
    var filterAsString =
      processedData.reverseChain +
      (Array.isArray(alreadyAppliedFilters)
        ? alreadyAppliedFilters.join(" ")
        : alreadyAppliedFilters.toString());

    if (processedData.data.length !== 0) {
      keyValues.push({
        key: "Length",
        value: processedData.data.length
      });
      if (addLength1 === true) {
        keyValues.push({
          key: "Length1",
          value: valueOfLength1
        });
      }
    }

    if (filterAsString.length != 0) {
      if (filterAsString.split("/").length - 1 === 1) {
        keyValues.push({
          key: "Filter",
          value: filterAsString
        });
      } else {
        keyValues.push({
          key: "Filter",
          value: "[" + filterAsString + "]"
        });

        for (var j = 0; j < keyValues.length; j += 1) {
          if (keyValues[j].key === "DecodeParms") {
            var decodeParmsArray = [];

            for (
              var i = 0;
              i < processedData.reverseChain.split("/").length - 1;
              i += 1
            ) {
              decodeParmsArray.push("null");
            }

            decodeParmsArray.push(keyValues[j].value);
            keyValues[j].value = "[" + decodeParmsArray.join(" ") + "]";
          }
        }
      }
    }

    out("<<");
    for (var k = 0; k < keyValues.length; k++) {
      out("/" + keyValues[k].key + " " + keyValues[k].value);
    }
    out(">>");
    if (processedData.data.length !== 0) {
      out("stream");
      out(encryptor(processedData.data));
      out("endstream");
    }
  });

  var putPage = (API.__private__.putPage = function(page) {
    var pageNumber = page.number;
    var data = page.data;
    var pageObjectNumber = page.objId;
    var pageContentsObjId = page.contentsObjId;

    newObjectDeferredBegin(pageObjectNumber, true);
    out("<</Type /Page");
    out("/Parent " + page.rootDictionaryObjId + " 0 R");
    out("/Resources " + page.resourceDictionaryObjId + " 0 R");
    out(
      "/MediaBox [" +
        parseFloat(hpf(page.mediaBox.bottomLeftX)) +
        " " +
        parseFloat(hpf(page.mediaBox.bottomLeftY)) +
        " " +
        hpf(page.mediaBox.topRightX) +
        " " +
        hpf(page.mediaBox.topRightY) +
        "]"
    );
    if (page.cropBox !== null) {
      out(
        "/CropBox [" +
          hpf(page.cropBox.bottomLeftX) +
          " " +
          hpf(page.cropBox.bottomLeftY) +
          " " +
          hpf(page.cropBox.topRightX) +
          " " +
          hpf(page.cropBox.topRightY) +
          "]"
      );
    }

    if (page.bleedBox !== null) {
      out(
        "/BleedBox [" +
          hpf(page.bleedBox.bottomLeftX) +
          " " +
          hpf(page.bleedBox.bottomLeftY) +
          " " +
          hpf(page.bleedBox.topRightX) +
          " " +
          hpf(page.bleedBox.topRightY) +
          "]"
      );
    }

    if (page.trimBox !== null) {
      out(
        "/TrimBox [" +
          hpf(page.trimBox.bottomLeftX) +
          " " +
          hpf(page.trimBox.bottomLeftY) +
          " " +
          hpf(page.trimBox.topRightX) +
          " " +
          hpf(page.trimBox.topRightY) +
          "]"
      );
    }

    if (page.artBox !== null) {
      out(
        "/ArtBox [" +
          hpf(page.artBox.bottomLeftX) +
          " " +
          hpf(page.artBox.bottomLeftY) +
          " " +
          hpf(page.artBox.topRightX) +
          " " +
          hpf(page.artBox.topRightY) +
          "]"
      );
    }

    if (typeof page.userUnit === "number" && page.userUnit !== 1.0) {
      out("/UserUnit " + page.userUnit);
    }

    events.publish("putPage", {
      objId: pageObjectNumber,
      pageContext: pagesContext[pageNumber],
      pageNumber: pageNumber,
      page: data
    });
    out("/Contents " + pageContentsObjId + " 0 R");
    out(">>");
    out("endobj");
    // Page content
    var pageContent = data.join("\n");

    if (apiMode === ApiMode.ADVANCED) {
      // if the user forgot to switch back to COMPAT mode, we must balance the graphics stack again
      pageContent += "\nQ";
    }

    newObjectDeferredBegin(pageContentsObjId, true);
    putStream({
      data: pageContent,
      filters: getFilters(),
      objectId: pageContentsObjId
    });
    out("endobj");
    return pageObjectNumber;
  });

  var putPages = (API.__private__.putPages = function() {
    var n,
      i,
      pageObjectNumbers = [];

    for (n = 1; n <= page; n++) {
      pagesContext[n].objId = newObjectDeferred();
      pagesContext[n].contentsObjId = newObjectDeferred();
    }

    for (n = 1; n <= page; n++) {
      pageObjectNumbers.push(
        putPage({
          number: n,
          data: pages[n],
          objId: pagesContext[n].objId,
          contentsObjId: pagesContext[n].contentsObjId,
          mediaBox: pagesContext[n].mediaBox,
          cropBox: pagesContext[n].cropBox,
          bleedBox: pagesContext[n].bleedBox,
          trimBox: pagesContext[n].trimBox,
          artBox: pagesContext[n].artBox,
          userUnit: pagesContext[n].userUnit,
          rootDictionaryObjId: rootDictionaryObjId,
          resourceDictionaryObjId: resourceDictionaryObjId
        })
      );
    }
    newObjectDeferredBegin(rootDictionaryObjId, true);
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
  });

  var putFont = function(font) {
    var pdfEscapeWithNeededParanthesis = function(text, flags) {
      var addParanthesis = text.indexOf(" ") !== -1; // no space in string
      return addParanthesis
        ? "(" + pdfEscape(text, flags) + ")"
        : pdfEscape(text, flags);
    };

    events.publish("putFont", {
      font: font,
      out: out,
      newObject: newObject,
      putStream: putStream,
      pdfEscapeWithNeededParanthesis: pdfEscapeWithNeededParanthesis
    });

    if (font.isAlreadyPutted !== true) {
      font.objectNumber = newObject();
      out("<<");
      out("/Type /Font");
      out("/BaseFont /" + pdfEscapeWithNeededParanthesis(font.postScriptName));
      out("/Subtype /Type1");
      if (typeof font.encoding === "string") {
        out("/Encoding /" + font.encoding);
      }
      out("/FirstChar 32");
      out("/LastChar 255");
      out(">>");
      out("endobj");
    }
  };

  var putFonts = function() {
    for (var fontKey in fonts) {
      if (fonts.hasOwnProperty(fontKey)) {
        if (
          putOnlyUsedFonts === false ||
          (putOnlyUsedFonts === true && usedFonts.hasOwnProperty(fontKey))
        ) {
          putFont(fonts[fontKey]);
        }
      }
    }
  };

  var putXObject = function(xObject) {
    xObject.objectNumber = newObject();

    var options = [];
    options.push({ key: "Type", value: "/XObject" });
    options.push({ key: "Subtype", value: "/Form" });
    options.push({
      key: "BBox",
      value:
        "[" +
        [
          hpf(xObject.x),
          hpf(xObject.y),
          hpf(xObject.x + xObject.width),
          hpf(xObject.y + xObject.height)
        ].join(" ") +
        "]"
    });
    options.push({
      key: "Matrix",
      value: "[" + xObject.matrix.toString() + "]"
    });
    // TODO: /Resources

    var stream = xObject.pages[1].join("\n");
    putStream({
      data: stream,
      additionalKeyValues: options,
      objectId: xObject.objectNumber
    });
    out("endobj");
  };

  var putXObjects = function() {
    for (var xObjectKey in renderTargets) {
      if (renderTargets.hasOwnProperty(xObjectKey)) {
        putXObject(renderTargets[xObjectKey]);
      }
    }
  };

  var interpolateAndEncodeRGBStream = function(colors, numberSamples) {
    var tValues = [];
    var t;
    var dT = 1.0 / (numberSamples - 1);
    for (t = 0.0; t < 1.0; t += dT) {
      tValues.push(t);
    }
    tValues.push(1.0);
    // add first and last control point if not present
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
      while (t > colors[index + 1].offset) index++;
      var a = colors[index].offset;
      var b = colors[index + 1].offset;
      var d = (t - a) / (b - a);

      var aColor = colors[index].color;
      var bColor = colors[index + 1].color;

      out +=
        padd2Hex(Math.round((1 - d) * aColor[0] + d * bColor[0]).toString(16)) +
        padd2Hex(Math.round((1 - d) * aColor[1] + d * bColor[1]).toString(16)) +
        padd2Hex(Math.round((1 - d) * aColor[2] + d * bColor[2]).toString(16));
    }
    return out.trim();
  };

  var putShadingPattern = function(pattern, numberSamples) {
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

    var options = [];
    options.push({ key: "FunctionType", value: "0" });
    options.push({ key: "Domain", value: "[0.0 1.0]" });
    options.push({ key: "Size", value: "[" + numberSamples + "]" });
    options.push({ key: "BitsPerSample", value: "8" });
    options.push({ key: "Range", value: "[0.0 1.0 0.0 1.0 0.0 1.0]" });
    options.push({ key: "Decode", value: "[0.0 1.0 0.0 1.0 0.0 1.0]" });

    putStream({
      data: stream,
      additionalKeyValues: options,
      alreadyAppliedFilters: ["/ASCIIHexDecode"],
      objectId: funcObjectNumber
    });
    out("endobj");

    pattern.objectNumber = newObject();
    out("<< /ShadingType " + pattern.type);
    out("/ColorSpace /DeviceRGB");
    var coords =
      "/Coords [" +
      hpf(parseFloat(pattern.coords[0])) +
      " " + // x1
      hpf(parseFloat(pattern.coords[1])) +
      " "; // y1
    if (pattern.type === 2) {
      // axial
      coords +=
        hpf(parseFloat(pattern.coords[2])) +
        " " + // x2
        hpf(parseFloat(pattern.coords[3])); // y2
    } else {
      // radial
      coords +=
        hpf(parseFloat(pattern.coords[2])) +
        " " + // r1
        hpf(parseFloat(pattern.coords[3])) +
        " " + // x2
        hpf(parseFloat(pattern.coords[4])) +
        " " + // y2
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
  };

  var putTilingPattern = function(pattern, deferredResourceDictionaryIds) {
    var resourcesObjectId = newObjectDeferred();
    var patternObjectId = newObject();

    deferredResourceDictionaryIds.push({
      resourcesOid: resourcesObjectId,
      objectOid: patternObjectId
    });

    pattern.objectNumber = patternObjectId;
    var options = [];
    options.push({ key: "Type", value: "/Pattern" });
    options.push({ key: "PatternType", value: "1" }); // tiling pattern
    options.push({ key: "PaintType", value: "1" }); // colored tiling pattern
    options.push({ key: "TilingType", value: "1" }); // constant spacing
    options.push({
      key: "BBox",
      value: "[" + pattern.boundingBox.map(hpf).join(" ") + "]"
    });
    options.push({ key: "XStep", value: hpf(pattern.xStep) });
    options.push({ key: "YStep", value: hpf(pattern.yStep) });
    options.push({ key: "Resources", value: resourcesObjectId + " 0 R" });
    if (pattern.matrix) {
      options.push({
        key: "Matrix",
        value: "[" + pattern.matrix.toString() + "]"
      });
    }

    putStream({
      data: pattern.stream,
      additionalKeyValues: options,
      objectId: pattern.objectNumber
    });
    out("endobj");
  };

  var putPatterns = function(deferredResourceDictionaryIds) {
    var patternKey;
    for (patternKey in patterns) {
      if (patterns.hasOwnProperty(patternKey)) {
        if (patterns[patternKey] instanceof ShadingPattern) {
          putShadingPattern(patterns[patternKey]);
        } else if (patterns[patternKey] instanceof TilingPattern) {
          putTilingPattern(patterns[patternKey], deferredResourceDictionaryIds);
        }
      }
    }
  };

  var putGState = function(gState) {
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
  };

  var putGStates = function() {
    var gStateKey;
    for (gStateKey in gStates) {
      if (gStates.hasOwnProperty(gStateKey)) {
        putGState(gStates[gStateKey]);
      }
    }
  };

  var putXobjectDict = function() {
    out("/XObject <<");
    for (var xObjectKey in renderTargets) {
      if (
        renderTargets.hasOwnProperty(xObjectKey) &&
        renderTargets[xObjectKey].objectNumber >= 0
      ) {
        out(
          "/" +
            xObjectKey +
            " " +
            renderTargets[xObjectKey].objectNumber +
            " 0 R"
        );
      }
    }

    // Loop through images, or other data objects
    events.publish("putXobjectDict");
    out(">>");
  };

  var putEncryptionDict = function() {
    encryption.oid = newObject();
    out("<<");
    out("/Filter /Standard");
    out("/V " + encryption.v);
    out("/R " + encryption.r);
    out("/U <" + encryption.toHexString(encryption.U) + ">");
    out("/O <" + encryption.toHexString(encryption.O) + ">");
    out("/P " + encryption.P);
    out(">>");
    out("endobj");
  };

  var putFontDict = function() {
    out("/Font <<");

    for (var fontKey in fonts) {
      if (fonts.hasOwnProperty(fontKey)) {
        if (
          putOnlyUsedFonts === false ||
          (putOnlyUsedFonts === true && usedFonts.hasOwnProperty(fontKey))
        ) {
          out("/" + fontKey + " " + fonts[fontKey].objectNumber + " 0 R");
        }
      }
    }
    out(">>");
  };

  var putShadingPatternDict = function() {
    if (Object.keys(patterns).length > 0) {
      out("/Shading <<");
      for (var patternKey in patterns) {
        if (
          patterns.hasOwnProperty(patternKey) &&
          patterns[patternKey] instanceof ShadingPattern &&
          patterns[patternKey].objectNumber >= 0
        ) {
          out(
            "/" + patternKey + " " + patterns[patternKey].objectNumber + " 0 R"
          );
        }
      }

      events.publish("putShadingPatternDict");
      out(">>");
    }
  };

  var putTilingPatternDict = function(objectOid) {
    if (Object.keys(patterns).length > 0) {
      out("/Pattern <<");
      for (var patternKey in patterns) {
        if (
          patterns.hasOwnProperty(patternKey) &&
          patterns[patternKey] instanceof API.TilingPattern &&
          patterns[patternKey].objectNumber >= 0 &&
          patterns[patternKey].objectNumber < objectOid // prevent cyclic dependencies
        ) {
          out(
            "/" + patternKey + " " + patterns[patternKey].objectNumber + " 0 R"
          );
        }
      }
      events.publish("putTilingPatternDict");
      out(">>");
    }
  };

  var putGStatesDict = function() {
    if (Object.keys(gStates).length > 0) {
      var gStateKey;
      out("/ExtGState <<");
      for (gStateKey in gStates) {
        if (
          gStates.hasOwnProperty(gStateKey) &&
          gStates[gStateKey].objectNumber >= 0
        ) {
          out("/" + gStateKey + " " + gStates[gStateKey].objectNumber + " 0 R");
        }
      }

      events.publish("putGStateDict");
      out(">>");
    }
  };

  var putResourceDictionary = function(objectIds) {
    newObjectDeferredBegin(objectIds.resourcesOid, true);
    out("<<");
    out("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]");
    putFontDict();
    putShadingPatternDict();
    putTilingPatternDict(objectIds.objectOid);
    putGStatesDict();
    putXobjectDict();
    out(">>");
    out("endobj");
  };

  var putResources = function() {
    // FormObjects, Patterns etc. might use other FormObjects/Patterns/Images
    // which means their resource dictionaries must contain the already resolved
    // object ids. For this reason we defer the serialization of the resource
    // dicts until all objects have been serialized and have object ids.
    //
    // In order to prevent cyclic dependencies (which Adobe Reader doesn't like),
    // we only put all oids that are smaller than the oid of the object the
    // resource dict belongs to. This is correct behavior, since the streams
    // may only use other objects that have already been defined and thus appear
    // earlier in their respective collection.
    // Currently, this only affects tiling patterns, but a (more) correct
    // implementation of FormObjects would also define their own resource dicts.
    var deferredResourceDictionaryIds = [];

    putFonts();
    putGStates();
    putXObjects();
    putPatterns(deferredResourceDictionaryIds);

    events.publish("putResources");
    deferredResourceDictionaryIds.forEach(putResourceDictionary);
    putResourceDictionary({
      resourcesOid: resourceDictionaryObjId,
      objectOid: Number.MAX_SAFE_INTEGER // output all objects
    });
    events.publish("postPutResources");
  };

  var putAdditionalObjects = function() {
    events.publish("putAdditionalObjects");
    for (var i = 0; i < additionalObjects.length; i++) {
      var obj = additionalObjects[i];
      newObjectDeferredBegin(obj.objId, true);
      out(obj.content);
      out("endobj");
    }
    events.publish("postPutAdditionalObjects");
  };

  var addFontToFontDictionary = function(font) {
    fontmap[font.fontName] = fontmap[font.fontName] || {};
    fontmap[font.fontName][font.fontStyle] = font.id;
  };

  var addFont = function(
    postScriptName,
    fontName,
    fontStyle,
    encoding,
    isStandardFont
  ) {
    var font = {
      id: "F" + (Object.keys(fonts).length + 1).toString(10),
      postScriptName: postScriptName,
      fontName: fontName,
      fontStyle: fontStyle,
      encoding: encoding,
      isStandardFont: isStandardFont || false,
      metadata: {}
    };

    events.publish("addFont", {
      font: font,
      instance: this
    });

    fonts[font.id] = font;
    addFontToFontDictionary(font);
    return font.id;
  };

  var addFonts = function(arrayOfFonts) {
    for (var i = 0, l = standardFonts.length; i < l; i++) {
      var fontKey = addFont.call(
        this,
        arrayOfFonts[i][0],
        arrayOfFonts[i][1],
        arrayOfFonts[i][2],
        standardFonts[i][3],
        true
      );

      if (putOnlyUsedFonts === false) {
        usedFonts[fontKey] = true;
      }
      // adding aliases for standard fonts, this time matching the capitalization
      var parts = arrayOfFonts[i][0].split("-");
      addFontToFontDictionary({
        id: fontKey,
        fontName: parts[0],
        fontStyle: parts[1] || ""
      });
    }
    events.publish("addFonts", {
      fonts: fonts,
      dictionary: fontmap
    });
  };

  var SAFE = function __safeCall(fn) {
    fn.foo = function __safeCallWrapper() {
      try {
        return fn.apply(this, arguments);
      } catch (e) {
        var stack = e.stack || "";
        if (~stack.indexOf(" at ")) stack = stack.split(" at ")[1];
        var m =
          "Error in function " +
          stack.split("\n")[0].split("<")[0] +
          ": " +
          e.message;
        if (globalObject.console) {
          globalObject.console.error(m, e);
          if (globalObject.alert) alert(m);
        } else {
          throw new Error(m);
        }
      }
    };
    fn.foo.bar = fn;
    return fn.foo;
  };

  var to8bitStream = function(text, flags) {
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

    var i,
      l,
      sourceEncoding,
      encodingBlock,
      outputEncoding,
      newtext,
      isUnicode,
      ch,
      bch;

    flags = flags || {};
    sourceEncoding = flags.sourceEncoding || "Unicode";
    outputEncoding = flags.outputEncoding;

    // This 'encoding' section relies on font metrics format
    // attached to font objects by, among others,
    // "Willow Systems' standard_font_metrics plugin"
    // see jspdf.plugin.standard_font_metrics.js for format
    // of the font.metadata.encoding Object.
    // It should be something like
    //   .encoding = {'codePages':['WinANSI....'], 'WinANSI...':{code:code, ...}}
    //   .widths = {0:width, code:width, ..., 'fof':divisor}
    //   .kerning = {code:{previous_char_code:shift, ..., 'fof':-divisor},...}
    if (
      (flags.autoencode || outputEncoding) &&
      fonts[activeFontKey].metadata &&
      fonts[activeFontKey].metadata[sourceEncoding] &&
      fonts[activeFontKey].metadata[sourceEncoding].encoding
    ) {
      encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding;

      // each font has default encoding. Some have it clearly defined.
      if (!outputEncoding && fonts[activeFontKey].encoding) {
        outputEncoding = fonts[activeFontKey].encoding;
      }

      // Hmmm, the above did not work? Let's try again, in different place.
      if (!outputEncoding && encodingBlock.codePages) {
        outputEncoding = encodingBlock.codePages[0]; // let's say, first one is the default
      }

      if (typeof outputEncoding === "string") {
        outputEncoding = encodingBlock[outputEncoding];
      }
      // we want output encoding to be a JS Object, where
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
          }

          // since we are looping over chars anyway, might as well
          // check for residual unicodeness
          if (newtext[i].charCodeAt(0) >> 8) {
            /* more than 255 */
            isUnicode = true;
          }
        }
        text = newtext.join("");
      }
    }

    i = text.length;
    // isUnicode may be set to false above. Hence the triple-equal to undefined
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
        throw new Error(
          "Character at position " +
            i +
            " of string '" +
            text +
            "' exceeds 16bits. Cannot be encoded into UCS-2 BE"
        );
      }
      newtext.push(bch);
      newtext.push(ch - (bch << 8));
    }
    return String.fromCharCode.apply(undefined, newtext);
  };

  var pdfEscape = (API.__private__.pdfEscape = API.pdfEscape = function(
    text,
    flags
  ) {
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
    return to8bitStream(text, flags)
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  });

  var beginPage = (API.__private__.beginPage = function(format) {
    pages[++page] = [];
    pagesContext[page] = {
      objId: 0,
      contentsObjId: 0,
      userUnit: Number(userUnit),
      artBox: null,
      bleedBox: null,
      cropBox: null,
      trimBox: null,
      mediaBox: {
        bottomLeftX: 0,
        bottomLeftY: 0,
        topRightX: Number(format[0]),
        topRightY: Number(format[1])
      }
    };
    _setPage(page);
    setOutputDestination(pages[currentPage]);
  });

  var _addPage = function(parmFormat, parmOrientation) {
    var dimensions, width, height;

    orientation = parmOrientation || orientation;

    if (typeof parmFormat === "string") {
      dimensions = getPageFormat(parmFormat.toLowerCase());
      if (Array.isArray(dimensions)) {
        width = dimensions[0];
        height = dimensions[1];
      }
    }

    if (Array.isArray(parmFormat)) {
      width = parmFormat[0] * scaleFactor;
      height = parmFormat[1] * scaleFactor;
    }

    if (isNaN(width)) {
      width = format[0];
      height = format[1];
    }

    if (width > 14400 || height > 14400) {
      console.warn(
        "A page in a PDF can not be wider or taller than 14400 userUnit. jsPDF limits the width/height to 14400"
      );
      width = Math.min(14400, width);
      height = Math.min(14400, height);
    }

    format = [width, height];

    switch (orientation.substr(0, 1)) {
      case "l":
        if (height > width) {
          format = [height, width];
        }
        break;
      case "p":
        if (width > height) {
          format = [height, width];
        }
        break;
    }

    beginPage(format);

    // Set line width
    setLineWidth(lineWidth);
    // Set draw color
    out(strokeColor);
    // resurrecting non-default line caps, joins
    if (lineCapID !== 0) {
      out(lineCapID + " J");
    }
    if (lineJoinID !== 0) {
      out(lineJoinID + " j");
    }
    events.publish("addPage", {
      pageNumber: page
    });
  };

  var _deletePage = function(n) {
    if (n > 0 && n <= page) {
      pages.splice(n, 1);
      pagesContext.splice(n, 1);
      page--;
      if (currentPage > page) {
        currentPage = page;
      }
      this.setPage(currentPage);
    }
  };

  var _setPage = function(n) {
    if (n > 0 && n <= page) {
      currentPage = n;
    }
  };

  var getNumberOfPages = (API.__private__.getNumberOfPages = API.getNumberOfPages = function() {
    return pages.length - 1;
  });

  /**
   * Returns a document-specific font key - a label assigned to a
   * font name + font type combination at the time the font was added
   * to the font inventory.
   *
   * Font key is used as label for the desired font for a block of text
   * to be added to the PDF document stream.
   * @private
   * @function
   * @param fontName {string} can be undefined on "falthy" to indicate "use current"
   * @param fontStyle {string} can be undefined on "falthy" to indicate "use current"
   * @returns {string} Font key.
   * @ignore
   */
  var getFont = function(fontName, fontStyle, options) {
    var key = undefined,
      fontNameLowerCase;
    options = options || {};

    fontName =
      fontName !== undefined ? fontName : fonts[activeFontKey].fontName;
    fontStyle =
      fontStyle !== undefined ? fontStyle : fonts[activeFontKey].fontStyle;
    fontNameLowerCase = fontName.toLowerCase();

    if (
      fontmap[fontNameLowerCase] !== undefined &&
      fontmap[fontNameLowerCase][fontStyle] !== undefined
    ) {
      key = fontmap[fontNameLowerCase][fontStyle];
    } else if (
      fontmap[fontName] !== undefined &&
      fontmap[fontName][fontStyle] !== undefined
    ) {
      key = fontmap[fontName][fontStyle];
    } else {
      if (options.disableWarning === false) {
        console.warn(
          "Unable to look up font label for font '" +
            fontName +
            "', '" +
            fontStyle +
            "'. Refer to getFontList() for available fonts."
        );
      }
    }

    if (!key && !options.noFallback) {
      key = fontmap["times"][fontStyle];
      if (key == null) {
        key = fontmap["times"]["normal"];
      }
    }
    return key;
  };

  var putInfo = (API.__private__.putInfo = function() {
    var objectId = newObject();
    var encryptor = function(data) {
      return data;
    };
    if (encryptionOptions !== null) {
      encryptor = encryption.encryptor(objectId, 0);
    }
    out("<<");
    out("/Producer (" + pdfEscape(encryptor("jsPDF " + jsPDF.version)) + ")");
    for (var key in documentProperties) {
      if (documentProperties.hasOwnProperty(key) && documentProperties[key]) {
        out(
          "/" +
            key.substr(0, 1).toUpperCase() +
            key.substr(1) +
            " (" +
            pdfEscape(encryptor(documentProperties[key])) +
            ")"
        );
      }
    }
    out("/CreationDate (" + pdfEscape(encryptor(creationDate)) + ")");
    out(">>");
    out("endobj");
  });

  var putCatalog = (API.__private__.putCatalog = function(options) {
    options = options || {};
    var tmpRootDictionaryObjId =
      options.rootDictionaryObjId || rootDictionaryObjId;
    newObject();
    out("<<");
    out("/Type /Catalog");
    out("/Pages " + tmpRootDictionaryObjId + " 0 R");
    // PDF13ref Section 7.2.1
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
        if (pcn.substr(pcn.length - 1) === "%")
          zoomMode = parseInt(zoomMode) / 100;
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
    out(">>");
    out("endobj");
  });

  var putTrailer = (API.__private__.putTrailer = function() {
    out("trailer");
    out("<<");
    out("/Size " + (objectNumber + 1));
    // Root and Info must be the last and second last objects written respectively
    out("/Root " + objectNumber + " 0 R");
    out("/Info " + (objectNumber - 1) + " 0 R");
    if (encryptionOptions !== null) {
      out("/Encrypt " + encryption.oid + " 0 R");
    }
    out("/ID [ <" + fileId + "> <" + fileId + "> ]");
    out(">>");
  });

  var putHeader = (API.__private__.putHeader = function() {
    out("%PDF-" + pdfVersion);
    out("%\xBA\xDF\xAC\xE0");
  });

  var putXRef = (API.__private__.putXRef = function() {
    var p = "0000000000";

    out("xref");
    out("0 " + (objectNumber + 1));
    out("0000000000 65535 f ");
    for (var i = 1; i <= objectNumber; i++) {
      var offset = offsets[i];
      if (typeof offset === "function") {
        out((p + offsets[i]()).slice(-10) + " 00000 n ");
      } else {
        if (typeof offsets[i] !== "undefined") {
          out((p + offsets[i]).slice(-10) + " 00000 n ");
        } else {
          out("0000000000 00000 n ");
        }
      }
    }
  });

  var buildDocument = (API.__private__.buildDocument = function() {
    resetDocument();
    setOutputDestination(content);

    events.publish("buildDocument");

    putHeader();
    putPages();
    putAdditionalObjects();
    putResources();
    if (encryptionOptions !== null) putEncryptionDict();
    putInfo();
    putCatalog();

    var offsetOfXRef = contentLength;
    putXRef();
    putTrailer();
    out("startxref");
    out("" + offsetOfXRef);
    out("%%EOF");

    setOutputDestination(pages[currentPage]);

    return content.join("\n");
  });

  var getBlob = (API.__private__.getBlob = function(data) {
    return new Blob([getArrayBuffer(data)], {
      type: "application/pdf"
    });
  });

  /**
   * Generates the PDF document.
   *
   * If `type` argument is undefined, output is raw body of resulting PDF returned as a string.
   *
   * @param {string} type A string identifying one of the possible output types.<br/>
   *                      Possible values are: <br/>
   *                          'arraybuffer' -> (ArrayBuffer)<br/>
   *                          'blob' -> (Blob)<br/>
   *                          'bloburi'/'bloburl' -> (string)<br/>
   *                          'datauristring'/'dataurlstring' -> (string)<br/>
   *                          'datauri'/'dataurl' -> (undefined) -> change location to generated datauristring/dataurlstring<br/>
   *                          'dataurlnewwindow' -> (window | null | undefined) throws error if global isn't a window object(node)<br/>
   *                          'pdfobjectnewwindow' -> (window | null) throws error if global isn't a window object(node)<br/>
   *                          'pdfjsnewwindow' -> (wind | null)
   * @param {Object|string} options An object providing some additional signalling to PDF generator.<br/>
   *                                Possible options are 'filename'.<br/>
   *                                A string can be passed instead of {filename:string} and defaults to 'generated.pdf'
   * @function
   * @instance
   * @returns {string|window|ArrayBuffer|Blob|jsPDF|null|undefined}
   * @memberof jsPDF#
   * @name output
   */
  var output = (API.output = API.__private__.output = SAFE(function output(
    type,
    options
  ) {
    options = options || {};

    if (typeof options === "string") {
      options = {
        filename: options
      };
    } else {
      options.filename = options.filename || "generated.pdf";
    }

    switch (type) {
      case undefined:
        return buildDocument();
      case "save":
        API.save(options.filename);
        break;
      case "arraybuffer":
        return getArrayBuffer(buildDocument());
      case "blob":
        return getBlob(buildDocument());
      case "bloburi":
      case "bloburl":
        // Developer is responsible of calling revokeObjectURL
        if (
          typeof globalObject.URL !== "undefined" &&
          typeof globalObject.URL.createObjectURL === "function"
        ) {
          return (
            (globalObject.URL &&
              globalObject.URL.createObjectURL(getBlob(buildDocument()))) ||
            void 0
          );
        } else {
          console.warn(
            "bloburl is not supported by your system, because URL.createObjectURL is not supported by your browser."
          );
        }
        break;
      case "datauristring":
      case "dataurlstring":
        var dataURI = "";
        var pdfDocument = buildDocument();
        try {
          dataURI = btoa(pdfDocument);
        } catch (e) {
          dataURI = btoa(unescape(encodeURIComponent(pdfDocument)));
        }
        return (
          "data:application/pdf;filename=" +
          options.filename +
          ";base64," +
          dataURI
        );
      case "pdfobjectnewwindow":
        if (
          Object.prototype.toString.call(globalObject) === "[object Window]"
        ) {
          var pdfObjectUrl =
            options.pdfObjectUrl ||
            "https://cdnjs.cloudflare.com/ajax/libs/pdfobject/2.1.1/pdfobject.min.js";
          var htmlForNewWindow =
            "<html>" +
            '<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><script src="' +
            pdfObjectUrl +
            '"></script><script >PDFObject.embed("' +
            this.output("dataurlstring") +
            '", ' +
            JSON.stringify(options) +
            ");</script></body></html>";
          var nW = globalObject.open();

          if (nW !== null) {
            nW.document.write(htmlForNewWindow);
          }
          return nW;
        } else {
          throw new Error(
            "The option pdfobjectnewwindow just works in a browser-environment."
          );
        }
      case "pdfjsnewwindow":
        if (
          Object.prototype.toString.call(globalObject) === "[object Window]"
        ) {
          var pdfJsUrl = options.pdfJsUrl || "examples/PDF.js/web/viewer.html";
          var htmlForPDFjsNewWindow =
            "<html>" +
            "<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style>" +
            '<body><iframe id="pdfViewer" src="' +
            pdfJsUrl +
            "?file=&downloadName=" +
            options.filename +
            '" width="500px" height="400px" />' +
            "</body></html>";
          var PDFjsNewWindow = globalObject.open();

          if (PDFjsNewWindow !== null) {
            PDFjsNewWindow.document.write(htmlForPDFjsNewWindow);
            var scope = this;
            PDFjsNewWindow.document.documentElement.querySelector(
              "#pdfViewer"
            ).onload = function() {
              PDFjsNewWindow.document.title = options.filename;
              PDFjsNewWindow.document.documentElement
                .querySelector("#pdfViewer")
                .contentWindow.PDFViewerApplication.open(
                  scope.output("bloburl")
                );
            };
          }
          return PDFjsNewWindow;
        } else {
          throw new Error(
            "The option pdfjsnewwindow just works in a browser-environment."
          );
        }
      case "dataurlnewwindow":
        if (
          Object.prototype.toString.call(globalObject) === "[object Window]"
        ) {
          var htmlForDataURLNewWindow =
            "<html>" +
            "<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style>" +
            "<body>" +
            '<iframe src="' +
            this.output("datauristring", options) +
            '"></iframe>' +
            "</body></html>";
          var dataURLNewWindow = globalObject.open();
          if (dataURLNewWindow !== null) {
            dataURLNewWindow.document.write(htmlForDataURLNewWindow);
            dataURLNewWindow.document.title = options.filename;
          }
          if (dataURLNewWindow || typeof safari === "undefined")
            return dataURLNewWindow;
        } else {
          throw new Error(
            "The option dataurlnewwindow just works in a browser-environment."
          );
        }
        break;
      case "datauri":
      case "dataurl":
        return (globalObject.document.location.href = this.output(
          "datauristring",
          options
        ));
      default:
        return null;
    }
  }));

  /**
   * Used to see if a supplied hotfix was requested when the pdf instance was created.
   * @param {string} hotfixName - The name of the hotfix to check.
   * @returns {boolean}
   */
  var hasHotfix = function(hotfixName) {
    return (
      Array.isArray(hotfixes) === true && hotfixes.indexOf(hotfixName) > -1
    );
  };

  switch (unit) {
    case "pt":
      scaleFactor = 1;
      break;
    case "mm":
      scaleFactor = 72 / 25.4;
      break;
    case "cm":
      scaleFactor = 72 / 2.54;
      break;
    case "in":
      scaleFactor = 72;
      break;
    case "px":
      if (hasHotfix("px_scaling") == true) {
        scaleFactor = 72 / 96;
      } else {
        scaleFactor = 96 / 72;
      }
      break;
    case "pc":
      scaleFactor = 12;
      break;
    case "em":
      scaleFactor = 12;
      break;
    case "ex":
      scaleFactor = 6;
      break;
    default:
      throw new Error("Invalid unit: " + unit);
  }

  var encryption = null;
  setCreationDate();
  setFileId();

  var getEncryptor = function(objectId) {
    if (encryptionOptions !== null) {
      return encryption.encryptor(objectId, 0);
    }
    return function(data) {
      return data;
    };
  };

  //---------------------------------------
  // Public API

  var getPageInfo = (API.__private__.getPageInfo = API.getPageInfo = function(
    pageNumberOneBased
  ) {
    if (isNaN(pageNumberOneBased) || pageNumberOneBased % 1 !== 0) {
      throw new Error("Invalid argument passed to jsPDF.getPageInfo");
    }
    var objId = pagesContext[pageNumberOneBased].objId;
    return {
      objId: objId,
      pageNumber: pageNumberOneBased,
      pageContext: pagesContext[pageNumberOneBased]
    };
  });

  var getPageInfoByObjId = (API.__private__.getPageInfoByObjId = function(
    objId
  ) {
    if (isNaN(objId) || objId % 1 !== 0) {
      throw new Error("Invalid argument passed to jsPDF.getPageInfoByObjId");
    }
    for (var pageNumber in pagesContext) {
      if (pagesContext[pageNumber].objId === objId) {
        break;
      }
    }
    return getPageInfo(pageNumber);
  });

  var getCurrentPageInfo = (API.__private__.getCurrentPageInfo = API.getCurrentPageInfo = function() {
    return {
      objId: pagesContext[currentPage].objId,
      pageNumber: currentPage,
      pageContext: pagesContext[currentPage]
    };
  });

  /**
   * Adds (and transfers the focus to) new page to the PDF document.
   * @param format {String/Array} The format of the new page. Can be: <ul><li>a0 - a10</li><li>b0 - b10</li><li>c0 - c10</li><li>dl</li><li>letter</li><li>government-letter</li><li>legal</li><li>junior-legal</li><li>ledger</li><li>tabloid</li><li>credit-card</li></ul><br />
   * Default is "a4". If you want to use your own format just pass instead of one of the above predefined formats the size as an number-array, e.g. [595.28, 841.89]
   * @param orientation {string} Orientation of the new page. Possible values are "portrait" or "landscape" (or shortcuts "p" (Default), "l").
   * @function
   * @instance
   * @returns {jsPDF}
   *
   * @memberof jsPDF#
   * @name addPage
   */
  API.addPage = function() {
    _addPage.apply(this, arguments);
    return this;
  };
  /**
   * Adds (and transfers the focus to) new page to the PDF document.
   * @function
   * @instance
   * @returns {jsPDF}
   *
   * @memberof jsPDF#
   * @name setPage
   * @param {number} page Switch the active page to the page number specified (indexed starting at 1).
   * @example
   * doc = jsPDF()
   * doc.addPage()
   * doc.addPage()
   * doc.text('I am on page 3', 10, 10)
   * doc.setPage(1)
   * doc.text('I am on page 1', 10, 10)
   */
  API.setPage = function() {
    _setPage.apply(this, arguments);
    setOutputDestination.call(this, pages[currentPage]);
    return this;
  };

  /**
   * @name insertPage
   * @memberof jsPDF#
   *
   * @function
   * @instance
   * @param {Object} beforePage
   * @returns {jsPDF}
   */
  API.insertPage = function(beforePage) {
    this.addPage();
    this.movePage(currentPage, beforePage);
    return this;
  };

  /**
   * @name movePage
   * @memberof jsPDF#
   * @function
   * @instance
   * @param {number} targetPage
   * @param {number} beforePage
   * @returns {jsPDF}
   */
  API.movePage = function(targetPage, beforePage) {
    var tmpPages, tmpPagesContext;
    if (targetPage > beforePage) {
      tmpPages = pages[targetPage];
      tmpPagesContext = pagesContext[targetPage];
      for (var i = targetPage; i > beforePage; i--) {
        pages[i] = pages[i - 1];
        pagesContext[i] = pagesContext[i - 1];
      }
      pages[beforePage] = tmpPages;
      pagesContext[beforePage] = tmpPagesContext;
      this.setPage(beforePage);
    } else if (targetPage < beforePage) {
      tmpPages = pages[targetPage];
      tmpPagesContext = pagesContext[targetPage];
      for (var j = targetPage; j < beforePage; j++) {
        pages[j] = pages[j + 1];
        pagesContext[j] = pagesContext[j + 1];
      }
      pages[beforePage] = tmpPages;
      pagesContext[beforePage] = tmpPagesContext;
      this.setPage(beforePage);
    }
    return this;
  };

  /**
   * Deletes a page from the PDF.
   * @name deletePage
   * @memberof jsPDF#
   * @function
   * @param {number} targetPage
   * @instance
   * @returns {jsPDF}
   */
  API.deletePage = function() {
    _deletePage.apply(this, arguments);
    return this;
  };

  /**
   * Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
   *
   * @function
   * @instance
   * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
   * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page.
   * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page.
   * @param {Object} [options] - Collection of settings signaling how the text must be encoded.
   * @param {string} [options.align=left] - The alignment of the text, possible values: left, center, right, justify.
   * @param {string} [options.baseline=alphabetic] - Sets text baseline used when drawing the text, possible values: alphabetic, ideographic, bottom, top, middle, hanging
   * @param {number|Matrix} [options.angle=0] - Rotate the text clockwise or counterclockwise. Expects the angle in degree.
   * @param {number} [options.rotationDirection=1] - Direction of the rotation. 0 = clockwise, 1 = counterclockwise.
   * @param {number} [options.charSpace=0] - The space between each letter.
   * @param {number} [options.lineHeightFactor=1.15] - The lineheight of each line.
   * @param {Object} [options.flags] - Flags for to8bitStream.
   * @param {boolean} [options.flags.noBOM=true] - Don't add BOM to Unicode-text.
   * @param {boolean} [options.flags.autoencode=true] - Autoencode the Text.
   * @param {number} [options.maxWidth=0] - Split the text by given width, 0 = no split.
   * @param {string} [options.renderingMode=fill] - Set how the text should be rendered, possible values: fill, stroke, fillThenStroke, invisible, fillAndAddForClipping, strokeAndAddPathForClipping, fillThenStrokeAndAddToPathForClipping, addToPathForClipping.
   * @param {boolean} [options.isInputVisual] - Option for the BidiEngine
   * @param {boolean} [options.isOutputVisual] - Option for the BidiEngine
   * @param {boolean} [options.isInputRtl] - Option for the BidiEngine
   * @param {boolean} [options.isOutputRtl] - Option for the BidiEngine
   * @param {boolean} [options.isSymmetricSwapping] - Option for the BidiEngine
   * @param {number|Matrix} transform If transform is a number the text will be rotated by this value around the anchor set by x and y.
   *
   * If it is a Matrix, this matrix gets directly applied to the text, which allows shearing
   * effects etc.; the x and y offsets are then applied AFTER the coordinate system has been established by this
   * matrix. This means passing a rotation matrix that is equivalent to some rotation angle will in general yield a
   * DIFFERENT result. A matrix is only allowed in "advanced" API mode.
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name text
   */
  API.__private__.text = API.text = function(text, x, y, options, transform) {
    /*
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
    options = options || {};
    var scope = options.scope || this;
    var payload, da, angle, align, charSpace, maxWidth, flags;

    // Pre-August-2012 the order of arguments was function(x, y, text, flags)
    // in effort to make all calls have similar signature like
    //   function(data, coordinates... , miscellaneous)
    // this method had its args flipped.
    // code below allows backward compatibility with old arg order.
    if (
      typeof text === "number" &&
      typeof x === "number" &&
      (typeof y === "string" || Array.isArray(y))
    ) {
      var tmp = y;
      y = x;
      x = text;
      text = tmp;
    }

    var transformationMatrix;

    if (arguments[3] instanceof Matrix === false) {
      flags = arguments[3];
      angle = arguments[4];
      align = arguments[5];

      if (typeof flags !== "object" || flags === null) {
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
      }
    } else {
      advancedApiModeTrap(
        "The transform parameter of text() with a Matrix value"
      );
      transformationMatrix = transform;
    }

    if (isNaN(x) || isNaN(y) || typeof text === "undefined" || text === null) {
      throw new Error("Invalid arguments passed to jsPDF.text");
    }

    if (text.length === 0) {
      return scope;
    }

    var xtra = "";
    var isHex = false;
    var lineHeight =
      typeof options.lineHeightFactor === "number"
        ? options.lineHeightFactor
        : lineHeightFactor;
    var scaleFactor = scope.internal.scaleFactor;

    function ESC(s) {
      s = s.split("\t").join(Array(options.TabLen || 9).join(" "));
      return pdfEscape(s, flags);
    }

    function transformTextToSpecialArray(text) {
      //we don't want to destroy original text array, so cloning it
      var sa = text.concat();
      var da = [];
      var len = sa.length;
      var curDa;
      //we do array.join('text that must not be PDFescaped")
      //thus, pdfEscape each component separately
      while (len--) {
        curDa = sa.shift();
        if (typeof curDa === "string") {
          da.push(curDa);
        } else {
          if (
            Array.isArray(text) &&
            (curDa.length === 1 ||
              (curDa[1] === undefined && curDa[2] === undefined))
          ) {
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
      } else if (Array.isArray(text)) {
        //we don't want to destroy original text array, so cloning it
        var sa = text.concat();
        var da = [];
        var len = sa.length;
        var curDa;
        var tmpResult;
        //we do array.join('text that must not be PDFescaped")
        //thus, pdfEscape each component separately
        while (len--) {
          curDa = sa.shift();
          if (typeof curDa === "string") {
            da.push(processingFunction(curDa)[0]);
          } else if (Array.isArray(curDa) && typeof curDa[0] === "string") {
            tmpResult = processingFunction(curDa[0], curDa[1], curDa[2]);
            da.push([tmpResult[0], tmpResult[1], tmpResult[2]]);
          }
        }
        result = da;
      }
      return result;
    }

    //Check if text is of type String
    var textIsOfTypeString = false;
    var tmpTextIsOfTypeString = true;

    if (typeof text === "string") {
      textIsOfTypeString = true;
    } else if (Array.isArray(text)) {
      //we don't want to destroy original text array, so cloning it
      var sa = text.concat();
      da = [];
      var len = sa.length;
      var curDa;
      //we do array.join('text that must not be PDFescaped")
      //thus, pdfEscape each component separately
      while (len--) {
        curDa = sa.shift();
        if (
          typeof curDa !== "string" ||
          (Array.isArray(curDa) && typeof curDa[0] !== "string")
        ) {
          tmpTextIsOfTypeString = false;
        }
      }
      textIsOfTypeString = tmpTextIsOfTypeString;
    }
    if (textIsOfTypeString === false) {
      throw new Error(
        'Type of text must be string or Array. "' +
          text +
          '" is not recognized.'
      );
    }

    //If there are any newlines in text, we assume
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
    }

    //baseline
    var height = activeFontSize / scope.internal.scaleFactor;
    var descent = height * (lineHeightFactor - 1);
    switch (options.baseline) {
      case "bottom":
        y -= descent;
        break;
      case "top":
        y += height - descent;
        break;
      case "hanging":
        y += height - 2 * descent;
        break;
      case "middle":
        y += height / 2 - descent;
        break;
    }

    //multiline
    maxWidth = options.maxWidth || 0;

    if (maxWidth > 0) {
      if (typeof text === "string") {
        text = scope.splitTextToSize(text, maxWidth);
      } else if (Object.prototype.toString.call(text) === "[object Array]") {
        text = text.reduce(function(acc, textLine) {
          return acc.concat(scope.splitTextToSize(textLine, maxWidth));
        }, []);
      }
    }

    //creating Payload-Object to make text byRef
    payload = {
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
    options = payload.options;

    //angle
    angle = options.angle;

    if (
      transformationMatrix instanceof Matrix === false &&
      angle &&
      typeof angle === "number"
    ) {
      angle *= Math.PI / 180;

      if (options.rotationDirection === 0) {
        angle = -angle;
      }

      if (apiMode === ApiMode.ADVANCED) {
        angle = -angle;
      }

      var c = Math.cos(angle);
      var s = Math.sin(angle);
      transformationMatrix = new Matrix(c, s, -s, c, 0, 0);
    } else if (angle && angle instanceof Matrix) {
      transformationMatrix = angle;
    }

    if (apiMode === ApiMode.ADVANCED && !transformationMatrix) {
      transformationMatrix = identityMatrix;
    }

    //charSpace

    charSpace = options.charSpace || activeCharSpace;

    if (typeof charSpace !== "undefined") {
      xtra += hpf(scale(charSpace)) + " Tc\n";
      this.setCharSpace(this.getCharSpace() || 0);
    }

    //lang

    var lang = options.lang;

    //renderingMode
    var renderingMode = -1;
    var parmRenderingMode =
      typeof options.renderingMode !== "undefined"
        ? options.renderingMode
        : options.stroke;
    var pageContext = scope.internal.getCurrentPageInfo().pageContext;

    switch (parmRenderingMode) {
      case 0:
      case false:
      case "fill":
        renderingMode = 0;
        break;
      case 1:
      case true:
      case "stroke":
        renderingMode = 1;
        break;
      case 2:
      case "fillThenStroke":
        renderingMode = 2;
        break;
      case 3:
      case "invisible":
        renderingMode = 3;
        break;
      case 4:
      case "fillAndAddForClipping":
        renderingMode = 4;
        break;
      case 5:
      case "strokeAndAddPathForClipping":
        renderingMode = 5;
        break;
      case 6:
      case "fillThenStrokeAndAddToPathForClipping":
        renderingMode = 6;
        break;
      case 7:
      case "addToPathForClipping":
        renderingMode = 7;
        break;
    }

    var usedRenderingMode =
      typeof pageContext.usedRenderingMode !== "undefined"
        ? pageContext.usedRenderingMode
        : -1;

    //if the coder wrote it explicitly to use a specific
    //renderingMode, then use it
    if (renderingMode !== -1) {
      xtra += renderingMode + " Tr\n";
      //otherwise check if we used the rendering Mode already
      //if so then set the rendering Mode...
    } else if (usedRenderingMode !== -1) {
      xtra += "0 Tr\n";
    }

    if (renderingMode !== -1) {
      pageContext.usedRenderingMode = renderingMode;
    }

    //align
    align = options.align || "left";
    var leading = activeFontSize * lineHeight;
    var pageWidth = scope.internal.pageSize.getWidth();
    var activeFont = fonts[activeFontKey];
    charSpace = options.charSpace || activeCharSpace;
    maxWidth = options.maxWidth || 0;

    var lineWidths;
    flags = Object.assign({ autoencode: true, noBOM: true }, options.flags);

    var wordSpacingPerLine = [];

    if (Object.prototype.toString.call(text) === "[object Array]") {
      da = transformTextToSpecialArray(text);
      var newY;
      if (align !== "left") {
        lineWidths = da.map(function(v) {
          return (
            (scope.getStringUnitWidth(v, {
              font: activeFont,
              charSpace: charSpace,
              fontSize: activeFontSize,
              doKerning: false
            }) *
              activeFontSize) /
            scaleFactor
          );
        });
      }
      //The first line uses the "main" Td setting,
      //and the subsequent lines are offset by the
      //previous line's x coordinate.
      var prevWidth = 0;
      var newX;
      if (align === "right") {
        //The passed in x coordinate defines the
        //rightmost point of the text.
        x -= lineWidths[0];
        text = [];
        len = da.length;
        for (var i = 0; i < len; i++) {
          if (i === 0) {
            newX = getHorizontalCoordinate(x);
            newY = getVerticalCoordinate(y);
          } else {
            newX = scale(prevWidth - lineWidths[i]);
            newY = -leading;
          }
          text.push([da[i], newX, newY]);
          prevWidth = lineWidths[i];
        }
      } else if (align === "center") {
        //The passed in x coordinate defines
        //the center point.
        x -= lineWidths[0] / 2;
        text = [];
        len = da.length;
        for (var j = 0; j < len; j++) {
          if (j === 0) {
            newX = getHorizontalCoordinate(x);
            newY = getVerticalCoordinate(y);
          } else {
            newX = scale((prevWidth - lineWidths[j]) / 2);
            newY = -leading;
          }
          text.push([da[j], newX, newY]);
          prevWidth = lineWidths[j];
        }
      } else if (align === "left") {
        text = [];
        len = da.length;
        for (var h = 0; h < len; h++) {
          text.push(da[h]);
        }
      } else if (align === "justify") {
        text = [];
        len = da.length;
        maxWidth = maxWidth !== 0 ? maxWidth : pageWidth;

        for (var l = 0; l < len; l++) {
          newY = l === 0 ? getVerticalCoordinate(y) : -leading;
          newX = l === 0 ? getHorizontalCoordinate(x) : 0;
          if (l < len - 1) {
            wordSpacingPerLine.push(
              hpf(
                scale(
                  (maxWidth - lineWidths[l]) / (da[l].split(" ").length - 1)
                )
              )
            );
          }
          text.push([da[l], newX, newY]);
        }
      } else {
        throw new Error(
          'Unrecognized alignment option, use "left", "center", "right" or "justify".'
        );
      }
    }

    //R2L
    var doReversing = typeof options.R2L === "boolean" ? options.R2L : R2L;
    if (doReversing === true) {
      text = processTextByFunction(text, function(text, posX, posY) {
        return [
          text
            .split("")
            .reverse()
            .join(""),
          posX,
          posY
        ];
      });
    }

    //creating Payload-Object to make text byRef
    payload = {
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
    isHex = payload.mutex.isHex || false;

    //Escaping
    var activeFontEncoding = fonts[activeFontKey].encoding;

    if (
      activeFontEncoding === "WinAnsiEncoding" ||
      activeFontEncoding === "StandardEncoding"
    ) {
      text = processTextByFunction(text, function(text, posX, posY) {
        return [ESC(text), posX, posY];
      });
    }

    da = transformTextToSpecialArray(text);

    text = [];
    var STRING = 0;
    var ARRAY = 1;
    var variant = Array.isArray(da[0]) ? ARRAY : STRING;
    var posX;
    var posY;
    var content;
    var wordSpacing = "";

    var generatePosition = function(
      parmPosX,
      parmPosY,
      parmTransformationMatrix
    ) {
      var position = "";
      if (parmTransformationMatrix instanceof Matrix) {
        // It is kind of more intuitive to apply a plain rotation around the text anchor set by x and y
        // but when the user supplies an arbitrary transformation matrix, the x and y offsets should be applied
        // in the coordinate system established by this matrix
        if (typeof options.angle === "number") {
          parmTransformationMatrix = matrixMult(
            parmTransformationMatrix,
            new Matrix(1, 0, 0, 1, parmPosX, parmPosY)
          );
        } else {
          parmTransformationMatrix = matrixMult(
            new Matrix(1, 0, 0, 1, parmPosX, parmPosY),
            parmTransformationMatrix
          );
        }

        if (apiMode === ApiMode.ADVANCED) {
          parmTransformationMatrix = matrixMult(
            new Matrix(1, 0, 0, -1, 0, 0),
            parmTransformationMatrix
          );
        }

        position = parmTransformationMatrix.join(" ") + " Tm\n";
      } else {
        position = hpf(parmPosX) + " " + hpf(parmPosY) + " Td\n";
      }
      return position;
    };

    for (var lineIndex = 0; lineIndex < da.length; lineIndex++) {
      wordSpacing = "";

      switch (variant) {
        case ARRAY:
          content =
            (isHex ? "<" : "(") + da[lineIndex][0] + (isHex ? ">" : ")");
          posX = parseFloat(da[lineIndex][1]);
          posY = parseFloat(da[lineIndex][2]);
          break;
        case STRING:
          content = (isHex ? "<" : "(") + da[lineIndex] + (isHex ? ">" : ")");
          posX = getHorizontalCoordinate(x);
          posY = getVerticalCoordinate(y);
          break;
      }

      if (
        typeof wordSpacingPerLine !== "undefined" &&
        typeof wordSpacingPerLine[lineIndex] !== "undefined"
      ) {
        wordSpacing = wordSpacingPerLine[lineIndex] + " Tw\n";
      }

      if (lineIndex === 0) {
        text.push(
          wordSpacing +
            generatePosition(posX, posY, transformationMatrix) +
            content
        );
      } else if (variant === STRING) {
        text.push(wordSpacing + content);
      } else if (variant === ARRAY) {
        text.push(
          wordSpacing +
            generatePosition(posX, posY, transformationMatrix) +
            content
        );
      }
    }

    text = variant === STRING ? text.join(" Tj\nT* ") : text.join(" Tj\n");
    text += " Tj\n";

    var result = "BT\n/";
    result += activeFontKey + " " + activeFontSize + " Tf\n"; // font face, style, size
    result += hpf(activeFontSize * lineHeight) + " TL\n"; // line spacing
    result += textColor + "\n";
    result += xtra;
    result += text;
    result += "ET";

    out(result);
    usedFonts[activeFontKey] = true;
    return scope;
  };

  // PDF supports these path painting and clip path operators:
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
   *
   * @name clip
   * @function
   * @instance
   * @param {string} rule Only possible value is 'evenodd'
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @description All .clip() after calling drawing ops with a style argument of null.
   */
  var clip = (API.__private__.clip = API.clip = function(rule) {
    // Call .clip() after calling drawing ops with a style argument of null
    // W is the PDF clipping op
    if ("evenodd" === rule) {
      out("W*");
    } else {
      out("W");
    }
    return this;
  });

  /**
   * @name clipEvenOdd
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @description Modify the current clip path by intersecting it with the current path using the even-odd rule. Note
   * that this will NOT consume the current path. In order to only use this path for clipping call
   * {@link API.discardPath} afterwards.
   */
  API.clipEvenOdd = function() {
    return clip("evenodd");
  };

  /**
   * Consumes the current path without any effect. Mainly used in combination with {@link clip} or
   * {@link clipEvenOdd}. The PDF "n" operator.
   * @name discardPath
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   */
  API.__private__.discardPath = API.discardPath = function() {
    out("n");
    return this;
  };

  var isValidStyle = (API.__private__.isValidStyle = function(style) {
    var validStyleVariants = [
      undefined,
      null,
      "S",
      "D",
      "F",
      "DF",
      "FD",
      "f",
      "f*",
      "B",
      "B*",
      "n"
    ];
    var result = false;
    if (validStyleVariants.indexOf(style) !== -1) {
      result = true;
    }
    return result;
  });

  API.__private__.setDefaultPathOperation = API.setDefaultPathOperation = function(
    operator
  ) {
    if (isValidStyle(operator)) {
      defaultPathOperation = operator;
    }
    return this;
  };

  var getStyle = (API.__private__.getStyle = API.getStyle = function(style) {
    // see path-painting operators in PDF spec
    var op = defaultPathOperation; // stroke

    switch (style) {
      case "D":
      case "S":
        op = "S"; // stroke
        break;
      case "F":
        op = "f"; // fill
        break;
      case "FD":
      case "DF":
        op = "B";
        break;
      case "f":
      case "f*":
      case "B":
      case "B*":
        /*
               Allow direct use of these PDF path-painting operators:
               - f    fill using nonzero winding number rule
               - f*    fill using even-odd rule
               - B    fill then stroke with fill using non-zero winding number rule
               - B*    fill then stroke with fill using even-odd rule
               */
        op = style;
        break;
    }
    return op;
  });

  /**
   * Close the current path. The PDF "h" operator.
   * @name close
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   */
  var close = (API.close = function() {
    out("h");
    return this;
  });

  /**
   * Stroke the path. The PDF "S" operator.
   * @name stroke
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   */
  API.stroke = function() {
    out("S");
    return this;
  };

  /**
   * Fill the current path using the nonzero winding number rule. If a pattern is provided, the path will be filled
   * with this pattern, otherwise with the current fill color. Equivalent to the PDF "f" operator.
   * @name fill
   * @function
   * @instance
   * @param {PatternData=} pattern If provided the path will be filled with this pattern
   * @returns {jsPDF}
   * @memberof jsPDF#
   */
  API.fill = function(pattern) {
    fillWithOptionalPattern("f", pattern);
    return this;
  };

  /**
   * Fill the current path using the even-odd rule. The PDF f* operator.
   * @see API.fill
   * @name fillEvenOdd
   * @function
   * @instance
   * @param {PatternData=} pattern If provided the path will be filled with this pattern
   * @returns {jsPDF}
   * @memberof jsPDF#
   */
  API.fillEvenOdd = function(pattern) {
    fillWithOptionalPattern("f*", pattern);
    return this;
  };

  /**
   * Fill using the nonzero winding number rule and then stroke the current Path. The PDF "B" operator.
   * @see API.fill
   * @name fillStroke
   * @function
   * @instance
   * @param {PatternData=} pattern If provided the path will be stroked with this pattern
   * @returns {jsPDF}
   * @memberof jsPDF#
   */
  API.fillStroke = function(pattern) {
    fillWithOptionalPattern("B", pattern);
    return this;
  };

  /**
   * Fill using the even-odd rule and then stroke the current Path. The PDF "B" operator.
   * @see API.fill
   * @name fillStrokeEvenOdd
   * @function
   * @instance
   * @param {PatternData=} pattern If provided the path will be fill-stroked with this pattern
   * @returns {jsPDF}
   * @memberof jsPDF#
   */
  API.fillStrokeEvenOdd = function(pattern) {
    fillWithOptionalPattern("B*", pattern);
    return this;
  };

  var fillWithOptionalPattern = function(style, pattern) {
    if (typeof pattern === "object") {
      fillWithPattern(pattern, style);
    } else {
      out(style);
    }
  };

  var putStyle = function(style) {
    if (
      style === null ||
      (apiMode === ApiMode.ADVANCED && style === undefined)
    ) {
      return;
    }

    style = getStyle(style);

    // stroking / filling / both the path
    out(style);
  };

  function cloneTilingPattern(patternKey, boundingBox, xStep, yStep, matrix) {
    var clone = new TilingPattern(
      boundingBox || this.boundingBox,
      xStep || this.xStep,
      yStep || this.yStep,
      this.gState,
      matrix || this.matrix
    );
    clone.stream = this.stream;
    var key = patternKey + "$$" + this.cloneIndex++ + "$$";
    addPattern(key, clone);
    return clone;
  }

  var fillWithPattern = function(patternData, style) {
    var patternId = patternMap[patternData.key];
    var pattern = patterns[patternId];

    if (pattern instanceof ShadingPattern) {
      out("q");

      out(clipRuleFromStyle(style));

      if (pattern.gState) {
        API.setGState(pattern.gState);
      }
      out(patternData.matrix.toString() + " cm");
      out("/" + patternId + " sh");
      out("Q");
    } else if (pattern instanceof TilingPattern) {
      // pdf draws patterns starting at the bottom left corner and they are not affected by the global transformation,
      // so we must flip them
      var matrix = new Matrix(1, 0, 0, -1, 0, getPageHeight());

      if (patternData.matrix) {
        matrix = matrix.multiply(patternData.matrix || identityMatrix);
        // we cannot apply a matrix to the pattern on use so we must abuse the pattern matrix and create new instances
        // for each use
        patternId = cloneTilingPattern.call(
          pattern,
          patternData.key,
          patternData.boundingBox,
          patternData.xStep,
          patternData.yStep,
          matrix
        ).id;
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
  };

  var clipRuleFromStyle = function(style) {
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
  };

  /**
   * Begin a new subpath by moving the current point to coordinates (x, y). The PDF "m" operator.
   * @param {number} x
   * @param {number} y
   * @name moveTo
   * @function
   * @instance
   * @memberof jsPDF#
   * @returns {jsPDF}
   */
  var moveTo = (API.moveTo = function(x, y) {
    out(hpf(scale(x)) + " " + hpf(transformScaleY(y)) + " m");
    return this;
  });

  /**
   * Append a straight line segment from the current point to the point (x, y). The PDF "l" operator.
   * @param {number} x
   * @param {number} y
   * @memberof jsPDF#
   * @name lineTo
   * @function
   * @instance
   * @memberof jsPDF#
   * @returns {jsPDF}
   */
  var lineTo = (API.lineTo = function(x, y) {
    out(hpf(scale(x)) + " " + hpf(transformScaleY(y)) + " l");
    return this;
  });

  /**
   * Append a cubic Bézier curve to the current path. The curve shall extend from the current point to the point
   * (x3, y3), using (x1, y1) and (x2, y2) as Bézier control points. The new current point shall be (x3, x3).
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {number} x3
   * @param {number} y3
   * @memberof jsPDF#
   * @name curveTo
   * @function
   * @instance
   * @memberof jsPDF#
   * @returns {jsPDF}
   */
  var curveTo = (API.curveTo = function(x1, y1, x2, y2, x3, y3) {
    out(
      [
        hpf(scale(x1)),
        hpf(transformScaleY(y1)),
        hpf(scale(x2)),
        hpf(transformScaleY(y2)),
        hpf(scale(x3)),
        hpf(transformScaleY(y3)),
        "c"
      ].join(" ")
    );
    return this;
  });

  /**
   * Draw a line on the current page.
   *
   * @name line
   * @function
   * @instance
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {string} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument. default: 'S'
   * @returns {jsPDF}
   * @memberof jsPDF#
   */
  API.__private__.line = API.line = function(x1, y1, x2, y2, style) {
    if (
      isNaN(x1) ||
      isNaN(y1) ||
      isNaN(x2) ||
      isNaN(y2) ||
      !isValidStyle(style)
    ) {
      throw new Error("Invalid arguments passed to jsPDF.line");
    }
    if (apiMode === ApiMode.COMPAT) {
      return this.lines([[x2 - x1, y2 - y1]], x1, y1, [1, 1], style || "S");
    } else {
      return this.lines([[x2 - x1, y2 - y1]], x1, y1, [1, 1]).stroke();
    }
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
   * @example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, [1,1], 'F', false) // line, line, bezier curve, line
   * @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
   * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
   * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
   * @param {number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.
   * @param {string=} style A string specifying the painting style or null. Valid styles include:
   * 'S' [default] - stroke,
   * 'F' - fill,
   * and 'DF' (or 'FD') -  fill then stroke.
   * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
   * method calls. The last drawing method call used to define the shape should not have a null style argument.
   *
   * In "advanced" API mode this parameter is deprecated.
   * @param {Boolean=} closed If true, the path is closed with a straight line from the end of the last curve to the starting point.
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name lines
   */
  API.__private__.lines = API.lines = function(
    lines,
    x,
    y,
    scale,
    style,
    closed
  ) {
    var scalex, scaley, i, l, leg, x2, y2, x3, y3, x4, y4, tmp;

    // Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
    // in effort to make all calls have similar signature like
    //   function(content, coordinateX, coordinateY , miscellaneous)
    // this method had its args flipped.
    // code below allows backward compatibility with old arg order.
    if (typeof lines === "number") {
      tmp = y;
      y = x;
      x = lines;
      lines = tmp;
    }

    scale = scale || [1, 1];
    closed = closed || false;

    if (
      isNaN(x) ||
      isNaN(y) ||
      !Array.isArray(lines) ||
      !Array.isArray(scale) ||
      !isValidStyle(style) ||
      typeof closed !== "boolean"
    ) {
      throw new Error("Invalid arguments passed to jsPDF.lines");
    }

    // starting point
    moveTo(x, y);

    scalex = scale[0];
    scaley = scale[1];
    l = lines.length;
    //, x2, y2 // bezier only. In page default measurement "units", *after* scaling
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
        lineTo(x4, y4);
      } else {
        // bezier curve
        x2 = leg[0] * scalex + x4; // here last x4 is prior ending point
        y2 = leg[1] * scaley + y4; // here last y4 is prior ending point
        x3 = leg[2] * scalex + x4; // here last x4 is prior ending point
        y3 = leg[3] * scaley + y4; // here last y4 is prior ending point
        x4 = leg[4] * scalex + x4; // here last x4 was prior ending point
        y4 = leg[5] * scaley + y4; // here last y4 was prior ending point
        curveTo(x2, y2, x3, y3, x4, y4);
      }
    }

    if (closed) {
      close();
    }

    putStyle(style);
    return this;
  };

  /**
   * Similar to {@link API.lines} but all coordinates are interpreted as absolute coordinates instead of relative.
   * @param {Array<Object>} lines An array of {op: operator, c: coordinates} object, where op is one of "m" (move to), "l" (line to)
   * "c" (cubic bezier curve) and "h" (close (sub)path)). c is an array of coordinates. "m" and "l" expect two, "c"
   * six and "h" an empty array (or undefined).
   * @function
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name path
   */
  API.path = function(lines) {
    for (var i = 0; i < lines.length; i++) {
      var leg = lines[i];
      var coords = leg.c;
      switch (leg.op) {
        case "m":
          moveTo(coords[0], coords[1]);
          break;
        case "l":
          lineTo(coords[0], coords[1]);
          break;
        case "c":
          curveTo.apply(this, coords);
          break;
        case "h":
          close();
          break;
      }
    }

    return this;
  };

  /**
   * Adds a rectangle to PDF.
   *
   * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
   * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
   * @param {number} w Width (in units declared at inception of PDF document)
   * @param {number} h Height (in units declared at inception of PDF document)
   * @param {string=} style A string specifying the painting style or null. Valid styles include:
   * 'S' [default] - stroke,
   * 'F' - fill,
   * and 'DF' (or 'FD') -  fill then stroke.
   * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
   * method calls. The last drawing method call used to define the shape should not have a null style argument.
   *
   * In "advanced" API mode this parameter is deprecated.
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name rect
   */
  API.__private__.rect = API.rect = function(x, y, w, h, style) {
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h) || !isValidStyle(style)) {
      throw new Error("Invalid arguments passed to jsPDF.rect");
    }
    if (apiMode === ApiMode.COMPAT) {
      h = -h;
    }

    out(
      [
        hpf(scale(x)),
        hpf(transformScaleY(y)),
        hpf(scale(w)),
        hpf(scale(h)),
        "re"
      ].join(" ")
    );

    putStyle(style);
    return this;
  };

  /**
   * Adds a triangle to PDF.
   *
   * @param {number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page
   * @param {number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page
   * @param {number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page
   * @param {number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page
   * @param {number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page
   * @param {number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page
   * @param {string=} style A string specifying the painting style or null. Valid styles include:
   * 'S' [default] - stroke,
   * 'F' - fill,
   * and 'DF' (or 'FD') -  fill then stroke.
   * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
   * method calls. The last drawing method call used to define the shape should not have a null style argument.
   *
   * In "advanced" API mode this parameter is deprecated.
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name triangle
   */
  API.__private__.triangle = API.triangle = function(
    x1,
    y1,
    x2,
    y2,
    x3,
    y3,
    style
  ) {
    if (
      isNaN(x1) ||
      isNaN(y1) ||
      isNaN(x2) ||
      isNaN(y2) ||
      isNaN(x3) ||
      isNaN(y3) ||
      !isValidStyle(style)
    ) {
      throw new Error("Invalid arguments passed to jsPDF.triangle");
    }
    this.lines(
      [
        [x2 - x1, y2 - y1], // vector to point 2
        [x3 - x2, y3 - y2], // vector to point 3
        [x1 - x3, y1 - y3] // closing vector back to point 1
      ],
      x1,
      y1, // start of path
      [1, 1],
      style,
      true
    );
    return this;
  };

  /**
   * Adds a rectangle with rounded corners to PDF.
   *
   * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
   * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
   * @param {number} w Width (in units declared at inception of PDF document)
   * @param {number} h Height (in units declared at inception of PDF document)
   * @param {number} rx Radius along x axis (in units declared at inception of PDF document)
   * @param {number} ry Radius along y axis (in units declared at inception of PDF document)
   * @param {string=} style A string specifying the painting style or null. Valid styles include:
   * 'S' [default] - stroke,
   * 'F' - fill,
   * and 'DF' (or 'FD') -  fill then stroke.
   * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
   * method calls. The last drawing method call used to define the shape should not have a null style argument.
   *
   * In "advanced" API mode this parameter is deprecated.
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name roundedRect
   */
  API.__private__.roundedRect = API.roundedRect = function(
    x,
    y,
    w,
    h,
    rx,
    ry,
    style
  ) {
    if (
      isNaN(x) ||
      isNaN(y) ||
      isNaN(w) ||
      isNaN(h) ||
      isNaN(rx) ||
      isNaN(ry) ||
      !isValidStyle(style)
    ) {
      throw new Error("Invalid arguments passed to jsPDF.roundedRect");
    }
    var MyArc = (4 / 3) * (Math.SQRT2 - 1);

    rx = Math.min(rx, w * 0.5);
    ry = Math.min(ry, h * 0.5);

    this.lines(
      [
        [w - 2 * rx, 0],
        [rx * MyArc, 0, rx, ry - ry * MyArc, rx, ry],
        [0, h - 2 * ry],
        [0, ry * MyArc, -(rx * MyArc), ry, -rx, ry],
        [-w + 2 * rx, 0],
        [-(rx * MyArc), 0, -rx, -(ry * MyArc), -rx, -ry],
        [0, -h + 2 * ry],
        [0, -(ry * MyArc), rx * MyArc, -ry, rx, -ry]
      ],
      x + rx,
      y, // start of path
      [1, 1],
      style,
      true
    );
    return this;
  };

  /**
   * Adds an ellipse to PDF.
   *
   * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
   * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
   * @param {number} rx Radius along x axis (in units declared at inception of PDF document)
   * @param {number} ry Radius along y axis (in units declared at inception of PDF document)
   * @param {string=} style A string specifying the painting style or null. Valid styles include:
   * 'S' [default] - stroke,
   * 'F' - fill,
   * and 'DF' (or 'FD') -  fill then stroke.
   * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
   * method calls. The last drawing method call used to define the shape should not have a null style argument.
   *
   * In "advanced" API mode this parameter is deprecated.
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name ellipse
   */
  API.__private__.ellipse = API.ellipse = function(x, y, rx, ry, style) {
    if (
      isNaN(x) ||
      isNaN(y) ||
      isNaN(rx) ||
      isNaN(ry) ||
      !isValidStyle(style)
    ) {
      throw new Error("Invalid arguments passed to jsPDF.ellipse");
    }
    var lx = (4 / 3) * (Math.SQRT2 - 1) * rx,
      ly = (4 / 3) * (Math.SQRT2 - 1) * ry;

    moveTo(x + rx, y);
    curveTo(x + rx, y - ly, x + lx, y - ry, x, y - ry);
    curveTo(x - lx, y - ry, x - rx, y - ly, x - rx, y);
    curveTo(x - rx, y + ly, x - lx, y + ry, x, y + ry);
    curveTo(x + lx, y + ry, x + rx, y + ly, x + rx, y);

    putStyle(style);
    return this;
  };

  /**
   * Adds an circle to PDF.
   *
   * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
   * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
   * @param {number} r Radius (in units declared at inception of PDF document)
   * @param {string=} style A string specifying the painting style or null. Valid styles include:
   * 'S' [default] - stroke,
   * 'F' - fill,
   * and 'DF' (or 'FD') -  fill then stroke.
   * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
   * method calls. The last drawing method call used to define the shape should not have a null style argument.
   *
   * In "advanced" API mode this parameter is deprecated.
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name circle
   */
  API.__private__.circle = API.circle = function(x, y, r, style) {
    if (isNaN(x) || isNaN(y) || isNaN(r) || !isValidStyle(style)) {
      throw new Error("Invalid arguments passed to jsPDF.circle");
    }
    return this.ellipse(x, y, r, r, style);
  };

  /**
   * Sets text font face, variant for upcoming text elements.
   * See output of jsPDF.getFontList() for possible font names, styles.
   *
   * @param {string} fontName Font name or family. Example: "times".
   * @param {string} fontStyle Font style or variant. Example: "italic".
   * @param {number | string} fontWeight Weight of the Font. Example: "normal" | 400
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setFont
   */
  API.setFont = function(fontName, fontStyle, fontWeight) {
    if (fontWeight) {
      fontStyle = combineFontStyleAndFontWeight(fontStyle, fontWeight);
    }
    activeFontKey = getFont(fontName, fontStyle, {
      disableWarning: false
    });
    return this;
  };

  /**
   * Gets text font face, variant for upcoming text elements.
   *
   * @function
   * @instance
   * @returns {Object}
   * @memberof jsPDF#
   * @name getFont
   */
  var getFontEntry = (API.__private__.getFont = API.getFont = function() {
    return fonts[getFont.apply(API, arguments)];
  });

  /**
   * Returns an object - a tree of fontName to fontStyle relationships available to
   * active PDF document.
   *
   * @public
   * @function
   * @instance
   * @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
   * @memberof jsPDF#
   * @name getFontList
   */
  API.__private__.getFontList = API.getFontList = function() {
    var list = {},
      fontName,
      fontStyle;

    for (fontName in fontmap) {
      if (fontmap.hasOwnProperty(fontName)) {
        list[fontName] = [];
        for (fontStyle in fontmap[fontName]) {
          if (fontmap[fontName].hasOwnProperty(fontStyle)) {
            list[fontName].push(fontStyle);
          }
        }
      }
    }
    return list;
  };

  /**
   * Add a custom font to the current instance.
   *
   * @param {string} postScriptName PDF specification full name for the font.
   * @param {string} id PDF-document-instance-specific label assinged to the font.
   * @param {string} fontStyle Style of the Font.
   * @param {number | string} fontWeight Weight of the Font.
   * @param {Object} encoding Encoding_name-to-Font_metrics_object mapping.
   * @function
   * @instance
   * @memberof jsPDF#
   * @name addFont
   * @returns {string} fontId
   */
  API.addFont = function(
    postScriptName,
    fontName,
    fontStyle,
    fontWeight,
    encoding
  ) {
    var encodingOptions = [
      "StandardEncoding",
      "MacRomanEncoding",
      "Identity-H",
      "WinAnsiEncoding"
    ];
    if (arguments[3] && encodingOptions.indexOf(arguments[3]) !== -1) {
      //IE 11 fix
      encoding = arguments[3];
    } else if (arguments[3] && encodingOptions.indexOf(arguments[3]) == -1) {
      fontStyle = combineFontStyleAndFontWeight(fontStyle, fontWeight);
    }
    encoding = encoding || "Identity-H";
    return addFont.call(this, postScriptName, fontName, fontStyle, encoding);
  };

  var lineWidth = options.lineWidth || 0.200025; // 2mm
  /**
   * Sets line width for upcoming lines.
   *
   * @param {number} width Line width (in units declared at inception of PDF document).
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setLineWidth
   */
  var setLineWidth = (API.__private__.setLineWidth = API.setLineWidth = function(
    width
  ) {
    out(hpf(scale(width)) + " w");
    return this;
  });

  /**
   * Sets the dash pattern for upcoming lines.
   *
   * To reset the settings simply call the method without any parameters.
   * @param {Array<number>} dashArray An array containing 0-2 numbers. The first number sets the length of the
   * dashes, the second number the length of the gaps. If the second number is missing, the gaps are considered
   * to be as long as the dashes. An empty array means solid, unbroken lines.
   * @param {number} dashPhase The phase lines start with.
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setLineDashPattern
   */
  API.__private__.setLineDash = jsPDF.API.setLineDash = jsPDF.API.setLineDashPattern = function(
    dashArray,
    dashPhase
  ) {
    dashArray = dashArray || [];
    dashPhase = dashPhase || 0;

    if (isNaN(dashPhase) || !Array.isArray(dashArray)) {
      throw new Error("Invalid arguments passed to jsPDF.setLineDash");
    }

    dashArray = dashArray
      .map(function(x) {
        return hpf(scale(x));
      })
      .join(" ");
    dashPhase = hpf(scale(dashPhase));

    out("[" + dashArray + "] " + dashPhase + " d");
    return this;
  };

  var lineHeightFactor;

  var getLineHeight = (API.__private__.getLineHeight = API.getLineHeight = function() {
    return activeFontSize * lineHeightFactor;
  });

  API.__private__.getLineHeight = API.getLineHeight = function() {
    return activeFontSize * lineHeightFactor;
  };

  /**
   * Sets the LineHeightFactor of proportion.
   *
   * @param {number} value LineHeightFactor value. Default: 1.15.
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setLineHeightFactor
   */
  var setLineHeightFactor = (API.__private__.setLineHeightFactor = API.setLineHeightFactor = function(
    value
  ) {
    value = value || 1.15;
    if (typeof value === "number") {
      lineHeightFactor = value;
    }
    return this;
  });

  /**
   * Gets the LineHeightFactor, default: 1.15.
   *
   * @function
   * @instance
   * @returns {number} lineHeightFactor
   * @memberof jsPDF#
   * @name getLineHeightFactor
   */
  var getLineHeightFactor = (API.__private__.getLineHeightFactor = API.getLineHeightFactor = function() {
    return lineHeightFactor;
  });

  setLineHeightFactor(options.lineHeight);

  var getHorizontalCoordinate = (API.__private__.getHorizontalCoordinate = function(
    value
  ) {
    return scale(value);
  });

  var getVerticalCoordinate = (API.__private__.getVerticalCoordinate = function(
    value
  ) {
    if (apiMode === ApiMode.ADVANCED) {
      return value;
    } else {
      var pageHeight =
        pagesContext[currentPage].mediaBox.topRightY -
        pagesContext[currentPage].mediaBox.bottomLeftY;
      return pageHeight - scale(value);
    }
  });

  var getHorizontalCoordinateString = (API.__private__.getHorizontalCoordinateString = API.getHorizontalCoordinateString = function(
    value
  ) {
    return hpf(getHorizontalCoordinate(value));
  });

  var getVerticalCoordinateString = (API.__private__.getVerticalCoordinateString = API.getVerticalCoordinateString = function(
    value
  ) {
    return hpf(getVerticalCoordinate(value));
  });

  var strokeColor = options.strokeColor || "0 G";

  /**
   *  Gets the stroke color for upcoming elements.
   *
   * @function
   * @instance
   * @returns {string} colorAsHex
   * @memberof jsPDF#
   * @name getDrawColor
   */
  API.__private__.getStrokeColor = API.getDrawColor = function() {
    return decodeColorString(strokeColor);
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
   * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'.
   * @param {Number} ch2 Color channel value.
   * @param {Number} ch3 Color channel value.
   * @param {Number} ch4 Color channel value.
   *
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setDrawColor
   */
  API.__private__.setStrokeColor = API.setDrawColor = function(
    ch1,
    ch2,
    ch3,
    ch4
  ) {
    var options = {
      ch1: ch1,
      ch2: ch2,
      ch3: ch3,
      ch4: ch4,
      pdfColorType: "draw",
      precision: 2
    };

    strokeColor = encodeColorString(options);
    out(strokeColor);
    return this;
  };

  var fillColor = options.fillColor || "0 g";

  /**
   * Gets the fill color for upcoming elements.
   *
   * @function
   * @instance
   * @returns {string} colorAsHex
   * @memberof jsPDF#
   * @name getFillColor
   */
  API.__private__.getFillColor = API.getFillColor = function() {
    return decodeColorString(fillColor);
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
   * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'.
   * @param {Number} ch2 Color channel value.
   * @param {Number} ch3 Color channel value.
   * @param {Number} ch4 Color channel value.
   *
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setFillColor
   */
  API.__private__.setFillColor = API.setFillColor = function(
    ch1,
    ch2,
    ch3,
    ch4
  ) {
    var options = {
      ch1: ch1,
      ch2: ch2,
      ch3: ch3,
      ch4: ch4,
      pdfColorType: "fill",
      precision: 2
    };

    fillColor = encodeColorString(options);
    out(fillColor);
    return this;
  };

  var textColor = options.textColor || "0 g";
  /**
   * Gets the text color for upcoming elements.
   *
   * @function
   * @instance
   * @returns {string} colorAsHex
   * @memberof jsPDF#
   * @name getTextColor
   */
  var getTextColor = (API.__private__.getTextColor = API.getTextColor = function() {
    return decodeColorString(textColor);
  });
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
   * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'.
   * @param {Number} ch2 Color channel value.
   * @param {Number} ch3 Color channel value.
   * @param {Number} ch4 Color channel value.
   *
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setTextColor
   */
  API.__private__.setTextColor = API.setTextColor = function(
    ch1,
    ch2,
    ch3,
    ch4
  ) {
    var options = {
      ch1: ch1,
      ch2: ch2,
      ch3: ch3,
      ch4: ch4,
      pdfColorType: "text",
      precision: 3
    };
    textColor = encodeColorString(options);

    return this;
  };

  var activeCharSpace = options.charSpace;

  /**
   * Get global value of CharSpace.
   *
   * @function
   * @instance
   * @returns {number} charSpace
   * @memberof jsPDF#
   * @name getCharSpace
   */
  var getCharSpace = (API.__private__.getCharSpace = API.getCharSpace = function() {
    return parseFloat(activeCharSpace || 0);
  });

  /**
   * Set global value of CharSpace.
   *
   * @param {number} charSpace
   * @function
   * @instance
   * @returns {jsPDF} jsPDF-instance
   * @memberof jsPDF#
   * @name setCharSpace
   */
  API.__private__.setCharSpace = API.setCharSpace = function(charSpace) {
    if (isNaN(charSpace)) {
      throw new Error("Invalid argument passed to jsPDF.setCharSpace");
    }
    activeCharSpace = charSpace;
    return this;
  };

  var lineCapID = 0;
  /**
   * Is an Object providing a mapping from human-readable to
   * integer flag values designating the varieties of line cap
   * and join styles.
   *
   * @memberof jsPDF#
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
   * Sets the line cap styles.
   * See {jsPDF.CapJoinStyles} for variants.
   *
   * @param {String|Number} style A string or number identifying the type of line cap.
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setLineCap
   */
  API.__private__.setLineCap = API.setLineCap = function(style) {
    var id = API.CapJoinStyles[style];
    if (id === undefined) {
      throw new Error(
        "Line cap style of '" +
          style +
          "' is not recognized. See or extend .CapJoinStyles property for valid styles"
      );
    }
    lineCapID = id;
    out(id + " J");

    return this;
  };

  var lineJoinID = 0;
  /**
   * Sets the line join styles.
   * See {jsPDF.CapJoinStyles} for variants.
   *
   * @param {String|Number} style A string or number identifying the type of line join.
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setLineJoin
   */
  API.__private__.setLineJoin = API.setLineJoin = function(style) {
    var id = API.CapJoinStyles[style];
    if (id === undefined) {
      throw new Error(
        "Line join style of '" +
          style +
          "' is not recognized. See or extend .CapJoinStyles property for valid styles"
      );
    }
    lineJoinID = id;
    out(id + " j");

    return this;
  };
  /**
   * Sets the miterLimit property, which effects the maximum miter length.
   *
   * @param {number} length The length of the miter
   * @function
   * @instance
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setLineMiterLimit
   */
  API.__private__.setLineMiterLimit = API.__private__.setMiterLimit = API.setLineMiterLimit = API.setMiterLimit = function(
    length
  ) {
    length = length || 0;
    if (isNaN(length)) {
      throw new Error("Invalid argument passed to jsPDF.setLineMiterLimit");
    }
    out(hpf(scale(length)) + " M");

    return this;
  };

  /**
   * An object representing a pdf graphics state.
   * @class GState
   */

  /**
   *
   * @param parameters A parameter object that contains all properties this graphics state wants to set.
   * Supported are: opacity, stroke-opacity
   * @constructor
   */
  API.GState = GState;

  /**
   * Sets a either previously added {@link GState} (via {@link addGState}) or a new {@link GState}.
   * @param {String|GState} gState If type is string, a previously added GState is used, if type is GState
   * it will be added before use.
   * @function
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setGState
   */
  API.setGState = function(gState) {
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
   * Adds a new Graphics State. Duplicates are automatically eliminated.
   * @param {String} key Might also be null, if no later reference to this gState is needed
   * @param {Object} gState The gState object
   */
  var addGState = function(key, gState) {
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
    }

    // several user keys may point to the same GState object
    key && (gStatesMap[key] = gState.id);

    events.publish("addGState", gState);

    return gState;
  };

  /**
   * Adds a new {@link GState} for later use. See {@link setGState}.
   * @param {String} key
   * @param {GState} gState
   * @function
   * @instance
   * @returns {jsPDF}
   *
   * @memberof jsPDF#
   * @name addGState
   */
  API.addGState = function(key, gState) {
    addGState(key, gState);
    return this;
  };

  /**
   * Saves the current graphics state ("pushes it on the stack"). It can be restored by {@link restoreGraphicsState}
   * later. Here, the general pdf graphics state is meant, also including the current transformation matrix,
   * fill and stroke colors etc.
   * @function
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name saveGraphicsState
   */
  API.saveGraphicsState = function() {
    out("q");
    // as we cannot set font key and size independently we must keep track of both
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
   * @memberof jsPDF#
   * @name restoreGraphicsState
   */
  API.restoreGraphicsState = function() {
    out("Q");

    // restore previous font state
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
   * @param {Matrix} matrix
   * @function
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name setCurrentTransformationMatrix
   */
  API.setCurrentTransformationMatrix = function(matrix) {
    out(matrix.toString() + " cm");
    return this;
  };

  /**
   * Inserts a debug comment into the generated pdf.
   * @function
   * @instance
   * @param {String} text
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name comment
   */
  API.comment = function(text) {
    out("#" + text);
    return this;
  };

  /**
   * Point
   */
  var Point = function(x, y) {
    var _x = x || 0;
    Object.defineProperty(this, "x", {
      enumerable: true,
      get: function() {
        return _x;
      },
      set: function(value) {
        if (!isNaN(value)) {
          _x = parseFloat(value);
        }
      }
    });

    var _y = y || 0;
    Object.defineProperty(this, "y", {
      enumerable: true,
      get: function() {
        return _y;
      },
      set: function(value) {
        if (!isNaN(value)) {
          _y = parseFloat(value);
        }
      }
    });

    var _type = "pt";
    Object.defineProperty(this, "type", {
      enumerable: true,
      get: function() {
        return _type;
      },
      set: function(value) {
        _type = value.toString();
      }
    });
    return this;
  };

  /**
   * Rectangle
   */
  var Rectangle = function(x, y, w, h) {
    Point.call(this, x, y);
    this.type = "rect";

    var _w = w || 0;
    Object.defineProperty(this, "w", {
      enumerable: true,
      get: function() {
        return _w;
      },
      set: function(value) {
        if (!isNaN(value)) {
          _w = parseFloat(value);
        }
      }
    });

    var _h = h || 0;
    Object.defineProperty(this, "h", {
      enumerable: true,
      get: function() {
        return _h;
      },
      set: function(value) {
        if (!isNaN(value)) {
          _h = parseFloat(value);
        }
      }
    });

    return this;
  };

  /**
   * FormObject/RenderTarget
   */

  var RenderTarget = function() {
    this.page = page;
    this.currentPage = currentPage;
    this.pages = pages.slice(0);
    this.pagesContext = pagesContext.slice(0);
    this.x = pageX;
    this.y = pageY;
    this.matrix = pageMatrix;
    this.width = getPageWidth(currentPage);
    this.height = getPageHeight(currentPage);
    this.outputDestination = outputDestination;

    this.id = ""; // set by endFormObject()
    this.objectNumber = -1; // will be set by putXObject()
  };

  RenderTarget.prototype.restore = function() {
    page = this.page;
    currentPage = this.currentPage;
    pagesContext = this.pagesContext;
    pages = this.pages;
    pageX = this.x;
    pageY = this.y;
    pageMatrix = this.matrix;
    setPageWidth(currentPage, this.width);
    setPageHeight(currentPage, this.height);
    outputDestination = this.outputDestination;
  };

  var beginNewRenderTarget = function(x, y, width, height, matrix) {
    // save current state
    renderTargetStack.push(new RenderTarget());

    // clear pages
    page = currentPage = 0;
    pages = [];
    pageX = x;
    pageY = y;

    pageMatrix = matrix;

    beginPage([width, height]);
  };

  var endFormObject = function(key) {
    // only add it if it is not already present (the keys provided by the user must be unique!)
    if (renderTargetMap[key]) return;

    // save the created xObject
    var newXObject = new RenderTarget();

    var xObjectId = "Xo" + (Object.keys(renderTargets).length + 1).toString(10);
    newXObject.id = xObjectId;

    renderTargetMap[key] = xObjectId;
    renderTargets[xObjectId] = newXObject;

    events.publish("addFormObject", newXObject);

    // restore state from stack
    renderTargetStack.pop().restore();
  };

  /**
   * Starts a new pdf form object, which means that all consequent draw calls target a new independent object
   * until {@link endFormObject} is called. The created object can be referenced and drawn later using
   * {@link doFormObject}. Nested form objects are possible.
   * x, y, width, height set the bounding box that is used to clip the content.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {Matrix} matrix The matrix that will be applied to convert the form objects coordinate system to
   * the parent's.
   * @function
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name beginFormObject
   */
  API.beginFormObject = function(x, y, width, height, matrix) {
    // The user can set the output target to a new form object. Nested form objects are possible.
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
   * Completes and saves the form object.
   * @param {String} key The key by which this form object can be referenced.
   * @function
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name endFormObject
   */
  API.endFormObject = function(key) {
    endFormObject(key);
    return this;
  };

  /**
   * Draws the specified form object by referencing to the respective pdf XObject created with
   * {@link API.beginFormObject} and {@link endFormObject}.
   * The location is determined by matrix.
   *
   * @param {String} key The key to the form object.
   * @param {Matrix} matrix The matrix applied before drawing the form object.
   * @function
   * @returns {jsPDF}
   * @memberof jsPDF#
   * @name doFormObject
   */
  API.doFormObject = function(key, matrix) {
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
   * @memberof jsPDF#
   * @name getFormObject
   */
  API.getFormObject = function(key) {
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
   * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf').
   * Uses FileSaver.js-method saveAs.
   *
   * @memberof jsPDF#
   * @name save
   * @function
   * @instance
   * @param  {string} filename The filename including extension.
   * @param  {Object} options An Object with additional options, possible options: 'returnPromise'.
   * @returns {jsPDF|Promise} jsPDF-instance     */
  API.save = function(filename, options) {
    filename = filename || "generated.pdf";

    options = options || {};
    options.returnPromise = options.returnPromise || false;


    // eslint-disable-next-line no-unreachable
    var fs = require("fs");
    var buffer = Buffer.from(getArrayBuffer(buildDocument()));
    if (options.returnPromise === false) {
      fs.writeFileSync(filename, buffer);
    } else {
      return new Promise(function(resolve, reject) {
        fs.writeFile(filename, buffer, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  };

  // applying plugins (more methods) ON TOP of built-in API.
  // this is intentional as we allow plugins to override
  // built-ins
  for (var plugin in jsPDF.API) {
    if (jsPDF.API.hasOwnProperty(plugin)) {
      if (plugin === "events" && jsPDF.API.events.length) {
        (function(events, newEvents) {
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
            events.subscribe.apply(
              events,
              [eventname].concat(
                typeof handler_and_args === "function"
                  ? [handler_and_args]
                  : handler_and_args
              )
            );
          }
        })(events, jsPDF.API.events);
      } else {
        API[plugin] = jsPDF.API[plugin];
      }
    }
  }

  var getPageWidth = (API.getPageWidth = function(pageNumber) {
    pageNumber = pageNumber || currentPage;
    return (
      (pagesContext[pageNumber].mediaBox.topRightX -
        pagesContext[pageNumber].mediaBox.bottomLeftX) /
      scaleFactor
    );
  });

  var setPageWidth = (API.setPageWidth = function(pageNumber, value) {
    pagesContext[pageNumber].mediaBox.topRightX =
      value * scaleFactor + pagesContext[pageNumber].mediaBox.bottomLeftX;
  });

  var getPageHeight = (API.getPageHeight = function(pageNumber) {
    pageNumber = pageNumber || currentPage;
    return (
      (pagesContext[pageNumber].mediaBox.topRightY -
        pagesContext[pageNumber].mediaBox.bottomLeftY) /
      scaleFactor
    );
  });

  var setPageHeight = (API.setPageHeight = function(pageNumber, value) {
    pagesContext[pageNumber].mediaBox.topRightY =
      value * scaleFactor + pagesContext[pageNumber].mediaBox.bottomLeftY;
  });

  /**
   * Object exposing internal API to plugins
   * @public
   * @ignore
   */
  API.internal = {
    pdfEscape: pdfEscape,
    getStyle: getStyle,
    getFont: getFontEntry,
    getFontSize: getFontSize,
    getCharSpace: getCharSpace,
    getTextColor: getTextColor,
    getLineHeight: getLineHeight,
    getLineHeightFactor: getLineHeightFactor,
    write: write,
    getHorizontalCoordinate: getHorizontalCoordinate,
    getVerticalCoordinate: getVerticalCoordinate,
    getCoordinateString: getHorizontalCoordinateString,
    getVerticalCoordinateString: getVerticalCoordinateString,
    collections: {},
    newObject: newObject,
    newAdditionalObject: newAdditionalObject,
    newObjectDeferred: newObjectDeferred,
    newObjectDeferredBegin: newObjectDeferredBegin,
    getFilters: getFilters,
    putStream: putStream,
    events: events,
    scaleFactor: scaleFactor,
    pageSize: {
      getWidth: function() {
        return getPageWidth(currentPage);
      },
      setWidth: function(value) {
        setPageWidth(currentPage, value);
      },
      getHeight: function() {
        return getPageHeight(currentPage);
      },
      setHeight: function(value) {
        setPageHeight(currentPage, value);
      }
    },
    encryptionOptions: encryptionOptions,
    encryption: encryption,
    getEncryptor: getEncryptor,
    output: output,
    getNumberOfPages: getNumberOfPages,
    pages: pages,
    out: out,
    f2: f2,
    f3: f3,
    getPageInfo: getPageInfo,
    getPageInfoByObjId: getPageInfoByObjId,
    getCurrentPageInfo: getCurrentPageInfo,
    getPDFVersion: getPdfVersion,
    Point: Point,
    Rectangle: Rectangle,
    Matrix: Matrix,
    hasHotfix: hasHotfix //Expose the hasHotfix check so plugins can also check them.
  };

  Object.defineProperty(API.internal.pageSize, "width", {
    get: function() {
      return getPageWidth(currentPage);
    },
    set: function(value) {
      setPageWidth(currentPage, value);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(API.internal.pageSize, "height", {
    get: function() {
      return getPageHeight(currentPage);
    },
    set: function(value) {
      setPageHeight(currentPage, value);
    },
    enumerable: true,
    configurable: true
  });

  //////////////////////////////////////////////////////
  // continuing initialization of jsPDF Document object
  //////////////////////////////////////////////////////
  // Add the first page automatically
  addFonts.call(API, standardFonts);
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
 * @memberof jsPDF#
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
 * The version of jsPDF.
 * @name version
 * @type {string}
 * @memberof jsPDF#
 */
jsPDF.version = "2.3.1";

/* global jsPDF */

var jsPDFAPI = jsPDF.API;
var scaleFactor = 1;

var pdfEscape = function(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
};
var pdfUnescape = function(value) {
  return value
    .replace(/\\\\/g, "\\")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")");
};

var f2 = function(number) {
  return number.toFixed(2); // Ie, %.2f
};

var f5 = function(number) {
  return number.toFixed(5); // Ie, %.2f
};

jsPDFAPI.__acroform__ = {};
var inherit = function(child, parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
};

var scale = function(x) {
  return x * scaleFactor;
};

var createFormXObject = function(formObject) {
  var xobj = new AcroFormXObject();
  var height = AcroFormAppearance.internal.getHeight(formObject) || 0;
  var width = AcroFormAppearance.internal.getWidth(formObject) || 0;
  xobj.BBox = [0, 0, Number(f2(width)), Number(f2(height))];
  return xobj;
};

/**
 * Bit-Operations
 */
var setBit = (jsPDFAPI.__acroform__.setBit = function(number, bitPosition) {
  number = number || 0;
  bitPosition = bitPosition || 0;

  if (isNaN(number) || isNaN(bitPosition)) {
    throw new Error(
      "Invalid arguments passed to jsPDF.API.__acroform__.setBit"
    );
  }
  var bitMask = 1 << bitPosition;

  number |= bitMask;

  return number;
});

var clearBit = (jsPDFAPI.__acroform__.clearBit = function(number, bitPosition) {
  number = number || 0;
  bitPosition = bitPosition || 0;

  if (isNaN(number) || isNaN(bitPosition)) {
    throw new Error(
      "Invalid arguments passed to jsPDF.API.__acroform__.clearBit"
    );
  }
  var bitMask = 1 << bitPosition;

  number &= ~bitMask;

  return number;
});

var getBit = (jsPDFAPI.__acroform__.getBit = function(number, bitPosition) {
  if (isNaN(number) || isNaN(bitPosition)) {
    throw new Error(
      "Invalid arguments passed to jsPDF.API.__acroform__.getBit"
    );
  }
  return (number & (1 << bitPosition)) === 0 ? 0 : 1;
});

/*
 * Ff starts counting the bit position at 1 and not like javascript at 0
 */
var getBitForPdf = (jsPDFAPI.__acroform__.getBitForPdf = function(
  number,
  bitPosition
) {
  if (isNaN(number) || isNaN(bitPosition)) {
    throw new Error(
      "Invalid arguments passed to jsPDF.API.__acroform__.getBitForPdf"
    );
  }
  return getBit(number, bitPosition - 1);
});

var setBitForPdf = (jsPDFAPI.__acroform__.setBitForPdf = function(
  number,
  bitPosition
) {
  if (isNaN(number) || isNaN(bitPosition)) {
    throw new Error(
      "Invalid arguments passed to jsPDF.API.__acroform__.setBitForPdf"
    );
  }
  return setBit(number, bitPosition - 1);
});

var clearBitForPdf = (jsPDFAPI.__acroform__.clearBitForPdf = function(
  number,
  bitPosition
) {
  if (isNaN(number) || isNaN(bitPosition)) {
    throw new Error(
      "Invalid arguments passed to jsPDF.API.__acroform__.clearBitForPdf"
    );
  }
  return clearBit(number, bitPosition - 1);
});

var calculateCoordinates = (jsPDFAPI.__acroform__.calculateCoordinates = function(
  args,
  scope
) {
  var getHorizontalCoordinate = scope.internal.getHorizontalCoordinate;
  var getVerticalCoordinate = scope.internal.getVerticalCoordinate;
  var x = args[0];
  var y = args[1];
  var w = args[2];
  var h = args[3];

  var coordinates = {};

  coordinates.lowerLeft_X = getHorizontalCoordinate(x) || 0;
  coordinates.lowerLeft_Y = getVerticalCoordinate(y + h) || 0;
  coordinates.upperRight_X = getHorizontalCoordinate(x + w) || 0;
  coordinates.upperRight_Y = getVerticalCoordinate(y) || 0;

  return [
    Number(f2(coordinates.lowerLeft_X)),
    Number(f2(coordinates.lowerLeft_Y)),
    Number(f2(coordinates.upperRight_X)),
    Number(f2(coordinates.upperRight_Y))
  ];
});

var calculateAppearanceStream = function(formObject) {
  if (formObject.appearanceStreamContent) {
    return formObject.appearanceStreamContent;
  }

  if (!formObject.V && !formObject.DV) {
    return;
  }

  // else calculate it

  var stream = [];
  var text = formObject._V || formObject.DV;
  var calcRes = calculateX(formObject, text);
  var fontKey = formObject.scope.internal.getFont(
    formObject.fontName,
    formObject.fontStyle
  ).id;

  //PDF 32000-1:2008, page 444
  stream.push("/Tx BMC");
  stream.push("q");
  stream.push("BT"); // Begin Text
  stream.push(formObject.scope.__private__.encodeColorString(formObject.color));
  stream.push("/" + fontKey + " " + f2(calcRes.fontSize) + " Tf");
  stream.push("1 0 0 1 0 0 Tm"); // Transformation Matrix
  stream.push(calcRes.text);
  stream.push("ET"); // End Text
  stream.push("Q");
  stream.push("EMC");

  var appearanceStreamContent = createFormXObject(formObject);
  appearanceStreamContent.scope = formObject.scope;
  appearanceStreamContent.stream = stream.join("\n");
  return appearanceStreamContent;
};

var calculateX = function(formObject, text) {
  var maxFontSize =
    formObject.fontSize === 0 ? formObject.maxFontSize : formObject.fontSize;
  var returnValue = {
    text: "",
    fontSize: ""
  };
  // Remove Brackets
  text = text.substr(0, 1) == "(" ? text.substr(1) : text;
  text =
    text.substr(text.length - 1) == ")"
      ? text.substr(0, text.length - 1)
      : text;
  // split into array of words
  var textSplit = text.split(" ");

  var fontSize = maxFontSize; // The Starting fontSize (The Maximum)
  var lineSpacing = 2;
  var borderPadding = 2;

  var height = AcroFormAppearance.internal.getHeight(formObject) || 0;
  height = height < 0 ? -height : height;
  var width = AcroFormAppearance.internal.getWidth(formObject) || 0;
  width = width < 0 ? -width : width;

  var isSmallerThanWidth = function(i, lastLine, fontSize) {
    if (i + 1 < textSplit.length) {
      var tmp = lastLine + " " + textSplit[i + 1];
      var TextWidth = calculateFontSpace(tmp, formObject, fontSize).width;
      var FieldWidth = width - 2 * borderPadding;
      return TextWidth <= FieldWidth;
    } else {
      return false;
    }
  };

  fontSize++;
  FontSize: while (fontSize > 0) {
    text = "";
    fontSize--;
    var textHeight = calculateFontSpace("3", formObject, fontSize).height;
    var startY = formObject.multiline
      ? height - fontSize
      : (height - textHeight) / 2;
    startY += lineSpacing;
    var startX;

    var lastY = startY;
    var firstWordInLine = 0,
      lastWordInLine = 0;
    var lastLength;

    if (fontSize <= 0) {
      // In case, the Text doesn't fit at all
      fontSize = 12;
      text = "(...) Tj\n";
      text +=
        "% Width of Text: " +
        calculateFontSpace(text, formObject, fontSize).width +
        ", FieldWidth:" +
        width +
        "\n";
      break;
    }

    var lastLine = "";
    var lineCount = 0;
    Line: for (var i in textSplit) {
      if (textSplit.hasOwnProperty(i)) {
        lastLine += textSplit[i] + " ";
        // Remove last blank
        lastLine =
          lastLine.substr(lastLine.length - 1) == " "
            ? lastLine.substr(0, lastLine.length - 1)
            : lastLine;
        var key = parseInt(i);
        var nextLineIsSmaller = isSmallerThanWidth(key, lastLine, fontSize);
        var isLastWord = i >= textSplit.length - 1;
        if (nextLineIsSmaller && !isLastWord) {
          lastLine += " ";
          continue; // Line
        } else if (!nextLineIsSmaller && !isLastWord) {
          if (!formObject.multiline) {
            continue FontSize;
          } else {
            if (
              (textHeight + lineSpacing) * (lineCount + 2) + lineSpacing >
              height
            ) {
              // If the Text is higher than the
              // FieldObject
              continue FontSize;
            }
            lastWordInLine = key;
            // go on
          }
        } else if (isLastWord) {
          lastWordInLine = key;
        } else {
          if (
            formObject.multiline &&
            (textHeight + lineSpacing) * (lineCount + 2) + lineSpacing > height
          ) {
            // If the Text is higher than the FieldObject
            continue FontSize;
          }
        }

        var line = "";

        for (var x = firstWordInLine; x <= lastWordInLine; x++) {
          line += textSplit[x] + " ";
        }

        // Remove last blank
        line =
          line.substr(line.length - 1) == " "
            ? line.substr(0, line.length - 1)
            : line;
        // lastLength -= blankSpace.width;
        lastLength = calculateFontSpace(line, formObject, fontSize).width;

        // Calculate startX
        switch (formObject.textAlign) {
          case "right":
            startX = width - lastLength - borderPadding;
            break;
          case "center":
            startX = (width - lastLength) / 2;
            break;
          case "left":
          default:
            startX = borderPadding;
            break;
        }
        text += f2(startX) + " " + f2(lastY) + " Td\n";
        text += "(" + pdfEscape(line) + ") Tj\n";
        // reset X in PDF
        text += -f2(startX) + " 0 Td\n";

        // After a Line, adjust y position
        lastY = -(fontSize + lineSpacing);

        // Reset for next iteration step
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
var calculateFontSpace = function(text, formObject, fontSize) {
  var font = formObject.scope.internal.getFont(
    formObject.fontName,
    formObject.fontStyle
  );
  var width =
    formObject.scope.getStringUnitWidth(text, {
      font: font,
      fontSize: parseFloat(fontSize),
      charSpace: 0
    }) * parseFloat(fontSize);
  var height =
    formObject.scope.getStringUnitWidth("3", {
      font: font,
      fontSize: parseFloat(fontSize),
      charSpace: 0
    }) *
    parseFloat(fontSize) *
    1.5;
  return { height: height, width: width };
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

var annotReferenceCallback = function(scope) {
  //set objId to undefined and force it to get a new objId on buildDocument
  scope.internal.acroformPlugin.acroFormDictionaryRoot.objId = undefined;
  var fields = scope.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
  for (var i in fields) {
    if (fields.hasOwnProperty(i)) {
      var formObject = fields[i];
      //set objId to undefined and force it to get a new objId on buildDocument
      formObject.objId = undefined;
      // add Annot Reference!
      if (formObject.hasAnnotation) {
        // If theres an Annotation Widget in the Form Object, put the
        // Reference in the /Annot array
        createAnnotationReference(formObject, scope);
      }
    }
  }
};

var putForm = function(formObject) {
  if (formObject.scope.internal.acroformPlugin.printedOut) {
    formObject.scope.internal.acroformPlugin.printedOut = false;
    formObject.scope.internal.acroformPlugin.acroFormDictionaryRoot = null;
  }
  formObject.scope.internal.acroformPlugin.acroFormDictionaryRoot.Fields.push(
    formObject
  );
};
/**
 * Create the Reference to the widgetAnnotation, so that it gets referenced
 * in the Annot[] int the+ (Requires the Annotation Plugin)
 */
var createAnnotationReference = function(object, scope) {
  var options = {
    type: "reference",
    object: object
  };
  var findEntry = function(entry) {
    return entry.type === options.type && entry.object === options.object;
  };
  if (
    scope.internal
      .getPageInfo(object.page)
      .pageContext.annotations.find(findEntry) === undefined
  ) {
    scope.internal
      .getPageInfo(object.page)
      .pageContext.annotations.push(options);
  }
};

// Callbacks

var putCatalogCallback = function(scope) {
  // Put reference to AcroForm to DocumentCatalog
  if (
    typeof scope.internal.acroformPlugin.acroFormDictionaryRoot !== "undefined"
  ) {
    // for safety, shouldn't normally be the case
    scope.internal.write(
      "/AcroForm " +
        scope.internal.acroformPlugin.acroFormDictionaryRoot.objId +
        " " +
        0 +
        " R"
    );
  } else {
    throw new Error("putCatalogCallback: Root missing.");
  }
};

/**
 * Adds /Acroform X 0 R to Document Catalog, and creates the AcroForm
 * Dictionary
 */
var AcroFormDictionaryCallback = function(scope) {
  // Remove event
  scope.internal.events.unsubscribe(
    scope.internal.acroformPlugin.acroFormDictionaryRoot._eventID
  );
  delete scope.internal.acroformPlugin.acroFormDictionaryRoot._eventID;
  scope.internal.acroformPlugin.printedOut = true;
};

/**
 * Creates the single Fields and writes them into the Document
 *
 * If fieldArray is set, use the fields that are inside it instead of the
 * fields from the AcroRoot (for the FormXObjects...)
 */
var createFieldCallback = function(fieldArray, scope) {
  var standardFields = !fieldArray;

  if (!fieldArray) {
    // in case there is no fieldArray specified, we want to print out
    // the Fields of the AcroForm
    // Print out Root
    scope.internal.newObjectDeferredBegin(
      scope.internal.acroformPlugin.acroFormDictionaryRoot.objId,
      true
    );
    scope.internal.acroformPlugin.acroFormDictionaryRoot.putStream();
  }

  fieldArray =
    fieldArray || scope.internal.acroformPlugin.acroFormDictionaryRoot.Kids;

  for (var i in fieldArray) {
    if (fieldArray.hasOwnProperty(i)) {
      var fieldObject = fieldArray[i];
      var keyValueList = [];
      var oldRect = fieldObject.Rect;

      if (fieldObject.Rect) {
        fieldObject.Rect = calculateCoordinates(fieldObject.Rect, scope);
      }

      // Start Writing the Object
      scope.internal.newObjectDeferredBegin(fieldObject.objId, true);

      fieldObject.DA = AcroFormAppearance.createDefaultAppearanceStream(
        fieldObject
      );

      if (
        typeof fieldObject === "object" &&
        typeof fieldObject.getKeyValueListForStream === "function"
      ) {
        keyValueList = fieldObject.getKeyValueListForStream();
      }

      fieldObject.Rect = oldRect;

      if (
        fieldObject.hasAppearanceStream &&
        !fieldObject.appearanceStreamContent
      ) {
        // Calculate Appearance
        var appearance = calculateAppearanceStream(fieldObject);
        keyValueList.push({ key: "AP", value: "<</N " + appearance + ">>" });

        scope.internal.acroformPlugin.xForms.push(appearance);
      }

      // Assume AppearanceStreamContent is a Array with N,R,D (at least
      // one of them!)
      if (fieldObject.appearanceStreamContent) {
        var appearanceStreamString = "";
        // Iterate over N,R and D
        for (var k in fieldObject.appearanceStreamContent) {
          if (fieldObject.appearanceStreamContent.hasOwnProperty(k)) {
            var value = fieldObject.appearanceStreamContent[k];
            appearanceStreamString += "/" + k + " ";
            appearanceStreamString += "<<";
            if (Object.keys(value).length >= 1 || Array.isArray(value)) {
              // appearanceStream is an Array or Object!
              for (var i in value) {
                if (value.hasOwnProperty(i)) {
                  var obj = value[i];
                  if (typeof obj === "function") {
                    // if Function is referenced, call it in order
                    // to get the FormXObject
                    obj = obj.call(scope, fieldObject);
                  }
                  appearanceStreamString += "/" + i + " " + obj + " ";

                  // In case the XForm is already used, e.g. OffState
                  // of CheckBoxes, don't add it
                  if (!(scope.internal.acroformPlugin.xForms.indexOf(obj) >= 0))
                    scope.internal.acroformPlugin.xForms.push(obj);
                }
              }
            } else {
              obj = value;
              if (typeof obj === "function") {
                // if Function is referenced, call it in order to
                // get the FormXObject
                obj = obj.call(scope, fieldObject);
              }
              appearanceStreamString += "/" + i + " " + obj;
              if (!(scope.internal.acroformPlugin.xForms.indexOf(obj) >= 0))
                scope.internal.acroformPlugin.xForms.push(obj);
            }
            appearanceStreamString += ">>";
          }
        }

        // appearance stream is a normal Object..
        keyValueList.push({
          key: "AP",
          value: "<<\n" + appearanceStreamString + ">>"
        });
      }

      scope.internal.putStream({
        additionalKeyValues: keyValueList,
        objectId: fieldObject.objId
      });

      scope.internal.out("endobj");
    }
  }
  if (standardFields) {
    createXFormObjectCallback(scope.internal.acroformPlugin.xForms, scope);
  }
};

var createXFormObjectCallback = function(fieldArray, scope) {
  for (var i in fieldArray) {
    if (fieldArray.hasOwnProperty(i)) {
      var key = i;
      var fieldObject = fieldArray[i];
      // Start Writing the Object
      scope.internal.newObjectDeferredBegin(fieldObject.objId, true);

      if (
        typeof fieldObject === "object" &&
        typeof fieldObject.putStream === "function"
      ) {
        fieldObject.putStream();
      }
      delete fieldArray[key];
    }
  }
};

var initializeAcroForm = function(scope, formObject) {
  formObject.scope = scope;
  if (
    scope.internal !== undefined &&
    (scope.internal.acroformPlugin === undefined ||
      scope.internal.acroformPlugin.isInitialized === false)
  ) {
    AcroFormField.FieldNum = 0;
    scope.internal.acroformPlugin = JSON.parse(
      JSON.stringify(acroformPluginTemplate)
    );
    if (scope.internal.acroformPlugin.acroFormDictionaryRoot) {
      throw new Error("Exception while creating AcroformDictionary");
    }
    scaleFactor = scope.internal.scaleFactor;
    // The Object Number of the AcroForm Dictionary
    scope.internal.acroformPlugin.acroFormDictionaryRoot = new AcroFormDictionary();
    scope.internal.acroformPlugin.acroFormDictionaryRoot.scope = scope;

    // add Callback for creating the AcroForm Dictionary
    scope.internal.acroformPlugin.acroFormDictionaryRoot._eventID = scope.internal.events.subscribe(
      "postPutResources",
      function() {
        AcroFormDictionaryCallback(scope);
      }
    );

    scope.internal.events.subscribe("buildDocument", function() {
      annotReferenceCallback(scope);
    }); // buildDocument

    // Register event, that is triggered when the DocumentCatalog is
    // written, in order to add /AcroForm

    scope.internal.events.subscribe("putCatalog", function() {
      putCatalogCallback(scope);
    });

    // Register event, that creates all Fields
    scope.internal.events.subscribe("postPutPages", function(fieldArray) {
      createFieldCallback(fieldArray, scope);
    });

    scope.internal.acroformPlugin.isInitialized = true;
  }
};

//PDF 32000-1:2008, page 26, 7.3.6
var arrayToPdfArray = (jsPDFAPI.__acroform__.arrayToPdfArray = function(
  array,
  objId,
  scope
) {
  var encryptor = function(data) {
    return data;
  };
  if (Array.isArray(array)) {
    var content = "[";
    for (var i = 0; i < array.length; i++) {
      if (i !== 0) {
        content += " ";
      }
      switch (typeof array[i]) {
        case "boolean":
        case "number":
        case "object":
          content += array[i].toString();
          break;
        case "string":
          if (array[i].substr(0, 1) !== "/") {
            if (typeof objId !== "undefined" && scope)
              encryptor = scope.internal.getEncryptor(objId);
            content += "(" + pdfEscape(encryptor(array[i].toString())) + ")";
          } else {
            content += array[i].toString();
          }
          break;
      }
    }
    content += "]";
    return content;
  }
  throw new Error(
    "Invalid argument passed to jsPDF.__acroform__.arrayToPdfArray"
  );
});
function getMatches(string, regex, index) {
  index || (index = 1); // default to the first capturing group
  var matches = [];
  var match;
  while ((match = regex.exec(string))) {
    matches.push(match[index]);
  }
  return matches;
}
var pdfArrayToStringArray = function(array) {
  var result = [];
  if (typeof array === "string") {
    result = getMatches(array, /\((.*?)\)/g);
  }
  return result;
};

var toPdfString = function(string, objId, scope) {
  var encryptor = function(data) {
    return data;
  };
  if (typeof objId !== "undefined" && scope)
    encryptor = scope.internal.getEncryptor(objId);
  string = string || "";
  string.toString();
  string = "(" + pdfEscape(encryptor(string)) + ")";
  return string;
};

// ##########################
// Classes
// ##########################

/**
 * @class AcroFormPDFObject
 * @classdesc A AcroFormPDFObject
 */
var AcroFormPDFObject = function() {
  this._objId = undefined;
  this._scope = undefined;

  /**
   * @name AcroFormPDFObject#objId
   * @type {any}
   */
  Object.defineProperty(this, "objId", {
    get: function() {
      if (typeof this._objId === "undefined") {
        if (typeof this.scope === "undefined") {
          return undefined;
        }
        this._objId = this.scope.internal.newObjectDeferred();
      }
      return this._objId;
    },
    set: function(value) {
      this._objId = value;
    }
  });
  Object.defineProperty(this, "scope", {
    value: this._scope,
    writable: true
  });
};

/**
 * @function AcroFormPDFObject.toString
 */
AcroFormPDFObject.prototype.toString = function() {
  return this.objId + " 0 R";
};

AcroFormPDFObject.prototype.putStream = function() {
  var keyValueList = this.getKeyValueListForStream();
  this.scope.internal.putStream({
    data: this.stream,
    additionalKeyValues: keyValueList,
    objectId: this.objId
  });
  this.scope.internal.out("endobj");
};

/**
 * Returns an key-value-List of all non-configurable Variables from the Object
 *
 * @name getKeyValueListForStream
 * @returns {string}
 */
AcroFormPDFObject.prototype.getKeyValueListForStream = function() {
  var keyValueList = [];
  var keys = Object.getOwnPropertyNames(this).filter(function(key) {
    return (
      key != "content" &&
      key != "appearanceStreamContent" &&
      key != "scope" &&
      key != "objId" &&
      key.substring(0, 1) != "_"
    );
  });

  for (var i in keys) {
    if (Object.getOwnPropertyDescriptor(this, keys[i]).configurable === false) {
      var key = keys[i];
      var value = this[key];

      if (value) {
        if (Array.isArray(value)) {
          keyValueList.push({
            key: key,
            value: arrayToPdfArray(value, this.objId, this.scope)
          });
        } else if (value instanceof AcroFormPDFObject) {
          // In case it is a reference to another PDFObject,
          // take the reference number
          value.scope = this.scope;
          keyValueList.push({ key: key, value: value.objId + " 0 R" });
        } else if (typeof value !== "function") {
          keyValueList.push({ key: key, value: value });
        }
      }
    }
  }
  return keyValueList;
};

var AcroFormXObject = function() {
  AcroFormPDFObject.call(this);

  Object.defineProperty(this, "Type", {
    value: "/XObject",
    configurable: false,
    writable: true
  });

  Object.defineProperty(this, "Subtype", {
    value: "/Form",
    configurable: false,
    writable: true
  });

  Object.defineProperty(this, "FormType", {
    value: 1,
    configurable: false,
    writable: true
  });

  var _BBox = [];
  Object.defineProperty(this, "BBox", {
    configurable: false,
    get: function() {
      return _BBox;
    },
    set: function(value) {
      _BBox = value;
    }
  });

  Object.defineProperty(this, "Resources", {
    value: "2 0 R",
    configurable: false,
    writable: true
  });

  var _stream;
  Object.defineProperty(this, "stream", {
    enumerable: false,
    configurable: true,
    set: function(value) {
      _stream = value.trim();
    },
    get: function() {
      if (_stream) {
        return _stream;
      } else {
        return null;
      }
    }
  });
};

inherit(AcroFormXObject, AcroFormPDFObject);

var AcroFormDictionary = function() {
  AcroFormPDFObject.call(this);

  var _Kids = [];

  Object.defineProperty(this, "Kids", {
    enumerable: false,
    configurable: true,
    get: function() {
      if (_Kids.length > 0) {
        return _Kids;
      } else {
        return undefined;
      }
    }
  });
  Object.defineProperty(this, "Fields", {
    enumerable: false,
    configurable: false,
    get: function() {
      return _Kids;
    }
  });

  // Default Appearance
  var _DA;
  Object.defineProperty(this, "DA", {
    enumerable: false,
    configurable: false,
    get: function() {
      if (!_DA) {
        return undefined;
      }
      var encryptor = function(data) {
        return data;
      };
      if (this.scope) encryptor = this.scope.internal.getEncryptor(this.objId);
      return "(" + pdfEscape(encryptor(_DA)) + ")";
    },
    set: function(value) {
      _DA = value;
    }
  });
};

inherit(AcroFormDictionary, AcroFormPDFObject);

/**
 * The Field Object contains the Variables, that every Field needs
 *
 * @class AcroFormField
 * @classdesc An AcroForm FieldObject
 */
var AcroFormField = function() {
  AcroFormPDFObject.call(this);

  //Annotation-Flag See Table 165
  var _F = 4;
  Object.defineProperty(this, "F", {
    enumerable: false,
    configurable: false,
    get: function() {
      return _F;
    },
    set: function(value) {
      if (!isNaN(value)) {
        _F = value;
      } else {
        throw new Error(
          'Invalid value "' + value + '" for attribute F supplied.'
        );
      }
    }
  });

  /**
   * (PDF 1.2) If set, print the annotation when the page is printed. If clear, never print the annotation, regardless of wether is is displayed on the screen.
   * NOTE 2 This can be useful for annotations representing interactive pushbuttons, which would serve no meaningful purpose on the printed page.
   *
   * @name AcroFormField#showWhenPrinted
   * @default true
   * @type {boolean}
   */
  Object.defineProperty(this, "showWhenPrinted", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(_F, 3));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.F = setBitForPdf(_F, 3);
      } else {
        this.F = clearBitForPdf(_F, 3);
      }
    }
  });

  var _Ff = 0;
  Object.defineProperty(this, "Ff", {
    enumerable: false,
    configurable: false,
    get: function() {
      return _Ff;
    },
    set: function(value) {
      if (!isNaN(value)) {
        _Ff = value;
      } else {
        throw new Error(
          'Invalid value "' + value + '" for attribute Ff supplied.'
        );
      }
    }
  });

  var _Rect = [];
  Object.defineProperty(this, "Rect", {
    enumerable: false,
    configurable: false,
    get: function() {
      if (_Rect.length === 0) {
        return undefined;
      }
      return _Rect;
    },
    set: function(value) {
      if (typeof value !== "undefined") {
        _Rect = value;
      } else {
        _Rect = [];
      }
    }
  });

  /**
   * The x-position of the field.
   *
   * @name AcroFormField#x
   * @default null
   * @type {number}
   */
  Object.defineProperty(this, "x", {
    enumerable: true,
    configurable: true,
    get: function() {
      if (!_Rect || isNaN(_Rect[0])) {
        return 0;
      }
      return _Rect[0];
    },
    set: function(value) {
      _Rect[0] = value;
    }
  });

  /**
   * The y-position of the field.
   *
   * @name AcroFormField#y
   * @default null
   * @type {number}
   */
  Object.defineProperty(this, "y", {
    enumerable: true,
    configurable: true,
    get: function() {
      if (!_Rect || isNaN(_Rect[1])) {
        return 0;
      }
      return _Rect[1];
    },
    set: function(value) {
      _Rect[1] = value;
    }
  });

  /**
   * The width of the field.
   *
   * @name AcroFormField#width
   * @default null
   * @type {number}
   */
  Object.defineProperty(this, "width", {
    enumerable: true,
    configurable: true,
    get: function() {
      if (!_Rect || isNaN(_Rect[2])) {
        return 0;
      }
      return _Rect[2];
    },
    set: function(value) {
      _Rect[2] = value;
    }
  });

  /**
   * The height of the field.
   *
   * @name AcroFormField#height
   * @default null
   * @type {number}
   */
  Object.defineProperty(this, "height", {
    enumerable: true,
    configurable: true,
    get: function() {
      if (!_Rect || isNaN(_Rect[3])) {
        return 0;
      }
      return _Rect[3];
    },
    set: function(value) {
      _Rect[3] = value;
    }
  });

  var _FT = "";
  Object.defineProperty(this, "FT", {
    enumerable: true,
    configurable: false,
    get: function() {
      return _FT;
    },
    set: function(value) {
      switch (value) {
        case "/Btn":
        case "/Tx":
        case "/Ch":
        case "/Sig":
          _FT = value;
          break;
        default:
          throw new Error(
            'Invalid value "' + value + '" for attribute FT supplied.'
          );
      }
    }
  });

  var _T = null;

  Object.defineProperty(this, "T", {
    enumerable: true,
    configurable: false,
    get: function() {
      if (!_T || _T.length < 1) {
        // In case of a Child from a Radio´Group, you don't need a FieldName
        if (this instanceof AcroFormChildClass) {
          return undefined;
        }
        _T = "FieldObject" + AcroFormField.FieldNum++;
      }
      var encryptor = function(data) {
        return data;
      };
      if (this.scope) encryptor = this.scope.internal.getEncryptor(this.objId);
      return "(" + pdfEscape(encryptor(_T)) + ")";
    },
    set: function(value) {
      _T = value.toString();
    }
  });

  /**
   * (Optional) The partial field name (see 12.7.3.2, “Field Names”).
   *
   * @name AcroFormField#fieldName
   * @default null
   * @type {string}
   */
  Object.defineProperty(this, "fieldName", {
    configurable: true,
    enumerable: true,
    get: function() {
      return _T;
    },
    set: function(value) {
      _T = value;
    }
  });

  var _fontName = "helvetica";
  /**
   * The fontName of the font to be used.
   *
   * @name AcroFormField#fontName
   * @default 'helvetica'
   * @type {string}
   */
  Object.defineProperty(this, "fontName", {
    enumerable: true,
    configurable: true,
    get: function() {
      return _fontName;
    },
    set: function(value) {
      _fontName = value;
    }
  });

  var _fontStyle = "normal";
  /**
   * The fontStyle of the font to be used.
   *
   * @name AcroFormField#fontStyle
   * @default 'normal'
   * @type {string}
   */
  Object.defineProperty(this, "fontStyle", {
    enumerable: true,
    configurable: true,
    get: function() {
      return _fontStyle;
    },
    set: function(value) {
      _fontStyle = value;
    }
  });

  var _fontSize = 0;
  /**
   * The fontSize of the font to be used.
   *
   * @name AcroFormField#fontSize
   * @default 0 (for auto)
   * @type {number}
   */
  Object.defineProperty(this, "fontSize", {
    enumerable: true,
    configurable: true,
    get: function() {
      return _fontSize;
    },
    set: function(value) {
      _fontSize = value;
    }
  });

  var _maxFontSize = undefined;
  /**
   * The maximum fontSize of the font to be used.
   *
   * @name AcroFormField#maxFontSize
   * @default 0 (for auto)
   * @type {number}
   */
  Object.defineProperty(this, "maxFontSize", {
    enumerable: true,
    configurable: true,
    get: function() {
      if (_maxFontSize === undefined) {
        // use the old default value here - the value is some kind of random as it depends on the scaleFactor (user unit)
        // ("50" is transformed to the "user space" but then used in "pdf space")
        return 50 / scaleFactor;
      } else {
        return _maxFontSize;
      }
    },
    set: function(value) {
      _maxFontSize = value;
    }
  });

  var _color = "black";
  /**
   * The color of the text
   *
   * @name AcroFormField#color
   * @default 'black'
   * @type {string|rgba}
   */
  Object.defineProperty(this, "color", {
    enumerable: true,
    configurable: true,
    get: function() {
      return _color;
    },
    set: function(value) {
      _color = value;
    }
  });

  var _DA = "/F1 0 Tf 0 g";
  // Defines the default appearance (Needed for variable Text)
  Object.defineProperty(this, "DA", {
    enumerable: true,
    configurable: false,
    get: function() {
      if (
        !_DA ||
        this instanceof AcroFormChildClass ||
        this instanceof AcroFormTextField
      ) {
        return undefined;
      }
      return toPdfString(_DA, this.objId, this.scope);
    },
    set: function(value) {
      value = value.toString();
      _DA = value;
    }
  });

  var _DV = null;
  Object.defineProperty(this, "DV", {
    enumerable: false,
    configurable: false,
    get: function() {
      if (!_DV) {
        return undefined;
      }
      if (this instanceof AcroFormButton === false) {
        return toPdfString(_DV, this.objId, this.scope);
      }
      return _DV;
    },
    set: function(value) {
      value = value.toString();
      if (this instanceof AcroFormButton === false) {
        if (value.substr(0, 1) === "(") {
          _DV = pdfUnescape(value.substr(1, value.length - 2));
        } else {
          _DV = pdfUnescape(value);
        }
      } else {
        _DV = value;
      }
    }
  });

  /**
   * (Optional; inheritable) The default value to which the field reverts when a reset-form action is executed (see 12.7.5.3, “Reset-Form Action”). The format of this value is the same as that of value.
   *
   * @name AcroFormField#defaultValue
   * @default null
   * @type {any}
   */
  Object.defineProperty(this, "defaultValue", {
    enumerable: true,
    configurable: true,
    get: function() {
      if (this instanceof AcroFormButton === true) {
        return pdfUnescape(_DV.substr(1, _DV.length - 1));
      } else {
        return _DV;
      }
    },
    set: function(value) {
      value = value.toString();
      if (this instanceof AcroFormButton === true) {
        _DV = "/" + value;
      } else {
        _DV = value;
      }
    }
  });

  var _V = null;
  Object.defineProperty(this, "_V", {
    enumerable: false,
    configurable: false,
    get: function() {
      if (!_V) {
        return undefined;
      }
      return _V;
    },
    set: function(value) {
      this.V = value;
    }
  });
  Object.defineProperty(this, "V", {
    enumerable: false,
    configurable: false,
    get: function() {
      if (!_V) {
        return undefined;
      }
      if (this instanceof AcroFormButton === false) {
        return toPdfString(_V, this.objId, this.scope);
      }
      return _V;
    },
    set: function(value) {
      value = value.toString();
      if (this instanceof AcroFormButton === false) {
        if (value.substr(0, 1) === "(") {
          _V = pdfUnescape(value.substr(1, value.length - 2));
        } else {
          _V = pdfUnescape(value);
        }
      } else {
        _V = value;
      }
    }
  });

  /**
   * (Optional; inheritable) The field’s value, whose format varies depending on the field type. See the descriptions of individual field types for further information.
   *
   * @name AcroFormField#value
   * @default null
   * @type {any}
   */
  Object.defineProperty(this, "value", {
    enumerable: true,
    configurable: true,
    get: function() {
      if (this instanceof AcroFormButton === true) {
        return pdfUnescape(_V.substr(1, _V.length - 1));
      } else {
        return _V;
      }
    },
    set: function(value) {
      value = value.toString();
      if (this instanceof AcroFormButton === true) {
        _V = "/" + value;
      } else {
        _V = value;
      }
    }
  });

  /**
   * Check if field has annotations
   *
   * @name AcroFormField#hasAnnotation
   * @readonly
   * @type {boolean}
   */
  Object.defineProperty(this, "hasAnnotation", {
    enumerable: true,
    configurable: true,
    get: function() {
      return this.Rect;
    }
  });

  Object.defineProperty(this, "Type", {
    enumerable: true,
    configurable: false,
    get: function() {
      return this.hasAnnotation ? "/Annot" : null;
    }
  });

  Object.defineProperty(this, "Subtype", {
    enumerable: true,
    configurable: false,
    get: function() {
      return this.hasAnnotation ? "/Widget" : null;
    }
  });

  var _hasAppearanceStream = false;
  /**
   * true if field has an appearanceStream
   *
   * @name AcroFormField#hasAppearanceStream
   * @readonly
   * @type {boolean}
   */
  Object.defineProperty(this, "hasAppearanceStream", {
    enumerable: true,
    configurable: true,
    get: function() {
      return _hasAppearanceStream;
    },
    set: function(value) {
      value = Boolean(value);
      _hasAppearanceStream = value;
    }
  });

  /**
   * The page on which the AcroFormField is placed
   *
   * @name AcroFormField#page
   * @type {number}
   */
  var _page;
  Object.defineProperty(this, "page", {
    enumerable: true,
    configurable: true,
    get: function() {
      if (!_page) {
        return undefined;
      }
      return _page;
    },
    set: function(value) {
      _page = value;
    }
  });

  /**
   * If set, the user may not change the value of the field. Any associated widget annotations will not interact with the user; that is, they will not respond to mouse clicks or change their appearance in response to mouse motions. This flag is useful for fields whose values are computed or imported from a database.
   *
   * @name AcroFormField#readOnly
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "readOnly", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 1));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 1);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 1);
      }
    }
  });

  /**
   * If set, the field shall have a value at the time it is exported by a submitform action (see 12.7.5.2, “Submit-Form Action”).
   *
   * @name AcroFormField#required
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "required", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 2));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 2);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 2);
      }
    }
  });

  /**
   * If set, the field shall not be exported by a submit-form action (see 12.7.5.2, “Submit-Form Action”)
   *
   * @name AcroFormField#noExport
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "noExport", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 3));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 3);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 3);
      }
    }
  });

  var _Q = null;
  Object.defineProperty(this, "Q", {
    enumerable: true,
    configurable: false,
    get: function() {
      if (_Q === null) {
        return undefined;
      }
      return _Q;
    },
    set: function(value) {
      if ([0, 1, 2].indexOf(value) !== -1) {
        _Q = value;
      } else {
        throw new Error(
          'Invalid value "' + value + '" for attribute Q supplied.'
        );
      }
    }
  });

  /**
   * (Optional; inheritable) A code specifying the form of quadding (justification) that shall be used in displaying the text:
   * 'left', 'center', 'right'
   *
   * @name AcroFormField#textAlign
   * @default 'left'
   * @type {string}
   */
  Object.defineProperty(this, "textAlign", {
    get: function() {
      var result;
      switch (_Q) {
        case 0:
        default:
          result = "left";
          break;
        case 1:
          result = "center";
          break;
        case 2:
          result = "right";
          break;
      }
      return result;
    },
    configurable: true,
    enumerable: true,
    set: function(value) {
      switch (value) {
        case "right":
        case 2:
          _Q = 2;
          break;
        case "center":
        case 1:
          _Q = 1;
          break;
        case "left":
        case 0:
        default:
          _Q = 0;
      }
    }
  });
};

inherit(AcroFormField, AcroFormPDFObject);

/**
 * @class AcroFormChoiceField
 * @extends AcroFormField
 */
var AcroFormChoiceField = function() {
  AcroFormField.call(this);
  // Field Type = Choice Field
  this.FT = "/Ch";
  // options
  this.V = "()";

  this.fontName = "zapfdingbats";
  // Top Index
  var _TI = 0;

  Object.defineProperty(this, "TI", {
    enumerable: true,
    configurable: false,
    get: function() {
      return _TI;
    },
    set: function(value) {
      _TI = value;
    }
  });

  /**
   * (Optional) For scrollable list boxes, the top index (the index in the Opt array of the first option visible in the list). Default value: 0.
   *
   * @name AcroFormChoiceField#topIndex
   * @default 0
   * @type {number}
   */
  Object.defineProperty(this, "topIndex", {
    enumerable: true,
    configurable: true,
    get: function() {
      return _TI;
    },
    set: function(value) {
      _TI = value;
    }
  });

  var _Opt = [];
  Object.defineProperty(this, "Opt", {
    enumerable: true,
    configurable: false,
    get: function() {
      return arrayToPdfArray(_Opt, this.objId, this.scope);
    },
    set: function(value) {
      _Opt = pdfArrayToStringArray(value);
    }
  });

  /**
   * @memberof AcroFormChoiceField
   * @name getOptions
   * @function
   * @instance
   * @returns {array} array of Options
   */
  this.getOptions = function() {
    return _Opt;
  };

  /**
   * @memberof AcroFormChoiceField
   * @name setOptions
   * @function
   * @instance
   * @param {array} value
   */
  this.setOptions = function(value) {
    _Opt = value;
    if (this.sort) {
      _Opt.sort();
    }
  };

  /**
   * @memberof AcroFormChoiceField
   * @name addOption
   * @function
   * @instance
   * @param {string} value
   */
  this.addOption = function(value) {
    value = value || "";
    value = value.toString();
    _Opt.push(value);
    if (this.sort) {
      _Opt.sort();
    }
  };

  /**
   * @memberof AcroFormChoiceField
   * @name removeOption
   * @function
   * @instance
   * @param {string} value
   * @param {boolean} allEntries (default: false)
   */
  this.removeOption = function(value, allEntries) {
    allEntries = allEntries || false;
    value = value || "";
    value = value.toString();

    while (_Opt.indexOf(value) !== -1) {
      _Opt.splice(_Opt.indexOf(value), 1);
      if (allEntries === false) {
        break;
      }
    }
  };

  /**
   * If set, the field is a combo box; if clear, the field is a list box.
   *
   * @name AcroFormChoiceField#combo
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "combo", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 18));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 18);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 18);
      }
    }
  });

  /**
   * If set, the combo box shall include an editable text box as well as a drop-down list; if clear, it shall include only a drop-down list. This flag shall be used only if the Combo flag is set.
   *
   * @name AcroFormChoiceField#edit
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "edit", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 19));
    },
    set: function(value) {
      //PDF 32000-1:2008, page 444
      if (this.combo === true) {
        if (Boolean(value) === true) {
          this.Ff = setBitForPdf(this.Ff, 19);
        } else {
          this.Ff = clearBitForPdf(this.Ff, 19);
        }
      }
    }
  });

  /**
   * If set, the field’s option items shall be sorted alphabetically. This flag is intended for use by writers, not by readers. Conforming readers shall display the options in the order in which they occur in the Opt array (see Table 231).
   *
   * @name AcroFormChoiceField#sort
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "sort", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 20));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 20);
        _Opt.sort();
      } else {
        this.Ff = clearBitForPdf(this.Ff, 20);
      }
    }
  });

  /**
   * (PDF 1.4) If set, more than one of the field’s option items may be selected simultaneously; if clear, at most one item shall be selected
   *
   * @name AcroFormChoiceField#multiSelect
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "multiSelect", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 22));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 22);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 22);
      }
    }
  });

  /**
   * (PDF 1.4) If set, text entered in the field shall not be spellchecked. This flag shall not be used unless the Combo and Edit flags are both set.
   *
   * @name AcroFormChoiceField#doNotSpellCheck
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "doNotSpellCheck", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 23));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 23);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 23);
      }
    }
  });

  /**
   * (PDF 1.5) If set, the new value shall be committed as soon as a selection is made (commonly with the pointing device). In this case, supplying a value for a field involves three actions: selecting the field for fill-in, selecting a choice for the fill-in value, and leaving that field, which finalizes or “commits” the data choice and triggers any actions associated with the entry or changing of this data. If this flag is on, then processing does not wait for leaving the field action to occur, but immediately proceeds to the third step.
   * This option enables applications to perform an action once a selection is made, without requiring the user to exit the field. If clear, the new value is not committed until the user exits the field.
   *
   * @name AcroFormChoiceField#commitOnSelChange
   * @default false
   * @type {boolean}
   */
  Object.defineProperty(this, "commitOnSelChange", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 27));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 27);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 27);
      }
    }
  });

  this.hasAppearanceStream = false;
};
inherit(AcroFormChoiceField, AcroFormField);

/**
 * @class AcroFormListBox
 * @extends AcroFormChoiceField
 * @extends AcroFormField
 */
var AcroFormListBox = function() {
  AcroFormChoiceField.call(this);
  this.fontName = "helvetica";

  //PDF 32000-1:2008, page 444
  this.combo = false;
};
inherit(AcroFormListBox, AcroFormChoiceField);

/**
 * @class AcroFormComboBox
 * @extends AcroFormListBox
 * @extends AcroFormChoiceField
 * @extends AcroFormField
 */
var AcroFormComboBox = function() {
  AcroFormListBox.call(this);
  this.combo = true;
};
inherit(AcroFormComboBox, AcroFormListBox);

/**
 * @class AcroFormEditBox
 * @extends AcroFormComboBox
 * @extends AcroFormListBox
 * @extends AcroFormChoiceField
 * @extends AcroFormField
 */
var AcroFormEditBox = function() {
  AcroFormComboBox.call(this);
  this.edit = true;
};
inherit(AcroFormEditBox, AcroFormComboBox);

/**
 * @class AcroFormButton
 * @extends AcroFormField
 */
var AcroFormButton = function() {
  AcroFormField.call(this);
  this.FT = "/Btn";

  /**
   * (Radio buttons only) If set, exactly one radio button shall be selected at all times; selecting the currently selected button has no effect. If clear, clicking the selected button deselects it, leaving no button selected.
   *
   * @name AcroFormButton#noToggleToOff
   * @type {boolean}
   */
  Object.defineProperty(this, "noToggleToOff", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 15));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 15);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 15);
      }
    }
  });

  /**
   * If set, the field is a set of radio buttons; if clear, the field is a checkbox. This flag may be set only if the Pushbutton flag is clear.
   *
   * @name AcroFormButton#radio
   * @type {boolean}
   */
  Object.defineProperty(this, "radio", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 16));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 16);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 16);
      }
    }
  });

  /**
   * If set, the field is a pushbutton that does not retain a permanent value.
   *
   * @name AcroFormButton#pushButton
   * @type {boolean}
   */
  Object.defineProperty(this, "pushButton", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 17));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 17);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 17);
      }
    }
  });

  /**
   * (PDF 1.5) If set, a group of radio buttons within a radio button field that use the same value for the on state will turn on and off in unison; that is if one is checked, they are all checked. If clear, the buttons are mutually exclusive (the same behavior as HTML radio buttons).
   *
   * @name AcroFormButton#radioIsUnison
   * @type {boolean}
   */
  Object.defineProperty(this, "radioIsUnison", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 26));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 26);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 26);
      }
    }
  });

  var _MK = {};
  Object.defineProperty(this, "MK", {
    enumerable: false,
    configurable: false,
    get: function() {
      var encryptor = function(data) {
        return data;
      };
      if (this.scope) encryptor = this.scope.internal.getEncryptor(this.objId);
      if (Object.keys(_MK).length !== 0) {
        var result = [];
        result.push("<<");
        var key;
        for (key in _MK) {
          result.push("/" + key + " (" + pdfEscape(encryptor(_MK[key])) + ")");
        }
        result.push(">>");
        return result.join("\n");
      }
      return undefined;
    },
    set: function(value) {
      if (typeof value === "object") {
        _MK = value;
      }
    }
  });

  /**
   * From the PDF reference:
   * (Optional, button fields only) The widget annotation's normal caption which shall be displayed when it is not interacting with the user.
   * Unlike the remaining entries listed in this Table which apply only to widget annotations associated with pushbutton fields (see Pushbuttons in 12.7.4.2, "Button Fields"), the CA entry may be used with any type of button field, including check boxes (see Check Boxes in 12.7.4.2, "Button Fields") and radio buttons (Radio Buttons in 12.7.4.2, "Button Fields").
   *
   * - '8' = Cross,
   * - 'l' =  Circle,
   * - '' = nothing
   * @name AcroFormButton#caption
   * @type {string}
   */
  Object.defineProperty(this, "caption", {
    enumerable: true,
    configurable: true,
    get: function() {
      return _MK.CA || "";
    },
    set: function(value) {
      if (typeof value === "string") {
        _MK.CA = value;
      }
    }
  });

  var _AS;
  Object.defineProperty(this, "AS", {
    enumerable: false,
    configurable: false,
    get: function() {
      return _AS;
    },
    set: function(value) {
      _AS = value;
    }
  });

  /**
   * (Required if the appearance dictionary AP contains one or more subdictionaries; PDF 1.2) The annotation's appearance state, which selects the applicable appearance stream from an appearance subdictionary (see Section 12.5.5, "Appearance Streams")
   *
   * @name AcroFormButton#appearanceState
   * @type {any}
   */
  Object.defineProperty(this, "appearanceState", {
    enumerable: true,
    configurable: true,
    get: function() {
      return _AS.substr(1, _AS.length - 1);
    },
    set: function(value) {
      _AS = "/" + value;
    }
  });
};
inherit(AcroFormButton, AcroFormField);

/**
 * @class AcroFormPushButton
 * @extends AcroFormButton
 * @extends AcroFormField
 */
var AcroFormPushButton = function() {
  AcroFormButton.call(this);
  this.pushButton = true;
};
inherit(AcroFormPushButton, AcroFormButton);

/**
 * @class AcroFormRadioButton
 * @extends AcroFormButton
 * @extends AcroFormField
 */
var AcroFormRadioButton = function() {
  AcroFormButton.call(this);
  this.radio = true;
  this.pushButton = false;

  var _Kids = [];
  Object.defineProperty(this, "Kids", {
    enumerable: true,
    configurable: false,
    get: function() {
      return _Kids;
    },
    set: function(value) {
      if (typeof value !== "undefined") {
        _Kids = value;
      } else {
        _Kids = [];
      }
    }
  });
};
inherit(AcroFormRadioButton, AcroFormButton);

/**
 * The Child class of a RadioButton (the radioGroup) -> The single Buttons
 *
 * @class AcroFormChildClass
 * @extends AcroFormField
 * @ignore
 */
var AcroFormChildClass = function() {
  AcroFormField.call(this);

  var _parent;
  Object.defineProperty(this, "Parent", {
    enumerable: false,
    configurable: false,
    get: function() {
      return _parent;
    },
    set: function(value) {
      _parent = value;
    }
  });

  var _optionName;
  Object.defineProperty(this, "optionName", {
    enumerable: false,
    configurable: true,
    get: function() {
      return _optionName;
    },
    set: function(value) {
      _optionName = value;
    }
  });

  var _MK = {};
  Object.defineProperty(this, "MK", {
    enumerable: false,
    configurable: false,
    get: function() {
      var encryptor = function(data) {
        return data;
      };
      if (this.scope) encryptor = this.scope.internal.getEncryptor(this.objId);
      var result = [];
      result.push("<<");
      var key;
      for (key in _MK) {
        result.push("/" + key + " (" + pdfEscape(encryptor(_MK[key])) + ")");
      }
      result.push(">>");
      return result.join("\n");
    },
    set: function(value) {
      if (typeof value === "object") {
        _MK = value;
      }
    }
  });

  /**
   * From the PDF reference:
   * (Optional, button fields only) The widget annotation's normal caption which shall be displayed when it is not interacting with the user.
   * Unlike the remaining entries listed in this Table which apply only to widget annotations associated with pushbutton fields (see Pushbuttons in 12.7.4.2, "Button Fields"), the CA entry may be used with any type of button field, including check boxes (see Check Boxes in 12.7.4.2, "Button Fields") and radio buttons (Radio Buttons in 12.7.4.2, "Button Fields").
   *
   * - '8' = Cross,
   * - 'l' =  Circle,
   * - '' = nothing
   * @name AcroFormButton#caption
   * @type {string}
   */
  Object.defineProperty(this, "caption", {
    enumerable: true,
    configurable: true,
    get: function() {
      return _MK.CA || "";
    },
    set: function(value) {
      if (typeof value === "string") {
        _MK.CA = value;
      }
    }
  });

  var _AS;
  Object.defineProperty(this, "AS", {
    enumerable: false,
    configurable: false,
    get: function() {
      return _AS;
    },
    set: function(value) {
      _AS = value;
    }
  });

  /**
   * (Required if the appearance dictionary AP contains one or more subdictionaries; PDF 1.2) The annotation's appearance state, which selects the applicable appearance stream from an appearance subdictionary (see Section 12.5.5, "Appearance Streams")
   *
   * @name AcroFormButton#appearanceState
   * @type {any}
   */
  Object.defineProperty(this, "appearanceState", {
    enumerable: true,
    configurable: true,
    get: function() {
      return _AS.substr(1, _AS.length - 1);
    },
    set: function(value) {
      _AS = "/" + value;
    }
  });
  this.caption = "l";
  this.appearanceState = "Off";
  // todo: set AppearanceType as variable that can be set from the
  // outside...
  this._AppearanceType = AcroFormAppearance.RadioButton.Circle;
  // The Default appearanceType is the Circle
  this.appearanceStreamContent = this._AppearanceType.createAppearanceStream(
    this.optionName
  );
};
inherit(AcroFormChildClass, AcroFormField);

AcroFormRadioButton.prototype.setAppearance = function(appearance) {
  if (!("createAppearanceStream" in appearance && "getCA" in appearance)) {
    throw new Error(
      "Couldn't assign Appearance to RadioButton. Appearance was Invalid!"
    );
  }
  for (var objId in this.Kids) {
    if (this.Kids.hasOwnProperty(objId)) {
      var child = this.Kids[objId];
      child.appearanceStreamContent = appearance.createAppearanceStream(
        child.optionName
      );
      child.caption = appearance.getCA();
    }
  }
};

AcroFormRadioButton.prototype.createOption = function(name) {
  // Create new Child for RadioGroup
  var child = new AcroFormChildClass();
  child.Parent = this;
  child.optionName = name;
  // Add to Parent
  this.Kids.push(child);

  addField.call(this.scope, child);

  return child;
};

/**
 * @class AcroFormCheckBox
 * @extends AcroFormButton
 * @extends AcroFormField
 */
var AcroFormCheckBox = function() {
  AcroFormButton.call(this);

  this.fontName = "zapfdingbats";
  this.caption = "3";
  this.appearanceState = "On";
  this.value = "On";
  this.textAlign = "center";
  this.appearanceStreamContent = AcroFormAppearance.CheckBox.createAppearanceStream();
};
inherit(AcroFormCheckBox, AcroFormButton);

/**
 * @class AcroFormTextField
 * @extends AcroFormField
 */
var AcroFormTextField = function() {
  AcroFormField.call(this);
  this.FT = "/Tx";

  /**
   * If set, the field may contain multiple lines of text; if clear, the field’s text shall be restricted to a single line.
   *
   * @name AcroFormTextField#multiline
   * @type {boolean}
   */
  Object.defineProperty(this, "multiline", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 13));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 13);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 13);
      }
    }
  });

  /**
   * (PDF 1.4) If set, the text entered in the field represents the pathname of a file whose contents shall be submitted as the value of the field.
   *
   * @name AcroFormTextField#fileSelect
   * @type {boolean}
   */
  Object.defineProperty(this, "fileSelect", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 21));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 21);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 21);
      }
    }
  });

  /**
   * (PDF 1.4) If set, text entered in the field shall not be spell-checked.
   *
   * @name AcroFormTextField#doNotSpellCheck
   * @type {boolean}
   */
  Object.defineProperty(this, "doNotSpellCheck", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 23));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 23);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 23);
      }
    }
  });

  /**
   * (PDF 1.4) If set, the field shall not scroll (horizontally for single-line fields, vertically for multiple-line fields) to accommodate more text than fits within its annotation rectangle. Once the field is full, no further text shall be accepted for interactive form filling; for noninteractive form filling, the filler should take care not to add more character than will visibly fit in the defined area.
   *
   * @name AcroFormTextField#doNotScroll
   * @type {boolean}
   */
  Object.defineProperty(this, "doNotScroll", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 24));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 24);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 24);
      }
    }
  });

  /**
   * (PDF 1.5) May be set only if the MaxLen entry is present in the text field dictionary (see Table 229) and if the Multiline, Password, and FileSelect flags are clear. If set, the field shall be automatically divided into as many equally spaced positions, or combs, as the value of MaxLen, and the text is laid out into those combs.
   *
   * @name AcroFormTextField#comb
   * @type {boolean}
   */
  Object.defineProperty(this, "comb", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 25));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 25);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 25);
      }
    }
  });

  /**
   * (PDF 1.5) If set, the value of this field shall be a rich text string (see 12.7.3.4, “Rich Text Strings”). If the field has a value, the RV entry of the field dictionary (Table 222) shall specify the rich text string.
   *
   * @name AcroFormTextField#richText
   * @type {boolean}
   */
  Object.defineProperty(this, "richText", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 26));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 26);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 26);
      }
    }
  });

  var _MaxLen = null;
  Object.defineProperty(this, "MaxLen", {
    enumerable: true,
    configurable: false,
    get: function() {
      return _MaxLen;
    },
    set: function(value) {
      _MaxLen = value;
    }
  });

  /**
   * (Optional; inheritable) The maximum length of the field’s text, in characters.
   *
   * @name AcroFormTextField#maxLength
   * @type {number}
   */
  Object.defineProperty(this, "maxLength", {
    enumerable: true,
    configurable: true,
    get: function() {
      return _MaxLen;
    },
    set: function(value) {
      if (Number.isInteger(value)) {
        _MaxLen = value;
      }
    }
  });

  Object.defineProperty(this, "hasAppearanceStream", {
    enumerable: true,
    configurable: true,
    get: function() {
      return this.V || this.DV;
    }
  });
};
inherit(AcroFormTextField, AcroFormField);

/**
 * @class AcroFormPasswordField
 * @extends AcroFormTextField
 * @extends AcroFormField
 */
var AcroFormPasswordField = function() {
  AcroFormTextField.call(this);

  /**
   * If set, the field is intended for entering a secure password that should not be echoed visibly to the screen. Characters typed from the keyboard shall instead be echoed in some unreadable form, such as asterisks or bullet characters.
   * NOTE To protect password confidentiality, readers should never store the value of the text field in the PDF file if this flag is set.
   *
   * @name AcroFormTextField#password
   * @type {boolean}
   */
  Object.defineProperty(this, "password", {
    enumerable: true,
    configurable: true,
    get: function() {
      return Boolean(getBitForPdf(this.Ff, 14));
    },
    set: function(value) {
      if (Boolean(value) === true) {
        this.Ff = setBitForPdf(this.Ff, 14);
      } else {
        this.Ff = clearBitForPdf(this.Ff, 14);
      }
    }
  });
  this.password = true;
};
inherit(AcroFormPasswordField, AcroFormTextField);

// Contains Methods for creating standard appearances
var AcroFormAppearance = {
  CheckBox: {
    createAppearanceStream: function() {
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
     * Returns the standard On Appearance for a CheckBox
     *
     * @returns {AcroFormXObject}
     */
    YesPushDown: function(formObject) {
      var xobj = createFormXObject(formObject);
      xobj.scope = formObject.scope;
      var stream = [];
      var fontKey = formObject.scope.internal.getFont(
        formObject.fontName,
        formObject.fontStyle
      ).id;
      var encodedColor = formObject.scope.__private__.encodeColorString(
        formObject.color
      );
      var calcRes = calculateX(formObject, formObject.caption);
      stream.push("0.749023 g");
      stream.push(
        "0 0 " +
          f2(AcroFormAppearance.internal.getWidth(formObject)) +
          " " +
          f2(AcroFormAppearance.internal.getHeight(formObject)) +
          " re"
      );
      stream.push("f");
      stream.push("BMC");
      stream.push("q");
      stream.push("0 0 1 rg");
      stream.push(
        "/" + fontKey + " " + f2(calcRes.fontSize) + " Tf " + encodedColor
      );
      stream.push("BT");
      stream.push(calcRes.text);
      stream.push("ET");
      stream.push("Q");
      stream.push("EMC");
      xobj.stream = stream.join("\n");
      return xobj;
    },

    YesNormal: function(formObject) {
      var xobj = createFormXObject(formObject);
      xobj.scope = formObject.scope;
      var fontKey = formObject.scope.internal.getFont(
        formObject.fontName,
        formObject.fontStyle
      ).id;
      var encodedColor = formObject.scope.__private__.encodeColorString(
        formObject.color
      );
      var stream = [];
      var height = AcroFormAppearance.internal.getHeight(formObject);
      var width = AcroFormAppearance.internal.getWidth(formObject);
      var calcRes = calculateX(formObject, formObject.caption);
      stream.push("1 g");
      stream.push("0 0 " + f2(width) + " " + f2(height) + " re");
      stream.push("f");
      stream.push("q");
      stream.push("0 0 1 rg");
      stream.push("0 0 " + f2(width - 1) + " " + f2(height - 1) + " re");
      stream.push("W");
      stream.push("n");
      stream.push("0 g");
      stream.push("BT");
      stream.push(
        "/" + fontKey + " " + f2(calcRes.fontSize) + " Tf " + encodedColor
      );
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
    OffPushDown: function(formObject) {
      var xobj = createFormXObject(formObject);
      xobj.scope = formObject.scope;
      var stream = [];
      stream.push("0.749023 g");
      stream.push(
        "0 0 " +
          f2(AcroFormAppearance.internal.getWidth(formObject)) +
          " " +
          f2(AcroFormAppearance.internal.getHeight(formObject)) +
          " re"
      );
      stream.push("f");
      xobj.stream = stream.join("\n");
      return xobj;
    }
  },

  RadioButton: {
    Circle: {
      createAppearanceStream: function(name) {
        var appearanceStreamContent = {
          D: {
            Off: AcroFormAppearance.RadioButton.Circle.OffPushDown
          },
          N: {}
        };
        appearanceStreamContent.N[name] =
          AcroFormAppearance.RadioButton.Circle.YesNormal;
        appearanceStreamContent.D[name] =
          AcroFormAppearance.RadioButton.Circle.YesPushDown;
        return appearanceStreamContent;
      },
      getCA: function() {
        return "l";
      },

      YesNormal: function(formObject) {
        var xobj = createFormXObject(formObject);
        xobj.scope = formObject.scope;
        var stream = [];
        // Make the Radius of the Circle relative to min(height, width) of formObject
        var DotRadius =
          AcroFormAppearance.internal.getWidth(formObject) <=
          AcroFormAppearance.internal.getHeight(formObject)
            ? AcroFormAppearance.internal.getWidth(formObject) / 4
            : AcroFormAppearance.internal.getHeight(formObject) / 4;
        // The Borderpadding...
        DotRadius = Number((DotRadius * 0.9).toFixed(5));
        var c = AcroFormAppearance.internal.Bezier_C;
        var DotRadiusBezier = Number((DotRadius * c).toFixed(5));
        /*
         * The Following is a Circle created with Bezier-Curves.
         */
        stream.push("q");
        stream.push(
          "1 0 0 1 " +
            f5(AcroFormAppearance.internal.getWidth(formObject) / 2) +
            " " +
            f5(AcroFormAppearance.internal.getHeight(formObject) / 2) +
            " cm"
        );
        stream.push(DotRadius + " 0 m");
        stream.push(
          DotRadius +
            " " +
            DotRadiusBezier +
            " " +
            DotRadiusBezier +
            " " +
            DotRadius +
            " 0 " +
            DotRadius +
            " c"
        );
        stream.push(
          "-" +
            DotRadiusBezier +
            " " +
            DotRadius +
            " -" +
            DotRadius +
            " " +
            DotRadiusBezier +
            " -" +
            DotRadius +
            " 0 c"
        );
        stream.push(
          "-" +
            DotRadius +
            " -" +
            DotRadiusBezier +
            " -" +
            DotRadiusBezier +
            " -" +
            DotRadius +
            " 0 -" +
            DotRadius +
            " c"
        );
        stream.push(
          DotRadiusBezier +
            " -" +
            DotRadius +
            " " +
            DotRadius +
            " -" +
            DotRadiusBezier +
            " " +
            DotRadius +
            " 0 c"
        );
        stream.push("f");
        stream.push("Q");
        xobj.stream = stream.join("\n");
        return xobj;
      },
      YesPushDown: function(formObject) {
        var xobj = createFormXObject(formObject);
        xobj.scope = formObject.scope;
        var stream = [];
        var DotRadius =
          AcroFormAppearance.internal.getWidth(formObject) <=
          AcroFormAppearance.internal.getHeight(formObject)
            ? AcroFormAppearance.internal.getWidth(formObject) / 4
            : AcroFormAppearance.internal.getHeight(formObject) / 4;
        // The Borderpadding...
        DotRadius = Number((DotRadius * 0.9).toFixed(5));
        // Save results for later use; no need to waste
        // processor ticks on doing math
        var k = Number((DotRadius * 2).toFixed(5));
        var kc = Number((k * AcroFormAppearance.internal.Bezier_C).toFixed(5));
        var dc = Number(
          (DotRadius * AcroFormAppearance.internal.Bezier_C).toFixed(5)
        );

        stream.push("0.749023 g");
        stream.push("q");
        stream.push(
          "1 0 0 1 " +
            f5(AcroFormAppearance.internal.getWidth(formObject) / 2) +
            " " +
            f5(AcroFormAppearance.internal.getHeight(formObject) / 2) +
            " cm"
        );
        stream.push(k + " 0 m");
        stream.push(k + " " + kc + " " + kc + " " + k + " 0 " + k + " c");
        stream.push(
          "-" + kc + " " + k + " -" + k + " " + kc + " -" + k + " 0 c"
        );
        stream.push(
          "-" + k + " -" + kc + " -" + kc + " -" + k + " 0 -" + k + " c"
        );
        stream.push(kc + " -" + k + " " + k + " -" + kc + " " + k + " 0 c");
        stream.push("f");
        stream.push("Q");
        stream.push("0 g");
        stream.push("q");
        stream.push(
          "1 0 0 1 " +
            f5(AcroFormAppearance.internal.getWidth(formObject) / 2) +
            " " +
            f5(AcroFormAppearance.internal.getHeight(formObject) / 2) +
            " cm"
        );
        stream.push(DotRadius + " 0 m");
        stream.push(
          "" +
            DotRadius +
            " " +
            dc +
            " " +
            dc +
            " " +
            DotRadius +
            " 0 " +
            DotRadius +
            " c"
        );
        stream.push(
          "-" +
            dc +
            " " +
            DotRadius +
            " -" +
            DotRadius +
            " " +
            dc +
            " -" +
            DotRadius +
            " 0 c"
        );
        stream.push(
          "-" +
            DotRadius +
            " -" +
            dc +
            " -" +
            dc +
            " -" +
            DotRadius +
            " 0 -" +
            DotRadius +
            " c"
        );
        stream.push(
          dc +
            " -" +
            DotRadius +
            " " +
            DotRadius +
            " -" +
            dc +
            " " +
            DotRadius +
            " 0 c"
        );
        stream.push("f");
        stream.push("Q");
        xobj.stream = stream.join("\n");
        return xobj;
      },
      OffPushDown: function(formObject) {
        var xobj = createFormXObject(formObject);
        xobj.scope = formObject.scope;
        var stream = [];
        var DotRadius =
          AcroFormAppearance.internal.getWidth(formObject) <=
          AcroFormAppearance.internal.getHeight(formObject)
            ? AcroFormAppearance.internal.getWidth(formObject) / 4
            : AcroFormAppearance.internal.getHeight(formObject) / 4;
        // The Borderpadding...
        DotRadius = Number((DotRadius * 0.9).toFixed(5));
        // Save results for later use; no need to waste
        // processor ticks on doing math
        var k = Number((DotRadius * 2).toFixed(5));
        var kc = Number((k * AcroFormAppearance.internal.Bezier_C).toFixed(5));

        stream.push("0.749023 g");
        stream.push("q");
        stream.push(
          "1 0 0 1 " +
            f5(AcroFormAppearance.internal.getWidth(formObject) / 2) +
            " " +
            f5(AcroFormAppearance.internal.getHeight(formObject) / 2) +
            " cm"
        );
        stream.push(k + " 0 m");
        stream.push(k + " " + kc + " " + kc + " " + k + " 0 " + k + " c");
        stream.push(
          "-" + kc + " " + k + " -" + k + " " + kc + " -" + k + " 0 c"
        );
        stream.push(
          "-" + k + " -" + kc + " -" + kc + " -" + k + " 0 -" + k + " c"
        );
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
      createAppearanceStream: function(name) {
        var appearanceStreamContent = {
          D: {
            Off: AcroFormAppearance.RadioButton.Cross.OffPushDown
          },
          N: {}
        };
        appearanceStreamContent.N[name] =
          AcroFormAppearance.RadioButton.Cross.YesNormal;
        appearanceStreamContent.D[name] =
          AcroFormAppearance.RadioButton.Cross.YesPushDown;
        return appearanceStreamContent;
      },
      getCA: function() {
        return "8";
      },

      YesNormal: function(formObject) {
        var xobj = createFormXObject(formObject);
        xobj.scope = formObject.scope;
        var stream = [];
        var cross = AcroFormAppearance.internal.calculateCross(formObject);
        stream.push("q");
        stream.push(
          "1 1 " +
            f2(AcroFormAppearance.internal.getWidth(formObject) - 2) +
            " " +
            f2(AcroFormAppearance.internal.getHeight(formObject) - 2) +
            " re"
        );
        stream.push("W");
        stream.push("n");
        stream.push(f2(cross.x1.x) + " " + f2(cross.x1.y) + " m");
        stream.push(f2(cross.x2.x) + " " + f2(cross.x2.y) + " l");
        stream.push(f2(cross.x4.x) + " " + f2(cross.x4.y) + " m");
        stream.push(f2(cross.x3.x) + " " + f2(cross.x3.y) + " l");
        stream.push("s");
        stream.push("Q");
        xobj.stream = stream.join("\n");
        return xobj;
      },
      YesPushDown: function(formObject) {
        var xobj = createFormXObject(formObject);
        xobj.scope = formObject.scope;
        var cross = AcroFormAppearance.internal.calculateCross(formObject);
        var stream = [];
        stream.push("0.749023 g");
        stream.push(
          "0 0 " +
            f2(AcroFormAppearance.internal.getWidth(formObject)) +
            " " +
            f2(AcroFormAppearance.internal.getHeight(formObject)) +
            " re"
        );
        stream.push("f");
        stream.push("q");
        stream.push(
          "1 1 " +
            f2(AcroFormAppearance.internal.getWidth(formObject) - 2) +
            " " +
            f2(AcroFormAppearance.internal.getHeight(formObject) - 2) +
            " re"
        );
        stream.push("W");
        stream.push("n");
        stream.push(f2(cross.x1.x) + " " + f2(cross.x1.y) + " m");
        stream.push(f2(cross.x2.x) + " " + f2(cross.x2.y) + " l");
        stream.push(f2(cross.x4.x) + " " + f2(cross.x4.y) + " m");
        stream.push(f2(cross.x3.x) + " " + f2(cross.x3.y) + " l");
        stream.push("s");
        stream.push("Q");
        xobj.stream = stream.join("\n");
        return xobj;
      },
      OffPushDown: function(formObject) {
        var xobj = createFormXObject(formObject);
        xobj.scope = formObject.scope;
        var stream = [];
        stream.push("0.749023 g");
        stream.push(
          "0 0 " +
            f2(AcroFormAppearance.internal.getWidth(formObject)) +
            " " +
            f2(AcroFormAppearance.internal.getHeight(formObject)) +
            " re"
        );
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
  createDefaultAppearanceStream: function(formObject) {
    // Set Helvetica to Standard Font (size: auto)
    // Color: Black
    var fontKey = formObject.scope.internal.getFont(
      formObject.fontName,
      formObject.fontStyle
    ).id;
    var encodedColor = formObject.scope.__private__.encodeColorString(
      formObject.color
    );
    var fontSize = formObject.fontSize;
    var result = "/" + fontKey + " " + fontSize + " Tf " + encodedColor;
    return result;
  }
};

AcroFormAppearance.internal = {
  Bezier_C: 0.551915024494,

  calculateCross: function(formObject) {
    var width = AcroFormAppearance.internal.getWidth(formObject);
    var height = AcroFormAppearance.internal.getHeight(formObject);
    var a = Math.min(width, height);

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
AcroFormAppearance.internal.getWidth = function(formObject) {
  var result = 0;
  if (typeof formObject === "object") {
    result = scale(formObject.Rect[2]);
  }
  return result;
};
AcroFormAppearance.internal.getHeight = function(formObject) {
  var result = 0;
  if (typeof formObject === "object") {
    result = scale(formObject.Rect[3]);
  }
  return result;
};

// Public:

/**
 * Add an AcroForm-Field to the jsPDF-instance
 *
 * @name addField
 * @function
 * @instance
 * @param {Object} fieldObject
 * @returns {jsPDF}
 */
var addField = (jsPDFAPI.addField = function(fieldObject) {
  initializeAcroForm(this, fieldObject);

  if (fieldObject instanceof AcroFormField) {
    putForm(fieldObject);
  } else {
    throw new Error("Invalid argument passed to jsPDF.addField.");
  }
  fieldObject.page = fieldObject.scope.internal.getCurrentPageInfo().pageNumber;
  return this;
});

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

jsPDF.AcroForm = {
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

var AcroForm = jsPDF.AcroForm;

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
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function(jsPDFAPI) {

  var namespace = "addImage_";
  jsPDFAPI.__addimage__ = {};

  var UNKNOWN = "UNKNOWN";

  var imageFileTypeHeaders = {
    PNG: [[0x89, 0x50, 0x4e, 0x47]],
    TIFF: [
      [0x4d, 0x4d, 0x00, 0x2a], //Motorola
      [0x49, 0x49, 0x2a, 0x00] //Intel
    ],
    JPEG: [
      [
        0xff,
        0xd8,
        0xff,
        0xe0,
        undefined,
        undefined,
        0x4a,
        0x46,
        0x49,
        0x46,
        0x00
      ], //JFIF
      [
        0xff,
        0xd8,
        0xff,
        0xe1,
        undefined,
        undefined,
        0x45,
        0x78,
        0x69,
        0x66,
        0x00,
        0x00
      ], //Exif
      [0xff, 0xd8, 0xff, 0xdb], //JPEG RAW
      [0xff, 0xd8, 0xff, 0xee] //EXIF RAW
    ],
    JPEG2000: [[0x00, 0x00, 0x00, 0x0c, 0x6a, 0x50, 0x20, 0x20]],
    GIF87a: [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61]],
    GIF89a: [[0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
    WEBP: [
      [
        0x52,
        0x49,
        0x46,
        0x46,
        undefined,
        undefined,
        undefined,
        undefined,
        0x57,
        0x45,
        0x42,
        0x50
      ]
    ],
    BMP: [
      [0x42, 0x4d], //BM - Windows 3.1x, 95, NT, ... etc.
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
   * @param {string|arraybuffer} imageData imageData as binary String or arraybuffer
   * @param {string} format format of file if filetype-recognition fails, e.g. 'JPEG'
   *
   * @returns {string} filetype of Image
   */
  var getImageFileTypeByImageData = (jsPDFAPI.__addimage__.getImageFileTypeByImageData = function(
    imageData,
    fallbackFormat
  ) {
    fallbackFormat = fallbackFormat || UNKNOWN;
    var i;
    var j;
    var result = UNKNOWN;
    var headerSchemata;
    var compareResult;
    var fileType;

    if (isArrayBufferView(imageData)) {
      for (fileType in imageFileTypeHeaders) {
        headerSchemata = imageFileTypeHeaders[fileType];
        for (i = 0; i < headerSchemata.length; i += 1) {
          compareResult = true;
          for (j = 0; j < headerSchemata[i].length; j += 1) {
            if (headerSchemata[i][j] === undefined) {
              continue;
            }
            if (headerSchemata[i][j] !== imageData[j]) {
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
    } else {
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
    }

    if (result === UNKNOWN && fallbackFormat !== UNKNOWN) {
      result = fallbackFormat;
    }
    return result;
  });

  // Image functionality ported from pdf.js
  var putImage = function(image) {
    var out = this.internal.write;
    var putStream = this.internal.putStream;
    var getFilters = this.internal.getFilters;

    var filter = getFilters();
    while (filter.indexOf("FlateEncode") !== -1) {
      filter.splice(filter.indexOf("FlateEncode"), 1);
    }

    image.objectId = this.internal.newObject();

    var additionalKeyValues = [];
    additionalKeyValues.push({ key: "Type", value: "/XObject" });
    additionalKeyValues.push({ key: "Subtype", value: "/Image" });
    additionalKeyValues.push({ key: "Width", value: image.width });
    additionalKeyValues.push({ key: "Height", value: image.height });

    if (image.colorSpace === color_spaces.INDEXED) {
      additionalKeyValues.push({
        key: "ColorSpace",
        value:
          "[/Indexed /DeviceRGB " +
          // if an indexed png defines more than one colour with transparency, we've created a sMask
          (image.palette.length / 3 - 1) +
          " " +
          ("sMask" in image && typeof image.sMask !== "undefined"
            ? image.objectId + 2
            : image.objectId + 1) +
          " 0 R]"
      });
    } else {
      additionalKeyValues.push({
        key: "ColorSpace",
        value: "/" + image.colorSpace
      });
      if (image.colorSpace === color_spaces.DEVICE_CMYK) {
        additionalKeyValues.push({ key: "Decode", value: "[1 0 1 0 1 0 1 0]" });
      }
    }
    additionalKeyValues.push({
      key: "BitsPerComponent",
      value: image.bitsPerComponent
    });
    if (
      "decodeParameters" in image &&
      typeof image.decodeParameters !== "undefined"
    ) {
      additionalKeyValues.push({
        key: "DecodeParms",
        value: "<<" + image.decodeParameters + ">>"
      });
    }
    if ("transparency" in image && Array.isArray(image.transparency)) {
      var transparency = "",
        i = 0,
        len = image.transparency.length;
      for (; i < len; i++)
        transparency +=
          image.transparency[i] + " " + image.transparency[i] + " ";

      additionalKeyValues.push({
        key: "Mask",
        value: "[" + transparency + "]"
      });
    }
    if (typeof image.sMask !== "undefined") {
      additionalKeyValues.push({
        key: "SMask",
        value: image.objectId + 1 + " 0 R"
      });
    }

    var alreadyAppliedFilters =
      typeof image.filter !== "undefined" ? ["/" + image.filter] : undefined;

    putStream({
      data: image.data,
      additionalKeyValues: additionalKeyValues,
      alreadyAppliedFilters: alreadyAppliedFilters,
      objectId: image.objectId
    });

    out("endobj");

    // Soft mask
    if ("sMask" in image && typeof image.sMask !== "undefined") {
      var decodeParameters =
        "/Predictor " +
        image.predictor +
        " /Colors 1 /BitsPerComponent " +
        image.bitsPerComponent +
        " /Columns " +
        image.width;
      var sMask = {
        width: image.width,
        height: image.height,
        colorSpace: "DeviceGray",
        bitsPerComponent: image.bitsPerComponent,
        decodeParameters: decodeParameters,
        data: image.sMask
      };
      if ("filter" in image) {
        sMask.filter = image.filter;
      }
      putImage.call(this, sMask);
    }

    //Palette
    if (image.colorSpace === color_spaces.INDEXED) {
      var objId = this.internal.newObject();
      //out('<< /Filter / ' + img['f'] +' /Length ' + img['pal'].length + '>>');
      //putStream(zlib.compress(img['pal']));
      putStream({
        data: arrayBufferToBinaryString(new Uint8Array(image.palette)),
        objectId: objId
      });
      out("endobj");
    }
  };
  var putResourcesCallback = function() {
    var images = this.internal.collections[namespace + "images"];
    for (var i in images) {
      putImage.call(this, images[i]);
    }
  };
  var putXObjectsDictCallback = function() {
    var images = this.internal.collections[namespace + "images"],
      out = this.internal.write,
      image;
    for (var i in images) {
      image = images[i];
      out("/I" + image.index, image.objectId, "0", "R");
    }
  };

  var checkCompressValue = function(value) {
    if (value && typeof value === "string") value = value.toUpperCase();
    return value in jsPDFAPI.image_compression ? value : image_compression.NONE;
  };

  var initialize = function() {
    if (!this.internal.collections[namespace + "images"]) {
      this.internal.collections[namespace + "images"] = {};
      this.internal.events.subscribe("putResources", putResourcesCallback);
      this.internal.events.subscribe("putXobjectDict", putXObjectsDictCallback);
    }
  };

  var getImages = function() {
    var images = this.internal.collections[namespace + "images"];
    initialize.call(this);
    return images;
  };
  var getImageIndex = function() {
    return Object.keys(this.internal.collections[namespace + "images"]).length;
  };
  var notDefined = function(value) {
    return typeof value === "undefined" || value === null || value.length === 0;
  };
  var generateAliasFromImageData = function(imageData) {
    if (typeof imageData === "string" || isArrayBufferView(imageData)) {
      return sHashCode(imageData);
    }

    return null;
  };

  var isImageTypeSupported = function(type) {
    return typeof jsPDFAPI["process" + type.toUpperCase()] === "function";
  };

  var isDOMElement = function(object) {
    return typeof object === "object" && object.nodeType === 1;
  };

  var getImageDataFromElement = function(element, format) {
    //if element is an image which uses data url definition, just return the dataurl
    if (element.nodeName === "IMG" && element.hasAttribute("src")) {
      var src = "" + element.getAttribute("src");

      //is base64 encoded dataUrl, directly process it
      if (src.indexOf("data:image/") === 0) {
        return atob(
          unescape(src)
            .split("base64,")
            .pop()
        );
      }

      //it is probably an url, try to load it
      var tmpImageData = jsPDFAPI.loadFile(src, true);
      if (tmpImageData !== undefined) {
        return tmpImageData;
      }
    }

    if (element.nodeName === "CANVAS") {
      var mimeType;
      switch (format) {
        case "PNG":
          mimeType = "image/png";
          break;
        case "WEBP":
          mimeType = "image/webp";
          break;
        case "JPEG":
        case "JPG":
        default:
          mimeType = "image/jpeg";
          break;
      }
      return atob(
        element
          .toDataURL(mimeType, 1.0)
          .split("base64,")
          .pop()
      );
    }
  };

  var checkImagesForAlias = function(alias) {
    var images = this.internal.collections[namespace + "images"];
    if (images) {
      for (var e in images) {
        if (alias === images[e].alias) {
          return images[e];
        }
      }
    }
  };

  var determineWidthAndHeight = function(width, height, image) {
    if (!width && !height) {
      width = -96;
      height = -96;
    }
    if (width < 0) {
      width = (-1 * image.width * 72) / width / this.internal.scaleFactor;
    }
    if (height < 0) {
      height = (-1 * image.height * 72) / height / this.internal.scaleFactor;
    }
    if (width === 0) {
      width = (height * image.width) / image.height;
    }
    if (height === 0) {
      height = (width * image.height) / image.width;
    }

    return [width, height];
  };

  var writeImageToPDF = function(x, y, width, height, image, rotation) {
    var dims = determineWidthAndHeight.call(this, width, height, image),
      coord = this.internal.getCoordinateString,
      vcoord = this.internal.getVerticalCoordinateString;

    var images = getImages.call(this);

    width = dims[0];
    height = dims[1];
    images[image.index] = image;

    if (rotation) {
      rotation *= Math.PI / 180;
      var c = Math.cos(rotation);
      var s = Math.sin(rotation);
      //like in pdf Reference do it 4 digits instead of 2
      var f4 = function(number) {
        return number.toFixed(4);
      };
      var rotationTransformationMatrix = [
        f4(c),
        f4(s),
        f4(s * -1),
        f4(c),
        0,
        0,
        "cm"
      ];
    }
    this.internal.write("q"); //Save graphics state
    if (rotation) {
      this.internal.write(
        [1, "0", "0", 1, coord(x), vcoord(y + height), "cm"].join(" ")
      ); //Translate
      this.internal.write(rotationTransformationMatrix.join(" ")); //Rotate
      this.internal.write(
        [coord(width), "0", "0", coord(height), "0", "0", "cm"].join(" ")
      ); //Scale
    } else {
      this.internal.write(
        [
          coord(width),
          "0",
          "0",
          coord(height),
          coord(x),
          vcoord(y + height),
          "cm"
        ].join(" ")
      ); //Translate and Scale
    }

    if (this.isAdvancedAPI()) {
      // draw image bottom up when in "advanced" API mode
      this.internal.write([1, 0, 0, -1, 0, 0, "cm"].join(" "));
    }

    this.internal.write("/I" + image.index + " Do"); //Paint Image
    this.internal.write("Q"); //Restore graphics state
  };

  /**
   * COLOR SPACES
   */
  var color_spaces = (jsPDFAPI.color_spaces = {
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
  });

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
  var image_compression = (jsPDFAPI.image_compression = {
    NONE: "NONE",
    FAST: "FAST",
    MEDIUM: "MEDIUM",
    SLOW: "SLOW"
  });

  /**
   * @name sHashCode
   * @function
   * @param {string} data
   * @returns {string}
   */
  var sHashCode = (jsPDFAPI.__addimage__.sHashCode = function(data) {
    var hash = 0,
      i,
      len;

    if (typeof data === "string") {
      len = data.length;
      for (i = 0; i < len; i++) {
        hash = (hash << 5) - hash + data.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
    } else if (isArrayBufferView(data)) {
      len = data.byteLength / 2;
      for (i = 0; i < len; i++) {
        hash = (hash << 5) - hash + data[i];
        hash |= 0; // Convert to 32bit integer
      }
    }
    return hash;
  });

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
  var validateStringAsBase64 = (jsPDFAPI.__addimage__.validateStringAsBase64 = function(
    possibleBase64String
  ) {
    possibleBase64String = possibleBase64String || "";
    possibleBase64String.toString().trim();

    var result = true;

    if (possibleBase64String.length === 0) {
      result = false;
    }

    if (possibleBase64String.length % 4 !== 0) {
      result = false;
    }

    if (
      /^[A-Za-z0-9+/]+$/.test(
        possibleBase64String.substr(0, possibleBase64String.length - 2)
      ) === false
    ) {
      result = false;
    }

    if (
      /^[A-Za-z0-9/][A-Za-z0-9+/]|[A-Za-z0-9+/]=|==$/.test(
        possibleBase64String.substr(-2)
      ) === false
    ) {
      result = false;
    }
    return result;
  });

  /**
   * Strips out and returns info from a valid base64 data URI
   *
   * @name extractImageFromDataUrl
   * @function
   * @param {string} dataUrl a valid data URI of format 'data:[<MIME-type>][;base64],<data>'
   * @returns {Array}an Array containing the following
   * [0] the complete data URI
   * [1] <MIME-type>
   * [2] format - the second part of the mime-type i.e 'png' in 'image/png'
   * [4] <data>
   */
  var extractImageFromDataUrl = (jsPDFAPI.__addimage__.extractImageFromDataUrl = function(
    dataUrl
  ) {
    dataUrl = dataUrl || "";
    var dataUrlParts = dataUrl.split("base64,");
    var result = null;

    if (dataUrlParts.length === 2) {
      var extractedInfo = /^data:(\w*\/\w*);*(charset=(?!charset=)[\w=-]*)*;*$/.exec(
        dataUrlParts[0]
      );
      if (Array.isArray(extractedInfo)) {
        result = {
          mimeType: extractedInfo[1],
          charset: extractedInfo[2],
          data: dataUrlParts[1]
        };
      }
    }
    return result;
  });

  /**
   * Check to see if ArrayBuffer is supported
   *
   * @name supportsArrayBuffer
   * @function
   * @returns {boolean}
   */
  var supportsArrayBuffer = (jsPDFAPI.__addimage__.supportsArrayBuffer = function() {
    return (
      typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined"
    );
  });

  /**
   * Tests supplied object to determine if ArrayBuffer
   *
   * @name isArrayBuffer
   * @function
   * @param {Object} object an Object
   *
   * @returns {boolean}
   */
  jsPDFAPI.__addimage__.isArrayBuffer = function(object) {
    return supportsArrayBuffer() && object instanceof ArrayBuffer;
  };

  /**
   * Tests supplied object to determine if it implements the ArrayBufferView (TypedArray) interface
   *
   * @name isArrayBufferView
   * @function
   * @param {Object} object an Object
   * @returns {boolean}
   */
  var isArrayBufferView = (jsPDFAPI.__addimage__.isArrayBufferView = function(
    object
  ) {
    return (
      supportsArrayBuffer() &&
      typeof Uint32Array !== "undefined" &&
      (object instanceof Int8Array ||
        object instanceof Uint8Array ||
        (typeof Uint8ClampedArray !== "undefined" &&
          object instanceof Uint8ClampedArray) ||
        object instanceof Int16Array ||
        object instanceof Uint16Array ||
        object instanceof Int32Array ||
        object instanceof Uint32Array ||
        object instanceof Float32Array ||
        object instanceof Float64Array)
    );
  });

  /**
   * Convert Binary String to ArrayBuffer
   *
   * @name binaryStringToUint8Array
   * @public
   * @function
   * @param {string} BinaryString with ImageData
   * @returns {Uint8Array}
   */
  var binaryStringToUint8Array = (jsPDFAPI.__addimage__.binaryStringToUint8Array = function(
    binary_string
  ) {
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  });

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
  var arrayBufferToBinaryString = (jsPDFAPI.__addimage__.arrayBufferToBinaryString = function(
    buffer
  ) {
    try {
      return atob(btoa(String.fromCharCode.apply(null, buffer)));
    } catch (e) {
      if (
        typeof Uint8Array !== "undefined" &&
        typeof Uint8Array.prototype.reduce !== "undefined"
      ) {
        return new Uint8Array(buffer)
          .reduce(function(data, byte) {
            return data.push(String.fromCharCode(byte)), data;
          }, [])
          .join("");
      }
    }
  });

  /**
   * Adds an Image to the PDF.
   *
   * @name addImage
   * @public
   * @function
   * @param {string|HTMLImageElement|HTMLCanvasElement|Uint8Array} imageData imageData as base64 encoded DataUrl or Image-HTMLElement or Canvas-HTMLElement
   * @param {string} format format of file if filetype-recognition fails or in case of a Canvas-Element needs to be specified (default for Canvas is JPEG), e.g. 'JPEG', 'PNG', 'WEBP'
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
  jsPDFAPI.addImage = function() {
    var imageData, format, x, y, w, h, alias, compression, rotation;

    imageData = arguments[0];
    if (typeof arguments[1] === "number") {
      format = UNKNOWN;
      x = arguments[1];
      y = arguments[2];
      w = arguments[3];
      h = arguments[4];
      alias = arguments[5];
      compression = arguments[6];
      rotation = arguments[7];
    } else {
      format = arguments[1];
      x = arguments[2];
      y = arguments[3];
      w = arguments[4];
      h = arguments[5];
      alias = arguments[6];
      compression = arguments[7];
      rotation = arguments[8];
    }

    if (
      typeof imageData === "object" &&
      !isDOMElement(imageData) &&
      "imageData" in imageData
    ) {
      var options = imageData;

      imageData = options.imageData;
      format = options.format || format || UNKNOWN;
      x = options.x || x || 0;
      y = options.y || y || 0;
      w = options.w || options.width || w;
      h = options.h || options.height || h;
      alias = options.alias || alias;
      compression = options.compression || compression;
      rotation = options.rotation || options.angle || rotation;
    }

    //If compression is not explicitly set, determine if we should use compression
    var filter = this.internal.getFilters();
    if (compression === undefined && filter.indexOf("FlateEncode") !== -1) {
      compression = "SLOW";
    }

    if (isNaN(x) || isNaN(y)) {
      throw new Error("Invalid coordinates passed to jsPDF.addImage");
    }

    initialize.call(this);

    var image = processImageData.call(
      this,
      imageData,
      format,
      alias,
      compression
    );

    writeImageToPDF.call(this, x, y, w, h, image, rotation);

    return this;
  };

  var processImageData = function(imageData, format, alias, compression) {
    var result, dataAsBinaryString;

    if (
      typeof imageData === "string" &&
      getImageFileTypeByImageData(imageData) === UNKNOWN
    ) {
      imageData = unescape(imageData);
      var tmpImageData = convertBase64ToBinaryString(imageData, false);

      if (tmpImageData !== "") {
        imageData = tmpImageData;
      } else {
        tmpImageData = jsPDFAPI.loadFile(imageData, true);
        if (tmpImageData !== undefined) {
          imageData = tmpImageData;
        }
      }
    }

    if (isDOMElement(imageData)) {
      imageData = getImageDataFromElement(imageData, format);
    }

    format = getImageFileTypeByImageData(imageData, format);
    if (!isImageTypeSupported(format)) {
      throw new Error(
        "addImage does not support files of type '" +
          format +
          "', please ensure that a plugin for '" +
          format +
          "' support is added."
      );
    }

    // now do the heavy lifting

    if (notDefined(alias)) {
      alias = generateAliasFromImageData(imageData);
    }
    result = checkImagesForAlias.call(this, alias);

    if (!result) {
      if (supportsArrayBuffer()) {
        // no need to convert if imageData is already uint8array
        if (!(imageData instanceof Uint8Array)) {
          dataAsBinaryString = imageData;
          imageData = binaryStringToUint8Array(imageData);
        }
      }

      result = this["process" + format.toUpperCase()](
        imageData,
        getImageIndex.call(this),
        alias,
        checkCompressValue(compression),
        dataAsBinaryString
      );
    }

    if (!result) {
      throw new Error("An unknown error occurred whilst processing the image.");
    }
    return result;
  };

  /**
   * @name convertBase64ToBinaryString
   * @function
   * @param {string} stringData
   * @returns {string} binary string
   */
  var convertBase64ToBinaryString = (jsPDFAPI.__addimage__.convertBase64ToBinaryString = function(
    stringData,
    throwError
  ) {
    throwError = typeof throwError === "boolean" ? throwError : true;
    var base64Info;
    var imageData = "";
    var rawData;

    if (typeof stringData === "string") {
      base64Info = extractImageFromDataUrl(stringData);
      rawData = base64Info !== null ? base64Info.data : stringData;

      try {
        imageData = atob(rawData);
      } catch (e) {
        if (throwError) {
          if (!validateStringAsBase64(rawData)) {
            throw new Error(
              "Supplied Data is not a valid base64-String jsPDF.convertBase64ToBinaryString "
            );
          } else {
            throw new Error(
              "atob-Error in jsPDF.convertBase64ToBinaryString " + e.message
            );
          }
        }
      }
    }
    return imageData;
  });

  /**
   * @name getImageProperties
   * @function
   * @param {Object} imageData
   * @returns {Object}
   */
  jsPDFAPI.getImageProperties = function(imageData) {
    var image;
    var tmpImageData = "";
    var format;

    if (isDOMElement(imageData)) {
      imageData = getImageDataFromElement(imageData);
    }

    if (
      typeof imageData === "string" &&
      getImageFileTypeByImageData(imageData) === UNKNOWN
    ) {
      tmpImageData = convertBase64ToBinaryString(imageData, false);

      if (tmpImageData === "") {
        tmpImageData = jsPDFAPI.loadFile(imageData) || "";
      }
      imageData = tmpImageData;
    }

    format = getImageFileTypeByImageData(imageData);
    if (!isImageTypeSupported(format)) {
      throw new Error(
        "addImage does not support files of type '" +
          format +
          "', please ensure that a plugin for '" +
          format +
          "' support is added."
      );
    }

    if (supportsArrayBuffer() && !(imageData instanceof Uint8Array)) {
      imageData = binaryStringToUint8Array(imageData);
    }

    image = this["process" + format.toUpperCase()](imageData);

    if (!image) {
      throw new Error("An unknown error occurred whilst processing the image");
    }

    image.fileType = format;

    return image;
  };
})(jsPDF.API);

/**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function(jsPDFAPI) {

  var notEmpty = function(obj) {
    if (typeof obj != "undefined") {
      if (obj != "") {
        return true;
      }
    }
  };

  jsPDF.API.events.push([
    "addPage",
    function(addPageData) {
      var pageInfo = this.internal.getPageInfo(addPageData.pageNumber);
      pageInfo.pageContext.annotations = [];
    }
  ]);

  jsPDFAPI.events.push([
    "putPage",
    function(putPageData) {
      var getHorizontalCoordinateString = this.internal.getCoordinateString;
      var getVerticalCoordinateString = this.internal
        .getVerticalCoordinateString;
      var pageInfo = this.internal.getPageInfoByObjId(putPageData.objId);
      var pageAnnos = putPageData.pageContext.annotations;

      var anno, rect, line;
      var found = false;
      for (var a = 0; a < pageAnnos.length && !found; a++) {
        anno = pageAnnos[a];
        switch (anno.type) {
          case "link":
            if (
              notEmpty(anno.options.url) ||
              notEmpty(anno.options.pageNumber)
            ) {
              found = true;
            }
            break;
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
      for (var i = 0; i < pageAnnos.length; i++) {
        anno = pageAnnos[i];
        var escape = this.internal.pdfEscape;
        var encryptor = this.internal.getEncryptor(putPageData.objId);

        switch (anno.type) {
          case "reference":
            // References to Widget Annotations (for AcroForm Fields)
            this.internal.write(" " + anno.object.objId + " 0 R ");
            break;
          case "text":
            // Create a an object for both the text and the popup
            var objText = this.internal.newAdditionalObject();
            var objPopup = this.internal.newAdditionalObject();
            var encryptorText = this.internal.getEncryptor(objText.objId);

            var title = anno.title || "Note";
            rect =
              "/Rect [" +
              getHorizontalCoordinateString(anno.bounds.x) +
              " " +
              getVerticalCoordinateString(anno.bounds.y + anno.bounds.h) +
              " " +
              getHorizontalCoordinateString(anno.bounds.x + anno.bounds.w) +
              " " +
              getVerticalCoordinateString(anno.bounds.y) +
              "] ";

            line =
              "<</Type /Annot /Subtype /" +
              "Text" +
              " " +
              rect +
              "/Contents (" +
              escape(encryptorText(anno.contents)) +
              ")";
            line += " /Popup " + objPopup.objId + " 0 R";
            line += " /P " + pageInfo.objId + " 0 R";
            line += " /T (" + escape(encryptorText(title)) + ") >>";
            objText.content = line;

            var parent = objText.objId + " 0 R";
            var popoff = 30;
            rect =
              "/Rect [" +
              getHorizontalCoordinateString(anno.bounds.x + popoff) +
              " " +
              getVerticalCoordinateString(anno.bounds.y + anno.bounds.h) +
              " " +
              getHorizontalCoordinateString(
                anno.bounds.x + anno.bounds.w + popoff
              ) +
              " " +
              getVerticalCoordinateString(anno.bounds.y) +
              "] ";
            line =
              "<</Type /Annot /Subtype /" +
              "Popup" +
              " " +
              rect +
              " /Parent " +
              parent;
            if (anno.open) {
              line += " /Open true";
            }
            line += " >>";
            objPopup.content = line;

            this.internal.write(objText.objId, "0 R", objPopup.objId, "0 R");

            break;
          case "freetext":
            rect =
              "/Rect [" +
              getHorizontalCoordinateString(anno.bounds.x) +
              " " +
              getVerticalCoordinateString(anno.bounds.y) +
              " " +
              getHorizontalCoordinateString(anno.bounds.x + anno.bounds.w) +
              " " +
              getVerticalCoordinateString(anno.bounds.y + anno.bounds.h) +
              "] ";
            var color = anno.color || "#000000";
            line =
              "<</Type /Annot /Subtype /" +
              "FreeText" +
              " " +
              rect +
              "/Contents (" +
              escape(encryptor(anno.contents)) +
              ")";
            line +=
              " /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#" +
              color +
              ")";
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

            rect =
              "/Rect [" +
              anno.finalBounds.x +
              " " +
              anno.finalBounds.y +
              " " +
              anno.finalBounds.w +
              " " +
              anno.finalBounds.h +
              "] ";

            line = "";
            if (anno.options.url) {
              line =
                "<</Type /Annot /Subtype /Link " +
                rect +
                "/Border [0 0 0] /A <</S /URI /URI (" +
                escape(encryptor(anno.options.url)) +
                ") >>";
            } else if (anno.options.pageNumber) {
              // first page is 0
              var info = this.internal.getPageInfo(anno.options.pageNumber);
              line =
                "<</Type /Annot /Subtype /Link " +
                rect +
                "/Border [0 0 0] /Dest [" +
                info.objId +
                " 0 R";
              anno.options.magFactor = anno.options.magFactor || "XYZ";
              switch (anno.options.magFactor) {
                case "Fit":
                  line += " /Fit]";
                  break;
                case "FitH":
                  line += " /FitH " + anno.options.top + "]";
                  break;
                case "FitV":
                  anno.options.left = anno.options.left || 0;
                  line += " /FitV " + anno.options.left + "]";
                  break;
                case "XYZ":
                default:
                  var top = getVerticalCoordinateString(anno.options.top);
                  anno.options.left = anno.options.left || 0;
                  // 0 or null zoom will not change zoom factor
                  if (typeof anno.options.zoom === "undefined") {
                    anno.options.zoom = 0;
                  }
                  line +=
                    " /XYZ " +
                    anno.options.left +
                    " " +
                    top +
                    " " +
                    anno.options.zoom +
                    "]";
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
    }
  ]);

  /**
   * @name createAnnotation
   * @function
   * @param {Object} options
   */
  jsPDFAPI.createAnnotation = function(options) {
    var pageInfo = this.internal.getCurrentPageInfo();
    switch (options.type) {
      case "link":
        this.link(
          options.bounds.x,
          options.bounds.y,
          options.bounds.w,
          options.bounds.h,
          options
        );
        break;
      case "text":
      case "freetext":
        pageInfo.pageContext.annotations.push(options);
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
  jsPDFAPI.link = function(x, y, w, h, options) {
    var pageInfo = this.internal.getCurrentPageInfo();
    var getHorizontalCoordinateString = this.internal.getCoordinateString;
    var getVerticalCoordinateString = this.internal.getVerticalCoordinateString;

    pageInfo.pageContext.annotations.push({
      finalBounds: {
        x: getHorizontalCoordinateString(x),
        y: getVerticalCoordinateString(y),
        w: getHorizontalCoordinateString(x + w),
        h: getVerticalCoordinateString(y + h)
      },
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
  jsPDFAPI.textWithLink = function(text, x, y, options) {
    var width = this.getTextWidth(text);
    var height = this.internal.getLineHeight() / this.internal.scaleFactor;
    this.text(text, x, y, options);
    //TODO We really need the text baseline height to do this correctly.
    // Or ability to draw text on top, bottom, center, or baseline.
    y += height * 0.2;
    //handle x position based on the align option
    if (options.align === "center") {
      x = x - width / 2; //since starting from center move the x position by half of text width
    }
    if (options.align === "right") {
      x = x - width;
    }
    this.link(x, y - height, width, height, options);
    return width;
  };

  //TODO move into external library
  /**
   * @name getTextWidth
   * @function
   * @param {string} text
   * @returns {number} txtWidth
   */
  jsPDFAPI.getTextWidth = function(text) {
    var fontSize = this.internal.getFontSize();
    var txtWidth =
      (this.getStringUnitWidth(text) * fontSize) / this.internal.scaleFactor;
    return txtWidth;
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
(function(jsPDFAPI) {

  /**
   * Arabic shape substitutions: char code => (isolated, final, initial, medial).
   * Arabic Substition A
   */
  var arabicSubstitionA = {
    0x0621: [0xfe80], // ARABIC LETTER HAMZA
    0x0622: [0xfe81, 0xfe82], // ARABIC LETTER ALEF WITH MADDA ABOVE
    0x0623: [0xfe83, 0xfe84], // ARABIC LETTER ALEF WITH HAMZA ABOVE
    0x0624: [0xfe85, 0xfe86], // ARABIC LETTER WAW WITH HAMZA ABOVE
    0x0625: [0xfe87, 0xfe88], // ARABIC LETTER ALEF WITH HAMZA BELOW
    0x0626: [0xfe89, 0xfe8a, 0xfe8b, 0xfe8c], // ARABIC LETTER YEH WITH HAMZA ABOVE
    0x0627: [0xfe8d, 0xfe8e], // ARABIC LETTER ALEF
    0x0628: [0xfe8f, 0xfe90, 0xfe91, 0xfe92], // ARABIC LETTER BEH
    0x0629: [0xfe93, 0xfe94], // ARABIC LETTER TEH MARBUTA
    0x062a: [0xfe95, 0xfe96, 0xfe97, 0xfe98], // ARABIC LETTER TEH
    0x062b: [0xfe99, 0xfe9a, 0xfe9b, 0xfe9c], // ARABIC LETTER THEH
    0x062c: [0xfe9d, 0xfe9e, 0xfe9f, 0xfea0], // ARABIC LETTER JEEM
    0x062d: [0xfea1, 0xfea2, 0xfea3, 0xfea4], // ARABIC LETTER HAH
    0x062e: [0xfea5, 0xfea6, 0xfea7, 0xfea8], // ARABIC LETTER KHAH
    0x062f: [0xfea9, 0xfeaa], // ARABIC LETTER DAL
    0x0630: [0xfeab, 0xfeac], // ARABIC LETTER THAL
    0x0631: [0xfead, 0xfeae], // ARABIC LETTER REH
    0x0632: [0xfeaf, 0xfeb0], // ARABIC LETTER ZAIN
    0x0633: [0xfeb1, 0xfeb2, 0xfeb3, 0xfeb4], // ARABIC LETTER SEEN
    0x0634: [0xfeb5, 0xfeb6, 0xfeb7, 0xfeb8], // ARABIC LETTER SHEEN
    0x0635: [0xfeb9, 0xfeba, 0xfebb, 0xfebc], // ARABIC LETTER SAD
    0x0636: [0xfebd, 0xfebe, 0xfebf, 0xfec0], // ARABIC LETTER DAD
    0x0637: [0xfec1, 0xfec2, 0xfec3, 0xfec4], // ARABIC LETTER TAH
    0x0638: [0xfec5, 0xfec6, 0xfec7, 0xfec8], // ARABIC LETTER ZAH
    0x0639: [0xfec9, 0xfeca, 0xfecb, 0xfecc], // ARABIC LETTER AIN
    0x063a: [0xfecd, 0xfece, 0xfecf, 0xfed0], // ARABIC LETTER GHAIN
    0x0641: [0xfed1, 0xfed2, 0xfed3, 0xfed4], // ARABIC LETTER FEH
    0x0642: [0xfed5, 0xfed6, 0xfed7, 0xfed8], // ARABIC LETTER QAF
    0x0643: [0xfed9, 0xfeda, 0xfedb, 0xfedc], // ARABIC LETTER KAF
    0x0644: [0xfedd, 0xfede, 0xfedf, 0xfee0], // ARABIC LETTER LAM
    0x0645: [0xfee1, 0xfee2, 0xfee3, 0xfee4], // ARABIC LETTER MEEM
    0x0646: [0xfee5, 0xfee6, 0xfee7, 0xfee8], // ARABIC LETTER NOON
    0x0647: [0xfee9, 0xfeea, 0xfeeb, 0xfeec], // ARABIC LETTER HEH
    0x0648: [0xfeed, 0xfeee], // ARABIC LETTER WAW
    0x0649: [0xfeef, 0xfef0, 64488, 64489], // ARABIC LETTER ALEF MAKSURA
    0x064a: [0xfef1, 0xfef2, 0xfef3, 0xfef4], // ARABIC LETTER YEH
    0x0671: [0xfb50, 0xfb51], // ARABIC LETTER ALEF WASLA
    0x0677: [0xfbdd], // ARABIC LETTER U WITH HAMZA ABOVE
    0x0679: [0xfb66, 0xfb67, 0xfb68, 0xfb69], // ARABIC LETTER TTEH
    0x067a: [0xfb5e, 0xfb5f, 0xfb60, 0xfb61], // ARABIC LETTER TTEHEH
    0x067b: [0xfb52, 0xfb53, 0xfb54, 0xfb55], // ARABIC LETTER BEEH
    0x067e: [0xfb56, 0xfb57, 0xfb58, 0xfb59], // ARABIC LETTER PEH
    0x067f: [0xfb62, 0xfb63, 0xfb64, 0xfb65], // ARABIC LETTER TEHEH
    0x0680: [0xfb5a, 0xfb5b, 0xfb5c, 0xfb5d], // ARABIC LETTER BEHEH
    0x0683: [0xfb76, 0xfb77, 0xfb78, 0xfb79], // ARABIC LETTER NYEH
    0x0684: [0xfb72, 0xfb73, 0xfb74, 0xfb75], // ARABIC LETTER DYEH
    0x0686: [0xfb7a, 0xfb7b, 0xfb7c, 0xfb7d], // ARABIC LETTER TCHEH
    0x0687: [0xfb7e, 0xfb7f, 0xfb80, 0xfb81], // ARABIC LETTER TCHEHEH
    0x0688: [0xfb88, 0xfb89], // ARABIC LETTER DDAL
    0x068c: [0xfb84, 0xfb85], // ARABIC LETTER DAHAL
    0x068d: [0xfb82, 0xfb83], // ARABIC LETTER DDAHAL
    0x068e: [0xfb86, 0xfb87], // ARABIC LETTER DUL
    0x0691: [0xfb8c, 0xfb8d], // ARABIC LETTER RREH
    0x0698: [0xfb8a, 0xfb8b], // ARABIC LETTER JEH
    0x06a4: [0xfb6a, 0xfb6b, 0xfb6c, 0xfb6d], // ARABIC LETTER VEH
    0x06a6: [0xfb6e, 0xfb6f, 0xfb70, 0xfb71], // ARABIC LETTER PEHEH
    0x06a9: [0xfb8e, 0xfb8f, 0xfb90, 0xfb91], // ARABIC LETTER KEHEH
    0x06ad: [0xfbd3, 0xfbd4, 0xfbd5, 0xfbd6], // ARABIC LETTER NG
    0x06af: [0xfb92, 0xfb93, 0xfb94, 0xfb95], // ARABIC LETTER GAF
    0x06b1: [0xfb9a, 0xfb9b, 0xfb9c, 0xfb9d], // ARABIC LETTER NGOEH
    0x06b3: [0xfb96, 0xfb97, 0xfb98, 0xfb99], // ARABIC LETTER GUEH
    0x06ba: [0xfb9e, 0xfb9f], // ARABIC LETTER NOON GHUNNA
    0x06bb: [0xfba0, 0xfba1, 0xfba2, 0xfba3], // ARABIC LETTER RNOON
    0x06be: [0xfbaa, 0xfbab, 0xfbac, 0xfbad], // ARABIC LETTER HEH DOACHASHMEE
    0x06c0: [0xfba4, 0xfba5], // ARABIC LETTER HEH WITH YEH ABOVE
    0x06c1: [0xfba6, 0xfba7, 0xfba8, 0xfba9], // ARABIC LETTER HEH GOAL
    0x06c5: [0xfbe0, 0xfbe1], // ARABIC LETTER KIRGHIZ OE
    0x06c6: [0xfbd9, 0xfbda], // ARABIC LETTER OE
    0x06c7: [0xfbd7, 0xfbd8], // ARABIC LETTER U
    0x06c8: [0xfbdb, 0xfbdc], // ARABIC LETTER YU
    0x06c9: [0xfbe2, 0xfbe3], // ARABIC LETTER KIRGHIZ YU
    0x06cb: [0xfbde, 0xfbdf], // ARABIC LETTER VE
    0x06cc: [0xfbfc, 0xfbfd, 0xfbfe, 0xfbff], // ARABIC LETTER FARSI YEH
    0x06d0: [0xfbe4, 0xfbe5, 0xfbe6, 0xfbe7], //ARABIC LETTER E
    0x06d2: [0xfbae, 0xfbaf], // ARABIC LETTER YEH BARREE
    0x06d3: [0xfbb0, 0xfbb1] // ARABIC LETTER YEH BARREE WITH HAMZA ABOVE
  };

  /*
    var ligaturesSubstitutionA = {
        0xFBEA: []// ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH ALEF ISOLATED FORM
    };
    */

  var ligatures = {
    0xfedf: {
      0xfe82: 0xfef5, // ARABIC LIGATURE LAM WITH ALEF WITH MADDA ABOVE ISOLATED FORM
      0xfe84: 0xfef7, // ARABIC LIGATURE LAM WITH ALEF WITH HAMZA ABOVE ISOLATED FORM
      0xfe88: 0xfef9, // ARABIC LIGATURE LAM WITH ALEF WITH HAMZA BELOW ISOLATED FORM
      0xfe8e: 0xfefb // ARABIC LIGATURE LAM WITH ALEF ISOLATED FORM
    },
    0xfee0: {
      0xfe82: 0xfef6, // ARABIC LIGATURE LAM WITH ALEF WITH MADDA ABOVE FINAL FORM
      0xfe84: 0xfef8, // ARABIC LIGATURE LAM WITH ALEF WITH HAMZA ABOVE FINAL FORM
      0xfe88: 0xfefa, // ARABIC LIGATURE LAM WITH ALEF WITH HAMZA BELOW FINAL FORM
      0xfe8e: 0xfefc // ARABIC LIGATURE LAM WITH ALEF FINAL FORM
    },
    0xfe8d: { 0xfedf: { 0xfee0: { 0xfeea: 0xfdf2 } } }, // ALLAH
    0x0651: {
      0x064c: 0xfc5e, // Shadda + Dammatan
      0x064d: 0xfc5f, // Shadda + Kasratan
      0x064e: 0xfc60, // Shadda + Fatha
      0x064f: 0xfc61, // Shadda + Damma
      0x0650: 0xfc62 // Shadda + Kasra
    }
  };

  var arabic_diacritics = {
    1612: 64606, // Shadda + Dammatan
    1613: 64607, // Shadda + Kasratan
    1614: 64608, // Shadda + Fatha
    1615: 64609, // Shadda + Damma
    1616: 64610 // Shadda + Kasra
  };

  var alfletter = [1570, 1571, 1573, 1575];

  var noChangeInForm = -1;
  var isolatedForm = 0;
  var finalForm = 1;
  var initialForm = 2;
  var medialForm = 3;

  jsPDFAPI.__arabicParser__ = {};

  //private
  var isInArabicSubstitutionA = (jsPDFAPI.__arabicParser__.isInArabicSubstitutionA = function(
    letter
  ) {
    return typeof arabicSubstitionA[letter.charCodeAt(0)] !== "undefined";
  });

  var isArabicLetter = (jsPDFAPI.__arabicParser__.isArabicLetter = function(
    letter
  ) {
    return (
      typeof letter === "string" &&
      /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/.test(
        letter
      )
    );
  });

  var isArabicEndLetter = (jsPDFAPI.__arabicParser__.isArabicEndLetter = function(
    letter
  ) {
    return (
      isArabicLetter(letter) &&
      isInArabicSubstitutionA(letter) &&
      arabicSubstitionA[letter.charCodeAt(0)].length <= 2
    );
  });

  var isArabicAlfLetter = (jsPDFAPI.__arabicParser__.isArabicAlfLetter = function(
    letter
  ) {
    return (
      isArabicLetter(letter) && alfletter.indexOf(letter.charCodeAt(0)) >= 0
    );
  });

  jsPDFAPI.__arabicParser__.arabicLetterHasIsolatedForm = function(letter) {
    return (
      isArabicLetter(letter) &&
      isInArabicSubstitutionA(letter) &&
      arabicSubstitionA[letter.charCodeAt(0)].length >= 1
    );
  };

  var arabicLetterHasFinalForm = (jsPDFAPI.__arabicParser__.arabicLetterHasFinalForm = function(
    letter
  ) {
    return (
      isArabicLetter(letter) &&
      isInArabicSubstitutionA(letter) &&
      arabicSubstitionA[letter.charCodeAt(0)].length >= 2
    );
  });

  jsPDFAPI.__arabicParser__.arabicLetterHasInitialForm = function(letter) {
    return (
      isArabicLetter(letter) &&
      isInArabicSubstitutionA(letter) &&
      arabicSubstitionA[letter.charCodeAt(0)].length >= 3
    );
  };

  var arabicLetterHasMedialForm = (jsPDFAPI.__arabicParser__.arabicLetterHasMedialForm = function(
    letter
  ) {
    return (
      isArabicLetter(letter) &&
      isInArabicSubstitutionA(letter) &&
      arabicSubstitionA[letter.charCodeAt(0)].length == 4
    );
  });

  var resolveLigatures = (jsPDFAPI.__arabicParser__.resolveLigatures = function(
    letters
  ) {
    var i = 0;
    var tmpLigatures = ligatures;
    var result = "";
    var effectedLetters = 0;

    for (i = 0; i < letters.length; i += 1) {
      if (typeof tmpLigatures[letters.charCodeAt(i)] !== "undefined") {
        effectedLetters++;
        tmpLigatures = tmpLigatures[letters.charCodeAt(i)];

        if (typeof tmpLigatures === "number") {
          result += String.fromCharCode(tmpLigatures);
          tmpLigatures = ligatures;
          effectedLetters = 0;
        }
        if (i === letters.length - 1) {
          tmpLigatures = ligatures;
          result += letters.charAt(i - (effectedLetters - 1));
          i = i - (effectedLetters - 1);
          effectedLetters = 0;
        }
      } else {
        tmpLigatures = ligatures;
        result += letters.charAt(i - effectedLetters);
        i = i - effectedLetters;
        effectedLetters = 0;
      }
    }

    return result;
  });

  jsPDFAPI.__arabicParser__.isArabicDiacritic = function(letter) {
    return (
      letter !== undefined &&
      arabic_diacritics[letter.charCodeAt(0)] !== undefined
    );
  };

  var getCorrectForm = (jsPDFAPI.__arabicParser__.getCorrectForm = function(
    currentChar,
    beforeChar,
    nextChar
  ) {
    if (!isArabicLetter(currentChar)) {
      return -1;
    }

    if (isInArabicSubstitutionA(currentChar) === false) {
      return noChangeInForm;
    }
    if (
      !arabicLetterHasFinalForm(currentChar) ||
      (!isArabicLetter(beforeChar) && !isArabicLetter(nextChar)) ||
      (!isArabicLetter(nextChar) && isArabicEndLetter(beforeChar)) ||
      (isArabicEndLetter(currentChar) && !isArabicLetter(beforeChar)) ||
      (isArabicEndLetter(currentChar) && isArabicAlfLetter(beforeChar)) ||
      (isArabicEndLetter(currentChar) && isArabicEndLetter(beforeChar))
    ) {
      return isolatedForm;
    }

    if (
      arabicLetterHasMedialForm(currentChar) &&
      isArabicLetter(beforeChar) &&
      !isArabicEndLetter(beforeChar) &&
      isArabicLetter(nextChar) &&
      arabicLetterHasFinalForm(nextChar)
    ) {
      return medialForm;
    }

    if (isArabicEndLetter(currentChar) || !isArabicLetter(nextChar)) {
      return finalForm;
    }
    return initialForm;
  });

  /**
   * @name processArabic
   * @function
   * @param {string} text
   * @returns {string}
   */
  var parseArabic = function(text) {
    text = text || "";

    var result = "";
    var i = 0;
    var j = 0;
    var position = 0;
    var currentLetter = "";
    var prevLetter = "";
    var nextLetter = "";

    var words = text.split("\\s+");
    var newWords = [];
    for (i = 0; i < words.length; i += 1) {
      newWords.push("");
      for (j = 0; j < words[i].length; j += 1) {
        currentLetter = words[i][j];
        prevLetter = words[i][j - 1];
        nextLetter = words[i][j + 1];
        if (isArabicLetter(currentLetter)) {
          position = getCorrectForm(currentLetter, prevLetter, nextLetter);
          if (position !== -1) {
            newWords[i] += String.fromCharCode(
              arabicSubstitionA[currentLetter.charCodeAt(0)][position]
            );
          } else {
            newWords[i] += currentLetter;
          }
        } else {
          newWords[i] += currentLetter;
        }
      }

      newWords[i] = resolveLigatures(newWords[i]);
    }
    result = newWords.join(" ");

    return result;
  };

  var processArabic = (jsPDFAPI.__arabicParser__.processArabic = jsPDFAPI.processArabic = function() {
    var text =
      typeof arguments[0] === "string" ? arguments[0] : arguments[0].text;
    var tmpText = [];
    var result;

    if (Array.isArray(text)) {
      var i = 0;
      tmpText = [];
      for (i = 0; i < text.length; i += 1) {
        if (Array.isArray(text[i])) {
          tmpText.push([parseArabic(text[i][0]), text[i][1], text[i][2]]);
        } else {
          tmpText.push([parseArabic(text[i])]);
        }
      }
      result = tmpText;
    } else {
      result = parseArabic(text);
    }
    if (typeof arguments[0] === "string") {
      return result;
    } else {
      arguments[0].text = result;
      return arguments[0];
    }
  });

  jsPDFAPI.events.push(["preProcessText", processArabic]);
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
(function(jsPDFAPI) {

  /**
   * Makes the PDF automatically open the print-Dialog when opened in a PDF-viewer.
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
  jsPDFAPI.autoPrint = function(options) {
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
        this.internal.events.subscribe("postPutResources", function() {
          refAutoPrintTag = this.internal.newObject();
          this.internal.out("<<");
          this.internal.out("/S /Named");
          this.internal.out("/Type /Action");
          this.internal.out("/N /Print");
          this.internal.out(">>");
          this.internal.out("endobj");
        });

        this.internal.events.subscribe("putCatalog", function() {
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
(function(jsPDFAPI) {

  /**
   * @class Canvas
   * @classdesc A Canvas Wrapper for jsPDF
   */
  var Canvas = function() {
    var jsPdfInstance = undefined;
    Object.defineProperty(this, "pdf", {
      get: function() {
        return jsPdfInstance;
      },
      set: function(value) {
        jsPdfInstance = value;
      }
    });

    var _width = 150;
    /**
     * The height property is a positive integer reflecting the height HTML attribute of the <canvas> element interpreted in CSS pixels. When the attribute is not specified, or if it is set to an invalid value, like a negative, the default value of 150 is used.
     * This is one of the two properties, the other being width, that controls the size of the canvas.
     *
     * @name width
     */
    Object.defineProperty(this, "width", {
      get: function() {
        return _width;
      },
      set: function(value) {
        if (isNaN(value) || Number.isInteger(value) === false || value < 0) {
          _width = 150;
        } else {
          _width = value;
        }
        if (this.getContext("2d").pageWrapXEnabled) {
          this.getContext("2d").pageWrapX = _width + 1;
        }
      }
    });

    var _height = 300;
    /**
     * The width property is a positive integer reflecting the width HTML attribute of the <canvas> element interpreted in CSS pixels. When the attribute is not specified, or if it is set to an invalid value, like a negative, the default value of 300 is used.
     * This is one of the two properties, the other being height, that controls the size of the canvas.
     *
     * @name height
     */
    Object.defineProperty(this, "height", {
      get: function() {
        return _height;
      },
      set: function(value) {
        if (isNaN(value) || Number.isInteger(value) === false || value < 0) {
          _height = 300;
        } else {
          _height = value;
        }
        if (this.getContext("2d").pageWrapYEnabled) {
          this.getContext("2d").pageWrapY = _height + 1;
        }
      }
    });

    var _childNodes = [];
    Object.defineProperty(this, "childNodes", {
      get: function() {
        return _childNodes;
      },
      set: function(value) {
        _childNodes = value;
      }
    });

    var _style = {};
    Object.defineProperty(this, "style", {
      get: function() {
        return _style;
      },
      set: function(value) {
        _style = value;
      }
    });

    Object.defineProperty(this, "parentNode", {});
  };

  /**
   * The getContext() method returns a drawing context on the canvas, or null if the context identifier is not supported.
   *
   * @name getContext
   * @function
   * @param {string} contextType Is a String containing the context identifier defining the drawing context associated to the canvas. Possible value is "2d", leading to the creation of a Context2D object representing a two-dimensional rendering context.
   * @param {object} contextAttributes
   */
  Canvas.prototype.getContext = function(contextType, contextAttributes) {
    contextType = contextType || "2d";
    var key;

    if (contextType !== "2d") {
      return null;
    }
    for (key in contextAttributes) {
      if (this.pdf.context2d.hasOwnProperty(key)) {
        this.pdf.context2d[key] = contextAttributes[key];
      }
    }
    this.pdf.context2d._canvas = this;
    return this.pdf.context2d;
  };

  /**
   * The toDataURL() method is just a stub to throw an error if accidently called.
   *
   * @name toDataURL
   * @function
   */
  Canvas.prototype.toDataURL = function() {
    throw new Error("toDataURL is not implemented.");
  };

  jsPDFAPI.events.push([
    "initialized",
    function() {
      this.canvas = new Canvas();
      this.canvas.pdf = this;
    }
  ]);

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
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

/**
 * @name cell
 * @module
 */
(function(jsPDFAPI) {

  var NO_MARGINS = { left: 0, top: 0, bottom: 0, right: 0 };

  var px2pt = (0.264583 * 72) / 25.4;
  var printingHeaderRow = false;

  var _initialize = function() {
    if (typeof this.internal.__cell__ === "undefined") {
      this.internal.__cell__ = {};
      this.internal.__cell__.padding = 3;
      this.internal.__cell__.headerFunction = undefined;
      this.internal.__cell__.margins = Object.assign({}, NO_MARGINS);
      this.internal.__cell__.margins.width = this.getPageWidth();
      _reset.call(this);
    }
  };

  var _reset = function() {
    this.internal.__cell__.lastCell = new Cell();
    this.internal.__cell__.pages = 1;
  };

  var Cell = function() {
    var _x = arguments[0];
    Object.defineProperty(this, "x", {
      enumerable: true,
      get: function() {
        return _x;
      },
      set: function(value) {
        _x = value;
      }
    });
    var _y = arguments[1];
    Object.defineProperty(this, "y", {
      enumerable: true,
      get: function() {
        return _y;
      },
      set: function(value) {
        _y = value;
      }
    });
    var _width = arguments[2];
    Object.defineProperty(this, "width", {
      enumerable: true,
      get: function() {
        return _width;
      },
      set: function(value) {
        _width = value;
      }
    });
    var _height = arguments[3];
    Object.defineProperty(this, "height", {
      enumerable: true,
      get: function() {
        return _height;
      },
      set: function(value) {
        _height = value;
      }
    });
    var _text = arguments[4];
    Object.defineProperty(this, "text", {
      enumerable: true,
      get: function() {
        return _text;
      },
      set: function(value) {
        _text = value;
      }
    });
    var _lineNumber = arguments[5];
    Object.defineProperty(this, "lineNumber", {
      enumerable: true,
      get: function() {
        return _lineNumber;
      },
      set: function(value) {
        _lineNumber = value;
      }
    });
    var _align = arguments[6];
    Object.defineProperty(this, "align", {
      enumerable: true,
      get: function() {
        return _align;
      },
      set: function(value) {
        _align = value;
      }
    });

    return this;
  };

  Cell.prototype.clone = function() {
    return new Cell(
      this.x,
      this.y,
      this.width,
      this.height,
      this.text,
      this.lineNumber,
      this.align
    );
  };

  Cell.prototype.toArray = function() {
    return [
      this.x,
      this.y,
      this.width,
      this.height,
      this.text,
      this.lineNumber,
      this.align
    ];
  };

  /**
   * @name setHeaderFunction
   * @function
   * @param {function} func
   */
  jsPDFAPI.setHeaderFunction = function(func) {
    _initialize.call(this);
    this.internal.__cell__.headerFunction =
      typeof func === "function" ? func : undefined;
    return this;
  };

  /**
   * @name getTextDimensions
   * @function
   * @param {string} txt
   * @returns {Object} dimensions
   */
  jsPDFAPI.getTextDimensions = function(text, options) {
    _initialize.call(this);
    options = options || {};
    var fontSize = options.fontSize || this.getFontSize();
    var font = options.font || this.getFont();
    var scaleFactor = options.scaleFactor || this.internal.scaleFactor;
    var width = 0;
    var amountOfLines = 0;
    var height = 0;
    var tempWidth = 0;
    var scope = this;

    if (!Array.isArray(text) && typeof text !== "string") {
      if (typeof text === "number") {
        text = String(text);
      } else {
        throw new Error(
          "getTextDimensions expects text-parameter to be of type String or type Number or an Array of Strings."
        );
      }
    }

    const maxWidth = options.maxWidth;
    if (maxWidth > 0) {
      if (typeof text === "string") {
        text = this.splitTextToSize(text, maxWidth);
      } else if (Object.prototype.toString.call(text) === "[object Array]") {
        text = text.reduce(function(acc, textLine) {
          return acc.concat(scope.splitTextToSize(textLine, maxWidth));
        }, []);
      }
    } else {
      // Without the else clause, it will not work if you do not pass along maxWidth
      text = Array.isArray(text) ? text : [text];
    }

    for (var i = 0; i < text.length; i++) {
      tempWidth = this.getStringUnitWidth(text[i], { font: font }) * fontSize;
      if (width < tempWidth) {
        width = tempWidth;
      }
    }

    if (width !== 0) {
      amountOfLines = text.length;
    }

    width = width / scaleFactor;
    height = Math.max(
      (amountOfLines * fontSize * this.getLineHeightFactor() -
        fontSize * (this.getLineHeightFactor() - 1)) /
        scaleFactor,
      0
    );
    return { w: width, h: height };
  };

  /**
   * @name cellAddPage
   * @function
   */
  jsPDFAPI.cellAddPage = function() {
    _initialize.call(this);

    this.addPage();

    var margins = this.internal.__cell__.margins || NO_MARGINS;
    this.internal.__cell__.lastCell = new Cell(
      margins.left,
      margins.top,
      undefined,
      undefined
    );
    this.internal.__cell__.pages += 1;

    return this;
  };

  /**
   * @name cell
   * @function
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} text
   * @param {number} lineNumber lineNumber
   * @param {string} align
   * @return {jsPDF} jsPDF-instance
   */
  var cell = (jsPDFAPI.cell = function() {
    var currentCell;

    if (arguments[0] instanceof Cell) {
      currentCell = arguments[0];
    } else {
      currentCell = new Cell(
        arguments[0],
        arguments[1],
        arguments[2],
        arguments[3],
        arguments[4],
        arguments[5]
      );
    }
    _initialize.call(this);
    var lastCell = this.internal.__cell__.lastCell;
    var padding = this.internal.__cell__.padding;
    var margins = this.internal.__cell__.margins || NO_MARGINS;
    var tableHeaderRow = this.internal.__cell__.tableHeaderRow;
    var printHeaders = this.internal.__cell__.printHeaders;
    // If this is not the first cell, we must change its position
    if (typeof lastCell.lineNumber !== "undefined") {
      if (lastCell.lineNumber === currentCell.lineNumber) {
        //Same line
        currentCell.x = (lastCell.x || 0) + (lastCell.width || 0);
        currentCell.y = lastCell.y || 0;
      } else {
        //New line
        if (
          lastCell.y + lastCell.height + currentCell.height + margins.bottom >
          this.getPageHeight()
        ) {
          this.cellAddPage();
          currentCell.y = margins.top;
          if (printHeaders && tableHeaderRow) {
            this.printHeaderRow(currentCell.lineNumber, true);
            currentCell.y += tableHeaderRow[0].height;
          }
        } else {
          currentCell.y = lastCell.y + lastCell.height || currentCell.y;
        }
      }
    }

    if (typeof currentCell.text[0] !== "undefined") {
      this.rect(
        currentCell.x,
        currentCell.y,
        currentCell.width,
        currentCell.height,
        printingHeaderRow === true ? "FD" : undefined
      );
      if (currentCell.align === "right") {
        this.text(
          currentCell.text,
          currentCell.x + currentCell.width - padding,
          currentCell.y + padding,
          { align: "right", baseline: "top" }
        );
      } else if (currentCell.align === "center") {
        this.text(
          currentCell.text,
          currentCell.x + currentCell.width / 2,
          currentCell.y + padding,
          {
            align: "center",
            baseline: "top",
            maxWidth: currentCell.width - padding - padding
          }
        );
      } else {
        this.text(
          currentCell.text,
          currentCell.x + padding,
          currentCell.y + padding,
          {
            align: "left",
            baseline: "top",
            maxWidth: currentCell.width - padding - padding
          }
        );
      }
    }
    this.internal.__cell__.lastCell = currentCell;
    return this;
  });

  /**
     * Create a table from a set of data.
     * @name table
     * @function
     * @param {Integer} [x] : left-position for top-left corner of table
     * @param {Integer} [y] top-position for top-left corner of table
     * @param {Object[]} [data] An array of objects containing key-value pairs corresponding to a row of data.
     * @param {String[]} [headers] Omit or null to auto-generate headers at a performance cost

     * @param {Object} [config.printHeaders] True to print column headers at the top of every page
     * @param {Object} [config.autoSize] True to dynamically set the column widths to match the widest cell value
     * @param {Object} [config.margins] margin values for left, top, bottom, and width
     * @param {Object} [config.fontSize] Integer fontSize to use (optional)
     * @param {Object} [config.padding] cell-padding in pt to use (optional)
     * @param {Object} [config.headerBackgroundColor] default is #c8c8c8 (optional)
     * @returns {jsPDF} jsPDF-instance
     */

  jsPDFAPI.table = function(x, y, data, headers, config) {
    _initialize.call(this);
    if (!data) {
      throw new Error("No data for PDF table.");
    }

    config = config || {};

    var headerNames = [],
      headerLabels = [],
      headerAligns = [],
      i,
      columnMatrix = {},
      columnWidths = {},
      column,
      columnMinWidths = [],
      j,
      tableHeaderConfigs = [],
      //set up defaults. If a value is provided in config, defaults will be overwritten:
      autoSize = config.autoSize || false,
      printHeaders = config.printHeaders === false ? false : true,
      fontSize =
        config.css && typeof config.css["font-size"] !== "undefined"
          ? config.css["font-size"] * 16
          : config.fontSize || 12,
      margins =
        config.margins ||
        Object.assign({ width: this.getPageWidth() }, NO_MARGINS),
      padding = typeof config.padding === "number" ? config.padding : 3,
      headerBackgroundColor = config.headerBackgroundColor || "#c8c8c8";

    _reset.call(this);

    this.internal.__cell__.printHeaders = printHeaders;
    this.internal.__cell__.margins = margins;
    this.internal.__cell__.table_font_size = fontSize;
    this.internal.__cell__.padding = padding;
    this.internal.__cell__.headerBackgroundColor = headerBackgroundColor;
    this.setFontSize(fontSize);

    // Set header values
    if (headers === undefined || headers === null) {
      // No headers defined so we derive from data
      headerNames = Object.keys(data[0]);
      headerLabels = headerNames;
      headerAligns = headerNames.map(function() {
        return "left";
      });
    } else if (Array.isArray(headers) && typeof headers[0] === "object") {
      headerNames = headers.map(function(header) {
        return header.name;
      });
      headerLabels = headers.map(function(header) {
        return header.prompt || header.name || "";
      });
      headerAligns = headers.map(function(header) {
        return header.align || "left";
      });
      // Split header configs into names and prompts
      for (i = 0; i < headers.length; i += 1) {
        columnWidths[headers[i].name] = headers[i].width * px2pt;
      }
    } else if (Array.isArray(headers) && typeof headers[0] === "string") {
      headerNames = headers;
      headerLabels = headerNames;
      headerAligns = headerNames.map(function() {
        return "left";
      });
    }

    if (autoSize || (Array.isArray(headers) && typeof headers[0] === "string")) {
      var headerName;
      for (i = 0; i < headerNames.length; i += 1) {
        headerName = headerNames[i];

        // Create a matrix of columns e.g., {column_title: [row1_Record, row2_Record]}

        columnMatrix[headerName] = data.map(function(rec) {
          return rec[headerName];
        });

        // get header width
        this.setFont(undefined, "bold");
        columnMinWidths.push(
          this.getTextDimensions(headerLabels[i], {
            fontSize: this.internal.__cell__.table_font_size,
            scaleFactor: this.internal.scaleFactor
          }).w
        );
        column = columnMatrix[headerName];

        // get cell widths
        this.setFont(undefined, "normal");
        for (j = 0; j < column.length; j += 1) {
          columnMinWidths.push(
            this.getTextDimensions(column[j], {
              fontSize: this.internal.__cell__.table_font_size,
              scaleFactor: this.internal.scaleFactor
            }).w
          );
        }

        // get final column width
        columnWidths[headerName] =
          Math.max.apply(null, columnMinWidths) + padding + padding;

        //have to reset
        columnMinWidths = [];
      }
    }

    // -- Construct the table

    if (printHeaders) {
      var row = {};
      for (i = 0; i < headerNames.length; i += 1) {
        row[headerNames[i]] = {};
        row[headerNames[i]].text = headerLabels[i];
        row[headerNames[i]].align = headerAligns[i];
      }

      var rowHeight = calculateLineHeight.call(this, row, columnWidths);

      // Construct the header row
      tableHeaderConfigs = headerNames.map(function(value) {
        return new Cell(
          x,
          y,
          columnWidths[value],
          rowHeight,
          row[value].text,
          undefined,
          row[value].align
        );
      });

      // Store the table header config
      this.setTableHeaderRow(tableHeaderConfigs);

      // Print the header for the start of the table
      this.printHeaderRow(1, false);
    }

    // Construct the data rows

    var align = headers.reduce(function(pv, cv) {
      pv[cv.name] = cv.align;
      return pv;
    }, {});
    for (i = 0; i < data.length; i += 1) {
      var lineHeight = calculateLineHeight.call(this, data[i], columnWidths);

      for (j = 0; j < headerNames.length; j += 1) {
        cell.call(
          this,
          new Cell(
            x,
            y,
            columnWidths[headerNames[j]],
            lineHeight,
            data[i][headerNames[j]],
            i + 2,
            align[headerNames[j]]
          )
        );
      }
    }
    this.internal.__cell__.table_x = x;
    this.internal.__cell__.table_y = y;
    return this;
  };

  /**
   * Calculate the height for containing the highest column
   *
   * @name calculateLineHeight
   * @function
   * @param {Object[]} model is the line of data we want to calculate the height of
   * @param {Integer[]} columnWidths is size of each column
   * @returns {number} lineHeight
   * @private
   */
  var calculateLineHeight = function calculateLineHeight(model, columnWidths) {
    var padding = this.internal.__cell__.padding;
    var fontSize = this.internal.__cell__.table_font_size;
    var scaleFactor = this.internal.scaleFactor;

    return Object.keys(model)
      .map(function(key) {
        var value = model[key];
        return this.splitTextToSize(
          value.hasOwnProperty("text") ? value.text : value,
          columnWidths[key] - padding - padding
        );
      }, this)
      .map(function(value) {
        return (
          (this.getLineHeightFactor() * value.length * fontSize) / scaleFactor +
          padding +
          padding
        );
      }, this)
      .reduce(function(pv, cv) {
        return Math.max(pv, cv);
      }, 0);
  };

  /**
   * Store the config for outputting a table header
   *
   * @name setTableHeaderRow
   * @function
   * @param {Object[]} config
   * An array of cell configs that would define a header row: Each config matches the config used by jsPDFAPI.cell
   * except the lineNumber parameter is excluded
   */
  jsPDFAPI.setTableHeaderRow = function(config) {
    _initialize.call(this);
    this.internal.__cell__.tableHeaderRow = config;
  };

  /**
   * Output the store header row
   *
   * @name printHeaderRow
   * @function
   * @param {number} lineNumber The line number to output the header at
   * @param {boolean} new_page
   */
  jsPDFAPI.printHeaderRow = function(lineNumber, new_page) {
    _initialize.call(this);
    if (!this.internal.__cell__.tableHeaderRow) {
      throw new Error("Property tableHeaderRow does not exist.");
    }

    var tableHeaderCell;

    printingHeaderRow = true;
    if (typeof this.internal.__cell__.headerFunction === "function") {
      var position = this.internal.__cell__.headerFunction(
        this,
        this.internal.__cell__.pages
      );
      this.internal.__cell__.lastCell = new Cell(
        position[0],
        position[1],
        position[2],
        position[3],
        undefined,
        -1
      );
    }
    this.setFont(undefined, "bold");

    var tempHeaderConf = [];
    for (var i = 0; i < this.internal.__cell__.tableHeaderRow.length; i += 1) {
      tableHeaderCell = this.internal.__cell__.tableHeaderRow[i].clone();
      if (new_page) {
        tableHeaderCell.y = this.internal.__cell__.margins.top || 0;
        tempHeaderConf.push(tableHeaderCell);
      }
      tableHeaderCell.lineNumber = lineNumber;
      this.setFillColor(this.internal.__cell__.headerBackgroundColor);
      cell.call(this, tableHeaderCell);
    }
    if (tempHeaderConf.length > 0) {
      this.setTableHeaderRow(tempHeaderConf);
    }
    this.setFont(undefined, "normal");
    printingHeaderRow = false;
  };
})(jsPDF.API);

function toLookup(arr) {
  return arr.reduce(function(lookup, name, index) {
    lookup[name] = index;

    return lookup;
  }, {});
}

var fontStyleOrder = {
  italic: ["italic", "oblique", "normal"],
  oblique: ["oblique", "italic", "normal"],
  normal: ["normal", "oblique", "italic"]
};

var fontStretchOrder = [
  "ultra-condensed",
  "extra-condensed",
  "condensed",
  "semi-condensed",
  "normal",
  "semi-expanded",
  "expanded",
  "extra-expanded",
  "ultra-expanded"
];

// For a given font-stretch value, we need to know where to start our search
// from in the fontStretchOrder list.
var fontStretchLookup = toLookup(fontStretchOrder);

var fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
var fontWeightsLookup = toLookup(fontWeights);

function normalizeFontStretch(stretch) {
  stretch = stretch || "normal";

  return typeof fontStretchLookup[stretch] === "number" ? stretch : "normal";
}

function normalizeFontStyle(style) {
  style = style || "normal";

  return fontStyleOrder[style] ? style : "normal";
}

function normalizeFontWeight(weight) {
  if (!weight) {
    return 400;
  }

  if (typeof weight === "number") {
    // Ignore values which aren't valid font-weights.
    return weight >= 100 && weight <= 900 && weight % 100 === 0 ? weight : 400;
  }

  if (/^\d00$/.test(weight)) {
    return parseInt(weight);
  }

  switch (weight) {
    case "bold":
      return 700;

    case "normal":
    default:
      return 400;
  }
}

function normalizeFontFace(fontFace) {
  var family = fontFace.family.replace(/"|'/g, "").toLowerCase();

  var style = normalizeFontStyle(fontFace.style);
  var weight = normalizeFontWeight(fontFace.weight);
  var stretch = normalizeFontStretch(fontFace.stretch);

  return {
    family: family,
    style: style,
    weight: weight,
    stretch: stretch,
    src: fontFace.src || [],

    // The ref property maps this font-face to the font
    // added by the .addFont() method.
    ref: fontFace.ref || {
      name: family,
      style: [stretch, style, weight].join(" ")
    }
  };
}

/**
 * Turns a list of font-faces into a map, for easier lookup when resolving
 * fonts.
 * @private
 */
function buildFontFaceMap(fontFaces) {
  var map = {};

  for (var i = 0; i < fontFaces.length; ++i) {
    var normalized = normalizeFontFace(fontFaces[i]);

    var name = normalized.family;
    var stretch = normalized.stretch;
    var style = normalized.style;
    var weight = normalized.weight;

    map[name] = map[name] || {};

    map[name][stretch] = map[name][stretch] || {};
    map[name][stretch][style] = map[name][stretch][style] || {};
    map[name][stretch][style][weight] = normalized;
  }

  return map;
}

/**
 * Searches a map of stretches, weights, etc. in the given direction and
 * then, if no match has been found, in the opposite directions.
 *
 * @param {Object.<string, any>} matchingSet A map of the various font variations.
 * @param {any[]} order The order of the different variations
 * @param {number} pivot The starting point of the search in the order list.
 * @param {number} dir The initial direction of the search (desc = -1, asc = 1)
 * @private
 */

function searchFromPivot(matchingSet, order, pivot, dir) {
  var i;

  for (i = pivot; i >= 0 && i < order.length; i += dir) {
    if (matchingSet[order[i]]) {
      return matchingSet[order[i]];
    }
  }

  for (i = pivot; i >= 0 && i < order.length; i -= dir) {
    if (matchingSet[order[i]]) {
      return matchingSet[order[i]];
    }
  }
}

function resolveFontStretch(stretch, matchingSet) {
  if (matchingSet[stretch]) {
    return matchingSet[stretch];
  }

  var pivot = fontStretchLookup[stretch];

  // If the font-stretch value is normal or more condensed, we want to
  // start with a descending search, otherwise we should do ascending.
  var dir = pivot <= fontStretchLookup["normal"] ? -1 : 1;
  var match = searchFromPivot(matchingSet, fontStretchOrder, pivot, dir);

  if (!match) {
    // Since a font-family cannot exist without having at least one stretch value
    // we should never reach this point.
    throw new Error(
      "Could not find a matching font-stretch value for " + stretch
    );
  }

  return match;
}

function resolveFontStyle(fontStyle, matchingSet) {
  if (matchingSet[fontStyle]) {
    return matchingSet[fontStyle];
  }

  var ordering = fontStyleOrder[fontStyle];

  for (var i = 0; i < ordering.length; ++i) {
    if (matchingSet[ordering[i]]) {
      return matchingSet[ordering[i]];
    }
  }

  // Since a font-family cannot exist without having at least one style value
  // we should never reach this point.
  throw new Error("Could not find a matching font-style for " + fontStyle);
}

function resolveFontWeight(weight, matchingSet) {
  if (matchingSet[weight]) {
    return matchingSet[weight];
  }

  if (weight === 400 && matchingSet[500]) {
    return matchingSet[500];
  }

  if (weight === 500 && matchingSet[400]) {
    return matchingSet[400];
  }

  var pivot = fontWeightsLookup[weight];

  // If the font-stretch value is normal or more condensed, we want to
  // start with a descending search, otherwise we should do ascending.
  var dir = weight < 400 ? -1 : 1;
  var match = searchFromPivot(matchingSet, fontWeights, pivot, dir);

  if (!match) {
    // Since a font-family cannot exist without having at least one stretch value
    // we should never reach this point.
    throw new Error(
      "Could not find a matching font-weight for value " + weight
    );
  }

  return match;
}

var defaultGenericFontFamilies = {
  "sans-serif": "helvetica",
  fixed: "courier",
  monospace: "courier",
  terminal: "courier",
  cursive: "times",
  fantasy: "times",
  serif: "times"
};

var systemFonts = {
  caption: "times",
  icon: "times",
  menu: "times",
  "message-box": "times",
  "small-caption": "times",
  "status-bar": "times"
};

function ruleToString(rule) {
  return [rule.stretch, rule.style, rule.weight, rule.family].join(" ");
}

function resolveFontFace(fontFaceMap, rules, opts) {
  opts = opts || {};

  var defaultFontFamily = opts.defaultFontFamily || "times";
  var genericFontFamilies = Object.assign(
    {},
    defaultGenericFontFamilies,
    opts.genericFontFamilies || {}
  );

  var rule = null;
  var matches = null;

  for (var i = 0; i < rules.length; ++i) {
    rule = normalizeFontFace(rules[i]);

    if (genericFontFamilies[rule.family]) {
      rule.family = genericFontFamilies[rule.family];
    }

    if (fontFaceMap.hasOwnProperty(rule.family)) {
      matches = fontFaceMap[rule.family];

      break;
    }
  }

  // Always fallback to a known font family.
  matches = matches || fontFaceMap[defaultFontFamily];

  if (!matches) {
    // At this point we should definitiely have a font family, but if we
    // don't there is something wrong with our configuration
    throw new Error(
      "Could not find a font-family for the rule '" +
        ruleToString(rule) +
        "' and default family '" +
        defaultFontFamily +
        "'."
    );
  }

  matches = resolveFontStretch(rule.stretch, matches);
  matches = resolveFontStyle(rule.style, matches);
  matches = resolveFontWeight(rule.weight, matches);

  if (!matches) {
    // We should've fount
    throw new Error(
      "Failed to resolve a font for the rule '" + ruleToString(rule) + "'."
    );
  }

  return matches;
}

function eatWhiteSpace(input) {
  return input.trimLeft();
}

function parseQuotedFontFamily(input, quote) {
  var index = 0;

  while (index < input.length) {
    var current = input.charAt(index);

    if (current === quote) {
      return [input.substring(0, index), input.substring(index + 1)];
    }

    index += 1;
  }

  // Unexpected end of input
  return null;
}

function parseNonQuotedFontFamily(input) {
  // It implements part of the identifier parser here: https://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
  //
  // NOTE: This parser pretty much ignores escaped identifiers and that there is a thing called unicode.
  //
  // Breakdown of regexp:
  // -[a-z_]     - when identifier starts with a hyphen, you're not allowed to have another hyphen or a digit
  // [a-z_]      - allow a-z and underscore at beginning of input
  // [a-z0-9_-]* - after that, anything goes
  var match = input.match(/^(-[a-z_]|[a-z_])[a-z0-9_-]*/i);

  // non quoted value contains illegal characters
  if (match === null) {
    return null;
  }

  return [match[0], input.substring(match[0].length)];
}

var defaultFont = ["times"];

function parseFontFamily(input) {
  var result = [];
  var ch, parsed;
  var remaining = input.trim();

  if (remaining === "") {
    return defaultFont;
  }

  if (remaining in systemFonts) {
    return [systemFonts[remaining]];
  }

  while (remaining !== "") {
    parsed = null;
    remaining = eatWhiteSpace(remaining);
    ch = remaining.charAt(0);

    switch (ch) {
      case '"':
      case "'":
        parsed = parseQuotedFontFamily(remaining.substring(1), ch);
        break;

      default:
        parsed = parseNonQuotedFontFamily(remaining);
        break;
    }

    if (parsed === null) {
      return defaultFont;
    }

    result.push(parsed[0]);

    remaining = eatWhiteSpace(parsed[1]);

    // We expect end of input or a comma separator here
    if (remaining !== "" && remaining.charAt(0) !== ",") {
      return defaultFont;
    }

    remaining = remaining.replace(/^,/, "");
  }

  return result;
}

/* eslint-disable no-fallthrough */

/**
 * This plugin mimics the HTML5 CanvasRenderingContext2D.
 *
 * The goal is to provide a way for current canvas implementations to print directly to a PDF.
 *
 * @name context2d
 * @module
 */
(function(jsPDFAPI) {
  var ContextLayer = function(ctx) {
    ctx = ctx || {};
    this.isStrokeTransparent = ctx.isStrokeTransparent || false;
    this.strokeOpacity = ctx.strokeOpacity || 1;
    this.strokeStyle = ctx.strokeStyle || "#000000";
    this.fillStyle = ctx.fillStyle || "#000000";
    this.isFillTransparent = ctx.isFillTransparent || false;
    this.fillOpacity = ctx.fillOpacity || 1;
    this.font = ctx.font || "10px sans-serif";
    this.textBaseline = ctx.textBaseline || "alphabetic";
    this.textAlign = ctx.textAlign || "left";
    this.lineWidth = ctx.lineWidth || 1;
    this.lineJoin = ctx.lineJoin || "miter";
    this.lineCap = ctx.lineCap || "butt";
    this.path = ctx.path || [];
    this.transform =
      typeof ctx.transform !== "undefined"
        ? ctx.transform.clone()
        : new Matrix();
    this.globalCompositeOperation = ctx.globalCompositeOperation || "normal";
    this.globalAlpha = ctx.globalAlpha || 1.0;
    this.clip_path = ctx.clip_path || [];
    this.currentPoint = ctx.currentPoint || new Point();
    this.miterLimit = ctx.miterLimit || 10.0;
    this.lastPoint = ctx.lastPoint || new Point();

    this.ignoreClearRect =
      typeof ctx.ignoreClearRect === "boolean" ? ctx.ignoreClearRect : true;
    return this;
  };

  //stub
  var f2,
    getHorizontalCoordinateString,
    getVerticalCoordinateString,
    getHorizontalCoordinate,
    getVerticalCoordinate,
    Point,
    Rectangle,
    Matrix,
    _ctx;
  jsPDFAPI.events.push([
    "initialized",
    function() {
      this.context2d = new Context2D(this);

      f2 = this.internal.f2;
      getHorizontalCoordinateString = this.internal.getCoordinateString;
      getVerticalCoordinateString = this.internal.getVerticalCoordinateString;
      getHorizontalCoordinate = this.internal.getHorizontalCoordinate;
      getVerticalCoordinate = this.internal.getVerticalCoordinate;
      Point = this.internal.Point;
      Rectangle = this.internal.Rectangle;
      Matrix = this.internal.Matrix;
      _ctx = new ContextLayer();
    }
  ]);

  var Context2D = function(pdf) {
    Object.defineProperty(this, "canvas", {
      get: function() {
        return { parentNode: false, style: false };
      }
    });

    var _pdf = pdf;
    Object.defineProperty(this, "pdf", {
      get: function() {
        return _pdf;
      }
    });

    var _pageWrapXEnabled = false;
    /**
     * @name pageWrapXEnabled
     * @type {boolean}
     * @default false
     */
    Object.defineProperty(this, "pageWrapXEnabled", {
      get: function() {
        return _pageWrapXEnabled;
      },
      set: function(value) {
        _pageWrapXEnabled = Boolean(value);
      }
    });

    var _pageWrapYEnabled = false;
    /**
     * @name pageWrapYEnabled
     * @type {boolean}
     * @default true
     */
    Object.defineProperty(this, "pageWrapYEnabled", {
      get: function() {
        return _pageWrapYEnabled;
      },
      set: function(value) {
        _pageWrapYEnabled = Boolean(value);
      }
    });

    var _posX = 0;
    /**
     * @name posX
     * @type {number}
     * @default 0
     */
    Object.defineProperty(this, "posX", {
      get: function() {
        return _posX;
      },
      set: function(value) {
        if (!isNaN(value)) {
          _posX = value;
        }
      }
    });

    var _posY = 0;
    /**
     * @name posY
     * @type {number}
     * @default 0
     */
    Object.defineProperty(this, "posY", {
      get: function() {
        return _posY;
      },
      set: function(value) {
        if (!isNaN(value)) {
          _posY = value;
        }
      }
    });

    var _autoPaging = false;
    /**
     * @name autoPaging
     * @type {boolean}
     * @default true
     */
    Object.defineProperty(this, "autoPaging", {
      get: function() {
        return _autoPaging;
      },
      set: function(value) {
        _autoPaging = Boolean(value);
      }
    });

    var lastBreak = 0;
    /**
     * @name lastBreak
     * @type {number}
     * @default 0
     */
    Object.defineProperty(this, "lastBreak", {
      get: function() {
        return lastBreak;
      },
      set: function(value) {
        lastBreak = value;
      }
    });

    var pageBreaks = [];
    /**
     * Y Position of page breaks.
     * @name pageBreaks
     * @type {number}
     * @default 0
     */
    Object.defineProperty(this, "pageBreaks", {
      get: function() {
        return pageBreaks;
      },
      set: function(value) {
        pageBreaks = value;
      }
    });

    /**
     * @name ctx
     * @type {object}
     * @default {}
     */
    Object.defineProperty(this, "ctx", {
      get: function() {
        return _ctx;
      },
      set: function(value) {
        if (value instanceof ContextLayer) {
          _ctx = value;
        }
      }
    });

    /**
     * @name path
     * @type {array}
     * @default []
     */
    Object.defineProperty(this, "path", {
      get: function() {
        return _ctx.path;
      },
      set: function(value) {
        _ctx.path = value;
      }
    });

    /**
     * @name ctxStack
     * @type {array}
     * @default []
     */
    var _ctxStack = [];
    Object.defineProperty(this, "ctxStack", {
      get: function() {
        return _ctxStack;
      },
      set: function(value) {
        _ctxStack = value;
      }
    });

    /**
     * Sets or returns the color, gradient, or pattern used to fill the drawing
     *
     * @name fillStyle
     * @default #000000
     * @property {(color|gradient|pattern)} value The color of the drawing. Default value is #000000<br />
     * A gradient object (linear or radial) used to fill the drawing (not supported by context2d)<br />
     * A pattern object to use to fill the drawing (not supported by context2d)
     */
    Object.defineProperty(this, "fillStyle", {
      get: function() {
        return this.ctx.fillStyle;
      },
      set: function(value) {
        var rgba;
        rgba = getRGBA(value);

        this.ctx.fillStyle = rgba.style;
        this.ctx.isFillTransparent = rgba.a === 0;
        this.ctx.fillOpacity = rgba.a;

        this.pdf.setFillColor(rgba.r, rgba.g, rgba.b, { a: rgba.a });
        this.pdf.setTextColor(rgba.r, rgba.g, rgba.b, { a: rgba.a });
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
    Object.defineProperty(this, "strokeStyle", {
      get: function() {
        return this.ctx.strokeStyle;
      },
      set: function(value) {
        var rgba = getRGBA(value);

        this.ctx.strokeStyle = rgba.style;
        this.ctx.isStrokeTransparent = rgba.a === 0;
        this.ctx.strokeOpacity = rgba.a;

        if (rgba.a === 0) {
          this.pdf.setDrawColor(255, 255, 255);
        } else if (rgba.a === 1) {
          this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
        } else {
          this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
        }
      }
    });

    /**
     * Sets or returns the style of the end caps for a line
     *
     * @name lineCap
     * @default butt
     * @property {(butt|round|square)} lineCap butt A flat edge is added to each end of the line <br/>
     * round A rounded end cap is added to each end of the line<br/>
     * square A square end cap is added to each end of the line<br/>
     */
    Object.defineProperty(this, "lineCap", {
      get: function() {
        return this.ctx.lineCap;
      },
      set: function(value) {
        if (["butt", "round", "square"].indexOf(value) !== -1) {
          this.ctx.lineCap = value;
          this.pdf.setLineCap(value);
        }
      }
    });

    /**
     * Sets or returns the current line width
     *
     * @name lineWidth
     * @default 1
     * @property {number} lineWidth The current line width, in pixels
     */
    Object.defineProperty(this, "lineWidth", {
      get: function() {
        return this.ctx.lineWidth;
      },
      set: function(value) {
        if (!isNaN(value)) {
          this.ctx.lineWidth = value;
          this.pdf.setLineWidth(value);
        }
      }
    });

    /**
     * Sets or returns the type of corner created, when two lines meet
     */
    Object.defineProperty(this, "lineJoin", {
      get: function() {
        return this.ctx.lineJoin;
      },
      set: function(value) {
        if (["bevel", "round", "miter"].indexOf(value) !== -1) {
          this.ctx.lineJoin = value;
          this.pdf.setLineJoin(value);
        }
      }
    });

    /**
     * A number specifying the miter limit ratio in coordinate space units. Zero, negative, Infinity, and NaN values are ignored. The default value is 10.0.
     *
     * @name miterLimit
     * @default 10
     */
    Object.defineProperty(this, "miterLimit", {
      get: function() {
        return this.ctx.miterLimit;
      },
      set: function(value) {
        if (!isNaN(value)) {
          this.ctx.miterLimit = value;
          this.pdf.setMiterLimit(value);
        }
      }
    });

    Object.defineProperty(this, "textBaseline", {
      get: function() {
        return this.ctx.textBaseline;
      },
      set: function(value) {
        this.ctx.textBaseline = value;
      }
    });

    Object.defineProperty(this, "textAlign", {
      get: function() {
        return this.ctx.textAlign;
      },
      set: function(value) {
        if (["right", "end", "center", "left", "start"].indexOf(value) !== -1) {
          this.ctx.textAlign = value;
        }
      }
    });

    var _fontFaceMap = null;

    function getFontFaceMap(pdf, fontFaces) {
      if (_fontFaceMap === null) {
        var fontMap = pdf.getFontList();

        var convertedFontFaces = convertToFontFaces(fontMap);

        _fontFaceMap = buildFontFaceMap(convertedFontFaces.concat(fontFaces));
      }

      return _fontFaceMap;
    }

    function convertToFontFaces(fontMap) {
      var fontFaces = [];

      Object.keys(fontMap).forEach(function(family) {
        var styles = fontMap[family];

        styles.forEach(function(style) {
          var fontFace = null;

          switch (style) {
            case "bold":
              fontFace = {
                family: family,
                weight: "bold"
              };
              break;

            case "italic":
              fontFace = {
                family: family,
                style: "italic"
              };
              break;

            case "bolditalic":
              fontFace = {
                family: family,
                weight: "bold",
                style: "italic"
              };
              break;

            case "":
            case "normal":
              fontFace = {
                family: family
              };
              break;
          }

          // If font-face is still null here, it is a font with some styling we don't recognize and
          // cannot map or it is a font added via the fontFaces option of .html().
          if (fontFace !== null) {
            fontFace.ref = {
              name: family,
              style: style
            };

            fontFaces.push(fontFace);
          }
        });
      });

      return fontFaces;
    }

    var _fontFaces = null;
    /**
     * A map of available font-faces, as passed in the options of
     * .html(). If set a limited implementation of the font style matching
     * algorithm defined by https://www.w3.org/TR/css-fonts-3/#font-matching-algorithm
     * will be used. If not set it will fallback to previous behavior.
     */

    Object.defineProperty(this, "fontFaces", {
      get: function() {
        return _fontFaces;
      },
      set: function(value) {
        _fontFaceMap = null;
        _fontFaces = value;
      }
    });

    Object.defineProperty(this, "font", {
      get: function() {
        return this.ctx.font;
      },
      set: function(value) {
        this.ctx.font = value;
        var rx, matches;

        //source: https://stackoverflow.com/a/10136041
        // eslint-disable-next-line no-useless-escape
        rx = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-_,\"\'\sa-z]+?)\s*$/i;
        matches = rx.exec(value);
        if (matches !== null) {
          var fontStyle = matches[1];
          var fontVariant = matches[2];
          var fontWeight = matches[3];
          var fontSize = matches[4];
          var lineHeight = matches[5];
          var fontFamily = matches[6];
        } else {
          return;
        }
        var rxFontSize = /^([.\d]+)((?:%|in|[cem]m|ex|p[ctx]))$/i;
        var fontSizeUnit = rxFontSize.exec(fontSize)[2];

        if ("px" === fontSizeUnit) {
          fontSize = Math.floor(
            parseFloat(fontSize) * this.pdf.internal.scaleFactor
          );
        } else if ("em" === fontSizeUnit) {
          fontSize = Math.floor(parseFloat(fontSize) * this.pdf.getFontSize());
        } else {
          fontSize = Math.floor(
            parseFloat(fontSize) * this.pdf.internal.scaleFactor
          );
        }

        this.pdf.setFontSize(fontSize);
        var parts = parseFontFamily(fontFamily);

        if (this.fontFaces) {
          var fontFaceMap = getFontFaceMap(this.pdf, this.fontFaces);

          var rules = parts.map(function(ff) {
            return {
              family: ff,
              stretch: "normal", // TODO: Extract font-stretch from font rule (perhaps write proper parser for it?)
              weight: fontWeight,
              style: fontStyle
            };
          });

          var font = resolveFontFace(fontFaceMap, rules);
          this.pdf.setFont(font.ref.name, font.ref.style);
          return;
        }

        var style = "";
        if (
          fontWeight === "bold" ||
          parseInt(fontWeight, 10) >= 700 ||
          fontStyle === "bold"
        ) {
          style = "bold";
        }

        if (fontStyle === "italic") {
          style += "italic";
        }

        if (style.length === 0) {
          style = "normal";
        }
        var jsPdfFontName = "";

        var fallbackFonts = {
          arial: "Helvetica",
          Arial: "Helvetica",
          verdana: "Helvetica",
          Verdana: "Helvetica",
          helvetica: "Helvetica",
          Helvetica: "Helvetica",
          "sans-serif": "Helvetica",
          fixed: "Courier",
          monospace: "Courier",
          terminal: "Courier",
          cursive: "Times",
          fantasy: "Times",
          serif: "Times"
        };

        for (var i = 0; i < parts.length; i++) {
          if (
            this.pdf.internal.getFont(parts[i], style, {
              noFallback: true,
              disableWarning: true
            }) !== undefined
          ) {
            jsPdfFontName = parts[i];
            break;
          } else if (
            style === "bolditalic" &&
            this.pdf.internal.getFont(parts[i], "bold", {
              noFallback: true,
              disableWarning: true
            }) !== undefined
          ) {
            jsPdfFontName = parts[i];
            style = "bold";
          } else if (
            this.pdf.internal.getFont(parts[i], "normal", {
              noFallback: true,
              disableWarning: true
            }) !== undefined
          ) {
            jsPdfFontName = parts[i];
            style = "normal";
            break;
          }
        }
        if (jsPdfFontName === "") {
          for (var j = 0; j < parts.length; j++) {
            if (fallbackFonts[parts[j]]) {
              jsPdfFontName = fallbackFonts[parts[j]];
              break;
            }
          }
        }
        jsPdfFontName = jsPdfFontName === "" ? "Times" : jsPdfFontName;
        this.pdf.setFont(jsPdfFontName, style);
      }
    });

    Object.defineProperty(this, "globalCompositeOperation", {
      get: function() {
        return this.ctx.globalCompositeOperation;
      },
      set: function(value) {
        this.ctx.globalCompositeOperation = value;
      }
    });

    Object.defineProperty(this, "globalAlpha", {
      get: function() {
        return this.ctx.globalAlpha;
      },
      set: function(value) {
        this.ctx.globalAlpha = value;
      }
    });

    // Not HTML API
    Object.defineProperty(this, "ignoreClearRect", {
      get: function() {
        return this.ctx.ignoreClearRect;
      },
      set: function(value) {
        this.ctx.ignoreClearRect = Boolean(value);
      }
    });
  };

  Context2D.prototype.fill = function() {
    pathPreProcess.call(this, "fill", false);
  };

  /**
   * Actually draws the path you have defined
   *
   * @name stroke
   * @function
   * @description The stroke() method actually draws the path you have defined with all those moveTo() and lineTo() methods. The default color is black.
   */
  Context2D.prototype.stroke = function() {
    pathPreProcess.call(this, "stroke", false);
  };

  /**
   * Begins a path, or resets the current
   *
   * @name beginPath
   * @function
   * @description The beginPath() method begins a path, or resets the current path.
   */
  Context2D.prototype.beginPath = function() {
    this.path = [
      {
        type: "begin"
      }
    ];
  };

  /**
   * Moves the path to the specified point in the canvas, without creating a line
   *
   * @name moveTo
   * @function
   * @param x {Number} The x-coordinate of where to move the path to
   * @param y {Number} The y-coordinate of where to move the path to
   */
  Context2D.prototype.moveTo = function(x, y) {
    if (isNaN(x) || isNaN(y)) {
      console.error("jsPDF.context2d.moveTo: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.moveTo");
    }

    var pt = this.ctx.transform.applyToPoint(new Point(x, y));

    this.path.push({
      type: "mt",
      x: pt.x,
      y: pt.y
    });
    this.ctx.lastPoint = new Point(x, y);
  };

  /**
   * Creates a path from the current point back to the starting point
   *
   * @name closePath
   * @function
   * @description The closePath() method creates a path from the current point back to the starting point.
   */
  Context2D.prototype.closePath = function() {
    var pathBegin = new Point(0, 0);
    var i = 0;
    for (i = this.path.length - 1; i !== -1; i--) {
      if (this.path[i].type === "begin") {
        if (
          typeof this.path[i + 1] === "object" &&
          typeof this.path[i + 1].x === "number"
        ) {
          pathBegin = new Point(this.path[i + 1].x, this.path[i + 1].y);
          this.path.push({
            type: "lt",
            x: pathBegin.x,
            y: pathBegin.y
          });
          break;
        }
      }
    }
    if (
      typeof this.path[i + 2] === "object" &&
      typeof this.path[i + 2].x === "number"
    ) {
      this.path.push(JSON.parse(JSON.stringify(this.path[i + 2])));
    }
    this.path.push({
      type: "close"
    });
    this.ctx.lastPoint = new Point(pathBegin.x, pathBegin.y);
  };

  /**
   * Adds a new point and creates a line to that point from the last specified point in the canvas
   *
   * @name lineTo
   * @function
   * @param x The x-coordinate of where to create the line to
   * @param y The y-coordinate of where to create the line to
   * @description The lineTo() method adds a new point and creates a line TO that point FROM the last specified point in the canvas (this method does not draw the line).
   */
  Context2D.prototype.lineTo = function(x, y) {
    if (isNaN(x) || isNaN(y)) {
      console.error("jsPDF.context2d.lineTo: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.lineTo");
    }

    var pt = this.ctx.transform.applyToPoint(new Point(x, y));

    this.path.push({
      type: "lt",
      x: pt.x,
      y: pt.y
    });
    this.ctx.lastPoint = new Point(pt.x, pt.y);
  };

  /**
   * Clips a region of any shape and size from the original canvas
   *
   * @name clip
   * @function
   * @description The clip() method clips a region of any shape and size from the original canvas.
   */
  Context2D.prototype.clip = function() {
    this.ctx.clip_path = JSON.parse(JSON.stringify(this.path));
    pathPreProcess.call(this, null, true);
  };

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
  Context2D.prototype.quadraticCurveTo = function(cpx, cpy, x, y) {
    if (isNaN(x) || isNaN(y) || isNaN(cpx) || isNaN(cpy)) {
      console.error(
        "jsPDF.context2d.quadraticCurveTo: Invalid arguments",
        arguments
      );
      throw new Error(
        "Invalid arguments passed to jsPDF.context2d.quadraticCurveTo"
      );
    }

    var pt0 = this.ctx.transform.applyToPoint(new Point(x, y));
    var pt1 = this.ctx.transform.applyToPoint(new Point(cpx, cpy));

    this.path.push({
      type: "qct",
      x1: pt1.x,
      y1: pt1.y,
      x: pt0.x,
      y: pt0.y
    });
    this.ctx.lastPoint = new Point(pt0.x, pt0.y);
  };

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
  Context2D.prototype.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
    if (
      isNaN(x) ||
      isNaN(y) ||
      isNaN(cp1x) ||
      isNaN(cp1y) ||
      isNaN(cp2x) ||
      isNaN(cp2y)
    ) {
      console.error(
        "jsPDF.context2d.bezierCurveTo: Invalid arguments",
        arguments
      );
      throw new Error(
        "Invalid arguments passed to jsPDF.context2d.bezierCurveTo"
      );
    }
    var pt0 = this.ctx.transform.applyToPoint(new Point(x, y));
    var pt1 = this.ctx.transform.applyToPoint(new Point(cp1x, cp1y));
    var pt2 = this.ctx.transform.applyToPoint(new Point(cp2x, cp2y));

    this.path.push({
      type: "bct",
      x1: pt1.x,
      y1: pt1.y,
      x2: pt2.x,
      y2: pt2.y,
      x: pt0.x,
      y: pt0.y
    });
    this.ctx.lastPoint = new Point(pt0.x, pt0.y);
  };

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
  Context2D.prototype.arc = function(
    x,
    y,
    radius,
    startAngle,
    endAngle,
    counterclockwise
  ) {
    if (
      isNaN(x) ||
      isNaN(y) ||
      isNaN(radius) ||
      isNaN(startAngle) ||
      isNaN(endAngle)
    ) {
      console.error("jsPDF.context2d.arc: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.arc");
    }
    counterclockwise = Boolean(counterclockwise);

    if (!this.ctx.transform.isIdentity) {
      var xpt = this.ctx.transform.applyToPoint(new Point(x, y));
      x = xpt.x;
      y = xpt.y;

      var x_radPt = this.ctx.transform.applyToPoint(new Point(0, radius));
      var x_radPt0 = this.ctx.transform.applyToPoint(new Point(0, 0));
      radius = Math.sqrt(
        Math.pow(x_radPt.x - x_radPt0.x, 2) +
          Math.pow(x_radPt.y - x_radPt0.y, 2)
      );
    }
    if (Math.abs(endAngle - startAngle) >= 2 * Math.PI) {
      startAngle = 0;
      endAngle = 2 * Math.PI;
    }

    this.path.push({
      type: "arc",
      x: x,
      y: y,
      radius: radius,
      startAngle: startAngle,
      endAngle: endAngle,
      counterclockwise: counterclockwise
    });
    // this.ctx.lastPoint(new Point(pt.x,pt.y));
  };

  /**
   * Creates an arc/curve between two tangents
   *
   * @name arcTo
   * @function
   * @param x1 {Number} The x-coordinate of the first tangent
   * @param y1 {Number} The y-coordinate of the first tangent
   * @param x2 {Number} The x-coordinate of the second tangent
   * @param y2 {Number} The y-coordinate of the second tangent
   * @param radius The radius of the arc
   * @description The arcTo() method creates an arc/curve between two tangents on the canvas.
   */
  // eslint-disable-next-line no-unused-vars
  Context2D.prototype.arcTo = function(x1, y1, x2, y2, radius) {
    throw new Error("arcTo not implemented.");
  };

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
  Context2D.prototype.rect = function(x, y, w, h) {
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      console.error("jsPDF.context2d.rect: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.rect");
    }
    this.moveTo(x, y);
    this.lineTo(x + w, y);
    this.lineTo(x + w, y + h);
    this.lineTo(x, y + h);
    this.lineTo(x, y);
    this.lineTo(x + w, y);
    this.lineTo(x, y);
  };

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
  Context2D.prototype.fillRect = function(x, y, w, h) {
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      console.error("jsPDF.context2d.fillRect: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.fillRect");
    }
    if (isFillTransparent.call(this)) {
      return;
    }
    var tmp = {};
    if (this.lineCap !== "butt") {
      tmp.lineCap = this.lineCap;
      this.lineCap = "butt";
    }
    if (this.lineJoin !== "miter") {
      tmp.lineJoin = this.lineJoin;
      this.lineJoin = "miter";
    }

    this.beginPath();
    this.rect(x, y, w, h);
    this.fill();

    if (tmp.hasOwnProperty("lineCap")) {
      this.lineCap = tmp.lineCap;
    }
    if (tmp.hasOwnProperty("lineJoin")) {
      this.lineJoin = tmp.lineJoin;
    }
  };

  /**
   *     Draws a rectangle (no fill)
   *
   * @name strokeRect
   * @function
   * @param x {Number} The x-coordinate of the upper-left corner of the rectangle
   * @param y {Number} The y-coordinate of the upper-left corner of the rectangle
   * @param w {Number} The width of the rectangle, in pixels
   * @param h {Number} The height of the rectangle, in pixels
   * @description The strokeRect() method draws a rectangle (no fill). The default color of the stroke is black.
   */
  Context2D.prototype.strokeRect = function strokeRect(x, y, w, h) {
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      console.error("jsPDF.context2d.strokeRect: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.strokeRect");
    }
    if (isStrokeTransparent.call(this)) {
      return;
    }
    this.beginPath();
    this.rect(x, y, w, h);
    this.stroke();
  };

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
  Context2D.prototype.clearRect = function(x, y, w, h) {
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      console.error("jsPDF.context2d.clearRect: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.clearRect");
    }
    if (this.ignoreClearRect) {
      return;
    }

    this.fillStyle = "#ffffff";
    this.fillRect(x, y, w, h);
  };

  /**
   * Saves the state of the current context
   *
   * @name save
   * @function
   */
  Context2D.prototype.save = function(doStackPush) {
    doStackPush = typeof doStackPush === "boolean" ? doStackPush : true;
    var tmpPageNumber = this.pdf.internal.getCurrentPageInfo().pageNumber;
    for (var i = 0; i < this.pdf.internal.getNumberOfPages(); i++) {
      this.pdf.setPage(i + 1);
      this.pdf.internal.out("q");
    }
    this.pdf.setPage(tmpPageNumber);

    if (doStackPush) {
      this.ctx.fontSize = this.pdf.internal.getFontSize();
      var ctx = new ContextLayer(this.ctx);
      this.ctxStack.push(this.ctx);
      this.ctx = ctx;
    }
  };

  /**
   * Returns previously saved path state and attributes
   *
   * @name restore
   * @function
   */
  Context2D.prototype.restore = function(doStackPop) {
    doStackPop = typeof doStackPop === "boolean" ? doStackPop : true;
    var tmpPageNumber = this.pdf.internal.getCurrentPageInfo().pageNumber;
    for (var i = 0; i < this.pdf.internal.getNumberOfPages(); i++) {
      this.pdf.setPage(i + 1);
      this.pdf.internal.out("Q");
    }
    this.pdf.setPage(tmpPageNumber);

    if (doStackPop && this.ctxStack.length !== 0) {
      this.ctx = this.ctxStack.pop();
      this.fillStyle = this.ctx.fillStyle;
      this.strokeStyle = this.ctx.strokeStyle;
      this.font = this.ctx.font;
      this.lineCap = this.ctx.lineCap;
      this.lineWidth = this.ctx.lineWidth;
      this.lineJoin = this.ctx.lineJoin;
    }
  };

  /**
   * @name toDataURL
   * @function
   */
  Context2D.prototype.toDataURL = function() {
    throw new Error("toDataUrl not implemented.");
  };

  //helper functions

  /**
   * Get the decimal values of r, g, b and a
   *
   * @name getRGBA
   * @function
   * @private
   * @ignore
   */
  var getRGBA = function(style) {
    var rxRgb = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
    var rxRgba = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/;
    var rxTransparent = /transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/;

    var r, g, b, a;

    if (style.isCanvasGradient === true) {
      style = style.getColor();
    }

    if (!style) {
      return { r: 0, g: 0, b: 0, a: 0, style: style };
    }

    if (rxTransparent.test(style)) {
      r = 0;
      g = 0;
      b = 0;
      a = 0;
    } else {
      var matches = rxRgb.exec(style);
      if (matches !== null) {
        r = parseInt(matches[1]);
        g = parseInt(matches[2]);
        b = parseInt(matches[3]);
        a = 1;
      } else {
        matches = rxRgba.exec(style);
        if (matches !== null) {
          r = parseInt(matches[1]);
          g = parseInt(matches[2]);
          b = parseInt(matches[3]);
          a = parseFloat(matches[4]);
        } else {
          a = 1;

          if (typeof style === "string" && style.charAt(0) !== "#") {
            var rgbColor = new RGBColor(style);
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
    return { r: r, g: g, b: b, a: a, style: style };
  };

  /**
   * @name isFillTransparent
   * @function
   * @private
   * @ignore
   * @returns {Boolean}
   */
  var isFillTransparent = function() {
    return this.ctx.isFillTransparent || this.globalAlpha == 0;
  };

  /**
   * @name isStrokeTransparent
   * @function
   * @private
   * @ignore
   * @returns {Boolean}
   */
  var isStrokeTransparent = function() {
    return Boolean(this.ctx.isStrokeTransparent || this.globalAlpha == 0);
  };

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
  Context2D.prototype.fillText = function(text, x, y, maxWidth) {
    if (isNaN(x) || isNaN(y) || typeof text !== "string") {
      console.error("jsPDF.context2d.fillText: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.fillText");
    }
    maxWidth = isNaN(maxWidth) ? undefined : maxWidth;
    if (isFillTransparent.call(this)) {
      return;
    }

    y = getBaseline.call(this, y);
    var degs = rad2deg(this.ctx.transform.rotation);

    // We only use X axis as scale hint
    var scale = this.ctx.transform.scaleX;

    putText.call(this, {
      text: text,
      x: x,
      y: y,
      scale: scale,
      angle: degs,
      align: this.textAlign,
      maxWidth: maxWidth
    });
  };

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
  Context2D.prototype.strokeText = function(text, x, y, maxWidth) {
    if (isNaN(x) || isNaN(y) || typeof text !== "string") {
      console.error("jsPDF.context2d.strokeText: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.strokeText");
    }
    if (isStrokeTransparent.call(this)) {
      return;
    }

    maxWidth = isNaN(maxWidth) ? undefined : maxWidth;
    y = getBaseline.call(this, y);

    var degs = rad2deg(this.ctx.transform.rotation);
    var scale = this.ctx.transform.scaleX;

    putText.call(this, {
      text: text,
      x: x,
      y: y,
      scale: scale,
      renderingMode: "stroke",
      angle: degs,
      align: this.textAlign,
      maxWidth: maxWidth
    });
  };

  /**
   * Returns an object that contains the width of the specified text
   *
   * @name measureText
   * @function
   * @param text {String} The text to be measured
   * @description The measureText() method returns an object that contains the width of the specified text, in pixels.
   * @returns {Number}
   */
  Context2D.prototype.measureText = function(text) {
    if (typeof text !== "string") {
      console.error(
        "jsPDF.context2d.measureText: Invalid arguments",
        arguments
      );
      throw new Error(
        "Invalid arguments passed to jsPDF.context2d.measureText"
      );
    }
    var pdf = this.pdf;
    var k = this.pdf.internal.scaleFactor;

    var fontSize = pdf.internal.getFontSize();
    var txtWidth =
      (pdf.getStringUnitWidth(text) * fontSize) / pdf.internal.scaleFactor;
    txtWidth *= Math.round(((k * 96) / 72) * 10000) / 10000;

    var TextMetrics = function(options) {
      options = options || {};
      var _width = options.width || 0;
      Object.defineProperty(this, "width", {
        get: function() {
          return _width;
        }
      });
      return this;
    };
    return new TextMetrics({ width: txtWidth });
  };

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
  Context2D.prototype.scale = function(scalewidth, scaleheight) {
    if (isNaN(scalewidth) || isNaN(scaleheight)) {
      console.error("jsPDF.context2d.scale: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.scale");
    }
    var matrix = new Matrix(scalewidth, 0.0, 0.0, scaleheight, 0.0, 0.0);
    this.ctx.transform = this.ctx.transform.multiply(matrix);
  };

  /**
   * Rotates the current drawing
   *
   * @name rotate
   * @function
   * @param angle {Number} The rotation angle, in radians.
   * @description To calculate from degrees to radians: degrees*Math.PI/180. <br />
   * Example: to rotate 5 degrees, specify the following: 5*Math.PI/180
   */
  Context2D.prototype.rotate = function(angle) {
    if (isNaN(angle)) {
      console.error("jsPDF.context2d.rotate: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.rotate");
    }
    var matrix = new Matrix(
      Math.cos(angle),
      Math.sin(angle),
      -Math.sin(angle),
      Math.cos(angle),
      0.0,
      0.0
    );
    this.ctx.transform = this.ctx.transform.multiply(matrix);
  };

  /**
   * Remaps the (0,0) position on the canvas
   *
   * @name translate
   * @function
   * @param x {Number} The value to add to horizontal (x) coordinates
   * @param y {Number} The value to add to vertical (y) coordinates
   * @description The translate() method remaps the (0,0) position on the canvas.
   */
  Context2D.prototype.translate = function(x, y) {
    if (isNaN(x) || isNaN(y)) {
      console.error("jsPDF.context2d.translate: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.translate");
    }
    var matrix = new Matrix(1.0, 0.0, 0.0, 1.0, x, y);
    this.ctx.transform = this.ctx.transform.multiply(matrix);
  };

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
   * @description Each object on the canvas has a current transformation matrix.<br /><br />The transform() method replaces the current transformation matrix. It multiplies the current transformation matrix with the matrix described by:<br /><br /><br /><br />a    c    e<br /><br />b    d    f<br /><br />0    0    1<br /><br />In other words, the transform() method lets you scale, rotate, move, and skew the current context.
   */
  Context2D.prototype.transform = function(a, b, c, d, e, f) {
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f)) {
      console.error("jsPDF.context2d.transform: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.transform");
    }
    var matrix = new Matrix(a, b, c, d, e, f);
    this.ctx.transform = this.ctx.transform.multiply(matrix);
  };

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
  Context2D.prototype.setTransform = function(a, b, c, d, e, f) {
    a = isNaN(a) ? 1 : a;
    b = isNaN(b) ? 0 : b;
    c = isNaN(c) ? 0 : c;
    d = isNaN(d) ? 1 : d;
    e = isNaN(e) ? 0 : e;
    f = isNaN(f) ? 0 : f;
    this.ctx.transform = new Matrix(a, b, c, d, e, f);
  };

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
   */
  Context2D.prototype.drawImage = function(
    img,
    sx,
    sy,
    swidth,
    sheight,
    x,
    y,
    width,
    height
  ) {
    var imageProperties = this.pdf.getImageProperties(img);
    var factorX = 1;
    var factorY = 1;

    var clipFactorX = 1;
    var clipFactorY = 1;

    if (typeof swidth !== "undefined" && typeof width !== "undefined") {
      clipFactorX = width / swidth;
      clipFactorY = height / sheight;
      factorX = ((imageProperties.width / swidth) * width) / swidth;
      factorY = ((imageProperties.height / sheight) * height) / sheight;
    }

    //is sx and sy are set and x and y not, set x and y with values of sx and sy
    if (typeof x === "undefined") {
      x = sx;
      y = sy;
      sx = 0;
      sy = 0;
    }

    if (typeof swidth !== "undefined" && typeof width === "undefined") {
      width = swidth;
      height = sheight;
    }
    if (typeof swidth === "undefined" && typeof width === "undefined") {
      width = imageProperties.width;
      height = imageProperties.height;
    }

    var decomposedTransformationMatrix = this.ctx.transform.decompose();
    var angle = rad2deg(decomposedTransformationMatrix.rotate.shx);
    var matrix = new Matrix();
    matrix = matrix.multiply(decomposedTransformationMatrix.translate);
    matrix = matrix.multiply(decomposedTransformationMatrix.skew);
    matrix = matrix.multiply(decomposedTransformationMatrix.scale);
    var xRect = matrix.applyToRectangle(
      new Rectangle(
        x - sx * clipFactorX,
        y - sy * clipFactorY,
        swidth * factorX,
        sheight * factorY
      )
    );
    var pageArray = getPagesByPath.call(this, xRect);
    var pages = [];
    for (var ii = 0; ii < pageArray.length; ii += 1) {
      if (pages.indexOf(pageArray[ii]) === -1) {
        pages.push(pageArray[ii]);
      }
    }

    sortPages(pages);

    var clipPath;
    if (this.autoPaging) {
      var min = pages[0];
      var max = pages[pages.length - 1];
      for (var i = min; i < max + 1; i++) {
        this.pdf.setPage(i);

        if (this.ctx.clip_path.length !== 0) {
          var tmpPaths = this.path;
          clipPath = JSON.parse(JSON.stringify(this.ctx.clip_path));
          this.path = pathPositionRedo(
            clipPath,
            this.posX,
            -1 * this.pdf.internal.pageSize.height * (i - 1) + this.posY
          );
          drawPaths.call(this, "fill", true);
          this.path = tmpPaths;
        }
        var tmpRect = JSON.parse(JSON.stringify(xRect));
        tmpRect = pathPositionRedo(
          [tmpRect],
          this.posX,
          -1 * this.pdf.internal.pageSize.height * (i - 1) + this.posY
        )[0];
        this.pdf.addImage(
          img,
          "JPEG",
          tmpRect.x,
          tmpRect.y,
          tmpRect.w,
          tmpRect.h,
          null,
          null,
          angle
        );
      }
    } else {
      this.pdf.addImage(
        img,
        "JPEG",
        xRect.x,
        xRect.y,
        xRect.w,
        xRect.h,
        null,
        null,
        angle
      );
    }
  };

  var getPagesByPath = function(path, pageWrapX, pageWrapY) {
    var result = [];
    pageWrapX = pageWrapX || this.pdf.internal.pageSize.width;
    pageWrapY = pageWrapY || this.pdf.internal.pageSize.height;

    switch (path.type) {
      default:
      case "mt":
      case "lt":
        result.push(Math.floor((path.y + this.posY) / pageWrapY) + 1);
        break;
      case "arc":
        result.push(
          Math.floor((path.y + this.posY - path.radius) / pageWrapY) + 1
        );
        result.push(
          Math.floor((path.y + this.posY + path.radius) / pageWrapY) + 1
        );
        break;
      case "qct":
        var rectOfQuadraticCurve = getQuadraticCurveBoundary(
          this.ctx.lastPoint.x,
          this.ctx.lastPoint.y,
          path.x1,
          path.y1,
          path.x,
          path.y
        );
        result.push(Math.floor(rectOfQuadraticCurve.y / pageWrapY) + 1);
        result.push(
          Math.floor(
            (rectOfQuadraticCurve.y + rectOfQuadraticCurve.h) / pageWrapY
          ) + 1
        );
        break;
      case "bct":
        var rectOfBezierCurve = getBezierCurveBoundary(
          this.ctx.lastPoint.x,
          this.ctx.lastPoint.y,
          path.x1,
          path.y1,
          path.x2,
          path.y2,
          path.x,
          path.y
        );
        result.push(Math.floor(rectOfBezierCurve.y / pageWrapY) + 1);
        result.push(
          Math.floor((rectOfBezierCurve.y + rectOfBezierCurve.h) / pageWrapY) +
            1
        );
        break;
      case "rect":
        result.push(Math.floor((path.y + this.posY) / pageWrapY) + 1);
        result.push(Math.floor((path.y + path.h + this.posY) / pageWrapY) + 1);
    }

    for (var i = 0; i < result.length; i += 1) {
      while (this.pdf.internal.getNumberOfPages() < result[i]) {
        addPage.call(this);
      }
    }
    return result;
  };

  var addPage = function() {
    var fillStyle = this.fillStyle;
    var strokeStyle = this.strokeStyle;
    var font = this.font;
    var lineCap = this.lineCap;
    var lineWidth = this.lineWidth;
    var lineJoin = this.lineJoin;
    this.pdf.addPage();
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.font = font;
    this.lineCap = lineCap;
    this.lineWidth = lineWidth;
    this.lineJoin = lineJoin;
  };

  var pathPositionRedo = function(paths, x, y) {
    for (var i = 0; i < paths.length; i++) {
      switch (paths[i].type) {
        case "bct":
          paths[i].x2 += x;
          paths[i].y2 += y;
        case "qct":
          paths[i].x1 += x;
          paths[i].y1 += y;
        case "mt":
        case "lt":
        case "arc":
        default:
          paths[i].x += x;
          paths[i].y += y;
      }
    }
    return paths;
  };

  var sortPages = function(pages) {
    return pages.sort(function(a, b) {
      return a - b;
    });
  };

  var pathPreProcess = function(rule, isClip) {
    var fillStyle = this.fillStyle;
    var strokeStyle = this.strokeStyle;
    var lineCap = this.lineCap;
    var oldLineWidth = this.lineWidth;
    var lineWidth = oldLineWidth * this.ctx.transform.scaleX;
    var lineJoin = this.lineJoin;

    var origPath = JSON.parse(JSON.stringify(this.path));
    var xPath = JSON.parse(JSON.stringify(this.path));
    var clipPath;
    var tmpPath;
    var pages = [];

    for (var i = 0; i < xPath.length; i++) {
      if (typeof xPath[i].x !== "undefined") {
        var page = getPagesByPath.call(this, xPath[i]);

        for (var ii = 0; ii < page.length; ii += 1) {
          if (pages.indexOf(page[ii]) === -1) {
            pages.push(page[ii]);
          }
        }
      }
    }

    for (var j = 0; j < pages.length; j++) {
      while (this.pdf.internal.getNumberOfPages() < pages[j]) {
        addPage.call(this);
      }
    }
    sortPages(pages);

    if (this.autoPaging) {
      var min = pages[0];
      var max = pages[pages.length - 1];
      for (var k = min; k < max + 1; k++) {
        this.pdf.setPage(k);

        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineCap = lineCap;
        this.lineWidth = lineWidth;
        this.lineJoin = lineJoin;

        if (this.ctx.clip_path.length !== 0) {
          var tmpPaths = this.path;
          clipPath = JSON.parse(JSON.stringify(this.ctx.clip_path));
          this.path = pathPositionRedo(
            clipPath,
            this.posX,
            -1 * this.pdf.internal.pageSize.height * (k - 1) + this.posY
          );
          drawPaths.call(this, rule, true);
          this.path = tmpPaths;
        }
        tmpPath = JSON.parse(JSON.stringify(origPath));
        this.path = pathPositionRedo(
          tmpPath,
          this.posX,
          -1 * this.pdf.internal.pageSize.height * (k - 1) + this.posY
        );
        if (isClip === false || k === 0) {
          drawPaths.call(this, rule, isClip);
        }
        this.lineWidth = oldLineWidth;
      }
    } else {
      this.lineWidth = lineWidth;
      drawPaths.call(this, rule, isClip);
      this.lineWidth = oldLineWidth;
    }
    this.path = origPath;
  };

  /**
   * Processes the paths
   *
   * @function
   * @param rule {String}
   * @param isClip {Boolean}
   * @private
   * @ignore
   */
  var drawPaths = function(rule, isClip) {
    if (rule === "stroke" && !isClip && isStrokeTransparent.call(this)) {
      return;
    }

    if (rule !== "stroke" && !isClip && isFillTransparent.call(this)) {
      return;
    }

    var moves = [];

    //var alpha = (this.ctx.fillOpacity < 1) ? this.ctx.fillOpacity : this.ctx.globalAlpha;
    var delta;
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
          var iii = moves.length;
          if (!isNaN(xPath[i - 1].x)) {
            delta = [pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
            if (iii > 0) {
              for (iii; iii >= 0; iii--) {
                if (
                  moves[iii - 1].close !== true &&
                  moves[iii - 1].begin !== true
                ) {
                  moves[iii - 1].deltas.push(delta);
                  moves[iii - 1].abs.push(pt);
                  break;
                }
              }
            }
          }
          break;

        case "bct":
          delta = [
            pt.x1 - xPath[i - 1].x,
            pt.y1 - xPath[i - 1].y,
            pt.x2 - xPath[i - 1].x,
            pt.y2 - xPath[i - 1].y,
            pt.x - xPath[i - 1].x,
            pt.y - xPath[i - 1].y
          ];
          moves[moves.length - 1].deltas.push(delta);
          break;

        case "qct":
          var x1 = xPath[i - 1].x + (2.0 / 3.0) * (pt.x1 - xPath[i - 1].x);
          var y1 = xPath[i - 1].y + (2.0 / 3.0) * (pt.y1 - xPath[i - 1].y);
          var x2 = pt.x + (2.0 / 3.0) * (pt.x1 - pt.x);
          var y2 = pt.y + (2.0 / 3.0) * (pt.y1 - pt.y);
          var x3 = pt.x;
          var y3 = pt.y;
          delta = [
            x1 - xPath[i - 1].x,
            y1 - xPath[i - 1].y,
            x2 - xPath[i - 1].x,
            y2 - xPath[i - 1].y,
            x3 - xPath[i - 1].x,
            y3 - xPath[i - 1].y
          ];
          moves[moves.length - 1].deltas.push(delta);
          break;

        case "arc":
          moves.push({
            deltas: [],
            abs: [],
            arc: true
          });

          if (Array.isArray(moves[moves.length - 1].abs)) {
            moves[moves.length - 1].abs.push(pt);
          }
          break;
      }
    }
    var style;
    if (!isClip) {
      if (rule === "stroke") {
        style = "stroke";
      } else {
        style = "fill";
      }
    } else {
      style = null;
    }

    for (var k = 0; k < moves.length; k++) {
      if (moves[k].arc) {
        var arcs = moves[k].abs;

        for (var ii = 0; ii < arcs.length; ii++) {
          var arc = arcs[ii];

          if (arc.type === "arc") {
            drawArc.call(
              this,
              arc.x,
              arc.y,
              arc.radius,
              arc.startAngle,
              arc.endAngle,
              arc.counterclockwise,
              undefined,
              isClip
            );
          } else {
            drawLine.call(this, arc.x, arc.y);
          }
        }
        putStyle.call(this, style);
        this.pdf.internal.out("h");
      }
      if (!moves[k].arc) {
        if (moves[k].close !== true && moves[k].begin !== true) {
          var x = moves[k].start.x;
          var y = moves[k].start.y;
          drawLines.call(this, moves[k].deltas, x, y);
        }
      }
    }

    if (style) {
      putStyle.call(this, style);
    }
    if (isClip) {
      doClip.call(this);
    }
  };

  var getBaseline = function(y) {
    var height =
      this.pdf.internal.getFontSize() / this.pdf.internal.scaleFactor;
    var descent = height * (this.pdf.internal.getLineHeightFactor() - 1);
    switch (this.ctx.textBaseline) {
      case "bottom":
        return y - descent;
      case "top":
        return y + height - descent;
      case "hanging":
        return y + height - 2 * descent;
      case "middle":
        return y + height / 2 - descent;
      case "ideographic":
        // TODO not implemented
        return y;
      case "alphabetic":
      default:
        return y;
    }
  };

  Context2D.prototype.createLinearGradient = function createLinearGradient() {
    var canvasGradient = function canvasGradient() {};

    canvasGradient.colorStops = [];
    canvasGradient.addColorStop = function(offset, color) {
      this.colorStops.push([offset, color]);
    };

    canvasGradient.getColor = function() {
      if (this.colorStops.length === 0) {
        return "#000000";
      }

      return this.colorStops[0][1];
    };

    canvasGradient.isCanvasGradient = true;
    return canvasGradient;
  };
  Context2D.prototype.createPattern = function createPattern() {
    return this.createLinearGradient();
  };
  Context2D.prototype.createRadialGradient = function createRadialGradient() {
    return this.createLinearGradient();
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
  var drawArc = function(x, y, r, a1, a2, counterclockwise, style, isClip) {
    var curves = createArc.call(this, r, a1, a2, counterclockwise);

    for (var i = 0; i < curves.length; i++) {
      var curve = curves[i];
      if ( i === 0) {
        doMove.call(this, curve.x1 + x, curve.y1 + y);
      }
      drawCurve.call(
        this,
        x,
        y,
        curve.x2,
        curve.y2,
        curve.x3,
        curve.y3,
        curve.x4,
        curve.y4
      );
    }

    if (!isClip) {
      putStyle.call(this, style);
    } else {
      doClip.call(this);
    }
  };

  var putStyle = function(style) {
    switch (style) {
      case "stroke":
        this.pdf.internal.out("S");
        break;
      case "fill":
        this.pdf.internal.out("f");
        break;
    }
  };

  var doClip = function() {
    this.pdf.clip();
    this.pdf.discardPath();
  };

  var doMove = function(x, y) {
    this.pdf.internal.out(
      getHorizontalCoordinateString(x) +
        " " +
        getVerticalCoordinateString(y) +
        " m"
    );
  };

  var putText = function(options) {
    var textAlign;
    switch (options.align) {
      case "right":
      case "end":
        textAlign = "right";
        break;
      case "center":
        textAlign = "center";
        break;
      case "left":
      case "start":
      default:
        textAlign = "left";
        break;
    }

    var pt = this.ctx.transform.applyToPoint(new Point(options.x, options.y));
    var decomposedTransformationMatrix = this.ctx.transform.decompose();
    var matrix = new Matrix();
    matrix = matrix.multiply(decomposedTransformationMatrix.translate);
    matrix = matrix.multiply(decomposedTransformationMatrix.skew);
    matrix = matrix.multiply(decomposedTransformationMatrix.scale);

    var textDimensions = this.pdf.getTextDimensions(options.text);
    var textRect = this.ctx.transform.applyToRectangle(
      new Rectangle(options.x, options.y, textDimensions.w, textDimensions.h)
    );
    var textXRect = matrix.applyToRectangle(
      new Rectangle(
        options.x,
        options.y - textDimensions.h,
        textDimensions.w,
        textDimensions.h
      )
    );
    var pageArray = getPagesByPath.call(this, textXRect);
    var pages = [];
    for (var ii = 0; ii < pageArray.length; ii += 1) {
      if (pages.indexOf(pageArray[ii]) === -1) {
        pages.push(pageArray[ii]);
      }
    }

    sortPages(pages);

    var clipPath, oldSize, oldLineWidth;
    if (this.autoPaging === true) {
      var min = pages[0];
      var max = pages[pages.length - 1];
      for (var i = min; i < max + 1; i++) {
        this.pdf.setPage(i);

        if (this.ctx.clip_path.length !== 0) {
          var tmpPaths = this.path;
          clipPath = JSON.parse(JSON.stringify(this.ctx.clip_path));
          this.path = pathPositionRedo(
            clipPath,
            this.posX,
            -1 * this.pdf.internal.pageSize.height * (i - 1) + this.posY
          );
          drawPaths.call(this, "fill", true);
          this.path = tmpPaths;
        }
        var tmpRect = JSON.parse(JSON.stringify(textRect));
        tmpRect = pathPositionRedo(
          [tmpRect],
          this.posX,
          -1 * this.pdf.internal.pageSize.height * (i - 1) + this.posY
        )[0];

        if (options.scale >= 0.01) {
          oldSize = this.pdf.internal.getFontSize();
          this.pdf.setFontSize(oldSize * options.scale);
          oldLineWidth = this.lineWidth;
          this.lineWidth = oldLineWidth * options.scale;
        }
        this.pdf.text(options.text, tmpRect.x, tmpRect.y, {
          angle: options.angle,
          align: textAlign,
          renderingMode: options.renderingMode,
          maxWidth: options.maxWidth
        });

        if (options.scale >= 0.01) {
          this.pdf.setFontSize(oldSize);
          this.lineWidth = oldLineWidth;
        }
      }
    } else {
      if (options.scale >= 0.01) {
        oldSize = this.pdf.internal.getFontSize();
        this.pdf.setFontSize(oldSize * options.scale);
        oldLineWidth = this.lineWidth;
        this.lineWidth = oldLineWidth * options.scale;
      }
      this.pdf.text(options.text, pt.x + this.posX, pt.y + this.posY, {
        angle: options.angle,
        align: textAlign,
        renderingMode: options.renderingMode,
        maxWidth: options.maxWidth
      });

      if (options.scale >= 0.01) {
        this.pdf.setFontSize(oldSize);
        this.lineWidth = oldLineWidth;
      }
    }
  };

  var drawLine = function(x, y, prevX, prevY) {
    prevX = prevX || 0;
    prevY = prevY || 0;

    this.pdf.internal.out(
      getHorizontalCoordinateString(x + prevX) +
        " " +
        getVerticalCoordinateString(y + prevY) +
        " l"
    );
  };

  var drawLines = function(lines, x, y) {
    return this.pdf.lines(lines, x, y, null, null);
  };

  var drawCurve = function(x, y, x1, y1, x2, y2, x3, y3) {
    this.pdf.internal.out(
      [
        f2(getHorizontalCoordinate(x1 + x)),
        f2(getVerticalCoordinate(y1 + y)),
        f2(getHorizontalCoordinate(x2 + x)),
        f2(getVerticalCoordinate(y2 + y)),
        f2(getHorizontalCoordinate(x3 + x)),
        f2(getVerticalCoordinate(y3 + y)),
        "c"
      ].join(" ")
    );
  };

  /**
   * Return a array of objects that represent bezier curves which approximate the circular arc centered at the origin, from startAngle to endAngle (radians) with the specified radius.
   *
   * Each bezier curve is an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
   * @function createArc
   */
  var createArc = function(radius, startAngle, endAngle, anticlockwise) {
    var EPSILON = 0.00001; // Roughly 1/1000th of a degree, see below
    var twoPi = Math.PI * 2;
    var halfPi = Math.PI / 2.0;

    while (startAngle > endAngle) {
      startAngle = startAngle - twoPi;
    }
    var totalAngle = Math.abs(endAngle - startAngle);
    if (totalAngle < twoPi) {
      if (anticlockwise) {
        totalAngle = twoPi - totalAngle;
      }
    }

    // Compute the sequence of arc curves, up to PI/2 at a time.
    var curves = [];

    // clockwise or counterclockwise
    var sgn = anticlockwise ? -1 : +1;

    var a1 = startAngle;
    for (; totalAngle > EPSILON; ) {
      var remain = sgn * Math.min(totalAngle, halfPi);
      var a2 = a1 + remain;
      curves.push(createSmallArc.call(this, radius, a1, a2));
      totalAngle -= Math.abs(a2 - a1);
      a1 = a2;
    }

    return curves;
  };

  /**
   * Cubic bezier approximation of a circular arc centered at the origin, from (radians) a1 to a2, where a2-a1 < pi/2. The arc's radius is r.
   *
   * Returns an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
   *
   * This algorithm is based on the approach described in: A. Riškus, "Approximation of a Cubic Bezier Curve by Circular Arcs and Vice Versa," Information Technology and Control, 35(4), 2006 pp. 371-378.
   */
  var createSmallArc = function(r, a1, a2) {
    var a = (a2 - a1) / 2.0;

    var x4 = r * Math.cos(a);
    var y4 = r * Math.sin(a);
    var x1 = x4;
    var y1 = -y4;

    var q1 = x1 * x1 + y1 * y1;
    var q2 = q1 + x1 * x4 + y1 * y4;
    var k2 = ((4 / 3) * (Math.sqrt(2 * q1 * q2) - q2)) / (x1 * y4 - y1 * x4);

    var x2 = x1 - k2 * y1;
    var y2 = y1 + k2 * x1;
    var x3 = x2;
    var y3 = -y2;

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

  var rad2deg = function(value) {
    return (value * 180) / Math.PI;
  };

  var getQuadraticCurveBoundary = function(sx, sy, cpx, cpy, ex, ey) {
    var midX1 = sx + (cpx - sx) * 0.5;
    var midY1 = sy + (cpy - sy) * 0.5;
    var midX2 = ex + (cpx - ex) * 0.5;
    var midY2 = ey + (cpy - ey) * 0.5;
    var resultX1 = Math.min(sx, ex, midX1, midX2);
    var resultX2 = Math.max(sx, ex, midX1, midX2);
    var resultY1 = Math.min(sy, ey, midY1, midY2);
    var resultY2 = Math.max(sy, ey, midY1, midY2);
    return new Rectangle(
      resultX1,
      resultY1,
      resultX2 - resultX1,
      resultY2 - resultY1
    );
  };

  //De Casteljau algorithm
  var getBezierCurveBoundary = function(ax, ay, bx, by, cx, cy, dx, dy) {
    var tobx = bx - ax;
    var toby = by - ay;
    var tocx = cx - bx;
    var tocy = cy - by;
    var todx = dx - cx;
    var tody = dy - cy;
    var precision = 40;
    var d,
      i,
      px,
      py,
      qx,
      qy,
      rx,
      ry,
      tx,
      ty,
      sx,
      sy,
      x,
      y,
      minx,
      miny,
      maxx,
      maxy,
      toqx,
      toqy,
      torx,
      tory,
      totx,
      toty;
    for (i = 0; i < precision + 1; i++) {
      d = i / precision;
      px = ax + d * tobx;
      py = ay + d * toby;
      qx = bx + d * tocx;
      qy = by + d * tocy;
      rx = cx + d * todx;
      ry = cy + d * tody;
      toqx = qx - px;
      toqy = qy - py;
      torx = rx - qx;
      tory = ry - qy;

      sx = px + d * toqx;
      sy = py + d * toqy;
      tx = qx + d * torx;
      ty = qy + d * tory;
      totx = tx - sx;
      toty = ty - sy;

      x = sx + d * totx;
      y = sy + d * toty;
      if (i == 0) {
        minx = x;
        miny = y;
        maxx = x;
        maxy = y;
      } else {
        minx = Math.min(minx, x);
        miny = Math.min(miny, y);
        maxx = Math.max(maxx, x);
        maxy = Math.max(maxy, y);
      }
    }
    return new Rectangle(
      Math.round(minx),
      Math.round(miny),
      Math.round(maxx - minx),
      Math.round(maxy - miny)
    );
  };
})(jsPDF.API);

/**
 * @license
 * jsPDF filters PlugIn
 * Copyright (c) 2014 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function(jsPDFAPI) {

  var ASCII85Encode = function(a) {
    var b, c, d, e, f, g, h, i, j, k;
    // eslint-disable-next-line no-control-regex
    for (
      !/[^\x00-\xFF]/.test(a),
        b = "\x00\x00\x00\x00".slice(a.length % 4 || 4),
        a += b,
        c = [],
        d = 0,
        e = a.length;
      e > d;
      d += 4
    )
      (f =
        (a.charCodeAt(d) << 24) +
        (a.charCodeAt(d + 1) << 16) +
        (a.charCodeAt(d + 2) << 8) +
        a.charCodeAt(d + 3)),
        0 !== f
          ? ((k = f % 85),
            (f = (f - k) / 85),
            (j = f % 85),
            (f = (f - j) / 85),
            (i = f % 85),
            (f = (f - i) / 85),
            (h = f % 85),
            (f = (f - h) / 85),
            (g = f % 85),
            c.push(g + 33, h + 33, i + 33, j + 33, k + 33))
          : c.push(122);
    return (
      (function(a, b) {
        for (var c = b; c > 0; c--) a.pop();
      })(c, b.length),
      String.fromCharCode.apply(String, c) + "~>"
    );
  };

  var ASCII85Decode = function(a) {
    var c,
      d,
      e,
      f,
      g,
      h = String,
      l = "length",
      w = 255,
      x = "charCodeAt",
      y = "slice",
      z = "replace";
    for (
      "~>" === a[y](-2),
        a = a[y](0, -2)
          [z](/\s/g, "")
          [z]("z", "!!!!!"),
        c = "uuuuu"[y](a[l] % 5 || 5),
        a += c,
        e = [],
        f = 0,
        g = a[l];
      g > f;
      f += 5
    )
      (d =
        52200625 * (a[x](f) - 33) +
        614125 * (a[x](f + 1) - 33) +
        7225 * (a[x](f + 2) - 33) +
        85 * (a[x](f + 3) - 33) +
        (a[x](f + 4) - 33)),
        e.push(w & (d >> 24), w & (d >> 16), w & (d >> 8), w & d);
    return (
      (function(a, b) {
        for (var c = b; c > 0; c--) a.pop();
      })(e, c[l]),
      h.fromCharCode.apply(h, e)
    );
  };

  var ASCIIHexEncode = function(value) {
    return (
      value
        .split("")
        .map(function(value) {
          return ("0" + value.charCodeAt().toString(16)).slice(-2);
        })
        .join("") + ">"
    );
  };

  var ASCIIHexDecode = function(value) {
    var regexCheckIfHex = new RegExp(/^([0-9A-Fa-f]{2})+$/);
    value = value.replace(/\s/g, "");
    if (value.indexOf(">") !== -1) {
      value = value.substr(0, value.indexOf(">"));
    }
    if (value.length % 2) {
      value += "0";
    }
    if (regexCheckIfHex.test(value) === false) {
      return "";
    }
    var result = "";
    for (var i = 0; i < value.length; i += 2) {
      result += String.fromCharCode("0x" + (value[i] + value[i + 1]));
    }
    return result;
  };
  /*
  var FlatePredictors = {
      None: 1,
      TIFF: 2,
      PNG_None: 10,
      PNG_Sub: 11,
      PNG_Up: 12,
      PNG_Average: 13,
      PNG_Paeth: 14,
      PNG_Optimum: 15
  };
  */

  var FlateEncode = function(data) {
    var arr = new Uint8Array(data.length);
    var i = data.length;
    while (i--) {
      arr[i] = data.charCodeAt(i);
    }
    arr = fflate.zlibSync(arr);
    data = arr.reduce(function(data, byte) {
      return data + String.fromCharCode(byte);
    }, "");
    return data;
  };

  jsPDFAPI.processDataByFilters = function(origData, filterChain) {
    var i = 0;
    var data = origData || "";
    var reverseChain = [];
    filterChain = filterChain || [];

    if (typeof filterChain === "string") {
      filterChain = [filterChain];
    }

    for (i = 0; i < filterChain.length; i += 1) {
      switch (filterChain[i]) {
        case "ASCII85Decode":
        case "/ASCII85Decode":
          data = ASCII85Decode(data);
          reverseChain.push("/ASCII85Encode");
          break;
        case "ASCII85Encode":
        case "/ASCII85Encode":
          data = ASCII85Encode(data);
          reverseChain.push("/ASCII85Decode");
          break;
        case "ASCIIHexDecode":
        case "/ASCIIHexDecode":
          data = ASCIIHexDecode(data);
          reverseChain.push("/ASCIIHexEncode");
          break;
        case "ASCIIHexEncode":
        case "/ASCIIHexEncode":
          data = ASCIIHexEncode(data);
          reverseChain.push("/ASCIIHexDecode");
          break;
        case "FlateEncode":
        case "/FlateEncode":
          data = FlateEncode(data);
          reverseChain.push("/FlateDecode");
          break;
        default:
          throw new Error(
            'The filter: "' + filterChain[i] + '" is not implemented'
          );
      }
    }

    return { data: data, reverseChain: reverseChain.reverse().join(" ") };
  };
})(jsPDF.API);

/**
 * @license
 * jsPDF fileloading PlugIn
 * Copyright (c) 2018 Aras Abbasi (aras.abbasi@gmail.com)
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * @name fileloading
 * @module
 */
(function(jsPDFAPI) {

  /**
   * @name loadFile
   * @function
   * @param {string} url
   * @param {boolean} sync
   * @param {function} callback
   * @returns {string|undefined} result
   */
  jsPDFAPI.loadFile = function(url, sync, callback) {

    // eslint-disable-next-line no-unreachable
    return nodeReadFile(url, sync, callback);
  };

  /**
   * @name loadImageFile
   * @function
   * @param {string} path
   * @param {boolean} sync
   * @param {function} callback
   */
  jsPDFAPI.loadImageFile = jsPDFAPI.loadFile;

  function nodeReadFile(url, sync, callback) {
    sync = sync === false ? false : true;
    var result = undefined;

    var fs = require("fs");
    var path = require("path");

    url = path.resolve(url);
    if (sync) {
      try {
        result = fs.readFileSync(url, { encoding: "latin1" });
      } catch (e) {
        return undefined;
      }
    } else {
      fs.readFile(url, { encoding: "latin1" }, function(err, data) {
        if (!callback) {
          return;
        }
        if (err) {
          callback(undefined);
        }
        callback(data);
      });
    }

    return result;
  }
})(jsPDF.API);

/**
 * @license
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
(function(jsPDFAPI) {

  function loadHtml2Canvas() {
    return (function() {
      if (globalObject["html2canvas"]) {
        return Promise.resolve(globalObject["html2canvas"]);
      }


      if (typeof exports === "object" && typeof module !== "undefined") {
        return new Promise(function(resolve, reject) {
          try {
            resolve(require("html2canvas"));
          } catch (e) {
            reject(e);
          }
        });
      }
      if (typeof define === "function" && define.amd) {
        return new Promise(function(resolve, reject) {
          try {
            require(["html2canvas"], resolve);
          } catch (e) {
            reject(e);
          }
        });
      }
      return Promise.reject(new Error("Could not load html2canvas"));
    })()
      .catch(function(e) {
        return Promise.reject(new Error("Could not load html2canvas: " + e));
      })
      .then(function(html2canvas) {
        return html2canvas.default ? html2canvas.default : html2canvas;
      });
  }

  function loadDomPurify() {
    return (function() {
      if (globalObject["DOMPurify"]) {
        return Promise.resolve(globalObject["DOMPurify"]);
      }


      if (typeof exports === "object" && typeof module !== "undefined") {
        return new Promise(function(resolve, reject) {
          try {
            resolve(require("dompurify"));
          } catch (e) {
            reject(e);
          }
        });
      }
      if (typeof define === "function" && define.amd) {
        return new Promise(function(resolve, reject) {
          try {
            require(["dompurify"], resolve);
          } catch (e) {
            reject(e);
          }
        });
      }
      return Promise.reject(new Error("Could not load dompurify"));
    })()
      .catch(function(e) {
        return Promise.reject(new Error("Could not load dompurify: " + e));
      })
      .then(function(dompurify) {
        return dompurify.default ? dompurify.default : dompurify;
      });
  }

  /**
   * Determine the type of a variable/object.
   *
   * @private
   * @ignore
   */
  var objType = function(obj) {
    var type = typeof obj;
    if (type === "undefined") return "undefined";
    else if (type === "string" || obj instanceof String) return "string";
    else if (type === "number" || obj instanceof Number) return "number";
    else if (type === "function" || obj instanceof Function) return "function";
    else if (!!obj && obj.constructor === Array) return "array";
    else if (obj && obj.nodeType === 1) return "element";
    else if (type === "object") return "object";
    else return "unknown";
  };

  /**
   * Create an HTML element with optional className, innerHTML, and style.
   *
   * @private
   * @ignore
   */
  var createElement = function(tagName, opt) {
    var el = document.createElement(tagName);
    if (opt.className) el.className = opt.className;
    if (opt.innerHTML && opt.dompurify) {
      el.innerHTML = opt.dompurify.sanitize(opt.innerHTML);
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
  var cloneNode = function(node, javascriptEnabled) {
    // Recursively clone the node.
    var clone =
      node.nodeType === 3
        ? document.createTextNode(node.nodeValue)
        : node.cloneNode(false);
    for (var child = node.firstChild; child; child = child.nextSibling) {
      if (
        javascriptEnabled === true ||
        child.nodeType !== 1 ||
        child.nodeName !== "SCRIPT"
      ) {
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
      }

      // Preserve the node's scroll position when it loads.
      clone.addEventListener(
        "load",
        function() {
          clone.scrollTop = node.scrollTop;
          clone.scrollLeft = node.scrollLeft;
        },
        true
      );
    }

    // Return the cloned node.
    return clone;
  };

  /* ----- CONSTRUCTOR ----- */

  var Worker = function Worker(opt) {
    // Create the root parent for the proto chain, and the starting Worker.
    var root = Object.assign(
      Worker.convert(Promise.resolve()),
      JSON.parse(JSON.stringify(Worker.template))
    );
    var self = Worker.convert(Promise.resolve(), root);

    // Set progress, optional settings, and return.
    self = self.setProgress(1, Worker, 1, [Worker]);
    self = self.set(opt);
    return self;
  };

  // Boilerplate for subclassing Promise.
  Worker.prototype = Object.create(Promise.prototype);
  Worker.prototype.constructor = Worker;

  // Converts/casts promises into Workers.
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
      callback: function() {}
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
      x: 0,
      y: 0,
      html2canvas: {},
      jsPDF: {},
      backgroundColor: "transparent"
    }
  };

  /* ----- FROM / TO ----- */

  Worker.prototype.from = function from(src, type) {
    function getType(src) {
      switch (objType(src)) {
        case "string":
          return "string";
        case "element":
          return src.nodeName.toLowerCase() === "canvas" ? "canvas" : "element";
        default:
          return "unknown";
      }
    }

    return this.then(function from_main() {
      type = type || getType(src);
      switch (type) {
        case "string":
          return this.then(loadDomPurify).then(function(dompurify) {
            return this.set({
              src: createElement("div", {
                innerHTML: src,
                dompurify: dompurify
              })
            });
          });
        case "element":
          return this.set({ src: src });
        case "canvas":
          return this.set({ canvas: src });
        case "img":
          return this.set({ img: src });
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
    var prereqs = [
      function checkSrc() {
        return (
          this.prop.src || this.error("Cannot duplicate - no source HTML.")
        );
      },
      function checkPageSize() {
        return this.prop.pageSize || this.setPageSize();
      }
    ];
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
        width:
          Math.max(
            this.prop.src.clientWidth,
            this.prop.src.scrollWidth,
            this.prop.src.offsetWidth
          ) + "px",
        left: 0,
        right: 0,
        top: 0,
        margin: "auto",
        backgroundColor: this.opt.backgroundColor
      }; // Set the overlay to hidden (could be changed in the future to provide a print preview).

      var source = cloneNode(
        this.prop.src,
        this.opt.html2canvas.javascriptEnabled
      );

      if (source.tagName === "BODY") {
        containerCSS.height =
          Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
          ) + "px";
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
      this.prop.container.firstChild.appendChild(
        createElement("div", {
          style: {
            clear: "both",
            border: "0 none transparent",
            margin: 0,
            padding: 0,
            height: 0
          }
        })
      );
      this.prop.container.style.float = "none";
      this.prop.overlay.appendChild(this.prop.container);
      document.body.appendChild(this.prop.overlay);
      this.prop.container.firstChild.style.position = "relative";
      this.prop.container.height =
        Math.max(
          this.prop.container.firstChild.clientHeight,
          this.prop.container.firstChild.scrollHeight,
          this.prop.container.firstChild.offsetHeight
        ) + "px";
    });
  };

  Worker.prototype.toCanvas = function toCanvas() {
    // Set up function prerequisites.
    var prereqs = [
      function checkContainer() {
        return (
          document.body.contains(this.prop.container) || this.toContainer()
        );
      }
    ];

    // Fulfill prereqs then create the canvas.
    return this.thenList(prereqs)
      .then(loadHtml2Canvas)
      .then(function toCanvas_main(html2canvas) {
        // Handle old-fashioned 'onrendered' argument.
        var options = Object.assign({}, this.opt.html2canvas);
        delete options.onrendered;

        return html2canvas(this.prop.container, options);
      })
      .then(function toCanvas_post(canvas) {
        // Handle old-fashioned 'onrendered' argument.
        var onRendered = this.opt.html2canvas.onrendered || function() {};
        onRendered(canvas);

        this.prop.canvas = canvas;
        document.body.removeChild(this.prop.overlay);
      });
  };

  Worker.prototype.toContext2d = function toContext2d() {
    // Set up function prerequisites.
    var prereqs = [
      function checkContainer() {
        return (
          document.body.contains(this.prop.container) || this.toContainer()
        );
      }
    ];

    // Fulfill prereqs then create the canvas.
    return this.thenList(prereqs)
      .then(loadHtml2Canvas)
      .then(function toContext2d_main(html2canvas) {
        // Handle old-fashioned 'onrendered' argument.

        var pdf = this.opt.jsPDF;
        var fontFaces = this.opt.fontFaces;
        var options = Object.assign(
          {
            async: true,
            allowTaint: true,
            scale: 1,
            scrollX: this.opt.scrollX || 0,
            scrollY: this.opt.scrollY || 0,
            backgroundColor: "#ffffff",
            imageTimeout: 15000,
            logging: true,
            proxy: null,
            removeContainer: true,
            foreignObjectRendering: false,
            useCORS: false
          },
          this.opt.html2canvas
        );
        delete options.onrendered;

        pdf.context2d.autoPaging = true;
        pdf.context2d.posX = this.opt.x;
        pdf.context2d.posY = this.opt.y;
        pdf.context2d.fontFaces = fontFaces;

        if (fontFaces) {
          for (var i = 0; i < fontFaces.length; ++i) {
            var font = fontFaces[i];
            var src = font.src.find(function(src) {
              return src.format === "truetype";
            });

            if (src) {
              pdf.addFont(src.url, font.ref.name, font.ref.style);
            }
          }
        }

        options.windowHeight = options.windowHeight || 0;
        options.windowHeight =
          options.windowHeight == 0
            ? Math.max(
                this.prop.container.clientHeight,
                this.prop.container.scrollHeight,
                this.prop.container.offsetHeight
              )
            : options.windowHeight;

        return html2canvas(this.prop.container, options);
      })
      .then(function toContext2d_post(canvas) {
        // Handle old-fashioned 'onrendered' argument.
        var onRendered = this.opt.html2canvas.onrendered || function() {};
        onRendered(canvas);

        this.prop.canvas = canvas;
        document.body.removeChild(this.prop.overlay);
      });
  };

  Worker.prototype.toImg = function toImg() {
    // Set up function prerequisites.
    var prereqs = [
      function checkCanvas() {
        return this.prop.canvas || this.toCanvas();
      }
    ];

    // Fulfill prereqs then create the image.
    return this.thenList(prereqs).then(function toImg_main() {
      var imgData = this.prop.canvas.toDataURL(
        "image/" + this.opt.image.type,
        this.opt.image.quality
      );
      this.prop.img = document.createElement("img");
      this.prop.img.src = imgData;
    });
  };

  Worker.prototype.toPdf = function toPdf() {
    // Set up function prerequisites.
    var prereqs = [
      function checkContext2d() {
        return this.toContext2d();
      }
      //function checkCanvas() { return this.prop.canvas || this.toCanvas(); }
    ];

    // Fulfill prereqs then create the image.
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
    var prereqs = [
      function checkPdf() {
        return this.prop.pdf || this.toPdf();
      }
    ];

    // Fulfill prereqs then perform the appropriate output.
    return this.thenList(prereqs).then(function outputPdf_main() {
      /* Currently implemented output types:
       *    https://rawgit.com/MrRio/jsPDF/master/docs/jspdf.js.html#line992
       *  save(options), arraybuffer, blob, bloburi/bloburl,
       *  datauristring/dataurlstring, dataurlnewwindow, datauri/dataurl
       */
      return this.prop.pdf.output(type, options);
    });
  };

  Worker.prototype.outputImg = function outputImg(type) {
    // Set up function prerequisites.
    var prereqs = [
      function checkImg() {
        return this.prop.img || this.toImg();
      }
    ];

    // Fulfill prereqs then perform the appropriate output.
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
          return (document.location.href = this.prop.img.src);
        default:
          throw 'Image output type "' + type + '" is not supported.';
      }
    });
  };

  Worker.prototype.save = function save(filename) {
    // Set up function prerequisites.
    var prereqs = [
      function checkPdf() {
        return this.prop.pdf || this.toPdf();
      }
    ];

    // Fulfill prereqs, update the filename (if provided), and save the PDF.
    return this.thenList(prereqs)
      .set(filename ? { filename: filename } : null)
      .then(function save_main() {
        this.prop.pdf.save(this.opt.filename);
      });
  };

  Worker.prototype.doCallback = function doCallback() {
    // Set up function prerequisites.
    var prereqs = [
      function checkPdf() {
        return this.prop.pdf || this.toPdf();
      }
    ];

    // Fulfill prereqs, update the filename (if provided), and save the PDF.
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
    }

    // Build an array of setter functions to queue.
    var fns = Object.keys(opt || {}).map(function(key) {
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
    }, this);

    // Set properties within the promise chain.
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
        // eslint-disable-next-line no-fallthrough
        case "array":
          if (margin.length === 2) {
            margin = [margin[0], margin[1], margin[0], margin[1]];
          }
          if (margin.length === 4) {
            break;
          }
        // eslint-disable-next-line no-fallthrough
        default:
          return this.error("Invalid margin array.");
      }

      // Set the margin property, then update pageSize.
      this.opt.margin = margin;
    }).then(this.setPageSize);
  };

  Worker.prototype.setPageSize = function setPageSize(pageSize) {
    function toPx(val, k) {
      return Math.floor(((val * k) / 72) * 96);
    }

    return this.then(function setPageSize_main() {
      // Retrieve page-size based on jsPDF settings, if not explicitly provided.
      pageSize = pageSize || jsPDF.getPageSize(this.opt.jsPDF);

      // Add 'inner' field if not present.
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
      }

      // Attach pageSize to this.
      this.prop.pageSize = pageSize;
    });
  };

  Worker.prototype.setProgress = function setProgress(val, state, n, stack) {
    // Immediately update all progress values.
    if (val != null) this.progress.val = val;
    if (state != null) this.progress.state = state;
    if (n != null) this.progress.n = n;
    if (stack != null) this.progress.stack = stack;
    this.progress.ratio = this.progress.val / this.progress.state;

    // Return this for command chaining.
    return this;
  };

  Worker.prototype.updateProgress = function updateProgress(
    val,
    state,
    n,
    stack
  ) {
    // Immediately update all progress values, using setProgress.
    return this.setProgress(
      val ? this.progress.val + val : null,
      state ? state : null,
      n ? this.progress.n + n : null,
      stack ? this.progress.stack.concat(stack) : null
    );
  };

  /* ----- PROMISE MAPPING ----- */

  Worker.prototype.then = function then(onFulfilled, onRejected) {
    // Wrap `this` for encapsulation.
    var self = this;

    return this.thenCore(onFulfilled, onRejected, function then_main(
      onFulfilled,
      onRejected
    ) {
      // Update progress while queuing, calling, and resolving `then`.
      self.updateProgress(null, null, 1, [onFulfilled]);
      return Promise.prototype.then
        .call(this, function then_pre(val) {
          self.updateProgress(null, onFulfilled);
          return val;
        })
        .then(onFulfilled, onRejected)
        .then(function then_post(val) {
          self.updateProgress(1);
          return val;
        });
    });
  };

  Worker.prototype.thenCore = function thenCore(
    onFulfilled,
    onRejected,
    thenBase
  ) {
    // Handle optional thenBase parameter.
    thenBase = thenBase || Promise.prototype.then;

    // Wrap `this` for encapsulation and bind it to the promise handlers.
    var self = this;
    if (onFulfilled) {
      onFulfilled = onFulfilled.bind(self);
    }
    if (onRejected) {
      onRejected = onRejected.bind(self);
    }

    // Cast self into a Promise to avoid polyfills recursively defining `then`.
    var isNative =
      Promise.toString().indexOf("[native code]") !== -1 &&
      Promise.name === "Promise";
    var selfPromise = isNative
      ? self
      : Worker.convert(Object.assign({}, self), Promise.prototype);

    // Return the promise, after casting it into a Worker and preserving props.
    var returnVal = thenBase.call(selfPromise, onFulfilled, onRejected);
    return Worker.convert(returnVal, self.__proto__);
  };

  Worker.prototype.thenExternal = function thenExternal(
    onFulfilled,
    onRejected
  ) {
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

  Worker.prototype["catch"] = function(onRejected) {
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
  Worker.prototype.run = Worker.prototype.then;

  // Get dimensions of a PDF page, as determined by jsPDF.
  jsPDF.getPageSize = function(orientation, unit, format) {
    // Decode options object
    if (typeof orientation === "object") {
      var options = orientation;
      orientation = options.orientation;
      unit = options.unit || unit;
      format = options.format || format;
    }

    // Default options
    unit = unit || "mm";
    format = format || "a4";
    orientation = ("" + (orientation || "P")).toLowerCase();
    var format_as_string = ("" + format).toLowerCase();

    // Size in pt of various paper formats
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
    };

    var k;
    // Unit conversion
    switch (unit) {
      case "pt":
        k = 1;
        break;
      case "mm":
        k = 72 / 25.4;
        break;
      case "cm":
        k = 72 / 2.54;
        break;
      case "in":
        k = 72;
        break;
      case "px":
        k = 72 / 96;
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
    var pageHeight = 0;
    var pageWidth = 0;

    // Dimensions are stored as user units and converted to points on output
    if (pageFormats.hasOwnProperty(format_as_string)) {
      pageHeight = pageFormats[format_as_string][1] / k;
      pageWidth = pageFormats[format_as_string][0] / k;
    } else {
      try {
        pageHeight = format[1];
        pageWidth = format[0];
      } catch (err) {
        throw new Error("Invalid format: " + format);
      }
    }

    var tmp;
    // Handle page orientation
    if (orientation === "p" || orientation === "portrait") {
      orientation = "p";
      if (pageWidth > pageHeight) {
        tmp = pageWidth;
        pageWidth = pageHeight;
        pageHeight = tmp;
      }
    } else if (orientation === "l" || orientation === "landscape") {
      orientation = "l";
      if (pageHeight > pageWidth) {
        tmp = pageWidth;
        pageWidth = pageHeight;
        pageHeight = tmp;
      }
    } else {
      throw "Invalid orientation: " + orientation;
    }

    // Return information (k is the unit conversion ratio from pts)
    var info = {
      width: pageWidth,
      height: pageHeight,
      unit: unit,
      k: k,
      orientation: orientation
    };
    return info;
  };

  /**
   * @typedef FontFace
   *
   * The font-face type implements an interface similar to that of the font-face CSS rule,
   * and is used by jsPDF to match fonts when the font property of CanvasRenderingContext2D
   * is updated.
   *
   * All properties expect values similar to those in the font-face CSS rule. A difference
   * is the font-family, which do not need to be enclosed in double-quotes when containing
   * spaces like in CSS.
   *
   * @property {string} family The name of the font-family.
   * @property {string|undefined} style The style that this font-face defines, e.g. 'italic'.
   * @property {string|number|undefined} weight The weight of the font, either as a string or a number (400, 500, 600, e.g.)
   * @property {string|undefined} stretch The stretch of the font, e.g. condensed, normal, expanded.
   * @property {Object[]} src A list of URLs from where fonts of various formats can be fetched.
   * @property {string} [src] url A URL to a font of a specific format.
   * @property {string} [src] format Format of the font referenced by the URL.
   */

  /**
   * Generate a PDF from an HTML element or string using.
   *
   * @name html
   * @function
   * @param {HTMLElement|string} source The source HTMLElement or a string containing HTML.
   * @param {Object} [options] Collection of settings
   * @param {function} [options.callback] The mandatory callback-function gets as first parameter the current jsPDF instance
   * @param {number|array} [options.margin] Array of margins [left, bottom, right, top]
   * @param {string} [options.filename] name of the file
   * @param {HTMLOptionImage} [options.image] image settings when converting HTML to image
   * @param {Html2CanvasOptions} [options.html2canvas] html2canvas options
   * @param {FontFace[]} [options.fontFaces] A list of font-faces to match when resolving fonts. Fonts will be added to the PDF based on the specified URL. If omitted, the font match algorithm falls back to old algorithm.
   * @param {jsPDF} [options.jsPDF] jsPDF instance
   * @param {number} [options.x] x position on the PDF document
   * @param {number} [options.y] y position on the PDF document
   *
   * @example
   * var doc = new jsPDF();
   *
   * doc.html(document.body, {
   *    callback: function (doc) {
   *      doc.save();
   *    },
   *    x: 10,
   *    y: 10
   * });
   */
  jsPDFAPI.html = function(src, options) {

    options = options || {};
    options.callback = options.callback || function() {};
    options.html2canvas = options.html2canvas || {};
    options.html2canvas.canvas = options.html2canvas.canvas || this.canvas;
    options.jsPDF = options.jsPDF || this;
    options.fontFaces = options.fontFaces
      ? options.fontFaces.map(normalizeFontFace)
      : null;

    // Create a new worker with the given options.
    var worker = new Worker(options);

    if (!options.worker) {
      // If worker is not set to true, perform the traditional 'simple' operation.
      return worker.from(src).doCallback();
    } else {
      // Otherwise, return the worker for new Promise-based operation.
      return worker;
    }
  };
})(jsPDF.API);

/**
 * @license
 * ====================================================================
 * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

/**
 * jsPDF JavaScript plugin
 *
 * @name javascript
 * @module
 */
(function(jsPDFAPI) {
  var jsNamesObj, jsJsObj, text;
  /**
   * @name addJS
   * @function
   * @param {string} javascript The javascript to be embedded into the PDF-file.
   * @returns {jsPDF}
   */
  jsPDFAPI.addJS = function(javascript) {
    text = javascript;
    this.internal.events.subscribe("postPutResources", function() {
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
    this.internal.events.subscribe("putCatalog", function() {
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
(function(jsPDFAPI) {

  var namesOid;
  //var destsGoto = [];

  jsPDFAPI.events.push([
    "postPutResources",
    function() {
      var pdf = this;
      var rx = /^(\d+) 0 obj$/;

      // Write action goto objects for each page
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
            pdf.internal.newObjectDeferredBegin(oid, false);
          }
          pdf.internal.write(line);
        }
      }

      // This code will write named destination for each page reference
      // (page_1, etc)
      if (this.outline.createNamedDestinations) {
        var totalPages = this.internal.pages.length;
        // WARNING: this assumes jsPDF starts on page 3 and pageIDs
        // follow 5, 7, 9, etc
        // Write destination objects for each page
        var dests = [];
        for (var i = 0; i < totalPages; i++) {
          var id = pdf.internal.newObject();
          dests.push(id);
          var info = pdf.internal.getPageInfo(i + 1);
          pdf.internal.write(
            "<< /D[" + info.objId + " 0 R /XYZ null null null]>> endobj"
          );
        }

        // assign a name for each destination
        var names2Oid = pdf.internal.newObject();
        pdf.internal.write("<< /Names [ ");
        for (var i = 0; i < dests.length; i++) {
          pdf.internal.write("(page_" + (i + 1) + ")" + dests[i] + " 0 R");
        }
        pdf.internal.write(" ] >>", "endobj");

        // var kids = pdf.internal.newObject();
        // pdf.internal.write('<< /Kids [ ' + names2Oid + ' 0 R');
        // pdf.internal.write(' ] >>', 'endobj');

        namesOid = pdf.internal.newObject();
        pdf.internal.write("<< /Dests " + names2Oid + " 0 R");
        pdf.internal.write(">>", "endobj");
      }
    }
  ]);

  jsPDFAPI.events.push([
    "putCatalog",
    function() {
      var pdf = this;
      if (pdf.outline.root.children.length > 0) {
        pdf.internal.write(
          "/Outlines",
          this.outline.makeRef(this.outline.root)
        );
        if (this.outline.createNamedDestinations) {
          pdf.internal.write("/Names " + namesOid + " 0 R");
        }
        // Open with Bookmarks showing
        // pdf.internal.write("/PageMode /UseOutlines");
      }
    }
  ]);

  jsPDFAPI.events.push([
    "initialized",
    function() {
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
      pdf.outline.add = function(parent, title, options) {
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

      pdf.outline.render = function() {
        this.ctx = {};
        this.ctx.val = "";
        this.ctx.pdf = pdf;

        this.genIds_r(this.root);
        this.renderRoot(this.root);
        this.renderItems(this.root);

        return this.ctx.val;
      };

      pdf.outline.genIds_r = function(node) {
        node.id = pdf.internal.newObjectDeferred();
        for (var i = 0; i < node.children.length; i++) {
          this.genIds_r(node.children[i]);
        }
      };

      pdf.outline.renderRoot = function(node) {
        this.objStart(node);
        this.line("/Type /Outlines");
        if (node.children.length > 0) {
          this.line("/First " + this.makeRef(node.children[0]));
          this.line(
            "/Last " + this.makeRef(node.children[node.children.length - 1])
          );
        }
        this.line(
          "/Count " +
            this.count_r(
              {
                count: 0
              },
              node
            )
        );
        this.objEnd();
      };

      pdf.outline.renderItems = function(node) {
        var getVerticalCoordinateString = this.ctx.pdf.internal
          .getVerticalCoordinateString;
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
            this.line(
              "/Last " + this.makeRef(item.children[item.children.length - 1])
            );
          }

          var count = (this.count = this.count_r(
            {
              count: 0
            },
            item
          ));
          if (count > 0) {
            this.line("/Count " + count);
          }

          if (item.options) {
            if (item.options.pageNumber) {
              // Explicit Destination
              //WARNING this assumes page ids are 3,5,7, etc.
              var info = pdf.internal.getPageInfo(item.options.pageNumber);
              this.line(
                "/Dest " +
                  "[" +
                  info.objId +
                  " 0 R /XYZ 0 " +
                  getVerticalCoordinateString(0) +
                  " 0]"
              );
              // this line does not work on all clients (pageNumber instead of page ref)
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
        for (var z = 0; z < node.children.length; z++) {
          this.renderItems(node.children[z]);
        }
      };

      pdf.outline.line = function(text) {
        this.ctx.val += text + "\r\n";
      };

      pdf.outline.makeRef = function(node) {
        return node.id + " 0 R";
      };

      pdf.outline.makeString = function(val) {
        return "(" + pdf.internal.pdfEscape(val) + ")";
      };

      pdf.outline.objStart = function(node) {
        this.ctx.val += "\r\n" + node.id + " 0 obj" + "\r\n<<\r\n";
      };

      pdf.outline.objEnd = function() {
        this.ctx.val += ">> \r\n" + "endobj" + "\r\n";
      };

      pdf.outline.count_r = function(ctx, node) {
        for (var i = 0; i < node.children.length; i++) {
          ctx.count++;
          this.count_r(ctx, node.children[i]);
        }
        return ctx.count;
      };
    }
  ]);

  return this;
})(jsPDF.API);

/**
 * @license
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * jsPDF jpeg Support PlugIn
 *
 * @name jpeg_support
 * @module
 */
(function(jsPDFAPI) {

  /**
   * 0xc0 (SOF) Huffman  - Baseline DCT
   * 0xc1 (SOF) Huffman  - Extended sequential DCT
   * 0xc2 Progressive DCT (SOF2)
   * 0xc3 Spatial (sequential) lossless (SOF3)
   * 0xc4 Differential sequential DCT (SOF5)
   * 0xc5 Differential progressive DCT (SOF6)
   * 0xc6 Differential spatial (SOF7)
   * 0xc7
   */
  var markers = [0xc0, 0xc1, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7];

  //takes a string imgData containing the raw bytes of
  //a jpeg image and returns [width, height]
  //Algorithm from: http://www.64lines.com/jpeg-width-height
  var getJpegInfo = function(imgData) {
    var width, height, numcomponents;
    var blockLength = imgData.charCodeAt(4) * 256 + imgData.charCodeAt(5);
    var len = imgData.length;
    var result = { width: 0, height: 0, numcomponents: 1 };
    for (var i = 4; i < len; i += 2) {
      i += blockLength;
      if (markers.indexOf(imgData.charCodeAt(i + 1)) !== -1) {
        height = imgData.charCodeAt(i + 5) * 256 + imgData.charCodeAt(i + 6);
        width = imgData.charCodeAt(i + 7) * 256 + imgData.charCodeAt(i + 8);
        numcomponents = imgData.charCodeAt(i + 9);
        result = { width: width, height: height, numcomponents: numcomponents };
        break;
      } else {
        blockLength =
          imgData.charCodeAt(i + 2) * 256 + imgData.charCodeAt(i + 3);
      }
    }
    return result;
  };

  /**
   * @ignore
   */
  jsPDFAPI.processJPEG = function(
    data,
    index,
    alias,
    compression,
    dataAsBinaryString,
    colorSpace
  ) {
    var filter = this.decode.DCT_DECODE,
      bpc = 8,
      dims,
      result = null;

    if (
      typeof data === "string" ||
      this.__addimage__.isArrayBuffer(data) ||
      this.__addimage__.isArrayBufferView(data)
    ) {
      // if we already have a stored binary string rep use that
      data = dataAsBinaryString || data;
      data = this.__addimage__.isArrayBuffer(data)
        ? new Uint8Array(data)
        : data;
      data = this.__addimage__.isArrayBufferView(data)
        ? this.__addimage__.arrayBufferToBinaryString(data)
        : data;

      dims = getJpegInfo(data);
      switch (dims.numcomponents) {
        case 1:
          colorSpace = this.color_spaces.DEVICE_GRAY;
          break;
        case 4:
          colorSpace = this.color_spaces.DEVICE_CMYK;
          break;
        case 3:
          colorSpace = this.color_spaces.DEVICE_RGB;
          break;
      }

      result = {
        data: data,
        width: dims.width,
        height: dims.height,
        colorSpace: colorSpace,
        bitsPerComponent: bpc,
        filter: filter,
        index: index,
        alias: alias
      };
    }
    return result;
  };
})(jsPDF.API);

// Generated by CoffeeScript 1.4.0

var PNG = (function() {
  var APNG_BLEND_OP_SOURCE,
    APNG_DISPOSE_OP_BACKGROUND,
    APNG_DISPOSE_OP_PREVIOUS,
    makeImage,
    scratchCanvas,
    scratchCtx;

  APNG_DISPOSE_OP_BACKGROUND = 1;

  APNG_DISPOSE_OP_PREVIOUS = 2;

  APNG_BLEND_OP_SOURCE = 0;

  function PNG(data) {
    var chunkSize,
      colors,
      palLen,
      delayDen,
      delayNum,
      frame,
      i,
      index,
      key,
      section,
      palShort,
      text,
      _i,
      _j,
      _ref;
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
      section = function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 4; i = ++_i) {
          _results.push(String.fromCharCode(this.data[this.pos++]));
        }
        return _results;
      }
        .call(this)
        .join("");
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
          frame.delay = (1000 * delayNum) / delayDen;
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
          for (
            i = _i = 0;
            0 <= chunkSize ? _i < chunkSize : _i > chunkSize;
            i = 0 <= chunkSize ? ++_i : --_i
          ) {
            data.push(this.data[this.pos++]);
          }
          break;
        case "tRNS":
          this.transparency = {};
          switch (this.colorType) {
            case 3:
              palLen = this.palette.length / 3;
              this.transparency.indexed = this.read(chunkSize);
              if (this.transparency.indexed.length > palLen)
                throw new Error("More transparent colors than palette size");
              /*
               * According to the PNG spec trns should be increased to the same size as palette if shorter
               */
              //palShort = 255 - this.transparency.indexed.length;
              palShort = palLen - this.transparency.indexed.length;
              if (palShort > 0) {
                for (
                  i = _j = 0;
                  0 <= palShort ? _j < palShort : _j > palShort;
                  i = 0 <= palShort ? ++_j : --_j
                ) {
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
          this.text[key] = String.fromCharCode.apply(
            String,
            text.slice(index + 1)
          );
          break;
        case "IEND":
          if (frame) {
            this.animation.frames.push(frame);
          }
          this.colors = function() {
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
          this.colorSpace = function() {
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
  }

  PNG.prototype.read = function(bytes) {
    var i, _i, _results;
    _results = [];
    for (
      i = _i = 0;
      0 <= bytes ? _i < bytes : _i > bytes;
      i = 0 <= bytes ? ++_i : --_i
    ) {
      _results.push(this.data[this.pos++]);
    }
    return _results;
  };

  PNG.prototype.readUInt32 = function() {
    var b1, b2, b3, b4;
    b1 = this.data[this.pos++] << 24;
    b2 = this.data[this.pos++] << 16;
    b3 = this.data[this.pos++] << 8;
    b4 = this.data[this.pos++];
    return b1 | b2 | b3 | b4;
  };

  PNG.prototype.readUInt16 = function() {
    var b1, b2;
    b1 = this.data[this.pos++] << 8;
    b2 = this.data[this.pos++];
    return b1 | b2;
  };

  PNG.prototype.decodePixels = function(data) {
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

    data = fflate.unzlibSync(data);
    function pass(x0, y0, dx, dy) {
      var abyte,
        c,
        col,
        i,
        left,
        length,
        p,
        pa,
        paeth,
        pb,
        pc,
        pixels,
        row,
        scanlineLength,
        upper,
        upperLeft,
        _i,
        _j,
        _k,
        _l,
        _m;
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
              col = (i - (i % pixelBytes)) / pixelBytes;
              upper =
                row &&
                pixels[
                  (row - 1) * scanlineLength +
                    col * pixelBytes +
                    (i % pixelBytes)
                ];
              pixels[c++] = (upper + abyte) % 256;
            }
            break;
          case 3:
            for (i = _l = 0; _l < scanlineLength; i = _l += 1) {
              abyte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              upper =
                row &&
                pixels[
                  (row - 1) * scanlineLength +
                    col * pixelBytes +
                    (i % pixelBytes)
                ];
              pixels[c++] = (abyte + Math.floor((left + upper) / 2)) % 256;
            }
            break;
          case 4:
            for (i = _m = 0; _m < scanlineLength; i = _m += 1) {
              abyte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              if (row === 0) {
                upper = upperLeft = 0;
              } else {
                upper =
                  pixels[
                    (row - 1) * scanlineLength +
                      col * pixelBytes +
                      (i % pixelBytes)
                  ];
                upperLeft =
                  col &&
                  pixels[
                    (row - 1) * scanlineLength +
                      (col - 1) * pixelBytes +
                      (i % pixelBytes)
                  ];
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
            for (var j = 0; j < pixelBytes; j += 1)
              fullPixels[fullPos++] = pixels[partPos++];
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

  PNG.prototype.decodePalette = function() {
    var c, i, length, palette, pos, ret, transparency, _i, _ref, _ref1;
    palette = this.palette;
    transparency = this.transparency.indexed || [];
    ret = new Uint8Array((transparency.length || 0) + palette.length);
    pos = 0;
    length = palette.length;
    c = 0;
    for (i = _i = 0, _ref = length; _i < _ref; i = _i += 3) {
      ret[pos++] = palette[i];
      ret[pos++] = palette[i + 1];
      ret[pos++] = palette[i + 2];
      ret[pos++] = (_ref1 = transparency[c++]) != null ? _ref1 : 255;
    }
    return ret;
  };

  PNG.prototype.copyToImageData = function(imageData, pixels) {
    var alpha, colors, data, i, input, j, k, length, palette, v, _ref;
    colors = this.colors;
    palette = null;
    alpha = this.hasAlphaChannel;
    if (this.palette.length) {
      palette =
        (_ref = this._decodedPalette) != null
          ? _ref
          : (this._decodedPalette = this.decodePalette());
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

  PNG.prototype.decode = function() {
    var ret;
    ret = new Uint8Array(this.width * this.height * 4);
    this.copyToImageData(ret, this.decodePixels());
    return ret;
  };

  var hasBrowserCanvas = function() {
    if (Object.prototype.toString.call(globalObject) === "[object Window]") {
      try {
        scratchCanvas = globalObject.document.createElement("canvas");
        scratchCtx = scratchCanvas.getContext("2d");
      } catch (e) {
        return false;
      }
      return true;
    }
    return false;
  };

  hasBrowserCanvas();

  makeImage = function(imageData) {
    if (hasBrowserCanvas() === true) {
      var img;
      scratchCtx.width = imageData.width;
      scratchCtx.height = imageData.height;
      scratchCtx.clearRect(0, 0, imageData.width, imageData.height);
      scratchCtx.putImageData(imageData, 0, 0);
      img = new Image();
      img.src = scratchCanvas.toDataURL();
      return img;
    }
    throw new Error("This method requires a Browser with Canvas-capability.");
  };

  PNG.prototype.decodeFrames = function(ctx) {
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
      _results.push((frame.image = makeImage(imageData)));
    }
    return _results;
  };

  PNG.prototype.renderFrame = function(ctx, number) {
    var frame, frames, prev;
    frames = this.animation.frames;
    frame = frames[number];
    prev = frames[number - 1];
    if (number === 0) {
      ctx.clearRect(0, 0, this.width, this.height);
    }
    if (
      (prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_BACKGROUND
    ) {
      ctx.clearRect(prev.xOffset, prev.yOffset, prev.width, prev.height);
    } else if (
      (prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_PREVIOUS
    ) {
      ctx.putImageData(prev.imageData, prev.xOffset, prev.yOffset);
    }
    if (frame.blendOp === APNG_BLEND_OP_SOURCE) {
      ctx.clearRect(frame.xOffset, frame.yOffset, frame.width, frame.height);
    }
    return ctx.drawImage(frame.image, frame.xOffset, frame.yOffset);
  };

  PNG.prototype.animate = function(ctx) {
    var doFrame,
      frameNumber,
      frames,
      numFrames,
      numPlays,
      _ref,
      _this = this;
    frameNumber = 0;
    (_ref = this.animation),
      (numFrames = _ref.numFrames),
      (frames = _ref.frames),
      (numPlays = _ref.numPlays);
    return (doFrame = function() {
      var f, frame;
      f = frameNumber++ % numFrames;
      frame = frames[f];
      _this.renderFrame(ctx, f);
      if (numFrames > 1 && frameNumber / numFrames < numPlays) {
        return (_this.animation._timeout = setTimeout(doFrame, frame.delay));
      }
    })();
  };

  PNG.prototype.stopAnimation = function() {
    var _ref;
    return clearTimeout(
      (_ref = this.animation) != null ? _ref._timeout : void 0
    );
  };

  PNG.prototype.render = function(canvas) {
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
})();

/**
 * @license
 *
 * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

/**
 * jsPDF PNG PlugIn
 * @name png_support
 * @module
 */
(function(jsPDFAPI) {

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

  var canCompress = function(value) {
    return value !== jsPDFAPI.image_compression.NONE && hasCompressionJS();
  };

  var hasCompressionJS = function() {
    return typeof fflate.zlibSync === "function";
  };
  var compressBytes = function(bytes, lineLength, colorsPerPixel, compression) {
    var level = 4;
    var filter_method = filterUp;

    switch (compression) {
      case jsPDFAPI.image_compression.FAST:
        level = 1;
        filter_method = filterSub;
        break;

      case jsPDFAPI.image_compression.MEDIUM:
        level = 6;
        filter_method = filterAverage;
        break;

      case jsPDFAPI.image_compression.SLOW:
        level = 9;
        filter_method = filterPaeth;
        break;
    }

    bytes = applyPngFilterMethod(
      bytes,
      lineLength,
      colorsPerPixel,
      filter_method
    );
    var dat = fflate.zlibSync(bytes, { level: level });
    return jsPDFAPI.__addimage__.arrayBufferToBinaryString(dat);
  };

  var applyPngFilterMethod = function(
    bytes,
    lineLength,
    colorsPerPixel,
    filter_method
  ) {
    var lines = bytes.length / lineLength,
      result = new Uint8Array(bytes.length + lines),
      filter_methods = getFilterMethods(),
      line,
      prevLine,
      offset;

    for (var i = 0; i < lines; i += 1) {
      offset = i * lineLength;
      line = bytes.subarray(offset, offset + lineLength);

      if (filter_method) {
        result.set(filter_method(line, colorsPerPixel, prevLine), offset + i);
      } else {
        var len = filter_methods.length,
          results = [];

        for (var j; j < len; j += 1) {
          results[j] = filter_methods[j](line, colorsPerPixel, prevLine);
        }

        var ind = getIndexOfSmallestSum(results.concat());

        result.set(results[ind], offset + i);
      }

      prevLine = line;
    }

    return result;
  };

  var filterNone = function(line) {
    /*var result = new Uint8Array(line.length + 1);
    result[0] = 0;
    result.set(line, 1);*/

    var result = Array.apply([], line);
    result.unshift(0);

    return result;
  };

  var filterSub = function(line, colorsPerPixel) {
    var result = [],
      len = line.length,
      left;

    result[0] = 1;

    for (var i = 0; i < len; i += 1) {
      left = line[i - colorsPerPixel] || 0;
      result[i + 1] = (line[i] - left + 0x0100) & 0xff;
    }

    return result;
  };

  var filterUp = function(line, colorsPerPixel, prevLine) {
    var result = [],
      len = line.length,
      up;

    result[0] = 2;

    for (var i = 0; i < len; i += 1) {
      up = (prevLine && prevLine[i]) || 0;
      result[i + 1] = (line[i] - up + 0x0100) & 0xff;
    }

    return result;
  };

  var filterAverage = function(line, colorsPerPixel, prevLine) {
    var result = [],
      len = line.length,
      left,
      up;

    result[0] = 3;

    for (var i = 0; i < len; i += 1) {
      left = line[i - colorsPerPixel] || 0;
      up = (prevLine && prevLine[i]) || 0;
      result[i + 1] = (line[i] + 0x0100 - ((left + up) >>> 1)) & 0xff;
    }

    return result;
  };

  var filterPaeth = function(line, colorsPerPixel, prevLine) {
    var result = [],
      len = line.length,
      left,
      up,
      upLeft,
      paeth;

    result[0] = 4;

    for (var i = 0; i < len; i += 1) {
      left = line[i - colorsPerPixel] || 0;
      up = (prevLine && prevLine[i]) || 0;
      upLeft = (prevLine && prevLine[i - colorsPerPixel]) || 0;
      paeth = paethPredictor(left, up, upLeft);
      result[i + 1] = (line[i] - paeth + 0x0100) & 0xff;
    }

    return result;
  };

  var paethPredictor = function(left, up, upLeft) {
    if (left === up && up === upLeft) {
      return left;
    }
    var pLeft = Math.abs(up - upLeft),
      pUp = Math.abs(left - upLeft),
      pUpLeft = Math.abs(left + up - upLeft - upLeft);
    return pLeft <= pUp && pLeft <= pUpLeft
      ? left
      : pUp <= pUpLeft
      ? up
      : upLeft;
  };

  var getFilterMethods = function() {
    return [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
  };

  var getIndexOfSmallestSum = function(arrays) {
    var sum = arrays.map(function(value) {
      return value.reduce(function(pv, cv) {
        return pv + Math.abs(cv);
      }, 0);
    });
    return sum.indexOf(Math.min.apply(null, sum));
  };

  var getPredictorFromCompression = function(compression) {
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
   * @name processPNG
   * @function
   * @ignore
   */
  jsPDFAPI.processPNG = function(imageData, index, alias, compression) {

    var colorSpace,
      filter = this.decode.FLATE_DECODE,
      bitsPerComponent,
      image,
      decodeParameters = "",
      trns,
      colors,
      pal,
      smask,
      pixels,
      len,
      alphaData,
      imgData,
      hasColors,
      pixel,
      i,
      n;

    if (this.__addimage__.isArrayBuffer(imageData))
      imageData = new Uint8Array(imageData);

    if (this.__addimage__.isArrayBufferView(imageData)) {
      image = new PNG(imageData);
      imageData = image.imgData;
      bitsPerComponent = image.bits;
      colorSpace = image.colorSpace;
      colors = image.colors;

      /*
       * colorType 6 - Each pixel is an R,G,B triple, followed by an alpha sample.
       *
       * colorType 4 - Each pixel is a grayscale sample, followed by an alpha sample.
       *
       * Extract alpha to create two separate images, using the alpha as a sMask
       */
      if ([4, 6].indexOf(image.colorType) !== -1) {
        /*
         * processes 8 bit RGBA and grayscale + alpha images
         */
        if (image.bits === 8) {
          pixels =
            image.pixelBitlength == 32
              ? new Uint32Array(image.decodePixels().buffer)
              : image.pixelBitlength == 16
              ? new Uint16Array(image.decodePixels().buffer)
              : new Uint8Array(image.decodePixels().buffer);
          len = pixels.length;
          imgData = new Uint8Array(len * image.colors);
          alphaData = new Uint8Array(len);
          var pDiff = image.pixelBitlength - image.bits;
          i = 0;
          n = 0;
          var pbl;

          for (; i < len; i++) {
            pixel = pixels[i];
            pbl = 0;

            while (pbl < pDiff) {
              imgData[n++] = (pixel >>> pbl) & 0xff;
              pbl = pbl + image.bits;
            }

            alphaData[i] = (pixel >>> pbl) & 0xff;
          }
        }

        /*
         * processes 16 bit RGBA and grayscale + alpha images
         */
        if (image.bits === 16) {
          pixels = new Uint32Array(image.decodePixels().buffer);
          len = pixels.length;
          imgData = new Uint8Array(
            len * (32 / image.pixelBitlength) * image.colors
          );
          alphaData = new Uint8Array(len * (32 / image.pixelBitlength));
          hasColors = image.colors > 1;
          i = 0;
          n = 0;
          var a = 0;

          while (i < len) {
            pixel = pixels[i++];

            imgData[n++] = (pixel >>> 0) & 0xff;

            if (hasColors) {
              imgData[n++] = (pixel >>> 16) & 0xff;

              pixel = pixels[i++];
              imgData[n++] = (pixel >>> 0) & 0xff;
            }

            alphaData[a++] = (pixel >>> 16) & 0xff;
          }
          bitsPerComponent = 8;
        }

        if (canCompress(compression)) {
          imageData = compressBytes(
            imgData,
            image.width * image.colors,
            image.colors,
            compression
          );
          smask = compressBytes(alphaData, image.width, 1, compression);
        } else {
          imageData = imgData;
          smask = alphaData;
          filter = undefined;
        }
      }

      /*
       * Indexed png. Each pixel is a palette index.
       */
      if (image.colorType === 3) {
        colorSpace = this.color_spaces.INDEXED;
        pal = image.palette;

        if (image.transparency.indexed) {
          var trans = image.transparency.indexed;
          var total = 0;
          i = 0;
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
            pixels = image.decodePixels();
            alphaData = new Uint8Array(pixels.length);
            i = 0;
            len = pixels.length;

            for (; i < len; i++) {
              alphaData[i] = trans[pixels[i]];
            }

            smask = compressBytes(alphaData, image.width, 1);
          }
        }
      }

      var predictor = getPredictorFromCompression(compression);

      if (filter === this.decode.FLATE_DECODE) {
        decodeParameters = "/Predictor " + predictor + " ";
      }
      decodeParameters +=
        "/Colors " +
        colors +
        " /BitsPerComponent " +
        bitsPerComponent +
        " /Columns " +
        image.width;

      if (
        this.__addimage__.isArrayBuffer(imageData) ||
        this.__addimage__.isArrayBufferView(imageData)
      ) {
        imageData = this.__addimage__.arrayBufferToBinaryString(imageData);
      }

      if (
        (smask && this.__addimage__.isArrayBuffer(smask)) ||
        this.__addimage__.isArrayBufferView(smask)
      ) {
        smask = this.__addimage__.arrayBufferToBinaryString(smask);
      }

      return {
        alias: alias,
        data: imageData,
        index: index,
        filter: filter,
        decodeParameters: decodeParameters,
        transparency: trns,
        palette: pal,
        sMask: smask,
        predictor: predictor,
        width: image.width,
        height: image.height,
        bitsPerComponent: bitsPerComponent,
        colorSpace: colorSpace
      };
    }
  };
})(jsPDF.API);

/**
 * @license
 * (c) Dean McNamee <dean@gmail.com>, 2013.
 *
 * https://github.com/deanm/omggif
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * omggif is a JavaScript implementation of a GIF 89a encoder and decoder,
 * including animation and compression.  It does not rely on any specific
 * underlying system, so should run in the browser, Node, or Plask.
 */

function GifReader(buf) {
  var p = 0;

  // - Header (GIF87a or GIF89a).
  if (
    buf[p++] !== 0x47 ||
    buf[p++] !== 0x49 ||
    buf[p++] !== 0x46 ||
    buf[p++] !== 0x38 ||
    ((buf[p++] + 1) & 0xfd) !== 0x38 ||
    buf[p++] !== 0x61
  ) {
    throw new Error("Invalid GIF 87a/89a header.");
  }

  // - Logical Screen Descriptor.
  var width = buf[p++] | (buf[p++] << 8);
  var height = buf[p++] | (buf[p++] << 8);
  var pf0 = buf[p++]; // <Packed Fields>.
  var global_palette_flag = pf0 >> 7;
  var num_global_colors_pow2 = pf0 & 0x7;
  var num_global_colors = 1 << (num_global_colors_pow2 + 1);
  var background = buf[p++];
  buf[p++]; // Pixel aspect ratio (unused?).

  var global_palette_offset = null;
  var global_palette_size = null;

  if (global_palette_flag) {
    global_palette_offset = p;
    global_palette_size = num_global_colors;
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
      case 0x21: // Graphics Control Extension Block
        switch (buf[p++]) {
          case 0xff: // Application specific block
            // Try if it's a Netscape block (with animation loop counter).
            if (
              buf[p] !== 0x0b || // 21 FF already read, check block size.
              // NETSCAPE2.0
              (buf[p + 1] == 0x4e &&
                buf[p + 2] == 0x45 &&
                buf[p + 3] == 0x54 &&
                buf[p + 4] == 0x53 &&
                buf[p + 5] == 0x43 &&
                buf[p + 6] == 0x41 &&
                buf[p + 7] == 0x50 &&
                buf[p + 8] == 0x45 &&
                buf[p + 9] == 0x32 &&
                buf[p + 10] == 0x2e &&
                buf[p + 11] == 0x30 &&
                // Sub-block
                buf[p + 12] == 0x03 &&
                buf[p + 13] == 0x01 &&
                buf[p + 16] == 0)
            ) {
              p += 14;
              loop_count = buf[p++] | (buf[p++] << 8);
              p++; // Skip terminator.
            } else {
              // We don't know what it is, just try to get past it.
              p += 12;
              while (true) {
                // Seek through subblocks.
                var block_size = buf[p++];
                // Bad block size (ex: undefined from an out of bounds read).
                if (!(block_size >= 0)) throw Error("Invalid block size");
                if (block_size === 0) break; // 0 size is terminator
                p += block_size;
              }
            }
            break;

          case 0xf9: // Graphics Control Extension
            if (buf[p++] !== 0x4 || buf[p + 4] !== 0)
              throw new Error("Invalid graphics extension block.");
            var pf1 = buf[p++];
            delay = buf[p++] | (buf[p++] << 8);
            transparent_index = buf[p++];
            if ((pf1 & 1) === 0) transparent_index = null;
            disposal = (pf1 >> 2) & 0x7;
            p++; // Skip terminator.
            break;

          case 0xfe: // Comment Extension.
            while (true) {
              // Seek through subblocks.
              var block_size = buf[p++];
              // Bad block size (ex: undefined from an out of bounds read).
              if (!(block_size >= 0)) throw Error("Invalid block size");
              if (block_size === 0) break; // 0 size is terminator
              // console.log(buf.slice(p, p+block_size).toString('ascii'));
              p += block_size;
            }
            break;

          default:
            throw new Error(
              "Unknown graphic control label: 0x" + buf[p - 1].toString(16)
            );
        }
        break;

      case 0x2c: // Image Descriptor.
        var x = buf[p++] | (buf[p++] << 8);
        var y = buf[p++] | (buf[p++] << 8);
        var w = buf[p++] | (buf[p++] << 8);
        var h = buf[p++] | (buf[p++] << 8);
        var pf2 = buf[p++];
        var local_palette_flag = pf2 >> 7;
        var interlace_flag = (pf2 >> 6) & 1;
        var num_local_colors_pow2 = pf2 & 0x7;
        var num_local_colors = 1 << (num_local_colors_pow2 + 1);
        var palette_offset = global_palette_offset;
        var palette_size = global_palette_size;
        var has_local_palette = false;
        if (local_palette_flag) {
          var has_local_palette = true;
          palette_offset = p; // Override with local palette.
          palette_size = num_local_colors;
          p += num_local_colors * 3; // Seek past palette.
        }

        var data_offset = p;

        p++; // codesize
        while (true) {
          var block_size = buf[p++];
          // Bad block size (ex: undefined from an out of bounds read).
          if (!(block_size >= 0)) throw Error("Invalid block size");
          if (block_size === 0) break; // 0 size is terminator
          p += block_size;
        }

        frames.push({
          x: x,
          y: y,
          width: w,
          height: h,
          has_local_palette: has_local_palette,
          palette_offset: palette_offset,
          palette_size: palette_size,
          data_offset: data_offset,
          data_length: p - data_offset,
          transparent_index: transparent_index,
          interlaced: !!interlace_flag,
          delay: delay,
          disposal: disposal
        });
        break;

      case 0x3b: // Trailer Marker (end of file).
        no_eof = false;
        break;

      default:
        throw new Error("Unknown gif block: 0x" + buf[p - 1].toString(16));
    }
  }

  this.numFrames = function() {
    return frames.length;
  };

  this.loopCount = function() {
    return loop_count;
  };

  this.frameInfo = function(frame_num) {
    if (frame_num < 0 || frame_num >= frames.length)
      throw new Error("Frame index out of range.");
    return frames[frame_num];
  };

  this.decodeAndBlitFrameBGRA = function(frame_num, pixels) {
    var frame = this.frameInfo(frame_num);
    var num_pixels = frame.width * frame.height;
    var index_stream = new Uint8Array(num_pixels); // At most 8-bit indices.
    GifReaderLZWOutputIndexStream(
      buf,
      frame.data_offset,
      index_stream,
      num_pixels
    );
    var palette_offset = frame.palette_offset;

    // NOTE(deanm): It seems to be much faster to compare index to 256 than
    // to === null.  Not sure why, but CompareStub_EQ_STRICT shows up high in
    // the profile, not sure if it's related to using a Uint8Array.
    var trans = frame.transparent_index;
    if (trans === null) trans = 256;

    // We are possibly just blitting to a portion of the entire frame.
    // That is a subrect within the framerect, so the additional pixels
    // must be skipped over after we finished a scanline.
    var framewidth = frame.width;
    var framestride = width - framewidth;
    var xleft = framewidth; // Number of subrect pixels left in scanline.

    // Output indices of the top left and bottom right corners of the subrect.
    var opbeg = (frame.y * width + frame.x) * 4;
    var opend = ((frame.y + frame.height) * width + frame.x) * 4;
    var op = opbeg;

    var scanstride = framestride * 4;

    // Use scanstride to skip past the rows when interlacing.  This is skipping
    // 7 rows for the first two passes, then 3 then 1.
    if (frame.interlaced === true) {
      scanstride += width * 4 * 7; // Pass 1.
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
          scanstride = framestride * 4 + width * 4 * (interlaceskip - 1);
          // interlaceskip / 2 * 4 is interlaceskip << 1.
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
  };

  // I will go to copy and paste hell one day...
  this.decodeAndBlitFrameRGBA = function(frame_num, pixels) {
    var frame = this.frameInfo(frame_num);
    var num_pixels = frame.width * frame.height;
    var index_stream = new Uint8Array(num_pixels); // At most 8-bit indices.
    GifReaderLZWOutputIndexStream(
      buf,
      frame.data_offset,
      index_stream,
      num_pixels
    );
    var palette_offset = frame.palette_offset;

    // NOTE(deanm): It seems to be much faster to compare index to 256 than
    // to === null.  Not sure why, but CompareStub_EQ_STRICT shows up high in
    // the profile, not sure if it's related to using a Uint8Array.
    var trans = frame.transparent_index;
    if (trans === null) trans = 256;

    // We are possibly just blitting to a portion of the entire frame.
    // That is a subrect within the framerect, so the additional pixels
    // must be skipped over after we finished a scanline.
    var framewidth = frame.width;
    var framestride = width - framewidth;
    var xleft = framewidth; // Number of subrect pixels left in scanline.

    // Output indices of the top left and bottom right corners of the subrect.
    var opbeg = (frame.y * width + frame.x) * 4;
    var opend = ((frame.y + frame.height) * width + frame.x) * 4;
    var op = opbeg;

    var scanstride = framestride * 4;

    // Use scanstride to skip past the rows when interlacing.  This is skipping
    // 7 rows for the first two passes, then 3 then 1.
    if (frame.interlaced === true) {
      scanstride += width * 4 * 7; // Pass 1.
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
          scanstride = framestride * 4 + width * 4 * (interlaceskip - 1);
          // interlaceskip / 2 * 4 is interlaceskip << 1.
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

  var subblock_size = code_stream[p++];

  // TODO(deanm): Would using a TypedArray be any faster?  At least it would
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
    }

    // TODO(deanm): We should never really get here, we should have received
    // and EOI.
    if (cur_shift < cur_code_size) break;

    var code = cur & code_mask;
    cur >>= cur_code_size;
    cur_shift -= cur_code_size;

    // TODO(deanm): Maybe should check that the first code was a clear code,
    // at least this is what you're supposed to do.  But actually our encoder
    // now doesn't emit a clear code first anyway.
    if (code === clear_code) {
      // We don't actually have to clear the table.  This could be a good idea
      // for greater error checking, but we don't really do any anyway.  We
      // will just track it with next_code and overwrite old entries.

      next_code = eoi_code + 1;
      cur_code_size = min_code_size + 1;
      code_mask = (1 << cur_code_size) - 1;

      // Don't update prev_code ?
      prev_code = null;
      continue;
    } else if (code === eoi_code) {
      break;
    }

    // We have a similar situation as the decoder, where we want to store
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

    var chase_code = code < next_code ? code : prev_code;

    // Chase what we will output, either {CODE} or {CODE-1}.
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
    }

    // Already have the first byte from the chase, might as well write it fast.
    output[op++] = k;

    op += chase_length;
    var b = op; // Track pointer, writing backwards.

    if (chase_code !== code)
      // The case of emitting {CODE-1} + k.
      output[op++] = k;

    chase = chase_code;
    while (chase_length--) {
      chase = code_table[chase];
      output[--b] = chase & 0xff; // Write backwards.
      chase >>= 8; // Pull down to the prefix code.
    }

    if (prev_code !== null && next_code < 4096) {
      code_table[next_code++] = (prev_code << 8) | k;
      // TODO(deanm): Figure out this clearing vs code growth logic better.  I
      // have an feeling that it should just happen somewhere else, for now it
      // is awkward between when we grow past the max and then hit a clear code.
      // For now just check if we hit the max 12-bits (then a clear code should
      // follow, also of course encoded in 12-bits).
      if (next_code >= code_mask + 1 && cur_code_size < 12) {
        ++cur_code_size;
        code_mask = (code_mask << 1) | 1;
      }
    }

    prev_code = code;
  }

  if (op !== output_length) {
    console.log("Warning, gif stream shorter than expected.");
  }

  return output;
}

/**
 * @license
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
/*
JPEG encoder ported to JavaScript and optimized by Andreas Ritter, www.bytestrom.eu, 11/2009

Basic GUI blocking jpeg encoder
*/

function JPEGEncoder(quality) {
  var ffloor = Math.floor;
  var YTable = new Array(64);
  var UVTable = new Array(64);
  var fdtbl_Y = new Array(64);
  var fdtbl_UV = new Array(64);
  var YDC_HT;
  var UVDC_HT;
  var YAC_HT;
  var UVAC_HT;

  var bitcode = new Array(65535);
  var category = new Array(65535);
  var outputfDCTQuant = new Array(64);
  var DU = new Array(64);
  var byteout = [];
  var bytenew = 0;
  var bytepos = 7;

  var YDU = new Array(64);
  var UDU = new Array(64);
  var VDU = new Array(64);
  var clt = new Array(256);
  var RGB_YUV_TABLE = new Array(2048);
  var currentQuality;

  var ZigZag = [
    0,
    1,
    5,
    6,
    14,
    15,
    27,
    28,
    2,
    4,
    7,
    13,
    16,
    26,
    29,
    42,
    3,
    8,
    12,
    17,
    25,
    30,
    41,
    43,
    9,
    11,
    18,
    24,
    31,
    40,
    44,
    53,
    10,
    19,
    23,
    32,
    39,
    45,
    52,
    54,
    20,
    22,
    33,
    38,
    46,
    51,
    55,
    60,
    21,
    34,
    37,
    47,
    50,
    56,
    59,
    61,
    35,
    36,
    48,
    49,
    57,
    58,
    62,
    63
  ];

  var std_dc_luminance_nrcodes = [
    0,
    0,
    1,
    5,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ];
  var std_dc_luminance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  var std_ac_luminance_nrcodes = [
    0,
    0,
    2,
    1,
    3,
    3,
    2,
    4,
    3,
    5,
    5,
    4,
    4,
    0,
    0,
    1,
    0x7d
  ];
  var std_ac_luminance_values = [
    0x01,
    0x02,
    0x03,
    0x00,
    0x04,
    0x11,
    0x05,
    0x12,
    0x21,
    0x31,
    0x41,
    0x06,
    0x13,
    0x51,
    0x61,
    0x07,
    0x22,
    0x71,
    0x14,
    0x32,
    0x81,
    0x91,
    0xa1,
    0x08,
    0x23,
    0x42,
    0xb1,
    0xc1,
    0x15,
    0x52,
    0xd1,
    0xf0,
    0x24,
    0x33,
    0x62,
    0x72,
    0x82,
    0x09,
    0x0a,
    0x16,
    0x17,
    0x18,
    0x19,
    0x1a,
    0x25,
    0x26,
    0x27,
    0x28,
    0x29,
    0x2a,
    0x34,
    0x35,
    0x36,
    0x37,
    0x38,
    0x39,
    0x3a,
    0x43,
    0x44,
    0x45,
    0x46,
    0x47,
    0x48,
    0x49,
    0x4a,
    0x53,
    0x54,
    0x55,
    0x56,
    0x57,
    0x58,
    0x59,
    0x5a,
    0x63,
    0x64,
    0x65,
    0x66,
    0x67,
    0x68,
    0x69,
    0x6a,
    0x73,
    0x74,
    0x75,
    0x76,
    0x77,
    0x78,
    0x79,
    0x7a,
    0x83,
    0x84,
    0x85,
    0x86,
    0x87,
    0x88,
    0x89,
    0x8a,
    0x92,
    0x93,
    0x94,
    0x95,
    0x96,
    0x97,
    0x98,
    0x99,
    0x9a,
    0xa2,
    0xa3,
    0xa4,
    0xa5,
    0xa6,
    0xa7,
    0xa8,
    0xa9,
    0xaa,
    0xb2,
    0xb3,
    0xb4,
    0xb5,
    0xb6,
    0xb7,
    0xb8,
    0xb9,
    0xba,
    0xc2,
    0xc3,
    0xc4,
    0xc5,
    0xc6,
    0xc7,
    0xc8,
    0xc9,
    0xca,
    0xd2,
    0xd3,
    0xd4,
    0xd5,
    0xd6,
    0xd7,
    0xd8,
    0xd9,
    0xda,
    0xe1,
    0xe2,
    0xe3,
    0xe4,
    0xe5,
    0xe6,
    0xe7,
    0xe8,
    0xe9,
    0xea,
    0xf1,
    0xf2,
    0xf3,
    0xf4,
    0xf5,
    0xf6,
    0xf7,
    0xf8,
    0xf9,
    0xfa
  ];

  var std_dc_chrominance_nrcodes = [
    0,
    0,
    3,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0
  ];
  var std_dc_chrominance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  var std_ac_chrominance_nrcodes = [
    0,
    0,
    2,
    1,
    2,
    4,
    4,
    3,
    4,
    7,
    5,
    4,
    4,
    0,
    1,
    2,
    0x77
  ];
  var std_ac_chrominance_values = [
    0x00,
    0x01,
    0x02,
    0x03,
    0x11,
    0x04,
    0x05,
    0x21,
    0x31,
    0x06,
    0x12,
    0x41,
    0x51,
    0x07,
    0x61,
    0x71,
    0x13,
    0x22,
    0x32,
    0x81,
    0x08,
    0x14,
    0x42,
    0x91,
    0xa1,
    0xb1,
    0xc1,
    0x09,
    0x23,
    0x33,
    0x52,
    0xf0,
    0x15,
    0x62,
    0x72,
    0xd1,
    0x0a,
    0x16,
    0x24,
    0x34,
    0xe1,
    0x25,
    0xf1,
    0x17,
    0x18,
    0x19,
    0x1a,
    0x26,
    0x27,
    0x28,
    0x29,
    0x2a,
    0x35,
    0x36,
    0x37,
    0x38,
    0x39,
    0x3a,
    0x43,
    0x44,
    0x45,
    0x46,
    0x47,
    0x48,
    0x49,
    0x4a,
    0x53,
    0x54,
    0x55,
    0x56,
    0x57,
    0x58,
    0x59,
    0x5a,
    0x63,
    0x64,
    0x65,
    0x66,
    0x67,
    0x68,
    0x69,
    0x6a,
    0x73,
    0x74,
    0x75,
    0x76,
    0x77,
    0x78,
    0x79,
    0x7a,
    0x82,
    0x83,
    0x84,
    0x85,
    0x86,
    0x87,
    0x88,
    0x89,
    0x8a,
    0x92,
    0x93,
    0x94,
    0x95,
    0x96,
    0x97,
    0x98,
    0x99,
    0x9a,
    0xa2,
    0xa3,
    0xa4,
    0xa5,
    0xa6,
    0xa7,
    0xa8,
    0xa9,
    0xaa,
    0xb2,
    0xb3,
    0xb4,
    0xb5,
    0xb6,
    0xb7,
    0xb8,
    0xb9,
    0xba,
    0xc2,
    0xc3,
    0xc4,
    0xc5,
    0xc6,
    0xc7,
    0xc8,
    0xc9,
    0xca,
    0xd2,
    0xd3,
    0xd4,
    0xd5,
    0xd6,
    0xd7,
    0xd8,
    0xd9,
    0xda,
    0xe2,
    0xe3,
    0xe4,
    0xe5,
    0xe6,
    0xe7,
    0xe8,
    0xe9,
    0xea,
    0xf2,
    0xf3,
    0xf4,
    0xf5,
    0xf6,
    0xf7,
    0xf8,
    0xf9,
    0xfa
  ];

  function initQuantTables(sf) {
    var YQT = [
      16,
      11,
      10,
      16,
      24,
      40,
      51,
      61,
      12,
      12,
      14,
      19,
      26,
      58,
      60,
      55,
      14,
      13,
      16,
      24,
      40,
      57,
      69,
      56,
      14,
      17,
      22,
      29,
      51,
      87,
      80,
      62,
      18,
      22,
      37,
      56,
      68,
      109,
      103,
      77,
      24,
      35,
      55,
      64,
      81,
      104,
      113,
      92,
      49,
      64,
      78,
      87,
      103,
      121,
      120,
      101,
      72,
      92,
      95,
      98,
      112,
      100,
      103,
      99
    ];

    for (var i = 0; i < 64; i++) {
      var t = ffloor((YQT[i] * sf + 50) / 100);
      t = Math.min(Math.max(t, 1), 255);
      YTable[ZigZag[i]] = t;
    }
    var UVQT = [
      17,
      18,
      24,
      47,
      99,
      99,
      99,
      99,
      18,
      21,
      26,
      66,
      99,
      99,
      99,
      99,
      24,
      26,
      56,
      99,
      99,
      99,
      99,
      99,
      47,
      66,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99,
      99
    ];
    for (var j = 0; j < 64; j++) {
      var u = ffloor((UVQT[j] * sf + 50) / 100);
      u = Math.min(Math.max(u, 1), 255);
      UVTable[ZigZag[j]] = u;
    }
    var aasf = [
      1.0,
      1.387039845,
      1.306562965,
      1.175875602,
      1.0,
      0.785694958,
      0.5411961,
      0.275899379
    ];
    var k = 0;
    for (var row = 0; row < 8; row++) {
      for (var col = 0; col < 8; col++) {
        fdtbl_Y[k] = 1.0 / (YTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0);
        fdtbl_UV[k] = 1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0);
        k++;
      }
    }
  }

  function computeHuffmanTbl(nrcodes, std_table) {
    var codevalue = 0;
    var pos_in_table = 0;
    var HT = new Array();
    for (var k = 1; k <= 16; k++) {
      for (var j = 1; j <= nrcodes[k]; j++) {
        HT[std_table[pos_in_table]] = [];
        HT[std_table[pos_in_table]][0] = codevalue;
        HT[std_table[pos_in_table]][1] = k;
        pos_in_table++;
        codevalue++;
      }
      codevalue *= 2;
    }
    return HT;
  }

  function initHuffmanTbl() {
    YDC_HT = computeHuffmanTbl(
      std_dc_luminance_nrcodes,
      std_dc_luminance_values
    );
    UVDC_HT = computeHuffmanTbl(
      std_dc_chrominance_nrcodes,
      std_dc_chrominance_values
    );
    YAC_HT = computeHuffmanTbl(
      std_ac_luminance_nrcodes,
      std_ac_luminance_values
    );
    UVAC_HT = computeHuffmanTbl(
      std_ac_chrominance_nrcodes,
      std_ac_chrominance_values
    );
  }

  function initCategoryNumber() {
    var nrlower = 1;
    var nrupper = 2;
    for (var cat = 1; cat <= 15; cat++) {
      //Positive numbers
      for (var nr = nrlower; nr < nrupper; nr++) {
        category[32767 + nr] = cat;
        bitcode[32767 + nr] = [];
        bitcode[32767 + nr][1] = cat;
        bitcode[32767 + nr][0] = nr;
      }
      //Negative numbers
      for (var nrneg = -(nrupper - 1); nrneg <= -nrlower; nrneg++) {
        category[32767 + nrneg] = cat;
        bitcode[32767 + nrneg] = [];
        bitcode[32767 + nrneg][1] = cat;
        bitcode[32767 + nrneg][0] = nrupper - 1 + nrneg;
      }
      nrlower <<= 1;
      nrupper <<= 1;
    }
  }

  function initRGBYUVTable() {
    for (var i = 0; i < 256; i++) {
      RGB_YUV_TABLE[i] = 19595 * i;
      RGB_YUV_TABLE[(i + 256) >> 0] = 38470 * i;
      RGB_YUV_TABLE[(i + 512) >> 0] = 7471 * i + 0x8000;
      RGB_YUV_TABLE[(i + 768) >> 0] = -11059 * i;
      RGB_YUV_TABLE[(i + 1024) >> 0] = -21709 * i;
      RGB_YUV_TABLE[(i + 1280) >> 0] = 32768 * i + 0x807fff;
      RGB_YUV_TABLE[(i + 1536) >> 0] = -27439 * i;
      RGB_YUV_TABLE[(i + 1792) >> 0] = -5329 * i;
    }
  }

  // IO functions
  function writeBits(bs) {
    var value = bs[0];
    var posval = bs[1] - 1;
    while (posval >= 0) {
      if (value & (1 << posval)) {
        bytenew |= 1 << bytepos;
      }
      posval--;
      bytepos--;
      if (bytepos < 0) {
        if (bytenew == 0xff) {
          writeByte(0xff);
          writeByte(0);
        } else {
          writeByte(bytenew);
        }
        bytepos = 7;
        bytenew = 0;
      }
    }
  }

  function writeByte(value) {
    //byteout.push(clt[value]); // write char directly instead of converting later
    byteout.push(value);
  }

  function writeWord(value) {
    writeByte((value >> 8) & 0xff);
    writeByte(value & 0xff);
  }

  // DCT & quantization core
  function fDCTQuant(data, fdtbl) {
    var d0, d1, d2, d3, d4, d5, d6, d7;
    /* Pass 1: process rows. */
    var dataOff = 0;
    var i;
    var I8 = 8;
    var I64 = 64;
    for (i = 0; i < I8; ++i) {
      d0 = data[dataOff];
      d1 = data[dataOff + 1];
      d2 = data[dataOff + 2];
      d3 = data[dataOff + 3];
      d4 = data[dataOff + 4];
      d5 = data[dataOff + 5];
      d6 = data[dataOff + 6];
      d7 = data[dataOff + 7];

      var tmp0 = d0 + d7;
      var tmp7 = d0 - d7;
      var tmp1 = d1 + d6;
      var tmp6 = d1 - d6;
      var tmp2 = d2 + d5;
      var tmp5 = d2 - d5;
      var tmp3 = d3 + d4;
      var tmp4 = d3 - d4;

      /* Even part */
      var tmp10 = tmp0 + tmp3; /* phase 2 */
      var tmp13 = tmp0 - tmp3;
      var tmp11 = tmp1 + tmp2;
      var tmp12 = tmp1 - tmp2;

      data[dataOff] = tmp10 + tmp11; /* phase 3 */
      data[dataOff + 4] = tmp10 - tmp11;

      var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
      data[dataOff + 2] = tmp13 + z1; /* phase 5 */
      data[dataOff + 6] = tmp13 - z1;

      /* Odd part */
      tmp10 = tmp4 + tmp5; /* phase 2 */
      tmp11 = tmp5 + tmp6;
      tmp12 = tmp6 + tmp7;

      /* The rotator is modified from fig 4-8 to avoid extra negations. */
      var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
      var z2 = 0.5411961 * tmp10 + z5; /* c2-c6 */
      var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
      var z3 = tmp11 * 0.707106781; /* c4 */

      var z11 = tmp7 + z3; /* phase 5 */
      var z13 = tmp7 - z3;

      data[dataOff + 5] = z13 + z2; /* phase 6 */
      data[dataOff + 3] = z13 - z2;
      data[dataOff + 1] = z11 + z4;
      data[dataOff + 7] = z11 - z4;

      dataOff += 8; /* advance pointer to next row */
    }

    /* Pass 2: process columns. */
    dataOff = 0;
    for (i = 0; i < I8; ++i) {
      d0 = data[dataOff];
      d1 = data[dataOff + 8];
      d2 = data[dataOff + 16];
      d3 = data[dataOff + 24];
      d4 = data[dataOff + 32];
      d5 = data[dataOff + 40];
      d6 = data[dataOff + 48];
      d7 = data[dataOff + 56];

      var tmp0p2 = d0 + d7;
      var tmp7p2 = d0 - d7;
      var tmp1p2 = d1 + d6;
      var tmp6p2 = d1 - d6;
      var tmp2p2 = d2 + d5;
      var tmp5p2 = d2 - d5;
      var tmp3p2 = d3 + d4;
      var tmp4p2 = d3 - d4;

      /* Even part */
      var tmp10p2 = tmp0p2 + tmp3p2; /* phase 2 */
      var tmp13p2 = tmp0p2 - tmp3p2;
      var tmp11p2 = tmp1p2 + tmp2p2;
      var tmp12p2 = tmp1p2 - tmp2p2;

      data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
      data[dataOff + 32] = tmp10p2 - tmp11p2;

      var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
      data[dataOff + 16] = tmp13p2 + z1p2; /* phase 5 */
      data[dataOff + 48] = tmp13p2 - z1p2;

      /* Odd part */
      tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
      tmp11p2 = tmp5p2 + tmp6p2;
      tmp12p2 = tmp6p2 + tmp7p2;

      /* The rotator is modified from fig 4-8 to avoid extra negations. */
      var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
      var z2p2 = 0.5411961 * tmp10p2 + z5p2; /* c2-c6 */
      var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
      var z3p2 = tmp11p2 * 0.707106781; /* c4 */

      var z11p2 = tmp7p2 + z3p2; /* phase 5 */
      var z13p2 = tmp7p2 - z3p2;

      data[dataOff + 40] = z13p2 + z2p2; /* phase 6 */
      data[dataOff + 24] = z13p2 - z2p2;
      data[dataOff + 8] = z11p2 + z4p2;
      data[dataOff + 56] = z11p2 - z4p2;

      dataOff++; /* advance pointer to next column */
    }

    // Quantize/descale the coefficients
    var fDCTQuant;
    for (i = 0; i < I64; ++i) {
      // Apply the quantization and scaling factor & Round to nearest integer
      fDCTQuant = data[i] * fdtbl[i];
      outputfDCTQuant[i] =
        fDCTQuant > 0.0 ? (fDCTQuant + 0.5) | 0 : (fDCTQuant - 0.5) | 0;
      //outputfDCTQuant[i] = fround(fDCTQuant);
    }
    return outputfDCTQuant;
  }

  function writeAPP0() {
    writeWord(0xffe0); // marker
    writeWord(16); // length
    writeByte(0x4a); // J
    writeByte(0x46); // F
    writeByte(0x49); // I
    writeByte(0x46); // F
    writeByte(0); // = "JFIF",'\0'
    writeByte(1); // versionhi
    writeByte(1); // versionlo
    writeByte(0); // xyunits
    writeWord(1); // xdensity
    writeWord(1); // ydensity
    writeByte(0); // thumbnwidth
    writeByte(0); // thumbnheight
  }

  function writeSOF0(width, height) {
    writeWord(0xffc0); // marker
    writeWord(17); // length, truecolor YUV JPG
    writeByte(8); // precision
    writeWord(height);
    writeWord(width);
    writeByte(3); // nrofcomponents
    writeByte(1); // IdY
    writeByte(0x11); // HVY
    writeByte(0); // QTY
    writeByte(2); // IdU
    writeByte(0x11); // HVU
    writeByte(1); // QTU
    writeByte(3); // IdV
    writeByte(0x11); // HVV
    writeByte(1); // QTV
  }

  function writeDQT() {
    writeWord(0xffdb); // marker
    writeWord(132); // length
    writeByte(0);
    for (var i = 0; i < 64; i++) {
      writeByte(YTable[i]);
    }
    writeByte(1);
    for (var j = 0; j < 64; j++) {
      writeByte(UVTable[j]);
    }
  }

  function writeDHT() {
    writeWord(0xffc4); // marker
    writeWord(0x01a2); // length

    writeByte(0); // HTYDCinfo
    for (var i = 0; i < 16; i++) {
      writeByte(std_dc_luminance_nrcodes[i + 1]);
    }
    for (var j = 0; j <= 11; j++) {
      writeByte(std_dc_luminance_values[j]);
    }

    writeByte(0x10); // HTYACinfo
    for (var k = 0; k < 16; k++) {
      writeByte(std_ac_luminance_nrcodes[k + 1]);
    }
    for (var l = 0; l <= 161; l++) {
      writeByte(std_ac_luminance_values[l]);
    }

    writeByte(1); // HTUDCinfo
    for (var m = 0; m < 16; m++) {
      writeByte(std_dc_chrominance_nrcodes[m + 1]);
    }
    for (var n = 0; n <= 11; n++) {
      writeByte(std_dc_chrominance_values[n]);
    }

    writeByte(0x11); // HTUACinfo
    for (var o = 0; o < 16; o++) {
      writeByte(std_ac_chrominance_nrcodes[o + 1]);
    }
    for (var p = 0; p <= 161; p++) {
      writeByte(std_ac_chrominance_values[p]);
    }
  }

  function writeSOS() {
    writeWord(0xffda); // marker
    writeWord(12); // length
    writeByte(3); // nrofcomponents
    writeByte(1); // IdY
    writeByte(0); // HTY
    writeByte(2); // IdU
    writeByte(0x11); // HTU
    writeByte(3); // IdV
    writeByte(0x11); // HTV
    writeByte(0); // Ss
    writeByte(0x3f); // Se
    writeByte(0); // Bf
  }

  function processDU(CDU, fdtbl, DC, HTDC, HTAC) {
    var EOB = HTAC[0x00];
    var M16zeroes = HTAC[0xf0];
    var pos;
    var I16 = 16;
    var I63 = 63;
    var I64 = 64;
    var DU_DCT = fDCTQuant(CDU, fdtbl);
    //ZigZag reorder
    for (var j = 0; j < I64; ++j) {
      DU[ZigZag[j]] = DU_DCT[j];
    }
    var Diff = DU[0] - DC;
    DC = DU[0];
    //Encode DC
    if (Diff == 0) {
      writeBits(HTDC[0]); // Diff might be 0
    } else {
      pos = 32767 + Diff;
      writeBits(HTDC[category[pos]]);
      writeBits(bitcode[pos]);
    }
    //Encode ACs
    var end0pos = 63; // was const... which is crazy
    while (end0pos > 0 && DU[end0pos] == 0) {
      end0pos--;
    }
    //end0pos = first element in reverse order !=0
    if (end0pos == 0) {
      writeBits(EOB);
      return DC;
    }
    var i = 1;
    var lng;
    while (i <= end0pos) {
      var startpos = i;
      while (DU[i] == 0 && i <= end0pos) {
        ++i;
      }
      var nrzeroes = i - startpos;
      if (nrzeroes >= I16) {
        lng = nrzeroes >> 4;
        for (var nrmarker = 1; nrmarker <= lng; ++nrmarker)
          writeBits(M16zeroes);
        nrzeroes = nrzeroes & 0xf;
      }
      pos = 32767 + DU[i];
      writeBits(HTAC[(nrzeroes << 4) + category[pos]]);
      writeBits(bitcode[pos]);
      i++;
    }
    if (end0pos != I63) {
      writeBits(EOB);
    }
    return DC;
  }

  function initCharLookupTable() {
    var sfcc = String.fromCharCode;
    for (var i = 0; i < 256; i++) {
      ///// ACHTUNG // 255
      clt[i] = sfcc(i);
    }
  }

  this.encode = function(
    image,
    quality // image data object
  ) {
    if (quality) setQuality(quality);

    // Initialize bit writer
    byteout = new Array();
    bytenew = 0;
    bytepos = 7;

    // Add JPEG headers
    writeWord(0xffd8); // SOI
    writeAPP0();
    writeDQT();
    writeSOF0(image.width, image.height);
    writeDHT();
    writeSOS();

    // Encode 8x8 macroblocks
    var DCY = 0;
    var DCU = 0;
    var DCV = 0;

    bytenew = 0;
    bytepos = 7;

    this.encode.displayName = "_encode_";

    var imageData = image.data;
    var width = image.width;
    var height = image.height;

    var quadWidth = width * 4;

    var x,
      y = 0;
    var r, g, b;
    var start, p, col, row, pos;
    while (y < height) {
      x = 0;
      while (x < quadWidth) {
        start = quadWidth * y + x;
        col = -1;
        row = 0;

        for (pos = 0; pos < 64; pos++) {
          row = pos >> 3; // /8
          col = (pos & 7) * 4; // %8
          p = start + row * quadWidth + col;

          if (y + row >= height) {
            // padding bottom
            p -= quadWidth * (y + 1 + row - height);
          }

          if (x + col >= quadWidth) {
            // padding right
            p -= x + col - quadWidth + 4;
          }

          r = imageData[p++];
          g = imageData[p++];
          b = imageData[p++];

          /* // calculate YUV values dynamically
					YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
					UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
					VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
					*/

          // use lookup table (slightly faster)
          YDU[pos] =
            ((RGB_YUV_TABLE[r] +
              RGB_YUV_TABLE[(g + 256) >> 0] +
              RGB_YUV_TABLE[(b + 512) >> 0]) >>
              16) -
            128;
          UDU[pos] =
            ((RGB_YUV_TABLE[(r + 768) >> 0] +
              RGB_YUV_TABLE[(g + 1024) >> 0] +
              RGB_YUV_TABLE[(b + 1280) >> 0]) >>
              16) -
            128;
          VDU[pos] =
            ((RGB_YUV_TABLE[(r + 1280) >> 0] +
              RGB_YUV_TABLE[(g + 1536) >> 0] +
              RGB_YUV_TABLE[(b + 1792) >> 0]) >>
              16) -
            128;
        }

        DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
        DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
        DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
        x += 32;
      }
      y += 8;
    }

    ////////////////////////////////////////////////////////////////

    // Do the bit alignment of the EOI marker
    if (bytepos >= 0) {
      var fillbits = [];
      fillbits[1] = bytepos + 1;
      fillbits[0] = (1 << (bytepos + 1)) - 1;
      writeBits(fillbits);
    }

    writeWord(0xffd9); //EOI

    return new Uint8Array(byteout);
  };

  function setQuality(quality) {
    quality = Math.min(Math.max(quality, 1), 100);

    if (currentQuality == quality) return; // don't recalc if unchanged

    var sf =
      quality < 50 ? Math.floor(5000 / quality) : Math.floor(200 - quality * 2);

    initQuantTables(sf);
    currentQuality = quality;
    //console.log('Quality set to: '+quality +'%');
  }

  function init() {
    quality = quality || 50;
    // Create tables
    initCharLookupTable();
    initHuffmanTbl();
    initCategoryNumber();
    initRGBYUVTable();

    setQuality(quality);
  }
  init();
}

/**
 * @license
 * Copyright (c) 2017 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * jsPDF Gif Support PlugIn
 *
 * @name gif_support
 * @module
 */
(function(jsPDFAPI) {

  jsPDFAPI.processGIF89A = function(imageData, index, alias, compression) {
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
    return jsPDFAPI.processJPEG.call(this, data, index, alias, compression);
  };

  jsPDFAPI.processGIF87A = jsPDFAPI.processGIF89A;
})(jsPDF.API);

/**
 * @author shaozilee
 *
 * Bmp format decoder,support 1bit 4bit 8bit 24bit bmp
 *
 */

function BmpDecoder(buffer, is_with_alpha) {
  this.pos = 0;
  this.buffer = buffer;
  this.datav = new DataView(buffer.buffer);
  this.is_with_alpha = !!is_with_alpha;
  this.bottom_up = true;
  this.flag =
    String.fromCharCode(this.buffer[0]) + String.fromCharCode(this.buffer[1]);
  this.pos += 2;
  if (["BM", "BA", "CI", "CP", "IC", "PT"].indexOf(this.flag) === -1)
    throw new Error("Invalid BMP File");
  this.parseHeader();
  this.parseBGR();
}

BmpDecoder.prototype.parseHeader = function() {
  this.fileSize = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.reserved = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.offset = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.headerSize = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.width = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.height = this.datav.getInt32(this.pos, true);
  this.pos += 4;
  this.planes = this.datav.getUint16(this.pos, true);
  this.pos += 2;
  this.bitPP = this.datav.getUint16(this.pos, true);
  this.pos += 2;
  this.compress = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.rawSize = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.hr = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.vr = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.colors = this.datav.getUint32(this.pos, true);
  this.pos += 4;
  this.importantColors = this.datav.getUint32(this.pos, true);
  this.pos += 4;

  if (this.bitPP === 16 && this.is_with_alpha) {
    this.bitPP = 15;
  }
  if (this.bitPP < 15) {
    var len = this.colors === 0 ? 1 << this.bitPP : this.colors;
    this.palette = new Array(len);
    for (var i = 0; i < len; i++) {
      var blue = this.datav.getUint8(this.pos++, true);
      var green = this.datav.getUint8(this.pos++, true);
      var red = this.datav.getUint8(this.pos++, true);
      var quad = this.datav.getUint8(this.pos++, true);
      this.palette[i] = {
        red: red,
        green: green,
        blue: blue,
        quad: quad
      };
    }
  }
  if (this.height < 0) {
    this.height *= -1;
    this.bottom_up = false;
  }
};

BmpDecoder.prototype.parseBGR = function() {
  this.pos = this.offset;
  try {
    var bitn = "bit" + this.bitPP;
    var len = this.width * this.height * 4;
    this.data = new Uint8Array(len);

    this[bitn]();
  } catch (e) {
    console.log("bit decode error:" + e);
  }
};

BmpDecoder.prototype.bit1 = function() {
  var xlen = Math.ceil(this.width / 8);
  var mode = xlen % 4;
  var y;
  for (y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < xlen; x++) {
      var b = this.datav.getUint8(this.pos++, true);
      var location = line * this.width * 4 + x * 8 * 4;
      for (var i = 0; i < 8; i++) {
        if (x * 8 + i < this.width) {
          var rgb = this.palette[(b >> (7 - i)) & 0x1];
          this.data[location + i * 4] = rgb.blue;
          this.data[location + i * 4 + 1] = rgb.green;
          this.data[location + i * 4 + 2] = rgb.red;
          this.data[location + i * 4 + 3] = 0xff;
        } else {
          break;
        }
      }
    }

    if (mode !== 0) {
      this.pos += 4 - mode;
    }
  }
};

BmpDecoder.prototype.bit4 = function() {
  var xlen = Math.ceil(this.width / 2);
  var mode = xlen % 4;
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < xlen; x++) {
      var b = this.datav.getUint8(this.pos++, true);
      var location = line * this.width * 4 + x * 2 * 4;

      var before = b >> 4;
      var after = b & 0x0f;

      var rgb = this.palette[before];
      this.data[location] = rgb.blue;
      this.data[location + 1] = rgb.green;
      this.data[location + 2] = rgb.red;
      this.data[location + 3] = 0xff;

      if (x * 2 + 1 >= this.width) break;

      rgb = this.palette[after];
      this.data[location + 4] = rgb.blue;
      this.data[location + 4 + 1] = rgb.green;
      this.data[location + 4 + 2] = rgb.red;
      this.data[location + 4 + 3] = 0xff;
    }

    if (mode !== 0) {
      this.pos += 4 - mode;
    }
  }
};

BmpDecoder.prototype.bit8 = function() {
  var mode = this.width % 4;
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {
      var b = this.datav.getUint8(this.pos++, true);
      var location = line * this.width * 4 + x * 4;
      if (b < this.palette.length) {
        var rgb = this.palette[b];
        this.data[location] = rgb.red;
        this.data[location + 1] = rgb.green;
        this.data[location + 2] = rgb.blue;
        this.data[location + 3] = 0xff;
      } else {
        this.data[location] = 0xff;
        this.data[location + 1] = 0xff;
        this.data[location + 2] = 0xff;
        this.data[location + 3] = 0xff;
      }
    }
    if (mode !== 0) {
      this.pos += 4 - mode;
    }
  }
};

BmpDecoder.prototype.bit15 = function() {
  var dif_w = this.width % 3;
  var _11111 = parseInt("11111", 2),
    _1_5 = _11111;
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {
      var B = this.datav.getUint16(this.pos, true);
      this.pos += 2;
      var blue = (((B & _1_5) / _1_5) * 255) | 0;
      var green = ((((B >> 5) & _1_5) / _1_5) * 255) | 0;
      var red = ((((B >> 10) & _1_5) / _1_5) * 255) | 0;
      var alpha = B >> 15 ? 0xff : 0x00;

      var location = line * this.width * 4 + x * 4;
      this.data[location] = red;
      this.data[location + 1] = green;
      this.data[location + 2] = blue;
      this.data[location + 3] = alpha;
    }
    //skip extra bytes
    this.pos += dif_w;
  }
};

BmpDecoder.prototype.bit16 = function() {
  var dif_w = this.width % 3;
  var _11111 = parseInt("11111", 2),
    _1_5 = _11111;
  var _111111 = parseInt("111111", 2),
    _1_6 = _111111;
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {
      var B = this.datav.getUint16(this.pos, true);
      this.pos += 2;
      var alpha = 0xff;
      var blue = (((B & _1_5) / _1_5) * 255) | 0;
      var green = ((((B >> 5) & _1_6) / _1_6) * 255) | 0;
      var red = (((B >> 11) / _1_5) * 255) | 0;

      var location = line * this.width * 4 + x * 4;
      this.data[location] = red;
      this.data[location + 1] = green;
      this.data[location + 2] = blue;
      this.data[location + 3] = alpha;
    }
    //skip extra bytes
    this.pos += dif_w;
  }
};

BmpDecoder.prototype.bit24 = function() {
  //when height > 0
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {
      var blue = this.datav.getUint8(this.pos++, true);
      var green = this.datav.getUint8(this.pos++, true);
      var red = this.datav.getUint8(this.pos++, true);
      var location = line * this.width * 4 + x * 4;
      this.data[location] = red;
      this.data[location + 1] = green;
      this.data[location + 2] = blue;
      this.data[location + 3] = 0xff;
    }
    //skip extra bytes
    this.pos += this.width % 4;
  }
};

/**
 * add 32bit decode func
 * @author soubok
 */
BmpDecoder.prototype.bit32 = function() {
  //when height > 0
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {
      var blue = this.datav.getUint8(this.pos++, true);
      var green = this.datav.getUint8(this.pos++, true);
      var red = this.datav.getUint8(this.pos++, true);
      var alpha = this.datav.getUint8(this.pos++, true);
      var location = line * this.width * 4 + x * 4;
      this.data[location] = red;
      this.data[location + 1] = green;
      this.data[location + 2] = blue;
      this.data[location + 3] = alpha;
    }
    //skip extra bytes
    //this.pos += (this.width % 4);
  }
};

BmpDecoder.prototype.getData = function() {
  return this.data;
};

/**
 * @license
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
(function(jsPDFAPI) {

  jsPDFAPI.processBMP = function(imageData, index, alias, compression) {
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
    return jsPDFAPI.processJPEG.call(this, data, index, alias, compression);
  };
})(jsPDF.API);

function WebPDecoder(imageData) {

  function x(F) {
    if (!F) throw Error("assert :P");
  }
  function fa(F, L, J) {
    for (var H = 0; 4 > H; H++) if (F[L + H] != J.charCodeAt(H)) return !0;
    return !1;
  }
  function I(F, L, J, H, Z) {
    for (var O = 0; O < Z; O++) F[L + O] = J[H + O];
  }
  function M(F, L, J, H) {
    for (var Z = 0; Z < H; Z++) F[L + Z] = J;
  }
  function V(F) {
    return new Int32Array(F);
  }
  function wa(F, L) {
    for (var J = [], H = 0; H < F; H++) J.push(new L());
    return J;
  }
  function wb() {
    function F(J, H, Z) {
      for (var O = Z[H], L = 0; L < O; L++) {
        J.push(Z.length > H + 1 ? [] : 0);
        if (Z.length < H + 1) break;
        F(J[L], H + 1, Z);
      }
    }
    var L = [];
    F(L, 0, [3, 11]);
    return L;
  }
  function Ed(F, L) {
    function J(H, O, F) {
      for (var Z = F[O], ma = 0; ma < Z; ma++) {
        H.push(F.length > O + 1 ? [] : new L());
        if (F.length < O + 1) break;
        J(H[ma], O + 1, F);
      }
    }
    var H = [];
    J(H, 0, F);
    return H;
  }
  WebPDecoder = function() {
    var self = this;
    function L(a, b) {
      for (var c = (1 << (b - 1)) >>> 0; a & c; ) c >>>= 1;
      return c ? (a & (c - 1)) + c : a;
    }
    function J(a, b, c, d, e) {
      x(!(d % c));
      do (d -= c), (a[b + d] = e);
      while (0 < d);
    }
    function H(a, b, c, d, e, f) {
      var g = b,
        h = 1 << c,
        k,
        l,
        m = V(16),
        n = V(16);
      x(0 != e);
      x(null != d);
      x(null != a);
      x(0 < c);
      for (l = 0; l < e; ++l) {
        if (15 < d[l]) return 0;
        ++m[d[l]];
      }
      if (m[0] == e) return 0;
      n[1] = 0;
      for (k = 1; 15 > k; ++k) {
        if (m[k] > 1 << k) return 0;
        n[k + 1] = n[k] + m[k];
      }
      for (l = 0; l < e; ++l) (k = d[l]), 0 < d[l] && (f[n[k]++] = l);
      if (1 == n[15])
        return (d = new O()), (d.g = 0), (d.value = f[0]), J(a, g, 1, h, d), h;
      var r = -1,
        q = h - 1,
        t = 0,
        v = 1,
        p = 1,
        u,
        w = 1 << c;
      l = 0;
      k = 1;
      for (e = 2; k <= c; ++k, e <<= 1) {
        p <<= 1;
        v += p;
        p -= m[k];
        if (0 > p) return 0;
        for (; 0 < m[k]; --m[k])
          (d = new O()),
            (d.g = k),
            (d.value = f[l++]),
            J(a, g + t, e, w, d),
            (t = L(t, k));
      }
      k = c + 1;
      for (e = 2; 15 >= k; ++k, e <<= 1) {
        p <<= 1;
        v += p;
        p -= m[k];
        if (0 > p) return 0;
        for (; 0 < m[k]; --m[k]) {
          d = new O();
          if ((t & q) != r) {
            g += w;
            r = k;
            for (u = 1 << (r - c); 15 > r; ) {
              u -= m[r];
              if (0 >= u) break;
              ++r;
              u <<= 1;
            }
            u = r - c;
            w = 1 << u;
            h += w;
            r = t & q;
            a[b + r].g = u + c;
            a[b + r].value = g - b - r;
          }
          d.g = k - c;
          d.value = f[l++];
          J(a, g + (t >> c), e, w, d);
          t = L(t, k);
        }
      }
      return v != 2 * n[15] - 1 ? 0 : h;
    }
    function Z(a, b, c, d, e) {
      x(2328 >= e);
      if (512 >= e) var f = V(512);
      else if (((f = V(e)), null == f)) return 0;
      return H(a, b, c, d, e, f);
    }
    function O() {
      this.value = this.g = 0;
    }
    function Fd() {
      this.value = this.g = 0;
    }
    function Ub() {
      this.G = wa(5, O);
      this.H = V(5);
      this.jc = this.Qb = this.qb = this.nd = 0;
      this.pd = wa(xb, Fd);
    }
    function ma(a, b, c, d) {
      x(null != a);
      x(null != b);
      x(2147483648 > d);
      a.Ca = 254;
      a.I = 0;
      a.b = -8;
      a.Ka = 0;
      a.oa = b;
      a.pa = c;
      a.Jd = b;
      a.Yc = c + d;
      a.Zc = 4 <= d ? c + d - 4 + 1 : c;
      Qa(a);
    }
    function na(a, b) {
      for (var c = 0; 0 < b--; ) c |= K(a, 128) << b;
      return c;
    }
    function ca(a, b) {
      var c = na(a, b);
      return G(a) ? -c : c;
    }
    function cb(a, b, c, d) {
      var e,
        f = 0;
      x(null != a);
      x(null != b);
      x(4294967288 > d);
      a.Sb = d;
      a.Ra = 0;
      a.u = 0;
      a.h = 0;
      4 < d && (d = 4);
      for (e = 0; e < d; ++e) f += b[c + e] << (8 * e);
      a.Ra = f;
      a.bb = d;
      a.oa = b;
      a.pa = c;
    }
    function Vb(a) {
      for (; 8 <= a.u && a.bb < a.Sb; )
        (a.Ra >>>= 8),
          (a.Ra += (a.oa[a.pa + a.bb] << (ob - 8)) >>> 0),
          ++a.bb,
          (a.u -= 8);
      db(a) && ((a.h = 1), (a.u = 0));
    }
    function D(a, b) {
      x(0 <= b);
      if (!a.h && b <= Gd) {
        var c = pb(a) & Hd[b];
        a.u += b;
        Vb(a);
        return c;
      }
      a.h = 1;
      return (a.u = 0);
    }
    function Wb() {
      this.b = this.Ca = this.I = 0;
      this.oa = [];
      this.pa = 0;
      this.Jd = [];
      this.Yc = 0;
      this.Zc = [];
      this.Ka = 0;
    }
    function Ra() {
      this.Ra = 0;
      this.oa = [];
      this.h = this.u = this.bb = this.Sb = this.pa = 0;
    }
    function pb(a) {
      return (a.Ra >>> (a.u & (ob - 1))) >>> 0;
    }
    function db(a) {
      x(a.bb <= a.Sb);
      return a.h || (a.bb == a.Sb && a.u > ob);
    }
    function qb(a, b) {
      a.u = b;
      a.h = db(a);
    }
    function Sa(a) {
      a.u >= Xb && (x(a.u >= Xb), Vb(a));
    }
    function Qa(a) {
      x(null != a && null != a.oa);
      a.pa < a.Zc
        ? ((a.I = (a.oa[a.pa++] | (a.I << 8)) >>> 0), (a.b += 8))
        : (x(null != a && null != a.oa),
          a.pa < a.Yc
            ? ((a.b += 8), (a.I = a.oa[a.pa++] | (a.I << 8)))
            : a.Ka
            ? (a.b = 0)
            : ((a.I <<= 8), (a.b += 8), (a.Ka = 1)));
    }
    function G(a) {
      return na(a, 1);
    }
    function K(a, b) {
      var c = a.Ca;
      0 > a.b && Qa(a);
      var d = a.b,
        e = (c * b) >>> 8,
        f = (a.I >>> d > e) + 0;
      f ? ((c -= e), (a.I -= ((e + 1) << d) >>> 0)) : (c = e + 1);
      d = c;
      for (e = 0; 256 <= d; ) (e += 8), (d >>= 8);
      d = 7 ^ (e + Id[d]);
      a.b -= d;
      a.Ca = (c << d) - 1;
      return f;
    }
    function ra(a, b, c) {
      a[b + 0] = (c >> 24) & 255;
      a[b + 1] = (c >> 16) & 255;
      a[b + 2] = (c >> 8) & 255;
      a[b + 3] = (c >> 0) & 255;
    }
    function Ta(a, b) {
      return (a[b + 0] << 0) | (a[b + 1] << 8);
    }
    function Yb(a, b) {
      return Ta(a, b) | (a[b + 2] << 16);
    }
    function Ha(a, b) {
      return Ta(a, b) | (Ta(a, b + 2) << 16);
    }
    function Zb(a, b) {
      var c = 1 << b;
      x(null != a);
      x(0 < b);
      a.X = V(c);
      if (null == a.X) return 0;
      a.Mb = 32 - b;
      a.Xa = b;
      return 1;
    }
    function $b(a, b) {
      x(null != a);
      x(null != b);
      x(a.Xa == b.Xa);
      I(b.X, 0, a.X, 0, 1 << b.Xa);
    }
    function ac() {
      this.X = [];
      this.Xa = this.Mb = 0;
    }
    function bc(a, b, c, d) {
      x(null != c);
      x(null != d);
      var e = c[0],
        f = d[0];
      0 == e && (e = (a * f + b / 2) / b);
      0 == f && (f = (b * e + a / 2) / a);
      if (0 >= e || 0 >= f) return 0;
      c[0] = e;
      d[0] = f;
      return 1;
    }
    function xa(a, b) {
      return (a + (1 << b) - 1) >>> b;
    }
    function yb(a, b) {
      return (
        (((((a & 4278255360) + (b & 4278255360)) >>> 0) & 4278255360) +
          ((((a & 16711935) + (b & 16711935)) >>> 0) & 16711935)) >>>
        0
      );
    }
    function X(a, b) {
      self[b] = function(b, d, e, f, g, h, k) {
        var c;
        for (c = 0; c < g; ++c) {
          var m = self[a](h[k + c - 1], e, f + c);
          h[k + c] = yb(b[d + c], m);
        }
      };
    }
    function Jd() {
      this.ud = this.hd = this.jd = 0;
    }
    function aa(a, b) {
      return ((((a ^ b) & 4278124286) >>> 1) + (a & b)) >>> 0;
    }
    function sa(a) {
      if (0 <= a && 256 > a) return a;
      if (0 > a) return 0;
      if (255 < a) return 255;
    }
    function eb(a, b) {
      return sa(a + ((a - b + 0.5) >> 1));
    }
    function Ia(a, b, c) {
      return Math.abs(b - c) - Math.abs(a - c);
    }
    function cc(a, b, c, d, e, f, g) {
      d = f[g - 1];
      for (c = 0; c < e; ++c) f[g + c] = d = yb(a[b + c], d);
    }
    function Kd(a, b, c, d, e) {
      var f;
      for (f = 0; f < c; ++f) {
        var g = a[b + f],
          h = (g >> 8) & 255,
          k = g & 16711935,
          k = k + ((h << 16) + h),
          k = k & 16711935;
        d[e + f] = ((g & 4278255360) + k) >>> 0;
      }
    }
    function dc(a, b) {
      b.jd = (a >> 0) & 255;
      b.hd = (a >> 8) & 255;
      b.ud = (a >> 16) & 255;
    }
    function Ld(a, b, c, d, e, f) {
      var g;
      for (g = 0; g < d; ++g) {
        var h = b[c + g],
          k = h >>> 8,
          l = h >>> 16,
          m = h,
          l = l + ((((a.jd << 24) >> 24) * ((k << 24) >> 24)) >>> 5),
          l = l & 255,
          m = m + ((((a.hd << 24) >> 24) * ((k << 24) >> 24)) >>> 5),
          m = m + ((((a.ud << 24) >> 24) * ((l << 24) >> 24)) >>> 5),
          m = m & 255;
        e[f + g] = (h & 4278255360) + (l << 16) + m;
      }
    }
    function ec(a, b, c, d, e) {
      self[b] = function(a, b, c, k, l, m, n, r, q) {
        for (k = n; k < r; ++k)
          for (n = 0; n < q; ++n) l[m++] = e(c[d(a[b++])]);
      };
      self[a] = function(a, b, h, k, l, m, n) {
        var f = 8 >> a.b,
          g = a.Ea,
          t = a.K[0],
          v = a.w;
        if (8 > f)
          for (a = (1 << a.b) - 1, v = (1 << f) - 1; b < h; ++b) {
            var p = 0,
              u;
            for (u = 0; u < g; ++u)
              u & a || (p = d(k[l++])), (m[n++] = e(t[p & v])), (p >>= f);
          }
        else self["VP8LMapColor" + c](k, l, t, v, m, n, b, h, g);
      };
    }
    function Md(a, b, c, d, e) {
      for (c = b + c; b < c; ) {
        var f = a[b++];
        d[e++] = (f >> 16) & 255;
        d[e++] = (f >> 8) & 255;
        d[e++] = (f >> 0) & 255;
      }
    }
    function Nd(a, b, c, d, e) {
      for (c = b + c; b < c; ) {
        var f = a[b++];
        d[e++] = (f >> 16) & 255;
        d[e++] = (f >> 8) & 255;
        d[e++] = (f >> 0) & 255;
        d[e++] = (f >> 24) & 255;
      }
    }
    function Od(a, b, c, d, e) {
      for (c = b + c; b < c; ) {
        var f = a[b++],
          g = ((f >> 16) & 240) | ((f >> 12) & 15),
          f = ((f >> 0) & 240) | ((f >> 28) & 15);
        d[e++] = g;
        d[e++] = f;
      }
    }
    function Pd(a, b, c, d, e) {
      for (c = b + c; b < c; ) {
        var f = a[b++],
          g = ((f >> 16) & 248) | ((f >> 13) & 7),
          f = ((f >> 5) & 224) | ((f >> 3) & 31);
        d[e++] = g;
        d[e++] = f;
      }
    }
    function Qd(a, b, c, d, e) {
      for (c = b + c; b < c; ) {
        var f = a[b++];
        d[e++] = (f >> 0) & 255;
        d[e++] = (f >> 8) & 255;
        d[e++] = (f >> 16) & 255;
      }
    }
    function fb(a, b, c, d, e, f) {
      if (0 == f)
        for (c = b + c; b < c; )
          (f = a[b++]),
            ra(
              d,
              ((f[0] >> 24) |
                ((f[1] >> 8) & 65280) |
                ((f[2] << 8) & 16711680) |
                (f[3] << 24)) >>>
                0
            ),
            (e += 32);
      else I(d, e, a, b, c);
    }
    function gb(a, b) {
      self[b][0] = self[a + "0"];
      self[b][1] = self[a + "1"];
      self[b][2] = self[a + "2"];
      self[b][3] = self[a + "3"];
      self[b][4] = self[a + "4"];
      self[b][5] = self[a + "5"];
      self[b][6] = self[a + "6"];
      self[b][7] = self[a + "7"];
      self[b][8] = self[a + "8"];
      self[b][9] = self[a + "9"];
      self[b][10] = self[a + "10"];
      self[b][11] = self[a + "11"];
      self[b][12] = self[a + "12"];
      self[b][13] = self[a + "13"];
      self[b][14] = self[a + "0"];
      self[b][15] = self[a + "0"];
    }
    function hb(a) {
      return a == zb || a == Ab || a == Ja || a == Bb;
    }
    function Rd() {
      this.eb = [];
      this.size = this.A = this.fb = 0;
    }
    function Sd() {
      this.y = [];
      this.f = [];
      this.ea = [];
      this.F = [];
      this.Tc = this.Ed = this.Cd = this.Fd = this.lb = this.Db = this.Ab = this.fa = this.J = this.W = this.N = this.O = 0;
    }
    function Cb() {
      this.Rd = this.height = this.width = this.S = 0;
      this.f = {};
      this.f.RGBA = new Rd();
      this.f.kb = new Sd();
      this.sd = null;
    }
    function Td() {
      this.width = [0];
      this.height = [0];
      this.Pd = [0];
      this.Qd = [0];
      this.format = [0];
    }
    function Ud() {
      this.Id = this.fd = this.Md = this.hb = this.ib = this.da = this.bd = this.cd = this.j = this.v = this.Da = this.Sd = this.ob = 0;
    }
    function Vd(a) {
      alert("todo:WebPSamplerProcessPlane");
      return a.T;
    }
    function Wd(a, b) {
      var c = a.T,
        d = b.ba.f.RGBA,
        e = d.eb,
        f = d.fb + a.ka * d.A,
        g = P[b.ba.S],
        h = a.y,
        k = a.O,
        l = a.f,
        m = a.N,
        n = a.ea,
        r = a.W,
        q = b.cc,
        t = b.dc,
        v = b.Mc,
        p = b.Nc,
        u = a.ka,
        w = a.ka + a.T,
        y = a.U,
        A = (y + 1) >> 1;
      0 == u
        ? g(h, k, null, null, l, m, n, r, l, m, n, r, e, f, null, null, y)
        : (g(b.ec, b.fc, h, k, q, t, v, p, l, m, n, r, e, f - d.A, e, f, y),
          ++c);
      for (; u + 2 < w; u += 2)
        (q = l),
          (t = m),
          (v = n),
          (p = r),
          (m += a.Rc),
          (r += a.Rc),
          (f += 2 * d.A),
          (k += 2 * a.fa),
          g(h, k - a.fa, h, k, q, t, v, p, l, m, n, r, e, f - d.A, e, f, y);
      k += a.fa;
      a.j + w < a.o
        ? (I(b.ec, b.fc, h, k, y),
          I(b.cc, b.dc, l, m, A),
          I(b.Mc, b.Nc, n, r, A),
          c--)
        : w & 1 ||
          g(
            h,
            k,
            null,
            null,
            l,
            m,
            n,
            r,
            l,
            m,
            n,
            r,
            e,
            f + d.A,
            null,
            null,
            y
          );
      return c;
    }
    function Xd(a, b, c) {
      var d = a.F,
        e = [a.J];
      if (null != d) {
        var f = a.U,
          g = b.ba.S,
          h = g == ya || g == Ja;
        b = b.ba.f.RGBA;
        var k = [0],
          l = a.ka;
        k[0] = a.T;
        a.Kb &&
          (0 == l ? --k[0] : (--l, (e[0] -= a.width)),
          a.j + a.ka + a.T == a.o && (k[0] = a.o - a.j - l));
        var m = b.eb,
          l = b.fb + l * b.A;
        a = fc(d, e[0], a.width, f, k, m, l + (h ? 0 : 3), b.A);
        x(c == k);
        a && hb(g) && za(m, l, h, f, k, b.A);
      }
      return 0;
    }
    function gc(a) {
      var b = a.ma,
        c = b.ba.S,
        d = 11 > c,
        e = c == Ua || c == Va || c == ya || c == Db || 12 == c || hb(c);
      b.memory = null;
      b.Ib = null;
      b.Jb = null;
      b.Nd = null;
      if (!hc(b.Oa, a, e ? 11 : 12)) return 0;
      e && hb(c) && ic();
      if (a.da) alert("todo:use_scaling");
      else {
        if (d) {
          if (((b.Ib = Vd), a.Kb)) {
            c = (a.U + 1) >> 1;
            b.memory = V(a.U + 2 * c);
            if (null == b.memory) return 0;
            b.ec = b.memory;
            b.fc = 0;
            b.cc = b.ec;
            b.dc = b.fc + a.U;
            b.Mc = b.cc;
            b.Nc = b.dc + c;
            b.Ib = Wd;
            ic();
          }
        } else alert("todo:EmitYUV");
        e && ((b.Jb = Xd), d && Aa());
      }
      if (d && !jc) {
        for (a = 0; 256 > a; ++a)
          (Yd[a] = (89858 * (a - 128) + Ba) >> Wa),
            (Zd[a] = -22014 * (a - 128) + Ba),
            ($d[a] = -45773 * (a - 128)),
            (ae[a] = (113618 * (a - 128) + Ba) >> Wa);
        for (a = ta; a < Eb; ++a)
          (b = (76283 * (a - 16) + Ba) >> Wa),
            (be[a - ta] = ga(b, 255)),
            (ce[a - ta] = ga((b + 8) >> 4, 15));
        jc = 1;
      }
      return 1;
    }
    function kc(a) {
      var b = a.ma,
        c = a.U,
        d = a.T;
      x(!(a.ka & 1));
      if (0 >= c || 0 >= d) return 0;
      c = b.Ib(a, b);
      null != b.Jb && b.Jb(a, b, c);
      b.Dc += c;
      return 1;
    }
    function lc(a) {
      a.ma.memory = null;
    }
    function mc(a, b, c, d) {
      if (47 != D(a, 8)) return 0;
      b[0] = D(a, 14) + 1;
      c[0] = D(a, 14) + 1;
      d[0] = D(a, 1);
      return 0 != D(a, 3) ? 0 : !a.h;
    }
    function ib(a, b) {
      if (4 > a) return a + 1;
      var c = (a - 2) >> 1;
      return ((2 + (a & 1)) << c) + D(b, c) + 1;
    }
    function nc(a, b) {
      if (120 < b) return b - 120;
      var c = de[b - 1],
        c = (c >> 4) * a + (8 - (c & 15));
      return 1 <= c ? c : 1;
    }
    function ua(a, b, c) {
      var d = pb(c);
      b += d & 255;
      var e = a[b].g - 8;
      0 < e &&
        (qb(c, c.u + 8),
        (d = pb(c)),
        (b += a[b].value),
        (b += d & ((1 << e) - 1)));
      qb(c, c.u + a[b].g);
      return a[b].value;
    }
    function ub(a, b, c) {
      c.g += a.g;
      c.value += (a.value << b) >>> 0;
      x(8 >= c.g);
      return a.g;
    }
    function ha(a, b, c) {
      var d = a.xc;
      b = 0 == d ? 0 : a.vc[a.md * (c >> d) + (b >> d)];
      x(b < a.Wb);
      return a.Ya[b];
    }
    function oc(a, b, c, d) {
      var e = a.ab,
        f = a.c * b,
        g = a.C;
      b = g + b;
      var h = c,
        k = d;
      d = a.Ta;
      for (c = a.Ua; 0 < e--; ) {
        var l = a.gc[e],
          m = g,
          n = b,
          r = h,
          q = k,
          k = d,
          h = c,
          t = l.Ea;
        x(m < n);
        x(n <= l.nc);
        switch (l.hc) {
          case 2:
            pc(r, q, (n - m) * t, k, h);
            break;
          case 0:
            var v = l,
              p = m,
              u = n,
              w = k,
              y = h,
              A = v.Ea;
            0 == p &&
              (ee(r, q, null, null, 1, w, y),
              cc(r, q + 1, 0, 0, A - 1, w, y + 1),
              (q += A),
              (y += A),
              ++p);
            for (
              var E = 1 << v.b,
                B = E - 1,
                C = xa(A, v.b),
                N = v.K,
                v = v.w + (p >> v.b) * C;
              p < u;

            ) {
              var z = N,
                Q = v,
                S = 1;
              for (fe(r, q, w, y - A, 1, w, y); S < A; ) {
                var K = qc[(z[Q++] >> 8) & 15],
                  D = (S & ~B) + E;
                D > A && (D = A);
                K(r, q + +S, w, y + S - A, D - S, w, y + S);
                S = D;
              }
              q += A;
              y += A;
              ++p;
              p & B || (v += C);
            }
            n != l.nc && I(k, h - t, k, h + (n - m - 1) * t, t);
            break;
          case 1:
            t = r;
            u = q;
            r = l.Ea;
            q = 1 << l.b;
            w = q - 1;
            y = r & ~w;
            A = r - y;
            p = xa(r, l.b);
            E = l.K;
            for (l = l.w + (m >> l.b) * p; m < n; ) {
              B = E;
              C = l;
              N = new Jd();
              v = u + y;
              for (z = u + r; u < v; )
                dc(B[C++], N), Fb(N, t, u, q, k, h), (u += q), (h += q);
              u < z &&
                (dc(B[C++], N), Fb(N, t, u, A, k, h), (u += A), (h += A));
              ++m;
              m & w || (l += p);
            }
            break;
          case 3:
            if (r == k && q == h && 0 < l.b) {
              y = (n - m) * xa(l.Ea, l.b);
              t = h + (n - m) * t - y;
              u = k;
              r = t;
              q = k;
              w = h;
              A = y;
              p = [];
              for (y = A - 1; 0 <= y; --y) p[y] = q[w + y];
              for (y = A - 1; 0 <= y; --y) u[r + y] = p[y];
              rc(l, m, n, k, t, k, h);
            } else rc(l, m, n, r, q, k, h);
        }
        h = d;
        k = c;
      }
      k != c && I(d, c, h, k, f);
    }
    function ge(a, b) {
      var c = a.V,
        d = a.Ba + a.c * a.C,
        e = b - a.C;
      x(b <= a.l.o);
      x(16 >= e);
      if (0 < e) {
        var f = a.l,
          g = a.Ta,
          h = a.Ua,
          k = f.width;
        oc(a, e, c, d);
        h = [h];
        c = a.C;
        d = b;
        e = h;
        x(c < d);
        x(f.v < f.va);
        d > f.o && (d = f.o);
        if (c < f.j) {
          var l = f.j - c,
            c = f.j;
          e[0] += l * k;
        }
        c >= d
          ? (c = 0)
          : ((e[0] += 4 * f.v),
            (f.ka = c - f.j),
            (f.U = f.va - f.v),
            (f.T = d - c),
            (c = 1));
        if (c) {
          h = h[0];
          c = a.ca;
          if (11 > c.S) {
            for (
              var m = c.f.RGBA,
                d = c.S,
                e = f.U,
                f = f.T,
                l = m.eb,
                n = m.A,
                r = f,
                m = m.fb + a.Ma * m.A;
              0 < r--;

            ) {
              var q = g,
                t = h,
                v = e,
                p = l,
                u = m;
              switch (d) {
                case Ca:
                  sc(q, t, v, p, u);
                  break;
                case Ua:
                  Gb(q, t, v, p, u);
                  break;
                case zb:
                  Gb(q, t, v, p, u);
                  za(p, u, 0, v, 1, 0);
                  break;
                case tc:
                  uc(q, t, v, p, u);
                  break;
                case Va:
                  fb(q, t, v, p, u, 1);
                  break;
                case Ab:
                  fb(q, t, v, p, u, 1);
                  za(p, u, 0, v, 1, 0);
                  break;
                case ya:
                  fb(q, t, v, p, u, 0);
                  break;
                case Ja:
                  fb(q, t, v, p, u, 0);
                  za(p, u, 1, v, 1, 0);
                  break;
                case Db:
                  Hb(q, t, v, p, u);
                  break;
                case Bb:
                  Hb(q, t, v, p, u);
                  vc(p, u, v, 1, 0);
                  break;
                case wc:
                  xc(q, t, v, p, u);
                  break;
                default:
                  x(0);
              }
              h += k;
              m += n;
            }
            a.Ma += f;
          } else alert("todo:EmitRescaledRowsYUVA");
          x(a.Ma <= c.height);
        }
      }
      a.C = b;
      x(a.C <= a.i);
    }
    function yc(a) {
      var b;
      if (0 < a.ua) return 0;
      for (b = 0; b < a.Wb; ++b) {
        var c = a.Ya[b].G,
          d = a.Ya[b].H;
        if (
          0 < c[1][d[1] + 0].g ||
          0 < c[2][d[2] + 0].g ||
          0 < c[3][d[3] + 0].g
        )
          return 0;
      }
      return 1;
    }
    function zc(a, b, c, d, e, f) {
      if (0 != a.Z) {
        var g = a.qd,
          h = a.rd;
        for (x(null != ia[a.Z]); b < c; ++b)
          ia[a.Z](g, h, d, e, d, e, f), (g = d), (h = e), (e += f);
        a.qd = g;
        a.rd = h;
      }
    }
    function Ib(a, b) {
      var c = a.l.ma,
        d = 0 == c.Z || 1 == c.Z ? a.l.j : a.C,
        d = a.C < d ? d : a.C;
      x(b <= a.l.o);
      if (b > d) {
        var e = a.l.width,
          f = c.ca,
          g = c.tb + e * d,
          h = a.V,
          k = a.Ba + a.c * d,
          l = a.gc;
        x(1 == a.ab);
        x(3 == l[0].hc);
        he(l[0], d, b, h, k, f, g);
        zc(c, d, b, f, g, e);
      }
      a.C = a.Ma = b;
    }
    function Jb(a, b, c, d, e, f, g) {
      var h = a.$ / d,
        k = a.$ % d,
        l = a.m,
        m = a.s,
        n = c + a.$,
        r = n;
      e = c + d * e;
      var q = c + d * f,
        t = 280 + m.ua,
        v = a.Pb ? h : 16777216,
        p = 0 < m.ua ? m.Wa : null,
        u = m.wc,
        w = n < q ? ha(m, k, h) : null;
      x(a.C < f);
      x(q <= e);
      var y = !1;
      a: for (;;) {
        for (; y || n < q; ) {
          var A = 0;
          if (h >= v) {
            var v = a,
              E = n - c;
            x(v.Pb);
            v.wd = v.m;
            v.xd = E;
            0 < v.s.ua && $b(v.s.Wa, v.s.vb);
            v = h + ie;
          }
          k & u || (w = ha(m, k, h));
          x(null != w);
          w.Qb && ((b[n] = w.qb), (y = !0));
          if (!y)
            if ((Sa(l), w.jc)) {
              var A = l,
                E = b,
                B = n,
                C = w.pd[pb(A) & (xb - 1)];
              x(w.jc);
              256 > C.g
                ? (qb(A, A.u + C.g), (E[B] = C.value), (A = 0))
                : (qb(A, A.u + C.g - 256), x(256 <= C.value), (A = C.value));
              0 == A && (y = !0);
            } else A = ua(w.G[0], w.H[0], l);
          if (l.h) break;
          if (y || 256 > A) {
            if (!y)
              if (w.nd) b[n] = (w.qb | (A << 8)) >>> 0;
              else {
                Sa(l);
                y = ua(w.G[1], w.H[1], l);
                Sa(l);
                E = ua(w.G[2], w.H[2], l);
                B = ua(w.G[3], w.H[3], l);
                if (l.h) break;
                b[n] = ((B << 24) | (y << 16) | (A << 8) | E) >>> 0;
              }
            y = !1;
            ++n;
            ++k;
            if (
              k >= d &&
              ((k = 0),
              ++h,
              null != g && h <= f && !(h % 16) && g(a, h),
              null != p)
            )
              for (; r < n; )
                (A = b[r++]),
                  (p.X[((506832829 * A) & 4294967295) >>> p.Mb] = A);
          } else if (280 > A) {
            A = ib(A - 256, l);
            E = ua(w.G[4], w.H[4], l);
            Sa(l);
            E = ib(E, l);
            E = nc(d, E);
            if (l.h) break;
            if (n - c < E || e - n < A) break a;
            else for (B = 0; B < A; ++B) b[n + B] = b[n + B - E];
            n += A;
            for (k += A; k >= d; )
              (k -= d), ++h, null != g && h <= f && !(h % 16) && g(a, h);
            x(n <= e);
            k & u && (w = ha(m, k, h));
            if (null != p)
              for (; r < n; )
                (A = b[r++]),
                  (p.X[((506832829 * A) & 4294967295) >>> p.Mb] = A);
          } else if (A < t) {
            y = A - 280;
            for (x(null != p); r < n; )
              (A = b[r++]), (p.X[((506832829 * A) & 4294967295) >>> p.Mb] = A);
            A = n;
            E = p;
            x(!(y >>> E.Xa));
            b[A] = E.X[y];
            y = !0;
          } else break a;
          y || x(l.h == db(l));
        }
        if (a.Pb && l.h && n < e)
          x(a.m.h),
            (a.a = 5),
            (a.m = a.wd),
            (a.$ = a.xd),
            0 < a.s.ua && $b(a.s.vb, a.s.Wa);
        else if (l.h) break a;
        else null != g && g(a, h > f ? f : h), (a.a = 0), (a.$ = n - c);
        return 1;
      }
      a.a = 3;
      return 0;
    }
    function Ac(a) {
      x(null != a);
      a.vc = null;
      a.yc = null;
      a.Ya = null;
      var b = a.Wa;
      null != b && (b.X = null);
      a.vb = null;
      x(null != a);
    }
    function Bc() {
      var a = new je();
      if (null == a) return null;
      a.a = 0;
      a.xb = Cc;
      gb("Predictor", "VP8LPredictors");
      gb("Predictor", "VP8LPredictors_C");
      gb("PredictorAdd", "VP8LPredictorsAdd");
      gb("PredictorAdd", "VP8LPredictorsAdd_C");
      pc = Kd;
      Fb = Ld;
      sc = Md;
      Gb = Nd;
      Hb = Od;
      xc = Pd;
      uc = Qd;
      self.VP8LMapColor32b = ke;
      self.VP8LMapColor8b = le;
      return a;
    }
    function rb(a, b, c, d, e) {
      var f = 1,
        g = [a],
        h = [b],
        k = d.m,
        l = d.s,
        m = null,
        n = 0;
      a: for (;;) {
        if (c)
          for (; f && D(k, 1); ) {
            var r = g,
              q = h,
              t = d,
              v = 1,
              p = t.m,
              u = t.gc[t.ab],
              w = D(p, 2);
            if (t.Oc & (1 << w)) f = 0;
            else {
              t.Oc |= 1 << w;
              u.hc = w;
              u.Ea = r[0];
              u.nc = q[0];
              u.K = [null];
              ++t.ab;
              x(4 >= t.ab);
              switch (w) {
                case 0:
                case 1:
                  u.b = D(p, 3) + 2;
                  v = rb(xa(u.Ea, u.b), xa(u.nc, u.b), 0, t, u.K);
                  u.K = u.K[0];
                  break;
                case 3:
                  var y = D(p, 8) + 1,
                    A = 16 < y ? 0 : 4 < y ? 1 : 2 < y ? 2 : 3;
                  r[0] = xa(u.Ea, A);
                  u.b = A;
                  var v = rb(y, 1, 0, t, u.K),
                    E;
                  if ((E = v)) {
                    var B,
                      C = y,
                      N = u,
                      z = 1 << (8 >> N.b),
                      Q = V(z);
                    if (null == Q) E = 0;
                    else {
                      var S = N.K[0],
                        K = N.w;
                      Q[0] = N.K[0][0];
                      for (B = 1; B < 1 * C; ++B) Q[B] = yb(S[K + B], Q[B - 1]);
                      for (; B < 4 * z; ++B) Q[B] = 0;
                      N.K[0] = null;
                      N.K[0] = Q;
                      E = 1;
                    }
                  }
                  v = E;
                  break;
                case 2:
                  break;
                default:
                  x(0);
              }
              f = v;
            }
          }
        g = g[0];
        h = h[0];
        if (f && D(k, 1) && ((n = D(k, 4)), (f = 1 <= n && 11 >= n), !f)) {
          d.a = 3;
          break a;
        }
        var H;
        if ((H = f))
          b: {
            var F = d,
              G = g,
              L = h,
              J = n,
              T = c,
              Da,
              ba,
              X = F.m,
              R = F.s,
              P = [null],
              U,
              W = 1,
              aa = 0,
              na = me[J];
            c: for (;;) {
              if (T && D(X, 1)) {
                var ca = D(X, 3) + 2,
                  ga = xa(G, ca),
                  ka = xa(L, ca),
                  qa = ga * ka;
                if (!rb(ga, ka, 0, F, P)) break c;
                P = P[0];
                R.xc = ca;
                for (Da = 0; Da < qa; ++Da) {
                  var ia = (P[Da] >> 8) & 65535;
                  P[Da] = ia;
                  ia >= W && (W = ia + 1);
                }
              }
              if (X.h) break c;
              for (ba = 0; 5 > ba; ++ba) {
                var Y = Dc[ba];
                !ba && 0 < J && (Y += 1 << J);
                aa < Y && (aa = Y);
              }
              var ma = wa(W * na, O);
              var ua = W,
                va = wa(ua, Ub);
              if (null == va) var la = null;
              else x(65536 >= ua), (la = va);
              var ha = V(aa);
              if (null == la || null == ha || null == ma) {
                F.a = 1;
                break c;
              }
              var pa = ma;
              for (Da = U = 0; Da < W; ++Da) {
                var ja = la[Da],
                  da = ja.G,
                  ea = ja.H,
                  Fa = 0,
                  ra = 1,
                  Ha = 0;
                for (ba = 0; 5 > ba; ++ba) {
                  Y = Dc[ba];
                  da[ba] = pa;
                  ea[ba] = U;
                  !ba && 0 < J && (Y += 1 << J);
                  d: {
                    var sa,
                      za = Y,
                      ta = F,
                      oa = ha,
                      db = pa,
                      eb = U,
                      Ia = 0,
                      Ka = ta.m,
                      fb = D(Ka, 1);
                    M(oa, 0, 0, za);
                    if (fb) {
                      var gb = D(Ka, 1) + 1,
                        hb = D(Ka, 1),
                        Ja = D(Ka, 0 == hb ? 1 : 8);
                      oa[Ja] = 1;
                      2 == gb && ((Ja = D(Ka, 8)), (oa[Ja] = 1));
                      var ya = 1;
                    } else {
                      var Ua = V(19),
                        Va = D(Ka, 4) + 4;
                      if (19 < Va) {
                        ta.a = 3;
                        var Aa = 0;
                        break d;
                      }
                      for (sa = 0; sa < Va; ++sa) Ua[ne[sa]] = D(Ka, 3);
                      var Ba = void 0,
                        sb = void 0,
                        Wa = ta,
                        ib = Ua,
                        Ca = za,
                        Xa = oa,
                        Oa = 0,
                        La = Wa.m,
                        Ya = 8,
                        Za = wa(128, O);
                      e: for (;;) {
                        if (!Z(Za, 0, 7, ib, 19)) break e;
                        if (D(La, 1)) {
                          var kb = 2 + 2 * D(La, 3),
                            Ba = 2 + D(La, kb);
                          if (Ba > Ca) break e;
                        } else Ba = Ca;
                        for (sb = 0; sb < Ca && Ba--; ) {
                          Sa(La);
                          var $a = Za[0 + (pb(La) & 127)];
                          qb(La, La.u + $a.g);
                          var jb = $a.value;
                          if (16 > jb) (Xa[sb++] = jb), 0 != jb && (Ya = jb);
                          else {
                            var lb = 16 == jb,
                              ab = jb - 16,
                              mb = oe[ab],
                              bb = D(La, pe[ab]) + mb;
                            if (sb + bb > Ca) break e;
                            else
                              for (var nb = lb ? Ya : 0; 0 < bb--; )
                                Xa[sb++] = nb;
                          }
                        }
                        Oa = 1;
                        break e;
                      }
                      Oa || (Wa.a = 3);
                      ya = Oa;
                    }
                    (ya = ya && !Ka.h) && (Ia = Z(db, eb, 8, oa, za));
                    ya && 0 != Ia ? (Aa = Ia) : ((ta.a = 3), (Aa = 0));
                  }
                  if (0 == Aa) break c;
                  ra && 1 == qe[ba] && (ra = 0 == pa[U].g);
                  Fa += pa[U].g;
                  U += Aa;
                  if (3 >= ba) {
                    var Pa = ha[0],
                      tb;
                    for (tb = 1; tb < Y; ++tb) ha[tb] > Pa && (Pa = ha[tb]);
                    Ha += Pa;
                  }
                }
                ja.nd = ra;
                ja.Qb = 0;
                ra &&
                  ((ja.qb =
                    ((da[3][ea[3] + 0].value << 24) |
                      (da[1][ea[1] + 0].value << 16) |
                      da[2][ea[2] + 0].value) >>>
                    0),
                  0 == Fa &&
                    256 > da[0][ea[0] + 0].value &&
                    ((ja.Qb = 1), (ja.qb += da[0][ea[0] + 0].value << 8)));
                ja.jc = !ja.Qb && 6 > Ha;
                if (ja.jc) {
                  var Ga,
                    Ea = ja;
                  for (Ga = 0; Ga < xb; ++Ga) {
                    var Ma = Ga,
                      Na = Ea.pd[Ma],
                      vb = Ea.G[0][Ea.H[0] + Ma];
                    256 <= vb.value
                      ? ((Na.g = vb.g + 256), (Na.value = vb.value))
                      : ((Na.g = 0),
                        (Na.value = 0),
                        (Ma >>= ub(vb, 8, Na)),
                        (Ma >>= ub(Ea.G[1][Ea.H[1] + Ma], 16, Na)),
                        (Ma >>= ub(Ea.G[2][Ea.H[2] + Ma], 0, Na)),
                        ub(Ea.G[3][Ea.H[3] + Ma], 24, Na));
                  }
                }
              }
              R.vc = P;
              R.Wb = W;
              R.Ya = la;
              R.yc = ma;
              H = 1;
              break b;
            }
            H = 0;
          }
        f = H;
        if (!f) {
          d.a = 3;
          break a;
        }
        if (0 < n) {
          if (((l.ua = 1 << n), !Zb(l.Wa, n))) {
            d.a = 1;
            f = 0;
            break a;
          }
        } else l.ua = 0;
        var Qa = d,
          cb = g,
          ob = h,
          Ra = Qa.s,
          Ta = Ra.xc;
        Qa.c = cb;
        Qa.i = ob;
        Ra.md = xa(cb, Ta);
        Ra.wc = 0 == Ta ? -1 : (1 << Ta) - 1;
        if (c) {
          d.xb = re;
          break a;
        }
        m = V(g * h);
        if (null == m) {
          d.a = 1;
          f = 0;
          break a;
        }
        f = (f = Jb(d, m, 0, g, h, h, null)) && !k.h;
        break a;
      }
      f
        ? (null != e ? (e[0] = m) : (x(null == m), x(c)), (d.$ = 0), c || Ac(l))
        : Ac(l);
      return f;
    }
    function Ec(a, b) {
      var c = a.c * a.i,
        d = c + b + 16 * b;
      x(a.c <= b);
      a.V = V(d);
      if (null == a.V) return (a.Ta = null), (a.Ua = 0), (a.a = 1), 0;
      a.Ta = a.V;
      a.Ua = a.Ba + c + b;
      return 1;
    }
    function se(a, b) {
      var c = a.C,
        d = b - c,
        e = a.V,
        f = a.Ba + a.c * c;
      for (x(b <= a.l.o); 0 < d; ) {
        var g = 16 < d ? 16 : d,
          h = a.l.ma,
          k = a.l.width,
          l = k * g,
          m = h.ca,
          n = h.tb + k * c,
          r = a.Ta,
          q = a.Ua;
        oc(a, g, e, f);
        Fc(r, q, m, n, l);
        zc(h, c, c + g, m, n, k);
        d -= g;
        e += g * a.c;
        c += g;
      }
      x(c == b);
      a.C = a.Ma = b;
    }
    function te(a, b) {
      var c = [0],
        d = [0],
        e = [0];
      a: for (;;) {
        if (null == a) return 0;
        if (null == b) return (a.a = 2), 0;
        a.l = b;
        a.a = 0;
        cb(a.m, b.data, b.w, b.ha);
        if (!mc(a.m, c, d, e)) {
          a.a = 3;
          break a;
        }
        a.xb = Cc;
        b.width = c[0];
        b.height = d[0];
        if (!rb(c[0], d[0], 1, a, null)) break a;
        return 1;
      }
      x(0 != a.a);
      return 0;
    }
    function ue() {
      this.ub = this.yd = this.td = this.Rb = 0;
    }
    function ve() {
      this.Kd = this.Ld = this.Ud = this.Td = this.i = this.c = 0;
    }
    function we() {
      this.Fb = this.Bb = this.Cb = 0;
      this.Zb = V(4);
      this.Lb = V(4);
    }
    function Gc() {
      this.Yb = wb();
    }
    function xe() {
      this.jb = V(3);
      this.Wc = Ed([4, 8], Gc);
      this.Xc = Ed([4, 17], Gc);
    }
    function ye() {
      this.Pc = this.wb = this.Tb = this.zd = 0;
      this.vd = new V(4);
      this.od = new V(4);
    }
    function Xa() {
      this.ld = this.La = this.dd = this.tc = 0;
    }
    function Hc() {
      this.Na = this.la = 0;
    }
    function ze() {
      this.Sc = [0, 0];
      this.Eb = [0, 0];
      this.Qc = [0, 0];
      this.ia = this.lc = 0;
    }
    function Kb() {
      this.ad = V(384);
      this.Za = 0;
      this.Ob = V(16);
      this.$b = this.Ad = this.ia = this.Gc = this.Hc = this.Dd = 0;
    }
    function Ae() {
      this.uc = this.M = this.Nb = 0;
      this.wa = Array(new Xa());
      this.Y = 0;
      this.ya = Array(new Kb());
      this.aa = 0;
      this.l = new Oa();
    }
    function Ic() {
      this.y = V(16);
      this.f = V(8);
      this.ea = V(8);
    }
    function Be() {
      this.cb = this.a = 0;
      this.sc = "";
      this.m = new Wb();
      this.Od = new ue();
      this.Kc = new ve();
      this.ed = new ye();
      this.Qa = new we();
      this.Ic = this.$c = this.Aa = 0;
      this.D = new Ae();
      this.Xb = this.Va = this.Hb = this.zb = this.yb = this.Ub = this.za = 0;
      this.Jc = wa(8, Wb);
      this.ia = 0;
      this.pb = wa(4, ze);
      this.Pa = new xe();
      this.Bd = this.kc = 0;
      this.Ac = [];
      this.Bc = 0;
      this.zc = [0, 0, 0, 0];
      this.Gd = Array(new Ic());
      this.Hd = 0;
      this.rb = Array(new Hc());
      this.sb = 0;
      this.wa = Array(new Xa());
      this.Y = 0;
      this.oc = [];
      this.pc = 0;
      this.sa = [];
      this.ta = 0;
      this.qa = [];
      this.ra = 0;
      this.Ha = [];
      this.B = this.R = this.Ia = 0;
      this.Ec = [];
      this.M = this.ja = this.Vb = this.Fc = 0;
      this.ya = Array(new Kb());
      this.L = this.aa = 0;
      this.gd = Ed([4, 2], Xa);
      this.ga = null;
      this.Fa = [];
      this.Cc = this.qc = this.P = 0;
      this.Gb = [];
      this.Uc = 0;
      this.mb = [];
      this.nb = 0;
      this.rc = [];
      this.Ga = this.Vc = 0;
    }
    function ga(a, b) {
      return 0 > a ? 0 : a > b ? b : a;
    }
    function Oa() {
      this.T = this.U = this.ka = this.height = this.width = 0;
      this.y = [];
      this.f = [];
      this.ea = [];
      this.Rc = this.fa = this.W = this.N = this.O = 0;
      this.ma = "void";
      this.put = "VP8IoPutHook";
      this.ac = "VP8IoSetupHook";
      this.bc = "VP8IoTeardownHook";
      this.ha = this.Kb = 0;
      this.data = [];
      this.hb = this.ib = this.da = this.o = this.j = this.va = this.v = this.Da = this.ob = this.w = 0;
      this.F = [];
      this.J = 0;
    }
    function Ce() {
      var a = new Be();
      null != a &&
        ((a.a = 0), (a.sc = "OK"), (a.cb = 0), (a.Xb = 0), oa || (oa = De));
      return a;
    }
    function T(a, b, c) {
      0 == a.a && ((a.a = b), (a.sc = c), (a.cb = 0));
      return 0;
    }
    function Jc(a, b, c) {
      return 3 <= c && 157 == a[b + 0] && 1 == a[b + 1] && 42 == a[b + 2];
    }
    function Kc(a, b) {
      if (null == a) return 0;
      a.a = 0;
      a.sc = "OK";
      if (null == b) return T(a, 2, "null VP8Io passed to VP8GetHeaders()");
      var c = b.data;
      var d = b.w;
      var e = b.ha;
      if (4 > e) return T(a, 7, "Truncated header.");
      var f = c[d + 0] | (c[d + 1] << 8) | (c[d + 2] << 16);
      var g = a.Od;
      g.Rb = !(f & 1);
      g.td = (f >> 1) & 7;
      g.yd = (f >> 4) & 1;
      g.ub = f >> 5;
      if (3 < g.td) return T(a, 3, "Incorrect keyframe parameters.");
      if (!g.yd) return T(a, 4, "Frame not displayable.");
      d += 3;
      e -= 3;
      var h = a.Kc;
      if (g.Rb) {
        if (7 > e) return T(a, 7, "cannot parse picture header");
        if (!Jc(c, d, e)) return T(a, 3, "Bad code word");
        h.c = ((c[d + 4] << 8) | c[d + 3]) & 16383;
        h.Td = c[d + 4] >> 6;
        h.i = ((c[d + 6] << 8) | c[d + 5]) & 16383;
        h.Ud = c[d + 6] >> 6;
        d += 7;
        e -= 7;
        a.za = (h.c + 15) >> 4;
        a.Ub = (h.i + 15) >> 4;
        b.width = h.c;
        b.height = h.i;
        b.Da = 0;
        b.j = 0;
        b.v = 0;
        b.va = b.width;
        b.o = b.height;
        b.da = 0;
        b.ib = b.width;
        b.hb = b.height;
        b.U = b.width;
        b.T = b.height;
        f = a.Pa;
        M(f.jb, 0, 255, f.jb.length);
        f = a.Qa;
        x(null != f);
        f.Cb = 0;
        f.Bb = 0;
        f.Fb = 1;
        M(f.Zb, 0, 0, f.Zb.length);
        M(f.Lb, 0, 0, f.Lb);
      }
      if (g.ub > e) return T(a, 7, "bad partition length");
      f = a.m;
      ma(f, c, d, g.ub);
      d += g.ub;
      e -= g.ub;
      g.Rb && ((h.Ld = G(f)), (h.Kd = G(f)));
      h = a.Qa;
      var k = a.Pa,
        l;
      x(null != f);
      x(null != h);
      h.Cb = G(f);
      if (h.Cb) {
        h.Bb = G(f);
        if (G(f)) {
          h.Fb = G(f);
          for (l = 0; 4 > l; ++l) h.Zb[l] = G(f) ? ca(f, 7) : 0;
          for (l = 0; 4 > l; ++l) h.Lb[l] = G(f) ? ca(f, 6) : 0;
        }
        if (h.Bb) for (l = 0; 3 > l; ++l) k.jb[l] = G(f) ? na(f, 8) : 255;
      } else h.Bb = 0;
      if (f.Ka) return T(a, 3, "cannot parse segment header");
      h = a.ed;
      h.zd = G(f);
      h.Tb = na(f, 6);
      h.wb = na(f, 3);
      h.Pc = G(f);
      if (h.Pc && G(f)) {
        for (k = 0; 4 > k; ++k) G(f) && (h.vd[k] = ca(f, 6));
        for (k = 0; 4 > k; ++k) G(f) && (h.od[k] = ca(f, 6));
      }
      a.L = 0 == h.Tb ? 0 : h.zd ? 1 : 2;
      if (f.Ka) return T(a, 3, "cannot parse filter header");
      l = d;
      var m = e;
      e = l;
      d = l + m;
      h = m;
      a.Xb = (1 << na(a.m, 2)) - 1;
      k = a.Xb;
      if (m < 3 * k) c = 7;
      else {
        l += 3 * k;
        h -= 3 * k;
        for (m = 0; m < k; ++m) {
          var n = c[e + 0] | (c[e + 1] << 8) | (c[e + 2] << 16);
          n > h && (n = h);
          ma(a.Jc[+m], c, l, n);
          l += n;
          h -= n;
          e += 3;
        }
        ma(a.Jc[+k], c, l, h);
        c = l < d ? 0 : 5;
      }
      if (0 != c) return T(a, c, "cannot parse partitions");
      l = a.m;
      c = na(l, 7);
      e = G(l) ? ca(l, 4) : 0;
      d = G(l) ? ca(l, 4) : 0;
      h = G(l) ? ca(l, 4) : 0;
      k = G(l) ? ca(l, 4) : 0;
      l = G(l) ? ca(l, 4) : 0;
      m = a.Qa;
      for (n = 0; 4 > n; ++n) {
        if (m.Cb) {
          var r = m.Zb[n];
          m.Fb || (r += c);
        } else if (0 < n) {
          a.pb[n] = a.pb[0];
          continue;
        } else r = c;
        var q = a.pb[n];
        q.Sc[0] = Lb[ga(r + e, 127)];
        q.Sc[1] = Mb[ga(r + 0, 127)];
        q.Eb[0] = 2 * Lb[ga(r + d, 127)];
        q.Eb[1] = (101581 * Mb[ga(r + h, 127)]) >> 16;
        8 > q.Eb[1] && (q.Eb[1] = 8);
        q.Qc[0] = Lb[ga(r + k, 117)];
        q.Qc[1] = Mb[ga(r + l, 127)];
        q.lc = r + l;
      }
      if (!g.Rb) return T(a, 4, "Not a key frame.");
      G(f);
      g = a.Pa;
      for (c = 0; 4 > c; ++c) {
        for (e = 0; 8 > e; ++e)
          for (d = 0; 3 > d; ++d)
            for (h = 0; 11 > h; ++h)
              (k = K(f, Ee[c][e][d][h]) ? na(f, 8) : Fe[c][e][d][h]),
                (g.Wc[c][e].Yb[d][h] = k);
        for (e = 0; 17 > e; ++e) g.Xc[c][e] = g.Wc[c][Ge[e]];
      }
      a.kc = G(f);
      a.kc && (a.Bd = na(f, 8));
      return (a.cb = 1);
    }
    function De(a, b, c, d, e, f, g) {
      var h = b[e].Yb[c];
      for (c = 0; 16 > e; ++e) {
        if (!K(a, h[c + 0])) return e;
        for (; !K(a, h[c + 1]); )
          if (((h = b[++e].Yb[0]), (c = 0), 16 == e)) return 16;
        var k = b[e + 1].Yb;
        if (K(a, h[c + 2])) {
          var l = a,
            m = h,
            n = c;
          var r = 0;
          if (K(l, m[n + 3]))
            if (K(l, m[n + 6])) {
              h = 0;
              r = K(l, m[n + 8]);
              m = K(l, m[n + 9 + r]);
              n = 2 * r + m;
              r = 0;
              for (m = He[n]; m[h]; ++h) r += r + K(l, m[h]);
              r += 3 + (8 << n);
            } else
              K(l, m[n + 7])
                ? ((r = 7 + 2 * K(l, 165)), (r += K(l, 145)))
                : (r = 5 + K(l, 159));
          else K(l, m[n + 4]) ? (r = 3 + K(l, m[n + 5])) : (r = 2);
          h = k[2];
        } else (r = 1), (h = k[1]);
        k = g + Ie[e];
        l = a;
        0 > l.b && Qa(l);
        var m = l.b,
          n = l.Ca >> 1,
          q = (n - (l.I >> m)) >> 31;
        --l.b;
        l.Ca += q;
        l.Ca |= 1;
        l.I -= ((n + 1) & q) << m;
        f[k] = ((r ^ q) - q) * d[(0 < e) + 0];
      }
      return 16;
    }
    function Lc(a) {
      var b = a.rb[a.sb - 1];
      b.la = 0;
      b.Na = 0;
      M(a.zc, 0, 0, a.zc.length);
      a.ja = 0;
    }
    function Je(a, b) {
      for (a.M = 0; a.M < a.Va; ++a.M) {
        var c = a.Jc[a.M & a.Xb],
          d = a.m,
          e = a,
          f;
        for (f = 0; f < e.za; ++f) {
          var g = d;
          var h = e;
          var k = h.Ac,
            l = h.Bc + 4 * f,
            m = h.zc,
            n = h.ya[h.aa + f];
          h.Qa.Bb
            ? (n.$b = K(g, h.Pa.jb[0])
                ? 2 + K(g, h.Pa.jb[2])
                : K(g, h.Pa.jb[1]))
            : (n.$b = 0);
          h.kc && (n.Ad = K(g, h.Bd));
          n.Za = !K(g, 145) + 0;
          if (n.Za) {
            var r = n.Ob,
              q = 0;
            for (h = 0; 4 > h; ++h) {
              var t = m[0 + h];
              var v;
              for (v = 0; 4 > v; ++v) {
                t = Ke[k[l + v]][t];
                for (var p = Mc[K(g, t[0])]; 0 < p; )
                  p = Mc[2 * p + K(g, t[p])];
                t = -p;
                k[l + v] = t;
              }
              I(r, q, k, l, 4);
              q += 4;
              m[0 + h] = t;
            }
          } else
            (t = K(g, 156) ? (K(g, 128) ? 1 : 3) : K(g, 163) ? 2 : 0),
              (n.Ob[0] = t),
              M(k, l, t, 4),
              M(m, 0, t, 4);
          n.Dd = K(g, 142) ? (K(g, 114) ? (K(g, 183) ? 1 : 3) : 2) : 0;
        }
        if (e.m.Ka) return T(a, 7, "Premature end-of-partition0 encountered.");
        for (; a.ja < a.za; ++a.ja) {
          d = a;
          e = c;
          g = d.rb[d.sb - 1];
          k = d.rb[d.sb + d.ja];
          f = d.ya[d.aa + d.ja];
          if ((l = d.kc ? f.Ad : 0))
            (g.la = k.la = 0),
              f.Za || (g.Na = k.Na = 0),
              (f.Hc = 0),
              (f.Gc = 0),
              (f.ia = 0);
          else {
            var u,
              w,
              g = k,
              k = e,
              l = d.Pa.Xc,
              m = d.ya[d.aa + d.ja],
              n = d.pb[m.$b];
            h = m.ad;
            r = 0;
            q = d.rb[d.sb - 1];
            t = v = 0;
            M(h, r, 0, 384);
            if (m.Za) {
              var y = 0;
              var A = l[3];
            } else {
              p = V(16);
              var E = g.Na + q.Na;
              E = oa(k, l[1], E, n.Eb, 0, p, 0);
              g.Na = q.Na = (0 < E) + 0;
              if (1 < E) Nc(p, 0, h, r);
              else {
                var B = (p[0] + 3) >> 3;
                for (p = 0; 256 > p; p += 16) h[r + p] = B;
              }
              y = 1;
              A = l[0];
            }
            var C = g.la & 15;
            var N = q.la & 15;
            for (p = 0; 4 > p; ++p) {
              var z = N & 1;
              for (B = w = 0; 4 > B; ++B)
                (E = z + (C & 1)),
                  (E = oa(k, A, E, n.Sc, y, h, r)),
                  (z = E > y),
                  (C = (C >> 1) | (z << 7)),
                  (w = (w << 2) | (3 < E ? 3 : 1 < E ? 2 : 0 != h[r + 0])),
                  (r += 16);
              C >>= 4;
              N = (N >> 1) | (z << 7);
              v = ((v << 8) | w) >>> 0;
            }
            A = C;
            y = N >> 4;
            for (u = 0; 4 > u; u += 2) {
              w = 0;
              C = g.la >> (4 + u);
              N = q.la >> (4 + u);
              for (p = 0; 2 > p; ++p) {
                z = N & 1;
                for (B = 0; 2 > B; ++B)
                  (E = z + (C & 1)),
                    (E = oa(k, l[2], E, n.Qc, 0, h, r)),
                    (z = 0 < E),
                    (C = (C >> 1) | (z << 3)),
                    (w = (w << 2) | (3 < E ? 3 : 1 < E ? 2 : 0 != h[r + 0])),
                    (r += 16);
                C >>= 2;
                N = (N >> 1) | (z << 5);
              }
              t |= w << (4 * u);
              A |= (C << 4) << u;
              y |= (N & 240) << u;
            }
            g.la = A;
            q.la = y;
            m.Hc = v;
            m.Gc = t;
            m.ia = t & 43690 ? 0 : n.ia;
            l = !(v | t);
          }
          0 < d.L &&
            ((d.wa[d.Y + d.ja] = d.gd[f.$b][f.Za]),
            (d.wa[d.Y + d.ja].La |= !l));
          if (e.Ka) return T(a, 7, "Premature end-of-file encountered.");
        }
        Lc(a);
        c = a;
        d = b;
        e = 1;
        f = c.D;
        g = 0 < c.L && c.M >= c.zb && c.M <= c.Va;
        if (0 == c.Aa)
          a: {
            (f.M = c.M), (f.uc = g), Oc(c, f), (e = 1);
            w = c.D;
            f = w.Nb;
            t = Ya[c.L];
            g = t * c.R;
            k = (t / 2) * c.B;
            p = 16 * f * c.R;
            B = 8 * f * c.B;
            l = c.sa;
            m = c.ta - g + p;
            n = c.qa;
            h = c.ra - k + B;
            r = c.Ha;
            q = c.Ia - k + B;
            C = w.M;
            N = 0 == C;
            v = C >= c.Va - 1;
            2 == c.Aa && Oc(c, w);
            if (w.uc)
              for (E = c, z = E.D.M, x(E.D.uc), w = E.yb; w < E.Hb; ++w) {
                var Q = E;
                y = w;
                A = z;
                var S = Q.D,
                  D = S.Nb;
                u = Q.R;
                var S = S.wa[S.Y + y],
                  F = Q.sa,
                  H = Q.ta + 16 * D * u + 16 * y,
                  J = S.dd,
                  G = S.tc;
                if (0 != G)
                  if ((x(3 <= G), 1 == Q.L))
                    0 < y && Pc(F, H, u, G + 4),
                      S.La && Qc(F, H, u, G),
                      0 < A && Rc(F, H, u, G + 4),
                      S.La && Sc(F, H, u, G);
                  else {
                    var L = Q.B,
                      O = Q.qa,
                      P = Q.ra + 8 * D * L + 8 * y,
                      R = Q.Ha,
                      Q = Q.Ia + 8 * D * L + 8 * y,
                      D = S.ld;
                    0 < y &&
                      (Tc(F, H, u, G + 4, J, D),
                      Uc(O, P, R, Q, L, G + 4, J, D));
                    S.La && (Vc(F, H, u, G, J, D), Wc(O, P, R, Q, L, G, J, D));
                    0 < A &&
                      (Xc(F, H, u, G + 4, J, D),
                      Yc(O, P, R, Q, L, G + 4, J, D));
                    S.La && (Zc(F, H, u, G, J, D), $c(O, P, R, Q, L, G, J, D));
                  }
              }
            c.ia && alert("todo:DitherRow");
            if (null != d.put) {
              w = 16 * C;
              C = 16 * (C + 1);
              N
                ? ((d.y = c.sa),
                  (d.O = c.ta + p),
                  (d.f = c.qa),
                  (d.N = c.ra + B),
                  (d.ea = c.Ha),
                  (d.W = c.Ia + B))
                : ((w -= t),
                  (d.y = l),
                  (d.O = m),
                  (d.f = n),
                  (d.N = h),
                  (d.ea = r),
                  (d.W = q));
              v || (C -= t);
              C > d.o && (C = d.o);
              d.F = null;
              d.J = null;
              if (
                null != c.Fa &&
                0 < c.Fa.length &&
                w < C &&
                ((d.J = Le(c, d, w, C - w)),
                (d.F = c.mb),
                null == d.F && 0 == d.F.length)
              ) {
                e = T(c, 3, "Could not decode alpha data.");
                break a;
              }
              w < d.j &&
                ((t = d.j - w),
                (w = d.j),
                x(!(t & 1)),
                (d.O += c.R * t),
                (d.N += c.B * (t >> 1)),
                (d.W += c.B * (t >> 1)),
                null != d.F && (d.J += d.width * t));
              w < C &&
                ((d.O += d.v),
                (d.N += d.v >> 1),
                (d.W += d.v >> 1),
                null != d.F && (d.J += d.v),
                (d.ka = w - d.j),
                (d.U = d.va - d.v),
                (d.T = C - w),
                (e = d.put(d)));
            }
            f + 1 != c.Ic ||
              v ||
              (I(c.sa, c.ta - g, l, m + 16 * c.R, g),
              I(c.qa, c.ra - k, n, h + 8 * c.B, k),
              I(c.Ha, c.Ia - k, r, q + 8 * c.B, k));
          }
        if (!e) return T(a, 6, "Output aborted.");
      }
      return 1;
    }
    function Me(a, b) {
      if (null == a) return 0;
      if (null == b) return T(a, 2, "NULL VP8Io parameter in VP8Decode().");
      if (!a.cb && !Kc(a, b)) return 0;
      x(a.cb);
      if (null == b.ac || b.ac(b)) {
        b.ob && (a.L = 0);
        var c = Ya[a.L];
        2 == a.L
          ? ((a.yb = 0), (a.zb = 0))
          : ((a.yb = (b.v - c) >> 4),
            (a.zb = (b.j - c) >> 4),
            0 > a.yb && (a.yb = 0),
            0 > a.zb && (a.zb = 0));
        a.Va = (b.o + 15 + c) >> 4;
        a.Hb = (b.va + 15 + c) >> 4;
        a.Hb > a.za && (a.Hb = a.za);
        a.Va > a.Ub && (a.Va = a.Ub);
        if (0 < a.L) {
          var d = a.ed;
          for (c = 0; 4 > c; ++c) {
            var e;
            if (a.Qa.Cb) {
              var f = a.Qa.Lb[c];
              a.Qa.Fb || (f += d.Tb);
            } else f = d.Tb;
            for (e = 0; 1 >= e; ++e) {
              var g = a.gd[c][e],
                h = f;
              d.Pc && ((h += d.vd[0]), e && (h += d.od[0]));
              h = 0 > h ? 0 : 63 < h ? 63 : h;
              if (0 < h) {
                var k = h;
                0 < d.wb &&
                  ((k = 4 < d.wb ? k >> 2 : k >> 1),
                  k > 9 - d.wb && (k = 9 - d.wb));
                1 > k && (k = 1);
                g.dd = k;
                g.tc = 2 * h + k;
                g.ld = 40 <= h ? 2 : 15 <= h ? 1 : 0;
              } else g.tc = 0;
              g.La = e;
            }
          }
        }
        c = 0;
      } else T(a, 6, "Frame setup failed"), (c = a.a);
      if ((c = 0 == c)) {
        if (c) {
          a.$c = 0;
          0 < a.Aa || (a.Ic = Ne);
          b: {
            c = a.Ic;
            var k = a.za,
              d = 4 * k,
              l = 32 * k,
              m = k + 1,
              n = 0 < a.L ? k * (0 < a.Aa ? 2 : 1) : 0,
              r = (2 == a.Aa ? 2 : 1) * k;
            e = ((3 * (16 * c + Ya[a.L])) / 2) * l;
            f = null != a.Fa && 0 < a.Fa.length ? a.Kc.c * a.Kc.i : 0;
            g = d + 832 + e + f;
            if (g != g) c = 0;
            else {
              if (g > a.Vb) {
                a.Vb = 0;
                a.Ec = V(g);
                a.Fc = 0;
                if (null == a.Ec) {
                  c = T(a, 1, "no memory during frame initialization.");
                  break b;
                }
                a.Vb = g;
              }
              g = a.Ec;
              h = a.Fc;
              a.Ac = g;
              a.Bc = h;
              h += d;
              a.Gd = wa(l, Ic);
              a.Hd = 0;
              a.rb = wa(m + 1, Hc);
              a.sb = 1;
              a.wa = n ? wa(n, Xa) : null;
              a.Y = 0;
              a.D.Nb = 0;
              a.D.wa = a.wa;
              a.D.Y = a.Y;
              0 < a.Aa && (a.D.Y += k);
              x(!0);
              a.oc = g;
              a.pc = h;
              h += 832;
              a.ya = wa(r, Kb);
              a.aa = 0;
              a.D.ya = a.ya;
              a.D.aa = a.aa;
              2 == a.Aa && (a.D.aa += k);
              a.R = 16 * k;
              a.B = 8 * k;
              l = Ya[a.L];
              k = l * a.R;
              l = (l / 2) * a.B;
              a.sa = g;
              a.ta = h + k;
              a.qa = a.sa;
              a.ra = a.ta + 16 * c * a.R + l;
              a.Ha = a.qa;
              a.Ia = a.ra + 8 * c * a.B + l;
              a.$c = 0;
              h += e;
              a.mb = f ? g : null;
              a.nb = f ? h : null;
              x(h + f <= a.Fc + a.Vb);
              Lc(a);
              M(a.Ac, a.Bc, 0, d);
              c = 1;
            }
          }
          if (c) {
            b.ka = 0;
            b.y = a.sa;
            b.O = a.ta;
            b.f = a.qa;
            b.N = a.ra;
            b.ea = a.Ha;
            b.Vd = a.Ia;
            b.fa = a.R;
            b.Rc = a.B;
            b.F = null;
            b.J = 0;
            if (!ad) {
              for (c = -255; 255 >= c; ++c) bd[255 + c] = 0 > c ? -c : c;
              for (c = -1020; 1020 >= c; ++c)
                cd[1020 + c] = -128 > c ? -128 : 127 < c ? 127 : c;
              for (c = -112; 112 >= c; ++c)
                dd[112 + c] = -16 > c ? -16 : 15 < c ? 15 : c;
              for (c = -255; 510 >= c; ++c)
                ed[255 + c] = 0 > c ? 0 : 255 < c ? 255 : c;
              ad = 1;
            }
            Nc = Oe;
            Za = Pe;
            Nb = Qe;
            pa = Re;
            Ob = Se;
            fd = Te;
            Xc = Ue;
            Tc = Ve;
            Yc = We;
            Uc = Xe;
            Zc = Ye;
            Vc = Ze;
            $c = $e;
            Wc = af;
            Rc = gd;
            Pc = hd;
            Sc = bf;
            Qc = cf;
            W[0] = df;
            W[1] = ef;
            W[2] = ff;
            W[3] = gf;
            W[4] = hf;
            W[5] = jf;
            W[6] = kf;
            W[7] = lf;
            W[8] = mf;
            W[9] = nf;
            Y[0] = of;
            Y[1] = pf;
            Y[2] = qf;
            Y[3] = rf;
            Y[4] = sf;
            Y[5] = tf;
            Y[6] = uf;
            ka[0] = vf;
            ka[1] = wf;
            ka[2] = xf;
            ka[3] = yf;
            ka[4] = zf;
            ka[5] = Af;
            ka[6] = Bf;
            c = 1;
          } else c = 0;
        }
        c && (c = Je(a, b));
        null != b.bc && b.bc(b);
        c &= 1;
      }
      if (!c) return 0;
      a.cb = 0;
      return c;
    }
    function qa(a, b, c, d, e) {
      e = a[b + c + 32 * d] + (e >> 3);
      a[b + c + 32 * d] = e & -256 ? (0 > e ? 0 : 255) : e;
    }
    function kb(a, b, c, d, e, f) {
      qa(a, b, 0, c, d + e);
      qa(a, b, 1, c, d + f);
      qa(a, b, 2, c, d - f);
      qa(a, b, 3, c, d - e);
    }
    function da(a) {
      return ((20091 * a) >> 16) + a;
    }
    function id(a, b, c, d) {
      var e = 0,
        f;
      var g = V(16);
      for (f = 0; 4 > f; ++f) {
        var h = a[b + 0] + a[b + 8];
        var k = a[b + 0] - a[b + 8];
        var l = ((35468 * a[b + 4]) >> 16) - da(a[b + 12]);
        var m = da(a[b + 4]) + ((35468 * a[b + 12]) >> 16);
        g[e + 0] = h + m;
        g[e + 1] = k + l;
        g[e + 2] = k - l;
        g[e + 3] = h - m;
        e += 4;
        b++;
      }
      for (f = e = 0; 4 > f; ++f)
        (a = g[e + 0] + 4),
          (h = a + g[e + 8]),
          (k = a - g[e + 8]),
          (l = ((35468 * g[e + 4]) >> 16) - da(g[e + 12])),
          (m = da(g[e + 4]) + ((35468 * g[e + 12]) >> 16)),
          qa(c, d, 0, 0, h + m),
          qa(c, d, 1, 0, k + l),
          qa(c, d, 2, 0, k - l),
          qa(c, d, 3, 0, h - m),
          e++,
          (d += 32);
    }
    function Te(a, b, c, d) {
      var e = a[b + 0] + 4,
        f = (35468 * a[b + 4]) >> 16,
        g = da(a[b + 4]),
        h = (35468 * a[b + 1]) >> 16;
      a = da(a[b + 1]);
      kb(c, d, 0, e + g, a, h);
      kb(c, d, 1, e + f, a, h);
      kb(c, d, 2, e - f, a, h);
      kb(c, d, 3, e - g, a, h);
    }
    function Pe(a, b, c, d, e) {
      id(a, b, c, d);
      e && id(a, b + 16, c, d + 4);
    }
    function Qe(a, b, c, d) {
      Za(a, b + 0, c, d, 1);
      Za(a, b + 32, c, d + 128, 1);
    }
    function Re(a, b, c, d) {
      a = a[b + 0] + 4;
      var e;
      for (e = 0; 4 > e; ++e) for (b = 0; 4 > b; ++b) qa(c, d, b, e, a);
    }
    function Se(a, b, c, d) {
      a[b + 0] && pa(a, b + 0, c, d);
      a[b + 16] && pa(a, b + 16, c, d + 4);
      a[b + 32] && pa(a, b + 32, c, d + 128);
      a[b + 48] && pa(a, b + 48, c, d + 128 + 4);
    }
    function Oe(a, b, c, d) {
      var e = V(16),
        f;
      for (f = 0; 4 > f; ++f) {
        var g = a[b + 0 + f] + a[b + 12 + f];
        var h = a[b + 4 + f] + a[b + 8 + f];
        var k = a[b + 4 + f] - a[b + 8 + f];
        var l = a[b + 0 + f] - a[b + 12 + f];
        e[0 + f] = g + h;
        e[8 + f] = g - h;
        e[4 + f] = l + k;
        e[12 + f] = l - k;
      }
      for (f = 0; 4 > f; ++f)
        (a = e[0 + 4 * f] + 3),
          (g = a + e[3 + 4 * f]),
          (h = e[1 + 4 * f] + e[2 + 4 * f]),
          (k = e[1 + 4 * f] - e[2 + 4 * f]),
          (l = a - e[3 + 4 * f]),
          (c[d + 0] = (g + h) >> 3),
          (c[d + 16] = (l + k) >> 3),
          (c[d + 32] = (g - h) >> 3),
          (c[d + 48] = (l - k) >> 3),
          (d += 64);
    }
    function Pb(a, b, c) {
      var d = b - 32,
        e = R,
        f = 255 - a[d - 1],
        g;
      for (g = 0; g < c; ++g) {
        var h = e,
          k = f + a[b - 1],
          l;
        for (l = 0; l < c; ++l) a[b + l] = h[k + a[d + l]];
        b += 32;
      }
    }
    function ef(a, b) {
      Pb(a, b, 4);
    }
    function wf(a, b) {
      Pb(a, b, 8);
    }
    function pf(a, b) {
      Pb(a, b, 16);
    }
    function qf(a, b) {
      var c;
      for (c = 0; 16 > c; ++c) I(a, b + 32 * c, a, b - 32, 16);
    }
    function rf(a, b) {
      var c;
      for (c = 16; 0 < c; --c) M(a, b, a[b - 1], 16), (b += 32);
    }
    function $a(a, b, c) {
      var d;
      for (d = 0; 16 > d; ++d) M(b, c + 32 * d, a, 16);
    }
    function of(a, b) {
      var c = 16,
        d;
      for (d = 0; 16 > d; ++d) c += a[b - 1 + 32 * d] + a[b + d - 32];
      $a(c >> 5, a, b);
    }
    function sf(a, b) {
      var c = 8,
        d;
      for (d = 0; 16 > d; ++d) c += a[b - 1 + 32 * d];
      $a(c >> 4, a, b);
    }
    function tf(a, b) {
      var c = 8,
        d;
      for (d = 0; 16 > d; ++d) c += a[b + d - 32];
      $a(c >> 4, a, b);
    }
    function uf(a, b) {
      $a(128, a, b);
    }
    function z(a, b, c) {
      return (a + 2 * b + c + 2) >> 2;
    }
    function ff(a, b) {
      var c = b - 32,
        c = new Uint8Array([
          z(a[c - 1], a[c + 0], a[c + 1]),
          z(a[c + 0], a[c + 1], a[c + 2]),
          z(a[c + 1], a[c + 2], a[c + 3]),
          z(a[c + 2], a[c + 3], a[c + 4])
        ]),
        d;
      for (d = 0; 4 > d; ++d) I(a, b + 32 * d, c, 0, c.length);
    }
    function gf(a, b) {
      var c = a[b - 1],
        d = a[b - 1 + 32],
        e = a[b - 1 + 64],
        f = a[b - 1 + 96];
      ra(a, b + 0, 16843009 * z(a[b - 1 - 32], c, d));
      ra(a, b + 32, 16843009 * z(c, d, e));
      ra(a, b + 64, 16843009 * z(d, e, f));
      ra(a, b + 96, 16843009 * z(e, f, f));
    }
    function df(a, b) {
      var c = 4,
        d;
      for (d = 0; 4 > d; ++d) c += a[b + d - 32] + a[b - 1 + 32 * d];
      c >>= 3;
      for (d = 0; 4 > d; ++d) M(a, b + 32 * d, c, 4);
    }
    function hf(a, b) {
      var c = a[b - 1 + 0],
        d = a[b - 1 + 32],
        e = a[b - 1 + 64],
        f = a[b - 1 - 32],
        g = a[b + 0 - 32],
        h = a[b + 1 - 32],
        k = a[b + 2 - 32],
        l = a[b + 3 - 32];
      a[b + 0 + 96] = z(d, e, a[b - 1 + 96]);
      a[b + 1 + 96] = a[b + 0 + 64] = z(c, d, e);
      a[b + 2 + 96] = a[b + 1 + 64] = a[b + 0 + 32] = z(f, c, d);
      a[b + 3 + 96] = a[b + 2 + 64] = a[b + 1 + 32] = a[b + 0 + 0] = z(g, f, c);
      a[b + 3 + 64] = a[b + 2 + 32] = a[b + 1 + 0] = z(h, g, f);
      a[b + 3 + 32] = a[b + 2 + 0] = z(k, h, g);
      a[b + 3 + 0] = z(l, k, h);
    }
    function kf(a, b) {
      var c = a[b + 1 - 32],
        d = a[b + 2 - 32],
        e = a[b + 3 - 32],
        f = a[b + 4 - 32],
        g = a[b + 5 - 32],
        h = a[b + 6 - 32],
        k = a[b + 7 - 32];
      a[b + 0 + 0] = z(a[b + 0 - 32], c, d);
      a[b + 1 + 0] = a[b + 0 + 32] = z(c, d, e);
      a[b + 2 + 0] = a[b + 1 + 32] = a[b + 0 + 64] = z(d, e, f);
      a[b + 3 + 0] = a[b + 2 + 32] = a[b + 1 + 64] = a[b + 0 + 96] = z(e, f, g);
      a[b + 3 + 32] = a[b + 2 + 64] = a[b + 1 + 96] = z(f, g, h);
      a[b + 3 + 64] = a[b + 2 + 96] = z(g, h, k);
      a[b + 3 + 96] = z(h, k, k);
    }
    function jf(a, b) {
      var c = a[b - 1 + 0],
        d = a[b - 1 + 32],
        e = a[b - 1 + 64],
        f = a[b - 1 - 32],
        g = a[b + 0 - 32],
        h = a[b + 1 - 32],
        k = a[b + 2 - 32],
        l = a[b + 3 - 32];
      a[b + 0 + 0] = a[b + 1 + 64] = (f + g + 1) >> 1;
      a[b + 1 + 0] = a[b + 2 + 64] = (g + h + 1) >> 1;
      a[b + 2 + 0] = a[b + 3 + 64] = (h + k + 1) >> 1;
      a[b + 3 + 0] = (k + l + 1) >> 1;
      a[b + 0 + 96] = z(e, d, c);
      a[b + 0 + 64] = z(d, c, f);
      a[b + 0 + 32] = a[b + 1 + 96] = z(c, f, g);
      a[b + 1 + 32] = a[b + 2 + 96] = z(f, g, h);
      a[b + 2 + 32] = a[b + 3 + 96] = z(g, h, k);
      a[b + 3 + 32] = z(h, k, l);
    }
    function lf(a, b) {
      var c = a[b + 0 - 32],
        d = a[b + 1 - 32],
        e = a[b + 2 - 32],
        f = a[b + 3 - 32],
        g = a[b + 4 - 32],
        h = a[b + 5 - 32],
        k = a[b + 6 - 32],
        l = a[b + 7 - 32];
      a[b + 0 + 0] = (c + d + 1) >> 1;
      a[b + 1 + 0] = a[b + 0 + 64] = (d + e + 1) >> 1;
      a[b + 2 + 0] = a[b + 1 + 64] = (e + f + 1) >> 1;
      a[b + 3 + 0] = a[b + 2 + 64] = (f + g + 1) >> 1;
      a[b + 0 + 32] = z(c, d, e);
      a[b + 1 + 32] = a[b + 0 + 96] = z(d, e, f);
      a[b + 2 + 32] = a[b + 1 + 96] = z(e, f, g);
      a[b + 3 + 32] = a[b + 2 + 96] = z(f, g, h);
      a[b + 3 + 64] = z(g, h, k);
      a[b + 3 + 96] = z(h, k, l);
    }
    function nf(a, b) {
      var c = a[b - 1 + 0],
        d = a[b - 1 + 32],
        e = a[b - 1 + 64],
        f = a[b - 1 + 96];
      a[b + 0 + 0] = (c + d + 1) >> 1;
      a[b + 2 + 0] = a[b + 0 + 32] = (d + e + 1) >> 1;
      a[b + 2 + 32] = a[b + 0 + 64] = (e + f + 1) >> 1;
      a[b + 1 + 0] = z(c, d, e);
      a[b + 3 + 0] = a[b + 1 + 32] = z(d, e, f);
      a[b + 3 + 32] = a[b + 1 + 64] = z(e, f, f);
      a[b + 3 + 64] = a[b + 2 + 64] = a[b + 0 + 96] = a[b + 1 + 96] = a[
        b + 2 + 96
      ] = a[b + 3 + 96] = f;
    }
    function mf(a, b) {
      var c = a[b - 1 + 0],
        d = a[b - 1 + 32],
        e = a[b - 1 + 64],
        f = a[b - 1 + 96],
        g = a[b - 1 - 32],
        h = a[b + 0 - 32],
        k = a[b + 1 - 32],
        l = a[b + 2 - 32];
      a[b + 0 + 0] = a[b + 2 + 32] = (c + g + 1) >> 1;
      a[b + 0 + 32] = a[b + 2 + 64] = (d + c + 1) >> 1;
      a[b + 0 + 64] = a[b + 2 + 96] = (e + d + 1) >> 1;
      a[b + 0 + 96] = (f + e + 1) >> 1;
      a[b + 3 + 0] = z(h, k, l);
      a[b + 2 + 0] = z(g, h, k);
      a[b + 1 + 0] = a[b + 3 + 32] = z(c, g, h);
      a[b + 1 + 32] = a[b + 3 + 64] = z(d, c, g);
      a[b + 1 + 64] = a[b + 3 + 96] = z(e, d, c);
      a[b + 1 + 96] = z(f, e, d);
    }
    function xf(a, b) {
      var c;
      for (c = 0; 8 > c; ++c) I(a, b + 32 * c, a, b - 32, 8);
    }
    function yf(a, b) {
      var c;
      for (c = 0; 8 > c; ++c) M(a, b, a[b - 1], 8), (b += 32);
    }
    function lb(a, b, c) {
      var d;
      for (d = 0; 8 > d; ++d) M(b, c + 32 * d, a, 8);
    }
    function vf(a, b) {
      var c = 8,
        d;
      for (d = 0; 8 > d; ++d) c += a[b + d - 32] + a[b - 1 + 32 * d];
      lb(c >> 4, a, b);
    }
    function Af(a, b) {
      var c = 4,
        d;
      for (d = 0; 8 > d; ++d) c += a[b + d - 32];
      lb(c >> 3, a, b);
    }
    function zf(a, b) {
      var c = 4,
        d;
      for (d = 0; 8 > d; ++d) c += a[b - 1 + 32 * d];
      lb(c >> 3, a, b);
    }
    function Bf(a, b) {
      lb(128, a, b);
    }
    function ab(a, b, c) {
      var d = a[b - c],
        e = a[b + 0],
        f = 3 * (e - d) + Qb[1020 + a[b - 2 * c] - a[b + c]],
        g = mb[112 + ((f + 4) >> 3)];
      a[b - c] = R[255 + d + mb[112 + ((f + 3) >> 3)]];
      a[b + 0] = R[255 + e - g];
    }
    function jd(a, b, c, d) {
      var e = a[b + 0],
        f = a[b + c];
      return U[255 + a[b - 2 * c] - a[b - c]] > d || U[255 + f - e] > d;
    }
    function kd(a, b, c, d) {
      return (
        4 * U[255 + a[b - c] - a[b + 0]] + U[255 + a[b - 2 * c] - a[b + c]] <= d
      );
    }
    function ld(a, b, c, d, e) {
      var f = a[b - 3 * c],
        g = a[b - 2 * c],
        h = a[b - c],
        k = a[b + 0],
        l = a[b + c],
        m = a[b + 2 * c],
        n = a[b + 3 * c];
      return 4 * U[255 + h - k] + U[255 + g - l] > d
        ? 0
        : U[255 + a[b - 4 * c] - f] <= e &&
            U[255 + f - g] <= e &&
            U[255 + g - h] <= e &&
            U[255 + n - m] <= e &&
            U[255 + m - l] <= e &&
            U[255 + l - k] <= e;
    }
    function gd(a, b, c, d) {
      var e = 2 * d + 1;
      for (d = 0; 16 > d; ++d) kd(a, b + d, c, e) && ab(a, b + d, c);
    }
    function hd(a, b, c, d) {
      var e = 2 * d + 1;
      for (d = 0; 16 > d; ++d) kd(a, b + d * c, 1, e) && ab(a, b + d * c, 1);
    }
    function bf(a, b, c, d) {
      var e;
      for (e = 3; 0 < e; --e) (b += 4 * c), gd(a, b, c, d);
    }
    function cf(a, b, c, d) {
      var e;
      for (e = 3; 0 < e; --e) (b += 4), hd(a, b, c, d);
    }
    function ea(a, b, c, d, e, f, g, h) {
      for (f = 2 * f + 1; 0 < e--; ) {
        if (ld(a, b, c, f, g))
          if (jd(a, b, c, h)) ab(a, b, c);
          else {
            var k = a,
              l = b,
              m = c,
              n = k[l - 2 * m],
              r = k[l - m],
              q = k[l + 0],
              t = k[l + m],
              v = k[l + 2 * m],
              p = Qb[1020 + 3 * (q - r) + Qb[1020 + n - t]],
              u = (27 * p + 63) >> 7,
              w = (18 * p + 63) >> 7,
              p = (9 * p + 63) >> 7;
            k[l - 3 * m] = R[255 + k[l - 3 * m] + p];
            k[l - 2 * m] = R[255 + n + w];
            k[l - m] = R[255 + r + u];
            k[l + 0] = R[255 + q - u];
            k[l + m] = R[255 + t - w];
            k[l + 2 * m] = R[255 + v - p];
          }
        b += d;
      }
    }
    function Fa(a, b, c, d, e, f, g, h) {
      for (f = 2 * f + 1; 0 < e--; ) {
        if (ld(a, b, c, f, g))
          if (jd(a, b, c, h)) ab(a, b, c);
          else {
            var k = a,
              l = b,
              m = c,
              n = k[l - m],
              r = k[l + 0],
              q = k[l + m],
              t = 3 * (r - n),
              v = mb[112 + ((t + 4) >> 3)],
              t = mb[112 + ((t + 3) >> 3)],
              p = (v + 1) >> 1;
            k[l - 2 * m] = R[255 + k[l - 2 * m] + p];
            k[l - m] = R[255 + n + t];
            k[l + 0] = R[255 + r - v];
            k[l + m] = R[255 + q - p];
          }
        b += d;
      }
    }
    function Ue(a, b, c, d, e, f) {
      ea(a, b, c, 1, 16, d, e, f);
    }
    function Ve(a, b, c, d, e, f) {
      ea(a, b, 1, c, 16, d, e, f);
    }
    function Ye(a, b, c, d, e, f) {
      var g;
      for (g = 3; 0 < g; --g) (b += 4 * c), Fa(a, b, c, 1, 16, d, e, f);
    }
    function Ze(a, b, c, d, e, f) {
      var g;
      for (g = 3; 0 < g; --g) (b += 4), Fa(a, b, 1, c, 16, d, e, f);
    }
    function We(a, b, c, d, e, f, g, h) {
      ea(a, b, e, 1, 8, f, g, h);
      ea(c, d, e, 1, 8, f, g, h);
    }
    function Xe(a, b, c, d, e, f, g, h) {
      ea(a, b, 1, e, 8, f, g, h);
      ea(c, d, 1, e, 8, f, g, h);
    }
    function $e(a, b, c, d, e, f, g, h) {
      Fa(a, b + 4 * e, e, 1, 8, f, g, h);
      Fa(c, d + 4 * e, e, 1, 8, f, g, h);
    }
    function af(a, b, c, d, e, f, g, h) {
      Fa(a, b + 4, 1, e, 8, f, g, h);
      Fa(c, d + 4, 1, e, 8, f, g, h);
    }
    function Cf() {
      this.ba = new Cb();
      this.ec = [];
      this.cc = [];
      this.Mc = [];
      this.Dc = this.Nc = this.dc = this.fc = 0;
      this.Oa = new Ud();
      this.memory = 0;
      this.Ib = "OutputFunc";
      this.Jb = "OutputAlphaFunc";
      this.Nd = "OutputRowFunc";
    }
    function md() {
      this.data = [];
      this.offset = this.kd = this.ha = this.w = 0;
      this.na = [];
      this.xa = this.gb = this.Ja = this.Sa = this.P = 0;
    }
    function Df() {
      this.nc = this.Ea = this.b = this.hc = 0;
      this.K = [];
      this.w = 0;
    }
    function Ef() {
      this.ua = 0;
      this.Wa = new ac();
      this.vb = new ac();
      this.md = this.xc = this.wc = 0;
      this.vc = [];
      this.Wb = 0;
      this.Ya = new Ub();
      this.yc = new O();
    }
    function je() {
      this.xb = this.a = 0;
      this.l = new Oa();
      this.ca = new Cb();
      this.V = [];
      this.Ba = 0;
      this.Ta = [];
      this.Ua = 0;
      this.m = new Ra();
      this.Pb = 0;
      this.wd = new Ra();
      this.Ma = this.$ = this.C = this.i = this.c = this.xd = 0;
      this.s = new Ef();
      this.ab = 0;
      this.gc = wa(4, Df);
      this.Oc = 0;
    }
    function Ff() {
      this.Lc = this.Z = this.$a = this.i = this.c = 0;
      this.l = new Oa();
      this.ic = 0;
      this.ca = [];
      this.tb = 0;
      this.qd = null;
      this.rd = 0;
    }
    function Rb(a, b, c, d, e, f, g) {
      a = null == a ? 0 : a[b + 0];
      for (b = 0; b < g; ++b) (e[f + b] = (a + c[d + b]) & 255), (a = e[f + b]);
    }
    function Gf(a, b, c, d, e, f, g) {
      if (null == a) Rb(null, null, c, d, e, f, g);
      else {
        var h;
        for (h = 0; h < g; ++h) e[f + h] = (a[b + h] + c[d + h]) & 255;
      }
    }
    function Hf(a, b, c, d, e, f, g) {
      if (null == a) Rb(null, null, c, d, e, f, g);
      else {
        var h = a[b + 0],
          k = h,
          l = h,
          m;
        for (m = 0; m < g; ++m)
          (h = a[b + m]),
            (k = l + h - k),
            (l = (c[d + m] + (k & -256 ? (0 > k ? 0 : 255) : k)) & 255),
            (k = h),
            (e[f + m] = l);
      }
    }
    function Le(a, b, c, d) {
      var e = b.width,
        f = b.o;
      x(null != a && null != b);
      if (0 > c || 0 >= d || c + d > f) return null;
      if (!a.Cc) {
        if (null == a.ga) {
          a.ga = new Ff();
          var g;
          (g = null == a.ga) ||
            ((g = b.width * b.o),
            x(0 == a.Gb.length),
            (a.Gb = V(g)),
            (a.Uc = 0),
            null == a.Gb
              ? (g = 0)
              : ((a.mb = a.Gb), (a.nb = a.Uc), (a.rc = null), (g = 1)),
            (g = !g));
          if (!g) {
            g = a.ga;
            var h = a.Fa,
              k = a.P,
              l = a.qc,
              m = a.mb,
              n = a.nb,
              r = k + 1,
              q = l - 1,
              t = g.l;
            x(null != h && null != m && null != b);
            ia[0] = null;
            ia[1] = Rb;
            ia[2] = Gf;
            ia[3] = Hf;
            g.ca = m;
            g.tb = n;
            g.c = b.width;
            g.i = b.height;
            x(0 < g.c && 0 < g.i);
            if (1 >= l) b = 0;
            else if (
              ((g.$a = (h[k + 0] >> 0) & 3),
              (g.Z = (h[k + 0] >> 2) & 3),
              (g.Lc = (h[k + 0] >> 4) & 3),
              (k = (h[k + 0] >> 6) & 3),
              0 > g.$a || 1 < g.$a || 4 <= g.Z || 1 < g.Lc || k)
            )
              b = 0;
            else if (
              ((t.put = kc),
              (t.ac = gc),
              (t.bc = lc),
              (t.ma = g),
              (t.width = b.width),
              (t.height = b.height),
              (t.Da = b.Da),
              (t.v = b.v),
              (t.va = b.va),
              (t.j = b.j),
              (t.o = b.o),
              g.$a)
            )
              b: {
                x(1 == g.$a), (b = Bc());
                c: for (;;) {
                  if (null == b) {
                    b = 0;
                    break b;
                  }
                  x(null != g);
                  g.mc = b;
                  b.c = g.c;
                  b.i = g.i;
                  b.l = g.l;
                  b.l.ma = g;
                  b.l.width = g.c;
                  b.l.height = g.i;
                  b.a = 0;
                  cb(b.m, h, r, q);
                  if (!rb(g.c, g.i, 1, b, null)) break c;
                  1 == b.ab && 3 == b.gc[0].hc && yc(b.s)
                    ? ((g.ic = 1),
                      (h = b.c * b.i),
                      (b.Ta = null),
                      (b.Ua = 0),
                      (b.V = V(h)),
                      (b.Ba = 0),
                      null == b.V ? ((b.a = 1), (b = 0)) : (b = 1))
                    : ((g.ic = 0), (b = Ec(b, g.c)));
                  if (!b) break c;
                  b = 1;
                  break b;
                }
                g.mc = null;
                b = 0;
              }
            else b = q >= g.c * g.i;
            g = !b;
          }
          if (g) return null;
          1 != a.ga.Lc ? (a.Ga = 0) : (d = f - c);
        }
        x(null != a.ga);
        x(c + d <= f);
        a: {
          h = a.ga;
          b = h.c;
          f = h.l.o;
          if (0 == h.$a) {
            r = a.rc;
            q = a.Vc;
            t = a.Fa;
            k = a.P + 1 + c * b;
            l = a.mb;
            m = a.nb + c * b;
            x(k <= a.P + a.qc);
            if (0 != h.Z)
              for (x(null != ia[h.Z]), g = 0; g < d; ++g)
                ia[h.Z](r, q, t, k, l, m, b),
                  (r = l),
                  (q = m),
                  (m += b),
                  (k += b);
            else
              for (g = 0; g < d; ++g)
                I(l, m, t, k, b), (r = l), (q = m), (m += b), (k += b);
            a.rc = r;
            a.Vc = q;
          } else {
            x(null != h.mc);
            b = c + d;
            g = h.mc;
            x(null != g);
            x(b <= g.i);
            if (g.C >= b) b = 1;
            else if ((h.ic || Aa(), h.ic)) {
              var h = g.V,
                r = g.Ba,
                q = g.c,
                v = g.i,
                t = 1,
                k = g.$ / q,
                l = g.$ % q,
                m = g.m,
                n = g.s,
                p = g.$,
                u = q * v,
                w = q * b,
                y = n.wc,
                A = p < w ? ha(n, l, k) : null;
              x(p <= u);
              x(b <= v);
              x(yc(n));
              c: for (;;) {
                for (; !m.h && p < w; ) {
                  l & y || (A = ha(n, l, k));
                  x(null != A);
                  Sa(m);
                  v = ua(A.G[0], A.H[0], m);
                  if (256 > v)
                    (h[r + p] = v),
                      ++p,
                      ++l,
                      l >= q && ((l = 0), ++k, k <= b && !(k % 16) && Ib(g, k));
                  else if (280 > v) {
                    var v = ib(v - 256, m);
                    var E = ua(A.G[4], A.H[4], m);
                    Sa(m);
                    E = ib(E, m);
                    E = nc(q, E);
                    if (p >= E && u - p >= v) {
                      var B;
                      for (B = 0; B < v; ++B) h[r + p + B] = h[r + p + B - E];
                    } else {
                      t = 0;
                      break c;
                    }
                    p += v;
                    for (l += v; l >= q; )
                      (l -= q), ++k, k <= b && !(k % 16) && Ib(g, k);
                    p < w && l & y && (A = ha(n, l, k));
                  } else {
                    t = 0;
                    break c;
                  }
                  x(m.h == db(m));
                }
                Ib(g, k > b ? b : k);
                break c;
              }
              !t || (m.h && p < u) ? ((t = 0), (g.a = m.h ? 5 : 3)) : (g.$ = p);
              b = t;
            } else b = Jb(g, g.V, g.Ba, g.c, g.i, b, se);
            if (!b) {
              d = 0;
              break a;
            }
          }
          c + d >= f && (a.Cc = 1);
          d = 1;
        }
        if (!d) return null;
        if (
          a.Cc &&
          ((d = a.ga), null != d && (d.mc = null), (a.ga = null), 0 < a.Ga)
        )
          return alert("todo:WebPDequantizeLevels"), null;
      }
      return a.nb + c * e;
    }
    function If(a, b, c, d, e, f) {
      for (; 0 < e--; ) {
        var g = a,
          h = b + (c ? 1 : 0),
          k = a,
          l = b + (c ? 0 : 3),
          m;
        for (m = 0; m < d; ++m) {
          var n = k[l + 4 * m];
          255 != n &&
            ((n *= 32897),
            (g[h + 4 * m + 0] = (g[h + 4 * m + 0] * n) >> 23),
            (g[h + 4 * m + 1] = (g[h + 4 * m + 1] * n) >> 23),
            (g[h + 4 * m + 2] = (g[h + 4 * m + 2] * n) >> 23));
        }
        b += f;
      }
    }
    function Jf(a, b, c, d, e) {
      for (; 0 < d--; ) {
        var f;
        for (f = 0; f < c; ++f) {
          var g = a[b + 2 * f + 0],
            h = a[b + 2 * f + 1],
            k = h & 15,
            l = 4369 * k,
            h = (((h & 240) | (h >> 4)) * l) >> 16;
          a[b + 2 * f + 0] =
            (((((g & 240) | (g >> 4)) * l) >> 16) & 240) |
            ((((((g & 15) | (g << 4)) * l) >> 16) >> 4) & 15);
          a[b + 2 * f + 1] = (h & 240) | k;
        }
        b += e;
      }
    }
    function Kf(a, b, c, d, e, f, g, h) {
      var k = 255,
        l,
        m;
      for (m = 0; m < e; ++m) {
        for (l = 0; l < d; ++l) {
          var n = a[b + l];
          f[g + 4 * l] = n;
          k &= n;
        }
        b += c;
        g += h;
      }
      return 255 != k;
    }
    function Lf(a, b, c, d, e) {
      var f;
      for (f = 0; f < e; ++f) c[d + f] = a[b + f] >> 8;
    }
    function Aa() {
      za = If;
      vc = Jf;
      fc = Kf;
      Fc = Lf;
    }
    function va(a, b, c) {
      self[a] = function(a, e, f, g, h, k, l, m, n, r, q, t, v, p, u, w, y) {
        var d,
          E = (y - 1) >> 1;
        var B = h[k + 0] | (l[m + 0] << 16);
        var C = n[r + 0] | (q[t + 0] << 16);
        x(null != a);
        var z = (3 * B + C + 131074) >> 2;
        b(a[e + 0], z & 255, z >> 16, v, p);
        null != f &&
          ((z = (3 * C + B + 131074) >> 2),
          b(f[g + 0], z & 255, z >> 16, u, w));
        for (d = 1; d <= E; ++d) {
          var D = h[k + d] | (l[m + d] << 16);
          var G = n[r + d] | (q[t + d] << 16);
          var F = B + D + C + G + 524296;
          var H = (F + 2 * (D + C)) >> 3;
          F = (F + 2 * (B + G)) >> 3;
          z = (H + B) >> 1;
          B = (F + D) >> 1;
          b(a[e + 2 * d - 1], z & 255, z >> 16, v, p + (2 * d - 1) * c);
          b(a[e + 2 * d - 0], B & 255, B >> 16, v, p + (2 * d - 0) * c);
          null != f &&
            ((z = (F + C) >> 1),
            (B = (H + G) >> 1),
            b(f[g + 2 * d - 1], z & 255, z >> 16, u, w + (2 * d - 1) * c),
            b(f[g + 2 * d + 0], B & 255, B >> 16, u, w + (2 * d + 0) * c));
          B = D;
          C = G;
        }
        y & 1 ||
          ((z = (3 * B + C + 131074) >> 2),
          b(a[e + y - 1], z & 255, z >> 16, v, p + (y - 1) * c),
          null != f &&
            ((z = (3 * C + B + 131074) >> 2),
            b(f[g + y - 1], z & 255, z >> 16, u, w + (y - 1) * c)));
      };
    }
    function ic() {
      P[Ca] = Mf;
      P[Ua] = nd;
      P[tc] = Nf;
      P[Va] = od;
      P[ya] = pd;
      P[Db] = qd;
      P[wc] = Of;
      P[zb] = nd;
      P[Ab] = od;
      P[Ja] = pd;
      P[Bb] = qd;
    }
    function Sb(a) {
      return a & ~Pf ? (0 > a ? 0 : 255) : a >> rd;
    }
    function bb(a, b) {
      return Sb(((19077 * a) >> 8) + ((26149 * b) >> 8) - 14234);
    }
    function nb(a, b, c) {
      return Sb(
        ((19077 * a) >> 8) - ((6419 * b) >> 8) - ((13320 * c) >> 8) + 8708
      );
    }
    function Pa(a, b) {
      return Sb(((19077 * a) >> 8) + ((33050 * b) >> 8) - 17685);
    }
    function Ga(a, b, c, d, e) {
      d[e + 0] = bb(a, c);
      d[e + 1] = nb(a, b, c);
      d[e + 2] = Pa(a, b);
    }
    function Tb(a, b, c, d, e) {
      d[e + 0] = Pa(a, b);
      d[e + 1] = nb(a, b, c);
      d[e + 2] = bb(a, c);
    }
    function sd(a, b, c, d, e) {
      var f = nb(a, b, c);
      b = ((f << 3) & 224) | (Pa(a, b) >> 3);
      d[e + 0] = (bb(a, c) & 248) | (f >> 5);
      d[e + 1] = b;
    }
    function td(a, b, c, d, e) {
      var f = (Pa(a, b) & 240) | 15;
      d[e + 0] = (bb(a, c) & 240) | (nb(a, b, c) >> 4);
      d[e + 1] = f;
    }
    function ud(a, b, c, d, e) {
      d[e + 0] = 255;
      Ga(a, b, c, d, e + 1);
    }
    function vd(a, b, c, d, e) {
      Tb(a, b, c, d, e);
      d[e + 3] = 255;
    }
    function wd(a, b, c, d, e) {
      Ga(a, b, c, d, e);
      d[e + 3] = 255;
    }
    function ga(a, b) {
      return 0 > a ? 0 : a > b ? b : a;
    }
    function la(a, b, c) {
      self[a] = function(a, e, f, g, h, k, l, m, n) {
        for (var d = m + (n & -2) * c; m != d; )
          b(a[e + 0], f[g + 0], h[k + 0], l, m),
            b(a[e + 1], f[g + 0], h[k + 0], l, m + c),
            (e += 2),
            ++g,
            ++k,
            (m += 2 * c);
        n & 1 && b(a[e + 0], f[g + 0], h[k + 0], l, m);
      };
    }
    function xd(a, b, c) {
      return 0 == c ? (0 == a ? (0 == b ? 6 : 5) : 0 == b ? 4 : 0) : c;
    }
    function yd(a, b, c, d, e) {
      switch (a >>> 30) {
        case 3:
          Za(b, c, d, e, 0);
          break;
        case 2:
          fd(b, c, d, e);
          break;
        case 1:
          pa(b, c, d, e);
      }
    }
    function Oc(a, b) {
      var c,
        d,
        e = b.M,
        f = b.Nb,
        g = a.oc,
        h = a.pc + 40,
        k = a.oc,
        l = a.pc + 584,
        m = a.oc,
        n = a.pc + 600;
      for (c = 0; 16 > c; ++c) g[h + 32 * c - 1] = 129;
      for (c = 0; 8 > c; ++c)
        (k[l + 32 * c - 1] = 129), (m[n + 32 * c - 1] = 129);
      0 < e
        ? (g[h - 1 - 32] = k[l - 1 - 32] = m[n - 1 - 32] = 129)
        : (M(g, h - 32 - 1, 127, 21),
          M(k, l - 32 - 1, 127, 9),
          M(m, n - 32 - 1, 127, 9));
      for (d = 0; d < a.za; ++d) {
        var r = b.ya[b.aa + d];
        if (0 < d) {
          for (c = -1; 16 > c; ++c) I(g, h + 32 * c - 4, g, h + 32 * c + 12, 4);
          for (c = -1; 8 > c; ++c)
            I(k, l + 32 * c - 4, k, l + 32 * c + 4, 4),
              I(m, n + 32 * c - 4, m, n + 32 * c + 4, 4);
        }
        var q = a.Gd,
          t = a.Hd + d,
          v = r.ad,
          p = r.Hc;
        0 < e &&
          (I(g, h - 32, q[t].y, 0, 16),
          I(k, l - 32, q[t].f, 0, 8),
          I(m, n - 32, q[t].ea, 0, 8));
        if (r.Za) {
          var u = g;
          var w = h - 32 + 16;
          0 < e &&
            (d >= a.za - 1
              ? M(u, w, q[t].y[15], 4)
              : I(u, w, q[t + 1].y, 0, 4));
          for (c = 0; 4 > c; c++)
            u[w + 128 + c] = u[w + 256 + c] = u[w + 384 + c] = u[w + 0 + c];
          for (c = 0; 16 > c; ++c, p <<= 2)
            (u = g), (w = h + zd[c]), W[r.Ob[c]](u, w), yd(p, v, 16 * +c, u, w);
        } else if (((u = xd(d, e, r.Ob[0])), Y[u](g, h), 0 != p))
          for (c = 0; 16 > c; ++c, p <<= 2) yd(p, v, 16 * +c, g, h + zd[c]);
        c = r.Gc;
        u = xd(d, e, r.Dd);
        ka[u](k, l);
        ka[u](m, n);
        r = c >> 0;
        p = v;
        u = k;
        w = l;
        r & 255 && (r & 170 ? Nb(p, 256, u, w) : Ob(p, 256, u, w));
        c >>= 8;
        r = m;
        p = n;
        c & 255 && (c & 170 ? Nb(v, 320, r, p) : Ob(v, 320, r, p));
        e < a.Ub - 1 &&
          (I(q[t].y, 0, g, h + 480, 16),
          I(q[t].f, 0, k, l + 224, 8),
          I(q[t].ea, 0, m, n + 224, 8));
        c = 8 * f * a.B;
        q = a.sa;
        t = a.ta + 16 * d + 16 * f * a.R;
        v = a.qa;
        r = a.ra + 8 * d + c;
        p = a.Ha;
        u = a.Ia + 8 * d + c;
        for (c = 0; 16 > c; ++c) I(q, t + c * a.R, g, h + 32 * c, 16);
        for (c = 0; 8 > c; ++c)
          I(v, r + c * a.B, k, l + 32 * c, 8),
            I(p, u + c * a.B, m, n + 32 * c, 8);
      }
    }
    function Ad(a, b, c, d, e, f, g, h, k) {
      var l = [0],
        m = [0],
        n = 0,
        r = null != k ? k.kd : 0,
        q = null != k ? k : new md();
      if (null == a || 12 > c) return 7;
      q.data = a;
      q.w = b;
      q.ha = c;
      b = [b];
      c = [c];
      q.gb = [q.gb];
      a: {
        var t = b;
        var v = c;
        var p = q.gb;
        x(null != a);
        x(null != v);
        x(null != p);
        p[0] = 0;
        if (12 <= v[0] && !fa(a, t[0], "RIFF")) {
          if (fa(a, t[0] + 8, "WEBP")) {
            p = 3;
            break a;
          }
          var u = Ha(a, t[0] + 4);
          if (12 > u || 4294967286 < u) {
            p = 3;
            break a;
          }
          if (r && u > v[0] - 8) {
            p = 7;
            break a;
          }
          p[0] = u;
          t[0] += 12;
          v[0] -= 12;
        }
        p = 0;
      }
      if (0 != p) return p;
      u = 0 < q.gb[0];
      for (c = c[0]; ; ) {
        t = [0];
        n = [n];
        a: {
          var w = a;
          v = b;
          p = c;
          var y = n,
            A = l,
            z = m,
            B = t;
          y[0] = 0;
          if (8 > p[0]) p = 7;
          else {
            if (!fa(w, v[0], "VP8X")) {
              if (10 != Ha(w, v[0] + 4)) {
                p = 3;
                break a;
              }
              if (18 > p[0]) {
                p = 7;
                break a;
              }
              var C = Ha(w, v[0] + 8);
              var D = 1 + Yb(w, v[0] + 12);
              w = 1 + Yb(w, v[0] + 15);
              if (2147483648 <= D * w) {
                p = 3;
                break a;
              }
              null != B && (B[0] = C);
              null != A && (A[0] = D);
              null != z && (z[0] = w);
              v[0] += 18;
              p[0] -= 18;
              y[0] = 1;
            }
            p = 0;
          }
        }
        n = n[0];
        t = t[0];
        if (0 != p) return p;
        v = !!(t & 2);
        if (!u && n) return 3;
        null != f && (f[0] = !!(t & 16));
        null != g && (g[0] = v);
        null != h && (h[0] = 0);
        g = l[0];
        t = m[0];
        if (n && v && null == k) {
          p = 0;
          break;
        }
        if (4 > c) {
          p = 7;
          break;
        }
        if ((u && n) || (!u && !n && !fa(a, b[0], "ALPH"))) {
          c = [c];
          q.na = [q.na];
          q.P = [q.P];
          q.Sa = [q.Sa];
          a: {
            C = a;
            p = b;
            u = c;
            var y = q.gb,
              A = q.na,
              z = q.P,
              B = q.Sa;
            D = 22;
            x(null != C);
            x(null != u);
            w = p[0];
            var F = u[0];
            x(null != A);
            x(null != B);
            A[0] = null;
            z[0] = null;
            for (B[0] = 0; ; ) {
              p[0] = w;
              u[0] = F;
              if (8 > F) {
                p = 7;
                break a;
              }
              var G = Ha(C, w + 4);
              if (4294967286 < G) {
                p = 3;
                break a;
              }
              var H = (8 + G + 1) & -2;
              D += H;
              if (0 < y && D > y) {
                p = 3;
                break a;
              }
              if (!fa(C, w, "VP8 ") || !fa(C, w, "VP8L")) {
                p = 0;
                break a;
              }
              if (F[0] < H) {
                p = 7;
                break a;
              }
              fa(C, w, "ALPH") || ((A[0] = C), (z[0] = w + 8), (B[0] = G));
              w += H;
              F -= H;
            }
          }
          c = c[0];
          q.na = q.na[0];
          q.P = q.P[0];
          q.Sa = q.Sa[0];
          if (0 != p) break;
        }
        c = [c];
        q.Ja = [q.Ja];
        q.xa = [q.xa];
        a: if (
          ((y = a),
          (p = b),
          (u = c),
          (A = q.gb[0]),
          (z = q.Ja),
          (B = q.xa),
          (C = p[0]),
          (w = !fa(y, C, "VP8 ")),
          (D = !fa(y, C, "VP8L")),
          x(null != y),
          x(null != u),
          x(null != z),
          x(null != B),
          8 > u[0])
        )
          p = 7;
        else {
          if (w || D) {
            y = Ha(y, C + 4);
            if (12 <= A && y > A - 12) {
              p = 3;
              break a;
            }
            if (r && y > u[0] - 8) {
              p = 7;
              break a;
            }
            z[0] = y;
            p[0] += 8;
            u[0] -= 8;
            B[0] = D;
          } else
            (B[0] = 5 <= u[0] && 47 == y[C + 0] && !(y[C + 4] >> 5)),
              (z[0] = u[0]);
          p = 0;
        }
        c = c[0];
        q.Ja = q.Ja[0];
        q.xa = q.xa[0];
        b = b[0];
        if (0 != p) break;
        if (4294967286 < q.Ja) return 3;
        null == h || v || (h[0] = q.xa ? 2 : 1);
        g = [g];
        t = [t];
        if (q.xa) {
          if (5 > c) {
            p = 7;
            break;
          }
          h = g;
          r = t;
          v = f;
          null == a || 5 > c
            ? (a = 0)
            : 5 <= c && 47 == a[b + 0] && !(a[b + 4] >> 5)
            ? ((u = [0]),
              (y = [0]),
              (A = [0]),
              (z = new Ra()),
              cb(z, a, b, c),
              mc(z, u, y, A)
                ? (null != h && (h[0] = u[0]),
                  null != r && (r[0] = y[0]),
                  null != v && (v[0] = A[0]),
                  (a = 1))
                : (a = 0))
            : (a = 0);
        } else {
          if (10 > c) {
            p = 7;
            break;
          }
          h = t;
          null == a || 10 > c || !Jc(a, b + 3, c - 3)
            ? (a = 0)
            : ((r = a[b + 0] | (a[b + 1] << 8) | (a[b + 2] << 16)),
              (v = ((a[b + 7] << 8) | a[b + 6]) & 16383),
              (a = ((a[b + 9] << 8) | a[b + 8]) & 16383),
              r & 1 ||
              3 < ((r >> 1) & 7) ||
              !((r >> 4) & 1) ||
              r >> 5 >= q.Ja ||
              !v ||
              !a
                ? (a = 0)
                : (g && (g[0] = v), h && (h[0] = a), (a = 1)));
        }
        if (!a) return 3;
        g = g[0];
        t = t[0];
        if (n && (l[0] != g || m[0] != t)) return 3;
        null != k &&
          ((k[0] = q),
          (k.offset = b - k.w),
          x(4294967286 > b - k.w),
          x(k.offset == k.ha - c));
        break;
      }
      return 0 == p || (7 == p && n && null == k)
        ? (null != f && (f[0] |= null != q.na && 0 < q.na.length),
          null != d && (d[0] = g),
          null != e && (e[0] = t),
          0)
        : p;
    }
    function hc(a, b, c) {
      var d = b.width,
        e = b.height,
        f = 0,
        g = 0,
        h = d,
        k = e;
      b.Da = null != a && 0 < a.Da;
      if (
        b.Da &&
        ((h = a.cd),
        (k = a.bd),
        (f = a.v),
        (g = a.j),
        11 > c || ((f &= -2), (g &= -2)),
        0 > f || 0 > g || 0 >= h || 0 >= k || f + h > d || g + k > e)
      )
        return 0;
      b.v = f;
      b.j = g;
      b.va = f + h;
      b.o = g + k;
      b.U = h;
      b.T = k;
      b.da = null != a && 0 < a.da;
      if (b.da) {
        c = [a.ib];
        f = [a.hb];
        if (!bc(h, k, c, f)) return 0;
        b.ib = c[0];
        b.hb = f[0];
      }
      b.ob = null != a && a.ob;
      b.Kb = null == a || !a.Sd;
      b.da && ((b.ob = b.ib < (3 * d) / 4 && b.hb < (3 * e) / 4), (b.Kb = 0));
      return 1;
    }
    function Bd(a) {
      if (null == a) return 2;
      if (11 > a.S) {
        var b = a.f.RGBA;
        b.fb += (a.height - 1) * b.A;
        b.A = -b.A;
      } else
        (b = a.f.kb),
          (a = a.height),
          (b.O += (a - 1) * b.fa),
          (b.fa = -b.fa),
          (b.N += ((a - 1) >> 1) * b.Ab),
          (b.Ab = -b.Ab),
          (b.W += ((a - 1) >> 1) * b.Db),
          (b.Db = -b.Db),
          null != b.F && ((b.J += (a - 1) * b.lb), (b.lb = -b.lb));
      return 0;
    }
    function Cd(a, b, c, d) {
      if (null == d || 0 >= a || 0 >= b) return 2;
      if (null != c) {
        if (c.Da) {
          var e = c.cd,
            f = c.bd,
            g = c.v & -2,
            h = c.j & -2;
          if (0 > g || 0 > h || 0 >= e || 0 >= f || g + e > a || h + f > b)
            return 2;
          a = e;
          b = f;
        }
        if (c.da) {
          e = [c.ib];
          f = [c.hb];
          if (!bc(a, b, e, f)) return 2;
          a = e[0];
          b = f[0];
        }
      }
      d.width = a;
      d.height = b;
      a: {
        var k = d.width;
        var l = d.height;
        a = d.S;
        if (0 >= k || 0 >= l || !(a >= Ca && 13 > a)) a = 2;
        else {
          if (0 >= d.Rd && null == d.sd) {
            var g = (f = e = b = 0),
              h = k * Dd[a],
              m = h * l;
            11 > a ||
              ((b = (k + 1) / 2),
              (f = ((l + 1) / 2) * b),
              12 == a && ((e = k), (g = e * l)));
            l = V(m + 2 * f + g);
            if (null == l) {
              a = 1;
              break a;
            }
            d.sd = l;
            11 > a
              ? ((k = d.f.RGBA),
                (k.eb = l),
                (k.fb = 0),
                (k.A = h),
                (k.size = m))
              : ((k = d.f.kb),
                (k.y = l),
                (k.O = 0),
                (k.fa = h),
                (k.Fd = m),
                (k.f = l),
                (k.N = 0 + m),
                (k.Ab = b),
                (k.Cd = f),
                (k.ea = l),
                (k.W = 0 + m + f),
                (k.Db = b),
                (k.Ed = f),
                12 == a && ((k.F = l), (k.J = 0 + m + 2 * f)),
                (k.Tc = g),
                (k.lb = e));
          }
          b = 1;
          e = d.S;
          f = d.width;
          g = d.height;
          if (e >= Ca && 13 > e)
            if (11 > e)
              (a = d.f.RGBA),
                (h = Math.abs(a.A)),
                (b &= h * (g - 1) + f <= a.size),
                (b &= h >= f * Dd[e]),
                (b &= null != a.eb);
            else {
              a = d.f.kb;
              h = (f + 1) / 2;
              m = (g + 1) / 2;
              k = Math.abs(a.fa);
              var l = Math.abs(a.Ab),
                n = Math.abs(a.Db),
                r = Math.abs(a.lb),
                q = r * (g - 1) + f;
              b &= k * (g - 1) + f <= a.Fd;
              b &= l * (m - 1) + h <= a.Cd;
              b &= n * (m - 1) + h <= a.Ed;
              b = b & (k >= f) & (l >= h) & (n >= h);
              b &= null != a.y;
              b &= null != a.f;
              b &= null != a.ea;
              12 == e && ((b &= r >= f), (b &= q <= a.Tc), (b &= null != a.F));
            }
          else b = 0;
          a = b ? 0 : 2;
        }
      }
      if (0 != a) return a;
      null != c && c.fd && (a = Bd(d));
      return a;
    }
    var xb = 64,
      Hd = [
        0,
        1,
        3,
        7,
        15,
        31,
        63,
        127,
        255,
        511,
        1023,
        2047,
        4095,
        8191,
        16383,
        32767,
        65535,
        131071,
        262143,
        524287,
        1048575,
        2097151,
        4194303,
        8388607,
        16777215
      ],
      Gd = 24,
      ob = 32,
      Xb = 8,
      Id = [
        0,
        0,
        1,
        1,
        2,
        2,
        2,
        2,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7
      ];
    X("Predictor0", "PredictorAdd0");
    self.Predictor0 = function() {
      return 4278190080;
    };
    self.Predictor1 = function(a) {
      return a;
    };
    self.Predictor2 = function(a, b, c) {
      return b[c + 0];
    };
    self.Predictor3 = function(a, b, c) {
      return b[c + 1];
    };
    self.Predictor4 = function(a, b, c) {
      return b[c - 1];
    };
    self.Predictor5 = function(a, b, c) {
      return aa(aa(a, b[c + 1]), b[c + 0]);
    };
    self.Predictor6 = function(a, b, c) {
      return aa(a, b[c - 1]);
    };
    self.Predictor7 = function(a, b, c) {
      return aa(a, b[c + 0]);
    };
    self.Predictor8 = function(a, b, c) {
      return aa(b[c - 1], b[c + 0]);
    };
    self.Predictor9 = function(a, b, c) {
      return aa(b[c + 0], b[c + 1]);
    };
    self.Predictor10 = function(a, b, c) {
      return aa(aa(a, b[c - 1]), aa(b[c + 0], b[c + 1]));
    };
    self.Predictor11 = function(a, b, c) {
      var d = b[c + 0];
      b = b[c - 1];
      return 0 >=
        Ia((d >> 24) & 255, (a >> 24) & 255, (b >> 24) & 255) +
          Ia((d >> 16) & 255, (a >> 16) & 255, (b >> 16) & 255) +
          Ia((d >> 8) & 255, (a >> 8) & 255, (b >> 8) & 255) +
          Ia(d & 255, a & 255, b & 255)
        ? d
        : a;
    };
    self.Predictor12 = function(a, b, c) {
      var d = b[c + 0];
      b = b[c - 1];
      return (
        ((sa(((a >> 24) & 255) + ((d >> 24) & 255) - ((b >> 24) & 255)) << 24) |
          (sa(((a >> 16) & 255) + ((d >> 16) & 255) - ((b >> 16) & 255)) <<
            16) |
          (sa(((a >> 8) & 255) + ((d >> 8) & 255) - ((b >> 8) & 255)) << 8) |
          sa((a & 255) + (d & 255) - (b & 255))) >>>
        0
      );
    };
    self.Predictor13 = function(a, b, c) {
      var d = b[c - 1];
      a = aa(a, b[c + 0]);
      return (
        ((eb((a >> 24) & 255, (d >> 24) & 255) << 24) |
          (eb((a >> 16) & 255, (d >> 16) & 255) << 16) |
          (eb((a >> 8) & 255, (d >> 8) & 255) << 8) |
          eb((a >> 0) & 255, (d >> 0) & 255)) >>>
        0
      );
    };
    var ee = self.PredictorAdd0;
    self.PredictorAdd1 = cc;
    X("Predictor2", "PredictorAdd2");
    X("Predictor3", "PredictorAdd3");
    X("Predictor4", "PredictorAdd4");
    X("Predictor5", "PredictorAdd5");
    X("Predictor6", "PredictorAdd6");
    X("Predictor7", "PredictorAdd7");
    X("Predictor8", "PredictorAdd8");
    X("Predictor9", "PredictorAdd9");
    X("Predictor10", "PredictorAdd10");
    X("Predictor11", "PredictorAdd11");
    X("Predictor12", "PredictorAdd12");
    X("Predictor13", "PredictorAdd13");
    var fe = self.PredictorAdd2;
    ec(
      "ColorIndexInverseTransform",
      "MapARGB",
      "32b",
      function(a) {
        return (a >> 8) & 255;
      },
      function(a) {
        return a;
      }
    );
    ec(
      "VP8LColorIndexInverseTransformAlpha",
      "MapAlpha",
      "8b",
      function(a) {
        return a;
      },
      function(a) {
        return (a >> 8) & 255;
      }
    );
    var rc = self.ColorIndexInverseTransform,
      ke = self.MapARGB,
      he = self.VP8LColorIndexInverseTransformAlpha,
      le = self.MapAlpha,
      pc,
      qc = (self.VP8LPredictorsAdd = []);
    qc.length = 16;
    (self.VP8LPredictors = []).length = 16;
    (self.VP8LPredictorsAdd_C = []).length = 16;
    (self.VP8LPredictors_C = []).length = 16;
    var Fb,
      sc,
      Gb,
      Hb,
      xc,
      uc,
      bd = V(511),
      cd = V(2041),
      dd = V(225),
      ed = V(767),
      ad = 0,
      Qb = cd,
      mb = dd,
      R = ed,
      U = bd,
      Ca = 0,
      Ua = 1,
      tc = 2,
      Va = 3,
      ya = 4,
      Db = 5,
      wc = 6,
      zb = 7,
      Ab = 8,
      Ja = 9,
      Bb = 10,
      pe = [2, 3, 7],
      oe = [3, 3, 11],
      Dc = [280, 256, 256, 256, 40],
      qe = [0, 1, 1, 1, 0],
      ne = [17, 18, 0, 1, 2, 3, 4, 5, 16, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      de = [
        24,
        7,
        23,
        25,
        40,
        6,
        39,
        41,
        22,
        26,
        38,
        42,
        56,
        5,
        55,
        57,
        21,
        27,
        54,
        58,
        37,
        43,
        72,
        4,
        71,
        73,
        20,
        28,
        53,
        59,
        70,
        74,
        36,
        44,
        88,
        69,
        75,
        52,
        60,
        3,
        87,
        89,
        19,
        29,
        86,
        90,
        35,
        45,
        68,
        76,
        85,
        91,
        51,
        61,
        104,
        2,
        103,
        105,
        18,
        30,
        102,
        106,
        34,
        46,
        84,
        92,
        67,
        77,
        101,
        107,
        50,
        62,
        120,
        1,
        119,
        121,
        83,
        93,
        17,
        31,
        100,
        108,
        66,
        78,
        118,
        122,
        33,
        47,
        117,
        123,
        49,
        63,
        99,
        109,
        82,
        94,
        0,
        116,
        124,
        65,
        79,
        16,
        32,
        98,
        110,
        48,
        115,
        125,
        81,
        95,
        64,
        114,
        126,
        97,
        111,
        80,
        113,
        127,
        96,
        112
      ],
      me = [
        2954,
        2956,
        2958,
        2962,
        2970,
        2986,
        3018,
        3082,
        3212,
        3468,
        3980,
        5004
      ],
      ie = 8,
      Lb = [
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        17,
        18,
        19,
        20,
        20,
        21,
        21,
        22,
        22,
        23,
        23,
        24,
        25,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        64,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        91,
        93,
        95,
        96,
        98,
        100,
        101,
        102,
        104,
        106,
        108,
        110,
        112,
        114,
        116,
        118,
        122,
        124,
        126,
        128,
        130,
        132,
        134,
        136,
        138,
        140,
        143,
        145,
        148,
        151,
        154,
        157
      ],
      Mb = [
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        58,
        60,
        62,
        64,
        66,
        68,
        70,
        72,
        74,
        76,
        78,
        80,
        82,
        84,
        86,
        88,
        90,
        92,
        94,
        96,
        98,
        100,
        102,
        104,
        106,
        108,
        110,
        112,
        114,
        116,
        119,
        122,
        125,
        128,
        131,
        134,
        137,
        140,
        143,
        146,
        149,
        152,
        155,
        158,
        161,
        164,
        167,
        170,
        173,
        177,
        181,
        185,
        189,
        193,
        197,
        201,
        205,
        209,
        213,
        217,
        221,
        225,
        229,
        234,
        239,
        245,
        249,
        254,
        259,
        264,
        269,
        274,
        279,
        284
      ],
      oa = null,
      He = [
        [173, 148, 140, 0],
        [176, 155, 140, 135, 0],
        [180, 157, 141, 134, 130, 0],
        [254, 254, 243, 230, 196, 177, 153, 140, 133, 130, 129, 0]
      ],
      Ie = [0, 1, 4, 8, 5, 2, 3, 6, 9, 12, 13, 10, 7, 11, 14, 15],
      Mc = [-0, 1, -1, 2, -2, 3, 4, 6, -3, 5, -4, -5, -6, 7, -7, 8, -8, -9],
      Fe = [
        [
          [
            [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128],
            [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128],
            [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]
          ],
          [
            [253, 136, 254, 255, 228, 219, 128, 128, 128, 128, 128],
            [189, 129, 242, 255, 227, 213, 255, 219, 128, 128, 128],
            [106, 126, 227, 252, 214, 209, 255, 255, 128, 128, 128]
          ],
          [
            [1, 98, 248, 255, 236, 226, 255, 255, 128, 128, 128],
            [181, 133, 238, 254, 221, 234, 255, 154, 128, 128, 128],
            [78, 134, 202, 247, 198, 180, 255, 219, 128, 128, 128]
          ],
          [
            [1, 185, 249, 255, 243, 255, 128, 128, 128, 128, 128],
            [184, 150, 247, 255, 236, 224, 128, 128, 128, 128, 128],
            [77, 110, 216, 255, 236, 230, 128, 128, 128, 128, 128]
          ],
          [
            [1, 101, 251, 255, 241, 255, 128, 128, 128, 128, 128],
            [170, 139, 241, 252, 236, 209, 255, 255, 128, 128, 128],
            [37, 116, 196, 243, 228, 255, 255, 255, 128, 128, 128]
          ],
          [
            [1, 204, 254, 255, 245, 255, 128, 128, 128, 128, 128],
            [207, 160, 250, 255, 238, 128, 128, 128, 128, 128, 128],
            [102, 103, 231, 255, 211, 171, 128, 128, 128, 128, 128]
          ],
          [
            [1, 152, 252, 255, 240, 255, 128, 128, 128, 128, 128],
            [177, 135, 243, 255, 234, 225, 128, 128, 128, 128, 128],
            [80, 129, 211, 255, 194, 224, 128, 128, 128, 128, 128]
          ],
          [
            [1, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128],
            [246, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128],
            [255, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]
          ]
        ],
        [
          [
            [198, 35, 237, 223, 193, 187, 162, 160, 145, 155, 62],
            [131, 45, 198, 221, 172, 176, 220, 157, 252, 221, 1],
            [68, 47, 146, 208, 149, 167, 221, 162, 255, 223, 128]
          ],
          [
            [1, 149, 241, 255, 221, 224, 255, 255, 128, 128, 128],
            [184, 141, 234, 253, 222, 220, 255, 199, 128, 128, 128],
            [81, 99, 181, 242, 176, 190, 249, 202, 255, 255, 128]
          ],
          [
            [1, 129, 232, 253, 214, 197, 242, 196, 255, 255, 128],
            [99, 121, 210, 250, 201, 198, 255, 202, 128, 128, 128],
            [23, 91, 163, 242, 170, 187, 247, 210, 255, 255, 128]
          ],
          [
            [1, 200, 246, 255, 234, 255, 128, 128, 128, 128, 128],
            [109, 178, 241, 255, 231, 245, 255, 255, 128, 128, 128],
            [44, 130, 201, 253, 205, 192, 255, 255, 128, 128, 128]
          ],
          [
            [1, 132, 239, 251, 219, 209, 255, 165, 128, 128, 128],
            [94, 136, 225, 251, 218, 190, 255, 255, 128, 128, 128],
            [22, 100, 174, 245, 186, 161, 255, 199, 128, 128, 128]
          ],
          [
            [1, 182, 249, 255, 232, 235, 128, 128, 128, 128, 128],
            [124, 143, 241, 255, 227, 234, 128, 128, 128, 128, 128],
            [35, 77, 181, 251, 193, 211, 255, 205, 128, 128, 128]
          ],
          [
            [1, 157, 247, 255, 236, 231, 255, 255, 128, 128, 128],
            [121, 141, 235, 255, 225, 227, 255, 255, 128, 128, 128],
            [45, 99, 188, 251, 195, 217, 255, 224, 128, 128, 128]
          ],
          [
            [1, 1, 251, 255, 213, 255, 128, 128, 128, 128, 128],
            [203, 1, 248, 255, 255, 128, 128, 128, 128, 128, 128],
            [137, 1, 177, 255, 224, 255, 128, 128, 128, 128, 128]
          ]
        ],
        [
          [
            [253, 9, 248, 251, 207, 208, 255, 192, 128, 128, 128],
            [175, 13, 224, 243, 193, 185, 249, 198, 255, 255, 128],
            [73, 17, 171, 221, 161, 179, 236, 167, 255, 234, 128]
          ],
          [
            [1, 95, 247, 253, 212, 183, 255, 255, 128, 128, 128],
            [239, 90, 244, 250, 211, 209, 255, 255, 128, 128, 128],
            [155, 77, 195, 248, 188, 195, 255, 255, 128, 128, 128]
          ],
          [
            [1, 24, 239, 251, 218, 219, 255, 205, 128, 128, 128],
            [201, 51, 219, 255, 196, 186, 128, 128, 128, 128, 128],
            [69, 46, 190, 239, 201, 218, 255, 228, 128, 128, 128]
          ],
          [
            [1, 191, 251, 255, 255, 128, 128, 128, 128, 128, 128],
            [223, 165, 249, 255, 213, 255, 128, 128, 128, 128, 128],
            [141, 124, 248, 255, 255, 128, 128, 128, 128, 128, 128]
          ],
          [
            [1, 16, 248, 255, 255, 128, 128, 128, 128, 128, 128],
            [190, 36, 230, 255, 236, 255, 128, 128, 128, 128, 128],
            [149, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128]
          ],
          [
            [1, 226, 255, 128, 128, 128, 128, 128, 128, 128, 128],
            [247, 192, 255, 128, 128, 128, 128, 128, 128, 128, 128],
            [240, 128, 255, 128, 128, 128, 128, 128, 128, 128, 128]
          ],
          [
            [1, 134, 252, 255, 255, 128, 128, 128, 128, 128, 128],
            [213, 62, 250, 255, 255, 128, 128, 128, 128, 128, 128],
            [55, 93, 255, 128, 128, 128, 128, 128, 128, 128, 128]
          ],
          [
            [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128],
            [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128],
            [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]
          ]
        ],
        [
          [
            [202, 24, 213, 235, 186, 191, 220, 160, 240, 175, 255],
            [126, 38, 182, 232, 169, 184, 228, 174, 255, 187, 128],
            [61, 46, 138, 219, 151, 178, 240, 170, 255, 216, 128]
          ],
          [
            [1, 112, 230, 250, 199, 191, 247, 159, 255, 255, 128],
            [166, 109, 228, 252, 211, 215, 255, 174, 128, 128, 128],
            [39, 77, 162, 232, 172, 180, 245, 178, 255, 255, 128]
          ],
          [
            [1, 52, 220, 246, 198, 199, 249, 220, 255, 255, 128],
            [124, 74, 191, 243, 183, 193, 250, 221, 255, 255, 128],
            [24, 71, 130, 219, 154, 170, 243, 182, 255, 255, 128]
          ],
          [
            [1, 182, 225, 249, 219, 240, 255, 224, 128, 128, 128],
            [149, 150, 226, 252, 216, 205, 255, 171, 128, 128, 128],
            [28, 108, 170, 242, 183, 194, 254, 223, 255, 255, 128]
          ],
          [
            [1, 81, 230, 252, 204, 203, 255, 192, 128, 128, 128],
            [123, 102, 209, 247, 188, 196, 255, 233, 128, 128, 128],
            [20, 95, 153, 243, 164, 173, 255, 203, 128, 128, 128]
          ],
          [
            [1, 222, 248, 255, 216, 213, 128, 128, 128, 128, 128],
            [168, 175, 246, 252, 235, 205, 255, 255, 128, 128, 128],
            [47, 116, 215, 255, 211, 212, 255, 255, 128, 128, 128]
          ],
          [
            [1, 121, 236, 253, 212, 214, 255, 255, 128, 128, 128],
            [141, 84, 213, 252, 201, 202, 255, 219, 128, 128, 128],
            [42, 80, 160, 240, 162, 185, 255, 205, 128, 128, 128]
          ],
          [
            [1, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128],
            [244, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128],
            [238, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128]
          ]
        ]
      ],
      Ke = [
        [
          [231, 120, 48, 89, 115, 113, 120, 152, 112],
          [152, 179, 64, 126, 170, 118, 46, 70, 95],
          [175, 69, 143, 80, 85, 82, 72, 155, 103],
          [56, 58, 10, 171, 218, 189, 17, 13, 152],
          [114, 26, 17, 163, 44, 195, 21, 10, 173],
          [121, 24, 80, 195, 26, 62, 44, 64, 85],
          [144, 71, 10, 38, 171, 213, 144, 34, 26],
          [170, 46, 55, 19, 136, 160, 33, 206, 71],
          [63, 20, 8, 114, 114, 208, 12, 9, 226],
          [81, 40, 11, 96, 182, 84, 29, 16, 36]
        ],
        [
          [134, 183, 89, 137, 98, 101, 106, 165, 148],
          [72, 187, 100, 130, 157, 111, 32, 75, 80],
          [66, 102, 167, 99, 74, 62, 40, 234, 128],
          [41, 53, 9, 178, 241, 141, 26, 8, 107],
          [74, 43, 26, 146, 73, 166, 49, 23, 157],
          [65, 38, 105, 160, 51, 52, 31, 115, 128],
          [104, 79, 12, 27, 217, 255, 87, 17, 7],
          [87, 68, 71, 44, 114, 51, 15, 186, 23],
          [47, 41, 14, 110, 182, 183, 21, 17, 194],
          [66, 45, 25, 102, 197, 189, 23, 18, 22]
        ],
        [
          [88, 88, 147, 150, 42, 46, 45, 196, 205],
          [43, 97, 183, 117, 85, 38, 35, 179, 61],
          [39, 53, 200, 87, 26, 21, 43, 232, 171],
          [56, 34, 51, 104, 114, 102, 29, 93, 77],
          [39, 28, 85, 171, 58, 165, 90, 98, 64],
          [34, 22, 116, 206, 23, 34, 43, 166, 73],
          [107, 54, 32, 26, 51, 1, 81, 43, 31],
          [68, 25, 106, 22, 64, 171, 36, 225, 114],
          [34, 19, 21, 102, 132, 188, 16, 76, 124],
          [62, 18, 78, 95, 85, 57, 50, 48, 51]
        ],
        [
          [193, 101, 35, 159, 215, 111, 89, 46, 111],
          [60, 148, 31, 172, 219, 228, 21, 18, 111],
          [112, 113, 77, 85, 179, 255, 38, 120, 114],
          [40, 42, 1, 196, 245, 209, 10, 25, 109],
          [88, 43, 29, 140, 166, 213, 37, 43, 154],
          [61, 63, 30, 155, 67, 45, 68, 1, 209],
          [100, 80, 8, 43, 154, 1, 51, 26, 71],
          [142, 78, 78, 16, 255, 128, 34, 197, 171],
          [41, 40, 5, 102, 211, 183, 4, 1, 221],
          [51, 50, 17, 168, 209, 192, 23, 25, 82]
        ],
        [
          [138, 31, 36, 171, 27, 166, 38, 44, 229],
          [67, 87, 58, 169, 82, 115, 26, 59, 179],
          [63, 59, 90, 180, 59, 166, 93, 73, 154],
          [40, 40, 21, 116, 143, 209, 34, 39, 175],
          [47, 15, 16, 183, 34, 223, 49, 45, 183],
          [46, 17, 33, 183, 6, 98, 15, 32, 183],
          [57, 46, 22, 24, 128, 1, 54, 17, 37],
          [65, 32, 73, 115, 28, 128, 23, 128, 205],
          [40, 3, 9, 115, 51, 192, 18, 6, 223],
          [87, 37, 9, 115, 59, 77, 64, 21, 47]
        ],
        [
          [104, 55, 44, 218, 9, 54, 53, 130, 226],
          [64, 90, 70, 205, 40, 41, 23, 26, 57],
          [54, 57, 112, 184, 5, 41, 38, 166, 213],
          [30, 34, 26, 133, 152, 116, 10, 32, 134],
          [39, 19, 53, 221, 26, 114, 32, 73, 255],
          [31, 9, 65, 234, 2, 15, 1, 118, 73],
          [75, 32, 12, 51, 192, 255, 160, 43, 51],
          [88, 31, 35, 67, 102, 85, 55, 186, 85],
          [56, 21, 23, 111, 59, 205, 45, 37, 192],
          [55, 38, 70, 124, 73, 102, 1, 34, 98]
        ],
        [
          [125, 98, 42, 88, 104, 85, 117, 175, 82],
          [95, 84, 53, 89, 128, 100, 113, 101, 45],
          [75, 79, 123, 47, 51, 128, 81, 171, 1],
          [57, 17, 5, 71, 102, 57, 53, 41, 49],
          [38, 33, 13, 121, 57, 73, 26, 1, 85],
          [41, 10, 67, 138, 77, 110, 90, 47, 114],
          [115, 21, 2, 10, 102, 255, 166, 23, 6],
          [101, 29, 16, 10, 85, 128, 101, 196, 26],
          [57, 18, 10, 102, 102, 213, 34, 20, 43],
          [117, 20, 15, 36, 163, 128, 68, 1, 26]
        ],
        [
          [102, 61, 71, 37, 34, 53, 31, 243, 192],
          [69, 60, 71, 38, 73, 119, 28, 222, 37],
          [68, 45, 128, 34, 1, 47, 11, 245, 171],
          [62, 17, 19, 70, 146, 85, 55, 62, 70],
          [37, 43, 37, 154, 100, 163, 85, 160, 1],
          [63, 9, 92, 136, 28, 64, 32, 201, 85],
          [75, 15, 9, 9, 64, 255, 184, 119, 16],
          [86, 6, 28, 5, 64, 255, 25, 248, 1],
          [56, 8, 17, 132, 137, 255, 55, 116, 128],
          [58, 15, 20, 82, 135, 57, 26, 121, 40]
        ],
        [
          [164, 50, 31, 137, 154, 133, 25, 35, 218],
          [51, 103, 44, 131, 131, 123, 31, 6, 158],
          [86, 40, 64, 135, 148, 224, 45, 183, 128],
          [22, 26, 17, 131, 240, 154, 14, 1, 209],
          [45, 16, 21, 91, 64, 222, 7, 1, 197],
          [56, 21, 39, 155, 60, 138, 23, 102, 213],
          [83, 12, 13, 54, 192, 255, 68, 47, 28],
          [85, 26, 85, 85, 128, 128, 32, 146, 171],
          [18, 11, 7, 63, 144, 171, 4, 4, 246],
          [35, 27, 10, 146, 174, 171, 12, 26, 128]
        ],
        [
          [190, 80, 35, 99, 180, 80, 126, 54, 45],
          [85, 126, 47, 87, 176, 51, 41, 20, 32],
          [101, 75, 128, 139, 118, 146, 116, 128, 85],
          [56, 41, 15, 176, 236, 85, 37, 9, 62],
          [71, 30, 17, 119, 118, 255, 17, 18, 138],
          [101, 38, 60, 138, 55, 70, 43, 26, 142],
          [146, 36, 19, 30, 171, 255, 97, 27, 20],
          [138, 45, 61, 62, 219, 1, 81, 188, 64],
          [32, 41, 20, 117, 151, 142, 20, 21, 163],
          [112, 19, 12, 61, 195, 128, 48, 4, 24]
        ]
      ],
      Ee = [
        [
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [176, 246, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [223, 241, 252, 255, 255, 255, 255, 255, 255, 255, 255],
            [249, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 244, 252, 255, 255, 255, 255, 255, 255, 255, 255],
            [234, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 246, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [239, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 248, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [251, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [251, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 254, 253, 255, 254, 255, 255, 255, 255, 255, 255],
            [250, 255, 254, 255, 254, 255, 255, 255, 255, 255, 255],
            [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ]
        ],
        [
          [
            [217, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [225, 252, 241, 253, 255, 255, 254, 255, 255, 255, 255],
            [234, 250, 241, 250, 253, 255, 253, 254, 255, 255, 255]
          ],
          [
            [255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [223, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [238, 253, 254, 254, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 248, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [249, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 253, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [247, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [252, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 254, 253, 255, 255, 255, 255, 255, 255, 255, 255],
            [250, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ]
        ],
        [
          [
            [186, 251, 250, 255, 255, 255, 255, 255, 255, 255, 255],
            [234, 251, 244, 254, 255, 255, 255, 255, 255, 255, 255],
            [251, 251, 243, 253, 254, 255, 254, 255, 255, 255, 255]
          ],
          [
            [255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [236, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [251, 253, 253, 254, 254, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ]
        ],
        [
          [
            [248, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [250, 254, 252, 254, 255, 255, 255, 255, 255, 255, 255],
            [248, 254, 249, 253, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255],
            [246, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255],
            [252, 254, 251, 254, 254, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 254, 252, 255, 255, 255, 255, 255, 255, 255, 255],
            [248, 254, 253, 255, 255, 255, 255, 255, 255, 255, 255],
            [253, 255, 254, 254, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 251, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [245, 251, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [253, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 251, 253, 255, 255, 255, 255, 255, 255, 255, 255],
            [252, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 252, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [249, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 253, 255, 255, 255, 255, 255, 255, 255, 255],
            [250, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ],
          [
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]
          ]
        ]
      ],
      Ge = [0, 1, 2, 3, 6, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 7, 0],
      Nc,
      Y = [],
      W = [],
      ka = [],
      Za,
      fd,
      Nb,
      pa,
      Ob,
      Xc,
      Tc,
      Yc,
      Uc,
      Zc,
      Vc,
      $c,
      Wc,
      Rc,
      Pc,
      Sc,
      Qc,
      re = 1,
      Cc = 2,
      ia = [],
      za,
      vc,
      fc,
      Fc,
      P = [];
    va("UpsampleRgbLinePair", Ga, 3);
    va("UpsampleBgrLinePair", Tb, 3);
    va("UpsampleRgbaLinePair", wd, 4);
    va("UpsampleBgraLinePair", vd, 4);
    va("UpsampleArgbLinePair", ud, 4);
    va("UpsampleRgba4444LinePair", td, 2);
    va("UpsampleRgb565LinePair", sd, 2);
    var Mf = self.UpsampleRgbLinePair,
      Nf = self.UpsampleBgrLinePair,
      nd = self.UpsampleRgbaLinePair,
      od = self.UpsampleBgraLinePair,
      pd = self.UpsampleArgbLinePair,
      qd = self.UpsampleRgba4444LinePair,
      Of = self.UpsampleRgb565LinePair,
      Wa = 16,
      Ba = 1 << (Wa - 1),
      ta = -227,
      Eb = 482,
      rd = 6,
      Pf = (256 << rd) - 1,
      jc = 0,
      Yd = V(256),
      ae = V(256),
      $d = V(256),
      Zd = V(256),
      be = V(Eb - ta),
      ce = V(Eb - ta);
    la("YuvToRgbRow", Ga, 3);
    la("YuvToBgrRow", Tb, 3);
    la("YuvToRgbaRow", wd, 4);
    la("YuvToBgraRow", vd, 4);
    la("YuvToArgbRow", ud, 4);
    la("YuvToRgba4444Row", td, 2);
    la("YuvToRgb565Row", sd, 2);
    var zd = [
        0,
        4,
        8,
        12,
        128,
        132,
        136,
        140,
        256,
        260,
        264,
        268,
        384,
        388,
        392,
        396
      ],
      Ya = [0, 2, 8],
      Qf = [8, 7, 6, 4, 4, 2, 2, 2, 1, 1, 1, 1],
      Ne = 1;
    this.WebPDecodeRGBA = function(a, b, c, d, e) {
      var f = Ua;
      var g = new Cf(),
        h = new Cb();
      g.ba = h;
      h.S = f;
      h.width = [h.width];
      h.height = [h.height];
      var k = h.width;
      var l = h.height,
        m = new Td();
      if (null == m || null == a) var n = 2;
      else
        x(null != m),
          (n = Ad(a, b, c, m.width, m.height, m.Pd, m.Qd, m.format, null));
      0 != n
        ? (k = 0)
        : (null != k && (k[0] = m.width[0]),
          null != l && (l[0] = m.height[0]),
          (k = 1));
      if (k) {
        h.width = h.width[0];
        h.height = h.height[0];
        null != d && (d[0] = h.width);
        null != e && (e[0] = h.height);
        b: {
          d = new Oa();
          e = new md();
          e.data = a;
          e.w = b;
          e.ha = c;
          e.kd = 1;
          b = [0];
          x(null != e);
          a = Ad(e.data, e.w, e.ha, null, null, null, b, null, e);
          (0 == a || 7 == a) && b[0] && (a = 4);
          b = a;
          if (0 == b) {
            x(null != g);
            d.data = e.data;
            d.w = e.w + e.offset;
            d.ha = e.ha - e.offset;
            d.put = kc;
            d.ac = gc;
            d.bc = lc;
            d.ma = g;
            if (e.xa) {
              a = Bc();
              if (null == a) {
                g = 1;
                break b;
              }
              if (te(a, d)) {
                b = Cd(d.width, d.height, g.Oa, g.ba);
                if ((d = 0 == b)) {
                  c: {
                    d = a;
                    d: for (;;) {
                      if (null == d) {
                        d = 0;
                        break c;
                      }
                      x(null != d.s.yc);
                      x(null != d.s.Ya);
                      x(0 < d.s.Wb);
                      c = d.l;
                      x(null != c);
                      e = c.ma;
                      x(null != e);
                      if (0 != d.xb) {
                        d.ca = e.ba;
                        d.tb = e.tb;
                        x(null != d.ca);
                        if (!hc(e.Oa, c, Va)) {
                          d.a = 2;
                          break d;
                        }
                        if (!Ec(d, c.width)) break d;
                        if (c.da) break d;
                        (c.da || hb(d.ca.S)) && Aa();
                        11 > d.ca.S ||
                          (alert("todo:WebPInitConvertARGBToYUV"),
                          null != d.ca.f.kb.F && Aa());
                        if (
                          d.Pb &&
                          0 < d.s.ua &&
                          null == d.s.vb.X &&
                          !Zb(d.s.vb, d.s.Wa.Xa)
                        ) {
                          d.a = 1;
                          break d;
                        }
                        d.xb = 0;
                      }
                      if (!Jb(d, d.V, d.Ba, d.c, d.i, c.o, ge)) break d;
                      e.Dc = d.Ma;
                      d = 1;
                      break c;
                    }
                    x(0 != d.a);
                    d = 0;
                  }
                  d = !d;
                }
                d && (b = a.a);
              } else b = a.a;
            } else {
              a = new Ce();
              if (null == a) {
                g = 1;
                break b;
              }
              a.Fa = e.na;
              a.P = e.P;
              a.qc = e.Sa;
              if (Kc(a, d)) {
                if (((b = Cd(d.width, d.height, g.Oa, g.ba)), 0 == b)) {
                  a.Aa = 0;
                  c = g.Oa;
                  e = a;
                  x(null != e);
                  if (null != c) {
                    k = c.Md;
                    k = 0 > k ? 0 : 100 < k ? 255 : (255 * k) / 100;
                    if (0 < k) {
                      for (l = m = 0; 4 > l; ++l)
                        (n = e.pb[l]),
                          12 > n.lc &&
                            (n.ia = (k * Qf[0 > n.lc ? 0 : n.lc]) >> 3),
                          (m |= n.ia);
                      m && (alert("todo:VP8InitRandom"), (e.ia = 1));
                    }
                    e.Ga = c.Id;
                    100 < e.Ga ? (e.Ga = 100) : 0 > e.Ga && (e.Ga = 0);
                  }
                  Me(a, d) || (b = a.a);
                }
              } else b = a.a;
            }
            0 == b && null != g.Oa && g.Oa.fd && (b = Bd(g.ba));
          }
          g = b;
        }
        f = 0 != g ? null : 11 > f ? h.f.RGBA.eb : h.f.kb.y;
      } else f = null;
      return f;
    };
    var Dd = [3, 4, 3, 4, 4, 2, 2, 4, 4, 4, 2, 1, 1];
  };
  new WebPDecoder();

  /** @license
   * Copyright (c) 2017 Dominik Homberger

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

https://webpjs.appspot.com
WebPRiffParser dominikhlbg@gmail.com
*/

  function memcmp(data, data_off, str, size) {
    for (var i = 0; i < size; i++)
      if (data[data_off + i] != str.charCodeAt(i)) return true;
    return false;
  }

  function GetTag(data, data_off) {
    var str = "";
    for (var i = 0; i < 4; i++) str += String.fromCharCode(data[data_off++]);
    return str;
  }

  function GetLE16(data, data_off) {
    return (data[data_off + 0] << 0) | (data[data_off + 1] << 8);
  }

  function GetLE24(data, data_off) {
    return (
      ((data[data_off + 0] << 0) |
        (data[data_off + 1] << 8) |
        (data[data_off + 2] << 16)) >>>
      0
    );
  }

  function GetLE32(data, data_off) {
    return (
      ((data[data_off + 0] << 0) |
        (data[data_off + 1] << 8) |
        (data[data_off + 2] << 16) |
        (data[data_off + 3] << 24)) >>>
      0
    );
  }

  function WebPRiffParser(src, src_off) {
    var imagearray = {};
    var i = 0;
    var alpha_chunk = false;
    var alpha_size = 0;
    var alpha_offset = 0;
    imagearray["frames"] = [];
    if (memcmp(src, src_off, "RIFF", 4)) return;
    src_off += 4;
    var riff_size = GetLE32(src, src_off) + 8;
    src_off += 8;

    while (src_off < src.length) {
      var fourcc = GetTag(src, src_off);
      src_off += 4;

      var payload_size = GetLE32(src, src_off);
      src_off += 4;
      var payload_size_padded = payload_size + (payload_size & 1);

      switch (fourcc) {
        case "VP8 ":
        case "VP8L":
          if (typeof imagearray["frames"][i] === "undefined")
            imagearray["frames"][i] = {};
          var obj = imagearray["frames"][i];
          var height = [0];
          var width = [0];
          obj["src_off"] = alpha_chunk ? alpha_offset : src_off - 8;
          obj["src_size"] = alpha_size + payload_size + 8;
          //var rgba = webpdecoder.WebPDecodeRGBA(src,(alpha_chunk?alpha_offset:src_off-8),alpha_size+payload_size+8,width,height);
          //imagearray[i]={'rgba':rgba,'width':width[0],'height':height[0]};
          i++;
          if (alpha_chunk) {
            alpha_chunk = false;
            alpha_size = 0;
            alpha_offset = 0;
          }
          break;
        case "VP8X":
          var obj = (imagearray["header"] = {});
          var feature_flags = (obj["feature_flags"] = src[src_off]);
          var src_off_ = src_off + 4;
          var canvas_width = (obj["canvas_width"] = 1 + GetLE24(src, src_off_));
          src_off_ += 3;
          var canvas_height = (obj["canvas_height"] =
            1 + GetLE24(src, src_off_));
          src_off_ += 3;
          break;
        case "ALPH":
          alpha_chunk = true;
          alpha_size = payload_size_padded + 8;
          alpha_offset = src_off - 8;
          break;

        case "ANIM":
          var obj = imagearray["header"];
          var bgcolor = (obj["bgcolor"] = GetLE32(src, src_off));
          src_off_ = src_off + 4;

          var loop_count = (obj["loop_count"] = GetLE16(src, src_off_));
          src_off_ += 2;
          break;
        case "ANMF":
          var offset_x = 0,
            offset_y = 0,
            width = 0,
            height = 0,
            duration = 0,
            blend = 0,
            dispose = 0,
            temp = 0;
          var obj = (imagearray["frames"][i] = {});
          obj["offset_x"] = offset_x = 2 * GetLE24(src, src_off);
          src_off += 3;
          obj["offset_y"] = offset_y = 2 * GetLE24(src, src_off);
          src_off += 3;
          obj["width"] = width = 1 + GetLE24(src, src_off);
          src_off += 3;
          obj["height"] = height = 1 + GetLE24(src, src_off);
          src_off += 3;
          obj["duration"] = duration = GetLE24(src, src_off);
          src_off += 3;
          temp = src[src_off++];
          obj["dispose"] = dispose = temp & 1;
          obj["blend"] = blend = (temp >> 1) & 1;
          break;
      }
      if (fourcc != "ANMF") src_off += payload_size_padded;
    }
    return imagearray;
  }

  var height = [0];
  var width = [0];
  var pixels = [];
  var webpdecoder = new WebPDecoder();

  var response = imageData;
  var imagearray = WebPRiffParser(response, 0);
  imagearray["response"] = response;
  imagearray["rgbaoutput"] = true;
  imagearray["dataurl"] = false;

  var header = imagearray["header"] ? imagearray["header"] : null;
  var frames = imagearray["frames"] ? imagearray["frames"] : null;

  if (header) {
    header["loop_counter"] = header["loop_count"];
    height = [header["canvas_height"]];
    width = [header["canvas_width"]];
    for (var f = 0; f < frames.length; f++)
      if (frames[f]["blend"] == 0) {
        break;
      }
  }

  var frame = frames[0];
  var rgba = webpdecoder.WebPDecodeRGBA(
    response,
    frame["src_off"],
    frame["src_size"],
    width,
    height
  );
  frame["rgba"] = rgba;
  frame["imgwidth"] = width[0];
  frame["imgheight"] = height[0];

  for (var i = 0; i < width[0] * height[0] * 4; i++) {
    pixels[i] = rgba[i];
  }

  this.width = width;
  this.height = height;
  this.data = pixels;
  return this;
}

WebPDecoder.prototype.getData = function() {
  return this.data;
};

/**
 * @license
 * Copyright (c) 2019 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * jsPDF webp Support PlugIn
 *
 * @name webp_support
 * @module
 */
(function(jsPDFAPI) {

  jsPDFAPI.processWEBP = function(imageData, index, alias, compression) {
    var reader = new WebPDecoder(imageData, false);
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
    return jsPDFAPI.processJPEG.call(this, data, index, alias, compression);
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
(function(jsPDFAPI) {

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
  jsPDFAPI.setLanguage = function(langCode) {

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
        this.internal.events.subscribe("putCatalog", function() {
          this.internal.write(
            "/Lang (" + this.internal.languageSettings.languageCode + ")"
          );
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
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

/**
 * jsPDF split_text_to_size plugin
 *
 * @name split_text_to_size
 * @module
 */
(function(API) {
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
  var getCharWidthsArray = (API.getCharWidthsArray = function(text, options) {
    options = options || {};

    var activeFont = options.font || this.internal.getFont();
    var fontSize = options.fontSize || this.internal.getFontSize();
    var charSpace = options.charSpace || this.internal.getCharSpace();

    var widths = options.widths
      ? options.widths
      : activeFont.metadata.Unicode.widths;
    var widthsFractionOf = widths.fof ? widths.fof : 1;
    var kerning = options.kerning
      ? options.kerning
      : activeFont.metadata.Unicode.kerning;
    var kerningFractionOf = kerning.fof ? kerning.fof : 1;
    var doKerning = options.doKerning === false ? false : true;
    var kerningValue = 0;

    var i;
    var length = text.length;
    var char_code;
    var prior_char_code = 0; //for kerning
    var default_char_width = widths[0] || widthsFractionOf;
    var output = [];

    for (i = 0; i < length; i++) {
      char_code = text.charCodeAt(i);

      if (typeof activeFont.metadata.widthOfString === "function") {
        output.push(
          (activeFont.metadata.widthOfGlyph(
            activeFont.metadata.characterToGlyph(char_code)
          ) +
            charSpace * (1000 / fontSize) || 0) / 1000
        );
      } else {
        if (
          doKerning &&
          typeof kerning[char_code] === "object" &&
          !isNaN(parseInt(kerning[char_code][prior_char_code], 10))
        ) {
          kerningValue =
            kerning[char_code][prior_char_code] / kerningFractionOf;
        } else {
          kerningValue = 0;
        }
        output.push(
          (widths[char_code] || default_char_width) / widthsFractionOf +
            kerningValue
        );
      }
      prior_char_code = char_code;
    }

    return output;
  });

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
  var getStringUnitWidth = (API.getStringUnitWidth = function(text, options) {
    options = options || {};

    var fontSize = options.fontSize || this.internal.getFontSize();
    var font = options.font || this.internal.getFont();
    var charSpace = options.charSpace || this.internal.getCharSpace();
    var result = 0;

    if (API.processArabic) {
      text = API.processArabic(text);
    }

    if (typeof font.metadata.widthOfString === "function") {
      result =
        font.metadata.widthOfString(text, fontSize, charSpace) / fontSize;
    } else {
      result = getCharWidthsArray
        .apply(this, arguments)
        .reduce(function(pv, cv) {
          return pv + cv;
        }, 0);
    }
    return result;
  });

  /**
  returns array of lines
  */
  var splitLongWord = function(word, widths_array, firstLineMaxLen, maxLen) {
    var answer = [];

    // 1st, chop off the piece that can fit on the hanging line.
    var i = 0,
      l = word.length,
      workingLen = 0;
    while (i !== l && workingLen + widths_array[i] < firstLineMaxLen) {
      workingLen += widths_array[i];
      i++;
    }
    // this is first line.
    answer.push(word.slice(0, i));

    // 2nd. Split the rest into maxLen pieces.
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
  };

  // Note, all sizing inputs for this function must be in "font measurement units"
  // By default, for PDF, it's "point".
  var splitParagraphIntoLines = function(text, maxlen, options) {
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
      words.map(function(wrd) {
        wrd = wrd.split(/\s*\n/);
        if (wrd.length > 1) {
          wrds = wrds.concat(
            wrd.map(function(wrd, idx) {
              return (idx && wrd.length ? "\n" : "") + wrd;
            })
          );
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
      current_word_length = widths_array.reduce(function(pv, cv) {
        return pv + cv;
      }, 0);

      if (
        line_length + separator_length + current_word_length > maxlen ||
        force
      ) {
        if (current_word_length > maxlen) {
          // this happens when you have space-less long URLs for example.
          // we just chop these to size. We do NOT insert hiphens
          tmp = splitLongWord.apply(this, [
            word,
            widths_array,
            maxlen - (line_length + separator_length),
            maxlen
          ]);
          // first line we add to existing line object
          line.push(tmp.shift()); // it's ok to have extra space indicator there
          // last line we make into new line object
          line = [tmp.pop()];
          // lines in the middle we apped to lines object as whole lines
          while (tmp.length) {
            lines.push([tmp.shift()]); // single fragment occupies whole line
          }
          current_word_length = widths_array
            .slice(word.length - (line[0] ? line[0].length : 0))
            .reduce(function(pv, cv) {
              return pv + cv;
            }, 0);
        } else {
          // just put it on a new line
          line = [word];
        }

        // now we attach new line to lines
        lines.push(line);
        line_length = current_word_length + lineIndent;
        separator_length = spaceCharWidth;
      } else {
        line.push(word);

        line_length += separator_length + current_word_length;
        separator_length = spaceCharWidth;
      }
    }

    var postProcess;
    if (lineIndent) {
      postProcess = function(ln, idx) {
        return (idx ? pad : "") + ln.join(" ");
      };
    } else {
      postProcess = function(ln) {
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
  API.splitTextToSize = function(text, maxlen, options) {

    options = options || {};

    var fsize = options.fontSize || this.internal.getFontSize(),
      newOptions = function(options) {
        var widths = {
            0: 1
          },
          kerning = {};

        if (!options.widths || !options.kerning) {
          var f = this.internal.getFont(options.fontName, options.fontStyle),
            encoding = "Unicode";
          // NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE
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
        }
      }.call(this, options);

    // first we split on end-of-line chars
    var paragraphs;
    if (Array.isArray(text)) {
      paragraphs = text;
    } else {
      paragraphs = String(text).split(/\r?\n/);
    }

    // now we convert size (max length of line) into "font size units"
    // at present time, the "font size unit" is always 'point'
    // 'proportional' means, "in proportion to font size"
    var fontUnit_maxLen = (1.0 * this.internal.scaleFactor * maxlen) / fsize;
    // at this time, fsize is always in "points" regardless of the default measurement unit of the doc.
    // this may change in the future?
    // until then, proportional_maxlen is likely to be in 'points'

    // If first line is to be indented (shorter or longer) than maxLen
    // we indicate that by using CSS-style "text-indent" option.
    // here it's in font units too (which is likely 'points')
    // it can be negative (which makes the first line longer than maxLen)
    newOptions.textIndent = options.textIndent
      ? (options.textIndent * 1.0 * this.internal.scaleFactor) / fsize
      : 0;
    newOptions.lineIndent = options.lineIndent;

    var i,
      l,
      output = [];
    for (i = 0, l = paragraphs.length; i < l; i++) {
      output = output.concat(
        splitParagraphIntoLines.apply(this, [
          paragraphs[i],
          fontUnit_maxLen,
          newOptions
        ])
      );
    }

    return output;
  };
})(jsPDF.API);

/** @license
 jsPDF standard_fonts_metrics plugin
 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
 * MIT license.
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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

(function(API) {
  API.__fontmetrics__ = API.__fontmetrics__ || {};

  var decoded = "0123456789abcdef",
    encoded = "klmnopqrstuvwxyz",
    mappingUncompress = {},
    mappingCompress = {};

  for (var i = 0; i < encoded.length; i++) {
    mappingUncompress[encoded[i]] = decoded[i];
    mappingCompress[decoded[i]] = encoded[i];
  }

  var hex = function(value) {
    return "0x" + parseInt(value, 10).toString(16);
  };

  var compress = (API.__fontmetrics__.compress = function(data) {
    var vals = ["{"];
    var value, keystring, valuestring, numberprefix;

    for (var key in data) {
      value = data[key];

      if (!isNaN(parseInt(key, 10))) {
        key = parseInt(key, 10);
        keystring = hex(key).slice(2);
        keystring =
          keystring.slice(0, -1) + mappingCompress[keystring.slice(-1)];
      } else {
        keystring = "'" + key + "'";
      }

      if (typeof value == "number") {
        if (value < 0) {
          valuestring = hex(value).slice(3);
          numberprefix = "-";
        } else {
          valuestring = hex(value).slice(2);
          numberprefix = "";
        }
        valuestring =
          numberprefix +
          valuestring.slice(0, -1) +
          mappingCompress[valuestring.slice(-1)];
      } else {
        if (typeof value === "object") {
          valuestring = compress(value);
        } else {
          throw new Error(
            "Don't know what to do with value type " + typeof value + "."
          );
        }
      }
      vals.push(keystring + valuestring);
    }
    vals.push("}");
    return vals.join("");
  });

  /**
   * Uncompresses data compressed into custom, base16-like format.
   *
   * @public
   * @function
   * @param
   * @returns {Type}
   */
  var uncompress = (API.__fontmetrics__.uncompress = function(data) {
    if (typeof data !== "string") {
      throw new Error("Invalid argument passed to uncompress.");
    }

    var output = {},
      sign = 1,
      stringparts, // undef. will be [] in string mode
      activeobject = output,
      parentchain = [],
      parent_key_pair,
      keyparts = "",
      valueparts = "",
      key, // undef. will be Truthy when Key is resolved.
      datalen = data.length - 1, // stripping ending }
      ch;

    for (var i = 1; i < datalen; i += 1) {
      // - { } ' are special.

      ch = data[i];

      if (ch == "'") {
        if (stringparts) {
          // end of string mode
          key = stringparts.join("");
          stringparts = undefined;
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
        key = undefined;
      } else if (ch == "}") {
        // end of object
        parent_key_pair = parentchain.pop();
        parent_key_pair[0][parent_key_pair[1]] = activeobject;
        key = undefined;
        activeobject = parent_key_pair[0];
      } else if (ch == "-") {
        sign = -1;
      } else {
        // must be number
        if (key === undefined) {
          if (mappingUncompress.hasOwnProperty(ch)) {
            keyparts += mappingUncompress[ch];
            key = parseInt(keyparts, 16) * sign;
            sign = +1;
            keyparts = "";
          } else {
            keyparts += ch;
          }
        } else {
          if (mappingUncompress.hasOwnProperty(ch)) {
            valueparts += mappingUncompress[ch];
            activeobject[key] = parseInt(valueparts, 16) * sign;
            sign = +1;
            key = undefined;
            valueparts = "";
          } else {
            valueparts += ch;
          }
        }
      }
    }
    return output;
  });

  // encoding = 'Unicode'
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
    WinAnsiEncoding: uncompress(
      "{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}"
    )
  };
  var encodings = {
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
      "Times-Italic": encodingBlock
      //	, 'Symbol'
      //	, 'ZapfDingbats'
    }
  };

  var fontMetrics = {
    Unicode: {
      // all sizing numbers are n/fontMetricsFractionOf = one font size unit
      // this means that if fontMetricsFractionOf = 1000, and letter A's width is 476, it's
      // width is 476/1000 or 47.6% of its height (regardless of font size)
      // At this time this value applies to "widths" and "kerning" numbers.

      // char code 0 represents "default" (average) width - use it for chars missing in this table.
      // key 'fof' represents the "fontMetricsFractionOf" value

      "Courier-Oblique": uncompress(
        "{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"
      ),
      "Times-BoldItalic": uncompress(
        "{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"
      ),
      "Helvetica-Bold": uncompress(
        "{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"
      ),
      Courier: uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
      "Courier-BoldOblique": uncompress(
        "{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"
      ),
      "Times-Bold": uncompress(
        "{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}"
      ),
      Symbol: uncompress(
        "{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}"
      ),
      Helvetica: uncompress(
        "{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"
      ),
      "Helvetica-BoldOblique": uncompress(
        "{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"
      ),
      ZapfDingbats: uncompress("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}"),
      "Courier-Bold": uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
      "Times-Italic": uncompress(
        "{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"
      ),
      "Times-Roman": uncompress(
        "{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"
      ),
      "Helvetica-Oblique": uncompress(
        "{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"
      )
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
  API.events.push([
    "addFont",
    function(data) {
      var font = data.font;

      var metrics = fontMetrics["Unicode"][font.postScriptName];
      if (metrics) {
        font.metadata["Unicode"] = {};
        font.metadata["Unicode"].widths = metrics.widths;
        font.metadata["Unicode"].kerning = metrics.kerning;
      }

      var encodingBlock = encodings["Unicode"][font.postScriptName];
      if (encodingBlock) {
        font.metadata["Unicode"].encoding = encodingBlock;
        font.encoding = encodingBlock.codePages[0];
      }
    }
  ]); // end of adding event handler
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
(function(jsPDF) {

  var binaryStringToUint8Array = function(binary_string) {
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  };

  var addFont = function(font, file) {
    // eslint-disable-next-line no-control-regex
    if (/^\x00\x01\x00\x00/.test(file)) {
      file = binaryStringToUint8Array(file);
    } else {
      file = binaryStringToUint8Array(atob(file));
    }
    font.metadata = jsPDF.API.TTFFont.open(file);
    font.metadata.Unicode = font.metadata.Unicode || {
      encoding: {},
      kerning: {},
      widths: []
    };
    font.metadata.glyIdsUsed = [0];
  };

  jsPDF.API.events.push([
    "addFont",
    function(data) {
      var file = undefined;
      var font = data.font;
      var instance = data.instance;
      if (font.isStandardFont) {
        return;
      }
      if (typeof instance !== "undefined") {
        if (instance.existsFileInVFS(font.postScriptName) === false) {
          file = instance.loadFile(font.postScriptName);
        } else {
          file = instance.getFileFromVFS(font.postScriptName);
        }
        if (typeof file !== "string") {
          throw new Error(
            "Font is not stored as string-data in vFS, import fonts or remove declaration doc.addFont('" +
              font.postScriptName +
              "')."
          );
        }
        addFont(font, file);
      } else {
        throw new Error(
          "Font does not exist in vFS, import fonts or remove declaration doc.addFont('" +
            font.postScriptName +
            "')."
        );
      }
    }
  ]); // end of adding event handler
})(jsPDF);

/** @license
 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

/**
 * jsPDF SVG plugin
 *
 * @name svg
 * @module
 */
(function(jsPDFAPI) {

  function loadCanvg() {
    return (function() {
      if (globalObject["canvg"]) {
        return Promise.resolve(globalObject["canvg"]);
      }


      if (typeof exports === "object" && typeof module !== "undefined") {
        return new Promise(function(resolve, reject) {
          try {
            resolve(require("canvg"));
          } catch (e) {
            reject(e);
          }
        });
      }
      if (typeof define === "function" && define.amd) {
        return new Promise(function(resolve, reject) {
          try {
            require(["canvg"], resolve);
          } catch (e) {
            reject(e);
          }
        });
      }
      return Promise.reject(new Error("Could not load canvg"));
    })()
      .catch(function(e) {
        return Promise.reject(new Error("Could not load canvg: " + e));
      })
      .then(function(canvg) {
        return canvg.default ? canvg.default : canvg;
      });
  }

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
  jsPDFAPI.addSvgAsImage = function(
    svg,
    x,
    y,
    w,
    h,
    alias,
    compression,
    rotation
  ) {
    if (isNaN(x) || isNaN(y)) {
      console.error("jsPDF.addSvgAsImage: Invalid coordinates", arguments);
      throw new Error("Invalid coordinates passed to jsPDF.addSvgAsImage");
    }

    if (isNaN(w) || isNaN(h)) {
      console.error("jsPDF.addSvgAsImage: Invalid measurements", arguments);
      throw new Error(
        "Invalid measurements (width and/or height) passed to jsPDF.addSvgAsImage"
      );
    }

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; /// set white fill style
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var options = {
      ignoreMouse: true,
      ignoreAnimation: true,
      ignoreDimensions: true
    };
    var doc = this;
    return loadCanvg()
      .then(
        function(canvg) {
          return canvg.fromString(ctx, svg, options);
        },
        function() {
          return Promise.reject(new Error("Could not load canvg."));
        }
      )
      .then(function(instance) {
        return instance.render(options);
      })
      .then(function() {
        doc.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          x,
          y,
          w,
          h,
          compression,
          rotation
        );
      });
  };
})(jsPDF.API);

/**
 * @license
 * ====================================================================
 * Copyright (c) 2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

/**
 * jsPDF total_pages plugin
 * @name total_pages
 * @module
 */
(function(jsPDFAPI) {
  /**
   * @name putTotalPages
   * @function
   * @param {string} pageExpression Regular Expression
   * @returns {jsPDF} jsPDF-instance
   */

  jsPDFAPI.putTotalPages = function(pageExpression) {

    var replaceExpression;
    var totalNumberOfPages = 0;
    if (parseInt(this.internal.getFont().id.substr(1), 10) < 15) {
      replaceExpression = new RegExp(pageExpression, "g");
      totalNumberOfPages = this.internal.getNumberOfPages();
    } else {
      replaceExpression = new RegExp(
        this.pdfEscape16(pageExpression, this.internal.getFont()),
        "g"
      );
      totalNumberOfPages = this.pdfEscape16(
        this.internal.getNumberOfPages() + "",
        this.internal.getFont()
      );
    }

    for (var n = 1; n <= this.internal.getNumberOfPages(); n++) {
      for (var i = 0; i < this.internal.pages[n].length; i++) {
        this.internal.pages[n][i] = this.internal.pages[n][i].replace(
          replaceExpression,
          totalNumberOfPages
        );
      }
    }

    return this;
  };
})(jsPDF.API);

/**
 * @license
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
(function(jsPDFAPI) {
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
  jsPDFAPI.viewerPreferences = function(options, doReset) {
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
        valueSet: [
          "Simplex",
          "DuplexFlipShortEdge",
          "DuplexFlipLongEdge",
          "none"
        ],
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
    var isValid;

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
      this.internal.viewerpreferences.configuration = JSON.parse(
        JSON.stringify(configurationTemplate)
      );
      this.internal.viewerpreferences.isSubscribed = false;
    }
    configuration = this.internal.viewerpreferences.configuration;

    if (options === "reset" || doReset === true) {
      var len = configurationKeys.length;

      for (k = 0; k < len; k += 1) {
        configuration[configurationKeys[k]].value =
          configuration[configurationKeys[k]].defaultValue;
        configuration[configurationKeys[k]].explicitSet = false;
      }
    }

    if (typeof options === "object") {
      for (method in options) {
        value = options[method];
        if (
          arrayContainsElement(configurationKeys, method) &&
          value !== undefined
        ) {
          if (
            configuration[method].type === "boolean" &&
            typeof value === "boolean"
          ) {
            configuration[method].value = value;
          } else if (
            configuration[method].type === "name" &&
            arrayContainsElement(configuration[method].valueSet, value)
          ) {
            configuration[method].value = value;
          } else if (
            configuration[method].type === "integer" &&
            Number.isInteger(value)
          ) {
            configuration[method].value = value;
          } else if (configuration[method].type === "array") {
            for (i = 0; i < value.length; i += 1) {
              isValid = true;
              if (value[i].length === 1 && typeof value[i][0] === "number") {
                rangeArray.push(String(value[i] - 1));
              } else if (value[i].length > 1) {
                for (j = 0; j < value[i].length; j += 1) {
                  if (typeof value[i][j] !== "number") {
                    isValid = false;
                  }
                }
                if (isValid === true) {
                  rangeArray.push([value[i][0] - 1, value[i][1] - 1].join(" "));
                }
              }
            }
            configuration[method].value = "[" + rangeArray.join(" ") + "]";
          } else {
            configuration[method].value = configuration[method].defaultValue;
          }

          configuration[method].explicitSet = true;
        }
      }
    }

    if (this.internal.viewerpreferences.isSubscribed === false) {
      this.internal.events.subscribe("putCatalog", function() {
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
          this.internal.write(
            "/ViewerPreferences\n<<\n" + pdfDict.join("\n") + "\n>>"
          );
        }
      });
      this.internal.viewerpreferences.isSubscribed = true;
    }

    this.internal.viewerpreferences.configuration = configuration;
    return this;
  };
})(jsPDF.API);

/** ====================================================================
 * @license
 * jsPDF XMP metadata plugin
 * Copyright (c) 2016 Jussi Utunen, u-jussi@suomi24.fi
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

/**
 * @name xmp_metadata
 * @module
 */
(function(jsPDFAPI) {

  var postPutResources = function() {
    var xmpmeta_beginning = '<x:xmpmeta xmlns:x="adobe:ns:meta/">';
    var rdf_beginning =
      '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:jspdf="' +
      this.internal.__metadata__.namespaceuri +
      '"><jspdf:metadata>';
    var rdf_ending = "</jspdf:metadata></rdf:Description></rdf:RDF>";
    var xmpmeta_ending = "</x:xmpmeta>";
    var utf8_xmpmeta_beginning = unescape(
      encodeURIComponent(xmpmeta_beginning)
    );
    var utf8_rdf_beginning = unescape(encodeURIComponent(rdf_beginning));
    var utf8_metadata = unescape(
      encodeURIComponent(this.internal.__metadata__.metadata)
    );
    var utf8_rdf_ending = unescape(encodeURIComponent(rdf_ending));
    var utf8_xmpmeta_ending = unescape(encodeURIComponent(xmpmeta_ending));

    var total_len =
      utf8_rdf_beginning.length +
      utf8_metadata.length +
      utf8_rdf_ending.length +
      utf8_xmpmeta_beginning.length +
      utf8_xmpmeta_ending.length;

    this.internal.__metadata__.metadata_object_number = this.internal.newObject();
    this.internal.write(
      "<< /Type /Metadata /Subtype /XML /Length " + total_len + " >>"
    );
    this.internal.write("stream");
    this.internal.write(
      utf8_xmpmeta_beginning +
        utf8_rdf_beginning +
        utf8_metadata +
        utf8_rdf_ending +
        utf8_xmpmeta_ending
    );
    this.internal.write("endstream");
    this.internal.write("endobj");
  };

  var putCatalog = function() {
    if (this.internal.__metadata__.metadata_object_number) {
      this.internal.write(
        "/Metadata " +
          this.internal.__metadata__.metadata_object_number +
          " 0 R"
      );
    }
  };

  /**
   * Adds XMP formatted metadata to PDF
   *
   * @name addMetadata
   * @function
   * @param {String} metadata The actual metadata to be added. The metadata shall be stored as XMP simple value. Note that if the metadata string contains XML markup characters "<", ">" or "&", those characters should be written using XML entities.
   * @param {String} namespaceuri Sets the namespace URI for the metadata. Last character should be slash or hash.
   * @returns {jsPDF} jsPDF-instance
   */
  jsPDFAPI.addMetadata = function(metadata, namespaceuri) {
    if (typeof this.internal.__metadata__ === "undefined") {
      this.internal.__metadata__ = {
        metadata: metadata,
        namespaceuri: namespaceuri || "http://jspdf.default.namespaceuri/"
      };
      this.internal.events.subscribe("putCatalog", putCatalog);

      this.internal.events.subscribe("postPutResources", postPutResources);
    }
    return this;
  };
})(jsPDF.API);

/**
 * @name utf8
 * @module
 */
(function(jsPDF) {
  var jsPDFAPI = jsPDF.API;

  /***************************************************************************************************/
  /* function : pdfEscape16                                                                          */
  /* comment : The character id of a 2-byte string is converted to a hexadecimal number by obtaining */
  /*   the corresponding glyph id and width, and then adding padding to the string.                  */
  /***************************************************************************************************/
  var pdfEscape16 = (jsPDFAPI.pdfEscape16 = function(text, font) {
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
  });

  var toUnicodeCmap = function(map) {
    var code, codes, range, unicode, unicodeMap, _i, _len;
    unicodeMap =
      "/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000><ffff>\nendcodespacerange";
    codes = Object.keys(map).sort(function(a, b) {
      return a - b;
    });

    range = [];
    for (_i = 0, _len = codes.length; _i < _len; _i++) {
      code = codes[_i];
      if (range.length >= 100) {
        unicodeMap +=
          "\n" +
          range.length +
          " beginbfchar\n" +
          range.join("\n") +
          "\nendbfchar";
        range = [];
      }

      if (
        map[code] !== undefined &&
        map[code] !== null &&
        typeof map[code].toString === "function"
      ) {
        unicode = ("0000" + map[code].toString(16)).slice(-4);
        code = ("0000" + (+code).toString(16)).slice(-4);
        range.push("<" + code + "><" + unicode + ">");
      }
    }

    if (range.length) {
      unicodeMap +=
        "\n" +
        range.length +
        " beginbfchar\n" +
        range.join("\n") +
        "\nendbfchar\n";
    }
    unicodeMap +=
      "endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend";
    return unicodeMap;
  };

  var identityHFunction = function(options) {
    var font = options.font;
    var out = options.out;
    var newObject = options.newObject;
    var putStream = options.putStream;
    var pdfEscapeWithNeededParanthesis = options.pdfEscapeWithNeededParanthesis;

    if (
      font.metadata instanceof jsPDF.API.TTFFont &&
      font.encoding === "Identity-H"
    ) {
      //Tag with Identity-H
      var widths = font.metadata.Unicode.widths;
      var data = font.metadata.subset.encode(font.metadata.glyIdsUsed, 1);
      var pdfOutput = data;
      var pdfOutput2 = "";
      for (var i = 0; i < pdfOutput.length; i++) {
        pdfOutput2 += String.fromCharCode(pdfOutput[i]);
      }
      var fontTable = newObject();
      putStream({ data: pdfOutput2, addLength1: true, objectId: fontTable });
      out("endobj");

      var cmap = newObject();
      var cmapData = toUnicodeCmap(font.metadata.toUnicode);
      putStream({ data: cmapData, addLength1: true, objectId: cmap });
      out("endobj");

      var fontDescriptor = newObject();
      out("<<");
      out("/Type /FontDescriptor");
      out("/FontName /" + pdfEscapeWithNeededParanthesis(font.fontName));
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
      out("/BaseFont /" + pdfEscapeWithNeededParanthesis(font.fontName));
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
      out("/BaseFont /" + pdfEscapeWithNeededParanthesis(font.fontName));
      out("/Encoding /" + font.encoding);
      out("/DescendantFonts [" + DescendantFont + " 0 R]");
      out(">>");
      out("endobj");

      font.isAlreadyPutted = true;
    }
  };

  jsPDFAPI.events.push([
    "putFont",
    function(args) {
      identityHFunction(args);
    }
  ]);

  var winAnsiEncodingFunction = function(options) {
    var font = options.font;
    var out = options.out;
    var newObject = options.newObject;
    var putStream = options.putStream;
    var pdfEscapeWithNeededParanthesis = options.pdfEscapeWithNeededParanthesis;

    if (
      font.metadata instanceof jsPDF.API.TTFFont &&
      font.encoding === "WinAnsiEncoding"
    ) {
      //Tag with WinAnsi encoding
      var data = font.metadata.rawData;
      var pdfOutput = data;
      var pdfOutput2 = "";
      for (var i = 0; i < pdfOutput.length; i++) {
        pdfOutput2 += String.fromCharCode(pdfOutput[i]);
      }
      var fontTable = newObject();
      putStream({ data: pdfOutput2, addLength1: true, objectId: fontTable });
      out("endobj");

      var cmap = newObject();
      var cmapData = toUnicodeCmap(font.metadata.toUnicode);
      putStream({ data: cmapData, addLength1: true, objectId: cmap });
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
      out("/FontName /" + pdfEscapeWithNeededParanthesis(font.fontName));
      out("/ItalicAngle " + font.metadata.italicAngle);
      out("/Ascent " + font.metadata.ascender);
      out(">>");
      out("endobj");
      font.objectNumber = newObject();
      for (var j = 0; j < font.metadata.hmtx.widths.length; j++) {
        font.metadata.hmtx.widths[j] = parseInt(
          font.metadata.hmtx.widths[j] * (1000 / font.metadata.head.unitsPerEm)
        ); //Change the width of Em units to Point units.
      }
      out(
        "<</Subtype/TrueType/Type/Font/ToUnicode " +
          cmap +
          " 0 R/BaseFont/" +
          pdfEscapeWithNeededParanthesis(font.fontName) +
          "/FontDescriptor " +
          fontDescriptor +
          " 0 R" +
          "/Encoding/" +
          font.encoding +
          " /FirstChar 29 /LastChar 255 /Widths " +
          jsPDF.API.PDFObject.convert(font.metadata.hmtx.widths) +
          ">>"
      );
      out("endobj");
      font.isAlreadyPutted = true;
    }
  };

  jsPDFAPI.events.push([
    "putFont",
    function(args) {
      winAnsiEncodingFunction(args);
    }
  ]);

  var utf8TextFunction = function(args) {
    var text = args.text || "";
    var x = args.x;
    var y = args.y;
    var options = args.options || {};
    var mutex = args.mutex || {};

    var pdfEscape = mutex.pdfEscape;
    var activeFontKey = mutex.activeFontKey;
    var fonts = mutex.fonts;
    var key = activeFontKey;

    var str = "",
      s = 0,
      cmapConfirm;
    var strText = "";
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
    if (Array.isArray(text)) {
      strText = text[0];
    }
    for (s = 0; s < strText.length; s += 1) {
      if (fonts[key].metadata.hasOwnProperty("cmap")) {
        cmapConfirm =
          fonts[key].metadata.cmap.unicode.codeMap[strText[s].charCodeAt(0)];
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
        if (
          strText[s].charCodeAt(0) < 256 &&
          fonts[key].metadata.hasOwnProperty("Unicode")
        ) {
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
      result = pdfEscape(str, key)
        .split("")
        .map(function(cv) {
          return cv.charCodeAt(0).toString(16);
        })
        .join("");
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

  var utf8EscapeFunction = function(parms) {
    var text = parms.text || "",
      x = parms.x,
      y = parms.y,
      options = parms.options,
      mutex = parms.mutex;
    var tmpText = [];
    var args = {
      text: text,
      x: x,
      y: y,
      options: options,
      mutex: mutex
    };

    if (Array.isArray(text)) {
      var i = 0;
      for (i = 0; i < text.length; i += 1) {
        if (Array.isArray(text[i])) {
          if (text[i].length === 3) {
            tmpText.push([
              utf8TextFunction(Object.assign({}, args, { text: text[i][0] }))
                .text,
              text[i][1],
              text[i][2]
            ]);
          } else {
            tmpText.push(
              utf8TextFunction(Object.assign({}, args, { text: text[i] })).text
            );
          }
        } else {
          tmpText.push(
            utf8TextFunction(Object.assign({}, args, { text: text[i] })).text
          );
        }
      }
      parms.text = tmpText;
    } else {
      parms.text = utf8TextFunction(
        Object.assign({}, args, { text: text })
      ).text;
    }
  };

  jsPDFAPI.events.push(["postProcessText", utf8EscapeFunction]);
})(jsPDF);

/**
 * @license
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
(function(jsPDFAPI) {

  var _initializeVFS = function() {
    if (typeof this.internal.vFS === "undefined") {
      this.internal.vFS = {};
    }
    return true;
  };

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
  jsPDFAPI.existsFileInVFS = function(filename) {
    _initializeVFS.call(this);
    return typeof this.internal.vFS[filename] !== "undefined";
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
  jsPDFAPI.addFileToVFS = function(filename, filecontent) {
    _initializeVFS.call(this);
    this.internal.vFS[filename] = filecontent;
    return this;
  };

  /**
   * Get the file from the vFS
   *
   * @name getFileFromVFS
   * @function
   * @param {string} The name of the file which gets requested.
   * @returns {string}
   * @example
   * doc.getFileFromVFS("someFile.txt");
   */
  jsPDFAPI.getFileFromVFS = function(filename) {
    _initializeVFS.call(this);

    if (typeof this.internal.vFS[filename] !== "undefined") {
      return this.internal.vFS[filename];
    }
    return null;
  };
})(jsPDF.API);

/**
 * @license
 * Unicode Bidi Engine based on the work of Alex Shensis (@asthensis)
 * MIT License
 */

(function(jsPDF) {
  /**
   * Table of Unicode types.
   *
   * Generated by:
   *
   * var bidi = require("./bidi/index");
   * var bidi_accumulate = bidi.slice(0, 256).concat(bidi.slice(0x0500, 0x0500 + 256 * 3)).
   * concat(bidi.slice(0x2000, 0x2000 + 256)).concat(bidi.slice(0xFB00, 0xFB00 + 256)).
   * concat(bidi.slice(0xFE00, 0xFE00 + 2 * 256));
   *
   * for( var i = 0; i < bidi_accumulate.length; i++) {
   * 	if(bidi_accumulate[i] === undefined || bidi_accumulate[i] === 'ON')
   * 		bidi_accumulate[i] = 'N'; //mark as neutral to conserve space and substitute undefined
   * }
   * var bidiAccumulateStr = 'return [ "' + bidi_accumulate.toString().replace(/,/g, '", "') + '" ];';
   * require("fs").writeFile('unicode-types.js', bidiAccumulateStr);
   *
   * Based on:
   * https://github.com/mathiasbynens/unicode-8.0.0
   */
  var bidiUnicodeTypes = [
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "S",
    "B",
    "S",
    "WS",
    "B",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "B",
    "B",
    "B",
    "S",
    "WS",
    "N",
    "N",
    "ET",
    "ET",
    "ET",
    "N",
    "N",
    "N",
    "N",
    "N",
    "ES",
    "CS",
    "ES",
    "CS",
    "CS",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "CS",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "N",
    "N",
    "N",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "B",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "CS",
    "N",
    "ET",
    "ET",
    "ET",
    "ET",
    "N",
    "N",
    "N",
    "N",
    "L",
    "N",
    "N",
    "BN",
    "N",
    "N",
    "ET",
    "ET",
    "EN",
    "EN",
    "N",
    "L",
    "N",
    "N",
    "N",
    "EN",
    "L",
    "N",
    "N",
    "N",
    "N",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "L",
    "N",
    "N",
    "N",
    "N",
    "N",
    "ET",
    "N",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "R",
    "NSM",
    "R",
    "NSM",
    "NSM",
    "R",
    "NSM",
    "NSM",
    "R",
    "NSM",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "N",
    "N",
    "N",
    "N",
    "N",
    "R",
    "R",
    "R",
    "R",
    "R",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "AN",
    "AN",
    "AN",
    "AN",
    "AN",
    "AN",
    "N",
    "N",
    "AL",
    "ET",
    "ET",
    "AL",
    "CS",
    "AL",
    "N",
    "N",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "AL",
    "AL",
    "N",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "AN",
    "AN",
    "AN",
    "AN",
    "AN",
    "AN",
    "AN",
    "AN",
    "AN",
    "AN",
    "ET",
    "AN",
    "AN",
    "AL",
    "AL",
    "AL",
    "NSM",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "AN",
    "N",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "AL",
    "AL",
    "NSM",
    "NSM",
    "N",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "AL",
    "AL",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "N",
    "AL",
    "AL",
    "NSM",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "N",
    "N",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "AL",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "R",
    "R",
    "N",
    "N",
    "N",
    "N",
    "R",
    "N",
    "N",
    "N",
    "N",
    "N",
    "WS",
    "WS",
    "WS",
    "WS",
    "WS",
    "WS",
    "WS",
    "WS",
    "WS",
    "WS",
    "WS",
    "BN",
    "BN",
    "BN",
    "L",
    "R",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "WS",
    "B",
    "LRE",
    "RLE",
    "PDF",
    "LRO",
    "RLO",
    "CS",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "CS",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "WS",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "N",
    "LRI",
    "RLI",
    "FSI",
    "PDI",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "BN",
    "EN",
    "L",
    "N",
    "N",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "ES",
    "ES",
    "N",
    "N",
    "N",
    "L",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "ES",
    "ES",
    "N",
    "N",
    "N",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "N",
    "N",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "ET",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "N",
    "N",
    "N",
    "N",
    "R",
    "NSM",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "ES",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "N",
    "R",
    "R",
    "R",
    "R",
    "R",
    "N",
    "R",
    "N",
    "R",
    "R",
    "N",
    "R",
    "R",
    "N",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "R",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "NSM",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "CS",
    "N",
    "CS",
    "N",
    "N",
    "CS",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "ET",
    "N",
    "N",
    "ES",
    "ES",
    "N",
    "N",
    "N",
    "N",
    "N",
    "ET",
    "ET",
    "N",
    "N",
    "N",
    "N",
    "N",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "N",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "AL",
    "N",
    "N",
    "BN",
    "N",
    "N",
    "N",
    "ET",
    "ET",
    "ET",
    "N",
    "N",
    "N",
    "N",
    "N",
    "ES",
    "CS",
    "ES",
    "CS",
    "CS",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "EN",
    "CS",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "N",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "N",
    "L",
    "L",
    "L",
    "L",
    "L",
    "L",
    "N",
    "N",
    "L",
    "L",
    "L",
    "N",
    "N",
    "N",
    "ET",
    "ET",
    "N",
    "N",
    "N",
    "ET",
    "ET",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N",
    "N"
  ];

  /**
   * Unicode Bidi algorithm compliant Bidi engine.
   * For reference see http://unicode.org/reports/tr9/
   */

  /**
   * constructor ( options )
   *
   * Initializes Bidi engine
   *
   * @param {Object} See 'setOptions' below for detailed description.
   * options are cashed between invocation of 'doBidiReorder' method
   *
   * sample usage pattern of BidiEngine:
   * var opt = {
   * 	isInputVisual: true,
   * 	isInputRtl: false,
   * 	isOutputVisual: false,
   * 	isOutputRtl: false,
   * 	isSymmetricSwapping: true
   * }
   * var sourceToTarget = [], levels = [];
   * var bidiEng = Globalize.bidiEngine(opt);
   * var src = "text string to be reordered";
   * var ret = bidiEng.doBidiReorder(src, sourceToTarget, levels);
   */

  jsPDF.__bidiEngine__ = jsPDF.prototype.__bidiEngine__ = function(options) {
    var _UNICODE_TYPES = _bidiUnicodeTypes;

    var _STATE_TABLE_LTR = [
      [0, 3, 0, 1, 0, 0, 0],
      [0, 3, 0, 1, 2, 2, 0],
      [0, 3, 0, 0x11, 2, 0, 1],
      [0, 3, 5, 5, 4, 1, 0],
      [0, 3, 0x15, 0x15, 4, 0, 1],
      [0, 3, 5, 5, 4, 2, 0]
    ];

    var _STATE_TABLE_RTL = [
      [2, 0, 1, 1, 0, 1, 0],
      [2, 0, 1, 1, 0, 2, 0],
      [2, 0, 2, 1, 3, 2, 0],
      [2, 0, 2, 0x21, 3, 1, 1]
    ];

    var _TYPE_NAMES_MAP = { L: 0, R: 1, EN: 2, AN: 3, N: 4, B: 5, S: 6 };

    var _UNICODE_RANGES_MAP = {
      0: 0,
      5: 1,
      6: 2,
      7: 3,
      0x20: 4,
      0xfb: 5,
      0xfe: 6,
      0xff: 7
    };

    var _SWAP_TABLE = [
      "\u0028",
      "\u0029",
      "\u0028",
      "\u003C",
      "\u003E",
      "\u003C",
      "\u005B",
      "\u005D",
      "\u005B",
      "\u007B",
      "\u007D",
      "\u007B",
      "\u00AB",
      "\u00BB",
      "\u00AB",
      "\u2039",
      "\u203A",
      "\u2039",
      "\u2045",
      "\u2046",
      "\u2045",
      "\u207D",
      "\u207E",
      "\u207D",
      "\u208D",
      "\u208E",
      "\u208D",
      "\u2264",
      "\u2265",
      "\u2264",
      "\u2329",
      "\u232A",
      "\u2329",
      "\uFE59",
      "\uFE5A",
      "\uFE59",
      "\uFE5B",
      "\uFE5C",
      "\uFE5B",
      "\uFE5D",
      "\uFE5E",
      "\uFE5D",
      "\uFE64",
      "\uFE65",
      "\uFE64"
    ];

    var _LTR_RANGES_REG_EXPR = new RegExp(
      /^([1-4|9]|1[0-9]|2[0-9]|3[0168]|4[04589]|5[012]|7[78]|159|16[0-9]|17[0-2]|21[569]|22[03489]|250)$/
    );

    var _lastArabic = false,
      _hasUbatB,
      _hasUbatS,
      DIR_LTR = 0,
      DIR_RTL = 1,
      _isInVisual,
      _isInRtl,
      _isOutVisual,
      _isOutRtl,
      _isSymmetricSwapping,
      _dir = DIR_LTR;

    this.__bidiEngine__ = {};

    var _init = function(text, sourceToTargetMap) {
      if (sourceToTargetMap) {
        for (var i = 0; i < text.length; i++) {
          sourceToTargetMap[i] = i;
        }
      }
      if (_isInRtl === undefined) {
        _isInRtl = _isContextualDirRtl(text);
      }
      if (_isOutRtl === undefined) {
        _isOutRtl = _isContextualDirRtl(text);
      }
    };

    // for reference see 3.2 in http://unicode.org/reports/tr9/
    //
    var _getCharType = function(ch) {
      var charCode = ch.charCodeAt(),
        range = charCode >> 8,
        rangeIdx = _UNICODE_RANGES_MAP[range];

      if (rangeIdx !== undefined) {
        return _UNICODE_TYPES[rangeIdx * 256 + (charCode & 0xff)];
      } else if (range === 0xfc || range === 0xfd) {
        return "AL";
      } else if (_LTR_RANGES_REG_EXPR.test(range)) {
        //unlikely case
        return "L";
      } else if (range === 8) {
        // even less likely
        return "R";
      }
      return "N"; //undefined type, mark as neutral
    };

    var _isContextualDirRtl = function(text) {
      for (var i = 0, charType; i < text.length; i++) {
        charType = _getCharType(text.charAt(i));
        if (charType === "L") {
          return false;
        } else if (charType === "R") {
          return true;
        }
      }
      return false;
    };

    // for reference see 3.3.4 & 3.3.5 in http://unicode.org/reports/tr9/
    //
    var _resolveCharType = function(chars, types, resolvedTypes, index) {
      var cType = types[index],
        wType,
        nType,
        i,
        len;
      switch (cType) {
        case "L":
        case "R":
          _lastArabic = false;
          break;
        case "N":
        case "AN":
          break;

        case "EN":
          if (_lastArabic) {
            cType = "AN";
          }
          break;

        case "AL":
          _lastArabic = true;
          cType = "R";
          break;

        case "WS":
          cType = "N";
          break;

        case "CS":
          if (
            index < 1 ||
            index + 1 >= types.length ||
            ((wType = resolvedTypes[index - 1]) !== "EN" && wType !== "AN") ||
            ((nType = types[index + 1]) !== "EN" && nType !== "AN")
          ) {
            cType = "N";
          } else if (_lastArabic) {
            nType = "AN";
          }
          cType = nType === wType ? nType : "N";
          break;

        case "ES":
          wType = index > 0 ? resolvedTypes[index - 1] : "B";
          cType =
            wType === "EN" &&
            index + 1 < types.length &&
            types[index + 1] === "EN"
              ? "EN"
              : "N";
          break;

        case "ET":
          if (index > 0 && resolvedTypes[index - 1] === "EN") {
            cType = "EN";
            break;
          } else if (_lastArabic) {
            cType = "N";
            break;
          }
          i = index + 1;
          len = types.length;
          while (i < len && types[i] === "ET") {
            i++;
          }
          if (i < len && types[i] === "EN") {
            cType = "EN";
          } else {
            cType = "N";
          }
          break;

        case "NSM":
          if (_isInVisual && !_isInRtl) {
            //V->L
            len = types.length;
            i = index + 1;
            while (i < len && types[i] === "NSM") {
              i++;
            }
            if (i < len) {
              var c = chars[index];
              var rtlCandidate = (c >= 0x0591 && c <= 0x08ff) || c === 0xfb1e;
              wType = types[i];
              if (rtlCandidate && (wType === "R" || wType === "AL")) {
                cType = "R";
                break;
              }
            }
          }
          if (index < 1 || (wType = types[index - 1]) === "B") {
            cType = "N";
          } else {
            cType = resolvedTypes[index - 1];
          }
          break;

        case "B":
          _lastArabic = false;
          _hasUbatB = true;
          cType = _dir;
          break;

        case "S":
          _hasUbatS = true;
          cType = "N";
          break;

        case "LRE":
        case "RLE":
        case "LRO":
        case "RLO":
        case "PDF":
          _lastArabic = false;
          break;
        case "BN":
          cType = "N";
          break;
      }
      return cType;
    };

    var _handleUbatS = function(types, levels, length) {
      for (var i = 0; i < length; i++) {
        if (types[i] === "S") {
          levels[i] = _dir;
          for (var j = i - 1; j >= 0; j--) {
            if (types[j] === "WS") {
              levels[j] = _dir;
            } else {
              break;
            }
          }
        }
      }
    };

    var _invertString = function(text, sourceToTargetMap, levels) {
      var charArray = text.split("");
      if (levels) {
        _computeLevels(charArray, levels, { hiLevel: _dir });
      }
      charArray.reverse();
      sourceToTargetMap && sourceToTargetMap.reverse();
      return charArray.join("");
    };

    // For reference see 3.3 in http://unicode.org/reports/tr9/
    //
    var _computeLevels = function(chars, levels, params) {
      var action,
        condition,
        i,
        index,
        newLevel,
        prevState,
        condPos = -1,
        len = chars.length,
        newState = 0,
        resolvedTypes = [],
        stateTable = _dir ? _STATE_TABLE_RTL : _STATE_TABLE_LTR,
        types = [];

      _lastArabic = false;
      _hasUbatB = false;
      _hasUbatS = false;
      for (i = 0; i < len; i++) {
        types[i] = _getCharType(chars[i]);
      }
      for (index = 0; index < len; index++) {
        prevState = newState;
        resolvedTypes[index] = _resolveCharType(
          chars,
          types,
          resolvedTypes,
          index
        );
        newState = stateTable[prevState][_TYPE_NAMES_MAP[resolvedTypes[index]]];
        action = newState & 0xf0;
        newState &= 0x0f;
        levels[index] = newLevel = stateTable[newState][5];
        if (action > 0) {
          if (action === 0x10) {
            for (i = condPos; i < index; i++) {
              levels[i] = 1;
            }
            condPos = -1;
          } else {
            condPos = -1;
          }
        }
        condition = stateTable[newState][6];
        if (condition) {
          if (condPos === -1) {
            condPos = index;
          }
        } else {
          if (condPos > -1) {
            for (i = condPos; i < index; i++) {
              levels[i] = newLevel;
            }
            condPos = -1;
          }
        }
        if (types[index] === "B") {
          levels[index] = 0;
        }
        params.hiLevel |= newLevel;
      }
      if (_hasUbatS) {
        _handleUbatS(types, levels, len);
      }
    };

    // for reference see 3.4 in http://unicode.org/reports/tr9/
    //
    var _invertByLevel = function(
      level,
      charArray,
      sourceToTargetMap,
      levels,
      params
    ) {
      if (params.hiLevel < level) {
        return;
      }
      if (level === 1 && _dir === DIR_RTL && !_hasUbatB) {
        charArray.reverse();
        sourceToTargetMap && sourceToTargetMap.reverse();
        return;
      }
      var ch,
        high,
        end,
        low,
        len = charArray.length,
        start = 0;

      while (start < len) {
        if (levels[start] >= level) {
          end = start + 1;
          while (end < len && levels[end] >= level) {
            end++;
          }
          for (low = start, high = end - 1; low < high; low++, high--) {
            ch = charArray[low];
            charArray[low] = charArray[high];
            charArray[high] = ch;
            if (sourceToTargetMap) {
              ch = sourceToTargetMap[low];
              sourceToTargetMap[low] = sourceToTargetMap[high];
              sourceToTargetMap[high] = ch;
            }
          }
          start = end;
        }
        start++;
      }
    };

    // for reference see 7 & BD16 in http://unicode.org/reports/tr9/
    //
    var _symmetricSwap = function(charArray, levels, params) {
      if (params.hiLevel !== 0 && _isSymmetricSwapping) {
        for (var i = 0, index; i < charArray.length; i++) {
          if (levels[i] === 1) {
            index = _SWAP_TABLE.indexOf(charArray[i]);
            if (index >= 0) {
              charArray[i] = _SWAP_TABLE[index + 1];
            }
          }
        }
      }
    };

    var _reorder = function(text, sourceToTargetMap, levels) {
      var charArray = text.split(""),
        params = { hiLevel: _dir };

      if (!levels) {
        levels = [];
      }
      _computeLevels(charArray, levels, params);
      _symmetricSwap(charArray, levels, params);
      _invertByLevel(DIR_RTL + 1, charArray, sourceToTargetMap, levels, params);
      _invertByLevel(DIR_RTL, charArray, sourceToTargetMap, levels, params);
      return charArray.join("");
    };

    // doBidiReorder( text, sourceToTargetMap, levels )
    // Performs Bidi reordering by implementing Unicode Bidi algorithm.
    // Returns reordered string
    // @text [String]:
    // - input string to be reordered, this is input parameter
    // $sourceToTargetMap [Array] (optional)
    // - resultant mapping between input and output strings, this is output parameter
    // $levels [Array] (optional)
    // - array of calculated Bidi levels, , this is output parameter
    this.__bidiEngine__.doBidiReorder = function(
      text,
      sourceToTargetMap,
      levels
    ) {
      _init(text, sourceToTargetMap);
      if (!_isInVisual && _isOutVisual && !_isOutRtl) {
        // LLTR->VLTR, LRTL->VLTR
        _dir = _isInRtl ? DIR_RTL : DIR_LTR;
        text = _reorder(text, sourceToTargetMap, levels);
      } else if (_isInVisual && _isOutVisual && _isInRtl ^ _isOutRtl) {
        // VRTL->VLTR, VLTR->VRTL
        _dir = _isInRtl ? DIR_RTL : DIR_LTR;
        text = _invertString(text, sourceToTargetMap, levels);
      } else if (!_isInVisual && _isOutVisual && _isOutRtl) {
        // LLTR->VRTL, LRTL->VRTL
        _dir = _isInRtl ? DIR_RTL : DIR_LTR;
        text = _reorder(text, sourceToTargetMap, levels);
        text = _invertString(text, sourceToTargetMap);
      } else if (_isInVisual && !_isInRtl && !_isOutVisual && !_isOutRtl) {
        // VLTR->LLTR
        _dir = DIR_LTR;
        text = _reorder(text, sourceToTargetMap, levels);
      } else if (_isInVisual && !_isOutVisual && _isInRtl ^ _isOutRtl) {
        // VLTR->LRTL, VRTL->LLTR
        text = _invertString(text, sourceToTargetMap);
        if (_isInRtl) {
          //LLTR -> VLTR
          _dir = DIR_LTR;
          text = _reorder(text, sourceToTargetMap, levels);
        } else {
          //LRTL -> VRTL
          _dir = DIR_RTL;
          text = _reorder(text, sourceToTargetMap, levels);
          text = _invertString(text, sourceToTargetMap);
        }
      } else if (_isInVisual && _isInRtl && !_isOutVisual && _isOutRtl) {
        //  VRTL->LRTL
        _dir = DIR_RTL;
        text = _reorder(text, sourceToTargetMap, levels);
        text = _invertString(text, sourceToTargetMap);
      } else if (!_isInVisual && !_isOutVisual && _isInRtl ^ _isOutRtl) {
        // LRTL->LLTR, LLTR->LRTL
        var isSymmetricSwappingOrig = _isSymmetricSwapping;
        if (_isInRtl) {
          //LRTL->LLTR
          _dir = DIR_RTL;
          text = _reorder(text, sourceToTargetMap, levels);
          _dir = DIR_LTR;
          _isSymmetricSwapping = false;
          text = _reorder(text, sourceToTargetMap, levels);
          _isSymmetricSwapping = isSymmetricSwappingOrig;
        } else {
          //LLTR->LRTL
          _dir = DIR_LTR;
          text = _reorder(text, sourceToTargetMap, levels);
          text = _invertString(text, sourceToTargetMap);
          _dir = DIR_RTL;
          _isSymmetricSwapping = false;
          text = _reorder(text, sourceToTargetMap, levels);
          _isSymmetricSwapping = isSymmetricSwappingOrig;
          text = _invertString(text, sourceToTargetMap);
        }
      }
      return text;
    };

    /**
     * @name setOptions( options )
     * @function
     * Sets options for Bidi conversion
     * @param {Object}:
     * - isInputVisual {boolean} (defaults to false): allowed values: true(Visual mode), false(Logical mode)
     * - isInputRtl {boolean}: allowed values true(Right-to-left direction), false (Left-to-right directiion), undefined(Contectual direction, i.e.direction defined by first strong character of input string)
     * - isOutputVisual {boolean} (defaults to false): allowed values: true(Visual mode), false(Logical mode)
     * - isOutputRtl {boolean}: allowed values true(Right-to-left direction), false (Left-to-right directiion), undefined(Contectual direction, i.e.direction defined by first strong characterof input string)
     * - isSymmetricSwapping {boolean} (defaults to false): allowed values true(needs symmetric swapping), false (no need in symmetric swapping),
     */
    this.__bidiEngine__.setOptions = function(options) {
      if (options) {
        _isInVisual = options.isInputVisual;
        _isOutVisual = options.isOutputVisual;
        _isInRtl = options.isInputRtl;
        _isOutRtl = options.isOutputRtl;
        _isSymmetricSwapping = options.isSymmetricSwapping;
      }
    };

    this.__bidiEngine__.setOptions(options);
    return this.__bidiEngine__;
  };

  var _bidiUnicodeTypes = bidiUnicodeTypes;

  var bidiEngine = new jsPDF.__bidiEngine__({ isInputVisual: true });

  var bidiEngineFunction = function(args) {
    var text = args.text;
    var x = args.x;
    var y = args.y;
    var options = args.options || {};
    var mutex = args.mutex || {};
    var lang = options.lang;
    var tmpText = [];

    options.isInputVisual =
      typeof options.isInputVisual === "boolean" ? options.isInputVisual : true;
    bidiEngine.setOptions(options);

    if (Object.prototype.toString.call(text) === "[object Array]") {
      var i = 0;
      tmpText = [];
      for (i = 0; i < text.length; i += 1) {
        if (Object.prototype.toString.call(text[i]) === "[object Array]") {
          tmpText.push([
            bidiEngine.doBidiReorder(text[i][0]),
            text[i][1],
            text[i][2]
          ]);
        } else {
          tmpText.push([bidiEngine.doBidiReorder(text[i])]);
        }
      }
      args.text = tmpText;
    } else {
      args.text = bidiEngine.doBidiReorder(text);
    }
    bidiEngine.setOptions({ isInputVisual: true });
  };

  jsPDF.API.events.push(["postProcessText", bidiEngineFunction]);
})(jsPDF);

/* eslint-disable no-control-regex */

jsPDF.API.TTFFont = (function() {
  /************************************************************************/
  /* function : open                                                       */
  /* comment : Decode the encoded ttf content and create a TTFFont object. */
  /************************************************************************/
  TTFFont.open = function(file) {
    return new TTFFont(file);
  };
  /***************************************************************/
  /* function : TTFFont gernerator                               */
  /* comment : Decode TTF contents are parsed, Data,             */
  /* Subset object is created, and registerTTF function is called.*/
  /***************************************************************/
  function TTFFont(rawData) {
    var data;
    this.rawData = rawData;
    data = this.contents = new Data(rawData);
    this.contents.pos = 4;
    if (data.readString(4) === "ttcf") {
      throw new Error("TTCF not supported.");
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
  TTFFont.prototype.parse = function() {
    this.directory = new Directory(this.contents);
    this.head = new HeadTable(this);
    this.name = new NameTable(this);
    this.cmap = new CmapTable(this);
    this.toUnicode = {};
    this.hhea = new HheaTable(this);
    this.maxp = new MaxpTable(this);
    this.hmtx = new HmtxTable(this);
    this.post = new PostTable(this);
    this.os2 = new OS2Table(this);
    this.loca = new LocaTable(this);
    this.glyf = new GlyfTable(this);
    this.ascender =
      (this.os2.exists && this.os2.ascender) || this.hhea.ascender;
    this.decender =
      (this.os2.exists && this.os2.decender) || this.hhea.decender;
    this.lineGap = (this.os2.exists && this.os2.lineGap) || this.hhea.lineGap;
    return (this.bbox = [
      this.head.xMin,
      this.head.yMin,
      this.head.xMax,
      this.head.yMax
    ]);
  };
  /***************************************************************/
  /* function : registerTTF                                      */
  /* comment : Get the value to assign pdf font descriptors.     */
  /***************************************************************/
  TTFFont.prototype.registerTTF = function() {
    var e, hi, low, raw, _ref;
    this.scaleFactor = 1000.0 / this.head.unitsPerEm;
    this.bbox = function() {
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
      if ((hi & 0x8000) !== 0) {
        hi = -((hi ^ 0xffff) + 1);
      }
      this.italicAngle = +("" + hi + "." + low);
    } else {
      this.italicAngle = 0;
    }
    this.ascender = Math.round(this.ascender * this.scaleFactor);
    this.decender = Math.round(this.decender * this.scaleFactor);
    this.lineGap = Math.round(this.lineGap * this.scaleFactor);
    this.capHeight = (this.os2.exists && this.os2.capHeight) || this.ascender;
    this.xHeight = (this.os2.exists && this.os2.xHeight) || 0;
    this.familyClass = ((this.os2.exists && this.os2.familyClass) || 0) >> 8;
    this.isSerif =
      (_ref = this.familyClass) === 1 ||
      _ref === 2 ||
      _ref === 3 ||
      _ref === 4 ||
      _ref === 5 ||
      _ref === 7;
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
  TTFFont.prototype.characterToGlyph = function(character) {
    var _ref;
    return (
      ((_ref = this.cmap.unicode) != null ? _ref.codeMap[character] : void 0) ||
      0
    );
  };
  TTFFont.prototype.widthOfGlyph = function(glyph) {
    var scale;
    scale = 1000.0 / this.head.unitsPerEm;
    return this.hmtx.forGlyph(glyph).advance * scale;
  };
  TTFFont.prototype.widthOfString = function(string, size, charSpace) {
    var charCode, i, scale, width, _ref;
    string = "" + string;
    width = 0;
    for (
      i = 0, _ref = string.length;
      0 <= _ref ? i < _ref : i > _ref;
      i = 0 <= _ref ? ++i : --i
    ) {
      charCode = string.charCodeAt(i);
      width +=
        this.widthOfGlyph(this.characterToGlyph(charCode)) +
          charSpace * (1000 / size) || 0;
    }
    scale = size / 1000;
    return width * scale;
  };
  TTFFont.prototype.lineHeight = function(size, includeGap) {
    var gap;
    if (includeGap == null) {
      includeGap = false;
    }
    gap = includeGap ? this.lineGap : 0;
    return ((this.ascender + gap - this.decender) / 1000) * size;
  };
  return TTFFont;
})();

/************************************************************************************************/
/* function : Data                                                                              */
/* comment : The ttf data decoded and stored in an array is read and written to the Data object.*/
/************************************************************************************************/
var Data = (function() {
  function Data(data) {
    this.data = data != null ? data : [];
    this.pos = 0;
    this.length = this.data.length;
  }
  Data.prototype.readByte = function() {
    return this.data[this.pos++];
  };
  Data.prototype.writeByte = function(byte) {
    return (this.data[this.pos++] = byte);
  };
  Data.prototype.readUInt32 = function() {
    var b1, b2, b3, b4;
    b1 = this.readByte() * 0x1000000;
    b2 = this.readByte() << 16;
    b3 = this.readByte() << 8;
    b4 = this.readByte();
    return b1 + b2 + b3 + b4;
  };
  Data.prototype.writeUInt32 = function(val) {
    this.writeByte((val >>> 24) & 0xff);
    this.writeByte((val >> 16) & 0xff);
    this.writeByte((val >> 8) & 0xff);
    return this.writeByte(val & 0xff);
  };
  Data.prototype.readInt32 = function() {
    var int;
    int = this.readUInt32();
    if (int >= 0x80000000) {
      return int - 0x100000000;
    } else {
      return int;
    }
  };
  Data.prototype.writeInt32 = function(val) {
    if (val < 0) {
      val += 0x100000000;
    }
    return this.writeUInt32(val);
  };
  Data.prototype.readUInt16 = function() {
    var b1, b2;
    b1 = this.readByte() << 8;
    b2 = this.readByte();
    return b1 | b2;
  };
  Data.prototype.writeUInt16 = function(val) {
    this.writeByte((val >> 8) & 0xff);
    return this.writeByte(val & 0xff);
  };
  Data.prototype.readInt16 = function() {
    var int;
    int = this.readUInt16();
    if (int >= 0x8000) {
      return int - 0x10000;
    } else {
      return int;
    }
  };
  Data.prototype.writeInt16 = function(val) {
    if (val < 0) {
      val += 0x10000;
    }
    return this.writeUInt16(val);
  };
  Data.prototype.readString = function(length) {
    var i, ret;
    ret = [];
    for (
      i = 0;
      0 <= length ? i < length : i > length;
      i = 0 <= length ? ++i : --i
    ) {
      ret[i] = String.fromCharCode(this.readByte());
    }
    return ret.join("");
  };
  Data.prototype.writeString = function(val) {
    var i, _ref, _results;
    _results = [];
    for (
      i = 0, _ref = val.length;
      0 <= _ref ? i < _ref : i > _ref;
      i = 0 <= _ref ? ++i : --i
    ) {
      _results.push(this.writeByte(val.charCodeAt(i)));
    }
    return _results;
  };
  /*Data.prototype.stringAt = function (pos, length) {
            this.pos = pos;
            return this.readString(length);
        };*/
  Data.prototype.readShort = function() {
    return this.readInt16();
  };
  Data.prototype.writeShort = function(val) {
    return this.writeInt16(val);
  };
  Data.prototype.readLongLong = function() {
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
      return (
        ((b1 ^ 0xff) * 0x100000000000000 +
          (b2 ^ 0xff) * 0x1000000000000 +
          (b3 ^ 0xff) * 0x10000000000 +
          (b4 ^ 0xff) * 0x100000000 +
          (b5 ^ 0xff) * 0x1000000 +
          (b6 ^ 0xff) * 0x10000 +
          (b7 ^ 0xff) * 0x100 +
          (b8 ^ 0xff) +
          1) *
        -1
      );
    }
    return (
      b1 * 0x100000000000000 +
      b2 * 0x1000000000000 +
      b3 * 0x10000000000 +
      b4 * 0x100000000 +
      b5 * 0x1000000 +
      b6 * 0x10000 +
      b7 * 0x100 +
      b8
    );
  };
  Data.prototype.writeLongLong = function(val) {
    var high, low;
    high = Math.floor(val / 0x100000000);
    low = val & 0xffffffff;
    this.writeByte((high >> 24) & 0xff);
    this.writeByte((high >> 16) & 0xff);
    this.writeByte((high >> 8) & 0xff);
    this.writeByte(high & 0xff);
    this.writeByte((low >> 24) & 0xff);
    this.writeByte((low >> 16) & 0xff);
    this.writeByte((low >> 8) & 0xff);
    return this.writeByte(low & 0xff);
  };
  Data.prototype.readInt = function() {
    return this.readInt32();
  };
  Data.prototype.writeInt = function(val) {
    return this.writeInt32(val);
  };
  /*Data.prototype.slice = function (start, end) {
            return this.data.slice(start, end);
        };*/
  Data.prototype.read = function(bytes) {
    var buf, i;
    buf = [];
    for (
      i = 0;
      0 <= bytes ? i < bytes : i > bytes;
      i = 0 <= bytes ? ++i : --i
    ) {
      buf.push(this.readByte());
    }
    return buf;
  };
  Data.prototype.write = function(bytes) {
    var byte, i, _len, _results;
    _results = [];
    for (i = 0, _len = bytes.length; i < _len; i++) {
      byte = bytes[i];
      _results.push(this.writeByte(byte));
    }
    return _results;
  };
  return Data;
})();

var Directory = (function() {
  var checksum;

  /*****************************************************************************************************/
  /* function : Directory generator                                                                    */
  /* comment : Initialize the offset, tag, length, and checksum for each table for the font to be used.*/
  /*****************************************************************************************************/
  function Directory(data) {
    var entry, i, _ref;
    this.scalarType = data.readInt();
    this.tableCount = data.readShort();
    this.searchRange = data.readShort();
    this.entrySelector = data.readShort();
    this.rangeShift = data.readShort();
    this.tables = {};
    for (
      i = 0, _ref = this.tableCount;
      0 <= _ref ? i < _ref : i > _ref;
      i = 0 <= _ref ? ++i : --i
    ) {
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
  Directory.prototype.encode = function(tables) {
    var adjustment,
      directory,
      directoryLength,
      entrySelector,
      headOffset,
      log2,
      offset,
      rangeShift,
      searchRange,
      sum,
      table,
      tableCount,
      tableData,
      tag;
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
  checksum = function(data) {
    var i, sum, tmp, _ref;
    data = __slice.call(data);
    while (data.length % 4) {
      data.push(0);
    }
    tmp = new Data(data);
    sum = 0;
    for (i = 0, _ref = data.length; i < _ref; i = i += 4) {
      sum += tmp.readUInt32();
    }
    return sum & 0xffffffff;
  };
  return Directory;
})();

var Table,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) {
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
Table = (function() {
  function Table(file) {
    var info;
    this.file = file;
    info = this.file.directory.tables[this.tag];
    this.exists = !!info;
    if (info) {
      (this.offset = info.offset), (this.length = info.length);
      this.parse(this.file.contents);
    }
  }
  Table.prototype.parse = function() {};
  Table.prototype.encode = function() {};
  Table.prototype.raw = function() {
    if (!this.exists) {
      return null;
    }
    this.file.contents.pos = this.offset;
    return this.file.contents.read(this.length);
  };
  return Table;
})();

var HeadTable = (function(_super) {
  __extends(HeadTable, _super);

  function HeadTable() {
    return HeadTable.__super__.constructor.apply(this, arguments);
  }
  HeadTable.prototype.tag = "head";
  HeadTable.prototype.parse = function(data) {
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
    return (this.glyphDataFormat = data.readShort());
  };
  HeadTable.prototype.encode = function(indexToLocFormat) {
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
})(Table);

/************************************************************************************/
/* function : CmapEntry                                                             */
/* comment : Cmap Initializes and encodes object information (required by pdf spec).*/
/************************************************************************************/
var CmapEntry = (function() {
  function CmapEntry(data, offset) {
    var code,
      count,
      endCode,
      glyphId,
      glyphIds,
      i,
      idDelta,
      idRangeOffset,
      index,
      saveOffset,
      segCount,
      segCountX2,
      start,
      startCode,
      tail,
      _j,
      _k,
      _len;
    this.platformID = data.readUInt16();
    this.encodingID = data.readShort();
    this.offset = offset + data.readInt();
    saveOffset = data.pos;
    data.pos = this.offset;
    this.format = data.readUInt16();
    this.length = data.readUInt16();
    this.language = data.readUInt16();
    this.isUnicode =
      (this.platformID === 3 && this.encodingID === 1 && this.format === 4) ||
      (this.platformID === 0 && this.format === 4);
    this.codeMap = {};
    switch (this.format) {
      case 0:
        for (i = 0; i < 256; ++i) {
          this.codeMap[i] = data.readByte();
        }
        break;
      case 4:
        segCountX2 = data.readUInt16();
        segCount = segCountX2 / 2;
        data.pos += 6;
        endCode = (function() {
          var _j, _results;
          _results = [];
          for (
            i = _j = 0;
            0 <= segCount ? _j < segCount : _j > segCount;
            i = 0 <= segCount ? ++_j : --_j
          ) {
            _results.push(data.readUInt16());
          }
          return _results;
        })();
        data.pos += 2;
        startCode = (function() {
          var _j, _results;
          _results = [];
          for (
            i = _j = 0;
            0 <= segCount ? _j < segCount : _j > segCount;
            i = 0 <= segCount ? ++_j : --_j
          ) {
            _results.push(data.readUInt16());
          }
          return _results;
        })();
        idDelta = (function() {
          var _j, _results;
          _results = [];
          for (
            i = _j = 0;
            0 <= segCount ? _j < segCount : _j > segCount;
            i = 0 <= segCount ? ++_j : --_j
          ) {
            _results.push(data.readUInt16());
          }
          return _results;
        })();
        idRangeOffset = (function() {
          var _j, _results;
          _results = [];
          for (
            i = _j = 0;
            0 <= segCount ? _j < segCount : _j > segCount;
            i = 0 <= segCount ? ++_j : --_j
          ) {
            _results.push(data.readUInt16());
          }
          return _results;
        })();
        count = (this.length - data.pos + this.offset) / 2;
        glyphIds = (function() {
          var _j, _results;
          _results = [];
          for (
            i = _j = 0;
            0 <= count ? _j < count : _j > count;
            i = 0 <= count ? ++_j : --_j
          ) {
            _results.push(data.readUInt16());
          }
          return _results;
        })();
        for (i = _j = 0, _len = endCode.length; _j < _len; i = ++_j) {
          tail = endCode[i];
          start = startCode[i];
          for (
            code = _k = start;
            start <= tail ? _k <= tail : _k >= tail;
            code = start <= tail ? ++_k : --_k
          ) {
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
  CmapEntry.encode = function(charmap, encoding) {
    var charMap,
      code,
      codeMap,
      codes,
      delta,
      deltas,
      diff,
      endCode,
      endCodes,
      entrySelector,
      glyphIDs,
      i,
      id,
      indexes,
      last,
      map,
      nextID,
      offset,
      old,
      rangeOffsets,
      rangeShift,
      searchRange,
      segCount,
      segCountX2,
      startCode,
      startCodes,
      startGlyph,
      subtable,
      _i,
      _j,
      _k,
      _l,
      _len,
      _len1,
      _len2,
      _len3,
      _len4,
      _len5,
      _len6,
      _len7,
      _m,
      _n,
      _name,
      _o,
      _p,
      _q;
    subtable = new Data();
    codes = Object.keys(charmap).sort(function(a, b) {
      return a - b;
    });
    switch (encoding) {
      case "macroman":
        id = 0;
        indexes = (function() {
          var _results = [];
          for (i = 0; i < 256; ++i) {
            _results.push(0);
          }
          return _results;
        })();
        map = {
          0: 0
        };
        codeMap = {};
        for (_i = 0, _len = codes.length; _i < _len; _i++) {
          code = codes[_i];
          if (map[(_name = charmap[code])] == null) {
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
        return {
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
            for (
              code = _l = startCode;
              startCode <= endCode ? _l <= endCode : _l >= endCode;
              code = startCode <= endCode ? ++_l : --_l
            ) {
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
        return {
          charMap: charMap,
          subtable: subtable.data,
          maxGlyphID: nextID + 1
        };
    }
  };
  return CmapEntry;
})();

var CmapTable = (function(_super) {
  __extends(CmapTable, _super);

  function CmapTable() {
    return CmapTable.__super__.constructor.apply(this, arguments);
  }
  CmapTable.prototype.tag = "cmap";
  CmapTable.prototype.parse = function(data) {
    var entry, i, tableCount;
    data.pos = this.offset;
    this.version = data.readUInt16();
    tableCount = data.readUInt16();
    this.tables = [];
    this.unicode = null;
    for (
      i = 0;
      0 <= tableCount ? i < tableCount : i > tableCount;
      i = 0 <= tableCount ? ++i : --i
    ) {
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
  CmapTable.encode = function(charmap, encoding) {
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
})(Table);

var HheaTable = (function(_super) {
  __extends(HheaTable, _super);

  function HheaTable() {
    return HheaTable.__super__.constructor.apply(this, arguments);
  }
  HheaTable.prototype.tag = "hhea";
  HheaTable.prototype.parse = function(data) {
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
    return (this.numberOfMetrics = data.readUInt16());
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
})(Table);

var OS2Table = (function(_super) {
  __extends(OS2Table, _super);

  function OS2Table() {
    return OS2Table.__super__.constructor.apply(this, arguments);
  }
  OS2Table.prototype.tag = "OS/2";
  OS2Table.prototype.parse = function(data) {
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
    this.panose = (function() {
      var i, _results;
      _results = [];
      for (i = 0; i < 10; ++i) {
        _results.push(data.readByte());
      }
      return _results;
    })();
    this.charRange = (function() {
      var i, _results;
      _results = [];
      for (i = 0; i < 4; ++i) {
        _results.push(data.readInt());
      }
      return _results;
    })();
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
      this.codePageRange = (function() {
        var i, _results;
        _results = [];
        for (i = 0; i < 2; i = ++i) {
          _results.push(data.readInt());
        }
        return _results;
      })();
      if (this.version > 1) {
        this.xHeight = data.readShort();
        this.capHeight = data.readShort();
        this.defaultChar = data.readShort();
        this.breakChar = data.readShort();
        return (this.maxContext = data.readShort());
      }
    }
  };
  /*OS2Table.prototype.encode = function () {
            return this.raw();
        };*/
  return OS2Table;
})(Table);

var PostTable = (function(_super) {
  __extends(PostTable, _super);

  function PostTable() {
    return PostTable.__super__.constructor.apply(this, arguments);
  }
  PostTable.prototype.tag = "post";
  PostTable.prototype.parse = function(data) {
    var length, numberOfGlyphs, _results;
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
        var i;
        for (
          i = 0;
          0 <= numberOfGlyphs ? i < numberOfGlyphs : i > numberOfGlyphs;
          i = 0 <= numberOfGlyphs ? ++i : --i
        ) {
          this.glyphNameIndex.push(data.readUInt16());
        }
        this.names = [];
        _results = [];
        while (data.pos < this.offset + this.length) {
          length = data.readByte();
          _results.push(this.names.push(data.readString(length)));
        }
        return _results;
      case 0x00025000:
        numberOfGlyphs = data.readUInt16();
        return (this.offsets = data.read(numberOfGlyphs));
      case 0x00030000:
        break;
      case 0x00040000:
        return (this.map = function() {
          var _j, _ref, _results1;
          _results1 = [];
          for (
            i = _j = 0, _ref = this.file.maxp.numGlyphs;
            0 <= _ref ? _j < _ref : _j > _ref;
            i = 0 <= _ref ? ++_j : --_j
          ) {
            _results1.push(data.readUInt32());
          }
          return _results1;
        }.call(this));
    }
  };
  return PostTable;
})(Table);

/*********************************************************************************************************/
/* function : NameEntry                                                                                  */
/* comment : Store copyright information, platformID, encodingID, and languageID in the NameEntry object.*/
/*********************************************************************************************************/
var NameEntry = (function() {
  function NameEntry(raw, entry) {
    this.raw = raw;
    this.length = raw.length;
    this.platformID = entry.platformID;
    this.encodingID = entry.encodingID;
    this.languageID = entry.languageID;
  }
  return NameEntry;
})();

var NameTable = (function(_super) {
  __extends(NameTable, _super);

  function NameTable() {
    return NameTable.__super__.constructor.apply(this, arguments);
  }
  NameTable.prototype.tag = "name";
  NameTable.prototype.parse = function(data) {
    var count,
      entries,
      entry,
      i,
      name,
      stringOffset,
      strings,
      text,
      _j,
      _len,
      _name;
    data.pos = this.offset;
    data.readShort(); //format
    count = data.readShort();
    stringOffset = data.readShort();
    entries = [];
    for (
      i = 0;
      0 <= count ? i < count : i > count;
      i = 0 <= count ? ++i : --i
    ) {
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
      if (strings[(_name = entry.nameID)] == null) {
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
      this.postscriptName = strings[6][0].raw.replace(
        /[\x00-\x19\x80-\xff]/g,
        ""
      );
    } catch (e) {
      this.postscriptName = strings[4][0].raw.replace(
        /[\x00-\x19\x80-\xff]/g,
        ""
      );
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
    return (this.sampleText = strings[19]);
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
})(Table);

var MaxpTable = (function(_super) {
  __extends(MaxpTable, _super);

  function MaxpTable() {
    return MaxpTable.__super__.constructor.apply(this, arguments);
  }
  MaxpTable.prototype.tag = "maxp";
  MaxpTable.prototype.parse = function(data) {
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
    return (this.maxComponentDepth = data.readUInt16());
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
})(Table);

var HmtxTable = (function(_super) {
  __extends(HmtxTable, _super);

  function HmtxTable() {
    return HmtxTable.__super__.constructor.apply(this, arguments);
  }
  HmtxTable.prototype.tag = "hmtx";
  HmtxTable.prototype.parse = function(data) {
    var i, last, lsbCount, m, _j, _ref, _results;
    data.pos = this.offset;
    this.metrics = [];
    for (
      i = 0, _ref = this.file.hhea.numberOfMetrics;
      0 <= _ref ? i < _ref : i > _ref;
      i = 0 <= _ref ? ++i : --i
    ) {
      this.metrics.push({
        advance: data.readUInt16(),
        lsb: data.readInt16()
      });
    }
    lsbCount = this.file.maxp.numGlyphs - this.file.hhea.numberOfMetrics;
    this.leftSideBearings = (function() {
      var _j, _results;
      _results = [];
      for (
        i = _j = 0;
        0 <= lsbCount ? _j < lsbCount : _j > lsbCount;
        i = 0 <= lsbCount ? ++_j : --_j
      ) {
        _results.push(data.readInt16());
      }
      return _results;
    })();
    this.widths = function() {
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
    for (
      i = _j = 0;
      0 <= lsbCount ? _j < lsbCount : _j > lsbCount;
      i = 0 <= lsbCount ? ++_j : --_j
    ) {
      _results.push(this.widths.push(last));
    }
    return _results;
  };
  /***************************************************************/
  /* function : forGlyph                                         */
  /* comment : Returns the advance width and lsb for this glyph. */
  /***************************************************************/
  HmtxTable.prototype.forGlyph = function(id) {
    if (id in this.metrics) {
      return this.metrics[id];
    }
    return {
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
})(Table);

var __slice = [].slice;

var GlyfTable = (function(_super) {
  __extends(GlyfTable, _super);

  function GlyfTable() {
    return GlyfTable.__super__.constructor.apply(this, arguments);
  }
  GlyfTable.prototype.tag = "glyf";
  GlyfTable.prototype.parse = function() {
    return (this.cache = {});
  };
  GlyfTable.prototype.glyphFor = function(id) {
    var data,
      index,
      length,
      loca,
      numberOfContours,
      raw,
      xMax,
      xMin,
      yMax,
      yMin;
    if (id in this.cache) {
      return this.cache[id];
    }
    loca = this.file.loca;
    data = this.file.contents;
    index = loca.indexOf(id);
    length = loca.lengthOf(id);
    if (length === 0) {
      return (this.cache[id] = null);
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
      this.cache[id] = new SimpleGlyph(
        raw,
        numberOfContours,
        xMin,
        yMin,
        xMax,
        yMax
      );
    }
    return this.cache[id];
  };
  GlyfTable.prototype.encode = function(glyphs, mapping, old2new) {
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
})(Table);

var SimpleGlyph = (function() {
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
  SimpleGlyph.prototype.encode = function() {
    return this.raw.data;
  };
  return SimpleGlyph;
})();

var CompoundGlyph = (function() {
  var ARG_1_AND_2_ARE_WORDS,
    MORE_COMPONENTS,
    WE_HAVE_AN_X_AND_Y_SCALE,
    WE_HAVE_A_SCALE,
    WE_HAVE_A_TWO_BY_TWO;
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
      this.glyphIDs.push(data.readUInt16());
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
  CompoundGlyph.prototype.encode = function() {
    var i, result, _len, _ref;
    result = new Data(__slice.call(this.raw.data));
    _ref = this.glyphIDs;
    for (i = 0, _len = _ref.length; i < _len; ++i) {
      result.pos = this.glyphOffsets[i];
    }
    return result.data;
  };
  return CompoundGlyph;
})();

var LocaTable = (function(_super) {
  __extends(LocaTable, _super);

  function LocaTable() {
    return LocaTable.__super__.constructor.apply(this, arguments);
  }
  LocaTable.prototype.tag = "loca";
  LocaTable.prototype.parse = function(data) {
    var format, i;
    data.pos = this.offset;
    format = this.file.head.indexToLocFormat;
    if (format === 0) {
      return (this.offsets = function() {
        var _ref, _results;
        _results = [];
        for (i = 0, _ref = this.length; i < _ref; i += 2) {
          _results.push(data.readUInt16() * 2);
        }
        return _results;
      }.call(this));
    } else {
      return (this.offsets = function() {
        var _ref, _results;
        _results = [];
        for (i = 0, _ref = this.length; i < _ref; i += 4) {
          _results.push(data.readUInt32());
        }
        return _results;
      }.call(this));
    }
  };
  LocaTable.prototype.indexOf = function(id) {
    return this.offsets[id];
  };
  LocaTable.prototype.lengthOf = function(id) {
    return this.offsets[id + 1] - this.offsets[id];
  };
  LocaTable.prototype.encode = function(offsets, activeGlyphs) {
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
})(Table);

/************************************************************************************/
/* function : invert                                                                */
/* comment : Change the object's (key: value) to create an object with (value: key).*/
/************************************************************************************/
var invert = function(object) {
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

var Subset = (function() {
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
  Subset.prototype.generateCmap = function() {
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
  Subset.prototype.glyphsFor = function(glyphIDs) {
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
  Subset.prototype.encode = function(glyID, indexToLocFormat) {
    var cmap,
      code,
      glyf,
      glyphs,
      id,
      ids,
      loca,
      new2old,
      newIDs,
      nextGlyphID,
      old2new,
      oldID,
      oldIDs,
      tables,
      _ref;
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
    newIDs = Object.keys(new2old).sort(function(a, b) {
      return a - b;
    });
    oldIDs = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = newIDs.length; _i < _len; _i++) {
        id = newIDs[_i];
        _results.push(new2old[id]);
      }
      return _results;
    })();
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
})();

jsPDF.API.PDFObject = (function() {
  var pad;

  function PDFObject() {}
  pad = function(str, length) {
    return (Array(length + 1).join("0") + str).slice(-length);
  };
  /*****************************************************************************/
  /* function : convert                                                        */
  /* comment :Converts pdf tag's / FontBBox and array values in / W to strings */
  /*****************************************************************************/
  PDFObject.convert = function(object) {
    var e, items, key, out, val;
    if (Array.isArray(object)) {
      items = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = object.length; _i < _len; _i++) {
          e = object[_i];
          _results.push(PDFObject.convert(e));
        }
        return _results;
      })().join(" ");
      return "[" + items + "]";
    } else if (typeof object === "string") {
      return "/" + object;
    } else if (object != null ? object.isString : void 0) {
      return "(" + object + ")";
    } else if (object instanceof Date) {
      return (
        "(D:" +
        pad(object.getUTCFullYear(), 4) +
        pad(object.getUTCMonth(), 2) +
        pad(object.getUTCDate(), 2) +
        pad(object.getUTCHours(), 2) +
        pad(object.getUTCMinutes(), 2) +
        pad(object.getUTCSeconds(), 2) +
        "Z)"
      );
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
})();

exports.AcroForm = AcroForm;
exports.AcroFormAppearance = AcroFormAppearance;
exports.AcroFormButton = AcroFormButton;
exports.AcroFormCheckBox = AcroFormCheckBox;
exports.AcroFormChoiceField = AcroFormChoiceField;
exports.AcroFormComboBox = AcroFormComboBox;
exports.AcroFormEditBox = AcroFormEditBox;
exports.AcroFormListBox = AcroFormListBox;
exports.AcroFormPasswordField = AcroFormPasswordField;
exports.AcroFormPushButton = AcroFormPushButton;
exports.AcroFormRadioButton = AcroFormRadioButton;
exports.AcroFormTextField = AcroFormTextField;
exports.GState = GState;
exports.ShadingPattern = ShadingPattern;
exports.TilingPattern = TilingPattern;
exports.default = jsPDF;
exports.jsPDF = jsPDF;
//# sourceMappingURL=jspdf.node.js.map
