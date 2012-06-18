/*
  Downloadify: Client Side File Creation
  JavaScript + Flash Library

  Version: 0.2

  Copyright (c) 2009 Douglas C. Neiner

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
package {
  import flash.system.Security;
  import flash.events.Event;
  import flash.events.MouseEvent;
  import flash.net.FileReference;
  import flash.net.FileFilter;
  import flash.net.URLRequest;
  import flash.display.*;
  import flash.utils.ByteArray;
  import flash.external.ExternalInterface;
  import com.dynamicflash.util.Base64;
  
  [SWF(backgroundColor="#CCCCCC")]
  [SWF(backgroundAlpha=0)]
  public class Downloadify extends Sprite {
    
    private var options:Object,
                file:FileReference = new FileReference(),
                queue_name:String  = "",
    
                _width:Number      = 0,
                _height:Number     = 0,
                                   
                enabled:Boolean    = true,
                over:Boolean       = false,
                down:Boolean       = false,
                
                buttonImage:String = "images/download.png",
                
                button:Loader;
    
    public function Downloadify() {
      Security.allowDomain('*');
      
      stage.align = StageAlign.TOP_LEFT;
      stage.scaleMode = StageScaleMode.NO_SCALE;
      
      options = this.root.loaderInfo.parameters;
      
      queue_name = options.queue_name.toString();
      
      _width  = options.width;
      _height = options.height;
      
      if(options.downloadImage){
        buttonImage = options.downloadImage;
      }
      
      setupDefaultButton();
      addChild(button);
      
      this.buttonMode = true;
      
      this.addEventListener(MouseEvent.CLICK, onMouseClickEvent);
      this.addEventListener(MouseEvent.ROLL_OVER , onMouseEnter);
      this.addEventListener(MouseEvent.ROLL_OUT , onMouseLeave);
      this.addEventListener(MouseEvent.MOUSE_DOWN , onMouseDown);
      this.addEventListener(MouseEvent.MOUSE_UP , onMouseUp);
      
      ExternalInterface.addCallback('setEnabled', setEnabled);
      
      file.addEventListener(Event.COMPLETE, onSaveComplete);
      file.addEventListener(Event.CANCEL, onSaveCancel);
    }
    
    private function setEnabled(isEnabled:Boolean):Boolean {
      enabled = isEnabled;
      if(enabled === true){
        button.y = 0;
        this.buttonMode = true;
      } else {
        button.y = (-3 * _height);
        this.buttonMode = false;
      }
      return enabled;
    }
    
    private function setupDefaultButton():void {
      button = new Loader();
      var urlReq:URLRequest = new URLRequest(buttonImage);
      button.load(urlReq);
      button.x = 0;
      button.y = 0;
    }
    
    
    
    protected function onMouseEnter(event:Event):void {
      if(enabled === true){
        if(down === false) button.y = (-1 * _height);
        over = true;
      }
    }
    protected function onMouseLeave(event:Event):void {
      if(enabled === true){
        if(down === false) button.y = 0;
        over = false;
      }
    }
    protected function onMouseDown(event:Event):void {
      if(enabled === true){
        button.y = button.y = (-2 * _height);
        down = true;
      }
    }
    protected function onMouseUp(event:Event):void {
      if(enabled === true){
        if(over === false){
          button.y = 0;
        } else {
          button.y = (-1 * _height);
        }
        down = false;
      }
    }
    
    protected function onMouseClickEvent(event:Event):void{
      var theData:String  = ExternalInterface.call('Downloadify.getTextForSave',queue_name),
          filename:String = ExternalInterface.call('Downloadify.getFileNameForSave',queue_name),
          dataType:String = ExternalInterface.call('Downloadify.getDataTypeForSave',queue_name);
          
      if (dataType == "string" && theData != "") {
        file.save(theData, filename);
      } else if (dataType == "base64" && theData){
        file.save(Base64.decodeToByteArray(theData), filename);
      } else {
        onSaveError();
      }
    }
    
    protected function onSaveComplete(event:Event):void{
      trace('Save Complete');
      ExternalInterface.call('Downloadify.saveComplete',queue_name);
    }
    
    protected function onSaveCancel(event:Event):void{
      trace('Save Cancel');
      ExternalInterface.call('Downloadify.saveCancel',queue_name);  
    }
    
    protected function onSaveError():void{
      trace('Save Error');
      ExternalInterface.call('Downloadify.saveError',queue_name);  
    }
    
  }
}