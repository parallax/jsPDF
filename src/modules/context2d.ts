/* eslint-disable no-fallthrough */
/* eslint-disable no-console */
/**
 * @license
 * jsPDF Context2D PlugIn Copyright (c) 2014 Steven Spungin (TwelveTone LLC) steven@twelvetone.tv
 *
 * Licensed under the MIT License. http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";
import { RGBColor } from "../libs/rgbcolor.js";
import { console } from "../libs/console.js";
import {
  buildFontFaceMap,
  parseFontFamily,
  resolveFontFace
} from "../libs/fontFace.js";
import type { FontFaceInput, FontFaceMap } from "../libs/fontFace.js";
import type { ImageProperties } from "./addimage.js";
import type {
  jsPDFAPI as JsPDFAPI,
  jsPDFDocument,
  Font,
  Matrix as MatrixType,
  MatrixConstructor,
  PointType,
  PointConstructor,
  RectangleType,
  RectangleConstructor
} from "../types.js";

declare module "../types.js" {
  interface jsPDFAPI {
    // Provided by the addimage plugin (src/modules/addimage.ts). Declared
    // with the full return shape so this (earlier-merged) overload does not
    // shadow the richer one addimage.ts declares.
    getImageProperties(imageData: unknown): ImageProperties;
    addImage(
      imageData: unknown,
      format: string,
      x: number,
      y: number,
      w: number,
      h: number,
      alias?: string | null,
      compression?: string | null,
      rotation?: number
    ): jsPDFDocument;
    // Provided by the cell plugin (src/modules/cell.ts).
    getTextDimensions(text: string): { w: number; h: number };
    // Provided by the split_text_to_size plugin.
    getStringUnitWidth(text: string): number;
    splitTextToSize(text: string, maxlen: number): string[];
  }
  interface jsPDFDocument {
    /** The Context2D instance for this document, assigned on "initialized". */
    context2d: Context2D;
    /** Core alias of setLineDashPattern (see src/jspdf.ts). */
    setLineDash(dashArray?: number[], dashPhase?: number): jsPDFDocument;
    /** Core alias of setLineMiterLimit (see src/jspdf.ts). */
    setMiterLimit(length: number): jsPDFDocument;
    // The core lines() defaults both scale and style when passed null
    // (`scale = scale || [1, 1]`, isValidStyle accepts null); context2d
    // calls it that way (see drawLines below).
    lines(
      lines: Array<number[]>,
      x: number,
      y: number,
      scale?: [number, number] | number[] | null,
      style?: string | null,
      closed?: boolean
    ): jsPDFDocument;
    // encodeColorString in src/jspdf.ts accepts an alpha descriptor object as
    // the fourth channel argument; context2d relies on that.
    setFillColor(
      ch1: number,
      ch2: number,
      ch3: number,
      options: { a: number }
    ): jsPDFDocument;
    setTextColor(
      ch1: number,
      ch2: number,
      ch3: number,
      options: { a: number }
    ): jsPDFDocument;
  }
  interface jsPDFInternal {
    // The core getFont supports a noFallback option and then may return
    // undefined (see getFont in src/jspdf.ts).
    getFont(
      fontName: string,
      fontStyle: string,
      options: { noFallback?: boolean; disableWarning?: boolean }
    ): Font | undefined;
  }
}

/**
 * An entry of the internal path array. Depending on `type`, only a subset of
 * the coordinate members is present (see the push sites in Context2D).
 */
interface PathEntry {
  type?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  counterclockwise?: boolean;
}

/** Aggregated drawing move built by drawPaths from the path entries. */
interface PathMove {
  begin?: boolean;
  close?: boolean;
  arc?: boolean;
  start?: PathEntry;
  deltas?: number[][];
  abs?: PathEntry[];
}

/** Minimal canvas gradient stand-in returned by createLinearGradient & co. */
interface CanvasGradientStub {
  colorStops: Array<[number, string]>;
  addColorStop(offset: number, color: string): void;
  getColor(): string;
  isCanvasGradient: true;
}

/** Cubic bezier segment approximating part of an arc (see createSmallArc). */
interface ArcCurve {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  x4: number;
  y4: number;
}

interface RGBAResult {
  r: number;
  g: number;
  b: number;
  a: number;
  style: string;
}

interface PutTextOptions {
  text: string;
  x: number;
  y: number;
  scale: number;
  angle: number;
  align: string;
  maxWidth?: number;
  renderingMode?: "stroke";
}

//stubs, wired to the document internals on the "initialized" event
var f2: (value: number) => string,
  getHorizontalCoordinateString: (value: number) => string,
  getVerticalCoordinateString: (value: number) => string,
  getHorizontalCoordinate: (value: number) => number,
  getVerticalCoordinate: (value: number) => number,
  Point: PointConstructor,
  Rectangle: RectangleConstructor,
  Matrix: MatrixConstructor,
  _ctx: ContextLayer;

class ContextLayer {
  declare isStrokeTransparent: boolean;
  declare strokeOpacity: number;
  declare strokeStyle: string;
  declare fillStyle: string;
  declare isFillTransparent: boolean;
  declare fillOpacity: number;
  declare font: string;
  declare textBaseline: string;
  declare textAlign: string;
  declare lineWidth: number;
  declare lineJoin: string;
  declare lineCap: string;
  declare path: PathEntry[];
  declare transform: MatrixType;
  declare globalCompositeOperation: string;
  declare globalAlpha: number;
  declare clip_path: PathEntry[];
  declare currentPoint: PointType;
  declare miterLimit: number;
  declare lastPoint: PointType;
  declare lineDashOffset: number;
  declare lineDash: number[];
  declare margin: number[];
  declare prevPageLastElemOffset: number;
  declare ignoreClearRect: boolean;
  /** Stashed by Context2D#save(). */
  declare fontSize?: number;

  constructor(ctx?: Partial<ContextLayer>) {
    ctx = ctx || {};
    this.isStrokeTransparent = ctx.isStrokeTransparent || false;
    this.strokeOpacity = ctx.strokeOpacity || 1;
    this.strokeStyle = ctx.strokeStyle || "#000000";
    this.fillStyle = ctx.fillStyle || "#000000";
    this.isFillTransparent = ctx.isFillTransparent || false;
    this.fillOpacity = ctx.fillOpacity || 1;
    this.font = ctx.font || "10px sans-serif";
    this.textBaseline = ctx.textBaseline || "alphabetic";
    this.textAlign = ctx.textAlign || "left";
    this.lineWidth = ctx.lineWidth || 1;
    this.lineJoin = ctx.lineJoin || "miter";
    this.lineCap = ctx.lineCap || "butt";
    this.path = ctx.path || [];
    this.transform =
      typeof ctx.transform !== "undefined"
        ? ctx.transform.clone()
        : new Matrix();
    this.globalCompositeOperation = ctx.globalCompositeOperation || "normal";
    this.globalAlpha = ctx.globalAlpha || 1.0;
    this.clip_path = ctx.clip_path || [];
    this.currentPoint = ctx.currentPoint || new Point();
    this.miterLimit = ctx.miterLimit || 10.0;
    this.lastPoint = ctx.lastPoint || new Point();
    this.lineDashOffset = ctx.lineDashOffset || 0.0;
    this.lineDash = ctx.lineDash || [];
    this.margin = ctx.margin || [0, 0, 0, 0];
    this.prevPageLastElemOffset = ctx.prevPageLastElemOffset || 0;

    this.ignoreClearRect =
      typeof ctx.ignoreClearRect === "boolean" ? ctx.ignoreClearRect : true;
  }
}

/** Return value of Context2D#measureText(). */
class TextMetrics {
  declare readonly width: number;

  constructor(options?: { width?: number }) {
    options = options || {};
    var _width = options.width || 0;
    Object.defineProperty(this, "width", {
      get: function (): number {
        return _width;
      }
    });
  }
}

/**
 * This plugin mimics the HTML5 CanvasRenderingContext2D.
 *
 * The goal is to provide a way for current canvas implementations to print directly to a PDF.
 *
 * @name context2d
 * @module
 */
class Context2D {
  // The members below are backed by Object.defineProperty accessors created
  // in the constructor (several of them proxy the shared module-level `_ctx`
  // layer, faithful to the original implementation); `declare` only provides
  // their types and emits no runtime code.
  declare readonly canvas: { parentNode: boolean; style: boolean };
  declare readonly pdf: jsPDFDocument;
  declare pageWrapXEnabled: boolean;
  declare pageWrapYEnabled: boolean;
  declare posX: number;
  declare posY: number;
  declare margin: number[];
  declare autoPaging: boolean | "slice" | "text";
  declare lastBreak: number;
  declare pageBreaks: number[];
  declare ctx: ContextLayer;
  declare path: PathEntry[];
  declare ctxStack: ContextLayer[];
  declare fillStyle: string | CanvasGradientStub;
  declare strokeStyle: string | CanvasGradientStub;
  declare lineCap: string;
  declare lineWidth: number;
  declare lineJoin: string;
  declare miterLimit: number;
  declare textBaseline: string;
  declare textAlign: string;
  declare fontFaces: FontFaceInput[] | null;
  declare font: string;
  declare globalCompositeOperation: string;
  declare globalAlpha: number;
  declare lineDashOffset: number;
  declare lineDash: number[];
  declare ignoreClearRect: boolean;
  /** Last line dash state written to the PDF (see setLineDash below). */
  declare prevLineDash?: string;
  /** Assigned by the canvas plugin (src/modules/canvas.ts). */
  declare pageWrapX: number;
  /** Assigned by the canvas plugin (src/modules/canvas.ts). */
  declare pageWrapY: number;

