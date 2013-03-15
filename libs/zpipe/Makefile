all: dist/zpipe.min.js

dist:
	mkdir -p dist

dist/zpipe.min.js: dist src/zpipe.js
	@echo "Building zpipe.min.js"
	cat src/header.js src/zpipe.js src/footer.js | java -jar ~/closure-compiler/compiler.jar > dist/zpipe.min.js

clean:
	rm -rf dist/

test: dist/zpipe.min.js
	@./node_modules/mocha/bin/mocha --reporter spec

.PHONY: test clean
