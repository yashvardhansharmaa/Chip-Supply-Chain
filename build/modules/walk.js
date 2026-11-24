/* WALK  — the home page's walk view since 23 Nov 2026: the drawing alone (the owner's "V", home round two). The markup here
   is what the drawing is made from and what a reader without scripts sees: the title, the subtitle, the link to the
   Introduction, the chain at a glance (GLANCE_HOME, one row per stage with its chapter link, firms, chokepoint mark and the
   one sentence the lit row shows), the two chapters across the chain and the key. src/modules/frontispiece.js draws the
   fourteen stages in a V from it.
   WALK_INTRO — the Introduction's page, introduction/ (23 Nov 2026; until then the walk ran under the home's hero): the
   title "Introduction", the subtitle and the read's counts, the chapters' plain-language paragraphs in order with their
   specimens beside them, the flashcards and "Other pages" (design round, 21 Oct 2026). Its view is the walk, as the home's
   was, so the router, the stage and src/modules/walk.js serve it unchanged (build/build.js writes the page, kind
   "introduction").
   START_HERE — the three-way chooser on the landing page, directly under the hero.

   Nothing here is written from memory. Every paragraph, name, country code, score and count is read
   from ctx.all and ctx.data; the only prose typed in this file is connective (the dek, the labels and
   the closing line), and every number inside it is computed. */

