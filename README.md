# charm.js

A tiny, self-contained cryptography library, implementing authenticated encryption and keyed hashing.

Any number of hashing and authenticated encryption operations can be freely chained using a single rolling state.
In this mode, each authentication tag authenticates the whole transcript since the beginning of the session.

This is a port to JavaScript (TypeScript). It is fully compatible with the C and Zig versions.

## Usage

### Initialization

A state must be initialize using a key, and an optional nonce. The nonce is not required is a key is used only once per session.

```js
import { Charm } from "@jedisct1/charm";
import crypto from "crypto";

const key = new Uint8Array(Charm.key_length);
crypto.getRandomValues(key);
let st = new Charm(key);
```

The key size is `Charm.key_length` bytes long, and the nonce size `Charm.nonce_length` bytes long.

Once initialized, the state can be used for any encryption/decryption/hashing sequence. Every output depends on the previous input, hence authenticating the entire session.

### Encryption

```js
const x1 = new Uint8Array([0, 1, 2, 3, 4]);
const tag1 = st.encrypt(x1);

const x2 = new Uint8Array([5, 6, 7]);
const tag2 = st.encrypt(x2);
```

### Decryption

Decryption must happen within the same state as encryption:

```js
st = new Charm(key);
st.decrypt(x1, tag1);
st.decrypt(x2, tag2);
```

An exception is thrown if the tag doesn't verify.

### Hashing

```js
const x3 = new Uint8Array([8, 9, 10, 11, 12, 13, 14, 15])
const h = st.hash(x3);
```

## Security guarantees

128-bit security, no practical limits on the size and length of messages.

## Other implementations:

- [charm](https://github.com/jedisct1/charm) original implementation in C.
- [zig-charm](https://github.com/jedisct1/zig-charm) an implementation of Charm in the Zig language.
