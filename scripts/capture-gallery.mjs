import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const screensDir = path.join(rootDir, 'docs', 'screens');

if (!fs.existsSync(screensDir)) {
  fs.mkdirSync(screensDir, { recursive: true });
}

async function run() {
  console.log('Starting preview server on port 4173...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    cwd: rootDir,
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => console.log(`[preview] ${d}`));
  server.stderr.on('data', (d) => console.error(`[preview-err] ${d}`));

  // Wait 3 seconds for server to start
  await new Promise((r) => setTimeout(r, 3000));

  try {
    console.log('Launching Playwright Chromium at 1440x900...');
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    console.log('Navigating to http://localhost:4173/design ...');
    await page.goto('http://localhost:4173/design', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Above the fold screenshot (1440x900)
    const aboveFoldPath = path.join(screensDir, 'design-gallery-1440x900.png');
    await page.screenshot({ path: aboveFoldPath });
    console.log(`Saved above-the-fold screenshot to: ${aboveFoldPath}`);

    // 2. Full page screenshot
    const fullPagePath = path.join(screensDir, 'design-gallery-full.png');
    await page.screenshot({ path: fullPagePath, fullPage: true });
    console.log(`Saved full page screenshot to: ${fullPagePath}`);

    // 3. Switch to Floorplans tab and screenshot
    const floorplansButton = page.getByRole('tab', { name: 'Floorplan Skeletons' });
    if (await floorplansButton.isVisible()) {
      await floorplansButton.click();
      await page.waitForTimeout(500);
      const floorplansPath = path.join(screensDir, 'design-gallery-floorplans.png');
      await page.screenshot({ path: floorplansPath, fullPage: true });
      console.log(`Saved floorplans screenshot to: ${floorplansPath}`);
    }

    await browser.close();
    console.log('Visual screenshot capture completed successfully.');
  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

