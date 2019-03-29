/* global jsPDF */
/**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
/**
 * jsPDF Canvas PlugIn
 * This plugin mimics the HTML5 Canvas
 * 
 * The goal is to provide a way for current canvas users to print directly to a PDF.
 * @name canvas
 * @module
 */
(function (jsPDFAPI) {
    'use strict';

    /**
    * @class Canvas
    * @classdesc A Canvas Wrapper for jsPDF
    */
    var Canvas = function () {

        var jsPdfInstance = undefined;
        Object.defineProperty(this, 'pdf', {
            get: function () {
                return jsPdfInstance;
            },
            set: function (value) {
                jsPdfInstance = value;
            }
        });

        var _width = 150;
        /**
        * The height property is a positive integer reflecting the height HTML attribute of the <canvas> element interpreted in CSS pixels. When the attribute is not specified, or if it is set to an invalid value, like a negative, the default value of 150 is used.
        * This is one of the two properties, the other being width, that controls the size of the canvas.
        *
        * @name width
        */
        Object.defineProperty(this, 'width', {
            get: function () {
                return _width;
            },
            set: function (value) {
                if (isNaN(value) || ((Number.isInteger(value) === false)) || value < 0) {
                    _width = 150;
                } else {
                    _width = value;
                }
                if (this.getContext('2d').pageWrapXEnabled) {
                    this.getContext('2d').pageWrapX = _width + 1;
                }
            }
        });

        var _height = 300;
        /**
        * The width property is a positive integer reflecting the width HTML attribute of the <canvas> element interpreted in CSS pixels. When the attribute is not specified, or if it is set to an invalid value, like a negative, the default value of 300 is used.
        * This is one of the two properties, the other being height, that controls the size of the canvas.
        *
        * @name height
        */
        Object.defineProperty(this, 'height', {
            get: function () {
                return _height;
            },
            set: function (value) {
                if (isNaN(value) || ((Number.isInteger(value) === false)) || value < 0) {
                    _height = 300;
                } else {
                    _height = value;
                }
                if (this.getContext('2d').pageWrapYEnabled) {
                    this.getContext('2d').pageWrapY = _height + 1;
                }
            }
        });

        var _childNodes = [];
        Object.defineProperty(this, 'childNodes', {
            get: function () {
                return _childNodes;
            },
            set: function (value) {
                _childNodes = value;
            }
        });

        var _style = {};
        Object.defineProperty(this, 'style', {
            get: function () {
                return _style;
            },
            set: function (value) {
                _style = value;
            }
        });

        Object.defineProperty(this, 'parentNode', {});
    };

    /**
    * The getContext() method returns a drawing context on the canvas, or null if the context identifier is not supported.
    * 
    * @name getContext
    * @function
    * @param {string} contextType Is a String containing the context identifier defining the drawing context associated to the canvas. Possible value is "2d", leading to the creation of a Context2D object representing a two-dimensional rendering context.
    * @param {object} contextAttributes
    */
    Canvas.prototype.getContext = function (contextType, contextAttributes) {
        contextType = contextType || '2d';
        var key;

        if (contextType !== '2d') {
            return null;
        }
        for (key in contextAttributes) {
            if (this.pdf.context2d.hasOwnProperty(key)) {
                this.pdf.context2d[key] = contextAttributes[key];
            }
        }
        this.pdf.context2d._canvas = this;
        return this.pdf.context2d;
    };

    /**
    * The toDataURL() method is just a stub to throw an error if accidently called.
    * 
    * @name toDataURL
    * @function
    */
    Canvas.prototype.toDataURL = function () {
        throw new Error('toDataURL is not implemented.');
    };

    jsPDFAPI.events.push([
        'initialized', function () {
            this.canvas = new Canvas();
            this.canvas.pdf = this;
        }
    ]);

    return this;
})(jsPDF.API);
