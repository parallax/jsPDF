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
        },
        NO_MARGINS = {left:0, top:0, bottom: 0};

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
        } catch(e) {
            text.style.fontWeight = fontStyle;
        }

        text.style.fontName = fontName;
        text.style.fontSize = fontSize + 'pt';
        try {
            text.textContent = txt;            
        } catch(e) {
            text.innerText = txt;
        }

        document.body.appendChild(text);

        dimensions = { w: (text.offsetWidth + 1) * px2pt, h: (text.offsetHeight + 1) * px2pt};

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
                if ((curCell.y + curCell.h + h + margin) >= this.internal.pageSize.height - margins.bottom) {
                    this.cellAddPage();
                    pgAdded = true;
                    if (this.printHeaders && this.tableHeaderRow) {
                        this.printHeaderRow(ln, true);
                    }
                }
                //We ignore the passed y: the lines may have different heights
                y = (getLastCellPosition().y + getLastCellPosition().h);
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
                    this.text(currentLine, x + w - textSize - padding, y + this.internal.getLineHeight()*(i+1));
                }
            } else {
                this.text(txt, x + padding, y + this.internal.getLineHeight());
            }
        }
        setLastCellPosition(x, y, w, h, ln);
        return this;
    };

    
  jsPDFAPI.cell_2 = function (x, y, w, h, txt, align, border, fontweight, rowbgcolor, font_size) {

    //for table frame
    if (!font_size) {
      //this.setDrawColor(255,0,0); //for debugging
      this.rect(x, y, w, h);
      return this;
    }

    if (txt[0] !== undefined) {
      if (border !== 'hidden') {
        if (rowbgcolor) {
          //regex code borrowed from Renderer.prototype.getPdfColor
          var r, g, b;
          var rx = /rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+\s*)\)/;
          var m = rx.exec(rowbgcolor);
          if (m != null) {
            r = parseInt(m[1]);
            g = parseInt(m[2]);
            b = parseInt(m[3]);
            this.setFillColor(r, g, b);
            this.rect(x, y, w, h, 'FD');
          } else {
            this.rect(x, y, w, h);
          }
        } else {
          this.rect(x, y, w, h);
        }
      }

      if (fontweight === 'bold') {
        this.setFontStyle('bold');
      } else {
        this.setFontStyle('normal');
      }

      if (align === 'right') {
        if (!(txt instanceof Array)) {
          txt = [txt];
        }
        for (var i = 0; i < txt.length; i++) {
          var currentLine = txt[i];
          this.setFontSize(font_size);
          var textSize = this.getStringUnitWidth(currentLine) * this.internal.getFontSize();
          this.text(currentLine, x + w - textSize - padding, y + this.internal.getLineHeight() * (i + 1));
        }
      } else {
        var x_padding = x + padding;
        var divider = 2;
        var text_width = this.getStringUnitWidth(txt) * font_size;
        this.setFontSize(font_size);
        if (align === 'center') {
          x_padding = x + w / 2 - text_width / 2;
        }
        this.text(txt, x_padding, y + (h / divider + font_size / 2.8));
      }
    }

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
           margins         = NO_MARGINS;

           margins.width = this.internal.pageSize.width;

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
            if (config.css && typeof(config.css['font-size']) !== "undefined") {
                fontSize = config.css['font-size'] * 16;
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
                
                //have to reset
                columnMinWidths = [];
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
     * Alternative table function implementation
     * Must be enabled in config, otherwise legacy jsPDFAPI.table() is used
     */    
    
  jsPDFAPI.table_2 = function (x, y, table, config) {

    var cell_params = [],
        col_widths = [],
        row_heights = [],
        cell_table = [],
        i,
        ii,
        iii,
        row_i,
        brdr_style,
        text_align,
        font_weight,
        tableScaleFactor,
        rowCount = 0,

    //set up defaults. If a value is provided in config, defaults will be overwritten:
    //autoSize        = false, //unsupported
    //printHeaders    = true, //unsupported
    fontSize = 12,
        margins = NO_MARGINS,
        scaleBasis = 'width';

    margins.width = this.internal.pageSize.width;

    //scale: renderer.settings.table_2_scale,
    //tableFontSize: renderer.settings.table_2_fontSize

    if (config) {
      //override config defaults if the user has specified non-default behavior:
      //if(config.autoSize === true) {
      //    autoSize = true; //unsupported
      //}
      //if(config.printHeaders === false) {
      //    printHeaders = false; //unsupported
      //}
      if (config.tableFontSize) {
        fontSize = config.tableFontSize;
      }
      if (config.scaleBasis) {
        scaleBasis = config.scaleBasis;
      }
      if (config.margins) {
        margins = config.margins;
      }
    }

    this.margins = margins;
    this.setFontSize(fontSize);
    this.table_font_size = fontSize;

    $(table.querySelectorAll('tr')).each(function (index, row_element) {

      rowCount++;

      $(row_element.querySelectorAll('td,th')).each(function (index_2, cell_element) {

        brdr_style = $(cell_element)[0].style.border;
        if (brdr_style.match(/hidden/gi)) {
          brdr_style = "hidden";
        } else {
          brdr_style = "visible";
        }

        text_align = $(cell_element)[0].style.textAlign;
        if (text_align.match(/right/gi)) {
          text_align = "right";
        } else if (text_align.match(/left/gi)) {
          text_align = "left";
        } else {
          text_align = "center";
        }

        if ($(cell_element).prop("tagName") === 'TH') {
          font_weight = "bold";
        } else {
          font_weight = $(cell_element)[0].style.fontWeight;
          if (font_weight.match(/bold/gi)) {
            font_weight = "bold";
          } else {
            font_weight = "normal";
          }
        }

        cell_params.push({ width: $(cell_element).prop("offsetWidth"),
          height: $(cell_element).prop("offsetHeight"),
          ri: $(row_element).prop("rowIndex"),
          rowbgcolor: $(row_element)[0].style.backgroundColor,
          text: $(cell_element).html(),
          border: brdr_style,
          textalign: text_align,
          fontweight: font_weight,
          rspan: $(cell_element).attr("rowspan"),
          cspan: $(cell_element).attr("colspan") });
      });
    });

    if (cell_params.length === 0) {

      this.lastCellPos = { x: x,
                         y: y - 20,
                         w: 0,
                         h: 0,
                         ln: 0 };
      return this;
    }

    var span_table = [];
    var col_index = -1;
    col_widths[0] = [];
    row_heights[0] = [];

    for (i = 0; i < rowCount; i++) {
      span_table[i] = 0;
    }

    for (row_i = 0, i = 0; i < cell_params.length; i++) {

      if (row_i !== cell_params[i].ri) {
        row_i++;
        col_index = 0;
        col_widths[row_i] = [];
        row_heights[row_i] = [];
      } else {
        col_index++;
      }

      col_widths[row_i][col_index] = cell_params[i].width;
      row_heights[row_i][col_index] = cell_params[i].height;

      //store number of columns from each row
      if (cell_params[i].cspan) {
        span_table[row_i] += Number(cell_params[i].cspan);
      } else {
        span_table[row_i]++;
      }
    }

    var maxCols = 0; // maximum number of columns in a row
    var maxCols_i;

    //seek the row that has biggest number of columns
    for (i = 0; i < span_table.length; i++) {
      if (span_table[i] >= maxCols) {
        maxCols = span_table[i];
        maxCols_i = i;
      }
    }

    var x_coords = []; //coordinates for the columns      
    x_coords[0] = 0;
    var sum = 0;

    for (i = 0; i < maxCols; i++) {
      x_coords[i + 1] = col_widths[maxCols_i][i] + sum;
      sum += col_widths[maxCols_i][i];
    }

    var min = 10000; // minimum height of cell in a row, initializing so that the values are smaller for sure
    var y_coords = []; //coordinates for the rows      
    var minimum_row_heights = [];
    y_coords[0] = 0;
    sum = 0;

    for (i = 0; i < row_heights.length; i++) {
      for (ii = 0; ii < row_heights[i].length; ii++) {
        if (row_heights[i][ii] <= min) {
          min = row_heights[i][ii];
        }
      }
      y_coords[i + 1] = min + sum;
      minimum_row_heights[i] = min; //What if there are empty rows?
      sum += min;
      min = 10000;
    }

    span_table = []; // rowCount-by-maxCols matrix in 1D array

    //initialize all slots as FREE
    for (i = 0; i < maxCols * rowCount; i++) {
      span_table[i] = 'F';
    }

    var current_index = 0;

    for (i = 0; i < cell_params.length; i++) {
      if (cell_params[i].cspan) {
        for (ii = 1; ii < cell_params[i].cspan; ii++) {
          span_table[current_index + ii] = 'R'; //slot is reserved due to col span 

          if (cell_params[i].rspan) {
            for (iii = 1; iii < cell_params[i].rspan; iii++) {
              span_table[current_index + ii + iii * maxCols] = 'R'; //slot is reserved due to row span 
            }
          }
        }
      }
      if (cell_params[i].rspan) {
        for (ii = 1; ii < cell_params[i].rspan; ii++) {
          span_table[current_index + ii * maxCols] = 'R'; //slot is reserved due to row span 
        }
      }

      for (ii = current_index + 1; ii < maxCols * rowCount; ii++) {
        if (Math.ceil((ii + 1) / maxCols) < cell_params[i + 1].ri + 1) {
          //Number of cells (TH or TD elements) on the row is smaller than maxCols. Setting empty slots as reserved.
          span_table[ii] = 'R';
          current_index = ii;
        } else {
          break;
        }
      }

      //seek next free slot and set current index accordingly
      for (ii = current_index; ii < maxCols * rowCount; ii++) {
        if (span_table[ii + 1] === 'F') {
          current_index = ii + 1;
          break;
        }
      }
    }

    min = 10000;

    for (i = 0; i < minimum_row_heights.length; i++) {
      if (minimum_row_heights[i] <= min) {
        min = minimum_row_heights[i];
      }
    }

    if (scaleBasis === 'font') {
      tableScaleFactor = min * 0.8 / fontSize;
    } else //default scaleBasis
      {
        var tableBodyWidth = $(table).prop("offsetWidth");
        tableBodyWidth = tableBodyWidth - (maxCols + 1) * 2; //each cell has 1pt margin, table frame has 1pt padding
        tableScaleFactor = tableBodyWidth / margins.width;
      }

    //uncomment following line if you want to center the table horizontally
    //x = (this.internal.pageSize.width - (tableBodyWidth / tableScaleFactor)) / 2;

    var top_x, top_y, x_index;
    ii = 0;

    for (i = 0; i < span_table.length; i++) {
      if (span_table[i] === 'F') //slot is free so lets put a cell in there!
        {
          x_index = Math.round(i / maxCols % 1 * maxCols); //resolve horizontal index of rowCount-by-maxCols matrix
          top_x = x_coords[x_index];
          top_y = y_coords[cell_params[ii].ri];

          if (cell_params[ii].rspan) {
            cell_params[ii].height = y_coords[cell_params[ii].ri + Number(cell_params[ii].rspan)] - top_y;
          }

          if (cell_params[ii].cspan) {
            cell_params[ii].width = x_coords[x_index + Number(cell_params[ii].cspan)] - top_x;
          }

          cell_table.push({ x: top_x / tableScaleFactor + x,
            y: top_y / tableScaleFactor + y,
            w: cell_params[ii].width / tableScaleFactor,
            h: cell_params[ii].height / tableScaleFactor,
            text: cell_params[ii].text,
            textalign: cell_params[ii].textalign,
            border: cell_params[ii].border,
            fontweight: cell_params[ii].fontweight,
            ri: cell_params[ii].ri,
            rowbgcolor: cell_params[ii].rowbgcolor,
            fontsize: fontSize });
          ii++;
        }
    }

    this.paginate(cell_table, y_coords[y_coords.length - 1] / tableScaleFactor);

    i = --ii;

    this.lastCellPos = { x: top_x / tableScaleFactor + x,
      y: top_y / tableScaleFactor + y,
      w: cell_params[i].width / tableScaleFactor,
      h: cell_params[i].height / tableScaleFactor,
      ln: cell_params[i].ri + 1 };

    return this;
  };

  jsPDFAPI.putSingleCell = function (x, y, w, h) {

    this.cell_2(x, y, w, h);
  };

  jsPDFAPI.putCells = function (cells, first, last, offset) {

    var x, y, w, h, index;

    x = cells[first].x;
    y = cells[first].y + offset;

    for (index = first; index < last; index++) {
      this.cell_2(cells[index].x, cells[index].y + offset, cells[index].w, cells[index].h, cells[index].text, cells[index].textalign, cells[index].border, cells[index].fontweight, cells[index].rowbgcolor, cells[index].fontsize);
    }

    index = index - 1;

    w = cells[index].x - cells[first].x + cells[index].w;
    h = cells[index].y - cells[first].y + cells[index].h;

    return [x, y, w, h];
  };

  jsPDFAPI.paginate = function (cells, total_table_height) {

    var margin_bottom = 0;
    var margin_top = 0;
    var margins = this.margins || NO_MARGINS;
    if (margins.bottom) {
      margin_bottom = margins.bottom;
    }
    if (margins.top) {
      margin_top = margins.top;
    }

    var page_table_height = 0;
    var index, index_2, i, current_page;
    var frame_coords = [];
    var page_h = this.internal.pageSize.height;
    var content_h = page_h - margin_bottom - margin_top;

    current_page = 1;
    while( cells[0].y > content_h * current_page )
      {
      current_page++;
      }

    var vertical_space_available = current_page * page_h - ((margin_bottom + margin_top) * current_page) - cells[0].y;

    //table fits on a single page, no need for multiple pages
    if (total_table_height <= vertical_space_available) {
      frame_coords = this.putCells(cells, 0, cells.length, margin_top - (content_h * (current_page - 1)) );
      this.putSingleCell(frame_coords[0], frame_coords[1], frame_coords[2], frame_coords[3]);
      return this;
    }

    //first page
    for (index = 0; page_table_height < vertical_space_available; index++) {
      page_table_height = cells[index].y + cells[index].h - cells[0].y;
    }
    index_2 = index - 1;
    frame_coords = this.putCells(cells, 0, index_2, margin_top - (content_h * (current_page - 1)));
    this.putSingleCell(frame_coords[0], frame_coords[1], frame_coords[2], frame_coords[3]);
    this.cellAddPage();

    //remaining pages
    var remaining_table_height = total_table_height - vertical_space_available;
    vertical_space_available = page_h - margin_bottom - margin_top;
    var remaining_page_count = Math.ceil(remaining_table_height / vertical_space_available);
    var row_index;

    //process all remaining pages but last
    for (i = 0; i < remaining_page_count - 1; i++) {
      page_table_height = 0;
      row_index = cells[index].ri;
      for (index = index; page_table_height < vertical_space_available && cells[index]; index++) {
        if (cells[index].ri === row_index) {
          page_table_height += cells[index].h;
          ++row_index;
        }
      }
      frame_coords = this.putCells(cells, index_2, index - 1, margin_top - cells[index_2].y);
      this.putSingleCell(frame_coords[0], frame_coords[1], frame_coords[2], frame_coords[3]);
      this.cellAddPage();
      index_2 = index - 1;
    }

    //last page
    frame_coords = this.putCells(cells, index - 1, cells.length, margin_top - cells[index].y);
    this.putSingleCell(frame_coords[0], frame_coords[1], frame_coords[2], frame_coords[3]);

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
                this.margins.top = margin;
                tableHeaderCell[1] = this.margins && this.margins.top || 0;
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
