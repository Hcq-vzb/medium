const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
let changed = 0;

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git' || name === 'scripts') continue;
      walk(p, files);
    } else if (/\.html?$/i.test(name)) files.push(p);
  }
  return files;
}

const patterns = [
  [/data-url="https?:\/\/www\.zjgjmx\.cn\/statics\//gi, (m, htmlPath) => {
    const rel = path.relative(root, path.dirname(htmlPath)).split(path.sep);
    const depth = rel[0] === '' ? 0 : rel.length;
    const prefix = depth ? '../'.repeat(depth) : '';
    return `data-url="${prefix}statics/`;
  }],
  [/data-url="https?:\/\/www\.zjgjmx\.com\/statics\//gi, (m, htmlPath) => {
    const rel = path.relative(root, path.dirname(htmlPath)).split(path.sep);
    const depth = rel[0] === '' ? 0 : rel.length;
    const prefix = depth ? '../'.repeat(depth) : '';
    return `data-url="${prefix}statics/`;
  }],
];

for (const file of walk(root)) {
  let c = fs.readFileSync(file, 'utf8');
  const orig = c;
  for (const [re, repl] of patterns) {
    c = c.replace(re, (match) => repl(match, file));
  }
  if (c !== orig) {
    fs.writeFileSync(file, c, 'utf8');
    changed++;
  }
}
console.log('Fixed data-url in', changed, 'files');
