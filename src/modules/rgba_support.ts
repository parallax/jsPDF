/**
 * @license
 *
 * Copyright (c) 2021 Antti Palola, https://github.com/Pantura
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

import { jsPDF } from "../jspdf.js";

/**
 * jsPDF RGBA array PlugIn
 * @name rgba_support
 * @module
 */
(function(jsPDFAPI) {
  "use strict";

  /**
   * @name processRGBA
   * @function
   *
   * Process RGBA Array. This is a one-dimension array with pixel data [red, green, blue, alpha, red, green, ...].
   * RGBA array data can be obtained from DOM canvas getImageData.
   * @ignore
   */
  jsPDFAPI.processRGBA = function(imageData, index, alias) {
    "use strict";

    let imagePixels = imageData.data;
    let length = imagePixels.length;
    // jsPDF takes alpha data separately so extract that.
    let rgbOut = new Uint8Array((length / 4) * 3);
    let alphaOut = new Uint8Array(length / 4);
    let outIndex = 0;
    let alphaIndex = 0;

    for (let i = 0; i < length; i += 4) {
      let r = imagePixels[i];
      let g = imagePixels[i + 1];
      let b = imagePixels[i + 2];
      let alpha = imagePixels[i + 3];
      rgbOut[outIndex++] = r;
      rgbOut[outIndex++] = g;
      rgbOut[outIndex++] = b;
      alphaOut[alphaIndex++] = alpha;
    }

    let rgbData = this.__addimage__.arrayBufferToBinaryString(rgbOut);
    let alphaData = this.__addimage__.arrayBufferToBinaryString(alphaOut);

    return {
      alpha: alphaData,
      data: rgbData,
      index: index,
      alias: alias,
      colorSpace: "DeviceRGB",
      bitsPerComponent: 8,
      width: imageData.width,
      height: imageData.height
    };
  };
})(jsPDF.API);
