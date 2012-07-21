/** @preserve
jsPDF fromHTML plugin. BETA stage. API subject to change. Needs browser, jQuery
Copyright (c) 2012 2012 Willow Systems Corporation, willow-systems.com
*/
/*
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

;(function(jsPDFAPI) {
'use strict'


if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}
if(!String.prototype.trimLeft) {
  String.prototype.trimLeft = function () {
    return this.replace(/^\s+/g,'');
  };
}
if(!String.prototype.trimRight) {
  String.prototype.trimRight = function () {
    return this.replace(/\s+$/g,'');
  };
}

function PurgeWhiteSpace(array){
	var i = 0, l = array.length, fragment
	, lTrimmed = false
	, rTrimmed = false

	while (!lTrimmed && i !== l) {
		fragment = array[i] = array[i].trimLeft()
		if (fragment) {
			// there is something left there.
			lTrimmed = true
		}
		;i++;
	}

	i = l - 1
	while (l && !rTrimmed && i !== -1) {
		fragment = array[i] = array[i].trimRight()
		if (fragment) {
			// there is something left there.
			rTrimmed = true
		}
		;i--;
	}

	var r = /\s+$/g
	, trailingSpace = true // it's safe to assume we always trim start of display:block element's text.

	for (i = 0; i !== l; i++) {
		fragment = array[i].replace(/\s+/g, ' ')
		// if (l > 1) {
		// 	console.log(i, trailingSpace, fragment)
		// }
		if (trailingSpace) {
			fragment = fragment.trimLeft()
		}
		if (fragment) {
			// meaning, it was not reduced to ""
			// if it was, we don't want to clear trailingSpace flag.
			trailingSpace = r.test(fragment)
		}
		array[i] = fragment
	}

	return array
}

function Renderer(pdf, x, y, settings) {
	this.pdf = pdf
	this.x = x
	this.y = y
	this.settings = settings

	this.init()

	return this
}

Renderer.prototype.init = function(){

	this.paragraph = {
		'text': []
		, 'style': []
	}

	this.pdf.internal.write(
		'q'
	)
}

Renderer.prototype.dispose = function(){
	this.pdf.internal.write(
		'Q' // closes the 'q' in init()
	)
	return {
		'x':this.x, 'y':this.y // bottom left of last line. = upper left of what comes after us.
		// TODO: we cannot traverse pages yet, but need to figure out how to communicate that when we do.
		// TODO: add more stats: number of lines, paragraphs etc.
	}
}

Renderer.prototype.splitFragmentsIntoLines = function(fragments, styles){
	var defaultFontSize = 12 // points
	, k = this.pdf.internal.scaleFactor // when multiplied by this, converts jsPDF instance units into 'points'

	// var widths = options.widths ? options.widths : this.internal.getFont().metadata.Unicode.widths
	// , kerning = options.kerning ? options.kerning : this.internal.getFont().metadata.Unicode.kerning
	, fontMetricsCache = {}
	, ff, fs
	, fontMetrics

	, fragment // string, element of `fragments`
	, style // object with properties with names similar to CSS. Holds pertinent style info for given fragment
	, fragmentSpecificMetrics // fontMetrics + some indent and sizing properties populated. We reuse it, hence the bother.
	, fragmentLength // fragment's length in jsPDF units
	, fragmentChopped // will be array - fragment split into "lines"

	, line = [] // array of pairs of arrays [t,s], where t is text string, and s is style object for that t.
	, lines = [line] // array of arrays of pairs of arrays
	, currentLineLength = 0 // in jsPDF instance units (inches, cm etc)
	, maxLineLength = this.settings.width // need to decide if this is the best way to know width of content.

	// this loop sorts text fragments (and associated style)
	// into lines. Some fragments will be chopped into smaller
	// fragments to be spread over multiple lines.
	while (fragments.length) {

		fragment = fragments.shift()
		style = styles.shift()

		// if not empty string
		if (fragment) {

			ff = style['font-family']
			fs = style['font-style']

			fontMetrics = fontMetricsCache[ff+fs]
			if (!fontMetrics) {
				fontMetrics = this.pdf.internal.getFont(ff, fs).metadata.Unicode
				fontMetricsCache[ff+fs] = fontMetrics
			}

			fragmentSpecificMetrics = {
				'widths': fontMetrics.widths
				, 'kerning': fontMetrics.kerning

				// fontSize comes to us from CSS scraper as "proportion of normal" value
				// , hence the multiplication
				, 'fontSize': style['font-size'] * defaultFontSize

				// // these should not matter as we provide the metrics manually
				// // if we would not, we would need these:
				// , 'fontName': style.fontName 
				// , 'fontStyle': style.fontStyle

				// this is setting for "indent first line of paragraph", but we abuse it
				// for continuing inline spans of text. Indent value = space in jsPDF instance units
				// (whatever user passed to 'new jsPDF(orientation, units, size)
				// already consumed on this line. May be zero, of course, for "start of line"
				// it's used only on chopper, ignored in all "sizing" code
				, 'textIndent': currentLineLength
			}

			// in user units (inch, cm etc.)
			fragmentLength = this.pdf.getStringUnitWidth(
				fragment
				, fragmentSpecificMetrics
			) * fragmentSpecificMetrics.fontSize / k

			if (currentLineLength + fragmentLength > maxLineLength) {
				// whatever is already on the line + this new fragment
				// will be longer than max len for a line. 
				// Hence, chopping fragment into lines:
				fragmentChopped = this.pdf.splitTextToSize(
					fragment
					, maxLineLength
					, fragmentSpecificMetrics
				)

				line.push([fragmentChopped.shift(), style])
				while (fragmentChopped.length){
					line = [[fragmentChopped.shift(), style]]
					lines.push(line)
				}

				currentLineLength = this.pdf.getStringUnitWidth(
					// new line's first (and only) fragment's length is our new line length
					line[0][0]
					, fragmentSpecificMetrics
				) * fragmentSpecificMetrics.fontSize / k
			} else {
				// nice, we can fit this fragment on current line. Less work for us...
				line.push([fragment, style])
				currentLineLength += fragmentLength
			}
		}
	}

	return lines
}

Renderer.prototype.RenderTextFragment = function(text, style) {

	var defaultFontSize = 12
	// , header = "/F1 16 Tf\n16 TL\n0 g"
	, font = this.pdf.internal.getFont(style['font-family'], style['font-style'])

	this.pdf.internal.write(
		'/' + font.id // font key
		, (defaultFontSize * style['font-size']).toFixed(2) // font size comes as float = proportion to normal.
		, 'Tf' // font def marker
		, '('+text+') Tj'
	)
}

Renderer.prototype.renderParagraph = function(){

	var fragments = PurgeWhiteSpace( this.paragraph.text )
	, styles = this.paragraph.style
	this.paragraph = {'text':[], 'style':[]}

	if (!fragments.join('').trim()) {
		/* if it's empty string */
		return
	} // else there is something to draw

	var lines = this.splitFragmentsIntoLines(fragments, styles)
	, line // will be array of array pairs [[t,s],[t,s],[t,s]...] where t = text, s = style object

	, maxLineHeight
	, defaultFontSize = 12
	, i, l

	, out = this.pdf.internal.write

	out(
		'q' // canning the scope
		, 'BT' // Begin Text
		// and this moves the text start to desired position.
		, this.pdf.internal.getCoordinateString(this.x)
		, this.pdf.internal.getVerticalCoordinateString(this.y)
		, 'Td'
	)

	// looping through lines
	while (lines.length) {
		line = lines.shift()

		maxLineHeight = 0

		for (i = 0, l = line.length; i !== l; i++) {
			if (line[i][0].trim()) {
				maxLineHeight = Math.max(maxLineHeight, line[i][1]['line-height'], line[i][1]['font-size'])
			}
		}

		// current coordinates are "top left" corner of text box. Text must start from "lower left"
		// so, lowering the current coord one line height.
		out(
			0
			, (-1 * defaultFontSize * maxLineHeight).toFixed(2) // shifting down a line in native `points' means reducing y coordinate
			, 'Td'
			// , (defaultFontSize * maxLineHeight).toFixed(2) // line height comes as float = proportion to normal.
			// , 'TL' // line height marker. Not sure we need it with "Td", but... 
		)

		for (i = 0, l = line.length; i !== l; i++) {
			if (line[i][0]) {
				this.RenderTextFragment(line[i][0], line[i][1])
			}
		}

		// y is in user units (cm, inch etc)
		// maxLineHeight is ratio of defaultFontSize
		// defaultFontSize is in points always.
		// this.internal.scaleFactor is ratio of user unit to points. Dividing by it converts points to user units.
		// verticalOffset will be in user units.
		this.y += maxLineHeight * defaultFontSize / this.pdf.internal.scaleFactor
	}

	out(
		'ET' // End Text
		, 'Q' // restore scope
	)
}

