/**
 * jsPDF HTML Table PlugIn
 * Copyright (c) 2014 Djordje Ungar <mail@djordjeungar.com>
 *
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function(jsPDFAPI) {
	'use strict';

    var px2pt = 0.264583 * 72 / 25.4;
    var padding = 3;
    var margin = 20;
    /**
     * Removes trailing or leading space/tab characters
     * @param str {String}
     * @return {String}
     */
    function trim(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
    /**
     * Converts The String To Title Case 
     * @param str {String}
     * @return {String}
     */
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
    /**
     * Loops through Object elements and runs the callback on each element
     * @param o {Object}
     * @param callback {function(value, index, o){}}
     * @return [{}] An array of returns
     */
    function each(o, callback) {
        var returns = [];
        for (var i in o) {
            if (o.hasOwnProperty(i)){
                returns.push(callback(o[i], i, o));
            }
        }
        return returns;
    }
    function hex2rgb(hexcolor) {
        var color = {};
        if ((typeof hexcolor === 'string') && /^#[0-9A-Fa-f]{6}$/.test(hexcolor)) {
            var hex = parseInt(hexcolor.substr(1), 16);
            color.r = (hex >> 16) & 255;
            color.g = (hex >> 8) & 255;
            color.b = (hex & 255);
        }
        else {
            color.r = color.g = color.b = 0;
        }
        return color;
    }
    /**
     * Creates a 2D matrix and register each cell to a matrix cell, 
     * as if there was no colspan/rospan defined for any cell
     * 
     * @param table {HTMLElement} (either thead, tbody and tfoot)
     * @param options {Object} {
     *      @param width_scale_factor {Number} - scale factor to apply to the pixel width 
     *      @param formatText {function(String){return String}} - function to be applied to each cell text
     * }
     * @returns {[][Object]} An Array of Arrays of cell Objects
     */
    function createCellMatrix(table, options) {
        if (table) {
            options = options || {};
            var m = {};
            var scale_width = options.width_scale_factor || 1;
            var column_widths = {};

            var x, y, mx, my, xmax, ymax, $cell, cell, cspan, rspan, xo, txt;
            for (y = 0, ymax = table.rows.length; y < ymax; y++) {
                for (x = 0, xmax = table.rows[y].cells.length; x < xmax; x++) {
                    $cell = $(table.rows[y].cells[x]);
                    cspan = $cell.attr("colspan") | 0,
                    rspan = $cell.attr("rowspan") | 0;
                    cspan = cspan ? cspan : 1;
                    rspan = rspan ? rspan : 1;
                    if (options.formatText) {
                        txt = options.formatText($cell.text());
                    }
                    else {
                        txt = $cell.text();
                    }
                    cell = {
                        text: txt
                        ,cspan: cspan
                        ,rspan: rspan
                        ,width: Math.floor($cell.outerWidth() * scale_width * px2pt)
                        ,align: $cell.css('text-align') || 'center'
                    };
                    xo = x;
                    for ( ; m[y] && m[y][xo]; ++xo );  //skip already occupied cells in current row

                    /**
                     * There is a rounding error when we try to use cell widths 
                     * multiplied by scaling factor and pixel to point conversion factor.
                     * That's why we collect all non-spaned column widths, and then
                     * later re-calculate the colspaned columns widths.
                     */
                    if (cspan == 1 && !column_widths[xo]) {
                        column_widths[xo] = cell.width;
                    }

                    for ( mx = xo; mx < xo + cspan; ++mx ) {  //mark matrix elements occupied by current cell with true
                        for ( my = y; my < y + rspan; ++my ) {
                            if ( !m[my] ) {  //fill missing rows
                                m[my] = {};
                            }

                            if ( ! m[my][mx] ) {
                                m[my][mx] = cell;
                                if (cell.text) {
                                    cell = {
                                        text: false
                                        ,cspan: cell.cspan
                                        ,rspan: cell.rspan
                                        ,width: cell.width
                                        ,align: cell.align
                                    };
                                }
                            }
                        }
                    }
                }
            }
            // convert matrix object to an array of arrays, and fix column widths
            var matrix = each(m, function(v, i, o) {
                return each(v, function(sv, si, so) {
                    var x = parseInt(si,10);
                    if (sv.cspan > 1) {
                        sv.width = 0;
                        for (var i=0; i < sv.cspan; i++) {
                            sv.width += column_widths[x+i];
                        }
                    }
                    else {
                        sv.width = column_widths[x];
                    }
                    return sv;
                });
            });
            return matrix;
        }
        return false;
    }

    /**
     * Adds a new page, resets the cursor position, and optionally prints table headers
     * @returns {jsPDF}
     */
	jsPDFAPI.newPage = function() {
        this.addPage();
        this.moveTo(this.margins.left, this.margins.top);
        if (this.thead.matrix) {
            this.renderTableMatrix(this.thead.matrix, this.thead || this.tbody);
        }
        return this;
    };

    /**
     * Sets the internal cursor position.
     * @param x  {Number} The horizontal position
     * @param y  {Number} The vertical position
     * @returns {jsPDF}
     */
	jsPDFAPI.moveTo = function(x, y) {
        if (!this.cursor) {
            this.cursor = {};
        }
        this.cursor.x = x;
        this.cursor.y = y;
        return this;
    };

    /**
     * Store the font and drawing styles
     * @param name  {String} The name of the style setting
     * @param value {Mixed} The value of the style setting
     * @returns {jsPDF}
     */
    var style = {};
    jsPDFAPI.setStyle = function(name, value) {
        if (value === undefined) {
            for (var i in name) {
                if (name.hasOwnProperty(i)) {
                    this.setStyle(i, name[i]);
                }
            }
            return this;
        }
        
        switch (name) {
            case 'fontName':
                style[name] = value;
                return this.setFont(value);
            case 'fontSize':
                style[name] = value;
                return this.setFontSize(value);
            case 'fontStyle':
                style[name] = value;
                return this.setFontStyle(value);
            case 'fontColor':
                style[name] = value;
                return this.setTextColor(value);
            case 'fillColor':
                style[name] = value;
                if (value) {
                    value = hex2rgb(value);
                    return this.setFillColor(value.r, value.g, value.b);
                }
                break;
            case 'lineColor':
                style[name] = value;
                if (value) {
                    value = hex2rgb(value);
                    return this.setDrawColor(value.r, value.g, value.b);
                }
                break;
            case 'align':
                style[name] = value;
                break;
        }
        return this;
    };
    /**
     * Get the font and drawing styles
     * @param name  {String} The name of the style setting
     * @returns {Object} The value of the style setting
     */
    jsPDFAPI.getStyle = function(name) {
        if (name === undefined) {
            return $.extend({}, style);
        }
        if (style.hasOwnProperty(name)) {
            return style[name];
        }
        return undefined;
    };

    /**
     * Pushes the current font and drawing styles onto the stack.
     * @returns {jsPDF}
     */
    var contexts;
    jsPDFAPI.saveStyles = function() {
        if ( ! contexts ) {
            contexts = [];
        }
        contexts.push($.extend({}, style));
        return this;
    };
    /**
     * Pops the font and drawing styles from the stack, and sets the styles.
     * @returns {jsPDF}
     */
    jsPDFAPI.restoreStyles = function() {
        if (contexts && contexts.length ) {
            this.setStyle(contexts.pop());
        }
        return this;
    };
    /**
     * Renders the table portion.
     * @param matrix {[][Object]} An array of arrays of cells, usually the return of {createCellMatrix()}
     * @returns {jsPDF}
     */
	jsPDFAPI.renderTableMatrix = function(matrix, options) {
        var x, y, cell, line_height, cell_indexes, cell_widths, cell_texts, txt, i, cursor = this.cursor;

        options = $.extend({}, this.tbody, options || {});

        this.saveStyles();
        this.setStyle(options);

        var style = '';
        if (options.fillColor && options.lineColor) {
            style = 'FD';
        }
        else if (options.fillColor) {
            style = 'F';
        }
        else if (options.lineColor) {
            style = 'S';
        }

        var getIndexes = function(val, i) { return i;};
        var getWidths  = function(val, i) { return val.width;};
        var getTexts   = function(val, i) { return val.text || '';};

        for (y = 0; y < matrix.length; y++) {

            cell_indexes = each(matrix[y], getIndexes);
            cell_widths  = each(matrix[y], getWidths);
            cell_texts   = each(matrix[y], getTexts);
            line_height = this.calculateLineHeight(cell_indexes, cell_widths, cell_texts);

            for (x = 0; x < matrix[y].length; x++) {
                cell = matrix[y][x];

                if (cell.text !== false) {
                    if (style !== '') {

                        if (false || options.fillColor) {
                            // I don't know why but it needs to be reset
                            this.setStyle('fillColor', options.fillColor);
                        }
                        this.rect(cursor.x, cursor.y, cell.width, line_height * cell.rspan, style);
                    }
                    txt = cell_texts[x];
                    switch (options.align || cell.align) {
                        case 'right':
                            if (!(txt instanceof Array)) {
                                txt = [txt];
                            }
                            for (i = 0; i < txt.length; i++) {
                                var textSize = this.getStringUnitWidth(txt[i]) * this.internal.getFontSize();
                                this.text(txt[i], cursor.x + cell_widths[x] - textSize - padding, cursor.y + this.internal.getLineHeight()*(i+1));
                            }
                            break;
                        case 'center':
                            if (!(txt instanceof Array)) {
                                txt = [txt];
                            }
                            for (i = 0; i < txt.length; i++) {
                                var textSize = this.getStringUnitWidth(txt[i]) * this.internal.getFontSize();
                                this.text(txt[i], cursor.x + (cell_widths[x] - textSize)/2, cursor.y + this.internal.getLineHeight()*(i+1));
                            }
                            break;
                        default:
                            // 'left'
                            this.text(txt, cursor.x + padding, cursor.y + this.internal.getLineHeight());
                    }

                    cursor.x += cell_widths[x];
                }
                else if (cell.rspan > 1) {
                    cursor.x += cell_widths[x];
                }
            }
            cursor.y += line_height;
            cursor.x = this.margins.left;

            if ((cursor.y + line_height + margin) >= this.internal.pageSize.height - this.margins.bottom) {
                this.newPage();
            }
        }
        this.cursor = cursor;
        this.restoreStyles();

        return this;
    };

    /**
     * Parse and the render the html table object to jsPDF
	 * @example 
     *
     *       var options = {
     *           fit_to_page: true // will scale the table to fit the page width
     *           ,tbody: {
     *               fontName: 'helvetica'
     *               ,fontSize: 8
     *               ,fontColor: '#000000'
     *           }
     *           ,thead: {
     *               repeatOnEveryPage: true
     *               ,toTitleCase: true
     *               ,fontStyle: 'bold'
     *               ,fillColor: '#DADADA' // http://youtu.be/lNYcviXK4rg
     *               ,fontColor: '#000000'
     *           }
     *           ,margins: {
     *               bottom: 12
     *           }
     *       }
     *       doc.htmlTable(x, y, document.getElementById('#yourtable'), options);
     *       doc.save(filename);
     *       
     * @param x  {Number} The horizontal position
     * @param y  {Number} The vertical position
     * @param table  {HTMLElement} The table element to parse
     * @param {Object[]} config
     * @returns {jsPDF}
     */
	jsPDFAPI.htmlTable = function(x, y, table, options) {
		'use strict';

        if (!table) {
            throw 'No data for PDF table';
        }

        options = options || {};

        this.margins = {
            left:    x
            ,top:    margin
            ,bottom: margin
            ,right:  margin
        };
        if (options['margins']) {
            this.margins.left   = (options.margins.left   === undefined) ? this.margins.left   : options.margins.left;
            this.margins.top    = (options.margins.top    === undefined) ? this.margins.top    : options.margins.top;
            this.margins.bottom = (options.margins.bottom === undefined) ? this.margins.bottom : options.margins.bottom;
            this.margins.right  = (options.margins.right  === undefined) ? this.margins.right  : options.margins.right;
        }
        this.margins.width = this.internal.pageSize.width - this.margins.left - this.margins.right;


        var tbody_options = options['tbody'] || {};
        this.tbody = {
            fontName:   tbody_options['fontName']  || 'helvetica'
            ,fontSize:  tbody_options['fontSize']  || 10
            ,fontStyle: tbody_options['fontStyle'] || 'normal'
            ,fontColor: tbody_options['fontColor'] || '#000000'
            ,fillColor: tbody_options['fillColor'] || false
            ,lineColor: tbody_options['lineColor'] || '#000000'
            ,align: tbody_options['align'] || false
        };

        var thead_options = options['thead'] || {};
        this.thead = {
            fontName:   thead_options['fontName']  || this.tbody.fontName
            ,fontSize:  thead_options['fontSize']  || this.tbody.fontSize
            ,fontStyle: thead_options['fontStyle'] || this.tbody.fontStyle
            ,fontColor: thead_options['fontColor'] || this.tbody.fontColor
            ,fillColor: thead_options['fillColor'] || this.tbody.fillColor
            ,lineColor: thead_options['lineColor'] || this.tbody.lineColor
            ,repeatOnEveryPage:   thead_options['repeatOnEveryPage'] || false
            ,align: thead_options['align'] || false
        };

        var tfoot_options = options['tfoot'] || {};
        this.tfoot = {
            fontName:   tfoot_options['fontName']  || this.tbody.fontName
            ,fontSize:  tfoot_options['fontSize']  || this.tbody.fontSize
            ,fontStyle: tfoot_options['fontStyle'] || this.tbody.fontStyle
            ,fontColor: tfoot_options['fontColor'] || this.tbody.fontColor
            ,fillColor: tfoot_options['fillColor'] || this.tbody.fillColor
            ,lineColor: thead_options['lineColor'] || this.tbody.lineColor
            ,align: tfoot_options['align'] || false
        };

        var $table = $(table);
        var matrix_options = {};
        if (options.fit_to_page) {
            // We will asume that you want the table to be stretched to the longer side (297mm) of A4
            // A4 = 8.27x11.69" x72points/inch = 595x842 points
            // 842 / 75 * 100 = 1122.66.. px
            var available_width = 1122 - (this.margins.left+this.margins.right)/px2pt;
            matrix_options.width_scale_factor = available_width/$table.width();
        }
        matrix_options.formatText = trim;
        var body = createCellMatrix($table.find('tbody').get(0), matrix_options);
        var foot = createCellMatrix($table.find('tfoot').get(0), matrix_options);
        if (options['thead'] && options['thead']['toTitleCase']) {
            matrix_options.formatText = toTitleCase;
        }
        var head = createCellMatrix($table.find('thead').get(0), matrix_options);
        if (this.thead && this.thead.repeatOnEveryPage) {
            this.thead.matrix = head;
        }

        this.cursor = {};
        this.moveTo(x, y);

        this.setStyle(this.tbody);

        this.renderTableMatrix(head, this.thead);
        this.renderTableMatrix(body, this.tbody);
        this.renderTableMatrix(foot, this.tfoot);

        $table = null;
		return this;
	};
})(jsPDF.API);