  constructor(pdf: jsPDFDocument) {
    Object.defineProperty(this, "canvas", {
      get: function () {
        return { parentNode: false, style: false };
      }
    });

    var _pdf = pdf;
    Object.defineProperty(this, "pdf", {
      get: function () {
        return _pdf;
      }
    });

    var _pageWrapXEnabled = false;
    /**
     * @name pageWrapXEnabled
     * @type {boolean}
     * @default false
     */
    Object.defineProperty(this, "pageWrapXEnabled", {
      get: function () {
        return _pageWrapXEnabled;
      },
      set: function (value: boolean) {
        _pageWrapXEnabled = Boolean(value);
      }
    });

    var _pageWrapYEnabled = false;
    /**
     * @name pageWrapYEnabled
     * @type {boolean}
     * @default true
     */
    Object.defineProperty(this, "pageWrapYEnabled", {
      get: function () {
        return _pageWrapYEnabled;
      },
      set: function (value: boolean) {
        _pageWrapYEnabled = Boolean(value);
      }
    });

    var _posX = 0;
    /**
     * @name posX
     * @type {number}
     * @default 0
     */
    Object.defineProperty(this, "posX", {
      get: function () {
        return _posX;
      },
      set: function (value: number) {
        if (!isNaN(value)) {
          _posX = value;
        }
      }
    });

    var _posY = 0;
    /**
     * @name posY
     * @type {number}
     * @default 0
     */
    Object.defineProperty(this, "posY", {
      get: function () {
        return _posY;
      },
      set: function (value: number) {
        if (!isNaN(value)) {
          _posY = value;
        }
      }
    });

    /**
     * Gets or sets the page margin when using auto paging. Has no effect when {@link autoPaging} is off.
     * @name margin
     * @type {number|number[]}
     * @default [0, 0, 0, 0]
     */
    Object.defineProperty(this, "margin", {
      get: function () {
        return _ctx.margin;
      },
      set: function (value: number | number[]) {
        var margin: number[];
        if (typeof value === "number") {
          margin = [value, value, value, value];
        } else {
          margin = new Array(4);
          margin[0] = value[0];
          margin[1] = value.length >= 2 ? value[1] : margin[0];
          margin[2] = value.length >= 3 ? value[2] : margin[0];
          margin[3] = value.length >= 4 ? value[3] : margin[1];
        }
        _ctx.margin = margin;
      }
    });

    var _autoPaging: boolean | "slice" | "text" = false;
    /**
     * Gets or sets the auto paging mode. When auto paging is enabled, the context2d will automatically draw on the
     * next page if a shape or text chunk doesn't fit entirely on the current page. The context2d will create new
     * pages if required.
     *
     * Context2d supports different modes:
     * <ul>
     * <li>
     *   <code>false</code>: Auto paging is disabled.
     * </li>
     * <li>
     *   <code>true</code> or <code>'slice'</code>: Will cut shapes or text chunks across page breaks. Will possibly
     *   slice text in half, making it difficult to read.
     * </li>
     * <li>
     *   <code>'text'</code>: Trys not to cut text in half across page breaks. Works best for documents consisting
     *   mostly of a single column of text.
     * </li>
     * </ul>
     * @name Context2D#autoPaging
     * @type {boolean|"slice"|"text"}
     * @default false
     */
    Object.defineProperty(this, "autoPaging", {
      get: function () {
        return _autoPaging;
      },
      set: function (value: boolean | "slice" | "text") {
        _autoPaging = value;
      }
    });

    var lastBreak = 0;
    /**
     * @name lastBreak
     * @type {number}
     * @default 0
     */
    Object.defineProperty(this, "lastBreak", {
      get: function () {
        return lastBreak;
      },
      set: function (value: number) {
        lastBreak = value;
      }
    });

    var pageBreaks: number[] = [];
    /**
     * Y Position of page breaks.
     * @name pageBreaks
     * @type {number}
     * @default 0
     */
    Object.defineProperty(this, "pageBreaks", {
      get: function () {
        return pageBreaks;
      },
      set: function (value: number[]) {
        pageBreaks = value;
      }
    });

    /**
     * @name ctx
     * @type {object}
     * @default {}
     */
    Object.defineProperty(this, "ctx", {
      get: function () {
        return _ctx;
      },
      set: function (value: ContextLayer) {
        if (value instanceof ContextLayer) {
          _ctx = value;
        }
      }
    });

    /**
     * @name path
     * @type {array}
     * @default []
     */
    Object.defineProperty(this, "path", {
      get: function () {
        return _ctx.path;
      },
      set: function (value: PathEntry[]) {
        _ctx.path = value;
      }
    });

    /**
     * @name ctxStack
     * @type {array}
     * @default []
     */
    var _ctxStack: ContextLayer[] = [];
    Object.defineProperty(this, "ctxStack", {
      get: function () {
        return _ctxStack;
      },
      set: function (value: ContextLayer[]) {
        _ctxStack = value;
      }
    });

    /**
     * Sets or returns the color, gradient, or pattern used to fill the drawing
     *
     * @name fillStyle
     * @default #000000
     * @property {(color|gradient|pattern)} value The color of the drawing. Default value is #000000<br />
     * A gradient object (linear or radial) used to fill the drawing (not supported by context2d)<br />
     * A pattern object to use to fill the drawing (not supported by context2d)
     */
    Object.defineProperty(this, "fillStyle", {
      get: function (this: Context2D) {
        return this.ctx.fillStyle;
      },
      set: function (this: Context2D, value: string | CanvasGradientStub) {
        var rgba;
        rgba = getRGBA(value);

        this.ctx.fillStyle = rgba.style;
        this.ctx.isFillTransparent = rgba.a === 0;
        this.ctx.fillOpacity = rgba.a;

        this.pdf.setFillColor(rgba.r, rgba.g, rgba.b, { a: rgba.a });
        this.pdf.setTextColor(rgba.r, rgba.g, rgba.b, { a: rgba.a });
      }
    });

    /**
     * Sets or returns the color, gradient, or pattern used for strokes
     *
     * @name strokeStyle
     * @default #000000
     * @property {color} color A CSS color value that indicates the stroke color of the drawing. Default value is #000000 (not supported by context2d)
     * @property {gradient} gradient A gradient object (linear or radial) used to create a gradient stroke (not supported by context2d)
     * @property {pattern} pattern A pattern object used to create a pattern stroke (not supported by context2d)
     */
    Object.defineProperty(this, "strokeStyle", {
      get: function (this: Context2D) {
        return this.ctx.strokeStyle;
      },
      set: function (this: Context2D, value: string | CanvasGradientStub) {
        var rgba = getRGBA(value);

        this.ctx.strokeStyle = rgba.style;
        this.ctx.isStrokeTransparent = rgba.a === 0;
        this.ctx.strokeOpacity = rgba.a;

        if (rgba.a === 0) {
          this.pdf.setDrawColor(255, 255, 255);
        } else if (rgba.a === 1) {
          this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
        } else {
          this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
        }
      }
    });

    /**
     * Sets or returns the style of the end caps for a line
     *
     * @name lineCap
     * @default butt
     * @property {(butt|round|square)} lineCap butt A flat edge is added to each end of the line <br/>
     * round A rounded end cap is added to each end of the line<br/>
     * square A square end cap is added to each end of the line<br/>
     */
    Object.defineProperty(this, "lineCap", {
      get: function (this: Context2D) {
        return this.ctx.lineCap;
      },
      set: function (this: Context2D, value: string) {
        if (["butt", "round", "square"].indexOf(value) !== -1) {
          this.ctx.lineCap = value;
          this.pdf.setLineCap(value);
        }
      }
    });

    /**
     * Sets or returns the current line width
     *
     * @name lineWidth
     * @default 1
     * @property {number} lineWidth The current line width, in pixels
     */
    Object.defineProperty(this, "lineWidth", {
      get: function (this: Context2D) {
        return this.ctx.lineWidth;
      },
      set: function (this: Context2D, value: number) {
        if (!isNaN(value)) {
          this.ctx.lineWidth = value;
          this.pdf.setLineWidth(value);
        }
      }
    });

    /**
     * Sets or returns the type of corner created, when two lines meet
     */
    Object.defineProperty(this, "lineJoin", {
      get: function (this: Context2D) {
        return this.ctx.lineJoin;
      },
      set: function (this: Context2D, value: string) {
        if (["bevel", "round", "miter"].indexOf(value) !== -1) {
          this.ctx.lineJoin = value;
          this.pdf.setLineJoin(value);
        }
      }
    });

    /**
     * A number specifying the miter limit ratio in coordinate space units. Zero, negative, Infinity, and NaN values are ignored. The default value is 10.0.
     *
     * @name miterLimit
     * @default 10
     */
    Object.defineProperty(this, "miterLimit", {
      get: function (this: Context2D) {
        return this.ctx.miterLimit;
      },
      set: function (this: Context2D, value: number) {
        if (!isNaN(value)) {
          this.ctx.miterLimit = value;
          this.pdf.setMiterLimit(value);
        }
      }
    });

    Object.defineProperty(this, "textBaseline", {
      get: function (this: Context2D) {
        return this.ctx.textBaseline;
      },
      set: function (this: Context2D, value: string) {
        this.ctx.textBaseline = value;
      }
    });

    Object.defineProperty(this, "textAlign", {
      get: function (this: Context2D) {
        return this.ctx.textAlign;
      },
      set: function (this: Context2D, value: string) {
        if (["right", "end", "center", "left", "start"].indexOf(value) !== -1) {
          this.ctx.textAlign = value;
        }
      }
    });

    var _fontFaceMap: FontFaceMap | null = null;
    var _cachedFontList: string | null = null;

    function getFontFaceMap(
      pdf: jsPDFDocument,
      fontFaces: FontFaceInput[]
    ): FontFaceMap {
      var currentFontMap = pdf.getFontList();

      // Check if the font list has changed by comparing the JSON representation
      var currentFontMapString = JSON.stringify(currentFontMap);

      if (_fontFaceMap === null || _cachedFontList !== currentFontMapString) {
        var convertedFontFaces = convertToFontFaces(currentFontMap);

        _fontFaceMap = buildFontFaceMap(convertedFontFaces.concat(fontFaces));
        _cachedFontList = currentFontMapString;
      }

      return _fontFaceMap;
    }

    function convertToFontFaces(
      fontMap: Record<string, string[]>
    ): FontFaceInput[] {
      var fontFaces: FontFaceInput[] = [];

      Object.keys(fontMap).forEach(function (family) {
        var styles = fontMap[family];

        styles.forEach(function (style) {
          var fontFace: FontFaceInput | null = null;

          switch (style) {
            case "bold":
              fontFace = {
                family: family,
                weight: "bold"
              };
              break;

            case "italic":
              fontFace = {
                family: family,
                style: "italic"
              };
              break;

            case "bolditalic":
              fontFace = {
                family: family,
                weight: "bold",
                style: "italic"
              };
              break;

            case "":
            case "normal":
              fontFace = {
                family: family
              };
              break;
          }

          // If font-face is still null here, it is a font with some styling we don't recognize and
          // cannot map or it is a font added via the fontFaces option of .html().
          if (fontFace !== null) {
            fontFace.ref = {
              name: family,
              style: style
            };

            fontFaces.push(fontFace);
          }
        });
      });

      return fontFaces;
    }

    var _fontFaces: FontFaceInput[] | null = null;
    /**
     * A map of available font-faces, as passed in the options of
     * .html(). If set a limited implementation of the font style matching
     * algorithm defined by https://www.w3.org/TR/css-fonts-3/#font-matching-algorithm
     * will be used. If not set it will fallback to previous behavior.
     */

    Object.defineProperty(this, "fontFaces", {
      get: function () {
        return _fontFaces;
      },
      set: function (value: FontFaceInput[] | null) {
        _fontFaceMap = null;
        _cachedFontList = null;
        _fontFaces = value;
      }
    });

    Object.defineProperty(this, "font", {
      get: function (this: Context2D) {
        return this.ctx.font;
      },
      set: function (this: Context2D, value: string) {
        this.ctx.font = value;

        //source: https://stackoverflow.com/a/10136041
        // eslint-disable-next-line no-useless-escape
        var rx =
          /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-_,\"\'\sa-z0-9]+?)\s*$/i;
        var matches = rx.exec(value);
        if (matches === null) {
          return;
        }
        var fontStyle = matches[1];
        // eslint-disable-next-line no-unused-vars
        var fontVariant = matches[2];
        var fontWeight = matches[3];
        var fontSize = matches[4];
        // eslint-disable-next-line no-unused-vars
        var lineHeight = matches[5];
        var fontFamily = matches[6];

        var rxFontSize = /^([.\d]+)((?:%|in|[cem]m|ex|p[ctx]))$/i;
        // Keyword sizes ("medium", "smaller", ...) make exec return null and
        // this line throw — faithful to the untyped implementation.
        var fontSizeUnit = rxFontSize.exec(fontSize)![2];
        var fontSizeNumber: number;

        if ("px" === fontSizeUnit) {
          fontSizeNumber = Math.floor(
            parseFloat(fontSize) * this.pdf.internal.scaleFactor
          );
        } else if ("em" === fontSizeUnit) {
          fontSizeNumber = Math.floor(
            parseFloat(fontSize) * this.pdf.getFontSize()
          );
        } else {
          fontSizeNumber = Math.floor(
            parseFloat(fontSize) * this.pdf.internal.scaleFactor
          );
        }

        this.pdf.setFontSize(fontSizeNumber);
        var parts = parseFontFamily(fontFamily);

        if (this.fontFaces) {
          var fontFaceMap = getFontFaceMap(this.pdf, this.fontFaces);

          var rules = parts.map(function (ff) {
            return {
              family: ff,
              stretch: "normal", // TODO: Extract font-stretch from font rule (perhaps write proper parser for it?)
              weight: fontWeight,
              style: fontStyle
            };
          });

          var font = resolveFontFace(fontFaceMap, rules);
          this.pdf.setFont(font.ref.name, font.ref.style);
          return;
        }

        var style = "";
        if (
          fontWeight === "bold" ||
          parseInt(fontWeight, 10) >= 700 ||
          fontStyle === "bold"
        ) {
          style = "bold";
        }

        if (fontStyle === "italic") {
          style += "italic";
        }

        if (style.length === 0) {
          style = "normal";
        }
        var jsPdfFontName = "";

        var fallbackFonts: Record<string, string> = {
          arial: "Helvetica",
          Arial: "Helvetica",
          verdana: "Helvetica",
          Verdana: "Helvetica",
          helvetica: "Helvetica",
          Helvetica: "Helvetica",
          "sans-serif": "Helvetica",
          fixed: "Courier",
          monospace: "Courier",
          terminal: "Courier",
          cursive: "Times",
          fantasy: "Times",
          serif: "Times"
        };

        for (var i = 0; i < parts.length; i++) {
          if (
            this.pdf.internal.getFont(parts[i], style, {
              noFallback: true,
              disableWarning: true
            }) !== undefined
          ) {
            jsPdfFontName = parts[i];
            break;
          } else if (
            style === "bolditalic" &&
            this.pdf.internal.getFont(parts[i], "bold", {
              noFallback: true,
              disableWarning: true
            }) !== undefined
          ) {
            jsPdfFontName = parts[i];
            style = "bold";
          } else if (
            this.pdf.internal.getFont(parts[i], "normal", {
              noFallback: true,
              disableWarning: true
            }) !== undefined
          ) {
            jsPdfFontName = parts[i];
            style = "normal";
            break;
          }
        }
        if (jsPdfFontName === "") {
          for (var j = 0; j < parts.length; j++) {
            if (fallbackFonts[parts[j]]) {
              jsPdfFontName = fallbackFonts[parts[j]];
              break;
            }
          }
        }
        jsPdfFontName = jsPdfFontName === "" ? "Times" : jsPdfFontName;
        this.pdf.setFont(jsPdfFontName, style);
      }
    });

    Object.defineProperty(this, "globalCompositeOperation", {
      get: function (this: Context2D) {
        return this.ctx.globalCompositeOperation;
      },
      set: function (this: Context2D, value: string) {
        this.ctx.globalCompositeOperation = value;
      }
    });

    Object.defineProperty(this, "globalAlpha", {
      get: function (this: Context2D) {
        return this.ctx.globalAlpha;
      },
      set: function (this: Context2D, value: number) {
        this.ctx.globalAlpha = value;
      }
    });

    /**
     * A float specifying the amount of the line dash offset. The default value is 0.0.
     *
     * @name lineDashOffset
     * @default 0.0
     */
    Object.defineProperty(this, "lineDashOffset", {
      get: function (this: Context2D) {
        return this.ctx.lineDashOffset;
      },
      set: function (this: Context2D, value: number) {
        this.ctx.lineDashOffset = value;
        setLineDash.call(this);
      }
    });

    // Not HTML API
    Object.defineProperty(this, "lineDash", {
      get: function (this: Context2D) {
        return this.ctx.lineDash;
      },
      set: function (this: Context2D, value: number[]) {
        this.ctx.lineDash = value;
        setLineDash.call(this);
      }
    });

    // Not HTML API
    Object.defineProperty(this, "ignoreClearRect", {
      get: function (this: Context2D) {
        return this.ctx.ignoreClearRect;
      },
      set: function (this: Context2D, value: boolean) {
        this.ctx.ignoreClearRect = Boolean(value);
      }
    });
  }

