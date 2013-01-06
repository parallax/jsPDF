// Turn off auto-refresh
$('#auto-refresh').attr('checked', null);

var name = prompt('What is your name?');
var multiplier = prompt('Enter a number:');
multiplier = parseInt(multiplier);

var doc = new jsPDF();
doc.setFontSize(22);	
doc.text(20, 20, 'Questions');
doc.setFontSize(16);
doc.text(20, 30, 'This belongs to: ' + name);

for(var i = 1; i <= 12; i ++) {
	doc.text(20, 30 + (i * 10), i + ' x ' + multiplier + ' = ___');
}

doc.addPage();
doc.setFontSize(22);
doc.text(20, 20, 'Answers');
doc.setFontSize(16);



for(var i = 1; i <= 12; i ++) {
	doc.text(20, 30 + (i * 10), i + ' x ' + multiplier + ' = ' + (i * multiplier));
}	

// Turn on auto-refresh
$('#auto-refresh').attr('checked', 'checked');