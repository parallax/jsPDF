/** @preserve
jsPDF svg plugin
Copyright (c) 2016 James Hall
MIT license.
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
  /**
  * Adds an SVG to the document
  *
  * @returns {jsPDF}
  * @name svg
  * @example
  * var doc = new jsPDF()
  * doc.svg(document.querySelector('.svg'))
  *
  * // or to draw at a particular point on the page
  * doc.svg(document.querySelector('.svg'), { x: 10, y: 10 })
  */
  jsPDFAPI.svg = function (element, options) {
    if (typeof options === 'undefined') {
      options = {}
    }
    if (options.x === undefined) {
      options.x = 0
    }
    if (options.y === undefined) {
      options.y = 0
    }
    var svgContent = element.outerHTML
    var c = this.canvas
    var ctx = c.getContext('2d')
    ctx.ignoreClearRect = true
    canvg(c, svgContent, {
      ignoreMouse: true,
      ignoreAnimation: true,
      ignoreDimensions: true,
      useCORS: true,
      offsetX: options.x,
      offsetY: options.y
    })
    return this
  }
})(jsPDF.API)
