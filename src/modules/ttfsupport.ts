// @ts-nocheck
/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";
import { atob } from "../libs/AtobBtoa.js";

/**
 * @name ttfsupport
 * @module
 */
(function(jsPDF) {
  "use strict";

  let binaryStringToUint8Array = function(binary_string) {
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  };

  let addFont = function(font, file) {
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
      let file = undefined;
      let font = data.font;
      let instance = data.instance;
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
