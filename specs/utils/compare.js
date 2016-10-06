/* global XMLHttpRequest, expect */

function loadBinaryResource (url) {
  const req = new XMLHttpRequest()
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
  const req = new XMLHttpRequest()
  req.open('POST', `http://localhost:9090/${filename}`, true)
  req.onload = e => {
    console.log(e)
  }
  req.send(data)
}

const resetCreationDate = input => input.replace(/\/CreationDate \(D:(.*?)\)/, '/CreationDate (D:19871210000000+00\'00\'\)')

/**
 * Find a better way to set this
 * @type {Boolean}
 */

window.comparePdf = (actual, expectedFile, suite) => {
  if (false) {
    sendReference(`/specs/${suite}/reference/${expectedFile}`, resetCreationDate(actual))
  } else {
    const expected = resetCreationDate(loadBinaryResource(`/base/specs/${suite}/reference/${expectedFile}`).trim())
    actual = resetCreationDate(actual.trim())

    expect(actual).toEqual(expected)
  }
}
