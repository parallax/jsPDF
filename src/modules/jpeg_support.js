/**
 * @license
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";

/**
 * jsPDF jpeg Support PlugIn
 *
 * @name jpeg_support
 * @module
 */
(function(jsPDFAPI) {
  "use strict";

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

  var readU16 = function(data, offset, little) {
    var a = data.charCodeAt(offset);
    var b = data.charCodeAt(offset + 1);
    if (isNaN(a) || isNaN(b)) {
      return -1;
    }
    return little ? a + (b << 8) : (a << 8) + b;
  };

  var readU32 = function(data, offset, little) {
    var a = data.charCodeAt(offset);
    var b = data.charCodeAt(offset + 1);
    var c = data.charCodeAt(offset + 2);
    var d = data.charCodeAt(offset + 3);
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
      return -1;
    }
    if (little) {
      return a + (b << 8) + (c << 16) + d * 16777216;
    }
    return a * 16777216 + (b << 16) + (c << 8) + d;
  };

  // TIFF tag 0x0112. Returns 1..8, or 0 when this APP1 segment is not Exif.
  var readExifApp1Orientation = function(data, start, length) {
    if (length < 16 || data.substr(start, 6) !== "Exif\x00\x00") {
      return 0;
    }
    var tiff = start + 6;
    var order = data.substr(tiff, 2);
    var little = order === "II";
    if (!little && order !== "MM") {
      return 0;
    }
    if (readU16(data, tiff + 2, little) !== 42) {
      return 0;
    }
    var ifdOffset = readU32(data, tiff + 4, little);
    if (ifdOffset < 8) {
      return 0;
    }
    var ifd = tiff + ifdOffset;
    var end = start + length;
    if (ifd + 2 > end) {
      return 0;
    }
    var count = readU16(data, ifd, little);
    if (count < 1 || ifd + 2 + count * 12 > end) {
      return 0;
    }
    var i;
    for (i = 0; i < count; i += 1) {
      var entry = ifd + 2 + i * 12;
      if (readU16(data, entry, little) !== 0x0112) {
        continue;
      }
      var value = readU16(data, entry + 8, little);
      return value >= 1 && value <= 8 ? value : 0;
    }
    return 0;
  };

  // JPEG APP1 / Exif orientation. Missing or unreadable tags stay at 1.
  var readJpegExifOrientation = function(data) {
    if (
      typeof data !== "string" ||
      data.length < 4 ||
      data.charCodeAt(0) !== 0xff ||
      data.charCodeAt(1) !== 0xd8
    ) {
      return 1;
    }
    var offset = 2;
    var len = data.length;
    while (offset + 1 < len) {
      if (data.charCodeAt(offset) !== 0xff) {
        return 1;
      }
      while (offset < len && data.charCodeAt(offset) === 0xff) {
        offset += 1;
      }
      if (offset >= len) {
        return 1;
      }
      var marker = data.charCodeAt(offset);
      offset += 1;
      if (marker === 0xd9 || marker === 0xda) {
        return 1;
      }
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
        continue;
      }
      if (offset + 1 >= len) {
        return 1;
      }
      var size = data.charCodeAt(offset) * 256 + data.charCodeAt(offset + 1);
      if (size < 2 || offset + size > len) {
        return 1;
      }
      if (marker === 0xe1) {
        var orientation = readExifApp1Orientation(data, offset + 2, size - 2);
        if (orientation >= 1 && orientation <= 8) {
          return orientation;
        }
      }
      offset += size;
    }
    return 1;
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
        alias: alias,
        orientation: readJpegExifOrientation(data)
      };
    }
    return result;
  };
})(jsPDF.API);
