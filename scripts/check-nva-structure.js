const fs = require('fs');

function structure(html) {
  const box = html.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/i);
  if (!box) return null;
  const parts = [];
  const re = /<h3[^>]*class="([^"]*)"[^>]*>|<ul class="sub_bx">/gi;
  let m;
  while ((m = re.exec(box[1]))) {
    if (m[0].startsWith('<h3')) parts.push('h3:' + m[1]);
    else parts.push('ul:sub_bx');
  }
  return parts.join(' ');
}

const files = [
  'product/index.html',
  'product/tuijianchanpin/index.html',
  'product/hanqiyinliao/index.html',
  'product/guozhiguanzhuangji/index.html'
];

for (const f of files) {
  console.log(f, structure(fs.readFileSync(f, 'utf8')));
}

// Find any file where sub_bx appears more than once or not right after first h3
const fs2 = require('fs');
const path = require('path');
function walk(d, l) {
  for (const n of fs2.readdirSync(d)) {
    const p = path.join(d, n);
    if (fs2.statSync(p).isDirectory()) walk(p, l);
    else if (/\.html$/i.test(n)) l.push(p);
  }
}
const all = [];
walk('product', all);
let bad = 0;
for (const f of all) {
  const h = fs2.readFileSync(f, 'utf8');
  if (!h.includes('nva_box')) continue;
  const s = structure(h);
  const firstSub = s.indexOf('ul:sub_bx');
  const secondSub = s.indexOf('ul:sub_bx', firstSub + 1);
  if (secondSub !== -1) {
    console.log('MULTIPLE sub_bx', f);
    bad++;
  }
  if (firstSub !== -1 && !s.startsWith('h3:') || (firstSub > 0 && !s.substring(0, firstSub).match(/^h3:[^ ]+ ul:sub_bx/))) {
    const expected = /^h3:(?:on|off) ul:sub_bx/;
    if (firstSub !== -1 && !expected.test(s)) {
      console.log('BAD sub placement', f, s.slice(0, 80));
      bad++;
    }
  }
}
console.log('structure issues', bad);
