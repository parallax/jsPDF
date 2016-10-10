'use strict'
Error.stackTraceLimit = 50;

/**
 * Testing inline icons
 */
 /* global describe, it, xit, jsPDF, comparePdf */

let icon = `
<svg class="cap" xmlns="http://www.w3.org/2000/svg" width="190" height="69" viewBox="0 0 190 69.4"><path d="M15 20.5c1.6 0 2.9.7 3.8 2l9.6-2.9c-1.1-2.2-2.8-4-5-5.4-2.2-1.4-5-2.1-8.4-2.1-2.4 0-4.6.4-6.5 1.2-1.9.8-3.4 1.8-4.7 3.1C2.6 17.7 1.7 19.2 1 21c-.7 1.7-1 3.5-1 5.4s.3 3.7 1 5.4c.7 1.7 1.6 3.2 2.9 4.5 1.3 1.3 2.8 2.3 4.7 3.1 1.9.8 4 1.2 6.5 1.2 3.3 0 6.1-.7 8.4-2.1 2.2-1.4 3.9-3.2 5-5.4l-9.6-2.9c-.9 1.4-2.2 2-3.8 2-1.4 0-2.5-.5-3.4-1.5-.9-1-1.4-2.5-1.4-4.4s.5-3.3 1.4-4.4c.8-.9 2-1.4 3.3-1.4zm42 8.6v-5.3c0-3.9-1.2-6.8-3.5-8.8-2.4-1.9-5.7-2.9-10.1-2.9-4.6 0-8.7 1.2-12.4 3.5l2.9 6.2c1.5-1 2.8-1.7 4.2-2.2 1.3-.5 2.8-.8 4.3-.8 1.7 0 2.9.3 3.6.9.7.6 1.1 1.6 1.1 2.9v.8c-1.5-.7-3.3-1-5.5-1-1.7 0-3.3.2-4.8.7-1.4.5-2.7 1.1-3.7 1.9-1 .8-1.9 1.8-2.4 3-.6 1.1-.9 2.4-.9 3.8 0 1.3.2 2.4.7 3.5.5 1.1 1.2 2 2 2.8.9.8 1.9 1.4 3 1.9 1.2.5 2.5.7 3.8.7 1.8 0 3.5-.4 5.1-1.2 1.6-.8 3-2 4.2-3.6l.2 1c.3 1.3.9 2.2 1.8 2.8.9.6 2.3 1 4 1 .6 0 1.2 0 1.9-.1s1.5-.2 2.3-.4v-8.3c-.7-.1-1.2-.3-1.5-.7-.2-.5-.3-1.2-.3-2.1zm-9.9 1.4c0 .3-.1.7-.4 1-.2.3-.6.6-.9.9-.5.3-1 .6-1.7.8-.6.2-1.2.3-1.8.3-.9 0-1.7-.2-2.3-.7-.6-.5-.9-1.1-.9-1.9 0-.9.4-1.7 1.2-2.2.8-.6 1.8-.9 3-.9.6 0 1.2.1 1.9.2s1.3.3 1.9.5v2zm41.5-14.4c-1.1-1.3-2.4-2.2-4-2.9-1.6-.7-3.2-1.1-5.1-1.1-2.1 0-3.8.4-5.3 1.2-1.4.8-2.6 1.9-3.6 3.4v-4.1H62v38.5h10V36c.8 1.5 1.9 2.6 3.4 3.4 1.5.8 3.2 1.2 5.2 1.2 1.7 0 3.2-.4 4.6-1.1 1.4-.7 2.7-1.7 3.7-3s1.9-2.8 2.4-4.6c.6-1.8.9-3.7.9-5.7s-.3-3.9-1-5.6c-.6-1.7-1.5-3.2-2.6-4.5zm-6.9 12.4c-.3.7-.6 1.4-1 1.9-.4.6-1 1-1.6 1.3-.6.3-1.3.5-2 .5-1 0-2-.4-3-1.2-.9-.8-1.7-1.8-2.1-3v-4.7c1.3-1.9 2.8-2.8 4.7-2.8 1.6 0 2.9.5 3.9 1.6 1 1 1.5 2.4 1.5 4.2 0 .7-.1 1.5-.4 2.2zm59.8-12.9c-.6-1-1.5-1.8-2.6-2.5s-2.7-1-4.6-1c-1.9 0-3.7.4-5.3 1.2-1.6.8-2.8 1.9-3.8 3.4V2h-9.9v38.1h9.9V24.7c.2-.6.6-1.1.9-1.6.4-.5.8-.9 1.2-1.2.4-.3.9-.6 1.3-.8.4-.2.8-.3 1.1-.3.9 0 1.7.3 2.3.9.6.6.9 1.6.9 2.9V40h9.9V22c0-1-.1-2.1-.3-3.2 0-1.2-.4-2.2-1-3.2zm32.4.5c-1.1-1.3-2.4-2.2-4-2.9-1.6-.7-3.2-1.1-5.1-1.1-2.1 0-3.8.4-5.3 1.2-1.4.8-2.6 1.9-3.6 3.4v-4.1h-8.6v38.5h9.9V36c.8 1.5 1.9 2.6 3.4 3.4 1.5.8 3.2 1.2 5.2 1.2 1.7 0 3.2-.4 4.6-1.1 1.4-.7 2.7-1.7 3.7-3s1.9-2.8 2.4-4.6c.6-1.8.9-3.7.9-5.7s-.3-3.9-1-5.6c-.5-1.7-1.4-3.2-2.5-4.5zM167 28.5c-.3.7-.6 1.4-1 1.9-.4.6-1 1-1.6 1.3-.6.3-1.3.5-2 .5-1 0-2-.4-3-1.2-.9-.8-1.7-1.8-2.1-3v-4.7c1.3-1.9 2.8-2.8 4.7-2.8 1.6 0 2.9.5 3.9 1.6 1 1 1.5 2.4 1.5 4.2 0 .7-.2 1.5-.4 2.2zm13.1-15.9h9.9V40h-9.9zm4.9-2.7c2.7 0 4.9-2.2 4.9-4.9s-2.1-5-4.9-5c-2.7 0-4.9 2.2-4.9 4.9s2.2 5 4.9 5z" fill="#7F716E"/><g fill="#F27E20" class="site-logo__strapline"><path d="M0 69.4v-6.8h4.5v.6H.7v2.5h3.2v.6H.7v3.2H0zm8.2 0c-.5 0-.9-.1-1.3-.3-.4-.2-.7-.5-1-.8-.3-.3-.5-.7-.7-1.1-.1-.4-.2-.8-.2-1.3s.1-.9.2-1.3c.2-.4.4-.8.7-1.1.3-.3.6-.6 1-.8s.8-.3 1.3-.3.9.1 1.3.3c.4.2.7.5 1 .8.3.3.5.7.6 1.1.2.4.2.8.2 1.3s-.1.9-.2 1.3c-.2.4-.4.8-.7 1.1-.3.3-.6.6-1 .8-.3.2-.7.3-1.2.3zm-2.5-3.5c0 .4.1.7.2 1.1.1.3.3.6.5.9.2.3.5.5.8.6s.7.2 1 .2c.4 0 .7-.1 1-.3.3-.2.6-.4.8-.7.2-.3.4-.6.5-.9.1-.3.2-.7.2-1 0-.4-.1-.7-.2-1.1-.1-.3-.3-.6-.5-.9-.2-.3-.5-.5-.8-.6-.3-.2-.6-.2-1-.2s-.7.1-1 .2c-.3.2-.6.4-.8.6-.2.3-.4.6-.5.9-.1.5-.2.9-.2 1.2zm7 3.5v-6.8h2.9c.3 0 .6.1.8.2.3.1.5.3.6.5.2.2.3.4.4.7.1.3.1.5.1.8 0 .3 0 .5-.1.7l-.3.6c-.1.2-.3.3-.5.5l-.6.3 1.7 2.6H17L15.4 67h-2v2.5h-.7zm.7-3.2h2.2c.2 0 .4 0 .5-.1.2-.1.3-.2.4-.4s.2-.3.3-.5c.1-.2.1-.4.1-.6s0-.4-.1-.6c-.1-.2-.2-.4-.3-.5-.1-.1-.3-.3-.4-.3-.2-.1-.3-.1-.5-.1h-2.2v3.1zm12.2-2.4c-.2-.2-.5-.4-.8-.5-.3-.1-.7-.2-1.1-.2-.6 0-1.1.1-1.3.3-.3.2-.4.6-.4.9 0 .2 0 .4.1.5l.3.3.6.3c.2.1.5.1.9.2s.7.2 1 .3c.3.1.5.2.7.4.2.1.4.3.5.5.1.2.2.5.2.8 0 .3-.1.6-.2.8-.1.2-.3.4-.5.6-.2.2-.5.3-.8.3-.3.1-.6.1-1 .1-1.1 0-2-.3-2.7-1l.3-.5c.3.3.6.5 1 .7.4.2.9.3 1.4.3.5 0 1-.1 1.3-.3.3-.2.5-.5.5-.9 0-.2 0-.4-.1-.5-.1-.1-.2-.3-.4-.4l-.6-.3c-.3-.1-.6-.2-.9-.2-.4-.1-.7-.2-.9-.3-.3-.1-.5-.2-.7-.3-.2-.1-.3-.3-.4-.5-.1-.2-.1-.4-.1-.7 0-.3.1-.6.2-.8.1-.2.3-.5.5-.6.2-.2.5-.3.8-.4s.6-.1 1-.1.9.1 1.2.2c.4.1.7.3 1 .6l-.6.4zm7.9 5.6v-5.6L31 68.1h-.4l-2.5-4.3v5.6h-.7v-6.8h.7l2.7 4.7 2.7-4.7h.7v6.8h-.7zm1.7 0l2.9-6.8h.5l2.9 6.8h-.7l-.9-2.1h-3.1l-.9 2.1h-.7zm3.1-6.1l-1.4 3.4h2.8l-1.4-3.4zm4.2 6.1v-6.8h2.9c.3 0 .6.1.8.2.3.1.5.3.6.5.2.2.3.4.4.7.1.3.1.5.1.8 0 .3 0 .5-.1.7l-.3.6c-.1.2-.3.3-.5.5l-.6.3 1.7 2.6h-.8L45.1 67h-2v2.5h-.6zm.6-3.2h2.2c.2 0 .4 0 .5-.1.2-.1.3-.2.4-.4.1-.1.2-.3.3-.5.1-.2.1-.4.1-.6s0-.4-.1-.6c-.1-.2-.2-.4-.3-.5-.1-.1-.3-.3-.4-.3-.2-.1-.3-.1-.5-.1h-2.2v3.1zm10.4-3.1h-2.4v6.2h-.7v-6.2H48v-.6h5.5v.6zm5.7 5.7v.6h-4.6v-6.8h4.5v.6h-3.8v2.5h3.3v.6h-3.3v2.6h3.9zm1.3.6v-6.8h2.9c.3 0 .6.1.8.2.3.1.5.3.6.5.2.2.3.4.4.7.1.3.1.5.1.8 0 .3 0 .5-.1.7l-.3.6c-.1.2-.3.3-.5.5l-.6.3 1.7 2.6h-.8L63.1 67h-2v2.5h-.6zm.6-3.2h2.2c.2 0 .4 0 .5-.1.2-.1.3-.2.4-.4.1-.1.2-.3.3-.5.1-.2.1-.4.1-.6s0-.4-.1-.6c-.1-.2-.2-.4-.3-.5-.1-.1-.3-.3-.4-.3-.2-.1-.3-.1-.5-.1h-2.2v3.1zm7.2 3.2l2.9-6.8h.5l2.9 6.8h-.7l-.9-2.1h-3.1l-.9 2.1h-.7zm3.1-6.1L70 66.7h2.8l-1.4-3.4zm6.6 5.5c.4 0 .8-.1 1.1-.2.3-.2.5-.4.7-.6.2-.3.3-.6.4-.9.1-.3.1-.7.1-1v-3.4h.7V66c0 .5-.1.9-.2 1.3s-.3.8-.5 1.1c-.2.3-.5.6-.9.7-.4.2-.8.3-1.3.3s-1-.1-1.4-.3c-.4-.2-.7-.5-.9-.8-.2-.3-.4-.7-.5-1.1-.1-.4-.1-.8-.1-1.3v-3.4h.7V66c0 .4 0 .7.1 1 .1.3.2.6.4.9.2.3.4.5.7.6.1.2.5.3.9.3zm9.4-5.7H85v6.2h-.7v-6.2h-2.4v-.6h5.5v.6zm3.5 6.3c-.5 0-.9-.1-1.3-.3s-.7-.5-1-.8c-.3-.3-.5-.7-.7-1.1-.2-.4-.2-.8-.2-1.3s.1-.9.2-1.3c.2-.4.4-.8.7-1.1.3-.3.6-.6 1-.8.4-.2.8-.3 1.3-.3s.9.1 1.3.3c.4.2.7.5 1 .8.3.3.5.7.6 1.1.2.4.2.8.2 1.3s-.1.9-.2 1.3c-.2.4-.4.8-.7 1.1-.3.3-.6.6-1 .8-.3.2-.8.3-1.2.3zm-2.5-3.5c0 .4.1.7.2 1.1s.3.6.5.9c.2.3.5.5.8.6.3.2.7.2 1 .2.4 0 .7-.1 1-.3.3-.2.6-.4.8-.7.2-.3.4-.6.5-.9.1-.3.2-.7.2-1 0-.4-.1-.7-.2-1.1-.1-.3-.3-.6-.5-.9-.2-.3-.5-.5-.8-.6-.3-.2-.6-.2-1-.2s-.7.1-1 .2c-.3.2-.6.4-.8.6-.2.3-.4.6-.5.9s-.2.9-.2 1.2zm13 3.5v-5.6L99 68.1h-.4l-2.5-4.3v5.6h-.7v-6.8h.7l2.7 4.7 2.7-4.7h.7v6.8h-.8zm5.2 0c-.5 0-.9-.1-1.3-.3-.4-.2-.7-.5-1-.8-.3-.3-.5-.7-.7-1.1-.2-.4-.2-.8-.2-1.3s.1-.9.2-1.3c.2-.4.4-.8.7-1.1.3-.3.6-.6 1-.8.4-.2.8-.3 1.3-.3s.9.1 1.3.3c.4.2.7.5 1 .8.3.3.5.7.6 1.1.2.4.2.8.2 1.3s-.1.9-.2 1.3c-.2.4-.4.8-.7 1.1-.3.3-.6.6-1 .8-.3.2-.7.3-1.2.3zm-2.5-3.5c0 .4.1.7.2 1.1s.3.6.5.9c.2.3.5.5.8.6.3.2.7.2 1 .2.4 0 .7-.1 1-.3.3-.2.6-.4.8-.7.2-.3.4-.6.5-.9.1-.3.2-.7.2-1 0-.4-.1-.7-.2-1.1-.1-.3-.3-.6-.5-.9-.2-.3-.5-.5-.8-.6-.3-.2-.6-.2-1-.2s-.7.1-1 .2c-.3.2-.6.4-.8.6-.2.3-.4.6-.5.9s-.2.9-.2 1.2zm11.6-2.8h-2.4v6.2h-.7v-6.2h-2.4v-.6h5.5v.6zm1 6.3v-6.8h.7v6.8h-.7zm2.4-6.9l2.4 6 2.4-6h.7l-2.8 6.8h-.6l-2.8-6.8h.7zm11.1 6.3v.6h-4.6v-6.8h4.5v.6h-3.8v2.5h3.3v.6h-3.3v2.6h3.9zm3.8.6v-6.8h2.3c.5 0 1 .1 1.4.3.4.2.8.4 1 .7.3.3.5.7.6 1.1.1.4.2.9.2 1.3 0 .5-.1 1-.2 1.4-.2.4-.4.8-.7 1.1-.3.3-.6.5-1 .7-.4.2-.9.2-1.4.2H134zm4.9-3.5c0-.4-.1-.8-.2-1.1-.1-.3-.3-.6-.5-.9-.2-.3-.5-.4-.8-.6-.3-.1-.7-.2-1.1-.2h-1.6v5.6h1.6c.4 0 .8-.1 1.1-.2s.6-.3.8-.6c.2-.3.4-.6.5-.9s.2-.7.2-1.1zm6.6 2.9v.6h-4.6v-6.8h4.5v.6h-3.8v2.5h3.3v.6h-3.3v2.6h3.9zm.9-2.9c0-.4.1-.8.2-1.2.1-.4.4-.8.6-1.1s.6-.6 1-.8c.4-.2.9-.3 1.4-.3.6 0 1.1.1 1.6.4.4.3.7.6 1 1.1l-.5.3c-.1-.2-.2-.4-.4-.6-.2-.2-.3-.3-.5-.4s-.4-.2-.6-.2c-.2 0-.4-.1-.6-.1-.4 0-.8.1-1.1.3-.3.2-.6.4-.8.7-.2.3-.4.6-.5.9-.1.3-.2.7-.2 1 0 .4.1.7.2 1.1.1.3.3.7.5.9.2.3.5.5.8.6.3.2.6.2 1 .2.2 0 .4 0 .6-.1.2 0 .4-.1.6-.2.2-.1.4-.2.5-.4.2-.2.3-.3.4-.6l.6.3c-.1.3-.3.5-.5.7-.2.2-.4.4-.7.5-.2.1-.5.2-.8.3-.3.1-.5.1-.8.1-.5 0-.9-.1-1.3-.3-.4-.2-.7-.5-1-.8-.3-.3-.5-.7-.7-1.1.1-.3 0-.8 0-1.2zm7.1 3.5v-6.8h.7v6.8h-.7zm6.4-5.6c-.2-.2-.5-.4-.8-.5-.3-.1-.7-.2-1.1-.2-.6 0-1.1.1-1.3.3-.3.2-.4.5-.4.9 0 .2 0 .4.1.5l.3.3.6.3c.2.1.5.1.9.2s.7.2 1 .3c.3.1.5.2.7.4.2.1.4.3.5.5.1.2.2.5.2.8 0 .3-.1.6-.2.8-.1.2-.3.4-.5.6-.2.2-.5.3-.8.3-.3.1-.6.1-1 .1-1.1 0-2-.3-2.7-1l.3-.5c.3.3.6.5 1 .7.4.2.9.3 1.4.3.5 0 1-.1 1.3-.3.3-.2.5-.5.5-.9 0-.2 0-.4-.1-.5-.1-.1-.2-.3-.4-.4l-.6-.3c-.3-.1-.6-.2-.9-.2-.4-.1-.7-.2-.9-.3-.3-.1-.5-.2-.7-.3-.2-.1-.3-.3-.4-.5-.1-.2-.1-.4-.1-.7 0-.3.1-.6.2-.8.1-.2.3-.5.5-.6.2-.2.5-.3.8-.4s.6-.1 1-.1.9.1 1.2.2c.4.1.7.3 1 .6l-.6.4zm1.9 5.6v-6.8h.7v6.8h-.7zm5.1 0c-.5 0-.9-.1-1.3-.3s-.7-.5-1-.8c-.3-.3-.5-.7-.7-1.1-.2-.4-.2-.8-.2-1.3s.1-.9.2-1.3c.2-.4.4-.8.7-1.1.3-.3.6-.6 1-.8.4-.2.8-.3 1.3-.3s.9.1 1.3.3c.4.2.7.5 1 .8.3.3.5.7.6 1.1.2.4.2.8.2 1.3s-.1.9-.2 1.3c-.2.4-.4.8-.7 1.1-.3.3-.6.6-1 .8-.3.2-.7.3-1.2.3zm-2.5-3.5c0 .4.1.7.2 1.1.1.3.3.6.5.9.2.3.5.5.8.6.3.2.7.2 1 .2.4 0 .7-.1 1-.3.3-.2.6-.4.8-.7.2-.3.4-.6.5-.9s.2-.7.2-1c0-.4-.1-.7-.2-1.1s-.3-.6-.5-.9c-.2-.3-.5-.5-.8-.6-.3-.2-.6-.2-1-.2s-.7.1-1 .2c-.3.2-.6.4-.8.6-.2.3-.4.6-.5.9-.1.5-.2.9-.2 1.2zm7.7-2.1v5.6h-.7v-6.8h.5l4.5 5.7v-5.7h.7v6.8h-.6l-4.4-5.6zm10.8 0c-.2-.2-.5-.4-.8-.5-.3-.1-.7-.2-1.1-.2-.6 0-1.1.1-1.3.3-.3.2-.4.5-.4.9 0 .2 0 .4.1.5l.3.3.6.3c.2.1.5.1.9.2s.7.2 1 .3.5.2.7.4c.2.1.4.3.5.5.1.2.2.5.2.8 0 .3-.1.6-.2.8-.1.2-.3.4-.5.6-.2.2-.5.3-.8.3-.3.1-.6.1-1 .1-1.1 0-2-.3-2.7-1l.3-.5c.3.3.6.5 1 .7s.9.3 1.4.3c.5 0 1-.1 1.3-.3.3-.2.5-.5.5-.9 0-.2 0-.4-.1-.5-.1-.1-.2-.3-.4-.4l-.6-.3c-.3-.1-.6-.2-.9-.2-.4-.1-.7-.2-.9-.3-.3-.1-.5-.2-.7-.3-.2-.1-.3-.3-.4-.5-.1-.2-.1-.4-.1-.7 0-.3.1-.6.2-.8.1-.2.3-.5.5-.6.2-.2.5-.3.8-.4.3-.1.6-.1 1-.1s.9.1 1.2.2c.4.1.7.3 1 .6l-.6.4zM186.7 63h-1v2.5h-.5V63h-1v-.4h2.4v.4zm2.8 2.5v-2.1l-.9 1.6h-.3l-.9-1.6v2.1h-.5v-2.9h.5l1 1.8 1-1.8h.5v2.9h-.4z"/></g></svg>
`

