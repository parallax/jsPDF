/** ====================================================================
 * jsPDF IE Below 9 Shim plugin 0.1.0
 * Known to be compatible with jsPDF 0.9.0
 *
 * Copyright (c) 2013 James Hall, james@snapshotmedia.co.uk
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

;(function(API) {
'use strict'

var name = 'jsPDF IE Below 9 Shim plugin';
// Shim in IE6-9 support
API.output = function(type, options) {

	// If not IE then return early
	return this.internal.output(type, options);

	var filename = 'Output.pdf';
	switch (type) {
		case 'datauristring':
		case 'dataurlstring':
		case 'datauri':
		case 'dataurl':
		case 'dataurlnewwindow':
			console.log(name + ': Data URIs are not supported on IE6-9.');
			break;
		case 'save':
			filename = options;
			break;
	}

	// @TODO: IE shim 


};



})(jsPDF.API)
