/** @preserve
jsPDF svg plugin
Copyright (c) 2016 James Hall
MIT license.
*/
;(function (jsPDFAPI) {
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
   * Render an SVG to the document.
   *
   * @param  {Mixed} svg      Pass either a DOM object, or a string containing
   * the SVG content itself.
   * @param  {Object} options Options are passed in as an object:
   * * x - The x position
   * * y - The y position
   * @return {jsPDF}
   * @function
   * @name svg
   * @example
   * var doc = new jsPDF()
   * doc.svg(document.querySelector('.svg'))
   *
   * // or to draw at a particular point on the page
   * doc.svg(document.querySelector('.svg'), { x: 10, y: 10 })
   *
   * // You can also draw SVG content directly
   * doc.svg(`<svg width="120" height="120" viewBox="0 0 120 120"
   *  xmlns="http://www.w3.org/2000/svg">
   *  <rect x="0" y="0" width="100" height="100"/>
   *  </svg>`, {
   *   x: 20,
   *   y: 20
   * })
   */
  jsPDFAPI.svg = function (svg, options) {
    /**
     * If it's a string, then treat it as raw SVG content
     */
    var svgContent
    if (typeof svg === 'string') {
      svgContent = svg
    }
    if (typeof svg === 'object') {
      svgContent = svg.outerHTML
    }
    if (typeof options === 'undefined') {
      options = {}
    }
    if (options.x === undefined) {
      options.x = 0
    }
    if (options.y === undefined) {
      options.y = 0
    }
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
