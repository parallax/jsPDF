/* eslint-disable no-console */
/* global XMLHttpRequest, expect, fail */
var globalVar =
  (typeof self !== "undefined" && self) ||
  (typeof global !== "undefined" && global) ||
  (typeof window !== "undefined" && window) ||
  Function("return this")();

globalVar.sendReference = function() {};
globalVar.loadBinaryResource = function() {};

var prefix = globalVar.isNode ? "/../" : "/base/test/";

if (globalVar.isNode === true) {
  var fs = require("fs");
  var path = require("path");
  globalVar.loadBinaryResource = function(url) {
    var result = "";
    try {
      result = fs.readFileSync(path.resolve(__dirname + prefix + url), {
        encoding: "latin1"
      });
    } catch (e) {
      console.log(e);
    }
    return result;
  };
} else {
  globalVar.sendReference = function(filename, data) {
    const req = new XMLHttpRequest();
    req.open("POST", `http://localhost:9090${filename}`, true);
    req.setRequestHeader("Content-Type", "text/plain; charset=x-user-defined");
    req.onload = e => {
      //console.log(e)
    };

    const uint8Array = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      uint8Array[i] = data.charCodeAt(i);
    }
    const blob = new Blob([uint8Array], {
      type: "text/plain; charset=x-user-defined"
    });

    req.send(blob);
  };

  globalVar.loadBinaryResource = function(url, unicodeCleanUp) {
    const req = new XMLHttpRequest();
    req.open("GET", prefix + url, false);
    // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
    req.overrideMimeType("text/plain; charset=x-user-defined");
    req.send(null);
    if (req.status !== 200) {
      throw new Error("Unable to load file");
    }

    const responseText = req.responseText;
    if (unicodeCleanUp) {
      const StringFromCharCode = String.fromCharCode;
      const byteArray = new Array(req.responseText.length);

      for (let i = 0; i < responseText.length; i += 1) {
        byteArray[i] = StringFromCharCode(responseText.charCodeAt(i) & 0xff);
      }
      return byteArray.join("");
    }

    return req.responseText;
  };
}

function resetFile(pdfFile) {
  pdfFile = pdfFile.replace(
    /\/CreationDate \(D:(.*?)\)/,
    "/CreationDate (D:19871210000000+00'00')"
  );
  pdfFile = pdfFile.replace(
    /(\/ID \[ (<[0-9a-fA-F]+> ){2}\])/,
    "/ID [ <00000000000000000000000000000000> <00000000000000000000000000000000> ]"
  );
  pdfFile = pdfFile.replace(
    /(\/Producer \(jsPDF [^)]+\))/,
    "/Producer (jsPDF 0.0.0)"
  );
  return pdfFile;
}
/**
 * Find a better way to set this
 * @type {Boolean}
 */
globalVar.comparePdf = function(actual, expectedFile, suite) {
  var pdf;
  try {
    pdf = globalVar.loadBinaryResource("reference/" + expectedFile, true);
    if (typeof pdf !== "string") {
      throw Error("Error loading 'reference/" + expectedFile + "'");
    }
  } catch (error) {
    fail(error.message);
    globalVar.sendReference(
      "/test/reference/" + expectedFile,
      resetFile(actual.replace(/^\s+|\s+$/g, ""))
    );
    return;
  }
  var expected = resetFile(pdf.replace(/^\s+|\s+$/g, ""));
  actual = resetFile(actual.replace(/^\s+|\s+$/g, ""));

  expect(actual.replace(/[\r]/g, "").split("\n")).toEqual(
    expected.replace(/[\r]/g, "").split("\n")
  );
};
