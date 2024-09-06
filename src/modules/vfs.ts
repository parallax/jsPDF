/**
 * @license
 * jsPDF virtual FileSystem functionality
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";

/**
 * Use the vFS to handle files
 *
 * @name vFS
 * @module
 */
(function(jsPDFAPI: typeof jsPDF.API) {
  "use strict";

  const vFS: Record<string, string> = {};

  /**
   * Check if the file exists in the vFS
   *
   * @name existsFileInVFS
   * @function
   * @param {string} filename The name of the file to check
   * @returns {boolean}
   * @example
   * doc.existsFileInVFS("someFile.txt");
   */
  jsPDFAPI.existsFileInVFS = function(filename: string): boolean {
    return vFS.hasOwnProperty(filename);
  };

  /**
   * Add a file to the vFS
   *
   * @name addFileToVFS
   * @function
   * @param {string} filename The name of the file which should be added
   * @param {string} filecontent The content of the file
   * @returns {jsPDF}
   * @example
   * doc.addFileToVFS("someFile.txt", "BADFACE1");
   */
  jsPDFAPI.addFileToVFS = function(filename: string, filecontent: string): jsPDF {
    vFS[filename] = filecontent;
    return this;
  };

  /**
   * Get the file from the vFS
   *
   * @name getFileFromVFS
   * @function
   * @param {string} filename The name of the file which gets requested
   * @returns {string}
   * @example
   * doc.getFileFromVFS("someFile.txt");
   */
  jsPDFAPI.getFileFromVFS = function(filename: string): string {
    if (vFS.hasOwnProperty(filename)) {
      return vFS[filename];
    }
    return null;
  };
})(jsPDF.API);
