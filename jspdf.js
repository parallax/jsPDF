/** @preserve
 * ==================================================================== 
 * jsPDF
 * Copyright (c) 2010 James Hall, https://github.com/MrRio/jsPDF
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
 * Creates new jsPDF document object instance
 * @constructor jsPDF
 * @param orientation One of "portrait" or "landscape" (or shortcuts "p" (Default), "l")
 * @param unit Measurement unit to be used when coordinates are specified. One of "pt" (points), "mm" (Default), "cm", "in"
 * @param format One of 'a3', 'a4' (Default),'a5' ,'letter' ,'legal'
 * @returns {jsPDF}
 */
var jsPDF = function(/** String */ orientation, /** String */ unit, /** String */ format){

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

	, version = '20120220'
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

	/////////////////////
	// Private functions
	/////////////////////
	// simplified (speedier) replacement for sprintf's %.2f conversion  
	, f2 = function(number){
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
	}
	, putPages = function() {
		var wPt = pageWidth * k
		var hPt = pageHeight * k

		// outToPages = false as set in endDocument(). out() writes to content.
		
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
		for (i = 0; i < page; i++) {
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
		// @TODO: Loop through images, or other data objects
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
	, pdfEscape = function(text) {
		return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
	}
	
	// Public API
	, _jsPDF = {
		/**
		 * Adds (and transfers the focus to) new page to the PDF document.
		 * @function
		 * @returns {jsPDF} 
		 * @name jsPDF.addPage
		 */
		addPage: function() {
			_addPage()
			return _jsPDF
		},
		/**
		 * Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings. 
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
		 * @function
		 * @returns {jsPDF}
		 * @name jsPDF.text
		 */
		text: function(x, y, text) {
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
			
			var newtext, str

			if (typeof text === 'string'){
				str = pdfEscape(text)
			} else /* Array */{
				// we don't want to destroy  original text array, so cloning it
				newtext = text.concat()
				// we do array.join('text that must not be PDFescaped")
				// thus, pdfEscape eash component separately
				for ( var i = newtext.length - 1; i !== -1 ; i--) {
					newtext[i] = pdfEscape( newtext[i] )
				}
				str = newtext.join( ") Tj\nT* (" )
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
			return _jsPDF
		},
		line: function(x1, y1, x2, y2) {
			out(
				f2(x1 * k) + ' ' + f2((pageHeight - y1) * k) + ' m ' +
				f2(x2 * k) + ' ' + f2((pageHeight - y2) * k) + ' l S'			
			)
			return _jsPDF
		},
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
		lines: function(x, y, lines, scale) {
			var undef
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
			// stroking the path
			out('S') 
			return _jsPDF
		},		
		rect: function(x, y, w, h, style) {
			var op = 'S'
			if (style === 'F') {
				op = 'f'
			} else if (style === 'FD' || style === 'DF') {
				op = 'B'
			}
			out([
				f2(x * k)
				, f2((pageHeight - y) * k)
				, f2(w * k)
				, f2(-h * k)
				, 're'
				, op
			].join(' '))
			return _jsPDF
		},
		ellipse: function(x, y, rx, ry, style) {
			var op = 'S'
			if (style === 'F') {
				op = 'f'
			} else if (style === 'FD' || style === 'DF') {
				op = 'B'
			}
			var lx = 4/3*(Math.SQRT2-1)*rx
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
			return _jsPDF
		},
		circle: function(x, y, r, style) {
			return this.ellipse(x, y, r, r, style)
		},
		setProperties: function(properties) {
			documentProperties = properties
			return _jsPDF
		},
		addImage: function(imageData, format, x, y, w, h) {
			return _jsPDF
		},
		setFontSize: function(size) {
			fontSize = size
			return _jsPDF
		},
		setFont: function(name) {
			var _name = name.toLowerCase()
			activeFontKey = getFont(_name, fontType)
			// if font is not found, the above line blows up and we never go further
			fontName = _name
			return _jsPDF
		},
		setFontType: function(type) {
			var _type = type.toLowerCase()
			activeFontKey = getFont(fontName, _type)
			// if font is not found, the above line blows up and we never go further
			fontType = _type
			return _jsPDF
		},
		getFontList: function(){
			// TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
			return {
				HELVETICA:[NORMAL, BOLD, ITALIC, BOLD_ITALIC]
				, TIMES:[NORMAL, BOLD, ITALIC, BOLD_ITALIC]
				, COURIER:[NORMAL, BOLD, ITALIC, BOLD_ITALIC]
			}
		},
		setLineWidth: function(width) {
			out((width * k).toFixed(2) + ' w')
			return _jsPDF
		},
		setDrawColor: function(r,g,b) {
			var color
			if ((r===0 && g===0 && b===0) || (typeof g === 'undefined')) {
				color = f3(r/255) + ' G'
			} else {
				color = [f3(r/255), f3(g/255), f3(b/255), 'RG'].join(' ')
			}
			out(color)
			return _jsPDF
		},
		setFillColor: function(r,g,b) {
			var color
			if ((r===0 && g===0 && b===0) || (typeof g === 'undefined')) {
				color = f3(r/255) + ' g'
			} else {
				color = [f3(r/255), f3(g/255), f3(b/255), 'rg'].join(' ')
			}
			out(color)
			return _jsPDF
		},
		setTextColor: function(r,g,b) {
			if ((r===0 && g===0 && b===0) || (typeof g === 'undefined')) {
				textColor = f3(r/255) + ' g'
			} else {
				textColor = [f3(r/255), f3(g/255), f3(b/255), 'rg'].join(' ')
			}
			return _jsPDF
		},
		CapJoinStyles: {
			0:0, 'butt':0, 'but':0, 'bevel':0
			, 1:1, 'round': 1, 'rounded':1, 'circle':1
			, 2:2, 'projecting':2, 'project':2, 'square':2, 'milter':2
		},
		setLineCap: function(style, undef) {
			var id = this.CapJoinStyles[style]
			if (id === undef) {
				throw new Error("Line cap style of '"+style+"' is not recognized. See or extend .CapJoinStyles property for valid styles")
			}
			lineCapID = id
			out(id.toString(10) + ' J')
		},
		setLineJoin: function(style, undef) {
			var id = this.CapJoinStyles[style]
			if (id === undef) {
				throw new Error("Line join style of '"+style+"' is not recognized. See or extend .CapJoinStyles property for valid styles")
			}
			lineJoinID = id
			out(id.toString(10) + ' j')
		},
		base64encode: function(data) {
			// use native code if it's present
		    if (typeof btoa === 'function') return btoa(data)
		    
			/** @preserve
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
		},
		output: function(type, options) {
			var undef
			switch (type){
				case undef: return buildDocument() 
				case 'datauristring':
				case 'datauristrlng':
					return 'data:application/pdf;base64,' + this.base64encode(buildDocument())
				case 'datauri':
				case 'dataurl':
					document.location.href = 'data:application/pdf;base64,' + this.base64encode(buildDocument()); break;
			    default: throw new Error('Output type "'+type+'" is not supported.') 
			}
			// @TODO: Add different output options
		}
	}

	/////////////////////////////////////////
	// Initilisation if jsPDF Document object
	/////////////////////////////////////////
	
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

	// Add the first page automatically
	addFonts()
	activeFontKey = getFont(fontName, fontType)
	_addPage();	
	
	return _jsPDF
}