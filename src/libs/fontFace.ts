function toLookup(arr) {
  return arr.reduce(function(lookup, name, index) {
    lookup[name] = index;

    return lookup;
  }, {});
}

let fontStyleOrder = {
  italic: ["italic", "oblique", "normal"],
  oblique: ["oblique", "italic", "normal"],
  normal: ["normal", "oblique", "italic"]
};

let fontStretchOrder = [
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
let fontStretchLookup = toLookup(fontStretchOrder);

let fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
let fontWeightsLookup = toLookup(fontWeights);

function normalizeFontStretch(stretch) {
  stretch = stretch || "normal";

  return typeof fontStretchLookup[stretch] === "number" ? stretch : "normal";
}

function normalizeFontStyle(style) {
  style = style || "normal";

  return fontStyleOrder[style] ? style : "normal";
}

function normalizeFontWeight(weight) {
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

export function normalizeFontFace(fontFace) {
  let family = fontFace.family.replace(/"|'/g, "").toLowerCase();

  let style = normalizeFontStyle(fontFace.style);
  let weight = normalizeFontWeight(fontFace.weight);
  let stretch = normalizeFontStretch(fontFace.stretch);

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
export function buildFontFaceMap(fontFaces) {
  let map = {};

  for (let i = 0; i < fontFaces.length; ++i) {
    let normalized = normalizeFontFace(fontFaces[i]);

    let name = normalized.family;
    let stretch = normalized.stretch;
    let style = normalized.style;
    let weight = normalized.weight;

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

function searchFromPivot(matchingSet, order, pivot, dir) {
  let i;

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

function resolveFontStretch(stretch, matchingSet) {
  if (matchingSet[stretch]) {
    return matchingSet[stretch];
  }

  let pivot = fontStretchLookup[stretch];

  // If the font-stretch value is normal or more condensed, we want to
  // start with a descending search, otherwise we should do ascending.
  let dir = pivot <= fontStretchLookup["normal"] ? -1 : 1;
  let match = searchFromPivot(matchingSet, fontStretchOrder, pivot, dir);

  if (!match) {
    // Since a font-family cannot exist without having at least one stretch value
    // we should never reach this point.
    throw new Error(
      "Could not find a matching font-stretch value for " + stretch
    );
  }

  return match;
}

function resolveFontStyle(fontStyle, matchingSet) {
  if (matchingSet[fontStyle]) {
    return matchingSet[fontStyle];
  }

  let ordering = fontStyleOrder[fontStyle];

  for (let i = 0; i < ordering.length; ++i) {
    if (matchingSet[ordering[i]]) {
      return matchingSet[ordering[i]];
    }
  }

  // Since a font-family cannot exist without having at least one style value
  // we should never reach this point.
  throw new Error("Could not find a matching font-style for " + fontStyle);
}

function resolveFontWeight(weight, matchingSet) {
  if (matchingSet[weight]) {
    return matchingSet[weight];
  }

  if (weight === 400 && matchingSet[500]) {
    return matchingSet[500];
  }

  if (weight === 500 && matchingSet[400]) {
    return matchingSet[400];
  }

  let pivot = fontWeightsLookup[weight];

  // If the font-stretch value is normal or more condensed, we want to
  // start with a descending search, otherwise we should do ascending.
  let dir = weight < 400 ? -1 : 1;
  let match = searchFromPivot(matchingSet, fontWeights, pivot, dir);

  if (!match) {
    // Since a font-family cannot exist without having at least one stretch value
    // we should never reach this point.
    throw new Error(
      "Could not find a matching font-weight for value " + weight
    );
  }

  return match;
}

let defaultGenericFontFamilies = {
  "sans-serif": "helvetica",
  fixed: "courier",
  monospace: "courier",
  terminal: "courier",
  cursive: "times",
  fantasy: "times",
  serif: "times"
};

let systemFonts = {
  caption: "times",
  icon: "times",
  menu: "times",
  "message-box": "times",
  "small-caption": "times",
  "status-bar": "times"
};

function ruleToString(rule) {
  return [rule.stretch, rule.style, rule.weight, rule.family].join(" ");
}

export function resolveFontFace(fontFaceMap, rules, opts) {
  opts = opts || {};

  let defaultFontFamily = opts.defaultFontFamily || "times";
  let genericFontFamilies = Object.assign(
    {},
    defaultGenericFontFamilies,
    opts.genericFontFamilies || {}
  );

  let rule = null;
  let matches = null;

  for (let i = 0; i < rules.length; ++i) {
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

  matches = resolveFontStretch(rule.stretch, matches);
  matches = resolveFontStyle(rule.style, matches);
  matches = resolveFontWeight(rule.weight, matches);

  if (!matches) {
    // We should've fount
    throw new Error(
      "Failed to resolve a font for the rule '" + ruleToString(rule) + "'."
    );
  }

  return matches;
}

/**
 * Builds a style id for use with the addFont() method.
 * @param {FontFace} font
 * @private
 */
export function toStyleName(font) {
  return [font.weight, font.style, font.stretch].join(" ");
}

function eatWhiteSpace(input) {
  return input.trimLeft();
}

function parseQuotedFontFamily(input, quote) {
  let index = 0;

  while (index < input.length) {
    let current = input.charAt(index);

    if (current === quote) {
      return [input.substring(0, index), input.substring(index + 1)];
    }

    index += 1;
  }

  // Unexpected end of input
  return null;
}

function parseNonQuotedFontFamily(input) {
  // It implements part of the identifier parser here: https://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
  //
  // NOTE: This parser pretty much ignores escaped identifiers and that there is a thing called unicode.
  //
  // Breakdown of regexp:
  // -[a-z_]     - when identifier starts with a hyphen, you're not allowed to have another hyphen or a digit
  // [a-z_]      - allow a-z and underscore at beginning of input
  // [a-z0-9_-]* - after that, anything goes
  let match = input.match(/^(-[a-z_]|[a-z_])[a-z0-9_-]*/i);

  // non quoted value contains illegal characters
  if (match === null) {
    return null;
  }

  return [match[0], input.substring(match[0].length)];
}

let defaultFont = ["times"];

export function parseFontFamily(input) {
  let result = [];
  let ch, parsed;
  let remaining = input.trim();

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
