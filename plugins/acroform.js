/**
 * Created by alexw on 20.10.2015.
 */

/**
 * Interactive Form Dictionary:
 * Fields : array (Array of references to the document's root fields)
 * NeedAppearances: boolean
 * SigFlags: integer
 * CO: array (Array of indirect references to field directories with trigger events)
 * // Set default values
 * DR: dictionary
 * DA: string
 * Q: integer
 */
(AcroForm = function (jsPDFAPI) {
    'use strict';


    jsPDFAPI.acroformPlugin = {
        fields: [],
        xForms: [],
        isNotEmpty: function () {
            return (!this.acroformPlugin.fields.length == 0);
        },
        /**
         * acroFormDictionaryRoot contains information about the AcroForm Dictionary
         * 0: The Event-Token, the AcroFormDictionaryCallback has
         * 1: The Object ID of the Root
         */
        acroFormDictionaryRoot: new Array(2),
        hasRoot: function () {
            if ((typeof this.acroformPlugin.acroFormDictionaryRoot[1] != 'undefined'
                || typeof this.acroformPlugin.acroFormDictionaryRoot[0] != 'undefined')
                && this.acroformPlugin.printedOut == false) {
                return true;
            } else {
                // reset Root-Reference in case, that the old one was printed out
                if (this.acroformPlugin.printedOut) {
                    this.acroformPlugin.acroFormDictionaryRoot = new Array(2);
                    this.acroformPlugin.printedOut = false;
                }
                return false;
            }
        },
        /**
         * After the PDF gets evaluated, the reference to the root has to be reset,
         * this indicates, whether the root has already been printed out
         */
        printedOut: false
    };

    var Form = function () {
        this.content = '';
        this.objId = -1;
        this.object = null;
        this.hasAnnotation = false;
        this.hasAppearanceStream = false;
        this.appearanceStreamContent = null;
        this.fieldObject = null;
        this.DA;
    };

    Form.prototype.getContent = function () {
        return this.content;
    };

    Form.prototype.setContent = function (cnt) {
        this.content = cnt;
    };

    Form.prototype.updateObject = function () {
        if (typeof this.object == 'undefined') {
            throw new Error('Object not set');
        }
        //this.object.content = this.getContent();
        this.id = this.object.objId;
    };

    Form.prototype.getObjId = function () {
        return this.id;
    };

    /**
     * An Object, that contains the formtype, content, etc..
     * @constructor
     */
    var FieldObject = function () {
        this.object = null;
        this.content = null;
        // Possible entrys in Field Dictionary:
        var FT,     //FieldType
            Parent, //The Field, that is immediate Parent of this one
            Kids,
            T, // Partial field name
            TU,
            TM,
            /**
             * Bit Position     Name            Meaning
             *      1           ReadOnly
             *      2           Required        If set, the field mus have a value at the time it is exported
             *                                  by a submit-form action
             *      3           NotExport       If set, the field must not be exported by a submit-form action
             */
            Ff,
            V,
            DV,
            AA,
        // for Fields containing variable text:
            DR,
            DA,
            Q;
        // if there's an annotation, it has to be referenced in the Annot at annotations.js
        var _annotation = false;
        Object.defineProperty(this, 'hasAnnotation', {
            get: function () {
                return _annotation;
            },
            set: function (annot) {
                _annotation = annot;
            }
        });

        // If there's a variable text, the Field needs an AppearanceStream
        var _hasAppearanceStream = false;
        Object.defineProperty(this, 'hasAppearanceStream', {
            get: function () {
                return _hasAppearanceStream;
            },
            set: function (val) {
                _hasAppearanceStream = val;
            }
        });
        this.appearanceStreamContent = null;
    };

    FieldObject.prototype.isMultiline = function () {
        return getBitPosition(this.Ff, 13);
    }

    FieldObject.prototype.setObject = function (obj) {
        this.object = obj;
    };

    FieldObject.prototype.setContext = function (context) {
        this.context = context;
    };

    var putForm = function (formObject) {
        if (!this.acroformPlugin.hasRoot.call(this)) {
            createAcroForm.call(this);
        }
        createField.call(this, formObject);
    };

    var createContentFromFieldObject = function (fieldObject) {
        var content = '';

        var keys = Object.keys(fieldObject).filter(function (key) {
            return (key != 'object' && key != 'content' && key != 'appearanceStreamContent' && key.substring(0, 1) != "_");
        });

        for (var i in keys) {
            var key = keys[i];
            var value = fieldObject[key];

            if (value != '') {
                if (Array.isArray(value)) {
                    content += '/' + key + ' [';
                    for (var i in value) {
                        content += value[i] + ' ';
                    }
                    content += ']\n';
                } else {
                    content += '/' + key + ' ' + value + '\n';
                }
            }
        }
        content += fieldObject.content;
        //fieldObject.content = content + fieldObject.content;
        return content;
    };

    var createFormXObjectContent = function (fieldObject, formObject) {
        var content = '';

        var keys = Object.keys(fieldObject).filter(function (key) {
            return (key != 'object' && key != 'content' && key != 'appearanceStreamContent' && key.substring(0, 1) != "_");
        });

        for (var i in keys) {
            var key = keys[i];
            var value = fieldObject[key];

            /*if (key == "DA") {
             fieldObject.DA = value;
             continue;
             }*/

            if (value != '') {
                if (Array.isArray(value)) {
                    content += '/' + key + ' [';
                    for (var i in value) {
                        content += value[i] + ' ';
                    }
                    content += ']\n';
                } else {
                    content += '/' + key + ' ' + value + '\n';
                }
            }
        }
        //fieldObject.content = content + fieldObject.content;
        return content;
    };

    /**
     * Creates a field
     * @param formObject the field, eg. Button
     */
    var createField = function (formObject) {
        // Create formEntry and set formObject as Content
        var tmpForm = new Form();

        //tmpForm.DA = formObject.DA;
        //delete formObject.DA;

        tmpForm.setContent(createContentFromFieldObject(formObject));

        tmpForm.hasAnnotation = formObject.hasAnnotation;

        tmpForm.hasAppearanceStream = formObject.hasAppearanceStream;

        tmpForm.appearanceStreamContent = formObject.appearanceStreamContent;

        tmpForm.fieldObject = formObject;

        tmpForm._annotationOptions = formObject._annotationOptions;

        this.acroformPlugin.fields.push(tmpForm);
    };

    /**
     * small workaround for calculating the TextMetric aproximately
     * @param text
     * @param fontsize
     * @returns {TextMetrics}
     */
    function calculateFontSpace(text, fontsize) {
        //re-use canvas object for speed improvements
        var canvas = calculateFontSpace.canvas || (calculateFontSpace.canvas = document.createElement('canvas'));

        var context = canvas.getContext('2d');
        //context.font = "30px helvetica";
        context.font = fontsize + " helvetica"
        context.fontcolor = 'black';

        var metrics = context.measureText(text);

        return metrics;
    }

    var calculateAppearanceStream = function (formObject) {
        // todo: Take Height into consideration
        if (formObject.appearanceStreamContent) {
            // If appearanceStream is already set, use it
            return formObject.appearanceStreamContent;
        }

        if (!formObject.V && !formObject.DV) {
            return;
        }

        // else calculate it

        var stream = '';

        var text = formObject.V || formObject.DV;
        // Remove Brackets
        text = (text.substr(0, 1) == '(') ? text.substr(1) : text;
        text = (text.substr(text.length - 1) == ')') ? text.substr(0, text.length - 1) : text;
        // split into array of words
        var textSplit = text.split(' ');

        /**
         * the color could be ((alpha)||(r,g,b)||(c,m,y,k))
         * @type {string}
         */
        var color = "0 g\n";
        var fontSize = 12;
        var lineSpacing = 1;
        var borderPadding = 1;


        var height = formObject._annotationOptions.Rect[3] - formObject._annotationOptions.Rect[1] || 0;
        var width = formObject._annotationOptions.Rect[2] - formObject._annotationOptions.Rect[0] || 0;

        var isSmallerThanWidth = function (i, lastLength, fontSize) {
            if (i + 1 < textSplit.length) {
                // For the last Blank (shouldn't be displayed)
                var blankSpace = calculateFontSpace(" ", fontSize);
                var tmp = textSplit[i + 1] + " ";
                var TextWidth = ((lastLength + calculateFontSpace(tmp, fontSize + "px").width) - blankSpace.width);
                var FieldWidth = (width - 2 * borderPadding);
                return (TextWidth <= FieldWidth);
            } else {
                return false;
            }
        };


        var text = "";
        fontSize++;
        FontSize: while (true) {
            fontSize--;
            var startY = height - fontSize;
            var startX = 0 + borderPadding;

            var lastX = startX, lastY = startY;
            var firstWordInLine = 0, lastWordInLine = 0;
            var lastLength = 0;

            var y = 0;
            if (fontSize == 0) {
                // In case, the Text doesn't fit at all
                fontSize = 12;
                text = "(...) Tj\n";
                break;
            }

            var blankSpace = calculateFontSpace(" ", fontSize);

            lastLength = calculateFontSpace(textSplit[0] + " ", fontSize).width;
            Line:
                for (var i in textSplit) {
                    var key = parseInt(i);
                    lastLength += calculateFontSpace(textSplit[key] + " ", fontSize).width;
                    if (isSmallerThanWidth(key, lastLength, fontSize)) {
                        continue Line;
                    } else {
                        if (formObject.isMultiline == 0) {
                            //fontSize--;
                            continue FontSize;
                        } else {
                            lastWordInLine = key;
                            // go on
                        }
                    }

                    var line = '';

                    for (var x = firstWordInLine; x <= lastWordInLine; x++) {
                        line += textSplit[x] + ' ';
                    }

                    // Remove last blank
                    line = (line.substr(line.length - 1) == " ") ? line.substr(0, line.length - 1) : line;
                    //lastLength -= blankSpace.width;
                    lastLength = calculateFontSpace(line, fontSize).width;

                    // Calculate startX
                    switch (formObject.Q) {
                        case 2: // Right justified
                            startX = (width - lastLength - borderPadding);
                            break;
                        case 1:// Q = 1 := Text-Alignment: Center
                            startX = Math.round((width - lastLength) / 2);
                            break;
                        case 0:
                        default:
                            startX = borderPadding;
                            break;
                    }

                    text += (startX) + ' ' + (lastY) + ' Td\n';
                    text += '(' + line + ') Tj\n';
                    // reset X in PDF
                    text += (-startX) + ' 0 Td\n';

                    // After a Line, adjust y position
                    lastY = -(fontSize + lineSpacing);
                    lastX = startX;

                    // Reset for next iteration step
                    lastLength = 0;
                    firstWordInLine = lastWordInLine + 1;
                }
            break;
        }

        stream += '/Tx BMC\n' +
            'q\n' +
                //color + '\n' +
            '/Ti ' + fontSize + ' Tf\n' +
                // Text Matrix
            '1 0 0 1 0 0 Tm\n';

        // Begin Text
        stream += 'BT\n';

        stream += text;

        // End Text
        stream += 'ET\n'

        stream += 'Q\n' +
            'EMC\n';

        var appearanceStreamContent = "<< /Resources 2 0 R\n" + // Has to be set to 2 because of jsPDF putting the ressources to obj 2
            "/Length " + stream.length +
            "\n>>";

        appearanceStreamContent += "\nstream\n";
        appearanceStreamContent += stream;
        appearanceStreamContent += "endstream";

        return appearanceStreamContent;


    };

    var xFormListCallback = function () {
        for (var i in jsPDFAPI.acroformPlugin.xForms) {
            var object = jsPDFAPI.acroformPlugin.xForms[i];
            this.internal.out(object.objId + " 0 R", true);
        }
    };

    /**
     * Creates the single Fields and writes them into the Document
     */
    var createFieldCallback = function () {
        for (var i in this.acroformPlugin.fields) {
            var form = this.acroformPlugin.fields[i];
            var object = this.internal.newAdditionalObject();

            object.content += "<<\n" + form.getContent();

            form.object = object;

            form.updateObject();

            if (form.hasAnnotation) {
                // If theres an Annotation Widget in the Form Object, put the Reference in the /Annot array
                createAnnotationReference.call(this, form.object.objId);
            }

            if (form.appearanceStreamContent) {
                object.content += "/AP << /N ";
                if (Object.keys(form.appearanceStreamContent).length > 1) {
                    object.content += "<< ";
                    for (var i in form.appearanceStreamContent) {
                        // Create FormXObject at a new Object
                        var AP = this.internal.newAdditionalObject();

                        /*if (jsPDFAPI.acroformPlugin.xForms.length == 0) {
                         this.internal.events.subscribe("putXobjectDict", xFormListCallback);
                         }*/

                        jsPDFAPI.acroformPlugin.xForms.push(AP);

                        object.content += "/" + i + " " + AP.objId + " 0 R \n";

                        // todo: Create XForms used mutliple times only once (e.g. CheckBox-Appearance)
                        AP.content += createFormXObject(form, i);
                    }
                    object.content += " >>\n";
                    object.content += " >>\n";
                } else {
                    // Create Appearance Stream at a new Object
                    /*var AP = this.internal.newAdditionalObject();
                     object.content += AP.objId + " 0 R >>\n";

                     AP.content += createAppearanceStream(form);*/

                }
            } else if (form.hasAppearanceStream) {
                // Calculate Appearance
                var appearance = calculateAppearanceStream(form.fieldObject);

                if (appearance) {
                    // Create Appearance Stream at a new Object
                    var AP = this.internal.newAdditionalObject();

                    object.content += "/AP << /N ";
                    object.content += AP.objId + " 0 R >>\n";

                    AP.content += appearance;
                }

            }

            object.content += ">>";
        }
    };

    var putCatalogCallback = function () {
        //Put reference to AcroForm to DocumentCatalog
        if (typeof this.acroformPlugin.acroFormDictionaryRoot[1] != 'undefined') { // for safety, shouldn't normally be the case
            this.internal.write('/Acroform ' + this.acroformPlugin.acroFormDictionaryRoot[1] + ' '
                + 0 + ' R');
        } else {
            console.log('Root missing...');
        }
    };

    /**
     * Adds /Acroform X 0 R to Document Catalog,
     * and creates the AcroForm Dictionary
     */
    var AcroFormDictionaryCallback = function () {
        // Remove event
        this.internal.events.unsubscribe(this.acroformPlugin.acroFormDictionaryRoot[0]);

        var objId = this.internal.newObject();
        this.internal.write('<<\n',
            '/Fields [');
        for (var i in this.acroformPlugin.fields) {
            var field = this.acroformPlugin.fields[i];
            this.internal.write(field.getObjId() + ' 0 R ');
            delete this.acroformPlugin.fields[this.acroformPlugin.fields.indexOf(field)];
        }
        this.internal.write(']',
            '/DA (' + AcroForm.createDefaultAppearanceStream() + ')',
            '>>');

        this.internal.write('endobj');

        this.acroformPlugin.acroFormDictionaryRoot[1] = [objId];

        this.acroformPlugin.acroFormDictionaryRoot[0] = null;

        this.acroformPlugin.printedOut = true;

        // Clear Forms array
        //this.acroformPlugin.fields = [];
    };

    var createAcroForm = function () {
        if (this.acroformPlugin.hasRoot.call(this)) {
            //return;
            throw new Error("Exception while creating AcroformDictionary");
        }

        // The Object Number of the AcroForm Dictionary
        //var intern = this.internal;
        this.acroformPlugin.acroFormDictionaryRoot[0] = this.internal.events.subscribe('postPutResources', AcroFormDictionaryCallback);

        // Register event, that is triggered when the DocumentCatalog is written, in order to add /AcroForm
        this.internal.events.subscribe('putCatalog', putCatalogCallback);

        // Register event, that creates all
        this.internal.events.subscribe('buildDocument', createFieldCallback);
    };

    /**
     * Create the Reference to the widgetAnnotation, so that it gets referenced in the Annot[] int the
     */
    var createAnnotationReference = function (objId) {
        var options = {
            type: 'reference',
            objId: objId
        };
        this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push(options);
    };

    /**
     * Converts the Parameters from x,y,w,h to lowerLeftX, lowerLeftY, upperRightX, upperRightY
     * @param x
     * @param y
     * @param w
     * @param h
     * @returns {*[]}
     */
    var calculateCoordinates = function (x, y, w, h) {
        var coordinates = {};
        if (Array.isArray(x)) { // in case, the parameters are sent in as an array
            coordinates.lowerLeft_X = x[0] | 0;
            coordinates.lowerLeft_Y = x[1] | 0;
            coordinates.upperRight_X = x[2] | 0;
            coordinates.upperRight_Y = x[3] | 0;
        } else {
            coordinates.lowerLeft_X = x | 0;
            coordinates.lowerLeft_Y = y | 0;
            coordinates.upperRight_X = x + w | 0;
            coordinates.upperRight_Y = y + h | 0;
        }

        return [coordinates.lowerLeft_X, coordinates.lowerLeft_Y, coordinates.upperRight_X, coordinates.upperRight_Y];
    };

    var calculateColor = function (r, g, b) {
        var color = new Array(3);
        color.r = r | 0;
        color.g = g | 0;
        color.b = b | 0;
        return color;
    };

    var arrayToString = function (array) {
        var string = '';
        for (var i in array) {
            string += array[i] + ' ';
        }
        return string;
    };

    /**
     * Example:
     * <code>
     *    /Tx BMC\n // Begin Marked Content
     *    %q\n" +
     *      // Begin Text
     *      BT\n
     *      // Color of the font
     *       1 0 1 rg\n
     *       // Ti: used font
     *       /Ti 12 Tf
     *       // a, b, c, d, e, f Tm -> a (Factor for horizontal scaling), b (Rotation), c (Kursiv), d (Factor for Vertical scaling)
     *       // e (Shifting the x position),f (shifting the y position) (Look at Td)
     *       1 0 0 1 0 40 Tm
     *       // tx ty Td -> move the next line tx space units in the x direction and ty space units in the y direction
     *       0 0 Td
     *       ( The quick brown fox ) Tj
     *       // tx ty Td -> move the next line tx space units in the x direction and ty space units in the y direction
     *       3 -13 Td
     *       ( ate the lazy mouse. ) Tj
     *       13 -13 Td
     *       ( ate the lazy mouse. ) Tj
     *       // End Text
     *       ET
     *   %Q\n
     *   EMC //End Marked content
     * </code>
     * @param opt formObject
     * @returns {string}
     */
    var createAppearanceStream = function (opt, number) {
        if (opt == null) {
            throw new Error("opt not set!");
        }

        var options;
        // Make sure, the right apperance stream content is created
        if (opt.appearanceStreamContent != null && typeof opt.appearanceStreamContent == 'object') {
            // if number isn't set, get the first key
            if (typeof number == 'undefined') {
                number = Object.keys(opt.appearanceStreamContent)[number];
            }
            // now number is set, and it should exist..
            options = opt.appearanceStreamContent[number];
        } else if (opt.appearanceStreamContent != null) {
            options = opt.appearanceStreamContent;
        }

        var appearanceStreamContent = "";

        var stream = "";

        if (typeof options != 'undefined') {
            stream = options;
        } else {
            stream += "/Tx BMC\n" + // Begin Marked Content
                "q\n" +
                    // Begin Text
                "BT\n" +
                    // Color of the font
                "1 0 1 rg\n" +
                    // Ti: used font
                "/Ti 12 Tf\n" +
                    // a, b, c, d, e, f Tm -> a (Factor for horizontal scaling), b (Rotation), c (Kursiv), d (Factor for Vertical scaling)
                    // e (Shifting the x position),f (shifting the y position) (Look at Td)
                "1 0 0 1 0 40 Tm\n" +
                    // tx ty Td -> move the next line tx space units in the x direction and ty space units in the y direction
                    //"0 0 Td\n" +
                    //"( The quick brown fox ) Tj\n" +
                    // tx ty Td -> move the next line tx space units in the x direction and ty space units in the y direction
                    //"13 -13 Td\n" +
                    //"( ate the lazy mouse. ) Tj\n" +
                    //"13 -13 Td\n" +
                    //"( ate the lazy mouse. ) Tj\n" +
                    // End Text
                "ET\n" +
                "Q\n" +
                "EMC\n";//End Marked content

        }


        appearanceStreamContent += "<< /Resources 2 0 R\n" + // Has to be set to 2 because of jsPDF putting the ressources to obj 2
            "/Length " + stream.length +
            "\n>>";

        appearanceStreamContent += "\nstream\n";
        appearanceStreamContent += stream;
        appearanceStreamContent += "endstream";

        return appearanceStreamContent;
    };


    var createFormXObject = function (opt, number) {
        if (opt == null) {
            throw new Error("opt not set!");
        }

        var xobj;
        // Make sure, the right appearance stream content is created
        if (opt.appearanceStreamContent != null && typeof opt.appearanceStreamContent == 'object') {
            // if number isn't set, get the first key
            if (typeof number == 'undefined') {
                number = Object.keys(opt.appearanceStreamContent)[number];
            }
            // now number is set, and it should exist..
            xobj = opt.appearanceStreamContent[number];
        } else if (opt.appearanceStreamContent != null) {
            xobj = opt.appearanceStreamContent;
        }

        var appearanceStreamContent = "";

        var stream;

        appearanceStreamContent += "<<\n";
        appearanceStreamContent += createFormXObjectContent(xobj, opt);
        appearanceStreamContent += ">>";

        if (typeof xobj != 'undefined') {
            stream = xobj.stream;

            if (xobj.stream) {
                appearanceStreamContent += "\nstream\n";
                appearanceStreamContent += stream;
                appearanceStreamContent += "endstream";
            }
        }

        return appearanceStreamContent;
    };

    var createFormXObjectDefaultApearance = function (opt) {
        if (opt == null) {
            throw new Error("opt not set!");
        }

        var xobj;

        xobj = opt.DA;

        var appearanceStreamContent = "";

        var stream;

        appearanceStreamContent += "<<\n";
        appearanceStreamContent += createFormXObjectContent(xobj, opt);
        appearanceStreamContent += ">>";

        if (typeof xobj != 'undefined') {
            stream = xobj.stream;

            if (xobj.stream) {
                appearanceStreamContent += "\nstream\n";
                appearanceStreamContent += stream;
                appearanceStreamContent += "endstream";
            }
        }

        return appearanceStreamContent;
    };

    /**
     * Several different types of Forms
     */

    /*var FormOptions = function () {
     var _type;
     Object.defineProperty(this, "type", {
     enumerable: true,
     get: function () {
     return _type
     },
     set: function (type) {
     _type = type;
     }
     })
     };*/

    /**
     * Uses the Option-array and prints out all keys and values saved in it
     * @param opt
     */
    var createAnnotationWidgetFromOptions = function (opt) {
        var content = '';

        content += ' /Type /Annot\n'
            + ' /Subtype /Widget \n';

        var keys = Object.keys(opt);

        for (var i in keys) {
            var key = keys[i];
            var value = opt[key];
            // leave out the arrays
            if (key == 'Rect') {
                // For Rect, the Coordinates have to be calculated, because they don't come in as PDF wants them...
                content += ' /Rect [' + arrayToString(calculateCoordinates.call(this, value)) + '] \n';
            } else if (Array.isArray(value) || value.length > 0) {
                content += ' /' + key + ' [' + arrayToString(value) + '] \n';
            } else {
                content += ' /' + key + ' ' + value + '\n';
            }
        }

        return content;
    }

    /**
     * Button
     * FT = Btn
     */
    var addButton = function (options) {
        var options = options || new FieldObject();

        options.FT = '/Btn';

        /**
         * Calculating the Ff entry:
         *
         * The Ff entry contains flags, that have to be set bitwise
         * In the Following the number in the Comment is the BitPosition
         */
        var flags = options.Ff || 0;

        // 17, Pushbutton
        if (options.pushbutton) {
            // Options.pushbutton should be 1 or 0
            flags = options.Ff | options.pushbutton << 16;
            delete options.pushbutton;
        }

        //16, Radio
        if (options.radio) {
            flags = options.Ff | options.radio << 15;
            delete options.radio;
        }

        // 15, NoToggleToOff (Radio buttons only
        if (options.noToggleToOff) {
            flags = options.Ff | options.noToggleToOff << 14;
            delete options.noToggleToOff;
        }

        // In case, there is no Flag set, it is a check-box
        options.Ff = options.Ff | flags;

        putForm.call(this, options);

    };

    var getBitPosition = function (variable, position) {
        variable = variable || 0;
        var bitMask = 1;
        bitMask << (position - 1);

        var res = variable | bitMask;
        return res;
    };

    var addTextField = function (options) {
        var options = options || new FieldObject();

        options.FT = '/Tx';

        /**
         * Calculating the Ff entry:
         *
         * The Ff entry contains flags, that have to be set bitwise
         * In the Following the number in the Comment is the BitPosition
         */

        var flags = options.Ff || 0;

        // 13, Multiline
        if (options.multiline) {
            // Set Flag
            flags = flags | (1 << 12);
            // Remove multiline from FieldObject
            delete options.multiline;
        }

        // 14, Password
        if (options.password) {
            flags = flags | (1 << 13);
            delete options.password;
        }

        // 21, FileSelect, PDF 1.4...
        if (options.fileSelect) {
            flags = flags | (1 << 20);
            delete options.fileSelect;
        }

        // 23, DoNotSpellCheck, PDF 1.4...
        if (options.doNotSpellCheck) {
            flags = flags | (1 << 22);
            delete options.doNotSpellCheck;
        }

        // 24, DoNotScroll, PDF 1.4...
        if (options.doNotScroll) {
            flags = flags | (1 << 23);
            delete options.doNotScroll;
        }

        options.Ff = options.Ff || flags;

        options.hasAnnotation = true;

        //options.hasAppearanceStream = true;

        //options.appearanceStreamContent = createAppearanceStream.call(this, options);

        // Add field
        putForm.call(this, options);
    };

    var addChoiceField = function (opt) {
        var options = opt || new FieldObject();

        options.FT = '/Ch';

        /**
         * Calculating the Ff entry:
         *
         * The Ff entry contains flags, that have to be set bitwise
         * In the Following the number in the Comment is the BitPosition
         */

        var flags = options.Ff || 0;

        // 18, Combo (If not set, the choiceField is a listBox!!)
        if (options.combo) {
            // Set Flag
            flags = flags | (1 << 17);
            // Remove multiline from FieldObject
            delete options.combo;
        }

        // 19, Edit
        if (options.edit) {
            flags = flags | (1 << 18);
            delete options.edit;
        }

        // 20, Sort
        if (options.sort) {
            flags = flags | (1 << 19);
            delete options.sort;
        }

        // 22, MultiSelect (PDF 1.4)
        if (options.multiSelect && this.internal.getPDFVersion() >= 1.4) {
            flags = flags | (1 << 21);
            delete options.multiSelect;
        }

        // 23, DoNotSpellCheck (PDF 1.4)
        if (options.doNotSpellCheck && this.internal.getPDFVersion() >= 1.4) {
            flags = flags | (1 << 22);
            delete options.doNotSpellCheck;
        }

        options.Ff = flags;

        options.hasAnnotation = true;

        // Add field
        putForm.call(this, options);
    };

    /**
     * Creates the Stream for the Form
     *
     * @function
     * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Object} flags Collection of settings signalling how the text must be encoded. Defaults are sane. If you think you want to pass some flags, you likely can read the source.
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name text
     */
    var text = function (text, x, y, flags, angle, align) {
        var content = '';
        var out = function (text) {
            /*for (var i in text) {
             content += text[i] + '\n';
             }*/
            content += text + '\n';
        };

        /**
         * Inserts something like this into PDF
         *   BT
         *    /F1 16 Tf  % Font name + size
         *    16 TL % How many units down for next line in multiline text
         *    0 g % color
         *    28.35 813.54 Td % position
         *    (line one) Tj
         *    T* (line two) Tj
         *    T* (line three) Tj
         *   ET
         */
        function ESC(s) {
            //s = s.split("\t").join(Array(9).join(" "));//options.TabLen ||
            return this.internal.pdfEscape(s, flags);
        };

        out(
            'BT\n' +
            '/F1 24 Tf\n' +//activeFontKey + ' ' + activeFontSize + ' Tf\n' +     // font face, style, size
                //(activeFontSize * lineHeightProportion) + ' TL\n' +  // line spacing
                //strokeOption +// stroke option
                //textColor +
                //'\n' + xtra + f2(x * k) + ' ' + curY + ' ' + mode + '\n(' +
            '175 720 Td\n' +
            '(\n' +
            text +
            '\n) Tj\nET');

        return content;
    };


    /**
     * Parses the options and creates a FieldObject
     * @param opt
     * @returns {FieldObject}
     */
    /*
     Keys: R,BC,BG,CA,RC,AC,I,RI,IX,IF,TP
     */
    var parseOptions = function (opt) {
        // options, that are contained in the Field-Object
        var options = new FieldObject();
        opt = opt || {};
        // Options, that should be in the Annotation-Widget
        var annotationOptions = {};

        // x,y,w,h
        if (opt['Rect']) {
            var rect = opt['Rect'];
            var x = rect[0] | 0,
                y = rect[1] | 0,
                w = rect[2] | 0,
                h = rect[3] | 0;

            annotationOptions.Rect = calculateCoordinates.call(this, x, y, w, h);
        }

        if (opt['BC']) {
            var bc = opt['BC'];
            var r = bc[0],
                g = bc[1],
                b = bc[2];

            annotationOptions.BC = calculateColor(r, g, b);
        }

        if (opt['BG']) {
            var bc = opt['BG'];
            var r = bc[0],
                g = bc[1],
                b = bc[2];

            annotationOptions.BG = calculateColor(r, g, b);
        }

        if (opt['CA']) {
            annotationOptions.CA = opt['CA'];
        }

        if (opt['T']) {
            options.T = opt['T'];
        }

        /*if (opt.DA) {
         options.DA = opt.DA;
         }*/

        // getKeys, but filter out those, that are in annotationOptions
        var keys = Object.keys(opt).filter(function (obj) {
            if (Object.keys(annotationOptions).indexOf(obj) != -1) {
                return false;
            }
            return true;
        });

        for (var i in keys) {
            var key = keys[i];
            // Set all options from opt to options
            if (opt[key]) {
                options[key] = opt[key];
            }
        }

        if (Object.keys(annotationOptions).length > 0) {
            // in case, there are Annotatios, set the Flag, that is used to print the reference to the Annotation
            options.hasAnnotation = true;
        }

        options.content = createAnnotationWidgetFromOptions.call(this, annotationOptions);

        options._annotationOptions = annotationOptions;

        return options;

    };

    jsPDFAPI.addField = function (fieldObject) {
        var opt = parseOptions(fieldObject);
        if (fieldObject instanceof TextField) {
            addTextField.call(this, opt);
        } else if (fieldObject instanceof ChoiceField) {
            addChoiceField.call(this, opt);
        } else if (fieldObject instanceof Button) {
            addButton.call(this, opt);
        }
    };

    /**
     * Parameters Needed:
     * opt['Rect'] = [x,y,w,h] (X and Y coordinates of the Field to add and the Width and Height)
     * opt['T'] = '(String)' (The (Partial) Name of the Field)
     * @param opt
     */
    var addListBox = function (opt) {
        var options = parseOptions(opt);

        // Values for the Ff flag:

        if (opt['combo']) {
            options.combo = opt['combo'];
            //delete opt['combo'];
        }

        if (opt['edit']) {
            options.edit = opt['edit'];
            //delete opt['edit'];
        }

        if (opt['sort']) {
            // Not for the Reader-Application, but for Form-Authoring tools
            options.sort = opt['sort'];
            //delete opt['sort'];
        }

        // PDF 1.4...
        if (opt['multiSelect'] && this.internal.getPDFVersion() >= 1.4) {
            options.multiSelect = opt['multiSelect'];
            //delete opt['multiSelect'];
        }

        // PDF 1.4...
        if (opt['doNotSpellCheck'] && this.internal.getPDFVersion() >= 1.4) {
            options.doNotSpellCheck = opt['doNotSpellCheck'];
            //delete opt['doNotSpellCheck'];
        }

        // For scrollable List-Boxes:
        if (opt['TI']) {
            // Top index
            options.TI = opt['TI'];
            //delete opt['TI'];
        }

        // PDF 1.4...
        if (opt['I'] && this.internal.getPDFVersion() >= 1.4) {
            // Array of Indices of the currently selected Opt entrys
            options.TI = opt['I'];
            //delete opt['I'];
        }

        addChoiceField.call(this, options);
    };

})
(jsPDF.API);

