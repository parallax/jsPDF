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

    var maxLn = 0,
        fontName,
        fontSize,
        fontStyle,
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined },
        pages = 1;
    
    jsPDFAPI.setLastCellPosition = function (x, y, w, h, ln) {
        lastCellPos = { x: x, y: y, w: w, h: h, ln: ln };
    };
    
    jsPDFAPI.getLastCellPosition = function () {
        return lastCellPos;
    };

    jsPDFAPI.setMaxLn = function (x) {
        maxLn = x;
    };
    
    jsPDFAPI.getMaxLn = function () {
	    return maxLn;
    };

    jsPDFAPI.getTextDimensions = function (txt) {
        fontName = this.internal.getFont().fontName;
        fontSize = this.internal.getFontSize();
        fontStyle = this.internal.getFont().fontStyle;
        var px2pt = 1.545454545454545454545454,
            dimensions,
            text;

        text = document.createElement('font');
        text.id = "jsPDFCell";
        text.style = "font-family: ' + fontName + ';font-size:' + fontSize + 'pt;font-style: ' + fontStyle + ';";
        text.innerText = txt;

        document.body.appendChild(text);

        dimensions = { w: text.offsetWidth / px2pt, h: text.offsetHeight / px2pt};

        document.body.removeChild(text);

        return dimensions;
    };

    jsPDFAPI.cellAddPage = function () {
        this.addPage();
        pages += 1;
    };

    jsPDFAPI.cellInitialize = function () {
        maxLn = 0;
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined };
        pages = 1;
    };

    jsPDFAPI.cell = function (x, y, w, h, txt, ln) {
        if(this.printingHeaderRow !== true && this.lnMod !== 0){
            ln = ln + this.lnMod;
        }

        if ((((ln * h) + y + (h * 2)) / pages) >= this.internal.pageSize.height && pages === 1) {
            this.cellAddPage();
            if(this.printHeaders && this.tableHeaderRow){
                this.printHeaderRow(ln);
                this.lnMod++;
                ln++;
            }
            this.setLastCellPosition(undefined, undefined, undefined, undefined, undefined);
            if (this.getMaxLn() === 0) {
                this.setMaxLn(ln);
            }
        } else if (pages > 1 && this.getMaxLn() === ln / pages) {
            this.cellAddPage();
            if(this.printHeaders && this.tableHeaderRow){
                this.printHeaderRow(ln);
                this.lnMod++;
                ln++;
            }

            this.setLastCellPosition(undefined, undefined, undefined, undefined, undefined);
        }
        var curCell = this.getLastCellPosition();

        if (curCell.x !== undefined && curCell.ln === ln) {
            x = curCell.x + curCell.w;
            if (curCell.y !== undefined && curCell.y === y) {
                y = curCell.y;
            }
            if (curCell.h !== undefined && curCell.h === h) {
                h = curCell.h;
            }
            if (curCell.ln !== undefined && curCell.ln === ln) {
                ln = curCell.ln;
            }
        }
        this.rect(x, (y + (h * Math.abs(this.getMaxLn() * pages - ln - this.getMaxLn()))), w, h);
        this.text(txt, x + 3, ((y + (h * Math.abs(this.getMaxLn() * pages - ln - this.getMaxLn()))) + h - 3));
        this.setLastCellPosition(x, y, w, h, ln);
        return this;
    };


    /**
     * Create a table from an {#Ext.data.Store} or a set of data.
     * @param dataSet {Ext.data.Model[]|Ext.data.Store}
     * @param [headers] {Array} Omit or null to auto-generate headers at a performance cost
     * @param [autoSize=true] {Boolean}
     */
    jsPDFAPI.table = function(dataSet, headers, config){

        var models;

        this.lnMod = 0;

        if(config){
            var autoSize        = config.autoSize || false,
                printHeaders    = this.printHeaders = config.printColumnHeaders || true,
                autoStretch     = config.autoStretch || true;
        }

        if(!dataSet){
            Ext.Error.raise('No data for PDF table');
        }

        if(dataSet.isStore){
            var isStore = true;
            models = dataSet.data.items;
        } else {
            models = dataSet;
        }

        // Set headers
        if(headers === undefined || (headers === null)){
            // No headers defined so we derive from data
            if(isStore){
                headers = Ext.Array.pluck(dataSet.model.getFields(), 'name');
            } else {
                headers = Ext.Object.getKeys(models[0]);
            }
//            console.log(headers);
        }

        // Create Columns Matrix
        var columnMatrix = {},
            columnWidths = {},
            index,
            columnData,
            TextMetrics = new Ext.util.TextMetrics();

        for (var i = 0, ln = headers.length; i < ln; i++) {
            index = headers[i];
            columnMatrix[index] = Ext.Array.map(models, function(rec){
                debugger;
                if(!rec.get){
                    console.log(rec.$className);
                }
                return rec.get(index);
            });

            var columnMinWidths = [], column;

            // get header width
            columnMinWidths.push(this.getTextDimensions(index).w);
//            columnMinWidths.push(TextMetrics.getWidth(index)/3.7795275593333);

            column = columnMatrix[index];

            // Get cell widths
            for (var j = 0, ln = columnMatrix[index].length; j < ln; j++) {
                columnData = columnMatrix[index][j];
                columnMinWidths.push(this.getTextDimensions(columnData).w);

//                columnMinWidths.push(TextMetrics.getWidth(columnData)/3.7795275593333);
            }

            // get final column width
            columnWidths[index] = Ext.Array.max(columnMinWidths);
        }

        // Construct the table

        // Construct the header row
        var header, tableHeaderConfigs = [];
        for (var i = 0, ln = headers.length; i < ln; i++) {
            header = headers[i];
            tableHeaderConfigs.push([10, 10, columnWidths[header], 25, String(header)]);
        }

        this.setTableHeaderRow(tableHeaderConfigs);

        this.printHeaderRow(1);

        // Construct the data rows
        var record;

        for (var i = 0, ln = models.length; i < ln; i++) {
            record = models[i];

            for (var j = 0, jln = headers.length; j < jln; j++) {
                index = headers[j];
                this.cell(10, 10, columnWidths[index], 25, String(record.get(index)), i+2);
            }
        }

        return this;
    };

    jsPDFAPI.setTableHeaderRow = function(config){
        this.tableHeaderRow = config;
    };

    jsPDFAPI.printHeaderRow = function(lineNumber){
        this.printingHeaderRow = true;
        for (var i = 0, ln = this.tableHeaderRow.length; i < ln; i++) {
            var tableHeaderCell = this.tableHeaderRow[i];
            var tmp = [].concat(tableHeaderCell);
            tmp = tmp.concat(lineNumber);
            this.cell.apply(this,tmp);
        }
        this.printingHeaderRow = false;
    };

})(jsPDF.API);
