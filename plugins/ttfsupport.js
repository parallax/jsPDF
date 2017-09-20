/**
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
(function (jsPDFAPI) {
    "use strict";

    jsPDFAPI.events.push([ 
    	'addFont'
    	,function(font) {
            if (jsPDFAPI.existsFileInVFS(font.postScriptName)) {
                font.metadata = TTFFont.open(font.postScriptName, font.fontName, jsPDFAPI.getFileFromVFS(font.postScriptName), font.encoding);
                font.metadata.Unicode = font.metadata.Unicode || {encoding: {}, kerning: {}, widths: []};
            }
    	}
    ]) // end of adding event handler
})(jsPDF.API);