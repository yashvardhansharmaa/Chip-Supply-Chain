// Converts a supplier's filed revenue to US dollars for the Suppliers page, the Index firm cards and the CSV export
// (qa/round3/SPEC.md section 2). The one computation the owner approved: the filed amount divided by the plain mean of the
// US Federal Reserve's monthly average rates (release G.5, stored as published in data/fx-rates.json) over the company's
// fiscal year, or multiplied by that mean for the currencies the Board quotes in US dollars per unit (AUD, EUR, GBP).
// Pure functions only. Usage: const fx = require('./fx')(rates), where rates is the parsed data/fx-rates.json.
// Self-test: node build/fx.js --test

const SCALE = { one: 1, thousand: 1e3, million: 1e6, billion: 1e9 };
const PER_USD = 'Currency units per U.S. dollar';
const USD_PER = 'U.S. dollars per currency unit';
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "2025-04" -> a month count (year * 12 + month index), so a span is a plain loop; null when malformed
const monthNum = (s) => { const m = /^(\d{4})-(\d{2})$/.exec(String(s || '')); return m && +m[2] >= 1 && +m[2] <= 12 ? +m[1] * 12 + +m[2] - 1 : null; };
const monthKey = (n) => `${Math.floor(n / 12)}-${String((n % 12) + 1).padStart(2, '0')}`;
const monthName = (n) => `${MON[n % 12]} ${Math.floor(n / 12)}`;

// a dollar figure to three significant figures, rounded before the scale word is chosen so $999.6 million reads as
// "about $1.00 billion": "about $16.4 billion", "about $812 million"; '' for anything that is not a positive number
function label(usd) {
  const n = Number(usd);
  if (usd == null || !isFinite(n) || n <= 0) return '';
  const r = Number(n.toPrecision(3));
  const [div, word] = r >= 1e12 ? [1e12, ' trillion'] : r >= 1e9 ? [1e9, ' billion'] : r >= 1e6 ? [1e6, ' million'] : r >= 1e3 ? [1e3, ' thousand'] : [1, ''];
  return `about $${(r / div).toPrecision(3)}${word}`;
}

function fx(rates) {
  const series = (rates && rates.currencies) || rates || {};
  // {amount, unit, currency, fyStart, fyEnd} -> {usd, rateAvg, months, basis}, or null when the currency has no series,
  // the unit or months are malformed, or any month of the fiscal year is missing from the Board's data.
  // A dollar filer passes through unconverted (rateAvg null, months 0), so the page can still size and sort it.
  function toUSD({ amount, unit, currency, fyStart, fyEnd } = {}) {
    const a = typeof amount === 'number' ? amount : NaN, scale = SCALE[unit], code = String(currency || '').toUpperCase();
    if (!isFinite(a) || !scale) return null;
    if (code === 'USD') return { usd: a * scale, rateAvg: null, months: 0, basis: 'Filed in US dollars, no conversion' };
    const s = series[code], from = monthNum(fyStart), to = monthNum(fyEnd);
    if (!s || !s.values || (s.unit !== PER_USD && s.unit !== USD_PER) || from == null || to == null || from > to) return null;
    let sum = 0;
    for (let m = from; m <= to; m++) {
      const v = s.values[monthKey(m)];
      if (typeof v !== 'number' || !isFinite(v) || v <= 0) return null;
      sum += v;
    }
    const months = to - from + 1, rateAvg = sum / months;
    const usd = s.unit === PER_USD ? (a * scale) / rateAvg : a * scale * rateAvg;
    const quote = s.unit === PER_USD ? `${code} per USD` : `USD per ${code}`;
    const basis = `US Federal Reserve G.5 monthly average rates, ${monthName(from)} to ${monthName(to)} (${months} months, series ${s.series}), mean ${rateAvg.toFixed(4)} ${quote}`;
    return { usd, rateAvg, months, basis };
  }
  return { toUSD, label };
}

module.exports = fx;
Object.assign(module.exports, { SCALE, PER_USD, USD_PER, label, monthKey, monthNum });

