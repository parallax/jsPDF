/* global describe, it, jsPDF, comparePdf */

describe('Module: xmp_metadata', () => {
    it('make some metadata', () => {
        var doc = new jsPDF({ putOnlyUsedFonts: true });
        doc.addMetadata("My metadata as a string.", "http://my.namespace.uri/");
        comparePdf(doc.output(), 'xmpmetadata.pdf')
    });
});