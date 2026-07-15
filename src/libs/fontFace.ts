export interface FontFaceSource {
  url: string;
  format?: string;
}

export interface FontFaceRef {
  name: string;
  style: string;
}

export interface FontFaceInput {
  family: string;
  style?: string;
  weight?: string | number;
  stretch?: string;
  src?: FontFaceSource[];
  ref?: FontFaceRef;
}

type FontStyle = "italic" | "oblique" | "normal";

export interface NormalizedFontFace {
  family: string;
  style: FontStyle;
  weight: number;
  stretch: string;
  src: FontFaceSource[];
  ref: FontFaceRef;
}

type WeightSet = { [weight: string]: NormalizedFontFace };
type StyleSet = { [style: string]: WeightSet };
type StretchSet = { [stretch: string]: StyleSet };
export type FontFaceMap = { [family: string]: StretchSet };

function toLookup(arr: Array<string | number>): { [key: string]: number } {
  return arr.reduce(function (
    lookup: { [key: string]: number },
    name: string | number,
    index: number
  ) {
    lookup[name] = index;

    return lookup;
  }, {});
}

var fontStyleOrder: { [style: string]: FontStyle[] } = {
  italic: ["italic", "oblique", "normal"],
  oblique: ["oblique", "italic", "normal"],
  normal: ["normal", "oblique", "italic"]
};

var fontStretchOrder = [
  "ultra-condensed",
  "extra-condensed",
  "condensed",
  "semi-condensed",
  "normal",
  "semi-expanded",
  "expanded",
  "extra-expanded",
  "ultra-expanded"
];

// For a given font-stretch value, we need to know where to start our search
// from in the fontStretchOrder list.
var fontStretchLookup = toLookup(fontStretchOrder);

var fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
var fontWeightsLookup = toLookup(fontWeights);

function normalizeFontStretch(stretch?: string): string {
  stretch = stretch || "normal";

  return typeof fontStretchLookup[stretch] === "number" ? stretch : "normal";
}

function normalizeFontStyle(style?: string): FontStyle {
  style = style || "normal";

  // If the lookup succeeds, `style` is one of the keys of fontStyleOrder,
  // i.e. a FontStyle.
  return fontStyleOrder[style] ? (style as FontStyle) : "normal";
}

function normalizeFontWeight(weight?: string | number): number {
  if (!weight) {
    return 400;
  }

  if (typeof weight === "number") {
    // Ignore values which aren't valid font-weights.
    return weight >= 100 && weight <= 900 && weight % 100 === 0 ? weight : 400;
  }

  if (/^\d00$/.test(weight)) {
    return parseInt(weight);
  }

  switch (weight) {
    case "bold":
      return 700;

    case "normal":
    default:
      return 400;
  }
}

