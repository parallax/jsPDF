import {
  resolveFontFace,
  buildFontFaceMap,
  normalizeFontFace,
  parseFontFamily
} from "../../src/libs/fontFace.js";

function fontFace(opts) {
  return { family: "TestFont", src: undefined, ...opts };
}

function merge(...args) {
  return Object.assign({}, ...args);
}

const ultraCondensed = fontFace({ stretch: "ultra-condensed" });
const semiCondensed = fontFace({ stretch: "semi-condensed" });
const condensed = fontFace({ stretch: "condensed" });
const expanded = fontFace({ stretch: "ultra-expanded" });
const semiExpanded = fontFace({ stretch: "semi-expanded" });
const ultraExpanded = fontFace({ stretch: "ultra-expanded" });

const italic = fontFace({ style: "italic" });
const oblique = fontFace({ style: "oblique" });
const normal = fontFace({ style: "normal" });

const w100 = fontFace({ weight: 100 });
const w200 = fontFace({ weight: 200 });
const w300 = fontFace({ weight: 300 });
const w400 = fontFace({ weight: 400 });
const w500 = fontFace({ weight: 500 });
const w600 = fontFace({ weight: 600 });
const w700 = fontFace({ weight: 700 });
const w800 = fontFace({ weight: 800 });
const w900 = fontFace({ weight: 900 });
const wnormal = fontFace({ weight: "normal" });
const wbold = fontFace({ weight: "bold" });

