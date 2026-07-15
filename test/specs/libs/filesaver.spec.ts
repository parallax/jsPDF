// FileSaver.js exports a single function, saveAs. In browsers that support
// the anchor "download" attribute (ChromeHeadless does) it creates an
// <a download> element, points it at an object URL for the blob, clicks it
// via setTimeout(0) and revokes the URL via setTimeout(40s).
//
// jasmine.clock() is installed so those timeouts only fire when we tick the
// clock, and the anchor's dispatchEvent is stubbed before ticking so no real
// download/navigation is ever triggered.
import { saveAs } from "../../../src/libs/FileSaver.js";

describe("Lib: FileSaver", () => {
  it("exports saveAs as a function", () => {
    expect(typeof saveAs).toBe("function");
  });

  describe("saving a Blob", () => {
    let createdAnchors: HTMLAnchorElement[];
    let createObjectURLSpy: jasmine.Spy;
    let revokeObjectURLSpy: jasmine.Spy;

    beforeEach(() => {
      jasmine.clock().install();

      createdAnchors = [];
      const originalCreateElement = document.createElement.bind(document);
      spyOn(document, "createElement").and.callFake((tagName: string) => {
        const element = originalCreateElement(tagName);
        if (String(tagName).toLowerCase() === "a") {
          createdAnchors.push(element as HTMLAnchorElement);
        }
        return element;
      });

      createObjectURLSpy = spyOn(URL, "createObjectURL").and.returnValue(
        "blob:fake-object-url"
      );
      revokeObjectURLSpy = spyOn(URL, "revokeObjectURL");
    });

    afterEach(() => {
      // uninstalling discards the pending click/revoke timeouts of any
      // saveAs call whose timers were not ticked, so nothing leaks into
      // other specs
      jasmine.clock().uninstall();
    });

    function stubClicks() {
      createdAnchors.forEach(anchor => {
        anchor.dispatchEvent = jasmine.createSpy("dispatchEvent");
      });
    }

    it("does not throw and creates an object URL for the blob", () => {
      const blob = new Blob(["hello world"], { type: "text/plain" });

      try {
        expect(() => saveAs(blob, "hello.txt")).not.toThrow();
      } finally {
        stubClicks();
      }

      expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
      expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
    });

    it("creates an anchor with the download attribute and rel=noopener", () => {
      const blob = new Blob(["%PDF-1.3"], { type: "application/pdf" });

      try {
        saveAs(blob, "document.pdf");
      } finally {
        stubClicks();
      }

      expect(createdAnchors.length).toBe(1);
      const anchor = createdAnchors[0];
      expect(anchor.download).toBe("document.pdf");
      expect(anchor.rel).toBe("noopener");
      expect(anchor.href).toBe("blob:fake-object-url");
    });

    it("falls back to the file name 'download' when none is given", () => {
      try {
        saveAs(new Blob(["data"]));
      } finally {
        stubClicks();
      }

      expect(createdAnchors.length).toBe(1);
      expect(createdAnchors[0].download).toBe("download");
    });

    it("uses the blob's own name property when no name is given", () => {
      const blob = new Blob(["data"], { type: "text/plain" });
      // FileSaver reads an optional non-standard `name` property off the blob.
      (blob as Blob & { name?: string }).name = "from-blob.txt";

      try {
        saveAs(blob);
      } finally {
        stubClicks();
      }

      expect(createdAnchors.length).toBe(1);
      expect(createdAnchors[0].download).toBe("from-blob.txt");
    });

    it("clicks the anchor asynchronously and revokes the object URL later", () => {
      try {
        saveAs(new Blob(["hello"]), "hello.txt");
      } finally {
        stubClicks();
      }

      const anchor = createdAnchors[0];
      expect(anchor.dispatchEvent).not.toHaveBeenCalled();
      expect(revokeObjectURLSpy).not.toHaveBeenCalled();

      // the click is scheduled with setTimeout(..., 0)
      jasmine.clock().tick(1);
      expect(anchor.dispatchEvent).toHaveBeenCalledTimes(1);
      // dispatchEvent was replaced with a spy in stubClicks().
      const event: Event = (
        anchor.dispatchEvent as unknown as jasmine.Spy
      ).calls.mostRecent().args[0];
      expect(event.type).toBe("click");
      expect(revokeObjectURLSpy).not.toHaveBeenCalled();

      // the object URL is revoked after 40 seconds
      jasmine.clock().tick(40000);
      expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:fake-object-url");
    });
  });
});
