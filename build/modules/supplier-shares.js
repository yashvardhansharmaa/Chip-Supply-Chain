/* WHICH COUNTRIES HOLD EACH SEGMENT, BY SHARE: the Suppliers ribbons (the owner's approved mockup 6 of 29 Oct 2026, its third
   round, MAIN/qa/excellence/mocks/figures/ with notes.md section 6 and critique-suppliers.md). Until then the ribbons counted the
   firms on the supplier list. Now a ribbon's width is a country's share of a segment, from data/chokepoint-matrix.json.

   This module writes the section into src/template.html ({{SUPPLIER_SHARES}}): its head, the key, the buttons that follow a
   country, the Table, the CSV, the citation, the notes and, for src/modules/supshares.js, which draws it, each segment's data.

   Nothing here types a figure of its own:
   - every share is printed as the matrix file writes it (6.0 stays 6.0), read a second time as text, and the build stops
     if that text is not the number the file parses to;
   - every firm under a segment is there because the supplier list, a chapter's card or a chapter's text says it makes that
     thing: each carries the phrase that says so, and the build stops if the phrase is not there;
   - the firms are ordered by their country's share in the row, then by a share the supplier list states for the firm (each
     checked in its entry, and never printed), then Critical first, then the list's own order.
   A firm counts under the column where the matrix counts its revenue (COL), and a firm from a country the row has no
   column for sits in Other, where the matrix puts it. Segments with no country split show only their name and firms. */
'use strict';
const SITE = require('../site.js');

// the matrix's columns, in the drawing's order of ties, and their names
const COLS = ['US', 'JP', 'CN', 'TW', 'KR', 'NL', 'DE', 'GB', 'IL', 'EU-other', 'Other'];
const NAME = { US: 'United States', JP: 'Japan', CN: 'China', TW: 'Taiwan', KR: 'South Korea', NL: 'Netherlands', DE: 'Germany', GB: 'United Kingdom', IL: 'Israel', 'EU-other': 'Other EU', Other: 'Other' };
const AGG = ['EU-other', 'Other']; // the two catch-all columns: they close each segment's order, whatever their size
const MCOLS = COLS.slice(0, 9);
const EU27 = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
const colOf = (cc) => (MCOLS.includes(cc) ? cc : EU27.includes(cc) ? 'EU-other' : 'Other');
// a short name for each source, for the line in a tip and the Table
const SRCNAME = {
  'https://www.semiconductors.org/wp-content/uploads/2021/05/BCG-x-SIA-Strengthening-the-Global-Semiconductor-Value-Chain-April-2021_1.pdf': 'SIA and BCG',
  'https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf': 'SIA and BCG',
  'https://www.sec.gov/Archives/edgar/data/1973239/000197323926000097/arm-20260331.htm': 'Arm 20-F',
  'https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf': 'METI',
  'https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf': 'CSET',
  'https://raw.githubusercontent.com/georgetown-cset/eto-chip-explorer/main/data/provision.csv': 'ETO',
  'https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm': 'SK hynix prospectus',
  'https://epoch.ai/data-insights/ai-chip-supply-chain-constraints': 'Epoch AI',
  'https://bidenwhitehouse.archives.gov/wp-content/uploads/2021/06/100-day-supply-chain-review-report.pdf': 'White House review',
  'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm': 'Nvidia 10-K',
};
const BASIS = { estimate: 'in-house estimate', relayed: 'relayed', derived: 'derived', measured: 'measured' };
// the supplier list's own section for each segment: its firms come first among equals
const HOME = {
  'EDA software': 'Design and EDA', 'Core IP': 'IP and architecture', 'Silicon wafers': 'Silicon and wafers',
  'Photoresist': 'Photoresist and materials', 'Specialty gases': 'Chemicals and gases', 'EUV lithography tools': 'Lithography',
  'DUV lithography tools': 'Lithography', 'Deposition tools': 'Deposition and etch', 'Etch tools': 'Deposition and etch',
  'Metrology & inspection tools': 'Metrology and inspection', 'Photomasks': 'Photomasks',
  'Leading-edge logic manufacturing (<10 nm)': 'Foundry', 'Mature logic manufacturing (≥28 nm)': 'Foundry',
  'DRAM manufacturing': 'Memory', 'HBM': 'Memory', 'Advanced packaging (2.5D/3D)': 'Advanced packaging and OSAT',
  'Assembly, test and packaging (ATP)': 'Advanced packaging and OSAT', 'IC substrates': 'Substrates and PCBs',
  'AI accelerator design': 'AI accelerator vendors', 'Server assembly': 'Systems and servers' };
