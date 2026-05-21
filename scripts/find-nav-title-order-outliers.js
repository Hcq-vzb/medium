const fs = require('fs');
const path = require('path');

function extractMainTitles(html) {
  const box = html.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/i);
  if (!box) return null;
  return [...box[1].matchAll(/<h3[^>]*><a[^>]*title=['"]([^'"]*)['"]/gi)].map((m) => m[1]);
}

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
}

const ref = extractMainTitles(fs.readFileSync('product/index.html', 'utf8'));
const refKey = ref.join('\n');

const outliers = [];
const files = [];
walk('product', files);

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  if (!html.includes('nva_box')) continue;
  const titles = extractMainTitles(html);
  if (!titles) continue;
  const key = titles.join('\n');
  if (key !== refKey) {
    outliers.push({ file: f.replace(/\\/g, '/'), titles });
  }
}

console.log('Title order outliers:', outliers.length);
outliers.slice(0, 10).forEach((o) => {
  console.log('\n', o.file);
  for (let i = 0; i < ref.length; i++) {
    if (ref[i] !== o.titles[i]) console.log(' ', i, ref[i], '->', o.titles[i]);
  }
});
