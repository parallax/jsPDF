;(function() {

	var margin = 0.5

	var loremipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id eros turpis. Vivamus tempor urna vitae sapien mollis molestie. Vestibulum in lectus non enim bibendum laoreet at at libero. Etiam malesuada erat sed sem blandit in varius orci porttitor. Sed at sapien urna. Fusce augue ipsum, molestie et adipiscing at, varius quis enim. Morbi sed magna est, vel vestibulum urna. Sed tempor ipsum vel mi pretium at elementum urna tempor. Nulla faucibus consectetur felis, elementum venenatis mi mollis gravida. Aliquam mi ante, accumsan eu tempus vitae, viverra quis justo.\n\nProin feugiat augue in augue rhoncus eu cursus tellus laoreet. Pellentesque eu sapien at diam porttitor venenatis nec vitae velit. Donec ultrices volutpat lectus eget vehicula. Nam eu erat mi, in pulvinar eros. Mauris viverra porta orci, et vehicula lectus sagittis id. Nullam at magna vitae nunc fringilla posuere. Duis volutpat malesuada ornare. Nulla in eros metus. Vivamus a posuere libero. Proin ut placerat lectus. Duis vitae felis eget eros feugiat congue. Donec tempus, arcu a consectetur mollis, magna augue consequat augue, vel blandit eros ligula non tellus.'

	var drawMargins = function(pdf){
		pdf.setDrawColor(0, 0, 255)
			.setLineWidth(1/72)
			.line(margin, margin, margin, 11 - margin)
			.line(8.5 - margin, margin, 8.5-margin, 11-margin)
		return pdf
	}

	var test1 = function(jsPDF){
		var pdf = new jsPDF('p','in','letter')
		, largetext_size = 16
		, smalltext_size = 12
		//splitStr picks up current font, size
		, largetext = pdf.setFontSize(largetext_size).splitTextToSize(loremipsum, 7.5)
		// but allows you to pass in alternative fontName, fontStyle, fontSize
		// as part of settings Object.
		, smalltext = pdf.splitTextToSize(loremipsum, 7.5, {'fontSize':smalltext_size})

		drawMargins(pdf)

		pdf.text(0.5, 0.5 + largetext_size / 72, largetext)

		var offset = largetext.length * largetext_size / 72 + 2 * smalltext_size / 72

		pdf.setFontSize(smalltext_size).text(0.5, margin + offset, smalltext)

		offset += smalltext.length * smalltext_size / 72 + 2 * smalltext_size / 72

		// here you see all of the options Object properties populated.
		smalltext = pdf.splitTextToSize(
			loremipsum
			, 7.5
			, {
				'fontSize':smalltext_size
				, 'fontStyle': 'Italic'
				, 'fontName': 'Times'
			}
		)

		pdf.setFont('Times','Italic').text(0.5, margin + offset, smalltext)

		return pdf
	}

	define(function(){
		return test1
	})
})()