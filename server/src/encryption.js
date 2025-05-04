// Encryption utilities using Web Crypto API
async function generateKey() {
  return await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function encryptMessage(key, message) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(message));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  return { iv: Array.from(iv), ciphertext: Array.from(new Uint8Array(ciphertext)) };
}

async function decryptMessage(key, { iv, ciphertext }) {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    key,
    new Uint8Array(ciphertext)
  );
  return JSON.parse(new TextDecoder().decode(decrypted));
}

module.exports = { generateKey, encryptMessage, decryptMessage };
