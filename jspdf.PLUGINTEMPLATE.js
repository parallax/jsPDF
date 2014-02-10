/**
 * jsPDF [NAME] plugin
 * Copyright (c) 2014 [YOUR NAME HERE] [WAY TO CONTACT YOU HERE]
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function (jsPDFAPI) {
	'use strict';

	jsPDFAPI.myFunction = function (args) {
		'use strict';
		// `this` is _jsPDF object returned when jsPDF is inited (new jsPDF())
		// `this.internal` is a collection of useful, specific-to-raw-PDF-stream functions.
		// for example, `this.internal.write` function allowing you to write directly to PDF stream.
		// `this.line`, `this.text` etc are available directly.
		// so if your plugin just wraps complex series of this.line or this.text or other public API calls,
		// you don't need to look into `this.internal`
		// See _jsPDF object in jspdf.js for complete list of what's available to you.


		// it is good practice to return ref to jsPDF instance to make
		// the calls chainable.
		return this;
	};
})(jsPDF.API);
