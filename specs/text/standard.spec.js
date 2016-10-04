'use strict'
/* global describe, it, expect */
describe('Standard Text', function () {
  it('should load', function () {
    // assertions here]
    expect(typeof jsPDF, 'function')
  })
  it('should allow text insertion', function () {
    var doc = new jsPDF()
    doc.text(10, 10, 'This is a test!')
    doc.output('dataurlnewwindow')
  })
})
