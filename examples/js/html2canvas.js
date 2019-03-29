var pdf = new jsPDF('l', 'pt', 'a4');

pdf.addHTML(document.body, function () {
	var string = pdf.output('datauristring');
	$('.preview-pane').attr('src', string);
});