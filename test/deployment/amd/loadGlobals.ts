require.config({
  baseUrl: "/base",
  paths: {
    jspdf: "dist",
    canvg: "node_modules/canvg/lib/umd",
    html2canvas: "node_modules/html2canvas/dist/html2canvas",
    dompurify: "node_modules/dompurify/dist/purify"
  }
});

window.loadGlobals = function loadGlobals() {
  if (window.jsPDF && window.Canvg) {
    return;
  }

  return new Promise(function(resolve) {
    require(["jspdf/jspdf.umd", "canvg"], function(jsPDF, canvg) {
      window.jsPDF = jsPDF.jsPDF;
      window.AcroForm = jsPDF.AcroForm;
      window.ChoiceField = jsPDF.AcroFormChoiceField;
      window.ListBox = jsPDF.AcroFormListBox;
      window.ComboBox = jsPDF.AcroFormComboBox;
      window.EditBox = jsPDF.AcroFormEditBox;
      window.Button = jsPDF.AcroFormButton;
      window.PushButton = jsPDF.AcroFormPushButton;
      window.RadioButton = jsPDF.AcroFormRadioButton;
      window.CheckBox = jsPDF.AcroFormCheckBox;
      window.TextField = jsPDF.AcroFormTextField;
      window.PasswordField = jsPDF.AcroFormPasswordField;
      window.Appearance = jsPDF.AcroFormAppearance;
      window.Canvg = canvg.Canvg;
      resolve();
    });
  });
};
