/***********************************************
* koGrid JavaScript Library
* Authors: https://github.com/ericmbarnard/koGrid/blob/master/README.md
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
***********************************************/

define(["./adler32cs"], function (adler32cs) {

/***********************************************
* FILE: jspdf.js
***********************************************/
/** @preserve
 * jsPDF - PDF Document creation from JavaScript
 * Version 1.0.0-trunk Built on ${buildDate}
 * Commit ${commitID}
 *
 * Copyright (c) 2010-2014 James Hall, https://github.com/MrRio/jsPDF
 *               2010 Aaron Spike, https://github.com/acspike
 *               2012 Willow Systems Corporation, willow-systems.com
 *               2012 Pablo Hess, https://github.com/pablohess
 *               2012 Florian Jenett, https://github.com/fjenett
 *               2013 Warren Weckesser, https://github.com/warrenweckesser
 *               2013 Youssef Beddad, https://github.com/lifof
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2013 Stefan Slonevskiy, https://github.com/stefslon
 *               2013 Jeremy Morel, https://github.com/jmorel
 *               2013 Christoph Hartmann, https://github.com/chris-rock
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Makes, https://github.com/dollaruw
 *               2014 Diego Casorran, https://github.com/diegocr
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
 *
 * Contributor(s):
 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
 *    kim3er, mfo, alnorth,
 */

/**
 * Creates new jsPDF document object instance.
 *
 * @class
 * @param orientation One of "portrait" or "landscape" (or shortcuts "p" (Default), "l")
 * @param unit        Measurement unit to be used when coordinates are specified.
 *                    One of "pt" (points), "mm" (Default), "cm", "in"
 * @param format      One of 'pageFormats' as shown below, default: a4
 * @returns {jsPDF}
 * @name jsPDF
 */
var jsPDF = (function(global) {
	'use strict';
	var pdfVersion = '1.3',
		pageFormats = { // Size in pt of various paper formats
			'a0'  : [2383.94, 3370.39], 'a1'  : [1683.78, 2383.94],
			'a2'  : [1190.55, 1683.78], 'a3'  : [ 841.89, 1190.55],
			'a4'  : [ 595.28,  841.89], 'a5'  : [ 419.53,  595.28],
			'a6'  : [ 297.64,  419.53], 'a7'  : [ 209.76,  297.64],
			'a8'  : [ 147.40,  209.76], 'a9'  : [ 104.88,  147.40],
			'a10' : [  73.70,  104.88], 'b0'  : [2834.65, 4008.19],
			'b1'  : [2004.09, 2834.65], 'b2'  : [1417.32, 2004.09],
			'b3'  : [1000.63, 1417.32], 'b4'  : [ 708.66, 1000.63],
			'b5'  : [ 498.90,  708.66], 'b6'  : [ 354.33,  498.90],
			'b7'  : [ 249.45,  354.33], 'b8'  : [ 175.75,  249.45],
			'b9'  : [ 124.72,  175.75], 'b10' : [  87.87,  124.72],
			'c0'  : [2599.37, 3676.54], 'c1'  : [1836.85, 2599.37],
			'c2'  : [1298.27, 1836.85], 'c3'  : [ 918.43, 1298.27],
			'c4'  : [ 649.13,  918.43], 'c5'  : [ 459.21,  649.13],
			'c6'  : [ 323.15,  459.21], 'c7'  : [ 229.61,  323.15],
			'c8'  : [ 161.57,  229.61], 'c9'  : [ 113.39,  161.57],
			'c10' : [  79.37,  113.39], 'dl'  : [ 311.81,  623.62],
			'letter'            : [612,   792],
			'government-letter' : [576,   756],
			'legal'             : [612,  1008],
			'junior-legal'      : [576,   360],
			'ledger'            : [1224,  792],
			'tabloid'           : [792,  1224]
		};

	/**
	 * jsPDF's Internal PubSub Implementation.
	 * See mrrio.github.io/jsPDF/doc/symbols/PubSub.html
	 * Backward compatible rewritten on 2014 by
	 * Diego Casorran, https://github.com/diegocr
	 *
	 * @class
	 * @name PubSub
	 */
	function PubSub(context) {
		var topics = {};

		this.subscribe = function(topic, callback, once) {
			if(typeof callback !== 'function') {
				return false;
			}

			if(!topics.hasOwnProperty(topic)) {
				topics[topic] = {};
			}

			var id = Math.random().toString(35);
			topics[topic][id] = [callback,!!once];

			return id;
		};

		this.unsubscribe = function(token) {
			for(var topic in topics) {
				if(topics[topic][token]) {
					delete topics[topic][token];
					return true;
				}
			}
			return false;
		};

		this.publish = function(topic) {
			if(topics.hasOwnProperty(topic)) {
				var args = Array.prototype.slice.call(arguments, 1), idr = [];

				for(var id in topics[topic]) {
					var sub = topics[topic][id];
					try {
						sub[0].apply(context, args);
					} catch(ex) {
						if(global.console) {
							console.error('jsPDF PubSub Error', ex.message, ex);
						}
					}
					if(sub[1]) idr.push(id);
				}
				if(idr.length) idr.forEach(this.unsubscribe);
			}
		};
	}

	/**
	 * @constructor
	 * @private
	 */
	function jsPDF(orientation, unit, format, compressPdf) {
		var options = {};

		if (typeof orientation === 'object') {
			options = orientation;

			orientation = options.orientation;
			unit = options.unit || unit;
			format = options.format || format;
			compressPdf = options.compress || options.compressPdf || compressPdf;
		}

		// Default options
		unit        = unit || 'mm';
		format      = format || 'a4';
		orientation = ('' + (orientation || 'P')).toLowerCase();

		var format_as_string = ('' + format).toLowerCase(),
			compress = !!compressPdf && typeof Uint8Array === 'function',
			textColor            = options.textColor  || '0 g',
			drawColor            = options.drawColor  || '0 G',
			activeFontSize       = options.fontSize   || 16,
			lineHeightProportion = options.lineHeight || 1.15,
			lineWidth            = options.lineWidth  || 0.200025, // 2mm
			objectNumber =  2,  // 'n' Current object number
			outToPages   = !1,  // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
			offsets      = [],  // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
			fonts        = {},  // collection of font objects, where key is fontKey - a dynamically created label for a given font.
			fontmap      = {},  // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
			activeFontKey,      // will be string representing the KEY of the font as combination of fontName + fontStyle
			k,                  // Scale factor
			tmp,
			page = 0,
			pages = [],
			content = [],
			lineCapID = 0,
			lineJoinID = 0,
			content_length = 0,
			pageWidth,
			pageHeight,
			documentProperties = {
				'title'    : '',
				'subject'  : '',
				'author'   : '',
				'keywords' : '',
				'creator'  : ''
			},
			API = {},
			events = new PubSub(API),

		/////////////////////
		// Private functions
		/////////////////////
		f2 = function(number) {
			return number.toFixed(2); // Ie, %.2f
		},
		f3 = function(number) {
			return number.toFixed(3); // Ie, %.3f
		},
		padd2 = function(number) {
			return ('0' + parseInt(number)).slice(-2);
		},
		out = function(string) {
			if (outToPages) {
				/* set by beginPage */
				pages[page].push(string);
			} else {
				// +1 for '\n' that will be used to join 'content'
				content_length += string.length + 1;
				content.push(string);
			}
		},
		newObject = function() {
			// Begin a new object
			objectNumber++;
			offsets[objectNumber] = content_length;
			out(objectNumber + ' 0 obj');
			return objectNumber;
		},
		putStream = function(str) {
			out('stream');
			out(str);
			out('endstream');
		},
		putPages = function() {
			var n,p,arr,i,deflater,adler32,wPt = pageWidth * k, hPt = pageHeight * k;

			// outToPages = false as set in endDocument(). out() writes to content.

			for (n = 1; n <= page; n++) {
				newObject();
				out('<</Type /Page');
				out('/Parent 1 0 R');
				out('/Resources 2 0 R');
				out('/Contents ' + (objectNumber + 1) + ' 0 R>>');
				out('endobj');

				// Page content
				p = pages[n].join('\n');
				newObject();
				if (compress) {
					arr = [];
					i = p.length;
					while(i--) {
						arr[i] = p.charCodeAt(i);
					}
					adler32 = adler32cs.from(p);
					deflater = new Deflater(6);
					deflater.append(new Uint8Array(arr));
					p = deflater.flush();
					arr = [
						new Uint8Array([120, 156]),
						new Uint8Array(p),
						new Uint8Array([adler32 & 0xFF, (adler32 >> 8) & 0xFF, (adler32 >> 16) & 0xFF, (adler32 >> 24) & 0xFF])
					];
					p = '';
					for (i in arr) {
						if (arr.hasOwnProperty(i)) {
							p += String.fromCharCode.apply(null, arr[i]);
						}
					}
					out('<</Length ' + p.length + ' /Filter [/FlateDecode]>>');
				} else {
					out('<</Length ' + p.length + '>>');
				}
				putStream(p);
				out('endobj');
			}
			offsets[1] = content_length;
			out('1 0 obj');
			out('<</Type /Pages');
			var kids = '/Kids [';
			for (i = 0; i < page; i++) {
				kids += (3 + 2 * i) + ' 0 R ';
			}
			out(kids + ']');
			out('/Count ' + page);
			out('/MediaBox [0 0 ' + f2(wPt) + ' ' + f2(hPt) + ']');
			out('>>');
			out('endobj');
		},
		putFont = function(font) {
			font.objectNumber = newObject();
			out('<</BaseFont/' + font.PostScriptName + '/Type/Font');
			if (typeof font.encoding === 'string') {
				out('/Encoding/' + font.encoding);
			}
			out('/Subtype/Type1>>');
			out('endobj');
		},
		putFonts = function() {
			for (var fontKey in fonts) {
				if (fonts.hasOwnProperty(fontKey)) {
					putFont(fonts[fontKey]);
				}
			}
		},
		putXobjectDict = function() {
			// Loop through images, or other data objects
			events.publish('putXobjectDict');
		},
		putResourceDictionary = function() {
			out('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]');
			out('/Font <<');

			// Do this for each font, the '1' bit is the index of the font
			for (var fontKey in fonts) {
				if (fonts.hasOwnProperty(fontKey)) {
					out('/' + fontKey + ' ' + fonts[fontKey].objectNumber + ' 0 R');
				}
			}
			out('>>');
			out('/XObject <<');
			putXobjectDict();
			out('>>');
		},
		putResources = function() {
			putFonts();
			events.publish('putResources');
			// Resource dictionary
			offsets[2] = content_length;
			out('2 0 obj');
			out('<<');
			putResourceDictionary();
			out('>>');
			out('endobj');
			events.publish('postPutResources');
		},
		addToFontDictionary = function(fontKey, fontName, fontStyle) {
			// this is mapping structure for quick font key lookup.
			// returns the KEY of the font (ex: "F1") for a given
			// pair of font name and type (ex: "Arial". "Italic")
			if (!fontmap.hasOwnProperty(fontName)) {
				fontmap[fontName] = {};
			}
			fontmap[fontName][fontStyle] = fontKey;
		},
		/**
		 * FontObject describes a particular font as member of an instnace of jsPDF
		 *
		 * It's a collection of properties like 'id' (to be used in PDF stream),
		 * 'fontName' (font's family name), 'fontStyle' (font's style variant label)
		 *
		 * @class
		 * @public
		 * @property id {String} PDF-document-instance-specific label assinged to the font.
		 * @property PostScriptName {String} PDF specification full name for the font
		 * @property encoding {Object} Encoding_name-to-Font_metrics_object mapping.
		 * @name FontObject
		 */
		addFont = function(PostScriptName, fontName, fontStyle, encoding) {
			var fontKey = 'F' + (Object.keys(fonts).length + 1).toString(10),
			// This is FontObject
			font = fonts[fontKey] = {
				'id'             : fontKey,
				'PostScriptName' : PostScriptName,
				'fontName'       : fontName,
				'fontStyle'      : fontStyle,
				'encoding'       : encoding,
				'metadata'       : {}
			};
			addToFontDictionary(fontKey, fontName, fontStyle);
			events.publish('addFont', font);

			return fontKey;
		},
		addFonts = function() {

			var HELVETICA     = "helvetica",
				TIMES         = "times",
				COURIER       = "courier",
				NORMAL        = "normal",
				BOLD          = "bold",
				ITALIC        = "italic",
				BOLD_ITALIC   = "bolditalic",
				encoding      = 'StandardEncoding',
				standardFonts = [
					['Helvetica', HELVETICA, NORMAL],
					['Helvetica-Bold', HELVETICA, BOLD],
					['Helvetica-Oblique', HELVETICA, ITALIC],
					['Helvetica-BoldOblique', HELVETICA, BOLD_ITALIC],
					['Courier', COURIER, NORMAL],
					['Courier-Bold', COURIER, BOLD],
					['Courier-Oblique', COURIER, ITALIC],
					['Courier-BoldOblique', COURIER, BOLD_ITALIC],
					['Times-Roman', TIMES, NORMAL],
					['Times-Bold', TIMES, BOLD],
					['Times-Italic', TIMES, ITALIC],
					['Times-BoldItalic', TIMES, BOLD_ITALIC]
				];

			for (var i = 0, l = standardFonts.length; i < l; i++) {
				var fontKey = addFont(
						standardFonts[i][0],
						standardFonts[i][1],
						standardFonts[i][2],
						encoding);

				// adding aliases for standard fonts, this time matching the capitalization
				var parts = standardFonts[i][0].split('-');
				addToFontDictionary(fontKey, parts[0], parts[1] || '');
			}
			events.publish('addFonts', { fonts : fonts, dictionary : fontmap });
		},
		SAFE = function(fn) {
			fn.foo = function() {
				try {
					return fn.apply(this, arguments);
				} catch (e) {
					var m = "Error in function " + this + "." + fn.name + ": " + e.message;
					if(global.console) {
						var stack = (e.stack || new Error().stack || '').split("\n");
						console.log(m, stack.map(function(s) {
							return s.replace(/^(.*@).+\//,'$1');
						}).join("\n"), e);
						if(global.alert) alert(m);
					} else {
						throw new Error(m);
					}
				}
			};
			fn.foo.bar = fn;
			return fn.foo;
		},
		to8bitStream = function(text, flags) {
		/**
		 * PDF 1.3 spec:
		 * "For text strings encoded in Unicode, the first two bytes must be 254 followed by
		 * 255, representing the Unicode byte order marker, U+FEFF. (This sequence conflicts
		 * with the PDFDocEncoding character sequence thorn ydieresis, which is unlikely
		 * to be a meaningful beginning of a word or phrase.) The remainder of the
		 * string consists of Unicode character codes, according to the UTF-16 encoding
		 * specified in the Unicode standard, version 2.0. Commonly used Unicode values
		 * are represented as 2 bytes per character, with the high-order byte appearing first
		 * in the string."
		 *
		 * In other words, if there are chars in a string with char code above 255, we
		 * recode the string to UCS2 BE - string doubles in length and BOM is prepended.
		 *
		 * HOWEVER!
		 * Actual *content* (body) text (as opposed to strings used in document properties etc)
		 * does NOT expect BOM. There, it is treated as a literal GID (Glyph ID)
		 *
		 * Because of Adobe's focus on "you subset your fonts!" you are not supposed to have
		 * a font that maps directly Unicode (UCS2 / UTF16BE) code to font GID, but you could
		 * fudge it with "Identity-H" encoding and custom CIDtoGID map that mimics Unicode
		 * code page. There, however, all characters in the stream are treated as GIDs,
		 * including BOM, which is the reason we need to skip BOM in content text (i.e. that
		 * that is tied to a font).
		 *
		 * To signal this "special" PDFEscape / to8bitStream handling mode,
		 * API.text() function sets (unless you overwrite it with manual values
		 * given to API.text(.., flags) )
		 * flags.autoencode = true
		 * flags.noBOM = true
		 *
		 * ===================================================================================
		 * `flags` properties relied upon:
		 *   .sourceEncoding = string with encoding label.
		 *                     "Unicode" by default. = encoding of the incoming text.
		 *                     pass some non-existing encoding name
		 *                     (ex: 'Do not touch my strings! I know what I am doing.')
		 *                     to make encoding code skip the encoding step.
		 *   .outputEncoding = Either valid PDF encoding name
		 *                     (must be supported by jsPDF font metrics, otherwise no encoding)
		 *                     or a JS object, where key = sourceCharCode, value = outputCharCode
		 *                     missing keys will be treated as: sourceCharCode === outputCharCode
		 *   .noBOM
		 *       See comment higher above for explanation for why this is important
		 *   .autoencode
		 *       See comment higher above for explanation for why this is important
		 */

			var i,l,sourceEncoding,encodingBlock,outputEncoding,newtext,isUnicode,ch,bch;

			flags = flags || {};
			sourceEncoding = flags.sourceEncoding || 'Unicode';
			outputEncoding = flags.outputEncoding;

			// This 'encoding' section relies on font metrics format
			// attached to font objects by, among others,
			// "Willow Systems' standard_font_metrics plugin"
			// see jspdf.plugin.standard_font_metrics.js for format
			// of the font.metadata.encoding Object.
			// It should be something like
			//   .encoding = {'codePages':['WinANSI....'], 'WinANSI...':{code:code, ...}}
			//   .widths = {0:width, code:width, ..., 'fof':divisor}
			//   .kerning = {code:{previous_char_code:shift, ..., 'fof':-divisor},...}
			if ((flags.autoencode || outputEncoding) &&
				fonts[activeFontKey].metadata &&
				fonts[activeFontKey].metadata[sourceEncoding] &&
				fonts[activeFontKey].metadata[sourceEncoding].encoding) {
				encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding;

				// each font has default encoding. Some have it clearly defined.
				if (!outputEncoding && fonts[activeFontKey].encoding) {
					outputEncoding = fonts[activeFontKey].encoding;
				}

				// Hmmm, the above did not work? Let's try again, in different place.
				if (!outputEncoding && encodingBlock.codePages) {
					outputEncoding = encodingBlock.codePages[0]; // let's say, first one is the default
				}

				if (typeof outputEncoding === 'string') {
					outputEncoding = encodingBlock[outputEncoding];
				}
				// we want output encoding to be a JS Object, where
				// key = sourceEncoding's character code and
				// value = outputEncoding's character code.
				if (outputEncoding) {
					isUnicode = false;
					newtext = [];
					for (i = 0, l = text.length; i < l; i++) {
						ch = outputEncoding[text.charCodeAt(i)];
						if (ch) {
							newtext.push(
								String.fromCharCode(ch));
						} else {
							newtext.push(
								text[i]);
						}

						// since we are looping over chars anyway, might as well
						// check for residual unicodeness
						if (newtext[i].charCodeAt(0) >> 8) {
							/* more than 255 */
							isUnicode = true;
						}
					}
					text = newtext.join('');
				}
			}

			i = text.length;
			// isUnicode may be set to false above. Hence the triple-equal to undefined
			while (isUnicode === undefined && i !== 0) {
				if (text.charCodeAt(i - 1) >> 8) {
					/* more than 255 */
					isUnicode = true;
				}
				i--;
			}
			if (!isUnicode) {
				return text;
			}

			newtext = flags.noBOM ? [] : [254, 255];
			for (i = 0, l = text.length; i < l; i++) {
				ch = text.charCodeAt(i);
				bch = ch >> 8; // divide by 256
				if (bch >> 8) {
					/* something left after dividing by 256 second time */
					throw new Error("Character at position " + i.toString(10) + " of string '"
						+ text + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
				}
				newtext.push(bch);
				newtext.push(ch - (bch << 8));
			}
			return String.fromCharCode.apply(undefined, newtext);
		},
		pdfEscape = function(text, flags) {
			/**
			 * Replace '/', '(', and ')' with pdf-safe versions
			 *
			 * Doing to8bitStream does NOT make this PDF display unicode text. For that
			 * we also need to reference a unicode font and embed it - royal pain in the rear.
			 *
			 * There is still a benefit to to8bitStream - PDF simply cannot handle 16bit chars,
			 * which JavaScript Strings are happy to provide. So, while we still cannot display
			 * 2-byte characters property, at least CONDITIONALLY converting (entire string containing)
			 * 16bit chars to (USC-2-BE) 2-bytes per char + BOM streams we ensure that entire PDF
			 * is still parseable.
			 * This will allow immediate support for unicode in document properties strings.
			 */
			return to8bitStream(text, flags).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
		},
		putInfo = function() {
			out('/Producer (jsPDF ' + jsPDF.version + ')');
			for(var key in documentProperties) {
				if(documentProperties.hasOwnProperty(key)) {
					out('/'+key.substr(0,1).toUpperCase() + key.substr(1)
						+' (' + pdfEscape(documentProperties[key]) + ')');
				}
			}
			var created = new Date();
			out(['/CreationDate (D:',
					created.getFullYear(),
					padd2(created.getMonth() + 1),
					padd2(created.getDate()),
					padd2(created.getHours()),
					padd2(created.getMinutes()),
					padd2(created.getSeconds()), ')'].join(''));
		},
		putCatalog = function() {
			out('/Type /Catalog');
			out('/Pages 1 0 R');
			// @TODO: Add zoom and layout modes
			out('/OpenAction [3 0 R /FitH null]');
			out('/PageLayout /OneColumn');
			events.publish('putCatalog');
		},
		putTrailer = function() {
			out('/Size ' + (objectNumber + 1));
			out('/Root ' + objectNumber + ' 0 R');
			out('/Info ' + (objectNumber - 1) + ' 0 R');
		},
		beginPage = function() {
			page++;
			// Do dimension stuff
			outToPages = true;
			pages[page] = [];
		},
		_addPage = function() {
			beginPage();
			// Set line width
			out(f2(lineWidth * k) + ' w');
			// Set draw color
			out(drawColor);
			// resurrecting non-default line caps, joins
			if (lineCapID !== 0) {
				out(lineCapID.toString(10) + ' J');
			}
			if (lineJoinID !== 0) {
				out(lineJoinID.toString(10) + ' j');
			}
			events.publish('addPage', { pageNumber : page });
		},
		/**
		 * Returns a document-specific font key - a label assigned to a
		 * font name + font type combination at the time the font was added
		 * to the font inventory.
		 *
		 * Font key is used as label for the desired font for a block of text
		 * to be added to the PDF document stream.
		 * @private
		 * @function
		 * @param fontName {String} can be undefined on "falthy" to indicate "use current"
		 * @param fontStyle {String} can be undefined on "falthy" to indicate "use current"
		 * @returns {String} Font key.
		 */
		getFont = function(fontName, fontStyle) {
			var key;

			fontName  = fontName  !== undefined ? fontName  : fonts[activeFontKey].fontName;
			fontStyle = fontStyle !== undefined ? fontStyle : fonts[activeFontKey].fontStyle;

			try {
			 // get a string like 'F3' - the KEY corresponding tot he font + type combination.
				key = fontmap[fontName][fontStyle];
			} catch (e) {}

			if (!key) {
				throw new Error("Unable to look up font label for font '" + fontName + "', '"
					+ fontStyle + "'. Refer to getFontList() for available fonts.");
			}
			return key;
		},
		buildDocument = function() {

			outToPages = false; // switches out() to content
			objectNumber = 2;
			content = [];
			offsets = [];

			// putHeader()
			out('%PDF-' + pdfVersion);

			putPages();

			putResources();

			// Info
			newObject();
			out('<<');
			putInfo();
			out('>>');
			out('endobj');

			// Catalog
			newObject();
			out('<<');
			putCatalog();
			out('>>');
			out('endobj');

			// Cross-ref
			var o = content_length, i, p = "0000000000";
			out('xref');
			out('0 ' + (objectNumber + 1));
			out(p+' 65535 f ');
			for (i = 1; i <= objectNumber; i++) {
				out((p + offsets[i]).slice(-10) + ' 00000 n ');
			}
			// Trailer
			out('trailer');
			out('<<');
			putTrailer();
			out('>>');
			out('startxref');
			out(o);
			out('%%EOF');

			outToPages = true;

			return content.join('\n');
		},
		getStyle = function(style) {
			// see path-painting operators in PDF spec
			var op = 'S'; // stroke
			if (style === 'F') {
				op = 'f'; // fill
			} else if (style === 'FD' || style === 'DF') {
				op = 'B'; // both
			} else if (style === 'f' || style === 'f*' || style === 'B' || style === 'B*') {
				/* 
				Allow direct use of these PDF path-painting operators:
				- f	fill using nonzero winding number rule
				- f*	fill using even-odd rule
				- B	fill then stroke with fill using non-zero winding number rule
				- B*	fill then stroke with fill using even-odd rule
				*/
				op = style;
			}
			return op;
		},
		getBlob = function() {
			var data = buildDocument(), len = data.length,
				ab = new ArrayBuffer(len), u8 = new Uint8Array(ab);

			while(len--) u8[len] = data.charCodeAt(len);
			return new Blob([ab], { type : "application/pdf" });
		},
		/**
		 * Generates the PDF document.
		 *
		 * If `type` argument is undefined, output is raw body of resulting PDF returned as a string.
		 *
		 * @param {String} type A string identifying one of the possible output types.
		 * @param {Object} options An object providing some additional signalling to PDF generator.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name output
		 */
		output = SAFE(function(type, options) {
			switch (type) {
				case undefined:
					return buildDocument();
				case 'save':
					if (navigator.getUserMedia) {
						if (global.URL === undefined
						|| global.URL.createObjectURL === undefined) {
							return API.output('dataurlnewwindow');
						}
					}
					saveAs(getBlob(), options);
					if(typeof saveAs.unload === 'function') {
						saveAs.unload();
					}
					break;
				case 'blob':
					return getBlob();
				case 'datauristring':
				case 'dataurlstring':
					return 'data:application/pdf;base64,' + btoa(buildDocument());
				case 'datauri':
				case 'dataurl':
					global.document.location.href = 'data:application/pdf;base64,' + btoa(buildDocument());
					break;
				case 'dataurlnewwindow':
					global.open('data:application/pdf;base64,' + btoa(buildDocument()));
					break;
				default:
					throw new Error('Output type "' + type + '" is not supported.');
			}
			// @TODO: Add different output options
		});

		if (unit === 'pt') {
			k = 1;
		} else if (unit === 'mm') {
			k = 72 / 25.4;
		} else if (unit === 'cm') {
			k = 72 / 2.54;
		} else if (unit === 'in') {
			k = 72;
		} else {
			throw('Invalid unit: ' + unit);
		}

		// Dimensions are stored as user units and converted to points on output
		if (pageFormats.hasOwnProperty(format_as_string)) {
			pageHeight = pageFormats[format_as_string][1] / k;
			pageWidth = pageFormats[format_as_string][0] / k;
		} else {
			try {
				pageHeight = format[1];
				pageWidth = format[0];
			} catch (err) {
				throw new Error('Invalid format: ' + format);
			}
		}

		if (orientation === 'p' || orientation === 'portrait') {
			orientation = 'p';
			if (pageWidth > pageHeight) {
				tmp = pageWidth;
				pageWidth = pageHeight;
				pageHeight = tmp;
			}
		} else if (orientation === 'l' || orientation === 'landscape') {
			orientation = 'l';
			if (pageHeight > pageWidth) {
				tmp = pageWidth;
				pageWidth = pageHeight;
				pageHeight = tmp;
			}
		} else {
			throw('Invalid orientation: ' + orientation);
		}

		//---------------------------------------
		// Public API

		/**
		 * Object exposing internal API to plugins
		 * @public
		 */
		API.internal = {
			'pdfEscape' : pdfEscape,
			'getStyle' : getStyle,
			/**
			 * Returns {FontObject} describing a particular font.
			 * @public
			 * @function
			 * @param fontName {String} (Optional) Font's family name
			 * @param fontStyle {String} (Optional) Font's style variation name (Example:"Italic")
			 * @returns {FontObject}
			 */
			'getFont' : function() {
				return fonts[getFont.apply(API, arguments)];
			},
			'getFontSize' : function() {
				return activeFontSize;
			},
			'getLineHeight' : function() {
				return activeFontSize * lineHeightProportion;
			},
			'write' : function(string1 /*, string2, string3, etc */) {
				out(arguments.length === 1 ? string1 : Array.prototype.join.call(arguments, ' '));
			},
			'getCoordinateString' : function(value) {
				return f2(value * k);
			},
			'getVerticalCoordinateString' : function(value) {
				return f2((pageHeight - value) * k);
			},
			'collections' : {},
			'newObject' : newObject,
			'putStream' : putStream,
			'events' : events,
			// ratio that you use in multiplication of a given "size" number to arrive to 'point'
			// units of measurement.
			// scaleFactor is set at initialization of the document and calculated against the stated
			// default measurement units for the document.
			// If default is "mm", k is the number that will turn number in 'mm' into 'points' number.
			// through multiplication.
			'scaleFactor' : k,
			'pageSize' : {
				'width' : pageWidth,
				'height' : pageHeight
			},
			'output' : function(type, options) {
				return output(type, options);
			},
			'getNumberOfPages' : function() {
				return pages.length - 1;
			},
			'pages' : pages
		};

		/**
		 * Adds (and transfers the focus to) new page to the PDF document.
		 * @function
		 * @returns {jsPDF}
		 *
		 * @methodOf jsPDF#
		 * @name addPage
		 */
		API.addPage = function() {
			_addPage();
			return this;
		};

		/**
		 * Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
		 *
		 * @function
		 * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Object} flags Collection of settings signalling how the text must be encoded. Defaults are sane. If you think you want to pass some flags, you likely can read the source.
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name text
		 */
		API.text = function(text, x, y, flags, angle) {
			/**
			 * Inserts something like this into PDF
			 *   BT
			 *    /F1 16 Tf  % Font name + size
			 *    16 TL % How many units down for next line in multiline text
			 *    0 g % color
			 *    28.35 813.54 Td % position
			 *    (line one) Tj
			 *    T* (line two) Tj
			 *    T* (line three) Tj
			 *   ET
			 */

			// Pre-August-2012 the order of arguments was function(x, y, text, flags)
			// in effort to make all calls have similar signature like
			//   function(data, coordinates... , miscellaneous)
			// this method had its args flipped.
			// code below allows backward compatibility with old arg order.
			if (typeof text === 'number') {
				tmp = y;
				y = x;
				x = text;
				text = tmp;
			}

			// If there are any newlines in text, we assume
			// the user wanted to print multiple lines, so break the
			// text up into an array.  If the text is already an array,
			// we assume the user knows what they are doing.
			if (typeof text === 'string' && text.match(/[\n\r]/)) {
				text = text.split(/\r\n|\r|\n/g);
			}
			if (typeof flags === 'number') {
				angle = flags;
				flags = null;
			}
			var xtra = '',mode = 'Td';
			if (angle) {
				angle *= (Math.PI / 180);
				var c = Math.cos(angle),
				s = Math.sin(angle);
				xtra = [f2(c), f2(s), f2(s * -1), f2(c), ''].join(" ");
				mode = 'Tm';
			}
			flags = flags || {};
			if (!('noBOM' in flags))
				flags.noBOM = true;
			if (!('autoencode' in flags))
				flags.autoencode = true;

			if (typeof text === 'string') {
				text = pdfEscape(text, flags);
			} else if (text instanceof Array) {
				// we don't want to destroy  original text array, so cloning it
				var sa = text.concat(), da = [], len = sa.length;
				// we do array.join('text that must not be PDFescaped")
				// thus, pdfEscape each component separately
				while (len--) {
					da.push(pdfEscape(sa.shift(), flags));
				}
				text = da.join(") Tj\nT* (");
			} else {
				throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
			}
			// Using "'" ("go next line and render text" mark) would save space but would complicate our rendering code, templates

			// BT .. ET does NOT have default settings for Tf. You must state that explicitely every time for BT .. ET
			// if you want text transformation matrix (+ multiline) to work reliably (which reads sizes of things from font declarations)
			// Thus, there is NO useful, *reliable* concept of "default" font for a page.
			// The fact that "default" (reuse font used before) font worked before in basic cases is an accident
			// - readers dealing smartly with brokenness of jsPDF's markup.
			out(
				'BT\n/' +
				activeFontKey + ' ' + activeFontSize + ' Tf\n' +     // font face, style, size
				(activeFontSize * lineHeightProportion) + ' TL\n' +  // line spacing
				textColor +
				'\n' + xtra + f2(x * k) + ' ' + f2((pageHeight - y) * k) + ' ' + mode + '\n(' +
				text +
				') Tj\nET');
			return this;
		};

		API.line = function(x1, y1, x2, y2) {
			out(
				f2(x1 * k) + ' ' + f2((pageHeight - y1) * k) + ' m ' +
				f2(x2 * k) + ' ' + f2((pageHeight - y2) * k) + ' l S');
			return this;
		};

		/**
		 * Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
		 * All data points in `lines` are relative to last line origin.
		 * `x`, `y` become x1,y1 for first line / curve in the set.
		 * For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
		 * For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.
		 *
		 * @example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, 10) // line, line, bezier curve, line
		 * @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @param {Boolean} closed If true, the path is closed with a straight line from the end of the last curve to the starting point.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name lines
		 */
		API.lines = function(lines, x, y, scale, style, closed) {
			var scalex,scaley,i,l,leg,x2,y2,x3,y3,x4,y4;

			// Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
			// in effort to make all calls have similar signature like
			//   function(content, coordinateX, coordinateY , miscellaneous)
			// this method had its args flipped.
			// code below allows backward compatibility with old arg order.
			if (typeof lines === 'number') {
				tmp = y;
				y = x;
				x = lines;
				lines = tmp;
			}

			scale = scale || [1, 1];

			// starting point
			out(f3(x * k) + ' ' + f3((pageHeight - y) * k) + ' m ');

			scalex = scale[0];
			scaley = scale[1];
			l = lines.length;
			//, x2, y2 // bezier only. In page default measurement "units", *after* scaling
			//, x3, y3 // bezier only. In page default measurement "units", *after* scaling
			// ending point for all, lines and bezier. . In page default measurement "units", *after* scaling
			x4 = x; // last / ending point = starting point for first item.
			y4 = y; // last / ending point = starting point for first item.

			for (i = 0; i < l; i++) {
				leg = lines[i];
				if (leg.length === 2) {
					// simple line
					x4 = leg[0] * scalex + x4; // here last x4 was prior ending point
					y4 = leg[1] * scaley + y4; // here last y4 was prior ending point
					out(f3(x4 * k) + ' ' + f3((pageHeight - y4) * k) + ' l');
				} else {
					// bezier curve
					x2 = leg[0] * scalex + x4; // here last x4 is prior ending point
					y2 = leg[1] * scaley + y4; // here last y4 is prior ending point
					x3 = leg[2] * scalex + x4; // here last x4 is prior ending point
					y3 = leg[3] * scaley + y4; // here last y4 is prior ending point
					x4 = leg[4] * scalex + x4; // here last x4 was prior ending point
					y4 = leg[5] * scaley + y4; // here last y4 was prior ending point
					out(
						f3(x2 * k) + ' ' +
						f3((pageHeight - y2) * k) + ' ' +
						f3(x3 * k) + ' ' +
						f3((pageHeight - y3) * k) + ' ' +
						f3(x4 * k) + ' ' +
						f3((pageHeight - y4) * k) + ' c');
				}
			}

			if (closed) {
				out(' h');
			}

			// stroking / filling / both the path
			if (style !== null) {
				out(getStyle(style));
			}
			return this;
		};

		/**
		 * Adds a rectangle to PDF
		 *
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} w Width (in units declared at inception of PDF document)
		 * @param {Number} h Height (in units declared at inception of PDF document)
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name rect
		 */
		API.rect = function(x, y, w, h, style) {
			var op = getStyle(style);
			out([
					f2(x * k),
					f2((pageHeight - y) * k),
					f2(w * k),
					f2(-h * k),
					're'
				].join(' '));

			if (style !== null) {
				out(getStyle(style));
			}

			return this;
		};

		/**
		 * Adds a triangle to PDF
		 *
		 * @param {Number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name triangle
		 */
		API.triangle = function(x1, y1, x2, y2, x3, y3, style) {
			this.lines(
				[
					[x2 - x1, y2 - y1], // vector to point 2
					[x3 - x2, y3 - y2], // vector to point 3
					[x1 - x3, y1 - y3]// closing vector back to point 1
				],
				x1,
				y1, // start of path
				[1, 1],
				style,
				true);
			return this;
		};

		/**
		 * Adds a rectangle with rounded corners to PDF
		 *
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} w Width (in units declared at inception of PDF document)
		 * @param {Number} h Height (in units declared at inception of PDF document)
		 * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
		 * @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name roundedRect
		 */
		API.roundedRect = function(x, y, w, h, rx, ry, style) {
			var MyArc = 4 / 3 * (Math.SQRT2 - 1);
			this.lines(
				[
					[(w - 2 * rx), 0],
					[(rx * MyArc), 0, rx, ry - (ry * MyArc), rx, ry],
					[0, (h - 2 * ry)],
					[0, (ry * MyArc),  - (rx * MyArc), ry, -rx, ry],
					[(-w + 2 * rx), 0],
					[ - (rx * MyArc), 0, -rx,  - (ry * MyArc), -rx, -ry],
					[0, (-h + 2 * ry)],
					[0,  - (ry * MyArc), (rx * MyArc), -ry, rx, -ry]
				],
				x + rx,
				y, // start of path
				[1, 1],
				style);
			return this;
		};

		/**
		 * Adds an ellipse to PDF
		 *
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
		 * @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name ellipse
		 */
		API.ellipse = function(x, y, rx, ry, style) {
			var lx = 4 / 3 * (Math.SQRT2 - 1) * rx,
				ly = 4 / 3 * (Math.SQRT2 - 1) * ry;

			out([
					f2((x + rx) * k),
					f2((pageHeight - y) * k),
					'm',
					f2((x + rx) * k),
					f2((pageHeight - (y - ly)) * k),
					f2((x + lx) * k),
					f2((pageHeight - (y - ry)) * k),
					f2(x * k),
					f2((pageHeight - (y - ry)) * k),
					'c'
				].join(' '));
			out([
					f2((x - lx) * k),
					f2((pageHeight - (y - ry)) * k),
					f2((x - rx) * k),
					f2((pageHeight - (y - ly)) * k),
					f2((x - rx) * k),
					f2((pageHeight - y) * k),
					'c'
				].join(' '));
			out([
					f2((x - rx) * k),
					f2((pageHeight - (y + ly)) * k),
					f2((x - lx) * k),
					f2((pageHeight - (y + ry)) * k),
					f2(x * k),
					f2((pageHeight - (y + ry)) * k),
					'c'
				].join(' '));
			out([
					f2((x + lx) * k),
					f2((pageHeight - (y + ry)) * k),
					f2((x + rx) * k),
					f2((pageHeight - (y + ly)) * k),
					f2((x + rx) * k),
					f2((pageHeight - y) * k),
					'c'
				].join(' '));
				
			if (style !== null) {
				out(getStyle(style));
			}				
				
			return this;
		};

		/**
		 * Adds an circle to PDF
		 *
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} r Radius (in units declared at inception of PDF document)
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name circle
		 */
		API.circle = function(x, y, r, style) {
			return this.ellipse(x, y, r, r, style);
		};

		/**
		 * Adds a properties to the PDF document
		 *
		 * @param {Object} A property_name-to-property_value object structure.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setProperties
		 */
		API.setProperties = function(properties) {
			// copying only those properties we can render.
			for (var property in documentProperties) {
				if (documentProperties.hasOwnProperty(property) && properties[property]) {
					documentProperties[property] = properties[property];
				}
			}
			return this;
		};

		/**
		 * Sets font size for upcoming text elements.
		 *
		 * @param {Number} size Font size in points.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setFontSize
		 */
		API.setFontSize = function(size) {
			activeFontSize = size;
			return this;
		};

		/**
		 * Sets text font face, variant for upcoming text elements.
		 * See output of jsPDF.getFontList() for possible font names, styles.
		 *
		 * @param {String} fontName Font name or family. Example: "times"
		 * @param {String} fontStyle Font style or variant. Example: "italic"
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setFont
		 */
		API.setFont = function(fontName, fontStyle) {
			activeFontKey = getFont(fontName, fontStyle);
			// if font is not found, the above line blows up and we never go further
			return this;
		};

		/**
		 * Switches font style or variant for upcoming text elements,
		 * while keeping the font face or family same.
		 * See output of jsPDF.getFontList() for possible font names, styles.
		 *
		 * @param {String} style Font style or variant. Example: "italic"
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setFontStyle
		 */
		API.setFontStyle = API.setFontType = function(style) {
			activeFontKey = getFont(undefined, style);
			// if font is not found, the above line blows up and we never go further
			return this;
		};

		/**
		 * Returns an object - a tree of fontName to fontStyle relationships available to
		 * active PDF document.
		 *
		 * @public
		 * @function
		 * @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
		 * @methodOf jsPDF#
		 * @name getFontList
		 */
		API.getFontList = function() {
			// TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
			var list = {},fontName,fontStyle,tmp;

			for (fontName in fontmap) {
				if (fontmap.hasOwnProperty(fontName)) {
					list[fontName] = tmp = [];
					for (fontStyle in fontmap[fontName]) {
						if (fontmap[fontName].hasOwnProperty(fontStyle)) {
							tmp.push(fontStyle);
						}
					}
				}
			}

			return list;
		};

		/**
		 * Sets line width for upcoming lines.
		 *
		 * @param {Number} width Line width (in units declared at inception of PDF document)
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setLineWidth
		 */
		API.setLineWidth = function(width) {
			out((width * k).toFixed(2) + ' w');
			return this;
		};

		/**
		 * Sets the stroke color for upcoming elements.
		 *
		 * Depending on the number of arguments given, Gray, RGB, or CMYK
		 * color space is implied.
		 *
		 * When only ch1 is given, "Gray" color space is implied and it
		 * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
		 * if values are communicated as String types, or in range from 0 (black)
		 * to 255 (white) if communicated as Number type.
		 * The RGB-like 0-255 range is provided for backward compatibility.
		 *
		 * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
		 * value must be in the range from 0.00 (minimum intensity) to to 1.00
		 * (max intensity) if values are communicated as String types, or
		 * from 0 (min intensity) to to 255 (max intensity) if values are communicated
		 * as Number types.
		 * The RGB-like 0-255 range is provided for backward compatibility.
		 *
		 * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
		 * value must be a in the range from 0.00 (0% concentration) to to
		 * 1.00 (100% concentration)
		 *
		 * Because JavaScript treats fixed point numbers badly (rounds to
		 * floating point nearest to binary representation) it is highly advised to
		 * communicate the fractional numbers as String types, not JavaScript Number type.
		 *
		 * @param {Number|String} ch1 Color channel value
		 * @param {Number|String} ch2 Color channel value
		 * @param {Number|String} ch3 Color channel value
		 * @param {Number|String} ch4 Color channel value
		 *
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setDrawColor
		 */
		API.setDrawColor = function(ch1, ch2, ch3, ch4) {
			var color;
			if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
				// Gray color space.
				if (typeof ch1 === 'string') {
					color = ch1 + ' G';
				} else {
					color = f2(ch1 / 255) + ' G';
				}
			} else if (ch4 === undefined) {
				// RGB
				if (typeof ch1 === 'string') {
					color = [ch1, ch2, ch3, 'RG'].join(' ');
				} else {
					color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'RG'].join(' ');
				}
			} else {
				// CMYK
				if (typeof ch1 === 'string') {
					color = [ch1, ch2, ch3, ch4, 'K'].join(' ');
				} else {
					color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'K'].join(' ');
				}
			}

			out(color);
			return this;
		};

		/**
		 * Sets the fill color for upcoming elements.
		 *
		 * Depending on the number of arguments given, Gray, RGB, or CMYK
		 * color space is implied.
		 *
		 * When only ch1 is given, "Gray" color space is implied and it
		 * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
		 * if values are communicated as String types, or in range from 0 (black)
		 * to 255 (white) if communicated as Number type.
		 * The RGB-like 0-255 range is provided for backward compatibility.
		 *
		 * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
		 * value must be in the range from 0.00 (minimum intensity) to to 1.00
		 * (max intensity) if values are communicated as String types, or
		 * from 0 (min intensity) to to 255 (max intensity) if values are communicated
		 * as Number types.
		 * The RGB-like 0-255 range is provided for backward compatibility.
		 *
		 * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
		 * value must be a in the range from 0.00 (0% concentration) to to
		 * 1.00 (100% concentration)
		 *
		 * Because JavaScript treats fixed point numbers badly (rounds to
		 * floating point nearest to binary representation) it is highly advised to
		 * communicate the fractional numbers as String types, not JavaScript Number type.
		 *
		 * @param {Number|String} ch1 Color channel value
		 * @param {Number|String} ch2 Color channel value
		 * @param {Number|String} ch3 Color channel value
		 * @param {Number|String} ch4 Color channel value
		 *
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setFillColor
		 */
		API.setFillColor = function(ch1, ch2, ch3, ch4) {
			var color;

			if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
				// Gray color space.
				if (typeof ch1 === 'string') {
					color = ch1 + ' g';
				} else {
					color = f2(ch1 / 255) + ' g';
				}
			} else if (ch4 === undefined) {
				// RGB
				if (typeof ch1 === 'string') {
					color = [ch1, ch2, ch3, 'rg'].join(' ');
				} else {
					color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'rg'].join(' ');
				}
			} else {
				// CMYK
				if (typeof ch1 === 'string') {
					color = [ch1, ch2, ch3, ch4, 'k'].join(' ');
				} else {
					color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'k'].join(' ');
				}
			}

			out(color);
			return this;
		};

		/**
		 * Sets the text color for upcoming elements.
		 * If only one, first argument is given,
		 * treats the value as gray-scale color value.
		 *
		 * @param {Number} r Red channel color value in range 0-255 or {String} r color value in hexadecimal, example: '#FFFFFF'
		 * @param {Number} g Green channel color value in range 0-255
		 * @param {Number} b Blue channel color value in range 0-255
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setTextColor
		 */
		API.setTextColor = function(r, g, b) {
			if ((typeof r == 'string') && /^#[0-9A-Fa-f]{6}$/.test(r)) {
				var hex = parseInt(r.substr(1), 16);
				r = (hex >> 16) & 255;
				g = (hex >> 8) & 255;
				b = (hex & 255);
			}

			if ((r === 0 && g === 0 && b === 0) || (typeof g === 'undefined')) {
				textColor = f3(r / 255) + ' g';
			} else {
				textColor = [f3(r / 255), f3(g / 255), f3(b / 255), 'rg'].join(' ');
			}
			return this;
		};

		/**
		 * Is an Object providing a mapping from human-readable to
		 * integer flag values designating the varieties of line cap
		 * and join styles.
		 *
		 * @returns {Object}
		 * @fieldOf jsPDF#
		 * @name CapJoinStyles
		 */
		API.CapJoinStyles = {
			0 : 0,
			'butt' : 0,
			'but' : 0,
			'miter' : 0,
			1 : 1,
			'round' : 1,
			'rounded' : 1,
			'circle' : 1,
			2 : 2,
			'projecting' : 2,
			'project' : 2,
			'square' : 2,
			'bevel' : 2
		};

		/**
		 * Sets the line cap styles
		 * See {jsPDF.CapJoinStyles} for variants
		 *
		 * @param {String|Number} style A string or number identifying the type of line cap
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setLineCap
		 */
		API.setLineCap = function(style) {
			var id = this.CapJoinStyles[style];
			if (id === undefined) {
				throw new Error("Line cap style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
			}
			lineCapID = id;
			out(id.toString(10) + ' J');

			return this;
		};

		/**
		 * Sets the line join styles
		 * See {jsPDF.CapJoinStyles} for variants
		 *
		 * @param {String|Number} style A string or number identifying the type of line join
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setLineJoin
		 */
		API.setLineJoin = function(style) {
			var id = this.CapJoinStyles[style];
			if (id === undefined) {
				throw new Error("Line join style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
			}
			lineJoinID = id;
			out(id.toString(10) + ' j');

			return this;
		};

		// Output is both an internal (for plugins) and external function
		API.output = output;

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
		};

		// applying plugins (more methods) ON TOP of built-in API.
		// this is intentional as we allow plugins to override
		// built-ins
		for (var plugin in jsPDF.API) {
			if (jsPDF.API.hasOwnProperty(plugin)) {
				if (plugin === 'events' && jsPDF.API.events.length) {
					(function(events, newEvents) {

						// jsPDF.API.events is a JS Array of Arrays
						// where each Array is a pair of event name, handler
						// Events were added by plugins to the jsPDF instantiator.
						// These are always added to the new instance and some ran
						// during instantiation.
						var eventname,handler_and_args,i;

						for (i = newEvents.length - 1; i !== -1; i--) {
							// subscribe takes 3 args: 'topic', function, runonce_flag
							// if undefined, runonce is false.
							// users can attach callback directly,
							// or they can attach an array with [callback, runonce_flag]
							// that's what the "apply" magic is for below.
							eventname = newEvents[i][0];
							handler_and_args = newEvents[i][1];
							events.subscribe.apply(
								events,
								[eventname].concat(
									typeof handler_and_args === 'function' ?
										[handler_and_args] : handler_and_args));
						}
					}(events, jsPDF.API.events));
				} else {
					API[plugin] = jsPDF.API[plugin];
				}
			}
		}

		//////////////////////////////////////////////////////
		// continuing initialization of jsPDF Document object
		//////////////////////////////////////////////////////
		// Add the first page automatically
		addFonts();
		activeFontKey = 'F1';
		_addPage();

		events.publish('initialized');
		return API;
	}

	/**
	 * jsPDF.API is a STATIC property of jsPDF class.
	 * jsPDF.API is an object you can add methods and properties to.
	 * The methods / properties you add will show up in new jsPDF objects.
	 *
	 * One property is prepopulated. It is the 'events' Object. Plugin authors can add topics,
	 * callbacks to this object. These will be reassigned to all new instances of jsPDF.
	 * Examples:
	 * jsPDF.API.events['initialized'] = function(){ 'this' is API object }
	 * jsPDF.API.events['addFont'] = function(added_font_object){ 'this' is API object }
	 *
	 * @static
	 * @public
	 * @memberOf jsPDF
	 * @name API
	 *
	 * @example
	 * jsPDF.API.mymethod = function(){
	 *   // 'this' will be ref to internal API object. see jsPDF source
	 *   // , so you can refer to built-in methods like so:
	 *   //     this.line(....)
	 *   //     this.text(....)
	 * }
	 * var pdfdoc = new jsPDF()
	 * pdfdoc.mymethod() // <- !!!!!!
	 */
	jsPDF.API = {events:[]};
	jsPDF.version = "1.0.0-trunk";

	var exports = {
		jsPDF : jsPDF
	};

	if (typeof module === 'object') {
		module.exports = exports;
	} else if (typeof define === 'function') {
		define(function() {
			return exports;
		});
	} else {
		global.jsPDF = jsPDF;
	}
	return jsPDF;
}(self));

