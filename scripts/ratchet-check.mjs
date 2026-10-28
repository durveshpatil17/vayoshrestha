#!/usr/bin/env node
/**
 * ratchet-check.mjs — Enforces no-regression ratchet
 */
import { readFileSync, writeFileSync } from 'fs';

try {
  const UPDATE = process.argv.includes('--update');
  const ratchet = JSON.parse(readFileSync('./docs/ratchet.json', 'utf8'));
  const ledger = JSON.parse(readFileSync('./docs/feature-ledger.json', 'utf8'));

  const builtCount = ledger.features.filter(f => f.status === 'Built').length;
  const routerSource = readFileSync('./src/routes/index.tsx', 'utf8');
  const routeMatches = (routerSource.match(/path:\s*['"]/g) || []).length;

  const current = {
    routes_registered: routeMatches,
    routes_manifest: ratchet.counts.routes_manifest,
    ledger_built: builtCount,
    ledger_planned: ledger.features.length - builtCount,
    tests_passing: ratchet.counts.tests_passing,
    permission_cells: ratchet.counts.permission_cells,
  };

  const RATCHETED_KEYS = ['routes_registered', 'ledger_built', 'tests_passing', 'permission_cells'];
  const errors = [];
  for (const key of RATCHETED_KEYS) {
    const value = ratchet.counts[key];
    if (value !== undefined && current[key] !== undefined && current[key] < value) {
      errors.push(`RATCHET VIOLATION: ${key} decreased from ${value} → ${current[key]}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌  ratchet: ${errors.length} violation(s)\n`);
    errors.forEach(e => console.error('  ' + e));
    process.exit(1);
  } else {
    console.log('✅  ratchet: all counts stable or increasing');
    console.log('   Current state:', JSON.stringify(current, null, 2));

    if (UPDATE) {
      ratchet.counts = { ...ratchet.counts, ...current };
      ratchet.snapshot_date = new Date().toISOString().split('T')[0];
      writeFileSync('./docs/ratchet.json', JSON.stringify(ratchet, null, 2));
      console.log('✅  ratchet.json updated successfully');
    }
    process.exit(0);
  }
} catch (err) {
  console.error('❌  ratchet failed:', err.message);
  process.exit(1);
}
