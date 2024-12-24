const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve static files from the report directory
app.use(express.static(path.join(__dirname)));

// Serve PDFs from test directory
app.use('/test', express.static(path.join(__dirname, '..')));

// API endpoint to list actual PDFs
app.get('/api/pdfs', (req, res) => {
  const actualDir = path.join(__dirname, '../actual');
  try {
    const files = fs.readdirSync(actualDir)
      .filter(file => file.endsWith('.pdf'))
      .map(file => ({
        name: file,
        actualPdf: `test/actual/${file}`,
        referencePdf: `test/reference/${file}`
      }));
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Test report server running at http://localhost:${port}`);
}); 