/**
 * @license
 * ====================================================================
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

import { jsPDF } from "../jspdf.js";

/**
 * jsPDF JavaScript plugin
 *
 * @name javascript
 * @module
 */
(function(jsPDFAPI) {
  "use strict";
  /**
   * @name addJS
   * @function
   * @param {string} javascript The javascript to be embedded into the PDF-file.
   * @returns {jsPDF}
   */
  jsPDFAPI.addJS = function(javascript) {
    var jsNamesObj;
    var jsJsObj;
    // Escape only unescaped parentheses, without double-escaping already escaped ones
    function escapeParens(str) {
      let out = "";
      for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (ch === "(" || ch === ")") {
          // Count preceding backslashes to determine if the paren is already escaped
          let bs = 0;
          for (let j = i - 1; j >= 0 && str[j] === "\\"; j--) {
            bs++;
          }
          if (bs % 2 === 0) {
            out += "\\" + ch;
          } else {
            out += ch;
          }
        } else {
          out += ch;
        }
      }
      return out;
    }
    const text = escapeParens(javascript);

    this.internal.events.subscribe("postPutResources", function() {
      jsNamesObj = this.internal.newObject();
      this.internal.out("<<");
      this.internal.out("/Names [(EmbeddedJS) " + (jsNamesObj + 1) + " 0 R]");
      this.internal.out(">>");
      this.internal.out("endobj");

      jsJsObj = this.internal.newObject();
      this.internal.out("<<");
      this.internal.out("/S /JavaScript");
      // The sanitized 'text' is now safe to be enclosed in parentheses
      this.internal.out("/JS (" + text + ")");
      this.internal.out(">>");
      this.internal.out("endobj");
    });

    this.internal.events.subscribe("putCatalog", function() {
      if (jsNamesObj !== undefined && jsJsObj !== undefined) {
        this.internal.out("/Names <</JavaScript " + jsNamesObj + " 0 R>>");
      }
    });
    return this;
  };
})(jsPDF.API);
