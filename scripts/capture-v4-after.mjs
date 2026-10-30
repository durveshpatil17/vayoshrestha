import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const afterDir = path.join(rootDir, 'docs', 'screens', 'v4-after');

if (!fs.existsSync(afterDir)) {
  fs.mkdirSync(afterDir, { recursive: true });
}

const routes = [
  { name: 'login', path: '/login', role: null },
  { name: 'home-ra', path: '/', role: 'RA' },
  { name: 'home-nm', path: '/', role: 'NM' },
  { name: 'home-pm', path: '/', role: 'PM' },
  { name: 'home-cm', path: '/', role: 'CM' },
  { name: 'home-vf', path: '/', role: 'VF' },
  { name: 'home-ct', path: '/', role: 'CT' },
  { name: 'home-sa', path: '/', role: 'SA' },
  { name: 'inbox-work-workbench', path: '/inbox', role: 'RA' },
  { name: 'apps-directory', path: '/apps', role: 'RA' },
  { name: 'workspace-emergency', path: '/w/emergency', role: 'CT' },
  { name: 'workspace-care', path: '/w/care', role: 'CT' },
  { name: 'workspace-community', path: '/w/community', role: 'VF' },
  { name: 'workspace-field', path: '/w/field', role: 'SF' },
  { name: 'workspace-ecosystem', path: '/w/ecosystem', role: 'PM' },
  { name: 'workspace-governance', path: '/w/governance', role: 'NM' },
  { name: 'sos-board', path: '/sos', role: 'CT' },
  { name: 'sos-case-detail', path: '/sos/SOS-20261030-001', role: 'CT' },
  { name: 'seniors-list', path: '/seniors', role: 'RA' },
  { name: 'senior-detail', path: '/seniors/MEM-PUN-001', role: 'RA' },
  { name: 'onboarding-new', path: '/onboarding/new', role: 'RA' },
  { name: 'health-dashboard', path: '/health', role: 'CT' },
  { name: 'health-queue-calls', path: '/health/queue?tab=calls', role: 'CT' },
  { name: 'attendance-hub', path: '/attendance', role: 'CM' },
  { name: 'programmes-list', path: '/programmes', role: 'PM' },
  { name: 'field-terminal-desktop', path: '/field', role: 'SF' },
  { name: 'field-terminal-mobile', path: '/field', role: 'SF', viewport: { width: 390, height: 844 } },
  { name: 'routing-queue', path: '/routing', role: 'RA' },
  { name: 'vouchers', path: '/vouchers', role: 'CM' },
  { name: 'telemetry-dashboard', path: '/telemetry', role: 'NM' },
  { name: 'about-vayoshrestha', path: '/about', role: 'RA' },
  { name: 'verify-public-portal', path: '/verify', role: null },
  { name: 'settings-pilot-readiness', path: '/admin/settings', role: 'SA' },
  { name: 'data-governance-dpdp', path: '/admin/data-governance', role: 'NM' },
  { name: 'audit-ledger', path: '/admin/audit', role: 'SA' },
];

async function run() {
  console.log('Starting preview server on port 4180 for v4-after captures...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4180'], {
    cwd: rootDir,
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => console.log(`[preview] ${d}`));
  server.stderr.on('data', (d) => console.error(`[preview-err] ${d}`));

  await new Promise((r) => setTimeout(r, 2500));

  try {
    const browser = await chromium.launch();

    for (const r of routes) {
      const vp = r.viewport || { width: 1440, height: 900 };
      const context = await browser.newContext({
        viewport: vp,
        deviceScaleFactor: 1,
      });

      const page = await context.newPage();

      if (r.role) {
        await page.addInitScript((role) => {
          localStorage.setItem('vayoshrestha_active_role', role);
        }, r.role);
      }

      const url = `http://localhost:4180${r.path}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 8000 });
      } catch (e) {
        // Fallback to domcontentloaded
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 });
      }

      await page.waitForTimeout(600);

      const filePath = path.join(afterDir, `${r.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`Saved screenshot: ${r.name}.png (${vp.width}x${vp.height})`);

      await context.close();
    }

    await browser.close();
    console.log(`Successfully captured ${routes.length} after-screenshots into docs/screens/v4-after/`);
  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});

