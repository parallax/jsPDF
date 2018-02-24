/**
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
(function (jsPDFAPI, global) {
    "use strict";

    jsPDFAPI.events.push([ 
    	'addFont'
    	,function(font) {
            if (jsPDFAPI.existsFileInVFS(font.postScriptName)) {
                font.metadata = global.TTFFont.open(font.postScriptName, font.fontName, jsPDFAPI.getFileFromVFS(font.postScriptName), font.encoding);
                font.metadata.Unicode = font.metadata.Unicode || {encoding: {}, kerning: {}, widths: []};
            } else if (font.id.slice(1) >= 14) {
                console.error("Font does not exist in FileInVFS, import fonts or remove declaration doc.addFont('" + font.postScriptName + "').");
            }
    	}
    ]) // end of adding event handler
})(jsPDF.API, typeof self !== "undefined" && self || typeof global !== "undefined" && global || typeof window !== "undefined" && window || (Function ("return this"))());
