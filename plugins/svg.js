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
   * @todo Remove duplication
   */
  function loadBinaryResource (url) {
    const req = new XMLHttpRequest()
    req.open('GET', url, false)
     // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
    req.overrideMimeType('text\/plain; charset=x-user-defined')
    req.send(null)
    if (req.status !== 200) {
      throw new Error('Unable to load file ' + url)
    }
    return req.responseText
  }

  /**
   * This is a cheap hack that inserts the SVG into a browser node to get it
   * to clean it up for us.
   * @param  {string} svg The SVG code
   * @return {object}     A DOM object
   */
  var domClean = function (svg) {
    var div = document.createElement('div');
    div.innerHTML = svg
    return div.querySelector('svg')
  }

  var getSvgFromInput = function (svg) {
    /**
     * If it's a string, then treat it as either raw SVG content
     */
    var svgContent
    if (typeof svg === 'string') {
      // If it's SVG
      if (svg.indexOf('<svg') !== -1) {
        svgContent = domClean(svg)
      } else {
        // Otherwise it's a URL
        svgContent = domClean(loadBinaryResource(svg))
      }
    }

    if (typeof svg === 'object') {
      svgContent = svg
    }

    // Everything should be an object now
    svgContent = fixDimensions(svgContent)

    return svgContent.outerHTML
  }

  /**
   * Fix dimensions, if there's any 100%s in there that won't render
   * @todo Change that to the page size
   *
   * @param  {object} dom DOM node of an SVG
   * @return {object}     Fixed DOM node
   */
  var fixDimensions = function (dom) {
    if (dom.getAttributeNode('width').nodeValue == '100%') {
      var width = document.createAttribute('width')
      width.value = '100'
      dom.setAttributeNode(width)
    }
    if (dom.getAttributeNode('height').nodeValue == '100%') {
      var width = document.createAttribute('height')
      width.value = '100'
      dom.setAttributeNode(width)
    }
    return dom
  }

  /**
   * Render an SVG to the document.
   *
   * @param  {Mixed} svg      Pass either a DOM object, a string containing the
   * SVG content, or a path to the SVG you want to add.
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
    var svgContent = getSvgFromInput(svg)

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
