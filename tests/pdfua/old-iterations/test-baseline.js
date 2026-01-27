// Generate Baseline PDF (no PDF/UA)
const { jsPDF } = require('./dist/jspdf.node.js');

const doc = new jsPDF();

// Set document title
doc.setProperties({ title: 'Baseline Test Document' });

// Add simple text
doc.text('Hello World!', 10, 10);
doc.text('This is a baseline test PDF.', 10, 20);
doc.text('No PDF/UA features enabled.', 10, 30);

// Save to file
const fs = require('fs');
const pdfData = doc.output('arraybuffer');
fs.writeFileSync('examples/temp/baseline.pdf', Buffer.from(pdfData));

console.log('✅ Baseline PDF created: examples/temp/baseline.pdf');