Renderer.prototype.setBlockBoundary = function(){
	this.renderParagraph()
}

Renderer.prototype.addText = function(text, css){
	this.paragraph.text.push(text)
	this.paragraph.style.push(css)
}


//=====================
// these are DrillForContent and friends

var FontNameDB = {
	'helvetica':'helvetica'
	, 'sans-serif':'helvetica'
	, 'serif':'times'
	, 'times':'times'
	, 'times new roman':'times'
	, 'monospace':'courier'
	, 'courier':'courier'
}
, FontWeightMap = {"100":'normal',"200":'normal',"300":'normal',"400":'normal',"500":'bold',"600":'bold',"700":'bold',"800":'bold',"900":'bold',"normal":'normal',"bold":'bold',"bolder":'bold',"lighter":'normal'}
, FontStyleMap = {'normal':'normal','italic':'italic','oblique':'italic'}
, UnitedNumberMap = {'normal':1}

function ResolveFont(css_font_family_string){
	var name
	, parts = css_font_family_string.split(',') // yes, we don't care about , inside quotes
	, part = parts.shift()

	while (!name && part){
		name = FontNameDB[ part.trim().toLowerCase() ]
		part = parts.shift()
	}
	return name 
}

// return ratio to "normal" font size. in other words, it's fraction of 16 pixels.
function ResolveUnitedNumber(css_line_height_string){
	var undef
	, value = UnitedNumberMap[css_line_height_string]
	if (value) {
		return value
	}

	// not in cache, ok. need to parse it.
	// is it int?
	value = parseFloat(css_line_height_string)
	if (value) {
		// caching, returning
		return UnitedNumberMap[css_line_height_string] = value / 16.00
	}

	// must be a "united" value ('123em', '134px' etc.)
	// most browsers convert it to px so, only handling the px
	value = css_line_height_string.match( /([\d\.]+)(px)/ )
	if (value.length === 3) {
		// caching, returning
		return UnitedNumberMap[css_line_height_string] = parseFloat( value[1] ) / 16.00
	}

	return UnitedNumberMap[css_line_height_string] = 1
}