/**
 * Returns the standard On Appearance for a CheckBox
 * @returns {AcroForm.FormXObject}
 */
AcroForm.createAppearanceStreamOn = function () {
    var xobj = new AcroForm.FormXObject;
    var stream = "";
    stream += "q\n" +
        "0 0 1 rg\n" +
        "BT\n" +
        "/ZaDb 12 Tf\n" +
        "0 0 Td\n" +
        "(Checked) Tj\n" +
        "ET\n" +
        "Q\n";
    xobj.stream = stream;
    //xobj.BBox = [0, 0, 1000, 1000];
    //xobj.Matrix = [1, 0, 0, 1, 0, 0];
    return xobj;
};

/**
 * Returns the standard Off Appearance for a CheckBox
 * @returns {AcroForm.FormXObject}
 */
AcroForm.createAppearanceStreamOff = function () {
    var xobj = new AcroForm.FormXObject();
    var stream = "";
    stream += "q\n" +
        "0 0 1 rg\n" +
        "BT\n" +
        "/ZaDb 12 Tf\n" +
        "0 0 Td\n" +
        "() Tj\n" +
        "ET\n" +
        "Q\n";
    xobj.stream = stream;
    return xobj;
};

/**
 * Returns the standard Off Appearance for a CheckBox
 * @returns {AcroForm.FormXObject}
 */
