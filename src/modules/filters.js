/**
 * jsPDF filters PlugIn
 * Copyright (c) 2014 Aras Abbasi 
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function (jsPDFAPI) {
  'use strict';
  
  var ASCII85Encode = function(a) {
      var b, c, d, e, f, g, h, i, j, k;
      for (!/[^\x00-\xFF]/.test(a), b = "\x00\x00\x00\x00".slice(a.length % 4 || 4), a += b, 
      c = [], d = 0, e = a.length; e > d; d += 4) f = (a.charCodeAt(d) << 24) + (a.charCodeAt(d + 1) << 16) + (a.charCodeAt(d + 2) << 8) + a.charCodeAt(d + 3), 
      0 !== f ? (k = f % 85, f = (f - k) / 85, j = f % 85, f = (f - j) / 85, i = f % 85, 
      f = (f - i) / 85, h = f % 85, f = (f - h) / 85, g = f % 85, c.push(g + 33, h + 33, i + 33, j + 33, k + 33)) :c.push(122);
      return function(a, b) {
      for (var c = b; c > 0; c--) a.pop();
      }(c, b.length), String.fromCharCode.apply(String, c) + "~>";
    }

  var ASCII85Decode = function(a) {
    var c, d, e, f, g, h = String, l = "length", w = 255, x = "charCodeAt", y = "slice", z = "replace";
    for ("~>" === a[y](-2), a = a[y](0, -2)[z](/\s/g, "")[z]("z", "!!!!!"), 
    c = "uuuuu"[y](a[l] % 5 || 5), a += c, e = [], f = 0, g = a[l]; g > f; f += 5) d = 52200625 * (a[x](f) - 33) + 614125 * (a[x](f + 1) - 33) + 7225 * (a[x](f + 2) - 33) + 85 * (a[x](f + 3) - 33) + (a[x](f + 4) - 33), 
    e.push(w & d >> 24, w & d >> 16, w & d >> 8, w & d);
    return function(a, b) {
    for (var c = b; c > 0; c--) a.pop();
    }(e, c[l]), h.fromCharCode.apply(h, e);
  }
    
    
  //https://gist.github.com/revolunet/843889
  // LZW-compress a string
  var LZWEncode = function(s, options) {
    options = Object.assign({
      predictor: 1,
      colors: 1,
      bitsPerComponent: 8,
      columns: 1,
      earlyChange: 1
    }, options);

    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256; //0xe000
    for (var i=1; i<data.length; i++) {
      currChar=data[i];
      if (dict['_' + phrase + currChar] != null) {
        phrase += currChar;
      }
      else {
        out.push(phrase.length > 1 ? dict['_'+phrase] : phrase.charCodeAt(0));
        dict['_' + phrase + currChar] = code;
        code++;
        phrase=currChar;
      }
    }
    out.push(phrase.length > 1 ? dict['_'+phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
      out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
  }

  // Decompress an LZW-encoded string
  var LZWDecode = function(s, options) {
    options = Object.assign({
      predictor: 1,
      colors: 1,
      bitsPerComponent: 8,
      columns: 1,
      earlyChange: 1
    }, options);

    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
      var currCode = data[i].charCodeAt(0);
      if (currCode < 256) {
        phrase = data[i];
      }
      else {
         phrase = dict['_'+currCode] ? dict['_'+currCode] : (oldPhrase + currChar);
      }
      out.push(phrase);
      currChar = phrase.charAt(0);
      dict['_'+code] = oldPhrase + currChar;
      code++;
      oldPhrase = phrase;
    }
    return out.join("");
  }
  
  var ASCIIHexEncode = function(value) {
    var result = '';
    var i;
    for (var i = 0; i < value.length; i += 1) {
      result += ("0" + value.charCodeAt(i).toString(16)).slice(-2);
    }
    result += '>';
    return result;
  }
  
  var ASCIIHexDecode = function(value) {
    var regexCheckIfHex = new RegExp(/^([0-9A-Fa-f]{2})+$/);
    value = value.replace(/\s/g,'');
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
    var i;
    for (var i = 0; i < value.length; i += 2) {
      result += String.fromCharCode("0x"+ (value[i] + value[(i+1)]));
    }
    return result;
  }
  
  var RunLengthEncode = function(data) {
    function convertToAscii(str) {
      'use strict';
      var result = '',
        currentChar = '',
        i = 0;
      for (; i < str.length; i += 1) {
        currentChar = str[i].charCodeAt(0).toString(2);
        if (currentChar.length < 8) {
          while (8 - currentChar.length) {
            currentChar = '0' + currentChar;
          }
        }
        result += currentChar;
      }
      return result;
    }
    
    function hex2a(hexx) {
      var hex = hexx.toString();//force conversion
      var str = '';
      for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str;
    }
    
    return parseInt(convertToAscii(data) , 2).toString(16);
  }
  
  //taken from TCPDF-project
  var RunLengthDecode = function(data) {
    // initialize string to return
    var decoded = '';
    var byte; 
    // data length
    var data_length = data.length;
    var i = 0;
    while(i < data_length) {
      // get current byte value
      byte = data[i].charCodeAt(0);
      if (byte == 128) {
        // a length value of 128 denote EOD
        break;
      } else if (byte < 128) {
        // if the length byte is in the range 0 to 127
        // the following length + 1 (1 to 128) bytes shall be copied literally during decompression
        decoded += data.substr((i + 1), (byte + 1));
        // move to next block
        i += (byte + 2);
      } else {
        // if length is in the range 129 to 255,
        // the following single byte shall be copied 257 - length (2 to 128) times during decompression
        decoded += data[(i + 1)].repeat(257 - byte);
        // move to next block
        i += 2;
      }
    }
    return decoded;
  }
  
  var FlatePredictors = {
      None: 1,
      TIFF: 2,
      PNG_None: 10,
      PNG_Sub: 11,
      PNG_Up: 12,
      PNG_Average: 13,
      PNG_Paeth: 14,
      PNG_Optimum: 15
  }

  var FlateEncode = function(data, options) {
    options = Object.assign({
      predictor: 1,
      colors: 1,
      bitsPerComponent: 8,
      columns: 1
    }, options);
    var arr = [];
    var i = data.length;
    var adler32;
    var deflater;
    
    while (i--) {
      arr[i] = data.charCodeAt(i);
    }
    adler32 = jsPDFAPI.adler32cs.from(data);
    deflater = new Deflater(6);
    deflater.append(new Uint8Array(arr));
    data = deflater.flush();
    arr = new Uint8Array(data.length + 6);
    arr.set(new Uint8Array([120, 156])), arr.set(data, 2);
    arr.set(new Uint8Array([
      adler32 & 0xFF, 
      (adler32 >> 8) & 0xFF, 
      (adler32 >> 16) & 0xFF, 
      (adler32 >> 24) & 0xFF]), 
      data.length + 2);
    data = String.fromCharCode.apply(null, arr);
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
      case "LZWDecode":
      case "/LZWDecode":
        data = LZWDecode(data);
        reverseChain.push("/LZWEncode");
        break;
      case "LZWEncode":
      case "/LZWEncode":
        data = LZWEncode(data);
        reverseChain.push("/LZWDecode");
        break;
      default:
        throw "The filter: \"" + filterChain[i] + "\" is not implemented"; 
      }
    }
    
    return {data: data, reverseChain: reverseChain.reverse().join(" ")};
  };
})(jsPDF.API);
