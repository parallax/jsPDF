/**
 * jsPDF
 * (c) 2010 James Hall
 * 
 * Some parts based on FPDF.
 */

var jsPDF = function(orientation, unit, format){
	
	// Default parameter values
	if (typeof orientation === 'undefined') orientation = 'P';
	if (typeof unit === 'undefined') unit = 'mm';
	if (typeof format === 'undefined') format = 'a4';
	
	// Private properties
	var version = '20100328';
	var buffer = '';
	
	var pdfVersion = '1.3'; // PDF Version
	var pageFormats = { // Size in pt of various paper formats
		'a3': [841.89, 1190.55],
		'a4': [595.28, 841.89],
		'a5': [420.94, 595.28],
		'letter': [612, 792],
		'legal': [612, 1008]
	};
	var textColor = '0 g';
	var drawColor = '0 G';
	var page = 0;
	var objectNumber = 2; // 'n' Current object number
	var state = 0; // Current document state
	var pages = new Array();
	var offsets = new Array(); // List of offsets
	var lineWidth = 0.200025; // 2mm
	var pageHeight;
	var pageWidth;
	var k; // Scale factor
	var fontNumber; // @TODO: This is temp, replace with real font handling
	var documentProperties = {};
	var fontSize = 16; // Default font size
	var pageFontSize = 16;

	// Initilisation 
	if (unit == 'pt') {
		k = 1;
	} else if(unit == 'mm') {
		k = 72/25.4;
	} else if(unit == 'cm') {
		k = 72/2.54;
	} else if(unit == 'in') {
		k = 72;
	} else {
		throw('Invalid unit: ' + unit);
	}
	
	// Dimensions are stored as user units and converted to points on output
	var format_as_string = format.toString().toLowerCase();
	if (format_as_string in pageFormats) {
		pageHeight = pageFormats[format_as_string][1] / k;
		pageWidth = pageFormats[format_as_string][0] / k;
	} else {
		try {
			pageHeight = format[1];
			pageWidth = format[0];
		} 
		catch(err) {
			throw('Invalid format: ' + format);
		}
	}
	
	orientation = orientation.toString().toLowerCase();
	if (orientation === 'p' || orientation === 'portrait') {
		orientation = 'p';
	} else if (orientation === 'l' || orientation === 'landscape') {
		orientation = 'l';
		var tmp = pageWidth;
		pageWidth = pageHeight;
		pageHeight = tmp;
	} else {
		throw('Invalid orientation: ' + orientation);
	}
	
	
	// Private functions
	var newObject = function() {
		// Begin a new object
		objectNumber ++;
		offsets[objectNumber] = buffer.length;
		out(objectNumber + ' 0 obj');		
	}
	
	
	var putHeader = function() {
		out('%PDF-' + pdfVersion);
	}
	
	var putPages = function() {
		var wPt = pageWidth * k;
		var hPt = pageHeight * k;

		for(n=1; n <= page; n++) {
			newObject();
			out('<</Type /Page');
			out('/Parent 1 0 R');	
			out('/Resources 2 0 R');
			out('/Contents ' + (objectNumber + 1) + ' 0 R>>');
			out('endobj');
			
			// Page content
			p = pages[n];
			newObject();
			out('<</Length ' + p.length  + '>>');
			putStream(p);
			out('endobj');					
		}
		offsets[1] = buffer.length;
		out('1 0 obj');
		out('<</Type /Pages');
		var kids = '/Kids [';
		for (i = 0; i < page; i++) {
			kids += (3 + 2 * i) + ' 0 R ';
		}
		out(kids + ']');
		out('/Count ' + page);
		out(sprintf('/MediaBox [0 0 %.2f %.2f]', wPt, hPt));
		out('>>');
		out('endobj');		
	}
	
	var putStream = function(str) {
		out('stream');
		out(str);
		out('endstream');
	}
	
	var putResources = function() {
		putFonts();
		putImages();
		
		// Resource dictionary
		offsets[2] = buffer.length;
		out('2 0 obj');
		out('<<');
		putResourceDictionary();
		out('>>');
		out('endobj');
	}	
	
	var putFonts = function() {
		// @TODO: Only supports core font hardcoded to Helvetica
		newObject();
		fontNumber = objectNumber;
		name = 'Helvetica';
		out('<</Type /Font');
		out('/BaseFont /' + name);
		out('/Subtype /Type1');
		out('/Encoding /WinAnsiEncoding');
		out('>>');
		out('endobj');
	}
	
	var putImages = function() {
		// @TODO: Implement image functionality
	}
	
	var putResourceDictionary = function() {
		out('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]');
		out('/Font <<');
		// Do this for each font, the '1' bit is the index of the font
		// fontNumber is currently the object number related to 'putFonts'
		out('/F1 ' + fontNumber + ' 0 R');
		out('>>');
		out('/XObject <<');
		putXobjectDict();
		out('>>');
	}
	
	var putXobjectDict = function() {
		// @TODO: Loop through images, or other data objects
	}
	
	
	var putInfo = function() {
		out('/Producer (jsPDF ' + version + ')');
		if(documentProperties.title != undefined) {
			out('/Title (' + pdfEscape(documentProperties.title) + ')');
		}
		if(documentProperties.subject != undefined) {
			out('/Subject (' + pdfEscape(documentProperties.subject) + ')');
		}
		if(documentProperties.author != undefined) {
			out('/Author (' + pdfEscape(documentProperties.author) + ')');
		}
		if(documentProperties.keywords != undefined) {
			out('/Keywords (' + pdfEscape(documentProperties.keywords) + ')');
		}
		if(documentProperties.creator != undefined) {
			out('/Creator (' + pdfEscape(documentProperties.creator) + ')');
		}		
		var created = new Date();
		var year = created.getFullYear();
		var month = (created.getMonth() + 1);
		var day = created.getDate();
		var hour = created.getHours();
		var minute = created.getMinutes();
		var second = created.getSeconds();
		out('/CreationDate (D:' + sprintf('%02d%02d%02d%02d%02d%02d', year, month, day, hour, minute, second) + ')');
	}
	
	var putCatalog = function () {
		out('/Type /Catalog');
		out('/Pages 1 0 R');
		// @TODO: Add zoom and layout modes
		out('/OpenAction [3 0 R /FitH null]');
		out('/PageLayout /OneColumn');
	}	
	
	function putTrailer() {
		out('/Size ' + (objectNumber + 1));
		out('/Root ' + objectNumber + ' 0 R');
		out('/Info ' + (objectNumber - 1) + ' 0 R');
	}	
	
	var endDocument = function() {
		state = 1;
		putHeader();
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
		var o = buffer.length;
		out('xref');
		out('0 ' + (objectNumber + 1));
		out('0000000000 65535 f ');
		for (var i=1; i <= objectNumber; i++) {
			out(sprintf('%010d 00000 n ', offsets[i]));
		}
		// Trailer
		out('trailer');
		out('<<');
		putTrailer();
		out('>>');
		out('startxref');
		out(o);
		out('%%EOF');
		state = 3;		
	}
	
	var beginPage = function() {
		page ++;
		// Do dimension stuff
		state = 2;
		pages[page] = '';
	}
	
	var out = function(string) {
		if(state == 2) {
			pages[page] += string + '\n';
		} else {
			buffer += string + '\n';
		}
	}
	
	var _addPage = function() {
		beginPage();
		// Set line width
		out(sprintf('%.2f w', (lineWidth * k)));
		// Set draw color
		out(drawColor);
		
		// Set font - TODO
		// 16 is the font size
		pageFontSize = fontSize;
		out('BT /F1 ' + parseInt(fontSize) + '.00 Tf ET'); 		
	}
	
	// Add the first page automatically
	_addPage();	

	// Escape text
	var pdfEscape = function(text) {
		return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
	}
	
	var _jsPDF = {
		addPage: function() {
			_addPage();
			return _jsPDF;
		},
		text: function(x, y, text) {
			// need page height
			if(pageFontSize != fontSize) {
				out('BT /F1 ' + parseInt(fontSize) + '.00 Tf ET');
				pageFontSize = fontSize;
			}
			var str = sprintf('BT %.2f %.2f Td (%s) Tj ET', x * k, (pageHeight - y) * k, pdfEscape(text));
			out(str);
			return _jsPDF;
		},
		line: function(x1, y1, x2, y2) {
			var str = sprintf('%.2f %.2f m %.2f %.2f l S',x1 * k, (pageHeight - y1) * k, x2 * k, (pageHeight - y2) * k);
			out(str);
			return _jsPDF;
		},
		rect: function(x, y, w, h, style) {
			var op = 'S';
			if (style === 'F') {
				op = 'f';
			} else if (style === 'FD' || style === 'DF') {
				op = 'B';
			}
			out(sprintf('%.2f %.2f %.2f %.2f re %s', x * k, (pageHeight - y) * k, w * k, -h * k, op));
		},
		setProperties: function(properties) {
			documentProperties = properties;
			return _jsPDF;
		},
		addImage: function(imageData, format, x, y, w, h) {
			return _jsPDF;
		},
		output: function(type, options) {
			endDocument();
			if(type == undefined) {
				return buffer;
			}
			if(type == 'datauri') {
				document.location.href = 'data:application/pdf;base64,' + Base64.encode(buffer);
			}
			// @TODO: Add different output options
		},
		setFontSize: function(size) {
			fontSize = size;
			return _jsPDF;
		},
		setLineWidth: function(width) {
			out(sprintf('%.2f w', (width * k)));
			return _jsPDF;
		},
		setDrawColor: function(r,g,b) {
			var color;
			if ((r===0 && g===0 && b===0) || (typeof g === 'undefined')) {
				color = sprintf('%.3f G', r/255);
			} else {
				color = sprintf('%.3f %.3f %.3f RG', r/255, g/255, b/255);
			}
			out(color);
			return _jsPDF;
		}
	};
	return _jsPDF;

};
