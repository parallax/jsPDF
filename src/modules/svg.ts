/** @license
 * Copyright (c) 2012 Willow Systems Corporation, https://github.com/willowsystems
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

import { jsPDF } from "../jspdf.js";
import { console } from "../libs/console.js";
import { globalObject } from "../libs/globalObject.js";

/**
 * jsPDF SVG plugin
 *
 * @name svg
 * @module
 */
(function(jsPDFAPI) {
  "use strict";

  function loadCanvg() {
    return (function() {
      if (globalObject["canvg"]) {
        return Promise.resolve(globalObject["canvg"]);
      }

      // @if MODULE_FORMAT='es'
      return import("canvg");
      // @endif

      // @if MODULE_FORMAT!='es'
      if (typeof exports === "object" && typeof module !== "undefined") {
        return new Promise(function(resolve, reject) {
          try {
            resolve(require("canvg"));
          } catch (e) {
            reject(e);
          }
        });
      }
      if (typeof define === "function" && define.amd) {
        return new Promise(function(resolve, reject) {
          try {
            require(["canvg"], resolve);
          } catch (e) {
            reject(e);
          }
        });
      }
      return Promise.reject(new Error("Could not load canvg"));
      // @endif
    })()
      .catch(function(e) {
        return Promise.reject(new Error("Could not load canvg: " + e));
      })
      .then(function(canvg) {
        return canvg.default ? canvg.default : canvg;
      });
  }

  /**
   * Parses SVG XML and saves it as image into the PDF.
   *
   * Depends on canvas-element and canvg
   *
   * @name addSvgAsImage
   * @public
   * @function
   * @param {string} SVG-Data as Text
   * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
   * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
   * @param {number} width of SVG-Image (in units declared at inception of PDF document)
   * @param {number} height of SVG-Image (in units declared at inception of PDF document)
   * @param {string} alias of SVG-Image (if used multiple times)
   * @param {string} compression of the generated JPEG, can have the values 'NONE', 'FAST', 'MEDIUM' and 'SLOW'
   * @param {number} rotation of the image in degrees (0-359)
   *
   * @returns jsPDF jsPDF-instance
   */
  jsPDFAPI.addSvgAsImage = function(
    svg,
    x,
    y,
    w,
    h,
    alias,
    compression,
    rotation
  ) {
    if (isNaN(x) || isNaN(y)) {
      console.error("jsPDF.addSvgAsImage: Invalid coordinates", arguments);
      throw new Error("Invalid coordinates passed to jsPDF.addSvgAsImage");
    }

    if (isNaN(w) || isNaN(h)) {
      console.error("jsPDF.addSvgAsImage: Invalid measurements", arguments);
      throw new Error(
        "Invalid measurements (width and/or height) passed to jsPDF.addSvgAsImage"
      );
    }

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; /// set white fill style
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var options = {
      ignoreMouse: true,
      ignoreAnimation: true,
      ignoreDimensions: true
    };
    var doc = this;
    return loadCanvg()
      .then(
        function(canvg) {
          return canvg.fromString(ctx, svg, options);
        },
        function() {
          return Promise.reject(new Error("Could not load canvg."));
        }
      )
      .then(function(instance) {
        return instance.render(options);
      })
      .then(function() {
        doc.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          x,
          y,
          w,
          h,
          compression,
          rotation
        );
      });
  };
})(jsPDF.API);
