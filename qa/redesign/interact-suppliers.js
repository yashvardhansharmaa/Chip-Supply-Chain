#!/usr/bin/env node
/* Suppliers in the redesign (stage 3), driven as a reader would: the route's stops, a country chosen on the route, the
   ribbons, the country buttons, the three tabs and their addresses, the filters, and a segment picked on the ribbons.
   29 Oct 2026 (the figures build): the ribbons are by share (build/modules/supplier-shares.js, src/modules/supshares.js), so
   the checks that tested the old count-based ribbons now test the new ones: gray at rest and the followed country in wine
   (Critical in wine and a followed country dark gray before), the share note (the note on counting firms by headquarters
   before), a segment's tip (it filtered the firm list before), and the EU-27 address, which filters the firm list to the
   members (it drew them as one ribbon column before; shares cannot be summed). On a phone the ribbons are one share strip
   per segment, so the phone's ribbon checks read the strips. qa/redesign/check-shares.js checks every printed share.
   23 Nov 2026: each firm's market position (Dominant, Major, Challenger, One of many, from the data's Critical, Important,
   Contested and Diversified): the top figure, the filter, the key, a segment's count and the table's cells, every word read
   from the app (Suppliers.POSITION) and every count from the data.
   usage: node qa/redesign/interact-suppliers.js [base] (default http://127.0.0.1:8766) */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = process.argv[2] || 'http://127.0.0.1:8766';
