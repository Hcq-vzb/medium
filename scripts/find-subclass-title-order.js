const fs = require('fs');
const path = require('path');

function extractSubTitles(html) {
  const box = html.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/i);
  if (!box) return null;
  return [...box[1].matchAll(/<li class="subclass"><a[^>]*title=['"]([^'"]*)['"]/gi)].map((m) => m[1]);
}

const ref = extractSubTitles(fs.readFileSync('product/index.html', 'utf8'));
const refKey = ref.join('\n');

function walk(d, l) {
  for (const n of fs.readdirSync(d)) {
    const p = path.join(d, n);
    if (fs.statSync(p).isDirectory()) walk(p, l);
    else if (/\.html$/i.test(n)) l.push(p);
  }
}

const outliers = [];
walk('product', []);
const files = [];
walk('product', files);

for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  if (!h.includes('nva_box')) continue;
  const t = extractSubTitles(h);
  if (!t || t.length === 0) continue;
  if (t.join('\n') !== refKey) outliers.push({ file: f.replace(/\\/g, '/'), t });
}

console.log('Subclass title outliers:', outliers.length);
outliers.slice(0, 5).forEach((o) => {
  console.log('\n', o.file);
  for (let i = 0; i < ref.length; i++) {
    if (ref[i] !== o.t[i]) console.log(' ', i, ref[i], '->', o.t[i]);
  }
});
