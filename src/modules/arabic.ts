/**
 * @license
 * Copyright (c) 2017 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

import { jsPDF } from "../jspdf.js";

/**
 * jsPDF arabic parser PlugIn
 *
 * @name arabic
 * @module
 */
(function(jsPDFAPI) {
  "use strict";

  /**
   * Arabic shape substitutions: char code => (isolated, final, initial, medial).
   * Arabic Substition A
   */
  var arabicSubstitionA = {
    0x0621: [0xfe80], // ARABIC LETTER HAMZA
    0x0622: [0xfe81, 0xfe82], // ARABIC LETTER ALEF WITH MADDA ABOVE
    0x0623: [0xfe83, 0xfe84], // ARABIC LETTER ALEF WITH HAMZA ABOVE
    0x0624: [0xfe85, 0xfe86], // ARABIC LETTER WAW WITH HAMZA ABOVE
    0x0625: [0xfe87, 0xfe88], // ARABIC LETTER ALEF WITH HAMZA BELOW
    0x0626: [0xfe89, 0xfe8a, 0xfe8b, 0xfe8c], // ARABIC LETTER YEH WITH HAMZA ABOVE
    0x0627: [0xfe8d, 0xfe8e], // ARABIC LETTER ALEF
    0x0628: [0xfe8f, 0xfe90, 0xfe91, 0xfe92], // ARABIC LETTER BEH
    0x0629: [0xfe93, 0xfe94], // ARABIC LETTER TEH MARBUTA
    0x062a: [0xfe95, 0xfe96, 0xfe97, 0xfe98], // ARABIC LETTER TEH
    0x062b: [0xfe99, 0xfe9a, 0xfe9b, 0xfe9c], // ARABIC LETTER THEH
    0x062c: [0xfe9d, 0xfe9e, 0xfe9f, 0xfea0], // ARABIC LETTER JEEM
    0x062d: [0xfea1, 0xfea2, 0xfea3, 0xfea4], // ARABIC LETTER HAH
    0x062e: [0xfea5, 0xfea6, 0xfea7, 0xfea8], // ARABIC LETTER KHAH
    0x062f: [0xfea9, 0xfeaa], // ARABIC LETTER DAL
    0x0630: [0xfeab, 0xfeac], // ARABIC LETTER THAL
    0x0631: [0xfead, 0xfeae], // ARABIC LETTER REH
    0x0632: [0xfeaf, 0xfeb0], // ARABIC LETTER ZAIN
    0x0633: [0xfeb1, 0xfeb2, 0xfeb3, 0xfeb4], // ARABIC LETTER SEEN
    0x0634: [0xfeb5, 0xfeb6, 0xfeb7, 0xfeb8], // ARABIC LETTER SHEEN
    0x0635: [0xfeb9, 0xfeba, 0xfebb, 0xfebc], // ARABIC LETTER SAD
    0x0636: [0xfebd, 0xfebe, 0xfebf, 0xfec0], // ARABIC LETTER DAD
    0x0637: [0xfec1, 0xfec2, 0xfec3, 0xfec4], // ARABIC LETTER TAH
    0x0638: [0xfec5, 0xfec6, 0xfec7, 0xfec8], // ARABIC LETTER ZAH
    0x0639: [0xfec9, 0xfeca, 0xfecb, 0xfecc], // ARABIC LETTER AIN
    0x063a: [0xfecd, 0xfece, 0xfecf, 0xfed0], // ARABIC LETTER GHAIN
    0x0641: [0xfed1, 0xfed2, 0xfed3, 0xfed4], // ARABIC LETTER FEH
    0x0642: [0xfed5, 0xfed6, 0xfed7, 0xfed8], // ARABIC LETTER QAF
    0x0643: [0xfed9, 0xfeda, 0xfedb, 0xfedc], // ARABIC LETTER KAF
    0x0644: [0xfedd, 0xfede, 0xfedf, 0xfee0], // ARABIC LETTER LAM
    0x0645: [0xfee1, 0xfee2, 0xfee3, 0xfee4], // ARABIC LETTER MEEM
    0x0646: [0xfee5, 0xfee6, 0xfee7, 0xfee8], // ARABIC LETTER NOON
    0x0647: [0xfee9, 0xfeea, 0xfeeb, 0xfeec], // ARABIC LETTER HEH
    0x0648: [0xfeed, 0xfeee], // ARABIC LETTER WAW
    0x0649: [0xfeef, 0xfef0, 64488, 64489], // ARABIC LETTER ALEF MAKSURA
    0x064a: [0xfef1, 0xfef2, 0xfef3, 0xfef4], // ARABIC LETTER YEH
    0x0671: [0xfb50, 0xfb51], // ARABIC LETTER ALEF WASLA
    0x0677: [0xfbdd], // ARABIC LETTER U WITH HAMZA ABOVE
    0x0679: [0xfb66, 0xfb67, 0xfb68, 0xfb69], // ARABIC LETTER TTEH
    0x067a: [0xfb5e, 0xfb5f, 0xfb60, 0xfb61], // ARABIC LETTER TTEHEH
    0x067b: [0xfb52, 0xfb53, 0xfb54, 0xfb55], // ARABIC LETTER BEEH
    0x067e: [0xfb56, 0xfb57, 0xfb58, 0xfb59], // ARABIC LETTER PEH
    0x067f: [0xfb62, 0xfb63, 0xfb64, 0xfb65], // ARABIC LETTER TEHEH
    0x0680: [0xfb5a, 0xfb5b, 0xfb5c, 0xfb5d], // ARABIC LETTER BEHEH
    0x0683: [0xfb76, 0xfb77, 0xfb78, 0xfb79], // ARABIC LETTER NYEH
    0x0684: [0xfb72, 0xfb73, 0xfb74, 0xfb75], // ARABIC LETTER DYEH
    0x0686: [0xfb7a, 0xfb7b, 0xfb7c, 0xfb7d], // ARABIC LETTER TCHEH
    0x0687: [0xfb7e, 0xfb7f, 0xfb80, 0xfb81], // ARABIC LETTER TCHEHEH
    0x0688: [0xfb88, 0xfb89], // ARABIC LETTER DDAL
    0x068c: [0xfb84, 0xfb85], // ARABIC LETTER DAHAL
    0x068d: [0xfb82, 0xfb83], // ARABIC LETTER DDAHAL
    0x068e: [0xfb86, 0xfb87], // ARABIC LETTER DUL
    0x0691: [0xfb8c, 0xfb8d], // ARABIC LETTER RREH
    0x0698: [0xfb8a, 0xfb8b], // ARABIC LETTER JEH
    0x06a4: [0xfb6a, 0xfb6b, 0xfb6c, 0xfb6d], // ARABIC LETTER VEH
    0x06a6: [0xfb6e, 0xfb6f, 0xfb70, 0xfb71], // ARABIC LETTER PEHEH
    0x06a9: [0xfb8e, 0xfb8f, 0xfb90, 0xfb91], // ARABIC LETTER KEHEH
    0x06ad: [0xfbd3, 0xfbd4, 0xfbd5, 0xfbd6], // ARABIC LETTER NG
    0x06af: [0xfb92, 0xfb93, 0xfb94, 0xfb95], // ARABIC LETTER GAF
    0x06b1: [0xfb9a, 0xfb9b, 0xfb9c, 0xfb9d], // ARABIC LETTER NGOEH
    0x06b3: [0xfb96, 0xfb97, 0xfb98, 0xfb99], // ARABIC LETTER GUEH
    0x06ba: [0xfb9e, 0xfb9f], // ARABIC LETTER NOON GHUNNA
    0x06bb: [0xfba0, 0xfba1, 0xfba2, 0xfba3], // ARABIC LETTER RNOON
    0x06be: [0xfbaa, 0xfbab, 0xfbac, 0xfbad], // ARABIC LETTER HEH DOACHASHMEE
    0x06c0: [0xfba4, 0xfba5], // ARABIC LETTER HEH WITH YEH ABOVE
    0x06c1: [0xfba6, 0xfba7, 0xfba8, 0xfba9], // ARABIC LETTER HEH GOAL
    0x06c5: [0xfbe0, 0xfbe1], // ARABIC LETTER KIRGHIZ OE
    0x06c6: [0xfbd9, 0xfbda], // ARABIC LETTER OE
    0x06c7: [0xfbd7, 0xfbd8], // ARABIC LETTER U
    0x06c8: [0xfbdb, 0xfbdc], // ARABIC LETTER YU
    0x06c9: [0xfbe2, 0xfbe3], // ARABIC LETTER KIRGHIZ YU
    0x06cb: [0xfbde, 0xfbdf], // ARABIC LETTER VE
    0x06cc: [0xfbfc, 0xfbfd, 0xfbfe, 0xfbff], // ARABIC LETTER FARSI YEH
    0x06d0: [0xfbe4, 0xfbe5, 0xfbe6, 0xfbe7], //ARABIC LETTER E
    0x06d2: [0xfbae, 0xfbaf], // ARABIC LETTER YEH BARREE
    0x06d3: [0xfbb0, 0xfbb1] // ARABIC LETTER YEH BARREE WITH HAMZA ABOVE
  };

  /*
    var ligaturesSubstitutionA = {
        0xFBEA: []// ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH ALEF ISOLATED FORM
    };
    */

  var ligatures = {
    0xfedf: {
      0xfe82: 0xfef5, // ARABIC LIGATURE LAM WITH ALEF WITH MADDA ABOVE ISOLATED FORM
      0xfe84: 0xfef7, // ARABIC LIGATURE LAM WITH ALEF WITH HAMZA ABOVE ISOLATED FORM
      0xfe88: 0xfef9, // ARABIC LIGATURE LAM WITH ALEF WITH HAMZA BELOW ISOLATED FORM
      0xfe8e: 0xfefb // ARABIC LIGATURE LAM WITH ALEF ISOLATED FORM
    },
    0xfee0: {
      0xfe82: 0xfef6, // ARABIC LIGATURE LAM WITH ALEF WITH MADDA ABOVE FINAL FORM
      0xfe84: 0xfef8, // ARABIC LIGATURE LAM WITH ALEF WITH HAMZA ABOVE FINAL FORM
      0xfe88: 0xfefa, // ARABIC LIGATURE LAM WITH ALEF WITH HAMZA BELOW FINAL FORM
      0xfe8e: 0xfefc // ARABIC LIGATURE LAM WITH ALEF FINAL FORM
    },
    0xfe8d: { 0xfedf: { 0xfee0: { 0xfeea: 0xfdf2 } } }, // ALLAH
    0x0651: {
      0x064c: 0xfc5e, // Shadda + Dammatan
      0x064d: 0xfc5f, // Shadda + Kasratan
      0x064e: 0xfc60, // Shadda + Fatha
      0x064f: 0xfc61, // Shadda + Damma
      0x0650: 0xfc62 // Shadda + Kasra
    }
  };

  var arabic_diacritics = {
    1612: 64606, // Shadda + Dammatan
    1613: 64607, // Shadda + Kasratan
    1614: 64608, // Shadda + Fatha
    1615: 64609, // Shadda + Damma
    1616: 64610 // Shadda + Kasra
  };

  var alfletter = [1570, 1571, 1573, 1575];

  var noChangeInForm = -1;
  var isolatedForm = 0;
  var finalForm = 1;
  var initialForm = 2;
  var medialForm = 3;

  jsPDFAPI.__arabicParser__ = {};

  //private
  var isInArabicSubstitutionA = (jsPDFAPI.__arabicParser__.isInArabicSubstitutionA = function(
    letter
  ) {
    return typeof arabicSubstitionA[letter.charCodeAt(0)] !== "undefined";
  });

  var isArabicLetter = (jsPDFAPI.__arabicParser__.isArabicLetter = function(
    letter
  ) {
    return (
      typeof letter === "string" &&
      /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/.test(
        letter
      )
    );
  });

  var isArabicEndLetter = (jsPDFAPI.__arabicParser__.isArabicEndLetter = function(
    letter
  ) {
    return (
      isArabicLetter(letter) &&
      isInArabicSubstitutionA(letter) &&
      arabicSubstitionA[letter.charCodeAt(0)].length <= 2
    );
  });

  var isArabicAlfLetter = (jsPDFAPI.__arabicParser__.isArabicAlfLetter = function(
    letter
  ) {
    return (
      isArabicLetter(letter) && alfletter.indexOf(letter.charCodeAt(0)) >= 0
    );
  });

  jsPDFAPI.__arabicParser__.arabicLetterHasIsolatedForm = function(letter) {
    return (
      isArabicLetter(letter) &&
      isInArabicSubstitutionA(letter) &&
      arabicSubstitionA[letter.charCodeAt(0)].length >= 1
    );
  };

  var arabicLetterHasFinalForm = (jsPDFAPI.__arabicParser__.arabicLetterHasFinalForm = function(
    letter
  ) {
    return (
      isArabicLetter(letter) &&
      isInArabicSubstitutionA(letter) &&
      arabicSubstitionA[letter.charCodeAt(0)].length >= 2
    );
  });

  jsPDFAPI.__arabicParser__.arabicLetterHasInitialForm = function(letter) {
    return (
      isArabicLetter(letter) &&
      isInArabicSubstitutionA(letter) &&
      arabicSubstitionA[letter.charCodeAt(0)].length >= 3
    );
  };

  var arabicLetterHasMedialForm = (jsPDFAPI.__arabicParser__.arabicLetterHasMedialForm = function(
    letter
  ) {
    return (
      isArabicLetter(letter) &&
      isInArabicSubstitutionA(letter) &&
      arabicSubstitionA[letter.charCodeAt(0)].length == 4
    );
  });

  var resolveLigatures = (jsPDFAPI.__arabicParser__.resolveLigatures = function(
    letters
  ) {
    var i = 0;
    var tmpLigatures = ligatures;
    var result = "";
    var effectedLetters = 0;

    for (i = 0; i < letters.length; i += 1) {
      if (typeof tmpLigatures[letters.charCodeAt(i)] !== "undefined") {
        effectedLetters++;
        tmpLigatures = tmpLigatures[letters.charCodeAt(i)];

        if (typeof tmpLigatures === "number") {
          result += String.fromCharCode(tmpLigatures);
          tmpLigatures = ligatures;
          effectedLetters = 0;
        }
        if (i === letters.length - 1) {
          tmpLigatures = ligatures;
          result += letters.charAt(i - (effectedLetters - 1));
          i = i - (effectedLetters - 1);
          effectedLetters = 0;
        }
      } else {
        tmpLigatures = ligatures;
        result += letters.charAt(i - effectedLetters);
        i = i - effectedLetters;
        effectedLetters = 0;
      }
    }

    return result;
  });

  jsPDFAPI.__arabicParser__.isArabicDiacritic = function(letter) {
    return (
      letter !== undefined &&
      arabic_diacritics[letter.charCodeAt(0)] !== undefined
    );
  };

  var getCorrectForm = (jsPDFAPI.__arabicParser__.getCorrectForm = function(
    currentChar,
    beforeChar,
    nextChar
  ) {
    if (!isArabicLetter(currentChar)) {
      return -1;
    }

    if (isInArabicSubstitutionA(currentChar) === false) {
      return noChangeInForm;
    }
    if (
      !arabicLetterHasFinalForm(currentChar) ||
      (!isArabicLetter(beforeChar) && !isArabicLetter(nextChar)) ||
      (!isArabicLetter(nextChar) && isArabicEndLetter(beforeChar)) ||
      (isArabicEndLetter(currentChar) && !isArabicLetter(beforeChar)) ||
      (isArabicEndLetter(currentChar) && isArabicAlfLetter(beforeChar)) ||
      (isArabicEndLetter(currentChar) && isArabicEndLetter(beforeChar))
    ) {
      return isolatedForm;
    }

    if (
      arabicLetterHasMedialForm(currentChar) &&
      isArabicLetter(beforeChar) &&
      !isArabicEndLetter(beforeChar) &&
      isArabicLetter(nextChar) &&
      arabicLetterHasFinalForm(nextChar)
    ) {
      return medialForm;
    }

    if (isArabicEndLetter(currentChar) || !isArabicLetter(nextChar)) {
      return finalForm;
    }
    return initialForm;
  });

  /**
   * @name processArabic
   * @function
   * @param {string} text
   * @returns {string}
   */
  var parseArabic = function(text) {
    text = text || "";

    var result = "";
    var i = 0;
    var j = 0;
    var position = 0;
    var currentLetter = "";
    var prevLetter = "";
    var nextLetter = "";

    var words = text.split("\\s+");
    var newWords = [];
    for (i = 0; i < words.length; i += 1) {
      newWords.push("");
      for (j = 0; j < words[i].length; j += 1) {
        currentLetter = words[i][j];
        prevLetter = words[i][j - 1];
        nextLetter = words[i][j + 1];
        if (isArabicLetter(currentLetter)) {
          position = getCorrectForm(currentLetter, prevLetter, nextLetter);
          if (position !== -1) {
            newWords[i] += String.fromCharCode(
              arabicSubstitionA[currentLetter.charCodeAt(0)][position]
            );
          } else {
            newWords[i] += currentLetter;
          }
        } else {
          newWords[i] += currentLetter;
        }
      }

      newWords[i] = resolveLigatures(newWords[i]);
    }
    result = newWords.join(" ");

    return result;
  };

  var processArabic = (jsPDFAPI.__arabicParser__.processArabic = jsPDFAPI.processArabic = function() {
    var text =
      typeof arguments[0] === "string" ? arguments[0] : arguments[0].text;
    var tmpText = [];
    var result;

    if (Array.isArray(text)) {
      var i = 0;
      tmpText = [];
      for (i = 0; i < text.length; i += 1) {
        if (Array.isArray(text[i])) {
          tmpText.push([parseArabic(text[i][0]), text[i][1], text[i][2]]);
        } else {
          tmpText.push([parseArabic(text[i])]);
        }
      }
      result = tmpText;
    } else {
      result = parseArabic(text);
    }
    if (typeof arguments[0] === "string") {
      return result;
    } else {
      arguments[0].text = result;
      return arguments[0];
    }
  });

  jsPDFAPI.events.push(["preProcessText", processArabic]);
})(jsPDF.API);
