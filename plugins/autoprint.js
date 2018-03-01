/**
 * jsPDF Autoprint Plugin
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

 /**
 * Makes the PDF automatically print. This works in Chrome, Firefox, Acrobat
 * Reader.
 *
 * @returns {jsPDF}
 * @name autoPrint
 * @example
 * var doc = new jsPDF()
 * doc.text(10, 10, 'This is a test')
 * doc.autoPrint()
 * doc.save('autoprint.pdf')
 */

(function (jsPDFAPI) {
  'use strict';

  jsPDFAPI.autoPrint = function (options) {
    'use strict'
    var refAutoPrintTag;
    options = options || {};
    options.variant = options.variant || 'non-conform';

    switch (options.variant) {
      case 'javascript':
        //https://github.com/Rob--W/pdf.js/commit/c676ecb5a0f54677b9f3340c3ef2cf42225453bb
        this.addJS('print({});');
        break;
      case 'non-conform':
      default: 
        this.internal.events.subscribe('postPutResources', function () {
          refAutoPrintTag = this.internal.newObject();
            this.internal.out("<<");
            this.internal.out("/S /Named");
            this.internal.out("/Type /Action");
            this.internal.out("/N /Print");
            this.internal.out(">>");
            this.internal.out("endobj");
        });

        this.internal.events.subscribe("putCatalog", function () {
          this.internal.out("/OpenAction " + refAutoPrintTag + " 0 R");
        });
        break;
    } 
    return this;
  };
})(jsPDF.API);
