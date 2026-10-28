/* SUMMARY  — dist/summary/index.html, the short version of The Chain: the stages at a glance, a card per stage
   (its one-line summary, who leads, where China and the United States stand) and the two chapters that look across the chain.
   Everything is taken from the chapters' own front matter and "In short", so it never says more than a chapter does; every
   figure is cited in the chapter each card links to.
   The page carries two layouts of the same content: a screen layout in the site's own design (masthead, the chain at a
   glance, stage cards, the site footer), and a compact print layout that build/summary_pdf.py prints to
   dist/pdf/summary.pdf, the file the "Download a short summary" button on The Chain serves. Each layout is
   hidden in the other medium, so a change to the screen design never moves the PDF. build/build.js lists /summary/ in the
   sitemap. */
const SITE = require('../site.js');
const keepRanges = require('../keep-ranges.js');
const MH = require('../masthead.js'); // the app's masthead, as every readable page carries it (design round nine, revision 6)

module.exports = function (ctx) {
  const { fs, path, root, stages = [], chapters = [], geo, esc, pad, word, builtStr, pageDate, dayStr } = ctx;
  // the page's "Updated" day is the day its content last changed (page dates in build/build.js): written as DAY until the
  // page is hashed, then replaced, so a rebuild with no change in the chapters leaves the summary's day alone
  const DAY = '{{DAY:SUMMARY}}';
  const footerKey = String(ctx.footerKey || '').split(`Updated ${builtStr}`).join(`Updated ${DAY}`);
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
  // the band in the words the chapter cards and the share cards use (SUBWORD in build/build.js and build/modules/social.js)
  const SUBWORD = { 'Very hard': 'Very hard to substitute', Hard: 'Hard to substitute', Moderate: 'Moderately hard to substitute', Easy: 'Easy to substitute' };
  const subWords = (ch) => SUBWORD[sub(ch)] || `${sub(ch)} to substitute`;
  // the favicon's tile, as the masthead draws it beside the name
  const TILE = '<svg class="wm-tile" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect width="16" height="16" rx="3.2"/><path transform="translate(3.3324 11.8693) scale(0.009179 -0.009179)" d="M1011 683 Q1011 612 960 564 Q909 515 823 515 Q739 515 696 561 Q653 607 653 680 L653 720 Q653 786 623 823 Q594 861 544 861 Q502 861 468 831 Q433 801 412 741 Q391 682 391 594 Q391 474 431 393 Q470 312 540 270 Q609 229 697 229 Q769 229 825 251 Q880 273 924 326 Q946 348 959 356 Q971 363 983 363 Q1000 363 1007 347 Q1015 330 1015 307 Q1012 216 954 140 Q896 64 796 19 Q695 -26 563 -26 Q417 -26 301 33 Q185 91 118 198 Q51 305 51 450 Q51 602 118 721 Q184 840 305 909 Q425 978 588 978 Q720 978 815 938 Q909 898 960 832 Q1011 765 1011 683 Z"/></svg>';
  const conc = (ch) => card(ch).concentration || '';
  const title = 'The AI chip supply chain in brief';
  // the page's search title and description, from the approved list (build/page-titles.js); the visible h1 stays the title above
  const seo = require('../page-titles.js')('/summary/') || { title, description: `The ${word(stages.length)} stages of the AI chip supply chain in one read: who leads each, how concentrated it is, and where China and the United States stand. A four-page PDF is included.` };
  const dek = `The ${word(stages.length)} stages that turn sand and software into an AI accelerator: who leads each one, how concentrated it is, and where China and the United States stand.`;

  /* ---------- screen layout ---------- */
  const meter = (band) => `<span class="meter" aria-hidden="true">${[1, 2, 3, 4].map((k) => `<b${k <= (LEVEL[band] || 0) ? ' class="on"' : ''}></b>`).join('')}</span>`;
  const ladder = stages.map((ch, i) => {
    const who = leaders(card(ch), 2).map((l) => `${esc(l.name)}${l.country ? ` <span class="cc">${esc(l.country)}</span>` : ''}`).join('<span class="sep">, </span>');
    return `<li class="lv-${LEVEL[conc(ch)] || 0}"><a href="#s-${esc(ch.id)}"><span class="n">${pad(i + 1)}</span><span class="t">${esc(ch.title)}</span><span class="c">${meter(conc(ch))}<span class="w">${esc(conc(ch))}</span></span><span class="s">${esc(sub(ch))}</span><span class="who">${who}</span></a></li>`;
  }).join('');
  const nExtreme = stages.filter((ch) => conc(ch) === 'Extreme').length;
  // a sourced figure on a card links its source, as a chapter's marks do (final QA C13): a leader's share its own url, and the
  // lede's first percentage the key fact that carries the same figure, when one does
  const srcLink = (u) => (u ? ` <a class="src-l" href="${esc(u)}" target="_blank" rel="noopener">Source</a>` : '');
  const ledeSrc = (ch) => {
    const fig = (String(ch.meta.oneLiner || '').match(/\d[\d,.]*\s(?:to\s\d[\d,.]*\s)?percent/) || [''])[0].replace(/^.*\sto\s/, '');
    const re = fig ? new RegExp('(?<![\\d.,])' + fig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) : null; // "7 percent" never matches "17 percent"
    const k = re ? (ch.meta.keyFacts || []).find((f) => re.test(String(f.fact || ''))) : null;
    return k ? k.source : '';
  };
  const stageCards = stages.map((ch, i) => {
    const c = card(ch);
    const who = leaders(c, 3).map((l) => `<li><b>${esc(l.name)}</b>${l.country ? ` <span class="cc" title="${esc(COUNTRY[l.country] || l.country)}">${esc(l.country)}</span>` : ''}${l.share ? `<span class="share">${esc(l.share)}${srcLink(l.source)}</span>` : ''}</li>`).join('');
    const sides = [['China', c.chinaStatus], ['United States', c.usStatus]].filter((x) => x[1]);
    return `<article class="card lv-${LEVEL[conc(ch)] || 0}" id="s-${esc(ch.id)}">
<p class="card-k"><span class="n">${pad(i + 1)}</span>Stage ${i + 1} of ${stages.length}</p>
<h3><a href="${url(ch.id)}">${esc(ch.title)}</a></h3>
<p class="pills"><span class="pill pill-c${LEVEL[conc(ch)] === 4 ? ' x' : ''}">${esc(conc(ch))} concentration</span>${sub(ch) ? `<span class="pill">${esc(subWords(ch))}</span>` : ''}</p>
${ch.meta.oneLiner ? `<p class="lede">${esc(ch.meta.oneLiner)}${srcLink(ledeSrc(ch))}</p>` : ''}
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

  const screen = `${MH.masthead('')}
<main class="scr">
<section class="hero">
<p class="eyebrow"><b>Summary</b> · the whole chain in one read</p>
<h1>${title}</h1>
<p class="dek">${esc(dek)}</p>
<p class="cta"><a class="btn" href="../pdf/summary.pdf" download>Download the PDF <span>4 pages</span></a><a class="btn ghost" href="${SITE.url}supply-chain/">Read the full chain</a></p>
<p class="meta">Updated ${DAY} · Every figure is cited in the chapter each card links to</p>
</section>
<section class="glance" aria-labelledby="glance-h">
<div class="sec-head"><h2 id="glance-h">The chain at a glance</h2><p><b>${nExtreme} of ${stages.length}</b> stages are rated Extreme concentration, meaning three or fewer firms could supply each of them today, or one firm holds more than half of it.</p></div>
<div class="ladder-head" aria-hidden="true"><span>Stage</span><span>Concentration</span><span>Substitutability</span><span>Who leads</span></div>
<ol class="ladder">${ladder}</ol>
<p class="key"><b>Concentration</b> counts the firms that credibly supply a stage. Every stage rates Extreme or High. <b>Substitutability</b> rates how hard it would be for a well-funded state or firm to build an alternative: Very hard, Hard or Moderately hard.</p>
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

  /* ---------- print layout (the PDF) ----------
     It opens on the wordmark (the tile and the name, as on every page of the site), then "Summary" as a label. */
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
<p class="tags"><span class="b-${esc(c.concentration || '')}">${esc(c.concentration || '')} concentration</span>${sub(ch) ? ` · ${esc(subWords(ch))}` : ''}</p>
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
<p class="kicker wm">${TILE}<span class="wm-name">Chip Supply Chain</span><span class="wm-sub">Summary</span></p>
<h1>${title}</h1>
<p class="dek">${esc(dek)}</p>
<p class="meta">Updated ${DAY} · <a href="${SITE.url}">${SITE.host}</a> · Every figure is cited in the chapter each section links to.</p>
</header>
<div class="key">
<span><b>Concentration</b> counts the firms that credibly supply a stage. Every stage rates Extreme or High.</span>
<span><b>Substitutability</b> rates how hard it would be for a well-funded state or firm to build an alternative: Very hard, Hard or Moderately hard.</span>
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
<p class="foot">Chip Supply Chain: How AI Chips Are Made, by Yashvardhan Sharma. Summary updated ${DAY}. The full chapters, with a source for every figure, are at ${SITE.host}.</p>
</div>`;

  const SCREEN_CSS = `
:root { --bg: #fcfcfa; --bg-2: #f4f4f2; --card: #f4f4f2; --ink: #171716; --ink-2: #45443f; --muted: #6b6a64; --line: #e1e0db; --line-2: #c4c3bd;
  --accent: #7a1f2b; --accent-fill: #7a1f2b; --accent-soft: #f3e3e5; --on-accent: #ffffff; --bar-4: #8c8a84; --bar-3: #b4b3ad; --bar-2: #d2d1cc;
  --display: "Fraunces", "Iowan Old Style", Georgia, serif; --body: "Source Serif 4", "Iowan Old Style", Georgia, serif; /* the hybrid, 28 Oct 2026 */
  --opsz: "opsz" 48, "SOFT" 0, "WONK" 0; --opsz-name: "opsz" 28, "SOFT" 0, "WONK" 0;
  --text-scale: calc(18 / 18.5); /* as src/styles.css sets it (28 Oct: the text at 18 px); the printed brief sets its own sizes in pt */
  /* the serif's seven steps, as src/styles.css sets them (design round nine, revision 1) */
  --tk: calc(var(--text-scale) * 18.5 / 18);
  --t-title: clamp(48px, 5.8vw, 84px); --t-section: clamp(28px, 2.4vw, 34px); --t-block: 26px;
  --t-lead: calc(21px * var(--tk)); --t-text: calc(18px * var(--tk)); --t-small: calc(15.5px * var(--tk)); --t-note: calc(13.5px * var(--tk));
  /* the masthead's tokens (build/assets/masthead.css) */
  --font-ui: var(--label); --font-display: var(--display); --margin: clamp(16px, 4.45vw, 64px); --accent-ink: var(--accent);
  --label: "Hanken Grotesk", "Helvetica Neue", Arial, sans-serif; --kicker: "Fragment Mono", ui-monospace, Menlo, monospace;
  --gutter: clamp(16px, 4vw, 40px); color-scheme: light; }
@media (max-width: 900px) { :root { --t-title: min(68px, 15vw); } } /* a phone's page titles, as src/styles.css sets them */
/* dark: the site's own bar inks (src/styles.css), High in --bar-4 above Moderate in --bar-3 */
:root[data-theme="dark"] { --bg: #121211; --bg-2: #1c1c1a; --card: #1c1c1a; --ink: #e8e7e3; --ink-2: #c6c4be; --muted: #8f8d87; --line: #2c2b28; --line-2: #45443f;
  --accent: #d98a95; --accent-fill: #a8414b; --accent-soft: rgba(217, 138, 149, 0.16); --on-accent: #fff; --bar-4: #8c8a84; --bar-3: #5a5953; --bar-2: #45443f; color-scheme: dark; }
@media screen {
  .prt { display: none; }
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--body); font-size: var(--t-text); line-height: 1.55; -webkit-font-smoothing: antialiased; }
  a { color: inherit; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .scr { max-width: 1080px; margin: 0 auto; padding: 0 var(--gutter); }
  .eyebrow, .meta, .lbl, .card-k, .pill, .ladder, .ladder-head, .key, .more, .cc, .site-footer { font-family: var(--label); }
  .hero { padding: clamp(40px, 7vh, 72px) 0 36px; max-width: 760px; }
  /* the redesign (stage 3): the head as the views' (the display face at 400 over a standfirst in the text face), each section a display heading
     over an ink rule, pill buttons in ink; Extreme is wine, its meter, mark and card rule (the visual pass of 27 Oct 2026; the mark since page revision 7), High a mid gray */
  .eyebrow { margin: 0 0 22px; font-family: var(--label); font-size: 11.5px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); } /* the site's label: small spaced capitals (the visual pass of 27 Oct 2026) */
  .eyebrow b { color: var(--ink); font-weight: 500; }
  h1 { font-family: var(--display); font-weight: 400; font-variation-settings: var(--opsz); font-size: var(--t-title); line-height: 0.95; letter-spacing: -0.03em; margin: 0 0 0 -0.04em; text-wrap: balance; }
  .dek { font-size: var(--t-lead); line-height: 1.42; color: var(--ink-2); margin: 24px 0 28px; max-width: 34em; text-wrap: pretty; }
  .cta { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 18px; }
  .btn { display: inline-flex; align-items: baseline; gap: 9px; padding: 12px 20px 11px; border-radius: 999px; background: var(--ink); color: var(--bg); border: 1px solid var(--ink); font-family: var(--label); font-weight: 500; font-size: 15px; text-decoration: none; }
  .btn span { font-weight: 400; opacity: 0.8; }
  .btn:hover { background: var(--ink-2); border-color: var(--ink-2); }
  .btn.ghost { background: transparent; color: var(--ink); border-color: var(--line-2); }
  .btn.ghost:hover { border-color: var(--ink); background: transparent; }
  .meta { margin: 0; font-family: var(--label); font-size: 11.5px; font-weight: 500; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
  section + section { margin-top: 72px; }
  .sec-head { display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px; margin-bottom: 20px; }
  h2 { font-family: var(--display); font-weight: 500; font-variation-settings: var(--opsz); font-size: var(--t-block); line-height: 1.2; letter-spacing: -0.01em; margin: 0; padding-bottom: 12px; border-bottom: 1px solid var(--ink); }
  .sec-head p { margin: 0; color: var(--ink-2); max-width: 46em; font-size: var(--t-small); text-wrap: pretty; }
  .sec-head p b { color: var(--ink); font-weight: 700; }
  /* the chain at a glance: one row per stage, a four-step meter for concentration */
  .ladder-head, .ladder a { display: grid; grid-template-columns: 34px minmax(170px, 1.35fr) 150px 120px minmax(0, 1.4fr); gap: 0 16px; align-items: baseline; }
  .ladder-head { font-size: 11.5px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); padding: 0 6px 8px; border-bottom: 1px solid var(--line-2); }
  .ladder-head span:first-child { grid-column: 1 / span 2; }
  .ladder { list-style: none; margin: 0; padding: 0; font-size: 14px; }
  .ladder li { border-bottom: 1px solid var(--line); }
  .ladder a { text-decoration: none; padding: 10px 6px; color: var(--ink-2); }
  .ladder a:hover { background: var(--bg-2); }
  .ladder .n { font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
  .ladder .t { font-family: var(--body); font-size: var(--t-small); color: var(--ink); font-weight: 600; }
  .ladder .c { display: inline-flex; align-items: center; gap: 9px; }
  .ladder .lv-4 .w { color: var(--accent); font-weight: 600; }
  .meter { display: inline-flex; gap: 2px; align-items: flex-end; height: 14px; }
  .meter b { display: block; width: 6px; background: var(--line); }
  .meter b:nth-child(1) { height: 5px; } .meter b:nth-child(2) { height: 8px; } .meter b:nth-child(3) { height: 11px; } .meter b:nth-child(4) { height: 14px; }
  .meter b.on { background: var(--bar-3); }
  .lv-3 .meter b.on { background: var(--bar-4); }
  .lv-4 .meter b.on { background: var(--accent); }
  .cc { font-size: 11px; letter-spacing: 0.06em; color: var(--muted); }
  .ladder .who .sep { color: var(--muted); }
  .key { font-size: 12.5px; color: var(--muted); margin: 12px 0 0; max-width: 60em; }
  .key b { color: var(--ink-2); font-weight: 600; }
  /* stage cards */
  .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
  .card { background: var(--card); border: 0; border-top: 2px solid var(--line-2); padding: 20px 22px 18px; display: flex; flex-direction: column; scroll-margin-top: 16px; }
  .card.lv-4 { border-top-color: var(--accent); }
  .card.lv-3 { border-top-color: var(--bar-4); }
  .card-k { margin: 0 0 8px; font-family: var(--label); font-size: 11.5px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .card-k .n { color: var(--muted); font-weight: 500; margin-right: 10px; }
  h3 { font-family: var(--display); font-weight: 500; font-variation-settings: var(--opsz); font-size: var(--t-block); line-height: 1.15; margin: 0 0 12px; text-wrap: balance; }
  h3 a { text-decoration: none; }
  h3 a:hover { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
  /* the card's band and substitutability in the site's marks, not boxed tags (page revision 7, 28 Oct 2026): Extreme a 4 by 13 px
     wine bar before its word, High a 6 px hollow ink square, as the chapter kicker and the rail draw them; substitutability
     plain ink-2 text */
  .pills { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 16px; margin: 0 0 12px; }
  .pill { font-size: 13px; font-weight: 400; letter-spacing: 0; padding: 0; border: 0; color: var(--ink-2); }
  .pill-c { font-weight: 500; color: var(--ink); }
  .lv-4 .pill-c::before { content: ""; display: inline-block; width: 4px; height: 13px; margin: 0 7px -2px 0; background: var(--accent); }
  .lv-3 .pill-c::before { content: ""; display: inline-block; width: 6px; height: 6px; margin: 0 7px 1px 0; border: 1.5px solid var(--ink); }
  .lede { margin: 0 0 14px; font-size: var(--t-small); line-height: 1.5; color: var(--ink); }
  .lbl { margin: 0 0 4px; font-size: 11.5px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .who-block { margin: 0 0 14px; }
  .who-block ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 5px; }
  .who-block li { font-size: var(--t-note); line-height: 1.4; color: var(--ink-2); }
  .who-block li b { color: var(--ink); font-weight: 600; }
  .who-block .cc { margin-left: 4px; }
  .who-block .share { display: block; font-size: var(--t-note); color: var(--muted); }
  .src-l { font-size: var(--t-note); color: var(--muted); text-decoration: underline; text-underline-offset: 2px; white-space: nowrap; }
  /* China and the United States at the card's full width, one under the other (page revision 7): about 60 characters a line */
  .sides { display: block; border-top: 1px solid var(--line); padding-top: 12px; margin: 0 0 12px; }
  .sides > div + div { margin-top: 14px; }
  .sides p { margin: 0; font-size: 15px; line-height: 22.5px; color: var(--ink-2); }
  .sides p.lbl { margin-bottom: 4px; font-size: 11.5px; color: var(--muted); }
  .short p { margin: 0 0 12px; font-size: var(--t-small); color: var(--ink-2); }
  .more { margin: auto 0 0; padding-top: 10px; font-size: 13px; font-weight: 600; }
  .more a { color: var(--accent); text-decoration: none; }
  .more a::after { content: " \\2192"; }
  .more a:hover { text-decoration: underline; text-underline-offset: 3px; }
  .site-footer { max-width: 1080px; border-top: 1px solid var(--line-2); margin-top: 64px; padding-top: 26px; padding-bottom: 56px; font-size: 12.5px; line-height: 1.7; color: var(--muted); }
  .site-footer p { margin: 0; }
  .site-footer a { color: var(--ink-2); }
  .site-footer .updated { display: block; margin-top: 8px; font-weight: 500; font-size: 11px; letter-spacing: 0; }
  .site-footer .sources-key { margin-top: 10px; font-size: 11.5px; }
  .tier { display: inline-block; font-size: 11px; font-weight: 500; width: 18px; height: 18px; line-height: 16px; text-align: center; border: 1px solid var(--line-2); margin-right: 6px; color: var(--ink-2); }
  .tier-A { border-color: var(--ink); color: var(--ink); }
  @media (max-width: 860px) {
    .grid { grid-template-columns: minmax(0, 1fr); }
    .ladder-head { display: none; }
    .ladder a { grid-template-columns: 30px minmax(0, 1fr) auto; grid-template-areas: "n t c" "n who s"; gap: 3px 10px; }
    .ladder .n { grid-area: n; } .ladder .t { grid-area: t; font-size: var(--t-small); } .ladder .c { grid-area: c; justify-self: end; } .ladder .who { grid-area: who; font-size: 13px; } .ladder .s { grid-area: s; justify-self: end; font-size: 12px; color: var(--muted); }
  }
  @media (max-width: 560px) {
    body { font-size: var(--t-text); }
    .scr, .site-footer { overflow-wrap: break-word; }
    .dek { font-size: var(--t-text); }
    h1 { font-size: min(46px, 11vw); line-height: 1.02; } /* a long title, as a long chapter title is set on a phone: two lines, not three */
    .card { padding: 16px 16px 14px; }
    h3 { font-size: var(--t-lead); }
  }
}
@media print { .scr, .masthead, .site-footer { display: none !important; } }
@media screen and (prefers-reduced-motion: reduce) { * { transition: none !important; } }`;

  const PRINT_CSS = `
@page { size: A4; margin: 14mm 15mm 14mm; } /* room to hold and write on; 15 or 16 mm at the sides tips the stages onto six pages */
/* the redesign's print (stage 4): Fraunces heads and Source Serif 4 text (the hybrid, 28 Oct 2026), Hanken Grotesk labels, Fragment Mono for numbers, codes and
   dates; ink on white, the wine only on the logo and the source links; a band is a mark and a word, as on the site */
@media print {
:root, :root:not([data-theme="light"]), :root[data-theme="dark"] { --ink: #171716; --ink-2: #45443f; --muted: #56554f; --line: #e1e0db; --line-2: #c4c3bd; --rule-ink: #8c8a84; --wine: #7a1f2b; --bg: #fff;
  --display: "Fraunces", Georgia, serif; --body: "Source Serif 4", Georgia, serif; --label: "Hanken Grotesk", "Helvetica Neue", Arial, sans-serif; --kicker: "Fragment Mono", ui-monospace, Menlo, monospace; color-scheme: light; }
* { box-sizing: border-box; }
html { background: var(--bg); color: var(--ink); }
body { margin: 0; max-width: none; padding: 0; font: 9.2pt/1.45 var(--body); background: var(--bg); color: var(--ink); }
a { color: inherit; text-decoration: none; }
p, li, td { text-wrap: wrap; }
.kicker.wm { display: flex; align-items: center; gap: 2.6mm; margin: 0 0 5mm; color: var(--ink); }
.kicker.wm .wm-tile { display: block; width: 6mm; height: 6mm; flex: none; }
.kicker.wm .wm-tile rect { fill: #7a1f2b; }
.kicker.wm .wm-tile path { fill: #fff; }
.kicker.wm .wm-name { font: 500 12pt "Fraunces Mark", var(--display); line-height: 1; }
.kicker.wm .wm-sub { padding-left: 2.6mm; margin-left: 0.4mm; border-left: 0.5pt solid var(--line-2); font: 400 7.4pt var(--kicker); line-height: 1.2; color: var(--muted); }
h1 { margin: 0 0 2.4mm; font: 400 23pt/1.06 var(--display); letter-spacing: -0.02em; text-wrap: balance; }
.dek { margin: 0 0 2.6mm; max-width: 150mm; font-size: 11pt; line-height: 1.4; color: var(--ink-2); }
.meta { margin: 0 0 4.4mm; font: 400 7.4pt/1.4 var(--kicker); color: var(--muted); }
.key { display: grid; gap: 1mm; margin: 0 0 3.6mm; padding: 2.2mm 0; border-top: 0.6pt solid var(--ink); border-bottom: 0.3pt solid var(--line-2); font: 8pt/1.4 var(--label); color: var(--ink-2); }
.key b { font-weight: 600; color: var(--ink); }
table { width: 100%; border-collapse: collapse; font-size: 8.6pt; }
th { padding: 1.2mm 2.4mm 1.2mm 0; border-bottom: 0.6pt solid var(--ink); text-align: left; font: 600 7.4pt/1.3 var(--label); color: var(--ink); }
td { padding: 1.2mm 2.4mm 1.2mm 0; border-bottom: 0.3pt solid var(--line-2); vertical-align: baseline; }
td.n { width: 7mm; font: 400 7.4pt var(--kicker); color: var(--muted); }
td.t { padding-right: 4mm; white-space: nowrap; } /* the stage on one line, clear of who leads it; a wrapped row tips the page */
td.t a { font-family: var(--display); font-weight: 500; font-size: 9.2pt; }
td.band { font: 400 8pt var(--label); white-space: nowrap; color: var(--ink-2); }
/* the band as the site draws it: Extreme a solid bar and the word in ink, High an outline */
.b-Extreme::before, .b-High::before { content: ""; display: inline-block; width: 1.2mm; height: 2.5mm; margin-right: 1.4mm; vertical-align: baseline; }
.b-Extreme { font-weight: 600; color: var(--ink); }
.b-Extreme::before { background: var(--ink); }
.b-High::before { height: 1.3mm; box-shadow: inset 0 0 0 0.6pt var(--ink); }
.cc { font: 400 6.8pt var(--kicker); color: var(--muted); }
h2 { margin: 16pt 0 1mm; padding-top: 2mm; border-top: 0.6pt solid var(--ink); font: 400 14pt/1.15 var(--display); letter-spacing: -0.012em; break-after: avoid; }
.h2-note { margin: 0 0 3mm; font-size: 8.6pt; color: var(--ink-2); }
.stages, .across { columns: 2; column-gap: 22pt; }
.stage { break-inside: auto; padding: 5pt 0 6pt; border-top: 0.3pt solid var(--line-2); } /* a stage may run on into the next column, so the fourteen fit four pages (27 Oct) */
.stage h3, .stage .tags { break-after: avoid; } .stage p, .stage li { orphans: 3; widows: 3; }
.stage h3 { margin: 0 0 1mm; font: 500 10pt/1.25 var(--display); }
.stage h3 .n { margin-right: 1.2mm; font: 400 7.2pt var(--kicker); color: var(--muted); }
.tags { margin: 0 0 1.2mm; font: 400 7.4pt/1.35 var(--label); color: var(--ink-2); }
.tags .b-Extreme::before, .tags .b-High::before { height: 2.2mm; }
.tags .b-High::before { height: 1.1mm; }
.stage p, .stage li, .short p { margin: 0 0 2.2pt; font-size: 8.1pt; line-height: 1.32; } /* 1.36 until 27 Oct: the longer China and US lines ran the brief onto a fifth page */
.lede { color: var(--ink); }
.who { margin: 0 0 2.5pt; padding-left: 4mm; }
.who b { font-weight: 600; }
.k { margin-right: 1mm; font: 600 7.2pt var(--label); color: var(--ink); }
.src { margin-top: 1mm !important; font: 400 7pt var(--label) !important; color: var(--muted); }
.src a { color: var(--wine); }
.stages-h { break-before: page; margin-top: 0; }
.foot { margin-top: 8mm; padding-top: 2mm; border-top: 0.6pt solid var(--ink); font: 400 8pt/1.45 var(--label); color: var(--ink-2); }
}`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(seo.title)} · Chip Supply Chain</title>
<meta name="description" content="${esc(seo.description)}">
<link rel="canonical" href="${SITE.url}summary/">
<meta property="og:title" content="${esc(seo.title)}">
<meta property="og:description" content="${esc(seo.description)}">
<meta name="twitter:title" content="${esc(seo.title)}">
<meta name="twitter:description" content="${esc(seo.description)}">
<meta property="og:url" content="${SITE.url}summary/">
<meta property="og:type" content="article">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<script>(function(){try{var q=/[?&]theme=(light|dark)/.exec(location.search);var t=q?q[1]:localStorage.getItem('cp-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..600,0,0&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,400&family=Hanken+Grotesk:wght@400..700&family=Fragment+Mono&display=swap">
<style>${SCREEN_CSS}
${MH.mastheadCSS(root)}
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
  const dated = pageDate ? pageDate('/summary/', html) : null;
  fs.writeFileSync(path.join(dir, 'index.html'), keepRanges(html.split(DAY).join(esc(dated && dayStr ? dayStr(dated.modified) : builtStr))));
  return {};
};
