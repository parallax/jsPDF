(function (jsPDFAPI) {
	'use strict';
	
		var glyID = [0];
		var width = {};
		var data;
      /**************************************************/
      /* function : toHex                               */
      /* comment : Replace str with a hex string.       */
      /**************************************************/
      function toHex(str) {
        var hex = '';
        for (var i = 0; i < str.length; i++) {
          hex += '' + str.charCodeAt(i).toString(16);
        }
        return hex;
      }
		
      /***************************************************************************************************/
      /* function : pdfEscape16                                                                          */
      /* comment : The character id of a 2-byte string is converted to a hexadecimal number by obtaining */
      /*   the corresponding glyph id and width, and then adding padding to the string.                  */
      /***************************************************************************************************/
		  var pdfEscape16 = function (text, activeFontKey) {
			var padz = ["", "0", "00", "000", "0000"];
			var ar = [""];
			for (var i = 0, l = text.length, t; i < l; ++i) {
			  t = fonts[activeFontKey].metadata.characterToGlyph(text.charCodeAt(i))
			  glyID.push(t);
			  if (width[fonts[activeFontKey].fontName].indexOf(t) == -1) {
				width[fonts[activeFontKey].fontName].push(t);
				width[fonts[activeFontKey].fontName].push([parseInt(fonts[activeFontKey].metadata.widthOfGlyph(t), 10)]);
			  }
			  if (t == '0') { //Spaces are not allowed in cmap.
				return ar.join("");
			  } else {
				t = t.toString(16);
				ar.push(padz[4 - t.length], t);
			  }
			}
			return ar.join("");
		  };
		
	
		if (jsPDF.FunctionsPool === undefined) {
			jsPDF.FunctionsPool = {};
		}
		if (jsPDF.FunctionsPool.putFont === undefined) {
			jsPDF.FunctionsPool.putFont = [];
		}
		
		var identityHFunction = function (args) {
			var font = args.font;
			
			if ((font.id).slice(1) >= 14 && font.encoding === 'Identity-H') { //Tag with Identity-H
			  var data = font.metadata.subset.encode(glyID);
			  var pdfOutput = data;
			  var pdfOutput2 = "";
			  for (var i = 0; i < pdfOutput.length; i++) {
				pdfOutput2 += String.fromCharCode(pdfOutput[i]);
			  }
			  var fontTable = newObject();
			  out('<<');
			  out('/Length ' + pdfOutput2.length);
			  out('/Length1 ' + pdfOutput2.length);
			  out('>>');
			  out('stream');
			  out(pdfOutput2);
			  out('endstream');
			  out('endobj');
			  var fontDescriptor = newObject();
			  out('<<');
			  out('/Type /FontDescriptor');
			  out('/FontName /' + font.fontName);
			  out('/FontFile2 ' + fontTable + ' 0 R');
			  out('/FontBBox ' + PDFObject.convert(font.metadata.bbox));
			  out('/Flags ' + font.metadata.flags);
			  out('/StemV ' + font.metadata.stemV);
			  out('/ItalicAngle ' + font.metadata.italicAngle);
			  out('/Ascent ' + font.metadata.ascender);
			  out('/Descent ' + font.metadata.decender);
			  out('/CapHeight ' + font.metadata.capHeight);
			  out('>>');
			  out('endobj');
			  var DescendantFonts = newObject();
			  out('<</DW 1000/Subtype/CIDFontType2/CIDSystemInfo<</Supplement 0/Registry(Adobe)/Ordering(' + font.encoding + ')>>/Type/Font/BaseFont/' + font.fontName + '/FontDescriptor ' + fontDescriptor + ' 0 R/W' + PDFObject.convert(width[font.fontName]) + '/CIDToGIDMap/' + font.encoding + '>>');
			  out('endobj');
			  font.objectNumber = newObject();
			  out('<</Subtype/Type0/Type/Font/BaseFont/' + font.fontName + '/Encoding/' + font.encoding + '/DescendantFonts[' + DescendantFonts + ' 0 R]>>');
			  out('endobj');
			  args.mutex.result = true;
			}
			return args;
		}
		
		jsPDF.FunctionsPool.putFont.push(
			identityHFunction
		);
		
		var winAnsiEncodingFunction = function (args) {
			var font = args.font;
			
			if ((font.id).slice(1) >= 14 && font.encoding === 'WinAnsiEncoding') { //Tag with WinAnsi encoding
			  var data = font.metadata.rawData;
			  var pdfOutput = data;
			  var pdfOutput2 = "";
			  for (var i = 0; i < pdfOutput.length; i++) {
				pdfOutput2 += String.fromCharCode(pdfOutput[i]);
			  }
			  var fontTable = newObject();
			  out('<<');
			  out('/Length ' + pdfOutput2.length);
			  out('/Length1 ' + pdfOutput2.length);
			  out('>>');
			  out('stream');
			  out(pdfOutput2);
			  out('endstream');
			  out('endobj');
			  var fontDescriptor = newObject();
			  out('<<');
			  out('/Descent ' + font.metadata.decender);
			  out('/CapHeight ' + font.metadata.capHeight);
			  out('/StemV ' + font.metadata.stemV);
			  out('/Type /FontDescriptor');
			  out('/FontFile2 ' + fontTable + ' 0 R');
			  out('/Flags 96');
			  out('/FontBBox ' + PDFObject.convert(font.metadata.bbox));
			  out('/FontName /' + font.fontName);
			  out('/ItalicAngle ' + font.metadata.italicAngle);
			  out('/Ascent ' + font.metadata.ascender);
			  out('>>');
			  out('endobj');
			  font.objectNumber = newObject();
			  for (var i = 0; i < font.metadata.hmtx.widths.length; i++)
				font.metadata.hmtx.widths[i] = parseInt(font.metadata.hmtx.widths[i] * (1000 / font.metadata.head.unitsPerEm)); //Change the width of Em units to Point units.
			  out('<</Subtype/TrueType/Type/Font/BaseFont/' + font.fontName + '/FontDescriptor ' + fontDescriptor + ' 0 R' + '/Encoding/' + font.encoding + ' /FirstChar 29 /LastChar 255 /Widths ' + PDFObject.convert(font.metadata.hmtx.widths) + '>>');
			  out('endobj');
			  args.mutex.result = true;
			}
			return args;
		}
		
		jsPDF.FunctionsPool.putFont.push(
			winAnsiEncodingFunction
		);
		
		
		if (jsPDF.FunctionsPool.text === undefined) {
			jsPDF.FunctionsPool.text = {
				preProcess: [],
				process: [],
				postProcess: []
			};
		}
		
		
		var utf8TextFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var tmp;
			var mutex = args.mutex || {};
			
			var scope = mutex.scope;
			var pdfEscape = mutex.pdfEscape;
			var activeFontKey = mutex.activeFontKey;
			var fonts = mutex.fonts;
			var k = mutex.k;
			var pageWidth = mutex.pageWidth;
			var pageHeight = mutex.pageHeight;
			
			var charSpace = options.charSpace || 0;
			var key, sum = 0,
			  fontSize = mutex.activeFontSize, lineHeight = 0,
			  axisCache;
	
        var str = '', 
        strCache = '',
        v = 0, 
        s = 0,
        tkey, widths, cmapConfirm;
		var strText = ''
        var strBuffer;
        var tmpSum;
        var splitNum;
        var splitSum;
		var attr;
        var key = activeFontKey;
        sum = 0;
		
		if (fonts[key].encoding !== 'Identity-H') {
			return {
				text : resultingTextArray,
				x : x,
				y : y,
				options: options,
				mutex: mutex
			};
		}
		var i = 0;
			strText = text;
			strBuffer = new Array(strText.length);
			tmpSum = sum;
			splitNum = [];
			splitSum = sum + x;
        for (s = 0; s < strText.length; s++) {
          strBuffer[s] = {
            key: null,
            words: null,
            widths: null,
            hexwords: null,
            encoding: null
          };
          if (attr)
            key = getFont(attr.font, attr.fontStyle);
          else
            key = activeFontKey;
          if (fonts[key].metadata.hasOwnProperty('cmap'))
            cmapConfirm = fonts[key].metadata.cmap.unicode.codeMap[strText[s].charCodeAt(0)]; //Make sure the cmap has the corresponding glyph id
          if (!cmapConfirm) {
            if ((strText[s].charCodeAt(0) > 44031 || (strText[s].charCodeAt(0) >= 12592 && strText[s].charCodeAt(0) <= 12912)) && !(typeof korFontKey == 'undefined')) {
              //In Korean
              key = korFontKey;
              widths = fonts[key].metadata.widthOfString(strText[s], fontSize, charSpace);
              str = strText[s];
            } else if (((strText[s].charCodeAt(0) >= 12288 && strText[s].charCodeAt(0) <= 12319) || (strText[s].charCodeAt(0) >= 12353 && strText[s].charCodeAt(0) <= 12543) || (strText[s].charCodeAt(0) >= 13056 && strText[s].charCodeAt(0) <= 13151)) && !(typeof japFontKey == 'undefined')) {
              //In Japanese
              key = japFontKey;
              widths = fonts[key].metadata.widthOfString(strText[s], fontSize, charSpace);
              str = strText[s];
            } else if ((strText[s].charCodeAt(0) >= 19968 && strText[s].charCodeAt(0) <= 40959) && !(typeof chiFontKey == 'undefined')) {
              //In Chinese
              key = chiFontKey;
              widths = fonts[key].metadata.widthOfString(strText[s], fontSize, charSpace);
              str = strText[s];
            } else if (strText[s].charCodeAt(0) < 256 && fonts[key].metadata.hasOwnProperty('Unicode')) {
              //For the default 13 font
              widths = (fonts[key].metadata.Unicode.widths[strText[s].charCodeAt(0)] / fonts[key].metadata.Unicode.widths[77]) * (fontSize + charSpace);
              str = strText[s];
            } else { //SetFont If there are other language characters in the font
              str = '';
              widths = 0;
            }
          } else {
            widths = fonts[key].metadata.widthOfString(strText[s], fontSize, charSpace);
            str = strText[s];
          }
          if (key == tkey) {
            strCache = strCache.concat(str);
          } else if (strCache == '') {
            strCache = str;
          } else {
            strBuffer[v].words = strCache;
            strBuffer[v].key = tkey;
            strBuffer[v].widths = sum;
            strBuffer[v].encoding = fonts[tkey].encoding;
            strCache = str;
            sum = 0;
            v++;
          }
          sum += widths;
          tkey = key;

          splitSum += widths;

          if (splitSum + widths > pageWidth * k) {
            splitNum.push(s);
            splitSum = 0;
            splitSum += widths + x;
          }

        }
        strBuffer[v].words = strCache;
        strBuffer[v].key = tkey;
        strBuffer[v].widths = sum;
        strBuffer[v].encoding = fonts[tkey].encoding;
        strBuffer.splice(v + 1, strText.length);

		var f2 = function(number) {
			return number.toFixed(2);
		}
		
		var resultingTextArray = []
        var printText = function (x,y,text) {
			resultingTextArray.push(text);
          return this;
        };

        for (s = 0; s < v + 1; s++) {
          if (parseInt(strBuffer[s].key.slice(1)) < 14) { //For the default 13 font
            strBuffer[s].widths = scope.getStringUnitWidth(strBuffer[s].words) * fontSize + (strBuffer[s].words.length * charSpace);
            strBuffer[s].hexwords = toHex(pdfEscape(strBuffer[s].words, strBuffer[s].key));
          } else {
            if (strBuffer[s].encoding === 'Identity-H')
              strBuffer[s].hexwords = pdfEscape16(strBuffer[s].words, strBuffer[s].key);
            else if (strBuffer[s].encoding === 'WinAnsiEncoding')
              strBuffer[s].hexwords = toHex(pdfEscape(strBuffer[s].words, strBuffer[s].key));
          }
          var splitLength = splitNum.length;
          if (splitLength == 0) {
            printText(f2(x * k + tmpSum), f2((pageHeight - y) * k), strBuffer[s].hexwords);
		  }
          else if (splitLength == 1) {
            printText(f2(x * k + tmpSum), f2((pageHeight - y) * k), strBuffer[s].hexwords.slice(0, splitNum[0] * 4));
            printText(f2(x * k), f2((pageHeight - y) * k - fontSize * splitLength), strBuffer[s].hexwords.slice(splitNum[0] * 4));
          } else {
            for (var j = 0; j < splitLength; j++) {
              if (j == 0) {
                printText(f2(x * k + tmpSum), f2((pageHeight - y) * k), strBuffer[s].hexwords.slice(0, splitNum[j] * 4));
              } else {    
                printText(f2(x * k), f2((pageHeight - y) * k - fontSize * j), strBuffer[s].hexwords.slice(splitNum[j - 1] * 4, splitNum[j] * 4));
                if (j == splitLength - 1) {
                printText(f2(x * k), f2((pageHeight - y) * k - fontSize * splitLength), strBuffer[s].hexwords.slice(splitNum[j] * 4));
                }
              }
            }
          }
        }
      
			mutex.isHex = true;
			
			return {
				text : resultingTextArray,
				x : x,
				y : y,
				options: options,
				mutex: mutex
			};
		
		}
		
		jsPDF.FunctionsPool.text.process.unshift(utf8TextFunction);
		
		
})(jsPDF.API);