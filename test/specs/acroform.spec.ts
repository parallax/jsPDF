/* eslint-disable no-self-assign */
/* global describe, it, expect, jsPDF, comparePdf, Button, ComboBox, ChoiceField, EditBox, ListBox, PushButton, CheckBox, TextField, PasswordField, RadioButton, AcroForm */

/**
 * Acroform testing
 */
describe("Module: Acroform Unit Test", function() {
  beforeAll(loadGlobals);
  it("setBit", function() {
    expect(function() {
      jsPDF.API.__acroform__.setBit("invalid", 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBit")
    );
    expect(function() {
      jsPDF.API.__acroform__.setBit(0, "invalid");
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBit")
    );
    expect(jsPDF.API.__acroform__.setBit(0, 0)).toEqual(1);
    expect(jsPDF.API.__acroform__.setBit(0, 1)).toEqual(2);
    expect(jsPDF.API.__acroform__.setBit(0, 2)).toEqual(4);
  });

  it("getBit", function() {
    expect(function() {
      jsPDF.API.__acroform__.getBit("invalid", 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBit")
    );
    expect(function() {
      jsPDF.API.__acroform__.getBit(0, "invalid");
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBit")
    );
    expect(jsPDF.API.__acroform__.getBit(1, 0)).toEqual(1);
    expect(jsPDF.API.__acroform__.getBit(2, 0)).toEqual(0);
    expect(jsPDF.API.__acroform__.getBit(2, 1)).toEqual(1);
    expect(jsPDF.API.__acroform__.getBit(4, 2)).toEqual(1);
  });

  it("clearBit", function() {
    expect(function() {
      jsPDF.API.__acroform__.clearBit("invalid", 1);
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBit")
    );
    expect(function() {
      jsPDF.API.__acroform__.clearBit(0, "invalid");
    }).toThrow(
      new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBit")
    );
    expect(jsPDF.API.__acroform__.clearBit(1, 0)).toEqual(0);
    expect(jsPDF.API.__acroform__.clearBit(2, 0)).toEqual(2);
    expect(jsPDF.API.__acroform__.clearBit(2, 1)).toEqual(0);
    expect(jsPDF.API.__acroform__.clearBit(4, 0)).toEqual(4);
    expect(jsPDF.API.__acroform__.clearBit(4, 1)).toEqual(4);
    expect(jsPDF.API.__acroform__.clearBit(4, 2)).toEqual(0);
  });

  it("setBitForPdf", function() {
    expect(function() {
      jsPDF.API.__acroform__.setBitForPdf("invalid", 1);
    }).toThrow(
      new Error(
        "Invalid arguments passed to jsPDF.API.__acroform__.setBitForPdf"
      )
    );
    expect(function() {
      jsPDF.API.__acroform__.setBitForPdf(0, "invalid");
    }).toThrow(
      new Error(
        "Invalid arguments passed to jsPDF.API.__acroform__.setBitForPdf"
      )
    );
    expect(jsPDF.API.__acroform__.setBitForPdf(0, 1)).toEqual(1);
    expect(jsPDF.API.__acroform__.setBitForPdf(0, 2)).toEqual(2);
    expect(jsPDF.API.__acroform__.setBitForPdf(0, 3)).toEqual(4);
  });

  it("getBitForPdf", function() {
    expect(function() {
      jsPDF.API.__acroform__.getBitForPdf("invalid", 1);
    }).toThrow(
      new Error(
        "Invalid arguments passed to jsPDF.API.__acroform__.getBitForPdf"
      )
    );
    expect(function() {
      jsPDF.API.__acroform__.getBitForPdf(0, "invalid");
    }).toThrow(
      new Error(
        "Invalid arguments passed to jsPDF.API.__acroform__.getBitForPdf"
      )
    );
    expect(jsPDF.API.__acroform__.getBitForPdf(1, 1)).toEqual(1);
    expect(jsPDF.API.__acroform__.getBitForPdf(2, 1)).toEqual(0);
    expect(jsPDF.API.__acroform__.getBitForPdf(2, 2)).toEqual(1);
    expect(jsPDF.API.__acroform__.getBitForPdf(4, 3)).toEqual(1);
  });

  it("clearBitForPdf", function() {
    expect(function() {
      jsPDF.API.__acroform__.clearBitForPdf("invalid", 1);
    }).toThrow(
      new Error(
        "Invalid arguments passed to jsPDF.API.__acroform__.clearBitForPdf"
      )
    );
    expect(function() {
      jsPDF.API.__acroform__.clearBitForPdf(0, "invalid");
    }).toThrow(
      new Error(
        "Invalid arguments passed to jsPDF.API.__acroform__.clearBitForPdf"
      )
    );
    expect(jsPDF.API.__acroform__.clearBitForPdf(1, 1)).toEqual(0);
    expect(jsPDF.API.__acroform__.clearBitForPdf(2, 1)).toEqual(2);
    expect(jsPDF.API.__acroform__.clearBitForPdf(2, 2)).toEqual(0);
    expect(jsPDF.API.__acroform__.clearBitForPdf(4, 1)).toEqual(4);
    expect(jsPDF.API.__acroform__.clearBitForPdf(4, 2)).toEqual(4);
    expect(jsPDF.API.__acroform__.clearBitForPdf(4, 3)).toEqual(0);
  });

  it("AcroFormField Rect, x, y, width, height", function() {
    var doc = new jsPDF("p", "pt", "a4");
    var textFieldRect = new TextField();
    textFieldRect.Rect = [50, 140, 30, 10];
    // doc.addField(textFieldRect);

    expect(textFieldRect.x).toEqual(50);
    expect(textFieldRect.y).toEqual(140);
    expect(textFieldRect.width).toEqual(30);
    expect(textFieldRect.height).toEqual(10);

    textFieldRect.x = 20;
    expect(textFieldRect.Rect[0]).toEqual(20);
    textFieldRect.y = 21;
    expect(textFieldRect.Rect[1]).toEqual(21);
    textFieldRect.width = 22;
    expect(textFieldRect.Rect[2]).toEqual(22);
    textFieldRect.height = 23;
    expect(textFieldRect.Rect[3]).toEqual(23);

    textFieldRect.Rect = undefined;
    expect(textFieldRect.Rect).toEqual(undefined);
    expect(textFieldRect.x).toEqual(0);
    expect(textFieldRect.y).toEqual(0);
    expect(textFieldRect.width).toEqual(0);
    expect(textFieldRect.height).toEqual(0);
  });

  it("AcroFormField value", function() {
    var formObject = new TextField();

    formObject.value = "test1";
    expect(formObject.value).toEqual("test1");
    expect(formObject.V).toEqual("(test1)");

    formObject.value = "/test2";
    expect(formObject.value).toEqual("/test2");
    expect(formObject.V).toEqual("(/test2)");

    formObject.V = "test3";
    expect(formObject.value).toEqual("test3");
    expect(formObject.V).toEqual("(test3)");

    formObject.V = "(test4a)";
    expect(formObject.value).toEqual("test4a");
    expect(formObject.V).toEqual("(test4a)");

    formObject.value = formObject.value;
    formObject.value = formObject.value;
    formObject.value = formObject.value;
    expect(formObject.value).toEqual("test4a");
    expect(formObject.V).toEqual("(test4a)");

    formObject.value = "(test4b)";
    formObject.V = formObject.V;
    formObject.V = formObject.V;
    formObject.V = formObject.V;
    expect(formObject.value).toEqual("(test4b)");
    expect(formObject.V).toEqual("(\\(test4b\\))");

    formObject.value = "((test4b))";
    formObject.V = formObject.V;
    formObject.V = formObject.V;
    formObject.V = formObject.V;
    expect(formObject.value).toEqual("((test4b))");
    expect(formObject.V).toEqual("(\\(\\(test4b\\)\\))");

    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    var radioGroup = new RadioButton();
    radioGroup.V = "/Test5";
    radioGroup.Subtype = "Form";
    doc.addField(radioGroup);

    var radioButton1 = radioGroup.createOption("Test");
    radioButton1.Rect = [50, 170, 30, 10];
    radioButton1.AS = "/Test";

    expect(radioGroup.V).toEqual("/Test5");
    expect(radioGroup.value).toEqual("Test5");

    radioGroup.value = "Test6";
    expect(radioGroup.V).toEqual("/Test6");
    expect(radioGroup.value).toEqual("Test6");
  });

  it("AcroFormField defaultValue", function() {
    var formObject = new TextField();
    
    formObject.defaultValue = "test1";
    expect(formObject.defaultValue).toEqual("test1");
    expect(formObject.DV).toEqual("(test1)");

    formObject.defaultValue = "/test2";
    expect(formObject.defaultValue).toEqual("/test2");
    expect(formObject.DV).toEqual("(/test2)");

    formObject.DV = "test3";
    expect(formObject.defaultValue).toEqual("test3");
    expect(formObject.DV).toEqual("(test3)");

    formObject.DV = "(test4a)";
    expect(formObject.defaultValue).toEqual("test4a");
    expect(formObject.DV).toEqual("(test4a)");

    formObject.defaultValue = formObject.defaultValue;
    formObject.defaultValue = formObject.defaultValue;
    formObject.defaultValue = formObject.defaultValue;
    expect(formObject.defaultValue).toEqual("test4a");
    expect(formObject.DV).toEqual("(test4a)");

    formObject.defaultValue = "(test4b)";
    formObject.DV = formObject.DV;
    formObject.DV = formObject.DV;
    formObject.DV = formObject.DV;
    expect(formObject.defaultValue).toEqual("(test4b)");
    expect(formObject.DV).toEqual("(\\(test4b\\))");

    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    var radioGroup = new RadioButton();
    radioGroup.DV = "/Test5";
    radioGroup.Subtype = "Form";
    doc.addField(radioGroup);

    var radioButton1 = radioGroup.createOption("Test");
    radioButton1.Rect = [50, 170, 30, 10];
    radioButton1.AS = "/Test";

    expect(radioGroup.DV).toEqual("/Test5");
    expect(radioGroup.defaultValue).toEqual("Test5");

    radioGroup.defaultValue = "Test6";
    expect(radioGroup.DV).toEqual("/Test6");
    expect(radioGroup.defaultValue).toEqual("Test6");
  });

  it("AcroFormField AS", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    var radioGroup = new RadioButton();
    radioGroup.V = "/Test5";
    radioGroup.Subtype = "Form";
    doc.addField(radioGroup);

    var radioButton1 = radioGroup.createOption("Test");
    radioButton1.Rect = [50, 170, 30, 10];
    radioButton1.AS = "/Test";

    expect(radioButton1.AS).toEqual("/Test");
  });
  it("AcroFormField appearanceState", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    var radioGroup = new RadioButton();
    radioGroup.V = "/Test5";
    radioGroup.Subtype = "Form";
    doc.addField(radioGroup);

    var radioButton1 = radioGroup.createOption("Test");
    radioButton1.Rect = [50, 170, 30, 10];
    radioButton1.AS = "/Test";

    expect(radioButton1.AS).toEqual("/Test");
    expect(radioButton1.appearanceState).toEqual("Test");

    radioButton1.appearanceState = "Test2b";
    expect(radioButton1.AS).toEqual("/Test2b");
    expect(radioButton1.appearanceState).toEqual("Test2b");
  });

  it("AcroFormChoiceField getOptions, setOptions, addOption, removeOption", function() {
    var listbox = new ListBox();

    listbox.Opt = "[(c)(a)(d)(f)(b)(s)]"; // classic initialization

    expect(listbox.getOptions()).toEqual(["c", "a", "d", "f", "b", "s"]);

    listbox.addOption("");
    expect(listbox.getOptions()).toEqual(["c", "a", "d", "f", "b", "s", ""]);

    listbox.setOptions(["c", "a", "d", "f", "b", "s"]);
    expect(listbox.getOptions("")).toEqual(["c", "a", "d", "f", "b", "s"]);
  });

  it("AcroFormChoiceField sort", function() {
    var listbox = new ListBox();

    listbox.Opt = "[(c)(a)(d)(f)(b)(g)]"; // classic initialization

    listbox.sort = true;
    expect(listbox.getOptions()).toEqual(["a", "b", "c", "d", "f", "g"]);

    listbox.addOption("e");
    expect(listbox.getOptions()).toEqual(["a", "b", "c", "d", "e", "f", "g"]);

    listbox.sort = false;
    listbox.addOption("e");
    expect(listbox.getOptions()).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "e"
    ]);

    listbox.removeOption("e");
    expect(listbox.getOptions()).toEqual(["a", "b", "c", "d", "f", "g", "e"]);
    listbox.addOption("e");
    expect(listbox.getOptions()).toEqual([
      "a",
      "b",
      "c",
      "d",
      "f",
      "g",
      "e",
      "e"
    ]);

    listbox.removeOption("e", true);
    expect(listbox.getOptions()).toEqual(["a", "b", "c", "d", "f", "g"]);
    expect(listbox.Opt).toEqual("[(a) (b) (c) (d) (f) (g)]");
  });

  it("arrayToPdfArray", function() {
    expect(function() {
      jsPDF.API.__acroform__.arrayToPdfArray("notAnArray");
    }).toThrow(
      new Error("Invalid argument passed to jsPDF.__acroform__.arrayToPdfArray")
    );
    expect(jsPDF.API.__acroform__.arrayToPdfArray(["a"])).toEqual("[(a)]");
    expect(jsPDF.API.__acroform__.arrayToPdfArray(["a", "b"])).toEqual(
      "[(a) (b)]"
    );
    expect(jsPDF.API.__acroform__.arrayToPdfArray([""])).toEqual("[()]");

    //PDF 32000-1:2008, page 26, 7.3.6
    expect(
      jsPDF.API.__acroform__.arrayToPdfArray([
        549,
        3.14,
        false,
        "Ralph",
        "/SomeName"
      ])
    ).toEqual("[549 3.14 false (Ralph) /SomeName]");
  });

  it("AcroFormField T", function() {
    var field = new TextField();
    expect(field.T.substr(1, 11)).toEqual("FieldObject");
    field.T = "testname";
    expect(field.T).toEqual("(testname)");

    field.fieldName = "testname";
    expect(field.T).toEqual("(testname)");
    expect(field.fieldName).toEqual("testname");
  });

  it("AcroFormField FT", function() {
    var field = new TextField();

    expect(function() {
      field.FT = "Invalid";
    }).toThrow(new Error('Invalid value "Invalid" for attribute FT supplied.'));
    expect(function() {
      field.FT = "/Btn";
    }).not.toThrow(
      new Error('Invalid value "Invalid" for attribute FT supplied.')
    );
    expect(function() {
      field.FT = "/Tx";
    }).not.toThrow(
      new Error('Invalid value "Invalid" for attribute FT supplied.')
    );
    expect(function() {
      field.FT = "/Ch";
    }).not.toThrow(
      new Error('Invalid value "Invalid" for attribute FT supplied.')
    );
    expect(function() {
      field.FT = "/Sig";
    }).not.toThrow(
      new Error('Invalid value "Invalid" for attribute FT supplied.')
    );

    field = new TextField();
    expect(field.FT).toEqual("/Tx");
  });

  it("AcroFormTextField Ff", function() {
    var field = new TextField();

    expect(function() {
      field.Ff = "Invalid";
    }).toThrow(new Error('Invalid value "Invalid" for attribute Ff supplied.'));
    expect(function() {
      field.FT = 0;
    }).not.toThrow(
      new Error('Invalid value "Invalid" for attribute Ff supplied.')
    );

    field = new TextField();
    expect(field.Ff).toEqual(0);

    field = new TextField();    
    expect(field.Ff).toEqual(0);
    expect(field.readOnly).toEqual(false);
    field.readOnly = true;
    expect(field.readOnly).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 0));
    field.readOnly = false;
    expect(field.readOnly).toEqual(false);
    expect(field.Ff).toEqual(0);

    field = new TextField();
    expect(field.Ff).toEqual(0);
    expect(field.required).toEqual(false);
    field.required = true;
    expect(field.required).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 1));
    field.required = false;
    expect(field.required).toEqual(false);
    expect(field.Ff).toEqual(0);

    field = new TextField();
    expect(field.Ff).toEqual(0);
    expect(field.noExport).toEqual(false);
    field.noExport = true;
    expect(field.noExport).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 2));
    field.noExport = false;
    expect(field.noExport).toEqual(false);
    expect(field.Ff).toEqual(0);

    field = new TextField();
    expect(field.Ff).toEqual(0);
    expect(field.doNotSpellCheck).toEqual(false);
    field.doNotSpellCheck = true;
    expect(field.doNotSpellCheck).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 22));
    field.doNotSpellCheck = false;
    expect(field.doNotSpellCheck).toEqual(false);
    expect(field.Ff).toEqual(0);

    field = new TextField();
    expect(field.Ff).toEqual(0);
    expect(field.multiline).toEqual(false);
    field.multiline = true;
    expect(field.multiline).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 12));
    field.multiline = false;
    expect(field.multiline).toEqual(false);
    expect(field.Ff).toEqual(0);

    field = new TextField();
    expect(field.Ff).toEqual(0);
    expect(field.fileSelect).toEqual(false);
    field.fileSelect = true;
    expect(field.fileSelect).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 20));
    field.fileSelect = false;
    expect(field.fileSelect).toEqual(false);
    expect(field.Ff).toEqual(0);

    field = new TextField();
    expect(field.Ff).toEqual(0);
    expect(field.doNotScroll).toEqual(false);
    field.doNotScroll = true;
    expect(field.doNotScroll).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 23));
    field.doNotScroll = false;
    expect(field.doNotScroll).toEqual(false);
    expect(field.Ff).toEqual(0);

    field = new TextField();
    expect(field.Ff).toEqual(0);
    expect(field.comb).toEqual(false);
    field.comb = true;
    expect(field.comb).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 24));
    field.comb = false;
    expect(field.comb).toEqual(false);
    expect(field.Ff).toEqual(0);

    field = new TextField();
    expect(field.Ff).toEqual(0);
    expect(field.richText).toEqual(false);
    field.richText = true;
    expect(field.richText).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 25));
    field.richText = false;
    expect(field.richText).toEqual(false);
    expect(field.Ff).toEqual(0);
  });
  it("AcroFormComboBox", function() {
    expect(new ComboBox().combo).toEqual(true);
    var field = new ComboBox();
    expect(field.Ff).toEqual(Math.pow(2, 17));
    expect(field.combo).toEqual(true);
    field.combo = false;
    expect(field.combo).toEqual(false);
    expect(field.Ff).toEqual(0);
    field.combo = true;
    expect(field.combo).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 17));

    field = new ComboBox();
    expect(field.Ff).toEqual(Math.pow(2, 17));
    field.multiSelect = true;
    expect(field.combo).toEqual(true);
    expect(field.multiSelect).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 17) + Math.pow(2, 21));
    field.multiSelect = false;
    expect(field.Ff).toEqual(Math.pow(2, 17));
    expect(field.multiSelect).toEqual(false);

    field = new ComboBox();
    expect(field.Ff).toEqual(Math.pow(2, 17));
    field.doNotSpellCheck = true;
    expect(field.combo).toEqual(true);
    expect(field.doNotSpellCheck).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 17) + Math.pow(2, 22));
    field.doNotSpellCheck = false;
    expect(field.Ff).toEqual(Math.pow(2, 17));
    expect(field.doNotSpellCheck).toEqual(false);

    field = new ComboBox();
    expect(field.Ff).toEqual(Math.pow(2, 17));
    field.commitOnSelChange = true;
    expect(field.combo).toEqual(true);
    expect(field.commitOnSelChange).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 17) + Math.pow(2, 26));
    field.commitOnSelChange = false;
    expect(field.Ff).toEqual(Math.pow(2, 17));
    expect(field.commitOnSelChange).toEqual(false);
  });

  it("AcroFormEditBox", function() {
    expect(new EditBox().combo).toEqual(true);
    expect(new EditBox().edit).toEqual(true);

    var field = new EditBox();
    expect(field.Ff).toEqual(Math.pow(2, 17) + Math.pow(2, 18));
    field.edit = false;
    expect(field.combo).toEqual(true);
    expect(field.edit).toEqual(false);
    expect(field.Ff).toEqual(Math.pow(2, 17));
    field.edit = true;
    expect(field.Ff).toEqual(Math.pow(2, 17) + Math.pow(2, 18));
    expect(field.combo).toEqual(true);
    expect(field.edit).toEqual(true);
  });
  it("AcroFormButton", function() {
    expect(new Button().FT).toEqual("/Btn");

    var field = new Button();
    expect(field.Ff).toEqual(0);
    field.noToggleToOff = true;
    expect(field.noToggleToOff).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 14));
    field.noToggleToOff = false;
    expect(field.Ff).toEqual(0);
    expect(field.noToggleToOff).toEqual(false);

    field = new Button();
    expect(field.Ff).toEqual(0);
    field.radio = true;
    expect(field.radio).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 15));
    field.radio = false;
    expect(field.Ff).toEqual(0);
    expect(field.radio).toEqual(false);

    field = new Button();
    expect(field.Ff).toEqual(0);
    field.radioIsUnison = true;
    expect(field.radioIsUnison).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 25));
    field.radioIsUnison = false;
    expect(field.Ff).toEqual(0);
    expect(field.radioIsUnison).toEqual(false);
  });

  it("AcroFormField F", function() {
    var field = new TextField();

    expect(function() {
      field.F = "Invalid";
    }).toThrow(new Error('Invalid value "Invalid" for attribute F supplied.'));
    expect(function() {
      field.F = 0;
    }).not.toThrow(
      new Error('Invalid value "Invalid" for attribute F supplied.')
    );

    field = new TextField();
    expect(field.F).toEqual(4);
    expect(field.showWhenPrinted).toEqual(true);
    field.showWhenPrinted = false;
    expect(field.F).toEqual(0);
    field.showWhenPrinted = true;
    expect(field.F).toEqual(4);
  });

  it("AcroFormCheckBox", function() {
    var field = new CheckBox();

    expect(field.FT).toEqual("/Btn");
    expect(field.fontName).toEqual("zapfdingbats");
    expect(field.caption).toEqual("3");
    expect(field.appearanceState).toEqual("On");
    expect(field.value).toEqual("On");
    expect(field.textAlign).toEqual("center");
  });

  it("AcroFormField fontName, fontStyle", function() {
    var field = new TextField();

    expect(field.fontName).toEqual("helvetica");
    field.fontName = "courier";
    expect(field.fontName).toEqual("courier");

    expect(field.fontStyle).toEqual("normal");
    field.fontStyle = "bold";
    expect(field.fontStyle).toEqual("bold");
  });

  it("AcroFormField textAlign", function() {
    var field = new TextField();

    expect(field.Q).toEqual(undefined);

    field.textAlign = "left";
    expect(field.textAlign).toEqual("left");
    expect(field.Q).toEqual(0);
    field.textAlign = 0;
    expect(field.textAlign).toEqual("left");
    expect(field.Q).toEqual(0);

    field.textAlign = "center";
    expect(field.textAlign).toEqual("center");
    expect(field.Q).toEqual(1);
    field.textAlign = 1;
    expect(field.textAlign).toEqual("center");
    expect(field.Q).toEqual(1);

    field.textAlign = "right";
    expect(field.textAlign).toEqual("right");
    expect(field.Q).toEqual(2);
    field.textAlign = 2;
    expect(field.textAlign).toEqual("right");
    expect(field.Q).toEqual(2);

    expect(function() {
      field.Q = "invalid";
    }).toThrow(new Error('Invalid value "invalid" for attribute Q supplied.'));
    expect(function() {
      field.Q = 3;
    }).toThrow(new Error('Invalid value "3" for attribute Q supplied.'));
    expect(function() {
      field.Q = 0;
    }).not.toThrow(new Error('Invalid value "0" for attribute Q supplied.'));
  });

  it("addField", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });

    expect(function() {
      doc.addField(new TextField());
    }).not.toThrow(new Error("Invalid argument passed to jsPDF.addField."));
    expect(function() {
      doc.addField(new ChoiceField());
    }).not.toThrow(new Error("Invalid argument passed to jsPDF.addField."));
    expect(function() {
      doc.addField(new PasswordField());
    }).not.toThrow(new Error("Invalid argument passed to jsPDF.addField."));
    expect(function() {
      doc.addField(new Button());
    }).not.toThrow(new Error("Invalid argument passed to jsPDF.addField."));
    expect(function() {
      doc.addField(new PushButton());
    }).not.toThrow(new Error("Invalid argument passed to jsPDF.addField."));
    expect(function() {
      doc.addField(new ComboBox());
    }).not.toThrow(new Error("Invalid argument passed to jsPDF.addField."));
    expect(function() {
      doc.addField(new Object());
    }).toThrow(new Error("Invalid argument passed to jsPDF.addField."));
  });

  it("addButton", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });

    expect(function() {
      doc.addField(new Button());
    }).not.toThrow(new Error("Invalid argument passed to jsPDF.addField."));
    expect(function() {
      doc.addField(new Object());
    }).toThrow(new Error("Invalid argument passed to jsPDF.addField."));
  });

  it("AcroFormPasswordField", function() {
    var field = new PasswordField();

    expect(field.Ff).toEqual(Math.pow(2, 13));
    expect(field.password).toEqual(true);
    field.password = false;
    expect(field.password).toEqual(false);
    expect(field.Ff).toEqual(0);
    field.password = true;
    expect(field.password).toEqual(true);
    expect(field.Ff).toEqual(Math.pow(2, 13));
  });
  it("AcroFormPushButton", function() {
    expect(new PushButton().pushButton).toEqual(true);
    expect(new PushButton() instanceof Button).toEqual(true);
  });
  it("ComboBox TopIndex", function() {
    var comboBox = new ComboBox();
    expect(comboBox.topIndex).toEqual(0);
    comboBox.topIndex = 1;
    expect(comboBox.topIndex).toEqual(1);
  });
});

