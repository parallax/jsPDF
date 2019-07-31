/* global jsPDF */
/**
 * @license
 * Copyright (c) 2017 Aras Abbasi 
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
* jsPDF arabic parser PlugIn
*
* @name arabic
* @module
*/
(function (jsPDFAPI) {
    "use strict";

    /**
     * Arabic shape substitutions: char code => (isolated, final, initial, medial).
     * Arabic Substition A
     */
    var arabicSubstitionA = {
        0x0621: [0xFE80],                         // ARABIC LETTER HAMZA 
        0x0622: [0xFE81, 0xFE82],                 // ARABIC LETTER ALEF WITH MADDA ABOVE
        0x0623: [0xFE83, 0xFE84],                 // ARABIC LETTER ALEF WITH HAMZA ABOVE
        0x0624: [0xFE85, 0xFE86],                 // ARABIC LETTER WAW WITH HAMZA ABOVE
        0x0625: [0xFE87, 0xFE88],                 // ARABIC LETTER ALEF WITH HAMZA BELOW
        0x0626: [0xFE89, 0xFE8A, 0xFE8B, 0xFE8C], // ARABIC LETTER YEH WITH HAMZA ABOVE 
        0x0627: [0xFE8D, 0xFE8E],                 // ARABIC LETTER ALEF
        0x0628: [0xFE8F, 0xFE90, 0xFE91, 0xFE92], // ARABIC LETTER BEH
        0x0629: [0xFE93, 0xFE94],                 // ARABIC LETTER TEH MARBUTA 
        0x062A: [0xFE95, 0xFE96, 0xFE97, 0xFE98], // ARABIC LETTER TEH
        0x062B: [0xFE99, 0xFE9A, 0xFE9B, 0xFE9C], // ARABIC LETTER THEH
        0x062C: [0xFE9D, 0xFE9E, 0xFE9F, 0xFEA0], // ARABIC LETTER JEEM
        0x062D: [0xFEA1, 0xFEA2, 0xFEA3, 0xFEA4], // ARABIC LETTER HAH
        0x062E: [0xFEA5, 0xFEA6, 0xFEA7, 0xFEA8], // ARABIC LETTER KHAH
        0x062F: [0xFEA9, 0xFEAA],                 // ARABIC LETTER DAL
        0x0630: [0xFEAB, 0xFEAC],                 // ARABIC LETTER THAL
        0x0631: [0xFEAD, 0xFEAE],                 // ARABIC LETTER REH
        0x0632: [0xFEAF, 0xFEB0],                 // ARABIC LETTER ZAIN
        0x0633: [0xFEB1, 0xFEB2, 0xFEB3, 0xFEB4], // ARABIC LETTER SEEN
        0x0634: [0xFEB5, 0xFEB6, 0xFEB7, 0xFEB8], // ARABIC LETTER SHEEN 
        0x0635: [0xFEB9, 0xFEBA, 0xFEBB, 0xFEBC], // ARABIC LETTER SAD
        0x0636: [0xFEBD, 0xFEBE, 0xFEBF, 0xFEC0], // ARABIC LETTER DAD
        0x0637: [0xFEC1, 0xFEC2, 0xFEC3, 0xFEC4], // ARABIC LETTER TAH
        0x0638: [0xFEC5, 0xFEC6, 0xFEC7, 0xFEC8], // ARABIC LETTER ZAH
        0x0639: [0xFEC9, 0xFECA, 0xFECB, 0xFECC], // ARABIC LETTER AIN
        0x063A: [0xFECD, 0xFECE, 0xFECF, 0xFED0], // ARABIC LETTER GHAIN 
        0x0641: [0xFED1, 0xFED2, 0xFED3, 0xFED4], // ARABIC LETTER FEH
        0x0642: [0xFED5, 0xFED6, 0xFED7, 0xFED8], // ARABIC LETTER QAF
        0x0643: [0xFED9, 0xFEDA, 0xFEDB, 0xFEDC], // ARABIC LETTER KAF
        0x0644: [0xFEDD, 0xFEDE, 0xFEDF, 0xFEE0], // ARABIC LETTER LAM
        0x0645: [0xFEE1, 0xFEE2, 0xFEE3, 0xFEE4], // ARABIC LETTER MEEM
        0x0646: [0xFEE5, 0xFEE6, 0xFEE7, 0xFEE8], // ARABIC LETTER NOON 
        0x0647: [0xFEE9, 0xFEEA, 0xFEEB, 0xFEEC], // ARABIC LETTER HEH
        0x0648: [0xFEED, 0xFEEE],                 // ARABIC LETTER WAW
        0x0649: [0xFEEF, 0xFEF0, 64488, 64489],   // ARABIC LETTER ALEF MAKSURA 
        0x064A: [0xFEF1, 0xFEF2, 0xFEF3, 0xFEF4], // ARABIC LETTER YEH
        0x0671: [0xFB50, 0xFB51],                 // ARABIC LETTER ALEF WASLA
        0x0677: [0xFBDD],                         // ARABIC LETTER U WITH HAMZA ABOVE
        0x0679: [0xFB66, 0xFB67, 0xFB68, 0xFB69], // ARABIC LETTER TTEH
        0x067A: [0xFB5E, 0xFB5F, 0xFB60, 0xFB61], // ARABIC LETTER TTEHEH
        0x067B: [0xFB52, 0xFB53, 0xFB54, 0xFB55], // ARABIC LETTER BEEH
        0x067E: [0xFB56, 0xFB57, 0xFB58, 0xFB59], // ARABIC LETTER PEH 
        0x067F: [0xFB62, 0xFB63, 0xFB64, 0xFB65], // ARABIC LETTER TEHEH
        0x0680: [0xFB5A, 0xFB5B, 0xFB5C, 0xFB5D], // ARABIC LETTER BEHEH
        0x0683: [0xFB76, 0xFB77, 0xFB78, 0xFB79], // ARABIC LETTER NYEH
        0x0684: [0xFB72, 0xFB73, 0xFB74, 0xFB75], // ARABIC LETTER DYEH
        0x0686: [0xFB7A, 0xFB7B, 0xFB7C, 0xFB7D], // ARABIC LETTER TCHEH
        0x0687: [0xFB7E, 0xFB7F, 0xFB80, 0xFB81], // ARABIC LETTER TCHEHEH
        0x0688: [0xFB88, 0xFB89],                 // ARABIC LETTER DDAL
        0x068C: [0xFB84, 0xFB85],                 // ARABIC LETTER DAHAL
        0x068D: [0xFB82, 0xFB83],                 // ARABIC LETTER DDAHAL
        0x068E: [0xFB86, 0xFB87],                 // ARABIC LETTER DUL 
        0x0691: [0xFB8C, 0xFB8D],                 // ARABIC LETTER RREH
        0x0698: [0xFB8A, 0xFB8B],                 // ARABIC LETTER JEH
        0x06A4: [0xFB6A, 0xFB6B, 0xFB6C, 0xFB6D], // ARABIC LETTER VEH
        0x06A6: [0xFB6E, 0xFB6F, 0xFB70, 0xFB71], // ARABIC LETTER PEHEH
        0x06A9: [0xFB8E, 0xFB8F, 0xFB90, 0xFB91], // ARABIC LETTER KEHEH
        0x06AD: [0xFBD3, 0xFBD4, 0xFBD5, 0xFBD6], // ARABIC LETTER NG
        0x06AF: [0xFB92, 0xFB93, 0xFB94, 0xFB95], // ARABIC LETTER GAF
        0x06B1: [0xFB9A, 0xFB9B, 0xFB9C, 0xFB9D], // ARABIC LETTER NGOEH
        0x06B3: [0xFB96, 0xFB97, 0xFB98, 0xFB99], // ARABIC LETTER GUEH
        0x06BA: [0xFB9E, 0xFB9F],                 // ARABIC LETTER NOON GHUNNA
        0x06BB: [0xFBA0, 0xFBA1, 0xFBA2, 0xFBA3], // ARABIC LETTER RNOON
        0x06BE: [0xFBAA, 0xFBAB, 0xFBAC, 0xFBAD], // ARABIC LETTER HEH DOACHASHMEE
        0x06C0: [0xFBA4, 0xFBA5],                 // ARABIC LETTER HEH WITH YEH ABOVE
        0x06C1: [0xFBA6, 0xFBA7, 0xFBA8, 0xFBA9], // ARABIC LETTER HEH GOAL
        0x06C5: [0xFBE0, 0xFBE1],                 // ARABIC LETTER KIRGHIZ OE
        0x06C6: [0xFBD9, 0xFBDA],                 // ARABIC LETTER OE
        0x06C7: [0xFBD7, 0xFBD8],                 // ARABIC LETTER U
        0x06C8: [0xFBDB, 0xFBDC],                 // ARABIC LETTER YU
        0x06C9: [0xFBE2, 0xFBE3],                 // ARABIC LETTER KIRGHIZ YU
        0x06CB: [0xFBDE, 0xFBDF],                 // ARABIC LETTER VE
        0x06CC: [0xFBFC, 0xFBFD, 0xFBFE, 0xFBFF], // ARABIC LETTER FARSI YEH
        0x06D0: [0xFBE4, 0xFBE5, 0xFBE6, 0xFBE7], //ARABIC LETTER E
        0x06D2: [0xFBAE, 0xFBAF],                 // ARABIC LETTER YEH BARREE
        0x06D3: [0xFBB0, 0xFBB1],                 // ARABIC LETTER YEH BARREE WITH HAMZA ABOVE
    };

    /*
    var ligaturesSubstitutionA = {
        0xFBEA: []// ARABIC LIGATURE YEH WITH HAMZA ABOVE WITH ALEF ISOLATED FORM
    };
    */

    var ligatures = {
        0xFEDF: {
            0xFE82: 0xFEF5, // ARABIC LIGATURE LAM WITH ALEF WITH MADDA ABOVE ISOLATED FORM
            0xFE84: 0xFEF7, // ARABIC LIGATURE LAM WITH ALEF WITH HAMZA ABOVE ISOLATED FORM
            0xFE88: 0xFEF9, // ARABIC LIGATURE LAM WITH ALEF WITH HAMZA BELOW ISOLATED FORM
            0xFE8E: 0xFEFB  // ARABIC LIGATURE LAM WITH ALEF ISOLATED FORM
        },
        0xFEE0: {
            0xFE82: 0xFEF6, // ARABIC LIGATURE LAM WITH ALEF WITH MADDA ABOVE FINAL FORM
            0xFE84: 0xFEF8, // ARABIC LIGATURE LAM WITH ALEF WITH HAMZA ABOVE FINAL FORM
            0xFE88: 0xFEFA, // ARABIC LIGATURE LAM WITH ALEF WITH HAMZA BELOW FINAL FORM
            0xFE8E: 0xFEFC  // ARABIC LIGATURE LAM WITH ALEF FINAL FORM
        },
        0xFE8D: { 0xFEDF: { 0xFEE0: { 0xFEEA: 0xFDF2 } } }, // ALLAH
        0x0651: {
            0x064C: 0xFC5E, // Shadda + Dammatan
            0x064D: 0xFC5F, // Shadda + Kasratan
            0x064E: 0xFC60, // Shadda + Fatha
            0x064F: 0xFC61, // Shadda + Damma
            0x0650: 0xFC62, // Shadda + Kasra
        }
    };

    var arabic_diacritics = {
        1612: 64606, // Shadda + Dammatan
        1613: 64607, // Shadda + Kasratan
        1614: 64608, // Shadda + Fatha
        1615: 64609, // Shadda + Damma
        1616: 64610  // Shadda + Kasra
    };

    var alfletter = [1570, 1571, 1573, 1575];

    var noChangeInForm = -1;
    var isolatedForm = 0;
    var finalForm = 1;
    var initialForm = 2;
    var medialForm = 3;

    jsPDFAPI.__arabicParser__ = {};

    //private
    var isInArabicSubstitutionA = jsPDFAPI.__arabicParser__.isInArabicSubstitutionA = function (letter) {
        return (typeof arabicSubstitionA[letter.charCodeAt(0)] !== "undefined");
    };

    var isArabicLetter = jsPDFAPI.__arabicParser__.isArabicLetter = function (letter) {
        return (typeof letter === "string" && /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/.test(letter));
    };

    var isArabicEndLetter = jsPDFAPI.__arabicParser__.isArabicEndLetter = function (letter) {
        return (isArabicLetter(letter) && isInArabicSubstitutionA(letter) && arabicSubstitionA[letter.charCodeAt(0)].length <= 2);
    };

    var isArabicAlfLetter = jsPDFAPI.__arabicParser__.isArabicAlfLetter = function (letter) {
        return (isArabicLetter(letter) && alfletter.indexOf(letter.charCodeAt(0)) >= 0);
    };

    jsPDFAPI.__arabicParser__.arabicLetterHasIsolatedForm = function (letter) {
        return (isArabicLetter(letter) && isInArabicSubstitutionA(letter) && (arabicSubstitionA[letter.charCodeAt(0)].length >= 1));
    };

    var arabicLetterHasFinalForm = jsPDFAPI.__arabicParser__.arabicLetterHasFinalForm = function (letter) {
        return (isArabicLetter(letter) && isInArabicSubstitutionA(letter) && (arabicSubstitionA[letter.charCodeAt(0)].length >= 2));
    };

    jsPDFAPI.__arabicParser__.arabicLetterHasInitialForm = function (letter) {
        return (isArabicLetter(letter) && isInArabicSubstitutionA(letter) && (arabicSubstitionA[letter.charCodeAt(0)].length >= 3));
    };

    var arabicLetterHasMedialForm = jsPDFAPI.__arabicParser__.arabicLetterHasMedialForm = function (letter) {
        return (isArabicLetter(letter) && isInArabicSubstitutionA(letter) && arabicSubstitionA[letter.charCodeAt(0)].length == 4);
    };

    var resolveLigatures = jsPDFAPI.__arabicParser__.resolveLigatures = function (letters) {
        var i = 0;
        var tmpLigatures = ligatures;
        var result = '';
        var effectedLetters = 0;

        for (i = 0; i < letters.length; i += 1) {
            if (typeof tmpLigatures[letters.charCodeAt(i)] !== "undefined") {
                effectedLetters++;
                tmpLigatures = tmpLigatures[letters.charCodeAt(i)];

                if (typeof (tmpLigatures) === "number") {
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
    };

    jsPDFAPI.__arabicParser__.isArabicDiacritic = function (letter) {
        return (letter !== undefined && arabic_diacritics[letter.charCodeAt(0)] !== undefined);
    };

    var getCorrectForm = jsPDFAPI.__arabicParser__.getCorrectForm = function (currentChar, beforeChar, nextChar) {
        if (!isArabicLetter(currentChar)) {
            return -1;
        }

        if (isInArabicSubstitutionA(currentChar) === false) {
            return noChangeInForm;
        }
        if (
            !arabicLetterHasFinalForm(currentChar)
            ||
            (
                !isArabicLetter(beforeChar)
                && !isArabicLetter(nextChar)
            )
            ||
            (
                !isArabicLetter(nextChar)
                && isArabicEndLetter(beforeChar)
            )
            ||
            (
                isArabicEndLetter(currentChar)
                && !isArabicLetter(beforeChar)
            )
            ||
            (
                isArabicEndLetter(currentChar)
                && isArabicAlfLetter(beforeChar)
            )
            ||
            (
                isArabicEndLetter(currentChar)
                && isArabicEndLetter(beforeChar)
            )
        ) {
            return isolatedForm;
        }

        if (
            arabicLetterHasMedialForm(currentChar)
            && isArabicLetter(beforeChar)
            && !isArabicEndLetter(beforeChar)
            && isArabicLetter(nextChar)
            && arabicLetterHasFinalForm(nextChar)
        ) {
            return medialForm;
        }

        if (
            isArabicEndLetter(currentChar)
            ||
            (
                !isArabicLetter(nextChar)

            )
        ) {
            return finalForm;
        }
        return initialForm;
    };

    /**
    * @name processArabic
    * @function
    * @param {string} text
    * @returns {string}
    */
    var parseArabic = function (text) {
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
            newWords.push('');
            for (j = 0; j < words[i].length; j += 1) {
                currentLetter = words[i][j];
                prevLetter = words[i][j - 1];
                nextLetter = words[i][j + 1];
                if (isArabicLetter(currentLetter)) {
                    position = getCorrectForm(currentLetter, prevLetter, nextLetter);
                    if (position !== -1) {
                        newWords[i] += String.fromCharCode(arabicSubstitionA[currentLetter.charCodeAt(0)][position]);
                    } else {
                        newWords[i] += currentLetter;
                    }
                } else {
                    newWords[i] += currentLetter;
                }
            }

            newWords[i] = resolveLigatures(newWords[i]);
        }
        result = newWords.join(' ');

        return result;
    };

    var processArabic = jsPDFAPI.__arabicParser__.processArabic = jsPDFAPI.processArabic = function () {
        var text = (typeof arguments[0] === 'string') ? arguments[0] : arguments[0].text;
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
        if (typeof arguments[0] === 'string') {
            return result;
        } else {
            arguments[0].text = result;
            return arguments[0];
        } 
    };

    jsPDFAPI.events.push([
        'preProcessText'
        , processArabic
    ]);

})(jsPDF.API);
