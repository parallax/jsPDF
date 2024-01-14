function addTextShadow(doc, text, x, y, shadowOffsetX, shadowOffsetY, shadowColor, textColor) {
    // Ajoutez l'ombre
    doc.setTextColor(shadowColor);
    doc.text(text, x + shadowOffsetX, y + shadowOffsetY);
    
    // Ajoutez le texte principal par-dessus
    doc.setTextColor(textColor);
    doc.text(text, x, y);
}

// Exportez la fonction si vous utilisez des modules
if (typeof exports !== 'undefined') {
    exports.addTextShadow = addTextShadow;
}
