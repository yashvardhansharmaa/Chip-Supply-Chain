// The one place the site's public address lives. Everything that prints an absolute URL reads it from here:
// the share pages and cards, the Copy link buttons, the canonical and Open Graph tags, the print title, the PDF footer,
// and the cite line. Set `cname` to the custom domain once its DNS points at GitHub Pages; the build then writes dist/CNAME
// and every URL switches with it. Leave it null and the github.io address is used.
const cname = 'chipsupplychain.org';
const url = cname ? `https://${cname}/` : 'https://yashvardhansharmaa.github.io/Chip-Supply-Chain/';
// Visitor counting: GoatCounter (no cookies, no personal data). Set to null to ship the site without any counter.
const analytics = 'https://yashvardhan.goatcounter.com/count';
module.exports = { cname, url, host: url.replace(/^https?:\/\//, '').replace(/\/$/, ''), analytics };
