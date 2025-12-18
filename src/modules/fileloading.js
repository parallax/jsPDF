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
  /**
   * @name loadFile
   * @function
   * @param {string} url
   * @param {boolean} sync
   * @param {function} callback
   * @returns {string|undefined} result
   */
  jsPDFAPI.loadFile = function(url, sync, callback) {
    // @if MODULE_FORMAT!='cjs'
    return browserRequest(url, sync, callback);
    // @endif

    // @if MODULE_FORMAT='cjs'
    // eslint-disable-next-line no-unreachable
    return nodeReadFile.call(this, url, sync, callback);
    // @endif
  };

  /**
   * @name allowFsRead
   * @property
   * @type {string[]|undefined}
   *
   * Controls which local files may be read by jsPDF when running under Node.js.
   *
   * Security recommendation:
   * - We strongly recommend using Node's permission flags (`node --permission --allow-fs-read=...`) instead of this property,
   *   especially in production. The Node flags are enforced by the runtime and provide stronger guarantees.
   *
   * Behavior:
   * - When present, jsPDF will allow reading only if the requested, resolved absolute path matches any entry in this array.
   * - Each entry can be either:
   *   - An absolute or relative file path for an exact match, or
   *   - A prefix ending with a single wildcard `*` to allow all paths starting with that prefix.
   * - Examples of allowed patterns:
   *   - `"./fonts/MyFont.ttf"` (exact match by resolved path)
   *   - `"/abs/path/to/file.txt"` (exact absolute path)
   *   - `"./assets/*"` (any file whose resolved path starts with the resolved `./assets/` directory)
   *
   * Notes:
   * - If Node's permission API is available (`process.permission`), it is checked first. If it denies access, reading will fail regardless of `allowFsRead`.
   * - If neither `process.permission` nor `allowFsRead` is set, reading from the local file system is disabled and an error is thrown.
   *
   * Example:
   * ```js
   * const doc = jsPDF();
   * doc.allowFsRead = ["./fonts/*", "./images/logo.png"]; // allow everything under ./fonts and a single file
   * const ttf = doc.loadFile("./fonts/MyFont.ttf", true);
   * ```
   */
  jsPDFAPI.allowFsRead = undefined;

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
  }

  function nodeReadFile(url, sync, callback) {
    sync = sync === false ? false : true;
    var result = undefined;

    var fs = require("fs");
    var path = require("path");

    if (!process.permission && !this.allowFsRead) {
      throw new Error(
        "Trying to read a file from local file system. To enable this feature either run node with the --permission and --allow-fs-read flags or set the jsPDF.allowFsRead property."
      );
    }

    try {
      url = fs.realpathSync(path.resolve(url));
    } catch (e) {
      if (sync) {
        return undefined;
      } else {
        callback(undefined);
        return;
      }
    }

    if (process.permission && !process.permission.has("fs.read", url)) {
      throw new Error(`Cannot read file '${url}'. Permission denied.`);
    }

    if (this.allowFsRead) {
      const allowRead = this.allowFsRead.some(allowedUrl => {
        const starIndex = allowedUrl.indexOf("*");
        if (starIndex >= 0) {
          const fixedPart = allowedUrl.substring(0, starIndex);
          let resolved = path.resolve(fixedPart);
          if (fixedPart.endsWith(path.sep) && !resolved.endsWith(path.sep)) {
            resolved += path.sep;
          }
          return url.startsWith(resolved);
        } else {
          return url === path.resolve(allowedUrl);
        }
      });
      if (!allowRead) {
        throw new Error(`Cannot read file '${url}'. Permission denied.`);
      }
    }

    if (sync) {
      try {
        result = fs.readFileSync(url, {
          encoding: "latin1"
        });
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
