/**
 * jsPDF PreventScaleToFit Plugin
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
(function (jsPDFAPI) {
  'use strict';

  jsPDFAPI.preventScaleToFit = function () {
    'use strict';

    this.internal.events.subscribe("putCatalog", function () {
      this.internal.write("/ViewerPreferences <</PrintScaling /None>>");
    });
    return this;
  };
})(jsPDF.API);