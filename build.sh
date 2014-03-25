#!/bin/sh
#
# Build script for jsPDF
# (c) 2014 Diego Casorran
#

output=dist/jspdf.min.js
options="-m -c --wrap --stats"
libs="`find libs/* -maxdepth 2 -type f | grep .js$ | grep -v -E '(\.min|BlobBuilder\.js$|Downloadify|demo|deps|test)'`"
files="jspdf.js jspdf.plugin*js"
commit=`git rev-parse HEAD`
build=`date +%Y-%m-%dT%H:%M`

# Update submodules
git submodule foreach git pull origin master

# Fix conflict with adler32
adler1="libs/adler32cs.js/adler32cs.js"
adler2="adler32-tmp.js"
cat ${adler1} \
	| sed -e 's/this, function/jsPDF, function/' \
	| sed -e 's/typeof define/0/' > $adler2
libs=${libs/$adler1/$adler2}

# Build dist files
cat ${files} ${libs} \
	| sed s/\${buildDate}/${build}/ \
	| sed s/\${commitID}/${commit}/ >${output/min/source}
uglifyjs ${options} -o ${output} ${files} ${libs}

# Pretend license information to minimized file
for fn in ${files} ${libs}; do
	awk '/^\/\*/,/\*\//' $fn \
		| sed -n -e '1,/\*\//p' \
		| sed -e 'H;${x;s/\s*@preserve/ /g;p;};d' \
		| sed -e 's/\s*===\+//' \
		| grep -v *global > ${output}.x
	
	if test "x$fn" = "xjspdf.js"; then
		cat ${output}.x \
			| sed s/\${buildDate}/${build}/ \
			| sed s/\${commitID}/${commit}/ >> ${output}.tmp
	else
		cat ${output}.x \
			| sed -e '/Permission/,/SOFTWARE\./c \ ' \
			| sed -E '/^\s\*\s*$/d' >> ${output}.tmp
	fi
done
cat ${output} >> ${output}.tmp
cat ${output}.tmp | sed '/^\s*$/d' | sed "s/\"1\.0\.0-trunk\"/\"1.0.0-trunk ${build}\"/" > ${output}
rm -f ${output}.tmp ${output}.x
rm $adler2
