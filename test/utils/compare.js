/* eslint-disable no-console */
/* global XMLHttpRequest, expect, fail */
var globalVar =
  (typeof self !== "undefined" && self) ||
  (typeof global !== "undefined" && global) ||
  (typeof window !== "undefined" && window) ||
  Function("return this")();

globalVar.savePdf = function() {};
globalVar.loadBinaryResource = function() {};

var prefix = globalVar.isNode ? "/../" : "/base/test/";

if (globalVar.isNode === true) {
  var fs = require("fs");
  var path = require("path");
  globalVar.loadBinaryResource = function(url) {
    var result = "";
    try {
      result = fs.readFileSync(path.resolve(__dirname + prefix + url), {
        encoding: "latin1"
      });
    } catch (e) {
      console.log(e);
    }
    return result;
  };
} else {
  globalVar.savePdf = function(filename, data) {
    const req = new XMLHttpRequest();
    req.open("POST", `http://localhost:9090${filename}`, true);
    req.setRequestHeader("Content-Type", "text/plain; charset=x-user-defined");
    req.onload = e => {
      //console.log(e)
    };

    const uint8Array = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      uint8Array[i] = data.charCodeAt(i);
    }
    const blob = new Blob([uint8Array], {
      type: "text/plain; charset=x-user-defined"
    });

    req.send(blob);
  };

  globalVar.loadBinaryResource = function(url, unicodeCleanUp) {
    const req = new XMLHttpRequest();
    req.open("GET", prefix + url, false);
    // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
    req.overrideMimeType("text/plain; charset=x-user-defined");
    req.send(null);
    if (req.status !== 200) {
      throw new Error("Unable to load file");
    }

    const responseText = req.responseText;
    if (unicodeCleanUp) {
      const StringFromCharCode = String.fromCharCode;
      const byteArray = new Array(req.responseText.length);

      for (let i = 0; i < responseText.length; i += 1) {
        byteArray[i] = StringFromCharCode(responseText.charCodeAt(i) & 0xff);
      }
      return byteArray.join("");
    }

    return req.responseText;
  };
}

function resetFile(pdfFile) {
  pdfFile = pdfFile.replace(
    /\/CreationDate \([^)]+\)/,
    "/CreationDate (D:19871210000000+00'00')"
  );
  pdfFile = pdfFile.replace(
    /(\/ID \[ (<[0-9a-fA-F]+> ){2}\])/,
    "/ID [ <00000000000000000000000000000000> <00000000000000000000000000000000> ]"
  );
  pdfFile = pdfFile.replace(/\/Producer \([^)]+\)/, "/Producer (jsPDF 0.0.0)");
  return pdfFile;
}

function findRepeatedPattern(differences) {
  if (differences.length < 2) return null;
  
  // Group differences by type
  const groups = differences.reduce((acc, diff) => {
    const type = getPdfLineType(diff.expected || diff.actual);
    if (!acc[type]) acc[type] = [];
    acc[type].push(diff);
    return acc;
  }, {});
  
  // Find patterns within each group
  const patterns = [];
  for (const [type, diffs] of Object.entries(groups)) {
    if (diffs.length > 3) {
      // Check if all differences in this group follow a similar pattern
      const firstDiff = diffs[0];
      const isConsistent = diffs.every(diff => 
        (diff.actual === firstDiff.actual && diff.expected === firstDiff.expected) ||
        (type === 'text-pos' && diff.actual?.endsWith(firstDiff.actual?.split(' ').pop()) && diff.expected?.endsWith(firstDiff.expected?.split(' ').pop()))
      );
      
      if (isConsistent) {
        patterns.push({
          type,
          count: diffs.length,
          sample: firstDiff,
          startLine: firstDiff.line,
          consistent: true
        });
      } else {
        patterns.push({
          type,
          count: diffs.length,
          sample: firstDiff,
          startLine: firstDiff.line,
          consistent: false
        });
      }
    }
  }
  
  return patterns.length > 0 ? patterns : null;
}

