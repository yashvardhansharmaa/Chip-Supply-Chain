#!/usr/bin/env node
/* The Glossary, search first, with its kinds and letters ("Kinds and letters", chosen 30 Oct 2026), driven as a reader would:
   the first screen (the name, the labeled field, Random entry and no Look up button, the kinds with their counts and the
   letters, all read from the rows, no layout shift), the suggestions (inside the field's edge, the names first, then "In the
   text", "Show all N matches", "Did you mean" and every place the site uses the words), the keys (the arrows, Enter, Escape,
   "/"), an entry in the bar's column (kind line, other names, definition, reason, Read it in and Also in with "and N more",
   Where it appears with six then Show all, the links between entries, Previous and Next), a firm's revenue, China chart and
   Critical mark, a country's shares and EU-27 line, a chip's card on AI Chips, Browse A to Z (#a-z, a kind, a letter, the
   strip, Back to the same place), the addresses (#gl-, #lk-term-, #lk-firm-, #lk-chip-, #lk-country-, #a-z, #a-z/<kind>,
   #a-z/<letter>), a passage out to its chapter's page and Back, the ways in (a chapter's pop-up, the masthead search, the
   Export Controls board, the masthead's tab), the phone at 390 and 320 (44 px targets, the field rising, the finger on the
   letters), focus, and dark mode. Since 30 Oct 2026 the Glossary is its own page, /glossary/, and every case runs there;
   the page as delivered (no script) holds every entry's words, and the old addresses on the home page (/#/glossary, /#gl-,
   /#lk-, /#a-z) and the static copy's anchors (#euv, #letter-s, #list-firms) land on the same entries.
   usage: node qa/redesign/interact-glossary.js [base] (default http://127.0.0.1:8798) */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const G = BASE + '/glossary/'; // the Glossary's own page (30 Oct 2026)
