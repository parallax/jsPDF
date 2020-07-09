/* eslint-disable no-fallthrough */
/* eslint-disable no-console */
/* global jsPDF, RGBColor */
/**
 * jsPDF Context2D PlugIn Copyright (c) 2014 Steven Spungin (TwelveTone LLC) steven@twelvetone.tv
 *
 * Licensed under the MIT License. http://opensource.org/licenses/mit-license
 */
/**
 * This plugin mimics the HTML5 CanvasRenderingContext2D.
 *
 * The goal is to provide a way for current canvas implementations to print directly to a PDF.
 *
 * @name context2d
 * @module
 */
(function(jsPDFAPI) {
  "use strict";
  var ContextLayer = function(ctx) {
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

    this.ignoreClearRect =
      typeof ctx.ignoreClearRect === "boolean" ? ctx.ignoreClearRect : true;
    return this;
  };

  //stub
  var f2,
    getHorizontalCoordinateString,
    getVerticalCoordinateString,
    getHorizontalCoordinate,
    getVerticalCoordinate,
    Point,
    Rectangle,
    Matrix,
    _ctx;
  jsPDFAPI.events.push([
    "initialized",
    function() {
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

  var Context2D = function(pdf) {
    Object.defineProperty(this, "canvas", {
      get: function() {
        return { parentNode: false, style: false };
      }
    });

    var _pdf = pdf;
    Object.defineProperty(this, "pdf", {
      get: function() {
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
      get: function() {
        return _pageWrapXEnabled;
      },
      set: function(value) {
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
      get: function() {
        return _pageWrapYEnabled;
      },
      set: function(value) {
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
      get: function() {
        return _posX;
      },
      set: function(value) {
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
      get: function() {
        return _posY;
      },
      set: function(value) {
        if (!isNaN(value)) {
          _posY = value;
        }
      }
    });

    var _autoPaging = false;
    /**
     * @name autoPaging
     * @type {boolean}
     * @default true
     */
    Object.defineProperty(this, "autoPaging", {
      get: function() {
        return _autoPaging;
      },
      set: function(value) {
        _autoPaging = Boolean(value);
      }
    });

    var lastBreak = 0;
    /**
     * @name lastBreak
     * @type {number}
     * @default 0
     */
    Object.defineProperty(this, "lastBreak", {
      get: function() {
        return lastBreak;
      },
      set: function(value) {
        lastBreak = value;
      }
    });

    var pageBreaks = [];
    /**
     * Y Position of page breaks.
     * @name pageBreaks
     * @type {number}
     * @default 0
     */
    Object.defineProperty(this, "pageBreaks", {
      get: function() {
        return pageBreaks;
      },
      set: function(value) {
        pageBreaks = value;
      }
    });

    /**
     * @name ctx
     * @type {object}
     * @default {}
     */
    Object.defineProperty(this, "ctx", {
      get: function() {
        return _ctx;
      },
      set: function(value) {
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
      get: function() {
        return _ctx.path;
      },
      set: function(value) {
        _ctx.path = value;
      }
    });

    /**
     * @name ctxStack
     * @type {array}
     * @default []
     */
    var _ctxStack = [];
    Object.defineProperty(this, "ctxStack", {
      get: function() {
        return _ctxStack;
      },
      set: function(value) {
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
      get: function() {
        return this.ctx.fillStyle;
      },
      set: function(value) {
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
      get: function() {
        return this.ctx.strokeStyle;
      },
      set: function(value) {
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
      get: function() {
        return this.ctx.lineCap;
      },
      set: function(value) {
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
      get: function() {
        return this.ctx.lineWidth;
      },
      set: function(value) {
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
      get: function() {
        return this.ctx.lineJoin;
      },
      set: function(value) {
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
      get: function() {
        return this.ctx.miterLimit;
      },
      set: function(value) {
        if (!isNaN(value)) {
          this.ctx.miterLimit = value;
          this.pdf.setMiterLimit(value);
        }
      }
    });

    Object.defineProperty(this, "textBaseline", {
      get: function() {
        return this.ctx.textBaseline;
      },
      set: function(value) {
        this.ctx.textBaseline = value;
      }
    });

    Object.defineProperty(this, "textAlign", {
      get: function() {
        return this.ctx.textAlign;
      },
      set: function(value) {
        if (["right", "end", "center", "left", "start"].indexOf(value) !== -1) {
          this.ctx.textAlign = value;
        }
      }
    });

    Object.defineProperty(this, "font", {
      get: function() {
        return this.ctx.font;
      },
      set: function(value) {
        this.ctx.font = value;
        var rx, matches;

        //source: https://stackoverflow.com/a/10136041
        // eslint-disable-next-line no-useless-escape
        rx = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-_,\"\'\sa-z]+?)\s*$/i;
        matches = rx.exec(value);
        if (matches !== null) {
          var fontStyle = matches[1];
          var fontVariant = matches[2];
          var fontWeight = matches[3];
          var fontSize = matches[4];
          var lineHeight = matches[5];
          var fontFamily = matches[6];
        } else {
          return;
        }
        var rxFontSize = /^([.\d]+)((?:%|in|[cem]m|ex|p[ctx]))$/i;
        var fontSizeUnit = rxFontSize.exec(fontSize)[2];

        if ("px" === fontSizeUnit) {
          fontSize = Math.floor(parseFloat(fontSize) * this.pdf.internal.scaleFactor);
        } else if ("em" === fontSizeUnit) {
          fontSize = Math.floor(parseFloat(fontSize) * this.pdf.getFontSize());
        } else {
          fontSize = Math.floor(parseFloat(fontSize) * this.pdf.internal.scaleFactor);
        }

        this.pdf.setFontSize(fontSize);

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
        var parts = fontFamily
          .toLowerCase()
          .replace(/"|'/g, "")
          .split(/\s*,\s*/);

        var fallbackFonts = {
          arial: "Helvetica",
          verdana: "Helvetica",
          helvetica: "Helvetica",
          "sans-serif": "Helvetica",
          fixed: "Courier",
          monospace: "Courier",
          terminal: "Courier",
          courier: "Courier",
          times: "Times",
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
      get: function() {
        return this.ctx.globalCompositeOperation;
      },
      set: function(value) {
        this.ctx.globalCompositeOperation = value;
      }
    });

    Object.defineProperty(this, "globalAlpha", {
      get: function() {
        return this.ctx.globalAlpha;
      },
      set: function(value) {
        this.ctx.globalAlpha = value;
      }
    });

    // Not HTML API
    Object.defineProperty(this, "ignoreClearRect", {
      get: function() {
        return this.ctx.ignoreClearRect;
      },
      set: function(value) {
        this.ctx.ignoreClearRect = Boolean(value);
      }
    });
  };

  Context2D.prototype.fill = function() {
    pathPreProcess.call(this, "fill", false);
  };

  /**
   * Actually draws the path you have defined
   *
   * @name stroke
   * @function
   * @description The stroke() method actually draws the path you have defined with all those moveTo() and lineTo() methods. The default color is black.
   */
  Context2D.prototype.stroke = function() {
    pathPreProcess.call(this, "stroke", false);
  };

  /**
   * Begins a path, or resets the current
   *
   * @name beginPath
   * @function
   * @description The beginPath() method begins a path, or resets the current path.
   */
  Context2D.prototype.beginPath = function() {
    this.path = [
      {
        type: "begin"
      }
    ];
  };

  /**
   * Moves the path to the specified point in the canvas, without creating a line
   *
   * @name moveTo
   * @function
   * @param x {Number} The x-coordinate of where to move the path to
   * @param y {Number} The y-coordinate of where to move the path to
   */
  Context2D.prototype.moveTo = function(x, y) {
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
  };

  /**
   * Creates a path from the current point back to the starting point
   *
   * @name closePath
   * @function
   * @description The closePath() method creates a path from the current point back to the starting point.
   */
  Context2D.prototype.closePath = function() {
    var pathBegin = new Point(0, 0);
    var i = 0;
    for (i = this.path.length - 1; i !== -1; i--) {
      if (this.path[i].type === "begin") {
        if (
          typeof this.path[i + 1] === "object" &&
          typeof this.path[i + 1].x === "number"
        ) {
          pathBegin = new Point(this.path[i + 1].x, this.path[i + 1].y);
          this.path.push({
            type: "lt",
            x: pathBegin.x,
            y: pathBegin.y
          });
          break;
        }
      }
    }
    if (
      typeof this.path[i + 2] === "object" &&
      typeof this.path[i + 2].x === "number"
    ) {
      this.path.push(JSON.parse(JSON.stringify(this.path[i + 2])));
    }
    this.path.push({
      type: "close"
    });
    this.ctx.lastPoint = new Point(pathBegin.x, pathBegin.y);
  };

  /**
   * Adds a new point and creates a line to that point from the last specified point in the canvas
   *
   * @name lineTo
   * @function
   * @param x The x-coordinate of where to create the line to
   * @param y The y-coordinate of where to create the line to
   * @description The lineTo() method adds a new point and creates a line TO that point FROM the last specified point in the canvas (this method does not draw the line).
   */
  Context2D.prototype.lineTo = function(x, y) {
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
  };

  /**
   * Clips a region of any shape and size from the original canvas
   *
   * @name clip
   * @function
   * @description The clip() method clips a region of any shape and size from the original canvas.
   */
  Context2D.prototype.clip = function() {
    this.ctx.clip_path = JSON.parse(JSON.stringify(this.path));
    pathPreProcess.call(this, null, true);
  };

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
  Context2D.prototype.quadraticCurveTo = function(cpx, cpy, x, y) {
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
  };

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
  Context2D.prototype.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
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
  };

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
  Context2D.prototype.arc = function(
    x,
    y,
    radius,
    startAngle,
    endAngle,
    counterclockwise
  ) {
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
  };

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
  Context2D.prototype.arcTo = function(x1, y1, x2, y2, radius) {
    throw new Error("arcTo not implemented.");
  };

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
  Context2D.prototype.rect = function(x, y, w, h) {
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
  };

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
  Context2D.prototype.fillRect = function(x, y, w, h) {
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      console.error("jsPDF.context2d.fillRect: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.fillRect");
    }
    if (isFillTransparent.call(this)) {
      return;
    }
    var tmp = {};
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
      this.lineCap = tmp.lineCap;
    }
    if (tmp.hasOwnProperty("lineJoin")) {
      this.lineJoin = tmp.lineJoin;
    }
  };

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
  Context2D.prototype.strokeRect = function strokeRect(x, y, w, h) {
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
  };

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
  Context2D.prototype.clearRect = function(x, y, w, h) {
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      console.error("jsPDF.context2d.clearRect: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.clearRect");
    }
    if (this.ignoreClearRect) {
      return;
    }

    this.fillStyle = "#ffffff";
    this.fillRect(x, y, w, h);
  };

  /**
   * Saves the state of the current context
   *
   * @name save
   * @function
   */
  Context2D.prototype.save = function(doStackPush) {
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
  };

  /**
   * Returns previously saved path state and attributes
   *
   * @name restore
   * @function
   */
  Context2D.prototype.restore = function(doStackPop) {
    doStackPop = typeof doStackPop === "boolean" ? doStackPop : true;
    var tmpPageNumber = this.pdf.internal.getCurrentPageInfo().pageNumber;
    for (var i = 0; i < this.pdf.internal.getNumberOfPages(); i++) {
      this.pdf.setPage(i + 1);
      this.pdf.internal.out("Q");
    }
    this.pdf.setPage(tmpPageNumber);

    if (doStackPop && this.ctxStack.length !== 0) {
      this.ctx = this.ctxStack.pop();
      this.fillStyle = this.ctx.fillStyle;
      this.strokeStyle = this.ctx.strokeStyle;
      this.font = this.ctx.font;
      this.lineCap = this.ctx.lineCap;
      this.lineWidth = this.ctx.lineWidth;
      this.lineJoin = this.ctx.lineJoin;
    }
  };

  /**
   * @name toDataURL
   * @function
   */
  Context2D.prototype.toDataURL = function() {
    throw new Error("toDataUrl not implemented.");
  };

  //helper functions

  /**
   * Get the decimal values of r, g, b and a
   *
   * @name getRGBA
   * @function
   * @private
   * @ignore
   */
  var getRGBA = function(style) {
    var rxRgb = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
    var rxRgba = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/;
    var rxTransparent = /transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/;

    var r, g, b, a;

    if (style.isCanvasGradient === true) {
      style = style.getColor();
    }

    if (!style) {
      return { r: 0, g: 0, b: 0, a: 0, style: style };
    }

    if (rxTransparent.test(style)) {
      r = 0;
      g = 0;
      b = 0;
      a = 0;
    } else {
      var matches = rxRgb.exec(style);
      if (matches !== null) {
        r = parseInt(matches[1]);
        g = parseInt(matches[2]);
        b = parseInt(matches[3]);
        a = 1;
      } else {
        matches = rxRgba.exec(style);
        if (matches !== null) {
          r = parseInt(matches[1]);
          g = parseInt(matches[2]);
          b = parseInt(matches[3]);
          a = parseFloat(matches[4]);
        } else {
          a = 1;

          if (typeof style === "string" && style.charAt(0) !== "#") {
            var rgbColor = new RGBColor(style);
            if (rgbColor.ok) {
              style = rgbColor.toHex();
            } else {
              style = "#000000";
            }
          }

          if (style.length === 4) {
            r = style.substring(1, 2);
            r += r;
            g = style.substring(2, 3);
            g += g;
            b = style.substring(3, 4);
            b += b;
          } else {
            r = style.substring(1, 3);
            g = style.substring(3, 5);
            b = style.substring(5, 7);
          }
          r = parseInt(r, 16);
          g = parseInt(g, 16);
          b = parseInt(b, 16);
        }
      }
    }
    return { r: r, g: g, b: b, a: a, style: style };
  };

  /**
   * @name isFillTransparent
   * @function
   * @private
   * @ignore
   * @returns {Boolean}
   */
  var isFillTransparent = function() {
    return this.ctx.isFillTransparent || this.globalAlpha == 0;
  };

  /**
   * @name isStrokeTransparent
   * @function
   * @private
   * @ignore
   * @returns {Boolean}
   */
  var isStrokeTransparent = function() {
    return Boolean(this.ctx.isStrokeTransparent || this.globalAlpha == 0);
  };

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
  Context2D.prototype.fillText = function(text, x, y, maxWidth) {
    if (isNaN(x) || isNaN(y) || typeof text !== "string") {
      console.error("jsPDF.context2d.fillText: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.fillText");
    }
    maxWidth = isNaN(maxWidth) ? undefined : maxWidth;
    if (isFillTransparent.call(this)) {
      return;
    }

    y = getBaseline.call(this, y);
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
  };

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
  Context2D.prototype.strokeText = function(text, x, y, maxWidth) {
    if (isNaN(x) || isNaN(y) || typeof text !== "string") {
      console.error("jsPDF.context2d.strokeText: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.strokeText");
    }
    if (isStrokeTransparent.call(this)) {
      return;
    }

    maxWidth = isNaN(maxWidth) ? undefined : maxWidth;
    y = getBaseline.call(this, y);

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
  };

  /**
   * Returns an object that contains the width of the specified text
   *
   * @name measureText
   * @function
   * @param text {String} The text to be measured
   * @description The measureText() method returns an object that contains the width of the specified text, in pixels.
   * @returns {Number}
   */
  Context2D.prototype.measureText = function(text) {
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

    var TextMetrics = function(options) {
      options = options || {};
      var _width = options.width || 0;
      Object.defineProperty(this, "width", {
        get: function() {
          return _width;
        }
      });
      return this;
    };
    return new TextMetrics({ width: txtWidth });
  };

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
  Context2D.prototype.scale = function(scalewidth, scaleheight) {
    if (isNaN(scalewidth) || isNaN(scaleheight)) {
      console.error("jsPDF.context2d.scale: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.scale");
    }
    var matrix = new Matrix(scalewidth, 0.0, 0.0, scaleheight, 0.0, 0.0);
    this.ctx.transform = this.ctx.transform.multiply(matrix);
  };

  /**
   * Rotates the current drawing
   *
   * @name rotate
   * @function
   * @param angle {Number} The rotation angle, in radians.
   * @description To calculate from degrees to radians: degrees*Math.PI/180. <br />
   * Example: to rotate 5 degrees, specify the following: 5*Math.PI/180
   */
  Context2D.prototype.rotate = function(angle) {
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
  };

  /**
   * Remaps the (0,0) position on the canvas
   *
   * @name translate
   * @function
   * @param x {Number} The value to add to horizontal (x) coordinates
   * @param y {Number} The value to add to vertical (y) coordinates
   * @description The translate() method remaps the (0,0) position on the canvas.
   */
  Context2D.prototype.translate = function(x, y) {
    if (isNaN(x) || isNaN(y)) {
      console.error("jsPDF.context2d.translate: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.translate");
    }
    var matrix = new Matrix(1.0, 0.0, 0.0, 1.0, x, y);
    this.ctx.transform = this.ctx.transform.multiply(matrix);
  };

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
  Context2D.prototype.transform = function(a, b, c, d, e, f) {
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f)) {
      console.error("jsPDF.context2d.transform: Invalid arguments", arguments);
      throw new Error("Invalid arguments passed to jsPDF.context2d.transform");
    }
    var matrix = new Matrix(a, b, c, d, e, f);
    this.ctx.transform = this.ctx.transform.multiply(matrix);
  };

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
  Context2D.prototype.setTransform = function(a, b, c, d, e, f) {
    a = isNaN(a) ? 1 : a;
    b = isNaN(b) ? 0 : b;
    c = isNaN(c) ? 0 : c;
    d = isNaN(d) ? 1 : d;
    e = isNaN(e) ? 0 : e;
    f = isNaN(f) ? 0 : f;
    this.ctx.transform = new Matrix(a, b, c, d, e, f);
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
  var setPageByYPosition = function(y) {
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
  Context2D.prototype.drawImage = function(
    img,
    sx,
    sy,
    swidth,
    sheight,
    x,
    y,
    width,
    height
  ) {
    var imageProperties = this.pdf.getImageProperties(img);
    var factorX = 1;
    var factorY = 1;
    var isClip;

    var clipFactorX = 1;
    var clipFactorY = 1;

    if (typeof swidth !== "undefined" && typeof width !== "undefined") {
      isClip = true;
      clipFactorX = width / swidth;
      clipFactorY = height / sheight;
      factorX = ((imageProperties.width / swidth) * width) / swidth;
      factorY = ((imageProperties.height / sheight) * height) / sheight;
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
    var xRect = matrix.applyToRectangle(
      new Rectangle(
        x - sx * clipFactorX,
        y - sy * clipFactorY,
        swidth * factorX,
        sheight * factorY
      )
    );
    var pageArray = getPagesByPath.call(this, xRect);
    var pages = [];
    for (var ii = 0; ii < pageArray.length; ii += 1) {
      if (pages.indexOf(pageArray[ii]) === -1) {
        pages.push(pageArray[ii]);
      }
    }

    sortPages(pages);

    var clipPath;
    if (this.autoPaging) {
      var min = pages[0];
      var max = pages[pages.length - 1];
      for (var i = min; i < max + 1; i++) {
        this.pdf.setPage(i);

        if (this.ctx.clip_path.length !== 0) {
          var tmpPaths = this.path;
          clipPath = JSON.parse(JSON.stringify(this.ctx.clip_path));
          this.path = pathPositionRedo(
            clipPath,
            this.posX,
            -1 * this.pdf.internal.pageSize.height * (i - 1) + this.posY
          );
          drawPaths.call(this, "fill", true);
          this.path = tmpPaths;
        }
        var tmpRect = JSON.parse(JSON.stringify(xRect));
        tmpRect = pathPositionRedo(
          [tmpRect],
          this.posX,
          -1 * this.pdf.internal.pageSize.height * (i - 1) + this.posY
        )[0];
        this.pdf.addImage(
          img,
          "JPEG",
          tmpRect.x,
          tmpRect.y,
          tmpRect.w,
          tmpRect.h,
          null,
          null,
          angle
        );
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
  };

  var getPagesByPath = function(path, pageWrapX, pageWrapY) {
    var result = [];
    pageWrapX = pageWrapX || this.pdf.internal.pageSize.width;
    pageWrapY = pageWrapY || this.pdf.internal.pageSize.height;

    switch (path.type) {
      default:
      case "mt":
      case "lt":
        result.push(Math.floor((path.y + this.posY) / pageWrapY) + 1);
        break;
      case "arc":
        result.push(
          Math.floor((path.y + this.posY - path.radius) / pageWrapY) + 1
        );
        result.push(
          Math.floor((path.y + this.posY + path.radius) / pageWrapY) + 1
        );
        break;
      case "qct":
        var rectOfQuadraticCurve = getQuadraticCurveBoundary(
          this.ctx.lastPoint.x,
          this.ctx.lastPoint.y,
          path.x1,
          path.y1,
          path.x,
          path.y
        );
        result.push(Math.floor(rectOfQuadraticCurve.y / pageWrapY) + 1);
        result.push(
          Math.floor(
            (rectOfQuadraticCurve.y + rectOfQuadraticCurve.h) / pageWrapY
          ) + 1
        );
        break;
      case "bct":
        var rectOfBezierCurve = getBezierCurveBoundary(
          this.ctx.lastPoint.x,
          this.ctx.lastPoint.y,
          path.x1,
          path.y1,
          path.x2,
          path.y2,
          path.x,
          path.y
        );
        result.push(Math.floor(rectOfBezierCurve.y / pageWrapY) + 1);
        result.push(
          Math.floor((rectOfBezierCurve.y + rectOfBezierCurve.h) / pageWrapY) +
            1
        );
        break;
      case "rect":
        result.push(Math.floor((path.y + this.posY) / pageWrapY) + 1);
        result.push(Math.floor((path.y + path.h + this.posY) / pageWrapY) + 1);
    }

    for (var i = 0; i < result.length; i += 1) {
      while (this.pdf.internal.getNumberOfPages() < result[i]) {
        addPage.call(this);
      }
    }
    return result;
  };

  var addPage = function() {
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

  var pathPositionRedo = function(paths, x, y) {
    for (var i = 0; i < paths.length; i++) {
      switch (paths[i].type) {
        case "bct":
          paths[i].x2 += x;
          paths[i].y2 += y;
        case "qct":
          paths[i].x1 += x;
          paths[i].y1 += y;
        case "mt":
        case "lt":
        case "arc":
        default:
          paths[i].x += x;
          paths[i].y += y;
      }
    }
    return paths;
  };

  var sortPages = function (pages) {
    return pages.sort(function (a, b) {
      return a - b;
    })
  }

  var pathPreProcess = function(rule, isClip) {
    var fillStyle = this.fillStyle;
    var strokeStyle = this.strokeStyle;
    var lineCap = this.lineCap;
    var lineWidth = this.lineWidth;
    var lineJoin = this.lineJoin;

    var origPath = JSON.parse(JSON.stringify(this.path));
    var xPath = JSON.parse(JSON.stringify(this.path));
    var clipPath;
    var tmpPath;
    var pages = [];

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

    if (this.autoPaging) {
      var min = pages[0];
      var max = pages[pages.length - 1];
      for (var k = min; k < max + 1; k++) {
        this.pdf.setPage(k);

        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineCap = lineCap;
        this.lineWidth = lineWidth;
        this.lineJoin = lineJoin;

        if (this.ctx.clip_path.length !== 0) {
          var tmpPaths = this.path;
          clipPath = JSON.parse(JSON.stringify(this.ctx.clip_path));
          this.path = pathPositionRedo(
            clipPath,
            this.posX,
            -1 * this.pdf.internal.pageSize.height * (k - 1) + this.posY
          );
          drawPaths.call(this, rule, true);
          this.path = tmpPaths;
        }
        tmpPath = JSON.parse(JSON.stringify(origPath));
        this.path = pathPositionRedo(
          tmpPath,
          this.posX,
          -1 * this.pdf.internal.pageSize.height * (k - 1) + this.posY
        );
        if (isClip === false || k === 0) {
          drawPaths.call(this, rule, isClip);
        }
      }
    } else {
      drawPaths.call(this, rule, isClip);
    }
    this.path = origPath;
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
  var drawPaths = function(rule, isClip) {
    if (rule === "stroke" && !isClip && isStrokeTransparent.call(this)) {
      return;
    }

    if (rule !== "stroke" && !isClip && isFillTransparent.call(this)) {
      return;
    }

    var moves = [];

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
          if (!isNaN(xPath[i - 1].x)) {
            delta = [pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
            if (iii > 0) {
              for (iii; iii >= 0; iii--) {
                if (
                  moves[iii - 1].close !== true &&
                  moves[iii - 1].begin !== true
                ) {
                  moves[iii - 1].deltas.push(delta);
                  moves[iii - 1].abs.push(pt);
                  break;
                }
              }
            }
          }
          break;

        case "bct":
          delta = [
            pt.x1 - xPath[i - 1].x,
            pt.y1 - xPath[i - 1].y,
            pt.x2 - xPath[i - 1].x,
            pt.y2 - xPath[i - 1].y,
            pt.x - xPath[i - 1].x,
            pt.y - xPath[i - 1].y
          ];
          moves[moves.length - 1].deltas.push(delta);
          break;

        case "qct":
          var x1 = xPath[i - 1].x + (2.0 / 3.0) * (pt.x1 - xPath[i - 1].x);
          var y1 = xPath[i - 1].y + (2.0 / 3.0) * (pt.y1 - xPath[i - 1].y);
          var x2 = pt.x + (2.0 / 3.0) * (pt.x1 - pt.x);
          var y2 = pt.y + (2.0 / 3.0) * (pt.y1 - pt.y);
          var x3 = pt.x;
          var y3 = pt.y;
          delta = [
            x1 - xPath[i - 1].x,
            y1 - xPath[i - 1].y,
            x2 - xPath[i - 1].x,
            y2 - xPath[i - 1].y,
            x3 - xPath[i - 1].x,
            y3 - xPath[i - 1].y
          ];
          moves[moves.length - 1].deltas.push(delta);
          break;

        case "arc":
          moves.push({
            deltas: [],
            abs: [],
            arc: true
          });

          if (Array.isArray(moves[moves.length - 1].abs)) {
            moves[moves.length - 1].abs.push(pt);
          }
          break;
      }
    }
    var style;
    if (!isClip) {
      if (rule === "stroke") {
        style = "stroke";
      } else {
        style = "fill";
      }
    } else {
      style = null;
    }

    for (var k = 0; k < moves.length; k++) {
      if (moves[k].arc) {
        var arcs = moves[k].abs;

        for (var ii = 0; ii < arcs.length; ii++) {
          var arc = arcs[ii];

          if (arc.type === "arc") {
            drawArc.call(
              this,
              arc.x,
              arc.y,
              arc.radius,
              arc.startAngle,
              arc.endAngle,
              arc.counterclockwise,
              undefined,
              isClip
            );
          } else {
            drawLine.call(this, arc.x, arc.y);
          }
        }
        putStyle.call(this, style);
        this.pdf.internal.out("h");
      }
      if (!moves[k].arc) {
        if (moves[k].close !== true && moves[k].begin !== true) {
          var x = moves[k].start.x;
          var y = moves[k].start.y;
          drawLines.call(this, moves[k].deltas, x, y);
        }
      }
    }

    if (style) {
      putStyle.call(this, style);
    }
    if (isClip) {
      doClip.call(this);
    }
  };

  var getBaseline = function(y) {
    var height =
      this.pdf.internal.getFontSize() / this.pdf.internal.scaleFactor;
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

  Context2D.prototype.createLinearGradient = function createLinearGradient() {
    var canvasGradient = function canvasGradient() {};

    canvasGradient.colorStops = [];
    canvasGradient.addColorStop = function(offset, color) {
      this.colorStops.push([offset, color]);
    };

    canvasGradient.getColor = function() {
      if (this.colorStops.length === 0) {
        return "#000000";
      }

      return this.colorStops[0][1];
    };

    canvasGradient.isCanvasGradient = true;
    return canvasGradient;
  };
  Context2D.prototype.createPattern = function createPattern() {
    return this.createLinearGradient();
  };
  Context2D.prototype.createRadialGradient = function createRadialGradient() {
    return this.createLinearGradient();
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
  var drawArc = function(x, y, r, a1, a2, counterclockwise, style, isClip) {
    // http://hansmuller-flex.blogspot.com/2011/10/more-about-approximating-circular-arcs.html
    var includeMove = true;
    var curves = createArc.call(this, r, a1, a2, counterclockwise);

    for (var i = 0; i < curves.length; i++) {
      var curve = curves[i];
      if (includeMove && i === 0) {
        doMove.call(this, curve.x1 + x, curve.y1 + y);
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

  var putStyle = function(style) {
    switch (style) {
      case "stroke":
        this.pdf.internal.out("S");
        break;
      case "fill":
        this.pdf.internal.out("f");
        break;
    }
  };

  var doClip = function() {
    this.pdf.clip();
    this.pdf.discardPath();
  };

  var doMove = function(x, y) {
    this.pdf.internal.out(
      getHorizontalCoordinateString(x) +
        " " +
        getVerticalCoordinateString(y) +
        " m"
    );
  };

  var putText = function(options) {
    var textAlign;
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

    var pt = this.ctx.transform.applyToPoint(new Point(options.x, options.y));
    var decomposedTransformationMatrix = this.ctx.transform.decompose();
    var matrix = new Matrix();
    matrix = matrix.multiply(decomposedTransformationMatrix.translate);
    matrix = matrix.multiply(decomposedTransformationMatrix.skew);
    matrix = matrix.multiply(decomposedTransformationMatrix.scale);

    var textDimensions = this.pdf.getTextDimensions(options.text);
    var textRect = this.ctx.transform.applyToRectangle(
      new Rectangle(options.x, options.y, textDimensions.w, textDimensions.h)
    );
    var textXRect = matrix.applyToRectangle(
      new Rectangle(
        options.x,
        options.y - textDimensions.h,
        textDimensions.w,
        textDimensions.h
      )
    );
    var pageArray = getPagesByPath.call(this, textXRect);
    var pages = [];
    for (var ii = 0; ii < pageArray.length; ii += 1) {
      if (pages.indexOf(pageArray[ii]) === -1) {
        pages.push(pageArray[ii]);
      }
    }

    sortPages(pages);

    var clipPath, oldSize;
    if (this.autoPaging === true) {
      var min = pages[0];
      var max = pages[pages.length - 1];
      for (var i = min; i < max + 1; i++) {
        this.pdf.setPage(i);

        if (this.ctx.clip_path.length !== 0) {
          var tmpPaths = this.path;
          clipPath = JSON.parse(JSON.stringify(this.ctx.clip_path));
          this.path = pathPositionRedo(
            clipPath,
            this.posX,
            -1 * this.pdf.internal.pageSize.height * (i - 1) + this.posY
          );
          drawPaths.call(this, "fill", true);
          this.path = tmpPaths;
        }
        var tmpRect = JSON.parse(JSON.stringify(textRect));
        tmpRect = pathPositionRedo(
          [tmpRect],
          this.posX,
          -1 * this.pdf.internal.pageSize.height * (i - 1) + this.posY
        )[0];

        if (options.scale >= 0.01) {
          oldSize = this.pdf.internal.getFontSize();
          this.pdf.setFontSize(oldSize * options.scale);
        }
        this.pdf.text(options.text, tmpRect.x, tmpRect.y, {
          angle: options.angle,
          align: textAlign,
          renderingMode: options.renderingMode,
          maxWidth: options.maxWidth
        });

        if (options.scale >= 0.01) {
          this.pdf.setFontSize(oldSize);
        }
      }
    } else {
      if (options.scale >= 0.01) {
        oldSize = this.pdf.internal.getFontSize();
        this.pdf.setFontSize(oldSize * options.scale);
      }
      this.pdf.text(options.text, pt.x + this.posX, pt.y + this.posY, {
        angle: options.angle,
        align: textAlign,
        renderingMode: options.renderingMode,
        maxWidth: options.maxWidth
      });

      if (options.scale >= 0.01) {
        this.pdf.setFontSize(oldSize);
      }
    }
  };

  var drawLine = function(x, y, prevX, prevY) {
    prevX = prevX || 0;
    prevY = prevY || 0;

    this.pdf.internal.out(
      getHorizontalCoordinateString(x + prevX) +
        " " +
        getVerticalCoordinateString(y + prevY) +
        " l"
    );
  };

  var drawLines = function(lines, x, y) {
    return this.pdf.lines(lines, x, y, null, null);
  };

  var drawCurve = function(x, y, x1, y1, x2, y2, x3, y3) {
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
  var createArc = function(radius, startAngle, endAngle, anticlockwise) {
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
    var curves = [];

    // clockwise or counterclockwise
    var sgn = anticlockwise ? -1 : +1;

    var a1 = startAngle;
    for (; totalAngle > EPSILON; ) {
      var remain = sgn * Math.min(totalAngle, halfPi);
      var a2 = a1 + remain;
      curves.push(createSmallArc.call(this, radius, a1, a2));
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
  var createSmallArc = function(r, a1, a2) {
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

  var rad2deg = function(value) {
    return (value * 180) / Math.PI;
  };

  var getQuadraticCurveBoundary = function(sx, sy, cpx, cpy, ex, ey) {
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
  var getBezierCurveBoundary = function(ax, ay, bx, by, cx, cy, dx, dy) {
    var tobx = bx - ax;
    var toby = by - ay;
    var tocx = cx - bx;
    var tocy = cy - by;
    var todx = dx - cx;
    var tody = dy - cy;
    var precision = 40;
    var d,
      i,
      px,
      py,
      qx,
      qy,
      rx,
      ry,
      tx,
      ty,
      sx,
      sy,
      x,
      y,
      minx,
      miny,
      maxx,
      maxy,
      toqx,
      toqy,
      torx,
      tory,
      totx,
      toty;
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
})(jsPDF.API);
