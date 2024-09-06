/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";

/**
 * jsPDF total_pages plugin
 * @name total_pages
 * @module
 */
(function(jsPDFAPI: typeof jsPDF.API) {
  "use strict";

  /**
   * @name putTotalPages
   * @function
   * @param {string} pageExpression Regular Expression to match the current page number
   * @returns {jsPDF} jsPDF-instance
   */
  jsPDFAPI.putTotalPages = function(this: jsPDF, pageExpression: string): jsPDF {
    const replaceExpression = new RegExp(pageExpression, "g");
    for (let n = 1; n <= this.internal.getNumberOfPages(); n++) {
      for (let i = 0; i < this.internal.pages[n].length; i++) {
        this.internal.pages[n][i] = this.internal.pages[n][i].replace(
          replaceExpression,
          this.internal.getNumberOfPages().toString()
        );
      }
    }
    return this;
  };
})(jsPDF.API);
