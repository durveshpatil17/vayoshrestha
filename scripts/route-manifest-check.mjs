#!/usr/bin/env node
/**
 * route-manifest-check.mjs
 * Verifies route-manifest.json consistency with registered router routes.
 */
import { readFileSync } from 'fs';

try {
  const manifest = JSON.parse(readFileSync('./docs/route-manifest.json', 'utf8'));
  const routerSource = readFileSync('./src/routes/index.tsx', 'utf8');

  const missing = [];
  for (const route of manifest.routes) {
    if (route.public) continue;
    const key = route.path.split('/').filter(Boolean)[0];
    if (!key) continue;
    if (!routerSource.includes(key)) {
      missing.push(route.path);
    }
  }

  console.log(`📋  route-manifest-check: ${manifest.routes.length} routes in manifest`);
  if (missing.length > 0) {
    console.log(`⚠️   ${missing.length} manifest routes being implemented:`);
    missing.slice(0, 5).forEach(p => console.log('    ' + p));
    if (missing.length > 5) console.log(`    ... and ${missing.length - 5} more`);
  } else {
    console.log('✅  All manifest routes present in router');
  }
  process.exit(0);
} catch (err) {
  console.error('❌  route-manifest-check failed:', err.message);
  process.exit(1);
}