module.exports = function (ctx) {
  const { all, stages, data, esc, pad, word, cap, wordCount } = ctx;

  const steps = all.filter((c) => c.id !== 'introduction-and-goals').slice().sort((a, b) => (a.number || 0) - (b.number || 0)); // the walk starts with chip design; the site's own introduction stays in The Chain
  const card = Object.create(null);
  (data.chapters || []).forEach((c) => { card[c.id] = c; });

  // the geopolitics chapter is a view of its own; every other chapter is an anchor in the stack
  const chapterHref = (id) => (id === 'geopolitics' ? '#/geopolitics' : '#' + id);
  // a chapter link's href is its static page, which search engines can follow; data-route keeps a plain click in the app (src/app.js Router.init)
  const pageLink = (id) => `href="${esc(id)}/" data-route="${esc(chapterHref(id))}"`;
  // a step's own id is "/walk/<chapter>", so the hash "#/walk/<chapter>" keeps the router on this
  // view (it matches /^#\/([a-z-]+)/ as "walk") and still scrolls to the block
  const stepId = (id) => '/walk/' + id;
  const stageIndex = (id) => stages.findIndex((s) => s.id === id);

  /* a chokepoint's mark at the foot of its step (build/build.js chokeMark), a button that opens the word's glossary entry; a
     stage that is not a chokepoint shows none (owner, 22 Nov 2026) */
  const isChoke = ctx.isChoke || ((band) => band === 'Extreme');
  const mark = ctx.chokeMark || ((o = {}) => `<span class="cpk"><i aria-hidden="true"></i>Chokepoint</span>`);
  function bandHTML(c) {
    if (!isChoke(c.band)) return '';
    return mark({ tag: 'button', cls: 'gl-term wk-score-term', attrs: ' type="button" data-term="chokepoint"' });
  }

  /* who leads: at most three, name then country code, in the site's chip */
  function leadersHTML(c) {
    const ls = (c.leaders || []).slice(0, 3);
    if (!ls.length) return '';
    const line = ls
      .map((l) => `<span class="wk-lead">${esc(l.name)}${l.country ? ` <span class="chip">${esc(l.country)}${l.parentCC ? ` · parent ${esc(l.parentCC)}` : ''}</span>` : ''}</span>`) // a parent abroad (build/build.js parentCC)
      .join('<i class="wk-sep" aria-hidden="true">·</i>');
    return `<p class="wk-leaders"><span class="label">Who leads</span>${line}</p>`;
  }

  const plainOf = (id) => String((card[id] || {}).plain || '');
  /* a step's specimen carries its chapter's numbered parts on the Introduction's page (owner, 23 Nov 2026): the parts list's
     names (data/specimen-parts.json, label else name) and light tables, in the form build/build.js writes on a chapter's slot
     (data-parts), which src/modules/intro.js gives the plate */
  const partsAttr = (ch) => {
    const e = (ctx.specimenParts || {})[ch.id], ps = e && Array.isArray(e.parts) ? e.parts : [];
    if (!ps.length || (e.specimen && e.specimen !== ((ch.meta && ch.meta.specimen) || ''))) return '';
    return ` data-parts="${esc(JSON.stringify(ps.map((p) => Object.assign({ n: +p.n, name: p.label || p.name }, Array.isArray(p.light) && p.light.length ? { light: p.light.map((h) => (h.only ? { only: h.only } : {})) } : {}))))}"`;
  };
  const bib = ctx.readJSON(ctx.path.join(ctx.root, 'data', 'bibliography.json'), {}) || {};
  const okUrl = (u) => /^(https?:|#|\/)/i.test(String(u || '').trim());
  // a bibliography date, day first as the footnotes give it ("28 January 2026", "January 2026")
  const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayOf = (d) => { const p = String(d || '').split('-'); return p.length === 3 ? `${+p[2]} ${MON[+p[1] - 1] || p[1]} ${p[0]}` : p.length === 2 ? `${MON[+p[1] - 1] || p[1]} ${p[0]}` : p[0] || ''; };
  // two of the chapter's sourced key facts, so a hurried reader can lift a cited line without opening the chapter
  const factsHTML = (ch) => {
    const facts = ((ch.meta && ch.meta.keyFacts) || []).filter((k) => k && k.fact && okUrl(k.source)).slice(0, 2);
    if (!facts.length) return '';
    // each Source opens the chapters' footnote card (src/app.js Cite): the title, publisher and date on hover or focus, and on a
    // touch screen a tap opens the card, whose link goes to the source (28 Oct 2026; the date was only in a hover title)
    return `<ul class="wk-facts" aria-label="Two facts from the chapter">${facts.map((k) => { const e = bib[k.source] || {}; const when = e.date ? dayOf(e.date) : e.accessed ? 'Accessed ' + dayOf(e.accessed) : ''; const label = [e.title || k.source, e.publisher, when].filter(Boolean).join(' · '); return `<li>${esc(k.fact)} <a class="wk-src" href="${esc(k.source)}" target="_blank" rel="noopener" data-t="${esc(e.title || '')}" data-p="${esc(e.publisher || '')}" data-d="${esc(when)}"${ctx.tierOf ? ` data-tier="${esc(ctx.tierOf(k.source))}"` : ''} aria-label="Source: ${esc(label)}">Source</a></li>`; }).join('')}</ul>`;
  };
  const walkWords = steps.reduce((a, c) => a + wordCount(plainOf(c.id)), 0);
  const mins = Math.max(1, Math.round(walkWords / 230));
  const siteWords = all.reduce((a, c) => a + (c.words || 0), 0);
  const siteCites = all.reduce((a, c) => a + ((c.cites || []).length), 0);
  const thresholds = (data.controls || []).length;

  steps.forEach((c) => { if (!plainOf(c.id)) ctx.warn(`walk: chapter ${c.id} has no plain paragraph`); });

  /* ---------------- the chain at a glance: its count and its sentence ----------------
     One sentence gives how many stages are chokepoints and what the word means (the card's own note, ctx.CHOKE_NOTE). Until
     23 Nov 2026 it headed the home's list of stages, whose rows picked the specimen beside it (owner, 27 Oct 2026); the list
     is now the home drawing's rows (GLANCE_HOME, below). Chip design shows first on the Introduction's stage, where the chain
     starts (owner, 27 Oct). Nothing here is typed: the names, ratings, specimens and captions are the chapters' own, and every
     count is computed. */
  const nChoke = stages.filter((s) => isChoke((card[s.id] || {}).band)).length;
  // the note reads "Three or fewer firms can supply this stage, or one firm holds more than 65 percent of it."; here it
  // follows "7 of the 14 stages are chokepoints:". A changed note drops the clause.
  const xNote = String(ctx.CHOKE_NOTE || (ctx.BAND_NOTE || {}).Extreme || '');
  const xMeaning = /this stage/.test(xNote) ? xNote.replace('this stage', 'each').replace(/ of it\.$/, '.').replace(/\.$/, '').replace(/^\w/, (m) => m.toLowerCase()) : '';
  const SHOW_FIRST = Math.max(0, stages.findIndex((s) => s.id === 'design-and-eda'));
  const chOf = (id) => all.find((c) => c.id === id) || {};
  const specOf = (s) => { const m = chOf(s.id).meta || {}; return { spec: m.specimen || '', cap: m.specimenCaption || '' }; };
  const first = stages[SHOW_FIRST] || {}, firstSpec = first.id ? specOf(first) : { spec: '', cap: '' };

  /* ---------------- the home: the drawing's rows (23 Nov 2026) ----------------
     The chain at a glance as the home's drawing reads it (src/modules/frontispiece.js): each row carries its stage's number,
     name, specimen and the one sentence the lit row shows (data-n, data-t, data-spec, data-line), a chokepoint's row data-cpk
     and the chokepoint mark, and the first three firms on the stage's card. The sentence is the chapter's one-line summary's
     first sentence; where that runs past about 22 words, a shorter sentence the chapter states word for word (LINE, checked
     against its one-line summary and its plain paragraph; one the chapter no longer states falls back to the first sentence,
     with a warning). Without scripts the rows are the list of stages, each a link to its chapter. */
  const LINE = {
    'advanced-packaging': "Nvidia, Google, AMD and Amazon all use TSMC's interposer packaging, called CoWoS, made in Taiwan.",
    'substrates-and-pcbs': 'A handful of firms build these substrates, and two of the materials inside them come mainly from Japanese makers.',
  };
  const lineOf = (s) => {
    const m = chOf(s.id).meta || {}, one = String(m.oneLiner || ''), plain = String(m.plain || '').replace(/\s*\(\[source\]\([^)]*\)\)/g, '');
    const firstSentence = one.split(/(?<=[.!?])\s+(?=[A-Z0-9])/)[0] || '';
    const alt = LINE[s.id];
    if (alt && (one.includes(alt) || plain.includes(alt))) return alt;
    if (alt) ctx.warn(`walk: the home's sentence for ${s.id} is no longer in its chapter, so its one-line summary's first sentence shows`);
    return firstSentence;
  };
  const homeRow = (s, i) => {
    const cp = isChoke((card[s.id] || {}).band), sp = specOf(s);
    const ls = ((card[s.id] || {}).leaders || []).slice(0, 3);
    const lead = ls.length ? `<span class="wk-gl-lead">${ls.map((l) => `<span class="f">${esc(l.name)}</span>`).join(', ')}</span>` : '';
    return `<li${cp ? ' data-cpk="1"' : ''} data-n="${pad(i + 1)}" data-t="${esc(s.title)}" data-spec="${esc(sp.spec)}" data-line="${esc(lineOf(s))}"><a class="wk-gl-a" ${pageLink(s.id)}><span class="wk-gl-n">${pad(i + 1)}</span><span class="wk-gl-t">${esc(s.title)}${lead}</span></a><span class="wk-gl-c">${cp ? mark({ cls: 'wk-gl-m' }) : ''}</span></li>`;
  };
  const GLANCE_HOME = stages.length ? `<section class="wk-gl" aria-labelledby="wk-gl-h">
<h2 class="label wk-gl-h" id="wk-gl-h">The chain at a glance</h2>
${nChoke ? `<p class="wk-gl-p"><b>${nChoke} of the ${stages.length} stages</b> are chokepoints${xMeaning ? `: ${esc(xMeaning)}` : ''}.</p>` : ''}
<ol class="wk-gl-list">${stages.map(homeRow).join('')}</ol>
</section>` : '';
  // the two chapters across the chain, at the drawing's top right, and the key at its foot: the solid balloon, the count and
  // what a chokepoint is in the chapter cards' own words (CHOKE_NOTE, as the glance's sentence has them), and the note on scale.
  // The key waits hidden until the drawing shows it, since without scripts the glance's sentence says the same
  const acrossCh = all.filter((c) => !stages.some((s) => s.id === c.id) && c.id !== 'introduction-and-goals').sort((a, b) => (a.number || 0) - (b.number || 0));
  const ACROSS_HOME = acrossCh.length ? `<nav class="fx-across" aria-label="Across the chain"><span class="label fx-across-k">Across the chain</span>${acrossCh.map((c) => `<a class="fx-ac" ${pageLink(c.id)}><span class="fx-ac-n">${c.number}</span><span class="fx-ac-t">${esc(c.title)}</span></a>`).join('')}</nav>` : '';
  // the home's key keeps the approved short form so it fits one line beside its note (design review, 23 Nov 2026):
  // "three or fewer firms, or one with more than 65 percent", derived from the same note; a changed note drops it.
  const xKey = /^Three or fewer firms can supply this stage, or one firm holds more than [\d.]+ percent of it\.$/.test(xNote)
    ? xNote.replace(' can supply this stage', '').replace('one firm holds', 'one with').replace(/ of it\.$/, '').replace(/^\w/, (m) => m.toLowerCase()) : xMeaning;
  const KEY_HOME = nChoke ? `<p class="fx-key" hidden><span class="fx-k"><i class="fx-kb is-x" aria-hidden="true"></i><span><b>${nChoke} of the ${stages.length} stages are chokepoints${xKey ? ':' : '.'}</b>${xKey ? ` ${esc(xKey)}.` : ''}</span></span><span class="fx-k fx-k-note">Objects drawn at different scales.</span></p>` : '';

  // the flashcards that end the walk (below), which the last step's Next leads on to
  const introDeck = (ctx.flashcards || {}).intro;
  const hasDeck = !!(introDeck && Array.isArray(introDeck.cards) && introDeck.cards.length && ctx.deckHTML);

  /* ---------------- the walk ---------------- */
  const list = steps.map((ch, i) => {
    const c = card[ch.id] || {};
    const si = stageIndex(ch.id);
    const prev = steps[i - 1];
    const next = steps[i + 1];
    const stage = si >= 0 ? `Stage ${si + 1} of ${stages.length}` : '';
    return `<li class="wk-step" id="${esc(stepId(ch.id))}" data-title="${esc(ch.title)}" data-number="${pad(ch.number)}" data-specimen="${esc((ch.meta && ch.meta.specimen) || '')}" data-caption="${esc((ch.meta && ch.meta.specimenCaption) || '')}"${partsAttr(ch)}>
<div class="wk-mark" aria-hidden="true"><span class="wk-n">${pad(ch.number)}</span></div>
<div class="wk-block">
<p class="wk-where">${stage ? `<span class="label wk-stage">${esc(stage)}</span>` : `<span class="label">Chapter ${pad(ch.number)}</span>`}</p>
<h2 class="wk-t">${esc(ch.title)}</h2>
${ctx.glossaryWrap ? ctx.glossaryWrap(`<p class="wk-p">${esc(plainOf(ch.id))}</p>`) : `<p class="wk-p">${esc(plainOf(ch.id))}</p>`}
${ctx.glossaryWrap ? ctx.glossaryWrap(factsHTML(ch)) : factsHTML(ch)}
${leadersHTML(c)}
<div class="wk-foot">${bandHTML(c)}<a class="wk-read" ${pageLink(ch.id)}>Read the chapter</a></div>
<nav class="wk-pn" aria-label="Step ${i + 1} of ${steps.length}">${
      prev ? `<a class="wk-prev" href="#${esc(stepId(prev.id))}"><span class="label">Previous</span><span class="wk-pn-t">${esc(prev.title)}</span></a>` : '<span></span>'
    }${
      next ? `<a class="wk-next" href="#${esc(stepId(next.id))}"><span class="label">Next</span><span class="wk-pn-t">${esc(next.title)}</span></a>`
        : hasDeck ? `<a class="wk-next" href="#${esc(stepId('flashcards'))}"><span class="label">Next</span><span class="wk-pn-t">Flashcards</span></a>` : '<span></span>'
    }</nav>
</div>
</li>`;
  }).join('\n');

  /* ---------------- the end: the whole chain in flashcards ----------------
     data/flashcards.json "intro", built by build.js's deckHTML, the component every chapter ends with. Each card's reason
     ends with a link to the chapter that explains it. data-deck names the deck for src/app.js, which keeps its marks under
     "cp-fc-intro"; data-name is what search calls it; data-reread finishes the end screen's line ("ends with a link to its
     chapter"). The block's own id makes "#/walk/flashcards" an address of this view, like a step's, so the address can
     follow the reader into the deck (src/modules/walk.js). */
  const chapterOf = new Map(all.map((c) => [c.id, c]));
  const DECK = hasDeck ? `<div class="wk-deck" id="${esc(stepId('flashcards'))}">${ctx.deckHTML(introDeck, {
    id: 'intro', title: 'Start here', attrs: ' data-deck="intro" data-name="Start here" data-reread="its chapter"',
    sub: `${cap(word(introDeck.cards.length))} cards on the whole chain. Recall each answer, then turn the card.`,
    more: (c, i) => {
      const ch = chapterOf.get(c.chapter);
      if (!ch) { ctx.warn(`flashcards intro #${i + 1}: no chapter "${c.chapter}"`); return null; }
      return { href: chapterHref(ch.id), text: 'Read: ' + ch.title };
    },
  })}</div>` : '';

  /* ---------------- the end: every other page, one line each ----------------
     The walk closes on the rest of the site, after the flashcards, in place of three boxed links (design round, 21 Oct 2026;
     owner's decision 1). Until then the chain at a glance leads, and the masthead's tabs reach every page. */
  const OTHER = `<nav class="wk-tabs" aria-label="Other pages">
