/**
 * PDF/UA Code Element Test Suite
 * Tests inline and block-level code elements
 *
 * Sprint 16: Code-Element für Programmcode
 */

const { jsPDF } = require('../../dist/jspdf.node.js');
const fs = require('fs');

console.log('======================================================================');
console.log('PDF/UA Code Element Test Suite');
console.log('======================================================================\n');

// Test 1: Basic inline Code
console.log('[Test 1] Basic inline Code');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Basic Code Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Inline Code Test', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Die Variable ', x, 40);
    x += doc.getTextWidth('Die Variable ');

    // Inline code
    doc.beginCode();
    doc.text('counter', x, 40);
    x += doc.getTextWidth('counter');
    doc.endCode();

    doc.text(' speichert den Zähler.', x, 40);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-code-1-inline.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Basic inline code within paragraph');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 2: Block Code (multiline)
console.log('[Test 2] Block Code (multiline)');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Block Code Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Block Code Test', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Das folgende Beispiel zeigt eine JavaScript-Funktion:', 10, 40);
    doc.endStructureElement();

    // Block code
    doc.beginCode();
    doc.text('function greet(name) {', 15, 55);
    doc.text('  return "Hello, " + name;', 15, 63);
    doc.text('}', 15, 71);
    doc.endCode();

    doc.beginStructureElement('P');
    doc.text('Diese Funktion gibt einen Gruß zurück.', 10, 90);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-code-2-block.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Block-level code with multi-line content');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 3: Code with language change (for comments)
console.log('[Test 3] Code with language change');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Code Language Change Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Code mit Sprachwechsel', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Englischer Codekommentar in deutschem Dokument:', 10, 40);
    doc.endStructureElement();

    // Code with English language for comments
    doc.beginCode({ lang: 'en-US' });
    doc.text('// Initialize the counter variable', 15, 55);
    doc.text('let count = 0;', 15, 63);
    doc.text('', 15, 71);
    doc.text('// Increment by one', 15, 71);
    doc.text('count++;', 15, 79);
    doc.endCode();

    doc.beginStructureElement('P');
    doc.text('Der obige Code ist auf Englisch kommentiert.', 10, 98);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-code-3-language.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Code with lang="en-US" for English comments');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 4: Code in list items
console.log('[Test 4] Code in list items');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Code in Lists Test');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Installationsanleitung', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Führen Sie die folgenden Befehle aus:', 10, 40);
    doc.endStructureElement();

    doc.beginListNumbered();
      // Item 1
      doc.beginListItem();
        doc.addListLabel('1.', 15, 55);
        doc.beginListBody();
          let x = 22;
          doc.text('Repository klonen: ', x, 55);
          x += doc.getTextWidth('Repository klonen: ');
          doc.beginCode();
          doc.text('git clone https://example.com/repo.git', x, 55);
          doc.endCode();
        doc.endListBody();
      doc.endStructureElement();

      // Item 2
      doc.beginListItem();
        doc.addListLabel('2.', 15, 70);
        doc.beginListBody();
          x = 22;
          doc.text('Abhängigkeiten installieren: ', x, 70);
          x += doc.getTextWidth('Abhängigkeiten installieren: ');
          doc.beginCode();
          doc.text('npm install', x, 70);
          doc.endCode();
        doc.endListBody();
      doc.endStructureElement();

      // Item 3
      doc.beginListItem();
        doc.addListLabel('3.', 15, 85);
        doc.beginListBody();
          x = 22;
          doc.text('Server starten: ', x, 85);
          x += doc.getTextWidth('Server starten: ');
          doc.beginCode();
          doc.text('npm start', x, 85);
          doc.endCode();
        doc.endListBody();
      doc.endStructureElement();
    doc.endList();
  doc.endStructureElement();

  const filename = 'examples/temp/test-code-4-in-lists.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Code elements within list items');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 5: Multiple code examples (German)
