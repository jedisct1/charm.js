"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charm = void 0;
class Charm {
    constructor(key, nonce) {
        const bytes = new Uint8Array(48);
        if (nonce !== null) {
            bytes.set(new Uint8Array(nonce));
        }
        bytes.set(new Uint8Array(key), 16);
        this.x = new Xoodoo(bytes);
        this.x.permute();
    }
    static xor128(out, in_) {
        for (let i = 0; i < 16; i++) {
            out[i] ^= in_[i];
        }
    }
    encrypt(msg) {
        const squeezed = new Uint8Array(16);
        const bytes = this.x.stateBytes;
        let off = 0;
        for (; off + 16 < msg.byteLength; off += 16) {
            squeezed.set(bytes.subarray(0, 16));
            const mc = msg.subarray(off, off + 16);
            Charm.xor128(bytes.subarray(0, 16), mc);
            Charm.xor128(mc, squeezed);
            this.x.permute();
        }
        const leftover = msg.length - off;
        let padded = new Uint8Array(16 + 1);
        padded.set(msg.subarray(off));
        padded[leftover] = 0x80;
        squeezed.set(bytes.subarray(0, 16));
        Charm.xor128(bytes, padded);
        this.x.state[11] ^= (1 << 24) | (leftover >>> 4 << 25) | (1 << 26);
        Charm.xor128(padded, squeezed);
        msg.set(padded.subarray(0, leftover), off);
        this.x.permute();
        return this.x.squeezePermute();
    }
    decrypt(msg, expected_tag) {
        const squeezed = new Uint8Array(16);
        const bytes = this.x.stateBytes;
        let off = 0;
        for (; off + 16 < msg.byteLength; off += 16) {
            squeezed.set(bytes.subarray(0, 16));
            const mc = msg.subarray(off, off + 16);
            Charm.xor128(mc, squeezed);
            Charm.xor128(bytes.subarray(0, 16), mc);
            this.x.permute();
        }
        const leftover = msg.length - off;
        let padded = new Uint8Array(16 + 1);
        padded.set(msg.subarray(off));
        squeezed.fill(0);
        squeezed.set(bytes.subarray(0, leftover));
        Charm.xor128(padded, squeezed);
        padded[leftover] = 0x80;
        Charm.xor128(bytes, padded);
        this.x.state[11] ^= (1 << 24) | (leftover >>> 4 << 25) | (1 << 26);
        msg.set(padded.subarray(0, leftover), off);
        this.x.permute();
        const tag = this.x.squeezePermute();
        let c = 0;
        for (let i = 0; i < 16; i++) {
            c |= tag[i] ^ expected_tag[i];
        }
        if (c !== 0) {
            throw new Error("Verification failed");
        }
    }
    hash(msg) {
        const bytes = this.x.stateBytes;
        let off = 0;
        for (; off + 16 < msg.byteLength; off += 16) {
            Charm.xor128(bytes.subarray(0, 16), msg.subarray(off, off + 16));
            this.x.permute();
        }
        const leftover = msg.length - off;
        let padded = new Uint8Array(16 + 1);
        padded.set(msg.subarray(off));
        padded[leftover] = 0x80;
        Charm.xor128(bytes.subarray(0, 16), padded);
        this.x.state[11] ^= (1 << 24) | (leftover >>> 4 << 25);
        this.x.permute();
        const h = new Uint8Array(32);
        h.set(this.x.squeezePermute());
        h.set(this.x.squeezePermute(), 16);
        return h;
    }
}
exports.Charm = Charm;
Charm.tag_length = 16;
Charm.key_length = 32;
Charm.nonce_length = 16;
Charm.hash_length = 32;
class Xoodoo {
    constructor(bytes) {
        this.state = new Uint32Array(12);
        this.stateBytes = new Uint8Array(this.state.buffer);
        this.stateBytes.set(bytes);
    }
    swap(i, j) {
        const t = this.state[i];
        this.state[i] = this.state[j];
        this.state[j] = t;
    }
    permute() {
        function rot(x, n) {
            return (x >>> n) | (x << (32 - n));
        }
        const st = this.state;
        const e = new Uint32Array(4);
        const ROUND_CONSTANTS = new Uint16Array([0x058, 0x038, 0x3c0, 0x0d0, 0x120, 0x014, 0x060, 0x02c, 0x380, 0x0f0, 0x1a0, 0x012]);
        for (let r = 0; r < 12; r++) {
            for (let i = 0; i < 4; i++) {
                e[i] = rot(st[i] ^ st[i + 4] ^ st[i + 8], 18);
                e[i] ^= rot(e[i], 9);
            }
            for (let i = 0; i < 12; i++) {
                st[i] ^= e[(i - 1) & 3];
            }
            this.swap(7, 4);
            this.swap(7, 5);
            this.swap(7, 6);
            st[0] ^= ROUND_CONSTANTS[r];
            for (let i = 0; i < 4; i++) {
                const a = st[i];
                const b = st[i + 4];
                const c = rot(st[i + 8], 21);
                st[i + 8] = rot((b & ~a) ^ c, 24);
                st[i + 4] = rot((a & ~c) ^ b, 31);
                st[i] ^= c & ~b;
            }
            this.swap(8, 10);
            this.swap(9, 11);
        }
    }
    squeezePermute() {
        const rate = this.stateBytes.slice(0, 16);
        this.permute();
        return rate;
    }
}
