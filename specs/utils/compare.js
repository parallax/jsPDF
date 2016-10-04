'use strict'
/* global XMLHttpRequest */

function loadBinaryResource (url) {
  var req = new XMLHttpRequest()
  req.open('GET', url, false)
   // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
  req.overrideMimeType('text\/plain; charset=x-user-defined')
  req.send(null)
  if (req.status !== 200) {
    throw new Error('Unable to load file')
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
  return input.replace(/\/CreationDate \(D:(.*?)\)/, '/CreationDate (D:19871210000000+00\'00\'\)')
}

/**
 * Find a better way to set this
 * @type {Boolean}
 */
var training = false

var comparePdf = function (actual, expectedFile) {
  if (training === true) {
    sendReference('/specs/text/reference/' + expectedFile, resetCreationDate(actual))
  } else {
    var expected = resetCreationDate(loadBinaryResource('/base/specs/text/reference/' + expectedFile).trim())
    actual = resetCreationDate(actual.trim())

    expect(actual).toEqual(expected)
  }
}
