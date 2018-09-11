/**
 * @license
 * Copyright (c) 2017 Aras Abbasi 
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
* jsPDF gif Support PlugIn
*
* @name gif_support
* @module
*/
(function (jsPDFAPI) {
	'use strict';

	jsPDFAPI.processGIF89A = function (imageData, imageIndex, alias, compression, dataAsBinaryString) {
		var reader = new GifReader(imageData);
		var width = reader.width, height = reader.height;
		var qu = 100;
		var pixels = [];
		
		reader.decodeAndBlitFrameRGBA(0, pixels);
		var frameData = new Uint8Array(width * height * 4);
		var rawImageData = {
		  data: pixels,
		  width: width,
		  height: height
		};

		var encoder = new JPEGEncoder(qu);
		var data = encoder.encode(rawImageData, qu);
		return jsPDFAPI.processJPEG.call(this, data, imageIndex, alias, compression);
	};

	jsPDFAPI.processGIF87A = jsPDFAPI.processGIF89A;
})(jsPDF.API);
