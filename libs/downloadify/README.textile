h2. Downloadify: Client Side File Creation

*_Important! The swf has been compiled for online use only. Testing from the file path (i.e. file:// ) will not work as it will violate the security sandbox._*

h3. Overview

This library is a tiny JavaScript + Flash library that allows you to generate files on the fly, in the browser, without server interaction. Web applications that allow you to generate vCards, color palettes, custom code, etc would benefit from using this library. In addition to increasing speed (no round trip to the server) this solution can reduce the database and server load of existing web applications. _This is not a library to 'force download' a file from a server. It does not interact with a server at all._

h3. Demo

A "very simple demo is available":http://pixelgraphics.us/downloadify/test.html that lets you supply your own content and filename and test out saving, canceling, and the error functionality when the file is blank.

For a real world usage, see "Starter for jQuery":http://starter.pixelgraphics.us . To quickly demo the usage, just click "Load Example Data" then click Download. After the initial page load, no further contact is made with the server. Everything happens on the client side.

h3. Download

Please download from the "Downloads":http://github.com/dcneiner/Downloadify/downloads section of this project.

h3. Support

For support, please use the "Issues":http://github.com/dcneiner/Downloadify/issues section of this project. You can also try to hit me up on "Twitter at @dougneiner":http://twitter.com/dougneiner but I might just ask you to file an issue. :)

h3. Dependencies

_The end user must have Flash 10 or higher installed for this plugin to work. As of September 2009, it was at a 93% saturation, so most users should already have it installed._

Downloadify is only dependent on "SWFObject 2.0":http://code.google.com/p/swfobject/ which is included with the download. It is compatible with any JavaScript framework but has a helper for both jQuery and MooTools. Neither helper will be activatd if Downloadify is inserted prior to including the framework library.

h3. Usage

*Any JavaScript framework*:

<pre>Downloadify.create( id_or_DOM_element, options );</pre>

*jQuery*:

<pre>$("#element").downloadify( options );</pre>
  
*MooTools:*

<pre>$("elementid").downloadify( options );</pre>

h3. Options

Unless you are using the jQuery plugin included with Downloadify, you must supply all required options with your call to the <tt>Downloadify.create</tt> function.

*Defaults and Required Options*

* <tt>swf</tt>: <tt>'media/downloadify.swf'</tt> <span style="color:red">*Required*</span> <br />_Path to the SWF File. Can be relative from the page, or an absolute path._
* <tt>downloadImage</tt>: <tt>'images/download.png'</tt> <span style="color:red">*Required*</span> <br />_Path to the Button Image. Can be relative from the page or an absolute path._
* <tt>width</tt>: 175 <span style="color:red">*Required*</span> <br />_Width of the button (and the flash movie)_
* <tt>height</tt>: 55 <span style="color:red">*Required*</span> <br />_Height of the button. This will be 1/4 the height of the image._
* <tt>filename</tt>: <span style="color:red">*Required*</span><br /> _Can be a String or a function callback. If a function, the return value of the function will be used as the filename._
* <tt>data</tt>: <span style="color:red">*Required*</span><br /> _Can be a normal String, base64 encoded String, or a function callback. If a function, the return value of the function will be used as the file data._
* <tt>dataType</tt>: <tt>'string'</tt><br /> _Must be a String with the value <tt>string</tt> or <tt>base64</tt>. Data paired with the <tt>dataType</tt> of <tt>base64</tt> will be decoded into a <tt>ByteArray</tt> prior to saving._
* <tt>transparent</tt>: false <br />_Set this to true to use wmode=transparent on the flash movie._
* <tt>append</tt>: false <br />_By default the contents of the targeted DOM element are removed. Set this to true to keep the contents and append the button._

*Event Callbacks*

No data is passed into these functions, they are simply called.

* <tt>onError</tt>: _Called when the Download button is clicked but your <tt>data</tt> callback returns <tt>""</tt>._
* <tt>onCancel</tt>: _Called when the Download button is clicked but the user then cancels without saving._
* <tt>onComplete</tt>: _Called when the Download button is clicked and the file is saved to the user's computer._

h3. Setting Up the Image

Downloadify supports (i.e. requires) three button states with limited support for a fourth. The states are:

* *Normal*
* *Over* ( When the mouse hovers over the button )
* *Down* ( When the button is pressed )
* *Disabled* ( Limited support, when .disable() is called on the Downloadify.Container object )

In trying to keep this plugin as simple as possible, all four states are always assumed to be present. You should prepare your button image as a single image the width you want your button, and four times the height of the button. All four states should then live in that one image in the same order as the previous list from top to bottom.

h3. Potential Issues

When working with different button images, you may find Flash has cached your image. This is the desired behavior on a live site, but not during development. To get around this, simply supply a ?rev=1 or ?rev=2 etc on the end of your downloadImage url.

h3. Compiling Notes

I develop locally using Xcode and the Flex 4 SDK Beta 2. Please do not submit request on how to setup a local testing environment. If you are interested in my Xcode project files, send me a message. 

h3. Developers

*Core Developer:* "Doug Neiner":http://dougneiner.com

*Contributors:*

* "David Walsh":http://davidwalsh.name -- Contributed the MooTools helper

h3. Change Log

* *Version 0.2*:
** Added support for <tt>base64</tt> via the "as3base64 Library":http://github.com/spjwebster/as3base64
** Added <tt>dataType</tt> option
** Added MooTools helper (Thanks David!)
** Upgraded SWFObject to v2.2
* *Original Release:* Version 0.1

h3. License Information: MIT

as3base64: "Copyright (c) 2006 Steve Webster":http://github.com/spjwebster/as3base64

All Downloadify Code: Copyright (c) 2009 Douglas C. Neiner

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.