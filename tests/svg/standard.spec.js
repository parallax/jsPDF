'use strict'
/* global describe, it, jsPDF, comparePdf, expect */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe('SVG', () => {
  it('should render a simple black box', () => {
    const doc = jsPDF()
    doc.svg(`<svg width="120" height="120" viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg">

      <rect x="0" y="0" width="100" height="100"/>
    </svg>`)
    comparePdf(doc.output(), 'black-box.pdf', 'svg')
  })
  it('should render a simple black box offset by 20', () => {
    const doc = jsPDF()
    doc.svg(`<svg width="120" height="120" viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg">

      <rect x="0" y="0" width="100" height="100"/>
    </svg>`, {
      x: 20,
      y: 20
    })
    comparePdf(doc.output(), 'black-box-offset.pdf', 'svg')
  })
  it('should render SVG from the page', () => {
    const doc = jsPDF()
    document.body.innerHTML = `<svg class="svg" width="120" height="120" viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg">

      <rect x="0" y="0" width="100" height="100"/>
    </svg>`
    doc.svg(document.querySelector('.svg'), {
      x: 20,
      y: 20
    })
    comparePdf(doc.output(), 'black-box-offset-dom.pdf', 'svg')
  })
})
