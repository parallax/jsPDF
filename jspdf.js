/** @license
 * jsPDF - PDF Document creation from JavaScript
 * Version ${versionID} Built on ${builtOn}
 *                           CommitID ${commitID}
 *
 * Copyright (c) 2015-2018 yWorks GmbH, http://www.yworks.com
 *               2015-2018 Lukas Holländer <lukas.hollaender@yworks.com>, https://github.com/HackbrettXXX
 *               2010-2016 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
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
 *    kim3er, mfo, alnorth, Flamenco
 */

/**
 * Creates new jsPDF document object instance.
 * @name jsPDF
 * @class
 * @param orientation {string/Object} Orientation of the first page. Possible values are "portrait" or "landscape" (or shortcuts "p" (Default), "l") <br />
 * Can also be an options object.
 * @param unit {string}  Measurement unit to be used when coordinates are specified.<br />
 * Possible values are "pt" (points), "mm" (Default), "cm", "in" or "px".
 * @param format {string/Array} The format of the first page. Can be <ul><li>a0 - a10</li><li>b0 - b10</li><li>c0 - c10</li><li>c0 - c10</li><li>dl</li><li>letter</li><li>government-letter</li><li>legal</li><li>junior-legal</li><li>ledger</li><li>tabloid</li><li>credit-card</li></ul><br />
 * Default is "a4". If you want to use your own format just pass instead of one of the above predefined formats the size as an number-array , e.g. [595.28, 841.89]
 * @returns {jsPDF} jsPDF-instance
 * @description
 * If the first parameter (orientation) is an object, it will be interpreted as an object of named parameters
 * ```
 * {
 *  orientation: 'p',
 *  unit: 'mm',
 *  format: 'a4',
 *  hotfixes: [] // an array of hotfix strings to enable
 * }
 * ```
 */
