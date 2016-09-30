'use strict'

const assert = require('assert')
const webdriverio = require('webdriverio')
const options = {
	desiredCapabilities: {
		browserName: 'chrome'
	}
}
webdriverio
	.remote(options)
	.init()
	.url('http://www.google.com')
	.getTitle().then(title => {
		console.log('Title was: ' + title)
	})
	//.end()

//
// describe('Boot', () => {
//
// 	var webdriverio = require('webdriverio')
// 	var options = {
// 		desiredCapabilities: {
// 			browserName: 'firefox'
// 		}
// 	}
//
// 	webdriverio
// 		.remote(options)
// 		.init()
// 		.url('http://www.google.com')
// 		.getTitle().then(function(title) {
// 			console.log('Title was: ' + title)
// 		})
// 		.end()
// })