  /**
   * Sets the line dash pattern used when stroking lines.
   * @name setLineDash
   * @function
   * @description It uses an array of values that specify alternating lengths of lines and gaps which describe the pattern.
   */
  setLineDash(dashArray: number[]): void {
    this.lineDash = dashArray;
  }

  /**
   * gets the current line dash pattern.
   * @name getLineDash
   * @function
   * @returns {Array} An Array of numbers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number, when setting the elements, is odd, the elements of the array get copied and concatenated. For example, setting the line dash to [5, 15, 25] will result in getting back [5, 15, 25, 5, 15, 25].
   */
  getLineDash(): number[] {
    if (this.lineDash.length % 2) {
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getLineDash#return_value
      return this.lineDash.concat(this.lineDash);
    } else {
      // The copied value is returned to prevent contamination from outside.
      return this.lineDash.slice();
    }
  }

  fill(): void {
    pathPreProcess.call(this, "fill", false);
  }

  /**
   * Actually draws the path you have defined
   *
   * @name stroke
   * @function
   * @description The stroke() method actually draws the path you have defined with all those moveTo() and lineTo() methods. The default color is black.
   */
  stroke(): void {
    pathPreProcess.call(this, "stroke", false);
  }

  /**
   * Begins a path, or resets the current
   *
   * @name beginPath
   * @function
   * @description The beginPath() method begins a path, or resets the current path.
   */
  beginPath(): void {
    this.path = [
      {
        type: "begin"
      }
    ];
  }

  /**
   * Moves the path to the specified point in the canvas, without creating a line
   *
   * @name moveTo
   * @function
   * @param x {Number} The x-coordinate of where to move the path to
   * @param y {Number} The y-coordinate of where to move the path to
   */
  moveTo(x: number, y: number): void {
    if (isNaN(x) || isNaN(y)) {
      console.error("jsPDF.context2d.moveTo: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.moveTo");
    }

    var pt = this.ctx.transform.applyToPoint(new Point(x, y));

    this.path.push({
      type: "mt",
      x: pt.x,
      y: pt.y
    });
    this.ctx.lastPoint = new Point(x, y);
  }

  /**
   * Creates a path from the current point back to the starting point
   *
   * @name closePath
   * @function
   * @description The closePath() method creates a path from the current point back to the starting point.
   */
  closePath(): void {
    var pathBegin = new Point(0, 0);
    var i = 0;
    for (i = this.path.length - 1; i !== -1; i--) {
      if (this.path[i].type === "begin") {
        if (
          typeof this.path[i + 1] === "object" &&
          typeof this.path[i + 1].x === "number"
        ) {
          pathBegin = new Point(this.path[i + 1].x, this.path[i + 1].y);
          break;
        }
      }
    }
    this.path.push({
      type: "close"
    });
    this.ctx.lastPoint = new Point(pathBegin.x, pathBegin.y);
  }

  /**
   * Adds a new point and creates a line to that point from the last specified point in the canvas
   *
   * @name lineTo
   * @function
   * @param x The x-coordinate of where to create the line to
   * @param y The y-coordinate of where to create the line to
   * @description The lineTo() method adds a new point and creates a line TO that point FROM the last specified point in the canvas (this method does not draw the line).
   */
  lineTo(x: number, y: number): void {
    if (isNaN(x) || isNaN(y)) {
      console.error("jsPDF.context2d.lineTo: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.lineTo");
    }

    var pt = this.ctx.transform.applyToPoint(new Point(x, y));

    this.path.push({
      type: "lt",
      x: pt.x,
      y: pt.y
    });
    this.ctx.lastPoint = new Point(pt.x, pt.y);
  }

  /**
   * Clips a region of any shape and size from the original canvas
   *
   * @name clip
   * @function
   * @description The clip() method clips a region of any shape and size from the original canvas.
   */
  clip(): void {
    this.ctx.clip_path = JSON.parse(JSON.stringify(this.path));
    pathPreProcess.call(this, null, true);
  }

  /**
   * Creates a cubic Bézier curve
   *
   * @name quadraticCurveTo
   * @function
   * @param cpx {Number} The x-coordinate of the Bézier control point
   * @param cpy {Number} The y-coordinate of the Bézier control point
   * @param x {Number} The x-coordinate of the ending point
   * @param y {Number} The y-coordinate of the ending point
   * @description The quadraticCurveTo() method adds a point to the current path by using the specified control points that represent a quadratic Bézier curve.<br /><br /> A quadratic Bézier curve requires two points. The first point is a control point that is used in the quadratic Bézier calculation and the second point is the ending point for the curve. The starting point for the curve is the last point in the current path. If a path does not exist, use the beginPath() and moveTo() methods to define a starting point.
   */
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    if (isNaN(x) || isNaN(y) || isNaN(cpx) || isNaN(cpy)) {
      console.error(
        "jsPDF.context2d.quadraticCurveTo: Invalid arguments",
        arguments
      );
      throw new Error(
        "Invalid arguments passed to jsPDF.context2d.quadraticCurveTo"
      );
    }

    var pt0 = this.ctx.transform.applyToPoint(new Point(x, y));
    var pt1 = this.ctx.transform.applyToPoint(new Point(cpx, cpy));

