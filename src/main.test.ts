import {Charm} from './main';

describe('Charm', () => {
    const key = new Uint8Array(32).fill(1);
    const nonce = new Uint8Array(16).fill(2);
    const getMessage = () => new TextEncoder().encode('Hello, World!');

    it('should encrypt and decrypt correctly', () => {
        const originalMessage = getMessage();
        const message = originalMessage.slice();

        const charm = new Charm(key, nonce);
        const tag = charm.encrypt(message);
        expect(tag).toHaveLength(16); // tag length

        const charm2 = new Charm(key, nonce);
        charm2.decrypt(message, tag);

        expect(new TextDecoder().decode(message)).toBe('Hello, World!');
    });

    it('should hash correctly', () => {
        const message = getMessage();
        const charm = new Charm(key, nonce);
        const hash = charm.hash(message);
        expect(hash).toHaveLength(32); // hash length

        // Hash should be deterministic
        const charm2 = new Charm(key, nonce);
        const hash2 = charm2.hash(message);
        expect(hash).toEqual(hash2);
    });

    it('should fail on incorrect tag', () => {
        const originalMessage = getMessage();
        const message = originalMessage.slice();

        const charm = new Charm(key, nonce);
        charm.encrypt(message);
        const wrongTag = new Uint8Array(16).fill(0);

        const charm2 = new Charm(key, nonce);
        expect(() => charm2.decrypt(message, wrongTag)).toThrow('Verification failed');
    });
}); 