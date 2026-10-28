/* WALK  — the view at #/walk: "How AI chips are made", the chapters' plain-language paragraphs in order. The hero is the
   home's structure before the redesign, in the redesign's type and colors (27 Oct 2026): the title, the subtitle, the read's
   counts and the chain at a glance (GLANCE), whose rows pick the specimen beside it. The walk follows, and ends with
   "Other pages" (design round, 21 Oct 2026).
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

  /* the concentration band, shown the way the chain strip shows it: wine at Extreme, an ink outline at High, gray below */
  const RANK = { Extreme: '5', High: '4', Moderate: '3', Low: '3' };
  function bandHTML(c) {
    if (!c.band) return '';
    return `<span class="wk-score" data-rank="${RANK[c.band] || '3'}"><button type="button" class="gl-term label wk-score-term" data-term="concentration" data-note="${esc((ctx.BAND_NOTE || {})[c.band] || '')}" data-head="${esc(c.band)} concentration">Concentration</button><span class="wk-sc"><b>${esc(c.band)}</b></span></span>`;
  }

  /* who leads: at most three, name then country code, in the site's chip */
  function leadersHTML(c) {
    const ls = (c.leaders || []).slice(0, 3);
    if (!ls.length) return '';
    const line = ls
      .map((l) => `<span class="wk-lead">${esc(l.name)}${l.country ? ` <span class="chip">${esc(l.country)}</span>` : ''}</span>`)
      .join('<i class="wk-sep" aria-hidden="true">·</i>');
    return `<p class="wk-leaders"><span class="label">Who leads</span>${line}</p>`;
  }

  const plainOf = (id) => String((card[id] || {}).plain || '');
  const bib = ctx.readJSON(ctx.path.join(ctx.root, 'data', 'bibliography.json'), {}) || {};
  const okUrl = (u) => /^(https?:|#|\/)/i.test(String(u || '').trim());
  // two of the chapter's sourced key facts, so a hurried reader can lift a cited line without opening the chapter
  const factsHTML = (ch) => {
    const facts = ((ch.meta && ch.meta.keyFacts) || []).filter((k) => k && k.fact && okUrl(k.source)).slice(0, 2);
    if (!facts.length) return '';
    return `<ul class="wk-facts" aria-label="Two facts from the chapter">${facts.map((k) => { const e = bib[k.source] || {}; const t = e.title ? `${e.title}${e.publisher ? ', ' + e.publisher : ''}${e.date ? ', ' + e.date : ''}` : k.source; return `<li>${esc(k.fact)} <a class="wk-src" href="${esc(k.source)}" target="_blank" rel="noopener" title="${esc(t)}">Source</a></li>`; }).join('')}</ul>`;
  };
  const walkWords = steps.reduce((a, c) => a + wordCount(plainOf(c.id)), 0);
  const mins = Math.max(1, Math.round(walkWords / 230));
  const siteWords = all.reduce((a, c) => a + (c.words || 0), 0);
  const siteCites = all.reduce((a, c) => a + ((c.cites || []).length), 0);
  const thresholds = (data.controls || []).length;

  steps.forEach((c) => { if (!plainOf(c.id)) ctx.warn(`walk: chapter ${c.id} has no plain paragraph`); });

  /* ---------------- the chain at a glance (the hero, under the title, the subtitle and the read's counts) ----------------
     The home's structure before the redesign, which the owner found more minimalist and straight to the point (27 Oct 2026),
     in the redesign's type and colors. One sentence gives how many stages are rated Extreme and what that means (the card's
     own note, ctx.BAND_NOTE); the stages follow in the order a chip is made, one row each: the number, the name (a link to
     the chapter), and the stage's band from its card, a four-step meter and the plain word. The meter and the word are one
     button, which puts the stage's specimen on the stage beside the hero (src/modules/walk.js): hovering, focusing or
     clicking it picks it. The row whose specimen is showing is the reader's selection, on a paper tint with its number in
     wine; Extreme is wine, its meter and its word (the visual pass of 27 Oct 2026), High the lighter tint. Chip design shows first, where the chain
     starts (owner, 27 Oct). The rows carry the specimen as data-spec, not data-specimen, so the page's scroll tracking
     (src/app.js Sections) follows the hero as one item. Nothing here is typed: the names, bands, specimens and captions are
     the chapters' own, and every count is computed. */
  const LEVEL = { Extreme: 4, High: 3, Moderate: 2, Low: 1 };
  const meter = (band) => `<span class="wk-gl-m" aria-hidden="true">${[1, 2, 3, 4].map((k) => `<i${k <= (LEVEL[band] || 0) ? ' class="on"' : ''}></i>`).join('')}</span>`;
  const nExtreme = stages.filter((s) => (card[s.id] || {}).band === 'Extreme').length;
  // the card's note reads "Three or fewer firms could supply this stage today, or one firm holds more than half of it."; here it
  // follows "7 of the 14 stages are rated Extreme, meaning". A changed note drops the clause.
  const xNote = String((ctx.BAND_NOTE || {}).Extreme || '');
  const xMeaning = /this stage/.test(xNote) ? xNote.replace('this stage', 'each').replace(/ of it\.$/, '.').replace(/\.$/, '').replace(/^\w/, (m) => m.toLowerCase()) : '';
  const SHOW_FIRST = Math.max(0, stages.findIndex((s) => s.id === 'design-and-eda'));
  const chOf = (id) => all.find((c) => c.id === id) || {};
  const specOf = (s) => { const m = chOf(s.id).meta || {}; return { spec: m.specimen || '', cap: m.specimenCaption || '' }; };
  const glanceRow = (s, i) => {
    const b = (card[s.id] || {}).band || '', sp = specOf(s), on = i === SHOW_FIRST;
    const pick = b ? `<button type="button" class="wk-gl-c" aria-pressed="${on}" tabindex="${on ? 0 : -1}" data-spec="${esc(sp.spec)}" data-n="${pad(i + 1)}" data-t="${esc(s.title)}" data-cap="${esc(sp.cap)}">${meter(b)}<span class="wk-gl-w">${esc(b)}<span class="sr-only"> concentration. Show its specimen</span></span></button>` : '';
    return `<li data-level="${LEVEL[b] || 0}"${on ? ' class="is-shown"' : ''}><a class="wk-gl-a" ${pageLink(s.id)}><span class="wk-gl-n">${pad(i + 1)}</span><span class="wk-gl-t">${esc(s.title)}</span></a>${pick}</li>`;
  };
  const GLANCE = stages.length ? `<section class="wk-gl" aria-labelledby="wk-gl-h">
<h2 class="label wk-gl-h" id="wk-gl-h">The chain at a glance</h2>
${nExtreme ? `<p class="wk-gl-p"><b>${nExtreme} of the ${stages.length} stages</b> are rated Extreme${xMeaning ? `, meaning ${esc(xMeaning)}` : ' concentration'}.</p>` : ''}
<ol class="wk-gl-list">${stages.map(glanceRow).join('')}</ol>
</section>` : '';
  const first = stages[SHOW_FIRST] || {}, firstSpec = first.id ? specOf(first) : { spec: '', cap: '' };

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
    return `<li class="wk-step" id="${esc(stepId(ch.id))}" data-title="${esc(ch.title)}" data-number="${pad(ch.number)}" data-specimen="${esc((ch.meta && ch.meta.specimen) || '')}" data-caption="${esc((ch.meta && ch.meta.specimenCaption) || '')}">
<div class="wk-mark" aria-hidden="true"><span class="wk-n">${pad(ch.number)}</span></div>
<div class="wk-block">
<p class="wk-where"><span class="label">Chapter ${pad(ch.number)}</span>${stage ? `<span class="label wk-stage">${esc(stage)}</span>` : ''}</p>
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
     follow the reader into the deck (src/modules/walk.js). social.js writes the same cards on the static /intro/ page. */
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
<a href="#/chain"><b class="wk-tab">The Chain</b><span>The full semiconductor supply chain explained in detail, in ${word(all.length)} chapters, with all sources linked.</span></a>
<a href="#/landscape"><b class="wk-tab">AI Chips</b><span>The specs of ${(data.landscape || []).length} AI chips from Nvidia, AMD, Google, Huawei and others, compared side by side.</span></a>
<a href="#/suppliers"><b class="wk-tab">Suppliers</b><span>The ${(data.suppliers || []).length} companies behind the chain, on a map and stage by stage, and what each country makes.</span></a>
<a href="#/controls"><b class="wk-tab">Export Controls</b><span>The main rules since 2018, what can still be sold to China, and China's share of revenue at ${new Set((data.exposure || []).map((r) => r.firm)).size} firms, from their filings.</span></a>
<a href="#/glossary"><b class="wk-tab">Glossary</b><span>Plain definitions of every term, plus every company, chip and country, with the passages that mention them.</span></a>
</nav>`;

  const WALK = `<div class="wk">
<div class="wk-rail" id="wk-rail" data-show="0" aria-hidden="true" hidden><div class="wk-rail-bar"><i></i></div><p class="wk-rail-line"><span class="wk-rail-n"></span><span class="wk-rail-t"></span></p></div>
<header class="wk-head" id="wk-hero" data-specimen="${esc(firstSpec.spec)}" data-number="${first.id ? pad(SHOW_FIRST + 1) : ''}" data-title="${esc(first.title || '')}" data-caption="${esc(firstSpec.cap)}">
<h1 class="wk-title">How AI chips are made</h1>
<p class="wk-dek">An introduction to the entire semiconductor supply chain.</p>
<p class="wk-meta"><span class="label">${steps.length} paragraphs</span><span class="label">${walkWords.toLocaleString('en-US')} words</span><span class="label">about ${mins} min</span></p>
${GLANCE}
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

  return { WALK, START_HERE };
};
