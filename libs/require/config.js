/**
 * config.js
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * This file declaratively defines jsPDF plugin dependencies.
 * 
 * This allows a host page to simply include require.js and bootstrap the page with a single require statement.
 */

if (typeof require_baseUrl_override === 'undefined'){
	require_baseUrl_override = '../';	
}

require.config({
    baseUrl: require_baseUrl_override,
    shim:{
        'jspdf.plugin.standard_fonts_metrics':{
            deps:[
	            'jspdf'
            ]
        },  
        
        'jspdf.plugin.split_text_to_size':{
            deps:[
	            'jspdf'
            ]
        },  
        
        'jspdf.plugin.annotations' : {
        	deps:[
            'jspdf',
            'jspdf.plugin.standard_fonts_metrics',
            'jspdf.plugin.split_text_to_size'
            ]
        },
        
        'jspdf.plugin.outline':{
            deps:[
	            'jspdf'
            ]
        },
        
        'jspdf.plugin.addimage':{
            deps:[
	            'jspdf'
            ]
        },
        
        'jspdf.plugin.png_support':{
            deps:[
	            'jspdf',
	            'libs/png_support/png',
	            'libs/png_support/zlib'
            ]
        },
        
        'jspdf.plugin.context2d':{
            deps:[
	            'jspdf',
	            'jspdf.plugin.png_support',
	            'jspdf.plugin.addimage',
	            'libs/css_colors'
            ]
        },
        
        'libs/html2canvas/dist/html2canvas':{
            deps:[
	            'jspdf'
            ]
        },
        
        'jspdf.plugin.canvas' : {
            deps:[
	            'jspdf'
            ]
        },
        
        'html2pdf' : {
        	deps:[
            'jspdf',
            'jspdf.plugin.standard_fonts_metrics',
            'jspdf.plugin.split_text_to_size',       
            'jspdf.plugin.png_support',          
            'jspdf.plugin.context2d',
            'jspdf.plugin.canvas',
            'jspdf.plugin.annotations',
            
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
