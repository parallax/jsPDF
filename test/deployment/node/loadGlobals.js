/* eslint-disable no-unused-vars */

global.loadGlobals = function() {
  global.btoa = require("btoa"); // used in some specs

  global.Canvg = require("canvg").Canvg;
  const jsPDF = require("../../../dist/jspdf.node.js");
  global.jsPDF = jsPDF.jsPDF;
  global.AcroForm = jsPDF.AcroForm;
  global.ChoiceField = jsPDF.AcroFormChoiceField;
  global.ListBox = jsPDF.AcroFormListBox;
  global.ComboBox = jsPDF.AcroFormComboBox;
  global.EditBox = jsPDF.AcroFormEditBox;
  global.Button = jsPDF.AcroFormButton;
  global.PushButton = jsPDF.AcroFormPushButton;
  global.RadioButton = jsPDF.AcroFormRadioButton;
  global.CheckBox = jsPDF.AcroFormCheckBox;
  global.TextField = jsPDF.AcroFormTextField;
  global.PasswordField = jsPDF.AcroFormPasswordField;
  global.Appearance = jsPDF.AcroFormAppearance;
};

global.isNode = true;
