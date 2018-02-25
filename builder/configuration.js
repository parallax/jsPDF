var configuration =	{

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
			name : 'FromHTML Plugin',
            deps:[
	            'jspdf',
				'plugins/cell'
            ]
        },
		

        'plugins/addhtml':{
			name : 'AddHTML Plugin',
            deps:[
	            'jspdf',
				'libs/html2pdf'
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
		
        'plugins/total_pages':{
			name: 'TotalPages Plugin',
            deps:[
	            'jspdf'
            ]
        },
		
        'plugins/prevent_scale_to_fit':{
			name: 'Prevent Scale To Fit Plugin',
            deps:[
	            'jspdf'
            ]
        },
		
        'plugins/setlanguage':{
			name: 'Language Tag Plugin',
            deps:[
	            'jspdf'
            ]
        },
		
        'plugins/svg':{
			name: 'SVG Plugin',
            deps:[
	            'jspdf'
            ]
        },		
		
        'plugins/viewerpreferences':{
			name: 'ViewerPreferences Plugin',
            deps:[
	            'jspdf'
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
				'plugins/vfs',
				'libs/ttffont'
            ]
        },

		'plugins/utf8':{
			name: 'UTF8 Plugin',
			description: '',
            deps:[
	            'jspdf',
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

		'plugins/vfs':{
			name: 'virtual FileSystem Plugin',
			description: '',
            deps:[
	            'jspdf'
            ]
        },
		
		'plugins/xmp_metadata':{
			name: 'XMP Metadata Plugin',
			description: '',
            deps:[
	            'jspdf'
            ]
        },
		
	    'libs/polyfill':{
			name: 'Polyfill',
			description: 'Adds missing functions to older browsers',
            deps:[]
        }
	}