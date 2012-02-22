/** @license
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
	, lineWidth = 0.200025 // 2mm
	, pageHeight
	, pageWidth
	, k // Scale factor
	, fontNumber // @TODO: This is temp, replace with real font handling
	, documentProperties = {}
	, fontSize = 16 // Default font size
	, fontName = HELVETICA // Default font
	, fontType = NORMAL // Default type
	, textColor = "0 g"

	// Private functions
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
		out(sprintf('/MediaBox [0 0 %.2f %.2f]', wPt, hPt))
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
		for (var i = 0; i < fonts.length; i++) {
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
	, addFont = function(name, fontName, fontType) {
		fonts.push({key: 'F' + (fonts.length + 1), number: objectNumber, name: name, fontName: fontName, type: fontType})
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
		// fontNumber is currently the object number related to 'putFonts'
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
		out('/CreationDate (D:' + sprintf(
			'%02d%02d%02d%02d%02d%02d'
			, created.getFullYear()
			, (created.getMonth() + 1)
			, created.getDate()
			, created.getHours()
			, created.getMinutes()
			, created.getSeconds()
		) + ')')
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
		out(sprintf('%.2f w', (lineWidth * k)))
		// Set draw color
		out(drawColor)
	}
	, getFont = function() {
		for (var i = 0; i < fonts.length; i++) {
			if (fonts[i].fontName == fontName && fonts[i].type == fontType) {
				return fonts[i].key
			}
		}
		return 'F1'; // shouldn't happen
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
			out(sprintf('%010d 00000 n ', offsets[i]))
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
				getFont() + ' ' + fontSize + ' Tf\n' +
				fontSize + ' TL\n' +
				textColor + 
				sprintf('\n%.2f %.2f Td\n(', x * k, (pageHeight - y) * k) + 
				str +
				') Tj\nET'
			)
			return _jsPDF
		},
		line: function(x1, y1, x2, y2) {
			var str = sprintf('%.2f %.2f m %.2f %.2f l S',x1 * k, (pageHeight - y1) * k, x2 * k, (pageHeight - y2) * k)
			out(str)
			return _jsPDF
		},
		rect: function(x, y, w, h, style) {
			var op = 'S'
			if (style === 'F') {
				op = 'f'
			} else if (style === 'FD' || style === 'DF') {
				op = 'B'
			}
			out(sprintf('%.2f %.2f %.2f %.2f re %s', x * k, (pageHeight - y) * k, w * k, -h * k, op))
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
			var ly = 4/3*(Math.SQRT2-1)*ry
			out(sprintf('%.2f %.2f m %.2f %.2f %.2f %.2f %.2f %.2f c',
			        (x+rx)*k, (pageHeight-y)*k, 
			        (x+rx)*k, (pageHeight-(y-ly))*k, 
			        (x+lx)*k, (pageHeight-(y-ry))*k, 
			        x*k, (pageHeight-(y-ry))*k))
			out(sprintf('%.2f %.2f %.2f %.2f %.2f %.2f c',
			        (x-lx)*k, (pageHeight-(y-ry))*k, 
			        (x-rx)*k, (pageHeight-(y-ly))*k, 
			        (x-rx)*k, (pageHeight-y)*k));			
			out(sprintf('%.2f %.2f %.2f %.2f %.2f %.2f c',
			        (x-rx)*k, (pageHeight-(y+ly))*k, 
			        (x-lx)*k, (pageHeight-(y+ry))*k, 
			        x*k, (pageHeight-(y+ry))*k))
			out(sprintf('%.2f %.2f %.2f %.2f %.2f %.2f c %s',
			        (x+lx)*k, (pageHeight-(y+ry))*k, 
			        (x+rx)*k, (pageHeight-(y+ly))*k, 
			        (x+rx)*k, (pageHeight-y)*k, 
			        op))
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
		output: function(type, options) {
			if(type == undefined) {
				return buildDocument()
			}
			else if(type == 'datauri') {
				document.location.href = 'data:application/pdf;base64,' + Base64.encode(buildDocument())
			}
			// @TODO: Add different output options
		},
		setFontSize: function(size) {
			fontSize = size
			return _jsPDF
		},
		setFont: function(name) {
			switch(name.toLowerCase()) {
				case HELVETICA:
				case TIMES:
				case COURIER:
					fontName = name.toLowerCase()
					break
				default:
					// do nothing
					break
			}
			return _jsPDF
		},
		setFontType: function(type) {
			switch(type.toLowerCase()) {
				case NORMAL:
				case BOLD:
				case ITALIC:
				case BOLD_ITALIC:
					fontType = type.toLowerCase()
					break
				default:
					// do nothing
					break
			}
			return _jsPDF
		},
		setLineWidth: function(width) {
			out(sprintf('%.2f w', (width * k)))
			return _jsPDF
		},
		setDrawColor: function(r,g,b) {
			var color
			if ((r===0 && g===0 && b===0) || (typeof g === 'undefined')) {
				color = sprintf('%.3f G', r/255)
			} else {
				color = sprintf('%.3f %.3f %.3f RG', r/255, g/255, b/255)
			}
			out(color)
			return _jsPDF
		},
		setFillColor: function(r,g,b) {
			var color
			if ((r===0 && g===0 && b===0) || (typeof g === 'undefined')) {
				color = sprintf('%.3f g', r/255)
			} else {
				color = sprintf('%.3f %.3f %.3f rg', r/255, g/255, b/255)
			}
			out(color)
			return _jsPDF
		},
		setTextColor: function(r,g,b) {
			if ((r===0 && g===0 && b===0) || (typeof g === 'undefined')) {
				textColor = sprintf('%.3f g', r/255)
			} else {
				textColor = sprintf('%.3f %.3f %.3f rg', r/255, g/255, b/255)
			}
			return _jsPDF
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
	_addPage();	
	
	return _jsPDF
}