// ESM example
import { Charm } from '../dist/esm/main.js';

// Create a key and nonce
const key = new Uint8Array(32).fill(1);
const nonce = new Uint8Array(16).fill(2);

// Create a message
const message = new TextEncoder().encode('Hello from Charm!');
console.log('Original message:', new TextDecoder().decode(message));

// Encrypt
const charm = new Charm(key, nonce);
const tag = charm.encrypt(message);
console.log('Message encrypted');

// Decrypt
const charm2 = new Charm(key, nonce);
charm2.decrypt(message, tag);
console.log('Decrypted message:', new TextDecoder().decode(message));

// Hash
const hash = charm.hash(message);
console.log('Message hash (hex):', Buffer.from(hash).toString('hex')); 