#!/bin/bash

# veraPDF PDF/UA-1 Validation Script
# Validates all font embedding test PDFs

echo "==================================================================="
echo "veraPDF PDF/UA-1 Validation Results"
echo "==================================================================="
echo ""

cd /mnt/c/projekte/claude/jsPDF-UA

# Test PDF/UA documents
for pdf in test-font-embedding-1.pdf test-font-embedding-2.pdf test-font-embedding-3.pdf test-font-embedding-5-german.pdf; do
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
    echo "  ⚠️  Unknown result: $result"
  fi
  echo ""
done

echo "==================================================================="
echo "Testing regular PDF (should FAIL PDF/UA validation):"
echo "==================================================================="
echo ""
echo "Testing: test-font-embedding-4-regular.pdf"

result=$(docker run --rm -v "/mnt/c/projekte/claude/jsPDF-UA:/data" verapdf/cli:latest \
  --flavour ua1 \
  --format text \
  "/data/examples/temp/test-font-embedding-4-regular.pdf" 2>&1)

if echo "$result" | grep -q "FAIL"; then
  echo "  ✅ FAIL (expected) - Regular PDF is not PDF/UA compliant"
elif echo "$result" | grep -q "PASS"; then
  echo "  ⚠️  PASS (unexpected) - Regular PDF should not be PDF/UA compliant"
else
  echo "  ⚠️  Result: $result"
fi

echo ""
echo "==================================================================="
echo "Summary:"
echo "  - PDF/UA documents should PASS"
echo "  - Regular PDF should FAIL"
echo "==================================================================="