console.log('[Test 5] Multiple code examples - German');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Programmierbeispiele');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Git-Befehle Übersicht', 10, 20);
    doc.endStructureElement();

    // Git status
    doc.beginStructureElement('H2');
    doc.text('Status anzeigen', 10, 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Mit dem Befehl ', 10, 55);
    doc.beginCode();
    doc.text('git status', 10 + doc.getTextWidth('Mit dem Befehl '), 55);
    doc.endCode();
    doc.text(' sehen Sie den aktuellen Stand.', 10 + doc.getTextWidth('Mit dem Befehl git status'), 55);
    doc.endStructureElement();

    // Git commit
    doc.beginStructureElement('H2');
    doc.text('Änderungen speichern', 10, 75);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    doc.text('Erstellen Sie einen Commit:', 10, 90);
    doc.endStructureElement();

    doc.beginCode();
    doc.text('git add .', 15, 105);
    doc.text('git commit -m "Meine Änderungen"', 15, 113);
    doc.endCode();

    // Git push
    doc.beginStructureElement('H2');
    doc.text('Zum Server übertragen', 10, 133);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.text('Führen Sie ', x, 148);
    x += doc.getTextWidth('Führen Sie ');
    doc.beginCode();
    doc.text('git push origin main', x, 148);
    doc.endCode();
    x += doc.getTextWidth('git push origin main');
    doc.text(' aus.', x, 148);
    doc.endStructureElement();

  doc.endStructureElement();

  const filename = 'examples/temp/test-code-5-german.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Multiple code examples with German text');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

// Test 6: Code combined with Strong/Em
console.log('[Test 6] Code combined with Strong/Em');
try {
  const doc = new jsPDF({ pdfUA: true });

  doc.setDocumentTitle('Code with Emphasis');
  doc.setLanguage('de-DE');

  doc.beginStructureElement('Document');
    doc.beginStructureElement('H1');
    doc.text('Wichtige Hinweise', 10, 20);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    let x = 10;
    doc.beginStrong();
    doc.setFont("AtkinsonHyperlegible", "bold");
    doc.text('Achtung:', x, 40);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStrong();
    x += doc.getTextWidth('Achtung: ');
    doc.text('Der Befehl ', x, 40);
    x += doc.getTextWidth('Der Befehl ');

    doc.beginCode();
    doc.text('rm -rf /', x, 40);
    doc.endCode();
    x += doc.getTextWidth('rm -rf /');

    doc.text(' ist ', x, 40);
    x += doc.getTextWidth(' ist ');

    doc.beginEmphasis();
    doc.setFont("AtkinsonHyperlegible", "italic");
    doc.text('gefährlich', x, 40);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endEmphasis();
    doc.text('!', x + doc.getTextWidth('gefährlich'), 40);
    doc.endStructureElement();

    doc.beginStructureElement('P');
    x = 10;
    doc.text('Die Funktion ', x, 60);
    x += doc.getTextWidth('Die Funktion ');

    doc.beginCode();
    doc.beginStrong();
    doc.setFont("AtkinsonHyperlegible", "bold");
    doc.text('main()', x, 60);
    doc.setFont("AtkinsonHyperlegible", "normal");
    doc.endStrong();
    doc.endCode();
    x += doc.getTextWidth('main()');

    doc.text(' ist der Einstiegspunkt.', x, 60);
    doc.endStructureElement();
  doc.endStructureElement();

  const filename = 'examples/temp/test-code-6-combined.pdf';
  fs.writeFileSync(filename, Buffer.from(doc.output('arraybuffer')));
  console.log('  Generated:', filename);
  console.log('  Code combined with Strong and Em elements');
  console.log('');
} catch (error) {
  console.log('  Failed:', error.message);
  console.log(error.stack);
  console.log('');
}

console.log('======================================================================');
console.log('Test Summary');
console.log('======================================================================');
console.log('All test PDFs generated in examples/temp/');
console.log('');
console.log('Files created:');
console.log('  - test-code-1-inline.pdf');
console.log('  - test-code-2-block.pdf');
console.log('  - test-code-3-language.pdf');
console.log('  - test-code-4-in-lists.pdf');
console.log('  - test-code-5-german.pdf');
console.log('  - test-code-6-combined.pdf');
console.log('');
console.log('Screenreader Testing:');
console.log('  - Code: Screen reader may announce "code" or read content differently');
console.log('  - Block Code: Screen reader may announce "code block" on entry/exit');
console.log('  - With lang attribute: Screen reader may change pronunciation for comments');
console.log('');
console.log('veraPDF Validation:');
console.log('  docker run --rm -v $(pwd)/examples/temp:/data verapdf/verapdf:latest --flavour ua1 /data/test-code-1-inline.pdf');
console.log('======================================================================');
