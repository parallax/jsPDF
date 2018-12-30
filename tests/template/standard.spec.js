
/* global describe, xit, it, jsPDF, comparePdf, jasmine, expect */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe('Plugin: template', () => {
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

    expect(function(){
      doc.useTemplate('basic', 'x', 10);
    }).toThrow(
      new Error('jsPDF.useTemplate: Invalid coordinates passed')
    );
    expect(function(){
      doc.useTemplate('basic', 10, 'y');
    }).toThrow(
      new Error('jsPDF.useTemplate: Invalid coordinates passed')
    );
  })

  it('simple unused template', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic');
      doc.text("test", 10, 10);
    doc.endTemplate();
    comparePdf(doc.output(), 'basic-unused.pdf', 'template')
  })

  it('simple used template', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic');
      doc.text("test", 10, 10);
    doc.endTemplate();
    
    doc.useTemplate('basic', 10, 10);
    comparePdf(doc.output(), 'basic-used.pdf', 'template')
  })

  it('simple unnamed template', () => {
    const doc = jsPDF();
    var name = doc.beginTemplate();
      doc.text("test", 10, 10);
    doc.endTemplate();
    
    doc.useTemplate(name, 10, 10);
    comparePdf(doc.output(), 'basic-name.pdf', 'template')
  })

  it('simple custom-size template', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic', 20, 25);
      doc.text("1234567890", 10, 10);
    doc.endTemplate();
    
    var size = doc.useTemplate('basic', 10, 10);
    expect(size.width).toBeCloseTo(20);
    expect(size.height).toBeCloseTo(25);
    comparePdf(doc.output(), 'basic-size.pdf', 'template')
  })

  it('simple restore bbox test', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic', 20, 20);
      doc.text("12345678901234567890", 10, 10);
    doc.endTemplate();
    doc.text("12345678901234567890", 10, 10);
    
    doc.useTemplate('basic', 15, 15);
    comparePdf(doc.output(), 'basic-bbox.pdf', 'template')
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
    comparePdf(doc.output(), 'basic-scale.pdf', 'template')
  })

  it('multi used-template', () => {
    const doc = jsPDF();
    doc.beginTemplate('basic');
      doc.text("test", 10, 10);
    doc.endTemplate();
    
    doc.useTemplate('basic', 100, 100);
    doc.useTemplate('basic', 100, 200);
    doc.addPage();
    doc.useTemplate('basic', 100, 100);
    comparePdf(doc.output(), 'basic-2P.pdf', 'template')
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
    
    comparePdf(doc.output(), 'stacked.pdf', 'template')
  })

})