AcroForm.createDefaultAppearanceStream = function () {
    //var xobj = new AcroForm.FormXObject();
    var stream = "";
    /*stream += "(/Tx BMC " +
     "q " +
     //"0 0 1 rg\n" +
     "BT " +
     "/ZaDb 12 Tf " +
     "ET " +
     "Q " +
     "EMC)";*/
    //xobj.stream = stream;
    stream += "/Helv 12 Tf 0 g";
    return stream;
};

AcroForm.FormXObject = function () {
    this.Type = "/XObject";
    this.Subtype = "/Form";
    this.FormType = 1;
    this.BBox;
    this.Matrix;
    this.Resources = "2 0 R";
    this.PieceInfo;
    var _stream;
    Object.defineProperty(this, 'Length', {
        enumerable: true,
        get: function () {
            return (_stream !== undefined) ? _stream.length : 0;
        }
    });
    Object.defineProperty(this, 'stream', {
        enumerable: false,
        set: function (val) {
            _stream = val;
        },
        get: function () {
            if (_stream) {
                return _stream;
            } else {
                return null;
            }
        }
    });
};

//### For inheritance:

/*var ObjectCreate = Object.create || function (o) {
 var F = function () {
 };

 F.prototype = o;
 return new F;
 };
 */
var ObjectCreate = Object.create || function (o) {
        var F = function () {
        };
        F.prototype = o;
        return new F();
    };

