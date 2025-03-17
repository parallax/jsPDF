/* global jsPDF */
var doc = new jsPDF();
var {
  ComboBox,
  ListBox,
  CheckBox,
  PushButton,
  TextField,
  PasswordField,
  RadioButton,
  Appearance,
  TextFieldGroup
} = jsPDF.AcroForm;

doc.setFontSize(12);
var margin = 12;
let yPos = 20;

addComboBox();
addListBox();
addCheckBox();
addPushButton();
addTextField();
addPasswordField();
addRadioGroups();
addTextFieldGroup();

function addComboBox() {
  doc.text("ComboBox:", 10, yPos);
  var comboBox = new ComboBox();
  comboBox.fieldName = "ComboBox1";
  comboBox.topIndex = 1;
  comboBox.Rect = [50, yPos - 5, 30, 10];
  comboBox.setOptions(["a", "b", "c"]);
  comboBox.value = "b";
  comboBox.defaultValue = "b";
  doc.addField(comboBox);
  yPos += margin;
}

function addListBox() {
  doc.text("ListBox:", 10, yPos);
  var listbox = new ListBox();
  listbox.edit = false;
  listbox.fieldName = "ListBox1";
  listbox.topIndex = 2;
  listbox.Rect = [50, yPos - 5, 30, 10];
  listbox.setOptions(["c", "a", "d", "f", "b", "s"]);
  listbox.value = "s";
  doc.addField(listbox);
  yPos += margin;
}

function addCheckBox() {
  doc.text("CheckBox:", 10, yPos);
  var checkBox = new CheckBox();
  checkBox.fieldName = "CheckBox1";
  checkBox.Rect = [50, yPos - 5, 30, 10];
  doc.addField(checkBox);
  yPos += margin;
}

function addPushButton() {
  doc.text("PushButton:", 10, yPos);
  var pushButton = new PushButton();
  pushButton.fieldName = "PushButton1";
  pushButton.Rect = [50, yPos - 5, 30, 10];
  doc.addField(pushButton);
  yPos += margin;
}

function addTextField() {
  doc.text("TextField:", 10, yPos);
  var textField = new TextField();
  textField.Rect = [50, yPos - 5, 40, 10];
  textField.multiline = true;
  textField.value =
    "The quick brown fox ate the lazy mouse The quick brown fox ate the lazy mouse The quick brown fox ate the lazy mouse";
  textField.fieldName = "TestTextBox";
  doc.addField(textField);
  yPos += margin;
}

function addPasswordField() {
  doc.text("Password:", 10, yPos);
  var passwordField = new PasswordField();
  passwordField.Rect = [50, yPos - 5, 40, 10];
  doc.addField(passwordField);
  yPos += margin;
}

function addRadioGroups() {
  var boxDim = 10;
  doc.text("RadioGroups:", 10, yPos);

  // First radio group
  var radioGroup = new RadioButton();
  radioGroup.value = "RadioGroup1Option3";
  radioGroup.fieldName = "RadioGroup1";
  doc.addField(radioGroup);
  yPos -= 5;

  var radioButton1 = radioGroup.createOption("RadioGroup1Option1");
  radioButton1.Rect = [50, yPos, boxDim, boxDim];

  var radioButton2 = radioGroup.createOption("RadioGroup1Option2");
  radioButton2.Rect = [62, yPos, boxDim, boxDim];

  var radioButton3 = radioGroup.createOption("RadioGroup1Option3");
  radioButton3.Rect = [74, yPos, boxDim, boxDim];
  radioButton3.AS = "/RadioGroup1Option3";

  radioGroup.setAppearance(Appearance.RadioButton.Cross);
  yPos += boxDim + 5;

  // Second radio group
  var radioGroup2 = new RadioButton("RadioGroup2");
  radioGroup2.value = "RadioGroup2Option3";
  radioGroup2.fieldName = "RadioGroup2";

  doc.addField(radioGroup2);

  var radioButton21 = radioGroup2.createOption("RadioGroup2Option1");
  radioButton21.Rect = [50, yPos, boxDim, boxDim];

  var radioButton22 = radioGroup2.createOption("RadioGroup2Option2");
  radioButton22.Rect = [62, yPos, boxDim, boxDim];

  var radioButton23 = radioGroup2.createOption("RadioGroup2Option3");
  radioButton23.Rect = [74, yPos, boxDim, boxDim];
  radioButton23.AS = "/RadioGroup2Option3";

  radioGroup2.setAppearance(Appearance.RadioButton.Circle);
  yPos += margin + boxDim;
}

function addTextFieldGroup() {
  doc.text("TextField Group:", 10, yPos);

  const txtDate = new TextFieldGroup();
  txtDate.fieldName = "Date";
  txtDate.value = new Date().toLocaleDateString("en-US");
  doc.addField(txtDate);

  const txtDate1 = txtDate.createChild();
  txtDate1.Rect = [50, yPos - 5, 40, 10];

  yPos += margin;

  const txtDate2 = txtDate.createChild();
  txtDate2.Rect = [50, yPos - 5, 40, 10];
}
