#!/usr/bin/env node
/* Each chapter at its own address (28 Oct 2026, qa/redesign-perchapter/BRIEF.md in the main checkout). Until then the home page
   held every chapter, switched by the hash (/#lithography), and /<id>/ was a static readable copy. Now /<id>/ is the full
   interactive chapter and the home page holds none. This checks, on a local preview and in the built dist/:
   1. every chapter's page is the whole chapter, driven as a reader would at 1440: the masthead's search and theme; the rail
      with Hide contents, the chain with its four-bar meters and the figures list; the live specimen in its slot, which a drag
      turns; the card with its meter; a look-up pop-up; a figure's Cite, Table, CSV and PNG, and Table opening; the cite line's
      Cite this chapter and Chapter PDF (served); an animation's step seeking the video; a flashcard turning; the sources; and
      Next going to the next chapter's address. At 390 in dark mode: the theme, the strip's live drawing, no sideways scroll;
   2. the home page, and every page but a chapter's own and the print-only book, carries none of that chapter's prose: no
      paragraph or list item of its text (40 characters or more) appears in their HTML. The prose is the body's text: the
      card's lines (which /summary/ sets beside each other), the flashcards (whose lines the Glossary's entries share), the
      figures and the source list are other parts, and each is looked at by the checks of its own page;
   3. each old hash link (the chapter, a section, a figure, its citation, its flashcards, #/geopolitics, ?only=, a merged
      chapter's address) lands on the right page at the right place, in place of the old entry (no history entry added);
   4. search, from the home page and from a chapter's page, returns a chapter's result that opens its page;
   5. each chapter page's weight: its HTML, and with the shared files it loads, against the home page of 28 Oct that held
      every chapter (4,661,341 bytes);
   6. the contents page at its own address, /supply-chain/ (the owner, 28 Oct): the whole page (its title, the downloads, the
      standfirst, a row per chapter linking its page, the Supply Chain tab current), each row opening its chapter's page; the
      old addresses forwarding to it (/#/chain, #/stack, #/sources, #contents, /chain/) without a history entry; its head; and
      the sitemap listing it, and each chapter page, once.
   usage: node qa/redesign/check-perchapter.js [base] (default http://127.0.0.1:8779) > qa/redesign/check-perchapter.txt
   Nothing leaves this machine but the font requests (qa/redesign/cdp.js resolves every other host to nothing). */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const BASE = (process.argv[2] || 'http://127.0.0.1:8779').replace(/\/$/, '');
const root = path.resolve(__dirname, '..', '..'), dist = path.join(root, 'dist');
const PT = require('../../build/page-text.js');
const STAGES = require('../../build/stages.js');
const RETIRED = require('../../build/retired-chapters.js');
const OLD_HOME = 4661341; // dist/index.html at 5428ddb, the last build with every chapter in it

