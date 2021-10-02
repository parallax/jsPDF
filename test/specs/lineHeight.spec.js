/* eslint-disable no-self-assign */
/* global describe, it, expect, jsPDF, comparePdf, Button, ComboBox, ChoiceField, EditBox, ListBox, PushButton, CheckBox, TextField, PasswordField, RadioButton, AcroForm */

/**
 * line height testing
 */

 describe("Module: Line Height Unit Test", function() {
    beforeAll(loadGlobals);
    it('test line height', function() {
        const doc1 = new jsPDF();
        doc1.setLineHeightFactor(1.5);
        doc1.text('Some text', 10, 10, { baseline: 'middle' });
        comparePdf(doc1.output(), 'lineHeight.pdf', 'lineHeight');

        const doc2 = new jsPDF();
        doc2.text('Some text', 10, 10, { lineHeightFactor: 1.5, baseline: 'middle' });
        comparePdf(doc2.output(), 'lineHeight.pdf', 'lineHeight');
    });
 });