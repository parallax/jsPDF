/** @license
 * MIT license.
 * Copyright (c) 2012 Willow Systems Corporation, https://github.com/willowsystems
 *               2014 Diego Casorran, https://github.com/diegocr
 *
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

import { jsPDF } from "../jspdf.js";
import type {
  Font,
  FontMetadata,
  jsPDFAPI as JsPDFAPI,
  jsPDFDocument
} from "../types.js";

/** Character widths table: char code -> width, plus the `fof` fraction. */
export interface FontWidthsTable {
  [charCode: number]: number;
  fof?: number;
}

/** Kerning table: char code -> prior char code -> kerning value. */
export interface FontKerningTable {
  [charCode: number]: { [priorCharCode: number]: number };
  fof?: number;
}

/** Options consumed by getCharWidthsArray()/getStringUnitWidth(). */
export interface CharWidthsOptions {
  /**
   * Honestly admits FontMetadata as well: splitTextToSize has always passed
   * the raw TTF metadata object through this slot (a latent quirk preserved
   * for parity; the consumers only ever read `.metadata` off this value).
   */
  font?: Font | FontMetadata;
  fontSize?: number;
  charSpace?: number;
  widths?: FontWidthsTable;
  kerning?: FontKerningTable;
  doKerning?: boolean;
}

/** Options accepted by splitTextToSize(). */
export interface SplitTextOptions extends CharWidthsOptions {
  textIndent?: number;
  lineIndent?: number;
  fontName?: string;
  fontStyle?: string;
}

/**
 * View of the font-metadata members this plugin consults: the metric tables
 * written by standard_fonts_metrics, or the TTF font object (which carries
 * widthOfString & co) written by ttfsupport.
 */
interface SplitFontMetadataView {
  Unicode?: { widths?: FontWidthsTable; kerning?: FontKerningTable };
  widthOfString?: (text: string, fontSize: number, charSpace: number) => number;
  widthOfGlyph?: (glyph: number | string) => number;
  characterToGlyph?: (code: number) => number | string;
}

declare module "../types.js" {
  interface jsPDFAPI {
    getCharWidthsArray(text: string, options?: CharWidthsOptions): number[];
    getStringUnitWidth(text: string, options?: CharWidthsOptions): number;
    splitTextToSize(
      text: string | string[],
      maxlen: number,
      options?: SplitTextOptions
    ): string[];
  }
}

/**
 * jsPDF split_text_to_size plugin
 *
 * @name split_text_to_size
 * @module
 */
