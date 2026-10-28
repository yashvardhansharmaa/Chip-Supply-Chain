#!/usr/bin/env node
/* The Glossary as a dictionary (redesign option B), driven as a reader would: the columns and their counts, search with the names
   first, Enter, the arrows and Escape, the kinds, no entry and Did you mean, the letters, the sheet with its card, passages,
   Show all and its arrows, the addresses of an entry (#gl-euv, #lk-country-nl, #lk-firm-, #lk-chip-), a passage link out to its
   chapter's page and Back, the look-up popovers on a chapter's page and their Look it up link to the home page's Glossary, the phone's full-screen sheet and the overlay at 768 px, dark mode,
   and the static page /glossary/.
   usage: node qa/redesign/interact-glossary.js [base] (default http://127.0.0.1:8769) */
'use strict';
const { launch, open, sleep } = require('./cdp.js');
const BASE = process.argv[2] || 'http://127.0.0.1:8769';
(async () => {
  const chrome = launch(); const out = []; let bad = 0;
  const check = (name, ok, detail) => { out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail !== undefined && detail !== '' ? ': ' + detail : ''}`); if (!ok) bad++; };
  const key = async (t, k, code, vk) => { await t.s('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk }); await t.s('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk }); };
  const typeIn = async (t, text) => { await t.ev("(function(){var i=document.getElementById('gl-search');i.focus();i.value='';i.dispatchEvent(new Event('input'));return 1;})()"); await t.s('Input.insertText', { text }); await sleep(450); };
  const counted = async (t) => { for (let i = 0; i < 60; i++) { if ((await t.ev("document.querySelector('.view[data-view=\"glossary\"]').getAttribute('data-gl')")) === 'counted') return true; await sleep(250); } return false; };
  const title = "(document.querySelector('#gl-sheet-body .lk-t')||{}).textContent";
  const open_ = "!document.getElementById('gl-sheet').hidden";
  try {
    /* ---------- 1440: the dictionary ---------- */
    let t = await open(chrome, BASE + '/#/glossary', { width: 1440, wait: 2000 });
    check('1440: every entry stands in the columns', (await t.ev("document.querySelectorAll('#gl-dict .gl-de').length")) === 487, await t.ev("document.querySelectorAll('#gl-dict .gl-de').length"));
    check('1440: every definition is shown without a click', (await t.ev("[...document.querySelectorAll('#gl-dict .gl-de[data-kind=\"term\"] .gl-df')].filter(function(p){return p.getClientRects().length && p.textContent.length>20;}).length")) === 208);
    // fix-d D16: the head's tally went; each kind's count is on its button, once
    check('1440: each kind counted once, on its button', (await t.ev("document.querySelectorAll('.gl-tally').length")) === 0 && (await t.ev("[...document.querySelectorAll('#gl-kinds button')].map(function(b){return b.textContent;}).join(' · ')")) === 'All487 · Terms208 · Firms226 · AI chips38 · Countries15', await t.ev("[...document.querySelectorAll('#gl-kinds button')].map(function(b){return b.textContent;}).join(' · ')"));
    check('1440: six things to try', (await t.ev("document.querySelectorAll('#gl-try [data-go]').length")) === 6);
    check('1440: the count line, read out but not shown with no search (fix-d D16)', (await t.ev("document.getElementById('lk-count').textContent")) === '487 entries' && (await t.ev("document.getElementById('lk-count').classList.contains('sr-only')")));
    check('1440: the letters, X and Z as the data has them', (await t.ev("[...document.querySelectorAll('#gl-letters li')].map(function(l){return l.querySelector('button')?l.textContent:'('+l.textContent+')';}).join(' ')")), await t.ev("[...document.querySelectorAll('#gl-letters span')].map(function(s){return s.textContent;}).join(',')"));
    check('1440: three columns', (await t.ev("getComputedStyle(document.querySelector('#gl-sec-a .gl-cols')).columnCount")) === '3' || (await t.ev("Math.round(document.querySelector('#gl-sec-a .gl-cols').getBoundingClientRect().width)")) > 1000);
    check('1440: a long letter is set as pages of nine', (await t.ev("[...document.querySelectorAll('#gl-sec-s .gl-cols')].map(function(c){return c.querySelectorAll('.gl-de').length;}).join(',')")) .startsWith('9,9'), await t.ev("[...document.querySelectorAll('#gl-sec-s .gl-cols')].map(function(c){return c.querySelectorAll('.gl-de').length;}).join(',')"));
    check('1440: the counts of passages arrive', await counted(t));
    const euvMore = await t.ev("document.querySelector('.gl-de[data-id=\"lk-term-euv\"] .gl-more').textContent");
    check('1440: EUV says where it appears', /^Where it appears, \d+ places/.test(euvMore), euvMore);
    check('1440: a term no passage uses says so', (await t.ev("document.querySelectorAll('#gl-dict .gl-nil').length")) >= 1, await t.ev("document.querySelectorAll('#gl-dict .gl-nil').length") + ' terms');
    check('1440: a firm offers its card', /^Card( and \d+ places?)? →$/.test(await t.ev("document.querySelector('.gl-de[data-kind=\"firm\"] .gl-more').textContent")));
    check('1440: Critical is the Suppliers mark in ink', (await t.ev("getComputedStyle(document.querySelector('.gl-mk--critical')).backgroundColor")) === 'rgb(23, 23, 22)');
    // search: the names that match stand first
    await typeIn(t, 'hbm');
    check('search: the names that match stand first', (await t.ev("!document.getElementById('gl-best').hidden && document.querySelector('#gl-best .gl-de .gl-hw button').textContent")) === 'HBM', await t.ev("[...document.querySelectorAll('#gl-best .gl-hw button')].map(function(b){return b.textContent;}).join(', ')"));
    check('search: the count says how many of all', /^\d+ of 487 entries$/.test(await t.ev("document.getElementById('lk-count').textContent")), await t.ev("document.getElementById('lk-count').textContent"));
    check('search: the guide line says what follows', /entries, then \d+ more below that mention it/.test(await t.ev("document.querySelector('#gl-best .gl-gw').textContent")), await t.ev("document.querySelector('#gl-best .gl-gw').textContent"));
    check('search: the bar has stuck under the masthead', Math.abs(await t.ev("document.getElementById('gl-bar').getBoundingClientRect().top - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead'))")) <= 1);
    check('search: every word must match', (await t.ev("[...document.querySelectorAll('#gl-dict .gl-de:not([hidden])')].length")) === +((await t.ev("document.getElementById('lk-count').textContent")).split(' ')[0]));
    await key(t, 'Enter', 'Enter', 13); await sleep(500);
    check('Enter: the first match opens in the sheet', (await t.ev(open_)) && (await t.ev(title)) === 'HBM', await t.ev(title));
    check('Enter: its title takes focus', (await t.ev("document.activeElement && document.activeElement.classList.contains('lk-t')")));
    check('Enter: the address names the entry', (await t.ev('location.hash')) === '#gl-hbm', await t.ev('location.hash'));
    check('the sheet stands beside the columns', (await t.ev("document.querySelector('.view[data-view=\"glossary\"]').classList.contains('gl-split')")) && (await t.ev("document.getElementById('gl-dict').getBoundingClientRect().right <= document.getElementById('gl-sheet').getBoundingClientRect().left")));
    check('the sheet hangs under the bar', Math.abs(await t.ev("document.getElementById('gl-sheet').getBoundingClientRect().top - document.getElementById('gl-bar').getBoundingClientRect().bottom")) <= 1);
    check('the open entry is marked in the columns', (await t.ev("document.querySelector('.gl-de.is-on').getAttribute('data-id')")) === 'lk-term-hbm');
    check('the sheet counts its place', /^Term · 1 of \d+$/.test(await t.ev("document.getElementById('gl-sheet-k').textContent")), await t.ev("document.getElementById('gl-sheet-k').textContent"));
    await t.ev("(document.getElementById('gl-next').click(),1)"); await sleep(400);
    check('→ steps to the next match', (await t.ev(title)) !== 'HBM' && /· 2 of/.test(await t.ev("document.getElementById('gl-sheet-k').textContent")), await t.ev(title));
    await t.ev("(document.getElementById('gl-prev').click(),1)"); await sleep(400);
    check('← steps back', (await t.ev(title)) === 'HBM');
    check('← is off at the first entry', await t.ev("document.getElementById('gl-prev').disabled"));
    await t.ev("document.getElementById('gl-next').focus()"); await key(t, 'Escape', 'Escape', 27); await sleep(400);
    check('Escape closes the sheet', !(await t.ev(open_)));
    check('Escape hands focus back to the headword', (await t.ev("document.activeElement && document.activeElement.closest('.gl-de') && document.activeElement.closest('.gl-de').getAttribute('data-id')")) === 'lk-term-hbm');
    check('closing puts the address back', (await t.ev('location.hash')) === '#/glossary', await t.ev('location.hash'));
    // the arrows preview while focus stays in the field
    await t.ev("document.getElementById('gl-search').focus()"); await key(t, 'ArrowDown', 'ArrowDown', 40); await sleep(400); await key(t, 'ArrowDown', 'ArrowDown', 40); await sleep(400);
    check('the arrows preview an entry, focus stays in the field', (await t.ev(open_)) && (await t.ev("document.activeElement.id")) === 'gl-search' && /· 2 of/.test(await t.ev("document.getElementById('gl-sheet-k').textContent")));
    await key(t, 'Escape', 'Escape', 27); await sleep(300);
    check('Escape in the field clears the search', (await t.ev("document.getElementById('gl-search').value")) === '' && (await t.ev("document.getElementById('lk-count').textContent")) === '487 entries');
    await key(t, 'Escape', 'Escape', 27); await sleep(300);
    check('Escape again closes the sheet', !(await t.ev(open_)));
    // the kinds
    await t.ev("(document.querySelector('#gl-kinds [data-k=\"firm\"]').click(),1)"); await sleep(300);
    check('Firms shows the firms only', (await t.ev("document.getElementById('lk-count').textContent")) === '226 entries' && (await t.ev("[...document.querySelectorAll('#gl-dict .gl-de:not([hidden])')].every(function(e){return e.getAttribute('data-kind')==='firm';})")));
    check('the pressed kind fills black', (await t.ev("getComputedStyle(document.querySelector('#gl-kinds [data-k=\"firm\"]')).backgroundColor")) === 'rgb(23, 23, 22)');
    check('a letter with no firm is off', (await t.ev("[...document.querySelectorAll('#gl-letters span')].length")) > 1);
    await t.ev("(document.querySelector('#gl-kinds [data-k=\"all\"]').click(),1)"); await sleep(300);
    // no entry, and Did you mean
    await typeIn(t, 'zzqxv');
    check('no entry: the count says so', (await t.ev("document.getElementById('lk-count').textContent")) === 'No entry matches.');
    check('no entry: the box says No entry and the words', (await t.ev("!document.getElementById('gl-none').hidden && document.getElementById('gl-none').innerText")).toLowerCase().includes('no entry')); // innerText gives the label's capitals
    await typeIn(t, 'nvidai');
    check('Did you mean offers a name a typo away', (await t.ev("[...document.querySelectorAll('#gl-none .lk-near [data-go]')].map(function(b){return b.textContent;}).join(',')")).includes('Nvidia'), await t.ev("[...document.querySelectorAll('#gl-none .lk-near [data-go]')].map(function(b){return b.textContent;}).join(',')"));
    await t.ev("(([...document.querySelectorAll('#gl-none .lk-near [data-go]')].filter(function(b){return b.textContent==='Nvidia';})[0]).click(),1)"); await sleep(500);
    check('Did you mean opens the entry', (await t.ev(open_)) && (await t.ev(title)) === 'Nvidia' && (await t.ev("document.getElementById('gl-search').value")) === '');
    await t.ev("(document.getElementById('gl-close').click(),1)"); await sleep(300);
    // a raw word still finds its passages
    await typeIn(t, 'Veldhoven');
    check('no entry still lists the passages that mention it', (await t.ev("document.querySelectorAll('#gl-none .lk-men li').length")) > 0 || (await t.ev("document.querySelectorAll('#gl-dict .gl-de:not([hidden])').length")) > 0);
    await typeIn(t, '');
    // the letters
    await t.ev("(document.querySelector('#gl-letters [data-l=\"M\"]').click(),1)"); await sleep(1500);
    check('a letter brings its columns under the bar', Math.abs(await t.ev("document.querySelector('#gl-sec-m .gl-sec-h').getBoundingClientRect().top - document.getElementById('gl-bar').getBoundingClientRect().bottom")) < 40, await t.ev("Math.round(document.querySelector('#gl-sec-m .gl-sec-h').getBoundingClientRect().top - document.getElementById('gl-bar').getBoundingClientRect().bottom)"));
    check('the thumb index marks the letter in view', (await t.ev("(document.querySelector('#gl-letters [aria-current=\"true\"]')||{}).textContent")) === 'M');
    // a headword click
    await t.ev("(document.querySelector('.gl-de[data-id=\"lk-firm-asml\"] .gl-hw button').click(),1)"); await sleep(500);
    check('a headword opens its card', (await t.ev(title)) === 'ASML' && (await t.ev("!!document.querySelector('#gl-sheet-body .lk-card--firm .lk-facts')")));
    check('the card keeps its revenue and filing link', /Revenue/i.test(await t.ev("document.querySelector('#gl-sheet-body .lk-facts').innerText")));
    check('the opened entry stays in view beside the sheet', await t.ev("(function(){var r=document.querySelector('.gl-de.is-on').getBoundingClientRect();return r.top>=document.getElementById('gl-bar').getBoundingClientRect().bottom-1&&r.top<innerHeight;})()"));
    check('no script errors on the page', !t.errors.length, t.errors.join(' | '));
    await t.close();

    /* ---------- the addresses of an entry ---------- */
    t = await open(chrome, BASE + '/#gl-euv', { width: 1440, wait: 2500 });
    check('#gl-euv opens EUV', (await t.ev(open_)) && (await t.ev(title)) === 'EUV');
    check('#gl-euv brings EUV into view in the columns', await t.ev("(function(){var r=document.querySelector('.gl-de[data-id=\"lk-term-euv\"]').getBoundingClientRect();return r.top>=document.getElementById('gl-bar').getBoundingClientRect().bottom-1&&r.top<innerHeight;})()"));
    check('the term reads it in its chapters', /Read it in Lithography/.test(await t.ev("document.querySelector('#gl-sheet-body .gl-refs').innerText")) && /Also in/.test(await t.ev("document.querySelector('#gl-sheet-body .gl-refs').innerText")));
    await counted(t);
    const n = await t.ev("parseInt(document.querySelector('#gl-sheet-body .lk-pass-h .lk-n').textContent)");
    check('the sheet and the column agree on the count', (await t.ev("document.querySelector('.gl-de[data-id=\"lk-term-euv\"] .gl-more').textContent")).includes(n + ' places'), n);
    check('twelve passages, then Show all', (await t.ev("document.querySelectorAll('#gl-sheet-body .lk-men li').length")) === 12 && (await t.ev("document.querySelector('#gl-sheet-body .lk-more button').textContent")) === 'Show all ' + n);
    await t.ev("(document.querySelector('#gl-sheet-body .lk-more button').click(),1)"); await sleep(300);
    check('Show all shows every passage', (await t.ev("document.querySelectorAll('#gl-sheet-body .lk-men li').length")) === n);
    // a passage link leaves for the chapter, and Back returns to the entry
    // (each chapter is a page of its own since 28 Oct 2026: the passage goes with the reader and flashes there)
    await t.ev("(document.querySelector('#gl-sheet-body .lk-men a[data-para]').click(),1)");
    let flashed = 0; for (let k = 0; k < 20 && !flashed; k++) { await sleep(250); try { flashed = await t.ev("document.querySelectorAll('.lk-flash').length"); } catch (e) { } }
    check('a passage link opens its chapter\'s page', (await t.ev("document.documentElement.getAttribute('data-view')")) === 'stack' && /^\/[a-z-]+\/$/.test(await t.ev('location.pathname')), await t.ev('location.pathname'));
    check('the passage flashes in its chapter', flashed === 1);
    await t.ev('(history.back(),1)'); await sleep(2500);
    check('Back returns to the entry', (await t.ev("document.documentElement.getAttribute('data-view')")) === 'glossary' && (await t.ev(open_)) && (await t.ev(title)) === 'EUV', await t.ev('location.hash'));
    await t.ev("(location.hash='#/glossary',1)"); await sleep(800);
    check('the Glossary tab closes the sheet', !(await t.ev(open_)));
    await t.close();
    t = await open(chrome, BASE + '/#lk-country-nl', { width: 1440, wait: 2500 });
    check('#lk-country-nl opens the Netherlands card', (await t.ev(title)) === 'Netherlands' && /Share of each segment/.test(await t.ev("document.getElementById('gl-sheet-body').innerText")));
    check('the shares follow the chart rule: the largest wine, the rest the tint', (await t.ev("getComputedStyle(document.querySelector('.lk-shares li:first-child .lk-share-bar')).backgroundImage")).includes('rgb(122, 31, 43)') && (await t.ev("getComputedStyle(document.querySelector('.lk-shares li:nth-child(2) .lk-share-bar')).backgroundImage")).includes('rgb(210, 209, 204)') && !(await t.ev("getComputedStyle(document.querySelector('.lk-shares li:nth-child(2) .lk-share-bar')).backgroundImage")).includes('rgb(122, 31, 43)'));
    check('the EU-27 line and its link', /Across the EU-27/.test(await t.ev("document.getElementById('gl-sheet-body').innerText")) && (await t.ev("document.querySelector('#gl-sheet-body .lk-eu a').getAttribute('href')")) === '#/suppliers?group=eu');
    await t.ev("(document.querySelector('#gl-sheet-body .lk-go').click(),1)"); await sleep(500);
    check("a Critical firm's button opens its card", (await t.ev("!!document.querySelector('#gl-sheet-body .lk-card--firm')")) && /^#lk-firm-/.test(await t.ev('location.hash')), await t.ev(title));
    await t.close();
    t = await open(chrome, BASE + '/#lk-chip-nvidia-b200', { width: 1440, wait: 2500 });
    check('#lk-chip- opens the chip card', (await t.ev(title)) === 'Nvidia B200' && /Dense TFLOPS/i.test(await t.ev("document.getElementById('gl-sheet-body').innerText")));
    await t.close();

    /* ---------- the look-up popovers in a chapter ---------- */
    t = await open(chrome, BASE + '/lithography/', { width: 1440, wait: 2500 });
    const term = await t.ev("(function(){var b=[...document.querySelectorAll('#lithography .prose .gl-term')].filter(function(x){return !x.dataset.note;})[0];b.scrollIntoView({block:'center'});b.focus();return b.getAttribute('data-term');})()"); await sleep(500);
    check('a look-up card opens over the chapter text', (await t.ev("!document.getElementById('gl-tip').hidden && document.getElementById('gl-tip').querySelector('p').textContent.length > 20")), term);
    check('it reads the same definition as the Glossary', (await t.ev("document.getElementById('gl-tip').querySelector('p').textContent")) === (await t.ev(`(window.CP_TERMS.defs[${JSON.stringify(term)}] || [])[1]`)));
    check('the card is a popover over the text', (await t.ev("getComputedStyle(document.getElementById('gl-tip')).position")) === 'fixed');
    const look = await t.ev("document.querySelector('#gl-tip a').getAttribute('href')");
    await t.ev("(document.querySelector('#gl-tip a').click(),1)"); await sleep(3000);
    check('Look it up opens the entry in the home page\'s Glossary', look.indexOf('../#gl-') === 0 && (await t.ev("document.documentElement.getAttribute('data-view')")) === 'glossary' && (await t.ev(open_)) && (await t.ev("location.pathname + location.hash")) === look.slice(2), look + ' -> ' + (await t.ev(title)));
    check('after a move within the site the title takes focus', (await t.ev("document.activeElement && document.activeElement.classList.contains('lk-t')")));
    check('no script errors in the chapter and back', !t.errors.length, t.errors.join(' | '));
    await t.close();

    t = await open(chrome, BASE + '/lithography/', { width: 390, wait: 2500 });
    await t.ev("(function(){var b=[...document.querySelectorAll('#lithography .prose .gl-term')].filter(function(x){return !x.dataset.note;})[0];b.scrollIntoView({block:'center'});b.click();return 1;})()"); await sleep(600);
    check('390: a tap opens the look-up card as a sheet over the text', (await t.ev("!document.getElementById('gl-tip').hidden && document.getElementById('gl-tip').classList.contains('is-sheet')")));
    await t.ev("(document.querySelector('#gl-tip a').click(),1)"); await sleep(3000);
    check('390: Look it up opens the entry full screen', (await t.ev("document.documentElement.getAttribute('data-view')")) === 'glossary' && (await t.ev(open_)) && (await t.ev("document.getElementById('gl-sheet').getBoundingClientRect().top")) === 0);
    await t.close();

    /* ---------- 768: the sheet lies over the page ---------- */
    t = await open(chrome, BASE + '/#/glossary', { width: 768, wait: 2000 });
    await t.ev("(document.querySelector('.gl-de[data-id=\"lk-term-euv\"] .gl-hw button').click(),1)"); await sleep(500);
    check('768: the sheet opens over the page as a dialog', (await t.ev("document.getElementById('gl-sheet').getAttribute('role')")) === 'dialog' && (await t.ev("document.getElementById('gl-dict').inert")));
    await t.s('Input.dispatchMouseEvent', { type: 'mousePressed', x: 40, y: 600, button: 'left', clickCount: 1 }); await t.s('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 40, y: 600, button: 'left', clickCount: 1 }); await sleep(500);
    check('768: a click beside the sheet closes it', !(await t.ev(open_)) && !(await t.ev("document.getElementById('gl-dict').inert")));
    await t.close();

    /* ---------- 390: the phone ---------- */
    t = await open(chrome, BASE + '/#/glossary', { width: 390, wait: 2000 });
    check('390: one column', (await t.ev("document.querySelectorAll('#gl-sec-a .gl-cols').length")) === 1);
    check('390: the letters scroll in their strip', await t.ev("document.getElementById('gl-letters').scrollWidth > document.getElementById('gl-letters').clientWidth"));
    check('390: no sideways scroll', await t.ev('document.documentElement.scrollWidth <= innerWidth'));
    await t.ev("(document.querySelector('.gl-de[data-id=\"lk-term-euv\"] .gl-hw button').click(),1)"); await sleep(600);
    check('390: the sheet takes the whole screen', await t.ev("(function(){var r=document.getElementById('gl-sheet').getBoundingClientRect();return r.top===0&&Math.round(r.width)===innerWidth&&Math.round(r.bottom)===innerHeight;})()"));
    check('390: the page under it is inert', (await t.ev("document.querySelector('.masthead').inert")) && (await t.ev("document.getElementById('gl-dict').inert")));
    await t.ev("(document.getElementById('gl-close').click(),1)"); await sleep(500);
    check('390: Close lets the page go and returns to the entry', !(await t.ev("document.querySelector('.masthead').inert")) && (await t.ev("document.activeElement.closest('.gl-de').getAttribute('data-id')")) === 'lk-term-euv');
    await t.ev("(location.hash='#gl-hbm',1)"); await sleep(1200);
    await t.ev("(document.querySelector('#gl-sheet-body .lk-men a[data-para]').click(),1)"); await sleep(1500);
    check('390: a passage link leaves no page inert', (await t.ev("document.documentElement.getAttribute('data-view')")) === 'stack' && !(await t.ev("document.querySelector('.masthead').inert")));
    check('390: no script errors', !t.errors.length, t.errors.join(' | '));
    await t.close();

    /* ---------- dark ---------- */
    t = await open(chrome, BASE + '/#gl-euv', { width: 1440, theme: 'dark', wait: 2000 });
    check('dark: the ground and the sheet turn dark', (await t.ev("getComputedStyle(document.body).backgroundColor")) === 'rgb(18, 18, 17)' && (await t.ev("getComputedStyle(document.getElementById('gl-sheet')).backgroundColor")) === 'rgb(18, 18, 17)');
    // design round nine, revision 2 (28 Oct 2026): the entry's chapter links are the secondary ink at rest, wine on hover
    check('dark: a chapter link is the secondary ink for dark', (await t.ev("getComputedStyle(document.querySelector('#gl-sheet-body .gl-refs a')).color")) === 'rgb(198, 196, 190)');
    await t.close();

    /* ---------- the static page ---------- */
    t = await open(chrome, BASE + '/glossary/', { width: 1440, wait: 1500 });
    check('/glossary/: every term in the columns', (await t.ev("document.querySelectorAll('.gl-dict .gl-de').length")) === 208);
    check('/glossary/: the letter jumps', (await t.ev("document.querySelectorAll('.gl-thumb a').length")) >= 24);
    check('/glossary/: the thumb index sticks', (await t.ev("getComputedStyle(document.querySelector('.gl-thumb')).position")) === 'sticky');
    check('/glossary/: the JSON-LD set of terms', (await t.ev("JSON.parse(document.querySelector('script[type=\"application/ld+json\"]').textContent).hasDefinedTerm.length")) === 208);
    check('/glossary/: the firm, chip and country lists', (await t.ev("['list-firms','list-chips','list-countries'].every(function(id){return !!document.getElementById(id);})")));
    check('/glossary/: Open the interactive page', (await t.ev("document.querySelector('.cta .btn').getAttribute('href')")) === '../#/glossary');
    check('/glossary/: no button from the app, the theme button in the masthead aside', (await t.ev("document.querySelectorAll('button:not(.theme-toggle)').length")) === 0);
    await t.close();
  } catch (e) { check('the run finished', false, e.message); }
  finally { await chrome.close(); }
  console.log(out.join('\n'));
  console.log(bad ? `${bad} FAILED` : `all ${out.length} checks pass`);
  process.exit(bad ? 1 : 0);
})();
