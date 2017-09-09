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
			var options = args.options || {};
			var tmp;
			var mutual = args.mutual || {};
			
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
				mutual: mutual
			}
		}
		
		//always in the first place
		jsPDF.FunctionsPool.text.unshift(
			backwardsCompatibilityFunction
		);
		
		var preprocessTextFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var mutual = args.mutual || {};
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
				mutual: mutual
			}
		}
		
		//always in the first place
		jsPDF.FunctionsPool.text.push(
			preprocessTextFunction
		);
		
		var angleFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var mutual = args.mutual || {};
			
			var angle = options.angle;
			var k = mutual.k;
			var curY = (mutual.pageHeight - y) * k;
			var transformationMatrix = [];
			
			if (angle) {
				angle *= (Math.PI / 180);
				var c = Math.cos(angle),
				s = Math.sin(angle);
				var f2 = function(number) {
					return number.toFixed(2); // Ie, %.2f
				}
				transformationMatrix = [f2(c), f2(s), f2(s * -1), f2(c), f2(x * k), f2(curY)];
				mutual.transformationMatrix = transformationMatrix;
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
			};
		}
		
		jsPDF.FunctionsPool.text.push(
			renderingModeFunction
		);
		
		var alignFunction = function (args) {
			var text = args.text;
			var x = args.x;
			var y = args.y;
			var options = args.options || {};
			var mutual = args.mutual || {};
			
			var align = options.align; 
			var leading = mutual.leading;
			var lineWidth = mutual.lineWidth;
			var k = mutual.k;
			
			var lineWidths = text.map(function(v) {
					return mutual.scope.getStringUnitWidth(v) * mutual.activeFontSize / k;
				}, mutual.scope)
				
			var flags = {};
			if (!('noBOM' in options))
			  flags.noBOM = true;
			if (!('autoencode' in options))
			  flags.autoencode = true;
			
        function ESC(s, options) {
			options = options || {};
          s = s.split("\t").join(Array(options.TabLen || 9).join(" "));
		  return s;
          return mutual.pdfEscape(s, flags);
        }
		
        if (typeof text === 'string') {
          text = ESC(text, options);
        } else if (Object.prototype.toString.call(text) ===
          '[object Array]') {
          // we don't want to destroy  original text array, so cloning it
          var sa = text.concat(),
            da = [],
            len = sa.length;
          // we do array.join('text that must not be PDFescaped")
          // thus, pdfEscape each component separately
          while (len--) {
            da.push(ESC(sa.shift(), options));
          }
          var linesLeft = Math.ceil((mutual.pageHeight - y - mutual.runningPageHeight) *
            k / (mutual.activeFontSize * mutual.lineHeightProportion));
          if (0 <= linesLeft && linesLeft < da.length + 1) {
            //todo = da.splice(linesLeft-1);
          }          
			
		if (align) {
            var left,
              prevX,
              maxLineLength;
            maxLineLength = Math.max.apply(Math, lineWidths);
            // The first line uses the "main" Td setting,
            // and the subsequent lines are offset by the
            // previous line's x coordinate.
            if (align === "center") {
              // The passed in x coordinate defines
              // the center point.
              left = x - maxLineLength / 2;
              x -= lineWidths[0] / 2;
            } else if (align === "right") {
              // The passed in x coordinate defines the
              // rightmost point of the text.
              left = x - maxLineLength;
              x -= lineWidths[0];
            } else {
              throw new Error(
                'Unrecognized alignment option, use "center" or "right".'
              );
            }
            prevX = x;
            text = da[0];
            for (var i = 1, len = da.length; i < len; i++) {
              var delta = maxLineLength - lineWidths[i];
              if (align === "center") delta /= 2;
              // T* = x-offset leading Td ( text )
              text += ") Tj\n" + ((left - prevX) + delta) + " -" + leading +
                " Td (" + da[i];
              prevX = left + delta;
            }
          } else {
            text = da.join(") Tj\nT* (");
          }
			return {
				text : text,
				x : x,
				y : y,
				options: options,
				mutual: mutual
			};
        } else {
          throw new Error('Type of text must be string or Array. "' + text +
            '" is not recognized.');
        }
		}
		
		
		jsPDF.FunctionsPool.text.push(
			alignFunction
		);
})(jsPDF.API);
