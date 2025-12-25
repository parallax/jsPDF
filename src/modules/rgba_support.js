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

    const { rgb, alpha } = splitColorFromTransparency(imageData);
    const hasTransparentPixels = alpha.some(b => b !== 255);

    const width = imageData.width;
    const height = imageData.height;

    let result = {
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
        rgb,
        rowByteLength,
        3, // colorsPerPixel
        8, // bitsPerComponent
        compression
      );

      const predictor = getPredictorFromCompression(compression);
      const decodeParameters =
        "/Predictor " +
        predictor +
        " /Colors 3 /BitsPerComponent 8 /Columns " +
        width;

      result = Object.assign(result, {
        data: rgbData,
        filter: this.decode.FLATE_DECODE,
        decodeParameters,
        predictor
      });

      if (hasTransparentPixels) {
        // Compress alpha data (1 channel × 8 bits)
        const sMaskRowByteLength = width;
        const sMask = compressBytes(
          alpha,
          sMaskRowByteLength,
          1, // colorsPerPixel
          8, // bitsPerComponent
          compression
        );
        result = Object.assign(result, {
          sMask,
          sMaskBitsPerComponent: 8
        });
      }
    } else {
      // Uncompressed path
      result = Object.assign(result, {
        data: this.__addimage__.arrayBufferToBinaryString(rgb)
      });
      if (hasTransparentPixels) {
        result = Object.assign(result, {
          sMask: this.__addimage__.arrayBufferToBinaryString(alpha),
          sMaskBitsPerComponent: 8
        });
      }
    }
    return result;
  };
})(jsPDF.API);

/**
 * Separates the color values (RGB) from the transparency values (ALPHA)
 * @param {ImageData} imageData - The image data
 * @returns {{rgb: Uint8Array<ArrayBuffer>, alpha: Uint8Array<ArrayBuffer>}} An object with separate attributes for the color values and the transparency values.
 */
function splitColorFromTransparency(imageData) {
  const imagePixels = imageData.data;
  const length = imagePixels.length;

  const rgb = new Uint8Array((length / 4) * 3);
  const alpha = new Uint8Array(length / 4);
  let outIndex = 0;
  let alphaIndex = 0;

  for (let i = 0; i < length; i += 4) {
    const r = imagePixels[i];
    const g = imagePixels[i + 1];
    const b = imagePixels[i + 2];
    const a = imagePixels[i + 3];
    rgb[outIndex++] = r;
    rgb[outIndex++] = g;
    rgb[outIndex++] = b;
    alpha[alphaIndex++] = a;
  }

  return {
    rgb,
    alpha
  };
}