<p class="label wk-tabs-k">Other pages</p>
<a href="#/chain"><b class="wk-tab">Supply Chain</b><span>The full semiconductor supply chain explained in detail, in ${word(all.length)} chapters, with all sources linked.</span></a>
<a href="#/landscape"><b class="wk-tab">AI Chips</b><span>The specs of ${(data.landscape || []).length} AI chips from Nvidia, AMD, Google, Huawei and others, compared side by side.</span></a>
<a href="#/suppliers"><b class="wk-tab">Suppliers</b><span>The ${(data.suppliers || []).length} companies behind the chain, on a map and stage by stage, and what each country makes.</span></a>
<a href="#/controls"><b class="wk-tab">Export Controls</b><span>The main rules since 2018, what can still be sold to China, and China's share of revenue at ${new Set((data.exposure || []).map((r) => r.firm)).size} firms, from their filings.</span></a>
<a href="#/glossary"><b class="wk-tab">Glossary</b><span>Plain definitions of every term, plus every company, chip and country, with the passages that mention them.</span></a>
</nav>`;

  // the home's walk view: the drawing's title, subtitle and link to the Introduction (with the walk's minutes), its rows, the
  // chapters across the chain and its key (src/modules/frontispiece.js). It names no specimen, so no stage shows beside it
  const WALK = `<div class="wk wk-home">
