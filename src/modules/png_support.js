/* global jsPDF, Deflater, PNG */
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
(function (jsPDFAPI, global) {
  'use strict'

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

  var doesNotHavePngJS = function () {
    return typeof global.PNG !== 'function' || typeof global.FlateStream !== 'function';
  }
    , canCompress = function (value) {
      return value !== jsPDFAPI.image_compression.NONE && hasCompressionJS();
    }
    , hasCompressionJS = function () {
      var inst = typeof Deflater === 'function';
      if (!inst)
        throw new Error("requires deflate.js for compression")
      return inst;
    }
    , compressBytes = function (bytes, lineLength, colorsPerPixel, compression) {

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
          filter_method = filterPaeth;//uses to sum to choose best filter for each line
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

      cmpd[len++] = (checksum >>> 24) & 0xff;
      cmpd[len++] = (checksum >>> 16) & 0xff;
      cmpd[len++] = (checksum >>> 8) & 0xff;
      cmpd[len++] = checksum & 0xff;

      return jsPDFAPI.__addimage__.arrayBufferToBinaryString(cmpd);
    }
    , createZlibHeader = function (bytes, level) {
      /*
       * @see http://www.ietf.org/rfc/rfc1950.txt for zlib header
       */
      var cm = 8;
      var cinfo = Math.LOG2E * Math.log(0x8000) - 8;
      var cmf = (cinfo << 4) | cm;

      var hdr = cmf << 8;
      var flevel = Math.min(3, ((level - 1) & 0xff) >> 1);

      hdr |= (flevel << 6);
      hdr |= 0;//FDICT
      hdr += 31 - (hdr % 31);

      return [cmf, (hdr & 0xff) & 0xff];
    }
    , adler32 = function (array, param) {
      var adler = 1;
      var s1 = adler & 0xffff,
        s2 = (adler >>> 16) & 0xffff;
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

      return ((s2 << 16) | s1) >>> 0;
    }
    , applyPngFilterMethod = function (bytes, lineLength, colorsPerPixel, filter_method) {
      var lines = bytes.length / lineLength,
        result = new Uint8Array(bytes.length + lines),
        filter_methods = getFilterMethods(),
        i = 0, line, prevLine, offset;

      for (; i < lines; i++) {
        offset = i * lineLength;
        line = bytes.subarray(offset, offset + lineLength);

        if (filter_method) {
          result.set(filter_method(line, colorsPerPixel, prevLine), offset + i);

        } else {

          var j = 0,
            len = filter_methods.length,
            results = [];

          for (; j < len; j++)
            results[j] = filter_methods[j](line, colorsPerPixel, prevLine);

          var ind = getIndexOfSmallestSum(results.concat());

          result.set(results[ind], offset + i);
        }

        prevLine = line;
      }

      return result;
    }
    , filterNone = function (line) {
      /*var result = new Uint8Array(line.length + 1);
      result[0] = 0;
      result.set(line, 1);*/

      var result = Array.apply([], line);
      result.unshift(0);

      return result;
    }
    , filterSub = function (line, colorsPerPixel) {
      var result = [],
        i = 0,
        len = line.length,
        left;

      result[0] = 1;

      for (; i < len; i++) {
        left = line[i - colorsPerPixel] || 0;
        result[i + 1] = (line[i] - left + 0x0100) & 0xff;
      }

      return result;
    }
    , filterUp = function (line, colorsPerPixel, prevLine) {
      var result = [],
        i = 0,
        len = line.length,
        up;

      result[0] = 2;

      for (; i < len; i++) {
        up = prevLine && prevLine[i] || 0;
        result[i + 1] = (line[i] - up + 0x0100) & 0xff;
      }

      return result;
    }
    , filterAverage = function (line, colorsPerPixel, prevLine) {
      var result = [],
        i = 0,
        len = line.length,
        left,
        up;

      result[0] = 3;

      for (; i < len; i++) {
        left = line[i - colorsPerPixel] || 0;
        up = prevLine && prevLine[i] || 0;
        result[i + 1] = (line[i] + 0x0100 - ((left + up) >>> 1)) & 0xff;
      }

      return result;
    }
    , filterPaeth = function (line, colorsPerPixel, prevLine) {
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
        result[i + 1] = (line[i] - paeth + 0x0100) & 0xff;
      }

      return result;
    }
    , paethPredictor = function (left, up, upLeft) {

      var p = left + up - upLeft,
        pLeft = Math.abs(p - left),
        pUp = Math.abs(p - up),
        pUpLeft = Math.abs(p - upLeft);

      return (pLeft <= pUp && pLeft <= pUpLeft) ? left : (pUp <= pUpLeft) ? up : upLeft;
    }
    , getFilterMethods = function () {
      return [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
    }
    , getIndexOfSmallestSum = function (arrays) {
      var i = 0,
        len = arrays.length,
        sum, min, ind;

      while (i < len) {
        sum = absSum(arrays[i].slice(1));

        if (sum < min || !min) {
          min = sum;
          ind = i;
        }

        i++;
      }

      return ind;
    }
    , absSum = function (array) {
      var i = 0,
        len = array.length,
        sum = 0;

      while (i < len)
        sum += Math.abs(array[i++]);

      return sum;
    }
    , getPredictorFromCompression = function (compression) {
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
  jsPDFAPI.processPNG = function (imageData, index, alias, compression) {
    'use strict'

    var colorSpace = this.color_spaces.DEVICE_RGB,
      filter = this.decode.FLATE_DECODE,
      bitsPerComponent = 8,
      image, decodeParameters = '', trns,
      colors, pal, smask,
      pixels, len, alphaData, imgData, hasColors, pixel,
      i, n;

    if (this.__addimage__.isArrayBuffer(imageData))
      imageData = new Uint8Array(imageData);

    if (this.__addimage__.isArrayBufferView(imageData)) {

      if (doesNotHavePngJS())
        throw new Error("PNG support requires png.js and zlib.js");

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

          pixels = image.pixelBitlength == 32 ? new Uint32Array(image.decodePixels().buffer) : image.pixelBitlength == 16 ? new Uint16Array(image.decodePixels().buffer) : new Uint8Array(image.decodePixels().buffer);
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
          imgData = new Uint8Array((len * (32 / image.pixelBitlength)) * image.colors);
          alphaData = new Uint8Array(len * (32 / image.pixelBitlength));
          hasColors = image.colors > 1;
          i = 0;
          n = 0;
          var a = 0;

          while (i < len) {
            pixel = pixels[i++];

            imgData[n++] = (pixel >>> 0) & 0xFF;

            if (hasColors) {
              imgData[n++] = (pixel >>> 16) & 0xFF;

              pixel = pixels[i++];
              imgData[n++] = (pixel >>> 0) & 0xFF;
            }

            alphaData[a++] = (pixel >>> 16) & 0xFF;
          }
          bitsPerComponent = 8;
        }

        if (canCompress(compression)) {
          imageData = compressBytes(imgData, image.width * image.colors, image.colors, compression);
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
        decodeParameters = '/Predictor ' + predictor + ' ';
      }
      decodeParameters += '/Colors ' + colors + ' /BitsPerComponent ' + bitsPerComponent + ' /Columns ' + image.width;

      if (this.__addimage__.isArrayBuffer(imageData) || this.__addimage__.isArrayBufferView(imageData)) {
        imageData = this.__addimage__.arrayBufferToBinaryString(imageData);
      }

      if (smask && this.__addimage__.isArrayBuffer(smask) || this.__addimage__.isArrayBufferView(smask)) {
        smask = this.__addimage__.arrayBufferToBinaryString(smask);
      }

      return { alias: alias, data: imageData, index: index, filter: filter, decodeParameters: decodeParameters, transparency: trns, palette: pal, sMask: smask, predictor: predictor, width: image.width, height: image.height, bitsPerComponent: bitsPerComponent, colorSpace: colorSpace };
    }

    throw new Error("Unsupported PNG image data, try using JPEG instead.");
  }

})(jsPDF.API, typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || Function('return typeof this === "object" && this.content')() || Function('return this')());
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window
