/**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";
import type { jsPDFAPI as JsPDFAPI, jsPDFDocument } from "../types.js";

/** The canvas-like wrapper installed on every document as `doc.canvas`. */
export interface CanvasShim {
  pdf: jsPDFDocument;
  // The setters accept and sanitize any input (isNaN branch);
  // reading always yields a number.
  get width(): number;
  set width(value: number | undefined);
  get height(): number;
  set height(value: number | undefined);
  childNodes: unknown[];
  style: Record<string, unknown>;
  parentNode: undefined;
  getContext(
    contextType?: string,
    contextAttributes?: Record<string, unknown>
  ): jsPDFDocument["context2d"] | null;
  toDataURL(): string;
}

/** Static side of the classic constructor function below. */
interface CanvasShimConstructor {
  new (): CanvasShim;
  prototype: CanvasShim;
}

declare module "../types.js" {
  interface jsPDFDocument {
    /** The Canvas wrapper for this document, assigned on "initialized". */
    canvas: CanvasShim;
  }
}

/**
 * jsPDF Canvas PlugIn
 * This plugin mimics the HTML5 Canvas
 *
 * The goal is to provide a way for current canvas users to print directly to a PDF.
 * @name canvas
 * @module
 */
(function (this: void, jsPDFAPI: JsPDFAPI) {
  "use strict";

  /**
   * @class Canvas
   * @classdesc A Canvas Wrapper for jsPDF
   */
  // A classic constructor function carries no construct signature in its
  // inferred type; keep it opaque and assert the `new`-able shape once below.
  var CanvasImpl: unknown = function (this: CanvasShim) {
    var jsPdfInstance: jsPDFDocument | undefined = undefined;
    Object.defineProperty(this, "pdf", {
      get: function () {
        return jsPdfInstance;
      },
      set: function (value: jsPDFDocument) {
        jsPdfInstance = value;
      }
    });

    var _width = 150;
    /**
     * The height property is a positive integer reflecting the height HTML attribute of the <canvas> element interpreted in CSS pixels. When the attribute is not specified, or if it is set to an invalid value, like a negative, the default value of 150 is used.
     * This is one of the two properties, the other being width, that controls the size of the canvas.
     *
     * @name width
     */
    Object.defineProperty(this, "width", {
      get: function () {
        return _width;
      },
      set: function (this: CanvasShim, value: number | undefined) {
        if (
          isNaN(value as number) ||
          Number.isInteger(value) === false ||
          value! < 0
        ) {
          _width = 150;
        } else {
          // isNaN guard above proves value is a number here
          _width = value!;
        }
        // getContext("2d") never returns null for the "2d" context type.
        if (this.getContext("2d")!.pageWrapXEnabled) {
          this.getContext("2d")!.pageWrapX = _width + 1;
        }
      }
    });

    var _height = 300;
    /**
     * The width property is a positive integer reflecting the width HTML attribute of the <canvas> element interpreted in CSS pixels. When the attribute is not specified, or if it is set to an invalid value, like a negative, the default value of 300 is used.
     * This is one of the two properties, the other being height, that controls the size of the canvas.
     *
     * @name height
     */
    Object.defineProperty(this, "height", {
      get: function () {
        return _height;
      },
      set: function (this: CanvasShim, value: number | undefined) {
        if (
          isNaN(value as number) ||
          Number.isInteger(value) === false ||
          value! < 0
        ) {
          _height = 300;
        } else {
          // isNaN guard above proves value is a number here
          _height = value!;
        }
        // getContext("2d") never returns null for the "2d" context type.
        if (this.getContext("2d")!.pageWrapYEnabled) {
          this.getContext("2d")!.pageWrapY = _height + 1;
        }
      }
    });

    var _childNodes: unknown[] = [];
    Object.defineProperty(this, "childNodes", {
      get: function () {
        return _childNodes;
      },
      set: function (value: unknown[]) {
        _childNodes = value;
      }
    });

    var _style: Record<string, unknown> = {};
    Object.defineProperty(this, "style", {
      get: function () {
        return _style;
      },
      set: function (value: Record<string, unknown>) {
        _style = value;
      }
    });

    Object.defineProperty(this, "parentNode", {});
  };
  var Canvas = CanvasImpl as CanvasShimConstructor;

  /**
   * The getContext() method returns a drawing context on the canvas, or null if the context identifier is not supported.
   *
   * @name getContext
   * @function
   * @param {string} contextType Is a String containing the context identifier defining the drawing context associated to the canvas. Possible value is "2d", leading to the creation of a Context2D object representing a two-dimensional rendering context.
   * @param {object} contextAttributes
   */
  Canvas.prototype.getContext = function (
    this: CanvasShim,
    contextType?: string,
    contextAttributes?: Record<string, unknown>
  ) {
    contextType = contextType || "2d";
    var key: string;

    if (contextType !== "2d") {
      return null;
    }
    // The class surface of the context is opaque here: arbitrary
    // caller-provided attributes are copied onto it (dynamic by design), and
    // `_canvas` is an expando this plugin stashes on it.
    var context2d: unknown = this.pdf.context2d;
    for (key in contextAttributes) {
      if (this.pdf.context2d.hasOwnProperty(key)) {
        // The for-in loop body only runs when contextAttributes is defined.
        (context2d as Record<string, unknown>)[key] = contextAttributes![key];
      }
    }
    (context2d as { _canvas: CanvasShim })._canvas = this;
    return this.pdf.context2d;
  };

  /**
   * The toDataURL() method is just a stub to throw an error if accidently called.
   *
   * @name toDataURL
   * @function
   */
  Canvas.prototype.toDataURL = function () {
    throw new Error("toDataURL is not implemented.");
  };

  jsPDFAPI.events.push([
    "initialized",
    function (this: jsPDFDocument) {
      this.canvas = new Canvas();
      this.canvas.pdf = this;
    }
  ]);

  return this;
})(jsPDF.API);
