import { chromium } from 'playwright';

const email = process.env.TEST_ACCOUNT_EMAIL;
const password = process.env.TEST_ACCOUNT_PASSWORD;
if (!email || !password) throw new Error('TEST_ACCOUNT_EMAIL of TEST_ACCOUNT_PASSWORD ontbreekt.');

const base = 'https://groep8.klaarvoormiddelbaar.nl';
const pages = [
  '/les1/docent/poll/uitleg', '/les1/docent/quiz/uitleg', '/planeten-planner/docent/uitleg',
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
} catch (error) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.MONITOR_EMAIL;
  if (apiKey && recipient) {
    const message = String(error?.message || error);
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'User-Agent': 'klaarvoormiddelbaar-website-monitor/1.0' },
      body: JSON.stringify({
        from: 'Klaar voor Middelbaar <contact@klaarvoormiddelbaar.nl>',
        to: [recipient],
        subject: `FOUTMELDING – ${message.match(/Opdrachtpagina niet goed geladen: (.+)$/)?.[1] || 'ingelogde controle'}`,
        text: `De ingelogde controle vond een probleem.\n\n${message}`
      })
    });
  }
  throw error;
} finally {
  await browser.close();
}
