// The latest rule and the next date: two quiet rows under the head of Export Controls, on both of its doors, the static page
// /export-controls/ (build/modules/reference-pages.js, under its "Open the interactive page" button) and the interactive board
// #/controls (src/template.html {{CONTROLS_LATEST}}, filled by build/build.js). Built 21 Nov 2026 from the story lens mockup
// "latest-rule", for Export Controls only, as the owner asked ("Build it only for the export controls page").
// Both rows are read from the data at build time and nothing in them is typed:
//   - the latest: the newest entry of data/export-controls-timeline.json by date (of two on one day, the later in the file, as
//     the timeline lists them), with its date, its actor and its words: the entry's "plain" (a short version in plain words,
//     written for an entry whose gist needs codes such as "D:5"), else its gist, else the first sentence of its summary, as the
//     interactive timeline shortens one (Geo.gistOf in src/app.js). The row says "Latest rule" when the entry is a rule
//     (instrument "rule") and "Latest move", the timeline's own word for an entry, when it is not.
//   - the next date: the earliest date in data/control-flows.json "upcoming" not yet passed on the build day (the day itself has
//     not passed), with its label. Once that day passes the next build drops it and shows the date after it, or no row at all;
//     the bi-weekly upkeep rebuilds the site. Between builds each page counts the days in the reader's own browser, as the
//     interactive page's next-date row does, and hides the row once the reader's day has passed it, so a past date never reads as next.
// Each row links to its entry in the timeline, at the address the page gives that entry (the static page's anchor, or the
// interactive page's #/controls/<id>); an upcoming date with no entry links to its source. Pure functions: build.js, its
// modules and the checks (qa/redesign/check-latest.js) require this file.
'use strict';

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// "19 Nov 2026": day first, as the board prints its dates (reference-pages.js shortDate, Geo.fmtDate in src/app.js)
const shortDate = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); return m && +m[2] >= 1 && +m[2] <= 12 ? `${+m[3]} ${MON[+m[2] - 1]} ${m[1]}` : String(iso || ''); };
const isDay = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
const entriesOf = (data) => { const t = data && data.timeline; return Array.isArray(t) ? t : ((t || {}).events || []); };
const upcomingOf = (data) => { const f = data && data.flows; return f && !Array.isArray(f) && Array.isArray(f.upcoming) ? f.upcoming : []; };
// one sentence for the entry (Geo.gistOf in src/app.js), with the entry's plain words first
const wordsOf = (e) => {
  if (e.plain) return String(e.plain);
  if (e.gist) return String(e.gist);
  const s = String(e.summary || '').trim(), m = s.match(/^[\s\S]*?[.!?](?=\s|$)/); let t = (m ? m[0] : s).trim();
  if (t.length > 140) t = t.slice(0, 139).replace(/\s+\S*$/, '') + '…';
  return t;
};

// { latest: { entry, kicker, date, when, actor, text } or null, next: { item, entry, date, when, text } or null }
function pick(data, today) {
  const evs = entriesOf(data).filter((e) => e && isDay(e.date));
  // a stable sort by date keeps the file's order within a day, as the timelines do
  const sorted = evs.map((e, i) => [e, i]).sort((a, b) => (a[0].date < b[0].date ? -1 : a[0].date > b[0].date ? 1 : a[1] - b[1])).map((x) => x[0]);
  const byId = new Map(sorted.filter((e) => e.id).map((e) => [e.id, e]));
  const e = sorted[sorted.length - 1];
  const latest = e ? { entry: e, kicker: e.instrument === 'rule' ? 'Latest rule' : 'Latest move', date: e.date, when: shortDate(e.date), actor: String(e.actor || ''), text: wordsOf(e) } : null;
  const ahead = upcomingOf(data).filter((u) => u && isDay(u.date) && u.label && String(u.date) >= String(today))
    .map((u, i) => [u, i]).sort((a, b) => (a[0].date < b[0].date ? -1 : a[0].date > b[0].date ? 1 : a[1] - b[1])).map((x) => x[0]);
  const u = ahead[0];
  const next = u ? { item: u, entry: (u.event && byId.get(u.event)) || null, date: u.date, when: shortDate(u.date), text: String(u.label).replace(/([^.!?])\s*$/, '$1.') } : null; // the label as a sentence, as the latest row's words are
  return { latest, next };
}

