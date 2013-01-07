/** ==================================================================== 
 * jsPDF [NAME] plugin
 * Copyright (c) 2013 [YOUR NAME HERE] [WAY TO CONTACT YOU HERE]
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

(function(jsPDFAPI) {
'use strict'

jsPDFAPI.myFunction = function(args) {
	'use strict'
	// `this` is _jsPDF object returned when jsPDF is inited (new jsPDF())
	// `this.internal` is a collection of useful, specific-to-raw-PDF-stream functions.
	// for example, `this.internal.write` function allowing you to write directly to PDF stream.
	// `this.line`, `this.text` etc are available directly.
	// so if your plugin just wraps complex series of this.line or this.text or other public API calls,
	// you don't need to look into `this.internal`
	// See _jsPDF object in jspdf.js for complete list of what's available to you.


	// it is good practice to return ref to jsPDF instance to make 
	// the calls chainable. 
	return this 
}

})(jsPDF.API)
