/**
 * config.js
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 * Copyright (c) 2015 James Hall (Parallax Agency Ltd) james@parall.ax
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * This file declaratively defines jsPDF plugin dependencies.
 *
 * This allows a host page to simply include require.js and bootstrap the page with a single require statement.
 */

// Skip if Require.JS not installed
if (typeof require === 'object') {

if (typeof require_baseUrl_override === 'undefined'){
	require_baseUrl_override = '../';
}

require.config({
    baseUrl: require_baseUrl_override,
    shim:{
        'plugins/standard_fonts_metrics':{
            deps:[
	            'jspdf'
            ]
        },
        'plugins/customfonts':{
            deps:[
                'jspdf'
            ]
        },

        'plugins/split_text_to_size':{
            deps:[
	            'jspdf'
            ]
        },

        'plugins/annotations' : {
        	deps:[
            'jspdf',
            'plugins/standard_fonts_metrics',
            'plugins/split_text_to_size'
            ]
        },

        'plugins/outline':{
            deps:[
	            'jspdf'
            ]
        },

        'plugins/addimage':{
            deps:[
	            'jspdf'
            ]
        },

        'plugins/png_support':{
            deps:[
	            'jspdf',
	            'libs/png_support/png',
	            'libs/png_support/zlib'
            ]
        },

        'plugins/from_html':{
            deps:[
	            'jspdf'
            ]
        },

        'plugins/context2d':{
            deps:[
	            'jspdf',
	            'plugins/png_support',
	            'plugins/addimage',
	            'libs/css_colors'
            ]
        },

        'libs/html2canvas/dist/html2canvas':{
            deps:[
	            'jspdf'
            ]
        },

        'plugins/canvas' : {
            deps:[
	            'jspdf'
            ]
        },

        'plugins/acroform': {
            deps: [
                'jspdf',
                'plugins/annotations'
            ]
        },

        'html2pdf' : {
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

        'test/test_harness':{
            deps:[
	            'jspdf',
	            'jspdf.plugin.standard_fonts_metrics',
	            'jspdf.plugin.split_text_to_size'
            ]
        }
     },
     paths:{
    	 'html2pdf': 'libs/html2pdf'
     }
});
} // Require.JS
