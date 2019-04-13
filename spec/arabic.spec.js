/* global describe, it, loadBinaryResource, jsPDF, comparePdf */

describe('Module: Unicode: Arabic', function () {
  //https://fonts.google.com/specimen/Amiri?selection.family=Amiri
  return;
  var AmiriRegular = loadBinaryResource('reference/Amiri-Regular.ttf')

  it('simple pdf with arabic text', function () {

    const doc = new jsPDF({ filters: ['ASCIIHexEncode'], putOnlyUsedFonts: true });

    doc.addFileToVFS("Amiri-Regular.ttf", AmiriRegular);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');

    doc.setFont('Amiri'); // set font
    doc.setFontSize(50);
    
    var arabicText = "إذا لم تستح فاصنع ما شئت";
    
    doc.text(arabicText, 10, 60);

    comparePdf(doc.output(), 'arabic.pdf', 'unicode')

  });

  it('simple pdf with arabic text, right aligned', function () {

    const doc = new jsPDF({ filters: ['ASCIIHexEncode'], putOnlyUsedFonts: true });

    doc.addFileToVFS("Amiri-Regular.ttf", AmiriRegular);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');

    doc.setFont('Amiri'); // set font
    doc.setFontSize(10);

    doc.text(["إذا لم تستح فاصنع ما شئت", "إذا لم تستح", "فاصنع ما شئت"], 200, 10, { align: 'right' });

    comparePdf(doc.output(), 'arabic-3lines-right.pdf', 'unicode')

  });
})
