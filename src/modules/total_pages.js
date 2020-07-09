/* global jsPDF */
/**
 * @license
 * ====================================================================
 * Copyright (c) 2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
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
 * jsPDF total_pages plugin
 * @name total_pages
 * @module
 */
(function(jsPDFAPI) {
  "use strict";
  /**
   * @name putTotalPages
   * @function
   * @param {string} pageExpression Regular Expression
   * @returns {jsPDF} jsPDF-instance
   */

  jsPDFAPI.putTotalPages = function(pageExpression) {
    "use strict";

    var replaceExpression;
    var totalNumberOfPages = 0;
    if (parseInt(this.internal.getFont().id.substr(1), 10) < 15) {
      replaceExpression = new RegExp(pageExpression, "g");
      totalNumberOfPages = this.internal.getNumberOfPages();
    } else {
      replaceExpression = new RegExp(
        this.pdfEscape16(pageExpression, this.internal.getFont()),
        "g"
      );
      totalNumberOfPages = this.pdfEscape16(
        this.internal.getNumberOfPages() + "",
        this.internal.getFont()
      );
    }

    for (var n = 1; n <= this.internal.getNumberOfPages(); n++) {
      for (var i = 0; i < this.internal.pages[n].length; i++) {
        this.internal.pages[n][i] = this.internal.pages[n][i].replace(
          replaceExpression,
          totalNumberOfPages
        );
      }
    }

    return this;
  };
})(jsPDF.API);
