'use strict'
/* global describe, it, expect, XMLHttpRequest, jsPDF */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

function loadBinaryResource (url) {
  var req = new XMLHttpRequest()
  req.open('GET', url, false)
   // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
  req.overrideMimeType('text\/plain; charset=x-user-defined')
  req.send(null)
  if (req.status != 200) {
    throw 'Unable to load file'
  }
  return req.responseText
}

function sendReference (filename, data) {
  var req = new XMLHttpRequest()
  req.open('POST', 'http://localhost:9090/' + filename, true)
  req.onload = function (e) {
    console.log(e)
  }
  req.send(data)
}

var resetCreationDate = function (input) {
  return input.replace(/\/CreationDate \(D:(.*?)\)/, '/CreationDate (D:19871210000000+01\'00\'')
}

/**
 * Find a better way to set this
 * @type {Boolean}
 */
var training = false

var comparePdf = function (actual, expectedFile) {
  if (training === true) {
    sendReference('/specs/text/reference/' + expectedFile, actual)
  } else {
    var expected = resetCreationDate(loadBinaryResource('/base/specs/text/reference/' + expectedFile).trim())
    actual = resetCreationDate(actual.trim())

    expect(actual).toEqual(expected)
  }
}

describe('Standard Text', function () {
  it('should load', function () {
    // assertions here]
    expect(typeof jsPDF).toBe('function')
  })
  it('should generate blank page', function () {
    var doc = new jsPDF()
    comparePdf(doc.output(), 'blank.pdf')
  })
  it('should allow text insertion', function () {
    var doc = new jsPDF()
    doc.text(10, 10, 'This is a test!')
    comparePdf(doc.output(), 'standard.pdf')
  })
  it('should allow text insertion at an angle', function () {
    var doc = new jsPDF()
    doc.text(20, 20, 'This is a test!', null, 20)
    comparePdf(doc.output(), 'angle.pdf')
  })
  it('should render different font faces', function () {
    var doc = new jsPDF();

    doc.text(20, 20, 'This is the default font.')

    doc.setFont('courier')
    doc.setFontType('normal')
    doc.text(20, 30, 'This is courier normal.')

    doc.setFont('times')
    doc.setFontType('italic')
    doc.text(20, 40, 'This is times italic.')

    doc.setFont('helvetica')
    doc.setFontType('bold')
    doc.text(20, 50, 'This is helvetica bold.')

    doc.setFont('courier')
    doc.setFontType('bolditalic')
    doc.text(20, 60, 'This is courier bolditalic.')

    comparePdf(doc.output(), 'font-faces.pdf')
  })
})
