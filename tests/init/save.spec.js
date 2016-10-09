'use strict'
/* global describe, xit, it, jsPDF, comparePdf, jasmine, expect */
/**
 * Standard spec tests
 */

describe('Output', () => {
  it('should save a document', () => {
    const doc = jsPDF({
      compress: true
    })
    doc.text(10, 10, 'This is a test')
    doc.save('output.pdf')
  })
})
