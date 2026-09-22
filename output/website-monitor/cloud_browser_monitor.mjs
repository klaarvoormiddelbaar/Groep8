import { chromium } from 'playwright';

const email = process.env.TEST_ACCOUNT_EMAIL;
const password = process.env.TEST_ACCOUNT_PASSWORD;
if (!email || !password) throw new Error('TEST_ACCOUNT_EMAIL of TEST_ACCOUNT_PASSWORD ontbreekt.');

const base = 'https://groep8.klaarvoormiddelbaar.nl';
const pages = [
  '/les1/docent/poll/uitleg', '/les1/docent/quiz/uitleg', '/planeten-planner',
  '/les3/docent/missie/uitleg', '/les3/docent/quiz/uitleg',
  '/les5/docent/woordwolk/uitleg', '/les5/docent/voorspel/uitleg', '/les5/docent/quiz/uitleg',
  '/les7/docent/formele-mail/uitleg', '/les7/docent/quiz/uitleg',
  '/tips-en-tops/leerkracht/uitleg', '/les8/docent/quiz/uitleg'
];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
try {
  await page.goto(`${base}/Inlogpagina/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Inloggen', exact: true }).click();
  await page.waitForURL(/\/Dashboard\//, { timeout: 30000 });
  const dashboard = await page.locator('body').innerText();
  if (!dashboard.includes('8 lessen')) throw new Error('Dashboard toont niet alle 8 lessen.');
  for (let i = 1; i <= 8; i++) {
    await page.goto(`${base}/les${i}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => document.body.innerText.includes('LEERDOELEN'), null, { timeout: 30000 });
  }
  for (const path of pages) {
    await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const text = await page.locator('body').innerText();
    if (text.length < 200 || /Vercel Security Checkpoint|404|niet gevonden/i.test(text)) throw new Error(`Opdrachtpagina niet goed geladen: ${path}`);
  }
} finally {
  await browser.close();
}
