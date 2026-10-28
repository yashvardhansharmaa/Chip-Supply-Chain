/* A small reader of the site's own HTML, for the build (28 Oct 2026). The search index and the Glossary's passages used to be
   read from the page at run time (src/app.js Tools.buildIndex, src/modules/lookup.js corpus), when the home page held every
   chapter. Each chapter now has a page of its own, so the build reads the same parts of the same markup and ships them as
   data (build/build.js, dist/assets/search.js and glossary.js), and these helpers follow the browser's rules where the old
   code relied on them: textContent joins the text of an element's descendants; text() also puts a space at each element's
   edge, as lookup.js textOf does; a <template>'s content and the text of <script> and <style> are no part of the page's text.
   It reads only HTML the build wrote, which closes what it opens, so it does not repair markup as a browser would. */
'use strict';
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style', 'template']); // their insides are not read as elements
const ENTITY = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '­' };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENTITY[e.toLowerCase()] != null ? ENTITY[e.toLowerCase()] : m));

function parse(html) {
  const root = { tag: '#root', attrs: {}, kids: [], parent: null };
  let cur = root;
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let last = 0, m;
  const text = (s) => { if (s) cur.kids.push({ tag: '#text', text: decode(s), parent: cur }); };
  while ((m = re.exec(html))) {
    text(html.slice(last, m.index)); last = re.lastIndex;
    if (m[0].startsWith('<!--')) continue;
    const tag = m[2].toLowerCase();
    if (m[1]) { // a closing tag closes the nearest open element of its name
      let at = cur; while (at && at.tag !== tag) at = at.parent;
      if (at && at.parent) cur = at.parent;
      continue;
    }
    const attrs = {};
    for (const a of m[3].matchAll(/([^\s=\/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[a[1].toLowerCase()] = decode(a[2] != null ? a[2] : a[3] != null ? a[3] : a[4] || '');
    const el = { tag, attrs, kids: [], parent: cur };
    cur.kids.push(el);
    if (RAW.has(tag)) { // skip to its own end: its content is inert
      const end = html.toLowerCase().indexOf('</' + tag, re.lastIndex);
      re.lastIndex = last = end < 0 ? html.length : html.indexOf('>', end) + 1;
      continue;
    }
    if (!VOID.has(tag) && !/\/$/.test(m[3])) cur = el;
  }
  text(html.slice(last));
  return root;
}
const isEl = (n) => n.tag && n.tag[0] !== '#';
const classes = (n) => String((n.attrs || {}).class || '').split(/\s+/).filter(Boolean);
const hasClass = (n, c) => classes(n).includes(c);
// every element under n, in document order
function all(n, out = []) { for (const k of n.kids || []) if (isEl(k)) { out.push(k); all(k, out); } return out; }
const textContent = (n) => (n.tag === '#text' ? n.text : RAW.has(n.tag) ? '' : (n.kids || []).map(textContent).join(''));
// as lookup.js textOf: an element's edge counts as a space
const text = (n) => (n.kids || []).map((k) => (k.tag === '#text' ? k.text : isEl(k) && !RAW.has(k.tag) ? ' ' + text(k) + ' ' : '')).join('');
const closest = (n, test) => { for (let at = n; at && at.tag !== '#root'; at = at.parent) if (test(at)) return at; return null; };
const elementKids = (n) => (n.kids || []).filter(isEl);
const nextElement = (n) => { const sib = elementKids(n.parent); return sib[sib.indexOf(n) + 1] || null; };
// a copy of n without the descendants test(child) picks
const without = (n, test) => ({ tag: n.tag, attrs: n.attrs, parent: null, kids: (n.kids || []).filter((k) => !(isEl(k) && test(k))).map((k) => (isEl(k) ? without(k, test) : k)) });

module.exports = { parse, all, textContent, text, closest, hasClass, classes, elementKids, nextElement, without, decode };