var inherit = function (child, parent) {
    child.prototype = Object.create(parent.prototype);//new parent;//createObject(parent);
    child.prototype.constructor = child;
};

// ##### The Objects, the User can Create:


// The Field Object contains the Variables, that every Field needs
// Rectangle for Appearance: lower_left_X, lower_left_Y, width, height
var Field = function () {
    'use strict';
    this.Rect;
    var _Ft = "";
    Object.defineProperty(this, 'Ft', {
        enumerable: true,
        set: function (val) {
            _Ft = val
        },
        get: function () {
            return _Ft
        }
    });
    /**
     * The Partial name of the Field Object.
     * It has to be unique.
     */
    var _T;

    Object.defineProperty(this, 'T', {
        enumerable: true,
        configurable: false,
        set: function (val) {
            _T = val;
        },
        get: function () {
            if (!_T || _T.length < 1) {
                return "(FieldObject" + (Field.FieldNum++) + ")";
            }
            if (_T.substring(0, 1) == "(" && _T.substring(_T.length - 1)) {
                return _T;
            }
            return "(" + _T + ")";
        }
    });

    var _DA;
    // Defines the default appearance (Needed for variable Text)
    Object.defineProperty(this, 'DA', {
        enumerable: true,
        get: function () {
            if (!_DA) {
                return;
            }
            return '(' + _DA + ')'
        },
        set: function (val) {
            _DA = val
        }
    });

    var _DV;
    // Defines the default value
    Object.defineProperty(this, 'DV', {
        enumerable: true,
        get: function () {
            if (!_DV) {
                return;
            }
            return '(' + _DV + ')'
        },
        set: function (val) {
            _DV = val
        }
    });

    /**
     *
     * @type {Array}
     */
    this.BG;
};
Field.FieldNum = 0;

