/**
 * @license
 * jsPDF virtual FileSystem functionality
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";
import type { jsPDFAPI as JsPDFAPI, jsPDFDocument } from "../types.js";

declare module "../types.js" {
  interface jsPDFAPI {
    existsFileInVFS(filename: string): boolean;
    addFileToVFS(filename: string, filecontent: string): jsPDFDocument;
    getFileFromVFS(filename: string): string | null;
  }
  interface jsPDFInternal {
    vFS?: Record<string, string>;
  }
}

/**
 * Use the vFS to handle files
 *
 * @name vFS
 * @module
 */
(function(jsPDFAPI: JsPDFAPI) {
  "use strict";

  var _initializeVFS = function(this: jsPDFDocument) {
    if (typeof this.internal.vFS === "undefined") {
      this.internal.vFS = {};
    }
    return true;
  };

  /**
   * Check if the file exists in the vFS
   *
   * @name existsFileInVFS
   * @function
   * @param {string} Possible filename in the vFS.
   * @returns {boolean}
   * @example
   * doc.existsFileInVFS("someFile.txt");
   */
  jsPDFAPI.existsFileInVFS = function(this: jsPDFDocument, filename: string) {
    _initializeVFS.call(this);
    return typeof this.internal.vFS[filename] !== "undefined";
  };

  /**
   * Add a file to the vFS
   *
   * @name addFileToVFS
   * @function
   * @param {string} filename The name of the file which should be added.
   * @param {string} filecontent The content of the file.
   * @returns {jsPDF}
   * @example
   * doc.addFileToVFS("someFile.txt", "BADFACE1");
   */
  jsPDFAPI.addFileToVFS = function(
    this: jsPDFDocument,
    filename: string,
    filecontent: string
  ) {
    _initializeVFS.call(this);
    this.internal.vFS[filename] = filecontent;
    return this;
  };

  /**
   * Get the file from the vFS
   *
   * @name getFileFromVFS
   * @function
   * @param {string} The name of the file which gets requested.
   * @returns {string}
   * @example
   * doc.getFileFromVFS("someFile.txt");
   */
  jsPDFAPI.getFileFromVFS = function(this: jsPDFDocument, filename: string) {
    _initializeVFS.call(this);

    if (typeof this.internal.vFS[filename] !== "undefined") {
      return this.internal.vFS[filename];
    }
    return null;
  };
})(jsPDF.API);
