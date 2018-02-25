var configuration =	{
	    'libs/polyfill':{
			name: 'Polyfill',
			description: 'Adds missing functions to older browsers',
            deps:[]
        },

        'jspdf':{
			name: 'Core',
			description: '',
            deps:[
				'libs/adler32cs'
			]
        },
	
        'plugins/standard_fonts_metrics':{
			name: 'Standard Font Metrics Plugin',
			description: 'Adds the Font metrics of the 14 Standard Fonts',
            deps:[
	            'jspdf'
            ]
        },

        'plugins/split_text_to_size':{
			name: 'Split text to size Plugin',
			description: '',
            deps:[
	            'jspdf'
            ]
        },
		
        'plugins/acroform': {
			name: 'AcroForm Plugin',
			description: '',
            deps: [
                'jspdf',
                'plugins/annotations'
            ]
        },

        'plugins/addimage':{
			name: 'AddImage Plugin',
			description: '',
            deps:[
	            'jspdf'
            ]
        },

        'plugins/png_support':{
			name: 'PNG Support',
			description: '',
            deps:[
	            'jspdf',
				'plugins/addimage',
				'libs/Deflater',
				'libs/png_support/png',
				'libs/png_support/zlib'				
            ]
        },

        'plugins/annotations' : {
			name: 'Annotations Plugin',
			description: '',
        	deps:[
            'jspdf',
            'plugins/standard_fonts_metrics',
            'plugins/split_text_to_size'
            ]
        },
		
        'plugins/autoprint':{
			name: 'AutoPrint Plugin',
			description: '',
            deps:[
	            'jspdf'
            ]
        },

        'plugins/outline':{
			name : 'Outline Plugin',
            deps:[
	            'jspdf'
            ]
        },

        'plugins/from_html':{
			name : 'fromHTML Plugin',
            deps:[
	            'jspdf'
            ]
        },
		
        'plugins/javascript':{
			name: 'Javascript Plugin',
			description: '',
            deps:[
	            'jspdf'
            ]
        },

        'plugins/context2d':{
			name: 'Context2D Plugin',
            deps:[
	            'jspdf',
	            'plugins/addimage',
	            'plugins/png_support',
	            'libs/css_colors'
            ]
        },

        'libs/html2pdf' : {
			name: 'HTML2PDF Plugin',
			description: '',
        	deps:[
            'jspdf',
            'plugins/standard_fonts_metrics',
            'plugins/split_text_to_size',
            'plugins/png_support',
            'plugins/context2d',
            'plugins/canvas',
            'plugins/annotations',

            'libs/html2canvas/dist/html2canvas'
            ]
        },
		'plugins/ttfsupport':{
			name: 'TTFFont Support',
			description: '',
            deps:[
	            'jspdf',
				'libs/ttffont'
            ]
        },

		'plugins/utf8':{
			name: 'UTF8 Plugin',
			description: '',
            deps:[
	            'jspdf',
				'plugins/vfs',
				'plugins/ttfsupport'
            ]
        },

		'plugins/arabic':{
			name: 'Arabic Plugin',
			description: '',
            deps:[
	            'plugins/utf8'
            ]
        },

		'plugins/xmp_metadata':{
			name: 'XMP metadata Plugin',
			description: '',
            deps:[
	            'jspdf'
            ]
        }
	}