'use strict'
/* global describe, it, expect, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */
describe('viewerpreferences plugin', () => {
  it('HideToolbar', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewerpreferences({'HideToolbar': true});

    comparePdf(doc.output(), 'HideToolbar.pdf', 'viewerpreferences')
  })
  it('HideMenubar', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewerpreferences({'HideMenubar': true});

    comparePdf(doc.output(), 'HideMenubar.pdf', 'viewerpreferences')
  })
  it('HideWindowUI', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewerpreferences({'HideWindowUI': true});

    comparePdf(doc.output(), 'HideWindowUI.pdf', 'viewerpreferences')
  })
  it('FitWindow', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewerpreferences({'FitWindow': true});

    comparePdf(doc.output(), 'FitWindow.pdf', 'viewerpreferences')
  })
  it('check if reset works var. 1', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewerpreferences({'HideWindowUI': true});
    doc.viewerpreferences('reset');
    doc.viewerpreferences({'FitWindow': true});
    
    comparePdf(doc.output(), 'FitWindow.pdf', 'viewerpreferences')
  })
  it('check if reset works var. 2', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewerpreferences({'HideWindowUI': true});
    doc.viewerpreferences({'FitWindow: true'}, true);
    
    comparePdf(doc.output(), 'FitWindow.pdf', 'viewerpreferences')
  })
})
