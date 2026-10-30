/**
 * Standardized Error Codes for Vayoshrestha Digital Senior-Care Ecosystem
 * Format: E-<DOMAIN>-<CODE>
 */

export interface ErrorDefinition {
  code: string;
  domain: 'AUTH' | 'PERM' | 'DPDP' | 'GATE' | 'SYNC' | 'AUDT' | 'VALD';
  title: string;
  description: string;
  remediation: string;
}

export const ERROR_CODES: Record<string, ErrorDefinition> = {
  'E-AUTH-001': {
    code: 'E-AUTH-001',
    domain: 'AUTH',
    title: 'Session expired',
    description: 'The authentication token is no longer valid or session inactivity threshold was reached.',
    remediation: 'Please sign in again to re-authenticate your operational session.',
  },
  'E-AUTH-002': {
    code: 'E-AUTH-002',
    domain: 'AUTH',
    title: 'Account locked out',
    description: 'Account is temporarily locked due to excessive failed login attempts.',
    remediation: 'Wait 15 minutes for security lockout to expire, or contact your Chapter Administrator.',
  },
  'E-PERM-001': {
    code: 'E-PERM-001',
    domain: 'PERM',
    title: 'Access denied',
    description: 'Your assigned role does not possess authorization for this resource or action.',
    remediation: 'Switch to an authorized persona or request elevated capability in the RBAC matrix.',
  },
  'E-PERM-002': {
    code: 'E-PERM-002',
    domain: 'PERM',
    title: 'Cross-chapter boundary violation',
    description: 'Resource belongs to a different chapter than your currently active scope.',
    remediation: 'Switch your active chapter in the Shell Bar to match the target resource.',
  },
  'E-DPDP-001': {
    code: 'E-DPDP-001',
    domain: 'DPDP',
    title: 'Missing statutory consent',
    description: 'The senior has not granted explicit consent for this communication or data processing activity.',
    remediation: 'Obtain and record senior consent before dispatching communications or sharing data.',
  },
  'E-DPDP-002': {
    code: 'E-DPDP-002',
    domain: 'DPDP',
    title: 'Quiet-hours delivery restriction',
    description: 'Non-emergency outbound communications are restricted between 21:00 and 08:00 IST.',
    remediation: 'Schedule broadcast for deferred morning release or mark as emergency SOS bypass.',
  },
  'E-GATE-001': {
    code: 'E-GATE-001',
    domain: 'GATE',
    title: 'WhatsApp gateway delivery timeout',
    description: 'Primary messaging provider failed to acknowledge delivery within 5 seconds.',
    remediation: 'Automatic telephony SMS fallback will be dispatched; monitor delivery queue.',
  },
  'E-GATE-002': {
    code: 'E-GATE-002',
    domain: 'GATE',
    title: 'Telephony SMS fallback failure',
    description: 'SMS gateway service failed or cell tower unreachable for recipient.',
    remediation: 'Dispatch field volunteer associate for in-person welfare visit.',
  },
  'E-SYNC-001': {
    code: 'E-SYNC-001',
    domain: 'SYNC',
    title: 'Offline synchronization conflict',
    description: 'Local terminal payload timestamp contradicts existing server record.',
    remediation: 'Review conflict in Field Network Sync Supervision queue.',
  },
  'E-AUDT-001': {
    code: 'E-AUDT-001',
    domain: 'AUDT',
    title: 'Cryptographic hash mismatch',
    description: 'Audit block previous-hash pointer does not match preceding record digest.',
    remediation: 'Security alert logged; verify database integrity from genesis block.',
  },
  'E-VALD-001': {
    code: 'E-VALD-001',
    domain: 'VALD',
    title: 'Validation error',
    description: 'One or more required fields are missing or improperly formatted.',
    remediation: 'Verify form entries against validation guidelines and re-submit.',
  },
};

export function formatErrorMessage(code: keyof typeof ERROR_CODES | string, fallback?: string): string {
  const def = ERROR_CODES[code];
  if (!def) return fallback || `An unexpected error occurred (${code}).`;
  return `[${def.code}] ${def.title}: ${def.description}`;
}
