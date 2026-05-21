const fs = require('fs');
const path = require('path');
function walk(d, a = []) {
  for (const n of fs.readdirSync(d)) {
    const p = path.join(d, n);
    if (fs.statSync(p).isDirectory()) walk(p, a);
    else if (n.endsWith('.html')) a.push(p);
  }
  return a;
}
const root = path.join(__dirname, '..', 'product');
const titles = new Map();
const re = /<h3[^>]*><a[^>]*title='([^']*)'[^>]*>([^<]*)<\/a><\/h3>/g;
for (const f of walk(root)) {
  const h = fs.readFileSync(f, 'utf8');
  if (!h.includes('nva_box')) continue;
  let m;
  while ((m = re.exec(h))) titles.set(m[1], (titles.get(m[1]) || 0) + 1);
}
[...titles.entries()].sort((a, b) => b[1] - a[1]).forEach(([t, c]) => console.log(c, t));
