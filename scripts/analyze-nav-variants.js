const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function normHref(h) {
  return h.replace(/^\.\//, '').replace(/^(\.\.\/)+/, '');
}

function extractNav(html) {
  const box = html.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/i);
  if (!box) return null;
  const main = [];
  const sub = [];
  let m;
  const reH3 = /<h3[^>]*><a[^>]*href=['"]([^'"]+)['"]/gi;
  const reLi = /<li class="subclass"><a[^>]*href=['"]([^'"]+)['"]/gi;
  while ((m = reH3.exec(box[1]))) main.push(normHref(m[1]));
  while ((m = reLi.exec(box[1]))) sub.push(normHref(m[1]));
  return { main, sub };
}

function canonicalMain(main) {
  return main.map((h, i) => {
    if (h === 'index.html' && i > 0) return '__CURRENT__';
    return h;
  });
}

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
}

const ref = extractNav(fs.readFileSync(path.join(root, 'product/index.html'), 'utf8'));
const refKey = canonicalMain(ref.main).join('|');

const variants = new Map();
const files = [];
walk(path.join(root, 'product'), files);

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  if (!html.includes('nva_box')) continue;
  const nav = extractNav(html);
  const key = canonicalMain(nav.main).join('|');
  if (!variants.has(key)) variants.set(key, []);
  variants.get(key).push(path.relative(root, f).replace(/\\/g, '/'));
}

console.log('Variant count:', variants.size);
for (const [key, pages] of [...variants.entries()].sort((a, b) => b[1].length - a[1].length)) {
  const isRef = key === refKey;
  console.log('\n', pages.length, isRef ? '[REFERENCE]' : '[DIFFERENT]');
  if (!isRef) {
    const got = key.split('|');
    const want = refKey.split('|');
    for (let i = 0; i < Math.max(got.length, want.length); i++) {
      if (got[i] !== want[i]) console.log('  ', i, want[i], '->', got[i]);
    }
    console.log('  sample:', pages[0]);
  }
}
