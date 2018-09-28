# jsPDF

**Generate PDF files in client-side JavaScript.**

This is a fork of [MrRios' jsPDF](https://github.com/MrRio/jsPDF) modified to work with [svg2pdf.js](https://github.com/yWorks/svg2pdf.js), which converts SVG elements to PDF. Since version 2.0.0 this fork is fully compatible to the original version and comes with a large amount of additional features, making this fork also great for standalone usage.

Major changes and new features are:

* A global transformation matrix converts between the usual coordinate system (y axis down) and the PDF coordinate system (y axis up) instead of converting every single coordinate.
* PDF FormObjects
* Shading and tiling patterns
* Basic graphics state support
* Full line style support
* ...

#### Version 2.x.x

With version 2.x.x, this fork is now completely compatible with MrRio's version of jsPDF, which means that all third-party plugins will now also work with this fork! In order to make this possible, we introduced an API-switch between two API modes:

 * In "compat" API mode, jsPDF has the same API as MrRio's version, which means full compatibility with plugins. However, some advanced features like transformation matrices and patterns won't work. This is the default mode.
 * In "advanced" API mode, jsPDF has the API you're used from the yWorks-fork 1.x.x versions. This means the availability of all advanced features like patterns, FormObjects and transformation matrices.

You can switch between the two modes by calling
```javascript
doc.advancedAPI(doc => {
  // your code
})
// or
doc.compatAPI(doc => {
  // your code
})
```
JsPDF will automatically switch back to the original API mode after the callback has run.

In addition to this API switch, here is a list of other API-breaking changes:

 * Some fonts, that don't belong to the 12 standard PDF fonts, had a fallback previously. E.g. "arial" was mapped to "helvetica". Now, these fallbacks don't exist anymore and you have to provide all non-standard fonts yourself.
 * The API of the angle/transform parameter `text(...)` method was clarified. See the API-doc for details.
 * The `style`, `patternKey` and `patternData` of the path drawing methods are now deprecated and were replaced by a new set of path painting methods. Passing `undefined` as style argument will thus no longer result in a "n" path operator!
 * There are four new path construction methods: `moveTo`, `lineTo`, `curveTo` and `close`.
 * There are eight new path painting operators, replacing the `style`, `patternKey` and `patternData` arguments: `stroke`, `fill`, `fillEvenOdd`, `fillStroke`, `fillStrokeEvenOdd`, `clip`, `clipEvenOdd` and `discardPath`. The filling operators accept an optional pattern object.

## Creating your first document
```javascript
var doc = new jsPDF();
doc.text(20, 20, 'Hello world.');
doc.save('Test.pdf');
```

There's a live editor example at the top-level `index.html`.

Full API-docs are available through `docs/index.html`.

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
Build the library with
```
npm install
npm run build
```
This will fetch all dependencies and then compile the `dist` files. To see the examples locally you can start a web server with `npm start` and go to `localhost:8000`. 


## License

(MIT License)

Copyright 
 * (c) 2010-2016 James Hall, https://github.com/MrRio/jsPDF
 * (c) 2015-2018 yWorks GmbH, http://www.yworks.com/

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
