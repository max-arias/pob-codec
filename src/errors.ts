export type PobCodecErrorCode =
  | "EMPTY_INPUT"
  | "INVALID_BASE64"
  | "DECODE_FAILED"
  | "EMPTY_XML"
  | "ENCODE_FAILED";

export class PobCodecError extends Error {
  readonly code: PobCodecErrorCode;
  readonly cause?: unknown;

  constructor(code: PobCodecErrorCode, message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "PobCodecError";
    this.code = code;
    this.cause = options?.cause;
  }
}