(function (API: JsPDFAPI) {
  "use strict";
  /**
   * Returns an array of length matching length of the 'word' string, with each
   * cell occupied by the width of the char in that position.
   *
   * @name getCharWidthsArray
   * @function
   * @param {string} text
   * @param {Object} options
   * @returns {Array}
   */
  var getCharWidthsArray = (API.getCharWidthsArray = function (
    this: jsPDFDocument,
    text: string,
    options?: CharWidthsOptions
  ) {
    options = options || {};

    var activeFont = options.font || this.internal.getFont();
    var fontSize = options.fontSize || this.internal.getFontSize();
    var charSpace = options.charSpace || this.internal.getCharSpace();

    // font.metadata values are opaque to the core; the assertion names the
    // members this plugin consults (see SplitFontMetadataView above).
    var metadata = activeFont.metadata as SplitFontMetadataView;

    // Latent parity: when no explicit tables are passed, the font is assumed
    // to carry Unicode metric tables (standard fonts do); a font without them
    // crashed here before typing, too.
    var widths = (options.widths ? options.widths : metadata.Unicode!.widths)!;
    var widthsFractionOf = widths.fof ? widths.fof : 1;
    var kerning = (
      options.kerning ? options.kerning : metadata.Unicode!.kerning
    )!;
    var kerningFractionOf = kerning.fof ? kerning.fof : 1;
    var doKerning = options.doKerning === false ? false : true;
    var kerningValue = 0;

    var i: number;
    var length = text.length;
    var char_code: number;
    var prior_char_code = 0; //for kerning
    var default_char_width = widths[0] || widthsFractionOf;
    var output: number[] = [];

    for (i = 0; i < length; i++) {
      char_code = text.charCodeAt(i);

      if (typeof metadata.widthOfString === "function") {
        output.push(
          // A TTF metadata object with widthOfString always carries the
          // companion glyph helpers as well.
          (metadata.widthOfGlyph!(metadata.characterToGlyph!(char_code)) +
            charSpace * (1000 / fontSize) || 0) / 1000
        );
      } else {
        if (
          doKerning &&
          typeof kerning[char_code] === "object" &&
          // parseInt applies ToString to its argument at runtime; String()
          // performs that exact conversion up front, so the result is
          // identical for every input (including a missing entry:
          // parseInt("undefined") is NaN either way).
          !isNaN(parseInt(String(kerning[char_code][prior_char_code]), 10))
        ) {
          kerningValue =
            kerning[char_code][prior_char_code] / kerningFractionOf;
        } else {
          kerningValue = 0;
        }
        output.push(
          (widths[char_code] || default_char_width) / widthsFractionOf +
            kerningValue
        );
      }
      prior_char_code = char_code;
    }

    return output;
  });

  /**
   * Returns a widths of string in a given font, if the font size is set as 1 point.
   *
   * In other words, this is "proportional" value. For 1 unit of font size, the length
   * of the string will be that much.
   *
   * Multiply by font size to get actual width in *points*
   * Then divide by 72 to get inches or divide by (72/25.4) to get 'mm' etc.
   *
   * @name getStringUnitWidth
   * @public
   * @function
   * @param {string} text
   * @param {string} options
   * @returns {number} result
   */
  var getStringUnitWidth = (API.getStringUnitWidth = function (
    this: jsPDFDocument,
    text: string,
    options?: CharWidthsOptions
  ) {
    options = options || {};

    var fontSize = options.fontSize || this.internal.getFontSize();
    var font = options.font || this.internal.getFont();
    var charSpace = options.charSpace || this.internal.getCharSpace();
    var result = 0;

    if (API.processArabic) {
      text = API.processArabic(text);
    }

    // See SplitFontMetadataView above.
    var metadata = font.metadata as SplitFontMetadataView;

    if (typeof metadata.widthOfString === "function") {
      result = metadata.widthOfString(text, fontSize, charSpace) / fontSize;
    } else {
      // The raw arguments object is forwarded verbatim (in strict mode it
      // still holds the original, pre-defaulting values); it always carries
      // (text, options?), which is exactly what getCharWidthsArray takes.
      var rawArgs: unknown = arguments;
      result = getCharWidthsArray
        .apply(this, rawArgs as [string, CharWidthsOptions])
        .reduce(function (pv, cv) {
          return pv + cv;
        }, 0);
    }
    return result;
  });

  /**
  returns array of lines
  */
  var splitLongWord = function (
    word: string,
    widths_array: number[],
    firstLineMaxLen: number,
    maxLen: number
  ): string[] {
    var answer: string[] = [];

    // 1st, chop off the piece that can fit on the hanging line.
    var i = 0,
      l = word.length,
      workingLen = 0;
    while (i !== l && workingLen + widths_array[i] < firstLineMaxLen) {
      workingLen += widths_array[i];
      i++;
    }
    // this is first line.
    answer.push(word.slice(0, i));

    // 2nd. Split the rest into maxLen pieces.
    var startOfLine = i;
    workingLen = 0;
    while (i !== l) {
      if (workingLen + widths_array[i] > maxLen) {
        answer.push(word.slice(startOfLine, i));
        workingLen = 0;
        startOfLine = i;
      }
      workingLen += widths_array[i];
      i++;
    }
    if (startOfLine !== i) {
      answer.push(word.slice(startOfLine, i));
    }

    return answer;
  };

  // Note, all sizing inputs for this function must be in "font measurement units"
  // By default, for PDF, it's "point".
  var splitParagraphIntoLines = function (
    this: jsPDFDocument,
    text: string,
    maxlen: number,
    options?: SplitTextOptions
  ): string[] {
    // at this time works only on Western scripts, ones with space char
    // separating the words. Feel free to expand.

    if (!options) {
      options = {};
    }

    var line: string[] = [],
      lines = [line],
      line_length = options.textIndent || 0,
      separator_length = 0,
      current_word_length = 0,
      word: string,
      widths_array: number[],
      words = text.split(" "),
      spaceCharWidth = getCharWidthsArray.apply(this, [" ", options])[0],
      i: number,
      l: number,
      tmp: string[],
      lineIndent: number;

    if (options.lineIndent === -1) {
      lineIndent = words[0].length + 2;
    } else {
      lineIndent = options.lineIndent || 0;
    }
    if (lineIndent) {
      var pad = Array(lineIndent).join(" "),
        wrds: string[] = [];
      words.map(function (wrd: string | string[]) {
        // The parameter is reused to hold its own split; the assertion names
        // the string it necessarily is on entry.
        wrd = (wrd as string).split(/\s*\n/);
        if (wrd.length > 1) {
          wrds = wrds.concat(
            wrd.map(function (wrd, idx) {
              return (idx && wrd.length ? "\n" : "") + wrd;
            })
          );
        } else {
          wrds.push(wrd[0]);
        }
      });
      words = wrds;
      lineIndent = getStringUnitWidth.apply(this, [pad, options]);
    }

    for (i = 0, l = words.length; i < l; i++) {
      var force = 0;

      word = words[i];
      if (lineIndent && word[0] == "\n") {
        word = word.substr(1);
        force = 1;
      }
      widths_array = getCharWidthsArray.apply(this, [word, options]);
      current_word_length = widths_array.reduce(function (pv, cv) {
        return pv + cv;
      }, 0);

      if (
        line_length + separator_length + current_word_length > maxlen ||
        force
      ) {
        if (current_word_length > maxlen) {
          // this happens when you have space-less long URLs for example.
          // we just chop these to size. We do NOT insert hiphens
          tmp = splitLongWord.apply(this, [
            word,
            widths_array,
            maxlen - (line_length + separator_length),
            maxlen
          ]);
          // splitLongWord always returns at least one fragment; the
          // assertions mirror the historical trust in that invariant.
          // first line we add to existing line object
          line.push(tmp.shift()!); // it's ok to have extra space indicator there
          // last line we make into new line object
          line = [tmp.pop()!];
          // lines in the middle we apped to lines object as whole lines
          while (tmp.length) {
            lines.push([tmp.shift()!]); // single fragment occupies whole line
          }
          current_word_length = widths_array
            .slice(word.length - (line[0] ? line[0].length : 0))
            .reduce(function (pv, cv) {
              return pv + cv;
            }, 0);
        } else {
          // just put it on a new line
          line = [word];
        }

        // now we attach new line to lines
        lines.push(line);
        line_length = current_word_length + lineIndent;
        separator_length = spaceCharWidth;
      } else {
        line.push(word);

        line_length += separator_length + current_word_length;
        separator_length = spaceCharWidth;
      }
    }

    var postProcess: (ln: string[], idx?: number) => string;
    if (lineIndent) {
      postProcess = function (ln: string[], idx?: number) {
        return (idx ? pad : "") + ln.join(" ");
      };
    } else {
      postProcess = function (ln: string[]) {
        return ln.join(" ");
      };
    }

    return lines.map(postProcess);
  };

  /**
   * Splits a given string into an array of strings. Uses 'size' value
   * (in measurement units declared as default for the jsPDF instance)
   * and the font's "widths" and "Kerning" tables, where available, to
   * determine display length of a given string for a given font.
   *
   * We use character's 100% of unit size (height) as width when Width
   * table or other default width is not available.
   *
   * @name splitTextToSize
   * @public
   * @function
   * @param {string} text Unencoded, regular JavaScript (Unicode, UTF-16 / UCS-2) string.
   * @param {number} size Nominal number, measured in units default to this instance of jsPDF.
   * @param {Object} options Optional flags needed for chopper to do the right thing.
   * @returns {Array} array Array with strings chopped to size.
   */
  API.splitTextToSize = function (
    this: jsPDFDocument,
    text: string | string[],
    maxlen: number,
    options?: SplitTextOptions
  ) {
    "use strict";

    options = options || {};

    var fsize = options.fontSize || this.internal.getFontSize(),
      newOptions = function (
        this: jsPDFDocument,
        options: SplitTextOptions
      ): SplitTextOptions {
        var widths: FontWidthsTable = {
            0: 1
          },
          kerning: FontKerningTable = {};

        if (!options.widths || !options.kerning) {
          var f = this.internal.getFont(options.fontName, options.fontStyle),
            encoding = "Unicode";
          // NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE
          // Actual JavaScript-native String's 16bit char codes used.
          // no multi-byte logic here

          if (f.metadata[encoding]) {
            return {
              // font.metadata values are opaque to the core; the assertions
              // name the metric-table entry consulted here.
              widths:
                (
                  f.metadata[encoding] as NonNullable<
                    SplitFontMetadataView["Unicode"]
                  >
                ).widths || widths,
              kerning:
                (
                  f.metadata[encoding] as NonNullable<
                    SplitFontMetadataView["Unicode"]
                  >
                ).kerning || kerning
            };
          } else {
            return {
              // Latent quirk preserved for parity: the TTF metadata object is
              // passed through the `font` option slot (getCharWidthsArray and
              // getStringUnitWidth then look up `.metadata` on it), which the
              // CharWidthsOptions.font type admits honestly.
              font: f.metadata,
              fontSize: this.internal.getFontSize(),
              charSpace: this.internal.getCharSpace()
            };
          }
        } else {
          return {
            widths: options.widths,
            kerning: options.kerning
          };
        }
      }.call(this, options);

    // first we split on end-of-line chars
    var paragraphs: string[];
    if (Array.isArray(text)) {
      paragraphs = text;
    } else {
      paragraphs = String(text).split(/\r?\n/);
    }

    // now we convert size (max length of line) into "font size units"
    // at present time, the "font size unit" is always 'point'
    // 'proportional' means, "in proportion to font size"
    var fontUnit_maxLen = (1.0 * this.internal.scaleFactor * maxlen) / fsize;
    // at this time, fsize is always in "points" regardless of the default measurement unit of the doc.
    // this may change in the future?
    // until then, proportional_maxlen is likely to be in 'points'

    // If first line is to be indented (shorter or longer) than maxLen
    // we indicate that by using CSS-style "text-indent" option.
    // here it's in font units too (which is likely 'points')
    // it can be negative (which makes the first line longer than maxLen)
    newOptions.textIndent = options.textIndent
      ? (options.textIndent * 1.0 * this.internal.scaleFactor) / fsize
      : 0;
    newOptions.lineIndent = options.lineIndent;

    var i: number,
      l: number,
      output: string[] = [];
    for (i = 0, l = paragraphs.length; i < l; i++) {
      output = output.concat(
        splitParagraphIntoLines.apply(this, [
          paragraphs[i],
          fontUnit_maxLen,
          newOptions
        ])
      );
    }

    return output;
  };
})(jsPDF.API);
