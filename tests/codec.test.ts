import { describe, expect, it } from "vitest";
import {
  PobCodecError,
  decodePob,
  encodePob,
  looksLikePobXml,
  normalizePobCode,
  toBase64Url,
} from "../src";

const SAMPLE_XML = `<PathOfBuilding targetVersion="3_0"><Build level="90" className="Witch" ascendClassName="Elementalist" /><Items activeItemSet="1"><ItemSet id="1" title="Default" /></Items></PathOfBuilding>`;

describe("PoB codec", () => {
  it("roundtrips XML through a PoB export code", () => {
    const code = encodePob(SAMPLE_XML);

    expect(code).not.toContain("+");
    expect(code).not.toContain("/");
    expect(code).not.toContain("=");
    expect(decodePob(code)).toBe(SAMPLE_XML);
  });

  it("decodes quoted PoB codes", () => {
    const code = encodePob(SAMPLE_XML);

    expect(decodePob(`"${code}"`)).toBe(SAMPLE_XML);
  });

  it("decodes standard base64 input as well as base64url input", () => {
    const urlCode = encodePob(SAMPLE_XML);
    const standardBase64 = normalizePobCode(urlCode);

    expect(decodePob(standardBase64)).toBe(SAMPLE_XML);
    expect(toBase64Url(standardBase64)).toBe(urlCode);
  });

  it("can validate that decoded text looks like PoB XML", () => {
    const code = encodePob("<not-pob />");

    expect(() => decodePob(code, { validateXml: true })).toThrow(PobCodecError);
  });

  it("detects PoB XML roots", () => {
    expect(looksLikePobXml(SAMPLE_XML)).toBe(true);
    expect(looksLikePobXml(`<?xml version="1.0"?><PathOfBuilding />`)).toBe(true);
    expect(looksLikePobXml("<html></html>")).toBe(false);
  });

  it("throws a typed error for empty input", () => {
    expect(() => decodePob("   ")).toThrow(PobCodecError);

    try {
      decodePob("   ");
    } catch (error) {
      expect(error).toBeInstanceOf(PobCodecError);
      expect((error as PobCodecError).code).toBe("EMPTY_INPUT");
    }
  });

  it("throws a typed error for data that is not deflated", () => {
    const notDeflated = btoa("not deflated xml");

    expect(() => decodePob(notDeflated)).toThrow(PobCodecError);

    try {
      decodePob(notDeflated);
    } catch (error) {
      expect(error).toBeInstanceOf(PobCodecError);
      expect((error as PobCodecError).code).toBe("DECODE_FAILED");
    }
  });

  it("throws a typed error for empty XML", () => {
    expect(() => encodePob("   ")).toThrow(PobCodecError);
  });
});
