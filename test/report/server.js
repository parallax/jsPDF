const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Set up the global environment needed by compare.js
global.isNode = true;

// Mock the test framework functions to capture the comparison output
let comparisonOutput = '';
global.fail = function(msg) { 
    // Extract just the comparison results, removing the raw PDF content
    comparisonOutput = msg.split('Actual PDF saved to:')[0].trim();
    throw new Error(msg);
};
global.expect = function(actual) {
    return {
        toEqual: function(expected) {
            if (actual !== expected) {
                const msg = `Expected ${expected} but got ${actual}`;
                comparisonOutput = msg;
                throw new Error(msg);
            }
        }
    };
};

// Load the comparison module
const comparePath = path.join(__dirname, '../utils/compare.js');
require(comparePath);

app.use(express.json());
// Serve static files from the report directory
app.use(express.static(__dirname));
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

app.post('/api/compare', (req, res) => {
    const { actualPath, referencePath } = req.body;
    
    if (!actualPath || !referencePath) {
        return res.status(400).send('Missing required paths');
    }

    // Construct absolute paths
    const rootDir = path.join(__dirname, '../..');
    const actualAbsPath = path.join(rootDir, actualPath);
    const referenceAbsPath = path.join(rootDir, referencePath);
    
    // Verify files exist
    if (!fs.existsSync(actualAbsPath)) {
        return res.status(404).send(`Actual PDF not found: ${actualPath}`);
    }
    if (!fs.existsSync(referenceAbsPath)) {
        return res.status(404).send(`Reference PDF not found: ${referencePath}`);
    }

    try {
        // Reset the comparison output
        comparisonOutput = '';

        // Log absolute paths
        console.log('Absolute paths:');
        console.log('Actual:', actualAbsPath);
        console.log('Reference:', referenceAbsPath);

        // Read the actual PDF
        const actualPdf = fs.readFileSync(actualAbsPath, 'latin1');
        console.log('Actual PDF size:', actualPdf.length);
        console.log('Actual starts with:', actualPdf.substring(0, 20));

        // Extract the filename from the reference path
        const referenceFilename = path.basename(referencePath);
        console.log('Reference filename:', referenceFilename);

        try {
            // Use the comparePdf function with the correct signature
            global.comparePdf(actualPdf, referenceFilename);
            res.send('No differences found between PDFs');
        } catch (compareError) {
            // Send the captured comparison output
            res.send(comparisonOutput);
        }
    } catch (error) {
        console.error('Comparison error:', error);
        res.status(500).send(`Error comparing PDFs: ${error.message}`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 