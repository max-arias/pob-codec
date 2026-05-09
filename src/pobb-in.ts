const POBB_IN_ID_RE = /^[A-Za-z0-9_-]{6,64}$/;

export function extractPobbInId(input: string): string | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);

    if (url.hostname.toLowerCase() !== "pobb.in") {
      return null;
    }

    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && POBB_IN_ID_RE.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function isPobbInUrl(input: string): boolean {
  return extractPobbInId(input) !== null;
}
