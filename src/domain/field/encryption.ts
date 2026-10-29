/**
 * WebCrypto AES-GCM Encryption for Field Network Activities
 * Encrypts sensitive peer interaction data before storing in local offline queues.
 */

export interface EncryptedFieldBlob {
  iv: string; // Hex string (12 bytes = 24 hex characters)
  ciphertext: string; // Base64 string
  algorithm: 'AES-GCM-256';
  version: 1;
}

export async function generateFieldKey(): Promise<CryptoKey> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('WebCrypto subtle is not supported in this environment');
  }

  return await subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptFieldPayload(
  payload: Record<string, any>,
  key?: CryptoKey
): Promise<EncryptedFieldBlob> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('WebCrypto subtle is not supported');
  }

  const cryptoKey = key || (await generateFieldKey());
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(JSON.stringify(payload));

  const cipherBuffer = await subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    cryptoKey,
    encodedData
  );

  // Convert IV to hex
  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Convert buffer to base64
  const cipherBytes = new Uint8Array(cipherBuffer);
  let binary = '';
  for (let i = 0; i < cipherBytes.byteLength; i++) {
    binary += String.fromCharCode(cipherBytes[i]);
  }
  const ciphertextBase64 = btoa(binary);

  return {
    iv: ivHex,
    ciphertext: ciphertextBase64,
    algorithm: 'AES-GCM-256',
    version: 1,
  };
}

export async function decryptFieldPayload(
  blob: EncryptedFieldBlob,
  key: CryptoKey
): Promise<Record<string, any>> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('WebCrypto subtle is not supported');
  }

  // Parse IV from hex
  const ivBytes = new Uint8Array(
    blob.iv.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  // Parse ciphertext from base64
  const binary = atob(blob.ciphertext);
  const cipherBytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    cipherBytes[i] = binary.charCodeAt(i);
  }

  const decryptedBuffer = await subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes,
    },
    key,
    cipherBytes
  );

  const decodedText = new TextDecoder().decode(decryptedBuffer);
  return JSON.parse(decodedText);
}
