/* global jsPDF, Deflater */
/**
 * jsPDF filters PlugIn
 * Copyright (c) 2014 Aras Abbasi 
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function (jsPDFAPI) {
  'use strict';

  var ASCII85Encode = function (a) {
    var b, c, d, e, f, g, h, i, j, k;
    // eslint-disable-next-line no-control-regex
    for (!/[^\x00-\xFF]/.test(a), b = "\x00\x00\x00\x00".slice(a.length % 4 || 4), a += b,
      c = [], d = 0, e = a.length; e > d; d += 4) f = (a.charCodeAt(d) << 24) + (a.charCodeAt(d + 1) << 16) + (a.charCodeAt(d + 2) << 8) + a.charCodeAt(d + 3),
        0 !== f ? (k = f % 85, f = (f - k) / 85, j = f % 85, f = (f - j) / 85, i = f % 85,
          f = (f - i) / 85, h = f % 85, f = (f - h) / 85, g = f % 85, c.push(g + 33, h + 33, i + 33, j + 33, k + 33)) : c.push(122);
    return function (a, b) {
      for (var c = b; c > 0; c--) a.pop();
    }(c, b.length), String.fromCharCode.apply(String, c) + "~>";
  }

  var ASCII85Decode = function (a) {
    var c, d, e, f, g, h = String, l = "length", w = 255, x = "charCodeAt", y = "slice", z = "replace";
    for ("~>" === a[y](-2), a = a[y](0, -2)[z](/\s/g, "")[z]("z", "!!!!!"),
      c = "uuuuu"[y](a[l] % 5 || 5), a += c, e = [], f = 0, g = a[l]; g > f; f += 5) d = 52200625 * (a[x](f) - 33) + 614125 * (a[x](f + 1) - 33) + 7225 * (a[x](f + 2) - 33) + 85 * (a[x](f + 3) - 33) + (a[x](f + 4) - 33),
        e.push(w & d >> 24, w & d >> 16, w & d >> 8, w & d);
    return function (a, b) {
      for (var c = b; c > 0; c--) a.pop();
    }(e, c[l]), h.fromCharCode.apply(h, e);
  };

  var ASCIIHexEncode = function (value) {
    return value.split('').map(function (value) {return ("0" + value.charCodeAt().toString(16)).slice(-2); }).join('') + '>';
  };

  var ASCIIHexDecode = function (value) {
    var regexCheckIfHex = new RegExp(/^([0-9A-Fa-f]{2})+$/);
    value = value.replace(/\s/g, '');
    if (value.indexOf(">") !== -1) {
      value = value.substr(0, value.indexOf(">"));
    }
    if (value.length % 2) {
      value += "0";
    }
    if (regexCheckIfHex.test(value) === false) {
      return "";
    }
    var result = '';
    for (var i = 0; i < value.length; i += 2) {
      result += String.fromCharCode("0x" + (value[i] + value[(i + 1)]));
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

  var appendBuffer = function (buffer1, buffer2) {
    var combinedBuffer = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    combinedBuffer.set(new Uint8Array(buffer1), 0);
    combinedBuffer.set(new Uint8Array(buffer2), buffer1.byteLength);
    return combinedBuffer;
  };

  var FlateEncode = function (data) {
    var arr = [];
    var i = data.length;
    var adler32;
    var deflater;

    while (i--) {
      arr[i] = data.charCodeAt(i);
    }
    adler32 = jsPDFAPI.adler32cs.from(data);
    deflater = new Deflater(6);
    data = deflater.append(new Uint8Array(arr));
    data = appendBuffer(data, deflater.flush());
    arr = new Uint8Array(data.byteLength + 6);
    arr.set(new Uint8Array([120, 156]));
    arr.set(data, 2);
    arr.set(new Uint8Array([adler32 & 0xff, adler32 >> 8 & 0xff, adler32 >> 16 & 0xff, adler32 >> 24 & 0xff]), data.byteLength + 2);
    data = arr.reduce(function (data, byte) {
      return data + String.fromCharCode(byte);
    }, '');
    return data;
  }

  jsPDFAPI.processDataByFilters = function (origData, filterChain) {
    'use strict';
    var i = 0;
    var data = origData || '';
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
          throw new Error("The filter: \"" + filterChain[i] + "\" is not implemented");
      }
    }

    return { data: data, reverseChain: reverseChain.reverse().join(" ") };
  };
})(jsPDF.API);
