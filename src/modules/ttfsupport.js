/* global jsPDF */
/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
/**
 * @name ttfsupport
 * @module
 */
(function(jsPDF) {
  "use strict";

  var binaryStringToUint8Array = function(binary_string) {
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  };

  var addFont = function(font, file) {
    // eslint-disable-next-line no-control-regex
    if (/^\x00\x01\x00\x00/.test(file)) {
      file = binaryStringToUint8Array(file);
    } else {
      file = binaryStringToUint8Array(atob(file));
    }
    font.metadata = jsPDF.API.TTFFont.open(file);
    font.metadata.Unicode = font.metadata.Unicode || {
      encoding: {},
      kerning: {},
      widths: []
    };
    font.metadata.glyIdsUsed = [0];
  };

  jsPDF.API.events.push([
    "addFont",
    function(data) {
      var file = undefined;
      var font = data.font;
      var instance = data.instance;
      if (font.isStandardFont) {
        return;
      }
      if (typeof instance !== "undefined") {
        if (instance.existsFileInVFS(font.postScriptName) === false) {
          file = instance.loadFile(font.postScriptName);
        } else {
          file = instance.getFileFromVFS(font.postScriptName);
        }
        if (typeof file !== "string") {
          throw new Error(
            "Font is not stored as string-data in vFS, import fonts or remove declaration doc.addFont('" +
              font.postScriptName +
              "')."
          );
        }
        addFont(font, file);
      } else {
        throw new Error(
          "Font does not exist in vFS, import fonts or remove declaration doc.addFont('" +
            font.postScriptName +
            "')."
        );
      }
    }
  ]); // end of adding event handler
})(jsPDF);
