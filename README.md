# jsPDF

**Generate PDF files in client-side JavaScript.**

This is a fork of [MrRios' jsPDF](https://github.com/MrRio/jsPDF) modified to work with [svg2pdf.js](https://github.com/yWorks/svg2pdf.js), which converts SVG elements to PDF.

Major changes and new features are:

* A global transformation matrix converts between the usual coordinate system (y axis down) and the PDF coordinate system (y axis up) instead of converting every single coordinate.
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

## Custom Fonts
jsPDF has built in support for some basic fonts like Helvetica and Times. If you want to add custom fonts you will have 
to pack them into a separate JavaScript file

```
$ node_modules/.bin/jsPDF-makeFonts path/to/fonts_dir -o outputFileName.js
```

and then add them via ```doc.addFont(...)```. Currently only fonts which are encoded in the TrueType format (*.ttf) 
are supported. For further information please visit the [customFonts-support plugin](https://github.com/sphilee/jsPDF-CustomFonts-support)
page.

## Building
Build the library with `npm run build`. This will fetch all dependencies and then compile the `dist` files. To see the examples locally you can start a web server with `npm start` and go to `localhost:8000`. 


## License

(MIT License)

Copyright 
 * (c) 2010-2016 James Hall, https://github.com/MrRio/jsPDF
 * (c) 2015-2017 yWorks GmbH, http://www.yworks.com/

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
