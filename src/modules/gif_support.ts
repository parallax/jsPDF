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

/**
 * jsPDF Gif Support PlugIn
 *
 * @name gif_support
 * @module
 */
(function(jsPDFAPI) {
  "use strict";

  jsPDFAPI.processGIF89A = function(imageData, index, alias, compression) {
    let reader = new GifReader(imageData);
    let width = reader.width,
      height = reader.height;
    let qu = 100;
    let pixels = [];

    reader.decodeAndBlitFrameRGBA(0, pixels);
    let rawImageData = {
      data: pixels,
      width: width,
      height: height
    };

    let encoder = new JPEGEncoder(qu);
    let data = encoder.encode(rawImageData, qu);
    return jsPDFAPI.processJPEG.call(this, data, index, alias, compression);
  };

  jsPDFAPI.processGIF87A = jsPDFAPI.processGIF89A;
})(jsPDF.API);
