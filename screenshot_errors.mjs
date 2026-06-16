import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(err.message));

await page.goto('http://localhost:3000/zoeken', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

console.log('Errors:', JSON.stringify(errors, null, 2));
await browser.close();