var jsPDF = (function(global) {
  "use strict";
  var pdfVersion = "1.3",
    pageFormats = {
      // Size in pt of various paper formats
      a0: [2383.94, 3370.39],
      a1: [1683.78, 2383.94],
      a2: [1190.55, 1683.78],
      a3: [841.89, 1190.55],
      a4: [595.28, 841.89],
      a5: [419.53, 595.28],
      a6: [297.64, 419.53],
      a7: [209.76, 297.64],
      a8: [147.4, 209.76],
      a9: [104.88, 147.4],
      a10: [73.7, 104.88],
      b0: [2834.65, 4008.19],
      b1: [2004.09, 2834.65],
      b2: [1417.32, 2004.09],
      b3: [1000.63, 1417.32],
      b4: [708.66, 1000.63],
      b5: [498.9, 708.66],
      b6: [354.33, 498.9],
      b7: [249.45, 354.33],
      b8: [175.75, 249.45],
      b9: [124.72, 175.75],
      b10: [87.87, 124.72],
      c0: [2599.37, 3676.54],
      c1: [1836.85, 2599.37],
      c2: [1298.27, 1836.85],
      c3: [918.43, 1298.27],
      c4: [649.13, 918.43],
      c5: [459.21, 649.13],
      c6: [323.15, 459.21],
      c7: [229.61, 323.15],
      c8: [161.57, 229.61],
      c9: [113.39, 161.57],
      c10: [79.37, 113.39],
      dl: [311.81, 623.62],
      letter: [612, 792],
      "government-letter": [576, 756],
      legal: [612, 1008],
      "junior-legal": [576, 360],
      ledger: [1224, 792],
      tabloid: [792, 1224],
      "credit-card": [153, 243]
    };

  /**
   * jsPDF's Internal PubSub Implementation.
   * Backward compatible rewritten on 2014 by
   * Diego Casorran, https://github.com/diegocr
   *
   * @class
   * @name PubSub
   * @ignore
   */
  function PubSub(context) {
    var topics = {};

    this.subscribe = function(topic, callback, once) {
      if (typeof callback !== "function") {
        return false;
      }

      if (!topics.hasOwnProperty(topic)) {
        topics[topic] = {};
      }

      var id = Math.random().toString(35);
      topics[topic][id] = [callback, !!once];

      return id;
    };

    this.unsubscribe = function(token) {
      for (var topic in topics) {
        if (topics[topic][token]) {
          delete topics[topic][token];
          return true;
        }
      }
      return false;
    };

    this.publish = function(topic) {
      if (topics.hasOwnProperty(topic)) {
        var args = Array.prototype.slice.call(arguments, 1),
          idr = [];

        for (var id in topics[topic]) {
          var sub = topics[topic][id];
          try {
            sub[0].apply(context, args);
          } catch (ex) {
            if (global.console) {
              console.error("jsPDF PubSub Error", ex.message, ex);
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

    if (typeof orientation === "object") {
      options = orientation;

      orientation = options.orientation;
      unit = options.unit || unit;
      format = options.format || format;
      compressPdf = options.compress || options.compressPdf || compressPdf;
    }

    // Default options
    unit = unit || "mm";
    format = format || "a4";
    orientation = ("" + (orientation || "P")).toLowerCase();

    var format_as_string = ("" + format).toLowerCase(),
      compress = !!compressPdf && typeof Uint8Array === "function",
      textColor = options.textColor || "0 g",
      drawColor = options.drawColor || "0 G",
      activeFontSize = options.fontSize || 16,
      activeCharSpace = options.charSpace || 0,
      R2L = options.R2L || false,
      lineHeightProportion = options.lineHeight || 1.15,
      lineWidth = options.lineWidth || 0.200025, // 2mm
      fileId = "00000000000000000000000000000000",
      objectNumber = 2, // 'n' Current object number
      outToPages = !1, // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
      offsets = [], // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
      fonts = {}, // collection of font objects, where key is fontKey - a dynamically created label for a given font.
      fontmap = {}, // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
      activeFontKey, // will be string representing the KEY of the font as combination of fontName + fontStyle
      fontStateStack = [], //
      patterns = {}, // collection of pattern objects
      patternMap = {}, // see fonts
      gStates = {}, // collection of graphic state objects
      gStatesMap = {}, // see fonts
      activeGState = null,
      k, // Scale factor
      tmp,
      page = 0,
      currentPage,
      pages = [],
      pagesContext = [], // same index as pages and pagedim
      pagedim = [],
      content = [],
      additionalObjects = [],
      lineCapID = 0,
      lineJoinID = 0,
      content_length = 0,
      renderTargets = {},
      renderTargetMap = {},
      renderTargetStack = [],
      pageX,
      pageY,
      pageMatrix, // only used for FormObjects
      pageWidth,
      pageHeight,
      pageMode,
      zoomMode,
      layoutMode,
      creationDate,
      documentProperties = {
        title: "",
        subject: "",
        author: "",
        keywords: "",
        creator: ""
      },
      API = {},
      ApiMode = {
        COMPAT: "compat",
        ADVANCED: "advanced"
      },
      apiMode = ApiMode.COMPAT,
      events = new PubSub(API),
      hotfixes = options.hotfixes || [],
      /////////////////////
      // Private functions
      /////////////////////
      generateColorString = function(options) {
        var color;

        var ch1 = options.ch1;
        var ch2 = options.ch2;
        var ch3 = options.ch3;
        var ch4 = options.ch4;
        var precision = options.precision;
        var letterArray = options.pdfColorType === "draw" ? ["G", "RG", "K"] : ["g", "rg", "k"];

        if (typeof ch1 === "string" && ch1.charAt(0) !== "#") {
          var rgbColor = new RGBColor(ch1);
          if (rgbColor.ok) {
            ch1 = rgbColor.toHex();
          }
        }
        //convert short rgb to long form
        if (typeof ch1 === "string" && /^#[0-9A-Fa-f]{3}$/.test(ch1)) {
          ch1 = "#" + ch1[1] + ch1[1] + ch1[2] + ch1[2] + ch1[3] + ch1[3];
        }

        if (typeof ch1 === "string" && /^#[0-9A-Fa-f]{6}$/.test(ch1)) {
          var hex = parseInt(ch1.substr(1), 16);
          ch1 = (hex >> 16) & 255;
          ch2 = (hex >> 8) & 255;
          ch3 = hex & 255;
        }

        if (typeof ch2 === "undefined" || (typeof ch4 === "undefined" && (ch1 === ch2 && ch2 === ch3))) {
          // Gray color space.
          if (typeof ch1 === "string") {
            color = ch1 + " " + letterArray[0];
          } else {
            switch (options.precision) {
              case 2:
                color = f2(ch1 / 255) + " " + letterArray[0];
                break;
              case 3:
              default:
                color = f3(ch1 / 255) + " " + letterArray[0];
            }
          }
        } else if (typeof ch4 === "undefined" || typeof ch4 === "object") {
          // assume RGB
          if (typeof ch1 === "string") {
            color = [ch1, ch2, ch3, letterArray[1]].join(" ");
          } else {
            switch (options.precision) {
              case 2:
                color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), letterArray[1]].join(" ");
                break;
              default:
              case 3:
                color = [f3(ch1 / 255), f3(ch2 / 255), f3(ch3 / 255), letterArray[1]].join(" ");
            }
          }
          // assume RGBA
          if (ch4 && ch4.a === 0) {
            //TODO Implement transparency.
            //WORKAROUND use white for now
            color = ["255", "255", "255", letterArray[1]].join(" ");
          }
        } else {
          // assume CMYK
          if (typeof ch1 === "string") {
            color = [ch1, ch2, ch3, ch4, letterArray[2]].join(" ");
          } else {
            switch (options.precision) {
              case 2:
                color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), letterArray[2]].join(" ");
                break;
              case 3:
              default:
                color = [f3(ch1), f3(ch2), f3(ch3), f3(ch4), letterArray[2]].join(" ");
            }
          }
        }
        return color;
      },
      convertDateToPDFDate = function(parmDate) {
        var padd2 = function(number) {
          return ("0" + parseInt(number)).slice(-2);
        };
        var result = "";
        var tzoffset = parmDate.getTimezoneOffset(),
          tzsign = tzoffset < 0 ? "+" : "-",
          tzhour = Math.floor(Math.abs(tzoffset / 60)),
          tzmin = Math.abs(tzoffset % 60),
          timeZoneString = [tzsign, padd2(tzhour), "'", padd2(tzmin), "'"].join("");

        result = [
          "D:",
          parmDate.getFullYear(),
          padd2(parmDate.getMonth() + 1),
          padd2(parmDate.getDate()),
          padd2(parmDate.getHours()),
          padd2(parmDate.getMinutes()),
          padd2(parmDate.getSeconds()),
          timeZoneString
        ].join("");
        return result;
      },
      convertPDFDateToDate = function(parmPDFDate) {
        var year = parseInt(parmPDFDate.substr(2, 4), 10);
        var month = parseInt(parmPDFDate.substr(6, 2), 10) - 1;
        var date = parseInt(parmPDFDate.substr(8, 2), 10);
        var hour = parseInt(parmPDFDate.substr(10, 2), 10);
        var minutes = parseInt(parmPDFDate.substr(12, 2), 10);
        var seconds = parseInt(parmPDFDate.substr(14, 2), 10);
        var timeZoneHour = parseInt(parmPDFDate.substr(16, 2), 10);
        var timeZoneMinutes = parseInt(parmPDFDate.substr(20, 2), 10);

        var resultingDate = new Date(year, month, date, hour, minutes, seconds, 0);
        return resultingDate;
      },
      setCreationDate = function(date) {
        var tmpCreationDateString;
        var regexPDFCreationDate = /^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|\-0[0-9]|\-1[0-1])\'(0[0-9]|[1-5][0-9])\'?$/;
        if (typeof date === undefined) {
          date = new Date();
        }

        if (typeof date === "object" && Object.prototype.toString.call(date) === "[object Date]") {
          tmpCreationDateString = convertDateToPDFDate(date);
        } else if (regexPDFCreationDate.test(date)) {
          tmpCreationDateString = date;
        } else {
          tmpCreationDateString = convertDateToPDFDate(new Date());
        }
        creationDate = tmpCreationDateString;
        return creationDate;
      },
      getCreationDate = function(type) {
        var result = creationDate;
        if (type === "jsDate") {
          result = convertPDFDateToDate(creationDate);
        }
        return result;
      },
      setFileId = function(value) {
        value =
          value ||
          "12345678901234567890123456789012"
            .split("")
            .map(function() {
              return "ABCDEF0123456789".charAt(Math.floor(Math.random() * 16));
            })
            .join("");
        fileId = value;
        return fileId;
      },
      getFileId = function() {
        return fileId;
      },
      f2 = function(number) {
        return number.toFixed(2); // Ie, %.2f
      },
      f3 = function(number) {
        return number.toFixed(3); // Ie, %.3f
      },
      // high precision float
      hpf = function(number) {
        return number.toFixed(16).replace(/0+$/, "");
      },
      scaleByK = function(coordinate) {
        if (apiMode === ApiMode.COMPAT) {
          return coordinate * k;
        } else if (apiMode === ApiMode.ADVANCED) {
          return coordinate;
        }
      },
      transformY = function(y) {
        if (apiMode === ApiMode.COMPAT) {
          return pageHeight - y;
        } else if (apiMode === ApiMode.ADVANCED) {
          return y;
        }
      },
      transformScaleY = function(y) {
        return scaleByK(transformY(y));
      },
      padd2 = function(number) {
        return ("0" + parseInt(number)).slice(-2);
      },
      padd2Hex = function(hexString) {
        var s = "00" + hexString;
        return s.substr(s.length - 2);
      },
      advancedApiModeTrap = function(methodName) {
        if (apiMode !== ApiMode.ADVANCED) {
          throw new Error(
            methodName +
              " is only available in 'advanced' API mode. " +
              "You need to call advancedAPI() first."
          );
        }
      },
      out = function(string) {
        string = typeof string === "string" ? string : string.toString();
        if (outToPages) {
          /* set by beginPage */
          pages[currentPage].push(string);
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
        out(objectNumber + " 0 obj");
        return objectNumber;
      },
      // Does not output the object until after the pages have been output.
      // Returns an object containing the objectId and content.
      // All pages have been added so the object ID can be estimated to start right after.
      // This does not modify the current objectNumber;  It must be updated after the newObjects are output.
      newAdditionalObject = function() {
        var objId = pages.length * 2 + 1;
        objId += additionalObjects.length;
        var obj = {
          objId: objId,
          content: ""
        };
        additionalObjects.push(obj);
        return obj;
      },
      // Does not output the object.  The caller must call newObjectDeferredBegin(oid) before outputing any data
      newObjectDeferred = function() {
        objectNumber++;
        offsets[objectNumber] = function() {
          return content_length;
        };
        return objectNumber;
      },
      newObjectDeferredBegin = function(oid) {
        offsets[oid] = content_length;
      },
      putStream = function(str) {
        out("stream");
        out(str);
        out("endstream");
      },
      putPages = function() {
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

        adler32cs = global.adler32cs || jsPDF.API.adler32cs;
        if (compress && typeof adler32cs === "undefined") {
          compress = false;
        }

        // outToPages = false as set in endDocument(). out() writes to content.

        for (n = 1; n <= page; n++) {
          pageObjectNumbers.push(newObject());
          wPt = (pageWidth = pagedim[n].width) * k;
          hPt = (pageHeight = pagedim[n].height) * k;
          out("<</Type /Page");
          out("/Parent 1 0 R");
          out("/Resources 2 0 R");
          out("/MediaBox [0 0 " + hpf(wPt) + " " + hpf(hPt) + "]");
          // Added for annotation plugin
          events.publish("putPage", {
            pageNumber: n,
            page: pages[n]
          });
          out("/Contents " + (objectNumber + 1) + " 0 R");
          out(">>");
          out("endobj");

          // Page content
          p = pages[n].join("\n");

          if (apiMode === ApiMode.ADVANCED) {
            // if the user forgot to switch back to COMPAT mode, we must balance the graphics stack again
            p += "\nQ";
          }

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
            arr.set(new Uint8Array([120, 156]));
            arr.set(p, 2);
            arr.set(
              new Uint8Array([adler32 & 0xff, (adler32 >> 8) & 0xff, (adler32 >> 16) & 0xff, (adler32 >> 24) & 0xff]),
              p.length + 2
            );
            p = String.fromCharCode.apply(null, arr);
            out("<</Length " + p.length + " /Filter [/FlateDecode]>>");
          } else {
            out("<</Length " + p.length + ">>");
          }
          putStream(p);
          out("endobj");
        }
        offsets[1] = content_length;
        out("1 0 obj");
        out("<</Type /Pages");
        var kids = "/Kids [";
        for (i = 0; i < page; i++) {
          kids += pageObjectNumbers[i] + " 0 R ";
        }
        out(kids + "]");
        out("/Count " + page);
        out(">>");
        out("endobj");
        events.publish("postPutPages");
      },
      putFont = function(font) {
        events.publish("putFont", {
          font: font,
          out: out,
          newObject: newObject
        });
        if (font.isAlreadyPutted !== true) {
          font.objectNumber = newObject();
          out("<<");
          out("/Type /Font");
          out("/BaseFont /" + font.postScriptName);
          out("/Subtype /Type1");
          if (typeof font.encoding === "string") {
            out("/Encoding /" + font.encoding);
          }
          out("/FirstChar 32");
          out("/LastChar 255");
          out(">>");
          out("endobj");
        }
      },
      putFonts = function() {
        for (var fontKey in fonts) {
          if (fonts.hasOwnProperty(fontKey)) {
            putFont(fonts[fontKey]);
          }
        }
      },
      putXObject = function(xObject) {
        xObject.objectNumber = newObject();
        out("<<");
        out("/Type /XObject");
        out("/Subtype /Form");
        out(
          "/BBox [" +
            [hpf(xObject.x), hpf(xObject.y), hpf(xObject.x + xObject.width), hpf(xObject.y + xObject.height)].join(
              " "
            ) +
            "]"
        );
        out("/Matrix [" + xObject.matrix.toString() + "]");
        // TODO: /Resources

        var p = xObject.pages[1].join("\n");
        out("/Length " + p.length);

        out(">>");
        putStream(p);
        out("endobj");
      },
      putXObjects = function() {
        for (var xObjectKey in renderTargets) {
          if (renderTargets.hasOwnProperty(xObjectKey)) {
            putXObject(renderTargets[xObjectKey]);
          }
        }
      },
      interpolateAndEncodeRGBStream = function(colors, numberSamples) {
        var tValues = [];
        var t;
        var dT = 1.0 / (numberSamples - 1);
        for (t = 0.0; t < 1.0; t += dT) {
          tValues.push(t);
        }
        tValues.push(1.0);

        // add first and last control point if not present
        if (colors[0].offset != 0.0) {
          var c0 = {
            offset: 0.0,
            color: colors[0].color
          };
          colors.unshift(c0);
        }
        if (colors[colors.length - 1].offset != 1.0) {
          var c1 = {
            offset: 1.0,
            color: colors[colors.length - 1].color
          };
          colors.push(c1);
        }

        var out = "";
        var index = 0;

        for (var i = 0; i < tValues.length; i++) {
          t = tValues[i];

          while (t > colors[index + 1].offset) index++;

          var a = colors[index].offset;
          var b = colors[index + 1].offset;
          var d = (t - a) / (b - a);

          var aColor = colors[index].color;
          var bColor = colors[index + 1].color;

          out +=
            padd2Hex(Math.round((1 - d) * aColor[0] + d * bColor[0]).toString(16)) +
            padd2Hex(Math.round((1 - d) * aColor[1] + d * bColor[1]).toString(16)) +
            padd2Hex(Math.round((1 - d) * aColor[2] + d * bColor[2]).toString(16));
        }
        return out.trim();
      },
      putShadingPattern = function(pattern, numberSamples) {
        /*
       Axial patterns shade between the two points specified in coords, radial patterns between the inner
       and outer circle.

       The user can specify an array (colors) that maps t-Values in [0, 1] to RGB colors. These are now
       interpolated to equidistant samples and written to pdf as a sample (type 0) function.
       */

        // The number of color samples that should be used to describe the shading.
        // The higher, the more accurate the gradient will be.
        numberSamples || (numberSamples = 21);

        var funcObjectNumber = newObject();
        var stream = interpolateAndEncodeRGBStream(pattern.colors, numberSamples);
        out("<< /FunctionType 0");
        out("/Domain [0.0 1.0]");
        out("/Size [" + numberSamples + "]");
        out("/BitsPerSample 8");
        out("/Range [0.0 1.0 0.0 1.0 0.0 1.0]");
        out("/Decode [0.0 1.0 0.0 1.0 0.0 1.0]");
        out("/Length " + stream.length);
        // The stream is Hex encoded
        out("/Filter /ASCIIHexDecode");
        out(">>");
        putStream(stream);
        out("endobj");

        pattern.objectNumber = newObject();
        out("<< /ShadingType " + pattern.type);
        out("/ColorSpace /DeviceRGB");

        var coords =
          "/Coords [" +
          hpf(parseFloat(pattern.coords[0])) +
          " " + // x1
          hpf(parseFloat(pattern.coords[1])) +
          " "; // y1
        if (pattern.type === 2) {
          // axial
          coords +=
            hpf(parseFloat(pattern.coords[2])) +
            " " + // x2
            hpf(parseFloat(pattern.coords[3])); // y2
        } else {
          // radial
          coords +=
            hpf(parseFloat(pattern.coords[2])) +
            " " + // r1
            hpf(parseFloat(pattern.coords[3])) +
            " " + // x2
            hpf(parseFloat(pattern.coords[4])) +
            " " + // y2
            hpf(parseFloat(pattern.coords[5])); // r2
        }
        coords += "]";
        out(coords);

        if (pattern.matrix) {
          out("/Matrix [" + pattern.matrix.toString() + "]");
        }

        out("/Function " + funcObjectNumber + " 0 R");
        out("/Extend [true true]");
        out(">>");
        out("endobj");
      },
      putTilingPattern = function(pattern) {
        var resourcesObjectNumber = newObject();
        out("<<");
        putResourceDictionary();
        out(">>");
        out("endobj");

        pattern.objectNumber = newObject();
        out("<< /Type /Pattern");
        out("/PatternType 1"); // tiling pattern
        out("/PaintType 1"); // colored tiling pattern
        out("/TilingType 1"); // constant spacing
        out("/BBox [" + pattern.boundingBox.map(hpf).join(" ") + "]");
        out("/XStep " + hpf(pattern.xStep));
        out("/YStep " + hpf(pattern.yStep));
        out("/Length " + pattern.stream.length);
        out("/Resources " + resourcesObjectNumber + " 0 R"); // TODO: resources
        pattern.matrix && out("/Matrix [" + pattern.matrix.toString() + "]");

        out(">>");

        putStream(pattern.stream);

        out("endobj");
      },
      putPatterns = function() {
        var patternKey;
        for (patternKey in patterns) {
          if (patterns.hasOwnProperty(patternKey)) {
            if (patterns[patternKey] instanceof API.ShadingPattern) {
              putShadingPattern(patterns[patternKey]);
            } else if (patterns[patternKey] instanceof API.TilingPattern) {
              putTilingPattern(patterns[patternKey]);
            }
          }
        }
      },
      putGState = function(gState) {
        gState.objectNumber = newObject();
        out("<<");
        for (var p in gState) {
          switch (p) {
            case "opacity":
              out("/ca " + f2(gState[p]));
              break;
            case "stroke-opacity":
              out("/CA " + f2(gState[p]));
              break;
          }
        }
        out(">>");
        out("endobj");
      },
      putGStates = function() {
        var gStateKey;
        for (gStateKey in gStates) {
          if (gStates.hasOwnProperty(gStateKey)) {
            putGState(gStates[gStateKey]);
          }
        }
      },
      putXobjectDict = function() {
        for (var xObjectKey in renderTargets) {
          if (renderTargets.hasOwnProperty(xObjectKey) && renderTargets[xObjectKey].objectNumber >= 0) {
            out("/" + xObjectKey + " " + renderTargets[xObjectKey].objectNumber + " 0 R");
          }
        }

        events.publish("putXobjectDict");
      },
      putShadingPatternDict = function() {
        for (var patternKey in patterns) {
          if (
            patterns.hasOwnProperty(patternKey) &&
            patterns[patternKey] instanceof API.ShadingPattern &&
            patterns[patternKey].objectNumber >= 0
          ) {
            out("/" + patternKey + " " + patterns[patternKey].objectNumber + " 0 R");
          }
        }

        events.publish("putShadingPatternDict");
      },
      putTilingPatternDict = function() {
        for (var patternKey in patterns) {
          if (
            patterns.hasOwnProperty(patternKey) &&
            patterns[patternKey] instanceof API.TilingPattern &&
            patterns[patternKey].objectNumber >= 0
          ) {
            out("/" + patternKey + " " + patterns[patternKey].objectNumber + " 0 R");
          }
        }

        events.publish("putTilingPatternDict");
      },
      putGStatesDict = function() {
        var gStateKey;
        for (gStateKey in gStates) {
          if (gStates.hasOwnProperty(gStateKey) && gStates[gStateKey].objectNumber >= 0) {
            out("/" + gStateKey + " " + gStates[gStateKey].objectNumber + " 0 R");
          }
        }

        events.publish("putGStateDict");
      },
      putResourceDictionary = function() {
        out("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]");
        out("/Font <<");

        // Do this for each font, the '1' bit is the index of the font
        for (var fontKey in fonts) {
          if (fonts.hasOwnProperty(fontKey)) {
            out("/" + fontKey + " " + fonts[fontKey].objectNumber + " 0 R");
          }
        }
        out(">>");

        out("/Shading <<");
        putShadingPatternDict();
        out(">>");

        out("/Pattern <<");
        putTilingPatternDict();
        out(">>");

        out("/ExtGState <<");
        putGStatesDict();
        out(">>");

        out("/XObject <<");
        putXobjectDict();
        out(">>");
      },
      putResources = function() {
        putFonts();
        putGStates();
        putXObjects();
        putPatterns();
        events.publish("putResources");
        // Resource dictionary
        offsets[2] = content_length;
        out("2 0 obj");
        out("<<");
        putResourceDictionary();
        out(">>");
        out("endobj");
        events.publish("postPutResources");
      },
      putAdditionalObjects = function() {
        events.publish("putAdditionalObjects");
        for (var i = 0; i < additionalObjects.length; i++) {
          var obj = additionalObjects[i];
          offsets[obj.objId] = content_length;
          out(obj.objId + " 0 obj");
          out(obj.content);
          out("endobj");
        }
        objectNumber += additionalObjects.length;
        events.publish("postPutAdditionalObjects");
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
      addFont = function(postScriptName, fontName, fontStyle, encoding) {
        var fontKey = "F" + (Object.keys(fonts).length + 1).toString(10),
          // This is FontObject
          font = (fonts[fontKey] = {
            id: fontKey,
            postScriptName: postScriptName,
            fontName: fontName,
            fontStyle: fontStyle,
            encoding: encoding,
            metadata: {}
          });
        addToFontDictionary(fontKey, fontName, fontStyle);
        events.publish("addFont", font);

        return fontKey;
      },
      addFonts = function() {
        var HELVETICA = "helvetica",
          TIMES = "times",
          COURIER = "courier",
          NORMAL = "normal",
          BOLD = "bold",
          ITALIC = "italic",
          BOLD_ITALIC = "bolditalic",
          encoding = "StandardEncoding",
          ZAPF = "zapfdingbats",
          SYMBOL = "symbol",
          standardFonts = [
            ["Helvetica", HELVETICA, NORMAL, "WinAnsiEncoding"],
            ["Helvetica-Bold", HELVETICA, BOLD, "WinAnsiEncoding"],
            ["Helvetica-Oblique", HELVETICA, ITALIC, "WinAnsiEncoding"],
            ["Helvetica-BoldOblique", HELVETICA, BOLD_ITALIC, "WinAnsiEncoding"],
            ["Courier", COURIER, NORMAL, "WinAnsiEncoding"],
            ["Courier-Bold", COURIER, BOLD, "WinAnsiEncoding"],
            ["Courier-Oblique", COURIER, ITALIC, "WinAnsiEncoding"],
            ["Courier-BoldOblique", COURIER, BOLD_ITALIC, "WinAnsiEncoding"],
            ["Times-Roman", TIMES, NORMAL, "WinAnsiEncoding"],
            ["Times-Bold", TIMES, BOLD, "WinAnsiEncoding"],
            ["Times-Italic", TIMES, ITALIC, "WinAnsiEncoding"],
            ["Times-BoldItalic", TIMES, BOLD_ITALIC, "WinAnsiEncoding"],
            ["ZapfDingbats", ZAPF, NORMAL, null],
            ["Symbol", SYMBOL, NORMAL, null]
          ];

        for (var i = 0, l = standardFonts.length; i < l; i++) {
          var fontKey = addFont(standardFonts[i][0], standardFonts[i][1], standardFonts[i][2], standardFonts[i][3]);

          // adding aliases for standard fonts, this time matching the capitalization
          var parts = standardFonts[i][0].split("-");
          addToFontDictionary(fontKey, parts[0], parts[1] || "");
        }
        events.publish("addFonts", { fonts: fonts, dictionary: fontmap });
      },
      matrixMult = function(m1, m2) {
        return new Matrix(
          m1.a * m2.a + m1.b * m2.c,
          m1.a * m2.b + m1.b * m2.d,
          m1.c * m2.a + m1.d * m2.c,
          m1.c * m2.b + m1.d * m2.d,
          m1.e * m2.a + m1.f * m2.c + m2.e,
          m1.e * m2.b + m1.f * m2.d + m2.f
        );
      },
      Matrix = function(a, b, c, d, e, f) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
      };

    Matrix.prototype = {
      toString: function() {
        return [hpf(this.a), hpf(this.b), hpf(this.c), hpf(this.d), hpf(this.e), hpf(this.f)].join(" ");
      },

      inversed: function() {
        var a = this.a,
          b = this.b,
          c = this.c,
          d = this.d,
          e = this.e,
          f = this.f;

        var quot = 1 / (a * d - b * c);

        var aInv = d * quot;
        var bInv = -b * quot;
        var cInv = -c * quot;
        var dInv = a * quot;
        var eInv = -aInv * e - cInv * f;
        var fInv = -bInv * e - dInv * f;

        return new Matrix(aInv, bInv, cInv, dInv, eInv, fInv);
      }
    };

    var unitMatrix = new Matrix(1, 0, 0, 1, 0, 0),
      // Used (1) to save the current stream state to the XObjects stack and (2) to save completed form
      // objects in the xObjects map.
      RenderTarget = function() {
        this.page = page;
        this.currentPage = currentPage;
        this.pages = pages.slice(0);
        this.pagedim = pagedim.slice(0);
        this.pagesContext = pagesContext.slice(0);
        this.x = pageX;
        this.y = pageY;
        this.matrix = pageMatrix;
        this.width = pageWidth;
        this.height = pageHeight;

        this.id = ""; // set by endFormObject()
        this.objectNumber = -1; // will be set by putXObject()
      };

    RenderTarget.prototype = {
      restore: function() {
        page = this.page;
        currentPage = this.currentPage;
        pagesContext = this.pagesContext;
        pagedim = this.pagedim;
        pages = this.pages;
        pageX = this.x;
        pageY = this.y;
        pageMatrix = this.matrix;
        pageWidth = this.width;
        pageHeight = this.height;
      }
    };

    var beginNewRenderTarget = function(x, y, width, height, matrix) {
        // save current state
        renderTargetStack.push(new RenderTarget());

        // clear pages
        page = currentPage = 0;
        pages = [];
        pageX = x;
        pageY = y;

        pageMatrix = matrix;

        beginPage(width, height);
      },
      endFormObject = function(key) {
        // only add it if it is not already present (the keys provided by the user must be unique!)
        if (renderTargetMap[key]) return;

        // save the created xObject
        var newXObject = new RenderTarget();

        var xObjectId = "Xo" + (Object.keys(renderTargets).length + 1).toString(10);
        newXObject.id = xObjectId;

        renderTargetMap[key] = xObjectId;
        renderTargets[xObjectId] = newXObject;

        events.publish("addFormObject", newXObject);

        // restore state from stack
        renderTargetStack.pop().restore();
      },
      /**
       * Adds a new pattern for later use.
       * @param {String} key The key by it can be referenced later. The keys must be unique!
       * @param {API.Pattern} pattern The pattern
       */
      addPattern = function(key, pattern) {
        // only add it if it is not already present (the keys provided by the user must be unique!)
        if (patternMap[key]) return;

        var prefix = pattern instanceof API.ShadingPattern ? "Sh" : "P";
        var patternKey = prefix + (Object.keys(patterns).length + 1).toString(10);
        pattern.id = patternKey;

        patternMap[key] = patternKey;
        patterns[patternKey] = pattern;

        events.publish("addPattern", pattern);
      },
      /**
       * Adds a new Graphics State. Duplicates are automatically eliminated.
       * @param {String} key Might also be null, if no later reference to this gState is needed
       * @param {Object} gState The gState object
       */
      addGState = function(key, gState) {
        // only add it if it is not already present (the keys provided by the user must be unique!)
        if (key && gStatesMap[key]) return;

        var duplicate = false;
        for (var s in gStates) {
          if (gStates.hasOwnProperty(s)) {
            if (gStates[s].equals(gState)) {
              duplicate = true;
              break;
            }
          }
        }

        if (duplicate) {
          gState = gStates[s];
        } else {
          var gStateKey = "GS" + (Object.keys(gStates).length + 1).toString(10);
          gStates[gStateKey] = gState;
          gState.id = gStateKey;
        }

        // several user keys may point to the same GState object
        key && (gStatesMap[key] = gState.id);

        events.publish("addGState", gState);

        return gState;
      },
      SAFE = function __safeCall(fn) {
        fn.foo = function __safeCallWrapper() {
          try {
            return fn.apply(this, arguments);
          } catch (e) {
            var stack = e.stack || "";
            if (~stack.indexOf(" at ")) stack = stack.split(" at ")[1];
            var m = "Error in function " + stack.split("\n")[0].split("<")[0] + ": " + e.message;
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

        var i, l, sourceEncoding, encodingBlock, outputEncoding, newtext, isUnicode, ch, bch;

        flags = flags || {};
        sourceEncoding = flags.sourceEncoding || "Unicode";
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
        if (
          (flags.autoencode || outputEncoding) &&
          fonts[activeFontKey].metadata &&
          fonts[activeFontKey].metadata[sourceEncoding] &&
          fonts[activeFontKey].metadata[sourceEncoding].encoding
        ) {
          encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding;

          // each font has default encoding. Some have it clearly defined.
          if (!outputEncoding && fonts[activeFontKey].encoding) {
            outputEncoding = fonts[activeFontKey].encoding;
          }

          // Hmmm, the above did not work? Let's try again, in different place.
          if (!outputEncoding && encodingBlock.codePages) {
            outputEncoding = encodingBlock.codePages[0]; // let's say, first one is the default
          }

          if (typeof outputEncoding === "string") {
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
            text = newtext.join("");
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
            throw new Error(
              "Character at position " + i + " of string '" + text + "' exceeds 16bits. Cannot be encoded into UCS-2 BE"
            );
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
        return to8bitStream(text, flags)
          .replace(/\\/g, "\\\\")
          .replace(/\(/g, "\\(")
          .replace(/\)/g, "\\)");
      },
      putInfo = function() {
        out("/Producer (jsPDF " + jsPDF.version + ")");
        for (var key in documentProperties) {
          if (documentProperties.hasOwnProperty(key) && documentProperties[key]) {
            out("/" + key.substr(0, 1).toUpperCase() + key.substr(1) + " (" + pdfEscape(documentProperties[key]) + ")");
          }
        }
        out("/CreationDate (" + creationDate + ")");
      },
      putCatalog = function() {
        out("/Type /Catalog");
        out("/Pages 1 0 R");
        // PDF13ref Section 7.2.1
        if (!zoomMode) zoomMode = "fullwidth";
        switch (zoomMode) {
          case "fullwidth":
            out("/OpenAction [3 0 R /FitH null]");
            break;
          case "fullheight":
            out("/OpenAction [3 0 R /FitV null]");
            break;
          case "fullpage":
            out("/OpenAction [3 0 R /Fit]");
            break;
          case "original":
            out("/OpenAction [3 0 R /XYZ null null 1]");
            break;
          default:
            var pcn = "" + zoomMode;
            if (pcn.substr(pcn.length - 1) === "%") zoomMode = parseInt(zoomMode) / 100;
            if (typeof zoomMode === "number") {
              out("/OpenAction [3 0 R /XYZ null null " + f2(zoomMode) + "]");
            }
        }
        if (!layoutMode) layoutMode = "continuous";
        switch (layoutMode) {
          case "continuous":
            out("/PageLayout /OneColumn");
            break;
          case "single":
            out("/PageLayout /SinglePage");
            break;
          case "two":
          case "twoleft":
            out("/PageLayout /TwoColumnLeft");
            break;
          case "tworight":
            out("/PageLayout /TwoColumnRight");
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
          out("/PageMode /" + pageMode);
        }
        events.publish("putCatalog");
      },
      putTrailer = function() {
        out("/Size " + (objectNumber + 1));
        out("/Root " + objectNumber + " 0 R");
        out("/Info " + (objectNumber - 1) + " 0 R");
        out("/ID [ <" + fileId + "> <" + fileId + "> ]");
      },
      beginPage = function(width, height) {
        outToPages = true;
        pages[++page] = [];
        pagedim[page] = {
          width: Number(width) || pageWidth,
          height: Number(height) || pageHeight
        };
        pagesContext[page] = {};
        _setPage(page);
      },
      _addPage = function(width, height) {
        // Dimensions are stored as user units and converted to points on output
        var orientation = typeof height === "string" && height.toLowerCase();
        if (typeof width === "string") {
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
            case "l":
              if (height > width) orientation = "s";
              break;
            case "p":
              if (width > height) orientation = "s";
              break;
          }
          if (orientation === "s") {
            tmp = width;
            width = height;
            height = tmp;
          }
        }

        beginPage(width, height);

        // Set line width
        out(hpf(lineWidth * k) + " w");
        // Set draw color
        out(drawColor);
        // resurrecting non-default line caps, joins
        if (lineCapID !== 0) {
          out(lineCapID + " J");
        }
        if (lineJoinID !== 0) {
          out(lineJoinID + " j");
        }
        events.publish("addPage", {
          pageNumber: page
        });
      },
      _deletePage = function(n) {
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
      _setPage = function(n) {
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
       * @param {String} fontName can be undefined on "falthy" to indicate "use current"
       * @param {String} fontStyle can be undefined on "falthy" to indicate "use current"
       * @returns {String} Font key.
       */
      getFont = function(fontName, fontStyle, options) {
        var key = undefined,
          originalFontName,
          fontNameLowerCase;
        options = options || {};

        fontName = fontName !== undefined ? fontName : fonts[activeFontKey].fontName;
        fontStyle = fontStyle !== undefined ? fontStyle : fonts[activeFontKey].fontStyle;
        fontNameLowerCase = fontName.toLowerCase();

        if (fontmap[fontNameLowerCase] !== undefined && fontmap[fontNameLowerCase][fontStyle] !== undefined) {
          key = fontmap[fontNameLowerCase][fontStyle];
        } else if (fontmap[fontName] !== undefined && fontmap[fontName][fontStyle] !== undefined) {
          key = fontmap[fontName][fontStyle];
        } else {
          if (options.disableWarning === false) {
            console.warn(
              "Unable to look up font label for font '" +
                fontName +
                "', '" +
                fontStyle +
                "'. Refer to getFontList() for available fonts."
            );
          }
        }

        if (!key && !options.noFallback) {
          key = fontmap["times"][fontStyle];
          if (key == null) {
            key = fontmap["times"]["normal"];
          }
        }
        return key;
      },
      buildDocument = function() {
        outToPages = false; // switches out() to content

        objectNumber = 2;
        content_length = 0;
        content = [];
        offsets = [];
        additionalObjects = [];
        // Added for AcroForm
        events.publish("buildDocument");

        // putHeader()
        out("%PDF-" + pdfVersion);
        out("%\xBA\xDF\xAC\xE0");

        putPages();

        // Must happen after putPages
        // Modifies current object Id
        putAdditionalObjects();

        putResources();

        // Info
        newObject();
        out("<<");
        putInfo();
        out(">>");
        out("endobj");

        // Catalog
        newObject();
        out("<<");
        putCatalog();
        out(">>");
        out("endobj");

        // Cross-ref
        var o = content_length,
          i,
          p = "0000000000";
        out("xref");
        out("0 " + (objectNumber + 1));
        out(p + " 65535 f ");
        for (i = 1; i <= objectNumber; i++) {
          var offset = offsets[i];
          if (typeof offset === "function") {
            out((p + offsets[i]()).slice(-10) + " 00000 n ");
          } else {
            out((p + offsets[i]).slice(-10) + " 00000 n ");
          }
        }
        // Trailer
        out("trailer");
        out("<<");
        putTrailer();
        out(">>");
        out("startxref");
        out("" + o);
        out("%%EOF");

        outToPages = true;

        return content.join("\n");
      },
      getStyle = function(style) {
        // see path-painting operators in PDF spec

        // The default in MrRio's implementation is "S" (stroke), whereas the default in the yWorks implementation
        // was "n" (none). Although this has nothing to do with transforms, we should use the API switch here.
        var op = apiMode === ApiMode.COMPAT ? "S" : "n";

        if (style === "D") {
          op = "S"; // stroke
        } else if (style === "F") {
          op = "f"; // fill
        } else if (style === "FD" || style === "DF") {
          op = "B"; // both
        } else if (style === "f" || style === "f*" || style === "B" || style === "B*") {
          /*
           Allow direct use of these PDF path-painting operators:
           - f    fill using nonzero winding number rule
           - f*    fill using even-odd rule
           - B    fill then stroke with fill using non-zero winding number rule
           - B*    fill then stroke with fill using even-odd rule
           */
          op = style;
        }
        return op;
      },
      // puts the style for the previously drawn path. If a patternKey is provided, the pattern is used to fill
      // the path. Use patternMatrix to transform the pattern to rhe right location.
      putStyle = function(style, patternKey, patternData) {
        if (style === null || (apiMode === ApiMode.ADVANCED && style === undefined)) {
          return;
        }

        style = getStyle(style);

        // stroking / filling / both the path
        if (!patternKey) {
          out(style);
          return;
        }

        if (!patternData) {
          patternData = { matrix: unitMatrix };
        }

        if (patternData instanceof Matrix) {
          patternData = { matrix: patternData };
        }

        patternData.key = patternKey;

        patternData || (patternData = unitMatrix);

        fillWithPattern(patternData, style);
      },
      fillWithPattern = function(patternData, style) {
        var patternId = patternMap[patternData.key];
        var pattern = patterns[patternId];

        if (pattern instanceof API.ShadingPattern) {
          out("q");

          out(clipRuleFromStyle(style));

          if (pattern.gState) {
            API.setGState(pattern.gState);
          }

          out(patternData.matrix.toString() + " cm");
          out("/" + patternId + " sh");
          out("Q");
        } else if (pattern instanceof API.TilingPattern) {
          // pdf draws patterns starting at the bottom left corner and they are not affected by the global transformation,
          // so we must flip them
          var matrix = new Matrix(1, 0, 0, -1, 0, pageHeight);

          if (patternData.matrix) {
            matrix = matrixMult(patternData.matrix || unitMatrix, matrix);

            // we cannot apply a matrix to the pattern on use so we must abuse the pattern matrix and create new instances
            // for each use
            patternId = pattern.createClone(
              patternData.key,
              patternData.boundingBox,
              patternData.xStep,
              patternData.yStep,
              matrix
            ).id;
          }

          out("q");
          out("/Pattern cs");
          out("/" + patternId + " scn");

          if (pattern.gState) {
            API.setGState(pattern.gState);
          }

          out(style);
          out("Q");
        }
      },
      clipRuleFromStyle = function(style) {
        switch (style) {
          case "f":
          case "F":
            return "W n";
          case "f*":
            return "W* n";
          case "B":
            return "W S";
          case "B*":
            return "W* S";

          // these two are for compatibility reasons (in the past, calling any primitive method with a shading pattern
          // and "n"/"S" as style would still fill/fill and stroke the path)
          case "S":
            return "W S";
          case "n":
            return "W n";
        }
      },
      getArrayBuffer = function() {
        var data = buildDocument(),
          len = data.length,
          ab = new ArrayBuffer(len),
          u8 = new Uint8Array(ab);

        while (len--) u8[len] = data.charCodeAt(len);
        return ab;
      },
      getBlob = function() {
        return new Blob([getArrayBuffer()], {
          type: "application/pdf"
        });
      },
      output = SAFE(function(type, options) {
        if (typeof options === "string") {
          options = {
            filename: options
          };
        } else {
          options = options || {};
          options.filename = options.filename || 'generated.pdf';
        }
        var datauri =
          ("" + type).substr(0, 6) === "dataur"
            ? "data:application/pdf;filename=" + options.filename + ";base64," + btoa(buildDocument())
            : 0;

        switch (type) {
          case undefined:
            return buildDocument();
          case "save":
            if (typeof navigator === "object" && navigator.getUserMedia) {
              if (global.URL === undefined || global.URL.createObjectURL === undefined) {
                return API.output("dataurlnewwindow");
              }
            }
            saveAs(getBlob(), options);
            if (typeof saveAs.unload === "function") {
              if (global.setTimeout) {
                setTimeout(saveAs.unload, 911);
              }
            }
            break;
          case "arraybuffer":
            return getArrayBuffer();
          case "blob":
            return getBlob();
          case "bloburi":
          case "bloburl":
            // User is responsible of calling revokeObjectURL
            return (global.URL && global.URL.createObjectURL(getBlob())) || void 0;
          case "datauristring":
          case "dataurlstring":
            return datauri;
          case "dataurlnewwindow":
            var htmlForNewWindow =
              "<html>" +
              "<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style>" +
              "<body>" +
              '<iframe src="' +
              this.output("datauristring") +
              '"></iframe>' +
              "</body></html>";
            var nW = global.open();
            if (nW !== null) {
              nW.document.write(htmlForNewWindow);
            }
            if (nW || typeof safari === "undefined") return nW;
          /* pass through */
          case "datauri":
          case "dataurl":
            return (global.document.location.href = datauri);
          default:
            throw new Error('Output type "' + type + '" is not supported.');
        }
        // @TODO: Add different output options
      }),
      /**
       * Used to see if a supplied hotfix was requested when the pdf instance was created.
       * @param {string} hotfixName - The name of the hotfix to check.
       * @returns {boolean}
       */
      hasHotfix = function(hotfixName) {
        return Array.isArray(hotfixes) === true && hotfixes.indexOf(hotfixName) > -1;
      };

    switch (unit) {
      case "pt":
        k = 1;
        break;
      case "mm":
        k = 72 / 25.4000508;
        break;
      case "cm":
        k = 72 / 2.54000508;
        break;
      case "in":
        k = 72;
        break;
      case "px":
        if (hasHotfix("px_scaling") == true) {
          k = 72 / 96;
        } else {
          k = 96 / 72;
        }
        break;
      case "pc":
        k = 12;
        break;
      case "em":
        k = 12;
        break;
      case "ex":
        k = 6;
        break;
      default:
        throw "Invalid unit: " + unit;
    }

    setCreationDate();
    setFileId();

    //---------------------------------------
    // Public API

    /**
     * Object exposing internal API to plugins
     * @public
     * @ignore
     */
    API.internal = {
      pdfEscape: pdfEscape,
      getStyle: getStyle,
      /**
       * Returns {FontObject} describing a particular font.
       * @public
       * @function
       * @param {String} fontName (Optional) Font's family name
       * @param {String} fontStyle (Optional) Font's style variation name (Example:"Italic")
       * @returns {FontObject}
       */
      getFont: function() {
        return fonts[getFont.apply(API, arguments)];
      },
      getFontSize: function() {
        return activeFontSize;
      },
      getCharSpace: function() {
        return activeCharSpace;
      },
      getTextColor: function getTextColor() {
        var colorEncoded = textColor.split(" ");
        if (colorEncoded.length === 2 && colorEncoded[1] === "g") {
          // convert grayscale value to rgb so that it can be converted to hex for consistency
          var floatVal = parseFloat(colorEncoded[0]);
          colorEncoded = [floatVal, floatVal, floatVal, "r"];
        }
        var colorAsHex = "#";
        for (var i = 0; i < 3; i++) {
          colorAsHex += ("0" + Math.floor(parseFloat(colorEncoded[i]) * 255).toString(16)).slice(-2);
        }
        return colorAsHex;
      },
      getLineHeight: function() {
        return activeFontSize * lineHeightProportion;
      },
      write: function(string1 /*, string2, string3, etc */) {
        out(arguments.length === 1 ? string1 : Array.prototype.join.call(arguments, " "));
      },
      getCoordinateString: function(value) {
        return hpf(scaleByK(value));
      },
      getVerticalCoordinateString: function(value) {
        return hpf(transformScaleY(value));
      },
      collections: {},
      newObject: newObject,
      newAdditionalObject: newAdditionalObject,
      newObjectDeferred: newObjectDeferred,
      newObjectDeferredBegin: newObjectDeferredBegin,
      putStream: putStream,
      events: events,
      // ratio that you use in multiplication of a given "size" number to arrive to 'point'
      // units of measurement.
      // scaleFactor is set at initialization of the document and calculated against the stated
      // default measurement units for the document.
      // If default is "mm", k is the number that will turn number in 'mm' into 'points' number.
      // through multiplication.
      scaleFactor: k,
      pageSize: {
        getWidth: function() {
          return pageWidth;
        },
        getHeight: function() {
          return pageHeight;
        }
      },
      output: function(type, options) {
        return output(type, options);
      },
      getNumberOfPages: function() {
        return pages.length - 1;
      },
      pages: pages,
      out: out,
      f2: f2,
      getPageInfo: function(pageNumberOneBased) {
        var objId = (pageNumberOneBased - 1) * 2 + 3;
        return {
          objId: objId,
          pageNumber: pageNumberOneBased,
          pageContext: pagesContext[pageNumberOneBased]
        };
      },
      getCurrentPageInfo: function() {
        var objId = (currentPage - 1) * 2 + 3;
        return {
          objId: objId,
          pageNumber: currentPage,
          pageContext: pagesContext[currentPage]
        };
      },
      getPDFVersion: function() {
        return pdfVersion;
      },
      hasHotfix: hasHotfix //Expose the hasHotfix check so plugins can also check them.
    };

    function advancedAPI() {
      // prepend global change of basis matrix
      // (Now, instead of converting every coordinate to the pdf coordinate system, we apply a matrix
      // that does this job for us (however, texts, images and similar objects must be drawn bottom up))
      this.saveGraphicsState();
      out(new Matrix(k, 0, 0, -k, 0, pageHeight * k).toString() + " cm");
      this.setFontSize(this.getFontSize() / k);
      apiMode = ApiMode.ADVANCED;
    }

    function compatAPI() {
      this.restoreGraphicsState();
      apiMode = ApiMode.COMPAT;
    }

    /**
     * @callback ApiSwitchBody
     * @param {jsPDF} pdf
     */

    /**
     * For compatibility reasons jsPDF offers two API modes which differ in the way they convert between the the usual
     * screen coordinates and the PDF coordinate system.
     *   - "compat": Offers full compatibility across all plugins but does not allow arbitrary transforms
     *   - "advanced": Allows arbitrary transforms and more advanced features like pattern fills. Some plugins might
     *     not support this mode, though.
     * Initial mode is "compat".
     *
     * You can either provide a callback to the body argument, which means that jsPDF will automatically switch back to
     * the original API mode afterwards; or you can omit the callback and switch back manually using {@link compatAPI}.
     *
     * Note, that the calls to {@link saveGraphicsState} and {@link restoreGraphicsState} need to be balanced within the
     * callback or between calls of this method and its counterpart {@link compatAPI}. Calls to {@link beginFormObject}
     * or {@link beginTilingPattern} need to be closed by their counterparts before switching back to "compat" API mode.
     *
     * @param {ApiSwitchBody=} body When provided, this callback will be called after the API mode has been switched.
     * The API mode will be switched back automatically afterwards.
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name advancedAPI
     */
    API.advancedAPI = function(body) {
      var doSwitch = apiMode === ApiMode.COMPAT;

      if (doSwitch) {
        advancedAPI.call(this);
      }

      if (typeof body !== "function") {
        return this;
      }

      body(this);

      if (doSwitch) {
        compatAPI.call(this);
      }

      return this;
    };

    /**
     * Switches to "compat" API mode. See {@link advancedAPI} for more details.
     *
     * @param {ApiSwitchBody=} body When provided, this callback will be called after the API mode has been switched.
     * The API mode will be switched back automatically afterwards.
     * @return {jsPDF}
     * @methodOf jsPDF#
     * @name compatApi
     */
    API.compatAPI = function(body) {
      var doSwitch = apiMode === ApiMode.ADVANCED;

      if (doSwitch) {
        compatAPI.call(this);
      }

      if (typeof body !== "function") {
        return this;
      }

      body(this);

      if (doSwitch) {
        advancedAPI.call(this);
      }

      return this;
    };

    /**
     * @return {boolean} True iff the current API mode is "advanced". See {@link advancedAPI}.
     * @methodOf jsPDF#
     * @name isAdvancedAPI
     */
    API.isAdvancedAPI = function() {
      return apiMode === ApiMode.ADVANCED;
    };

    /**
     * Inserts a debug comment into the pdf.
     * @param {String} text
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name comment
     */
    API.comment = function(text) {
      out("#" + text);
      return this;
    };

    /**
     * An object representing a pdf graphics state.
     * @param parameters A parameter object that contains all properties this graphics state wants to set.
     * Supported are: opacity, stroke-opacity
     * @constructor
     */
    API.GState = function(parameters) {
      var supported = "opacity,stroke-opacity".split(",");
      for (var p in parameters) {
        if (parameters.hasOwnProperty(p) && supported.indexOf(p) >= 0) {
          this[p] = parameters[p];
        }
      }
      this.id = ""; // set by addGState()
      this.objectNumber = -1; // will be set by putGState()
    };
    API.GState.prototype.equals = function equals(other) {
      var ignore = "id,objectNumber,equals";
      if (!other || typeof other !== typeof this) return false;
      var count = 0;
      for (var p in this) {
        if (ignore.indexOf(p) >= 0) continue;
        if (this.hasOwnProperty(p) && !other.hasOwnProperty(p)) return false;
        if (this[p] !== other[p]) return false;
        count++;
      }
      for (var p in other) {
        if (other.hasOwnProperty(p) && ignore.indexOf(p) < 0) count--;
      }
      return count === 0;
    };

    /**
     * Adds a new {@link GState} for later use. See {@link setGState}.
     * @param {String} key
     * @param {GState} gState
     * @function
     * @instance
     * @returns {jsPDF}
     *
     * @methodOf jsPDF#
     * @name addPage
     */
    API.addGState = function(key, gState) {
      addGState(key, gState);
      return this;
    };

    /**
     * Adds (and transfers the focus to) new page to the PDF document.
     * @param {String/Array} format The format of the new page. Can be <ul><li>a0 - a10</li><li>b0 - b10</li><li>c0 - c10</li><li>c0 - c10</li><li>dl</li><li>letter</li><li>government-letter</li><li>legal</li><li>junior-legal</li><li>ledger</li><li>tabloid</li><li>credit-card</li></ul><br />
     * Default is "a4". If you want to use your own format just pass instead of one of the above predefined formats the size as an number-array , e.g. [595.28, 841.89]
     * @param {string} orientation Orientation of the new page. Possible values are "portrait" or "landscape" (or shortcuts "p" (Default), "l")
     * @function
     * @instance
     * @returns {jsPDF}
     *
     * @memberOf jsPDF
     * @name addPage
     */
    API.addPage = function(format, orientation) {
      _addPage.apply(this, arguments);
      return this;
    };

    /**
     * Adds (and transfers the focus to) new page to the PDF document.
     * @function
     * @instance
     * @returns {jsPDF}
     *
     * @memberOf jsPDF
     * @name setPage
     * @param {number} page Switch the active page to the page number specified
     * @example
     * doc = jsPDF()
     * doc.addPage()
     * doc.addPage()
     * doc.text('I am on page 3', 10, 10)
     * doc.setPage(1)
     * doc.text('I am on page 1', 10, 10)
     */
    API.setPage = function(page) {
      _setPage.apply(this, arguments);
      return this;
    };

    /**
     * @name insertPage
     * @memberOf jsPDF
     *
     * @function
     * @instance
     * @param {Object} beforePage
     * @returns {jsPDF}
     */
    API.insertPage = function(beforePage) {
      this.addPage();
      this.movePage(currentPage, beforePage);
      return this;
    };

    /**
     * @name movePage
     * @memberOf jsPDF
     * @function
     * @instance
     * @param {Object} targetPage
     * @param {Object} beforePage
     * @returns {jsPDF}
     */
    API.movePage = function(targetPage, beforePage) {
      var tmpPagesContext, tmpPagedim, tmpPages, i;
      if (targetPage > beforePage) {
        tmpPages = pages[targetPage];
        tmpPagedim = pagedim[targetPage];
        tmpPagesContext = pagesContext[targetPage];
        for (i = targetPage; i > beforePage; i--) {
          pages[i] = pages[i - 1];
          pagedim[i] = pagedim[i - 1];
          pagesContext[i] = pagesContext[i - 1];
        }
        pages[beforePage] = tmpPages;
        pagedim[beforePage] = tmpPagedim;
        pagesContext[beforePage] = tmpPagesContext;
        this.setPage(beforePage);
      } else if (targetPage < beforePage) {
        tmpPages = pages[targetPage];
        tmpPagedim = pagedim[targetPage];
        tmpPagesContext = pagesContext[targetPage];
        for (i = targetPage; i < beforePage; i++) {
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

    /**
     * @name deletePage
     * @memberOf jsPDF
     * @function
     * @instance
     * @returns {jsPDF}
     */
    API.deletePage = function() {
      _deletePage.apply(this, arguments);
      return this;
    };

    /**
     * @name setCreationDate
     * @memberOf jsPDF
     * @function
     * @instance
     * @param {Object} date
     * @returns {jsPDF}
     */
    API.setCreationDate = function(date) {
      setCreationDate(date);
      return this;
    };

    /**
     * @name getCreationDate
     * @memberOf jsPDF
     * @function
     * @instance
     * @param {Object} type
     * @returns {Object}
     */
    API.getCreationDate = function(type) {
      return getCreationDate(type);
    };

    /**
     * @name setFileId
     * @memberOf jsPDF
     * @function
     * @instance
     * @param {string} value GUID
     * @returns {jsPDF}
     */
    API.setFileId = function(value) {
      setFileId(value);
      return this;
    };

    /**
     * @name getFileId
     * @memberOf jsPDF
     * @function
     * @instance
     *
     * @returns {string} GUID
     */
    API.getFileId = function() {
      return getFileId();
    };

    /**
     * Set the display mode options of the page like zoom and layout.
     *
     * @param {integer|String} zoom   You can pass an integer or percentage as
     * a string. 2 will scale the document up 2x, '200%' will scale up by the
     * same amount. You can also set it to 'fullwidth', 'fullheight',
     * 'fullpage', or 'original'.
     *
     * Only certain PDF readers support this, such as Adobe Acrobat
     *
     * @param {string} layout Layout mode can be: 'continuous' - this is the
     * default continuous scroll. 'single' - the single page mode only shows one
     * page at a time. 'twoleft' - two column left mode, first page starts on
     * the left, and 'tworight' - pages are laid out in two columns, with the
     * first page on the right. This would be used for books.
     * @param {string} pmode 'UseOutlines' - it shows the
     * outline of the document on the left. 'UseThumbs' - shows thumbnails along
     * the left. 'FullScreen' - prompts the user to enter fullscreen mode.
     *
     * @returns {jsPDF}
     * @function
     * @instance
     * @name setDisplayMode
     * @methodOf jsPDF#
     */
    API.setDisplayMode = function(zoom, layout, pmode) {
      zoomMode = zoom;
      layoutMode = layout;
      pageMode = pmode;

      var validPageModes = [undefined, null, "UseNone", "UseOutlines", "UseThumbs", "FullScreen"];
      if (validPageModes.indexOf(pmode) == -1) {
        throw new Error(
          'Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "' + pmode + '" is not recognized.'
        );
      }
      return this;
    };

    /**
     * Saves the current graphics state ("pushes it on the stack"). It can be restored by {@link restoreGraphicsState}
     * later. Here, the general pdf graphics state is meant, also including the current transformation matrix,
     * fill and stroke colors etc.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name saveGraphicsState
     */
    API.saveGraphicsState = function() {
      out("q");
      // as we cannot set font key and size independently we must keep track of both
      fontStateStack.push({
        key: activeFontKey,
        size: activeFontSize,
        color: textColor
      });
      return this;
    };

    /**
     * Restores a previously saved graphics state saved by {@link saveGraphicsState} ("pops the stack").
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name restoreGraphicsState
     */
    API.restoreGraphicsState = function() {
      out("Q");

      // restore previous font state
      var fontState = fontStateStack.pop();
      activeFontKey = fontState.key;
      activeFontSize = fontState.size;
      textColor = fontState.color;

      activeGState = null;

      return this;
    };

    /**
     * Appends this matrix to the left of all previously applied matrices.
     *
     * Only available in "advanced" API mode.
     *
     * @param {Matrix} matrix
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setCurrentTransformationMatrix
     */
    API.setCurrentTransformationMatrix = function(matrix) {
      advancedApiModeTrap("setCurrentTransformationMatrix()");

      out(matrix.toString() + " cm");
      return this;
    };

    /**
     * Starts a new pdf form object, which means that all conseequent draw calls target a new independent object
     * until {@link endFormObject} is called. The created object can be referenced and drawn later using
     * {@link doFormObject}. Nested form objects are possible.
     * x, y, width, height set the bounding box that is used to clip the content.
     *
     * Only available in "advanced" API mode.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Matrix} matrix The matrix that will be applied to convert the form objects coordinate system to
     * the parent's.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name beginFormObject
     */
    API.beginFormObject = function(x, y, width, height, matrix) {
      advancedApiModeTrap("beginFormObject()");

      // The user can set the output target to a new form object. Nested form objects are possible.
      // Currently, they use the resource dictionary of the surrounding stream. This should be changed, as
      // the PDF-Spec states:
      // "In PDF 1.2 and later versions, form XObjects may be independent of the content streams in which
      // they appear, and this is strongly recommended although not requiredIn PDF 1.2 and later versions,
      // form XObjects may be independent of the content streams in which they appear, and this is strongly
      // recommended although not required"
      beginNewRenderTarget(x, y, width, height, matrix);
      return this;
    };

    /**
     * Completes and saves the form object. Only available in "advanced" API mode.
     * @param {String} key The key by which this form object can be referenced.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name endFormObject
     */
    API.endFormObject = function(key) {
      advancedApiModeTrap("endFormObject()");

      endFormObject(key);
      return this;
    };

    /**
     * Draws the specified form object by referencing to the respective pdf XObject created with
     * {@link API.beginFormObject} and {@link endFormObject}.
     * The location is determined by matrix.
     *
     * Only available in "advanced" API mode.
     *
     * @param {String} key The key to the form object.
     * @param {Matrix} matrix The matrix applied before drawing the form object.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name doFormObject
     */
    API.doFormObject = function(key, matrix) {
      advancedApiModeTrap("doFormObject()");

      var xObject = renderTargets[renderTargetMap[key]];
      out("q");
      out(matrix.toString() + " cm");
      out("/" + xObject.id + " Do");
      out("Q");
      return this;
    };

    /**
     * Returns the form object specified by key.
     * @param key {String}
     * @returns {{x: number, y: number, width: number, height: number, matrix: Matrix}}
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name getFormObject
     */
    API.getFormObject = function(key) {
      var xObject = renderTargets[renderTargetMap[key]];
      return {
        x: xObject.x,
        y: xObject.y,
        width: xObject.width,
        height: xObject.height,
        matrix: xObject.matrix
      };
    };

    /**
     * A matrix object for 2D homogenous transformations:
     * | a b 0 |
     * | c d 0 |
     * | e f 1 |
     * pdf multiplies matrices righthand: v' = v x m1 x m2 x ...
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @param {number} e
     * @param {number} f
     * @constructor
     */
    API.Matrix = Matrix;

    /**
     * Multiplies two matrices. (see {@link Matrix})
     * @param {Matrix} m1
     * @param {Matrix} m2
     * @methodOf jsPDF#
     * @name matrixMult
     */
    API.matrixMult = matrixMult;

    /**
     * The unit matrix (equivalent to new Matrix(1, 0, 0, 1, 0, 0)).
     * @type {Matrix}
     * @fieldOf jsPDF#
     * @name unitMatrix
     */
    API.unitMatrix = unitMatrix;

    var Pattern = function(gState, matrix) {
      this.gState = gState;
      this.matrix = matrix;

      this.id = ""; // set by addPattern()
      this.objectNumber = -1; // will be set by putPattern()
    };

    /**
     * A pattern describing a shading pattern.
     *
     * Only available in "advanced" API mode.
     *
     * @param {String} type One of "axial" or "radial"
     * @param {Array<Number>} coords Either [x1, y1, x2, y2] for "axial" type describing the two interpolation points
     * or [x1, y1, r, x2, y2, r2] for "radial" describing inner and the outer circle.
     * @param {Array<Object>} colors An array of objects with the fields "offset" and "color". "offset" describes
     * the offset in parameter space [0, 1]. "color" is an array of length 3 describing RGB values in [0, 255].
     * @param {GState=} gState An additional graphics state that gets applied to the pattern (optional).
     * @param {Matrix=} matrix A matrix that describes the transformation between the pattern coordinate system
     * and the use coordinate system (optional).
     * @constructor
     * @extends API.Pattern
     */
    API.ShadingPattern = function(type, coords, colors, gState, matrix) {
      advancedApiModeTrap("ShadingPattern");

      // see putPattern() for information how they are realized
      this.type = type === "axial" ? 2 : 3;
      this.coords = coords;
      this.colors = colors;

      Pattern.call(this, gState, matrix);
    };

    /**
     * A PDF Tiling pattern.
     *
     * Only available in "advanced" API mode.
     *
     * @param {Array.<Number>} boundingBox The bounding box at which one pattern cell gets clipped.
     * @param {Number} xStep Horizontal spacing between pattern cells.
     * @param {Number} yStep Vertical spacing between pattern cells.
     * @param {API.GState=} gState An additional graphics state that gets applied to the pattern (optional).
     * @param {Matrix=} matrix A matrix that describes the transformation between the pattern coordinate system
     * and the use coordinate system (optional).
     * @constructor
     * @extends API.Pattern
     */
    API.TilingPattern = function(boundingBox, xStep, yStep, gState, matrix) {
      advancedApiModeTrap("TilingPattern");

      this.boundingBox = boundingBox;
      this.xStep = xStep;
      this.yStep = yStep;

      this.stream = ""; // set by endTilingPattern();

      this.cloneIndex = 0;

      Pattern.call(this, gState, matrix);
    };

    API.TilingPattern.prototype = {
      createClone: function(patternKey, boundingBox, xStep, yStep, matrix) {
        var clone = new API.TilingPattern(
          boundingBox || this.boundingBox,
          xStep || this.xStep,
          yStep || this.yStep,
          this.gState,
          matrix || this.matrix
        );
        clone.stream = this.stream;
        var key = patternKey + "$$" + this.cloneIndex++ + "$$";
        addPattern(key, clone);
        return clone;
      }
    };

    /**
     * Adds a new {@link API.ShadingPattern} for later use. Only available in "advanced" API mode.
     * @param {String} key
     * @param {Pattern} pattern
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name addPattern
     */
    API.addShadingPattern = function(key, pattern) {
      advancedApiModeTrap("addShadingPattern()");

      addPattern(key, pattern);
      return this;
    };

    /**
     * Begins a new tiling pattern. All subsequent render calls are drawn to this pattern until {@link API.endTilingPattern}
     * gets called. Only available in "advanced" API mode.
     * @param {API.Pattern} pattern
     * @methodOf jsPDF#
     * @name beginTilingPattern
     */
    API.beginTilingPattern = function(pattern) {
      advancedApiModeTrap("beginTilingPattern()");

      beginNewRenderTarget(
        pattern.boundingBox[0],
        pattern.boundingBox[1],
        pattern.boundingBox[2] - pattern.boundingBox[0],
        pattern.boundingBox[3] - pattern.boundingBox[1],
        pattern.matrix
      );
    };

    /**
     * Ends a tiling pattern and sets the render target to the one active before {@link API.beginTilingPattern} has been called.
     *
     * Only available in "advanced" API mode.
     *
     * @param {string} key A unique key that is used to reference this pattern at later use.
     * @param {API.Pattern} pattern The pattern to end.
     * @methodOf jsPDF#
     * @name endTilingPattern
     */
    API.endTilingPattern = function(key, pattern) {
      advancedApiModeTrap("endTilingPattern()");

      // retrieve the stream
      pattern.stream = pages[currentPage].join("\n");

      addPattern(key, pattern);

      events.publish("endTilingPattern", pattern);

      // restore state from stack
      renderTargetStack.pop().restore();
    };

    /**
     * Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
     *
     * @function
     * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down
     * per font, spacing settings declared before this call.
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Object} options Collection of settings signalling how the text must be encoded. Defaults are sane. If you
     * think you want to pass some flags, you likely can read the source.
     * @param {number|Matrix} transform If transform is a number the text will be rotated by this value around the
     * anchor set by x and y.
     *
     * If it is a Matrix, this matrix gets directly applied to the text, which allows shearing
     * effects etc.; the x and y offsets are then applied AFTER the coordinate system has been established by this
     * matrix. This means passing a rotation matrix that is equivalent to some rotation angle will in general yield a
     * DIFFERENT result. A matrix is only allowed in "advanced" API mode.
     *
     * @param align {string}
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name text
     */
    API.text = function(text, x, y, options, transform) {
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

      if (transform !== undefined && transform instanceof Matrix) {
        advancedApiModeTrap("The transform parameter of text() with a Matrix value");
      }

      var xtra = "";
      var isHex = false;
      var lineHeight = lineHeightProportion;

      var scope = this;

      function ESC(s) {
        s = s.split("\t").join(Array(options.TabLen || 9).join(" "));
        return pdfEscape(s, flags);
      }

      function transformTextToSpecialArray(text) {
        //we don't want to destroy original text array, so cloning it
        var sa = text.concat();
        var da = [];
        var len = sa.length;
        var curDa;
        //we do array.join('text that must not be PDFescaped")
        //thus, pdfEscape each component separately
        while (len--) {
          curDa = sa.shift();
          if (typeof curDa === "string") {
            da.push(curDa);
          } else {
            if (Object.prototype.toString.call(text) === "[object Array]" && curDa.length === 1) {
              da.push(curDa[0]);
            } else {
              da.push([curDa[0], curDa[1], curDa[2]]);
            }
          }
        }
        return da;
      }

      function processTextByFunction(text, processingFunction) {
        var result;
        if (typeof text === "string") {
          result = processingFunction(text)[0];
        } else if (Object.prototype.toString.call(text) === "[object Array]") {
          //we don't want to destroy original text array, so cloning it
          var sa = text.concat();
          var da = [];
          var len = sa.length;
          var curDa;
          var tmpResult;
          //we do array.join('text that must not be PDFescaped")
          //thus, pdfEscape each component separately
          while (len--) {
            curDa = sa.shift();
            if (typeof curDa === "string") {
              da.push(processingFunction(curDa)[0]);
            } else if (Object.prototype.toString.call(curDa) === "[object Array]" && curDa[0] === "string") {
              tmpResult = processingFunction(curDa[0], curDa[1], curDa[2]);
              da.push([tmpResult[0], tmpResult[1], tmpResult[2]]);
            }
          }
          result = da;
        }
        return result;
      }

      //backwardsCompatibility
      var tmp;

      // Pre-August-2012 the order of arguments was function(x, y, text, flags)
      // in effort to make all calls have similar signature like
      //   function(data, coordinates... , miscellaneous)
      // this method had its args flipped.
      // code below allows backward compatibility with old arg order.
      if (typeof text === "number") {
        tmp = y;
        y = x;
        x = text;
        text = tmp;
      }

      var flags = arguments[3];
      var angle = arguments[4];
      var align = arguments[5];

      if (typeof flags !== "object" || flags === null) {
        if (typeof angle === "string") {
          align = angle;
          angle = null;
        }
        if (typeof flags === "string") {
          align = flags;
          flags = null;
        }
        if (typeof flags === "number") {
          angle = flags;
          flags = null;
        }
        options = { flags: flags, angle: angle, align: align };
      }

      //Check if text is of type String
      var textIsOfTypeString = false;
      var tmpTextIsOfTypeString = true;

      if (typeof text === "string") {
        textIsOfTypeString = true;
      } else if (Object.prototype.toString.call(text) === "[object Array]") {
        //we don't want to destroy original text array, so cloning it
        var sa = text.concat();
        var da = [];
        var len = sa.length;
        var curDa;
        //we do array.join('text that must not be PDFescaped")
        //thus, pdfEscape each component separately
        while (len--) {
          curDa = sa.shift();
          if (
            typeof curDa !== "string" ||
            (Object.prototype.toString.call(curDa) === "[object Array]" && typeof curDa[0] !== "string")
          ) {
            tmpTextIsOfTypeString = false;
          }
        }
        textIsOfTypeString = tmpTextIsOfTypeString;
      }
      if (textIsOfTypeString === false) {
        throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
      }

      //Escaping
      var activeFontEncoding = fonts[activeFontKey].encoding;

      if (activeFontEncoding === "WinAnsiEncoding" || activeFontEncoding === "StandardEncoding") {
        text = processTextByFunction(text, function(text, posX, posY) {
          return [ESC(text), posX, posY];
        });
      }
      //If there are any newlines in text, we assume
      //the user wanted to print multiple lines, so break the
      //text up into an array. If the text is already an array,
      //we assume the user knows what they are doing.
      //Convert text into an array anyway to simplify
      //later code.

      if (typeof text === "string") {
        if (text.match(/[\r?\n]/)) {
          text = text.split(/\r\n|\r|\n/g);
        } else {
          text = [text];
        }
      }

      //multiline
      var maxWidth = options.maxWidth || 0;

      if (maxWidth > 0) {
        if (typeof text === "string") {
          text = scope.splitTextToSize(text, maxWidth);
        } else if (Object.prototype.toString.call(text) === "[object Array]") {
          text = scope.splitTextToSize(text.join(" "), maxWidth);
        }
      }

      //creating Payload-Object to make text byRef
      var payload = {
        text: text,
        x: x,
        y: y,
        options: options,
        mutex: {
          pdfEscape: pdfEscape,
          activeFontKey: activeFontKey,
          fonts: fonts,
          activeFontSize: activeFontSize
        }
      };
      events.publish("preProcessText", payload);

      text = payload.text;
      options = payload.options;
      //angle

      var angle = options.angle;
      var curY = transformScaleY(y);
      var transformationMatrix = null;

      if (angle && typeof angle === "number") {
        angle *= Math.PI / 180;

        if (apiMode === ApiMode.ADVANCED) {
          angle = -angle;
        }

        var c = Math.cos(angle),
          s = Math.sin(angle);
        transformationMatrix = new Matrix(c, s, -s, c, 0, 0);
      } else if (angle && angle instanceof Matrix) {
        transformationMatrix = angle;
      }

      //charSpace

      var charSpace = options.charSpace;

      if (charSpace !== undefined) {
        xtra += charSpace + " Tc\n";
      }

      //lang

      var lang = options.lang;

      if (lang) {
        //    xtra += "/Lang (" + lang +")\n";
      }

      //renderingMode

      var renderingMode = -1;
      var tmpRenderingMode = -1;
      var parmRenderingMode = options.renderingMode || options.stroke;
      var pageContext = scope.internal.getCurrentPageInfo().pageContext;

      switch (parmRenderingMode) {
        case 0:
        case false:
        case "fill":
          tmpRenderingMode = 0;
          break;
        case 1:
        case true:
        case "stroke":
          tmpRenderingMode = 1;
          break;
        case 2:
        case "fillThenStroke":
          tmpRenderingMode = 2;
          break;
        case 3:
        case "invisible":
          tmpRenderingMode = 3;
          break;
        case 4:
        case "fillAndAddForClipping":
          tmpRenderingMode = 4;
          break;
        case 5:
        case "strokeAndAddPathForClipping":
          tmpRenderingMode = 5;
          break;
        case 6:
        case "fillThenStrokeAndAddToPathForClipping":
          tmpRenderingMode = 6;
          break;
        case 7:
        case "addToPathForClipping":
          tmpRenderingMode = 7;
          break;
      }

      var usedRenderingMode = pageContext.usedRenderingMode || -1;

      //if the coder wrote it explicitly to use a specific
      //renderingMode, then use it
      if (tmpRenderingMode !== -1) {
        xtra += tmpRenderingMode + " Tr\n";
        //otherwise check if we used the rendering Mode already
        //if so then set the rendering Mode...
      } else if (usedRenderingMode !== -1) {
        xtra += "0 Tr\n";
      }

      if (tmpRenderingMode !== -1) {
        pageContext.usedRenderingMode = tmpRenderingMode;
      }

      //align

      var align = options.align || "left";
      var leading = activeFontSize * lineHeight;
      var pageWidth = scope.internal.pageSize.getWidth();
      var k = scope.internal.scaleFactor;
      var lineWidth = lineWidth;
      var activeFont = fonts[activeFontKey];
      var charSpace = options.charSpace || activeCharSpace;
      var widths;
      var maxWidth = options.maxWidth || 0;

      var lineWidths;
      var flags = {};
      var wordSpacingPerLine = [];

      if (Object.prototype.toString.call(text) === "[object Array]") {
        var da = transformTextToSpecialArray(text);
        var left = 0;
        var newY;
        var maxLineLength;
        var lineWidths;
        if (align !== "left") {
          lineWidths = da.map(function(v) {
            return (
              (scope.getStringUnitWidth(v, { font: activeFont, charSpace: charSpace, fontSize: activeFontSize }) *
                activeFontSize) /
              k
            );
          });
        }
        var maxLineLength = Math.max.apply(Math, lineWidths);
        //The first line uses the "main" Td setting,
        //and the subsequent lines are offset by the
        //previous line's x coordinate.
        var prevWidth = 0;
        var delta;
        var newX;
        var xOffset = 0;
        if (align === "right") {
          //The passed in x coordinate defines the
          //rightmost point of the text.
          left = x - maxLineLength;
          xOffset = -lineWidths[0];
          text = [];
          for (var i = 0, len = da.length; i < len; i++) {
            delta = maxLineLength - lineWidths[i];
            if (i === 0) {
              newX = 0;
              newY = 0;
            } else {
              newX = prevWidth - lineWidths[i];
              newY = leading;
            }
            text.push([da[i], newX, newY]);
            prevWidth = lineWidths[i];
          }
        } else if (align === "center") {
          //The passed in x coordinate defines
          //the center point.
          left = x - maxLineLength / 2;
          xOffset = -lineWidths[0] / 2;
          text = [];
          for (var i = 0, len = da.length; i < len; i++) {
            delta = (maxLineLength - lineWidths[i]) / 2;
            if (i === 0) {
              newX = 0;
              newY = 0;
            } else {
              newX = (prevWidth - lineWidths[i]) / 2;
              newY = leading;
            }
            text.push([da[i], newX, newY]);
            prevWidth = lineWidths[i];
          }
        } else if (align === "left") {
          text = [];
          for (var i = 0, len = da.length; i < len; i++) {
            text.push(da[i]);
          }
        } else if (align === "justify") {
          text = [];
          var maxWidth = maxWidth !== 0 ? maxWidth : pageWidth;

          for (var i = 0, len = da.length; i < len; i++) {
            newX = 0;
            newY = i === 0 ? 0 : leading;
            if (i < len - 1) {
              wordSpacingPerLine.push((maxWidth - lineWidths[i]) / (da[i].split(" ").length - 1));
            }
            text.push([da[i], newX, newY]);
          }
        } else {
          throw new Error('Unrecognized alignment option, use "left", "center", "right" or "justify".');
        }
      }

      //R2L
      var doReversing = typeof options.R2L === "boolean" ? options.R2L : R2L;
      if (doReversing === true) {
        text = processTextByFunction(text, function(text, posX, posY) {
          return [
            text
              .split("")
              .reverse()
              .join(""),
            posX,
            posY
          ];
        });
      }

      //creating Payload-Object to make text byRef
      var payload = {
        text: text,
        x: x,
        y: y,
        options: options,
        mutex: {
          pdfEscape: pdfEscape,
          activeFontKey: activeFontKey,
          fonts: fonts,
          activeFontSize: activeFontSize
        }
      };
      events.publish("postProcessText", payload);

      text = payload.text;
      isHex = payload.mutex.isHex;

      var da = transformTextToSpecialArray(text);

      text = [];
      var variant = 0;
      var len = da.length;
      var posX;
      var posY;
      var content;
      var wordSpacing = "";

      for (var i = 0; i < len; i++) {
        wordSpacing = "";

        if (Object.prototype.toString.call(da[i]) !== "[object Array]") {
          content = (isHex ? "<" : "(") + da[i] + (isHex ? ">" : ")");
          variant = 0;
        } else if (Object.prototype.toString.call(da[i]) === "[object Array]") {
          posX = da[i][1] * k; // x offset must always be scaled!
          // y offset/leading must NOT be scaled by k as it is dependent of the font size, which is always given
          // in plain pt
          posY = -da[i][2];
          content = (isHex ? "<" : "(") + da[i][0] + (isHex ? ">" : ")");
          variant = 1;
        }

        if (wordSpacingPerLine !== undefined && wordSpacingPerLine[i] !== undefined) {
          wordSpacing = wordSpacingPerLine[i] + " Tw\n";
        }

        if (variant === 1 && i > 0) {
          text.push(wordSpacing + hpf(posX) + " " + hpf(posY) + " " + " Td\n" + content);
        } else {
          text.push(wordSpacing + content);
        }
      }

      if (variant === 0) {
        text = text.join(" Tj\nT* ");
      } else {
        text = text.join(" Tj\n");
      }

      if (apiMode === ApiMode.ADVANCED && transformationMatrix === null) {
        transformationMatrix = unitMatrix;
      }

      if (transformationMatrix !== null) {
        // It is kind of more intuitive to apply a plain rotation around the text anchor set by x and y
        // but when the user supplies an arbitrary transformation matrix, the x and y offsets should be applied
        // in the coordinate system established by this matrix
        if (typeof angle === "number") {
          transformationMatrix = matrixMult(
            transformationMatrix,
            new Matrix(1, 0, 0, 1, scaleByK(x), transformScaleY(y))
          );
        } else {
          transformationMatrix = matrixMult(
            new Matrix(1, 0, 0, 1, scaleByK(x), transformScaleY(y)),
            transformationMatrix
          );
        }

        transformationMatrix = matrixMult(
          // xOffset must always be scaled!
          new Matrix(1, 0, 0, 1, xOffset * k, 0),
          transformationMatrix
        );

        if (apiMode === ApiMode.ADVANCED) {
          transformationMatrix = matrixMult(new Matrix(1, 0, 0, -1, 0, 0), transformationMatrix);
        }

        text = transformationMatrix.toString() + " Tm\n" + text;
      } else {
        text = hpf(scaleByK(x + xOffset)) + " " + hpf(transformScaleY(y)) + " " + " Td\n" + text;
      }

      text += " Tj\n";

      var result =
        "BT\n/" +
        activeFontKey +
        " " +
        activeFontSize +
        " Tf\n" + // font face, style, size
        (activeFontSize * lineHeight).toFixed(2) +
        " TL\n" + // line spacing
        textColor +
        "\n";
      result += xtra;
      result += text;
      result += "ET";

      out(result);
      return scope;
    };

    /**
     * Letter spacing method to print text with gaps
     *
     * @function
     * @instance
     * @param {String|Array} text String to be added to the page.
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {number} spacing Spacing (in units declared at inception)
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name lstext
     * @deprecated We'll be removing this function. It doesn't take character width into account.
     */
    API.lstext = function(text, x, y, spacing) {
      console.warn("jsPDF.lstext is deprecated");
      for (var i = 0, len = text.length; i < len; i++, x += spacing) this.text(text[i], x, y);
      return this;
    };

    /**
     * Draws a line from (x1, y1) to (x2, y2). No extra call to {@link API.stroke} is needed.
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @return {jsPDF}
     * @methodOf jsPDF#
     * @name line
     */
    API.line = function(x1, y1, x2, y2) {
      if (apiMode === ApiMode.COMPAT) {
        return this.lines([[x2 - x1, y2 - y1]], x1, y1, [1, 1], "D");
      } else {
        return this.lines([[x2 - x1, y2 - y1]], x1, y1, [1, 1]).stroke();
      }
    };

    /**
     * Begin a new subpath by moving the current point to coordinates (x, y). The PDF "m" operator.
     * @param {number} x
     * @param {number} y
     * @methodOf jsPDF#
     * @name moveTo
     */
    API.moveTo = function(x, y) {
      out(hpf(scaleByK(x)) + " " + hpf(transformScaleY(y)) + " m");
    };

    /**
     * Append a straight line segment from the current point to the point (x, y). The PDF "l" operator.
     * @param {number} x
     * @param {number} y
     * @methodOf jsPDF#
     * @name lineTo
     */
    API.lineTo = function(x, y) {
      out(hpf(scaleByK(x)) + " " + hpf(transformScaleY(y)) + " l");
    };

    /**
     * Append a cubic Bézier curve to the current path. The curve shall extend from the current point to the point
     * (x3, y3), using (x1, y1) and (x2, y2) as Bézier control points. The new current point shall be (x3, x3).
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} x3
     * @param {number} y3
     * @methodOf jsPDF#
     * @name curveTo
     */
    API.curveTo = function(x1, y1, x2, y2, x3, y3) {
      out(
        [
          hpf(scaleByK(x1)),
          hpf(transformScaleY(y1)),
          hpf(scaleByK(x2)),
          hpf(transformScaleY(y2)),
          hpf(scaleByK(x3)),
          hpf(transformScaleY(y3)),
          "c"
        ].join(" ")
      );
    };

    // PDF supports these path painting and clip path operators:
    //
    // S - stroke
    // s - close/stroke
    // f (F) - fill non-zero
    // f* - fill evenodd
    // B - fill stroke nonzero
    // B* - fill stroke evenodd
    // b - close fill stroke nonzero
    // b* - close fill stroke evenodd
    // n - nothing (consume path)
    // W - clip nonzero
    // W* - clip evenodd
    //
    // In order to keep the API small, we omit the close-and-fill/stroke operators and provide a separate close()
    // method.

    /**
     * Close the current path. The PDF "h" operator.
     * @return jsPDF
     * @methodOf jsPDF#
     * @name close
     */
    API.close = function() {
      out("h");
      return this;
    };

    /**
     * Stroke the path. The PDF "S" operator.
     * @return jsPDF
     * @methodOf jsPDF#
     * @name stroke
     */
    API.stroke = function() {
      out("S");
      return this;
    };

    /**
     * @typedef {Object} PatternData
     * @property {string} key The key of the pattern
     * @property {Matrix} matrix The matrix that gets applied to the pattern right before drawing.
     * @property {number[]|undefined} boundingBox Only relevant for tiling patterns. The bounding box at which one
     * pattern cell gets clipped
     * @property {number|undefined} xStep Only relevant for tiling patterns. Horizontal spacing between pattern cells
     * @property {number|undefined} yStep Only relevant for tiling patterns. Vertical spacing between pattern cells
     */

    /**
     * Fill the current path using the nonzero winding number rule. If a pattern is provided, the path will be filled
     * with this pattern, otherwise with the current fill color. Equivalent to the PDF "f" operator.
     * @param {PatternData=} pattern If provided the path will be filled with this pattern
     * @return jsPDF
     * @methodOf jsPDF#
     * @name fill
     */
    API.fill = function(pattern) {
      fillWithOptionalPattern("f", pattern);
      return this;
    };

    /**
     * Fill the current path using the even-odd rule. The PDF f* operator.
     * @see API.fill
     * @param {PatternData=} pattern Optional pattern
     * @return jsPDF
     * @methodOf jsPDF#
     * @name fillEvenOdd
     */
    API.fillEvenOdd = function(pattern) {
      fillWithOptionalPattern("f*", pattern);
      return this;
    };

    /**
     * Fill using the nonzero winding number rule and then stroke the current Path. The PDF "B" operator.
     * @see API.fill
     * @param {PatternData=} pattern Optional pattern
     * @return jsPDF
     * @methodOf jsPDF#
     * @name fillStroke
     */
    API.fillStroke = function(pattern) {
      fillWithOptionalPattern("B", pattern);
      return this;
    };

    /**
     * Fill using the even-odd rule and then stroke the current Path. The PDF "B" operator.
     * @see API.fill
     * @param {PatternData=} pattern Optional pattern
     * @return jsPDF
     * @methodOf jsPDF#
     * @name fillStrokeEvenOdd
     */
    API.fillStrokeEvenOdd = function(pattern) {
      fillWithOptionalPattern("B*", pattern);
      return this;
    };

    function fillWithOptionalPattern(style, pattern) {
      if (typeof pattern === "object") {
        fillWithPattern(pattern, style);
      } else {
        out(style);
      }
    }

    /**
     * Modify the current clip path by intersecting it with the current path using the nonzero winding number rule. Note
     * that this will NOT consume the current path. In order to only use this path for clipping call
     * {@link API.discardPath} afterwards.
     *
     * When in "compat" API mode this method has a historical bug and will always stroke the path as well, use
     * {@link API.clip_fixed} instead.
     * @return jsPDF
     * @methodOf jsPDF#
     * @name clip
     */
    API.clip = function() {
      if (apiMode === ApiMode.COMPAT) {
        // By patrick-roberts, github.com/MrRio/jsPDF/issues/328
        // Call .clip() after calling .rect() with a style argument of null
        out("W"); // clip
        out("S"); // stroke path; necessary for clip to work
      } else {
        out("W");
      }
      return this;
    };

    /**
     * Modify the current clip path by intersecting it with the current path using the even-odd rule. Note
     * that this will NOT consume the current path. In order to only use this path for clipping call
     * {@link API.discardPath} afterwards.
     *
     * @return jsPDF
     * @methodOf jsPDF#
     * @name clipEvenOdd
     */
    API.clipEvenOdd = function() {
      out("W*");
      return this;
    };

    /**
     * Consumes the current path without any effect. Mainly used in combination with {@link clip} or
     * {@link clipEvenOdd}. The PDF "n" operator.
     * @return {jsPDF}
     * @methodOf jsPDF#
     * @name discardPath
     */
    API.discardPath = function() {
      out("n");
      return this;
    };

    /**
     * This fixes the previous function clip(). Perhaps the 'stroke path' hack was due to the missing 'n' instruction?
     * We introduce the fixed version so as to not break API.
     * @param fillRule
     * @deprecated Don't use this method when in "advanced" API mode.
     * @methodOf jsPDF#
     * @name clip_fixed
     */
    API.clip_fixed = function(fillRule) {
      // Call .clip() after calling drawing ops with a style argument of null
      // W is the PDF clipping op
      if ("evenodd" === fillRule) {
        out("W*");
      } else {
        out("W");
      }
      // End the path object without filling or stroking it.
      // This operator is a path-painting no-op, used primarily for the side effect of changing the current clipping path
      // (see Section 4.4.3, “Clipping Path Operators”)
      out("n");
    };

    /**
     * @typedef {Object} PatternData
     * {Matrix|undefined} matrix
     * {Number|undefined} xStep
     * {Number|undefined} yStep
     * {Array.<Number>|undefined} boundingBox
     */

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
     * @param {String=} style A string specifying the painting style or null. Valid styles include:
     * 'S' [default] - stroke,
     * 'F' - fill,
     * and 'DF' (or 'FD') -  fill then stroke.
     * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
     * method calls. The last drawing method call used to define the shape should not have a null style argument.
     *
     * In "advanced" API mode this parameter is deprecated.
     * @param {Boolean=} closed If true, the path is closed with a straight line from the end of the last curve to the starting point.
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the path. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name lines
     */
    API.lines = function(lines, x, y, scale, style, closed, patternKey, patternData) {
      var scalex, scaley, i, l, leg, x2, y2, x3, y3, x4, y4;

      // Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
      // in effort to make all calls have similar signature like
      //   function(content, coordinateX, coordinateY , miscellaneous)
      // this method had its args flipped.
      // code below allows backward compatibility with old arg order.
      if (typeof lines === "number") {
        var tmp = y;
        y = x;
        x = lines;
        lines = tmp;
      }

      scale = scale || [1, 1];

      // starting point
      this.moveTo(x, y);

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
          this.lineTo(x4, y4);
        } else {
          // bezier curve
          x2 = leg[0] * scalex + x4; // here last x4 is prior ending point
          y2 = leg[1] * scaley + y4; // here last y4 is prior ending point
          x3 = leg[2] * scalex + x4; // here last x4 is prior ending point
          y3 = leg[3] * scaley + y4; // here last y4 is prior ending point
          x4 = leg[4] * scalex + x4; // here last x4 was prior ending point
          y4 = leg[5] * scaley + y4; // here last y4 was prior ending point
          this.curveTo(x2, y2, x3, y3, x4, y4);
        }
      }

      if (closed) {
        this.close();
      }

      putStyle(style, patternKey, patternData);

      return this;
    };

    /**
     * Similar to {@link API.lines} but all coordinates are interpreted as absolute coordinates instead of relative.
     * @param {Array<Object>} lines An array of {op: operator, c: coordinates} object, where op is one of "m" (move to), "l" (line to)
     * "c" (cubic bezier curve) and "h" (close (sub)path)). c is an array of coordinates. "m" and "l" expect two, "c"
     * six and "h" an empty array (or undefined).
     * @param {String=} style  The style. Deprecated!
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the path. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name path
     */
    API.path = function(lines, style, patternKey, patternData) {
      for (var i = 0; i < lines.length; i++) {
        var leg = lines[i];
        var coords = leg.c;
        switch (leg.op) {
          case "m":
            this.moveTo(coords[0], coords[1]);
            break;
          case "l":
            this.lineTo(coords[0], coords[1]);
            break;
          case "c":
            this.curveTo.apply(this, coords);
            break;
          case "h":
            this.close();
            break;
        }
      }

      putStyle(style, patternKey, patternData);
      return this;
    };

    /**
     * Adds a rectangle to PDF
     *
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} w Width (in units declared at inception of PDF document)
     * @param {Number} h Height (in units declared at inception of PDF document)
     * @param {String=} style A string specifying the painting style or null. Valid styles include:
     * 'S' [default] - stroke,
     * 'F' - fill,
     * and 'DF' (or 'FD') -  fill then stroke.
     * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
     * method calls. The last drawing method call used to define the shape should not have a null style argument.
     *
     * In "advanced" API mode this parameter is deprecated.
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name rect
     */
    API.rect = function(x, y, w, h, style, patternKey, patternData) {
      if (apiMode === ApiMode.COMPAT) {
        h = -h;
      }

      out([hpf(scaleByK(x)), hpf(transformScaleY(y)), hpf(scaleByK(w)), hpf(scaleByK(h)), "re"].join(" "));

      putStyle(style, patternKey, patternData);

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
     * @param {String=} style A string specifying the painting style or null. Valid styles include:
     * 'S' [default] - stroke,
     * 'F' - fill,
     * and 'DF' (or 'FD') -  fill then stroke.
     * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
     * method calls. The last drawing method call used to define the shape should not have a null style argument.
     *
     * In "advanced" API mode this parameter is deprecated.
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name triangle
     */
    API.triangle = function(x1, y1, x2, y2, x3, y3, style, patternKey, patternData) {
      this.lines(
        [
          [x2 - x1, y2 - y1], // vector to point 2
          [x3 - x2, y3 - y2], // vector to point 3
          [x1 - x3, y1 - y3] // closing vector back to point 1
        ],
        x1,
        y1, // start of path
        [1, 1],
        style,
        true,
        patternKey,
        patternData
      );
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
     * @param {Number} ry Radius along y axis (in units declared at inception of PDF document)
     * @param {String=} style A string specifying the painting style or null. Valid styles include:
     * 'S' [default] - stroke,
     * 'F' - fill,
     * and 'DF' (or 'FD') -  fill then stroke.
     * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
     * method calls. The last drawing method call used to define the shape should not have a null style argument.
     *
     * In "advanced" API mode this parameter is deprecated.
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name roundedRect
     */
    API.roundedRect = function(x, y, w, h, rx, ry, style, patternKey, patternData) {
      var MyArc = (4 / 3) * (Math.SQRT2 - 1);

      rx = Math.min(rx, w * 0.5);
      ry = Math.min(ry, h * 0.5);

      this.lines(
        [
          [w - 2 * rx, 0],
          [rx * MyArc, 0, rx, ry - ry * MyArc, rx, ry],
          [0, h - 2 * ry],
          [0, ry * MyArc, -(rx * MyArc), ry, -rx, ry],
          [-w + 2 * rx, 0],
          [-(rx * MyArc), 0, -rx, -(ry * MyArc), -rx, -ry],
          [0, -h + 2 * ry],
          [0, -(ry * MyArc), rx * MyArc, -ry, rx, -ry]
        ],
        x + rx,
        y, // start of path
        [1, 1],
        style,
        true,
        patternKey,
        patternData
      );
      return this;
    };

    /**
     * Adds an ellipse to PDF
     *
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
     * @param {Number} ry Radius along y axis (in units declared at inception of PDF document)
     * @param {String=} style A string specifying the painting style or null. Valid styles include:
     * 'S' [default] - stroke,
     * 'F' - fill,
     * and 'DF' (or 'FD') -  fill then stroke.
     * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
     * method calls. The last drawing method call used to define the shape should not have a null style argument.
     *
     * In "advanced" API mode this parameter is deprecated.
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name ellipse
     */
    API.ellipse = function(x, y, rx, ry, style, patternKey, patternData) {
      var lx = (4 / 3) * (Math.SQRT2 - 1) * rx,
        ly = (4 / 3) * (Math.SQRT2 - 1) * ry;

      this.moveTo(x + rx, y);
      this.curveTo(x + rx, y - ly, x + lx, y - ry, x, y - ry);
      this.curveTo(x - lx, y - ry, x - rx, y - ly, x - rx, y);
      this.curveTo(x - rx, y + ly, x - lx, y + ry, x, y + ry);
      this.curveTo(x + lx, y + ry, x + rx, y + ly, x + rx, y);

      putStyle(style, patternKey, patternData);

      return this;
    };

    /**
     * Adds an circle to PDF
     *
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} r Radius (in units declared at inception of PDF document)
     * @param {String=} style A string specifying the painting style or null. Valid styles include:
     * 'S' [default] - stroke,
     * 'F' - fill,
     * and 'DF' (or 'FD') -  fill then stroke.
     * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
     * method calls. The last drawing method call used to define the shape should not have a null style argument.
     *
     * In "advanced" API mode this parameter is deprecated.
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name circle
     */
    API.circle = function(x, y, r, style, patternKey, patternData) {
      return this.ellipse(x, y, r, r, style, patternKey, patternData);
    };

    /**
     * Adds a properties to the PDF document
     *
     * @param {Object} properties A property_name-to-property_value object structure.
     * @function
     * @instance
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
     * @param {number} size Font size in points.
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setFontSize
     */
    API.setFontSize = function(size) {
      // convert font size into current unit system

      if (apiMode === ApiMode.ADVANCED) {
        activeFontSize = size / k;
      } else {
        activeFontSize = size;
      }

      out("/" + activeFontKey + " " + activeFontSize + " Tf");
      return this;
    };

    /**
     * @return {number}
     * @methodOf jsPDF#
     * @name getFontSize
     */
    API.getFontSize = function() {
      if (apiMode === ApiMode.COMPAT) {
        return activeFontSize;
      } else {
        return activeFontSize * k;
      }
    };

    /**
     * Sets text font face, variant for upcoming text elements.
     * See output of jsPDF.getFontList() for possible font names, styles.
     *
     * @param {string} fontName Font name or family. Example: "times"
     * @param {string} fontStyle Font style or variant. Example: "italic"
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setFont
     */
    API.setFont = function(fontName, fontStyle) {
      activeFontKey = getFont(fontName, fontStyle);
      // if font is not found, the above line blows up and we never go further
      out("/" + activeFontKey + " " + activeFontSize + " Tf");
      return this;
    };

    /**
     * Switches font style or variant for upcoming text elements,
     * while keeping the font face or family same.
     * See output of jsPDF.getFontList() for possible font names, styles.
     *
     * @param {string} style Font style or variant. Example: "italic"
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setFontStyle
     */
    API.setFontStyle = API.setFontType = function(style) {
      activeFontKey = getFont(undefined, style);
      // if font is not found, the above line blows up and we never go further
      out("/" + activeFontKey + " " + activeFontSize + " Tf");
      return this;
    };

    /**
     * Returns an object - a tree of fontName to fontStyle relationships available to
     * active PDF document.
     *
     * @public
     * @function
     * @instance
     * @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
     * @methodOf jsPDF#
     * @name getFontList
     */
    API.getFontList = function() {
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
     * Add a custom font to the current instance.
     *
     * @param {String} postScriptName name of the Font.  Example: "Menlo-Regular"
     * @param {String} fontName of font-family from @font-face definition.  Example: "Menlo Regular"
     * @param {String} fontStyle style.  Example: "normal"
     * @function
     * @instance
     * @methodOf jsPDF
     * @name addFont
     */
    API.addFont = function(postScriptName, fontName, fontStyle, encoding) {
      encoding = encoding || "Identity-H";
      addFont(postScriptName, fontName, fontStyle, encoding);
    };

    /**
     * Sets line width for upcoming lines.
     *
     * @param {number} width Line width (in units declared at inception of PDF document)
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setLineWidth
     */
    API.setLineWidth = function(width) {
      out(scaleByK(width).toFixed(2) + " w");
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
     * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'
     * @param {Number|String} ch2 Color channel value
     * @param {Number|String} ch3 Color channel value
     * @param {Number|String} ch4 Color channel value
     *
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setDrawColor
     */
    API.setDrawColor = function(ch1, ch2, ch3, ch4) {
      var options = {
        ch1: ch1,
        ch2: ch2,
        ch3: ch3,
        ch4: ch4,
        pdfColorType: "draw",
        precision: 2
      };

      out(generateColorString(options));
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
     * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'
     * @param {Number|String} ch2 Color channel value
     * @param {Number|String} ch3 Color channel value
     * @param {Number|String} ch4 Color channel value
     *
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setFillColor
     */
    API.setFillColor = function(ch1, ch2, ch3, ch4) {
      var options = {
        ch1: ch1,
        ch2: ch2,
        ch3: ch3,
        ch4: ch4,
        pdfColorType: "fill",
        precision: 2
      };

      out(generateColorString(options));
      return this;
    };

    /**
     * Sets the text color for upcoming elements.
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
     * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'
     * @param {Number|String} ch2 Color channel value
     * @param {Number|String} ch3 Color channel value
     * @param {Number|String} ch4 Color channel value
     *
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setTextColor
     */
    API.setTextColor = function(ch1, ch2, ch3, ch4) {
      var options = {
        ch1: ch1,
        ch2: ch2,
        ch3: ch3,
        ch4: ch4,
        pdfColorType: "text",
        precision: 3
      };
      textColor = generateColorString(options);

      return this;
    };

    /**
     * Initializes the default character set that the user wants to be global..
     *
     * @param {number} charSpace
     * @function
     * @instance
     * @returns {jsPDF} jsPDF-instance
     * @methodOf jsPDF
     * @name setCharSpace
     */
    API.setCharSpace = function(charSpace) {
      if (apiMode === ApiMode.COMPAT) {
        activeCharSpace = charSpace;
      } else if (apiMode === ApiMode.ADVANCED) {
        activeCharSpace = charSpace / k;
      }

      return this;
    };

    /**
     * Initializes the default character set that the user wants to be global..
     *
     * @param {boolean} boolean
     * @function
     * @instance
     * @returns {jsPDF} jsPDF-instance
     * @methodOf jsPDF
     * @name setR2L
     */
    API.setR2L = function(boolean) {
      R2L = boolean;
      return this;
    };

    /**
     * Sets a either previously added {@link GState} (via {@link addGState}) or a new {@link GState}.
     * @param {String|GState} gState If type is string, a previously added GState is used, if type is GState
     * it will be added before use.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setGState
     */
    API.setGState = function(gState) {
      if (typeof gState === "string") {
        gState = gStates[gStatesMap[gState]];
      } else {
        gState = addGState(null, gState);
      }

      if (!gState.equals(activeGState)) {
        out("/" + gState.id + " gs");
        activeGState = gState;
      }
    };

    /**
     * Is an Object providing a mapping from human-readable to
     * integer flag values designating the varieties of line cap
     * and join styles.
     *
     * @fieldOf jsPDF#
     * @name CapJoinStyles
     */
    API.CapJoinStyles = {
      0: 0,
      butt: 0,
      but: 0,
      miter: 0,
      1: 1,
      round: 1,
      rounded: 1,
      circle: 1,
      2: 2,
      projecting: 2,
      project: 2,
      square: 2,
      bevel: 2
    };

    /**
     * Sets the line cap styles
     * See {jsPDF.CapJoinStyles} for variants
     *
     * @param {String|Number} style A string or number identifying the type of line cap
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setLineCap
     */
    API.setLineCap = function(style) {
      var id = this.CapJoinStyles[style];
      if (id === undefined) {
        throw new Error(
          "Line cap style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles"
        );
      }
      lineCapID = id;
      out(id + " J");

      return this;
    };

    /**
     * Sets the line join styles
     * See {jsPDF.CapJoinStyles} for variants
     *
     * @param {String|Number} style A string or number identifying the type of line join
     * @function
     * @instance
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setLineJoin
     */
    API.setLineJoin = function(style) {
      var id = this.CapJoinStyles[style];
      if (id === undefined) {
        throw new Error(
          "Line join style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles"
        );
      }
      lineJoinID = id;
      out(id + " j");

      return this;
    };

    /**
     * Sets the miter limit.
     * @param {number} miterLimit
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setMiterLimit
     */
    API.setLineMiterLimit = function(miterLimit) {
      out(hpf(miterLimit) + " M");

      return this;
    };

    /**
     * Sets the line dash pattern.
     * @param {Array<number>} array An array containing 0-2 numbers. The first number sets the length of the
     * dashes, the second number the length of the gaps. If the second number is missing, the gaps are considered
     * to be as long as the dashes. An empty array means solid, unbroken lines.
     * @param phase The phase lines start with.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setLineDashPattern
     */
    API.setLineDashPattern = function(array, phase) {
      out(
        [
          "[" + (array[0] !== undefined ? array[0] : ""),
          (array[1] !== undefined ? array[1] : "") + "]",
          phase,
          "d"
        ].join(" ")
      );

      return this;
    };


    /**
     * Generates the PDF document.
     *
     * If `type` argument is undefined, output is raw body of resulting PDF returned as a string.
     *
     * @param {string} type A string identifying one of the possible output types.
     * @param {Object} options An object providing some additional signalling to PDF generator.
     *
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name output
     */
    API.output = output;

    /**
     * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf')
     *
     * @memberOf jsPDF
     * @name save
     * @function
     * @instance
     * @param  {string} filename The filename including extension.
     * @returns {jsPDF} jsPDF-instance
     */
    API.save = function(filename) {
      API.output("save");
    };

    // applying plugins (more methods) ON TOP of built-in API.
    // this is intentional as we allow plugins to override
    // built-ins
    for (var plugin in jsPDF.API) {
      if (jsPDF.API.hasOwnProperty(plugin)) {
        if (plugin === "events" && jsPDF.API.events.length) {
          (function(events, newEvents) {
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
              events.subscribe.apply(
                events,
                [eventname].concat(typeof handler_and_args === "function" ? [handler_and_args] : handler_and_args)
              );
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
    activeFontKey = "F1";
    _addPage(format, orientation);

    events.publish("initialized");
    return API;
  }

  /**
   * jsPDF.API is a STATIC property of jsPDF class.
   * jsPDF.API is an object you can add methods and properties to.
   * The methods / properties you add will show up in new jsPDF objects.
   *
   * One property is prepopulated. It is the 'events' Object. Plugin authors can add topics,
   * callbacks to this object. These will be reassigned to all new instances of jsPDF.
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
  jsPDF.API = {
    events: []
  };
  /**
   * The version of jsPDF
   * @name version
   * @type {string}
   * @memberOf jsPDF
   */
  jsPDF.version = "${versionID}" === "${vers" + "ionID}" ? "0.0.0" : "${versionID}";

  if (typeof define === "function" && define.amd) {
    define(function() {
      return jsPDF;
    });
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = jsPDF;
    module.exports.jsPDF = jsPDF;
  } else {
    global.jsPDF = jsPDF;
  }
  return jsPDF;
})(
  (typeof self !== "undefined" && self) ||
    (typeof window !== "undefined" && window) ||
    (typeof global !== "undefined" && global) ||
    Function('return typeof this === "object" && this.content')() ||
    Function("return this")()
);
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window
