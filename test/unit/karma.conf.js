// Karma configuration
"use strict";
const karmaConfig = require("../karma.common.conf.js");

module.exports = config => {
  config.set({
    ...karmaConfig,

    basePath: "../../",
    files: [
      "node_modules/regenerator-runtime/runtime.js",
      "dist/polyfills.umd.js",
      "dist/jspdf.umd.js",
      "node_modules/canvg/lib/umd.js",
      "node_modules/html2canvas/dist/html2canvas.js",
      "node_modules/dompurify/dist/purify.js",
      "test/compiled/utils/compare.js",
      "test/compiled/specs/*.spec.js",
      { pattern: "test/compiled/specs/*.spec.mjs", type: "module" },
      {
        pattern: "test/reference/**/*.*",
        included: false,
        served: true
      }
    ],

    preprocessors: {
      ...karmaConfig.preprocessors
    },

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
