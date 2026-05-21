const fs = require('fs');
const path = require('path');

function extractSub(html) {
  const box = html.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/i);
  if (!box) return null;
  return [...box[1].matchAll(/<li class="subclass"><a[^>]*href=['"]([^'"]+)['"]/gi)].map((m) =>
    m[1].replace(/^\.\//, '').replace(/^(\.\.\/)+/, '')
  );
}

const ref = extractSub(fs.readFileSync('product/index.html', 'utf8'));
const refKey = ref.join('|');

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
}

const bad = [];
walk('product', []);
const files = [];
walk('product', files);

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  if (!html.includes('nva_box')) continue;
  const sub = extractSub(html);
  if (!sub || sub.length === 0) continue;
  const key = sub.join('|');
  if (key !== refKey) {
    bad.push({ file: f.replace(/\\/g, '/'), sub });
  }
}

console.log('Sub nav mismatches:', bad.length);
bad.slice(0, 15).forEach((b) => {
  console.log('\n', b.file);
  for (let i = 0; i < ref.length; i++) {
    if (ref[i] !== b.sub[i]) console.log(' ', i, 'want', ref[i], 'got', b.sub[i]);
  }
});
