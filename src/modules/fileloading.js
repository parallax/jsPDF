/* global jsPDF */
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
(function(jsPDFAPI) {
  "use strict";

  /**
   * @name loadFile
   * @function
   * @param {string} url
   * @param {boolean} sync
   * @param {function} callback
   * @returns {string|undefined} result
   */
  jsPDFAPI.loadFile = function(url, sync, callback) {
    sync = sync === false ? false : true;
    callback = typeof callback === "function" ? callback : function() {};
    var result = undefined;

    var xhr = function(url, sync, callback) {
      var request = new XMLHttpRequest();
      var i = 0;

      var sanitizeUnicode = function(data) {
        var dataLength = data.length;
        var charArray = [];
        var StringFromCharCode = String.fromCharCode;

        //Transform Unicode to ASCII
        for (i = 0; i < dataLength; i += 1) {
          charArray.push(StringFromCharCode(data.charCodeAt(i) & 0xff));
        }
        return charArray.join("");
      };

      request.open("GET", url, !sync);
      // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
      request.overrideMimeType("text/plain; charset=x-user-defined");

      if (sync === false) {
        request.onload = function() {
          if (request.status === 200) {
            callback(sanitizeUnicode(this.responseText));
          } else {
            callback(undefined);
          }
        };
      }
      request.send(null);

      if (sync && request.status === 200) {
        return sanitizeUnicode(request.responseText);
      }
    };
    try {
      result = xhr(url, sync, callback);
      // eslint-disable-next-line no-empty
    } catch (e) {}
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
