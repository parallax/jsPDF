#Hotfixes

We sometimes bake-in solutions (A.K.A. hotfixes) to solve issues for specific use cases.

When we deem a hotfix will not break existing code,
 will make it default behaviour and mark the hotfix as _accepted_,
 At that point the define can be removed.
 
 To enable a hotfix, define the following member of your created PDF,
where the pdf.hotfix field is the name of the hotfix.

    var pdf new jsPDF(...);
    pdf.hotfix.fill_close = true;
  
#Active Hotfixes

##fill_close
###Applies To
context2d plugin

### Affects
Filling paths 

### Description
In certain cases, closing a fill would result in a path resolving to an incorrect point.
The was most likely fixed when we refactored matrix logic.  Enabling this hotfix will ignore a most-likely unneeded workaround.
 
#Accepted Hotfixes
There a currently no accepted hotfixes.