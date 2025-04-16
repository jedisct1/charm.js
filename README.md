# charm.js

A tiny, self-contained cryptography library, implementing authenticated encryption and keyed hashing.

Any number of hashing and authenticated encryption operations can be freely chained using a single rolling state.
In this mode, each authentication tag authenticates the whole transcript since the beginning of the session.

This is a port to JavaScript (TypeScript). It is fully compatible with the C and Zig versions.

## Features

- Authenticated encryption with 128-bit security
- Keyed hashing
- No practical limits on message size and length
- Works in both Node.js and Bun environments
- Supports both ESM and CommonJS module systems
- Full TypeScript support with type definitions
- Zero dependencies
- Comprehensive test coverage

## Installation

```bash
npm install @jedisct1/charm
```

## Usage

### ESM

```js
import { Charm } from "@jedisct1/charm";

// Create a key and nonce
const key = new Uint8Array(Charm.key_length).fill(1);
const nonce = new Uint8Array(Charm.nonce_length).fill(2);

// Create a message
const message = new TextEncoder().encode('Hello from Charm!');

// Initialize the state
const charm = new Charm(key, nonce);

// Encrypt
const tag = charm.encrypt(message);

// Decrypt
const charm2 = new Charm(key, nonce);
charm2.decrypt(message, tag);

// Hash
const hash = charm.hash(message);
```

### CommonJS

```js
const { Charm } = require("@jedisct1/charm");

// Create a key and nonce
const key = new Uint8Array(Charm.key_length).fill(1);
const nonce = new Uint8Array(Charm.nonce_length).fill(2);

// Create a message
const message = new TextEncoder().encode('Hello from Charm!');

// Initialize the state
const charm = new Charm(key, nonce);

// Encrypt
const tag = charm.encrypt(message);

// Decrypt
const charm2 = new Charm(key, nonce);
charm2.decrypt(message, tag);

// Hash
const hash = charm.hash(message);
```

## API

### Constructor

```typescript
new Charm(key: Uint8Array, nonce?: Uint8Array)
```

- `key`: A `Uint8Array` of length `Charm.key_length` (32 bytes)
- `nonce`: An optional `Uint8Array` of length `Charm.nonce_length` (16 bytes)

### Static Properties

- `Charm.key_length`: 32 (bytes)
- `Charm.nonce_length`: 16 (bytes)
- `Charm.tag_length`: 16 (bytes)
- `Charm.hash_length`: 32 (bytes)

### Methods

#### `encrypt(msg: Uint8Array): Uint8Array`

Encrypts a message in-place and returns the authentication tag.

#### `decrypt(msg: Uint8Array, expected_tag: Uint8Array): void`

Decrypts a message in-place and verifies the authentication tag. Throws an error if verification fails.

#### `hash(msg: Uint8Array): Uint8Array`

Computes a keyed hash of the message.

## Development

### Building

```bash
npm run build
```

This will build both ESM and CommonJS versions of the library.

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Security

This implementation provides 128-bit security and has no practical limits on the size and length of messages.

## Other implementations

- [charm](https://github.com/jedisct1/charm) original implementation in C
- [zig-charm](https://github.com/jedisct1/zig-charm) an implementation of Charm in the Zig language

## License

MIT
