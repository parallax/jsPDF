/* global describe, it, expect, jsPDF, comparePdf */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe("Core: Standard Encryption", () => {
  beforeAll(loadGlobals);
  it("should allow text insertion", () => {
    const doc = jsPDF({
      floatPrecision: 2,
      encryption: {
        userPassword: "password"
      }
    });
    doc.__private__.setFileId("0000000000000000000000000BADFACE");
    doc.__private__.setCreationDate("D:19871210000000+00'00'");
    doc.text(10, 10, "This is a test!");
    comparePdf(doc.output(), "encrypted_standard.pdf", "encryption");
  });
  it("should be printable", () => {
    const doc = jsPDF({
      floatPrecision: 2,
      encryption: {
        userPassword: "password",
        userPermissions: ["print"]
      }
    });
    doc.__private__.setFileId("0000000000000000000000000BADFACE");
    doc.__private__.setCreationDate("D:19871210000000+00'00'");
    doc.text(10, 10, "This is a test!");
    comparePdf(doc.output(), "encrypted_printable.pdf", "encryption");
  });
  it("should display forms properly", () => {
    var doc = new jsPDF({
      floatPrecision: 2,
      encryption: {}
    });
    doc.__private__.setFileId("0000000000000000000000000BADFACE");
    doc.__private__.setCreationDate("D:19871210000000+00'00'");
    var {
      ComboBox,
      ListBox,
      CheckBox,
      PushButton,
      TextField,
      PasswordField,
      RadioButton,
      Appearance
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
    doc.addField(radioGroup);
    var radioButton1 = radioGroup.createOption("Test");
    radioButton1.Rect = [50, 170, 30, 10];
    radioButton1.AS = "/Test";
    var radioButton2 = radioGroup.createOption("Test2");
    radioButton2.Rect = [50, 180, 30, 10];
    var radioButton3 = radioGroup.createOption("Test3");
    radioButton3.Rect = [50, 190, 20, 10];
    radioGroup.setAppearance(Appearance.RadioButton.Cross);

    comparePdf(doc.output(), "encrypted_withAcroForm.pdf", "encryption");
  });
  it("colortype_3_indexed_single_colour_alpha_4_bit_png", () => {
    var colortype_3_indexed_single_colour_alpha_4_bit_png =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAG1BMVEX/////AAD/pQD//wAA/wAAgAAAgIAAAP+BAIC08EFzAAAAAXRSTlMAQObYZgAAAJtJREFUCB0BkABv/wAREQAAAAAAAAAiIhEQAAAAAAAzMyIhEAAAAABERDMyIQAAAABVVUQzIhAAAABmZlVEMyEAAAB3d2ZVQzIQAACIh3dlVDIhAAAACId2VUMhAAAAAAiHZUMyEAAAAACHdlQyEAAAAAAIdlQyEAAAAAAId2VDIQAAAAAAh2VDIQAAAAAAh2VDIQAAAAAAh2VDIWfgFTHZzlYNAAAAAElFTkSuQmCC";
    var doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
      filters: ["ASCIIHexEncode"],
      floatPrecision: 2,
      encryption: {
        userPassword: "password"
      }
    });
    doc.__private__.setFileId("0000000000000000000000000BADFACE");
    doc.__private__.setCreationDate("D:19871210000000+00'00'");
    doc.addImage(
      colortype_3_indexed_single_colour_alpha_4_bit_png,
      "PNG",
      100,
      200,
      280,
      210,
      undefined,
      undefined
    );
    comparePdf(doc.output(), "encrypted_withImage.pdf", "encryption");
  });
});
