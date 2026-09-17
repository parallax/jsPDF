import { globalObject } from "../../src/libs/globalObject.js";

describe("Lib: globalObject", () => {
  it("is defined", () => {
    expect(globalObject).toBeDefined();
    expect(globalObject).not.toBeNull();
  });

  it("is an object", () => {
    expect(typeof globalObject).toBe("object");
  });

  it("equals the environment's global object", () => {
    if (typeof window !== "undefined") {
      expect(globalObject).toBe(window);
    } else if (typeof global !== "undefined") {
      expect(globalObject).toBe(global);
    } else if (typeof self !== "undefined") {
      expect(globalObject).toBe(self);
    }
  });

  it("exposes standard global functions", () => {
    expect(typeof globalObject.setTimeout).toBe("function");
    expect(typeof globalObject.parseInt).toBe("function");
    expect(globalObject.Math).toBe(Math);
  });
});