<header class="wk-head fx-hero" id="wk-hero">
<h1 class="wk-title">How AI chips are made</h1>
<p class="wk-dek">An introduction to the entire semiconductor supply chain.</p>
<p class="fx-intro"><a href="#/intro">Read the ${mins}-minute introduction</a></p>
${GLANCE_HOME}
${ACROSS_HOME}
${KEY_HOME}
</header>
</div>`;

  // the Introduction's walk view (its page, introduction/): its head names the page and the read's length; its first specimen
  // is chip design's, beside the head
  const WALK_INTRO = `<div class="wk">
<div class="wk-rail" id="wk-rail" data-show="0" aria-hidden="true" hidden><div class="wk-rail-bar"><i></i></div><p class="wk-rail-line"><span class="wk-rail-n"></span><span class="wk-rail-t"></span></p></div>
<header class="wk-head" id="wk-hero" data-specimen="${esc(firstSpec.spec)}" data-number="${first.id ? pad(SHOW_FIRST + 1) : ''}" data-title="${esc(first.title || '')}" data-caption="${esc(firstSpec.cap)}">
<h1 class="wk-title">Introduction</h1>
<p class="wk-dek">An introduction to the entire semiconductor supply chain.</p>
<p class="wk-meta"><span class="label">${walkWords.toLocaleString('en-US')} words</span><span class="label">about ${mins} min</span></p>
</header>
<ol class="wk-list">
${list}
</ol>
${DECK}
<div class="wk-end">
${OTHER}
</div>
</div>`;

  /* ---------------- start here (landing page) ---------------- */
  const START_HERE = `<section class="wk-sh" aria-labelledby="wk-sh-h">
<h2 class="label wk-sh-h" id="wk-sh-h">Start here</h2>
<ul class="wk-sh-list">
<li><a class="wk-sh-item" href="#/walk"><b class="wk-sh-t">${cap(word(mins))} minutes: how a GPU is made</b><span class="wk-sh-d">Every chapter's plainest paragraph, in order.</span></a></li>
<li><a class="wk-sh-item" href="#contents"><b class="wk-sh-t">The whole chain, ${steps.length} chapters</b><span class="wk-sh-d">The full text, ${siteWords.toLocaleString('en-US')} words.</span></a></li>
<li><a class="wk-sh-item" href="#/controls"><b class="wk-sh-t">Data and sources for researchers</b><span class="wk-sh-d">${siteCites.toLocaleString('en-US')} sources${thresholds ? `, ${thresholds} license thresholds` : ''}.</span></a><a class="wk-sh-more" href="#/controls">Export controls</a></li>
</ul>
</section>`;

  return { WALK, WALK_INTRO, START_HERE };
};
