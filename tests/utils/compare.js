/* global XMLHttpRequest, expect */

function loadBinaryResource (url) {
  const req = new XMLHttpRequest()
  req.open('GET', url, false)
   // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
  req.overrideMimeType('text\/plain; charset=x-user-defined');
  req.responseType = "arraybuffer";
  req.send(null)
  if (req.status !== 200) {
    throw new Error('Unable to load file')
  }
  return new TextDecoder("utf-8").decode(new Uint8Array(req.response));
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
window.comparePdf = (actual, expectedFile, suite) => {
  let pdf
  try {
    pdf = loadBinaryResource(`/base/tests/${suite}/reference/${expectedFile}`)
  } catch (error) {
    sendReference(`/tests/${suite}/reference/${expectedFile}`, resetCreationDate(actual))
    pdf = actual
  }
  const expected = resetCreationDate(pdf).trim()
  actual = resetCreationDate(actual.trim())

  expect(actual).toEqual(expected)
}

window.comparePdf = (actual, expectedFile, suite) => {
    let pdf;
    let ready = false;
    let result = '';

    let check = function() {
        if (ready === true) {
              const expected = resetCreationDate(pdf).trim()
              actual = resetCreationDate(actual.trim())

              expect(actual).toEqual(expected)
             return;
        }
        setTimeout(check, 1000);
    }

    check();

    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = "arraybuffer";
    req.onloadend = function(evt) {
        // file is loaded
        pdf = evt.target.result;
        ready = true;
    };
    req.onerror = function () {
        sendReference(`/tests/${suite}/reference/${expectedFile}`, resetCreationDate(actual))
        pdf = actual
        ready = true;
    }
    req.send(null)
}
