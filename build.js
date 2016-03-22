var fs = require('fs');
var uglify = require('uglify-js');
var execSync = require('child_process').execSync;

var paths = {
    adler: 'node_modules/adler32cs/adler32cs.js',
    fileSaver: 'node_modules/filesaver.js/FileSaver.js',
    adlerTmp: 'adler.tmp.js',
    fileSaverTmp: 'filesaver.tmp.js',
    minified: 'dist/jspdf.min.js',
    debug: 'dist/jspdf.debug.js'
};

var libs = [
    'node_modules/cf-blob.js/Blob.js',
    paths.fileSaverTmp,
    paths.adlerTmp,
    'libs/css_colors.js',
    'libs/deflate.js',
    'libs/html2canvas/dist/html2canvas.js',
    'libs/png_support/png.js',
    'libs/png_support/zlib.js',
    'libs/polyfill.js'
];
var files = execSync('find plugins/*.js').toString().trim().split(/\n/);
files.unshift('jspdf.js');

monkeyPatch();
bundle();

fs.unlink(paths.adlerTmp);
fs.unlink(paths.fileSaverTmp);

// Monkey patching adler32 and filesaver
function monkeyPatch() {
    var adler = fs.readFileSync(paths.adler).toString();
    adler = adler.replace(/this, function/g, 'jsPDF, function');
    adler = adler.replace(/typeof define/g, '0');
    fs.writeFileSync(paths.adlerTmp, adler);

    var fileSaverCode = fs.readFileSync(paths.fileSaver).toString();
    fileSaverCode = fileSaverCode.replace(/define !== null\) && \(define.amd != null/g, '0');
    fs.writeFileSync(paths.fileSaverTmp, fileSaverCode);
}

function bundle() {
    var debug = execSync('cat ' + files.join(' ') + ' ' + libs.join(' ')).toString().trim();
    fs.writeFileSync(paths.debug, renew(debug));

    var licences = extractLicences();
    var minifed = uglify.minify(files.concat(libs), {wrap: 'jspdf-exports'});
    fs.writeFileSync(paths.minified, renew('' + licences + minifed.code));
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

function extractLicences() {
    var licences = '';

    files.concat(libs).forEach(function(file) {
        var commentFilter = " | sed -n -e '1,/\\*\\//p' | sed -e 's/\\s*@preserve/ /' | grep -v *global";
        if (file !== 'jspdf.js') {
            commentFilter += " | sed -e '/Permission/,/SOFTWARE\\./c \\'";
        }

        var lic = execSync("awk '/^\\/\\*/,/\\*\\//' " + file + commentFilter).toString();
        licences += lic.replace(/^\s*\n/gm, '');
    });

    return licences;
}