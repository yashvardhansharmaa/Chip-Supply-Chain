#!/usr/bin/env node
/* Export Controls, the latest rule and the next date (build/latest-rule.js, 21 Nov 2026): the two rows under the head of
   /export-controls/ and of the interactive board (#/controls), read back from the pages in headless Chrome at 1440 and 390 and
   matched to the data files. The expected rows are worked out here from data/export-controls-timeline.json and
   data/control-flows.json alone, never from the build's own code:
     - Latest: the newest entry by date (of two on one day, the later in the file), its date as the board prints dates, its
       actor, its words (the entry's "plain", else its gist), "Latest rule" for a rule and "Latest move" for any other entry,
       and a link that lands on that entry (the static page's anchor; on the board, #/controls/<id> opens and marks it);
     - Next date: the earliest "upcoming" date not in the past on the check's day, never a past one, its label as a sentence,
       the countdown in Coming up's words ("Today", "Tomorrow", "In 7 days") and a link that lands on its entry;
     - with the reader's clock moved (a Date override before the page's scripts): on the next date's own day the row says
       "Today", and on the day after it is gone from both pages while the latest row stays;
     - on a phone, no sideways scroll and no text in the rows under 11.5 px. On the board's phone layout the latest line is
       hidden by design (the owner's mock A, 24 Nov 2026): the upright history strip above it ends on the latest rule, with its
       full title and a link to its entry, and that row is checked in its place.
   A day the build has not caught up with (the next date passed since the last build) fails here as it does in
   qa/scripts/check-dates.js: the bi-weekly upkeep rebuilds the site.
   usage: node qa/redesign/check-latest.js [--base http://127.0.0.1:8804] [--today YYYY-MM-DD] [--out qa/redesign/check-latest.txt] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('base', args[0] && !args[0].startsWith('--') ? args[0] : 'http://127.0.0.1:8804').replace(/\/$/, '');
const OUT = opt('out', path.join(__dirname, 'check-latest.txt'));
const pad = (n) => String(n).padStart(2, '0');
const now = new Date(), TODAY = opt('today', `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
const ROOT = path.join(__dirname, '../..');
const J = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8'));

const lines = []; let fails = 0;
const say = (ok, msg) => { lines.push((ok ? 'ok   ' : 'FAIL ') + msg); console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) fails++; };

// ---------- expected, from the data alone ----------
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dstr = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MON[m - 1]} ${y}`; };
const dayNum = (iso) => { const [y, m, d] = iso.split('-').map(Number); return Date.UTC(y, m - 1, d) / 864e5; };
const addDays = (iso, n) => { const t = new Date((dayNum(iso) + n) * 864e5); return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`; };
const tl = J('export-controls-timeline.json'), events = Array.isArray(tl) ? tl : tl.events;
let newest = null; events.forEach((e) => { if (!newest || e.date >= newest.date) newest = e; }); // ties: the later in the file
const flowsFile = J('control-flows.json');
const curly = (s) => String(s).replace(/'/g, '’'); // the pages set apostrophes curly (keepMarks)
const flat = (s) => curly(s).replace(/\s+/g, ' ').trim();
const expectNext = (day) => (flowsFile.upcoming || []).filter((u) => u.date >= day && u.label).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))[0] || null;
const when = (due, day) => { const n = dayNum(due) - dayNum(day); return n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : 'In ' + n + ' days'; };
const LATEST = { kicker: newest.instrument === 'rule' ? 'Latest rule' : 'Latest move', date: dstr(newest.date), actor: newest.actor || '', words: flat(newest.plain || newest.gist), id: newest.id };
console.log(`check-latest: ${BASE}, today ${TODAY}; newest entry ${newest.id}; next date ${(expectNext(TODAY) || {}).date || 'none'}`);

// what the rows say, read from the page: kicker, date line, the small, the words without the link's, the link and its target
const READ = (sel) => `(function(){var L=document.querySelector(${JSON.stringify(sel)});if(!L)return null;var vis=function(e){var r=e.getBoundingClientRect();return !!(r.width||r.height)&&getComputedStyle(e).display!=='none';};
  return [].map.call(L.children,function(li){var a=li.querySelector('a'),k=li.querySelector('[class$="-k"]'),d=li.querySelector('[class$="-d"]'),s=d&&d.querySelector('small'),t=li.querySelector('[class$="-t"]'),go=li.querySelector('[class$="-go"]');
    var words=t?t.textContent.replace(go?go.textContent:'','').replace(/\\s+/g,' ').trim():'';var date=d?[].filter.call(d.childNodes,function(n){return n.nodeType===3;}).map(function(n){return n.textContent;}).join('').trim():'';
    var fs=[].map.call(li.querySelectorAll('*'),function(e){return e.children.length?99:parseFloat(getComputedStyle(e).fontSize);});
    return {visible:vis(li),hidden:li.hidden,due:li.getAttribute('data-due'),kicker:k?k.textContent.trim():'',date:date,small:s?s.textContent.trim():'',words:words,go:go?go.textContent.replace(/\\s+/g,' ').trim():'',href:a?a.getAttribute('href'):'',h:a?Math.round(a.getBoundingClientRect().height):0,minFont:Math.min.apply(null,fs.concat([99]))};});})()`;

function checkRows(where, rows, day, board, phone) {
  if (!rows) { say(false, `${where}: no latest-rule list`); return; }
  const [L, N] = rows;
  if (board && phone) say(!!L && !L.visible, `${where}: the latest line is hidden on a phone, where the strip ends on the latest rule`);
  else say(!!L && L.visible, `${where}: the latest row shows`);
  if (!L) return;
  say(L.kicker === LATEST.kicker, `${where}: kicker "${L.kicker}" (${LATEST.kicker})`);
  say(L.date === LATEST.date, `${where}: latest date "${L.date}" is the newest entry's (${LATEST.date})`);
  say(L.small === LATEST.actor, `${where}: actor "${L.small}"`);
  say(L.words === LATEST.words, `${where}: latest words are the entry's ${newest.plain ? 'plain words' : 'gist'}`);
  say(!/\bD:\d|\bTPP\b|\d{1,3}(,\d{3}){2,}/.test(L.words), `${where}: latest words carry no codes (D:5, TPP, long figures)`);
  say(L.go === 'Entry in the timeline →' && L.href === (board ? '#/controls/' + LATEST.id : '#' + LATEST.id), `${where}: latest links to its entry (${L.href})`);
  const want = expectNext(day);
  const shown = rows.filter((r) => r.kicker === 'Next date' && r.visible);
  if (!want) { say(!shown.length, `${where}: no next date when none is ahead`); return; }
  say(shown.length === 1, `${where}: one next-date row shows`);
  if (!N) return;
  say(N.visible && N.due === want.date, `${where}: next date ${N.due} is the earliest not yet passed (${want.date})`);
  say(N.due >= day, `${where}: next date ${N.due} is not in the past (${day})`);
  say(N.date === dstr(want.date), `${where}: next date printed "${N.date}"`);
  say(N.small === when(want.date, day), `${where}: countdown "${N.small}" (${when(want.date, day)})`);
  say(N.words === flat(String(want.label).replace(/([^.!?])\s*$/, '$1.')), `${where}: next words are the upcoming label`);
  const ev = want.event ? (board ? '#/controls/' + want.event : '#' + want.event) : null;
  say(!ev || (N.go === 'Entry in the timeline →' && N.href === ev), `${where}: next date links to its entry (${N.href})`);
}

(async () => {
  const chrome = launch();
  try {
    for (const width of [1440, 390]) {
      const phone = width < 768, W = phone ? '390' : '1440';
      // ---------- the static page ----------
      let t = await open(chrome, BASE + '/export-controls/', { width, wait: 1200 });
      const rs = await t.ev(READ('.latest'));
      checkRows(`/export-controls/ ${W}`, rs, TODAY, false);
      say((await t.ev("!!document.querySelector('.ch-head .cta-rows .btn') && !!document.querySelector('.ch-head .cta-rows .latest')")), `/export-controls/ ${W}: the rows sit under the button, in the head`);
      if (!phone) {
        const al = await t.ev("(function(){var n=document.querySelector('.cta-rows .cta-note').getBoundingClientRect().left,t=document.querySelector('.latest-t').getBoundingClientRect().left,b=document.querySelector('.cta-rows .btn').getBoundingClientRect().left,k=document.querySelector('.latest-k').getBoundingClientRect().left;return [Math.round(n-t),Math.round(b-k)];})()");
        say(Math.abs(al[0]) <= 1 && Math.abs(al[1]) <= 1, `/export-controls/ ${W}: the words start on the note's left edge and the kicker under the button (${al.join(', ')} px)`);
      }
      if (rs) for (const r of rs) say(r.minFont >= 11.5, `/export-controls/ ${W}: ${r.kicker} text at ${r.minFont} px or more (11.5)`);
      if (phone) say((await t.ev('document.documentElement.scrollWidth <= innerWidth')), `/export-controls/ ${W}: no sideways scroll`);
      // the latest row's link lands on its entry
      await t.ev("(document.querySelector('.latest a').click(),1)"); await sleep(600);
      const landed = await t.ev(`(function(){var e=document.getElementById(${JSON.stringify(LATEST.id)});if(!e)return 'no entry';var r=e.getBoundingClientRect();return location.hash+' '+(e.matches(':target')?'target':'not target')+' '+(r.top>=0&&r.top<innerHeight?'in view':'out of view');})()`);
      say(landed === `#${LATEST.id} target in view`, `/export-controls/ ${W}: Entry in the timeline lands on the entry (${landed})`);
      await t.close();

      // ---------- the interactive board ----------
      t = await open(chrome, BASE + '/#/controls', { width, wait: 2500 });
      const rb = await t.ev(READ('.view[data-view="controls"] .view-head .cf-latest'));
      checkRows(`#/controls ${W}`, rb, TODAY, true, phone);
      // the history strip: its last mark is the newest entry, links to it, and on a phone shows the entry's whole title
      const sl = await t.ev(`(function(){var m=document.querySelector('.view[data-view="controls"] .ec-m.is-latest');if(!m)return null;var a=m.querySelector('a'),r=m.querySelector('.ec-mt').getBoundingClientRect();return {date:m.getAttribute('data-date'),href:a.getAttribute('href'),text:a.textContent.replace(/\\s+/g,' ').trim(),visible:!!(r.width&&r.height)}})()`);
      say(!!sl && sl.visible && sl.date === newest.date && sl.href === '#/controls/' + LATEST.id, `#/controls ${W}: the strip ends on the latest rule (${sl ? sl.date + ' ' + sl.href : 'no mark'})`);
      if (phone && sl) say(sl.text.indexOf(flat(newest.title)) >= 0, `#/controls ${W}: the strip's latest row carries the whole title`);
      if (rb) for (const r of rb) say(r.minFont >= 11.5, `#/controls ${W}: ${r.kicker} text at ${r.minFont} px or more (11.5)`);
      if (phone) say((await t.ev('document.documentElement.scrollWidth <= innerWidth')), `#/controls ${W}: no sideways scroll`);
      for (const [i, id] of [[0, LATEST.id], [1, (expectNext(TODAY) || {}).event]]) {
        if (!id) continue;
        await t.ev("(location.hash='#/controls',window.scrollTo(0,0),1)"); await sleep(900);
        await t.ev(`(${phone && i === 0 ? "document.querySelector('.ec-m.is-latest a')" : `document.querySelectorAll('.cf-latest a')[${i}]`}.click(),1)`); await sleep(1800);
        const on = await t.ev(`(function(){var e=document.querySelector('.tl-e[data-ev="${id}"]');if(!e)return 'no entry';var r=e.getBoundingClientRect();return location.hash+' '+(e.classList.contains('is-target')?'marked':'not marked')+' '+(r.top>=0&&r.top<innerHeight?'in view':'out of view');})()`);
        say(on === `#/controls/${id} marked in view`, `#/controls ${W}: row ${i + 1} opens its entry (${on})`);
      }
      // the same address again (no hashchange): the click still brings the entry back into view
      await t.ev('(window.scrollTo(0,0),1)'); await sleep(500);
      await t.ev(`(document.querySelector(${JSON.stringify(phone ? '.ec-m.is-latest a' : '.cf-latest a')}).click(),1)`); await sleep(1800);
      const again = await t.ev(`(function(){var e=document.querySelector('.tl-e[data-ev="${LATEST.id}"]');var r=e.getBoundingClientRect();return r.top>=0&&r.top<innerHeight;})()`);
      say(again, `#/controls ${W}: the latest row on its own entry's address scrolls back to the entry`);
      say(!t.errors.length, `#/controls ${W}: no script errors${t.errors.length ? ': ' + t.errors.join(' | ') : ''}`);
      await t.close();
    }

    // ---------- the reader's clock moved: the next date on its day, and the day after ----------
    const nx = expectNext(TODAY);
    if (nx) {
      for (const [day, label] of [[nx.date, 'on the day'], [addDays(nx.date, 1), 'the day after']]) {
        const shift = `(function(){var T=new Date('${day}T10:00:00').getTime()-Date.now();var D=Date;function F(){if(!(this instanceof F))return new D(D.now()+T).toString();var a=[].slice.call(arguments);return a.length?new (Function.prototype.bind.apply(D,[null].concat(a)))():new D(D.now()+T);}F.prototype=D.prototype;F.now=function(){return D.now()+T;};F.UTC=D.UTC;F.parse=D.parse;Date=F;})();`;
        for (const [url, sel] of [['/export-controls/', '.latest'], ['/#/controls', '.view-head .cf-latest']]) {
          const { targetId } = await chrome.send('Target.createTarget', { url: 'about:blank' });
          const { sessionId } = await chrome.send('Target.attachToTarget', { targetId, flatten: true });
          const s = (m, p) => chrome.send(m, p, sessionId);
          await s('Page.enable'); await s('Runtime.enable');
          await s('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
          await s('Page.addScriptToEvaluateOnNewDocument', { source: shift });
          await s('Page.navigate', { url: BASE + url });
          await sleep(3500);
          const r = (await s('Runtime.evaluate', { expression: READ(sel), returnByValue: true })).result.value || [];
          const next = r.find((x) => x.kicker === 'Next date');
          if (label === 'on the day') say(!!next && next.visible && next.small === 'Today', `${url} clock ${day} (${label}): the next date says "${next ? next.small : 'no row'}" (Today)`);
          else say((!next || !next.visible) && r[0] && r[0].visible, `${url} clock ${day} (${label}): the passed date is gone and the latest row stays`);
          await chrome.send('Target.closeTarget', { targetId }).catch(() => {});
        }
      }
    }
  } finally { await chrome.close(); }
  lines.push(fails ? `check-latest: ${fails} failure(s)` : 'check-latest: ok');
  console.log(lines[lines.length - 1]);
  try { fs.writeFileSync(OUT, lines.join('\n') + '\n'); } catch (e) { }
  process.exit(fails ? 1 : 0);
})();
