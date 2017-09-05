/**
 * jsPDF Template Plugin
 * @author Aras Abbasi (github.com/arasabbasi)
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

 /**
 * Adds the ability to generate templates
 *
 * @returns {jsPDF}
 * @name template
 */

(function (jsPDFAPI) {
    "use strict";


    function romanize(num, letterCase) {
        var lookup = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1};
        var roman = "";
        var i;
        var tmpNum = parseInt(num, 10);

        for (i in lookup) {
            while (tmpNum >= lookup[i]) {
                roman += i;
                tmpNum -= lookup[i];
            }
        }
        if (letterCase === "uppercase") {
            return roman.toUpperCase();
        }
        return roman.toLowerCase();
    }

    function _setTemplateVar(name, value) {
        if (this.internal.getCurrentPageInfo().pageContext.templateVariable === undefined) {
            this.internal.getCurrentPageInfo().pageContext.templateVariable = {};
        }

        if (typeof name === "string") {
            this.internal.getCurrentPageInfo().pageContext.templateVariable[name] = value;
        }
    }

    jsPDFAPI.setTemplateVar = function () {
        _setTemplateVar.apply(this, arguments);
        return this;
    };

    function _getTemplateVar(name, defaultValue) {
        var result = defaultValue || "";

        if (this.internal.getCurrentPageInfo().pageContext.templateVariable === undefined) {
            this.internal.getCurrentPageInfo().pageContext.templateVariable = {};
        }
        if (
            (typeof name === "string") &&
            (this.internal.getCurrentPageInfo().pageContext.templateVariable !== undefined) &&
            (this.internal.getCurrentPageInfo().pageContext.templateVariable[name] !== undefined)
        ) {
            result = this.internal.getCurrentPageInfo().pageContext.templateVariable[name];
        }
        return result;
    }

    jsPDFAPI.getTemplateVar = function () {
        return _getTemplateVar.apply(this, arguments);
    };

    jsPDFAPI.template = function (doc, options, func) {
        options = options || {};
        var pageCount = parseInt(doc.internal.getNumberOfPages(), 10);
        var totalPages = pageCount;
        var startRange = 1;
        var endRange = pageCount;
        var numberStyle = "arabic";
        var letterCase = "lowercase";
        var currentPageNumber = 0;
        var endPageNumber = pageCount;

        var i = 0;

        var hasOwnRange = options.hasOwnRange || false;

        var pageInfo;
        var currentNumberInOwnRange = 1;
        var totalNumberInOwnRange = 1;
        var currentPage = 1;

        //Ranges
        if (typeof options === "object" && typeof options.range === "object") {
            var range = options.range;
            startRange = 1;
            endRange = 1;

            if (range.start < 1) {
                startRange = 1;
            } else if (range.start > pageCount) {
                startRange = pageCount;
            } else if (range.start === undefined) {
                startRange = 1;
            } else {
                startRange = parseInt(range.start, 10);
            }

            if (range.end > pageCount) {
                endRange = pageCount;
            } else if (startRange > range.end) {
                endRange = startRange;
            } else if (range.end === undefined) {
                endRange = pageCount;
            } else {
                endRange = parseInt(range.end, 10);
            }
        }

        if (typeof options === "object" && typeof options.numberStyle === "string") {
            if (options.numberStyle === "roman") {
                numberStyle = "roman";
            } else {
                numberStyle = "arabic";
            }
        }
        if (typeof options === "object" && typeof options.letterCase === "string") {
            if (options.letterCase === "uppercase") {
                letterCase = "uppercase";
            } else {
                letterCase = "lowercase";
            }
        }

        if (hasOwnRange === true) {
            currentNumberInOwnRange = 1;
            totalNumberInOwnRange = endRange - startRange + 1;
        }

        for( i = 1; i < (pageCount + 1); i += 1) {
            doc.setPage(i);
            currentPage = parseInt(doc.internal.getCurrentPageInfo().pageNumber, 10);

            if (currentPage >= startRange && currentPage <= endRange) {
                currentNumberInOwnRange = parseInt(currentPage, 10) - startRange + 1;
                if (hasOwnRange === true) {
                    currentPageNumber   = currentNumberInOwnRange;
                    endPageNumber       = totalNumberInOwnRange;
                } else {
                    currentPageNumber   = currentPage;
                    endPageNumber       = totalPages;
                }

                if (numberStyle === "roman") {
                    currentPageNumber = romanize(currentPageNumber, letterCase);
                    endPageNumber = romanize(endPageNumber, letterCase);
                }
                pageInfo = {
                    totalPages:         totalPages,
                    currentPage:        currentPage,
                    currentPageNumber:  currentPageNumber,
                    endPageNumber:      endPageNumber
                };
                func(doc, pageInfo);
            }
        }
    };
})(jsPDF.API);
