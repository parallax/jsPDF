#!/bin/sh
# I'm Ugly. Improve me, please.

output=dist/jspdf.min.js
options="-m -c --wrap --stats"
libs="`find libs/* -maxdepth 2 -type f | grep .js$ | grep -v -E '(\.min|BlobBuilder\.js$|Downloadify|demo|deps|test)'`"
files="jspdf.js jspdf.plugin*js"
commit=`git rev-parse HEAD`
build=`date +%Y-%m-%dT%H:%M`

wak.py
uglifyjs ${options} -o ${output} ${libs} ${files}

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
