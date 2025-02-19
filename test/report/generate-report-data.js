const fs = require('fs');
const path = require('path');

function generateReportData(testResults) {
    // Pass through the test results directly since they're already in the correct format
    return testResults;
}

function writeReportData(data) {
    const reportDir = path.join(__dirname);
    const dataFile = path.join(reportDir, 'test-results.js');
    
    const content = `window.TEST_RESULTS = ${JSON.stringify(data, null, 2)};`;
    
    fs.writeFileSync(dataFile, content);
}

module.exports = {
    generateReportData,
    writeReportData
}; 