export function normalizeFontFace(fontFace: FontFaceInput): NormalizedFontFace {
  var family = fontFace.family.replace(/"|'/g, "").toLowerCase();

  var style = normalizeFontStyle(fontFace.style);
  var weight = normalizeFontWeight(fontFace.weight);
  var stretch = normalizeFontStretch(fontFace.stretch);

  return {
    family: family,
    style: style,
    weight: weight,
    stretch: stretch,
    src: fontFace.src || [],

    // The ref property maps this font-face to the font
    // added by the .addFont() method.
    ref: fontFace.ref || {
      name: family,
      style: [stretch, style, weight].join(" ")
    }
  };
}

/**
 * Turns a list of font-faces into a map, for easier lookup when resolving
 * fonts.
 * @private
 */
export function buildFontFaceMap(fontFaces: FontFaceInput[]): FontFaceMap {
  var map: FontFaceMap = {};

  for (var i = 0; i < fontFaces.length; ++i) {
    var normalized = normalizeFontFace(fontFaces[i]);

    var name = normalized.family;
    var stretch = normalized.stretch;
    var style = normalized.style;
    var weight = normalized.weight;

    map[name] = map[name] || {};

    map[name][stretch] = map[name][stretch] || {};
    map[name][stretch][style] = map[name][stretch][style] || {};
    map[name][stretch][style][weight] = normalized;
  }

  return map;
}

/**
 * Searches a map of stretches, weights, etc. in the given direction and
 * then, if no match has been found, in the opposite directions.
 *
 * @param {Object.<string, any>} matchingSet A map of the various font variations.
 * @param {any[]} order The order of the different variations
 * @param {number} pivot The starting point of the search in the order list.
 * @param {number} dir The initial direction of the search (desc = -1, asc = 1)
 * @private
 */

function searchFromPivot<T>(
  matchingSet: { [key: string]: T },
  order: ReadonlyArray<string | number>,
  pivot: number,
  dir: number
): T | undefined {
  var i;

  for (i = pivot; i >= 0 && i < order.length; i += dir) {
    if (matchingSet[order[i]]) {
      return matchingSet[order[i]];
    }
  }

  for (i = pivot; i >= 0 && i < order.length; i -= dir) {
    if (matchingSet[order[i]]) {
      return matchingSet[order[i]];
    }
  }
}

function resolveFontStretch(
  stretch: string,
  matchingSet: StretchSet
): StyleSet {
  if (matchingSet[stretch]) {
    return matchingSet[stretch];
  }

  var pivot = fontStretchLookup[stretch];

  // If the font-stretch value is normal or more condensed, we want to
  // start with a descending search, otherwise we should do ascending.
  var dir = pivot <= fontStretchLookup["normal"] ? -1 : 1;
  var match = searchFromPivot(matchingSet, fontStretchOrder, pivot, dir);

  if (!match) {
    // Since a font-family cannot exist without having at least one stretch value
    // we should never reach this point.
    throw new Error(
      "Could not find a matching font-stretch value for " + stretch
    );
  }

  return match;
}

function resolveFontStyle(
  fontStyle: FontStyle,
  matchingSet: StyleSet
): WeightSet {
  if (matchingSet[fontStyle]) {
    return matchingSet[fontStyle];
  }

  var ordering = fontStyleOrder[fontStyle];

  for (var i = 0; i < ordering.length; ++i) {
    if (matchingSet[ordering[i]]) {
      return matchingSet[ordering[i]];
    }
  }

  // Since a font-family cannot exist without having at least one style value
  // we should never reach this point.
  throw new Error("Could not find a matching font-style for " + fontStyle);
}

function resolveFontWeight(
  weight: number,
  matchingSet: WeightSet
): NormalizedFontFace {
  if (matchingSet[weight]) {
    return matchingSet[weight];
  }

  if (weight === 400 && matchingSet[500]) {
    return matchingSet[500];
  }

  if (weight === 500 && matchingSet[400]) {
    return matchingSet[400];
  }

  var pivot = fontWeightsLookup[weight];

  // If the font-stretch value is normal or more condensed, we want to
  // start with a descending search, otherwise we should do ascending.
  var dir = weight < 400 ? -1 : 1;
  var match = searchFromPivot(matchingSet, fontWeights, pivot, dir);

  if (!match) {
    // Since a font-family cannot exist without having at least one stretch value
    // we should never reach this point.
    throw new Error(
      "Could not find a matching font-weight for value " + weight
    );
  }

  return match;
}

var defaultGenericFontFamilies: { [family: string]: string } = {
  "sans-serif": "helvetica",
  fixed: "courier",
  monospace: "courier",
  terminal: "courier",
  cursive: "times",
  fantasy: "times",
  serif: "times"
};

var systemFonts: { [font: string]: string } = {
  caption: "times",
  icon: "times",
  menu: "times",
  "message-box": "times",
  "small-caption": "times",
  "status-bar": "times"
};

function ruleToString(rule: NormalizedFontFace): string {
  return [rule.stretch, rule.style, rule.weight, rule.family].join(" ");
}

export interface ResolveFontFaceOptions {
  defaultFontFamily?: string;
  genericFontFamilies?: { [family: string]: string };
}

export function resolveFontFace(
  fontFaceMap: FontFaceMap,
  rules: FontFaceInput[],
  opts?: ResolveFontFaceOptions
): NormalizedFontFace {
  opts = opts || {};

  var defaultFontFamily = opts.defaultFontFamily || "times";
  var genericFontFamilies: { [family: string]: string } = Object.assign(
    {},
    defaultGenericFontFamilies,
    opts.genericFontFamilies || {}
  );

  var rule: NormalizedFontFace = null;
  var matches: StretchSet = null;

  for (var i = 0; i < rules.length; ++i) {
    rule = normalizeFontFace(rules[i]);

    if (genericFontFamilies[rule.family]) {
      rule.family = genericFontFamilies[rule.family];
    }

    if (fontFaceMap.hasOwnProperty(rule.family)) {
      matches = fontFaceMap[rule.family];

      break;
    }
  }

  // Always fallback to a known font family.
  matches = matches || fontFaceMap[defaultFontFamily];

  if (!matches) {
    // At this point we should definitiely have a font family, but if we
    // don't there is something wrong with our configuration
    throw new Error(
      "Could not find a font-family for the rule '" +
        ruleToString(rule) +
        "' and default family '" +
        defaultFontFamily +
        "'."
    );
  }

  var styleSet = resolveFontStretch(rule.stretch, matches);
  var weightSet = resolveFontStyle(rule.style, styleSet);
  var font = resolveFontWeight(rule.weight, weightSet);

  if (!font) {
    // We should've fount
    throw new Error(
      "Failed to resolve a font for the rule '" + ruleToString(rule) + "'."
    );
  }

  return font;
}

/**
 * Builds a style id for use with the addFont() method.
 * @param {FontFace} font
 * @private
 */
export function toStyleName(font: {
  weight: string | number;
  style: string;
  stretch: string;
}): string {
  return [font.weight, font.style, font.stretch].join(" ");
}

function eatWhiteSpace(input: string): string {
  return input.trimLeft();
}

function parseQuotedFontFamily(input: string, quote: string): string[] | null {
  var index = 0;

  while (index < input.length) {
    var current = input.charAt(index);

    if (current === quote) {
      return [input.substring(0, index), input.substring(index + 1)];
    }

    index += 1;
  }

  // Unexpected end of input
  return null;
}

function parseNonQuotedFontFamily(input: string): string[] | null {
  // It implements part of the identifier parser here: https://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
  //
  // NOTE: This parser pretty much ignores escaped identifiers and that there is a thing called unicode.
  //
  // Breakdown of regexp:
  // -[a-z_]     - when identifier starts with a hyphen, you're not allowed to have another hyphen or a digit
  // [a-z_]      - allow a-z and underscore at beginning of input
  // [a-z0-9_-]* - after that, anything goes
  var match = input.match(/^(-[a-z_]|[a-z_])[a-z0-9_-]*/i);

  // non quoted value contains illegal characters
  if (match === null) {
    return null;
  }

  return [match[0], input.substring(match[0].length)];
}

var defaultFont = ["times"];

export function parseFontFamily(input: string): string[] {
  var result: string[] = [];
  var ch: string, parsed: string[] | null;
  var remaining = input.trim();

  if (remaining === "") {
    return defaultFont;
  }

  if (remaining in systemFonts) {
    return [systemFonts[remaining]];
  }

  while (remaining !== "") {
    parsed = null;
    remaining = eatWhiteSpace(remaining);
    ch = remaining.charAt(0);

    switch (ch) {
      case '"':
      case "'":
        parsed = parseQuotedFontFamily(remaining.substring(1), ch);
        break;

      default:
        parsed = parseNonQuotedFontFamily(remaining);
        break;
    }

    if (parsed === null) {
      return defaultFont;
    }

    result.push(parsed[0]);

    remaining = eatWhiteSpace(parsed[1]);

    // We expect end of input or a comma separator here
    if (remaining !== "" && remaining.charAt(0) !== ",") {
      return defaultFont;
    }

    remaining = remaining.replace(/^,/, "");
  }

  return result;
}
