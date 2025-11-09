#!/usr/bin/env node

/**
 * Script to help convert JavaScript files to TypeScript
 * Usage: node convert-to-ts.js <file.js>
 */

const fs = require('fs');
const path = require('path');

function convertJsToTs(content) {
  let ts = content;

  // Replace var with let/const
  ts = ts.replace(/\bvar\s+/g, 'let ');

  // Update function declarations to add types where obvious
  // This is basic - manual review still needed

  // Update .js imports to not have extension (TypeScript will handle)
  ts = ts.replace(/from\s+['"](.*)\.js['"]/g, 'from "$1.js"');

  // Convert function constructors to classes (basic pattern)
  // This needs careful manual review for complex cases

  return ts;
}

function processFile(inputFile) {
  if (!inputFile || !inputFile.endsWith('.js')) {
    console.error('Please provide a .js file');
    process.exit(1);
  }

  const content = fs.readFileSync(inputFile, 'utf8');
  const outputFile = inputFile.replace(/\.js$/, '.ts');

  const converted = convertJsToTs(content);

  fs.writeFileSync(outputFile, converted, 'utf8');
  console.log(`Converted ${inputFile} -> ${outputFile}`);
}

// Process all .js files in src directory
function processDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.name.endsWith('.js')) {
      try {
        processFile(fullPath);
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err.message);
      }
    }
  }
}

const arg = process.argv[2];
if (arg && fs.existsSync(arg)) {
  if (fs.statSync(arg).isDirectory()) {
    processDirectory(arg);
  } else {
    processFile(arg);
  }
} else {
  console.log('Processing all .js files in src/...');
  processDirectory('./src');
}
