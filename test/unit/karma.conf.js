// Karma configuration
"use strict";
const karmaConfig = require("../karma.common.conf.js");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const { babel } = require("@rollup/plugin-babel");

module.exports = config => {
  config.set({
    ...karmaConfig,

    basePath: "../../",
    files: [
      "node_modules/regenerator-runtime/runtime.js",
      "test/compiled/unit/loadGlobals.js",
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
      ...karmaConfig.preprocessors,
      "test/unit/asyncImportHelper.ts": ["rollup"]
    },

    rollupPreprocessor: {
      plugins: [
        babel({
          babelHelpers: "bundled",
          extensions: [".ts", ".js"],
          presets: ["@babel/preset-typescript"]
        }),
        resolve(),
        commonjs()
      ],
      external: [/^\.\.?\//],  // Mark relative paths as external
      output: {
        format: "esm",
        sourcemap: "inline"
      }
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
