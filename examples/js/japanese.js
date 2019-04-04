var doc = new jsPDF();
//https://www.freejapanesefont.com/mouhitsu-bold-font-download/
var MouhitsuBold = doc.loadFile('spec/reference/MouhitsuBold.ttf')

doc.addFileToVFS("MouhitsuBold.ttf", MouhitsuBold);
doc.addFont('MouhitsuBold.ttf', 'Mouhitsu', 'bold');
  
doc.setFont('Mouhitsu', 'bold'); // set font
doc.setFontSize(20);

doc.text("なに", 20, 20);
