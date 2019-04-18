
/* global describe, it, jsPDF, comparePdf, expect */
/**
 * Standard spec tests
 */

describe('Module: Autoprint', () => {
  it('should generate an autoprinting document with non-conform variant ', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.autoPrint()
    comparePdf(doc.output(), 'autoprint-nc.pdf', 'autoprint')
  })
  it('should generate an autoprinting document with javascript variant', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.autoPrint({variant: 'javascript'})
    comparePdf(doc.output(), 'autoprint-js.pdf', 'autoprint')
  })
})
