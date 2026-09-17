var karmaConfig = {
  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: "..",
  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ["jasmine"],
  // list of files / patterns to load in the browser

  // list of files to exclude
  exclude: [],

  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  preprocessors: {
    "src/jspdf.ts": ["babelTS", "coverage"],
    "src/modules/*.ts": ["babelTS", "coverage"],
    "src/libs/*.ts": ["babelTS"],
    "src/index.ts": ["babelTS"],
    "test/!(acroform|unicode)*.spec.js": ["babel"],
    "test/utils/compare.js": ["babel"]
  },
  // web server port
  port: 9876,

  // enable / disable colors in the output (reporters and logs)
  colors: true,

  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: false,

  browsers: ["Chrome", "Firefox"],

  // Concurrency level
  // how many browser should be started simultaneous
  concurrency: Infinity,

  browserNoActivityTimeout: 60000,
  captureTimeout: 120000,

  coverageReporter: {
    reporters: [
      {
        type: "lcov",
        dir: "coverage/"
      },
      {
        type: "text"
      }
    ]
  },
  babelPreprocessor: {
    options: {
      presets: ["@babel/env"], // "@babel/preset-env"
      sourceMap: "inline"
    }
  },
  customPreprocessors: {
    // Strips TypeScript types only (no downleveling) and serves the result
    // under the original file's ".js" URL so browser-native ES module imports
    // like `import { jsPDF } from "../jspdf.js"` keep resolving.
    babelTS: {
      base: "babel",
      options: {
        babelrc: false,
        configFile: false,
        presets: [
          [
            "@babel/preset-typescript",
            // The file is served under a ".js" name, so TypeScript parsing
            // must be forced rather than inferred from the extension.
            { allExtensions: true, allowDeclareFields: true }
          ]
        ],
        sourceMap: "inline"
      },
      filename: function(file) {
        return file.originalPath.replace(/\.ts$/, ".js");
      },
      sourceFileName: function(file) {
        return file.originalPath;
      }
    }
  }
};

module.exports = karmaConfig;