const out = []; let bad = 0, n = 0;
const check = (name, ok, detail) => { n++; out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail != null && detail !== '' ? ': ' + detail : ''}`); if (!ok) bad++; };
const chapters = STAGES.fromContent(root); // { id, number, stage }, in reading order
const read = (f) => fs.readFileSync(f, 'utf8');
const kb = (b) => (b / 1024).toFixed(0) + ' KB';

(async () => {
  /* ---------- 2. no chapter's prose on any other page ---------- */
  {
    const norm = (t) => t.replace(/\s+/g, ' ').trim();
    const textOfPage = (html) => norm(PT.decode(html.replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<sup class="cite[^"]*">[\s\S]*?<\/sup>/g, '').replace(/<[^>]+>/g, '')));
    const pages = fs.readdirSync(dist).filter((d) => fs.existsSync(path.join(dist, d, 'index.html'))).map((d) => ['/' + d + '/', path.join(dist, d, 'index.html')]).concat([['/', path.join(dist, 'index.html')]]);
    const texts = new Map(pages.map(([p, f]) => [p, textOfPage(read(f))]));
    let paras = 0;
    for (const c of chapters) {
      const art = PT.all(PT.parse(read(path.join(dist, c.id, 'index.html')))).find((x) => x.tag === 'article');
      const prose = art && PT.all(art).find((x) => PT.hasClass(x, 'prose'));
      const other = (x) => x.tag === 'figure' || x.tag === 'nav' || ['plate', 'review', 'chapter-sources'].some((k) => PT.hasClass(x, k));
      const own = prose ? PT.all(prose).filter((x) => (x.tag === 'p' || x.tag === 'li') && !PT.closest(x, other)).map((x) => norm(PT.textContent(PT.without(x, (k) => k.tag === 'sup')))).filter((t) => t.length >= 40) : [];
      paras += own.length;
      const found = [];
      for (const [p, t] of texts) {
        if (p === '/' + c.id + '/' || p === '/book/') continue;
        const hits = own.filter((x) => t.includes(x));
        if (hits.length) found.push(`${p} (${hits.length}, "${hits[0].slice(0, 50)}…")`);
      }
      check(`${c.id}: no other page carries its prose (${own.length} paragraphs and items)`, own.length > 10 && !found.length, found.join('; '));
    }
    const home = read(path.join(dist, 'index.html'));
    check('the home page holds no chapter article', !/<article class="chapter[^"]*" id="/.test(home));
    out.push(`     ${paras} paragraphs and list items of chapter prose looked for in ${pages.length - 1} pages (the book, which holds them all for print, aside)`);
  }

  /* ---------- 5. weights ---------- */
  {
    const assetSize = (u) => { const f = path.join(dist, u.replace(/^(\.\.\/)+/, '').replace(/\?.*$/, '')); return fs.existsSync(f) ? fs.statSync(f).size : 0; };
    const loads = (html) => [...html.matchAll(/<(?:script|link)\b[^>]*\s(?:src|href)="((?:\.\.\/)?assets\/[^"]+)"/g)].map((m) => m[1]);
    const home = read(path.join(dist, 'index.html')), homeAssets = loads(home);
    const homeTotal = home.length + homeAssets.reduce((a, u) => a + assetSize(u), 0);
    out.push(`     weights (bytes on disk, before compression; fonts, media and the search index, fetched when the search opens, aside):`);
    out.push(`     the home page of 28 Oct, every chapter inlined: ${kb(OLD_HOME)}`);
    out.push(`     the home page now: ${kb(Buffer.byteLength(home))} of HTML, ${kb(homeTotal)} with ${homeAssets.map((u) => path.basename(u.replace(/\?.*$/, ''))).join(', ')}`);
    let first = null;
    for (const c of chapters) {
      const html = read(path.join(dist, c.id, 'index.html')), as = loads(html), size = Buffer.byteLength(html), total = size + as.reduce((a, u) => a + assetSize(u), 0);
      if (!first) { first = as.map((u) => `${path.basename(u.replace(/\?.*$/, ''))} ${kb(assetSize(u))}`).join(', '); out.push(`     the shared files a chapter page loads: ${first}`); }
      out.push(`     /${c.id}/: ${kb(size)} of HTML, ${kb(total)} with the shared files (${(total / OLD_HOME * 100).toFixed(0)}% of the old home page)`);
      check(`${c.id}: the page is small (under 300 KB of HTML, under half the old home page with its files)`, size < 300 * 1024 && total < OLD_HOME / 2, `${kb(size)}, ${kb(total)}`);
    }
  }

  const chrome = launch();
  try {
    /* ---------- 1. every chapter's page, at 1440 ---------- */
    for (let i = 0; i < chapters.length; i++) {
      const c = chapters[i], next = chapters[i + 1], id = c.id, W = `${id} 1440`;
      const t = await open(chrome, BASE + '/' + id + '/', { width: 1440, wait: 2500 });
      const S = await t.ev(`(function () {
        var a = document.getElementById(${JSON.stringify(id)}), q = function (s) { return a ? a.querySelector(s) : null; }, vis = function (e) { return !!e && e.getClientRects().length > 0; };
        var figs = a ? a.querySelectorAll('.prose .figure').length : -1, meta = a ? [].map.call(a.querySelectorAll('.ch-meta .label'), function (l) { return l.textContent; }).join('|') : '';
        return { path: location.pathname, articles: [].map.call(document.querySelectorAll('article.chapter'), function (x) { return x.id; }).join(),
          search: vis(document.querySelector('.masthead .search-btn')), theme: vis(document.querySelector('.masthead .theme-toggle')),
          hide: vis(q('.ch-rail .rail-hide')), meters: a ? a.querySelectorAll('.ch-rail .rail-chain.chain-track .meter').length : 0, across: a ? a.querySelectorAll('.ch-rail .rail-across li').length : 0,
          figs: figs, figList: a ? a.querySelectorAll('.ch-rail .rail-figs li').length : 0,
          canvas: !!q('.ch-spec-draw canvas#stage-canvas'), specimen: CP.Stage.cur && CP.Stage.cur.name, wants: a && a.getAttribute('data-specimen'),
          card: vis(q('.prose > .plate')), cardMeter: !!q('.prose > .plate .meter'),
          cite: !!q('.ch-cite-line .ch-cite-btn'), pdf: (q('.ch-cite-line .ch-cite-pdf') || { getAttribute: function () { return ''; } }).getAttribute('href'),
          sources: a ? a.querySelectorAll('#' + a.id + '--sources li').length : 0, said: +((/(?:^|\\|)(\\d+) sources(?:\\||$)/.exec(meta) || [])[1] || 0),
          deck: !!q('.fc .fc-show'), anim: !!q('.figure--anim video'), door: (q('.prevnext .next') || { getAttribute: function () { return ''; } }).getAttribute('href') };
      })()`);
      check(`${W}: the page is its chapter alone`, S.path === '/' + id + '/' && S.articles === id, `${S.path} ${S.articles}`);
      check(`${W}: the masthead with search and theme`, S.search && S.theme);
      check(`${W}: the rail with Hide contents, the chain's ${chapters.filter((x) => x.stage).length} four-bar meters and the chapters across it, and the figures list`, S.hide && S.meters === chapters.filter((x) => x.stage).length && S.across === chapters.filter((x) => !x.stage).length && S.figList === S.figs, JSON.stringify({ hide: S.hide, meters: S.meters, across: S.across, figs: S.figs, listed: S.figList }));
      check(`${W}: the live specimen in its slot`, S.canvas && S.specimen === S.wants, `${S.specimen} (wants ${S.wants})`);
      // a drag turns it
      const yaw0 = await t.ev('CP.Stage.userYaw');
      const box = await t.ev(`(function () { var c = document.querySelector('.ch-spec-draw canvas'); document.documentElement.style.scrollBehavior = 'auto'; c.scrollIntoView({ block: 'center' }); var r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
      await sleep(300);
      await t.s('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x, y: box.y });
      await t.s('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x, y: box.y, button: 'left', clickCount: 1 });
      for (let k = 1; k <= 6; k++) await t.s('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x + k * 20, y: box.y, button: 'left', buttons: 1 });
      await t.s('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x + 120, y: box.y, button: 'left', clickCount: 1 });
      const yaw1 = await t.ev('CP.Stage.userYaw');
      check(`${W}: a drag turns the specimen`, Math.abs(yaw1 - yaw0) > 0.1, `${yaw0.toFixed(2)} to ${yaw1.toFixed(2)}`);
      if (c.stage) check(`${W}: the chokepoint card with its meter`, S.card && S.cardMeter);
      // a look-up pop-up
      const tip = await t.ev(`(function () { var b = document.querySelector('#${id} .prose .gl-term:not([data-note])'); if (!b) return null; document.documentElement.style.scrollBehavior = 'auto'; b.scrollIntoView({ block: 'center' }); b.focus(); return b.getAttribute('data-term'); })()`);
      await sleep(400);
      const tipText = await t.ev("(function () { var e = document.getElementById('gl-tip'); return e && !e.hidden ? e.querySelector('p').textContent : ''; })()");
      check(`${W}: a look-up pop-up opens`, !!tip && tipText.length > 20, `${tip}: ${tipText.slice(0, 50)}`);
      await t.ev('(document.activeElement && document.activeElement.blur(), 1)');
      // a figure: its actions, and Table opening
      if (await t.ev(`!!document.querySelector('#${id} .fs-acts[data-kind="bars"], #${id} .fs-acts[data-kind="stack"]')`)) {
        const acts = await t.ev(`[].map.call(document.querySelector('#${id} .fs-acts[data-kind="bars"], #${id} .fs-acts[data-kind="stack"]').children, function (a) { return a.textContent; }).join(' ')`);
        await t.ev(`(function () { var f = document.querySelector('#${id} .fs-acts[data-kind="bars"], #${id} .fs-acts[data-kind="stack"]').closest('.figure'); f.id = f.id || 'qa-fig'; document.documentElement.style.scrollBehavior = 'auto'; f.scrollIntoView({ block: 'center' }); f.querySelector('.fs-tab').click(); return 1; })()`);
        await sleep(300);
        const tab = await t.ev(`(function () { var f = document.querySelector('#${id} .figure.is-table'); if (!f) return null; var tb = f.querySelector('table.fig-table'); return { rows: tb.querySelectorAll('tr').length, h: Math.round(tb.getBoundingClientRect().height), bars: getComputedStyle(f.querySelector('.hbars')).display }; })()`);
        check(`${W}: a figure has Cite, Table, CSV and PNG, and Table opens its rows`, acts === 'Cite Table CSV PNG' && !!tab && tab.rows > 1 && tab.h > 40 && tab.bars === 'none', `${acts}; ${JSON.stringify(tab)}`);
      } else out.push(`     ${W}: no bar figure`);
      // the cite line, and its PDF served
      const pdf = S.pdf ? await t.ev(`fetch(${JSON.stringify(S.pdf)}, { method: 'HEAD' }).then(function (r) { return r.status + ' ' + r.headers.get('content-type'); }, function () { return 'failed'; })`) : 'no link';
      check(`${W}: the cite line's Cite this chapter and Chapter PDF (served)`, S.cite && S.pdf === '../pdf/' + id + '.pdf' && /^200 application\/pdf/.test(pdf), `${S.pdf} ${pdf}`);
      // an animation's step seeks the video (a video explainer: since 29 Oct 2026 a live explainer, 04.2 and 07.1, has none; qa/redesign/check-explain.js checks those)
      if (S.anim) {
        const want = await t.ev(`(function () { var f = document.querySelector('#${id} .figure--anim video').closest('.figure'), b = f.querySelectorAll('.anim-steps button')[2] || f.querySelectorAll('.anim-steps button')[1]; document.documentElement.style.scrollBehavior = 'auto'; f.scrollIntoView({ block: 'center' }); b.id = 'qa-step'; return +b.getAttribute('data-t'); })()`);
        await sleep(800);
        await t.ev("(document.getElementById('qa-step').click(), 1)");
        let st = null; for (let k = 0; k < 20; k++) { await sleep(250); st = await t.ev(`(function () { var v = document.querySelector('#${id} .figure--anim video'); return { cur: document.getElementById('qa-step').getAttribute('aria-current'), t: v.currentTime, src: !!v.currentSrc }; })()`); if (st.cur === 'step' && Math.abs(st.t - want) < 0.6) break; }
        check(`${W}: an animation step seeks the video`, st && st.cur === 'step' && Math.abs(st.t - want) < 0.6, `step at ${want}s: ${JSON.stringify(st)}`);
      }
      // a flashcard turns
      await t.ev(`(function () { var b = document.querySelector('#${id} .fc .fc-show'); document.documentElement.style.scrollBehavior = 'auto'; b.scrollIntoView({ block: 'center' }); b.click(); return 1; })()`); await sleep(400);
      check(`${W}: a flashcard turns`, await t.ev(`!!document.querySelector('#${id} .fc .fc-card.is-flipped')`));
      check(`${W}: the sources (${S.said})`, S.sources > 0 && S.sources === S.said, `${S.sources} listed`);
      t.errors.forEach((e) => check(`${W}: page error`, false, e));
      // Next goes to the next chapter's address (the last chapter's to the contents)
      await t.ev(`(function () { var d = document.querySelector('#${id} .prevnext .next'); document.documentElement.style.scrollBehavior = 'auto'; d.scrollIntoView({ block: 'center' }); d.click(); return 1; })()`);
      await sleep(2600);
      const at = await t.ev('location.pathname + location.hash');
      check(`${W}: Next goes to ${next ? next.id + "'s page" : 'the contents page'}`, at === (next ? '/' + next.id + '/' : '/supply-chain/'), `${S.door} -> ${at}`);
      await t.close();
      // the phone, dark
      const p = await open(chrome, BASE + '/' + id + '/?theme=dark', { width: 390, wait: 2200 });
      const P = await p.ev(`(function () { var de = document.documentElement; return { theme: de.getAttribute('data-theme'), ground: getComputedStyle(document.body).backgroundColor, strip: !!document.querySelector('.stage > canvas#stage-canvas') && getComputedStyle(document.querySelector('.stage')).display !== 'none', wide: de.scrollWidth - de.clientWidth }; })()`);
      check(`${id} 390 dark: dark, the live drawing in the strip, no sideways scroll`, P.theme === 'dark' && P.ground !== 'rgb(252, 252, 250)' && P.strip && P.wide <= 1, JSON.stringify(P));
      p.errors.forEach((e) => check(`${id} 390 dark: page error`, false, e));
      await p.close();
    }

    /* ---------- 3. old hash links (each chapter's third section, an h2 since 29 Oct 2026; h3 before) ---------- */
    const book = await open(chrome, BASE + '/book/#/chain', { width: 1440, wait: 1500 });
    const anchors = await book.ev(`JSON.stringify([].map.call(document.querySelectorAll('article.chapter'), function (a) { var s = a.querySelectorAll(':scope > .prose > h2[id]'), f = a.querySelector('.prose .figure[id]'); return { id: a.id, sec: s[Math.min(2, s.length - 1)] ? s[Math.min(2, s.length - 1)].id : null, fig: f ? f.id : null, deck: a.querySelector('.fc[id]') ? a.querySelector('.fc[id]').id : null }; }))`);
    await book.close();
    const land = async (url, wantPath, wantHash, label) => {
      const t = await open(chrome, BASE + url, { width: 1440, wait: 2200 });
      const r = await t.ev(`(function () { var h = decodeURIComponent(location.hash.slice(1)), e = h && document.getElementById(h); return { at: location.pathname + location.hash, len: history.length, off: e && e.getClientRects().length ? Math.round(e.getBoundingClientRect().top - CP.landAt(e)) : null, y: Math.round(scrollY), open: e && e.classList.contains('ch-cite-box') ? !e.hidden : null }; })()`);
      // a section lands under the masthead; a chapter's own top (no anchor, or the chapter's id) is the page's top
      const top = !wantHash || /^#\//.test(wantHash) || wantHash === '#' + wantPath.replace(/\//g, '');
      const ok = r.at === wantPath + wantHash && r.len === 2 && (top ? r.y <= 4 : r.off !== null && Math.abs(r.off) <= 3) && r.open !== false;
      check(`old link ${url} lands on ${wantPath}${wantHash}${label ? ' (' + label + ')' : ''}`, ok, JSON.stringify(r));
      t.errors.forEach((e) => check(`${url}: page error`, false, e));
      await t.close();
    };
    for (const a of JSON.parse(anchors)) {
      await land('/#' + a.id, '/' + a.id + '/', '');
      if (a.sec) await land('/#' + a.sec, '/' + a.id + '/', '#' + a.sec, 'a section');
      if (a.fig) await land('/#' + a.fig, '/' + a.id + '/', '#' + a.fig, 'a figure');
      await land('/#cite-' + a.id, '/' + a.id + '/', '#cite-' + a.id, 'its citation, open');
    }
    const first = JSON.parse(anchors)[3];
    await land('/#' + first.deck, '/' + first.id + '/', '#' + first.deck, 'its flashcards');
    await land('/#/geopolitics', '/geopolitics/', '', "the essay's route");
    await land('/?only=lithography', '/lithography/', '#lithography', 'the QA aid ?only=');
    for (const [old, e] of Object.entries(RETIRED.chapters || {})) await land('/#' + old, '/' + e.to + '/', '', 'a merged chapter');
    const ra = Object.entries(RETIRED.ANCHORS || {}).find(([from, to]) => to.indexOf('--') > 0);
    if (ra) await land('/#' + ra[0], '/' + ra[1].split('--')[0] + '/', '#' + ra[1], "a merged chapter's section");

    /* ---------- 6. the contents page ---------- */
    {
      const sitemap = read(path.join(dist, 'sitemap.xml')), locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      const once = (u) => locs.filter((x) => x === u).length === 1;
      check('the sitemap lists /supply-chain/ and each chapter page once, and not the book or /chain/', once('https://chipsupplychain.org/supply-chain/') && chapters.every((c) => once(`https://chipsupplychain.org/${c.id}/`)) && !locs.some((x) => /\/(book|chain)\/$/.test(x)), `${locs.length} entries`);
      for (const width of [1440, 390]) {
        const t = await open(chrome, BASE + '/supply-chain/', { width, wait: 2200 });
        const C = await t.ev(`(function () { var vis = function (e) { return !!e && e.getClientRects().length > 0; };
          return { h1: [].map.call(document.querySelectorAll('h1'), function (h) { return vis(h) ? h.textContent : ''; }).filter(Boolean).join(), title: document.title, canon: (document.querySelector('link[rel="canonical"]') || {}).href,
            downloads: [].map.call(document.querySelectorAll('#howto .howto-dl a'), function (a) { return vis(a) ? a.getAttribute('href') : ''; }).join(), standfirst: vis(document.querySelector('#howto .howto-std')),
            rows: [].map.call(document.querySelectorAll('#contents .item a.t'), function (a) { return vis(a) ? a.getAttribute('href') : ''; }), tab: (document.querySelector('.tabs a[aria-current="page"]') || {}).textContent, tabHref: (document.querySelector('.tabs a[aria-current="page"]') || { getAttribute: function () { return ''; } }).getAttribute('href'),
            chapters: document.querySelectorAll('article.chapter').length, wide: document.documentElement.scrollWidth - document.documentElement.clientWidth }; })()`);
        check(`/supply-chain/ ${width}: the whole contents page`, C.h1 === 'Supply Chain' && /stage by stage/.test(C.title) && C.canon === 'https://chipsupplychain.org/supply-chain/' && C.downloads === '../pdf/how-ai-chips-are-made.pdf,../pdf/summary.pdf' && C.standfirst && C.rows.join() === chapters.map((c) => `../${c.id}/`).join() && C.tab === 'Supply Chain' && C.tabHref === '../supply-chain/' && C.chapters === 0 && C.wide <= 1, JSON.stringify(Object.assign({}, C, { rows: C.rows.length })));
        t.errors.forEach((e) => check(`/supply-chain/ ${width}: page error`, false, e));
        // a row opens its chapter's page
        await t.ev(`(document.querySelector('#contents .item[data-ch="advanced-packaging"] a.t').click(), 1)`); await sleep(2600);
        check(`/supply-chain/ ${width}: a row opens its chapter's page`, await t.ev('location.pathname') === '/advanced-packaging/');
        await t.close();
      }
      for (const [u, hash] of [['/#/chain', ''], ['/#/stack', ''], ['/#/sources', ''], ['/#contents', '#contents'], ['/lithography/#/chain', '']]) {
        const t = await open(chrome, BASE + u, { width: 1440, wait: 2000 });
        const r = await t.ev("({ at: location.pathname + location.hash, len: history.length, contents: !!document.getElementById('contents') && document.getElementById('contents').getClientRects().length > 0 })");
        check(`old address ${u} forwards to /supply-chain/${hash}`, r.at === '/supply-chain/' + hash && r.len === 2 && r.contents, JSON.stringify(r));
        await t.close();
      }
      const stub = await open(chrome, BASE + '/chain/', { width: 1440, wait: 2000 });
      check('/chain/ forwards to /supply-chain/', await stub.ev('location.pathname') === '/supply-chain/');
      await stub.close();
      const home = await open(chrome, BASE + '/#/', { width: 1440, wait: 2000 });
      check('the home page links the contents page from its tab and holds no contents', await home.ev("document.querySelector('.tabs a[data-view=\"stack\"]').getAttribute('href') === 'supply-chain/' && !document.getElementById('contents')"));
      await home.close();
    }

    /* ---------- 4. search finds a chapter, from any page, and opens its page ---------- */
    for (const [from, q, to] of [['/#/', 'Memory and HBM', 'memory-and-hbm'], ['/lithography/', 'Advanced Packaging', 'advanced-packaging'], ['/#/glossary', 'Who Controls the Chain', 'geopolitics']]) {
      const t = await open(chrome, BASE + from, { width: 1440, wait: 2000 });
      await t.ev('(CP.Tools.open(), 1)');
      await t.s('Input.insertText', { text: q }); await sleep(1500);
      const hit = await t.ev("(function () { var a = [].filter.call(document.querySelectorAll('#cp-search ol a'), function (a) { return a.querySelector('.k').textContent === 'Chapter'; })[0]; if (!a) return null; a.id = 'qa-hit'; return { href: a.getAttribute('href'), title: a.querySelector('b').textContent, k: +a.getAttribute('data-k') }; })()");
      if (hit) { await t.ev("(document.getElementById('qa-hit').click(), 1)"); await sleep(2800); }
      const at = hit ? await t.ev('location.pathname') : null;
      check(`search "${q}" on ${from}: the chapter's result opens its page`, !!hit && at === '/' + to + '/', `${JSON.stringify(hit)} -> ${at}`);
      t.errors.forEach((e) => check(`search on ${from}: page error`, false, e));
      await t.close();
    }
  } finally { await chrome.close(); }
  console.log(out.join('\n'));
  console.log(bad ? `\n${bad} of ${n} checks failed` : `\nall ${n} checks pass`);
  process.exit(bad ? 1 : 0);
})();
