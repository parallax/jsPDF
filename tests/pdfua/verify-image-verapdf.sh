#!/bin/bash

# veraPDF Validation for Image Alt Text Tests

echo "==================================================================="
echo "veraPDF PDF/UA-1 Validation - Image Alt Text Tests"
echo "==================================================================="
echo ""

cd /mnt/c/projekte/claude/jsPDF-UA

# Test PDF/UA documents with images
for pdf in test-image-1-with-alt.pdf test-image-2-decorative.pdf test-image-3-multiple.pdf test-image-6-german.pdf; do
  echo "Testing: $pdf"

  result=$(docker run --rm -v "/mnt/c/projekte/claude/jsPDF-UA:/data" verapdf/cli:latest \
    --flavour ua1 \
    --format text \
    "/data/examples/temp/$pdf" 2>&1)

  if echo "$result" | grep -q "PASS"; then
    echo "  ✅ PASS - PDF/UA-1 compliant"
  elif echo "$result" | grep -q "FAIL"; then
    echo "  ❌ FAIL - Not compliant"
    echo "  Details: $result"
  else
    echo "  ⚠️  Result: $result"
  fi
  echo ""
done

echo "==================================================================="
echo "Summary:"
echo "  - Images with alt text should PASS"
echo "  - Decorative images (artifacts) should PASS"
echo "==================================================================="
