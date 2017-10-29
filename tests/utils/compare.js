/* global XMLHttpRequest, expect */

function loadBinaryResource (url, unicodeCleanUp) {
  const req = new XMLHttpRequest()
  req.open('GET', url, false)
   // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
  req.overrideMimeType('text\/plain; charset=x-user-defined');
  req.send(null)
  if (req.status !== 200) {
    throw new Error('Unable to load file')
  }
      var responseText = req.responseText;
    var responseTextLen = req.responseText.length;
    if (unicodeCleanUp === true) {
      var byteArray = [];
      //let asciidDecoder = new TextDecoder('iso-8859-1');
      var i = 0;
      for (i = 0; i < req.responseText.length; i += 1) {
        byteArray.push(req.responseText.charCodeAt(i) & 0xff);
      }
      return String.fromCharCode.apply(null, new Uint8Array(byteArray));
      //return asciidDecoder.decode(new Uint8Array(byteArray));
    }
  return req.responseText;
}

function sendReference (filename, data) {
  const req = new XMLHttpRequest()
  req.open('POST', `http://localhost:9090/${filename}`, true)
  req.onload = e => {
    console.log(e)
  }
  req.send(data)
}

const resetCreationDate = input =>
  input.replace(
    /\/CreationDate \(D:(.*?)\)/,
    '/CreationDate (D:19871210000000+00\'00\'\)'
  )

/**
 * Find a better way to set this
 * @type {Boolean}
 */
window.comparePdf = (actual, expectedFile, suite, unicodeCleanUp) => {
  let pdf;
  unicodeCleanUp = unicodeCleanUp || false;
  try {
    pdf = loadBinaryResource(`/base/tests/${suite}/reference/${expectedFile}`, unicodeCleanUp)
  } catch (error) {
    sendReference(`/tests/${suite}/reference/${expectedFile}`, resetCreationDate(actual))
    pdf = actual
  }
  const expected = resetCreationDate(pdf).trim()
  actual = resetCreationDate(actual.trim())

  expect(actual).toEqual(expected)
}
