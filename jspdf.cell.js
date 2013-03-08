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

    var curLn,
        fontName,
        fontSize,
        fontStyle,
        lastCellPos = { x: undefined, w: undefined, h: undefined, ln: undefined };
    
    jsPDFAPI.setLastCellPosition = function (x, w, h, ln) {
        lastCellPos = { x: x, w: w, h: h, ln: ln };
    };
    
    jsPDFAPI.getLastCellPosition = function () {
        return lastCellPos;
    };

    jsPDFAPI.setCurLn = function (x) {
        curLn = x;
    };
    
    jsPDFAPI.getCurLn = function () {
	    return curLn;
    };

    jsPDFAPI.getTextDimentions = function (txt) {
        fontName = this.internal.getFont().fontName;
        fontSize = this.internal.getFontSize();
        fontStyle = this.internal.getFont().fontStyle;
        var px2pt = 1.545454545454545454545454, text = $('<span id="jsPDFCell" style="font-family: ' + fontName + ';font-size:' + fontSize + 'pt;font-style: ' + fontStyle + ';">' + txt + '</span>').appendTo('body'),
            dimentions = { w: text.width() / px2pt, h: text.height() / px2pt};
        text.remove();
        return dimentions;
    };
    
    jsPDFAPI.cell = function (x, y, w, h, txt, ln) {
        if ((ln * h) >= this.internal.pageSize.height) {
            this.addPage();
            this.setLastCellPosition(undefined, undefined, undefined, undefined);
        }
        var start = { x: undefined, w: undefined, h: undefined, ln: undefined },
            curCell = this.getLastCellPosition(),
            dim = this.getTextDimentions(txt);
        if (curCell.x !== start.x && curCell.ln === ln) {
            x = curCell.x + w;
        }
        if (curCell.h !== start.h) {
            h = curCell.h;
        }
        if (curCell.ln !== start.ln && curCell.ln === ln) {
            ln = curCell.ln;
        }
        this.rect(x, y + (h * ln), w, h);
        this.text(txt, x + 3, y + (h * ln) + ((dim.h + h) / 2));
        this.setLastCellPosition(x, w, h, ln);
        return this;
    };

})(jsPDF.API);
