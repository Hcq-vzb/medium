/**
 * Fix product sidebar nav labels + inject product-nav-fix.css
 * Phase 1: index.html | Phase 2: all product HTML with nva_box
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const CSS_MARKER = 'product-nav-fix.css';

const TEXT_FIXES = [
  ["title='Juice Filler'>Juice Filler", "title='Juice Filling Machine'>Juice Filling Machine"],
  ['title="Juice Filler">Juice Filler', 'title="Juice Filling Machine">Juice Filling Machine'],
  ["title='Capping'>Capping", "title='Vacuum Capping Machine'>Vacuum Capping Machine"],
  ['title="Capping">Capping', 'title="Vacuum Capping Machine">Vacuum Capping Machine'],
  [
    'href="index.html" title="Filling Machine">· Filling Machine</a></li> <li class="subclass"><a href="../qing-jie-ji-guan-zhaung-ji/index.html"',
    'href="index.html" title="Detergent Filling Machine">· Detergent Filling Machine</a></li> <li class="subclass"><a href="../qing-jie-ji-guan-zhaung-ji/index.html"'
  ],
  [
    "href='index.html' title='Filling Machine'>· Filling Machine</a></li> <li class='subclass'><a href='../qing-jie-ji-guan-zhaung-ji/index.html'",
    "href='index.html' title='Detergent Filling Machine'>· Detergent Filling Machine</a></li> <li class='subclass'><a href='../qing-jie-ji-guan-zhaung-ji/index.html'"
  ],
  [
    'href="index.html" title="Filling Machine">· Filling Machine</a></li> <li class="subclass"><a href="../xi-shou-ye-guan-zhuang-ji/index.html"',
    'href="index.html" title="Hand Sanitizer Filling Machine">· Hand Sanitizer Filling Machine</a></li> <li class="subclass"><a href="../xi-shou-ye-guan-zhuang-ji/index.html"'
  ],
  [
    'href="index.html" title="Filling Machine">· Filling Machine</a></li> <li class="subclass"><a href="../xiao-du-ji-guan-zhuang-ji/index.html"',
    'href="index.html" title="Disinfectant Filling Machine">· Disinfectant Filling Machine</a></li> <li class="subclass"><a href="../xiao-du-ji-guan-zhuang-ji/index.html"'
  ],
  [
    'href="index.html" title="Beverage Filling Machine">· Beverage Filling Machine</a></li> <li class="subclass"><a href="../bolipinyinliao/index.html"',
    'href="index.html" title="Glass Bottle Beverage Filling Machine">· Glass Bottle Beverage Filling Machine</a></li> <li class="subclass"><a href="../bolipinyinliao/index.html"'
  ],
  [
    'href="index.html" title="Beverage Filling Machine">· Beverage Filling Machine</a></li> <li class="subclass"><a href="../yilaguanyinliao/index.html"',
    'href="index.html" title="Aseptic Beverage Filling Machine">· Aseptic Beverage Filling Machine</a></li> <li class="subclass"><a href="../yilaguanyinliao/index.html"'
  ]
];

function staticsPrefix(filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  const depth = rel.split('/').length - 1;
  return depth === 0 ? 'statics/' : '../'.repeat(depth) + 'statics/';
}

function injectCss(html, filePath) {
  if (html.includes(CSS_MARKER)) return html;
  const prefix = staticsPrefix(filePath);
  const link = `<link rel="stylesheet" type="text/css" href="${prefix}css/${CSS_MARKER}" />`;
  if (html.includes('module-interactions.css')) {
    return html.replace(
      /(<link[^>]*module-interactions\.css[^>]*>)/i,
      `$1\n${link}`
    );
  }
  if (html.includes('lang.css')) {
    return html.replace(/(<link[^>]*lang\.css[^>]*>)/i, `$1\n${link}`);
  }
  return html.replace(/(<link[^>]*styles\.css[^>]*>)/i, `$1\n${link}`);
}

function applyTextFixes(html) {
  let out = html;
  for (const [from, to] of TEXT_FIXES) {
    out = out.split(from).join(to);
  }
  return out;
}

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const hasNav = html.includes('nva_box') || html.includes('class_bx');
  if (!hasNav) return false;
  const orig = html;
  html = applyTextFixes(html);
  html = injectCss(html, filePath);
  if (html !== orig) {
    fs.writeFileSync(filePath, html, 'utf8');
    return true;
  }
  return false;
}

function walk(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === 'scripts') continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
  return list;
}

const phase = process.argv[2] || 'all';
let files = [];

if (phase === 'index') {
  files = [path.join(root, 'index.html')];
} else if (phase === 'product') {
  files = walk(path.join(root, 'product'));
} else if (phase === 'all-nav') {
  files = walk(root).filter((f) => fs.readFileSync(f, 'utf8').includes('nva_box'));
} else {
  files = walk(root).filter((f) => {
    const html = fs.readFileSync(f, 'utf8');
    return html.includes('nva_box') || (f.endsWith('index.html') && html.includes('class_bx'));
  });
}

let n = 0;
for (const f of files) {
  if (processFile(f)) {
    n++;
    console.log('Updated:', path.relative(root, f));
  }
}
console.log('Done. Updated', n, 'files (phase:', phase + ')');
