/**
 * Created by alexw on 20.10.2015.
 */

/**
 * Adds /Acroform X 0 R to Document Catalog,
 * and creates the AcroForm Dictionary
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
(function (jsPDFAPI) {
    'use strict';

    jsPDFAPI.acroformPlugin = {
        fields: [],
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
    };

    // for temporary saving actions...
    var tmp;

    Form.prototype.getContent = function () {
        return this.content;
    };

    Form.prototype.setContent = function (cnt) {
        this.content = '<<\n' + cnt + '\n>>';
    };

    Form.prototype.updateObject = function () {
        if (typeof this.object == 'undefined') {
            throw new Error('Object not set');
        }
        this.object.content = this.getContent();
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
        this.stream = null;
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
        })
    }

    FieldObject.prototype.setObject = function (obj) {
        this.object = obj;
    }

    FieldObject.prototype.setContext = function (context) {
        this.context = context;
    }

    var putForm = function (formObject) {
            if (!this.acroformPlugin.hasRoot.call(this)) {
                createAcroForm.call(this);
            }
            createField.call(this, formObject);
        },

        createContentFromFieldObject = function (fieldObject) {
            var content = '';

            var keys = Object.keys(fieldObject).filter(function (key) {
                return (key != 'object' && key != 'content' && key != 'stream');
            });

            /*if(typeof fieldObject['FT'] != 'undefined'){
             content += ''
             }*/

            for (var i in keys) {
                var key = keys[i];
                var value = fieldObject[key];

                if (value != '') {
                    content += '/' + key + ' ' + value + '\n';
                }
            }
            content += fieldObject.content;
            //fieldObject.content = content + fieldObject.content;
            return content;
        },

        /**
         * Creates a field
         * @param formObject the field, eg. Button
         */
        createField = function (formObject) {
            // Create formEntry and set formObject as Content
            var tmpForm = new Form();

            tmpForm.setContent(createContentFromFieldObject(formObject));

            tmpForm.hasAnnotation = formObject.hasAnnotation;

            tmpForm.stream = formObject.stream || null;

            this.acroformPlugin.fields.push(tmpForm);
        },

        createFieldCallback = function () {
            for (var i in this.acroformPlugin.fields) {
                var form = this.acroformPlugin.fields[i];
                var object = this.internal.newAdditionalObject();

                object.content = form.getContent();
                form.object = object;

                form.updateObject();

                if (form.hasAnnotation) {
                    // If theres an Annotation Widget in the Form Object, put the Reference in the /Annot array
                    createAnnotationReference.call(this, form.object.objId);
                }

                var res;
                /*if (true) {
                 res = text.call(this, "tests", 50, 250);
                 object.content += res;
                 }*/
            }
        },

        putCatalogCallback = function () {
            //Put reference to AcroForm to DocumentCatalog
            if (typeof this.acroformPlugin.acroFormDictionaryRoot[1] != 'undefined') { // for safety, shouldn't normally be the case
                this.internal.write('/Acroform ' + this.acroformPlugin.acroFormDictionaryRoot[1] + ' '
                    + 0 + ' R');
            } else {
                alert('Root missing there...');
            }
        },

        AcroFormDictionaryCallback = function () {
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
                '>>');

            this.internal.write('endobj');

            this.acroformPlugin.acroFormDictionaryRoot[1] = [objId];

            this.acroformPlugin.acroFormDictionaryRoot[0] = null;

            this.acroformPlugin.printedOut = true;

            // Clear Forms array
            //this.acroformPlugin.fields = [];
        },

        createAcroForm = function () {
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
        },

        /**
         * Create the Reference to the widgetAnnotation, so that it gets referenced in the Annot[] int the
         */
        createAnnotationReference = function (objId) {
            var options = {
                type: 'reference',
                objId: objId,
            }
            this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push(options);
        },

        /**
         * Converts the Parameters from x,y,w,h to lowerLeftX, lowerLeftY, upperRightX, upperRightY
         * @param x
         * @param y
         * @param w
         * @param h
         * @returns {*[]}
         */
        calculateCoordinates = function (x, y, w, h) {
            var coordinates = new Object();
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

            var res = [coordinates.lowerLeft_X, coordinates.lowerLeft_Y, coordinates.upperRight_X, coordinates.upperRight_Y];

            return res;
        },

        calculateColor = function (r, g, b) {
            var color = new Object();
            color.r = r | 0;
            color.g = g | 0;
            color.b = b | 0;
            return color;
        },

        arrayToString = function (array) {
            var string = '';
            for (var i in array) {
                string += array[i] + ' ';
            }
            return string;
        },

        createAppearanceStream = function () {

        }


    /**
     * Several different types of Forms
     */

    var FormOptions = function () {
        var _type = undefined;
        Object.defineProperties(this, 'type', {
            get: function () {
                return _type
            },
            set: function (type) {
                _type = type;
            }
        })
    };

    /**
     * Uses the Option-array and prints out all keys and values saved in it
     * @param opt
     */
    var createAnnotationWidgetFromOptions = function (opt) {
        var content = '';

        content += ' /Type /Annot\n'
            + ' /Subtype /Widget \n';

        var keys = Object.keys(opt);

        // todo: find a solution, to print all arrays as arrays with [] and blanks between the ertries
        for (var i in keys) {
            var key = keys[i];
            var value = opt[key];
            // leave out the arrays
            if (key == 'Rect') {
                // For Rect, the Coordinates have to be calculated, because they don't come in as PDF wants them...
                content += ' /Rect [' + arrayToString(calculateCoordinates.call(this, value)) + '] \n';
            } else if (Array.isArray(value)) {
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
        if (typeof options.pushbutton != 'undefined') {
            // Options.pushbutton should be 1 or 0
            flags = options.Ff | options.pushbutton << 17;
            delete options.pushbutton;
        }

        //16, Radio
        if (typeof options.radio != 'undefined') {
            flags = options.Ff | options.radio << 17;
            delete options.radio;
        }

        // 15, NoToggleToOff (Radio buttons only
        if (typeof options.noToggleToOff != 'undefined') {
            flags = options.Ff | options.noToggleToOff << 17;
            delete options.noToggleToOff;
        }

        // In case, there is no Flag set, it is a check-box

        options.Ff = options.Ff | flags;

        options.hasAnnotation = true;

        putForm.call(this, options);

    };

    var addTextField = function (options) {
        var options = options || new FieldObject();

        options.FT = 'Tx';

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

        // 21, FileSelect
        if (options.fileSelect) {
            flags = flags | (1 << 20);
            delete options.fileSelect;
        }

        // 23, DoNotSpellCheck
        if (options.doNotSpellCheck) {
            flags = flags | (1 << 22);
            delete options.doNotSpellCheck;
        }

        // 24, DoNotScroll
        if (options.doNotScroll) {
            flags = flags | (1 << 23);
            delete options.doNotScroll;
        }

        options.Ff = flags;

        options.hasAnnotation = true;

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
        if (typeof options.combo != 'undefined') {
            // Set Flag
            flags = flags | (1 << 17);
            // Remove multiline from FieldObject
            delete options.combo;
        }

        // 19, Edit
        if (typeof options.edit != 'undefined') {
            flags = flags | (1 << 18);
            delete options.edit;
        }

        // 20, Sort
        if (typeof options.sort != 'undefined') {
            flags = flags | (1 << 19);
            delete options.sort;
        }

        // 22, MultiSelect
        if (typeof options.multiSelect != 'undefined') {
            flags = flags | (1 << 21);
            delete options.multiSelect;
        }

        // 23, DoNotSpellCheck
        if (typeof options.doNotSpellCheck != 'undefined') {
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
        }

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
        }

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
    }


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
        // Options, that should be in the Annotation-Widget
        var annotationOptions = new Object;
        if (true) {// should be while and iterate over all of the keys in opt...
            // x,y,w,h
            if (typeof opt['Rect'] != 'undefined') {
                var rect = opt['Rect'];
                var x = rect[0] | 0,
                    y = rect[1] | 0,
                    w = rect[2] | 0,
                    h = rect[3] | 0;

                annotationOptions.Rect = calculateCoordinates.call(this, x, y, w, h);
            }

            if (typeof opt['BC'] != 'undefined') {
                var bc = opt['BC'];
                var r = bc[0],
                    g = bc[1],
                    b = bc[2];

                annotationOptions.BC = calculateColor(r, g, b);
            }

            if (typeof opt['BG'] != 'undefined') {
                var bc = opt['BG'];
                var r = bc[0],
                    g = bc[1],
                    b = bc[2];

                annotationOptions.BG = calculateColor(r, g, b);
            }

            if (typeof opt['CA'] != 'undefined') {
                annotationOptions.CA = opt['CA'];
            }

            if (typeof opt['T'] != 'undefined') {
                options.T = opt['T'];
            }

            // getKeys, but filter out those, that are in annotationOptions
            var keys = Object.keys(opt).filter(function (obj) {
                if (Object.keys(annotationOptions).indexOf(obj) != -1) {
                    return false;
                }
                return true;
            })

            for (var i in keys) {
                var key = keys[i];
                // Set all options from opt to options
                if (typeof opt[key] != 'undefined') {
                    options[key] = opt[key];
                }
            }

            if (annotationOptions.length > 0) {
                // in case, there are Annotatios, set the Flag, that is used to print the reference to the Annotation
                options.hasAnnotation = true;
            }

            options.content = createAnnotationWidgetFromOptions.call(this, annotationOptions);

            return options;
        }
    };


    /**
     *
     * @param options
     */
    jsPDFAPI.addCheckBox = function (opt) {
        var options = parseOptions(opt);

        addButton.call(this, options);
    };


    jsPDFAPI.addPushButton = function (opt) {
        // options, that are contained in the Field-Object
        var options = parseOptions(opt);

        // Set as Pusbutton
        options.pushbutton = true;

        addButton.call(this, options);

    }

    jsPDFAPI.addTextField = function (opt) {
        // options, that are contained in the Field-Object
        var options = parseOptions(opt);

        // if all options are put in the x-var as array, handle them
        if (typeof opt['multiline'] != 'undefined') {
            options.multiline = opt['multiline'];
        }

        if (typeof opt['password'] != 'undefined') {
            options.password = opt['password'];
        }

        if (typeof opt['fileSelect'] != 'undefined') {
            options.fileSelect = opt['fileSelect'];
        }

        if (typeof opt['doNotSpellCheck'] != 'undefined') {
            options.doNotSpellCheck = opt['doNotSpellCheck'];
        }

        if (typeof opt['doNotScroll'] != 'undefined') {
            options.doNotScroll = opt['doNotScroll'];
        }

        addTextField.call(this, options);
    }

    jsPDFAPI.addListBox = function (opt) {
        var options = parseOptions(opt);


        // Values for the Ff flag:


        if (typeof opt['combo'] != 'undefined') {
            options.combo = opt['combo'];
            delete opt['combo'];
        }

        if (typeof opt['edit'] != 'undefined') {
            options.edit = opt['edit'];
            delete opt['edit'];
        }

        if (typeof opt['sort'] != 'undefined') {
            options.sort = opt['sort'];
            delete opt['sort'];
        }

        if (typeof opt['multiSelect'] != 'undefined') {
            options.multiSelect = opt['multiSelect'];
            delete opt['multiSelect'];
        }

        if (typeof opt['doNotSpellCheck'] != 'undefined') {
            options.doNotSpellCheck = opt['doNotSpellCheck'];
            delete opt['doNotSpellCheck'];
        }

        addChoiceField.call(this, options);
    }

})
(jsPDF.API);