var ChoiceField = function () {
    Field.call(this);
    // Field Type = Choice Field
    var Ft = "/Ch";
    // options
    this.Opt = [];
    this.V = '()';
    // Top Index
    this.TI = 0;
    /**
     * Defines, whether the
     * @type {boolean}
     */
    this.combo = false;
    /**
     * Defines, whether the Choice Field is an Edit Field.
     * An Edit Field is automatically an Combo Field.
     */
    Object.defineProperty(this, 'edit', {
        enumerable: true,
        set: function (val) {
            if (val == true) {
                this._edit = true;
                // ComboBox has to be true
                this.combo = true;
            } else {
                this._edit = false;
            }
        },
        get: function () {
            if (!this._edit) {
                return false;
            }
            return this._edit;
        },
        configurable: false
    });
    this.hasAppearanceStream = true;
};
inherit(ChoiceField, Field);

var ListBox = function () {
    ChoiceField.call(this);
    //var combo = true;
};
inherit(ListBox, ChoiceField);

var ComboBox = function () {
    ListBox.call(this);
    this.combo = true;
};
inherit(ComboBox, ListBox);

var EditBox = function () {
    ComboBox.call(this);
    this.edit = true;
};
inherit(EditBox, ComboBox);


var Button = function () {
    Field.call(this);
    var Ft = "/Btn";
};
inherit(Button, Field);

