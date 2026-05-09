# pob-codec

Encode and decode Path of Building export codes.

Path of Building export codes are base64url strings containing zlib/deflate-compressed XML.

## Install

```bash
npm install pob-codec
```

## Usage

```ts
import { decodePob, encodePob } from "pob-codec";

const xml = decodePob(pobCode);
const code = encodePob(xml);
```

## API

### `decodePob(code: string): string`

Normalizes a PoB export code, base64-decodes it, inflates it, and returns XML text.

### `encodePob(xml: string): string`

Compresses XML text and returns a base64url PoB export code without padding.

### `normalizePobCode(code: string): string`

Trims surrounding quotes/whitespace, converts base64url characters to standard base64 characters, and pads the string.

### `extractPobbInId(input: string): string | null`

Extracts the build id from a `pobb.in` URL.

### `isPobbInUrl(input: string): boolean`

Returns true when `input` is a valid `pobb.in` URL with a build id.

## Development

```bash
vp install
vp test
vp check
vp pack
```

## Releases

This repo uses Conventional Commits and semantic-release. Merges to `main` publish releases when commit messages contain releasable changes such as:

- `fix: handle unpadded codes`
- `feat: add XML validation helper`
- `feat!: change decode error type`
