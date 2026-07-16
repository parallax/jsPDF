/* eslint-disable no-console */
/* global XMLHttpRequest, expect, fail */
declare const global: typeof globalThis | undefined;
declare function require(id: string): {
  readFileSync(path: string, options: { encoding: string }): string;
  resolve(path: string): string;
};
declare const __dirname: string;

interface CompareGlobals {
  isNode?: boolean;
  sendReference(filename: string, data: string): void;
  loadBinaryResource(url: string, unicodeCleanUp?: boolean): string;
  comparePdf(actual: string, expectedFile: string, suite?: string): void;
  invalidArg<T>(value: unknown): T;
}

const globalVar: CompareGlobals & typeof globalThis =
  (typeof self !== "undefined" && self) ||
  (typeof global !== "undefined" && global) ||
  (typeof window !== "undefined" && window) ||
  Function("return this")();

globalVar.sendReference = function () {};

/**
 * Deliberately defeats the type system for negative tests that feed invalid
 * values to an API and assert the resulting error. This is the ONLY sanctioned
 * type-laundering primitive in the test suite; the double-assertion-through-unknown
 * pattern is banned by lint. Runtime identity.
 */
globalVar.invalidArg = function <T>(value: unknown): T {
  return value as T;
};
globalVar.loadBinaryResource = function () {
  return "";
};

const prefix = globalVar.isNode ? "/../" : "/base/test/";

if (globalVar.isNode === true) {
  const fs = require("fs");
  const path = require("path");
  globalVar.loadBinaryResource = function (url: string): string {
    let result = "";
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
  globalVar.sendReference = function (filename: string, data: string): void {
    const req = new XMLHttpRequest();
    req.open("POST", `http://localhost:9090${filename}`, true);
    req.setRequestHeader("Content-Type", "text/plain; charset=x-user-defined");
    req.onload = () => {
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

  globalVar.loadBinaryResource = function (
    url: string,
    unicodeCleanUp?: boolean
  ): string {
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
      const byteArray = new Array<string>(req.responseText.length);

      for (let i = 0; i < responseText.length; i += 1) {
        byteArray[i] = StringFromCharCode(responseText.charCodeAt(i) & 0xff);
      }
      return byteArray.join("");
    }

    return req.responseText;
  };
}

function resetFile(pdfFile: string): string {
  pdfFile = pdfFile.replace(
    /\/CreationDate \([^)]+\)/,
    "/CreationDate (D:19871210000000+00'00')"
  );
  pdfFile = pdfFile.replace(
    /(\/ID \[ (<[0-9a-fA-F]+> ){2}\])/,
    "/ID [ <00000000000000000000000000000000> <00000000000000000000000000000000> ]"
  );
  pdfFile = pdfFile.replace(/\/Producer \([^)]+\)/, "/Producer (jsPDF 0.0.0)");
  return pdfFile;
}

globalVar.comparePdf = function (
  actual: string,
  expectedFile: string,
  _suite?: string
): void {
  let pdf: string;
  try {
    pdf = globalVar.loadBinaryResource("reference/" + expectedFile, true);
    if (typeof pdf !== "string") {
      throw Error("Error loading 'reference/" + expectedFile + "'");
    }
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
    globalVar.sendReference(
      "/test/reference/" + expectedFile,
      resetFile(actual.replace(/^\s+|\s+$/g, ""))
    );
    return;
  }
  const expected = resetFile(pdf.replace(/^\s+|\s+$/g, ""));
  actual = resetFile(actual.replace(/^\s+|\s+$/g, ""));

  expect(actual.replace(/[\r]/g, "").split("\n")).toEqual(
    expected.replace(/[\r]/g, "").split("\n")
  );
};
