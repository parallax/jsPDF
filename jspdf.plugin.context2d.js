/**
 * jsPDF Context2D PlugIn
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * This plugin mimicks the HTML5 Canvas's context2d.
 * 
 * The goal is to provide a way for current canvas implementations to print directly to a PDF.
 */

/**
 * require('jspdf.js');
 * require('lib/css_colors.js');
 */

(function(jsPDFAPI) {
	'use strict';

	jsPDFAPI.events.push([
			'initialized', function() {
				this.context2d.pdf = this;
				this.context2d.internal.pdf = this;
				this.context2d.ctx = new context();
				this.context2d.ctxStack = [];
				this.context2d.path = [];
			}
	]);

	jsPDFAPI.context2d = {
		pageWrapXEnabled : false,
		pageWrapYEnabled : true,
		pageWrapX : 9999999,
		pageWrapY : 9999999,

		f2 : function(number) {
			return number.toFixed(2);
		},

		fillRect : function(x,y,w,h) {
			x = this._wrapX(x);
			y = this._wrapY(y);
			this.pdf.rect(x, y, w, h, "f");
		},

		strokeRect : function(x,y,w,h) {
			x = this._wrapX(x);
			y = this._wrapY(y);
			this.pdf.rect(x, y, w, h, "s");
		},

		clearRect : function(x,y,w,h) {
			x = this._wrapX(x);
			y = this._wrapY(y);
			this.save();
			this.setFillStyle('#ffffff');
			this.pdf.rect(x, y, w, h, "f");
			this.restore();
		},

		save : function() {
			this.ctx._fontSize = this.pdf.internal.getFontSize();
			var ctx = new context();
			ctx.copy(this.ctx);
			this.ctxStack.push(this.ctx);
			this.ctx = ctx;
		},

		restore : function() {
			this.ctx = this.ctxStack.pop();
			this.setFillStyle(this.ctx.fillStyle);
			this.setStrokeStyle(this.ctx.strokeStyle);
			this.setFont(this.ctx.font);
			this.pdf.setFontSize(this.ctx._fontSize);
			this.setLineCap(this.ctx.lineCap);
			this.setLineWidth(this.ctx.lineWidth);
			this.setLineJoin(this.ctx.lineJoin);
		},

		beginPath : function() {
			this.path = [];
		},

		closePath : function() {
			this.path.push({
				type : 'close'
			});
		},

		setFillStyle : function(style) {

			// get the decimal values of r, g, and b;
			var r, g, b, a;

			var m = this.internal.rxRgb.exec(style);
			if (m != null) {
				r = parseInt(m[1]);
				g = parseInt(m[2]);
				b = parseInt(m[3]);
			} else {
				m = this.internal.rxRgba.exec(style);
				if (m != null) {
					r = parseInt(m[1]);
					g = parseInt(m[2]);
					b = parseInt(m[3]);
					a = parseInt(m[4]);
				} else {
					if (style.charAt(0) != '#') {
						style = CssColors.colorNameToHex(style);
						if (!style) {
							style = '#000000';
						}
					} else {
					}
					this.ctx.fillStyle = style;

					if (style.length === 4) {
						r = this.ctx.fillStyle.substring(1, 2);
						r += r;
						g = this.ctx.fillStyle.substring(2, 3);
						g += g;
						b = this.ctx.fillStyle.substring(3, 4);
						b += b;
					} else {
						r = this.ctx.fillStyle.substring(1, 3);
						g = this.ctx.fillStyle.substring(3, 5);
						b = this.ctx.fillStyle.substring(5, 7);
					}
					r = parseInt(r, 16);
					g = parseInt(g, 16);
					b = parseInt(b, 16);
				}
			}
			this.pdf.setFillColor(r, g, b, {
				a : a
			});
			this.pdf.setTextColor(r, g, b, {
				a : a
			});
		},

		setStrokeStyle : function(style) {
			if (style.charAt(0) != '#') {
				style = CssColors.colorNameToHex(style);
				if (!style) {
					style = '#000000';
				}
			}
			this.ctx.strokeStyle = style;
			var r = this.ctx.strokeStyle.substring(1, 3);
			r = parseInt(r, 16);
			var g = this.ctx.strokeStyle.substring(3, 5);
			g = parseInt(g, 16);
			var b = this.ctx.strokeStyle.substring(5, 7);
			b = parseInt(b, 16);
			this.pdf.setDrawColor(r, g, b);
		},

		fillText : function(text,x,y,maxWidth) {
			x = this._wrapX(x);
			y = this._wrapY(y);
			this.pdf.text(text, x, this._getBaseline(y));
		},

		strokeText : function(text,x,y,maxWidth) {
			x = this._wrapX(x);
			y = this._wrapY(y);
			this.pdf.text(text, x, this._getBaseline(y), {
				stroke : true
			});
		},

		setFont : function(font) {
			this.ctx.font = font;

			var rx = /\s*(\w+)\s+(\w+)\s+(\w+)\s+([\d\.]+)(px|pt|em)\s+["']?(\w+)['"]?/;
			m = rx.exec(font);
			if (m != null) {
				var fontStyle = m[1];
				var fontVariant = m[2];
				var fontWeight = m[3];
				var fontSize = m[4];
				var fontSizeUnit = m[5];
				var fontFamily = m[6];

				if ('px' === fontSizeUnit) {
					fontSize = Math.floor(parseFloat(fontSize));
					//fontSize = fontSize * 1.25;
				} else if ('em' === fontSizeUnit) {
					fontSize = Math.floor(parseFloat(fontSize) * this.pdf.getFontSize());
				} else {
					fontSize = Math.floor(parseFloat(fontSize));
				}

				this.pdf.setFontSize(fontSize);

				if (fontWeight === 'bold' || fontWeight === '700') {
					this.pdf.setFontStyle('bold');
				} else {
					if (fontStyle === 'italic') {
						this.pdf.setFontStyle('italic');
					} else {
						this.pdf.setFontStyle('normal');
					}
				}
				//TODO This needs to be parsed
				var name = fontFamily;
				this.pdf.setFont(name, style);
			} else {
				var rx = /(\d+)(pt|px|em)\s+(\w+)\s*(\w+)?/;
				var m = rx.exec(font);
				if (m != null) {
					var size = m[1];
					var unit = m[2];
					var name = m[3];
					var style = m[4];
					if (!style) {
						style = 'normal';
					}
					if ('em' === fontSizeUnit) {
						size = Math.floor(parseFloat(fontSize) * this.pdf.getFontSize());
					} else {
						size = Math.floor(parseFloat(size));
					}
					this.pdf.setFontSize(size);
					this.pdf.setFont(name, style);
				}
			}
		},

		setTextBaseline : function(baseline) {
			this.ctx.textBaseline = baseline;
		},

		getTextBaseline : function() {
			return this.ctx.textBaseline;
		},

		setLineWidth : function(width) {
			this.ctx.lineWidth = width;
			this.pdf.setLineWidth(width);
		},

		setLineCap : function(style) {
			this.ctx.lineCap = style;
			this.pdf.setLineCap(style);
		},

		setLineJoin : function(style) {
			this.ctx.lineJon = style;
			this.pdf.setLineJoin(style);
		},

		moveTo : function(x,y) {
			x = this._wrapX(x);
			y = this._wrapY(y);
			var obj = {
				type : 'mt',
				x : x,
				y : y
			};
			this.path.push(obj);
		},

		_wrapX : function(x) {
			if (this.pageWrapXEnabled) {
				return x % this.pageWrapX;
			} else {
				return x;
			}
		},

		_wrapY : function(y) {
			if (this.pageWrapYEnabled) {
				this._gotoPage(this._page(y));
				return (y - this.lastBreak) % this.pageWrapY;
			} else {
				return y;
			}
		},

		lastBreak : 0,
		// Y Position of page breaks.
		pageBreaks : [],
		// returns: One-based Page Number
		// Should only be used if pageWrapYEnabled is true
		_page : function(y) {
			if (this.pageWrapYEnabled) {
				this.lastBreak = 0;
				var manualBreaks = 0;
				var autoBreaks = 0;
				for (var i = 0; i < this.pageBreaks.length; i++) {
					if (y >= this.pageBreaks[i]) {
						manualBreaks++;
						if (this.lastBreak === 0){
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

		_gotoPage : function(pageOneBased) {
			// This is a stub to be overriden if needed
		},

		lineTo : function(x,y) {
			x = this._wrapX(x);
			y = this._wrapY(y);
			var obj = {
				type : 'lt',
				x : x,
				y : y
			};
			this.path.push(obj);
		},

		bezierCurveTo : function(x1, y1, x2, y2, x, y) {
			x1 = this._wrapX(x1);
			y1 = this._wrapY(y1);
			x2 = this._wrapX(x2);
			y2 = this._wrapY(y2);
			x = this._wrapX(x);
			y = this._wrapY(y);
			var obj = {
				type : 'bct',
				x1 : x1,
				y1 : y1,
				x2 : x2,
				y2 : y2,
				x : x,
				y : y
			};
			this.path.push(obj);
		},

		quadraticCurveTo : function(x1, y1, x, y) {
			x1 = this._wrapX(x1);
			y1 = this._wrapY(y1);
			x = this._wrapX(x);
			y = this._wrapY(y);
			var obj = {
				type : 'qct',
				x1 : x1,
				y1 : y1,
				x : x,
				y : y
			};
			this.path.push(obj);		},

		arc : function(x,y,radius,startAngle,endAngle,anticlockwise) {
			x = this._wrapX(x);
			y = this._wrapY(y);
			var obj = {
				type : 'arc',
				x : x,
				y : y,
				radius : radius,
				startAngle : startAngle,
				endAngle : endAngle,
				anticlockwise : anticlockwise
			}
			this.path.push(obj);
		},

		drawImage : function(img,x,y,w,h,x2,y2,w2,h2) {
			if (x2 !== undefined) {
				x = x2;
				y = y2;
				w = w2;
				h = h2;
			}
			x = this._wrapX(x);
			y = this._wrapY(y);

			//TODO implement source clipping and image scaling
			var format;
			var rx = /data:image\/(\w+).*/i;
			var m = rx.exec(img);
			if (m != null) {
				format = m[1];
			} else {
				//format = "jpeg";
				format = "png";
			}
			this.pdf.addImage(img, format, x, y, w, h);
		},

		stroke : function() {
			var start;
			var deltas = [];
			var last;
			var closed = false;
			for (var i = 0; i < this.path.length; i++) {
				var pt = this.path[i];
				switch (pt.type) {
				case 'mt':
					start = pt;
					if (typeof start != 'undefined') {
						this.pdf.lines(deltas, start.x, start.y, null, 's');
						deltas = [];
					}
					break;
				case 'lt':
					var delta = [
							pt.x - this.path[i - 1].x, pt.y - this.path[i - 1].y
					];
					deltas.push(delta);
					break;
				case 'bct':
					var delta = [
							pt.x1 - this.path[i - 1].x, pt.y1 - this.path[i - 1].y,
							pt.x2 - this.path[i - 1].x, pt.y2 - this.path[i - 1].y,
							pt.x - this.path[i - 1].x, pt.y - this.path[i - 1].y
					];
					deltas.push(delta);
					break;	
				case 'qct':
					// convert to bezier
					var x1 = this.path[i - 1].x + 2.0/3.0 * (pt.x1 - this.path[i - 1].x);
					var y1 = this.path[i - 1].y + 2.0/3.0 * (pt.y1 - this.path[i - 1].y);
					var x2 = pt.x + 2.0/3.0 * (pt.x1 - pt.x);
					var y2 = pt.y + 2.0/3.0 * (pt.y1 - pt.y);
					var x3 = pt.x;
					var y3 = pt.y;
					var delta = [
						x1 - this.path[i - 1].x, y1 - this.path[i - 1].y,
						x2 - this.path[i - 1].x, y2 - this.path[i - 1].y,
						x3 - this.path[i - 1].x, y3 - this.path[i - 1].y
					];
					deltas.push(delta);
					break;
				case 'close':
					closed = true;
					break;
				}
			}

			if (typeof start != 'undefined') {
				this.pdf.lines(deltas, start.x, start.y, null, 's', closed);
			}

			for (var i = 0; i < this.path.length; i++) {
				var pt = this.path[i];
				switch (pt.type) {
				case 'arc':
					var start = pt.startAngle * 360 / (2 * Math.PI);
					var end = pt.endAngle * 360 / (2 * Math.PI);
					this.internal.arc(pt.x, pt.y, pt.radius, start, end, pt.anticlockwise, 's');
					break;
				}
			}

			this.path = [];
		},

		fill : function() {
			var start;
			var deltas = [];
			var last;
			for (var i = 0; i < this.path.length; i++) {
				var pt = this.path[i];
				switch (pt.type) {
				case 'mt':
					start = pt;
					if (typeof start != 'undefined') {
						this.pdf.lines(deltas, start.x, start.y, null, 'f');
						deltas = [];
					}
					break;
				case 'lt':
					var delta = [
							pt.x - this.path[i - 1].x, pt.y - this.path[i - 1].y
					];
					deltas.push(delta);
					break;
				case 'bct':
					var delta = [
							pt.x1 - this.path[i - 1].x, pt.y1 - this.path[i - 1].y,
							pt.x2 - this.path[i - 1].x, pt.y2 - this.path[i - 1].y,
							pt.x - this.path[i - 1].x, pt.y - this.path[i - 1].y
					];
					deltas.push(delta);
					break;	
				case 'qct':
					// convert to bezier
					var x1 = this.path[i - 1].x + 2.0/3.0 * (pt.x1 - this.path[i - 1].x);
					var y1 = this.path[i - 1].y + 2.0/3.0 * (pt.y1 - this.path[i - 1].y);
					var x2 = pt.x + 2.0/3.0 * (pt.x1 - pt.x);
					var y2 = pt.y + 2.0/3.0 * (pt.y1 - pt.y);
					var x3 = pt.x;
					var y3 = pt.y;
					var delta = [
						x1 - this.path[i - 1].x, y1 - this.path[i - 1].y,
						x2 - this.path[i - 1].x, y2 - this.path[i - 1].y,
						x3 - this.path[i - 1].x, y3 - this.path[i - 1].y
					];
					deltas.push(delta);
					break;
				}
			}

			if (typeof start != 'undefined') {
				this.pdf.lines(deltas, start.x, start.y, null, 'f');
			}

			for (var i = 0; i < this.path.length; i++) {
				var pt = this.path[i];
				switch (pt.type) {
				case 'arc':
					var start = pt.startAngle * 360 / (2 * Math.PI);
					var end = pt.endAngle * 360 / (2 * Math.PI);
					this.internal.arc(pt.x, pt.y, pt.radius, start, end, pt.anticlockwise, 'f');
					break;
				case 'close':
					this.pdf.internal.out('h');
					break;
				}
			}

			this.path = [];
		},

		clip : function() {
			//TODO not implemented
		},

		translate : function(x,y) {
			this.ctx._translate = {
				x : x,
				y : y
			};
			//TODO use translate in other drawing methods.
		},
		measureText : function(text) {
			var pdf = this.pdf;
			return {
				getWidth : function() {
					var fontSize = pdf.internal.getFontSize();
					var txtWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor;
					return txtWidth;
				},
			
				get width(){
					return this.getWidth(text);
				}
			}
		},
		_getBaseline : function(y) {
			var height = parseInt(this.pdf.internal.getFontSize());
			//TODO Get descent from font descriptor
			var descent = height * .25;
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
				//TODO not implemented
				return y;
			case 'alphabetic':
			default:
				return y;
			}
		}
	};

	var c2d = jsPDFAPI.context2d;

	// accessor methods
	Object.defineProperty(c2d, 'fillStyle', {
		set : function(value) {
			this.setFillStyle(value);
		},
		get : function() {
			return this.ctx.fillStyle;
		}
	});
	Object.defineProperty(c2d, 'textBaseline', {
		set : function(value) {
			this.setTextBaseline(value);
		},
		get : function() {
			return this.getTextBaseline();
		}
	});
	Object.defineProperty(c2d, 'font', {
		set : function(value) {
			this.setFont(value);
		},
		get : function() {
			return this.getFont();
		}
	});

	c2d.internal = {};

	c2d.internal.rxRgb = /rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+\s*)\)/;
	c2d.internal.rxRgba = /rgba\s*\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/;

	// http://hansmuller-flex.blogspot.com/2011/10/more-about-approximating-circular-arcs.html
	c2d.internal.arc = function(xc,yc,r,a1,a2,anticlockwise,style) {

		var k = this.pdf.internal.scaleFactor;
		var pageHeight = this.pdf.internal.pageSize.height;
		var f2 = this.pdf.internal.f2;

		var a1r = a1 * (Math.PI / 180);
		var a2r = a2 * (Math.PI / 180);
		var curves = this.createArc(r, a1r, a2r, anticlockwise);
		var pathData = null;

		for (var i = 0; i < curves.length; i++) {
			var curve = curves[i];
			if (i == 0) {
				this.pdf.internal.out([
						f2((curve.x1 + xc) * k), f2((pageHeight - (curve.y1 + yc)) * k), 'm', f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'
				].join(' '));

			} else {
				this.pdf.internal.out([
						f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'
				].join(' '));
			}
			//f2((curve.x1 + xc) * k), f2((pageHeight - (curve.y1 + yc)) * k), 'm', f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'
		}

		if (style !== null) {
			this.pdf.internal.out(this.pdf.internal.getStyle(style));
		}
	}

	/**
	 *  Return a array of objects that represent bezier curves which approximate the 
	 *  circular arc centered at the origin, from startAngle to endAngle (radians) with 
	 *  the specified radius.
	 *  
	 *  Each bezier curve is an object with four points, where x1,y1 and 
	 *  x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's 
	 *  control points.
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

	/**
	 *  Cubic bezier approximation of a circular arc centered at the origin, 
	 *  from (radians) a1 to a2, where a2-a1 < pi/2.  The arc's radius is r.
	 * 
	 *  Returns an object with four points, where x1,y1 and x4,y4 are the arc's end points
	 *  and x2,y2 and x3,y3 are the cubic bezier's control points.
	 * 
	 *  This algorithm is based on the approach described in:
	 *  A. Riškus, "Approximation of a Cubic Bezier Curve by Circular Arcs and Vice Versa," 
	 *  Information Technology and Control, 35(4), 2006 pp. 371-378.
	 */

	c2d.internal.createSmallArc = function(r,a1,a2) {
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
			x1 : r * Math.cos(a1),
			y1 : r * Math.sin(a1),
			x2 : x2 * cos_ar - y2 * sin_ar,
			y2 : x2 * sin_ar + y2 * cos_ar,
			x3 : x3 * cos_ar - y3 * sin_ar,
			y3 : x3 * sin_ar + y3 * cos_ar,
			x4 : r * Math.cos(a2),
			y4 : r * Math.sin(a2)
		};
	}

	function context() {
		this.fillStyle = '#000000';
		this.strokeStyle = '#000000';
		this.font = "12pt times";
		this.textBaseline = 'alphabetic'; //top,bottom,middle,ideographic,alphabetic,hanging
		this.lineWidth = 1;
		this.lineJoin = 'miter'; //round, bevel, miter
		this.lineCap = 'butt'; //butt, round, square
		this._translate = {
			x : 0,
			y : 0
		};
		//TODO miter limit //default 10

		this.copy = function(ctx) {
			this.fillStyle = ctx.fillStyle;
			this.strokeStyle = ctx.strokeStyle;
			this.font = ctx.font;
			this.lineWidth = ctx.lineWidth;
			this.lineJoin = ctx.lineJoin;
			this.lineCap = ctx.lineCap;
			this.textBaseline = ctx.textBaseline;
			this._fontSize = ctx._fontSize;
			this._translate = {
				x : ctx._translate.x,
				y : ctx._translate.y
			};
		};
	}

	return this;
})(jsPDF.API);