const AIV = 'AI accelerator vendors';
/* the firms under each segment: [the supplier list's name, where the phrase is ("list", the firm's subcategory and role;
   "card:NN", chapter NN's card; "ch:NN", chapter NN's text), the phrase that says it makes the segment's thing].
   notes.md section 6 tables them, with the firms left off and why. */
const FIRMS = {
  "EDA software": [
    ["Synopsys", "ch:01", "Synopsys, Cadence and Siemens EDA make the software used to design every advanced chip"],
    ["Cadence Design Systems", "ch:01", "Synopsys, Cadence and Siemens EDA make the software used to design every advanced chip"],
    ["Siemens EDA", "ch:01", "Synopsys, Cadence and Siemens EDA make the software used to design every advanced chip"],
    ["Ansys", "list", "Its RedHawk tool is the standard for power integrity signoff"],
    ["Empyrean Technology", "list", "A Chinese EDA vendor"],
    ["Primarius Technologies", "list", "A Chinese EDA vendor"],
    ["Semitronix", "list", "Yield-analysis EDA"],
  ],
  "Core IP": [
    ["Arm Holdings", "list", "CPU instruction set and core IP"],
    ["Rambus", "list", "Memory interface IP"],
    ["Alphawave Semi", "list", "chiplet connectivity IP"],
    ["SiFive", "list", "RISC-V processor IP"],
    ["Imagination Technologies", "list", "GPU and neural accelerator IP"],
    ["Synopsys", "list", "the largest commercial catalog of silicon IP"],
    ["Cadence Design Systems", "list", "verification, IP"],
    ["Tenstorrent", "list", "licenses the designs as IP"],
  ],
  "Silicon wafers": [
    ["Shin-Etsu Chemical", "list", "300 mm polished and epitaxial wafers"],
    ["SUMCO", "list", "300 mm polished and epitaxial wafers"],
    ["GlobalWafers", "list", "Silicon wafers"],
    ["Siltronic", "list", "300 mm polished and epitaxial wafers"],
    ["SK Siltron", "list", "300 mm silicon wafers"],
    ["National Silicon Industry Group", "list", "300 mm wafers"],
    ["Eswin Material", "list", "300 mm polished and epitaxial wafers"],
  ],
  "Photoresist": [
    ["JSR Corporation", "list", "ArF, KrF and EUV photoresist"],
    ["Tokyo Ohka Kogyo", "list", "Photoresist"],
    ["Fujifilm", "list", "Makes photoresist"],
    ["Sumitomo Chemical", "list", "Makes ArF and EUV photoresist"],
    ["Qnity Electronics", "card:03", "Qnity Electronics resist"],
    ["Inpria", "list", "Metal-oxide EUV photoresist"],
    ["Dongjin Semichem", "list", "Korea's main domestic photoresist maker"],
    ["Shin-Etsu Chemical", "list", "It also makes ArF and EUV photoresist"],
  ],
  "Specialty gases": [
    ["Merck KGaA", "list", "specialty gases"],
    ["Linde", "list", "Bulk and electronic specialty gases"],
    ["Air Liquide", "list", "Electronic specialty gases"],
    ["Air Products", "list", "specialty gases for etch and deposition"],
    ["Nippon Sanso Holdings", "list", "Electronic specialty and bulk gases"],
    ["SK Specialty", "list", "specialty etch gases"],
    ["Kanto Denka Kogyo", "list", "Fluorinated etch gases"],
    ["Resonac Holdings", "list", "high-purity etch gases"],
  ],
  "EUV lithography tools": [
    ["ASML", "list", "The only maker of extreme ultraviolet (EUV) lithography scanners"],
  ],
  "DUV lithography tools": [
    ["ASML", "list", "immersion deep ultraviolet (DUV) scanners"],
    ["Nikon", "list", "Makes ArF immersion, ArF, KrF and i-line lithography systems"],
    ["Canon", "list", "Makes i-line and KrF steppers"],
    ["SMEE", "ch:16", "among them some deep-ultraviolet types"],
  ],
  "Deposition tools": [
    ["Tokyo Electron", "list", "etch, deposition, cleaning"],
    ["Applied Materials", "list", "Makes tools for physical and chemical vapor deposition"],
    ["Lam Research", "list", "atomic layer deposition, electroplating"],
    ["ASM International", "list", "Makes atomic layer deposition (ALD) tools"],
    ["Kokusai Electric", "list", "batch ALD systems"],
    ["Naura Technology", "list", "deposition (PVD, CVD and ALD)"],
    ["Piotech", "list", "plasma-enhanced CVD and ALD systems"],
  ],
  "Etch tools": [
    ["Tokyo Electron", "list", "It also makes etch"],
    ["Applied Materials", "ch:06", "Tokyo Electron 23.4 percent and Applied Materials 17.4 percent"],
    ["Lam Research", "list", "The largest supplier of plasma etch systems"],
    ["Naura Technology", "list", "with plasma etch"],
    ["AMEC", "list", "plasma etch systems"],
    ["Hitachi High-Tech", "list", "It also makes plasma etch systems"],
  ],
  "Metrology & inspection tools": [
    ["KLA", "list", "Supplies process control equipment"],
    ["Lasertec", "list", "Makes actinic inspection tools"],
    ["Hitachi High-Tech", "list", "CD-SEM metrology"],
    ["Onto Innovation", "list", "optical film metrology"],
    ["Nova Ltd", "list", "Optical CD and materials metrology"],
    ["Camtek", "list", "Makes inspection and metrology systems"],
    ["Park Systems", "list", "atomic force microscopes fabs use to measure"],
    ["Skyverse Technology", "list", "wafer defect inspection and film metrology tools"],
    ["Wuhan Jingce Electronic", "list", "semiconductor film metrology"],
    ["ASML", "card:07", "5.9 percent of process control tools"],
    ["Applied Materials", "card:07", "11.2 percent of process control tools"],
    ["Carl Zeiss SMT", "list", "mask metrology"],
    ["NuFlare Technology", "list", "mask inspection systems"],
  ],
  "Photomasks": [
    ["Hoya", "ch:05", "The competitors it names in chip and display masks include Dai Nippon Printing, Hoya, Tekscend Photomask"],
    ["Photronics", "list", "A merchant photomask maker"],
    ["Toppan Holdings", "list", "Makes advanced photomasks"],
    ["Dai Nippon Printing", "list", "Makes photomasks, including EUV masks"],
    ["Shenzhen Qingyi Photomask", "list", "A Chinese merchant mask maker"],
    ["Shenzhen Newway Photomask", "list", "A Chinese merchant mask maker"],
    ["SMIC", "ch:05", "SMIC, a Chinese foundry, runs two in-house mask shops in Shanghai that make masks"],
  ],
  "Leading-edge logic manufacturing (<10 nm)": [
    ["TSMC", "list", "Leading-edge logic foundry"],
    ["Samsung Foundry", "list", "Leading-edge logic foundry"],
    ["Intel Foundry", "list", "Leading-edge logic foundry"],
    ["SMIC", "list", "producing 7 nm class logic"],
  ],
  "Mature logic manufacturing (≥28 nm)": [
    ["Hua Hong Semiconductor", "list", "Mature-node specialty foundry"],
    ["GlobalFoundries", "list", "Specialty and mature-node foundry"],
    ["UMC", "list", "running processes of 28 nm and above"],
  ],
  "DRAM manufacturing": [
    ["SK hynix", "list", "HBM, DRAM and NAND"],
    ["Samsung Memory", "list", "DRAM, HBM and NAND"],
    ["Micron Technology", "list", "DRAM, HBM and NAND"],
    ["CXMT", "list", "China's only significant DRAM maker"],
    ["Nanya Technology", "list", "Commodity and specialty DRAM"],
    ["Winbond Electronics", "list", "Specialty DRAM"],
  ],
  "HBM": [
    ["SK hynix", "list", "The largest supplier of high bandwidth memory (HBM)"],
    ["Samsung Memory", "list", "supplying DRAM, NAND and HBM"],
    ["Micron Technology", "list", "the third HBM supplier"],
  ],
  "Advanced packaging (2.5D/3D)": [
    ["TSMC", "list", "It also owns CoWoS and SoIC advanced packaging"],
    ["ASE Technology Holding", "list", "adding 2.5D and fan-out capacity"],
    ["Amkor Technology", "list", "OSAT assembly, test and advanced packaging"],
    ["JCET Group", "list", "to gain advanced packaging capability"],
    ["Powertech Technology", "list", "logic advanced packaging work"],
    ["Intel Foundry", "card:10", "Foveros 3D packaging in volume"],
  ],
  "Assembly, test and packaging (ATP)": [
    ["ASE Technology Holding", "list", "Packages and tests chips"],
    ["Amkor Technology", "list", "Packages and tests other companies' chips"],
    ["JCET Group", "list", "A leading Chinese assembly and test firm"],
    ["Powertech Technology", "list", "memory assembly and test"],
    ["Tongfu Microelectronics", "list", "OSAT assembly and test"],
    ["Hua Tian Technology", "list", "OSAT assembly and test"],
    ["King Yuan Electronics", "list", "Wafer sort and final test services"],
    ["Chipbond Technology", "list", "chip-on-film packaging"],
    ["UTAC Holdings", "list", "OSAT assembly and test"],
  ],
  "IC substrates": [
    ["Ibiden", "list", "FC-BGA package substrates"],
    ["Shinko Electric Industries", "list", "Makes high-end flip-chip BGA substrates"],
    ["Unimicron", "list", "One of the largest IC substrate makers"],
    ["Kinsus Interconnect", "list", "Makes flip-chip and wire bond IC substrates"],
    ["Nan Ya PCB", "list", "Produces ABF and BT IC substrates"],
    ["AT&S", "list", "Makes IC substrates"],
    ["Samsung Electro-Mechanics", "list", "Makes flip-chip BGA substrates"],
    ["LG Innotek", "list", "Entered high-end flip-chip BGA substrates"],
    ["Toppan Holdings", "list", "FC-BGA substrates"],
  ],
  "AI accelerator design": AIV, // every AI accelerator vendor on the list, each by its own line on it
  "Server assembly": [
    ["Hon Hai Precision", "list", "Builds Nvidia servers and rack-scale systems"],
    ["Quanta Computer", "list", "Builds GPU baseboards, servers and full racks"],
    ["Wistron", "list", "Builds GPU baseboards and AI servers"],
    ["Wiwynn", "list", "Designs and builds hyperscale servers"],
    ["Inventec", "list", "Builds AI and general purpose servers"],
    ["Super Micro Computer", "list", "Designs and builds AI servers"],
    ["Hewlett Packard Enterprise", "list", "Builds AI servers"],
    ["Lenovo", "list", "Builds AI servers"],
    ["Celestica", "list", "Builds servers, storage"],
    ["Jabil", "list", "building AI data center hardware including server racks"],
  ],
};
// where the matrix counts a firm under a column other than its headquarters (its method and note say so)
const COL = {
  "EDA software|Siemens EDA": "DE",
  "Specialty gases|Linde": "DE",
  "Core IP|Alphawave Semi": "US",
  "Core IP|Imagination Technologies": "Other",
};
// the shorter name a firm is printed under
const SHORTN = {"Cadence Design Systems": "Cadence", "Arm Holdings": "Arm", "Shin-Etsu Chemical": "Shin-Etsu", "JSR Corporation": "JSR", "Merck KGaA": "Merck", "Nippon Sanso Holdings": "Nippon Sanso", "Resonac Holdings": "Resonac", "Carl Zeiss SMT": "Zeiss", "Toppan Holdings": "Toppan", "Hua Hong Semiconductor": "Hua Hong", "Samsung Memory": "Samsung", "Micron Technology": "Micron", "ASE Technology Holding": "ASE", "Amkor Technology": "Amkor", "JCET Group": "JCET", "Shinko Electric Industries": "Shinko", "Hon Hai Precision": "Hon Hai", "Quanta Computer": "Quanta", "Naura Technology": "Naura", "Empyrean Technology": "Empyrean", "Primarius Technologies": "Primarius", "Nova Ltd": "Nova", "National Silicon Industry Group": "NSIG", "Eswin Material": "Eswin", "Wuhan Jingce Electronic": "Wuhan Jingce", "Skyverse Technology": "Skyverse", "NuFlare Technology": "NuFlare", "Shenzhen Qingyi Photomask": "Qingyi Photomask", "Shenzhen Newway Photomask": "Newway Photomask", "Nanya Technology": "Nanya", "Winbond Electronics": "Winbond", "Powertech Technology": "Powertech", "Tongfu Microelectronics": "Tongfu", "Hua Tian Technology": "Hua Tian", "King Yuan Electronics": "King Yuan", "Chipbond Technology": "Chipbond", "UTAC Holdings": "UTAC", "Kinsus Interconnect": "Kinsus", "Super Micro Computer": "Supermicro", "Hewlett Packard Enterprise": "HPE", "Marvell Technology": "Marvell", "Cerebras Systems": "Cerebras", "Cambricon Technologies": "Cambricon", "Hygon Information Technology": "Hygon", "Biren Technology": "Biren", "SambaNova Systems": "SambaNova", "Microsoft Azure Silicon": "Microsoft", "Meta Platforms": "Meta", "Alchip Technologies": "Alchip", "Kokusai Electric": "Kokusai", "Kanto Denka Kogyo": "Kanto Denka", "Imagination Technologies": "Imagination", "Alphawave Semi": "Alphawave", "Samsung Electro-Mechanics": "Samsung Electro-Mechanics"};
// a firm's share of the segment where the supplier list states one, in its own entry or a rival's: used only to order firms
// of the same country, never printed. [share, the entry, the phrase]
const STATED = {
  "Silicon wafers|Shin-Etsu Chemical": [22, "Shin-Etsu Chemical", "Shin-Etsu held an estimated 22 percent of global 300 mm wafer capacity"],
  "Silicon wafers|SUMCO": [20, "SUMCO", "It held an estimated 20 percent of global 300 mm wafer capacity"],
  "Silicon wafers|GlobalWafers": [15, "GlobalWafers", "about 15 to 20 percent of global semiconductor wafer output"],
  "Silicon wafers|Eswin Material": [7.7, "Eswin Material", "about 7.7 percent of global 300 mm shipments"],
  "Etch tools|Lam Research": [41.1, "Lam Research", "it had 41.1 percent of the $21.9 billion dry etch tool market in 2025"],
  "Etch tools|Tokyo Electron": [23.4, "Lam Research", "against 23.4 percent for Tokyo Electron"],
  "Metrology & inspection tools|KLA": [56.8, "KLA", "56.8 percent of the process control market in 2025"],
  "Metrology & inspection tools|Applied Materials": [11.2, "KLA", "against 11.2 percent for Applied Materials"],
};

