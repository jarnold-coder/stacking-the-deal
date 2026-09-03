// Phone-sized screenshots of index.html for layout checks.
// Usage: node tools/shoot.js  (needs Chrome installed; uses puppeteer-core)
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = path.join(__dirname, '..', 'screenshots');
const URL = 'file:///' + path.join(__dirname, '..', 'index.html').replace(/\\/g, '/');
fs.mkdirSync(OUT, { recursive: true });

const DEVICES = {
  iphone: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  small: { width: 360, height: 740, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  const report = [];
  async function shot(name, device = 'iphone') {
    await page.setViewport(DEVICES[device]);
    await new Promise(r => setTimeout(r, 250));
    const file = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: file });
    const m = await page.evaluate(() => {
      const s = document.getElementById('scroller');
      const nav = document.querySelector('.bnav').getBoundingClientRect();
      return { overflowX: s.scrollWidth - s.clientWidth, navBottomGap: Math.round(innerHeight - nav.bottom), navTop: Math.round(nav.top), scrollTop: s.scrollTop, docScroll: document.documentElement.scrollHeight - innerHeight };
    });
    report.push({ name, device, ...m });
  }
  const go = async (js) => { await page.evaluate(js); await new Promise(r => setTimeout(r, 400)); };
  const scrollTo = async (sel) => { await page.evaluate(s => { document.querySelector(s).scrollIntoView({ block: 'start' }); document.getElementById('scroller').scrollBy(0, -60); }, sel); await new Promise(r => setTimeout(r, 300)); };

  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload({ waitUntil: 'networkidle0' });
  await go(() => document.fonts.ready);

  // Primer
  await shot('01-primer-cover');
  await go(() => goStep(1)); await shot('02-primer-uses');
  await go(() => goStep(3)); await shot('03-primer-noi');
  await go(() => goStep(4)); await shot('04-primer-dscr');
  await go(() => goStep(5)); await shot('05-primer-return');
  await go(() => goStep(6)); await shot('06-primer-verdict');

  // Deal
  await go(() => goView('deal')); await shot('07-deal-top');
  await go(() => { document.querySelector('[data-math="geo"]').click(); });
  await scrollTo('#mv-geo'); await shot('08-deal-geo-math');
  await go(() => { ['geo', 'solar', 'ph', 'tall', 'gardens'].forEach(k => state.moves[k] = true); renderDeal(); document.getElementById('scroller').scrollTo(0, 0); });
  await shot('09-deal-all-green');
  await scrollTo('#moves-capital'); await shot('10-deal-capital-moves');
  await go(() => { state.moves.htc = true; renderDeal(); });
  await scrollTo('#uses-bar-d'); await shot('11-deal-stack-bars');
  await scrollTo('#wf-d'); await shot('12-deal-waterfall');
  await go(() => { document.querySelectorAll('details')[0].open = true; document.querySelectorAll('details')[1].open = true; });
  await scrollTo('#t-budget'); await shot('13-deal-budget-table');
  await go(() => { document.querySelectorAll('details')[5].open = true; });
  await scrollTo('#t-irr'); await shot('14-deal-irr-table');
  await scrollTo('.dials'); await shot('15-deal-dials');

  // Glossary and inputs
  await go(() => goView('glossary')); await shot('16-glossary');
  await go(() => goView('inputs')); await shot('17-inputs-top');
  await scrollTo('#af-rate'); await shot('18-inputs-debt');

  // Dark mode and a smaller phone
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  await go(() => goView('deal')); await shot('19-deal-dark');
  await go(() => goView('primer')); await go(() => goStep(3)); await shot('20-primer-dark');
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await go(() => goView('deal')); await shot('21-deal-small', 'small');
  await scrollTo('#mv-tall'); await shot('22-moves-small', 'small');
  await go(() => goStep(0)); await go(() => goView('primer')); await shot('23-cover-small', 'small');

  console.table(report);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
