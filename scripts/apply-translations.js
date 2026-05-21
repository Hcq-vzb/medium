/**
 * Replace Chinese text in all HTML with English; generate kiwl-i18n-en-ar.js for lang switcher
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dictPath = path.join(root, 'statics', 'js', 'kiwl-translations.json');
const outJs = path.join(root, 'statics', 'js', 'kiwl-i18n-en-ar.js');

if (!fs.existsSync(dictPath)) {
  console.error('Missing', dictPath, '- run batch-translate.js first');
  process.exit(1);
}

const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
const zhKeys = Object.keys(dict).sort((a, b) => b.length - a.length);

const enToAr = {};
for (const zh of zhKeys) {
  const en = dict[zh].en;
  const ar = dict[zh].ar;
  if (en && ar && en !== ar) enToAr[en] = ar;
}

function walk(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === 'scripts') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
  return list;
}

let fileCount = 0;
let replaceCount = 0;

for (const file of walk(root)) {
  let raw = fs.readFileSync(file, 'utf8');
  const orig = raw;
  for (const zh of zhKeys) {
    const en = dict[zh].en;
    if (!en || zh === en) continue;
    const before = raw;
    raw = raw.split(zh).join(en);
    if (raw !== before) replaceCount += (before.split(zh).length - 1);
  }
  if (raw !== orig) {
    fs.writeFileSync(file, raw, 'utf8');
    fileCount++;
  }
}

const js =
  '/* Auto-generated EN->AR map for kiwl lang switcher */\n' +
  'window.KIWL_I18N_EN_AR = ' +
  JSON.stringify(enToAr) +
  ';\n';
fs.writeFileSync(outJs, js, 'utf8');

console.log('Updated', fileCount, 'HTML files,', replaceCount, 'replacements');
console.log('Wrote', outJs, 'keys:', Object.keys(enToAr).length);
