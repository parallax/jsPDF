/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";

/**
 * jsPDF setLanguage Plugin
 *
 * @name setLanguage
 * @module
 */
(function(jsPDFAPI: typeof jsPDF.API) {
  "use strict";

  /**
   * Sets the language for the document.
   *
   * @name setLanguage
   * @function
   * @param {string} langCode The language code.
   * @returns {jsPDF}
   * @example
   * var doc = new jsPDF()
   * doc.setLanguage("en-US")
   */
  jsPDFAPI.setLanguage = function(this: jsPDF, langCode: string): jsPDF {
    this.internal.languageSettings.languageCode = langCode;
    return this;
  };
})(jsPDF.API);
