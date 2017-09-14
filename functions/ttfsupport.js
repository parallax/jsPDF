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
	
	function arrayContainsElement(array, element) {
		var iterator;
		var result = false;

		for (iterator = 0; iterator < array.length; iterator += 1) {
			if (array[iterator] === element) {
				result = true;
			}
		}
		return result;
	}	

	var addTTFFontFunction = function (args) {
		var postScriptName = args.postScriptName;
		var fontName = args.fontName;
		var fontStyle = args.fontStyle;
		var encoding = args.encoding;
		var metadata = args.metadata;
		var mutex = args.mutex || {};
		var scope = mutex.scope;
		
		if (jsPDFAPI.existsFileInVFS(postScriptName)) {
			metadata = TTFFont.open(postScriptName, fontName, jsPDFAPI.getFileFromVFS(postScriptName), encoding);
			metadata.Unicode = metadata.Unicode || {encoding: {}, kerning: {}, widths: []};
		}
		
		return {
			postScriptName: postScriptName,
			fontName: fontName,
			fontStyle: fontStyle,
			encoding: encoding,
			metadata: metadata
		};
	}
		
	if (jsPDF.FunctionsPool === undefined) {
		jsPDF.FunctionsPool = {};
	}
	if (jsPDF.FunctionsPool.addFont === undefined) {
		jsPDF.FunctionsPool.addFont = [];
	}
	
	
	jsPDF.FunctionsPool.addFont.push(
		addTTFFontFunction
	);
})(jsPDF.API);
