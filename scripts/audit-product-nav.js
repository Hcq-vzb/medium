const fs = require('fs');
const path = require('path');

const PRODUCT_NAV = {
  "tuijianchanpin/index.html": "Featured Products",
  "guozhiguanzhuangji/index.html": "Juice Filling Machine",
  "hqylgzj/index.html": "Carbonated Beverage Filling Machine",
  "datongshuiguanzhuangji/index.html": "Barrel Water Filling Machine",
  "shuichulishebei/index.html": "Water Treatment Equipment",
  "youguanzhuangji/index.html": "Oil Filling Machine",
  "mobaoji/index.html": "Shrink Wrapping Machine",
  "chuipingji/index.html": "Blow Molding Machine",
  "zhusuji/index.html": "Injection Molding Machine",
  "guanzhuangjipeijian/index.html": "Filling Machine Spare Parts",
  "pijiuguanzhuangji/index.html": "Beer Filling Machine",
  "shuiguanzhuangji/index.html": "Water Filling Machine",
  "tiebiaoji/index.html": "Labeling Machine",
  "cuogaiji/index.html": "Cap Twisting Machine",
  "fegnmiguanzhuangji/index.html": "Honey Filling Machine",
  "xipingji/index.html": "Bottle Rinsing Machine",
  "zhenkongxuangaiji/index.html": "Vacuum Capping Machine"
};

const SUB_NAV = {
  "tuijianchanpin/gzjscx/index.html": "Filling Production Line",
  "tuijianchanpin/qing-jie-ji-guan-zhaung-ji/index.html": "Detergent Filling Machine",
  "tuijianchanpin/xi-shou-ye-guan-zhuang-ji/index.html": "Hand Sanitizer Filling Machine",
  "tuijianchanpin/xiao-du-ji-guan-zhuang-ji/index.html": "Disinfectant Filling Machine",
  "tuijianchanpin/chunjinshui/index.html": "Purified Water Filling Machine",
  "tuijianchanpin/kuangquanshui/index.html": "Mineral Water Filling Machine",
  "tuijianchanpin/hanqiyinliao/index.html": "Carbonated Beverage Filler",
  "tuijianchanpin/5jialundatongshui/index.html": "5-Gallon Barrel Water Filling Machine",
  "tuijianchanpin/bolipinyinliao/index.html": "Glass Bottle Beverage Filling Machine",
  "tuijianchanpin/dapinshui/index.html": "Large Bottle Water Filling Machine",
  "tuijianchanpin/yilaguanyinliao/index.html": "Aseptic Beverage Filling Machine",
  "tuijianchanpin/guozhiyinliao/index.html": "Juice Beverage Monoblock Filling Machine"
};

function walk(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (name.endsWith('.html')) list.push(p);
  }
  return list;
}

const root = path.join(__dirname, '..', 'product');
const issues = [];
for (const file of walk(root)) {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('nva_box')) continue;
  const rel = path.relative(root, file).replace(/\\/g, '/');
  for (const [href, label] of Object.entries(PRODUCT_NAV)) {
    if (!html.includes(href)) continue;
    const re = new RegExp(`href=['"]${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"][^>]*>([^<]*)<`);
    const m = html.match(re);
    if (m && m[1].trim() !== label) {
      issues.push({ file: rel, href, got: m[1].trim(), want: label });
    }
  }
}

console.log('Nav label mismatches:', issues.length);
issues.slice(0, 30).forEach((i) => console.log(JSON.stringify(i)));

const titles = new Map();
for (const file of walk(root)) {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('nva_box')) continue;
  const re = /<h3[^>]*><a[^>]*title='([^']*)'[^>]*>([^<]*)<\/a><\/h3>/g;
  let m;
  while ((m = re.exec(html))) titles.set(m[1], (titles.get(m[1]) || 0) + 1);
}
console.log('\nUnique h3 titles:');
[...titles.entries()].sort((a, b) => b[1] - a[1]).forEach(([t, c]) => console.log(c, t));

// grep weird patterns
const weird = /Machine Treatment|Equipment Machine|Treatment Machine|Juice Filler[^i]|Capping<\/a>/;
for (const file of walk(root)) {
  const html = fs.readFileSync(file, 'utf8');
  if (html.includes('nva_box') && weird.test(html)) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    const hits = [...html.matchAll(/<h3[^>]*>[\s\S]*?<\/h3>/g)].map((x) => x[0].replace(/\s+/g, ' ')).filter((x) => weird.test(x));
    if (hits.length) console.log(rel, hits[0].slice(0, 120));
  }
}
