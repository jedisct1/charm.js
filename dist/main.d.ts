export declare class Charm {
    private x;
    static readonly tag_length = 16;
    static readonly key_length = 32;
    static readonly nonce_length = 16;
    static readonly hash_length = 32;
    constructor(key: Uint8Array, nonce?: Uint8Array);
    private static xor128;
    encrypt(msg: Uint8Array): Uint8Array;
    decrypt(msg: Uint8Array, expected_tag: Uint8Array): void;
    hash(msg: Uint8Array): Uint8Array;
}