/***********************************************
* FILE: jspdf.plugin.addimage.js
***********************************************/
/** @preserve 
 * jsPDF addImage plugin
 * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
 *               2013 Chris Dowling, https://github.com/gingerchris
 *               2013 Trinh Ho, https://github.com/ineedfat
 *               2013 Edwin Alejandro Perez, https://github.com/eaparango
 *               2013 Norah Smith, https://github.com/burnburnrocket
 *               2014 Diego Casorran, https://github.com/diegocr
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

;(function(jsPDFAPI) {
	'use strict'
	
	var namespace = 'addImage_',
		supported_image_types = ['jpeg', 'jpg', 'png'];
	
	
	// Image functionality ported from pdf.js
	var putImage = function(img) {
		
		var objectNumber = this.internal.newObject()
		, out = this.internal.write
		, putStream = this.internal.putStream
	
		img['n'] = objectNumber
	
		out('<</Type /XObject')
		out('/Subtype /Image')
		out('/Width ' + img['w'])
		out('/Height ' + img['h'])
		if (img['cs'] === this.color_spaces.INDEXED) {
			out('/ColorSpace [/Indexed /DeviceRGB '
					// if an indexed png defines more than one colour with transparency, we've created a smask  
					+ (img['pal'].length / 3 - 1) + ' ' + ('smask' in img ? objectNumber + 2 : objectNumber + 1)
					+ ' 0 R]');
		} else {
			out('/ColorSpace /' + img['cs']);
			if (img['cs'] === this.color_spaces.DEVICE_CMYK) {
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
			var trns = '',
				i = 0,
				len = img['trns'].length;
			for (; i < len; i++)
				trns += (img['trns'][i] + ' ' + img['trns'][i] + ' ');
			out('/Mask [' + trns + ']');
		}
		if ('smask' in img) {
			out('/SMask ' + (objectNumber + 1) + ' 0 R');
		}
		out('/Length ' + img['data'].length + '>>');
	
		putStream(img['data']);
	
		out('endobj');
		
		// Soft mask
		if ('smask' in img) {
			var dp = '/Predictor 15 /Colors 1 /BitsPerComponent ' + img['bpc'] + ' /Columns ' + img['w'];
			var smask = {'w': img['w'], 'h': img['h'], 'cs': 'DeviceGray', 'bpc': img['bpc'], 'dp': dp, 'data': img['smask']};
			if ('f' in img) 
				smask.f = img['f'];
			putImage.call(this, smask);
		}
	    
	    //Palette
		if (img['cs'] === this.color_spaces.INDEXED) {
			
			this.internal.newObject();
			//out('<< /Filter / ' + img['f'] +' /Length ' + img['pal'].length + '>>');
			//putStream(zlib.compress(img['pal']));
			out('<< /Length ' + img['pal'].length + '>>');
			putStream(this.arrayBufferToBinaryString(new Uint8Array(img['pal'])));
			out('endobj');
		}
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
	, checkCompressValue = function(value) {
		if(value && typeof value === 'string')
			value = value.toUpperCase();
		return value in jsPDFAPI.image_compression ? value : jsPDFAPI.image_compression.NONE;
	}
	, getImages = function() {
		var images = this.internal.collections[namespace + 'images'];
		//first run, so initialise stuff
		if(!images) {
			this.internal.collections[namespace + 'images'] = images = {};
			this.internal.events.subscribe('putResources', putResourcesCallback);
			this.internal.events.subscribe('putXobjectDict', putXObjectsDictCallback);
		}
		
		return images;
	}
	, getImageIndex = function(images) {
		var imageIndex = 0;
		
		if (images){
			// this is NOT the first time this method is ran on this instance of jsPDF object.
			imageIndex = Object.keys ? 
			Object.keys(images).length :
			(function(o){
				var i = 0
				for (var e in o){if(o.hasOwnProperty(e)){ i++ }}
				return i
			})(images)
		}
		
		return imageIndex;
	}
	, notDefined = function(value) {
		return typeof value === 'undefined' || value === null;
	}
	, generateAliasFromData = function(data) {
		// TODO: Alias dynamic generation from imageData's checksum/hash
		return undefined;
	}
	, doesNotSupportImageType = function(type) {
		return supported_image_types.indexOf(type) === -1;
	}
	, processMethodNotEnabled = function(type) {
		return typeof jsPDFAPI['process' + type.toUpperCase()] !== 'function';
	}
	, isDOMElement = function(object) {
		return typeof object === 'object' && object.nodeType === 1;
	}
	, createDataURIFromElement = function(imageData, format) {
		
		var canvas = document.createElement('canvas');
	    canvas.width = imageData.clientWidth || imageData.width;
	    canvas.height = imageData.clientHeight || imageData.height;
	
	    var ctx = canvas.getContext('2d');
	    if (!ctx) {
	        throw ('addImage requires canvas to be supported by browser.');
	    }
	    ctx.drawImage(imageData, 0, 0, canvas.width, canvas.height);
	    
	    return canvas.toDataURL(format == 'png' ? 'image/png' : 'image/jpeg');
	}
	,checkImagesForAlias = function(imageData, images) {
		var cached_info;
		if(images) {
			for(var e in images) {
				if(imageData === images[e].alias) {
					cached_info = images[e];
					break;
				}
			}
		}
		return cached_info;
	}
	,determineWidthAndHeight = function(w, h) {
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
		
		return [w, h];
	}
	, writeImageToPDF = function(x, y, w, h, info, index, images) {
		var dims = determineWidthAndHeight(w, h),
			coord = this.internal.getCoordinateString,
			vcoord = this.internal.getVerticalCoordinateString;
		
		w = dims[0];
		h = dims[1];
		
		images[index] = info;
		
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
	};
	
	
	/**
	 * COLOR SPACES
	 */
	jsPDFAPI.color_spaces = {
		DEVICE_RGB:'DeviceRGB',
		DEVICE_GRAY:'DeviceGray',
		DEVICE_CMYK:'DeviceCMYK',
		CAL_GREY:'CalGray',
		CAL_RGB:'CalRGB',
		LAB:'Lab',
		ICC_BASED:'ICCBased',
		INDEXED:'Indexed',
		PATTERN:'Pattern',
		SEPERATION:'Seperation',
		DEVICE_N:'DeviceN'
	};
	
	/**
	 * DECODE METHODS
	 */
	jsPDFAPI.decode = {
		DCT_DECODE:'DCTDecode',
		FLATE_DECODE:'FlateDecode',
		LZW_DECODE:'LZWDecode',
		JPX_DECODE:'JPXDecode',
		JBIG2_DECODE:'JBIG2Decode',
		ASCII85_DECODE:'ASCII85Decode',
		ASCII_HEX_DECODE:'ASCIIHexDecode',
		RUN_LENGTH_DECODE:'RunLengthDecode',
		CCITT_FAX_DECODE:'CCITTFaxDecode'
	};
	
	/**
	 * IMAGE COMPRESSION TYPES
	 */
	jsPDFAPI.image_compression = {
		NONE: 'NONE',
		FAST: 'FAST',
		MEDIUM: 'MEDIUM',
		SLOW: 'SLOW'
	};
	
	
	jsPDFAPI.isString = function(object) {
		return typeof object === 'string';
	};
	
	/**
	 * Strips out and returns info from a valid base64 data URI
	 * @param {String[dataURI]} a valid data URI of format 'data:[<MIME-type>][;base64],<data>'
	 * @returns an Array containing the following
	 * [0] the complete data URI
	 * [1] <MIME-type>
	 * [2] format - the second part of the mime-type i.e 'png' in 'image/png'
	 * [4] <data>
	 */
	jsPDFAPI.extractInfoFromBase64DataURI = function(dataURI) {
		return /^data:([\w]+?\/([\w]+?));base64,(.+?)$/g.exec(dataURI);
	};
	
	/**
	 * Check to see if ArrayBuffer is supported
	 */
	jsPDFAPI.supportsArrayBuffer = function() {
		return typeof ArrayBuffer === 'function';
	};
	
	/**
	 * Tests supplied object to determine if ArrayBuffer
	 * @param {Object[object]} 
	 */
	jsPDFAPI.isArrayBuffer = function(object) {
		if(!this.supportsArrayBuffer())
	        return false;
		return object instanceof ArrayBuffer;
	};
	
	/**
	 * Tests supplied object to determine if it implements the ArrayBufferView (TypedArray) interface
	 * @param {Object[object]} 
	 */
	jsPDFAPI.isArrayBufferView = function(object) {
		if(!this.supportsArrayBuffer())
	        return false;
		return (object instanceof Int8Array ||
				object instanceof Uint8Array ||
				object instanceof Uint8ClampedArray ||
				object instanceof Int16Array ||
				object instanceof Uint16Array ||
				object instanceof Int32Array ||
				object instanceof Uint32Array ||
				object instanceof Float32Array ||
				object instanceof Float64Array );
	};
	
	/**
	 * Exactly what it says on the tin
	 */
	jsPDFAPI.binaryStringToUint8Array = function(binary_string) {
		/*
		 * not sure how efficient this will be will bigger files. Is there a native method?
		 */
		var len = binary_string.length;
	    var bytes = new Uint8Array( len );
	    for (var i = 0; i < len; i++) {
	        bytes[i] = binary_string.charCodeAt(i);
	    }
	    return bytes;
	};
	
	/**
	 * @see this discussion
	 * http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
	 * 
	 * As stated, i imagine the method below is highly inefficent for large files.
	 * 
	 * Also of note from Mozilla,
	 * 
	 * "However, this is slow and error-prone, due to the need for multiple conversions (especially if the binary data is not actually byte-format data, but, for example, 32-bit integers or floats)."
	 * 
	 * https://developer.mozilla.org/en-US/Add-ons/Code_snippets/StringView
	 * 
	 * Although i'm strugglig to see how StringView solves this issue? Doesn't appear to be a direct method for conversion?
	 * 
	 * Async method using Blob and FileReader could be best, but i'm not sure how to fit it into the flow?
	 */
	jsPDFAPI.arrayBufferToBinaryString = function(buffer) {
		if(this.isArrayBuffer(buffer))
			buffer = new Uint8Array(buffer);
		
	    var binary_string = '';
	    var len = buffer.byteLength;
	    for (var i = 0; i < len; i++) {
	        binary_string += String.fromCharCode(buffer[i]);
	    }
	    return binary_string;
	    /*
	     * Another solution is the method below - convert array buffer straight to base64 and then use atob
	     */
		//return atob(this.arrayBufferToBase64(buffer));
	};
	
	/**
	 * Converts an ArrayBuffer directly to base64
	 * 
	 * Taken from here
	 * 
	 * http://jsperf.com/encoding-xhr-image-data/31
	 * 
	 * Need to test if this is a better solution for larger files
	 * 
	 */
	jsPDFAPI.arrayBufferToBase64 = function(arrayBuffer) {
		var base64    = ''
		var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

		var bytes         = new Uint8Array(arrayBuffer)
		var byteLength    = bytes.byteLength
		var byteRemainder = byteLength % 3
		var mainLength    = byteLength - byteRemainder

		var a, b, c, d
		var chunk

		// Main loop deals with bytes in chunks of 3
		for (var i = 0; i < mainLength; i = i + 3) {
			// Combine the three bytes into a single integer
			chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

			// Use bitmasks to extract 6-bit segments from the triplet
			a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
			b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
			c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
			d = chunk & 63               // 63       = 2^6 - 1

			// Convert the raw binary segments to the appropriate ASCII encoding
			base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
		}

		// Deal with the remaining bytes and padding
		if (byteRemainder == 1) {
			chunk = bytes[mainLength]

			a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

			// Set the 4 least significant bits to zero
			b = (chunk & 3)   << 4 // 3   = 2^2 - 1

			base64 += encodings[a] + encodings[b] + '=='
		} else if (byteRemainder == 2) {
			chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

			a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
			b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

			// Set the 2 least significant bits to zero
			c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

			base64 += encodings[a] + encodings[b] + encodings[c] + '='
		}

		return base64
	};
	
	
	jsPDFAPI.createImageInfo = function(data, wd, ht, cs, bpc, f, imageIndex, alias, dp, trns, pal, smask) {
		var info = {
				alias:alias,
				w : wd,
				h : ht,
				cs : cs,
				bpc : bpc,
				i : imageIndex,
				data : data
				// n: objectNumber will be added by putImage code
			};
		
		if(f) info.f = f;
		if(dp) info.dp = dp;
		if(trns) info.trns = trns;
		if(pal) info.pal = pal;
		if(smask) info.smask = smask;
		
		return info;
	};
	
	jsPDFAPI.addImage = function(imageData, format, x, y, w, h, alias, compression) {
		'use strict'
		
		if(typeof format === 'number') {
			var tmp = h;
			h = w;
			w = y;
			y = x;
			x = format;
			format = tmp || 'jpeg';
		}
		
		var images = getImages.call(this),//initalises internals and events on first run
			cached_info,
			dataAsBinaryString;
		
		compression = checkCompressValue(compression);
		format = format.toLowerCase();
		
		if(notDefined(alias))
			alias = generateAliasFromData(imageData);
		
		if(isDOMElement(imageData))
			imageData = createDataURIFromElement(imageData, format);
				
		if(this.isString(imageData)) {
			
			var base64Info = this.extractInfoFromBase64DataURI(imageData);
			
			if(base64Info) {
				
				format = base64Info[2];
				imageData = atob(base64Info[3]);//convert to binary string
				
				/*
				 * need to test if it's more efficent to convert all binary strings
				 * to TypedArray - or should we just leave and process as string?
				 */
				if(this.supportsArrayBuffer()) {
					dataAsBinaryString = imageData;
					imageData = this.binaryStringToUint8Array(imageData);
				}
				
			}else{
				// This is neither raw jpeg-data nor a data uri; alias?
				if(imageData.charCodeAt(0) !== 0xff)
					cached_info = checkImagesForAlias(imageData, images);
			}
		}
		
		if(doesNotSupportImageType(format))
			throw new Error('addImage currently only supports formats ' + supported_image_types + ', not \''+format+'\'');
		
		if(processMethodNotEnabled(format))
			throw new Error('please ensure that the plugin for \''+format+'\' support is added');
		
		var imageIndex = getImageIndex(images),
			info = cached_info;

		if(!info)			
			info = this['process' + format.toUpperCase()](imageData, imageIndex, alias, compression, dataAsBinaryString);
		
		if(!info)
			throw new Error('An unkwown error occurred whilst processing the image');
		
		writeImageToPDF.call(this, x, y, w, h, info, imageIndex, images);
	
		return this 
	};
	
	
	/**
	 * JPEG SUPPORT
	 **/
	
	//takes a string imgData containing the raw bytes of
	//a jpeg image and returns [width, height]
	//Algorithm from: http://www.64lines.com/jpeg-width-height
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
				throw new Error('getJpegSize requires a binary string jpeg file')
		}
		var blockLength = imgData.charCodeAt(4)*256 + imgData.charCodeAt(5);
		var i = 4, len = imgData.length;
		while ( i < len ) {
			i += blockLength;
			if (imgData.charCodeAt(i) !== 0xff) {
				throw new Error('getJpegSize could not find the size of the image');
			}
			if (imgData.charCodeAt(i+1) === 0xc0 || //(SOF) Huffman  - Baseline DCT
			    imgData.charCodeAt(i+1) === 0xc1 || //(SOF) Huffman  - Extended sequential DCT 
			    imgData.charCodeAt(i+1) === 0xc2 || // Progressive DCT (SOF2)
			    imgData.charCodeAt(i+1) === 0xc3 || // Spatial (sequential) lossless (SOF3)
			    imgData.charCodeAt(i+1) === 0xc4 || // Differential sequential DCT (SOF5)
			    imgData.charCodeAt(i+1) === 0xc5 || // Differential progressive DCT (SOF6)
			    imgData.charCodeAt(i+1) === 0xc6 || // Differential spatial (SOF7)
			    imgData.charCodeAt(i+1) === 0xc7) {
				height = imgData.charCodeAt(i+5)*256 + imgData.charCodeAt(i+6);
				width = imgData.charCodeAt(i+7)*256 + imgData.charCodeAt(i+8);
				return [width, height];
			} else {
				i += 2;
				blockLength = imgData.charCodeAt(i)*256 + imgData.charCodeAt(i+1)
			}
		}
	}
	, getJpegSizeFromBytes = function(data) {
		
		var hdr = (data[0] << 8) | data[1];
		
		if(hdr !== 0xFFD8)
			throw new Error('Supplied data is not a JPEG');
		
		var len = data.length,
			block = (data[4] << 8) + data[5],
			pos = 4,
			bytes, width, height;
		
		while(pos < len) {
			pos += block;
			bytes = readBytes(data, pos);
			block = (bytes[2] << 8) + bytes[3];
			if((bytes[1] === 0xC0 || bytes[1] === 0xC2) && bytes[0] === 0xFF && block > 7) {
				bytes = readBytes(data, pos + 5);
				width = (bytes[2] << 8) + bytes[3];
				height = (bytes[0] << 8) + bytes[1];
				return {width:width, height:height};
			}
			
			pos+=2;
		}
		
		throw new Error('getJpegSizeFromBytes could not find the size of the image');
	}
	, readBytes = function(data, offset) {
		return data.subarray(offset, offset+ 4);
	};
	
	
	jsPDFAPI.processJPEG = function(data, index, alias, compression, dataAsBinaryString) {
		'use strict'
		var colorSpace = this.color_spaces.DEVICE_RGB,
			filter = this.decode.DCT_DECODE,
			bpc = 8,
			dims;
		
		if(this.isString(data)) {
			dims = getJpegSize(data);
			return this.createImageInfo(data, dims[0], dims[1], colorSpace, bpc, filter, index, alias);
		}
		
		if(this.isArrayBuffer(data))
			data = new Uint8Array(data);
		
		if(this.isArrayBufferView(data)) {
			
			dims = getJpegSizeFromBytes(data);
			
			// if we already have a stored binary string rep use that
			data = dataAsBinaryString || this.arrayBufferToBinaryString(data);
			
			return this.createImageInfo(data, dims.width, dims.height, colorSpace, bpc, filter, index, alias);
		}
		
		return null;
	};
	
	jsPDFAPI.processJPG = function(data, index, alias, compression, dataAsBinaryString) {
		return this.processJPEG(data, index, alias, compression, dataAsBinaryString);
	}

})(jsPDF.API);

