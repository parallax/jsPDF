/** ==================================================================== 
 * jsPDF JavaScript plugin
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

/*global jsPDF */

(function (jsPDFAPI) {
    'use strict';
    var jsNamesObj, jsJsObj, text;
    jsPDFAPI.addJS = function (txt) {
        text = txt;
        this.internal.events.subscribe(
            'postPutResources',
            function (txt) {
                jsNamesObj = this.internal.newObject();
                this.internal.write('<< /Names [(EmbeddedJS) ' + (jsNamesObj + 1) + ' 0 R] >>', 'endobj');
                jsJsObj = this.internal.newObject();
                this.internal.write('<< /S /JavaScript /JS (', text, ') >>', 'endobj');
            }
        );
        this.internal.events.subscribe(
            'putCatalog',
            function () {
                if (jsNamesObj !== undefined && jsJsObj !== undefined) {
                    this.internal.write('/Names <</JavaScript ' + jsNamesObj + ' 0 R>>');
                }
            }
        );
        return this;
    };
}(jsPDF.API));
