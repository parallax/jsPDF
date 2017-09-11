(function (jsPDFAPI) {
	'use strict';
	
		if (jsPDF.FunctionsPool === undefined) {
			jsPDF.FunctionsPool = {};
		}
		if (jsPDF.FunctionsPool.text === undefined) {
			jsPDF.FunctionsPool.text = {
				preProcess : [],
				process : [],
				postProcess : []
			};
		}
		
		var backwardsCompatibilityFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var tmp;
			var mutex = args.mutex || {};
			
			var flags = args.arguments[3];
			var angle = args.arguments[4];
			var align = args.arguments[5];
			
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
			
			if (typeof flags !== "object" || flags === null) {			
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
				mutex: mutex
			}
		}
		
		//always in the first place
		jsPDF.FunctionsPool.text.preProcess.unshift(
			backwardsCompatibilityFunction
		);
		
		var preprocessTextFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var mutex = args.mutex || {};
			// If there are any newlines in text, we assume
			// the user wanted to print multiple lines, so break the
			// text up into an array.  If the text is already an array,
			// we assume the user knows what they are doing.
			// Convert text into an array anyway to simplify
			// later code.
			if (typeof text === 'string') {
			  if (text.match(/[\n\r]/)) {
				text = text.split(/\r\n|\r|\n/g);
			  } else {
				text = [text];
			  }
			}
			return {
				text : text,
				x : x,
				y : y,
				options: options,
				mutex: mutex
			}
		}
		
		jsPDF.FunctionsPool.text.preProcess.push(
			preprocessTextFunction
		);
		
		var angleFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var mutex = args.mutex || {};
			
			var angle = options.angle;
			var k = mutex.k;
			var curY = (mutex.pageHeight - y) * k;
			var transformationMatrix = [];
			
			if (angle) {
				angle *= (Math.PI / 180);
				var c = Math.cos(angle),
				s = Math.sin(angle);
				var f2 = function(number) {
					return number.toFixed(2);
				}
				transformationMatrix = [f2(c), f2(s), f2(s * -1), f2(c)];
				mutex.transformationMatrix = transformationMatrix;
			}
			return {
				text : text,
				x : x,
				y : y,
				options: options,
				mutex: mutex
			}
		}
		
		jsPDF.FunctionsPool.text.process.push(
			angleFunction
		);
		
		var charSpaceFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var mutex = args.mutex || {};
			var charSpace = options.charSpace;
			
			if (charSpace) {
				mutex.charSpace = {
					renderer: function () {
						return charSpace +" Tc\n";
					}
				};
			}
			return {
				text : text,
				x : x,
				y : y,
				options: options,
				mutex: mutex
			}
		}
		
		jsPDF.FunctionsPool.text.process.push(
			charSpaceFunction
		);
		
		
		var langFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var mutex = args.mutex || {};
			var lang = options.lang;
			
			if (lang) {
				mutex.lang = {
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
				mutex: mutex
			}
		}
		
		jsPDF.FunctionsPool.text.process.push(
			langFunction
		);
		
		var renderingModeFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var mutex = args.mutex || {};
			
			var renderingMode = -1;
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
		  
			if (tmpRenderingMode !== -1) {
				mutex.renderingMode = {
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
				mutex: mutex
			};
		}
		
		jsPDF.FunctionsPool.text.process.push(
			renderingModeFunction
		);
		
		var alignFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var mutex = args.mutex || {};
			
			var align = options.align || 'left'; 
			var leading = mutex.activeFontSize * mutex.lineHeightProportion
			var pageHeight = mutex.pageHeight;
			var lineWidth = mutex.lineWidth;
			var k = mutex.k;

			if (typeof text === "string") {
				text = [text];
			}
			var lineWidths = text.map(function(v) {
					return mutex.scope.getStringUnitWidth(v) * mutex.activeFontSize / k;
				}, mutex.scope)
				
			var flags = {};
			if (!('noBOM' in options)) {
			  flags.noBOM = true;
			}
			if (!('autoencode' in options)) {
			  flags.autoencode = true;
			}
			
			function ESC(s, options) {
				options = options || {};
				  s = s.split("\t").join(Array(options.TabLen || 9).join(" "));
				  return s;
				  return mutex.pdfEscape(s, flags);
			}
			
			if (typeof text === 'string') {
			  text = ESC(text, options);
			} else if (Object.prototype.toString.call(text) === '[object Array]') {
			  // we don't want to destroy  original text array, so cloning it
			  var sa = text.concat(),
				da = [],
				len = sa.length,
				curDa;
			  // we do array.join('text that must not be PDFescaped")
			  // thus, pdfEscape each component separately
			  while (len--) {
				  curDa = sa.shift();
				  if (typeof curDa === "string") {
					da.push(ESC(curDa, options));
				  } else {
					da.push([ESC(curDa[0], options), curDa[1], curDa[2]]);
				  }
			  }
			  
			if (align !== 'right' || align !== 'center' || align !== 'left'){
				var left = 0;
				var newY;
				var maxLineLength;
				var maxLineLength = Math.max.apply(Math, lineWidths);
				mutex.maxLineLength = maxLineLength;
				// The first line uses the "main" Td setting,
				// and the subsequent lines are offset by the
				// previous line's x coordinate.
				var prevWidth = 0;
				var delta;
				var newX;
				if (align === "right") {
					// The passed in x coordinate defines the
					// rightmost point of the text.
					left = x - maxLineLength;
					x -= lineWidths[0];
					text = [];
					for (var i = 0, len = da.length; i < len; i++) {
					  delta = maxLineLength - lineWidths[i];
					  if (i === 0) {
						  newX = x*k;
						  newY = (pageHeight - y)*k;
					  } else {
						  newX = (prevWidth - lineWidths[i]) * k;
						  newY = -leading;
					  }
					  text.push([da[i], newX, newY]);
					  prevWidth = lineWidths[i];
					}
				}
				if (align === "center") {
					// The passed in x coordinate defines
					// the center point.
					left = x - maxLineLength / 2;
					x -= lineWidths[0] / 2;
					text = [];
					for (var i = 0, len = da.length; i < len; i++) {
					  delta = (maxLineLength - lineWidths[i]) / 2;
					  if (i === 0) {
						  newX = x*k;
						  newY = (pageHeight - y)*k;
					  } else {
						  newX = (prevWidth - lineWidths[i]) / 2 * k;
						  newY = -leading;
						  //prevX = newX;(left - prevX + delta)
					  }
					  text.push([da[i], newX, newY]);
					  prevWidth = lineWidths[i];
					}
				} 
				if (align === "left") {
					text = [];
					for (var i = 0, len = da.length; i < len; i++) {
						newY =  (i === 0) ? (pageHeight - y)*k : -leading;
						newX =  (i === 0) ? x*k : 0;
						text.push([da[i], newX, newY]);
					}
					
				}
			  } else {
				text = da;
			  }
			} else {
			  throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
			}
				return {
					text : text,
					x : x,
					y : y,
					options: options,
					mutex: mutex
				};
		}
		
		jsPDF.FunctionsPool.text.postProcess.push(
			alignFunction
		);
		
		
		var multilineFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var mutex = args.mutex || {};
			
			var align = options.align; 
			var leading = mutex.activeFontSize * mutex.lineHeightProportion;
			var lineWidth = mutex.lineWidth;
			var k = mutex.k;
						
			function ESC(s, options) {
				options = options || {};
				  s = s.split("\t").join(Array(options.TabLen || 9).join(" "));
				  return s;
				  return mutex.pdfEscape(s, flags);
			}
			
			if (typeof text === 'string') {
			  text = ESC(text, options);
			} else if (Object.prototype.toString.call(text) === '[object Array]') {
			  // we don't want to destroy  original text array, so cloning it
			  var sa = text.concat(),
				da = [],
				len = sa.length,
				curDa;
			  // we do array.join('text that must not be PDFescaped")
			  // thus, pdfEscape each component separately
			  while (len--) {
				  curDa = sa.shift();
				  if (typeof curDa === "string") {
					da.push(ESC(curDa, options));
				  } else {
					da.push([ESC(curDa[0], options), curDa[1], curDa[2]]);
				  }
			  }
				
				text = [];
				var variant = 0;
				var len = da.length;
				var posX;
				var posY;
				var content;
				
				for (var i = 0; i < len; i++) {
					if ((Object.prototype.toString.call(da[i]) !== '[object Array]')) {
						posX = (parseFloat(x)).toFixed(2);
						posY = (parseFloat(y)).toFixed(2);
						content = (((mutex.isHex) ? "<" : "(")) + da[i] + ((mutex.isHex) ? ">" : ")");
						
					} else if (Object.prototype.toString.call(da[i]) === '[object Array]') {
						posX = (parseFloat(da[i][1])).toFixed(2);
						posY = (parseFloat(da[i][2])).toFixed(2);
						content = (((mutex.isHex) ? "<" : "(")) + da[i][0] + ((mutex.isHex) ? ">" : ")");
						variant = 1;
					}
					//TODO: Kind of a hack?
					if (mutex.hasOwnProperty("transformationMatrix") && i === 0) {
						text.push(mutex.transformationMatrix.join(" ") + " " + posX + " " + posY + " Tm\n" + content);
					} else {
						text.push(posX  + " " + posY + " Td\n" + content);
					}
				}
				if (variant === 0) {
					text = text.join(" Tj\nT* ");
				} else {
					text = text.join(" Tj\n");
				}
			
				text +=  " Tj\n";
				mutex.processed = true;
				
			} else {
			  throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
			}
			return {
				text : text,
				x : x,
				y : y,
				options: options,
				mutex: mutex
			};
		}		
		
		jsPDF.FunctionsPool.text.postProcess.push(
			multilineFunction
		);
})(jsPDF.API);
