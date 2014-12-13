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

	jsPDFAPI.events.push([
			'initialized', function() {
				this.canvas.pdf = this;
			}
	]);

	jsPDFAPI.canvas = {
		getContext : function(name) {
			return this.pdf.context2d;
		},
		style : {}
	}

	Object.defineProperty(jsPDFAPI.canvas, 'width', {
		get : function() {
			return this._width;
		},
		set : function(value) {
			this._width = value;
			this.getContext('2d').pageWrapX = value + 1;
		}
	});

	Object.defineProperty(jsPDFAPI.canvas, 'height', {
		get : function() {
			return this._height;
		},
		set : function(value) {
			this._height = value;
			this.getContext('2d').pageWrapY = value + 1;
		}
	});

	return this;
})(jsPDF.API);