function GetCSS(element){
	var $e = $(element)
	, css = {}
	, tmp

	css['font-family'] = ResolveFont( $e.css('font-family') ) || 'times'
	css['font-style'] = FontStyleMap [ $e.css('font-style') ] || 'normal'
	tmp = FontWeightMap[ $e.css('font-weight') ] || 'normal'
	if (tmp === 'bold') {
		if (css['font-style'] === 'normal') {
			css['font-style'] = tmp
		} else {
			css['font-style'] = tmp + css['font-style'] // jsPDF's default fonts have it as "bolditalic"
		}
	}

	css['font-size'] = ResolveUnitedNumber( $e.css('font-size') ) || 1 // ratio to "normal" size
	css['line-height'] = ResolveUnitedNumber( $e.css('line-height') ) || 1 // ratio to "normal" size

	css['display'] = $e.css('display') === 'inline' ? 'inline' : 'block'

	return css
}

function elementHandledElsewhere(element, renderer, elementHandlers){
	var isHandledElsewhere = false

	var i, l, t
	, handlers = elementHandlers['#'+element.id]
	if (handlers) {
		if (typeof handlers === 'function') {
			isHandledElsewhere = handlers(element, renderer)
		} else /* array */ {
			i = 0
			l = handlers.length
			while (!isHandledElsewhere && i !== l){
				isHandledElsewhere = handlers[i](element, renderer)
				;i++;
			}
		}
	}

	handlers = elementHandlers[element.nodeName]
	if (!isHandledElsewhere && handlers) {
		if (typeof handlers === 'function') {
			isHandledElsewhere = handlers(element, renderer)
		} else /* array */ {
			i = 0
			l = handlers.length
			while (!isHandledElsewhere && i !== l){
				isHandledElsewhere = handlers[i](element, renderer)
				;i++;
			}
		}
	}

	return isHandledElsewhere
}

