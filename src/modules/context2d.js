/**
 * jsPDF Context2D PlugIn Copyright (c) 2014 Steven Spungin (TwelveTone LLC) steven@twelvetone.tv
 *
 * Licensed under the MIT License. http://opensource.org/licenses/mit-license
 */

/**
 * TODO implement stroke opacity (refactor from fill() method )
 * TODO transform angle and radii parameters
 */

/**
* This plugin mimics the HTML5 Canvas's context2d.
*
* The goal is to provide a way for current canvas implementations to print directly to a PDF.
*
* @name context2d
* @module
*/
(function (jsPDFAPI, globalObj) {
    'use strict';
    
    var ContextLayer = function(ctx) {
        ctx = ctx || {};
        this.isStrokeTransparent =             ctx.isStrokeTransparent         || false;
        this.strokeOpacity =                   ctx.strokeOpacity               || 1;
        this.strokeStyle =                     ctx.strokeStyle                 || '#000000';
        this.fillStyle =                       ctx.fillStyle                   || '#000000';
        this.isFillTransparent =               ctx.isFillTransparent           || false;
        this.fillOpacity =                     ctx.fillOpacity                 || 1;
        this.font =                            ctx.font                        || '10px sans-serif';
        this.textBaseline =                    ctx.textBaseline                || 'alphabetic';
        this.textAlign =                       ctx.textAlign                   || 'left';
        this.lineWidth =                       ctx.lineWidth                   || 1;
        this.lineJoin =                        ctx.lineJoin                    || 'miter';
        this.lineCap =                         ctx.lineCap                     || 'butt';
        this.transform =                       ctx.transform                   || [1, 0, 0, 1, 0, 0];
        this.globalCompositeOperation =        ctx.globalCompositeOperation    || 'normal';
        this.globalAlpha =                     ctx.globalAlpha                 || 1.0;
        this.clip_path =                       ctx.clip_path                   || [];
        this.currentPoint =                    ctx.currentPoint                || {x : 0, y : 0};
        this.miterLimit =                      ctx.miterLimit                  || 10.0;
        
        // Not HTML API
        this.ignoreClearRect =                 ctx.ignoreClearRect             || false;
        return this;
    };
    
    //stub
    var f2;

    jsPDFAPI.events.push([
        'initialized', function () {
            this.context2d = new Context2d();
            this.context2d.pdf = this;
            this.context2d.ctxStack = [];
            this.context2d.path = [];
            f2 = this.internal.f2;
        }
    ]);
    
    var Context2d = function() {
        
        Object.defineProperty(this, 'canvas', {
            get: function () {
                return {parentNode: false, style: false};
            }
        });
        
        var _pageWrapXEnabled = false;
        /**
        * @name pageWrapXEnabled
        * @type {boolean}
        * @default false
        */
       Object.defineProperty(this, 'pageWrapXEnabled', {
            get : function() {
                return _pageWrapXEnabled;
            },
            set : function(value) {
                _pageWrapXEnabled = Boolean(value);
            }
        });
        
        var _pageWrapYEnabled = false;
        /**
        * @name pageWrapYEnabled
        * @type {boolean}
        * @default true
        */
       Object.defineProperty(this, 'pageWrapYEnabled', {
            get : function() {
                return _pageWrapYEnabled;
            },
            set : function(value) {
                _pageWrapYEnabled = Boolean(value);
            }
        });
        
        var _pageWrapY = 9999999;
        /**
        * @name pageWrapY
        * @type {number}
        * @default 9999999
        */
       Object.defineProperty(this, 'pageWrapY', {
            get : function() {
                return _pageWrapY;
            },
            set : function(value) {
                if (!isNaN(value)) {
                    _pageWrapY = value;
                }
            }
        });
        
        var _pageWrapX = 9999999;
        /**
        * @name pageWrapX
        * @type {number}
        * @default 9999999
        */
       Object.defineProperty(this, 'pageWrapX', {
            get : function() {
                return _pageWrapX;
            },
            set : function(value) {
                if (!isNaN(value)) {
                    _pageWrapX = value;
                }
            }
        });
        
        var _posX = 0;
        /**
        * @name posX
        * @type {number}
        * @default 0
        */
       Object.defineProperty(this, 'posX', {
            get : function() {
                return _posX;
            },
            set : function(value) {
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
       Object.defineProperty(this, 'posY', {
            get : function() {
                return _posY;
            },
            set : function(value) {
                if (!isNaN(value)) {
                    _posY = value;
                }
            }
        });
        
        var lastBreak = 0;
        /**
        * @name lastBreak
        * @type {number}
        * @default 0
        */
       Object.defineProperty(this, 'lastBreak', {
            get : function() {
                return lastBreak;
            },
            set : function(value) {
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
       Object.defineProperty(this, 'pageBreaks', {
            get : function() {
                return pageBreaks;
            },
            set : function(value) {
                pageBreaks = value;
            }
        });

        var _ctx = new ContextLayer();
        /**
        * @name ctx
        * @type {object}
        * @default {}
        */
       Object.defineProperty(this, 'ctx', {
            get : function() {
                return _ctx;
            },
            set : function(value) {
                if (value instanceof ContextLayer) {
                    _ctx = value;
                }
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
        Object.defineProperty(this, 'fillStyle', {
            set: function (value) {
                var rgba; 
                rgba = getRGBA(value);

                this.ctx.fillStyle = rgba.style;
                this.ctx.isFillTransparent = (rgba.a === 0);
                this.ctx.fillOpacity = rgba.a;

                this.pdf.setFillColor(rgba.r, rgba.g, rgba.b, {
                    a: rgba.a
                });
                this.pdf.setTextColor(rgba.r, rgba.g, rgba.b, {
                    a: rgba.a
                });
            },
            get: function () {
                return this.ctx.fillStyle;
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
        Object.defineProperty(this, 'strokeStyle', {
            get: function () {
                return this.ctx.strokeStyle;
            },
            set: function (value) {
                var rgba = getRGBA(value);

                this.ctx.strokeStyle = rgba.style;
                this.ctx.isStrokeTransparent = (rgba.a === 0);
                this.ctx.strokeOpacity = rgba.a;

                if (rgba.a === 0) {
                    this.pdf.setDrawColor(255, 255, 255);
                } else if (rgba.a === 1) {
                    this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
                } else {
                    //this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b, {a: rgba.a});
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
        Object.defineProperty(this, 'lineCap', {
            get: function () {
                return this.ctx.lineCap;
            },
            set: function (value) {
                if (['butt', 'round', 'square'].indexOf(value) !== -1) {
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
        Object.defineProperty(this, 'lineWidth', {
            get: function () {
                return this.ctx.lineWidth;
            },
            set: function (value) {
                if (!isNaN(value)) {
                    this.ctx.lineWidth = value;
                    this.pdf.setLineWidth(value);
                }
            }
        });

        /**
        * Sets or returns the type of corner created, when two lines meet
        */
        Object.defineProperty(this, 'lineJoin', {
            get: function () {
                return this.ctx.lineJoin;
            },
            set: function (value) {
                if (['bevel', 'round', 'miter'].indexOf(value) !== -1) {
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
        Object.defineProperty(this, 'miterLimit', {
            get: function () {
                return this.ctx.miterLimit;
            },
            set: function (value) {
                if (!isNaN(value)) {
                    this.ctx.miterLimit = value;
                }
            }
        });
        
        Object.defineProperty(this, 'textBaseline', {
            get: function () {
                return this.ctx.textBaseline;
            },
            set: function (value) {
                this.ctx.textBaseline = value;
            }
        });

        Object.defineProperty(this, 'textAlign', {
            get: function () {
                return this.ctx.textAlign;
            },
            set: function (value) {
                switch (value) {
                    case 'right':
                    case 'end':
                        this.ctx.textAlign = 'right';
                        break;
                    case 'center':
                        this.ctx.textAlign = 'center';
                        break;
                    case 'left':
                    case 'start':
                    default:
                        this.ctx.textAlign = 'left';
                        break;
                }
            }
        });

        Object.defineProperty(this, 'font', {
            get: function () {
                return this.ctx.font;
            },
            set: function (value) {
                this.ctx.font = value;
                var rx, m;
                
                //source: https://stackoverflow.com/a/10136041
                rx = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\"\'\sa-z]+?)\s*$/i;
                m = rx.exec(value);
                if (m !== null) {
                    var fontStyle = m[1];
                    var fontVariant = m[2];
                    var fontWeight = m[3];
                    var fontSize = m[4];
                    var fontSizeUnit = m[5];
                    var fontFamily = m[6];
                } else {
                    return;
                }

                if ('px' === fontSizeUnit) {
                    fontSize = Math.floor(parseFloat(fontSize));
                } else if ('em' === fontSizeUnit) {
                    fontSize = Math.floor(parseFloat(fontSize) * this.pdf.getFontSize());
                } else {
                    fontSize = Math.floor(parseFloat(fontSize));
                }

                this.pdf.setFontSize(fontSize);
                    
                var style = '';
                if (fontWeight === 'bold' || parseInt(fontWeight, 10) >= 700 || fontStyle === 'bold') {
                    style =  'bold';
                }
                
                if (fontStyle === 'italic') {
                    style += 'italic';
                }
                
                if (style.length === 0) {
                    style = 'normal';
                }
                var jsPdfFontName = '';
                var parts = fontFamily.toLowerCase().replace(/"|'/g,'').split(/\s*,\s*/);
                
                var fallbackFonts = {
                    arial: 'Helvetica',
                    verdana: 'Helvetica',
                    helvetica: 'Helvetica',
                    'sans-serif': 'Helvetica',
                    fixed: 'Courier',
                    monospace: 'Courier',
                    terminal: 'Courier',
                    courier: 'Courier',
                    times: 'Times',
                    cursive: 'Times',
                    fantasy: 'Times',
                    serif: 'Times'
                }
                    
                for (var i = 0; i < parts.length; i++) {
                    if (this.pdf.internal.getFont(parts[i], style, {noFallback: true, disableWarning: true}) !== undefined) {
                        jsPdfFontName = parts[i];
                        break;
                    } else if (style === 'bolditalic' && this.pdf.internal.getFont(parts[i], 'bold', {noFallback: true, disableWarning: true}) !== undefined) {
                          jsPdfFontName = parts[i];
                          style = 'bold';
                    } else if (this.pdf.internal.getFont(parts[i], 'normal', {noFallback: true, disableWarning: true}) !== undefined){
                        jsPdfFontName = parts[i];
                        style = 'normal';
                        break;
                    }
                }
                if (jsPdfFontName === '') {
                    for (var i = 0; i < parts.length; i++) {
                        if (fallbackFonts[parts[i]]) {
                            jsPdfFontName = fallbackFonts[parts[i]];
                            break;
                        }
                    }
                }
                jsPdfFontName = (jsPdfFontName === '') ? 'Times' : jsPdfFontName;
                this.pdf.setFont(jsPdfFontName, style);
            }
        });
        
        Object.defineProperty(this, 'globalCompositeOperation', {
            get: function () {
                return this.ctx.globalCompositeOperation;
            },
            set: function (value) {
                this.ctx.globalCompositeOperation = value;
            }
        });
        
        Object.defineProperty(this, 'globalAlpha', {
            get: function () {
                return this.ctx.globalAlpha;
            },
            set: function (value) {
                this.ctx.globalAlpha = value;
            }
        });

        // Not HTML API
        Object.defineProperty(this, 'ignoreClearRect', {
            get: function () {
                return this.ctx.ignoreClearRect;
            },
            set: function (value) {
                this.ctx.ignoreClearRect = Boolean(value);
            }
        });
    };
    
    Context2d.prototype.fill = function () {
        specialPathMethod.call(this, 'fill', false);
    };
    
    /**
    * Actually draws the path you have defined
    *
    * @name stroke
    * @function
    * @description The stroke() method actually draws the path you have defined with all those moveTo() and lineTo() methods. The default color is black.
    */
    Context2d.prototype.stroke = function () {
        specialPathMethod.call(this, 'stroke', false);
    };
    
    /**
    * Begins a path, or resets the current 
    *
    * @name beginPath
    * @function 
    * @description The beginPath() method begins a path, or resets the current path.
    */
    Context2d.prototype.beginPath = function () {
        this.path = [{
            type: 'begin'
        }];
    };    
    
    /**
    * Moves the path to the specified point in the canvas, without creating a line
    * 
    * @name moveTo
    * @function
    * @param x {Number} The x-coordinate of where to move the path to    
    * @param y {Number} The y-coordinate of where to move the path to
    */
    Context2d.prototype.moveTo = function (x, y) {
        if (isNaN(x) || isNaN(y)) {
            console.error('jsPDF.context2d.moveTo: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.moveTo');
        }
		
        var pt = jsPDFAPI.matrix_map_point(this.ctx.transform, [x, y]);

        this.path.push({
            type: 'mt',
            x: pt[0],
            y: pt[1]
        });
    };
    
    /**
    * Creates a path from the current point back to the starting point
    * 
    * @name closePath
    * @function
    * @description The closePath() method creates a path from the current point back to the starting point.
    */
    Context2d.prototype.closePath = function () {
        var pathBegin = {x: 0, y: 0};
        var i = 0;
        for (i = (this.path.length - 1); i !== -1; i--) {
            if (this.path[i].type === 'begin') {
                if (typeof this.path[i+1] === 'object' && typeof this.path[i+1].x === 'number') {
                    pathBegin = {x: this.path[i+1].x, y: this.path[i+1].y};
                    this.path.push({
                        type: 'lt',
                        x: isNaN(pathBegin.x) ? 0 : pathBegin.x,
                        y: isNaN(pathBegin.y) ? 0 : pathBegin.y
                    });
                    break;
                }
            }
        }
        if (typeof this.path[i+2] === 'object' && typeof this.path[i+2].x === 'number') {
            this.path.push(JSON.parse(JSON.stringify(this.path[i+2])));
        }
        this.path.push({
            type: 'close'
        });
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
    Context2d.prototype.lineTo = function (x, y) {
        if (isNaN(x) || isNaN(y)) {
            console.error('jsPDF.context2d.lineTo: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.lineTo');
        }

        var pt = jsPDFAPI.matrix_map_point(this.ctx.transform, [x, y]);

        this.path.push({
            type: 'lt',
            x: pt[0],
            y: pt[1]
        });
    };

    /**
    * Clips a region of any shape and size from the original canvas
    * 
    * @name clip
    * @function
    * @description The clip() method clips a region of any shape and size from the original canvas.
    */
    Context2d.prototype.clip = function () {
		this.ctx.clip_path = JSON.parse(JSON.stringify(this.path));
        specialPathMethod.call(this, null, true);
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
    Context2d.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {    
        if (isNaN(x) || isNaN(y) || isNaN(cpx) || isNaN(cpy)) {
            console.error('jsPDF.context2d.quadraticCurveTo: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.quadraticCurveTo');
        }

        var pt0 = jsPDFAPI.matrix_map_point(this.ctx.transform, [x, y]);
        var pt1 = jsPDFAPI.matrix_map_point(this.ctx.transform, [cpx, cpy]);

        this.path.push({
            type: 'qct',
            x1: pt1[0],
            y1: pt1[1],
            x: pt0[0],
            y: pt0[1]
        });
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
    Context2d.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
        if (isNaN(x) || isNaN(y) || isNaN(cp1x) || isNaN(cp1y) || isNaN(cp2x) || isNaN(cp2y)) {
            console.error('jsPDF.context2d.bezierCurveTo: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.bezierCurveTo');
        }
        var pt0 = jsPDFAPI.matrix_map_point(this.ctx.transform, [x, y]);
        var pt1 = jsPDFAPI.matrix_map_point(this.ctx.transform, [cp1x, cp1y]);
        var pt2 = jsPDFAPI.matrix_map_point(this.ctx.transform, [cp2x, cp2y]);

        this.path.push({
            type: 'bct',
            x1: pt1[0],
            y1: pt1[1],
            x2: pt2[0],
            y2: pt2[1],
            x: pt0[0],
            y: pt0[1]
        });
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
    Context2d.prototype.arc = function (x, y, radius, startAngle, endAngle, counterclockwise) {
        if (isNaN(x) || isNaN(y) || isNaN(radius) || isNaN(startAngle) || isNaN(endAngle)) {
            console.error('jsPDF.context2d.arc: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.arc');
        }
        
        counterclockwise = Boolean(counterclockwise);

        if (!jsPDFAPI.matrix_is_identity(this.ctx.transform)) {
            var xpt = jsPDFAPI.matrix_map_point(this.ctx.transform, [x, y]);
            x = xpt[0];
            y = xpt[1];

            var x_radPt0 = jsPDFAPI.matrix_map_point(this.ctx.transform, [0, 0]);
            var x_radPt = jsPDFAPI.matrix_map_point(this.ctx.transform, [0, radius]);
            radius = Math.sqrt(Math.pow(x_radPt[0] - x_radPt0[0], 2) + Math.pow(x_radPt[1] - x_radPt0[1], 2));
        }
		if (Math.abs(endAngle - startAngle) >= (2 * Math.PI)) {
			startAngle = 0;
			endAngle = 2 * Math.PI;
		}

        this.path.push({
            type: 'arc',
            x: x,
            y: y,
            radius: radius,
            startAngle: startAngle,
            endAngle: endAngle,
            counterclockwise: counterclockwise
        });
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
    * @param radius The radius of the 
    * @description The arcTo() method creates an arc/curve between two tangents on the canvas.
    */
    Context2d.prototype.arcTo = function (x1, y1, x2, y2, radius) {
        //TODO needs to be implemented
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
    Context2d.prototype.rect = function (x, y, w, h) {
        if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
            console.error('jsPDF.context2d.rect: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.rect');
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
    Context2d.prototype.fillRect = function (x, y, w, h) {
        if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
            console.error('jsPDF.context2d.fillRect: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.fillRect');
        }
        if (isFillTransparent.call(this)) {
            return;
        }
        var tmp = {}; 
		if (this.lineCap !== 'butt') {
			tmp.lineCap = this.lineCap;
			this.lineCap = 'butt';
		}
		if (this.lineJoin !== 'miter') {
			tmp.lineJoin = this.lineJoin;
			this.lineJoin = 'miter';
		}
		
        this.beginPath();
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x, y);
        this.fill();
		
		if (tmp.hasOwnProperty('lineCap')) {
			this.lineCap = tmp.lineCap;
		}
		if (tmp.hasOwnProperty('lineJoin')) {
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
    Context2d.prototype.strokeRect = function strokeRect(x, y, w, h) {
        if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
            console.error('jsPDF.context2d.strokeRect: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.strokeRect');
        }
        if (isStrokeTransparent.call(this)) {
            return;
        }
        this.beginPath();
        this.moveTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x + w, y + h);
        this.lineTo(x, y + h);
        this.lineTo(x, y);
        this.lineTo(x + w, y);
        this.lineTo(x, y);
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
    Context2d.prototype.clearRect = function (x, y, w, h) {
        if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
            console.error('jsPDF.context2d.clearRect: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.clearRect');
        }
        if (this.ctx.ignoreClearRect) {
            return;
        }

        this.fillStyle = '#ffffff';
        this.fillRect(x, y, w, h);
    };
    
    /**
    * Saves the state of the current context
    * 
    * @name save
    * @function
    */
    Context2d.prototype.save = function (doStackPush) {
        doStackPush = typeof doStackPush === 'boolean' ? doStackPush : true;
        this.pdf.internal.out('q');
        
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
    Context2d.prototype.restore = function (doStackPop) {
        doStackPop = typeof doStackPop === 'boolean' ? doStackPop : true;
        this.pdf.internal.out('Q');
        
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
    Context2d.prototype.toDataURL = function () {
        throw new Error('toDataUrl not implemented.');
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
    var getRGBA = function (style) {
        var rxRgb = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
        var rxRgba = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/;
        var rxTransparent = /transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/;

        var r, g, b, a;
        
        if (style.isCanvasGradient === true) {
          style = style.getColor();
        }
        
        var rgbColor = new RGBColor(style);

        if (!style) {
            return {r: 0, g: 0, b: 0, a: 0, style: style};
        }

        if (rxTransparent.test(style)) {
            r = 0;
            g = 0;
            b = 0;
            a = 0;
        } else {
            var m = rxRgb.exec(style);
            if (m !== null) {
                r = parseInt(m[1]);
                g = parseInt(m[2]);
                b = parseInt(m[3]);
                a = 1;
            } else {
                m = rxRgba.exec(style);
                if (m !== null) {
                    r = parseInt(m[1]);
                    g = parseInt(m[2]);
                    b = parseInt(m[3]);
                    a = parseFloat(m[4]);
                } else {
                    a = 1;

                    if (style.charAt(0) !== '#') {
                        if (rgbColor.ok) {
                            style = rgbColor.toHex();
                        } else {
                            style = '#000000';
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
        return {r: r, g: g, b: b, a: a, style: style};
    };
    
    /**
    * @name isFillTransparent
    * @function 
    * @private
    * @ignore
    * @returns {Boolean}
    */
    var isFillTransparent = function () {
        return this.ctx.isFillTransparent || this.globalAlpha == 0;
    };

    /**
    * @name isStrokeTransparent
    * @function 
    * @private
    * @ignore
    * @returns {Boolean}
    */
    var isStrokeTransparent = function () {
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
    Context2d.prototype.fillText = function (text, x, y, maxWidth) {
        if (isNaN(x) || isNaN(y) || typeof text !== 'string') {
            console.error('jsPDF.context2d.fillText: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.fillText');
        }
        maxWidth = isNaN(maxWidth) ? undefined : maxWidth;
        if (isFillTransparent.call(this)) {
            return;
        }
        x = wrapX.call(this, x);
        y = wrapY.call(this, y);

        var xpt = jsPDFAPI.matrix_map_point(this.ctx.transform, [x, y]);
        x = xpt[0];
        y = xpt[1];
        var rads = jsPDFAPI.matrix_rotation(this.ctx.transform);
        var degs = rads * 57.2958;

        // We only use X axis as scale hint 
        var scale = 1;
        try {
            scale = jsPDFAPI.matrix_decompose(this.ctx.transform).scale[0];
        } catch (e) {
            console.warn(e);
        }

        putText.call(this, {text: text, x: x, y:getBaseline.call(this, y), scale: scale, angle: degs, align : this.textAlign, maxWidth: maxWidth});
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
    Context2d.prototype.strokeText = function (text, x, y, maxWidth) {
        if (isNaN(x) || isNaN(y) || typeof text !== 'string') {
            console.error('jsPDF.context2d.strokeText: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.strokeText');
        }
        if (isStrokeTransparent.call(this)) {
            return;
        }
        
        maxWidth = isNaN(maxWidth) ? undefined : maxWidth;
        x = wrapX.call(this, x);
        y = wrapY.call(this, y);

        var xpt = jsPDFAPI.matrix_map_point(this.ctx.transform, [x, y]);
        x = xpt[0];
        y = xpt[1];
        var rads = jsPDFAPI.matrix_rotation(this.ctx.transform);
        var degs = rads * 57.2958;

        var scale = 1;
        // We only use the X axis as scale hint 
        try {
            scale = jsPDFAPI.matrix_decompose(this.ctx.transform).scale[0];
        } catch (e) {
            console.warn(e);
        }

        putText.call(this, {text: text, x: x, y:getBaseline.call(this, y), scale: scale, renderingMode: 'stroke', angle: degs, align : this.textAlign, maxWidth: maxWidth});
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
    Context2d.prototype.measureText = function (text) {
        if (typeof text !== 'string') {
            console.error('jsPDF.context2d.measureText: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.measureText');
        }
        var pdf = this.pdf;
        var k = this.pdf.internal.scaleFactor;
        return {
            getWidth: function () {
                var fontSize = pdf.internal.getFontSize();
                var txtWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor;
                txtWidth *= Math.round(k * 96 / 72 * 10000) / 10000;
                return txtWidth;
            },

            get width() {
                return this.getWidth(text);
            }
        }
    };

    /**
    * 
    * @name _wrapX
    * @function  
    * @private
    * @ignore
    */
    var wrapX = function (x) {
        x += this.posX;
        if (this.pageWrapXEnabled) {
            return x % this.pageWrapX;
        } else {
            return x;
        }
    };

    /**
    * @name wrapY
    * @function  
    * @private
    * @ignore
    */
    var wrapY = function (y) {
        y += this.posY;
        if (this.pageWrapYEnabled) {
            this._gotoPage(setPageByYPosition.call(this, y));
            return (y - this.lastBreak) % this.pageWrapY;
        } else {
            return y;
        }
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
    Context2d.prototype.scale = function (scalewidth, scaleheight) {
        if (isNaN(scalewidth) || isNaN(scaleheight)) {
            console.error('jsPDF.context2d.scale: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.scale');
        }
        var matrix = [scalewidth, 0.0, 0.0, scaleheight, 0.0, 0.0];
        this.ctx.transform = jsPDFAPI.matrix_multiply(this.ctx.transform, matrix);
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
    Context2d.prototype.rotate = function (angle) {
        if (isNaN(angle)) {
            console.error('jsPDF.context2d.rotate: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.rotate');
        }
        var matrix = [Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0.0, 0.0];
        this.ctx.transform = jsPDFAPI.matrix_multiply(this.ctx.transform, matrix);
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
    Context2d.prototype.translate = function (x, y) {
        if (isNaN(x) || isNaN(y)) {
            console.error('jsPDF.context2d.translate: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.translate');
        }
        var matrix = [1.0, 0.0, 0.0, 1.0, x, y];
        this.ctx.transform = jsPDFAPI.matrix_multiply(this.ctx.transform, matrix);
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
    Context2d.prototype.transform = function (a, b, c, d, e, f) {
        if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f)) {
            console.error('jsPDF.context2d.transform: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.transform');
        }
        this.ctx.transform = jsPDFAPI.matrix_multiply( this.ctx.transform, [a, b, c, d, e, f] );
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
    Context2d.prototype.setTransform = function (a, b, c, d, e, f) {
        if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f)) {
            console.error('jsPDF.context2d.setTransform: Invalid arguments', arguments);
            throw new Error('Invalid arguments passed to jsPDF.context2d.setTransform');
        }
        this.ctx.transform = [a, b, c, d, e, f];
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
    var setPageByYPosition = function (y) {
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
                    var pagesSinceLastBreak = Math.floor(spaceBetweenLastBreak / this.pageWrapY);
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

    Context2d.prototype._gotoPage = function (pageOneBased) {
        // This is a stub to be overriden if needed
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
    *
    */
    Context2d.prototype.drawImage = function (img, sx, sy, swidth, sheight, x, y, width, height) {
        var imageProperties = this.pdf.getImageProperties(img);
        var factorX = 1;
        var factorY = 1;
        var isClip = false;
        
        var clipFactorX = 1;
        var clipFactorY = 1;
        
        var scaleFactorX = 1;
        var scaleFactorY = 1;
        
        if (typeof swidth !== 'undefined' && typeof width !== 'undefined') {
            isClip = true;
            clipFactorX = width/swidth;
            clipFactorY = height/sheight;
            factorX = imageProperties.width / swidth * width/swidth;
            factorY = imageProperties.height / sheight * height/sheight;
        }
        
        //is sx and sy are set and x and y not, set x and y with values of sx and sy
        if (typeof x === 'undefined') {
            x = sx;
            y = sy;
            sx = 0;
            sy = 0;
        }
        
        if (typeof swidth !== 'undefined' && typeof width === 'undefined') {
            width = swidth;
            height = sheight;
        }
        if (typeof swidth === 'undefined' && typeof width === 'undefined') {
            width = imageProperties.width;
            height = imageProperties.height;
        }
        
        x = wrapX.call(this, x);
        y = wrapY.call(this, y);
        
        var decomposedTransformationMatrix = jsPDFAPI.matrix_decompose(this.ctx.transform);
        
        var angle = decomposedTransformationMatrix.rotate[2] * 180 / Math.PI;
        scaleFactorX = decomposedTransformationMatrix.scale[0];
        scaleFactorX = decomposedTransformationMatrix.scale[3];
        
        var matrix = jsPDFAPI.matrix_multiply(jsPDFAPI.matrix_multiply(decomposedTransformationMatrix.translate, decomposedTransformationMatrix.skew), decomposedTransformationMatrix.scale);
        
        var mP = jsPDFAPI.matrix_map_point(matrix, [width, height]);
        var xRect = jsPDFAPI.matrix_map_rect(matrix, {x: x - (sx *clipFactorX) , y: y - (sy*clipFactorY) , w: swidth * factorX, h: sheight * factorY});
        
        this.save();
        if(isClip) {
            this.ctx.transform = matrix;
            this.rect(x, y, width, height);
            this.clip();
        }

        this.pdf.addImage(img, 'jpg', xRect.x, xRect.y, xRect.w, xRect.h, null, null, angle);
        this.restore();
    };


    var specialPathMethod = function specialPathMethod(rule, isClip) {
	  var fillStyle = this.fillStyle;
      var strokeStyle = this.strokeStyle;
      var font = this.font;
      var lineCap = this.lineCap;
      var lineWidth = this.lineWidth;
      var lineJoin = this.lineJoin;
	  
	  var oldPath = JSON.parse(JSON.stringify(this.path));

      var xPath = JSON.parse(JSON.stringify(this.path));
	  var clipPath = JSON.parse(JSON.stringify(this.ctx.clip_path)); 

      var getPageOfPath = function getPageOfPath(path, pageWrapX, pageWrapY) {
        var result;
		switch (path.type) {
			case 'lt':
			case 'mt':
				result = Math.floor(path.y / pageWrapY) + 1;
				break;
			case 'arc':
				result = Math.floor((path.y + path.radius) / pageWrapY) + 1
		}
        return result;
      };

      var pathPositionRedo = function pathPositionRedo(paths, x, y) {
        for (var i = 0; i < paths.length; i++) {
          if (typeof paths[i].x !== "undefined") {
            paths[i].x += x;
            paths[i].y += y;
          }
        }

        return paths;
      };

      var pages = [];

      for (var i = 0; i < xPath.length; i++) {
        if (typeof xPath[i].x !== "undefined") {
          var page = getPageOfPath(xPath[i], this.pdf.internal.pageSize.width, this.pdf.internal.pageSize.height);

          if (pages.indexOf(page) === -1) {
            pages.push(page);
          }
        }
      }

      for (var i = 0; i < pages.length; i++) {
        while (this.pdf.internal.getNumberOfPages() < pages[i]) {
          this.pdf.addPage();
        }
      }
	  
	  pages.sort();
	  var min = pages[0];
	  var max = pages[pages.length -1];
	  for (var i = 0; i < (max-min+1); i++) {
        this.pdf.setPage(i+1);

		if (i !== 0) {
			if (this.fillStyle !== fillStyle) {
				this.fillStyle = fillStyle;
			}
			if (this.strokeStyle !== strokeStyle) {
				this.strokeStyle = strokeStyle;
			}
			if (this.font !== font) {
				this.font = font;
			}
			if (this.lineCap !== lineCap) {
				this.lineCap = lineCap;
			}
			if (this.lineWidth !== lineWidth) {
				this.lineWidth = lineWidth;
			}
			if (this.lineJoin !== lineJoin) {
				this.lineJoin = lineJoin;
			}
			if (this.ctx.clip_path.length !== 0) {
			var tmpPaths = this.path;
			this.path = pathPositionRedo(clipPath, 0, this.pdf.internal.pageSize.height * -1);
			drawPaths.call(this, rule, true);
			this.path = tmpPaths;
			}
			this.path = pathPositionRedo(xPath, 0, this.pdf.internal.pageSize.height * -1);
		}
        drawPaths.call(this, rule, isClip);
	  }
	  this.path = oldPath;
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
    var drawPaths = function (rule, isClip) {
        if ((rule === 'stroke') && !isClip && isStrokeTransparent.call(this)) {
          return;
        }

        if ((rule !== 'stroke') && !isClip && isFillTransparent.call(this)) {
          return;
        }

        var moves = [];
        var alpha = this.ctx.globalAlpha;

        if (this.ctx.fillOpacity < 1) {
          alpha = this.ctx.fillOpacity;
        }

        var xPath = this.path;
        
        for (var i = 0; i < xPath.length; i++) {
          var pt = xPath[i];

          switch (pt.type) {
            case 'begin':
              moves.push({
                begin: true
              });
              break;
              
            case 'close':
              moves.push({
                close: true
              });
              break;

            case 'mt':
              moves.push({
                start: pt,
                deltas: [],
                abs: []
              });
              break;

            case 'lt':
              var iii = moves.length;
              if (!isNaN(xPath[i - 1].x)) {
                var delta = [pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
              
                  if (iii > 0) {
                      for (iii; iii >= 0; iii--) {
                          if (moves[iii-1].close !== true && moves[iii-1].begin !== true) {
                          moves[iii - 1].deltas.push(delta);
                          moves[iii - 1].abs.push(pt);
                          break;
                          }
                      }
                  }
              }
              break;

            case 'bct':
              var delta = [pt.x1 - xPath[i - 1].x, pt.y1 - xPath[i - 1].y, pt.x2 - xPath[i - 1].x, pt.y2 - xPath[i - 1].y, pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
              moves[moves.length - 1].deltas.push(delta);
              break;

            case 'qct':
              var x1 = xPath[i - 1].x + 2.0 / 3.0 * (pt.x1 - xPath[i - 1].x);
              var y1 = xPath[i - 1].y + 2.0 / 3.0 * (pt.y1 - xPath[i - 1].y);
              var x2 = pt.x + 2.0 / 3.0 * (pt.x1 - pt.x);
              var y2 = pt.y + 2.0 / 3.0 * (pt.y1 - pt.y);
              var x3 = pt.x;
              var y3 = pt.y;
              var delta = [x1 - xPath[i - 1].x, y1 - xPath[i - 1].y, x2 - xPath[i - 1].x, y2 - xPath[i - 1].y, x3 - xPath[i - 1].x, y3 - xPath[i - 1].y];
              moves[moves.length - 1].deltas.push(delta);
              break;

            case 'arc':
              moves.push({
                deltas: [],
                abs: []
              });

              moves[moves.length - 1].arc = true;

              if (Array.isArray(moves[moves.length - 1].abs)) {
                moves[moves.length - 1].abs.push(pt);
              }
              break;
          }
        }
        var style;
        if (!isClip) {
            if ((rule === 'stroke')) {
                style = 'stroke';
            } else {
                style = 'fill';
            }
        } else {
            style = null;
        }

        for (var i = 0; i < moves.length; i++) {

          if (moves[i].arc) {
            if (moves[i].start) {
              doMove.call(this, moves[i].start.x, moves[i].start.y);
            }

            var arcs = moves[i].abs;

            for (var ii = 0; ii < arcs.length; ii++) {
                var arc = arcs[ii];

                if (typeof arc.startAngle !== 'undefined') {
                  var start = arc.startAngle * 360 / (2 * Math.PI);
                  var end = arc.endAngle * 360 / (2 * Math.PI);
                  var x = arc.x;
                  var y = arc.y;

                  drawArc.call(this, x, y, arc.radius, start, end, arc.counterclockwise, style, isClip);
                } else {
                  drawLine.call(this, arc.x, arc.y);
                }
            }
        
          }
          
          if (!moves[i].arc) {
            if (moves[i].close !== true && moves[i].begin !== true) {
                var x = moves[i].start.x;
                var y = moves[i].start.y;
                drawLines.call(this, moves[i].deltas, x, y, null, null);
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

    var getBaseline = function (y) {
        var height = parseInt(this.pdf.internal.getFontSize() / this.pdf.internal.scaleFactor);
        // TODO Get descent from font descriptor
        var descent = height * 0.25;
        switch (this.ctx.textBaseline) {
            case 'bottom':
                return y - descent;
            case 'top':
                return y + height;
            case 'hanging':
                return y + height - descent;
            case 'middle':
                return y + height / 2 - descent;
            case 'ideographic':
                // TODO not implemented
                return y;
            case 'alphabetic':
            default:
                return y;
        }
    };

    Context2d.prototype.createLinearGradient = function createLinearGradient() {
        var canvasGradient = function canvasGradient() {};

        canvasGradient.colorStops = [];
        canvasGradient.addColorStop = function (offset, color) {
            this.colorStops.push([offset, color]);
        };

        canvasGradient.getColor = function () {
            if (this.colorStops.length === 0) {
                return '#000000';
            }

            return this.colorStops[0][1];
        };

        canvasGradient.isCanvasGradient = true;
        return canvasGradient;
    };
    
    Context2d.prototype.createPattern = function createPattern() {
        return this.createLinearGradient();
    };
    
    Context2d.prototype.createRadialGradient = function createRadialGradient() {
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
    var drawArc = function (x, y, r, a1, a2, counterclockwise, style, isClip) {
        // http://hansmuller-flex.blogspot.com/2011/10/more-about-approximating-circular-arcs.html
        var includeMove = true;

        var k = this.pdf.internal.scaleFactor;
        var pageHeight = this.pdf.internal.pageSize.getHeight();

        var a1r = a1 * (Math.PI / 180);
        var a2r = a2 * (Math.PI / 180);
        var curves = createArc.call(this, r, a1r, a2r, counterclockwise);
        var pathData = null;

        for (var i = 0; i < curves.length; i++) {
            var curve = curves[i];
            if (includeMove && i === 0) {
                doMove.call(this, curve.x1 + x, curve.y1 + y);
            };
            drawCurve.call(this, x, y, curve.x2, curve.y2, curve.x3, curve.y3, curve.x4, curve.y4);
        }
        if (!isClip) {
            putStyle.call(this, style);
        } else {
            doClip.call(this);
        }
    };
    
    var putStyle = function (style) {
        switch (style) {
            case 'stroke':
                this.pdf.internal.out('S');
                break;
            case 'fill':
                this.pdf.internal.out('f');
                break;            
        }
    };

    var doClip = function () {
        this.pdf.clip();
    };


    var doMove = function (x, y) {
        var k = this.pdf.internal.scaleFactor;
        var pageHeight = this.pdf.internal.pageSize.getHeight();

        this.pdf.internal.out([
            f2(x * k), f2((pageHeight - y) * k), 'm'
        ].join(' '));
    };

	var putText = function (options) {
		
        if (options.scale < 0.01) {
			this.pdf.text(options.text, options.x, options.y, {angle: options.angle, align : options.align, renderingMode: options.renderingMode, maxWidth: options.maxWidth});
        } else {
            var oldSize = this.pdf.internal.getFontSize();
            this.pdf.setFontSize(oldSize * options.scale);
			this.pdf.text(options.text, options.x, options.y, {angle: options.angle, align : options.align, renderingMode: options.renderingMode, maxWidth: options.maxWidth});
            this.pdf.setFontSize(oldSize);
        }
	}
    var drawLine = function (x, y, prevX, prevY) {
        prevX = prevX || 0;
        prevY = prevY || 0;
        var k = this.pdf.internal.scaleFactor;
        var pageHeight = this.pdf.internal.pageSize.getHeight();

        this.pdf.internal.out([
            f2(x * k + prevX * k), f2((pageHeight - y) * k + prevX * k), 'l'
        ].join(' '));
    };

    var drawLines = function (lines, x, y) {
        return this.pdf.lines(lines, x, y, null, null);
    };

    var drawCurve = function(x1, y1, x2, y2, x3, y3, x4, y4) {
        var k = this.pdf.internal.scaleFactor;
        var pageHeight = this.pdf.internal.pageSize.getHeight();
        this.pdf.internal.out([
                f2((x2 + x1) * k), f2((pageHeight - (y2 + y1)) * k), f2((x3 + x1) * k), f2((pageHeight - (y3 + y1)) * k), f2((x4 + x1) * k), f2((pageHeight - (y4 + y1)) * k), 'c'
        ].join(' '));
    }

    /**
     * Return a array of objects that represent bezier curves which approximate the circular arc centered at the origin, from startAngle to endAngle (radians) with the specified radius.
     *
     * Each bezier curve is an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
     * @function createArc
     */
    var createArc = function(radius, startAngle, endAngle, anticlockwise) {
        var EPSILON = 0.00001; // Roughly 1/1000th of a degree, see below    

        // normalize startAngle, endAngle to [-2PI, 2PI]
        var twoPI = Math.PI * 2;
        var startAngleN = startAngle;
        if (startAngleN < twoPI || startAngleN > twoPI) {
            startAngleN = startAngleN % twoPI;
        }
        var endAngleN = endAngle;
        if (endAngleN < twoPI || endAngleN > twoPI) {
            endAngleN = endAngleN % twoPI;
        }

        // Compute the sequence of arc curves, up to PI/2 at a time.  
        // Total arc angle is less than 2PI.
        var curves = [];
        var piOverTwo = Math.PI / 2.0;
        //var sgn = (startAngle < endAngle) ? +1 : -1; // clockwise or counterclockwise
        var sgn = anticlockwise ? -1 : +1;

        var a1 = startAngle;
        for (var totalAngle = Math.min(twoPI, Math.abs(endAngleN - startAngleN)); totalAngle > EPSILON;) {
            var a2 = a1 + sgn * Math.min(totalAngle, piOverTwo);
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
    var createSmallArc = function (r, a1, a2) {
        // Compute all four points for an arc that subtends the same total angle
        // but is centered on the X-axis

        var a = (a2 - a1) / 2.0;

        var x4 = r * Math.cos(a);
        var y4 = r * Math.sin(a);
        var x1 = x4;
        var y1 = -y4;

        var q1 = x1 * x1 + y1 * y1;
        var q2 = q1 + x1 * x4 + y1 * y4;
        var k2 = 4 / 3 * (Math.sqrt(2 * q1 * q2) - q2) / (x1 * y4 - y1 * x4);

        var x2 = x1 - k2 * y1;
        var y2 = y1 + k2 * x1;
        var x3 = x2;
        var y3 = -y2;

        // Find the arc points' actual locations by computing x1,y1 and x4,y4
        // and rotating the control points by a + a1

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
	
	/**
	* Multiply the first matrix by the second
	* 
	* @name matrix_multiply
	* @function 
	* @param m1
	* @param m2
	* @returns {Array}
	* @private
	* @ignore
	*/
	var matrix_multiply = jsPDFAPI.matrix_multiply = function (m2, m1) {
		var sx = m1[0];
		var shy = m1[1];
		var shx = m1[2];
		var sy = m1[3];
		var tx = m1[4];
		var ty = m1[5];

		var t0 = sx * m2[0] + shy * m2[2];
		var t2 = shx * m2[0] + sy * m2[2];
		var t4 = tx * m2[0] + ty * m2[2] + m2[4];
		shy = sx * m2[1] + shy * m2[3];
		sy = shx * m2[1] + sy * m2[3];
		ty = tx * m2[1] + ty * m2[3] + m2[5];
		sx = t0;
		shx = t2;
		tx = t4;

		return [sx, shy, shx, sy, tx, ty];
	};
	/**
	* @name matrix_rotation
	* @function 
	* @private
	* @ignore
	*/
	var matrix_rotation = jsPDFAPI.matrix_rotation = function (m) {
		return Math.atan2(m[2], m[0]);
	};

	/**
	* @name matrix_decompose
	* @function 
	* @private
	* @ignore
	*/
	var matrix_decompose = jsPDFAPI.matrix_decompose = function (matrix) {

		var a = matrix[0];
		var b = matrix[1];
		var c = matrix[2];
		var d = matrix[3];

		var scaleX = Math.sqrt(a * a + b * b);
		a /= scaleX;
		b /= scaleX;

		var shear = a * c + b * d;
		c -= a * shear;
		d -= b * shear;

		var scaleY = Math.sqrt(c * c + d * d);
		c /= scaleY;
		d /= scaleY;
		shear /= scaleY;

		if (a * d < b * c) {
			a = -a;
			b = -b;
			shear = -shear;
			scaleX = -scaleX;
		}

		return {
			scale: [scaleX, 0, 0, scaleY, 0, 0],
			translate: [1, 0, 0, 1, matrix[4], matrix[5]],
			rotate: [a, b, -b, a, 0, 0],
			skew: [1, 0, shear, 1, 0, 0]
		};
	};

	/**
	* @name matrix_map_point
	* @function 
	* @private
	* @ignore
	*/
	var matrix_map_point = jsPDFAPI.matrix_map_point = function (m1, pt) {
		var sx = m1[0];
		var shy = m1[1];
		var shx = m1[2];
		var sy = m1[3];
		var tx = m1[4];
		var ty = m1[5];

		var px = pt[0];
		var py = pt[1];

		var x = px * sx + py * shx + tx;
		var y = px * shy + py * sy + ty;
		return [x, y];
	};

	/**
	* @name matrix_map_point_obj
	* @function 
	* @private
	* @ignore
	*/
	var matrix_map_point_obj = jsPDFAPI.matrix_map_point_obj = function (m1, pt) {
		var xpt = this.matrix_map_point(m1, [pt.x, pt.y]);
		return {x: xpt[0], y: xpt[1]};
	};

	/**
	* @name matrix_map_rect
	* @function 
	* @private
	* @ignore
	*/
	var matrix_map_rect = jsPDFAPI.matrix_map_rect = function (m1, rect) {
		var p1 = this.matrix_map_point(m1, [rect.x, rect.y]);
		var p2 = this.matrix_map_point(m1, [rect.x + rect.w, rect.y + rect.h]);
		return {x: p1[0], y: p1[1], w: p2[0] - p1[0], h: p2[1] - p1[1]};
	};

	/**
	* @name matrix_is_identity
	* @function 
	* @private
	* @ignore
	*/
	var matrix_is_identity = jsPDFAPI.matrix_is_identity = function (m1) {
		if (m1[0] != 1) {
			return false;
		}
		if (m1[1] != 0) {
			return false;
		}
		if (m1[2] != 0) {
			return false;
		}
		if (m1[3] != 1) {
			return false;
		}
		if (m1[4] != 0) {
			return false;
		}
		if (m1[5] != 0) {
			return false;
		}
		return true;
	};
})(jsPDF.API, (typeof self !== 'undefined' && self || typeof window !== 'undefined' && window || typeof global !== 'undefined' && global ||  Function('return typeof this === "object" && this.content')() || Function('return this')()));