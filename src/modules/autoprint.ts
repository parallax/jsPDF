/** @license
 * jsPDF Autoprint Plugin
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";

/**
 * @name autoprint
 * @module
 */
(function(jsPDFAPI: typeof jsPDF.API) {
  "use strict";

  interface AutoPrintOptions {
    variant?: 'non-conform' | 'javascript';
  }

  /**
   * Makes the PDF automatically open the print-Dialog when opened in a PDF-viewer.
   *
   * @name autoPrint
   * @function
   * @param {AutoPrintOptions} options (optional) Set the attribute variant to 'non-conform' (default) or 'javascript' to activate different methods of automatic printing when opening in a PDF-viewer .
   * @returns {jsPDF}
   * @example
   * var doc = new jsPDF();
   * doc.text(10, 10, 'This is a test');
   * doc.autoPrint({variant: 'non-conform'});
   * doc.save('autoprint.pdf');
   */
  jsPDFAPI.autoPrint = function(this: jsPDF, options?: AutoPrintOptions): jsPDF {
    options = options || {};
    options.variant = options.variant || "non-conform";

    let refAutoPrintTag: number;

    switch (options.variant) {
      case "javascript":
        //https://github.com/Rob--W/pdf.js/commit/c676ecb5a0f54677b9f3340c3ef2cf42225453bb
        this.addJS("print({});");
        break;
      case "non-conform":
      default:
        this.internal.events.subscribe("postPutResources", function(this: jsPDF) {
          refAutoPrintTag = this.internal.newObject();
          this.internal.out("<<");
          this.internal.out("/S /Named");
          this.internal.out("/Type /Action");
          this.internal.out("/N /Print");
          this.internal.out(">>");
          this.internal.out("endobj");
        });

        this.internal.events.subscribe("putCatalog", function(this: jsPDF) {
          this.internal.out("/OpenAction " + refAutoPrintTag + " 0 R");
        });
        break;
    }
    return this;
  };
})(jsPDF.API);
