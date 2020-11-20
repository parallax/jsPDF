function toLookup(arr) {
  return arr.reduce((lookup, name, index) => {
    lookup[name] = index;

    return lookup;
  }, {});
}

var fontStyleOrder = {
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
 * */
export function buildFontFaceMap(fontFaces) {
  var map = {};

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
 * @param {-1 | 1} dir The initial direction of the search (desc = -1, asc = 1)
 */

function searchFromPivot(matchingSet, order, pivot, dir) {
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

function resolveFontStretch(stretch, matchingSet) {
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

function resolveFontStyle(fontStyle, matchingSet) {
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

var defaultGenericFontFamilies = {
  "sans-serif": "helvetica",
  fixed: "courier",
  monospace: "courier",
  terminal: "courier",
  cursive: "times",
  fantasy: "times",
  serif: "times"
};

function ruleToString(rule) {
  return [rule.stretch, rule.style, rule.weight, rule.family].join(" ");
}

export function resolveFontFace(fontFaceMap, rules, opts) {
  opts = opts || {};

  var defaultFontFamily = opts.defaultFontFamily || "times";
  var genericFontFamilies = Object.assign(
    {},
    defaultGenericFontFamilies,
    opts.genericFontFamilies || {}
  );

  var rule = null;
  var matches = null;

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
 */
export function toStyleName(font) {
  return [font.weight, font.style, font.stretch].join(" ");
}