// the segment names the drawing prints, where the matrix's are long
const SHORTSEG = { 'Leading-edge logic manufacturing (<10 nm)': 'Leading-edge logic, under 10 nm', 'Mature logic manufacturing (≥28 nm)': 'Mature logic, 28 nm and up',
  'Assembly, test and packaging (ATP)': 'Assembly, test and packaging', 'Metrology & inspection tools': 'Metrology and inspection tools',
  'DRAM manufacturing': 'DRAM', 'Advanced packaging (2.5D/3D)': 'Advanced packaging, 2.5D and 3D' };
const segName = (r) => SHORTSEG[r.segment] || r.segment;
const capacity = (r) => /site location/.test(r.metric || '');
// the measure and year, as a tip and the Table give them; an estimate or a derived row says so
const whenT = (r) => (capacity(r) ? 'Share of plant capacity, by plant location' : r.metric) + ', ' + r.year + (/estimate|derived/.test(r.basis || '') ? ', ' + r.basisT : '');
const srcT = (r) => r.srcShort + (r.via ? ' (' + r.via + ')' : '');
const TITLE = 'Which countries hold each segment, by share';

module.exports = function (ctx) {
  const { root, fs, path, readJSON, esc, warn } = ctx;
  const matrixFile = path.join(root, 'data', 'chokepoint-matrix.json');
  const M = readJSON(matrixFile, []), B = readJSON(path.join(root, 'data', 'bibliography.json'), {});
  const suppliers = readJSON(path.join(root, 'data', 'suppliers.json'), []);
  const SUP = new Map(suppliers.map((s, i) => [s.name, Object.assign({ ix: i }, s)]));
  const bad = [];
  // each share as the file writes it: the matrix read again as text, row by row, so 6.0 stays 6.0
  const text = fs.readFileSync(matrixFile, 'utf8');
  const RAW = [...text.matchAll(/"shares":\s*(\{[^}]*\}|null)/g)].map((m) => (m[1] === 'null' ? null : Object.fromEntries([...m[1].matchAll(/"([A-Za-z-]+)":\s*(-?\d+(?:\.\d+)?)/g)].map((x) => [x[1], x[2]]))));
  if (RAW.length !== M.length) bad.push(`the matrix read as text has ${RAW.length} rows, parsed ${M.length}`);
  // the chapters' cards and text, for the firms a chapter places
  const CH = {};
  fs.readdirSync(path.join(root, 'content')).forEach((fn) => {
    const m = /^(\d\d)-.*\.md$/.exec(fn); if (!m) return;
    const t = fs.readFileSync(path.join(root, 'content', fn), 'utf8'), fm = /^---json\s*\n([\s\S]*?)\n---/.exec(t);
    let card = {}; try { card = JSON.parse(fm[1]).card || {}; } catch (e) { }
    CH[m[1]] = { card: JSON.stringify(card), text: t.replace(/\]\([^)]*\)/g, ']') };
  });
  const has = (kind, s, phrase) => {
    if (kind === 'list') return `${s.subcategory || ''} ${s.role || ''}`.includes(phrase);
    const [k, n] = kind.split(':'), c = CH[n];
    return !!c && (k === 'card' ? c.card : c.text).includes(phrase);
  };
  Object.entries(STATED).forEach(([key, [v, src, phrase]]) => {
    const s = SUP.get(src), t = s ? [s.subcategory, s.role, s.shareNote].filter(Boolean).join(' ') : '';
    if (!t.includes(phrase)) bad.push(`${key}: the share ${v}, "${phrase}", is not in the entry for ${src}`);
  });

  const rows = M.map((r, i) => {
    const b = B[r.source] || {};
    if (!SRCNAME[r.source]) bad.push(`${r.segment}: no short name for its source ${r.source}`);
    const row = { segment: r.segment, name: segName(r), metric: r.metric, year: r.year, basis: r.basis || null, basisT: BASIS[r.basis] || '', via: r.relayedVia || null,
      shares: r.shares || null, sharesT: null, order: [], src: r.source, srcShort: SRCNAME[r.source] || '', srcTitle: b.title || r.source };
    if (r.shares) {
      const raw = RAW[i] || {};
      row.sharesT = {};
      Object.keys(r.shares).forEach((c) => {
        if (!COLS.includes(c)) bad.push(`${r.segment}: the column ${c} is not one the drawing knows`);
        const t = raw[c];
        if (t == null || !/^\d+(\.\d+)?$/.test(t) || +t !== +r.shares[c]) bad.push(`${r.segment} ${c}: "${t}" as written does not match ${r.shares[c]}`);
        row.sharesT[c] = t;
      });
      // the segment's countries, largest share first (ties in the drawing's order), the two catch-all columns last
      const named = Object.keys(r.shares).filter((c) => !AGG.includes(c)).sort((a, z) => (r.shares[z] - r.shares[a]) || (COLS.indexOf(a) - COLS.indexOf(z)));
      row.order = named.concat(AGG.filter((c) => c in r.shares));
    }
    // the firms under the segment
    let list = FIRMS[r.segment];
    if (list === AIV) list = suppliers.filter((s) => s.category === AIV).map((s) => [s.name, 'list', s.subcategory]);
    if (!list) { bad.push(`${r.segment}: no firm list`); list = []; }
    const out = [];
    list.forEach(([name, kind, phrase]) => {
      const s = SUP.get(name);
      if (!s) { bad.push(`${r.segment}: ${name} is not on the supplier list`); return; }
      if (!has(kind, s, phrase)) { bad.push(`${r.segment}: ${name}: "${phrase}" is not in ${kind}`); return; }
      const key = r.segment + '|' + name;
      let col = COL[key] || colOf(s.country);
      // a firm from a country the row has no column for sits in the row's Other column, where the matrix puts it
      if (r.shares && !(col in r.shares) && 'Other' in r.shares && !COL[key]) col = 'Other';
      out.push({ n: name, s: SHORTN[name] || name, cc: s.country, col, crit: s.chokepoint === 'Critical', home: s.category === HOME[r.segment], ix: s.ix, stated: STATED[key] ? STATED[key][0] : 0 });
    });
    const rank = (f) => (row.order.includes(f.col) ? row.order.indexOf(f.col) : row.order.length);
    out.sort((a, z) => (rank(a) - rank(z)) || (z.stated - a.stated) || (+!a.crit - +!z.crit) || (+!a.home - +!z.home) || (a.ix - z.ix));
    row.firms = out.map((f) => ({ s: f.s, cc: f.cc, col: f.col }));
    return row;
  });
  if (bad.length) throw new Error('supplier shares: ' + bad.join('; '));

  // the Table: each segment, its first three firms, its shares (the followed country's in bold, src/modules/supshares.js),
  // its measure, year and source
  const share = (r, c) => r.sharesT[c] + '%';
  const tableRows = rows.map((r) => {
    const sh = r.shares ? r.order.map((c) => `<span class="ss-tc" data-c="${c}">${esc(NAME[c])} ${share(r, c)}</span>`).join(', ') : '';
    const firms = r.firms.slice(0, 3).map((f) => esc(f.s)).join(', ');
    const src = r.shares ? `${esc(whenT(r))}. <a href="${esc(r.src)}" target="_blank" rel="noopener">${esc(srcT(r))}</a>` : '';
    return `<tr><th scope="row"><span class="ss-tseg">${esc(r.name)}</span>${firms ? `<span class="ss-tfirms">${firms}</span>` : ''}</th><td>${sh}</td><td>${src}</td></tr>`;
  }).join('');
  const table = `<table class="ss-table"><caption class="sr-only">${esc(TITLE)}</caption><thead><tr><th scope="col">Segment and firms</th><th scope="col">Country shares</th><th scope="col">Year and source</th></tr></thead><tbody>${tableRows}</tbody></table>`;
  // the CSV: one row per segment, a column per country with its share as the matrix writes it, then the measure, year,
  // basis, source and the first three firms; under it, after a blank row, what the file is
  const q = (v) => { const s = String(v == null ? '' : v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const page = SITE.url + '#/suppliers';
  const csvRows = [['Segment'].concat(COLS.map((c) => `${NAME[c]} (%)`), ['Measure', 'Year', 'Basis', 'Source', 'Source address', 'Firms'])]
    .concat(rows.map((r) => [r.segment].concat(COLS.map((c) => (r.sharesT && r.sharesT[c] != null ? r.sharesT[c] : '')), [r.shares ? r.metric : '', r.shares ? r.year : '', r.shares ? r.basisT : '', r.shares ? r.srcTitle : '', r.shares ? r.src : '', r.firms.slice(0, 3).map((f) => f.s).join(', ')])))
    .concat([[], ['Title', TITLE], ['Source', 'The chokepoint matrix (data/chokepoint-matrix.json) and the supplier list (data/suppliers.json), each segment with its own source'], ['Figure address', page]]);
  const csv = 'data:text/csv;charset=utf-8,' + encodeURIComponent('﻿' + csvRows.map((r) => r.map(q).join(',')).join('\r\n') + '\r\n');
  const cite = `<div class="ch-cite-box fig-cite-box" id="sup-pipe-cite" role="region" aria-label="Citation for the figure" hidden><p class="ch-cite-text">Sharma, Yashvardhan. “${esc(TITLE)}.” <i>Chip Supply Chain: How AI Chips Are Made</i>. Updated ${esc(ctx.builtStr)}. <a href="${esc(page)}">${esc(page)}</a>. Data: the chokepoint matrix and the supplier list, each segment's share with its own source and year.</p></div>`;
  const chips = COLS.map((c) => `<button type="button" class="sup-chip" data-c="${c}" aria-pressed="false">${esc(NAME[c])}</button>`).join('');
  const json = JSON.stringify(rows).replace(/</g, '\\u003c');
  const html = `<section class="sup-pipe ss" id="sup-pipe" aria-labelledby="sup-pipe-h">
        <div class="sup-sec-h sup-pipe-top"><h2 class="sup-pipe-h" id="sup-pipe-h">${esc(TITLE)}</h2></div>
        <div class="sup-pipe-body ss-body">
          <div class="ss-side-top"><p class="sup-legend"><span class="sup-lg"><i class="sup-all-sw" aria-hidden="true"></i>A country’s share of the segment</span><span class="sup-lg"><i class="sup-crit-sw" aria-hidden="true"></i>The country followed</span><span class="sup-lg ss-key">Shares are of 2025 revenue unless marked</span></p>
            <div class="sup-follow"><p class="sup-follow-k" id="sup-follow-k">Choose a country to follow its ribbons and firms</p><div class="sup-chips ss-chips" role="group" aria-labelledby="sup-follow-k">${chips}</div></div></div>
          <div class="sup-pipe-plot ss-plot"><div class="ss-draw"></div><div class="ss-tablebox" hidden>${table}</div>
            <div class="sup-tip ss-tip" id="sup-tip" role="tooltip" hidden></div><span class="sr-only" id="sup-ss-hint">Left and right arrow keys step through the countries in this segment.</span></div>
          <div class="sup-note ss-side-note"><p>Each segment is drawn as one whole. Where a ribbon meets a segment, its width is that country’s share.</p>
            <p>The firms come from the supplier list, ordered by their country’s share, then by any share the list gives the firm. A firm counts where the matrix counts its revenue, so Siemens EDA and Linde count under Germany. On the capacity segments, firms count under their headquarters, wherever their plants are.</p></div>
          <div class="sup-note sup-pipe-note ss-src"><span class="fs-src">Source: the chokepoint matrix, <span class="ss-code">data/chokepoint-matrix.json</span>, and the supplier list, <span class="ss-code">data/suppliers.json</span>. The tip over a segment gives its year and links its source.</span>
            <span class="fs-acts ss-acts"><button type="button" class="ch-cite-btn" aria-expanded="false" aria-controls="sup-pipe-cite">Cite</button><button type="button" class="fs-tab ss-tab" aria-pressed="false">Table</button><a class="fs-csv" href="${csv}" download="chip-supply-chain-suppliers-country-shares.csv">CSV</a></span>${cite}</div>
        </div>
        <script type="application/json" id="sup-shares-data">${json}</script>
      </section>`;
  return { SUPPLIER_SHARES: html };
};
