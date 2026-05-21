const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const CANON = [
  'tuijianchanpin',
  'guozhiguanzhuangji',
  'hqylgzj',
  'datongshuiguanzhuangji',
  'shuichulishebei',
  'youguanzhuangji',
  'mobaoji',
  'chuipingji',
  'zhusuji',
  'guanzhuangjipeijian',
  'pijiuguanzhuangji',
  'shuiguanzhuangji',
  'tiebiaoji',
  'cuogaiji',
  'fegnmiguanzhuangji',
  'xipingji',
  'zhenkongxuangaiji'
];

const CANON_SUB = [
  'gzjscx',
  'qing-jie-ji-guan-zhaung-ji',
  'xi-shou-ye-guan-zhuang-ji',
  'xiao-du-ji-guan-zhuang-ji',
  'chunjinshui',
  'kuangquanshui',
  'hanqiyinliao',
  '5jialundatongshui',
  'bolipinyinliao',
  'dapinshui',
  'yilaguanyinliao',
  'guozhiyinliao'
];

function slugFromHref(href, fileDir) {
  let h = href.replace(/^\.\//, '').replace(/^(\.\.\/)+/, '');
  if (h === 'index.html' || h.endsWith('/index.html') && !h.includes('/')) {
    const parts = fileDir.replace(/\\/g, '/').split('/');
    const cat = parts[parts.length - 1];
    if (parts[parts.length - 2] === 'tuijianchanpin') return 'tuijianchanpin/' + cat;
    return cat;
  }
  if (h.endsWith('/index.html')) h = h.slice(0, -11);
  return h.replace(/^tuijianchanpin\//, 'tuijianchanpin/');
}

function mainSlug(href, fileDir) {
  let h = href.replace(/^\.\//, '').replace(/^(\.\.\/)+/, '');
  if (h === 'index.html') {
    const parts = fileDir.replace(/\\/g, '/').split('/');
    return parts[parts.length - 1];
  }
  if (h.endsWith('/index.html')) return h.slice(0, -11);
  return h;
}

function subSlug(href, fileDir) {
  let h = href.replace(/^\.\//, '').replace(/^(\.\.\/)+/, '');
  if (h === 'index.html') {
    const parts = fileDir.replace(/\\/g, '/').split('/');
    if (parts[parts.length - 2] === 'tuijianchanpin') return parts[parts.length - 1];
  }
  if (h.includes('/')) {
    const segs = h.split('/');
    return segs[segs.length - 2] === 'tuijianchanpin' ? segs[segs.length - 1] : segs.join('/');
  }
  return h.replace(/\/index\.html$/, '');
}

function extractNav(html) {
  const box = html.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/i);
  if (!box) return null;
  const main = [];
  const sub = [];
  let m;
  const reH3 = /<h3[^>]*><a[^>]*href=['"]([^'"]+)['"]/gi;
  const reLi = /<li class="subclass"><a[^>]*href=['"]([^'"]+)['"]/gi;
  while ((m = reH3.exec(box[1]))) main.push(m[1]);
  while ((m = reLi.exec(box[1]))) sub.push(m[1]);
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
const mainBad = [];
const subBad = [];

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  if (!html.includes('nva_box')) continue;
  const nav = extractNav(html);
  const dir = path.dirname(f);
  const mains = nav.main.map((h) => mainSlug(h, dir));
  const subs = nav.sub.map((h) => subSlug(h, dir));

  if (JSON.stringify(mains) !== JSON.stringify(CANON)) {
    mainBad.push({ file: path.relative(root, f).replace(/\\/g, '/'), mains });
  }
  if (subs.length && JSON.stringify(subs) !== JSON.stringify(CANON_SUB)) {
    subBad.push({ file: path.relative(root, f).replace(/\\/g, '/'), subs });
  }
}

console.log('Main slug order wrong:', mainBad.length);
mainBad.slice(0, 5).forEach((b) => {
  console.log(b.file);
  for (let i = 0; i < CANON.length; i++) {
    if (CANON[i] !== b.mains[i]) console.log(' ', i, CANON[i], '->', b.mains[i]);
  }
});
console.log('Sub slug order wrong:', subBad.length);
subBad.slice(0, 5).forEach((b) => {
  console.log(b.file);
  for (let i = 0; i < CANON_SUB.length; i++) {
    if (CANON_SUB[i] !== b.subs[i]) console.log(' ', i, CANON_SUB[i], '->', b.subs[i]);
  }
});
