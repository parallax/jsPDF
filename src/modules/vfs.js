/* global jsPDF */
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
    
    var _initializeVFS = function () {        
        if (typeof this.internal.vFS === "undefined") {
            this.internal.vFS = {};
        }
        return true;
    }
    
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
        _initializeVFS.call(this);
        return typeof this.internal.vFS[filename] !== "undefined";
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
    jsPDFAPI.getFileFromVFS = function (filename) {
        _initializeVFS.call(this);        
        
        if (typeof this.internal.vFS[filename] !== "undefined") {
            return this.internal.vFS[filename];
        }
        return null;
    };
})(jsPDF.API);
