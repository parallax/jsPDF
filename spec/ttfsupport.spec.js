
/* global describe, it, jsPDF, loadBinaryResource, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe('TTFSupport', () => {
    it('should parse directly the file', () => {
        var doc = new jsPDF({filters: ['ASCIIHexEncode'], putOnlyUsedFonts: true});
        var PTSans;
        if (typeof global === 'object' && global.isNode === true) {
            PTSans = doc.loadFile('/../reference/PTSans.ttf');
        } else {
            PTSans = doc.loadFile('base/spec/reference/PTSans.ttf');
        }
        doc.addFileToVFS("PTSans.ttf", PTSans);
        doc.addFont('PTSans.ttf', 'PTSans', 'normal');
        
        doc.setFont('PTSans'); // set font
        doc.setFontSize(10);
        doc.text("А ну чики брики и в дамки!", 10, 10);
        comparePdf(doc.output(), 'russian-1line.pdf', 'unicode')
    })

    it('should parse directly the file var 2', () => {
        var doc = new jsPDF({filters: ['ASCIIHexEncode'], putOnlyUsedFonts: true});
        
        if (typeof global === 'object' && global.isNode === true) {
            doc.addFont('/../reference/PTSans.ttf', 'PTSans', 'normal');
        } else {
            doc.addFont('base/spec/reference/PTSans.ttf', 'PTSans', 'normal');
        }
        doc.setFont('PTSans'); // set font
        doc.setFontSize(10);
        doc.text("А ну чики брики и в дамки!", 10, 10);
        comparePdf(doc.output(), 'russian-1line.pdf', 'unicode')
    })
})