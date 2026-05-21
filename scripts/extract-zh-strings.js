const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const zhRe = /[\u4e00-\u9fff][\u4e00-\u9fff\s，。、；：！？（）【】《》""''·—\dA-Za-z\/\.\,\-\+\%\&\|｜]*[\u4e00-\u9fff]|[\u4e00-\u9fff]{2,}/g;
const set = new Set();

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === 'scripts') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.html?$/i.test(name)) {
      const t = fs.readFileSync(p, 'utf8');
      let m;
      while ((m = zhRe.exec(t))) {
        const s = m[0].replace(/\s+/g, ' ').trim();
        if (s.length >= 2) set.add(s);
      }
    }
  }
}

walk(root);
const arr = [...set].sort((a, b) => b.length - a.length);
fs.writeFileSync(
  path.join(__dirname, 'zh-strings-raw.json'),
  JSON.stringify(arr, null, 0),
  'utf8'
);
console.log('unique strings:', arr.length);
console.log('written zh-strings-raw.json');
