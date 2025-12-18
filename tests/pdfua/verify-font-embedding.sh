#!/bin/bash

# Verify Font Embedding in PDF/UA Test Files
# Usage: bash tests/pdfua/verify-font-embedding.sh

echo "======================================================================"
echo "Font Embedding Verification"
echo "======================================================================"
echo ""

for pdf in examples/temp/test-font-embedding-*.pdf; do
  if [ -f "$pdf" ]; then
    echo "Checking: $(basename $pdf)"
    echo "----------------------------------------------------------------------"

    # Check for Atkinson Hyperlegible
    if strings "$pdf" | grep -q "AtkinsonHyperlegible"; then
      echo "  ✓ AtkinsonHyperlegible font found"
    else
      echo "  ✗ AtkinsonHyperlegible font NOT found"
    fi

    # Check for FontFile2 (embedded TrueType font)
    if strings "$pdf" | grep -q "/FontFile2"; then
      echo "  ✓ FontFile2 present (TrueType font embedded)"
    else
      echo "  ✗ FontFile2 NOT present"
    fi

    # Check for standard fonts
    standard_found=false
    for font in Helvetica Times-Roman Courier; do
      if strings "$pdf" | grep -q "/$font[^a-zA-Z]"; then
        echo "  ! Standard font referenced: $font"
        standard_found=true
      fi
    done

    if [ "$standard_found" = false ]; then
      echo "  ✓ No standard fonts referenced"
    fi

    # File size
    size=$(ls -lh "$pdf" | awk '{print $5}')
    echo "  File size: $size"

    echo ""
  fi
done

echo "======================================================================"
echo "To verify fonts in Acrobat Reader:"
echo "  1. Open PDF in Acrobat Reader"
echo "  2. File → Properties → Fonts"
echo "  3. Look for 'AtkinsonHyperlegible (Embedded Subset)'"
echo ""
echo "To test with screen reader:"
echo "  1. Enable screen reader (NVDA, JAWS, or built-in)"
echo "  2. Open PDF and navigate through content"
echo "  3. Verify all text is readable"
echo "  4. Check character distinction: I l 1 | 0 O"
echo "======================================================================"
