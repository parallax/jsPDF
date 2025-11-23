# Hotfixes

We sometimes bake-in solutions (A.K.A. hotfixes) to solve issues for specific use cases.

When we deem a hotfix will not break existing code,
will make it default behaviour and mark the hotfix as _accepted_,
At that point the define can be removed.

To enable a hotfix, pass the `hotfixes` option to the jsPDF constructor:

```js
new jsPDF({
  hotfixes: ["px_scaling"]
});
```

# Active Hotfixes

## px_scaling_legacy

### Applies To

jsPDF Core

### Description

For backward compatibility, this hotfix restores the old (incorrect) pixel scaling behavior where scaleFactor = 96/72.
By default, jsPDF now uses the correct pixel scaling (scaleFactor = 72/96) which matches the CSS standard where
1px = 1/96in and 1pt = 1/72in, resulting in 1px = 72/96 pt.

### To Enable

To enable this hotfix (restore old behavior), supply a 'hotfixes' array to the options object in the jsPDF constructor function, and add the
string 'px_scaling_legacy' to this array.

# Accepted Hotfixes

## px_scaling

### Applies To

jsPDF Core

### Description

When supplying 'px' as the unit for the PDF, the internal scaling factor was being miscalculated making drawn components
larger than they should be. This hotfix corrected the scaling calculation so items are drawn to the correct scale.

This is now the default behavior as of the fix for issue #3921. The correct scaling (72/96) is used by default.
For backward compatibility with the old incorrect scaling (96/72), use the 'px_scaling_legacy' hotfix.

## scale_text

### Applies To

context2d plugin

### Affects

Drawing and Filling Text when a scale transformation is active.

### Description

jsPDF currently has no way to draw scaled text.  
This hotfix scales the current font size by the x-axis scale factor.

## fill_close

### Applies To

context2d plugin

### Affects

Filling paths

### Description

In certain cases, closing a fill would result in a path resolving to an incorrect point.
This was most likely fixed when we refactored matrix logic. Enabling this hotfix will ignore a most-likely unneeded workaround.
