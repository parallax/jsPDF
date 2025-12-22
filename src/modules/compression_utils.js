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

import { jsPDF } from "../jspdf.js";
import { zlibSync } from "../libs/fflate.js";

/**
 * Checks if compression is enabled and available
 * @param {string} value - Compression mode (NONE, FAST, MEDIUM, SLOW)
 * @returns {boolean} True if compression is enabled and zlibSync is available
 */
export function canCompress(value) {
  return value !== jsPDF.API.image_compression.NONE && hasCompressionJS();
}

/**
 * Checks if zlib compression is available
 * @returns {boolean} True if zlibSync function is available
 */
export function hasCompressionJS() {
  return typeof zlibSync === "function";
}

/**
 * Compresses image bytes using zlib and PNG filter predictors
 * @param {Uint8Array} bytes - Image data to compress
 * @param {number} lineByteLength - Length of each row in bytes
 * @param {number} channels - Number of color channels (1 for grayscale, 3 for RGB)
 * @param {number} bitsPerComponent - Bits per color component (typically 8)
 * @param {string} compression - Compression mode (FAST, MEDIUM, SLOW)
 * @returns {string} Compressed data as binary string
 */
export function compressBytes(
  bytes,
  lineByteLength,
  channels,
  bitsPerComponent,
  compression
) {
  let level = 4;
  let filter_method = filterUp;

  switch (compression) {
    case jsPDF.API.image_compression.FAST:
      level = 1;
      filter_method = filterSub;
      break;

    case jsPDF.API.image_compression.MEDIUM:
      level = 6;
      filter_method = filterAverage;
      break;

    case jsPDF.API.image_compression.SLOW:
      level = 9;
      filter_method = filterPaeth;
      break;
  }

  const bytesPerPixel = Math.ceil((channels * bitsPerComponent) / 8);
  bytes = applyPngFilterMethod(
    bytes,
    lineByteLength,
    bytesPerPixel,
    filter_method
  );
  const dat = zlibSync(bytes, { level: level });
  return jsPDF.API.__addimage__.arrayBufferToBinaryString(dat);
}

/**
 * Applies PNG filter method to image data
 * PNG filters reduce redundancy before compression by exploiting spatial correlation
 * @param {Uint8Array} bytes - Image data
 * @param {number} lineByteLength - Length of each row in bytes
 * @param {number} bytesPerPixel - Bytes per pixel
 * @param {Function} filter_method - Filter function to apply (or null for optimal selection)
 * @returns {Uint8Array} Filtered data with filter type bytes prepended to each row
 */
export function applyPngFilterMethod(
  bytes,
  lineByteLength,
  bytesPerPixel,
  filter_method
) {
  const lines = bytes.length / lineByteLength;
  const result = new Uint8Array(bytes.length + lines);
  const filter_methods = getFilterMethods();
  let prevLine;

  for (let i = 0; i < lines; i += 1) {
    const offset = i * lineByteLength;
    const line = bytes.subarray(offset, offset + lineByteLength);

    if (filter_method) {
      result.set(filter_method(line, bytesPerPixel, prevLine), offset + i);
    } else {
      const len = filter_methods.length;
      const results = [];

      for (let j = 0; j < len; j += 1) {
        results[j] = filter_methods[j](line, bytesPerPixel, prevLine);
      }

      const ind = getIndexOfSmallestSum(results.concat());

      result.set(results[ind], offset + i);
    }

    prevLine = line;
  }

  return result;
}

/**
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
 *   0       None
 *   1       Sub
 *   2       Up
 *   3       Average
 *   4       Paeth
 */

/**
 * PNG filter None - no filtering
 * @param {Uint8Array} line - Row data
 * @returns {Array} Filtered row with filter type byte (0) prepended
 */
export function filterNone(line) {
  const result = Array.apply([], line);
  result.unshift(0);
  return result;
}

/**
 * PNG filter Sub - differences from left pixel
 * @param {Uint8Array} line - Row data
 * @param {number} colorsPerPixel - Bytes per pixel
 * @returns {Array} Filtered row with filter type byte (1) prepended
 */
export function filterSub(line, colorsPerPixel) {
  const len = line.length;
  const result = [];

  result[0] = 1;

  for (let i = 0; i < len; i += 1) {
    const left = line[i - colorsPerPixel] || 0;
    result[i + 1] = (line[i] - left + 0x0100) & 0xff;
  }

  return result;
}

