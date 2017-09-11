(function (jsPDFAPI) {
    'use strict';

    if (jsPDF.FunctionsPool === undefined) {
        jsPDF.FunctionsPool = {};
    }
    if (jsPDF.FunctionsPool.text === undefined) {
        jsPDF.FunctionsPool.text = {
            preProcess: [],
            process: [],
            postProcess: []
        };
    }

    /**
    Returns a widths of string in a given font, if the font size is set as 1 point.

    In other words, this is "proportional" value. For 1 unit of font size, the length
    of the string will be that much.

    Multiply by font size to get actual width in *points*
    Then divide by 72 to get inches or divide by (72/25.6) to get 'mm' etc.

    @public
    @function
    @param
    @returns {Type}
    */
    var getStringUnitWidth = function(text, options) {
        return getArraySum(getCharWidthsArray(text, options));
    }

    /**
    Returns an array of length matching length of the 'word' string, with each
    cell ocupied by the width of the char in that position.

    @function
    @param word {String}
    @param widths {Object}
    @param kerning {Object}
    @returns {Array}
    */
    function getCharWidthsArray(text, options) {
        options = options || {};

        var widths = options.widths ? options.widths : options.font.metadata.Unicode.widths;
        var widthsFractionOf = widths.fof ? widths.fof : 1;
        var kerning = options.kerning ? options.kerning : options.font.metadata.Unicode.kerning;
        var kerningFractionOf = kerning.fof ? kerning.fof : 1;

        var i;
        var l;
        var char_code;
        var prior_char_code = 0; //for kerning
        var default_char_width = widths[0] || widthsFractionOf;
        var output = [];

        for (i = 0, l = text.length; i < l; i++) {
            char_code = text.charCodeAt(i)
            output.push(
                ( widths[char_code] || default_char_width ) / widthsFractionOf +
                ( kerning[char_code] && kerning[char_code][prior_char_code] || 0 ) / kerningFractionOf
            );
            prior_char_code = char_code;
        }

        return output
    }

    var getArraySum = function(array) {
        var i = array.length;
        var output = 0;
        
        while(i) {
            ;i--;
            output += array[i];
        }
        
        return output;
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

        //Pre-August-2012 the order of arguments was function(x, y, text, flags)
        //in effort to make all calls have similar signature like
        //function(data, coordinates... , miscellaneous)
        //this method had its args flipped.
        //code below allows backward compatibility with old arg order.
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
            text: text,
            x: x,
            y: y,
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
        //If there are any newlines in text, we assume
        //the user wanted to print multiple lines, so break the
        //text up into an array. If the text is already an array,
        //we assume the user knows what they are doing.
        //Convert text into an array anyway to simplify
        //later code.
        if (typeof text === 'string') {
            if (text.match(/[\n\r]/)) {
                text = text.split(/\r\n|\r|\n/g);
            } else {
                text = [text];
            }
        }
        return {
            text: text,
            x: x,
            y: y,
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
            text: text,
            x: x,
            y: y,
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
            text: text,
            x: x,
            y: y,
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
            text: text,
            x: x,
            y: y,
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
        var tmpRenderingMode = -1;
        var parmRenderingMode = options.renderingMode || options.stroke;
        var pageContext = mutex.scope.internal.getCurrentPageInfo().pageContext;

        switch (parmRenderingMode) {
            case 0:
            case false:
            case 'fill':
                tmpRenderingMode = 0;
                break;
            case 1:
            case true:
            case 'stroke':
                tmpRenderingMode = 1;
                break;
            case 2:
            case 'fillThenStroke':
                tmpRenderingMode = 2;
                break;
            case 3:
            case 'invisible':
                tmpRenderingMode = 3;
                break;
            case 4:
            case 'fillAndAddForClipping':
                tmpRenderingMode = 4;
                break;
            case 5:
            case 'strokeAndAddPathForClipping':
                tmpRenderingMode = 5;
                break;
            case 6:
            case 'fillThenStrokeAndAddToPathForClipping':
                tmpRenderingMode = 6;
                break;
            case 7:
            case 'addToPathForClipping':
                tmpRenderingMode = 7;
                break;
            }
            
            var usedRenderingMode = pageContext.usedRenderingMode;

            mutex.renderingMode = {
                renderer: function () {
                    if ((tmpRenderingMode !== -1)) {
                        return tmpRenderingMode + " Tr\n";
                    } else if (usedRenderingMode !== -1) {
                        usedRenderingMode = 0;
                        return "0 Tr\n";
                    }
                    return "";
                }
            };

            if (tmpRenderingMode !== -1) {
                pageContext.usedRenderingMode = tmpRenderingMode;
            }
        return {
            text: text,
            x: x,
            y: y,
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
        var activeFont = mutex.fonts[mutex.activeFontKey];
        var k = mutex.k;
        var widths;
        
        if (typeof text === "string") {
            text = [text];
        }
        var lineWidths;
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
            //we don't want to destroy original text array, so cloning it
            var sa = text.concat();
            var da = [];
            var len = sa.length;
            var curDa;
            //we do array.join('text that must not be PDFescaped")
            //thus, pdfEscape each component separately
            while (len--) {
                curDa = sa.shift();
                if (typeof curDa === "string") {
                    da.push(ESC(curDa, options));
                } else {
                    da.push([ESC(curDa[0], options), curDa[1], curDa[2]]);
                }
            }

            if (align !== 'right' || align !== 'center' || align !== 'left') {
                var left = 0;
                var newY;
                var maxLineLength;
                var lineWidths;
                if (align !== "left") {
                    lineWidths = text.map(function(v) {
                        return getStringUnitWidth(v, {font: activeFont}) * mutex.activeFontSize / k;
                    });
                }
                var maxLineLength = Math.max.apply(Math, lineWidths);
                mutex.maxLineLength = maxLineLength;
                //The first line uses the "main" Td setting,
                //and the subsequent lines are offset by the
                //previous line's x coordinate.
                var prevWidth = 0;
                var delta;
                var newX;
                if (align === "right") {
                    //The passed in x coordinate defines the
                    //rightmost point of the text.
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
                    //The passed in x coordinate defines
                    //the center point.
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
                        }
                        text.push([da[i], newX, newY]);
                        prevWidth = lineWidths[i];
                    }
                }
                if (align === "left") {
                    text = [];
                    for (var i = 0, len = da.length; i < len; i++) {
                        newY = (i === 0) ? (pageHeight - y)*k : -leading;
                        newX = (i === 0) ? x*k : 0;
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
            text: text,
            x: x,
            y: y,
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
            return mutex.pdfEscape(s, options);
        }

        if (typeof text === 'string') {
            text = ESC(text, options);
        } else if (Object.prototype.toString.call(text) === '[object Array]') {
        //we don't want to destroy original text array, so cloning it
        var sa = text.concat();
        var da = [];
        var len = sa.length;
        var curDa;
        //we do array.join('text that must not be PDFescaped")
        //thus, pdfEscape each component separately
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
                    text.push(posX + " " + posY + " Td\n" + content);
                }
            }
            if (variant === 0) {
                text = text.join(" Tj\nT* ");
            } else {
                text = text.join(" Tj\n");
            }

            text += " Tj\n";
            mutex.processed = true;
            
        } else {
            throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
        }
        return {
            text: text,
            x: x,
            y: y,
            options: options,
            mutex: mutex
        };
    }

    jsPDF.FunctionsPool.text.postProcess.push(
        multilineFunction
    );
})(jsPDF.API);
