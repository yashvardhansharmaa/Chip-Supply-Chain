#!/usr/bin/env node
/* Suppliers in the redesign (stage 3), driven as a reader would: the route's stops, a country chosen on the route, the
   ribbons' colors (Critical in red wine, the rest gray, a followed country dark gray), the country buttons, the EU-27 switch,
   the three tabs and their addresses, the filters, and a segment picked on the ribbons.
   usage: node qa/redesign/interact-suppliers.js [base] (default http://127.0.0.1:8766) */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = process.argv[2] || 'http://127.0.0.1:8766';
const WINE = 'rgb(122, 31, 43)', GRAY = 'rgb(210, 209, 204)', DARK = 'rgb(140, 138, 132)', INK = 'rgb(23, 23, 22)';
(async () => {
  const chrome = launch(); const out = []; let bad = 0;
  const check = (name, ok, detail) => { out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ': ' + detail : ''}`); if (!ok) bad++; };
  const fill = (sel) => `(function(){var e=document.querySelector(${JSON.stringify(sel)});return e?getComputedStyle(e).fill:'none';})()`;
  try {
    // no two numbered stops touch, at every width that numbers them
    for (const width of [768, 1024, 1200, 1280, 1440]) {
      const t = await open(chrome, BASE + '/#/suppliers', { width, wait: 2000 });
      const hits = await t.ev(`(function(){var r=[...document.querySelectorAll('.atlas .sa-stop')].map(function(a){return [a.textContent, a.getBoundingClientRect()];}), o=[];
        for (var i=0;i<r.length;i++) for (var j=i+1;j<r.length;j++){var a=r[i][1],b=r[j][1];if(a.right>b.left+0.5&&b.right>a.left+0.5&&a.bottom>b.top+0.5&&b.bottom>a.top+0.5)o.push(r[i][0]+'x'+r[j][0]);}return o.join(' ');})()`);
      check(`${width}: no two route stops overlap`, !hits, hits);
      await t.close();
    }
    for (const width of [1440, 390]) {
      const t = await open(chrome, BASE + '/#/suppliers', { width, wait: 2500 });
      check(`${width}: the page reads route, ribbons, then the firms`, await t.ev("(function(){var a=document.getElementById('the-route'),b=document.getElementById('sup-pipe'),c=document.getElementById('sup-reg');return !!(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING)&&!!(b.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_FOLLOWING);})()"));
      check(`${width}: the four counts`, /226/.test(await t.ev("document.querySelector('.sup-facts-row').textContent")), await t.ev("document.querySelector('.sup-facts-row').innerText.replace(/\\s+/g,' ')"));
      check(`${width}: the ribbons are drawn open on the page`, (await t.ev("document.querySelectorAll('#sup-pipe .sup-rib').length")) > 60);
      check(`${width}: Critical ribbons are red wine`, (await t.ev(fill('.sup-rib.is-crit'))) === WINE, await t.ev(fill('.sup-rib.is-crit')));
      check(`${width}: every other ribbon is gray`, (await t.ev(fill('.sup-rib:not(.is-crit)'))) === GRAY, await t.ev(fill('.sup-rib:not(.is-crit)')));
      check(`${width}: today's full ribbon note`, /Siemens EDA is run from Oregon[\s\S]*Linde plc[\s\S]*under the UK[\s\S]*Emerging Technology Observatory does\./.test(await t.ev("document.getElementById('sup-note').textContent")));
      // a country button follows its ribbons
      await t.ev("(document.querySelector('.sup-chip[data-c=\"JP\"]').click(), 1)"); await sleep(400);
      check(`${width}: the pressed button fills black`, (await t.ev("getComputedStyle(document.querySelector('.sup-chip[data-c=\"JP\"]')).backgroundColor")) === INK && (await t.ev("document.querySelector('.sup-chip[data-c=\"JP\"]').getAttribute('aria-pressed')")) === 'true');
      check(`${width}: Japan's other ribbons turn dark gray`, (await t.ev(fill('.sup-rib.c-JP:not(.is-crit)'))) === DARK, await t.ev(fill('.sup-rib.c-JP:not(.is-crit)')));
      check(`${width}: Japan's Critical ribbons stay wine`, (await t.ev(fill('.sup-rib.c-JP.is-crit'))) === WINE && +(await t.ev("getComputedStyle(document.querySelector('.sup-rib.c-JP.is-crit')).opacity")) > 0.9);
      check(`${width}: the other countries' ribbons fade`, +(await t.ev("getComputedStyle(document.querySelector('.sup-rib.c-US:not(.is-crit)')).opacity")) < 0.5);
      await t.ev("(document.querySelector('.sup-chip[data-c=\"JP\"]').click(), 1)"); await sleep(300);
      check(`${width}: pressed again, it lets go`, (await t.ev("document.getElementById('sup-pipe').getAttribute('data-lit')")) === '0');
      // the route's chosen country presses the same button
      await t.ev("(document.querySelector('.sa-role[data-cc=\"TW\"]').click(), 1)"); await sleep(400);
      check(`${width}: Taiwan on the route shows its panel`, await t.ev("!document.querySelector('.sa-panel[data-cc=\"TW\"]').hidden && document.querySelectorAll('.sa-stop.is-on').length === 3")); // Hsinchu, Kaohsiung and Taipei (4 before the merge of 27 Oct 2026 took Tainan off the route)
      check(`${width}: ...and follows Taiwan's ribbons`, (await t.ev("(document.querySelector('.sup-chip[aria-pressed=\"true\"]')||{}).textContent")) === 'Taiwan');
      await t.ev("(document.querySelector('.sa-role[data-cc=\"TW\"]').click(), 1)"); await sleep(300);
      // EU-27 together
      await t.ev("(document.querySelector('.sup-gbtn[data-group=\"eu\"]').click(), 1)"); await sleep(600);
      check(`${width}: EU-27 together draws one column`, await t.ev("document.querySelectorAll('.sup-rib.c-EU').length > 0 && !document.querySelector('.sup-rib.c-NL')"));
      check(`${width}: ...lights it and presses its button`, (await t.ev("(document.querySelector('.sup-chip[aria-pressed=\"true\"]')||{}).getAttribute('data-c')")) === 'EU');
      check(`${width}: ...and the address says so`, /group=eu/.test(await t.ev('location.hash')), await t.ev('location.hash'));
      await t.ev("(document.querySelector('.sup-gbtn[data-group=\"country\"]').click(), 1)"); await sleep(600);
      check(`${width}: Each country draws them apart again`, await t.ev("!!document.querySelector('.sup-rib.c-NL') && location.hash === '#/suppliers'"), await t.ev('location.hash'));
      // the tabs
      check(`${width}: By segment opens first, twenty segments`, await t.ev("!document.getElementById('sup-ladder').hidden && document.getElementById('sup-ladder-cc').hidden && document.querySelectorAll('#sup-ladder .sup-rung').length === 20"));
      check(`${width}: the ladder's heading says segments`, (await t.ev("document.getElementById('sup-ladder-h').textContent")) === 'Segments by number of firms, fewest first');
      await t.ev("(document.querySelector('.sup-tabs a[data-tab=\"country\"]').click(), 1)"); await sleep(400);
      check(`${width}: By country lists every country`, await t.ev("!document.getElementById('sup-ladder-cc').hidden && document.getElementById('sup-ladder').hidden && document.querySelectorAll('#sup-ladder-cc .sup-rung').length >= 18"),
        (await t.ev("document.querySelectorAll('#sup-ladder-cc .sup-rung').length")) + ' countries; ' + await t.ev('location.hash'));
      check(`${width}: ...the most firms first`, (await t.ev("document.querySelector('#sup-ladder-cc .sup-rung-name').textContent")) === 'United States');
      await t.ev("(document.querySelector('#sup-ladder-cc .sup-name').click(), 1)"); await sleep(400);
      check(`${width}: ...a name opens its panel`, await t.ev("document.querySelector('#sup-ladder-cc .sup-panel[data-open=\"1\"] .sup-detail-h') !== null"));
      await t.ev("(document.querySelector('.sup-tabs a[data-tab=\"table\"]').click(), 1)"); await sleep(400);
      check(`${width}: Table shows every firm`, (await t.ev("document.querySelectorAll('#sup-table tbody tr').length")) === 226 && /Segment/.test(await t.ev("document.querySelector('#sup-table thead').textContent")) && /tab=table/.test(await t.ev('location.hash')));
      // the filters reach every tab
      await t.ev("(function(){var s=document.getElementById('sup-search');s.value='Gigaphoton';s.dispatchEvent(new Event('input'));return 1;})()"); await sleep(500);
      check(`${width}: a search narrows the table`, (await t.ev("document.querySelectorAll('#sup-table tbody tr').length")) === 1, await t.ev("document.getElementById('sup-count').textContent"));
      await t.ev("(document.querySelector('.sup-tabs a[data-tab=\"segment\"]').click(), 1)"); await sleep(400);
      check(`${width}: ...and the ladder`, (await t.ev("document.querySelectorAll('#sup-ladder .sup-rung[data-empty=\"0\"]').length")) === 1);
      await t.ev("(function(){var s=document.getElementById('sup-search');s.value='';s.dispatchEvent(new Event('input'));return 1;})()"); await sleep(500);
      // a segment on the ribbons filters the list to it
      await t.ev("(document.querySelector('.sup-hit[data-i=\"4\"]').dispatchEvent(new MouseEvent('click', { bubbles: true })), 1)"); await sleep(900);
      check(`${width}: a segment on the ribbons filters the list`, /Lithography/.test(await t.ev("document.getElementById('sup-count').textContent")) && !(await t.ev("document.getElementById('sup-allstages').hidden")),
        await t.ev("document.getElementById('sup-count').textContent"));
      check(`${width}: ...with All segments to clear it`, (await t.ev("document.getElementById('sup-allstages').textContent")) === 'All segments');
      await t.close();
    }
    // the addresses
    const a = await open(chrome, BASE + '/#/suppliers?tab=country', { width: 1440, wait: 2500 });
    check('#/suppliers?tab=country opens By country', await a.ev("!document.getElementById('sup-ladder-cc').hidden && document.querySelector('.sup-tabs a[aria-current]').getAttribute('data-tab') === 'country'"));
    await a.close();
    const b = await open(chrome, BASE + '/#/suppliers?tab=country&group=eu', { width: 1440, wait: 3000 });
    check("the Glossary's old EU-27 address still draws the EU as one", await b.ev("document.querySelectorAll('.sup-rib.c-EU').length > 0"));
    check('...and lands on the ribbons', Math.abs(await b.ev("Math.round(document.getElementById('sup-pipe').getBoundingClientRect().top)")) < 200, await b.ev("Math.round(document.getElementById('sup-pipe').getBoundingClientRect().top)"));
    await b.close();
    const c = await open(chrome, BASE + '/#/suppliers?country=JP', { width: 1440, wait: 3000 });
    check('#/suppliers?country=JP chooses Japan on the route', await c.ev("document.querySelector('.sa-role[data-cc=\"JP\"]').getAttribute('aria-pressed') === 'true' && !document.querySelector('.sa-panel[data-cc=\"JP\"]').hidden"));
    check('...with its role line in the panel', /Wafers, photoresist/.test(await c.ev("document.querySelector('.sa-panel[data-cc=\"JP\"] .sa-panel-role').textContent")));
    check('...its town names showing', (await c.ev("[...document.querySelectorAll('.sa-stop.is-on')].map(function(a){return getComputedStyle(a,'::after').content;}).join(' ')")).includes('Tokyo'));
    await c.close();
  } finally { await chrome.close(); }
  console.log(out.join('\n'));
  console.log(`\n${out.length} checks, ${bad} failed`);
  process.exit(bad ? 1 : 0);
})();