function DrillForContent(element, renderer, elementHandlers){
	var cns = element.childNodes
	, cn
	, css = GetCSS(element)
	, isBlock = css.display === 'block'

	if (isBlock) {
		renderer.setBlockBoundary()			
	}

	for (var i = 0, l = cns.length; i < l ; i++){
		cn = cns[i]
		if (typeof cn === 'object') {
			if (cn.nodeType === 1) {
				if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
					DrillForContent(cn, renderer, elementHandlers)
				}
			} else if (cn.nodeType === 3){
				renderer.addText( cn.nodeValue, css )
			}
		} else if (typeof cn === 'string') {
			renderer.addText( cn, css )
		}
	}

	if (isBlock) {
		renderer.setBlockBoundary()
	}
}

function process(pdf, element, x, y, settings) {

	// we operate on DOM elems. So HTML-formatted strings need to pushed into one
	if (typeof element === 'string') {
		element = (function(element) {
			var framename = "jsPDFhtmlText" + Date.now().toString() + (Math.random() * 1000).toFixed(0)
			, visuallyhidden = 'position: absolute !important;' +
				'clip: rect(1px 1px 1px 1px); /* IE6, IE7 */' +
				'clip: rect(1px, 1px, 1px, 1px);' +
				'padding:0 !important;' +
				'border:0 !important;' +
				'height: 1px !important;' + 
				'width: 1px !important; ' +
				'top:auto;' +
				'left:-100px;' +
				'overflow: hidden;'
			// TODO: clean up hidden div
			, $hiddendiv = $(
				'<div style="'+visuallyhidden+'">' +
				'<iframe style="height:1px;width:1px" name="'+framename+'" />' +
				'</div>'
			).appendTo(document.body)
			, $frame = window.frames[framename]
			return $($frame.document.body).html(element)[0]
		})( element )
	}

	var r = new Renderer( pdf, x, y, settings )
	, a = DrillForContent( element, r, settings.elementHandlers )

	return r.dispose()

}


/**
Converts HTML-formatted text into formatted PDF text.

Notes:
2012-07-18
	Plugin relies on having browser, DOM around. The HTML is pushed into dom and traversed.
	Plugin relies on jQuery for CSS extraction.
	Targeting HTML output from Markdown templating, which is a very simple
	markup - div, span, em, strong, p. No br-based paragraph separation supported explicitly (but still may work.)
	Images, tables are NOT supported.

@public
@function
@param HTML {String or DOM Element} HTML-formatted text, or pointer to DOM element that is to be rendered into PDF.
@param x {Number} starting X coordinate in jsPDF instance's declared units.
@param y {Number} starting Y coordinate in jsPDF instance's declared units.
@param settings {Object} Additional / optional variables controlling parsing, rendering.
@returns {Object} jsPDF instance
*/
jsPDFAPI.fromHTML = function(HTML, x, y, settings) {
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
	// return this

	// but in this case it is more usefull to return some stats about what we rendered. 
	return process(this, HTML, x, y, settings)
}

})(jsPDF.API)