    this.path.push({
      type: "qct",
      x1: pt1.x,
      y1: pt1.y,
      x: pt0.x,
      y: pt0.y
    });
    this.ctx.lastPoint = new Point(pt0.x, pt0.y);
  }

  /**
   * Creates a cubic Bézier curve
   *
   * @name bezierCurveTo
   * @function
   * @param cp1x {Number} The x-coordinate of the first Bézier control point
   * @param cp1y {Number} The y-coordinate of the first Bézier control point
   * @param cp2x {Number} The x-coordinate of the second Bézier control point
   * @param cp2y {Number} The y-coordinate of the second Bézier control point
   * @param x {Number} The x-coordinate of the ending point
   * @param y {Number} The y-coordinate of the ending point
   * @description The bezierCurveTo() method adds a point to the current path by using the specified control points that represent a cubic Bézier curve. <br /><br />A cubic bezier curve requires three points. The first two points are control points that are used in the cubic Bézier calculation and the last point is the ending point for the curve.  The starting point for the curve is the last point in the current path. If a path does not exist, use the beginPath() and moveTo() methods to define a starting point.
   */
  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ): void {
    if (
      isNaN(x) ||
      isNaN(y) ||
      isNaN(cp1x) ||
      isNaN(cp1y) ||
      isNaN(cp2x) ||
      isNaN(cp2y)
    ) {
      console.error(
        "jsPDF.context2d.bezierCurveTo: Invalid arguments",
        arguments
      );
      throw new Error(
        "Invalid arguments passed to jsPDF.context2d.bezierCurveTo"
      );
    }
    var pt0 = this.ctx.transform.applyToPoint(new Point(x, y));
    var pt1 = this.ctx.transform.applyToPoint(new Point(cp1x, cp1y));
    var pt2 = this.ctx.transform.applyToPoint(new Point(cp2x, cp2y));

    this.path.push({
      type: "bct",
      x1: pt1.x,
      y1: pt1.y,
      x2: pt2.x,
      y2: pt2.y,
      x: pt0.x,
      y: pt0.y
    });
    this.ctx.lastPoint = new Point(pt0.x, pt0.y);
  }

  /**
   * Creates an arc/curve (used to create circles, or parts of circles)
   *
   * @name arc
   * @function
   * @param x {Number} The x-coordinate of the center of the circle
   * @param y {Number} The y-coordinate of the center of the circle
   * @param radius {Number} The radius of the circle
   * @param startAngle {Number} The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
   * @param endAngle {Number} The ending angle, in radians
   * @param counterclockwise {Boolean} Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
   * @description The arc() method creates an arc/curve (used to create circles, or parts of circles).
   */
  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ): void {
    if (
      isNaN(x) ||
      isNaN(y) ||
      isNaN(radius) ||
      isNaN(startAngle) ||
      isNaN(endAngle)
    ) {
      console.error("jsPDF.context2d.arc: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.arc");
    }
    counterclockwise = Boolean(counterclockwise);

    if (!this.ctx.transform.isIdentity) {
      var xpt = this.ctx.transform.applyToPoint(new Point(x, y));
      x = xpt.x;
      y = xpt.y;

      var x_radPt = this.ctx.transform.applyToPoint(new Point(0, radius));
      var x_radPt0 = this.ctx.transform.applyToPoint(new Point(0, 0));
      radius = Math.sqrt(
        Math.pow(x_radPt.x - x_radPt0.x, 2) +
          Math.pow(x_radPt.y - x_radPt0.y, 2)
      );
    }
    if (Math.abs(endAngle - startAngle) >= 2 * Math.PI) {
      startAngle = 0;
      endAngle = 2 * Math.PI;
    }

    this.path.push({
      type: "arc",
      x: x,
      y: y,
      radius: radius,
      startAngle: startAngle,
      endAngle: endAngle,
      counterclockwise: counterclockwise
    });
    // this.ctx.lastPoint(new Point(pt.x,pt.y));
  }

  /**
   * Creates an arc/curve between two tangents
   *
   * @name arcTo
   * @function
   * @param x1 {Number} The x-coordinate of the first tangent
   * @param y1 {Number} The y-coordinate of the first tangent
   * @param x2 {Number} The x-coordinate of the second tangent
   * @param y2 {Number} The y-coordinate of the second tangent
   * @param radius The radius of the arc
   * @description The arcTo() method creates an arc/curve between two tangents on the canvas.
   */
  // eslint-disable-next-line no-unused-vars
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    throw new Error("arcTo not implemented.");
  }

  /**
   * Creates a rectangle
   *
   * @name rect
   * @function
   * @param x {Number} The x-coordinate of the upper-left corner of the rectangle
   * @param y {Number} The y-coordinate of the upper-left corner of the rectangle
   * @param w {Number} The width of the rectangle, in pixels
   * @param h {Number} The height of the rectangle, in pixels
   * @description The rect() method creates a rectangle.
   */
  rect(x: number, y: number, w: number, h: number): void {
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      console.error("jsPDF.context2d.rect: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.rect");
    }
    this.moveTo(x, y);
    this.lineTo(x + w, y);
    this.lineTo(x + w, y + h);
    this.lineTo(x, y + h);
    this.lineTo(x, y);
    this.lineTo(x + w, y);
    this.lineTo(x, y);
  }

  /**
   * Draws a "filled" rectangle
   *
   * @name fillRect
   * @function
   * @param x {Number} The x-coordinate of the upper-left corner of the rectangle
   * @param y {Number} The y-coordinate of the upper-left corner of the rectangle
   * @param w {Number} The width of the rectangle, in pixels
   * @param h {Number} The height of the rectangle, in pixels
   * @description The fillRect() method draws a "filled" rectangle. The default color of the fill is black.
   */
  fillRect(x: number, y: number, w: number, h: number): void {
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      console.error("jsPDF.context2d.fillRect: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.fillRect");
    }
    if (isFillTransparent.call(this)) {
      return;
    }
    var tmp: { lineCap?: string; lineJoin?: string } = {};
    if (this.lineCap !== "butt") {
      tmp.lineCap = this.lineCap;
      this.lineCap = "butt";
    }
    if (this.lineJoin !== "miter") {
      tmp.lineJoin = this.lineJoin;
      this.lineJoin = "miter";
    }

    this.beginPath();
    this.rect(x, y, w, h);
    this.fill();

    if (tmp.hasOwnProperty("lineCap")) {
      this.lineCap = tmp.lineCap!;
    }
    if (tmp.hasOwnProperty("lineJoin")) {
      this.lineJoin = tmp.lineJoin!;
    }
  }

  /**
   *     Draws a rectangle (no fill)
   *
   * @name strokeRect
   * @function
   * @param x {Number} The x-coordinate of the upper-left corner of the rectangle
   * @param y {Number} The y-coordinate of the upper-left corner of the rectangle
   * @param w {Number} The width of the rectangle, in pixels
   * @param h {Number} The height of the rectangle, in pixels
   * @description The strokeRect() method draws a rectangle (no fill). The default color of the stroke is black.
   */
  strokeRect(x: number, y: number, w: number, h: number): void {
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      console.error("jsPDF.context2d.strokeRect: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.strokeRect");
    }
    if (isStrokeTransparent.call(this)) {
      return;
    }
    this.beginPath();
    this.rect(x, y, w, h);
    this.stroke();
  }

  /**
   * Clears the specified pixels within a given rectangle
   *
   * @name clearRect
   * @function
   * @param x {Number} The x-coordinate of the upper-left corner of the rectangle
   * @param y {Number} The y-coordinate of the upper-left corner of the rectangle
   * @param w {Number} The width of the rectangle to clear, in pixels
   * @param h {Number} The height of the rectangle to clear, in pixels
   * @description We cannot clear PDF commands that were already written to PDF, so we use white instead. <br />
   * As a special case, read a special flag (ignoreClearRect) and do nothing if it is set.
   * This results in all calls to clearRect() to do nothing, and keep the canvas transparent.
   * This flag is stored in the save/restore context and is managed the same way as other drawing states.
   *
   */
  clearRect(x: number, y: number, w: number, h: number): void {
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      console.error("jsPDF.context2d.clearRect: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.clearRect");
    }
    if (this.ignoreClearRect) {
      return;
    }

    this.fillStyle = "#ffffff";
    this.fillRect(x, y, w, h);
  }

  /**
   * Saves the state of the current context
   *
   * @name save
   * @function
   */
  save(doStackPush?: boolean): void {
    doStackPush = typeof doStackPush === "boolean" ? doStackPush : true;
    var tmpPageNumber = this.pdf.internal.getCurrentPageInfo().pageNumber;
    for (var i = 0; i < this.pdf.internal.getNumberOfPages(); i++) {
      this.pdf.setPage(i + 1);
      this.pdf.internal.out("q");
    }
    this.pdf.setPage(tmpPageNumber);

    if (doStackPush) {
      this.ctx.fontSize = this.pdf.internal.getFontSize();
      var ctx = new ContextLayer(this.ctx);
      this.ctxStack.push(this.ctx);
      this.ctx = ctx;
    }
  }

  /**
   * Returns previously saved path state and attributes
   *
   * @name restore
   * @function
   */
  restore(doStackPop?: boolean): void {
    doStackPop = typeof doStackPop === "boolean" ? doStackPop : true;
    var tmpPageNumber = this.pdf.internal.getCurrentPageInfo().pageNumber;
    for (var i = 0; i < this.pdf.internal.getNumberOfPages(); i++) {
      this.pdf.setPage(i + 1);
      this.pdf.internal.out("Q");
    }
    this.pdf.setPage(tmpPageNumber);

    if (doStackPop && this.ctxStack.length !== 0) {
      // Non-empty stack checked above, so pop() cannot return undefined.
      this.ctx = this.ctxStack.pop()!;
      this.fillStyle = this.ctx.fillStyle;
      this.strokeStyle = this.ctx.strokeStyle;
      this.font = this.ctx.font;
      this.lineCap = this.ctx.lineCap;
      this.lineWidth = this.ctx.lineWidth;
      this.lineJoin = this.ctx.lineJoin;
      this.lineDash = this.ctx.lineDash;
      this.lineDashOffset = this.ctx.lineDashOffset;
    }
  }

  /**
   * @name toDataURL
   * @function
   */
  toDataURL(): never {
    throw new Error("toDataUrl not implemented.");
  }

  /**
   * Draws "filled" text on the canvas
   *
   * @name fillText
   * @function
   * @param text {String} Specifies the text that will be written on the canvas
   * @param x {Number} The x coordinate where to start painting the text (relative to the canvas)
   * @param y {Number} The y coordinate where to start painting the text (relative to the canvas)
   * @param maxWidth {Number} Optional. The maximum allowed width of the text, in pixels
   * @description The fillText() method draws filled text on the canvas. The default color of the text is black.
   */
  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    if (isNaN(x) || isNaN(y) || typeof text !== "string") {
      console.error("jsPDF.context2d.fillText: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.fillText");
    }
    // Same effective condition as the historic `isNaN(maxWidth)` (which is
    // true for undefined), spelled out for the benefit of narrowing.
    maxWidth = maxWidth === undefined || isNaN(maxWidth) ? undefined : maxWidth;
    if (isFillTransparent.call(this)) {
      return;
    }

    var degs = rad2deg(this.ctx.transform.rotation);

    // We only use X axis as scale hint
    var scale = this.ctx.transform.scaleX;

    putText.call(this, {
      text: text,
      x: x,
      y: y,
      scale: scale,
      angle: degs,
      align: this.textAlign,
      maxWidth: maxWidth
    });
  }

  /**
   * Draws text on the canvas (no fill)
   *
   * @name strokeText
   * @function
   * @param text {String} Specifies the text that will be written on the canvas
   * @param x {Number} The x coordinate where to start painting the text (relative to the canvas)
   * @param y {Number} The y coordinate where to start painting the text (relative to the canvas)
   * @param maxWidth {Number} Optional. The maximum allowed width of the text, in pixels
   * @description The strokeText() method draws text (with no fill) on the canvas. The default color of the text is black.
   */
  strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    if (isNaN(x) || isNaN(y) || typeof text !== "string") {
      console.error("jsPDF.context2d.strokeText: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.strokeText");
    }
    if (isStrokeTransparent.call(this)) {
      return;
    }

    // Same effective condition as the historic `isNaN(maxWidth)` (which is
    // true for undefined), spelled out for the benefit of narrowing.
    maxWidth = maxWidth === undefined || isNaN(maxWidth) ? undefined : maxWidth;

    var degs = rad2deg(this.ctx.transform.rotation);
    var scale = this.ctx.transform.scaleX;

    putText.call(this, {
      text: text,
      x: x,
      y: y,
      scale: scale,
      renderingMode: "stroke",
      angle: degs,
      align: this.textAlign,
      maxWidth: maxWidth
    });
  }

  /**
   * Returns an object that contains the width of the specified text
   *
   * @name measureText
   * @function
   * @param text {String} The text to be measured
   * @description The measureText() method returns an object that contains the width of the specified text, in pixels.
   * @returns {Number}
   */
  measureText(text: string): TextMetrics {
    if (typeof text !== "string") {
      console.error(
        "jsPDF.context2d.measureText: Invalid arguments",
        arguments
      );
      throw new Error(
        "Invalid arguments passed to jsPDF.context2d.measureText"
      );
    }
    var pdf = this.pdf;
    var k = this.pdf.internal.scaleFactor;

    var fontSize = pdf.internal.getFontSize();
    var txtWidth =
      (pdf.getStringUnitWidth(text) * fontSize) / pdf.internal.scaleFactor;
    txtWidth *= Math.round(((k * 96) / 72) * 10000) / 10000;

    return new TextMetrics({ width: txtWidth });
  }

  //Transformations

  /**
   * Scales the current drawing bigger or smaller
   *
   * @name scale
   * @function
   * @param scalewidth {Number} Scales the width of the current drawing (1=100%, 0.5=50%, 2=200%, etc.)
   * @param scaleheight {Number} Scales the height of the current drawing (1=100%, 0.5=50%, 2=200%, etc.)
   * @description The scale() method scales the current drawing, bigger or smaller.
   */
  scale(scalewidth: number, scaleheight: number): void {
    if (isNaN(scalewidth) || isNaN(scaleheight)) {
      console.error("jsPDF.context2d.scale: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.scale");
    }
    var matrix = new Matrix(scalewidth, 0.0, 0.0, scaleheight, 0.0, 0.0);
    this.ctx.transform = this.ctx.transform.multiply(matrix);
  }

  /**
   * Rotates the current drawing
   *
   * @name rotate
   * @function
   * @param angle {Number} The rotation angle, in radians.
   * @description To calculate from degrees to radians: degrees*Math.PI/180. <br />
   * Example: to rotate 5 degrees, specify the following: 5*Math.PI/180
   */
  rotate(angle: number): void {
    if (isNaN(angle)) {
      console.error("jsPDF.context2d.rotate: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.rotate");
    }
    var matrix = new Matrix(
      Math.cos(angle),
      Math.sin(angle),
      -Math.sin(angle),
      Math.cos(angle),
      0.0,
      0.0
    );
    this.ctx.transform = this.ctx.transform.multiply(matrix);
  }

  /**
   * Remaps the (0,0) position on the canvas
   *
   * @name translate
   * @function
   * @param x {Number} The value to add to horizontal (x) coordinates
   * @param y {Number} The value to add to vertical (y) coordinates
   * @description The translate() method remaps the (0,0) position on the canvas.
   */
  translate(x: number, y: number): void {
    if (isNaN(x) || isNaN(y)) {
      console.error("jsPDF.context2d.translate: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.translate");
    }
    var matrix = new Matrix(1.0, 0.0, 0.0, 1.0, x, y);
    this.ctx.transform = this.ctx.transform.multiply(matrix);
  }

  /**
   * Replaces the current transformation matrix for the drawing
   *
   * @name transform
   * @function
   * @param a {Number} Horizontal scaling
   * @param b {Number} Horizontal skewing
   * @param c {Number} Vertical skewing
   * @param d {Number} Vertical scaling
   * @param e {Number} Horizontal moving
   * @param f {Number} Vertical moving
   * @description Each object on the canvas has a current transformation matrix.<br /><br />The transform() method replaces the current transformation matrix. It multiplies the current transformation matrix with the matrix described by:<br /><br /><br /><br />a    c    e<br /><br />b    d    f<br /><br />0    0    1<br /><br />In other words, the transform() method lets you scale, rotate, move, and skew the current context.
   */
  transform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ): void {
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f)) {
      console.error("jsPDF.context2d.transform: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.transform");
    }
    var matrix = new Matrix(a, b, c, d, e, f);
    this.ctx.transform = this.ctx.transform.multiply(matrix);
  }

  /**
   * Resets the current transform to the identity matrix. Then runs transform()
   *
   * @name setTransform
   * @function
   * @param a {Number} Horizontal scaling
   * @param b {Number} Horizontal skewing
   * @param c {Number} Vertical skewing
   * @param d {Number} Vertical scaling
   * @param e {Number} Horizontal moving
   * @param f {Number} Vertical moving
   * @description Each object on the canvas has a current transformation matrix. <br /><br />The setTransform() method resets the current transform to the identity matrix, and then runs transform() with the same arguments.<br /><br />In other words, the setTransform() method lets you scale, rotate, move, and skew the current context.
   */
  setTransform(
    a?: number,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number
  ): void {
    // Same effective conditions as the historic `isNaN(...)` checks (which
    // are true for undefined), spelled out for the benefit of narrowing.
    a = a === undefined || isNaN(a) ? 1 : a;
    b = b === undefined || isNaN(b) ? 0 : b;
    c = c === undefined || isNaN(c) ? 0 : c;
    d = d === undefined || isNaN(d) ? 1 : d;
    e = e === undefined || isNaN(e) ? 0 : e;
    f = f === undefined || isNaN(f) ? 0 : f;
    this.ctx.transform = new Matrix(a, b, c, d, e, f);
  }

  /**
   * Draws an image, canvas, or video onto the canvas
   *
   * @function
   * @param img {} Specifies the image, canvas, or video element to use
   * @param sx {Number} Optional. The x coordinate where to start clipping
   * @param sy {Number} Optional. The y coordinate where to start clipping
   * @param swidth {Number} Optional. The width of the clipped image
   * @param sheight {Number} Optional. The height of the clipped image
   * @param x {Number} The x coordinate where to place the image on the canvas
   * @param y {Number} The y coordinate where to place the image on the canvas
   * @param width {Number} Optional. The width of the image to use (stretch or reduce the image)
   * @param height {Number} Optional. The height of the image to use (stretch or reduce the image)
   */
  drawImage(
    img: CanvasImageSource | string,
    sx: number,
    sy: number,
    swidth?: number,
    sheight?: number,
    x?: number,
    y?: number,
    width?: number,
    height?: number
  ): void {
    var imageProperties = this.pdf.getImageProperties(img);
    var factorX = 1;
    var factorY = 1;
    var isClip;

    var clipFactorX = 1;
    var clipFactorY = 1;

    if (typeof swidth !== "undefined" && typeof width !== "undefined") {
      isClip = true;
      clipFactorX = width / swidth;
      // swidth and width are only both set for the 9-argument overload, so
      // sheight/height are present here (a caller omitting them gets the
      // same NaN propagation as before).
      clipFactorY = height! / sheight!;
      factorX = ((imageProperties.width / swidth) * width) / swidth;
      factorY = ((imageProperties.height / sheight!) * height!) / sheight!;
    }

    //is sx and sy are set and x and y not, set x and y with values of sx and sy
    if (typeof x === "undefined") {
      x = sx;
      y = sy;
      sx = 0;
      sy = 0;
    }

    if (typeof swidth !== "undefined" && typeof width === "undefined") {
      width = swidth;
      height = sheight;
    }
    if (typeof swidth === "undefined" && typeof width === "undefined") {
      width = imageProperties.width;
      height = imageProperties.height;
    }

    var decomposedTransformationMatrix = this.ctx.transform.decompose();
    var angle = rad2deg(decomposedTransformationMatrix.rotate.shx);
    var matrix = new Matrix();
    matrix = matrix.multiply(decomposedTransformationMatrix.translate);
    matrix = matrix.multiply(decomposedTransformationMatrix.skew);
    matrix = matrix.multiply(decomposedTransformationMatrix.scale);
    // y/swidth/sheight can genuinely be absent for the short overloads; the
    // assertions are type-level only and keep the historic NaN propagation.
    var xRect = matrix.applyToRectangle(
      new Rectangle(
        x - sx * clipFactorX,
        y! - sy * clipFactorY,
        swidth! * factorX,
        sheight! * factorY
      )
    );

    if (this.autoPaging) {
      var pageArray = getPagesByPath.call(this, xRect);
      var pages: number[] = [];
      for (var ii = 0; ii < pageArray.length; ii += 1) {
        if (pages.indexOf(pageArray[ii]) === -1) {
          pages.push(pageArray[ii]);
        }
      }

      sortPages(pages);

      var clipPath: PathEntry[];
      var min = pages[0];
      var max = pages[pages.length - 1];
      for (var i = min; i < max + 1; i++) {
        this.pdf.setPage(i);

        var pageWidthMinusMargins =
          this.pdf.internal.pageSize.width - this.margin[3] - this.margin[1];
        var topMargin = i === 1 ? this.posY + this.margin[0] : this.margin[0];
        var firstPageHeight =
          this.pdf.internal.pageSize.height -
          this.posY -
          this.margin[0] -
          this.margin[2];
        var pageHeightMinusMargins =
          this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2];
        var previousPageHeightSum =
          i === 1 ? 0 : firstPageHeight + (i - 2) * pageHeightMinusMargins;

        if (this.ctx.clip_path.length !== 0) {
          var tmpPaths = this.path;
          clipPath = JSON.parse(JSON.stringify(this.ctx.clip_path));
          this.path = pathPositionRedo(
            clipPath,
            this.posX + this.margin[3],
            -previousPageHeightSum + topMargin + this.ctx.prevPageLastElemOffset
          );
          drawPaths.call(this, "fill", true);
          this.path = tmpPaths;
        }
        var tmpRect: PathEntry = JSON.parse(JSON.stringify(xRect));
        tmpRect = pathPositionRedo(
          [tmpRect],
          this.posX + this.margin[3],
          -previousPageHeightSum + topMargin + this.ctx.prevPageLastElemOffset
        )[0];

        const needsClipping = (i > min || i < max) && hasMargins.call(this);

        if (needsClipping) {
          this.pdf.saveGraphicsState();
          this.pdf
            .rect(
              this.margin[3],
              this.margin[0],
              pageWidthMinusMargins,
              pageHeightMinusMargins,
              null
            )
            .clip()
            .discardPath();
        }
        // tmpRect is a JSON copy of xRect (a Rectangle), so x/y/w/h are
        // always present.
        this.pdf.addImage(
          img,
          "JPEG",
          tmpRect.x!,
          tmpRect.y!,
          tmpRect.w!,
          tmpRect.h!,
          null,
          null,
          angle
        );
        if (needsClipping) {
          this.pdf.restoreGraphicsState();
        }
      }
    } else {
      this.pdf.addImage(
        img,
        "JPEG",
        xRect.x,
        xRect.y,
        xRect.w,
        xRect.h,
        null,
        null,
        angle
      );
    }
  }

  // The coordinate parameters of the real canvas API are accepted (specs and
  // ported canvas code pass them) but ignored: the stub only records color
  // stops.
  createLinearGradient(
    _x0?: number,
    _y0?: number,
    _x1?: number,
    _y1?: number
  ): CanvasGradientStub {
    var canvasGradient = Object.assign(function canvasGradient() {}, {
      colorStops: [] as Array<[number, string]>,
      addColorStop: function (
        this: CanvasGradientStub,
        offset: number,
        color: string
      ): void {
        this.colorStops.push([offset, color]);
      },
      getColor: function (this: CanvasGradientStub): string {
        if (this.colorStops.length === 0) {
          return "#000000";
        }

        return this.colorStops[0][1];
      },
      isCanvasGradient: true as const
    });

    return canvasGradient;
  }

  createPattern(): CanvasGradientStub {
    return this.createLinearGradient();
  }

  createRadialGradient(): CanvasGradientStub {
    return this.createLinearGradient();
  }
}

