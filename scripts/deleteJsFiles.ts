import fs from 'fs';
import path from 'path';

function deleteJsFile(tsFilePath: string): void {
  const jsFilePath = tsFilePath.replace(/\.ts$/, '.js');
  if (fs.existsSync(jsFilePath)) {
    fs.unlinkSync(jsFilePath);
    console.log(`Deleted: ${jsFilePath}`);
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
      deleteJsFile(filePath);
    }
  }
}

// Start the deletion process from the src directory
walkDir('./src');