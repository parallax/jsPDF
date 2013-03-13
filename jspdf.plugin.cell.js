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
        if ((((ln * h) + y + (h * 2)) / pages) >= this.internal.pageSize.height && pages === 1 && !newPage) {
            this.cellAddPage();
            if (getMaxLn() === 0) {
                setMaxLn(Math.round((this.internal.pageSize.height - (h * 2)) / h));
            }
        } else if (newPage && getLastCellPosition().ln !== ln && getLnP() === getMaxLn()) {
            this.cellAddPage();
        }
        var curCell = getLastCellPosition(),
            dim = this.getTextDimentions(txt),
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
    
    jsPDFAPI.table = function (x, y, w, h, data) {
        var header = 0,
            content = 0;
        if (typeof data === 'object') {
            header = typeof data.header === 'object' ? data.header : 0;
            content = typeof data.content === 'object' ? data.content : 0;
        } else {
            
            return;
        }
        this.cellInitialize();
        return this;
    };
})(jsPDF.API);