//helper functions

/**
 * Get the decimal values of r, g, b and a
 *
 * @name getRGBA
 * @function
 * @private
 * @ignore
 */
var getRGBA = function (style: string | CanvasGradientStub): RGBAResult {
  var rxRgb = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
  var rxRgba = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/;
  var rxTransparent =
    /transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/;

  var r: number, g: number, b: number, a: number;

  // The gradient stubs produced by createLinearGradient are function
  // objects, so no typeof narrowing here — property probing matches the
  // original implementation exactly.
  if ((style as CanvasGradientStub).isCanvasGradient === true) {
    style = (style as CanvasGradientStub).getColor();
  }
  // Non-string, non-gradient inputs keep flowing through the string code
  // paths untouched, faithful to the original JavaScript implementation.
  var styleString = style as string;

  if (!styleString) {
    return { r: 0, g: 0, b: 0, a: 0, style: styleString };
  }

  if (rxTransparent.test(styleString)) {
    r = 0;
    g = 0;
    b = 0;
    a = 0;
  } else {
    var matches = rxRgb.exec(styleString);
    if (matches !== null) {
      r = parseInt(matches[1]);
      g = parseInt(matches[2]);
      b = parseInt(matches[3]);
      a = 1;
    } else {
      matches = rxRgba.exec(styleString);
      if (matches !== null) {
        r = parseInt(matches[1]);
        g = parseInt(matches[2]);
        b = parseInt(matches[3]);
        a = parseFloat(matches[4]);
      } else {
        a = 1;

        if (typeof styleString === "string" && styleString.charAt(0) !== "#") {
          var rgbColor = new RGBColor(styleString);
          if (rgbColor.ok) {
            styleString = rgbColor.toHex();
          } else {
            styleString = "#000000";
          }
        }

        var rs: string, gs: string, bs: string;
        if (styleString.length === 4) {
          rs = styleString.substring(1, 2);
          rs += rs;
          gs = styleString.substring(2, 3);
          gs += gs;
          bs = styleString.substring(3, 4);
          bs += bs;
        } else {
          rs = styleString.substring(1, 3);
          gs = styleString.substring(3, 5);
          bs = styleString.substring(5, 7);
        }
        r = parseInt(rs, 16);
        g = parseInt(gs, 16);
        b = parseInt(bs, 16);
      }
    }
  }
  return { r: r, g: g, b: b, a: a, style: styleString };
};

