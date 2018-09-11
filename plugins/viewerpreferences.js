/**
 * jsPDF viewerPreferences Plugin
 * @author Aras Abbasi (github.com/arasabbasi)
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

 /**
 * Adds the ability to set ViewerPreferences and by thus
 * controlling the way the document is to be presented on the
 * screen or in print.
 * @name viewerpreferences
 * @module
 */
(function (jsPDFAPI) {
    "use strict";
    /**
     * Set the ViewerPreferences of the generated PDF
     *
     * @name viewerPreferences
	 * @function
	 * @public
     * @param {Object} options Array with the ViewerPreferences<br />
     * Example: doc.viewerPreferences({"FitWindow":true});<br />
     * <br />
     * You can set following preferences:<br />
     * <br/>
     * <b>HideToolbar</b> <i>(boolean)</i><br />
     * Default value: false<br />
     * <br />
     * <b>HideMenubar</b> <i>(boolean)</i><br />
     * Default value: false.<br />
     * <br />
     * <b>HideWindowUI</b> <i>(boolean)</i><br />
     * Default value: false.<br />
     * <br />
     * <b>FitWindow</b> <i>(boolean)</i><br />
     * Default value: false.<br />
     * <br />
     * <b>CenterWindow</b> <i>(boolean)</i><br />
     * Default value: false<br />
     * <br />
     * <b>DisplayDocTitle</b> <i>(boolean)</i><br />
     * Default value: false.<br />
     * <br />
     * <b>NonFullScreenPageMode</b> <i>(string)</i><br />
     * Possible values: UseNone, UseOutlines, UseThumbs, UseOC<br />
     * Default value: UseNone<br/>
     * <br />
     * <b>Direction</b> <i>(string)</i><br />
     * Possible values: L2R, R2L<br />
     * Default value: L2R.<br />
     * <br />
     * <b>ViewArea</b> <i>(string)</i><br />
     * Possible values: MediaBox, CropBox, TrimBox, BleedBox, ArtBox<br />
     * Default value: CropBox.<br />
     * <br />
     * <b>ViewClip</b> <i>(string)</i><br />
     * Possible values: MediaBox, CropBox, TrimBox, BleedBox, ArtBox<br />
     * Default value: CropBox<br />
     * <br />
     * <b>PrintArea</b> <i>(string)</i><br />
     * Possible values: MediaBox, CropBox, TrimBox, BleedBox, ArtBox<br />
     * Default value: CropBox<br />
     * <br />
     * <b>PrintClip</b> <i>(string)</i><br />
     * Possible values: MediaBox, CropBox, TrimBox, BleedBox, ArtBox<br />
     * Default value: CropBox.<br />
     * <br />
     * <b>PrintScaling</b> <i>(string)</i><br />
     * Possible values: AppDefault, None<br />
     * Default value: AppDefault.<br />
     * <br />
     * <b>Duplex</b> <i>(string)</i><br />
     * Possible values: Simplex, DuplexFlipLongEdge, DuplexFlipShortEdge
     * Default value: none<br />
     * <br />
     * <b>PickTrayByPDFSize</b> <i>(boolean)</i><br />
     * Default value: false<br />
     * <br />
     * <b>PrintPageRange</b> <i>(Array)</i><br />
     * Example: [[1,5], [7,9]]<br />
     * Default value: as defined by PDF viewer application<br />
     * <br />
     * <b>NumCopies</b> <i>(Number)</i><br />
     * Possible values: 1, 2, 3, 4, 5<br />
     * Default value: 1<br />
     * <br />
     * For more information see the PDF Reference, sixth edition on Page 577
     * @param {boolean} doReset True to reset the settings
     * @function
     * @returns jsPDF jsPDF-instance
     * @example
     * var doc = new jsPDF()
     * doc.text('This is a test', 10, 10)
     * doc.viewerPreferences({'FitWindow': true}, true)
     * doc.save("viewerPreferences.pdf")
     *
     * // Example printing 10 copies, using cropbox, and hiding UI.
     * doc.viewerPreferences({
     *   'HideWindowUI': true,
     *   'PrintArea': 'CropBox',
     *   'NumCopies': 10
     * })
     */
    jsPDFAPI.viewerPreferences = function (options, doReset) {
        options = options || {};
        doReset = doReset || false;

        var configuration;
        var configurationTemplate = {
            "HideToolbar": {defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3},
            "HideMenubar": {defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3},
            "HideWindowUI": {defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3},
            "FitWindow": {defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3},
            "CenterWindow": {defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3},
            "DisplayDocTitle": {defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.4},
            "NonFullScreenPageMode": {defaultValue: "UseNone", value: "UseNone", type: "name", explicitSet: false, valueSet: ["UseNone", "UseOutlines", "UseThumbs", "UseOC"], pdfVersion: 1.3},
            "Direction": {defaultValue: "L2R", value: "L2R", type: "name", explicitSet: false, valueSet: ["L2R", "R2L"], pdfVersion: 1.3},
            "ViewArea": {defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4},
            "ViewClip": {defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4},
            "PrintArea": {defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4},
            "PrintClip": {defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4},
            "PrintScaling": {defaultValue: "AppDefault", value: "AppDefault", type: "name", explicitSet: false, valueSet: ["AppDefault", "None"], pdfVersion: 1.6},
            "Duplex": {defaultValue: "", value: "none", type: "name", explicitSet: false, valueSet: ["Simplex", "DuplexFlipShortEdge", "DuplexFlipLongEdge", "none"], pdfVersion: 1.7},
            "PickTrayByPDFSize": {defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.7},
            "PrintPageRange": {defaultValue: "", value: "", type: "array", explicitSet: false, valueSet: null, pdfVersion: 1.7},
            "NumCopies": {defaultValue: 1, value: 1, type: "integer", explicitSet: false, valueSet: null, pdfVersion: 1.7}
        };

        var configurationKeys = Object.keys(configurationTemplate);

        var rangeArray = [];
        var i = 0;
        var j = 0;
        var k = 0;
        var isValid = true;

        var method;
        var value;

        function arrayContainsElement(array, element) {
            var iterator;
            var result = false;

            for (iterator = 0; iterator < array.length; iterator += 1) {
                if (array[iterator] === element) {
                    result = true;
                }
            }
            return result;
        }

        if (this.internal.viewerpreferences === undefined) {
            this.internal.viewerpreferences = {};
            this.internal.viewerpreferences.configuration = JSON.parse(JSON.stringify(configurationTemplate));
            this.internal.viewerpreferences.isSubscribed = false;
        }
        configuration = this.internal.viewerpreferences.configuration;

        if (options === "reset" || doReset === true) {
            var len = configurationKeys.length;

            for (k = 0; k < len; k += 1) {
                configuration[configurationKeys[k]].value = configuration[configurationKeys[k]].defaultValue;
                configuration[configurationKeys[k]].explicitSet = false;
            }
        }

        if (typeof options === "object") {
            for (method in options) {
                value = options[method];
                if (arrayContainsElement(configurationKeys, method) && value !== undefined) {

                    if (configuration[method].type === "boolean" && typeof value === "boolean") {
                        configuration[method].value = value;
                    } else if (configuration[method].type === "name" && arrayContainsElement(configuration[method].valueSet, value)) {
                        configuration[method].value = value;
                    } else if (configuration[method].type === "integer" && Number.isInteger(value)) {
                        configuration[method].value = value;
                    } else if (configuration[method].type === "array") {

                        for (i = 0; i < value.length; i += 1) {
                            isValid = true;
                            if (value[i].length === 1 && typeof value[i][0] === "number") {
                                rangeArray.push(String(value[i]));
                            } else if (value[i].length > 1) {
                                for (j = 0; j < value[i].length; j += 1) {
                                    if (typeof value[i][j] !== "number") {
                                        isValid = false;
                                    }
                                }
                                if (isValid === true) {
                                    rangeArray.push(String(value[i].join("-")));
                                }
                            }
                        }
                        configuration[method].value = String(rangeArray);
                    } else {
                        configuration[method].value = configuration[method].defaultValue;
                    }

                    configuration[method].explicitSet = true;
                }
            }
        }

        if (this.internal.viewerpreferences.isSubscribed === false) {
            this.internal.events.subscribe("putCatalog", function () {
                var pdfDict = [];
                var vPref;
                for (vPref in configuration) {
                    if (configuration[vPref].explicitSet === true) {
                        if (configuration[vPref].type === "name") {
                            pdfDict.push("/" + vPref + " /" + configuration[vPref].value);
                        } else {
                            pdfDict.push("/" + vPref + " " + configuration[vPref].value);
                        }
                    }
                }
                if (pdfDict.length !== 0) {
                    this.internal.write("/ViewerPreferences\n<<\n" + pdfDict.join("\n") + "\n>>");
                }
            });
            this.internal.viewerpreferences.isSubscribed = true;
        }

        this.internal.viewerpreferences.configuration = configuration;
        return this;
    };
})(jsPDF.API);
