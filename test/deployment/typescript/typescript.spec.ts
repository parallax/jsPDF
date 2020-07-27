import { jsPDF } from "jspdf";

declare global {
  function comparePdf(
    actual: string,
    referencePath: string,
    module?: string
  ): void;
}

describe("Typescript", () => {
  it("jsPDF should be loaded", () => {
    expect(jsPDF).toBeDefined();
  });
  it("basic test", () => {
    const doc = new jsPDF();
    doc.text("TypeScript test", 30, 30);
    comparePdf(doc.output(), "typescript-basic.pdf", "typescript");
  });
});