/**
 * @name isFillTransparent
 * @function
 * @private
 * @ignore
 * @returns {Boolean}
 */
var isFillTransparent = function (this: Context2D): boolean {
  return this.ctx.isFillTransparent || this.globalAlpha == 0;
};

/**
 * @name isStrokeTransparent
 * @function
 * @private
 * @ignore
 * @returns {Boolean}
 */
var isStrokeTransparent = function (this: Context2D): boolean {
  return Boolean(this.ctx.isStrokeTransparent || this.globalAlpha == 0);
};

/**
 * Should only be used if pageWrapYEnabled is true
 *
 * @name setPageByYPosition
 * @function
 * @private
 * @ignore
 * @returns One-based Page Number
 */
// eslint-disable-next-line no-unused-vars
var setPageByYPosition = function (this: Context2D, y: number): number {
  if (this.pageWrapYEnabled) {
    this.lastBreak = 0;
    var manualBreaks = 0;
    var autoBreaks = 0;
    for (var i = 0; i < this.pageBreaks.length; i++) {
      if (y >= this.pageBreaks[i]) {
        manualBreaks++;
        if (this.lastBreak === 0) {
          autoBreaks++;
        }
        var spaceBetweenLastBreak = this.pageBreaks[i] - this.lastBreak;
        this.lastBreak = this.pageBreaks[i];
        var pagesSinceLastBreak = Math.floor(
          spaceBetweenLastBreak / this.pageWrapY
        );
        autoBreaks += pagesSinceLastBreak;
      }
    }
    if (this.lastBreak === 0) {
      var pagesSinceLastBreak = Math.floor(y / this.pageWrapY) + 1;
      autoBreaks += pagesSinceLastBreak;
    }
    return autoBreaks + manualBreaks;
  } else {
    return this.pdf.internal.getCurrentPageInfo().pageNumber;
  }
};

var hasMargins = function (this: Context2D): boolean {
  return (
    this.margin[0] > 0 ||
    this.margin[1] > 0 ||
    this.margin[2] > 0 ||
    this.margin[3] > 0
  );
};

var getPagesByPath = function (
  this: Context2D,
  path: PathEntry,
  pageWrapX?: number,
  pageWrapY?: number
): number[] {
  var result: number[] = [];
  pageWrapX = pageWrapX || this.pdf.internal.pageSize.width;
  pageWrapY =
    pageWrapY ||
    this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2];
  var yOffset = this.posY + this.ctx.prevPageLastElemOffset;

  // The assertions on path members below are type-level only: every entry
  // type carries the members read for it (see the push sites), and a missing
  // one would NaN-propagate exactly as in the untyped implementation.
  switch (path.type) {
    default:
    case "mt":
    case "lt":
      result.push(Math.floor((path.y! + yOffset) / pageWrapY) + 1);
      break;
    case "arc":
      result.push(
        Math.floor((path.y! + yOffset - path.radius!) / pageWrapY) + 1
      );
      result.push(
        Math.floor((path.y! + yOffset + path.radius!) / pageWrapY) + 1
      );
      break;
    case "qct":
      var rectOfQuadraticCurve = getQuadraticCurveBoundary(
        this.ctx.lastPoint.x,
        this.ctx.lastPoint.y,
        path.x1!,
        path.y1!,
        path.x!,
        path.y!
      );
      result.push(
        Math.floor((rectOfQuadraticCurve.y + yOffset) / pageWrapY) + 1
      );
      result.push(
        Math.floor(
          (rectOfQuadraticCurve.y + rectOfQuadraticCurve.h + yOffset) /
            pageWrapY
        ) + 1
      );
      break;
    case "bct":
      var rectOfBezierCurve = getBezierCurveBoundary(
        this.ctx.lastPoint.x,
        this.ctx.lastPoint.y,
        path.x1!,
        path.y1!,
        path.x2!,
        path.y2!,
        path.x!,
        path.y!
      );
      result.push(Math.floor((rectOfBezierCurve.y + yOffset) / pageWrapY) + 1);
      result.push(
        Math.floor(
          (rectOfBezierCurve.y + rectOfBezierCurve.h + yOffset) / pageWrapY
        ) + 1
      );
      break;
    case "rect":
      result.push(Math.floor((path.y! + yOffset) / pageWrapY) + 1);
      result.push(Math.floor((path.y! + path.h! + yOffset) / pageWrapY) + 1);
  }

  for (var i = 0; i < result.length; i += 1) {
    while (this.pdf.internal.getNumberOfPages() < result[i]) {
      addPage.call(this);
    }
  }
  return result;
};

var addPage = function (this: Context2D): void {
  var fillStyle = this.fillStyle;
  var strokeStyle = this.strokeStyle;
  var font = this.font;
  var lineCap = this.lineCap;
  var lineWidth = this.lineWidth;
  var lineJoin = this.lineJoin;
  this.pdf.addPage();
  this.fillStyle = fillStyle;
  this.strokeStyle = strokeStyle;
  this.font = font;
  this.lineCap = lineCap;
  this.lineWidth = lineWidth;
  this.lineJoin = lineJoin;
};

var pathPositionRedo = function (
  paths: PathEntry[],
  x: number,
  y: number
): PathEntry[] {
  // Every entry type carries the members shifted for it (see the push
  // sites); the assertions are type-level only — a missing member would
  // NaN-propagate exactly as `undefined += x` always did.
  for (var i = 0; i < paths.length; i++) {
    switch (paths[i].type) {
      case "bct":
        paths[i].x2 = paths[i].x2! + x;
        paths[i].y2 = paths[i].y2! + y;
      case "qct":
        paths[i].x1 = paths[i].x1! + x;
        paths[i].y1 = paths[i].y1! + y;
      case "mt":
      case "lt":
      case "arc":
      default:
        paths[i].x = paths[i].x! + x;
        paths[i].y = paths[i].y! + y;
    }
  }
  return paths;
};

var sortPages = function (pages: number[]): number[] {
  return pages.sort(function (a, b) {
    return a - b;
  });
};

var pathPreProcess = function (
  this: Context2D,
  rule: string | null,
  isClip: boolean
): void {
  var fillStyle = this.fillStyle;
  var strokeStyle = this.strokeStyle;
  var lineCap = this.lineCap;
  var oldLineWidth = this.lineWidth;
  var lineWidth = Math.abs(oldLineWidth * this.ctx.transform.scaleX);
  var lineJoin = this.lineJoin;

  if (this.autoPaging) {
    var origPath: PathEntry[] = JSON.parse(JSON.stringify(this.path));
    var xPath: PathEntry[] = JSON.parse(JSON.stringify(this.path));
    var clipPath: PathEntry[];
    var tmpPath: PathEntry[];
    var pages: number[] = [];

    for (var i = 0; i < xPath.length; i++) {
      if (typeof xPath[i].x !== "undefined") {
        var page = getPagesByPath.call(this, xPath[i]);

        for (var ii = 0; ii < page.length; ii += 1) {
          if (pages.indexOf(page[ii]) === -1) {
            pages.push(page[ii]);
          }
        }
      }
    }

    for (var j = 0; j < pages.length; j++) {
      while (this.pdf.internal.getNumberOfPages() < pages[j]) {
        addPage.call(this);
      }
    }
    sortPages(pages);

    var min = pages[0];
    var max = pages[pages.length - 1];
    for (var k = min; k < max + 1; k++) {
      this.pdf.setPage(k);

      this.fillStyle = fillStyle;
      this.strokeStyle = strokeStyle;
      this.lineCap = lineCap;
      this.lineWidth = lineWidth;
      this.lineJoin = lineJoin;

      var pageWidthMinusMargins =
        this.pdf.internal.pageSize.width - this.margin[3] - this.margin[1];
      var topMargin = k === 1 ? this.posY + this.margin[0] : this.margin[0];
      var firstPageHeight =
        this.pdf.internal.pageSize.height -
        this.posY -
        this.margin[0] -
        this.margin[2];
      var pageHeightMinusMargins =
        this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2];
      var previousPageHeightSum =
        k === 1 ? 0 : firstPageHeight + (k - 2) * pageHeightMinusMargins;

      if (this.ctx.clip_path.length !== 0) {
        var tmpPaths = this.path;
        clipPath = JSON.parse(JSON.stringify(this.ctx.clip_path));
        this.path = pathPositionRedo(
          clipPath,
          this.posX + this.margin[3],
          -previousPageHeightSum + topMargin + this.ctx.prevPageLastElemOffset
        );
        drawPaths.call(this, rule, true);
        this.path = tmpPaths;
      }
      tmpPath = JSON.parse(JSON.stringify(origPath));
      this.path = pathPositionRedo(
        tmpPath,
        this.posX + this.margin[3],
        -previousPageHeightSum + topMargin + this.ctx.prevPageLastElemOffset
      );
      if (isClip === false || k === 0) {
        const needsClipping = (k > min || k < max) && hasMargins.call(this);
        if (needsClipping) {
          this.pdf.saveGraphicsState();
          this.pdf
            .rect(
              this.margin[3],
              this.margin[0],
              pageWidthMinusMargins,
              pageHeightMinusMargins,
              null
            )
            .clip()
            .discardPath();
        }
        drawPaths.call(this, rule, isClip);
        if (needsClipping) {
          this.pdf.restoreGraphicsState();
        }
      }
      this.lineWidth = oldLineWidth;
    }
    this.path = origPath;
  } else {
    this.lineWidth = lineWidth;
    drawPaths.call(this, rule, isClip);
    this.lineWidth = oldLineWidth;
  }
};

