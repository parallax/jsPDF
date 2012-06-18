/*
Copyright (c) 2006 Steve Webster

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions: 

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

package com.dynamicflash.util.tests {

	import flexunit.framework.TestCase;
	import flexunit.framework.TestSuite;
	import flash.utils.ByteArray;

	import com.dynamicflash.util.Base64;
	
	public class Base64Test extends TestCase {
		
	    public function Base64Test(methodName:String = null) {
			super(methodName);
        }
        
        public function testEncode():void {
        	assertEquals("VGhpcyBpcyBhIHRlc3Q=",Base64.encode("This is a test"));
        }
        
        public function testEncodeDecodeBytes():void {
        	var obj:Object = {name:"Dynamic Flash", url:"http://dynamicflash.com"};
        	var source:ByteArray = new ByteArray();
        	source.writeObject(obj);
        	var encoded:String = Base64.encodeByteArray(source);
        	var decoded:ByteArray = Base64.decodeToByteArray(encoded);
        	var obj2:Object = decoded.readObject();
        	assertEquals(obj.name, obj2.name);
        	assertEquals(obj.url, obj2.url);
        }
        
        public function testDecode():void {
        	assertEquals("This is a test",Base64.decode("VGhpcyBpcyBhIHRlc3Q="));
        }
        
        public function testEncodeDecode():void {
        	var string:String = "The quick brown fox jumped over the lazy dogs";
        	assertEquals(string, Base64.decode(Base64.encode(string)));
        }
	}
}