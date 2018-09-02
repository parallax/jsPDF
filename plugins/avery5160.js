/**
 * jsPDF Avery5160 Plugin
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

 /**
 * Makes the PDF Avery5160 (Or can be changed to 5260 or any other formate by changed page width and margin) print. This works in Chrome, Firefox, Acrobat
 * Reader.
 *
 * 
 * @name autoPrint
 * @example added in examples/avery5160.html
 * pass data to createlable function.
 */




  var doc = new jsPDF('p', 'pt', [595, 760]);
    //Dimension of A4 in pts: 595 × 710
    doc.setFontSize(6);
    var pageWidth = 595;
    var pageHeight = 760;
    var pageMargin = 30;
 

    pageWidth -= pageMargin * 2.5;
    pageHeight -= pageMargin * 2.5;

    var cellMargin = 5;
    var cellWidth = 190;
    var cellHeight = 72;

    var startX = pageMargin;
    var startY = pageMargin;
    var nextY = 0, nextYMargin = 8;


function createlabels(item) {

  // doc.getTextDimensions(item.Name); turncate or split string if you needed
  if (startY >= pageHeight)
{
  doc.addPage();
  startY = pageMargin // Restart height position
}
  

  doc.text(item.Name, startX, startY);
  doc.text(item.Email, startX, startY + 10);
  doc.text(item.Company, startX, startY + 20);

  var nextPosX = startX + cellWidth + cellMargin;

  if (nextPosX > pageWidth) {
    startX = pageMargin;
    startY += cellHeight;
  } else {
    startX = nextPosX;
  }

}


for (var i = 0; i < data.length; i++) {
  createlabels(data[i]);
}

doc.save('grid.pdf');



