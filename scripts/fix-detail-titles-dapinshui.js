/**
 * Sync dapinshui detail page H4 titles with canonical English names.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const TITLES = {
  '2017/dapinshui_0926/119.html': 'Rotary Large Bottle Water Filling Machine',
  '2017/dapinshui_0926/120.html': 'Linear Large Bottle Water Filling Machine',
  '2018/dapinshui_1024/195.html': 'Large Bottle Purified Water Filling Machine',
  '2018/dapinshui_1024/196.html': 'Fully Automatic Large Bottle Water Filling Machine',
  '2018/dapinshui_1024/197.html': 'Automatic Large Bottle Filling Machine',
  '2018/dapinshui_1024/198.html': 'Large Bottle Rinse-Fill-Cap Monoblock',
  '2018/dapinshui_1008/164.html': 'Large Bottle Water Filling Machine',
  '2019/dapinshui_0925/269.html': '3–10 L Filling Machine',
  '2019/dapinshui_0925/270.html': '5 L Rinse-Fill-Cap Monoblock',
  '2019/dapinshui_0925/271.html': '5 L Rotary Filling Machine'
};

let n = 0;
for (const [rel, title] of Object.entries(TITLES)) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  const orig = html;
  html = html.replace(
    /(<div class="des_box">\s*<h4>)[^<]*(<\/h4>)/i,
    `$1${title}$2`
  );
  html = html.replace(/<title>[^<]*<\/title>/i, () => {
    return `<title>${title} - KIWL Machinery — Filling & Packaging Equipment</title>`;
  });
  if (html !== orig) {
    fs.writeFileSync(file, html, 'utf8');
    n++;
  }
}
console.log('Updated dapinshui detail pages:', n);
