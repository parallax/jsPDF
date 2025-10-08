# jsPDF + Vite Compatibility Fix

## Problem
jsPDF was not compatible with Vite due to missing `exports` field in package.json, causing the error:
```
Pre-transform error: failed to resolve import 'jspdf'
```

## Root Cause
Modern bundlers like Vite require explicit module exports configuration in package.json to resolve imports correctly. The missing `exports` field prevented Vite from understanding how to import jsPDF.

## Solution
Added a comprehensive `exports` field to package.json:

```json
{
  "exports": {
    ".": {
      "import": "./dist/jspdf.es.js",
      "require": "./dist/jspdf.node.js", 
      "browser": "./dist/jspdf.umd.js",
      "types": "./types/index.d.ts"
    },
    "./dist/*": "./dist/*",
    "./package.json": "./package.json"
  }
}
```

### Additional Configuration
For Vite projects using jsPDF, add this to your `vite.config.js` to handle the external dependencies gracefully:

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore warnings about external modules
        if (warning.code === 'UNRESOLVED_IMPORT') {
          return
        }
        warn(warning)
      }
    }
  },
  optimizeDeps: {
    include: [
      'jspdf',
      '@babel/runtime/helpers/typeof',
      '@babel/runtime/helpers/slicedToArray', 
      'fflate',
      'fast-png'
    ]
  }
})
```

## Verification
- ✅ ES module imports work: `import { jsPDF } from "jspdf"`
- ✅ Vite development server runs without errors
- ✅ Vite production builds complete successfully
- ✅ Generated PDF files work correctly

## Dependencies
The following peer dependencies are required when using jsPDF with Vite:
- `@babel/runtime`
- `fflate` 
- `fast-png`

## Testing
A comprehensive test project was created in `/test-vite/` that demonstrates:
1. Importing jsPDF in a Vite project
2. Creating and downloading PDF files
3. Both development and production builds working correctly

This fix resolves GitHub issue #3851 and ensures jsPDF is compatible with modern ES module bundlers like Vite.