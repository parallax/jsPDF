// @ts-nocheck
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

/**
 * jsPDF webp Support PlugIn
 *
 * @name webp_support
 * @module
 */
(function(jsPDFAPI) {
  "use strict";

  jsPDFAPI.processWEBP = function(imageData, index, alias, compression) {
    let reader = new WebPDecoder(imageData, false);
    let width = reader.width,
      height = reader.height;
    let qu = 100;
    let pixels = reader.getData();

    let rawImageData = {
      data: pixels,
      width: width,
      height: height
    };

    let encoder = new JPEGEncoder(qu);
    let data = encoder.encode(rawImageData, qu);
    return jsPDFAPI.processJPEG.call(this, data, index, alias, compression);
  };
})(jsPDF.API);
