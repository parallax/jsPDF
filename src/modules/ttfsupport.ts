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
(function(jsPDFAPI: typeof jsPDF.API) {
  "use strict";

  interface Font {
    isStandardFont?: boolean;
    postScriptName: string;
    metadata: {
      Unicode: {
        encoding: Record<string, unknown>;
        kerning: Record<string, unknown>;
        widths: number[];
      };
      glyIdsUsed: number[];
    };
  }

  interface AddFontData {
    font: Font;
    instance: jsPDF;
  }

  const binaryStringToUint8Array = function(binary_string: string): Uint8Array {
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  };

  const addFont = function(font: Font, file: string): void {
    // eslint-disable-next-line no-control-regex
    if (/^\x00\x01\x00\x00/.test(file)) {
      file = binaryStringToUint8Array(file);
    } else {
      file = binaryStringToUint8Array(atob(file));
    }
    font.metadata = (jsPDFAPI.TTFFont as any).open(file);
    font.metadata.Unicode = font.metadata.Unicode || {
      encoding: {},
      kerning: {},
      widths: []
    };
    font.metadata.glyIdsUsed = [0];
  };

  jsPDFAPI.events.push([
    "addFont",
    function(data: AddFontData): void {
      let file: string | undefined;
      const font = data.font;
      const instance = data.instance;
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
})(jsPDF.API);
