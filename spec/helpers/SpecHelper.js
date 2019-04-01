/* eslint-disable no-unused-vars */
/* global beforeAll */

beforeAll(function () {
  require('../../src/node')
  global.jsPDF = require('../../dist/jspdf.node.debug.js');
  global.jsPDF.version = "0.0.0";
});
global.isNode = true;

beforeEach(function () {
  jasmine.addMatchers(require('jasmine-diff')(jasmine, {}))
})