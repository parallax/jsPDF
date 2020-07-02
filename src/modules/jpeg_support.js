/* global jsPDF */
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
