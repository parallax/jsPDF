/** @preserve jsPDF 0.9.0rc2 ( ${buildDate} ${commitID} )
Copyright (c) 2010-2012 James Hall, james@snapshotmedia.co.uk, https://github.com/MrRio/jsPDF
Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
MIT license.
*/

/*
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */


/**
Creates new jsPDF document object instance
@class
@param orientation One of "portrait" or "landscape" (or shortcuts "p" (Default), "l")
@param unit Measurement unit to be used when coordinates are specified. One of "pt" (points), "mm" (Default), "cm", "in"
@param format One of 'a3', 'a4' (Default),'a5' ,'letter' ,'legal'
@returns {jsPDF}
@name jsPDF
*/
var jsPDF = (function () {
    'use strict';
    /*jslint browser:true, plusplus: true, bitwise: true, nomen: true */
    /*global document: false, btoa, atob, zpipe, Uint8Array, ArrayBuffer, Blob, saveAs, adler32cs, Deflater */

// this will run on <=IE9, possibly some niche browsers
// new webkit-based, FireFox, IE10 already have native version of this.
    if (typeof btoa === 'undefined') {
        window.btoa = function (data) {
        // DO NOT ADD UTF8 ENCODING CODE HERE!!!!

        // UTF8 encoding encodes bytes over char code 128
        // and, essentially, turns an 8-bit binary streams
        // (that base64 can deal with) into 7-bit binary streams.
        // (by default server does not know that and does not recode the data back to 8bit)
        // You destroy your data.

        // binary streams like jpeg image data etc, while stored in JavaScript strings,
        // (which are 16bit arrays) are in 8bit format already.
        // You do NOT need to char-encode that before base64 encoding.

        // if you, by act of fate
        // have string which has individual characters with code
        // above 255 (pure unicode chars), encode that BEFORE you base64 here.
        // you can use absolutely any approch there, as long as in the end,
        // base64 gets an 8bit (char codes 0 - 255) stream.
        // when you get it on the server after un-base64, you must
        // UNencode it too, to get back to 16, 32bit or whatever original bin stream.

        // Note, Yes, JavaScript strings are, in most cases UCS-2 -
        // 16-bit character arrays. This does not mean, however,
        // that you always have to UTF8 it before base64.
        // it means that if you have actual characters anywhere in
        // that string that have char code above 255, you need to
        // recode *entire* string from 16-bit (or 32bit) to 8-bit array.
        // You can do binary split to UTF16 (BE or LE)
        // you can do utf8, you can split the thing by hand and prepend BOM to it,
        // but whatever you do, make sure you mirror the opposite on
        // the server. If server does not expect to post-process un-base64
        // 8-bit binary stream, think very very hard about messing around with encoding.

        // so, long story short:
        // DO NOT ADD UTF8 ENCODING CODE HERE!!!!

        /* @preserve
        ====================================================================
        base64 encoder
        MIT, GPL

        version: 1109.2015
        discuss at: http://phpjs.org/functions/base64_encode
        +   original by: Tyler Akins (http://rumkin.com)
        +   improved by: Bayron Guevara
        +   improved by: Thunder.m
        +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        +   bugfixed by: Pellentesque Malesuada
        +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        +   improved by: Rafal Kukawski (http://kukawski.pl)
        +                Daniel Dotsenko, Willow Systems Corp, willow-systems.com
        ====================================================================
        */

            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                b64a = b64.split(''),
                o1,
                o2,
                o3,
                h1,
                h2,
                h3,
                h4,
                bits,
                i = 0,
                ac = 0,
                enc = "",
                tmp_arr = [],
                r;

            do { // pack three octets into four hexets
                o1 = data.charCodeAt(i++);
                o2 = data.charCodeAt(i++);
                o3 = data.charCodeAt(i++);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                // use hexets to index into b64, and append result to encoded string
                tmp_arr[ac++] = b64a[h1] + b64a[h2] + b64a[h3] + b64a[h4];
            } while (i < data.length);

            enc = tmp_arr.join('');
            r = data.length % 3;
            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
            // end of base64 encoder MIT, GPL
        };
    }

    if (typeof atob === 'undefined') {
        window.atob = function (data) {
        // http://kevin.vanzonneveld.net
        // +   original by: Tyler Akins (http://rumkin.com)
        // +   improved by: Thunder.m
        // +      input by: Aman Gupta
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Onno Marsman
        // +   bugfixed by: Pellentesque Malesuada
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
        // *     returns 1: 'Kevin van Zonneveld'
        // mozilla has this native
        // - but breaks in 2.0.0.12!
        //if (typeof this.window['atob'] == 'function') {
        //    return atob(data);
        //}
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                o1,
                o2,
                o3,
                h1,
                h2,
                h3,
                h4,
                bits,
                i = 0,
                ac = 0,
                dec = "",
                tmp_arr = [];

            if (!data) {
                return data;
            }

            data += '';

            do { // unpack four hexets into three octets using index points in b64
                h1 = b64.indexOf(data.charAt(i++));
                h2 = b64.indexOf(data.charAt(i++));
                h3 = b64.indexOf(data.charAt(i++));
                h4 = b64.indexOf(data.charAt(i++));

                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                o1 = bits >> 16 & 0xff;
                o2 = bits >> 8 & 0xff;
                o3 = bits & 0xff;

                if (h3 === 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1);
                } else if (h4 === 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2);
                } else {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                }
            } while (i < data.length);
            dec = tmp_arr.join('');
            return dec;
        };
    }

    var getObjectLength = typeof Object.keys === 'function' ?
                function (object) {
                    return Object.keys(object).length;
                } :
                function (object) {
                    var i = 0, e;
                    for (e in object) {
                        if (object.hasOwnProperty(e)) {
                            i++;
                        }
                    }
                    return i;
                },

