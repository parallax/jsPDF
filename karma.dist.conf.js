// Karma configuration
'use strict'
const karmaConfig = require('./karma.common.conf.js')

const browsers = {
  IE: {}
}

module.exports = (config) => {
  config.set({
    ...karmaConfig,
    files: [
      'spec/utils/polyfill.js',
      'dist/jspdf.debug.js',
      'node_modules/canvg/dist/browser/canvg.js',
      'node_modules/html2canvas/dist/html2canvas.js',
      'spec/utils/compare.js',
      {
        pattern: 'spec/**/*.spec.js',
        included: true
      },
      {
        pattern: 'spec/**/reference/*.*',
        included: false,
        served: true
      }
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'dist/jspdf.debug.js': 'coverage',
      'spec/!(acroform|unicode)*/*.js': 'babel'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests wheneve r any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: Object.keys(browsers),
  })
}