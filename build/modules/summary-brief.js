/* SUMMARY  — dist/summary/index.html, the short version of The Chain: the fifteen stages at a glance, a card per stage
   (its one-line summary, who leads, where China and the United States stand) and the two chapters that look across the chain.
   Everything is taken from the chapters' own front matter and "In short", so it never says more than a chapter does; every
   figure is cited in the chapter each card links to.
   The page carries two layouts of the same content: a screen layout in the site's own design (masthead, the chain at a
   glance, stage cards, the site footer), and a compact print layout that build/summary_pdf.py prints to
   dist/chip-supply-chain-summary.pdf, the file the "Download a short summary" button on The Chain serves. Each layout is
   hidden in the other medium, so a change to the screen design never moves the PDF. build/build.js lists /summary/ in the
   sitemap. */
const SITE = require('../site.js');

module.exports = function (ctx) {
  const { fs, path, root, stages = [], chapters = [], geo, esc, pad, word, builtStr, footerKey = '', } = ctx;
  if (!stages.length) return {};
  const stageIds = new Set(stages.map((c) => c.id));
  const across = chapters.filter((c) => !stageIds.has(c.id)).concat(geo ? [geo] : []);
  const url = (id) => `${SITE.url}${id}/`;
  const short = (id) => `${SITE.host}/${id}/`;
  const noCites = (h) => String(h || '').replace(/<sup class="cite">[\s\S]*?<\/sup>/g, '').replace(/\s+([.,;:])/g, '$1');
  const firstPara = (h) => (noCites(h).match(/<p>[\s\S]*?<\/p>/) || [''])[0];
  const COUNTRY = { US: 'United States', NL: 'Netherlands', JP: 'Japan', KR: 'South Korea', TW: 'Taiwan', CN: 'China', DE: 'Germany', GB: 'United Kingdom', FR: 'France', AT: 'Austria', IL: 'Israel', CH: 'Switzerland', MY: 'Malaysia', SG: 'Singapore', BE: 'Belgium', IT: 'Italy', IE: 'Ireland', IN: 'India', MX: 'Mexico' };
  const LEVEL = { Extreme: 4, High: 3, Moderate: 2, Low: 1 };
  const leaders = (c, n) => (c.leaders || []).slice(0, n);
  const card = (ch) => ch.meta.card || {};
  const sub = (ch) => (card(ch).substitutability || {}).band || '';
  const conc = (ch) => card(ch).concentration || '';
  const title = 'The AI chip supply chain in brief';
  const dek = `The ${word(stages.length)} stages that turn sand and software into an AI accelerator: who leads each one, how concentrated it is, and where China and the United States stand.`;

  /* ---------- screen layout ---------- */
  const meter = (band) => `<span class="meter" aria-hidden="true">${[1, 2, 3, 4].map((k) => `<i${k <= (LEVEL[band] || 0) ? ' class="on"' : ''}></i>`).join('')}</span>`;
  const ladder = stages.map((ch, i) => {
    const who = leaders(card(ch), 2).map((l) => `${esc(l.name)}${l.country ? ` <span class="cc">${esc(l.country)}</span>` : ''}`).join('<span class="sep">, </span>');
    return `<li class="lv-${LEVEL[conc(ch)] || 0}"><a href="#s-${esc(ch.id)}"><span class="n">${pad(i + 1)}</span><span class="t">${esc(ch.title)}</span><span class="c">${meter(conc(ch))}<span class="w">${esc(conc(ch))}</span></span><span class="s">${esc(sub(ch))}</span><span class="who">${who}</span></a></li>`;
  }).join('');
  const nExtreme = stages.filter((ch) => conc(ch) === 'Extreme').length;
  const stageCards = stages.map((ch, i) => {
    const c = card(ch);
    const who = leaders(c, 3).map((l) => `<li><b>${esc(l.name)}</b>${l.country ? ` <span class="cc" title="${esc(COUNTRY[l.country] || l.country)}">${esc(l.country)}</span>` : ''}${l.share ? `<span class="share">${esc(l.share)}</span>` : ''}</li>`).join('');
    const sides = [['China', c.chinaStatus], ['United States', c.usStatus]].filter((x) => x[1]);
    return `<article class="card lv-${LEVEL[conc(ch)] || 0}" id="s-${esc(ch.id)}">
<p class="card-k"><span class="n">${pad(i + 1)}</span>Stage ${i + 1} of ${stages.length}</p>
<h3><a href="${url(ch.id)}">${esc(ch.title)}</a></h3>
<p class="pills"><span class="pill pill-c${LEVEL[conc(ch)] === 4 ? ' x' : ''}">${esc(conc(ch))} concentration</span>${sub(ch) ? `<span class="pill">${esc(sub(ch))} to substitute</span>` : ''}</p>
${ch.meta.oneLiner ? `<p class="lede">${esc(ch.meta.oneLiner)}</p>` : ''}
${who ? `<div class="who-block"><p class="lbl">Who leads</p><ul>${who}</ul></div>` : ''}
${sides.length ? `<div class="sides">${sides.map(([k, v]) => `<div><p class="lbl">${k}</p><p>${esc(v)}</p></div>`).join('')}</div>` : ''}
<p class="more"><a href="${url(ch.id)}">Read the chapter, with its sources</a></p>
</article>`;
  }).join('');
  const acrossCards = across.map((ch) => `<article class="card wide" id="s-${esc(ch.id)}">
<p class="card-k"><span class="n">${pad(ch.number)}</span>Across the chain</p>
<h3><a href="${url(ch.id)}">${esc(ch.title)}</a></h3>
${ch.meta.oneLiner ? `<p class="lede">${esc(ch.meta.oneLiner)}</p>` : ''}
${ch.inShort ? `<div class="short">${firstPara(ch.inShort)}</div>` : ''}
<p class="more"><a href="${url(ch.id)}">Read the chapter, with its sources</a></p>
</article>`).join('');

  const screen = `<header class="masthead"><a class="wordmark" href="${SITE.url}" aria-label="Chip Supply Chain"><svg class="wm-tile" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect width="16" height="16" rx="3.2"/><path transform="translate(3.3324 11.8693) scale(0.009179 -0.009179)" d="M1011 683 Q1011 612 960 564 Q909 515 823 515 Q739 515 696 561 Q653 607 653 680 L653 720 Q653 786 623 823 Q594 861 544 861 Q502 861 468 831 Q433 801 412 741 Q391 682 391 594 Q391 474 431 393 Q470 312 540 270 Q609 229 697 229 Q769 229 825 251 Q880 273 924 326 Q946 348 959 356 Q971 363 983 363 Q1000 363 1007 347 Q1015 330 1015 307 Q1012 216 954 140 Q896 64 796 19 Q695 -26 563 -26 Q417 -26 301 33 Q185 91 118 198 Q51 305 51 450 Q51 602 118 721 Q184 840 305 909 Q425 978 588 978 Q720 978 815 938 Q909 898 960 832 Q1011 765 1011 683 Z"/></svg><span class="wm-name">Chip Supply Chain</span></a><nav aria-label="Site"><a href="${SITE.url}#/chain">The Chain</a><a href="${SITE.url}#/controls">Export Controls</a><a href="${SITE.url}#/glossary">Glossary</a></nav></header>
<main class="scr">
<section class="hero">
<p class="eyebrow"><b>Summary</b> · the whole chain in one read</p>
<h1>${title}</h1>
<p class="dek">${esc(dek)}</p>
<p class="cta"><a class="btn" href="../chip-supply-chain-summary.pdf" download>Download the PDF <span>4 pages</span></a><a class="btn ghost" href="${SITE.url}#/chain">Read the full chain</a></p>
<p class="meta">Updated ${esc(builtStr)} · Every figure is cited in the chapter each card links to</p>
</section>
<section class="glance" aria-labelledby="glance-h">
<div class="sec-head"><h2 id="glance-h">The chain at a glance</h2><p><b>${nExtreme} of ${stages.length}</b> stages are rated Extreme concentration, meaning three or fewer firms could supply each of them today, or one firm holds more than half of it.</p></div>
<div class="ladder-head" aria-hidden="true"><span>Stage</span><span>Concentration</span><span>Substitutability</span><span>Who leads</span></div>
<ol class="ladder">${ladder}</ol>
<p class="key"><b>Concentration</b> counts the firms that credibly supply a stage: Extreme, High, Moderate or Low. <b>Substitutability</b> rates how hard it would be for a well-funded state or firm to build an alternative: Easy, Moderate, Hard or Very hard.</p>
</section>
<section class="stages-s" aria-labelledby="stages-h">
<div class="sec-head"><h2 id="stages-h">The ${word(stages.length)} stages</h2><p>In the order a chip is made.</p></div>
<div class="grid">${stageCards}</div>
</section>
<section class="across-s" aria-labelledby="across-h">
<div class="sec-head"><h2 id="across-h">Across the chain</h2><p>Two chapters that are not stages. They look across all ${word(stages.length)}, at what a chip costs and at the contest over who controls them.</p></div>
<div class="grid two">${acrossCards}</div>
</section>
</main>
<footer class="site-footer scr">${footerKey}</footer>`;

  /* ---------- print layout (the PDF), unchanged ---------- */
  const rows = stages.map((ch, i) => {
    const c = card(ch);
    const who = leaders(c, 2).map((l) => `${esc(l.name)}${l.country ? ` <span class="cc">${esc(l.country)}</span>` : ''}`).join(', ');
    return `<tr><td class="n">${pad(i + 1)}</td><td class="t"><a href="${url(ch.id)}">${esc(ch.title)}</a></td><td>${who}</td><td class="band b-${esc(c.concentration || '')}">${esc(c.concentration || '')}</td><td class="band">${esc(sub(ch))}</td></tr>`;
  }).join('');
  const blocks = stages.map((ch, i) => {
    const c = card(ch);
    const who = leaders(c, 2).map((l) => `<li><b>${esc(l.name)}</b>${l.country ? ` <span class="cc">${esc(COUNTRY[l.country] || l.country)}</span>` : ''}${l.share ? `. ${esc(l.share)}` : ''}</li>`).join('');
    return `<section class="stage">
<h3><span class="n">${pad(i + 1)}</span> ${esc(ch.title)}</h3>
<p class="tags"><span class="b-${esc(c.concentration || '')}">${esc(c.concentration || '')} concentration</span>${sub(ch) ? ` · ${esc(sub(ch))} to substitute` : ''}</p>
${ch.meta.oneLiner ? `<p class="lede">${esc(ch.meta.oneLiner)}</p>` : ''}
${who ? `<ul class="who">${who}</ul>` : ''}
${c.chinaStatus ? `<p><span class="k">China</span> ${esc(c.chinaStatus)}</p>` : ''}
${c.usStatus ? `<p><span class="k">United States</span> ${esc(c.usStatus)}</p>` : ''}
<p class="src">Sources: <a href="${url(ch.id)}">${short(ch.id)}</a></p>
</section>`;
  }).join('');
  const acrossHTML = across.map((ch) => `<section class="stage wide">
<h3><span class="n">${pad(ch.number)}</span> ${esc(ch.title)}</h3>
${ch.meta.oneLiner ? `<p class="lede">${esc(ch.meta.oneLiner)}</p>` : ''}
${ch.inShort ? `<div class="short">${firstPara(ch.inShort)}</div>` : ''}
<p class="src">Sources: <a href="${url(ch.id)}">${short(ch.id)}</a></p>
</section>`).join('');
  const print = `<div class="prt">
<header>
<p class="kicker">Chip Supply Chain · summary</p>
<h1>${title}</h1>
<p class="dek">${esc(dek)}</p>
<p class="meta">Updated ${esc(builtStr)} · <a href="${SITE.url}">${SITE.host}</a> · Every figure is cited in the chapter each section links to.</p>
</header>
<div class="key">
<span><b>Concentration</b> counts the firms that credibly supply a stage: Extreme, High, Moderate or Low.</span>
<span><b>Substitutability</b> rates how hard it would be for a well-funded state or firm to build an alternative: Easy, Moderate, Hard or Very hard.</span>
</div>
<table>
<thead><tr><th>#</th><th>Stage</th><th>Who leads</th><th>Concentration</th><th>Substitutability</th></tr></thead>
<tbody>${rows}</tbody>
</table>
<h2>Across the chain</h2>
<p class="h2-note">Two chapters look across all ${word(stages.length)} stages, at what a chip costs and at the contest over who controls them.</p>
<div class="across">${acrossHTML}</div>
<h2 class="stages-h">The ${word(stages.length)} stages</h2>
<p class="h2-note">In the order a chip is made.</p>
<div class="stages">${blocks}</div>
<p class="foot">Chip Supply Chain: How AI Chips Are Made, by Yashvardhan Sharma. Summary updated ${esc(builtStr)}. The full chapters, with a source for every figure, are at ${SITE.host}.</p>
</div>`;

  const SCREEN_CSS = `
:root { --bg: #f7f6f2; --bg-2: #f1efea; --card: #fbfaf7; --ink: #14181f; --ink-2: #3b424c; --muted: #5c636d; --line: #d8d4cc; --line-2: #bfb9af;
  --accent: #7a1f2b; --accent-fill: #7a1f2b; --accent-soft: rgba(122, 31, 43, 0.08); --on-accent: #f7f6f2; --bar-4: #3b424c; --bar-3: #8f8a81; --bar-2: #bfb9af;
  --display: "Fraunces", "Iowan Old Style", Georgia, serif; --body: "Source Serif 4", "Iowan Old Style", Georgia, serif; --label: "Instrument Sans", "Helvetica Neue", Arial, sans-serif;
  --gutter: clamp(16px, 4vw, 40px); color-scheme: light; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #14171c; --bg-2: #1b1f25; --card: #181c22; --ink: #ece9e2; --ink-2: #c3c7cd; --muted: #939aa3; --line: #2c3138; --line-2: #3d434b;
  --accent: #e25c57; --accent-fill: #a8414b; --accent-soft: rgba(226, 92, 87, 0.12); --on-accent: #fff; --bar-4: #c3c7cd; --bar-3: #7d848d; --bar-2: #4a515a; color-scheme: dark; } }
:root[data-theme="dark"] { --bg: #14171c; --bg-2: #1b1f25; --card: #181c22; --ink: #ece9e2; --ink-2: #c3c7cd; --muted: #939aa3; --line: #2c3138; --line-2: #3d434b;
  --accent: #e25c57; --accent-fill: #a8414b; --accent-soft: rgba(226, 92, 87, 0.12); --on-accent: #fff; --bar-4: #c3c7cd; --bar-3: #7d848d; --bar-2: #4a515a; color-scheme: dark; }
@media screen {
  .prt { display: none; }
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--body); font-size: 17px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
  a { color: inherit; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .masthead { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 56px; padding: 0 var(--gutter); border-bottom: 1px solid var(--line-2); }
  .wordmark { display: flex; align-items: center; gap: 12px; min-height: 44px; text-decoration: none; }
  .wordmark .wm-tile { display: block; flex: none; width: 29px; height: 29px; }
  .wordmark .wm-tile rect { fill: #7a1f2b; }
  .wordmark .wm-tile path { fill: #f7f6f2; }
  .wordmark .wm-name { font-family: var(--display); font-size: 21px; font-weight: 540; font-variation-settings: "opsz" 28, "SOFT" 0, "WONK" 0; letter-spacing: -0.005em; line-height: 1; white-space: nowrap; }
  .masthead nav { display: flex; gap: 2px; }
  .masthead nav a { font-family: var(--label); font-weight: 500; font-size: 13.5px; color: var(--ink-2); text-decoration: none; padding: 10px 8px 9px; border-bottom: 1px solid transparent; white-space: nowrap; }
  .masthead nav a:hover { color: var(--ink); border-bottom-color: var(--accent); }
  .scr { max-width: 1080px; margin: 0 auto; padding: 0 var(--gutter); }
  .eyebrow, .meta, .lbl, .card-k, .pill, .ladder, .ladder-head, .key, .more, .cc, .site-footer { font-family: var(--label); }
  .hero { padding: clamp(40px, 7vh, 72px) 0 36px; max-width: 760px; }
  .eyebrow { margin: 0 0 14px; font-size: 11.5px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .eyebrow b { color: var(--accent); font-weight: 600; }
  h1 { font-family: var(--display); font-weight: 400; font-variation-settings: "opsz" 72; font-size: clamp(38px, 6vw, 60px); line-height: 1.02; letter-spacing: -0.015em; margin: 0 0 18px; text-wrap: balance; }
  .dek { font-size: 21px; line-height: 1.45; color: var(--ink-2); margin: 0 0 24px; max-width: 34em; }
  .cta { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 18px; }
  .btn { display: inline-flex; align-items: baseline; gap: 9px; padding: 13px 18px 12px; background: var(--accent-fill); color: var(--on-accent); border: 1px solid var(--accent-fill); font-family: var(--label); font-weight: 600; font-size: 15px; text-decoration: none; }
  .btn span { font-weight: 400; opacity: 0.85; }
  .btn:hover { background: var(--ink); border-color: var(--ink); color: var(--bg); }
  .btn.ghost { background: transparent; color: var(--ink); border-color: var(--line-2); }
  .btn.ghost:hover { border-color: var(--ink); }
  .meta { margin: 0; font-size: 12px; color: var(--muted); letter-spacing: 0.02em; }
  section + section { margin-top: 56px; }
  .sec-head { display: grid; grid-template-columns: minmax(0, 1fr); gap: 6px; border-top: 1px solid var(--ink); padding-top: 16px; margin-bottom: 20px; }
  h2 { font-family: var(--display); font-weight: 500; font-size: 28px; line-height: 1.15; margin: 0; }
  .sec-head p { margin: 0; color: var(--ink-2); max-width: 46em; font-size: 16px; }
  .sec-head p b { color: var(--accent); font-weight: 600; }
  /* the chain at a glance: one row per stage, a four-step meter for concentration */
  .ladder-head, .ladder a { display: grid; grid-template-columns: 34px minmax(170px, 1.35fr) 150px 120px minmax(0, 1.4fr); gap: 0 16px; align-items: baseline; }
  .ladder-head { font-size: 10.5px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); padding: 0 6px 8px; border-bottom: 1px solid var(--line-2); }
  .ladder-head span:first-child { grid-column: 1 / span 2; }
  .ladder { list-style: none; margin: 0; padding: 0; font-size: 14px; }
  .ladder li { border-bottom: 1px solid var(--line); }
  .ladder a { text-decoration: none; padding: 10px 6px; color: var(--ink-2); }
  .ladder a:hover { background: var(--accent-soft); }
  .ladder .n { font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
  .ladder .t { font-family: var(--body); font-size: 16.5px; color: var(--ink); font-weight: 600; }
  .ladder .c { display: inline-flex; align-items: center; gap: 9px; }
  .ladder .lv-4 .w { color: var(--accent); font-weight: 600; }
  .meter { display: inline-flex; gap: 2px; align-items: flex-end; height: 14px; }
  .meter i { display: block; width: 6px; background: var(--line); }
  .meter i:nth-child(1) { height: 5px; } .meter i:nth-child(2) { height: 8px; } .meter i:nth-child(3) { height: 11px; } .meter i:nth-child(4) { height: 14px; }
  .meter i.on { background: var(--bar-3); }
  .lv-3 .meter i.on { background: var(--bar-4); }
  .lv-4 .meter i.on { background: var(--accent-fill); }
  .cc { font-size: 10.5px; letter-spacing: 0.06em; color: var(--muted); }
  .ladder .who .sep { color: var(--muted); }
  .key { font-size: 12.5px; color: var(--muted); margin: 12px 0 0; max-width: 60em; }
  .key b { color: var(--ink-2); font-weight: 600; }
  /* stage cards */
  .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
  .card { background: var(--card); border: 1px solid var(--line); border-top: 3px solid var(--line-2); padding: 18px 20px 16px; display: flex; flex-direction: column; scroll-margin-top: 16px; }
  .card.lv-4 { border-top-color: var(--accent-fill); }
  .card.lv-3 { border-top-color: var(--bar-4); }
  .card-k { margin: 0 0 6px; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .card-k .n { color: var(--accent); font-weight: 600; margin-right: 8px; }
  h3 { font-family: var(--display); font-weight: 500; font-size: 23px; line-height: 1.15; margin: 0 0 10px; }
  h3 a { text-decoration: none; }
  h3 a:hover { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
  .pills { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 12px; }
  .pill { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 8px 3px; border: 1px solid var(--line-2); color: var(--ink-2); }
  .pill.x { border-color: var(--accent-fill); color: var(--accent); }
  .lede { margin: 0 0 14px; font-size: 16.5px; line-height: 1.5; color: var(--ink); }
  .lbl { margin: 0 0 4px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .who-block { margin: 0 0 14px; }
  .who-block ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 5px; }
  .who-block li { font-size: 14.5px; line-height: 1.4; color: var(--ink-2); }
  .who-block li b { color: var(--ink); font-weight: 600; }
  .who-block .cc { margin-left: 4px; }
  .who-block .share { display: block; font-size: 13.5px; color: var(--muted); }
  .sides { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; border-top: 1px solid var(--line); padding-top: 12px; margin: 0 0 12px; }
  .sides p { margin: 0; font-size: 14px; line-height: 1.45; color: var(--ink-2); }
  .sides p.lbl { margin-bottom: 4px; font-size: 10.5px; color: var(--muted); }
  .short p { margin: 0 0 12px; font-size: 15.5px; color: var(--ink-2); }
  .more { margin: auto 0 0; padding-top: 10px; font-size: 13px; font-weight: 600; }
  .more a { color: var(--accent); text-decoration: none; }
  .more a::after { content: " \\2192"; }
  .more a:hover { text-decoration: underline; text-underline-offset: 3px; }
  .site-footer { max-width: 1080px; border-top: 1px solid var(--line-2); margin-top: 64px; padding-top: 26px; padding-bottom: 56px; font-size: 12.5px; line-height: 1.7; color: var(--muted); }
  .site-footer p { margin: 0; }
  .site-footer a { color: var(--ink-2); }
  .site-footer .updated { display: block; margin-top: 8px; font-weight: 500; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; }
  .site-footer .sources-key { margin-top: 10px; font-size: 11.5px; }
  .tier { display: inline-block; font-size: 10px; font-weight: 500; width: 18px; height: 18px; line-height: 16px; text-align: center; border: 1px solid var(--line-2); margin-right: 6px; color: var(--ink-2); }
  .tier-A { border-color: var(--ink); color: var(--ink); }
  @media (max-width: 860px) {
    .grid { grid-template-columns: minmax(0, 1fr); }
    .ladder-head { display: none; }
    .ladder a { grid-template-columns: 30px minmax(0, 1fr) auto; grid-template-areas: "n t c" "n who s"; gap: 3px 10px; }
    .ladder .n { grid-area: n; } .ladder .t { grid-area: t; font-size: 16px; } .ladder .c { grid-area: c; justify-self: end; } .ladder .who { grid-area: who; font-size: 13px; } .ladder .s { grid-area: s; justify-self: end; font-size: 12px; color: var(--muted); }
  }
  @media (max-width: 560px) {
    body { font-size: 16.5px; }
    .masthead { min-height: 52px; }
    .wordmark { gap: 9px; }
    .wordmark .wm-tile { width: 25px; height: 25px; }
    .wordmark .wm-name { font-size: 18px; }
    .masthead nav a:nth-child(n+2) { display: none; }
    .scr, .site-footer { overflow-wrap: break-word; }
    .dek { font-size: 18.5px; }
    .sides { grid-template-columns: minmax(0, 1fr); }
    .card { padding: 16px 16px 14px; }
    h3 { font-size: 21px; }
  }
}
@media print { .scr, .masthead, .site-footer { display: none !important; } }
@media screen and (prefers-reduced-motion: reduce) { * { transition: none !important; } }`;

  const PRINT_CSS = `
@page { size: A4; margin: 12mm 12mm 13mm; }
@media print {
:root, :root:not([data-theme="light"]), :root[data-theme="dark"] { --ink: #14181f; --ink-2: #3b424c; --muted: #5c636d; --line: #d9d6cf; --garnet: #7a1f2b; --bg: #fff; color-scheme: light; }
* { box-sizing: border-box; }
html { background: var(--bg); color: var(--ink); }
body { margin: 0 auto; max-width: 960px; padding: 32px 20px 48px; font: 15px/1.5 "Source Serif 4", Georgia, serif; background: var(--bg); color: var(--ink); }
a { color: inherit; }
.kicker, .k, .tags, .src, .cc, th, .meta, .key { font-family: "Instrument Sans", system-ui, sans-serif; }
.kicker { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--garnet); margin: 0 0 6px; }
h1 { font: 600 34px/1.1 Fraunces, Georgia, serif; margin: 0 0 8px; text-wrap: balance; }
.dek { font-size: 17px; color: var(--ink-2); margin: 0 0 10px; max-width: 62ch; }
.meta { font-size: 12px; color: var(--muted); margin: 0 0 18px; }
.key { font-size: 12.5px; color: var(--ink-2); border-top: 1px solid var(--ink); border-bottom: 1px solid var(--line); padding: 8px 0; margin: 0 0 14px; display: grid; gap: 4px; }
.key b { color: var(--ink); font-weight: 600; }
table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
th { text-align: left; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--ink); padding: 6px 8px 6px 0; }
td { border-bottom: 1px solid var(--line); padding: 6px 8px 6px 0; vertical-align: baseline; }
td.n { font-family: "Instrument Sans", sans-serif; color: var(--muted); font-size: 12px; width: 26px; }
td.t a { text-decoration: none; font-weight: 600; }
td.band { font-family: "Instrument Sans", sans-serif; font-size: 12.5px; white-space: nowrap; }
.b-Extreme { color: var(--garnet); font-weight: 600; }
.cc { font-size: 10.5px; color: var(--muted); letter-spacing: 0.05em; }
h2 { font: 600 21px/1.2 Fraunces, Georgia, serif; margin: 30px 0 4px; }
.h2-note { font-size: 13.5px; color: var(--ink-2); margin: 0 0 12px; }
.stages { columns: 2; column-gap: 30px; }
.stage { break-inside: avoid; border-top: 1px solid var(--line); padding: 10px 0 12px; }
.stage h3 { font: 600 16.5px/1.25 Fraunces, Georgia, serif; margin: 0 0 2px; }
.stage h3 .n { font: 500 12px "Instrument Sans", sans-serif; color: var(--muted); margin-right: 4px; }
.tags { font-size: 12px; color: var(--muted); margin: 0 0 5px; }
.stage p, .stage li, .short p { font-size: 13.5px; line-height: 1.45; margin: 0 0 5px; }
.lede { color: var(--ink); }
.who { margin: 0 0 5px; padding-left: 16px; }
.k { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-right: 3px; }
.src { font-size: 11.5px; color: var(--muted); margin-top: 4px !important; }
.src a { color: var(--muted); }
.across { columns: 2; column-gap: 30px; }
.foot { font-family: "Instrument Sans", sans-serif; font-size: 11.5px; color: var(--muted); border-top: 1px solid var(--ink); margin-top: 26px; padding-top: 8px; }
body { max-width: none; padding: 0; font-size: 9.6pt; }
h1 { font-size: 22pt; } .dek { font-size: 11.5pt; } .meta, .key { font-size: 8.5pt; }
table { font-size: 9pt; } th { font-size: 7.5pt; } td.band, td.n { font-size: 8.5pt; }
h2 { font-size: 14pt; margin-top: 16pt; break-after: avoid; } .h2-note { font-size: 9pt; }
.stage { padding: 5pt 0 6pt; } .stage h3 { font-size: 10pt; } .stage p, .stage li, .short p { font-size: 8.2pt; line-height: 1.34; margin-bottom: 2.5pt; } .tags, .k, .src, .cc { font-size: 7.4pt; }
.stages-h { break-before: page; margin-top: 0; }
td, th { padding-top: 3.5pt; padding-bottom: 3.5pt; } .stages, .across { column-gap: 22pt; }
a { text-decoration: none; }
}`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · Chip Supply Chain</title>
<meta name="description" content="The ${word(stages.length)} stages of the AI chip supply chain in one read: who leads each, how concentrated it is, and where China and the United States stand. A four-page PDF is included.">
<link rel="canonical" href="${SITE.url}summary/">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${esc(dek)}">
<meta property="og:url" content="${SITE.url}summary/">
<meta property="og:type" content="article">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<script>(function(){try{var q=/[?&]theme=(light|dark)/.exec(location.search);var t=q?q[1]:localStorage.getItem('cp-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,400&family=Instrument+Sans:wght@400..600&display=swap">
<style>${SCREEN_CSS}
${PRINT_CSS}
</style>
</head>
<body>
${screen}
${print}
</body>
</html>`;
  const dir = path.join(root, 'dist', 'summary');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  return {};
};
