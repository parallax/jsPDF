// Generate Sprint 1 PDF (with PDF/UA mode)
const { jsPDF } = require('./dist/jspdf.node.js');

const doc = new jsPDF({ pdfUA: true });

// Set document title
doc.setDocumentTitle('Sprint 1 Test Document');

// Add simple text
doc.text('Hello World!', 10, 10);
doc.text('This is a Sprint 1 test PDF.', 10, 20);
doc.text('PDF/UA mode is enabled.', 10, 30);

// Save to file
const fs = require('fs');
const pdfData = doc.output('arraybuffer');
fs.writeFileSync('examples/temp/sprint1.pdf', Buffer.from(pdfData));

console.log('✅ Sprint 1 PDF created: examples/temp/sprint1.pdf');
