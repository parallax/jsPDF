
/* global describe, it, jsPDF, comparePdf */
/**
 * Standard spec tests
 */

describe('Module: SetLanguage', () => {
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
