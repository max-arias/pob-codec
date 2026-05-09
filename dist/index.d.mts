//#region src/base64.d.ts
declare function normalizePobCode(code: string): string;
declare function toBase64Url(base64: string): string;
declare function base64ToBytes(base64: string): Uint8Array;
declare function bytesToBase64(bytes: Uint8Array): string;
//#endregion
//#region src/codec.d.ts
interface DecodePobOptions {
  /**
   * Validate that decoded text looks like a Path of Building XML document.
   * Defaults to false so callers can inspect malformed XML themselves.
   */
  validateXml?: boolean;
}
interface EncodePobOptions {
  /**
   * Compression level forwarded to pako/zlib. Defaults to pako's default.
   */
  level?: number;
}
declare function decodePob(code: string, options?: DecodePobOptions): string;
declare function encodePob(xml: string, options?: EncodePobOptions): string;
declare function looksLikePobXml(xml: string): boolean;
//#endregion
//#region src/errors.d.ts
type PobCodecErrorCode = "EMPTY_INPUT" | "INVALID_BASE64" | "DECODE_FAILED" | "EMPTY_XML" | "ENCODE_FAILED";
declare class PobCodecError extends Error {
  readonly code: PobCodecErrorCode;
  readonly cause?: unknown;
  constructor(code: PobCodecErrorCode, message: string, options?: {
    cause?: unknown;
  });
}
//#endregion
//#region src/pobb-in.d.ts
declare function extractPobbInId(input: string): string | null;
declare function isPobbInUrl(input: string): boolean;
//#endregion
export { type DecodePobOptions, type EncodePobOptions, PobCodecError, type PobCodecErrorCode, base64ToBytes, bytesToBase64, decodePob, encodePob, extractPobbInId, isPobbInUrl, looksLikePobXml, normalizePobCode, toBase64Url };
//# sourceMappingURL=index.d.mts.map