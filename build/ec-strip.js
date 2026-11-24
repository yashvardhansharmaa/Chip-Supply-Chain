// The history strip at the head of Export Controls, on both of its doors: the interactive board (#/controls, src/template.html
// {{CONTROLS_STRIP}}, filled by build/build.js) and the static page /export-controls/ (build/modules/reference-pages.js). The
// owner chose option A of the first-screen mocks on 24 Nov 2026 ("keep history chart, the latest, the most upcoming next thing,
// and then start with the timeline immediately"; qa/builds-nov/round-24nov/shots/ec/a-1440.png).
// The strip is a list of the main rules since 2018, each one link to its entry in the timeline. src/modules/ec-strip.js draws it
// from 760 px as a line from 1 January 2018 to the reader's today, each rule a dot on its true date and its label set on the
// lowest tier where it covers no other label or leader; under 760 px the list stays upright, one rule a row. The latest rule
// ends the line in the accent. Nothing here is typed: each mark is a timeline entry, its label the opening words of the entry's
// own title (the full title is the link's title and its accessible name), and the latest is the newest entry, as
// build/latest-rule.js picks it. Pure functions: build.js and reference-pages.js require this file.
'use strict';

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// The main rules: each changed what can be sold on the board (data/control-flows.json) and each was the first of its kind.
// [entry id, the opening words of its title that label its mark]
const MAIN = [
  ['2018-04-15-zte-denial', 'ZTE denial order activated'],
  ['2019-05-16-huawei-listed', 'Huawei and 68 affiliates added to the Entity List'],
  ['2020-08-17-fdpr-broadened', 'Huawei FDPR broadened'],
  ['2022-10-07-october-rules', 'October 2022 rules'],
  ['2023-07-03-gallium-germanium', 'Gallium and germanium export licensing'],
  ['2024-12-02-hbm-package', 'December 2024 equipment and HBM package'],
  ['2025-01-13-diffusion-rule', 'AI Diffusion Rule announced'],
  ['2026-01-15-h200-case-by-case', 'H200-class chips move to case-by-case licensing for China'],
];
// The Japanese and Dutch chipmaking-tool controls of 2023 (owner, 24 Nov 2026: "yep, add the major export controls from japan
// and netherlands on the strip"). This line is the switch: false takes both marks off the strip on both pages.
const NON_US_2023 = true;
const NON_US = [
  ['2023-07-23-japan-tools', 'Japanese controls on 23 categories'],
  ['2023-09-01-dutch-licence', 'Dutch license requirement'],
];
// later Dutch and Japanese tightenings, drawn only while their labels still fit the strip (see src/modules/ec-strip.js).
// A third field 'effective' sets the mark on the day the entry took effect (its effectiveDate), as the 2023 non-US marks
// already stand: Japan's 2025 order was promulgated on 28 March and took effect on 28 May (expert review F12, 24 Nov 2026)
const NON_US_LATER = true;
const LATER = [
  ['2024-09-06-dutch-extension', 'Dutch controls extended'],
  ['2025-03-28-japan-advanced-chips', 'Japan adds advanced chips', 'effective'],
];

const entriesOf = (data) => { const t = data && data.timeline; return Array.isArray(t) ? t : ((t || {}).events || []); };
const monthYear = (iso) => MON[+String(iso).slice(5, 7) - 1] + ' ' + String(iso).slice(0, 4);
const dayFull = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); return m ? `${+m[3]} ${MON[+m[2] - 1]} ${m[1]}` : String(iso || ''); };
// the latest entry's short label: its title's opening words, up to the first that reaches 18 characters ("Remote access rule")
const opening = (title) => { const w = String(title || '').split(/\s+/); let out = ''; for (const x of w) { out = out ? out + ' ' + x : x; if (out.length >= 18) break; } return out; };

// the marks in date order: { entry, short, latest, date } (date: the day the mark stands on)
function marks(data, warn) {
  const evs = entriesOf(data).filter((e) => e && /^\d{4}-\d{2}-\d{2}$/.test(String(e.date || '')));
  const sorted = evs.map((e, i) => [e, i]).sort((a, b) => (a[0].date < b[0].date ? -1 : a[0].date > b[0].date ? 1 : a[1] - b[1])).map((x) => x[0]);
  const byId = new Map(sorted.filter((e) => e.id).map((e) => [e.id, e]));
  const latest = sorted[sorted.length - 1];
  const want = MAIN.concat(NON_US_2023 ? NON_US : []).concat(NON_US_2023 && NON_US_LATER ? LATER : []);
  const out = [];
  want.forEach(([id, short, on]) => {
    const e = byId.get(id);
    if (!e) { if (warn) warn(`history strip: no timeline entry ${id}, so its mark is left out`); return; }
    if (!String(e.title || '').startsWith(short)) { if (warn) warn(`history strip: "${short}" is not the opening of the title of ${id}, so the full title labels it`); short = e.title; }
    if (latest && e === latest) return;
    const day = on === 'effective' && /^\d{4}-\d{2}-\d{2}$/.test(String(e.effectiveDate || '')) ? e.effectiveDate : e.date;
    out.push({ entry: e, short, latest: false, date: day });
  });
  if (latest) out.push({ entry: latest, short: opening(latest.title), latest: true, date: latest.date });
  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (a.latest ? 1 : b.latest ? -1 : 0)));
}

// the strip's markup. o: { esc, href (an entry -> its address on this page) }
function html(data, o) {
  const esc = o.esc, ms = marks(data, o.warn);
  if (!ms.length) return '';
  const li = (m) => {
    const e = m.entry, rest = String(e.title).slice(m.short.length), day = m.date || e.date;
    const name = `${dayFull(day)}, ${e.title}`;
    return `<li class="ec-m${m.latest ? ' is-latest' : ''}" data-date="${esc(day)}"><a href="${o.href(e)}" title="${esc(dayFull(day) + ' · ' + e.title)}" aria-label="${esc((m.latest ? 'Latest rule, ' : '') + name)}">`
      + '<i class="ec-dot" aria-hidden="true"></i><i class="ec-lead" aria-hidden="true"></i>'
      + `<span class="ec-lab"><span class="ec-md">${esc(monthYear(day))}</span><span class="ec-mt">${esc(m.short)}${m.latest && rest ? `<span class="ec-mt-rest">${esc(rest)}</span>` : ''}</span></span></a></li>`;
  };
  return `<figure class="ec-a" aria-label="The main export control rules since ${esc(String(ms[0].date || ms[0].entry.date).slice(0, 4))}"><ol class="ec-strip">${ms.map(li).join('')}</ol><div class="ec-axis" aria-hidden="true"></div></figure>`;
}

module.exports = { marks, html, MAIN, NON_US, LATER, NON_US_2023, NON_US_LATER };
