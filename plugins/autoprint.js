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

	jsPDFAPI.autoPrint = function () {
		'use strict'
		var refAutoPrintTag;

		this.internal.events.subscribe('postPutResources', function () {
			refAutoPrintTag = this.internal.newObject()
				this.internal.write("<< /S/Named /Type/Action /N/Print >>", "endobj");
		});

		this.internal.events.subscribe("putCatalog", function () {
			this.internal.write("/OpenAction " + refAutoPrintTag + " 0" + " R");
		});
		return this;
	};
})(jsPDF.API);
