'use strict'
const yaml = require('js-yaml')
const fs = require('fs')

const browsers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '53'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '49'
  },
  sl_ios_safari: {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.9',
    version: '7.1'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 10',
    version: '11'
  }
}

let sauceConfig = yaml.safeLoad(fs.readFileSync('.sauce.yml', 'utf8'))

module.exports = (config) => {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'jspdf.js', {
        pattern: 'specs/**/*.spec.js',
        included: true
      }
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // all other options that are defined in
    // local.karma.conf.js were elided for the
    // purpose of this blog post.
    reporters: ['saucelabs', 'progress'], // 2
    browsers: Object.keys(browsers), // 3
    customLaunchers: browsers, // 4
    sauceLabs: {
      username: sauceConfig.addons.sauce_connect.username,
      access_key: sauceConfig.addons.sauce_connect.access_key
    }
  })
}
