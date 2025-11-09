let resolve;
const promise = new Promise(res => {
  resolve = res;
});
window.importsReady = function(jsPDF) {
  resolve(jsPDF);
};
window.loadGlobals = async function loadGlobals() {
  if (window.jsPDF && window.Canvg) {
    return;
  }

  const jsPDF = await promise;
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
  window.Canvg = window.canvg.Canvg;
};