/***********************************************
* FILE: jspdf.plugin.autoprint.js
***********************************************/
(function (jsPDFAPI) {
	'use strict';

	jsPDFAPI.autoPrint = function () {
		'use strict'
		var refAutoPrintTag;

		this.internal.events.subscribe('postPutResources', function () {
			refAutoPrintTag = this.internal.newObject()
				this.internal.write("<< /S/Named /Type/Action /N/Print >>", "endobj");
		});

		this.internal.events.subscribe("putCatalog", function () {
			this.internal.write("/OpenAction " + refAutoPrintTag + " 0" + " R");
		});
		return this;
	};
})(jsPDF.API);

/***********************************************
* FILE: jspdf.plugin.cell.js
***********************************************/
/** ==================================================================== 
 * jsPDF Cell plugin
 * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
 *               2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Hall, james@parall.ax
 *               2014 Diego Casorran, https://github.com/diegocr
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

(function (jsPDFAPI) {
    'use strict';
    /*jslint browser:true */
    /*global document: false, jsPDF */

    var fontName,
        fontSize,
        fontStyle,
        padding = 3,
        margin = 13,
        headerFunction,
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined },
        pages = 1,
        setLastCellPosition = function (x, y, w, h, ln) {
            lastCellPos = { 'x': x, 'y': y, 'w': w, 'h': h, 'ln': ln };
        },
        getLastCellPosition = function () {
            return lastCellPos;
        };

    jsPDFAPI.setHeaderFunction = function (func) {
        headerFunction = func;
    };

    jsPDFAPI.getTextDimensions = function (txt) {
        fontName = this.internal.getFont().fontName;
        fontSize = this.table_font_size || this.internal.getFontSize();
        fontStyle = this.internal.getFont().fontStyle;
        // 1 pixel = 0.264583 mm and 1 mm = 72/25.4 point
        var px2pt = 0.264583 * 72 / 25.4,
            dimensions,
            text;

        text = document.createElement('font');
        text.id = "jsPDFCell";
        text.style.fontStyle = fontStyle;
        text.style.fontName = fontName;
        text.style.fontSize = fontSize + 'pt';
        text.innerText = txt;

        document.body.appendChild(text);

        dimensions = { w: (text.offsetWidth + 1) * px2pt, h: (text.offsetHeight + 1) * px2pt};

        document.body.removeChild(text);

        return dimensions;
    };

    jsPDFAPI.cellAddPage = function () {
        this.addPage();

        setLastCellPosition(this.margins.left, this.margins.top, undefined, undefined);
        //setLastCellPosition(undefined, undefined, undefined, undefined, undefined);
        pages += 1;
    };

    jsPDFAPI.cellInitialize = function () {
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined };
        pages = 1;
    };

    jsPDFAPI.cell = function (x, y, w, h, txt, ln, align) {
        var curCell = getLastCellPosition();

        // If this is not the first cell, we must change its position
        if (curCell.ln !== undefined) {
            if (curCell.ln === ln) {
                //Same line
                x = curCell.x + curCell.w;
                y = curCell.y;
            } else {
                //New line
                if ((curCell.y + curCell.h + h + margin) >= this.internal.pageSize.height - this.margins.bottom) {
                    this.cellAddPage();
                    if (this.printHeaders && this.tableHeaderRow) {
                        this.printHeaderRow(ln, true);
                    }
                }
                //We ignore the passed y: the lines may have diferent heights
                y = (getLastCellPosition().y + getLastCellPosition().h);

            }
        }

        if (txt[0] !== undefined) {
            if (this.printingHeaderRow) {
                this.rect(x, y, w, h, 'FD');
            } else {
                this.rect(x, y, w, h);
            }
            if (align === 'right') {
                if (txt instanceof Array) {
                    for(var i = 0; i<txt.length; i++) {
                        var currentLine = txt[i];
                        var textSize = this.getStringUnitWidth(currentLine) * this.internal.getFontSize();
                        this.text(currentLine, x + w - textSize - padding, y + this.internal.getLineHeight()*(i+1));
                    }
                }
            } else {
                this.text(txt, x + padding, y + this.internal.getLineHeight());
            }
        }
        setLastCellPosition(x, y, w, h, ln);
        return this;
    };

    /**
     * Return the maximum value from an array
     * @param array
     * @param comparisonFn
     * @returns {*}
     */
    jsPDFAPI.arrayMax = function (array, comparisonFn) {
        var max = array[0],
            i,
            ln,
            item;

        for (i = 0, ln = array.length; i < ln; i += 1) {
            item = array[i];

            if (comparisonFn) {
                if (comparisonFn(max, item) === -1) {
                    max = item;
                }
            } else {
                if (item > max) {
                    max = item;
                }
            }
        }

        return max;
    };

    /**
     * Create a table from a set of data.
     * @param {Integer} [x] : left-position for top-left corner of table
     * @param {Integer} [y] top-position for top-left corner of table
     * @param {Object[]} [data] As array of objects containing key-value pairs corresponding to a row of data.
     * @param {String[]} [headers] Omit or null to auto-generate headers at a performance cost

     * @param {Object} [config.printHeaders] True to print column headers at the top of every page
     * @param {Object} [config.autoSize] True to dynamically set the column widths to match the widest cell value
     * @param {Object} [config.margins] margin values for left, top, bottom, and width
     * @param {Object} [config.fontSize] Integer fontSize to use (optional)
     */

    jsPDFAPI.table = function (x,y, data, headers, config) {
        if (!data) {
            throw 'No data for PDF table';
        }

        var headerNames = [],
            headerPrompts = [],
            header,
            i,
            ln,
            cln,
            columnMatrix = {},
            columnWidths = {},
            columnData,
            column,
            columnMinWidths = [],
            j,
            tableHeaderConfigs = [],
            model,
            jln,
            func,

        //set up defaults. If a value is provided in config, defaults will be overwritten:
           autoSize        = false,
           printHeaders    = true,
           fontSize        = 12,
           margins         = {left:0, top:0, bottom: 0, width: this.internal.pageSize.width};

        if (config) {
        //override config defaults if the user has specified non-default behavior:
            if(config.autoSize === true) {
                autoSize = true;
            }
            if(config.printHeaders === false) {
                printHeaders = false;
            }
            if(config.fontSize){
                fontSize = config.fontSize;
            }
            if(config.margins){
                margins = config.margins;
            }
        }

        /**
         * @property {Number} lnMod
         * Keep track of the current line number modifier used when creating cells
         */
        this.lnMod = 0;
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined },
        pages = 1;

        this.printHeaders = printHeaders;
        this.margins = margins;
        this.setFontSize(fontSize);
        this.table_font_size = fontSize;

        // Set header values
        if (headers === undefined || (headers === null)) {
            // No headers defined so we derive from data
            headerNames = Object.keys(data[0]);

        } else if (headers[0] && (typeof headers[0] !== 'string')) {
            var px2pt = 0.264583 * 72 / 25.4;

            // Split header configs into names and prompts
            for (i = 0, ln = headers.length; i < ln; i += 1) {
                header = headers[i];
                headerNames.push(header.name);
                headerPrompts.push(header.prompt);
                columnWidths[header.name] = header.width *px2pt;
            }

        } else {
            headerNames = headers;
        }

        if (autoSize) {
            // Create a matrix of columns e.g., {column_title: [row1_Record, row2_Record]}
            func = function (rec) {
                return rec[header];
            };

            for (i = 0, ln = headerNames.length; i < ln; i += 1) {
                header = headerNames[i];

                columnMatrix[header] = data.map(
                    func
                );

                // get header width
                columnMinWidths.push(this.getTextDimensions(headerPrompts[i] || header).w);
                column = columnMatrix[header];

                // get cell widths
                for (j = 0, cln = column.length; j < cln; j += 1) {
                    columnData = column[j];
                    columnMinWidths.push(this.getTextDimensions(columnData).w);
                }

                // get final column width
                columnWidths[header] = jsPDFAPI.arrayMax(columnMinWidths);
            }
        }

        // -- Construct the table

        if (printHeaders) {
            var lineHeight = this.calculateLineHeight(headerNames, columnWidths, headerPrompts.length?headerPrompts:headerNames);

            // Construct the header row
            for (i = 0, ln = headerNames.length; i < ln; i += 1) {
                header = headerNames[i];
                tableHeaderConfigs.push([x, y, columnWidths[header], lineHeight, String(headerPrompts.length ? headerPrompts[i] : header)]);
            }

            // Store the table header config
            this.setTableHeaderRow(tableHeaderConfigs);

            // Print the header for the start of the table
            this.printHeaderRow(1, false);
        }

        // Construct the data rows
        for (i = 0, ln = data.length; i < ln; i += 1) {
            var lineHeight;
            model = data[i];
            lineHeight = this.calculateLineHeight(headerNames, columnWidths, model);

            for (j = 0, jln = headerNames.length; j < jln; j += 1) {
                header = headerNames[j];
                this.cell(x, y, columnWidths[header], lineHeight, model[header], i + 2, header.align);
            }
        }
        this.lastCellPos = lastCellPos;
        this.table_x = x;
        this.table_y = y;
        return this;
    };
    /**
     * Calculate the height for containing the highest column
     * @param {String[]} headerNames is the header, used as keys to the data
     * @param {Integer[]} columnWidths is size of each column
     * @param {Object[]} model is the line of data we want to calculate the height of
     */
    jsPDFAPI.calculateLineHeight = function (headerNames, columnWidths, model) {
        var header, lineHeight = 0;
        for (var j = 0; j < headerNames.length; j++) {
            header = headerNames[j];
            model[header] = this.splitTextToSize(String(model[header]), columnWidths[header] - padding);
            var h = this.internal.getLineHeight() * model[header].length + padding;
            if (h > lineHeight)
                lineHeight = h;
        }
        return lineHeight;
    };

    /**
     * Store the config for outputting a table header
     * @param {Object[]} config
     * An array of cell configs that would define a header row: Each config matches the config used by jsPDFAPI.cell
     * except the ln parameter is excluded
     */
    jsPDFAPI.setTableHeaderRow = function (config) {
        this.tableHeaderRow = config;
    };

    /**
     * Output the store header row
     * @param lineNumber The line number to output the header at
     */
    jsPDFAPI.printHeaderRow = function (lineNumber, new_page) {
        if (!this.tableHeaderRow) {
            throw 'Property tableHeaderRow does not exist.';
        }

        var tableHeaderCell,
            tmpArray,
            i,
            ln;

        this.printingHeaderRow = true;
        if (headerFunction !== undefined) {
            var position = headerFunction(this, pages);
            setLastCellPosition(position[0], position[1], position[2], position[3], -1);
        }
        this.setFontStyle('bold');
        var tempHeaderConf = [];
        for (i = 0, ln = this.tableHeaderRow.length; i < ln; i += 1) {
            this.setFillColor(200,200,200);

            tableHeaderCell = this.tableHeaderRow[i];
            if (new_page) {
                tableHeaderCell[1] = this.margins.top;
                tempHeaderConf.push(tableHeaderCell);
            }
            tmpArray = [].concat(tableHeaderCell);
            this.cell.apply(this, tmpArray.concat(lineNumber));
        }
        if (tempHeaderConf.length > 0){
            this.setTableHeaderRow(tempHeaderConf);
        }
        this.setFontStyle('normal');
        this.printingHeaderRow = false;
    };

})(jsPDF.API);

