var doc = new jsPDF({
    encryption: {
        userPassword: "user",
        ownerPassword: "owner",
        userPermissions: ["print", "modify", "copy", "annot-forms"]
        // try changing the user permissions granted
    }
});

doc.setFontSize(40);
doc.text("Octonyan loves jsPDF", 35, 25);
doc.addImage("examples/images/Octonyan.jpg", "JPEG", 15, 40, 180, 180);
