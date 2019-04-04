var doc = new jsPDF();
var PTSans = doc.loadFile('spec/reference/PTSans.ttf')
doc.addFileToVFS("PTSans.ttf", PTSans);
doc.addFont('PTSans.ttf', 'PTSans', 'normal');

doc.setFont('PTSans'); // set font
doc.setFontSize(10);
doc.text("А ну чики брики и в дамки!", 10, 10);