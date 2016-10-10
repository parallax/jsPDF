/* @TODO Enable 'use strict', remove all these globals */
/* global describe, xit, it, jsPDF, comparePdf, ComboBox, ListBox, PushButton, CheckBox, TextField, PasswordField, RadioButton, AcroForm */
/**
 * Acroform testing
 */

describe('Acroform', function () {
  // @TODO: Raise ticket with AcroForms developer about IE and other issues
  if (navigator.userAgent.indexOf('Trident') !== -1) {
    console.warn('Skipping IE for AcroForms')
    return
  }

  xit('should add a ComboBox', function () {
    var doc = jsPDF()
    doc.setFontSize(12)
    doc.text(10, 105, 'ComboBox:')

    var d = new ComboBox()
    d.T = 'ChoiceField1'
    d.TI = 1
    d.Rect = [50, 100, 30, 10]
    d.Opt = '[(a)(b)(c)]'
    d.V = '(b)'
    d.DV = '(b)'
    doc.addField(d)

    comparePdf(doc.output(), 'combobox.pdf', 'acroform')
  })

  xit('should add a CheckBox', function () {
    var doc = jsPDF()
    doc.text(10, 125, 'CheckBox:')
    var checkBox = new CheckBox()
    checkBox.T = 'CheckBox1'
    checkBox.Rect = [50, 120, 30, 10]
    doc.addField(checkBox)

    comparePdf(doc.output(), 'checkbox.pdf', 'acroform')
  })

  it('should add a ListBox', function () {
    var doc = jsPDF()
    doc.setFontSize(12)
    doc.text(10, 115, 'ListBox:')
    var d2 = new ListBox()
    d2.edit = false
    d2.T = 'ChoiceField2'
    d2.TI = 2
    d2.Rect = [50, 110, 30, 10]
    d2.Opt = '[(c)(a)(d)(f)(b)(s)]'
    d2.V = '(s)'
    d2.BG = [0, 1, 1]
    doc.addField(d2)

    comparePdf(doc.output(), 'listbox.pdf', 'acroform')
  })

  it('should add a PushButton', function () {
    var doc = jsPDF()
    doc.text(10, 135, 'PushButton:')
    var pushButton = new PushButton()
    pushButton.T = 'PushButton1'
    pushButton.Rect = [50, 130, 30, 10]
    pushButton.BG = [1, 0, 0]
    doc.addField(pushButton)

    comparePdf(doc.output(), 'pushbutton.pdf', 'acroform')
  })

  xit('should add a TextField', function () {
    var doc = jsPDF()
    doc.text(10, 145, 'TextField:')
    var textField = new TextField()
    textField.Rect = [50, 140, 30, 10]
    textField.multiline = true
    textField.V = 'The quick brown fox ate the lazy mouse The quick brown fox ate the lazy mouse The quick brown fox ate the lazy mouse'//
    textField.T = 'TestTextBox'
     // textField.Q = 2; // Text-Alignment
    doc.addField(textField)

    comparePdf(doc.output(), 'textfield.pdf', 'acroform')
  })

  it('should add a Password', function () {
    var doc = jsPDF()
    doc.text(10, 155, 'Password:')
    var passwordField = new PasswordField()
    passwordField.Rect = [50, 150, 30, 10]
    doc.addField(passwordField)

    comparePdf(doc.output(), 'password.pdf', 'acroform')
  })

  it('should add a RadioGroup', function () {
    var doc = jsPDF()
    doc.text(50, 165, 'RadioGroup:')
    var radioGroup = new RadioButton()
    radioGroup.V = '/Test'
    radioGroup.Subtype = 'Form'

    doc.addField(radioGroup)

    var radioButton1 = radioGroup.createOption('Test')
    radioButton1.Rect = [50, 170, 30, 10]
    radioButton1.AS = '/Test'

    var radioButton2 = radioGroup.createOption('Test2')
    radioButton2.Rect = [50, 180, 30, 10]

    var radioButton3 = radioGroup.createOption('Test3')
    radioButton3.Rect = [50, 190, 20, 10]

    radioGroup.setAppearance(AcroForm.Appearance.RadioButton.Cross)

    comparePdf(doc.output(), 'radiogroup.pdf', 'acroform')
  })
})
