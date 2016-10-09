/**
 * jsPDF SVG Plugin
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

 /**
 * Adds an SVG to the document
 *
 * @returns {jsPDF}
 * @name svg
 * @example
 * var doc = new jsPDF()
 * doc.svg(document.querySelector('.svg'))
 */

(function (jsPDFAPI) {
  'use strict'

  // IE does not support outerHTML on SVGElement
  if (typeof SVGElement === 'object' && !SVGElement.prototype.outerHTML) {
    Object.defineProperty(SVGElement.prototype, 'outerHTML', {
      get: function () {
        var $node
        var $temp
        $temp = document.createElement('div')
        $node = this.cloneNode(true)
        $temp.appendChild($node)
        return $temp.innerHTML
      },
      enumerable: false,
      configurable: true
    })
  }

  jsPDFAPI.svg = function (element, options) {
    console.warn('Not implemented')
    var svgContent = element.outerHTML
    var c = this.canvas
    var ctx = c.getContext('2d')
    ctx.ignoreClearRect = true
    canvg(c, svgContent, {
      ignoreMouse: true,
      ignoreAnimation: true,
      ignoreDimensions: true,
      useCORS: true
    })
    return this
  }
})(jsPDF.API)