/**
 * Processes the paths
 *
 * @function
 * @param rule {String}
 * @param isClip {Boolean}
 * @private
 * @ignore
 */
var drawPaths = function (
  this: Context2D,
  rule: string | null,
  isClip: boolean
): void {
  if (rule === "stroke" && !isClip && isStrokeTransparent.call(this)) {
    return;
  }

  if (rule !== "stroke" && !isClip && isFillTransparent.call(this)) {
    return;
  }

  var moves: PathMove[] = [];

  //var alpha = (this.ctx.fillOpacity < 1) ? this.ctx.fillOpacity : this.ctx.globalAlpha;
  var delta;
  var xPath = this.path;
  for (var i = 0; i < xPath.length; i++) {
    var pt = xPath[i];

    switch (pt.type) {
      case "begin":
        moves.push({
          begin: true
        });
        break;

      case "close":
        moves.push({
          close: true
        });
        break;

      case "mt":
        moves.push({
          start: pt,
          deltas: [],
          abs: []
        });
        break;

      case "lt":
        var iii = moves.length;
        if (xPath[i - 1] && !isNaN(xPath[i - 1].x!)) {
          // Coordinate members are present on mt/lt entries (see the push
          // sites); moves that are neither close nor begin always carry
          // deltas/abs arrays. Assertions are type-level only.
          delta = [pt.x! - xPath[i - 1].x!, pt.y! - xPath[i - 1].y!];
          if (iii > 0) {
            for (iii; iii >= 0; iii--) {
              if (
                moves[iii - 1].close !== true &&
                moves[iii - 1].begin !== true
              ) {
                moves[iii - 1].deltas!.push(delta);
                moves[iii - 1].abs!.push(pt);
                break;
              }
            }
          }
        }
        break;

      case "bct":
        delta = [
          pt.x1! - xPath[i - 1].x!,
          pt.y1! - xPath[i - 1].y!,
          pt.x2! - xPath[i - 1].x!,
          pt.y2! - xPath[i - 1].y!,
          pt.x! - xPath[i - 1].x!,
          pt.y! - xPath[i - 1].y!
        ];
        moves[moves.length - 1].deltas!.push(delta);
        break;

      case "qct":
        var x1 = xPath[i - 1].x! + (2.0 / 3.0) * (pt.x1! - xPath[i - 1].x!);
        var y1 = xPath[i - 1].y! + (2.0 / 3.0) * (pt.y1! - xPath[i - 1].y!);
        var x2 = pt.x! + (2.0 / 3.0) * (pt.x1! - pt.x!);
        var y2 = pt.y! + (2.0 / 3.0) * (pt.y1! - pt.y!);
        var x3 = pt.x!;
        var y3 = pt.y!;
        delta = [
          x1 - xPath[i - 1].x!,
          y1 - xPath[i - 1].y!,
          x2 - xPath[i - 1].x!,
          y2 - xPath[i - 1].y!,
          x3 - xPath[i - 1].x!,
          y3 - xPath[i - 1].y!
        ];
        moves[moves.length - 1].deltas!.push(delta);
        break;

      case "arc":
        moves.push({
          deltas: [],
          abs: [],
          arc: true
        });

        if (Array.isArray(moves[moves.length - 1].abs)) {
          // Guarded by the Array.isArray check just above (element-access
          // narrowing does not carry over).
          moves[moves.length - 1].abs!.push(pt);
        }
        break;
    }
  }
  var style: string | null;
  if (!isClip) {
    if (rule === "stroke") {
      style = "stroke";
    } else {
      style = "fill";
    }
  } else {
    style = null;
  }

  var began = false;
  for (var k = 0; k < moves.length; k++) {
    if (moves[k].arc) {
      // Arc moves are always created with an abs array, and arc entries
      // carry the full set of arc members (see the push sites above).
      var arcs = moves[k].abs!;

      for (var ii = 0; ii < arcs.length; ii++) {
        var arc = arcs[ii];

        if (arc.type === "arc") {
          drawArc.call(
            this,
            arc.x!,
            arc.y!,
            arc.radius!,
            arc.startAngle!,
            arc.endAngle!,
            arc.counterclockwise,
            undefined,
            isClip,
            !began
          );
        } else {
          drawLine.call(this, arc.x!, arc.y!);
        }
        began = true;
      }
    } else if (moves[k].close === true) {
      this.pdf.internal.out("h");
      began = false;
    } else if (moves[k].begin !== true) {
      // Non-begin/close/arc moves come from "mt" entries: start and its
      // coordinates as well as deltas are always present.
      var x = moves[k].start!.x!;
      var y = moves[k].start!.y!;
      drawLines.call(this, moves[k].deltas!, x, y);
      began = true;
    }
  }

  if (style) {
    putStyle.call(this, style);
  }
  if (isClip) {
    doClip.call(this);
  }
};

var getBaseline = function (this: Context2D, y: number): number {
  var height = this.pdf.internal.getFontSize() / this.pdf.internal.scaleFactor;
  var descent = height * (this.pdf.internal.getLineHeightFactor() - 1);
  switch (this.ctx.textBaseline) {
    case "bottom":
      return y - descent;
    case "top":
      return y + height - descent;
    case "hanging":
      return y + height - 2 * descent;
    case "middle":
      return y + height / 2 - descent;
    case "ideographic":
      // TODO not implemented
      return y;
    case "alphabetic":
    default:
      return y;
  }
};

var getTextBottom = function (this: Context2D, yBaseLine: number): number {
  var height = this.pdf.internal.getFontSize() / this.pdf.internal.scaleFactor;
  var descent = height * (this.pdf.internal.getLineHeightFactor() - 1);
  return yBaseLine + descent;
};

/**
 *
 * @param x Edge point X
 * @param y Edge point Y
 * @param r Radius
 * @param a1 start angle
 * @param a2 end angle
 * @param counterclockwise
 * @param style
 * @param isClip
 */
var drawArc = function (
  this: Context2D,
  x: number,
  y: number,
  r: number,
  a1: number,
  a2: number,
  counterclockwise?: boolean,
  style?: string,
  isClip?: boolean,
  includeMove?: boolean
): void {
  // http://hansmuller-flex.blogspot.com/2011/10/more-about-approximating-circular-arcs.html
  var curves = createArc.call(this, r, a1, a2, counterclockwise);

  for (var i = 0; i < curves.length; i++) {
    var curve = curves[i];
    if (i === 0) {
      if (includeMove) {
        doMove.call(this, curve.x1 + x, curve.y1 + y);
      } else {
        drawLine.call(this, curve.x1 + x, curve.y1 + y);
      }
    }
    drawCurve.call(
      this,
      x,
      y,
      curve.x2,
      curve.y2,
      curve.x3,
      curve.y3,
      curve.x4,
      curve.y4
    );
  }

  if (!isClip) {
    putStyle.call(this, style);
  } else {
    doClip.call(this);
  }
};

var putStyle = function (this: Context2D, style?: string | null): void {
  switch (style) {
    case "stroke":
      this.pdf.internal.out("S");
      break;
    case "fill":
      this.pdf.internal.out("f");
      break;
  }
};

var doClip = function (this: Context2D): void {
  this.pdf.clip();
  this.pdf.discardPath();
};

var doMove = function (this: Context2D, x: number, y: number): void {
  this.pdf.internal.out(
    getHorizontalCoordinateString(x) +
      " " +
      getVerticalCoordinateString(y) +
      " m"
  );
};

var putText = function (this: Context2D, options: PutTextOptions): void {
  var textAlign: "left" | "center" | "right";
  switch (options.align) {
    case "right":
    case "end":
      textAlign = "right";
      break;
    case "center":
      textAlign = "center";
      break;
    case "left":
    case "start":
    default:
      textAlign = "left";
      break;
  }

  var textDimensions = this.pdf.getTextDimensions(options.text);
  var yBaseLine = getBaseline.call(this, options.y);
  var yBottom = getTextBottom.call(this, yBaseLine);
  var yTop = yBottom - textDimensions.h;

  var pt = this.ctx.transform.applyToPoint(new Point(options.x, yBaseLine));

  var clipPath: PathEntry[];
  // Definite-assignment assertions: both are assigned and read under the
  // same `options.scale >= 0.01` condition.
  var oldSize!: number;
  var oldLineWidth!: number;

  if (this.autoPaging) {
    var decomposedTransformationMatrix = this.ctx.transform.decompose();
    var matrix = new Matrix();
    matrix = matrix.multiply(decomposedTransformationMatrix.translate);
    matrix = matrix.multiply(decomposedTransformationMatrix.skew);
    matrix = matrix.multiply(decomposedTransformationMatrix.scale);

    var baselineRect = this.ctx.transform.applyToRectangle(
      new Rectangle(options.x, yBaseLine, textDimensions.w, textDimensions.h)
    );
    var textBounds = matrix.applyToRectangle(
      new Rectangle(options.x, yTop, textDimensions.w, textDimensions.h)
    );
    var pageArray = getPagesByPath.call(this, textBounds);
    var pages: number[] = [];
    for (var ii = 0; ii < pageArray.length; ii += 1) {
      if (pages.indexOf(pageArray[ii]) === -1) {
        pages.push(pageArray[ii]);
      }
    }

    sortPages(pages);

    var min = pages[0];
    var max = pages[pages.length - 1];
    for (var i = min; i < max + 1; i++) {
      this.pdf.setPage(i);

      var topMargin = i === 1 ? this.posY + this.margin[0] : this.margin[0];
      var firstPageHeight =
        this.pdf.internal.pageSize.height -
        this.posY -
        this.margin[0] -
        this.margin[2];
      var pageHeightMinusBottomMargin =
        this.pdf.internal.pageSize.height - this.margin[2];
      var pageHeightMinusMargins = pageHeightMinusBottomMargin - this.margin[0];
      var pageWidthMinusRightMargin =
        this.pdf.internal.pageSize.width - this.margin[1];
      var pageWidthMinusMargins = pageWidthMinusRightMargin - this.margin[3];
      var previousPageHeightSum =
        i === 1 ? 0 : firstPageHeight + (i - 2) * pageHeightMinusMargins;

      if (this.ctx.clip_path.length !== 0) {
        var tmpPaths = this.path;
        clipPath = JSON.parse(JSON.stringify(this.ctx.clip_path));
        this.path = pathPositionRedo(
          clipPath,
          this.posX + this.margin[3],
          -1 * previousPageHeightSum + topMargin
        );
        drawPaths.call(this, "fill", true);
        this.path = tmpPaths;
      }
      // textBoundsOnPage/baseLineRectOnPage are JSON copies of Rectangles,
      // so their x/y/w/h members (asserted below) are always present.
      var textBoundsOnPage = pathPositionRedo(
        [JSON.parse(JSON.stringify(textBounds))],
        this.posX + this.margin[3],
        -previousPageHeightSum + topMargin + this.ctx.prevPageLastElemOffset
      )[0];

      if (options.scale >= 0.01) {
        oldSize = this.pdf.internal.getFontSize();
        this.pdf.setFontSize(oldSize * options.scale);
        oldLineWidth = this.lineWidth;
        this.lineWidth = oldLineWidth * options.scale;
      }

      var doSlice = this.autoPaging !== "text";

      if (
        doSlice ||
        textBoundsOnPage.y! + textBoundsOnPage.h! <= pageHeightMinusBottomMargin
      ) {
        if (
          doSlice ||
          (textBoundsOnPage.y! >= topMargin &&
            textBoundsOnPage.x! <= pageWidthMinusRightMargin)
        ) {
          var croppedText = doSlice
            ? options.text
            : this.pdf.splitTextToSize(
                options.text,
                options.maxWidth ||
                  pageWidthMinusRightMargin - textBoundsOnPage.x!
              )[0];
          var baseLineRectOnPage = pathPositionRedo(
            [JSON.parse(JSON.stringify(baselineRect))],
            this.posX + this.margin[3],
            -previousPageHeightSum + topMargin + this.ctx.prevPageLastElemOffset
          )[0];

          const needsClipping =
            doSlice && (i > min || i < max) && hasMargins.call(this);

          if (needsClipping) {
            this.pdf.saveGraphicsState();
            this.pdf
              .rect(
                this.margin[3],
                this.margin[0],
                pageWidthMinusMargins,
                pageHeightMinusMargins,
                null
              )
              .clip()
              .discardPath();
          }

          this.pdf.text(
            croppedText,
            baseLineRectOnPage.x!,
            baseLineRectOnPage.y!,
            {
              angle: options.angle,
              align: textAlign,
              renderingMode: options.renderingMode
            }
          );

          if (needsClipping) {
            this.pdf.restoreGraphicsState();
          }
        }
      } else {
        // This text is the last element of the page, but it got cut off due to the margin
        // so we render it in the next page

        if (textBoundsOnPage.y! < pageHeightMinusBottomMargin) {
          // As a result, all other elements have their y offset increased
          this.ctx.prevPageLastElemOffset +=
            pageHeightMinusBottomMargin - textBoundsOnPage.y!;
        }
      }

      if (options.scale >= 0.01) {
        this.pdf.setFontSize(oldSize);
        this.lineWidth = oldLineWidth;
      }
    }
  } else {
    if (options.scale >= 0.01) {
      oldSize = this.pdf.internal.getFontSize();
      this.pdf.setFontSize(oldSize * options.scale);
      oldLineWidth = this.lineWidth;
      this.lineWidth = oldLineWidth * options.scale;
    }
    this.pdf.text(options.text, pt.x + this.posX, pt.y + this.posY, {
      angle: options.angle,
      align: textAlign,
      renderingMode: options.renderingMode,
      maxWidth: options.maxWidth
    });

    if (options.scale >= 0.01) {
      this.pdf.setFontSize(oldSize);
      this.lineWidth = oldLineWidth;
    }
  }
};

