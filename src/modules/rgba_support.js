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
import {
  canCompress,
  compressBytes,
  getPredictorFromCompression
} from "./compression_utils.js";

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
   */
  jsPDFAPI.processRGBA = function(imageData, index, alias, compression) {
    "use strict";

    const imagePixels = imageData.data;
    const length = imagePixels.length;
    // jsPDF takes alpha data separately so extract that.
    const rgbOut = new Uint8Array((length / 4) * 3);
    const alphaOut = new Uint8Array(length / 4);
    let outIndex = 0;
    let alphaIndex = 0;

    for (let i = 0; i < length; i += 4) {
      const r = imagePixels[i];
      const g = imagePixels[i + 1];
      const b = imagePixels[i + 2];
      const alpha = imagePixels[i + 3];
      rgbOut[outIndex++] = r;
      rgbOut[outIndex++] = g;
      rgbOut[outIndex++] = b;
      alphaOut[alphaIndex++] = alpha;
    }

    const width = imageData.width;
    const height = imageData.height;

    const baseInfo = {
      sMaskBitsPerComponent: 8,
      index,
      alias,
      colorSpace: "DeviceRGB",
      bitsPerComponent: 8,
      width,
      height
    };

    // Check if compression is enabled
    if (canCompress(compression)) {
      // Compress RGB data (3 colors × 8 bits)
      const rowByteLength = width * 3;
      const rgbData = compressBytes(
        rgbOut,
        rowByteLength,
        3, // colorsPerPixel
        8, // bitsPerComponent
        compression
      );

      // Compress alpha data (1 channel × 8 bits)
      const sMaskRowByteLength = width;
      const sMask = compressBytes(
        alphaOut,
        sMaskRowByteLength,
        1, // colorsPerPixel
        8, // bitsPerComponent
        compression
      );

      const predictor = getPredictorFromCompression(compression);
      const decodeParameters =
        "/Predictor " +
        predictor +
        " /Colors 3 /BitsPerComponent 8 /Columns " +
        width;

      return Object.assign(
        {
          data: rgbData,
          sMask,
          filter: this.decode.FLATE_DECODE,
          decodeParameters,
          predictor
        },
        baseInfo
      );
    } else {
      // Uncompressed path
      return Object.assign(
        {
          data: this.__addimage__.arrayBufferToBinaryString(rgbOut),
          sMask: this.__addimage__.arrayBufferToBinaryString(alphaOut)
        },
        baseInfo
      );
    }
  };
})(jsPDF.API);
