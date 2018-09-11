/**
 * jsPDF virtual FileSystem functionality
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

 /**
 * Use the vFS to handle files
 * 
 * @name vFS
 * @module
 */
(function (jsPDFAPI) {
    "use strict";

    var vFS = {};

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
    jsPDFAPI.existsFileInVFS = function (filename) {
        return vFS.hasOwnProperty(filename);
    }

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
    jsPDFAPI.addFileToVFS = function (filename, filecontent) {
        vFS[filename] = filecontent; 
        return this;
    };

    /** 
	* Get the file from the vFS
	* 
    * @name getFileFromVFS
	* @function 
    * @returns {string} The name of the file which gets requested.
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