function getPdfLineType(line) {
  if (!line) return 'unknown';
  // PDF structure elements
  if (line.match(/^\d+ \d+ obj$/)) return 'obj-header';
  if (line.match(/^\d{10} \d{5} [fn] $/)) return 'xref-entry';
  if (line.match(/^endobj|stream|endstream$/)) return 'pdf-structure';
  
  // Font-related elements
  if (line.startsWith('/BaseFont')) return 'font-def';
  if (line.match(/^\/F\d+ \d+ \d+ R$/)) return 'font-ref';
  if (line.match(/^\/F\d+ \d+ Tf$/)) return 'font-select';
  
  // Text operations
  if (line.match(/^\d+\.\d+ \d+\.\d+ Td$/)) return 'text-pos';
  if (line.match(/^BT|ET$/)) return 'text-block';
  if (line.match(/^\d+\.\d+ TL$/)) return 'text-leading';
  if (line.match(/^\(\S+\) Tj$/)) return 'text-show';
  
  // Graphics operations
  if (line.match(/^\d+\.\d+ \d+\.\d+ \d+\.\d+ (rg|RG)$/)) return 'color';
  if (line.match(/^[Qq]$/)) return 'graphics-state';
  if (line.match(/^\d+\.\d+ w$/)) return 'line-width';
  if (line.match(/^\d+\.\d+ \d+\.\d+ [ml]$/)) return 'path';
  if (line.match(/^[WSFfBb]\*?$/)) return 'path-op';
  if (line.match(/^[01] [JLj]$/)) return 'style';
  
  // Length and metadata
  if (line.match(/^\/Length \d+$/)) return 'length';
  if (line.match(/^\/Producer|\/CreationDate|\/Creator/)) return 'metadata';
  
  return 'unknown';
}

function compareArrays(actual, expected) {
  let differences = [];
  let consecutiveDiffs = 0;
  let currentBlock = [];
  
  for (let i = 0; i < Math.max(actual.length, expected.length); i++) {
    if (actual[i] !== expected[i]) {
      consecutiveDiffs++;
      currentBlock.push({
        line: i + 1,
        actual: actual[i],
        expected: expected[i]
      });
    } else {
      if (consecutiveDiffs > 0) {
        const patterns = findRepeatedPattern(currentBlock);
        if (patterns) {
          differences.push({
            patterns,
            startLine: currentBlock[0].line,
            count: currentBlock.length
          });
        } else if (currentBlock.length <= 3) {
          differences.push(...currentBlock);
        } else {
          differences.push({
            truncated: true,
            count: currentBlock.length,
            startLine: currentBlock[0].line,
            sample: currentBlock[0]
          });
        }
        currentBlock = [];
      }
      consecutiveDiffs = 0;
    }
  }
  
  // Handle any remaining differences
  if (currentBlock.length > 0) {
    const patterns = findRepeatedPattern(currentBlock);
    if (patterns) {
      differences.push({
        patterns,
        startLine: currentBlock[0].line,
        count: currentBlock.length
      });
    } else if (currentBlock.length <= 3) {
      differences.push(...currentBlock);
    } else {
      differences.push({
        truncated: true,
        count: currentBlock.length,
        startLine: currentBlock[0].line,
        sample: currentBlock[0]
      });
    }
  }
  
  return differences;
}

const DIFFERENCE_DESCRIPTIONS = {
  // PDF structure
  'obj-header': 'Object header',
  'xref-entry': 'Cross-reference entry',
  'pdf-structure': 'PDF structure element',
  
  // Font-related
  'font-def': 'Font definition',
  'font-ref': 'Font reference',
  'font-select': 'Font selection',
  
  // Text operations
  'text-pos': 'Text position',
  'text-block': 'Text block marker',
  'text-leading': 'Text leading',
  'text-show': 'Text content',
  
  // Graphics operations
  'color': 'Color setting',
  'graphics-state': 'Graphics state',
  'line-width': 'Line width',
  'path': 'Path command',
  'path-op': 'Path operation',
  'style': 'Style setting',
  
  // Length and metadata
  'length': 'Content length',
  'metadata': 'Document metadata',
  
  'unknown': 'Uncategorized'
};

