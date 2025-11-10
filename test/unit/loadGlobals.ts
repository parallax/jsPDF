// UMD build exports to window.jspdf (lowercase)
// This function sets up the backward-compatible globals
window.loadGlobals = async function loadGlobals() {
  if (window.jsPDF && window.Canvg) {
    return; // Already initialized
  }

  // UMD exports to window.jspdf (lowercase), so we set up window.jsPDF (capitalized)
  const jspdf = window.jspdf;
  window.jsPDF = jspdf.jsPDF;
  window.AcroForm = jspdf.AcroForm;
  window.ChoiceField = jspdf.AcroFormChoiceField;
  window.ListBox = jspdf.AcroFormListBox;
  window.ComboBox = jspdf.AcroFormComboBox;
  window.EditBox = jspdf.AcroFormEditBox;
  window.Button = jspdf.AcroFormButton;
  window.PushButton = jspdf.AcroFormPushButton;
  window.RadioButton = jspdf.AcroFormRadioButton;
  window.CheckBox = jspdf.AcroFormCheckBox;
  window.TextField = jspdf.AcroFormTextField;
  window.PasswordField = jspdf.AcroFormPasswordField;
  window.Appearance = jspdf.AcroFormAppearance;

  // Set up Canvg global
  window.Canvg = window.canvg.Canvg;
};
