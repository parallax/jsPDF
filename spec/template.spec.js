
/* global describe, xit, it, jsPDF, comparePdf, jasmine, expect */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe('Module: template', () => {
  var gotException = function(text) {
    var ex = new Error(text);
    return expect(console.error).toHaveBeenCalledWith(
      'jsPDF PubSub Error', 
      ex.message,
      ex
    );
  }

  beforeEach(function(){
    spyOn(console, 'error');
  })

  it('exception on pageAdd() before endTemplate', () => {
    const doc = jsPDF();
    doc.addPage();
    doc.beginTemplate('basic');
      doc.text("test", 10, 10);
    doc.endTemplate();

    doc.addPage();
    
    doc.beginTemplate('basic2');
      doc.text("test", 10, 10);

    doc.addPage();
    
    gotException('jsPDF.template: addPage is not supported before endTemplate has been called!');
  })

  it('exception on output() before endTemplate', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic');
      doc.text("test", 10, 10);
    doc.output()
    gotException('jsPDF.template: endTemplate has to be called before document can be saved!');
  })
  
  it('exception on duplicate template name', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic');
      doc.text("test", 10, 10);
    doc.endTemplate();
    expect(function(){
      doc.beginTemplate('basic')
    }).toThrow(
      new Error('jsPDF.beginTemplate: name is already used!')
    );
  })

  it('exception on template use without definition', () => {
    const doc = jsPDF();
    expect(function(){
      doc.useTemplate('test');
    }).toThrow(
      new Error('jsPDF.useTemplate: template by the name of "test" not found!')
    );
  })

  it('exception on ending without start', () => {
    const doc = jsPDF();
    expect(function(){
      doc.endTemplate();
    }).toThrow(
      new Error('jsPDF.endTemplate: call jsPDF.beginTemplate first!')
    );
  })

  it('exception on double template ending', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic');
      doc.text("test", 10, 10);
    doc.endTemplate();

    expect(function(){
      doc.endTemplate();
    }).toThrow(
      new Error('jsPDF.endTemplate: call jsPDF.beginTemplate first!')
    );
  })

  it('exception on invalid use of template', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic');
      doc.text("test", 10, 10);
    doc.endTemplate();
    expect(function(){
      doc.useTemplate('basic2', 10, 10)
    }).toThrow(
      new Error('jsPDF.useTemplate: template by the name of "basic2" not found!')
    );

    doc.beginTemplate('basic2');
    expect(function(){
      doc.useTemplate('basic2', 10, 10);
    }).toThrow(
      new Error('jsPDF.useTemplate: you have to call endTemplate before you can use the template!')
    );
  })

  it('simple unused template', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic');
      doc.text("test", 10, 10);
    doc.endTemplate();
    comparePdf(doc.output(), 'template-basic-unused.pdf', 'template')
  })

  it('simple used template', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic');
      doc.text("test", 10, 10);
    doc.endTemplate();
    
    doc.useTemplate('basic', 10, 10);
    comparePdf(doc.output(), 'template-basic-used.pdf', 'template')
  })

  it('simple unnamed template', () => {
    const doc = jsPDF();
    var name = doc.beginTemplate();
      doc.text("test", 10, 10);
    doc.endTemplate();
    
    doc.useTemplate(name, 10, 10);
    comparePdf(doc.output(), 'template-basic-name.pdf', 'template')
  })

  it('simple custom-size template', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic', 20, 25);
      doc.text("1234567890", 10, 10);
    doc.endTemplate();
    
    var size = doc.useTemplate('basic', 10, 10);
    expect(size.width).toBeCloseTo(20);
    expect(size.height).toBeCloseTo(25);
    comparePdf(doc.output(), 'template-basic-size.pdf', 'template')
  })

  it('simple restore bbox test', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic', 20, 20);
      doc.text("12345678901234567890", 10, 10);
    doc.endTemplate();
    doc.text("12345678901234567890", 10, 10);
    
    doc.useTemplate('basic', 15, 15);
    comparePdf(doc.output(), 'template-basic-bbox.pdf', 'template')
  })

  it('simple scale test', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic', 20, 20);
      doc.setDrawColor(0);
      doc.setFillColor(255,0,0);
      doc.rect(0, 0, 10, 10, 'FD');
    doc.endTemplate();
    
    var s1 = doc.useTemplate('basic', 10, 10);
    var s2 = doc.useTemplate('basic', 10, 30, 2);
    var s3 = doc.useTemplate('basic', 10, 50, 2, .5);
    expect(s2.width).toBeCloseTo(40);
    expect(s2.height).toBeCloseTo(40);
    expect(s3.width).toBeCloseTo(40);
    expect(s3.height).toBeCloseTo(10);
    comparePdf(doc.output(), 'template-basic-scale.pdf', 'template')
  })

  it('rotate & scale test', () => {
		const doc = jsPDF();
		doc.beginTemplate('basic', 20, 20);
      doc.setDrawColor(0);
			doc.rect(0, 0, 19, 19, 'S');
      doc.setFillColor(255,0,0);
			doc.rect(5, 5, 10, 10, 'FD');
			doc.text("A", 10, 10);
    doc.endTemplate();
		
		doc.setDrawColor(0);
		doc.setFillColor(0,0,255);
		var sx = 2;
		var sy = 3;
		doc.rect(50, 50, 10 * sx * Math.sqrt(2), 10 * sy * Math.sqrt(2), 'FD');
		
		for(var i = 0; i <= 90; i+= 9) {
			var s1 = doc.useTemplate('basic', 50 - 5*sx, 50 - 5*sy, sx, sy, i);
			expect(s1.width).toBeCloseTo(20 * sx);
			expect(s1.height).toBeCloseTo(20 * sy);
		}
    comparePdf(doc.output(), 'template-basic-rotate.pdf', 'template')
	})
	
	it('multi used-template', () => {
    const doc = jsPDF();
		doc.beginTemplate('basic');
			doc.setFont("helvetica");
			doc.setFontType("bold");
			doc.text("test", 10, 10);

			doc.setFont("courier");
			doc.setFontType("bolditalic");
			doc.setFontSize(32);
			doc.text("test", 10, 32);
		doc.endTemplate();
    
    doc.useTemplate('basic', 100, 100);
    doc.useTemplate('basic', 100, 200);
    doc.addPage();
    doc.useTemplate('basic', 100, 100);
    comparePdf(doc.output(), 'template-basic-2P.pdf', 'template')
  })

  it('stacked templates', () => {
    const doc = jsPDF();

    doc.beginTemplate('tpl1');
      doc.text("TPL1", 10, 10);
    doc.endTemplate();
    
    doc.beginTemplate('tpl2');
      doc.useTemplate('tpl1', 0, 0);
      doc.text("TPL2", 50, 10);
    doc.endTemplate();
    
    doc.beginTemplate('tpl3');
      doc.useTemplate('tpl2', 0, 0);
      doc.beginTemplate('tplSub');
        doc.text("Tpl Sub", 90, 10);
      doc.endTemplate();
      doc.useTemplate('tplSub',20, 0);
      doc.useTemplate('tplSub',40, 0);
    doc.endTemplate();
    
    doc.useTemplate('tpl1', 10, 10);
    doc.useTemplate('tpl1', 10, 20);
    doc.useTemplate('tpl2', 10, 30);
    doc.useTemplate('tpl3', 10, 40);
    
    comparePdf(doc.output(), 'template-stacked.pdf', 'template')
  })

	it('embed page with templates', () => {
		const doc = jsPDF();
		var mediaBox = doc.internal.getPageInfo(1).pageContext.mediaBox;
		var height = (mediaBox.topRightY - mediaBox.bottomLeftY)/doc.internal.scaleFactor;
		var width  = (mediaBox.topRightX - mediaBox.bottomLeftX)/doc.internal.scaleFactor;
		
		width = 215.9;
    doc.beginTemplate('p1');
			doc.text(20, 20, 'Hello world!');
			doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF. (page one)');
			doc.rect(5, 5, width-10, height-10);
		doc.endTemplate();
		doc.useTemplate('p1');
		
		doc.addPage();
		
		doc.beginTemplate('p2');
			doc.text(20, 20, 'Do you like that? (page two)');
			doc.rect(5, 5, width-10, height-10);
		doc.endTemplate();
		doc.useTemplate('p2');

		doc.addPage();
		doc.useTemplate('p1', width, height/2, width/height, width/height, 90);
		doc.useTemplate('p2', 0, height/2, width/height, width/height, -90);

		comparePdf(doc.output(), 'template-embed-page.pdf', 'template')
	})

	it('templates with transform', () => {
		const doc = jsPDF();
		
    doc.beginTemplate('p1', 60, 60);
			doc.text(20, 20, 'Hello world!');
			doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF. (page one)');
			doc.rect(5, 5, 20, 20);
		doc.endTemplate();

		var tm = new doc.Matrix(3, 0, 0, 5, 
			doc.scale(10),
			doc.getPageHeight() - doc.scale(100)
		);
		doc.useTemplate('p1', tm);

		comparePdf(doc.output(), 'template-transform.pdf', 'template')
	})
})
