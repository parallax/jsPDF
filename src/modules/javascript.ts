/**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";

/**
 * jsPDF JavaScript plugin
 *
 * @name javascript
 * @module
 */
(function(jsPDFAPI: typeof jsPDF.API) {
  "use strict";

  /**
   * Adds JavaScript to the PDF.
   *
   * @name addJS
   * @function
   * @param {string} javascript The JavaScript to add to the PDF.
   * @returns {jsPDF}
   */
  jsPDFAPI.addJS = function(this: jsPDF, javascript: string): jsPDF {
    this.internal.events.subscribe("postPutResources", function(this: jsPDF) {
      const jsRef = this.internal.newObject();
      this.internal.out("<<");
      this.internal.out("/Names [(EmbeddedJS) " + (jsRef + 1) + " 0 R]");
      this.internal.out(">>");
      this.internal.out("endobj");

      const obj = this.internal.newObject();
      this.internal.out("<<");
      this.internal.out("/S /JavaScript");
      this.internal.out("/JS (" + javascript + ")");
      this.internal.out(">>");
      this.internal.out("endobj");
    });
    return this;
  };
})(jsPDF.API);
