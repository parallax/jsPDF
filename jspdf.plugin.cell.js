/** ==================================================================== 
 * jsPDF Cell plugin
 * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
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

    var maxLn = 0,
        lnP = 0,
        fontName,
        fontSize,
        fontStyle,
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined },
        pages = 1,
        newPage = false,
        setLastCellPosition = function (x, y, w, h, ln) {
            lastCellPos = { x: x, y: y, w: w, h: h, ln: ln };
        },
        getLastCellPosition = function () {
            return lastCellPos;
        },
        setMaxLn = function (x) {
            maxLn = x;
        },
        getMaxLn = function () {
            return maxLn;
        },
        setLnP = function (x) {
            lnP = x;
        },
        getLnP = function (x) {
            return lnP;
        };

    jsPDFAPI.getTextDimensions = function (txt) {
        fontName = this.internal.getFont().fontName;
        fontSize = this.internal.getFontSize();
        fontStyle = this.internal.getFont().fontStyle;

        // 1 pixel = 0.264583 mm and 1 mm = 72/25.4 point
        var px2pt = 0.264583 * 72 / 25.4,
            dimensions,
            text;

        text = document.createElement('font');
        text.id = "jsPDFCell";
        text.style.fontStyle = fontStyle;
        text.style.fontName = fontName;
        text.style.fontSize = fontSize + 'pt';
        text.innerText = txt;

        document.body.appendChild(text);

        dimensions = { w: (text.offsetWidth + 1) * px2pt, h: (text.offsetHeight + 1) * px2pt};

        document.body.removeChild(text);

        return dimensions;
    };

    jsPDFAPI.cellAddPage = function () {
        this.addPage();
        setLastCellPosition(undefined, undefined, undefined, undefined, undefined);
        newPage = true;
        pages += 1;
        setLnP(1);
    };

    jsPDFAPI.cellInitialize = function () {
        maxLn = 0;
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined };
        pages = 1;
        newPage = false;
        setLnP(0);
    };

    jsPDFAPI.cell = function (x, y, w, h, txt, ln) {
        this.lnMod = this.lnMod === undefined ? 0 : this.lnMod;
        if (this.printingHeaderRow !== true && this.lnMod !== 0) {
            ln = ln + this.lnMod;
		}

        if ((((ln * h) + y + (h * 2)) / pages) >= this.internal.pageSize.height && pages === 1 && !newPage) {
            this.cellAddPage();

            if (this.printHeaders && this.tableHeaderRow) {
                this.printHeaderRow(ln);
                this.lnMod += 1;
                ln += 1;
            }
            if (getMaxLn() === 0) {
                setMaxLn(Math.round((this.internal.pageSize.height - (h * 2)) / h));
            }
        } else if (newPage && getLastCellPosition().ln !== ln && getLnP() === getMaxLn()) {
            this.cellAddPage();

            if (this.printHeaders && this.tableHeaderRow) {
                this.printHeaderRow(ln);
                this.lnMod += 1;
                ln += 1;
            }
        }

        var curCell = getLastCellPosition(),
            dim = this.getTextDimensions(txt),
            isNewLn = 1;
        if (curCell.x !== undefined && curCell.ln === ln) {
            x = curCell.x + curCell.w;
		}
        if (curCell.y !== undefined && curCell.y === y) {
            y = curCell.y;
        }
        if (curCell.h !== undefined && curCell.h === h) {
            h = curCell.h;
        }
        if (curCell.ln !== undefined && curCell.ln === ln) {
            ln = curCell.ln;
            isNewLn = 0;
        }
        if (newPage) {
            y = h * (getLnP() + isNewLn);
        } else {
            y = (y + (h * Math.abs(getMaxLn() * pages - ln - getMaxLn())));
        }
        this.rect(x, y, w, h);
        this.text(txt, x + 3, y + h - 3);
        setLnP(getLnP() + isNewLn);
        setLastCellPosition(x, y, w, h, ln);
        return this;
    };

    /**
     * Return an array containing all of the owned keys of an Object
     * @type {Function}
     * @return {String[]} of Object keys
     */
    jsPDFAPI.getKeys = (typeof Object.keys === 'function')
        ? function (object) {
            if (!object) {
                return [];
            }
            return Object.keys(object);
        }
            : function (object) {
            var keys = [],
                property;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    keys.push(property);
                }
            }

            return keys;
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
     * @param {Object[]} data As array of objects containing key-value pairs
     * @param {String[]} [headers] Omit or null to auto-generate headers at a performance cost
     * @param {Object} [config.printHeaders] True to print column headers at the top of every page
     * @param {Object} [config.autoSize] True to dynamically set the column widths to match the widest cell value
     * @param {Object} [config.autoStretch] True to force the table to fit the width of the page
     */
    jsPDFAPI.table = function (data, headers, config) {

        var headerNames = [],
            headerPrompts = [],
            header,
            autoSize,
            printHeaders,
            autoStretch,
            i,
            ln,
            columnMatrix = {},
            columnWidths = {},
            columnData,
            column,
            columnMinWidths = [],
            j,
            tableHeaderConfigs = [],
            model,
            jln,
            func;

        /**
         * @property {Number} lnMod
         * Keep track of the current line number modifier used when creating cells
         */
        this.lnMod = 0;

        if (config) {
            autoSize        = config.autoSize || false;
            printHeaders    = this.printHeaders = config.printHeaders || true;
            autoStretch     = config.autoStretch || true;
        }

        if (!data) {
            throw 'No data for PDF table';
        }

        // Set headers
        if (headers === undefined || (headers === null)) {

            // No headers defined so we derive from data
            headerNames = this.getKeys(data[0]);

        } else if (headers[0] && (typeof headers[0] !== 'string')) {

            // Split header configs into names and prompts
            for (i = 0, ln = headers.length; i < ln; i += 1) {
                header = headers[i];
                headerNames.push(header.name);
                headerPrompts.push(header.prompt);
            }

        } else {
            headerNames = headers;
        }

        if (config.autoSize) {

            // Create Columns Matrix
            
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
                for (j = 0, ln = column.length; j < ln; j += 1) {
                    columnData = column[j];

                    columnMinWidths.push(this.getTextDimensions(columnData).w);
                }

                // get final column width
                columnWidths[header] = jsPDFAPI.arrayMax(columnMinWidths);
            }
        }

        // -- Construct the table

        if (config.printHeaders) {

            // Construct the header row
            for (i = 0, ln = headerNames.length; i < ln; i += 1) {
                header = headerNames[i];
                tableHeaderConfigs.push([10, 10, columnWidths[header], 25, String(headerPrompts.length ? headerPrompts[i] : header)]);
            }

            // Store the table header config
            this.setTableHeaderRow(tableHeaderConfigs);

            // Print the header for the start of the table
            this.printHeaderRow(1);
        }

        // Construct the data rows
        for (i = 0, ln = data.length; i < ln; i += 1) {
            model = data[i];

            for (j = 0, jln = headerNames.length; j < jln; j += 1) {
                header = headerNames[j];
                this.cell(10, 10, columnWidths[header], 25, String(model[header]), i + 2);
            }
        }

        return this;
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
    jsPDFAPI.printHeaderRow = function (lineNumber) {
        if (!this.tableHeaderRow) {
            throw 'Property tableHeaderRow does not exist.';
        }

        var tableHeaderCell,
            tmpArray,
            i,
            ln;

        this.printingHeaderRow = true;

        for (i = 0, ln = this.tableHeaderRow.length; i < ln; i += 1) {

            tableHeaderCell = this.tableHeaderRow[i];
            tmpArray        = [].concat(tableHeaderCell);

            this.cell.apply(this, tmpArray.concat(lineNumber));
        }

        this.printingHeaderRow = false;
    };

}(jsPDF.API));
