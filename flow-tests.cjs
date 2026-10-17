// Browser flow checks for the ComboFlow prototype (engineering QA only; synthetic fixtures).
// Run: NODE_PATH=$(npm root -g) node flow-tests.cjs   (needs Playwright + Chromium; serves dist/ itself)
const assert = require('node:assert/strict'), http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const { chromium } = require('playwright');
const dist = path.join(__dirname, 'dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.json': 'application/json', '.md': 'text/markdown', '.csv': 'text/csv' };
const server = http.createServer((req, res) => {
  const file = path.join(dist, decodeURIComponent(req.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(dist) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(res);
});
let n = 0;
async function test(name, page, fn) { await page.evaluate(() => { kitchenTickets = seedKitchen(45); ingredientStock = KP.stockDefaults(); readyExtras = { potato: 3, tart: 4, fries: 0, salad: 2 }; readyAge = { potato: 0, tart: 0, fries: 0, salad: 0 }; switchChannel('kiosk'); }); await fn(); n++; console.log('PASS ' + name); }
const ev = (page, fn, arg) => page.evaluate(fn, arg);

(async () => {
  await new Promise(r => server.listen(0, r));
  const url = `http://localhost:${server.address().port}/`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);

  await test('kiosk guided flow keeps 3+1, variants, order mode and ticket number', page, async () => {
    await page.click('text=Help me choose >> nth=0');
    await page.click('text=Find my meal →');
    assert(await page.locator('.guided-cards .card').count() <= 3);
    await ev(page, () => choose('classic', false));
    await page.click('.chicken-options button:has-text("Spicy")');
    await page.click('.drink-options button:has-text("Mirinda")');
    await page.click('button:has-text("Take away")');
    assert.equal(await page.locator('.addon-option').count(), 1);
    assert.equal(await ev(page, () => kioskAdded), null, 'nothing added automatically');
    await page.click('.addon-option');
    assert.equal(await ev(page, () => page), 'review');
    assert.match(await page.textContent('.custom-receipt'), /Spicy chicken · Mirinda · Take away/);
    const tickets = await ev(page, () => kitchenTickets.length);
    await page.click('text=Continue to payment →');
    assert.equal(await ev(page, () => page), 'payment');
    assert(await page.locator('button:has-text("Pay & place demo order"), button:has-text("Place demo order")').first().isDisabled(), 'payment method must be chosen explicitly');
    await ev(page, () => confirmOrder());
    assert.equal(await ev(page, () => page), 'payment', 'no order without a payment method');
    await page.click('.pay-options button:has-text("Card (demo)")');
    await page.click('text=Pay & place demo order →');
    await ev(page, () => confirmOrder());
    assert.equal(await ev(page, () => kitchenTickets.length), tickets + 1, 'repeated confirm creates one ticket');
    const t = await ev(page, () => kitchenTickets.at(-1));
    assert.deepEqual(t.lines[0].variant, { chicken: 'Spicy', drink: 'Mirinda' });
    assert.match(t.label, /Take away/);
    assert.match(await page.textContent('.order-number'), new RegExp('#' + t.id));
    assert.equal(await ev(page, () => confirmed.total), 174000);
    assert.match(await page.textContent('.success'), /Payment: Card \(demo\) · simulated, nothing charged/);
  });

  await test('View basket on customize continues without the extra; Checkout opens payment', page, async () => {
    await ev(page, () => { startGuided(); go('options'); choose('classic', false); });
    await page.click('.cart-button');
    assert.equal(await ev(page, () => page), 'review');
    assert.equal(await ev(page, () => kioskAdded), null, 'nothing added automatically');
    assert.match(await page.textContent('.cart-button'), /Checkout/);
    await page.click('.cart-button');
    assert.equal(await ev(page, () => page), 'payment');
    await page.click('.pay-options button:has-text("Pay at the counter")');
    await page.click('text=← Back to review');
    assert.equal(await ev(page, () => payMethod), null, 'payment choice resets when leaving the step');
  });

  await test('variant becoming unavailable at review returns to customization with a notice', page, async () => {
    await ev(page, () => { startGuided(); go('options'); choose('classic', false); setCustomization('chicken', 'Spicy'); kioskUpsellAct('SKIP'); });
    assert.equal(await ev(page, () => page), 'review');
    await ev(page, () => toggleVariant('Spicy', true));
    assert.equal(await ev(page, () => page), 'customize');
    assert.equal(await ev(page, () => customization.chicken), 'Original');
    assert.match(await ev(page, () => notice), /Spicy is no longer available/);
    assert(await page.locator('.chicken-options button:has-text("Spicy")').isDisabled());
    await ev(page, () => setCustomization('chicken', 'Spicy'));
    assert.equal(await ev(page, () => customization.chicken), 'Original', 'unavailable variant cannot be selected');
  });

  await test('meal with no available drink is not offered', page, async () => {
    const ok = await ev(page, () => { s.unavailableVariants = ['Pepsi', '7UP', 'Mirinda']; return E.decide(s).eligible.every(x => !x.variantGroups.includes('drink')); });
    assert(ok);
  });

  await test('POS ADD keeps editing the basket; extra and totals stay in sync', page, async () => {
    await ev(page, () => switchChannel('pos'));
    const rec = await ev(page, () => decision().cards[0].id);
    await page.click('.pos-widget button:has-text("ADD")');
    assert.equal(await ev(page, () => page), 'pos');
    assert.equal(await ev(page, () => added.id), rec);
    await ev(page, () => changePOS('riceMain', 1));
    assert.equal(await ev(page, () => added?.id), rec, 'valid extra kept after basket edit');
    const staff = await ev(page, () => E.quotePOS(s, added).total);
    assert.match(await page.textContent('.customer-total strong'), new RegExp(staff.toLocaleString('en-US')));
    assert.equal(await page.locator('.customer-suggestion').count(), 0, 'no further suggestion after ADD');
    await page.click('.pos-widget button:has-text("Review basket")');
    await page.click('text=Back to basket');
    assert.equal(await ev(page, () => added?.id), rec, 'back to basket keeps the accepted extra');
    await page.click('.pos-widget button:has-text("Review basket")');
    await page.click('text=Confirm basket →');
    assert.equal(await ev(page, () => confirmed.total), staff);
    assert(await ev(page, () => kitchenTickets.at(-1).lines.some(l => l.id === added.id)));
  });

  await test('POS SKIP is respected until staff reopens it explicitly', page, async () => {
    await ev(page, () => switchChannel('pos'));
    await page.click('.pos-widget button:has-text("SKIP")');
    await ev(page, () => changePOS('riceMain', 1));
    assert.equal(await ev(page, () => added), null);
    assert.equal(await page.locator('.customer-suggestion').count(), 0);
    assert.match(await page.textContent('.pos-widget'), /Suggestion skipped/);
    await page.click('text=Show suggestion again');
    assert.equal(await page.locator('.customer-suggestion').count(), 1);
    assert.equal(await page.locator('.pos-widget button:has-text("ADD")').count(), 1);
  });

  await test('POS review requires an explicit ADD/SKIP when a suggestion is open', page, async () => {
    await ev(page, () => switchChannel('pos'));
    await ev(page, () => posAct('REVIEW'));
    assert.equal(await ev(page, () => page), 'pos');
  });

  await test('demo offer is never re-applied silently', page, async () => {
    await ev(page, () => { switchChannel('pos'); changePOS('side', 1); applyPOSOffer(true); });
    assert.equal(await ev(page, () => E.quotePOS(s, added).discount), 10000);
    await ev(page, () => changePOS('side', -1));
    assert.equal(await ev(page, () => s.applyPromo), false);
    await ev(page, () => changePOS('side', 1));
    assert.equal(await ev(page, () => E.quotePOS(s, added).discount), 0);
  });

  await test('High removes the open suggestion and an accepted extra; orders continue', page, async () => {
    await ev(page, () => { switchChannel('pos'); posAct('ADD'); setBand('High'); });
    assert.equal(await ev(page, () => added), null);
    assert.equal(await ev(page, () => decision().cards.length), 0);
    await ev(page, () => posAct('REVIEW'));
    assert.equal(await ev(page, () => page), 'review');
    await ev(page, () => { setBand('Normal'); switchChannel('kiosk'); setBand('High'); });
    assert.equal(await ev(page, () => E.kioskUpsell(s, E.meals.find(x => x.id === 'ready')).cards.length), 0);
    await ev(page, () => setBand('Normal'));
  });

  await test('ready portions past the hold window leave ready-first ranking until re-checked', page, async () => {
    await ev(page, () => { readyExtras = { potato: 3, tart: 0, fries: 0, salad: 0 }; readyAge = { potato: 0, tart: 0, fries: 0, salad: 0 }; switchChannel('pos'); });
    assert.equal(await ev(page, () => decision().cards[0].readyCount), 3);
    await ev(page, () => { advanceKitchen(KP.HOLD_LIMIT_S + 30); setBand('Normal'); switchChannel('pos'); });
    assert.equal(await ev(page, () => decision().cards[0]?.readyCount || 0), 0);
    await ev(page, () => recheckReady('potato'));
    assert.equal(await ev(page, () => decision().cards[0].readyCount), 3);
    await ev(page, () => discardReady('potato'));
    assert.equal(await ev(page, () => readyExtras.potato), 0);
  });

  await test('kitchen start deducts Spicy marinade once', page, async () => {
    await ev(page, () => { switchChannel('kitchen'); resetIngredients(); kitchenTickets.push({ id: 'T1', age: 0, status: 'queued', channel: 'Kiosk', label: 'test', lines: [{ id: 'classic', qty: 1, variant: { chicken: 'Spicy', drink: 'Pepsi' } }], fixture: false }); });
    const before = await ev(page, () => ({ ...ingredientStock }));
    await ev(page, () => { kitchenStep('T1', 'preparing'); kitchenStep('T1', 'preparing'); kitchenStep('T1', 'ready'); });
    const after = await ev(page, () => ({ ...ingredientStock }));
    assert.equal(before.spicy - after.spicy, 2);
    assert.equal(before.chicken - after.chicken, 2);
  });

  await test('no horizontal overflow at 390px on customize and POS', page, async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await ev(page, () => { startGuided(); go('options'); choose('classic', false); });
    assert.equal(await ev(page, () => document.documentElement.scrollWidth), 390);
    await ev(page, () => { switchChannel('pos'); posAct('ADD'); });
    assert.equal(await ev(page, () => document.documentElement.scrollWidth), 390);
    await page.setViewportSize({ width: 1366, height: 768 });
  });

  assert.deepEqual(errors, [], 'no console errors');
  const standalone = path.join(dist, 'ComboFlow-standalone.html');
  if (fs.existsSync(standalone)) {
    const p2 = await browser.newPage(); const external = [];
    p2.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) external.push(r.url()); });
    await p2.goto('file://' + standalone);
    await p2.evaluate(() => { startGuided(); go('options'); choose('classic', false); kioskUpsellAct('SKIP'); go('payment'); choosePayment('qr'); confirmOrder(); });
    assert.equal(await p2.evaluate(() => page), 'done');
    assert.deepEqual(external, [], 'standalone makes no external requests');
    n++; console.log('PASS standalone runs offline with no external requests');
  }
  await browser.close(); server.close();
  console.log(`${n} browser flow checks passed. Engineering QA only; no user validation.`);
})().catch(e => { console.error(e); process.exit(1); });
