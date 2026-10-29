#!/usr/bin/env node
/* The Glossary as an index and one entry (Index and entry, chosen 29 Oct 2026), driven as a reader would: the index (every
   row in the page, the letter heads and the column of letters, the kinds), the opening entry, search (names first, then
   text, the first match shown as you type, Did you mean, no entry and its passages), the keys (the arrows from the search
   and the list, Home, End, Page Down, Enter, "/", Escape), an entry's parts (kind line, other names, definition, reason,
   Read it in and Also in with "and N more", Where it appears with six then Show all, the links between entries, previous and
   next), the addresses of an entry (#gl-euv, #lk-term-, #lk-firm-, #lk-chip-, #lk-country-), a firm's revenue and China
   chart, a country's shares, a passage out to its chapter's page and Back, the pop-ups' Look it up from a chapter's page,
   the masthead search's term result, the phone (the list is the page, 44 px rows, the sticky search, the letter strip a
   finger runs down, the entry as a dialog with "‹ Glossary", previous and next, Back and Escape to the same row), 320 px,
   dark mode, and the static page /glossary/.
   usage: node qa/redesign/interact-glossary.js [base] (default http://127.0.0.1:8769) */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = process.argv[2] || 'http://127.0.0.1:8769';
(async () => {
  const chrome = launch(); const out = []; let bad = 0;
  const check = (name, ok, detail) => { out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail !== undefined && detail !== '' ? ': ' + detail : ''}`); if (!ok) bad++; };
  const key = async (t, k, code, vk, text) => { await t.s('Input.dispatchKeyEvent', { type: text ? 'keyDown' : 'rawKeyDown', key: k, code, windowsVirtualKeyCode: vk, text }); await t.s('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk }); };
  const typeIn = async (t, text) => { await t.ev("(function(){var i=document.getElementById('gl-search');i.focus();i.value='';i.dispatchEvent(new Event('input'));return 1;})()"); if (text) await t.s('Input.insertText', { text }); await sleep(450); };
  const until = async (t, expr, ms) => { for (let i = 0; i < (ms || 6000) / 150; i++) { try { if (await t.ev(expr)) return true; } catch (e) { } await sleep(150); } return false; };
  const ready = (t) => until(t, "document.querySelector('.view[data-view=\"glossary\"]').getAttribute('data-gl')==='ready'");
  const hw = "(document.getElementById('gl-hw')||{}).textContent";
  const cur = "(document.querySelector('#gl-list .gl-r a[aria-current=\"true\"]')||{}).textContent";
  const act = "(function(){var a=document.activeElement;return a?(a.getAttribute('data-id')||a.id||a.tagName):'';})()"; // a row's link names its entry (data-id)
  const isOpen = "document.documentElement.classList.contains('gl-open')";
  const tap = async (t, sel) => { const p = await t.ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});if(!e)return null;e.scrollIntoView({block:'center'});var r=e.getBoundingClientRect();return {x:r.left+Math.min(20,r.width/2),y:r.top+r.height/2};})()`); if (!p) return false; await sleep(150); await t.s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y }] }); await t.s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(500); return true; };
  // the smallest type shown: every element with its own text, in the Glossary or (open) its entry
  const smallest = "(function(){var m=99,w='';document.querySelectorAll('.view[data-view=\"glossary\"] *').forEach(function(e){if(!e.getClientRects().length)return;var own=[].some.call(e.childNodes,function(n){return n.nodeType===3&&n.nodeValue.trim();});if(!own)return;if(e.closest('.sr-only,svg,[hidden]'))return;var cs=getComputedStyle(e);if(cs.visibility==='hidden')return;var f=parseFloat(cs.fontSize);if(f<m){m=f;w=e.className||e.tagName;}});return m+' ('+w+')';})()";
  try {
    /* ---------- 1440: the index and the opening entry ---------- */
    let t = await open(chrome, BASE + '/#/glossary', { width: 1440, wait: 1500 });
    check('1440: the list is in', await ready(t));
    check('1440: every entry has its row in the page', (await t.ev("document.querySelectorAll('#lk-items .gl-r').length")) === 487, await t.ev("document.querySelectorAll('#lk-items .gl-r').length"));
    check('1440: every row keeps its lk- id, and each term its gl- id', (await t.ev("document.querySelectorAll('#lk-items li[id^=\"lk-\"]').length")) === 487 && (await t.ev("document.querySelectorAll('#lk-items li[id^=\"lk-term-\"] > a[id^=\"gl-\"]').length")) === 208);
    check('1440: the title and the count', (await t.ev("document.querySelector('.gl-title').textContent")) === 'Glossary' && (await t.ev("document.getElementById('gl-count').textContent")) === '487 entries');
    check('1440: the search is labeled', (await t.ev("document.getElementById('gl-search').closest('label').querySelector('.sr-only').textContent")).length > 10 && (await t.ev("document.getElementById('gl-search').placeholder")) === 'Search 487 entries');
    check('1440: the kinds', (await t.ev("[...document.querySelectorAll('#gl-kinds button')].map(function(b){return b.textContent;}).join(' · ')")) === 'All · Terms · Firms · AI chips · Countries');
    check('1440: it opens on chip', (await t.ev(hw)) === 'chip' && (await t.ev(cur)) === 'chip' && (await t.ev('location.hash')) === '#/glossary');
    check('1440: the index stays under the masthead', (await t.ev("getComputedStyle(document.getElementById('gl-index')).position")) === 'sticky' && (await t.ev("Math.round(document.getElementById('gl-index').getBoundingClientRect().bottom)")) === 900);
    check('1440: chip reads it in its chapters, four named and the rest behind a button', /^Read it in/.test(await t.ev("document.querySelector('.gl-reads').innerText")) && /^and \d+ more$/.test(await t.ev("document.querySelector('.gl-reads [data-rest]').textContent")) && (await t.ev("document.querySelectorAll('.gl-also > a').length")) === 4);
    await t.ev("(document.querySelector('.gl-reads [data-rest]').click(),1)"); await sleep(200);
    check('1440: "and N more" shows the rest and moves focus to them', (await t.ev("!document.querySelector('.gl-rest').hidden && document.activeElement.closest('.gl-rest') !== null")));
    const n0 = await t.ev("parseInt(document.querySelector('#gl-wh .gl-n').textContent)");
    check('1440: six places, then Show all', (await t.ev("document.querySelectorAll('.gl-men li').length")) === 6 && (await t.ev("document.querySelector('.gl-more button').textContent")) === 'Show all ' + n0, n0 + ' places');
    await t.ev("(document.querySelector('.gl-more button').click(),1)"); await sleep(300);
    check('1440: Show all shows every place', (await t.ev("document.querySelectorAll('.gl-men li').length")) === n0);
    check('1440: the page is short at rest', (await t.ev('document.documentElement.scrollHeight')) < 60000);
    check('1440: no sideways scroll', await t.ev('document.documentElement.scrollWidth <= innerWidth'));
    check('1440: nothing under 11.5 px', parseFloat(await t.ev(smallest)) >= 11.5, await t.ev(smallest));
    // the column of letters
    check('1440: the letters, X off as the data has it', (await t.ev("[...document.querySelectorAll('#gl-jump span')].map(function(s){return s.textContent;}).join(',')")) === 'X', await t.ev("[...document.querySelectorAll('#gl-jump span')].map(function(s){return s.textContent;}).join(',')"));
    await t.ev("(document.querySelector('#gl-jump [data-l=\"M\"]').click(),1)"); await sleep(400);
    check('1440: a letter brings its head to the top of the index', Math.abs(await t.ev("document.getElementById('gl-lh-M').getBoundingClientRect().top - document.getElementById('gl-list').getBoundingClientRect().top")) < 4 && (await t.ev("(document.querySelector('#gl-jump [aria-current=\"true\"]')||{}).textContent")) === 'M');
    check('1440: the letter heads stick', (await t.ev("getComputedStyle(document.getElementById('gl-lh-M')).position")) === 'sticky');
    // a row
    await t.ev("(document.querySelector('#lk-firm-asml > a').click(),1)"); await sleep(400);
    check('1440: a row opens its entry and the address names it', (await t.ev(hw)) === 'ASML' && (await t.ev('location.hash')) === '#lk-firm-asml' && (await t.ev(cur)) === 'ASML');
    check("1440: a firm keeps its facts, its revenue's filing link and its China chart", /Chokepoint level/.test(await t.ev("document.querySelector('.gl-facts').innerText")) && !!(await t.ev("document.querySelector('.gl-facts a.rev-filed')")) && !!(await t.ev("document.querySelector('.gl-facts .sup-ex-mini svg')")));
    check('1440: the links between entries keep the words and stop at three a paragraph', (await t.ev("[...document.querySelectorAll('.gl-e p')].every(function(p){return p.querySelectorAll('a.gl-x').length<=3;})")) && (await t.ev("document.querySelectorAll('.gl-def a.gl-x').length")) >= 1);
    check('1440: each entry is linked once', await t.ev("(function(){var s={},ok=true;document.querySelectorAll('.gl-e a.gl-x').forEach(function(a){var k=a.getAttribute('data-id');if(s[k])ok=false;s[k]=1;});return ok;})()"));
    await t.ev("(document.querySelector('.gl-def a.gl-x').click(),1)"); await sleep(400);
    check('1440: a link between entries opens the other entry', (await t.ev(hw)) !== 'ASML' && /^#(gl-|lk-)/.test(await t.ev('location.hash')), await t.ev(hw));
    await t.ev('(history.back(),1)'); await sleep(800);
    check('1440: Back returns to the entry before', (await t.ev(hw)) === 'ASML' && (await t.ev('location.hash')) === '#lk-firm-asml');
    await t.ev("(document.querySelector('.gl-pn .gl-next').click(),1)"); await sleep(400);
    check('1440: Next opens the entry after it in the list', /^ASMPT/.test(await t.ev(hw)), await t.ev(hw)); // with its native name beside it
    // the kinds
    await t.ev("(document.querySelector('#gl-kinds [data-k=\"firm\"]').click(),1)"); await sleep(300);
    check('Firms: the firms only, and the count says so', (await t.ev("document.getElementById('gl-count').textContent")) === '226 firms' && (await t.ev("[...document.querySelectorAll('#lk-items .gl-r')].filter(function(r){return !r.hidden;}).every(function(r){return r.getAttribute('data-kind')==='firm';})")) && (await t.ev("document.querySelectorAll('#lk-items li[id^=\"lk-\"]').length")) === 487);
    check('Firms: the pressed kind is marked', (await t.ev("document.querySelector('#gl-kinds [data-k=\"firm\"]').getAttribute('aria-pressed')")) === 'true');
    await t.ev("(document.querySelector('#gl-kinds [data-k=\"country\"]').click(),1)"); await sleep(300);
    check('Countries: a letter with no country is off', (await t.ev("document.getElementById('gl-count').textContent")) === '15 countries' && (await t.ev("document.querySelectorAll('#gl-jump span').length")) > 5);
    await t.ev("(document.querySelector('#gl-kinds [data-k=\"all\"]').click(),1)"); await sleep(300);
    // search
    await typeIn(t, 'hbm');
    check('search: the names that match stand first, then the text matches', (await t.ev("[...document.querySelectorAll('#gl-res .gl-lh')].map(function(h){return h.textContent;}).join(',')")) === 'Name matches,Text matches' && (await t.ev("document.querySelector('#gl-res .gl-r a').textContent")) === 'HBM');
    check('search: the first match shows as you type', (await t.ev(hw)) === 'HBM' && (await t.ev('location.hash')) === '#gl-hbm');
    check('search: the count says how many', /^\d+ matches$/.test(await t.ev("document.getElementById('gl-count').textContent")), await t.ev("document.getElementById('gl-count').textContent"));
    check('search: the rows and their ids stay in the page', (await t.ev("document.querySelectorAll('#lk-items li[id^=\"lk-\"]').length")) === 487 && !!(await t.ev("document.getElementById('gl-euv')")));
    await key(t, 'ArrowDown', 'ArrowDown', 40); await sleep(250);
    check('the arrows in the search move to the next match, focus stays in the field', (await t.ev(hw)) !== 'HBM' && (await t.ev(act)) === 'gl-search', await t.ev(hw));
    await key(t, 'ArrowUp', 'ArrowUp', 38); await sleep(250);
    check('and back', (await t.ev(hw)) === 'HBM');
    await key(t, 'Enter', 'Enter', 13, '\r'); await sleep(300);
    check('Enter moves focus into the entry', (await t.ev(act)) === 'gl-hw');
    await typeIn(t, 'tsmc');
    check('an exact name tops the name matches', (await t.ev("document.querySelector('#gl-res .gl-r a').textContent")) === 'TSMC', await t.ev("document.querySelector('#gl-res .gl-r a').textContent"));
    await typeIn(t, 'foxconn');
    check('another name finds its entry first', (await t.ev("document.querySelector('#gl-res .gl-r a').textContent")) === 'Hon Hai Precision', await t.ev("document.querySelector('#gl-res .gl-r a').textContent"));
    await key(t, 'Escape', 'Escape', 27); await sleep(300);
    check('Escape in the field clears the search', (await t.ev("document.getElementById('gl-search').value")) === '' && (await t.ev("document.getElementById('gl-count').textContent")) === '487 entries' && !(await t.ev("document.getElementById('lk-items').hidden")));
    await typeIn(t, 'nvidai');
    check('no entry: the list says so and offers Did you mean', /No entry matches/.test(await t.ev("document.getElementById('gl-res').innerText")) && (await t.ev("[...document.querySelectorAll('#gl-res .gl-near a')].map(function(a){return a.textContent;}).join(',')")).includes('Nvidia'));
    check('no entry: the entry pane lists the places the words appear', /No entry/i.test(await t.ev("document.querySelector('#gl-pane .gl-kind').textContent")) && (await t.ev(hw)) === 'nvidai');
    await t.ev("(([...document.querySelectorAll('#gl-res .gl-near a')].filter(function(a){return a.textContent==='Nvidia';})[0]).click(),1)"); await sleep(400);
    check('Did you mean opens the entry and clears the search', (await t.ev(hw)) === 'Nvidia' && (await t.ev("document.getElementById('gl-search').value")) === '');
    await typeIn(t, 'Veldhoven');
    check('a word with no entry of its own still finds its entries', (await t.ev("document.querySelectorAll('#gl-res .gl-r').length")) > 0);
    await typeIn(t, '');
    // the keys in the list
    await t.ev("(document.querySelector('#lk-term-euv > a').focus(),1)");
    await key(t, 'ArrowDown', 'ArrowDown', 40); await sleep(250);
    check('the arrows in the list open the next entry and move focus with it', (await t.ev(act)) === (await t.ev("document.querySelector('#lk-term-euv').nextElementSibling.id")) && (await t.ev(hw)) === (await t.ev("document.querySelector('#lk-term-euv').nextElementSibling.textContent")));
    await key(t, 'End', 'End', 35); await sleep(250);
    check('End goes to the last entry', (await t.ev(act)) === (await t.ev("[...document.querySelectorAll('#lk-items .gl-r')].pop().id")));
    await key(t, 'Home', 'Home', 36); await sleep(250);
    check('Home goes to the first entry', (await t.ev(act)) === (await t.ev("document.querySelector('#lk-items .gl-r').id")));
    await key(t, 'PageDown', 'PageDown', 34); await sleep(250);
    check('Page Down goes ten on', (await t.ev(act)) === (await t.ev("document.querySelectorAll('#lk-items .gl-r')[10].id")));
    await key(t, 'Enter', 'Enter', 13, '\r'); await sleep(300);
    check('Enter on a row moves focus into its entry', (await t.ev(act)) === 'gl-hw' && (await t.ev(hw)) === (await t.ev("document.querySelectorAll('#lk-items .gl-r')[10].textContent")));
    await t.ev('(document.activeElement.blur(),1)');
    await key(t, '/', 'Slash', 191, '/'); await sleep(250);
    check('"/" goes to the Glossary search, not the site search', (await t.ev(act)) === 'gl-search' && !(await t.ev("(function(){var b=document.getElementById('cp-search');return !!b&&!b.hidden;})()")));
    check('1440: no script errors', !t.errors.length, t.errors.join(' | '));
    await t.close();

    /* ---------- the addresses of an entry ---------- */
    t = await open(chrome, BASE + '/#gl-euv', { width: 1440, wait: 1500 }); await ready(t); await sleep(800);
    check('#gl-euv opens EUV at the top, its row in view', (await t.ev(hw)) === 'EUV' && (await t.ev('scrollY')) === 0 && (await t.ev("(function(){var r=document.getElementById('gl-euv').getBoundingClientRect(),l=document.getElementById('gl-list').getBoundingClientRect();return r.top>=l.top&&r.bottom<=l.bottom;})()")));
    check('the term reads it in Lithography, and also elsewhere', /Read it in\s*Lithography/.test(await t.ev("document.querySelector('.gl-reads').innerText")) && /Also in/.test(await t.ev("document.querySelector('.gl-reads').innerText")));
    check('the term has its other names, definition and reason', (await t.ev("!!document.querySelector('.gl-names') && !!document.querySelector('.gl-def') && !!document.querySelector('.gl-p')")));
    // a passage out to its chapter's page, and Back
    await t.ev("(document.querySelector('.gl-men a[data-para]').click(),1)");
    let flashed = 0; for (let k = 0; k < 24 && !flashed; k++) { await sleep(250); try { flashed = await t.ev("document.querySelectorAll('.lk-flash').length"); } catch (e) { } }
    check("a passage opens its chapter's page and flashes there", /^\/[a-z-]+\/$/.test(await t.ev('location.pathname')) && flashed === 1, await t.ev('location.pathname'));
    await t.ev('(history.back(),1)'); await sleep(2500);
    check('Back returns to the entry', (await t.ev("document.documentElement.getAttribute('data-view')")) === 'glossary' && (await t.ev(hw)) === 'EUV', await t.ev('location.hash'));
    await t.close();
    t = await open(chrome, BASE + '/#lk-term-euv', { width: 1440, wait: 1500 }); await ready(t); await sleep(300);
    check('#lk-term-euv opens EUV too', (await t.ev(hw)) === 'EUV');
    await t.close();
    t = await open(chrome, BASE + '/#lk-country-nl', { width: 1440, wait: 1500 }); await ready(t); await sleep(300);
    check('#lk-country-nl opens the Netherlands with its shares', (await t.ev(hw)) === 'Netherlands' && /Share of each segment/.test(await t.ev("document.getElementById('gl-pane').innerText")));
    check('the shares follow the chart rule: the largest wine, the rest the tint', (await t.ev("getComputedStyle(document.querySelector('.gl-share.is-top .gl-share-bar')).backgroundImage")).includes('rgb(122, 31, 43)') && (await t.ev("getComputedStyle(document.querySelector('.gl-share:not(.is-top) .gl-share-bar')).backgroundImage")).includes('rgb(210, 209, 204)'));
    check('the EU-27 line and its link', /Across the EU-27/.test(await t.ev("document.getElementById('gl-pane').innerText")) && !!(await t.ev("document.querySelector('#gl-pane a[href=\"#/suppliers?group=eu\"]')")));
    await t.ev("(document.querySelector('.gl-cat-f a[data-id]').click(),1)"); await sleep(400);
    check("a Critical firm's name opens its entry", /^#lk-firm-/.test(await t.ev('location.hash')) && !!(await t.ev("document.querySelector('.gl-facts')")), await t.ev(hw));
    await t.close();
    t = await open(chrome, BASE + '/#lk-chip-nvidia-b200', { width: 1440, wait: 1500 }); await ready(t); await sleep(300);
    check('#lk-chip- opens the chip with its facts', (await t.ev(hw)) === 'Nvidia B200' && /Dense TFLOPS/i.test(await t.ev("document.getElementById('gl-pane').innerText")));
    await t.ev("(document.querySelector('#gl-pane a[data-chip]').click(),1)"); await sleep(900);
    check('On AI Chips opens the chip there', (await t.ev('location.hash')) === '#/landscape?pick=nvidia-b200' && (await t.ev("(document.querySelector('#aic-card h2')||{}).textContent")) === 'B200');
    await t.ev('(history.back(),1)'); await sleep(1200);
    check('Back to the Glossary returns to the chip', (await t.ev(hw)) === 'Nvidia B200');
    check('no script errors on the addresses', !t.errors.length, t.errors.join(' | '));
    await t.close();

    /* ---------- the ways in: a chapter's pop-up, and the site search ---------- */
    t = await open(chrome, BASE + '/lithography/', { width: 1440, wait: 2000 });
    const term = await t.ev("(function(){var b=[...document.querySelectorAll('#lithography .prose .gl-term')].filter(function(x){return !x.dataset.note;})[0];b.scrollIntoView({block:'center'});b.focus();return b.getAttribute('data-term');})()"); await sleep(500);
    check('a pop-up opens over the chapter text with the same definition', (await t.ev("!document.getElementById('gl-tip').hidden")) && (await t.ev("document.getElementById('gl-tip').querySelector('p').textContent")) === (await t.ev(`(window.CP_TERMS.defs[${JSON.stringify(term)}] || [])[1]`)), term);
    const look = await t.ev("document.querySelector('#gl-tip a').getAttribute('href')");
    await t.ev("(document.querySelector('#gl-tip a').click(),1)"); await sleep(2500); await ready(t);
    check("Look it up opens the entry in the home page's Glossary", look.indexOf('../#gl-') === 0 && (await t.ev("document.documentElement.getAttribute('data-view')")) === 'glossary' && (await t.ev("location.pathname + location.hash")) === look.slice(2) && (await t.ev("(document.querySelector('#gl-list .gl-r a[aria-current]')||{}).getAttribute && document.querySelector('#gl-list .gl-r a[aria-current]').closest('li').id")) === 'lk-term-' + look.slice(7), look + ' -> ' + (await t.ev(hw)));
    check("after a move from another page the entry's name takes focus", (await t.ev(act)) === 'gl-hw');
    // the masthead search
    await t.ev("(document.querySelector('.search-btn').click(),1)"); await sleep(300); await t.s('Input.insertText', { text: 'photoresist' }); await sleep(900);
    const res = await t.ev("(function(){var a=[...document.querySelectorAll('.cp-search-results a')].filter(function(a){return /^#gl-/.test(a.getAttribute('href'));})[0];return a?a.getAttribute('href'):null;})()");
    await t.ev(`(document.querySelector('.cp-search-results a[href="${res}"]').click(),1)`); await sleep(900);
    check("the site search's term result opens its entry", !!res && (await t.ev('location.hash')) === res && (await t.ev("document.getElementById('gl-hw').textContent.toLowerCase()")) === (await t.ev(`document.getElementById(${JSON.stringify(res.slice(1))}).textContent.toLowerCase()`)), res);
    check('no script errors from the chapter to the Glossary', !t.errors.length, t.errors.join(' | '));
    await t.close();
    // from a data page: a term's pop-up on the Export Controls board (its state labels name TPP and the Entity List; the label is
    // shown for the test, since the board shows it only in some layouts)
    t = await open(chrome, BASE + '/#/controls', { width: 1440, wait: 2000 });
    const ctl = await t.ev("(function(){var b=document.querySelector('.view[data-view=\"controls\"] .gl-term');if(!b)return null;var l=b.closest('.cf-lab');if(l)l.style.display='inline';b.scrollIntoView({block:'center'});b.click();return b.getAttribute('data-term');})()"); await sleep(500);
    if (ctl) {
      await t.ev("(document.querySelector('#gl-tip a').click(),1)"); await sleep(1500); await ready(t);
      check('Export Controls: a pop-up\'s Look it up opens the entry', (await t.ev("document.documentElement.getAttribute('data-view')")) === 'glossary' && /^#gl-/.test(await t.ev('location.hash')) && (await t.ev(hw)) !== 'chip', ctl + ' -> ' + (await t.ev(hw)));
    } else check('Export Controls: a pop-up to try', false, 'no term on the page');
    await t.close();

    /* ---------- 390: the phone ---------- */
    t = await open(chrome, BASE + '/#/glossary', { width: 390, wait: 1500 }); await ready(t);
    check('390: the list is the page, no entry open', !(await t.ev(isOpen)) && (await t.ev("getComputedStyle(document.getElementById('gl-pane')).display")) === 'none');
    check('390: rows are 44 px tall at least', (await t.ev("Math.round(document.querySelector('#lk-term-euv > a').getBoundingClientRect().height)")) >= 44, await t.ev("document.querySelector('#lk-term-euv > a').getBoundingClientRect().height"));
    check('390: no sideways scroll', await t.ev('document.documentElement.scrollWidth <= innerWidth'));
    check('390: nothing under 11.5 px', parseFloat(await t.ev(smallest)) >= 11.5, await t.ev(smallest));
    await t.scrollTo(3000);
    check('390: the search bar sticks under the masthead', Math.abs(await t.ev("document.getElementById('gl-bar').getBoundingClientRect().top - document.querySelector('.masthead').getBoundingClientRect().bottom")) <= 1);
    // a finger runs down the letters
    const strip = await t.ev("(function(){var a=document.querySelector('#gl-jump [data-l=\"C\"]').getBoundingClientRect(),b=document.querySelector('#gl-jump [data-l=\"P\"]').getBoundingClientRect();return {x:a.left+a.width/2,y1:a.top+a.height/2,y2:b.top+b.height/2};})()");
    await t.s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: strip.x, y: strip.y1 }] }); await sleep(120);
    for (let k = 1; k <= 6; k++) { await t.s('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: strip.x, y: strip.y1 + (strip.y2 - strip.y1) * k / 6 }] }); await sleep(60); }
    await t.s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(400);
    check('390: a finger run down the letters lands on the last one', Math.abs(await t.ev("document.getElementById('gl-lh-P').getBoundingClientRect().top - document.getElementById('gl-bar').getBoundingClientRect().bottom")) < 4, await t.ev("Math.round(document.getElementById('gl-lh-P').getBoundingClientRect().top - document.getElementById('gl-bar').getBoundingClientRect().bottom)"));
    await tap(t, '#lk-term-euv > a');
    check('390: a tap opens the entry over the list, as a dialog', (await t.ev(isOpen)) && (await t.ev("document.getElementById('gl-pane').getAttribute('role')")) === 'dialog' && (await t.ev("document.getElementById('gl-pane').getAttribute('aria-modal')")) === 'true' && (await t.ev(hw)) === 'EUV');
    check('390: the entry takes the whole screen', await t.ev("(function(){var r=document.getElementById('gl-pane').getBoundingClientRect();return r.top===0&&Math.round(r.width)===innerWidth&&Math.round(r.bottom)===innerHeight;})()"));
    check('390: the page under it is inert, and its name has focus', (await t.ev("document.querySelector('.masthead').inert && document.getElementById('gl-index').inert")) && (await t.ev(act)) === 'gl-hw');
    check('390: the address names the entry', (await t.ev('location.hash')) === '#gl-euv');
    check('390: no sideways scroll in the entry', await t.ev("document.getElementById('gl-pane').scrollWidth <= innerWidth"));
    check('390: nothing under 11.5 px in the entry', parseFloat(await t.ev(smallest)) >= 11.5, await t.ev(smallest));
    await t.ev("(document.querySelector('#gl-pane [data-step=\"1\"]').click(),1)"); await sleep(300);
    const next = await t.ev(hw);
    check('390: next steps to the entry after it', next === (await t.ev("document.querySelector('#lk-term-euv').nextElementSibling.textContent")), next);
    await t.ev("(document.querySelector('#gl-pane [data-step=\"-1\"]').click(),1)"); await sleep(300);
    check('390: previous steps back', (await t.ev(hw)) === 'EUV');
    await t.ev("(document.querySelector('#gl-pane [data-back]').click(),1)"); await sleep(700);
    check('390: ‹ Glossary returns to the same row', !(await t.ev(isOpen)) && (await t.ev(act)) === 'lk-term-euv' && !(await t.ev("document.querySelector('.masthead').inert")) && (await t.ev('location.hash')) === '#/glossary');
    check('390: the row is in view', await t.ev("(function(){var r=document.getElementById('gl-euv').getBoundingClientRect();return r.top>document.getElementById('gl-bar').getBoundingClientRect().bottom-2&&r.bottom<innerHeight;})()"));
    await tap(t, '#lk-firm-asml > a');
    await t.ev('(history.back(),1)'); await sleep(900);
    check('390: Back returns to the same row', !(await t.ev(isOpen)) && (await t.ev(act)) === 'lk-firm-asml' && (await t.ev('location.hash')) === '#/glossary');
    await tap(t, '#lk-firm-asml > a');
    await key(t, 'Escape', 'Escape', 27); await sleep(900);
    check('390: Escape returns to the same row', !(await t.ev(isOpen)) && (await t.ev(act)) === 'lk-firm-asml');
    // search on the phone
    await typeIn(t, 'tsmc');
    check('390: a search lists the matches, the names first, and opens nothing', (await t.ev("document.querySelector('#gl-res .gl-r a').textContent")) === 'TSMC' && !(await t.ev(isOpen)));
    await tap(t, '#gl-res .gl-r a');
    check('390: a match opens as a dialog too', (await t.ev(isOpen)) && /^TSMC/.test(await t.ev(hw)), await t.ev(hw)); // with its native name beside it
    await t.ev("(document.querySelector('#gl-pane .gl-men a[data-para]').click(),1)"); await sleep(1800);
    check('390: a passage link leaves no page inert', (await t.ev("document.documentElement.getAttribute('data-view')")) === 'stack' && !(await t.ev("document.querySelector('.masthead').inert")));
    check('390: no script errors', !t.errors.length, t.errors.join(' | '));
    await t.close();
    t = await open(chrome, BASE + '/lithography/', { width: 390, wait: 2000 });
    await t.ev("(function(){var b=[...document.querySelectorAll('#lithography .prose .gl-term')].filter(function(x){return !x.dataset.note;})[0];b.scrollIntoView({block:'center'});b.click();return 1;})()"); await sleep(600);
    check('390: a tap opens the pop-up as a sheet over the text', await t.ev("!document.getElementById('gl-tip').hidden && document.getElementById('gl-tip').classList.contains('is-sheet')"));
    await t.ev("(document.querySelector('#gl-tip a').click(),1)"); await sleep(2500); await ready(t); await sleep(300);
    check('390: Look it up opens the entry as a dialog', (await t.ev("document.documentElement.getAttribute('data-view')")) === 'glossary' && (await t.ev(isOpen)) && /^#gl-/.test(await t.ev('location.hash')));
    await t.ev("(document.querySelector('#gl-pane [data-back]').click(),1)"); await sleep(700);
    check('390: ‹ Glossary from a link in lands on the list at its row', !(await t.ev(isOpen)) && (await t.ev('location.hash')) === '#/glossary' && /^lk-term-/.test(await t.ev(act)));
    await t.close();
    t = await open(chrome, BASE + '/#lk-country-us', { width: 320, wait: 1500 }); await ready(t); await sleep(300);
    check('320: the entry fits, nothing sideways', (await t.ev(isOpen)) && (await t.ev("document.getElementById('gl-pane').scrollWidth <= innerWidth")) && (await t.ev('document.documentElement.scrollWidth <= innerWidth')));
    check('320: nothing under 11.5 px', parseFloat(await t.ev(smallest)) >= 11.5, await t.ev(smallest));
    await t.ev("(document.querySelector('#gl-pane [data-back]').click(),1)"); await sleep(600);
    check('320: the list fits', await t.ev('document.documentElement.scrollWidth <= innerWidth'));
    await t.close();

    /* ---------- dark ---------- */
    t = await open(chrome, BASE + '/#gl-euv', { width: 1440, theme: 'dark', wait: 1500 }); await ready(t);
    check('dark: the ground, the index and the entry turn dark', (await t.ev("getComputedStyle(document.body).backgroundColor")) === 'rgb(18, 18, 17)' && (await t.ev("getComputedStyle(document.querySelector('.gl-lh')).backgroundColor")) === 'rgb(18, 18, 17)' && (await t.ev("getComputedStyle(document.getElementById('gl-hw')).color")) !== 'rgb(23, 23, 22)');
    check('dark: the open row keeps its wine mark', (await t.ev("getComputedStyle(document.querySelector('#gl-list .gl-r a[aria-current]')).boxShadow")).includes('217, 138, 149'));
    await t.close();

    /* ---------- the static page ---------- */
    t = await open(chrome, BASE + '/glossary/', { width: 1440, wait: 1200 });
    check('/glossary/: every term in the columns', (await t.ev("document.querySelectorAll('.gl-dict .gl-de').length")) === 208);
    check("/glossary/: the dek, read from the Glossary view's own", (await t.ev("(document.querySelector('.ch-lede')||{}).textContent||''")).indexOf('Every term, firm, chip and country') === 0, await t.ev("(document.querySelector('.ch-lede')||{}).textContent||''"));
    check('/glossary/: the letter jumps', (await t.ev("document.querySelectorAll('.gl-thumb a').length")) >= 24);
    check('/glossary/: the JSON-LD set of terms', (await t.ev("JSON.parse(document.querySelector('script[type=\"application/ld+json\"]').textContent).hasDefinedTerm.length")) === 208);
    check('/glossary/: the firm, chip and country lists', (await t.ev("['list-firms','list-chips','list-countries'].every(function(id){return !!document.getElementById(id);})")));
    check('/glossary/: Open the interactive page', (await t.ev("document.querySelector('.cta .btn').getAttribute('href')")) === '../#/glossary');
    await t.close();
  } catch (e) { check('the run finished', false, e.message); }
  finally { await chrome.close(); }
  console.log(out.join('\n'));
  console.log(bad ? `${bad} FAILED` : `all ${out.length} checks pass`);
  process.exit(bad ? 1 : 0);
})();
