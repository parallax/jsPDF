'use strict'
/* global describe, it, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 */

describe('split_text_to_size', () => {

  it('getArraySum', () => {
    expect(jsPDF.API.getArraySum([1])).toEqual(1)
    expect(jsPDF.API.getArraySum([1.5,3.5])).toEqual(5)
  })

  it('getStringUnitWidth', () => {
  })
})
