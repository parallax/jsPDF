/** ==================================================================== 
 * jsPDF Silly SVG plugin
 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
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

/**
Parses SVG XML and converts only some of the SVG elements into
PDF elements.

Support:
 paths

We expect jQuery to be available as window.jQuery

@public
@function
@param
@returns {Type}
*/
jsPDF.API.addSVG = (function($) {
'use strict'
return function(svgtext, x, y, w, h, transformationMatrix) {
	// 'this' is _jsPDF object returned when jsPDF is inited (new jsPDF())

    function InjectCSS(cssbody, document) {
        var styletag = document.createElement('style')
        styletag.type = 'text/css'
        if (styletag.styleSheet) {
        	// ie
            styletag.styleSheet.cssText = cssbody
        } else {
        	// others
            styletag.appendChild(document.createTextNode(cssbody))
        }
        document.getElementsByTagName("head")[0].appendChild(styletag)
    }

	function fillSVGIntoIframe(svgtext, document){

		var frameID = 'childframe' // Date.now().toString() + '_' + (Math.random() * 100).toString()
		, frame = document.createElement('iframe')

		InjectCSS(
			'.jsPDF_sillysvg_iframe {display:none;position:absolute;}'
			, document
		)

		frame.name = frameID
		frame.setAttribute("width", 0)
		frame.setAttribute("height", 0)
		frame.setAttribute("frameborder", "0")
		frame.setAttribute("scrolling", "no")
		frame.setAttribute("seamless", "seamless")
		frame.setAttribute("class", "jsPDF_sillysvg_iframe")
		
		document.body.appendChild(frame)

		var framedoc = ( frame.contentWindow || frame.contentDocument ).document

		framedoc.write(svgtext)
		framedoc.close()
		
		return framedoc.getElementsByTagName('svg')[0]
	}

	function convertPathToPDFLinesArgs(path, transformationMatrix){
		// we will use 'lines' method call. it needs:
		// - starting coordinate pair
		// - array of arrays of vector shifts (2-len for line, 6 len for bezier)
		// - scale array [horizontal, vertical] ratios
		// - style (stroke, fill, both)

		var start = [ parseFloat(path[1]), parseFloat(path[2]) ] // 'm', 'x#', 'y#'
		, vectors = []
		, position = 3
		, len = path.length

		while (position < len){
			if (path[position] === 'c'){
				vectors.push([
					parseFloat(path[position + 1])
					, parseFloat(path[position + 2])
					, parseFloat(path[position + 3])
					, parseFloat(path[position + 4])
					, parseFloat(path[position + 5])
					, parseFloat(path[position + 6])
				])
				position += 7
			} else if (path[position] === 'l') {
				vectors.push([
					parseFloat(path[position + 1])
					, parseFloat(path[position + 2])
				])
				position += 3
			} else {
				position += 1
			}
		}
		return [start[0], start[1], vectors]
	}

	var svg = fillSVGIntoIframe(svgtext, document)

	var i, l, tmp, items = svg.childNodes
	for (i = 0, l = items.length; i < l; i++) {
		tmp = items[i]
		if (tmp.tagName && tmp.tagName.toUpperCase() === 'PATH') {
			tmp = convertPathToPDFLinesArgs( tmp.getAttribute("d").split(' ') )
			this.lines.apply(this, tmp)
		}
	}

	return this
}
}).call( this , window.jQuery)
