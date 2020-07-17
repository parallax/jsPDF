// Karma configuration
"use strict";
const karmaConfig = require("../karma.common.conf.js");

module.exports = config => {
  config.set({
    ...karmaConfig,

    basePath: "../../",
    files: [
      "test/unit/loadGlobals.js",
      {
        pattern: "test/unit/asyncImportHelper.js",
        included: true,
        watched: true,
        type: "module"
      },
      { pattern: "src/**/*.js", included: false },
      "node_modules/canvg/lib/umd.js",
      "node_modules/html2canvas/dist/html2canvas.js",
      "node_modules/dompurify/dist/purify.js",
      "test/utils/compare.js",
      {
        pattern: "test/specs/*.spec.js",
        included: true
      },
      {
        pattern: "test/reference/*.*",
        included: false,
        served: true
      }
    ],

    browsers: ["Chrome", "Firefox"],

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
