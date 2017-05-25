/** ==================================================================== 
 * jsPDF ValueArea plugin
 * Copyright (c) 2013 Dario Malfatti dario.malfatti@gmail.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */


/*
*                  __     ___                                                ___     
*  |       /\     |  \   |     |          \      /     /\     |    |     |  |        
*  |      /  \    |___|  |___  |           \    /     /  \    |    |     |  |___     
*  |     /____\   |   |  |     |            \  /     /____\   |    |     |  |        
*  |___ /      \  |__/   |___  |___          \/     /      \  |___ |_____|  |___     
*                                      ----------------------------------------------
*/



(function(jsPDFAPI) {
'use strict'

    //
    // create a "label - value" area like this
    //
    // [my label] ____________  <- [value]
    //
    
    jsPDFAPI.valueArea = function(label, value, left, top) {

        'use strict'



        // space between the label and the value line
        var space = 5;




        //
        // label section
        //

        // write the label
        this.setFontStyle('bold');

        this.text(left, top, label);

        this.setFontStyle('normal');




        //
        // line section
        //

        // get the label dimension to start draw the line
        var dimension = this.getTextDimensions(label);
        
        // calculate the line left
        var lineLeft = left + dimension.w + space;

        // calculate the line width
        var lineWidth = 50;

        // get the value dimension
        dimension = this.getTextDimensions(value);

        // increase the line width if needed
        if (dimension.w > (lineWidth - space * 2)) lineWidth = dimension.w + space * 2;

        // draw the line 1/4 under the text position
        this.line(lineLeft, top + dimension.h / 4, lineLeft + lineWidth, top + dimension.h / 4);




        //
        // value section
        //


        // draw the value in the center of the line
        this.text(lineLeft + ((lineWidth - dimension.w) / 2), top, value.toString());



        // return the jsPdf and the dimension of the whole object
        return {
            doc: this,
            dimension: {
                left: left,
                top: top,
                height: dimension.h + dimension.h / 4,
                width: lineLeft + lineWidth - left
            }
        };
        

    };

})(jsPDF.API)
