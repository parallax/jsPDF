// UMD build sets up window.jsPDF automatically
// This function just sets up the AcroForm aliases for backward compatibility
window.loadGlobals = async function loadGlobals() {
  if (window.AcroForm && window.Canvg) {
    return; // Already initialized
  }

  // Set up AcroForm aliases from the jsPDF global
  const jsPDF = window.jsPDF;
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

  // Set up Canvg global
  window.Canvg = window.canvg.Canvg;
};
