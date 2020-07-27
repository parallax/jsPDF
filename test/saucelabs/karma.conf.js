// Karma configuration
"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const karmaConfig = require("../karma.common.conf.js");

const browsers = {
  sl_ie_11: {
    base: "SauceLabs",
    browserName: "internet explorer",
    platform: "Windows 10",
    version: "11"
  },
  sl_chrome: {
    base: "SauceLabs",
    browserName: "chrome",
    platform: "Windows 10",
    version: "83"
  },
  sl_firefox: {
    base: "SauceLabs",
    browserName: "firefox",
    version: "77"
  }
};

module.exports = config => {
  // Use ENV vars or .sauce.yml to get credentials
  if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync(".sauce.yml")) {
      // eslint-disable-next-line no-console
      console.log("Create a .sauce.yml with your credentials");
      process.exit(1);
    } else {
      let sauceConfig = yaml.safeLoad(fs.readFileSync(".sauce.yml", "utf8"));
      process.env.SAUCE_USERNAME = sauceConfig.addons.sauce_connect.username;
      process.env.SAUCE_ACCESS_KEY =
        sauceConfig.addons.sauce_connect.access_key;
    }
  }
  config.set({
    ...karmaConfig,

    basePath: "../..",

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.DEBUG,

    // list of files / patterns to load in the browser
    files: [
      "dist/polyfills.umd.js",
      "node_modules/regenerator-runtime/runtime.js",

      "dist/jspdf.umd*.js",
      "node_modules/canvg/lib/umd.js",
      "node_modules/html2canvas/dist/html2canvas.js",
      "node_modules/dompurify/dist/purify.js",

      "test/saucelabs/loadGlobals.js",
      "test/utils/compare.js",

      {
        pattern: "test/specs/*.spec.js",
        included: true,
        watched: true,
        served: true
      },
      {
        pattern: "test/**/*.+(svg|png|jpg|jpeg|ttf|txt)",
        included: false,
        served: true
      },
      {
        pattern: "test/reference/**/*.pdf",
        included: false,
        watched: false,
        served: true
      }
    ],

    preprocessors: {
      "test/**/!(acroform|unicode)*.spec.js": "babel",
      "test/utils/compare.js": "babel"
    },

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    reporters: ["saucelabs", "progress", "coverage", "mocha", "verbose"], // 2

    browsers: Object.keys(browsers),
    customLaunchers: browsers
  });
};
