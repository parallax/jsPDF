/**
 * jsPDF ViewPreferences Plugin
 * @author Aras Abbasi (github.com/aras.abbasi)
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

 /**
 * Adds the ability to set ViewPreferences
 *
 * @returns {jsPDF}
 * @name viewpreferences
 * @example
 * var doc = new jsPDF()
 * doc.text(10, 10, 'This is a test')
 * doc.viewPrefences.fitWindow(true);
 * doc.save('viewPreferences.pdf')
 */

(function (jsPDFAPI) {
	'use strict';

  jsPDFAPI.viewPreferences = (function () {

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}
	var configuration = {
        "HideToolbar"               : {defaultValue : false, value : false, type: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.3},
        "HideMenubar"               : {defaultValue : false, value : false, type: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.3},
        "HideWindowUI"              : {defaultValue : false, value : false, type: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.3},
        "FitWindow"                 : {defaultValue : false, value : false, type: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.3},
        "CenterWindow"              : {defaultValue : false, value : false, type: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.3},
        "DisplayDocTitle"           : {defaultValue : false, value : false, type: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.4},
        "NonFullScreenPageMode"     : {defaultValue : 'UseNone', value : 'UseNone', type: 'name', explicitSet : false, valueSet : ['UseNone', 'UseOutlines', 'UseThumbs', 'UseOC'], pdfVersion : 1.3},
        "Direction"                 : {defaultValue : 'L2R', value : 'L2R', type: 'name', explicitSet : false, valueSet : ['L2R', 'R2L'], pdfVersion : 1.3},
        "ViewArea"                  : {defaultValue : 'CropBox', value : 'CropBox', type: 'name', explicitSet : false, valueSet : ['CropBox'], pdfVersion : 1.4},
        "ViewClip"                  : {defaultValue : 'CropBox', value : 'CropBox', type: 'name', explicitSet : false, valueSet : ['CropBox'], pdfVersion : 1.4},
        "PrintArea"                 : {defaultValue : 'CropBox', value : 'CropBox', type: 'name', explicitSet : false, valueSet : ['CropBox'], pdfVersion : 1.4},
        "PrintClip"                 : {defaultValue : 'CropBox', value : 'CropBox', type: 'name', explicitSet : false, valueSet : ['CropBox'], pdfVersion : 1.4},
        "PrintScaling"              : {defaultValue : 'AppDefault', value : 'AppDefault', type: 'name', explicitSet : false, valueSet : ['AppDefault', 'None'], pdfVersion : 1.6},
        "Duplex"                    : {defaultValue : 'none', value : 'none', type: 'name', explicitSet : false, valueSet : ['Simplex', 'DuplexFlipShortEdge', 'DuplexFlipLongEdge', 'none'], pdfVersion : 1.7},
        "PickTrayByPDFSize"         : {defaultValue : false, value : false, tyype: 'boolean', explicitSet : false, valueSet : [true, false], pdfVersion : 1.7},
        "PrintPageRange"            : {defaultValue : '', value : '', type: 'array', explicitSet : false, valueSet : null, pdfVersion : 1.7},
        "NumCopies"                 : {defaultValue : 1, value : 1, type: 'integer', explicitSet : false, valueSet : null, pdfVersion : 1.7}
    };

    // Constructor
    function ViewPreferences() {
    };

    ViewPreferences.prototype.generateDictionary = function () {
      var resultingDictionary = ['<<'];
      for (var vPref in configuration) {
        if (configuration[vPref].explicitSet === true) {
          resultingDictionary.push('/' + vPref + ' /' + configuration[vPref].value);
        }
      }

      resultingDictionary.push('>>');
      return resultingDictionary.join("\n");
    };
    
    function lowercaseFirstLetter(string) {
      return string.charAt(0).toLowerCase() + string.slice(1);
    }
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    (Object.keys(configuration)).forEach(
      function (method) {
        ViewPreferences.prototype[lowercaseFirstLetter(method)] = function (value) {
        return resolve(method, value);    
      };	
    });
    
    function resolve(method, value) {
      if (typeof value === "undefined") {
        return configuration[method].value;
      }
      if (configuration[method].type === "boolean" && typeof value === "boolean") {
        configuration[method].value = value; 
      } else if (configuration[method].type === "name" && configuration[method].valueSet.contains(value)) {
        configuration[method].value = value; 
      } else if (configuration[method].type === "integer" && Number.isInteger(value)) {
        configuration[method].value = value; 
      } else if (configuration[method].type === "array" && (value.length % 2 === 0) && !value.some(isNaN)) {
        configuration[method].value = value; 
      } else {
        configuration[method].value = configuration[method].defaultValue; 
      }
      configuration[method].explicitSet = true;
        return configuration[method].value;
    };
    return new ViewPreferences();
})();

  this.internal.events.subscribe("putCatalog", function () {
    this.internal.write("/ViewerPreferences " + jsPDFAPI.viewPreferences.generateDictionary());
  });
})(jsPDF.API);
