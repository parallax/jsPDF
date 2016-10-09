'use strict'
/* global describe, it, jsPDF, comparePdf, expect */
/**
 * Standard spec tests
 */

describe('Plugin: addhtml', () => {

  xit('should add HTML to the document', (done) => {
    document.body.innerHTML = '<h1>This is a test</h1>'
    const doc = new jsPDF('p','pt','a4')

    doc.addHTML(document.body,function() {
      setTimeout(() => {
        doc.output('datauri')
        comparePdf(doc.output('datauri'), 'html-output.pdf', 'addhtml')
        done()
      }, 1000)
    })
  })
})
