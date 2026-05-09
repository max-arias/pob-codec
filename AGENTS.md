# Agent Instructions — pob-codec

## Evidence-based work

- Prefer evidence over memory. Verify current tool behavior with docs, repo files, CLI output, or other primary sources before relying on it.
- Cite evidence briefly when making tool or API claims.

## Commands

- Install dependencies: `vp install`
- Run tests: `vp test`
- Run lint/format/type checks: `vp check`
- Build library package: `vp pack`

## Project conventions

- This package is ESM-first TypeScript.
- Keep the public API small and browser-compatible.
- PoB codes are base64url-encoded zlib/deflate XML strings.
- Add tests for every codec edge case before changing behavior.
- Use Conventional Commits; releases are automated with semantic-release from `main`.
