'use strict'

var fs = require('fs')
var rollup = require('rollup')
var uglify = require('uglify-js')
var babel = require('rollup-plugin-babel')
var execSync = require('child_process').execSync

bundle({
  minified: 'dist/jspdf.min.js',
  debug: 'dist/jspdf.debug.js'
})

// Monkey patching adler32 and filesaver
function monkeyPatch () {
  return {
    transform: (code, id) => {
      var file = id.split('/').pop()
      if (file === 'adler32cs.js') {
        code = code.replace(/this, function/g, 'jsPDF, function')
        code = code.replace(/require\('buffer'\)/g, '{}')
      }
      return code
    }
  }
}

// Rollup removes local variables unless used within a module.
// This plugin makes sure specified local variables are preserved
// and kept local. This plugin wouldn't be necessary if es2015
// modules would be used.
function rawjs (opts) {
  opts = opts || {}
  return {
    transform: (code, id) => {
      var variable = opts[id.split('/').pop()]
      if (!variable) return code

      var keepStr = '/*rollup-keeper-start*/window.tmp=' + variable +
        ';/*rollup-keeper-end*/'
      return code + keepStr
    },
    transformBundle: (code) => {
      for (var file in opts) {
        var r = new RegExp(opts[file] + '\\$\\d+', 'g')
        code = code.replace(r, opts[file])
      }
      var re = /\/\*rollup-keeper-start\*\/.*\/\*rollup-keeper-end\*\//g
      return code.replace(re, '')
    }
  }
}

function bundle (paths) {
  rollup.rollup({
    entry: './main.js',
    plugins: [
      monkeyPatch(),
      rawjs({
        'jspdf.js': 'jsPDF',
        'filesaver.tmp.js': 'saveAs',
        'deflate.js': 'Deflater',
        'zlib.js': 'FlateStream',
        'css_colors.js': 'CssColors',
        'html2pdf.js': 'html2pdf'
      }),
      babel({
        presets: ['es2015-rollup'],
        exclude: ['node_modules/**', 'libs/**']
      })
    ]
  }).then((bundle) => {
    return bundle.generate({
      format: 'umd',
      moduleName: 'jspdf'
    })
  }).then(output => {
    let code = output.code
    code = code.replace(
      /Permission\s+is\s+hereby\s+granted[\S\s]+?IN\s+THE\s+SOFTWARE\./,
      'Licensed under the MIT License'
    )
    code = code.replace(
      /Permission\s+is\s+hereby\s+granted[\S\s]+?IN\s+THE\s+SOFTWARE\./g,
      ''
    )
    fs.writeFileSync(paths.debug, renew(code))

    var minified = uglify.minify(code, {
      output: {
        comments: /@preserve|@license|copyright/i
      }
    })
    fs.writeFileSync(paths.minified, renew(minified.code))
  }).catch((err) => {
    console.error(err)
  })
}

function renew (code) {
  var date = new Date().toISOString()
  var version = require('./package.json').version
  var whoami = execSync('whoami').toString().trim()
  var commit = execSync('git rev-parse --short=10 HEAD').toString().trim()
  code = code.replace('${versionID}', version + ' Built on ' + date)
  code = code.replace('${commitID}', commit)
  code = code.replace(/1\.0\.0-trunk/, version + ' ' + date + ':' + whoami)

  return code
}
