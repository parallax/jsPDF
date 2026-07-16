import { RGBColor } from "../../../src/libs/rgbcolor.js";

describe("Lib: rgbcolor", () => {
  describe("named colors", () => {
    it("parses simple named colors", () => {
      var color = new RGBColor("red");
      expect(color.ok).toBe(true);
      expect(color.r).toBe(255);
      expect(color.g).toBe(0);
      expect(color.b).toBe(0);
    });

    it("is case-insensitive", () => {
      var color = new RGBColor("RED");
      expect(color.ok).toBe(true);
      expect(color.toHex()).toBe("#ff0000");
    });

    it("strips spaces from named colors", () => {
      var color = new RGBColor(" Light Blue ");
      expect(color.ok).toBe(true);
      expect(color.toHex()).toBe("#add8e6");
    });

    it("parses a selection of named colors to their hex values", () => {
      expect(new RGBColor("black").toHex()).toBe("#000000");
      expect(new RGBColor("white").toHex()).toBe("#ffffff");
      expect(new RGBColor("rebeccapurple").ok).toBe(false);
      expect(new RGBColor("seashell").toHex()).toBe("#fff5ee");
      expect(new RGBColor("yellowgreen").toHex()).toBe("#9acd32");
    });
  });

  describe("hex colors", () => {
    it("parses 6-digit hex with leading #", () => {
      var color = new RGBColor("#00ff00");
      expect(color.ok).toBe(true);
      expect(color.r).toBe(0);
      expect(color.g).toBe(255);
      expect(color.b).toBe(0);
    });

    it("parses 6-digit hex without leading #", () => {
      var color = new RGBColor("336699");
      expect(color.ok).toBe(true);
      expect(color.r).toBe(51);
      expect(color.g).toBe(102);
      expect(color.b).toBe(153);
    });

    it("parses 3-digit hex with leading #", () => {
      var color = new RGBColor("#0f0");
      expect(color.ok).toBe(true);
      expect(color.r).toBe(0);
      expect(color.g).toBe(255);
      expect(color.b).toBe(0);
    });

    it("parses 3-digit hex without leading #", () => {
      var color = new RGBColor("fb0");
      expect(color.ok).toBe(true);
      expect(color.r).toBe(255);
      expect(color.g).toBe(187);
      expect(color.b).toBe(0);
    });

    it("is case-insensitive for hex digits", () => {
      var color = new RGBColor("#00FF00");
      expect(color.ok).toBe(true);
      expect(color.toHex()).toBe("#00ff00");
    });

    it("only considers the first 6 characters after a leading #", () => {
      // 8-digit hex (with alpha) is truncated to the first 6 digits
      var color = new RGBColor("#ff0000cc");
      expect(color.ok).toBe(true);
      expect(color.toHex()).toBe("#ff0000");
    });

    it("accepts non-hex word characters and treats them as 0", () => {
      // The hex regex matches \w, so "zzzzzz" parses "ok" but yields black
      var color = new RGBColor("zzzzzz");
      expect(color.ok).toBe(true);
      expect(color.toHex()).toBe("#000000");
    });
  });

  describe("rgb() colors", () => {
    it("parses rgb() with spaces", () => {
      var color = new RGBColor("rgb(1, 2, 3)");
      expect(color.ok).toBe(true);
      expect(color.r).toBe(1);
      expect(color.g).toBe(2);
      expect(color.b).toBe(3);
    });

    it("parses rgb() without spaces", () => {
      var color = new RGBColor("rgb(255,234,245)");
      expect(color.ok).toBe(true);
      expect(color.r).toBe(255);
      expect(color.g).toBe(234);
      expect(color.b).toBe(245);
    });

    it("clamps channel values greater than 255", () => {
      var color = new RGBColor("rgb(300, 300, 300)");
      expect(color.ok).toBe(true);
      expect(color.r).toBe(255);
      expect(color.g).toBe(255);
      expect(color.b).toBe(255);
    });

    it("does not parse negative channel values", () => {
      var color = new RGBColor("rgb(-1,0,0)");
      expect(color.ok).toBe(false);
    });

    it("does not parse rgba()", () => {
      var color = new RGBColor("rgba(1,2,3,1)");
      expect(color.ok).toBe(false);
    });
  });

  describe("invalid input", () => {
    it("sets ok to false and defaults channels to 0", () => {
      var color = new RGBColor("not a color");
      expect(color.ok).toBe(false);
      expect(color.r).toBe(0);
      expect(color.g).toBe(0);
      expect(color.b).toBe(0);
    });

    it("handles an empty string", () => {
      var color = new RGBColor("");
      expect(color.ok).toBe(false);
      expect(color.toHex()).toBe("#000000");
      expect(color.toRGB()).toBe("rgb(0, 0, 0)");
    });

    it("handles undefined input", () => {
      var color = new RGBColor(undefined);
      expect(color.ok).toBe(false);
      expect(color.toHex()).toBe("#000000");
    });
  });

  describe("getters", () => {
    it("toRGB formats the parsed color", () => {
      expect(new RGBColor("#010203").toRGB()).toBe("rgb(1, 2, 3)");
      expect(new RGBColor("red").toRGB()).toBe("rgb(255, 0, 0)");
    });

    it("toHex zero-pads single-digit channels", () => {
      expect(new RGBColor("rgb(1, 2, 3)").toHex()).toBe("#010203");
      expect(new RGBColor("rgb(15, 16, 255)").toHex()).toBe("#0f10ff");
    });
  });
});
