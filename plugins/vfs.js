/**
 * jsPDF virtual FileSystem functionality
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

 /**
 * Use the VFS to handle files
 */

(function (jsPDFAPI) {
    "use strict";

    var VFS = {};

    /* Check if the file exists in the VFS
    * @returns {boolean}
    * @name existsFileInVFS
    * @example
    * doc.existsFileInVFS("someFile.txt");
    */
    jsPDFAPI.existsFileInVFS = function (filename) {
        return VFS.hasOwnProperty(filename);
    }

    /* Add a file to the VFS
    * @returns {jsPDF}
    * @name addFileToVFS
    * @example
    * doc.addFileToVFS("someFile.txt", "BADFACE1");
    */
    jsPDFAPI.addFileToVFS = function (filename, filecontent) {
        VFS[filename] = filecontent; 
        return this;
    };

    /* Get the file from the VFS
    * @returns {string}
    * @name addFileToVFS
    * @example
    * doc.getFileFromVFS("someFile.txt");
    */
    jsPDFAPI.getFileFromVFS = function (filename) {
        if (VFS.hasOwnProperty(filename)) {
            return VFS[filename];
        }
        return null;
    };
})(jsPDF.API);