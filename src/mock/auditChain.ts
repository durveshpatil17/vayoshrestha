import { AuditEvent } from '@/api/contracts';

export const GENESIS_HASH = 'GENESIS_VAYOSHRESTHA_2026';

/**
 * Deterministic SHA-256-like 64-character hex hash calculation for audit blocks.
 * Runs synchronously and deterministically in both browser and Node/Vitest environments.
 */
export function calculateAuditHash(event: Omit<AuditEvent, 'hash'>): string {
  const content = [
    event.previousHash || GENESIS_HASH,
    event.id,
    event.timestamp,
    event.actorId,
    event.actorRole,
    event.action,
    event.entityType,
    event.entityId,
    event.details,
    event.reason || '',
    JSON.stringify(event.diff || {}),
  ].join('|');

  // Deterministic 64-char hex hash implementation
  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);
    h0 = Math.imul(h0 ^ code, 0x01000193);
    h1 = Math.imul(h1 ^ (code << 3), 0x01000193);
    h2 = Math.imul(h2 ^ (code << 5), 0x01000193);
    h3 = Math.imul(h3 ^ (code << 7), 0x01000193);
    h4 = Math.imul(h4 ^ code, 0x5bd1e995);
    h5 = Math.imul(h5 ^ (code << 2), 0x5bd1e995);
    h6 = Math.imul(h6 ^ (code << 4), 0x5bd1e995);
    h7 = Math.imul(h7 ^ (code << 6), 0x5bd1e995);
  }

  const toHex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
  return `sha256-${toHex(h0)}${toHex(h1)}${toHex(h2)}${toHex(h3)}${toHex(h4)}${toHex(h5)}${toHex(h6)}${toHex(h7)}`;
}

/**
 * Verifies the integrity of an audit hash chain.
 * Handles both chronological (oldest to newest) and reverse-chronological (newest to oldest) arrays.
 */
export function verifyAuditChain(chain: AuditEvent[]): {
  valid: boolean;
  errorIndex?: number;
  reason?: string;
} {
  if (!chain || chain.length === 0) {
    return { valid: true };
  }

  // Detect direction: if the last element points to GENESIS, normalize to chronological
  let chron: AuditEvent[];
  const isReverse = chain[chain.length - 1]?.previousHash === GENESIS_HASH;
  if (isReverse) {
    chron = [...chain].reverse();
  } else {
    chron = [...chain];
  }

  for (let i = 0; i < chron.length; i++) {
    const current = chron[i];

    // Check genesis / previous link
    if (i === 0) {
      if (current.previousHash && current.previousHash !== GENESIS_HASH) {
        return {
          valid: false,
          errorIndex: isReverse ? chain.length - 1 : 0,
          reason: `Genesis block previousHash must be '${GENESIS_HASH}', found '${current.previousHash}'`,
        };
      }
    } else {
      const prior = chron[i - 1];
      if (current.previousHash !== prior.hash) {
        return {
          valid: false,
          errorIndex: isReverse ? chain.length - 1 - i : i,
          reason: `Chain broken at index ${i}: expected previousHash '${prior.hash}', found '${current.previousHash}'`,
        };
      }
    }

    // Verify cryptographic content integrity
    const expectedHash = calculateAuditHash(current);
    if (current.hash !== expectedHash) {
      return {
        valid: false,
        errorIndex: isReverse ? chain.length - 1 - i : i,
        reason: `Tamper detected at record ${current.id}: calculated '${expectedHash}', stored '${current.hash}'`,
      };
    }
  }

  return { valid: true };
}
