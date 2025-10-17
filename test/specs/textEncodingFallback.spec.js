describe("TextEncoder/TextDecoder fallback", function() {
  var originalTextEncoder;
  var originalTextDecoder;
  var modulePath;

  beforeAll(function() {
    originalTextEncoder = global.TextEncoder;
    originalTextDecoder = global.TextDecoder;
    modulePath = require.resolve("../../dist/jspdf.node.js");
  });

  afterAll(function() {
    if (modulePath) {
      delete require.cache[modulePath];
    }
    global.TextEncoder = originalTextEncoder;
    global.TextDecoder = originalTextDecoder;
    if (typeof loadGlobals === "function") {
      loadGlobals();
    }
  });

  it("provides polyfills when globals are missing", function() {
    delete require.cache[modulePath];

    delete global.TextEncoder;
    delete global.TextDecoder;

    var jsPDFModule = require(modulePath);

    expect(typeof global.TextEncoder).toBe("function");
    expect(typeof global.TextDecoder).toBe("function");

    var encoder = new global.TextEncoder();
    var decoder = new global.TextDecoder();
    var sample = "jsPDF";
    var encoded = encoder.encode(sample);

    expect(
      encoded instanceof Uint8Array || Buffer.isBuffer(encoded)
    ).toBeTrue();
    expect(decoder.decode(encoded)).toBe(sample);

    // ensure jsPDF module still exports expected API
    expect(typeof jsPDFModule.jsPDF).toBe("function");
  });
});
