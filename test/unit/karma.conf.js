// Karma configuration
"use strict";
const karmaConfig = require("../karma.common.conf.js");

module.exports = config => {
  config.set({
    ...karmaConfig,

    basePath: "../../",
    files: [
      "test/unit/loadGlobals.ts",
      {
        pattern: "test/unit/asyncImportHelper.ts",
        included: true,
        watched: true,
        type: "module"
      },
      { pattern: "dist/jspdf.es.js", included: false },
      { pattern: "dist/jspdf.es.js.map", included: false },
      "node_modules/canvg/lib/umd.js",
      "node_modules/html2canvas/dist/html2canvas.js",
      "node_modules/dompurify/dist/purify.js",
      "test/utils/compare.ts",
      "test/specs/*.spec.ts",
      { pattern: "test/specs/*.spec.mjs", type: "module" },
      {
        pattern: "test/reference/**/*.*",
        included: false,
        served: true
      }
    ],

    browsers: ["ChromeHeadless"],
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["mocha", "coverage"],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true
  });
};
