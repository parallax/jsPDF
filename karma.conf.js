// Karma configuration
'use strict'
module.exports = (config) => {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
       'libs/polyfill.js',
      'jspdf.js',
      {
        pattern: 'plugins/*.js',
        included: true
      },
      'libs/ttffont.js',
      './libs/png_support/png.js',
      './libs/png_support/zlib.js',
      'libs/adler32cs.js',
      'libs/Deflater.js',
      'libs/BMPDecoder.js',
      'node_modules/omggif/omggif.js',
      'libs/JPEGEncoder.js',
      'libs/html2canvas/dist/html2canvas.js',
      'libs/rgbcolor.js',
      'libs/canvg_context2d/libs/StackBlur.js',
      'libs/canvg_context2d/canvg.js',
      'tests/utils/compare.js',
      {
        pattern: 'tests/**/*.spec.js',
        included: true
      }, {
        pattern: 'tests/**/reference/*.*',
        included: false,
        served: true
      }
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'jspdf.js': 'coverage',
      'plugins/*.js': 'coverage',
      'tests/!(acroform)*/*.js': 'babel'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    coverageReporter: {
      reporters: [
        {
          type: 'lcov',
          dir: 'coverage/'
        },
        {
          type: 'text'
        }
      ]
    },
    babelPreprocessor: {
      options: {
        presets: ['env'],
        sourceMap: 'inline'
      }
    }

  })
}
