'use strict'
/* global describe, it, expect, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe('Paging functions', () => {
  it('should add new page', () => {
    const doc = jsPDF()
    doc.addPage()
    doc.addPage()
    doc.text('Text on the third page', 20, 20)
    doc.setPage(1)
    doc.text('Text on the first page', 20, 20)
    doc.setPage(2)
    doc.text('Text on the second page', 20, 20)

    comparePdf(doc.output(), 'set-page.pdf', 'pages')
  })
})
