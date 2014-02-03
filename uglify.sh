#!/bin/sh
# I'm Ugly. Improve me, please.

output=dist/jspdf.min.js
options="-m -c --wrap --stats"
libs="`find libs/* -maxdepth 1 -type f | grep .js$ | grep -v .min | grep -v Blob.js$`"
files="jspdf.js jspdf.plugin*js"
commit=`git rev-parse HEAD`
build=`date +%Y-%m-%dT%H:%M`

uglifyjs ${options} -o ${output} ${libs} ${files}

for fn in ${files} ${libs}; do
	awk '/^\/\*/,/\*\//' $fn \
		| sed -n -e '1,/\*\//p' \
		| sed -e 'H;${x;s/\s*@preserve\s*/ /g;p;};d' \
		| grep -v *global \
		| sed s/\${buildDate}/${build}/ \
		| sed s/\${commitID}/Commit\ ID\ ${commit}/ >> ${output}.tmp
done
cat ${output} >> ${output}.tmp
cat ${output}.tmp | sed '/^$/d' > ${output}
rm -f ${output}.tmp
