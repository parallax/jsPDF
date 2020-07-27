window.loadGlobals = function loadGlobals() {
  if (window.jsPDF && window.Canvg) {
    return;
  }
  const jsPDF = window.jspdf;
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
