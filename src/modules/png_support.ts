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
import { decode as decodePng } from "../libs/fast-png.js";
import type { jsPDFDocument } from "../types.js";
import type { ImageCompression, ImageProperties } from "./addimage.js";

/** The decoded PNG object produced by fast-png's decode(). */
type DecodedPng = ReturnType<typeof decodePng>;

/** A pixel-data array as produced by fast-png / consumed by the filters. */
type PngLine = Uint8Array | Uint8ClampedArray | Uint16Array;

type PngFilterMethod = (
  line: PngLine,
  colorsPerPixel: number,
  prevLine?: PngLine
) => number[];

/** Intermediate result of the three process*PNG() helpers below. */
interface ProcessedPNGResult {
  colorSpace: string;
  colorsPerPixel: number;
  sMaskBitsPerComponent?: number;
  colorBytes: PngLine;
  alphaBytes?: Uint8Array;
  needSMask: boolean;
  palette?: number[];
  mask?: number[];
}

declare module "../types.js" {
  interface jsPDFAPI {
    processPNG(
      imageData?: unknown,
      index?: number,
      alias?: number | string,
      compression?: ImageCompression
    ): ImageProperties | undefined;
  }
}

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
 * @name processPNG
 * Entry point: process a PNG and return image dict and metadata for jsPDF
 */
jsPDF.API.processPNG = function (
  this: jsPDFDocument,
  imageData?: unknown,
  index?: number,
  alias?: number | string,
  compression?: ImageCompression
) {
  if (this.__addimage__.isArrayBuffer(imageData)) {
    imageData = new Uint8Array(imageData);
  }
  if (!this.__addimage__.isArrayBufferView(imageData)) {
    return;
  }

  const decodedPng = decodePng(imageData, { checkCrc: true });
  const {
    width,
    height,
    channels,
    palette: decodedPalette,
    depth: bitsPerComponent
  } = decodedPng;

  let result: ProcessedPNGResult;
  if (decodedPalette && channels === 1) {
    result = processIndexedPNG(decodedPng);
  } else if (channels === 2 || channels === 4) {
    result = processAlphaPNG(decodedPng);
  } else {
    result = processOpaquePNG(decodedPng);
  }

  const {
    colorSpace,
    colorsPerPixel,
    sMaskBitsPerComponent,
    colorBytes,
    alphaBytes,
    needSMask,
    palette,
    mask
  } = result;

  let predictor: number | null = null;

  let filter: string | undefined,
    decodeParameters: string | undefined,
    sMask: string | Uint8Array | undefined;
  if (canCompress(compression)) {
    predictor = getPredictorFromCompression(compression);
    filter = this.decode.FLATE_DECODE;
    decodeParameters = `/Predictor ${predictor} /Colors ${colorsPerPixel} /BitsPerComponent ${bitsPerComponent} /Columns ${width}`;

    const rowByteLength = Math.ceil(
      (width * colorsPerPixel * bitsPerComponent) / 8
    );

    imageData = compressBytes(
      colorBytes,
      rowByteLength,
      colorsPerPixel,
      bitsPerComponent,
      compression
    );
    if (needSMask) {
      // The process*PNG helpers set sMaskBitsPerComponent and alphaBytes
      // whenever they report needSMask.
      const sMaskRowByteLength = Math.ceil(
        (width * sMaskBitsPerComponent!) / 8
      );
      sMask = compressBytes(
        alphaBytes!,
        sMaskRowByteLength,
        1,
        sMaskBitsPerComponent!,
        compression
      );
    }
  } else {
    filter = undefined;
    decodeParameters = undefined;
    imageData = colorBytes;
    if (needSMask) sMask = alphaBytes;
  }

  if (
    this.__addimage__.isArrayBuffer(imageData) ||
    this.__addimage__.isArrayBufferView(imageData)
  ) {
    imageData = this.__addimage__.arrayBufferToBinaryString(imageData);
  }

  if (
    (sMask && this.__addimage__.isArrayBuffer(sMask)) ||
    this.__addimage__.isArrayBufferView(sMask)
  ) {
    sMask = this.__addimage__.arrayBufferToBinaryString(sMask);
  }

  return {
    alias,
    // The conversion block above guarantees a binary string at this point.
    data: imageData as string,
    index,
    filter,
    decodeParameters,
    transparency: mask,
    palette,
    sMask,
    predictor,
    width,
    height,
    bitsPerComponent,
    sMaskBitsPerComponent,
    colorSpace
  };
};

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

function canCompress(value?: ImageCompression): boolean {
  return value !== jsPDF.API.image_compression.NONE && hasCompressionJS();
}

