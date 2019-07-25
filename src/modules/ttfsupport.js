/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
/**
 * @name ttfsupport
 * @module
 */
(function(jsPDF, global) {
  "use strict";

  jsPDF.API.events.push([
    "addFont",
    function(data) {
      var font = data.font;
      var instance = data.instance;
      if (typeof instance !== "undefined" && instance.existsFileInVFS(font.postScriptName)) {
        var file = instance.getFileFromVFS(font.postScriptName);
        if (typeof file !== "string") {
          throw new Error(
            "Font is not stored as string-data in vFS, import fonts or remove declaration doc.addFont('" +
              font.postScriptName +
              "')."
          );
        }
        font.metadata = jsPDF.API.TTFFont.open(font.postScriptName, font.fontName, file, font.encoding);
        font.metadata.Unicode = font.metadata.Unicode || { encoding: {}, kerning: {}, widths: [] };
        font.metadata.glyIdsUsed = [0];
      } else if (font.isStandardFont === false) {
        throw new Error(
          "Font does not exist in vFS, import fonts or remove declaration doc.addFont('" + font.postScriptName + "')."
        );
      }
    }
  ]); // end of adding event handler
})(
  jsPDF,
  (typeof self !== "undefined" && self) ||
    (typeof global !== "undefined" && global) ||
    (typeof window !== "undefined" && window) ||
    Function("return this")()
);
