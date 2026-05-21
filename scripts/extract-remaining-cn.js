const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const set = new Set();
function w(d) {
  for (const n of fs.readdirSync(d)) {
    if (n === 'scripts' || n === 'node_modules') continue;
    const p = path.join(d, n);
    if (fs.statSync(p).isDirectory()) w(p);
    else if (/\.html$/i.test(n)) {
      const t = fs.readFileSync(p, 'utf8');
      const re = /[\u4e00-\u9fff][\u4e00-\u9fff\s\dA-Za-z，。、；：！？（）【】《》""''·—\.\,\-\+\%\&\|｜\/]*/g;
      let m;
      while ((m = re.exec(t))) {
        const s = m[0].replace(/\s+/g, ' ').trim();
        if (s.length >= 1) set.add(s);
      }
    }
  }
}
w(root);
const arr = [...set].sort((a, b) => b.length - a.length);
fs.writeFileSync(path.join(__dirname, 'remaining-cn.json'), JSON.stringify(arr, null, 0));
console.log('unique remaining segments:', set.size);
console.log('top 15:', arr.slice(0, 15));
