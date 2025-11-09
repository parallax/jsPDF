import { JPEGEncoder } from "../libs/JPEGEncoder.js";
import { BmpDecoder } from "../libs/BMPDecoder.js";
import { jsPDF } from "../jspdf.js";

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
(function(jsPDFAPI) {
  "use strict";

  jsPDFAPI.processBMP = function(imageData, index, alias, compression) {
    let reader = new BmpDecoder(imageData, false);
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