describe("font-face", () => {
  describe("stretch", () => {
    describe("condensed", () => {
      it("should pick exact match", () => {
        const fontFaces = buildFontFaceMap([
          condensed,
          expanded,
          ultraCondensed
        ]);

        const result = resolveFontFace(fontFaces, [condensed]);

        expect(result).toEqual(normalizeFontFace(condensed));
      });

      it("should pick more condensed font if exact match not available", () => {
        const fontFaces = buildFontFaceMap([ultraCondensed, semiExpanded]);

        const result = resolveFontFace(fontFaces, [semiCondensed]);

        expect(result).toEqual(normalizeFontFace(ultraCondensed));
      });

      it("should pick expanded font if more condensed font does not exist", () => {
        const fontFaces = buildFontFaceMap([ultraExpanded]);

        const result = resolveFontFace(fontFaces, [semiCondensed]);

        expect(result).toEqual(normalizeFontFace(ultraExpanded));
      });
    });

    describe("expanded", () => {
      it("should pick exact match", () => {
        const fontFaces = buildFontFaceMap([
          expanded,
          ultraExpanded,
          ultraCondensed
        ]);

        const result = resolveFontFace(fontFaces, [expanded]);

        expect(result).toEqual(normalizeFontFace(expanded));
      });

      it("should pick more expanded font if exact match not available", () => {
        const fontFaces = buildFontFaceMap([ultraExpanded]);

        const result = resolveFontFace(fontFaces, [semiExpanded]);

        expect(result).toEqual(normalizeFontFace(ultraExpanded));
      });

      it("should pick condensed font if more condensed does not exist", () => {
        const fontFaces = buildFontFaceMap([ultraCondensed]);

        const result = resolveFontFace(fontFaces, [semiExpanded]);

        expect(result).toEqual(normalizeFontFace(ultraCondensed));
      });
    });

    describe("precedence", () => {
      it("should prefer matching stretch over matching style and weight", () => {
        const fontFaces = buildFontFaceMap([condensed, italic, wbold]);

        const result = resolveFontFace(fontFaces, [
          merge(condensed, italic, wbold)
        ]);

        expect(result).toEqual(normalizeFontFace(condensed));
      });
    });
  });

  describe("style", () => {
    describe("italic", () => {
      it("should pick italic when exact match is available", () => {
        const fontFaces = buildFontFaceMap([oblique, italic, normal]);

        const result = resolveFontFace(fontFaces, [italic]);

        expect(result).toEqual(normalizeFontFace(italic));
      });

      it("should prefer oblique over normal", () => {
        const fontFaces = buildFontFaceMap([oblique, normal]);

        const result = resolveFontFace(fontFaces, [italic]);

        expect(result).toEqual(normalizeFontFace(oblique));
      });

      it("should use normal when neither italic or oblique is available", () => {
        const fontFaces = buildFontFaceMap([normal]);

        const result = resolveFontFace(fontFaces, [italic]);

        expect(result).toEqual(normalizeFontFace(normal));
      });
    });

    describe("oblique", () => {
      it("should pick oblique when exact match is available", () => {
        const fontFaces = buildFontFaceMap([italic, oblique, normal]);

        const result = resolveFontFace(fontFaces, [oblique]);

        expect(result).toEqual(normalizeFontFace(oblique));
      });

      it("should prefer italic over normal", () => {
        const fontFaces = buildFontFaceMap([italic, normal]);

        const result = resolveFontFace(fontFaces, [oblique]);

        expect(result).toEqual(normalizeFontFace(italic));
      });

      it("should use normal when neither italic or oblique is available", () => {
        const fontFaces = buildFontFaceMap([normal]);

        const result = resolveFontFace(fontFaces, [oblique]);

        expect(result).toEqual(normalizeFontFace(normal));
      });
    });

    describe("normal", () => {
      it("should pick normal when exact match is available", () => {
        const fontFaces = buildFontFaceMap([italic, oblique, normal]);

        const result = resolveFontFace(fontFaces, [normal]);

        expect(result).toEqual(normalizeFontFace(normal));
      });

      it("should prefer oblique over italic", () => {
        const fontFaces = buildFontFaceMap([italic, oblique]);

        const result = resolveFontFace(fontFaces, [normal]);

        expect(result).toEqual(normalizeFontFace(oblique));
      });

      it("should use italic when neither normal or oblique is available", () => {
        const fontFaces = buildFontFaceMap([italic]);

        const result = resolveFontFace(fontFaces, [normal]);

        expect(result).toEqual(normalizeFontFace(italic));
      });
    });
  });

  describe("font weight", () => {
    describe("400 and 500", () => {
      it("should match exact weight when 400", () => {
        const fontFaces = buildFontFaceMap([w300, w400, w500]);

        const result = resolveFontFace(fontFaces, [w400]);

        expect(result).toEqual(normalizeFontFace(w400));
      });

      it("should match exact weight when 500", () => {
        const fontFaces = buildFontFaceMap([w300, w400, w500]);

        const result = resolveFontFace(fontFaces, [w500]);

        expect(result).toEqual(normalizeFontFace(w500));
      });

      it("should try font-weight 500 first when desired weight 400 is not available", () => {
        const fontFaces = buildFontFaceMap([w300, w500]);

        const result = resolveFontFace(fontFaces, [w400]);

        expect(result).toEqual(normalizeFontFace(w500));
      });

      it("should pick smaller font-weight when desired weight is 400 and 500 is not available", () => {
        const fontFaces = buildFontFaceMap([w100]);

        const result = resolveFontFace(fontFaces, [w400]);

        expect(result).toEqual(normalizeFontFace(w100));
      });

      it("should pick larger font-weight when no smaller is available", () => {
        const fontFaces = buildFontFaceMap([w900]);

        const result = resolveFontFace(fontFaces, [w400]);

        expect(result).toEqual(normalizeFontFace(w900));
      });

      it("should try font-weight 400 first when desired weight 500 is not available", () => {
        const fontFaces = buildFontFaceMap([w600, w400]);

        const result = resolveFontFace(fontFaces, [w500]);

        expect(result).toEqual(normalizeFontFace(w400));
      });

      it("should pick larger font-weight when desired weight is 500 and 400 is not available", () => {
        const fontFaces = buildFontFaceMap([w900]);

        const result = resolveFontFace(fontFaces, [w500]);

        expect(result).toEqual(normalizeFontFace(w900));
      });

      it("should pick smaller font-weight when no larger is available", () => {
        const fontFaces = buildFontFaceMap([w100]);

        const result = resolveFontFace(fontFaces, [w500]);

        expect(result).toEqual(normalizeFontFace(w100));
      });
    });

    describe("bold and normal", () => {
      it("should resolve normal to font-weight 400", () => {
        const fontFaces = buildFontFaceMap([w300, w400, w700]);

        const result = resolveFontFace(fontFaces, [wnormal]);

        expect(result).toEqual(normalizeFontFace(w400));
      });

      it("should resolve bold to font-weight 700", () => {
        const fontFaces = buildFontFaceMap([w300, w400, w700]);

        const result = resolveFontFace(fontFaces, [wbold]);

        expect(result).toEqual(normalizeFontFace(w700));
      });
    });

    describe("weights below 400", () => {
      it("should resolve to exact font weight", () => {
        const fontFaces = buildFontFaceMap([w100, w300]);

        const result = resolveFontFace(fontFaces, [w300]);

        expect(result).toEqual(normalizeFontFace(w300));
      });

      it("should pick a smaller font-weight when exact match is not available", () => {
        const fontFaces = buildFontFaceMap([w700, w200]);

        const result = resolveFontFace(fontFaces, [w300]);

        expect(result).toEqual(normalizeFontFace(w200));
      });

      it("should pick a larger font-weight when no smaller value is available", () => {
        const fontFaces = buildFontFaceMap([w400]);

        const result = resolveFontFace(fontFaces, [w300]);

        expect(result).toEqual(normalizeFontFace(w400));
      });
    });

    describe("weights above 400", () => {
      it("should resolve to exact font weight", () => {
        const fontFaces = buildFontFaceMap([w600, w800]);

        const result = resolveFontFace(fontFaces, [w600]);

        expect(result).toEqual(normalizeFontFace(w600));
      });

      it("should pick a larger font-weight when exact match is not available", () => {
        const fontFaces = buildFontFaceMap([w700, w200]);

        const result = resolveFontFace(fontFaces, [w600]);

        expect(result).toEqual(normalizeFontFace(w700));
      });

      it("should pick a smaller font-weight when no larger value is available", () => {
        const fontFaces = buildFontFaceMap([w500]);

        const result = resolveFontFace(fontFaces, [w600]);

        expect(result).toEqual(normalizeFontFace(w500));
      });
    });
  });

  describe("generic font-faces", () => {
    it("should use a default font when there is no match", () => {
      const fontFaces = buildFontFaceMap([
        fontFace({ family: "first" }),
        fontFace({ family: "second" }),
        fontFace({ family: "third" }),
        fontFace({ family: "times" })
      ]);

      const result = resolveFontFace(
        fontFaces,
        [fontFace({ family: "nope" })],
        { defaultFontFamily: "third" }
      );

      expect(result).toEqual(normalizeFontFace(fontFace({ family: "third" })));
    });

    const genericFontFamilies = {
      "sans-serif": "actual-sans-serif",
      fixed: "actual-fixed",
      monospace: "actual-monospace",
      terminal: "actual-terminal",
      cursive: "actual-cursive",
      fantasy: "actual-fantasy",
      serif: "actual-serif"
    };

    Object.keys(genericFontFamilies).forEach(family => {
      it("should match generic '" + family + "' font family", () => {
        const fontFaces = buildFontFaceMap([
          fontFace({ family: "decoy" }),
          fontFace({ family: "actual-" + family })
        ]);

        const result = resolveFontFace(fontFaces, [fontFace({ family })], {
          genericFontFamilies
        });

        expect(result).toEqual(
          normalizeFontFace(fontFace({ family: "actual-" + family }))
        );
      });
    });
  });

  describe("font family parser", () => {
    const defaultFont = ["times"];

    it("should return default font family on empty input", () => {
      const result = parseFontFamily("    ");

      expect(result).toEqual(defaultFont);
    });

    it("should return default font family on non-sensical input", () => {
      const result = parseFontFamily("@£$∞$§∞|$§∞©£@•$");

      expect(result).toEqual(defaultFont);
    });

    it("should return default font family when font family contains illegal characters", () => {
      const invalidStrs = [
        "--no-double-hyphen",
        "-3no-digit-after-hypen",
        "0digits",
        "#£no-illegal-characters"
      ];

      const result = invalidStrs.map(parseFontFamily);

      expect(result).toEqual(invalidStrs.map(() => defaultFont));
    });

    // If the user has specified a system font, then it's up to the user-agent to pick one.
    it("should return default font if it is a system font", () => {
      const systemFonts = [
        "caption",
        "icon",
        "menu",
        "message-box",
        "small-caption",
        "status-bar"
      ];

      const result = systemFonts.map(parseFontFamily);

      expect(result).toEqual(systemFonts.map(() => defaultFont));
    });

    it("should return all font families", () => {
      var result = parseFontFamily(
        " 'roboto sans' , \"SourceCode Pro\", Co-mP_l3x   , arial, sans-serif   "
      );

      expect(result).toEqual([
        "roboto sans",
        "SourceCode Pro",
        "Co-mP_l3x",
        "arial",
        "sans-serif"
      ]);
    });

    it("should allow commas in font name", () => {
      var result = parseFontFamily("before, 'name,with,commas', after");

      expect(result).toEqual(["before", "name,with,commas", "after"]);
    });

    it("should return default on mismatching quotes", () => {
      var result = [
        parseFontFamily("'I am not closed"),
        parseFontFamily('"I am not closed either')
      ];

      expect(result).toEqual([defaultFont, defaultFont]);
    });
  });
});
