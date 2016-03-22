var fs = require('fs');
var rollup = require('rollup');
var uglify = require('uglify-js');
var execSync = require('child_process').execSync;

bundle({
    minified: 'dist/jspdf.min.js',
    debug: 'dist/jspdf.debug.js'
});

// Monkey patching adler32 and filesaver
function monkeyPatch() {
    return {
        transform: function (code, id) {
            var file = id.split('/').pop();
            if (file === 'adler32cs.js') {
                code = code.replace(/this, function/g, 'jsPDF, function');
                code = code.replace(/typeof define/g, '0');
            } else if (file === 'FileSaver.js') {
                code = code.replace(/define !== null\) && \(define.amd != null/g, '0');
            }
            return code;
        }
    }
}

// Rollup removes local variables unless used within a module.
// This plugin makes sure specified local variables are preserved 
// and kept local. This plugin won't be necessary once es2015
// modules are used.
function rawjs(opts) {
    opts = opts || {};
    return {
        transform: function (code, id) {
            var variable = opts[id.split('/').pop()];
            if (!variable) return code;

            var keepStr = '/*rollup-keeper-start*/window.tmp=' + variable + ';/*rollup-keeper-end*/';
            return code + keepStr;
        },
        transformBundle: function (code) {
            for (var file in opts) {
                var r = new RegExp(opts[file] + '\\$\\d+', 'g');
                code = code.replace(r, opts[file]);
            }
            var re = /\/\*rollup-keeper-start\*\/.*\/\*rollup-keeper-end\*\//g;
            return code.replace(re, '');
        }
    }
}

function bundle(paths) {
    rollup.rollup({
        entry: './libs/main.js',
        plugins: [
            monkeyPatch(),
            rawjs({
                'jspdf.js': 'jsPDF',
                'filesaver.tmp.js': 'saveAs',
                'deflate.js': 'Deflater',
                'zlib.js': 'FlateStream',
                'css_colors.js': 'CssColors',
                'html2pdf.js': 'html2pdf'
            })
        ]
    }).then(function (bundle) {
        var code = bundle.generate({format: 'umd'}).code;
        code = code.replace(/Permission\s+is\s+hereby\s+granted[\S\s]+?IN\s+THE\s+SOFTWARE\./, 'Licensed under the MIT License');
        code = code.replace(/Permission\s+is\s+hereby\s+granted[\S\s]+?IN\s+THE\s+SOFTWARE\./g, '');
        fs.writeFileSync(paths.debug, renew(code));

        var minified = uglify.minify(code, {fromString: true, output: {comments: /@preserve|@license|copyright/i}});
        fs.writeFileSync(paths.minified, renew(minified.code));
    }).catch(function (err) {
        console.error(err);
    });
}

function renew(code) {
    var date = new Date().toISOString();
    var version = require('./package.json').version;
    var whoami = execSync('whoami').toString().trim();
    var commit = execSync('git rev-parse --short=10 HEAD').toString().trim();

    code = code.replace('${versionID}', version + ' Built on ' + date);
    code = code.replace('${commitID}', commit);
    code = code.replace(/1\.0\.0-trunk/, version + ' ' + date + ':' + whoami);

    return code;
}