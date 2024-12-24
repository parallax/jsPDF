const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the report directory
app.use(express.static(__dirname));

// Serve PDFs from the test directory
app.use('/test', express.static(path.join(__dirname, '..')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Test report server running at http://localhost:${port}`);
}); 