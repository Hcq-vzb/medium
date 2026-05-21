/**
 * Fix ../../../statics -> ../../statics on YYYY/article/*.html (2 levels below root)
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function walk(dir, list = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, list);
    else if (ent.name.endsWith('.html')) list.push(p);
  }
  return list;
}

let n = 0;
for (const f of walk(root)) {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  const m = rel.match(/^(\d{4})\/[^/]+\/[^/]+\.html$/);
  if (!m) continue;
  let html = fs.readFileSync(f, 'utf8');
  const next = html.replace(/\.\.\/\.\.\/\.\.\/statics\//g, '../../statics/');
  if (next !== html) {
    fs.writeFileSync(f, next, 'utf8');
    n++;
  }
}
console.log('Fixed static paths in', n, 'article pages');
