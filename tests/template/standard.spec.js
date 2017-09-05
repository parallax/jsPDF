'use strict'
/* global describe, xit, it, jsPDF, comparePdf, jasmine, expect */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe('plugin: Template', () => {
  it('should use template to generate a whole pdf', () => {
    const doc = new jsPDF()
    //Page 1
    doc.setTemplateVar("title", "FrontPage");
    
    //Page 2
    doc.addPage();
    doc.setTemplateVar("title", "Index");
    
    //Page 3
    doc.addPage();
    
    //Page 4
    doc.addPage();
    doc.setTemplateVar("title", "Content");
    
    //Page 5
    doc.addPage();
    
    //Page 6
    doc.addPage();
    
    //Page 7
    doc.addPage();
    doc.setTemplateVar("title", "Sources");
    
    //set Header on all pages and a footerline
    doc.template(doc, {}, function (doc, pageInfo){
        //header
        doc.setFontSize(22);
        doc.text(10,13, 'Company X');
        
        doc.setLineWidth(0.25);
        doc.line(10, 20, 200, 20);
        
        
        doc.setFontSize(16);
        doc.text(60, 13, doc.getTemplateVar("title"));
        
        //footerline
        doc.setLineWidth(0.25);
        doc.line(10, 285, 200, 285);        
    });
    
    //uppercase roman page numbers on page 2 and 3
    doc.template(doc, {range : { start: 2, end: 3 }, hasOwnRange : true, numberStyle : 'roman', letterCase : 'uppercase'}, function (doc, pageInfo){        
        doc.setFontSize(10);
        doc.text(10,292, 'Page ' + String(pageInfo.currentPageNumber) + ' of ' + String(pageInfo.endPageNumber));
    });
    
    
    //arabic page numbers on the pages 4 to 6
    doc.template(doc, {range : { start: 4, end : 6}, hasOwnRange : true, numberStyle : 'arabic'}, function (doc, pageInfo){
        doc.setFontSize(10);
        doc.text(10,292, 'Page ' + String(pageInfo.currentPageNumber) + ' of ' + String(pageInfo.endPageNumber));
    });
    
    //lowercase roman page numbers on the pages 7 and following
    doc.template(doc, {range : { start: 7}, hasOwnRange : true, numberStyle : 'roman', letterCase : 'lowercase'}, function (doc, pageInfo){
        doc.setFontSize(10);
        doc.text(10,292, 'Page ' + String(pageInfo.currentPageNumber) + ' of ' + String(pageInfo.endPageNumber));
    });
    
    comparePdf(doc.output(), 'test.pdf', 'template')
  })
})
