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
// Monkey patching filesaver and html2canvas
function monkeyPatch() {
  return {
    transform: (code, id) => {
      var file = id.split('/').pop()

      // Only one define call per module is allowed by requirejs so
      // we have to remove calls that other libraries make
      if (file === 'FileSaver.js') {
        code = code.replace(/define !== null\) && \(define.amd != null/g, '0')
      } else if (file === 'html2canvas.js') {
        code = code.replace(/&&\s+define.amd/g, '&& define.amd && false')
      }

      return code
    }
  }
}

// Rollup removes local variables unless used within a module.
// This plugin makes sure specified local variables are preserved
// and kept local. This plugin wouldn't be necessary if es2015
// modules would be used.
function rawjs(opts) {
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

function bundle(paths) {
  rollup.rollup({
    input: './main.js',
    context: 'window',
    plugins: [
      monkeyPatch(),
      rawjs({
        'jspdf.js': 'jsPDF',
        'filesaver.tmp.js': 'saveAs',
        'deflate.js': 'Deflater',
        'zlib.js': 'FlateStream',
        'BMPDecoder.js': 'BmpDecoder',
        'omggif.js': 'GifReader',
        'JPEGEncoder.js': 'JPEGEncoder',
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
      name: 'jsPDF'
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

function renew(code) {
  var date = new Date().toISOString()
  var version = require('./package.json').version
  var whoami = execSync('whoami').toString().trim()
  var commit = '00000000';
  try {
    commit = execSync('git rev-parse --short=10 HEAD').toString().trim()
  } catch (e) {}
  code = code.replace(/\$\{versionID\}/g, version)
  code = code.replace(/\$\{builtOn\}/g, date)
  code = code.replace('${commitID}', commit)
  code = code.replace(/1\.0\.0-trunk/, version + ' ' + date + ':' + whoami)

  return code
}
