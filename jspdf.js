/** @preserve jsPDF ( ${buildDate} ${commitID} )
Copyright (c) 2010 James Hall, https://github.com/MrRio/jsPDF
Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
MIT license.
*/
/**
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

var jsPDF = (function() {
'use strict'

// this will run on <=IE9, possibly some niche browsers
// new webkit-based, FireFox, IE10 already have native version of this.
if (typeof btoa === 'undefined') {
	var btoa = function(data) {
		// DO NOT ADD UTF8 ENCODING CODE HERE!!!!

		// UTF8 encoding encodes bytes over char code 128
		// and, essentially, turns an 8-bit binary streams
		// (that base64 can deal with) into 7-bit binary streams. 
		// (by default server does not know that and does not recode the data back to 8bit)
		// You destroy your data.

		// binary streams like jpeg image data etc, while stored in JavaScript strings,
		// (which are 16bit arrays) are in 8bit format already.
		// You do NOT need to char-encode that before base64 encoding.

		// if you, by act of fate
		// have string which has individual characters with code
		// above 255 (pure unicode chars), encode that BEFORE you base64 here.
		// you can use absolutely any approch there, as long as in the end,
		// base64 gets an 8bit (char codes 0 - 255) stream.
		// when you get it on the server after un-base64, you must 
		// UNencode it too, to get back to 16, 32bit or whatever original bin stream.

		// Note, Yes, JavaScript strings are, in most cases UCS-2 - 
		// 16-bit character arrays. This does not mean, however,
		// that you always have to UTF8 it before base64.
		// it means that if you have actual characters anywhere in
		// that string that have char code above 255, you need to
		// recode *entire* string from 16-bit (or 32bit) to 8-bit array.
		// You can do binary split to UTF16 (BE or LE)
		// you can do utf8, you can split the thing by hand and prepend BOM to it,
		// but whatever you do, make sure you mirror the opposite on
		// the server. If server does not expect to post-process un-base64
		// 8-bit binary stream, think very very hard about messing around with encoding.

		// so, long story short:
		// DO NOT ADD UTF8 ENCODING CODE HERE!!!!
		
		/**
		====================================================================
		base64 encoder
		MIT, GPL
	
		version: 1109.2015
		discuss at: http://phpjs.org/functions/base64_encode
		+   original by: Tyler Akins (http://rumkin.com)
		+   improved by: Bayron Guevara
		+   improved by: Thunder.m
		+   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		+   bugfixed by: Pellentesque Malesuada
		+   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		+   improved by: Rafal Kukawski (http://kukawski.pl)
		+   			 Daniel Dotsenko, Willow Systems Corp, willow-systems.com
		====================================================================
		*/
		
		var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
		, b64a = b64.split('')
		, o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		enc = "",
		tmp_arr = [];
	 
		do { // pack three octets into four hexets
			o1 = data.charCodeAt(i++);
			o2 = data.charCodeAt(i++);
			o3 = data.charCodeAt(i++);
	 
			bits = o1 << 16 | o2 << 8 | o3;

			h1 = bits >> 18 & 0x3f;
			h2 = bits >> 12 & 0x3f;
			h3 = bits >> 6 & 0x3f;
			h4 = bits & 0x3f;
	 
			// use hexets to index into b64, and append result to encoded string
			tmp_arr[ac++] = b64a[h1] + b64a[h2] + b64a[h3] + b64a[h4];
		} while (i < data.length);

		enc = tmp_arr.join('');
		var r = data.length % 3;
		return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

		// end of base64 encoder MIT, GPL
	}
}

