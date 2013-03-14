/**
 * @class
 * @author      Lee Driscoll
 * @docauthor   Lee Driscoll
 *
 * Date         14/03/13
 *
 * Enter description of class here using markdown
 */
(function (jsPDFAPI) {
    'use strict';

    /**
     * Create a table from an {#Ext.data.Store} or a set of data.
     * @param data {Ext.data.Model[]|Ext.data.Store}
     * @param [headers] {Array} Omit or null to auto-generate headers at a performance cost
     * @param [autoSize=true] {Boolean}
     */
    jsPDFAPI.table = function(dataSet, headers, config){

        var models;

        if(config){
            var autoSize        = config.autoSize || false,
                printHeaders    = config.printColumnHeaders || true,
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
            console.log(headers);
        }



        // Create Columns Matrix
        var columnMatrix = {}, columnWidths = {}, index, columnData;

        var TextMetrics = new Ext.util.TextMetrics();

        for (var i = 0, ln = headers.length; i < ln; i++) {
            index = headers[i];
            columnMatrix[index] = Ext.Array.map(models, function(rec){
                return rec.get(index);
            });

            var columnMinWidths = [], column;

            // get header width
//            columnMinWidths.push(this.getTextDimensions(index).w);
            columnMinWidths.push(TextMetrics.getWidth(index));


            column = columnMatrix[index];

            // Get cell widths
            for (var j = 0, ln = columnMatrix[index].length; j < ln; j++) {
                columnData = columnMatrix[index][j];
//                columnMinWidths.push(this.getTextDimensions(columnData).w);
                columnMinWidths.push(TextMetrics.getWidth(columnData));
            }

            // get final column width
            columnWidths[index] = Ext.Array.max(columnMinWidths);
        }

        console.log(columnWidths);

        // Construct the table

        // Construct the header row
        var header;
        for (var i = 0, ln = headers.length; i < ln; i++) {
            header = headers[i];
            this.setTableHeaderRow(10, 40, columnWidths[header], 25, String(header), 1);
        }

        // Construct the data rows
        var record;

        for (var i = 0, ln = models.length; i < ln; i++) {
            record = models[i];

            for (var j = 0, jln = headers.length; j < jln; j++) {
                index = headers[j];
                this.cell(10, 40, columnWidths[index], 25, String(record.get(index)), i+2);
            }
        }

        return this;
    };

    jsPDFAPI.setTableHeaderRow = function(config){
        this.tableHeaderRow = config;
    };

    jsPDFAPI.cell = function (x, y, w, h, txt, ln) {
        if ((((ln * h) + y + (h * 2)) / pages) >= this.internal.pageSize.height && pages === 1) {
            this.cellAddPage();
            this.setLastCellPosition(undefined, undefined, undefined, undefined, undefined);
            if (this.getMaxLn() === 0) {
                this.setMaxLn(ln);
            }
        } else if (pages > 1 && this.getMaxLn() === ln / pages) {
            this.cellAddPage();
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
})(jsPDF.API);