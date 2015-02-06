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
