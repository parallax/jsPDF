// Create instance of JSPDF
var doc = new jsPDF();

var d = new ComboBox();
d.T = "ChoiceField1";
d.TI = 1;
d.Rect = [50, 750, 200, 50];
d.Opt = "[(a)(b)(c)]";
d.V = '(b)';
d.DV = '(b)';
doc.addField(d);


var d2 = new ListBox();
d2.edit = false;
d2.T = "ChoiceField2";
d2.TI = 2;
d2.Rect = [50, 700, 200, 50];
d2.Opt = "[(c)(a)(d)(f)(b)(s)]";
d2.V = '(s)';
d2.BG = [0, 1, 1];
doc.addField(d2);

var checkBox = new CheckBox();
checkBox.T = "CheckBox1";
checkBox.Rect = [50, 650, 50, 50];
doc.addField(checkBox);

var pushButton = new PushButton();
pushButton.T = "PushButton1";
pushButton.Rect = [50, 600, 200, 50];
pushButton.BG = [1, 0, 0];
doc.addField(pushButton);

var textField = new TextField();
textField.Rect = [50, 550, 200, 50];
textField.multiline = true;
textField.V = "The quick brown fox ate the lazy mouse";//
textField.T = "TestTextBox";
textField.Q = 2; // Text-Alignment
doc.addField(textField);

var passwordField = new PasswordField();
passwordField.Rect = [50, 500, 200, 50];
doc.addField(passwordField);

var radioGroup = new RadioButton();
radioGroup.V = "/Test";
//radioGroup.noToggleToOff = true;
radioGroup.Subtype = "Form";

doc.addField(radioGroup);

var radioButton1 = radioGroup.createOption("Test");
radioButton1.Rect = [50, 450, 200, 50];
radioButton1.AS = "/Test";

var radioButton2 = radioGroup.createOption("Test2");
radioButton2.Rect = [50, 400, 200, 50];

var radioButton3 = radioGroup.createOption("Test3");
radioButton3.Rect = [50, 350, 200, 50];

radioGroup.setAppearance(AcroForm.Appearance.RadioButton.Circle);