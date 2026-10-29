import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const afterDir = path.join(rootDir, 'docs', 'screens', 'after');

if (!fs.existsSync(afterDir)) {
  fs.mkdirSync(afterDir, { recursive: true });
}

const routes = [
  { name: 'login', path: '/login', role: null },
  { name: 'home-ra', path: '/', role: 'RA' },
  { name: 'home-sf', path: '/', role: 'SF' },
  { name: 'home-sa', path: '/', role: 'SA' },
  { name: 'sos-board', path: '/sos', role: 'RA' },
  { name: 'seniors-list', path: '/seniors', role: 'RA' },
  { name: 'senior-detail', path: '/seniors/MEM-PUN-001', role: 'RA' },
  { name: 'onboarding-new', path: '/onboarding/new', role: 'RA' },
  { name: 'health-dashboard', path: '/health', role: 'RA' },
  { name: 'programmes-list', path: '/programmes', role: 'RA' },
  { name: 'field-desktop', path: '/field', role: 'SF' },
  { name: 'field-mobile', path: '/field', role: 'SF', viewport: { width: 390, height: 844 } },
  { name: 'field-network', path: '/field-network', role: 'RA' },
  { name: 'routing-queue', path: '/routing', role: 'RA' },
  { name: 'vouchers', path: '/vouchers', role: 'RA' },
  { name: 'legal-intake', path: '/legal-intake', role: 'RA' },
  { name: 'telemetry', path: '/telemetry', role: 'RA' },
  { name: 'learning', path: '/learning', role: 'RA' },
  { name: 'simulator', path: '/simulator', role: 'RA' },
  { name: 'verify', path: '/verify', role: null },
  { name: 'design-gallery', path: '/design', role: 'SA' },
];

async function run() {
  console.log('Building preview if needed...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4175'], {
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

      // First open home to allow localStorage access
      await page.goto('http://localhost:4175/', { waitUntil: 'domcontentloaded' });

      if (r.role) {
        // Set role in authStore / mock
        await page.evaluate((role) => {
          try {
            const auth = window.__AUTH_STORE__;
            if (auth && auth.getState) {
              auth.getState().switchPersona(role);
            }
          } catch (e) {}
        }, r.role);
      }

      console.log(`Capturing ${r.name} at ${r.path}...`);
      await page.goto(`http://localhost:4175${r.path}`, { waitUntil: 'networkidle' }).catch(() => {});
      await page.waitForTimeout(500);

      const targetPath = path.join(afterDir, `${r.name}.png`);
      await page.screenshot({ path: targetPath, fullPage: false });
      console.log(`Saved: ${targetPath}`);

      await context.close();
    }

    await browser.close();
    console.log('Finished capturing after screenshots.');
  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
