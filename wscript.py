#! /usr/bin/python

def default(context):
    minifyfiles(context)

def minifyfiles(context):

    src = context.Node('jspdf.js')

    dst = src.parent + 'dist/' + src.name - '.js' + '.source.js'

    dst.text = src.text.replace(
            "${buildDate}", timeUTC()
        ).replace(
            "${commitID}", getCommitIDstring()
        ) + \
        (src - '.js' + '.plugin.addimage.js').text + \
        (src - '.js' + '.plugin.from_html.js').text + \
        (src - '.js' + '.plugin.sillysvgrenderer.js').text + \
        (src - '.js' + '.plugin.split_text_to_size.js').text + \
        (src - '.js' + '.plugin.standard_fonts_metrics.js').text + \
        (src - 'jspdf.js' + 'libs/Blob.js/BlobBuilder.js').text + \
        (src - 'jspdf.js' + 'libs/FileSaver.js/FileSaver.js').text + \
        (src - 'jspdf.js' + 'libs/Deflate/deflate.js').text + \
        (src - 'jspdf.js' + 'libs/Deflate/adler32cs.js').text
        # (src - '.js' + '.plugin.from_html.js').text + \
        # 


    minified = dst - '.source.js' + '.min.js'

    print("=== Compressing jsPDF and select plugins into " + minified.name)
    minified.text = compress_with_closure_compiler( dst.text )

    # AMD-compatible version:
    (minified - '.min.js' + '.amd.min.js').text = """;(function(){
%s
;define(function(){return jsPDF})})();
""" % minified.text
    
    # jQuery "NoConflict" version:
    # only needed if some of the modules compiled into jsPDF need $
    # one such module is fromHTML
#     (minified - '.min.js' + '.noconflict.min.js').text = """;(function($){
# %s
# })(jQuery);
# """ % minified.text

def docs(context):
	'''
	java -jar %jsdocbindir%\jsrun.jar %jsdocbindir%\app\run.js -v %rootdir%\jspdf.js -d=%rootdir%\doc -t=%rootdir%\tools\jsdoc_template
	'''

	jsdocBinDir = context.Node('~/bin/jsdoc-toolkit/')
	codefile = context.Node('jspdf.js')
	destinationFolder = context.Node('doc/')
	templateFolder = context.Node('tools/jsdoc_template/')

	import subprocess
	subprocess.call(
		[
			'java'
			, '-jar'
			, (jsdocBinDir + 'jsrun.jar').absolutepath
			, (jsdocBinDir + 'app/run.js').absolutepath
			, '-v'
			, codefile.absolutepath
			, '-d='+destinationFolder.absolutepath
			, '-t='+templateFolder.absolutepath
		]
	)

def timeUTC():
    import datetime
    return datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M")

def getCommitIDstring():
    import subprocess

    if not hasattr( subprocess, "check_output"):
        # let's not bother emulating it. Not important
        return ""
    else:
        return "commit ID " + subprocess.check_output(
            [
                'git'
                , 'rev-parse'
                , 'HEAD'
            ]
        ).strip()

def compress_with_closure_compiler(code, compression_level = None):
    '''Sends text of JavaScript code to Google's Closure Compiler API
    Returns text of compressed code.
    '''
    # script (with some modifications) from 
    # https://developers.google.com/closure/compiler/docs/api-tutorial1

    import httplib, urllib, sys

    compression_levels = [
        'WHITESPACE_ONLY'
        , 'SIMPLE_OPTIMIZATIONS'
        , 'ADVANCED_OPTIMIZATIONS'
    ]

    if compression_level not in compression_levels:
        compression_level = compression_levels[1] # simple optimizations

    # Define the parameters for the POST request and encode them in
    # a URL-safe format.
    params = urllib.urlencode([
        ('js_code', code)
        , ('compilation_level', compression_level)
        , ('output_format', 'json')
        , ('output_info', 'compiled_code')
        , ('output_info', 'warnings')
        , ('output_info', 'errors')
        , ('output_info', 'statistics')
        # , ('output_file_name', 'default.js')
        # , ('js_externs', 'javascript with externs') # only used on Advanced. 
      ])

    # Always use the following value for the Content-type header.
    headers = { "Content-type": "application/x-www-form-urlencoded" }
    conn = httplib.HTTPConnection('closure-compiler.appspot.com')
    conn.request('POST', '/compile', params, headers)
    response = conn.getresponse()

    if response.status != 200:
        raise Exception("Compilation server responded with non-OK status of " + str(response.status))

    compressedcode = response.read()
    conn.close()

    import json # needs python 2.6+ or simplejson module for earlier
    parts = json.loads(compressedcode)

    if 'errors' in parts:
        prettyerrors = ['\nCompilation Error:']
        for error in parts['errors']:
            prettyerrors.append(
                "\nln %s, ch %s, '%s' - %s" % (
                    error['lineno']
                    , error['charno']
                    , error['line']
                    , error['error']
                )
            )
        raise Exception(''.join(prettyerrors))

    return parts['compiledCode']

if __name__ == '__main__':
    print("This is a Wak build automation tool script. Please, get Wak on GitHub and run it against the folder containing this automation script.")
