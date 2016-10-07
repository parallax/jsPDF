'use strict'
/* global describe, it, jsPDF, comparePdf, jasmine, expect */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe('jsPDF init display modes', () => {
  it('should set zoom mode to fullheight', () => {
    const doc = jsPDF()
    doc.setDisplayMode('fullheight')
    doc.text(10, 10, 'This is a test')
    doc.output()
    comparePdf(doc.output(), 'zoom-full-height.pdf', 'init')
  })

  it('should set zoom mode to fullpage', () => {
    const doc = jsPDF('landscape')
    doc.setDisplayMode('fullpage')
    doc.text(10, 10, 'This is a test')
    doc.output()
    comparePdf(doc.output(), 'zoom-full-page.pdf', 'init')
  })

  it('should set zoom mode to original', () => {
    const doc = jsPDF('landscape')
    doc.setDisplayMode('original')
    doc.text(10, 10, 'This is a test')
    doc.output()
    comparePdf(doc.output(), 'zoom-original.pdf', 'init')
  })

  it('should set zoom mode to 2x', () => {
    const doc = jsPDF('landscape')
    doc.setDisplayMode(2)
    doc.text(20, 20, 'This is a test')
    doc.output()
    comparePdf(doc.output(), 'zoom-2x.pdf', 'init')
  })

  it('should set zoom mode to 3x', () => {
    const doc = jsPDF('landscape')
    doc.setDisplayMode(3)
    doc.text(20, 20, 'This is a test')
    doc.output()
    comparePdf(doc.output(), 'zoom-3x.pdf', 'init')
  })

  it('should set zoom mode to 3x', () => {
    const doc = jsPDF('landscape')
    doc.setDisplayMode('300%')
    doc.text(20, 20, 'This is a test')
    doc.output()
    comparePdf(doc.output(), 'zoom-3x.pdf', 'init')
  })
})
