const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const arr = JSON.parse(fs.readFileSync(path.join(__dirname, 'zh-strings-raw.json'), 'utf8'));
const freq = new Map();

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === 'scripts') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.html?$/i.test(name)) {
      const t = fs.readFileSync(p, 'utf8');
      for (const s of arr) {
        if (t.includes(s)) freq.set(s, (freq.get(s) || 0) + 1);
      }
    }
  }
}
walk(root);
const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
fs.writeFileSync(
  path.join(__dirname, 'zh-freq.json'),
  JSON.stringify(sorted.slice(0, 500), null, 2),
  'utf8'
);
console.log('top 20:', sorted.slice(0, 20).map(([s, c]) => c + 'x ' + s.slice(0, 40)));