function formatDifferences(differences) {
  const MAX_DIFFERENCES_TO_SHOW = 10;
  
  let message = '';
  let totalDiffs = 0;
  let shownDiffs = 0;
  
  // First, count total differences
  for (const diff of differences) {
    if (diff.patterns) {
      totalDiffs += diff.count;
    } else if (diff.truncated) {
      totalDiffs += diff.count;
    } else {
      totalDiffs++;
    }
  }
  
  message += `\nTotal differences: ${totalDiffs}\n`;
  
  // Group similar patterns together
  const patternGroups = new Map();
  
  for (const diff of differences) {
    if (diff.patterns) {
      for (const pattern of diff.patterns) {
        if (pattern.consistent) {
          const key = `${pattern.type}:${pattern.sample.expected}:${pattern.sample.actual}`;
          if (!patternGroups.has(key)) {
            patternGroups.set(key, {
              type: pattern.type,
              sample: pattern.sample,
              count: 0,
              locations: []
            });
          }
          const group = patternGroups.get(key);
          group.count += pattern.count;
          group.locations.push(`${pattern.startLine}-${pattern.startLine + pattern.count - 1}`);
        }
      }
    }
  }
  
  // Output grouped patterns first
  if (patternGroups.size > 0) {
    message += '\nConsistent patterns:\n';
    for (const group of patternGroups.values()) {
      if (shownDiffs >= MAX_DIFFERENCES_TO_SHOW) {
        message += `\n... and ${patternGroups.size - shownDiffs} more consistent patterns\n`;
        break;
      }
      message += `  - ${group.count} ${DIFFERENCE_DESCRIPTIONS[group.type]} differences:\n`;
      const actualStr = group.sample.actual === undefined ? '<missing>' : group.sample.actual;
      const expectedStr = group.sample.expected === undefined ? '<missing>' : group.sample.expected;
      message += `    Expected: "${expectedStr}"\n    Actual:   "${actualStr}"\n`;
      message += `    At lines: ${group.locations.join(', ')}\n`;
      shownDiffs++;
    }
  }
  
  // Then output other differences
  let remainingDiffsToShow = MAX_DIFFERENCES_TO_SHOW - shownDiffs;
  let skippedDiffs = 0;
  
  for (const diff of differences) {
    if (remainingDiffsToShow <= 0) {
      skippedDiffs++;
      continue;
    }
    
    if (diff.patterns) {
      const inconsistentPatterns = diff.patterns.filter(p => !p.consistent);
      if (inconsistentPatterns.length > 0) {
        message += `\nFound ${diff.count} differences at line ${diff.startLine}:\n`;
        for (const pattern of inconsistentPatterns) {
          if (remainingDiffsToShow <= 0) {
            skippedDiffs++;
            continue;
          }
          message += `  - ${pattern.count} ${DIFFERENCE_DESCRIPTIONS[pattern.type]} differences, e.g.:\n`;
          const actualStr = pattern.sample.actual === undefined ? '<missing>' : pattern.sample.actual;
          const expectedStr = pattern.sample.expected === undefined ? '<missing>' : pattern.sample.expected;
          message += `    Expected: "${expectedStr}"\n    Actual:   "${actualStr}"\n`;
          remainingDiffsToShow--;
        }
      }
    } else if (diff.truncated) {
      message += `\n${diff.count} differences at line ${diff.startLine} (showing first):\n`;
      const actualStr = diff.sample.actual === undefined ? '<missing>' : diff.sample.actual;
      const expectedStr = diff.sample.expected === undefined ? '<missing>' : diff.sample.expected;
      const type = getPdfLineType(expectedStr || actualStr);
      message += `  ${DIFFERENCE_DESCRIPTIONS[type]}:\n`;
      message += `  Expected: "${expectedStr}"\n  Actual:   "${actualStr}"\n  ... and ${diff.count - 1} more differences\n`;
      remainingDiffsToShow--;
    } else {
      const actualStr = diff.actual === undefined ? '<missing>' : diff.actual;
      const expectedStr = diff.expected === undefined ? '<missing>' : diff.expected;
      const type = getPdfLineType(expectedStr || actualStr);
      
      if (actualStr === '<missing>') {
        message += `\nLine ${diff.line}: Extra ${DIFFERENCE_DESCRIPTIONS[type]}: "${expectedStr}"`;
      } else if (expectedStr === '<missing>') {
        message += `\nLine ${diff.line}: Extra ${DIFFERENCE_DESCRIPTIONS[type]}: "${actualStr}"`;
      } else {
        message += `\nLine ${diff.line} (${DIFFERENCE_DESCRIPTIONS[type]}):\n  Expected: "${expectedStr}"\n  Actual:   "${actualStr}"`;
      }
      remainingDiffsToShow--;
    }
  }
  
  if (skippedDiffs > 0) {
    message += `\n\n... and ${skippedDiffs} more differences not shown`;
  }
  
  return message;
}

/**
 * Find a better way to set this
 * @type {Boolean}
 */
globalVar.comparePdf = function(actual, expectedFile, suite) {
  var pdf;
  try {
    pdf = globalVar.loadBinaryResource("reference/" + expectedFile, true);
    if (typeof pdf !== "string") {
      throw Error("Error loading 'reference/" + expectedFile + "'");
    }
  } catch (error) {
    fail(error.message);
    globalVar.savePdf(
      "/test/actual/" + expectedFile,
      resetFile(actual.replace(/^\s+|\s+$/g, ""))
    );
    return;
  }
  var expected = resetFile(pdf.replace(/^\s+|\s+$/g, ""));
  actual = resetFile(actual.replace(/^\s+|\s+$/g, ""));

  const actualLines = actual.replace(/[\r]/g, "").split("\n");
  const expectedLines = expected.replace(/[\r]/g, "").split("\n");
  
  const differences = compareArrays(actualLines, expectedLines);
  
  if (differences.length > 0) {
    // Save the actual PDF for debugging
    globalVar.savePdf(
      "/test/actual/" + expectedFile,
      resetFile(actual)
    );
    const message = formatDifferences(differences);
    fail(`PDF comparison failed:${message}\nActual PDF saved to: test/actual/${expectedFile}`);
  }
};
