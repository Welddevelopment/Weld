import puppeteer from 'file:///C:/Users/cubit/Downloads/weld.%20development%20V2/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3002';
const selector = process.argv[3] || '.hero-shell';
const label = process.argv[4] || 'section';

const dir = join(__dirname, 'temporary screenshots');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

let n = 1;
while (existsSync(join(dir, `screenshot-${n}-${label}.png`))) n++;
const file = join(dir, `screenshot-${n}-${label}.png`);

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

const el = await page.$(selector);
if (!el) {
  console.error('Selector not found:', selector);
  await browser.close();
  process.exit(1);
}
await el.screenshot({ path: file });
await browser.close();
console.log('Saved:', file);
