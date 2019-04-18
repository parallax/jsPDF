
/* global describe, it, expect, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */
describe('Module: ViewerPreferences', () => {
  it('HideToolbar', () => {
    const doc = new jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewerPreferences({'HideToolbar': true})

    comparePdf(doc.output(), 'HideToolbar.pdf', 'viewerpreferences')
  })
  it('HideMenubar', () => {
    const doc = new jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewerPreferences({'HideMenubar': true})

    comparePdf(doc.output(), 'HideMenubar.pdf', 'viewerpreferences')
  })
  it('HideWindowUI', () => {
    const doc = new jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewerPreferences({'HideWindowUI': true})

    comparePdf(doc.output(), 'HideWindowUI.pdf', 'viewerpreferences')
  })
  it('FitWindow', () => {
    const doc = new jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewerPreferences({'FitWindow': true})

    comparePdf(doc.output(), 'FitWindow.pdf', 'viewerpreferences')
  })
  it('check if reset works var. 1', () => {
    const doc = new jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewerPreferences({'HideWindowUI': true})
    doc.viewerPreferences('reset')
    doc.viewerPreferences({'FitWindow': true})
    
    comparePdf(doc.output(), 'FitWindow.pdf', 'viewerpreferences')
  })
  it('check if reset works var. 2', () => {
    const doc = new jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewerPreferences({'HideWindowUI': true})
    doc.viewerPreferences({'FitWindow': true}, true)
    
    comparePdf(doc.output(), 'FitWindow.pdf', 'viewerpreferences')
  })
  it('ViewArea MediaBox', () => {
    const doc = new jsPDF()
    doc.text(10, 10, 'This is a test')
    doc.viewerPreferences({'ViewArea' : 'MediaBox'})
    
    comparePdf(doc.output(), 'ViewAreaMediaBox.pdf', 'viewerpreferences')
  })
  it('PrintPageRange', () => {
    const doc = new jsPDF()
    doc.text(10, 10, 'Print This Page');
	doc.addPage();
    doc.text(10, 10, 'Print This Page');
	doc.addPage();
    doc.text(10, 10, 'Print This Page');
	doc.addPage();
    doc.text(10, 10, 'Print Not This Page');
	doc.addPage();
    doc.text(10, 10, 'Print This Page');
	doc.addPage();
    doc.text(10, 10, 'Print This Page');
	doc.addPage();
    doc.text(10, 10, 'Print This Page');
	doc.addPage();
    doc.text(10, 10, 'Print This Page');
	doc.addPage();
    doc.text(10, 10, 'Print This Page');
    doc.viewerPreferences({'PrintPageRange' : [[1,3],[5,9]]})
    
    comparePdf(doc.output(), 'PrintPageRange.pdf', 'viewerpreferences')
  })
  it('ViewArea NumCopies', () => {
    const doc = new jsPDF()
    doc.viewerPreferences({'NumCopies' : 10})
    
    comparePdf(doc.output(), 'NumCopies.pdf', 'viewerpreferences')
  })
})
