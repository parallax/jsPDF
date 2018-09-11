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

    jsPDFAPI.events.push([
        'initialized', function () {
            this.context2d.pdf = this;
            this.context2d.internal.pdf = this;
            this.context2d.ctx = new context();
            this.context2d.ctxStack = [];
            this.context2d.path = [];
        }
    ]);
    jsPDFAPI.context2d = {
		/**
		* @name pageWrapXEnabled
		* @type {boolean}
		* @default false
		*/
        pageWrapXEnabled: false,
		/**
		* @name pageWrapYEnabled
		* @type {boolean}
		* @default false
		*/
        pageWrapYEnabled: false,
		/**
		* @name pageWrapX
		* @type {number}
		* @default 9999999
		*/
        pageWrapX: 9999999,
		/**
		* @name pageWrapY
		* @type {number}
		* @default 9999999
		*/
        pageWrapY: 9999999,
		/**
		* @name ctx
		* @type {Object}
		*/
        ctx: new context(),
		/**
		* @name f2
		* @type {function}
		* @ignore
		*/
        f2: function (number) {
            return number.toFixed(2);
        },
		
		
		/**
		* Fills the current drawing (path)
		* 
		* @name fill
		* @function
		* @description The fill() method fills the current drawing (path). The default color is black.
		*/
        fill: function () { //evenodd or nonzero (default)
			var rule = 'fill';
			this._drawPaths(rule, false);
        },

		/**
		* Actually draws the path you have defined
		*
		* @name stroke
		* @function
		* @description The stroke() method actually draws the path you have defined with all those moveTo() and lineTo() methods. The default color is black.
		*/
        stroke: function () {
			var rule = 'stroke';
			this._drawPaths(rule, false);
        },
		
		/**
		* Begins a path, or resets the current 
		*
		* @name beginPath
		* @function 
		* @description The beginPath() method begins a path, or resets the current path.
		*/
        beginPath: function () {
			this._resetPath();
			this._beginPath();
        },
		
		/**
		* Moves the path to the specified point in the canvas, without creating a line
		* 
		* @name moveTo
		* @function
		* @param x {Number} The x-coordinate of where to move the path to	
		* @param y {Number} The y-coordinate of where to move the path to
		*/
		moveTo: function (x, y) {
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
            x = xpt[0];
            y = xpt[1];

            var obj = {
                type: 'mt',
                x: x,
                y: y
            };
            this.path.push(obj);
        },
		

		/**
		* Creates a path from the current point back to the starting point
		* 
		* @name closePath
		* @function
		* @description The closePath() method creates a path from the current point back to the starting point.
		*/
        closePath: function () {
			this._closePath();
			var obj = {
                type: 'close'
            };
            this.path.push(obj);
        },
		/**
		* Adds a new point and creates a line to that point from the last specified point in the canvas
		* 
		* @name lineTo
		* @function
		* @param x The x-coordinate of where to create the line to
		* @param y	The y-coordinate of where to create the line to
		* @description The lineTo() method adds a new point and creates a line TO that point FROM the last specified point in the canvas (this method does not draw the line).
		*/
		lineTo: function (x, y) {
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
            x = xpt[0];
            y = xpt[1];

            var obj = {
                type: 'lt',
                x: x,
                y: y
            };
            this.path.push(obj);
        },
		
		/**
		* Clips a region of any shape and size from the original canvas
		* 
		* @name clip
		* @function
		* @description The clip() method clips a region of any shape and size from the original canvas.
		*/
		clip: function () {
			this._drawPaths(null, true);
        },
		
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
        quadraticCurveTo: function (cpx, cpy, x, y) {
            var x1 = this._wrapX(cpx);
            var y1 = this._wrapY(cpy);
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xpt;
            xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
            x = xpt[0];
            y = xpt[1];
            xpt = this._matrix_map_point(this.ctx._transform, [x1, y1]);
            x1 = xpt[0];
            y1 = xpt[1];

            var obj = {
                type: 'qct',
                x1: x1,
                y1: y1,
                x: x,
                y: y
            };
            this.path.push(obj);
        },

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
        bezierCurveTo: function (cp1x, cp1y, cp2x, cp2y, x, y) {
            var x1 = this._wrapX(cp1x);
            var y1 = this._wrapY(cp1y);
            var x2 = this._wrapX(cp2x);
            var y2 = this._wrapY(cp2y);
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xpt;
            xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
            x = xpt[0];
            y = xpt[1];
            xpt = this._matrix_map_point(this.ctx._transform, [x1, y1]);
            x1 = xpt[0];
            y1 = xpt[1];
            xpt = this._matrix_map_point(this.ctx._transform, [x2, y2]);
            x2 = xpt[0];
            y2 = xpt[1];


            var obj = {
                type: 'bct',
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                x: x,
                y: y
            };
            this.path.push(obj);
        },

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
        arc: function (x, y, radius, startAngle, endAngle, counterclockwise) {
            x = this._wrapX(x);
            y = this._wrapY(y);
			
			counterclockwise = counterclockwise || false;

            if (!this._matrix_is_identity(this.ctx._transform)) {
                var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
                x = xpt[0];
                y = xpt[1];

                var x_radPt0 = this._matrix_map_point(this.ctx._transform, [0, 0]);
                var x_radPt = this._matrix_map_point(this.ctx._transform, [0, radius]);
                radius = Math.sqrt(Math.pow(x_radPt[0] - x_radPt0[0], 2) + Math.pow(x_radPt[1] - x_radPt0[1], 2));
            }

            var obj = {
                type: 'arc',
                x: x,
                y: y,
                radius: radius,
                startAngle: startAngle,
                endAngle: endAngle,
                counterclockwise: counterclockwise
            };
            this.path.push(obj);
        },
		
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
		arcTo: function (x1, y1, x2, y2, radius) {
			//TODO needs to be implemented
		},
		
		//Rectangles
		
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
		rect: function (x, y, w, h) {
			this.moveTo(x, y);
			this.lineTo(x + w, y);
			this.lineTo(x + w, y + h);
			this.lineTo(x, y + h);
			this.lineTo(x, y);
			this.lineTo(x + w, y);
			this.lineTo(x, y);
		},
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
		fillRect: function (x, y, w, h) {
            if (this._isFillTransparent()) {
                return;
            }
		    x = this._wrapX(x);
            y = this._wrapY(y);
			
            var xpt1 = this._matrix_map_point(this.ctx._transform, [x, y]);
			var xpt2 = this._matrix_map_point(this.ctx._transform, [x+w,y]);
			var xpt3 = this._matrix_map_point(this.ctx._transform, [x+w, y+h]);
			var xpt4 = this._matrix_map_point(this.ctx._transform, [x, y+h]);
			
			this.pdf.internal.out('q');
			this.pdf.setLineCap('butt');
			this.pdf.setLineJoin("miter");
			var lines = [];
			lines.push([xpt2[0] - xpt1[0],xpt2[1] - xpt1[1]]);
			lines.push([xpt3[0] - xpt2[0],xpt3[1] - xpt2[1]]);
			lines.push([xpt4[0] - xpt3[0],xpt4[1] - xpt3[1]]);
			lines.push([xpt1[0] - xpt4[0],xpt1[1] - xpt4[1]]);
			lines.push([xpt2[0] - xpt1[0],xpt2[1] - xpt1[1]]);
			lines.push([xpt1[0] - xpt2[0],xpt1[1] - xpt2[1]]);
            this.pdf.lines(lines,xpt1[0],xpt1[1],null, 'F');
			
			this.pdf.internal.out('Q');
        },
		
		
		/**
		* 	Draws a rectangle (no fill)
		*
		* @name strokeRect
		* @function
		* @param x {Number} The x-coordinate of the upper-left corner of the rectangle
		* @param y {Number} The y-coordinate of the upper-left corner of the rectangle
		* @param w {Number} The width of the rectangle, in pixels	
		* @param h {Number} The height of the rectangle, in pixels
		* @description The strokeRect() method draws a rectangle (no fill). The default color of the stroke is black.
		*/
		strokeRect: function strokeRect(x, y, w, h) {
			if (this._isStrokeTransparent()) {
				return;
			}
		    x = this._wrapX(x);
            y = this._wrapY(y);
			
            var xpt1 = this._matrix_map_point(this.ctx._transform, [x, y]);
			var xpt2 = this._matrix_map_point(this.ctx._transform, [x+w, y]);
			var xpt3 = this._matrix_map_point(this.ctx._transform, [x+w, y+h]);
			var xpt4 = this._matrix_map_point(this.ctx._transform, [x, y+h]);
			
			var lines = [];
			lines.push([xpt2[0] - xpt1[0],xpt2[1] - xpt1[1]]);
			lines.push([xpt3[0] - xpt2[0],xpt3[1] - xpt2[1]]);
			lines.push([xpt4[0] - xpt3[0],xpt4[1] - xpt3[1]]);
			lines.push([xpt1[0] - xpt4[0],xpt1[1] - xpt4[1]]);
			lines.push([xpt2[0] - xpt1[0],xpt2[1] - xpt1[1]]);
			lines.push([xpt1[0] - xpt2[0],xpt1[1] - xpt2[1]]);
			this.pdf.lines(lines, xpt1[0], xpt1[1], null, 'S');
		},

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
        clearRect: function (x, y, w, h) {
            if (this.ctx.ignoreClearRect) {
                return;
            }

            this.save();
            this._setFillStyle('#ffffff');
            this.fillRect(x, y, w, h);
            this.restore();
        },
		
		//Other
		
		/**
		* Saves the state of the current context
		* 
		* @name save
		* @function
		*/
        save: function () {			
			this.pdf.internal.out('q');
            this.ctx._fontSize = this.pdf.internal.getFontSize();
            var ctx = new context();
            ctx.copy(this.ctx);
            this.ctxStack.push(this.ctx);
            this.ctx = ctx;
        },

		/**
		* Returns previously saved path state and attributes
		* 
		* @name restore
		* @function
		*/
        restore: function () {
			this.pdf.internal.out('Q');
			if (this.ctxStack.length !== 0) {
				this.ctx = this.ctxStack.pop();
				this._setFillStyle(this.ctx.fillStyle);
				this._setStrokeStyle(this.ctx.strokeStyle);
				this._setFont(this.ctx.font);
				this.pdf.setFontSize(this.ctx._fontSize);
				this._setLineCap(this.ctx.lineCap);
				this._setLineWidth(this.ctx.lineWidth);
				this._setLineJoin(this.ctx.lineJoin);
			}
        },

		// some stubs
		
		
		/** 
		* @name createEvent
		* @function
		*/
		createEvent: function () {
			console.log("createEvent not implemented (yet)");
		},
		
		/** 
		* @name toDataURL
		* @function
		*/
		toDataURL: function () {
			console.log("toDataUrl not implemented (yet)");
		},
		
		
		//helper functions
		
		_beginPath: function () {
            this.path.push({
                type: 'begin'
            });
		},
		
		_closePath: function () {
			var pathBegin = {x: 0, y: 0};
			var i = 0;
			var len = this.path.length; 
			for (i = (this.path.length - 1); i !== -1; i--) {
				if (this.path[i].type === 'begin') {
					if (typeof this.path[i+1] === "object" && typeof this.path[i+1].x === "number") {
						pathBegin = {x: this.path[i+1].x, y: this.path[i+1].y};
						var obj = {
							type: 'lt',
							x: pathBegin.x,
							y: pathBegin.y
						};
						this.path.push(obj);
						break;
					}
				}
			}
			//TODO Repeat second move to get lineJoins correct, maybe only when lineJoin active in _drawPaths
			if (typeof this.path[i+2] === "object" && typeof this.path[i+2].x === "number") {
				this.path.push(JSON.parse(JSON.stringify(this.path[i+2])));
			}
		},
		_resetPath: function () {
            this.path = [];
		},
		
		/**
		* Get the decimal values of r, g, b and a
		*
		* @name _getRGBA
		* @function  
		* @private
		* @ignore
		*/
        _getRGBA: function (style) {
            var r, g, b, a;
			
			if (style.isCanvasGradient === true) {
			  style = style.getColor();
			}
			
            var rgbColor = new RGBColor(style);

            if (!style) {
                return {r: 0, g: 0, b: 0, a: 0, style: style};
            }

            if (this.internal.rxTransparent.test(style)) {
                r = 0;
                g = 0;
                b = 0;
                a = 0;
            }
            else {
                var m = this.internal.rxRgb.exec(style);
                if (m != null) {
                    r = parseInt(m[1]);
                    g = parseInt(m[2]);
                    b = parseInt(m[3]);
                    a = 1;
                } else {
                    m = this.internal.rxRgba.exec(style);
                    if (m != null) {
                        r = parseInt(m[1]);
                        g = parseInt(m[2]);
                        b = parseInt(m[3]);
                        a = parseFloat(m[4]);
                    } else {
                        a = 1;
                        if (style.charAt(0) != '#') {
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
        },
		
		/**
		* @name _isFilllTransparent
		* @function 
		* @private
		* @ignore
		* @returns {Boolean}
		*/
        _isFillTransparent: function () {
            return this.ctx._isFillTransparent || this.globalAlpha == 0;
        },

		/**
		* @name _isStrokeTransparent
		* @function 
		* @private
		* @ignore
		* @returns {Boolean}
		*/
        _isStrokeTransparent: function () {
            return this.ctx._isStrokeTransparent || this.globalAlpha == 0;
        },


		/**
		* Sets the color, gradient, or pattern used to fill the drawing
		* 
		* @name _setFillStyle
		* @function
		* @private
		* @ignore
		*/
        _setFillStyle: function (style) {
			var rgba; 
			
			rgba = this._getRGBA(style);

            this.ctx.fillStyle = style;
            this.ctx._isFillTransparent = (rgba.a === 0);
            this.ctx._fillOpacity = rgba.a;

            this.pdf.setFillColor(rgba.r, rgba.g, rgba.b, {
                a: rgba.a
            });
            this.pdf.setTextColor(rgba.r, rgba.g, rgba.b, {
                a: rgba.a
            });
        },

		/**
		* Sets the color, gradient, or pattern used for strokes
		* 
		* @name _setStrokeStyle
		* @function  
		* @private
		* @ignore
		*/
        _setStrokeStyle: function (style) {
            var rgba = this._getRGBA(style);

            this.ctx.strokeStyle = rgba.style;
            this.ctx._isStrokeTransparent = (rgba.a === 0);
            this.ctx._strokeOpacity = rgba.a;

            //TODO jsPDF to handle rgba
            if (rgba.a === 0) {
                this.pdf.setDrawColor(255, 255, 255);
            }
            else if (rgba.a === 1) {
                this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
            } else {
                //this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b, {a: rgba.a});
                this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
            }
        },
		
		/**
		* Sets font properties for text content
		* 
		* @name _setFont
		* @function 
		* @param {String} The font property uses the same syntax as the CSS font property.
		* @private
		* @ignore
		*/
		_setFont: function (font) {
			this.ctx.font = font;
			var rx, m;
			
			//source: https://stackoverflow.com/a/10136041
			rx = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-,\"\'\sa-z]+?)\s*$/i;
			m = rx.exec(font);
			if (m != null) {
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
				// fontSize = fontSize * 1.25;
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
			var parts = fontFamily.toLowerCase().replace(/"|'/g,"").split(/\s*,\s*/);
			
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
		},
		
		/**
		* @name _setTextBaseline
		* @function  
		* @private
		* @ignore
		*/
        _setTextBaseline: function (baseline) {
            this.ctx.textBaseline = baseline;
        },
		
		/**
		* @name _getTextBaseline
		* @function  
		* @private
		* @ignore
		* @returns {Number} 
		*/
        _getTextBaseline: function () {
            return this.ctx.textBaseline;
        },

		/**
		* @name _setTextAlign
		* @function  
		* @private
		* @ignore
		*/
		_setTextAlign: function _setTextAlign(canvasAlign) {
			switch (canvasAlign) {
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
		},
		/**
		* @name _getTextAlign
		* @function  
		* @private
		* @ignore
		* @returns {String}
		*/
        _getTextAlign: function () {
            return this.ctx.textAlign;
        },
		
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
        fillText: function (text, x, y, maxWidth) {
            if (this._isFillTransparent()) {
                return;
            }
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
            x = xpt[0];
            y = xpt[1];
            var rads = this._matrix_rotation(this.ctx._transform);
            var degs = rads * 57.2958;

            // We only use X axis as scale hint 
            var scale = 1;
            try {
                scale = this._matrix_decompose(this._getTransform()).scale[0];
            } catch (e) {
                console.warn(e);
            }

            // In some cases the transform was very small (5.715760606202283e-17).  Most likely a canvg rounding error.
            if (scale < 0.01) {
                this.pdf.text(text, x, this._getBaseline(y), {angle: degs, align : this.textAlign});
            }
            else {
                var oldSize = this.pdf.internal.getFontSize();
                this.pdf.setFontSize(oldSize * scale);
                this.pdf.text(text, x, this._getBaseline(y), {angle: degs, align : this.textAlign});
                this.pdf.setFontSize(oldSize);
            }
        },

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
        strokeText: function (text, x, y, maxWidth) {
            if (this._isStrokeTransparent()) {
                return;
            }
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
            x = xpt[0];
            y = xpt[1];
            var rads = this._matrix_rotation(this.ctx._transform);
            var degs = rads * 57.2958;

            var scale = 1;
            // We only use the X axis as scale hint 
            try {
                scale = this._matrix_decompose(this._getTransform()).scale[0];
            } catch (e) {
                console.warn(e);
            }
			
            if (scale < 0.01) {
                this.pdf.text(text, x, this._getBaseline(y), {angle: degs, align : this.textAlign, renderingMode: 'stroke'});
            }
            else {
                var oldSize = this.pdf.internal.getFontSize();
                this.pdf.setFontSize(oldSize * scale);
                this.pdf.text(text, x, this._getBaseline(y), {angle: degs, align : this.textAlign, renderingMode: 'stroke'});
                this.pdf.setFontSize(oldSize);
            }
        },
		
		/**
		* Returns an object that contains the width of the specified text
		*
		* @name measureText
		* @function 
		* @param text {String} The text to be measured
		* @description The measureText() method returns an object that contains the width of the specified text, in pixels.
		* @returns {Number}
		*/
        measureText: function (text) {
            var pdf = this.pdf;
            return {
                getWidth: function () {
                    var fontSize = pdf.internal.getFontSize();
                    var txtWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor;
                    // Convert points to pixels
					//TODO Use scaleFactor?
                    txtWidth *= 1.3333;
                    return txtWidth;
                },

                get width() {
                    return this.getWidth(text);
                }
            }
        },


		//Line Styles
		
		/**
		* 
		* @name _setLineWidth
		* @function  
		* @private
		* @ignore
		*/
        _setLineWidth: function (width) {
            this.ctx.lineWidth = width;
            this.pdf.setLineWidth(width);
        },

		/**
		* @name _setLineCap
		* @function  
		* @private
		* @ignore
		*/
        _setLineCap: function (style) {
            this.ctx.lineCap = style;
            this.pdf.setLineCap(style);
        },

		/**
		* 
		* @name _setLineJoin
		* @function  
		* @private
		* @ignore
		*/
        _setLineJoin: function (style) {
            this.ctx.lineJoin = style;
            this.pdf.setLineJoin(style);
        },
		
		/**
		* 
		* @name _getLineJoin
		* @function  
		* @private
		* @ignore
		*/
        _getLineJoin: function () {
            return this.ctx.lineJoin;
        },

		/**
		* 
		* @name _wrapX
		* @function  
		* @private
		* @ignore
		*/
        _wrapX: function (x) {
            if (this.pageWrapXEnabled) {
                return x % this.pageWrapX;
            } else {
                return x;
            }
        },

		/**
		* @name _wrapY
		* @function  
		* @private
		* @ignore
		*/
        _wrapY: function (y) {
            if (this.pageWrapYEnabled) {
                this._gotoPage(this._page(y));
                return (y - this.lastBreak) % this.pageWrapY;
            } else {
                return y;
            }
        },
		
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
        scale: function (scalewidth, scaleheight) {
            var matrix = [scalewidth, 0.0, 0.0, scaleheight, 0.0, 0.0];
            this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
        },
		
		/**
		* Rotates the current drawing
		* 
		* @name rotate
		* @function
		* @param angle {Number} The rotation angle, in radians.
		* @description To calculate from degrees to radians: degrees*Math.PI/180. <br />
		* Example: to rotate 5 degrees, specify the following: 5*Math.PI/180
		*/
		rotate: function (angle) {
            var matrix = [Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0.0, 0.0];
            this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
        },

		/**
		* Remaps the (0,0) position on the canvas
		* 
		* @name translate
		* @function
		* @param x {Number} The value to add to horizontal (x) coordinates
		* @param y {Number} The value to add to vertical (y) coordinates
		* @description The translate() method remaps the (0,0) position on the canvas.
		*/
        translate: function (x, y) {
            var matrix = [1.0, 0.0, 0.0, 1.0, x, y];
            this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
        },

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
		* @description Each object on the canvas has a current transformation matrix.<br /><br />The transform() method replaces the current transformation matrix. It multiplies the current transformation matrix with the matrix described by:<br /><br /><br /><br />a	c	e<br /><br />b	d	f<br /><br />0	0	1<br /><br />In other words, the transform() method lets you scale, rotate, move, and skew the current context.
		*/
        transform: function (a, b, c, d, e, f) {
            this.ctx._transform = this._matrix_multiply( this.ctx._transform, [a, b, c, d, e, f] );
        },

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
        setTransform: function (a, b, c, d, e, f) {
            this.ctx._transform = [a, b, c, d, e, f];
        },

		/**
		* @name _getTransform
		* @function  
		* @private
		* @ignore
		*/
        _getTransform: function () {
            return this.ctx._transform;
        },

        lastBreak: 0,
        // Y Position of page breaks.
        pageBreaks: [],
		
		/**
		* Should only be used if pageWrapYEnabled is true
		* 
		* @name _page
		* @function  
		* @private
		* @ignore
		* @returns One-based Page Number
		*/
        _page: function (y) {
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
        },

        _gotoPage: function (pageOneBased) {
            // This is a stub to be overriden if needed
        },

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
        drawImage: function (img, x, y, w, h, x2, y2, w2, h2) {
            if (x2 !== undefined) {
                x = x2;
                y = y2;
                w = w2;
                h = h2;
            }
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xRect = this._matrix_map_rect(this.ctx._transform, {x: x, y: y, w: w, h: h});
            var xRect2 = this._matrix_map_rect(this.ctx._transform, {x: x2, y: y2, w: w2, h: h2});

            // TODO implement source clipping and image scaling
            var format;
            var rx = /data:image\/(\w+).*/i;
            var m = rx.exec(img);
            if (m != null) {
                format = m[1];
            } else {
                // format = "jpeg";
                format = "png";
            }

            this.pdf.addImage(img, format, xRect.x, xRect.y, xRect.w, xRect.h);
        },

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
        _matrix_multiply: function (m2, m1) {
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
        },
		/**
		* @name _matrix_rotation
		* @function 
		* @private
		* @ignore
		*/
        _matrix_rotation: function (m) {
            return Math.atan2(m[2], m[0]);

        },

		/**
		* @name _matrix_decompose
		* @function 
		* @private
		* @ignore
		*/
        _matrix_decompose: function (matrix) {

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
        },

		/**
		* @name _matrix_map_point
		* @function 
		* @private
		* @ignore
		*/
        _matrix_map_point: function (m1, pt) {
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
        },

		/**
		* @name _matrix_map_point_obj
		* @function 
		* @private
		* @ignore
		*/
        _matrix_map_point_obj: function (m1, pt) {
            var xpt = this._matrix_map_point(m1, [pt.x, pt.y]);
            return {x: xpt[0], y: xpt[1]};
        },

		/**
		* @name _matrix_map_rect
		* @function 
		* @private
		* @ignore
		*/
        _matrix_map_rect: function (m1, rect) {
            var p1 = this._matrix_map_point(m1, [rect.x, rect.y]);
            var p2 = this._matrix_map_point(m1, [rect.x + rect.w, rect.y + rect.h]);
            return {x: p1[0], y: p1[1], w: p2[0] - p1[0], h: p2[1] - p1[1]};
        },

		/**
		* @name _matrix_is_identity
		* @function 
		* @private
		* @ignore
		*/
        _matrix_is_identity: function (m1) {
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
        },
		/**
		* Processes the paths
		*
		* @function 
		* @param rule {String}
		* @param isClip {Boolean}
		* @private
		* @ignore
		*/
      _drawPaths: function _drawPaths(rule, isClip) {
        var isStroke = rule === 'stroke';
        var isFill = !isStroke;

        if (isStroke && !isClip && this._isStrokeTransparent()) {
          return;
        }

        if (isFill && !isClip && this._isFillTransparent()) {
          return;
        }
		
        var v2Support = typeof this.pdf.internal.newObject2 === 'function';
        var lines;

        if (globalObj.outIntercept) {
          lines = globalObj.outIntercept.type === 'group' ? globalObj.outIntercept.stream : globalObj.outIntercept;
        } else {
          lines = this.internal.getCurrentPage();
        }

        var moves = [];
        var outInterceptOld = globalObj.outIntercept;

		/*
        if (v2Support) {
          // Blend and Mask
          switch (this.ctx.globalCompositeOperation) {
            case 'normal':
            case 'source-over':
              break;

            case 'destination-in':
            case 'destination-out':
              //TODO this need to be added to the current group or page
              // define a mask stream
              var obj = this.pdf.internal.newStreamObject(); // define a mask state

              var obj2 = this.pdf.internal.newObject2();
              obj2.push('<</Type /ExtGState');
              obj2.push('/SMask <</S /Alpha /G ' + obj.objId + ' 0 R>>'); // /S /Luminosity will need to define color space

              obj2.push('>>'); // add mask to page resources

              var gsName = 'MASK' + obj2.objId;
              this.pdf.internal.addGraphicsState(gsName, obj2.objId);
              var instruction = '/' + gsName + ' gs'; // add mask to page, group, or stream

              lines.splice(0, 0, 'q');
              lines.splice(1, 0, instruction);
              lines.push('Q');
              globalObj.outIntercept = obj;
              break;

            default:
              var dictionaryEntry = '/' + this.pdf.internal.blendModeMap[this.ctx.globalCompositeOperation.toUpperCase()];

              if (dictionaryEntry) {
                this.pdf.internal.out(dictionaryEntry + ' gs');
              }

              break;
          }
        }
		*/

        var alpha = this.ctx.globalAlpha;

        if (this.ctx._fillOpacity < 1) {
          // TODO combine this with global opacity
          alpha = this.ctx._fillOpacity;
        } //TODO check for an opacity graphics state that was already created
        //TODO do not set opacity if current value is already active

		/*
        if (v2Support) {
          var objOpac = this.pdf.internal.newObject2();
          objOpac.push('<</Type /ExtGState'); //objOpac.push(this.ctx.globalAlpha + " CA"); // Stroke
          //objOpac.push(this.ctx.globalAlpha + " ca"); // Not Stroke

          objOpac.push('/CA ' + alpha); // Stroke

          objOpac.push('/ca ' + alpha); // Not Stroke

          objOpac.push('>>');
          var gsName = 'GS_O_' + objOpac.objId;
          this.pdf.internal.addGraphicsState(gsName, objOpac.objId);
          this.pdf.internal.out('/' + gsName + ' gs');
        }
		*/
		
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
              var delta = [pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
			  var iii = moves.length;
			  if (iii > 0) {
				  for (iii; iii > 0; iii--) {
					  if (moves[iii-1].close !== true && moves[iii-1].begin !== true) {
					  moves[iii - 1].deltas.push(delta);
					  moves[iii - 1].abs.push(pt);
					  break;
					  }
				  }
			  }
              break;

            case 'bct':
              var delta = [pt.x1 - xPath[i - 1].x, pt.y1 - xPath[i - 1].y, pt.x2 - xPath[i - 1].x, pt.y2 - xPath[i - 1].y, pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
              moves[moves.length - 1].deltas.push(delta);
              break;

            case 'qct':
              // convert to bezier
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
			if (isStroke) {
				style = 'S';
			} else {
				style = 'f';
			}
		} else {
			style = null;
		}

        for (var i = 0; i < moves.length; i++) {

          if (moves[i].begin) {
			//this.pdf.internal.out('n');
          }

          if (moves[i].arc) {
            if (moves[i].start) {
              this.internal.move2(this, moves[i].start.x, moves[i].start.y);
            }

            var arcs = moves[i].abs;

		  for (var ii = 0; ii < arcs.length; ii++) {
			var arc = arcs[ii]; //TODO lines deltas were getting in here

			if (typeof arc.startAngle !== 'undefined') {
			  var start = arc.startAngle * 360 / (2 * Math.PI);
			  var end = arc.endAngle * 360 / (2 * Math.PI);
			  var x = arc.x;
			  var y = arc.y;

			  this.internal.arc2(this, x, y, arc.radius, start, end, arc.counterclockwise, style, isClip);
			} else {
			  this.internal.line2(c2d, arc.x, arc.y);
			}
		  }
		
          } 
          if (!moves[i].arc) {
            if (moves[i].close !== true && moves[i].begin !== true) {
              var x = moves[i].start.x;
              var y = moves[i].start.y;
                this.pdf.lines(moves[i].deltas, x, y, null, null);
            }
		  }
		  if (moves[i].close) {
			//this.pdf.internal.out('n');
		  }
        }
		


		if (style) {
			this.pdf.internal.out(style);
		} 
		if (isClip) {
			this.pdf.clip();
		}

        globalObj.outIntercept = outInterceptOld; 
		// if (this.ctx._clip_path.length > 0) {
        //     lines.push('Q');
        // }
      },
	  /*
        _pushMask: function () {
            var v2Support = typeof this.pdf.internal.newObject2 === 'function';

            if (!v2Support) {
                console.log('jsPDF v2 not enabled')
                return;
            }

            // define a mask stream
            var obj = this.pdf.internal.newStreamObject();

            // define a mask state
            var obj2 = this.pdf.internal.newObject2();
            obj2.push('<</Type /ExtGState');
            obj2.push('/SMask <</S /Alpha /G ' + obj.objId + ' 0 R>>'); // /S /Luminosity will need to define color space
            obj2.push('>>');

            // add mask to page resources
            var gsName = 'MASK' + obj2.objId;
            this.pdf.internal.addGraphicsState(gsName, obj2.objId);

            var instruction = '/' + gsName + ' gs';
            this.pdf.internal.out(instruction);
        },
		*/
        _getBaseline: function (y) {
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
        },

      createLinearGradient: function createLinearGradient() {
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
      },
      createPattern: function createPattern() {
		  return this.createLinearGradient();
	  },
      createRadialGradient: function createRadialGradient() {
		  return this.createLinearGradient();
	  }	  
    };
	
	

    var c2d = jsPDFAPI.context2d;


	/**
	* Sets or returns the color, gradient, or pattern used to fill the drawing
	*
	* @name fillStyle
	* @default #000000
	* @property {(color|gradient|pattern)} value The color of the drawing. Default value is #000000<br />
	* A gradient object (linear or radial) used to fill the drawing (not supported by context2d)<br />
	* A pattern object to use to fill the drawing (not supported by context2d)
	*/
    Object.defineProperty(c2d, 'fillStyle', {
        set: function (value) {
            this._setFillStyle(value);
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
    Object.defineProperty(c2d, 'strokeStyle', {
        set: function (value) {
            this._setStrokeStyle(value);
        },
        get: function () {
            return this.ctx.strokeStyle;
        }
    });
	
	//Line Styles

	/**
	* Sets or returns the style of the end caps for a line
	*
	* @name lineCap
	* @default butt
	* @property {(butt|round|square)} lineCap butt A flat edge is added to each end of the line <br/>
	* round A rounded end cap is added to each end of the line<br/>
	* square A square end cap is added to each end of the line<br/>
	*/
    Object.defineProperty(c2d, 'lineCap', {
        set: function (val) {
            this._setLineCap(val);
        },
        get: function () {
            return this.ctx.lineCap;
        }
    });
	
	/**
	* Sets or returns the current line width
	*
	* @name lineWidth
	* @default 1
	* @property {number} lineWidth The current line width, in pixels
	*/
    Object.defineProperty(c2d, 'lineWidth', {
        set: function (value) {
            this._setLineWidth(value);
        },
        get: function () {
            return this.ctx.lineWidth;
        }
    });
	
	/**
	* Sets or returns the type of corner created, when two lines meet
	*/
    Object.defineProperty(c2d, 'lineJoin', {
        set: function (val) {
            this._setLineJoin(val);
        },
        get: function () {
            return this.ctx.lineJoin;
        }
    });
	
	/**
	* Sets or returns the maximum miter length
	*/
    Object.defineProperty(c2d, 'miterLimit', {
        set: function (val) {
            this.ctx.miterLimit = val;
        },
        get: function () {
            return this.ctx.miterLimit;
        }
    });
	
    Object.defineProperty(c2d, 'textBaseline', {
        set: function (value) {
            this._setTextBaseline(value);
        },
        get: function () {
            return this._getTextBaseline();
        }
    });
    Object.defineProperty(c2d, 'textAlign', {
        set: function (value) {
            this._setTextAlign(value);
        },
        get: function () {
            return this._getTextAlign();
        }
    });
    Object.defineProperty(c2d, 'font', {
        set: function (value) {
            this._setFont(value);
        },
        get: function () {
            return this.ctx.font;
        }
    });
    Object.defineProperty(c2d, 'globalCompositeOperation', {
        set: function (value) {
            this.ctx.globalCompositeOperation = value;
        },
        get: function () {
            return this.ctx.globalCompositeOperation;
        }
    });
    Object.defineProperty(c2d, 'globalAlpha', {
        set: function (value) {
            this.ctx.globalAlpha = value;
        },
        get: function () {
            return this.ctx.globalAlpha;
        }
    });
    Object.defineProperty(c2d, 'canvas', {
        get: function () {
            return {parentNode: false, style: false};
        }
    });
    // Not HTML API
    Object.defineProperty(c2d, 'ignoreClearRect', {
        set: function (value) {
            this.ctx.ignoreClearRect = value;
        },
        get: function () {
            return this.ctx.ignoreClearRect;
        }
    });
    // End Not HTML API

    c2d.internal = {};

    c2d.internal.rxRgb = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
    c2d.internal.rxRgba = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/;
    c2d.internal.rxTransparent = /transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/;

    // http://hansmuller-flex.blogspot.com/2011/10/more-about-approximating-circular-arcs.html
    c2d.internal.arc = function (c2d, xc, yc, r, a1, a2, counterclockwise, style) {
        var includeMove = true;

        var k = this.pdf.internal.scaleFactor;
        var pageHeight = this.pdf.internal.pageSize.getHeight();
        var f2 = this.pdf.internal.f2;

        var a1r = a1 * (Math.PI / 180);
        var a2r = a2 * (Math.PI / 180);
        var curves = this.createArc(r, a1r, a2r, counterclockwise);
        var pathData = null;

        for (var i = 0; i < curves.length; i++) {
            var curve = curves[i];
            if (includeMove && i === 0) {
                this.pdf.internal.out([
                    f2((curve.x1 + xc) * k), f2((pageHeight - (curve.y1 + yc)) * k), 'm', f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'
                ].join(' '));

            } else {
                this.pdf.internal.out([
                    f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'
                ].join(' '));
            }

            //c2d._lastPoint = {x: curve.x1 + xc, y: curve.y1 + yc};
            c2d._lastPoint = {x: xc, y: yc};
            // f2((curve.x1 + xc) * k), f2((pageHeight - (curve.y1 + yc)) * k), 'm', f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'
        }

        if (style !== null) {
            this.pdf.internal.out(this.pdf.internal.getStyle(style));
        }
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
    c2d.internal.arc2 = function (c2d, x, y, r, a1, a2, counterclockwise, style, isClip) {
        // we need to convert from cartesian to polar here methinks.
        var centerX = x;// + r;
        var centerY = y;

        if (!isClip) {
            this.arc(c2d, centerX, centerY, r, a1, a2, counterclockwise, style);
        } else {
            this.arc(c2d, centerX, centerY, r, a1, a2, counterclockwise, null);
            this.pdf.clip();
        }
    };

    c2d.internal.move2 = function (c2d, x, y) {
        var k = this.pdf.internal.scaleFactor;
        var pageHeight = this.pdf.internal.pageSize.getHeight();
        var f2 = this.pdf.internal.f2;

        this.pdf.internal.out([
            f2((x) * k), f2((pageHeight - (y)) * k), 'm'
        ].join(' '));
        c2d._lastPoint = {x: x, y: y};
    };

    c2d.internal.line2 = function (c2d, dx, dy) {
        var k = this.pdf.internal.scaleFactor;
        var pageHeight = this.pdf.internal.pageSize.getHeight();
        var f2 = this.pdf.internal.f2;

        //var pt = {x: c2d._lastPoint.x + dx, y: c2d._lastPoint.y + dy};
        var pt = {x: dx, y: dy};

        this.pdf.internal.out([
            f2((pt.x) * k), f2((pageHeight - (pt.y)) * k), 'l'
        ].join(' '));
        //this.pdf.internal.out('f');
        c2d._lastPoint = pt;

    };

    /**
     * Return a array of objects that represent bezier curves which approximate the circular arc centered at the origin, from startAngle to endAngle (radians) with the specified radius.
     *
     * Each bezier curve is an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
     */
	c2d.internal.createArc = function(radius,startAngle,endAngle,anticlockwise) {

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
			curves.push(this.createSmallArc(radius, a1, a2));
			totalAngle -= Math.abs(a2 - a1);
			a1 = a2;
		}

		return curves;
	}




    c2d.internal.getCurrentPage = function () {
        return this.pdf.internal.pages[this.pdf.internal.getCurrentPageInfo().pageNumber];
    };

    /**
     * Cubic bezier approximation of a circular arc centered at the origin, from (radians) a1 to a2, where a2-a1 < pi/2. The arc's radius is r.
     *
     * Returns an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
     *
     * This algorithm is based on the approach described in: A. Riškus, "Approximation of a Cubic Bezier Curve by Circular Arcs and Vice Versa," Information Technology and Control, 35(4), 2006 pp. 371-378.
     */

    c2d.internal.createSmallArc = function (r, a1, a2) {
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
    }
	
	/**
	*
	* @function
	* @constructor
	*/
    function context() {
        this._isStrokeTransparent = false;
        this._strokeOpacity = 1;
        this.strokeStyle = '#000000';
        this.fillStyle = '#000000';
        this._isFillTransparent = false;
        this._fillOpacity = 1;
        this.font = "12pt times";
        this.textBaseline = 'alphabetic'; // top,bottom,middle,ideographic,alphabetic,hanging
        this.textAlign = 'left';
        this.lineWidth = 1;
        this.lineJoin = 'miter'; // round, bevel, miter
        this.lineCap = 'butt'; // butt, round, square
        this._transform = [1, 0, 0, 1, 0, 0]; // sx, shy, shx, sy, tx, ty
        this.globalCompositeOperation = 'normal';
        this.globalAlpha = 1.0;
        this._clip_path = [];
		this.currentPoint = {x : 0, y : 0};
        
        // TODO miter limit //default 10

        // Not HTML API
        this.ignoreClearRect = false;

        this.copy = function (ctx) {
            this._isStrokeTransparent = ctx._isStrokeTransparent;
            this._strokeOpacity = ctx._strokeOpacity;
            this.strokeStyle = ctx.strokeStyle;
            this._isFillTransparent = ctx._isFillTransparent;
            this._fillOpacity = ctx._fillOpacity;
            this.fillStyle = ctx.fillStyle;
            this.font = ctx.font;
            this.lineWidth = ctx.lineWidth;
            this.lineJoin = ctx.lineJoin;
            this.lineCap = ctx.lineCap;
            this.textBaseline = ctx.textBaseline;
            this.textAlign = ctx.textAlign;
            this._fontSize = ctx._fontSize;
            this._transform = ctx._transform.slice(0);
            this.globalCompositeOperation = ctx.globalCompositeOperation;
            this.globalAlpha = ctx.globalAlpha;
            this._clip_path = ctx._clip_path.slice(0); //TODO deep copy?
			this.currentPoint = ctx.currentPoint;

            // Not HTML API
            this.ignoreClearRect = ctx.ignoreClearRect;
        };
    }

    return this;
})(jsPDF.API, (typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global ||  Function('return typeof this === "object" && this.content')() || Function('return this')()));