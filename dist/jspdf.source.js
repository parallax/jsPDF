/** @preserve jsPDF ( 2013-01-07T00:31 commit ID e07f98f849424b231a0fd3f90bdfb1977ce12f9b )
Copyright (c) 2010-2012 James Hall, https://github.com/MrRio/jsPDF
Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
MIT license.
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


/**
Creates new jsPDF document object instance
@class
@param orientation One of "portrait" or "landscape" (or shortcuts "p" (Default), "l")
@param unit Measurement unit to be used when coordinates are specified. One of "pt" (points), "mm" (Default), "cm", "in"
@param format One of 'a3', 'a4' (Default),'a5' ,'letter' ,'legal'
@returns {jsPDF}
@name jsPDF
*/
var jsPDF = (function() {
'use strict'

// this will run on <=IE9, possibly some niche browsers
// new webkit-based, FireFox, IE10 already have native version of this.
if (typeof btoa === 'undefined') {
	window.btoa = function(data) {
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
		
		/* @preserve
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
	};
}

if (typeof atob === 'undefined') {
	window.atob = function (data) {
		// http://kevin.vanzonneveld.net
		// +   original by: Tyler Akins (http://rumkin.com)
		// +   improved by: Thunder.m
		// +      input by: Aman Gupta
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   bugfixed by: Onno Marsman
		// +   bugfixed by: Pellentesque Malesuada
		// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +      input by: Brett Zamir (http://brett-zamir.me)
		// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
		// *     returns 1: 'Kevin van Zonneveld'
		// mozilla has this native
		// - but breaks in 2.0.0.12!
		//if (typeof this.window['atob'] == 'function') {
		//    return atob(data);
		//}
		var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		dec = "",
		tmp_arr = [];

		if (!data) {
		return data;
		}

		data += '';

		do { // unpack four hexets into three octets using index points in b64
			h1 = b64.indexOf(data.charAt(i++));
			h2 = b64.indexOf(data.charAt(i++));
			h3 = b64.indexOf(data.charAt(i++));
			h4 = b64.indexOf(data.charAt(i++));

			bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

			o1 = bits >> 16 & 0xff;
			o2 = bits >> 8 & 0xff;
			o3 = bits & 0xff;

			if (h3 == 64) {
				tmp_arr[ac++] = String.fromCharCode(o1);
			} else if (h4 == 64) {
				tmp_arr[ac++] = String.fromCharCode(o1, o2);
			} else {
				tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
			}
		} while (i < data.length);

		dec = tmp_arr.join('');

		return dec;
	};
}

var getObjectLength = typeof Object.keys === 'function' ?
	function(object){
		return Object.keys(object).length
	} :
	function(object){
		var i = 0
		for (var e in object){if(object.hasOwnProperty(e)){ i++ }}
		return i
	}

/**
PubSub implementation

@class
@name PubSub
*/
var PubSub = function(context){
	'use strict'
	/**  @preserve 
	-----------------------------------------------------------------------------------------------
	JavaScript PubSub library
	2012 (c) ddotsenko@willowsystems.com
	based on Peter Higgins (dante@dojotoolkit.org)
	Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.
	Original is (c) Dojo Foundation 2004-2010. Released under either AFL or new BSD, see:
	http://dojofoundation.org/license for more information.
	-----------------------------------------------------------------------------------------------
	*/
	/**
	@private
	@fieldOf PubSub
	*/
	this.topics = {}
	/**
	Stores what will be `this` within the callback functions.

	@private
	@fieldOf PubSub#
	*/
	this.context = context
	/**
	Allows caller to emit an event and pass arguments to event listeners.
	@public
	@function
	@param topic {String} Name of the channel on which to voice this event
	@param **args Any number of arguments you want to pass to the listeners of this event.
	@methodOf PubSub#
	@name publish
	*/
	this.publish = function(topic, args) {
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
	Allows listener code to subscribe to channel and be called when data is available 
	@public
	@function
	@param topic {String} Name of the channel on which to voice this event
	@param callback {Function} Executable (function pointer) that will be ran when event is voiced on this channel.
	@param once {Boolean} (optional. False by default) Flag indicating if the function is to be triggered only once.
	@returns {Object} A token object that cen be used for unsubscribing.  
	@methodOf PubSub#
	@name subscribe
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
	Allows listener code to unsubscribe from a channel 
	@public
	@function
	@param token {Object} A token object that was returned by `subscribe` method 
	@methodOf PubSub#
	@name unsubscribe
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
@constructor
@private
*/
function jsPDF(/** String */ orientation, /** String */ unit, /** String */ format){

	// Default parameter values
	if (typeof orientation === 'undefined') orientation = 'p'
	else orientation = orientation.toString().toLowerCase()
	if (typeof unit === 'undefined') unit = 'mm'
	if (typeof format === 'undefined') format = 'a4'

	var format_as_string = format.toString().toLowerCase()
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
	, pages = []
	, objectNumber = 2 // 'n' Current object number
	, outToPages = false // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
	, offsets = [] // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
	, fonts = {} // collection of font objects, where key is fontKey - a dynamically created label for a given font.
	, fontmap = {} // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
	, activeFontSize = 16
	, activeFontKey // will be string representing the KEY of the font as combination of fontName + fontStyle
	, lineWidth = 0.200025 // 2mm
	, pageHeight
	, pageWidth
	, k // Scale factor
	, documentProperties = {'title':'','subject':'','author':'','keywords':'','creator':''}
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
		if ( pageWidth > pageHeight  ) {
			var tmp = pageWidth
			pageWidth = pageHeight
			pageHeight = tmp
		}
	} else if (orientation === 'l' || orientation === 'landscape') {
		orientation = 'l'
		if ( pageHeight > pageWidth ) {
			var tmp = pageWidth
			pageWidth = pageHeight
			pageHeight = tmp
		}
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
		for (var fontKey in fonts) {
			if (fonts.hasOwnProperty(fontKey)) {
				putFont(fonts[fontKey])
			}
		}
	}
	, putFont = function(font) {
		font.objectNumber = newObject()
		out('<</BaseFont/' + font.PostScriptName + '/Type/Font')
		if (typeof font.encoding === 'string') {
			out('/Encoding/'+font.encoding)			
		}
		out('/Subtype/Type1>>')
		out('endobj')
	}
	, addToFontDictionary = function(fontKey, fontName, fontStyle) {
		// this is mapping structure for quick font key lookup.
		// returns the KEY of the font (ex: "F1") for a given pair of font name and type (ex: "Arial". "Italic")
		var undef
		if (fontmap[fontName] === undef){
			fontmap[fontName] = {} // fontStyle is a var interpreted and converted to appropriate string. don't wrap in quotes.
		}
		fontmap[fontName][fontStyle] = fontKey
	}
	/**
	FontObject describes a particular font as member of an instnace of jsPDF

	It's a collection of properties like 'id' (to be used in PDF stream),
	'fontName' (font's family name), 'fontStyle' (font's style variant label)

	@class
	@public
	@property id {String} PDF-document-instance-specific label assinged to the font.
	@property PostScriptName {String} PDF specification full name for the font
	@property encoding {Object} Encoding_name-to-Font_metrics_object mapping.
	@name FontObject
	*/
	, FontObject = {}
	, addFont = function(PostScriptName, fontName, fontStyle, encoding) {
		var fontKey = 'F' + (getObjectLength(fonts) + 1).toString(10)
		
		// This is FontObject 
		var font = fonts[fontKey] = {
			'id': fontKey
			// , 'objectNumber':   will be set by putFont()
			, 'PostScriptName': PostScriptName
			, 'fontName': fontName
			, 'fontStyle': fontStyle
			, 'encoding': encoding
			, 'metadata': {}
		}

		addToFontDictionary(fontKey, fontName, fontStyle)

		events.publish('addFont', font)		

		return fontKey
	}
	, addFonts = function() {

		var HELVETICA = "helvetica"
		, TIMES = "times"
		, COURIER = "courier"
		, NORMAL = "normal"
		, BOLD = "bold"
		, ITALIC = "italic"
		, BOLD_ITALIC = "bolditalic"
		, encoding = 'StandardEncoding'
		, standardFonts = [
			['Helvetica', HELVETICA, NORMAL]
			, ['Helvetica-Bold', HELVETICA, BOLD]
			, ['Helvetica-Oblique', HELVETICA, ITALIC]
			, ['Helvetica-BoldOblique', HELVETICA, BOLD_ITALIC]
			, ['Courier', COURIER, NORMAL]
			, ['Courier-Bold', COURIER, BOLD]
			, ['Courier-Oblique', COURIER, ITALIC]
			, ['Courier-BoldOblique', COURIER, BOLD_ITALIC]
			, ['Times-Roman', TIMES, NORMAL]
			, ['Times-Bold', TIMES, BOLD]
			, ['Times-Italic', TIMES, ITALIC]
			, ['Times-BoldItalic', TIMES, BOLD_ITALIC]
		]

		var i, l, fontKey, parts
		for (i = 0, l = standardFonts.length; i < l; i++) {
			fontKey = addFont(
				standardFonts[i][0]
				, standardFonts[i][1]
				, standardFonts[i][2]
				, encoding
			)

			// adding aliases for standard fonts, this time matching the capitalization
			parts = standardFonts[i][0].split('-')
			addToFontDictionary(fontKey, parts[0], parts[1] || '')
		}

		events.publish('addFonts', {'fonts':fonts, 'dictionary':fontmap})
	}
	, putResourceDictionary = function() {
		out('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]')
		out('/Font <<')
		// Do this for each font, the '1' bit is the index of the font
		for (var fontKey in fonts) {
			if (fonts.hasOwnProperty(fontKey)) {
				out('/' + fontKey + ' ' + fonts[fontKey].objectNumber + ' 0 R')
			}
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
		if(documentProperties.title) {
			out('/Title (' + pdfEscape(documentProperties.title) + ')')
		}
		if(documentProperties.subject) {
			out('/Subject (' + pdfEscape(documentProperties.subject) + ')')
		}
		if(documentProperties.author) {
			out('/Author (' + pdfEscape(documentProperties.author) + ')')
		}
		if(documentProperties.keywords) {
			out('/Keywords (' + pdfEscape(documentProperties.keywords) + ')')
		}
		if(documentProperties.creator) {
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

		events.publish('addPage', {'pageNumber':page})
	}
	/**
	Returns a document-specific font key - a label assigned to a
	font name + font type combination at the time the font was added
	to the font inventory.

	Font key is used as label for the desired font for a block of text
	to be added to the PDF document stream.
	@private
	@function
	@param fontName {String} can be undefined on "falthy" to indicate "use current"
	@param fontStyle {String} can be undefined on "falthy" to indicate "use current"
	@returns {String} Font key.
	*/
	, getFont = function(fontName, fontStyle) {
		var key, undef

		if (fontName === undef) {
			fontName = fonts[activeFontKey]['fontName']
		}
		if (fontStyle === undef) {
			fontStyle = fonts[activeFontKey]['fontStyle']
		}

		try {
			key = fontmap[fontName][fontStyle] // returns a string like 'F3' - the KEY corresponding tot he font + type combination.
		} catch (e) {
			key = undef
		}
		if (!key){
			throw new Error("Unable to look up font label for font '"+fontName+"', '"+fontStyle+"'. Refer to getFontList() for available fonts.")
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
	/**
	
	@public
	@function
	@param text {String} 
	@param flags {Object} Encoding flags.
	@returns {String} Encoded string
	*/
	, to8bitStream = function(text, flags){
		/* PDF 1.3 spec:
		"For text strings encoded in Unicode, the first two bytes must be 254 followed by
		255, representing the Unicode byte order marker, U+FEFF. (This sequence conflicts
		with the PDFDocEncoding character sequence thorn ydieresis, which is unlikely
		to be a meaningful beginning of a word or phrase.) The remainder of the
		string consists of Unicode character codes, according to the UTF-16 encoding
		specified in the Unicode standard, version 2.0. Commonly used Unicode values
		are represented as 2 bytes per character, with the high-order byte appearing first
		in the string."

		In other words, if there are chars in a string with char code above 255, we
		recode the string to UCS2 BE - string doubles in length and BOM is prepended.

		HOWEVER!
		Actual *content* (body) text (as opposed to strings used in document properties etc)
		does NOT expect BOM. There, it is treated as a literal GID (Glyph ID)

		Because of Adobe's focus on "you subset your fonts!" you are not supposed to have
		a font that maps directly Unicode (UCS2 / UTF16BE) code to font GID, but you could
		fudge it with "Identity-H" encoding and custom CIDtoGID map that mimics Unicode
		code page. There, however, all characters in the stream are treated as GIDs,
		including BOM, which is the reason we need to skip BOM in content text (i.e. that
		that is tied to a font).

		To signal this "special" PDFEscape / to8bitStream handling mode,
		API.text() function sets (unless you overwrite it with manual values
		given to API.text(.., flags) )
			flags.autoencode = true
			flags.noBOM = true

		*/

		/*
		`flags` properties relied upon:
		.sourceEncoding = string with encoding label. 
			"Unicode" by default. = encoding of the incoming text.
			pass some non-existing encoding name 
			(ex: 'Do not touch my strings! I know what I am doing.')
			to make encoding code skip the encoding step.
		.outputEncoding = Either valid PDF encoding name 
			(must be supported by jsPDF font metrics, otherwise no encoding)
			or a JS object, where key = sourceCharCode, value = outputCharCode
			missing keys will be treated as: sourceCharCode === outputCharCode
		.noBOM
			See comment higher above for explanation for why this is important
		.autoencode
			See comment higher above for explanation for why this is important
		*/

		var i, l, undef

		if (flags === undef) {
			flags = {}
		}

		var sourceEncoding = flags.sourceEncoding ? sourceEncoding : 'Unicode'
		, encodingBlock
		, outputEncoding = flags.outputEncoding
		, newtext
		, isUnicode, ch, bch
		// This 'encoding' section relies on font metrics format 
		// attached to font objects by, among others, 
		// "Willow Systems' standard_font_metrics plugin"
		// see jspdf.plugin.standard_font_metrics.js for format
		// of the font.metadata.encoding Object.
		// It should be something like
		//   .encoding = {'codePages':['WinANSI....'], 'WinANSI...':{code:code, ...}}
		//   .widths = {0:width, code:width, ..., 'fof':divisor}
		//   .kerning = {code:{previous_char_code:shift, ..., 'fof':-divisor},...}
		if ((flags.autoencode || outputEncoding ) && 
			fonts[activeFontKey].metadata &&
			fonts[activeFontKey].metadata[sourceEncoding] &&
			fonts[activeFontKey].metadata[sourceEncoding].encoding
		) {
			encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding
			
			// each font has default encoding. Some have it clearly defined.
			if (!outputEncoding && fonts[activeFontKey].encoding) {
				outputEncoding = fonts[activeFontKey].encoding
			}

			// Hmmm, the above did not work? Let's try again, in different place.
			if (!outputEncoding && encodingBlock.codePages) {
				outputEncoding = encodingBlock.codePages[0] // let's say, first one is the default
			}

			if (typeof outputEncoding === 'string') {
				outputEncoding = encodingBlock[outputEncoding]
			}
			// we want output encoding to be a JS Object, where
			// key = sourceEncoding's character code and 
			// value = outputEncoding's character code.
			if (outputEncoding) {
				isUnicode = false
				newtext = []
				for (i = 0, l = text.length; i < l; i++) {
					ch = outputEncoding[text.charCodeAt(i)]
					if (ch) {
						newtext.push(
							String.fromCharCode(ch)
						)
					} else {
						newtext.push(
							text[i]
						)
					}

					// since we are looping over chars anyway, might as well
					// check for residual unicodeness
					if (newtext[i].charCodeAt(0) >> 8 /* more than 255 */ ) {
						isUnicode = true
					}
				}
				text = newtext.join('')
			}
		}

		i = text.length
		// isUnicode may be set to false above. Hence the triple-equal to undefined
		while (isUnicode === undef && i !== 0){
			if ( text.charCodeAt(i - 1) >> 8 /* more than 255 */ ) {
				isUnicode = true
			}
			;i--;
		}
		if (!isUnicode) {
			return text
		} else {
			newtext = flags.noBOM ? [] : [254, 255]
			for (i = 0, l = text.length; i < l; i++) {
				ch = text.charCodeAt(i)
				bch = ch >> 8 // divide by 256
				if (bch >> 8 /* something left after dividing by 256 second time */ ) {
					throw new Error("Character at position "+i.toString(10)+" of string '"+text+"' exceeds 16bits. Cannot be encoded into UCS-2 BE")
				}
				newtext.push(bch)
				newtext.push(ch - ( bch << 8))
			}
			return String.fromCharCode.apply(undef, newtext)
		}
	}
	// Replace '/', '(', and ')' with pdf-safe versions
	, pdfEscape = function(text, flags) {
		// doing to8bitStream does NOT make this PDF display unicode text. For that
		// we also need to reference a unicode font and embed it - royal pain in the rear.

		// There is still a benefit to to8bitStream - PDF simply cannot handle 16bit chars,
		// which JavaScript Strings are happy to provide. So, while we still cannot display
		// 2-byte characters property, at least CONDITIONALLY converting (entire string containing) 
		// 16bit chars to (USC-2-BE) 2-bytes per char + BOM streams we ensure that entire PDF
		// is still parseable.
		// This will allow immediate support for unicode in document properties strings.
		return to8bitStream(text, flags).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
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

	/*
	Object exposing internal API to plugins
	@public
	*/
	API.internal = {
		'pdfEscape': pdfEscape
		, 'getStyle': getStyle
		/**
		Returns {FontObject} describing a particular font.
		@public
		@function
		@param fontName {String} (Optional) Font's family name
		@param fontStyle {String} (Optional) Font's style variation name (Example:"Italic")
		@returns {FontObject}
		*/
		, 'getFont': function(){ return fonts[getFont.apply(API, arguments)] }
		, 'getFontSize': function() { return activeFontSize	}
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
		// ratio that you use in multiplication of a given "size" number to arrive to 'point' 
		// units of measurement.
		// scaleFactor is set at initialization of the document and calculated against the stated 
		// default measurement units for the document.
		// If default is "mm", k is the number that will turn number in 'mm' into 'points' number.
		// through multiplication.
		, 'scaleFactor': k 
		, 'pageSize': {'width':pageWidth, 'height':pageHeight}
	}
	
	/**
	Adds (and transfers the focus to) new page to the PDF document.
	@function
	@returns {jsPDF} 

	@methodOf jsPDF#
	@name addPage
	 */
	API.addPage = function() {
		_addPage()
		return this
	}

	/**
	Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings. 
	@function
	@param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
	@param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
	@param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
	@param {Object} flags Collection of settings signalling how the text must be encoded. Defaults are sane. If you think you want to pass some flags, you likely can read the source.
	@returns {jsPDF}
	@methodOf jsPDF#
	@name text
	 */
	API.text = function(text, x, y, flags) {
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
		
	 	var undef
		// Pre-August-2012 the order of arguments was function(x, y, text, flags)
		// in effort to make all calls have similar signature like 
		//   function(data, coordinates... , miscellaneous)
		// this method had its args flipped.
		// code below allows backward compatibility with old arg order.
		var _first, _second, _third
		if (typeof arguments[0] === 'number') {
			_first = arguments[2]
			_second = arguments[0]
			_third = arguments[1]

			text = _first 
			x = _second 
			y = _third
		}

		// If there are any newlines in text, we assume
		// the user wanted to print multiple lines, so break the
		// text up into an array.  If the text is already an array,
		// we assume the user knows what they are doing.
		if (typeof text === 'string' && text.match(/[\n\r]/)) {
			text = text.split(/\r\n|\r|\n/g)
		}

		if (typeof flags === 'undefined') {
			flags = {'noBOM':true,'autoencode':true}
		} else {

			if (flags.noBOM === undef) {
				flags.noBOM = true
			}

			if (flags.autoencode === undef) {
				flags.autoencode = true
			}

		}

		var newtext, str

		if (typeof text === 'string') {
			str = pdfEscape(text, flags)
		} else if (text instanceof Array) /* Array */{
			// we don't want to destroy  original text array, so cloning it
			newtext = text.concat()
			// we do array.join('text that must not be PDFescaped")
			// thus, pdfEscape each component separately
			for ( var i = newtext.length - 1; i !== -1 ; i--) {
				newtext[i] = pdfEscape( newtext[i], flags)
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
			activeFontKey + ' ' + activeFontSize + ' Tf\n' + // font face, style, size
			activeFontSize + ' TL\n' + // line spacing
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
	Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
	All data points in `lines` are relative to last line origin.
	`x`, `y` become x1,y1 for first line / curve in the set.
	For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
	For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.
	
	@example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, 10) // line, line, bezier curve, line 
	@param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
	@param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
	@param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
	@param {Number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.   
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name lines
	 */
	API.lines = function(lines, x, y, scale, style) {
		var undef
		
		// Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
		// in effort to make all calls have similar signature like 
		//   function(content, coordinateX, coordinateY , miscellaneous)
		// this method had its args flipped.
		// code below allows backward compatibility with old arg order.
		var _first, _second, _third
		if (typeof arguments[0] === 'number') {
			_first = arguments[2]
			_second = arguments[0]
			_third = arguments[1]

			lines = _first 
			x = _second 
			y = _third
		}

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

	/**
	Adds a rectangle to PDF
	
	@param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
	@param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
	@param {Number} w Width (in units declared at inception of PDF document) 
	@param {Number} h Height (in units declared at inception of PDF document) 
	@param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name rect
	 */
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

	/**
	Adds a triangle to PDF
	
	@param {Number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page
	@param {Number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page
	@param {Number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page
	@param {Number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page
	@param {Number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page
	@param {Number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page
	@param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name triangle
	 */
	API.triangle = function(x1, y1, x2, y2, x3, y3, style) {
		this.lines(
			[
				[ x2 - x1 , y2 - y1 ] // vector to point 2
				, [ x3 - x2 , y3 - y2 ] // vector to point 3
				, [ x1 - x3 , y1 - y3 ] // closing vector back to point 1
			]
			, x1, y1 // start of path
			, [1,1]
			, style
		)
		return this;
	}
	
	/**
	Adds a rectangle with rounded corners to PDF
	
	@param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
	@param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
	@param {Number} w Width (in units declared at inception of PDF document) 
	@param {Number} h Height (in units declared at inception of PDF document) 
	@param {Number} rx Radius along x axis (in units declared at inception of PDF document) 
	@param {Number} rx Radius along y axis (in units declared at inception of PDF document) 
	@param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name roundedRect
	*/
	API.roundedRect = function(x, y, w, h, rx, ry, style) {
		var MyArc = 4/3*(Math.SQRT2-1);
		this.lines(
			[
				[ (w-2*rx), 0 ] 
				, [ (rx*MyArc), 0, rx, ry-(ry*MyArc), rx, ry ] 
				, [ 0, (h-2*ry) ] 
				, [ 0, (ry*MyArc), -(rx*MyArc), ry, -rx, ry]
				, [ (-w+2*rx), 0]
				, [ -(rx*MyArc), 0, -rx, -(ry*MyArc), -rx, -ry]
				, [ 0, (-h+2*ry)]
				, [ 0, -(ry*MyArc), (rx*MyArc), -ry, rx, -ry]
			]
			, x+rx, y // start of path
			, [1,1]
			, style
		)
		return this;
	}

	/**
	Adds an ellipse to PDF
	
	@param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
	@param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
	@param {Number} rx Radius along x axis (in units declared at inception of PDF document) 
	@param {Number} rx Radius along y axis (in units declared at inception of PDF document) 
	@param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name ellipse
	 */
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

	/**
	Adds an circle to PDF
	
	@param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
	@param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
	@param {Number} r Radius (in units declared at inception of PDF document) 
	@param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name circle
	 */
	API.circle = function(x, y, r, style) {
		return this.ellipse(x, y, r, r, style)
	}

	/**
	Adds a properties to the PDF document
	
	@param {Object} A property_name-to-property_value object structure.
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name setProperties
	 */
	API.setProperties = function(properties) {
		// copying only those properties we can render.
		for (var property in documentProperties){
			if (documentProperties.hasOwnProperty(property) && properties[property]) {
				documentProperties[property] = properties[property]
			}
		}
		return this
	}

	/**
	Sets font size for upcoming text elements.
	
	@param {Number} size Font size in points.
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name setFontSize
	 */
	API.setFontSize = function(size) {
		activeFontSize = size
		return this
	}

	/**
	Sets text font face, variant for upcoming text elements.
	See output of jsPDF.getFontList() for possible font names, styles.
	
	@param {String} fontName Font name or family. Example: "times"
	@param {String} fontStyle Font style or variant. Example: "italic"
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name setFont
	 */
	API.setFont = function(fontName, fontStyle) {
		activeFontKey = getFont(fontName, fontStyle)
		// if font is not found, the above line blows up and we never go further
		return this
	}

	/**
	Switches font style or variant for upcoming text elements,
	while keeping the font face or family same.
	See output of jsPDF.getFontList() for possible font names, styles.
	
	@param {String} style Font style or variant. Example: "italic"
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name setFontStyle
	 */
	API.setFontStyle = API.setFontType = function(style) {
		var undef
		activeFontKey = getFont(undef, style)
		// if font is not found, the above line blows up and we never go further
		return this
	}

	/**
	Returns an object - a tree of fontName to fontStyle relationships available to 
	active PDF document. 

	@public
	@function
	@returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
	@methodOf jsPDF#
	@name getFontList
	*/
	API.getFontList = function(){
		// TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
		var list = {}
		, fontName
		, fontStyle
		, tmp

		for (fontName in fontmap) {
			if (fontmap.hasOwnProperty(fontName)) {
				list[fontName] = tmp = []
				for (fontStyle in fontmap[fontName]){
					if (fontmap[fontName].hasOwnProperty(fontStyle)) {
						tmp.push(fontStyle)
					}
				}
			}
		}

		return list
	}

	/**
	Sets line width for upcoming lines.
	
	@param {Number} width Line width (in units declared at inception of PDF document)
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name setLineWidth
	 */
	API.setLineWidth = function(width) {
		out((width * k).toFixed(2) + ' w')
		return this
	}

	/**
	Sets the stroke color for upcoming elements. 

	Depending on the number of arguments given, Gray, RGB, or CMYK
	color space is implied.

	When only ch1 is given, "Gray" color space is implied and it
	must be a value in the range from 0.00 (solid black) to to 1.00 (white)
	if values are communicated as String types, or in range from 0 (black)
	to 255 (white) if communicated as Number type.
	The RGB-like 0-255 range is provided for backward compatibility.

	When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
	value must be in the range from 0.00 (minimum intensity) to to 1.00 
	(max intensity) if values are communicated as String types, or 
	from 0 (min intensity) to to 255 (max intensity) if values are communicated
	as Number types.
	The RGB-like 0-255 range is provided for backward compatibility.

	When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
	value must be a in the range from 0.00 (0% concentration) to to 
	1.00 (100% concentration)

	Because JavaScript treats fixed point numbers badly (rounds to 
	floating point nearest to binary representation) it is highly advised to
	communicate the fractional numbers as String types, not JavaScript Number type.
	
	@param {Number|String} ch1 Color channel value
	@param {Number|String} ch2 Color channel value
	@param {Number|String} ch3 Color channel value
	@param {Number|String} ch4 Color channel value

	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name setDrawColor
	 */
	API.setDrawColor = function(ch1,ch2,ch3,ch4) {
		var undefined
		, color
		if (ch2 === undefined || ( ch4 === undefined && ch1 === ch2 === ch3 ) ) {
			// Gray color space.
			if (typeof ch1 === 'string') {
				color = ch1 + ' G'
			} else {
				color = f2(ch1/255) + ' G'
			}
		} else if (ch4 === undefined) {
			// RGB
			if (typeof ch1 === 'string') {
				color = [ch1, ch2, ch3, 'RG'].join(' ')
			} else {
				color = [f2(ch1/255), f2(ch2/255), f2(ch3/255), 'RG'].join(' ')
			}
		} else {
			// CMYK
			if (typeof ch1 === 'string') {
				color = [ch1, ch2, ch3, ch4, 'K'].join(' ')
			} else {
				color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'K'].join(' ')
			}
		}

		out(color)
		return this
	}

	/**
	Sets the fill color for upcoming elements. 
	
	Depending on the number of arguments given, Gray, RGB, or CMYK
	color space is implied.

	When only ch1 is given, "Gray" color space is implied and it
	must be a value in the range from 0.00 (solid black) to to 1.00 (white)
	if values are communicated as String types, or in range from 0 (black)
	to 255 (white) if communicated as Number type.
	The RGB-like 0-255 range is provided for backward compatibility.

	When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
	value must be in the range from 0.00 (minimum intensity) to to 1.00 
	(max intensity) if values are communicated as String types, or 
	from 0 (min intensity) to to 255 (max intensity) if values are communicated
	as Number types.
	The RGB-like 0-255 range is provided for backward compatibility.

	When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
	value must be a in the range from 0.00 (0% concentration) to to 
	1.00 (100% concentration)

	Because JavaScript treats fixed point numbers badly (rounds to 
	floating point nearest to binary representation) it is highly advised to
	communicate the fractional numbers as String types, not JavaScript Number type.
	
	@param {Number|String} ch1 Color channel value
	@param {Number|String} ch2 Color channel value
	@param {Number|String} ch3 Color channel value
	@param {Number|String} ch4 Color channel value

	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name setFillColor
	 */
	API.setFillColor = function(ch1, ch2, ch3, ch4) {
		var undefined
		, color

		if (ch2 === undefined || ( ch4 === undefined && ch1 === ch2 === ch3 ) ) {
			// Gray color space.
			if (typeof ch1 === 'string') {
				color = ch1 + ' g'
			} else {
				color = f2(r/255) + ' g'
			}
		} else if (ch4 === undefined) {
			// RGB
			if (typeof ch1 === 'string') {
				color = [ch1, ch2, ch3, 'rg'].join(' ')
			} else {
				color = [f2(ch1/255), f2(ch2/255), f2(ch3/255), 'rg'].join(' ')
			}
		} else {
			// CMYK
			if (typeof ch1 === 'string') {
				color = [ch1, ch2, ch3, ch4, 'k'].join(' ')
			} else {
				color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'k'].join(' ')
			}
		}

		out(color)
		return this
	}

	/**
	Sets the text color for upcoming elements. 
	If only one, first argument is given,
	treats the value as gray-scale color value.
	
	@param {Number} r Red channel color value in range 0-255
	@param {Number} g Green channel color value in range 0-255
	@param {Number} b Blue channel color value in range 0-255
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name setTextColor
	*/
	API.setTextColor = function(r,g,b) {
		if ((r===0 && g===0 && b===0) || (typeof g === 'undefined')) {
			textColor = f3(r/255) + ' g'
		} else {
			textColor = [f3(r/255), f3(g/255), f3(b/255), 'rg'].join(' ')
		}
		return this
	}

	/**
	Is an Object providing a mapping from human-readable to
	integer flag values designating the varieties of line cap 
	and join styles.
	
	@returns {Object}
	@fieldOf jsPDF#
	@name CapJoinStyles
	*/
	API.CapJoinStyles = {
		0:0, 'butt':0, 'but':0, 'bevel':0
		, 1:1, 'round': 1, 'rounded':1, 'circle':1
		, 2:2, 'projecting':2, 'project':2, 'square':2, 'milter':2
	}

	/**
	Sets the line cap styles
	See {jsPDF.CapJoinStyles} for variants
	
	@param {String|Number} style A string or number identifying the type of line cap
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name setLineCap
	*/
	API.setLineCap = function(style) {
		var undefined
		, id = this.CapJoinStyles[style]
		if (id === undefined) {
			throw new Error("Line cap style of '"+style+"' is not recognized. See or extend .CapJoinStyles property for valid styles")
		}
		lineCapID = id
		out(id.toString(10) + ' J')

		return this
	}

	/**
	Sets the line join styles
	See {jsPDF.CapJoinStyles} for variants
	
	@param {String|Number} style A string or number identifying the type of line join
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name setLineJoin
	*/
	API.setLineJoin = function(style) {
		var undefined
		, id = this.CapJoinStyles[style]
		if (id === undefined) {
			throw new Error("Line join style of '"+style+"' is not recognized. See or extend .CapJoinStyles property for valid styles")
		}
		lineJoinID = id
		out(id.toString(10) + ' j')

		return this
	}

	/**
	Generates the PDF document.
	Possible values:
		datauristring (alias dataurlstring) - Data-Url-formatted data returned as string.
		datauri (alias datauri) - Data-Url-formatted data pushed into current window's location (effectively reloading the window with contents of the PDF).
	
	If `type` argument is undefined, output is raw body of resulting PDF returned as a string.

	@param {String} type A string identifying one of the possible output types.
	@param {Object} options An object providing some additional signalling to PDF generator.
	@function
	@returns {jsPDF}
	@methodOf jsPDF#
	@name output
	*/
	API.output = function(type, options) {
		var undef
		switch (type){
			case undef: 
				return buildDocument();
			case 'save':
				var bb = new BlobBuilder;
				var data = buildDocument();

				// Need to add the file to BlobBuilder as a Uint8Array
				var length = data.length;
				var array = new Uint8Array(new ArrayBuffer(length));

				for (var i = 0; i < length; i++) {
					array[i] = data.charCodeAt(i);
				}

				bb.append(array);

				var blob = bb.getBlob('application/pdf');
				saveAs(blob, options);
				break;
			case 'datauristring':
			case 'dataurlstring':
				return 'data:application/pdf;base64,' + btoa(buildDocument())
			case 'datauri':
			case 'dataurl':
				document.location.href = 'data:application/pdf;base64,' + btoa(buildDocument()); break;
			default: throw new Error('Output type "'+type+'" is not supported.') 
		}
		// @TODO: Add different output options
	};

	/**
	 * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf')
	 * @param  {String} filename The filename including extension.
	 *
	 * @function
	 * @returns {jsPDF}
	 * @methodOf jsPDF#
	 * @name save
	 */
	API.save = function(filename) {
		API.output('save', filename);
	}

	// applying plugins (more methods) ON TOP of built-in API.
	// this is intentional as we allow plugins to override 
	// built-ins
	for (var plugin in jsPDF.API){
		if (jsPDF.API.hasOwnProperty(plugin)){
			if (plugin === 'events' && jsPDF.API.events.length) {
				(function(events, newEvents){

					// jsPDF.API.events is a JS Array of Arrays 
					// where each Array is a pair of event name, handler
					// Events were added by plugins to the jsPDF instantiator.
					// These are always added to the new instance and some ran
					// during instantiation.

					var eventname, handler_and_args

					for (var i = newEvents.length - 1; i !== -1; i--){
						// subscribe takes 3 args: 'topic', function, runonce_flag
						// if undefined, runonce is false.
						// users can attach callback directly, 
						// or they can attach an array with [callback, runonce_flag]
						// that's what the "apply" magic is for below.
						eventname = newEvents[i][0]
						handler_and_args = newEvents[i][1]
						events.subscribe.apply(
							events
							, [eventname].concat(
								typeof handler_and_args === 'function' ?
							  	[ handler_and_args ] :
							  	handler_and_args
							)
						)
					}
				})(events, jsPDF.API.events)
			} else {
				API[plugin] = jsPDF.API[plugin]
			}
		}
	}

	/////////////////////////////////////////
	// continuing initilisation of jsPDF Document object
	/////////////////////////////////////////


	// Add the first page automatically
	addFonts()
	activeFontKey = 'F1'
	_addPage()

	events.publish('initialized')

	return API
}

/**
jsPDF.API is a STATIC property of jsPDF class.
jsPDF.API is an object you can add methods and properties to.
The methods / properties you add will show up in new jsPDF objects.

One property is prepopulated. It is the 'events' Object. Plugin authors can add topics, callbacks to this object. These will be reassigned to all new instances of jsPDF. 
Examples: 
	jsPDF.API.events['initialized'] = function(){ 'this' is API object }
	jsPDF.API.events['addFont'] = function(added_font_object){ 'this' is API object }

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
jsPDF.API = {'events':[]}

return jsPDF
})()
/** @preserve 
jsPDF addImage plugin (JPEG only at this time)
Copyright (c) 2012 https://github.com/siefkenj/
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

;(function(jsPDFAPI) {
'use strict'

var namespace = 'addImage_'

// takes a string imgData containing the raw bytes of
// a jpeg image and returns [width, height]
// Algorithm from: http://www.64lines.com/jpeg-width-height
var getJpegSize = function(imgData) {
	'use strict'
	var width, height;
	// Verify we have a valid jpeg header 0xff,0xd8,0xff,0xe0,?,?,'J','F','I','F',0x00
	if (!imgData.charCodeAt(0) === 0xff ||
		!imgData.charCodeAt(1) === 0xd8 ||
		!imgData.charCodeAt(2) === 0xff ||
		!imgData.charCodeAt(3) === 0xe0 ||
		!imgData.charCodeAt(6) === 'J'.charCodeAt(0) ||
		!imgData.charCodeAt(7) === 'F'.charCodeAt(0) ||
		!imgData.charCodeAt(8) === 'I'.charCodeAt(0) ||
		!imgData.charCodeAt(9) === 'F'.charCodeAt(0) ||
		!imgData.charCodeAt(10) === 0x00) {
			throw new Error('getJpegSize requires a binary jpeg file')
	}
	var blockLength = imgData.charCodeAt(4)*256 + imgData.charCodeAt(5);
	var i = 4, len = imgData.length;
	while ( i < len ) {
		i += blockLength;
		if (imgData.charCodeAt(i) !== 0xff) {
			throw new Error('getJpegSize could not find the size of the image');
		}
		if (imgData.charCodeAt(i+1) === 0xc0) {
			height = imgData.charCodeAt(i+5)*256 + imgData.charCodeAt(i+6);
			width = imgData.charCodeAt(i+7)*256 + imgData.charCodeAt(i+8);
			return [width, height];
		} else {
			i += 2;
			blockLength = imgData.charCodeAt(i)*256 + imgData.charCodeAt(i+1)
		}
	}
}
// Image functionality ported from pdf.js
, putImage = function(img) {
	var objectNumber = this.internal.newObject()
	, out = this.internal.write
	, putStream = this.internal.putStream

	img['n'] = objectNumber

	out('<</Type /XObject')
	out('/Subtype /Image')
	out('/Width ' + img['w'])
	out('/Height ' + img['h'])
	if (img['cs'] === 'Indexed') {
		out('/ColorSpace [/Indexed /DeviceRGB '
				+ (img['pal'].length / 3 - 1) + ' ' + (objectNumber + 1)
				+ ' 0 R]');
	} else {
		out('/ColorSpace /' + img['cs']);
		if (img['cs'] === 'DeviceCMYK') {
			out('/Decode [1 0 1 0 1 0 1 0]');
		}
	}
	out('/BitsPerComponent ' + img['bpc']);
	if ('f' in img) {
		out('/Filter /' + img['f']);
	}
	if ('dp' in img) {
		out('/DecodeParms <<' + img['dp'] + '>>');
	}
	if ('trns' in img && img['trns'].constructor == Array) {
		var trns = '';
		for ( var i = 0; i < img['trns'].length; i++) {
			trns += (img[trns][i] + ' ' + img['trns'][i] + ' ');
			out('/Mask [' + trns + ']');
		}
	}
	if ('smask' in img) {
		out('/SMask ' + (objectNumber + 1) + ' 0 R');
	}
	out('/Length ' + img['data'].length + '>>');

	putStream(img['data']);

	out('endobj');
}
, putResourcesCallback = function() {
	var images = this.internal.collections[namespace + 'images']
	for ( var i in images ) {
		putImage.call(this, images[i])
	}
}
, putXObjectsDictCallback = function(){
	var images = this.internal.collections[namespace + 'images']
	, out = this.internal.write
	, image
	for (var i in images) {
		image = images[i]
		out(
			'/I' + image['i']
			, image['n']
			, '0'
			, 'R'
		)
	}
}

jsPDFAPI.addImage = function(imageData, format, x, y, w, h) {
	'use strict'

	if (format.toUpperCase() !== 'JPEG') {
		throw new Error('addImage currently only supports format \'JPEG\', not \''+format+'\'');
	}

	var imageIndex
	, images = this.internal.collections[namespace + 'images']
	, coord = this.internal.getCoordinateString
	, vcoord = this.internal.getVerticalCoordinateString;

	// Detect if the imageData is raw binary or Data URL
	if (imageData.substring(0, 23) === 'data:image/jpeg;base64,') {
		imageData = atob(imageData.replace('data:image/jpeg;base64,', ''));
	}

	if (images){
		// this is NOT the first time this method is ran on this instance of jsPDF object.
		imageIndex = Object.keys ? 
		Object.keys(images).length :
		(function(o){
			var i = 0
			for (var e in o){if(o.hasOwnProperty(e)){ i++ }}
			return i
		})(images)
	} else {
		// this is the first time this method is ran on this instance of jsPDF object.
		imageIndex = 0
		this.internal.collections[namespace + 'images'] = images = {}
		this.internal.events.subscribe('putResources', putResourcesCallback)
		this.internal.events.subscribe('putXobjectDict', putXObjectsDictCallback)
	}

	var dims = getJpegSize(imageData);
	var info = {
		w : dims[0],
		h : dims[1],
		cs : 'DeviceRGB',
		bpc : 8,
		f : 'DCTDecode',
		i : imageIndex,
		data : imageData
		// n: objectNumber will be added by putImage code

	};
	images[imageIndex] = info
	if (!w && !h) {
		w = -96;
		h = -96;
	}
	if (w < 0) {
		w = (-1) * info['w'] * 72 / w / this.internal.scaleFactor;
	}
	if (h < 0) {
		h = (-1) * info['h'] * 72 / h / this.internal.scaleFactor;
	}
	if (w === 0) {
		w = h * info['w'] / info['h'];
	}
	if (h === 0) {
		h = w * info['h'] / info['w'];
	}

	this.internal.write(
		'q'
		, coord(w)
		, '0 0'
		, coord(h) // TODO: check if this should be shifted by vcoord
		, coord(x)
		, vcoord(y + h)
		, 'cm /I'+info['i']
		, 'Do Q'
	)

	return this 
}

})(jsPDF.API)
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
		, '('+this.pdf.internal.pdfEscape(text)+') Tj'
	)
}

Renderer.prototype.renderParagraph = function(){

	var fragments = PurgeWhiteSpace( this.paragraph.text )
	, styles = this.paragraph.style
	, blockstyle = this.paragraph.blockstyle
	, priorblockstype = this.paragraph.blockstyle || {}
	this.paragraph = {'text':[], 'style':[], 'blockstyle':{}, 'priorblockstyle':blockstyle}

	if (!fragments.join('').trim()) {
		/* if it's empty string */
		return
	} // else there is something to draw

	var lines = this.splitFragmentsIntoLines(fragments, styles)
	, line // will be array of array pairs [[t,s],[t,s],[t,s]...] where t = text, s = style object

	, maxLineHeight
	, defaultFontSize = 12
	, fontToUnitRatio = defaultFontSize / this.pdf.internal.scaleFactor

	// these will be in pdf instance units
	, paragraphspacing_before = ( 
		// we only use margin-top potion that is larger than margin-bottom of previous elem
		// because CSS margins don't stack, they overlap.
		Math.max( ( blockstyle['margin-top'] || 0 ) - ( priorblockstype['margin-bottom'] || 0 ), 0 ) + 
		( blockstyle['padding-top'] || 0 ) 
	) * fontToUnitRatio
	, paragraphspacing_after = ( 
		( blockstyle['margin-bottom'] || 0 ) + ( blockstyle['padding-bottom'] || 0 ) 
	) * fontToUnitRatio

	, out = this.pdf.internal.write

	, i, l

	this.y += paragraphspacing_before

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
		// this.internal.scaleFactor is ratio of user unit to points. 
		// Dividing by it converts points to user units.
		// vertical offset will be in user units.
		// this.y is in user units.
		this.y += maxLineHeight * fontToUnitRatio
	}

	out(
		'ET' // End Text
		, 'Q' // restore scope
	)

	this.y += paragraphspacing_after
}

Renderer.prototype.setBlockBoundary = function(){
	this.renderParagraph()
}

Renderer.prototype.setBlockStyle = function(css){
	this.paragraph.blockstyle = css
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
	, normal = 16.00
	, value = UnitedNumberMap[css_line_height_string]
	if (value) {
		return value
	}

	// not in cache, ok. need to parse it.

	// Could it be a named value?
	// we will use Windows 94dpi sizing with CSS2 suggested 1.2 step ratio
	// where "normal" or "medium" is 16px
	// see: http://style.cleverchimp.com/font_size_intervals/altintervals.html
	value = ({
		'xx-small':9
		, 'x-small':11
		, 'small':13
		, 'medium':16
		, 'large':19
		, 'x-large':23
		, 'xx-large':28
		, 'auto':0
	})[css_line_height_string]
	if (value !== undef) {
		// caching, returning
		return UnitedNumberMap[css_line_height_string] = value / normal
	}

	// not in cache, ok. need to parse it.
	// is it int?
	if (value = parseFloat(css_line_height_string)) {
		// caching, returning
		return UnitedNumberMap[css_line_height_string] = value / normal
	}

	// must be a "united" value ('123em', '134px' etc.)
	// most browsers convert it to px so, only handling the px
	value = css_line_height_string.match( /([\d\.]+)(px)/ )
	if (value.length === 3) {
		// caching, returning
		return UnitedNumberMap[css_line_height_string] = parseFloat( value[1] ) / normal
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

	if (css['display'] === 'block'){
		css['margin-top'] = ResolveUnitedNumber( $e.css('margin-top') ) || 0
		css['margin-bottom'] = ResolveUnitedNumber( $e.css('margin-bottom') ) || 0
		css['padding-top'] = ResolveUnitedNumber( $e.css('padding-top') ) || 0
		css['padding-bottom'] = ResolveUnitedNumber( $e.css('padding-bottom') ) || 0
	}

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
	, fragmentCSS = GetCSS(element)
	, isBlock = fragmentCSS.display === 'block'

	if (isBlock) {
		renderer.setBlockBoundary()
		renderer.setBlockStyle(fragmentCSS)
	}

	for (var i = 0, l = cns.length; i < l ; i++){
		cn = cns[i]

		if (typeof cn === 'object') {
			// Don't render the insides of script tags, they contain text nodes which then render
			if (cn.nodeType === 1 && cn.nodeName != 'SCRIPT') {
				if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
					DrillForContent(cn, renderer, elementHandlers)
				}
			} else if (cn.nodeType === 3){
				renderer.addText( cn.nodeValue, fragmentCSS )
			}
		} else if (typeof cn === 'string') {
			renderer.addText( cn, fragmentCSS )
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
/** @preserve
jsPDF Silly SVG plugin
Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
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

;(function(jsPDFAPI) {
'use strict'

/**
Parses SVG XML and converts only some of the SVG elements into
PDF elements.

Supports:
 paths

@public
@function
@param
@returns {Type}
*/
jsPDFAPI.addSVG = function(svgtext, x, y, w, h) {
	// 'this' is _jsPDF object returned when jsPDF is inited (new jsPDF())

	var undef

	if (x === undef || x === undef) {
		throw new Error("addSVG needs values for 'x' and 'y'")
	}

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

	function createWorkerNode(document){

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

		return frame
	}

	function attachSVGToWorkerNode(svgtext, frame){
		var framedoc = ( frame.contentWindow || frame.contentDocument ).document
		framedoc.write(svgtext)
		framedoc.close()
		return framedoc.getElementsByTagName('svg')[0]
	}

	function convertPathToPDFLinesArgs(path){
		'use strict'
		// we will use 'lines' method call. it needs:
		// - starting coordinate pair
		// - array of arrays of vector shifts (2-len for line, 6 len for bezier)
		// - scale array [horizontal, vertical] ratios
		// - style (stroke, fill, both)

		var x = parseFloat(path[1])
		, y = parseFloat(path[2])
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
		return [x,y,vectors]
	}

	var workernode = createWorkerNode(document)
	, svgnode = attachSVGToWorkerNode(svgtext, workernode)
	, scale = [1,1]
	, svgw = parseFloat(svgnode.getAttribute('width'))
	, svgh = parseFloat(svgnode.getAttribute('height'))

	if (svgw && svgh) {
		// setting both w and h makes image stretch to size.
		// this may distort the image, but fits your demanded size
		if (w && h) {
			scale = [w / svgw, h / svgh]
		} 
		// if only one is set, that value is set as max and SVG 
		// is scaled proportionately.
		else if (w) {
			scale = [w / svgw, w / svgw]
		} else if (h) {
			scale = [h / svgh, h / svgh]
		}
	}

	var i, l, tmp
	, linesargs
	, items = svgnode.childNodes
	for (i = 0, l = items.length; i < l; i++) {
		tmp = items[i]
		if (tmp.tagName && tmp.tagName.toUpperCase() === 'PATH') {
			linesargs = convertPathToPDFLinesArgs( tmp.getAttribute("d").split(' ') )
			// path start x coordinate
			linesargs[0] = linesargs[0] * scale[0] + x // where x is upper left X of image
			// path start y coordinate
			linesargs[1] = linesargs[1] * scale[1] + y // where y is upper left Y of image
			// the rest of lines are vectors. these will adjust with scale value auto.
			this.lines.call(
				this
				, linesargs[2] // lines
				, linesargs[0] // starting x
				, linesargs[1] // starting y
				, scale
			)
		}
	}

	// clean up
	// workernode.parentNode.removeChild(workernode)

	return this
}

})(jsPDF.API)
/** @preserve 
jsPDF split_text_to_size plugin
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

;(function(API) {
'use strict'

/**
Returns an array of length matching length of the 'word' string, with each
cell ocupied by the width of the char in that position.

@function
@param word {String}
@param widths {Object}
@param kerning {Object}
@returns {Array}
*/
var getCharWidthsArray = API.getCharWidthsArray = function(text, options){

	if (!options) {
		options = {}
	}

	var widths = options.widths ? options.widths : this.internal.getFont().metadata.Unicode.widths
	, widthsFractionOf = widths.fof ? widths.fof : 1
	, kerning = options.kerning ? options.kerning : this.internal.getFont().metadata.Unicode.kerning
	, kerningFractionOf = kerning.fof ? kerning.fof : 1
	
	// console.log("widths, kergnings", widths, kerning)

	var i, l
	, char_code
	, char_width
	, prior_char_code = 0 // for kerning
	, default_char_width = widths[0] || widthsFractionOf
	, output = []

	for (i = 0, l = text.length; i < l; i++) {
		char_code = text.charCodeAt(i)
		output.push(
			( widths[char_code] || default_char_width ) / widthsFractionOf + 
			( kerning[char_code] && kerning[char_code][prior_char_code] || 0 ) / kerningFractionOf
		)
		prior_char_code = char_code
	}

	return output
}
var getArraySum = function(array){
	var i = array.length
	, output = 0
	while(i){
		;i--;
		output += array[i]
	}
	return output
}
/**
Returns a widths of string in a given font, if the font size is set as 1 point.

In other words, this is "proportional" value. For 1 unit of font size, the length
of the string will be that much.

Multiply by font size to get actual width in *points*
Then divide by 72 to get inches or divide by (72/25.6) to get 'mm' etc.

@public
@function
@param
@returns {Type}
*/
var getStringUnitWidth = API.getStringUnitWidth = function(text, options) {
	return getArraySum(getCharWidthsArray.call(this, text, options))
}

/** 
returns array of lines
*/
var splitLongWord = function(word, widths_array, firstLineMaxLen, maxLen){
	var answer = []

	// 1st, chop off the piece that can fit on the hanging line.
	var i = 0
	, l = word.length
	, workingLen = 0
	while (i !== l && workingLen + widths_array[i] < firstLineMaxLen){
		workingLen += widths_array[i]
		;i++;
	}
	// this is first line.
	answer.push(word.slice(0, i))

	// 2nd. Split the rest into maxLen pieces.
	var startOfLine = i
	workingLen = 0
	while (i !== l){
		if (workingLen + widths_array[i] > maxLen) {
			answer.push(word.slice(startOfLine, i))
			workingLen = 0
			startOfLine = i
		}
		workingLen += widths_array[i]
		;i++;
	}
	if (startOfLine !== i) {
		answer.push(word.slice(startOfLine, i))
	}

	return answer
}

// Note, all sizing inputs for this function must be in "font measurement units"
// By default, for PDF, it's "point".
var splitParagraphIntoLines = function(text, maxlen, options){
	// at this time works only on Western scripts, ones with space char
	// separating the words. Feel free to expand.

	if (!options) {
		options = {}
	}

	var spaceCharWidth = getCharWidthsArray(' ', options)[0]

	var words = text.split(' ')

	var line = []
	, lines = [line]
	, line_length = options.textIndent || 0
	, separator_length = 0
	, current_word_length = 0
	, word
	, widths_array

	var i, l, tmp
	for (i = 0, l = words.length; i < l; i++) {
		word = words[i]
		widths_array = getCharWidthsArray(word, options)
		current_word_length = getArraySum(widths_array)

		if (line_length + separator_length + current_word_length > maxlen) {
			if (current_word_length > maxlen) {
				// this happens when you have space-less long URLs for example.
				// we just chop these to size. We do NOT insert hiphens
				tmp = splitLongWord(word, widths_array, maxlen - (line_length + separator_length), maxlen)
				// first line we add to existing line object
				line.push(tmp.shift()) // it's ok to have extra space indicator there
				// last line we make into new line object
				line = [tmp.pop()]
				// lines in the middle we apped to lines object as whole lines
				while(tmp.length){
					lines.push([tmp.shift()]) // single fragment occupies whole line
				}
				current_word_length = getArraySum( widths_array.slice(word.length - line[0].length) )
			} else {
				// just put it on a new line
				line = [word]
			}

			// now we attach new line to lines
			lines.push(line)

			line_length = current_word_length
			separator_length = spaceCharWidth

		} else {
			line.push(word)

			line_length += separator_length + current_word_length
			separator_length = spaceCharWidth
		}
	}

	var output = []
	for (i = 0, l = lines.length; i < l; i++) {
		output.push( lines[i].join(' ') )
	}
	return output

}

/**
Splits a given string into an array of strings. Uses 'size' value
(in measurement units declared as default for the jsPDF instance)
and the font's "widths" and "Kerning" tables, where availabe, to
determine display length of a given string for a given font.

We use character's 100% of unit size (height) as width when Width
table or other default width is not available.

@public
@function
@param text {String} Unencoded, regular JavaScript (Unicode, UTF-16 / UCS-2) string.
@param size {Number} Nominal number, measured in units default to this instance of jsPDF.
@param options {Object} Optional flags needed for chopper to do the right thing.
@returns {Array} with strings chopped to size.
*/
API.splitTextToSize = function(text, maxlen, options) {
	'use strict'

	if (!options) {
		options = {}
	}

	var fsize = options.fontSize || this.internal.getFontSize()
	, newOptions = (function(options){
		var widths = {0:1}
		, kerning = {}

		if (!options.widths || !options.kerning) {
			var f = this.internal.getFont(options.fontName, options.fontStyle)
			, encoding = 'Unicode'
			// NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE
			// Actual JavaScript-native String's 16bit char codes used.
			// no multi-byte logic here

			if (f.metadata[encoding]) {
				return {
					widths: f.metadata[encoding].widths || widths
					, kerning: f.metadata[encoding].kerning || kerning
				}
			}
		} else {
			return 	{
				widths: options.widths
				, kerning: options.kerning
			}			
		}

		// then use default values
		return 	{
			widths: widths
			, kerning: kerning
		}
	}).call(this, options)

	// first we split on end-of-line chars
	var paragraphs 
	if (text.match(/[\n\r]/)) {
		paragraphs = text.split(/\r\n|\r|\n/g)
	} else {
		paragraphs = [text]
	}

	// now we convert size (max length of line) into "font size units"
	// at present time, the "font size unit" is always 'point'
	// 'proportional' means, "in proportion to font size"
	var fontUnit_maxLen = 1.0 * this.internal.scaleFactor * maxlen / fsize
	// at this time, fsize is always in "points" regardless of the default measurement unit of the doc.
	// this may change in the future?
	// until then, proportional_maxlen is likely to be in 'points'

	// If first line is to be indented (shorter or longer) than maxLen 
	// we indicate that by using CSS-style "text-indent" option.
	// here it's in font units too (which is likely 'points')
	// it can be negative (which makes the first line longer than maxLen)
	newOptions.textIndent = options.textIndent ? 
		options.textIndent * 1.0 * this.internal.scaleFactor / fsize : 
		0

	var i, l
	, output = []
	for (i = 0, l = paragraphs.length; i < l; i++) {
		output = output.concat(
			splitParagraphIntoLines(
				paragraphs[i]
				, fontUnit_maxLen
				, newOptions
			)
		)
	}

	return output 
}

})(jsPDF.API);
/** @preserve 
jsPDF standard_fonts_metrics plugin
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

;(function(API) {
'use strict'

/*
# reference (Python) versions of 'compress' and 'uncompress'
# only 'uncompress' function is featured lower as JavaScript
# if you want to unit test "roundtrip", just transcribe the reference
# 'compress' function from Python into JavaScript

def compress(data):

	keys =   '0123456789abcdef'
	values = 'klmnopqrstuvwxyz'
	mapping = dict(zip(keys, values))
	vals = []
	for key in data.keys():
		value = data[key]
		try:
			keystring = hex(key)[2:]
			keystring = keystring[:-1] + mapping[keystring[-1:]]
		except:
			keystring = key.join(["'","'"])
			#print('Keystring is %s' % keystring)

		try:
			if value < 0:
				valuestring = hex(value)[3:]
				numberprefix = '-'
			else:
				valuestring = hex(value)[2:]
				numberprefix = ''
			valuestring = numberprefix + valuestring[:-1] + mapping[valuestring[-1:]]
		except:
			if type(value) == dict:
				valuestring = compress(value)
			else:
				raise Exception("Don't know what to do with value type %s" % type(value))

		vals.append(keystring+valuestring)
	
	return '{' + ''.join(vals) + '}'

def uncompress(data):

	decoded = '0123456789abcdef'
	encoded = 'klmnopqrstuvwxyz'
	mapping = dict(zip(encoded, decoded))

	sign = +1
	stringmode = False
	stringparts = []

	output = {}

	activeobject = output
	parentchain = []

	keyparts = ''
	valueparts = ''

	key = None

	ending = set(encoded)

	i = 1
	l = len(data) - 1 # stripping starting, ending {}
	while i != l: # stripping {}
		# -, {, }, ' are special.

		ch = data[i]
		i += 1

		if ch == "'":
			if stringmode:
				# end of string mode
				stringmode = False
				key = ''.join(stringparts)
			else:
				# start of string mode
				stringmode = True
				stringparts = []
		elif stringmode == True:
			#print("Adding %s to stringpart" % ch)
			stringparts.append(ch)

		elif ch == '{':
			# start of object
			parentchain.append( [activeobject, key] )
			activeobject = {}
			key = None
			#DEBUG = True
		elif ch == '}':
			# end of object
			parent, key = parentchain.pop()
			parent[key] = activeobject
			key = None
			activeobject = parent
			#DEBUG = False

		elif ch == '-':
			sign = -1
		else:
			# must be number
			if key == None:
				#debug("In Key. It is '%s', ch is '%s'" % (keyparts, ch))
				if ch in ending:
					#debug("End of key")
					keyparts += mapping[ch]
					key = int(keyparts, 16) * sign
					sign = +1
					keyparts = ''
				else:
					keyparts += ch
			else:
				#debug("In value. It is '%s', ch is '%s'" % (valueparts, ch))
				if ch in ending:
					#debug("End of value")
					valueparts += mapping[ch]
					activeobject[key] = int(valueparts, 16) * sign
					sign = +1
					key = None
					valueparts = ''
				else:
					valueparts += ch

			#debug(activeobject)

	return output

*/

/**
Uncompresses data compressed into custom, base16-like format. 
@public
@function
@param
@returns {Type}
*/
var uncompress = function(data){

	var decoded = '0123456789abcdef'
	, encoded = 'klmnopqrstuvwxyz'
	, mapping = {}

	for (var i = 0; i < encoded.length; i++){
		mapping[encoded[i]] = decoded[i]
	}

	var undef
	, output = {}
	, sign = 1
	, stringparts // undef. will be [] in string mode
	
	, activeobject = output
	, parentchain = []
	, parent_key_pair
	, keyparts = ''
	, valueparts = ''
	, key // undef. will be Truthy when Key is resolved.
	, datalen = data.length - 1 // stripping ending }
	, ch

	i = 1 // stripping starting {
	
	while (i != datalen){
		// - { } ' are special.

		ch = data[i]
		i += 1

		if (ch == "'"){
			if (stringparts){
				// end of string mode
				key = stringparts.join('')
				stringparts = undef				
			} else {
				// start of string mode
				stringparts = []				
			}
		} else if (stringparts){
			stringparts.push(ch)
		} else if (ch == '{'){
			// start of object
			parentchain.push( [activeobject, key] )
			activeobject = {}
			key = undef
		} else if (ch == '}'){
			// end of object
			parent_key_pair = parentchain.pop()
			parent_key_pair[0][parent_key_pair[1]] = activeobject
			key = undef
			activeobject = parent_key_pair[0]
		} else if (ch == '-'){
			sign = -1
		} else {
			// must be number
			if (key === undef) {
				if (mapping.hasOwnProperty(ch)){
					keyparts += mapping[ch]
					key = parseInt(keyparts, 16) * sign
					sign = +1
					keyparts = ''
				} else {
					keyparts += ch
				}
			} else {
				if (mapping.hasOwnProperty(ch)){
					valueparts += mapping[ch]
					activeobject[key] = parseInt(valueparts, 16) * sign
					sign = +1
					key = undef
					valueparts = ''
				} else {
					valueparts += ch					
				}
			}
		}
	} // end while

	return output
}

// encoding = 'Unicode' 
// NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE. NO clever BOM behavior
// Actual 16bit char codes used.
// no multi-byte logic here

// Unicode characters to WinAnsiEncoding:
// {402: 131, 8211: 150, 8212: 151, 8216: 145, 8217: 146, 8218: 130, 8220: 147, 8221: 148, 8222: 132, 8224: 134, 8225: 135, 8226: 149, 8230: 133, 8364: 128, 8240:137, 8249: 139, 8250: 155, 710: 136, 8482: 153, 338: 140, 339: 156, 732: 152, 352: 138, 353: 154, 376: 159, 381: 142, 382: 158}
// as you can see, all Unicode chars are outside of 0-255 range. No char code conflicts.
// this means that you can give Win cp1252 encoded strings to jsPDF for rendering directly
// as well as give strings with some (supported by these fonts) Unicode characters and 
// these will be mapped to win cp1252 
// for example, you can send char code (cp1252) 0x80 or (unicode) 0x20AC, getting "Euro" glyph displayed in both cases.

var encodingBlock = {
	'codePages': ['WinAnsiEncoding']
	, 'WinAnsiEncoding': uncompress("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")
}
, encodings = {'Unicode':{
	'Courier': encodingBlock
	, 'Courier-Bold': encodingBlock
	, 'Courier-BoldOblique': encodingBlock
	, 'Courier-Oblique': encodingBlock
	, 'Helvetica': encodingBlock
	, 'Helvetica-Bold': encodingBlock
	, 'Helvetica-BoldOblique': encodingBlock
	, 'Helvetica-Oblique': encodingBlock
	, 'Times-Roman': encodingBlock
	, 'Times-Bold': encodingBlock
	, 'Times-BoldItalic': encodingBlock
	, 'Times-Italic': encodingBlock
//	, 'Symbol'
//	, 'ZapfDingbats'
}}
/** 
Resources:
Font metrics data is reprocessed derivative of contents of
"Font Metrics for PDF Core 14 Fonts" package, which exhibits the following copyright and license:

Copyright (c) 1989, 1990, 1991, 1992, 1993, 1997 Adobe Systems Incorporated. All Rights Reserved.

This file and the 14 PostScript(R) AFM files it accompanies may be used,
copied, and distributed for any purpose and without charge, with or without
modification, provided that all copyright notices are retained; that the AFM
files are not distributed without this file; that all modifications to this
file or any of the AFM files are prominently noted in the modified file(s);
and that this paragraph is not modified. Adobe Systems has no responsibility
or obligation to support the use of the AFM files.

*/
, fontMetrics = {'Unicode':{
	// all sizing numbers are n/fontMetricsFractionOf = one font size unit
	// this means that if fontMetricsFractionOf = 1000, and letter A's width is 476, it's
	// width is 476/1000 or 47.6% of its height (regardless of font size)
	// At this time this value applies to "widths" and "kerning" numbers.

	// char code 0 represents "default" (average) width - use it for chars missing in this table.
	// key 'fof' represents the "fontMetricsFractionOf" value

	'Courier-Oblique': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
	, 'Times-BoldItalic': uncompress("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}")
	, 'Helvetica-Bold': uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}")
	, 'Courier': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
	, 'Courier-BoldOblique': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
	, 'Times-Bold': uncompress("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}")
	//, 'Symbol': uncompress("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}")
	, 'Helvetica': uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")
	, 'Helvetica-BoldOblique': uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}")
	//, 'ZapfDingbats': uncompress("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}")
	, 'Courier-Bold': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
	, 'Times-Italic': uncompress("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}")
	, 'Times-Roman': uncompress("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}")
	, 'Helvetica-Oblique': uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")
}};

/*
This event handler is fired when a new jsPDF object is initialized
This event handler appends metrics data to standard fonts within
that jsPDF instance. The metrics are mapped over Unicode character
codes, NOT CIDs or other codes matching the StandardEncoding table of the
standard PDF fonts.
Future:
Also included is the encoding maping table, converting Unicode (UCS-2, UTF-16)
char codes to StandardEncoding character codes. The encoding table is to be used
somewhere around "pdfEscape" call.
*/

API.events.push([ 
	'addFonts'
	,function(fontManagementObjects) {
		// fontManagementObjects is {
		//	'fonts':font_ID-keyed hash of font objects
		//	, 'dictionary': lookup object, linking ["FontFamily"]['Style'] to font ID
		//}
		var font
		, fontID
		, metrics
		, unicode_section
		, encoding = 'Unicode'
		, encodingBlock

		for (fontID in fontManagementObjects.fonts){
			if (fontManagementObjects.fonts.hasOwnProperty(fontID)) {
				font = fontManagementObjects.fonts[fontID]

				// // we only ship 'Unicode' mappings and metrics. No need for loop.
				// // still, leaving this for the future.

				// for (encoding in fontMetrics){
				// 	if (fontMetrics.hasOwnProperty(encoding)) {

						metrics = fontMetrics[encoding][font.PostScriptName]
						if (metrics) {
							if (font.metadata[encoding]) {
								unicode_section = font.metadata[encoding]
							} else {
								unicode_section = font.metadata[encoding] = {}
							}

							unicode_section.widths = metrics.widths
							unicode_section.kerning = metrics.kerning
						}
				// 	}
				// }
				// for (encoding in encodings){
				// 	if (encodings.hasOwnProperty(encoding)) {
						encodingBlock = encodings[encoding][font.PostScriptName]
						if (encodingBlock) {
							if (font.metadata[encoding]) {
								unicode_section = font.metadata[encoding]
							} else {
								unicode_section = font.metadata[encoding] = {}
							}

							unicode_section.encoding = encodingBlock
							if (encodingBlock.codePages && encodingBlock.codePages.length) {
								font.encoding = encodingBlock.codePages[0]
							}
						}
				// 	}
				// }
			}
		}
	}
]) // end of adding event handler

})(jsPDF.API);
libs/BlobBuilder.js/BlobBuilder.jslibs/FileSaver.js/FileSaver.js