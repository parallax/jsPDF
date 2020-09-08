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
} = jsPDF.AcroForm;

doc.setFontSize(12);
doc.text("ComboBox:", 10, 105);

var comboBox = new ComboBox();
comboBox.fieldName = "ChoiceField1";
comboBox.topIndex = 1;
comboBox.Rect = [50, 100, 30, 10];
comboBox.setOptions(["a", "b", "c"]);
comboBox.value = "b";
comboBox.defaultValue = "b";
doc.addField(comboBox);

doc.text("ListBox:", 10, 115);
var listbox = new ListBox();
listbox.edit = false;
listbox.fieldName = "ChoiceField2";
listbox.topIndex = 2;
listbox.Rect = [50, 110, 30, 10];
listbox.setOptions(["c", "a", "d", "f", "b", "s"]);
listbox.value = "s";
doc.addField(listbox);

doc.text("CheckBox:", 10, 125);
var checkBox = new CheckBox();
checkBox.fieldName = "CheckBox1";
checkBox.Rect = [50, 120, 30, 10];
doc.addField(checkBox);

doc.text("PushButton:", 10, 135);
var pushButton = new PushButton();
pushButton.fieldName = "PushButton1";
pushButton.Rect = [50, 130, 30, 10];
doc.addField(pushButton);

doc.text("TextField:", 10, 145);
var textField = new TextField();
textField.Rect = [50, 140, 30, 10];
textField.multiline = true;
textField.value =
  "The quick brown fox ate the lazy mouse The quick brown fox ate the lazy mouse The quick brown fox ate the lazy mouse"; //
textField.fieldName = "TestTextBox";
doc.addField(textField);

doc.text("Password:", 10, 155);
var passwordField = new PasswordField();
passwordField.Rect = [50, 150, 30, 10];
doc.addField(passwordField);

doc.text("RadioGroup:", 50, 165);
var radioGroup = new RadioButton();
radioGroup.value = "Test";
radioGroup.Subtype = "Form";

doc.addField(radioGroup);

var radioButton1 = radioGroup.createOption("Test");
radioButton1.Rect = [50, 170, 30, 10];
radioButton1.AS = "/Test";

var radioButton2 = radioGroup.createOption("Test2");
radioButton2.Rect = [50, 180, 30, 10];

var radioButton3 = radioGroup.createOption("Test3");
radioButton3.Rect = [50, 190, 20, 10];

radioGroup.setAppearance(Appearance.RadioButton.Cross);
