#Hotfixes

We sometimes bake-in solutions (A.K.A. hotfixes) to solve issues for specific use cases.

When we deem a hotfix will not break existing code,
 will make it default behaviour and mark the hotfix as _accepted_,
 At that point the define can be removed.
 
 To enable a hotfix, define the following member of your created PDF,
where the pdf.hotfix field is the name of the hotfix.

    var pdf new jsPDF(...);
    pdf.hotfix.fill_close = true;
  
# Active Hotfixes
## px_scaling

### Applies To
jsPDF Core

### Description
When supplying 'px' as the unit for the PDF, the internal scaling factor was being miscalculated making drawn components
larger than they should be.  Enabling this hotfix will correct this scaling calculation and items will be drawn to the
correct scale.

### To Enable
To enable this hotfix, supply a 'hotfixes' array to the options object in the jsPDF constructor function, and add the
string 'px_scaling' to this array.

#Accepted Hotfixes
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
The was most likely fixed when we refactored matrix logic.  Enabling this hotfix will ignore a most-likely unneeded workaround.
 
