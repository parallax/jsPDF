/**
 * @license
 * jsPDF fileloading PlugIn
 * Copyright (c) 2018 Aras Abbasi (aras.abbasi@gmail.com)
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";

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
    // Runtime detection: use Node.js fs if available, otherwise use browser XHR
    if (typeof XMLHttpRequest === "undefined") {
      return nodeReadFile(url, sync, callback);
    } else {
      return browserRequest(url, sync, callback);
    }
  };

  /**
   * @name loadImageFile
   * @function
   * @param {string} path
   * @param {boolean} sync
   * @param {function} callback
   */
  jsPDFAPI.loadImageFile = jsPDFAPI.loadFile;

  function browserRequest(url, sync, callback) {
    sync = sync === false ? false : true;
    callback = typeof callback === "function" ? callback : function() {};
    let result = undefined;

    let xhr = function(url, sync, callback) {
      let request = new XMLHttpRequest();
      let i = 0;

      let sanitizeUnicode = function(data) {
        let dataLength = data.length;
        let charArray = [];
        let StringFromCharCode = String.fromCharCode;

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
  }

  function nodeReadFile(url, sync, callback) {
    sync = sync === false ? false : true;
    let result = undefined;

    let fs = require("fs");
    let path = require("path");

    url = path.resolve(url);
    if (sync) {
      try {
        result = fs.readFileSync(url, { encoding: "latin1" });
      } catch (e) {
        return undefined;
      }
    } else {
      fs.readFile(url, { encoding: "latin1" }, function(err, data) {
        if (!callback) {
          return;
        }
        if (err) {
          callback(undefined);
        }
        callback(data);
      });
    }

    return result;
  }
})(jsPDF.API);
