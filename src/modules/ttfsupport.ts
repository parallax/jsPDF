/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";
import { atob } from "../libs/AtobBtoa.js";
import type {
  AddFontPayload,
  Font,
  TTFFontConstructor,
  jsPDFConstructor
} from "../types.js";

declare module "../types.js" {
  interface jsPDFAPI {
    /** Installed by the vendored TTF library (src/libs/ttffont.ts). */
    TTFFont: TTFFontConstructor;
    /** Installed by the vendored TTF library (src/libs/ttffont.ts). */
    PDFObject: { convert(value: unknown): string };
  }
}

/**
 * @name ttfsupport
 * @module
 */
(function(jsPDF: jsPDFConstructor) {
  "use strict";

  var binaryStringToUint8Array = function(binary_string: string) {
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  };

  var addFont = function(font: Font, file: string | Uint8Array) {
    // eslint-disable-next-line no-control-regex
    if (/^\x00\x01\x00\x00/.test(file as string)) {
      file = binaryStringToUint8Array(file as string);
    } else {
      file = binaryStringToUint8Array(atob(file as string));
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
    function(data: AddFontPayload) {
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
