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

    jsPDFAPI.getTextDimentions = function (txt) {
        fontName = this.internal.getFont().fontName;
        fontSize = this.internal.getFontSize();
        fontStyle = this.internal.getFont().fontStyle;
        var px2pt = 1.545454545454545454545454, text = $('<font id="jsPDFCell" style="font-family: ' + fontName + ';font-size:' + fontSize + 'pt;font-style: ' + fontStyle + ';" hidden>' + txt + '</font>').appendTo('body'),
            dimentions = { w: text.width() / px2pt, h: text.height() / px2pt};
        text.remove();
        return dimentions;
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
    
    /* sample how to make a table
    
    var doc = new jsPDF('p', 'pt');
    var i, j, k;
    doc.cellInitialize();
    for (i = 1,k = 1; i <= 100; i++ ){
        for (j = 1; j <= 4; j++) {
            doc.cell(10, 40, 100, 20, 'Cell '+k, i);
            k++;
        }
    }
    doc.save('Test.pdf');
    var doc2 = new jsPDF('p', 'pt');
    var i, j = 0;
    doc2.cellInitialize();
    for (i = 1,k = 1; i <= 100; i++ ){
        doc2.cell(10, 40, 100, 20, 'Cell '+k, i);
        k++;
        doc2.cell(10, 40, 150, 20, 'Cell '+k, i);
        k++;
        doc2.cell(10, 40, 90, 20, 'Cell '+k, i);
        k++;
        doc2.cell(10, 40, 150, 20, 'Cell '+k, i);
        k++;
    }
    doc2.save('Test.pdf');
        
    */
    
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
        var curCell = this.getLastCellPosition(),
            dim = this.getTextDimentions(txt);
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
