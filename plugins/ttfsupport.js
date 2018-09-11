/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
/**
* @name ttfsupport
* @module
*/
(function (jsPDF, global) {
    "use strict";

    jsPDF.API.events.push([ 
    	'addFont'
    	,function(font) {
            if (jsPDF.API.existsFileInVFS(font.postScriptName)) {
                font.metadata = jsPDF.API.TTFFont.open(font.postScriptName, font.fontName, jsPDF.API.getFileFromVFS(font.postScriptName), font.encoding);
                font.metadata.Unicode = font.metadata.Unicode || {encoding: {}, kerning: {}, widths: []};
            } else if (font.id.slice(1) > 14) {
                console.error("Font does not exist in FileInVFS, import fonts or remove declaration doc.addFont('" + font.postScriptName + "').");
            }
    	}
    ]) // end of adding event handler
})(jsPDF, typeof self !== "undefined" && self || typeof global !== "undefined" && global || typeof window !== "undefined" && window || (Function ("return this"))());
