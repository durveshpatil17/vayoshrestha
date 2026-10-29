import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const beforeDir = path.join(rootDir, 'docs', 'screens', 'v4-before');

if (!fs.existsSync(beforeDir)) {
  fs.mkdirSync(beforeDir, { recursive: true });
}

const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'docs', 'route-manifest.json'), 'utf8'));

// Map parameterized segments to seed IDs
function resolveParams(routePath) {
  return routePath
    .replace(':token', 'demo-reset-token')
    .replace(':code', 'VV-PACK-26-Q3-CSR')
    .replace(':seniorId', 'MEM-PUN-001')
    .replace(':id', (match, offset) => {
      if (routePath.includes('/seniors')) return 'MEM-PUN-001';
      if (routePath.includes('/sos')) return 'SOS-26-00042';
      if (routePath.includes('/health/reminders')) return 'REM-001';
      if (routePath.includes('/chapters')) return 'HUB-PUN';
      if (routePath.includes('/programmes')) return 'PROG-001';
      if (routePath.includes('/sessions') || routePath.includes('/attendance/session')) return 'SESS-001';
      if (routePath.includes('/templates')) return 'TMP-001';
      if (routePath.includes('/services')) return 'SRV-001';
      if (routePath.includes('/referrals')) return 'REF-26-00317';
      if (routePath.includes('/partners')) return 'PRT-001';
      if (routePath.includes('/routing/requests')) return 'REQ-001';
      if (routePath.includes('/vouchers')) return 'VCH-26-8942-D';
      if (routePath.includes('/legal-intake')) return 'LEG-26-00054';
      if (routePath.includes('/learning/library')) return 'LRN-001';
      if (routePath.includes('/support/escalations')) return 'ESC-001';
      if (routePath.includes('/telemetry/packs')) return 'VV-PACK-26-Q3-CSR';
      if (routePath.includes('/admin/users')) return 'USR-001';
      if (routePath.includes('/complaints')) return 'CMP-001';
      return '1';
    });
}

// Map capability or route to an appropriate allowed role
function getRoleForRoute(route) {
  if (route.public) return null;
  const p = route.path;
  if (p.startsWith('/me')) return 'SC';
  if (p.startsWith('/family')) return 'FM';
  if (p.startsWith('/field')) return 'SF';
  if (p.startsWith('/partner')) return 'SP';
  if (p.startsWith('/admin')) return 'SA';
  if (p.startsWith('/design')) return 'SA';
  if (p.startsWith('/telemetry/packs')) return 'PM';
  if (p.startsWith('/reports/pilot')) return 'NM';
  if (p.startsWith('/routing/rules')) return 'PM';
  return 'RA'; // Default staff role with wide permissions
}

async function run() {
  console.log('Starting preview server on port 4177...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4177'], {
    cwd: rootDir,
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => console.log(`[preview] ${d}`));
  server.stderr.on('data', (d) => console.error(`[preview-err] ${d}`));

  await new Promise((r) => setTimeout(r, 2500));

  const infeasible = [];
  let capturedCount = 0;

  try {
    const browser = await chromium.launch();

    for (const r of manifest.routes) {
      const resolvedPath = resolveParams(r.path);
      const role = getRoleForRoute(r);
      const safeName = r.path.replace(/\//g, '_').replace(/:/g, '$').replace(/^_/, '') || 'root';
      const isMobile = r.path.startsWith('/field');
      const vp = isMobile ? { width: 390, height: 844 } : { width: 1440, height: 900 };

      try {
        const context = await browser.newContext({ viewport: vp });
        const page = await context.newPage();

        await page.goto('http://localhost:4177/', { waitUntil: 'domcontentloaded' });

        if (role) {
          await page.evaluate((targetRole) => {
            try {
              const auth = window.__AUTH_STORE__;
              if (auth && auth.getState) {
                auth.getState().switchPersona(targetRole);
              }
            } catch (e) {}
          }, role);
        }

        const targetUrl = `http://localhost:4177${resolvedPath}`;
        const res = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 5000 }).catch(e => null);
        await page.waitForTimeout(150);

        const targetFile = path.join(beforeDir, `${safeName}.png`);
        await page.screenshot({ path: targetFile, fullPage: false });
        capturedCount++;
        await context.close();
      } catch (err) {
        console.warn(`Could not capture ${r.path}: ${err.message}`);
        infeasible.push({ path: r.path, reason: err.message });
      }
    }

    await browser.close();
    console.log(`Successfully captured ${capturedCount} screenshots into docs/screens/v4-before/.`);
    if (infeasible.length > 0) {
      console.log(`Infeasible routes (${infeasible.length}):`, infeasible);
      fs.writeFileSync(path.join(rootDir, 'docs', 'infeasible-screens.json'), JSON.stringify(infeasible, null, 2));
    }
  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

