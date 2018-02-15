'use strict'
/* global describe, it, jsPDF, comparePdf, expect */
/**
 * Standard spec tests
 */

describe('Plugin: setlanguage', () => {
  it('set english (US)', () => {
    const doc = new jsPDF();
    doc.setLanguage("en-US");
    
    comparePdf(doc.output(), 'enUS.pdf', 'setlanguage');
  });

  it('refuse non-existing-language', () => {
    const doc = new jsPDF();
    doc.setLanguage("zz");

    comparePdf(doc.output(), 'blank.pdf', 'text')
  });
})