var PubSub = function(context){
	'use strict'
	/*  @preserve 
	-----------------------------------------------------------------------------------------------
	JavaScript PubSub library
	2012 (c) ddotsenko@willowsystems.com
	based on Peter Higgins (dante@dojotoolkit.org)
	Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.
	Original is (c) Dojo Foundation 2004-2010. Released under either AFL or new BSD, see:
	http://dojofoundation.org/license for more information.
	-----------------------------------------------------------------------------------------------
	*/
	this.topics = {}
	this.context = context
	/**
	 * Allows caller to emit an event and pass arguments to event listeners.
	 * @public
	 * @function
	 * @param topic {String} Name of the channel on which to voice this event
	 * @param **arguments Any number of arguments you want to pass to the listeners of this event.
	 */
	this.publish = function(topic, arg1, arg2, etc) {
		'use strict'
		if (this.topics[topic]) {
			var currentTopic = this.topics[topic]
			, args = Array.prototype.slice.call(arguments, 1)
			, toremove = []
			, fn
			, i, l
			, pair

			for (i = 0, l = currentTopic.length; i < l; i++) {
				pair = currentTopic[i] // this is a [function, once_flag] array
				fn = pair[0] 
				if (pair[1] /* 'run once' flag set */){
				  pair[0] = function(){}
				  toremove.push(i)
				}
			   	fn.apply(this.context, args)
			}
			for (i = 0, l = toremove.length; i < l; i++) {
			  currentTopic.splice(toremove[i], 1)
			}
		}
	}
	/**
	 * Allows listener code to subscribe to channel and be called when data is available 
	 * @public
	 * @function
	 * @param topic {String} Name of the channel on which to voice this event
	 * @param callback {Function} Executable (function pointer) that will be ran when event is voiced on this channel.
	 * @param once {Boolean} (optional. False by default) Flag indicating if the function is to be triggered only once.
	 * @returns {Object} A token object that cen be used for unsubscribing.  
	 */
	this.subscribe = function(topic, callback, once) {
		'use strict'
		if (!this.topics[topic]) {
			this.topics[topic] = [[callback, once]];
		} else {
			this.topics[topic].push([callback,once]);
		}
		return {
			"topic": topic,
			"callback": callback
		};
	};
	/**
	 * Allows listener code to unsubscribe from a channel 
	 * @public
	 * @function
	 * @param token {Object} A token object that was returned by `subscribe` method 
	 */
	this.unsubscribe = function(token) {
		if (this.topics[token.topic]) {
			var currentTopic = this.topics[token.topic]
			
			for (var i = 0, l = currentTopic.length; i < l; i++) {
				if (currentTopic[i][0] === token.callback) {
					currentTopic.splice(i, 1)
				}
			}
		}
	}
}

	
/**
 * Creates new jsPDF document object instance
 * @constructor jsPDF
 * @param orientation One of "portrait" or "landscape" (or shortcuts "p" (Default), "l")
 * @param unit Measurement unit to be used when coordinates are specified. One of "pt" (points), "mm" (Default), "cm", "in"
 * @param format One of 'a3', 'a4' (Default),'a5' ,'letter' ,'legal'
 * @returns {jsPDF}
 */
