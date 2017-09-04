'use strict'
/* global describe, it, expect, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */
describe('viewpreferences plugin', () => {
  it('HideToolbar', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewPreferences({HideToolbar: true});

    comparePdf(doc.output(), 'hideToolbar.pdf', 'text')
  })
  it('HideMenubar', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewPreferences({HideMenubar: true});

    comparePdf(doc.output(), 'HideMenubar.pdf', 'text')
  })
  it('HideWindowUI', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewPreferences({HideWindowUI: true});

    comparePdf(doc.output(), 'HideWindowUI.pdf', 'text')
  })
  it('FitWindow', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewPreferences({FitWindow: true});

    comparePdf(doc.output(), 'FitWindow.pdf', 'text')
  })
  it('check if reset works var. 1', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewPreferences({HideWindowUI: true});
    doc.viewPreferences('reset');
    doc.viewPreferences({FitWindow: true});
    
    comparePdf(doc.output(), 'FitWindow.pdf', 'text')
  })
  it('check if reset works var. 2', () => {
    const doc = jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewPreferences({HideWindowUI: true});
    doc.viewPreferences({FitWindow: true}, true);
    
    comparePdf(doc.output(), 'FitWindow.pdf', 'text')
  })
})
