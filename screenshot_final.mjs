import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });

await page.goto('http://localhost:3000/zoeken', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'preview_zoeken_fixed.png' });

await page.goto('http://localhost:3000/inloggen', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'preview_inloggen.png' });

await browser.close();
console.log('done');
