/* global jasmine, beforeEach */
beforeEach(function () {
    jasmine.addMatchers(require('jasmine-diff')(jasmine, {}))
})