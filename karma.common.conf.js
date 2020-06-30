var karmaConfig = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],
    // list of files / patterns to load in the browser
    files: [
        'spec/utils/polyfill.js',
        'src/libs/polyfill.js',
        'src/jspdf.js',
        {
            pattern: 'src/libs/*.js',
            included: true
        },
        {
            pattern: 'src/modules/*.js',
            included: true
        },
        'node_modules/canvg/dist/browser/canvg.js',
        'node_modules/html2canvas/dist/html2canvas.js',
        'spec/utils/compare.js',
        {
            pattern: 'spec/*.spec.js',
            included: true
        },
        {
            pattern: 'spec/reference/*.*',
            included: false,
            served: true
        }
    ],
    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'src/jspdf.js': 'coverage',
        'src/modules/*.js': 'coverage',
        'spec/!(acroform|unicode)*.spec.js': 'babel',
        'spec/utils/compare.js': 'babel'
    },
    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    browserNoActivityTimeout: 60000,
    captureTimeout: 120000,

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
            presets: ["@babel/env"], // "@babel/preset-env"
            sourceMap: 'inline'
        }
    }
}

module.exports = karmaConfig
