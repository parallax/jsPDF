# ![jsPDF](https://parall.ax/parallax-2016/img/svg/jspdf-logo.svg)

[![Build Status](https://saucelabs.com/buildstatus/jspdf)](https://saucelabs.com/beta/builds/526e7fda50bd4f97a854bf10f280305d)
[![Code Climate](https://codeclimate.com/repos/57f943855cdc43705e00592f/badges/2665cddeba042dc5191f/gpa.svg)](https://codeclimate.com/repos/57f943855cdc43705e00592f/feed)
[![Test Coverage](https://codeclimate.com/repos/57f943855cdc43705e00592f/badges/2665cddeba042dc5191f/coverage.svg)](https://codeclimate.com/repos/57f943855cdc43705e00592f/coverage)
[![GitHub license](https://img.shields.io/github/license/MrRio/jsPDF.svg)](https://github.com/MrRio/jsPDF/blob/master/LICENSE)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/MrRio/jsPDF.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/MrRio/jsPDF/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/MrRio/jsPDF.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/MrRio/jsPDF/context:javascript)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/from-referrer/)

**A library to generate PDFs in JavaScript.**

You can [catch me on twitter](http://twitter.com/MrRio): [@MrRio](http://twitter.com/MrRio) or head over to [my company's website](http://parall.ax) for consultancy.

jsPDF is now co-maintained by [yWorks - the diagramming experts](https://www.yworks.com/).

## [Live Demo](http://raw.githack.com/MrRio/jsPDF/master/) | [Documentation](http://raw.githack.com/MrRio/jsPDF/master/docs/)

## Install

Recommended: get jsPDF from npm:

```sh
npm install jspdf --save
# or
yarn add jspdf
```

Alternatively, load it from a CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js"></script>
```

Or always get latest version via [unpkg](https://unpkg.com/browse/jspdf/)

```html
<script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>
```

The `dist` folder of this package contains different kinds of files:

- **jspdf.es.\*.js**: Modern ES2015 module format.
- **jspdf.node.\*.js**: For running in Node. Uses file operations for loading/saving files instead of browser APIs.
- **jspdf.umd.\*.js**: UMD module format. For AMD or script-tag loading.
- **polyfills\*.js**: Required polyfills for older browsers like Internet Explorer. The es variant simply imports all
  required polyfills from `core-js`, the umd variant is self-contained.

Usually it is not necessary to specify the exact file in the import statement. Build tools or Node automatically figure
out the right file, so importing "jspdf" is enough.

## Usage

Then you're ready to start making your document:

```javascript
import { jsPDF } from "jspdf";

// Default export is a4 paper, portrait, using millimeters for units
const doc = new jsPDF();

doc.text("Hello world!", 10, 10);
doc.save("a4.pdf");
```

If you want to change the paper size, orientation, or units, you can do:

```javascript
// Landscape export, 2×4 inches
const doc = new jsPDF({
  orientation: "landscape",
  unit: "in",
  format: [4, 2]
});

doc.text("Hello world!", 1, 1);
doc.save("two-by-four.pdf");
```

### Running in Node.js

```javascript
const { jsPDF } = require("jspdf"); // will automatically load the node version

const doc = new jsPDF();
doc.text("Hello world!", 10, 10);
doc.save("a4.pdf"); // will save the file in the current working directory
```

### Other Module Formats

<details>
  <summary>
    <b>AMD</b>
  </summary>

```js
require(["jspdf"], ({ jsPDF }) => {
  const doc = new jsPDF();
  doc.text("Hello world!", 10, 10);
  doc.save("a4.pdf");
});
```

</details>

<details>
  <summary>
    <b>Globals</b>
  </summary>

```js
const { jsPDF } = window.jspdf;

const doc = new jsPDF();
doc.text("Hello world!", 10, 10);
doc.save("a4.pdf");
```

</details>

### Optional dependencies

Some functions of jsPDF require optional dependencies. E.g. the `html` method, which depends on `html2canvas` and,
when supplied with a string HTML document, `dompurify`. JsPDF loads them dynamically when required
(using the respective module format, e.g. dynamic imports). Build tools like Webpack will automatically create separate
chunks for each of the optional dependencies. If your application does not use any of the optional dependencies, you
can prevent Webpack from generating the chunks by defining them as external dependencies:

```js
// webpack.config.js
module.exports = {
  // ...
  externals: {
    // only define the dependencies you are NOT using as externals!
    canvg: "canvg",
    html2canvas: "html2canvas",
    dompurify: "dompurify"
  }
};
```

In **Vue CLI** projects, externals can be defined via the [configureWebpack](https://cli.vuejs.org/config/#configurewebpack)
or [chainWebpack](https://cli.vuejs.org/config/#chainwebpack) properties of the `vue.config.js` file
(needs to be created, first, in fresh projects).

In **Angular** projects, externals can be defined using
[custom webpack builders](https://github.com/just-jeb/angular-builders/tree/master/packages/custom-webpack).

In **React** (`create-react-app`) projects, externals can be defined by either using
[react-app-rewired](https://github.com/timarney/react-app-rewired) or ejecting.

### TypeScript/Angular/Webpack/React/etc. Configuration:

jsPDF can be imported just like any other 3rd party library. This works with all major toolkits and frameworks. jsPDF
also offers a typings file for TypeScript projects.

```js
import { jsPDF } from "jspdf";
```

You can add jsPDF to your meteor-project as follows:

```
meteor add jspdf:core
```

### Polyfills

jsPDF requires modern browser APIs in order to function. To use jsPDF in older browsers like Internet Explorer,
polyfills are required. You can load all required polyfills as follows:

```js
import "jspdf/dist/polyfills.es.js";
```

Alternatively, you can load the prebundled polyfill file. This is not recommended, since you might end up
loading polyfills multiple times. Might still be nifty for small applications or quick POCs.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/polyfills.umd.js"></script>
```

## Use of Unicode Characters / UTF-8:

The 14 standard fonts in PDF are limited to the ASCII-codepage. If you want to use UTF-8 you have to integrate a
custom font, which provides the needed glyphs. jsPDF supports .ttf-files. So if you want to have for example
Chinese text in your pdf, your font has to have the necessary Chinese glyphs. So, check if your font supports
the wanted glyphs or else it will show garbled characters instead of the right text.

To add the font to jsPDF use our fontconverter in
[/fontconverter/fontconverter.html](https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html).
The fontconverter will create a js-file with the content of the provided ttf-file as base64 encoded string
and additional code for jsPDF. You just have to add this generated js-File to your project.
You are then ready to go to use setFont-method in your code and write your UTF-8 encoded text.

Alternatively you can just load the content of the \*.ttf file as a binary string using `fetch` or `XMLHttpRequest` and
add the font to the PDF file:

```js
const doc = new jsPDF();

const myFont = ... // load the *.ttf font file as binary string

// add the font to jsPDF
doc.addFileToVFS("MyFont.ttf", myFont);
doc.addFont("MyFont.ttf", "MyFont", "normal");
```

## Advanced Functionality

Since the merge with the [yWorks fork](https://github.com/yWorks/jsPDF) there are a lot of new features. However, some
of them are API breaking, which is why there is an API-switch between two API modes:

- In "compat" API mode, jsPDF has the same API as MrRio's original version, which means full compatibility with plugins.
  However, some advanced features like transformation matrices and patterns won't work. This is the default mode.
- In "advanced" API mode, jsPDF has the API you're used from the yWorks-fork version. This means the availability of
  all advanced features like patterns, FormObjects, and transformation matrices.

You can switch between the two modes by calling

```javascript
doc.advancedAPI(doc => {
  // your code
});
// or
doc.compatAPI(doc => {
  // your code
});
```

JsPDF will automatically switch back to the original API mode after the callback has run.

## Support

Please check if your question is already handled at Stackoverflow <https://stackoverflow.com/questions/tagged/jspdf>.
Feel free to ask a question there with the tag `jspdf`.

Feature requests, bug reports, etc. are very welcome as issues. Note that bug reports should follow these guidelines:

- A bug should be reported as an [mcve](https://stackoverflow.com/help/mcve)
- Make sure code is properly indented and [formatted](https://help.github.com/articles/basic-writing-and-formatting-syntax/#quoting-code) (Use ``` around code blocks)
- Provide a runnable example.
- Try to make sure and show in your issue that the issue is actually related to jspdf and not your framework of choice.

## Contributing

jsPDF cannot live without help from the community! If you think a feature is missing or you found a bug, please consider
if you can spare one or two hours and prepare a pull request. If you're simply interested in this project and want to
help, have a look at the open issues, especially those labeled with "bug".

You can find information about building and testing jsPDF in the
[contribution guide](https://github.com/MrRio/jsPDF/blob/master/CONTRIBUTING.md#pull-requests)

## Credits

- Big thanks to Daniel Dotsenko from [Willow Systems Corporation](https://github.com/willowsystems) for making huge contributions to the codebase.
- Thanks to Ajaxian.com for [featuring us back in 2009](http://ajaxian.com/archives/dynamically-generic-pdfs-with-javascript).
- Our special thanks to GH Lee ([sphilee](https://github.com/sphilee)) for programming the ttf-file-support and providing a large and long sought after feature
- Everyone else that's contributed patches or bug reports. You rock.

## License (MIT)

Copyright
(c) 2010-2020 James Hall, https://github.com/MrRio/jsPDF
(c) 2015-2020 yWorks GmbH, https://www.yworks.com/

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
