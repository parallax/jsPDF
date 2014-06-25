#!/bin/sh
#
# Build script for jsPDF
# (c) 2014 Diego Casorran
#

output=dist/jspdf.min.js
options="-m -c --wrap --stats"
version="`python -c 'import time;t=time.gmtime(time.time());print("1.%d.%d" % (t[0] - 2014, t[7]))'`"
libs="`find libs/* -maxdepth 2 -type f | grep .js$ | grep -v -E '(\.min|BlobBuilder\.js$|Downloadify|demo|deps|test)'`"
files="jspdf.js jspdf.plugin*js"
build=`date +%Y-%m-%dT%H:%M`
commit=`git rev-parse --short=10 HEAD`
whoami=`whoami`

# Update submodules
git submodule foreach git pull origin master

# Update Bower
cat bower \
	| sed "s/\"1\.0\.0\"/\"${version}\"/" >bower.json

# Fix conflict with adler32 & FileSaver
adler1="libs/adler32cs.js/adler32cs.js"
adler2="adler32-tmp.js"
cat ${adler1} \
	| sed -e 's/this, function/jsPDF, function/' \
	| sed -e 's/typeof define/0/' > $adler2
libs=${libs/$adler1/$adler2}
saveas1="libs/FileSaver.js/FileSaver.js"
saveas2="FileSaver-tmp.js"
cat ${saveas1} \
	| sed -e 's/define !== null) && (define.amd != null/0/' > $saveas2
libs=${libs/$saveas1/$saveas2}

# Build dist files
cat ${files} ${libs} \
	| sed s/\${versionID}/${version}-git\ Built\ on\ ${build}/ \
	| sed s/\${commitID}/${commit}/ \
	| sed "s/\"1\.0\.0-trunk\"/\"${version}-debug ${build}:${whoami}\"/" >${output/min/debug}
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
