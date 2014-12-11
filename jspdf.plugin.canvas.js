/**
 * jsPDF Canvas PlugIn
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * This plugin mimicks the HTML5 Canvas
 * 
 * The goal is to provide a way for current canvas users to print directly to a PDF.
 */

(function(jsPDFAPI) {
	'use strict';
	var pdf2 = this;
	jsPDFAPI.canvas = {
		pdf : pdf2,
		getContext : function(name) {
			return pdf.context2d;
		},
		style : {}
	}

	Object.defineProperty(jsPDFAPI.canvas, 'width', {
		get : function() {
			return this._width;
		},
		set : function(value) {
			this._width = value;
		}
	});

	Object.defineProperty(jsPDFAPI.canvas, 'height', {
		get : function() {
			return this._height;
		},
		set : function(value) {
			this._height = value;
		}
	});

	return this;
})(jsPDF.API);
