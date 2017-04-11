#jsPDF table_2

**Alternative fromHTML table renderer**

* introduces table_2() method, an alternative implementation to jsPDFAPI.table()
* relies on DOM to parse the HTML table
* no specific HTML table headers required
* must be enabled in config, otherwise legacy jsPDFAPI.table() is used

supports:

* colspan and rowspan
* font weight
* text align
* row background color

**Example code, how to enable table_2 renderer:**

```javascript
    var pdf = new jsPDF('p','pt','a4'); //orientation, unit, format

    var margins = {
      top: 50,
      bottom: 50,
      left: 20,
      width: 500
      };
      
    pdf.fromHTML(
          myHtml // HTML string or DOM elem ref.
        , margins.left // x coord
        , 100 // y coord
        , {
            'width'             : margins.width, // max width of content on PDF
            'table_2'           : true,
            'table_2_scaleBasis': 'font', // 'font' or 'width'
            'table_2_fontSize'  : 9
          },
        function (dispose) {
          pdf.save('Example.pdf');
        },
        margins
    )
```

**Configuration parameters**

name: table_2  
values: true or false  
purpose: Enable or disable table_2 usage.  

name: table_2_scaleBasis  
values: 'font' or 'width'  
purpose: Sets the basis for table scaling. Table is scaled according to font size or page width.  

name: table_2_fontSize  
values: integer  
purpose: Sets the table font size.  

**License**

## Credits
- Big thanks to Daniel Dotsenko from [Willow Systems Corporation](http://willow-systems.com) for making huge contributions to the codebase.
- Thanks to Ajaxian.com for [featuring us back in 2009](http://ajaxian.com/archives/dynamically-generic-pdfs-with-javascript).
- Everyone else that's contributed patches or bug reports. You rock.

## License (MIT)
Copyright (c) 2010-2016 James Hall, https://github.com/MrRio/jsPDF

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
