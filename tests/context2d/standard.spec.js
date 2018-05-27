'use strict'
/* global describe, it, jsPDF, comparePdf, expect */
/**
 * Standard spec tests
 */

describe('Context2D_Canvg', () => {

    it('bar_graph_with_text_and_lines - direct svg', () => {

    const svg = loadBinaryResource('/base/tests/context2d/reference/bar_graph_with_text_and_lines.svg');
    var doc = new jsPDF('p', 'pt', 'c1');
    var c = doc.canvas;
    c.width = 1000;
    c.height = 500;

    var ctx = c.getContext('2d');
    ctx.ignoreClearRect = true;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1000, 700);

    //load a svg snippet in the canvas with id = 'drawingArea'
    canvg(c, svg, {
        ignoreMouse: true,
        ignoreAnimation: true,
        ignoreDimensions: true
    });

    comparePdf(doc.output(), 'bar_graph_with_text_and_lines.pdf', 'context2d')
  })
})
