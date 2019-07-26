/* global jsPDF, GifReader, JPEGEncoder */
/**
 * @license
 * Copyright (c) 2017 Aras Abbasi 
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
* jsPDF Gif Support PlugIn
*
* @name gif_support
* @module
*/
(function (jsPDFAPI) {
  'use strict';

  jsPDFAPI.processGIF89A = function (imageData, index, alias, compression) {
    var reader = new GifReader(imageData);
    var width = reader.width, height = reader.height;
    var qu = 100;
    var pixels = [];

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
