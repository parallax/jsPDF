/* global describe, it, jsPDF, expect */

describe("Module: FileLoad", () => {
  beforeAll(loadGlobals);
  var successURL =
    typeof isNode !== "undefined" && isNode
      ? "./test/reference/success.txt"
      : "/base/test/reference/success.txt";
  it("should load a file (sync)", () => {
    const doc = jsPDF();
    if (typeof isNode !== "undefined" && isNode) {
      doc.allowFsRead = [successURL];
    }
    var file = doc.loadFile(successURL, undefined, undefined);
    expect(file).toEqual("success");
  });

  it("should fail to load a file (sync)", () => {
    const doc = jsPDF();
    if (typeof isNode !== "undefined" && isNode) {
      doc.allowFsRead = ["fail.txt"];
    }
    var file = doc.loadFile("fail.txt", undefined, undefined);
    expect(file).toEqual(undefined);
  });

  it("should load a file (async)", done => {
    const doc = jsPDF();
    if (typeof isNode !== "undefined" && isNode) {
      doc.allowFsRead = [successURL];
    }
    doc.loadFile(successURL, false, function(data) {
      expect(data).toEqual("success");
      done();
    });
  });

  it("should fail to load a file (async)", done => {
    const doc = jsPDF();
    if (typeof isNode !== "undefined" && isNode) {
      doc.allowFsRead = ["fail.txt"];
    }
    doc.loadFile("fail.txt", false, function(data) {
      expect(data).toEqual(undefined);
      done();
    });
  });
});

if (typeof isNode !== "undefined" && isNode) {
  const path = require("path");

  describe("Module: FileLoad (Node permissions)", () => {
    const absSuccess = path.resolve("./test/reference/success.txt");
    let originalPermission;

    beforeEach(() => {
      originalPermission = process.permission;
    });

    afterEach(() => {
      process.permission = originalPermission;
    });

    it("should throw if neither process.permission nor jsPDF.allowFsRead is set", () => {
      const doc = jsPDF();
      doc.allowFsRead = undefined;
      process.permission = undefined;

      expect(() => {
        doc.loadFile(absSuccess, true);
      }).toThrowError(/Trying to read a file from local file system/);
    });

    it("should allow reading via process.permission for exact absolute path", () => {
      const doc = jsPDF();
      doc.allowFsRead = undefined;
      process.permission = {
        has: (perm, url) => perm === "fs.read" && url === absSuccess
      };

      const data = doc.loadFile(absSuccess, true);
      expect(data).toEqual("success");
    });

    it("should deny reading via process.permission when has() returns false", () => {
      const doc = jsPDF();
      doc.allowFsRead = undefined;
      process.permission = {
        has: () => false
      };

      expect(() => {
        doc.loadFile(absSuccess, true);
      }).toThrowError(/Permission denied/);
    });

    it("should allow reading via process.permission with wildcard-like directory prefix", () => {
      const doc = jsPDF();
      doc.allowFsRead = undefined;
      const allowedDir = path.resolve("./test/reference/");
      process.permission = {
        has: (perm, url) => perm === "fs.read" && url.startsWith(allowedDir)
      };

      const data = doc.loadFile(absSuccess, true);
      expect(data).toEqual("success");
    });

    it("should allow reading via jsPDF.allowFsRead using absolute path (no wildcard)", () => {
      const doc = jsPDF();
      doc.allowFsRead = [absSuccess];
      const data = doc.loadFile(absSuccess, true);
      expect(data).toEqual("success");
    });

    it("should allow reading via jsPDF.allowFsRead using relative path (no wildcard)", () => {
      const doc = jsPDF();
      doc.allowFsRead = ["./test/reference/success.txt"];
      const data = doc.loadFile("./test/reference/success.txt", true);
      expect(data).toEqual("success");
    });

    it("should allow reading via jsPDF.allowFsRead using wildcard prefix", () => {
      const doc = jsPDF();
      doc.allowFsRead = ["./test/reference/*"];
      const data = doc.loadFile("./test/reference/success.txt", true);
      expect(data).toEqual("success");
    });

    it("should deny reading when jsPDF.allowFsRead pattern does not match", () => {
      const doc = jsPDF();
      doc.allowFsRead = ["./other/dir/*", "./test/reference/deny.txt"];
      expect(() => {
        doc.loadFile("./test/reference/success.txt", true);
      }).toThrowError(/Permission denied/);
    });
  });
}
