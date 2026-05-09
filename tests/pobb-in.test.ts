import { describe, expect, it } from "vitest";
import { extractPobbInId, isPobbInUrl } from "../src";

describe("pobb.in helpers", () => {
  it("extracts a pobb.in id", () => {
    expect(extractPobbInId("https://pobb.in/BlEy8WOpfMXB")).toBe("BlEy8WOpfMXB");
    expect(extractPobbInId("https://pobb.in/BlEy8WOpfMXB/tree")).toBe("BlEy8WOpfMXB");
  });

  it("rejects non-pobb.in URLs", () => {
    expect(extractPobbInId("https://example.com/BlEy8WOpfMXB")).toBeNull();
    expect(extractPobbInId("not a url")).toBeNull();
  });

  it("checks whether an input is a pobb.in URL", () => {
    expect(isPobbInUrl("https://pobb.in/BlEy8WOpfMXB")).toBe(true);
    expect(isPobbInUrl("BlEy8WOpfMXB")).toBe(false);
  });
});
