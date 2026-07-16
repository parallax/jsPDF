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
import type { CanvgStatic } from "canvg";
import type { jsPDFAPI as JsPDFAPI, jsPDFDocument } from "../types.js";
import type { ImageCompression } from "./addimage.js";

// Ambient declarations for the module-format-specific branches kept inside
// "@if MODULE_FORMAT" preprocess directive blocks.
declare const require: {
  (id: string): unknown;
  (ids: string[], onLoad: (mod: unknown) => void): unknown;
};
declare const module: unknown;
declare const exports: unknown;
declare const define: { amd?: unknown };

declare module "../types.js" {
  interface jsPDFAPI {
    addSvgAsImage(
      svg: string,
      x: number,
      y: number,
      w: number,
      h: number,
      alias?: string,
      compression?: ImageCompression,
      rotation?: number
    ): Promise<void>;
  }
}

/**
 * jsPDF SVG plugin
 *
 * @name svg
 * @module
 */
(function (jsPDFAPI: JsPDFAPI) {
  "use strict";

  function loadCanvg(): Promise<CanvgStatic> {
    return (function (): Promise<unknown> {
      if (globalObject["canvg"]) {
        return Promise.resolve(globalObject["canvg"]);
      }

      // @if MODULE_FORMAT='es'
      return import("canvg");
      // @endif

      // @if MODULE_FORMAT!='es'
      if (typeof exports === "object" && typeof module !== "undefined") {
        return new Promise(function (resolve, reject) {
          try {
            resolve(require("canvg"));
          } catch (e) {
            reject(e);
          }
        });
      }
      if (typeof define === "function" && define.amd) {
        return new Promise(function (resolve, reject) {
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
      .catch(function (e) {
        return Promise.reject(new Error("Could not load canvg: " + e));
      })
      .then(function (canvg) {
        // The loaded value is either a module namespace carrying the library
        // on `default` or the library itself; the runtime check is preserved
        // and the assertion only names what the branches produce.
        var loaded = canvg as { default?: CanvgStatic };
        return (loaded.default ? loaded.default : loaded) as CanvgStatic;
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
  jsPDFAPI.addSvgAsImage = function (
    this: jsPDFDocument,
    svg: string,
    x: number,
    y: number,
    w: number,
    h: number,
    alias?: string,
    compression?: ImageCompression,
    rotation?: number
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
    // A fresh canvas always yields a 2d context.
    var ctx = canvas.getContext("2d")!;
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
        function (canvg) {
          return canvg.fromString(ctx, svg, options);
        },
        function () {
          return Promise.reject(new Error("Could not load canvg."));
        }
      )
      .then(function (instance) {
        return instance.render(options);
      })
      .then(function () {
        doc.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          x,
          y,
          w,
          h,
          // Latent bug preserved for parity: compression and rotation are
          // passed one parameter slot early (into addImage's alias and
          // compression parameters); `alias` itself is never forwarded. The
          // assertion keeps the historical call shape verbatim.
          compression,
          rotation as unknown as ImageCompression
        );
      });
  };
})(jsPDF.API);
