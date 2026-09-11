// The one place the site's public address lives. Everything that prints an absolute URL reads it from here:
// the share pages and cards, the Copy link buttons, the canonical and Open Graph tags, the print title, the PDF footer,
// and the cite line. Set `cname` to the custom domain once its DNS points at GitHub Pages; the build then writes dist/CNAME
// and every URL switches with it. Leave it null and the github.io address is used.
const cname = null; // e.g. 'chipsupplychain.org'
const url = cname ? `https://${cname}/` : 'https://yashvardhansharmaa.github.io/chokepoints/';
module.exports = { cname, url, host: url.replace(/^https?:\/\//, '').replace(/\/$/, '') };