(async () => {
  const chrome = launch(); const out = []; let bad = 0;
  const check = (name, ok, detail) => { out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail !== undefined && detail !== '' ? ': ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)) : ''}`); if (!ok) bad++; };
  const key = async (t, k, code, vk, text) => { await t.s('Input.dispatchKeyEvent', { type: text ? 'keyDown' : 'rawKeyDown', key: k, code, windowsVirtualKeyCode: vk, text }); await t.s('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk }); };
  const typeIn = async (t, text) => { await t.ev("(function(){var i=document.getElementById('gl-search');i.focus();i.value='';i.dispatchEvent(new Event('input'));return 1;})()"); if (text) await t.s('Input.insertText', { text }); await sleep(350); };
  const until = async (t, expr, ms) => { for (let i = 0; i < (ms || 6000) / 150; i++) { try { if (await t.ev(expr)) return true; } catch (e) { } await sleep(150); } return false; };
  const ready = (t) => until(t, "document.querySelector('.view[data-view=\"glossary\"]').getAttribute('data-gl')==='ready'");
  const state = "document.getElementById('gl-view').getAttribute('data-state')";
  const hw = "(document.getElementById('gl-hw')||{}).textContent";
  const opts = "[...document.querySelectorAll('#gl-sugg .gl-opt .gl-opt-n')].map(function(e){return e.textContent;})";
  const act = "(function(){var a=document.activeElement;return a?(a.getAttribute('data-id')||a.id||a.tagName):'';})()";
  const curRow = "(document.querySelector('#lk-items .gl-r a[aria-current=\"true\"]')||{}).textContent";
  const shown = "[...document.querySelectorAll('#lk-items .gl-r')].filter(function(r){return r.offsetParent!==null;})";
  const tap = async (t, sel) => { const p = await t.ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});if(!e)return null;e.scrollIntoView({block:'center'});var r=e.getBoundingClientRect();return {x:r.left+Math.min(20,r.width/2),y:r.top+r.height/2};})()`); if (!p) return false; await sleep(150); await t.s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y }] }); await t.s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(500); return true; };
  const clickAt = async (t, sel) => { const p = await t.ev(`(function(){var e=document.querySelector(${JSON.stringify(sel)});if(!e)return null;var r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};})()`); if (!p) return false; for (const type of ['mousePressed', 'mouseReleased']) await t.s('Input.dispatchMouseEvent', { type, x: p.x, y: p.y, button: 'left', clickCount: 1 }); await sleep(400); return true; };
  // the smallest type shown: every element with its own text in the Glossary view
  const smallest = "(function(){var m=99,w='';document.querySelectorAll('.view[data-view=\"glossary\"] *').forEach(function(e){if(!e.getClientRects().length)return;var own=[].some.call(e.childNodes,function(n){return n.nodeType===3&&n.nodeValue.trim();});if(!own)return;if(e.closest('.sr-only,svg,[hidden]'))return;var cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none')return;var f=parseFloat(cs.fontSize);if(f<m){m=f;w=e.className||e.tagName;}});return m+' ('+w+')';})()";
  // the layout shift since load (Chrome's own record of it)
  const cls = "new Promise(function(res){var s=0;try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){if(!e.hadRecentInput)s+=e.value;});}).observe({type:'layout-shift',buffered:true});}catch(e){}setTimeout(function(){res(Math.round(s*10000)/10000);},300);})";
  const sideways = 'document.documentElement.scrollWidth <= innerWidth';
  try {
    /* ---------- 1440: the first screen ---------- */
    let t = await open(chrome, G, { width: 1440, wait: 1500 });
    check('1440: the rows are in', await ready(t));
    check('1440: it opens at rest, at its own address', (await t.ev(state)) === 'home' && (await t.ev('location.pathname + location.hash')) === '/glossary/');
    check('1440: every entry has its row in the page, with its lk- id, and each term its gl- id', (await t.ev("document.querySelectorAll('#lk-items li.gl-r[id^=\"lk-\"]').length")) === 487 && (await t.ev("document.querySelectorAll('#lk-items li[id^=\"lk-term-\"] > a[id^=\"gl-\"]').length")) === 208);
    check('1440: the name, a level-one heading', (await t.ev("document.getElementById('gl-title').textContent")) === 'Glossary' && (await t.ev("document.getElementById('gl-title').getAttribute('aria-level')")) === '1');
    check('1440: the search is labeled and counts the entries', (await t.ev("document.querySelector('label[for=\"gl-search\"]').textContent")).length > 10 && (await t.ev("document.getElementById('gl-search').placeholder")) === 'Search 487 entries' && (await t.ev("document.getElementById('gl-search').getAttribute('role')")) === 'combobox');
    check('1440: one button under the field, Random entry, and no Look up', (await t.ev("[...document.querySelectorAll('#gl-btns button')].map(function(b){return b.textContent;}).join('|')")) === 'Random entry' && !(await t.ev("[...document.querySelectorAll('.view[data-view=\"glossary\"] button, .view[data-view=\"glossary\"] a')].some(function(b){return /^\\s*look up\\s*$/i.test(b.textContent);})")));
    const kindsRead = await t.ev("[...document.querySelectorAll('#gl-kindrow a')].map(function(a){return a.querySelector('.n').textContent+' '+a.querySelector('.w').textContent;}).join(' · ')");
    const kindsData = await t.ev("['term','firm','chip','country'].map(function(k){return document.querySelectorAll('#lk-items .gl-r[data-kind=\"'+k+'\"]').length;}).join(',')");
    check('1440: the kinds and their counts, as the rows have them', kindsRead === '208 terms · 226 firms · 38 AI chips · 15 countries' && kindsData === '208,226,38,15', kindsRead + ' / ' + kindsData);
    check('1440: each kind opens the index of that kind', (await t.ev("[...document.querySelectorAll('#gl-kindrow a')].map(function(a){return a.getAttribute('href');}).join(' ')")) === '#a-z/terms #a-z/firms #a-z/ai-chips #a-z/countries');
    const abc = await t.ev("(function(){var c=[...document.querySelectorAll('#gl-abc > *')];return {n:c.length,off:c.filter(function(e){return e.tagName==='SPAN';}).map(function(e){return e.textContent;}).join(','),agree:c.filter(function(e){return e.tagName==='A';}).every(function(a){var l=a.getAttribute('data-azl'),n=document.querySelectorAll('#lk-items .gl-g[data-l=\"'+l+'\"] .gl-r').length;return n>0&&a.getAttribute('aria-label').indexOf(', '+n+' ')>0;})};})()");
    check('1440: the letters, 0–9 and A to Z, X off as the data has it, each named with its count', abc.n === 27 && abc.off === 'X' && abc.agree, abc);
    check('1440: the first screen ends inside the window', (await t.ev("Math.round(document.getElementById('gl-abc').getBoundingClientRect().bottom)")) < 700, await t.ev("Math.round(document.getElementById('gl-abc').getBoundingClientRect().bottom)"));
    check('1440: no layout shift on load', (await t.ev(cls)) < 0.01, await t.ev(cls));
    check('1440: no sideways scroll', await t.ev(sideways));
    check('1440: nothing under 11.5 px', parseFloat(await t.ev(smallest)) >= 11.5, await t.ev(smallest));
    // focus is visible: Tab from Random entry reaches the first kind with a ring
    await t.ev("(document.getElementById('gl-rand').focus(),1)"); await key(t, 'Tab', 'Tab', 9); await sleep(150);
    check('1440: Tab goes from Random entry to the kinds, and the focus shows', (await t.ev("document.activeElement.getAttribute('data-azk')")) === 'term' && (await t.ev("getComputedStyle(document.activeElement).outlineStyle")) !== 'none');

    /* ---------- the suggestions ---------- */
    await typeIn(t, 'euv');
    check('typing: the suggestions open inside the field\'s edge', (await t.ev("!document.getElementById('gl-sugg').hidden && document.getElementById('gl-box').contains(document.getElementById('gl-sugg'))")) && (await t.ev("document.getElementById('gl-search').getAttribute('aria-expanded')")) === 'true');
    check('typing: the name match first, then In the text', (await t.ev(opts))[0] === 'EUV' && (await t.ev("(document.querySelector('#gl-sugg .gl-grp')||{}).textContent")) === 'In the text', (await t.ev(opts)).slice(0, 4).join(', '));
    check('typing: each suggestion has its kind and first sentence', await t.ev("[...document.querySelectorAll('#gl-sugg .gl-opt')].every(function(o){return o.querySelector('.gl-opt-k').textContent&&o.querySelector('.gl-opt-d').textContent.length>10;})"));
    check('typing: a match through another name shows that name', await t.ev("[...document.querySelectorAll('#gl-sugg .gl-opt-k')].some(function(k){return / · /.test(k.textContent);})"), await t.ev("[...document.querySelectorAll('#gl-sugg .gl-opt-k')].map(function(k){return k.textContent;}).join(' | ')"));
    const allN = await t.ev("parseInt((document.querySelector('#gl-sugg .gl-all')||{textContent:''}).textContent.replace(/\\D+/g,''))");
    check('typing: as many as the window holds, then Show all N matches', (await t.ev("document.querySelectorAll('#gl-sugg .gl-opt').length")) <= 8 && allN > 8, allN);
    await t.ev("(document.querySelector('#gl-sugg .gl-all').click(),1)"); await sleep(300);
    check('Show all lists every match, and the field keeps the focus', (await t.ev("document.querySelectorAll('#gl-sugg .gl-opt').length")) === allN && (await t.ev(act)) === 'gl-search');
    check('typing: no sideways scroll, nothing under 11.5 px', (await t.ev(sideways)) && parseFloat(await t.ev(smallest)) >= 11.5, await t.ev(smallest));
    await typeIn(t, 'tsmc');
    check('an exact name tops the name matches', (await t.ev(opts))[0] === 'TSMC', (await t.ev(opts))[0]);
    await typeIn(t, 'foxconn');
    check('another name finds its entry first', (await t.ev(opts))[0] === 'Hon Hai Precision', (await t.ev(opts))[0]);
    await key(t, 'ArrowDown', 'ArrowDown', 40); await sleep(150);
    check('the down arrow marks the first suggestion, focus stays in the field', (await t.ev("document.getElementById('gl-search').getAttribute('aria-activedescendant')")) === 'gl-o0' && (await t.ev("document.getElementById('gl-o0').getAttribute('aria-selected')")) === 'true' && (await t.ev(act)) === 'gl-search');
    await key(t, 'Escape', 'Escape', 27); await sleep(200);
    check('Escape clears the field and closes the suggestions', (await t.ev("document.getElementById('gl-search').value")) === '' && (await t.ev("document.getElementById('gl-sugg').hidden")) && (await t.ev(state)) === 'home');
    await typeIn(t, 'Veldhoven');
    check('a word with no entry of its own still finds its entries in the text', (await t.ev("document.querySelectorAll('#gl-sugg .gl-opt').length")) > 0 && !(await t.ev("document.querySelector('#gl-sugg .gl-none')")));
    await typeIn(t, 'nvidai');
    check('no match: says so, offers Did you mean and every place the site uses the words', /No entry matches/.test(await t.ev("document.querySelector('#gl-sugg .gl-none').textContent")) && (await t.ev(opts)).includes('Nvidia') && /^Every place the site uses/.test((await t.ev(opts)).slice(-1)[0]), (await t.ev(opts)).join(', '));
    await key(t, 'ArrowUp', 'ArrowUp', 38); await key(t, 'ArrowDown', 'ArrowDown', 40);
    const nNear = await t.ev("document.querySelectorAll('#gl-sugg .gl-opt').length");
    for (let k = 1; k < nNear; k++) await key(t, 'ArrowDown', 'ArrowDown', 40);
    await key(t, 'Enter', 'Enter', 13, '\r'); await sleep(500);
    check('no match: Enter on the last line lists every place the words appear', (await t.ev(state)) === 'entry' && (await t.ev(hw)) === 'nvidai' && /No entry/i.test(await t.ev("document.querySelector('#gl-pane .gl-kind').textContent")) && (await t.ev('location.hash')) === '#gl-find' && !!(await t.ev("document.querySelector('#gl-pane .gl-meta a[data-id]')")));
    await t.ev("(([...document.querySelectorAll('#gl-pane .gl-meta a')].filter(function(a){return a.textContent==='Nvidia';})[0]).click(),1)"); await sleep(400);
    check('Did you mean opens the entry', (await t.ev(hw)) === 'Nvidia' && (await t.ev('location.hash')) === '#lk-firm-nvidia');
    await t.ev('(history.back(),1)'); await sleep(700);
    check('Back returns to the words looked for', (await t.ev(hw)) === 'nvidai' && (await t.ev(state)) === 'entry');
    await t.ev('(history.back(),1)'); await sleep(700);
    check('Back again returns to rest', (await t.ev(state)) === 'home' && (await t.ev('location.pathname + location.hash')) === '/glossary/');
    // Enter opens the top match, with no button: the field moves into the bar
    await typeIn(t, 'hbm'); await key(t, 'Enter', 'Enter', 13, '\r'); await sleep(500);
    check('Enter opens the top match, and its name takes focus', (await t.ev(state)) === 'entry' && (await t.ev(hw)) === 'HBM' && (await t.ev('location.hash')) === '#gl-hbm' && (await t.ev(act)) === 'gl-hw');
    check('the entry: the field in a bar under the masthead, the name of the Glossary at its left, Browse A to Z at its right', (await t.ev("getComputedStyle(document.getElementById('gl-head')).position")) === 'sticky' && Math.abs(await t.ev("document.getElementById('gl-head').getBoundingClientRect().top - document.querySelector('.masthead').getBoundingClientRect().bottom")) <= 1 && (await t.ev("getComputedStyle(document.querySelector('.gl-az-link')).display")) !== 'none' && (await t.ev("Math.round(document.getElementById('gl-title').getBoundingClientRect().height)")) < 40);
    check('the entry: one centered column', Math.abs(await t.ev("(function(){var r=document.querySelector('#gl-pane .gl-e').getBoundingClientRect();return Math.round(r.left+r.width/2-innerWidth/2);})()")) <= 8 && (await t.ev("Math.round(document.querySelector('#gl-pane .gl-e').getBoundingClientRect().width)")) <= 700);
    check('the entry: the kinds and the letters leave with the first screen', (await t.ev("getComputedStyle(document.getElementById('gl-hold')).display")) === 'none' && (await t.ev("document.getElementById('gl-hold').inert")));
    await t.ev("(document.activeElement.blur(),1)");
    await key(t, '/', 'Slash', 191, '/'); await sleep(200);
    check('"/" goes to the Glossary field, not the site search', (await t.ev(act)) === 'gl-search' && !(await t.ev("(function(){var b=document.getElementById('cp-search');return !!b&&!b.hidden;})()")));
    await typeIn(t, 'litho');
    check('typing in the bar drops the suggestions under it', !(await t.ev("document.getElementById('gl-sugg').hidden")) && (await t.ev(opts)).length > 0);
    await key(t, 'Escape', 'Escape', 27); await sleep(150);
    // the title goes back to rest
    await t.ev("(document.querySelector('#gl-title a').click(),1)"); await sleep(400);
    check('the name of the Glossary returns to rest', (await t.ev(state)) === 'home' && (await t.ev('location.pathname + location.hash')) === '/glossary/');
    // the masthead's Glossary tab, from an entry, returns to rest in place
    await t.ev("(document.getElementById('gl-rand').click(),1)"); await sleep(500);
    await t.ev("(document.querySelector('.tabs a[data-view=\"glossary\"]').click(),1)"); await sleep(400);
    check("the masthead's Glossary tab is current, links to /glossary/ and returns to rest in place", (await t.ev("document.querySelector('.tabs a[aria-current=\"page\"]').textContent")) === 'Glossary' && (await t.ev("document.querySelector('.tabs a[data-view=\"glossary\"]').getAttribute('href')")) === '../glossary/' && (await t.ev(state)) === 'home' && (await t.ev('location.pathname + location.hash')) === '/glossary/');
    // Random entry
    await t.ev("(document.getElementById('gl-rand').click(),1)"); await sleep(500);
    check('Random entry opens an entry and the address names it', (await t.ev(state)) === 'entry' && /^#(gl-|lk-)/.test(await t.ev('location.hash')) && (await t.ev(hw)).length > 0, await t.ev(hw));
    check('1440: no script errors', !t.errors.length, t.errors.join(' | '));
    await t.close();

    /* ---------- an entry's parts ---------- */
    t = await open(chrome, G + '#lk-term-chip', { width: 1440, wait: 1500 }); await ready(t); await sleep(300);
    check('#lk-term-chip opens chip, at the top', (await t.ev(hw)) === 'chip' && (await t.ev(state)) === 'entry' && (await t.ev('scrollY')) === 0);
    check('chip reads it in its chapters, four named and the rest behind a button', /^Read it in/.test(await t.ev("document.querySelector('.gl-reads').innerText")) && /^and \d+ more$/.test(await t.ev("document.querySelector('.gl-reads [data-rest]').textContent")) && (await t.ev("document.querySelectorAll('.gl-also > a').length")) === 4);
    await t.ev("(document.querySelector('.gl-reads [data-rest]').click(),1)"); await sleep(200);
    check('"and N more" shows the rest and moves focus to them', await t.ev("!document.querySelector('.gl-rest').hidden && document.activeElement.closest('.gl-rest') !== null"));
    const n0 = await t.ev("parseInt(document.querySelector('#gl-wh .gl-n').textContent)");
    check('six places, then Show all', (await t.ev("document.querySelectorAll('.gl-men li').length")) === 6 && (await t.ev("document.querySelector('.gl-more button').textContent")) === 'Show all ' + n0, n0 + ' places');
    await t.ev("(document.querySelector('.gl-more button').click(),1)"); await sleep(300);
    check('Show all shows every place', (await t.ev("document.querySelectorAll('.gl-men li').length")) === n0);
    await t.close();
    t = await open(chrome, G + '#lk-firm-asml', { width: 1440, wait: 1500 }); await ready(t); await sleep(300);
    check('#lk-firm-asml opens ASML', (await t.ev(hw)) === 'ASML' && (await t.ev(state)) === 'entry');
    check("a firm keeps its facts, its Critical mark, its revenue's filing link and its China chart", /Chokepoint level/.test(await t.ev("document.querySelector('.gl-facts').innerText")) && !!(await t.ev("document.querySelector('.gl-facts .gl-chk--critical')")) && !!(await t.ev("document.querySelector('.gl-facts a.rev-filed')")) && !!(await t.ev("document.querySelector('.gl-facts .sup-ex-mini svg')")));
    check('a firm links to its row in the supplier list', !!(await t.ev("document.querySelector('#gl-pane a[data-sup=\"ASML\"]')")));
    check('the links between entries keep the words and stop at three a paragraph', (await t.ev("[...document.querySelectorAll('.gl-e p')].every(function(p){return p.querySelectorAll('a.gl-x').length<=3;})")) && (await t.ev("document.querySelectorAll('.gl-def a.gl-x').length")) >= 1);
    check('each entry is linked once', await t.ev("(function(){var s={},ok=true;document.querySelectorAll('.gl-e a.gl-x').forEach(function(a){var k=a.getAttribute('data-id');if(s[k])ok=false;s[k]=1;});return ok;})()"));
    await t.ev("(document.querySelector('.gl-def a.gl-x').click(),1)"); await sleep(400);
    check('a link between entries opens the other entry', (await t.ev(hw)) !== 'ASML' && /^#(gl-|lk-)/.test(await t.ev('location.hash')), await t.ev(hw));
    await t.ev('(history.back(),1)'); await sleep(700);
    check('Back returns to the entry before', (await t.ev(hw)) === 'ASML' && (await t.ev('location.hash')) === '#lk-firm-asml');
    await t.ev("(document.querySelector('.gl-pn .gl-next').click(),1)"); await sleep(400);
    check('Next opens the entry after it A to Z', /^ASMPT/.test(await t.ev(hw)), await t.ev(hw));
    await t.ev("(document.querySelector('.gl-pn .gl-prev').click(),1)"); await sleep(400);
    check('Previous goes back to it', (await t.ev(hw)) === 'ASML');
    check('entries: no script errors', !t.errors.length, t.errors.join(' | '));
    await t.close();
    t = await open(chrome, G + '#lk-country-nl', { width: 1440, wait: 1500 }); await ready(t); await sleep(300);
    check('#lk-country-nl opens the Netherlands with its shares', (await t.ev(hw)) === 'Netherlands' && /Share of each segment/.test(await t.ev("document.getElementById('gl-pane').innerText")));
    check('the shares follow the chart rule: the largest wine, the rest the tint', (await t.ev("getComputedStyle(document.querySelector('.gl-share.is-top .gl-share-bar')).backgroundImage")).includes('rgb(122, 31, 43)') && (await t.ev("getComputedStyle(document.querySelector('.gl-share:not(.is-top) .gl-share-bar')).backgroundImage")).includes('rgb(210, 209, 204)'));
    check('the band marks on its chokepoint cards', !!(await t.ev("document.querySelector('.gl-cards .gl-card-b--extreme, .gl-cards .gl-card-b--high')")));
    check('the EU-27 line and its link', /Across the EU-27/.test(await t.ev("document.getElementById('gl-pane').innerText")) && !!(await t.ev("document.querySelector('#gl-pane a[href=\"#/suppliers?group=eu\"]')")));
    await t.ev("(document.querySelector('.gl-cat-f a[data-id]').click(),1)"); await sleep(400);
    check("a Critical firm's name opens its entry", /^#lk-firm-/.test(await t.ev('location.hash')) && !!(await t.ev("document.querySelector('.gl-facts')")), await t.ev(hw));
    await t.close();
    t = await open(chrome, G + '#lk-chip-nvidia-b200', { width: 1440, wait: 1500 }); await ready(t); await sleep(300);
    check('#lk-chip- opens the chip with its facts', (await t.ev(hw)) === 'Nvidia B200' && /Dense TFLOPS/i.test(await t.ev("document.getElementById('gl-pane').innerText")));
    await t.ev("(document.querySelector('#gl-pane a[data-chip]').click(),1)"); await sleep(2500);
    check('On AI Chips opens the chip there, on the home page', (await t.ev('location.pathname + location.hash')) === '/#/landscape?pick=nvidia-b200' && (await t.ev("(document.querySelector('#aic-card h2')||{}).textContent")) === 'B200');
    await t.ev('(history.back(),1)'); await sleep(2500); await ready(t);
    check('Back to the Glossary returns to the chip', (await t.ev(hw)) === 'Nvidia B200' && (await t.ev(state)) === 'entry');
    check('the addresses: no script errors', !t.errors.length, t.errors.join(' | '));
    await t.close();

    /* ---------- Browse A to Z ---------- */
    t = await open(chrome, G, { width: 1440, wait: 1500 }); await ready(t);
    await t.ev("(document.querySelector('#gl-kindrow a[data-azk=\"firm\"]').click(),1)"); await sleep(500);
    check('a kind opens the index of that kind', (await t.ev(state)) === 'browse' && (await t.ev('location.hash')) === '#a-z/firms' && (await t.ev("document.getElementById('gl-count').textContent")) === '226 firms' && (await t.ev("document.querySelector('#gl-kinds [data-k=\"firm\"]').getAttribute('aria-pressed')")) === 'true');
    check('the firms only, and every row stays in the page', (await t.ev(`${shown}.every(function(r){return r.getAttribute('data-kind')==='firm';})`)) && (await t.ev(`${shown}.length`)) === 226 && (await t.ev("document.querySelectorAll('#lk-items li[id^=\"lk-\"]').length")) === 487);
    check('the index: its head takes focus, Browse A to Z is marked', (await t.ev(act)) === 'gl-bh' && (await t.ev("document.querySelector('.gl-az-link').getAttribute('aria-current')")) === 'page');
    await t.ev("(document.querySelector('#gl-kinds [data-k=\"country\"]').click(),1)"); await sleep(300);
    check('another kind rewrites the address in place, and a letter with none is off', (await t.ev('location.hash')) === '#a-z/countries' && (await t.ev("document.getElementById('gl-count').textContent")) === '15 countries' && (await t.ev("document.querySelectorAll('#gl-jump span').length")) > 5);
    await t.ev('(history.back(),1)'); await sleep(600);
    check('Back from the index returns to rest', (await t.ev(state)) === 'home' && (await t.ev('location.pathname + location.hash')) === '/glossary/');
    await t.ev("(document.querySelector('#gl-abc a[data-azl=\"S\"]').click(),1)"); await sleep(600);
    check('a letter opens the index at that letter, all kinds, its head with focus', (await t.ev(state)) === 'browse' && (await t.ev('location.hash')) === '#a-z/s' && (await t.ev(act)) === 'gl-lh-S' && (await t.ev("document.getElementById('gl-count').textContent")) === '487 entries');
    check('the letter lands under the strip, and the strip marks it', Math.abs(await t.ev("document.getElementById('gl-lh-S').closest('.gl-g').getBoundingClientRect().top - document.getElementById('gl-jump').getBoundingClientRect().bottom")) < 4 && (await t.ev("(document.querySelector('#gl-jump [aria-current=\"true\"]')||{}).textContent")) === 'S');
    check('the strip and the letter heads stick', (await t.ev("getComputedStyle(document.getElementById('gl-jump')).position")) === 'sticky' && (await t.ev("getComputedStyle(document.getElementById('gl-lh-S')).position")) === 'sticky');
    check('the index: no sideways scroll, nothing under 11.5 px', (await t.ev(sideways)) && parseFloat(await t.ev(smallest)) >= 11.5, await t.ev(smallest));
    await t.ev("(document.querySelector('#gl-jump [data-l=\"M\"]').click(),1)"); await sleep(400);
    check('a letter in the strip brings its letter under the strip', Math.abs(await t.ev("document.getElementById('gl-lh-M').closest('.gl-g').getBoundingClientRect().top - document.getElementById('gl-jump').getBoundingClientRect().bottom")) < 4 && (await t.ev("(document.querySelector('#gl-jump [aria-current=\"true\"]')||{}).textContent")) === 'M');
    await t.scrollTo(await t.ev('scrollY + 300'));
    const y0 = await t.ev('scrollY');
    const picked = await t.ev("(function(){var a=[...document.querySelectorAll('#lk-items .gl-r a')].filter(function(a){var r=a.getBoundingClientRect();return a.offsetParent!==null&&r.top>250&&r.bottom<innerHeight;})[0];a.click();return a.getAttribute('data-id');})()"); await sleep(500);
    check('a name in the index opens its entry at the top', (await t.ev(state)) === 'entry' && (await t.ev('scrollY')) === 0 && /^#(gl-|lk-)/.test(await t.ev('location.hash')), picked);
    await t.ev('(history.back(),1)'); await sleep(800);
    check('Back returns to the index at the same place, the entry marked', (await t.ev(state)) === 'browse' && Math.abs((await t.ev('scrollY')) - y0) <= 2 && (await t.ev("document.querySelector('#lk-items .gl-r a[aria-current=\"true\"]').getAttribute('data-id')")) === picked, (await t.ev('scrollY')) + ' vs ' + y0);
    await t.ev("(document.querySelector('.gl-az-link').click(),1)"); await sleep(300);
    check('Browse A to Z in the bar keeps the index', (await t.ev(state)) === 'browse');
    check('Browse A to Z: no script errors', !t.errors.length, t.errors.join(' | '));
    await t.close();
    for (const [h, want] of [['#a-z', { hash: '#a-z', count: '487 entries', top: 0 }], ['#a-z/ai-chips', { count: '38 AI chips', kind: 'chip' }], ['#a-z/x', { count: '487 entries', top: 0 }]]) {
      t = await open(chrome, G + h, { width: 1440, wait: 1500 }); await ready(t); await sleep(400);
      const st = await t.ev(`({ state: ${state}, count: document.getElementById('gl-count').textContent, kind: (document.querySelector('#gl-kinds [aria-pressed="true"]')||{}).getAttribute('data-k'), y: scrollY, errors: 0 })`);
      check(`${h} opens the index${want.kind ? ' of that kind' : ''}${h === '#a-z/x' ? ' (X has no entries: at its top)' : ''}`, st.state === 'browse' && st.count === want.count && (!want.kind || st.kind === want.kind) && (want.top === undefined || st.y === want.top) && !t.errors.length, st);
      await t.close();
    }
    t = await open(chrome, G + '#a-z/s', { width: 1440, wait: 2000 }); await ready(t); await sleep(400);
    check('#a-z/s opens the index at S', (await t.ev(state)) === 'browse' && Math.abs(await t.ev("document.getElementById('gl-lh-S').closest('.gl-g').getBoundingClientRect().top - document.getElementById('gl-jump').getBoundingClientRect().bottom")) < 4);
    check('#a-z/s: no layout shift on load', (await t.ev(cls)) < 0.01, await t.ev(cls));
    await t.close();

    /* ---------- a deep link, a passage out to its chapter's page, and Back ---------- */
    t = await open(chrome, G + '#gl-euv', { width: 1440, wait: 1500 }); await ready(t); await sleep(600);
    check('#gl-euv opens EUV at the top, its row marked in the index', (await t.ev(hw)) === 'EUV' && (await t.ev('scrollY')) === 0 && (await t.ev(curRow)) === 'EUV');
    check('#gl-euv: no layout shift on load', (await t.ev(cls)) < 0.01, await t.ev(cls));
    check('the term reads it in Lithography, and also elsewhere', /Read it in\s*Lithography/.test(await t.ev("document.querySelector('.gl-reads').innerText")) && /Also in/.test(await t.ev("document.querySelector('.gl-reads').innerText")));
    check('the term has its other names, definition and reason', await t.ev("!!document.querySelector('.gl-names') && !!document.querySelector('.gl-def') && !!document.querySelector('.gl-p')"));
    await t.ev("(document.querySelector('.gl-men a[data-para]').click(),1)");
    let flashed = 0; for (let k = 0; k < 24 && !flashed; k++) { await sleep(250); try { flashed = await t.ev("document.querySelectorAll('.lk-flash').length"); } catch (e) { } }
    check("a passage opens its chapter's page and flashes there", /^\/[a-z-]+\/$/.test(await t.ev('location.pathname')) && (await t.ev('location.pathname')) !== '/glossary/' && flashed === 1, await t.ev('location.pathname'));
    await t.ev('(history.back(),1)'); await sleep(2500);
    check('Back returns to the entry', (await t.ev("document.documentElement.getAttribute('data-view')")) === 'glossary' && (await t.ev(hw)) === 'EUV', await t.ev('location.hash'));
    await t.close();
    t = await open(chrome, G + '#lk-term-euv', { width: 1440, wait: 1500 }); await ready(t); await sleep(300);
    check('#lk-term-euv opens EUV too', (await t.ev(hw)) === 'EUV');
    await t.close();

    /* ---------- the ways in: a chapter's pop-up, the site search, the Export Controls board ---------- */
    t = await open(chrome, BASE + '/lithography/', { width: 1440, wait: 2000 });
    const term = await t.ev("(function(){var b=[...document.querySelectorAll('#lithography .prose .gl-term')].filter(function(x){return !x.dataset.note;})[0];b.scrollIntoView({block:'center'});b.focus();return b.getAttribute('data-term');})()"); await sleep(500);
    check('a pop-up opens over the chapter text with the same definition', (await t.ev("!document.getElementById('gl-tip').hidden")) && (await t.ev("document.getElementById('gl-tip').querySelector('p').textContent")) === (await t.ev(`(window.CP_TERMS.defs[${JSON.stringify(term)}] || [])[1]`)), term);
    const look = await t.ev("document.querySelector('#gl-tip a').getAttribute('href')");
    await t.ev("(document.querySelector('#gl-tip a').click(),1)"); await sleep(2500); await ready(t);
    check("Look it up opens the entry on the Glossary's page", look.indexOf('../glossary/#gl-') === 0 && (await t.ev("document.documentElement.getAttribute('data-view')")) === 'glossary' && (await t.ev(state)) === 'entry' && (await t.ev('location.pathname + location.hash')) === look.slice(2) && (await t.ev(curRow)) === (await t.ev(`document.getElementById(${JSON.stringify(look.split('#')[1])}).textContent`)), look + ' -> ' + (await t.ev(hw)));
    check("after a move from another page the entry's name takes focus", (await t.ev(act)) === 'gl-hw');
    await t.ev("(document.querySelector('.search-btn').click(),1)"); await sleep(300); await t.s('Input.insertText', { text: 'photoresist' }); await sleep(900);
    const res = await t.ev("(function(){var a=[...document.querySelectorAll('.cp-search-results a')].filter(function(a){return /^#gl-/.test(a.getAttribute('href'));})[0];return a?a.getAttribute('href'):null;})()");
    await t.ev(`(document.querySelector('.cp-search-results a[href="${res}"]').click(),1)`); await sleep(900);
    check("the site search's term result opens its entry, its name with focus", !!res && (await t.ev('location.hash')) === res && (await t.ev(state)) === 'entry' && (await t.ev("document.getElementById('gl-hw').textContent.toLowerCase()")) === (await t.ev(`document.getElementById(${JSON.stringify(res.slice(1))}).textContent.toLowerCase()`)) && (await t.ev(act)) === 'gl-hw', res);
    check('no script errors from the chapter to the Glossary', !t.errors.length, t.errors.join(' | '));
    await t.close();
    t = await open(chrome, BASE + '/#/controls', { width: 1440, wait: 2000 });
    const ctl = await t.ev("(function(){var b=document.querySelector('.view[data-view=\"controls\"] .gl-term');if(!b)return null;var l=b.closest('.cf-lab');if(l)l.style.display='inline';b.scrollIntoView({block:'center'});b.click();return b.getAttribute('data-term');})()"); await sleep(500);
    if (ctl) {
      await t.ev("(document.querySelector('#gl-tip a').click(),1)"); await sleep(1500); await ready(t);
      check("Export Controls: a pop-up's Look it up opens the entry", (await t.ev("document.documentElement.getAttribute('data-view')")) === 'glossary' && /^#gl-/.test(await t.ev('location.hash')) && (await t.ev(state)) === 'entry' && (await t.ev(hw)).length > 0 && (await t.ev(act)) === 'gl-hw', ctl + ' -> ' + (await t.ev(hw)));
    } else check('Export Controls: a pop-up to try', false, 'no term on the page');
    await t.close();

    /* ---------- 390: the phone ---------- */
    t = await open(chrome, G, { width: 390, wait: 1500 }); await ready(t);
    check('390: the same calm first screen', (await t.ev(state)) === 'home' && (await t.ev(sideways)) && parseFloat(await t.ev(smallest)) >= 11.5, await t.ev(smallest));
    const k390 = await t.ev("[...document.querySelectorAll('#gl-kindrow a, #gl-abc a, #gl-rand')].map(function(a){var r=a.getBoundingClientRect();return Math.min(Math.round(r.width),Math.round(r.height));})");
    check('390: the kinds, the letters and Random entry are 44 px targets', Math.min(...k390) >= 44, Math.min(...k390));
    check('390: the kinds two by two', (await t.ev("getComputedStyle(document.getElementById('gl-kindrow')).gridTemplateColumns.split(' ').length")) === 2);
    check('390: no layout shift on load', (await t.ev(cls)) < 0.01, await t.ev(cls));
    await typeIn(t, 'euv'); await sleep(300);
    check('390: typing lifts the field to the top', Math.abs(await t.ev("document.getElementById('gl-field').getBoundingClientRect().top - document.querySelector('.masthead').getBoundingClientRect().bottom")) <= 14 && (await t.ev("document.querySelectorAll('#gl-sugg .gl-opt').length")) <= 6, await t.ev("Math.round(document.getElementById('gl-field').getBoundingClientRect().top)"));
    check('390: each suggestion is a 44 px target', (await t.ev("Math.min.apply(null,[...document.querySelectorAll('#gl-sugg .gl-opt')].map(function(o){return o.getBoundingClientRect().height;}))")) >= 44);
    await tap(t, '#gl-o0');
    check('390: a tap on a suggestion opens its entry under the bar', (await t.ev(state)) === 'entry' && (await t.ev(hw)) === 'EUV' && (await t.ev('location.hash')) === '#gl-euv');
    check('390: the bar holds the field and A to Z, the name only for screen readers', (await t.ev("document.querySelector('.gl-az-link .s').getClientRects().length")) === 1 && (await t.ev("Math.round(document.getElementById('gl-title').getBoundingClientRect().width)")) <= 1 && (await t.ev("Math.round(document.querySelector('.gl-az-link').getBoundingClientRect().height)")) >= 44);
    check('390: the entry fits, nothing under 11.5 px', (await t.ev(sideways)) && parseFloat(await t.ev(smallest)) >= 11.5, await t.ev(smallest));
    await tap(t, '.gl-az-link');
    check('390: A to Z opens the index, one column of 44 px rows', (await t.ev(state)) === 'browse' && (await t.ev("Math.round(document.querySelector('#lk-term-euv > a').getBoundingClientRect().height)")) >= 44 && (await t.ev(sideways)));
    const strip = await t.ev("(function(){var a=document.querySelector('#gl-jump [data-l=\"C\"]').getBoundingClientRect(),b=document.querySelector('#gl-jump [data-l=\"P\"]').getBoundingClientRect();return {x:a.left+a.width/2,y1:a.top+a.height/2,y2:b.top+b.height/2};})()");
    await t.s('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: strip.x, y: strip.y1 }] }); await sleep(120);
    for (let k = 1; k <= 6; k++) { await t.s('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: strip.x, y: strip.y1 + (strip.y2 - strip.y1) * k / 6 }] }); await sleep(60); }
    await t.s('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(400);
    check('390: a finger run down the letters lands on the last one', Math.abs(await t.ev("document.getElementById('gl-lh-P').getBoundingClientRect().top - document.getElementById('gl-head').getBoundingClientRect().bottom")) < 4, await t.ev("Math.round(document.getElementById('gl-lh-P').getBoundingClientRect().top - document.getElementById('gl-head').getBoundingClientRect().bottom)"));
    await t.ev("(document.querySelector('#lk-items .gl-g[data-l=\"P\"] .gl-r a').scrollIntoView({block:'center'}),1)"); await sleep(300);
    const y390 = await t.ev('scrollY');
    await tap(t, '#lk-items .gl-g[data-l="P"] .gl-r a');
    const p390 = await t.ev(hw);
    check('390: a row opens its entry', (await t.ev(state)) === 'entry' && p390.length > 0, p390);
    await t.ev('(history.back(),1)'); await sleep(800);
    check('390: Back returns to the index at the same place', (await t.ev(state)) === 'browse' && Math.abs((await t.ev('scrollY')) - y390) <= 2, (await t.ev('scrollY')) + ' vs ' + y390);
    check('390: no script errors', !t.errors.length, t.errors.join(' | '));
    await t.close();
    t = await open(chrome, BASE + '/lithography/', { width: 390, wait: 2000 });
    await t.ev("(function(){var b=[...document.querySelectorAll('#lithography .prose .gl-term')].filter(function(x){return !x.dataset.note;})[0];b.scrollIntoView({block:'center'});b.click();return 1;})()"); await sleep(600);
    check('390: a tap opens the pop-up as a sheet over the text', await t.ev("!document.getElementById('gl-tip').hidden && document.getElementById('gl-tip').classList.contains('is-sheet')"));
    await t.ev("(document.querySelector('#gl-tip a').click(),1)"); await sleep(2500); await ready(t); await sleep(300);
    check('390: Look it up opens the entry under the bar', (await t.ev("document.documentElement.getAttribute('data-view')")) === 'glossary' && (await t.ev(state)) === 'entry' && /^#gl-/.test(await t.ev('location.hash')) && (await t.ev('scrollY')) === 0);
    await t.close();
    t = await open(chrome, G, { width: 320, wait: 1500 }); await ready(t);
    check('320: the first screen fits, nothing under 11.5 px', (await t.ev(sideways)) && parseFloat(await t.ev(smallest)) >= 11.5, await t.ev(smallest));
    check('320: the letter keys stay 44 px', (await t.ev("Math.min.apply(null,[...document.querySelectorAll('#gl-abc a')].map(function(a){var r=a.getBoundingClientRect();return Math.min(r.width,r.height);}))")) >= 44);
    await t.close();
    t = await open(chrome, G + '#lk-country-us', { width: 320, wait: 1500 }); await ready(t); await sleep(300);
    check('320: an entry fits, nothing sideways', (await t.ev(state)) === 'entry' && (await t.ev(sideways)) && parseFloat(await t.ev(smallest)) >= 11.5, await t.ev(smallest));
    await t.close();

    /* ---------- dark ---------- */
    t = await open(chrome, G, { width: 1440, theme: 'dark', wait: 1500 }); await ready(t);
    check('dark: the ground, the name and the figures turn', (await t.ev("getComputedStyle(document.body).backgroundColor")) === 'rgb(18, 18, 17)' && (await t.ev("getComputedStyle(document.getElementById('gl-title')).color")) !== 'rgb(23, 23, 22)' && (await t.ev("getComputedStyle(document.querySelector('#gl-kindrow .n')).color")) !== 'rgb(23, 23, 22)' && (await t.ev("getComputedStyle(document.getElementById('gl-box')).backgroundColor")) === 'rgb(18, 18, 17)');
    await t.close();
    t = await open(chrome, G + '#gl-euv', { width: 1440, theme: 'dark', wait: 1500 }); await ready(t);
    check('dark: the bar and the entry turn dark', (await t.ev("getComputedStyle(document.getElementById('gl-head')).backgroundColor")) === 'rgb(18, 18, 17)' && (await t.ev("getComputedStyle(document.getElementById('gl-hw')).color")) !== 'rgb(23, 23, 22)');
    await t.ev("(document.querySelector('.gl-az-link').click(),1)"); await sleep(400);
    check('dark: the open entry keeps its wine mark in the index', (await t.ev("getComputedStyle(document.querySelector('#lk-items .gl-r a[aria-current]')).boxShadow")).includes('217, 138, 149'));
    await t.close();

    /* ---------- the page as delivered: every entry's words in the HTML, before any script runs ---------- */
    {
      const html = await (await fetch(G)).text();
      const dec = (x) => String(x).replace(/&(#\d+|[a-z]+);/g, (m, e) => (e[0] === '#' ? String.fromCharCode(+e.slice(1)) : ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[e] || m));
      const rows = html.match(/<li class="gl-r"[\s\S]*?<\/li>/g) || [];
      // the words as the data has them: the page sets typographer's quotes and keeps a range on one line (build/keep-ranges.js)
      const words = (r, c) => { const m = new RegExp('<p class="' + c + '">([\\s\\S]*?)</p>').exec(r); return m ? dec(m[1].replace(/<[^>]+>/g, '')).replace(/[‘’]/g, "'").replace(/[“”]/g, '"') : null; };
      const terms = require('../../data/glossary.json');
      const termRows = rows.filter((r) => /data-kind="term"/.test(r));
      const byKey = new Map(termRows.map((r) => [(/ id="(gl-[^"]+)"/.exec(r) || [])[1], r]));
      const slugOf = (t) => 'gl-' + String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const whole = terms.filter((g) => { const r = byKey.get(slugOf(g.term)); return r && dec((/<a [^>]*>([^<]*)<\/a>/.exec(r) || [])[1]) === g.term && words(r, 'gl-rp') === g.plain && words(r, 'gl-rw') === (g.why || null) && words(r, 'gl-ra') === (g.aka || null); });
      check('the HTML: every entry has its row, its name and its kind line', rows.length === 487 && rows.every((r) => /<a [^>]*>[^<]+<\/a>/.test(r) && /<p class="gl-rk">[^<]+<\/p>/.test(r)), rows.length);
      check("the HTML: every term's name, other names, definition and reason, word for word", whole.length === terms.length && termRows.length === terms.length, whole.length + ' of ' + terms.length);
      check('the HTML: the firms, chips and countries carry their definitions', rows.filter((r) => !/data-kind="term"/.test(r) && words(r, 'gl-rp')).length >= 270, rows.filter((r) => !/data-kind="term"/.test(r) && words(r, 'gl-rp')).length);
      const ld = JSON.parse((/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html) || [])[1] || '{}');
      check('the HTML: the head, its canonical, the share card and the set of terms at their entries', /<link rel="canonical" href="https:\/\/chipsupplychain\.org\/glossary\/">/.test(html) && /<meta property="og:url" content="https:\/\/chipsupplychain\.org\/glossary\/">/.test(html) && ld['@type'] === 'DefinedTermSet' && (ld.hasDefinedTerm || []).length === terms.length && ld.hasDefinedTerm.every((x) => /\/glossary\/#gl-/.test(x.url)));
      check('the HTML: no "Open the interactive page", and the home page holds no Glossary', !/Open the interactive page/.test(html) && !/<section class="view[^"]*" data-view="glossary"/.test(await (await fetch(BASE + '/')).text()));
    }

    /* ---------- the old addresses: the home page's, forwarded in place, and the static copy's anchors ---------- */
    t = await open(chrome, G, { width: 1440, wait: 1200 }); await ready(t);
    const len0 = await t.ev('history.length');
    await t.close();
    for (const [from, to, want] of [['/#/glossary', '/glossary/', 'home'], ['/#gl-euv', '/glossary/#gl-euv', 'EUV'], ['/#lk-firm-asml', '/glossary/#lk-firm-asml', 'ASML'], ['/#a-z/firms', '/glossary/#a-z/firms', '226 firms'],
      ['/glossary/#euv', '/glossary/#gl-euv', 'EUV'], ['/glossary/#letter-s', '/glossary/#a-z/s', '487 entries'], ['/glossary/#list-firms', '/glossary/#a-z/firms', '226 firms']]) {
      t = await open(chrome, BASE + from, { width: 1440, wait: 2000 }); await ready(t); await sleep(400);
      const st = await t.ev(`({ at: location.pathname + location.hash, state: ${state}, hw: ${hw}, count: document.getElementById('gl-count').textContent, len: history.length })`);
      const got = st.state === 'home' ? 'home' : st.state === 'entry' ? st.hw : st.count;
      check(`${from} lands on ${to}${from.indexOf('/#') === 0 ? ', in place of the old address' : ''}`, st.at === to && got === want && st.len === len0 && !t.errors.length, st);
      await t.close();
    }
    t = await open(chrome, BASE + '/lithography/', { width: 1440, wait: 1500 });
    check("a chapter's masthead tab goes to /glossary/", (await t.ev("document.querySelector('.tabs a[data-view=\"glossary\"]').getAttribute('href')")) === '../glossary/');
    await t.close();
  } catch (e) { check('the run finished', false, e.message); }
  finally { await chrome.close(); }
  console.log(out.join('\n'));
  console.log(bad ? `${bad} FAILED` : `all ${out.length} checks pass`);
  process.exit(bad ? 1 : 0);
})();
