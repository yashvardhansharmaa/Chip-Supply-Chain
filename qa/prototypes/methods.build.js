/* METHODS (#/methods): the scope statement, the rubric behind the chokepoint card, the four dataset
   method notes rendered in full, a field-by-field dictionary with downloads, the source rule, and the
   changelog. The page is off the tabs; the footer links it.

   The prose lives in data/methods.md. Every count on this page (band tallies, row counts, the build
   date) is computed here, so the page cannot drift from the site it describes. */

module.exports = function (ctx) {
  const { esc, path, root, read, readJSON, markdown, warn, data } = ctx;
  const dataDir = path.join(root, 'data');
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const built = new Date();
  const builtStr = `${built.getDate()} ${MONTHS[built.getMonth()]} ${built.getFullYear()}`;
  const num = (n) => Number(n).toLocaleString('en-US');
  const md = (file, id) => {
    const src = read(path.join(dataDir, file));
    if (!src) { warn(`methods: data/${file} is missing`); return null; }
    return markdown(src, { id, cites: [], figures: [] }).html;
  };

  /* ---------------- the rubric tables, tallied from the chapters themselves ---------------- */
  const chapters = data.chapters || [];
  const countBy = (key, v) => chapters.filter((c) => String(c[key] || '') === String(v)).length;
  // the rubric below describes the card as it stands. If the card changes under it, say so at build time.
  const unrated = chapters.filter((c) => !(c.substitutability && c.substitutability.band));
  if (unrated.length) warn(`methods: ${unrated.length} chapter(s) carry no substitutability band yet (${unrated.map((c) => c.id).join(', ')}); the tally below counts only the rated ones`);

  const CONC = [
    ['Extreme', 'Three or fewer, or one firm holding more than half the stage', '70 percent or more'],
    ['High', 'Four to six, with the top two taking most of the revenue', 'about 50 to 70 percent'],
    ['Moderate', 'Seven or more, none of them dominant', 'under 50 percent'],
    ['Low', 'Many, and the scarce input is something another industry sells at volume', 'no country above a third']
  ];
  const concTable = `<div class="table-wrap"><table>
<thead><tr><th scope="col">Band</th><th scope="col">Credible suppliers at the narrowest step</th><th scope="col">Top country in its segment</th><th scope="col">Chapters</th></tr></thead>
<tbody>${CONC.map(([band, sup, share]) => `<tr><td>${esc(band)}</td><td>${esc(sup)}</td><td>${esc(share)}</td><td>${countBy('concentration', band)}</td></tr>`).join('')}</tbody>
</table></div>`;

  const SUBS = [
    ['Easy', 'A qualified second source ships today at the leading node. Switching is contracts and months.'],
    ['Moderate', 'A second source exists but is not qualified at the leading node, or only at older nodes. A well-funded actor could close the gap in about two to five years.'],
    ['Hard', 'No second source at the leading node. A well-funded actor would need five to ten years, and the path is known.'],
    ['Very hard', 'No second source, and the path runs through physics, decades of unwritten know-how or protected IP. Ten years or more even for a well-funded state, and nobody has repeated it yet.']
  ];
  const countSub = (band) => chapters.filter((c) => c.substitutability && c.substitutability.band === band).length;
  const subsTable = `<div class="table-wrap"><table>
<thead><tr><th scope="col">Band</th><th scope="col">The test</th><th scope="col">Chapters</th></tr></thead>
<tbody>${SUBS.map(([band, test]) => `<tr><td>${esc(band)}</td><td>${esc(test)}</td><td>${countSub(band)}</td></tr>`).join('')}</tbody>
</table></div>`;

  /* ---------------- the page prose, with the two tables dropped in ---------------- */
  let proseHTML = md('methods.md', 'methods') || '<p>The methods text is not written yet.</p>';
  proseHTML = proseHTML.split('<p>{{table:concentration}}</p>').join(concTable).split('<p>{{table:substitutability}}</p>').join(subsTable);
  const parts = proseHTML.split('<p>{{split}}</p>');
  if (parts.length !== 2) warn('methods: data/methods.md is missing its {{split}} marker');
  const proseTop = parts[0];
  const proseSources = parts[1] || '';

  /* ---------------- the four dataset notes, in full, collapsed ---------------- */
  const NOTES = [
    ['chokepoint-matrix-notes.md', 'matrix', 'How the country-share matrix was built', 'data/chokepoint-matrix.json'],
    ['exposure-notes.md', 'exposure', 'What "China revenue" means, firm by firm', 'data/exposure.json'],
    ['landscape-notes.md', 'landscape', 'The accelerators, chip by chip', 'data/landscape.json'],
    ['control-thresholds-notes.md', 'thresholds', 'How to read the licence thresholds', 'data/control-thresholds.json']
  ];
  const notesHTML = NOTES.map(([file, key, title, dataset]) => {
    const html = md(file, 'methods-' + key);
    if (!html) return '';
    return `<details class="mt-note" id="methods--note-${esc(key)}">
<summary><span class="mt-note-title">${esc(title)}</span><span class="mt-note-file">${esc(dataset)}</span></summary>
<div class="mt-note-body"><div class="prose mt-prose">${html}</div><p class="mt-note-dl"><a href="${esc(dataset)}" download>Download ${esc(dataset.replace('data/', ''))}</a><a href="${esc('data/' + file)}" download>Download this note</a></p></div>
</details>`;
  }).join('\n');

  /* ---------------- data dictionary ---------------- */
  const rowsOf = (file, pick) => {
    const j = readJSON(path.join(dataDir, file), null);
    if (j == null) { warn(`methods: data/${file} is missing`); return 0; }
    const v = pick ? pick(j) : j;
    return Array.isArray(v) ? v.length : Object.keys(v).length;
  };

  const DATASETS = [
    ['Suppliers', 'suppliers.json', 'one per firm', rowsOf('suppliers.json'), [
      ['name', 'Name, in English.'],
      ['nativeName', 'Name in its own script.'],
      ['category', 'Which of the twenty stages.'],
      ['subcategory', 'What it makes there.'],
      ['country', 'Headquarters country code.'],
      ['city', 'Headquarters city.'],
      ['founded', 'Year founded.'],
      ['ticker', 'Stock symbol, or null if unlisted.'],
      ['ownership', 'Public, private, state-linked or subsidiary.'],
      ['role', 'What it does, in a sentence.'],
      ['chokepoint', 'Critical, Important, Contested or Diversified.'],
      ['shareNote', 'Market position, with the figure behind it.'],
      ['customers', 'Named buyers.'],
      ['aiRelevance', 'Why AI accelerators need it.'],
      ['revenueUSDb', 'Revenue, billions of dollars.'],
      ['revenueYear', 'Year that revenue covers.'],
      ['source', 'The document behind the row.']
    ]],
    ['AI accelerators', 'landscape.json', 'one per chip', rowsOf('landscape.json'), [
      ['id', 'Vendor-prefixed key; joins to layouts and notes.'],
      ['name', 'Product name.'],
      ['family', 'Architecture family.'],
      ['vendor', 'Who sells it.'],
      ['vendorCountry', 'Vendor’s home country code.'],
      ['announced', 'Year and month announced.'],
      ['shipping', 'When it shipped, or null.'],
      ['status', 'Shipping, announced, withdrawn or superseded.'],
      ['target', 'Training, inference or both.'],
      ['process', 'Foundry, node, wafer country.'],
      ['die', 'Count, area, transistors, reticle limit.'],
      ['package', 'Type, assembler, size.'],
      ['memory', 'Type, stacks, capacity, bandwidth, suppliers.'],
      ['compute', 'Dense FP16, FP8, FP4 TFLOPS, and the basis.'],
      ['tdpW', 'Rated power, watts.'],
      ['interconnect', 'Die-to-die, scale-up, scale-out links.'],
      ['systemIntegrators', 'Who builds the racks.'],
      ['priceEstimate', 'A published price, or null.'],
      ['bomEstimate', 'A published bill of materials, or null.'],
      ['exportStatus', 'Whether US rules catch it, and the arithmetic.'],
      ['notes', 'Spec-panel prose, from landscape-notes.md.'],
      ['layout', 'The package drawing.'],
      ['sources', 'Labelled links behind the row.']
    ]],
    ['Package layouts', 'landscape-layouts.json', 'one per chip, keyed by id', rowsOf('landscape-layouts.json'), [
      ['unit', 'The unit below, always mm.'],
      ['interposer', 'Interposer width and height.'],
      ['interposers', 'Several, where a package has more than one.'],
      ['dies', 'Each logic die: centre, width, height.'],
      ['hbm', 'Each memory stack, the same way.'],
      ['substrate', 'Substrate width and height.'],
      ['base', 'Base die under a stacked part.'],
      ['waferScale', 'True for a wafer-scale part.'],
      ['diameterMm', 'Wafer diameter.'],
      ['dieGrid', 'Columns and rows of dies.'],
      ['squareMm', 'Side of a square die.'],
      ['estimated', 'True where the geometry is inferred.'],
      ['note', 'What was inferred, and from what.'],
      ['sources', 'Where the dimensions come from.']
    ]],
    ['Export-control timeline', 'export-controls-timeline.json', 'one per event', rowsOf('export-controls-timeline.json'), [
      ['id', 'Key the flows cite.'],
      ['date', 'When it happened.'],
      ['actor', 'Who acted.'],
      ['title', 'What happened, in a headline.'],
      ['gist', 'The same, in one sentence.'],
      ['summary', 'The full account, with sources.'],
      ['category', 'Whose rule, or whether it is policy or corporate.'],
      ['flows', 'Which flows it moved.'],
      ['source', 'The rule or notice itself.'],
      ['effectiveDate', 'The day the outcome applied, when it differs from the date.'],
      ['frCitation', 'Federal Register volume and page, or the issuer’s own citation.'],
      ['cfr', 'The sections of 15 CFR the move touched.'],
      ['instrument', 'Rule, entity listing, denial order, licence policy, enforcement, countermeasure, screening, industrial policy, corporate or pending.']
    ]],
    ['The board: what can flow', 'control-flows.json', 'one per flow', rowsOf('control-flows.json', (j) => j.flows || []), [
      ['id', 'Key for the flow.'],
      ['name', 'What moves.'],
      ['short', 'The name, shortened.'],
      ['route', 'From where to where.'],
      ['what', 'What it covers, spelled out.'],
      ['order', 'Where it sits on the board.'],
      ['initial', 'State before the first rule, always open.'],
      ['chapter', 'The chapter that explains the flow.'],
      ['states', 'Each change: the effective date, the announcement date, the legal outcome (open, case, denial, prohibited, or policy for money and tariffs), a suspendedUntil date where the instrument is stayed, the label, the event id, and a cite with the Federal Register page, the CFR section and the document.']
    ]],
    ['China revenue exposure', 'exposure.json', 'one per firm-year', rowsOf('exposure.json'), [
      ['firm', 'The company.'],
      ['ticker', 'Stock symbol.'],
      ['country', 'Home country code.'],
      ['category', 'Where in the chain it sits.'],
      ['fiscalYear', 'The company’s own label.'],
      ['fyEnd', 'When the year closed. Compare on this, not the label.'],
      ['chinaRevenue', 'China revenue as filed, or null.'],
      ['totalRevenue', 'Total revenue as filed.'],
      ['currency', 'The unit both are in.'],
      ['chinaShare', 'Computed here from the two filed figures.'],
      ['basis', 'Ship-to, bill-to or headquarters. It decides comparability.'],
      ['source', 'The filing, usually an EDGAR R-file.'],
      ['note', 'Restatements and other breaks in the series.']
    ]],
    ['Country-share matrix', 'chokepoint-matrix.json', 'one per segment', rowsOf('chokepoint-matrix.json'), [
      ['segment', 'The step being measured.'],
      ['metric', 'Revenue or capacity share, and how counted.'],
      ['year', 'The year measured.'],
      ['shares', 'Percentage by country, or null.'],
      ['aiCritical', 'Whether leading-edge AI depends on it.'],
      ['trend', 'How the shares are moving.'],
      ['note', 'The judgment calls and the gaps.'],
      ['method', 'How the shares were obtained, in a sentence.'],
      ['basis', 'measured, derived, estimate or relayed.'],
      ['relayedVia', 'The firm whose figure a Tier A document passes on, when relayed.'],
      ['asOf', 'The year or fiscal year the shares describe.'],
      ['sources', 'The documents that contain or support the numbers.'],
      ['source', 'The first of those, kept for older tools.'],
      ['hhi', 'Herfindahl index of the country shares, 0 to 10,000; null where shares are null.'],
      ['top2', 'The two largest country shares summed; null where shares are null.']
    ]],
    ['Licence thresholds', 'control-thresholds.json', 'one per threshold', rowsOf('control-thresholds.json'), [
      ['id', 'Key for the threshold.'],
      ['regime', 'Whose rule it is.'],
      ['instrument', 'The instrument carrying it.'],
      ['scope', 'What that instrument covers.'],
      ['parameter', 'The quantity measured.'],
      ['operator', 'The comparison, from “at or above” to “designed for”.'],
      ['value', 'The number itself.'],
      ['unit', 'What the number counts, in full.'],
      ['alternative', 'Second leg of a two-part test.'],
      ['destinations', 'Who it applies to. Often matters more than the number.'],
      ['licensePolicy', 'What happens to an application.'],
      ['effectiveDate', 'When it started binding.'],
      ['status', 'In force, suspended, superseded, rescinded or never in force.'],
      ['amendedBy', 'Dates the number moved.'],
      ['chapter', 'The chapter explaining it.'],
      ['kind', 'Chips, memory, tools, fabs, systems, models, entities, trade, china.'],
      ['paramShort', 'The parameter, shortened.'],
      ['unitShort', 'The unit, shortened.'],
      ['note', 'What it catches, what it misses.'],
      ['source', 'The rule text, not a summary.'],
      ['sourceTier', 'That source’s tier. Every row is A.'],
      ['alsoSee', 'Further reading.']
    ]],
    ['Glossary', 'glossary.json', 'one per term', rowsOf('glossary.json'), [
      ['term', 'The term.'],
      ['aka', 'Spelled out, or what else it is called.'],
      ['plain', 'What it means, plainly.'],
      ['why', 'Why it matters here.'],
      ['chapter', 'Its chapter, or null.']
    ]],
    ['Bibliography', 'bibliography.json', 'one per URL, keyed by URL', rowsOf('bibliography.json'), [
      ['title', 'The document’s own title.'],
      ['publisher', 'Who published it.'],
      ['date', 'Its date, as published.'],
      ['type', 'Filing, regulation, report, dataset, article, page, release or transcript.'],
      ['accessed', 'When it was last fetched.'],
      ['unverified', 'True where the title is unconfirmed.']
    ]]
  ];

  const dictHTML = DATASETS.map(([label, file, unit, rows, fields]) => `<section class="mt-ds" id="methods--data-${esc(file.replace(/\.json$/, ''))}">
<h4 class="mt-ds-h">${esc(label)}<span class="mt-ds-file">data/${esc(file)}</span></h4>
<p class="mt-ds-line"><b>${num(rows)}</b> rows, ${esc(unit)}. <a class="mt-dl" href="data/${esc(file)}" download>Download</a></p>
<div class="mt-table-wrap"><table class="mt-table mt-dict">
<thead><tr><th scope="col">Field</th><th scope="col">What it holds</th></tr></thead>
<tbody>${fields.map(([f, d]) => `<tr><th scope="row">${esc(f)}</th><td>${esc(d)}</td></tr>`).join('')}</tbody>
</table></div>
</section>`).join('\n');

  /* ---------------- changelog ---------------- */
  const log = readJSON(path.join(dataDir, 'changelog.json'), []);
  if (!log.length) warn('methods: data/changelog.json is empty or missing');
  // dates read the way the board writes them ("10 Sept 2026"); the machine-readable one stays in datetime
  const logDate = (iso) => {
    const d = new Date(String(iso || '') + 'T00:00:00Z');
    return isNaN(d) ? String(iso || '') : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  };
  const logHTML = log.length
    ? `<ol class="mt-log">${log.map((e) => `<li><time class="mt-log-date" datetime="${esc(e.date || '')}">${esc(logDate(e.date))}</time><p>${esc(e.summary || '')}</p></li>`).join('')}</ol>`
    : '';

  /* ---------------- assemble ---------------- */
  const METHODS = `<div class="view-head">
<h2>Data and methods</h2>
<p class="dek">What this site covers, the rubric behind the chokepoint card, the four dataset notes in full, and every field in every file, with downloads.</p>
</div>
<div class="prose mt-prose">${proseTop}</div>

<div class="prose mt-prose">
<h3 id="methods--notes">The four dataset notes</h3>
<p>Four datasets carry a note on how they were built and where their numbers are weakest. Open one to read it in full.</p>
</div>
<div class="mt-notes">${notesHTML}</div>

<div class="prose mt-prose">
<h3 id="methods--dictionary">Data dictionary and downloads</h3>
<p>Every field in every file. The build copies these files into the published folder, so a download here is the same data the site draws.</p>
</div>
<div class="mt-dict-list">${dictHTML}</div>

<div class="prose mt-prose">${proseSources}</div>

<div class="prose mt-prose">
<h3 id="methods--version">Version and changelog</h3>
<p>This copy was built on <b>${esc(builtStr)}</b>. The build date is the version: every chapter and every dataset here was last touched on or before it, and the same date prints in the footer.</p>
</div>
${logHTML}
<p class="mt-reuse">Reuse terms: to be set by the author.</p>`;

  return { METHODS };
};
