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

    jsPDFAPI.acroForm = function () {
        putForm.call(this);
    };

    var Form = function () {
        this.content = '';
        this.objId = -1;
        this.object = null;
    };

    Form.prototype.getContent = function () {
        return this.content;
    };

    Form.prototype.setContent = function (cnt) {
        this.content = '<< \n' + cnt + '\n >>';
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


    var putForm = function () {
            if (!this.acroformPlugin.hasRoot.call(this)) {
                createAcroForm.call(this);
            }
            createField.call(this, '%test');
        },


        /**
         * Creates a field
         * @param formObject the field, eg. Button
         */
        createField = function (formObject) {
            // Create formEntry and set formObject as Content
            var tmpForm = new Form();
            tmpForm.setContent(formObject);

            this.acroformPlugin.fields.push(tmpForm);
        },

        createFieldCallback = function () {
            for (var i in this.acroformPlugin.fields) {
                var form = this.acroformPlugin.fields[i];
                var object = this.internal.newAdditionalObject();

                /*if (formObject) {

                 } else {*/
                object.content = form.getContent();
                form.object = object;
                //('<< %Hier ist ein Feld ' + object.objId + ' >>')
                // }
                form.updateObject();
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
            this.internal.write('<< ',
                'Fields[');
            for (var i in this.acroformPlugin.fields) {
                var field = this.acroformPlugin.fields[i];
                this.internal.write(field.getObjId() + ' 0 R ');
                delete this.acroformPlugin.fields[this.acroformPlugin.fields.indexOf(field)];
            }
            this.internal.write(']',
                '>>');
            this.acroformPlugin.acroFormDictionaryRoot[1] = [objId];
            //jsPDFAPI.acroformPlugin.acroFormDictionaryRoot[1] = [objId];

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
            this.internal.events.subscribe('putAdditionalObjects', createFieldCallback);
        }

})
(jsPDF.API);
/**
 var doc = new jsPDF();
 doc.acroForm();
 doc.acroForm();
 doc.save();
 **/