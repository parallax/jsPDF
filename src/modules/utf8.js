/* global jsPDF */
/**
* @name utf8
* @module
*/
(function (jsPDF) {
    'use strict';
        var jsPDFAPI = jsPDF.API;

      /***************************************************************************************************/
      /* function : pdfEscape16                                                                          */
      /* comment : The character id of a 2-byte string is converted to a hexadecimal number by obtaining */
      /*   the corresponding glyph id and width, and then adding padding to the string.                  */
      /***************************************************************************************************/
          var pdfEscape16 = jsPDFAPI.pdfEscape16 = function (text, font) {
            var widths = font.metadata.Unicode.widths;
            var padz = ["", "0", "00", "000", "0000"];
            var ar = [""];
            for (var i = 0, l = text.length, t; i < l; ++i) {
              t = font.metadata.characterToGlyph(text.charCodeAt(i));
              font.metadata.glyIdsUsed.push(t);
              font.metadata.toUnicode[t] = text.charCodeAt(i);
              if (widths.indexOf(t) == -1) {
                widths.push(t);
                widths.push([parseInt(font.metadata.widthOfGlyph(t), 10)]);
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

          var toUnicodeCmap = function (map) {
              var code, codes, range, unicode, unicodeMap, _i, _len;
              unicodeMap = '/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000><ffff>\nendcodespacerange';
              codes = Object.keys(map).sort(function (a, b) {
                return a - b;
              });
              
              range = [];
              for (_i = 0, _len = codes.length; _i < _len; _i++) {
                code = codes[_i];
                if (range.length >= 100) {
                  unicodeMap += "\n" + range.length + " beginbfchar\n" + range.join('\n') + "\nendbfchar";
                  range = [];
                }

                if (map[code] !== undefined && map[code] !== null && typeof map[code].toString === "function") {
                  unicode = ('0000' + map[code].toString(16)).slice(-4);
                  code = ('0000' + (+code).toString(16)).slice(-4);
                  range.push("<" + code + "><" + unicode + ">");
                }
              }

              if (range.length) {
                unicodeMap += "\n" + range.length + " beginbfchar\n" + range.join('\n') + "\nendbfchar\n";
              }
              unicodeMap += 'endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend';
              return unicodeMap;
          };

          var identityHFunction = function (options) {
            var font = options.font;
            var out = options.out;
            var newObject = options.newObject;
            var putStream = options.putStream;
            var pdfEscapeWithNeededParanthesis = options.pdfEscapeWithNeededParanthesis;

              if ((font.metadata instanceof jsPDF.API.TTFFont) && (font.encoding === 'Identity-H')) { //Tag with Identity-H
                var widths = font.metadata.Unicode.widths;
                var data = font.metadata.subset.encode(font.metadata.glyIdsUsed, 1);
                var pdfOutput = data;
                var pdfOutput2 = "";
                for (var i = 0; i < pdfOutput.length; i++) {
                  pdfOutput2 += String.fromCharCode(pdfOutput[i]);
                }
                var fontTable = newObject();
                putStream({data: pdfOutput2, addLength1: true});
                out('endobj');

                var cmap = newObject();
                var cmapData = toUnicodeCmap(font.metadata.toUnicode);
                putStream({data: cmapData, addLength1: true});
                out('endobj');
                
                var fontDescriptor = newObject();
                out('<<');
                out('/Type /FontDescriptor');
                out('/FontName /' + pdfEscapeWithNeededParanthesis(font.fontName));
                out('/FontFile2 ' + fontTable + ' 0 R');
                out('/FontBBox ' + jsPDF.API.PDFObject.convert(font.metadata.bbox));
                out('/Flags ' + font.metadata.flags);
                out('/StemV ' + font.metadata.stemV);
                out('/ItalicAngle ' + font.metadata.italicAngle);
                out('/Ascent ' + font.metadata.ascender);
                out('/Descent ' + font.metadata.decender);
                out('/CapHeight ' + font.metadata.capHeight);
                out('>>');
                out('endobj');

                var DescendantFont = newObject();
                out('<<');
                out('/Type /Font');
                out('/BaseFont /' + pdfEscapeWithNeededParanthesis(font.fontName));
                out('/FontDescriptor ' + fontDescriptor + ' 0 R');
                out('/W ' + jsPDF.API.PDFObject.convert(widths));
                out('/CIDToGIDMap /Identity');
                out('/DW 1000');
                out('/Subtype /CIDFontType2');
                out('/CIDSystemInfo');
                out('<<');
                out('/Supplement 0');
                out('/Registry (Adobe)');
                out('/Ordering (' + font.encoding + ')');
                out('>>');
                out('>>');
                out('endobj');

                font.objectNumber = newObject();
                out('<<');
                out('/Type /Font');
                out('/Subtype /Type0');
                out('/ToUnicode ' + cmap + ' 0 R');
                out('/BaseFont /' + font.fontName);
                out('/Encoding /' + font.encoding);
                out('/DescendantFonts [' + DescendantFont + ' 0 R]');
                out('>>');
                out('endobj');

                font.isAlreadyPutted = true;
              }
          }
          

          jsPDFAPI.events.push([ 
              'putFont'
              ,function(args) {
                  identityHFunction(args);
          }]);

        
        var winAnsiEncodingFunction = function (options) {
            var font = options.font;
            var out = options.out;
            var newObject = options.newObject;
            var putStream = options.putStream;
            var pdfEscapeWithNeededParanthesis = options.pdfEscapeWithNeededParanthesis;
            
            if ((font.metadata instanceof jsPDF.API.TTFFont) && font.encoding === 'WinAnsiEncoding') { //Tag with WinAnsi encoding
              var data = font.metadata.rawData;
              var pdfOutput = data;
              var pdfOutput2 = "";
              for (var i = 0; i < pdfOutput.length; i++) {
                pdfOutput2 += String.fromCharCode(pdfOutput[i]);
              }
              var fontTable = newObject();
              putStream({data: pdfOutput2,addLength1: true});
              out('endobj');

              var cmap = newObject();
              var cmapData = toUnicodeCmap(font.metadata.toUnicode);
              putStream({data: cmapData, addLength1: true});
              out('endobj');
              
              var fontDescriptor = newObject();
              out('<<');
              out('/Descent ' + font.metadata.decender);
              out('/CapHeight ' + font.metadata.capHeight);
              out('/StemV ' + font.metadata.stemV);
              out('/Type /FontDescriptor');
              out('/FontFile2 ' + fontTable + ' 0 R');
              out('/Flags 96');
              out('/FontBBox ' + jsPDF.API.PDFObject.convert(font.metadata.bbox));
              out('/FontName /' + pdfEscapeWithNeededParanthesis(font.fontName));
              out('/ItalicAngle ' + font.metadata.italicAngle);
              out('/Ascent ' + font.metadata.ascender);
              out('>>');
              out('endobj');
              font.objectNumber = newObject();
              for (var j = 0; j < font.metadata.hmtx.widths.length; j++) {
                font.metadata.hmtx.widths[j] = parseInt(font.metadata.hmtx.widths[j] * (1000 / font.metadata.head.unitsPerEm)); //Change the width of Em units to Point units.
              }
              out('<</Subtype/TrueType/Type/Font/ToUnicode ' + cmap + ' 0 R/BaseFont/' + font.fontName + '/FontDescriptor ' + fontDescriptor + ' 0 R' + '/Encoding/' + font.encoding + ' /FirstChar 29 /LastChar 255 /Widths ' + jsPDF.API.PDFObject.convert(font.metadata.hmtx.widths) + '>>');
              out('endobj');
              font.isAlreadyPutted = true;
            }
        }
        
        jsPDFAPI.events.push([ 
            'putFont'
            ,function(args) {
                winAnsiEncodingFunction(args);
            }
        ]);
        
        var utf8TextFunction = function (args) {
            var text = args.text || '';
            var x = args.x;
            var y = args.y;
            var options = args.options || {};
            var mutex = args.mutex || {};
            
            var pdfEscape = mutex.pdfEscape;
            var activeFontKey = mutex.activeFontKey;
            var fonts = mutex.fonts;
            var key = activeFontKey;
    
            var str = '',
            s = 0,
            cmapConfirm;
            var strText = '';
            var encoding = fonts[key].encoding;
            
            if (fonts[key].encoding !== 'Identity-H') {
                return {
                    text : text,
                    x : x,
                    y : y,
                    options: options,
                    mutex: mutex
                };
            }
            strText = text;
            
            key = activeFontKey;
            if (Array.isArray(text)) {
                strText = text[0];
            }
          for (s = 0; s < strText.length; s += 1) {
          if (fonts[key].metadata.hasOwnProperty('cmap')) {
              cmapConfirm = fonts[key].metadata.cmap.unicode.codeMap[strText[s].charCodeAt(0)];
              /*
             if (Object.prototype.toString.call(text) === '[object Array]') {
                var i = 0;
               // for (i = 0; i < text.length; i += 1) {
                    if (Object.prototype.toString.call(text[s]) === '[object Array]') {
                        cmapConfirm = fonts[key].metadata.cmap.unicode.codeMap[strText[s][0].charCodeAt(0)]; //Make sure the cmap has the corresponding glyph id
                    } else {
                        
                    }
                //}
                
            } else {
                cmapConfirm = fonts[key].metadata.cmap.unicode.codeMap[strText[s].charCodeAt(0)]; //Make sure the cmap has the corresponding glyph id
            }*/
          }
            if (!cmapConfirm) {
                if (strText[s].charCodeAt(0) < 256 && fonts[key].metadata.hasOwnProperty('Unicode')) {
                  str += strText[s];
                } else {
                  str += '';
                }
            } else {
            str += strText[s];
            }
          }
          var result = '';
          if ((parseInt(key.slice(1)) < 14) || encoding === 'WinAnsiEncoding') { //For the default 13 font
                result = pdfEscape(str, key).split('').map(function (cv) {return cv.charCodeAt(0).toString(16)}).join('');
              } else if (encoding === 'Identity-H') {
                  result = pdfEscape16(str, fonts[key]);
              }
              mutex.isHex = true;
            
            return {
                text : result,
                x : x,
                y : y,
                options: options,
                mutex: mutex
            };
        }
        
        var utf8EscapeFunction = function(parms) {
            var text = parms.text || '',
            x = parms.x,
            y = parms.y,
            options = parms.options,
            mutex = parms.mutex;
            var tmpText = [];
            var args = {
                    text : text,
                    x : x,
                    y : y,
                    options: options,
                    mutex: mutex
                };

            if (Array.isArray(text)) {
                var i = 0;
                for (i = 0; i < text.length; i += 1) {
                    if (Array.isArray(text[i])) {
                        if (text[i].length === 3) {
                            tmpText.push([utf8TextFunction(Object.assign({}, args, {text: text[i][0]})).text, text[i][1], text[i][2]]);
                        } else {
                            tmpText.push(utf8TextFunction(Object.assign({}, args, {text: text[i]})).text);
                        }
                    } else {
                        tmpText.push(utf8TextFunction(Object.assign({}, args, {text: text[i]})).text);
                    }
                }
                parms.text = tmpText;
                
            } else {
                parms.text = utf8TextFunction(Object.assign({}, args, {text: text})).text;
            }
        }

        jsPDFAPI.events.push([ 
            'postProcessText'
            ,utf8EscapeFunction
        ]);
        
})(jsPDF);
