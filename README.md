# charm.js

A tiny, self-contained cryptography library, implementing authenticated encryption and keyed hashing.

Any number of hashing and authenticated encryption operations can be freely chained using a single rolling state.
In this mode, each authentication tag authenticates the whole transcript since the beginning of the session.

The [original implementation](https://github.com/jedisct1/charm) was written in C.

This is a port to JavaScript (TypeScript). It is fully compatible with the C and Zig versions.

## Security guarantees

128-bit security, no practical limits on the size and length of messages.
