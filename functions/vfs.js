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

	var vFS = {};
	
	jsPDFAPI.existsFileInVFS = function (filename) {
	
		return vFS.hasOwnProperty(filename);
	}
	
	jsPDFAPI.addFileToVFS = function (filename, filecontent) {		
		vFS[filename] = filecontent; 
		return this;
	};
	
	jsPDFAPI.getFileFromVFS = function (filename) {
		
		var files = Object.keys(vFS);
			
		if (arrayContainsElement(files, filename)) {
			return vFS[filename];
		}
		return null;
	};
})(jsPDF.API);
