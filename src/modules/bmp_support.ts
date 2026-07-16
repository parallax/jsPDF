import { JPEGEncoder } from "../libs/JPEGEncoder.js";
import { BmpDecoder } from "../libs/BMPDecoder.js";
import { jsPDF } from "../jspdf.js";
import type { jsPDFAPI as JsPDFAPI, jsPDFDocument } from "../types.js";
import type { ImageCompression, ImageProperties } from "./addimage.js";

declare module "../types.js" {
  interface jsPDFAPI {
    processBMP(
      imageData?: unknown,
      index?: number,
      alias?: number | string,
      compression?: ImageCompression
    ): ImageProperties | null;
  }
}

/**
 * @license
 * Copyright (c) 2018 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * jsPDF bmp Support PlugIn
 * @name bmp_support
 * @module
 */
(function (jsPDFAPI: JsPDFAPI) {
  "use strict";

  jsPDFAPI.processBMP = function (
    this: jsPDFDocument,
    imageData: Uint8Array,
    index?: number,
    alias?: number | string,
    compression?: ImageCompression
  ) {
    var reader = new BmpDecoder(imageData, false);
    var width = reader.width,
      height = reader.height;
    var qu = 100;
    var pixels = reader.getData();

    var rawImageData = {
      data: pixels,
      width: width,
      height: height
    };

    var encoder = new JPEGEncoder(qu);
    var data = encoder.encode(rawImageData, qu);
    return jsPDFAPI.processJPEG.call(this, data, index, alias, compression);
  };
})(jsPDF.API);
