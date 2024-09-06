import fs from 'fs';
import path from 'path';

function checkFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasTypes = /: \w+/.test(content); // Simple check for type annotations
  
  if (!hasTypes) {
    console.log(`No types found in: ${filePath}`);
  }
}

function walkDir(dir: string): void {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (path.extname(file) === '.ts') {
      checkFile(filePath);
    }
  }
}

// Start checking from the src directory
walkDir('./src');