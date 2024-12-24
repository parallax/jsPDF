const fs = require('fs');
const path = require('path');

function generateReportData(testResults) {
    const summary = {
        total: testResults.total,
        passed: testResults.passed,
        skipped: testResults.skipped,
        failed: testResults.failed
    };

    const failures = testResults.failures.map(failure => ({
        name: failure.name,
        actualPdf: failure.actualPdf,
        referencePdf: failure.referencePdf,
        differences: {
            total: failure.differences.total,
            patterns: failure.differences.patterns.map(pattern => ({
                type: pattern.type,
                count: pattern.count,
                sample: {
                    expected: pattern.sample.expected,
                    actual: pattern.sample.actual
                }
            }))
        }
    }));

    return {
        summary,
        failures
    };
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