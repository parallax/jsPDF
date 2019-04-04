var doc = new jsPDF({ filters: ['ASCIIHexEncode'] });
var AmiriRegular = doc.loadFile('spec/reference/Amiri-Regular.ttf')
doc.addFileToVFS("Amiri-Regular.ttf", AmiriRegular);
doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');

doc.setFont('Amiri'); // set font
doc.setFontSize(50);

var arabicText = "إذا لم تستح فاصنع ما شئت";

doc.text(arabicText, 10, 60);