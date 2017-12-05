'use strict'
/* global describe, it, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe('Outline functions', () => {
  it('should create a bookmark in a pdf generated with units in points', () => {
    const doc = jsPDF({unit: 'pt'})
    doc.outline.add(null, "Page 1", {pageNumber:1});
    doc.addPage();

    comparePdf(doc.output(), 'bookmark-pt.pdf', 'outline')
  })

  // @TODO: Document
  it('should create a bookmark in a pdf generated with units in inches', () => {
    const doc = jsPDF({unit: 'in'})
    doc.outline.add(null, "Page 1", {pageNumber:1});
    doc.addPage();

    comparePdf(doc.output(), 'bookmark-in.pdf', 'outline')
  })

  // @TODO: Document
  it('should create a bookmark in a pdf generated with units in mm', () => {
    const doc = jsPDF({unit: 'mm'})
    doc.outline.add(null, "Page 1", {pageNumber:1});
    doc.addPage();

    comparePdf(doc.output(), 'bookmark-mm.pdf', 'outline')
  })

  // @TODO: Document
})