/**
PubSub implementation

@class
@name PubSub
*/
        PubSub = function (context) {
            /**  @preserve
            -----------------------------------------------------------------------------------------------
            JavaScript PubSub library
            2012 (c) ddotsenko@willowsystems.com
            based on Peter Higgins (dante@dojotoolkit.org)
            Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.
            Original is (c) Dojo Foundation 2004-2010. Released under either AFL or new BSD, see:
            http://dojofoundation.org/license for more information.
            -----------------------------------------------------------------------------------------------
            */
            /**
            @private
            @fieldOf PubSub
            */
            this.topics = {};
            /**
            Stores what will be `this` within the callback functions.

            @private
            @fieldOf PubSub#
            */
            this.context = context;
            /**
            Allows caller to emit an event and pass arguments to event listeners.
            @public
            @function
            @param topic {String} Name of the channel on which to voice this event
            @param args Any number of arguments you want to pass to the listeners of this event.
            @methodOf PubSub#
            @name publish
            */
            this.publish = function (topic, args) {
                if (this.topics[topic]) {
                    var currentTopic = this.topics[topic],
                        toremove = [],
                        fn,
                        i,
                        l,
                        pair,
                        emptyFunc = function () {};
                    args = Array.prototype.slice.call(arguments, 1);
                    for (i = 0, l = currentTopic.length; i < l; i++) {
                        pair = currentTopic[i]; // this is a [function, once_flag] array
                        fn = pair[0];
                        if (pair[1]) { /* 'run once' flag set */
                            pair[0] = emptyFunc;
                            toremove.push(i);
                        }
                        fn.apply(this.context, args);
                    }
                    for (i = 0, l = toremove.length; i < l; i++) {
                        currentTopic.splice(toremove[i], 1);
                    }
                }
            };
            /**
            Allows listener code to subscribe to channel and be called when data is available
            @public
            @function
            @param topic {String} Name of the channel on which to voice this event
            @param callback {Function} Executable (function pointer) that will be ran when event is voiced on this channel.
            @param once {Boolean} (optional. False by default) Flag indicating if the function is to be triggered only once.
            @returns {Object} A token object that cen be used for unsubscribing.
            @methodOf PubSub#
            @name subscribe
            */
            this.subscribe = function (topic, callback, once) {
                if (!this.topics[topic]) {
                    this.topics[topic] = [[callback, once]];
                } else {
                    this.topics[topic].push([callback, once]);
                }
                return {
                    "topic": topic,
                    "callback": callback
                };
            };
            /**
            Allows listener code to unsubscribe from a channel
            @public
            @function
            @param token {Object} A token object that was returned by `subscribe` method
            @methodOf PubSub#
            @name unsubscribe
            */
            this.unsubscribe = function (token) {
                if (this.topics[token.topic]) {
                    var currentTopic = this.topics[token.topic], i, l;

                    for (i = 0, l = currentTopic.length; i < l; i++) {
                        if (currentTopic[i][0] === token.callback) {
                            currentTopic.splice(i, 1);
                        }
                    }
                }
            };
        };


