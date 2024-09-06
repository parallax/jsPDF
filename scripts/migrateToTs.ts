import fs from 'fs';
import path from 'path';

function migrateFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const newPath = filePath.replace(/\.js$/, '.ts');
  
  // Simple conversion: just change the file extension
  fs.writeFileSync(newPath, content);
  
  console.log(`Migrated: ${filePath} -> ${newPath}`);
}

function walkDir(dir: string): void {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (path.extname(file) === '.js') {
      migrateFile(filePath);
    }
  }
}

// Start the migration from the src directory
walkDir('./src');