var PushButton = function () {
    Button.call(this);
    this.pushbutton = true;
};
inherit(PushButton, Button);


/*jsPDFAPI.addCheckBox = function (opt) {

 options.hasAnnotation = true;
 };*/

var CheckBox = function () {
    Button.call(this);
    this.appearanceStreamContent = {
        On: AcroForm.createAppearanceStreamOn(),
        Off: AcroForm.createAppearanceStreamOff()
    };
    this.AS = "/On";
    this.V = "/On";
    this.hasAnnotation = true;
};
//Object.defineProperty(CheckBox, 'hasAnnotation', {});

inherit(CheckBox, Button);

var TextField = function () {
    Field.call(this);
    //this.DA = AcroForm.createDefaultAppearanceStream();
    var _V;
    Object.defineProperty(this, 'V', {
        get: function () {
            if (_V) {
                return "(" + _V + ")"
            }
            else {
                return _V
            }
        },
        enumerable: true,
        set: function (val) {
            _V = val
        }
    });

    this.multiline = false;
    //this.password = false;
    /**
     * For PDF 1.4
     * @type {boolean}
     */
    //this.fileSelect = false;
    /**
     * For PDF 1.4
     * @type {boolean}
     */
    //this.doNotSpellCheck = false;
    /**
     * For PDF 1.4
     * @type {boolean}
     */
    //this.doNotScroll = false;

};
inherit(TextField, Field);

var PasswordField = function () {
    TextField.call(this);
    Object.defineProperty(this, 'password', {
        value: true,
        enumerable: true,
        configurable: false,
        writable: false
    });
}
inherit(PasswordField, TextField);

