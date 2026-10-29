/* A figure range ("$350-400M", "2023-2025") is one unit on the page: wrap it in .nw (src/styles.css) so no line breaks at its
   hyphen (font check, 27 Oct 2026). Text only: tags, scripts, styles, the title, SVG drawings, select options, code and
   preformatted text stay as they are.
   The same pass sets typographer's quotes in the reading text (design10 chapter P1.3, 29 Oct 2026): the build's own strings were
   curly and the chapters' straight, so both shared a page. An apostrophe inside or after a word is ’, a quote that opens after a
   space or bracket is ‘ or “, and any other is ’ or ”. The last character carries across tags, so "TSMC</button>'s" reads ’s. */
const SKIP = /(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<title\b[\s\S]*?<\/title>|<svg\b[\s\S]*?<\/svg>|<option\b[\s\S]*?<\/option>|<textarea\b[\s\S]*?<\/textarea>|<code\b[\s\S]*?<\/code>|<pre\b[\s\S]*?<\/pre>|<[^>]+>)/i;
const RANGE = /(?<![\w$.,-])\$?\d+(?:[.,]\d+)*-\$?\d+(?:[.,]\d+)*[A-Za-z%]{0,2}(?![\w-])/g; // not part of a date or code such as 2025-12-31 or GAO-26-107882
const quotes = (t, prev) => {
  if (!/['"]|&quot;|&#0?39;|&#x27;/i.test(t)) return t;
  t = t.replace(/&quot;/g, '"').replace(/&#0?39;|&#x27;/gi, "'");
  t = t.replace(/(\w)'(\w)/g, '$1’$2');
  t = t.replace(/^'(?=\w)/, /\w$/.test(prev) ? '’' : '‘');
  t = t.replace(/([\s(\[“])'/g, '$1‘');
  t = t.replace(/'/g, '’');
  t = t.replace(/^"/, /[\w.,!?’)]$/.test(prev) ? '”' : '“');
  t = t.replace(/([\s(\[‘—–-])"/g, '$1“');
  t = t.replace(/"/g, '”');
  return t;
};
module.exports = (html) => {
  let prev = ' ';
  return String(html).split(SKIP).map((part, i) => {
    // a skipped block (a script, a drawing) or a block-level tag starts a new run; an inline tag (a link, a term button) does not
    if (i % 2) { if (!/^<[^>]+>$/.test(part) || /^<\/?(p|div|li|ul|ol|h[1-6]|td|th|tr|table|section|article|header|footer|figure|figcaption|blockquote|dd|dt|dl|br|aside|nav|main)\b/i.test(part)) prev = ' '; return part; }
    const q = quotes(part, prev);
    if (q.length) prev = q.slice(-1);
    return q.replace(RANGE, (r) => `<span class="nw">${r}</span>`);
  }).join('');
};
