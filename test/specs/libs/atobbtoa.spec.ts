import { atob, btoa } from "../../../src/libs/AtobBtoa.js";

describe("Lib: AtobBtoa", () => {
  it("exports functions", () => {
    expect(typeof atob).toBe("function");
    expect(typeof btoa).toBe("function");
  });

  describe("btoa", () => {
    it("encodes simple ASCII strings", () => {
      expect(btoa("Hello")).toBe("SGVsbG8=");
      expect(btoa("Hello, World!")).toBe("SGVsbG8sIFdvcmxkIQ==");
    });

    it("encodes an empty string", () => {
      expect(btoa("")).toBe("");
    });

    it("pads output correctly for different input lengths", () => {
      expect(btoa("a")).toBe("YQ==");
      expect(btoa("ab")).toBe("YWI=");
      expect(btoa("abc")).toBe("YWJj");
    });

    it("encodes binary strings with all byte values", () => {
      expect(btoa("\x00\x01\x02")).toBe("AAEC");
      expect(btoa("\xff\xfe\xfd")).toBe("//79");
      expect(btoa("\x00\xff")).toBe("AP8=");
    });

    it("throws for characters outside the latin1 range", () => {
      expect(function() {
        btoa("€");
      }).toThrow();
      expect(function() {
        btoa("ሴ");
      }).toThrow();
    });
  });

  describe("atob", () => {
    it("decodes simple base64 strings", () => {
      expect(atob("SGVsbG8=")).toBe("Hello");
      expect(atob("SGVsbG8sIFdvcmxkIQ==")).toBe("Hello, World!");
    });

    it("decodes an empty string", () => {
      expect(atob("")).toBe("");
    });

    it("decodes strings with missing padding", () => {
      expect(atob("SGVsbG8")).toBe("Hello");
      expect(atob("YQ")).toBe("a");
    });

    it("decodes binary data to a binary string", () => {
      var result = atob("AP8=");
      expect(result.length).toBe(2);
      expect(result.charCodeAt(0)).toBe(0);
      expect(result.charCodeAt(1)).toBe(255);
    });

    it("throws for invalid base64 input", () => {
      expect(function() {
        atob("$$$$");
      }).toThrow();
      expect(function() {
        atob("a");
      }).toThrow();
    });
  });

  describe("round-trips", () => {
    it("round-trips ASCII text", () => {
      var input = "The quick brown fox jumps over the lazy dog";
      expect(atob(btoa(input))).toBe(input);
    });

    it("round-trips every latin1 byte value", () => {
      var input = "";
      for (var i = 0; i < 256; i++) {
        input += String.fromCharCode(i);
      }
      expect(atob(btoa(input))).toBe(input);
    });
  });
});
