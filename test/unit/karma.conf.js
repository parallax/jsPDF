// Karma configuration
"use strict";
const karmaConfig = require("../karma.common.conf.js");
const resolve = require("rollup-plugin-node-resolve");
const { generateReportData, writeReportData } = require('../report/generate-report-data');

const TestReporter = function(baseReporterDecorator) {
  baseReporterDecorator(this);

  this.onRunComplete = function(browsers, results) {
    const testResults = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      failures: []
    };

    // Aggregate results from all browsers
    browsers.forEach(browser => {
      const result = browser.lastResult;
      testResults.total += result.total;
      testResults.passed += result.success;
      testResults.failed += result.failed;
      testResults.skipped += result.skipped;

      // Process failures
      if (result.failed > 0) {
        Object.values(browser.lastResult.failedSpecs || {}).forEach(failure => {
          if (failure.log && failure.log.length > 0) {
            const failureLog = failure.log[0];
            
            // Check if this is a PDF comparison failure
            if (failureLog.includes('PDF comparison failed:')) {
              const match = failureLog.match(/PDF comparison failed:[\s\S]*?Actual PDF saved to: (.+\.pdf)/);
              if (match) {
                const actualPdf = match[1];
                const referencePdf = actualPdf.replace('test/actual/', 'test/reference/');
                
                testResults.failures.push({
                  name: failure.suite.join(' ') + ' - ' + failure.description,
                  actualPdf,
                  referencePdf,
                  error: failureLog
                });
              }
            } else {
              // Non-PDF comparison failure
              testResults.failures.push({
                name: failure.suite.join(' ') + ' - ' + failure.description,
                error: failureLog
              });
            }
          }
        });
      }
    });

    writeReportData(testResults);
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
