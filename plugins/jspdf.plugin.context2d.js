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

		f2 : function(number) {
			return number.toFixed(2);
		},

		fillRect : function(x,y,w,h) {
			this.pdf.rect(x, y, w, h, "f");
		},

		strokeRect : function(x,y,w,h) {
			this.pdf.rect(x, y, w, h, "s");
		},

		clearRect : function(x,y,w,h) {
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
			if (style.charAt(0) != '#') {
				style = this.internal.colorNameToHex(style);
				if (!style) {
					style = '#000000';
				}
			}
			this.ctx.fillStyle = style;
			var r = this.ctx.fillStyle.substring(1, 3);
			r = parseInt(r, 16);
			var g = this.ctx.fillStyle.substring(3, 5);
			g = parseInt(g, 16);
			var b = this.ctx.fillStyle.substring(5, 7);
			b = parseInt(b, 16);
			this.pdf.setFillColor(r, g, b);
			this.pdf.setTextColor(r, g, b);
		},

		setStrokeStyle : function(style) {
			if (style.charAt(0) != '#') {
				style = this.internal.colorNameToHex(style);
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
			this.pdf.text(text, x, this._getBaseline(y));
		},

		strokeText : function(text,x,y,maxWidth) {
			this.pdf.text(text, x, this._getBaseline(y), {
				stroke : true
			});
		},

		setFont : function(font) {
			this.ctx.font = font;
			var rx = /(\d+)pt\s+(\w+)\s*(\w+)?/;
			var m = rx.exec(font);
			var size = m[1];
			var name = m[2];
			var style = m[3];
			if (!style) {
				style = 'normal';
			}
			this.pdf.setFontSize(size);
			this.pdf.setFont(name, style);
		},

		setTextBaseline : function(baseline) {
			this.ctx.textBaseline = baseline;
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
			var obj = {
				type : 'mt',
				x : x,
				y : y
			};
			this.path.push(obj);
		},

		lineTo : function(x,y) {
			var obj = {
				type : 'lt',
				x : x,
				y : y
			};
			this.path.push(obj);
		},

		arc : function(x,y,radius,startAngle,endAngle,anticlockwise) {
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

		drawImage : function(img,x,y,w,h) {
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
				}
			}

			if (typeof start != 'undefined') {
				this.pdf.lines(deltas, start.x, start.y, null, 's');
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

	c2d.internal = {};

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

	c2d.internal.colorNameToHex = function(color) {
		var colors = {
			"aliceblue" : "#f0f8ff",
			"antiquewhite" : "#faebd7",
			"aqua" : "#00ffff",
			"aquamarine" : "#7fffd4",
			"azure" : "#f0ffff",
			"beige" : "#f5f5dc",
			"bisque" : "#ffe4c4",
			"black" : "#000000",
			"blanchedalmond" : "#ffebcd",
			"blue" : "#0000ff",
			"blueviolet" : "#8a2be2",
			"brown" : "#a52a2a",
			"burlywood" : "#deb887",
			"cadetblue" : "#5f9ea0",
			"chartreuse" : "#7fff00",
			"chocolate" : "#d2691e",
			"coral" : "#ff7f50",
			"cornflowerblue" : "#6495ed",
			"cornsilk" : "#fff8dc",
			"crimson" : "#dc143c",
			"cyan" : "#00ffff",
			"darkblue" : "#00008b",
			"darkcyan" : "#008b8b",
			"darkgoldenrod" : "#b8860b",
			"darkgray" : "#a9a9a9",
			"darkgreen" : "#006400",
			"darkkhaki" : "#bdb76b",
			"darkmagenta" : "#8b008b",
			"darkolivegreen" : "#556b2f",
			"darkorange" : "#ff8c00",
			"darkorchid" : "#9932cc",
			"darkred" : "#8b0000",
			"darksalmon" : "#e9967a",
			"darkseagreen" : "#8fbc8f",
			"darkslateblue" : "#483d8b",
			"darkslategray" : "#2f4f4f",
			"darkturquoise" : "#00ced1",
			"darkviolet" : "#9400d3",
			"deeppink" : "#ff1493",
			"deepskyblue" : "#00bfff",
			"dimgray" : "#696969",
			"dodgerblue" : "#1e90ff",
			"firebrick" : "#b22222",
			"floralwhite" : "#fffaf0",
			"forestgreen" : "#228b22",
			"fuchsia" : "#ff00ff",
			"gainsboro" : "#dcdcdc",
			"ghostwhite" : "#f8f8ff",
			"gold" : "#ffd700",
			"goldenrod" : "#daa520",
			"gray" : "#808080",
			"green" : "#008000",
			"greenyellow" : "#adff2f",
			"honeydew" : "#f0fff0",
			"hotpink" : "#ff69b4",
			"indianred " : "#cd5c5c",
			"indigo" : "#4b0082",
			"ivory" : "#fffff0",
			"khaki" : "#f0e68c",
			"lavender" : "#e6e6fa",
			"lavenderblush" : "#fff0f5",
			"lawngreen" : "#7cfc00",
			"lemonchiffon" : "#fffacd",
			"lightblue" : "#add8e6",
			"lightcoral" : "#f08080",
			"lightcyan" : "#e0ffff",
			"lightgoldenrodyellow" : "#fafad2",
			"lightgrey" : "#d3d3d3",
			"lightgreen" : "#90ee90",
			"lightpink" : "#ffb6c1",
			"lightsalmon" : "#ffa07a",
			"lightseagreen" : "#20b2aa",
			"lightskyblue" : "#87cefa",
			"lightslategray" : "#778899",
			"lightsteelblue" : "#b0c4de",
			"lightyellow" : "#ffffe0",
			"lime" : "#00ff00",
			"limegreen" : "#32cd32",
			"linen" : "#faf0e6",
			"magenta" : "#ff00ff",
			"maroon" : "#800000",
			"mediumaquamarine" : "#66cdaa",
			"mediumblue" : "#0000cd",
			"mediumorchid" : "#ba55d3",
			"mediumpurple" : "#9370d8",
			"mediumseagreen" : "#3cb371",
			"mediumslateblue" : "#7b68ee",
			"mediumspringgreen" : "#00fa9a",
			"mediumturquoise" : "#48d1cc",
			"mediumvioletred" : "#c71585",
			"midnightblue" : "#191970",
			"mintcream" : "#f5fffa",
			"mistyrose" : "#ffe4e1",
			"moccasin" : "#ffe4b5",
			"navajowhite" : "#ffdead",
			"navy" : "#000080",
			"oldlace" : "#fdf5e6",
			"olive" : "#808000",
			"olivedrab" : "#6b8e23",
			"orange" : "#ffa500",
			"orangered" : "#ff4500",
			"orchid" : "#da70d6",
			"palegoldenrod" : "#eee8aa",
			"palegreen" : "#98fb98",
			"paleturquoise" : "#afeeee",
			"palevioletred" : "#d87093",
			"papayawhip" : "#ffefd5",
			"peachpuff" : "#ffdab9",
			"peru" : "#cd853f",
			"pink" : "#ffc0cb",
			"plum" : "#dda0dd",
			"powderblue" : "#b0e0e6",
			"purple" : "#800080",
			"red" : "#ff0000",
			"rosybrown" : "#bc8f8f",
			"royalblue" : "#4169e1",
			"saddlebrown" : "#8b4513",
			"salmon" : "#fa8072",
			"sandybrown" : "#f4a460",
			"seagreen" : "#2e8b57",
			"seashell" : "#fff5ee",
			"sienna" : "#a0522d",
			"silver" : "#c0c0c0",
			"skyblue" : "#87ceeb",
			"slateblue" : "#6a5acd",
			"slategray" : "#708090",
			"snow" : "#fffafa",
			"springgreen" : "#00ff7f",
			"steelblue" : "#4682b4",
			"tan" : "#d2b48c",
			"teal" : "#008080",
			"thistle" : "#d8bfd8",
			"tomato" : "#ff6347",
			"turquoise" : "#40e0d0",
			"violet" : "#ee82ee",
			"wheat" : "#f5deb3",
			"white" : "#ffffff",
			"whitesmoke" : "#f5f5f5",
			"yellow" : "#ffff00",
			"yellowgreen" : "#9acd32"
		};

		if (typeof colors[color.toLowerCase()] != 'undefined')
			return colors[color.toLowerCase()];

		return false;
	};

	function context() {
		this.fillStyle = '#000000';
		this.strokeStyle = '#000000';
		this.font = "12pt times";
		this.textBaseline = 'alphabetic'; //top,bottom,middle,ideographic,alphabetic,hanging
		this.lineWidth = 1;
		this.lineJoin = 'miter'; //round, bevel, miter
		this.lineCap = 'butt'; //butt, round, square
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
		};
	}

	return this;
})(jsPDF.API);
