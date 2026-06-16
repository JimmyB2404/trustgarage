import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });

const shots = [
  { url: 'http://localhost:3000', file: 'preview_homepage.png' },
  { url: 'http://localhost:3000/zoeken', file: 'preview_zoeken.png' },
  { url: 'http://localhost:3000/garage/garage-van-den-berg', file: 'preview_profiel.png' },
  { url: 'http://localhost:3000/dashboard', file: 'preview_dashboard.png' },
];

for (const s of shots) {
  await page.goto(s.url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: s.file });
  console.log('✓ ' + s.url);
}

await browser.close();
