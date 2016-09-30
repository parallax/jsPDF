(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.jspdf = factory());
}(this, function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  /** @preserve
   * jsPDF - PDF Document creation from JavaScript
   * Version 1.3.2 Built on 2016-09-30T20:33:17.116Z
   *                           CommitID 7d854cc77d
   *
   * Copyright (c) 2010-2014 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
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
   *               2014 Steven Spungin, https://github.com/Flamenco
   *               2014 Kenneth Glassey, https://github.com/Gavvers
   *
   * Licensed under the MIT License
   *
   * Contributor(s):
   *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
   *    kim3er, mfo, alnorth, Flamenco
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
  var jsPDF = function (global) {
      'use strict';

      var pdfVersion = '1.3',
          pageFormats = { // Size in pt of various paper formats
          'a0': [2383.94, 3370.39], 'a1': [1683.78, 2383.94],
          'a2': [1190.55, 1683.78], 'a3': [841.89, 1190.55],
          'a4': [595.28, 841.89], 'a5': [419.53, 595.28],
          'a6': [297.64, 419.53], 'a7': [209.76, 297.64],
          'a8': [147.40, 209.76], 'a9': [104.88, 147.40],
          'a10': [73.70, 104.88], 'b0': [2834.65, 4008.19],
          'b1': [2004.09, 2834.65], 'b2': [1417.32, 2004.09],
          'b3': [1000.63, 1417.32], 'b4': [708.66, 1000.63],
          'b5': [498.90, 708.66], 'b6': [354.33, 498.90],
          'b7': [249.45, 354.33], 'b8': [175.75, 249.45],
          'b9': [124.72, 175.75], 'b10': [87.87, 124.72],
          'c0': [2599.37, 3676.54], 'c1': [1836.85, 2599.37],
          'c2': [1298.27, 1836.85], 'c3': [918.43, 1298.27],
          'c4': [649.13, 918.43], 'c5': [459.21, 649.13],
          'c6': [323.15, 459.21], 'c7': [229.61, 323.15],
          'c8': [161.57, 229.61], 'c9': [113.39, 161.57],
          'c10': [79.37, 113.39], 'dl': [311.81, 623.62],
          'letter': [612, 792],
          'government-letter': [576, 756],
          'legal': [612, 1008],
          'junior-legal': [576, 360],
          'ledger': [1224, 792],
          'tabloid': [792, 1224],
          'credit-card': [153, 243]
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

          this.subscribe = function (topic, callback, once) {
              if (typeof callback !== 'function') {
                  return false;
              }

              if (!topics.hasOwnProperty(topic)) {
                  topics[topic] = {};
              }

              var id = Math.random().toString(35);
              topics[topic][id] = [callback, !!once];

              return id;
          };

          this.unsubscribe = function (token) {
              for (var topic in topics) {
                  if (topics[topic][token]) {
                      delete topics[topic][token];
                      return true;
                  }
              }
              return false;
          };

          this.publish = function (topic) {
              if (topics.hasOwnProperty(topic)) {
                  var args = Array.prototype.slice.call(arguments, 1),
                      idr = [];

                  for (var id in topics[topic]) {
                      var sub = topics[topic][id];
                      try {
                          sub[0].apply(context, args);
                      } catch (ex) {
                          if (global.console) {
                              console.error('jsPDF PubSub Error', ex.message, ex);
                          }
                      }
                      if (sub[1]) idr.push(id);
                  }
                  if (idr.length) idr.forEach(this.unsubscribe);
              }
          };
      }

      /**
       * @constructor
       * @private
       */
      function jsPDF(orientation, unit, format, compressPdf) {
          var options = {};

          if ((typeof orientation === 'undefined' ? 'undefined' : _typeof(orientation)) === 'object') {
              options = orientation;

              orientation = options.orientation;
              unit = options.unit || unit;
              format = options.format || format;
              compressPdf = options.compress || options.compressPdf || compressPdf;
          }

          // Default options
          unit = unit || 'mm';
          format = format || 'a4';
          orientation = ('' + (orientation || 'P')).toLowerCase();

          var format_as_string = ('' + format).toLowerCase(),
              compress = !!compressPdf && typeof Uint8Array === 'function',
              textColor = options.textColor || '0 g',
              drawColor = options.drawColor || '0 G',
              activeFontSize = options.fontSize || 16,
              lineHeightProportion = options.lineHeight || 1.15,
              lineWidth = options.lineWidth || 0.200025,
              // 2mm
          objectNumber = 2,
              // 'n' Current object number
          outToPages = !1,
              // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
          offsets = [],
              // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
          fonts = {},
              // collection of font objects, where key is fontKey - a dynamically created label for a given font.
          fontmap = {},
              // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
          activeFontKey,
              // will be string representing the KEY of the font as combination of fontName + fontStyle
          k,
              // Scale factor
          tmp,
              page = 0,
              currentPage,
              pages = [],
              pagesContext = [],
              // same index as pages and pagedim
          pagedim = [],
              content = [],
              additionalObjects = [],
              lineCapID = 0,
              lineJoinID = 0,
              content_length = 0,
              pageWidth,
              pageHeight,
              pageMode,
              zoomMode,
              layoutMode,
              documentProperties = {
              'title': '',
              'subject': '',
              'author': '',
              'keywords': '',
              'creator': ''
          },
              API = {},
              events = new PubSub(API),


          /////////////////////
          // Private functions
          /////////////////////
          f2 = function f2(number) {
              return number.toFixed(2); // Ie, %.2f
          },
              f3 = function f3(number) {
              return number.toFixed(3); // Ie, %.3f
          },
              padd2 = function padd2(number) {
              return ('0' + parseInt(number)).slice(-2);
          },
              out = function out(string) {
              if (outToPages) {
                  /* set by beginPage */
                  pages[currentPage].push(string);
              } else {
                  // +1 for '\n' that will be used to join 'content'
                  content_length += string.length + 1;
                  content.push(string);
              }
          },
              newObject = function newObject() {
              // Begin a new object
              objectNumber++;
              offsets[objectNumber] = content_length;
              out(objectNumber + ' 0 obj');
              return objectNumber;
          },

          // Does not output the object until after the pages have been output.
          // Returns an object containing the objectId and content.
          // All pages have been added so the object ID can be estimated to start right after.
          // This does not modify the current objectNumber;  It must be updated after the newObjects are output.
          newAdditionalObject = function newAdditionalObject() {
              var objId = pages.length * 2 + 1;
              objId += additionalObjects.length;
              var obj = { objId: objId, content: '' };
              additionalObjects.push(obj);
              return obj;
          },

          // Does not output the object.  The caller must call newObjectDeferredBegin(oid) before outputing any data
          newObjectDeferred = function newObjectDeferred() {
              objectNumber++;
              offsets[objectNumber] = function () {
                  return content_length;
              };
              return objectNumber;
          },
              newObjectDeferredBegin = function newObjectDeferredBegin(oid) {
              offsets[oid] = content_length;
          },
              putStream = function putStream(str) {
              out('stream');
              out(str);
              out('endstream');
          },
              putPages = function putPages() {
              var n,
                  p,
                  arr,
                  i,
                  deflater,
                  adler32,
                  adler32cs,
                  wPt,
                  hPt,
                  pageObjectNumbers = [];

              adler32cs = global.adler32cs || jsPDF.adler32cs;
              if (compress && typeof adler32cs === 'undefined') {
                  compress = false;
              }

              // outToPages = false as set in endDocument(). out() writes to content.

              for (n = 1; n <= page; n++) {
                  pageObjectNumbers.push(newObject());
                  wPt = (pageWidth = pagedim[n].width) * k;
                  hPt = (pageHeight = pagedim[n].height) * k;
                  out('<</Type /Page');
                  out('/Parent 1 0 R');
                  out('/Resources 2 0 R');
                  out('/MediaBox [0 0 ' + f2(wPt) + ' ' + f2(hPt) + ']');
                  // Added for annotation plugin
                  events.publish('putPage', { pageNumber: n, page: pages[n] });
                  out('/Contents ' + (objectNumber + 1) + ' 0 R');
                  out('>>');
                  out('endobj');

                  // Page content
                  p = pages[n].join('\n');
                  newObject();
                  if (compress) {
                      arr = [];
                      i = p.length;
                      while (i--) {
                          arr[i] = p.charCodeAt(i);
                      }
                      adler32 = adler32cs.from(p);
                      deflater = new Deflater(6);
                      deflater.append(new Uint8Array(arr));
                      p = deflater.flush();
                      arr = new Uint8Array(p.length + 6);
                      arr.set(new Uint8Array([120, 156])), arr.set(p, 2);
                      arr.set(new Uint8Array([adler32 & 0xFF, adler32 >> 8 & 0xFF, adler32 >> 16 & 0xFF, adler32 >> 24 & 0xFF]), p.length + 2);
                      p = String.fromCharCode.apply(null, arr);
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
                  kids += pageObjectNumbers[i] + ' 0 R ';
              }
              out(kids + ']');
              out('/Count ' + page);
              out('>>');
              out('endobj');
              events.publish('postPutPages');
          },
              putFont = function putFont(font) {
              font.objectNumber = newObject();
              out('<</BaseFont/' + font.PostScriptName + '/Type/Font');
              if (typeof font.encoding === 'string') {
                  out('/Encoding/' + font.encoding);
              }
              out('/Subtype/Type1>>');
              out('endobj');
          },
              putFonts = function putFonts() {
              for (var fontKey in fonts) {
                  if (fonts.hasOwnProperty(fontKey)) {
                      putFont(fonts[fontKey]);
                  }
              }
          },
              putXobjectDict = function putXobjectDict() {
              // Loop through images, or other data objects
              events.publish('putXobjectDict');
          },
              putResourceDictionary = function putResourceDictionary() {
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
              putResources = function putResources() {
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
              putAdditionalObjects = function putAdditionalObjects() {
              events.publish('putAdditionalObjects');
              for (var i = 0; i < additionalObjects.length; i++) {
                  var obj = additionalObjects[i];
                  offsets[obj.objId] = content_length;
                  out(obj.objId + ' 0 obj');
                  out(obj.content);
                  ;
                  out('endobj');
              }
              objectNumber += additionalObjects.length;
              events.publish('postPutAdditionalObjects');
          },
              addToFontDictionary = function addToFontDictionary(fontKey, fontName, fontStyle) {
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
          addFont = function addFont(PostScriptName, fontName, fontStyle, encoding) {
              var fontKey = 'F' + (Object.keys(fonts).length + 1).toString(10),

              // This is FontObject
              font = fonts[fontKey] = {
                  'id': fontKey,
                  'PostScriptName': PostScriptName,
                  'fontName': fontName,
                  'fontStyle': fontStyle,
                  'encoding': encoding,
                  'metadata': {}
              };
              addToFontDictionary(fontKey, fontName, fontStyle);
              events.publish('addFont', font);

              return fontKey;
          },
              addFonts = function addFonts() {

              var HELVETICA = "helvetica",
                  TIMES = "times",
                  COURIER = "courier",
                  NORMAL = "normal",
                  BOLD = "bold",
                  ITALIC = "italic",
                  BOLD_ITALIC = "bolditalic",
                  encoding = 'StandardEncoding',
                  ZAPF = "zapfdingbats",
                  standardFonts = [['Helvetica', HELVETICA, NORMAL], ['Helvetica-Bold', HELVETICA, BOLD], ['Helvetica-Oblique', HELVETICA, ITALIC], ['Helvetica-BoldOblique', HELVETICA, BOLD_ITALIC], ['Courier', COURIER, NORMAL], ['Courier-Bold', COURIER, BOLD], ['Courier-Oblique', COURIER, ITALIC], ['Courier-BoldOblique', COURIER, BOLD_ITALIC], ['Times-Roman', TIMES, NORMAL], ['Times-Bold', TIMES, BOLD], ['Times-Italic', TIMES, ITALIC], ['Times-BoldItalic', TIMES, BOLD_ITALIC], ['ZapfDingbats', ZAPF]];

              for (var i = 0, l = standardFonts.length; i < l; i++) {
                  var fontKey = addFont(standardFonts[i][0], standardFonts[i][1], standardFonts[i][2], encoding);

                  // adding aliases for standard fonts, this time matching the capitalization
                  var parts = standardFonts[i][0].split('-');
                  addToFontDictionary(fontKey, parts[0], parts[1] || '');
              }
              events.publish('addFonts', { fonts: fonts, dictionary: fontmap });
          },
              SAFE = function __safeCall(fn) {
              fn.foo = function __safeCallWrapper() {
                  try {
                      return fn.apply(this, arguments);
                  } catch (e) {
                      var stack = e.stack || '';
                      if (~stack.indexOf(' at ')) stack = stack.split(" at ")[1];
                      var m = "Error in function " + stack.split("\n")[0].split('<')[0] + ": " + e.message;
                      if (global.console) {
                          global.console.error(m, e);
                          if (global.alert) alert(m);
                      } else {
                          throw new Error(m);
                      }
                  }
              };
              fn.foo.bar = fn;
              return fn.foo;
          },
              to8bitStream = function to8bitStream(text, flags) {
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

              var i, l, sourceEncoding, encodingBlock, outputEncoding, newtext, isUnicode, ch, bch;

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
              if ((flags.autoencode || outputEncoding) && fonts[activeFontKey].metadata && fonts[activeFontKey].metadata[sourceEncoding] && fonts[activeFontKey].metadata[sourceEncoding].encoding) {
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
                              newtext.push(String.fromCharCode(ch));
                          } else {
                              newtext.push(text[i]);
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
                      throw new Error("Character at position " + i + " of string '" + text + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
                  }
                  newtext.push(bch);
                  newtext.push(ch - (bch << 8));
              }
              return String.fromCharCode.apply(undefined, newtext);
          },
              pdfEscape = function pdfEscape(text, flags) {
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
              putInfo = function putInfo() {
              out('/Producer (jsPDF ' + jsPDF.version + ')');
              for (var key in documentProperties) {
                  if (documentProperties.hasOwnProperty(key) && documentProperties[key]) {
                      out('/' + key.substr(0, 1).toUpperCase() + key.substr(1) + ' (' + pdfEscape(documentProperties[key]) + ')');
                  }
              }
              var created = new Date(),
                  tzoffset = created.getTimezoneOffset(),
                  tzsign = tzoffset < 0 ? '+' : '-',
                  tzhour = Math.floor(Math.abs(tzoffset / 60)),
                  tzmin = Math.abs(tzoffset % 60),
                  tzstr = [tzsign, padd2(tzhour), "'", padd2(tzmin), "'"].join('');
              out(['/CreationDate (D:', created.getFullYear(), padd2(created.getMonth() + 1), padd2(created.getDate()), padd2(created.getHours()), padd2(created.getMinutes()), padd2(created.getSeconds()), tzstr, ')'].join(''));
          },
              putCatalog = function putCatalog() {
              out('/Type /Catalog');
              out('/Pages 1 0 R');
              // PDF13ref Section 7.2.1
              if (!zoomMode) zoomMode = 'fullwidth';
              switch (zoomMode) {
                  case 'fullwidth':
                      out('/OpenAction [3 0 R /FitH null]');
                      break;
                  case 'fullheight':
                      out('/OpenAction [3 0 R /FitV null]');
                      break;
                  case 'fullpage':
                      out('/OpenAction [3 0 R /Fit]');
                      break;
                  case 'original':
                      out('/OpenAction [3 0 R /XYZ null null 1]');
                      break;
                  default:
                      var pcn = '' + zoomMode;
                      if (pcn.substr(pcn.length - 1) === '%') zoomMode = parseInt(zoomMode) / 100;
                      if (typeof zoomMode === 'number') {
                          out('/OpenAction [3 0 R /XYZ null null ' + f2(zoomMode) + ']');
                      }
              }
              if (!layoutMode) layoutMode = 'continuous';
              switch (layoutMode) {
                  case 'continuous':
                      out('/PageLayout /OneColumn');
                      break;
                  case 'single':
                      out('/PageLayout /SinglePage');
                      break;
                  case 'two':
                  case 'twoleft':
                      out('/PageLayout /TwoColumnLeft');
                      break;
                  case 'tworight':
                      out('/PageLayout /TwoColumnRight');
                      break;
              }
              if (pageMode) {
                  /**
                   * A name object specifying how the document should be displayed when opened:
                   * UseNone      : Neither document outline nor thumbnail images visible -- DEFAULT
                   * UseOutlines  : Document outline visible
                   * UseThumbs    : Thumbnail images visible
                   * FullScreen   : Full-screen mode, with no menu bar, window controls, or any other window visible
                   */
                  out('/PageMode /' + pageMode);
              }
              events.publish('putCatalog');
          },
              putTrailer = function putTrailer() {
              out('/Size ' + (objectNumber + 1));
              out('/Root ' + objectNumber + ' 0 R');
              out('/Info ' + (objectNumber - 1) + ' 0 R');
          },
              beginPage = function beginPage(width, height) {
              // Dimensions are stored as user units and converted to points on output
              var orientation = typeof height === 'string' && height.toLowerCase();
              if (typeof width === 'string') {
                  var format = width.toLowerCase();
                  if (pageFormats.hasOwnProperty(format)) {
                      width = pageFormats[format][0] / k;
                      height = pageFormats[format][1] / k;
                  }
              }
              if (Array.isArray(width)) {
                  height = width[1];
                  width = width[0];
              }
              if (orientation) {
                  switch (orientation.substr(0, 1)) {
                      case 'l':
                          if (height > width) orientation = 's';
                          break;
                      case 'p':
                          if (width > height) orientation = 's';
                          break;
                  }
                  if (orientation === 's') {
                      tmp = width;
                      width = height;
                      height = tmp;
                  }
              }
              outToPages = true;
              pages[++page] = [];
              pagedim[page] = {
                  width: Number(width) || pageWidth,
                  height: Number(height) || pageHeight
              };
              pagesContext[page] = {};
              _setPage(page);
          },
              _addPage = function _addPage() {
              beginPage.apply(this, arguments);
              // Set line width
              out(f2(lineWidth * k) + ' w');
              // Set draw color
              out(drawColor);
              // resurrecting non-default line caps, joins
              if (lineCapID !== 0) {
                  out(lineCapID + ' J');
              }
              if (lineJoinID !== 0) {
                  out(lineJoinID + ' j');
              }
              events.publish('addPage', { pageNumber: page });
          },
              _deletePage = function _deletePage(n) {
              if (n > 0 && n <= page) {
                  pages.splice(n, 1);
                  pagedim.splice(n, 1);
                  page--;
                  if (currentPage > page) {
                      currentPage = page;
                  }
                  this.setPage(currentPage);
              }
          },
              _setPage = function _setPage(n) {
              if (n > 0 && n <= page) {
                  currentPage = n;
                  pageWidth = pagedim[n].width;
                  pageHeight = pagedim[n].height;
              }
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
          _getFont = function _getFont(fontName, fontStyle) {
              var key;

              fontName = fontName !== undefined ? fontName : fonts[activeFontKey].fontName;
              fontStyle = fontStyle !== undefined ? fontStyle : fonts[activeFontKey].fontStyle;

              if (fontName !== undefined) {
                  fontName = fontName.toLowerCase();
              }
              switch (fontName) {
                  case 'sans-serif':
                  case 'verdana':
                  case 'arial':
                  case 'helvetica':
                      fontName = 'helvetica';
                      break;
                  case 'fixed':
                  case 'monospace':
                  case 'terminal':
                  case 'courier':
                      fontName = 'courier';
                      break;
                  case 'serif':
                  case 'cursive':
                  case 'fantasy':
                  default:
                      fontName = 'times';
                      break;
              }

              try {
                  // get a string like 'F3' - the KEY corresponding tot he font + type combination.
                  key = fontmap[fontName][fontStyle];
              } catch (e) {}

              if (!key) {
                  //throw new Error("Unable to look up font label for font '" + fontName + "', '"
                  //+ fontStyle + "'. Refer to getFontList() for available fonts.");
                  key = fontmap['times'][fontStyle];
                  if (key == null) {
                      key = fontmap['times']['normal'];
                  }
              }
              return key;
          },
              buildDocument = function buildDocument() {
              outToPages = false; // switches out() to content

              objectNumber = 2;
              content_length = 0;
              content = [];
              offsets = [];
              additionalObjects = [];
              // Added for AcroForm
              events.publish('buildDocument');

              // putHeader()
              out('%PDF-' + pdfVersion);

              putPages();

              // Must happen after putPages
              // Modifies current object Id
              putAdditionalObjects();

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
              var o = content_length,
                  i,
                  p = "0000000000";
              out('xref');
              out('0 ' + (objectNumber + 1));
              out(p + ' 65535 f ');
              for (i = 1; i <= objectNumber; i++) {
                  var offset = offsets[i];
                  if (typeof offset === 'function') {
                      out((p + offsets[i]()).slice(-10) + ' 00000 n ');
                  } else {
                      out((p + offsets[i]).slice(-10) + ' 00000 n ');
                  }
              }
              // Trailer
              out('trailer');
              out('<<');
              putTrailer();
              out('>>');
              out('startxref');
              out('' + o);
              out('%%EOF');

              outToPages = true;

              return content.join('\n');
          },
              getStyle = function getStyle(style) {
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
              getArrayBuffer = function getArrayBuffer() {
              var data = buildDocument(),
                  len = data.length,
                  ab = new ArrayBuffer(len),
                  u8 = new Uint8Array(ab);

              while (len--) {
                  u8[len] = data.charCodeAt(len);
              }return ab;
          },
              getBlob = function getBlob() {
              return new Blob([getArrayBuffer()], { type: "application/pdf" });
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
          _output = SAFE(function (type, options) {
              var datauri = ('' + type).substr(0, 6) === 'dataur' ? 'data:application/pdf;base64,' + btoa(buildDocument()) : 0;

              switch (type) {
                  case undefined:
                      return buildDocument();
                  case 'save':
                      if (navigator.getUserMedia) {
                          if (global.URL === undefined || global.URL.createObjectURL === undefined) {
                              return API.output('dataurlnewwindow');
                          }
                      }
                      saveAs(getBlob(), options);
                      if (typeof saveAs.unload === 'function') {
                          if (global.setTimeout) {
                              setTimeout(saveAs.unload, 911);
                          }
                      }
                      break;
                  case 'arraybuffer':
                      return getArrayBuffer();
                  case 'blob':
                      return getBlob();
                  case 'bloburi':
                  case 'bloburl':
                      // User is responsible of calling revokeObjectURL
                      return global.URL && global.URL.createObjectURL(getBlob()) || void 0;
                  case 'datauristring':
                  case 'dataurlstring':
                      return datauri;
                  case 'dataurlnewwindow':
                      var nW = global.open(datauri);
                      if (nW || typeof safari === "undefined") return nW;
                  /* pass through */
                  case 'datauri':
                  case 'dataurl':
                      return global.document.location.href = datauri;
                  default:
                      throw new Error('Output type "' + type + '" is not supported.');
              }
              // @TODO: Add different output options
          });

          switch (unit) {
              case 'pt':
                  k = 1;
                  break;
              case 'mm':
                  k = 72 / 25.4000508;
                  break;
              case 'cm':
                  k = 72 / 2.54000508;
                  break;
              case 'in':
                  k = 72;
                  break;
              case 'px':
                  k = 96 / 72;
                  break;
              case 'pc':
                  k = 12;
                  break;
              case 'em':
                  k = 12;
                  break;
              case 'ex':
                  k = 6;
                  break;
              default:
                  throw 'Invalid unit: ' + unit;
          }

          //---------------------------------------
          // Public API

          /**
           * Object exposing internal API to plugins
           * @public
           */
          API.internal = {
              'pdfEscape': pdfEscape,
              'getStyle': getStyle,
              /**
               * Returns {FontObject} describing a particular font.
               * @public
               * @function
               * @param fontName {String} (Optional) Font's family name
               * @param fontStyle {String} (Optional) Font's style variation name (Example:"Italic")
               * @returns {FontObject}
               */
              'getFont': function getFont() {
                  return fonts[_getFont.apply(API, arguments)];
              },
              'getFontSize': function getFontSize() {
                  return activeFontSize;
              },
              'getLineHeight': function getLineHeight() {
                  return activeFontSize * lineHeightProportion;
              },
              'write': function write(string1 /*, string2, string3, etc */) {
                  out(arguments.length === 1 ? string1 : Array.prototype.join.call(arguments, ' '));
              },
              'getCoordinateString': function getCoordinateString(value) {
                  return f2(value * k);
              },
              'getVerticalCoordinateString': function getVerticalCoordinateString(value) {
                  return f2((pageHeight - value) * k);
              },
              'collections': {},
              'newObject': newObject,
              'newAdditionalObject': newAdditionalObject,
              'newObjectDeferred': newObjectDeferred,
              'newObjectDeferredBegin': newObjectDeferredBegin,
              'putStream': putStream,
              'events': events,
              // ratio that you use in multiplication of a given "size" number to arrive to 'point'
              // units of measurement.
              // scaleFactor is set at initialization of the document and calculated against the stated
              // default measurement units for the document.
              // If default is "mm", k is the number that will turn number in 'mm' into 'points' number.
              // through multiplication.
              'scaleFactor': k,
              'pageSize': {
                  get width() {
                      return pageWidth;
                  },
                  get height() {
                      return pageHeight;
                  }
              },
              'output': function output(type, options) {
                  return _output(type, options);
              },
              'getNumberOfPages': function getNumberOfPages() {
                  return pages.length - 1;
              },
              'pages': pages,
              'out': out,
              'f2': f2,
              'getPageInfo': function getPageInfo(pageNumberOneBased) {
                  var objId = (pageNumberOneBased - 1) * 2 + 3;
                  return { objId: objId, pageNumber: pageNumberOneBased, pageContext: pagesContext[pageNumberOneBased] };
              },
              'getCurrentPageInfo': function getCurrentPageInfo() {
                  var objId = (currentPage - 1) * 2 + 3;
                  return { objId: objId, pageNumber: currentPage, pageContext: pagesContext[currentPage] };
              },
              'getPDFVersion': function getPDFVersion() {
                  return pdfVersion;
              }
          };

          /**
           * Adds (and transfers the focus to) new page to the PDF document.
           * @function
           * @returns {jsPDF}
           *
           * @methodOf jsPDF#
           * @name addPage
           */
          API.addPage = function () {
              _addPage.apply(this, arguments);
              return this;
          };
          API.setPage = function () {
              _setPage.apply(this, arguments);
              return this;
          };
          API.insertPage = function (beforePage) {
              this.addPage();
              this.movePage(currentPage, beforePage);
              return this;
          };
          API.movePage = function (targetPage, beforePage) {
              if (targetPage > beforePage) {
                  var tmpPages = pages[targetPage];
                  var tmpPagedim = pagedim[targetPage];
                  var tmpPagesContext = pagesContext[targetPage];
                  for (var i = targetPage; i > beforePage; i--) {
                      pages[i] = pages[i - 1];
                      pagedim[i] = pagedim[i - 1];
                      pagesContext[i] = pagesContext[i - 1];
                  }
                  pages[beforePage] = tmpPages;
                  pagedim[beforePage] = tmpPagedim;
                  pagesContext[beforePage] = tmpPagesContext;
                  this.setPage(beforePage);
              } else if (targetPage < beforePage) {
                  var tmpPages = pages[targetPage];
                  var tmpPagedim = pagedim[targetPage];
                  var tmpPagesContext = pagesContext[targetPage];
                  for (var i = targetPage; i < beforePage; i++) {
                      pages[i] = pages[i + 1];
                      pagedim[i] = pagedim[i + 1];
                      pagesContext[i] = pagesContext[i + 1];
                  }
                  pages[beforePage] = tmpPages;
                  pagedim[beforePage] = tmpPagedim;
                  pagesContext[beforePage] = tmpPagesContext;
                  this.setPage(beforePage);
              }
              return this;
          };

          API.deletePage = function () {
              _deletePage.apply(this, arguments);
              return this;
          };
          API.setDisplayMode = function (zoom, layout, pmode) {
              zoomMode = zoom;
              layoutMode = layout;
              pageMode = pmode;
              return this;
          },

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
          API.text = function (text, x, y, flags, angle, align) {
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
              function ESC(s) {
                  s = s.split("\t").join(Array(options.TabLen || 9).join(" "));
                  return pdfEscape(s, flags);
              }

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
              // Convert text into an array anyway to simplify
              // later code.
              if (typeof text === 'string') {
                  if (text.match(/[\n\r]/)) {
                      text = text.split(/\r\n|\r|\n/g);
                  } else {
                      text = [text];
                  }
              }
              if (typeof angle === 'string') {
                  align = angle;
                  angle = null;
              }
              if (typeof flags === 'string') {
                  align = flags;
                  flags = null;
              }
              if (typeof flags === 'number') {
                  angle = flags;
                  flags = null;
              }
              var xtra = '',
                  mode = 'Td',
                  todo;
              if (angle) {
                  angle *= Math.PI / 180;
                  var c = Math.cos(angle),
                      s = Math.sin(angle);
                  xtra = [f2(c), f2(s), f2(s * -1), f2(c), ''].join(" ");
                  mode = 'Tm';
              }
              flags = flags || {};
              if (!('noBOM' in flags)) flags.noBOM = true;
              if (!('autoencode' in flags)) flags.autoencode = true;

              var strokeOption = '';
              var pageContext = this.internal.getCurrentPageInfo().pageContext;
              if (true === flags.stroke) {
                  if (pageContext.lastTextWasStroke !== true) {
                      strokeOption = '1 Tr\n';
                      pageContext.lastTextWasStroke = true;
                  }
              } else {
                  if (pageContext.lastTextWasStroke) {
                      strokeOption = '0 Tr\n';
                  }
                  pageContext.lastTextWasStroke = false;
              }

              if (typeof this._runningPageHeight === 'undefined') {
                  this._runningPageHeight = 0;
              }

              if (typeof text === 'string') {
                  text = ESC(text);
              } else if (Object.prototype.toString.call(text) === '[object Array]') {
                  // we don't want to destroy  original text array, so cloning it
                  var sa = text.concat(),
                      da = [],
                      len = sa.length;
                  // we do array.join('text that must not be PDFescaped")
                  // thus, pdfEscape each component separately
                  while (len--) {
                      da.push(ESC(sa.shift()));
                  }
                  var linesLeft = Math.ceil((pageHeight - y - this._runningPageHeight) * k / (activeFontSize * lineHeightProportion));
                  if (0 <= linesLeft && linesLeft < da.length + 1) {
                      //todo = da.splice(linesLeft-1);
                  }

                  if (align) {
                      var left,
                          prevX,
                          maxLineLength,
                          leading = activeFontSize * lineHeightProportion,
                          lineWidths = text.map(function (v) {
                          return this.getStringUnitWidth(v) * activeFontSize / k;
                      }, this);
                      maxLineLength = Math.max.apply(Math, lineWidths);
                      // The first line uses the "main" Td setting,
                      // and the subsequent lines are offset by the
                      // previous line's x coordinate.
                      if (align === "center") {
                          // The passed in x coordinate defines
                          // the center point.
                          left = x - maxLineLength / 2;
                          x -= lineWidths[0] / 2;
                      } else if (align === "right") {
                          // The passed in x coordinate defines the
                          // rightmost point of the text.
                          left = x - maxLineLength;
                          x -= lineWidths[0];
                      } else {
                          throw new Error('Unrecognized alignment option, use "center" or "right".');
                      }
                      prevX = x;
                      text = da[0];
                      for (var i = 1, len = da.length; i < len; i++) {
                          var delta = maxLineLength - lineWidths[i];
                          if (align === "center") delta /= 2;
                          // T* = x-offset leading Td ( text )
                          text += ") Tj\n" + (left - prevX + delta) + " -" + leading + " Td (" + da[i];
                          prevX = left + delta;
                      }
                  } else {
                      text = da.join(") Tj\nT* (");
                  }
              } else {
                  throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
              }
              // Using "'" ("go next line and render text" mark) would save space but would complicate our rendering code, templates

              // BT .. ET does NOT have default settings for Tf. You must state that explicitely every time for BT .. ET
              // if you want text transformation matrix (+ multiline) to work reliably (which reads sizes of things from font declarations)
              // Thus, there is NO useful, *reliable* concept of "default" font for a page.
              // The fact that "default" (reuse font used before) font worked before in basic cases is an accident
              // - readers dealing smartly with brokenness of jsPDF's markup.

              var curY;

              if (todo) {
                  //this.addPage();
                  //this._runningPageHeight += y -  (activeFontSize * 1.7 / k);
                  //curY = f2(pageHeight - activeFontSize * 1.7 /k);
              } else {
                  curY = f2((pageHeight - y) * k);
              }
              //curY = f2((pageHeight - (y - this._runningPageHeight)) * k);

              //			if (curY < 0){
              //				console.log('auto page break');
              //				this.addPage();
              //				this._runningPageHeight = y -  (activeFontSize * 1.7 / k);
              //				curY = f2(pageHeight - activeFontSize * 1.7 /k);
              //			}

              out('BT\n/' + activeFontKey + ' ' + activeFontSize + ' Tf\n' + // font face, style, size
              activeFontSize * lineHeightProportion + ' TL\n' + // line spacing
              strokeOption + // stroke option
              textColor + '\n' + xtra + f2(x * k) + ' ' + curY + ' ' + mode + '\n(' + text + ') Tj\nET');

              if (todo) {
                  //this.text( todo, x, activeFontSize * 1.7 / k);
                  //this.text( todo, x, this._runningPageHeight + (activeFontSize * 1.7 / k));
                  this.text(todo, x, y); // + (activeFontSize * 1.7 / k));
              }

              return this;
          };

          API.lstext = function (text, x, y, spacing) {
              for (var i = 0, len = text.length; i < len; i++, x += spacing) {
                  this.text(text[i], x, y);
              }
          };

          API.line = function (x1, y1, x2, y2) {
              return this.lines([[x2 - x1, y2 - y1]], x1, y1);
          };

          API.clip = function () {
              // By patrick-roberts, github.com/MrRio/jsPDF/issues/328
              // Call .clip() after calling .rect() with a style argument of null
              out('W'); // clip
              out('S'); // stroke path; necessary for clip to work
          };

          /**
           * This fixes the previous function clip(). Perhaps the 'stroke path' hack was due to the missing 'n' instruction?
           * We introduce the fixed version so as to not break API.
           * @param fillRule
           */
          API.clip_fixed = function (fillRule) {
              // Call .clip() after calling drawing ops with a style argument of null
              // W is the PDF clipping op
              if ('evenodd' === fillRule) {
                  out('W*');
              } else {
                  out('W');
              }
              // End the path object without filling or stroking it.
              // This operator is a path-painting no-op, used primarily for the side effect of changing the current clipping path
              // (see Section 4.4.3, “Clipping Path Operators”)
              out('n');
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
          API.lines = function (lines, x, y, scale, style, closed) {
              var scalex, scaley, i, l, leg, x2, y2, x3, y3, x4, y4;

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
                      out(f3(x2 * k) + ' ' + f3((pageHeight - y2) * k) + ' ' + f3(x3 * k) + ' ' + f3((pageHeight - y3) * k) + ' ' + f3(x4 * k) + ' ' + f3((pageHeight - y4) * k) + ' c');
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
          API.rect = function (x, y, w, h, style) {
              var op = getStyle(style);
              out([f2(x * k), f2((pageHeight - y) * k), f2(w * k), f2(-h * k), 're'].join(' '));

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
          API.triangle = function (x1, y1, x2, y2, x3, y3, style) {
              this.lines([[x2 - x1, y2 - y1], // vector to point 2
              [x3 - x2, y3 - y2], // vector to point 3
              [x1 - x3, y1 - y3] // closing vector back to point 1
              ], x1, y1, // start of path
              [1, 1], style, true);
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
          API.roundedRect = function (x, y, w, h, rx, ry, style) {
              var MyArc = 4 / 3 * (Math.SQRT2 - 1);
              this.lines([[w - 2 * rx, 0], [rx * MyArc, 0, rx, ry - ry * MyArc, rx, ry], [0, h - 2 * ry], [0, ry * MyArc, -(rx * MyArc), ry, -rx, ry], [-w + 2 * rx, 0], [-(rx * MyArc), 0, -rx, -(ry * MyArc), -rx, -ry], [0, -h + 2 * ry], [0, -(ry * MyArc), rx * MyArc, -ry, rx, -ry]], x + rx, y, // start of path
              [1, 1], style);
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
          API.ellipse = function (x, y, rx, ry, style) {
              var lx = 4 / 3 * (Math.SQRT2 - 1) * rx,
                  ly = 4 / 3 * (Math.SQRT2 - 1) * ry;

              out([f2((x + rx) * k), f2((pageHeight - y) * k), 'm', f2((x + rx) * k), f2((pageHeight - (y - ly)) * k), f2((x + lx) * k), f2((pageHeight - (y - ry)) * k), f2(x * k), f2((pageHeight - (y - ry)) * k), 'c'].join(' '));
              out([f2((x - lx) * k), f2((pageHeight - (y - ry)) * k), f2((x - rx) * k), f2((pageHeight - (y - ly)) * k), f2((x - rx) * k), f2((pageHeight - y) * k), 'c'].join(' '));
              out([f2((x - rx) * k), f2((pageHeight - (y + ly)) * k), f2((x - lx) * k), f2((pageHeight - (y + ry)) * k), f2(x * k), f2((pageHeight - (y + ry)) * k), 'c'].join(' '));
              out([f2((x + lx) * k), f2((pageHeight - (y + ry)) * k), f2((x + rx) * k), f2((pageHeight - (y + ly)) * k), f2((x + rx) * k), f2((pageHeight - y) * k), 'c'].join(' '));

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
          API.circle = function (x, y, r, style) {
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
          API.setProperties = function (properties) {
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
          API.setFontSize = function (size) {
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
          API.setFont = function (fontName, fontStyle) {
              activeFontKey = _getFont(fontName, fontStyle);
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
          API.setFontStyle = API.setFontType = function (style) {
              activeFontKey = _getFont(undefined, style);
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
          API.getFontList = function () {
              // TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
              var list = {},
                  fontName,
                  fontStyle,
                  tmp;

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
           * Add a custom font.
           *
           * @param {String} Postscript name of the Font.  Example: "Menlo-Regular"
           * @param {String} Name of font-family from @font-face definition.  Example: "Menlo Regular"
           * @param {String} Font style.  Example: "normal"
           * @function
           * @returns the {fontKey} (same as the internal method)
           * @methodOf jsPDF#
           * @name addFont
           */
          API.addFont = function (postScriptName, fontName, fontStyle) {
              addFont(postScriptName, fontName, fontStyle, 'StandardEncoding');
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
          API.setLineWidth = function (width) {
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
          API.setDrawColor = function (ch1, ch2, ch3, ch4) {
              var color;
              if (ch2 === undefined || ch4 === undefined && ch1 === ch2 === ch3) {
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
          API.setFillColor = function (ch1, ch2, ch3, ch4) {
              var color;

              if (ch2 === undefined || ch4 === undefined && ch1 === ch2 === ch3) {
                  // Gray color space.
                  if (typeof ch1 === 'string') {
                      color = ch1 + ' g';
                  } else {
                      color = f2(ch1 / 255) + ' g';
                  }
              } else if (ch4 === undefined || (typeof ch4 === 'undefined' ? 'undefined' : _typeof(ch4)) === 'object') {
                  // RGB
                  if (typeof ch1 === 'string') {
                      color = [ch1, ch2, ch3, 'rg'].join(' ');
                  } else {
                      color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'rg'].join(' ');
                  }
                  if (ch4 && ch4.a === 0) {
                      //TODO Implement transparency.
                      //WORKAROUND use white for now
                      color = ['255', '255', '255', 'rg'].join(' ');
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
          API.setTextColor = function (r, g, b) {
              if (typeof r === 'string' && /^#[0-9A-Fa-f]{6}$/.test(r)) {
                  var hex = parseInt(r.substr(1), 16);
                  r = hex >> 16 & 255;
                  g = hex >> 8 & 255;
                  b = hex & 255;
              }

              if (r === 0 && g === 0 && b === 0 || typeof g === 'undefined') {
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
              0: 0,
              'butt': 0,
              'but': 0,
              'miter': 0,
              1: 1,
              'round': 1,
              'rounded': 1,
              'circle': 1,
              2: 2,
              'projecting': 2,
              'project': 2,
              'square': 2,
              'bevel': 2
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
          API.setLineCap = function (style) {
              var id = this.CapJoinStyles[style];
              if (id === undefined) {
                  throw new Error("Line cap style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
              }
              lineCapID = id;
              out(id + ' J');

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
          API.setLineJoin = function (style) {
              var id = this.CapJoinStyles[style];
              if (id === undefined) {
                  throw new Error("Line join style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
              }
              lineJoinID = id;
              out(id + ' j');

              return this;
          };

          // Output is both an internal (for plugins) and external function
          API.output = _output;

          /**
           * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf')
           * @param  {String} filename The filename including extension.
           *
           * @function
           * @returns {jsPDF}
           * @methodOf jsPDF#
           * @name save
           */
          API.save = function (filename) {
              API.output('save', filename);
          };

          // applying plugins (more methods) ON TOP of built-in API.
          // this is intentional as we allow plugins to override
          // built-ins
          for (var plugin in jsPDF.API) {
              if (jsPDF.API.hasOwnProperty(plugin)) {
                  if (plugin === 'events' && jsPDF.API.events.length) {
                      (function (events, newEvents) {

                          // jsPDF.API.events is a JS Array of Arrays
                          // where each Array is a pair of event name, handler
                          // Events were added by plugins to the jsPDF instantiator.
                          // These are always added to the new instance and some ran
                          // during instantiation.
                          var eventname, handler_and_args, i;

                          for (i = newEvents.length - 1; i !== -1; i--) {
                              // subscribe takes 3 args: 'topic', function, runonce_flag
                              // if undefined, runonce is false.
                              // users can attach callback directly,
                              // or they can attach an array with [callback, runonce_flag]
                              // that's what the "apply" magic is for below.
                              eventname = newEvents[i][0];
                              handler_and_args = newEvents[i][1];
                              events.subscribe.apply(events, [eventname].concat(typeof handler_and_args === 'function' ? [handler_and_args] : handler_and_args));
                          }
                      })(events, jsPDF.API.events);
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
          _addPage(format, orientation);

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
      jsPDF.API = { events: [] };
      jsPDF.version = "1.3.2 2016-09-30T20:33:17.116Z:jameshall";

      if (typeof define === 'function' && define.amd) {
          define('jsPDF', function () {
              return jsPDF;
          });
      } else if (typeof module !== 'undefined' && module.exports) {
          module.exports = jsPDF;
      } else {
          global.jsPDF = jsPDF;
      }
      return jsPDF;
  }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || undefined);
  /*rollup-keeper-start*/window.tmp = jsPDF;

  /**
   * jsPDF AcroForm Plugin
   * Copyright (c) 2016 Alexander Weidt, https://github.com/BiggA94
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  (window.AcroForm = function (jsPDFAPI) {
      'use strict';

      var AcroForm = window.AcroForm;

      AcroForm.scale = function (x) {
          return x * (acroformPlugin.internal.scaleFactor / 1); // 1 = (96 / 72)
      };
      AcroForm.antiScale = function (x) {
          return 1 / acroformPlugin.internal.scaleFactor * x;
      };

      var acroformPlugin = {
          fields: [],
          xForms: [],
          /**
           * acroFormDictionaryRoot contains information about the AcroForm Dictionary
           * 0: The Event-Token, the AcroFormDictionaryCallback has
           * 1: The Object ID of the Root
           */
          acroFormDictionaryRoot: null,
          /**
           * After the PDF gets evaluated, the reference to the root has to be reset,
           * this indicates, whether the root has already been printed out
           */
          printedOut: false,
          internal: null
      };

      jsPDF.API.acroformPlugin = acroformPlugin;

      var annotReferenceCallback = function annotReferenceCallback() {
          for (var i in this.acroformPlugin.acroFormDictionaryRoot.Fields) {
              var formObject = this.acroformPlugin.acroFormDictionaryRoot.Fields[i];
              // add Annot Reference!
              if (formObject.hasAnnotation) {
                  // If theres an Annotation Widget in the Form Object, put the Reference in the /Annot array
                  createAnnotationReference.call(this, formObject);
              }
          }
      };

      var createAcroForm = function createAcroForm() {
          if (this.acroformPlugin.acroFormDictionaryRoot) {
              //return;
              throw new Error("Exception while creating AcroformDictionary");
          }

          // The Object Number of the AcroForm Dictionary
          this.acroformPlugin.acroFormDictionaryRoot = new AcroForm.AcroFormDictionary();

          this.acroformPlugin.internal = this.internal;

          // add Callback for creating the AcroForm Dictionary
          this.acroformPlugin.acroFormDictionaryRoot._eventID = this.internal.events.subscribe('postPutResources', AcroFormDictionaryCallback);

          this.internal.events.subscribe('buildDocument', annotReferenceCallback); //buildDocument

          // Register event, that is triggered when the DocumentCatalog is written, in order to add /AcroForm
          this.internal.events.subscribe('putCatalog', putCatalogCallback);

          // Register event, that creates all Fields
          this.internal.events.subscribe('postPutPages', createFieldCallback);
      };

      /**
       * Create the Reference to the widgetAnnotation, so that it gets referenced in the Annot[] int the+
       * (Requires the Annotation Plugin)
       */
      var createAnnotationReference = function createAnnotationReference(object) {
          var options = {
              type: 'reference',
              object: object
          };
          jsPDF.API.annotationPlugin.annotations[this.internal.getPageInfo(object.page).pageNumber].push(options);
      };

      var putForm = function putForm(formObject) {
          if (this.acroformPlugin.printedOut) {
              this.acroformPlugin.printedOut = false;
              this.acroformPlugin.acroFormDictionaryRoot = null;
          }
          if (!this.acroformPlugin.acroFormDictionaryRoot) {
              createAcroForm.call(this);
          }
          this.acroformPlugin.acroFormDictionaryRoot.Fields.push(formObject);
      };

      // Callbacks

      var putCatalogCallback = function putCatalogCallback() {
          //Put reference to AcroForm to DocumentCatalog
          if (typeof this.acroformPlugin.acroFormDictionaryRoot != 'undefined') {
              // for safety, shouldn't normally be the case
              this.internal.write('/AcroForm ' + this.acroformPlugin.acroFormDictionaryRoot.objId + ' ' + 0 + ' R');
          } else {
              console.log('Root missing...');
          }
      };

      /**
       * Adds /Acroform X 0 R to Document Catalog,
       * and creates the AcroForm Dictionary
       */
      var AcroFormDictionaryCallback = function AcroFormDictionaryCallback() {
          // Remove event
          this.internal.events.unsubscribe(this.acroformPlugin.acroFormDictionaryRoot._eventID);

          delete this.acroformPlugin.acroFormDictionaryRoot._eventID;

          this.acroformPlugin.printedOut = true;
      };

      /**
       * Creates the single Fields and writes them into the Document
       *
       * If fieldArray is set, use the fields that are inside it instead of the fields from the AcroRoot
       * (for the FormXObjects...)
       */
      var createFieldCallback = function createFieldCallback(fieldArray) {
          var standardFields = !fieldArray;

          if (!fieldArray) {
              // in case there is no fieldArray specified, we want to print out the Fields of the AcroForm
              // Print out Root
              this.internal.newObjectDeferredBegin(this.acroformPlugin.acroFormDictionaryRoot.objId);
              this.internal.out(this.acroformPlugin.acroFormDictionaryRoot.getString());
          }

          var fieldArray = fieldArray || this.acroformPlugin.acroFormDictionaryRoot.Kids;

          for (var i in fieldArray) {
              var key = i;
              var form = fieldArray[i];

              var oldRect = form.Rect;

              if (form.Rect) {
                  form.Rect = AcroForm.internal.calculateCoordinates.call(this, form.Rect);
              }

              // Start Writing the Object
              this.internal.newObjectDeferredBegin(form.objId);

              var content = "";
              content += form.objId + " 0 obj\n";

              content += "<<\n" + form.getContent();

              form.Rect = oldRect;

              if (form.hasAppearanceStream && !form.appearanceStreamContent) {
                  // Calculate Appearance
                  var appearance = AcroForm.internal.calculateAppearanceStream.call(this, form);
                  content += "/AP << /N " + appearance + " >>\n";

                  this.acroformPlugin.xForms.push(appearance);
              }

              // Assume AppearanceStreamContent is a Array with N,R,D (at least one of them!)
              if (form.appearanceStreamContent) {
                  content += "/AP << ";
                  // Iterate over N,R and D
                  for (var k in form.appearanceStreamContent) {
                      var value = form.appearanceStreamContent[k];
                      content += "/" + k + " ";
                      content += "<< ";
                      if (Object.keys(value).length >= 1 || Array.isArray(value)) {
                          // appearanceStream is an Array or Object!
                          for (var i in value) {
                              var obj = value[i];
                              if (typeof obj === 'function') {
                                  // if Function is referenced, call it in order to get the FormXObject
                                  obj = obj.call(this, form);
                              }
                              content += "/" + i + " " + obj + " ";

                              // In case the XForm is already used, e.g. OffState of CheckBoxes, don't add it
                              if (!(this.acroformPlugin.xForms.indexOf(obj) >= 0)) this.acroformPlugin.xForms.push(obj);
                          }
                      } else {
                          var obj = value;
                          if (typeof obj === 'function') {
                              // if Function is referenced, call it in order to get the FormXObject
                              obj = obj.call(this, form);
                          }
                          content += "/" + i + " " + obj + " \n";
                          if (!(this.acroformPlugin.xForms.indexOf(obj) >= 0)) this.acroformPlugin.xForms.push(obj);
                      }
                      content += " >>\n";
                  }

                  // appearance stream is a normal Object..
                  content += ">>\n";
              }

              content += ">>\nendobj\n";

              this.internal.out(content);
          }
          if (standardFields) {
              createXFormObjectCallback.call(this, this.acroformPlugin.xForms);
          }
      };

      var createXFormObjectCallback = function createXFormObjectCallback(fieldArray) {
          for (var i in fieldArray) {
              var key = i;
              var form = fieldArray[i];
              // Start Writing the Object
              this.internal.newObjectDeferredBegin(form && form.objId);

              var content = "";
              content += form ? form.getString() : '';
              this.internal.out(content);

              delete fieldArray[key];
          }
      };

      // Public:

      jsPDFAPI.addField = function (fieldObject) {
          //var opt = parseOptions(fieldObject);
          if (fieldObject instanceof AcroForm.TextField) {
              addTextField.call(this, fieldObject);
          } else if (fieldObject instanceof AcroForm.ChoiceField) {
              addChoiceField.call(this, fieldObject);
          } else if (fieldObject instanceof AcroForm.Button) {
              addButton.call(this, fieldObject);
          } else if (fieldObject instanceof AcroForm.ChildClass) {
              putForm.call(this, fieldObject);
          } else if (fieldObject) {
              // try to put..
              putForm.call(this, fieldObject);
          }
          fieldObject.page = this.acroformPlugin.internal.getCurrentPageInfo().pageNumber;
          return this;
      };

      // ############### sort in:

      /**
       * Button
       * FT = Btn
       */
      var addButton = function addButton(options) {
          var options = options || new AcroForm.Field();

          options.FT = '/Btn';

          /**
           * Calculating the Ff entry:
           *
           * The Ff entry contains flags, that have to be set bitwise
           * In the Following the number in the Comment is the BitPosition
           */
          var flags = options.Ff || 0;

          // 17, Pushbutton
          if (options.pushbutton) {
              // Options.pushbutton should be 1 or 0
              flags = AcroForm.internal.setBitPosition(flags, 17);
              delete options.pushbutton;
          }

          //16, Radio
          if (options.radio) {
              //flags = options.Ff | options.radio << 15;
              flags = AcroForm.internal.setBitPosition(flags, 16);
              delete options.radio;
          }

          // 15, NoToggleToOff (Radio buttons only
          if (options.noToggleToOff) {
              //flags = options.Ff | options.noToggleToOff << 14;
              flags = AcroForm.internal.setBitPosition(flags, 15);
              //delete options.noToggleToOff;
          }

          // In case, there is no Flag set, it is a check-box
          options.Ff = flags;

          putForm.call(this, options);
      };

      var addTextField = function addTextField(options) {
          var options = options || new AcroForm.Field();

          options.FT = '/Tx';

          /**
           * Calculating the Ff entry:
           *
           * The Ff entry contains flags, that have to be set bitwise
           * In the Following the number in the Comment is the BitPosition
           */

          var flags = options.Ff || 0;

          // 13, multiline
          if (options.multiline) {
              // Set Flag
              flags = flags | 1 << 12;
              // Remove multiline from FieldObject
              //delete options.multiline;
          }

          // 14, Password
          if (options.password) {
              flags = flags | 1 << 13;
              //delete options.password;
          }

          // 21, FileSelect, PDF 1.4...
          if (options.fileSelect) {
              flags = flags | 1 << 20;
              //delete options.fileSelect;
          }

          // 23, DoNotSpellCheck, PDF 1.4...
          if (options.doNotSpellCheck) {
              flags = flags | 1 << 22;
              //delete options.doNotSpellCheck;
          }

          // 24, DoNotScroll, PDF 1.4...
          if (options.doNotScroll) {
              flags = flags | 1 << 23;
              //delete options.doNotScroll;
          }

          options.Ff = options.Ff || flags;

          // Add field
          putForm.call(this, options);
      };

      var addChoiceField = function addChoiceField(opt) {
          var options = opt || new AcroForm.Field();

          options.FT = '/Ch';

          /**
           * Calculating the Ff entry:
           *
           * The Ff entry contains flags, that have to be set bitwise
           * In the Following the number in the Comment is the BitPosition
           */

          var flags = options.Ff || 0;

          // 18, Combo (If not set, the choiceField is a listBox!!)
          if (options.combo) {
              // Set Flag
              flags = AcroForm.internal.setBitPosition(flags, 18);
              // Remove combo from FieldObject
              delete options.combo;
          }

          // 19, Edit
          if (options.edit) {
              flags = AcroForm.internal.setBitPosition(flags, 19);
              delete options.edit;
          }

          // 20, Sort
          if (options.sort) {
              flags = AcroForm.internal.setBitPosition(flags, 20);
              delete options.sort;
          }

          // 22, MultiSelect (PDF 1.4)
          if (options.multiSelect && this.internal.getPDFVersion() >= 1.4) {
              flags = AcroForm.internal.setBitPosition(flags, 22);
              delete options.multiSelect;
          }

          // 23, DoNotSpellCheck (PDF 1.4)
          if (options.doNotSpellCheck && this.internal.getPDFVersion() >= 1.4) {
              flags = AcroForm.internal.setBitPosition(flags, 23);
              delete options.doNotSpellCheck;
          }

          options.Ff = flags;

          //options.hasAnnotation = true;

          // Add field
          putForm.call(this, options);
      };
  })(jsPDF.API);

  var AcroForm = window.AcroForm;

  AcroForm.internal = {};

  AcroForm.createFormXObject = function (formObject) {
      var xobj = new AcroForm.FormXObject();
      var height = AcroForm.Appearance.internal.getHeight(formObject) || 0;
      var width = AcroForm.Appearance.internal.getWidth(formObject) || 0;
      xobj.BBox = [0, 0, width, height];
      return xobj;
  };

  // Contains Methods for creating standard appearances
  AcroForm.Appearance = {
      CheckBox: {
          createAppearanceStream: function createAppearanceStream() {
              var appearance = {
                  N: {
                      On: AcroForm.Appearance.CheckBox.YesNormal
                  },
                  D: {
                      On: AcroForm.Appearance.CheckBox.YesPushDown,
                      Off: AcroForm.Appearance.CheckBox.OffPushDown
                  }
              };

              return appearance;
          },
          /**
           * If any other icons are needed, the number between the brackets can be changed
           * @returns {string}
           */
          createMK: function createMK() {
              // 3-> Hook
              return "<< /CA (3)>>";
          },
          /**
           * Returns the standard On Appearance for a CheckBox
           * @returns {AcroForm.FormXObject}
           */
          YesPushDown: function YesPushDown(formObject) {
              var xobj = AcroForm.createFormXObject(formObject);
              var stream = "";
              // F13 is ZapfDingbats (Symbolic)
              formObject.Q = 1; // set text-alignment as centered
              var calcRes = AcroForm.internal.calculateX(formObject, "3", "ZapfDingbats", 50);
              stream += "0.749023 g\n\
             0 0 " + AcroForm.Appearance.internal.getWidth(formObject) + " " + AcroForm.Appearance.internal.getHeight(formObject) + " re\n\
             f\n\
             BMC\n\
             q\n\
             0 0 1 rg\n\
             /F13 " + calcRes.fontSize + " Tf 0 g\n\
             BT\n";
              stream += calcRes.text;
              stream += "ET\n\
             Q\n\
             EMC\n";
              xobj.stream = stream;
              return xobj;
          },

          YesNormal: function YesNormal(formObject) {
              var xobj = AcroForm.createFormXObject(formObject);
              var stream = "";
              formObject.Q = 1; // set text-alignment as centered
              var calcRes = AcroForm.internal.calculateX(formObject, "3", "ZapfDingbats", AcroForm.Appearance.internal.getHeight(formObject) * 0.9);
              stream += "1 g\n\
0 0 " + AcroForm.Appearance.internal.getWidth(formObject) + " " + AcroForm.Appearance.internal.getHeight(formObject) + " re\n\
f\n\
q\n\
0 0 1 rg\n\
0 0 " + (AcroForm.Appearance.internal.getWidth(formObject) - 1) + " " + (AcroForm.Appearance.internal.getHeight(formObject) - 1) + " re\n\
W\n\
n\n\
0 g\n\
BT\n\
/F13 " + calcRes.fontSize + " Tf 0 g\n";
              stream += calcRes.text;
              stream += "ET\n\
             Q\n";
              xobj.stream = stream;
              return xobj;
          },

          /**
           * Returns the standard Off Appearance for a CheckBox
           * @returns {AcroForm.FormXObject}
           */
          OffPushDown: function OffPushDown(formObject) {
              var xobj = AcroForm.createFormXObject(formObject);
              var stream = "";
              stream += "0.749023 g\n\
            0 0 " + AcroForm.Appearance.internal.getWidth(formObject) + " " + AcroForm.Appearance.internal.getHeight(formObject) + " re\n\
            f\n";
              xobj.stream = stream;
              return xobj;
          }
      },

      RadioButton: {
          Circle: {
              createAppearanceStream: function createAppearanceStream(name) {
                  var appearanceStreamContent = {
                      D: {
                          'Off': AcroForm.Appearance.RadioButton.Circle.OffPushDown
                      },
                      N: {}
                  };
                  appearanceStreamContent.N[name] = AcroForm.Appearance.RadioButton.Circle.YesNormal;
                  appearanceStreamContent.D[name] = AcroForm.Appearance.RadioButton.Circle.YesPushDown;
                  return appearanceStreamContent;
              },
              createMK: function createMK() {
                  return "<< /CA (l)>>";
              },

              YesNormal: function YesNormal(formObject) {
                  var xobj = AcroForm.createFormXObject(formObject);
                  var stream = "";
                  // Make the Radius of the Circle relative to min(height, width) of formObject
                  var DotRadius = AcroForm.Appearance.internal.getWidth(formObject) <= AcroForm.Appearance.internal.getHeight(formObject) ? AcroForm.Appearance.internal.getWidth(formObject) / 4 : AcroForm.Appearance.internal.getHeight(formObject) / 4;
                  // The Borderpadding...
                  DotRadius *= 0.9;
                  var c = AcroForm.Appearance.internal.Bezier_C;
                  /*
                   The Following is a Circle created with Bezier-Curves.
                   */
                  stream += "q\n\
1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
" + DotRadius + " 0 m\n\
" + DotRadius + " " + DotRadius * c + " " + DotRadius * c + " " + DotRadius + " 0 " + DotRadius + " c\n\
-" + DotRadius * c + " " + DotRadius + " -" + DotRadius + " " + DotRadius * c + " -" + DotRadius + " 0 c\n\
-" + DotRadius + " -" + DotRadius * c + " -" + DotRadius * c + " -" + DotRadius + " 0 -" + DotRadius + " c\n\
" + DotRadius * c + " -" + DotRadius + " " + DotRadius + " -" + DotRadius * c + " " + DotRadius + " 0 c\n\
f\n\
Q\n";
                  xobj.stream = stream;
                  return xobj;
              },
              YesPushDown: function YesPushDown(formObject) {
                  var xobj = AcroForm.createFormXObject(formObject);
                  var stream = "";
                  var DotRadius = AcroForm.Appearance.internal.getWidth(formObject) <= AcroForm.Appearance.internal.getHeight(formObject) ? AcroForm.Appearance.internal.getWidth(formObject) / 4 : AcroForm.Appearance.internal.getHeight(formObject) / 4;
                  // The Borderpadding...
                  DotRadius *= 0.9;
                  // Save results for later use; no need to waste processor ticks on doing math
                  var k = DotRadius * 2;
                  // var c = AcroForm.Appearance.internal.Bezier_C;
                  var kc = k * AcroForm.Appearance.internal.Bezier_C;
                  var dc = DotRadius * AcroForm.Appearance.internal.Bezier_C;
                  //                 stream += "0.749023 g\n\
                  //             q\n\
                  //           1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
                  // " + DotRadius * 2 + " 0 m\n\
                  // " + DotRadius * 2 + " " + DotRadius * 2 * c + " " + DotRadius * 2 * c + " " + DotRadius * 2 + " 0 " + DotRadius * 2 + " c\n\
                  // -" + DotRadius * 2 * c + " " + DotRadius * 2 + " -" + DotRadius * 2 + " " + DotRadius * 2 * c + " -" + DotRadius * 2 + " 0 c\n\
                  // -" + DotRadius * 2 + " -" + DotRadius * 2 * c + " -" + DotRadius * 2 * c + " -" + DotRadius * 2 + " 0 -" + DotRadius * 2 + " c\n\
                  // " + DotRadius * 2 * c + " -" + DotRadius * 2 + " " + DotRadius * 2 + " -" + DotRadius * 2 * c + " " + DotRadius * 2 + " 0 c\n\
                  //             f\n\
                  //             Q\n\
                  //             0 g\n\
                  //             q\n\
                  //             1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
                  // " + DotRadius + " 0 m\n\
                  // " + DotRadius + " " + DotRadius * c + " " + DotRadius * c + " " + DotRadius + " 0 " + DotRadius + " c\n\
                  // -" + DotRadius * c + " " + DotRadius + " -" + DotRadius + " " + DotRadius * c + " -" + DotRadius + " 0 c\n\
                  // -" + DotRadius + " -" + DotRadius * c + " -" + DotRadius * c + " -" + DotRadius + " 0 -" + DotRadius + " c\n\
                  // " + DotRadius * c + " -" + DotRadius + " " + DotRadius + " -" + DotRadius * c + " " + DotRadius + " 0 c\n\
                  //             f\n\
                  //             Q\n";

                  //  FASTER VERSION with less processor ticks spent on math operations
                  stream += "0.749023 g\n\
            q\n\
           1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
" + k + " 0 m\n\
" + k + " " + kc + " " + kc + " " + k + " 0 " + k + " c\n\
-" + kc + " " + k + " -" + k + " " + kc + " -" + k + " 0 c\n\
-" + k + " -" + kc + " -" + kc + " -" + k + " 0 -" + k + " c\n\
" + kc + " -" + k + " " + k + " -" + kc + " " + k + " 0 c\n\
            f\n\
            Q\n\
            0 g\n\
            q\n\
            1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
" + DotRadius + " 0 m\n\
" + DotRadius + " " + dc + " " + dc + " " + DotRadius + " 0 " + DotRadius + " c\n\
-" + dc + " " + DotRadius + " -" + DotRadius + " " + dc + " -" + DotRadius + " 0 c\n\
-" + DotRadius + " -" + dc + " -" + dc + " -" + DotRadius + " 0 -" + DotRadius + " c\n\
" + dc + " -" + DotRadius + " " + DotRadius + " -" + dc + " " + DotRadius + " 0 c\n\
            f\n\
            Q\n";
                  xobj.stream = stream;
                  return xobj;
              },
              OffPushDown: function OffPushDown(formObject) {
                  var xobj = AcroForm.createFormXObject(formObject);
                  var stream = "";
                  var DotRadius = AcroForm.Appearance.internal.getWidth(formObject) <= AcroForm.Appearance.internal.getHeight(formObject) ? AcroForm.Appearance.internal.getWidth(formObject) / 4 : AcroForm.Appearance.internal.getHeight(formObject) / 4;
                  // The Borderpadding...
                  DotRadius *= 0.9;
                  // Save results for later use; no need to waste processor ticks on doing math
                  var k = DotRadius * 2;
                  // var c = AcroForm.Appearance.internal.Bezier_C;
                  var kc = k * AcroForm.Appearance.internal.Bezier_C;
                  //                 stream += "0.749023 g\n\
                  //             q\n\
                  //  1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
                  // " + DotRadius * 2 + " 0 m\n\
                  // " + DotRadius * 2 + " " + DotRadius * 2 * c + " " + DotRadius * 2 * c + " " + DotRadius * 2 + " 0 " + DotRadius * 2 + " c\n\
                  // -" + DotRadius * 2 * c + " " + DotRadius * 2 + " -" + DotRadius * 2 + " " + DotRadius * 2 * c + " -" + DotRadius * 2 + " 0 c\n\
                  // -" + DotRadius * 2 + " -" + DotRadius * 2 * c + " -" + DotRadius * 2 * c + " -" + DotRadius * 2 + " 0 -" + DotRadius * 2 + " c\n\
                  // " + DotRadius * 2 * c + " -" + DotRadius * 2 + " " + DotRadius * 2 + " -" + DotRadius * 2 * c + " " + DotRadius * 2 + " 0 c\n\
                  //             f\n\
                  //             Q\n";

                  //  FASTER VERSION with less processor ticks spent on math operations
                  stream += "0.749023 g\n\
            q\n\
 1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
" + k + " 0 m\n\
" + k + " " + kc + " " + kc + " " + k + " 0 " + k + " c\n\
-" + kc + " " + k + " -" + k + " " + kc + " -" + k + " 0 c\n\
-" + k + " -" + kc + " -" + kc + " -" + k + " 0 -" + k + " c\n\
" + kc + " -" + k + " " + k + " -" + kc + " " + k + " 0 c\n\
            f\n\
            Q\n";
                  xobj.stream = stream;
                  return xobj;
              }
          },

          Cross: {
              /**
               * Creates the Actual AppearanceDictionary-References
               * @param name
               * @returns
               */
              createAppearanceStream: function createAppearanceStream(name) {
                  var appearanceStreamContent = {
                      D: {
                          'Off': AcroForm.Appearance.RadioButton.Cross.OffPushDown
                      },
                      N: {}
                  };
                  appearanceStreamContent.N[name] = AcroForm.Appearance.RadioButton.Cross.YesNormal;
                  appearanceStreamContent.D[name] = AcroForm.Appearance.RadioButton.Cross.YesPushDown;
                  return appearanceStreamContent;
              },
              createMK: function createMK() {
                  return "<< /CA (8)>>";
              },

              YesNormal: function YesNormal(formObject) {
                  var xobj = AcroForm.createFormXObject(formObject);
                  var stream = "";
                  var cross = AcroForm.Appearance.internal.calculateCross(formObject);
                  stream += "q\n\
            1 1 " + (AcroForm.Appearance.internal.getWidth(formObject) - 2) + " " + (AcroForm.Appearance.internal.getHeight(formObject) - 2) + " re\n\
            W\n\
            n\n\
            " + cross.x1.x + " " + cross.x1.y + " m\n\
            " + cross.x2.x + " " + cross.x2.y + " l\n\
            " + cross.x4.x + " " + cross.x4.y + " m\n\
            " + cross.x3.x + " " + cross.x3.y + " l\n\
            s\n\
            Q\n";
                  xobj.stream = stream;
                  return xobj;
              },
              YesPushDown: function YesPushDown(formObject) {
                  var xobj = AcroForm.createFormXObject(formObject);
                  var cross = AcroForm.Appearance.internal.calculateCross(formObject);
                  var stream = "";
                  stream += "0.749023 g\n\
            0 0 " + AcroForm.Appearance.internal.getWidth(formObject) + " " + AcroForm.Appearance.internal.getHeight(formObject) + " re\n\
            f\n\
            q\n\
            1 1 " + (AcroForm.Appearance.internal.getWidth(formObject) - 2) + " " + (AcroForm.Appearance.internal.getHeight(formObject) - 2) + " re\n\
            W\n\
            n\n\
            " + cross.x1.x + " " + cross.x1.y + " m\n\
            " + cross.x2.x + " " + cross.x2.y + " l\n\
            " + cross.x4.x + " " + cross.x4.y + " m\n\
            " + cross.x3.x + " " + cross.x3.y + " l\n\
            s\n\
            Q\n";
                  xobj.stream = stream;
                  return xobj;
              },
              OffPushDown: function OffPushDown(formObject) {
                  var xobj = AcroForm.createFormXObject(formObject);
                  var stream = "";
                  stream += "0.749023 g\n\
            0 0 " + AcroForm.Appearance.internal.getWidth(formObject) + " " + AcroForm.Appearance.internal.getHeight(formObject) + " re\n\
            f\n";
                  xobj.stream = stream;
                  return xobj;
              }
          }
      },

      /**
       * Returns the standard Appearance
       * @returns {AcroForm.FormXObject}
       */
      createDefaultAppearanceStream: function createDefaultAppearanceStream(formObject) {
          var stream = "";
          // Set Helvetica to Standard Font (size: auto)
          // Color: Black
          stream += "/Helv 0 Tf 0 g";
          return stream;
      }
  };

  AcroForm.Appearance.internal = {
      Bezier_C: 0.551915024494,

      calculateCross: function calculateCross(formObject) {
          var min = function min(x, y) {
              return x > y ? y : x;
          };

          var width = AcroForm.Appearance.internal.getWidth(formObject);
          var height = AcroForm.Appearance.internal.getHeight(formObject);
          var a = min(width, height);
          var crossSize = a;
          var borderPadding = 2; // The Padding in px


          var cross = {
              x1: { // upperLeft
                  x: (width - a) / 2,
                  y: (height - a) / 2 + a },
              x2: { // lowerRight
                  x: (width - a) / 2 + a,
                  y: (height - a) / 2 //borderPadding
              },
              x3: { // lowerLeft
                  x: (width - a) / 2,
                  y: (height - a) / 2 //borderPadding
              },
              x4: { // upperRight
                  x: (width - a) / 2 + a,
                  y: (height - a) / 2 + a }
          };

          return cross;
      }
  };
  AcroForm.Appearance.internal.getWidth = function (formObject) {
      return formObject.Rect[2]; //(formObject.Rect[2] - formObject.Rect[0]) || 0;
  };
  AcroForm.Appearance.internal.getHeight = function (formObject) {
      return formObject.Rect[3]; //(formObject.Rect[1] - formObject.Rect[3]) || 0;
  };

  // ##########################

  //### For inheritance:
  AcroForm.internal.inherit = function (child, parent) {
      var ObjectCreate = Object.create || function (o) {
          var F = function F() {};
          F.prototype = o;
          return new F();
      };
      child.prototype = Object.create(parent.prototype);
      child.prototype.constructor = child;
  };

  // ### Handy Functions:

  AcroForm.internal.arrayToPdfArray = function (array) {
      if (Array.isArray(array)) {
          var content = ' [';
          for (var i in array) {
              var element = array[i].toString();
              content += element;
              content += i < array.length - 1 ? ' ' : '';
          }
          content += ']';

          return content;
      }
  };

  AcroForm.internal.toPdfString = function (string) {
      string = string || "";

      // put Bracket at the Beginning of the String
      if (string.indexOf('(') !== 0) {
          string = '(' + string;
      }

      if (string.substring(string.length - 1) != ')') {
          string += '(';
      }
      return string;
  };

  // ##########################
  //          Classes
  // ##########################


  AcroForm.PDFObject = function () {
      // The Object ID in the PDF Object Model
      // todo
      var _objId;
      Object.defineProperty(this, 'objId', {
          get: function get() {
              if (!_objId) {
                  if (this.internal) {
                      _objId = this.internal.newObjectDeferred();
                  } else if (jsPDF.API.acroformPlugin.internal) {
                      // todo - find better option, that doesn't rely on a Global Static var
                      _objId = jsPDF.API.acroformPlugin.internal.newObjectDeferred();
                  }
              }
              if (!_objId) {
                  console.log("Couldn't create Object ID");
              }
              return _objId;
          },
          configurable: false
      });
  };

  AcroForm.PDFObject.prototype.toString = function () {
      return this.objId + " 0 R";
  };

  AcroForm.PDFObject.prototype.getString = function () {
      var res = this.objId + " 0 obj\n<<";
      var content = this.getContent();

      res += content + ">>\n";
      if (this.stream) {
          res += "stream\n";
          res += this.stream;
          res += "endstream\n";
      }
      res += "endobj\n";
      return res;
  };

  AcroForm.PDFObject.prototype.getContent = function () {
      /**
       * Prints out all enumerable Variables from the Object
       * @param fieldObject
       * @returns {string}
       */
      var createContentFromFieldObject = function createContentFromFieldObject(fieldObject) {
          var content = '';

          var keys = Object.keys(fieldObject).filter(function (key) {
              return key != 'content' && key != 'appearanceStreamContent' && key.substring(0, 1) != "_";
          });

          for (var i in keys) {
              var key = keys[i];
              var value = fieldObject[key];

              /*if (key == 'Rect' && value) {
               value = AcroForm.internal.calculateCoordinates.call(jsPDF.API.acroformPlugin.internal, value);
               }*/

              if (value) {
                  if (Array.isArray(value)) {
                      content += '/' + key + ' ' + AcroForm.internal.arrayToPdfArray(value) + "\n";
                  } else if (value instanceof AcroForm.PDFObject) {
                      // In case it is a reference to another PDFObject, take the referennce number
                      content += '/' + key + ' ' + value.objId + " 0 R" + "\n";
                  } else {
                      content += '/' + key + ' ' + value + '\n';
                  }
              }
          }
          return content;
      };

      var object = "";

      object += createContentFromFieldObject(this);
      return object;
  };

  AcroForm.FormXObject = function () {
      AcroForm.PDFObject.call(this);
      this.Type = "/XObject";
      this.Subtype = "/Form";
      this.FormType = 1;
      this.BBox;
      this.Matrix;
      this.Resources = "2 0 R";
      this.PieceInfo;
      var _stream;
      Object.defineProperty(this, 'Length', {
          enumerable: true,
          get: function get() {
              return _stream !== undefined ? _stream.length : 0;
          }
      });
      Object.defineProperty(this, 'stream', {
          enumerable: false,
          set: function set(val) {
              _stream = val;
          },
          get: function get() {
              if (_stream) {
                  return _stream;
              } else {
                  return null;
              }
          }
      });
  };

  AcroForm.internal.inherit(AcroForm.FormXObject, AcroForm.PDFObject);

  AcroForm.AcroFormDictionary = function () {
      AcroForm.PDFObject.call(this);
      var _Kids = [];
      Object.defineProperty(this, 'Kids', {
          enumerable: false,
          configurable: true,
          get: function get() {
              if (_Kids.length > 0) {
                  return _Kids;
              } else {
                  return;
              }
          }
      });
      Object.defineProperty(this, 'Fields', {
          enumerable: true,
          configurable: true,
          get: function get() {
              return _Kids;
          }
      });
      // Default Appearance
      this.DA;
  };

  AcroForm.internal.inherit(AcroForm.AcroFormDictionary, AcroForm.PDFObject);

  // ##### The Objects, the User can Create:


  // The Field Object contains the Variables, that every Field needs
  // Rectangle for Appearance: lower_left_X, lower_left_Y, width, height
  AcroForm.Field = function () {
      'use strict';

      AcroForm.PDFObject.call(this);

      var _Rect;
      Object.defineProperty(this, 'Rect', {
          enumerable: true,
          configurable: false,
          get: function get() {
              if (!_Rect) {
                  return;
              }
              var tmp = _Rect;
              //var calculatedRes = AcroForm.internal.calculateCoordinates(_Rect); // do later!
              return tmp;
          },
          set: function set(val) {
              _Rect = val;
          }
      });

      var _FT = "";
      Object.defineProperty(this, 'FT', {
          enumerable: true,
          set: function set(val) {
              _FT = val;
          },
          get: function get() {
              return _FT;
          }
      });
      /**
       * The Partial name of the Field Object.
       * It has to be unique.
       */
      var _T;

      Object.defineProperty(this, 'T', {
          enumerable: true,
          configurable: false,
          set: function set(val) {
              _T = val;
          },
          get: function get() {
              if (!_T || _T.length < 1) {
                  if (this instanceof AcroForm.ChildClass) {
                      // In case of a Child from a Radio´Group, you don't need a FieldName!!!
                      return;
                  }
                  return "(FieldObject" + AcroForm.Field.FieldNum++ + ")";
              }
              if (_T.substring(0, 1) == "(" && _T.substring(_T.length - 1)) {
                  return _T;
              }
              return "(" + _T + ")";
          }
      });

      var _DA;
      // Defines the default appearance (Needed for variable Text)
      Object.defineProperty(this, 'DA', {
          enumerable: true,
          get: function get() {
              if (!_DA) {
                  return;
              }
              return '(' + _DA + ')';
          },
          set: function set(val) {
              _DA = val;
          }
      });

      var _DV;
      // Defines the default value
      Object.defineProperty(this, 'DV', {
          enumerable: true,
          configurable: true,
          get: function get() {
              if (!_DV) {
                  return;
              }
              return _DV;
          },
          set: function set(val) {
              _DV = val;
          }
      });

      //this.Type = "/Annot";
      //this.Subtype = "/Widget";
      Object.defineProperty(this, 'Type', {
          enumerable: true,
          get: function get() {
              return this.hasAnnotation ? "/Annot" : null;
          }
      });

      Object.defineProperty(this, 'Subtype', {
          enumerable: true,
          get: function get() {
              return this.hasAnnotation ? "/Widget" : null;
          }
      });

      /**
       *
       * @type {Array}
       */
      this.BG;

      Object.defineProperty(this, 'hasAnnotation', {
          enumerable: false,
          get: function get() {
              if (this.Rect || this.BC || this.BG) {
                  return true;
              }
              return false;
          }
      });

      Object.defineProperty(this, 'hasAppearanceStream', {
          enumerable: false,
          configurable: true,
          writable: true
      });

      Object.defineProperty(this, 'page', {
          enumerable: false,
          configurable: true,
          writable: true
      });
  };
  AcroForm.Field.FieldNum = 0;

  AcroForm.internal.inherit(AcroForm.Field, AcroForm.PDFObject);

  AcroForm.ChoiceField = function () {
      AcroForm.Field.call(this);
      // Field Type = Choice Field
      this.FT = "/Ch";
      // options
      this.Opt = [];
      this.V = '()';
      // Top Index
      this.TI = 0;
      /**
       * Defines, whether the
       * @type {boolean}
       */
      this.combo = false;
      /**
       * Defines, whether the Choice Field is an Edit Field.
       * An Edit Field is automatically an Combo Field.
       */
      Object.defineProperty(this, 'edit', {
          enumerable: true,
          set: function set(val) {
              if (val == true) {
                  this._edit = true;
                  // ComboBox has to be true
                  this.combo = true;
              } else {
                  this._edit = false;
              }
          },
          get: function get() {
              if (!this._edit) {
                  return false;
              }
              return this._edit;
          },
          configurable: false
      });
      this.hasAppearanceStream = true;
      Object.defineProperty(this, 'V', {
          get: function get() {
              AcroForm.internal.toPdfString();
          }
      });
  };
  AcroForm.internal.inherit(AcroForm.ChoiceField, AcroForm.Field);
  window["ChoiceField"] = AcroForm.ChoiceField;

  AcroForm.ListBox = function () {
      AcroForm.ChoiceField.call(this);
      //var combo = true;
  };
  AcroForm.internal.inherit(AcroForm.ListBox, AcroForm.ChoiceField);
  window["ListBox"] = AcroForm.ListBox;

  AcroForm.ComboBox = function () {
      AcroForm.ListBox.call(this);
      this.combo = true;
  };
  AcroForm.internal.inherit(AcroForm.ComboBox, AcroForm.ListBox);
  window["ComboBox"] = AcroForm.ComboBox;

  AcroForm.EditBox = function () {
      AcroForm.ComboBox.call(this);
      this.edit = true;
  };
  AcroForm.internal.inherit(AcroForm.EditBox, AcroForm.ComboBox);
  window["EditBox"] = AcroForm.EditBox;

  AcroForm.Button = function () {
      AcroForm.Field.call(this);
      this.FT = "/Btn";
      //this.hasAnnotation = true;
  };
  AcroForm.internal.inherit(AcroForm.Button, AcroForm.Field);
  window["Button"] = AcroForm.Button;

  AcroForm.PushButton = function () {
      AcroForm.Button.call(this);
      this.pushbutton = true;
  };
  AcroForm.internal.inherit(AcroForm.PushButton, AcroForm.Button);
  window["PushButton"] = AcroForm.PushButton;

  AcroForm.RadioButton = function () {
      AcroForm.Button.call(this);
      this.radio = true;
      var _Kids = [];
      Object.defineProperty(this, 'Kids', {
          enumerable: true,
          get: function get() {
              if (_Kids.length > 0) {
                  return _Kids;
              }
          }
      });

      Object.defineProperty(this, '__Kids', {
          get: function get() {
              return _Kids;
          }
      });

      var _noToggleToOff;

      Object.defineProperty(this, 'noToggleToOff', {
          enumerable: false,
          get: function get() {
              return _noToggleToOff;
          },
          set: function set(val) {
              _noToggleToOff = val;
          }
      });

      //this.hasAnnotation = false;
  };
  AcroForm.internal.inherit(AcroForm.RadioButton, AcroForm.Button);
  window["RadioButton"] = AcroForm.RadioButton;

  /*
   * The Child classs of a RadioButton (the radioGroup)
   * -> The single Buttons
   */
  AcroForm.ChildClass = function (parent, name) {
      AcroForm.Field.call(this);
      this.Parent = parent;

      // todo: set AppearanceType as variable that can be set from the outside...
      this._AppearanceType = AcroForm.Appearance.RadioButton.Circle; // The Default appearanceType is the Circle
      this.appearanceStreamContent = this._AppearanceType.createAppearanceStream(name);

      // Set Print in the Annot Flag
      this.F = AcroForm.internal.setBitPosition(this.F, 3, 1);

      // Set AppearanceCharacteristicsDictionary with default appearance if field is not interacting with user
      this.MK = this._AppearanceType.createMK(); // (8) -> Cross, (1)-> Circle, ()-> nothing

      // Default Appearance is Off
      this.AS = "/Off"; // + name;

      this._Name = name;
  };
  AcroForm.internal.inherit(AcroForm.ChildClass, AcroForm.Field);

  AcroForm.RadioButton.prototype.setAppearance = function (appearance) {
      if (!('createAppearanceStream' in appearance && 'createMK' in appearance)) {
          console.log("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");
          return;
      }
      for (var i in this.__Kids) {
          var child = this.__Kids[i];

          child.appearanceStreamContent = appearance.createAppearanceStream(child._Name);
          child.MK = appearance.createMK();
      }
  };

  AcroForm.RadioButton.prototype.createOption = function (name) {
      var parent = this;
      var kidCount = this.__Kids.length;

      // Create new Child for RadioGroup
      var child = new AcroForm.ChildClass(parent, name);
      // Add to Parent
      this.__Kids.push(child);

      jsPDF.API.addField(child);

      return child;
  };

  AcroForm.CheckBox = function () {
      Button.call(this);
      this.appearanceStreamContent = AcroForm.Appearance.CheckBox.createAppearanceStream();
      this.MK = AcroForm.Appearance.CheckBox.createMK();
      this.AS = "/On";
      this.V = "/On";
  };
  AcroForm.internal.inherit(AcroForm.CheckBox, AcroForm.Button);
  window["CheckBox"] = AcroForm.CheckBox;

  AcroForm.TextField = function () {
      AcroForm.Field.call(this);
      this.DA = AcroForm.Appearance.createDefaultAppearanceStream();
      this.F = 4;
      var _V;
      Object.defineProperty(this, 'V', {
          get: function get() {
              if (_V) {
                  return "(" + _V + ")";
              } else {
                  return _V;
              }
          },
          enumerable: true,
          set: function set(val) {
              _V = val;
          }
      });

      var _DV;
      Object.defineProperty(this, 'DV', {
          get: function get() {
              if (_DV) {
                  return "(" + _DV + ")";
              } else {
                  return _DV;
              }
          },
          enumerable: true,
          set: function set(val) {
              _DV = val;
          }
      });

      var _multiline = false;
      Object.defineProperty(this, 'multiline', {
          enumerable: false,
          get: function get() {
              return _multiline;
          },
          set: function set(val) {
              _multiline = val;
          }
      });

      //this.multiline = false;
      //this.password = false;
      /**
       * For PDF 1.4
       * @type {boolean}
       */
      //this.fileSelect = false;
      /**
       * For PDF 1.4
       * @type {boolean}
       */
      //this.doNotSpellCheck = false;
      /**
       * For PDF 1.4
       * @type {boolean}
       */
      //this.doNotScroll = false;

      var _MaxLen = false;
      Object.defineProperty(this, 'MaxLen', {
          enumerable: true,
          get: function get() {
              return _MaxLen;
          },
          set: function set(val) {
              _MaxLen = val;
          }
      });

      Object.defineProperty(this, 'hasAppearanceStream', {
          enumerable: false,
          get: function get() {
              return this.V || this.DV;
          }
      });
  };
  AcroForm.internal.inherit(AcroForm.TextField, AcroForm.Field);
  window["TextField"] = AcroForm.TextField;

  AcroForm.PasswordField = function () {
      TextField.call(this);
      Object.defineProperty(this, 'password', {
          value: true,
          enumerable: false,
          configurable: false,
          writable: false
      });
  };
  AcroForm.internal.inherit(AcroForm.PasswordField, AcroForm.TextField);
  window["PasswordField"] = AcroForm.PasswordField;

  // ############ internal functions

  /*
   * small workaround for calculating the TextMetric approximately
   * @param text
   * @param fontsize
   * @returns {TextMetrics} (Has Height and Width)
   */
  AcroForm.internal.calculateFontSpace = function (text, fontsize, fonttype) {
      var fonttype = fonttype || "helvetica";
      //re-use canvas object for speed improvements
      var canvas = AcroForm.internal.calculateFontSpace.canvas || (AcroForm.internal.calculateFontSpace.canvas = document.createElement('canvas'));

      var context = canvas.getContext('2d');
      context.save();
      var newFont = fontsize + " " + fonttype;
      context.font = newFont;
      var res = context.measureText(text);
      context.fontcolor = 'black';
      // Calculate height:
      var context = canvas.getContext('2d');
      res.height = context.measureText("3").width * 1.5; // 3 because in ZapfDingbats its a Hook and a 3 in normal fonts
      context.restore();

      var width = res.width;

      return res;
  };

  AcroForm.internal.calculateX = function (formObject, text, font, maxFontSize) {
      var maxFontSize = maxFontSize || 12;
      var font = font || "helvetica";
      var returnValue = {
          text: "",
          fontSize: ""
      };
      // Remove Brackets
      text = text.substr(0, 1) == '(' ? text.substr(1) : text;
      text = text.substr(text.length - 1) == ')' ? text.substr(0, text.length - 1) : text;
      // split into array of words
      var textSplit = text.split(' ');

      /**
       * the color could be ((alpha)||(r,g,b)||(c,m,y,k))
       * @type {string}
       */
      var color = "0 g\n";
      var fontSize = maxFontSize; // The Starting fontSize (The Maximum)
      var lineSpacing = 2;
      var borderPadding = 2;

      var height = AcroForm.Appearance.internal.getHeight(formObject) || 0;
      height = height < 0 ? -height : height;
      var width = AcroForm.Appearance.internal.getWidth(formObject) || 0;
      width = width < 0 ? -width : width;

      var isSmallerThanWidth = function isSmallerThanWidth(i, lastLine, fontSize) {
          if (i + 1 < textSplit.length) {
              var tmp = lastLine + " " + textSplit[i + 1];
              var TextWidth = AcroForm.internal.calculateFontSpace(tmp, fontSize + "px", font).width;
              var FieldWidth = width - 2 * borderPadding;
              return TextWidth <= FieldWidth;
          } else {
              return false;
          }
      };

      fontSize++;
      FontSize: while (true) {
          var text = "";
          fontSize--;
          var textHeight = AcroForm.internal.calculateFontSpace("3", fontSize + "px", font).height;
          var startY = formObject.multiline ? height - fontSize : (height - textHeight) / 2;
          startY += lineSpacing;
          var startX = -borderPadding;

          var lastX = startX,
              lastY = startY;
          var firstWordInLine = 0,
              lastWordInLine = 0;
          var lastLength = 0;

          var y = 0;
          if (fontSize == 0) {
              // In case, the Text doesn't fit at all
              fontSize = 12;
              text = "(...) Tj\n";
              text += "% Width of Text: " + AcroForm.internal.calculateFontSpace(text, "1px").width + ", FieldWidth:" + width + "\n";
              break;
          }

          lastLength = AcroForm.internal.calculateFontSpace(textSplit[0] + " ", fontSize + "px", font).width;

          var lastLine = "";
          var lineCount = 0;
          Line: for (var i in textSplit) {
              lastLine += textSplit[i] + " ";
              // Remove last blank
              lastLine = lastLine.substr(lastLine.length - 1) == " " ? lastLine.substr(0, lastLine.length - 1) : lastLine;
              var key = parseInt(i);
              lastLength = AcroForm.internal.calculateFontSpace(lastLine + " ", fontSize + "px", font).width;
              var nextLineIsSmaller = isSmallerThanWidth(key, lastLine, fontSize);
              var isLastWord = i >= textSplit.length - 1;
              if (nextLineIsSmaller && !isLastWord) {
                  lastLine += " ";
                  continue; // Line
              } else if (!nextLineIsSmaller && !isLastWord) {
                  if (!formObject.multiline) {
                      continue FontSize;
                  } else {
                      if ((textHeight + lineSpacing) * (lineCount + 2) + lineSpacing > height) {
                          // If the Text is higher than the FieldObject
                          continue FontSize;
                      }
                      lastWordInLine = key;
                      // go on
                  }
              } else if (isLastWord) {
                  lastWordInLine = key;
              } else {
                  if (formObject.multiline && (textHeight + lineSpacing) * (lineCount + 2) + lineSpacing > height) {
                      // If the Text is higher than the FieldObject
                      continue FontSize;
                  }
              }

              var line = '';

              for (var x = firstWordInLine; x <= lastWordInLine; x++) {
                  line += textSplit[x] + ' ';
              }

              // Remove last blank
              line = line.substr(line.length - 1) == " " ? line.substr(0, line.length - 1) : line;
              //lastLength -= blankSpace.width;
              lastLength = AcroForm.internal.calculateFontSpace(line, fontSize + "px", font).width;

              // Calculate startX
              switch (formObject.Q) {
                  case 2:
                      // Right justified
                      startX = width - lastLength - borderPadding;
                      break;
                  case 1:
                      // Q = 1 := Text-Alignment: Center
                      startX = (width - lastLength) / 2;
                      break;
                  case 0:
                  default:
                      startX = borderPadding;
                      break;
              }
              text += startX + ' ' + lastY + ' Td\n';
              text += '(' + line + ') Tj\n';
              // reset X in PDF
              text += -startX + ' 0 Td\n';

              // After a Line, adjust y position
              lastY = -(fontSize + lineSpacing);
              lastX = startX;

              // Reset for next iteration step
              lastLength = 0;
              firstWordInLine = lastWordInLine + 1;
              lineCount++;

              lastLine = "";
              continue Line;
          }
          break;
      }

      returnValue.text = text;
      returnValue.fontSize = fontSize;

      return returnValue;
  };

  AcroForm.internal.calculateAppearanceStream = function (formObject) {
      if (formObject.appearanceStreamContent) {
          // If appearanceStream is already set, use it
          return formObject.appearanceStreamContent;
      }

      if (!formObject.V && !formObject.DV) {
          return;
      }

      // else calculate it

      var stream = '';

      var text = formObject.V || formObject.DV;

      var calcRes = AcroForm.internal.calculateX(formObject, text);

      stream += '/Tx BMC\n' + 'q\n' +
      //color + '\n' +
      '/F1 ' + calcRes.fontSize + ' Tf\n' +
      // Text Matrix
      '1 0 0 1 0 0 Tm\n';
      // Begin Text
      stream += 'BT\n';
      stream += calcRes.text;
      // End Text
      stream += 'ET\n';
      stream += 'Q\n' + 'EMC\n';

      var appearanceStreamContent = new AcroForm.createFormXObject(formObject);

      appearanceStreamContent.stream = stream;

      var appearance = {
          N: {
              'Normal': appearanceStreamContent
          }
      };

      return appearanceStreamContent;
  };

  /*
   * Converts the Parameters from x,y,w,h to lowerLeftX, lowerLeftY, upperRightX, upperRightY
   * @param x
   * @param y
   * @param w
   * @param h
   * @returns {*[]}
   */
  AcroForm.internal.calculateCoordinates = function (x, y, w, h) {
      var coordinates = {};

      if (this.internal) {
          var mmtopx = function mmtopx(x) {
              return x * this.internal.scaleFactor;
          };

          if (Array.isArray(x)) {
              x[0] = AcroForm.scale(x[0]);
              x[1] = AcroForm.scale(x[1]);
              x[2] = AcroForm.scale(x[2]);
              x[3] = AcroForm.scale(x[3]);

              coordinates.lowerLeft_X = x[0] || 0;
              coordinates.lowerLeft_Y = mmtopx.call(this, this.internal.pageSize.height) - x[3] - x[1] || 0;
              coordinates.upperRight_X = x[0] + x[2] || 0;
              coordinates.upperRight_Y = mmtopx.call(this, this.internal.pageSize.height) - x[1] || 0;
          } else {
              x = AcroForm.scale(x);
              y = AcroForm.scale(y);
              w = AcroForm.scale(w);
              h = AcroForm.scale(h);
              coordinates.lowerLeft_X = x || 0;
              coordinates.lowerLeft_Y = this.internal.pageSize.height - y || 0;
              coordinates.upperRight_X = x + w || 0;
              coordinates.upperRight_Y = this.internal.pageSize.height - y + h || 0;
          }
      } else {
          // old method, that is fallback, if we can't get the pageheight, the coordinate-system starts from lower left
          if (Array.isArray(x)) {
              coordinates.lowerLeft_X = x[0] || 0;
              coordinates.lowerLeft_Y = x[1] || 0;
              coordinates.upperRight_X = x[0] + x[2] || 0;
              coordinates.upperRight_Y = x[1] + x[3] || 0;
          } else {
              coordinates.lowerLeft_X = x || 0;
              coordinates.lowerLeft_Y = y || 0;
              coordinates.upperRight_X = x + w || 0;
              coordinates.upperRight_Y = y + h || 0;
          }
      }

      return [coordinates.lowerLeft_X, coordinates.lowerLeft_Y, coordinates.upperRight_X, coordinates.upperRight_Y];
  };

  AcroForm.internal.calculateColor = function (r, g, b) {
      var color = new Array(3);
      color.r = r | 0;
      color.g = g | 0;
      color.b = b | 0;
      return color;
  };

  AcroForm.internal.getBitPosition = function (variable, position) {
      variable = variable || 0;
      var bitMask = 1;
      bitMask = bitMask << position - 1;
      return variable | bitMask;
  };

  AcroForm.internal.setBitPosition = function (variable, position, value) {
      variable = variable || 0;
      value = value || 1;

      var bitMask = 1;
      bitMask = bitMask << position - 1;

      if (value == 1) {
          // Set the Bit to 1
          var variable = variable | bitMask;
      } else {
          // Set the Bit to 0
          var variable = variable & ~bitMask;
      }

      return variable;
  };

  /**
   * jsPDF addHTML PlugIn
   * Copyright (c) 2014 Diego Casorran
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  (function (jsPDFAPI) {
  	'use strict';

  	/**
    * Renders an HTML element to canvas object which added to the PDF
    *
    * This PlugIn requires html2canvas: https://github.com/niklasvh/html2canvas
    *            OR rasterizeHTML: https://github.com/cburgmer/rasterizeHTML.js
    *
    * @public
    * @function
    * @param element {Mixed} HTML Element, or anything supported by html2canvas.
    * @param x {Number} starting X coordinate in jsPDF instance's declared units.
    * @param y {Number} starting Y coordinate in jsPDF instance's declared units.
    * @param options {Object} Additional options, check the code below.
    * @param callback {Function} to call when the rendering has finished.
    *
    * NOTE: Every parameter is optional except 'element' and 'callback', in such
    *       case the image is positioned at 0x0 covering the whole PDF document
    *       size. Ie, to easily take screenshots of webpages saving them to PDF.
    */

  	jsPDFAPI.addHTML = function (element, x, y, options, callback) {
  		'use strict';

  		if (typeof html2canvas === 'undefined' && typeof rasterizeHTML === 'undefined') throw new Error('You need either ' + 'https://github.com/niklasvh/html2canvas' + ' or https://github.com/cburgmer/rasterizeHTML.js');

  		if (typeof x !== 'number') {
  			options = x;
  			callback = y;
  		}

  		if (typeof options === 'function') {
  			callback = options;
  			options = null;
  		}

  		var I = this.internal,
  		    K = I.scaleFactor,
  		    W = I.pageSize.width,
  		    H = I.pageSize.height;

  		options = options || {};
  		options.onrendered = function (obj) {
  			x = parseInt(x) || 0;
  			y = parseInt(y) || 0;
  			var dim = options.dim || {};
  			var h = dim.h || 0;
  			var w = dim.w || Math.min(W, obj.width / K) - x;

  			var format = 'JPEG';
  			if (options.format) format = options.format;

  			if (obj.height > H && options.pagesplit) {
  				var crop = function () {
  					var cy = 0;
  					while (1) {
  						var canvas = document.createElement('canvas');
  						canvas.width = Math.min(W * K, obj.width);
  						canvas.height = Math.min(H * K, obj.height - cy);
  						var ctx = canvas.getContext('2d');
  						ctx.drawImage(obj, 0, cy, obj.width, canvas.height, 0, 0, canvas.width, canvas.height);
  						var args = [canvas, x, cy ? 0 : y, canvas.width / K, canvas.height / K, format, null, 'SLOW'];
  						this.addImage.apply(this, args);
  						cy += canvas.height;
  						if (cy >= obj.height) break;
  						this.addPage();
  					}
  					callback(w, cy, null, args);
  				}.bind(this);
  				if (obj.nodeName === 'CANVAS') {
  					var img = new Image();
  					img.onload = crop;
  					img.src = obj.toDataURL("image/png");
  					obj = img;
  				} else {
  					crop();
  				}
  			} else {
  				var alias = Math.random().toString(35);
  				var args = [obj, x, y, w, h, format, alias, 'SLOW'];

  				this.addImage.apply(this, args);

  				callback(w, h, alias, args);
  			}
  		}.bind(this);

  		if (typeof html2canvas !== 'undefined' && !options.rstz) {
  			return html2canvas(element, options);
  		}

  		if (typeof rasterizeHTML !== 'undefined') {
  			var meth = 'drawDocument';
  			if (typeof element === 'string') {
  				meth = /^http/.test(element) ? 'drawURL' : 'drawHTML';
  			}
  			options.width = options.width || W * K;
  			return rasterizeHTML[meth](element, void 0, options).then(function (r) {
  				options.onrendered(r.image);
  			}, function (e) {
  				callback(null, e);
  			});
  		}

  		return null;
  	};
  })(jsPDF.API);

  /** @preserve
   * jsPDF addImage plugin
   * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
   *               2013 Chris Dowling, https://github.com/gingerchris
   *               2013 Trinh Ho, https://github.com/ineedfat
   *               2013 Edwin Alejandro Perez, https://github.com/eaparango
   *               2013 Norah Smith, https://github.com/burnburnrocket
   *               2014 Diego Casorran, https://github.com/diegocr
   *               2014 James Robb, https://github.com/jamesbrobb
   *
   * 
   */

  ;(function (jsPDFAPI) {
  	'use strict';

  	var namespace = 'addImage_',
  	    supported_image_types = ['jpeg', 'jpg', 'png'];

  	// Image functionality ported from pdf.js
  	var putImage = function putImage(img) {

  		var objectNumber = this.internal.newObject(),
  		    out = this.internal.write,
  		    putStream = this.internal.putStream;

  		img['n'] = objectNumber;

  		out('<</Type /XObject');
  		out('/Subtype /Image');
  		out('/Width ' + img['w']);
  		out('/Height ' + img['h']);
  		if (img['cs'] === this.color_spaces.INDEXED) {
  			out('/ColorSpace [/Indexed /DeviceRGB '
  			// if an indexed png defines more than one colour with transparency, we've created a smask
  			+ (img['pal'].length / 3 - 1) + ' ' + ('smask' in img ? objectNumber + 2 : objectNumber + 1) + ' 0 R]');
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
  			for (; i < len; i++) {
  				trns += img['trns'][i] + ' ' + img['trns'][i] + ' ';
  			}out('/Mask [' + trns + ']');
  		}
  		if ('smask' in img) {
  			out('/SMask ' + (objectNumber + 1) + ' 0 R');
  		}
  		out('/Length ' + img['data'].length + '>>');

  		putStream(img['data']);

  		out('endobj');

  		// Soft mask
  		if ('smask' in img) {
  			var dp = '/Predictor ' + img['p'] + ' /Colors 1 /BitsPerComponent ' + img['bpc'] + ' /Columns ' + img['w'];
  			var smask = { 'w': img['w'], 'h': img['h'], 'cs': 'DeviceGray', 'bpc': img['bpc'], 'dp': dp, 'data': img['smask'] };
  			if ('f' in img) smask.f = img['f'];
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
  	},
  	    putResourcesCallback = function putResourcesCallback() {
  		var images = this.internal.collections[namespace + 'images'];
  		for (var i in images) {
  			putImage.call(this, images[i]);
  		}
  	},
  	    putXObjectsDictCallback = function putXObjectsDictCallback() {
  		var images = this.internal.collections[namespace + 'images'],
  		    out = this.internal.write,
  		    image;
  		for (var i in images) {
  			image = images[i];
  			out('/I' + image['i'], image['n'], '0', 'R');
  		}
  	},
  	    checkCompressValue = function checkCompressValue(value) {
  		if (value && typeof value === 'string') value = value.toUpperCase();
  		return value in jsPDFAPI.image_compression ? value : jsPDFAPI.image_compression.NONE;
  	},
  	    getImages = function getImages() {
  		var images = this.internal.collections[namespace + 'images'];
  		//first run, so initialise stuff
  		if (!images) {
  			this.internal.collections[namespace + 'images'] = images = {};
  			this.internal.events.subscribe('putResources', putResourcesCallback);
  			this.internal.events.subscribe('putXobjectDict', putXObjectsDictCallback);
  		}

  		return images;
  	},
  	    getImageIndex = function getImageIndex(images) {
  		var imageIndex = 0;

  		if (images) {
  			// this is NOT the first time this method is ran on this instance of jsPDF object.
  			imageIndex = Object.keys ? Object.keys(images).length : function (o) {
  				var i = 0;
  				for (var e in o) {
  					if (o.hasOwnProperty(e)) {
  						i++;
  					}
  				}
  				return i;
  			}(images);
  		}

  		return imageIndex;
  	},
  	    notDefined = function notDefined(value) {
  		return typeof value === 'undefined' || value === null;
  	},
  	    generateAliasFromData = function generateAliasFromData(data) {
  		return typeof data === 'string' && jsPDFAPI.sHashCode(data);
  	},
  	    doesNotSupportImageType = function doesNotSupportImageType(type) {
  		return supported_image_types.indexOf(type) === -1;
  	},
  	    processMethodNotEnabled = function processMethodNotEnabled(type) {
  		return typeof jsPDFAPI['process' + type.toUpperCase()] !== 'function';
  	},
  	    isDOMElement = function isDOMElement(object) {
  		return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.nodeType === 1;
  	},
  	    createDataURIFromElement = function createDataURIFromElement(element, format, angle) {

  		//if element is an image which uses data url definition, just return the dataurl
  		if (element.nodeName === 'IMG' && element.hasAttribute('src')) {
  			var src = '' + element.getAttribute('src');
  			if (!angle && src.indexOf('data:image/') === 0) return src;

  			// only if the user doesn't care about a format
  			if (!format && /\.png(?:[?#].*)?$/i.test(src)) format = 'png';
  		}

  		if (element.nodeName === 'CANVAS') {
  			var canvas = element;
  		} else {
  			var canvas = document.createElement('canvas');
  			canvas.width = element.clientWidth || element.width;
  			canvas.height = element.clientHeight || element.height;

  			var ctx = canvas.getContext('2d');
  			if (!ctx) {
  				throw 'addImage requires canvas to be supported by browser.';
  			}
  			if (angle) {
  				var x,
  				    y,
  				    b,
  				    c,
  				    s,
  				    w,
  				    h,
  				    to_radians = Math.PI / 180,
  				    angleInRadians;

  				if ((typeof angle === 'undefined' ? 'undefined' : _typeof(angle)) === 'object') {
  					x = angle.x;
  					y = angle.y;
  					b = angle.bg;
  					angle = angle.angle;
  				}
  				angleInRadians = angle * to_radians;
  				c = Math.abs(Math.cos(angleInRadians));
  				s = Math.abs(Math.sin(angleInRadians));
  				w = canvas.width;
  				h = canvas.height;
  				canvas.width = h * s + w * c;
  				canvas.height = h * c + w * s;

  				if (isNaN(x)) x = canvas.width / 2;
  				if (isNaN(y)) y = canvas.height / 2;

  				ctx.clearRect(0, 0, canvas.width, canvas.height);
  				ctx.fillStyle = b || 'white';
  				ctx.fillRect(0, 0, canvas.width, canvas.height);
  				ctx.save();
  				ctx.translate(x, y);
  				ctx.rotate(angleInRadians);
  				ctx.drawImage(element, -(w / 2), -(h / 2));
  				ctx.rotate(-angleInRadians);
  				ctx.translate(-x, -y);
  				ctx.restore();
  			} else {
  				ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
  			}
  		}
  		return canvas.toDataURL(('' + format).toLowerCase() == 'png' ? 'image/png' : 'image/jpeg');
  	},
  	    checkImagesForAlias = function checkImagesForAlias(alias, images) {
  		var cached_info;
  		if (images) {
  			for (var e in images) {
  				if (alias === images[e].alias) {
  					cached_info = images[e];
  					break;
  				}
  			}
  		}
  		return cached_info;
  	},
  	    determineWidthAndHeight = function determineWidthAndHeight(w, h, info) {
  		if (!w && !h) {
  			w = -96;
  			h = -96;
  		}
  		if (w < 0) {
  			w = -1 * info['w'] * 72 / w / this.internal.scaleFactor;
  		}
  		if (h < 0) {
  			h = -1 * info['h'] * 72 / h / this.internal.scaleFactor;
  		}
  		if (w === 0) {
  			w = h * info['w'] / info['h'];
  		}
  		if (h === 0) {
  			h = w * info['h'] / info['w'];
  		}

  		return [w, h];
  	},
  	    writeImageToPDF = function writeImageToPDF(x, y, w, h, info, index, images) {
  		var dims = determineWidthAndHeight.call(this, w, h, info),
  		    coord = this.internal.getCoordinateString,
  		    vcoord = this.internal.getVerticalCoordinateString;

  		w = dims[0];
  		h = dims[1];

  		images[index] = info;

  		this.internal.write('q', coord(w), '0 0', coord(h) // TODO: check if this should be shifted by vcoord
  		, coord(x), vcoord(y + h), 'cm /I' + info['i'], 'Do Q');
  	};

  	/**
    * COLOR SPACES
    */
  	jsPDFAPI.color_spaces = {
  		DEVICE_RGB: 'DeviceRGB',
  		DEVICE_GRAY: 'DeviceGray',
  		DEVICE_CMYK: 'DeviceCMYK',
  		CAL_GREY: 'CalGray',
  		CAL_RGB: 'CalRGB',
  		LAB: 'Lab',
  		ICC_BASED: 'ICCBased',
  		INDEXED: 'Indexed',
  		PATTERN: 'Pattern',
  		SEPARATION: 'Separation',
  		DEVICE_N: 'DeviceN'
  	};

  	/**
    * DECODE METHODS
    */
  	jsPDFAPI.decode = {
  		DCT_DECODE: 'DCTDecode',
  		FLATE_DECODE: 'FlateDecode',
  		LZW_DECODE: 'LZWDecode',
  		JPX_DECODE: 'JPXDecode',
  		JBIG2_DECODE: 'JBIG2Decode',
  		ASCII85_DECODE: 'ASCII85Decode',
  		ASCII_HEX_DECODE: 'ASCIIHexDecode',
  		RUN_LENGTH_DECODE: 'RunLengthDecode',
  		CCITT_FAX_DECODE: 'CCITTFaxDecode'
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

  	jsPDFAPI.sHashCode = function (str) {
  		return Array.prototype.reduce && str.split("").reduce(function (a, b) {
  			a = (a << 5) - a + b.charCodeAt(0);return a & a;
  		}, 0);
  	};

  	jsPDFAPI.isString = function (object) {
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
  	jsPDFAPI.extractInfoFromBase64DataURI = function (dataURI) {
  		return (/^data:([\w]+?\/([\w]+?));base64,(.+?)$/g.exec(dataURI)
  		);
  	};

  	/**
    * Check to see if ArrayBuffer is supported
    */
  	jsPDFAPI.supportsArrayBuffer = function () {
  		return typeof ArrayBuffer !== 'undefined' && typeof Uint8Array !== 'undefined';
  	};

  	/**
    * Tests supplied object to determine if ArrayBuffer
    * @param {Object[object]}
    */
  	jsPDFAPI.isArrayBuffer = function (object) {
  		if (!this.supportsArrayBuffer()) return false;
  		return object instanceof ArrayBuffer;
  	};

  	/**
    * Tests supplied object to determine if it implements the ArrayBufferView (TypedArray) interface
    * @param {Object[object]}
    */
  	jsPDFAPI.isArrayBufferView = function (object) {
  		if (!this.supportsArrayBuffer()) return false;
  		if (typeof Uint32Array === 'undefined') return false;
  		return object instanceof Int8Array || object instanceof Uint8Array || typeof Uint8ClampedArray !== 'undefined' && object instanceof Uint8ClampedArray || object instanceof Int16Array || object instanceof Uint16Array || object instanceof Int32Array || object instanceof Uint32Array || object instanceof Float32Array || object instanceof Float64Array;
  	};

  	/**
    * Exactly what it says on the tin
    */
  	jsPDFAPI.binaryStringToUint8Array = function (binary_string) {
  		/*
     * not sure how efficient this will be will bigger files. Is there a native method?
     */
  		var len = binary_string.length;
  		var bytes = new Uint8Array(len);
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
  	jsPDFAPI.arrayBufferToBinaryString = function (buffer) {
  		/*if('TextDecoder' in window){
    	var decoder = new TextDecoder('ascii');
    	return decoder.decode(buffer);
    }*/

  		if (this.isArrayBuffer(buffer)) buffer = new Uint8Array(buffer);

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
  	jsPDFAPI.arrayBufferToBase64 = function (arrayBuffer) {
  		var base64 = '';
  		var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  		var bytes = new Uint8Array(arrayBuffer);
  		var byteLength = bytes.byteLength;
  		var byteRemainder = byteLength % 3;
  		var mainLength = byteLength - byteRemainder;

  		var a, b, c, d;
  		var chunk;

  		// Main loop deals with bytes in chunks of 3
  		for (var i = 0; i < mainLength; i = i + 3) {
  			// Combine the three bytes into a single integer
  			chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];

  			// Use bitmasks to extract 6-bit segments from the triplet
  			a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
  			b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
  			c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
  			d = chunk & 63; // 63       = 2^6 - 1

  			// Convert the raw binary segments to the appropriate ASCII encoding
  			base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  		}

  		// Deal with the remaining bytes and padding
  		if (byteRemainder == 1) {
  			chunk = bytes[mainLength];

  			a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

  			// Set the 4 least significant bits to zero
  			b = (chunk & 3) << 4; // 3   = 2^2 - 1

  			base64 += encodings[a] + encodings[b] + '==';
  		} else if (byteRemainder == 2) {
  			chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];

  			a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
  			b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

  			// Set the 2 least significant bits to zero
  			c = (chunk & 15) << 2; // 15    = 2^4 - 1

  			base64 += encodings[a] + encodings[b] + encodings[c] + '=';
  		}

  		return base64;
  	};

  	jsPDFAPI.createImageInfo = function (data, wd, ht, cs, bpc, f, imageIndex, alias, dp, trns, pal, smask, p) {
  		var info = {
  			alias: alias,
  			w: wd,
  			h: ht,
  			cs: cs,
  			bpc: bpc,
  			i: imageIndex,
  			data: data
  			// n: objectNumber will be added by putImage code
  		};

  		if (f) info.f = f;
  		if (dp) info.dp = dp;
  		if (trns) info.trns = trns;
  		if (pal) info.pal = pal;
  		if (smask) info.smask = smask;
  		if (p) info.p = p; // predictor parameter for PNG compression

  		return info;
  	};

  	jsPDFAPI.addImage = function (imageData, format, x, y, w, h, alias, compression, rotation) {
  		'use strict';

  		if (typeof format !== 'string') {
  			var tmp = h;
  			h = w;
  			w = y;
  			y = x;
  			x = format;
  			format = tmp;
  		}

  		if ((typeof imageData === 'undefined' ? 'undefined' : _typeof(imageData)) === 'object' && !isDOMElement(imageData) && "imageData" in imageData) {
  			var options = imageData;

  			imageData = options.imageData;
  			format = options.format || format;
  			x = options.x || x || 0;
  			y = options.y || y || 0;
  			w = options.w || w;
  			h = options.h || h;
  			alias = options.alias || alias;
  			compression = options.compression || compression;
  			rotation = options.rotation || options.angle || rotation;
  		}

  		if (isNaN(x) || isNaN(y)) {
  			console.error('jsPDF.addImage: Invalid coordinates', arguments);
  			throw new Error('Invalid coordinates passed to jsPDF.addImage');
  		}

  		var images = getImages.call(this),
  		    info;

  		if (!(info = checkImagesForAlias(imageData, images))) {
  			var dataAsBinaryString;

  			if (isDOMElement(imageData)) imageData = createDataURIFromElement(imageData, format, rotation);

  			if (notDefined(alias)) alias = generateAliasFromData(imageData);

  			if (!(info = checkImagesForAlias(alias, images))) {

  				if (this.isString(imageData)) {

  					var base64Info = this.extractInfoFromBase64DataURI(imageData);

  					if (base64Info) {

  						format = base64Info[2];
  						imageData = atob(base64Info[3]); //convert to binary string
  					} else {

  						if (imageData.charCodeAt(0) === 0x89 && imageData.charCodeAt(1) === 0x50 && imageData.charCodeAt(2) === 0x4e && imageData.charCodeAt(3) === 0x47) format = 'png';
  					}
  				}
  				format = (format || 'JPEG').toLowerCase();

  				if (doesNotSupportImageType(format)) throw new Error('addImage currently only supports formats ' + supported_image_types + ', not \'' + format + '\'');

  				if (processMethodNotEnabled(format)) throw new Error('please ensure that the plugin for \'' + format + '\' support is added');

  				/**
       * need to test if it's more efficient to convert all binary strings
       * to TypedArray - or should we just leave and process as string?
       */
  				if (this.supportsArrayBuffer()) {
  					// no need to convert if imageData is already uint8array
  					if (!(imageData instanceof Uint8Array)) {
  						dataAsBinaryString = imageData;
  						imageData = this.binaryStringToUint8Array(imageData);
  					}
  				}

  				info = this['process' + format.toUpperCase()](imageData, getImageIndex(images), alias, checkCompressValue(compression), dataAsBinaryString);

  				if (!info) throw new Error('An unkwown error occurred whilst processing the image');
  			}
  		}

  		writeImageToPDF.call(this, x, y, w, h, info, info.i, images);

  		return this;
  	};

  	/**
    * JPEG SUPPORT
    **/

  	//takes a string imgData containing the raw bytes of
  	//a jpeg image and returns [width, height]
  	//Algorithm from: http://www.64lines.com/jpeg-width-height
  	var getJpegSize = function getJpegSize(imgData) {
  		'use strict';

  		var width, height, numcomponents;
  		// Verify we have a valid jpeg header 0xff,0xd8,0xff,0xe0,?,?,'J','F','I','F',0x00
  		if (!imgData.charCodeAt(0) === 0xff || !imgData.charCodeAt(1) === 0xd8 || !imgData.charCodeAt(2) === 0xff || !imgData.charCodeAt(3) === 0xe0 || !imgData.charCodeAt(6) === 'J'.charCodeAt(0) || !imgData.charCodeAt(7) === 'F'.charCodeAt(0) || !imgData.charCodeAt(8) === 'I'.charCodeAt(0) || !imgData.charCodeAt(9) === 'F'.charCodeAt(0) || !imgData.charCodeAt(10) === 0x00) {
  			throw new Error('getJpegSize requires a binary string jpeg file');
  		}
  		var blockLength = imgData.charCodeAt(4) * 256 + imgData.charCodeAt(5);
  		var i = 4,
  		    len = imgData.length;
  		while (i < len) {
  			i += blockLength;
  			if (imgData.charCodeAt(i) !== 0xff) {
  				throw new Error('getJpegSize could not find the size of the image');
  			}
  			if (imgData.charCodeAt(i + 1) === 0xc0 || //(SOF) Huffman  - Baseline DCT
  			imgData.charCodeAt(i + 1) === 0xc1 || //(SOF) Huffman  - Extended sequential DCT
  			imgData.charCodeAt(i + 1) === 0xc2 || // Progressive DCT (SOF2)
  			imgData.charCodeAt(i + 1) === 0xc3 || // Spatial (sequential) lossless (SOF3)
  			imgData.charCodeAt(i + 1) === 0xc4 || // Differential sequential DCT (SOF5)
  			imgData.charCodeAt(i + 1) === 0xc5 || // Differential progressive DCT (SOF6)
  			imgData.charCodeAt(i + 1) === 0xc6 || // Differential spatial (SOF7)
  			imgData.charCodeAt(i + 1) === 0xc7) {
  				height = imgData.charCodeAt(i + 5) * 256 + imgData.charCodeAt(i + 6);
  				width = imgData.charCodeAt(i + 7) * 256 + imgData.charCodeAt(i + 8);
  				numcomponents = imgData.charCodeAt(i + 9);
  				return [width, height, numcomponents];
  			} else {
  				i += 2;
  				blockLength = imgData.charCodeAt(i) * 256 + imgData.charCodeAt(i + 1);
  			}
  		}
  	},
  	    getJpegSizeFromBytes = function getJpegSizeFromBytes(data) {

  		var hdr = data[0] << 8 | data[1];

  		if (hdr !== 0xFFD8) throw new Error('Supplied data is not a JPEG');

  		var len = data.length,
  		    block = (data[4] << 8) + data[5],
  		    pos = 4,
  		    bytes,
  		    width,
  		    height,
  		    numcomponents;

  		while (pos < len) {
  			pos += block;
  			bytes = readBytes(data, pos);
  			block = (bytes[2] << 8) + bytes[3];
  			if ((bytes[1] === 0xC0 || bytes[1] === 0xC2) && bytes[0] === 0xFF && block > 7) {
  				bytes = readBytes(data, pos + 5);
  				width = (bytes[2] << 8) + bytes[3];
  				height = (bytes[0] << 8) + bytes[1];
  				numcomponents = bytes[4];
  				return { width: width, height: height, numcomponents: numcomponents };
  			}

  			pos += 2;
  		}

  		throw new Error('getJpegSizeFromBytes could not find the size of the image');
  	},
  	    readBytes = function readBytes(data, offset) {
  		return data.subarray(offset, offset + 5);
  	};

  	jsPDFAPI.processJPEG = function (data, index, alias, compression, dataAsBinaryString) {
  		'use strict';

  		var colorSpace = this.color_spaces.DEVICE_RGB,
  		    filter = this.decode.DCT_DECODE,
  		    bpc = 8,
  		    dims;

  		if (this.isString(data)) {
  			dims = getJpegSize(data);
  			return this.createImageInfo(data, dims[0], dims[1], dims[3] == 1 ? this.color_spaces.DEVICE_GRAY : colorSpace, bpc, filter, index, alias);
  		}

  		if (this.isArrayBuffer(data)) data = new Uint8Array(data);

  		if (this.isArrayBufferView(data)) {

  			dims = getJpegSizeFromBytes(data);

  			// if we already have a stored binary string rep use that
  			data = dataAsBinaryString || this.arrayBufferToBinaryString(data);

  			return this.createImageInfo(data, dims.width, dims.height, dims.numcomponents == 1 ? this.color_spaces.DEVICE_GRAY : colorSpace, bpc, filter, index, alias);
  		}

  		return null;
  	};

  	jsPDFAPI.processJPG = function () /*data, index, alias, compression, dataAsBinaryString*/{
  		return this.processJPEG.apply(this, arguments);
  	};
  })(jsPDF.API);

  /**
   * jsPDF Annotations PlugIn
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * There are many types of annotations in a PDF document. Annotations are placed
   * on a page at a particular location. They are not 'attached' to an object.
   * <br />
   * This plugin current supports <br />
   * <li> Goto Page (set pageNumber and top in options)
   * <li> Goto Name (set name and top in options)
   * <li> Goto URL (set url in options)
   * <p>
   * 	The destination magnification factor can also be specified when goto is a page number or a named destination. (see documentation below)
   *  (set magFactor in options).  XYZ is the default.
   * </p>
   * <p>
   *  Links, Text, Popup, and FreeText are supported.
   * </p>
   * <p>
   * Options In PDF spec Not Implemented Yet
   * <li> link border
   * <li> named target
   * <li> page coordinates
   * <li> destination page scaling and layout
   * <li> actions other than URL and GotoPage
   * <li> background / hover actions
   * </p>
   */

  /*
      Destination Magnification Factors
      See PDF 1.3 Page 386 for meanings and options

      [supported]
  	XYZ (options; left top zoom)
  	Fit (no options)
  	FitH (options: top)
  	FitV (options: left)

  	[not supported]
  	FitR
  	FitB
  	FitBH
  	FitBV
   */

  (function (jsPDFAPI) {
  	'use strict';

  	var annotationPlugin = {

  		/**
     * An array of arrays, indexed by <em>pageNumber</em>.
     */
  		annotations: [],

  		f2: function f2(number) {
  			return number.toFixed(2);
  		},

  		notEmpty: function notEmpty(obj) {
  			if (typeof obj != 'undefined') {
  				if (obj != '') {
  					return true;
  				}
  			}
  		}
  	};

  	jsPDF.API.annotationPlugin = annotationPlugin;

  	jsPDF.API.events.push(['addPage', function (info) {
  		this.annotationPlugin.annotations[info.pageNumber] = [];
  	}]);

  	jsPDFAPI.events.push(['putPage', function (info) {
  		//TODO store annotations in pageContext so reorder/remove will not affect them.
  		var pageAnnos = this.annotationPlugin.annotations[info.pageNumber];

  		var found = false;
  		for (var a = 0; a < pageAnnos.length && !found; a++) {
  			var anno = pageAnnos[a];
  			switch (anno.type) {
  				case 'link':
  					if (annotationPlugin.notEmpty(anno.options.url) || annotationPlugin.notEmpty(anno.options.pageNumber)) {
  						found = true;
  						break;
  					}
  				case 'reference':
  				case 'text':
  				case 'freetext':
  					found = true;
  					break;
  			}
  		}
  		if (found == false) {
  			return;
  		}

  		this.internal.write("/Annots [");
  		var f2 = this.annotationPlugin.f2;
  		var k = this.internal.scaleFactor;
  		var pageHeight = this.internal.pageSize.height;
  		var pageInfo = this.internal.getPageInfo(info.pageNumber);
  		for (var a = 0; a < pageAnnos.length; a++) {
  			var anno = pageAnnos[a];

  			switch (anno.type) {
  				case 'reference':
  					// References to Widget Anotations (for AcroForm Fields)
  					this.internal.write(' ' + anno.object.objId + ' 0 R ');
  					break;
  				case 'text':
  					// Create a an object for both the text and the popup
  					var objText = this.internal.newAdditionalObject();
  					var objPopup = this.internal.newAdditionalObject();

  					var title = anno.title || 'Note';
  					var rect = "/Rect [" + f2(anno.bounds.x * k) + " " + f2(pageHeight - (anno.bounds.y + anno.bounds.h) * k) + " " + f2((anno.bounds.x + anno.bounds.w) * k) + " " + f2((pageHeight - anno.bounds.y) * k) + "] ";
  					line = '<</Type /Annot /Subtype /' + 'Text' + ' ' + rect + '/Contents (' + anno.contents + ')';
  					line += ' /Popup ' + objPopup.objId + " 0 R";
  					line += ' /P ' + pageInfo.objId + " 0 R";
  					line += ' /T (' + title + ') >>';
  					objText.content = line;

  					var parent = objText.objId + ' 0 R';
  					var popoff = 30;
  					var rect = "/Rect [" + f2((anno.bounds.x + popoff) * k) + " " + f2(pageHeight - (anno.bounds.y + anno.bounds.h) * k) + " " + f2((anno.bounds.x + anno.bounds.w + popoff) * k) + " " + f2((pageHeight - anno.bounds.y) * k) + "] ";
  					//var rect2 = "/Rect [" + f2(anno.bounds.x * k) + " " + f2((pageHeight - anno.bounds.y) * k) + " " + f2(anno.bounds.x + anno.bounds.w * k) + " " + f2(pageHeight - (anno.bounds.y + anno.bounds.h) * k) + "] ";
  					line = '<</Type /Annot /Subtype /' + 'Popup' + ' ' + rect + ' /Parent ' + parent;
  					if (anno.open) {
  						line += ' /Open true';
  					}
  					line += ' >>';
  					objPopup.content = line;

  					this.internal.write(objText.objId, '0 R', objPopup.objId, '0 R');

  					break;
  				case 'freetext':
  					var rect = "/Rect [" + f2(anno.bounds.x * k) + " " + f2((pageHeight - anno.bounds.y) * k) + " " + f2(anno.bounds.x + anno.bounds.w * k) + " " + f2(pageHeight - (anno.bounds.y + anno.bounds.h) * k) + "] ";
  					var color = anno.color || '#000000';
  					line = '<</Type /Annot /Subtype /' + 'FreeText' + ' ' + rect + '/Contents (' + anno.contents + ')';
  					line += ' /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#' + color + ')';
  					line += ' /Border [0 0 0]';
  					line += ' >>';
  					this.internal.write(line);
  					break;
  				case 'link':
  					if (anno.options.name) {
  						var loc = this.annotations._nameMap[anno.options.name];
  						anno.options.pageNumber = loc.page;
  						anno.options.top = loc.y;
  					} else {
  						if (!anno.options.top) {
  							anno.options.top = 0;
  						}
  					}

  					//var pageHeight = this.internal.pageSize.height * this.internal.scaleFactor;
  					var rect = "/Rect [" + f2(anno.x * k) + " " + f2((pageHeight - anno.y) * k) + " " + f2(anno.x + anno.w * k) + " " + f2(pageHeight - (anno.y + anno.h) * k) + "] ";

  					var line = '';
  					if (anno.options.url) {
  						line = '<</Type /Annot /Subtype /Link ' + rect + '/Border [0 0 0] /A <</S /URI /URI (' + anno.options.url + ') >>';
  					} else if (anno.options.pageNumber) {
  						// first page is 0
  						var info = this.internal.getPageInfo(anno.options.pageNumber);
  						line = '<</Type /Annot /Subtype /Link ' + rect + '/Border [0 0 0] /Dest [' + info.objId + " 0 R";
  						anno.options.magFactor = anno.options.magFactor || "XYZ";
  						switch (anno.options.magFactor) {
  							case 'Fit':
  								line += ' /Fit]';
  								break;
  							case 'FitH':
  								//anno.options.top = anno.options.top || f2(pageHeight * k);
  								line += ' /FitH ' + anno.options.top + ']';
  								break;
  							case 'FitV':
  								anno.options.left = anno.options.left || 0;
  								line += ' /FitV ' + anno.options.left + ']';
  								break;
  							case 'XYZ':
  							default:
  								var top = f2((pageHeight - anno.options.top) * k); // || f2(pageHeight * k);
  								anno.options.left = anno.options.left || 0;
  								// 0 or null zoom will not change zoom factor
  								if (typeof anno.options.zoom === 'undefined') {
  									anno.options.zoom = 0;
  								}
  								line += ' /XYZ ' + anno.options.left + ' ' + top + ' ' + anno.options.zoom + ']';
  								break;
  						}
  					} else {
  						// TODO error - should not be here
  					}
  					if (line != '') {
  						line += " >>";
  						this.internal.write(line);
  					}
  					break;
  			}
  		}
  		this.internal.write("]");
  	}]);

  	jsPDFAPI.createAnnotation = function (options) {
  		switch (options.type) {
  			case 'link':
  				this.link(options.bounds.x, options.bounds.y, options.bounds.w, options.bounds.h, options);
  				break;
  			case 'text':
  			case 'freetext':
  				this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push(options);
  				break;
  		}
  	};

  	/**
    * valid options
    * <li> pageNumber or url [required]
    * <p>If pageNumber is specified, top and zoom may also be specified</p>
    */
  	jsPDFAPI.link = function (x, y, w, h, options) {
  		'use strict';

  		this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push({
  			x: x,
  			y: y,
  			w: w,
  			h: h,
  			options: options,
  			type: 'link'
  		});
  	};

  	/**
    * valid options
    * <li> pageNumber or url [required]
    * <p>If pageNumber is specified, top and zoom may also be specified</p>
    */
  	jsPDFAPI.link = function (x, y, w, h, options) {
  		'use strict';

  		this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push({
  			x: x,
  			y: y,
  			w: w,
  			h: h,
  			options: options,
  			type: 'link'
  		});
  	};

  	/**
    * Currently only supports single line text.
    * Returns the width of the text/link
    */
  	jsPDFAPI.textWithLink = function (text, x, y, options) {
  		'use strict';

  		var width = this.getTextWidth(text);
  		var height = this.internal.getLineHeight();
  		this.text(text, x, y);
  		//TODO We really need the text baseline height to do this correctly.
  		// Or ability to draw text on top, bottom, center, or baseline.
  		y += height * .2;
  		this.link(x, y - height, width, height, options);
  		return width;
  	};

  	//TODO move into external library
  	jsPDFAPI.getTextWidth = function (text) {
  		'use strict';

  		var fontSize = this.internal.getFontSize();
  		var txtWidth = this.getStringUnitWidth(text) * fontSize / this.internal.scaleFactor;
  		return txtWidth;
  	};

  	//TODO move into external library
  	jsPDFAPI.getLineHeight = function () {
  		return this.internal.getLineHeight();
  	};

  	return this;
  })(jsPDF.API);

  /**
   * jsPDF Autoprint Plugin
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  (function (jsPDFAPI) {
  	'use strict';

  	jsPDFAPI.autoPrint = function () {
  		'use strict';

  		var refAutoPrintTag;

  		this.internal.events.subscribe('postPutResources', function () {
  			refAutoPrintTag = this.internal.newObject();
  			this.internal.write("<< /S/Named /Type/Action /N/Print >>", "endobj");
  		});

  		this.internal.events.subscribe("putCatalog", function () {
  			this.internal.write("/OpenAction " + refAutoPrintTag + " 0" + " R");
  		});
  		return this;
  	};
  })(jsPDF.API);

  /**
   * jsPDF Canvas PlugIn
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * This plugin mimics the HTML5 Canvas
   * 
   * The goal is to provide a way for current canvas users to print directly to a PDF.
   */

  (function (jsPDFAPI) {
  	'use strict';

  	jsPDFAPI.events.push(['initialized', function () {
  		this.canvas.pdf = this;
  	}]);

  	jsPDFAPI.canvas = {
  		getContext: function getContext(name) {
  			this.pdf.context2d._canvas = this;
  			return this.pdf.context2d;
  		},
  		style: {}
  	};

  	Object.defineProperty(jsPDFAPI.canvas, 'width', {
  		get: function get() {
  			return this._width;
  		},
  		set: function set(value) {
  			this._width = value;
  			this.getContext('2d').pageWrapX = value + 1;
  		}
  	});

  	Object.defineProperty(jsPDFAPI.canvas, 'height', {
  		get: function get() {
  			return this._height;
  		},
  		set: function set(value) {
  			this._height = value;
  			this.getContext('2d').pageWrapY = value + 1;
  		}
  	});

  	return this;
  })(jsPDF.API);

  /** ====================================================================
   * jsPDF Cell plugin
   * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
   *               2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
   *               2013 Lee Driscoll, https://github.com/lsdriscoll
   *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
   *               2014 James Hall, james@parall.ax
   *               2014 Diego Casorran, https://github.com/diegocr
   *
   * 
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
          setLastCellPosition = function setLastCellPosition(x, y, w, h, ln) {
          lastCellPos = { 'x': x, 'y': y, 'w': w, 'h': h, 'ln': ln };
      },
          getLastCellPosition = function getLastCellPosition() {
          return lastCellPos;
      },
          NO_MARGINS = { left: 0, top: 0, bottom: 0 };

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

          try {
              text.style.fontStyle = fontStyle;
          } catch (e) {
              text.style.fontWeight = fontStyle;
          }

          text.style.fontName = fontName;
          text.style.fontSize = fontSize + 'pt';
          try {
              text.textContent = txt;
          } catch (e) {
              text.innerText = txt;
          }

          document.body.appendChild(text);

          dimensions = { w: (text.offsetWidth + 1) * px2pt, h: (text.offsetHeight + 1) * px2pt };

          document.body.removeChild(text);

          return dimensions;
      };

      jsPDFAPI.cellAddPage = function () {
          var margins = this.margins || NO_MARGINS;

          this.addPage();

          setLastCellPosition(margins.left, margins.top, undefined, undefined);
          //setLastCellPosition(undefined, undefined, undefined, undefined, undefined);
          pages += 1;
      };

      jsPDFAPI.cellInitialize = function () {
          lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined };
          pages = 1;
      };

      jsPDFAPI.cell = function (x, y, w, h, txt, ln, align) {
          var curCell = getLastCellPosition();
          var pgAdded = false;

          // If this is not the first cell, we must change its position
          if (curCell.ln !== undefined) {
              if (curCell.ln === ln) {
                  //Same line
                  x = curCell.x + curCell.w;
                  y = curCell.y;
              } else {
                  //New line
                  var margins = this.margins || NO_MARGINS;
                  if (curCell.y + curCell.h + h + margin >= this.internal.pageSize.height - margins.bottom) {
                      this.cellAddPage();
                      pgAdded = true;
                      if (this.printHeaders && this.tableHeaderRow) {
                          this.printHeaderRow(ln, true);
                      }
                  }
                  //We ignore the passed y: the lines may have different heights
                  y = getLastCellPosition().y + getLastCellPosition().h;
                  if (pgAdded) y = margin + 10;
              }
          }

          if (txt[0] !== undefined) {
              if (this.printingHeaderRow) {
                  this.rect(x, y, w, h, 'FD');
              } else {
                  this.rect(x, y, w, h);
              }
              if (align === 'right') {
                  if (!(txt instanceof Array)) {
                      txt = [txt];
                  }
                  for (var i = 0; i < txt.length; i++) {
                      var currentLine = txt[i];
                      var textSize = this.getStringUnitWidth(currentLine) * this.internal.getFontSize();
                      this.text(currentLine, x + w - textSize - padding, y + this.internal.getLineHeight() * (i + 1));
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

      jsPDFAPI.table = function (x, y, data, headers, config) {
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
          autoSize = false,
              printHeaders = true,
              fontSize = 12,
              margins = NO_MARGINS;

          margins.width = this.internal.pageSize.width;

          if (config) {
              //override config defaults if the user has specified non-default behavior:
              if (config.autoSize === true) {
                  autoSize = true;
              }
              if (config.printHeaders === false) {
                  printHeaders = false;
              }
              if (config.fontSize) {
                  fontSize = config.fontSize;
              }
              if (config.css && typeof config.css['font-size'] !== "undefined") {
                  fontSize = config.css['font-size'] * 16;
              }
              if (config.margins) {
                  margins = config.margins;
              }
          }

          /**
           * @property {Number} lnMod
           * Keep track of the current line number modifier used when creating cells
           */
          this.lnMod = 0;
          lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined }, pages = 1;

          this.printHeaders = printHeaders;
          this.margins = margins;
          this.setFontSize(fontSize);
          this.table_font_size = fontSize;

          // Set header values
          if (headers === undefined || headers === null) {
              // No headers defined so we derive from data
              headerNames = Object.keys(data[0]);
          } else if (headers[0] && typeof headers[0] !== 'string') {
              var px2pt = 0.264583 * 72 / 25.4;

              // Split header configs into names and prompts
              for (i = 0, ln = headers.length; i < ln; i += 1) {
                  header = headers[i];
                  headerNames.push(header.name);
                  headerPrompts.push(header.prompt);
                  columnWidths[header.name] = header.width * px2pt;
              }
          } else {
              headerNames = headers;
          }

          if (autoSize) {
              // Create a matrix of columns e.g., {column_title: [row1_Record, row2_Record]}
              func = function func(rec) {
                  return rec[header];
              };

              for (i = 0, ln = headerNames.length; i < ln; i += 1) {
                  header = headerNames[i];

                  columnMatrix[header] = data.map(func);

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

                  //have to reset
                  columnMinWidths = [];
              }
          }

          // -- Construct the table

          if (printHeaders) {
              var lineHeight = this.calculateLineHeight(headerNames, columnWidths, headerPrompts.length ? headerPrompts : headerNames);

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
          var header,
              lineHeight = 0;
          for (var j = 0; j < headerNames.length; j++) {
              header = headerNames[j];
              model[header] = this.splitTextToSize(String(model[header]), columnWidths[header] - padding);
              var h = this.internal.getLineHeight() * model[header].length + padding;
              if (h > lineHeight) lineHeight = h;
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

          var tableHeaderCell, tmpArray, i, ln;

          this.printingHeaderRow = true;
          if (headerFunction !== undefined) {
              var position = headerFunction(this, pages);
              setLastCellPosition(position[0], position[1], position[2], position[3], -1);
          }
          this.setFontStyle('bold');
          var tempHeaderConf = [];
          for (i = 0, ln = this.tableHeaderRow.length; i < ln; i += 1) {
              this.setFillColor(200, 200, 200);

              tableHeaderCell = this.tableHeaderRow[i];
              if (new_page) {
                  this.margins.top = margin;
                  tableHeaderCell[1] = this.margins && this.margins.top || 0;
                  tempHeaderConf.push(tableHeaderCell);
              }
              tmpArray = [].concat(tableHeaderCell);
              this.cell.apply(this, tmpArray.concat(lineNumber));
          }
          if (tempHeaderConf.length > 0) {
              this.setTableHeaderRow(tempHeaderConf);
          }
          this.setFontStyle('normal');
          this.printingHeaderRow = false;
      };
  })(jsPDF.API);

  /**
   * jsPDF Context2D PlugIn Copyright (c) 2014 Steven Spungin (TwelveTone LLC) steven@twelvetone.tv
   *
   * Licensed under the MIT License. http://opensource.org/licenses/mit-license
   */

  /**
   * This plugin mimics the HTML5 Canvas's context2d.
   *
   * The goal is to provide a way for current canvas implementations to print directly to a PDF.
   */

  /**
   * TODO implement stroke opacity (refactor from fill() method )
   * TODO transform angle and radii parameters
   */

  /**
   * require('jspdf.js'); require('lib/css_colors.js');
   */

  (function (jsPDFAPI) {
      'use strict';

      jsPDFAPI.events.push(['initialized', function () {
          this.context2d.pdf = this;
          this.context2d.internal.pdf = this;
          this.context2d.ctx = new context();
          this.context2d.ctxStack = [];
          this.context2d.path = [];
      }]);

      jsPDFAPI.context2d = {
          pageWrapXEnabled: false,
          pageWrapYEnabled: false,
          pageWrapX: 9999999,
          pageWrapY: 9999999,
          ctx: new context(),
          f2: function f2(number) {
              return number.toFixed(2);
          },

          fillRect: function fillRect(x, y, w, h) {
              if (this._isFillTransparent()) {
                  return;
              }
              x = this._wrapX(x);
              y = this._wrapY(y);

              var xRect = this._matrix_map_rect(this.ctx._transform, { x: x, y: y, w: w, h: h });
              this.pdf.rect(xRect.x, xRect.y, xRect.w, xRect.h, "f");
          },

          strokeRect: function strokeRect(x, y, w, h) {
              if (this._isStrokeTransparent()) {
                  return;
              }
              x = this._wrapX(x);
              y = this._wrapY(y);

              var xRect = this._matrix_map_rect(this.ctx._transform, { x: x, y: y, w: w, h: h });
              this.pdf.rect(xRect.x, xRect.y, xRect.w, xRect.h, "s");
          },

          /**
           * We cannot clear PDF commands that were already written to PDF, so we use white instead. <br />
           * As a special case, read a special flag (ignoreClearRect) and do nothing if it is set.
           * This results in all calls to clearRect() to do nothing, and keep the canvas transparent.
           * This flag is stored in the save/restore context and is managed the same way as other drawing states.
           * @param x
           * @param y
           * @param w
           * @param h
           */
          clearRect: function clearRect(x, y, w, h) {
              if (this.ctx.ignoreClearRect) {
                  return;
              }

              x = this._wrapX(x);
              y = this._wrapY(y);

              var xRect = this._matrix_map_rect(this.ctx._transform, { x: x, y: y, w: w, h: h });
              this.save();
              this.setFillStyle('#ffffff');
              //TODO This is hack to fill with white.
              this.pdf.rect(xRect.x, xRect.y, xRect.w, xRect.h, "f");
              this.restore();
          },

          save: function save() {
              this.ctx._fontSize = this.pdf.internal.getFontSize();
              var ctx = new context();
              ctx.copy(this.ctx);
              this.ctxStack.push(this.ctx);
              this.ctx = ctx;
          },

          restore: function restore() {
              this.ctx = this.ctxStack.pop();
              this.setFillStyle(this.ctx.fillStyle);
              this.setStrokeStyle(this.ctx.strokeStyle);
              this.setFont(this.ctx.font);
              this.pdf.setFontSize(this.ctx._fontSize);
              this.setLineCap(this.ctx.lineCap);
              this.setLineWidth(this.ctx.lineWidth);
              this.setLineJoin(this.ctx.lineJoin);
          },

          rect: function rect(x, y, w, h) {
              this.moveTo(x, y);
              this.lineTo(x + w, y);
              this.lineTo(x + w, y + h);
              this.lineTo(x, y + h);
              this.lineTo(x, y); //TODO not needed
              this.closePath();
          },

          beginPath: function beginPath() {
              this.path = [];
          },

          closePath: function closePath() {
              this.path.push({
                  type: 'close'
              });
          },

          _getRgba: function _getRgba(style) {
              // get the decimal values of r, g, and b;
              var rgba = {};

              if (this.internal.rxTransparent.test(style)) {
                  rgba.r = 0;
                  rgba.g = 0;
                  rgba.b = 0;
                  rgba.a = 0;
              } else {
                  var m = this.internal.rxRgb.exec(style);
                  if (m != null) {
                      rgba.r = parseInt(m[1]);
                      rgba.g = parseInt(m[2]);
                      rgba.b = parseInt(m[3]);
                      rgba.a = 1;
                  } else {
                      m = this.internal.rxRgba.exec(style);
                      if (m != null) {
                          rgba.r = parseInt(m[1]);
                          rgba.g = parseInt(m[2]);
                          rgba.b = parseInt(m[3]);
                          rgba.a = parseFloat(m[4]);
                      } else {
                          rgba.a = 1;
                          if (style.charAt(0) != '#') {
                              style = CssColors.colorNameToHex(style);
                              if (!style) {
                                  style = '#000000';
                              }
                          } else {}

                          if (style.length === 4) {
                              rgba.r = style.substring(1, 2);
                              rgba.r += r;
                              rgba.g = style.substring(2, 3);
                              rgba.g += g;
                              rgba.b = style.substring(3, 4);
                              rgba.b += b;
                          } else {
                              rgba.r = style.substring(1, 3);
                              rgba.g = style.substring(3, 5);
                              rgba.b = style.substring(5, 7);
                          }
                          rgba.r = parseInt(rgba.r, 16);
                          rgba.g = parseInt(rgba.g, 16);
                          rgba.b = parseInt(rgba.b, 16);
                      }
                  }
              }
              rgba.style = style;
              return rgba;
          },

          setFillStyle: function setFillStyle(style) {
              // get the decimal values of r, g, and b;
              var r, g, b, a;

              if (this.internal.rxTransparent.test(style)) {
                  r = 0;
                  g = 0;
                  b = 0;
                  a = 0;
              } else {
                  var m = this.internal.rxRgb.exec(style);
                  if (m != null) {
                      r = parseInt(m[1]);
                      g = parseInt(m[2]);
                      b = parseInt(m[3]);
                      a = 1;
                  } else {
                      m = this.internal.rxRgba.exec(style);
                      if (m != null) {
                          r = parseInt(m[1]);
                          g = parseInt(m[2]);
                          b = parseInt(m[3]);
                          a = parseFloat(m[4]);
                      } else {
                          a = 1;
                          if (style.charAt(0) != '#') {
                              style = CssColors.colorNameToHex(style);
                              if (!style) {
                                  style = '#000000';
                              }
                          } else {}

                          if (style.length === 4) {
                              r = style.substring(1, 2);
                              r += r;
                              g = style.substring(2, 3);
                              g += g;
                              b = style.substring(3, 4);
                              b += b;
                          } else {
                              r = style.substring(1, 3);
                              g = style.substring(3, 5);
                              b = style.substring(5, 7);
                          }
                          r = parseInt(r, 16);
                          g = parseInt(g, 16);
                          b = parseInt(b, 16);
                      }
                  }
              }

              this.ctx.fillStyle = style;
              this.ctx._isFillTransparent = a == 0;
              this.ctx._fillOpacity = a;

              this.pdf.setFillColor(r, g, b, {
                  a: a
              });
              this.pdf.setTextColor(r, g, b, {
                  a: a
              });
          },

          setStrokeStyle: function setStrokeStyle(style) {
              var rgba = this._getRgba(style);

              this.ctx.strokeStyle = rgba.style;
              this.ctx._isStrokeTransparent = rgba.a == 0;
              this.ctx._strokeOpacity = rgba.a;

              //TODO jsPDF to handle rgba
              if (rgba.a === 0) {
                  this.pdf.setDrawColor(255, 255, 255);
              } else if (rgba.a === 1) {
                  this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
              } else {
                  //this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b, {a: rgba.a});
                  this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
              }
          },

          fillText: function fillText(text, x, y, maxWidth) {
              if (this._isFillTransparent()) {
                  return;
              }
              x = this._wrapX(x);
              y = this._wrapY(y);

              var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
              x = xpt[0];
              y = xpt[1];
              var rads = this._matrix_rotation(this.ctx._transform);
              var degs = rads * 57.2958;

              //TODO only push the clip if it has not been applied to the current PDF context
              if (this.ctx._clip_path.length > 0) {
                  var lines;
                  if (window.outIntercept) {
                      lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
                  } else {
                      lines = this.pdf.internal.pages[1];
                  }
                  lines.push("q");
                  var origPath = this.path;
                  this.path = this.ctx._clip_path;
                  this.ctx._clip_path = [];
                  this._fill(null, true);
                  this.ctx._clip_path = this.path;
                  this.path = origPath;
              }

              this.pdf.text(text, x, this._getBaseline(y), null, degs);

              if (this.ctx._clip_path.length > 0) {
                  lines.push('Q');
              }
          },

          strokeText: function strokeText(text, x, y, maxWidth) {
              if (this._isStrokeTransparent()) {
                  return;
              }
              x = this._wrapX(x);
              y = this._wrapY(y);

              var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
              x = xpt[0];
              y = xpt[1];
              var rads = this._matrix_rotation(this.ctx._transform);
              var degs = rads * 57.2958;

              //TODO only push the clip if it has not been applied to the current PDF context
              if (this.ctx._clip_path.length > 0) {
                  var lines;
                  if (window.outIntercept) {
                      lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
                  } else {
                      lines = this.pdf.internal.pages[1];
                  }
                  lines.push("q");
                  var origPath = this.path;
                  this.path = this.ctx._clip_path;
                  this.ctx._clip_path = [];
                  this._fill(null, true);
                  this.ctx._clip_path = this.path;
                  this.path = origPath;
              }

              this.pdf.text(text, x, this._getBaseline(y), {
                  stroke: true
              }, degs);

              if (this.ctx._clip_path.length > 0) {
                  lines.push('Q');
              }
          },

          setFont: function setFont(font) {
              this.ctx.font = font;

              //var rx = /\s*(\w+)\s+(\w+)\s+(\w+)\s+([\d\.]+)(px|pt|em)\s+["']?(\w+)['"]?/;
              var rx = /\s*(\w+)\s+(\w+)\s+(\w+)\s+([\d\.]+)(px|pt|em)\s+(.*)?/;
              m = rx.exec(font);
              if (m != null) {
                  var fontStyle = m[1];
                  var fontVariant = m[2];
                  var fontWeight = m[3];
                  var fontSize = m[4];
                  var fontSizeUnit = m[5];
                  var fontFamily = m[6];

                  if ('px' === fontSizeUnit) {
                      fontSize = Math.floor(parseFloat(fontSize));
                      // fontSize = fontSize * 1.25;
                  } else if ('em' === fontSizeUnit) {
                      fontSize = Math.floor(parseFloat(fontSize) * this.pdf.getFontSize());
                  } else {
                      fontSize = Math.floor(parseFloat(fontSize));
                  }

                  this.pdf.setFontSize(fontSize);

                  if (fontWeight === 'bold' || fontWeight === '700') {
                      this.pdf.setFontStyle('bold');
                  } else {
                      if (fontStyle === 'italic') {
                          this.pdf.setFontStyle('italic');
                      } else {
                          this.pdf.setFontStyle('normal');
                      }
                  }

                  var name = fontFamily;
                  var parts = name.toLowerCase().split(/\s*,\s*/);
                  var jsPdfFontName;

                  if (parts.indexOf('arial') != -1) {
                      jsPdfFontName = 'Arial';
                  } else if (parts.indexOf('verdana') != -1) {
                      jsPdfFontName = 'Verdana';
                  } else if (parts.indexOf('helvetica') != -1) {
                      jsPdfFontName = 'Helvetica';
                  } else if (parts.indexOf('sans-serif') != -1) {
                      jsPdfFontName = 'sans-serif';
                  } else if (parts.indexOf('fixed') != -1) {
                      jsPdfFontName = 'Fixed';
                  } else if (parts.indexOf('monospace') != -1) {
                      jsPdfFontName = 'Monospace';
                  } else if (parts.indexOf('terminal') != -1) {
                      jsPdfFontName = 'Terminal';
                  } else if (parts.indexOf('courier') != -1) {
                      jsPdfFontName = 'Courier';
                  } else if (parts.indexOf('times') != -1) {
                      jsPdfFontName = 'Times';
                  } else if (parts.indexOf('cursive') != -1) {
                      jsPdfFontName = 'Cursive';
                  } else if (parts.indexOf('fantasy') != -1) {
                      jsPdfFontName = 'Fantasy';
                  } else if (parts.indexOf('serif') != -1) {
                      jsPdfFontName = 'Serif';
                  } else {
                      jsPdfFontName = 'Serif';
                  }

                  //TODO check more cases
                  var style;
                  if ('bold' === fontWeight) {
                      style = 'bold';
                  } else {
                      style = 'normal';
                  }

                  this.pdf.setFont(jsPdfFontName, style);
              } else {
                  var rx = /(\d+)(pt|px|em)\s+(\w+)\s*(\w+)?/;
                  var m = rx.exec(font);
                  if (m != null) {
                      var size = m[1];
                      var unit = m[2];
                      var name = m[3];
                      var style = m[4];
                      if (!style) {
                          style = 'normal';
                      }
                      if ('em' === fontSizeUnit) {
                          size = Math.floor(parseFloat(fontSize) * this.pdf.getFontSize());
                      } else {
                          size = Math.floor(parseFloat(size));
                      }
                      this.pdf.setFontSize(size);
                      this.pdf.setFont(name, style);
                  }
              }
          },

          setTextBaseline: function setTextBaseline(baseline) {
              this.ctx.textBaseline = baseline;
          },

          getTextBaseline: function getTextBaseline() {
              return this.ctx.textBaseline;
          },

          //TODO implement textAlign
          setTextAlign: function setTextAlign(align) {
              this.ctx.textAlign = align;
          },

          getTextAlign: function getTextAlign() {
              return this.ctx.textAlign;
          },

          setLineWidth: function setLineWidth(width) {
              this.ctx.lineWidth = width;
              this.pdf.setLineWidth(width);
          },

          setLineCap: function setLineCap(style) {
              this.ctx.lineCap = style;
              this.pdf.setLineCap(style);
          },

          setLineJoin: function setLineJoin(style) {
              this.ctx.lineJoin = style;
              this.pdf.setLineJoin(style);
          },

          moveTo: function moveTo(x, y) {
              x = this._wrapX(x);
              y = this._wrapY(y);

              var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
              x = xpt[0];
              y = xpt[1];

              var obj = {
                  type: 'mt',
                  x: x,
                  y: y
              };
              this.path.push(obj);
          },

          _wrapX: function _wrapX(x) {
              if (this.pageWrapXEnabled) {
                  return x % this.pageWrapX;
              } else {
                  return x;
              }
          },

          _wrapY: function _wrapY(y) {
              if (this.pageWrapYEnabled) {
                  this._gotoPage(this._page(y));
                  return (y - this.lastBreak) % this.pageWrapY;
              } else {
                  return y;
              }
          },

          transform: function transform(a, b, c, d, e, f) {
              //TODO apply to current transformation instead of replacing
              this.ctx._transform = [a, b, c, d, e, f];
          },

          setTransform: function setTransform(a, b, c, d, e, f) {
              this.ctx._transform = [a, b, c, d, e, f];
          },

          _getTransform: function _getTransform() {
              return this.ctx._transform;
          },

          lastBreak: 0,
          // Y Position of page breaks.
          pageBreaks: [],
          // returns: One-based Page Number
          // Should only be used if pageWrapYEnabled is true
          _page: function _page(y) {
              if (this.pageWrapYEnabled) {
                  this.lastBreak = 0;
                  var manualBreaks = 0;
                  var autoBreaks = 0;
                  for (var i = 0; i < this.pageBreaks.length; i++) {
                      if (y >= this.pageBreaks[i]) {
                          manualBreaks++;
                          if (this.lastBreak === 0) {
                              autoBreaks++;
                          }
                          var spaceBetweenLastBreak = this.pageBreaks[i] - this.lastBreak;
                          this.lastBreak = this.pageBreaks[i];
                          var pagesSinceLastBreak = Math.floor(spaceBetweenLastBreak / this.pageWrapY);
                          autoBreaks += pagesSinceLastBreak;
                      }
                  }
                  if (this.lastBreak === 0) {
                      var pagesSinceLastBreak = Math.floor(y / this.pageWrapY) + 1;
                      autoBreaks += pagesSinceLastBreak;
                  }
                  return autoBreaks + manualBreaks;
              } else {
                  return this.pdf.internal.getCurrentPageInfo().pageNumber;
              }
          },

          _gotoPage: function _gotoPage(pageOneBased) {
              // This is a stub to be overriden if needed
          },

          lineTo: function lineTo(x, y) {
              x = this._wrapX(x);
              y = this._wrapY(y);

              var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
              x = xpt[0];
              y = xpt[1];

              var obj = {
                  type: 'lt',
                  x: x,
                  y: y
              };
              this.path.push(obj);
          },

          bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x, y) {
              x1 = this._wrapX(x1);
              y1 = this._wrapY(y1);
              x2 = this._wrapX(x2);
              y2 = this._wrapY(y2);
              x = this._wrapX(x);
              y = this._wrapY(y);

              var xpt;
              xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
              x = xpt[0];
              y = xpt[1];
              xpt = this._matrix_map_point(this.ctx._transform, [x1, y1]);
              x1 = xpt[0];
              y1 = xpt[1];
              xpt = this._matrix_map_point(this.ctx._transform, [x2, y2]);
              x2 = xpt[0];
              y2 = xpt[1];

              var obj = {
                  type: 'bct',
                  x1: x1,
                  y1: y1,
                  x2: x2,
                  y2: y2,
                  x: x,
                  y: y
              };
              this.path.push(obj);
          },

          quadraticCurveTo: function quadraticCurveTo(x1, y1, x, y) {
              x1 = this._wrapX(x1);
              y1 = this._wrapY(y1);
              x = this._wrapX(x);
              y = this._wrapY(y);

              var xpt;
              xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
              x = xpt[0];
              y = xpt[1];
              xpt = this._matrix_map_point(this.ctx._transform, [x1, y1]);
              x1 = xpt[0];
              y1 = xpt[1];

              var obj = {
                  type: 'qct',
                  x1: x1,
                  y1: y1,
                  x: x,
                  y: y
              };
              this.path.push(obj);
          },

          arc: function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
              x = this._wrapX(x);
              y = this._wrapY(y);

              var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
              x = xpt[0];
              y = xpt[1];

              var obj = {
                  type: 'arc',
                  x: x,
                  y: y,
                  radius: radius,
                  startAngle: startAngle,
                  endAngle: endAngle,
                  anticlockwise: anticlockwise
              };
              this.path.push(obj);
          },

          drawImage: function drawImage(img, x, y, w, h, x2, y2, w2, h2) {
              if (x2 !== undefined) {
                  x = x2;
                  y = y2;
                  w = w2;
                  h = h2;
              }
              x = this._wrapX(x);
              y = this._wrapY(y);

              var xRect = this._matrix_map_rect(this.ctx._transform, { x: x, y: y, w: w, h: h });
              var xRect2 = this._matrix_map_rect(this.ctx._transform, { x: x2, y: y2, w: w2, h: h2 });

              // TODO implement source clipping and image scaling
              var format;
              var rx = /data:image\/(\w+).*/i;
              var m = rx.exec(img);
              if (m != null) {
                  format = m[1];
              } else {
                  // format = "jpeg";
                  format = "png";
              }

              this.pdf.addImage(img, format, xRect.x, xRect.y, xRect.w, xRect.h);
          },

          /**
           * Multiply the first matrix by the second
           * @param m1
           * @param m2
           * @returns {*[]}
           * @private
           */
          _matrix_multiply: function _matrix_multiply(m2, m1) {
              var sx = m1[0];
              var shy = m1[1];
              var shx = m1[2];
              var sy = m1[3];
              var tx = m1[4];
              var ty = m1[5];

              var t0 = sx * m2[0] + shy * m2[2];
              var t2 = shx * m2[0] + sy * m2[2];
              var t4 = tx * m2[0] + ty * m2[2] + m2[4];
              shy = sx * m2[1] + shy * m2[3];
              sy = shx * m2[1] + sy * m2[3];
              ty = tx * m2[1] + ty * m2[3] + m2[5];
              sx = t0;
              shx = t2;
              tx = t4;

              return [sx, shy, shx, sy, tx, ty];
          },

          _matrix_rotation: function _matrix_rotation(m) {
              return Math.atan2(m[2], m[0]);
          },

          _matrix_decompose: function _matrix_decompose(matrix) {

              var a = matrix[0];
              var b = matrix[1];
              var c = matrix[2];
              var d = matrix[3];

              var scaleX = Math.sqrt(a * a + b * b);
              a /= scaleX;
              b /= scaleX;

              var shear = a * c + b * d;
              c -= a * shear;
              d -= b * shear;

              var scaleY = Math.sqrt(c * c + d * d);
              c /= scaleY;
              d /= scaleY;
              shear /= scaleY;

              if (a * d < b * c) {
                  a = -a;
                  b = -b;
                  shear = -shear;
                  scaleX = -scaleX;
              }

              return {
                  scale: [scaleX, 0, 0, scaleY, 0, 0],
                  translate: [1, 0, 0, 1, matrix[4], matrix[5]],
                  rotate: [a, b, -b, a, 0, 0],
                  skew: [1, 0, shear, 1, 0, 0]
              };
          },

          _matrix_map_point: function _matrix_map_point(m1, pt) {
              var sx = m1[0];
              var shy = m1[1];
              var shx = m1[2];
              var sy = m1[3];
              var tx = m1[4];
              var ty = m1[5];

              var px = pt[0];
              var py = pt[1];

              var x = px * sx + py * shx + tx;
              var y = px * shy + py * sy + ty;
              return [x, y];
          },

          _matrix_map_point_obj: function _matrix_map_point_obj(m1, pt) {
              var xpt = this._matrix_map_point(m1, [pt.x, pt.y]);
              return { x: xpt[0], y: xpt[1] };
          },

          _matrix_map_rect: function _matrix_map_rect(m1, rect) {
              var p1 = this._matrix_map_point(m1, [rect.x, rect.y]);
              var p2 = this._matrix_map_point(m1, [rect.x + rect.w, rect.y + rect.h]);
              return { x: p1[0], y: p1[1], w: p2[0] - p1[0], h: p2[1] - p1[1] };
          },

          _matrix_is_identity: function _matrix_is_identity(m1) {
              if (m1[0] != 1) {
                  return false;
              }
              if (m1[1] != 0) {
                  return false;
              }
              if (m1[2] != 0) {
                  return false;
              }
              if (m1[3] != 1) {
                  return false;
              }
              if (m1[4] != 0) {
                  return false;
              }
              if (m1[5] != 0) {
                  return false;
              }
              return true;
          },

          rotate: function rotate(angle) {
              var matrix = [Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0.0, 0.0];
              this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
          },

          scale: function scale(sx, sy) {
              var matrix = [sx, 0.0, 0.0, sy, 0.0, 0.0];
              this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
          },

          translate: function translate(x, y) {
              var matrix = [1.0, 0.0, 0.0, 1.0, x, y];
              this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
          },

          stroke: function stroke() {
              if (this.ctx._clip_path.length > 0) {

                  var lines;
                  if (window.outIntercept) {
                      lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
                  } else {
                      lines = this.pdf.internal.pages[1];
                  }
                  lines.push("q");

                  var origPath = this.path;
                  this.path = this.ctx._clip_path;
                  this.ctx._clip_path = [];
                  this._stroke(true);

                  this.ctx._clip_path = this.path;
                  this.path = origPath;
                  this._stroke(false);

                  lines.push("Q");
              } else {
                  this._stroke(false);
              }
          },

          _stroke: function _stroke(isClip) {
              if (!isClip && this._isStrokeTransparent()) {
                  return;
              }

              //TODO opacity

              var moves = [];
              var closed = false;

              var xPath = this.path;

              for (var i = 0; i < xPath.length; i++) {
                  var pt = xPath[i];
                  switch (pt.type) {
                      case 'mt':
                          moves.push({ start: pt, deltas: [], abs: [] });
                          break;
                      case 'lt':
                          var delta = [pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
                          moves[moves.length - 1].deltas.push(delta);
                          moves[moves.length - 1].abs.push(pt);
                          break;
                      case 'bct':
                          var delta = [pt.x1 - xPath[i - 1].x, pt.y1 - xPath[i - 1].y, pt.x2 - xPath[i - 1].x, pt.y2 - xPath[i - 1].y, pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
                          moves[moves.length - 1].deltas.push(delta);
                          break;
                      case 'qct':
                          // convert to bezier
                          var x1 = xPath[i - 1].x + 2.0 / 3.0 * (pt.x1 - xPath[i - 1].x);
                          var y1 = xPath[i - 1].y + 2.0 / 3.0 * (pt.y1 - xPath[i - 1].y);
                          var x2 = pt.x + 2.0 / 3.0 * (pt.x1 - pt.x);
                          var y2 = pt.y + 2.0 / 3.0 * (pt.y1 - pt.y);
                          var x3 = pt.x;
                          var y3 = pt.y;
                          var delta = [x1 - xPath[i - 1].x, y1 - xPath[i - 1].y, x2 - xPath[i - 1].x, y2 - xPath[i - 1].y, x3 - xPath[i - 1].x, y3 - xPath[i - 1].y];
                          moves[moves.length - 1].deltas.push(delta);
                          break;
                      case 'arc':
                          moves[moves.length - 1].arc = true;
                          moves[moves.length - 1].abs.push(pt);
                          break;
                      case 'close':
                          closed = true;
                          break;
                  }
              }

              for (var i = 0; i < moves.length; i++) {
                  var style;
                  if (i == moves.length - 1) {
                      style = 's';
                  } else {
                      style = null;
                  }
                  if (moves[i].arc) {
                      var arcs = moves[i].abs;
                      for (var ii = 0; ii < arcs.length; ii++) {
                          var arc = arcs[ii];
                          var start = arc.startAngle * 360 / (2 * Math.PI);
                          var end = arc.endAngle * 360 / (2 * Math.PI);
                          var x = arc.x;
                          var y = arc.y;
                          this.internal.arc2(this, x, y, arc.radius, start, end, arc.anticlockwise, style, isClip);
                      }
                  } else {
                      var x = moves[i].start.x;
                      var y = moves[i].start.y;
                      if (!isClip) {
                          this.pdf.lines(moves[i].deltas, x, y, null, style);
                      } else {
                          this.pdf.lines(moves[i].deltas, x, y, null, null);
                          this.pdf.clip_fixed();
                      }
                  }
              }
          },

          _isFillTransparent: function _isFillTransparent() {
              return this.ctx._isFillTransparent || this.globalAlpha == 0;
          },

          _isStrokeTransparent: function _isStrokeTransparent() {
              return this.ctx._isStrokeTransparent || this.globalAlpha == 0;
          },

          fill: function fill(fillRule) {
              //evenodd or nonzero (default)
              if (this.ctx._clip_path.length > 0) {

                  var lines;
                  if (window.outIntercept) {
                      lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
                  } else {
                      lines = this.pdf.internal.pages[1];
                  }
                  lines.push("q");

                  var origPath = this.path;
                  this.path = this.ctx._clip_path;
                  this.ctx._clip_path = [];
                  this._fill(fillRule, true);

                  this.ctx._clip_path = this.path;
                  this.path = origPath;
                  this._fill(fillRule, false);

                  lines.push('Q');
              } else {
                  this._fill(fillRule, false);
              }
          },

          _fill: function _fill(fillRule, isClip) {
              if (this._isFillTransparent()) {
                  return;
              }
              var v2Support = typeof this.pdf.internal.newObject2 === 'function';

              var lines;
              if (window.outIntercept) {
                  lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
              } else {
                  lines = this.pdf.internal.pages[1];
              }

              // if (this.ctx._clip_path.length > 0) {
              //     lines.push('q');
              //     var oldPath = this.path;
              //     this.path = this.ctx._clip_path;
              //     this.ctx._clip_path = [];
              //     this._fill(fillRule, true);
              //     this.ctx._clip_path = this.path;
              //     this.path = oldPath;
              // }

              var moves = [];
              var outInterceptOld = window.outIntercept;

              if (v2Support) {
                  // Blend and Mask
                  switch (this.ctx.globalCompositeOperation) {
                      case 'normal':
                      case 'source-over':
                          break;
                      case 'destination-in':
                      case 'destination-out':
                          //TODO this need to be added to the current group or page
                          // define a mask stream
                          var obj = this.pdf.internal.newStreamObject();

                          // define a mask state
                          var obj2 = this.pdf.internal.newObject2();
                          obj2.push('<</Type /ExtGState');
                          obj2.push('/SMask <</S /Alpha /G ' + obj.objId + ' 0 R>>'); // /S /Luminosity will need to define color space
                          obj2.push('>>');

                          // add mask to page resources
                          var gsName = 'MASK' + obj2.objId;
                          this.pdf.internal.addGraphicsState(gsName, obj2.objId);

                          var instruction = '/' + gsName + ' gs';
                          // add mask to page, group, or stream
                          lines.splice(0, 0, 'q');
                          lines.splice(1, 0, instruction);
                          lines.push('Q');

                          window.outIntercept = obj;
                          break;
                      default:
                          var dictionaryEntry = '/' + this.pdf.internal.blendModeMap[this.ctx.globalCompositeOperation.toUpperCase()];
                          if (dictionaryEntry) {
                              this.pdf.internal.out(dictionaryEntry + ' gs');
                          }
                          break;
                  }
              }

              var alpha = this.ctx.globalAlpha;
              if (this.ctx._fillOpacity < 1) {
                  // TODO combine this with global opacity
                  alpha = this.ctx._fillOpacity;
              }

              //TODO check for an opacity graphics state that was already created
              //TODO do not set opacity if current value is already active
              if (v2Support) {
                  var objOpac = this.pdf.internal.newObject2();
                  objOpac.push('<</Type /ExtGState');
                  //objOpac.push(this.ctx.globalAlpha + " CA"); // Stroke
                  //objOpac.push(this.ctx.globalAlpha + " ca"); // Not Stroke
                  objOpac.push('/CA ' + alpha); // Stroke
                  objOpac.push('/ca ' + alpha); // Not Stroke
                  objOpac.push('>>');
                  var gsName = 'GS_O_' + objOpac.objId;
                  this.pdf.internal.addGraphicsState(gsName, objOpac.objId);
                  this.pdf.internal.out('/' + gsName + ' gs');
              }

              var xPath = this.path;

              for (var i = 0; i < xPath.length; i++) {
                  var pt = xPath[i];
                  switch (pt.type) {
                      case 'mt':
                          moves.push({ start: pt, deltas: [], abs: [] });
                          break;
                      case 'lt':
                          var delta = [pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
                          moves[moves.length - 1].deltas.push(delta);
                          moves[moves.length - 1].abs.push(pt);
                          break;
                      case 'bct':
                          var delta = [pt.x1 - xPath[i - 1].x, pt.y1 - xPath[i - 1].y, pt.x2 - xPath[i - 1].x, pt.y2 - xPath[i - 1].y, pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
                          moves[moves.length - 1].deltas.push(delta);
                          break;
                      case 'qct':
                          // convert to bezier
                          var x1 = xPath[i - 1].x + 2.0 / 3.0 * (pt.x1 - xPath[i - 1].x);
                          var y1 = xPath[i - 1].y + 2.0 / 3.0 * (pt.y1 - xPath[i - 1].y);
                          var x2 = pt.x + 2.0 / 3.0 * (pt.x1 - pt.x);
                          var y2 = pt.y + 2.0 / 3.0 * (pt.y1 - pt.y);
                          var x3 = pt.x;
                          var y3 = pt.y;
                          var delta = [x1 - xPath[i - 1].x, y1 - xPath[i - 1].y, x2 - xPath[i - 1].x, y2 - xPath[i - 1].y, x3 - xPath[i - 1].x, y3 - xPath[i - 1].y];
                          moves[moves.length - 1].deltas.push(delta);
                          break;
                      case 'arc':
                          //TODO this was hack to avoid out of bounds issue
                          if (moves.length == 0) {
                              moves.push({ start: { x: 0, y: 0 }, deltas: [], abs: [] });
                          }
                          moves[moves.length - 1].arc = true;
                          moves[moves.length - 1].abs.push(pt);
                          break;
                      case 'close':
                          //moves[moves.length - 1].deltas.push('close');
                          break;
                  }
              }

              for (var i = 0; i < moves.length; i++) {
                  var style;
                  if (i == moves.length - 1) {
                      style = 'f';
                      if (fillRule === 'evenodd') {
                          style += '*';
                      }
                  } else {
                      style = null;
                  }

                  if (moves[i].arc) {
                      var arcs = moves[i].abs;
                      for (var ii = 0; ii < arcs.length; ii++) {
                          var arc = arcs[ii];
                          //TODO lines deltas were getting in here
                          if (typeof arc.startAngle !== 'undefined') {
                              var start = arc.startAngle * 360 / (2 * Math.PI);
                              var end = arc.endAngle * 360 / (2 * Math.PI);
                              // Add the current position (last move to)
                              //var x = moves[i].start.x + arc.x;
                              //var y = moves[i].start.y + arc.y;
                              var x = arc.x;
                              var y = arc.y;
                              if (ii == 0) {
                                  this.internal.move2(this, x, y);
                              }
                              this.internal.arc2(this, x, y, arc.radius, start, end, arc.anticlockwise, null, isClip);
                          } else {
                              this.internal.line2(c2d, arc.x, arc.y);
                          }
                      }

                      // extra move bug causing close to resolve to wrong point
                      var x = moves[i].start.x;
                      var y = moves[i].start.y;
                      this.internal.line2(c2d, x, y);

                      this.pdf.internal.out('h');
                      this.pdf.internal.out('f');
                  } else {
                      var x = moves[i].start.x;
                      var y = moves[i].start.y;
                      if (!isClip) {
                          this.pdf.lines(moves[i].deltas, x, y, null, style);
                      } else {
                          this.pdf.lines(moves[i].deltas, x, y, null, null);
                          this.pdf.clip_fixed();
                      }
                  }
              }

              window.outIntercept = outInterceptOld;

              // if (this.ctx._clip_path.length > 0) {
              //     lines.push('Q');
              // }
          },

          pushMask: function pushMask() {
              var v2Support = typeof this.pdf.internal.newObject2 === 'function';

              if (!v2Support) {
                  console.log('jsPDF v2 not enabled');
                  return;
              }

              // define a mask stream
              var obj = this.pdf.internal.newStreamObject();

              // define a mask state
              var obj2 = this.pdf.internal.newObject2();
              obj2.push('<</Type /ExtGState');
              obj2.push('/SMask <</S /Alpha /G ' + obj.objId + ' 0 R>>'); // /S /Luminosity will need to define color space
              obj2.push('>>');

              // add mask to page resources
              var gsName = 'MASK' + obj2.objId;
              this.pdf.internal.addGraphicsState(gsName, obj2.objId);

              var instruction = '/' + gsName + ' gs';
              this.pdf.internal.out(instruction);
          },

          clip: function clip() {
              //TODO do we reset the path, or just copy it?
              if (this.ctx._clip_path.length > 0) {
                  for (var i = 0; i < this.path.length; i++) {
                      this.ctx._clip_path.push(this.path[i]);
                  }
              } else {
                  this.ctx._clip_path = this.path;
              }
              this.path = [];
          },

          measureText: function measureText(text) {
              var pdf = this.pdf;
              return {
                  getWidth: function getWidth() {
                      var fontSize = pdf.internal.getFontSize();
                      var txtWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor;
                      return txtWidth;
                  },

                  get width() {
                      return this.getWidth(text);
                  }
              };
          },
          _getBaseline: function _getBaseline(y) {
              var height = parseInt(this.pdf.internal.getFontSize());
              // TODO Get descent from font descriptor
              var descent = height * .25;
              switch (this.ctx.textBaseline) {
                  case 'bottom':
                      return y - descent;
                  case 'top':
                      return y + height;
                  case 'hanging':
                      return y + height - descent;
                  case 'middle':
                      return y + height / 2 - descent;
                  case 'ideographic':
                      // TODO not implemented
                      return y;
                  case 'alphabetic':
                  default:
                      return y;
              }
          }
      };

      var c2d = jsPDFAPI.context2d;

      // accessor methods
      Object.defineProperty(c2d, 'fillStyle', {
          set: function set(value) {
              this.setFillStyle(value);
          },
          get: function get() {
              return this.ctx.fillStyle;
          }
      });
      Object.defineProperty(c2d, 'strokeStyle', {
          set: function set(value) {
              this.setStrokeStyle(value);
          },
          get: function get() {
              return this.ctx.strokeStyle;
          }
      });
      Object.defineProperty(c2d, 'lineWidth', {
          set: function set(value) {
              this.setLineWidth(value);
          },
          get: function get() {
              return this.ctx.lineWidth;
          }
      });
      Object.defineProperty(c2d, 'lineCap', {
          set: function set(val) {
              this.setLineCap(val);
          },
          get: function get() {
              return this.ctx.lineCap;
          }
      });
      Object.defineProperty(c2d, 'lineJoin', {
          set: function set(val) {
              this.setLineJoin(val);
          },
          get: function get() {
              return this.ctx.lineJoin;
          }
      });
      Object.defineProperty(c2d, 'miterLimit', {
          set: function set(val) {
              this.ctx.miterLimit = val;
          },
          get: function get() {
              return this.ctx.miterLimit;
          }
      });
      Object.defineProperty(c2d, 'textBaseline', {
          set: function set(value) {
              this.setTextBaseline(value);
          },
          get: function get() {
              return this.getTextBaseline();
          }
      });
      Object.defineProperty(c2d, 'textAlign', {
          set: function set(value) {
              this.setTextAlign(value);
          },
          get: function get() {
              return this.getTextAlign();
          }
      });
      Object.defineProperty(c2d, 'font', {
          set: function set(value) {
              this.setFont(value);
          },
          get: function get() {
              return this.ctx.font;
          }
      });
      Object.defineProperty(c2d, 'globalCompositeOperation', {
          set: function set(value) {
              this.ctx.globalCompositeOperation = value;
          },
          get: function get() {
              return this.ctx.globalCompositeOperation;
          }
      });
      Object.defineProperty(c2d, 'globalAlpha', {
          set: function set(value) {
              this.ctx.globalAlpha = value;
          },
          get: function get() {
              return this.ctx.globalAlpha;
          }
      });
      // Not HTML API
      Object.defineProperty(c2d, 'ignoreClearRect', {
          set: function set(value) {
              this.ctx.ignoreClearRect = value;
          },
          get: function get() {
              return this.ctx.ignoreClearRect;
          }
      });
      // End Not HTML API

      c2d.internal = {};

      c2d.internal.rxRgb = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
      c2d.internal.rxRgba = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/;
      c2d.internal.rxTransparent = /transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/;

      // http://hansmuller-flex.blogspot.com/2011/10/more-about-approximating-circular-arcs.html
      c2d.internal.arc = function (c2d, xc, yc, r, a1, a2, anticlockwise, style) {
          var includeMove = true;

          var k = this.pdf.internal.scaleFactor;
          var pageHeight = this.pdf.internal.pageSize.height;
          var f2 = this.pdf.internal.f2;

          var a1r = a1 * (Math.PI / 180);
          var a2r = a2 * (Math.PI / 180);
          var curves = this.createArc(r, a1r, a2r, anticlockwise);
          var pathData = null;

          for (var i = 0; i < curves.length; i++) {
              var curve = curves[i];
              if (includeMove && i == 0) {
                  this.pdf.internal.out([f2((curve.x1 + xc) * k), f2((pageHeight - (curve.y1 + yc)) * k), 'm', f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'].join(' '));
              } else {
                  this.pdf.internal.out([f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'].join(' '));
              }

              //c2d._lastPoint = {x: curve.x1 + xc, y: curve.y1 + yc};
              c2d._lastPoint = { x: xc, y: yc };
              // f2((curve.x1 + xc) * k), f2((pageHeight - (curve.y1 + yc)) * k), 'm', f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'
          }

          if (style !== null) {
              this.pdf.internal.out(this.pdf.internal.getStyle(style));
          }
      };

      /**
       *
       * @param x Edge point X
       * @param y Edge point Y
       * @param r Radius
       * @param a1 start angle
       * @param a2 end angle
       * @param anticlockwise
       * @param style
       * @param isClip
       */
      c2d.internal.arc2 = function (c2d, x, y, r, a1, a2, anticlockwise, style, isClip) {
          // we need to convert from cartesian to polar here methinks.
          var centerX = x; // + r;
          var centerY = y;

          if (false) {}

          if (!isClip) {
              this.arc(c2d, centerX, centerY, r, a1, a2, anticlockwise, style);
          } else {
              this.arc(c2d, centerX, centerY, r, a1, a2, anticlockwise, null);
              this.pdf.clip_fixed();
          }
      };

      c2d.internal.move2 = function (c2d, x, y) {
          var k = this.pdf.internal.scaleFactor;
          var pageHeight = this.pdf.internal.pageSize.height;
          var f2 = this.pdf.internal.f2;

          this.pdf.internal.out([f2(x * k), f2((pageHeight - y) * k), 'm'].join(' '));
          c2d._lastPoint = { x: x, y: y };
      };

      c2d.internal.line2 = function (c2d, dx, dy) {
          var k = this.pdf.internal.scaleFactor;
          var pageHeight = this.pdf.internal.pageSize.height;
          var f2 = this.pdf.internal.f2;

          //var pt = {x: c2d._lastPoint.x + dx, y: c2d._lastPoint.y + dy};
          var pt = { x: dx, y: dy };

          this.pdf.internal.out([f2(pt.x * k), f2((pageHeight - pt.y) * k), 'l'].join(' '));
          //this.pdf.internal.out('f');
          c2d._lastPoint = pt;
      };

      /**
       * Return a array of objects that represent bezier curves which approximate the circular arc centered at the origin, from startAngle to endAngle (radians) with the specified radius.
       *
       * Each bezier curve is an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
       */

      c2d.internal.createArc = function (radius, startAngle, endAngle, anticlockwise) {

          var EPSILON = 0.00001; // Roughly 1/1000th of a degree, see below

          // normalize startAngle, endAngle to [-2PI, 2PI]
          var twoPI = Math.PI * 2;
          var startAngleN = startAngle;
          if (startAngleN < twoPI || startAngleN > twoPI) {
              startAngleN = startAngleN % twoPI;
          }
          var endAngleN = endAngle;
          if (endAngleN < twoPI || endAngleN > twoPI) {
              endAngleN = endAngleN % twoPI;
          }

          // Compute the sequence of arc curves, up to PI/2 at a time.
          // Total arc angle is less than 2PI.
          var curves = [];
          var piOverTwo = Math.PI / 2.0;
          // var sgn = (startAngle < endAngle) ? +1 : -1; // clockwise or counterclockwise
          var sgn = anticlockwise ? -1 : +1;

          var a1 = startAngle;
          for (var totalAngle = Math.min(twoPI, Math.abs(endAngleN - startAngleN)); totalAngle > EPSILON;) {
              var a2 = a1 + sgn * Math.min(totalAngle, piOverTwo);
              curves.push(this.createSmallArc(radius, a1, a2));
              totalAngle -= Math.abs(a2 - a1);
              a1 = a2;
          }

          return curves;
      };

      /**
       * Cubic bezier approximation of a circular arc centered at the origin, from (radians) a1 to a2, where a2-a1 < pi/2. The arc's radius is r.
       *
       * Returns an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
       *
       * This algorithm is based on the approach described in: A. Riškus, "Approximation of a Cubic Bezier Curve by Circular Arcs and Vice Versa," Information Technology and Control, 35(4), 2006 pp. 371-378.
       */

      c2d.internal.createSmallArc = function (r, a1, a2) {
          // Compute all four points for an arc that subtends the same total angle
          // but is centered on the X-axis

          var a = (a2 - a1) / 2.0;

          var x4 = r * Math.cos(a);
          var y4 = r * Math.sin(a);
          var x1 = x4;
          var y1 = -y4;

          var q1 = x1 * x1 + y1 * y1;
          var q2 = q1 + x1 * x4 + y1 * y4;
          var k2 = 4 / 3 * (Math.sqrt(2 * q1 * q2) - q2) / (x1 * y4 - y1 * x4);

          var x2 = x1 - k2 * y1;
          var y2 = y1 + k2 * x1;
          var x3 = x2;
          var y3 = -y2;

          // Find the arc points' actual locations by computing x1,y1 and x4,y4
          // and rotating the control points by a + a1

          var ar = a + a1;
          var cos_ar = Math.cos(ar);
          var sin_ar = Math.sin(ar);

          return {
              x1: r * Math.cos(a1),
              y1: r * Math.sin(a1),
              x2: x2 * cos_ar - y2 * sin_ar,
              y2: x2 * sin_ar + y2 * cos_ar,
              x3: x3 * cos_ar - y3 * sin_ar,
              y3: x3 * sin_ar + y3 * cos_ar,
              x4: r * Math.cos(a2),
              y4: r * Math.sin(a2)
          };
      };

      function context() {
          this._isStrokeTransparent = false;
          this._strokeOpacity = 1;
          this.strokeStyle = '#000000';
          this.fillStyle = '#000000';
          this._isFillTransparent = false;
          this._fillOpacity = 1;
          this.font = "12pt times";
          this.textBaseline = 'alphabetic'; // top,bottom,middle,ideographic,alphabetic,hanging
          this.textAlign = 'start';
          this.lineWidth = 1;
          this.lineJoin = 'miter'; // round, bevel, miter
          this.lineCap = 'butt'; // butt, round, square
          this._transform = [1, 0, 0, 1, 0, 0]; // sx, shy, shx, sy, tx, ty
          this.globalCompositeOperation = 'normal';
          this.globalAlpha = 1.0;
          this._clip_path = [];
          // TODO miter limit //default 10

          // Not HTML API
          this.ignoreClearRect = false;

          this.copy = function (ctx) {
              this._isStrokeTransparent = ctx._isStrokeTransparent;
              this._strokeOpacity = ctx._strokeOpacity;
              this.strokeStyle = ctx.strokeStyle;
              this._isFillTransparent = ctx._isFillTransparent;
              this._fillOpacity = ctx._fillOpacity;
              this.fillStyle = ctx.fillStyle;
              this.font = ctx.font;
              this.lineWidth = ctx.lineWidth;
              this.lineJoin = ctx.lineJoin;
              this.lineCap = ctx.lineCap;
              this.textBaseline = ctx.textBaseline;
              this.textAlign = ctx.textAlign;
              this._fontSize = ctx._fontSize;
              this._transform = ctx._transform.slice(0);
              this.globalCompositeOperation = ctx.globalCompositeOperation;
              this.globalAlpha = ctx.globalAlpha;
              this._clip_path = ctx._clip_path.slice(0); //TODO deep copy?

              // Not HTML API
              this.ignoreClearRect = ctx.ignoreClearRect;
          };
      }

      return this;
  })(jsPDF.API);

  /** @preserve
   * jsPDF fromHTML plugin. BETA stage. API subject to change. Needs browser
   * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
   *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
   *               2014 Diego Casorran, https://github.com/diegocr
   *               2014 Daniel Husar, https://github.com/danielhusar
   *               2014 Wolfgang Gassler, https://github.com/woolfg
   *               2014 Steven Spungin, https://github.com/flamenco
   *
   * 
   * ====================================================================
   */

  (function (jsPDFAPI) {
  	var clone, _DrillForContent, FontNameDB, FontStyleMap, TextAlignMap, FontWeightMap, FloatMap, ClearMap, GetCSS, PurgeWhiteSpace, Renderer, ResolveFont, ResolveUnitedNumber, UnitedNumberMap, elementHandledElsewhere, images, loadImgs, checkForFooter, process, tableToJson;
  	clone = function () {
  		return function (obj) {
  			Clone.prototype = obj;
  			return new Clone();
  		};
  		function Clone() {}
  	}();
  	PurgeWhiteSpace = function PurgeWhiteSpace(array) {
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
  			// Leave the line breaks intact
  			if (array[i] != "\u2028") {
  				fragment = array[i].replace(/\s+/g, " ");
  				if (trailingSpace) {
  					fragment = fragment.trimLeft();
  				}
  				if (fragment) {
  					trailingSpace = r.test(fragment);
  				}
  				array[i] = fragment;
  			}
  			i++;
  		}
  		return array;
  	};
  	Renderer = function Renderer(pdf, x, y, settings) {
  		this.pdf = pdf;
  		this.x = x;
  		this.y = y;
  		this.settings = settings;
  		//list of functions which are called after each element-rendering process
  		this.watchFunctions = [];
  		this.init();
  		return this;
  	};
  	ResolveFont = function ResolveFont(css_font_family_string) {
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
  	ResolveUnitedNumber = function ResolveUnitedNumber(css_line_height_string) {

  		//IE8 issues
  		css_line_height_string = css_line_height_string === "auto" ? "0px" : css_line_height_string;
  		if (css_line_height_string.indexOf("em") > -1 && !isNaN(Number(css_line_height_string.replace("em", "")))) {
  			css_line_height_string = Number(css_line_height_string.replace("em", "")) * 18.719 + "px";
  		}
  		if (css_line_height_string.indexOf("pt") > -1 && !isNaN(Number(css_line_height_string.replace("pt", "")))) {
  			css_line_height_string = Number(css_line_height_string.replace("pt", "")) * 1.333 + "px";
  		}

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
  		}[{ css_line_height_string: css_line_height_string }];

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
  	GetCSS = function GetCSS(element) {
  		var css, tmp, computedCSSElement;
  		computedCSSElement = function (el) {
  			var compCSS;
  			compCSS = function (el) {
  				if (document.defaultView && document.defaultView.getComputedStyle) {
  					return document.defaultView.getComputedStyle(el, null);
  				} else if (el.currentStyle) {
  					return el.currentStyle;
  				} else {
  					return el.style;
  				}
  			}(el);
  			return function (prop) {
  				prop = prop.replace(/-\D/g, function (match) {
  					return match.charAt(1).toUpperCase();
  				});
  				return compCSS[prop];
  			};
  		}(element);
  		css = {};
  		tmp = void 0;
  		css["font-family"] = ResolveFont(computedCSSElement("font-family")) || "times";
  		css["font-style"] = FontStyleMap[computedCSSElement("font-style")] || "normal";
  		css["text-align"] = TextAlignMap[computedCSSElement("text-align")] || "left";
  		tmp = FontWeightMap[computedCSSElement("font-weight")] || "normal";
  		if (tmp === "bold") {
  			if (css["font-style"] === "normal") {
  				css["font-style"] = tmp;
  			} else {
  				css["font-style"] = tmp + css["font-style"];
  			}
  		}
  		css["font-size"] = ResolveUnitedNumber(computedCSSElement("font-size")) || 1;
  		css["line-height"] = ResolveUnitedNumber(computedCSSElement("line-height")) || 1;
  		css["display"] = computedCSSElement("display") === "inline" ? "inline" : "block";

  		tmp = css["display"] === "block";
  		css["margin-top"] = tmp && ResolveUnitedNumber(computedCSSElement("margin-top")) || 0;
  		css["margin-bottom"] = tmp && ResolveUnitedNumber(computedCSSElement("margin-bottom")) || 0;
  		css["padding-top"] = tmp && ResolveUnitedNumber(computedCSSElement("padding-top")) || 0;
  		css["padding-bottom"] = tmp && ResolveUnitedNumber(computedCSSElement("padding-bottom")) || 0;
  		css["margin-left"] = tmp && ResolveUnitedNumber(computedCSSElement("margin-left")) || 0;
  		css["margin-right"] = tmp && ResolveUnitedNumber(computedCSSElement("margin-right")) || 0;
  		css["padding-left"] = tmp && ResolveUnitedNumber(computedCSSElement("padding-left")) || 0;
  		css["padding-right"] = tmp && ResolveUnitedNumber(computedCSSElement("padding-right")) || 0;

  		css["page-break-before"] = computedCSSElement("page-break-before") || "auto";

  		//float and clearing of floats
  		css["float"] = FloatMap[computedCSSElement("cssFloat")] || "none";
  		css["clear"] = ClearMap[computedCSSElement("clear")] || "none";

  		css["color"] = computedCSSElement("color");

  		return css;
  	};
  	elementHandledElsewhere = function elementHandledElsewhere(element, renderer, elementHandlers) {
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
  	tableToJson = function tableToJson(table, renderer) {
  		var data, headers, i, j, rowData, tableRow, table_obj, table_with, cell, l;
  		data = [];
  		headers = [];
  		i = 0;
  		l = table.rows[0].cells.length;
  		table_with = table.clientWidth;
  		while (i < l) {
  			cell = table.rows[0].cells[i];
  			headers[i] = {
  				name: cell.textContent.toLowerCase().replace(/\s+/g, ''),
  				prompt: cell.textContent.replace(/\r?\n/g, ''),
  				width: cell.clientWidth / table_with * renderer.pdf.internal.pageSize.width
  			};
  			i++;
  		}
  		i = 1;
  		while (i < table.rows.length) {
  			tableRow = table.rows[i];
  			rowData = {};
  			j = 0;
  			while (j < tableRow.cells.length) {
  				rowData[headers[j].name] = tableRow.cells[j].textContent.replace(/\r?\n/g, '');
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
  		SCRIPT: 1,
  		STYLE: 1,
  		NOSCRIPT: 1,
  		OBJECT: 1,
  		EMBED: 1,
  		SELECT: 1
  	};
  	var listCount = 1;
  	_DrillForContent = function DrillForContent(element, renderer, elementHandlers) {
  		var cn, cns, fragmentCSS, i, isBlock, l, px2pt, table2json, cb;
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
  			if ((typeof cn === "undefined" ? "undefined" : _typeof(cn)) === "object") {

  				//execute all watcher functions to e.g. reset floating
  				renderer.executeWatchFunctions(cn);

  				/*** HEADER rendering **/
  				if (cn.nodeType === 1 && cn.nodeName === 'HEADER') {
  					var header = cn;
  					//store old top margin
  					var oldMarginTop = renderer.pdf.margins_doc.top;
  					//subscribe for new page event and render header first on every page
  					renderer.pdf.internal.events.subscribe('addPage', function (pageInfo) {
  						//set current y position to old margin
  						renderer.y = oldMarginTop;
  						//render all child nodes of the header element
  						_DrillForContent(header, renderer, elementHandlers);
  						//set margin to old margin + rendered header + 10 space to prevent overlapping
  						//important for other plugins (e.g. table) to start rendering at correct position after header
  						renderer.pdf.margins_doc.top = renderer.y + 10;
  						renderer.y += 10;
  					}, false);
  				}

  				if (cn.nodeType === 8 && cn.nodeName === "#comment") {
  					if (~cn.textContent.indexOf("ADD_PAGE")) {
  						renderer.pdf.addPage();
  						renderer.y = renderer.pdf.margins_doc.top;
  					}
  				} else if (cn.nodeType === 1 && !SkipNode[cn.nodeName]) {
  					/*** IMAGE RENDERING ***/
  					var cached_image;
  					if (cn.nodeName === "IMG") {
  						var url = cn.getAttribute("src");
  						cached_image = images[renderer.pdf.sHashCode(url) || url];
  					}
  					if (cached_image) {
  						if (renderer.pdf.internal.pageSize.height - renderer.pdf.margins_doc.bottom < renderer.y + cn.height && renderer.y > renderer.pdf.margins_doc.top) {
  							renderer.pdf.addPage();
  							renderer.y = renderer.pdf.margins_doc.top;
  							//check if we have to set back some values due to e.g. header rendering for new page
  							renderer.executeWatchFunctions(cn);
  						}

  						var imagesCSS = GetCSS(cn);
  						var imageX = renderer.x;
  						var fontToUnitRatio = 12 / renderer.pdf.internal.scaleFactor;

  						//define additional paddings, margins which have to be taken into account for margin calculations
  						var additionalSpaceLeft = (imagesCSS["margin-left"] + imagesCSS["padding-left"]) * fontToUnitRatio;
  						var additionalSpaceRight = (imagesCSS["margin-right"] + imagesCSS["padding-right"]) * fontToUnitRatio;
  						var additionalSpaceTop = (imagesCSS["margin-top"] + imagesCSS["padding-top"]) * fontToUnitRatio;
  						var additionalSpaceBottom = (imagesCSS["margin-bottom"] + imagesCSS["padding-bottom"]) * fontToUnitRatio;

  						//if float is set to right, move the image to the right border
  						//add space if margin is set
  						if (imagesCSS['float'] !== undefined && imagesCSS['float'] === 'right') {
  							imageX += renderer.settings.width - cn.width - additionalSpaceRight;
  						} else {
  							imageX += additionalSpaceLeft;
  						}

  						renderer.pdf.addImage(cached_image, imageX, renderer.y + additionalSpaceTop, cn.width, cn.height);
  						cached_image = undefined;
  						//if the float prop is specified we have to float the text around the image
  						if (imagesCSS['float'] === 'right' || imagesCSS['float'] === 'left') {
  							//add functiont to set back coordinates after image rendering
  							renderer.watchFunctions.push(function (diffX, thresholdY, diffWidth, el) {
  								//undo drawing box adaptions which were set by floating
  								if (renderer.y >= thresholdY) {
  									renderer.x += diffX;
  									renderer.settings.width += diffWidth;
  									return true;
  								} else if (el && el.nodeType === 1 && !SkipNode[el.nodeName] && renderer.x + el.width > renderer.pdf.margins_doc.left + renderer.pdf.margins_doc.width) {
  									renderer.x += diffX;
  									renderer.y = thresholdY;
  									renderer.settings.width += diffWidth;
  									return true;
  								} else {
  									return false;
  								}
  							}.bind(this, imagesCSS['float'] === 'left' ? -cn.width - additionalSpaceLeft - additionalSpaceRight : 0, renderer.y + cn.height + additionalSpaceTop + additionalSpaceBottom, cn.width));
  							//reset floating by clear:both divs
  							//just set cursorY after the floating element
  							renderer.watchFunctions.push(function (yPositionAfterFloating, pages, el) {
  								if (renderer.y < yPositionAfterFloating && pages === renderer.pdf.internal.getNumberOfPages()) {
  									if (el.nodeType === 1 && GetCSS(el).clear === 'both') {
  										renderer.y = yPositionAfterFloating;
  										return true;
  									} else {
  										return false;
  									}
  								} else {
  									return true;
  								}
  							}.bind(this, renderer.y + cn.height, renderer.pdf.internal.getNumberOfPages()));

  							//if floating is set we decrease the available width by the image width
  							renderer.settings.width -= cn.width + additionalSpaceLeft + additionalSpaceRight;
  							//if left just add the image width to the X coordinate
  							if (imagesCSS['float'] === 'left') {
  								renderer.x += cn.width + additionalSpaceLeft + additionalSpaceRight;
  							}
  						} else {
  							//if no floating is set, move the rendering cursor after the image height
  							renderer.y += cn.height + additionalSpaceTop + additionalSpaceBottom;
  						}

  						/*** TABLE RENDERING ***/
  					} else if (cn.nodeName === "TABLE") {
  						table2json = tableToJson(cn, renderer);
  						renderer.y += 10;
  						renderer.pdf.table(renderer.x, renderer.y, table2json.rows, table2json.headers, {
  							autoSize: false,
  							printHeaders: elementHandlers.printHeaders,
  							margins: renderer.pdf.margins_doc,
  							css: GetCSS(cn)
  						});
  						renderer.y = renderer.pdf.lastCellPos.y + renderer.pdf.lastCellPos.h + 20;
  					} else if (cn.nodeName === "OL" || cn.nodeName === "UL") {
  						listCount = 1;
  						if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
  							_DrillForContent(cn, renderer, elementHandlers);
  						}
  						renderer.y += 10;
  					} else if (cn.nodeName === "LI") {
  						var temp = renderer.x;
  						renderer.x += 20 / renderer.pdf.internal.scaleFactor;
  						renderer.y += 3;
  						if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
  							_DrillForContent(cn, renderer, elementHandlers);
  						}
  						renderer.x = temp;
  					} else if (cn.nodeName === "BR") {
  						renderer.y += fragmentCSS["font-size"] * renderer.pdf.internal.scaleFactor;
  						renderer.addText("\u2028", clone(fragmentCSS));
  					} else {
  						if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
  							_DrillForContent(cn, renderer, elementHandlers);
  						}
  					}
  				} else if (cn.nodeType === 3) {
  					var value = cn.nodeValue;
  					if (cn.nodeValue && cn.parentNode.nodeName === "LI") {
  						if (cn.parentNode.parentNode.nodeName === "OL") {
  							value = listCount++ + '. ' + value;
  						} else {
  							var fontSize = fragmentCSS["font-size"];
  							var offsetX = (3 - fontSize * 0.75) * renderer.pdf.internal.scaleFactor;
  							var offsetY = fontSize * 0.75 * renderer.pdf.internal.scaleFactor;
  							var radius = fontSize * 1.74 / renderer.pdf.internal.scaleFactor;
  							cb = function cb(x, y) {
  								this.pdf.circle(x + offsetX, y + offsetY, radius, 'FD');
  							};
  						}
  					}
  					// Only add the text if the text node is in the body element
  					// Add compatibility with IE11
  					if (!!(cn.ownerDocument.body.compareDocumentPosition(cn) & 16)) {
  						renderer.addText(value, fragmentCSS);
  					}
  				} else if (typeof cn === "string") {
  					renderer.addText(cn, fragmentCSS);
  				}
  			}
  			i++;
  		}
  		elementHandlers.outY = renderer.y;

  		if (isBlock) {
  			return renderer.setBlockBoundary(cb);
  		}
  	};
  	images = {};
  	loadImgs = function loadImgs(element, renderer, elementHandlers, cb) {
  		var imgs = element.getElementsByTagName('img'),
  		    l = imgs.length,
  		    found_images,
  		    x = 0;
  		function done() {
  			renderer.pdf.internal.events.publish('imagesLoaded');
  			cb(found_images);
  		}
  		function loadImage(url, width, height) {
  			if (!url) return;
  			var img = new Image();
  			found_images = ++x;
  			img.crossOrigin = '';
  			img.onerror = img.onload = function () {
  				if (img.complete) {
  					//to support data urls in images, set width and height
  					//as those values are not recognized automatically
  					if (img.src.indexOf('data:image/') === 0) {
  						img.width = width || img.width || 0;
  						img.height = height || img.height || 0;
  					}
  					//if valid image add to known images array
  					if (img.width + img.height) {
  						var hash = renderer.pdf.sHashCode(url) || url;
  						images[hash] = images[hash] || img;
  					}
  				}
  				if (! --x) {
  					done();
  				}
  			};
  			img.src = url;
  		}
  		while (l--) {
  			loadImage(imgs[l].getAttribute("src"), imgs[l].width, imgs[l].height);
  		}return x || done();
  	};
  	checkForFooter = function checkForFooter(elem, renderer, elementHandlers) {
  		//check if we can found a <footer> element
  		var footer = elem.getElementsByTagName("footer");
  		if (footer.length > 0) {

  			footer = footer[0];

  			//bad hack to get height of footer
  			//creat dummy out and check new y after fake rendering
  			var oldOut = renderer.pdf.internal.write;
  			var oldY = renderer.y;
  			renderer.pdf.internal.write = function () {};
  			_DrillForContent(footer, renderer, elementHandlers);
  			var footerHeight = Math.ceil(renderer.y - oldY) + 5;
  			renderer.y = oldY;
  			renderer.pdf.internal.write = oldOut;

  			//add 20% to prevent overlapping
  			renderer.pdf.margins_doc.bottom += footerHeight;

  			//Create function render header on every page
  			var renderFooter = function renderFooter(pageInfo) {
  				var pageNumber = pageInfo !== undefined ? pageInfo.pageNumber : 1;
  				//set current y position to old margin
  				var oldPosition = renderer.y;
  				//render all child nodes of the header element
  				renderer.y = renderer.pdf.internal.pageSize.height - renderer.pdf.margins_doc.bottom;
  				renderer.pdf.margins_doc.bottom -= footerHeight;

  				//check if we have to add page numbers
  				var spans = footer.getElementsByTagName('span');
  				for (var i = 0; i < spans.length; ++i) {
  					//if we find some span element with class pageCounter, set the page
  					if ((" " + spans[i].className + " ").replace(/[\n\t]/g, " ").indexOf(" pageCounter ") > -1) {
  						spans[i].innerHTML = pageNumber;
  					}
  					//if we find some span element with class totalPages, set a variable which is replaced after rendering of all pages
  					if ((" " + spans[i].className + " ").replace(/[\n\t]/g, " ").indexOf(" totalPages ") > -1) {
  						spans[i].innerHTML = '###jsPDFVarTotalPages###';
  					}
  				}

  				//render footer content
  				_DrillForContent(footer, renderer, elementHandlers);
  				//set bottom margin to previous height including the footer height
  				renderer.pdf.margins_doc.bottom += footerHeight;
  				//important for other plugins (e.g. table) to start rendering at correct position after header
  				renderer.y = oldPosition;
  			};

  			//check if footer contains totalPages which should be replace at the disoposal of the document
  			var spans = footer.getElementsByTagName('span');
  			for (var i = 0; i < spans.length; ++i) {
  				if ((" " + spans[i].className + " ").replace(/[\n\t]/g, " ").indexOf(" totalPages ") > -1) {
  					renderer.pdf.internal.events.subscribe('htmlRenderingFinished', renderer.pdf.putTotalPages.bind(renderer.pdf, '###jsPDFVarTotalPages###'), true);
  				}
  			}

  			//register event to render footer on every new page
  			renderer.pdf.internal.events.subscribe('addPage', renderFooter, false);
  			//render footer on first page
  			renderFooter();

  			//prevent footer rendering
  			SkipNode['FOOTER'] = 1;
  		}
  	};
  	process = function process(pdf, element, x, y, settings, callback) {
  		if (!element) return false;
  		if (typeof element !== "string" && !element.parentNode) element = '' + element.innerHTML;
  		if (typeof element === "string") {
  			element = function (element) {
  				var $frame, $hiddendiv, framename, visuallyhidden;
  				framename = "jsPDFhtmlText" + Date.now().toString() + (Math.random() * 1000).toFixed(0);
  				visuallyhidden = "position: absolute !important;" + "clip: rect(1px 1px 1px 1px); /* IE6, IE7 */" + "clip: rect(1px, 1px, 1px, 1px);" + "padding:0 !important;" + "border:0 !important;" + "height: 1px !important;" + "width: 1px !important; " + "top:auto;" + "left:-100px;" + "overflow: hidden;";
  				$hiddendiv = document.createElement('div');
  				$hiddendiv.style.cssText = visuallyhidden;
  				$hiddendiv.innerHTML = "<iframe style=\"height:1px;width:1px\" name=\"" + framename + "\" />";
  				document.body.appendChild($hiddendiv);
  				$frame = window.frames[framename];
  				$frame.document.open();
  				$frame.document.writeln(element);
  				$frame.document.close();
  				return $frame.document.body;
  			}(element.replace(/<\/?script[^>]*?>/gi, ''));
  		}
  		var r = new Renderer(pdf, x, y, settings),
  		    out;

  		// 1. load images
  		// 2. prepare optional footer elements
  		// 3. render content
  		loadImgs.call(this, element, r, settings.elementHandlers, function (found_images) {
  			checkForFooter(element, r, settings.elementHandlers);
  			_DrillForContent(element, r, settings.elementHandlers);
  			//send event dispose for final taks (e.g. footer totalpage replacement)
  			r.pdf.internal.events.publish('htmlRenderingFinished');
  			out = r.dispose();
  			if (typeof callback === 'function') callback(out);else if (found_images) console.error('jsPDF Warning: rendering issues? provide a callback to fromHTML!');
  		});
  		return out || { x: r.x, y: r.y };
  	};
  	Renderer.prototype.init = function () {
  		this.paragraph = {
  			text: [],
  			style: []
  		};
  		return this.pdf.internal.write("q");
  	};
  	Renderer.prototype.dispose = function () {
  		this.pdf.internal.write("Q");
  		return {
  			x: this.x,
  			y: this.y,
  			ready: true
  		};
  	};

  	//Checks if we have to execute some watcher functions
  	//e.g. to end text floating around an image
  	Renderer.prototype.executeWatchFunctions = function (el) {
  		var ret = false;
  		var narray = [];
  		if (this.watchFunctions.length > 0) {
  			for (var i = 0; i < this.watchFunctions.length; ++i) {
  				if (this.watchFunctions[i](el) === true) {
  					ret = true;
  				} else {
  					narray.push(this.watchFunctions[i]);
  				}
  			}
  			this.watchFunctions = narray;
  		}
  		return ret;
  	};

  	Renderer.prototype.splitFragmentsIntoLines = function (fragments, styles) {
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
  				if (fragment == "\u2028") {
  					line = [];
  					lines.push(line);
  				} else if (currentLineLength + fragmentLength > maxLineLength) {
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

  		//if text alignment was set, set margin/indent of each line
  		if (style['text-align'] !== undefined && (style['text-align'] === 'center' || style['text-align'] === 'right' || style['text-align'] === 'justify')) {
  			for (var i = 0; i < lines.length; ++i) {
  				var length = this.pdf.getStringUnitWidth(lines[i][0][0], fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
  				//if there is more than on line we have to clone the style object as all lines hold a reference on this object
  				if (i > 0) {
  					lines[i][0][1] = clone(lines[i][0][1]);
  				}
  				var space = maxLineLength - length;

  				if (style['text-align'] === 'right') {
  					lines[i][0][1]['margin-left'] = space;
  					//if alignment is not right, it has to be center so split the space to the left and the right
  				} else if (style['text-align'] === 'center') {
  					lines[i][0][1]['margin-left'] = space / 2;
  					//if justify was set, calculate the word spacing and define in by using the css property
  				} else if (style['text-align'] === 'justify') {
  					var countSpaces = lines[i][0][0].split(' ').length - 1;
  					lines[i][0][1]['word-spacing'] = space / countSpaces;
  					//ignore the last line in justify mode
  					if (i === lines.length - 1) {
  						lines[i][0][1]['word-spacing'] = 0;
  					}
  				}
  			}
  		}

  		return lines;
  	};
  	Renderer.prototype.RenderTextFragment = function (text, style) {
  		var defaultFontSize, font, maxLineHeight;

  		maxLineHeight = 0;
  		defaultFontSize = 12;

  		if (this.pdf.internal.pageSize.height - this.pdf.margins_doc.bottom < this.y + this.pdf.internal.getFontSize()) {
  			this.pdf.internal.write("ET", "Q");
  			this.pdf.addPage();
  			this.y = this.pdf.margins_doc.top;
  			this.pdf.internal.write("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), style.color, "Td");
  			//move cursor by one line on new page
  			maxLineHeight = Math.max(maxLineHeight, style["line-height"], style["font-size"]);
  			this.pdf.internal.write(0, (-1 * defaultFontSize * maxLineHeight).toFixed(2), "Td");
  		}

  		font = this.pdf.internal.getFont(style["font-family"], style["font-style"]);

  		// text color
  		var pdfTextColor = this.getPdfColor(style["color"]);
  		if (pdfTextColor !== this.lastTextColor) {
  			this.pdf.internal.write(pdfTextColor);
  			this.lastTextColor = pdfTextColor;
  		}

  		//set the word spacing for e.g. justify style
  		if (style['word-spacing'] !== undefined && style['word-spacing'] > 0) {
  			this.pdf.internal.write(style['word-spacing'].toFixed(2), "Tw");
  		}

  		this.pdf.internal.write("/" + font.id, (defaultFontSize * style["font-size"]).toFixed(2), "Tf", "(" + this.pdf.internal.pdfEscape(text) + ") Tj");

  		//set the word spacing back to neutral => 0
  		if (style['word-spacing'] !== undefined) {
  			this.pdf.internal.write(0, "Tw");
  		}
  	};

  	// Accepts #FFFFFF, rgb(int,int,int), or CSS Color Name
  	Renderer.prototype.getPdfColor = function (style) {
  		var textColor;
  		var r, g, b;

  		var rx = /rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+\s*)\)/;
  		var m = rx.exec(style);
  		if (m != null) {
  			r = parseInt(m[1]);
  			g = parseInt(m[2]);
  			b = parseInt(m[3]);
  		} else {
  			if (style.charAt(0) != '#') {
  				style = CssColors.colorNameToHex(style);
  				if (!style) {
  					style = '#000000';
  				}
  			}
  			r = style.substring(1, 3);
  			r = parseInt(r, 16);
  			g = style.substring(3, 5);
  			g = parseInt(g, 16);
  			b = style.substring(5, 7);
  			b = parseInt(b, 16);
  		}

  		if (typeof r === 'string' && /^#[0-9A-Fa-f]{6}$/.test(r)) {
  			var hex = parseInt(r.substr(1), 16);
  			r = hex >> 16 & 255;
  			g = hex >> 8 & 255;
  			b = hex & 255;
  		}

  		var f3 = this.f3;
  		if (r === 0 && g === 0 && b === 0 || typeof g === 'undefined') {
  			textColor = f3(r / 255) + ' g';
  		} else {
  			textColor = [f3(r / 255), f3(g / 255), f3(b / 255), 'rg'].join(' ');
  		}
  		return textColor;
  	};

  	Renderer.prototype.f3 = function (number) {
  		return number.toFixed(3); // Ie, %.3f
  	}, Renderer.prototype.renderParagraph = function (cb) {
  		var blockstyle, defaultFontSize, fontToUnitRatio, fragments, i, l, line, lines, maxLineHeight, out, paragraphspacing_after, paragraphspacing_before, priorblockstyle, styles, fontSize;
  		fragments = PurgeWhiteSpace(this.paragraph.text);
  		styles = this.paragraph.style;
  		blockstyle = this.paragraph.blockstyle;
  		priorblockstyle = this.paragraph.priorblockstyle || {};
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
  		this.priorMarginBottom = this.priorMarginBottom || 0;
  		paragraphspacing_before = (Math.max((blockstyle["margin-top"] || 0) - this.priorMarginBottom, 0) + (blockstyle["padding-top"] || 0)) * fontToUnitRatio;
  		paragraphspacing_after = ((blockstyle["margin-bottom"] || 0) + (blockstyle["padding-bottom"] || 0)) * fontToUnitRatio;
  		this.priorMarginBottom = blockstyle["margin-bottom"] || 0;

  		if (blockstyle['page-break-before'] === 'always') {
  			this.pdf.addPage();
  			this.y = 0;
  			paragraphspacing_before = ((blockstyle["margin-top"] || 0) + (blockstyle["padding-top"] || 0)) * fontToUnitRatio;
  		}

  		out = this.pdf.internal.write;
  		i = void 0;
  		l = void 0;
  		this.y += paragraphspacing_before;
  		out("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");

  		//stores the current indent of cursor position
  		var currentIndent = 0;

  		while (lines.length) {
  			line = lines.shift();
  			maxLineHeight = 0;
  			i = 0;
  			l = line.length;
  			while (i !== l) {
  				if (line[i][0].trim()) {
  					maxLineHeight = Math.max(maxLineHeight, line[i][1]["line-height"], line[i][1]["font-size"]);
  					fontSize = line[i][1]["font-size"] * 7;
  				}
  				i++;
  			}
  			//if we have to move the cursor to adapt the indent
  			var indentMove = 0;
  			var wantedIndent = 0;
  			//if a margin was added (by e.g. a text-alignment), move the cursor
  			if (line[0][1]["margin-left"] !== undefined && line[0][1]["margin-left"] > 0) {
  				wantedIndent = this.pdf.internal.getCoordinateString(line[0][1]["margin-left"]);
  				indentMove = wantedIndent - currentIndent;
  				currentIndent = wantedIndent;
  			}
  			var indentMore = Math.max(blockstyle["margin-left"] || 0, 0) * fontToUnitRatio;
  			//move the cursor
  			out(indentMove + indentMore, (-1 * defaultFontSize * maxLineHeight).toFixed(2), "Td");
  			i = 0;
  			l = line.length;
  			while (i !== l) {
  				if (line[i][0]) {
  					this.RenderTextFragment(line[i][0], line[i][1]);
  				}
  				i++;
  			}
  			this.y += maxLineHeight * fontToUnitRatio;

  			//if some watcher function was executed successful, so e.g. margin and widths were changed,
  			//reset line drawing and calculate position and lines again
  			//e.g. to stop text floating around an image
  			if (this.executeWatchFunctions(line[0][1]) && lines.length > 0) {
  				var localFragments = [];
  				var localStyles = [];
  				//create fragment array of
  				lines.forEach(function (localLine) {
  					var i = 0;
  					var l = localLine.length;
  					while (i !== l) {
  						if (localLine[i][0]) {
  							localFragments.push(localLine[i][0] + ' ');
  							localStyles.push(localLine[i][1]);
  						}
  						++i;
  					}
  				});
  				//split lines again due to possible coordinate changes
  				lines = this.splitFragmentsIntoLines(PurgeWhiteSpace(localFragments), localStyles);
  				//reposition the current cursor
  				out("ET", "Q");
  				out("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");
  			}
  		}
  		if (cb && typeof cb === "function") {
  			cb.call(this, this.x - 9, this.y - fontSize / 2);
  		}
  		out("ET", "Q");
  		return this.y += paragraphspacing_after;
  	};
  	Renderer.prototype.setBlockBoundary = function (cb) {
  		return this.renderParagraph(cb);
  	};
  	Renderer.prototype.setBlockStyle = function (css) {
  		return this.paragraph.blockstyle = css;
  	};
  	Renderer.prototype.addText = function (text, css) {
  		this.paragraph.text.push(text);
  		return this.paragraph.style.push(css);
  	};
  	FontNameDB = {
  		helvetica: "helvetica",
  		"sans-serif": "helvetica",
  		"times new roman": "times",
  		serif: "times",
  		times: "times",
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
  	TextAlignMap = {
  		left: "left",
  		right: "right",
  		center: "center",
  		justify: "justify"
  	};
  	FloatMap = {
  		none: 'none',
  		right: 'right',
  		left: 'left'
  	};
  	ClearMap = {
  		none: 'none',
  		both: 'both'
  	};
  	UnitedNumberMap = {
  		normal: 1
  	};
  	/**
    * Converts HTML-formatted text into formatted PDF text.
    *
    * Notes:
    * 2012-07-18
    * Plugin relies on having browser, DOM around. The HTML is pushed into dom and traversed.
    * Plugin relies on jQuery for CSS extraction.
    * Targeting HTML output from Markdown templating, which is a very simple
    * markup - div, span, em, strong, p. No br-based paragraph separation supported explicitly (but still may work.)
    * Images, tables are NOT supported.
    *
    * @public
    * @function
    * @param HTML {String or DOM Element} HTML-formatted text, or pointer to DOM element that is to be rendered into PDF.
    * @param x {Number} starting X coordinate in jsPDF instance's declared units.
    * @param y {Number} starting Y coordinate in jsPDF instance's declared units.
    * @param settings {Object} Additional / optional variables controlling parsing, rendering.
    * @returns {Object} jsPDF instance
    */
  	jsPDFAPI.fromHTML = function (HTML, x, y, settings, callback, margins) {
  		"use strict";

  		this.margins_doc = margins || {
  			top: 0,
  			bottom: 0
  		};
  		if (!settings) settings = {};
  		if (!settings.elementHandlers) settings.elementHandlers = {};

  		return process(this, HTML, isNaN(x) ? 4 : x, isNaN(y) ? 4 : y, settings, callback);
  	};
  })(jsPDF.API);

  /** ==================================================================== 
   * jsPDF JavaScript plugin
   * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
   * 
   * 
   * ====================================================================
   */

  /*global jsPDF */

  (function (jsPDFAPI) {
      'use strict';

      var jsNamesObj, jsJsObj, text;
      jsPDFAPI.addJS = function (txt) {
          text = txt;
          this.internal.events.subscribe('postPutResources', function (txt) {
              jsNamesObj = this.internal.newObject();
              this.internal.write('<< /Names [(EmbeddedJS) ' + (jsNamesObj + 1) + ' 0 R] >>', 'endobj');
              jsJsObj = this.internal.newObject();
              this.internal.write('<< /S /JavaScript /JS (', text, ') >>', 'endobj');
          });
          this.internal.events.subscribe('putCatalog', function () {
              if (jsNamesObj !== undefined && jsJsObj !== undefined) {
                  this.internal.write('/Names <</JavaScript ' + jsNamesObj + ' 0 R>>');
              }
          });
          return this;
      };
  })(jsPDF.API);

  /**
   * jsPDF Outline PlugIn
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * Generates a PDF Outline
   */
  ;
  (function (jsPDFAPI) {
  	'use strict';

  	jsPDFAPI.events.push(['postPutResources', function () {
  		var pdf = this;
  		var rx = /^(\d+) 0 obj$/;

  		// Write action goto objects for each page
  		// this.outline.destsGoto = [];
  		// for (var i = 0; i < totalPages; i++) {
  		// var id = pdf.internal.newObject();
  		// this.outline.destsGoto.push(id);
  		// pdf.internal.write("<</D[" + (i * 2 + 3) + " 0 R /XYZ null
  		// null null]/S/GoTo>> endobj");
  		// }
  		//
  		// for (var i = 0; i < dests.length; i++) {
  		// pdf.internal.write("(page_" + (i + 1) + ")" + dests[i] + " 0
  		// R");
  		// }
  		//				
  		if (this.outline.root.children.length > 0) {
  			var lines = pdf.outline.render().split(/\r\n/);
  			for (var i = 0; i < lines.length; i++) {
  				var line = lines[i];
  				var m = rx.exec(line);
  				if (m != null) {
  					var oid = m[1];
  					pdf.internal.newObjectDeferredBegin(oid);
  				}
  				pdf.internal.write(line);
  			}
  		}

  		// This code will write named destination for each page reference
  		// (page_1, etc)
  		if (this.outline.createNamedDestinations) {
  			var totalPages = this.internal.pages.length;
  			// WARNING: this assumes jsPDF starts on page 3 and pageIDs
  			// follow 5, 7, 9, etc
  			// Write destination objects for each page
  			var dests = [];
  			for (var i = 0; i < totalPages; i++) {
  				var id = pdf.internal.newObject();
  				dests.push(id);
  				var info = pdf.internal.getPageInfo(i + 1);
  				pdf.internal.write("<< /D[" + info.objId + " 0 R /XYZ null null null]>> endobj");
  			}

  			// assign a name for each destination
  			var names2Oid = pdf.internal.newObject();
  			pdf.internal.write('<< /Names [ ');
  			for (var i = 0; i < dests.length; i++) {
  				pdf.internal.write("(page_" + (i + 1) + ")" + dests[i] + " 0 R");
  			}
  			pdf.internal.write(' ] >>', 'endobj');

  			// var kids = pdf.internal.newObject();
  			// pdf.internal.write('<< /Kids [ ' + names2Oid + ' 0 R');
  			// pdf.internal.write(' ] >>', 'endobj');

  			var namesOid = pdf.internal.newObject();
  			pdf.internal.write('<< /Dests ' + names2Oid + " 0 R");
  			pdf.internal.write('>>', 'endobj');
  		}
  	}]);

  	jsPDFAPI.events.push(['putCatalog', function () {
  		var pdf = this;
  		if (pdf.outline.root.children.length > 0) {
  			pdf.internal.write("/Outlines", this.outline.makeRef(this.outline.root));
  			if (this.outline.createNamedDestinations) {
  				pdf.internal.write("/Names " + namesOid + " 0 R");
  			}
  			// Open with Bookmarks showing
  			// pdf.internal.write("/PageMode /UseOutlines");
  		}
  	}]);

  	jsPDFAPI.events.push(['initialized', function () {
  		var pdf = this;

  		pdf.outline = {
  			createNamedDestinations: false,
  			root: {
  				children: []
  			}
  		};

  		var namesOid;
  		var destsGoto = [];

  		/**
     * Options: pageNumber
     */
  		pdf.outline.add = function (parent, title, options) {
  			var item = {
  				title: title,
  				options: options,
  				children: []
  			};
  			if (parent == null) {
  				parent = this.root;
  			}
  			parent.children.push(item);
  			return item;
  		};

  		pdf.outline.render = function () {
  			this.ctx = {};
  			this.ctx.val = '';
  			this.ctx.pdf = pdf;

  			this.genIds_r(this.root);
  			this.renderRoot(this.root);
  			this.renderItems(this.root);

  			return this.ctx.val;
  		};

  		pdf.outline.genIds_r = function (node) {
  			node.id = pdf.internal.newObjectDeferred();
  			for (var i = 0; i < node.children.length; i++) {
  				this.genIds_r(node.children[i]);
  			}
  		};

  		pdf.outline.renderRoot = function (node) {
  			this.objStart(node);
  			this.line('/Type /Outlines');
  			if (node.children.length > 0) {
  				this.line('/First ' + this.makeRef(node.children[0]));
  				this.line('/Last ' + this.makeRef(node.children[node.children.length - 1]));
  			}
  			this.line('/Count ' + this.count_r({
  				count: 0
  			}, node));
  			this.objEnd();
  		};

  		pdf.outline.renderItems = function (node) {
  			for (var i = 0; i < node.children.length; i++) {
  				var item = node.children[i];
  				this.objStart(item);

  				this.line('/Title ' + this.makeString(item.title));

  				this.line('/Parent ' + this.makeRef(node));
  				if (i > 0) {
  					this.line('/Prev ' + this.makeRef(node.children[i - 1]));
  				}
  				if (i < node.children.length - 1) {
  					this.line('/Next ' + this.makeRef(node.children[i + 1]));
  				}
  				if (item.children.length > 0) {
  					this.line('/First ' + this.makeRef(item.children[0]));
  					this.line('/Last ' + this.makeRef(item.children[item.children.length - 1]));
  				}

  				var count = this.count = this.count_r({
  					count: 0
  				}, item);
  				if (count > 0) {
  					this.line('/Count ' + count);
  				}

  				if (item.options) {
  					if (item.options.pageNumber) {
  						// Explicit Destination
  						//WARNING this assumes page ids are 3,5,7, etc.
  						var info = pdf.internal.getPageInfo(item.options.pageNumber);
  						this.line('/Dest ' + '[' + info.objId + ' 0 R /XYZ 0 ' + this.ctx.pdf.internal.pageSize.height + ' 0]');
  						// this line does not work on all clients (pageNumber instead of page ref)
  						//this.line('/Dest ' + '[' + (item.options.pageNumber - 1) + ' /XYZ 0 ' + this.ctx.pdf.internal.pageSize.height + ' 0]');

  						// Named Destination
  						// this.line('/Dest (page_' + (item.options.pageNumber) + ')');

  						// Action Destination
  						// var id = pdf.internal.newObject();
  						// pdf.internal.write('<</D[' + (item.options.pageNumber - 1) + ' /XYZ null null null]/S/GoTo>> endobj');
  						// this.line('/A ' + id + ' 0 R' );
  					}
  				}
  				this.objEnd();
  			}
  			for (var i = 0; i < node.children.length; i++) {
  				var item = node.children[i];
  				this.renderItems(item);
  			}
  		};

  		pdf.outline.line = function (text) {
  			this.ctx.val += text + '\r\n';
  		};

  		pdf.outline.makeRef = function (node) {
  			return node.id + ' 0 R';
  		};

  		pdf.outline.makeString = function (val) {
  			return '(' + pdf.internal.pdfEscape(val) + ')';
  		};

  		pdf.outline.objStart = function (node) {
  			this.ctx.val += '\r\n' + node.id + ' 0 obj' + '\r\n<<\r\n';
  		};

  		pdf.outline.objEnd = function (node) {
  			this.ctx.val += '>> \r\n' + 'endobj' + '\r\n';
  		};

  		pdf.outline.count_r = function (ctx, node) {
  			for (var i = 0; i < node.children.length; i++) {
  				ctx.count++;
  				this.count_r(ctx, node.children[i]);
  			}
  			return ctx.count;
  		};
  	}]);

  	return this;
  })(jsPDF.API);

  /**@preserve
   *  ====================================================================
   * jsPDF PNG PlugIn
   * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
   *
   * 
   * ====================================================================
   */

  (function (jsPDFAPI) {
  	'use strict';

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

  	var doesNotHavePngJS = function doesNotHavePngJS() {
  		return typeof PNG !== 'function' || typeof FlateStream !== 'function';
  	},
  	    canCompress = function canCompress(value) {
  		return value !== jsPDFAPI.image_compression.NONE && hasCompressionJS();
  	},
  	    hasCompressionJS = function hasCompressionJS() {
  		var inst = typeof Deflater === 'function';
  		if (!inst) throw new Error("requires deflate.js for compression");
  		return inst;
  	},
  	    compressBytes = function compressBytes(bytes, lineLength, colorsPerPixel, compression) {

  		var level = 5,
  		    filter_method = filterUp;

  		switch (compression) {

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
  				filter_method = filterPaeth; //uses to sum to choose best filter for each line
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

  		cmpd[len++] = checksum >>> 24 & 0xff;
  		cmpd[len++] = checksum >>> 16 & 0xff;
  		cmpd[len++] = checksum >>> 8 & 0xff;
  		cmpd[len++] = checksum & 0xff;

  		return jsPDFAPI.arrayBufferToBinaryString(cmpd);
  	},
  	    createZlibHeader = function createZlibHeader(bytes, level) {
  		/*
     * @see http://www.ietf.org/rfc/rfc1950.txt for zlib header
     */
  		var cm = 8;
  		var cinfo = Math.LOG2E * Math.log(0x8000) - 8;
  		var cmf = cinfo << 4 | cm;

  		var hdr = cmf << 8;
  		var flevel = Math.min(3, (level - 1 & 0xff) >> 1);

  		hdr |= flevel << 6;
  		hdr |= 0; //FDICT
  		hdr += 31 - hdr % 31;

  		return [cmf, hdr & 0xff & 0xff];
  	},
  	    adler32 = function adler32(array, param) {
  		var adler = 1;
  		var s1 = adler & 0xffff,
  		    s2 = adler >>> 16 & 0xffff;
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

  		return (s2 << 16 | s1) >>> 0;
  	},
  	    applyPngFilterMethod = function applyPngFilterMethod(bytes, lineLength, colorsPerPixel, filter_method) {
  		var lines = bytes.length / lineLength,
  		    result = new Uint8Array(bytes.length + lines),
  		    filter_methods = getFilterMethods(),
  		    i = 0,
  		    line,
  		    prevLine,
  		    offset;

  		for (; i < lines; i++) {
  			offset = i * lineLength;
  			line = bytes.subarray(offset, offset + lineLength);

  			if (filter_method) {
  				result.set(filter_method(line, colorsPerPixel, prevLine), offset + i);
  			} else {

  				var j = 0,
  				    len = filter_methods.length,
  				    results = [];

  				for (; j < len; j++) {
  					results[j] = filter_methods[j](line, colorsPerPixel, prevLine);
  				}var ind = getIndexOfSmallestSum(results.concat());

  				result.set(results[ind], offset + i);
  			}

  			prevLine = line;
  		}

  		return result;
  	},
  	    filterNone = function filterNone(line, colorsPerPixel, prevLine) {
  		/*var result = new Uint8Array(line.length + 1);
    result[0] = 0;
    result.set(line, 1);*/

  		var result = Array.apply([], line);
  		result.unshift(0);

  		return result;
  	},
  	    filterSub = function filterSub(line, colorsPerPixel, prevLine) {
  		var result = [],
  		    i = 0,
  		    len = line.length,
  		    left;

  		result[0] = 1;

  		for (; i < len; i++) {
  			left = line[i - colorsPerPixel] || 0;
  			result[i + 1] = line[i] - left + 0x0100 & 0xff;
  		}

  		return result;
  	},
  	    filterUp = function filterUp(line, colorsPerPixel, prevLine) {
  		var result = [],
  		    i = 0,
  		    len = line.length,
  		    up;

  		result[0] = 2;

  		for (; i < len; i++) {
  			up = prevLine && prevLine[i] || 0;
  			result[i + 1] = line[i] - up + 0x0100 & 0xff;
  		}

  		return result;
  	},
  	    filterAverage = function filterAverage(line, colorsPerPixel, prevLine) {
  		var result = [],
  		    i = 0,
  		    len = line.length,
  		    left,
  		    up;

  		result[0] = 3;

  		for (; i < len; i++) {
  			left = line[i - colorsPerPixel] || 0;
  			up = prevLine && prevLine[i] || 0;
  			result[i + 1] = line[i] + 0x0100 - (left + up >>> 1) & 0xff;
  		}

  		return result;
  	},
  	    filterPaeth = function filterPaeth(line, colorsPerPixel, prevLine) {
  		var result = [],
  		    i = 0,
  		    len = line.length,
  		    left,
  		    up,
  		    upLeft,
  		    paeth;

  		result[0] = 4;

  		for (; i < len; i++) {
  			left = line[i - colorsPerPixel] || 0;
  			up = prevLine && prevLine[i] || 0;
  			upLeft = prevLine && prevLine[i - colorsPerPixel] || 0;
  			paeth = paethPredictor(left, up, upLeft);
  			result[i + 1] = line[i] - paeth + 0x0100 & 0xff;
  		}

  		return result;
  	},
  	    paethPredictor = function paethPredictor(left, up, upLeft) {

  		var p = left + up - upLeft,
  		    pLeft = Math.abs(p - left),
  		    pUp = Math.abs(p - up),
  		    pUpLeft = Math.abs(p - upLeft);

  		return pLeft <= pUp && pLeft <= pUpLeft ? left : pUp <= pUpLeft ? up : upLeft;
  	},
  	    getFilterMethods = function getFilterMethods() {
  		return [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
  	},
  	    getIndexOfSmallestSum = function getIndexOfSmallestSum(arrays) {
  		var i = 0,
  		    len = arrays.length,
  		    sum,
  		    min,
  		    ind;

  		while (i < len) {
  			sum = absSum(arrays[i].slice(1));

  			if (sum < min || !min) {
  				min = sum;
  				ind = i;
  			}

  			i++;
  		}

  		return ind;
  	},
  	    absSum = function absSum(array) {
  		var i = 0,
  		    len = array.length,
  		    sum = 0;

  		while (i < len) {
  			sum += Math.abs(array[i++]);
  		}return sum;
  	},
  	    getPredictorFromCompression = function getPredictorFromCompression(compression) {
  		var predictor;
  		switch (compression) {
  			case jsPDFAPI.image_compression.FAST:
  				predictor = 11;
  				break;

  			case jsPDFAPI.image_compression.MEDIUM:
  				predictor = 13;
  				break;

  			case jsPDFAPI.image_compression.SLOW:
  				predictor = 14;
  				break;
  		}
  		return predictor;
  	},
  	    logImg = function logImg(img) {
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

  	jsPDFAPI.processPNG = function (imageData, imageIndex, alias, compression, dataAsBinaryString) {
  		'use strict';

  		var colorSpace = this.color_spaces.DEVICE_RGB,
  		    decode = this.decode.FLATE_DECODE,
  		    bpc = 8,
  		    img,
  		    dp,
  		    trns,
  		    colors,
  		    pal,
  		    smask;

  		/*	if(this.isString(imageData)) {
    		}*/

  		if (this.isArrayBuffer(imageData)) imageData = new Uint8Array(imageData);

  		if (this.isArrayBufferView(imageData)) {

  			if (doesNotHavePngJS()) throw new Error("PNG support requires png.js and zlib.js");

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
  			if ([4, 6].indexOf(img.colorType) !== -1) {

  				/*
       * processes 8 bit RGBA and grayscale + alpha images
       */
  				if (img.bits === 8) {

  					var pixels = img.pixelBitlength == 32 ? new Uint32Array(img.decodePixels().buffer) : img.pixelBitlength == 16 ? new Uint16Array(img.decodePixels().buffer) : new Uint8Array(img.decodePixels().buffer),
  					    len = pixels.length,
  					    imgData = new Uint8Array(len * img.colors),
  					    alphaData = new Uint8Array(len),
  					    pDiff = img.pixelBitlength - img.bits,
  					    i = 0,
  					    n = 0,
  					    pixel,
  					    pbl;

  					for (; i < len; i++) {
  						pixel = pixels[i];
  						pbl = 0;

  						while (pbl < pDiff) {

  							imgData[n++] = pixel >>> pbl & 0xff;
  							pbl = pbl + img.bits;
  						}

  						alphaData[i] = pixel >>> pbl & 0xff;
  					}
  				}

  				/*
       * processes 16 bit RGBA and grayscale + alpha images
       */
  				if (img.bits === 16) {

  					var pixels = new Uint32Array(img.decodePixels().buffer),
  					    len = pixels.length,
  					    imgData = new Uint8Array(len * (32 / img.pixelBitlength) * img.colors),
  					    alphaData = new Uint8Array(len * (32 / img.pixelBitlength)),
  					    hasColors = img.colors > 1,
  					    i = 0,
  					    n = 0,
  					    a = 0,
  					    pixel;

  					while (i < len) {
  						pixel = pixels[i++];

  						imgData[n++] = pixel >>> 0 & 0xFF;

  						if (hasColors) {
  							imgData[n++] = pixel >>> 16 & 0xFF;

  							pixel = pixels[i++];
  							imgData[n++] = pixel >>> 0 & 0xFF;
  						}

  						alphaData[a++] = pixel >>> 16 & 0xFF;
  					}

  					bpc = 8;
  				}

  				if (canCompress(compression)) {

  					imageData = compressBytes(imgData, img.width * img.colors, img.colors, compression);
  					smask = compressBytes(alphaData, img.width, 1, compression);
  				} else {

  					imageData = imgData;
  					smask = alphaData;
  					decode = null;
  				}
  			}

  			/*
      * Indexed png. Each pixel is a palette index.
      */
  			if (img.colorType === 3) {

  				colorSpace = this.color_spaces.INDEXED;
  				pal = img.palette;

  				if (img.transparency.indexed) {

  					var trans = img.transparency.indexed;

  					var total = 0,
  					    i = 0,
  					    len = trans.length;

  					for (; i < len; ++i) {
  						total += trans[i];
  					}total = total / 255;

  					/*
        * a single color is specified as 100% transparent (0),
        * so we set trns to use a /Mask with that index
        */
  					if (total === len - 1 && trans.indexOf(0) !== -1) {
  						trns = [trans.indexOf(0)];

  						/*
         * there's more than one colour within the palette that specifies
         * a transparency value less than 255, so we unroll the pixels to create an image sMask
         */
  					} else if (total !== len) {

  						var pixels = img.decodePixels(),
  						    alphaData = new Uint8Array(pixels.length),
  						    i = 0,
  						    len = pixels.length;

  						for (; i < len; i++) {
  							alphaData[i] = trans[pixels[i]];
  						}smask = compressBytes(alphaData, img.width, 1);
  					}
  				}
  			}

  			var predictor = getPredictorFromCompression(compression);

  			if (decode === this.decode.FLATE_DECODE) dp = '/Predictor ' + predictor + ' /Colors ' + colors + ' /BitsPerComponent ' + bpc + ' /Columns ' + img.width;else
  				//remove 'Predictor' as it applies to the type of png filter applied to its IDAT - we only apply with compression
  				dp = '/Colors ' + colors + ' /BitsPerComponent ' + bpc + ' /Columns ' + img.width;

  			if (this.isArrayBuffer(imageData) || this.isArrayBufferView(imageData)) imageData = this.arrayBufferToBinaryString(imageData);

  			if (smask && this.isArrayBuffer(smask) || this.isArrayBufferView(smask)) smask = this.arrayBufferToBinaryString(smask);

  			return this.createImageInfo(imageData, img.width, img.height, colorSpace, bpc, decode, imageIndex, alias, dp, trns, pal, smask, predictor);
  		}

  		throw new Error("Unsupported PNG image data, try using JPEG instead.");
  	};
  })(jsPDF.API);

  /**
   * jsPDF Autoprint Plugin
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  (function (jsPDFAPI) {
    'use strict';

    jsPDFAPI.autoPrint = function () {
      'use strict';

      var refAutoPrintTag;

      this.internal.events.subscribe('postPutResources', function () {
        refAutoPrintTag = this.internal.newObject();
        this.internal.write("<< /S/Named /Type/Action /N/Print >>", "endobj");
      });

      this.internal.events.subscribe("putCatalog", function () {
        this.internal.write("/OpenAction " + refAutoPrintTag + " 0" + " R");
      });
      return this;
    };
  })(jsPDF.API);

  /** @preserve
   * jsPDF split_text_to_size plugin - MIT license.
   * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
   *               2014 Diego Casorran, https://github.com/diegocr
   */
  /**
   * 
   * ====================================================================
   */

  ;(function (API) {
  	'use strict';

  	/**
   Returns an array of length matching length of the 'word' string, with each
   cell ocupied by the width of the char in that position.
   
   @function
   @param word {String}
   @param widths {Object}
   @param kerning {Object}
   @returns {Array}
   */

  	var getCharWidthsArray = API.getCharWidthsArray = function (text, options) {

  		if (!options) {
  			options = {};
  		}

  		var widths = options.widths ? options.widths : this.internal.getFont().metadata.Unicode.widths,
  		    widthsFractionOf = widths.fof ? widths.fof : 1,
  		    kerning = options.kerning ? options.kerning : this.internal.getFont().metadata.Unicode.kerning,
  		    kerningFractionOf = kerning.fof ? kerning.fof : 1;

  		// console.log("widths, kergnings", widths, kerning)

  		var i,
  		    l,
  		    char_code,
  		    prior_char_code = 0 // for kerning
  		,
  		    default_char_width = widths[0] || widthsFractionOf,
  		    output = [];

  		for (i = 0, l = text.length; i < l; i++) {
  			char_code = text.charCodeAt(i);
  			output.push((widths[char_code] || default_char_width) / widthsFractionOf + (kerning[char_code] && kerning[char_code][prior_char_code] || 0) / kerningFractionOf);
  			prior_char_code = char_code;
  		}

  		return output;
  	};
  	var getArraySum = function getArraySum(array) {
  		var i = array.length,
  		    output = 0;
  		while (i) {
  			;i--;
  			output += array[i];
  		}
  		return output;
  	};
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
  	var getStringUnitWidth = API.getStringUnitWidth = function (text, options) {
  		return getArraySum(getCharWidthsArray.call(this, text, options));
  	};

  	/**
   returns array of lines
   */
  	var splitLongWord = function splitLongWord(word, widths_array, firstLineMaxLen, maxLen) {
  		var answer = [];

  		// 1st, chop off the piece that can fit on the hanging line.
  		var i = 0,
  		    l = word.length,
  		    workingLen = 0;
  		while (i !== l && workingLen + widths_array[i] < firstLineMaxLen) {
  			workingLen += widths_array[i];i++;
  		}
  		// this is first line.
  		answer.push(word.slice(0, i));

  		// 2nd. Split the rest into maxLen pieces.
  		var startOfLine = i;
  		workingLen = 0;
  		while (i !== l) {
  			if (workingLen + widths_array[i] > maxLen) {
  				answer.push(word.slice(startOfLine, i));
  				workingLen = 0;
  				startOfLine = i;
  			}
  			workingLen += widths_array[i];i++;
  		}
  		if (startOfLine !== i) {
  			answer.push(word.slice(startOfLine, i));
  		}

  		return answer;
  	};

  	// Note, all sizing inputs for this function must be in "font measurement units"
  	// By default, for PDF, it's "point".
  	var splitParagraphIntoLines = function splitParagraphIntoLines(text, maxlen, options) {
  		// at this time works only on Western scripts, ones with space char
  		// separating the words. Feel free to expand.

  		if (!options) {
  			options = {};
  		}

  		var line = [],
  		    lines = [line],
  		    line_length = options.textIndent || 0,
  		    separator_length = 0,
  		    current_word_length = 0,
  		    word,
  		    widths_array,
  		    words = text.split(' '),
  		    spaceCharWidth = getCharWidthsArray(' ', options)[0],
  		    i,
  		    l,
  		    tmp,
  		    lineIndent;

  		if (options.lineIndent === -1) {
  			lineIndent = words[0].length + 2;
  		} else {
  			lineIndent = options.lineIndent || 0;
  		}
  		if (lineIndent) {
  			var pad = Array(lineIndent).join(" "),
  			    wrds = [];
  			words.map(function (wrd) {
  				wrd = wrd.split(/\s*\n/);
  				if (wrd.length > 1) {
  					wrds = wrds.concat(wrd.map(function (wrd, idx) {
  						return (idx && wrd.length ? "\n" : "") + wrd;
  					}));
  				} else {
  					wrds.push(wrd[0]);
  				}
  			});
  			words = wrds;
  			lineIndent = getStringUnitWidth(pad, options);
  		}

  		for (i = 0, l = words.length; i < l; i++) {
  			var force = 0;

  			word = words[i];
  			if (lineIndent && word[0] == "\n") {
  				word = word.substr(1);
  				force = 1;
  			}
  			widths_array = getCharWidthsArray(word, options);
  			current_word_length = getArraySum(widths_array);

  			if (line_length + separator_length + current_word_length > maxlen || force) {
  				if (current_word_length > maxlen) {
  					// this happens when you have space-less long URLs for example.
  					// we just chop these to size. We do NOT insert hiphens
  					tmp = splitLongWord(word, widths_array, maxlen - (line_length + separator_length), maxlen);
  					// first line we add to existing line object
  					line.push(tmp.shift()); // it's ok to have extra space indicator there
  					// last line we make into new line object
  					line = [tmp.pop()];
  					// lines in the middle we apped to lines object as whole lines
  					while (tmp.length) {
  						lines.push([tmp.shift()]); // single fragment occupies whole line
  					}
  					current_word_length = getArraySum(widths_array.slice(word.length - line[0].length));
  				} else {
  					// just put it on a new line
  					line = [word];
  				}

  				// now we attach new line to lines
  				lines.push(line);
  				line_length = current_word_length + lineIndent;
  				separator_length = spaceCharWidth;
  			} else {
  				line.push(word);

  				line_length += separator_length + current_word_length;
  				separator_length = spaceCharWidth;
  			}
  		}

  		if (lineIndent) {
  			var postProcess = function postProcess(ln, idx) {
  				return (idx ? pad : '') + ln.join(" ");
  			};
  		} else {
  			var postProcess = function postProcess(ln) {
  				return ln.join(" ");
  			};
  		}

  		return lines.map(postProcess);
  	};

  	/**
   Splits a given string into an array of strings. Uses 'size' value
   (in measurement units declared as default for the jsPDF instance)
   and the font's "widths" and "Kerning" tables, where available, to
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
  	API.splitTextToSize = function (text, maxlen, options) {
  		'use strict';

  		if (!options) {
  			options = {};
  		}

  		var fsize = options.fontSize || this.internal.getFontSize(),
  		    newOptions = function (options) {
  			var widths = { 0: 1 },
  			    kerning = {};

  			if (!options.widths || !options.kerning) {
  				var f = this.internal.getFont(options.fontName, options.fontStyle),
  				    encoding = 'Unicode';
  				// NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE
  				// Actual JavaScript-native String's 16bit char codes used.
  				// no multi-byte logic here

  				if (f.metadata[encoding]) {
  					return {
  						widths: f.metadata[encoding].widths || widths,
  						kerning: f.metadata[encoding].kerning || kerning
  					};
  				}
  			} else {
  				return {
  					widths: options.widths,
  					kerning: options.kerning
  				};
  			}

  			// then use default values
  			return {
  				widths: widths,
  				kerning: kerning
  			};
  		}.call(this, options);

  		// first we split on end-of-line chars
  		var paragraphs;
  		if (Array.isArray(text)) {
  			paragraphs = text;
  		} else {
  			paragraphs = text.split(/\r?\n/);
  		}

  		// now we convert size (max length of line) into "font size units"
  		// at present time, the "font size unit" is always 'point'
  		// 'proportional' means, "in proportion to font size"
  		var fontUnit_maxLen = 1.0 * this.internal.scaleFactor * maxlen / fsize;
  		// at this time, fsize is always in "points" regardless of the default measurement unit of the doc.
  		// this may change in the future?
  		// until then, proportional_maxlen is likely to be in 'points'

  		// If first line is to be indented (shorter or longer) than maxLen
  		// we indicate that by using CSS-style "text-indent" option.
  		// here it's in font units too (which is likely 'points')
  		// it can be negative (which makes the first line longer than maxLen)
  		newOptions.textIndent = options.textIndent ? options.textIndent * 1.0 * this.internal.scaleFactor / fsize : 0;
  		newOptions.lineIndent = options.lineIndent;

  		var i,
  		    l,
  		    output = [];
  		for (i = 0, l = paragraphs.length; i < l; i++) {
  			output = output.concat(splitParagraphIntoLines(paragraphs[i], fontUnit_maxLen, newOptions));
  		}

  		return output;
  	};
  })(jsPDF.API);

  /** @preserve 
  jsPDF standard_fonts_metrics plugin
  Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
  MIT license.
  */
  /**
   * 
   * ====================================================================
   */

  ;(function (API) {
  	'use strict';

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

  	var uncompress = function uncompress(data) {

  		var decoded = '0123456789abcdef',
  		    encoded = 'klmnopqrstuvwxyz',
  		    mapping = {};

  		for (var i = 0; i < encoded.length; i++) {
  			mapping[encoded[i]] = decoded[i];
  		}

  		var undef,
  		    output = {},
  		    sign = 1,
  		    stringparts // undef. will be [] in string mode

  		,
  		    activeobject = output,
  		    parentchain = [],
  		    parent_key_pair,
  		    keyparts = '',
  		    valueparts = '',
  		    key // undef. will be Truthy when Key is resolved.
  		,
  		    datalen = data.length - 1 // stripping ending }
  		,
  		    ch;

  		i = 1; // stripping starting {

  		while (i != datalen) {
  			// - { } ' are special.

  			ch = data[i];
  			i += 1;

  			if (ch == "'") {
  				if (stringparts) {
  					// end of string mode
  					key = stringparts.join('');
  					stringparts = undef;
  				} else {
  					// start of string mode
  					stringparts = [];
  				}
  			} else if (stringparts) {
  				stringparts.push(ch);
  			} else if (ch == '{') {
  				// start of object
  				parentchain.push([activeobject, key]);
  				activeobject = {};
  				key = undef;
  			} else if (ch == '}') {
  				// end of object
  				parent_key_pair = parentchain.pop();
  				parent_key_pair[0][parent_key_pair[1]] = activeobject;
  				key = undef;
  				activeobject = parent_key_pair[0];
  			} else if (ch == '-') {
  				sign = -1;
  			} else {
  				// must be number
  				if (key === undef) {
  					if (mapping.hasOwnProperty(ch)) {
  						keyparts += mapping[ch];
  						key = parseInt(keyparts, 16) * sign;
  						sign = +1;
  						keyparts = '';
  					} else {
  						keyparts += ch;
  					}
  				} else {
  					if (mapping.hasOwnProperty(ch)) {
  						valueparts += mapping[ch];
  						activeobject[key] = parseInt(valueparts, 16) * sign;
  						sign = +1;
  						key = undef;
  						valueparts = '';
  					} else {
  						valueparts += ch;
  					}
  				}
  			}
  		} // end while

  		return output;
  	};

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
  		'codePages': ['WinAnsiEncoding'],
  		'WinAnsiEncoding': uncompress("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")
  	},
  	    encodings = { 'Unicode': {
  			'Courier': encodingBlock,
  			'Courier-Bold': encodingBlock,
  			'Courier-BoldOblique': encodingBlock,
  			'Courier-Oblique': encodingBlock,
  			'Helvetica': encodingBlock,
  			'Helvetica-Bold': encodingBlock,
  			'Helvetica-BoldOblique': encodingBlock,
  			'Helvetica-Oblique': encodingBlock,
  			'Times-Roman': encodingBlock,
  			'Times-Bold': encodingBlock,
  			'Times-BoldItalic': encodingBlock,
  			'Times-Italic': encodingBlock
  			//	, 'Symbol'
  			//	, 'ZapfDingbats'
  		} }
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
  	,
  	    fontMetrics = { 'Unicode': {
  			// all sizing numbers are n/fontMetricsFractionOf = one font size unit
  			// this means that if fontMetricsFractionOf = 1000, and letter A's width is 476, it's
  			// width is 476/1000 or 47.6% of its height (regardless of font size)
  			// At this time this value applies to "widths" and "kerning" numbers.

  			// char code 0 represents "default" (average) width - use it for chars missing in this table.
  			// key 'fof' represents the "fontMetricsFractionOf" value

  			'Courier-Oblique': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
  			'Times-BoldItalic': uncompress("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"),
  			'Helvetica-Bold': uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),
  			'Courier': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
  			'Courier-BoldOblique': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
  			'Times-Bold': uncompress("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}")
  			//, 'Symbol': uncompress("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}")
  			, 'Helvetica': uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"),
  			'Helvetica-BoldOblique': uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}")
  			//, 'ZapfDingbats': uncompress("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}")
  			, 'Courier-Bold': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
  			'Times-Italic': uncompress("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"),
  			'Times-Roman': uncompress("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"),
  			'Helvetica-Oblique': uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")
  		} };

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

  	API.events.push(['addFont', function (font) {
  		var metrics,
  		    unicode_section,
  		    encoding = 'Unicode',
  		    encodingBlock;

  		metrics = fontMetrics[encoding][font.PostScriptName];
  		if (metrics) {
  			if (font.metadata[encoding]) {
  				unicode_section = font.metadata[encoding];
  			} else {
  				unicode_section = font.metadata[encoding] = {};
  			}

  			unicode_section.widths = metrics.widths;
  			unicode_section.kerning = metrics.kerning;
  		}

  		encodingBlock = encodings[encoding][font.PostScriptName];
  		if (encodingBlock) {
  			if (font.metadata[encoding]) {
  				unicode_section = font.metadata[encoding];
  			} else {
  				unicode_section = font.metadata[encoding] = {};
  			}

  			unicode_section.encoding = encodingBlock;
  			if (encodingBlock.codePages && encodingBlock.codePages.length) {
  				font.encoding = encodingBlock.codePages[0];
  			}
  		}
  	}]); // end of adding event handler
  })(jsPDF.API);

  /** @preserve
  jsPDF SVG plugin
  Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
  */
  /**
   * 
   * ====================================================================
   */

  ;(function (jsPDFAPI) {
  	'use strict';

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

  	jsPDFAPI.addSVG = function (svgtext, x, y, w, h) {
  		// 'this' is _jsPDF object returned when jsPDF is inited (new jsPDF())

  		var undef;

  		if (x === undef || y === undef) {
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

  		function createWorkerNode(document) {

  			var frameID = 'childframe' // Date.now().toString() + '_' + (Math.random() * 100).toString()
  			,
  			    frame = document.createElement('iframe');

  			InjectCSS('.jsPDF_sillysvg_iframe {display:none;position:absolute;}', document);

  			frame.name = frameID;
  			frame.setAttribute("width", 0);
  			frame.setAttribute("height", 0);
  			frame.setAttribute("frameborder", "0");
  			frame.setAttribute("scrolling", "no");
  			frame.setAttribute("seamless", "seamless");
  			frame.setAttribute("class", "jsPDF_sillysvg_iframe");

  			document.body.appendChild(frame);

  			return frame;
  		}

  		function attachSVGToWorkerNode(svgtext, frame) {
  			var framedoc = (frame.contentWindow || frame.contentDocument).document;
  			framedoc.write(svgtext);
  			framedoc.close();
  			return framedoc.getElementsByTagName('svg')[0];
  		}

  		function convertPathToPDFLinesArgs(path) {
  			'use strict';
  			// we will use 'lines' method call. it needs:
  			// - starting coordinate pair
  			// - array of arrays of vector shifts (2-len for line, 6 len for bezier)
  			// - scale array [horizontal, vertical] ratios
  			// - style (stroke, fill, both)

  			var x = parseFloat(path[1]),
  			    y = parseFloat(path[2]),
  			    vectors = [],
  			    position = 3,
  			    len = path.length;

  			while (position < len) {
  				if (path[position] === 'c') {
  					vectors.push([parseFloat(path[position + 1]), parseFloat(path[position + 2]), parseFloat(path[position + 3]), parseFloat(path[position + 4]), parseFloat(path[position + 5]), parseFloat(path[position + 6])]);
  					position += 7;
  				} else if (path[position] === 'l') {
  					vectors.push([parseFloat(path[position + 1]), parseFloat(path[position + 2])]);
  					position += 3;
  				} else {
  					position += 1;
  				}
  			}
  			return [x, y, vectors];
  		}

  		var workernode = createWorkerNode(document),
  		    svgnode = attachSVGToWorkerNode(svgtext, workernode),
  		    scale = [1, 1],
  		    svgw = parseFloat(svgnode.getAttribute('width')),
  		    svgh = parseFloat(svgnode.getAttribute('height'));

  		if (svgw && svgh) {
  			// setting both w and h makes image stretch to size.
  			// this may distort the image, but fits your demanded size
  			if (w && h) {
  				scale = [w / svgw, h / svgh];
  			}
  			// if only one is set, that value is set as max and SVG
  			// is scaled proportionately.
  			else if (w) {
  					scale = [w / svgw, w / svgw];
  				} else if (h) {
  					scale = [h / svgh, h / svgh];
  				}
  		}

  		var i,
  		    l,
  		    tmp,
  		    linesargs,
  		    items = svgnode.childNodes;
  		for (i = 0, l = items.length; i < l; i++) {
  			tmp = items[i];
  			if (tmp.tagName && tmp.tagName.toUpperCase() === 'PATH') {
  				linesargs = convertPathToPDFLinesArgs(tmp.getAttribute("d").split(' '));
  				// path start x coordinate
  				linesargs[0] = linesargs[0] * scale[0] + x; // where x is upper left X of image
  				// path start y coordinate
  				linesargs[1] = linesargs[1] * scale[1] + y; // where y is upper left Y of image
  				// the rest of lines are vectors. these will adjust with scale value auto.
  				this.lines.call(this, linesargs[2] // lines
  				, linesargs[0] // starting x
  				, linesargs[1] // starting y
  				, scale);
  			}
  		}

  		// clean up
  		// workernode.parentNode.removeChild(workernode)

  		return this;
  	};
  })(jsPDF.API);

  /** ==================================================================== 
   * jsPDF total_pages plugin
   * Copyright (c) 2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
   * 
   * 
   * ====================================================================
   */

  (function (jsPDFAPI) {
    'use strict';

    jsPDFAPI.putTotalPages = function (pageExpression) {
      'use strict';

      var replaceExpression = new RegExp(pageExpression, 'g');
      for (var n = 1; n <= this.internal.getNumberOfPages(); n++) {
        for (var i = 0; i < this.internal.pages[n].length; i++) {
          this.internal.pages[n][i] = this.internal.pages[n][i].replace(replaceExpression, this.internal.getNumberOfPages());
        }
      }
      return this;
    };
  })(jsPDF.API);

  /** ==================================================================== 
   * jsPDF XMP metadata plugin
   * Copyright (c) 2016 Jussi Utunen, u-jussi@suomi24.fi
   * 
   * 
   * ====================================================================
   */

  /*global jsPDF */

  /**
  * Adds XMP formatted metadata to PDF
  *
  * @param {String} metadata The actual metadata to be added. The metadata shall be stored as XMP simple value. Note that if the metadata string contains XML markup characters "<", ">" or "&", those characters should be written using XML entities.
  * @param {String} namespaceuri Sets the namespace URI for the metadata. Last character should be slash or hash.
  * @function
  * @returns {jsPDF}
  * @methodOf jsPDF#
  * @name addMetadata
  */

  (function (jsPDFAPI) {
      'use strict';

      var xmpmetadata = "";
      var xmpnamespaceuri = "";
      var metadata_object_number = "";

      jsPDFAPI.addMetadata = function (metadata, namespaceuri) {
          xmpnamespaceuri = namespaceuri || "http://jspdf.default.namespaceuri/"; //The namespace URI for an XMP name shall not be empty
          xmpmetadata = metadata;
          this.internal.events.subscribe('postPutResources', function () {
              if (!xmpmetadata) {
                  metadata_object_number = "";
              } else {
                  var xmpmeta_beginning = '<x:xmpmeta xmlns:x="adobe:ns:meta/">';
                  var rdf_beginning = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:jspdf="' + xmpnamespaceuri + '"><jspdf:metadata>';
                  var rdf_ending = '</jspdf:metadata></rdf:Description></rdf:RDF>';
                  var xmpmeta_ending = '</x:xmpmeta>';
                  var utf8_xmpmeta_beginning = unescape(encodeURIComponent(xmpmeta_beginning));
                  var utf8_rdf_beginning = unescape(encodeURIComponent(rdf_beginning));
                  var utf8_metadata = unescape(encodeURIComponent(xmpmetadata));
                  var utf8_rdf_ending = unescape(encodeURIComponent(rdf_ending));
                  var utf8_xmpmeta_ending = unescape(encodeURIComponent(xmpmeta_ending));

                  var total_len = utf8_rdf_beginning.length + utf8_metadata.length + utf8_rdf_ending.length + utf8_xmpmeta_beginning.length + utf8_xmpmeta_ending.length;

                  metadata_object_number = this.internal.newObject();
                  this.internal.write('<< /Type /Metadata /Subtype /XML /Length ' + total_len + ' >>');
                  this.internal.write('stream');
                  this.internal.write(utf8_xmpmeta_beginning + utf8_rdf_beginning + utf8_metadata + utf8_rdf_ending + utf8_xmpmeta_ending);
                  this.internal.write('endstream');
                  this.internal.write('endobj');
              }
          });
          this.internal.events.subscribe('putCatalog', function () {
              if (metadata_object_number) {
                  this.internal.write('/Metadata ' + metadata_object_number + ' 0 R');
              }
          });
          return this;
      };
  })(jsPDF.API);

  /* Blob.js
   * A Blob implementation.
   * 2014-07-24
   *
   * By Eli Grey, http://eligrey.com
   * By Devin Samarin, https://github.com/dsamarin
   * License: X11/MIT
   *   See https://github.com/eligrey/Blob.js/blob/master/LICENSE.md
   */

  /*global self, unescape */
  /*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
    plusplus: true */

  /*! @source http://purl.eligrey.com/github/Blob.js/blob/master/Blob.js */

  (function (view) {
  	"use strict";

  	view.URL = view.URL || view.webkitURL;

  	if (view.Blob && view.URL) {
  		try {
  			new Blob;
  			return;
  		} catch (e) {}
  	}

  	// Internally we use a BlobBuilder implementation to base Blob off of
  	// in order to support older browsers that only have BlobBuilder
  	var BlobBuilder = view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder || (function(view) {
  		var
  			  get_class = function(object) {
  				return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
  			}
  			, FakeBlobBuilder = function BlobBuilder() {
  				this.data = [];
  			}
  			, FakeBlob = function Blob(data, type, encoding) {
  				this.data = data;
  				this.size = data.length;
  				this.type = type;
  				this.encoding = encoding;
  			}
  			, FBB_proto = FakeBlobBuilder.prototype
  			, FB_proto = FakeBlob.prototype
  			, FileReaderSync = view.FileReaderSync
  			, FileException = function(type) {
  				this.code = this[this.name = type];
  			}
  			, file_ex_codes = (
  				  "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR "
  				+ "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR"
  			).split(" ")
  			, file_ex_code = file_ex_codes.length
  			, real_URL = view.URL || view.webkitURL || view
  			, real_create_object_URL = real_URL.createObjectURL
  			, real_revoke_object_URL = real_URL.revokeObjectURL
  			, URL = real_URL
  			, btoa = view.btoa
  			, atob = view.atob

  			, ArrayBuffer = view.ArrayBuffer
  			, Uint8Array = view.Uint8Array

  			, origin = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/
  		;
  		FakeBlob.fake = FB_proto.fake = true;
  		while (file_ex_code--) {
  			FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
  		}
  		// Polyfill URL
  		if (!real_URL.createObjectURL) {
  			URL = view.URL = function(uri) {
  				var
  					  uri_info = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
  					, uri_origin
  				;
  				uri_info.href = uri;
  				if (!("origin" in uri_info)) {
  					if (uri_info.protocol.toLowerCase() === "data:") {
  						uri_info.origin = null;
  					} else {
  						uri_origin = uri.match(origin);
  						uri_info.origin = uri_origin && uri_origin[1];
  					}
  				}
  				return uri_info;
  			};
  		}
  		URL.createObjectURL = function(blob) {
  			var
  				  type = blob.type
  				, data_URI_header
  			;
  			if (type === null) {
  				type = "application/octet-stream";
  			}
  			if (blob instanceof FakeBlob) {
  				data_URI_header = "data:" + type;
  				if (blob.encoding === "base64") {
  					return data_URI_header + ";base64," + blob.data;
  				} else if (blob.encoding === "URI") {
  					return data_URI_header + "," + decodeURIComponent(blob.data);
  				} if (btoa) {
  					return data_URI_header + ";base64," + btoa(blob.data);
  				} else {
  					return data_URI_header + "," + encodeURIComponent(blob.data);
  				}
  			} else if (real_create_object_URL) {
  				return real_create_object_URL.call(real_URL, blob);
  			}
  		};
  		URL.revokeObjectURL = function(object_URL) {
  			if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
  				real_revoke_object_URL.call(real_URL, object_URL);
  			}
  		};
  		FBB_proto.append = function(data/*, endings*/) {
  			var bb = this.data;
  			// decode data to a binary string
  			if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
  				var
  					  str = ""
  					, buf = new Uint8Array(data)
  					, i = 0
  					, buf_len = buf.length
  				;
  				for (; i < buf_len; i++) {
  					str += String.fromCharCode(buf[i]);
  				}
  				bb.push(str);
  			} else if (get_class(data) === "Blob" || get_class(data) === "File") {
  				if (FileReaderSync) {
  					var fr = new FileReaderSync;
  					bb.push(fr.readAsBinaryString(data));
  				} else {
  					// async FileReader won't work as BlobBuilder is sync
  					throw new FileException("NOT_READABLE_ERR");
  				}
  			} else if (data instanceof FakeBlob) {
  				if (data.encoding === "base64" && atob) {
  					bb.push(atob(data.data));
  				} else if (data.encoding === "URI") {
  					bb.push(decodeURIComponent(data.data));
  				} else if (data.encoding === "raw") {
  					bb.push(data.data);
  				}
  			} else {
  				if (typeof data !== "string") {
  					data += ""; // convert unsupported types to strings
  				}
  				// decode UTF-16 to binary string
  				bb.push(unescape(encodeURIComponent(data)));
  			}
  		};
  		FBB_proto.getBlob = function(type) {
  			if (!arguments.length) {
  				type = null;
  			}
  			return new FakeBlob(this.data.join(""), type, "raw");
  		};
  		FBB_proto.toString = function() {
  			return "[object BlobBuilder]";
  		};
  		FB_proto.slice = function(start, end, type) {
  			var args = arguments.length;
  			if (args < 3) {
  				type = null;
  			}
  			return new FakeBlob(
  				  this.data.slice(start, args > 1 ? end : this.data.length)
  				, type
  				, this.encoding
  			);
  		};
  		FB_proto.toString = function() {
  			return "[object Blob]";
  		};
  		FB_proto.close = function() {
  			this.size = 0;
  			delete this.data;
  		};
  		return FakeBlobBuilder;
  	}(view));

  	view.Blob = function(blobParts, options) {
  		var type = options ? (options.type || "") : "";
  		var builder = new BlobBuilder();
  		if (blobParts) {
  			for (var i = 0, len = blobParts.length; i < len; i++) {
  				if (Uint8Array && blobParts[i] instanceof Uint8Array) {
  					builder.append(blobParts[i].buffer);
  				}
  				else {
  					builder.append(blobParts[i]);
  				}
  			}
  		}
  		var blob = builder.getBlob(type);
  		if (!blob.slice && blob.webkitSlice) {
  			blob.slice = blob.webkitSlice;
  		}
  		return blob;
  	};

  	var getPrototypeOf = Object.getPrototypeOf || function(object) {
  		return object.__proto__;
  	};
  	view.Blob.prototype = getPrototypeOf(new view.Blob());
  }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || undefined.content || undefined));

  /* FileSaver.js
   * A saveAs() FileSaver implementation.
   * 1.1.20151003
   *
   * By Eli Grey, http://eligrey.com
   * License: MIT
   *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
   */

  /*global self */
  /*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

  /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

  var saveAs = saveAs || (function(view) {
  	"use strict";
  	// IE <10 is explicitly unsupported
  	if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
  		return;
  	}
  	var
  		  doc = view.document
  		  // only get URL when necessary in case Blob.js hasn't overridden it yet
  		, get_URL = function() {
  			return view.URL || view.webkitURL || view;
  		}
  		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
  		, can_use_save_link = "download" in save_link
  		, click = function(node) {
  			var event = new MouseEvent("click");
  			node.dispatchEvent(event);
  		}
  		, is_safari = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent)
  		, webkit_req_fs = view.webkitRequestFileSystem
  		, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
  		, throw_outside = function(ex) {
  			(view.setImmediate || view.setTimeout)(function() {
  				throw ex;
  			}, 0);
  		}
  		, force_saveable_type = "application/octet-stream"
  		, fs_min_size = 0
  		// See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
  		// https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
  		// for the reasoning behind the timeout and revocation flow
  		, arbitrary_revoke_timeout = 500 // in ms
  		, revoke = function(file) {
  			var revoker = function() {
  				if (typeof file === "string") { // file is an object URL
  					get_URL().revokeObjectURL(file);
  				} else { // file is a File
  					file.remove();
  				}
  			};
  			if (view.chrome) {
  				revoker();
  			} else {
  				setTimeout(revoker, arbitrary_revoke_timeout);
  			}
  		}
  		, dispatch = function(filesaver, event_types, event) {
  			event_types = [].concat(event_types);
  			var i = event_types.length;
  			while (i--) {
  				var listener = filesaver["on" + event_types[i]];
  				if (typeof listener === "function") {
  					try {
  						listener.call(filesaver, event || filesaver);
  					} catch (ex) {
  						throw_outside(ex);
  					}
  				}
  			}
  		}
  		, auto_bom = function(blob) {
  			// prepend BOM for UTF-8 XML and text/* types (including HTML)
  			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
  				return new Blob(["\ufeff", blob], {type: blob.type});
  			}
  			return blob;
  		}
  		, FileSaver = function(blob, name, no_auto_bom) {
  			if (!no_auto_bom) {
  				blob = auto_bom(blob);
  			}
  			// First try a.download, then web filesystem, then object URLs
  			var
  				  filesaver = this
  				, type = blob.type
  				, blob_changed = false
  				, object_url
  				, target_view
  				, dispatch_all = function() {
  					dispatch(filesaver, "writestart progress write writeend".split(" "));
  				}
  				// on any filesys errors revert to saving with object URLs
  				, fs_error = function() {
  					if (target_view && is_safari && typeof FileReader !== "undefined") {
  						// Safari doesn't allow downloading of blob urls
  						var reader = new FileReader();
  						reader.onloadend = function() {
  							var base64Data = reader.result;
  							target_view.location.href = "data:attachment/file" + base64Data.slice(base64Data.search(/[,;]/));
  							filesaver.readyState = filesaver.DONE;
  							dispatch_all();
  						};
  						reader.readAsDataURL(blob);
  						filesaver.readyState = filesaver.INIT;
  						return;
  					}
  					// don't create more object URLs than needed
  					if (blob_changed || !object_url) {
  						object_url = get_URL().createObjectURL(blob);
  					}
  					if (target_view) {
  						target_view.location.href = object_url;
  					} else {
  						var new_tab = view.open(object_url, "_blank");
  						if (new_tab == undefined && is_safari) {
  							//Apple do not allow window.open, see http://bit.ly/1kZffRI
  							view.location.href = object_url
  						}
  					}
  					filesaver.readyState = filesaver.DONE;
  					dispatch_all();
  					revoke(object_url);
  				}
  				, abortable = function(func) {
  					return function() {
  						if (filesaver.readyState !== filesaver.DONE) {
  							return func.apply(this, arguments);
  						}
  					};
  				}
  				, create_if_not_found = {create: true, exclusive: false}
  				, slice
  			;
  			filesaver.readyState = filesaver.INIT;
  			if (!name) {
  				name = "download";
  			}
  			if (can_use_save_link) {
  				object_url = get_URL().createObjectURL(blob);
  				setTimeout(function() {
  					save_link.href = object_url;
  					save_link.download = name;
  					click(save_link);
  					dispatch_all();
  					revoke(object_url);
  					filesaver.readyState = filesaver.DONE;
  				});
  				return;
  			}
  			// Object and web filesystem URLs have a problem saving in Google Chrome when
  			// viewed in a tab, so I force save with application/octet-stream
  			// http://code.google.com/p/chromium/issues/detail?id=91158
  			// Update: Google errantly closed 91158, I submitted it again:
  			// https://code.google.com/p/chromium/issues/detail?id=389642
  			if (view.chrome && type && type !== force_saveable_type) {
  				slice = blob.slice || blob.webkitSlice;
  				blob = slice.call(blob, 0, blob.size, force_saveable_type);
  				blob_changed = true;
  			}
  			// Since I can't be sure that the guessed media type will trigger a download
  			// in WebKit, I append .download to the filename.
  			// https://bugs.webkit.org/show_bug.cgi?id=65440
  			if (webkit_req_fs && name !== "download") {
  				name += ".download";
  			}
  			if (type === force_saveable_type || webkit_req_fs) {
  				target_view = view;
  			}
  			if (!req_fs) {
  				fs_error();
  				return;
  			}
  			fs_min_size += blob.size;
  			req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
  				fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
  					var save = function() {
  						dir.getFile(name, create_if_not_found, abortable(function(file) {
  							file.createWriter(abortable(function(writer) {
  								writer.onwriteend = function(event) {
  									target_view.location.href = file.toURL();
  									filesaver.readyState = filesaver.DONE;
  									dispatch(filesaver, "writeend", event);
  									revoke(file);
  								};
  								writer.onerror = function() {
  									var error = writer.error;
  									if (error.code !== error.ABORT_ERR) {
  										fs_error();
  									}
  								};
  								"writestart progress write abort".split(" ").forEach(function(event) {
  									writer["on" + event] = filesaver["on" + event];
  								});
  								writer.write(blob);
  								filesaver.abort = function() {
  									writer.abort();
  									filesaver.readyState = filesaver.DONE;
  								};
  								filesaver.readyState = filesaver.WRITING;
  							}), fs_error);
  						}), fs_error);
  					};
  					dir.getFile(name, {create: false}, abortable(function(file) {
  						// delete file if it already exists
  						file.remove();
  						save();
  					}), abortable(function(ex) {
  						if (ex.code === ex.NOT_FOUND_ERR) {
  							save();
  						} else {
  							fs_error();
  						}
  					}));
  				}), fs_error);
  			}), fs_error);
  		}
  		, FS_proto = FileSaver.prototype
  		, saveAs = function(blob, name, no_auto_bom) {
  			return new FileSaver(blob, name, no_auto_bom);
  		}
  	;
  	// IE 10+ (native saveAs)
  	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
  		return function(blob, name, no_auto_bom) {
  			if (!no_auto_bom) {
  				blob = auto_bom(blob);
  			}
  			return navigator.msSaveOrOpenBlob(blob, name || "download");
  		};
  	}

  	FS_proto.abort = function() {
  		var filesaver = this;
  		filesaver.readyState = filesaver.DONE;
  		dispatch(filesaver, "abort");
  	};
  	FS_proto.readyState = FS_proto.INIT = 0;
  	FS_proto.WRITING = 1;
  	FS_proto.DONE = 2;

  	FS_proto.error =
  	FS_proto.onwritestart =
  	FS_proto.onprogress =
  	FS_proto.onwrite =
  	FS_proto.onabort =
  	FS_proto.onerror =
  	FS_proto.onwriteend =
  		null;

  	return saveAs;
  }(
  	   typeof self !== "undefined" && self
  	|| typeof window !== "undefined" && window
  	|| undefined.content
  ));
  // `self` is undefined in Firefox for Android content script context
  // while `this` is nsIContentFrameMessageManager
  // with an attribute `content` that corresponds to the window

  if (typeof module !== "undefined" && module.exports) {
    module.exports.saveAs = saveAs;
  } else if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
    define([], function() {
      return saveAs;
    });
  }

  /*
   * Copyright (c) 2012 chick307 <chick307@gmail.com>
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  void function(global, callback) {
  	if (typeof module === 'object') {
  		module.exports = callback();
  	} else if (typeof define === 'function') {
  		define(callback);
  	} else {
  		global.adler32cs = callback();
  	}
  }(jsPDF, function() {
  	var _hasArrayBuffer = typeof ArrayBuffer === 'function' &&
  		typeof Uint8Array === 'function';

  	var _Buffer = null, _isBuffer = (function() {
  		if (!_hasArrayBuffer)
  			return function _isBuffer() { return false };

  		try {
  			var buffer = {};
  			if (typeof buffer.Buffer === 'function')
  				_Buffer = buffer.Buffer;
  		} catch (error) {}

  		return function _isBuffer(value) {
  			return value instanceof ArrayBuffer ||
  				_Buffer !== null && value instanceof _Buffer;
  		};
  	}());

  	var _utf8ToBinary = (function() {
  		if (_Buffer !== null) {
  			return function _utf8ToBinary(utf8String) {
  				return new _Buffer(utf8String, 'utf8').toString('binary');
  			};
  		} else {
  			return function _utf8ToBinary(utf8String) {
  				return unescape(encodeURIComponent(utf8String));
  			};
  		}
  	}());

  	var MOD = 65521;

  	var _update = function _update(checksum, binaryString) {
  		var a = checksum & 0xFFFF, b = checksum >>> 16;
  		for (var i = 0, length = binaryString.length; i < length; i++) {
  			a = (a + (binaryString.charCodeAt(i) & 0xFF)) % MOD;
  			b = (b + a) % MOD;
  		}
  		return (b << 16 | a) >>> 0;
  	};

  	var _updateUint8Array = function _updateUint8Array(checksum, uint8Array) {
  		var a = checksum & 0xFFFF, b = checksum >>> 16;
  		for (var i = 0, length = uint8Array.length, x; i < length; i++) {
  			a = (a + uint8Array[i]) % MOD;
  			b = (b + a) % MOD;
  		}
  		return (b << 16 | a) >>> 0
  	};

  	var exports = {};

  	var Adler32 = exports.Adler32 = (function() {
  		var ctor = function Adler32(checksum) {
  			if (!(this instanceof ctor)) {
  				throw new TypeError(
  					'Constructor cannot called be as a function.');
  			}
  			if (!isFinite(checksum = checksum == null ? 1 : +checksum)) {
  				throw new Error(
  					'First arguments needs to be a finite number.');
  			}
  			this.checksum = checksum >>> 0;
  		};

  		var proto = ctor.prototype = {};
  		proto.constructor = ctor;

  		ctor.from = function(from) {
  			from.prototype = proto;
  			return from;
  		}(function from(binaryString) {
  			if (!(this instanceof ctor)) {
  				throw new TypeError(
  					'Constructor cannot called be as a function.');
  			}
  			if (binaryString == null)
  				throw new Error('First argument needs to be a string.');
  			this.checksum = _update(1, binaryString.toString());
  		});

  		ctor.fromUtf8 = function(fromUtf8) {
  			fromUtf8.prototype = proto;
  			return fromUtf8;
  		}(function fromUtf8(utf8String) {
  			if (!(this instanceof ctor)) {
  				throw new TypeError(
  					'Constructor cannot called be as a function.');
  			}
  			if (utf8String == null)
  				throw new Error('First argument needs to be a string.');
  			var binaryString = _utf8ToBinary(utf8String.toString());
  			this.checksum = _update(1, binaryString);
  		});

  		if (_hasArrayBuffer) {
  			ctor.fromBuffer = function(fromBuffer) {
  				fromBuffer.prototype = proto;
  				return fromBuffer;
  			}(function fromBuffer(buffer) {
  				if (!(this instanceof ctor)) {
  					throw new TypeError(
  						'Constructor cannot called be as a function.');
  				}
  				if (!_isBuffer(buffer))
  					throw new Error('First argument needs to be ArrayBuffer.');
  				var array = new Uint8Array(buffer);
  				return this.checksum = _updateUint8Array(1, array);
  			});
  		}

  		proto.update = function update(binaryString) {
  			if (binaryString == null)
  				throw new Error('First argument needs to be a string.');
  			binaryString = binaryString.toString();
  			return this.checksum = _update(this.checksum, binaryString);
  		};

  		proto.updateUtf8 = function updateUtf8(utf8String) {
  			if (utf8String == null)
  				throw new Error('First argument needs to be a string.');
  			var binaryString = _utf8ToBinary(utf8String.toString());
  			return this.checksum = _update(this.checksum, binaryString);
  		};

  		if (_hasArrayBuffer) {
  			proto.updateBuffer = function updateBuffer(buffer) {
  				if (!_isBuffer(buffer))
  					throw new Error('First argument needs to be ArrayBuffer.');
  				var array = new Uint8Array(buffer);
  				return this.checksum = _updateUint8Array(this.checksum, array);
  			};
  		}

  		proto.clone = function clone() {
  			return new Adler32(this.checksum);
  		};

  		return ctor;
  	}());

  	exports.from = function from(binaryString) {
  		if (binaryString == null)
  			throw new Error('First argument needs to be a string.');
  		return _update(1, binaryString.toString());
  	};

  	exports.fromUtf8 = function fromUtf8(utf8String) {
  		if (utf8String == null)
  			throw new Error('First argument needs to be a string.');
  		var binaryString = _utf8ToBinary(utf8String.toString());
  		return _update(1, binaryString);
  	};

  	if (_hasArrayBuffer) {
  		exports.fromBuffer = function fromBuffer(buffer) {
  			if (!_isBuffer(buffer))
  				throw new Error('First argument need to be ArrayBuffer.');
  			var array = new Uint8Array(buffer);
  			return _updateUint8Array(1, array);
  		};
  	}

  	return exports;
  });

  /**
   * CssColors
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */

  /**
   * Usage CssColors('red');
   * Returns RGB hex color with '#' prefix
   */

  var CssColors = {};
  CssColors._colorsTable = {
  	"aliceblue" : "#f0f8ff",
  	"antiquewhite" : "#faebd7",
  	"aqua" : "#00ffff",
  	"aquamarine" : "#7fffd4",
  	"azure" : "#f0ffff",
  	"beige" : "#f5f5dc",
  	"bisque" : "#ffe4c4",
  	"black" : "#000000",
  	"blanchedalmond" : "#ffebcd",
  	"blue" : "#0000ff",
  	"blueviolet" : "#8a2be2",
  	"brown" : "#a52a2a",
  	"burlywood" : "#deb887",
  	"cadetblue" : "#5f9ea0",
  	"chartreuse" : "#7fff00",
  	"chocolate" : "#d2691e",
  	"coral" : "#ff7f50",
  	"cornflowerblue" : "#6495ed",
  	"cornsilk" : "#fff8dc",
  	"crimson" : "#dc143c",
  	"cyan" : "#00ffff",
  	"darkblue" : "#00008b",
  	"darkcyan" : "#008b8b",
  	"darkgoldenrod" : "#b8860b",
  	"darkgray" : "#a9a9a9",
  	"darkgreen" : "#006400",
  	"darkkhaki" : "#bdb76b",
  	"darkmagenta" : "#8b008b",
  	"darkolivegreen" : "#556b2f",
  	"darkorange" : "#ff8c00",
  	"darkorchid" : "#9932cc",
  	"darkred" : "#8b0000",
  	"darksalmon" : "#e9967a",
  	"darkseagreen" : "#8fbc8f",
  	"darkslateblue" : "#483d8b",
  	"darkslategray" : "#2f4f4f",
  	"darkturquoise" : "#00ced1",
  	"darkviolet" : "#9400d3",
  	"deeppink" : "#ff1493",
  	"deepskyblue" : "#00bfff",
  	"dimgray" : "#696969",
  	"dodgerblue" : "#1e90ff",
  	"firebrick" : "#b22222",
  	"floralwhite" : "#fffaf0",
  	"forestgreen" : "#228b22",
  	"fuchsia" : "#ff00ff",
  	"gainsboro" : "#dcdcdc",
  	"ghostwhite" : "#f8f8ff",
  	"gold" : "#ffd700",
  	"goldenrod" : "#daa520",
  	"gray" : "#808080",
  	"green" : "#008000",
  	"greenyellow" : "#adff2f",
  	"honeydew" : "#f0fff0",
  	"hotpink" : "#ff69b4",
  	"indianred " : "#cd5c5c",
  	"indigo" : "#4b0082",
  	"ivory" : "#fffff0",
  	"khaki" : "#f0e68c",
  	"lavender" : "#e6e6fa",
  	"lavenderblush" : "#fff0f5",
  	"lawngreen" : "#7cfc00",
  	"lemonchiffon" : "#fffacd",
  	"lightblue" : "#add8e6",
  	"lightcoral" : "#f08080",
  	"lightcyan" : "#e0ffff",
  	"lightgoldenrodyellow" : "#fafad2",
  	"lightgrey" : "#d3d3d3",
  	"lightgreen" : "#90ee90",
  	"lightpink" : "#ffb6c1",
  	"lightsalmon" : "#ffa07a",
  	"lightseagreen" : "#20b2aa",
  	"lightskyblue" : "#87cefa",
  	"lightslategray" : "#778899",
  	"lightsteelblue" : "#b0c4de",
  	"lightyellow" : "#ffffe0",
  	"lime" : "#00ff00",
  	"limegreen" : "#32cd32",
  	"linen" : "#faf0e6",
  	"magenta" : "#ff00ff",
  	"maroon" : "#800000",
  	"mediumaquamarine" : "#66cdaa",
  	"mediumblue" : "#0000cd",
  	"mediumorchid" : "#ba55d3",
  	"mediumpurple" : "#9370d8",
  	"mediumseagreen" : "#3cb371",
  	"mediumslateblue" : "#7b68ee",
  	"mediumspringgreen" : "#00fa9a",
  	"mediumturquoise" : "#48d1cc",
  	"mediumvioletred" : "#c71585",
  	"midnightblue" : "#191970",
  	"mintcream" : "#f5fffa",
  	"mistyrose" : "#ffe4e1",
  	"moccasin" : "#ffe4b5",
  	"navajowhite" : "#ffdead",
  	"navy" : "#000080",
  	"oldlace" : "#fdf5e6",
  	"olive" : "#808000",
  	"olivedrab" : "#6b8e23",
  	"orange" : "#ffa500",
  	"orangered" : "#ff4500",
  	"orchid" : "#da70d6",
  	"palegoldenrod" : "#eee8aa",
  	"palegreen" : "#98fb98",
  	"paleturquoise" : "#afeeee",
  	"palevioletred" : "#d87093",
  	"papayawhip" : "#ffefd5",
  	"peachpuff" : "#ffdab9",
  	"peru" : "#cd853f",
  	"pink" : "#ffc0cb",
  	"plum" : "#dda0dd",
  	"powderblue" : "#b0e0e6",
  	"purple" : "#800080",
  	"red" : "#ff0000",
  	"rosybrown" : "#bc8f8f",
  	"royalblue" : "#4169e1",
  	"saddlebrown" : "#8b4513",
  	"salmon" : "#fa8072",
  	"sandybrown" : "#f4a460",
  	"seagreen" : "#2e8b57",
  	"seashell" : "#fff5ee",
  	"sienna" : "#a0522d",
  	"silver" : "#c0c0c0",
  	"skyblue" : "#87ceeb",
  	"slateblue" : "#6a5acd",
  	"slategray" : "#708090",
  	"snow" : "#fffafa",
  	"springgreen" : "#00ff7f",
  	"steelblue" : "#4682b4",
  	"tan" : "#d2b48c",
  	"teal" : "#008080",
  	"thistle" : "#d8bfd8",
  	"tomato" : "#ff6347",
  	"turquoise" : "#40e0d0",
  	"violet" : "#ee82ee",
  	"wheat" : "#f5deb3",
  	"white" : "#ffffff",
  	"whitesmoke" : "#f5f5f5",
  	"yellow" : "#ffff00",
  	"yellowgreen" : "#9acd32"
  };

  CssColors.colorNameToHex = function(color) {
  	color = color.toLowerCase();
  	if (typeof this._colorsTable[color] != 'undefined')
  		return this._colorsTable[color];

  	return false;
  };

  /*
   Deflate.js - https://github.com/gildas-lormeau/zip.js
   Copyright (c) 2013 Gildas Lormeau. All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright 
   notice, this list of conditions and the following disclaimer in 
   the documentation and/or other materials provided with the distribution.

   3. The names of the authors may not be used to endorse or promote products
   derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
   INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
   FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
   INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
   INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
   OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
   EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */

  /*
   * This program is based on JZlib 1.0.2 ymnk, JCraft,Inc.
   * JZlib is based on zlib-1.1.3, so all credit should go authors
   * Jean-loup Gailly(jloup@gzip.org) and Mark Adler(madler@alumni.caltech.edu)
   * and contributors of zlib.
   */

  var Deflater = (function(obj) {

  	// Global

  	var MAX_BITS = 15;
  	var D_CODES = 30;
  	var BL_CODES = 19;

  	var LENGTH_CODES = 29;
  	var LITERALS = 256;
  	var L_CODES = (LITERALS + 1 + LENGTH_CODES);
  	var HEAP_SIZE = (2 * L_CODES + 1);

  	var END_BLOCK = 256;

  	// Bit length codes must not exceed MAX_BL_BITS bits
  	var MAX_BL_BITS = 7;

  	// repeat previous bit length 3-6 times (2 bits of repeat count)
  	var REP_3_6 = 16;

  	// repeat a zero length 3-10 times (3 bits of repeat count)
  	var REPZ_3_10 = 17;

  	// repeat a zero length 11-138 times (7 bits of repeat count)
  	var REPZ_11_138 = 18;

  	// The lengths of the bit length codes are sent in order of decreasing
  	// probability, to avoid transmitting the lengths for unused bit
  	// length codes.

  	var Buf_size = 8 * 2;

  	// JZlib version : "1.0.2"
  	var Z_DEFAULT_COMPRESSION = -1;

  	// compression strategy
  	var Z_FILTERED = 1;
  	var Z_HUFFMAN_ONLY = 2;
  	var Z_DEFAULT_STRATEGY = 0;

  	var Z_NO_FLUSH = 0;
  	var Z_PARTIAL_FLUSH = 1;
  	var Z_FULL_FLUSH = 3;
  	var Z_FINISH = 4;

  	var Z_OK = 0;
  	var Z_STREAM_END = 1;
  	var Z_NEED_DICT = 2;
  	var Z_STREAM_ERROR = -2;
  	var Z_DATA_ERROR = -3;
  	var Z_BUF_ERROR = -5;

  	// Tree

  	// see definition of array dist_code below
  	var _dist_code = [ 0, 1, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
  			10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
  			12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
  			13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
  			14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
  			14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  			15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 16, 17, 18, 18, 19, 19,
  			20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
  			24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
  			26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27,
  			27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
  			28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29,
  			29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
  			29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29 ];

  	function Tree() {
  		var that = this;

  		// dyn_tree; // the dynamic tree
  		// max_code; // largest code with non zero frequency
  		// stat_desc; // the corresponding static tree

  		// Compute the optimal bit lengths for a tree and update the total bit
  		// length
  		// for the current block.
  		// IN assertion: the fields freq and dad are set, heap[heap_max] and
  		// above are the tree nodes sorted by increasing frequency.
  		// OUT assertions: the field len is set to the optimal bit length, the
  		// array bl_count contains the frequencies for each bit length.
  		// The length opt_len is updated; static_len is also updated if stree is
  		// not null.
  		function gen_bitlen(s) {
  			var tree = that.dyn_tree;
  			var stree = that.stat_desc.static_tree;
  			var extra = that.stat_desc.extra_bits;
  			var base = that.stat_desc.extra_base;
  			var max_length = that.stat_desc.max_length;
  			var h; // heap index
  			var n, m; // iterate over the tree elements
  			var bits; // bit length
  			var xbits; // extra bits
  			var f; // frequency
  			var overflow = 0; // number of elements with bit length too large

  			for (bits = 0; bits <= MAX_BITS; bits++)
  				s.bl_count[bits] = 0;

  			// In a first pass, compute the optimal bit lengths (which may
  			// overflow in the case of the bit length tree).
  			tree[s.heap[s.heap_max] * 2 + 1] = 0; // root of the heap

  			for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
  				n = s.heap[h];
  				bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
  				if (bits > max_length) {
  					bits = max_length;
  					overflow++;
  				}
  				tree[n * 2 + 1] = bits;
  				// We overwrite tree[n*2+1] which is no longer needed

  				if (n > that.max_code)
  					continue; // not a leaf node

  				s.bl_count[bits]++;
  				xbits = 0;
  				if (n >= base)
  					xbits = extra[n - base];
  				f = tree[n * 2];
  				s.opt_len += f * (bits + xbits);
  				if (stree)
  					s.static_len += f * (stree[n * 2 + 1] + xbits);
  			}
  			if (overflow === 0)
  				return;

  			// This happens for example on obj2 and pic of the Calgary corpus
  			// Find the first bit length which could increase:
  			do {
  				bits = max_length - 1;
  				while (s.bl_count[bits] === 0)
  					bits--;
  				s.bl_count[bits]--; // move one leaf down the tree
  				s.bl_count[bits + 1] += 2; // move one overflow item as its brother
  				s.bl_count[max_length]--;
  				// The brother of the overflow item also moves one step up,
  				// but this does not affect bl_count[max_length]
  				overflow -= 2;
  			} while (overflow > 0);

  			for (bits = max_length; bits !== 0; bits--) {
  				n = s.bl_count[bits];
  				while (n !== 0) {
  					m = s.heap[--h];
  					if (m > that.max_code)
  						continue;
  					if (tree[m * 2 + 1] != bits) {
  						s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
  						tree[m * 2 + 1] = bits;
  					}
  					n--;
  				}
  			}
  		}

  		// Reverse the first len bits of a code, using straightforward code (a
  		// faster
  		// method would use a table)
  		// IN assertion: 1 <= len <= 15
  		function bi_reverse(code, // the value to invert
  		len // its bit length
  		) {
  			var res = 0;
  			do {
  				res |= code & 1;
  				code >>>= 1;
  				res <<= 1;
  			} while (--len > 0);
  			return res >>> 1;
  		}

  		// Generate the codes for a given tree and bit counts (which need not be
  		// optimal).
  		// IN assertion: the array bl_count contains the bit length statistics for
  		// the given tree and the field len is set for all tree elements.
  		// OUT assertion: the field code is set for all tree elements of non
  		// zero code length.
  		function gen_codes(tree, // the tree to decorate
  		max_code, // largest code with non zero frequency
  		bl_count // number of codes at each bit length
  		) {
  			var next_code = []; // next code value for each
  			// bit length
  			var code = 0; // running code value
  			var bits; // bit index
  			var n; // code index
  			var len;

  			// The distribution counts are first used to generate the code values
  			// without bit reversal.
  			for (bits = 1; bits <= MAX_BITS; bits++) {
  				next_code[bits] = code = ((code + bl_count[bits - 1]) << 1);
  			}

  			// Check that the bit counts in bl_count are consistent. The last code
  			// must be all ones.
  			// Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  			// "inconsistent bit counts");
  			// Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  			for (n = 0; n <= max_code; n++) {
  				len = tree[n * 2 + 1];
  				if (len === 0)
  					continue;
  				// Now reverse the bits
  				tree[n * 2] = bi_reverse(next_code[len]++, len);
  			}
  		}

  		// Construct one Huffman tree and assigns the code bit strings and lengths.
  		// Update the total bit length for the current block.
  		// IN assertion: the field freq is set for all tree elements.
  		// OUT assertions: the fields len and code are set to the optimal bit length
  		// and corresponding code. The length opt_len is updated; static_len is
  		// also updated if stree is not null. The field max_code is set.
  		that.build_tree = function(s) {
  			var tree = that.dyn_tree;
  			var stree = that.stat_desc.static_tree;
  			var elems = that.stat_desc.elems;
  			var n, m; // iterate over heap elements
  			var max_code = -1; // largest code with non zero frequency
  			var node; // new node being created

  			// Construct the initial heap, with least frequent element in
  			// heap[1]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
  			// heap[0] is not used.
  			s.heap_len = 0;
  			s.heap_max = HEAP_SIZE;

  			for (n = 0; n < elems; n++) {
  				if (tree[n * 2] !== 0) {
  					s.heap[++s.heap_len] = max_code = n;
  					s.depth[n] = 0;
  				} else {
  					tree[n * 2 + 1] = 0;
  				}
  			}

  			// The pkzip format requires that at least one distance code exists,
  			// and that at least one bit should be sent even if there is only one
  			// possible code. So to avoid special checks later on we force at least
  			// two codes of non zero frequency.
  			while (s.heap_len < 2) {
  				node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
  				tree[node * 2] = 1;
  				s.depth[node] = 0;
  				s.opt_len--;
  				if (stree)
  					s.static_len -= stree[node * 2 + 1];
  				// node is 0 or 1 so it does not have extra bits
  			}
  			that.max_code = max_code;

  			// The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
  			// establish sub-heaps of increasing lengths:

  			for (n = Math.floor(s.heap_len / 2); n >= 1; n--)
  				s.pqdownheap(tree, n);

  			// Construct the Huffman tree by repeatedly combining the least two
  			// frequent nodes.

  			node = elems; // next internal node of the tree
  			do {
  				// n = node of least frequency
  				n = s.heap[1];
  				s.heap[1] = s.heap[s.heap_len--];
  				s.pqdownheap(tree, 1);
  				m = s.heap[1]; // m = node of next least frequency

  				s.heap[--s.heap_max] = n; // keep the nodes sorted by frequency
  				s.heap[--s.heap_max] = m;

  				// Create a new node father of n and m
  				tree[node * 2] = (tree[n * 2] + tree[m * 2]);
  				s.depth[node] = Math.max(s.depth[n], s.depth[m]) + 1;
  				tree[n * 2 + 1] = tree[m * 2 + 1] = node;

  				// and insert the new node in the heap
  				s.heap[1] = node++;
  				s.pqdownheap(tree, 1);
  			} while (s.heap_len >= 2);

  			s.heap[--s.heap_max] = s.heap[1];

  			// At this point, the fields freq and dad are set. We can now
  			// generate the bit lengths.

  			gen_bitlen(s);

  			// The field len is now set, we can generate the bit codes
  			gen_codes(tree, that.max_code, s.bl_count);
  		};

  	}

  	Tree._length_code = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16,
  			16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20,
  			20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
  			22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
  			24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
  			25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26,
  			26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28 ];

  	Tree.base_length = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0 ];

  	Tree.base_dist = [ 0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384,
  			24576 ];

  	// Mapping from a distance to a distance code. dist is the distance - 1 and
  	// must not have side effects. _dist_code[256] and _dist_code[257] are never
  	// used.
  	Tree.d_code = function(dist) {
  		return ((dist) < 256 ? _dist_code[dist] : _dist_code[256 + ((dist) >>> 7)]);
  	};

  	// extra bits for each length code
  	Tree.extra_lbits = [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0 ];

  	// extra bits for each distance code
  	Tree.extra_dbits = [ 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13 ];

  	// extra bits for each bit length code
  	Tree.extra_blbits = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7 ];

  	Tree.bl_order = [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];

  	// StaticTree

  	function StaticTree(static_tree, extra_bits, extra_base, elems, max_length) {
  		var that = this;
  		that.static_tree = static_tree;
  		that.extra_bits = extra_bits;
  		that.extra_base = extra_base;
  		that.elems = elems;
  		that.max_length = max_length;
  	}

  	StaticTree.static_ltree = [ 12, 8, 140, 8, 76, 8, 204, 8, 44, 8, 172, 8, 108, 8, 236, 8, 28, 8, 156, 8, 92, 8, 220, 8, 60, 8, 188, 8, 124, 8, 252, 8, 2, 8,
  			130, 8, 66, 8, 194, 8, 34, 8, 162, 8, 98, 8, 226, 8, 18, 8, 146, 8, 82, 8, 210, 8, 50, 8, 178, 8, 114, 8, 242, 8, 10, 8, 138, 8, 74, 8, 202, 8, 42,
  			8, 170, 8, 106, 8, 234, 8, 26, 8, 154, 8, 90, 8, 218, 8, 58, 8, 186, 8, 122, 8, 250, 8, 6, 8, 134, 8, 70, 8, 198, 8, 38, 8, 166, 8, 102, 8, 230, 8,
  			22, 8, 150, 8, 86, 8, 214, 8, 54, 8, 182, 8, 118, 8, 246, 8, 14, 8, 142, 8, 78, 8, 206, 8, 46, 8, 174, 8, 110, 8, 238, 8, 30, 8, 158, 8, 94, 8,
  			222, 8, 62, 8, 190, 8, 126, 8, 254, 8, 1, 8, 129, 8, 65, 8, 193, 8, 33, 8, 161, 8, 97, 8, 225, 8, 17, 8, 145, 8, 81, 8, 209, 8, 49, 8, 177, 8, 113,
  			8, 241, 8, 9, 8, 137, 8, 73, 8, 201, 8, 41, 8, 169, 8, 105, 8, 233, 8, 25, 8, 153, 8, 89, 8, 217, 8, 57, 8, 185, 8, 121, 8, 249, 8, 5, 8, 133, 8,
  			69, 8, 197, 8, 37, 8, 165, 8, 101, 8, 229, 8, 21, 8, 149, 8, 85, 8, 213, 8, 53, 8, 181, 8, 117, 8, 245, 8, 13, 8, 141, 8, 77, 8, 205, 8, 45, 8,
  			173, 8, 109, 8, 237, 8, 29, 8, 157, 8, 93, 8, 221, 8, 61, 8, 189, 8, 125, 8, 253, 8, 19, 9, 275, 9, 147, 9, 403, 9, 83, 9, 339, 9, 211, 9, 467, 9,
  			51, 9, 307, 9, 179, 9, 435, 9, 115, 9, 371, 9, 243, 9, 499, 9, 11, 9, 267, 9, 139, 9, 395, 9, 75, 9, 331, 9, 203, 9, 459, 9, 43, 9, 299, 9, 171, 9,
  			427, 9, 107, 9, 363, 9, 235, 9, 491, 9, 27, 9, 283, 9, 155, 9, 411, 9, 91, 9, 347, 9, 219, 9, 475, 9, 59, 9, 315, 9, 187, 9, 443, 9, 123, 9, 379,
  			9, 251, 9, 507, 9, 7, 9, 263, 9, 135, 9, 391, 9, 71, 9, 327, 9, 199, 9, 455, 9, 39, 9, 295, 9, 167, 9, 423, 9, 103, 9, 359, 9, 231, 9, 487, 9, 23,
  			9, 279, 9, 151, 9, 407, 9, 87, 9, 343, 9, 215, 9, 471, 9, 55, 9, 311, 9, 183, 9, 439, 9, 119, 9, 375, 9, 247, 9, 503, 9, 15, 9, 271, 9, 143, 9,
  			399, 9, 79, 9, 335, 9, 207, 9, 463, 9, 47, 9, 303, 9, 175, 9, 431, 9, 111, 9, 367, 9, 239, 9, 495, 9, 31, 9, 287, 9, 159, 9, 415, 9, 95, 9, 351, 9,
  			223, 9, 479, 9, 63, 9, 319, 9, 191, 9, 447, 9, 127, 9, 383, 9, 255, 9, 511, 9, 0, 7, 64, 7, 32, 7, 96, 7, 16, 7, 80, 7, 48, 7, 112, 7, 8, 7, 72, 7,
  			40, 7, 104, 7, 24, 7, 88, 7, 56, 7, 120, 7, 4, 7, 68, 7, 36, 7, 100, 7, 20, 7, 84, 7, 52, 7, 116, 7, 3, 8, 131, 8, 67, 8, 195, 8, 35, 8, 163, 8,
  			99, 8, 227, 8 ];

  	StaticTree.static_dtree = [ 0, 5, 16, 5, 8, 5, 24, 5, 4, 5, 20, 5, 12, 5, 28, 5, 2, 5, 18, 5, 10, 5, 26, 5, 6, 5, 22, 5, 14, 5, 30, 5, 1, 5, 17, 5, 9, 5,
  			25, 5, 5, 5, 21, 5, 13, 5, 29, 5, 3, 5, 19, 5, 11, 5, 27, 5, 7, 5, 23, 5 ];

  	StaticTree.static_l_desc = new StaticTree(StaticTree.static_ltree, Tree.extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);

  	StaticTree.static_d_desc = new StaticTree(StaticTree.static_dtree, Tree.extra_dbits, 0, D_CODES, MAX_BITS);

  	StaticTree.static_bl_desc = new StaticTree(null, Tree.extra_blbits, 0, BL_CODES, MAX_BL_BITS);

  	// Deflate

  	var MAX_MEM_LEVEL = 9;
  	var DEF_MEM_LEVEL = 8;

  	function Config(good_length, max_lazy, nice_length, max_chain, func) {
  		var that = this;
  		that.good_length = good_length;
  		that.max_lazy = max_lazy;
  		that.nice_length = nice_length;
  		that.max_chain = max_chain;
  		that.func = func;
  	}

  	var STORED = 0;
  	var FAST = 1;
  	var SLOW = 2;
  	var config_table = [ new Config(0, 0, 0, 0, STORED), new Config(4, 4, 8, 4, FAST), new Config(4, 5, 16, 8, FAST), new Config(4, 6, 32, 32, FAST),
  			new Config(4, 4, 16, 16, SLOW), new Config(8, 16, 32, 32, SLOW), new Config(8, 16, 128, 128, SLOW), new Config(8, 32, 128, 256, SLOW),
  			new Config(32, 128, 258, 1024, SLOW), new Config(32, 258, 258, 4096, SLOW) ];

  	var z_errmsg = [ "need dictionary", // Z_NEED_DICT
  	// 2
  	"stream end", // Z_STREAM_END 1
  	"", // Z_OK 0
  	"", // Z_ERRNO (-1)
  	"stream error", // Z_STREAM_ERROR (-2)
  	"data error", // Z_DATA_ERROR (-3)
  	"", // Z_MEM_ERROR (-4)
  	"buffer error", // Z_BUF_ERROR (-5)
  	"",// Z_VERSION_ERROR (-6)
  	"" ];

  	// block not completed, need more input or more output
  	var NeedMore = 0;

  	// block flush performed
  	var BlockDone = 1;

  	// finish started, need only more output at next deflate
  	var FinishStarted = 2;

  	// finish done, accept no more input or output
  	var FinishDone = 3;

  	// preset dictionary flag in zlib header
  	var PRESET_DICT = 0x20;

  	var INIT_STATE = 42;
  	var BUSY_STATE = 113;
  	var FINISH_STATE = 666;

  	// The deflate compression method
  	var Z_DEFLATED = 8;

  	var STORED_BLOCK = 0;
  	var STATIC_TREES = 1;
  	var DYN_TREES = 2;

  	var MIN_MATCH = 3;
  	var MAX_MATCH = 258;
  	var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

  	function smaller(tree, n, m, depth) {
  		var tn2 = tree[n * 2];
  		var tm2 = tree[m * 2];
  		return (tn2 < tm2 || (tn2 == tm2 && depth[n] <= depth[m]));
  	}

  	function Deflate() {

  		var that = this;
  		var strm; // pointer back to this zlib stream
  		var status; // as the name implies
  		// pending_buf; // output still pending
  		var pending_buf_size; // size of pending_buf
  		// pending_out; // next pending byte to output to the stream
  		// pending; // nb of bytes in the pending buffer
  		var method; // STORED (for zip only) or DEFLATED
  		var last_flush; // value of flush param for previous deflate call

  		var w_size; // LZ77 window size (32K by default)
  		var w_bits; // log2(w_size) (8..16)
  		var w_mask; // w_size - 1

  		var window;
  		// Sliding window. Input bytes are read into the second half of the window,
  		// and move to the first half later to keep a dictionary of at least wSize
  		// bytes. With this organization, matches are limited to a distance of
  		// wSize-MAX_MATCH bytes, but this ensures that IO is always
  		// performed with a length multiple of the block size. Also, it limits
  		// the window size to 64K, which is quite useful on MSDOS.
  		// To do: use the user input buffer as sliding window.

  		var window_size;
  		// Actual size of window: 2*wSize, except when the user input buffer
  		// is directly used as sliding window.

  		var prev;
  		// Link to older string with same hash index. To limit the size of this
  		// array to 64K, this link is maintained only for the last 32K strings.
  		// An index in this array is thus a window index modulo 32K.

  		var head; // Heads of the hash chains or NIL.

  		var ins_h; // hash index of string to be inserted
  		var hash_size; // number of elements in hash table
  		var hash_bits; // log2(hash_size)
  		var hash_mask; // hash_size-1

  		// Number of bits by which ins_h must be shifted at each input
  		// step. It must be such that after MIN_MATCH steps, the oldest
  		// byte no longer takes part in the hash key, that is:
  		// hash_shift * MIN_MATCH >= hash_bits
  		var hash_shift;

  		// Window position at the beginning of the current output block. Gets
  		// negative when the window is moved backwards.

  		var block_start;

  		var match_length; // length of best match
  		var prev_match; // previous match
  		var match_available; // set if previous match exists
  		var strstart; // start of string to insert
  		var match_start; // start of matching string
  		var lookahead; // number of valid bytes ahead in window

  		// Length of the best match at previous step. Matches not greater than this
  		// are discarded. This is used in the lazy match evaluation.
  		var prev_length;

  		// To speed up deflation, hash chains are never searched beyond this
  		// length. A higher limit improves compression ratio but degrades the speed.
  		var max_chain_length;

  		// Attempt to find a better match only when the current match is strictly
  		// smaller than this value. This mechanism is used only for compression
  		// levels >= 4.
  		var max_lazy_match;

  		// Insert new strings in the hash table only if the match length is not
  		// greater than this length. This saves time but degrades compression.
  		// max_insert_length is used only for compression levels <= 3.

  		var level; // compression level (1..9)
  		var strategy; // favor or force Huffman coding

  		// Use a faster search when the previous match is longer than this
  		var good_match;

  		// Stop searching when current match exceeds this
  		var nice_match;

  		var dyn_ltree; // literal and length tree
  		var dyn_dtree; // distance tree
  		var bl_tree; // Huffman tree for bit lengths

  		var l_desc = new Tree(); // desc for literal tree
  		var d_desc = new Tree(); // desc for distance tree
  		var bl_desc = new Tree(); // desc for bit length tree

  		// that.heap_len; // number of elements in the heap
  		// that.heap_max; // element of largest frequency
  		// The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
  		// The same heap array is used to build all trees.

  		// Depth of each subtree used as tie breaker for trees of equal frequency
  		that.depth = [];

  		var l_buf; // index for literals or lengths */

  		// Size of match buffer for literals/lengths. There are 4 reasons for
  		// limiting lit_bufsize to 64K:
  		// - frequencies can be kept in 16 bit counters
  		// - if compression is not successful for the first block, all input
  		// data is still in the window so we can still emit a stored block even
  		// when input comes from standard input. (This can also be done for
  		// all blocks if lit_bufsize is not greater than 32K.)
  		// - if compression is not successful for a file smaller than 64K, we can
  		// even emit a stored file instead of a stored block (saving 5 bytes).
  		// This is applicable only for zip (not gzip or zlib).
  		// - creating new Huffman trees less frequently may not provide fast
  		// adaptation to changes in the input data statistics. (Take for
  		// example a binary file with poorly compressible code followed by
  		// a highly compressible string table.) Smaller buffer sizes give
  		// fast adaptation but have of course the overhead of transmitting
  		// trees more frequently.
  		// - I can't count above 4
  		var lit_bufsize;

  		var last_lit; // running index in l_buf

  		// Buffer for distances. To simplify the code, d_buf and l_buf have
  		// the same number of elements. To use different lengths, an extra flag
  		// array would be necessary.

  		var d_buf; // index of pendig_buf

  		// that.opt_len; // bit length of current block with optimal trees
  		// that.static_len; // bit length of current block with static trees
  		var matches; // number of string matches in current block
  		var last_eob_len; // bit length of EOB code for last block

  		// Output buffer. bits are inserted starting at the bottom (least
  		// significant bits).
  		var bi_buf;

  		// Number of valid bits in bi_buf. All bits above the last valid bit
  		// are always zero.
  		var bi_valid;

  		// number of codes at each bit length for an optimal tree
  		that.bl_count = [];

  		// heap used to build the Huffman trees
  		that.heap = [];

  		dyn_ltree = [];
  		dyn_dtree = [];
  		bl_tree = [];

  		function lm_init() {
  			var i;
  			window_size = 2 * w_size;

  			head[hash_size - 1] = 0;
  			for (i = 0; i < hash_size - 1; i++) {
  				head[i] = 0;
  			}

  			// Set the default configuration parameters:
  			max_lazy_match = config_table[level].max_lazy;
  			good_match = config_table[level].good_length;
  			nice_match = config_table[level].nice_length;
  			max_chain_length = config_table[level].max_chain;

  			strstart = 0;
  			block_start = 0;
  			lookahead = 0;
  			match_length = prev_length = MIN_MATCH - 1;
  			match_available = 0;
  			ins_h = 0;
  		}

  		function init_block() {
  			var i;
  			// Initialize the trees.
  			for (i = 0; i < L_CODES; i++)
  				dyn_ltree[i * 2] = 0;
  			for (i = 0; i < D_CODES; i++)
  				dyn_dtree[i * 2] = 0;
  			for (i = 0; i < BL_CODES; i++)
  				bl_tree[i * 2] = 0;

  			dyn_ltree[END_BLOCK * 2] = 1;
  			that.opt_len = that.static_len = 0;
  			last_lit = matches = 0;
  		}

  		// Initialize the tree data structures for a new zlib stream.
  		function tr_init() {

  			l_desc.dyn_tree = dyn_ltree;
  			l_desc.stat_desc = StaticTree.static_l_desc;

  			d_desc.dyn_tree = dyn_dtree;
  			d_desc.stat_desc = StaticTree.static_d_desc;

  			bl_desc.dyn_tree = bl_tree;
  			bl_desc.stat_desc = StaticTree.static_bl_desc;

  			bi_buf = 0;
  			bi_valid = 0;
  			last_eob_len = 8; // enough lookahead for inflate

  			// Initialize the first block of the first file:
  			init_block();
  		}

  		// Restore the heap property by moving down the tree starting at node k,
  		// exchanging a node with the smallest of its two sons if necessary,
  		// stopping
  		// when the heap property is re-established (each father smaller than its
  		// two sons).
  		that.pqdownheap = function(tree, // the tree to restore
  		k // node to move down
  		) {
  			var heap = that.heap;
  			var v = heap[k];
  			var j = k << 1; // left son of k
  			while (j <= that.heap_len) {
  				// Set j to the smallest of the two sons:
  				if (j < that.heap_len && smaller(tree, heap[j + 1], heap[j], that.depth)) {
  					j++;
  				}
  				// Exit if v is smaller than both sons
  				if (smaller(tree, v, heap[j], that.depth))
  					break;

  				// Exchange v with the smallest son
  				heap[k] = heap[j];
  				k = j;
  				// And continue down the tree, setting j to the left son of k
  				j <<= 1;
  			}
  			heap[k] = v;
  		};

  		// Scan a literal or distance tree to determine the frequencies of the codes
  		// in the bit length tree.
  		function scan_tree(tree,// the tree to be scanned
  		max_code // and its largest code of non zero frequency
  		) {
  			var n; // iterates over all tree elements
  			var prevlen = -1; // last emitted length
  			var curlen; // length of current code
  			var nextlen = tree[0 * 2 + 1]; // length of next code
  			var count = 0; // repeat count of the current code
  			var max_count = 7; // max repeat count
  			var min_count = 4; // min repeat count

  			if (nextlen === 0) {
  				max_count = 138;
  				min_count = 3;
  			}
  			tree[(max_code + 1) * 2 + 1] = 0xffff; // guard

  			for (n = 0; n <= max_code; n++) {
  				curlen = nextlen;
  				nextlen = tree[(n + 1) * 2 + 1];
  				if (++count < max_count && curlen == nextlen) {
  					continue;
  				} else if (count < min_count) {
  					bl_tree[curlen * 2] += count;
  				} else if (curlen !== 0) {
  					if (curlen != prevlen)
  						bl_tree[curlen * 2]++;
  					bl_tree[REP_3_6 * 2]++;
  				} else if (count <= 10) {
  					bl_tree[REPZ_3_10 * 2]++;
  				} else {
  					bl_tree[REPZ_11_138 * 2]++;
  				}
  				count = 0;
  				prevlen = curlen;
  				if (nextlen === 0) {
  					max_count = 138;
  					min_count = 3;
  				} else if (curlen == nextlen) {
  					max_count = 6;
  					min_count = 3;
  				} else {
  					max_count = 7;
  					min_count = 4;
  				}
  			}
  		}

  		// Construct the Huffman tree for the bit lengths and return the index in
  		// bl_order of the last bit length code to send.
  		function build_bl_tree() {
  			var max_blindex; // index of last bit length code of non zero freq

  			// Determine the bit length frequencies for literal and distance trees
  			scan_tree(dyn_ltree, l_desc.max_code);
  			scan_tree(dyn_dtree, d_desc.max_code);

  			// Build the bit length tree:
  			bl_desc.build_tree(that);
  			// opt_len now includes the length of the tree representations, except
  			// the lengths of the bit lengths codes and the 5+5+4 bits for the
  			// counts.

  			// Determine the number of bit length codes to send. The pkzip format
  			// requires that at least 4 bit length codes be sent. (appnote.txt says
  			// 3 but the actual value used is 4.)
  			for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
  				if (bl_tree[Tree.bl_order[max_blindex] * 2 + 1] !== 0)
  					break;
  			}
  			// Update opt_len to include the bit length tree and counts
  			that.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;

  			return max_blindex;
  		}

  		// Output a byte on the stream.
  		// IN assertion: there is enough room in pending_buf.
  		function put_byte(p) {
  			that.pending_buf[that.pending++] = p;
  		}

  		function put_short(w) {
  			put_byte(w & 0xff);
  			put_byte((w >>> 8) & 0xff);
  		}

  		function putShortMSB(b) {
  			put_byte((b >> 8) & 0xff);
  			put_byte((b & 0xff) & 0xff);
  		}

  		function send_bits(value, length) {
  			var val, len = length;
  			if (bi_valid > Buf_size - len) {
  				val = value;
  				// bi_buf |= (val << bi_valid);
  				bi_buf |= ((val << bi_valid) & 0xffff);
  				put_short(bi_buf);
  				bi_buf = val >>> (Buf_size - bi_valid);
  				bi_valid += len - Buf_size;
  			} else {
  				// bi_buf |= (value) << bi_valid;
  				bi_buf |= (((value) << bi_valid) & 0xffff);
  				bi_valid += len;
  			}
  		}

  		function send_code(c, tree) {
  			var c2 = c * 2;
  			send_bits(tree[c2] & 0xffff, tree[c2 + 1] & 0xffff);
  		}

  		// Send a literal or distance tree in compressed form, using the codes in
  		// bl_tree.
  		function send_tree(tree,// the tree to be sent
  		max_code // and its largest code of non zero frequency
  		) {
  			var n; // iterates over all tree elements
  			var prevlen = -1; // last emitted length
  			var curlen; // length of current code
  			var nextlen = tree[0 * 2 + 1]; // length of next code
  			var count = 0; // repeat count of the current code
  			var max_count = 7; // max repeat count
  			var min_count = 4; // min repeat count

  			if (nextlen === 0) {
  				max_count = 138;
  				min_count = 3;
  			}

  			for (n = 0; n <= max_code; n++) {
  				curlen = nextlen;
  				nextlen = tree[(n + 1) * 2 + 1];
  				if (++count < max_count && curlen == nextlen) {
  					continue;
  				} else if (count < min_count) {
  					do {
  						send_code(curlen, bl_tree);
  					} while (--count !== 0);
  				} else if (curlen !== 0) {
  					if (curlen != prevlen) {
  						send_code(curlen, bl_tree);
  						count--;
  					}
  					send_code(REP_3_6, bl_tree);
  					send_bits(count - 3, 2);
  				} else if (count <= 10) {
  					send_code(REPZ_3_10, bl_tree);
  					send_bits(count - 3, 3);
  				} else {
  					send_code(REPZ_11_138, bl_tree);
  					send_bits(count - 11, 7);
  				}
  				count = 0;
  				prevlen = curlen;
  				if (nextlen === 0) {
  					max_count = 138;
  					min_count = 3;
  				} else if (curlen == nextlen) {
  					max_count = 6;
  					min_count = 3;
  				} else {
  					max_count = 7;
  					min_count = 4;
  				}
  			}
  		}

  		// Send the header for a block using dynamic Huffman trees: the counts, the
  		// lengths of the bit length codes, the literal tree and the distance tree.
  		// IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
  		function send_all_trees(lcodes, dcodes, blcodes) {
  			var rank; // index in bl_order

  			send_bits(lcodes - 257, 5); // not +255 as stated in appnote.txt
  			send_bits(dcodes - 1, 5);
  			send_bits(blcodes - 4, 4); // not -3 as stated in appnote.txt
  			for (rank = 0; rank < blcodes; rank++) {
  				send_bits(bl_tree[Tree.bl_order[rank] * 2 + 1], 3);
  			}
  			send_tree(dyn_ltree, lcodes - 1); // literal tree
  			send_tree(dyn_dtree, dcodes - 1); // distance tree
  		}

  		// Flush the bit buffer, keeping at most 7 bits in it.
  		function bi_flush() {
  			if (bi_valid == 16) {
  				put_short(bi_buf);
  				bi_buf = 0;
  				bi_valid = 0;
  			} else if (bi_valid >= 8) {
  				put_byte(bi_buf & 0xff);
  				bi_buf >>>= 8;
  				bi_valid -= 8;
  			}
  		}

  		// Send one empty static block to give enough lookahead for inflate.
  		// This takes 10 bits, of which 7 may remain in the bit buffer.
  		// The current inflate code requires 9 bits of lookahead. If the
  		// last two codes for the previous block (real code plus EOB) were coded
  		// on 5 bits or less, inflate may have only 5+3 bits of lookahead to decode
  		// the last real code. In this case we send two empty static blocks instead
  		// of one. (There are no problems if the previous block is stored or fixed.)
  		// To simplify the code, we assume the worst case of last real code encoded
  		// on one bit only.
  		function _tr_align() {
  			send_bits(STATIC_TREES << 1, 3);
  			send_code(END_BLOCK, StaticTree.static_ltree);

  			bi_flush();

  			// Of the 10 bits for the empty block, we have already sent
  			// (10 - bi_valid) bits. The lookahead for the last real code (before
  			// the EOB of the previous block) was thus at least one plus the length
  			// of the EOB plus what we have just sent of the empty static block.
  			if (1 + last_eob_len + 10 - bi_valid < 9) {
  				send_bits(STATIC_TREES << 1, 3);
  				send_code(END_BLOCK, StaticTree.static_ltree);
  				bi_flush();
  			}
  			last_eob_len = 7;
  		}

  		// Save the match info and tally the frequency counts. Return true if
  		// the current block must be flushed.
  		function _tr_tally(dist, // distance of matched string
  		lc // match length-MIN_MATCH or unmatched char (if dist==0)
  		) {
  			var out_length, in_length, dcode;
  			that.pending_buf[d_buf + last_lit * 2] = (dist >>> 8) & 0xff;
  			that.pending_buf[d_buf + last_lit * 2 + 1] = dist & 0xff;

  			that.pending_buf[l_buf + last_lit] = lc & 0xff;
  			last_lit++;

  			if (dist === 0) {
  				// lc is the unmatched char
  				dyn_ltree[lc * 2]++;
  			} else {
  				matches++;
  				// Here, lc is the match length - MIN_MATCH
  				dist--; // dist = match distance - 1
  				dyn_ltree[(Tree._length_code[lc] + LITERALS + 1) * 2]++;
  				dyn_dtree[Tree.d_code(dist) * 2]++;
  			}

  			if ((last_lit & 0x1fff) === 0 && level > 2) {
  				// Compute an upper bound for the compressed length
  				out_length = last_lit * 8;
  				in_length = strstart - block_start;
  				for (dcode = 0; dcode < D_CODES; dcode++) {
  					out_length += dyn_dtree[dcode * 2] * (5 + Tree.extra_dbits[dcode]);
  				}
  				out_length >>>= 3;
  				if ((matches < Math.floor(last_lit / 2)) && out_length < Math.floor(in_length / 2))
  					return true;
  			}

  			return (last_lit == lit_bufsize - 1);
  			// We avoid equality with lit_bufsize because of wraparound at 64K
  			// on 16 bit machines and because stored blocks are restricted to
  			// 64K-1 bytes.
  		}

  		// Send the block data compressed using the given Huffman trees
  		function compress_block(ltree, dtree) {
  			var dist; // distance of matched string
  			var lc; // match length or unmatched char (if dist === 0)
  			var lx = 0; // running index in l_buf
  			var code; // the code to send
  			var extra; // number of extra bits to send

  			if (last_lit !== 0) {
  				do {
  					dist = ((that.pending_buf[d_buf + lx * 2] << 8) & 0xff00) | (that.pending_buf[d_buf + lx * 2 + 1] & 0xff);
  					lc = (that.pending_buf[l_buf + lx]) & 0xff;
  					lx++;

  					if (dist === 0) {
  						send_code(lc, ltree); // send a literal byte
  					} else {
  						// Here, lc is the match length - MIN_MATCH
  						code = Tree._length_code[lc];

  						send_code(code + LITERALS + 1, ltree); // send the length
  						// code
  						extra = Tree.extra_lbits[code];
  						if (extra !== 0) {
  							lc -= Tree.base_length[code];
  							send_bits(lc, extra); // send the extra length bits
  						}
  						dist--; // dist is now the match distance - 1
  						code = Tree.d_code(dist);

  						send_code(code, dtree); // send the distance code
  						extra = Tree.extra_dbits[code];
  						if (extra !== 0) {
  							dist -= Tree.base_dist[code];
  							send_bits(dist, extra); // send the extra distance bits
  						}
  					} // literal or match pair ?

  					// Check that the overlay between pending_buf and d_buf+l_buf is
  					// ok:
  				} while (lx < last_lit);
  			}

  			send_code(END_BLOCK, ltree);
  			last_eob_len = ltree[END_BLOCK * 2 + 1];
  		}

  		// Flush the bit buffer and align the output on a byte boundary
  		function bi_windup() {
  			if (bi_valid > 8) {
  				put_short(bi_buf);
  			} else if (bi_valid > 0) {
  				put_byte(bi_buf & 0xff);
  			}
  			bi_buf = 0;
  			bi_valid = 0;
  		}

  		// Copy a stored block, storing first the length and its
  		// one's complement if requested.
  		function copy_block(buf, // the input data
  		len, // its length
  		header // true if block header must be written
  		) {
  			bi_windup(); // align on byte boundary
  			last_eob_len = 8; // enough lookahead for inflate

  			if (header) {
  				put_short(len);
  				put_short(~len);
  			}

  			that.pending_buf.set(window.subarray(buf, buf + len), that.pending);
  			that.pending += len;
  		}

  		// Send a stored block
  		function _tr_stored_block(buf, // input block
  		stored_len, // length of input block
  		eof // true if this is the last block for a file
  		) {
  			send_bits((STORED_BLOCK << 1) + (eof ? 1 : 0), 3); // send block type
  			copy_block(buf, stored_len, true); // with header
  		}

  		// Determine the best encoding for the current block: dynamic trees, static
  		// trees or store, and output the encoded block to the zip file.
  		function _tr_flush_block(buf, // input block, or NULL if too old
  		stored_len, // length of input block
  		eof // true if this is the last block for a file
  		) {
  			var opt_lenb, static_lenb;// opt_len and static_len in bytes
  			var max_blindex = 0; // index of last bit length code of non zero freq

  			// Build the Huffman trees unless a stored block is forced
  			if (level > 0) {
  				// Construct the literal and distance trees
  				l_desc.build_tree(that);

  				d_desc.build_tree(that);

  				// At this point, opt_len and static_len are the total bit lengths
  				// of
  				// the compressed block data, excluding the tree representations.

  				// Build the bit length tree for the above two trees, and get the
  				// index
  				// in bl_order of the last bit length code to send.
  				max_blindex = build_bl_tree();

  				// Determine the best encoding. Compute first the block length in
  				// bytes
  				opt_lenb = (that.opt_len + 3 + 7) >>> 3;
  				static_lenb = (that.static_len + 3 + 7) >>> 3;

  				if (static_lenb <= opt_lenb)
  					opt_lenb = static_lenb;
  			} else {
  				opt_lenb = static_lenb = stored_len + 5; // force a stored block
  			}

  			if ((stored_len + 4 <= opt_lenb) && buf != -1) {
  				// 4: two words for the lengths
  				// The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
  				// Otherwise we can't have processed more than WSIZE input bytes
  				// since
  				// the last block flush, because compression would have been
  				// successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
  				// transform a block into a stored block.
  				_tr_stored_block(buf, stored_len, eof);
  			} else if (static_lenb == opt_lenb) {
  				send_bits((STATIC_TREES << 1) + (eof ? 1 : 0), 3);
  				compress_block(StaticTree.static_ltree, StaticTree.static_dtree);
  			} else {
  				send_bits((DYN_TREES << 1) + (eof ? 1 : 0), 3);
  				send_all_trees(l_desc.max_code + 1, d_desc.max_code + 1, max_blindex + 1);
  				compress_block(dyn_ltree, dyn_dtree);
  			}

  			// The above check is made mod 2^32, for files larger than 512 MB
  			// and uLong implemented on 32 bits.

  			init_block();

  			if (eof) {
  				bi_windup();
  			}
  		}

  		function flush_block_only(eof) {
  			_tr_flush_block(block_start >= 0 ? block_start : -1, strstart - block_start, eof);
  			block_start = strstart;
  			strm.flush_pending();
  		}

  		// Fill the window when the lookahead becomes insufficient.
  		// Updates strstart and lookahead.
  		//
  		// IN assertion: lookahead < MIN_LOOKAHEAD
  		// OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
  		// At least one byte has been read, or avail_in === 0; reads are
  		// performed for at least two bytes (required for the zip translate_eol
  		// option -- not supported here).
  		function fill_window() {
  			var n, m;
  			var p;
  			var more; // Amount of free space at the end of the window.

  			do {
  				more = (window_size - lookahead - strstart);

  				// Deal with !@#$% 64K limit:
  				if (more === 0 && strstart === 0 && lookahead === 0) {
  					more = w_size;
  				} else if (more == -1) {
  					// Very unlikely, but possible on 16 bit machine if strstart ==
  					// 0
  					// and lookahead == 1 (input done one byte at time)
  					more--;

  					// If the window is almost full and there is insufficient
  					// lookahead,
  					// move the upper half to the lower one to make room in the
  					// upper half.
  				} else if (strstart >= w_size + w_size - MIN_LOOKAHEAD) {
  					window.set(window.subarray(w_size, w_size + w_size), 0);

  					match_start -= w_size;
  					strstart -= w_size; // we now have strstart >= MAX_DIST
  					block_start -= w_size;

  					// Slide the hash table (could be avoided with 32 bit values
  					// at the expense of memory usage). We slide even when level ==
  					// 0
  					// to keep the hash table consistent if we switch back to level
  					// > 0
  					// later. (Using level 0 permanently is not an optimal usage of
  					// zlib, so we don't care about this pathological case.)

  					n = hash_size;
  					p = n;
  					do {
  						m = (head[--p] & 0xffff);
  						head[p] = (m >= w_size ? m - w_size : 0);
  					} while (--n !== 0);

  					n = w_size;
  					p = n;
  					do {
  						m = (prev[--p] & 0xffff);
  						prev[p] = (m >= w_size ? m - w_size : 0);
  						// If n is not on any hash chain, prev[n] is garbage but
  						// its value will never be used.
  					} while (--n !== 0);
  					more += w_size;
  				}

  				if (strm.avail_in === 0)
  					return;

  				// If there was no sliding:
  				// strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
  				// more == window_size - lookahead - strstart
  				// => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
  				// => more >= window_size - 2*WSIZE + 2
  				// In the BIG_MEM or MMAP case (not yet supported),
  				// window_size == input_size + MIN_LOOKAHEAD &&
  				// strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
  				// Otherwise, window_size == 2*WSIZE so more >= 2.
  				// If there was sliding, more >= WSIZE. So in all cases, more >= 2.

  				n = strm.read_buf(window, strstart + lookahead, more);
  				lookahead += n;

  				// Initialize the hash value now that we have some input:
  				if (lookahead >= MIN_MATCH) {
  					ins_h = window[strstart] & 0xff;
  					ins_h = (((ins_h) << hash_shift) ^ (window[strstart + 1] & 0xff)) & hash_mask;
  				}
  				// If the whole input has less than MIN_MATCH bytes, ins_h is
  				// garbage,
  				// but this is not important since only literal bytes will be
  				// emitted.
  			} while (lookahead < MIN_LOOKAHEAD && strm.avail_in !== 0);
  		}

  		// Copy without compression as much as possible from the input stream,
  		// return
  		// the current block state.
  		// This function does not insert new strings in the dictionary since
  		// uncompressible data is probably not useful. This function is used
  		// only for the level=0 compression option.
  		// NOTE: this function should be optimized to avoid extra copying from
  		// window to pending_buf.
  		function deflate_stored(flush) {
  			// Stored blocks are limited to 0xffff bytes, pending_buf is limited
  			// to pending_buf_size, and each stored block has a 5 byte header:

  			var max_block_size = 0xffff;
  			var max_start;

  			if (max_block_size > pending_buf_size - 5) {
  				max_block_size = pending_buf_size - 5;
  			}

  			// Copy as much as possible from input to output:
  			while (true) {
  				// Fill the window as much as possible:
  				if (lookahead <= 1) {
  					fill_window();
  					if (lookahead === 0 && flush == Z_NO_FLUSH)
  						return NeedMore;
  					if (lookahead === 0)
  						break; // flush the current block
  				}

  				strstart += lookahead;
  				lookahead = 0;

  				// Emit a stored block if pending_buf will be full:
  				max_start = block_start + max_block_size;
  				if (strstart === 0 || strstart >= max_start) {
  					// strstart === 0 is possible when wraparound on 16-bit machine
  					lookahead = (strstart - max_start);
  					strstart = max_start;

  					flush_block_only(false);
  					if (strm.avail_out === 0)
  						return NeedMore;

  				}

  				// Flush if we may have to slide, otherwise block_start may become
  				// negative and the data will be gone:
  				if (strstart - block_start >= w_size - MIN_LOOKAHEAD) {
  					flush_block_only(false);
  					if (strm.avail_out === 0)
  						return NeedMore;
  				}
  			}

  			flush_block_only(flush == Z_FINISH);
  			if (strm.avail_out === 0)
  				return (flush == Z_FINISH) ? FinishStarted : NeedMore;

  			return flush == Z_FINISH ? FinishDone : BlockDone;
  		}

  		function longest_match(cur_match) {
  			var chain_length = max_chain_length; // max hash chain length
  			var scan = strstart; // current string
  			var match; // matched string
  			var len; // length of current match
  			var best_len = prev_length; // best match length so far
  			var limit = strstart > (w_size - MIN_LOOKAHEAD) ? strstart - (w_size - MIN_LOOKAHEAD) : 0;
  			var _nice_match = nice_match;

  			// Stop when cur_match becomes <= limit. To simplify the code,
  			// we prevent matches with the string of window index 0.

  			var wmask = w_mask;

  			var strend = strstart + MAX_MATCH;
  			var scan_end1 = window[scan + best_len - 1];
  			var scan_end = window[scan + best_len];

  			// The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of
  			// 16.
  			// It is easy to get rid of this optimization if necessary.

  			// Do not waste too much time if we already have a good match:
  			if (prev_length >= good_match) {
  				chain_length >>= 2;
  			}

  			// Do not look for matches beyond the end of the input. This is
  			// necessary
  			// to make deflate deterministic.
  			if (_nice_match > lookahead)
  				_nice_match = lookahead;

  			do {
  				match = cur_match;

  				// Skip to next match if the match length cannot increase
  				// or if the match length is less than 2:
  				if (window[match + best_len] != scan_end || window[match + best_len - 1] != scan_end1 || window[match] != window[scan]
  						|| window[++match] != window[scan + 1])
  					continue;

  				// The check at best_len-1 can be removed because it will be made
  				// again later. (This heuristic is not always a win.)
  				// It is not necessary to compare scan[2] and match[2] since they
  				// are always equal when the other bytes match, given that
  				// the hash keys are equal and that HASH_BITS >= 8.
  				scan += 2;
  				match++;

  				// We check for insufficient lookahead only every 8th comparison;
  				// the 256th check will be made at strstart+258.
  				do {
  				} while (window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match]
  						&& window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match]
  						&& window[++scan] == window[++match] && window[++scan] == window[++match] && scan < strend);

  				len = MAX_MATCH - (strend - scan);
  				scan = strend - MAX_MATCH;

  				if (len > best_len) {
  					match_start = cur_match;
  					best_len = len;
  					if (len >= _nice_match)
  						break;
  					scan_end1 = window[scan + best_len - 1];
  					scan_end = window[scan + best_len];
  				}

  			} while ((cur_match = (prev[cur_match & wmask] & 0xffff)) > limit && --chain_length !== 0);

  			if (best_len <= lookahead)
  				return best_len;
  			return lookahead;
  		}

  		// Compress as much as possible from the input stream, return the current
  		// block state.
  		// This function does not perform lazy evaluation of matches and inserts
  		// new strings in the dictionary only for unmatched strings or for short
  		// matches. It is used only for the fast compression options.
  		function deflate_fast(flush) {
  			// short hash_head = 0; // head of the hash chain
  			var hash_head = 0; // head of the hash chain
  			var bflush; // set if current block must be flushed

  			while (true) {
  				// Make sure that we always have enough lookahead, except
  				// at the end of the input file. We need MAX_MATCH bytes
  				// for the next match, plus MIN_MATCH bytes to insert the
  				// string following the next match.
  				if (lookahead < MIN_LOOKAHEAD) {
  					fill_window();
  					if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
  						return NeedMore;
  					}
  					if (lookahead === 0)
  						break; // flush the current block
  				}

  				// Insert the string window[strstart .. strstart+2] in the
  				// dictionary, and set hash_head to the head of the hash chain:
  				if (lookahead >= MIN_MATCH) {
  					ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;

  					// prev[strstart&w_mask]=hash_head=head[ins_h];
  					hash_head = (head[ins_h] & 0xffff);
  					prev[strstart & w_mask] = head[ins_h];
  					head[ins_h] = strstart;
  				}

  				// Find the longest match, discarding those <= prev_length.
  				// At this point we have always match_length < MIN_MATCH

  				if (hash_head !== 0 && ((strstart - hash_head) & 0xffff) <= w_size - MIN_LOOKAHEAD) {
  					// To simplify the code, we prevent matches with the string
  					// of window index 0 (in particular we have to avoid a match
  					// of the string with itself at the start of the input file).
  					if (strategy != Z_HUFFMAN_ONLY) {
  						match_length = longest_match(hash_head);
  					}
  					// longest_match() sets match_start
  				}
  				if (match_length >= MIN_MATCH) {
  					// check_match(strstart, match_start, match_length);

  					bflush = _tr_tally(strstart - match_start, match_length - MIN_MATCH);

  					lookahead -= match_length;

  					// Insert new strings in the hash table only if the match length
  					// is not too large. This saves time but degrades compression.
  					if (match_length <= max_lazy_match && lookahead >= MIN_MATCH) {
  						match_length--; // string at strstart already in hash table
  						do {
  							strstart++;

  							ins_h = ((ins_h << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
  							// prev[strstart&w_mask]=hash_head=head[ins_h];
  							hash_head = (head[ins_h] & 0xffff);
  							prev[strstart & w_mask] = head[ins_h];
  							head[ins_h] = strstart;

  							// strstart never exceeds WSIZE-MAX_MATCH, so there are
  							// always MIN_MATCH bytes ahead.
  						} while (--match_length !== 0);
  						strstart++;
  					} else {
  						strstart += match_length;
  						match_length = 0;
  						ins_h = window[strstart] & 0xff;

  						ins_h = (((ins_h) << hash_shift) ^ (window[strstart + 1] & 0xff)) & hash_mask;
  						// If lookahead < MIN_MATCH, ins_h is garbage, but it does
  						// not
  						// matter since it will be recomputed at next deflate call.
  					}
  				} else {
  					// No match, output a literal byte

  					bflush = _tr_tally(0, window[strstart] & 0xff);
  					lookahead--;
  					strstart++;
  				}
  				if (bflush) {

  					flush_block_only(false);
  					if (strm.avail_out === 0)
  						return NeedMore;
  				}
  			}

  			flush_block_only(flush == Z_FINISH);
  			if (strm.avail_out === 0) {
  				if (flush == Z_FINISH)
  					return FinishStarted;
  				else
  					return NeedMore;
  			}
  			return flush == Z_FINISH ? FinishDone : BlockDone;
  		}

  		// Same as above, but achieves better compression. We use a lazy
  		// evaluation for matches: a match is finally adopted only if there is
  		// no better match at the next window position.
  		function deflate_slow(flush) {
  			// short hash_head = 0; // head of hash chain
  			var hash_head = 0; // head of hash chain
  			var bflush; // set if current block must be flushed
  			var max_insert;

  			// Process the input block.
  			while (true) {
  				// Make sure that we always have enough lookahead, except
  				// at the end of the input file. We need MAX_MATCH bytes
  				// for the next match, plus MIN_MATCH bytes to insert the
  				// string following the next match.

  				if (lookahead < MIN_LOOKAHEAD) {
  					fill_window();
  					if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
  						return NeedMore;
  					}
  					if (lookahead === 0)
  						break; // flush the current block
  				}

  				// Insert the string window[strstart .. strstart+2] in the
  				// dictionary, and set hash_head to the head of the hash chain:

  				if (lookahead >= MIN_MATCH) {
  					ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
  					// prev[strstart&w_mask]=hash_head=head[ins_h];
  					hash_head = (head[ins_h] & 0xffff);
  					prev[strstart & w_mask] = head[ins_h];
  					head[ins_h] = strstart;
  				}

  				// Find the longest match, discarding those <= prev_length.
  				prev_length = match_length;
  				prev_match = match_start;
  				match_length = MIN_MATCH - 1;

  				if (hash_head !== 0 && prev_length < max_lazy_match && ((strstart - hash_head) & 0xffff) <= w_size - MIN_LOOKAHEAD) {
  					// To simplify the code, we prevent matches with the string
  					// of window index 0 (in particular we have to avoid a match
  					// of the string with itself at the start of the input file).

  					if (strategy != Z_HUFFMAN_ONLY) {
  						match_length = longest_match(hash_head);
  					}
  					// longest_match() sets match_start

  					if (match_length <= 5 && (strategy == Z_FILTERED || (match_length == MIN_MATCH && strstart - match_start > 4096))) {

  						// If prev_match is also MIN_MATCH, match_start is garbage
  						// but we will ignore the current match anyway.
  						match_length = MIN_MATCH - 1;
  					}
  				}

  				// If there was a match at the previous step and the current
  				// match is not better, output the previous match:
  				if (prev_length >= MIN_MATCH && match_length <= prev_length) {
  					max_insert = strstart + lookahead - MIN_MATCH;
  					// Do not insert strings in hash table beyond this.

  					// check_match(strstart-1, prev_match, prev_length);

  					bflush = _tr_tally(strstart - 1 - prev_match, prev_length - MIN_MATCH);

  					// Insert in hash table all strings up to the end of the match.
  					// strstart-1 and strstart are already inserted. If there is not
  					// enough lookahead, the last two strings are not inserted in
  					// the hash table.
  					lookahead -= prev_length - 1;
  					prev_length -= 2;
  					do {
  						if (++strstart <= max_insert) {
  							ins_h = (((ins_h) << hash_shift) ^ (window[(strstart) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
  							// prev[strstart&w_mask]=hash_head=head[ins_h];
  							hash_head = (head[ins_h] & 0xffff);
  							prev[strstart & w_mask] = head[ins_h];
  							head[ins_h] = strstart;
  						}
  					} while (--prev_length !== 0);
  					match_available = 0;
  					match_length = MIN_MATCH - 1;
  					strstart++;

  					if (bflush) {
  						flush_block_only(false);
  						if (strm.avail_out === 0)
  							return NeedMore;
  					}
  				} else if (match_available !== 0) {

  					// If there was no match at the previous position, output a
  					// single literal. If there was a match but the current match
  					// is longer, truncate the previous match to a single literal.

  					bflush = _tr_tally(0, window[strstart - 1] & 0xff);

  					if (bflush) {
  						flush_block_only(false);
  					}
  					strstart++;
  					lookahead--;
  					if (strm.avail_out === 0)
  						return NeedMore;
  				} else {
  					// There is no previous match to compare with, wait for
  					// the next step to decide.

  					match_available = 1;
  					strstart++;
  					lookahead--;
  				}
  			}

  			if (match_available !== 0) {
  				bflush = _tr_tally(0, window[strstart - 1] & 0xff);
  				match_available = 0;
  			}
  			flush_block_only(flush == Z_FINISH);

  			if (strm.avail_out === 0) {
  				if (flush == Z_FINISH)
  					return FinishStarted;
  				else
  					return NeedMore;
  			}

  			return flush == Z_FINISH ? FinishDone : BlockDone;
  		}

  		function deflateReset(strm) {
  			strm.total_in = strm.total_out = 0;
  			strm.msg = null; //
  			
  			that.pending = 0;
  			that.pending_out = 0;

  			status = BUSY_STATE;

  			last_flush = Z_NO_FLUSH;

  			tr_init();
  			lm_init();
  			return Z_OK;
  		}

  		that.deflateInit = function(strm, _level, bits, _method, memLevel, _strategy) {
  			if (!_method)
  				_method = Z_DEFLATED;
  			if (!memLevel)
  				memLevel = DEF_MEM_LEVEL;
  			if (!_strategy)
  				_strategy = Z_DEFAULT_STRATEGY;

  			// byte[] my_version=ZLIB_VERSION;

  			//
  			// if (!version || version[0] != my_version[0]
  			// || stream_size != sizeof(z_stream)) {
  			// return Z_VERSION_ERROR;
  			// }

  			strm.msg = null;

  			if (_level == Z_DEFAULT_COMPRESSION)
  				_level = 6;

  			if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || _method != Z_DEFLATED || bits < 9 || bits > 15 || _level < 0 || _level > 9 || _strategy < 0
  					|| _strategy > Z_HUFFMAN_ONLY) {
  				return Z_STREAM_ERROR;
  			}

  			strm.dstate = that;

  			w_bits = bits;
  			w_size = 1 << w_bits;
  			w_mask = w_size - 1;

  			hash_bits = memLevel + 7;
  			hash_size = 1 << hash_bits;
  			hash_mask = hash_size - 1;
  			hash_shift = Math.floor((hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  			window = new Uint8Array(w_size * 2);
  			prev = [];
  			head = [];

  			lit_bufsize = 1 << (memLevel + 6); // 16K elements by default

  			// We overlay pending_buf and d_buf+l_buf. This works since the average
  			// output size for (length,distance) codes is <= 24 bits.
  			that.pending_buf = new Uint8Array(lit_bufsize * 4);
  			pending_buf_size = lit_bufsize * 4;

  			d_buf = Math.floor(lit_bufsize / 2);
  			l_buf = (1 + 2) * lit_bufsize;

  			level = _level;

  			strategy = _strategy;
  			method = _method & 0xff;

  			return deflateReset(strm);
  		};

  		that.deflateEnd = function() {
  			if (status != INIT_STATE && status != BUSY_STATE && status != FINISH_STATE) {
  				return Z_STREAM_ERROR;
  			}
  			// Deallocate in reverse order of allocations:
  			that.pending_buf = null;
  			head = null;
  			prev = null;
  			window = null;
  			// free
  			that.dstate = null;
  			return status == BUSY_STATE ? Z_DATA_ERROR : Z_OK;
  		};

  		that.deflateParams = function(strm, _level, _strategy) {
  			var err = Z_OK;

  			if (_level == Z_DEFAULT_COMPRESSION) {
  				_level = 6;
  			}
  			if (_level < 0 || _level > 9 || _strategy < 0 || _strategy > Z_HUFFMAN_ONLY) {
  				return Z_STREAM_ERROR;
  			}

  			if (config_table[level].func != config_table[_level].func && strm.total_in !== 0) {
  				// Flush the last buffer:
  				err = strm.deflate(Z_PARTIAL_FLUSH);
  			}

  			if (level != _level) {
  				level = _level;
  				max_lazy_match = config_table[level].max_lazy;
  				good_match = config_table[level].good_length;
  				nice_match = config_table[level].nice_length;
  				max_chain_length = config_table[level].max_chain;
  			}
  			strategy = _strategy;
  			return err;
  		};

  		that.deflateSetDictionary = function(strm, dictionary, dictLength) {
  			var length = dictLength;
  			var n, index = 0;

  			if (!dictionary || status != INIT_STATE)
  				return Z_STREAM_ERROR;

  			if (length < MIN_MATCH)
  				return Z_OK;
  			if (length > w_size - MIN_LOOKAHEAD) {
  				length = w_size - MIN_LOOKAHEAD;
  				index = dictLength - length; // use the tail of the dictionary
  			}
  			window.set(dictionary.subarray(index, index + length), 0);

  			strstart = length;
  			block_start = length;

  			// Insert all strings in the hash table (except for the last two bytes).
  			// s->lookahead stays null, so s->ins_h will be recomputed at the next
  			// call of fill_window.

  			ins_h = window[0] & 0xff;
  			ins_h = (((ins_h) << hash_shift) ^ (window[1] & 0xff)) & hash_mask;

  			for (n = 0; n <= length - MIN_MATCH; n++) {
  				ins_h = (((ins_h) << hash_shift) ^ (window[(n) + (MIN_MATCH - 1)] & 0xff)) & hash_mask;
  				prev[n & w_mask] = head[ins_h];
  				head[ins_h] = n;
  			}
  			return Z_OK;
  		};

  		that.deflate = function(_strm, flush) {
  			var i, header, level_flags, old_flush, bstate;

  			if (flush > Z_FINISH || flush < 0) {
  				return Z_STREAM_ERROR;
  			}

  			if (!_strm.next_out || (!_strm.next_in && _strm.avail_in !== 0) || (status == FINISH_STATE && flush != Z_FINISH)) {
  				_strm.msg = z_errmsg[Z_NEED_DICT - (Z_STREAM_ERROR)];
  				return Z_STREAM_ERROR;
  			}
  			if (_strm.avail_out === 0) {
  				_strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
  				return Z_BUF_ERROR;
  			}

  			strm = _strm; // just in case
  			old_flush = last_flush;
  			last_flush = flush;

  			// Write the zlib header
  			if (status == INIT_STATE) {
  				header = (Z_DEFLATED + ((w_bits - 8) << 4)) << 8;
  				level_flags = ((level - 1) & 0xff) >> 1;

  				if (level_flags > 3)
  					level_flags = 3;
  				header |= (level_flags << 6);
  				if (strstart !== 0)
  					header |= PRESET_DICT;
  				header += 31 - (header % 31);

  				status = BUSY_STATE;
  				putShortMSB(header);
  			}

  			// Flush as much pending output as possible
  			if (that.pending !== 0) {
  				strm.flush_pending();
  				if (strm.avail_out === 0) {
  					// console.log(" avail_out==0");
  					// Since avail_out is 0, deflate will be called again with
  					// more output space, but possibly with both pending and
  					// avail_in equal to zero. There won't be anything to do,
  					// but this is not an error situation so make sure we
  					// return OK instead of BUF_ERROR at next call of deflate:
  					last_flush = -1;
  					return Z_OK;
  				}

  				// Make sure there is something to do and avoid duplicate
  				// consecutive
  				// flushes. For repeated and useless calls with Z_FINISH, we keep
  				// returning Z_STREAM_END instead of Z_BUFF_ERROR.
  			} else if (strm.avail_in === 0 && flush <= old_flush && flush != Z_FINISH) {
  				strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
  				return Z_BUF_ERROR;
  			}

  			// User must not provide more input after the first FINISH:
  			if (status == FINISH_STATE && strm.avail_in !== 0) {
  				_strm.msg = z_errmsg[Z_NEED_DICT - (Z_BUF_ERROR)];
  				return Z_BUF_ERROR;
  			}

  			// Start a new block or continue the current one.
  			if (strm.avail_in !== 0 || lookahead !== 0 || (flush != Z_NO_FLUSH && status != FINISH_STATE)) {
  				bstate = -1;
  				switch (config_table[level].func) {
  				case STORED:
  					bstate = deflate_stored(flush);
  					break;
  				case FAST:
  					bstate = deflate_fast(flush);
  					break;
  				case SLOW:
  					bstate = deflate_slow(flush);
  					break;
  				default:
  				}

  				if (bstate == FinishStarted || bstate == FinishDone) {
  					status = FINISH_STATE;
  				}
  				if (bstate == NeedMore || bstate == FinishStarted) {
  					if (strm.avail_out === 0) {
  						last_flush = -1; // avoid BUF_ERROR next call, see above
  					}
  					return Z_OK;
  					// If flush != Z_NO_FLUSH && avail_out === 0, the next call
  					// of deflate should use the same flush parameter to make sure
  					// that the flush is complete. So we don't have to output an
  					// empty block here, this will be done at next call. This also
  					// ensures that for a very small output buffer, we emit at most
  					// one empty block.
  				}

  				if (bstate == BlockDone) {
  					if (flush == Z_PARTIAL_FLUSH) {
  						_tr_align();
  					} else { // FULL_FLUSH or SYNC_FLUSH
  						_tr_stored_block(0, 0, false);
  						// For a full flush, this empty block will be recognized
  						// as a special marker by inflate_sync().
  						if (flush == Z_FULL_FLUSH) {
  							// state.head[s.hash_size-1]=0;
  							for (i = 0; i < hash_size/*-1*/; i++)
  								// forget history
  								head[i] = 0;
  						}
  					}
  					strm.flush_pending();
  					if (strm.avail_out === 0) {
  						last_flush = -1; // avoid BUF_ERROR at next call, see above
  						return Z_OK;
  					}
  				}
  			}

  			if (flush != Z_FINISH)
  				return Z_OK;
  			return Z_STREAM_END;
  		};
  	}

  	// ZStream

  	function ZStream() {
  		var that = this;
  		that.next_in_index = 0;
  		that.next_out_index = 0;
  		// that.next_in; // next input byte
  		that.avail_in = 0; // number of bytes available at next_in
  		that.total_in = 0; // total nb of input bytes read so far
  		// that.next_out; // next output byte should be put there
  		that.avail_out = 0; // remaining free space at next_out
  		that.total_out = 0; // total nb of bytes output so far
  		// that.msg;
  		// that.dstate;
  	}

  	ZStream.prototype = {
  		deflateInit : function(level, bits) {
  			var that = this;
  			that.dstate = new Deflate();
  			if (!bits)
  				bits = MAX_BITS;
  			return that.dstate.deflateInit(that, level, bits);
  		},

  		deflate : function(flush) {
  			var that = this;
  			if (!that.dstate) {
  				return Z_STREAM_ERROR;
  			}
  			return that.dstate.deflate(that, flush);
  		},

  		deflateEnd : function() {
  			var that = this;
  			if (!that.dstate)
  				return Z_STREAM_ERROR;
  			var ret = that.dstate.deflateEnd();
  			that.dstate = null;
  			return ret;
  		},

  		deflateParams : function(level, strategy) {
  			var that = this;
  			if (!that.dstate)
  				return Z_STREAM_ERROR;
  			return that.dstate.deflateParams(that, level, strategy);
  		},

  		deflateSetDictionary : function(dictionary, dictLength) {
  			var that = this;
  			if (!that.dstate)
  				return Z_STREAM_ERROR;
  			return that.dstate.deflateSetDictionary(that, dictionary, dictLength);
  		},

  		// Read a new buffer from the current input stream, update the
  		// total number of bytes read. All deflate() input goes through
  		// this function so some applications may wish to modify it to avoid
  		// allocating a large strm->next_in buffer and copying from it.
  		// (See also flush_pending()).
  		read_buf : function(buf, start, size) {
  			var that = this;
  			var len = that.avail_in;
  			if (len > size)
  				len = size;
  			if (len === 0)
  				return 0;
  			that.avail_in -= len;
  			buf.set(that.next_in.subarray(that.next_in_index, that.next_in_index + len), start);
  			that.next_in_index += len;
  			that.total_in += len;
  			return len;
  		},

  		// Flush as much pending output as possible. All deflate() output goes
  		// through this function so some applications may wish to modify it
  		// to avoid allocating a large strm->next_out buffer and copying into it.
  		// (See also read_buf()).
  		flush_pending : function() {
  			var that = this;
  			var len = that.dstate.pending;

  			if (len > that.avail_out)
  				len = that.avail_out;
  			if (len === 0)
  				return;

  			// if (that.dstate.pending_buf.length <= that.dstate.pending_out || that.next_out.length <= that.next_out_index
  			// || that.dstate.pending_buf.length < (that.dstate.pending_out + len) || that.next_out.length < (that.next_out_index +
  			// len)) {
  			// console.log(that.dstate.pending_buf.length + ", " + that.dstate.pending_out + ", " + that.next_out.length + ", " +
  			// that.next_out_index + ", " + len);
  			// console.log("avail_out=" + that.avail_out);
  			// }

  			that.next_out.set(that.dstate.pending_buf.subarray(that.dstate.pending_out, that.dstate.pending_out + len), that.next_out_index);

  			that.next_out_index += len;
  			that.dstate.pending_out += len;
  			that.total_out += len;
  			that.avail_out -= len;
  			that.dstate.pending -= len;
  			if (that.dstate.pending === 0) {
  				that.dstate.pending_out = 0;
  			}
  		}
  	};

  	// Deflater

  	return function Deflater(level) {
  		var that = this;
  		var z = new ZStream();
  		var bufsize = 512;
  		var flush = Z_NO_FLUSH;
  		var buf = new Uint8Array(bufsize);

  		if (typeof level == "undefined")
  			level = Z_DEFAULT_COMPRESSION;
  		z.deflateInit(level);
  		z.next_out = buf;

  		that.append = function(data, onprogress) {
  			var err, buffers = [], lastIndex = 0, bufferIndex = 0, bufferSize = 0, array;
  			if (!data.length)
  				return;
  			z.next_in_index = 0;
  			z.next_in = data;
  			z.avail_in = data.length;
  			do {
  				z.next_out_index = 0;
  				z.avail_out = bufsize;
  				err = z.deflate(flush);
  				if (err != Z_OK)
  					throw "deflating: " + z.msg;
  				if (z.next_out_index)
  					if (z.next_out_index == bufsize)
  						buffers.push(new Uint8Array(buf));
  					else
  						buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
  				bufferSize += z.next_out_index;
  				if (onprogress && z.next_in_index > 0 && z.next_in_index != lastIndex) {
  					onprogress(z.next_in_index);
  					lastIndex = z.next_in_index;
  				}
  			} while (z.avail_in > 0 || z.avail_out === 0);
  			array = new Uint8Array(bufferSize);
  			buffers.forEach(function(chunk) {
  				array.set(chunk, bufferIndex);
  				bufferIndex += chunk.length;
  			});
  			return array;
  		};
  		that.flush = function() {
  			var err, buffers = [], bufferIndex = 0, bufferSize = 0, array;
  			do {
  				z.next_out_index = 0;
  				z.avail_out = bufsize;
  				err = z.deflate(Z_FINISH);
  				if (err != Z_STREAM_END && err != Z_OK)
  					throw "deflating: " + z.msg;
  				if (bufsize - z.avail_out > 0)
  					buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
  				bufferSize += z.next_out_index;
  			} while (z.avail_in > 0 || z.avail_out === 0);
  			z.deflateEnd();
  			array = new Uint8Array(bufferSize);
  			buffers.forEach(function(chunk) {
  				array.set(chunk, bufferIndex);
  				bufferIndex += chunk.length;
  			});
  			return array;
  		};
  	};
  })(undefined);
  

  /*
    html2canvas 0.5.0-beta3 <http://html2canvas.hertzen.com>
    Copyright (c) 2016 Niklas von Hertzen

    Released under  License
  */

  !function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.html2canvas=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
  (function (global){
  /*! http://mths.be/punycode v1.2.4 by @mathias */
  ;(function(root) {

  	/** Detect free variables */
  	var freeExports = typeof exports == 'object' && exports;
  	var freeModule = typeof module == 'object' && module &&
  		module.exports == freeExports && module;
  	var freeGlobal = typeof global == 'object' && global;
  	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
  		root = freeGlobal;
  	}

  	/**
  	 * The `punycode` object.
  	 * @name punycode
  	 * @type Object
  	 */
  	var punycode,

  	/** Highest positive signed 32-bit float value */
  	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

  	/** Bootstring parameters */
  	base = 36,
  	tMin = 1,
  	tMax = 26,
  	skew = 38,
  	damp = 700,
  	initialBias = 72,
  	initialN = 128, // 0x80
  	delimiter = '-', // '\x2D'

  	/** Regular expressions */
  	regexPunycode = /^xn--/,
  	regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
  	regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators

  	/** Error messages */
  	errors = {
  		'overflow': 'Overflow: input needs wider integers to process',
  		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  		'invalid-input': 'Invalid input'
  	},

  	/** Convenience shortcuts */
  	baseMinusTMin = base - tMin,
  	floor = Math.floor,
  	stringFromCharCode = String.fromCharCode,

  	/** Temporary variable */
  	key;

  	/*--------------------------------------------------------------------------*/

  	/**
  	 * A generic error utility function.
  	 * @private
  	 * @param {String} type The error type.
  	 * @returns {Error} Throws a `RangeError` with the applicable error message.
  	 */
  	function error(type) {
  		throw RangeError(errors[type]);
  	}

  	/**
  	 * A generic `Array#map` utility function.
  	 * @private
  	 * @param {Array} array The array to iterate over.
  	 * @param {Function} callback The function that gets called for every array
  	 * item.
  	 * @returns {Array} A new array of values returned by the callback function.
  	 */
  	function map(array, fn) {
  		var length = array.length;
  		while (length--) {
  			array[length] = fn(array[length]);
  		}
  		return array;
  	}

  	/**
  	 * A simple `Array#map`-like wrapper to work with domain name strings.
  	 * @private
  	 * @param {String} domain The domain name.
  	 * @param {Function} callback The function that gets called for every
  	 * character.
  	 * @returns {Array} A new string of characters returned by the callback
  	 * function.
  	 */
  	function mapDomain(string, fn) {
  		return map(string.split(regexSeparators), fn).join('.');
  	}

  	/**
  	 * Creates an array containing the numeric code points of each Unicode
  	 * character in the string. While JavaScript uses UCS-2 internally,
  	 * this function will convert a pair of surrogate halves (each of which
  	 * UCS-2 exposes as separate characters) into a single code point,
  	 * matching UTF-16.
  	 * @see `punycode.ucs2.encode`
  	 * @see <http://mathiasbynens.be/notes/javascript-encoding>
  	 * @memberOf punycode.ucs2
  	 * @name decode
  	 * @param {String} string The Unicode input string (UCS-2).
  	 * @returns {Array} The new array of code points.
  	 */
  	function ucs2decode(string) {
  		var output = [],
  		    counter = 0,
  		    length = string.length,
  		    value,
  		    extra;
  		while (counter < length) {
  			value = string.charCodeAt(counter++);
  			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
  				// high surrogate, and there is a next character
  				extra = string.charCodeAt(counter++);
  				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
  					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
  				} else {
  					// unmatched surrogate; only append this code unit, in case the next
  					// code unit is the high surrogate of a surrogate pair
  					output.push(value);
  					counter--;
  				}
  			} else {
  				output.push(value);
  			}
  		}
  		return output;
  	}

  	/**
  	 * Creates a string based on an array of numeric code points.
  	 * @see `punycode.ucs2.decode`
  	 * @memberOf punycode.ucs2
  	 * @name encode
  	 * @param {Array} codePoints The array of numeric code points.
  	 * @returns {String} The new Unicode string (UCS-2).
  	 */
  	function ucs2encode(array) {
  		return map(array, function(value) {
  			var output = '';
  			if (value > 0xFFFF) {
  				value -= 0x10000;
  				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
  				value = 0xDC00 | value & 0x3FF;
  			}
  			output += stringFromCharCode(value);
  			return output;
  		}).join('');
  	}

  	/**
  	 * Converts a basic code point into a digit/integer.
  	 * @see `digitToBasic()`
  	 * @private
  	 * @param {Number} codePoint The basic numeric code point value.
  	 * @returns {Number} The numeric value of a basic code point (for use in
  	 * representing integers) in the range `0` to `base - 1`, or `base` if
  	 * the code point does not represent a value.
  	 */
  	function basicToDigit(codePoint) {
  		if (codePoint - 48 < 10) {
  			return codePoint - 22;
  		}
  		if (codePoint - 65 < 26) {
  			return codePoint - 65;
  		}
  		if (codePoint - 97 < 26) {
  			return codePoint - 97;
  		}
  		return base;
  	}

  	/**
  	 * Converts a digit/integer into a basic code point.
  	 * @see `basicToDigit()`
  	 * @private
  	 * @param {Number} digit The numeric value of a basic code point.
  	 * @returns {Number} The basic code point whose value (when used for
  	 * representing integers) is `digit`, which needs to be in the range
  	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
  	 * used; else, the lowercase form is used. The behavior is undefined
  	 * if `flag` is non-zero and `digit` has no uppercase form.
  	 */
  	function digitToBasic(digit, flag) {
  		//  0..25 map to ASCII a..z or A..Z
  		// 26..35 map to ASCII 0..9
  		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
  	}

  	/**
  	 * Bias adaptation function as per section 3.4 of RFC 3492.
  	 * http://tools.ietf.org/html/rfc3492#section-3.4
  	 * @private
  	 */
  	function adapt(delta, numPoints, firstTime) {
  		var k = 0;
  		delta = firstTime ? floor(delta / damp) : delta >> 1;
  		delta += floor(delta / numPoints);
  		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
  			delta = floor(delta / baseMinusTMin);
  		}
  		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
  	}

  	/**
  	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
  	 * symbols.
  	 * @memberOf punycode
  	 * @param {String} input The Punycode string of ASCII-only symbols.
  	 * @returns {String} The resulting string of Unicode symbols.
  	 */
  	function decode(input) {
  		// Don't use UCS-2
  		var output = [],
  		    inputLength = input.length,
  		    out,
  		    i = 0,
  		    n = initialN,
  		    bias = initialBias,
  		    basic,
  		    j,
  		    index,
  		    oldi,
  		    w,
  		    k,
  		    digit,
  		    t,
  		    /** Cached calculation results */
  		    baseMinusT;

  		// Handle the basic code points: let `basic` be the number of input code
  		// points before the last delimiter, or `0` if there is none, then copy
  		// the first basic code points to the output.

  		basic = input.lastIndexOf(delimiter);
  		if (basic < 0) {
  			basic = 0;
  		}

  		for (j = 0; j < basic; ++j) {
  			// if it's not a basic code point
  			if (input.charCodeAt(j) >= 0x80) {
  				error('not-basic');
  			}
  			output.push(input.charCodeAt(j));
  		}

  		// Main decoding loop: start just after the last delimiter if any basic code
  		// points were copied; start at the beginning otherwise.

  		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

  			// `index` is the index of the next character to be consumed.
  			// Decode a generalized variable-length integer into `delta`,
  			// which gets added to `i`. The overflow checking is easier
  			// if we increase `i` as we go, then subtract off its starting
  			// value at the end to obtain `delta`.
  			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

  				if (index >= inputLength) {
  					error('invalid-input');
  				}

  				digit = basicToDigit(input.charCodeAt(index++));

  				if (digit >= base || digit > floor((maxInt - i) / w)) {
  					error('overflow');
  				}

  				i += digit * w;
  				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

  				if (digit < t) {
  					break;
  				}

  				baseMinusT = base - t;
  				if (w > floor(maxInt / baseMinusT)) {
  					error('overflow');
  				}

  				w *= baseMinusT;

  			}

  			out = output.length + 1;
  			bias = adapt(i - oldi, out, oldi == 0);

  			// `i` was supposed to wrap around from `out` to `0`,
  			// incrementing `n` each time, so we'll fix that now:
  			if (floor(i / out) > maxInt - n) {
  				error('overflow');
  			}

  			n += floor(i / out);
  			i %= out;

  			// Insert `n` at position `i` of the output
  			output.splice(i++, 0, n);

  		}

  		return ucs2encode(output);
  	}

  	/**
  	 * Converts a string of Unicode symbols to a Punycode string of ASCII-only
  	 * symbols.
  	 * @memberOf punycode
  	 * @param {String} input The string of Unicode symbols.
  	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
  	 */
  	function encode(input) {
  		var n,
  		    delta,
  		    handledCPCount,
  		    basicLength,
  		    bias,
  		    j,
  		    m,
  		    q,
  		    k,
  		    t,
  		    currentValue,
  		    output = [],
  		    /** `inputLength` will hold the number of code points in `input`. */
  		    inputLength,
  		    /** Cached calculation results */
  		    handledCPCountPlusOne,
  		    baseMinusT,
  		    qMinusT;

  		// Convert the input in UCS-2 to Unicode
  		input = ucs2decode(input);

  		// Cache the length
  		inputLength = input.length;

  		// Initialize the state
  		n = initialN;
  		delta = 0;
  		bias = initialBias;

  		// Handle the basic code points
  		for (j = 0; j < inputLength; ++j) {
  			currentValue = input[j];
  			if (currentValue < 0x80) {
  				output.push(stringFromCharCode(currentValue));
  			}
  		}

  		handledCPCount = basicLength = output.length;

  		// `handledCPCount` is the number of code points that have been handled;
  		// `basicLength` is the number of basic code points.

  		// Finish the basic string - if it is not empty - with a delimiter
  		if (basicLength) {
  			output.push(delimiter);
  		}

  		// Main encoding loop:
  		while (handledCPCount < inputLength) {

  			// All non-basic code points < n have been handled already. Find the next
  			// larger one:
  			for (m = maxInt, j = 0; j < inputLength; ++j) {
  				currentValue = input[j];
  				if (currentValue >= n && currentValue < m) {
  					m = currentValue;
  				}
  			}

  			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
  			// but guard against overflow
  			handledCPCountPlusOne = handledCPCount + 1;
  			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
  				error('overflow');
  			}

  			delta += (m - n) * handledCPCountPlusOne;
  			n = m;

  			for (j = 0; j < inputLength; ++j) {
  				currentValue = input[j];

  				if (currentValue < n && ++delta > maxInt) {
  					error('overflow');
  				}

  				if (currentValue == n) {
  					// Represent delta as a generalized variable-length integer
  					for (q = delta, k = base; /* no condition */; k += base) {
  						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
  						if (q < t) {
  							break;
  						}
  						qMinusT = q - t;
  						baseMinusT = base - t;
  						output.push(
  							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
  						);
  						q = floor(qMinusT / baseMinusT);
  					}

  					output.push(stringFromCharCode(digitToBasic(q, 0)));
  					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
  					delta = 0;
  					++handledCPCount;
  				}
  			}

  			++delta;
  			++n;

  		}
  		return output.join('');
  	}

  	/**
  	 * Converts a Punycode string representing a domain name to Unicode. Only the
  	 * Punycoded parts of the domain name will be converted, i.e. it doesn't
  	 * matter if you call it on a string that has already been converted to
  	 * Unicode.
  	 * @memberOf punycode
  	 * @param {String} domain The Punycode domain name to convert to Unicode.
  	 * @returns {String} The Unicode representation of the given Punycode
  	 * string.
  	 */
  	function toUnicode(domain) {
  		return mapDomain(domain, function(string) {
  			return regexPunycode.test(string)
  				? decode(string.slice(4).toLowerCase())
  				: string;
  		});
  	}

  	/**
  	 * Converts a Unicode string representing a domain name to Punycode. Only the
  	 * non-ASCII parts of the domain name will be converted, i.e. it doesn't
  	 * matter if you call it with a domain that's already in ASCII.
  	 * @memberOf punycode
  	 * @param {String} domain The domain name to convert, as a Unicode string.
  	 * @returns {String} The Punycode representation of the given domain name.
  	 */
  	function toASCII(domain) {
  		return mapDomain(domain, function(string) {
  			return regexNonASCII.test(string)
  				? 'xn--' + encode(string)
  				: string;
  		});
  	}

  	/*--------------------------------------------------------------------------*/

  	/** Define the public API */
  	punycode = {
  		/**
  		 * A string representing the current Punycode.js version number.
  		 * @memberOf punycode
  		 * @type String
  		 */
  		'version': '1.2.4',
  		/**
  		 * An object of methods to convert from JavaScript's internal character
  		 * representation (UCS-2) to Unicode code points, and back.
  		 * @see <http://mathiasbynens.be/notes/javascript-encoding>
  		 * @memberOf punycode
  		 * @type Object
  		 */
  		'ucs2': {
  			'decode': ucs2decode,
  			'encode': ucs2encode
  		},
  		'decode': decode,
  		'encode': encode,
  		'toASCII': toASCII,
  		'toUnicode': toUnicode
  	};

  	/** Expose `punycode` */
  	// Some AMD build optimizers, like r.js, check for specific condition patterns
  	// like the following:
  	if (
  		typeof define == 'function' &&
  		typeof define.amd == 'object' &&
  		define.amd
  	) {
  		define('punycode', function() {
  			return punycode;
  		});
  	} else if (freeExports && !freeExports.nodeType) {
  		if (freeModule) { // in Node.js or RingoJS v0.8.0+
  			freeModule.exports = punycode;
  		} else { // in Narwhal or RingoJS v0.7.0-
  			for (key in punycode) {
  				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
  			}
  		}
  	} else { // in Rhino or a web browser
  		root.punycode = punycode;
  	}

  }(this));

  }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  },{}],2:[function(_dereq_,module,exports){
  var log = _dereq_('./log');

  function restoreOwnerScroll(ownerDocument, x, y) {
      if (ownerDocument.defaultView && (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {
          ownerDocument.defaultView.scrollTo(x, y);
      }
  }

  function cloneCanvasContents(canvas, clonedCanvas) {
      try {
          if (clonedCanvas) {
              clonedCanvas.width = canvas.width;
              clonedCanvas.height = canvas.height;
              clonedCanvas.getContext("2d").putImageData(canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height), 0, 0);
          }
      } catch(e) {
          log("Unable to copy canvas content from", canvas, e);
      }
  }

  function cloneNode(node, javascriptEnabled) {
      var clone = node.nodeType === 3 ? document.createTextNode(node.nodeValue) : node.cloneNode(false);

      var child = node.firstChild;
      while(child) {
          if (javascriptEnabled === true || child.nodeType !== 1 || child.nodeName !== 'SCRIPT') {
              clone.appendChild(cloneNode(child, javascriptEnabled));
          }
          child = child.nextSibling;
      }

      if (node.nodeType === 1) {
          clone._scrollTop = node.scrollTop;
          clone._scrollLeft = node.scrollLeft;
          if (node.nodeName === "CANVAS") {
              cloneCanvasContents(node, clone);
          } else if (node.nodeName === "TEXTAREA" || node.nodeName === "SELECT") {
              clone.value = node.value;
          }
      }

      return clone;
  }

  function initNode(node) {
      if (node.nodeType === 1) {
          node.scrollTop = node._scrollTop;
          node.scrollLeft = node._scrollLeft;

          var child = node.firstChild;
          while(child) {
              initNode(child);
              child = child.nextSibling;
          }
      }
  }

  module.exports = function(ownerDocument, containerDocument, width, height, options, x ,y) {
      var documentElement = cloneNode(ownerDocument.documentElement, options.javascriptEnabled);
      var container = containerDocument.createElement("iframe");

      container.className = "html2canvas-container";
      container.style.visibility = "hidden";
      container.style.position = "fixed";
      container.style.left = "-10000px";
      container.style.top = "0px";
      container.style.border = "0";
      container.width = width;
      container.height = height;
      container.scrolling = "no"; // ios won't scroll without it
      containerDocument.body.appendChild(container);

      return new Promise(function(resolve) {
          var documentClone = container.contentWindow.document;

          /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
           if window url is about:blank, we can assign the url to current by writing onto the document
           */
          container.contentWindow.onload = container.onload = function() {
              var interval = setInterval(function() {
                  if (documentClone.body.childNodes.length > 0) {
                      initNode(documentClone.documentElement);
                      clearInterval(interval);
                      if (options.type === "view") {
                          container.contentWindow.scrollTo(x, y);
                          if ((/(iPad|iPhone|iPod)/g).test(navigator.userAgent) && (container.contentWindow.scrollY !== y || container.contentWindow.scrollX !== x)) {
                              documentClone.documentElement.style.top = (-y) + "px";
                              documentClone.documentElement.style.left = (-x) + "px";
                              documentClone.documentElement.style.position = 'absolute';
                          }
                      }
                      resolve(container);
                  }
              }, 50);
          };

          documentClone.open();
          documentClone.write("<!DOCTYPE html><html></html>");
          // Chrome scrolls the parent document for some reason after the write to the cloned window???
          restoreOwnerScroll(ownerDocument, x, y);
          documentClone.replaceChild(documentClone.adoptNode(documentElement), documentClone.documentElement);
          documentClone.close();
      });
  };

  },{"./log":13}],3:[function(_dereq_,module,exports){
  // http://dev.w3.org/csswg/css-color/

  function Color(value) {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = null;
      var result = this.fromArray(value) ||
          this.namedColor(value) ||
          this.rgb(value) ||
          this.rgba(value) ||
          this.hex6(value) ||
          this.hex3(value);
  }

  Color.prototype.darken = function(amount) {
      var a = 1 - amount;
      return  new Color([
          Math.round(this.r * a),
          Math.round(this.g * a),
          Math.round(this.b * a),
          this.a
      ]);
  };

  Color.prototype.isTransparent = function() {
      return this.a === 0;
  };

  Color.prototype.isBlack = function() {
      return this.r === 0 && this.g === 0 && this.b === 0;
  };

  Color.prototype.fromArray = function(array) {
      if (Array.isArray(array)) {
          this.r = Math.min(array[0], 255);
          this.g = Math.min(array[1], 255);
          this.b = Math.min(array[2], 255);
          if (array.length > 3) {
              this.a = array[3];
          }
      }

      return (Array.isArray(array));
  };

  var _hex3 = /^#([a-f0-9]{3})$/i;

  Color.prototype.hex3 = function(value) {
      var match = null;
      if ((match = value.match(_hex3)) !== null) {
          this.r = parseInt(match[1][0] + match[1][0], 16);
          this.g = parseInt(match[1][1] + match[1][1], 16);
          this.b = parseInt(match[1][2] + match[1][2], 16);
      }
      return match !== null;
  };

  var _hex6 = /^#([a-f0-9]{6})$/i;

  Color.prototype.hex6 = function(value) {
      var match = null;
      if ((match = value.match(_hex6)) !== null) {
          this.r = parseInt(match[1].substring(0, 2), 16);
          this.g = parseInt(match[1].substring(2, 4), 16);
          this.b = parseInt(match[1].substring(4, 6), 16);
      }
      return match !== null;
  };


  var _rgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

  Color.prototype.rgb = function(value) {
      var match = null;
      if ((match = value.match(_rgb)) !== null) {
          this.r = Number(match[1]);
          this.g = Number(match[2]);
          this.b = Number(match[3]);
      }
      return match !== null;
  };

  var _rgba = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/;

  Color.prototype.rgba = function(value) {
      var match = null;
      if ((match = value.match(_rgba)) !== null) {
          this.r = Number(match[1]);
          this.g = Number(match[2]);
          this.b = Number(match[3]);
          this.a = Number(match[4]);
      }
      return match !== null;
  };

  Color.prototype.toString = function() {
      return this.a !== null && this.a !== 1 ?
      "rgba(" + [this.r, this.g, this.b, this.a].join(",") + ")" :
      "rgb(" + [this.r, this.g, this.b].join(",") + ")";
  };

  Color.prototype.namedColor = function(value) {
      value = value.toLowerCase();
      var color = colors[value];
      if (color) {
          this.r = color[0];
          this.g = color[1];
          this.b = color[2];
      } else if (value === "transparent") {
          this.r = this.g = this.b = this.a = 0;
          return true;
      }

      return !!color;
  };

  Color.prototype.isColor = true;

  // JSON.stringify([].slice.call($$('.named-color-table tr'), 1).map(function(row) { return [row.childNodes[3].textContent, row.childNodes[5].textContent.trim().split(",").map(Number)] }).reduce(function(data, row) {data[row[0]] = row[1]; return data}, {}))
  var colors = {
      "aliceblue": [240, 248, 255],
      "antiquewhite": [250, 235, 215],
      "aqua": [0, 255, 255],
      "aquamarine": [127, 255, 212],
      "azure": [240, 255, 255],
      "beige": [245, 245, 220],
      "bisque": [255, 228, 196],
      "black": [0, 0, 0],
      "blanchedalmond": [255, 235, 205],
      "blue": [0, 0, 255],
      "blueviolet": [138, 43, 226],
      "brown": [165, 42, 42],
      "burlywood": [222, 184, 135],
      "cadetblue": [95, 158, 160],
      "chartreuse": [127, 255, 0],
      "chocolate": [210, 105, 30],
      "coral": [255, 127, 80],
      "cornflowerblue": [100, 149, 237],
      "cornsilk": [255, 248, 220],
      "crimson": [220, 20, 60],
      "cyan": [0, 255, 255],
      "darkblue": [0, 0, 139],
      "darkcyan": [0, 139, 139],
      "darkgoldenrod": [184, 134, 11],
      "darkgray": [169, 169, 169],
      "darkgreen": [0, 100, 0],
      "darkgrey": [169, 169, 169],
      "darkkhaki": [189, 183, 107],
      "darkmagenta": [139, 0, 139],
      "darkolivegreen": [85, 107, 47],
      "darkorange": [255, 140, 0],
      "darkorchid": [153, 50, 204],
      "darkred": [139, 0, 0],
      "darksalmon": [233, 150, 122],
      "darkseagreen": [143, 188, 143],
      "darkslateblue": [72, 61, 139],
      "darkslategray": [47, 79, 79],
      "darkslategrey": [47, 79, 79],
      "darkturquoise": [0, 206, 209],
      "darkviolet": [148, 0, 211],
      "deeppink": [255, 20, 147],
      "deepskyblue": [0, 191, 255],
      "dimgray": [105, 105, 105],
      "dimgrey": [105, 105, 105],
      "dodgerblue": [30, 144, 255],
      "firebrick": [178, 34, 34],
      "floralwhite": [255, 250, 240],
      "forestgreen": [34, 139, 34],
      "fuchsia": [255, 0, 255],
      "gainsboro": [220, 220, 220],
      "ghostwhite": [248, 248, 255],
      "gold": [255, 215, 0],
      "goldenrod": [218, 165, 32],
      "gray": [128, 128, 128],
      "green": [0, 128, 0],
      "greenyellow": [173, 255, 47],
      "grey": [128, 128, 128],
      "honeydew": [240, 255, 240],
      "hotpink": [255, 105, 180],
      "indianred": [205, 92, 92],
      "indigo": [75, 0, 130],
      "ivory": [255, 255, 240],
      "khaki": [240, 230, 140],
      "lavender": [230, 230, 250],
      "lavenderblush": [255, 240, 245],
      "lawngreen": [124, 252, 0],
      "lemonchiffon": [255, 250, 205],
      "lightblue": [173, 216, 230],
      "lightcoral": [240, 128, 128],
      "lightcyan": [224, 255, 255],
      "lightgoldenrodyellow": [250, 250, 210],
      "lightgray": [211, 211, 211],
      "lightgreen": [144, 238, 144],
      "lightgrey": [211, 211, 211],
      "lightpink": [255, 182, 193],
      "lightsalmon": [255, 160, 122],
      "lightseagreen": [32, 178, 170],
      "lightskyblue": [135, 206, 250],
      "lightslategray": [119, 136, 153],
      "lightslategrey": [119, 136, 153],
      "lightsteelblue": [176, 196, 222],
      "lightyellow": [255, 255, 224],
      "lime": [0, 255, 0],
      "limegreen": [50, 205, 50],
      "linen": [250, 240, 230],
      "magenta": [255, 0, 255],
      "maroon": [128, 0, 0],
      "mediumaquamarine": [102, 205, 170],
      "mediumblue": [0, 0, 205],
      "mediumorchid": [186, 85, 211],
      "mediumpurple": [147, 112, 219],
      "mediumseagreen": [60, 179, 113],
      "mediumslateblue": [123, 104, 238],
      "mediumspringgreen": [0, 250, 154],
      "mediumturquoise": [72, 209, 204],
      "mediumvioletred": [199, 21, 133],
      "midnightblue": [25, 25, 112],
      "mintcream": [245, 255, 250],
      "mistyrose": [255, 228, 225],
      "moccasin": [255, 228, 181],
      "navajowhite": [255, 222, 173],
      "navy": [0, 0, 128],
      "oldlace": [253, 245, 230],
      "olive": [128, 128, 0],
      "olivedrab": [107, 142, 35],
      "orange": [255, 165, 0],
      "orangered": [255, 69, 0],
      "orchid": [218, 112, 214],
      "palegoldenrod": [238, 232, 170],
      "palegreen": [152, 251, 152],
      "paleturquoise": [175, 238, 238],
      "palevioletred": [219, 112, 147],
      "papayawhip": [255, 239, 213],
      "peachpuff": [255, 218, 185],
      "peru": [205, 133, 63],
      "pink": [255, 192, 203],
      "plum": [221, 160, 221],
      "powderblue": [176, 224, 230],
      "purple": [128, 0, 128],
      "rebeccapurple": [102, 51, 153],
      "red": [255, 0, 0],
      "rosybrown": [188, 143, 143],
      "royalblue": [65, 105, 225],
      "saddlebrown": [139, 69, 19],
      "salmon": [250, 128, 114],
      "sandybrown": [244, 164, 96],
      "seagreen": [46, 139, 87],
      "seashell": [255, 245, 238],
      "sienna": [160, 82, 45],
      "silver": [192, 192, 192],
      "skyblue": [135, 206, 235],
      "slateblue": [106, 90, 205],
      "slategray": [112, 128, 144],
      "slategrey": [112, 128, 144],
      "snow": [255, 250, 250],
      "springgreen": [0, 255, 127],
      "steelblue": [70, 130, 180],
      "tan": [210, 180, 140],
      "teal": [0, 128, 128],
      "thistle": [216, 191, 216],
      "tomato": [255, 99, 71],
      "turquoise": [64, 224, 208],
      "violet": [238, 130, 238],
      "wheat": [245, 222, 179],
      "white": [255, 255, 255],
      "whitesmoke": [245, 245, 245],
      "yellow": [255, 255, 0],
      "yellowgreen": [154, 205, 50]
  };

  module.exports = Color;

  },{}],4:[function(_dereq_,module,exports){
  var Support = _dereq_('./support');
  var CanvasRenderer = _dereq_('./renderers/canvas');
  var ImageLoader = _dereq_('./imageloader');
  var NodeParser = _dereq_('./nodeparser');
  var NodeContainer = _dereq_('./nodecontainer');
  var log = _dereq_('./log');
  var utils = _dereq_('./utils');
  var createWindowClone = _dereq_('./clone');
  var loadUrlDocument = _dereq_('./proxy').loadUrlDocument;
  var getBounds = utils.getBounds;

  var html2canvasNodeAttribute = "data-html2canvas-node";
  var html2canvasCloneIndex = 0;

  function html2canvas(nodeList, options) {
      var index = html2canvasCloneIndex++;
      options = options || {};
      if (options.logging) {
          log.options.logging = true;
          log.options.start = Date.now();
      }

      options.async = typeof(options.async) === "undefined" ? true : options.async;
      options.allowTaint = typeof(options.allowTaint) === "undefined" ? false : options.allowTaint;
      options.removeContainer = typeof(options.removeContainer) === "undefined" ? true : options.removeContainer;
      options.javascriptEnabled = typeof(options.javascriptEnabled) === "undefined" ? false : options.javascriptEnabled;
      options.imageTimeout = typeof(options.imageTimeout) === "undefined" ? 10000 : options.imageTimeout;
      options.renderer = typeof(options.renderer) === "function" ? options.renderer : CanvasRenderer;
      options.strict = !!options.strict;

      if (typeof(nodeList) === "string") {
          if (typeof(options.proxy) !== "string") {
              return Promise.reject("Proxy must be used when rendering url");
          }
          var width = options.width != null ? options.width : window.innerWidth;
          var height = options.height != null ? options.height : window.innerHeight;
          return loadUrlDocument(absoluteUrl(nodeList), options.proxy, document, width, height, options).then(function(container) {
              return renderWindow(container.contentWindow.document.documentElement, container, options, width, height);
          });
      }

      var node = ((nodeList === undefined) ? [document.documentElement] : ((nodeList.length) ? nodeList : [nodeList]))[0];
      node.setAttribute(html2canvasNodeAttribute + index, index);
      return renderDocument(node.ownerDocument, options, node.ownerDocument.defaultView.innerWidth, node.ownerDocument.defaultView.innerHeight, index).then(function(canvas) {
          if (typeof(options.onrendered) === "function") {
              log("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas");
              options.onrendered(canvas);
          }
          return canvas;
      });
  }

  html2canvas.CanvasRenderer = CanvasRenderer;
  html2canvas.NodeContainer = NodeContainer;
  html2canvas.log = log;
  html2canvas.utils = utils;

  var html2canvasExport = (typeof(document) === "undefined" || typeof(Object.create) !== "function" || typeof(document.createElement("canvas").getContext) !== "function") ? function() {
      return Promise.reject("No canvas support");
  } : html2canvas;

  module.exports = html2canvasExport;

  if (typeof(define) === 'function' && define.amd) {
      define('html2canvas', [], function() {
          return html2canvasExport;
      });
  }

  function renderDocument(document, options, windowWidth, windowHeight, html2canvasIndex) {
      return createWindowClone(document, document, windowWidth, windowHeight, options, document.defaultView.pageXOffset, document.defaultView.pageYOffset).then(function(container) {
          log("Document cloned");
          var attributeName = html2canvasNodeAttribute + html2canvasIndex;
          var selector = "[" + attributeName + "='" + html2canvasIndex + "']";
          document.querySelector(selector).removeAttribute(attributeName);
          var clonedWindow = container.contentWindow;
          var node = clonedWindow.document.querySelector(selector);
          var oncloneHandler = (typeof(options.onclone) === "function") ? Promise.resolve(options.onclone(clonedWindow.document)) : Promise.resolve(true);
          return oncloneHandler.then(function() {
              return renderWindow(node, container, options, windowWidth, windowHeight);
          });
      });
  }

  function renderWindow(node, container, options, windowWidth, windowHeight) {
      var clonedWindow = container.contentWindow;
      var support = new Support(clonedWindow.document);
      var imageLoader = new ImageLoader(options, support);
      var bounds = getBounds(node);
      var width = options.type === "view" ? windowWidth : documentWidth(clonedWindow.document);
      var height = options.type === "view" ? windowHeight : documentHeight(clonedWindow.document);
      var renderer = new options.renderer(width, height, imageLoader, options, document);
      var parser = new NodeParser(node, renderer, support, imageLoader, options);
      return parser.ready.then(function() {
          log("Finished rendering");
          var canvas;

          if (options.type === "view") {
              canvas = crop(renderer.canvas, {width: renderer.canvas.width, height: renderer.canvas.height, top: 0, left: 0, x: 0, y: 0});
          } else if (node === clonedWindow.document.body || node === clonedWindow.document.documentElement || options.canvas != null) {
              canvas = renderer.canvas;
          } else {
              canvas = crop(renderer.canvas, {width:  options.width != null ? options.width : bounds.width, height: options.height != null ? options.height : bounds.height, top: bounds.top, left: bounds.left, x: 0, y: 0});
          }

          cleanupContainer(container, options);
          return canvas;
      });
  }

  function cleanupContainer(container, options) {
      if (options.removeContainer) {
          container.parentNode.removeChild(container);
          log("Cleaned up container");
      }
  }

  function crop(canvas, bounds) {
      var croppedCanvas = document.createElement("canvas");
      var x1 = Math.min(canvas.width - 1, Math.max(0, bounds.left));
      var x2 = Math.min(canvas.width, Math.max(1, bounds.left + bounds.width));
      var y1 = Math.min(canvas.height - 1, Math.max(0, bounds.top));
      var y2 = Math.min(canvas.height, Math.max(1, bounds.top + bounds.height));
      croppedCanvas.width = bounds.width;
      croppedCanvas.height =  bounds.height;
      var width = x2-x1;
      var height = y2-y1;
      log("Cropping canvas at:", "left:", bounds.left, "top:", bounds.top, "width:", width, "height:", height);
      log("Resulting crop with width", bounds.width, "and height", bounds.height, "with x", x1, "and y", y1);
      croppedCanvas.getContext("2d").drawImage(canvas, x1, y1, width, height, bounds.x, bounds.y, width, height);
      return croppedCanvas;
  }

  function documentWidth (doc) {
      return Math.max(
          Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
          Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
          Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
      );
  }

  function documentHeight (doc) {
      return Math.max(
          Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
          Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
          Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
      );
  }

  function absoluteUrl(url) {
      var link = document.createElement("a");
      link.href = url;
      link.href = link.href;
      return link;
  }

  },{"./clone":2,"./imageloader":11,"./log":13,"./nodecontainer":14,"./nodeparser":15,"./proxy":16,"./renderers/canvas":20,"./support":22,"./utils":26}],5:[function(_dereq_,module,exports){
  var log = _dereq_('./log');
  var smallImage = _dereq_('./utils').smallImage;

  function DummyImageContainer(src) {
      this.src = src;
      log("DummyImageContainer for", src);
      if (!this.promise || !this.image) {
          log("Initiating DummyImageContainer");
          DummyImageContainer.prototype.image = new Image();
          var image = this.image;
          DummyImageContainer.prototype.promise = new Promise(function(resolve, reject) {
              image.onload = resolve;
              image.onerror = reject;
              image.src = smallImage();
              if (image.complete === true) {
                  resolve(image);
              }
          });
      }
  }

  module.exports = DummyImageContainer;

  },{"./log":13,"./utils":26}],6:[function(_dereq_,module,exports){
  var smallImage = _dereq_('./utils').smallImage;

  function Font(family, size) {
      var container = document.createElement('div'),
          img = document.createElement('img'),
          span = document.createElement('span'),
          sampleText = 'Hidden Text',
          baseline,
          middle;

      container.style.visibility = "hidden";
      container.style.fontFamily = family;
      container.style.fontSize = size;
      container.style.margin = 0;
      container.style.padding = 0;

      document.body.appendChild(container);

      img.src = smallImage();
      img.width = 1;
      img.height = 1;

      img.style.margin = 0;
      img.style.padding = 0;
      img.style.verticalAlign = "baseline";

      span.style.fontFamily = family;
      span.style.fontSize = size;
      span.style.margin = 0;
      span.style.padding = 0;

      span.appendChild(document.createTextNode(sampleText));
      container.appendChild(span);
      container.appendChild(img);
      baseline = (img.offsetTop - span.offsetTop) + 1;

      container.removeChild(span);
      container.appendChild(document.createTextNode(sampleText));

      container.style.lineHeight = "normal";
      img.style.verticalAlign = "super";

      middle = (img.offsetTop-container.offsetTop) + 1;

      document.body.removeChild(container);

      this.baseline = baseline;
      this.lineWidth = 1;
      this.middle = middle;
  }

  module.exports = Font;

  },{"./utils":26}],7:[function(_dereq_,module,exports){
  var Font = _dereq_('./font');

  function FontMetrics() {
      this.data = {};
  }

  FontMetrics.prototype.getMetrics = function(family, size) {
      if (this.data[family + "-" + size] === undefined) {
          this.data[family + "-" + size] = new Font(family, size);
      }
      return this.data[family + "-" + size];
  };

  module.exports = FontMetrics;

  },{"./font":6}],8:[function(_dereq_,module,exports){
  var utils = _dereq_('./utils');
  var getBounds = utils.getBounds;
  var loadUrlDocument = _dereq_('./proxy').loadUrlDocument;

  function FrameContainer(container, sameOrigin, options) {
      this.image = null;
      this.src = container;
      var self = this;
      var bounds = getBounds(container);
      this.promise = (!sameOrigin ? this.proxyLoad(options.proxy, bounds, options) : new Promise(function(resolve) {
          if (container.contentWindow.document.URL === "about:blank" || container.contentWindow.document.documentElement == null) {
              container.contentWindow.onload = container.onload = function() {
                  resolve(container);
              };
          } else {
              resolve(container);
          }
      })).then(function(container) {
          var html2canvas = _dereq_('./core');
          return html2canvas(container.contentWindow.document.documentElement, {type: 'view', width: container.width, height: container.height, proxy: options.proxy, javascriptEnabled: options.javascriptEnabled, removeContainer: options.removeContainer, allowTaint: options.allowTaint, imageTimeout: options.imageTimeout / 2});
      }).then(function(canvas) {
          return self.image = canvas;
      });
  }

  FrameContainer.prototype.proxyLoad = function(proxy, bounds, options) {
      var container = this.src;
      return loadUrlDocument(container.src, proxy, container.ownerDocument, bounds.width, bounds.height, options);
  };

  module.exports = FrameContainer;

  },{"./core":4,"./proxy":16,"./utils":26}],9:[function(_dereq_,module,exports){
  function GradientContainer(imageData) {
      this.src = imageData.value;
      this.colorStops = [];
      this.type = null;
      this.x0 = 0.5;
      this.y0 = 0.5;
      this.x1 = 0.5;
      this.y1 = 0.5;
      this.promise = Promise.resolve(true);
  }

  GradientContainer.TYPES = {
      LINEAR: 1,
      RADIAL: 2
  };

  // TODO: support hsl[a], negative %/length values
  // TODO: support <angle> (e.g. -?\d{1,3}(?:\.\d+)deg, etc. : https://developer.mozilla.org/docs/Web/CSS/angle )
  GradientContainer.REGEXP_COLORSTOP = /^\s*(rgba?\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}(?:,\s*[0-9\.]+)?\s*\)|[a-z]{3,20}|#[a-f0-9]{3,6})(?:\s+(\d{1,3}(?:\.\d+)?)(%|px)?)?(?:\s|$)/i;

  module.exports = GradientContainer;

  },{}],10:[function(_dereq_,module,exports){
  function ImageContainer(src, cors) {
      this.src = src;
      this.image = new Image();
      var self = this;
      this.tainted = null;
      this.promise = new Promise(function(resolve, reject) {
          self.image.onload = resolve;
          self.image.onerror = reject;
          if (cors) {
              self.image.crossOrigin = "anonymous";
          }
          self.image.src = src;
          if (self.image.complete === true) {
              resolve(self.image);
          }
      });
  }

  module.exports = ImageContainer;

  },{}],11:[function(_dereq_,module,exports){
  var log = _dereq_('./log');
  var ImageContainer = _dereq_('./imagecontainer');
  var DummyImageContainer = _dereq_('./dummyimagecontainer');
  var ProxyImageContainer = _dereq_('./proxyimagecontainer');
  var FrameContainer = _dereq_('./framecontainer');
  var SVGContainer = _dereq_('./svgcontainer');
  var SVGNodeContainer = _dereq_('./svgnodecontainer');
  var LinearGradientContainer = _dereq_('./lineargradientcontainer');
  var WebkitGradientContainer = _dereq_('./webkitgradientcontainer');
  var bind = _dereq_('./utils').bind;

  function ImageLoader(options, support) {
      this.link = null;
      this.options = options;
      this.support = support;
      this.origin = this.getOrigin(window.location.href);
  }

  ImageLoader.prototype.findImages = function(nodes) {
      var images = [];
      nodes.reduce(function(imageNodes, container) {
          switch(container.node.nodeName) {
          case "IMG":
              return imageNodes.concat([{
                  args: [container.node.src],
                  method: "url"
              }]);
          case "svg":
          case "IFRAME":
              return imageNodes.concat([{
                  args: [container.node],
                  method: container.node.nodeName
              }]);
          }
          return imageNodes;
      }, []).forEach(this.addImage(images, this.loadImage), this);
      return images;
  };

  ImageLoader.prototype.findBackgroundImage = function(images, container) {
      container.parseBackgroundImages().filter(this.hasImageBackground).forEach(this.addImage(images, this.loadImage), this);
      return images;
  };

  ImageLoader.prototype.addImage = function(images, callback) {
      return function(newImage) {
          newImage.args.forEach(function(image) {
              if (!this.imageExists(images, image)) {
                  images.splice(0, 0, callback.call(this, newImage));
                  log('Added image #' + (images.length), typeof(image) === "string" ? image.substring(0, 100) : image);
              }
          }, this);
      };
  };

  ImageLoader.prototype.hasImageBackground = function(imageData) {
      return imageData.method !== "none";
  };

  ImageLoader.prototype.loadImage = function(imageData) {
      if (imageData.method === "url") {
          var src = imageData.args[0];
          if (this.isSVG(src) && !this.support.svg && !this.options.allowTaint) {
              return new SVGContainer(src);
          } else if (src.match(/data:image\/.*;base64,/i)) {
              return new ImageContainer(src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, ''), false);
          } else if (this.isSameOrigin(src) || this.options.allowTaint === true || this.isSVG(src)) {
              return new ImageContainer(src, false);
          } else if (this.support.cors && !this.options.allowTaint && this.options.useCORS) {
              return new ImageContainer(src, true);
          } else if (this.options.proxy) {
              return new ProxyImageContainer(src, this.options.proxy);
          } else {
              return new DummyImageContainer(src);
          }
      } else if (imageData.method === "linear-gradient") {
          return new LinearGradientContainer(imageData);
      } else if (imageData.method === "gradient") {
          return new WebkitGradientContainer(imageData);
      } else if (imageData.method === "svg") {
          return new SVGNodeContainer(imageData.args[0], this.support.svg);
      } else if (imageData.method === "IFRAME") {
          return new FrameContainer(imageData.args[0], this.isSameOrigin(imageData.args[0].src), this.options);
      } else {
          return new DummyImageContainer(imageData);
      }
  };

  ImageLoader.prototype.isSVG = function(src) {
      return src.substring(src.length - 3).toLowerCase() === "svg" || SVGContainer.prototype.isInline(src);
  };

  ImageLoader.prototype.imageExists = function(images, src) {
      return images.some(function(image) {
          return image.src === src;
      });
  };

  ImageLoader.prototype.isSameOrigin = function(url) {
      return (this.getOrigin(url) === this.origin);
  };

  ImageLoader.prototype.getOrigin = function(url) {
      var link = this.link || (this.link = document.createElement("a"));
      link.href = url;
      link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
      return link.protocol + link.hostname + link.port;
  };

  ImageLoader.prototype.getPromise = function(container) {
      return this.timeout(container, this.options.imageTimeout)['catch'](function() {
          var dummy = new DummyImageContainer(container.src);
          return dummy.promise.then(function(image) {
              container.image = image;
          });
      });
  };

  ImageLoader.prototype.get = function(src) {
      var found = null;
      return this.images.some(function(img) {
          return (found = img).src === src;
      }) ? found : null;
  };

  ImageLoader.prototype.fetch = function(nodes) {
      this.images = nodes.reduce(bind(this.findBackgroundImage, this), this.findImages(nodes));
      this.images.forEach(function(image, index) {
          image.promise.then(function() {
              log("Succesfully loaded image #"+ (index+1), image);
          }, function(e) {
              log("Failed loading image #"+ (index+1), image, e);
          });
      });
      this.ready = Promise.all(this.images.map(this.getPromise, this));
      log("Finished searching images");
      return this;
  };

  ImageLoader.prototype.timeout = function(container, timeout) {
      var timer;
      var promise = Promise.race([container.promise, new Promise(function(res, reject) {
          timer = setTimeout(function() {
              log("Timed out loading image", container);
              reject(container);
          }, timeout);
      })]).then(function(container) {
          clearTimeout(timer);
          return container;
      });
      promise['catch'](function() {
          clearTimeout(timer);
      });
      return promise;
  };

  module.exports = ImageLoader;

  },{"./dummyimagecontainer":5,"./framecontainer":8,"./imagecontainer":10,"./lineargradientcontainer":12,"./log":13,"./proxyimagecontainer":17,"./svgcontainer":23,"./svgnodecontainer":24,"./utils":26,"./webkitgradientcontainer":27}],12:[function(_dereq_,module,exports){
  var GradientContainer = _dereq_('./gradientcontainer');
  var Color = _dereq_('./color');

  function LinearGradientContainer(imageData) {
      GradientContainer.apply(this, arguments);
      this.type = GradientContainer.TYPES.LINEAR;

      var hasDirection = LinearGradientContainer.REGEXP_DIRECTION.test( imageData.args[0] ) ||
          !GradientContainer.REGEXP_COLORSTOP.test( imageData.args[0] );

      if (hasDirection) {
          imageData.args[0].split(/\s+/).reverse().forEach(function(position, index) {
              switch(position) {
              case "left":
                  this.x0 = 0;
                  this.x1 = 1;
                  break;
              case "top":
                  this.y0 = 0;
                  this.y1 = 1;
                  break;
              case "right":
                  this.x0 = 1;
                  this.x1 = 0;
                  break;
              case "bottom":
                  this.y0 = 1;
                  this.y1 = 0;
                  break;
              case "to":
                  var y0 = this.y0;
                  var x0 = this.x0;
                  this.y0 = this.y1;
                  this.x0 = this.x1;
                  this.x1 = x0;
                  this.y1 = y0;
                  break;
              case "center":
                  break; // centered by default
              // Firefox internally converts position keywords to percentages:
              // http://www.w3.org/TR/2010/WD-CSS2-20101207/colors.html#propdef-background-position
              default: // percentage or absolute length
                  // TODO: support absolute start point positions (e.g., use bounds to convert px to a ratio)
                  var ratio = parseFloat(position, 10) * 1e-2;
                  if (isNaN(ratio)) { // invalid or unhandled value
                      break;
                  }
                  if (index === 0) {
                      this.y0 = ratio;
                      this.y1 = 1 - this.y0;
                  } else {
                      this.x0 = ratio;
                      this.x1 = 1 - this.x0;
                  }
                  break;
              }
          }, this);
      } else {
          this.y0 = 0;
          this.y1 = 1;
      }

      this.colorStops = imageData.args.slice(hasDirection ? 1 : 0).map(function(colorStop) {
          var colorStopMatch = colorStop.match(GradientContainer.REGEXP_COLORSTOP);
          var value = +colorStopMatch[2];
          var unit = value === 0 ? "%" : colorStopMatch[3]; // treat "0" as "0%"
          return {
              color: new Color(colorStopMatch[1]),
              // TODO: support absolute stop positions (e.g., compute gradient line length & convert px to ratio)
              stop: unit === "%" ? value / 100 : null
          };
      });

      if (this.colorStops[0].stop === null) {
          this.colorStops[0].stop = 0;
      }

      if (this.colorStops[this.colorStops.length - 1].stop === null) {
          this.colorStops[this.colorStops.length - 1].stop = 1;
      }

      // calculates and fills-in explicit stop positions when omitted from rule
      this.colorStops.forEach(function(colorStop, index) {
          if (colorStop.stop === null) {
              this.colorStops.slice(index).some(function(find, count) {
                  if (find.stop !== null) {
                      colorStop.stop = ((find.stop - this.colorStops[index - 1].stop) / (count + 1)) + this.colorStops[index - 1].stop;
                      return true;
                  } else {
                      return false;
                  }
              }, this);
          }
      }, this);
  }

  LinearGradientContainer.prototype = Object.create(GradientContainer.prototype);

  // TODO: support <angle> (e.g. -?\d{1,3}(?:\.\d+)deg, etc. : https://developer.mozilla.org/docs/Web/CSS/angle )
  LinearGradientContainer.REGEXP_DIRECTION = /^\s*(?:to|left|right|top|bottom|center|\d{1,3}(?:\.\d+)?%?)(?:\s|$)/i;

  module.exports = LinearGradientContainer;

  },{"./color":3,"./gradientcontainer":9}],13:[function(_dereq_,module,exports){
  var logger = function() {
      if (logger.options.logging && window.console && window.console.log) {
          Function.prototype.bind.call(window.console.log, (window.console)).apply(window.console, [(Date.now() - logger.options.start) + "ms", "html2canvas:"].concat([].slice.call(arguments, 0)));
      }
  };

  logger.options = {logging: false};
  module.exports = logger;

  },{}],14:[function(_dereq_,module,exports){
  var Color = _dereq_('./color');
  var utils = _dereq_('./utils');
  var getBounds = utils.getBounds;
  var parseBackgrounds = utils.parseBackgrounds;
  var offsetBounds = utils.offsetBounds;

  function NodeContainer(node, parent) {
      this.node = node;
      this.parent = parent;
      this.stack = null;
      this.bounds = null;
      this.borders = null;
      this.clip = [];
      this.backgroundClip = [];
      this.offsetBounds = null;
      this.visible = null;
      this.computedStyles = null;
      this.colors = {};
      this.styles = {};
      this.backgroundImages = null;
      this.transformData = null;
      this.transformMatrix = null;
      this.isPseudoElement = false;
      this.opacity = null;
  }

  NodeContainer.prototype.cloneTo = function(stack) {
      stack.visible = this.visible;
      stack.borders = this.borders;
      stack.bounds = this.bounds;
      stack.clip = this.clip;
      stack.backgroundClip = this.backgroundClip;
      stack.computedStyles = this.computedStyles;
      stack.styles = this.styles;
      stack.backgroundImages = this.backgroundImages;
      stack.opacity = this.opacity;
  };

  NodeContainer.prototype.getOpacity = function() {
      return this.opacity === null ? (this.opacity = this.cssFloat('opacity')) : this.opacity;
  };

  NodeContainer.prototype.assignStack = function(stack) {
      this.stack = stack;
      stack.children.push(this);
  };

  NodeContainer.prototype.isElementVisible = function() {
      return this.node.nodeType === Node.TEXT_NODE ? this.parent.visible : (
          this.css('display') !== "none" &&
          this.css('visibility') !== "hidden" &&
          !this.node.hasAttribute("data-html2canvas-ignore") &&
          (this.node.nodeName !== "INPUT" || this.node.getAttribute("type") !== "hidden")
      );
  };

  NodeContainer.prototype.css = function(attribute) {
      if (!this.computedStyles) {
          this.computedStyles = this.isPseudoElement ? this.parent.computedStyle(this.before ? ":before" : ":after") : this.computedStyle(null);
      }

      return this.styles[attribute] || (this.styles[attribute] = this.computedStyles[attribute]);
  };

  NodeContainer.prototype.prefixedCss = function(attribute) {
      var prefixes = ["webkit", "moz", "ms", "o"];
      var value = this.css(attribute);
      if (value === undefined) {
          prefixes.some(function(prefix) {
              value = this.css(prefix + attribute.substr(0, 1).toUpperCase() + attribute.substr(1));
              return value !== undefined;
          }, this);
      }
      return value === undefined ? null : value;
  };

  NodeContainer.prototype.computedStyle = function(type) {
      return this.node.ownerDocument.defaultView.getComputedStyle(this.node, type);
  };

  NodeContainer.prototype.cssInt = function(attribute) {
      var value = parseInt(this.css(attribute), 10);
      return (isNaN(value)) ? 0 : value; // borders in old IE are throwing 'medium' for demo.html
  };

  NodeContainer.prototype.color = function(attribute) {
      return this.colors[attribute] || (this.colors[attribute] = new Color(this.css(attribute)));
  };

  NodeContainer.prototype.cssFloat = function(attribute) {
      var value = parseFloat(this.css(attribute));
      return (isNaN(value)) ? 0 : value;
  };

  NodeContainer.prototype.fontWeight = function() {
      var weight = this.css("fontWeight");
      switch(parseInt(weight, 10)){
      case 401:
          weight = "bold";
          break;
      case 400:
          weight = "normal";
          break;
      }
      return weight;
  };

  NodeContainer.prototype.parseClip = function() {
      var matches = this.css('clip').match(this.CLIP);
      if (matches) {
          return {
              top: parseInt(matches[1], 10),
              right: parseInt(matches[2], 10),
              bottom: parseInt(matches[3], 10),
              left: parseInt(matches[4], 10)
          };
      }
      return null;
  };

  NodeContainer.prototype.parseBackgroundImages = function() {
      return this.backgroundImages || (this.backgroundImages = parseBackgrounds(this.css("backgroundImage")));
  };

  NodeContainer.prototype.cssList = function(property, index) {
      var value = (this.css(property) || '').split(',');
      value = value[index || 0] || value[0] || 'auto';
      value = value.trim().split(' ');
      if (value.length === 1) {
          value = [value[0], isPercentage(value[0]) ? 'auto' : value[0]];
      }
      return value;
  };

  NodeContainer.prototype.parseBackgroundSize = function(bounds, image, index) {
      var size = this.cssList("backgroundSize", index);
      var width, height;

      if (isPercentage(size[0])) {
          width = bounds.width * parseFloat(size[0]) / 100;
      } else if (/contain|cover/.test(size[0])) {
          var targetRatio = bounds.width / bounds.height, currentRatio = image.width / image.height;
          return (targetRatio < currentRatio ^ size[0] === 'contain') ?  {width: bounds.height * currentRatio, height: bounds.height} : {width: bounds.width, height: bounds.width / currentRatio};
      } else {
          width = parseInt(size[0], 10);
      }

      if (size[0] === 'auto' && size[1] === 'auto') {
          height = image.height;
      } else if (size[1] === 'auto') {
          height = width / image.width * image.height;
      } else if (isPercentage(size[1])) {
          height =  bounds.height * parseFloat(size[1]) / 100;
      } else {
          height = parseInt(size[1], 10);
      }

      if (size[0] === 'auto') {
          width = height / image.height * image.width;
      }

      return {width: width, height: height};
  };

  NodeContainer.prototype.parseBackgroundPosition = function(bounds, image, index, backgroundSize) {
      var position = this.cssList('backgroundPosition', index);
      var left, top;

      if (isPercentage(position[0])){
          left = (bounds.width - (backgroundSize || image).width) * (parseFloat(position[0]) / 100);
      } else {
          left = parseInt(position[0], 10);
      }

      if (position[1] === 'auto') {
          top = left / image.width * image.height;
      } else if (isPercentage(position[1])){
          top =  (bounds.height - (backgroundSize || image).height) * parseFloat(position[1]) / 100;
      } else {
          top = parseInt(position[1], 10);
      }

      if (position[0] === 'auto') {
          left = top / image.height * image.width;
      }

      return {left: left, top: top};
  };

  NodeContainer.prototype.parseBackgroundRepeat = function(index) {
      return this.cssList("backgroundRepeat", index)[0];
  };

  NodeContainer.prototype.parseTextShadows = function() {
      var textShadow = this.css("textShadow");
      var results = [];

      if (textShadow && textShadow !== 'none') {
          var shadows = textShadow.match(this.TEXT_SHADOW_PROPERTY);
          for (var i = 0; shadows && (i < shadows.length); i++) {
              var s = shadows[i].match(this.TEXT_SHADOW_VALUES);
              results.push({
                  color: new Color(s[0]),
                  offsetX: s[1] ? parseFloat(s[1].replace('px', '')) : 0,
                  offsetY: s[2] ? parseFloat(s[2].replace('px', '')) : 0,
                  blur: s[3] ? s[3].replace('px', '') : 0
              });
          }
      }
      return results;
  };

  NodeContainer.prototype.parseTransform = function() {
      if (!this.transformData) {
          if (this.hasTransform()) {
              var offset = this.parseBounds();
              var origin = this.prefixedCss("transformOrigin").split(" ").map(removePx).map(asFloat);
              origin[0] += offset.left;
              origin[1] += offset.top;
              this.transformData = {
                  origin: origin,
                  matrix: this.parseTransformMatrix()
              };
          } else {
              this.transformData = {
                  origin: [0, 0],
                  matrix: [1, 0, 0, 1, 0, 0]
              };
          }
      }
      return this.transformData;
  };

  NodeContainer.prototype.parseTransformMatrix = function() {
      if (!this.transformMatrix) {
          var transform = this.prefixedCss("transform");
          var matrix = transform ? parseMatrix(transform.match(this.MATRIX_PROPERTY)) : null;
          this.transformMatrix = matrix ? matrix : [1, 0, 0, 1, 0, 0];
      }
      return this.transformMatrix;
  };

  NodeContainer.prototype.parseBounds = function() {
      return this.bounds || (this.bounds = this.hasTransform() ? offsetBounds(this.node) : getBounds(this.node));
  };

  NodeContainer.prototype.hasTransform = function() {
      return this.parseTransformMatrix().join(",") !== "1,0,0,1,0,0" || (this.parent && this.parent.hasTransform());
  };

  NodeContainer.prototype.getValue = function() {
      var value = this.node.value || "";
      if (this.node.tagName === "SELECT") {
          value = selectionValue(this.node);
      } else if (this.node.type === "password") {
          value = Array(value.length + 1).join('\u2022'); // jshint ignore:line
      }
      return value.length === 0 ? (this.node.placeholder || "") : value;
  };

  NodeContainer.prototype.MATRIX_PROPERTY = /(matrix|matrix3d)\((.+)\)/;
  NodeContainer.prototype.TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g;
  NodeContainer.prototype.TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g;
  NodeContainer.prototype.CLIP = /^rect\((\d+)px,? (\d+)px,? (\d+)px,? (\d+)px\)$/;

  function selectionValue(node) {
      var option = node.options[node.selectedIndex || 0];
      return option ? (option.text || "") : "";
  }

  function parseMatrix(match) {
      if (match && match[1] === "matrix") {
          return match[2].split(",").map(function(s) {
              return parseFloat(s.trim());
          });
      } else if (match && match[1] === "matrix3d") {
          var matrix3d = match[2].split(",").map(function(s) {
            return parseFloat(s.trim());
          });
          return [matrix3d[0], matrix3d[1], matrix3d[4], matrix3d[5], matrix3d[12], matrix3d[13]];
      }
  }

  function isPercentage(value) {
      return value.toString().indexOf("%") !== -1;
  }

  function removePx(str) {
      return str.replace("px", "");
  }

  function asFloat(str) {
      return parseFloat(str);
  }

  module.exports = NodeContainer;

  },{"./color":3,"./utils":26}],15:[function(_dereq_,module,exports){
  var log = _dereq_('./log');
  var punycode = _dereq_('punycode');
  var NodeContainer = _dereq_('./nodecontainer');
  var TextContainer = _dereq_('./textcontainer');
  var PseudoElementContainer = _dereq_('./pseudoelementcontainer');
  var FontMetrics = _dereq_('./fontmetrics');
  var Color = _dereq_('./color');
  var StackingContext = _dereq_('./stackingcontext');
  var utils = _dereq_('./utils');
  var bind = utils.bind;
  var getBounds = utils.getBounds;
  var parseBackgrounds = utils.parseBackgrounds;
  var offsetBounds = utils.offsetBounds;

  function NodeParser(element, renderer, support, imageLoader, options) {
      log("Starting NodeParser");
      this.renderer = renderer;
      this.options = options;
      this.range = null;
      this.support = support;
      this.renderQueue = [];
      this.stack = new StackingContext(true, 1, element.ownerDocument, null);
      var parent = new NodeContainer(element, null);
      if (options.background) {
          renderer.rectangle(0, 0, renderer.width, renderer.height, new Color(options.background));
      }
      if (element === element.ownerDocument.documentElement) {
          // http://www.w3.org/TR/css3-background/#special-backgrounds
          var canvasBackground = new NodeContainer(parent.color('backgroundColor').isTransparent() ? element.ownerDocument.body : element.ownerDocument.documentElement, null);
          renderer.rectangle(0, 0, renderer.width, renderer.height, canvasBackground.color('backgroundColor'));
      }
      parent.visibile = parent.isElementVisible();
      this.createPseudoHideStyles(element.ownerDocument);
      this.disableAnimations(element.ownerDocument);
      this.nodes = flatten([parent].concat(this.getChildren(parent)).filter(function(container) {
          return container.visible = container.isElementVisible();
      }).map(this.getPseudoElements, this));
      this.fontMetrics = new FontMetrics();
      log("Fetched nodes, total:", this.nodes.length);
      log("Calculate overflow clips");
      this.calculateOverflowClips();
      log("Start fetching images");
      this.images = imageLoader.fetch(this.nodes.filter(isElement));
      this.ready = this.images.ready.then(bind(function() {
          log("Images loaded, starting parsing");
          log("Creating stacking contexts");
          this.createStackingContexts();
          log("Sorting stacking contexts");
          this.sortStackingContexts(this.stack);
          this.parse(this.stack);
          log("Render queue created with " + this.renderQueue.length + " items");
          return new Promise(bind(function(resolve) {
              if (!options.async) {
                  this.renderQueue.forEach(this.paint, this);
                  resolve();
              } else if (typeof(options.async) === "function") {
                  options.async.call(this, this.renderQueue, resolve);
              } else if (this.renderQueue.length > 0){
                  this.renderIndex = 0;
                  this.asyncRenderer(this.renderQueue, resolve);
              } else {
                  resolve();
              }
          }, this));
      }, this));
  }

  NodeParser.prototype.calculateOverflowClips = function() {
      this.nodes.forEach(function(container) {
          if (isElement(container)) {
              if (isPseudoElement(container)) {
                  container.appendToDOM();
              }
              container.borders = this.parseBorders(container);
              var clip = (container.css('overflow') === "hidden") ? [container.borders.clip] : [];
              var cssClip = container.parseClip();
              if (cssClip && ["absolute", "fixed"].indexOf(container.css('position')) !== -1) {
                  clip.push([["rect",
                          container.bounds.left + cssClip.left,
                          container.bounds.top + cssClip.top,
                          cssClip.right - cssClip.left,
                          cssClip.bottom - cssClip.top
                  ]]);
              }
              container.clip = hasParentClip(container) ? container.parent.clip.concat(clip) : clip;
              container.backgroundClip = (container.css('overflow') !== "hidden") ? container.clip.concat([container.borders.clip]) : container.clip;
              if (isPseudoElement(container)) {
                  container.cleanDOM();
              }
          } else if (isTextNode(container)) {
              container.clip = hasParentClip(container) ? container.parent.clip : [];
          }
          if (!isPseudoElement(container)) {
              container.bounds = null;
          }
      }, this);
  };

  function hasParentClip(container) {
      return container.parent && container.parent.clip.length;
  }

  NodeParser.prototype.asyncRenderer = function(queue, resolve, asyncTimer) {
      asyncTimer = asyncTimer || Date.now();
      this.paint(queue[this.renderIndex++]);
      if (queue.length === this.renderIndex) {
          resolve();
      } else if (asyncTimer + 20 > Date.now()) {
          this.asyncRenderer(queue, resolve, asyncTimer);
      } else {
          setTimeout(bind(function() {
              this.asyncRenderer(queue, resolve);
          }, this), 0);
      }
  };

  NodeParser.prototype.createPseudoHideStyles = function(document) {
      this.createStyles(document, '.' + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + ':before { content: "" !important; display: none !important; }' +
          '.' + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER + ':after { content: "" !important; display: none !important; }');
  };

  NodeParser.prototype.disableAnimations = function(document) {
      this.createStyles(document, '* { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; ' +
          '-webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important;}');
  };

  NodeParser.prototype.createStyles = function(document, styles) {
      var hidePseudoElements = document.createElement('style');
      hidePseudoElements.innerHTML = styles;
      document.body.appendChild(hidePseudoElements);
  };

  NodeParser.prototype.getPseudoElements = function(container) {
      var nodes = [[container]];
      if (container.node.nodeType === Node.ELEMENT_NODE) {
          var before = this.getPseudoElement(container, ":before");
          var after = this.getPseudoElement(container, ":after");

          if (before) {
              nodes.push(before);
          }

          if (after) {
              nodes.push(after);
          }
      }
      return flatten(nodes);
  };

  function toCamelCase(str) {
      return str.replace(/(\-[a-z])/g, function(match){
          return match.toUpperCase().replace('-','');
      });
  }

  NodeParser.prototype.getPseudoElement = function(container, type) {
      var style = container.computedStyle(type);
      if(!style || !style.content || style.content === "none" || style.content === "-moz-alt-content" || style.display === "none") {
          return null;
      }

      var content = stripQuotes(style.content);
      var isImage = content.substr(0, 3) === 'url';
      var pseudoNode = document.createElement(isImage ? 'img' : 'html2canvaspseudoelement');
      var pseudoContainer = new PseudoElementContainer(pseudoNode, container, type);

      for (var i = style.length-1; i >= 0; i--) {
          var property = toCamelCase(style.item(i));
          pseudoNode.style[property] = style[property];
      }

      pseudoNode.className = PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER;

      if (isImage) {
          pseudoNode.src = parseBackgrounds(content)[0].args[0];
          return [pseudoContainer];
      } else {
          var text = document.createTextNode(content);
          pseudoNode.appendChild(text);
          return [pseudoContainer, new TextContainer(text, pseudoContainer)];
      }
  };


  NodeParser.prototype.getChildren = function(parentContainer) {
      return flatten([].filter.call(parentContainer.node.childNodes, renderableNode).map(function(node) {
          var container = [node.nodeType === Node.TEXT_NODE ? new TextContainer(node, parentContainer) : new NodeContainer(node, parentContainer)].filter(nonIgnoredElement);
          return node.nodeType === Node.ELEMENT_NODE && container.length && node.tagName !== "TEXTAREA" ? (container[0].isElementVisible() ? container.concat(this.getChildren(container[0])) : []) : container;
      }, this));
  };

  NodeParser.prototype.newStackingContext = function(container, hasOwnStacking) {
      var stack = new StackingContext(hasOwnStacking, container.getOpacity(), container.node, container.parent);
      container.cloneTo(stack);
      var parentStack = hasOwnStacking ? stack.getParentStack(this) : stack.parent.stack;
      parentStack.contexts.push(stack);
      container.stack = stack;
  };

  NodeParser.prototype.createStackingContexts = function() {
      this.nodes.forEach(function(container) {
          if (isElement(container) && (this.isRootElement(container) || hasOpacity(container) || isPositionedForStacking(container) || this.isBodyWithTransparentRoot(container) || container.hasTransform())) {
              this.newStackingContext(container, true);
          } else if (isElement(container) && ((isPositioned(container) && zIndex0(container)) || isInlineBlock(container) || isFloating(container))) {
              this.newStackingContext(container, false);
          } else {
              container.assignStack(container.parent.stack);
          }
      }, this);
  };

  NodeParser.prototype.isBodyWithTransparentRoot = function(container) {
      return container.node.nodeName === "BODY" && container.parent.color('backgroundColor').isTransparent();
  };

  NodeParser.prototype.isRootElement = function(container) {
      return container.parent === null;
  };

  NodeParser.prototype.sortStackingContexts = function(stack) {
      stack.contexts.sort(zIndexSort(stack.contexts.slice(0)));
      stack.contexts.forEach(this.sortStackingContexts, this);
  };

  NodeParser.prototype.parseTextBounds = function(container) {
      return function(text, index, textList) {
          if (container.parent.css("textDecoration").substr(0, 4) !== "none" || text.trim().length !== 0) {
              if (this.support.rangeBounds && !container.parent.hasTransform()) {
                  var offset = textList.slice(0, index).join("").length;
                  return this.getRangeBounds(container.node, offset, text.length);
              } else if (container.node && typeof(container.node.data) === "string") {
                  var replacementNode = container.node.splitText(text.length);
                  var bounds = this.getWrapperBounds(container.node, container.parent.hasTransform());
                  container.node = replacementNode;
                  return bounds;
              }
          } else if(!this.support.rangeBounds || container.parent.hasTransform()){
              container.node = container.node.splitText(text.length);
          }
          return {};
      };
  };

  NodeParser.prototype.getWrapperBounds = function(node, transform) {
      var wrapper = node.ownerDocument.createElement('html2canvaswrapper');
      var parent = node.parentNode,
          backupText = node.cloneNode(true);

      wrapper.appendChild(node.cloneNode(true));
      parent.replaceChild(wrapper, node);
      var bounds = transform ? offsetBounds(wrapper) : getBounds(wrapper);
      parent.replaceChild(backupText, wrapper);
      return bounds;
  };

  NodeParser.prototype.getRangeBounds = function(node, offset, length) {
      var range = this.range || (this.range = node.ownerDocument.createRange());
      range.setStart(node, offset);
      range.setEnd(node, offset + length);
      return range.getBoundingClientRect();
  };

  function ClearTransform() {}

  NodeParser.prototype.parse = function(stack) {
      // http://www.w3.org/TR/CSS21/visuren.html#z-index
      var negativeZindex = stack.contexts.filter(negativeZIndex); // 2. the child stacking contexts with negative stack levels (most negative first).
      var descendantElements = stack.children.filter(isElement);
      var descendantNonFloats = descendantElements.filter(not(isFloating));
      var nonInlineNonPositionedDescendants = descendantNonFloats.filter(not(isPositioned)).filter(not(inlineLevel)); // 3 the in-flow, non-inline-level, non-positioned descendants.
      var nonPositionedFloats = descendantElements.filter(not(isPositioned)).filter(isFloating); // 4. the non-positioned floats.
      var inFlow = descendantNonFloats.filter(not(isPositioned)).filter(inlineLevel); // 5. the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
      var stackLevel0 = stack.contexts.concat(descendantNonFloats.filter(isPositioned)).filter(zIndex0); // 6. the child stacking contexts with stack level 0 and the positioned descendants with stack level 0.
      var text = stack.children.filter(isTextNode).filter(hasText);
      var positiveZindex = stack.contexts.filter(positiveZIndex); // 7. the child stacking contexts with positive stack levels (least positive first).
      negativeZindex.concat(nonInlineNonPositionedDescendants).concat(nonPositionedFloats)
          .concat(inFlow).concat(stackLevel0).concat(text).concat(positiveZindex).forEach(function(container) {
              this.renderQueue.push(container);
              if (isStackingContext(container)) {
                  this.parse(container);
                  this.renderQueue.push(new ClearTransform());
              }
          }, this);
  };

  NodeParser.prototype.paint = function(container) {
      try {
          if (container instanceof ClearTransform) {
              this.renderer.ctx.restore();
          } else if (isTextNode(container)) {
              if (isPseudoElement(container.parent)) {
                  container.parent.appendToDOM();
              }
              this.paintText(container);
              if (isPseudoElement(container.parent)) {
                  container.parent.cleanDOM();
              }
          } else {
              this.paintNode(container);
          }
      } catch(e) {
          log(e);
          if (this.options.strict) {
              throw e;
          }
      }
  };

  NodeParser.prototype.paintNode = function(container) {
      if (isStackingContext(container)) {
          this.renderer.setOpacity(container.opacity);
          this.renderer.ctx.save();
          if (container.hasTransform()) {
              this.renderer.setTransform(container.parseTransform());
          }
      }

      if (container.node.nodeName === "INPUT" && container.node.type === "checkbox") {
          this.paintCheckbox(container);
      } else if (container.node.nodeName === "INPUT" && container.node.type === "radio") {
          this.paintRadio(container);
      } else {
          this.paintElement(container);
      }
  };

  NodeParser.prototype.paintElement = function(container) {
      var bounds = container.parseBounds();
      this.renderer.clip(container.backgroundClip, function() {
          this.renderer.renderBackground(container, bounds, container.borders.borders.map(getWidth));
      }, this);

      this.renderer.clip(container.clip, function() {
          this.renderer.renderBorders(container.borders.borders);
      }, this);

      this.renderer.clip(container.backgroundClip, function() {
          switch (container.node.nodeName) {
          case "svg":
          case "IFRAME":
              var imgContainer = this.images.get(container.node);
              if (imgContainer) {
                  this.renderer.renderImage(container, bounds, container.borders, imgContainer);
              } else {
                  log("Error loading <" + container.node.nodeName + ">", container.node);
              }
              break;
          case "IMG":
              var imageContainer = this.images.get(container.node.src);
              if (imageContainer) {
                  this.renderer.renderImage(container, bounds, container.borders, imageContainer);
              } else {
                  log("Error loading <img>", container.node.src);
              }
              break;
          case "CANVAS":
              this.renderer.renderImage(container, bounds, container.borders, {image: container.node});
              break;
          case "SELECT":
          case "INPUT":
          case "TEXTAREA":
              this.paintFormValue(container);
              break;
          }
      }, this);
  };

  NodeParser.prototype.paintCheckbox = function(container) {
      var b = container.parseBounds();

      var size = Math.min(b.width, b.height);
      var bounds = {width: size - 1, height: size - 1, top: b.top, left: b.left};
      var r = [3, 3];
      var radius = [r, r, r, r];
      var borders = [1,1,1,1].map(function(w) {
          return {color: new Color('#A5A5A5'), width: w};
      });

      var borderPoints = calculateCurvePoints(bounds, radius, borders);

      this.renderer.clip(container.backgroundClip, function() {
          this.renderer.rectangle(bounds.left + 1, bounds.top + 1, bounds.width - 2, bounds.height - 2, new Color("#DEDEDE"));
          this.renderer.renderBorders(calculateBorders(borders, bounds, borderPoints, radius));
          if (container.node.checked) {
              this.renderer.font(new Color('#424242'), 'normal', 'normal', 'bold', (size - 3) + "px", 'arial');
              this.renderer.text("\u2714", bounds.left + size / 6, bounds.top + size - 1);
          }
      }, this);
  };

  NodeParser.prototype.paintRadio = function(container) {
      var bounds = container.parseBounds();

      var size = Math.min(bounds.width, bounds.height) - 2;

      this.renderer.clip(container.backgroundClip, function() {
          this.renderer.circleStroke(bounds.left + 1, bounds.top + 1, size, new Color('#DEDEDE'), 1, new Color('#A5A5A5'));
          if (container.node.checked) {
              this.renderer.circle(Math.ceil(bounds.left + size / 4) + 1, Math.ceil(bounds.top + size / 4) + 1, Math.floor(size / 2), new Color('#424242'));
          }
      }, this);
  };

  NodeParser.prototype.paintFormValue = function(container) {
      var value = container.getValue();
      if (value.length > 0) {
          var document = container.node.ownerDocument;
          var wrapper = document.createElement('html2canvaswrapper');
          var properties = ['lineHeight', 'textAlign', 'fontFamily', 'fontWeight', 'fontSize', 'color',
              'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom',
              'width', 'height', 'borderLeftStyle', 'borderTopStyle', 'borderLeftWidth', 'borderTopWidth',
              'boxSizing', 'whiteSpace', 'wordWrap'];

          properties.forEach(function(property) {
              try {
                  wrapper.style[property] = container.css(property);
              } catch(e) {
                  // Older IE has issues with "border"
                  log("html2canvas: Parse: Exception caught in renderFormValue: " + e.message);
              }
          });
          var bounds = container.parseBounds();
          wrapper.style.position = "fixed";
          wrapper.style.left = bounds.left + "px";
          wrapper.style.top = bounds.top + "px";
          wrapper.textContent = value;
          document.body.appendChild(wrapper);
          this.paintText(new TextContainer(wrapper.firstChild, container));
          document.body.removeChild(wrapper);
      }
  };

  NodeParser.prototype.paintText = function(container) {
      container.applyTextTransform();
      var characters = punycode.ucs2.decode(container.node.data);
      var textList = (!this.options.letterRendering || noLetterSpacing(container)) && !hasUnicode(container.node.data) ? getWords(characters) : characters.map(function(character) {
          return punycode.ucs2.encode([character]);
      });

      var weight = container.parent.fontWeight();
      var size = container.parent.css('fontSize');
      var family = container.parent.css('fontFamily');
      var shadows = container.parent.parseTextShadows();

      this.renderer.font(container.parent.color('color'), container.parent.css('fontStyle'), container.parent.css('fontVariant'), weight, size, family);
      if (shadows.length) {
          // TODO: support multiple text shadows
          this.renderer.fontShadow(shadows[0].color, shadows[0].offsetX, shadows[0].offsetY, shadows[0].blur);
      } else {
          this.renderer.clearShadow();
      }

      this.renderer.clip(container.parent.clip, function() {
          textList.map(this.parseTextBounds(container), this).forEach(function(bounds, index) {
              if (bounds) {
                  this.renderer.text(textList[index], bounds.left, bounds.bottom);
                  this.renderTextDecoration(container.parent, bounds, this.fontMetrics.getMetrics(family, size));
              }
          }, this);
      }, this);
  };

  NodeParser.prototype.renderTextDecoration = function(container, bounds, metrics) {
      switch(container.css("textDecoration").split(" ")[0]) {
      case "underline":
          // Draws a line at the baseline of the font
          // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size
          this.renderer.rectangle(bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, container.color("color"));
          break;
      case "overline":
          this.renderer.rectangle(bounds.left, Math.round(bounds.top), bounds.width, 1, container.color("color"));
          break;
      case "line-through":
          // TODO try and find exact position for line-through
          this.renderer.rectangle(bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, container.color("color"));
          break;
      }
  };

  var borderColorTransforms = {
      inset: [
          ["darken", 0.60],
          ["darken", 0.10],
          ["darken", 0.10],
          ["darken", 0.60]
      ]
  };

  NodeParser.prototype.parseBorders = function(container) {
      var nodeBounds = container.parseBounds();
      var radius = getBorderRadiusData(container);
      var borders = ["Top", "Right", "Bottom", "Left"].map(function(side, index) {
          var style = container.css('border' + side + 'Style');
          var color = container.color('border' + side + 'Color');
          if (style === "inset" && color.isBlack()) {
              color = new Color([255, 255, 255, color.a]); // this is wrong, but
          }
          var colorTransform = borderColorTransforms[style] ? borderColorTransforms[style][index] : null;
          return {
              width: container.cssInt('border' + side + 'Width'),
              color: colorTransform ? color[colorTransform[0]](colorTransform[1]) : color,
              args: null
          };
      });
      var borderPoints = calculateCurvePoints(nodeBounds, radius, borders);

      return {
          clip: this.parseBackgroundClip(container, borderPoints, borders, radius, nodeBounds),
          borders: calculateBorders(borders, nodeBounds, borderPoints, radius)
      };
  };

  function calculateBorders(borders, nodeBounds, borderPoints, radius) {
      return borders.map(function(border, borderSide) {
          if (border.width > 0) {
              var bx = nodeBounds.left;
              var by = nodeBounds.top;
              var bw = nodeBounds.width;
              var bh = nodeBounds.height - (borders[2].width);

              switch(borderSide) {
              case 0:
                  // top border
                  bh = borders[0].width;
                  border.args = drawSide({
                          c1: [bx, by],
                          c2: [bx + bw, by],
                          c3: [bx + bw - borders[1].width, by + bh],
                          c4: [bx + borders[3].width, by + bh]
                      }, radius[0], radius[1],
                      borderPoints.topLeftOuter, borderPoints.topLeftInner, borderPoints.topRightOuter, borderPoints.topRightInner);
                  break;
              case 1:
                  // right border
                  bx = nodeBounds.left + nodeBounds.width - (borders[1].width);
                  bw = borders[1].width;

                  border.args = drawSide({
                          c1: [bx + bw, by],
                          c2: [bx + bw, by + bh + borders[2].width],
                          c3: [bx, by + bh],
                          c4: [bx, by + borders[0].width]
                      }, radius[1], radius[2],
                      borderPoints.topRightOuter, borderPoints.topRightInner, borderPoints.bottomRightOuter, borderPoints.bottomRightInner);
                  break;
              case 2:
                  // bottom border
                  by = (by + nodeBounds.height) - (borders[2].width);
                  bh = borders[2].width;
                  border.args = drawSide({
                          c1: [bx + bw, by + bh],
                          c2: [bx, by + bh],
                          c3: [bx + borders[3].width, by],
                          c4: [bx + bw - borders[3].width, by]
                      }, radius[2], radius[3],
                      borderPoints.bottomRightOuter, borderPoints.bottomRightInner, borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner);
                  break;
              case 3:
                  // left border
                  bw = borders[3].width;
                  border.args = drawSide({
                          c1: [bx, by + bh + borders[2].width],
                          c2: [bx, by],
                          c3: [bx + bw, by + borders[0].width],
                          c4: [bx + bw, by + bh]
                      }, radius[3], radius[0],
                      borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner, borderPoints.topLeftOuter, borderPoints.topLeftInner);
                  break;
              }
          }
          return border;
      });
  }

  NodeParser.prototype.parseBackgroundClip = function(container, borderPoints, borders, radius, bounds) {
      var backgroundClip = container.css('backgroundClip'),
          borderArgs = [];

      switch(backgroundClip) {
      case "content-box":
      case "padding-box":
          parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftInner, borderPoints.topRightInner, bounds.left + borders[3].width, bounds.top + borders[0].width);
          parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightInner, borderPoints.bottomRightInner, bounds.left + bounds.width - borders[1].width, bounds.top + borders[0].width);
          parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightInner, borderPoints.bottomLeftInner, bounds.left + bounds.width - borders[1].width, bounds.top + bounds.height - borders[2].width);
          parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftInner, borderPoints.topLeftInner, bounds.left + borders[3].width, bounds.top + bounds.height - borders[2].width);
          break;

      default:
          parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftOuter, borderPoints.topRightOuter, bounds.left, bounds.top);
          parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightOuter, borderPoints.bottomRightOuter, bounds.left + bounds.width, bounds.top);
          parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightOuter, borderPoints.bottomLeftOuter, bounds.left + bounds.width, bounds.top + bounds.height);
          parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftOuter, borderPoints.topLeftOuter, bounds.left, bounds.top + bounds.height);
          break;
      }

      return borderArgs;
  };

  function getCurvePoints(x, y, r1, r2) {
      var kappa = 4 * ((Math.sqrt(2) - 1) / 3);
      var ox = (r1) * kappa, // control point offset horizontal
          oy = (r2) * kappa, // control point offset vertical
          xm = x + r1, // x-middle
          ym = y + r2; // y-middle
      return {
          topLeft: bezierCurve({x: x, y: ym}, {x: x, y: ym - oy}, {x: xm - ox, y: y}, {x: xm, y: y}),
          topRight: bezierCurve({x: x, y: y}, {x: x + ox,y: y}, {x: xm, y: ym - oy}, {x: xm, y: ym}),
          bottomRight: bezierCurve({x: xm, y: y}, {x: xm, y: y + oy}, {x: x + ox, y: ym}, {x: x, y: ym}),
          bottomLeft: bezierCurve({x: xm, y: ym}, {x: xm - ox, y: ym}, {x: x, y: y + oy}, {x: x, y:y})
      };
  }

  function calculateCurvePoints(bounds, borderRadius, borders) {
      var x = bounds.left,
          y = bounds.top,
          width = bounds.width,
          height = bounds.height,

          tlh = borderRadius[0][0] < width / 2 ? borderRadius[0][0] : width / 2,
          tlv = borderRadius[0][1] < height / 2 ? borderRadius[0][1] : height / 2,
          trh = borderRadius[1][0] < width / 2 ? borderRadius[1][0] : width / 2,
          trv = borderRadius[1][1] < height / 2 ? borderRadius[1][1] : height / 2,
          brh = borderRadius[2][0] < width / 2 ? borderRadius[2][0] : width / 2,
          brv = borderRadius[2][1] < height / 2 ? borderRadius[2][1] : height / 2,
          blh = borderRadius[3][0] < width / 2 ? borderRadius[3][0] : width / 2,
          blv = borderRadius[3][1] < height / 2 ? borderRadius[3][1] : height / 2;

      var topWidth = width - trh,
          rightHeight = height - brv,
          bottomWidth = width - brh,
          leftHeight = height - blv;

      return {
          topLeftOuter: getCurvePoints(x, y, tlh, tlv).topLeft.subdivide(0.5),
          topLeftInner: getCurvePoints(x + borders[3].width, y + borders[0].width, Math.max(0, tlh - borders[3].width), Math.max(0, tlv - borders[0].width)).topLeft.subdivide(0.5),
          topRightOuter: getCurvePoints(x + topWidth, y, trh, trv).topRight.subdivide(0.5),
          topRightInner: getCurvePoints(x + Math.min(topWidth, width + borders[3].width), y + borders[0].width, (topWidth > width + borders[3].width) ? 0 :trh - borders[3].width, trv - borders[0].width).topRight.subdivide(0.5),
          bottomRightOuter: getCurvePoints(x + bottomWidth, y + rightHeight, brh, brv).bottomRight.subdivide(0.5),
          bottomRightInner: getCurvePoints(x + Math.min(bottomWidth, width - borders[3].width), y + Math.min(rightHeight, height + borders[0].width), Math.max(0, brh - borders[1].width),  brv - borders[2].width).bottomRight.subdivide(0.5),
          bottomLeftOuter: getCurvePoints(x, y + leftHeight, blh, blv).bottomLeft.subdivide(0.5),
          bottomLeftInner: getCurvePoints(x + borders[3].width, y + leftHeight, Math.max(0, blh - borders[3].width), blv - borders[2].width).bottomLeft.subdivide(0.5)
      };
  }

  function bezierCurve(start, startControl, endControl, end) {
      var lerp = function (a, b, t) {
          return {
              x: a.x + (b.x - a.x) * t,
              y: a.y + (b.y - a.y) * t
          };
      };

      return {
          start: start,
          startControl: startControl,
          endControl: endControl,
          end: end,
          subdivide: function(t) {
              var ab = lerp(start, startControl, t),
                  bc = lerp(startControl, endControl, t),
                  cd = lerp(endControl, end, t),
                  abbc = lerp(ab, bc, t),
                  bccd = lerp(bc, cd, t),
                  dest = lerp(abbc, bccd, t);
              return [bezierCurve(start, ab, abbc, dest), bezierCurve(dest, bccd, cd, end)];
          },
          curveTo: function(borderArgs) {
              borderArgs.push(["bezierCurve", startControl.x, startControl.y, endControl.x, endControl.y, end.x, end.y]);
          },
          curveToReversed: function(borderArgs) {
              borderArgs.push(["bezierCurve", endControl.x, endControl.y, startControl.x, startControl.y, start.x, start.y]);
          }
      };
  }

  function drawSide(borderData, radius1, radius2, outer1, inner1, outer2, inner2) {
      var borderArgs = [];

      if (radius1[0] > 0 || radius1[1] > 0) {
          borderArgs.push(["line", outer1[1].start.x, outer1[1].start.y]);
          outer1[1].curveTo(borderArgs);
      } else {
          borderArgs.push([ "line", borderData.c1[0], borderData.c1[1]]);
      }

      if (radius2[0] > 0 || radius2[1] > 0) {
          borderArgs.push(["line", outer2[0].start.x, outer2[0].start.y]);
          outer2[0].curveTo(borderArgs);
          borderArgs.push(["line", inner2[0].end.x, inner2[0].end.y]);
          inner2[0].curveToReversed(borderArgs);
      } else {
          borderArgs.push(["line", borderData.c2[0], borderData.c2[1]]);
          borderArgs.push(["line", borderData.c3[0], borderData.c3[1]]);
      }

      if (radius1[0] > 0 || radius1[1] > 0) {
          borderArgs.push(["line", inner1[1].end.x, inner1[1].end.y]);
          inner1[1].curveToReversed(borderArgs);
      } else {
          borderArgs.push(["line", borderData.c4[0], borderData.c4[1]]);
      }

      return borderArgs;
  }

  function parseCorner(borderArgs, radius1, radius2, corner1, corner2, x, y) {
      if (radius1[0] > 0 || radius1[1] > 0) {
          borderArgs.push(["line", corner1[0].start.x, corner1[0].start.y]);
          corner1[0].curveTo(borderArgs);
          corner1[1].curveTo(borderArgs);
      } else {
          borderArgs.push(["line", x, y]);
      }

      if (radius2[0] > 0 || radius2[1] > 0) {
          borderArgs.push(["line", corner2[0].start.x, corner2[0].start.y]);
      }
  }

  function negativeZIndex(container) {
      return container.cssInt("zIndex") < 0;
  }

  function positiveZIndex(container) {
      return container.cssInt("zIndex") > 0;
  }

  function zIndex0(container) {
      return container.cssInt("zIndex") === 0;
  }

  function inlineLevel(container) {
      return ["inline", "inline-block", "inline-table"].indexOf(container.css("display")) !== -1;
  }

  function isStackingContext(container) {
      return (container instanceof StackingContext);
  }

  function hasText(container) {
      return container.node.data.trim().length > 0;
  }

  function noLetterSpacing(container) {
      return (/^(normal|none|0px)$/.test(container.parent.css("letterSpacing")));
  }

  function getBorderRadiusData(container) {
      return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function(side) {
          var value = container.css('border' + side + 'Radius');
          var arr = value.split(" ");
          if (arr.length <= 1) {
              arr[1] = arr[0];
          }
          return arr.map(asInt);
      });
  }

  function renderableNode(node) {
      return (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE);
  }

  function isPositionedForStacking(container) {
      var position = container.css("position");
      var zIndex = (["absolute", "relative", "fixed"].indexOf(position) !== -1) ? container.css("zIndex") : "auto";
      return zIndex !== "auto";
  }

  function isPositioned(container) {
      return container.css("position") !== "static";
  }

  function isFloating(container) {
      return container.css("float") !== "none";
  }

  function isInlineBlock(container) {
      return ["inline-block", "inline-table"].indexOf(container.css("display")) !== -1;
  }

  function not(callback) {
      var context = this;
      return function() {
          return !callback.apply(context, arguments);
      };
  }

  function isElement(container) {
      return container.node.nodeType === Node.ELEMENT_NODE;
  }

  function isPseudoElement(container) {
      return container.isPseudoElement === true;
  }

  function isTextNode(container) {
      return container.node.nodeType === Node.TEXT_NODE;
  }

  function zIndexSort(contexts) {
      return function(a, b) {
          return (a.cssInt("zIndex") + (contexts.indexOf(a) / contexts.length)) - (b.cssInt("zIndex") + (contexts.indexOf(b) / contexts.length));
      };
  }

  function hasOpacity(container) {
      return container.getOpacity() < 1;
  }

  function asInt(value) {
      return parseInt(value, 10);
  }

  function getWidth(border) {
      return border.width;
  }

  function nonIgnoredElement(nodeContainer) {
      return (nodeContainer.node.nodeType !== Node.ELEMENT_NODE || ["SCRIPT", "HEAD", "TITLE", "OBJECT", "BR", "OPTION"].indexOf(nodeContainer.node.nodeName) === -1);
  }

  function flatten(arrays) {
      return [].concat.apply([], arrays);
  }

  function stripQuotes(content) {
      var first = content.substr(0, 1);
      return (first === content.substr(content.length - 1) && first.match(/'|"/)) ? content.substr(1, content.length - 2) : content;
  }

  function getWords(characters) {
      var words = [], i = 0, onWordBoundary = false, word;
      while(characters.length) {
          if (isWordBoundary(characters[i]) === onWordBoundary) {
              word = characters.splice(0, i);
              if (word.length) {
                  words.push(punycode.ucs2.encode(word));
              }
              onWordBoundary =! onWordBoundary;
              i = 0;
          } else {
              i++;
          }

          if (i >= characters.length) {
              word = characters.splice(0, i);
              if (word.length) {
                  words.push(punycode.ucs2.encode(word));
              }
          }
      }
      return words;
  }

  function isWordBoundary(characterCode) {
      return [
          32, // <space>
          13, // \r
          10, // \n
          9, // \t
          45 // -
      ].indexOf(characterCode) !== -1;
  }

  function hasUnicode(string) {
      return (/[^\u0000-\u00ff]/).test(string);
  }

  module.exports = NodeParser;

  },{"./color":3,"./fontmetrics":7,"./log":13,"./nodecontainer":14,"./pseudoelementcontainer":18,"./stackingcontext":21,"./textcontainer":25,"./utils":26,"punycode":1}],16:[function(_dereq_,module,exports){
  var XHR = _dereq_('./xhr');
  var utils = _dereq_('./utils');
  var log = _dereq_('./log');
  var createWindowClone = _dereq_('./clone');
  var decode64 = utils.decode64;

  function Proxy(src, proxyUrl, document) {
      var supportsCORS = ('withCredentials' in new XMLHttpRequest());
      if (!proxyUrl) {
          return Promise.reject("No proxy configured");
      }
      var callback = createCallback(supportsCORS);
      var url = createProxyUrl(proxyUrl, src, callback);

      return supportsCORS ? XHR(url) : (jsonp(document, url, callback).then(function(response) {
          return decode64(response.content);
      }));
  }
  var proxyCount = 0;

  function ProxyURL(src, proxyUrl, document) {
      var supportsCORSImage = ('crossOrigin' in new Image());
      var callback = createCallback(supportsCORSImage);
      var url = createProxyUrl(proxyUrl, src, callback);
      return (supportsCORSImage ? Promise.resolve(url) : jsonp(document, url, callback).then(function(response) {
          return "data:" + response.type + ";base64," + response.content;
      }));
  }

  function jsonp(document, url, callback) {
      return new Promise(function(resolve, reject) {
          var s = document.createElement("script");
          var cleanup = function() {
              delete window.html2canvas.proxy[callback];
              document.body.removeChild(s);
          };
          window.html2canvas.proxy[callback] = function(response) {
              cleanup();
              resolve(response);
          };
          s.src = url;
          s.onerror = function(e) {
              cleanup();
              reject(e);
          };
          document.body.appendChild(s);
      });
  }

  function createCallback(useCORS) {
      return !useCORS ? "html2canvas_" + Date.now() + "_" + (++proxyCount) + "_" + Math.round(Math.random() * 100000) : "";
  }

  function createProxyUrl(proxyUrl, src, callback) {
      return proxyUrl + "?url=" + encodeURIComponent(src) + (callback.length ? "&callback=html2canvas.proxy." + callback : "");
  }

  function documentFromHTML(src) {
      return function(html) {
          var parser = new DOMParser(), doc;
          try {
              doc = parser.parseFromString(html, "text/html");
          } catch(e) {
              log("DOMParser not supported, falling back to createHTMLDocument");
              doc = document.implementation.createHTMLDocument("");
              try {
                  doc.open();
                  doc.write(html);
                  doc.close();
              } catch(ee) {
                  log("createHTMLDocument write not supported, falling back to document.body.innerHTML");
                  doc.body.innerHTML = html; // ie9 doesnt support writing to documentElement
              }
          }

          var b = doc.querySelector("base");
          if (!b || !b.href.host) {
              var base = doc.createElement("base");
              base.href = src;
              doc.head.insertBefore(base, doc.head.firstChild);
          }

          return doc;
      };
  }

  function loadUrlDocument(src, proxy, document, width, height, options) {
      return new Proxy(src, proxy, window.document).then(documentFromHTML(src)).then(function(doc) {
          return createWindowClone(doc, document, width, height, options, 0, 0);
      });
  }

  exports.Proxy = Proxy;
  exports.ProxyURL = ProxyURL;
  exports.loadUrlDocument = loadUrlDocument;

  },{"./clone":2,"./log":13,"./utils":26,"./xhr":28}],17:[function(_dereq_,module,exports){
  var ProxyURL = _dereq_('./proxy').ProxyURL;

  function ProxyImageContainer(src, proxy) {
      var link = document.createElement("a");
      link.href = src;
      src = link.href;
      this.src = src;
      this.image = new Image();
      var self = this;
      this.promise = new Promise(function(resolve, reject) {
          self.image.crossOrigin = "Anonymous";
          self.image.onload = resolve;
          self.image.onerror = reject;

          new ProxyURL(src, proxy, document).then(function(url) {
              self.image.src = url;
          })['catch'](reject);
      });
  }

  module.exports = ProxyImageContainer;

  },{"./proxy":16}],18:[function(_dereq_,module,exports){
  var NodeContainer = _dereq_('./nodecontainer');

  function PseudoElementContainer(node, parent, type) {
      NodeContainer.call(this, node, parent);
      this.isPseudoElement = true;
      this.before = type === ":before";
  }

  PseudoElementContainer.prototype.cloneTo = function(stack) {
      PseudoElementContainer.prototype.cloneTo.call(this, stack);
      stack.isPseudoElement = true;
      stack.before = this.before;
  };

  PseudoElementContainer.prototype = Object.create(NodeContainer.prototype);

  PseudoElementContainer.prototype.appendToDOM = function() {
      if (this.before) {
          this.parent.node.insertBefore(this.node, this.parent.node.firstChild);
      } else {
          this.parent.node.appendChild(this.node);
      }
      this.parent.node.className += " " + this.getHideClass();
  };

  PseudoElementContainer.prototype.cleanDOM = function() {
      this.node.parentNode.removeChild(this.node);
      this.parent.node.className = this.parent.node.className.replace(this.getHideClass(), "");
  };

  PseudoElementContainer.prototype.getHideClass = function() {
      return this["PSEUDO_HIDE_ELEMENT_CLASS_" + (this.before ? "BEFORE" : "AFTER")];
  };

  PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = "___html2canvas___pseudoelement_before";
  PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER = "___html2canvas___pseudoelement_after";

  module.exports = PseudoElementContainer;

  },{"./nodecontainer":14}],19:[function(_dereq_,module,exports){
  var log = _dereq_('./log');

  function Renderer(width, height, images, options, document) {
      this.width = width;
      this.height = height;
      this.images = images;
      this.options = options;
      this.document = document;
  }

  Renderer.prototype.renderImage = function(container, bounds, borderData, imageContainer) {
      var paddingLeft = container.cssInt('paddingLeft'),
          paddingTop = container.cssInt('paddingTop'),
          paddingRight = container.cssInt('paddingRight'),
          paddingBottom = container.cssInt('paddingBottom'),
          borders = borderData.borders;

      var width = bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight);
      var height = bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom);
      this.drawImage(
          imageContainer,
          0,
          0,
          imageContainer.image.width || width,
          imageContainer.image.height || height,
          bounds.left + paddingLeft + borders[3].width,
          bounds.top + paddingTop + borders[0].width,
          width,
          height
      );
  };

  Renderer.prototype.renderBackground = function(container, bounds, borderData) {
      if (bounds.height > 0 && bounds.width > 0) {
          this.renderBackgroundColor(container, bounds);
          this.renderBackgroundImage(container, bounds, borderData);
      }
  };

  Renderer.prototype.renderBackgroundColor = function(container, bounds) {
      var color = container.color("backgroundColor");
      if (!color.isTransparent()) {
          this.rectangle(bounds.left, bounds.top, bounds.width, bounds.height, color);
      }
  };

  Renderer.prototype.renderBorders = function(borders) {
      borders.forEach(this.renderBorder, this);
  };

  Renderer.prototype.renderBorder = function(data) {
      if (!data.color.isTransparent() && data.args !== null) {
          this.drawShape(data.args, data.color);
      }
  };

  Renderer.prototype.renderBackgroundImage = function(container, bounds, borderData) {
      var backgroundImages = container.parseBackgroundImages();
      backgroundImages.reverse().forEach(function(backgroundImage, index, arr) {
          switch(backgroundImage.method) {
          case "url":
              var image = this.images.get(backgroundImage.args[0]);
              if (image) {
                  this.renderBackgroundRepeating(container, bounds, image, arr.length - (index+1), borderData);
              } else {
                  log("Error loading background-image", backgroundImage.args[0]);
              }
              break;
          case "linear-gradient":
          case "gradient":
              var gradientImage = this.images.get(backgroundImage.value);
              if (gradientImage) {
                  this.renderBackgroundGradient(gradientImage, bounds, borderData);
              } else {
                  log("Error loading background-image", backgroundImage.args[0]);
              }
              break;
          case "none":
              break;
          default:
              log("Unknown background-image type", backgroundImage.args[0]);
          }
      }, this);
  };

  Renderer.prototype.renderBackgroundRepeating = function(container, bounds, imageContainer, index, borderData) {
      var size = container.parseBackgroundSize(bounds, imageContainer.image, index);
      var position = container.parseBackgroundPosition(bounds, imageContainer.image, index, size);
      var repeat = container.parseBackgroundRepeat(index);
      switch (repeat) {
      case "repeat-x":
      case "repeat no-repeat":
          this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + borderData[3], bounds.top + position.top + borderData[0], 99999, size.height, borderData);
          break;
      case "repeat-y":
      case "no-repeat repeat":
          this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + position.left + borderData[3], bounds.top + borderData[0], size.width, 99999, borderData);
          break;
      case "no-repeat":
          this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + position.left + borderData[3], bounds.top + position.top + borderData[0], size.width, size.height, borderData);
          break;
      default:
          this.renderBackgroundRepeat(imageContainer, position, size, {top: bounds.top, left: bounds.left}, borderData[3], borderData[0]);
          break;
      }
  };

  module.exports = Renderer;

  },{"./log":13}],20:[function(_dereq_,module,exports){
  var Renderer = _dereq_('../renderer');
  var LinearGradientContainer = _dereq_('../lineargradientcontainer');
  var log = _dereq_('../log');

  function CanvasRenderer(width, height) {
      Renderer.apply(this, arguments);
      this.canvas = this.options.canvas || this.document.createElement("canvas");
      if (!this.options.canvas) {
          this.canvas.width = width;
          this.canvas.height = height;
      }
      this.ctx = this.canvas.getContext("2d");
      this.taintCtx = this.document.createElement("canvas").getContext("2d");
      this.ctx.textBaseline = "bottom";
      this.variables = {};
      log("Initialized CanvasRenderer with size", width, "x", height);
  }

  CanvasRenderer.prototype = Object.create(Renderer.prototype);

  CanvasRenderer.prototype.setFillStyle = function(fillStyle) {
      this.ctx.fillStyle = typeof(fillStyle) === "object" && !!fillStyle.isColor ? fillStyle.toString() : fillStyle;
      return this.ctx;
  };

  CanvasRenderer.prototype.rectangle = function(left, top, width, height, color) {
      this.setFillStyle(color).fillRect(left, top, width, height);
  };

  CanvasRenderer.prototype.circle = function(left, top, size, color) {
      this.setFillStyle(color);
      this.ctx.beginPath();
      this.ctx.arc(left + size / 2, top + size / 2, size / 2, 0, Math.PI*2, true);
      this.ctx.closePath();
      this.ctx.fill();
  };

  CanvasRenderer.prototype.circleStroke = function(left, top, size, color, stroke, strokeColor) {
      this.circle(left, top, size, color);
      this.ctx.strokeStyle = strokeColor.toString();
      this.ctx.stroke();
  };

  CanvasRenderer.prototype.drawShape = function(shape, color) {
      this.shape(shape);
      this.setFillStyle(color).fill();
  };

  CanvasRenderer.prototype.taints = function(imageContainer) {
      if (imageContainer.tainted === null) {
          this.taintCtx.drawImage(imageContainer.image, 0, 0);
          try {
              this.taintCtx.getImageData(0, 0, 1, 1);
              imageContainer.tainted = false;
          } catch(e) {
              this.taintCtx = document.createElement("canvas").getContext("2d");
              imageContainer.tainted = true;
          }
      }

      return imageContainer.tainted;
  };

  CanvasRenderer.prototype.drawImage = function(imageContainer, sx, sy, sw, sh, dx, dy, dw, dh) {
      if (!this.taints(imageContainer) || this.options.allowTaint) {
          this.ctx.drawImage(imageContainer.image, sx, sy, sw, sh, dx, dy, dw, dh);
      }
  };

  CanvasRenderer.prototype.clip = function(shapes, callback, context) {
      this.ctx.save();
      shapes.filter(hasEntries).forEach(function(shape) {
          this.shape(shape).clip();
      }, this);
      callback.call(context);
      this.ctx.restore();
  };

  CanvasRenderer.prototype.shape = function(shape) {
      this.ctx.beginPath();
      shape.forEach(function(point, index) {
          if (point[0] === "rect") {
              this.ctx.rect.apply(this.ctx, point.slice(1));
          } else {
              this.ctx[(index === 0) ? "moveTo" : point[0] + "To" ].apply(this.ctx, point.slice(1));
          }
      }, this);
      this.ctx.closePath();
      return this.ctx;
  };

  CanvasRenderer.prototype.font = function(color, style, variant, weight, size, family) {
      this.setFillStyle(color).font = [style, variant, weight, size, family].join(" ").split(",")[0];
  };

  CanvasRenderer.prototype.fontShadow = function(color, offsetX, offsetY, blur) {
      this.setVariable("shadowColor", color.toString())
          .setVariable("shadowOffsetY", offsetX)
          .setVariable("shadowOffsetX", offsetY)
          .setVariable("shadowBlur", blur);
  };

  CanvasRenderer.prototype.clearShadow = function() {
      this.setVariable("shadowColor", "rgba(0,0,0,0)");
  };

  CanvasRenderer.prototype.setOpacity = function(opacity) {
      this.ctx.globalAlpha = opacity;
  };

  CanvasRenderer.prototype.setTransform = function(transform) {
      this.ctx.translate(transform.origin[0], transform.origin[1]);
      this.ctx.transform.apply(this.ctx, transform.matrix);
      this.ctx.translate(-transform.origin[0], -transform.origin[1]);
  };

  CanvasRenderer.prototype.setVariable = function(property, value) {
      if (this.variables[property] !== value) {
          this.variables[property] = this.ctx[property] = value;
      }

      return this;
  };

  CanvasRenderer.prototype.text = function(text, left, bottom) {
      this.ctx.fillText(text, left, bottom);
  };

  CanvasRenderer.prototype.backgroundRepeatShape = function(imageContainer, backgroundPosition, size, bounds, left, top, width, height, borderData) {
      var shape = [
          ["line", Math.round(left), Math.round(top)],
          ["line", Math.round(left + width), Math.round(top)],
          ["line", Math.round(left + width), Math.round(height + top)],
          ["line", Math.round(left), Math.round(height + top)]
      ];
      this.clip([shape], function() {
          this.renderBackgroundRepeat(imageContainer, backgroundPosition, size, bounds, borderData[3], borderData[0]);
      }, this);
  };

  CanvasRenderer.prototype.renderBackgroundRepeat = function(imageContainer, backgroundPosition, size, bounds, borderLeft, borderTop) {
      var offsetX = Math.round(bounds.left + backgroundPosition.left + borderLeft), offsetY = Math.round(bounds.top + backgroundPosition.top + borderTop);
      this.setFillStyle(this.ctx.createPattern(this.resizeImage(imageContainer, size), "repeat"));
      this.ctx.translate(offsetX, offsetY);
      this.ctx.fill();
      this.ctx.translate(-offsetX, -offsetY);
  };

  CanvasRenderer.prototype.renderBackgroundGradient = function(gradientImage, bounds) {
      if (gradientImage instanceof LinearGradientContainer) {
          var gradient = this.ctx.createLinearGradient(
              bounds.left + bounds.width * gradientImage.x0,
              bounds.top + bounds.height * gradientImage.y0,
              bounds.left +  bounds.width * gradientImage.x1,
              bounds.top +  bounds.height * gradientImage.y1);
          gradientImage.colorStops.forEach(function(colorStop) {
              gradient.addColorStop(colorStop.stop, colorStop.color.toString());
          });
          this.rectangle(bounds.left, bounds.top, bounds.width, bounds.height, gradient);
      }
  };

  CanvasRenderer.prototype.resizeImage = function(imageContainer, size) {
      var image = imageContainer.image;
      if(image.width === size.width && image.height === size.height) {
          return image;
      }

      var ctx, canvas = document.createElement('canvas');
      canvas.width = size.width;
      canvas.height = size.height;
      ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, size.width, size.height );
      return canvas;
  };

  function hasEntries(array) {
      return array.length > 0;
  }

  module.exports = CanvasRenderer;

  },{"../lineargradientcontainer":12,"../log":13,"../renderer":19}],21:[function(_dereq_,module,exports){
  var NodeContainer = _dereq_('./nodecontainer');

  function StackingContext(hasOwnStacking, opacity, element, parent) {
      NodeContainer.call(this, element, parent);
      this.ownStacking = hasOwnStacking;
      this.contexts = [];
      this.children = [];
      this.opacity = (this.parent ? this.parent.stack.opacity : 1) * opacity;
  }

  StackingContext.prototype = Object.create(NodeContainer.prototype);

  StackingContext.prototype.getParentStack = function(context) {
      var parentStack = (this.parent) ? this.parent.stack : null;
      return parentStack ? (parentStack.ownStacking ? parentStack : parentStack.getParentStack(context)) : context.stack;
  };

  module.exports = StackingContext;

  },{"./nodecontainer":14}],22:[function(_dereq_,module,exports){
  function Support(document) {
      this.rangeBounds = this.testRangeBounds(document);
      this.cors = this.testCORS();
      this.svg = this.testSVG();
  }

  Support.prototype.testRangeBounds = function(document) {
      var range, testElement, rangeBounds, rangeHeight, support = false;

      if (document.createRange) {
          range = document.createRange();
          if (range.getBoundingClientRect) {
              testElement = document.createElement('boundtest');
              testElement.style.height = "123px";
              testElement.style.display = "block";
              document.body.appendChild(testElement);

              range.selectNode(testElement);
              rangeBounds = range.getBoundingClientRect();
              rangeHeight = rangeBounds.height;

              if (rangeHeight === 123) {
                  support = true;
              }
              document.body.removeChild(testElement);
          }
      }

      return support;
  };

  Support.prototype.testCORS = function() {
      return typeof((new Image()).crossOrigin) !== "undefined";
  };

  Support.prototype.testSVG = function() {
      var img = new Image();
      var canvas = document.createElement("canvas");
      var ctx =  canvas.getContext("2d");
      img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";

      try {
          ctx.drawImage(img, 0, 0);
          canvas.toDataURL();
      } catch(e) {
          return false;
      }
      return true;
  };

  module.exports = Support;

  },{}],23:[function(_dereq_,module,exports){
  var XHR = _dereq_('./xhr');
  var decode64 = _dereq_('./utils').decode64;

  function SVGContainer(src) {
      this.src = src;
      this.image = null;
      var self = this;

      this.promise = this.hasFabric().then(function() {
          return (self.isInline(src) ? Promise.resolve(self.inlineFormatting(src)) : XHR(src));
      }).then(function(svg) {
          return new Promise(function(resolve) {
              window.html2canvas.svg.fabric.loadSVGFromString(svg, self.createCanvas.call(self, resolve));
          });
      });
  }

  SVGContainer.prototype.hasFabric = function() {
      return !window.html2canvas.svg || !window.html2canvas.svg.fabric ? Promise.reject(new Error("html2canvas.svg.js is not loaded, cannot render svg")) : Promise.resolve();
  };

  SVGContainer.prototype.inlineFormatting = function(src) {
      return (/^data:image\/svg\+xml;base64,/.test(src)) ? this.decode64(this.removeContentType(src)) : this.removeContentType(src);
  };

  SVGContainer.prototype.removeContentType = function(src) {
      return src.replace(/^data:image\/svg\+xml(;base64)?,/,'');
  };

  SVGContainer.prototype.isInline = function(src) {
      return (/^data:image\/svg\+xml/i.test(src));
  };

  SVGContainer.prototype.createCanvas = function(resolve) {
      var self = this;
      return function (objects, options) {
          var canvas = new window.html2canvas.svg.fabric.StaticCanvas('c');
          self.image = canvas.lowerCanvasEl;
          canvas
              .setWidth(options.width)
              .setHeight(options.height)
              .add(window.html2canvas.svg.fabric.util.groupSVGElements(objects, options))
              .renderAll();
          resolve(canvas.lowerCanvasEl);
      };
  };

  SVGContainer.prototype.decode64 = function(str) {
      return (typeof(window.atob) === "function") ? window.atob(str) : decode64(str);
  };

  module.exports = SVGContainer;

  },{"./utils":26,"./xhr":28}],24:[function(_dereq_,module,exports){
  var SVGContainer = _dereq_('./svgcontainer');

  function SVGNodeContainer(node, _native) {
      this.src = node;
      this.image = null;
      var self = this;

      this.promise = _native ? new Promise(function(resolve, reject) {
          self.image = new Image();
          self.image.onload = resolve;
          self.image.onerror = reject;
          self.image.src = "data:image/svg+xml," + (new XMLSerializer()).serializeToString(node);
          if (self.image.complete === true) {
              resolve(self.image);
          }
      }) : this.hasFabric().then(function() {
          return new Promise(function(resolve) {
              window.html2canvas.svg.fabric.parseSVGDocument(node, self.createCanvas.call(self, resolve));
          });
      });
  }

  SVGNodeContainer.prototype = Object.create(SVGContainer.prototype);

  module.exports = SVGNodeContainer;

  },{"./svgcontainer":23}],25:[function(_dereq_,module,exports){
  var NodeContainer = _dereq_('./nodecontainer');

  function TextContainer(node, parent) {
      NodeContainer.call(this, node, parent);
  }

  TextContainer.prototype = Object.create(NodeContainer.prototype);

  TextContainer.prototype.applyTextTransform = function() {
      this.node.data = this.transform(this.parent.css("textTransform"));
  };

  TextContainer.prototype.transform = function(transform) {
      var text = this.node.data;
      switch(transform){
          case "lowercase":
              return text.toLowerCase();
          case "capitalize":
              return text.replace(/(^|\s|:|-|\(|\))([a-z])/g, capitalize);
          case "uppercase":
              return text.toUpperCase();
          default:
              return text;
      }
  };

  function capitalize(m, p1, p2) {
      if (m.length > 0) {
          return p1 + p2.toUpperCase();
      }
  }

  module.exports = TextContainer;

  },{"./nodecontainer":14}],26:[function(_dereq_,module,exports){
  exports.smallImage = function smallImage() {
      return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  };

  exports.bind = function(callback, context) {
      return function() {
          return callback.apply(context, arguments);
      };
  };

  /*
   * base64-arraybuffer
   * https://github.com/niklasvh/base64-arraybuffer
   *
   * Copyright (c) 2012 Niklas von Hertzen
   * Licensed under the MIT license.
   */

  exports.decode64 = function(base64) {
      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var len = base64.length, i, encoded1, encoded2, encoded3, encoded4, byte1, byte2, byte3;

      var output = "";

      for (i = 0; i < len; i+=4) {
          encoded1 = chars.indexOf(base64[i]);
          encoded2 = chars.indexOf(base64[i+1]);
          encoded3 = chars.indexOf(base64[i+2]);
          encoded4 = chars.indexOf(base64[i+3]);

          byte1 = (encoded1 << 2) | (encoded2 >> 4);
          byte2 = ((encoded2 & 15) << 4) | (encoded3 >> 2);
          byte3 = ((encoded3 & 3) << 6) | encoded4;
          if (encoded3 === 64) {
              output += String.fromCharCode(byte1);
          } else if (encoded4 === 64 || encoded4 === -1) {
              output += String.fromCharCode(byte1, byte2);
          } else{
              output += String.fromCharCode(byte1, byte2, byte3);
          }
      }

      return output;
  };

  exports.getBounds = function(node) {
      if (node.getBoundingClientRect) {
          var clientRect = node.getBoundingClientRect();
          var width = node.offsetWidth == null ? clientRect.width : node.offsetWidth;
          return {
              top: clientRect.top,
              bottom: clientRect.bottom || (clientRect.top + clientRect.height),
              right: clientRect.left + width,
              left: clientRect.left,
              width:  width,
              height: node.offsetHeight == null ? clientRect.height : node.offsetHeight
          };
      }
      return {};
  };

  exports.offsetBounds = function(node) {
      var parent = node.offsetParent ? exports.offsetBounds(node.offsetParent) : {top: 0, left: 0};

      return {
          top: node.offsetTop + parent.top,
          bottom: node.offsetTop + node.offsetHeight + parent.top,
          right: node.offsetLeft + parent.left + node.offsetWidth,
          left: node.offsetLeft + parent.left,
          width: node.offsetWidth,
          height: node.offsetHeight
      };
  };

  exports.parseBackgrounds = function(backgroundImage) {
      var whitespace = ' \r\n\t',
          method, definition, prefix, prefix_i, block, results = [],
          mode = 0, numParen = 0, quote, args;
      var appendResult = function() {
          if(method) {
              if (definition.substr(0, 1) === '"') {
                  definition = definition.substr(1, definition.length - 2);
              }
              if (definition) {
                  args.push(definition);
              }
              if (method.substr(0, 1) === '-' && (prefix_i = method.indexOf('-', 1 ) + 1) > 0) {
                  prefix = method.substr(0, prefix_i);
                  method = method.substr(prefix_i);
              }
              results.push({
                  prefix: prefix,
                  method: method.toLowerCase(),
                  value: block,
                  args: args,
                  image: null
              });
          }
          args = [];
          method = prefix = definition = block = '';
      };
      args = [];
      method = prefix = definition = block = '';
      backgroundImage.split("").forEach(function(c) {
          if (mode === 0 && whitespace.indexOf(c) > -1) {
              return;
          }
          switch(c) {
          case '"':
              if(!quote) {
                  quote = c;
              } else if(quote === c) {
                  quote = null;
              }
              break;
          case '(':
              if(quote) {
                  break;
              } else if(mode === 0) {
                  mode = 1;
                  block += c;
                  return;
              } else {
                  numParen++;
              }
              break;
          case ')':
              if (quote) {
                  break;
              } else if(mode === 1) {
                  if(numParen === 0) {
                      mode = 0;
                      block += c;
                      appendResult();
                      return;
                  } else {
                      numParen--;
                  }
              }
              break;

          case ',':
              if (quote) {
                  break;
              } else if(mode === 0) {
                  appendResult();
                  return;
              } else if (mode === 1) {
                  if (numParen === 0 && !method.match(/^url$/i)) {
                      args.push(definition);
                      definition = '';
                      block += c;
                      return;
                  }
              }
              break;
          }

          block += c;
          if (mode === 0) {
              method += c;
          } else {
              definition += c;
          }
      });

      appendResult();
      return results;
  };

  },{}],27:[function(_dereq_,module,exports){
  var GradientContainer = _dereq_('./gradientcontainer');

  function WebkitGradientContainer(imageData) {
      GradientContainer.apply(this, arguments);
      this.type = imageData.args[0] === "linear" ? GradientContainer.TYPES.LINEAR : GradientContainer.TYPES.RADIAL;
  }

  WebkitGradientContainer.prototype = Object.create(GradientContainer.prototype);

  module.exports = WebkitGradientContainer;

  },{"./gradientcontainer":9}],28:[function(_dereq_,module,exports){
  function XHR(url) {
      return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url);

          xhr.onload = function() {
              if (xhr.status === 200) {
                  resolve(xhr.responseText);
              } else {
                  reject(new Error(xhr.statusText));
              }
          };

          xhr.onerror = function() {
              reject(new Error("Network Error"));
          };

          xhr.send();
      });
  }

  module.exports = XHR;

  },{}]},{},[4])(4)
  });

  // Generated by CoffeeScript 1.4.0

  /*
  # PNG.js
  # Copyright (c) 2011 Devon Govett
  # MIT LICENSE
  # 
  # 
  */


  (function(global) {
    var PNG;

    PNG = (function() {
      var APNG_BLEND_OP_OVER, APNG_BLEND_OP_SOURCE, APNG_DISPOSE_OP_BACKGROUND, APNG_DISPOSE_OP_NONE, APNG_DISPOSE_OP_PREVIOUS, makeImage, scratchCanvas, scratchCtx;

      PNG.load = function(url, canvas, callback) {
        var xhr,
          _this = this;
        if (typeof canvas === 'function') {
          callback = canvas;
        }
        xhr = new XMLHttpRequest;
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function() {
          var data, png;
          data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
          png = new PNG(data);
          if (typeof (canvas != null ? canvas.getContext : void 0) === 'function') {
            png.render(canvas);
          }
          return typeof callback === "function" ? callback(png) : void 0;
        };
        return xhr.send(null);
      };

      APNG_DISPOSE_OP_NONE = 0;

      APNG_DISPOSE_OP_BACKGROUND = 1;

      APNG_DISPOSE_OP_PREVIOUS = 2;

      APNG_BLEND_OP_SOURCE = 0;

      APNG_BLEND_OP_OVER = 1;

      function PNG(data) {
        var chunkSize, colors, palLen, delayDen, delayNum, frame, i, index, key, section, palShort, text, _i, _j, _ref;
        this.data = data;
        this.pos = 8;
        this.palette = [];
        this.imgData = [];
        this.transparency = {};
        this.animation = null;
        this.text = {};
        frame = null;
        while (true) {
          chunkSize = this.readUInt32();
          section = ((function() {
            var _i, _results;
            _results = [];
            for (i = _i = 0; _i < 4; i = ++_i) {
              _results.push(String.fromCharCode(this.data[this.pos++]));
            }
            return _results;
          }).call(this)).join('');
          switch (section) {
            case 'IHDR':
              this.width = this.readUInt32();
              this.height = this.readUInt32();
              this.bits = this.data[this.pos++];
              this.colorType = this.data[this.pos++];
              this.compressionMethod = this.data[this.pos++];
              this.filterMethod = this.data[this.pos++];
              this.interlaceMethod = this.data[this.pos++];
              break;
            case 'acTL':
              this.animation = {
                numFrames: this.readUInt32(),
                numPlays: this.readUInt32() || Infinity,
                frames: []
              };
              break;
            case 'PLTE':
              this.palette = this.read(chunkSize);
              break;
            case 'fcTL':
              if (frame) {
                this.animation.frames.push(frame);
              }
              this.pos += 4;
              frame = {
                width: this.readUInt32(),
                height: this.readUInt32(),
                xOffset: this.readUInt32(),
                yOffset: this.readUInt32()
              };
              delayNum = this.readUInt16();
              delayDen = this.readUInt16() || 100;
              frame.delay = 1000 * delayNum / delayDen;
              frame.disposeOp = this.data[this.pos++];
              frame.blendOp = this.data[this.pos++];
              frame.data = [];
              break;
            case 'IDAT':
            case 'fdAT':
              if (section === 'fdAT') {
                this.pos += 4;
                chunkSize -= 4;
              }
              data = (frame != null ? frame.data : void 0) || this.imgData;
              for (i = _i = 0; 0 <= chunkSize ? _i < chunkSize : _i > chunkSize; i = 0 <= chunkSize ? ++_i : --_i) {
                data.push(this.data[this.pos++]);
              }
              break;
            case 'tRNS':
              this.transparency = {};
              switch (this.colorType) {
                case 3:
              	palLen = this.palette.length/3;
                  this.transparency.indexed = this.read(chunkSize);
                  if(this.transparency.indexed.length > palLen)
                  	throw new Error('More transparent colors than palette size');
                  /*
                   * According to the PNG spec trns should be increased to the same size as palette if shorter
                   */
                  //palShort = 255 - this.transparency.indexed.length;
                  palShort = palLen - this.transparency.indexed.length;
                  if (palShort > 0) {
                    for (i = _j = 0; 0 <= palShort ? _j < palShort : _j > palShort; i = 0 <= palShort ? ++_j : --_j) {
                      this.transparency.indexed.push(255);
                    }
                  }
                  break;
                case 0:
                  this.transparency.grayscale = this.read(chunkSize)[0];
                  break;
                case 2:
                  this.transparency.rgb = this.read(chunkSize);
              }
              break;
            case 'tEXt':
              text = this.read(chunkSize);
              index = text.indexOf(0);
              key = String.fromCharCode.apply(String, text.slice(0, index));
              this.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
              break;
            case 'IEND':
              if (frame) {
                this.animation.frames.push(frame);
              }
              this.colors = (function() {
                switch (this.colorType) {
                  case 0:
                  case 3:
                  case 4:
                    return 1;
                  case 2:
                  case 6:
                    return 3;
                }
              }).call(this);
              this.hasAlphaChannel = (_ref = this.colorType) === 4 || _ref === 6;
              colors = this.colors + (this.hasAlphaChannel ? 1 : 0);
              this.pixelBitlength = this.bits * colors;
              this.colorSpace = (function() {
                switch (this.colors) {
                  case 1:
                    return 'DeviceGray';
                  case 3:
                    return 'DeviceRGB';
                }
              }).call(this);
              this.imgData = new Uint8Array(this.imgData);
              return;
            default:
              this.pos += chunkSize;
          }
          this.pos += 4;
          if (this.pos > this.data.length) {
            throw new Error("Incomplete or corrupt PNG file");
          }
        }
        return;
      }

      PNG.prototype.read = function(bytes) {
        var i, _i, _results;
        _results = [];
        for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
          _results.push(this.data[this.pos++]);
        }
        return _results;
      };

      PNG.prototype.readUInt32 = function() {
        var b1, b2, b3, b4;
        b1 = this.data[this.pos++] << 24;
        b2 = this.data[this.pos++] << 16;
        b3 = this.data[this.pos++] << 8;
        b4 = this.data[this.pos++];
        return b1 | b2 | b3 | b4;
      };

      PNG.prototype.readUInt16 = function() {
        var b1, b2;
        b1 = this.data[this.pos++] << 8;
        b2 = this.data[this.pos++];
        return b1 | b2;
      };

      PNG.prototype.decodePixels = function(data) {
        var abyte, c, col, i, left, length, p, pa, paeth, pb, pc, pixelBytes, pixels, pos, row, scanlineLength, upper, upperLeft, _i, _j, _k, _l, _m;
        if (data == null) {
          data = this.imgData;
        }
        if (data.length === 0) {
          return new Uint8Array(0);
        }
        data = new FlateStream(data);
        data = data.getBytes();
        pixelBytes = this.pixelBitlength / 8;
        scanlineLength = pixelBytes * this.width;
        pixels = new Uint8Array(scanlineLength * this.height);
        length = data.length;
        row = 0;
        pos = 0;
        c = 0;
        while (pos < length) {
          switch (data[pos++]) {
            case 0:
              for (i = _i = 0; _i < scanlineLength; i = _i += 1) {
                pixels[c++] = data[pos++];
              }
              break;
            case 1:
              for (i = _j = 0; _j < scanlineLength; i = _j += 1) {
                abyte = data[pos++];
                left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                pixels[c++] = (abyte + left) % 256;
              }
              break;
            case 2:
              for (i = _k = 0; _k < scanlineLength; i = _k += 1) {
                abyte = data[pos++];
                col = (i - (i % pixelBytes)) / pixelBytes;
                upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                pixels[c++] = (upper + abyte) % 256;
              }
              break;
            case 3:
              for (i = _l = 0; _l < scanlineLength; i = _l += 1) {
                abyte = data[pos++];
                col = (i - (i % pixelBytes)) / pixelBytes;
                left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                pixels[c++] = (abyte + Math.floor((left + upper) / 2)) % 256;
              }
              break;
            case 4:
              for (i = _m = 0; _m < scanlineLength; i = _m += 1) {
                abyte = data[pos++];
                col = (i - (i % pixelBytes)) / pixelBytes;
                left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                if (row === 0) {
                  upper = upperLeft = 0;
                } else {
                  upper = pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                  upperLeft = col && pixels[(row - 1) * scanlineLength + (col - 1) * pixelBytes + (i % pixelBytes)];
                }
                p = left + upper - upperLeft;
                pa = Math.abs(p - left);
                pb = Math.abs(p - upper);
                pc = Math.abs(p - upperLeft);
                if (pa <= pb && pa <= pc) {
                  paeth = left;
                } else if (pb <= pc) {
                  paeth = upper;
                } else {
                  paeth = upperLeft;
                }
                pixels[c++] = (abyte + paeth) % 256;
              }
              break;
            default:
              throw new Error("Invalid filter algorithm: " + data[pos - 1]);
          }
          row++;
        }
        return pixels;
      };

      PNG.prototype.decodePalette = function() {
        var c, i, length, palette, pos, ret, transparency, _i, _ref, _ref1;
        palette = this.palette;
        transparency = this.transparency.indexed || [];
        ret = new Uint8Array((transparency.length || 0) + palette.length);
        pos = 0;
        length = palette.length;
        c = 0;
        for (i = _i = 0, _ref = palette.length; _i < _ref; i = _i += 3) {
          ret[pos++] = palette[i];
          ret[pos++] = palette[i + 1];
          ret[pos++] = palette[i + 2];
          ret[pos++] = (_ref1 = transparency[c++]) != null ? _ref1 : 255;
        }
        return ret;
      };

      PNG.prototype.copyToImageData = function(imageData, pixels) {
        var alpha, colors, data, i, input, j, k, length, palette, v, _ref;
        colors = this.colors;
        palette = null;
        alpha = this.hasAlphaChannel;
        if (this.palette.length) {
          palette = (_ref = this._decodedPalette) != null ? _ref : this._decodedPalette = this.decodePalette();
          colors = 4;
          alpha = true;
        }
        data = imageData.data || imageData;
        length = data.length;
        input = palette || pixels;
        i = j = 0;
        if (colors === 1) {
          while (i < length) {
            k = palette ? pixels[i / 4] * 4 : j;
            v = input[k++];
            data[i++] = v;
            data[i++] = v;
            data[i++] = v;
            data[i++] = alpha ? input[k++] : 255;
            j = k;
          }
        } else {
          while (i < length) {
            k = palette ? pixels[i / 4] * 4 : j;
            data[i++] = input[k++];
            data[i++] = input[k++];
            data[i++] = input[k++];
            data[i++] = alpha ? input[k++] : 255;
            j = k;
          }
        }
      };

      PNG.prototype.decode = function() {
        var ret;
        ret = new Uint8Array(this.width * this.height * 4);
        this.copyToImageData(ret, this.decodePixels());
        return ret;
      };

      try {
          scratchCanvas = global.document.createElement('canvas');
          scratchCtx = scratchCanvas.getContext('2d');
      } catch(e) {
          return -1;
      }

      makeImage = function(imageData) {
        var img;
        scratchCtx.width = imageData.width;
        scratchCtx.height = imageData.height;
        scratchCtx.clearRect(0, 0, imageData.width, imageData.height);
        scratchCtx.putImageData(imageData, 0, 0);
        img = new Image;
        img.src = scratchCanvas.toDataURL();
        return img;
      };

      PNG.prototype.decodeFrames = function(ctx) {
        var frame, i, imageData, pixels, _i, _len, _ref, _results;
        if (!this.animation) {
          return;
        }
        _ref = this.animation.frames;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          frame = _ref[i];
          imageData = ctx.createImageData(frame.width, frame.height);
          pixels = this.decodePixels(new Uint8Array(frame.data));
          this.copyToImageData(imageData, pixels);
          frame.imageData = imageData;
          _results.push(frame.image = makeImage(imageData));
        }
        return _results;
      };

      PNG.prototype.renderFrame = function(ctx, number) {
        var frame, frames, prev;
        frames = this.animation.frames;
        frame = frames[number];
        prev = frames[number - 1];
        if (number === 0) {
          ctx.clearRect(0, 0, this.width, this.height);
        }
        if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_BACKGROUND) {
          ctx.clearRect(prev.xOffset, prev.yOffset, prev.width, prev.height);
        } else if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_PREVIOUS) {
          ctx.putImageData(prev.imageData, prev.xOffset, prev.yOffset);
        }
        if (frame.blendOp === APNG_BLEND_OP_SOURCE) {
          ctx.clearRect(frame.xOffset, frame.yOffset, frame.width, frame.height);
        }
        return ctx.drawImage(frame.image, frame.xOffset, frame.yOffset);
      };

      PNG.prototype.animate = function(ctx) {
        var doFrame, frameNumber, frames, numFrames, numPlays, _ref,
          _this = this;
        frameNumber = 0;
        _ref = this.animation, numFrames = _ref.numFrames, frames = _ref.frames, numPlays = _ref.numPlays;
        return (doFrame = function() {
          var f, frame;
          f = frameNumber++ % numFrames;
          frame = frames[f];
          _this.renderFrame(ctx, f);
          if (numFrames > 1 && frameNumber / numFrames < numPlays) {
            return _this.animation._timeout = setTimeout(doFrame, frame.delay);
          }
        })();
      };

      PNG.prototype.stopAnimation = function() {
        var _ref;
        return clearTimeout((_ref = this.animation) != null ? _ref._timeout : void 0);
      };

      PNG.prototype.render = function(canvas) {
        var ctx, data;
        if (canvas._png) {
          canvas._png.stopAnimation();
        }
        canvas._png = this;
        canvas.width = this.width;
        canvas.height = this.height;
        ctx = canvas.getContext("2d");
        if (this.animation) {
          this.decodeFrames(ctx);
          return this.animate(ctx);
        } else {
          data = ctx.createImageData(this.width, this.height);
          this.copyToImageData(data, this.decodePixels());
          return ctx.putImageData(data, 0, 0);
        }
      };

      return PNG;

    })();

    global.PNG = PNG;

  })(typeof window !== "undefined" && window || undefined);

  /*
   * Extracted from pdf.js
   * https://github.com/andreasgal/pdf.js
   *
   * Copyright (c) 2011 Mozilla Foundation
   *
   * Contributors: Andreas Gal <gal@mozilla.com>
   *               Chris G Jones <cjones@mozilla.com>
   *               Shaon Barman <shaon.barman@gmail.com>
   *               Vivien Nicolas <21@vingtetun.org>
   *               Justin D'Arcangelo <justindarc@gmail.com>
   *               Yury Delendik
   *
   * 
   */

  var DecodeStream = (function() {
    function constructor() {
      this.pos = 0;
      this.bufferLength = 0;
      this.eof = false;
      this.buffer = null;
    }

    constructor.prototype = {
      ensureBuffer: function decodestream_ensureBuffer(requested) {
        var buffer = this.buffer;
        var current = buffer ? buffer.byteLength : 0;
        if (requested < current)
          return buffer;
        var size = 512;
        while (size < requested)
          size <<= 1;
        var buffer2 = new Uint8Array(size);
        for (var i = 0; i < current; ++i)
          buffer2[i] = buffer[i];
        return this.buffer = buffer2;
      },
      getByte: function decodestream_getByte() {
        var pos = this.pos;
        while (this.bufferLength <= pos) {
          if (this.eof)
            return null;
          this.readBlock();
        }
        return this.buffer[this.pos++];
      },
      getBytes: function decodestream_getBytes(length) {
        var pos = this.pos;

        if (length) {
          this.ensureBuffer(pos + length);
          var end = pos + length;

          while (!this.eof && this.bufferLength < end)
            this.readBlock();

          var bufEnd = this.bufferLength;
          if (end > bufEnd)
            end = bufEnd;
        } else {
          while (!this.eof)
            this.readBlock();

          var end = this.bufferLength;
        }

        this.pos = end;
        return this.buffer.subarray(pos, end);
      },
      lookChar: function decodestream_lookChar() {
        var pos = this.pos;
        while (this.bufferLength <= pos) {
          if (this.eof)
            return null;
          this.readBlock();
        }
        return String.fromCharCode(this.buffer[this.pos]);
      },
      getChar: function decodestream_getChar() {
        var pos = this.pos;
        while (this.bufferLength <= pos) {
          if (this.eof)
            return null;
          this.readBlock();
        }
        return String.fromCharCode(this.buffer[this.pos++]);
      },
      makeSubStream: function decodestream_makeSubstream(start, length, dict) {
        var end = start + length;
        while (this.bufferLength <= end && !this.eof)
          this.readBlock();
        return new Stream(this.buffer, start, length, dict);
      },
      skip: function decodestream_skip(n) {
        if (!n)
          n = 1;
        this.pos += n;
      },
      reset: function decodestream_reset() {
        this.pos = 0;
      }
    };

    return constructor;
  })();

  var FlateStream = (function() {
    if (typeof Uint32Array === 'undefined') {
      return undefined;
    }
    var codeLenCodeMap = new Uint32Array([
      16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
    ]);

    var lengthDecode = new Uint32Array([
      0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a,
      0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f,
      0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073,
      0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102
    ]);

    var distDecode = new Uint32Array([
      0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d,
      0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1,
      0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01,
      0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001
    ]);

    var fixedLitCodeTab = [new Uint32Array([
      0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0,
      0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0,
      0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0,
      0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0,
      0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8,
      0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8,
      0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8,
      0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8,
      0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4,
      0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4,
      0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4,
      0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4,
      0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc,
      0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec,
      0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc,
      0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc,
      0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2,
      0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2,
      0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2,
      0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2,
      0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca,
      0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea,
      0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da,
      0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa,
      0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6,
      0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6,
      0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6,
      0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6,
      0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce,
      0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee,
      0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de,
      0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe,
      0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1,
      0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1,
      0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1,
      0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1,
      0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9,
      0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9,
      0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9,
      0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9,
      0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5,
      0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5,
      0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5,
      0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5,
      0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd,
      0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed,
      0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd,
      0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd,
      0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3,
      0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3,
      0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3,
      0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3,
      0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb,
      0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb,
      0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db,
      0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb,
      0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7,
      0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7,
      0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7,
      0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7,
      0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf,
      0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef,
      0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df,
      0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff
    ]), 9];

    var fixedDistCodeTab = [new Uint32Array([
      0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c,
      0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000,
      0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d,
      0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000
    ]), 5];
    
    function error(e) {
        throw new Error(e)
    }

    function constructor(bytes) {
      //var bytes = stream.getBytes();
      var bytesPos = 0;

      var cmf = bytes[bytesPos++];
      var flg = bytes[bytesPos++];
      if (cmf == -1 || flg == -1)
        error('Invalid header in flate stream');
      if ((cmf & 0x0f) != 0x08)
        error('Unknown compression method in flate stream');
      if ((((cmf << 8) + flg) % 31) != 0)
        error('Bad FCHECK in flate stream');
      if (flg & 0x20)
        error('FDICT bit set in flate stream');

      this.bytes = bytes;
      this.bytesPos = bytesPos;

      this.codeSize = 0;
      this.codeBuf = 0;

      DecodeStream.call(this);
    }

    constructor.prototype = Object.create(DecodeStream.prototype);

    constructor.prototype.getBits = function(bits) {
      var codeSize = this.codeSize;
      var codeBuf = this.codeBuf;
      var bytes = this.bytes;
      var bytesPos = this.bytesPos;

      var b;
      while (codeSize < bits) {
        if (typeof (b = bytes[bytesPos++]) == 'undefined')
          error('Bad encoding in flate stream');
        codeBuf |= b << codeSize;
        codeSize += 8;
      }
      b = codeBuf & ((1 << bits) - 1);
      this.codeBuf = codeBuf >> bits;
      this.codeSize = codeSize -= bits;
      this.bytesPos = bytesPos;
      return b;
    };

    constructor.prototype.getCode = function(table) {
      var codes = table[0];
      var maxLen = table[1];
      var codeSize = this.codeSize;
      var codeBuf = this.codeBuf;
      var bytes = this.bytes;
      var bytesPos = this.bytesPos;

      while (codeSize < maxLen) {
        var b;
        if (typeof (b = bytes[bytesPos++]) == 'undefined')
          error('Bad encoding in flate stream');
        codeBuf |= (b << codeSize);
        codeSize += 8;
      }
      var code = codes[codeBuf & ((1 << maxLen) - 1)];
      var codeLen = code >> 16;
      var codeVal = code & 0xffff;
      if (codeSize == 0 || codeSize < codeLen || codeLen == 0)
        error('Bad encoding in flate stream');
      this.codeBuf = (codeBuf >> codeLen);
      this.codeSize = (codeSize - codeLen);
      this.bytesPos = bytesPos;
      return codeVal;
    };

    constructor.prototype.generateHuffmanTable = function(lengths) {
      var n = lengths.length;

      // find max code length
      var maxLen = 0;
      for (var i = 0; i < n; ++i) {
        if (lengths[i] > maxLen)
          maxLen = lengths[i];
      }

      // build the table
      var size = 1 << maxLen;
      var codes = new Uint32Array(size);
      for (var len = 1, code = 0, skip = 2;
           len <= maxLen;
           ++len, code <<= 1, skip <<= 1) {
        for (var val = 0; val < n; ++val) {
          if (lengths[val] == len) {
            // bit-reverse the code
            var code2 = 0;
            var t = code;
            for (var i = 0; i < len; ++i) {
              code2 = (code2 << 1) | (t & 1);
              t >>= 1;
            }

            // fill the table entries
            for (var i = code2; i < size; i += skip)
              codes[i] = (len << 16) | val;

            ++code;
          }
        }
      }

      return [codes, maxLen];
    };

    constructor.prototype.readBlock = function() {
      function repeat(stream, array, len, offset, what) {
        var repeat = stream.getBits(len) + offset;
        while (repeat-- > 0)
          array[i++] = what;
      }

      // read block header
      var hdr = this.getBits(3);
      if (hdr & 1)
        this.eof = true;
      hdr >>= 1;

      if (hdr == 0) { // uncompressed block
        var bytes = this.bytes;
        var bytesPos = this.bytesPos;
        var b;

        if (typeof (b = bytes[bytesPos++]) == 'undefined')
          error('Bad block header in flate stream');
        var blockLen = b;
        if (typeof (b = bytes[bytesPos++]) == 'undefined')
          error('Bad block header in flate stream');
        blockLen |= (b << 8);
        if (typeof (b = bytes[bytesPos++]) == 'undefined')
          error('Bad block header in flate stream');
        var check = b;
        if (typeof (b = bytes[bytesPos++]) == 'undefined')
          error('Bad block header in flate stream');
        check |= (b << 8);
        if (check != (~blockLen & 0xffff))
          error('Bad uncompressed block length in flate stream');

        this.codeBuf = 0;
        this.codeSize = 0;

        var bufferLength = this.bufferLength;
        var buffer = this.ensureBuffer(bufferLength + blockLen);
        var end = bufferLength + blockLen;
        this.bufferLength = end;
        for (var n = bufferLength; n < end; ++n) {
          if (typeof (b = bytes[bytesPos++]) == 'undefined') {
            this.eof = true;
            break;
          }
          buffer[n] = b;
        }
        this.bytesPos = bytesPos;
        return;
      }

      var litCodeTable;
      var distCodeTable;
      if (hdr == 1) { // compressed block, fixed codes
        litCodeTable = fixedLitCodeTab;
        distCodeTable = fixedDistCodeTab;
      } else if (hdr == 2) { // compressed block, dynamic codes
        var numLitCodes = this.getBits(5) + 257;
        var numDistCodes = this.getBits(5) + 1;
        var numCodeLenCodes = this.getBits(4) + 4;

        // build the code lengths code table
        var codeLenCodeLengths = Array(codeLenCodeMap.length);
        var i = 0;
        while (i < numCodeLenCodes)
          codeLenCodeLengths[codeLenCodeMap[i++]] = this.getBits(3);
        var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);

        // build the literal and distance code tables
        var len = 0;
        var i = 0;
        var codes = numLitCodes + numDistCodes;
        var codeLengths = new Array(codes);
        while (i < codes) {
          var code = this.getCode(codeLenCodeTab);
          if (code == 16) {
            repeat(this, codeLengths, 2, 3, len);
          } else if (code == 17) {
            repeat(this, codeLengths, 3, 3, len = 0);
          } else if (code == 18) {
            repeat(this, codeLengths, 7, 11, len = 0);
          } else {
            codeLengths[i++] = len = code;
          }
        }

        litCodeTable =
          this.generateHuffmanTable(codeLengths.slice(0, numLitCodes));
        distCodeTable =
          this.generateHuffmanTable(codeLengths.slice(numLitCodes, codes));
      } else {
        error('Unknown block type in flate stream');
      }

      var buffer = this.buffer;
      var limit = buffer ? buffer.length : 0;
      var pos = this.bufferLength;
      while (true) {
        var code1 = this.getCode(litCodeTable);
        if (code1 < 256) {
          if (pos + 1 >= limit) {
            buffer = this.ensureBuffer(pos + 1);
            limit = buffer.length;
          }
          buffer[pos++] = code1;
          continue;
        }
        if (code1 == 256) {
          this.bufferLength = pos;
          return;
        }
        code1 -= 257;
        code1 = lengthDecode[code1];
        var code2 = code1 >> 16;
        if (code2 > 0)
          code2 = this.getBits(code2);
        var len = (code1 & 0xffff) + code2;
        code1 = this.getCode(distCodeTable);
        code1 = distDecode[code1];
        code2 = code1 >> 16;
        if (code2 > 0)
          code2 = this.getBits(code2);
        var dist = (code1 & 0xffff) + code2;
        if (pos + len >= limit) {
          buffer = this.ensureBuffer(pos + len);
          limit = buffer.length;
        }
        for (var k = 0; k < len; ++k, ++pos)
          buffer[pos] = buffer[pos - dist];
      }
    };

    return constructor;
  })();

  /**
   * JavaScript Polyfill functions for jsPDF
   * Collected from public resources by
   * https://github.com/diegocr
   */

  (function (global) {
  	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  	if (typeof global.btoa === 'undefined') {
  		global.btoa = function(data) {
  			//  discuss at: http://phpjs.org/functions/base64_encode/
  			// original by: Tyler Akins (http://rumkin.com)
  			// improved by: Bayron Guevara
  			// improved by: Thunder.m
  			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  			// improved by: Rafal Kukawski (http://kukawski.pl)
  			// bugfixed by: Pellentesque Malesuada
  			//   example 1: base64_encode('Kevin van Zonneveld');
  			//   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='

  			var o1,o2,o3,h1,h2,h3,h4,bits,i = 0,ac = 0,enc = '',tmp_arr = [];

  			if (!data) {
  				return data;
  			}

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
  				tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  			} while (i < data.length);

  			enc = tmp_arr.join('');

  			var r = data.length % 3;

  			return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
  		};
  	}

  	if (typeof global.atob === 'undefined') {
  		global.atob = function(data) {
  			//  discuss at: http://phpjs.org/functions/base64_decode/
  			// original by: Tyler Akins (http://rumkin.com)
  			// improved by: Thunder.m
  			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  			//    input by: Aman Gupta
  			//    input by: Brett Zamir (http://brett-zamir.me)
  			// bugfixed by: Onno Marsman
  			// bugfixed by: Pellentesque Malesuada
  			// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  			//   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
  			//   returns 1: 'Kevin van Zonneveld'

  			var o1,o2,o3,h1,h2,h3,h4,bits,i = 0,ac = 0,dec = '',tmp_arr = [];

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

  	if (!Array.prototype.map) {
  		Array.prototype.map = function(fun /*, thisArg */) {
  			if (this === void 0 || this === null || typeof fun !== "function")
  				throw new TypeError();

  			var t = Object(this), len = t.length >>> 0, res = new Array(len);
  			var thisArg = arguments.length > 1 ? arguments[1] : void 0;
  			for (var i = 0; i < len; i++) {
  				// NOTE: Absolute correctness would demand Object.defineProperty
  				//       be used.  But this method is fairly new, and failure is
  				//       possible only if Object.prototype or Array.prototype
  				//       has a property |i| (very unlikely), so use a less-correct
  				//       but more portable alternative.
  				if (i in t)
  					res[i] = fun.call(thisArg, t[i], i, t);
  			}

  			return res;
  		};
  	}


  	if(!Array.isArray) {
  		Array.isArray = function(arg) {
  			return Object.prototype.toString.call(arg) === '[object Array]';
  		};
  	}

  	if (!Array.prototype.forEach) {
  		Array.prototype.forEach = function(fun, thisArg) {
  			"use strict";

  			if (this === void 0 || this === null || typeof fun !== "function")
  				throw new TypeError();

  			var t = Object(this), len = t.length >>> 0;
  			for (var i = 0; i < len; i++) {
  				if (i in t)
  					fun.call(thisArg, t[i], i, t);
  			}
  		};
  	}

  	if (!Object.keys) {
  		Object.keys = (function () {
  			'use strict';

  			var hasOwnProperty = Object.prototype.hasOwnProperty,
  				hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
  				dontEnums = ['toString','toLocaleString','valueOf','hasOwnProperty',
  					'isPrototypeOf','propertyIsEnumerable','constructor'],
  				dontEnumsLength = dontEnums.length;

  			return function (obj) {
  				if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
  					throw new TypeError();
  				}
  				var result = [], prop, i;

  				for (prop in obj) {
  					if (hasOwnProperty.call(obj, prop)) {
  						result.push(prop);
  					}
  				}

  				if (hasDontEnumBug) {
  					for (i = 0; i < dontEnumsLength; i++) {
  						if (hasOwnProperty.call(obj, dontEnums[i])) {
  							result.push(dontEnums[i]);
  						}
  					}
  				}
  				return result;
  			};
  		}());
  	}

  	if (!String.prototype.trim) {
  		String.prototype.trim = function () {
  			return this.replace(/^\s+|\s+$/g, '');
  		};
  	}
  	if (!String.prototype.trimLeft) {
  		String.prototype.trimLeft = function() {
  			return this.replace(/^\s+/g, "");
  		};
  	}
  	if (!String.prototype.trimRight) {
  		String.prototype.trimRight = function() {
  			return this.replace(/\s+$/g, "");
  		};
  	}

  })(typeof self !== "undefined" && self || typeof window !== "undefined" && window || undefined);

  var jsPDF = jsPDF;

  return jsPDF;

}));