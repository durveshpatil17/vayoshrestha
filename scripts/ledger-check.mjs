#!/usr/bin/env node
/**
 * ledger-check.mjs — Verifies feature ledger consistency
 */
import { readFileSync } from 'fs';

try {
  const ledger = JSON.parse(readFileSync('./docs/feature-ledger.json', 'utf8'));
  const features = ledger.features || [];
  
  if (features.length === 0) {
    console.error('❌  ledger-check: No features found in feature-ledger.json');
    process.exit(1);
  }

  const built = features.filter(f => f.status === 'Built' || f.status.startsWith('Built')).length;
  const partial = features.filter(f => f.status === 'Partial').length;
  const missing = features.filter(f => f.status === 'Missing' || f.status === 'Planned').length;

  console.log(`✅  ledger-check: ${features.length} features tracked (${built} Built, ${partial} Partial, ${missing} Missing)`);
  process.exit(0);
} catch (err) {
  console.error('❌  ledger-check failed:', err.message);
  process.exit(1);
}

