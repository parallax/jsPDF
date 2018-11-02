/**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * jsPDF Canvas PlugIn
 * This plugin mimics the HTML5 Canvas
 * 
 * The goal is to provide a way for current canvas users to print directly to a PDF.
 * @name canvas
 * @module
 */
(function(jsPDFAPI) {
	'use strict';

	jsPDFAPI.events.push([
			'initialized', function() {
				this.canvas.pdf = this;
			}
	]);

	/**
	* @name canvas
	* @static
	* @type {Object}
	*/
	jsPDFAPI.canvas = {
		/**
		* @name getContext
		* @function
		* @param {string} the context type
		*/
		getContext : function(name) {
			this.pdf.context2d._canvas = this;
			return this.pdf.context2d;
		},
		childNodes : [],
		style : {},
		autoContext2dResizeX: true,
		autoContext2dResizeY: true
	}

	/**
	* Width of the canvas
	*
	* @name width
	* @property {number} width
	*/
	Object.defineProperty(jsPDFAPI.canvas, 'width', {
		get : function() {
			return this._width;
		},
		set : function(value) {
			this._width = value;
			if (this.autoContext2dResizeX) {
				this.getContext('2d').pageWrapX = value + 1;
			}
		}
	});

	/**
	* Height of the canvas
	*
	* @name height
	* @property {number} height
	*/
	Object.defineProperty(jsPDFAPI.canvas, 'height', {
		get : function() {
			return this._height;
		},
		set : function(value) {
			this._height = value;
			if (this.autoContext2dResizeY) {
				this.getContext('2d').pageWrapY = value + 1;
			}
		}
	});

	return this;
})(jsPDF.API);
