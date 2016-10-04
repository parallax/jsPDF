'use strict';
/* global describe, it, expect */

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
  if (req.status != 200) return ''
  return req.responseText
}

var resetCreationDate = function (input) {
  return input.replace(/\/CreationDate \(D:(.*?)\)/, '/CreationDate (D:19871210000000+01\'00\'')
}

var comparePdf = function (actual, expectedFile) {
  var expected = resetCreationDate(loadBinaryResource('/base/specs/text/reference/' + expectedFile).trim())
  actual = resetCreationDate(actual.trim())

  expect(actual).toEqual(expected)
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
    //var doc = new jsPDF()
    // doc.text(10, 10, 'This is a test!')
    // document.body.innerHTML = '<iframe class="pdf" width="50%" height="600"></iframe>'
    // document.querySelectorAll('.pdf')[0].src = doc.output('datauristring')
    //comparePdf(doc.output(), 'standard.pdf')
  })
  it('should allow text insertion at an angle', function () {
    //var doc = new jsPDF()
    //doc.text(20, 20, 'This is a test!', null, 20)
    //comparePdf(doc.output(), 'angle.pdf')
  })
})
