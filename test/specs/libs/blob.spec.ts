// Blob.js is a side-effect polyfill: it has no exports and instead ensures
// that a working Blob (and File/FileReader/URL) implementation is available
// on the global object. Importing it must not break the environment, and the
// resulting global Blob must behave according to the Blob spec.
import "../../../src/libs/Blob.js";

describe("Lib: Blob", () => {
  it("provides a global Blob constructor", () => {
    expect(typeof Blob).toBe("function");
    const blob = new Blob([]);
    expect(blob.size).toBe(0);
    expect(blob.type).toBe("");
  });

  it("constructs from strings", () => {
    const blob = new Blob(["hello", " ", "world"]);
    expect(blob.size).toBe(11);
    expect(blob.type).toBe("");
  });

  it("encodes strings as UTF-8", () => {
    // "ä" is two bytes in UTF-8
    expect(new Blob(["ä"]).size).toBe(2);
    // "€" is three bytes in UTF-8
    expect(new Blob(["€"]).size).toBe(3);
  });

  it("respects the type option", () => {
    const blob = new Blob(["hello"], { type: "text/plain" });
    expect(blob.type).toBe("text/plain");
    expect(blob.size).toBe(5);
  });

  it("constructs from an ArrayBuffer", () => {
    const buffer = new Uint8Array([1, 2, 3, 4]).buffer;
    const blob = new Blob([buffer]);
    expect(blob.size).toBe(4);
  });

  it("constructs from typed arrays", () => {
    expect(new Blob([new Uint8Array([1, 2, 3])]).size).toBe(3);
    expect(new Blob([new Uint16Array([1, 2, 3])]).size).toBe(6);
  });

  it("only includes the view region of a typed array subarray", () => {
    const bytes = new Uint8Array([1, 2, 3, 4, 5, 6]);
    const view = bytes.subarray(2, 5);
    expect(new Blob([view]).size).toBe(3);
  });

  it("constructs from a mix of parts", () => {
    const blob = new Blob(
      ["ab", new Uint8Array([1, 2, 3]), new Uint8Array([4]).buffer],
      { type: "application/pdf" }
    );
    expect(blob.size).toBe(6);
    expect(blob.type).toBe("application/pdf");
  });

  it("supports slice", () => {
    const blob = new Blob(["hello world"], { type: "text/plain" });
    expect(typeof blob.slice).toBe("function");

    const slice = blob.slice(6, 11);
    expect(slice.size).toBe(5);

    const typedSlice = blob.slice(0, 5, "text/html");
    expect(typedSlice.size).toBe(5);
    expect(typedSlice.type).toBe("text/html");

    // slicing must not modify the original blob
    expect(blob.size).toBe(11);
    expect(blob.type).toBe("text/plain");
  });

  it("round-trips string content through FileReader", done => {
    const blob = new Blob(["hello world"], { type: "text/plain" });
    const reader = new FileReader();
    reader.onloadend = () => {
      expect(reader.result).toBe("hello world");
      done();
    };
    reader.readAsText(blob);
  });

  it("round-trips sliced content through FileReader", done => {
    const blob = new Blob(["hello world"]).slice(6, 11);
    const reader = new FileReader();
    reader.onloadend = () => {
      expect(reader.result).toBe("world");
      done();
    };
    reader.readAsText(blob);
  });
});
