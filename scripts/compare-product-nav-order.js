const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const CANONICAL_MAIN = [
  'tuijianchanpin/index.html',
  'guozhiguanzhuangji/index.html',
  'hqylgzj/index.html',
  'datongshuiguanzhuangji/index.html',
  'shuichulishebei/index.html',
  'youguanzhuangji/index.html',
  'mobaoji/index.html',
  'chuipingji/index.html',
  'zhusuji/index.html',
  'guanzhuangjipeijian/index.html',
  'pijiuguanzhuangji/index.html',
  'shuiguanzhuangji/index.html',
  'tiebiaoji/index.html',
  'cuogaiji/index.html',
  'fegnmiguanzhuangji/index.html',
  'xipingji/index.html',
  'zhenkongxuangaiji/index.html'
];

const CANONICAL_SUB = [
  'tuijianchanpin/gzjscx/index.html',
  'tuijianchanpin/qing-jie-ji-guan-zhaung-ji/index.html',
  'tuijianchanpin/xi-shou-ye-guan-zhuang-ji/index.html',
  'tuijianchanpin/xiao-du-ji-guan-zhuang-ji/index.html',
  'tuijianchanpin/chunjinshui/index.html',
  'tuijianchanpin/kuangquanshui/index.html',
  'tuijianchanpin/hanqiyinliao/index.html',
  'tuijianchanpin/5jialundatongshui/index.html',
  'tuijianchanpin/bolipinyinliao/index.html',
  'tuijianchanpin/dapinshui/index.html',
  'tuijianchanpin/yilaguanyinliao/index.html',
  'tuijianchanpin/guozhiyinliao/index.html'
];

function extractNav(html) {
  const box = html.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/i);
  if (!box) return null;
  const main = [];
  const sub = [];
  const reH3 = /<h3[^>]*><a[^>]*href=['"]([^'"]+)['"]/gi;
  const reLi = /<li class="subclass"><a[^>]*href=['"]([^'"]+)['"]/gi;
  let m;
  while ((m = reH3.exec(box[1]))) main.push(m[1].replace(/^\.\//, ''));
  while ((m = reLi.exec(box[1]))) sub.push(m[1].replace(/^\.\//, ''));
  return { main, sub };
}

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
}

const files = [];
walk(path.join(root, 'product'), files);
const mismatches = [];

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  if (!html.includes('nva_box')) continue;
  const nav = extractNav(html);
  if (!nav) continue;
  const rel = path.relative(path.join(root, 'product'), f).replace(/\\/g, '/');
  const mainKey = nav.main.join('|');
  const subKey = nav.sub.join('|');
  const canonMain = CANONICAL_MAIN.join('|');
  const canonSub = CANONICAL_SUB.join('|');
  if (mainKey !== canonMain) {
    mismatches.push({ file: 'product/' + rel, type: 'main', got: nav.main, want: CANONICAL_MAIN });
  }
  if (subKey !== canonSub && nav.sub.length > 0) {
    mismatches.push({ file: 'product/' + rel, type: 'sub', got: nav.sub, want: CANONICAL_SUB });
  }
}

console.log('Nav mismatches:', mismatches.length);
mismatches.slice(0, 20).forEach((m) => {
  console.log('\n', m.file, m.type);
  const got = m.got;
  const want = m.want;
  for (let i = 0; i < Math.max(got.length, want.length); i++) {
    if (got[i] !== want[i]) console.log(' ', i, got[i] || '-', '!=', want[i] || '-');
  }
});
