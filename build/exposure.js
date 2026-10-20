// Joins the China revenue panel (data/exposure.json) to the rest of the site. The card's leader lines, the supplier list and
// the checks use it to find a firm's latest China share and to link to that firm's chart at #/exposure/<slug>.
// Pure functions only: build.js, its modules and qa/scripts require this file; src/app.js gets the same data through DATA.

// a name as a card or the supplier list prints it -> the firm's name in data/exposure.json
const ALIASES = {
  'Cadence Design Systems': 'Cadence',
  'Micron Technology': 'Micron',
  'Nova Ltd': 'Nova',
  'Disco Corporation': 'Disco',
  'AGC Inc.': 'AGC',
};
// a division or brand -> the company whose filings give the share. Its label names that company, so a share of the whole
// company is never read as the division's own.
const PARENTS = {
  'Samsung': 'Samsung Electronics',
  'Samsung Memory': 'Samsung Electronics',
  'Samsung Foundry': 'Samsung Electronics',
};

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const slug = (name) => String(name || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
// the same naming as the panel's charts (exposureViz in build.js): a year that ends in December keeps its label (FY2025);
// any other is named by its end month, so a year to March is never read as a calendar year
const fyName = (r) => { const [y, m] = String(r.fyEnd || '').split('-').map(Number); return m === 12 || !m ? r.fiscalYear : `year to ${MON[m - 1]} ${y}`; };
const sortKey = (r) => { const [y, m] = String(r.fyEnd || '').split('-').map(Number); return (y || 0) * 12 + (m || 0); };
// a share as the panel prints it: to one decimal where it is computed from the filed amounts, and as filed where the filing
// gives only a percentage and no China amount (Nova's whole percentages), so no precision is added: "29.1%", "33%"
const shareText = (r) => (r.chinaRevenue != null ? Number(r.chinaShare).toFixed(1) : String(r.chinaShare)) + '%';

function exposureIndex(rows) {
  const byFirm = {};
  (rows || []).filter((r) => r && r.firm && r.chinaShare != null && r.fyEnd).forEach((r) => { (byFirm[r.firm] = byFirm[r.firm] || []).push(r); });
  Object.keys(byFirm).forEach((f) => byFirm[f].sort((a, b) => sortKey(a) - sortKey(b)));
  const firmOf = (name) => { const n = String(name || ''); if (byFirm[n]) return n; const a = ALIASES[n] || PARENTS[n]; return a && byFirm[a] ? a : null; };
  return {
    byFirm,
    firmOf,
    // the newest year on file for a name, or null
    latest(name) { const f = firmOf(name); return f ? byFirm[f][byFirm[f].length - 1] : null; },
    href(name) { const f = firmOf(name); return f ? '#/exposure/' + slug(f) : null; },
    // "China 29.1% of revenue, FY2025", or "China 24.0% of Samsung Electronics revenue, FY2025" for a division
    label(name) {
      const f = firmOf(name); if (!f) return '';
      const r = byFirm[f][byFirm[f].length - 1];
      return `China ${shareText(r)} of ${PARENTS[name] ? f + ' ' : ''}revenue, ${fyName(r)}`;
    },
  };
}

module.exports = { ALIASES, PARENTS, slug, fyName, shareText, exposureIndex };