/**
@constructor
@private
*/
    function jsPDF(orientation, unit, format, compressPdf) { /** String orientation, String unit, String format, Boolean compressed */

        // Default parameter values
        if (typeof orientation === 'undefined') {
            orientation = 'p';
        } else {
            orientation = orientation.toString().toLowerCase();
        }
        if (typeof unit === 'undefined') { unit = 'mm'; }
        if (typeof format === 'undefined') { format = 'a4'; }
        if (typeof compressPdf === 'undefined' && typeof zpipe === 'undefined') { compressPdf = false; }

        var format_as_string = format.toString().toLowerCase(),
            version = '0.9.0rc2',
            content = [],
            content_length = 0,
            compress = compressPdf,
            pdfVersion = '1.3', // PDF Version
            pageFormats = { // Size in pt of various paper formats
                'a3': [841.89, 1190.55],
                'a4': [595.28, 841.89],
                'a5': [420.94, 595.28],
                'letter': [612, 792],
                'legal': [612, 1008]
            },
            textColor = '0 g',
            drawColor = '0 G',
            page = 0,
            pages = [],
            objectNumber = 2, // 'n' Current object number
            outToPages = false, // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
            offsets = [], // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
            fonts = {}, // collection of font objects, where key is fontKey - a dynamically created label for a given font.
            fontmap = {}, // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
            activeFontSize = 16,
            activeFontKey, // will be string representing the KEY of the font as combination of fontName + fontStyle
            lineWidth = 0.200025, // 2mm
            pageHeight,
            pageWidth,
            k, // Scale factor
            documentProperties = {'title': '', 'subject': '', 'author': '', 'keywords': '', 'creator': ''},
            lineCapID = 0,
            lineJoinID = 0,
            API = {},
            events = new PubSub(API),
            tmp,
            plugin,
            /////////////////////
            // Private functions
            /////////////////////
            // simplified (speedier) replacement for sprintf's %.2f conversion
            f2 = function (number) {
                return number.toFixed(2);
            },
            // simplified (speedier) replacement for sprintf's %.3f conversion
            f3 = function (number) {
                return number.toFixed(3);
            },
            // simplified (speedier) replacement for sprintf's %02d
            padd2 = function (number) {
                var n = (number).toFixed(0);
                if (number < 10) {
                    return '0' + n;
                } else {
                    return n;
                }
            },
            // simplified (speedier) replacement for sprintf's %02d
            padd10 = function (number) {
                var n = (number).toFixed(0);
                if (n.length < 10) {
                    return new Array( 11 - n.length ).join('0') + n;
                } else {
                    return n;
                }
            },
            out = function (string) {
                if (outToPages) { /* set by beginPage */
                    pages[page].push(string);
                } else {
                    content.push(string);
                    content_length += string.length + 1; // +1 is for '\n' that will be used to join contents of content
                }
            },
            newObject = function () {
                // Begin a new object
                objectNumber++;
                offsets[objectNumber] = content_length;
                out(objectNumber + ' 0 obj');
                return objectNumber;
            },
            putStream = function (str) {
                out('stream');
                out(str);
                out('endstream');
            },
            wPt,
            hPt,
            kids,
            i,
            putPages = function () {
                wPt = pageWidth * k;
                hPt = pageHeight * k;

                // outToPages = false as set in endDocument(). out() writes to content.

                var n, p, arr, uint, i, deflater, adler32;
                for (n = 1; n <= page; n++) {
                    newObject();
                    out('<</Type /Page');
                    out('/Parent 1 0 R');
                    out('/Resources 2 0 R');
                    out('/Contents ' + (objectNumber + 1) + ' 0 R>>');
                    out('endobj');

                    // Page content
                    p = pages[n].join('\n');
                    newObject();
                    if (compress) {
                        arr = [];
                        for (i = 0; i < p.length; ++i) {
                            arr[i] = p.charCodeAt(i);
                        }
                        adler32 = adler32cs.from(p);
                        deflater = new Deflater(6);
                        deflater.append(new Uint8Array(arr));
                        p = deflater.flush();
                        arr = [new Uint8Array([120, 156]), new Uint8Array(p),
                               new Uint8Array([adler32 & 0xFF, (adler32 >> 8) & 0xFF, (adler32 >> 16) & 0xFF, (adler32 >> 24) & 0xFF])];
                        p = '';
                        for (i in arr) {
                            if (arr.hasOwnProperty(i)) {
                                p += String.fromCharCode.apply(null, arr[i]);
                            }
                        }
                        out('<</Length ' + p.length  + ' /Filter [/FlateDecode]>>');
                    } else {
                        out('<</Length ' + p.length  + '>>');
                    }
                    putStream(p);
                    out('endobj');
                }
                offsets[1] = content_length;
                out('1 0 obj');
                out('<</Type /Pages');
                kids = '/Kids [';
                for (i = 0; i < page; i++) {
                    kids += (3 + 2 * i) + ' 0 R ';
                }
                out(kids + ']');
                out('/Count ' + page);
                out('/MediaBox [0 0 ' + f2(wPt) + ' ' + f2(hPt) + ']');
                out('>>');
                out('endobj');
            },
            putFont = function (font) {
                font.objectNumber = newObject();
                out('<</BaseFont/' + font.PostScriptName + '/Type/Font');
                if (typeof font.encoding === 'string') {
                    out('/Encoding/' + font.encoding);
                }
                out('/Subtype/Type1>>');
                out('endobj');
            },
            putFonts = function () {
                var fontKey;
                for (fontKey in fonts) {
                    if (fonts.hasOwnProperty(fontKey)) {
                        putFont(fonts[fontKey]);
                    }
                }
            },
            putXobjectDict = function () {
                // Loop through images, or other data objects
                events.publish('putXobjectDict');
            },
            putResourceDictionary = function () {
                out('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]');
                out('/Font <<');
                // Do this for each font, the '1' bit is the index of the font
                var fontKey;
                for (fontKey in fonts) {
                    if (fonts.hasOwnProperty(fontKey)) {
                        out('/' + fontKey + ' ' + fonts[fontKey].objectNumber + ' 0 R');
                    }
                }
                out('>>');
                out('/XObject <<');
                putXobjectDict();
                out('>>');
            },
            putResources = function () {
                putFonts();
                events.publish('putResources');
                // Resource dictionary
                offsets[2] = content_length;
                out('2 0 obj');
                out('<<');
                putResourceDictionary();
                out('>>');
                out('endobj');
                events.publish('postPutResources');
            },
            addToFontDictionary = function (fontKey, fontName, fontStyle) {
                // this is mapping structure for quick font key lookup.
                // returns the KEY of the font (ex: "F1") for a given pair of font name and type (ex: "Arial". "Italic")
                var undef;
                if (fontmap[fontName] === undef) {
                    fontmap[fontName] = {}; // fontStyle is a var interpreted and converted to appropriate string. don't wrap in quotes.
                }
                fontmap[fontName][fontStyle] = fontKey;
            },
            /**
            FontObject describes a particular font as member of an instnace of jsPDF

            It's a collection of properties like 'id' (to be used in PDF stream),
            'fontName' (font's family name), 'fontStyle' (font's style variant label)

            @class
            @public
            @property id {String} PDF-document-instance-specific label assinged to the font.
            @property PostScriptName {String} PDF specification full name for the font
            @property encoding {Object} Encoding_name-to-Font_metrics_object mapping.
            @name FontObject
            */
            FontObject = {},
            addFont = function (PostScriptName, fontName, fontStyle, encoding) {
                var fontKey = 'F' + (getObjectLength(fonts) + 1).toString(10),
                    // This is FontObject
                    font = fonts[fontKey] = {
                        'id': fontKey,
                        // , 'objectNumber':   will be set by putFont()
                        'PostScriptName': PostScriptName,
                        'fontName': fontName,
                        'fontStyle': fontStyle,
                        'encoding': encoding,
                        'metadata': {}
                    };

                addToFontDictionary(fontKey, fontName, fontStyle);

                events.publish('addFont', font);

                return fontKey;
            },
            addFonts = function () {

                var HELVETICA = "helvetica",
                    TIMES = "times",
                    COURIER = "courier",
                    NORMAL = "normal",
                    BOLD = "bold",
                    ITALIC = "italic",
                    BOLD_ITALIC = "bolditalic",
                    encoding = 'StandardEncoding',
                    standardFonts = [
                        ['Helvetica', HELVETICA, NORMAL],
                        ['Helvetica-Bold', HELVETICA, BOLD],
                        ['Helvetica-Oblique', HELVETICA, ITALIC],
                        ['Helvetica-BoldOblique', HELVETICA, BOLD_ITALIC],
                        ['Courier', COURIER, NORMAL],
                        ['Courier-Bold', COURIER, BOLD],
                        ['Courier-Oblique', COURIER, ITALIC],
                        ['Courier-BoldOblique', COURIER, BOLD_ITALIC],
                        ['Times-Roman', TIMES, NORMAL],
                        ['Times-Bold', TIMES, BOLD],
                        ['Times-Italic', TIMES, ITALIC],
                        ['Times-BoldItalic', TIMES, BOLD_ITALIC]
                    ],
                    i,
                    l,
                    fontKey,
                    parts;
                for (i = 0, l = standardFonts.length; i < l; i++) {
                    fontKey = addFont(
                        standardFonts[i][0],
                        standardFonts[i][1],
                        standardFonts[i][2],
                        encoding
                    );

                    // adding aliases for standard fonts, this time matching the capitalization
                    parts = standardFonts[i][0].split('-');
                    addToFontDictionary(fontKey, parts[0], parts[1] || '');
                }

                events.publish('addFonts', {'fonts': fonts, 'dictionary': fontmap});
            },
            /**

            @public
            @function
            @param text {String}
            @param flags {Object} Encoding flags.
            @returns {String} Encoded string
            */
            to8bitStream = function (text, flags) {
                /* PDF 1.3 spec:
                "For text strings encoded in Unicode, the first two bytes must be 254 followed by
                255, representing the Unicode byte order marker, U+FEFF. (This sequence conflicts
                with the PDFDocEncoding character sequence thorn ydieresis, which is unlikely
                to be a meaningful beginning of a word or phrase.) The remainder of the
                string consists of Unicode character codes, according to the UTF-16 encoding
                specified in the Unicode standard, version 2.0. Commonly used Unicode values
                are represented as 2 bytes per character, with the high-order byte appearing first
                in the string."

                In other words, if there are chars in a string with char code above 255, we
                recode the string to UCS2 BE - string doubles in length and BOM is prepended.

                HOWEVER!
                Actual *content* (body) text (as opposed to strings used in document properties etc)
                does NOT expect BOM. There, it is treated as a literal GID (Glyph ID)

                Because of Adobe's focus on "you subset your fonts!" you are not supposed to have
                a font that maps directly Unicode (UCS2 / UTF16BE) code to font GID, but you could
                fudge it with "Identity-H" encoding and custom CIDtoGID map that mimics Unicode
                code page. There, however, all characters in the stream are treated as GIDs,
                including BOM, which is the reason we need to skip BOM in content text (i.e. that
                that is tied to a font).

                To signal this "special" PDFEscape / to8bitStream handling mode,
                API.text() function sets (unless you overwrite it with manual values
                given to API.text(.., flags) )
                    flags.autoencode = true
                    flags.noBOM = true

                */

                /*
                `flags` properties relied upon:
                .sourceEncoding = string with encoding label.
                    "Unicode" by default. = encoding of the incoming text.
                    pass some non-existing encoding name
                    (ex: 'Do not touch my strings! I know what I am doing.')
                    to make encoding code skip the encoding step.
                .outputEncoding = Either valid PDF encoding name
                    (must be supported by jsPDF font metrics, otherwise no encoding)
                    or a JS object, where key = sourceCharCode, value = outputCharCode
                    missing keys will be treated as: sourceCharCode === outputCharCode
                .noBOM
                    See comment higher above for explanation for why this is important
                .autoencode
                    See comment higher above for explanation for why this is important
                */

                var i, l, undef, sourceEncoding, encodingBlock, outputEncoding, newtext, isUnicode, ch, bch;

                if (flags === undef) {
                    flags = {};
                }

                sourceEncoding = flags.sourceEncoding ? sourceEncoding : 'Unicode';

                outputEncoding = flags.outputEncoding;

                // This 'encoding' section relies on font metrics format
                // attached to font objects by, among others,
                // "Willow Systems' standard_font_metrics plugin"
                // see jspdf.plugin.standard_font_metrics.js for format
                // of the font.metadata.encoding Object.
                // It should be something like
                //   .encoding = {'codePages':['WinANSI....'], 'WinANSI...':{code:code, ...}}
                //   .widths = {0:width, code:width, ..., 'fof':divisor}
                //   .kerning = {code:{previous_char_code:shift, ..., 'fof':-divisor},...}
                if ((flags.autoencode || outputEncoding) &&
                        fonts[activeFontKey].metadata &&
                        fonts[activeFontKey].metadata[sourceEncoding] &&
                        fonts[activeFontKey].metadata[sourceEncoding].encoding
                        ) {
                    encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding;

                    // each font has default encoding. Some have it clearly defined.
                    if (!outputEncoding && fonts[activeFontKey].encoding) {
                        outputEncoding = fonts[activeFontKey].encoding;
                    }

                    // Hmmm, the above did not work? Let's try again, in different place.
                    if (!outputEncoding && encodingBlock.codePages) {
                        outputEncoding = encodingBlock.codePages[0]; // let's say, first one is the default
                    }

                    if (typeof outputEncoding === 'string') {
                        outputEncoding = encodingBlock[outputEncoding];
                    }
                    // we want output encoding to be a JS Object, where
                    // key = sourceEncoding's character code and
                    // value = outputEncoding's character code.
                    if (outputEncoding) {
                        isUnicode = false;
                        newtext = [];
                        for (i = 0, l = text.length; i < l; i++) {
                            ch = outputEncoding[text.charCodeAt(i)];
                            if (ch) {
                                newtext.push(
                                    String.fromCharCode(ch)
                                );
                            } else {
                                newtext.push(
                                    text[i]
                                );
                            }

                            // since we are looping over chars anyway, might as well
                            // check for residual unicodeness
                            if (newtext[i].charCodeAt(0) >> 8) { /* more than 255 */
                                isUnicode = true;
                            }
                        }
                        text = newtext.join('');
                    }
                }

                i = text.length;
                // isUnicode may be set to false above. Hence the triple-equal to undefined
                while (isUnicode === undef && i !== 0) {
                    if (text.charCodeAt(i - 1) >> 8) { /* more than 255 */
                        isUnicode = true;
                    }
                    i--;
                }
                if (!isUnicode) {
                    return text;
                } else {
                    newtext = flags.noBOM ? [] : [254, 255];
                    for (i = 0, l = text.length; i < l; i++) {
                        ch = text.charCodeAt(i);
                        bch = ch >> 8; // divide by 256
                        if (bch >> 8) { /* something left after dividing by 256 second time */
                            throw new Error("Character at position " + i.toString(10) + " of string '" + text + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
                        }
                        newtext.push(bch);
                        newtext.push(ch - (bch << 8));
                    }
                    return String.fromCharCode.apply(undef, newtext);
                }
            },
            // Replace '/', '(', and ')' with pdf-safe versions
            pdfEscape = function (text, flags) {
                // doing to8bitStream does NOT make this PDF display unicode text. For that
                // we also need to reference a unicode font and embed it - royal pain in the rear.

                // There is still a benefit to to8bitStream - PDF simply cannot handle 16bit chars,
                // which JavaScript Strings are happy to provide. So, while we still cannot display
                // 2-byte characters property, at least CONDITIONALLY converting (entire string containing)
                // 16bit chars to (USC-2-BE) 2-bytes per char + BOM streams we ensure that entire PDF
                // is still parseable.
                // This will allow immediate support for unicode in document properties strings.
                return to8bitStream(text, flags).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
            },
            putInfo = function () {
                out('/Producer (jsPDF ' + version + ')');
                if (documentProperties.title) {
                    out('/Title (' + pdfEscape(documentProperties.title) + ')');
                }
                if (documentProperties.subject) {
                    out('/Subject (' + pdfEscape(documentProperties.subject) + ')');
                }
                if (documentProperties.author) {
                    out('/Author (' + pdfEscape(documentProperties.author) + ')');
                }
                if (documentProperties.keywords) {
                    out('/Keywords (' + pdfEscape(documentProperties.keywords) + ')');
                }
                if (documentProperties.creator) {
                    out('/Creator (' + pdfEscape(documentProperties.creator) + ')');
                }
                var created = new Date();
                out('/CreationDate (D:' +
                    [
                        created.getFullYear(),
                        padd2(created.getMonth() + 1),
                        padd2(created.getDate()),
                        padd2(created.getHours()),
                        padd2(created.getMinutes()),
                        padd2(created.getSeconds())
                    ].join('') +
                    ')'
                    );
            },
            putCatalog = function () {
                out('/Type /Catalog');
                out('/Pages 1 0 R');
                // @TODO: Add zoom and layout modes
                out('/OpenAction [3 0 R /FitH null]');
                out('/PageLayout /OneColumn');
                events.publish('putCatalog');
            },
            putTrailer = function () {
                out('/Size ' + (objectNumber + 1));
                out('/Root ' + objectNumber + ' 0 R');
                out('/Info ' + (objectNumber - 1) + ' 0 R');
            },
            beginPage = function () {
                page++;
                // Do dimension stuff
                outToPages = true;
                pages[page] = [];
            },
            _addPage = function () {
                beginPage();
                // Set line width
                out(f2(lineWidth * k) + ' w');
                // Set draw color
                out(drawColor);
                // resurrecting non-default line caps, joins
                if (lineCapID !== 0) {
                    out(lineCapID.toString(10) + ' J');
                }
                if (lineJoinID !== 0) {
                    out(lineJoinID.toString(10) + ' j');
                }
                events.publish('addPage', {'pageNumber': page});
            },
            /**
            Returns a document-specific font key - a label assigned to a
            font name + font type combination at the time the font was added
            to the font inventory.

            Font key is used as label for the desired font for a block of text
            to be added to the PDF document stream.
            @private
            @function
            @param fontName {String} can be undefined on "falthy" to indicate "use current"
            @param fontStyle {String} can be undefined on "falthy" to indicate "use current"
            @returns {String} Font key.
            */
            getFont = function (fontName, fontStyle) {
                var key, undef;

                if (fontName === undef) {
                    fontName = fonts[activeFontKey].fontName;
                }
                if (fontStyle === undef) {
                    fontStyle = fonts[activeFontKey].fontStyle;
                }

                try {
                    key = fontmap[fontName][fontStyle]; // returns a string like 'F3' - the KEY corresponding tot he font + type combination.
                } catch (e) {
                    key = undef;
                }
                if (!key) {
                    throw new Error("Unable to look up font label for font '" + fontName + "', '" + fontStyle + "'. Refer to getFontList() for available fonts.");
                }

                return key;
            },
            buildDocument = function () {

                outToPages = false; // switches out() to content
                content = [];
                offsets = [];

                // putHeader()
                out('%PDF-' + pdfVersion);

                putPages();

                putResources();

                // Info
                newObject();
                out('<<');
                putInfo();
                out('>>');
                out('endobj');

                // Catalog
                newObject();
                out('<<');
                putCatalog();
                out('>>');
                out('endobj');

                // Cross-ref
                var o = content_length, i;
                out('xref');
                out('0 ' + (objectNumber + 1));
                out('0000000000 65535 f ');
                for (i = 1; i <= objectNumber; i++) {
                    out(padd10(offsets[i]) + ' 00000 n ');
                }
                // Trailer
                out('trailer');
                out('<<');
                putTrailer();
                out('>>');
                out('startxref');
                out(o);
                out('%%EOF');

                outToPages = true;

                return content.join('\n');
            },
            getStyle = function (style) {
                // see Path-Painting Operators of PDF spec
                var op = 'S'; // stroke
                if (style === 'F') {
                    op = 'f'; // fill
                } else if (style === 'FD' || style === 'DF') {
                    op = 'B'; // both
                }
                return op;
            },

            /**
            Generates the PDF document.
            Possible values:
                datauristring (alias dataurlstring) - Data-Url-formatted data returned as string.
                datauri (alias datauri) - Data-Url-formatted data pushed into current window's location (effectively reloading the window with contents of the PDF).

            If `type` argument is undefined, output is raw body of resulting PDF returned as a string.

            @param {String} type A string identifying one of the possible output types.
            @param {Object} options An object providing some additional signalling to PDF generator.
            @function
            @returns {jsPDF}
            @methodOf jsPDF#
            @name output
            */
            output = function (type, options) {
                var undef, data, length, array, i, blob;
                switch (type) {
                case undef:
                    return buildDocument();
                case 'save':
                    if (navigator.getUserMedia) {
                        if (window.URL === undefined) {
                            return API.output('dataurlnewwindow');
                        } else if (window.URL.createObjectURL === undefined) {
                            return API.output('dataurlnewwindow');
                        }
                    }
                    data = buildDocument();

                    // Need to add the file to BlobBuilder as a Uint8Array
                    length = data.length;
                    array = new Uint8Array(new ArrayBuffer(length));

                    for (i = 0; i < length; i++) {
                        array[i] = data.charCodeAt(i);
                    }

                    blob = new Blob([array], {type: "application/pdf"});

                    saveAs(blob, options);
                    break;
                case 'datauristring':
                case 'dataurlstring':
                    return 'data:application/pdf;base64,' + btoa(buildDocument());
                case 'datauri':
                case 'dataurl':
                    document.location.href = 'data:application/pdf;base64,' + btoa(buildDocument());
                    break;
                case 'dataurlnewwindow':
                    window.open('data:application/pdf;base64,' + btoa(buildDocument()));
                    break;
                default:
                    throw new Error('Output type "' + type + '" is not supported.');
                }
                // @TODO: Add different output options
            };

        if (unit === 'pt') {
            k = 1;
        } else if (unit === 'mm') {
            k = 72 / 25.4;
        } else if (unit === 'cm') {
            k = 72 / 2.54;
        } else if (unit === 'in') {
            k = 72;
        } else {
            throw ('Invalid unit: ' + unit);
        }

        // Dimensions are stored as user units and converted to points on output
        if (pageFormats.hasOwnProperty(format_as_string)) {
            pageHeight = pageFormats[format_as_string][1] / k;
            pageWidth = pageFormats[format_as_string][0] / k;
        } else {
            try {
                pageHeight = format[1];
                pageWidth = format[0];
            } catch (err) {
                throw ('Invalid format: ' + format);
            }
        }

        if (orientation === 'p' || orientation === 'portrait') {
            orientation = 'p';
            if (pageWidth > pageHeight) {
                tmp = pageWidth;
                pageWidth = pageHeight;
                pageHeight = tmp;
            }
        } else if (orientation === 'l' || orientation === 'landscape') {
            orientation = 'l';
            if (pageHeight > pageWidth) {
                tmp = pageWidth;
                pageWidth = pageHeight;
                pageHeight = tmp;
            }
        } else {
            throw ('Invalid orientation: ' + orientation);
        }



        //---------------------------------------
        // Public API

        /*
        Object exposing internal API to plugins
        @public
        */
        API.internal = {
            'pdfEscape': pdfEscape,
            'getStyle': getStyle,
            /**
            Returns {FontObject} describing a particular font.
            @public
            @function
            @param fontName {String} (Optional) Font's family name
            @param fontStyle {String} (Optional) Font's style variation name (Example:"Italic")
            @returns {FontObject}
            */
            'getFont': function () { return fonts[getFont.apply(API, arguments)]; },
            'getFontSize': function () { return activeFontSize;    },
            'btoa': btoa,
            'write': function (string1, string2, string3, etc) {
                out(
                    arguments.length === 1 ? string1 : Array.prototype.join.call(arguments, ' ')
                );
            },
            'getCoordinateString': function (value) {
                return f2(value * k);
            },
            'getVerticalCoordinateString': function (value) {
                return f2((pageHeight - value) * k);
            },
            'collections': {},
            'newObject': newObject,
            'putStream': putStream,
            'events': events,
            // ratio that you use in multiplication of a given "size" number to arrive to 'point'
            // units of measurement.
            // scaleFactor is set at initialization of the document and calculated against the stated
            // default measurement units for the document.
            // If default is "mm", k is the number that will turn number in 'mm' into 'points' number.
            // through multiplication.
            'scaleFactor': k,
            'pageSize': {'width': pageWidth, 'height': pageHeight},
            'output': function (type, options) {
                return output(type, options);
            }
        };

        /**
        Adds (and transfers the focus to) new page to the PDF document.
        @function
        @returns {jsPDF}

        @methodOf jsPDF#
        @name addPage
         */
        API.addPage = function () {
            _addPage();
            return this;
        };

        /**
        Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
        @function
        @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Object} flags Collection of settings signalling how the text must be encoded. Defaults are sane. If you think you want to pass some flags, you likely can read the source.
        @returns {jsPDF}
        @methodOf jsPDF#
        @name text
         */
        API.text = function (text, x, y, flags) {
            /**
             * Inserts something like this into PDF
                BT
                /F1 16 Tf  % Font name + size
                16 TL % How many units down for next line in multiline text
                0 g % color
                28.35 813.54 Td % position
                (line one) Tj
                T* (line two) Tj
                T* (line three) Tj
                ET
            */

            var undef, _first, _second, _third, newtext, str, i;
            // Pre-August-2012 the order of arguments was function(x, y, text, flags)
            // in effort to make all calls have similar signature like
            //   function(data, coordinates... , miscellaneous)
            // this method had its args flipped.
            // code below allows backward compatibility with old arg order.
            if (typeof text === 'number') {
                _first = y;
                _second = text;
                _third = x;

                text = _first;
                x = _second;
                y = _third;
            }

            // If there are any newlines in text, we assume
            // the user wanted to print multiple lines, so break the
            // text up into an array.  If the text is already an array,
            // we assume the user knows what they are doing.
            if (typeof text === 'string' && text.match(/[\n\r]/)) {
                text = text.split(/\r\n|\r|\n/g);
            }

            if (typeof flags === 'undefined') {
                flags = {'noBOM': true, 'autoencode': true};
            } else {

                if (flags.noBOM === undef) {
                    flags.noBOM = true;
                }

                if (flags.autoencode === undef) {
                    flags.autoencode = true;
                }

            }

            if (typeof text === 'string') {
                str = pdfEscape(text, flags);
            } else if (text instanceof Array) {  /* Array */
                // we don't want to destroy  original text array, so cloning it
                newtext = text.concat();
                // we do array.join('text that must not be PDFescaped")
                // thus, pdfEscape each component separately
                for (i = newtext.length - 1; i !== -1; i--) {
                    newtext[i] = pdfEscape(newtext[i], flags);
                }
                str = newtext.join(") Tj\nT* (");
            } else {
                throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
            }
            // Using "'" ("go next line and render text" mark) would save space but would complicate our rendering code, templates

            // BT .. ET does NOT have default settings for Tf. You must state that explicitely every time for BT .. ET
            // if you want text transformation matrix (+ multiline) to work reliably (which reads sizes of things from font declarations)
            // Thus, there is NO useful, *reliable* concept of "default" font for a page.
            // The fact that "default" (reuse font used before) font worked before in basic cases is an accident
            // - readers dealing smartly with brokenness of jsPDF's markup.
            out(
                'BT\n/' +
                    activeFontKey + ' ' + activeFontSize + ' Tf\n' + // font face, style, size
                    activeFontSize + ' TL\n' + // line spacing
                    textColor +
                    '\n' + f2(x * k) + ' ' + f2((pageHeight - y) * k) + ' Td\n(' +
                    str +
                    ') Tj\nET'
            );
            return this;
        };

        API.line = function (x1, y1, x2, y2) {
            out(
                f2(x1 * k) + ' ' + f2((pageHeight - y1) * k) + ' m ' +
                    f2(x2 * k) + ' ' + f2((pageHeight - y2) * k) + ' l S'
            );
            return this;
        };

        /**
        Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
        All data points in `lines` are relative to last line origin.
        `x`, `y` become x1,y1 for first line / curve in the set.
        For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
        For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.

        @example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, 10) // line, line, bezier curve, line
        @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name lines
         */
        API.lines = function (lines, x, y, scale, style) {
            var undef, _first, _second, _third, scalex, scaley, i, l, leg, x2, y2, x3, y3, x4, y4;

            // Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
            // in effort to make all calls have similar signature like
            //   function(content, coordinateX, coordinateY , miscellaneous)
            // this method had its args flipped.
            // code below allows backward compatibility with old arg order.
            if (typeof lines === 'number') {
                _first = y;
                _second = lines;
                _third = x;

                lines = _first;
                x = _second;
                y = _third;
            }

            style = getStyle(style);
            scale = scale === undef ? [1, 1] : scale;

            // starting point
            out(f3(x * k) + ' ' + f3((pageHeight - y) * k) + ' m ');

            scalex = scale[0];
            scaley = scale[1];
            l = lines.length;
            //, x2, y2 // bezier only. In page default measurement "units", *after* scaling
            //, x3, y3 // bezier only. In page default measurement "units", *after* scaling
            // ending point for all, lines and bezier. . In page default measurement "units", *after* scaling
            x4 = x; // last / ending point = starting point for first item.
            y4 = y; // last / ending point = starting point for first item.

            for (i = 0; i < l; i++) {
                leg = lines[i];
                if (leg.length === 2) {
                    // simple line
                    x4 = leg[0] * scalex + x4; // here last x4 was prior ending point
                    y4 = leg[1] * scaley + y4; // here last y4 was prior ending point
                    out(f3(x4 * k) + ' ' + f3((pageHeight - y4) * k) + ' l');
                } else {
                    // bezier curve
                    x2 = leg[0] * scalex + x4; // here last x4 is prior ending point
                    y2 = leg[1] * scaley + y4; // here last y4 is prior ending point
                    x3 = leg[2] * scalex + x4; // here last x4 is prior ending point
                    y3 = leg[3] * scaley + y4; // here last y4 is prior ending point
                    x4 = leg[4] * scalex + x4; // here last x4 was prior ending point
                    y4 = leg[5] * scaley + y4; // here last y4 was prior ending point
                    out(
                        f3(x2 * k) + ' ' +
                            f3((pageHeight - y2) * k) + ' ' +
                            f3(x3 * k) + ' ' +
                            f3((pageHeight - y3) * k) + ' ' +
                            f3(x4 * k) + ' ' +
                            f3((pageHeight - y4) * k) + ' c'
                    );
                }
            }
            // stroking / filling / both the path
            out(style);
            return this;
        };

        /**
        Adds a rectangle to PDF

        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} w Width (in units declared at inception of PDF document)
        @param {Number} h Height (in units declared at inception of PDF document)
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name rect
         */
        API.rect = function (x, y, w, h, style) {
            var op = getStyle(style);
            out([
                f2(x * k),
                f2((pageHeight - y) * k),
                f2(w * k),
                f2(-h * k),
                're',
                op
            ].join(' '));
            return this;
        };

        /**
        Adds a triangle to PDF

        @param {Number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name triangle
         */
        API.triangle = function (x1, y1, x2, y2, x3, y3, style) {
            this.lines(
                [
                    [ x2 - x1, y2 - y1 ], // vector to point 2
                    [ x3 - x2, y3 - y2 ], // vector to point 3
                    [ x1 - x3, y1 - y3 ] // closing vector back to point 1
                ],
                x1,
                y1, // start of path
                [1, 1],
                style
            );
            return this;
        };

        /**
        Adds a rectangle with rounded corners to PDF

        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} w Width (in units declared at inception of PDF document)
        @param {Number} h Height (in units declared at inception of PDF document)
        @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
        @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name roundedRect
        */
        API.roundedRect = function (x, y, w, h, rx, ry, style) {
            var MyArc = 4 / 3 * (Math.SQRT2 - 1);
            this.lines(
                [
                    [ (w - 2 * rx), 0 ],
                    [ (rx * MyArc), 0, rx, ry - (ry * MyArc), rx, ry ],
                    [ 0, (h - 2 * ry) ],
                    [ 0, (ry * MyArc), -(rx * MyArc), ry, -rx, ry],
                    [ (-w + 2 * rx), 0],
                    [ -(rx * MyArc), 0, -rx, -(ry * MyArc), -rx, -ry],
                    [ 0, (-h + 2 * ry)],
                    [ 0, -(ry * MyArc), (rx * MyArc), -ry, rx, -ry]
                ],
                x + rx,
                y, // start of path
                [1, 1],
                style
            );
            return this;
        };

        /**
        Adds an ellipse to PDF

        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
        @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name ellipse
         */
        API.ellipse = function (x, y, rx, ry, style) {
            var op = getStyle(style),
                lx = 4 / 3 * (Math.SQRT2 - 1) * rx,
                ly = 4 / 3 * (Math.SQRT2 - 1) * ry;

            out([
                f2((x + rx) * k),
                f2((pageHeight - y) * k),
                'm',
                f2((x + rx) * k),
                f2((pageHeight - (y - ly)) * k),
                f2((x + lx) * k),
                f2((pageHeight - (y - ry)) * k),
                f2(x * k),
                f2((pageHeight - (y - ry)) * k),
                'c'
            ].join(' '));
            out([
                f2((x - lx) * k),
                f2((pageHeight - (y - ry)) * k),
                f2((x - rx) * k),
                f2((pageHeight - (y - ly)) * k),
                f2((x - rx) * k),
                f2((pageHeight - y) * k),
                'c'
            ].join(' '));
            out([
                f2((x - rx) * k),
                f2((pageHeight - (y + ly)) * k),
                f2((x - lx) * k),
                f2((pageHeight - (y + ry)) * k),
                f2(x * k),
                f2((pageHeight - (y + ry)) * k),
                'c'
            ].join(' '));
            out([
                f2((x + lx) * k),
                f2((pageHeight - (y + ry)) * k),
                f2((x + rx) * k),
                f2((pageHeight - (y + ly)) * k),
                f2((x + rx) * k),
                f2((pageHeight - y) * k),
                'c',
                op
            ].join(' '));
            return this;
        };

        /**
        Adds an circle to PDF

        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} r Radius (in units declared at inception of PDF document)
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name circle
         */
        API.circle = function (x, y, r, style) {
            return this.ellipse(x, y, r, r, style);
        };

        /**
        Adds a properties to the PDF document

        @param {Object} A property_name-to-property_value object structure.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setProperties
         */
        API.setProperties = function (properties) {
            // copying only those properties we can render.
            var property;
            for (property in documentProperties) {
                if (documentProperties.hasOwnProperty(property) && properties[property]) {
                    documentProperties[property] = properties[property];
                }
            }
            return this;
        };

        /**
        Sets font size for upcoming text elements.

        @param {Number} size Font size in points.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setFontSize
         */
        API.setFontSize = function (size) {
            activeFontSize = size;
            return this;
        };

        /**
        Sets text font face, variant for upcoming text elements.
        See output of jsPDF.getFontList() for possible font names, styles.

        @param {String} fontName Font name or family. Example: "times"
        @param {String} fontStyle Font style or variant. Example: "italic"
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setFont
         */
        API.setFont = function (fontName, fontStyle) {
            activeFontKey = getFont(fontName, fontStyle);
            // if font is not found, the above line blows up and we never go further
            return this;
        };

        /**
        Switches font style or variant for upcoming text elements,
        while keeping the font face or family same.
        See output of jsPDF.getFontList() for possible font names, styles.

        @param {String} style Font style or variant. Example: "italic"
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setFontStyle
         */
        API.setFontStyle = API.setFontType = function (style) {
            var undef;
            activeFontKey = getFont(undef, style);
            // if font is not found, the above line blows up and we never go further
            return this;
        };

        /**
        Returns an object - a tree of fontName to fontStyle relationships available to
        active PDF document.

        @public
        @function
        @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
        @methodOf jsPDF#
        @name getFontList
        */
        API.getFontList = function () {
            // TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
            var list = {},
                fontName,
                fontStyle,
                tmp;

            for (fontName in fontmap) {
                if (fontmap.hasOwnProperty(fontName)) {
                    list[fontName] = tmp = [];
                    for (fontStyle in fontmap[fontName]) {
                        if (fontmap[fontName].hasOwnProperty(fontStyle)) {
                            tmp.push(fontStyle);
                        }
                    }
                }
            }

            return list;
        };

        /**
        Sets line width for upcoming lines.

        @param {Number} width Line width (in units declared at inception of PDF document)
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setLineWidth
         */
        API.setLineWidth = function (width) {
            out((width * k).toFixed(2) + ' w');
            return this;
        };

        /**
        Sets the stroke color for upcoming elements.

        Depending on the number of arguments given, Gray, RGB, or CMYK
        color space is implied.

        When only ch1 is given, "Gray" color space is implied and it
        must be a value in the range from 0.00 (solid black) to to 1.00 (white)
        if values are communicated as String types, or in range from 0 (black)
        to 255 (white) if communicated as Number type.
        The RGB-like 0-255 range is provided for backward compatibility.

        When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
        value must be in the range from 0.00 (minimum intensity) to to 1.00
        (max intensity) if values are communicated as String types, or
        from 0 (min intensity) to to 255 (max intensity) if values are communicated
        as Number types.
        The RGB-like 0-255 range is provided for backward compatibility.

        When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
        value must be a in the range from 0.00 (0% concentration) to to
        1.00 (100% concentration)

        Because JavaScript treats fixed point numbers badly (rounds to
        floating point nearest to binary representation) it is highly advised to
        communicate the fractional numbers as String types, not JavaScript Number type.

        @param {Number|String} ch1 Color channel value
        @param {Number|String} ch2 Color channel value
        @param {Number|String} ch3 Color channel value
        @param {Number|String} ch4 Color channel value

        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setDrawColor
         */
        API.setDrawColor = function (ch1, ch2, ch3, ch4) {
            var color;
            if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
                // Gray color space.
                if (typeof ch1 === 'string') {
                    color = ch1 + ' G';
                } else {
                    color = f2(ch1 / 255) + ' G';
                }
            } else if (ch4 === undefined) {
                // RGB
                if (typeof ch1 === 'string') {
                    color = [ch1, ch2, ch3, 'RG'].join(' ');
                } else {
                    color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'RG'].join(' ');
                }
            } else {
                // CMYK
                if (typeof ch1 === 'string') {
                    color = [ch1, ch2, ch3, ch4, 'K'].join(' ');
                } else {
                    color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'K'].join(' ');
                }
            }

            out(color);
            return this;
        };

        /**
        Sets the fill color for upcoming elements.

        Depending on the number of arguments given, Gray, RGB, or CMYK
        color space is implied.

        When only ch1 is given, "Gray" color space is implied and it
        must be a value in the range from 0.00 (solid black) to to 1.00 (white)
        if values are communicated as String types, or in range from 0 (black)
        to 255 (white) if communicated as Number type.
        The RGB-like 0-255 range is provided for backward compatibility.

        When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
        value must be in the range from 0.00 (minimum intensity) to to 1.00
        (max intensity) if values are communicated as String types, or
        from 0 (min intensity) to to 255 (max intensity) if values are communicated
        as Number types.
        The RGB-like 0-255 range is provided for backward compatibility.

        When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
        value must be a in the range from 0.00 (0% concentration) to to
        1.00 (100% concentration)

        Because JavaScript treats fixed point numbers badly (rounds to
        floating point nearest to binary representation) it is highly advised to
        communicate the fractional numbers as String types, not JavaScript Number type.

        @param {Number|String} ch1 Color channel value
        @param {Number|String} ch2 Color channel value
        @param {Number|String} ch3 Color channel value
        @param {Number|String} ch4 Color channel value

        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setFillColor
         */
        API.setFillColor = function (ch1, ch2, ch3, ch4) {
            var color;

            if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
                // Gray color space.
                if (typeof ch1 === 'string') {
                    color = ch1 + ' g';
                } else {
                    color = f2(ch1 / 255) + ' g';
                }
            } else if (ch4 === undefined) {
                // RGB
                if (typeof ch1 === 'string') {
                    color = [ch1, ch2, ch3, 'rg'].join(' ');
                } else {
                    color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'rg'].join(' ');
                }
            } else {
                // CMYK
                if (typeof ch1 === 'string') {
                    color = [ch1, ch2, ch3, ch4, 'k'].join(' ');
                } else {
                    color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'k'].join(' ');
                }
            }

            out(color);
            return this;
        };

        /**
        Sets the text color for upcoming elements.
        If only one, first argument is given,
        treats the value as gray-scale color value.

        @param {Number} r Red channel color value in range 0-255
        @param {Number} g Green channel color value in range 0-255
        @param {Number} b Blue channel color value in range 0-255
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setTextColor
        */
        API.setTextColor = function (r, g, b) {
            if ((r === 0 && g === 0 && b === 0) || (typeof g === 'undefined')) {
                textColor = f3(r / 255) + ' g';
            } else {
                textColor = [f3(r / 255), f3(g / 255), f3(b / 255), 'rg'].join(' ');
            }
            return this;
        };

        /**
        Is an Object providing a mapping from human-readable to
        integer flag values designating the varieties of line cap
        and join styles.

        @returns {Object}
        @fieldOf jsPDF#
        @name CapJoinStyles
        */
        API.CapJoinStyles = {
            0: 0,
            'butt': 0,
            'but': 0,
            'bevel': 0,
            1: 1,
            'round': 1,
            'rounded': 1,
            'circle': 1,
            2: 2,
            'projecting': 2,
            'project': 2,
            'square': 2,
            'milter': 2
        };

        /**
        Sets the line cap styles
        See {jsPDF.CapJoinStyles} for variants

        @param {String|Number} style A string or number identifying the type of line cap
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setLineCap
        */
        API.setLineCap = function (style) {
            var id = this.CapJoinStyles[style];
            if (id === undefined) {
                throw new Error("Line cap style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
            }
            lineCapID = id;
            out(id.toString(10) + ' J');

            return this;
        };

        /**
        Sets the line join styles
        See {jsPDF.CapJoinStyles} for variants

        @param {String|Number} style A string or number identifying the type of line join
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setLineJoin
        */
        API.setLineJoin = function (style) {
            var id = this.CapJoinStyles[style];
            if (id === undefined) {
                throw new Error("Line join style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
            }
            lineJoinID = id;
            out(id.toString(10) + ' j');

            return this;
        };

        // Output is both an internal (for plugins) and external function
        API.output = output;

        /**
         * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf')
         * @param  {String} filename The filename including extension.
         *
         * @function
         * @returns {jsPDF}
         * @methodOf jsPDF#
         * @name save
         */
        API.save = function (filename) {
            API.output('save', filename);
        };

        // applying plugins (more methods) ON TOP of built-in API.
        // this is intentional as we allow plugins to override
        // built-ins
        for (plugin in jsPDF.API) {
            if (jsPDF.API.hasOwnProperty(plugin)) {
                if (plugin === 'events' && jsPDF.API.events.length) {
                    (function (events, newEvents) {

                        // jsPDF.API.events is a JS Array of Arrays
                        // where each Array is a pair of event name, handler
                        // Events were added by plugins to the jsPDF instantiator.
                        // These are always added to the new instance and some ran
                        // during instantiation.

                        var eventname, handler_and_args, i;

                        for (i = newEvents.length - 1; i !== -1; i--) {
                            // subscribe takes 3 args: 'topic', function, runonce_flag
                            // if undefined, runonce is false.
                            // users can attach callback directly,
                            // or they can attach an array with [callback, runonce_flag]
                            // that's what the "apply" magic is for below.
                            eventname = newEvents[i][0];
                            handler_and_args = newEvents[i][1];
                            events.subscribe.apply(
                                events,
                                [eventname].concat(
                                    typeof handler_and_args === 'function' ?
                                            [ handler_and_args ] :
                                            handler_and_args
                                )
                            );
                        }
                    }(events, jsPDF.API.events));
                } else {
                    API[plugin] = jsPDF.API[plugin];
                }
            }
        }

        /////////////////////////////////////////
        // continuing initilisation of jsPDF Document object
        /////////////////////////////////////////


        // Add the first page automatically
        addFonts();
        activeFontKey = 'F1';
        _addPage();

        events.publish('initialized');

        return API;
    }

/**
jsPDF.API is a STATIC property of jsPDF class.
jsPDF.API is an object you can add methods and properties to.
The methods / properties you add will show up in new jsPDF objects.

One property is prepopulated. It is the 'events' Object. Plugin authors can add topics, callbacks to this object. These will be reassigned to all new instances of jsPDF.
Examples:
    jsPDF.API.events['initialized'] = function(){ 'this' is API object }
    jsPDF.API.events['addFont'] = function(added_font_object){ 'this' is API object }

@static
@public
@memberOf jsPDF
@name API

@example
    jsPDF.API.mymethod = function(){
        // 'this' will be ref to internal API object. see jsPDF source
        // , so you can refer to built-in methods like so:
        //     this.line(....)
        //     this.text(....)
    }
    var pdfdoc = new jsPDF()
    pdfdoc.mymethod() // <- !!!!!!
*/
    jsPDF.API = {'events': []};

    return jsPDF;
}());
