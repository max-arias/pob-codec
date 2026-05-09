import { deflate, inflate } from "pako";
//#region src/errors.ts
var PobCodecError = class extends Error {
	code;
	cause;
	constructor(code, message, options) {
		super(message);
		this.name = "PobCodecError";
		this.code = code;
		this.cause = options?.cause;
	}
};
//#endregion
//#region src/base64.ts
const BASE64_RE = /^[A-Za-z0-9+/]*={0,2}$/;
function normalizePobCode(code) {
	const normalized = code.trim().replace(/^"+|"+$/g, "").replace(/-/g, "+").replace(/_/g, "/");
	if (!normalized) throw new PobCodecError("EMPTY_INPUT", "PoB code is empty.");
	const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
	if (!BASE64_RE.test(padded) || padded.length % 4 !== 0) throw new PobCodecError("INVALID_BASE64", "PoB code is not valid base64/base64url text.");
	return padded;
}
function toBase64Url(base64) {
	return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function base64ToBytes(base64) {
	try {
		const binary = globalThis.atob(base64);
		const bytes = new Uint8Array(binary.length);
		for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
		return bytes;
	} catch (cause) {
		throw new PobCodecError("INVALID_BASE64", "PoB code is not valid base64/base64url text.", { cause });
	}
}
function bytesToBase64(bytes) {
	let binary = "";
	const chunkSize = 32768;
	for (let offset = 0; offset < bytes.length; offset += chunkSize) {
		const chunk = bytes.subarray(offset, offset + chunkSize);
		binary += String.fromCharCode(...chunk);
	}
	return globalThis.btoa(binary);
}
//#endregion
//#region src/codec.ts
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
function decodePob(code, options = {}) {
	const normalized = normalizePobCode(code);
	try {
		const inflated = inflate(base64ToBytes(normalized));
		const xml = textDecoder.decode(inflated);
		if (options.validateXml && !looksLikePobXml(xml)) throw new PobCodecError("DECODE_FAILED", "Decoded text does not look like a Path of Building XML document.");
		return xml;
	} catch (cause) {
		if (cause instanceof PobCodecError) throw cause;
		throw new PobCodecError("DECODE_FAILED", "Failed to inflate PoB code.", { cause });
	}
}
function encodePob(xml, options = {}) {
	if (!xml.trim()) throw new PobCodecError("EMPTY_XML", "PoB XML is empty.");
	try {
		return toBase64Url(bytesToBase64(deflate(textEncoder.encode(xml), options.level === void 0 ? void 0 : { level: options.level })));
	} catch (cause) {
		throw new PobCodecError("ENCODE_FAILED", "Failed to deflate PoB XML.", { cause });
	}
}
function looksLikePobXml(xml) {
	return /^\s*<\?xml\b[\s\S]*?<PathOfBuilding[\s>]/.test(xml) || /^\s*<PathOfBuilding[\s>]/.test(xml);
}
//#endregion
//#region src/pobb-in.ts
const POBB_IN_ID_RE = /^[A-Za-z0-9_-]{6,64}$/;
function extractPobbInId(input) {
	const trimmed = input.trim();
	if (!trimmed) return null;
	try {
		const url = new URL(trimmed);
		if (url.hostname.toLowerCase() !== "pobb.in") return null;
		const id = url.pathname.split("/").filter(Boolean)[0];
		return id && POBB_IN_ID_RE.test(id) ? id : null;
	} catch {
		return null;
	}
}
function isPobbInUrl(input) {
	return extractPobbInId(input) !== null;
}
//#endregion
export { PobCodecError, base64ToBytes, bytesToBase64, decodePob, encodePob, extractPobbInId, isPobbInUrl, looksLikePobXml, normalizePobCode, toBase64Url };

//# sourceMappingURL=index.mjs.map