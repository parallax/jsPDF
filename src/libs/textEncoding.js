import { globalObject as global } from "./globalObject.js";

var bufferAvailable = typeof global.Buffer !== "undefined";

if (typeof global.TextEncoder === "undefined" && bufferAvailable) {
  class JsPDFTextEncoder {
    encode(input) {
      if (input === void 0) {
        input = "";
      }
      return Buffer.from(String(input), "utf-8");
    }
  }

  global.TextEncoder = JsPDFTextEncoder;
}

if (typeof global.TextDecoder === "undefined" && bufferAvailable) {
  class JsPDFTextDecoder {
    constructor(encoding) {
      this.encoding = encoding || "utf-8";
    }

    decode(input) {
      if (input == null) {
        return "";
      }

      var buffer;

      if (Buffer.isBuffer(input)) {
        buffer = input;
      } else if (input instanceof ArrayBuffer) {
        buffer = Buffer.from(input);
      } else if (ArrayBuffer.isView(input)) {
        buffer = Buffer.from(input.buffer, input.byteOffset, input.byteLength);
      } else if (Array.isArray(input)) {
        buffer = Buffer.from(input);
      } else {
        throw new TypeError(
          "The provided value is not of type '(ArrayBuffer or ArrayBufferView)'"
        );
      }

      return buffer.toString(this.encoding);
    }
  }

  global.TextDecoder = JsPDFTextDecoder;
}
