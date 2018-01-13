/** @preserve
 * jsPDF fromDOM plugin. API subject to change. Needs browser
 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 Daniel Husar, https://github.com/danielhusar
 *               2014 Wolfgang Gassler, https://github.com/woolfg
 *               2014 Steven Spungin, https://github.com/flamenco
 *               2018 Aras Abbasi
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

(function (jsPDFAPI) {
  'use strict';

  var Renderer = function (jsPDFObject, settings) {
    this.pdf = jsPDFObject;
    this.settings = settings || {};
    
    //initialize "private" Attributes
    this.elementHandlers = {};
    this.lastTextColor = '';
    this.paragraph = {};
    this.x = 0;
    this.y = 0;
    this.watchFunctions = [];
    this.priorMarginBottom = 0;
    this.paragraph = {
            text : [],
            style : [],
            blockstyle : {},
            priorblockstyle : {}
          };
    this.nodesToSkip = ['SCRIPT', 
                'STYLE', 
                'NOSCRIPT', 
                'OBJECT', 
                'EMBED', 
                'SELECT'];

    this.images = {};
    this.scaleFactor = 0;
    
    this.FontWeightMap = {
      100     : 'normal',
      200     : 'normal',
      300     : 'normal',
      400     : 'normal',
      500     : 'bold',
      600     : 'bold',
      700     : 'bold',
      800     : 'bold',
      900     : 'bold',
      normal  : 'normal',
      bold    : 'bold',
      bolder  : 'bold',
      lighter : 'normal'
    };

    this.FontStyleMap = {
      normal  : 'normal',
      italic  : 'italic',
      oblique : 'italic'
    };

    this.TextAlignMap = {
      left    : 'left',
      right   : 'right',
      center  : 'center',
      justify : 'justify'
    };

    this.FloatMap = {
      none : 'none',
      right: 'right',
      left: 'left'
    };

    this.ClearMap = {
      none : 'none',
      both : 'both'
    };

    this.UnitedNumberMap = {
      normal : 1
    };       
    
    //list of functions which are called after each element-rendering process
    this.init();
    return this;
  };

  Renderer.prototype.init = function () {
  this.scaleFactor = this.pdf.internal.scaleFactor;
    return this.pdf.internal.write('q');
  };
  
  Renderer.prototype.dispose = function () {
    this.pdf.internal.write('Q');
    return {
      x : this.x,
      y : this.y,
      ready: true
    };
  };
  
  Renderer.prototype.sanitizeElement = function (element) {
  var result;
  
    if (typeof element !== 'string' && !element.parentNode) {
        result = '' + element.innerHTML;
    } else if (typeof element === 'string') {
        result = (function (element) {
          var $frame,
          $hiddendiv,
          framename,
          visuallyhidden;
          framename = 'jsPDFhtmlText' + Date.now().toString() + (Math.random() * 1000).toFixed(0);
          visuallyhidden = 'position: absolute !important;' + 'clip: rect(1px 1px 1px 1px); /* IE6, IE7 */' + 'clip: rect(1px, 1px, 1px, 1px);' + 'padding:0 !important;' + 'border:0 !important;' + 'height: 1px !important;' + 'width: 1px !important; ' + 'top:auto;' + 'left:-100px;' + 'overflow: hidden;';
          $hiddendiv = document.createElement('div');
          $hiddendiv.style.cssText = visuallyhidden;
          $hiddendiv.innerHTML = '<iframe style=\'height:1px;width:1px\' name=\'' + framename + '\' />';
          document.body.appendChild($hiddendiv);
          $frame = window.frames[framename];
          $frame.document.open();
          $frame.document.writeln(element);
          $frame.document.close();
          return $frame.document.body;
        })(element.replace(/<\/?script[^>]*?>/gi, ''));
    } else {
      throw "fromDOM: Not valid HTML-data provided to fromDOM-Method";
    }
    return result;
  };
  
  Renderer.prototype.convert = function (element, x, y, callback) {
    this.x = x || 0;
    this.y = y || 0;
    if (!element) {
      return false;
    }

    var renderer = this;

      // 1. load images
    renderer.loadImages(element, renderer.settings, function (found_images) {
      // 2. prepare optional footer elements
      renderer.renderFooter( element);
      // 3. render content
      renderer.drillForContent(element, renderer.elementHandlers);
      //send event dispose for final taks (e.g. footer totalpage replacement)
      renderer.pdf.internal.events.publish('htmlRenderingFinished');
      
      if (typeof callback === 'function') {
        callback(renderer.dispose());
      } else if (found_images) {
        console.error('Resulting jsPDF Document has to be processed in a callback-method');
      }    
    });
    return renderer.dispose() || {x: renderer.x, y:renderer.y};
  };

  //Checks if we have to execute some watcher functions
  //e.g. to end text floating around an image
  Renderer.prototype.executeWatchFunctions = function(element) {
    var result = false;
    var tmpArray = [];
    if (this.watchFunctions.length > 0) {
      for(var i=0; i< this.watchFunctions.length; ++i) {
        if (this.watchFunctions[i](element) === true) {
          result = true;
        } else {
          tmpArray.push(this.watchFunctions[i]);
        }
      }
      this.watchFunctions = tmpArray;
    }
    return result;
  };
  
  Renderer.prototype.drillForContent = function (element) {
    var renderer = this;
    var currentChildNode = void 0;
    var childNodes = element.childNodes;
    var amountOfChildNodes = childNodes.length;
    var fragmentCSS = this.getCSS(element);
    var isBlockElement = (fragmentCSS.display === 'block');
    var i = 0;
    var listCount = 1;
    var callback;

    if (isBlockElement) {
      renderer.renderBlockElement();
      renderer.setBlockStyle(fragmentCSS);
    }

    while (i < amountOfChildNodes) {
      currentChildNode = childNodes[i];
      if (typeof currentChildNode === 'object') {

          //execute all watcher functions to e.g. reset floating
          renderer.executeWatchFunctions(currentChildNode);

          /*** HEADER rendering **/
          if (currentChildNode.nodeType === 1 && currentChildNode.nodeName === 'HEADER') {
            renderer.renderHeader(currentChildNode);
          }

          if (currentChildNode.nodeType === 8 && currentChildNode.nodeName === '#comment') {
            if (~currentChildNode.textContent.indexOf('ADD_PAGE')) {
              renderer.pdf.addPage();
              renderer.y = renderer.pdf.margins_doc.top;
            }

          } else if (currentChildNode.nodeType === 1 && renderer.nodesToSkip.indexOf(currentChildNode.nodeName) === -1) {
            if (fragmentCSS['page-break-before'] === 'always') {
              renderer.pdf.addPage();
              renderer.y = renderer.pdf.margins_doc.top;
            }
            switch (currentChildNode.nodeName) {
              case 'IMG':
                renderer.renderImgNode(currentChildNode);
                break;
              case 'TABLE':
                renderer.pdf.table(renderer.x, renderer.y, currentChildNode, {
                  autoSize: false, //not supported
                  printHeaders: true, //not supported
                  margins: renderer.pdf.margins_doc,
                  scaleBasis: renderer.settings.table_scaleBasis,
                  tableFontSize: renderer.settings.table_fontSize
                });
                renderer.y = renderer.pdf.lastCellPos.y + renderer.pdf.lastCellPos.h + 20;
                break;
              case 'OL':
              case 'UL':
                listCount = 1;
                if (!renderer.elementHandledElsewhere(currentChildNode, renderer.elementHandlers)) {
                  renderer.drillForContent(currentChildNode, renderer.elementHandlers);
                }
                renderer.y += 10;
                break;
              case 'LI':
                var temp = renderer.x;
                renderer.x += 20 / renderer.scaleFactor;
                renderer.y += 3;
                if (!renderer.elementHandledElsewhere(currentChildNode, renderer.elementHandlers)) {
                  renderer.drillForContent(currentChildNode, renderer.elementHandlers);
                }
                renderer.x = temp;
                break;
              case 'BR':
                renderer.y += fragmentCSS['font-size'] * renderer.scaleFactor;
                renderer.addText('\u2028', renderer.cloneObject(fragmentCSS));
                break;
              case 'ADDRESS':
              case 'ARTICLE':
              case 'BLOCKQUOTE':
              case 'DD':
              case 'DIV':
              case 'DL':
              case 'FIELDSET':
              case 'FIGCAPTION':
              case 'FIGURE':
              case 'FOOTER':
              case 'FORM':
              case 'H1':
              case 'H2':
              case 'H3':
              case 'H4':
              case 'H5':
              case 'H6':
              case 'HR':
              case 'MAIN':
              case 'NAV':
              case 'NOSCRIPT':
              case 'OUTPUT':
              case 'P':
              case 'PRE':
              case 'SECTION':
              case 'VIDEO':
                if (!renderer.elementHandledElsewhere(currentChildNode, renderer.elementHandlers)) {
                  renderer.drillForContent(currentChildNode, renderer.elementHandlers);
                }
                break;
              case 'A':
              case 'ABBR':
              case 'ACRONYM':
              case 'B':
              case 'BDO':
              case 'BIG':
              case 'BUTTON':
              case 'CIDE':
              case 'CODE':
              case 'DFN':
              case 'EM':
              case 'I':
              case 'INPUT':
              case 'KBD':
              case 'LABEL':
              case 'MAP':
              case 'OBJECT':
              case 'Q':
              case 'SAMP':
              case 'SCRIPT':
              case 'SELECT':
              case 'SELECT':
              case 'SMALL':
              case 'SPAN':
              case 'STRONG':
              case 'SUB':
              case 'SUP':
              case 'TEXTAREA':
              case 'TIME':
              case 'TT':
              case 'VAR':
              default:
                if (!renderer.elementHandledElsewhere(currentChildNode, renderer.elementHandlers)) {
                  renderer.drillForContent(currentChildNode, renderer.elementHandlers);
                }
            }
            
            if (fragmentCSS['page-break-after'] === 'always') {
              renderer.pdf.addPage();
              renderer.y = renderer.pdf.margins_doc.top;
            }
          } else if (currentChildNode.nodeType === 3) {
            var nodeValue = currentChildNode.nodeValue;
            if (nodeValue && currentChildNode.parentNode.nodeName === 'LI') {
              if (currentChildNode.parentNode.parentNode.nodeName === 'OL') {
                nodeValue = listCount++ + '. ' + nodeValue;
              } else {
                var fontSize = fragmentCSS['font-size'];
                var offsetX = (3 - fontSize * 0.75) * renderer.scaleFactor;
                var offsetY = fontSize * 0.75 * renderer.scaleFactor;
                var radius = fontSize * 1.74 / renderer.scaleFactor;
                callback = function (x, y) {
                  this.pdf.circle(x + offsetX, y + offsetY, radius, 'FD');
                };
              }
            }
            // Only add the text if the text node is in the body element
            // Add compatibility with IE11
            if(!!(currentChildNode.ownerDocument.body.compareDocumentPosition(currentChildNode) & 16)){
              renderer.addText(nodeValue, fragmentCSS);
            }
          } else if (typeof currentChildNode === 'string') {
            renderer.addText(currentChildNode, fragmentCSS);
          }
        }
        i++;
      }
      renderer.elementHandlers.outY = renderer.y;

      if (isBlockElement) {
        return renderer.renderBlockElement(callback);
      }
    };
  Renderer.prototype.resolveUnitedNumber = function (css_line_height_string) {

      //IE8 issues
      css_line_height_string = css_line_height_string === 'auto' ? '0px' : css_line_height_string;
      if (css_line_height_string.indexOf('em') > -1 && !isNaN(Number(css_line_height_string.replace('em', '')))) {
        css_line_height_string = Number(css_line_height_string.replace('em', '')) * 18.719 + 'px';
      }
      if (css_line_height_string.indexOf('pt') > -1 && !isNaN(Number(css_line_height_string.replace('pt', '')))) {
        css_line_height_string = Number(css_line_height_string.replace('pt', '')) * 1.333 + 'px';
      }

      var normal,
      undef,
      value;
      undef = void 0;
      normal = 16.00;
      value = this.UnitedNumberMap[css_line_height_string];
      if (value) {
        return value;
      }
      value = {
        'xx-small'  :  9,
        'x-small'   : 11,
        'small'     : 13,
        'medium'    : 16,
        'large'     : 19,
        'x-large'   : 23,
        'xx-large'  : 28,
        'auto'      :  0
      }[{ css_line_height_string : css_line_height_string }];

      if (value !== undef) {
        return this.UnitedNumberMap[css_line_height_string] = value / normal;
      }
      if (value = parseFloat(css_line_height_string)) {
        return this.UnitedNumberMap[css_line_height_string] = value / normal;
      }
      value = css_line_height_string.match(/([\d\.]+)(px)/);
      if (value.length === 3) {
        return this.UnitedNumberMap[css_line_height_string] = parseFloat(value[1]) / normal;
      }
      return this.UnitedNumberMap[css_line_height_string] = 1;
    };

    Renderer.prototype.resolveFontFamilyByFontWeight = function (fontStyle, fontWeight) {
      var result = '';
      
      if (this.FontWeightMap[fontWeight] === 'bold') {
        if (fontStyle === 'normal') {
          result = 'bold';
        } else {
          result = 'normal' + fontStyle;
        }
      }
      return result;
    }
    
    Renderer.prototype.computeCSSOfElement = function (element) {
        var computedCSS = {};
        var tmpProperty;
        var property;
        var result = {};
        if (document.defaultView && document.defaultView.getComputedStyle) {
          computedCSS = document.defaultView.getComputedStyle(element, null);
        } else if (element.currentStyle) {
          computedCSS =  element.currentStyle;
        } else {
          computedCSS = element.style;
        }
        return computedCSS;
      };
    
    Renderer.prototype.getCSS = function (element) {
      var renderer = this;
      var computedCSSElement = renderer.computeCSSOfElement(element);
      
      var isBlockElement = false;
      var css = {};

      css['display']              = (computedCSSElement['display']) === 'inline' ? 'inline' : 'block';
      
      //float and clearing of floats
      css['float']                = this.FloatMap[computedCSSElement['cssFloat']]                                             || 'none';
      css['clear']                = this.ClearMap[computedCSSElement['clear']]                                                || 'none';

      //font-properties
      css['font-family']          = this.resolveFont(computedCSSElement['fontFamily'])                                   || 'times';
      css['font-style']           = this.resolveFontFamilyByFontWeight(this.FontStyleMap[computedCSSElement['fontStyle']], this.FontWeightMap[computedCSSElement["font-weight"]]);
      css['font-size']            = renderer.resolveUnitedNumber(computedCSSElement['fontSize'])                         || 1;
      css['text-align']           = this.TextAlignMap[computedCSSElement['textAlign']]                                        || 'left';
      css['line-height']          = renderer.resolveUnitedNumber(computedCSSElement['lineHeight'])                       || 1;
      css['color']                = computedCSSElement['color']                                                          || '#000000';
      
      //background
      css['background-image']     = computedCSSElement['backgroundImage']                                                || '';
      css['background-color']     = computedCSSElement['backgroundColor']                                                || '#ffffff';
      
      //border
      css['border-top-width']     = renderer.resolveUnitedNumber(computedCSSElement['borderTopWidth'])                   || 0;
      css['border-top-color']     = computedCSSElement['borderTopColor']                                                 || '#ffffff';
      css['border-top-style']     = computedCSSElement['borderTopStyle']                                                 || 'solid';
      css['border-right-width']   = renderer.resolveUnitedNumber(computedCSSElement['borderRightWidth'])                 || 0;
      css['border-right-color']   = computedCSSElement['borderRightColor']                                               || '#ffffff';
      css['border-right-style']   = computedCSSElement['borderRightStyle']                                               || 'solid';
      css['border-bottom-width']  = renderer.resolveUnitedNumber(computedCSSElement['borderBottomWidth'])                || 0;
      css['border-bottom-color']  = computedCSSElement['borderBottomColor']                                              || '#ffffff';
      css['border-bottom-style']  = computedCSSElement['borderBottomStyle']                                              || 'solid';
      css['border-left-width']    = renderer.resolveUnitedNumber(computedCSSElement['borderLeftWidth'])                  || 0;
      css['border-left-color']    = computedCSSElement['borderLeftColor']                                                || '#ffffff';
      css['border-left-style']    = computedCSSElement['borderLeftStyle']                                                || 'solid';

      css['page-break-after']     = computedCSSElement['pageBreakAfter']                                                 || 'auto';
      css['page-break-before']    = computedCSSElement['pageBreakBefore']                                                || 'auto';
      
      isBlockElement = (css['display'] === 'block');
      css['margin-top']           = isBlockElement && renderer.resolveUnitedNumber(computedCSSElement['marginTop'])      || 0;
      css['margin-bottom']        = isBlockElement && renderer.resolveUnitedNumber(computedCSSElement['marginBottom'])   || 0;
      css['padding-top']          = isBlockElement && renderer.resolveUnitedNumber(computedCSSElement['paddingTop'])     || 0;
      css['padding-bottom']       = isBlockElement && renderer.resolveUnitedNumber(computedCSSElement['paddingBottom'])  || 0;
      css['margin-left']          = isBlockElement && renderer.resolveUnitedNumber(computedCSSElement['marginLeft'])     || 0;
      css['margin-right']         = isBlockElement && renderer.resolveUnitedNumber(computedCSSElement['marginRight'])    || 0;
      css['padding-left']         = isBlockElement && renderer.resolveUnitedNumber(computedCSSElement['paddingLeft'])    || 0;
      css['padding-right']        = isBlockElement && renderer.resolveUnitedNumber(computedCSSElement['paddingRight'])   || 0;

      return css;
    };

  Renderer.prototype.loadImages = function (element, options, callback) {
  var renderer = this;
  var onlyImgElements = options.onlyImgElements || options.noCssBackgroundImages || false;
  
  if (onlyImgElements) {
    var nodeElementsToBeProcessed = element.getElementsByTagName('IMG');
  } else {
    var nodeElementsToBeProcessed = element.getElementsByTagName('*');
  }

    var l = nodeElementsToBeProcessed.length;
    var found_images = 0;
    var x = 0;
    var regExForExtractingContentFromCssUrl = /(?:\(['"]?)(.*?)(?:['"]?\))/;

    function done() {
      renderer.pdf.internal.events.publish('imagesLoaded');
      callback(found_images);
    }
    function loadImage(url, width, height) {
      //empty urls dont need to be loaded
      if (!url) {
        return;
      }
      var img = new Image();
      found_images = ++x;
      img.crossOrigin = 'anonymous';
      img.onerror = img.onload = function () {
        if(img.complete) {
          //to support data urls in images, set width and height
          //as those values are not recognized automatically
          if (img.src.indexOf('data:image/') === 0) {
            img.width = width || img.naturalWidth || img.width || 0;
            img.height = height || img.naturalHeight || img.height || 0;
          }
          //if valid image add to known images array
          if (img.width + img.height) {
            var hash = renderer.pdf.sHashCode(url) || url;
            renderer.images[hash] = renderer.images[hash] || img;
          }
        } else {
          console.error("Error while loading images");
        }
        if(!--x) {
          done();
        }
      };
      img.src = url;
    }
    while (l--) {
    }
    
    l = nodeElementsToBeProcessed.length;
      
    while (l--) {
      if (nodeElementsToBeProcessed[l].style.backgroundImage.length !== 0) {
        loadImage(regExForExtractingContentFromCssUrl.exec(nodeElementsToBeProcessed[l].style.backgroundImage)[1]);
      }
      if (onlyImgElements || nodeElementsToBeProcessed[l].tagName === 'IMG') {
        loadImage(nodeElementsToBeProcessed[l].getAttribute('src'), nodeElementsToBeProcessed[l].width, nodeElementsToBeProcessed[l].height);
      }
    }
    
    return x || done();
  };
  

  Renderer.prototype.elementHandledElsewhere = function (element) {
    var renderer = this;
    var isHandledElsewhere = false;
    
    var selectors = [];
    //Get CSS-selectors, e.g. ".editor"
    selectors = element.className ? ('.' + element.className).split(' ').join('.').split(' ') : [];
    //Get ID-selector, e.g. "#editor"
    if (element.id.length !== 0) {
      selectors.push('#' + element.id);
    }
    //Get node-selector, e.g. "H1"
    selectors.push(element.nodeName);
    var i = 0;
    var amountOfSelectors = selectors.length;
    while (!isHandledElsewhere && i !== amountOfSelectors) {
      if (typeof renderer.elementHandlers[selectors[i]] === 'function') {
        isHandledElsewhere = renderer.elementHandlers[selectors[i]](element, renderer);
      }
      i++;
    }
    return isHandledElsewhere;
  };
  
  /*** IMAGE RENDERING ***/
  Renderer.prototype.renderImgNode = function (cn) {
    var renderer = this;
    var cached_image;
    
    if (cn.nodeName === 'IMG') {
      var url = cn.getAttribute('src');
      cached_image = renderer.images[renderer.pdf.sHashCode(url) || url];
    }

    if (url.length === 0) {
      return;
    }
    if (cached_image) {
      if ((renderer.pdf.internal.pageSize.height - renderer.pdf.margins_doc.bottom < renderer.y + cn.height) && (renderer.y > renderer.pdf.margins_doc.top)) {
        renderer.pdf.addPage();
        renderer.y = renderer.pdf.margins_doc.top;
        //check if we have to set back some values due to e.g. header rendering for new page
        renderer.executeWatchFunctions(cn);
      }

      var imagesCSS = this.getCSS(cn);
      var imageX = renderer.x;
      var fontToUnitRatio = 12 / renderer.scaleFactor;

      //define additional paddings, margins which have to be taken into account for margin calculations
      var additionalSpaceLeft   = (imagesCSS['margin-left'] + imagesCSS['padding-left'])*fontToUnitRatio;
      var additionalSpaceRight  = (imagesCSS['margin-right'] + imagesCSS['padding-right'])*fontToUnitRatio;
      var additionalSpaceTop    = (imagesCSS['margin-top'] + imagesCSS['padding-top'])*fontToUnitRatio;
      var additionalSpaceBottom = (imagesCSS['margin-bottom'] + imagesCSS['padding-bottom'])*fontToUnitRatio;

      //if float is set to right, move the image to the right border
      //add space if margin is set
      if (imagesCSS['float'] !== undefined && imagesCSS['float'] === 'right') {
        imageX += renderer.settings.width - cn.width - additionalSpaceRight;
      } else {
        imageX +=  additionalSpaceLeft;
      }

      renderer.pdf.addImage(cached_image, imageX, renderer.y + additionalSpaceTop, cn.width, cn.height);
      cached_image = undefined;
      //if the float prop is specified we have to float the text around the image
      if (imagesCSS['float'] === 'right' || imagesCSS['float'] === 'left') {
        //add functiont to set back coordinates after image rendering
        renderer.watchFunctions.push((function(diffX , thresholdY, diffWidth, el) {
          //undo drawing box adaptions which were set by floating
          if (renderer.y >= thresholdY) {
            renderer.x += diffX;
            renderer.settings.width += diffWidth;
            return true;
          } else if(el && el.nodeType === 1 && (renderer.nodesToSkip.indexOf(currentChildNode.nodeName) === -1) && renderer.x+el.width > (renderer.pdf.margins_doc.left + renderer.pdf.margins_doc.width)) {
            renderer.x += diffX;
            renderer.y = thresholdY;
            renderer.settings.width += diffWidth;
            return true;
          } else {
            return false;
          }
        }).bind(this, (imagesCSS['float'] === 'left') ? -cn.width-additionalSpaceLeft-additionalSpaceRight : 0, renderer.y+cn.height+additionalSpaceTop+additionalSpaceBottom, cn.width));
        //reset floating by clear:both divs
        //just set cursorY after the floating element
        renderer.watchFunctions.push((function(yPositionAfterFloating, pages, el) {
          if (renderer.y < yPositionAfterFloating && pages === renderer.pdf.internal.getNumberOfPages()) {
            if (el.nodeType === 1 && this.getCSS(el).clear === 'both') {
              renderer.y = yPositionAfterFloating;
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        }).bind(this, renderer.y+cn.height, renderer.pdf.internal.getNumberOfPages()));

        //if floating is set we decrease the available width by the image width
        renderer.settings.width -= cn.width+additionalSpaceLeft+additionalSpaceRight;
        //if left just add the image width to the X coordinate
        if (imagesCSS['float'] === 'left') {
          renderer.x += cn.width+additionalSpaceLeft+additionalSpaceRight;
        }
      } else {
      //if no floating is set, move the rendering cursor after the image height
        renderer.y += cn.height + additionalSpaceTop + additionalSpaceBottom;
      }
    }
  };
  Renderer.prototype.renderHeader = function (headerElement) {
    var renderer = this;
      if (headerElement.nodeType === 1 && headerElement.nodeName === 'HEADER') {
          //store old top margin
          var oldMarginTop = renderer.pdf.margins_doc.top;
          //subscribe for new page event and render header first on every page
          renderer.pdf.internal.events.subscribe('addPage', function (pageInfo) {
            //set current y position to old margin
            renderer.y = oldMarginTop;
            //render all child nodes of the header element
            renderer.drillForContent(headerElement, renderer.elementHandlers);
            //set margin to old margin + rendered header + 10 space to prevent overlapping
            //important for other plugins (e.g. table) to start rendering at correct position after header
            renderer.pdf.margins_doc.top = renderer.y + 10;
            renderer.y += 10;
          }, false);
        }
  }
  Renderer.prototype.renderFooter = function (element) {
  var renderer = this;
    //check if we can found a <footer> element
    var footer = element.getElementsByTagName('footer');
    if (footer.length > 0) {

      footer = footer[0];

      //bad hack to get height of footer
      //creat dummy out and check new y after fake rendering
      var oldOut = renderer.pdf.internal.write;
      var oldY = renderer.y;
      renderer.pdf.internal.write = function () {};
      renderer.drillForContent(footer, renderer.elementHandlers);
      var footerHeight = Math.ceil(renderer.y - oldY) + 5;
      renderer.y = oldY;
      renderer.pdf.internal.write = oldOut;

      //add 20% to prevent overlapping
      renderer.pdf.margins_doc.bottom += footerHeight;

      //Create function render footer on every page
      var renderFooter = function (pageInfo) {
        var pageNumber = pageInfo !== undefined ? pageInfo.pageNumber : 1;
        //set current y position to old margin
        var oldPosition = renderer.y;
        //render all child nodes of the header element
        renderer.y = renderer.pdf.internal.pageSize.height - renderer.pdf.margins_doc.bottom;
        renderer.pdf.margins_doc.bottom -= footerHeight;

        //check if we have to add page numbers
        var spans = footer.getElementsByTagName('span');
        for (var i = 0; i < spans.length; ++i) {
          //if we find some span element with class pageCounter, set the page
          if ((' ' + spans[i].className + ' ').replace(/[\n\t]/g, ' ').indexOf(' pageCounter ') > -1) {
            spans[i].innerHTML = pageNumber;
          }
          //if we find some span element with class totalPages, set a variable which is replaced after rendering of all pages
          if ((' ' + spans[i].className + ' ').replace(/[\n\t]/g, ' ').indexOf(' totalPages ') > -1) {
            spans[i].innerHTML = '###jsPDFVarTotalPages###';
          }
        }

        //render footer content
        renderer.drillForContent(footer, renderer.elementHandlers);
        //set bottom margin to previous height including the footer height
        renderer.pdf.margins_doc.bottom += footerHeight;
        //important for other plugins (e.g. table) to start rendering at correct position after header
        renderer.y = oldPosition;
      };

      //check if footer contains totalPages which should be replace at the disoposal of the document
      var spans = footer.getElementsByTagName('span');
      for (var i = 0; i < spans.length; ++i) {
        if ((' ' + spans[i].className + ' ').replace(/[\n\t]/g, ' ').indexOf(' totalPages ') > -1) {
          renderer.pdf.internal.events.subscribe('htmlRenderingFinished', renderer.pdf.putTotalPages.bind(renderer.pdf, '###jsPDFVarTotalPages###'), true);
        }
      }

      //register event to render footer on every new page
      renderer.pdf.internal.events.subscribe('addPage', renderFooter, false);
      //render footer on first page
      renderFooter();

      //prevent footer rendering
      renderer.nodesToSkip.push('FOOTER');
    }
  };

  Renderer.prototype.resolveFont = function (css_font_family_string) {
    var name,
    part,
    parts;
    name = void 0;
    parts = css_font_family_string.split(',');
    part = parts.shift();
    while (!name && part) {
      switch (part.trim().toLowerCase()) {
        case 'helvetica':
        case 'helvetica neue':
        case 'sans-serif':
          name = 'helvetica';
          break;
        case 'times new roman':
        case 'times':
        case 'serif':
          name = 'times';
          break;
        case 'monospace':
        case 'courier':
        case 'courier new':
          name = 'courier';
          break;
      }
      part = parts.shift();
    }
    return name;
  };
  

  Renderer.prototype.purgeWhiteSpace = function (array) {
    var fragment,
    i,
    l,
    lTrimmed,
    r,
    rTrimmed,
    trailingSpace;
    i = 0;
    l = array.length;
    fragment = void 0;
    lTrimmed = false;
    rTrimmed = false;
    while (!lTrimmed && i !== l) {
      fragment = array[i] = array[i].trimLeft();
      if (fragment) {
        lTrimmed = true;
      }
      i++;
    }
    i = l - 1;
    while (l && !rTrimmed && i !== -1) {
      fragment = array[i] = array[i].trimRight();
      if (fragment) {
        rTrimmed = true;
      }
      i--;
    }
    r = /\s+$/g;
    trailingSpace = true;
    i = 0;
    while (i !== l) {
      // Leave the line breaks intact
      if (array[i] != '\u2028') {
        fragment = array[i].replace(/\s+/g, ' ');
        if (trailingSpace) {
          fragment = fragment.trimLeft();
        }
        if (fragment) {
          trailingSpace = r.test(fragment);
        }
        array[i] = fragment;
      }
      i++;
    }
    return array;
  };
  
  Renderer.prototype.splitFragmentsIntoLines = function (fragments, styles) {
    var currentLineLength,
    defaultFontSize,
    ff,
    fontMetrics,
    fontMetricsCache,
    fragment,
    fragmentChopped,
    fragmentLength,
    fragmentSpecificMetrics,
    fs,
    k,
    line,
    lines,
    maxLineLength,
    style;
    defaultFontSize = 12;
    var renderer = this;
    k = this.pdf.internal.scaleFactor;
    fontMetricsCache = {};
    ff = void 0;
    fs = void 0;
    fontMetrics = void 0;
    fragment = void 0;
    style = void 0;
    fragmentSpecificMetrics = void 0;
    fragmentLength = void 0;
    fragmentChopped = void 0;
    line = [];
    lines = [line];
    currentLineLength = 0;
    maxLineLength = this.settings.width;
    while (fragments.length) {
      fragment = fragments.shift();
      style = styles.shift();
      if (fragment) {
        ff = style['font-family'];
        fs = style['font-style'];
        fontMetrics = fontMetricsCache[ff + fs];
        if (!fontMetrics) {
          fontMetrics = this.pdf.internal.getFont(ff, fs).metadata.Unicode;
          fontMetricsCache[ff + fs] = fontMetrics;
        }
        fragmentSpecificMetrics = {
          widths : fontMetrics.widths,
          kerning : fontMetrics.kerning,
          fontSize : style['font-size'] * defaultFontSize,
          textIndent : currentLineLength
        };
        fragmentLength = this.pdf.getStringUnitWidth(fragment, fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
        if (fragment == '\u2028') {
          line = [];
          lines.push(line);
        } else if (currentLineLength + fragmentLength > maxLineLength) {
          fragmentChopped = this.pdf.splitTextToSize(fragment, maxLineLength, fragmentSpecificMetrics);
          line.push([fragmentChopped.shift(), style]);
          while (fragmentChopped.length) {
            line = [[fragmentChopped.shift(), style]];
            lines.push(line);
          }
          currentLineLength = this.pdf.getStringUnitWidth(line[0][0], fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
        } else {
          line.push([fragment, style]);
          currentLineLength += fragmentLength;
        }
      }
    }

    //if text alignment was set, set margin/indent of each line
    if (style['text-align'] !== undefined && (style['text-align'] === 'center' || style['text-align'] === 'right' || style['text-align'] === 'justify')) {
      for (var i = 0; i < lines.length; ++i) {
        var length = this.pdf.getStringUnitWidth(lines[i][0][0], fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
        //if there is more than on line we have to clone the style object as all lines hold a reference on this object
        if (i > 0) {
          lines[i][0][1] = renderer.cloneObject(lines[i][0][1]);
        }
        var space = (maxLineLength - length);

        if (style['text-align'] === 'right') {
          lines[i][0][1]['margin-left'] = space;
          //if alignment is not right, it has to be center so split the space to the left and the right
        } else if (style['text-align'] === 'center') {
          lines[i][0][1]['margin-left'] = space / 2;
          //if justify was set, calculate the word spacing and define in by using the css property
        } else if (style['text-align'] === 'justify') {
          var countSpaces = lines[i][0][0].split(' ').length - 1;
          lines[i][0][1]['word-spacing'] = space / countSpaces;
          //ignore the last line in justify mode
          if (i === (lines.length - 1)) {
            lines[i][0][1]['word-spacing'] = 0;
          }
        }
      }
    }

    return lines;
  };
  Renderer.prototype.renderTextFragment = function (text, style) {
    var defaultFontSize,
    font,
    maxLineHeight;

    maxLineHeight = 0;
    defaultFontSize = 12;

    if (this.pdf.internal.pageSize.height - this.pdf.margins_doc.bottom < this.y + this.pdf.internal.getFontSize()) {
      this.pdf.internal.write('ET', 'Q');
      this.pdf.addPage();
      this.y = this.pdf.margins_doc.top;
      this.pdf.internal.write('q', 'BT',  this.getPdfColor(style.color), this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y),  'Td');
      //move cursor by one line on new page
      maxLineHeight = Math.max(maxLineHeight, style['line-height'], style['font-size']);
      this.pdf.internal.write(0, (-1 * defaultFontSize * maxLineHeight).toFixed(2), 'Td');
    }

    font = this.pdf.internal.getFont(style['font-family'], style['font-style']);

    // text color
    var pdfTextColor = this.getPdfColor(style['color']);
    if (pdfTextColor !== this.lastTextColor) {
      this.pdf.internal.write(pdfTextColor);
      this.lastTextColor = pdfTextColor;
    }

    //set the word spacing for e.g. justify style
    if (style['word-spacing'] !== undefined && style['word-spacing'] > 0) {
      this.pdf.internal.write(style['word-spacing'].toFixed(2), 'Tw');
    }

    this.pdf.internal.write('/' + font.id, (defaultFontSize * style['font-size']).toFixed(2), 'Tf', '(' + this.pdf.internal.pdfEscape(text) + ') Tj');


    //set the word spacing back to neutral => 0
    if (style['word-spacing'] !== undefined) {
      this.pdf.internal.write(0, 'Tw');
    }
  };

  // Accepts #FFFFFF, rgb(int,int,int), or CSS Color Name
  Renderer.prototype.getPdfColor = function(cssColor) {
    var textColor;
    var r,g,b;
    var cssColorNames = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
      "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
      "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
      "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
      "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
      "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
      "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
      "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
      "honeydew":"#f0fff0","hotpink":"#ff69b4",
      "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
      "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
      "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
      "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
      "navajowhite":"#ffdead","navy":"#000080",
      "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
      "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
      "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
      "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
      "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
      "violet":"#ee82ee",
      "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
      "yellow":"#ffff00","yellowgreen":"#9acd32"};

    var rx = /rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+\s*)\)/;
    var f3 = function(number) {
      return number.toFixed(3); // Ie, %.3f
    }
    var m = rx.exec(cssColor);
    if (m != null){
      r = parseInt(m[1]);
      g = parseInt(m[2]);
      b = parseInt(m[3]);
    } else{
      if (cssColor.charAt(0) !== '#') {
        cssColor = cssColorNames[cssColor];
        if (!cssColor) {
          cssColor = '#000000';
        }
      }
      r = cssColor.substring(1, 3);
      r = parseInt(r, 16);
      g = cssColor.substring(3, 5);
      g = parseInt(g, 16);
      b = cssColor.substring(5, 7);
      b = parseInt(b, 16);
    }

    if ((typeof r === 'string') && /^#[0-9A-Fa-f]{6}$/.test(r)) {
      var hex = parseInt(r.substr(1), 16);
      r = (hex >> 16) & 255;
      g = (hex >> 8) & 255;
      b = (hex & 255);
    }
    if ((r === 0 && g === 0 && b === 0) || (typeof g === 'undefined')) {
      textColor = f3(r / 255) + ' g';
    } else {
      textColor = [f3(r / 255), f3(g / 255), f3(b / 255), 'rg'].join(' ');
    }
    return textColor;
  };

  Renderer.prototype.renderBlockElement = function (callback) {
    var blockstyle,
    defaultFontSize,
    fontToUnitRatio,
    fragments,
    i,
    l,
    line,
    lines,
    maxLineHeight,
    out,
    paragraphspacing_after,
    paragraphspacing_before,
    priorblockstyle,
    styles,
    fontSize;
    fragments = this.purgeWhiteSpace(this.paragraph.text);
    styles = this.paragraph.style;
    blockstyle = this.paragraph.blockstyle;
    priorblockstyle = this.paragraph.priorblockstyle || {};
    this.paragraph = {
      text : [],
      style : [],
      blockstyle : {},
      priorblockstyle : blockstyle
    };
    if (!fragments.join('').trim()) {
      return;
    }
    lines = this.splitFragmentsIntoLines(fragments, styles);
    line = void 0;
    maxLineHeight = void 0;
    defaultFontSize = 12;
    fontToUnitRatio = defaultFontSize / this.pdf.internal.scaleFactor;
    this.priorMarginBottom =  this.priorMarginBottom || 0;
    paragraphspacing_before = (Math.max((blockstyle['margin-top'] || 0) - this.priorMarginBottom, 0) + (blockstyle['padding-top'] || 0)) * fontToUnitRatio;
    paragraphspacing_after = ((blockstyle['margin-bottom'] || 0) + (blockstyle['padding-bottom'] || 0)) * fontToUnitRatio;
    this.priorMarginBottom =  blockstyle['margin-bottom'] || 0;

    if (blockstyle['page-break-before'] === 'always'){
      this.pdf.addPage();
      this.y = 0;
      paragraphspacing_before = ((blockstyle['margin-top'] || 0) + (blockstyle['padding-top'] || 0)) * fontToUnitRatio;
    }

    out = this.pdf.internal.write;
    i = void 0;
    l = void 0;
    this.y += paragraphspacing_before;
    out('q', 'BT 0 g', this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), 'Td');

    //stores the current indent of cursor position
    var currentIndent = 0;

    while (lines.length) {
      line = lines.shift();
      maxLineHeight = 0;
      i = 0;
      l = line.length;
      while (i !== l) {
        if (line[i][0].trim()) {
          maxLineHeight = Math.max(maxLineHeight, line[i][1]['line-height'], line[i][1]['font-size']);
          fontSize = line[i][1]['font-size'] * 7;
        }
        i++;
      }
      //if we have to move the cursor to adapt the indent
      var indentMove = 0;
      var wantedIndent = 0;
      //if a margin was added (by e.g. a text-alignment), move the cursor
      if (line[0][1]['margin-left'] !== undefined && line[0][1]['margin-left'] > 0) {
        wantedIndent = this.pdf.internal.getCoordinateString(line[0][1]['margin-left']);
        indentMove = wantedIndent - currentIndent;
        currentIndent = wantedIndent;
      }
      var indentMore = (Math.max(blockstyle['margin-left'] || 0, 0)) * fontToUnitRatio;
      //move the cursor
      out(indentMove + indentMore, (-1 * defaultFontSize * maxLineHeight).toFixed(2), 'Td');
      i = 0;
      l = line.length;
      while (i !== l) {
        if (line[i][0]) {
          this.renderTextFragment(line[i][0], line[i][1]);
        }
        i++;
      }
      this.y += maxLineHeight * fontToUnitRatio;

      //if some watcher function was executed successful, so e.g. margin and widths were changed,
      //reset line drawing and calculate position and lines again
      //e.g. to stop text floating around an image
      if (this.executeWatchFunctions(line[0][1]) && lines.length > 0) {
        var localFragments = [];
        var localStyles = [];
        //create fragment array of
        lines.forEach(function(localLine) {
          var i = 0;
          var l = localLine.length;
          while (i !== l) {
            if (localLine[i][0]) {
              localFragments.push(localLine[i][0]+' ');
              localStyles.push(localLine[i][1]);
            }
            ++i;
          }
        });
        //split lines again due to possible coordinate changes
        lines = this.splitFragmentsIntoLines(this.purgeWhiteSpace(localFragments), localStyles);
        //reposition the current cursor
        out('ET', 'Q');
        out('q', 'BT 0 g', this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), 'Td');
      }

    }
    if (callback && typeof callback === 'function') {
      callback.call(this, this.x - 9, this.y - fontSize / 2);
    }
    out('ET', 'Q');

    return this.y += paragraphspacing_after;
  };
  
  Renderer.prototype.setBlockStyle = function (fragmentCSS) {
      return this.paragraph.blockstyle = fragmentCSS;
  };
  
  Renderer.prototype.addText = function (text, css) {
    this.paragraph.text.push(text);
    return this.paragraph.style.push(css);
  };
  
  Renderer.prototype.cloneObject = (function () {
    function CloneObject() {}
    return function (obj) {
      CloneObject.prototype = obj;
      return new CloneObject()
    };
  })();
  
  /**
   * If the selector is not id-Selector or class-Selector than it has to be a 
   * nodeName-Selector. id- and class-Selectors are obviously case sensitive, 
   * but most devs won't know that nodeNames are actually uppercase. So we have 
   * here a possible point of failure.
   * If the selector is a nodeName, then change it to uppercase so that it will
   * match correctly... e.g. div to DIV.
   */
  Renderer.prototype.setElementHandlers = function (elementHandlers) {
  elementHandlers = elementHandlers || {};
  for (var name in elementHandlers) {
    if (name.indexOf('#') === -1 && name.indexOf('.') === -1 ) {
      if (name.toUpperCase() !== name) {
        elementHandlers[name.toUpperCase()] = elementHandlers[name];
        delete elementHandlers[name];
      }
    }
  }
  this.elementHandlers = elementHandlers;
    return this.elementHandlers;
  }
  /**
   * Converts HTML-formatted text into formatted PDF text.
   *
   * The Plugin relies the browser-engine by using the generated DOM. The HTML is pushed into dom and traversed.
   * Targeting HTML output from Markdown templating, which is a very simple
   * markup - div, span, em, strong, p. No br-based paragraph separation supported explicitly (but still may work.)
   *
   * @public
   * @function
   * @param HTML {DOM Element} Pointer to DOM element (or plain HTML-code) that has to be rendered into PDF.
   * @param x {Number} starting X coordinate in jsPDF instance's declared units.
   * @param y {Number} starting Y coordinate in jsPDF instance's declared units.
   * @param options {Object} Variables controlling parsing and rendering.
   * @param callback {Function} Callback for processing the result;
   * @returns {Object} jsPDF instance
   */
  jsPDFAPI.fromDOM = function (HTML, x, y, options, callback) {
    'use strict';
    options = options || {};

    x = isNaN(x) ? 4 : x;
    y = isNaN(y) ? 4 : y;
    
    this.margins_doc = options.margins || {
      top : 0,
      bottom : 0
    };

    var renderer = new Renderer(this, options);
    renderer.setElementHandlers(options.elementHandlers);
    return renderer.convert(HTML, x, y, callback);
     
  };
})(jsPDF.API);
