// @TODO: Need to simplify this demo

var doc = new jsPDF('p','in','letter')
, sizes = [12, 16, 20]
, fonts = [['Times','Roman'],['Helvetica',''], ['Times','Italic']]
, font, size, lines
, margin = 0.5 // inches on a 8.5 x 11 inch sheet.
, verticalOffset = margin
, loremipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id eros turpis. Vivamus tempor urna vitae sapien mollis molestie. Vestibulum in lectus non enim bibendum laoreet at at libero. Etiam malesuada erat sed sem blandit in varius orci porttitor. Sed at sapien urna. Fusce augue ipsum, molestie et adipiscing at, varius quis enim. Morbi sed magna est, vel vestibulum urna. Sed tempor ipsum vel mi pretium at elementum urna tempor. Nulla faucibus consectetur felis, elementum venenatis mi mollis gravida. Aliquam mi ante, accumsan eu tempus vitae, viverra quis justo.\n\nProin feugiat augue in augue rhoncus eu cursus tellus laoreet. Pellentesque eu sapien at diam porttitor venenatis nec vitae velit. Donec ultrices volutpat lectus eget vehicula. Nam eu erat mi, in pulvinar eros. Mauris viverra porta orci, et vehicula lectus sagittis id. Nullam at magna vitae nunc fringilla posuere. Duis volutpat malesuada ornare. Nulla in eros metus. Vivamus a posuere libero.'

// Margins:
doc.setDrawColor(0, 255, 0)
	.setLineWidth(1/72)
	.line(margin, margin, margin, 11 - margin)
	.line(8.5 - margin, margin, 8.5-margin, 11-margin)

// the 3 blocks of text
for (var i in fonts){
	if (fonts.hasOwnProperty(i)) {
		font = fonts[i]
		size = sizes[i]

		lines = doc.setFont(font[0], font[1])
					.setFontSize(size)
					.splitTextToSize(loremipsum, 7.5)
		// Don't want to preset font, size to calculate the lines?
		// .splitTextToSize(text, maxsize, options)
		// allows you to pass an object with any of the following:
		// {
		// 	'fontSize': 12
		// 	, 'fontStyle': 'Italic'
		// 	, 'fontName': 'Times'
		// }
		// Without these, .splitTextToSize will use current / default
		// font Family, Style, Size.
		doc.text(0.5, verticalOffset + size / 72, lines)

		verticalOffset += (lines.length + 0.5) * size / 72
	}
}