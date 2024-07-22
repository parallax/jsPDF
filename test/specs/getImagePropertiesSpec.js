describe("getImageProperties function", function() {
    var jsPDFAPI;

    beforeEach(function() {
        jsPDFAPI = {
            __addimage__: {},
            loadFile: jasmine.createSpy("loadFile").and.returnValue(""),
            processPNG: jasmine.createSpy("processPNG").and.returnValue({}),
            processJPEG: jasmine.createSpy("processJPEG").and.returnValue({}),
            processWEBP: jasmine.createSpy("processWEBP").and.returnValue({}),
            processUNKNOWN: jasmine.createSpy("processUNKNOWN").and.returnValue({}),
        };

        jsPDFAPI.__addimage__.supportsArrayBuffer = function() {
            return (
                typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined"
            );
        };

        spyOn(jsPDFAPI.__addimage__, "supportsArrayBuffer").and.callThrough();
    });

    it("should process image as string when imageData is string and format is unknown", function() {
        var imageData = "data:image/png;base64,...";
        var result = jsPDFAPI.getImageProperties(imageData);
        expect(jsPDFAPI.loadFile).toHaveBeenCalled();
        expect(result).toEqual(jasmine.any(Object));
    });

    it("should not process image as string when imageData is not a string", function() {
        var imageData = new Uint8Array();
        var result = jsPDFAPI.getImageProperties(imageData);
        expect(jsPDFAPI.loadFile).not.toHaveBeenCalled();
        expect(result).toEqual(jasmine.any(Object));
    });

    it("should process image as string when imageData is string and format is known", function() {
        var imageData = "data:image/jpeg;base64,...";
        var result = jsPDFAPI.getImageProperties(imageData);
        expect(jsPDFAPI.loadFile).toHaveBeenCalled();
        expect(result).toEqual(jasmine.any(Object));
    });

    it("should convert binaryString to Uint8Array when ArrayBuffer is supported and imageData is not Uint8Array", function() {
        var imageData = "binaryString";
        jsPDFAPI.__addimage__.supportsArrayBuffer.and.returnValue(true);
        var result = jsPDFAPI.getImageProperties(imageData);
        expect(jsPDFAPI.loadFile).toHaveBeenCalled();
        expect(result).toEqual(jasmine.any(Object));
    });

    it("should not convert binaryString to Uint8Array when ArrayBuffer is not supported", function() {
        var imageData = "binaryString";
        jsPDFAPI.__addimage__.supportsArrayBuffer.and.returnValue(false);
        var result = jsPDFAPI.getImageProperties(imageData);
        expect(jsPDFAPI.loadFile).toHaveBeenCalled();
        expect(result).toEqual(jasmine.any(Object));
    });

    it("should not convert binaryString to Uint8Array when imageData is Uint8Array", function() {
        var imageData = new Uint8Array();
        jsPDFAPI.__addimage__.supportsArrayBuffer.and.returnValue(true);
        var result = jsPDFAPI.getImageProperties(imageData);
        expect(jsPDFAPI.loadFile).not.toHaveBeenCalled();
        expect(result).toEqual(jasmine.any(Object));
    });
});