function jsPDF(/** String */ orientation, /** String */ unit, /** String */ format){


	// Default parameter values
	if (typeof orientation === 'undefined') orientation = 'p'
	else orientation = orientation.toString().toLowerCase()
	if (typeof unit === 'undefined') unit = 'mm'
	if (typeof format === 'undefined') format = 'a4'

	var format_as_string = format.toString().toLowerCase()
	, HELVETICA = "helvetica"
	, TIMES = "times"
	, COURIER = "courier"
	, NORMAL = "normal"
	, BOLD = "bold"
	, ITALIC = "italic"
	, BOLD_ITALIC = "bolditalic"

	, version = '20120619'
	, content = []
	, content_length = 0

	, pdfVersion = '1.3' // PDF Version
	, pageFormats = { // Size in pt of various paper formats
		'a3': [841.89, 1190.55]
		, 'a4': [595.28, 841.89]
		, 'a5': [420.94, 595.28]
		, 'letter': [612, 792]
		, 'legal': [612, 1008]
	}
	, textColor = '0 g'
	, drawColor = '0 G'
	, page = 0
	, objectNumber = 2 // 'n' Current object number
	, outToPages = false // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
	, pages = []
	, offsets = [] // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
	, fonts = [] // List of fonts
	, fontmap = {} // mapping structure - performance layer. See addFont()
	, fontName = HELVETICA // Default font
	, fontType = NORMAL // Default type
	, activeFontKey // will be string representing the KEY of the font as combination of fontName + fontType
	, lineWidth = 0.200025 // 2mm
	, pageHeight
	, pageWidth
	, k // Scale factor
	, documentProperties = {}
	, fontSize = 16 // Default font size
	, textColor = "0 g"
	, lineCapID = 0
	, lineJoinID = 0
	, API = {}
	, events = new PubSub(API)

	if (unit == 'pt') {
		k = 1
	} else if(unit == 'mm') {
		k = 72/25.4
	} else if(unit == 'cm') {
		k = 72/2.54
	} else if(unit == 'in') {
		k = 72
	} else {
		throw('Invalid unit: ' + unit)
	}
	
	// Dimensions are stored as user units and converted to points on output
	if (format_as_string in pageFormats) {
		pageHeight = pageFormats[format_as_string][1] / k
		pageWidth = pageFormats[format_as_string][0] / k
	} else {
		try {
			pageHeight = format[1]
			pageWidth = format[0]
		} 
		catch(err) {
			throw('Invalid format: ' + format)
		}
	}
	
	if (orientation === 'p' || orientation === 'portrait') {
		orientation = 'p'
	} else if (orientation === 'l' || orientation === 'landscape') {
		orientation = 'l'
		var tmp = pageWidth
		pageWidth = pageHeight
		pageHeight = tmp
	} else {
		throw('Invalid orientation: ' + orientation)
	}

	/////////////////////
	// Private functions
	/////////////////////
	// simplified (speedier) replacement for sprintf's %.2f conversion  
	var f2 = function(number){
		return number.toFixed(2)
	}
	// simplified (speedier) replacement for sprintf's %.3f conversion  
	, f3 = function(number){
		return number.toFixed(3)
	}
	// simplified (speedier) replacement for sprintf's %02d
	, padd2 = function(number) {
		var n = (number).toFixed(0)
		if ( number < 10 ) return '0' + n
		else return n
	}
	// simplified (speedier) replacement for sprintf's %02d
	, padd10 = function(number) {
		var n = (number).toFixed(0)
		if (n.length < 10) return new Array( 11 - n.length ).join( '0' ) + n
		else return n
	}
	, out = function(string) {
		if(outToPages /* set by beginPage */) {
			pages[page].push(string)
		} else {
			content.push(string)
			content_length += string.length + 1 // +1 is for '\n' that will be used to join contents of content 
		}
	}
	, newObject = function() {
		// Begin a new object
		objectNumber ++
		offsets[objectNumber] = content_length
		out(objectNumber + ' 0 obj');		
		return objectNumber
	}
	, putPages = function() {
		var wPt = pageWidth * k
		var hPt = pageHeight * k

		// outToPages = false as set in endDocument(). out() writes to content.
		
		var n, p
		for(n=1; n <= page; n++) {
			newObject()
			out('<</Type /Page')
			out('/Parent 1 0 R');	
			out('/Resources 2 0 R')
			out('/Contents ' + (objectNumber + 1) + ' 0 R>>')
			out('endobj')
			
			// Page content
			p = pages[n].join('\n')
			newObject()
			out('<</Length ' + p.length  + '>>')
			putStream(p)
			out('endobj')
		}
		offsets[1] = content_length
		out('1 0 obj')
		out('<</Type /Pages')
		var kids = '/Kids ['
		for (var i = 0; i < page; i++) {
			kids += (3 + 2 * i) + ' 0 R '
		}
		out(kids + ']')
		out('/Count ' + page)
		out('/MediaBox [0 0 '+f2(wPt)+' '+f2(hPt)+']')
		out('>>')
		out('endobj');		
	}
	, putStream = function(str) {
		out('stream')
		out(str)
		out('endstream')
	}
	, putResources = function() {
		putFonts()
		events.publish('putResources')
		// Resource dictionary
		offsets[2] = content_length
		out('2 0 obj')
		out('<<')
		putResourceDictionary()
		out('>>')
		out('endobj')
	}	
	, putFonts = function() {
		for (var i = 0, l=fonts.length; i < l; i++) {
			putFont(fonts[i])
		}
	}
	, putFont = function(font) {
		newObject()
		font.number = objectNumber
		out('<</BaseFont/' + font.name + '/Type/Font')
		out('/Subtype/Type1>>')
		out('endobj')
	}
	, addFont = function(name, fontName, fontType, undef) {
		var fontkey = 'F' + (fonts.length + 1).toString(10)
		
		fonts.push({'key': fontkey, 'number': objectNumber, 'name': name, 'fontName': fontName, 'type': fontType})
		// this is mapping structure for quick font lookup.
		// returns the KEY of the font within fonts array.
		if (fontmap[fontName] === undef){
			fontmap[fontName] = {} // fontType is a var interpreted and converted to appropriate string. don't wrap in quotes.
		}
		fontmap[fontName][fontType] = fontkey
	}
	, addFonts = function() {
		addFont('Helvetica', HELVETICA, NORMAL)
		addFont('Helvetica-Bold', HELVETICA, BOLD)
		addFont('Helvetica-Oblique', HELVETICA, ITALIC)
		addFont('Helvetica-BoldOblique', HELVETICA, BOLD_ITALIC)
		addFont('Courier', COURIER, NORMAL)
		addFont('Courier-Bold', COURIER, BOLD)
		addFont('Courier-Oblique', COURIER, ITALIC)
		addFont('Courier-BoldOblique', COURIER, BOLD_ITALIC)
		addFont('Times-Roman', TIMES, NORMAL)
		addFont('Times-Bold', TIMES, BOLD)
		addFont('Times-Italic', TIMES, ITALIC)
		addFont('Times-BoldItalic', TIMES, BOLD_ITALIC)
	}
	, putResourceDictionary = function() {
		out('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]')
		out('/Font <<')
		// Do this for each font, the '1' bit is the index of the font
		for (var i = 0; i < fonts.length; i++) {
			out('/' + fonts[i].key + ' ' + fonts[i].number + ' 0 R')
		}
		
		out('>>')
		out('/XObject <<')
		putXobjectDict()
		out('>>')
	}
	, putXobjectDict = function() {
		// Loop through images, or other data objects
		events.publish('putXobjectDict')
	}
	, putInfo = function() {
		out('/Producer (jsPDF ' + version + ')')
		if(documentProperties.title != undefined) {
			out('/Title (' + pdfEscape(documentProperties.title) + ')')
		}
		if(documentProperties.subject != undefined) {
			out('/Subject (' + pdfEscape(documentProperties.subject) + ')')
		}
		if(documentProperties.author != undefined) {
			out('/Author (' + pdfEscape(documentProperties.author) + ')')
		}
		if(documentProperties.keywords != undefined) {
			out('/Keywords (' + pdfEscape(documentProperties.keywords) + ')')
		}
		if(documentProperties.creator != undefined) {
			out('/Creator (' + pdfEscape(documentProperties.creator) + ')')
		}		
		var created = new Date()
		out('/CreationDate (D:' + 
			[
				created.getFullYear()
				, padd2(created.getMonth() + 1)
				, padd2(created.getDate())
				, padd2(created.getHours())
				, padd2(created.getMinutes())
				, padd2(created.getSeconds())
			].join('')+
			')'
		)
	}
	, putCatalog = function () {
		out('/Type /Catalog')
		out('/Pages 1 0 R')
		// @TODO: Add zoom and layout modes
		out('/OpenAction [3 0 R /FitH null]')
		out('/PageLayout /OneColumn')
	}	
	, putTrailer = function () {
		out('/Size ' + (objectNumber + 1))
		out('/Root ' + objectNumber + ' 0 R')
		out('/Info ' + (objectNumber - 1) + ' 0 R')
	}	
	, beginPage = function() {
		page ++
		// Do dimension stuff
		outToPages = true
		pages[page] = []
	}
	, _addPage = function() {
		beginPage()
		// Set line width
		out(f2(lineWidth * k) + ' w')
		// Set draw color
		out(drawColor)
		// resurrecting non-default line caps, joins
		if (lineCapID !== 0) out(lineCapID.toString(10)+' J')
		if (lineJoinID !== 0) out(lineJoinID.toString(10)+' j')
	}
	, getFont = function(fontName, fontType, undef) {
		var key
		try {
			key = fontmap[fontName][fontType] // returns a string like 'F3' - the KEY corresponding tot he font + type combination.
		} catch (e) {
			key = undef
		}
		if (!key){
			throw new Error("Unable to look up font label for font '"+fontName+"', '"+fontType+"'. Refer to getFontList() for available fonts.")
		}
		return key
	}
	, buildDocument = function() {
		
		outToPages = false // switches out() to content
		content = []
		offsets = []
		
		// putHeader()
		out('%PDF-' + pdfVersion)
		
		putPages()
		
		putResources()

		// Info
		newObject()
		out('<<')
		putInfo()
		out('>>')
		out('endobj')
		
		// Catalog
		newObject()
		out('<<')
		putCatalog()
		out('>>')
		out('endobj')
		
		// Cross-ref
		var o = content_length
		out('xref')
		out('0 ' + (objectNumber + 1))
		out('0000000000 65535 f ')
		for (var i=1; i <= objectNumber; i++) {
			out(padd10(offsets[i]) + ' 00000 n ')
		}
		// Trailer
		out('trailer')
		out('<<')
		putTrailer()
		out('>>')
		out('startxref')
		out(o)
		out('%%EOF')
		
		outToPages = true
		
		return content.join('\n')
	}
		// Replace '/', '(', and ')' with pdf-safe versions
	, pdfEscape = function(text) {
		return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
	}
	, getStyle = function(style){
		// see Path-Painting Operators of PDF spec
		var op = 'S'; // stroke
		if (style === 'F') {
			op = 'f'; // fill
		} else if (style === 'FD' || style === 'DF') {
			op = 'B'; // both
		}
		return op;
	}
	

	//---------------------------------------
	// Public API

	/**
	Object exposing internal API to plugins
	@public
	*/
	API.internal = {
		'pdfEscape': pdfEscape
		, 'getStyle': getStyle
		, 'getFont': getFont
		, 'btoa': btoa
		, 'write': function(string1, string2, string3, etc){
			out(
				arguments.length === 1? 
				arguments[0] : 
				Array.prototype.join.call(arguments, ' ')
			)
		}
		, 'getCoordinateString': function(value){
			return f2(value * k)
		}
		, 'getVerticalCoordinateString': function(value){
			return f2((pageHeight - value) * k)
		}
		, 'collections': {}
		, 'newObject': newObject
		, 'putStream': putStream
		, 'events': events
		, 'scaleFactor': k
		, 'pageSize': {'width':pageWidth, 'height':pageHeight}
	}
	
	/**
	 * Adds (and transfers the focus to) new page to the PDF document.
	 * @function
	 * @returns {jsPDF} 
	 * @name jsPDF.addPage
	 */
	API.addPage = function() {
		_addPage()
		return this
	}

	/**
	 * Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings. 
	 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
	 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
	 * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
	 * @function
	 * @returns {jsPDF}
	 * @name jsPDF.text
	 */
	API.text = function(x, y, text) {
		/**
		 * Inserts something like this into PDF
			BT 
			/F1 16 Tf  % Font name + size
			16 TL % How many units down for next line in multiline text
			0 g % color
			28.35 813.54 Td % position
			(line one) Tj 
			T* (line two) Tj
			T* (line three) Tj
			ET
	 	*/
		
		// If there are any newlines in text, we assume
		// the user wanted to print multiple lines, so break the
		// text up into an array.  If the text is already an array,
		// we assume the user knows what they are doing.
		if (typeof text === 'string' && text.match(/[\n\r]/)) {
			text = text.split(/\r\n|\r|\n/g)
		}

		var newtext, str

		if (typeof text === 'string') {
			str = pdfEscape(text)
		} else if (text instanceof Array) /* Array */{
			// we don't want to destroy  original text array, so cloning it
			newtext = text.concat()
			// we do array.join('text that must not be PDFescaped")
			// thus, pdfEscape each component separately
			for ( var i = newtext.length - 1; i !== -1 ; i--) {
				newtext[i] = pdfEscape( newtext[i] )
			}
			str = newtext.join( ") Tj\nT* (" )
		} else {
			throw new Error('Type of text must be string or Array. "'+text+'" is not recognized.')
		}
		// Using "'" ("go next line and render text" mark) would save space but would complicate our rendering code, templates 
		
		// BT .. ET does NOT have default settings for Tf. You must state that explicitely every time for BT .. ET
		// if you want text transformation matrix (+ multiline) to work reliably (which reads sizes of things from font declarations) 
		// Thus, there is NO useful, *reliable* concept of "default" font for a page. 
		// The fact that "default" (reuse font used before) font worked before in basic cases is an accident
		// - readers dealing smartly with brokenness of jsPDF's markup.
		out( 
			'BT\n/' +
			activeFontKey + ' ' + fontSize + ' Tf\n' + // font face, style, size
			fontSize + ' TL\n' + // line spacing
			textColor + 
			'\n' + f2(x * k) + ' ' + f2((pageHeight - y) * k) + ' Td\n(' + 
			str +
			') Tj\nET'
		)
		return this
	}

	API.line = function(x1, y1, x2, y2) {
		out(
			f2(x1 * k) + ' ' + f2((pageHeight - y1) * k) + ' m ' +
			f2(x2 * k) + ' ' + f2((pageHeight - y2) * k) + ' l S'			
		)
		return this
	}

	/**
	 * Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
	 * All data points in `lines` are relative to last line origin.
	 * `x`, `y` become x1,y1 for first line / curve in the set.
	 * For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
	 * For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.
	 * 
	 * @example .lines(212,110,[[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 10) // line, line, bezier curve, line 
	 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
	 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
	 * @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
	 * @param {Number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.   
	 * @function
	 * @returns {jsPDF}
	 * @name jsPDF.text
	 */
	API.lines = function(x, y, lines, scale, style) {
		var undef
		
		style = getStyle(style)
		scale = scale === undef ? [1,1] : scale

		// starting point
		out(f3(x * k) + ' ' + f3((pageHeight - y) * k) + ' m ')
		
		var scalex = scale[0]
		, scaley = scale[1]
		, i = 0
		, l = lines.length
		, leg
		, x2, y2 // bezier only. In page default measurement "units", *after* scaling
		, x3, y3 // bezier only. In page default measurement "units", *after* scaling
		// ending point for all, lines and bezier. . In page default measurement "units", *after* scaling
		, x4 = x // last / ending point = starting point for first item.
		, y4 = y // last / ending point = starting point for first item.
		
		for (; i < l; i++) {
			leg = lines[i]
			if (leg.length === 2){
				// simple line
				x4 = leg[0] * scalex + x4 // here last x4 was prior ending point
				y4 = leg[1] * scaley + y4 // here last y4 was prior ending point
				out(f3(x4 * k) + ' ' + f3((pageHeight - y4) * k) + ' l')					
			} else {
				// bezier curve
				x2 = leg[0] * scalex + x4 // here last x4 is prior ending point
				y2 = leg[1] * scaley + y4 // here last y4 is prior ending point					
				x3 = leg[2] * scalex + x4 // here last x4 is prior ending point
				y3 = leg[3] * scaley + y4 // here last y4 is prior ending point										
				x4 = leg[4] * scalex + x4 // here last x4 was prior ending point
				y4 = leg[5] * scaley + y4 // here last y4 was prior ending point
				out(
					f3(x2 * k) + ' ' + 
					f3((pageHeight - y2) * k) + ' ' +
					f3(x3 * k) + ' ' + 
					f3((pageHeight - y3) * k) + ' ' +
					f3(x4 * k) + ' ' + 
					f3((pageHeight - y4) * k) + ' c'
				)
			}
		}			
		// stroking / filling / both the path
		out(style) 
		return this
	}

	API.rect = function(x, y, w, h, style) {
		var op = getStyle(style)
		out([
			f2(x * k)
			, f2((pageHeight - y) * k)
			, f2(w * k)
			, f2(-h * k)
			, 're'
			, op
		].join(' '))
		return this
	}

	API.triangle = function(x1, y1, x2, y2, x3, y3, style) {
		this.lines(
			x1, x2 // start of path
			, [
				[ x2 - x1 , y2 - y1 ] // vector to point 2
				, [ x3 - x2 , y3 - y2 ] // vector to point 3
				, [ x1 - x3 , y1 - y3 ] // closing vector back to point 1
			]
			, [1,1]
			, style
		)
		return this;
	}

	API.ellipse = function(x, y, rx, ry, style) {
		var op = getStyle(style)
		, lx = 4/3*(Math.SQRT2-1)*rx
		, ly = 4/3*(Math.SQRT2-1)*ry
		
		out([
			f2((x+rx)*k)
			, f2((pageHeight-y)*k)
			, 'm'
			, f2((x+rx)*k)
			, f2((pageHeight-(y-ly))*k)
			, f2((x+lx)*k)
			, f2((pageHeight-(y-ry))*k)
			, f2(x*k)
			, f2((pageHeight-(y-ry))*k)
			, 'c'
		].join(' '))
		out([
			f2((x-lx)*k)
			, f2((pageHeight-(y-ry))*k)
			, f2((x-rx)*k)
			, f2((pageHeight-(y-ly))*k)
			, f2((x-rx)*k)
			, f2((pageHeight-y)*k)
			, 'c'
		].join(' '))
		out([
			f2((x-rx)*k)
			, f2((pageHeight-(y+ly))*k)
			, f2((x-lx)*k)
			, f2((pageHeight-(y+ry))*k)
			, f2(x*k)
			, f2((pageHeight-(y+ry))*k)
			, 'c'
		].join(' '))
		out([
			f2((x+lx)*k)
			, f2((pageHeight-(y+ry))*k)
			, f2((x+rx)*k)
			, f2((pageHeight-(y+ly))*k)
			, f2((x+rx)*k)
			, f2((pageHeight-y)*k) 
			,'c'
			, op
		].join(' '))
		return this
	}

	API.circle = function(x, y, r, style) {
		return this.ellipse(x, y, r, r, style)
	}

	API.setProperties = function(properties) {
		documentProperties = properties
		return this
	}

	API.addImage = function(imageData, format, x, y, w, h) {
		return this
	}

	API.setFontSize = function(size) {
		fontSize = size
		return this
	}

	API.setFont = function(name) {
		var _name = name.toLowerCase()
		activeFontKey = getFont(_name, fontType)
		// if font is not found, the above line blows up and we never go further
		fontName = _name
		return this
	}

	API.setFontType = function(type) {
		var _type = type.toLowerCase()
		activeFontKey = getFont(fontName, _type)
		// if font is not found, the above line blows up and we never go further
		fontType = _type
		return this
	}

	API.getFontList = function(){
		// TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
		return {
			HELVETICA:[NORMAL, BOLD, ITALIC, BOLD_ITALIC]
			, TIMES:[NORMAL, BOLD, ITALIC, BOLD_ITALIC]
			, COURIER:[NORMAL, BOLD, ITALIC, BOLD_ITALIC]
		}
	}

	API.setLineWidth = function(width) {
		out((width * k).toFixed(2) + ' w')
		return this
	}

	API.setDrawColor = function(r,g,b) {
		var color
		if ((r===0 && g===0 && b===0) || (typeof g === 'undefined')) {
			color = f3(r/255) + ' G'
		} else {
			color = [f3(r/255), f3(g/255), f3(b/255), 'RG'].join(' ')
		}
		out(color)
		return this
	}

	API.setFillColor = function(r,g,b) {
		var color
		if ((r===0 && g===0 && b===0) || (typeof g === 'undefined')) {
			color = f3(r/255) + ' g'
		} else {
			color = [f3(r/255), f3(g/255), f3(b/255), 'rg'].join(' ')
		}
		out(color)
		return this
	}

	API.setTextColor = function(r,g,b) {
		if ((r===0 && g===0 && b===0) || (typeof g === 'undefined')) {
			textColor = f3(r/255) + ' g'
		} else {
			textColor = [f3(r/255), f3(g/255), f3(b/255), 'rg'].join(' ')
		}
		return this
	}

	API.CapJoinStyles = {
		0:0, 'butt':0, 'but':0, 'bevel':0
		, 1:1, 'round': 1, 'rounded':1, 'circle':1
		, 2:2, 'projecting':2, 'project':2, 'square':2, 'milter':2
	}

	API.setLineCap = function(style, undef) {
		var id = this.CapJoinStyles[style]
		if (id === undef) {
			throw new Error("Line cap style of '"+style+"' is not recognized. See or extend .CapJoinStyles property for valid styles")
		}
		lineCapID = id
		out(id.toString(10) + ' J')
	}

	API.setLineJoin = function(style, undef) {
		var id = this.CapJoinStyles[style]
		if (id === undef) {
			throw new Error("Line join style of '"+style+"' is not recognized. See or extend .CapJoinStyles property for valid styles")
		}
		lineJoinID = id
		out(id.toString(10) + ' j')
	}

	API.output = function(type, options) {
		var undef
		switch (type){
			case undef: return buildDocument() 
			case 'datauristring':
			case 'dataurlstring':
				return 'data:application/pdf;base64,' + btoa(buildDocument())
			case 'datauri':
			case 'dataurl':
				document.location.href = 'data:application/pdf;base64,' + btoa(buildDocument()); break;
			default: throw new Error('Output type "'+type+'" is not supported.') 
		}
		// @TODO: Add different output options
	}

	/////////////////////////////////////////
	// continuing initilisation of jsPDF Document object
	/////////////////////////////////////////

	// Add the first page automatically
	addFonts()
	activeFontKey = getFont(fontName, fontType)
	_addPage();	
	
	// applying plugins (more methods) ON TOP of built-in API.
	// this is intentional as we allow plugins to override 
	// built-ins
	if (jsPDF.API) {
		var extraapi = jsPDF.API, plugin
		for (plugin in extraapi){
			if (extraapi.hasOwnProperty(plugin)){
				API[plugin] = extraapi[plugin]
			}
		}
	}

	return API
}

/**
jsPDF.API is an object you can add methods and properties to.
The methods / properties you add will show up in new jsPDF objects.

@static
@public
@memberOf jsPDF
@name API

@example
	jsPDF.API.mymethod = function(){
		// 'this' will be ref to internal API object. see jsPDF source
		// , so you can refer to built-in methods like so: 
		//	 this.line(....)
		//	 this.text(....)
	}
	var pdfdoc = new jsPDF()
	pdfdoc.mymethod() // <- !!!!!!
	
*/
jsPDF.API = {}

return jsPDF
})()
