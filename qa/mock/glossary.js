// Glossary redesign mocks from real data. node qa/mock/glossary.js  (writes qa/mock/glossary-*.html)
const fs = require('fs'), path = require('path');
const G = JSON.parse(fs.readFileSync('data/glossary.json', 'utf8')); const TERMS = (G.terms || G).slice().sort((a, b) => a.term.localeCompare(b.term));
const EV = JSON.parse(fs.readFileSync('data/export-controls-timeline.json', 'utf8')); const EVENTS = EV.events || EV;
const FL = JSON.parse(fs.readFileSync('data/control-flows.json', 'utf8')).flows;
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
// chapters: id -> {number, title, body}
const CH = {};
fs.readdirSync('content').filter((f) => /^\d\d-.*\.md$/.test(f)).forEach((f) => {
  const raw = fs.readFileSync(path.join('content', f), 'utf8'); const m = raw.match(/^---(?:json)?\n([\s\S]*?)\n---\n([\s\S]*)$/); if (!m) return;
  const meta = JSON.parse(m[1]); CH[meta.id] = { number: meta.number, title: meta.title, body: m[2] };
});
const SHORTG = (t) => !t.chapter ? 'card' : t.chapter === 'geopolitics' ? 'rules' : t.chapter === 'introduction-and-goals' ? 'basics' : (CH[t.chapter] ? 'ch ' + String(CH[t.chapter].number).padStart(2, '0') : t.chapter);
const GROUP = (t) => !t.chapter ? 'The card' : t.chapter === 'geopolitics' ? 'The rules' : t.chapter === 'introduction-and-goals' ? 'The basics' : (CH[t.chapter] ? CH[t.chapter].title : t.chapter);
const clean = (s) => String(s).replace(/\(\[source\]\([^)]*\)\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`#>]/g, '').replace(/\s+/g, ' ').trim();
const sentences = (text) => clean(text).split(/(?<=[.!?])\s+(?=[A-Z"'(])/);
const hl = (s, re) => esc(s).replace(re, (m) => `<mark>${m}</mark>`);

// ---------- the demo query ----------
const Q = 'FDPR'; const QRE = /\bFDPR\b|foreign[- ]direct[- ]product/gi;
const defs = TERMS.filter((t) => QRE.test(t.term + ' ' + (t.aka || '')) ); QRE.lastIndex = 0;
const related = TERMS.filter((t) => !defs.includes(t) && QRE.test(t.plain + ' ' + (t.why || ''))); QRE.lastIndex = 0;
const mentions = [];
Object.keys(CH).forEach((id) => { sentences(CH[id].body).forEach((s) => { if (QRE.test(s)) mentions.push({ src: `Chapter ${String(CH[id].number).padStart(2, '0')} · ${CH[id].title}`, href: '#' + id, text: s }); QRE.lastIndex = 0; }); });
EVENTS.forEach((e) => { const s = clean(e.gist || e.title || ''); const s2 = clean(e.summary || ''); if (QRE.test(s + ' ' + s2)) mentions.push({ src: `The board · ${e.date}`, href: '#/controls', text: (QRE.test(s) ? s : s2.split(/(?<=[.!?])\s/).find((x) => QRE.test(x)) || s) }); QRE.lastIndex = 0; });
FL.forEach((f) => f.states.forEach((s) => { if (QRE.test(s.label || '')) mentions.push({ src: `The board · ${f.name}`, href: '#/controls', text: s.label }); QRE.lastIndex = 0; }));
const shown = mentions.slice(0, 6);

// ---------- shared chrome ----------
const HEAD = `<meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@500;600;800&family=IBM+Plex+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap">
<style>
:root{--bg:#edeff0;--bg-2:#e4e7e9;--bg-3:#d9dde0;--ink:#12161a;--ink-2:#3a434c;--muted:#5b646d;--line:#cbd0d4;--line-2:#b6bcc1;--accent:#c98a12;--accent-ink:#7a5406;--accent-soft:rgba(201,138,18,.14);
--font-display:"IBM Plex Sans Condensed",Arial,sans-serif;--font-body:"Newsreader",Georgia,serif;--font-mono:"IBM Plex Mono",Menlo,monospace}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-body);font-size:16px;line-height:1.5}
.mast{display:flex;align-items:center;gap:18px;padding:14px 44px;border-bottom:1px solid var(--line);background:var(--bg)}
.mast b{font-family:var(--font-display);font-weight:800;font-size:19px;letter-spacing:.02em;text-transform:uppercase}.mast small{font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.mast nav{margin-left:auto;display:flex;gap:16px;font-family:var(--font-display);font-weight:600;font-size:13.5px}.mast nav span.on{background:var(--ink);color:var(--bg);padding:4px 9px;border-radius:3px}
.wrap{padding:34px 44px 44px;max-width:1120px}
h1{font-family:var(--font-display);font-weight:800;font-size:44px;line-height:1;letter-spacing:-.01em;text-transform:uppercase;margin:0 0 10px}
.dek{color:var(--ink-2);font-size:18px;max-width:640px;margin:0 0 26px}
.k{font-family:var(--font-mono);font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted)}
.bar{position:relative;max-width:760px}
.bar input{width:100%;font:inherit;font-family:var(--font-body);font-size:24px;padding:16px 56px 16px 20px;border:1.5px solid var(--ink-2);border-radius:4px;background:#f6f7f8;color:var(--ink);outline:none}
.bar input::placeholder{color:#8a939b}.bar input.has{border-color:var(--accent)}
.bar .go{position:absolute;right:10px;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:3px;background:var(--ink);color:var(--bg);display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:14px}
.bar .hint{font-family:var(--font-mono);font-size:11px;color:var(--muted);margin:10px 0 0;letter-spacing:.02em}
mark{background:var(--accent-soft);color:var(--accent-ink);padding:0 2px;border-radius:2px}
.note{font-family:var(--font-mono);font-size:11px;color:var(--muted);line-height:1.5;margin-top:26px;max-width:760px;border-top:1px dashed var(--line-2);padding-top:12px}
.tag{display:inline-block;font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;padding:2px 7px;border:1px solid var(--line-2);border-radius:3px;color:var(--ink-2);margin-left:8px;vertical-align:middle;background:var(--bg-2)}
/* index */
.idx{margin-top:34px}.idx .letter{display:grid;grid-template-columns:44px 1fr;gap:12px;padding:12px 0;border-top:1px solid var(--line);align-items:baseline}
.idx .letter:last-child{border-bottom:1px solid var(--line)}.idx .L{font-family:var(--font-display);font-weight:800;font-size:22px;color:var(--ink-2)}
.idx .terms{display:flex;flex-wrap:wrap;gap:6px 14px}.idx .t{font-family:var(--font-display);font-weight:600;font-size:15px;color:var(--ink);text-decoration:none;border-bottom:1px solid transparent}.idx .t:hover{border-color:var(--ink)}
.idx .t small{font-family:var(--font-mono);font-weight:400;font-size:10px;color:var(--muted);margin-left:5px}
/* results */
.res{margin-top:30px;max-width:760px}.res h2{font-family:var(--font-mono);font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted);font-weight:600;margin:28px 0 12px}
.def{border:1px solid var(--line-2);border-radius:4px;background:var(--bg-2);padding:18px 22px 16px;box-shadow:0 1px 0 rgba(18,22,26,.06),0 8px 24px rgba(18,22,26,.08)}
.def .term{font-family:var(--font-display);font-weight:800;font-size:26px;line-height:1.05;margin:0}.def .aka{font-family:var(--font-mono);font-size:11px;color:var(--muted);margin:6px 0 12px}
.def p{margin:0 0 10px;font-size:17px}.def .why{color:var(--ink-2);font-size:15.5px}.def .read{font-family:var(--font-display);font-weight:600;font-size:13.5px;color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.men{list-style:none;margin:0;padding:0}.men li{display:grid;grid-template-columns:190px 1fr;gap:16px;padding:11px 0;border-top:1px solid var(--line)}.men li:last-child{border-bottom:1px solid var(--line)}
.men .src{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.04em;color:var(--ink-2);line-height:1.5;padding-top:3px}.men .src b{display:block;color:var(--ink);font-weight:600}.men .txt{font-size:15.5px;line-height:1.45}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chip{font-family:var(--font-display);font-weight:600;font-size:13.5px;padding:5px 10px;border:1px solid var(--line-2);border-radius:3px;background:var(--bg-2);color:var(--ink)}
/* two pane */
.two{display:grid;grid-template-columns:270px 1fr;gap:34px;margin-top:8px;align-items:start}
.pane{border:1px solid var(--line-2);border-radius:4px;background:var(--bg-2);overflow:hidden}
.pane .s{padding:10px;border-bottom:1px solid var(--line-2)}.pane .s input{width:100%;font:inherit;font-family:var(--font-body);font-size:16px;padding:9px 12px;border:1px solid var(--line-2);border-radius:3px;background:#f6f7f8}
.pane ul{list-style:none;margin:0;padding:6px 0;max-height:560px;overflow:hidden}.pane li{font-family:var(--font-display);font-weight:600;font-size:14px;padding:6px 14px;color:var(--ink-2);display:flex;justify-content:space-between;gap:8px}
.pane li small{font-family:var(--font-mono);font-weight:400;font-size:9.5px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase}
.pane li.on{background:var(--ink);color:var(--bg)}.pane li.on small{color:#b6bcc1}.pane .more{font-family:var(--font-mono);font-size:10px;color:var(--muted);padding:6px 14px 10px;letter-spacing:.06em}
/* groups */
.groups{display:flex;flex-wrap:wrap;gap:8px;margin:26px 0 8px}.grp{font-family:var(--font-mono);font-size:11px;letter-spacing:.04em;padding:7px 11px;border:1px solid var(--line-2);border-radius:3px;background:var(--bg-2);color:var(--ink-2)}
.grp b{font-weight:600;color:var(--ink)}.grp.on{background:var(--ink);color:var(--bg)}.grp.on b{color:var(--bg)}.grp.rules{border-color:var(--accent);background:var(--accent-soft);color:var(--accent-ink)}.grp.rules b{color:var(--accent-ink)}
.glist{columns:2;column-gap:40px;margin-top:18px;max-width:1000px}.glist .g{break-inside:avoid;padding:10px 0;border-top:1px solid var(--line)}
.glist .gt{font-family:var(--font-display);font-weight:700;font-size:16px;margin:0}.glist .gd{margin:2px 0 0;font-size:15px;color:var(--ink-2);line-height:1.4}
</style>`;
const MAST = `<div class="mast"><b>Compute Chokepoints</b><small>The AI chip supply chain</small><nav><span>Start here</span><span>The Chain</span><span>AI Chips</span><span>Suppliers</span><span>Export Controls</span><span class="on">Glossary</span></nav></div>`;
const DEK = `<p class="dek">The chip supply chain runs on jargon. Type any term, and this page gives you the definition and the places the site uses it.</p>`;
const bar = (val) => `<div class="bar"><input value="${esc(val)}" class="${val ? 'has' : ''}" placeholder="A term, an acronym, a firm: FDPR, TPP, EUV, CoWoS, Entity List…" readonly><span class="go">↵</span><p class="hint">${TERMS.length} definitions · also searches the seventeen chapters, the board and the AI chips page</p></div>`;

// ---------- A: search first ----------
const shortAka = (t) => ((t.aka || '').split(/[;,]/).map((x) => x.trim()).find((x) => x && x.length <= 12 && x.toLowerCase() !== t.term.toLowerCase()) || '');
const letters = {}; TERMS.forEach((t) => { const L = t.term[0].toUpperCase(); (letters[L] = letters[L] || []).push(t); });
const index = `<div class="idx">${Object.keys(letters).sort().map((L) => `<div class="letter"><span class="L">${L}</span><div class="terms">${letters[L].map((t) => `<a class="t" href="#">${esc(t.term)}${shortAka(t) ? `<small>${esc(shortAka(t))}</small>` : ''}</a>`).join('')}</div></div>`).join('')}</div>`;
const A_rest = `${HEAD}${MAST}<div class="wrap"><h1>Glossary</h1>${DEK}${bar('')}${index}
<p class="note">Design A, at rest. One bar, then every term by first letter, names only (the short form beside it where one exists). Nothing else on the page until you type or click; a click opens that one definition in place. The wall of ${TERMS.length} paragraphs is gone.</p></div>`;
const defHTML = (t) => `<article class="def"><h3 class="term">${esc(t.term)}</h3>${t.aka ? `<p class="aka">also: ${esc(t.aka)}</p>` : ''}<p>${esc(t.plain)}</p>${t.why ? `<p class="why">${esc(t.why)}</p>` : ''}${t.chapter && CH[t.chapter] ? `<a class="read" href="#${esc(t.chapter)}">Read it in context: ${esc(CH[t.chapter].title)} →</a>` : ''}</article>`;
const A_query = `${HEAD}${MAST}<div class="wrap"><h1>Glossary</h1>${DEK}${bar(Q)}
<div class="res"><h2>${defs.length} definition${defs.length === 1 ? '' : 's'}</h2>${defs.map(defHTML).join('')}
<h2>Where the site uses it <span class="tag">${mentions.length} places</span></h2><ul class="men">${shown.map((m) => `<li><span class="src"><b>${esc(m.src.split(' · ')[0])}</b>${esc(m.src.split(' · ').slice(1).join(' · '))}</span><span class="txt">${hl(m.text, QRE)}</span></li>`).join('')}</ul>
${related.length ? `<h2>Terms whose definitions mention it</h2><div class="chips">${related.map((t) => `<span class="chip">${esc(t.term)}</span>`).join('')}</div>` : ''}</div>
<p class="note">Design A, after typing "${Q}". The definition first, then real passages from the chapters and the board with the term marked, each linking to its spot, then the related terms. A word with no definition (a firm, a tool model) still returns its mentions. Results update as you type; Escape clears back to the index.</p></div>`;

// ---------- B: dictionary two-pane ----------
const sel = defs[0] || TERMS[0]; const si = TERMS.indexOf(sel); const win = TERMS.slice(Math.max(0, si - 9), si + 14);
const B = `${HEAD}${MAST}<div class="wrap"><h1>Glossary</h1>${DEK}<div class="two"><aside class="pane"><div class="s"><input value="${esc(Q)}" readonly></div><ul>${win.map((t) => `<li class="${t === sel ? 'on' : ''}"><span>${esc(t.term)}</span><small>${esc(SHORTG(t))}</small></li>`).join('')}</ul><p class="more">${TERMS.length} terms · scroll or type to jump</p></aside>
<div><div class="res" style="margin-top:0">${defHTML(sel)}<h2>Where the site uses it <span class="tag">${mentions.length} places</span></h2><ul class="men">${shown.slice(0, 4).map((m) => `<li><span class="src"><b>${esc(m.src.split(' · ')[0])}</b>${esc(m.src.split(' · ').slice(1).join(' · '))}</span><span class="txt">${hl(m.text, QRE)}</span></li>`).join('')}</ul></div></div></div>
<p class="note">Design B, a dictionary in two panes. The list on the left is always there, so a browser can wander; typing filters it and the first hit opens on the right with its passages. On a phone the list collapses to the search box and the entry fills the screen.</p></div>`;

// ---------- C: browse by the chain ----------
const groups = {}; TERMS.forEach((t) => { const g = GROUP(t); (groups[g] = groups[g] || []).push(t); });
const ORDER = ['The basics'].concat(Object.keys(CH).filter((id) => CH[id].number <= 16).sort((a, b) => CH[a].number - CH[b].number).map((id) => CH[id].title)).concat(['The rules', 'The card']);
const cur = 'The rules';
const C = `${HEAD}${MAST}<div class="wrap"><h1>Glossary</h1>${DEK}${bar('')}
<div class="groups">${ORDER.filter((g) => groups[g]).map((g) => `<span class="grp ${g === cur ? 'on' : ''} ${g === 'The rules' && g !== cur ? 'rules' : ''}">${esc(g)} <b>${groups[g].length}</b></span>`).join('')}</div>
<div class="glist">${groups[cur].map((t) => `<div class="g"><p class="gt">${esc(t.term)}</p><p class="gd">${esc(t.plain.split(/(?<=[.!?])\s/)[0])}</p></div>`).join('')}</div>
<p class="note">Design C, browse by where the word lives. The same bar on top, then one chip per stage of the chain plus "The rules" for the export-control vocabulary (${groups['The rules'].length} terms, the group most readers come for). A chip shows its terms with their first sentence; the full entry opens on click. Typing searches across all groups as in A.</p></div>`;

fs.writeFileSync('qa/mock/glossary-a-rest.html', A_rest); fs.writeFileSync('qa/mock/glossary-a-query.html', A_query); fs.writeFileSync('qa/mock/glossary-b.html', B); fs.writeFileSync('qa/mock/glossary-c.html', C);
console.log('defs', defs.map((d) => d.term), 'mentions', mentions.length, 'related', related.length, 'groups', Object.keys(groups).length);
