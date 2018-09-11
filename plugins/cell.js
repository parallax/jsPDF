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

/**
* @name cell
* @module
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

    /**
    * @name setHeaderFunction
    * @function
    * @param {function} func
    */
    jsPDFAPI.setHeaderFunction = function (func) {
        headerFunction = func;
    };

    /**
    * @name getTextDimensions
    * @function
    * @param {string} txt
    * @returns {Object} dimensions
    */
    jsPDFAPI.getTextDimensions = function (text, options) {
        var fontSize = this.table_font_size || this.internal.getFontSize();
        var fontStyle = this.internal.getFont().fontStyle;
        options = options || {};
        var scaleFactor = options.scaleFactor || this.internal.scaleFactor;
        var width = 0;
        var amountOfLines = 0;
        var height = 0;
        var tempWidth = 0;
        var tempHeight = 0;
        
        if (typeof text === 'string') {
            width = this.getStringUnitWidth(text) * fontSize;
            if (width !== 0) {
                amountOfLines = 1;
            }
        } else if (Object.prototype.toString.call(text) === '[object Array]') {
            for ( var i = 0; i < text.length; i++) {
                tempWidth = this.getStringUnitWidth(text[i]) * fontSize;
                if (width < tempWidth) {
                    width = tempWidth;
                }
            }
            if (width !== 0) {
                amountOfLines = text.length;
            }
        } else {
            console.error('getTextDimensions expects text-parameter to be of type String or an Array of Strings.');
        }

        width = width / scaleFactor;
        height = amountOfLines * fontSize * 1.15 / scaleFactor;
        return { w: width, h: height};
    };

    /**
    * @name cellAddPage
    * @function
    */
    jsPDFAPI.cellAddPage = function () {
        var margins = this.margins || NO_MARGINS;

        this.addPage();

        setLastCellPosition(margins.left, margins.top, undefined, undefined);
        //setLastCellPosition(undefined, undefined, undefined, undefined, undefined);
        pages += 1;
    };

    /**
    * @name cellInitialize
    * @function
    */
    jsPDFAPI.cellInitialize = function () {
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined };
        pages = 1;
    };

    /**
    * @name cell
    * @function
    * @param {number} x
    * @param {number} y
    * @param {number} w
    * @param {number} h
    * @param {string} txt
    * @param {number} ln lineNumber
    * @param {string} align
    * @return {jsPDF} jsPDF-instance
    */
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
                if ((curCell.y + curCell.h + h + margin) >= this.internal.pageSize.getHeight() - margins.bottom) {
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

    /**
     * Return the maximum value from an array
     * 
     * @name arrayMax
     * @function 
     * @param {Array} array
     * @param comparisonFn
     * @returns {number}
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
     * @name table
     * @function
     * @param {Integer} [x] : left-position for top-left corner of table
     * @param {Integer} [y] top-position for top-left corner of table
     * @param {Object[]} [data] As array of objects containing key-value pairs corresponding to a row of data.
     * @param {String[]} [headers] Omit or null to auto-generate headers at a performance cost

     * @param {Object} [config.printHeaders] True to print column headers at the top of every page
     * @param {Object} [config.autoSize] True to dynamically set the column widths to match the widest cell value
     * @param {Object} [config.margins] margin values for left, top, bottom, and width
     * @param {Object} [config.fontSize] Integer fontSize to use (optional)
     * @returns {jsPDF} jsPDF-instance
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

           margins.width = this.internal.pageSize.getWidth();

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
                columnMinWidths.push(this.getTextDimensions(headerPrompts[i] || header, {scaleFactor: 1}).w);
                column = columnMatrix[header];

                // get cell widths
                for (j = 0, cln = column.length; j < cln; j += 1) {
                    columnData = column[j];
                    columnMinWidths.push(this.getTextDimensions(columnData, {scaleFactor: 1}).w);
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
     * Calculate the height for containing the highest column
     *
     * @name calculateLineHeight
     * @function
     * @param {String[]} headerNames is the header, used as keys to the data
     * @param {Integer[]} columnWidths is size of each column
     * @param {Object[]} model is the line of data we want to calculate the height of
     * @returns {number} lineHeight
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
     *
     * @name setTableHeaderRow
     * @function
     * @param {Object[]} config
     * An array of cell configs that would define a header row: Each config matches the config used by jsPDFAPI.cell
     * except the ln parameter is excluded
     */
    jsPDFAPI.setTableHeaderRow = function (config) {
        this.tableHeaderRow = config;
    };

    /**
     * Output the store header row
     * 
     * @name printHeaderRow
     * @function
     * @param {number} lineNumber The line number to output the header at
     * @param {boolean} new_page 
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
