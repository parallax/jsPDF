
/* global describe, xit, it, jsPDF, comparePdf, jasmine, expect */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe('jsPDF unit tests', () => {
  it('jsPDF private function getPDFVersion', () => {
    const doc = new jsPDF(); 
    expect(doc.internal.getPDFVersion()).toEqual('1.3');
    expect(doc.__private__.getPdfVersion()).toEqual('1.3');
  })
  
  it('jsPDF private function setPDFVersion', () => {
    const doc = new jsPDF();
    expect(doc.__private__.getPdfVersion()).toEqual('1.3');
    doc.__private__.setPdfVersion('1.5');
    expect(doc.__private__.getPdfVersion()).toEqual('1.5');
  })
  
  it('jsPDF private function getPageFormats', () => {
    const doc = new jsPDF(); 
    expect(Object.keys(doc.__private__.getPageFormats()).length).toEqual(41);
  })
  
  it('jsPDF private function getPageFormat', () => {
    const doc = new jsPDF(); 
    expect(doc.__private__.getPageFormat('a4')[0]).toEqual(595.28);
    expect(doc.__private__.getPageFormat('a4')[1]).toEqual(841.89);
  })
  
  it('jsPDF private function f2', () => {
    const doc = new jsPDF(); 
    expect(doc.__private__.f2(2.22222)).toEqual('2.22');
	
    expect(function() {doc.__private__.f2('invalid');}).toThrow(new Error('Invalid arguments passed to jsPDF.f2')); 
  })
  
  it('jsPDF private function f3', () => {
    const doc = new jsPDF(); 
    expect(doc.__private__.f3(2.22222)).toEqual('2.222');
	
    expect(function() {doc.__private__.f3('invalid');}).toThrow(new Error('Invalid arguments passed to jsPDF.f3')); 
  })
  
  it('jsPDF private function getFileId, setFileId', () => {
    const doc = new jsPDF(); 
    doc.__private__.setFileId('0000000000000000000000000BADFACE')
    expect(doc.__private__.getFileId()).toEqual('0000000000000000000000000BADFACE');
  })
  
  it('jsPDF public function getFileId, setFileId', () => {
    const doc = new jsPDF(); 
    doc.setFileId('0000000000000000000000000BADFACE')
    expect(doc.getFileId()).toEqual('0000000000000000000000000BADFACE');
  })
  
  
  it('jsPDF private function getCreationDate', () => {
    const doc = jsPDF();
    var regexPDFCreationDate = (/^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|\-0[0-9]|\-1[0-1])\'(0[0-9]|[1-5][0-9])\'?$/);

    expect(regexPDFCreationDate.test(doc.__private__.setCreationDate())).toEqual(true);

    var creationDate = new Date();
    doc.__private__.setCreationDate(creationDate);
    expect(doc.__private__.getCreationDate("jsDate").getFullYear()).toEqual(creationDate.getFullYear());
    expect(doc.__private__.getCreationDate("jsDate").getMonth()).toEqual(creationDate.getMonth());
    expect(doc.__private__.getCreationDate("jsDate").getDate()).toEqual(creationDate.getDate());
    expect(doc.__private__.getCreationDate("jsDate").getHours()).toEqual(creationDate.getHours());
    expect(doc.__private__.getCreationDate("jsDate").getMinutes()).toEqual(creationDate.getMinutes());
    expect(doc.__private__.getCreationDate("jsDate").getSeconds()).toEqual(creationDate.getSeconds());

  });
  
  it('jsPDF private function setCreationDate', () => {
    const doc = jsPDF();
    var creationDate = new Date(1987,11,10,0,0,0);
    var pdfDateString = "D:19871210000000+00'00'";
    doc.__private__.setCreationDate(pdfDateString);
    expect(doc.__private__.getCreationDate("jsDate").getFullYear()).toEqual(creationDate.getFullYear());
    expect(doc.__private__.getCreationDate("jsDate").getMonth()).toEqual(creationDate.getMonth());
    expect(doc.__private__.getCreationDate("jsDate").getDate()).toEqual(creationDate.getDate());
    expect(doc.__private__.getCreationDate("jsDate").getHours()).toEqual(creationDate.getHours());
    expect(doc.__private__.getCreationDate("jsDate").getMinutes()).toEqual(creationDate.getMinutes());
    expect(doc.__private__.getCreationDate("jsDate").getSeconds()).toEqual(creationDate.getSeconds());

    expect(function() {doc.__private__.setCreationDate('invalid');}).toThrow(new Error('Invalid argument passed to jsPDF.setCreationDate')); 
  });
  
  it('jsPDF public function getCreationDate', () => {
    const doc = jsPDF();
    var creationDate = new Date();
    doc.setCreationDate(creationDate);
    expect(doc.getCreationDate("jsDate").getFullYear()).toEqual(creationDate.getFullYear());
    expect(doc.getCreationDate("jsDate").getMonth()).toEqual(creationDate.getMonth());
    expect(doc.getCreationDate("jsDate").getDate()).toEqual(creationDate.getDate());
    expect(doc.getCreationDate("jsDate").getHours()).toEqual(creationDate.getHours());
    expect(doc.getCreationDate("jsDate").getMinutes()).toEqual(creationDate.getMinutes());
    expect(doc.getCreationDate("jsDate").getSeconds()).toEqual(creationDate.getSeconds());
  });
  
  it('jsPDF public function setCreationDate', () => {
    const doc = jsPDF();
    var creationDate = new Date(1987,11,10,0,0,0);
    var pdfDateString = "D:19871210000000+00'00'";
    doc.setCreationDate(pdfDateString);
    expect(doc.getCreationDate("jsDate").getFullYear()).toEqual(creationDate.getFullYear());
    expect(doc.getCreationDate("jsDate").getMonth()).toEqual(creationDate.getMonth());
    expect(doc.getCreationDate("jsDate").getDate()).toEqual(creationDate.getDate());
    expect(doc.getCreationDate("jsDate").getHours()).toEqual(creationDate.getHours());
    expect(doc.getCreationDate("jsDate").getMinutes()).toEqual(creationDate.getMinutes());
    expect(doc.getCreationDate("jsDate").getSeconds()).toEqual(creationDate.getSeconds());
  });
  
  it('jsPDF private function padd2', () => {
    const doc = jsPDF();
    expect(doc.__private__.padd2(2)).toEqual('02');
    expect(doc.__private__.padd2(23)).toEqual('23');
    expect(doc.__private__.padd2(234)).toEqual('34');
  });
  
  it('jsPDF private function out', () => {
    const doc = jsPDF();
    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    writeArray = doc.__private__.out(2);
    expect(writeArray[0]).toEqual('2');
	
    doc.__private__.resetCustomOutputDestination();
  });
  
  
  it('jsPDF private function pdfEscape', () => {
    const doc = jsPDF();
    expect(doc.__private__.pdfEscape('Test')).toEqual('Test');
    expect(doc.__private__.pdfEscape('(Test')).toEqual('\\(Test');
    expect(doc.__private__.pdfEscape('(Test)')).toEqual('\\(Test\\)');
    expect(doc.__private__.pdfEscape("\\Test")).toEqual("\\\\Test");
    expect(doc.__private__.pdfEscape("\\(Test")).toEqual('\\\\\\(Test');
	
    doc.__private__.resetCustomOutputDestination();
  });
  
  
  
  it('jsPDF private function getArrayBuffer', () => {
    const doc = jsPDF();
    expect(doc.__private__.getArrayBuffer('A').byteLength).toEqual(1);
  });
  
  it('jsPDF private function getStandardFonts', () => {
    const doc = jsPDF()
    const fontList = doc.__private__.getStandardFonts();
    expect(fontList).toEqual([
      ['Helvetica', "helvetica", "normal", 'WinAnsiEncoding'],
      ['Helvetica-Bold', "helvetica", "bold", 'WinAnsiEncoding'],
      ['Helvetica-Oblique', "helvetica", "italic", 'WinAnsiEncoding'],
      ['Helvetica-BoldOblique',"helvetica", "bolditalic", 'WinAnsiEncoding'],
      ['Courier', "courier", "normal", 'WinAnsiEncoding'],
      ['Courier-Bold', "courier", "bold", 'WinAnsiEncoding'],
      ['Courier-Oblique', "courier", "italic", 'WinAnsiEncoding'],
      ['Courier-BoldOblique', "courier", "bolditalic", 'WinAnsiEncoding'],
      ['Times-Roman', "times", "normal", 'WinAnsiEncoding'],
      ['Times-Bold', "times", "bold", 'WinAnsiEncoding'],
      ['Times-Italic', "times", "italic", 'WinAnsiEncoding'],
      ['Times-BoldItalic', "times", "bolditalic", 'WinAnsiEncoding'],
      ['ZapfDingbats', "zapfdingbats", "normal", null],
      ['Symbol', "symbol", "normal", null]
    ])
  })
  
  it('jsPDF private function setZoomMode, getZoomMode', () => {
    const doc = jsPDF();
    doc.__private__.setZoomMode(2);
    expect(doc.__private__.getZoomMode()).toEqual(2);
    doc.__private__.setZoomMode('200%');
    expect(doc.__private__.getZoomMode()).toEqual('200%');
    doc.__private__.setZoomMode('fullwidth');
    expect(doc.__private__.getZoomMode()).toEqual('fullwidth');
    doc.__private__.setZoomMode('fullheight');
    expect(doc.__private__.getZoomMode()).toEqual('fullheight');
    doc.__private__.setZoomMode('original');
    expect(doc.__private__.getZoomMode()).toEqual('original');
    expect(function() {doc.__private__.setZoomMode('invalid');}).toThrow(new Error('zoom must be Integer (e.g. 2), a percentage Value (e.g. 300%) or fullwidth, fullheight, fullpage, original. "invalid" is not recognized.')); 
  });

  it('jsPDF private function setLayoutMode, getLayoutMode', () => {
    const doc = jsPDF();
    doc.__private__.setLayoutMode('continuous');
    expect(doc.__private__.getLayoutMode()).toEqual('continuous');
    expect(function() {doc.__private__.setLayoutMode('invalid');}).toThrow(new Error('Layout mode must be one of continuous, single, twoleft, tworight. "invalid" is not recognized.')); 
  });

  it('jsPDF private function setPageMode, getPageMode', () => {
    const doc = jsPDF();
    doc.__private__.setPageMode('UseNone');
    expect(doc.__private__.getPageMode()).toEqual('UseNone');
    expect(function() {doc.__private__.setPageMode('invalid');}).toThrow(new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "invalid" is not recognized.')); 
  });
  
  
  it('jsPDF private function setDisplayMode', () => {
    const doc = jsPDF();
    doc.__private__.setDisplayMode('200%', 'continuous', 'UseNone');
    expect(doc.__private__.getZoomMode()).toEqual('200%');
    expect(doc.__private__.getLayoutMode()).toEqual('continuous');
    expect(doc.__private__.getPageMode()).toEqual('UseNone');
  });
  
  it('jsPDF private function generateColorString', () => {
    const doc = jsPDF();
    expect(doc.__private__.generateColorString({ch1: 255, ch2: 0, ch3: 0})).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.generateColorString({ch1: 255, ch2: 0, ch3: 0, precision: 2})).toEqual('1.00 0.00 0.00 rg');
    expect(doc.__private__.generateColorString({ch1: 255, ch2: 0, ch3: 0, precision: 3})).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.generateColorString({ch1: 'red'})).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.generateColorString({ch1: '#f00'})).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.generateColorString({ch1: '#ff0000'})).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.generateColorString('red')).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.generateColorString('#f00')).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.generateColorString('#ff0000')).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.generateColorString('gray')).toEqual('0.502 g');
    expect(function() {doc.__private__.generateColorString('invalid');}).toThrow(new Error('Invalid color "invalid" passed to jsPDF.generateColorString.')); 
  });

  it('jsPDF private function getDocumentProperty, setDocumentProperty', () => {
    const doc = jsPDF();
    doc.__private__.setDocumentProperty('title', 'Title');
    expect(doc.__private__.getDocumentProperty('title')).toEqual('Title'); 
	
    expect(function() {doc.__private__.setDocumentProperty('invalid', 'Title');}).toThrow(new Error('Invalid arguments passed to jsPDF.setDocumentProperty')); 
    expect(function() {doc.__private__.getDocumentProperty('invalid');}).toThrow(new Error('Invalid argument passed to jsPDF.getDocumentProperty')); 
  });

  it('jsPDF private function getDocumentProperties, setDocumentProperties', () => {
    const doc = jsPDF();
    doc.__private__.setDocumentProperties({'title': 'Title'});
    expect(doc.__private__.getDocumentProperty('title')).toEqual('Title'); 

    expect(doc.__private__.getDocumentProperties()).toEqual({
      'title': 'Title',
      'subject': '',
      'author': '',
      'keywords': '',
      'creator': ''
    }); 

    // expect(function() {doc.__private__.setDocumentProperty('invalid', 'Title');}).toThrow(new Error('Invalid arguments passed to jsPDF.setDocumentProperty')); 
  });
  
  it('jsPDF private function isValidStyle', () => {
    const doc = jsPDF();

    expect(doc.__private__.isValidStyle('F')).toEqual(true); 
    expect(doc.__private__.isValidStyle('S')).toEqual(true); 
    expect(doc.__private__.isValidStyle('DF')).toEqual(true); 
    expect(doc.__private__.isValidStyle('X')).toEqual(false); 

  });
  it('jsPDF private function getStyle', () => {
    const doc = jsPDF();

    expect(doc.__private__.getStyle('F')).toEqual('f'); 
    expect(doc.__private__.getStyle('X')).toEqual('S'); 
    expect(doc.__private__.getStyle('S')).toEqual('S'); 
    expect(doc.__private__.getStyle('FD')).toEqual('B'); 
    expect(doc.__private__.getStyle('DF')).toEqual('B'); 
    expect(doc.__private__.getStyle('f')).toEqual('f'); 
    expect(doc.__private__.getStyle('f*')).toEqual('f*'); 
    expect(doc.__private__.getStyle('B')).toEqual('B'); 
    expect(doc.__private__.getStyle('B*')).toEqual('B*'); 

  });

  
  it('jsPDF private function line', () => {
    const doc = jsPDF();

    expect(function() {doc.__private__.line(1,2,3,4);}).not.toThrow(new Error('Invalid arguments passed to jsPDF.line')); 
    expect(function() {doc.__private__.line('invalid',2,3,4);}).toThrow(new Error('Invalid arguments passed to jsPDF.line')); 
    expect(function() {doc.__private__.line(1,'invalid',3,4);}).toThrow(new Error('Invalid arguments passed to jsPDF.line')); 
    expect(function() {doc.__private__.line(1,2,'invalid',4);}).toThrow(new Error('Invalid arguments passed to jsPDF.line')); 
    expect(function() {doc.__private__.line(1,2,3,'invalid');}).toThrow(new Error('Invalid arguments passed to jsPDF.line')); 

  });

  it('jsPDF private function triangle', () => {
    const doc = jsPDF();

    expect(function() {doc.__private__.triangle(1,2,3,4,5,6, 'F');}).not.toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle('invalid',2,3,4,5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle(1,'invalid',3,4,5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle(1,2,'invalid',4,5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle(1,2,3,'invalid',5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle(1,2,3,4,'invalid',6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle(1,2,3,4,5,'invalid', 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle(1,2,3,4,5,6, 'invalid');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 

    expect(doc.__private__.triangle(1,2,3,4,5,6, 'F')).toBe(doc.__private__); 
  });
  
  it('jsPDF private function roundedRect', () => {
    const doc = jsPDF();

    expect(function() {doc.__private__.roundedRect(1,2,3,4,5,6, 'F');}).not.toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect('undefined',2,3,4,5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect(1,'undefined',3,4,5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect(1,2,'undefined',4,5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect(1,2,3,'undefined',5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect(1,2,3,4,'undefined',6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect(1,2,3,4,5,'undefined', 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect(1,2,3,4,5,6, 'undefined');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 

    expect(doc.__private__.roundedRect(1,2,3,4,5,6, 'F')).toBe(doc.__private__); 
  });
  
  it('jsPDF private function ellipse', () => {
    const doc = jsPDF();

    expect(function() {doc.__private__.ellipse(1,2,3,4, 'F');}).not.toThrow(new Error('Invalid arguments passed to jsPDF.ellipse')); 
    expect(function() {doc.__private__.ellipse('undefined',2,3,4, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.ellipse')); 
    expect(function() {doc.__private__.ellipse(1,'undefined',3,4, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.ellipse')); 
    expect(function() {doc.__private__.ellipse(1,2,'undefined',4, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.ellipse')); 
    expect(function() {doc.__private__.ellipse(1,2,3,'undefined', 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.ellipse')); 
    expect(function() {doc.__private__.ellipse(1,2,3,4, 'undefined');}).toThrow(new Error('Invalid arguments passed to jsPDF.ellipse')); 


    expect(doc.__private__.ellipse(1,2,3,4, 'F')).toBe(doc.__private__); 

    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.ellipse(1,2,3,4, null);
	expect(writeArray).toEqual(['11.34 836.22 m 11.34 842.48 7.53 847.56 2.83 847.56 c', '-1.86 847.56 -5.67 842.48 -5.67 836.22 c', '-5.67 829.96 -1.86 824.88 2.83 824.88 c', '7.53 824.88 11.34 829.96 11.34 836.22 c']);
	writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.ellipse(1,2,3,4, 'F');
	expect(writeArray).toEqual(['11.34 836.22 m 11.34 842.48 7.53 847.56 2.83 847.56 c', '-1.86 847.56 -5.67 842.48 -5.67 836.22 c', '-5.67 829.96 -1.86 824.88 2.83 824.88 c', '7.53 824.88 11.34 829.96 11.34 836.22 c', 'f']);
  });

  it('jsPDF private function circle', () => {
    const doc = jsPDF();

    expect(function() {doc.__private__.circle(1,2,3, 'F');}).not.toThrow(new Error('Invalid arguments passed to jsPDF.circle')); 
    expect(function() {doc.__private__.circle('undefined',2,3, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.circle')); 
    expect(function() {doc.__private__.circle(1,'undefined',3, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.circle')); 
    expect(function() {doc.__private__.circle(1,2,'undefined', 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.circle')); 
    expect(function() {doc.__private__.circle(1,2,3,'undefined');}).toThrow(new Error('Invalid arguments passed to jsPDF.circle')); 

    expect(doc.__private__.circle(1,2,3, 'F')).toBe(doc.__private__); 
  });

  
  it('jsPDF private function text', () => {
    var doc = jsPDF();

	var writeArray;
	
	//check for latest method header (text, x, y, options);
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text('This is a test.', 10, 10, {scope: doc});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
	//check for old method header (x, y, text);
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
	//check for angle-functionality;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, angle: 10});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '0.98 0.17 -0.17 0.98 28.35 813.54 Tm', '(This is a test.) Tj', 'ET'].join("\n")]);
	
	//check for charSpace-functionality;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, charSpace: 10});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '10 Tc', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
	//check for renderingMode-functionality - fill;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'fill'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '0 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 0});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '0 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: false});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '0 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
		
	//check for renderingMode-functionality - stroke;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'stroke'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '1 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 1});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '1 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: true});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '1 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
	//check for renderingMode-functionality - fillThenStroke;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'fillThenStroke'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '2 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 2});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '2 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
	//check for renderingMode-functionality - invisible;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'invisible'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '3 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 3});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '3 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
		
	//check for renderingMode-functionality - fillAndAddForClipping;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'fillAndAddForClipping'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '4 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 4});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '4 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
		
	//check for renderingMode-functionality - strokeAndAddPathForClipping;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'strokeAndAddPathForClipping'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '5 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 5});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '5 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
		
	//check for renderingMode-functionality - fillThenStrokeAndAddToPathForClipping;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'fillThenStrokeAndAddToPathForClipping'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '6 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 6});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '6 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
		
	//check for renderingMode-functionality - addToPathForClipping;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'addToPathForClipping'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '7 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 7});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '7 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
	
	//check for renderingMode-functionality - reset on second call;
	
    doc = jsPDF();
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'addToPathForClipping'});
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(10, 10, 'This is a test.', {scope: doc});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '0 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
	//check for align-functionality - center;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
	doc.__private__.text(200, 10, 'This is a test.', {scope: doc, align: 'right'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '472.85 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
	
	});
  
});