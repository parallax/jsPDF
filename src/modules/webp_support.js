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
    var reader = new WebPDecoder(imageData, false);
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
