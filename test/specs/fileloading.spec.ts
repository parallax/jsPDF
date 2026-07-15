/* global describe, it, jsPDF, expect */

/**
 * Minimal view of Node's `process` used by the Node-only specs below
 * (@types/node is not part of the test compilation).
 */
declare const process: {
  permission?: { has(perm: string, url?: string): boolean };
};

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
    // The declared callback type requires a string return, but the runtime
    // ignores the callback's return value (LoadFileCallback in
    // src/modules/fileloading.ts), so the void callback is safe.
    doc.loadFile(successURL, false, function (data?: string) {
      expect(data).toEqual("success");
      done();
    } as unknown as (data: string) => string);
  });

  it("should fail to load a file (async)", done => {
    const doc = jsPDF();
    if (typeof isNode !== "undefined" && isNode) {
      doc.allowFsRead = ["fail.txt"];
    }
    // See the cast note in the async success spec above.
    doc.loadFile("fail.txt", false, function (data?: string) {
      expect(data).toEqual(undefined);
      done();
    } as unknown as (data: string) => string);
  });
});

if (typeof isNode !== "undefined" && isNode) {
  const path = require("path");

  describe("Module: FileLoad (Node permissions)", () => {
    const absSuccess = path.resolve("./test/reference/success.txt");
    let originalPermission: typeof process.permission;

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
