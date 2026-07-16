/**
 * @license
 * Copyright (c) 2019 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";
import { JPEGEncoder } from "../libs/JPEGEncoder.js";
import { WebPDecoder } from "../libs/WebPDecoder.js";
import type { jsPDFAPI as JsPDFAPI, jsPDFDocument } from "../types.js";
import type { ImageCompression, ImageProperties } from "./addimage.js";

declare module "../types.js" {
  interface jsPDFAPI {
    processWEBP(
      imageData?: unknown,
      index?: number,
      alias?: number | string,
      compression?: ImageCompression
    ): ImageProperties | null;
  }
}

/**
 * Boundary interface for the vendored WebP decoder
 * (src/libs/WebPDecoder.ts, checked with @ts-nocheck); declares only the
 * members this plugin consumes.
 */
interface WebPDecoderInstance {
  width: number;
  height: number;
  getData(): ArrayLike<number>;
}

interface WebPDecoderConstructor {
  new (imageData: Uint8Array, hasAlpha: boolean): WebPDecoderInstance;
}

/**
 * jsPDF webp Support PlugIn
 *
 * @name webp_support
 * @module
 */
(function (jsPDFAPI: JsPDFAPI) {
  "use strict";

  jsPDFAPI.processWEBP = function (
    this: jsPDFDocument,
    imageData: Uint8Array,
    index?: number,
    alias?: number | string,
    compression?: ImageCompression
  ) {
    // The vendored decoder is an untyped constructor function; go through
    // the local boundary interface instead of `any`.
    var reader = new (WebPDecoder as unknown as WebPDecoderConstructor)(
      imageData,
      false
    );
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