// the rows as one list, each row one link. o: { esc, safe (a URL as an href), entryHref (an entry -> its address on this page),
// cls (the list's class), nextToken (when given, the next row is left as this token and returned apart, so a page can put it in
// after it is dated: a row that changes as days pass, never as the data changes, must not move the page's "Updated" day) }
function rows(p, o) {
  const esc = o.esc, cls = o.cls || 'latest';
  // the link's words follow the text after a space set wider in CSS (-sp): a space, unlike a margin, leaves no indent when the
  // link wraps to a line of its own
  const go = (label) => `<span class="${cls}-sp"> </span><span class="${cls}-go">${label}&nbsp;<span aria-hidden="true">→</span></span>`;
  // the whole row is the link, as in the mockup: the kicker, the date, the words and the link's own words
  const row = (k, dateHTML, text, href, ext, extra) => {
    const inner = `<span class="${cls}-h"><span class="${cls}-k">${esc(k)}</span><span class="${cls}-d">${dateHTML}</span></span>`
      + `<span class="${cls}-t">${esc(text)}${href ? go(ext ? 'Source' : 'Entry in the timeline') : ''}</span>`;
    return `<li${extra || ''}>${href ? `<a class="${cls}-row" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${inner}</a>` : `<div class="${cls}-row">${inner}</div>`}</li>`;
  };
  const L = p.latest, N = p.next;
  const latestHTML = L ? row(L.kicker, `${esc(L.when)}${L.actor ? `<small>${esc(L.actor)}</small>` : ''}`, L.text, o.entryHref(L.entry), false) : '';
  let nextHTML = '';
  if (N) {
    const href = N.entry ? o.entryHref(N.entry) : (N.item.source && o.safe(N.item.source) !== '#' ? o.safe(N.item.source) : '');
    // the countdown is counted in the reader's browser (SCRIPT, and Geo.renderLatest in src/app.js), so the page never ships
    // a "7 days" that goes stale; without scripts the row shows the date alone
    nextHTML = row('Next date', `${esc(N.when)}<small class="${cls}-n"></small>`, N.text, href, !N.entry && !!href, ` data-due="${esc(N.date)}"`);
  }
  if (!latestHTML && !nextHTML) return { html: '', next: '' };
  const label = [L ? L.kicker : '', N ? 'next date' : ''].filter(Boolean).join(' and ');
  const list = `<ul class="${cls}" aria-label="${esc(label.charAt(0).toUpperCase() + label.slice(1))}">${latestHTML}${o.nextToken ? (nextHTML ? o.nextToken : '') : nextHTML}</ul>`;
  return { html: list, next: nextHTML };
}

// the countdown on the static page, in the reader's own day, worded as the interactive page's next-date row words it
// (Geo.whenText in src/app.js); a row whose day has passed for the reader is hidden. It runs once, where it stands, after the list.
const SCRIPT = `<script>(function(){var t=new Date();t=new Date(t.getFullYear(),t.getMonth(),t.getDate());[].forEach.call(document.querySelectorAll('.latest [data-due]'),function(li){var p=li.getAttribute('data-due').split('-').map(Number),n=Math.round((new Date(p[0],p[1]-1,p[2])-t)/864e5),s=li.querySelector('small');if(n<0){li.hidden=true;return;}if(s)s.textContent=n===0?'Today':n===1?'Tomorrow':'In '+n+' days';});})();</script>`;

module.exports = { pick, rows, shortDate, wordsOf, SCRIPT };
