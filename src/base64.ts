import { PobCodecError } from "./errors";

const BASE64_RE = /^[A-Za-z0-9+/]*={0,2}$/;

export function normalizePobCode(code: string): string {
  const normalized = code
    .trim()
    .replace(/^"+|"+$/g, "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  if (!normalized) {
    throw new PobCodecError("EMPTY_INPUT", "PoB code is empty.");
  }

  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

  if (!BASE64_RE.test(padded) || padded.length % 4 !== 0) {
    throw new PobCodecError("INVALID_BASE64", "PoB code is not valid base64/base64url text.");
  }

  return padded;
}

export function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64ToBytes(base64: string): Uint8Array {
  try {
    const binary = globalThis.atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  } catch (cause) {
    throw new PobCodecError("INVALID_BASE64", "PoB code is not valid base64/base64url text.", {
      cause,
    });
  }
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, offset + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return globalThis.btoa(binary);
}
