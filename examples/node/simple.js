const fs = require('fs')
const jsPDF = require('../../dist/jspdf.node.min')

// Default export is a4 paper, portrait, using milimeters for units
var doc = new jsPDF()

doc.text('Hello world!', 10, 10)

fs.writeFileSync('./output.pdf', doc.output())