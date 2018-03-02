/* global XMLHttpRequest, expect */
var globalVar = (typeof self !== "undefined" && self || typeof global !== "undefined" && global || typeof window !== "undefined" && window || (Function ("return this"))());
function loadBinaryResource (url) {
  const req = new XMLHttpRequest()
  req.open('GET', url, false);
   // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
  req.overrideMimeType('text\/plain; charset=x-user-defined');
  req.send(null);
  if (req.status !== 200) {
    throw new Error('Unable to load file');
  }

  var responseText = req.responseText;
  var responseTextLen = req.responseText.length;
  return responseText;
}

function cleanUpUnicode(value) {
    var i = 0;
    var byteArray = [];
	var StringFromCharCode = String.fromCharCode;
    for (i = 0; i < value.length; i += 1) {
      byteArray.push(StringFromCharCode(value.charCodeAt(i) & 0xff))
    }
	return byteArray.join("");
}

function sendReference (filename, data) {
  var req = new XMLHttpRequest();
  req.open('POST', 'http://localhost:9090/'+filename, true);
  req.send(data);
}

function resetFile(pdfFile) {
  pdfFile = pdfFile.replace(/\/CreationDate \(D:(.*?)\)/, '/CreationDate (D:19871210000000+00\'00\'\)');
  pdfFile = pdfFile.replace(/(\/ID \[ (<[0-9a-fA-F]+> ){2}\])/, '/ID [ <00000000000000000000000000000000> <00000000000000000000000000000000> ]');
  pdfFile = pdfFile.replace(/(\/Producer \(jsPDF [1-9].[0-9].[0-9]\))/, '/Producer (jsPDF 1.0.0)');
  return pdfFile;
}
/**
 * Find a better way to set this
 * @type {Boolean}
 */
globalVar.comparePdf = function (actual, expectedFile, suite, unicodeCleanUp) {
  var unicodeCleanUp = unicodeCleanUp || true;
  var pdf;
  actual = actual || 'File not loaded.';
  
  try {
    pdf = loadBinaryResource('/base/tests/' + suite + '/reference/' + expectedFile, unicodeCleanUp);
  } catch (error) {
    console.log("Error loading '/base/tests/" + suite + "/reference/" + expectedFile + "'");
    sendReference('/tests/${suite}/reference/' + expectedFile, resetFile(actual))
    pdf = actual;
  }
  var expected = cleanUpUnicode(resetFile(pdf.trim()));	
  actual = cleanUpUnicode(resetFile(actual.trim()));
	
  expect(actual).toEqual(expected)
}
