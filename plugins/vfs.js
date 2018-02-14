/**
 * jsPDF virtual FileSystem functionality
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

 /**
 * Use the vFS to handle files
 */

(function (jsPDFAPI) {
    "use strict";

    var vFS = {};

    /* Check if the file exists in the vFS
    * @returns {boolean}
    * @name existsFileInVFS
    * @example
    * doc.existsFileInVFS("someFile.txt");
    */
    jsPDFAPI.existsFileInVFS = function (filename) {
        return vFS.hasOwnProperty(filename);
    }

    /* Add a file to the vFS
    * @returns {jsPDF}
    * @name addFileToVFS
    * @example
    * doc.addFileToVFS("someFile.txt", "BADFACE1");
    */
    jsPDFAPI.addFileToVFS = function (filename, filecontent) {
        vFS[filename] = filecontent; 
        return this;
    };

    /* Get the file from the vFS
    * @returns {string}
    * @name addFileToVFS
    * @example
    * doc.getFileFromVFS("someFile.txt");
    */
    jsPDFAPI.getFileFromVFS = function (filename) {
        if (vFS.hasOwnProperty(filename)) {
            return vFS[filename];
        }
        return null;
    };
})(jsPDF.API);