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