describe("Module: Acroform Integration Test", function() {
  beforeAll(loadGlobals);
  it("ComboBox - old", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.setFontSize(12);
    doc.text(10, 105, "ComboBox:");

    var d = new ComboBox();
    d.T = "ChoiceField1";
    d.TI = 1;
    d.Rect = [50, 100, 30, 10];
    d.Opt = "[(a)(b)(c)]";
    d.V = "(b)";
    d.DV = "(b)";
    doc.addField(d);

    comparePdf(doc.output(), "combobox.pdf", "acroform");
  });

  it("ComboBox - new", function() {
    var doc = jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.setFontSize(12);
    doc.text(10, 105, "ComboBox:");

    var d = new ComboBox();
    d.fieldName = "ChoiceField1";
    d.topIndex = 1;
    // d.x = 50;
    // d.y = 120;
    // d.width = 30;
    // d.height =  10;
    d.Rect = [50, 100, 30, 10];
    d.setOptions(["a", "b", "c"]);
    d.value = "b";
    d.defaultValue = "b";
    doc.addField(d);

    comparePdf(doc.output(), "combobox.pdf", "acroform");
  });

  it("CheckBox - old", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.text(10, 125, "CheckBox:");
    var checkBox = new CheckBox();
    checkBox.T = "CheckBox1";
    checkBox.Rect = [50, 120, 30, 10];
    doc.addField(checkBox);

    comparePdf(doc.output(), "checkbox.pdf", "acroform");
  });

  it("CheckBox - new", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.text(10, 125, "CheckBox:");
    var checkBox = new CheckBox();
    checkBox.fieldName = "CheckBox1";
    checkBox.Rect = [50, 120, 30, 10];
    doc.addField(checkBox);

    comparePdf(doc.output(), "checkbox.pdf", "acroform");
  });

  it("ListBox - old", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.setFontSize(12);
    doc.text(10, 115, "ListBox:");
    var d2 = new ListBox();
    d2.edit = false;
    d2.T = "ChoiceField2";
    d2.TI = 0;
    d2.Rect = [50, 110, 30, 70];
    d2.Opt = "[(c)(a)(d)(f)(b)(s)]";
    d2.V = "(s)";
    doc.addField(d2);

    comparePdf(doc.output(), "listbox.pdf", "acroform");
  });

  it("ListBox - new", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.setFontSize(12);
    doc.text(10, 115, "ListBox:");
    var d2 = new ListBox();
    d2.edit = false;
    d2.fieldName = "ChoiceField2";
    d2.topIndex = 0;
    d2.Rect = [50, 110, 30, 70];
    d2.setOptions(["c", "a", "d", "f", "b", "s"]);
    d2.value = "s";
    doc.addField(d2);

    comparePdf(doc.output(), "listbox.pdf", "acroform");
  });

  it("should add a PushButton", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.text(10, 135, "PushButton:");
    var pushButton = new PushButton();
    pushButton.T = "PushButton1";
    pushButton.Rect = [50, 130, 30, 10];
    doc.addField(pushButton);

    comparePdf(doc.output(), "pushbutton.pdf", "acroform");
  });

  it("should add a TextField", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.text(10, 145, "TextField:");
    var textField = new TextField();
    textField.Rect = [50, 140, 30, 10];
    textField.multiline = true;
    textField.V =
      "The quick brown fox ate the lazy mouse The quick brown fox ate the lazy mouse The quick brown fox ate the lazy mouse"; //
    textField.T = "TestTextBox";
    // textField.Q = 2; // Text-Alignment
    doc.addField(textField);

    comparePdf(doc.output(), "textfield.pdf", "acroform");
  });

  it("should add a TextField: var. 2", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.text(10, 145, "TextField:");
    var textField = new doc.AcroFormTextField();
    textField.Rect = [50, 140, 30, 10];
    textField.multiline = true;
    textField.V =
      "The quick brown fox ate the lazy mouse The quick brown fox ate the lazy mouse The quick brown fox ate the lazy mouse"; //
    textField.T = "TestTextBox";
    // textField.Q = 2; // Text-Alignment
    doc.addField(textField);

    comparePdf(doc.output(), "textfield.pdf", "acroform");
  });

  it("should add a Password", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.text(10, 155, "Password:");
    var passwordField = new PasswordField();
    passwordField.Rect = [50, 150, 30, 10];
    doc.addField(passwordField);

    comparePdf(doc.output(), "password.pdf", "acroform");
  });

  it("Check multiline text", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.text("TextField:", 10, 145);
    var textField = new TextField();
    textField.Rect = [50, 140, 100, 100];
    textField.multiline = true;
    textField.V = "A\nB\nC";

    doc.addField(textField);

    comparePdf(doc.output(), "textfieldMultiline.pdf", "acroform");
  });

  it("Check multiline text in small form", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.text("TextField:", 10, 145);
    var textField = new TextField();
    textField.Rect = [50, 140, 100, 15];
    textField.multiline = true;
    textField.V = "A\nLong line Long line Long line Long line Long line \nC";

    doc.addField(textField);

    comparePdf(doc.output(), "textfieldMultilineSmallForm.pdf", "acroform");
  });

  it("should add a RadioGroup Cross", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.text(50, 165, "RadioGroup:");
    var radioGroup = new RadioButton();
    radioGroup.V = "/Test";
    radioGroup.Subtype = "Form";

    doc.addField(radioGroup);

    var radioButton1 = radioGroup.createOption("Test");
    radioButton1.Rect = [50, 170, 30, 10];
    radioButton1.AS = "/Test";

    var radioButton2 = radioGroup.createOption("Test2");
    radioButton2.Rect = [50, 180, 30, 10];

    var radioButton3 = radioGroup.createOption("Test3");
    radioButton3.Rect = [50, 190, 20, 10];

    radioGroup.setAppearance(AcroForm.Appearance.RadioButton.Cross);

    comparePdf(doc.output(), "radiogroup.pdf", "acroform");
  });

  it("should add a RadioGroup Circle", function() {
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      floatPrecision: 2
    });
    doc.text(50, 165, "RadioGroup:");
    var radioGroup = new RadioButton();
    radioGroup.V = "/Test";
    radioGroup.Subtype = "Form";

    doc.addField(radioGroup);

    var radioButton1 = radioGroup.createOption("Test");
    radioButton1.Rect = [50, 170, 30, 10];
    radioButton1.AS = "/Test";

    var radioButton2 = radioGroup.createOption("Test2");
    radioButton2.Rect = [50, 180, 30, 10];

    var radioButton3 = radioGroup.createOption("Test3");
    radioButton3.Rect = [50, 190, 20, 10];

    radioGroup.setAppearance(AcroForm.Appearance.RadioButton.Circle);
    comparePdf(doc.output(), "radiogroup2.pdf", "acroform");
  });

  //fix for issue #1783
  it("acroform and annotations", function() {
    var doc = jsPDF({ floatPrecision: 2 });

    //index items
    for (var i = 1; i < 11; i++) {
      doc.textWithLink("Page " + (i + 1), 10, 15 * i, { pageNumber: i + 1 });
    }

    //pages
    for (var j = 0; j < 10; j++) {
      doc.addPage();
      if (j < 3) {
        // reachable pages
        doc.text(10, 25, "page " + (j + 2));
      } else {
        doc.text(10, 25, "page " + (j + 2));
        // field
        const t = new TextField();
        t.Rect = [10, 30, 100, 10];
        doc.addField(t);
      }
    }
    comparePdf(doc.output(), "with_annotations.pdf", "acroform");
  });

  it("should export all needed Classes", function() {
    expect(jsPDF.API.AcroForm.Appearance);
    expect(jsPDF.API.AcroForm.CheckBox);
    expect(jsPDF.API.AcroForm.Button);
    expect(jsPDF.API.AcroForm.ChoiceField);
    expect(jsPDF.API.AcroForm.ComboBox);
    expect(jsPDF.API.AcroForm.EditBox);
    expect(jsPDF.API.AcroForm.ListBox);
    expect(jsPDF.API.AcroForm.PasswordField);
    expect(jsPDF.API.AcroForm.PushButton);
    expect(jsPDF.API.AcroForm.RadioButton);
    expect(jsPDF.API.AcroForm.TextField);
    expect(jsPDF.API.AcroFormAppearance);
    expect(jsPDF.API.AcroFormCheckBox);
    expect(jsPDF.API.AcroFormButton);
    expect(jsPDF.API.AcroFormChoiceField);
    expect(jsPDF.API.AcroFormComboBox);
    expect(jsPDF.API.AcroFormEditBox);
    expect(jsPDF.API.AcroFormListBox);
    expect(jsPDF.API.AcroFormPasswordField);
    expect(jsPDF.API.AcroFormPushButton);
    expect(jsPDF.API.AcroFormRadioButton);
    expect(jsPDF.API.AcroFormTextField);
  });
});
