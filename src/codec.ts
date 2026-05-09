import { deflate, inflate } from "pako";
import { base64ToBytes, bytesToBase64, normalizePobCode, toBase64Url } from "./base64";
import { PobCodecError } from "./errors";

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export interface DecodePobOptions {
  /**
   * Validate that decoded text looks like a Path of Building XML document.
   * Defaults to false so callers can inspect malformed XML themselves.
   */
  validateXml?: boolean;
}

export interface EncodePobOptions {
  /**
   * Compression level forwarded to pako/zlib. Defaults to pako's default.
   */
  level?: number;
}

export function decodePob(code: string, options: DecodePobOptions = {}): string {
  const normalized = normalizePobCode(code);

  try {
    const compressed = base64ToBytes(normalized);
    const inflated = inflate(compressed);
    const xml = textDecoder.decode(inflated);

    if (options.validateXml && !looksLikePobXml(xml)) {
      throw new PobCodecError(
        "DECODE_FAILED",
        "Decoded text does not look like a Path of Building XML document.",
      );
    }

    return xml;
  } catch (cause) {
    if (cause instanceof PobCodecError) {
      throw cause;
    }

    throw new PobCodecError("DECODE_FAILED", "Failed to inflate PoB code.", { cause });
  }
}

export function encodePob(xml: string, options: EncodePobOptions = {}): string {
  if (!xml.trim()) {
    throw new PobCodecError("EMPTY_XML", "PoB XML is empty.");
  }

  try {
    const bytes = textEncoder.encode(xml);
    const compressed = deflate(
      bytes,
      options.level === undefined ? undefined : { level: options.level },
    );
    return toBase64Url(bytesToBase64(compressed));
  } catch (cause) {
    throw new PobCodecError("ENCODE_FAILED", "Failed to deflate PoB XML.", { cause });
  }
}

export function looksLikePobXml(xml: string): boolean {
  return (
    /^\s*<\?xml\b[\s\S]*?<PathOfBuilding[\s>]/.test(xml) || /^\s*<PathOfBuilding[\s>]/.test(xml)
  );
}
