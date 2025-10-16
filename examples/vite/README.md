# jsPDF + Vite Test Project

This test project demonstrates that jsPDF now works correctly with Vite after the compatibility fix.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:5173 and click "Generate PDF" to test.

## Production Build

```bash
npm run build
npm run preview
```

Open http://localhost:4173 and test the production build.

## What's Tested

- ✅ ES module import: `import { jsPDF } from "jspdf"`
- ✅ PDF generation and download
- ✅ Development server compatibility
- ✅ Production build success

This confirms that GitHub issue #3851 has been resolved.
