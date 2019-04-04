/* global jsPDF */
/**
 * @license
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
* jsPDF jpeg Support PlugIn
*
* @name jpeg_support
* @module
*/
(function (jsPDFAPI) {
    'use strict';

    //takes a string imgData containing the raw bytes of
    //a jpeg image and returns [width, height]
    //Algorithm from: http://www.64lines.com/jpeg-width-height
    var getJpegSize = function (imgData) {
        'use strict'
        var width, height, numcomponents;
        var blockLength = imgData.charCodeAt(4) * 256 + imgData.charCodeAt(5);
        var i = 4, len = imgData.length;
        while (i < len) {
            i += blockLength;
            if (imgData.charCodeAt(i) !== 0xff) {
                throw new Error('getJpegSize could not find the size of the image');
            }
            if (imgData.charCodeAt(i + 1) === 0xc0 || //(SOF) Huffman  - Baseline DCT
                imgData.charCodeAt(i + 1) === 0xc1 || //(SOF) Huffman  - Extended sequential DCT
                imgData.charCodeAt(i + 1) === 0xc2 || // Progressive DCT (SOF2)
                imgData.charCodeAt(i + 1) === 0xc3 || // Spatial (sequential) lossless (SOF3)
                imgData.charCodeAt(i + 1) === 0xc4 || // Differential sequential DCT (SOF5)
                imgData.charCodeAt(i + 1) === 0xc5 || // Differential progressive DCT (SOF6)
                imgData.charCodeAt(i + 1) === 0xc6 || // Differential spatial (SOF7)
                imgData.charCodeAt(i + 1) === 0xc7) {
                height = imgData.charCodeAt(i + 5) * 256 + imgData.charCodeAt(i + 6);
                width = imgData.charCodeAt(i + 7) * 256 + imgData.charCodeAt(i + 8);
                numcomponents = imgData.charCodeAt(i + 9);
                return { width: width, height: height, numcomponents: numcomponents };
            } else {
                i += 2;
                blockLength = imgData.charCodeAt(i) * 256 + imgData.charCodeAt(i + 1)
            }
        }
    };

    /**
    * @ignore
    */
    jsPDFAPI.processJPEG = function (data, index, alias, compression, dataAsBinaryString, colorSpace) {
        'use strict'
        var filter = this.decode.DCT_DECODE,
            bpc = 8,
            dims;

        if (!(typeof data === 'string') && !this.__addimage__.isArrayBuffer(data) && !this.__addimage__.isArrayBufferView(data)) {
            return null;
        }


        if (this.__addimage__.isArrayBuffer(data)) {
            data = new Uint8Array(data);
        }
        if (this.__addimage__.isArrayBufferView(data)) {
            // if we already have a stored binary string rep use that
            data = dataAsBinaryString || this.__addimage__.arrayBufferToBinaryString(data);
        }

        if (typeof data === 'string') {
            dims = getJpegSize(data);
        }
        if (colorSpace === undefined) {
            switch (dims.numcomponents) {
                case 1:
                    colorSpace = this.color_spaces.DEVICE_GRAY;
                    break;
                case 4:
                    colorSpace = this.color_spaces.DEVICE_CMYK;
                    break;
                default:
                case 3:
                    colorSpace = this.color_spaces.DEVICE_RGB;
                    break;
            }
        }

        return {data: data, width: dims.width, height: dims.height, colorSpace: colorSpace, bitsPerComponent: bpc, filter: filter, index: index, alias: alias};
    };
})(jsPDF.API);