/**
 * PNG filter Up - differences from pixel above
 * @param {Uint8Array} line - Row data
 * @param {number} colorsPerPixel - Bytes per pixel
 * @param {Uint8Array} prevLine - Previous row data
 * @returns {Array} Filtered row with filter type byte (2) prepended
 */
export function filterUp(line, colorsPerPixel, prevLine) {
  const len = line.length;
  const result = [];

  result[0] = 2;

  for (let i = 0; i < len; i += 1) {
    const up = (prevLine && prevLine[i]) || 0;
    result[i + 1] = (line[i] - up + 0x0100) & 0xff;
  }

  return result;
}

/**
 * PNG filter Average - average of left and up pixels
 * @param {Uint8Array} line - Row data
 * @param {number} colorsPerPixel - Bytes per pixel
 * @param {Uint8Array} prevLine - Previous row data
 * @returns {Array} Filtered row with filter type byte (3) prepended
 */
export function filterAverage(line, colorsPerPixel, prevLine) {
  const len = line.length;
  const result = [];

  result[0] = 3;

  for (let i = 0; i < len; i += 1) {
    const left = line[i - colorsPerPixel] || 0;
    const up = (prevLine && prevLine[i]) || 0;
    result[i + 1] = (line[i] + 0x0100 - ((left + up) >>> 1)) & 0xff;
  }

  return result;
}

/**
 * PNG filter Paeth - Paeth predictor (complex)
 * @param {Uint8Array} line - Row data
 * @param {number} colorsPerPixel - Bytes per pixel
 * @param {Uint8Array} prevLine - Previous row data
 * @returns {Array} Filtered row with filter type byte (4) prepended
 */
export function filterPaeth(line, colorsPerPixel, prevLine) {
  const len = line.length;
  const result = [];

  result[0] = 4;

  for (let i = 0; i < len; i += 1) {
    const left = line[i - colorsPerPixel] || 0;
    const up = (prevLine && prevLine[i]) || 0;
    const upLeft = (prevLine && prevLine[i - colorsPerPixel]) || 0;
    const paeth = paethPredictor(left, up, upLeft);
    result[i + 1] = (line[i] - paeth + 0x0100) & 0xff;
  }

  return result;
}

/**
 * Paeth predictor algorithm
 * @param {number} left - Left pixel value
 * @param {number} up - Up pixel value
 * @param {number} upLeft - Upper-left pixel value
 * @returns {number} Predicted value
 */
export function paethPredictor(left, up, upLeft) {
  if (left === up && up === upLeft) {
    return left;
  }
  const pLeft = Math.abs(up - upLeft),
    pUp = Math.abs(left - upLeft),
    pUpLeft = Math.abs(left + up - upLeft - upLeft);
  return pLeft <= pUp && pLeft <= pUpLeft ? left : pUp <= pUpLeft ? up : upLeft;
}

/**
 * Returns array of all available filter methods
 * @returns {Array<Function>} Array of filter functions
 */
export function getFilterMethods() {
  return [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
}

/**
 * Finds the index of the array with the smallest sum of absolute values
 * Used to select the optimal filter method
 * @param {Array<Array>} arrays - Arrays to compare
 * @returns {number} Index of array with smallest sum
 */
export function getIndexOfSmallestSum(arrays) {
  const sum = arrays.map(function(value) {
    return value.reduce(function(pv, cv) {
      return pv + Math.abs(cv);
    }, 0);
  });
  return sum.indexOf(Math.min.apply(null, sum));
}

/**
 * Maps compression mode to PDF predictor value
 * Predictor values correspond to PNG filter types (10=None, 11=Sub, 12=Up, 13=Average, 14=Paeth)
 * @param {string} compression - Compression mode (FAST, MEDIUM, SLOW)
 * @returns {number} PDF predictor value (11, 12, 13, or 14)
 */
export function getPredictorFromCompression(compression) {
  let predictor;
  switch (compression) {
    case jsPDF.API.image_compression.FAST:
      predictor = 11; // Sub filter
      break;

    case jsPDF.API.image_compression.MEDIUM:
      predictor = 13; // Average filter
      break;

    case jsPDF.API.image_compression.SLOW:
      predictor = 14; // Paeth filter
      break;

    default:
      predictor = 12; // Up filter (default)
      break;
  }
  return predictor;
}
