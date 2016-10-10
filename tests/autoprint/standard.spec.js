'use strict'
/* global describe, it, jsPDF, comparePdf, expect */
/**
 * Standard spec tests
 */

describe('Autoprint', () => {
  it('should generate an autoprinting document', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.autoPrint()
    comparePdf(doc.output(), 'autoprint.pdf', 'autoprint')
  })
})
