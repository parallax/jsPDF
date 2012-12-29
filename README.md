#jsPDF - Generate PDF files in client-side JavaScript

You can [catch me on twitter](http://twitter.com/MrRio): [@MrRio](http://twitter.com/MrRio) or head over to [my company's website](http://snapshotmedia.co.uk) for consultancy. 

## Getting started

See examples/basic.html. Make sure you include BlobBuilder.js and FileSaver.js. You'll need to make sure you've pulled all the submodules.

```javascript

var doc = new jsPDF();
doc.text(20, 20, 'Hello world.');
doc.save('Test.pdf');
```

## License

(MIT License)

Copyright (c) 2010-2012 James Hall, https://github.com/MrRio/jsPDF

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