(function (jsPDFAPI) {
	'use strict';
	
		if (jsPDF.FunctionsPool === undefined) {
			jsPDF.FunctionsPool = {};
		}
		if (jsPDF.FunctionsPool.text === undefined) {
			jsPDF.FunctionsPool.text = [];
		}
		
		var backwardsCompatibilityFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var flags = args.options;
			var options = args.options || {};
			var tmp;
			var mutual = args.mutual || {};
		
			// Pre-August-2012 the order of arguments was function(x, y, text, flags)
			// in effort to make all calls have similar signature like
			//   function(data, coordinates... , miscellaneous)
			// this method had its args flipped.
			// code below allows backward compatibility with old arg order.
			if (typeof text === 'number') {
			  tmp = y;
			  y = x;
			  x = text;
			  text = tmp;
			}
			
			if (typeof flags !== "object") {
			
				if (typeof angle === 'string') {
				  align = angle;
				  angle = null;
				}
				if (typeof flags === 'string') {
				  align = flags;
				  flags = null;
				}
				if (typeof flags === 'number') {
				  angle = flags;
				  flags = null;
				}
				options = {flags: flags, angle: angle, align: align};
			}
			return {
				text : text,
				x : x,
				y : y,
				options: options,
				mutual: mutual
			}
		}
		//always in the first place
		jsPDF.FunctionsPool.text.unshift(
			backwardsCompatibilityFunction
		);
		
		var angleFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var mutual = args.mutual || {};
			
			var angle = options.angle;
				
			var f2 = function(number) {
				return number.toFixed(2); // Ie, %.2f
			}
			
			if (angle) {
				angle *= (Math.PI / 180);
				var c = Math.cos(angle),
				s = Math.sin(angle);
				mutual.angle = {
					renderer: function () {
						return "Tm " + [f2(c), f2(s), f2(s * -1), f2(c), ''].join(" ") + "\n";
					}
				};
			}
			return {
				text : text,
				x : x,
				y : y,
				options: options,
				mutual: mutual
			}
		}
		
		jsPDF.FunctionsPool.text.push(
			angleFunction
		);
		
		var langFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var mutual = args.mutual || {};
			var lang = options.lang;
			
			if (lang) {
				mutual.lang = {
					renderer: function () {
						return "/Lang (" + lang +")\n";
					}
				};
			}
			return {
				text : text,
				x : x,
				y : y,
				options: options,
				mutual: mutual
			}
		}
		
		jsPDF.FunctionsPool.text.push(
			langFunction
		);
		
		var renderingModeFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var mutual = args.mutual || {};
			
			var renderingMode = 0;
			var tmpRenderingMode = options.renderingMode || options.stroke;
			
			switch (tmpRenderingMode) {
				case 0:
				case false:
				case 'fill':
				  renderingMode = 0;
				  break;
				case 1:
				case true:
				case 'stroke':
				  renderingMode = 1;
				  break;
				case 2:
				case 'fillThenStroke':
				  renderingMode = 2;
				  break;
				case 3:
				case 'invisible':
				  renderingMode = 3;
				  break;
				case 4:
				case 'fillAndAddForClipping':
				  renderingMode = 4;
				  break;
				case 5:
				case 'strokeAndAddPathForClipping':
				  renderingMode = 5;
				  break;
				case 6:
				case 'fillThenStrokeAndAddToPathForClipping':
				  renderingMode = 6;
				  break;
				case 7:
				case 'addToPathForClipping':
				  renderingMode = 7;
				  break;
				default: 
				  renderingMode = 0;
				  break;
			  }
		  
			if (tmpRenderingMode) {
				mutual.renderingMode = {
					renderer: function () {
						return renderingMode + " Tr\n";
					}
				};
			}
			return {
				text : text,
				x : x,
				y : y,
				options: options,
				mutual: mutual
			}
		}
		
		jsPDF.FunctionsPool.text.push(
			renderingModeFunction
		);
})(jsPDF.API);
