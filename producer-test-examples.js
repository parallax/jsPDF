// Test file for producer setting functionality
// This demonstrates how the new producer setting feature works

// Example 1: Default behavior (unchanged)
var doc1 = new jsPDF();
// Producer will be "jsPDF x.x.x" (current behavior)

// Example 2: Custom producer
var doc2 = new jsPDF();
doc2.setDocumentProperty('producer', 'My Custom Producer');
// Producer will be "My Custom Producer"

// Example 3: Remove producer information
var doc3 = new jsPDF();
doc3.setDocumentProperty('producer', '');
// No producer field will be added to PDF

// Example 4: Using setDocumentProperties
var doc4 = new jsPDF();
doc4.setDocumentProperties({
  title: 'Test Document',
  author: 'Test Author',
  producer: 'Custom PDF Generator v1.0'
});

// Example 5: Security-focused usage (remove version info)
var doc5 = new jsPDF();
doc5.setDocumentProperty('producer', 'PDF Generator');
// Removes jsPDF version information for security