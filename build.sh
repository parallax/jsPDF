#!/bin/sh
#
# Build script for jsPDF
# (c) 2014 Diego Casorran
# (c) 2015 James Hall
#

output=dist/jspdf.min.js
options="-m -c --wrap --stats"
version="$(node -p -e "require('./package.json').version")"
npm_libs="node_modules/cf-blob.js/Blob.js node_modules/filesaver.js/FileSaver.js node_modules/adler32cs/adler32cs.js"
libs="${npm_libs} `find libs/* -maxdepth 2 -type f | grep .js$ | grep -v -E '(\.min|BlobBuilder\.js$|Downloadify|demo|deps|test)'`"
files="jspdf.js plugins/*js"
build=`date +%Y-%m-%dT%H:%M`
commit=`git rev-parse --short=10 HEAD`
whoami=`whoami`

echo "Building version ${version}"

# Update Bower
sed -i.bak "s/\"version\": \"(.*)\"/\"${version}\"/" bower.json

# Fix conflict with adler32 & FileSaver
adler1="node_modules/adler32cs/adler32cs.js"
adler2="adler32-tmp.js"
cat ${adler1} \
	| sed -e 's/this, function/jsPDF, function/' \
	| sed -e 's/typeof define/0/' > $adler2
libs="$(echo $libs | sed "s#$adler1#$adler2#")"
saveas1="node_modules/filesaver.js/FileSaver.js"
saveas2="FileSaver-tmp.js"
cat ${saveas1} \
	| sed -e 's/define !== null) && (define.amd != null/0/' > $saveas2
libs="$(echo $libs | sed "s#$saveas1#$saveas2#")"

# Build dist files
cat ${files} ${libs} \
	| sed s/\${versionID}/${version}-git\ Built\ on\ ${build}/ \
	| sed s/\${commitID}/${commit}/ \
	| sed "s/\"1\.0\.0-trunk\"/\"${version}-debug ${build}:${whoami}\"/" > "$(echo $output | sed s/min/debug/)"
./node_modules/.bin/uglifyjs ${options} -o ${output} ${files} ${libs}

# Pretend license information to minimized file
for fn in ${files} ${libs}; do
	awk '/^\/\*/,/\*\//' $fn \
		| sed -n -e '1,/\*\//p' \
		| sed -e 'H;${x;s/\s*@preserve/ /g;p;};d' \
		| sed -e 's/\s*===\+//' \
		| grep -v *global > ${output}.x

	if test "x$fn" = "xjspdf.js"; then
		cat ${output}.x \
			| sed s/\${versionID}/${version}-git\ Built\ on\ ${build}/ \
			| sed s/\${commitID}/${commit}/ >> ${output}.tmp
	else
		cat ${output}.x \
			| sed -e '/Permission/,/SOFTWARE\./c \ ' \
			| sed -E '/^\s\*\s*$/d' >> ${output}.tmp
	fi
done
cat ${output} >> ${output}.tmp
cat ${output}.tmp | sed '/^\s*$/d' | sed "s/\"1\.0\.0-trunk\"/\"${version}-git ${build}:${whoami}\"/" > ${output}
rm -f ${output}.tmp ${output}.x $adler2 $saveas2


# Check options
while [ $# -gt 0 ]
	do
		case "$1" in
			-c|-commit)
				shift
				git_commit="$1"
				;;
			-p|-push)
				git_push=1
				;;
			-t|-tag)
				git_tag=1
				;;
			*)
				break
				;;
		esac
		shift
done

if [ "$git_push" = "1" -a -z "$git_commit" ]; then
	git_commit="New dist files."
fi
if [ -n "$git_commit" ]; then
	git commit -a -m "$git_commit"
fi
if [ "$git_push" = "1" ]; then
	git push
fi
if [ "$git_tag" = "1" ]; then
	commit=`git rev-parse --short=10 HEAD`
	git history
	git tag -m "${build} ${commit}" -s v${version}
	git push upstream v${version}
fi
