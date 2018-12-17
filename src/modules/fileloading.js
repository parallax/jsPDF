/**
 * jsPDF fileloading PlugIn
 * Copyright (c) 2018 Aras Abbasi (aras.abbasi@gmail.com)
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
/**
* @name fileloading
* @module
*/
(function (jsPDFAPI) {
    'use strict';
    
    /**
    * @name loadFile
    * @function
    * @param {string} url
    * @param {boolean} sync
    * @param {function} callback
    * @returns {string|undefined} result
    */
    jsPDFAPI.loadFile = function (url, sync, callback) {
        sync = sync || true;
        callback = callback || function () {};
        var result;

        var xhr = function (url, sync, callback) {
            var req = new XMLHttpRequest();
            var byteArray = [];
            var i = 0;
            
            var sanitizeUnicode = function (data) {
                var dataLength = data.length;
                var StringFromCharCode = String.fromCharCode;
                
                //Transform Unicode to ASCII
                for (i = 0; i < dataLength; i += 1) {
                    byteArray.push(StringFromCharCode(data.charCodeAt(i) & 0xff))
                }
                return byteArray.join("");
            }
            
            req.open('GET', url, !sync)
            // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
            req.overrideMimeType('text\/plain; charset=x-user-defined');
            
            if (sync === false) {
                req.onload = function () {
                    return sanitizeUnicode(this.responseText);
                };
            }
            req.send(null)
            
            if (req.status !== 200) {
                console.warn('Unable to load file "' + url + '"');
                return;
            }
            
            if (sync) {
                return sanitizeUnicode(req.responseText);
            }
        }
        try {
            result = xhr(url, sync, callback);
        } catch(e) {
            result = undefined;
        }
        return result;
    };
    
    /**
    * @name loadImageFile
    * @function
    * @param {string} path
    * @param {boolean} sync
    * @param {function} callback
    */
    jsPDFAPI.loadImageFile = jsPDFAPI.loadFile;
})(jsPDF.API);
