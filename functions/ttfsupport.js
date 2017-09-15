/**
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
(function (jsPDFAPI) {
    "use strict";

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