const WINE = 'rgb(122, 31, 43)', GRAY = 'rgb(210, 209, 204)', INK = 'rgb(23, 23, 22)';
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
      // the market positions (23 Nov 2026): every word and count from the app (Suppliers.POSITION, LEVELS) and the data, none typed here
      const POS = await t.ev(`(function(){var S=window.CP.Suppliers,D=window.CP.DATA||window.CP_DATA,n={};S.LEVELS.forEach(function(l){n[l]=0;});(D.suppliers||[]).forEach(function(r){n[r.chokepoint]=(n[r.chokepoint]||0)+1;});return {levels:S.LEVELS,word:S.POSITION,def:S.POSITION_DEF,n:n};})()`);
      const words = POS.levels.map((l) => POS.word[l]);
      const fig = await t.ev("[].map.call(document.querySelectorAll('.sup-facts-row div'),function(d){return [d.querySelector('dt').textContent,d.querySelector('dd').textContent];})");
      check(`${width}: the top figure counts the dominant firms from the data`, fig[3][0] === POS.word.Critical && +fig[3][1] === POS.n.Critical, JSON.stringify(fig[3]));
      const sel = await t.ev("[].map.call(document.querySelectorAll('#sup-chk option'),function(o){return [o.value,o.textContent];})");
      check(`${width}: the filter reads All market positions, then each position, filtering on the data's values`, JSON.stringify(sel) === JSON.stringify([['', 'All market positions']].concat(POS.levels.map((l) => [l, POS.word[l]]))) && (await t.ev("document.getElementById('sup-chk').getAttribute('aria-label')")) === 'Filter by market position', JSON.stringify(sel));
      check(`${width}: the key names the positions`, (await t.ev("document.getElementById('sup-key').textContent")) === POS.word.Critical + POS.word.Important + ' or ' + POS.word.Contested.toLowerCase() + POS.word.Diversified, await t.ev("document.getElementById('sup-key').textContent"));
      const rung = await t.ev("(function(){var r=document.querySelector('#sup-ladder .sup-rung'),cat=r.querySelector('.sup-rung-name').textContent,D=window.CP.DATA||window.CP_DATA;return {cat:cat,n:(D.suppliers||[]).filter(function(x){return x.category===cat&&x.chokepoint==='Critical';}).length,txt:(r.querySelector('.sup-crit-n')||{}).textContent||''};})()");
      check(`${width}: a segment counts its dominant firms`, rung.txt === (rung.n ? rung.n + ' ' + POS.word.Critical.toLowerCase() : ''), JSON.stringify(rung));
      const phone = width < 600, part = phone ? '.ss-sl' : '.sup-rib', paint = (sel) => phone ? `(function(){var e=document.querySelector(${JSON.stringify(sel)});return e?getComputedStyle(e).backgroundColor:'none';})()` : fill(sel);
      if (phone) check(`${width}: one share strip for each of the 17 segments with a split, under 20 names`, (await t.ev("document.querySelectorAll('#sup-pipe .ss-strip').length")) === 17 && (await t.ev("document.querySelectorAll('#sup-pipe .ss-row').length")) === 20);
      else check(`${width}: the ribbons are drawn open on the page, one for each of the 83 shares`, (await t.ev("document.querySelectorAll('#sup-pipe .sup-rib').length")) === 83, await t.ev("document.querySelectorAll('#sup-pipe .sup-rib').length"));
      check(`${width}: at rest every ribbon is gray`, (await t.ev(`[].every.call(document.querySelectorAll('#sup-pipe ${part}'),function(e){return getComputedStyle(e).${phone ? 'backgroundColor' : 'fill'}===${JSON.stringify(GRAY)};})`)), await t.ev(paint(part)));
      check(`${width}: the note on where a firm counts`, /Siemens EDA and Linde count under Germany/.test(await t.ev("document.querySelector('#sup-pipe .ss-side-note').textContent")));
      // a country button follows its ribbons
      await t.ev("(document.querySelector('.sup-chip[data-c=\"JP\"]').click(), 1)"); await sleep(400);
      check(`${width}: the pressed button fills black`, (await t.ev("getComputedStyle(document.querySelector('.sup-chip[data-c=\"JP\"]')).backgroundColor")) === INK && (await t.ev("document.querySelector('.sup-chip[data-c=\"JP\"]').getAttribute('aria-pressed')")) === 'true');
      check(`${width}: Japan's ribbons turn wine`, (await t.ev(paint(`${part}[data-c="JP"]`))) === WINE, await t.ev(paint(`${part}[data-c="JP"]`)));
      if (phone) check(`${width}: ...and the others stay gray`, (await t.ev(paint('.ss-sl[data-c="US"]'))) === GRAY);
      else {
        check(`${width}: ...the other countries' ribbons fade`, +(await t.ev("getComputedStyle(document.querySelector('.sup-rib[data-c=\"US\"]')).opacity")) < 0.5);
        check(`${width}: ...and Japan's share is printed at each of its segments`, (await t.ev("document.querySelectorAll('#sup-pipe .ss-endv text').length")) === (await t.ev("document.querySelectorAll('#sup-pipe .sup-rib[data-c=\"JP\"]').length")));
      }
      await t.ev("(document.querySelector('.sup-chip[data-c=\"JP\"]').click(), 1)"); await sleep(300);
      check(`${width}: pressed again, it lets go`, (await t.ev("document.getElementById('sup-pipe').getAttribute('data-lit')")) === '0');
      // the route's chosen country presses the same button
      await t.ev("(document.querySelector('.sa-role[data-cc=\"TW\"]').click(), 1)"); await sleep(400);
      check(`${width}: Taiwan on the route shows its panel`, await t.ev("!document.querySelector('.sa-panel[data-cc=\"TW\"]').hidden && document.querySelectorAll('.sa-stop.is-on').length === 2")); // Foundries and Fabs at Hsinchu, Advanced Packaging at Kaohsiung (3 until 23 Nov 2026, when Test and Assembly moved to Tokyo; 4 before the merge of 27 Oct 2026 took Tainan off the route)
      check(`${width}: ...and follows Taiwan's ribbons`, (await t.ev("(document.querySelector('.sup-chip[aria-pressed=\"true\"]')||{}).textContent")) === 'Taiwan');
      await t.ev("(document.querySelector('.sa-role[data-cc=\"TW\"]').click(), 1)"); await sleep(300);
      // no EU-27 switch: the ribbons by share would have to sum the members' shares
      check(`${width}: no EU-27 switch over the ribbons`, await t.ev("!document.getElementById('sup-group') && !document.querySelector('#sup-pipe .sup-gbtn')"));
      // the tabs
      check(`${width}: By segment opens first, twenty segments`, await t.ev("!document.getElementById('sup-ladder').hidden && document.getElementById('sup-ladder-cc').hidden && document.querySelectorAll('#sup-ladder .sup-rung').length === 20"));
      check(`${width}: the ladder's heading says segments`, (await t.ev("document.getElementById('sup-ladder-h').textContent")) === 'Segments from chip design to power'); // the ladder runs in chain order since 24b10b8 (owner, 25 Oct)
      await t.ev("(document.querySelector('.sup-tabs a[data-tab=\"country\"]').click(), 1)"); await sleep(400);
      check(`${width}: By country lists every country`, await t.ev("!document.getElementById('sup-ladder-cc').hidden && document.getElementById('sup-ladder').hidden && document.querySelectorAll('#sup-ladder-cc .sup-rung').length >= 18"),
        (await t.ev("document.querySelectorAll('#sup-ladder-cc .sup-rung').length")) + ' countries; ' + await t.ev('location.hash'));
      check(`${width}: ...the most firms first`, (await t.ev("document.querySelector('#sup-ladder-cc .sup-rung-name').textContent")) === 'United States');
      await t.ev("(document.querySelector('#sup-ladder-cc .sup-name').click(), 1)"); await sleep(400);
      check(`${width}: ...a name opens its panel`, await t.ev("document.querySelector('#sup-ladder-cc .sup-panel[data-open=\"1\"] .sup-detail-h') !== null"));
      await t.ev("(document.querySelector('.sup-tabs a[data-tab=\"table\"]').click(), 1)"); await sleep(400);
      check(`${width}: Table shows every firm`, (await t.ev("document.querySelectorAll('#sup-table tbody tr').length")) === 226 && /Segment/.test(await t.ev("document.querySelector('#sup-table thead').textContent")) && /tab=table/.test(await t.ev('location.hash')));
      check(`${width}: ...its column is Market position`, (await t.ev("[].map.call(document.querySelectorAll('#sup-table thead th'),function(h){return h.textContent;}).join('|')")).split('|').includes('Market position'));
      const cells = await t.ev("(function(){var c={};document.querySelectorAll('#sup-table tbody .chk').forEach(function(e){c[e.textContent]=(c[e.textContent]||0)+1;});return c;})()");
      check(`${width}: ...each cell shows its position, as many of each as the data holds`, POS.levels.every((l) => (cells[POS.word[l]] || 0) === POS.n[l]) && Object.keys(cells).every((k) => words.includes(k)), JSON.stringify(cells));
      check(`${width}: ...and a cell's title says what its position means`, (await t.ev("document.querySelector('#sup-table tbody .chk.Critical').getAttribute('title')")) === POS.def.Critical);
      await t.ev("(function(){var k=document.getElementById('sup-chk');k.value='Contested';k.dispatchEvent(new Event('change'));return 1;})()"); await sleep(400);
      check(`${width}: ...the filter leaves one position and the count line names it`, (await t.ev("document.querySelectorAll('#sup-table tbody tr').length")) === POS.n.Contested && (await t.ev("document.getElementById('sup-count').textContent")).endsWith(' · ' + POS.word.Contested), await t.ev("document.getElementById('sup-count').textContent"));
      await t.ev("(function(){var k=document.getElementById('sup-chk');k.value='';k.dispatchEvent(new Event('change'));return 1;})()"); await sleep(300);
      // the filters reach every tab
      await t.ev("(function(){var s=document.getElementById('sup-search');s.value='Gigaphoton';s.dispatchEvent(new Event('input'));return 1;})()"); await sleep(500);
      check(`${width}: a search narrows the table`, (await t.ev("document.querySelectorAll('#sup-table tbody tr').length")) === 1, await t.ev("document.getElementById('sup-count').textContent"));
      await t.ev("(document.querySelector('.sup-tabs a[data-tab=\"segment\"]').click(), 1)"); await sleep(400);
      check(`${width}: ...and the ladder`, (await t.ev("document.querySelectorAll('#sup-ladder .sup-rung[data-empty=\"0\"]').length")) === 1);
      await t.ev("(function(){var s=document.getElementById('sup-search');s.value='';s.dispatchEvent(new Event('input'));return 1;})()"); await sleep(500);
      // a segment on the ribbons opens its tip (wide), or names its firms under its strip (phone)
      if (phone) check(`${width}: EUV lithography's row names it and its firm`, /EUV lithography tools/.test(await t.ev("document.querySelectorAll('#sup-pipe .ss-row')[5].textContent")) && /ASML/.test(await t.ev("document.querySelectorAll('#sup-pipe .ss-row')[5].textContent")));
      else {
        await t.ev("(document.querySelector('.ss-hit[data-i=\"5\"]').dispatchEvent(new MouseEvent('click', { bubbles: true })), 1)"); await sleep(500);
        check(`${width}: a segment on the ribbons opens its tip, with its year and source`, await t.ev("!document.getElementById('sup-tip').hidden && /EUV lithography tools/.test(document.getElementById('sup-tip').textContent) && /Source:/.test(document.getElementById('sup-tip').textContent)"), await t.ev("document.getElementById('sup-tip').textContent"));
        // the firms are in the tip, not beside the segment (owner, 29 Oct 2026)
        check(`${width}: ...naming its firms, which are not drawn beside the segments`, await t.ev("/Firms on the list/.test(document.getElementById('sup-tip').textContent) && /ASML/.test(document.getElementById('sup-tip').textContent) && !document.querySelector('#sup-pipe .ss-names, #sup-pipe .ss-fn')"));
        await t.ev("(document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })), 1)"); await sleep(200);
        check(`${width}: ...and Escape closes it`, await t.ev("document.getElementById('sup-tip').hidden"));
      }
      await t.close();
    }
    // the addresses
    const a = await open(chrome, BASE + '/#/suppliers?tab=country', { width: 1440, wait: 2500 });
    check('#/suppliers?tab=country opens By country', await a.ev("!document.getElementById('sup-ladder-cc').hidden && document.querySelector('.sup-tabs a[aria-current]').getAttribute('data-tab') === 'country'"));
    await a.close();
    const b = await open(chrome, BASE + '/#/suppliers?tab=country&group=eu', { width: 1440, wait: 3000 });
    check("the Glossary's EU-27 address lists the EU-27 members' firms", /EU-27 members/.test(await b.ev("document.getElementById('sup-count').textContent")), await b.ev("document.getElementById('sup-count').textContent"));
    check('...and lands on them', Math.abs(await b.ev("Math.round(document.getElementById('sup-reg').getBoundingClientRect().top)")) < 200, await b.ev("Math.round(document.getElementById('sup-reg').getBoundingClientRect().top)"));
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
