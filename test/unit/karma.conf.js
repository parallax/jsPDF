// Karma configuration
"use strict";
const karmaConfig = require("../karma.common.conf.js");
const resolve = require("rollup-plugin-node-resolve");
const { generateReportData, writeReportData } = require('../report/generate-report-data');

const TestReporter = function(baseReporterDecorator) {
  baseReporterDecorator(this);

  this.onRunComplete = function(browsers, results) {
    const testResults = {
      total: results.total,
      passed: results.success,
      failed: results.failed,
      skipped: results.skipped,
      failures: []
    };

    // Process failures
    browsers.forEach(browser => {
      if (browser.lastResult && browser.lastResult.failed) {
        Object.values(browser.lastResult.failedSpecs || {}).forEach(failure => {
          testResults.failures.push({
            name: failure.suite.join(' ') + ' - ' + failure.description,
            actualPdf: failure.log[0]?.match(/Actual PDF saved to: (.+\.pdf)/)?.[1],
            referencePdf: 'test/reference/' + failure.log[0]?.match(/Actual PDF saved to: test\/actual\/(.+\.pdf)/)?.[1],
            differences: {
              total: failure.log[0]?.match(/Total differences: (\d+)/)?.[1] || 0,
              patterns: []
            }
          });
        });
      }
    });

    const reportData = generateReportData(testResults);
    writeReportData(reportData);
  };
};

TestReporter.$inject = ['baseReporterDecorator'];

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
        pattern: "test/specs/*.spec.mjs",
        included: true,
        type: "module"
      },
      {
        pattern: "test/reference/**/*.*",
        included: false,
        served: true
      }
    ],
    preprocessors: {
      "src/libs/fflate.js": ["rollup"]
    },

    rollupPreprocessor: {
      plugins: [resolve()],
      output: {
        format: "es",
        sourcemap: "inline"
      }
    },

    browsers: ["Chrome"],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["mocha", "coverage", "test-report"],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    plugins: [
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-jasmine',
      'karma-mocha-reporter',
      'karma-rollup-preprocessor',
      {'reporter:test-report': ['type', TestReporter]}
    ]
  });
};
