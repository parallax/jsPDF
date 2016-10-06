'use strict'
/* global describe, it, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe('Drawing functions', () => {
  it('should draw a closed annotation', () => {
    const doc = jsPDF()
    doc.createAnnotation({
      type: 'text',
      title: 'note',
      bounds: {
        x: 10,
        y: 10,
        w: 200,
        h: 80
      },
      contents: 'This is text annotation (closed by default)',
      open: false
    })
    comparePdf(doc.output(), 'closed.pdf', 'annotations')
  })
  it('should draw an open annotation', () => {
    const doc = jsPDF()
    doc.createAnnotation({
      type: 'text',
      title: 'note',
      bounds: {
        x: 10,
        y: 10,
        w: 200,
        h: 80
      },
      contents: 'This is text annotation (open by default)',
      open: true
    })
    comparePdf(doc.output(), 'open.pdf', 'annotations')
  })
  it('should draw a free text annotation', () => {
    const doc = jsPDF()
    doc.createAnnotation({
      type: 'freetext',
      bounds: {
        x: 0,
        y: 10,
        w: 200,
        h: 20
      },
      contents: 'This is a freetext annotation',
      color: '#ff0000'
    })
    comparePdf(doc.output(), 'freetext.pdf', 'annotations')
  })
})
