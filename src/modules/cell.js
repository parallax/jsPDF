/**
 * @license
 * ====================================================================
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

import { jsPDF } from "../jspdf.js";

/**
 * @name cell
 * @module
 */
(function(jsPDFAPI) {
  "use strict";

  var NO_MARGINS = { left: 0, top: 0, bottom: 0, right: 0 };

  var px2pt = (0.264583 * 72) / 25.4;
  var printingHeaderRow = false;

  var _initialize = function() {
    if (typeof this.internal.__cell__ === "undefined") {
      this.internal.__cell__ = {};
      this.internal.__cell__.padding = 3;
      this.internal.__cell__.headerFunction = undefined;
      this.internal.__cell__.margins = Object.assign({}, NO_MARGINS);
      this.internal.__cell__.margins.width = this.getPageWidth();
      _reset.call(this);
    }
  };

  var _reset = function() {
    this.internal.__cell__.lastCell = new Cell();
    this.internal.__cell__.pages = 1;
  };

  var Cell = function() {
    var _x = arguments[0];
    Object.defineProperty(this, "x", {
      enumerable: true,
      get: function() {
        return _x;
      },
      set: function(value) {
        _x = value;
      }
    });
    var _y = arguments[1];
    Object.defineProperty(this, "y", {
      enumerable: true,
      get: function() {
        return _y;
      },
      set: function(value) {
        _y = value;
      }
    });
    var _width = arguments[2];
    Object.defineProperty(this, "width", {
      enumerable: true,
      get: function() {
        return _width;
      },
      set: function(value) {
        _width = value;
      }
    });
    var _height = arguments[3];
    Object.defineProperty(this, "height", {
      enumerable: true,
      get: function() {
        return _height;
      },
      set: function(value) {
        _height = value;
      }
    });
    var _text = arguments[4];
    Object.defineProperty(this, "text", {
      enumerable: true,
      get: function() {
        return _text;
      },
      set: function(value) {
        _text = value;
      }
    });
    var _lineNumber = arguments[5];
    Object.defineProperty(this, "lineNumber", {
      enumerable: true,
      get: function() {
        return _lineNumber;
      },
      set: function(value) {
        _lineNumber = value;
      }
    });
    var _align = arguments[6];
    Object.defineProperty(this, "align", {
      enumerable: true,
      get: function() {
        return _align;
      },
      set: function(value) {
        _align = value;
      }
    });

    return this;
  };

  Cell.prototype.clone = function() {
    return new Cell(
      this.x,
      this.y,
      this.width,
      this.height,
      this.text,
      this.lineNumber,
      this.align
    );
  };

  Cell.prototype.toArray = function() {
    return [
      this.x,
      this.y,
      this.width,
      this.height,
      this.text,
      this.lineNumber,
      this.align
    ];
  };

  /**
   * @name setHeaderFunction
   * @function
   * @param {function} func
   */
  jsPDFAPI.setHeaderFunction = function(func) {
    _initialize.call(this);
    this.internal.__cell__.headerFunction =
      typeof func === "function" ? func : undefined;
    return this;
  };

  /**
   * @name getTextDimensions
   * @function
   * @param {string} txt
   * @returns {Object} dimensions
   */
  jsPDFAPI.getTextDimensions = function(text, options) {
    _initialize.call(this);
    options = options || {};
    var fontSize = options.fontSize || this.getFontSize();
    var font = options.font || this.getFont();
    var scaleFactor = options.scaleFactor || this.internal.scaleFactor;
    var width = 0;
    var amountOfLines = 0;
    var height = 0;
    var tempWidth = 0;

    if (!Array.isArray(text) && typeof text !== "string") {
      if (typeof text === "number") {
        text = String(text);
      } else {
        throw new Error(
          "getTextDimensions expects text-parameter to be of type String or type Number or an Array of Strings."
        );
      }
    }

    const maxWidth = options.maxWidth;
    if (maxWidth > 0) {
      if (typeof text === "string") {
        text = this.splitTextToSize(text, maxWidth);
      } else if (Object.prototype.toString.call(text) === "[object Array]") {
        text = text.reduce(function(acc, textLine) {
          return acc.concat(scope.splitTextToSize(textLine, maxWidth));
        }, []);
      }
    } else {
      // Without the else clause, it will not work if you do not pass along maxWidth
      text = Array.isArray(text) ? text : [text];
    }

    for (var i = 0; i < text.length; i++) {
      tempWidth = this.getStringUnitWidth(text[i], { font: font }) * fontSize;
      if (width < tempWidth) {
        width = tempWidth;
      }
    }

    if (width !== 0) {
      amountOfLines = text.length;
    }

    width = width / scaleFactor;
    height = Math.max(
      (amountOfLines * fontSize * this.getLineHeightFactor() -
        fontSize * (this.getLineHeightFactor() - 1)) /
        scaleFactor,
      0
    );
    return { w: width, h: height };
  };

  /**
   * @name cellAddPage
   * @function
   */
  jsPDFAPI.cellAddPage = function() {
    _initialize.call(this);

    this.addPage();

    var margins = this.internal.__cell__.margins || NO_MARGINS;
    this.internal.__cell__.lastCell = new Cell(
      margins.left,
      margins.top,
      undefined,
      undefined
    );
    this.internal.__cell__.pages += 1;

    return this;
  };

  /**
   * @name cell
   * @function
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} text
   * @param {number} lineNumber lineNumber
   * @param {string} align
   * @return {jsPDF} jsPDF-instance
   */
  var cell = (jsPDFAPI.cell = function() {
    var currentCell;

    if (arguments[0] instanceof Cell) {
      currentCell = arguments[0];
    } else {
      currentCell = new Cell(
        arguments[0],
        arguments[1],
        arguments[2],
        arguments[3],
        arguments[4],
        arguments[5]
      );
    }
    _initialize.call(this);
    var lastCell = this.internal.__cell__.lastCell;
    var padding = this.internal.__cell__.padding;
    var margins = this.internal.__cell__.margins || NO_MARGINS;
    var tableHeaderRow = this.internal.__cell__.tableHeaderRow;
    var printHeaders = this.internal.__cell__.printHeaders;
    // If this is not the first cell, we must change its position
    if (typeof lastCell.lineNumber !== "undefined") {
      if (lastCell.lineNumber === currentCell.lineNumber) {
        //Same line
        currentCell.x = (lastCell.x || 0) + (lastCell.width || 0);
        currentCell.y = lastCell.y || 0;
      } else {
        //New line
        if (
          lastCell.y + lastCell.height + currentCell.height + margins.bottom >
          this.getPageHeight()
        ) {
          this.cellAddPage();
          currentCell.y = margins.top;
          if (printHeaders && tableHeaderRow) {
            this.printHeaderRow(currentCell.lineNumber, true);
            currentCell.y += tableHeaderRow[0].height;
          }
        } else {
          currentCell.y = lastCell.y + lastCell.height || currentCell.y;
        }
      }
    }

    if (typeof currentCell.text[0] !== "undefined") {
      this.rect(
        currentCell.x,
        currentCell.y,
        currentCell.width,
        currentCell.height,
        printingHeaderRow === true ? "FD" : undefined
      );
      if (currentCell.align === "right") {
        this.text(
          currentCell.text,
          currentCell.x + currentCell.width - padding,
          currentCell.y + padding,
          { align: "right", baseline: "top" }
        );
      } else if (currentCell.align === "center") {
        this.text(
          currentCell.text,
          currentCell.x + currentCell.width / 2,
          currentCell.y + padding,
          {
            align: "center",
            baseline: "top",
            maxWidth: currentCell.width - padding - padding
          }
        );
      } else {
        this.text(
          currentCell.text,
          currentCell.x + padding,
          currentCell.y + padding,
          {
            align: "left",
            baseline: "top",
            maxWidth: currentCell.width - padding - padding
          }
        );
      }
    }
    this.internal.__cell__.lastCell = currentCell;
    return this;
  });

  /**
     * Create a table from a set of data.
     * @name table
     * @function
     * @param {Integer} [x] : left-position for top-left corner of table
     * @param {Integer} [y] top-position for top-left corner of table
     * @param {Object[]} [data] An array of objects containing key-value pairs corresponding to a row of data.
     * @param {String[]} [headers] Omit or null to auto-generate headers at a performance cost

     * @param {Object} [config.printHeaders] True to print column headers at the top of every page
     * @param {Object} [config.autoSize] True to dynamically set the column widths to match the widest cell value
     * @param {Object} [config.margins] margin values for left, top, bottom, and width
     * @param {Object} [config.fontSize] Integer fontSize to use (optional)
     * @param {Object} [config.padding] cell-padding in pt to use (optional)
     * @param {Object} [config.headerBackgroundColor] default is #c8c8c8 (optional)
     * @returns {jsPDF} jsPDF-instance
     */

  jsPDFAPI.table = function(x, y, data, headers, config) {
    _initialize.call(this);
    if (!data) {
      throw new Error("No data for PDF table.");
    }

    config = config || {};

    var headerNames = [],
      headerLabels = [],
      headerAligns = [],
      i,
      columnMatrix = {},
      columnWidths = {},
      column,
      columnMinWidths = [],
      j,
      tableHeaderConfigs = [],
      //set up defaults. If a value is provided in config, defaults will be overwritten:
      autoSize = config.autoSize || false,
      printHeaders = config.printHeaders === false ? false : true,
      fontSize =
        config.css && typeof config.css["font-size"] !== "undefined"
          ? config.css["font-size"] * 16
          : config.fontSize || 12,
      margins =
        config.margins ||
        Object.assign({ width: this.getPageWidth() }, NO_MARGINS),
      padding = typeof config.padding === "number" ? config.padding : 3,
      headerBackgroundColor = config.headerBackgroundColor || "#c8c8c8";

    _reset.call(this);

    this.internal.__cell__.printHeaders = printHeaders;
    this.internal.__cell__.margins = margins;
    this.internal.__cell__.table_font_size = fontSize;
    this.internal.__cell__.padding = padding;
    this.internal.__cell__.headerBackgroundColor = headerBackgroundColor;
    this.setFontSize(fontSize);

    // Set header values
    if (headers === undefined || headers === null) {
      // No headers defined so we derive from data
      headerNames = Object.keys(data[0]);
      headerLabels = headerNames;
      headerAligns = headerNames.map(function() {
        return "left";
      });
    } else if (Array.isArray(headers) && typeof headers[0] === "object") {
      headerNames = headers.map(function(header) {
        return header.name;
      });
      headerLabels = headers.map(function(header) {
        return header.prompt || header.name || "";
      });
      headerAligns = headerNames.map(function(header) {
        return header.align || "left";
      });
      // Split header configs into names and prompts
      for (i = 0; i < headers.length; i += 1) {
        columnWidths[headers[i].name] = headers[i].width * px2pt;
      }
    } else if (Array.isArray(headers) && typeof headers[0] === "string") {
      headerNames = headers;
      headerLabels = headerNames;
      headerAligns = headerNames.map(function() {
        return "left";
      });
    }

    if (autoSize) {
      var headerName;
      for (i = 0; i < headerNames.length; i += 1) {
        headerName = headerNames[i];

        // Create a matrix of columns e.g., {column_title: [row1_Record, row2_Record]}

        columnMatrix[headerName] = data.map(function(rec) {
          return rec[headerName];
        });

        // get header width
        this.setFont(undefined, "bold");
        columnMinWidths.push(
          this.getTextDimensions(headerLabels[i], {
            fontSize: this.internal.__cell__.table_font_size,
            scaleFactor: this.internal.scaleFactor
          }).w
        );
        column = columnMatrix[headerName];

        // get cell widths
        this.setFont(undefined, "normal");
        for (j = 0; j < column.length; j += 1) {
          columnMinWidths.push(
            this.getTextDimensions(column[j], {
              fontSize: this.internal.__cell__.table_font_size,
              scaleFactor: this.internal.scaleFactor
            }).w
          );
        }

        // get final column width
        columnWidths[headerName] =
          Math.max.apply(null, columnMinWidths) + padding + padding;

        //have to reset
        columnMinWidths = [];
      }
    }

    // -- Construct the table

    if (printHeaders) {
      var row = {};
      for (i = 0; i < headerNames.length; i += 1) {
        row[headerNames[i]] = {};
        row[headerNames[i]].text = headerLabels[i];
        row[headerNames[i]].align = headerAligns[i];
      }

      var rowHeight = calculateLineHeight.call(this, row, columnWidths);

      // Construct the header row
      tableHeaderConfigs = headerNames.map(function(value) {
        return new Cell(
          x,
          y,
          columnWidths[value],
          rowHeight,
          row[value].text,
          undefined,
          row[value].align
        );
      });

      // Store the table header config
      this.setTableHeaderRow(tableHeaderConfigs);

      // Print the header for the start of the table
      this.printHeaderRow(1, false);
    }

    // Construct the data rows

    var align = headers.reduce(function(pv, cv) {
      pv[cv.name] = cv.align;
      return pv;
    }, {});
    for (i = 0; i < data.length; i += 1) {
      var lineHeight = calculateLineHeight.call(this, data[i], columnWidths);

      for (j = 0; j < headerNames.length; j += 1) {
        cell.call(
          this,
          new Cell(
            x,
            y,
            columnWidths[headerNames[j]],
            lineHeight,
            data[i][headerNames[j]],
            i + 2,
            align[headerNames[j]]
          )
        );
      }
    }
    this.internal.__cell__.table_x = x;
    this.internal.__cell__.table_y = y;
    return this;
  };

  /**
   * Calculate the height for containing the highest column
   *
   * @name calculateLineHeight
   * @function
   * @param {Object[]} model is the line of data we want to calculate the height of
   * @param {Integer[]} columnWidths is size of each column
   * @returns {number} lineHeight
   * @private
   */
  var calculateLineHeight = function calculateLineHeight(model, columnWidths) {
    var padding = this.internal.__cell__.padding;
    var fontSize = this.internal.__cell__.table_font_size;
    var scaleFactor = this.internal.scaleFactor;

    return Object.keys(model)
      .map(function(key) {
        var value = model[key];
        return this.splitTextToSize(
          value.hasOwnProperty("text") ? value.text : value,
          columnWidths[key] - padding - padding
        );
      }, this)
      .map(function(value) {
        return (
          (this.getLineHeightFactor() * value.length * fontSize) / scaleFactor +
          padding +
          padding
        );
      }, this)
      .reduce(function(pv, cv) {
        return Math.max(pv, cv);
      }, 0);
  };

  /**
   * Store the config for outputting a table header
   *
   * @name setTableHeaderRow
   * @function
   * @param {Object[]} config
   * An array of cell configs that would define a header row: Each config matches the config used by jsPDFAPI.cell
   * except the lineNumber parameter is excluded
   */
  jsPDFAPI.setTableHeaderRow = function(config) {
    _initialize.call(this);
    this.internal.__cell__.tableHeaderRow = config;
  };

  /**
   * Output the store header row
   *
   * @name printHeaderRow
   * @function
   * @param {number} lineNumber The line number to output the header at
   * @param {boolean} new_page
   */
  jsPDFAPI.printHeaderRow = function(lineNumber, new_page) {
    _initialize.call(this);
    if (!this.internal.__cell__.tableHeaderRow) {
      throw new Error("Property tableHeaderRow does not exist.");
    }

    var tableHeaderCell;

    printingHeaderRow = true;
    if (typeof this.internal.__cell__.headerFunction === "function") {
      var position = this.internal.__cell__.headerFunction(
        this,
        this.internal.__cell__.pages
      );
      this.internal.__cell__.lastCell = new Cell(
        position[0],
        position[1],
        position[2],
        position[3],
        undefined,
        -1
      );
    }
    this.setFont(undefined, "bold");

    var tempHeaderConf = [];
    for (var i = 0; i < this.internal.__cell__.tableHeaderRow.length; i += 1) {
      tableHeaderCell = this.internal.__cell__.tableHeaderRow[i].clone();
      if (new_page) {
        tableHeaderCell.y = this.internal.__cell__.margins.top || 0;
        tempHeaderConf.push(tableHeaderCell);
      }
      tableHeaderCell.lineNumber = lineNumber;
      this.setFillColor(this.internal.__cell__.headerBackgroundColor);
      cell.call(this, tableHeaderCell);
    }
    if (tempHeaderConf.length > 0) {
      this.setTableHeaderRow(tempHeaderConf);
    }
    this.setFont(undefined, "normal");
    printingHeaderRow = false;
  };
})(jsPDF.API);
