#jsPDF

**Generate PDF files in client-side JavaScript.**

This is a fork of [MrRios' jsPDF](https://github.com/MrRio/jsPDF) modified to work with [svg2pdf.js](https://github.com/yWorks/svg2pdf.js), which converts SVG elements to PDF.

Major changes and new features are:

* A global transformation matrix converts between the usual coordinate system (y axis down) and the PDF coordinate sytem (y axis up) instead of converting every single coordinate.
* PDF FormObjects
* Shading patterns (gradients)
* Basic graphics state support
* Full line style support

## Creating your first document

See examples/basic.html. There's a live editor example at index.html.

```javascript

var doc = new jsPDF();
doc.text(20, 20, 'Hello world.');
doc.save('Test.pdf');
```

## Checking out the source

```bash
git clone --recursive https://github.com/yWorks/jsPDF.git
```

## Building

To build, simply run the 'make' command. This will fetch all npm and bower deps, then compile minified JS files.

## Running locally

Due to certain restrictions that local files have, you'll need to run a web server. Just run:

```
npm start
```

You can then access the site at localhost:8000

## License

(MIT License)

Copyright 

 * (c) 2010-2014 James Hall, https://github.com/MrRio/jsPDF
 * (c) (c) 2015 yWorks GmbH, http://www.yworks.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
