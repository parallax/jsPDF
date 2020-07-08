describe("Webworker", () => {
  it("basic functionality", async () => {
    const worker = new Worker("/base/test/deployment/webworker/worker.js");
    const output = await new Promise(resolve => {
      worker.onmessage = ({ data }) => resolve(data);
    });
    comparePdf(output, "webworker-basic.pdf", "webworker");
  });
});