var drawLine = function (
  this: Context2D,
  x: number,
  y: number,
  prevX?: number,
  prevY?: number
): void {
  prevX = prevX || 0;
  prevY = prevY || 0;

  this.pdf.internal.out(
    getHorizontalCoordinateString(x + prevX) +
      " " +
      getVerticalCoordinateString(y + prevY) +
      " l"
  );
};

var drawLines = function (
  this: Context2D,
  lines: number[][],
  x: number,
  y: number
): jsPDFDocument {
  return this.pdf.lines(lines, x, y, null, null);
};

var drawCurve = function (
  this: Context2D,
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
): void {
  this.pdf.internal.out(
    [
      f2(getHorizontalCoordinate(x1 + x)),
      f2(getVerticalCoordinate(y1 + y)),
      f2(getHorizontalCoordinate(x2 + x)),
      f2(getVerticalCoordinate(y2 + y)),
      f2(getHorizontalCoordinate(x3 + x)),
      f2(getVerticalCoordinate(y3 + y)),
      "c"
    ].join(" ")
  );
};

/**
 * Return a array of objects that represent bezier curves which approximate the circular arc centered at the origin, from startAngle to endAngle (radians) with the specified radius.
 *
 * Each bezier curve is an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
 * @function createArc
 */
var createArc = function (
  radius: number,
  startAngle: number,
  endAngle: number,
  anticlockwise?: boolean
): ArcCurve[] {
  var EPSILON = 0.00001; // Roughly 1/1000th of a degree, see below
  var twoPi = Math.PI * 2;
  var halfPi = Math.PI / 2.0;

  while (startAngle > endAngle) {
    startAngle = startAngle - twoPi;
  }
  var totalAngle = Math.abs(endAngle - startAngle);
  if (totalAngle < twoPi) {
    if (anticlockwise) {
      totalAngle = twoPi - totalAngle;
    }
  }

  // Compute the sequence of arc curves, up to PI/2 at a time.
  var curves: ArcCurve[] = [];

  // clockwise or counterclockwise
  var sgn = anticlockwise ? -1 : +1;

  var a1 = startAngle;
  for (; totalAngle > EPSILON;) {
    var remain = sgn * Math.min(totalAngle, halfPi);
    var a2 = a1 + remain;
    curves.push(createSmallArc(radius, a1, a2));
    totalAngle -= Math.abs(a2 - a1);
    a1 = a2;
  }

  return curves;
};

/**
 * Cubic bezier approximation of a circular arc centered at the origin, from (radians) a1 to a2, where a2-a1 < pi/2. The arc's radius is r.
 *
 * Returns an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
 *
 * This algorithm is based on the approach described in: A. Riškus, "Approximation of a Cubic Bezier Curve by Circular Arcs and Vice Versa," Information Technology and Control, 35(4), 2006 pp. 371-378.
 */
var createSmallArc = function (r: number, a1: number, a2: number): ArcCurve {
  var a = (a2 - a1) / 2.0;

  var x4 = r * Math.cos(a);
  var y4 = r * Math.sin(a);
  var x1 = x4;
  var y1 = -y4;

  var q1 = x1 * x1 + y1 * y1;
  var q2 = q1 + x1 * x4 + y1 * y4;
  var k2 = ((4 / 3) * (Math.sqrt(2 * q1 * q2) - q2)) / (x1 * y4 - y1 * x4);

  var x2 = x1 - k2 * y1;
  var y2 = y1 + k2 * x1;
  var x3 = x2;
  var y3 = -y2;

  var ar = a + a1;
  var cos_ar = Math.cos(ar);
  var sin_ar = Math.sin(ar);

  return {
    x1: r * Math.cos(a1),
    y1: r * Math.sin(a1),
    x2: x2 * cos_ar - y2 * sin_ar,
    y2: x2 * sin_ar + y2 * cos_ar,
    x3: x3 * cos_ar - y3 * sin_ar,
    y3: x3 * sin_ar + y3 * cos_ar,
    x4: r * Math.cos(a2),
    y4: r * Math.sin(a2)
  };
};

var rad2deg = function (value: number): number {
  return (value * 180) / Math.PI;
};

var getQuadraticCurveBoundary = function (
  sx: number,
  sy: number,
  cpx: number,
  cpy: number,
  ex: number,
  ey: number
): RectangleType {
  var midX1 = sx + (cpx - sx) * 0.5;
  var midY1 = sy + (cpy - sy) * 0.5;
  var midX2 = ex + (cpx - ex) * 0.5;
  var midY2 = ey + (cpy - ey) * 0.5;
  var resultX1 = Math.min(sx, ex, midX1, midX2);
  var resultX2 = Math.max(sx, ex, midX1, midX2);
  var resultY1 = Math.min(sy, ey, midY1, midY2);
  var resultY2 = Math.max(sy, ey, midY1, midY2);
  return new Rectangle(
    resultX1,
    resultY1,
    resultX2 - resultX1,
    resultY2 - resultY1
  );
};

//De Casteljau algorithm
var getBezierCurveBoundary = function (
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
  dx: number,
  dy: number
): RectangleType {
  var tobx = bx - ax;
  var toby = by - ay;
  var tocx = cx - bx;
  var tocy = cy - by;
  var todx = dx - cx;
  var tody = dy - cy;
  var precision = 40;
  var d: number,
    i: number,
    px: number,
    py: number,
    qx: number,
    qy: number,
    rx: number,
    ry: number,
    tx: number,
    ty: number,
    sx: number,
    sy: number,
    x: number,
    y: number,
    // Definite-assignment assertions: the loop's first iteration (i === 0)
    // assigns all four before they are read.
    minx!: number,
    miny!: number,
    maxx!: number,
    maxy!: number,
    toqx: number,
    toqy: number,
    torx: number,
    tory: number,
    totx: number,
    toty: number;
  for (i = 0; i < precision + 1; i++) {
    d = i / precision;
    px = ax + d * tobx;
    py = ay + d * toby;
    qx = bx + d * tocx;
    qy = by + d * tocy;
    rx = cx + d * todx;
    ry = cy + d * tody;
    toqx = qx - px;
    toqy = qy - py;
    torx = rx - qx;
    tory = ry - qy;

    sx = px + d * toqx;
    sy = py + d * toqy;
    tx = qx + d * torx;
    ty = qy + d * tory;
    totx = tx - sx;
    toty = ty - sy;

    x = sx + d * totx;
    y = sy + d * toty;
    if (i == 0) {
      minx = x;
      miny = y;
      maxx = x;
      maxy = y;
    } else {
      minx = Math.min(minx, x);
      miny = Math.min(miny, y);
      maxx = Math.max(maxx, x);
      maxy = Math.max(maxy, y);
    }
  }
  return new Rectangle(
    Math.round(minx),
    Math.round(miny),
    Math.round(maxx - minx),
    Math.round(maxy - miny)
  );
};

var getPrevLineDashValue = function (
  lineDash: number[],
  lineDashOffset: number
): string {
  return JSON.stringify({
    lineDash: lineDash,
    lineDashOffset: lineDashOffset
  });
};

var setLineDash = function (this: Context2D): void {
  // Avoid unnecessary line dash declarations.
  if (
    !this.prevLineDash &&
    !this.ctx.lineDash.length &&
    !this.ctx.lineDashOffset
  ) {
    return;
  }

  // Avoid unnecessary line dash declarations.
  const nextLineDash = getPrevLineDashValue(
    this.ctx.lineDash,
    this.ctx.lineDashOffset
  );
  if (this.prevLineDash !== nextLineDash) {
    this.pdf.setLineDash(this.ctx.lineDash, this.ctx.lineDashOffset);
    this.prevLineDash = nextLineDash;
  }
};

(function (jsPDFAPI: JsPDFAPI) {
  "use strict";

  jsPDFAPI.events.push([
    "initialized",
    function (this: jsPDFDocument) {
      this.context2d = new Context2D(this);

      f2 = this.internal.f2;
      getHorizontalCoordinateString = this.internal.getCoordinateString;
      getVerticalCoordinateString = this.internal.getVerticalCoordinateString;
      getHorizontalCoordinate = this.internal.getHorizontalCoordinate;
      getVerticalCoordinate = this.internal.getVerticalCoordinate;
      Point = this.internal.Point;
      Rectangle = this.internal.Rectangle;
      Matrix = this.internal.Matrix;
      _ctx = new ContextLayer();
    }
  ]);
})(jsPDF.API);