/***********************************************
* FILE: jspdf.plugin.from_html.js
***********************************************/
/** @preserve
 * jsPDF fromHTML plugin. BETA stage. API subject to change. Needs browser, jQuery
 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 Diego Casorran, https://github.com/diegocr
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
  var DrillForContent, FontNameDB, FontStyleMap, FontWeightMap, GetCSS, PurgeWhiteSpace, Renderer, ResolveFont, ResolveUnitedNumber, UnitedNumberMap, elementHandledElsewhere, images, loadImgs, process, tableToJson;
  PurgeWhiteSpace = function(array) {
    var fragment, i, l, lTrimmed, r, rTrimmed, trailingSpace;
    i = 0;
    l = array.length;
    fragment = void 0;
    lTrimmed = false;
    rTrimmed = false;
    while (!lTrimmed && i !== l) {
      fragment = array[i] = array[i].trimLeft();
      if (fragment) {
        lTrimmed = true;
      }
      i++;
    }
    i = l - 1;
    while (l && !rTrimmed && i !== -1) {
      fragment = array[i] = array[i].trimRight();
      if (fragment) {
        rTrimmed = true;
      }
      i--;
    }
    r = /\s+$/g;
    trailingSpace = true;
    i = 0;
    while (i !== l) {
      fragment = array[i].replace(/\s+/g, " ");
      if (trailingSpace) {
        fragment = fragment.trimLeft();
      }
      if (fragment) {
        trailingSpace = r.test(fragment);
      }
      array[i] = fragment;
      i++;
    }
    return array;
  };
  Renderer = function(pdf, x, y, settings) {
    this.pdf = pdf;
    this.x = x;
    this.y = y;
    this.settings = settings;
    this.init();
    return this;
  };
  ResolveFont = function(css_font_family_string) {
    var name, part, parts;
    name = void 0;
    parts = css_font_family_string.split(",");
    part = parts.shift();
    while (!name && part) {
      name = FontNameDB[part.trim().toLowerCase()];
      part = parts.shift();
    }
    return name;
  };
  ResolveUnitedNumber = function(css_line_height_string) {
    var normal, undef, value;
    undef = void 0;
    normal = 16.00;
    value = UnitedNumberMap[css_line_height_string];
    if (value) {
      return value;
    }
    value = {
      "xx-small": 9,
      "x-small": 11,
      small: 13,
      medium: 16,
      large: 19,
      "x-large": 23,
      "xx-large": 28,
      auto: 0
    }[{
      css_line_height_string: css_line_height_string
    }];
    if (value !== undef) {
      return UnitedNumberMap[css_line_height_string] = value / normal;
    }
    if (value = parseFloat(css_line_height_string)) {
      return UnitedNumberMap[css_line_height_string] = value / normal;
    }
    value = css_line_height_string.match(/([\d\.]+)(px)/);
    if (value.length === 3) {
      return UnitedNumberMap[css_line_height_string] = parseFloat(value[1]) / normal;
    }
    return UnitedNumberMap[css_line_height_string] = 1;
  };
  GetCSS = function(element) {
    var $e, css, tmp;
    $e = $(element);
    css = {};
    tmp = void 0;
    css["font-family"] = ResolveFont($e.css("font-family")) || "times";
    css["font-style"] = FontStyleMap[$e.css("font-style")] || "normal";
    tmp = FontWeightMap[$e.css("font-weight")] || "normal";
    if (tmp === "bold") {
      if (css["font-style"] === "normal") {
        css["font-style"] = tmp;
      } else {
        css["font-style"] = tmp + css["font-style"];
      }
    }
    css["font-size"] = ResolveUnitedNumber($e.css("font-size")) || 1;
    css["line-height"] = ResolveUnitedNumber($e.css("line-height")) || 1;
    css["display"] = ($e.css("display") === "inline" ? "inline" : "block");
    if (css["display"] === "block") {
      css["margin-top"] = ResolveUnitedNumber($e.css("margin-top")) || 0;
      css["margin-bottom"] = ResolveUnitedNumber($e.css("margin-bottom")) || 0;
      css["padding-top"] = ResolveUnitedNumber($e.css("padding-top")) || 0;
      css["padding-bottom"] = ResolveUnitedNumber($e.css("padding-bottom")) || 0;
      css["margin-left"] = ResolveUnitedNumber($e.css("margin-left")) || 0;
      css["margin-right"] = ResolveUnitedNumber($e.css("margin-right")) || 0;
      css["padding-left"] = ResolveUnitedNumber($e.css("padding-left")) || 0;
      css["padding-right"] = ResolveUnitedNumber($e.css("padding-right")) || 0;
    }
    return css;
  };
  elementHandledElsewhere = function(element, renderer, elementHandlers) {
    var handlers, i, isHandledElsewhere, l, t;
    isHandledElsewhere = false;
    i = void 0;
    l = void 0;
    t = void 0;
    handlers = elementHandlers["#" + element.id];
    if (handlers) {
      if (typeof handlers === "function") {
        isHandledElsewhere = handlers(element, renderer);
      } else {
        i = 0;
        l = handlers.length;
        while (!isHandledElsewhere && i !== l) {
          isHandledElsewhere = handlers[i](element, renderer);
          i++;
        }
      }
    }
    handlers = elementHandlers[element.nodeName];
    if (!isHandledElsewhere && handlers) {
      if (typeof handlers === "function") {
        isHandledElsewhere = handlers(element, renderer);
      } else {
        i = 0;
        l = handlers.length;
        while (!isHandledElsewhere && i !== l) {
          isHandledElsewhere = handlers[i](element, renderer);
          i++;
        }
      }
    }
    return isHandledElsewhere;
  };
  tableToJson = function(table, renderer) {
    var data, headers, i, j, rowData, tableRow, table_obj, table_with;
    data = [];
    headers = [];
    i = 0;
    table_with = table.clientWidth;
    while (i < table.rows[0].cells.length) {
      headers[i] = {
        name: table.rows[0].cells[i].innerHTML.toLowerCase().replace(RegExp("(\r\n|\n|\r)", "g"), "").replace(RegExp(" ", "g"), ""),
        prompt: table.rows[0].cells[i].innerHTML.toLowerCase().replace(RegExp("(\r\n|\n|\r)", "g"), ""),
        width: (table.rows[0].cells[i].clientWidth / table_with) * renderer.pdf.internal.pageSize.width
      };
      i++;
    }
    i = 1;
    while (i < table.rows.length) {
      tableRow = table.rows[i];
      rowData = {};
      j = 0;
      while (j < tableRow.cells.length) {
        rowData[headers[j].name] = tableRow.cells[j].innerHTML.replace(RegExp("(\r\n|\n|\r)", "g"), "");
        j++;
      }
      data.push(rowData);
      i++;
    }
    return table_obj = {
      rows: data,
      headers: headers
    };
  };
  var SkipNode = {
    SCRIPT   : 1,
    STYLE    : 1,
    NOSCRIPT : 1,
    OBJECT   : 1,
    EMBED    : 1
  };
  DrillForContent = function(element, renderer, elementHandlers) {
    var cn, cns, fragmentCSS, i, isBlock, l, px2pt, table2json;
    cns = element.childNodes;
    cn = void 0;
    fragmentCSS = GetCSS(element);
    isBlock = fragmentCSS.display === "block";
    if (isBlock) {
      renderer.setBlockBoundary();
      renderer.setBlockStyle(fragmentCSS);
    }
    px2pt = 0.264583 * 72 / 25.4;
    i = 0;
    l = cns.length;
    while (i < l) {
      cn = cns[i];
      if (typeof cn === "object") {
        if (cn.nodeType === 8 && cn.nodeName === "#comment") {
          if (cn.textContent.match("ADD_PAGE")) {
            renderer.pdf.addPage();
            renderer.y = renderer.pdf.margins_doc.top;
          }
        } else if (cn.nodeType === 1 && !SkipNode[cn.nodeName]) {
          if (cn.nodeName === "IMG" && images[cn.getAttribute("src")]) {
            if ((renderer.pdf.internal.pageSize.height - renderer.pdf.margins_doc.bottom < renderer.y + cn.height) && (renderer.y > renderer.pdf.margins_doc.top)) {
              renderer.pdf.addPage();
              renderer.y = renderer.pdf.margins_doc.top;
            }
            renderer.pdf.addImage(images[cn.getAttribute("src")], renderer.x, renderer.y, cn.width, cn.height);
            renderer.y += cn.height;
          } else if (cn.nodeName === "TABLE") {
            table2json = tableToJson(cn, renderer);
            renderer.y += 10;
            renderer.pdf.table(renderer.x, renderer.y, table2json.rows, table2json.headers, {
              autoSize: false,
              printHeaders: true,
              margins: renderer.pdf.margins_doc
            });
            renderer.y = renderer.pdf.lastCellPos.y + renderer.pdf.lastCellPos.h + 20;
          } else {
            if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
              DrillForContent(cn, renderer, elementHandlers);
            }
          }
        } else if (cn.nodeType === 3) {
          renderer.addText(cn.nodeValue, fragmentCSS);
        } else if (typeof cn === "string") {
          renderer.addText(cn, fragmentCSS);
        }
      }
      i++;
    }
    if (isBlock) {
      return renderer.setBlockBoundary();
    }
  };
  images = {};
  loadImgs = function(element, renderer, elementHandlers, cb) {
    var imgs = element.getElementsByTagName('img'), l = imgs.length, x = 0;
    function done() {
      DrillForContent(element, renderer, elementHandlers);
      cb(renderer.dispose());
    }
    function loadImage(url) {
      if(!url) return;
      var img = new Image();
      ++x;img.crossOrigin='';
      img.onerror = img.onload = function() {
        if(img.complete && img.width + img.height)
          images[url] = images[url] || img;
        if(!--x) done();
      };
      img.src = url;
    }
    while(l--)
      loadImage(imgs[l].getAttribute("src"));
    cb = cb || function() {};
    return x || done();
  };
  process = function(pdf, element, x, y, settings, callback) {
    var imgs, r;
    if (typeof element === "string") {
      element = (function(element) {
        var $frame, $hiddendiv, framename, visuallyhidden;
        framename = "jsPDFhtmlText" + Date.now().toString() + (Math.random() * 1000).toFixed(0);
        visuallyhidden = "position: absolute !important;" + "clip: rect(1px 1px 1px 1px); /* IE6, IE7 */" + "clip: rect(1px, 1px, 1px, 1px);" + "padding:0 !important;" + "border:0 !important;" + "height: 1px !important;" + "width: 1px !important; " + "top:auto;" + "left:-100px;" + "overflow: hidden;";
        $hiddendiv = $("<div style=\"" + visuallyhidden + "\">" + "<iframe style=\"height:1px;width:1px\" name=\"" + framename + "\" />" + "</div>").appendTo(document.body);
        $frame = window.frames[framename];
        return $($frame.document.body).html(element)[0];
      })(element);
    }
    r = new Renderer(pdf, x, y, settings);
    imgs = loadImgs.call(this, element, r, settings.elementHandlers, callback);
    return r.dispose();
  };
  Renderer.prototype.init = function() {
    this.paragraph = {
      text: [],
      style: []
    };
    return this.pdf.internal.write("q");
  };
  Renderer.prototype.dispose = function() {
    this.pdf.internal.write("Q");
    return {
      x: this.x,
      y: this.y
    };
  };
  Renderer.prototype.splitFragmentsIntoLines = function(fragments, styles) {
    var currentLineLength, defaultFontSize, ff, fontMetrics, fontMetricsCache, fragment, fragmentChopped, fragmentLength, fragmentSpecificMetrics, fs, k, line, lines, maxLineLength, style;
    defaultFontSize = 12;
    k = this.pdf.internal.scaleFactor;
    fontMetricsCache = {};
    ff = void 0;
    fs = void 0;
    fontMetrics = void 0;
    fragment = void 0;
    style = void 0;
    fragmentSpecificMetrics = void 0;
    fragmentLength = void 0;
    fragmentChopped = void 0;
    line = [];
    lines = [line];
    currentLineLength = 0;
    maxLineLength = this.settings.width;
    while (fragments.length) {
      fragment = fragments.shift();
      style = styles.shift();
      if (fragment) {
        ff = style["font-family"];
        fs = style["font-style"];
        fontMetrics = fontMetricsCache[ff + fs];
        if (!fontMetrics) {
          fontMetrics = this.pdf.internal.getFont(ff, fs).metadata.Unicode;
          fontMetricsCache[ff + fs] = fontMetrics;
        }
        fragmentSpecificMetrics = {
          widths: fontMetrics.widths,
          kerning: fontMetrics.kerning,
          fontSize: style["font-size"] * defaultFontSize,
          textIndent: currentLineLength
        };
        fragmentLength = this.pdf.getStringUnitWidth(fragment, fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
        if (currentLineLength + fragmentLength > maxLineLength) {
          fragmentChopped = this.pdf.splitTextToSize(fragment, maxLineLength, fragmentSpecificMetrics);
          line.push([fragmentChopped.shift(), style]);
          while (fragmentChopped.length) {
            line = [[fragmentChopped.shift(), style]];
            lines.push(line);
          }
          currentLineLength = this.pdf.getStringUnitWidth(line[0][0], fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
        } else {
          line.push([fragment, style]);
          currentLineLength += fragmentLength;
        }
      }
    }
    return lines;
  };
  Renderer.prototype.RenderTextFragment = function(text, style) {
    var defaultFontSize, font;
    if (this.pdf.internal.pageSize.height - this.pdf.margins_doc.bottom < this.y + this.pdf.internal.getFontSize()) {
      this.pdf.internal.write("ET", "Q");
      this.pdf.addPage();
      this.y = this.pdf.margins_doc.top;
      this.pdf.internal.write("q", "BT", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");
    }
    defaultFontSize = 12;
    font = this.pdf.internal.getFont(style["font-family"], style["font-style"]);
    return this.pdf.internal.write("/" + font.id, (defaultFontSize * style["font-size"]).toFixed(2), "Tf", "(" + this.pdf.internal.pdfEscape(text) + ") Tj");
  };
  Renderer.prototype.renderParagraph = function() {
    var blockstyle, defaultFontSize, fontToUnitRatio, fragments, i, l, line, lines, maxLineHeight, out, paragraphspacing_after, paragraphspacing_before, priorblockstype, styles;
    fragments = PurgeWhiteSpace(this.paragraph.text);
    styles = this.paragraph.style;
    blockstyle = this.paragraph.blockstyle;
    priorblockstype = this.paragraph.blockstyle || {};
    this.paragraph = {
      text: [],
      style: [],
      blockstyle: {},
      priorblockstyle: blockstyle
    };
    if (!fragments.join("").trim()) {
      return;
    }
    lines = this.splitFragmentsIntoLines(fragments, styles);
    line = void 0;
    maxLineHeight = void 0;
    defaultFontSize = 12;
    fontToUnitRatio = defaultFontSize / this.pdf.internal.scaleFactor;
    paragraphspacing_before = (Math.max((blockstyle["margin-top"] || 0) - (priorblockstype["margin-bottom"] || 0), 0) + (blockstyle["padding-top"] || 0)) * fontToUnitRatio;
    paragraphspacing_after = ((blockstyle["margin-bottom"] || 0) + (blockstyle["padding-bottom"] || 0)) * fontToUnitRatio;
    out = this.pdf.internal.write;
    i = void 0;
    l = void 0;
    this.y += paragraphspacing_before;
    out("q", "BT", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");
    while (lines.length) {
      line = lines.shift();
      maxLineHeight = 0;
      i = 0;
      l = line.length;
      while (i !== l) {
        if (line[i][0].trim()) {
          maxLineHeight = Math.max(maxLineHeight, line[i][1]["line-height"], line[i][1]["font-size"]);
        }
        i++;
      }
      out(0, (-1 * defaultFontSize * maxLineHeight).toFixed(2), "Td");
      i = 0;
      l = line.length;
      while (i !== l) {
        if (line[i][0]) {
          this.RenderTextFragment(line[i][0], line[i][1]);
        }
        i++;
      }
      this.y += maxLineHeight * fontToUnitRatio;
    }
    out("ET", "Q");
    return this.y += paragraphspacing_after;
  };
  Renderer.prototype.setBlockBoundary = function() {
    return this.renderParagraph();
  };
  Renderer.prototype.setBlockStyle = function(css) {
    return this.paragraph.blockstyle = css;
  };
  Renderer.prototype.addText = function(text, css) {
    this.paragraph.text.push(text);
    return this.paragraph.style.push(css);
  };
  FontNameDB = {
    helvetica: "helvetica",
    "sans-serif": "helvetica",
    serif: "times",
    times: "times",
    "times new roman": "times",
    monospace: "courier",
    courier: "courier"
  };
  FontWeightMap = {
    100: "normal",
    200: "normal",
    300: "normal",
    400: "normal",
    500: "bold",
    600: "bold",
    700: "bold",
    800: "bold",
    900: "bold",
    normal: "normal",
    bold: "bold",
    bolder: "bold",
    lighter: "normal"
  };
  FontStyleMap = {
    normal: "normal",
    italic: "italic",
    oblique: "italic"
  };
  UnitedNumberMap = {
    normal: 1
    /*
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
  };
  return jsPDFAPI.fromHTML = function(HTML, x, y, settings, callback, margins) {
    "use strict";
    this.margins_doc = margins || {top:0,bottom:0};
    return process(this, HTML, x, y, settings, callback);
  };
})(jsPDF.API);

/***********************************************
* FILE: jspdf.plugin.javascript.js
***********************************************/
/** ==================================================================== 
 * jsPDF JavaScript plugin
 * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
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

/*global jsPDF */

(function (jsPDFAPI) {
    'use strict';
    var jsNamesObj, jsJsObj, text;
    jsPDFAPI.addJS = function (txt) {
        text = txt;
        this.internal.events.subscribe(
            'postPutResources',
            function (txt) {
                jsNamesObj = this.internal.newObject();
                this.internal.write('<< /Names [(EmbeddedJS) ' + (jsNamesObj + 1) + ' 0 R] >>', 'endobj');
                jsJsObj = this.internal.newObject();
                this.internal.write('<< /S /JavaScript /JS (', text, ') >>', 'endobj');
            }
        );
        this.internal.events.subscribe(
            'putCatalog',
            function () {
                if (jsNamesObj !== undefined && jsJsObj !== undefined) {
                    this.internal.write('/Names <</JavaScript ' + jsNamesObj + ' 0 R>>');
                }
            }
        );
        return this;
    };
}(jsPDF.API));

/***********************************************
* FILE: jspdf.plugin.png_support.js
***********************************************/
/**@preserve
 *  ==================================================================== 
 * jsPDF [NAME] plugin
 * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
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
	
	/*
	 * @see http://www.w3.org/TR/PNG-Chunks.html
	 * 
	 Color    Allowed      Interpretation
	 Type     Bit Depths
	   
	   0       1,2,4,8,16  Each pixel is a grayscale sample.
	   
	   2       8,16        Each pixel is an R,G,B triple.
	   
	   3       1,2,4,8     Each pixel is a palette index;
	                       a PLTE chunk must appear.
	   
	   4       8,16        Each pixel is a grayscale sample,
	                       followed by an alpha sample.
	   
	   6       8,16        Each pixel is an R,G,B triple,
	                       followed by an alpha sample.
	*/
	
	/*
	 * PNG filter method types
	 * 
	 * @see http://www.w3.org/TR/PNG-Filters.html
	 * @see http://www.libpng.org/pub/png/book/chapter09.html
	 * 
	 * This is what the value 'Predictor' in decode params relates to
	 * 
	 * 15 is "optimal prediction", which means the prediction algorithm can change from line to line.
	 * In that case, you actually have to read the first byte off each line for the prediction algorthim (which should be 0-4, corresponding to PDF 10-14) and select the appropriate unprediction algorithm based on that byte.
	 *
	   0       None
	   1       Sub
	   2       Up
	   3       Average
	   4       Paeth
	 */
	
	var doesNotHavePngJS = function() {
		return typeof PNG !== 'function' || typeof FlateStream !== 'function';
	}
	, canCompress = function(value) {
		return value !== jsPDFAPI.image_compression.NONE && hasCompressionJS();
	}
	, hasCompressionJS = function() {
		var inst = typeof Deflater === 'function';
		if(!inst)
			throw new Error("requires deflate.js for compression")
		return inst;
	}
	, compressBytes = function(bytes, lineLength, colorsPerPixel, compression) {
		
		var level = 5,
			filter_method = filterUp;
		
		switch(compression) {
		
			case jsPDFAPI.image_compression.FAST:
				
				level = 3;
				filter_method = filterSub;
				break;
				
			case jsPDFAPI.image_compression.MEDIUM:
				
				level = 6;
				filter_method = filterAverage;
				break;
				
			case jsPDFAPI.image_compression.SLOW:
				
				level = 9;
				filter_method = filterPaeth;//uses to sum to choose best filter for each line
				break;
		}
		
		bytes = applyPngFilterMethod(bytes, lineLength, colorsPerPixel, filter_method);
		
		var header = new Uint8Array(createZlibHeader(level));
		var checksum = adler32(bytes);
		
		var deflate = new Deflater(level);
		var a = deflate.append(bytes);
		var cBytes = deflate.flush();
		
		var len = header.length + a.length + cBytes.length;
		
		var cmpd = new Uint8Array(len + 4);
		cmpd.set(header);
		cmpd.set(a, header.length);
		cmpd.set(cBytes, header.length + a.length);
		
		cmpd[len++] = (checksum >>> 24) & 0xff;
		cmpd[len++] = (checksum >>> 16) & 0xff;
		cmpd[len++] = (checksum >>> 8) & 0xff;
		cmpd[len++] = checksum & 0xff;
		
		return jsPDFAPI.arrayBufferToBinaryString(cmpd);
	}
	, createZlibHeader = function(bytes, level){
		/*
		 * @see http://www.ietf.org/rfc/rfc1950.txt for zlib header 
		 */
		var cm = 8;
        var cinfo = Math.LOG2E * Math.log(0x8000) - 8;
        var cmf = (cinfo << 4) | cm;
        
        var hdr = cmf << 8;
        var flevel = Math.min(3, ((level - 1) & 0xff) >> 1);
        
        hdr |= (flevel << 6);
        hdr |= 0;//FDICT
        hdr += 31 - (hdr % 31);
        
        return [cmf, (hdr & 0xff) & 0xff];
	}
	, adler32 = function(array, param) {
		var adler = 1;
	    var s1 = adler & 0xffff,
	        s2 = (adler >>> 16) & 0xffff;
	    var len = array.length;
	    var tlen;
	    var i = 0;

	    while (len > 0) {
	      tlen = len > param ? param : len;
	      len -= tlen;
	      do {
	        s1 += array[i++];
	        s2 += s1;
	      } while (--tlen);

	      s1 %= 65521;
	      s2 %= 65521;
	    }

	    return ((s2 << 16) | s1) >>> 0;
	}
	, applyPngFilterMethod = function(bytes, lineLength, colorsPerPixel, filter_method) {
		var lines = bytes.length / lineLength,
			result = new Uint8Array(bytes.length + lines),
			filter_methods = getFilterMethods(),
			i = 0, line, prevLine, offset;
		
		for(; i < lines; i++) {
			offset = i * lineLength;
			line = bytes.subarray(offset, offset + lineLength);
			
			if(filter_method) {
				result.set(filter_method(line, colorsPerPixel, prevLine), offset + i);
				
			}else{
			
				var j = 0,
					len = filter_methods.length,
					results = [];
				
				for(; j < len; j++)
					results[j] = filter_methods[j](line, colorsPerPixel, prevLine);
				
				var ind = getIndexOfSmallestSum(results.concat());
				
				result.set(results[ind], offset + i);
			}
			
			prevLine = line;
		}
		
		return result;
	}
	, filterNone = function(line, colorsPerPixel, prevLine) {
		/*var result = new Uint8Array(line.length + 1);
		result[0] = 0;
		result.set(line, 1);*/
		
		var result = Array.apply([], line);
		result.unshift(0);

		return result;
	}
	, filterSub = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			left;
		
		result[0] = 1;
		
		for(; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			result[i + 1] = (line[i] - left + 0x0100) & 0xff;
		}
		
		return result;
	}
	, filterUp = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			up;
		
		result[0] = 2;
		
		for(; i < len; i++) {
			up = prevLine && prevLine[i] || 0;
			result[i + 1] = (line[i] - up + 0x0100) & 0xff;
		}
		
		return result;
	}
	, filterAverage = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			left,
			up;
	
		result[0] = 3;
		
		for(; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			up = prevLine && prevLine[i] || 0;
			result[i + 1] = (line[i] + 0x0100 - ((left + up) >>> 1)) & 0xff;
		}
		
		return result;
	}
	, filterPaeth = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			left,
			up,
			upLeft,
			paeth;
		
		result[0] = 4;
		
		for(; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			up = prevLine && prevLine[i] || 0;
			upLeft = prevLine && prevLine[i - colorsPerPixel] || 0;
			paeth = paethPredictor(left, up, upLeft);
			result[i + 1] = (line[i] - paeth + 0x0100) & 0xff;
		}
		
		return result;
	}
	,paethPredictor = function(left, up, upLeft) {

		var p = left + up - upLeft,
	        pLeft = Math.abs(p - left),
	        pUp = Math.abs(p - up),
	        pUpLeft = Math.abs(p - upLeft);
		
		return (pLeft <= pUp && pLeft <= pUpLeft) ? left : (pUp <= pUpLeft) ? up : upLeft;
	}
	, getFilterMethods = function() {
		return [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
	}
	,getIndexOfSmallestSum = function(arrays) {
		var i = 0,
			len = arrays.length,
			sum, min, ind;
		
		while(i < len) {
			sum = absSum(arrays[i].slice(1));
			
			if(sum < min || !min) {
				min = sum;
				ind = i;
			}
			
			i++;
		}
		
		return ind;
	}
	, absSum = function(array) {
		var i = 0,
			len = array.length,
			sum = 0;
	
		while(i < len)
			sum += Math.abs(array[i++]);
			
		return sum;
	}
	, logImg = function(img) {
		console.log("width: " + img.width);
		console.log("height: " + img.height);
		console.log("bits: " + img.bits);
		console.log("colorType: " + img.colorType);
		console.log("transparency:");
		console.log(img.transparency);
		console.log("text:");
		console.log(img.text);
		console.log("compressionMethod: " + img.compressionMethod);
		console.log("filterMethod: " + img.filterMethod);
		console.log("interlaceMethod: " + img.interlaceMethod);
		console.log("imgData:");
		console.log(img.imgData);
		console.log("palette:");
		console.log(img.palette);
		console.log("colors: " + img.colors);
		console.log("colorSpace: " + img.colorSpace);
		console.log("pixelBitlength: " + img.pixelBitlength);
		console.log("hasAlphaChannel: " + img.hasAlphaChannel);
	};
	
	
	
	
	jsPDFAPI.processPNG = function(imageData, imageIndex, alias, compression, dataAsBinaryString) {
		'use strict'
		
		var colorSpace = this.color_spaces.DEVICE_RGB,
			decode = this.decode.FLATE_DECODE,
			bpc = 8,
			img, dp, trns,
			colors, pal, smask;
		
		if(this.isString(imageData)) {
			
		}
		
		if(this.isArrayBuffer(imageData))
			imageData = new Uint8Array(imageData);
		
		if(this.isArrayBufferView(imageData)) {
			
			if(doesNotHavePngJS())
				throw new Error("PNG support requires png.js and zlib.js");
				
			img = new PNG(imageData);
			imageData = img.imgData;
			bpc = img.bits;
			colorSpace = img.colorSpace;
			colors = img.colors;
			
			//logImg(img);
			
			/*
			 * colorType 6 - Each pixel is an R,G,B triple, followed by an alpha sample.
			 * 
			 * colorType 4 - Each pixel is a grayscale sample, followed by an alpha sample.
			 * 
			 * Extract alpha to create two separate images, using the alpha as a sMask
			 */
			if([4,6].indexOf(img.colorType) !== -1) {
				
				/*
				 * processes 8 bit RGBA and grayscale + alpha images
				 */
				if(img.bits === 8) {
				
					var pixelsArrayType = window['Uint' + img.pixelBitlength + 'Array'],
						pixels = new pixelsArrayType(img.decodePixels().buffer),
						len = pixels.length,
						imgData = new Uint8Array(len * img.colors),
						alphaData = new Uint8Array(len),
						pDiff = img.pixelBitlength - img.bits,
						i = 0, n = 0, pixel, pbl;
				
					for(; i < len; i++) {
						pixel = pixels[i];
						pbl = 0;
						
						while(pbl < pDiff) {
							
							imgData[n++] = ( pixel >>> pbl ) & 0xff;
							pbl = pbl + img.bits;
						}
						
						alphaData[i] = ( pixel >>> pbl ) & 0xff;
					}
				}
				
				/*
				 * processes 16 bit RGBA and grayscale + alpha images
				 */
				if(img.bits === 16) {
					
					var pixels = new Uint32Array(img.decodePixels().buffer),
						len = pixels.length,
						imgData = new Uint8Array((len * (32 / img.pixelBitlength) ) * img.colors),
						alphaData = new Uint8Array(len * (32 / img.pixelBitlength) ),
						hasColors = img.colors > 1,
						i = 0, n = 0, a = 0, pixel;
					
					while(i < len) {
						pixel = pixels[i++];
						
						imgData[n++] = (pixel >>> 0) & 0xFF;
						
						if(hasColors) {
							imgData[n++] = (pixel >>> 16) & 0xFF;
							
							pixel = pixels[i++];
							imgData[n++] = (pixel >>> 0) & 0xFF;
						}
						
						alphaData[a++] = (pixel >>> 16) & 0xFF;
					}
					
					bpc = 8;
				}
				
				if(canCompress(compression)) {
										
					imageData = compressBytes(imgData, img.width * img.colors, img.colors, compression);
					smask = compressBytes(alphaData, img.width, 1, compression);
					
				}else{
					
					imageData = imgData;
					smask = alphaData;
					decode = null;
				}
			}
			
			/*
			 * Indexed png. Each pixel is a palette index.
			 */
			if(img.colorType === 3) {
				
				colorSpace = this.color_spaces.INDEXED;
				pal = img.palette;
				
				if(img.transparency.indexed) {
					
					var trans = img.transparency.indexed;
					
					var total = 0,
						i = 0,
						len = trans.length;

					for(; i<len; ++i)
					    total += trans[i];
					
					total = total / 255;
					
					/*
					 * a single color is specified as 100% transparent (0),
					 * so we set trns to use a /Mask with that index
					 */
					if(total === len - 1 && trans.indexOf(0) !== -1) {
						trns = [trans.indexOf(0)];
					
					/*
					 * there's more than one colour within the palette that specifies
					 * a transparency value less than 255, so we unroll the pixels to create an image sMask
					 */
					}else if(total !== len){
						
						var pixels = img.decodePixels(),
							alphaData = new Uint8Array(pixels.length),
							i = 0,
							len = pixels.length;
						
						for(; i < len; i++)
							alphaData[i] = trans[pixels[i]];
						
						smask = compressBytes(alphaData, img.width, 1);
					}
				}
			}
			
			if(decode === this.decode.FLATE_DECODE)
				dp = '/Predictor 15 /Colors '+ colors +' /BitsPerComponent '+ bpc +' /Columns '+ img.width;
			else
				//remove 'Predictor' as it applies to the type of png filter applied to its IDAT - we only apply with compression
				dp = '/Colors '+ colors +' /BitsPerComponent '+ bpc +' /Columns '+ img.width;
			
			if(this.isArrayBuffer(imageData) || this.isArrayBufferView(imageData))
				imageData = this.arrayBufferToBinaryString(imageData);
			
			if(smask && this.isArrayBuffer(smask) || this.isArrayBufferView(smask))
				smask = this.arrayBufferToBinaryString(smask);
			
			return this.createImageInfo(imageData, img.width, img.height, colorSpace,
										bpc, decode, imageIndex, alias, dp, trns, pal, smask);
		}
		
		return info;
	}

})(jsPDF.API)

