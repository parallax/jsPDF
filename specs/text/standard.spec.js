'use strict'
/* global describe, it, expect */
describe('Standard Text', () => {
  it('should load', () => {
    // assertions here]
    expect(typeof jsPDF, 'function')
  })
  it('should allow text insertion', () => {
    const doc = new jsPDF()
    doc.text(10, 10, "This is a test!")
    doc.output('dataurlnewwindow')
  })
})
