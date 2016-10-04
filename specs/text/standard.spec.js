'use strict'
/* global describe, it, expect, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe('Standard Text', function () {
  it('should load', function () {
    // assertions here]
    expect(typeof jsPDF).toBe('function')
  })
  it('should generate blank page', function () {
    var doc = jsPDF()
    comparePdf(doc.output(), 'blank.pdf')
  })
  it('should allow text insertion', function () {
    var doc = jsPDF()
    doc.text(10, 10, 'This is a test!')
    comparePdf(doc.output(), 'standard.pdf')
  })
  it('should allow text insertion at an angle', function () {
    var doc = jsPDF()
    doc.text(20, 20, 'This is a test!', null, 20)
    comparePdf(doc.output(), 'angle.pdf')
  })
  it('should render different font faces', function () {
    var doc = jsPDF()

    doc.text(20, 20, 'This is the default font.')

    doc.setFont('courier')
    doc.setFontType('normal')
    doc.text(20, 30, 'This is courier normal.')

    doc.setFont('times')
    doc.setFontType('italic')
    doc.text(20, 40, 'This is times italic.')

    doc.setFont('helvetica')
    doc.setFontType('bold')
    doc.text(20, 50, 'This is helvetica bold.')

    doc.setFont('courier')
    doc.setFontType('bolditalic')
    doc.text(20, 60, 'This is courier bolditalic.')

    comparePdf(doc.output(), 'font-faces.pdf')
  })
  it('should support multiple pages', function () {
    var doc = jsPDF()
    doc.text(20, 20, 'Hello world!')
    doc.text(20, 30, 'This is client-side JavaScript, pumping out a PDF.')
    doc.addPage()
    doc.text(20, 20, 'Do you like that?')
    comparePdf(doc.output(), 'two-page.pdf')
  })
  it('should support different size fonts', function () {
    var doc = jsPDF()
    doc.setFontSize(22)
    doc.text(20, 20, 'This is a title')

    doc.setFontSize(16)
    doc.text(20, 30, 'This is some normal sized text underneath.')
    comparePdf(doc.output(), 'different-sizes.pdf')
  })
})