/***********************************************
* FILE: jspdf.plugin.sillysvgrenderer.js
***********************************************/
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
		throw new Error("addSVG needs values for 'x' and 'y'");
	}

    function InjectCSS(cssbody, document) {
        var styletag = document.createElement('style');
        styletag.type = 'text/css';
        if (styletag.styleSheet) {
        	// ie
            styletag.styleSheet.cssText = cssbody;
        } else {
        	// others
            styletag.appendChild(document.createTextNode(cssbody));
        }
        document.getElementsByTagName("head")[0].appendChild(styletag);
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

})(jsPDF.API);

/***********************************************
* FILE: jspdf.plugin.split_text_to_size.js
***********************************************/
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

/***********************************************
* FILE: jspdf.plugin.standard_fonts_metrics.js
***********************************************/
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

/***********************************************
* FILE: jspdf.plugin.total_pages.js
***********************************************/
/** ==================================================================== 
 * jsPDF total_pages plugin
 * Copyright (c) 2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
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
'use strict';

jsPDFAPI.putTotalPages = function(pageExpression) {
	'use strict';
        var replaceExpression = new RegExp(pageExpression, 'g');
        for (var n = 1; n <= this.internal.getNumberOfPages(); n++) {
            for (var i = 0; i < this.internal.pages[n].length; i++)
               this.internal.pages[n][i] = this.internal.pages[n][i].replace(replaceExpression, this.internal.getNumberOfPages());
        }
	return this;
};

})(jsPDF.API);
return jsPDF;
});
