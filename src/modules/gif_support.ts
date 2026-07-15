/**
 * @license
 * Copyright (c) 2017 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";
import { GifReader } from "../libs/omggif.js";
import { JPEGEncoder } from "../libs/JPEGEncoder.js";
import type { jsPDFAPI as JsPDFAPI, jsPDFDocument } from "../types.js";
import type { ImageCompression, ImageProperties } from "./addimage.js";

declare module "../types.js" {
  interface jsPDFAPI {
    processGIF89A(
      imageData?: unknown,
      index?: number,
      alias?: number | string,
      compression?: ImageCompression
    ): ImageProperties;
    processGIF87A(
      imageData?: unknown,
      index?: number,
      alias?: number | string,
      compression?: ImageCompression
    ): ImageProperties;
  }
}

/**
 * jsPDF Gif Support PlugIn
 *
 * @name gif_support
 * @module
 */
(function (jsPDFAPI: JsPDFAPI) {
  "use strict";

  jsPDFAPI.processGIF89A = function (
    this: jsPDFDocument,
    imageData: Uint8Array,
    index?: number,
    alias?: number | string,
    compression?: ImageCompression
  ) {
    var reader = new GifReader(imageData);
    var width = reader.width,
      height = reader.height;
    var qu = 100;
    var pixels: number[] = [];

    reader.decodeAndBlitFrameRGBA(0, pixels);
    var rawImageData = {
      data: pixels,
      width: width,
      height: height
    };

    var encoder = new JPEGEncoder(qu);
    var data = encoder.encode(rawImageData, qu);
    return jsPDFAPI.processJPEG.call(this, data, index, alias, compression);
  };

  jsPDFAPI.processGIF87A = jsPDFAPI.processGIF89A;
})(jsPDF.API);