// node build/fx.js --test: the two cases worked by hand in qa/round3/fx-rates-notes.md, then the edge cases
if (require.main === module && process.argv.includes('--test')) {
  const rates = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'data', 'fx-rates.json'), 'utf8'));
  const f = fx(rates);
  let failed = 0;
  const near = (x, y) => Math.abs(x - y) <= 1e-12 * Math.abs(y);
  const check = (name, ok, got) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${got === undefined ? '' : ': ' + got}`); if (!ok) failed++; };
  // 1. yen, quoted per dollar: the SPEC's example input, 2,443,533 million yen, year to March 2026
  const a = f.toUSD({ amount: 2443533, unit: 'million', currency: 'JPY', fyStart: '2025-04', fyEnd: '2026-03' });
  check('JPY mean of 12 months = 1808.8766 / 12', a && a.months === 12 && near(a.rateAvg, 1808.8766 / 12), a && a.rateAvg);
  check('JPY 2,443,533 million / mean', a && near(a.usd, 2443533e6 / (1808.8766 / 12)), a && a.usd);
  check('JPY label', a && f.label(a.usd) === 'about $16.2 billion', a && f.label(a.usd));
  check('JPY basis', a && a.basis === 'US Federal Reserve G.5 monthly average rates, Apr 2025 to Mar 2026 (12 months, series RXI_N.M.JA), mean 150.7397 JPY per USD', a && a.basis);
  // 2. euro, quoted in dollars per euro: a test input of 1,000 million euros, calendar 2025
  const b = f.toUSD({ amount: 1000, unit: 'million', currency: 'EUR', fyStart: '2025-01', fyEnd: '2025-12' });
  check('EUR mean of 12 months = 13.5588 / 12 = 1.1299', b && b.months === 12 && near(b.rateAvg, 1.1299), b && b.rateAvg);
  check('EUR 1,000 million x mean', b && near(b.usd, 1.1299e9), b && b.usd);
  check('EUR label', b && f.label(b.usd) === 'about $1.13 billion', b && f.label(b.usd));
  // edge cases
  const c = f.toUSD({ amount: 1392905.2, unit: 'thousand', currency: 'KRW', fyStart: '2025-09', fyEnd: '2025-09' });
  check('KRW one month, unit thousand: 1,392,905,200 / 1392.9052', c && c.months === 1 && near(c.usd, 1e6), c && c.usd);
  check('unknown currency (ILS) -> null', f.toUSD({ amount: 1, unit: 'million', currency: 'ILS', fyStart: '2025-01', fyEnd: '2025-12' }) === null);
  check('month not yet published (2026-10) -> null', f.toUSD({ amount: 1, unit: 'million', currency: 'JPY', fyStart: '2025-11', fyEnd: '2026-10' }) === null);
  check('month before the data (2022-12) -> null', f.toUSD({ amount: 1, unit: 'million', currency: 'JPY', fyStart: '2022-12', fyEnd: '2023-11' }) === null);
  check('start after end -> null', f.toUSD({ amount: 1, unit: 'million', currency: 'JPY', fyStart: '2026-03', fyEnd: '2025-04' }) === null);
  check('unknown unit -> null', f.toUSD({ amount: 1, unit: 'lakh', currency: 'INR', fyStart: '2025-04', fyEnd: '2026-03' }) === null);
  check('amount null -> null', f.toUSD({ amount: null, unit: 'million', currency: 'JPY', fyStart: '2025-04', fyEnd: '2026-03' }) === null);
  const d = f.toUSD({ amount: 130497, unit: 'million', currency: 'USD', fyStart: '2025-02', fyEnd: '2026-01' });
  check('USD passes through unconverted', d && d.usd === 130497e6 && d.rateAvg === null && f.label(d.usd) === 'about $130 billion', d && f.label(d.usd));
  [[812e6, 'about $812 million'], [16.4e9, 'about $16.4 billion'], [999.6e6, 'about $1.00 billion'], [1.5e12, 'about $1.50 trillion'], [0, ''], [null, '']]
    .forEach(([x, want]) => check(`label(${x})`, f.label(x) === want, JSON.stringify(f.label(x))));
  console.log(failed ? `${failed} failed` : 'all passed');
  process.exitCode = failed ? 1 : 0;
}
