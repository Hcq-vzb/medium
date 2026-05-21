const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const CANON_TITLES = [
  'Featured Products',
  'Juice Filling Machine',
  'Carbonated Beverage Filling Machine',
  'Barrel Water Filling Machine',
  'Water Treatment Equipment',
  'Oil Filling Machine',
  'Shrink Wrapping Machine',
  'Blow Molding Machine',
  'Injection Molding Machine',
  'Filling Machine Spare Parts',
  'Beer Filling Machine',
  'Water Filling Machine',
  'Labeling Machine',
  'Cap Twisting Machine',
  'Honey Filling Machine',
  'Bottle Rinsing Machine',
  'Vacuum Capping Machine'
];

const CANON_SUB_TITLES = [
  'Filling Production Line',
  'Detergent Filling Machine',
  'Hand Sanitizer Filling Machine',
  'Disinfectant Filling Machine',
  'Purified Water Filling Machine',
  'Mineral Water Filling Machine',
  'Carbonated Beverage Filler',
  '5-Gallon Barrel Water Filling Machine',
  'Glass Bottle Beverage Filling Machine',
  'Large Bottle Water Filling Machine',
  'Aseptic Beverage Filling Machine',
  'Juice Beverage Monoblock Filling Machine'
];

function extractTitles(html) {
  const box = html.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/i);
  if (!box) return null;
  const main = [...box[1].matchAll(/<h3[^>]*><a[^>]*title=['"]([^'"]+)['"]/gi)].map((m) => m[1]);
  const sub = [...box[1].matchAll(/<li class="subclass"><a[^>]*title=['"]([^'"]+)['"]/gi)].map(
    (m) => m[1]
  );
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
  const t = extractTitles(html);
  if (!t) continue;
  const rel = path.relative(root, f).replace(/\\/g, '/');
  if (JSON.stringify(t.main) !== JSON.stringify(CANON_TITLES)) {
    mainBad.push({ file: rel, main: t.main });
  }
  if (t.sub.length && JSON.stringify(t.sub) !== JSON.stringify(CANON_SUB_TITLES)) {
    subBad.push({ file: rel, sub: t.sub });
  }
}

console.log('Main title order wrong:', mainBad.length);
mainBad.slice(0, 15).forEach((b) => {
  console.log('\n', b.file);
  for (let i = 0; i < CANON_TITLES.length; i++) {
    if (CANON_TITLES[i] !== b.main[i]) {
      console.log(' ', i + 1, 'want:', CANON_TITLES[i], 'got:', b.main[i] || '(missing)');
    }
  }
});
console.log('\nSub title order/text wrong:', subBad.length);
subBad.forEach((b) => {
  console.log(b.file);
  for (let i = 0; i < CANON_SUB_TITLES.length; i++) {
    if (CANON_SUB_TITLES[i] !== b.sub[i]) {
      console.log(' ', i + 1, CANON_SUB_TITLES[i], '->', b.sub[i]);
    }
  }
});
