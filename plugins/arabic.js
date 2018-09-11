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

    var arLangCodes = {
        "ar": "Arabic (Standard)",
        "ar-DZ": "Arabic (Algeria)",
        "ar-BH": "Arabic (Bahrain)",
        "ar-EG": "Arabic (Egypt)",
        "ar-IQ": "Arabic (Iraq)",
        "ar-JO": "Arabic (Jordan)",
        "ar-KW": "Arabic (Kuwait)",
        "ar-LB": "Arabic (Lebanon)",
        "ar-LY": "Arabic (Libya)",
        "ar-MA": "Arabic (Morocco)",
        "ar-OM": "Arabic (Oman)",
        "ar-QA": "Arabic (Qatar)",
        "ar-SA": "Arabic (Saudi Arabia)",
        "ar-SY": "Arabic (Syria)",
        "ar-TN": "Arabic (Tunisia)",
        "ar-AE": "Arabic (U.A.E.)",
        "ar-YE": "Arabic (Yemen)",
        "fa": "Persian",
        "fa-IR": "Persian/Iran",
        "ur": "Urdu"
    };

    var arLangCodesKeys = Object.keys(arLangCodes);

    /**
     * Arabic shape substitutions: char code => (isolated, final, initial, medial).
     */
    var arabicSubst = {
        1569: [65152],
        1570: [65153, 65154, 65153, 65154],
        1571: [65155, 65156, 65155, 65156],
        1572: [65157, 65158],
        1573: [65159, 65160, 65159, 65160],
        1574: [65161, 65162, 65163, 65164],
        1575: [65165, 65166, 65165, 65166],
        1576: [65167, 65168, 65169, 65170],
        1577: [65171, 65172],
        1578: [65173, 65174, 65175, 65176],
        1579: [65177, 65178, 65179, 65180],
        1580: [65181, 65182, 65183, 65184],
        1581: [65185, 65186, 65187, 65188],
        1582: [65189, 65190, 65191, 65192],
        1583: [65193, 65194, 65193],
        1584: [65195, 65196, 65195],
        1585: [65197, 65198, 65197],
        1586: [65199, 65200, 65199],
        1587: [65201, 65202, 65203, 65204],
        1588: [65205, 65206, 65207, 65208],
        1589: [65209, 65210, 65211, 65212],
        1590: [65213, 65214, 65215, 65216],
        1591: [65217, 65218, 65219, 65220],
        1592: [65221, 65222, 65223, 65224],
        1593: [65225, 65226, 65227, 65228],
        1594: [65229, 65230, 65231, 65232],
        1601: [65233, 65234, 65235, 65236],
        1602: [65237, 65238, 65239, 65240],
        1603: [65241, 65242, 65243, 65244],
        1604: [65245, 65246, 65247, 65248],
        1605: [65249, 65250, 65251, 65252],
        1606: [65253, 65254, 65255, 65256],
        1607: [65257, 65258, 65259, 65260],
        1608: [65261, 65262, 65261],
        1609: [65263, 65264, 64488, 64489],
        1610: [65265, 65266, 65267, 65268],
        1649: [64336, 64337],
        1655: [64477],
        1657: [64358, 64359, 64360, 64361],
        1658: [64350, 64351, 64352, 64353],
        1659: [64338, 64339, 64340, 64341],
        1662: [64342, 64343, 64344, 64345],
        1663: [64354, 64355, 64356, 64357],
        1664: [64346, 64347, 64348, 64349],
        1667: [64374, 64375, 64376, 64377],
        1668: [64370, 64371, 64372, 64373],
        1670: [64378, 64379, 64380, 64381],
        1671: [64382, 64383, 64384, 64385],
        1672: [64392, 64393],
        1676: [64388, 64389],
        1677: [64386, 64387],
        1678: [64390, 64391],
        1681: [64396, 64397],
        1688: [64394, 64395, 64394],
        1700: [64362, 64363, 64364, 64365],
        1702: [64366, 64367, 64368, 64369],
        1705: [64398, 64399, 64400, 64401],
        1709: [64467, 64468, 64469, 64470],
        1711: [64402, 64403, 64404, 64405],
        1713: [64410, 64411, 64412, 64413],
        1715: [64406, 64407, 64408, 64409],
        1722: [64414, 64415],
        1723: [64416, 64417, 64418, 64419],
        1726: [64426, 64427, 64428, 64429],
        1728: [64420, 64421],
        1729: [64422, 64423, 64424, 64425],
        1733: [64480, 64481],
        1734: [64473, 64474],
        1735: [64471, 64472],
        1736: [64475, 64476],
        1737: [64482, 64483],
        1739: [64478, 64479],
        1740: [64508, 64509, 64510, 64511],
        1744: [64484, 64485, 64486, 64487],
        1746: [64430, 64431],
        1747: [64432, 64433]
    };
    var arabiclaasubst = {
        1570: [65269, 65270, 65269, 65270],
        1571: [65271, 65272, 65271, 65272],
        1573: [65273, 65274, 65273, 65274],
        1575: [65275, 65276, 65275, 65276]
    };
    var arabicorigsubst = {
        1570: [65153, 65154, 65153, 65154],
        1571: [65155, 65156, 65155, 65156],
        1573: [65159, 65160, 65159, 65160],
        1575: [65165, 65166, 65165, 65166]
    };
    var arabic_diacritics = {
        1612: 64606, // Shadda + Dammatan
        1613: 64607, // Shadda + Kasratan
        1614: 64608, // Shadda + Fatha
        1615: 64609, // Shadda + Damma
        1616: 64610  // Shadda + Kasra
    };

    var alfletter = [1570, 1571, 1573, 1575];
    var endedletter = [1569, 1570, 1571, 1572, 1573, 1575, 1577, 1583, 1584, 1585, 1586, 1608, 1688];

    var isolatedForm = 0;
    var finalForm = 1;
    var initialForm = 2;
    var medialForm = 3;

    //private
    function isArabicLetter(letter) {
        return (letter !== undefined && arabicSubst[letter.charCodeAt(0)] !== undefined);
    }

    function isArabicEndLetter(letter) {
        return (letter !== undefined && endedletter.indexOf(letter.charCodeAt(0)) >= 0);
    }

    function isArabicAlfLetter(letter) {
        return (letter !== undefined && alfletter.indexOf(letter.charCodeAt(0)) >= 0);
    }

    function arabicLetterHasIsolatedForm(letter) {
        return (isArabicLetter(letter) && (arabicSubst[letter.charCodeAt(0)].length >= 1));
    }

    function arabicLetterHasFinalForm(letter) {
        return (isArabicLetter(letter) && (arabicSubst[letter.charCodeAt(0)].length >= 2));
    }

    function arabicLetterHasInitialForm(letter) {
        return (isArabicLetter(letter) && (arabicSubst[letter.charCodeAt(0)].length >= 3));
    }

    function arabicLetterHasMedialForm(letter) {
        return (isArabicLetter(letter) && (arabicSubst[letter.charCodeAt(0)].length == 4));
    }

    function isArabicDiacritic(letter) {
        return (letter !== undefined && arabic_diacritics[letter.charCodeAt(0)] !== undefined);
    }

    function getCorrectForm(currentChar, beforeChar, nextChar, arabicSubstition) {
        var result = 3;
        if (!isArabicLetter(currentChar)) {
            return -1;
        }

        arabicSubstition = arabicSubstition || {};
        arabicSubst = Object.assign(arabicSubst, arabicSubstition);

        
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
            arabicSubst = Object.assign(arabicSubst, arabicorigsubst);
            return isolatedForm;
        }
        
        if (
            arabicLetterHasMedialForm(currentChar)
            && isArabicLetter(beforeChar)
            && !isArabicEndLetter(beforeChar)
            && isArabicLetter(nextChar)
            && arabicLetterHasFinalForm(nextChar)
        ) {
            arabicSubst = Object.assign(arabicSubst, arabicorigsubst);
            return medialForm;
        }
        
        if (
            isArabicEndLetter(currentChar)
            || 
            (
                !isArabicLetter(nextChar)
                
            )
        ) {
            arabicSubst = Object.assign(arabicSubst, arabicorigsubst);
            return finalForm;
        }
        
        arabicSubst = Object.assign(arabicSubst, arabicorigsubst);
        return initialForm;
    }
	
	var commonSubstition = function (character) {
		var replacementTable = {
			'(': ')',
			')': '('
		}
		return replacementTable[character] || character;
	}

	/**
	* @name processArabic
	* @function
	* @param {string} text
	* @param {boolean} reverse
	* @returns {string}
	*/
    var processArabic = jsPDFAPI.processArabic = function (text, reverse) {
        text = text || "";
		reverse = reverse || false;
		
        var result = "";
        var i = 0;
        var position = 0;
        var currentLetter = "";
        var prevLetter = "";
        var nextLetter = "";
        var resultingLetter;

        var localPrevLetter;
        var localCurrentLetter;
        var localNextLetter;

        for (i = 0; i < text.length; i += 1) {
            currentLetter = text[i];
            prevLetter = text[i - 1];
            nextLetter = text[i + 1];
            if (!isArabicLetter(currentLetter)) {
                result += reverse ? commonSubstition(currentLetter) : currentLetter;
            } else {
                if (
                    (prevLetter !== undefined)
                    && (prevLetter.charCodeAt(0) === 1604)
                    && isArabicAlfLetter(currentLetter)
                ) {
                    localPrevLetter = text[i - 2];
                    localCurrentLetter = currentLetter;
                    localNextLetter = text[i + 1];
                    position = getCorrectForm(localCurrentLetter, localPrevLetter, localNextLetter, arabiclaasubst);
                    resultingLetter = String.fromCharCode(arabiclaasubst[currentLetter.charCodeAt(0)][position]);
                    result = result.substr(0, result.length - 1) + resultingLetter;
                } else if (
                    (
                        prevLetter !== undefined
                        && (prevLetter.charCodeAt(0) === 1617)
                    )
                    && isArabicDiacritic(currentLetter)
                ) {
                    localPrevLetter = text[i - 2];
                    localCurrentLetter = currentLetter;
                    localNextLetter = text[i + 1];
                    position = getCorrectForm(localCurrentLetter, localPrevLetter, localNextLetter, arabicorigsubst);
                    resultingLetter = String.fromCharCode(arabic_diacritics[currentLetter.charCodeAt(0)][position]);
                    result = result.substr(0, result.length - 1) + resultingLetter;
                } else {
                    position = getCorrectForm(currentLetter, prevLetter, nextLetter, arabicorigsubst);
                    result += String.fromCharCode(arabicSubst[currentLetter.charCodeAt(0)][position]);
                }
            }
        }
        return (reverse) ? result.split("").reverse().join("") : result;
    }

    var arabicParserFunction = function (args) {
        var text = args.text;
        var x = args.x;
        var y = args.y;
        var options = args.options || {};
        var mutex = args.mutex || {};
        var lang = options.lang;
        var tmpText = [];

        if (arLangCodesKeys.indexOf(lang) >= 0) {
            if (Object.prototype.toString.call(text) === '[object Array]') {
                var i = 0;
                tmpText = [];
                for (i = 0; i < text.length; i += 1) {
                    if (Object.prototype.toString.call(text[i]) === '[object Array]') {
                        tmpText.push([processArabic(text[i][0], true), text[i][1], text[i][2]]);
                    } else {
                        tmpText.push([processArabic(text[i], true)]);
                    }
                }
                args.text = tmpText;
            } else {
                args.text = processArabic(text, true);
            }
            //force charSpace if not given.
            if (options.charSpace === undefined) {
                args.options.charSpace = 0;
            }
            //if R2L is true, set it false.
            if (options.R2L === true) {
                args.options.R2L = false;
            }
        }
    };

    jsPDFAPI.events.push([ 
    	'preProcessText'
    	,arabicParserFunction
    ]);
    
})(jsPDF.API);
