'use strict'
/* global describe, xit, it, jsPDF, comparePdf, jasmine, expect */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe('jsPDF init options', () => {
  /**
   * @TODO: this document doesn't work, needs fixing, see #881
   */
  it('should make a compressed document', () => {
    const doc = jsPDF({
      compress: true
    })
    doc.text(10, 10, 'This is a test')
    doc.output()
    // comparePdf(doc.output(), 'compress.pdf', 'init')
  })

  // @TODO: Make sure this is what we want
  it('should silently fail compressing when adler32cs is not present', () => {
    delete window.adler32cs
    const doc = jsPDF({
      compress: true
    })
    doc.text(10, 10, 'This is a test')
    doc.output()
  })

  it('should make a landscape document', () => {
    const doc = jsPDF({
      orientation: 'landscape'
    })
    doc.text(10, 10, 'This is a test!')
    comparePdf(doc.output(), 'landscape.pdf', 'init')
  })

  it('should set document properties', () => {
    const doc = jsPDF()
    doc.setProperties({
      title: 'Title',
      subject: 'This is the subject',
      author: 'James Hall',
      keywords: 'generated, javascript, parallax',
      creator: 'jsPDF'
    })
    comparePdf(doc.output(), 'properties.pdf', 'init')
  })

  /**
   * @TODO: Fix 'undefined' see #882
   */
  it('should return font list', () => {
    const doc = jsPDF()
    const fontList = doc.getFontList()
    expect(fontList).toEqual({
      helvetica: ['normal', 'bold', 'italic', 'bolditalic'],
      Helvetica: ['', 'Bold', 'Oblique', 'BoldOblique'],
      courier: ['normal', 'bold', 'italic', 'bolditalic'],
      Courier: ['', 'Bold', 'Oblique', 'BoldOblique'],
      times: ['normal', 'bold', 'italic', 'bolditalic'],
      Times: ['Roman', 'Bold', 'Italic', 'BoldItalic'],
      zapfdingbats: ['undefined'],
      ZapfDingbats: ['']
    })
  })

  it('should return an ArrayBuffer', () => {
    const doc = jsPDF()
    expect(doc.output('arraybuffer')).toEqual(jasmine.any(ArrayBuffer))
  })

  it('should return a Blob', () => {
    const doc = jsPDF()
    expect(doc.output('blob')).toEqual(jasmine.any(window.Blob))
  })

  it('should return a bloburl', () => {
    const doc = jsPDF()
    expect(doc.output('bloburl')).toContain('blob:')
    expect(doc.output('bloburi')).toContain('blob:')
  })

  it('should return a datauri', () => {
    const doc = jsPDF()
    expect(doc.output('datauristring')).toContain('data:')
    expect(doc.output('dataurlstring')).toContain('data:')
  })

  // @TODO Figure out a way to test this
  xit('should return a datauri', () => {
    const doc = jsPDF()
    doc.output('datauri')
    window.stop()

    doc.output('dataurl')
    window.stop()
  })

  it('should open a new window', () => {
    if (navigator.userAgent.indexOf('Trident') !== -1) {
      console.warn('Skipping IE for new window test')
      return
    }
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.output('dataurlnewwindow')
    // expect(doc.output('dataurlnewwindow').Window).toEqual(jasmine.any(Function))
  })

  const renderBoxes = (doc) => {
    for (let i = 0; i < 100; i++) {
      doc.rect(0, 0, i, i)
    }
  }

  it('should render text 100pt away from the top left', () => {
    const doc = jsPDF('portrait', 'pt')
    renderBoxes(doc)
    comparePdf(doc.output(), 'pt.pdf', 'init')
  })

  it('should render text 100pt away from the top left', () => {
    const doc = jsPDF('portrait', 'mm')
    renderBoxes(doc)
    comparePdf(doc.output(), 'mm.pdf', 'init')
  })

  it('should render text 100pt away from the top left', () => {
    const doc = jsPDF('portrait', 'cm')
    renderBoxes(doc)
    comparePdf(doc.output(), 'cm.pdf', 'init')
  })

  it('should render text 2in away from the top left', () => {
    const doc = jsPDF('portrait', 'in')
    renderBoxes(doc)
    comparePdf(doc.output(), 'in.pdf', 'init')
  })

  it('should render text 2px away from the top left', () => {
    const doc = jsPDF('portrait', 'px')
    renderBoxes(doc)
    comparePdf(doc.output(), 'px.pdf', 'init')
  })

  it('should render text 2px away from the top left', () => {
    const doc = jsPDF('portrait', 'pc')
    renderBoxes(doc)
    comparePdf(doc.output(), 'pc.pdf', 'init')
  })

  it('should render text 2px away from the top left with alternative syntax', () => {
    const doc = jsPDF({ unit: 'pc' })
    renderBoxes(doc)
    comparePdf(doc.output(), 'pc.pdf', 'init')
  })

  it('should render text 2em away from the top left with alternative syntax', () => {
    const doc = jsPDF({ unit: 'em' })
    renderBoxes(doc)
    comparePdf(doc.output(), 'em.pdf', 'init')
  })

  it('should render text 2ex away from the top left with alternative syntax', () => {
    const doc = jsPDF({ unit: 'ex' })
    renderBoxes(doc)
    comparePdf(doc.output(), 'ex.pdf', 'init')
  })

  it('should warn me about an invalid unit', () => {
    expect(() => {
      jsPDF({ unit: 'invalid' })
    }).toThrow('Invalid unit: invalid')
  })

  it('should warn me about an invalid unit when passed as second argument', () => {
    expect(() => {
      jsPDF('portrait', 'invalid')
    }).toThrow('Invalid unit: invalid')
  })
})
