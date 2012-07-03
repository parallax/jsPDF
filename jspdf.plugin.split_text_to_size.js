/** @preserve 
jsPDF split_text_to_size plugin
Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
MIT license.
*/
/**
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

;(function(API) {
'use strict'

/**
Returns an array of length matching length of the 'word' string, with each
cell ocupied by the width of the char in that position.

@function
@param word {String}
@param widths {Object}
@param kerning {Object}
@returns {Array}
*/
var getCharWidthsArray = API.getCharWidthsArray = function(text, options){

	if (!options) {
		options = {}
	}

	var widths = options.widths ? options.widths : this.internal.getFont().metadata.Unicode.widths
	, widthsFractionOf = widths.fof ? widths.fof : 1
	, kerning = options.kerning ? options.kerning : this.internal.getFont().metadata.Unicode.kerning
	, kerningFractionOf = kerning.fof ? kerning.fof : 1
	
	// console.log("widths, kergnings", widths, kerning)

	var i, l
	, char_code
	, char_width
	, prior_char_code = 0 // for kerning
	, default_char_width = widths[0] || widthsFractionOf
	, output = []

	for (i = 0, l = text.length; i < l; i++) {
		char_code = text.charCodeAt(i)
		output.push(
			( widths[char_code] || default_char_width ) / widthsFractionOf + 
			( kerning[char_code] && kerning[char_code][prior_char_code] || 0 ) / kerningFractionOf
		)
		prior_char_code = char_code
	}

	return output
}
var getArraySum = function(array){
	for(var i = array.length - 1, output = 0; i!== -1; output += array[i--]){}
	return output
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
var getStringUnitWidth = API.getStringUnitWidth = function(text, options) {
	return getArraySum(getCharWidthsArray.call(this, text, options))
}

/** 
returns array with:
at index 0 is string to append to current line, 
followed by arrays for each new line to be added
to the lines collection, one array, per each additional line.
*/
var splitLongWord = function(word, widths_array, first_length, maxlen){
	// TODO: fix this right
	return ['', [word]]
}
var splitParagraphIntoLines = function(text, maxlen, options){
	// at this time works only on Western scripts, ones with space char
	// separating the words. Feel free to expand.

	var spaceCharWidth = getCharWidthsArray(' ', options)[0]

	var words = text.split(' ')

	var line = []
	, lines = [line]
	, line_length = 0
	, separator_length = 0
	, current_word_length = 0
	, word
	, widths_array

	var i, l, tmp
	for (i = 0, l = words.length; i < l; i++) {
		word = words[i]
		widths_array = getCharWidthsArray(word, options)
		current_word_length = getArraySum(widths_array)

		if (line_length + separator_length + current_word_length > maxlen) {
			if (current_word_length > maxlen) {
				// this happens when you have space-less long URLs for example.
				// we just chop these to size. We do NOT insert hiphens
				tmp = splitLongWord(word, widths_array, line_length + separator_length, maxlen)
				line.push(tmp.shift()) // it's ok to have extra space indicator there
				lines = lines.concat(tmp)
				line = lines[lines.length - 1]

				line_length = getArraySum( widths_array.slice(line[0].length - 3) )
				separator_length = spaceCharWidth
			} else {
				// just put it on a new line
				line = [word]
				lines.push(line)

				line_length = current_word_length
				separator_length = spaceCharWidth
			}
		} else {
			line.push(word)

			line_length += separator_length + current_word_length
			separator_length = spaceCharWidth
		}
	}

	var output = []
	for (i = 0, l = lines.length; i < l; i++) {
		output.push( lines[i].join(' ') )
	}
	return output

}

/**
Splits a given string into an array of strings. Uses 'size' value
(in measurement units declared as default for the jsPDF instance)
and the font's "widths" and "Kerning" tables, where availabe, to
determine display length of a given string for a given font.

We use character's 100% of unit size (height) as width when Width
table or other default width is not available.

@public
@function
@param text {String} Unencoded, regular JavaScript (Unicode, UTF-16 / UCS-2) string.
@param size {Number} Nominal number, measured in units default to this instance of jsPDF.
@param options {Object} Optional flags needed for chopper to do the right thing.
@returns {Array} with strings chopped to size.
*/
API.splitTextToSize = function(text, maxlen, options) {
	'use strict'

	if (!options) {
		options = {}
	}

	var f = this.internal.getFont(options.fontName, options.fontStyle)
	, fsize = options.fontSize || this.internal.getFontSize()
	, widths = {0:1000}
	, kerning = {}
	, metricsIsFractionOf = 1
	, encoding = 'Unicode'
	// NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE
	// Actual JavaScript-native String's 16bit char codes used.
	// no multi-byte logic here

	// if you want "encoded" text split, roll separate function, add char mapping tables etc.

	if (f.metadata[encoding]) {
		widths = f.metadata[encoding].widths || widths
		kerning = f.metadata[encoding].kerning || kerning
	}

	// first we split on end-of-line chars
	var paragraphs 
	if (text.match(/[\n\r]/)) {
		paragraphs = text.split(/\r\n|\r|\n/g)
	} else {
		paragraphs = [text]
	}

	// now we convert size (max length of line) into "font size units"
	// at present time, the "font size unit" is always 'point'
	// 'proportional' means, "in proportion to font size"
	var fontunit_maxlen = 1.0 * this.internal.scaleFactor * maxlen / fsize
	// at this time, fsize is always in "points" regardless of the default measurement unit of the doc.
	// this may change in the future?
	// until then, proportional_maxlen is likely to be in 'points'

	var i, l
	, output = []
	for (i = 0, l = paragraphs.length; i < l; i++) {
		output = output.concat(
			splitParagraphIntoLines(
				paragraphs[i]
				, fontunit_maxlen
				, {'widths':widths, 'kerning':kerning}
			)
		)
	}

	return output 
}

})(jsPDF.API);
