/**
 * jsPDF addHTML PlugIn
 * Copyright (c) 2014 Diego Casorran
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function (jsPDFAPI) {
	'use strict';

	/**
	 * Renders an HTML element to canvas object which added as an image to the PDF
	 *
	 * This PlugIn requires html2canvas: https://github.com/niklasvh/html2canvas
	 *
	 * @public
	 * @function
	 * @param element {Mixed} HTML Element, or anything supported by html2canvas.
	 * @param x {Number} starting X coordinate in jsPDF instance's declared units.
	 * @param y {Number} starting Y coordinate in jsPDF instance's declared units.
	 * @param options {Object} Additional options, check the code below.
	 * @param callback {Function} to call when the rendering has finished.
	 *
	 * NOTE: Every parameter is optional except 'element' and 'callback', in such
	 *       case the image is positioned at 0x0 covering the whole PDF document
	 *       size. Ie, to easily take screenshoots of webpages saving them to PDF.
	 */
	jsPDFAPI.addHTML = function (element, x, y, options, callback) {
		'use strict';

		if(typeof html2canvas === 'undefined')
			throw new Error('You need this: https://github.com/niklasvh/html2canvas');

		if(typeof x !== 'number') {
			options = x;
			callback = y;
		}

		if(typeof options === 'function') {
			callback = options;
			options = null;
		}

		options = options || {};
		options.onrendered = function(canvas) {
			x = parseInt(x) || 0;
			y = parseInt(y) || 0;
			var dim = options.dim || {};
			var h = dim.h || 0;
			var w = dim.w || Math.min(this.internal.pageSize.width,canvas.width/this.internal.scaleFactor) - x;

			var format = 'JPEG';
			if(options.format)
				format = options.format;

			var alias = Math.random().toString(35);
			var args = [canvas, x,y,w,h, format,alias,'SLOW'];

			this.addImage.apply(this, args);

			callback(w,h,alias,args);
		}.bind(this);

		return html2canvas(element, options);
	};
})(jsPDF.API);
