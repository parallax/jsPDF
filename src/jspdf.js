/**
 * Creates new jsPDF document object instance.
 * @name jsPDF
 * @class
 * @param orientation {string/Object} Orientation of the first page. Possible values are "portrait" or "landscape" (or shortcuts "p" (Default), "l").<br />
 * Can also be an options object.
 * @param unit {string}  Measurement unit to be used when coordinates are specified.<br />
 * Possible values are "pt" (points), "mm" (Default), "cm", "in" or "px".
 * @param format {string/Array} The format of the first page. Can be:<ul><li>a0 - a10</li><li>b0 - b10</li><li>c0 - c10</li><li>dl</li><li>letter</li><li>government-letter</li><li>legal</li><li>junior-legal</li><li>ledger</li><li>tabloid</li><li>credit-card</li></ul><br />
 * Default is "a4". If you want to use your own format just pass instead of one of the above predefined formats the size as an number-array, e.g. [595.28, 841.89]
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
var jsPDF = (function (global) {
  'use strict';

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
    if (typeof context !== 'object') {
      throw new Error('Invalid Context passed to initialize PubSub (jsPDF-module)');
    }
    var topics = {};

    this.subscribe = function (topic, callback, once) {
      once = once || false;
      if (typeof topic !== 'string' || typeof callback !== 'function' || typeof once !== 'boolean') {
        throw new Error('Invalid arguments passed to PubSub.subscribe (jsPDF-module)');
      }

      if (!topics.hasOwnProperty(topic)) {
        topics[topic] = {};
      }

      var token = Math.random().toString(35);
      topics[topic][token] = [callback, !!once];

      return token;
    };

    this.unsubscribe = function (token) {
      for (var topic in topics) {
        if (topics[topic][token]) {
          delete topics[topic][token];
          if (Object.keys(topics[topic]).length === 0) {
            delete topics[topic];
          }
          return true;
        }
      }
      return false;
    };

    this.publish = function (topic) {
      if (topics.hasOwnProperty(topic)) {
        var args = Array.prototype.slice.call(arguments, 1),
          tokens = [];

        for (var token in topics[topic]) {
          var sub = topics[topic][token];
          try {
            sub[0].apply(context, args);
          } catch (ex) {
            if (global.console) {
              console.error('jsPDF PubSub Error', ex.message, ex);
            }
          }
          if (sub[1]) tokens.push(token);
        }
        if (tokens.length) tokens.forEach(this.unsubscribe);
      }
    };

    this.getTopics = function () {
      return topics;
    }
  }

  /**
   * @constructor
   * @private
   */
  function jsPDF(orientation, unit, format, compressPdf) {
    var options = {};
    var filters = [];
    var userUnit = 1.0;

    if (typeof orientation === 'object') {
      options = orientation;

      orientation = options.orientation;
      unit = options.unit || unit;
      format = options.format || format;
      compressPdf = options.compress || options.compressPdf || compressPdf;
      filters = options.filters || ((compressPdf === true) ? ['FlateEncode'] : filters);
      userUnit = typeof options.userUnit === "number" ? Math.abs(options.userUnit) : 1.0;
    }

    unit = unit || 'mm';
    orientation = ('' + (orientation || 'P')).toLowerCase();
    var putOnlyUsedFonts = options.putOnlyUsedFonts || true;
    var usedFonts = {};
    
    var API = {
      internal: {},
      __private__: {}
    };

    API.__private__.PubSub = PubSub;

    var pdfVersion = '1.3';
    var getPdfVersion = API.__private__.getPdfVersion = function () {
      return pdfVersion;
    };

    var setPdfVersion = API.__private__.setPdfVersion = function (value) {
      pdfVersion = value;
    };

    // Size in pt of various paper formats
    const pageFormats = {
      'a0': [2383.94, 3370.39],
      'a1': [1683.78, 2383.94],
      'a2': [1190.55, 1683.78],
      'a3': [841.89, 1190.55],
      'a4': [595.28, 841.89],
      'a5': [419.53, 595.28],
      'a6': [297.64, 419.53],
      'a7': [209.76, 297.64],
      'a8': [147.40, 209.76],
      'a9': [104.88, 147.40],
      'a10': [73.70, 104.88],
      'b0': [2834.65, 4008.19],
      'b1': [2004.09, 2834.65],
      'b2': [1417.32, 2004.09],
      'b3': [1000.63, 1417.32],
      'b4': [708.66, 1000.63],
      'b5': [498.90, 708.66],
      'b6': [354.33, 498.90],
      'b7': [249.45, 354.33],
      'b8': [175.75, 249.45],
      'b9': [124.72, 175.75],
      'b10': [87.87, 124.72],
      'c0': [2599.37, 3676.54],
      'c1': [1836.85, 2599.37],
      'c2': [1298.27, 1836.85],
      'c3': [918.43, 1298.27],
      'c4': [649.13, 918.43],
      'c5': [459.21, 649.13],
      'c6': [323.15, 459.21],
      'c7': [229.61, 323.15],
      'c8': [161.57, 229.61],
      'c9': [113.39, 161.57],
      'c10': [79.37, 113.39],
      'dl': [311.81, 623.62],
      'letter': [612, 792],
      'government-letter': [576, 756],
      'legal': [612, 1008],
      'junior-legal': [576, 360],
      'ledger': [1224, 792],
      'tabloid': [792, 1224],
      'credit-card': [153, 243]
    };

    var getPageFormats = API.__private__.getPageFormats = function () {
      return pageFormats;
    };

    var getPageFormat = API.__private__.getPageFormat = function (value) {
      return pageFormats[value];
    };

    if (typeof format === "string") {
        format = getPageFormat(format);
    }
    format = format || getPageFormat('a4');

    var f2 = API.f2 = API.__private__.f2 = function (number) {
      if (isNaN(number)) {
        throw new Error('Invalid argument passed to jsPDF.f2');
      }
      return number.toFixed(2); // Ie, %.2f
    };

    var f3 = API.__private__.f3 = function (number) {
      if (isNaN(number)) {
        throw new Error('Invalid argument passed to jsPDF.f3');
      }
      return number.toFixed(3); // Ie, %.3f
    };

    var fileId = '00000000000000000000000000000000';

    var getFileId = API.__private__.getFileId = function () {
      return fileId;
    };

    var setFileId = API.__private__.setFileId = function (value) {
      value = value || ("12345678901234567890123456789012").split('').map(function () {
        return "ABCDEF0123456789".charAt(Math.floor(Math.random() * 16));
      }).join('');
      fileId = value;
      return fileId;
    };

    /**
     * @name setFileId
     * @memberOf jsPDF
     * @function
     * @instance
     * @param {string} value GUID.
     * @returns {jsPDF}
     */
    API.setFileId = function (value) {
      setFileId(value);
      return this;
    }

    /**
     * @name getFileId
     * @memberOf jsPDF
     * @function
     * @instance
     *
     * @returns {string} GUID.
     */
    API.getFileId = function () {
      return getFileId();
    }

    var creationDate;

    var convertDateToPDFDate = API.__private__.convertDateToPDFDate = function (parmDate) {
      var result = '';
      var tzoffset = parmDate.getTimezoneOffset(),
        tzsign = tzoffset < 0 ? '+' : '-',
        tzhour = Math.floor(Math.abs(tzoffset / 60)),
        tzmin = Math.abs(tzoffset % 60),
        timeZoneString = [tzsign, padd2(tzhour), "'", padd2(tzmin), "'"].join('');

      result = ['D:',
        parmDate.getFullYear(),
        padd2(parmDate.getMonth() + 1),
        padd2(parmDate.getDate()),
        padd2(parmDate.getHours()),
        padd2(parmDate.getMinutes()),
        padd2(parmDate.getSeconds()),
        timeZoneString
      ].join('');
      return result;
    };

    var convertPDFDateToDate = API.__private__.convertPDFDateToDate = function (parmPDFDate) {
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
    };

    var setCreationDate = API.__private__.setCreationDate = function (date) {
      var tmpCreationDateString;
      var regexPDFCreationDate = (/^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|\-0[0-9]|\-1[0-1])\'(0[0-9]|[1-5][0-9])\'?$/);
      if (typeof (date) === "undefined") {
        date = new Date();
      }

      if (typeof date === "object" && Object.prototype.toString.call(date) === "[object Date]") {
        tmpCreationDateString = convertDateToPDFDate(date)
      } else if (regexPDFCreationDate.test(date)) {
        tmpCreationDateString = date;
      } else {
        throw new Error('Invalid argument passed to jsPDF.setCreationDate');
      }
      creationDate = tmpCreationDateString;
      return creationDate;
    };

    var getCreationDate = API.__private__.getCreationDate = function (type) {
      var result = creationDate;
      if (type === "jsDate") {
        result = convertPDFDateToDate(creationDate);
      }
      return result;
    };

    /**
     * @name setCreationDate
     * @memberOf jsPDF
     * @function
     * @instance
     * @param {Object} date
     * @returns {jsPDF}
     */
    API.setCreationDate = function (date) {
      setCreationDate(date);
      return this;
    }

    /**
     * @name getCreationDate
     * @memberOf jsPDF
     * @function
     * @instance
     * @param {Object} type
     * @returns {Object}
     */
    API.getCreationDate = function (type) {
      return getCreationDate(type);
    }

    var padd2 = API.__private__.padd2 = function (number) {
      return ('0' + parseInt(number)).slice(-2);
    };

    var outToPages = !1; // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
    var pages = [];

    var content = [];
    var currentPage;
    var content_length = 0;
    var customOutputDestination;

    var setOutputDestination = API.__private__.setCustomOutputDestination = function (destination) {
      customOutputDestination = destination;
    };

    var resetOutputDestination = API.__private__.resetCustomOutputDestination = function (destination) {
      customOutputDestination = undefined;
    };

    var out = API.__private__.out = function (string) {
      var writeArray;
      string = (typeof string === "string") ? string : string.toString();
      if (typeof customOutputDestination === "undefined") {
        writeArray = ((outToPages) ? pages[currentPage] : content);
      } else {
        writeArray = customOutputDestination;
      }

      writeArray.push(string);

      if (!outToPages) {
        content_length += string.length + 1;
      }
      return writeArray;
    };

    var write = API.__private__.write = function (value) {
      return out(arguments.length === 1 ? value.toString() : Array.prototype.join.call(arguments, ' '));
    };

    var getArrayBuffer = API.__private__.getArrayBuffer = function (data) {
      var len = data.length,
        ab = new ArrayBuffer(len),
        u8 = new Uint8Array(ab);

      while (len--) u8[len] = data.charCodeAt(len);
      return ab;
    };

    var standardFonts = [
      ['Helvetica', "helvetica", "normal", 'WinAnsiEncoding'],
      ['Helvetica-Bold', "helvetica", "bold", 'WinAnsiEncoding'],
      ['Helvetica-Oblique', "helvetica", "italic", 'WinAnsiEncoding'],
      ['Helvetica-BoldOblique', "helvetica", "bolditalic", 'WinAnsiEncoding'],
      ['Courier', "courier", "normal", 'WinAnsiEncoding'],
      ['Courier-Bold', "courier", "bold", 'WinAnsiEncoding'],
      ['Courier-Oblique', "courier", "italic", 'WinAnsiEncoding'],
      ['Courier-BoldOblique', "courier", "bolditalic", 'WinAnsiEncoding'],
      ['Times-Roman', "times", "normal", 'WinAnsiEncoding'],
      ['Times-Bold', "times", "bold", 'WinAnsiEncoding'],
      ['Times-Italic', "times", "italic", 'WinAnsiEncoding'],
      ['Times-BoldItalic', "times", "bolditalic", 'WinAnsiEncoding'],
      ['ZapfDingbats', "zapfdingbats", "normal", null],
      ['Symbol', "symbol", "normal", null]
    ];

    var getStandardFonts = API.__private__.getStandardFonts = function (data) {
      return standardFonts;
    };

    var activeFontSize = options.fontSize || 16;

    /**
     * Sets font size for upcoming text elements.
     *
     * @param {number} size Font size in points.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name setFontSize
     */
    var setFontSize = API.__private__.setFontSize = API.setFontSize = function (size) {
      activeFontSize = size;
      return this;
    };

    /**
     * Gets the fontsize for upcoming text elements.
     *
     * @function
     * @instance
     * @returns {number}
     * @memberOf jsPDF
     * @name getFontSize
     */
    var getFontSize = API.__private__.getFontSize = API.getFontSize = function () {
      return activeFontSize;
    };


    var R2L = options.R2L || false;

    /**
     * Set value of R2L functionality.
     *
     * @param {boolean} value
     * @function
     * @instance
     * @returns {jsPDF} jsPDF-instance
     * @memberOf jsPDF
     * @name setR2L
     */
    var setR2L = API.__private__.setR2L = API.setR2L = function (value) {
      R2L = value;
      return this;
    };

    /**
     * Get value of R2L functionality.
     *
     * @function
     * @instance
     * @returns {boolean} jsPDF-instance
     * @memberOf jsPDF
     * @name getR2L
     */
    var getR2L = API.__private__.getR2L = API.getR2L = function (value) {
      return R2L;
    };

    var zoomMode; // default: 1;

    var setZoomMode = API.__private__.setZoomMode = function (zoom) {
      var validZoomModes = [undefined, null, 'fullwidth', 'fullheight', 'fullpage', 'original'];

      if (/^\d*\.?\d*\%$/.test(zoom)) {
        zoomMode = zoom;
      } else if (!isNaN(zoom)) {
        zoomMode = parseInt(zoom, 10);
      } else if (validZoomModes.indexOf(zoom) !== -1) {
        zoomMode = zoom
      } else {
        throw new Error('zoom must be Integer (e.g. 2), a percentage Value (e.g. 300%) or fullwidth, fullheight, fullpage, original. "' + zoom + '" is not recognized.')
      }
    }

    var getZoomMode = API.__private__.getZoomMode = function () {
      return zoomMode;
    }

    var pageMode; // default: 'UseOutlines';
    var setPageMode = API.__private__.setPageMode = function (pmode) {
      var validPageModes = [undefined, null, 'UseNone', 'UseOutlines', 'UseThumbs', 'FullScreen'];

      if (validPageModes.indexOf(pmode) == -1) {
        throw new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "' + pmode + '" is not recognized.')
      }
      pageMode = pmode;
    }

    var getPageMode = API.__private__.getPageMode = function () {
      return pageMode;
    }

    var layoutMode; // default: 'continuous';
    var setLayoutMode = API.__private__.setLayoutMode = function (layout) {
      var validLayoutModes = [undefined, null, 'continuous', 'single', 'twoleft', 'tworight', 'two'];

      if (validLayoutModes.indexOf(layout) == -1) {
        throw new Error('Layout mode must be one of continuous, single, twoleft, tworight. "' + layout + '" is not recognized.')
      }
      layoutMode = layout;
    }

    var getLayoutMode = API.__private__.getLayoutMode = function () {
      return layoutMode;
    }

    /**
     * Set the display mode options of the page like zoom and layout.
     *
     * @name setDisplayMode
     * @memberOf jsPDF
     * @function 
     * @instance
     * @param {integer|String} zoom   You can pass an integer or percentage as
     * a string. 2 will scale the document up 2x, '200%' will scale up by the
     * same amount. You can also set it to 'fullwidth', 'fullheight',
     * 'fullpage', or 'original'.
     *
     * Only certain PDF readers support this, such as Adobe Acrobat.
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
     */
    var setDisplayMode = API.__private__.setDisplayMode = API.setDisplayMode = function (zoom, layout, pmode) {
      setZoomMode(zoom);
      setLayoutMode(layout);
      setPageMode(pmode);
      return this;
    };

    var documentProperties = {
      'title': '',
      'subject': '',
      'author': '',
      'keywords': '',
      'creator': ''
    };

    var getDocumentProperty = API.__private__.getDocumentProperty = function (key) {
      if (Object.keys(documentProperties).indexOf(key) === -1) {
        throw new Error('Invalid argument passed to jsPDF.getDocumentProperty');
      }
      return documentProperties[key];
    };

    var getDocumentProperties = API.__private__.getDocumentProperties = function (properties) {
      return documentProperties;
    };

    /**
     * Adds a properties to the PDF document.
     *
     * @param {Object} A property_name-to-property_value object structure.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name setDocumentProperties
     */
    var setDocumentProperties = API.__private__.setDocumentProperties = API.setProperties = API.setDocumentProperties = function (properties) {
      // copying only those properties we can render.
      for (var property in documentProperties) {
        if (documentProperties.hasOwnProperty(property) && properties[
            property]) {
          documentProperties[property] = properties[property];
        }
      }
      return this;
    };

    var setDocumentProperty = API.__private__.setDocumentProperty = function (key, value) {
      if (Object.keys(documentProperties).indexOf(key) === -1) {
        throw new Error('Invalid arguments passed to jsPDF.setDocumentProperty');
      }
      return documentProperties[key] = value;
    };

    var objectNumber = 0; // 'n' Current object number
    var offsets = []; // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
    var fonts = {}; // collection of font objects, where key is fontKey - a dynamically created label for a given font.
    var fontmap = {}; // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
    var activeFontKey; // will be string representing the KEY of the font as combination of fontName + fontStyle
    var k; // Scale factor
    var page = 0;
    var pagesContext = [];
    var additionalObjects = [];
    var events = new PubSub(API);
    var hotfixes = options.hotfixes || [];
    var newObject = API.__private__.newObject = function () {
        var oid = newObjectDeferred();
        newObjectDeferredBegin(oid, true);
        return oid;
    };
    
    // Does not output the object.  The caller must call newObjectDeferredBegin(oid) before outputing any data
    var newObjectDeferred = API.__private__.newObjectDeferred = function () {
      objectNumber++;
      offsets[objectNumber] = function () {
        return content_length;
      };
      return objectNumber;
    };
    
    var newObjectDeferredBegin = function (oid, doOutput) {
      doOutput = typeof (doOutput) === 'boolean' ? doOutput : false;
      offsets[oid] = content_length;
      if (doOutput) {
        out(oid + ' 0 obj');
      }
      return oid;
    };
    // Does not output the object until after the pages have been output.
    // Returns an object containing the objectId and content.
    // All pages have been added so the object ID can be estimated to start right after.
    // This does not modify the current objectNumber;  It must be updated after the newObjects are output.
    var newAdditionalObject = API.__private__.newAdditionalObject = function () {
      var objId = newObjectDeferred();
      var obj = {
        objId: objId,
        content: ''
      };
      additionalObjects.push(obj);
      return obj;
    };

    var rootDictionaryObjId = newObjectDeferred();
    var resourceDictionaryObjId = newObjectDeferred();

    /////////////////////
    // Private functions
    /////////////////////

    var decodeColorString = API.__private__.decodeColorString = function (color) {
      var colorEncoded = color.split(' ');
      if (colorEncoded.length === 2 && (colorEncoded[1] === 'g' || colorEncoded[1] === 'G')) {
        // convert grayscale value to rgb so that it can be converted to hex for consistency
        var floatVal = parseFloat(colorEncoded[0]);
        colorEncoded = [floatVal, floatVal, floatVal, 'r'];
      }
      var colorAsRGB = '#';
      for (var i = 0; i < 3; i++) {
        colorAsRGB += ('0' + Math.floor(parseFloat(colorEncoded[i]) * 255).toString(16)).slice(-2);
      }
      return colorAsRGB;
    }
    var encodeColorString = API.__private__.encodeColorString = function (options) {
      var color;

      if (typeof options === "string") {
        options = {
          ch1: options
        };
      }
      var ch1 = options.ch1;
      var ch2 = options.ch2;
      var ch3 = options.ch3;
      var ch4 = options.ch4;
      var precision = options.precision;
      var letterArray = (options.pdfColorType === "draw") ? ['G', 'RG', 'K'] : ['g', 'rg', 'k'];

      if ((typeof ch1 === "string") && ch1.charAt(0) !== '#') {
        var rgbColor = new RGBColor(ch1);
        if (rgbColor.ok) {
          ch1 = rgbColor.toHex();
        } else if (!(/^\d*\.?\d*$/.test(ch1))) {
          throw new Error('Invalid color "' + ch1 + '" passed to jsPDF.encodeColorString.');
        }
      }
      //convert short rgb to long form
      if ((typeof ch1 === "string") && (/^#[0-9A-Fa-f]{3}$/).test(ch1)) {
        ch1 = '#' + ch1[1] + ch1[1] + ch1[2] + ch1[2] + ch1[3] + ch1[3];
      }

      if ((typeof ch1 === "string") && (/^#[0-9A-Fa-f]{6}$/).test(ch1)) {
        var hex = parseInt(ch1.substr(1), 16);
        ch1 = (hex >> 16) & 255;
        ch2 = (hex >> 8) & 255;
        ch3 = (hex & 255);
      }

      if ((typeof ch2 === "undefined") || ((typeof ch4 === "undefined") && (ch1 === ch2) && (ch2 === ch3))) {
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
        // assume RGBA
        if (ch4 && !isNaN(ch4.a)) {
          //TODO Implement transparency.
          //WORKAROUND use white for now, if transparent, otherwise handle as rgb
          if (ch4.a === 0) {
            color = ['1.000', '1.000', '1.000', letterArray[1]].join(" ");
            return color;
          }
        }
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
      } else {
        // assume CMYK
        if (typeof ch1 === 'string') {
          color = [ch1, ch2, ch3, ch4, letterArray[2]].join(" ");
        } else {
          switch (options.precision) {
            case 2:
              color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), f2(ch4 / 255), letterArray[2]].join(" ");
              break;
            case 3:
            default:
              color = [f3(ch1 / 255), f3(ch2 / 255), f3(ch3 / 255), f3(ch4 / 255), letterArray[2]].join(" ");
          }
        }
      }
      return color;
    };

    var getFilters = API.__private__.getFilters = function () {
      return filters;
    };
    
    var putStream = API.__private__.putStream = function (options) {
      options = options || {};
      var data = options.data || '';
      var filters = options.filters || getFilters();
      var alreadyAppliedFilters = options.alreadyAppliedFilters || [];
      var addLength1 = options.addLength1 || false;
      var valueOfLength1 = data.length;

      var processedData = {};
      if (filters === true) {
        filters = ['FlateEncode'];
      }
      var keyValues = options.additionalKeyValues || [];
      if (typeof jsPDF.API.processDataByFilters !== 'undefined') {
        processedData = jsPDF.API.processDataByFilters(data, filters);
      } else {
        processedData = {data: data, reverseChain : []}  
      }
      var filterAsString = processedData.reverseChain + ((Array.isArray(alreadyAppliedFilters)) ? alreadyAppliedFilters.join(' ') : alreadyAppliedFilters.toString());

      if (processedData.data.length !== 0) {
        keyValues.push({
          key: 'Length',
          value: processedData.data.length
        });
        if (addLength1 === true) {
          keyValues.push({
            key: 'Length1',
            value: valueOfLength1
          });
        }
      }

      if (filterAsString.length != 0) {
        //if (filters.length === 0 && alreadyAppliedFilters.length === 1 && typeof alreadyAppliedFilters !== "undefined") {
        if ((filterAsString.split('/').length - 1 === 1)) {
          keyValues.push({
            key: 'Filter',
            value: filterAsString
          });
        } else {
          keyValues.push({
            key: 'Filter',
            value: '[' + filterAsString + ']'
          });
        }
      }

      out('<<');
      for (var i = 0; i < keyValues.length; i++) {
        out('/' + keyValues[i].key + ' ' + keyValues[i].value);
      }
      out('>>');
      if (processedData.data.length !== 0) {
        out('stream');
        out(processedData.data);
        out('endstream');
      }
    };

    var putPage = API.__private__.putPage = function (page) {
      var mediaBox = page.mediaBox;
      var pageNumber = page.number;
      var data = page.data;
      var pageObjectNumber = page.objId;
      var pageContentsObjId = page.contentsObjId;

      newObjectDeferredBegin(pageObjectNumber, true);
      var wPt = pagesContext[currentPage].mediaBox.topRightX - pagesContext[currentPage].mediaBox.bottomLeftX;
      var hPt = pagesContext[currentPage].mediaBox.topRightY - pagesContext[currentPage].mediaBox.bottomLeftY;
      out('<</Type /Page');
      out('/Parent ' + page.rootDictionaryObjId + ' 0 R');
      out('/Resources ' + page.resourceDictionaryObjId + ' 0 R');
      out('/MediaBox [' + parseFloat(f2(page.mediaBox.bottomLeftX)) + ' ' + parseFloat(f2(page.mediaBox.bottomLeftY)) + ' ' + f2(page.mediaBox.topRightX) + ' ' + f2(page.mediaBox.topRightY) + ']');
      if (page.cropBox !== null) {
        out('/CropBox [' + f2(page.cropBox.bottomLeftX) + ' ' + f2(page.cropBox.bottomLeftY) + ' ' + f2(page.cropBox.topRightX) + ' ' + f2(page.cropBox.topRightY) + ']');
      }

      if (page.bleedBox !== null) {
        out('/BleedBox [' + f2(page.bleedBox.bottomLeftX) + ' ' + f2(page.bleedBox.bottomLeftY) + ' ' + f2(page.bleedBox.topRightX) + ' ' + f2(page.bleedBox.topRightY) + ']');
      }

      if (page.trimBox !== null) {
        out('/TrimBox [' + f2(page.trimBox.bottomLeftX) + ' ' + f2(page.trimBox.bottomLeftY) + ' ' + f2(page.trimBox.topRightX) + ' ' + f2(page.trimBox.topRightY) + ']');
      }

      if (page.artBox !== null) {
        out('/ArtBox [' + f2(page.artBox.bottomLeftX) + ' ' + f2(page.artBox.bottomLeftY) + ' ' + f2(page.artBox.topRightX) + ' ' + f2(page.artBox.topRightY) + ']');
      }

      if (typeof page.userUnit === "number" && page.userUnit !== 1.0) {
        out('/UserUnit ' + page.userUnit);
     }

      events.publish('putPage', {
        objId : pageObjectNumber,
        pageContext: pagesContext[pageNumber],
        pageNumber: pageNumber,
        page: data
      });
      out('/Contents ' + pageContentsObjId + ' 0 R');
      out('>>');
      out('endobj');
      // Page content
      var pageContent = data.join('\n');
      newObjectDeferredBegin(pageContentsObjId, true);
      putStream({
        data: pageContent,
        filters: getFilters()
      });
      out('endobj');
      return pageObjectNumber;
    }
    var putPages = API.__private__.putPages = function () {
      var n, p, i, pageObjectNumbers = [];
      
      for (n = 1; n <= page; n++) {
        pagesContext[n].objId = newObjectDeferred();
        pagesContext[n].contentsObjId = newObjectDeferred();
      }

      for (n = 1; n <= page; n++) {
        pageObjectNumbers.push(putPage({
          number: n,
          data: pages[n],
          objId: pagesContext[n].objId,
          contentsObjId: pagesContext[n].contentsObjId,
          mediaBox: pagesContext[n].mediaBox,
          cropBox: pagesContext[n].cropBox,
          bleedBox: pagesContext[n].bleedBox,
          trimBox: pagesContext[n].trimBox,
          artBox: pagesContext[n].artBox,
          userUnit: pagesContext[n].userUnit,
          rootDictionaryObjId: rootDictionaryObjId, 
          resourceDictionaryObjId: resourceDictionaryObjId
        }));
      }
      newObjectDeferredBegin(rootDictionaryObjId, true);
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
    };

    var putFont = function (font) {
      events.publish('putFont', {
        font: font,
        out: out,
        newObject: newObject,
        putStream: putStream
      });
      if (font.isAlreadyPutted !== true) {
        font.objectNumber = newObject();
        out('<<');
        out('/Type /Font');
        out('/BaseFont /' + font.postScriptName)
        out('/Subtype /Type1');
        if (typeof font.encoding === 'string') {
          out('/Encoding /' + font.encoding);
        }
        out('/FirstChar 32');
        out('/LastChar 255');
        out('>>');
        out('endobj');
      }
    };

    var putFonts = function () {
      for (var fontKey in fonts) {
        if (fonts.hasOwnProperty(fontKey)) {
          if (putOnlyUsedFonts === false || (putOnlyUsedFonts === true && usedFonts.hasOwnProperty(fontKey))) {
            putFont(fonts[fontKey]);
          }
        }
      }
    };

    var putResourceDictionary = function () {
      out('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]');
      out('/Font <<');

      // Do this for each font, the '1' bit is the index of the font
      for (var fontKey in fonts) {
        if (fonts.hasOwnProperty(fontKey)) {
          if (putOnlyUsedFonts === false || (putOnlyUsedFonts === true && usedFonts.hasOwnProperty(fontKey))) {
            out('/' + fontKey + ' ' + fonts[fontKey].objectNumber + ' 0 R');
           }
        }
      }
      out('>>');
      out('/XObject <<');
      events.publish('putXobjectDict');
      out('>>');
    };

    var putResources = function () {
      putFonts();
      events.publish('putResources');
      newObjectDeferredBegin(resourceDictionaryObjId, true);
      out('<<');
      putResourceDictionary();
      out('>>');
      out('endobj');
      events.publish('postPutResources');
    };

    var putAdditionalObjects = function () {
      events.publish('putAdditionalObjects');
      for (var i = 0; i < additionalObjects.length; i++) {
        var obj = additionalObjects[i];
        newObjectDeferredBegin(obj.objId, true);
        out(obj.content);
        out('endobj');
      }
      events.publish('postPutAdditionalObjects');
    };

    var addToFontDictionary = function (fontKey, fontName, fontStyle) {
      // this is mapping structure for quick font key lookup.
      // returns the KEY of the font (ex: "F1") for a given
      // pair of font name and type (ex: "Arial". "Italic")
      if (!fontmap.hasOwnProperty(fontName)) {
        fontmap[fontName] = {};
      }
      fontmap[fontName][fontStyle] = fontKey;
    };
    var addFont = function (postScriptName, fontName, fontStyle, encoding, isStandardFont) {
      isStandardFont = isStandardFont || false;
      var fontKey = 'F' + (Object.keys(fonts).length + 1).toString(10),
        // This is FontObject
        font = {
          'id': fontKey,
          'postScriptName': postScriptName,
          'fontName': fontName,
          'fontStyle': fontStyle,
          'encoding': encoding,
          'isStandardFont': isStandardFont,
          'metadata': {}
        };
      var instance = this;

      events.publish('addFont', {
        font: font,
        instance: instance
      });

      if (fontKey !== undefined) {
        fonts[fontKey] = font;
        addToFontDictionary(fontKey, fontName, fontStyle);
      }
      return fontKey;
    };

    var addFonts = function (arrayOfFonts) {
      for (var i = 0, l = standardFonts.length; i < l; i++) {
        var fontKey = addFont(
          arrayOfFonts[i][0],
          arrayOfFonts[i][1],
          arrayOfFonts[i][2],
          standardFonts[i][3],
          true);
          
        usedFonts[fontKey] = true;
        // adding aliases for standard fonts, this time matching the capitalization
        var parts = arrayOfFonts[i][0].split('-');
        addToFontDictionary(fontKey, parts[0], parts[1] || '');
      }
      events.publish('addFonts', {
        fonts: fonts,
        dictionary: fontmap
      });
    };

    var SAFE = function __safeCall(fn) {
      fn.foo = function __safeCallWrapper() {
        try {
          return fn.apply(this, arguments);
        } catch (e) {
          var stack = e.stack || '';
          if (~stack.indexOf(' at ')) stack = stack.split(" at ")[1];
          var m = "Error in function " + stack.split("\n")[0].split('<')[
            0] + ": " + e.message;
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
    };

    var to8bitStream = function (text, flags) {
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

      var i, l, sourceEncoding, encodingBlock, outputEncoding, newtext,
        isUnicode, ch, bch;

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
          throw new Error("Character at position " + i + " of string '" +
            text + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
        }
        newtext.push(bch);
        newtext.push(ch - (bch << 8));
      }
      return String.fromCharCode.apply(undefined, newtext);
    };

    var pdfEscape = API.__private__.pdfEscape = API.pdfEscape = function (text, flags) {
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
    };

    var beginPage = API.__private__.beginPage = function (width, height) {
      var tmp;
      // Dimensions are stored as user units and converted to points on output
      var orientation = typeof height === 'string' && height.toLowerCase();

      if (typeof width === 'string') {
        if (tmp = getPageFormat(width.toLowerCase())) {
          width = tmp[0];
          height = tmp[1];
        }
      }
      if (Array.isArray(width)) {
        height = width[1];
        width = width[0];
      }
      if (isNaN(width) || isNaN(height)) {
        width = format[0];
        height = format[1];
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

      if (width > 14400 || height > 14400) {
          console.warn('A page in a PDF can not be wider or taller than 14400 userUnit. jsPDF limits the width/height to 14400');
          width = Math.min(14400, width);
          height = Math.min(14400, height);
      }

      format = [width, height];
      outToPages = true;
      pages[++page] = [];
      pagesContext[page] = {
        objId: 0,
        contentsObjId: 0,
        userUnit : Number(userUnit),
        artBox: null,
        bleedBox: null,
        cropBox: null,
        trimBox: null,
        mediaBox: {
          bottomLeftX: 0,
          bottomLeftY: 0,
          topRightX: Number(width),
          topRightY: Number(height)
        }
      };
      _setPage(page);
    };

    var _addPage = function () {
      beginPage.apply(this, arguments);
      // Set line width
      setLineWidth(lineWidth);
      // Set draw color
      out(strokeColor);
      // resurrecting non-default line caps, joins
      if (lineCapID !== 0) {
        out(lineCapID + ' J');
      }
      if (lineJoinID !== 0) {
        out(lineJoinID + ' j');
      }
      events.publish('addPage', {
        pageNumber: page
      });
    };

    var _deletePage = function (n) {
      if (n > 0 && n <= page) {
        pages.splice(n, 1);
        page--;
        if (currentPage > page) {
          currentPage = page;
        }
        this.setPage(currentPage);
      }
    };
    var _setPage = function (n) {
      if (n > 0 && n <= page) {
        currentPage = n;
      }
    };

    var getNumberOfPages = API.__private__.getNumberOfPages = API.getNumberOfPages = function () {
      return pages.length - 1;
    }
    /**
     * Returns a document-specific font key - a label assigned to a
     * font name + font type combination at the time the font was added
     * to the font inventory.
     *
     * Font key is used as label for the desired font for a block of text
     * to be added to the PDF document stream.
     * @private
     * @function
     * @param fontName {string} can be undefined on "falthy" to indicate "use current"
     * @param fontStyle {string} can be undefined on "falthy" to indicate "use current"
     * @returns {string} Font key.
     * @ignore
     */
    var getFont = function (fontName, fontStyle, options) {
      var key = undefined,
        originalFontName, fontNameLowerCase;
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
          console.warn("Unable to look up font label for font '" + fontName + "', '" + fontStyle + "'. Refer to getFontList() for available fonts.");
        }
      }

      if (!key && !options.noFallback) {
        key = fontmap['times'][fontStyle];
        if (key == null) {
          key = fontmap['times']['normal'];
        }
      }
      return key;
    };


    var putInfo = API.__private__.putInfo = function () {
      newObject();
      out('<<');
      out('/Producer (jsPDF ' + jsPDF.version + ')');
      for (var key in documentProperties) {
        if (documentProperties.hasOwnProperty(key) && documentProperties[key]) {
          out('/' + key.substr(0, 1).toUpperCase() + key.substr(1) + ' (' +
            pdfEscape(documentProperties[key]) + ')');
        }
      }
      out('/CreationDate (' + creationDate + ')');
      out('>>');
      out('endobj');
    };

    var putCatalog = API.__private__.putCatalog = function (options) {
      options = options || {};
      var tmpRootDictionaryObjId = options.rootDictionaryObjId || rootDictionaryObjId;
      newObject();
      out('<<');
      out('/Type /Catalog');
      out('/Pages ' + tmpRootDictionaryObjId + ' 0 R');
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
          if (pcn.substr(pcn.length - 1) === '%')
            zoomMode = parseInt(zoomMode) / 100;
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
      out('>>');
      out('endobj');
    };

    var putTrailer = API.__private__.putTrailer = function () {
      out('trailer');
      out('<<');
      out('/Size ' + (objectNumber + 1));
      out('/Root ' + objectNumber + ' 0 R');
      out('/Info ' + (objectNumber - 1) + ' 0 R');
      out("/ID [ <" + fileId + "> <" + fileId + "> ]");
      out('>>');
    };

    var putHeader = API.__private__.putHeader = function () {
      out('%PDF-' + pdfVersion);
      out("%\xBA\xDF\xAC\xE0");
    };

    var putXRef = API.__private__.putXRef = function () {
      var i = 1;
      var p = "0000000000";

      out('xref');
      out('0 ' + (objectNumber + 1));
      out('0000000000 65535 f ');
      for (i = 1; i <= objectNumber; i++) {
        var offset = offsets[i];
        if (typeof offset === 'function') {
          out((p + offsets[i]()).slice(-10) + ' 00000 n ');
        } else {
          if (typeof offsets[i] !== "undefined") {
            out((p + offsets[i]).slice(-10) + ' 00000 n ');
          } else {
            out('0000000000 00000 n ');
          }
        }
      }
    };
    
    var buildDocument = API.__private__.buildDocument = function () {
      outToPages = false; // switches out() to content

      //reset fields relevant for objectNumber generation and xref.
      objectNumber = 0;
      content_length = 0;
      content = [];
      offsets = [];
      additionalObjects = [];
      rootDictionaryObjId = newObjectDeferred();
      resourceDictionaryObjId = newObjectDeferred();

      events.publish('buildDocument');

      putHeader();
      putPages();
      putAdditionalObjects();
      putResources();
      putInfo();
      putCatalog();

      var offsetOfXRef = content_length;
      putXRef();
      putTrailer();
      out('startxref');
      out('' + offsetOfXRef);
      out('%%EOF');

      outToPages = true;

      return content.join('\n');
    };

    var getBlob = API.__private__.getBlob = function (data) {
      return new Blob([getArrayBuffer(data)], {
        type: "application/pdf"
      });
    };
    
    /**
     * Generates the PDF document.
     *
     * If `type` argument is undefined, output is raw body of resulting PDF returned as a string.
     *
     * @param {string} type A string identifying one of the possible output types. Possible values are 'arraybuffer', 'blob', 'bloburi'/'bloburl', 'datauristring'/'dataurlstring', 'datauri'/'dataurl', 'dataurlnewwindow'.
     * @param {Object} options An object providing some additional signalling to PDF generator. Possible options are 'filename'.
     *
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name output
     */
    var output = API.output = API.__private__.output = SAFE(function output(type, options) {
      options = options || {};

      var pdfDocument = buildDocument();
      if (typeof options === "string") {
        options = {
          filename: options
        };
      } else {
        options.filename = options.filename || 'generated.pdf';
      }

      switch (type) {
        case undefined:
          return pdfDocument;
        case 'save':
          API.save(options.filename);
          break;
        case 'arraybuffer':
          return getArrayBuffer(pdfDocument);
        case 'blob':
          return getBlob(pdfDocument);
        case 'bloburi':
        case 'bloburl':
          // Developer is responsible of calling revokeObjectURL
          if (typeof global.URL !== "undefined" && typeof global.URL.createObjectURL === "function") {
            return global.URL && global.URL.createObjectURL(getBlob(pdfDocument)) || void 0;
          } else {f
            console.warn('bloburl is not supported by your system, because URL.createObjectURL is not supported by your browser.');
          }
          break;
        case 'datauristring':
        case 'dataurlstring':
          return 'data:application/pdf;filename=' + options.filename + ';base64,' + btoa(pdfDocument);
        case 'dataurlnewwindow':
          var htmlForNewWindow = '<html>' +
            '<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style>' +
            '<body>' +
            '<iframe src="' + this.output('datauristring') + '"></iframe>' +
            '</body></html>';
          var nW = global.open();
          if (nW !== null) {
            nW.document.write(htmlForNewWindow)
          }
          if (nW || typeof safari === "undefined") return nW;
          /* pass through */
        case 'datauri':
        case 'dataurl':
          return global.document.location.href = 'data:application/pdf;filename=' + options.filename + ';base64,' + btoa(pdfDocument);
        default:
          return null;
      }
    });

    /**
     * Used to see if a supplied hotfix was requested when the pdf instance was created.
     * @param {string} hotfixName - The name of the hotfix to check.
     * @returns {boolean}
     */
    var hasHotfix = function (hotfixName) {
      return (Array.isArray(hotfixes) === true &&
        hotfixes.indexOf(hotfixName) > -1);
    };

    switch (unit) {
      case 'pt':
        k = 1;
        break;
      case 'mm':
        k = 72 / 25.4;
        break;
      case 'cm':
        k = 72 / 2.54;
        break;
      case 'in':
        k = 72;
        break;
      case 'px':
        if (hasHotfix('px_scaling') == true) {
          k = 72 / 96;
        } else {
          k = 96 / 72;
        }
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
        throw new Error('Invalid unit: ' + unit);
    }

    setCreationDate();
    setFileId();

    //---------------------------------------
    // Public API
	
    var getPageInfo = API.__private__.getPageInfo = function (pageNumberOneBased) {
      if (isNaN(pageNumberOneBased) || (pageNumberOneBased % 1 !== 0)) {
        throw new Error('Invalid argument passed to jsPDF.getPageInfo');
      }
      var objId = pagesContext[pageNumberOneBased].objId;
      return {
        objId: objId,
        pageNumber: pageNumberOneBased,
        pageContext: pagesContext[pageNumberOneBased]
      };
    };

    var getPageInfoByObjId = API.__private__.getPageInfoByObjId = function (objId) {
      var pageNumberWithObjId;
      for (var pageNumber in pagesContext) {
        if (pagesContext[pageNumber].objId === objId) {
          pageNumberWithObjId = pageNumber;
          break;
        }
      }
      if (isNaN(objId) || (objId % 1 !== 0)) {
        throw new Error('Invalid argument passed to jsPDF.getPageInfoByObjId');
      }
      return getPageInfo(pageNumber);
    };

    var getCurrentPageInfo = API.__private__.getCurrentPageInfo = function () {
      return {
        objId: pagesContext[currentPage].objId,
        pageNumber: currentPage,
        pageContext: pagesContext[currentPage]
      };
    };

    /**
     * Adds (and transfers the focus to) new page to the PDF document.
     * @param format {String/Array} The format of the new page. Can be: <ul><li>a0 - a10</li><li>b0 - b10</li><li>c0 - c10</li><li>dl</li><li>letter</li><li>government-letter</li><li>legal</li><li>junior-legal</li><li>ledger</li><li>tabloid</li><li>credit-card</li></ul><br />
     * Default is "a4". If you want to use your own format just pass instead of one of the above predefined formats the size as an number-array, e.g. [595.28, 841.89]
     * @param orientation {string} Orientation of the new page. Possible values are "portrait" or "landscape" (or shortcuts "p" (Default), "l").
     * @function
     * @instance
     * @returns {jsPDF}
     *
     * @memberOf jsPDF
     * @name addPage
     */
    API.addPage = function () {
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
     * @param {number} page Switch the active page to the page number specified.
     * @example
     * doc = jsPDF()
     * doc.addPage()
     * doc.addPage()
     * doc.text('I am on page 3', 10, 10)
     * doc.setPage(1)
     * doc.text('I am on page 1', 10, 10)
     */
    API.setPage = function () {
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
    API.insertPage = function (beforePage) {
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
    API.movePage = function (targetPage, beforePage) {
      if (targetPage > beforePage) {
        var tmpPages = pages[targetPage];
        var tmpPagesContext = pagesContext[targetPage];
        for (var i = targetPage; i > beforePage; i--) {
          pages[i] = pages[i - 1];
          pagesContext[i] = pagesContext[i - 1];
        }
        pages[beforePage] = tmpPages;
        pagesContext[beforePage] = tmpPagesContext;
        this.setPage(beforePage);
      } else if (targetPage < beforePage) {
        var tmpPages = pages[targetPage];
        var tmpPagesContext = pagesContext[targetPage];
        for (var i = targetPage; i < beforePage; i++) {
          pages[i] = pages[i + 1];
          pagesContext[i] = pagesContext[i + 1];
        }
        pages[beforePage] = tmpPages;
        pagesContext[beforePage] = tmpPagesContext;
        this.setPage(beforePage);
      }
      return this;
    };

    /**
     * Deletes a page from the PDF.
     * @name deletePage
     * @memberOf jsPDF
     * @function
     * @instance
     * @returns {jsPDF}
     */
    API.deletePage = function () {
      _deletePage.apply(this, arguments);
      return this;
    };

    /**
     * Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
     *
     * @function
     * @instance
     * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page.
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page.
     * @param {Object} [options] - Collection of settings signaling how the text must be encoded.
     * @param {string} [options.align=left] - The alignment of the text, possible values: left, center, right, justify.
     * @param {string} [options.baseline=alphabetic] - Sets text baseline used when drawing the text, possible values: alphabetic, ideographic, bottom, top, middle.
     * @param {string} [options.angle=0] - Rotate the text counterclockwise. Expects the angle in degree.
     * @param {string} [options.charSpace=0] - The space between each letter.
     * @param {string} [options.lineHeightFactor=1.15] - The lineheight of each line.
     * @param {string} [options.flags] - Flags for to8bitStream.
     * @param {string} [options.flags.noBOM=true] - Don't add BOM to Unicode-text.
     * @param {string} [options.flags.autoencode=true] - Autoencode the Text.
     * @param {string} [options.maxWidth=0] - Split the text by given width, 0 = no split.
     * @param {string} [options.renderingMode=fill] - Set how the text should be rendered, possible values: fill, stroke, fillThenStroke, invisible, fillAndAddForClipping, strokeAndAddPathForClipping, fillThenStrokeAndAddToPathForClipping, addToPathForClipping.
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name text
     */
    var text = API.__private__.text = API.text = function (text, x, y, options) {
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
      //backwardsCompatibility
      var tmp;

      // Pre-August-2012 the order of arguments was function(x, y, text, flags)
      // in effort to make all calls have similar signature like
      //   function(data, coordinates... , miscellaneous)
      // this method had its args flipped.
      // code below allows backward compatibility with old arg order.
      if (typeof text === 'number' && typeof x === 'number' && (typeof y === 'string' || Array.isArray(y))) {
        tmp = y;
        y = x;
        x = text;
        text = tmp;
      }

      var flags = arguments[3];
      var angle = arguments[4];
      var align = arguments[5];

      if (typeof flags !== "object" || flags === null) {
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
        options = {
          flags: flags,
          angle: angle,
          align: align
        };
      }
      
      flags = flags || {};
      flags.noBOM = flags.noBOM || true;
      flags.autoencode = flags.autoencode || true;
      
      if (isNaN(x) || isNaN(y) || typeof text === "undefined" || text === null) {
        throw new Error('Invalid arguments passed to jsPDF.text');
      }

      if (text.length === 0) {
          return scope;
      }

      var xtra = '';
      var isHex = false;
      var lineHeight = typeof options.lineHeightFactor === 'number' ? options.lineHeightFactor : lineHeightFactor;

      var scope = options.scope || this;

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
            if (Array.isArray(text) && curDa.length === 1) {
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
        if (typeof text === 'string') {
          result = processingFunction(text)[0];
        } else if (Array.isArray(text)) {
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
            } else if ((Array.isArray(curDa) && curDa[0] === "string")) {
              tmpResult = processingFunction(curDa[0], curDa[1], curDa[2]);
              da.push([tmpResult[0], tmpResult[1], tmpResult[2]]);
            }
          }
          result = da;
        }
        return result;
      }

      //Check if text is of type String
      var textIsOfTypeString = false;
      var tmpTextIsOfTypeString = true;

      if (typeof text === 'string') {
        textIsOfTypeString = true;
      } else if (Array.isArray(text)) {
        //we don't want to destroy original text array, so cloning it
        var sa = text.concat();
        var da = [];
        var len = sa.length;
        var curDa;
        //we do array.join('text that must not be PDFescaped")
        //thus, pdfEscape each component separately
        while (len--) {
          curDa = sa.shift();
          if (typeof curDa !== "string" || (Array.isArray(curDa) && typeof curDa[0] !== "string")) {
            tmpTextIsOfTypeString = false;
          }
        }
        textIsOfTypeString = tmpTextIsOfTypeString
      }
      if (textIsOfTypeString === false) {
        throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
      }

      //Escaping 
      var activeFontEncoding = fonts[activeFontKey].encoding;

      if (activeFontEncoding === "WinAnsiEncoding" || activeFontEncoding === "StandardEncoding") {
        text = processTextByFunction(text, function (text, posX, posY) {
          return [ESC(text), posX, posY];
        });
      }
      //If there are any newlines in text, we assume
      //the user wanted to print multiple lines, so break the
      //text up into an array. If the text is already an array,
      //we assume the user knows what they are doing.
      //Convert text into an array anyway to simplify
      //later code.

      if (typeof text === 'string') {
        if (text.match(/[\r?\n]/)) {
          text = text.split(/\r\n|\r|\n/g);
        } else {
          text = [text];
        }
      }

      //baseline
      var height = activeFontSize / scope.internal.scaleFactor;
      var descent = height * (lineHeightFactor - 1);
      switch (options.baseline) {
        case 'bottom':
          y -= descent;
          break;
        case 'top':
          y += height - descent;
          break;
        case 'hanging':
          y += height - 2 * descent;
          break;
        case 'middle':
          y += height / 2 - descent;
          break;
        case 'ideographic':
        case 'alphabetic':
        default:
          // do nothing, everything is fine
          break;
        }

      //multiline
      var maxWidth = options.maxWidth || 0;

      if (maxWidth > 0) {
        if (typeof text === 'string') {
          text = scope.splitTextToSize(text, maxWidth);
        } else if (Object.prototype.toString.call(text) === '[object Array]') {
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
      events.publish('preProcessText', payload);

      text = payload.text;
      options = payload.options;
      //angle

      var angle = options.angle;
      var k = scope.internal.scaleFactor;
      var transformationMatrix = [];

      if (angle) {
        angle *= (Math.PI / 180);
        var c = Math.cos(angle),
          s = Math.sin(angle);
        transformationMatrix = [f2(c), f2(s), f2(s * -1), f2(c)];
      }

      //charSpace

      var charSpace = options.charSpace;

      if (typeof charSpace !== 'undefined') {
        xtra += f3(charSpace * k) + " Tc\n";
      }

      //lang

      var lang = options.lang;

      if (lang) {
        //    xtra += "/Lang (" + lang +")\n";
      }

      //renderingMode

      var renderingMode = -1;
      var tmpRenderingMode = -1;
      var parmRenderingMode = (typeof options.renderingMode !== "undefined") ? options.renderingMode : options.stroke;
      var pageContext = scope.internal.getCurrentPageInfo().pageContext;

      switch (parmRenderingMode) {
        case 0:
        case false:
        case 'fill':
          tmpRenderingMode = 0;
          break;
        case 1:
        case true:
        case 'stroke':
          tmpRenderingMode = 1;
          break;
        case 2:
        case 'fillThenStroke':
          tmpRenderingMode = 2;
          break;
        case 3:
        case 'invisible':
          tmpRenderingMode = 3;
          break;
        case 4:
        case 'fillAndAddForClipping':
          tmpRenderingMode = 4;
          break;
        case 5:
        case 'strokeAndAddPathForClipping':
          tmpRenderingMode = 5;
          break;
        case 6:
        case 'fillThenStrokeAndAddToPathForClipping':
          tmpRenderingMode = 6;
          break;
        case 7:
        case 'addToPathForClipping':
          tmpRenderingMode = 7;
          break;
      }

      var usedRenderingMode = typeof pageContext.usedRenderingMode !== 'undefined' ? pageContext.usedRenderingMode : -1;

      //if the coder wrote it explicitly to use a specific 
      //renderingMode, then use it
      if (tmpRenderingMode !== -1) {
        xtra += tmpRenderingMode + " Tr\n"
        //otherwise check if we used the rendering Mode already
        //if so then set the rendering Mode...
      } else if (usedRenderingMode !== -1) {
        xtra += "0 Tr\n";
      }

      if (tmpRenderingMode !== -1) {
        pageContext.usedRenderingMode = tmpRenderingMode;
      }

      //align

      var align = options.align || 'left';
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

      if (Object.prototype.toString.call(text) === '[object Array]') {
        var da = transformTextToSpecialArray(text);
        var left = 0;
        var newY;
        var maxLineLength;
        var lineWidths;
        if (align !== "left") {
          lineWidths = da.map(function (v) {
            return scope.getStringUnitWidth(v, {
              font: activeFont,
              charSpace: charSpace,
              fontSize: activeFontSize
            }) * activeFontSize / k;
          });
        }
        var maxLineLength = Math.max.apply(Math, lineWidths);
        //The first line uses the "main" Td setting,
        //and the subsequent lines are offset by the
        //previous line's x coordinate.
        var prevWidth = 0;
        var delta;
        var newX;
        if (align === "right") {
          //The passed in x coordinate defines the
          //rightmost point of the text.
          left = x - maxLineLength;
          x -= lineWidths[0];
          text = [];
          for (var i = 0, len = da.length; i < len; i++) {
            delta = maxLineLength - lineWidths[i];
            if (i === 0) {
              newX = getHorizontalCoordinate(x);
              newY = getVerticalCoordinate(y);
            } else {
              newX = (prevWidth - lineWidths[i]) * k;
              newY = -leading;
            }
            text.push([da[i], newX, newY]);
            prevWidth = lineWidths[i];
          }
        } else if (align === "center") {
          //The passed in x coordinate defines
          //the center point.
          left = x - maxLineLength / 2;
          x -= lineWidths[0] / 2;
          text = [];
          for (var i = 0, len = da.length; i < len; i++) {
            delta = (maxLineLength - lineWidths[i]) / 2;
            if (i === 0) {
              newX = getHorizontalCoordinate(x);
              newY = getVerticalCoordinate(y);
            } else {
              newX = (prevWidth - lineWidths[i]) / 2 * k;
              newY = -leading;
            }
            text.push([da[i], newX, newY]);
            prevWidth = lineWidths[i];
          }
        } else if (align === "left") {
          text = [];
          for (var i = 0, len = da.length; i < len; i++) {
            newY = (i === 0) ? getVerticalCoordinate(y) : -leading;
            newX = (i === 0) ? getHorizontalCoordinate(x) : 0;
            //text.push([da[i], newX, newY]);
            text.push(da[i]);
          }
        } else if (align === "justify") {
          text = [];
          var maxWidth = (maxWidth !== 0) ? maxWidth : pageWidth;

          for (var i = 0, len = da.length; i < len; i++) {
            newY = (i === 0) ? getVerticalCoordinate(y) : -leading;
            newX = (i === 0) ? getHorizontalCoordinate(x) : 0;
            if (i < (len - 1)) {
              wordSpacingPerLine.push(((maxWidth - lineWidths[i]) / (da[i].split(" ").length - 1) * k).toFixed(2));
            }
            text.push([da[i], newX, newY]);
          }
        } else {
          throw new Error(
            'Unrecognized alignment option, use "left", "center", "right" or "justify".'
          );
        }
      }

      //R2L
      var doReversing = typeof options.R2L === "boolean" ? options.R2L : R2L;
      if (doReversing === true) {
        text = processTextByFunction(text, function (text, posX, posY) {
          return [text.split("").reverse().join(""), posX, posY];
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
      events.publish('postProcessText', payload);

      text = payload.text;
      isHex = payload.mutex.isHex;

      var da = transformTextToSpecialArray(text);

      text = [];
      var variant = 0;
      var len = da.length;
      var posX;
      var posY;
      var content;
      var wordSpacing = '';

      for (var i = 0; i < len; i++) {

        wordSpacing = '';
        if (!Array.isArray(da[i])) {
          posX = getHorizontalCoordinate(x);
          posY = getVerticalCoordinate(y);
          content = (((isHex) ? "<" : "(")) + da[i] + ((isHex) ? ">" : ")");

        } else {
          posX = parseFloat(da[i][1]);
          posY = parseFloat(da[i][2]);
          content = (((isHex) ? "<" : "(")) + da[i][0] + ((isHex) ? ">" : ")");
          variant = 1;
        }
        if (wordSpacingPerLine !== undefined && wordSpacingPerLine[i] !== undefined) {
          wordSpacing = wordSpacingPerLine[i] + " Tw\n";
        }

        if (transformationMatrix.length !== 0 && i === 0) {
          text.push(wordSpacing + transformationMatrix.join(" ") + " " + posX.toFixed(2) + " " + posY.toFixed(2) + " Tm\n" + content);
        } else if (variant === 1 || (variant === 0 && i === 0)) {
          text.push(wordSpacing + posX.toFixed(2) + " " + posY.toFixed(2) + " Td\n" + content);
        } else {
          text.push(wordSpacing + content);
        }
      }
      if (variant === 0) {
        text = text.join(" Tj\nT* ");
      } else {
        text = text.join(" Tj\n");
      }

      text += " Tj\n";

      var result = 'BT\n/' +
        activeFontKey + ' ' + activeFontSize + ' Tf\n' + // font face, style, size
        (activeFontSize * lineHeight).toFixed(2) + ' TL\n' + // line spacing
        textColor + '\n';
      result += xtra;
      result += text;
      result += "ET";

      out(result);
      usedFonts[activeFontKey] = true;
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
     * @memberOf jsPDF
     * @name lstext
     * @deprecated We'll be removing this function. It doesn't take character width into account.
     */
    var lstext = API.__private__.lstext = API.lstext = function (text, x, y, charSpace) {
      console.warn('jsPDF.lstext is deprecated');
      return this.text(text, x, y, {
        charSpace: charSpace
      });
    };

    /**
     * 
     * @name clip
     * @function
     * @instance
     * @param {string} rule 
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @description All .clip() after calling drawing ops with a style argument of null.
     */
    var clip = API.__private__.clip = API.clip = function (rule) {
      // Call .clip() after calling drawing ops with a style argument of null
      // W is the PDF clipping op
      if ('evenodd' === rule) {
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
     * This fixes the previous function clip(). Perhaps the 'stroke path' hack was due to the missing 'n' instruction?
     * We introduce the fixed version so as to not break API.
     * @param fillRule
     * @ignore
     */
    var clip_fixed = API.__private__.clip_fixed = API.clip_fixed = function (rule) {
      console.log("clip_fixed is deprecated");
      API.clip(rule);
    };


    var isValidStyle = API.__private__.isValidStyle = function (style) {
      var validStyleVariants = [undefined, null, 'S', 'F', 'DF', 'FD', 'f', 'f*', 'B', 'B*'];
      var result = false;
      if (validStyleVariants.indexOf(style) !== -1) {
        result = true;
      }
      return (result);
    }

    var getStyle = API.__private__.getStyle = function (style) {

      // see path-painting operators in PDF spec
      var op = 'S'; // stroke
      if (style === 'F') {
        op = 'f'; // fill
      } else if (style === 'FD' || style === 'DF') {
        op = 'B'; // both
      } else if (style === 'f' || style === 'f*' || style === 'B' ||
        style === 'B*') {
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
    };

    /**
     * Draw a line on the current page.
     *
     * @name line
     * @function 
     * @instance
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @returns {jsPDF}
     * @memberOf jsPDF
     */
    var line = API.__private__.line = API.line = function (x1, y1, x2, y2) {
      if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        throw new Error('Invalid arguments passed to jsPDF.line');
      }
      return this.lines([
        [x2 - x1, y2 - y1]
      ], x1, y1);
    };

    /**
     * Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
     * All data points in `lines` are relative to last line origin.
     * `x`, `y` become x1,y1 for first line / curve in the set.
     * For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
     * For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.
     *
     * @example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, [1,1], 'F', false) // line, line, bezier curve, line
     * @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page.
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page.
     * @param {number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.
     * @param {string} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @param {boolean} closed If true, the path is closed with a straight line from the end of the last curve to the starting point.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name lines
     */
    var lines = API.__private__.lines = API.lines = function (lines, x, y, scale, style, closed) {
      var scalex, scaley, i, l, leg, x2, y2, x3, y3, x4, y4, tmp;

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
      closed = closed || false;

      if (isNaN(x) || isNaN(y) || !Array.isArray(lines) || !Array.isArray(scale) || !isValidStyle(style) || typeof closed !== 'boolean') {
        throw new Error('Invalid arguments passed to jsPDF.lines');
      }

      // starting point
      out(f3(getHorizontalCoordinate(x)) + ' ' + f3(getVerticalCoordinate(y)) + ' m ');

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
          out(f3(getHorizontalCoordinate(x4)) + ' ' + f3(getVerticalCoordinate(y4)) + ' l');
        } else {
          // bezier curve
          x2 = leg[0] * scalex + x4; // here last x4 is prior ending point
          y2 = leg[1] * scaley + y4; // here last y4 is prior ending point
          x3 = leg[2] * scalex + x4; // here last x4 is prior ending point
          y3 = leg[3] * scaley + y4; // here last y4 is prior ending point
          x4 = leg[4] * scalex + x4; // here last x4 was prior ending point
          y4 = leg[5] * scaley + y4; // here last y4 was prior ending point
          out(
            f3(getHorizontalCoordinate(x2)) + ' ' +
            f3(getVerticalCoordinate(y2)) + ' ' +
            f3(getHorizontalCoordinate(x3)) + ' ' +
            f3(getVerticalCoordinate(y3)) + ' ' +
            f3(getHorizontalCoordinate(x4)) + ' ' +
            f3(getVerticalCoordinate(y4)) + ' c');
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
     * Adds a rectangle to PDF.
     *
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page.
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page.
     * @param {number} w Width (in units declared at inception of PDF document).
     * @param {number} h Height (in units declared at inception of PDF document).
     * @param {string} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name rect
     */
    var rect = API.__private__.rect = API.rect = function (x, y, w, h, style) {
      if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h) || !isValidStyle(style)) {
        throw new Error('Invalid arguments passed to jsPDF.rect');
      }

      out([
        f2(getHorizontalCoordinate(x)),
        f2(getVerticalCoordinate(y)),
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
     * Adds a triangle to PDF.
     *
     * @param {number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page.
     * @param {number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page.
     * @param {number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page.
     * @param {number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page.
     * @param {number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page.
     * @param {number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page.
     * @param {string} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name triangle
     */
    var triangle = API.__private__.triangle = API.triangle = function (x1, y1, x2, y2, x3, y3, style) {
      if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2) || isNaN(x3) || isNaN(y3) || !isValidStyle(style)) {
        throw new Error('Invalid arguments passed to jsPDF.triangle');
      }
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
        true);
      return this;
    };

    /**
     * Adds a rectangle with rounded corners to PDF.
     *
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page.
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page.
     * @param {number} w Width (in units declared at inception of PDF document).
     * @param {number} h Height (in units declared at inception of PDF document).
     * @param {number} rx Radius along x axis (in units declared at inception of PDF document).
     * @param {number} ry Radius along y axis (in units declared at inception of PDF document).
     * @param {string} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name roundedRect
     */
    var roundedRect = API.__private__.roundedRect = API.roundedRect = function (x, y, w, h, rx, ry, style) {
      if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h) || isNaN(rx) || isNaN(ry) || !isValidStyle(style)) {
        throw new Error('Invalid arguments passed to jsPDF.roundedRect');
      }
      var MyArc = 4 / 3 * (Math.SQRT2 - 1);
      this.lines(
        [
          [(w - 2 * rx), 0],
          [(rx * MyArc), 0, rx, ry - (ry * MyArc), rx, ry],
          [0, (h - 2 * ry)],
          [0, (ry * MyArc), -(rx * MyArc), ry, -rx, ry],
          [(-w + 2 * rx), 0],
          [-(rx * MyArc), 0, -rx, -(ry * MyArc), -rx, -ry],
          [0, (-h + 2 * ry)],
          [0, -(ry * MyArc), (rx * MyArc), -ry, rx, -ry]
        ],
        x + rx,
        y, // start of path
        [1, 1],
        style);
      return this;
    };

    /**
     * Adds an ellipse to PDF.
     *
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page.
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page.
     * @param {number} rx Radius along x axis (in units declared at inception of PDF document).
     * @param {number} ry Radius along y axis (in units declared at inception of PDF document).
     * @param {string} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name ellipse
     */
    var ellise = API.__private__.ellipse = API.ellipse = function (x, y, rx, ry, style) {
      if (isNaN(x) || isNaN(y) || isNaN(rx) || isNaN(ry) || !isValidStyle(style)) {
        throw new Error('Invalid arguments passed to jsPDF.ellipse');
      }
      var lx = 4 / 3 * (Math.SQRT2 - 1) * rx,
        ly = 4 / 3 * (Math.SQRT2 - 1) * ry;

      out([
        f2(getHorizontalCoordinate(x + rx)),
        f2(getVerticalCoordinate(y)),
        'm',
        f2(getHorizontalCoordinate(x + rx)),
        f2(getVerticalCoordinate(y - ly)),
        f2(getHorizontalCoordinate(x + lx)),
        f2(getVerticalCoordinate(y - ry)),
        f2(getHorizontalCoordinate(x)),
        f2(getVerticalCoordinate(y - ry)),
        'c'
      ].join(' '));
      out([
        f2(getHorizontalCoordinate(x - lx)),
        f2(getVerticalCoordinate(y - ry)),
        f2(getHorizontalCoordinate(x - rx)),
        f2(getVerticalCoordinate(y - ly)),
        f2(getHorizontalCoordinate(x - rx)),
        f2(getVerticalCoordinate(y)),
        'c'
      ].join(' '));
      out([
        f2(getHorizontalCoordinate(x - rx)),
        f2(getVerticalCoordinate(y + ly)),
        f2(getHorizontalCoordinate(x - lx)),
        f2(getVerticalCoordinate(y + ry)),
        f2(getHorizontalCoordinate(x)),
        f2(getVerticalCoordinate(y + ry)),
        'c'
      ].join(' '));
      out([
        f2(getHorizontalCoordinate(x + lx)),
        f2(getVerticalCoordinate(y + ry)),
        f2(getHorizontalCoordinate(x + rx)),
        f2(getVerticalCoordinate(y + ly)),
        f2(getHorizontalCoordinate(x + rx)),
        f2(getVerticalCoordinate(y)),
        'c'
      ].join(' '));

      if (style !== null) {
        out(getStyle(style));
      }

      return this;
    };

    /**
     * Adds an circle to PDF.
     *
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page.
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page.
     * @param {number} r Radius (in units declared at inception of PDF document).
     * @param {string} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name circle
     */
    var circle = API.__private__.circle = API.circle = function (x, y, r, style) {
      if (isNaN(x) || isNaN(y) || isNaN(r) || !isValidStyle(style)) {
        throw new Error('Invalid arguments passed to jsPDF.circle');
      }
      return this.ellipse(x, y, r, r, style);
    };

    /**
     * Sets text font face, variant for upcoming text elements.
     * See output of jsPDF.getFontList() for possible font names, styles.
     *
     * @param {string} fontName Font name or family. Example: "times".
     * @param {string} fontStyle Font style or variant. Example: "italic".
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name setFont
     */
    API.setFont = function (fontName, fontStyle) {
      activeFontKey = getFont(fontName, fontStyle, {
        disableWarning: false
      });
      return this;
    };

    /**
     * Switches font style or variant for upcoming text elements,
     * while keeping the font face or family same.
     * See output of jsPDF.getFontList() for possible font names, styles.
     *
     * @param {string} style Font style or variant. Example: "italic".
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name setFontStyle
     */
    API.setFontStyle = API.setFontType = function (style) {
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
     * @instance
     * @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
     * @memberOf jsPDF
     * @name getFontList
     */
    var getFontList = API.__private__.getFontList = API.getFontList = function () {
      // TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
      var list = {},
        fontName, fontStyle, tmp;

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
     * @property {string} postScriptName PDF specification full name for the font.
     * @property {string} id PDF-document-instance-specific label assinged to the font.
     * @property {string} fontStyle Style of the Font.
     * @property {Object} encoding Encoding_name-to-Font_metrics_object mapping.
     * @function
     * @instance
     * @memberOf jsPDF
     * @name addFont
     */
    API.addFont = function (postScriptName, fontName, fontStyle, encoding) {
      encoding = encoding || 'Identity-H';
      addFont.call(this, postScriptName, fontName, fontStyle, encoding);
    };

    var lineWidth = options.lineWidth || 0.200025; // 2mm
    /**
     * Sets line width for upcoming lines.
     *
     * @param {number} width Line width (in units declared at inception of PDF document).
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name setLineWidth
     */
    var setLineWidth = API.__private__.setLineWidth = API.setLineWidth = function (width) {
      out((width * k).toFixed(2) + ' w');
      return this;
    };

    /**
     * Sets the dash pattern for upcoming lines.
     * 
     * To reset the settings simply call the method without any parameters.
     * @param {array} dashArray The pattern of the line, expects numbers. 
     * @param {number} dashPhase The phase at which the dash pattern starts.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name setLineDash
     */
    var setLineDash = API.__private__.setLineDash = jsPDF.API.setLineDash = function (dashArray, dashPhase) {
      dashArray = dashArray || [];
      dashPhase = dashPhase || 0;

      if (isNaN(dashPhase) || !Array.isArray(dashArray)) {
        throw new Error('Invalid arguments passed to jsPDF.setLineDash');
      }

      dashArray = dashArray.map(function (x) {return (x * k).toFixed(3)}).join(' ');
      dashPhase = parseFloat((dashPhase * k).toFixed(3));

      out('[' + dashArray + '] ' + dashPhase + ' d');
      return this;
    };

    var lineHeightFactor;

    var getLineHeight = API.__private__.getLineHeight = API.getLineHeight = function () {
      return activeFontSize * lineHeightFactor;
    };

    var lineHeightFactor;

    var getLineHeight = API.__private__.getLineHeight = API.getLineHeight = function () {
      return activeFontSize * lineHeightFactor;
    };

    /**
     * Sets the LineHeightFactor of proportion.
     *
     * @param {number} value LineHeightFactor value. Default: 1.15.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name setLineHeightFactor
     */
    var setLineHeightFactor = API.__private__.setLineHeightFactor = API.setLineHeightFactor = function (value) {
        value = value || 1.15;
        if (typeof value === "number") {
            lineHeightFactor = value;
        }
        return this;
    };

    /**
     * Gets the LineHeightFactor, default: 1.15.
     *
     * @function
     * @instance
     * @returns {number} lineHeightFactor
     * @memberOf jsPDF
     * @name getLineHeightFactor
     */
    var getLineHeightFactor = API.__private__.getLineHeightFactor = API.getLineHeightFactor = function () {
        return lineHeightFactor;
    };

    setLineHeightFactor(options.lineHeight);
    
    var getHorizontalCoordinate = API.__private__.getHorizontalCoordinate = function (value) {
      return value * k;
    };

    var getVerticalCoordinate = API.__private__.getVerticalCoordinate = function (value) {
      return pagesContext[currentPage].mediaBox.topRightY - pagesContext[currentPage].mediaBox.bottomLeftY - (value * k);
    };

    var getHorizontalCoordinateString = API.__private__.getHorizontalCoordinateString = function (value) {
      return f2(value * k);
    };

    var getVerticalCoordinateString = API.__private__.getVerticalCoordinateString = function (value) {
      return f2(pagesContext[currentPage].mediaBox.topRightY - pagesContext[currentPage].mediaBox.bottomLeftY - (value * k));
    };

    var strokeColor = options.strokeColor || '0 G';

    /**
     *  Gets the stroke color for upcoming elements.
     *
     * @function
     * @instance
     * @returns {string} colorAsHex
     * @memberOf jsPDF
     * @name getDrawColor
     */
    var getStrokeColor = API.__private__.getStrokeColor = API.getDrawColor = function () {
      return decodeColorString(strokeColor);
    }

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
     * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'.
     * @param {Number|String} ch2 Color channel value.
     * @param {Number|String} ch3 Color channel value.
     * @param {Number|String} ch4 Color channel value.
     *
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name setDrawColor
     */
    var setStrokeColor = API.__private__.setStrokeColor = API.setDrawColor = function (ch1, ch2, ch3, ch4) {
      var options = {
        "ch1": ch1,
        "ch2": ch2,
        "ch3": ch3,
        "ch4": ch4,
        "pdfColorType": "draw",
        "precision": 2
      };

      strokeColor = encodeColorString(options);
      out(strokeColor);
      return this;
    };

    var fillColor = options.fillColor || '0 g';

    /**
     * Gets the fill color for upcoming elements.
     *
     * @function
     * @instance
     * @returns {string} colorAsHex
     * @memberOf jsPDF
     * @name getFillColor
     */
    var getFillColor = API.__private__.getFillColor = API.getFillColor = function () {
      return decodeColorString(fillColor);
    }
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
     * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'.
     * @param {Number|String} ch2 Color channel value.
     * @param {Number|String} ch3 Color channel value.
     * @param {Number|String} ch4 Color channel value.
     *
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name setFillColor
     */
    var setFillColor = API.__private__.setFillColor = API.setFillColor = function (ch1, ch2, ch3, ch4) {
      var options = {
        "ch1": ch1,
        "ch2": ch2,
        "ch3": ch3,
        "ch4": ch4,
        "pdfColorType": "fill",
        "precision": 2
      };

      fillColor = encodeColorString(options);
      out(fillColor);
      return this;
    };

    var textColor = options.textColor || '0 g';
    /**
     * Gets the text color for upcoming elements.
     *
     * @function
     * @instance
     * @returns {string} colorAsHex
     * @memberOf jsPDF
     * @name getTextColor
     */
    var getTextColor = API.__private__.getTextColor = API.getTextColor = function () {
      return decodeColorString(textColor);
    }
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
     * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'.
     * @param {Number|String} ch2 Color channel value.
     * @param {Number|String} ch3 Color channel value.
     * @param {Number|String} ch4 Color channel value.
     *
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name setTextColor
     */
    var setTextColor = API.__private__.setTextColor = API.setTextColor = function (ch1, ch2, ch3, ch4) {
      var options = {
        "ch1": ch1,
        "ch2": ch2,
        "ch3": ch3,
        "ch4": ch4,
        "pdfColorType": "text",
        "precision": 3
      };
      textColor = encodeColorString(options);

      return this;
    };

    var activeCharSpace = options.charSpace || 0;

    /**
     * Get global value of CharSpace.
     *
     * @function
     * @instance
     * @returns {number} charSpace
     * @memberOf jsPDF
     * @name getCharSpace
     */
    var getCharSpace = API.__private__.getCharSpace = API.getCharSpace = function () {
      return activeCharSpace;
    };

    /**
     * Set global value of CharSpace.
     *
     * @param {number} charSpace
     * @function
     * @instance
     * @returns {jsPDF} jsPDF-instance
     * @memberOf jsPDF
     * @name setCharSpace
     */
    var setCharSpace = API.__private__.setCharSpace = API.setCharSpace = function (charSpace) {
      if (isNaN(charSpace)) {
        throw new Error('Invalid argument passed to jsPDF.setCharSpace');
      }
      activeCharSpace = charSpace;
      return this;
    };

    var lineCapID = 0;
    /**
     * Is an Object providing a mapping from human-readable to
     * integer flag values designating the varieties of line cap
     * and join styles.
     *
     * @memberOf jsPDF
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
     * Sets the line cap styles.
     * See {jsPDF.CapJoinStyles} for variants.
     *
     * @param {String|Number} style A string or number identifying the type of line cap.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name setLineCap
     */
    var setLineCap = API.__private__.setLineCap = API.setLineCap = function (style) {
      var id = API.CapJoinStyles[style];
      if (id === undefined) {
        throw new Error("Line cap style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
      }
      lineCapID = id;
      out(id + ' J');

      return this;
    };

    var lineJoinID = 0;
    /**
     * Sets the line join styles.
     * See {jsPDF.CapJoinStyles} for variants.
     *
     * @param {String|Number} style A string or number identifying the type of line join.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name setLineJoin
     */
    var setLineJoin = API.__private__.setLineJoin = API.setLineJoin = function (style) {
      var id = API.CapJoinStyles[style];
      if (id === undefined) {
        throw new Error("Line join style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
      }
      lineJoinID = id;
      out(id + ' j');

      return this;
    };

    var miterLimit;
    /**
     * Sets the miterLimit property, which effects the maximum miter length.
     *
     * @param {number} length The length of the miter
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberOf jsPDF
     * @name setMiterLimit
     */
    var setMiterLimit = API.__private__.setMiterLimit = API.setMiterLimit = function (length) {
      length = length || 0;
      if (isNaN(length)) {
        throw new Error('Invalid argument passed to jsPDF.setMiterLimit');
      }
      miterLimit = parseFloat(f2(length * k));
      out(miterLimit + ' M');

      return this;
    };

    /**
     * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf').
     * Uses FileSaver.js-method saveAs.
     *
     * @memberOf jsPDF
     * @name save
     * @function
     * @instance
     * @param  {string} filename The filename including extension.
     * @param  {Object} options An Object with additional options, possible options: 'returnPromise'.
     * @returns {jsPDF} jsPDF-instance
     */
    API.save = function (filename, options) {
      filename = filename || 'generated.pdf';
      
      options = options || {};
      options.returnPromise = options.returnPromise || false;
      
      if (options.returnPromise === false) {
          saveAs(getBlob(buildDocument()), filename);
          if (typeof saveAs.unload === 'function') {
            if (global.setTimeout) {
              setTimeout(saveAs.unload, 911);
            }
          }
      } else {
        return new Promise(function(resolve, reject) {
            try {
                var result = saveAs(getBlob(buildDocument()), filename);
                if (typeof saveAs.unload === 'function') {
                    if (global.setTimeout) {
                      setTimeout(saveAs.unload, 911);
                    }
                }
                resolve(result);
            } catch(e) {
                reject(e.message);
            }
        });
      }
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
              events.subscribe.apply(
                events, [eventname].concat(
                  typeof handler_and_args === 'function' ? [
                    handler_and_args
                  ] : handler_and_args));
            }
          }(events, jsPDF.API.events));
        } else {
          API[plugin] = jsPDF.API[plugin];
        }
      }
    }

    /**
     * Object exposing internal API to plugins
     * @public
     * @ignore
     */
    API.internal = {
      'pdfEscape': pdfEscape,
      'getStyle': getStyle,
      'getFont': function () {
        return fonts[getFont.apply(API, arguments)];
      },
      'getFontSize': getFontSize,
      'getCharSpace': getCharSpace,
      'getTextColor': getTextColor,
      'getLineHeight': getLineHeight,
      'getLineHeightFactor' : getLineHeightFactor,
      'write': write,
      'getHorizontalCoordinate': getHorizontalCoordinate,
      'getVerticalCoordinate': getVerticalCoordinate,
      'getCoordinateString': getHorizontalCoordinateString,
      'getVerticalCoordinateString': getVerticalCoordinateString,
      'collections': {},
      'newObject': newObject,
      'newAdditionalObject': newAdditionalObject,
      'newObjectDeferred': newObjectDeferred,
      'newObjectDeferredBegin': newObjectDeferredBegin,
      'getFilters': getFilters,
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
        getWidth: function () {
          return (pagesContext[currentPage].mediaBox.topRightX - pagesContext[currentPage].mediaBox.bottomLeftX) / k;
        },
        setWidth: function (value) {
          pagesContext[currentPage].mediaBox.topRightX = (value * k) + pagesContext[currentPage].mediaBox.bottomLeftX;
        },
        getHeight: function () {
          return (pagesContext[currentPage].mediaBox.topRightY - pagesContext[currentPage].mediaBox.bottomLeftY) / k;
        },
        setHeight: function (value) {
          pagesContext[currentPage].mediaBox.topRightY = (value * k) + pagesContext[currentPage].mediaBox.bottomLeftY;
        },
      },
      'output': output,
      'getNumberOfPages': getNumberOfPages,
      'pages': pages,
      'out': out,
      'f2': f2,
      'f3': f3,
      'getPageInfo': getPageInfo,
      'getPageInfoByObjId': getPageInfoByObjId,
      'getCurrentPageInfo': getCurrentPageInfo,
      'getPDFVersion': getPdfVersion,
      'hasHotfix': hasHotfix //Expose the hasHotfix check so plugins can also check them.
    };

    Object.defineProperty(API.internal.pageSize, 'width', {
      get: function () {
        return (pagesContext[currentPage].mediaBox.topRightX - pagesContext[currentPage].mediaBox.bottomLeftX) / k;
      },
      set: function (value) {
        pagesContext[currentPage].mediaBox.topRightX = (value * k) + pagesContext[currentPage].mediaBox.bottomLeftX;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(API.internal.pageSize, 'height', {
      get: function () {
        return (pagesContext[currentPage].mediaBox.topRightY - pagesContext[currentPage].mediaBox.bottomLeftY) / k;
      },
      set: function (value) {
        pagesContext[currentPage].mediaBox.topRightY = (value * k) + pagesContext[currentPage].mediaBox.bottomLeftY;
      },
      enumerable: true,
      configurable: true
    });


    //////////////////////////////////////////////////////
    // continuing initialization of jsPDF Document object
    //////////////////////////////////////////////////////
    // Add the first page automatically
    addFonts(standardFonts);
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
   * The version of jsPDF.
   * @name version
   * @type {string}
   * @memberOf jsPDF
   */
  jsPDF.version = '0.0.0';

  if (typeof define === 'function' && define.amd) {
    define('jsPDF', function () {
      return jsPDF;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = jsPDF;
    module.exports.jsPDF = jsPDF;
  } else {
    global.jsPDF = jsPDF;
  }
  return jsPDF;
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || Function('return typeof this === "object" && this.content')() || Function('return this')()));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window