function hasCompressionJS() {
  return typeof zlibSync === "function";
}
function compressBytes(
  bytes: PngLine,
  lineByteLength: number,
  channels: number,
  bitsPerComponent: number,
  compression?: ImageCompression
): string {
  let level: 1 | 4 | 6 | 9 = 4;
  let filter_method: PngFilterMethod = filterUp;

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

function applyPngFilterMethod(
  bytes: PngLine,
  lineByteLength: number,
  bytesPerPixel: number,
  filter_method?: PngFilterMethod
): Uint8Array {
  const lines = bytes.length / lineByteLength;
  const result = new Uint8Array(bytes.length + lines);
  const filter_methods = getFilterMethods();
  let prevLine: PngLine | undefined;

  for (let i = 0; i < lines; i += 1) {
    const offset = i * lineByteLength;
    const line = bytes.subarray(offset, offset + lineByteLength);

    if (filter_method) {
      result.set(filter_method(line, bytesPerPixel, prevLine), offset + i);
    } else {
      const len = filter_methods.length;
      const results: number[][] = [];

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

function filterNone(line: PngLine): number[] {
  /*const result = new Uint8Array(line.length + 1);
    result[0] = 0;
    result.set(line, 1);*/

  // Array.apply spreads the (array-like) line into a plain array of samples;
  // its loose lib typing loses the element type, hence the assertion.
  const result = Array.apply([], line as unknown as number[]) as number[];
  result.unshift(0);

  return result;
}

function filterSub(line: PngLine, colorsPerPixel: number): number[] {
  const len = line.length;
  const result: number[] = [];

  result[0] = 1;

  for (let i = 0; i < len; i += 1) {
    const left = line[i - colorsPerPixel] || 0;
    result[i + 1] = (line[i] - left + 0x0100) & 0xff;
  }

  return result;
}

function filterUp(
  line: PngLine,
  colorsPerPixel: number,
  prevLine?: PngLine
): number[] {
  const len = line.length;
  const result: number[] = [];

  result[0] = 2;

  for (let i = 0; i < len; i += 1) {
    const up = (prevLine && prevLine[i]) || 0;
    result[i + 1] = (line[i] - up + 0x0100) & 0xff;
  }

  return result;
}

function filterAverage(
  line: PngLine,
  colorsPerPixel: number,
  prevLine?: PngLine
): number[] {
  const len = line.length;
  const result: number[] = [];

  result[0] = 3;

  for (let i = 0; i < len; i += 1) {
    const left = line[i - colorsPerPixel] || 0;
    const up = (prevLine && prevLine[i]) || 0;
    result[i + 1] = (line[i] + 0x0100 - ((left + up) >>> 1)) & 0xff;
  }

  return result;
}

function filterPaeth(
  line: PngLine,
  colorsPerPixel: number,
  prevLine?: PngLine
): number[] {
  const len = line.length;
  const result: number[] = [];

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

function paethPredictor(left: number, up: number, upLeft: number): number {
  if (left === up && up === upLeft) {
    return left;
  }
  const pLeft = Math.abs(up - upLeft),
    pUp = Math.abs(left - upLeft),
    pUpLeft = Math.abs(left + up - upLeft - upLeft);
  return pLeft <= pUp && pLeft <= pUpLeft ? left : pUp <= pUpLeft ? up : upLeft;
}

function getFilterMethods() {
  return [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
}

function getIndexOfSmallestSum(arrays: number[][]): number {
  const sum = arrays.map(function (value) {
    return value.reduce(function (pv, cv) {
      return pv + Math.abs(cv);
    }, 0);
  });
  return sum.indexOf(Math.min.apply(null, sum));
}

function getPredictorFromCompression(compression?: ImageCompression): number {
  let predictor: number;
  switch (compression) {
    case jsPDF.API.image_compression.FAST:
      predictor = 11;
      break;

    case jsPDF.API.image_compression.MEDIUM:
      predictor = 13;
      break;

    case jsPDF.API.image_compression.SLOW:
      predictor = 14;
      break;

    default:
      predictor = 12;
      break;
  }
  return predictor;
}

// Extracted helper for Indexed PNGs (palette-based)
function processIndexedPNG(decodedPng: DecodedPng): ProcessedPNGResult {
  const { width, height, data, palette: decodedPalette, depth } = decodedPng;
  let needSMask = false;
  let palette: number[] = [];
  let mask: number[] | undefined = [];
  let alphaBytes: Uint8Array | undefined = undefined;
  let hasSemiTransparency = false;

  const maxMaskLength = 1;
  let maskLength = 0;

  // processIndexedPNG is only invoked when the decoded PNG has a palette.
  for (let i = 0; i < decodedPalette!.length; i++) {
    const [r, g, b, a] = decodedPalette![i];
    palette.push(r, g, b);
    if (a != null) {
      if (a === 0) {
        maskLength++;
        if (mask.length < maxMaskLength) {
          mask.push(i);
        }
      } else if (a < 255) {
        hasSemiTransparency = true;
      }
    }
  }

  if (hasSemiTransparency || maskLength > maxMaskLength) {
    needSMask = true;
    mask = undefined;

    const totalPixels = width * height;
    // per PNG spec, palettes always use 8 bits per component
    alphaBytes = new Uint8Array(totalPixels);
    const dataView = new DataView(data.buffer);
    for (let p = 0; p < totalPixels; p++) {
      const paletteIndex = readSample(dataView, p, depth);
      const [, , , alpha] = decodedPalette![paletteIndex];
      alphaBytes[p] = alpha;
    }
  } else if (maskLength === 0) {
    mask = undefined;
  }

  return {
    colorSpace: "Indexed",
    colorsPerPixel: 1,
    sMaskBitsPerComponent: needSMask ? 8 : undefined,
    colorBytes: data,
    alphaBytes,
    needSMask,
    palette,
    mask
  };
}

/*
 * Splits color and alpha values into separate buffers
 */
function processAlphaPNG(decodedPng: DecodedPng): ProcessedPNGResult {
  const { data, width, height, channels, depth } = decodedPng;

  const colorSpace = channels === 2 ? "DeviceGray" : "DeviceRGB";
  const colorsPerPixel = channels - 1;

  const totalPixels = width * height;
  const colorChannels = colorsPerPixel; // 1 for Gray, 3 for RGB
  const alphaChannels = 1;
  const totalColorSamples = totalPixels * colorChannels;
  const totalAlphaSamples = totalPixels * alphaChannels;

  const colorByteLen = Math.ceil((totalColorSamples * depth) / 8);
  const alphaByteLen = Math.ceil((totalAlphaSamples * depth) / 8);
  const colorBytes = new Uint8Array(colorByteLen);
  const alphaBytes = new Uint8Array(alphaByteLen);

  const dataView = new DataView(data.buffer);
  const colorView = new DataView(colorBytes.buffer);
  const alphaView = new DataView(alphaBytes.buffer);

  let needSMask = false;
  for (let p = 0; p < totalPixels; p++) {
    const pixelStartIndex = p * channels;
    for (let s = 0; s < colorChannels; s++) {
      const sampleIndex = pixelStartIndex + s;
      const colorValue = readSample(dataView, sampleIndex, depth);
      writeSample(colorView, colorValue, p * colorChannels + s, depth);
    }
    const sampleIndex = pixelStartIndex + colorChannels;
    const alphaValue = readSample(dataView, sampleIndex, depth);
    if (alphaValue < (1 << depth) - 1) {
      needSMask = true;
    }
    writeSample(alphaView, alphaValue, p * alphaChannels, depth);
  }

  return {
    colorSpace,
    colorsPerPixel,
    sMaskBitsPerComponent: needSMask ? depth : undefined,
    colorBytes,
    alphaBytes,
    needSMask
  };
}

function processOpaquePNG(decodedPng: DecodedPng): ProcessedPNGResult {
  const { data, channels } = decodedPng;
  const colorSpace = channels === 1 ? "DeviceGray" : "DeviceRGB";
  const colorsPerPixel = colorSpace === "DeviceGray" ? 1 : 3;

  let colorBytes: PngLine;
  if (data instanceof Uint16Array) {
    colorBytes = convertUint16ArrayToUint8Array(data);
  } else {
    colorBytes = data;
  }

  return { colorSpace, colorsPerPixel, colorBytes, needSMask: false };
}

function convertUint16ArrayToUint8Array(data: Uint16Array): Uint8Array {
  // PNG/PDF expect MSB-first byte order. Since EcmaScript does not specify
  // the byte order of Uint16Array, we need to use a DataView to ensure the
  // correct byte order.
  const sampleCount = data.length;
  const out = new Uint8Array(sampleCount * 2);
  const outView = new DataView(out.buffer, out.byteOffset, out.byteLength);

  for (let i = 0; i < sampleCount; i++) {
    outView.setUint16(i * 2, data[i], false);
  }
  return out;
}

function readSample(
  view: DataView,
  sampleIndex: number,
  depth: number
): number {
  const bitIndex = sampleIndex * depth;
  const byteIndex = Math.floor(bitIndex / 8);
  const bitOffset = 16 - (bitIndex - byteIndex * 8 + depth);
  const bitMask = (1 << depth) - 1;
  const word = safeGetUint16(view, byteIndex);
  return (word >> bitOffset) & bitMask;
}

function writeSample(
  view: DataView,
  value: number,
  sampleIndex: number,
  depth: number
): void {
  const bitIndex = sampleIndex * depth;
  const byteIndex = Math.floor(bitIndex / 8);
  const bitOffset = 16 - (bitIndex - byteIndex * 8 + depth);
  const bitMask = (1 << depth) - 1;
  const writeValue = (value & bitMask) << bitOffset;
  const word =
    safeGetUint16(view, byteIndex) & ~(bitMask << bitOffset) & 0xffff;
  safeSetUint16(view, byteIndex, word | writeValue);
}

function safeGetUint16(view: DataView, byteIndex: number): number {
  if (byteIndex + 1 < view.byteLength) {
    return view.getUint16(byteIndex, false);
  }
  const b0 = view.getUint8(byteIndex);
  return b0 << 8;
}

function safeSetUint16(view: DataView, byteIndex: number, value: number): void {
  if (byteIndex + 1 < view.byteLength) {
    view.setUint16(byteIndex, value, false);
    return;
  }
  const byteToWrite = (value >> 8) & 0xff;
  view.setUint8(byteIndex, byteToWrite);
}
