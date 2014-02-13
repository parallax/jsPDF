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
  "use strict";

  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, "");
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
