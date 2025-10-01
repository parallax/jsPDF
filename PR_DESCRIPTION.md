## Fix for Issue #3878: Allow setting of Producer

This PR addresses the security concern raised in issue #3878 by making the PDF Producer field configurable instead of hardcoded.

### Changes Made:

1. **Added `producer` to documentProperties**: The producer is now a configurable property that can be set via `setDocumentProperties()` or `setDocumentProperty()`

2. **Modified putInfo function**: The function now uses the configurable producer value if set, otherwise falls back to the default \"jsPDF version\" format

3. **Backward compatibility**: If no custom producer is set, the behavior remains the same as before

### Usage:

```javascript
// Set custom producer
var doc = new jsPDF();
doc.setDocumentProperty('producer', 'My Custom Producer');

// Or set to empty string to remove producer info
doc.setDocumentProperty('producer', '');

// Or use setDocumentProperties
doc.setDocumentProperties({
  producer: 'Custom Producer Name'
});
```

### Security Benefits:

- Allows users to remove or customize the jsPDF version information
- Addresses information disclosure vulnerability concerns
- Maintains backward compatibility

Fixes #3878