const skipOnIe = () => {
  if (navigator.userAgent.indexOf('Trident') !== -1) {
    console.warn('Skipping on IE')
    return true
  }
}

describe('SVG', () => {
  it('should render an SVG Icon', () => {
    const doc = jsPDF()
    document.body.innerHTML = icon
    doc.svg(document.querySelector('.cap'))
    comparePdf(doc.output(), 'icon.pdf', 'svg')
  })
  it('should render an SVG Icon using the string', () => {
    const doc = jsPDF()
    doc.svg(icon)
    comparePdf(doc.output(), 'icon-string.pdf', 'svg')
  })
  it('should render an SVG Icon using a filename', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/5.svg')
    comparePdf(doc.output(), '5.pdf', 'svg')
  })

  /**
   * @todo ctx.createRadialGradient
   */
  xit('should render 1.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/1.svg')
    comparePdf(doc.output(), '1.pdf', 'svg')
  })
  it('should render 10.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/10.svg')
    comparePdf(doc.output(), '10.pdf', 'svg')
  })

  it('should render 11.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/11.svg')
    comparePdf(doc.output(), '11.pdf', 'svg')
  })

  it('should render 12.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/12.svg')
    comparePdf(doc.output(), '12.pdf', 'svg')
  })

  it('should render 13.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/13.svg')
    comparePdf(doc.output(), '13.pdf', 'svg')
  })

  it('should render 14.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/14.svg')
    comparePdf(doc.output(), '14.pdf', 'svg')
  })

  it('should render 15.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/15.svg')
    comparePdf(doc.output(), '15.pdf', 'svg')
  })

  /**
   * @todo ctx.createLinearGradient
   */
  xit('should render 16.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/16.svg')
    comparePdf(doc.output(), '16.pdf', 'svg')
  })

  /**
   * @todo ctx.createLinearGradient
   */
  xit('should render 17.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/17.svg')
    comparePdf(doc.output(), '17.pdf', 'svg')
  })

  /**
   * @todo ctx.createRadialGradient
   */
  xit('should render 18.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/18.svg')
    comparePdf(doc.output(), '18.pdf', 'svg')
  })

  /**
   * @todo ctx.createRadialGradient
   */
  xit('should render 19.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/19.svg')
    comparePdf(doc.output(), '19.pdf', 'svg')
  })

  /**
   * @todo TypeError: dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render 2.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/2.svg')
    comparePdf(doc.output(), '2.pdf', 'svg')
  })

  it('should render 20.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/20.svg')
    comparePdf(doc.output(), '20.pdf', 'svg')
  })

  it('should render 21.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/21.svg')
    comparePdf(doc.output(), '21.pdf', 'svg')
  })

  /**
   * @todo ReferenceError: r is not defined in plugins/context2d.js (line 9)
   */
  xit('should render 22.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/22.svg')
    comparePdf(doc.output(), '22.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render 23.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/23.svg')
    comparePdf(doc.output(), '23.pdf', 'svg')
  })

  it('should render 24.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/24.svg')
    comparePdf(doc.output(), '24.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render 25.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/25.svg')
    comparePdf(doc.output(), '25.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render 26.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/26.svg')
    comparePdf(doc.output(), '26.pdf', 'svg')
  })

  it('should render 27.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/27.svg')
    comparePdf(doc.output(), '27.pdf', 'svg')
  })

  /**
   * @todo document mismatch
   */
  xit('should render 28.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/28.svg')
    comparePdf(doc.output(), '28.pdf', 'svg')
  })

  /**
   * @todo ctx.createPattern is not a function
   */
  xit('should render 29.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/29.svg')
    comparePdf(doc.output(), '29.pdf', 'svg')
  })

  it('should render 3.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/3.svg')
    comparePdf(doc.output(), '3.pdf', 'svg')
  })

  /**
   * @todo ctx.createPattern is not a function
   */
  xit('should render 30.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/30.svg')
    comparePdf(doc.output(), '30.pdf', 'svg')
  })

  /**
   * @todo  TypeError: Cannot read property 'replace' of undefined
        at Object.svg.compressSpaces (libs/canvg_context2d/canvg.js:237:12)
   */
  xit('should render 31.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/31.svg')
    comparePdf(doc.output(), '31.pdf', 'svg')
  })

  /**
   * @todo kills coverage
   */
  xit('should render 32.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/32.svg')
    comparePdf(doc.output(), '32.pdf', 'svg')
  })

  /**
   * @todo: ctx.createLinearGradient
   */
  xit('should render 33.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/33.svg')
    comparePdf(doc.output(), '33.pdf', 'svg')
  })

  /**
   * @todo: ctx.createRadialGradient
   */
  xit('should render 34.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/34.svg')
    comparePdf(doc.output(), '34.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render 35.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/35.svg')
    comparePdf(doc.output(), '35.pdf', 'svg')
  })

  /**
   * @todo document mismatch
   */
  xit('should render 36.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/36.svg')
    comparePdf(doc.output(), '36.pdf', 'svg')
  })

  it('should render 4.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/4.svg')
    comparePdf(doc.output(), '4.pdf', 'svg')
  })

  it('should render 5.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/5.svg')
    comparePdf(doc.output(), '5.pdf', 'svg')
  })

  /**
   * @todo moves[(moves.length - 1)] is undefined in plugins/context2d.js (line 9)
   */
  xit('should render 6.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/6.svg')
    comparePdf(doc.output(), '6.pdf', 'svg')
  })

  it('should render 7.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/7.svg')
    comparePdf(doc.output(), '7.pdf', 'svg')
  })

  it('should render 8.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/8.svg')
    comparePdf(doc.output(), '8.pdf', 'svg')
  })

  it('should render 9.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/9.svg')
    comparePdf(doc.output(), '9.pdf', 'svg')
  })

  /**
   * @todo: ctx.createLinearGradient
   */
  xit('should render issue104.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue104.svg')
    comparePdf(doc.output(), 'issue104.pdf', 'svg')
  })

  /**
   * @todo: ctx.createLinearGradient
   */
  xit('should render issue106.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue106.svg')
    comparePdf(doc.output(), 'issue106.pdf', 'svg')
  })

  /**
   * @todo: ctx.createPattern
   */
  xit('should render issue112.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue112.svg')
    comparePdf(doc.output(), 'issue112.pdf', 'svg')
  })

  /**
   * @todo document mismatch
   */
  xit('should render issue114.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue114.svg')
    comparePdf(doc.output(), 'issue114.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue115.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue115.svg')
    comparePdf(doc.output(), 'issue115.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue116.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue116.svg')
    comparePdf(doc.output(), 'issue116.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue117.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue117.svg')
    comparePdf(doc.output(), 'issue117.pdf', 'svg')
  })

  /**
   * @todo ReferenceError: r is not defined in plugins/context2d.js (line 9)
   */
  xit('should render issue121.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue121.svg')
    comparePdf(doc.output(), 'issue121.pdf', 'svg')
  })

  /**
   * @todo ctx.createRadialGradient
   */
  xit('should render issue122.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue122.svg')
    comparePdf(doc.output(), 'issue122.pdf', 'svg')
  })

  /**
   * @todo ctx.createRadialGradient
   */
  xit('should render issue125a.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue125a.svg')
    comparePdf(doc.output(), 'issue125a.pdf', 'svg')
  })

  /**
   * @todo ctx.createRadialGradient
   */
  xit('should render issue125b.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue125b.svg')
    comparePdf(doc.output(), 'issue125b.pdf', 'svg')
  })

  /**
   * @todo:     TypeError: moves[(moves.length - 1)] is undefined in plugins/context2d.js (line 9)
   */
  xit('should render issue128.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue128.svg')
    comparePdf(doc.output(), 'issue128.pdf', 'svg')
  })

  /**
   * @todo: ctx.createRadialGradient
   * @type {RegExp}
   */
  xit('should render issue132.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue132.svg')
    comparePdf(doc.output(), 'issue132.pdf', 'svg')
  })

  /**
   * @todo this breaks the coverage
   */
  xit('should render issue134.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue134.svg')
    comparePdf(doc.output(), 'issue134.pdf', 'svg')
  })

  /**
   * @todo: dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue135.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue135.svg')
    comparePdf(doc.output(), 'issue135.pdf', 'svg')
  })
  /**
   * @todo This kills the coverage
   */
  xit('should render issue137.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue137.svg')
    comparePdf(doc.output(), 'issue137.pdf', 'svg')
  })
  /**
   * @todo This kills the coverage
   */
  xit('should render issue138.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue138.svg')
    comparePdf(doc.output(), 'issue138.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue142.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue142.svg')
    comparePdf(doc.output(), 'issue142.pdf', 'svg')
  })

  /**
   * @todo document mismatch
   */
  xit('should render issue144.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue144.svg')
    comparePdf(doc.output(), 'issue144.pdf', 'svg')
  })

  /**
   * @todo Cannot read property 'nodeValue' of null
   */
  xit('should render issue145.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue145.svg')
    comparePdf(doc.output(), 'issue145.pdf', 'svg')
  })

  xit('should render issue158.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue158.svg')
    comparePdf(doc.output(), 'issue158.pdf', 'svg')
  })

  it('should render issue161.svg', () => {
    if (skipOnIe()) return

    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue161.svg')
    comparePdf(doc.output(), 'issue161.pdf', 'svg')
  })

  /**
   * @todo Cannot read property 'nodeValue' of null
   */
  xit('should render issue166.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue166.svg')
    comparePdf(doc.output(), 'issue166.pdf', 'svg')
  })

  /**
   * @todo ctx.createLinearGradient
   */
  xit('should render issue172.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue172.svg')
    comparePdf(doc.output(), 'issue172.pdf', 'svg')
  })

  it('should render issue175.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue175.svg')
    comparePdf(doc.output(), 'issue175.pdf', 'svg')
  })

  it('should render issue176.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue176.svg')
    comparePdf(doc.output(), 'issue176.pdf', 'svg')
  })

  /**
   * @todo ctx.createLinearGradient
   */
  xit('should render issue178.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue178.svg')
    comparePdf(doc.output(), 'issue178.pdf', 'svg')
  })

  it('should render issue179.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue179.svg')
    comparePdf(doc.output(), 'issue179.pdf', 'svg')
  })

  /**
   * @todo: ctx.createPattern
   */
  xit('should render issue180.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue180.svg')
    comparePdf(doc.output(), 'issue180.pdf', 'svg')
  })

  /**
   * @todo ctx.createLinearGradient
   */
  xit('should render issue181.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue181.svg')
    comparePdf(doc.output(), 'issue181.pdf', 'svg')
  })

  /**
   * @todo please ensure that the plugin for 'png' support is added
   */
  xit('should render issue182.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue182.svg')
    comparePdf(doc.output(), 'issue182.pdf', 'svg')
  })

  /**
   * @todo style.charAt is not a function in plugins/context2d.js (line 9)
   */
  xit('should render issue183.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue183.svg')
    comparePdf(doc.output(), 'issue183.pdf', 'svg')
  })

  /**
   * @todo ctx.createPattern
   */
  xit('should render issue184.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue184.svg')
    comparePdf(doc.output(), 'issue184.pdf', 'svg')
  })

  it('should render issue187.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue187.svg')
    comparePdf(doc.output(), 'issue187.pdf', 'svg')
  })

  /**
   * @todo This kills coverage reports
   */
  xit('should render issue195.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue195.svg')
    comparePdf(doc.output(), 'issue195.pdf', 'svg')
  })

  /**
   * @todo: ctx.createLinearGradient
   */
  xit('should render issue196.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue196.svg')
    comparePdf(doc.output(), 'issue196.pdf', 'svg')
  })

  /**
   * @todo:  dom.getAttributeNode(...) is null in plugins/svg.js
   */
  xit('should render issue197.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue197.svg')
    comparePdf(doc.output(), 'issue197.pdf', 'svg')
  })

  /**
   * Document mismatch
   */
  xit('should render issue202.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue202.svg')
    comparePdf(doc.output(), 'issue202.pdf', 'svg')
  })

  it('should render issue202b.svg', () => {
    if (skipOnIe()) return

    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue202b.svg')
    comparePdf(doc.output(), 'issue202b.pdf', 'svg')
  })

  /**
   * @todo TypeError: moves[(moves.length - 1)] is undefined in plugins/context2d.js (line 9)
   */
  xit('should render issue206.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue206.svg')
    comparePdf(doc.output(), 'issue206.pdf', 'svg')
  })

  /**
   * @todo svg.js:9 Error: <path> attribute d: Expected path command, "…22222900390625  N a N, N a N".
   */
  xit('should render issue211.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue211.svg')
    comparePdf(doc.output(), 'issue211.pdf', 'svg')
  })

  it('should render issue212.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue212.svg')
    comparePdf(doc.output(), 'issue212.pdf', 'svg')
  })

  /**
   * @todo: dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue217.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue217.svg')
    comparePdf(doc.output(), 'issue217.pdf', 'svg')
  })

  /**
   * @todo: dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue227.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue227.svg')
    comparePdf(doc.output(), 'issue227.pdf', 'svg')
  })

  /**
   * @todo: dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue229.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue229.svg')
    comparePdf(doc.output(), 'issue229.pdf', 'svg')
  })

  /**
   * @todo TypeError: moves[(moves.length - 1)] is undefined in plugins/context2d.js (line 9)
   */
  xit('should render issue231.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue231.svg')
    comparePdf(doc.output(), 'issue231.pdf', 'svg')
  })

  it('should render issue234.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue234.svg')
    comparePdf(doc.output(), 'issue234.pdf', 'svg')
  })

  it('should render issue234b.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue234b.svg')
    comparePdf(doc.output(), 'issue234b.pdf', 'svg')
  })

  it('should render issue234c.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue234c.svg')
    comparePdf(doc.output(), 'issue234c.pdf', 'svg')
  })

  it('should render issue234d.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue234d.svg')
    comparePdf(doc.output(), 'issue234d.pdf', 'svg')
  })

  it('should render issue234e.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue234e.svg')
    comparePdf(doc.output(), 'issue234e.pdf', 'svg')
  })

  it('should render issue238.svg', () => {
    if (skipOnIe()) return

    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue238.svg')
    comparePdf(doc.output(), 'issue238.pdf', 'svg')
  })

  it('should render issue24.svg', () => {
    if (skipOnIe()) return

    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue24.svg')
    comparePdf(doc.output(), 'issue24.pdf', 'svg')
  })

  /**
   * @todo ctx.createLinearGradient
   */
  xit('should render issue241.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue241.svg')
    comparePdf(doc.output(), 'issue241.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue244.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue244.svg')
    comparePdf(doc.output(), 'issue244.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue25.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue25.svg')
    comparePdf(doc.output(), 'issue25.pdf', 'svg')
  })

  /**
   * @type TypeError: dom is null in plugins/svg.js (line 9)
   */
  xit('should render issue255.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue255.svg')
    comparePdf(doc.output(), 'issue255.pdf', 'svg')
  })

  /**
   * @todo:  TypeError: dom.getAttributeNode(...) is null in plugins/svg.js
   */
  xit('should render issue268.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue268.svg')
    comparePdf(doc.output(), 'issue268.pdf', 'svg')
  })

  it('should render issue269.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue269.svg')
    comparePdf(doc.output(), 'issue269.pdf', 'svg')
  })

  it('should render issue273.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue273.svg')
    comparePdf(doc.output(), 'issue273.pdf', 'svg')
  })

  it('should render issue282.svg', () => {
    if (skipOnIe()) return

    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue282.svg')
    comparePdf(doc.output(), 'issue282.pdf', 'svg')
  })

  /**
   * @todo: dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue289.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue289.svg')
    comparePdf(doc.output(), 'issue289.pdf', 'svg')
  })

  /**
   * ctx.createRadialGradient
   */
  xit('should render issue3.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue3.svg')
    comparePdf(doc.output(), 'issue3.pdf', 'svg')
  })

  it('should render issue30.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue30.svg')
    comparePdf(doc.output(), 'issue30.pdf', 'svg')
  })

  /**
   * @todo Document mismatch
   */
  xit('should render issue32.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue32.svg')
    comparePdf(doc.output(), 'issue32.pdf', 'svg')
  })

  it('should render issue322.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue322.svg')
    comparePdf(doc.output(), 'issue322.pdf', 'svg')
  })

  it('should render issue33.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue33.svg')
    comparePdf(doc.output(), 'issue33.pdf', 'svg')
  })

  /**
   * @todo document mismatch
   */
  xit('should render issue34.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue34.svg')
    comparePdf(doc.output(), 'issue34.pdf', 'svg')
  })

  /**
   * ctx.createLinearGradient
   */
  xit('should render issue35.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue35.svg')
    comparePdf(doc.output(), 'issue35.pdf', 'svg')
  })

  /**
   * @todo TypeError: dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue352.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue352.svg')
    comparePdf(doc.output(), 'issue352.pdf', 'svg')
  })

  /**
   * @todo ctx.createPattern
   */
  xit('should render issue358.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue358.svg')
    comparePdf(doc.output(), 'issue358.pdf', 'svg')
  })

  it('should render issue36.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue36.svg')
    comparePdf(doc.output(), 'issue36.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue362.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue362.svg')
    comparePdf(doc.output(), 'issue362.pdf', 'svg')
  })

  /**
   * @todo ctx.createRadialGradient
   */
  xit('should render issue366.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue366.svg')
    comparePdf(doc.output(), 'issue366.pdf', 'svg')
  })

  /**
   * @todo ctx.createRadialGradient
   */
  xit('should render issue372.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue372.svg')
    comparePdf(doc.output(), 'issue372.pdf', 'svg')
  })

  it('should render issue376.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue376.svg')
    comparePdf(doc.output(), 'issue376.pdf', 'svg')
  })

  /**
   * @todo Document mismatch
   */
  xit('should render issue38.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue38.svg')
    comparePdf(doc.output(), 'issue38.pdf', 'svg')
  })

  /**
   * @todo Document mismatch
   */
  xit('should render issue39.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue39.svg')
    comparePdf(doc.output(), 'issue39.pdf', 'svg')
  })

  /**
   * @todo ctx.createPattern
   */
  xit('should render issue40.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue40.svg')
    comparePdf(doc.output(), 'issue40.pdf', 'svg')
  })

  /**
   * @todo ctx.createPattern
   */
  xit('should render issue41.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue41.svg')
    comparePdf(doc.output(), 'issue41.pdf', 'svg')
  })

  it('should render issue42.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue42.svg')
    comparePdf(doc.output(), 'issue42.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue44.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue44.svg')
    comparePdf(doc.output(), 'issue44.pdf', 'svg')
  })

  /**
   * @todo ctx.createLinearGradient
   */
  xit('should render issue45.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue45.svg')
    comparePdf(doc.output(), 'issue45.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue46.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue46.svg')
    comparePdf(doc.output(), 'issue46.pdf', 'svg')
  })

  /**
   * @todo: ctx.createRadialGradient
   */
  xit('should render issue48.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue48.svg')
    comparePdf(doc.output(), 'issue48.pdf', 'svg')
  })

  /**
   * @todo: ctx.createRadialGradient
   */
  xit('should render issue50.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue50.svg')
    comparePdf(doc.output(), 'issue50.pdf', 'svg')
  })

  it('should render issue52.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue52.svg')
    comparePdf(doc.output(), 'issue52.pdf', 'svg')
  })

  it('should render issue54.svg', () => {
    if (skipOnIe()) return

    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue54.svg')
    comparePdf(doc.output(), 'issue54.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue55.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue55.svg')
    comparePdf(doc.output(), 'issue55.pdf', 'svg')
  })

  it('should render issue57.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue57.svg')
    comparePdf(doc.output(), 'issue57.pdf', 'svg')
  })

  /**
   * @todo ctx.createLinearGradient
   */
  xit('should render issue57b.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue57b.svg')
    comparePdf(doc.output(), 'issue57b.pdf', 'svg')
  })

  /**
   * Mismatch document
   */
  xit('should render issue66.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue66.svg')
    comparePdf(doc.output(), 'issue66.pdf', 'svg')
  })

  it('should render issue67.svg', () => {
    if (skipOnIe()) return

    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue67.svg')
    comparePdf(doc.output(), 'issue67.pdf', 'svg')
  })

  /**
   * @todo createRadialGradient
   */
  xit('should render issue70.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue70.svg')
    comparePdf(doc.output(), 'issue70.pdf', 'svg')
  })

  it('should render issue71.svg', () => {
    if (skipOnIe()) return

    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue71.svg')
    comparePdf(doc.output(), 'issue71.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue73.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue73.svg')
    comparePdf(doc.output(), 'issue73.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue75.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue75.svg')
    comparePdf(doc.output(), 'issue75.pdf', 'svg')
  })

  /**
   * @todo ctx.createLinearGradient
   */
  xit('should render issue76.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue76.svg')
    comparePdf(doc.output(), 'issue76.pdf', 'svg')
  })

  it('should render issue77.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue77.svg')
    comparePdf(doc.output(), 'issue77.pdf', 'svg')
  })

  it('should render issue79.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue79.svg')
    comparePdf(doc.output(), 'issue79.pdf', 'svg')
  })

  it('should render issue8.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue8.svg')
    comparePdf(doc.output(), 'issue8.pdf', 'svg')
  })

  /**
   * @todo Mismatch
   */
  xit('should render issue82.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue82.svg')
    comparePdf(doc.output(), 'issue82.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js (line 9)
   */
  xit('should render issue85.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue85.svg')
    comparePdf(doc.output(), 'issue85.pdf', 'svg')
  })

  /**
   * @todo ctx.createLinearGradient
   */
  xit('should render issue88.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue88.svg')
    comparePdf(doc.output(), 'issue88.pdf', 'svg')
  })

  /**
   * @todo ctx.createRadialGradient
   */
  xit('should render issue89.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue89.svg')
    comparePdf(doc.output(), 'issue89.pdf', 'svg')
  })

  /**
   * @todo style.charAt is not a function in plugins/context2d.js
   */
  xit('should render issue91.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue91.svg')
    comparePdf(doc.output(), 'issue91.pdf', 'svg')
  })

  /**
   * @todo Document mismatch
   */
  xit('should render issue94.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue94.svg')
    comparePdf(doc.output(), 'issue94.pdf', 'svg')
  })

  /**
   * @todo: This kills Firefox coverage
   */
  xit('should render issue97.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue97.svg')
    comparePdf(doc.output(), 'issue97.pdf', 'svg')
  })

  it('should render issue98.svg', () => {
    if (skipOnIe()) return

    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue98.svg')
    comparePdf(doc.output(), 'issue98.pdf', 'svg')
  })

  it('should render issue99.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/issue99.svg')
    comparePdf(doc.output(), 'issue99.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js
   */
  xit('should render lydianv-webfont.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/lydianv-webfont.svg')
    comparePdf(doc.output(), 'lydianv-webfont.pdf', 'svg')
  })

  /**
   * @todo dom.getAttributeNode(...) is null in plugins/svg.js
   */
  xit('should render swz721b-webfont.svg', () => {
    const doc = jsPDF()
    doc.svg('base/tests/svg/input/swz721b-webfont.svg')
    comparePdf(doc.output(), 'swz721b-webfont.pdf', 'svg')
  })
})
